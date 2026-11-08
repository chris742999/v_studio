
import express from "express";
import { createClient } from "@supabase/supabase-js";
import { randomBytes } from "node:crypto";
import { pool } from "./db.js";
import {
  authenticateUser,
  requireAdmin,
} from "./auth-middleware.js";
import { sendStaffAssignmentEmail } from "./email-service.js";

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
// --------------------------------------------------
// STAFF MANAGEMENT
// --------------------------------------------------

// GET /api/admin/staff
// Retrieve all staff members.
router.get("/staff", async (req, res) => {
  try {
    const result = await pool.query(`
      SELECT *
      FROM public.staff
      ORDER BY created_at DESC
    `);

    res.json({ staff: result.rows });
  } catch (error) {
    console.error("Error loading staff:", error);
    res.status(500).json({ error: "Unable to load staff members." });
  }
});

// POST /api/admin/staff
// Register a new staff member.
router.post("/staff", async (req, res) => {
  try {
    const { full_name, email, phone, position } = req.body;

    const allowedPositions = [
      "Photographer",
      "Videographer",
      "Drone Operator",
      "Photography Assistant",
    ];

    if (
      !full_name?.trim() ||
      !email?.trim() ||
      !phone?.trim() ||
      !position
    ) {
      return res.status(400).json({
        error: "Full name, email, phone and position are required.",
      });
    }

    if (!allowedPositions.includes(position)) {
      return res.status(400).json({
        error: "Please select a valid staff position.",
      });
    }

    const result = await pool.query(
      `INSERT INTO public.staff
        (full_name, email, phone, position)
       VALUES ($1, $2, $3, $4)
       RETURNING *`,
      [
        full_name.trim(),
        email.trim().toLowerCase(),
        phone.trim(),
        position,
      ]
    );

    res.status(201).json({ staff: result.rows[0] });
  } catch (error) {
    if (error.code === "23505") {
      return res.status(409).json({
        error: "A staff member with this email already exists.",
      });
    }

    console.error("Error creating staff:", error);
    res.status(500).json({ error: "Unable to register staff member." });
  }
});

// PATCH /api/admin/staff/:id
// Update staff details.
router.patch("/staff/:id", async (req, res) => {
  try {
    const staffId = Number(req.params.id);
    const { full_name, email, phone, position } = req.body;

    const allowedPositions = [
      "Photographer",
      "Videographer",
      "Drone Operator",
      "Photography Assistant",
    ];

    if (!Number.isSafeInteger(staffId) || staffId <= 0) {
      return res.status(400).json({ error: "Invalid staff ID." });
    }

    if (
      !full_name?.trim() ||
      !email?.trim() ||
      !phone?.trim() ||
      !allowedPositions.includes(position)
    ) {
      return res.status(400).json({
        error: "Please provide valid staff details.",
      });
    }

    const result = await pool.query(
      `UPDATE public.staff
       SET full_name = $1,
           email = $2,
           phone = $3,
           position = $4,
           updated_at = NOW()
       WHERE id = $5
       RETURNING *`,
      [
        full_name.trim(),
        email.trim().toLowerCase(),
        phone.trim(),
        position,
        staffId,
      ]
    );

    if (result.rows.length === 0) {
      return res.status(404).json({ error: "Staff member not found." });
    }

    res.json({ staff: result.rows[0] });
  } catch (error) {
    if (error.code === "23505") {
      return res.status(409).json({
        error: "Another staff member already uses this email.",
      });
    }

    console.error("Error updating staff:", error);
    res.status(500).json({ error: "Unable to update staff member." });
  }
});

// PATCH /api/admin/staff/:id/status
// Activate or deactivate a staff member.
router.patch("/staff/:id/status", async (req, res) => {
  try {
    const staffId = Number(req.params.id);
    const { status } = req.body;

    if (!Number.isSafeInteger(staffId) || staffId <= 0) {
      return res.status(400).json({ error: "Invalid staff ID." });
    }

    if (!["active", "inactive"].includes(status)) {
      return res.status(400).json({
        error: "Status must be active or inactive.",
      });
    }

    const result = await pool.query(
      `UPDATE public.staff
       SET status = $1,
           updated_at = NOW()
       WHERE id = $2
       RETURNING *`,
      [status, staffId]
    );

    if (result.rows.length === 0) {
      return res.status(404).json({ error: "Staff member not found." });
    }

    res.json({ staff: result.rows[0] });
  } catch (error) {
    console.error("Error changing staff status:", error);
    res.status(500).json({ error: "Unable to update staff status." });
  }
});
// --------------------------------------------------
// BOOKING STAFF ASSIGNMENTS
// --------------------------------------------------

