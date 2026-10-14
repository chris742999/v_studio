
import express from "express";
import { pool } from "./db.js";

const router = express.Router();

const ALLOWED_SERVICES = [
  "Wedding Photography",
  "Graduation Photography",
  "Birthday Photography",
  "Studio Portraits",
  "Corporate Photography",
  "Product Photography",
  "Drone Photography",
  "Videography",
];

router.post("/", async (req, res) => {
  try {
    const {
      fullName,
      email,
      phone,
      service,
      preferredDate,
      preferredTime = "",
      location = "",
      notes = "",
    } = req.body ?? {};

    if (
      typeof fullName !== "string" ||
      typeof email !== "string" ||
      typeof phone !== "string" ||
      typeof service !== "string" ||
      typeof preferredDate !== "string" ||
      typeof preferredTime !== "string" ||
      typeof location !== "string" ||
      typeof notes !== "string" ||
      !fullName.trim() ||
      !email.trim() ||
      !phone.trim() ||
      !preferredDate.trim()
    ) {
      return res.status(400).json({
        error: "Please provide all required booking details.",
      });
    }

    if (
      fullName.trim().length > 150 ||
      email.trim().length > 255 ||
      phone.trim().length > 30 ||
      location.trim().length > 255 ||
      notes.length > 5000
    ) {
      return res.status(400).json({
        error: "One or more booking fields are too long.",
      });
    }

    if (!/^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(email.trim())) {
      return res.status(400).json({
        error: "Please provide a valid email address.",
      });
    }

    if (!ALLOWED_SERVICES.includes(service)) {
      return res.status(400).json({
        error: "Please select a valid Visionary Studios service.",
      });
    }

    if (!/^\d{4}-\d{2}-\d{2}$/.test(preferredDate)) {
      return res.status(400).json({
        error: "Please provide a valid preferred date.",
      });
    }

    const date = new Date(`${preferredDate}T00:00:00.000Z`);

    if (
      Number.isNaN(date.getTime()) ||
      date.toISOString().slice(0, 10) !== preferredDate
    ) {
      return res.status(400).json({
        error: "Please provide a valid calendar date.",
      });
    }

    if (
      preferredTime &&
      !/^([01]\d|2[0-3]):[0-5]\d$/.test(preferredTime)
    ) {
      return res.status(400).json({
        error: "Please provide a valid preferred time.",
      });
    }

    const result = await pool.query(
      `INSERT INTO public.bookings
        (
          full_name,
          email,
          phone,
          service,
          preferred_date,
          preferred_time,
          location,
          notes
        )
       VALUES ($1, $2, $3, $4, $5, $6, $7, $8)
       RETURNING
         id,
         full_name,
         service,
         preferred_date,
         preferred_time,
         location,
         status,
         created_at`,
      [
        fullName.trim(),
        email.trim().toLowerCase(),
        phone.trim(),
        service,
        preferredDate,
        preferredTime || null,
        location.trim() || null,
        notes.trim() || null,
      ]
    );

    return res.status(201).json({
      message: "Booking request submitted successfully.",
      booking: result.rows[0],
    });
  } catch (error) {
    console.error("Booking creation failed:", error.message);

    return res.status(500).json({
      error: "Unable to submit your booking right now.",
    });
  }
});

export default router;
