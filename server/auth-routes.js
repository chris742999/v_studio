
import express from "express";
import { createClient } from "@supabase/supabase-js";
import { pool } from "./db.js";
import {
  authenticateUser,
  requireCustomerPasswordChangeComplete,
} from "./auth-middleware.js";

const router = express.Router();

const supabaseUrl = process.env.SUPABASE_URL;
const serviceRoleKey = process.env.SUPABASE_SERVICE_ROLE_KEY;

const supabaseAdmin =
  supabaseUrl && serviceRoleKey
    ? createClient(supabaseUrl, serviceRoleKey, {
        auth: {
          persistSession: false,
          autoRefreshToken: false,
        },
      })
    : null;

// POST /api/auth/change-password
router.post("/change-password", authenticateUser, async (req, res) => {
  try {
    if (!supabaseAdmin) {
      return res.status(500).json({
        error: "Password changes are not configured.",
      });
    }

    const { password } = req.body ?? {};

    if (typeof password !== "string" || password.length < 12) {
      return res.status(400).json({
        error: "Your new password must contain at least 12 characters.",
      });
    }

    const customerResult = await pool.query(
      `SELECT id
       FROM public.customers
       WHERE auth_user_id = $1
       LIMIT 1`,
      [req.user.id]
    );

    if (customerResult.rows.length === 0) {
      return res.status(403).json({
        error: "This password-change route is for customer accounts.",
      });
    }

    const { data, error } =
      await supabaseAdmin.auth.admin.updateUserById(req.user.id, {
        password,
        app_metadata: {
          ...req.user.app_metadata,
          must_change_password: false,
        },
        user_metadata: {
          ...req.user.user_metadata,
          must_change_password: false,
        },
      });

    if (error || !data.user) {
      console.error("Updating customer password failed:", error?.message);

      return res.status(400).json({
        error: "Unable to update your password.",
      });
    }

    return res.json({
      message: "Password updated successfully. Please sign in again.",
    });
  } catch (error) {
    console.error("Password change failed:", error.message);

    return res.status(500).json({
      error: "Unable to change your password.",
    });
  }
});

// GET /api/auth/customer-session
router.get(
  "/customer-session",
  authenticateUser,
  requireCustomerPasswordChangeComplete,
  async (req, res) => {
    try {
      const result = await pool.query(
        `SELECT id, auth_user_id, full_name, email, phone, created_at
         FROM public.customers
         WHERE auth_user_id = $1
         LIMIT 1`,
        [req.user.id]
      );

      if (result.rows.length === 0) {
        return res.status(404).json({
          error: "Customer profile not found.",
        });
      }

      return res.json({ customer: result.rows[0] });
    } catch (error) {
      console.error("Fetching customer session failed:", error.message);

      return res.status(500).json({
        error: "Unable to retrieve customer information.",
      });
    }
  }
);

export default router;
