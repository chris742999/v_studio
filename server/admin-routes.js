
import express from "express";
import { pool } from "./db.js";
import {
  authenticateUser,
  requireAdmin,
} from "./auth-middleware.js";

const router = express.Router();

// Every route in this file requires a verified admin.
router.use(authenticateUser, requireAdmin);

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

    res.json({ bookings: result.rows });
  } catch (error) {
    console.error("Fetching admin bookings failed:", error.message);

    res.status(500).json({
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

    res.json({
      message: "Booking status updated successfully.",
      booking: result.rows[0],
    });
  } catch (error) {
    console.error("Updating booking status failed:", error.message);

    res.status(500).json({
      error: "Unable to update booking status.",
    });
  }
});

export default router;
