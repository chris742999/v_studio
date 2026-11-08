
import express from "express";
import { pool } from "./db.js";
import {
  initiateSTKPush,
  querySTKPush,
} from "./mpesa-service.js";

const router = express.Router();

// Normalize Kenyan phone numbers to 254 format.
function normalizePhone(phone) {
  const digits = String(phone || "").replace(/\D/g, "");

  if (/^254[71]\d{8}$/.test(digits)) return digits;
  if (/^0[71]\d{8}$/.test(digits)) {
    return `254${digits.slice(1)}`;
  }
  if (/^[71]\d{8}$/.test(digits)) {
    return `254${digits}`;
  }

  return null;
}

// POST /api/payments/initiate
// Initiate an STK Push for an existing booking.
router.post("/initiate", async (req, res) => {
  try {
    const { bookingId, phone } = req.body ?? {};

    if (!/^[1-9]\d*$/.test(String(bookingId || ""))) {
      return res.status(400).json({
        error: "Invalid booking reference.",
      });
    }

    const normalizedPhone = normalizePhone(phone);

    if (!normalizedPhone) {
      return res.status(400).json({
        error: "Enter a valid Kenyan M-Pesa phone number.",
      });
    }

    // Retrieve booking and service price.
    const bookingResult = await pool.query(
      `SELECT
         b.id,
         b.full_name,
         b.phone,
         b.service,
         b.status,
         COALESCE(
           s.price_kes,
           (
             SELECT sv.price_kes
             FROM public.services sv
             WHERE LOWER(sv.service_name) = LOWER(b.service)
               AND sv.is_active = TRUE
             LIMIT 1
           )
         ) AS amount
       FROM public.bookings b
       LEFT JOIN public.services s ON s.id = b.service_id
       WHERE b.id = $1`,
      [bookingId]
    );

    if (bookingResult.rows.length === 0) {
      return res.status(404).json({
        error: "Booking not found.",
      });
    }

    const booking = bookingResult.rows[0];

    // Ensure the payment phone matches the booking phone.
    if (normalizePhone(booking.phone) !== normalizedPhone) {
      return res.status(403).json({
        error: "The phone number does not match this booking.",
      });
    }

    if (booking.status === "cancelled") {
      return res.status(400).json({
        error: "Payment cannot be made for a cancelled booking.",
      });
    }

    // Validate service price.
    if (
      booking.amount === null ||
      !Number.isFinite(Number(booking.amount)) ||
      Number(booking.amount) <= 0
    ) {
      return res.status(400).json({
        error: "A valid service price has not been configured.",
      });
    }

    const amount = Math.round(Number(booking.amount));

    if (!Number.isSafeInteger(amount) || amount < 1) {
      return res.status(400).json({
        error: "Invalid booking payment amount.",
      });
    }

    // Prevent another payment attempt if already paid.
    const existingPayment = await pool.query(
      `SELECT id
       FROM public.payments
       WHERE booking_id = $1
         AND status = 'success'
       LIMIT 1`,
      [booking.id]
    );

    if (existingPayment.rows.length > 0) {
      return res.status(400).json({
        error: "This booking has already been paid for.",
      });
    }

    // Create pending payment record.
    const paymentResult = await pool.query(
      `INSERT INTO public.payments
         (booking_id, phone_number, amount, status)
       VALUES ($1, $2, $3, 'pending')
       RETURNING id`,
      [booking.id, normalizedPhone, amount]
    );

    const paymentId = paymentResult.rows[0].id;

    try {
      // Send STK Push to customer's phone.
      const stkResponse = await initiateSTKPush({
        phone: normalizedPhone,
        amount,
        bookingId: booking.id,
      });

      // Store Safaricom request identifiers.
      await pool.query(
        `UPDATE public.payments
         SET merchant_request_id = $1,
             checkout_request_id = $2,
             updated_at = NOW()
         WHERE id = $3`,
        [
          stkResponse.MerchantRequestID,
          stkResponse.CheckoutRequestID,
          paymentId,
        ]
      );

      return res.json({
        message: "Payment prompt sent. Check your phone.",
        paymentId,
        amount,
      });
    } catch (error) {
      await pool.query(
        `UPDATE public.payments
         SET status = 'failed',
             result_description = $1,
             updated_at = NOW()
         WHERE id = $2`,
        [error.message, paymentId]
      );

      throw error;
    }
  } catch (error) {
    console.error(
      "M-Pesa initiation failed:",
      error.message
    );

    return res.status(500).json({
      error: "Unable to initiate M-Pesa payment.",
    });
  }
});