// POST /api/admin/bookings/:id/assignments
// Save or update staff assignments for a booking.
// GET /api/admin/bookings/:id/assignments
// Retrieve staff assignments for a booking.
router.get("/bookings/:id/assignments", async (req, res) => {
  try {
    const bookingId = req.params.id;

    if (!/^[1-9]\d*$/.test(bookingId)) {
      return res.status(400).json({
        error: "Invalid booking ID.",
      });
    }

    const result = await pool.query(
      `SELECT
         ba.id,
         ba.booking_id,
         ba.staff_id,
         ba.responsibility,
         ba.status,
         s.full_name,
         s.email,
         s.position
       FROM public.booking_assignments ba
       JOIN public.staff s ON s.id = ba.staff_id
       WHERE ba.booking_id = $1
         AND ba.status <> 'cancelled'
       ORDER BY ba.assigned_at`,
      [bookingId]
    );

    return res.json({
      assignments: result.rows,
    });
  } catch (error) {
    console.error("Loading booking assignments failed:", error);

    return res.status(500).json({
      error: "Unable to retrieve booking assignments.",
    });
  }
});

router.post("/bookings/:id/assignments", async (req, res) => {
  const client = await pool.connect();

  try {
    const bookingId = req.params.id;
    const { assignments } = req.body ?? {};

    if (!/^[1-9]\d*$/.test(bookingId)) {
      return res.status(400).json({
        error: "Invalid booking ID.",
      });
    }

    if (
      !Array.isArray(assignments) ||
      assignments.length === 0
    ) {
      return res.status(400).json({
        error: "Select at least one staff member.",
      });
    }

    const staffIds = assignments.map((item) =>
      String(item.staffId)
    );

    if (
      staffIds.some((id) => !/^[1-9]\d*$/.test(id)) ||
      new Set(staffIds).size !== staffIds.length ||
      assignments.some(
        (item) =>
          typeof item.responsibility !== "string" ||
          !item.responsibility.trim()
      )
    ) {
      return res.status(400).json({
        error: "Invalid staff assignment details.",
      });
    }

    await client.query("BEGIN");

    // Retrieve booking details for the staff emails.
    const bookingResult = await client.query(
      `SELECT
         id,
         full_name,
         service,
         preferred_date,
         preferred_time,
         location
       FROM public.bookings
       WHERE id = $1
       FOR UPDATE`,
      [bookingId]
    );

    if (bookingResult.rows.length === 0) {
      await client.query("ROLLBACK");

      return res.status(404).json({
        error: "Booking not found.",
      });
    }

    const booking = bookingResult.rows[0];

    const staffResult = await client.query(
      `SELECT id
       FROM public.staff
       WHERE id = ANY($1::bigint[])
         AND status = 'active'`,
      [staffIds]
    );

    if (staffResult.rows.length !== staffIds.length) {
      await client.query("ROLLBACK");

      return res.status(400).json({
        error: "One or more selected staff members are unavailable.",
      });
    }

    // Cancel previously assigned staff who are no longer selected.
    await client.query(
      `UPDATE public.booking_assignments
       SET status = 'cancelled',
           updated_at = NOW()
       WHERE booking_id = $1
         AND NOT (staff_id = ANY($2::bigint[]))
         AND status <> 'cancelled'`,
      [bookingId, staffIds]
    );

    // Save or update each staff assignment.
    for (const item of assignments) {
      await client.query(
        `INSERT INTO public.booking_assignments
          (booking_id, staff_id, responsibility, status)
         VALUES ($1, $2, $3, 'assigned')
         ON CONFLICT (booking_id, staff_id)
         DO UPDATE SET
           responsibility = EXCLUDED.responsibility,
           status = CASE
             WHEN public.booking_assignments.status = 'cancelled'
             THEN 'assigned'
             ELSE public.booking_assignments.status
           END,
           updated_at = NOW()`,
        [
          bookingId,
          item.staffId,
          item.responsibility.trim(),
        ]
      );
    }

    const savedResult = await client.query(
      `SELECT
         ba.id,
         ba.booking_id,
         ba.staff_id,
         ba.responsibility,
         ba.status,
         s.full_name,
         s.email,
         s.position
       FROM public.booking_assignments ba
       JOIN public.staff s ON s.id = ba.staff_id
       WHERE ba.booking_id = $1
         AND ba.status <> 'cancelled'
       ORDER BY ba.assigned_at`,
      [bookingId]
    );

    // Commit assignments before attempting email delivery.
    await client.query("COMMIT");

    // Send a separate email to each assigned staff member.
    const emailResults = await Promise.allSettled(
      savedResult.rows.map((item) =>
        sendStaffAssignmentEmail({
          staff: {
            full_name: item.full_name,
            email: item.email,
            position: item.position,
          },
          booking,
          assignment: {
            responsibility: item.responsibility,
          },
        })
      )
    );

    const emailNotifications = emailResults.map(
      (result, index) => {
        const staffMember = savedResult.rows[index];

        if (result.status === "fulfilled") {
          return {
            staff: staffMember.full_name,
            email: staffMember.email,
            status: "sent",
          };
        }

        console.error(
          `Email to ${staffMember.email} failed:`,
          result.reason?.message
        );

        return {
          staff: staffMember.full_name,
          email: staffMember.email,
          status: "failed",
          error: result.reason?.message || "Email delivery failed.",
        };
      }
    );

    return res.json({
      message: "Staff assignments saved successfully.",
      assignments: savedResult.rows,
      emailNotifications,
    });
  } catch (error) {
    await client.query("ROLLBACK");

    console.error("Saving staff assignments failed:", error);

    return res.status(500).json({
      error: "Unable to save staff assignments.",
    });
  } finally {
    client.release();
  }
});


export default router;
