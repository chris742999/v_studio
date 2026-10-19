
import express from "express";
import { createClient } from "@supabase/supabase-js";
import { randomBytes } from "node:crypto";
import { pool } from "./db.js";
import {
  authenticateUser,
  requireAdmin,
} from "./auth-middleware.js";

const router = express.Router();

const supabaseAdmin =
  process.env.SUPABASE_URL &&
  process.env.SUPABASE_SERVICE_ROLE_KEY
    ? createClient(
        process.env.SUPABASE_URL,
        process.env.SUPABASE_SERVICE_ROLE_KEY,
        {
          auth: {
            persistSession: false,
            autoRefreshToken: false,
          },
        }
      )
    : null;

// Every route in this file requires a verified administrator.
router.use(authenticateUser, requireAdmin);

// POST /api/admin/customers
// Create a customer account with a temporary password.
router.post("/customers", async (req, res) => {
  let createdAuthUserId = null;

  try {
    if (!supabaseAdmin) {
      return res.status(500).json({
        error: "Customer account creation is not configured.",
      });
    }

    const { full_name, email, phone } = req.body ?? {};

    if (
      typeof full_name !== "string" ||
      !full_name.trim() ||
      typeof email !== "string" ||
      !email.trim()
    ) {
      return res.status(400).json({
        error: "Customer full name and email are required.",
      });
    }

    if (
      phone !== undefined &&
      phone !== null &&
      typeof phone !== "string"
    ) {
      return res.status(400).json({
        error: "Invalid phone number.",
      });
    }

    const normalizedEmail = email.trim().toLowerCase();
    const normalizedName = full_name.trim();
    const normalizedPhone =
      typeof phone === "string" ? phone.trim() || null : null;

    const temporaryPassword = randomBytes(18).toString("base64url");

    const { data: authData, error: authError } =
      await supabaseAdmin.auth.admin.createUser({
        email: normalizedEmail,
        password: temporaryPassword,
        email_confirm: true,
        user_metadata: {
          full_name: normalizedName,
        },
        app_metadata: {
          must_change_password: true,
        },
      });

    if (authError) {
      if (
        authError.message?.toLowerCase().includes("already")
      ) {
        return res.status(409).json({
          error: "An account with this email may already exist.",
        });
      }

      console.error(
        "Creating customer authentication account failed:",
        authError.message
      );

      return res.status(400).json({
        error: "Unable to create the customer account.",
      });
    }

    if (!authData.user?.id) {
      return res.status(500).json({
        error: "The authentication account could not be verified.",
      });
    }

    createdAuthUserId = authData.user.id;

    const customerResult = await pool.query(
      `INSERT INTO public.customers
         (auth_user_id, full_name, email, phone)
       VALUES ($1, $2, $3, $4)
       RETURNING id, auth_user_id, full_name, email, phone, created_at`,
      [
        createdAuthUserId,
        normalizedName,
        normalizedEmail,
        normalizedPhone,
      ]
    );

    return res.status(201).json({
      message: "Customer account created successfully.",
      customer: customerResult.rows[0],
      temporaryPassword,
    });
  } catch (error) {
    console.error(
      "Creating customer account failed:",
      error.message
    );

    // If saving the customer record fails, remove the Auth user.
    if (createdAuthUserId && supabaseAdmin) {
      try {
        const { error: cleanupError } =
          await supabaseAdmin.auth.admin.deleteUser(
            createdAuthUserId
          );

        if (cleanupError) {
          console.error(
            "Customer account cleanup failed:",
            cleanupError.message
          );
        }
      } catch (cleanupError) {
        console.error(
          "Customer account cleanup failed:",
          cleanupError.message
        );
      }
    }

    return res.status(500).json({
      error: "Unable to complete customer account creation.",
    });
  }
});

// GET /api/admin/bookings
router.get("/bookings", async (req, res) => {
  try {
    const result = await pool.query(
      `SELECT
         id,
         full_name,
         email,
         phone,
         service,
         preferred_date,
         preferred_time,
         location,
         notes,
         status,
         created_at
       FROM public.bookings
       ORDER BY created_at DESC`
    );

    return res.json({
      bookings: result.rows,
    });
  } catch (error) {
    console.error(
      "Fetching admin bookings failed:",
      error.message
    );

    return res.status(500).json({
      error: "Unable to retrieve bookings.",
    });
  }
});

// PATCH /api/admin/bookings/:id/status
router.patch("/bookings/:id/status", async (req, res) => {
  try {
    const { id } = req.params;
    const { status } = req.body ?? {};

    if (!/^[1-9]\d*$/.test(id)) {
      return res.status(400).json({
        error: "Invalid booking ID.",
      });
    }

    const allowedStatuses = [
      "pending",
      "confirmed",
      "cancelled",
      "completed",
    ];

    if (!allowedStatuses.includes(status)) {
      return res.status(400).json({
        error: "Invalid booking status.",
      });
    }

    const result = await pool.query(
      `UPDATE public.bookings
       SET status = $1
       WHERE id = $2
       RETURNING id, status`,
      [status, id]
    );

    if (result.rows.length === 0) {
      return res.status(404).json({
        error: "Booking not found.",
      });
    }

    return res.json({
      message: "Booking status updated successfully.",
      booking: result.rows[0],
    });
  } catch (error) {
    console.error(
      "Updating booking status failed:",
      error.message
    );

    return res.status(500).json({
      error: "Unable to update booking status.",
    });
  }
});

export default router;
