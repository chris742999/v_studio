
import { Resend } from "resend";

function escapeHtml(value = "") {
  return String(value).replace(/[&<>"']/g, (character) => {
    const entities = {
      "&": "&amp;",
      "<": "&lt;",
      ">": "&gt;",
      '"': "&quot;",
      "'": "&#39;",
    };

    return entities[character];
  });
}

export async function sendStaffAssignmentEmail({
  staff,
  booking,
  assignment,
}) {
  if (!process.env.RESEND_API_KEY) {
    throw new Error("RESEND_API_KEY is not configured.");
  }

  const resend = new Resend(process.env.RESEND_API_KEY);

  const { data, error } = await resend.emails.send({
    from: "Visionary Studios <onboarding@resend.dev>",
    to: [staff.email],
    subject: `New Booking Assignment - Visionary Studios`,
    html: `
      <div style="font-family: Arial, sans-serif; max-width: 600px; margin: auto; padding: 24px; color: #172033;">
        <h2 style="color: #1769aa;">Visionary Studios</h2>
        <h3>New Booking Assignment</h3>

        <p>Hello ${escapeHtml(staff.full_name)},</p>

        <p>You have been assigned to a new booking. Here are your details:</p>

        <h3>Booking Information</h3>
        <p><strong>Booking Reference:</strong> #VS-${escapeHtml(booking.id)}</p>
        <p><strong>Customer:</strong> ${escapeHtml(booking.full_name)}</p>
        <p><strong>Service:</strong> ${escapeHtml(booking.service)}</p>
        <p><strong>Date:</strong> ${escapeHtml(booking.preferred_date)}</p>
        <p><strong>Time:</strong> ${escapeHtml(booking.preferred_time || "Not specified")}</p>
        <p><strong>Location:</strong> ${escapeHtml(booking.location || "Not specified")}</p>

        <h3>Your Responsibility</h3>
        <p>${escapeHtml(assignment.responsibility)}</p>

        <p><strong>Assignment Status:</strong> Assigned</p>

        <p>Please contact the Visionary Studios administration if you need clarification.</p>

        <p>Regards,<br/><strong>Visionary Studios Team</strong></p>
      </div>
    `,
  });

  if (error) {
    throw new Error(error.message || "Unable to send staff assignment email.");
  }

  return data;
}