// POST /api/payments/callback
// Receive and verify Safaricom payment results.
router.post("/callback", async (req, res) => {
  try {
    const callback = req.body?.Body?.stkCallback;

    if (!callback?.CheckoutRequestID) {
      return res.status(400).json({
        ResultCode: 1,
        ResultDesc: "Invalid callback.",
      });
    }

    const checkoutRequestId = callback.CheckoutRequestID;

    // Find the corresponding payment.
    const paymentResult = await pool.query(
      `SELECT
         id,
         booking_id,
         phone_number,
         amount,
         status
       FROM public.payments
       WHERE checkout_request_id = $1`,
      [checkoutRequestId]
    );

    if (paymentResult.rows.length === 0) {
      return res.json({
        ResultCode: 0,
        ResultDesc: "Unknown payment callback ignored.",
      });
    }

    const payment = paymentResult.rows[0];

    // Ignore duplicate callbacks.
    if (payment.status !== "pending") {
      return res.json({
        ResultCode: 0,
        ResultDesc: "Payment already processed.",
      });
    }

    // Verify transaction directly with Safaricom.
    const verification = await querySTKPush(
      checkoutRequestId
    );

    // No final result yet: leave payment pending.
    if (
      verification.ResultCode === undefined ||
      verification.ResultCode === null ||
      verification.ResultCode === ""
    ) {
      return res.json({
        ResultCode: 0,
        ResultDesc: "Payment is still being processed.",
      });
    }

    const verificationCode = Number(
      verification.ResultCode
    );

    if (!Number.isInteger(verificationCode)) {
      return res.json({
        ResultCode: 0,
        ResultDesc: "Payment result is not yet conclusive.",
      });
    }

    // Record a confirmed unsuccessful transaction.
    if (verificationCode !== 0) {
      await pool.query(
        `UPDATE public.payments
         SET status = 'failed',
             result_code = $1,
             result_description = $2,
             updated_at = NOW()
         WHERE checkout_request_id = $3
           AND status = 'pending'`,
        [
          verificationCode,
          verification.ResultDesc ||
            "Safaricom confirmed that payment failed.",
          checkoutRequestId,
        ]
      );

      return res.json({
        ResultCode: 0,
        ResultDesc: "Failed payment recorded.",
      });
    }

    // Extract transaction details from callback metadata.
    const items = callback.CallbackMetadata?.Item || [];

    const getItem = (name) =>
      items.find((item) => item.Name === name)?.Value ?? null;

    const receiptNumber = getItem("MpesaReceiptNumber");
    const paidAmount = Number(getItem("Amount"));
    const paidPhone = String(
      getItem("PhoneNumber") || ""
    );

    // Check transaction details against our payment record.
    if (
      !receiptNumber ||
      paidAmount !== Number(payment.amount) ||
      paidPhone !== payment.phone_number
    ) {
      console.error(
        "M-Pesa transaction details require verification:",
        checkoutRequestId
      );

      // Keep pending for further investigation.
      return res.json({
        ResultCode: 0,
        ResultDesc: "Payment details require further verification.",
      });
    }

    // Record successful payment only if still pending.
    const updateResult = await pool.query(
      `UPDATE public.payments
       SET status = 'success',
           result_code = 0,
           result_description = $1,
           mpesa_receipt_number = $2,
           updated_at = NOW()
       WHERE checkout_request_id = $3
         AND status = 'pending'
       RETURNING id`,
      [
        "Payment verified successfully with Safaricom.",
        receiptNumber,
        checkoutRequestId,
      ]
    );

    return res.json({
      ResultCode: 0,
      ResultDesc: updateResult.rowCount > 0
        ? "Verified payment recorded successfully."
        : "Payment was already processed.",
    });
  } catch (error) {
    console.error(
      "M-Pesa callback processing failed:",
      error.message
    );

    return res.status(500).json({
      ResultCode: 1,
      ResultDesc: "Callback processing failed.",
    });
  }
});

export default router;
