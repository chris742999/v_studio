
import { useState } from "react";
import { CheckCircle2, Smartphone, Loader2 } from "lucide-react";

export default function SuccessModal({
  open,
  onClose,
  booking,
}) {
  const [paymentPhone, setPaymentPhone] = useState("");
  const [paying, setPaying] = useState(false);
  const [paymentStatus, setPaymentStatus] = useState("");
  const [errorMessage, setErrorMessage] = useState("");

  if (!open) return null;

  const handlePayment = async () => {
    if (!booking?.id) {
      setErrorMessage("Booking reference is missing. Please contact us.");
      return;
    }

    if (!paymentPhone.trim()) {
      setErrorMessage("Enter the M-Pesa phone number to receive the prompt.");
      return;
    }

    setPaying(true);
    setErrorMessage("");
    setPaymentStatus("");

    try {
      const response = await fetch("/api/payments/initiate", {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
        },
        body: JSON.stringify({
          bookingId: booking.id,
          phone: paymentPhone.trim(),
        }),
      });

      const data = await response.json();

      if (!response.ok) {
        throw new Error(data.error || "Unable to initiate M-Pesa payment.");
      }

      setPaymentStatus(
        "STK Push requested. Check your phone and follow the M-Pesa prompt. Your payment will be confirmed after verification."
      );
    } catch (error) {
      setErrorMessage(
        error.message || "Unable to connect to the payment server."
      );
    } finally {
      setPaying(false);
    }
  };

  return (
    <div className="fixed inset-0 bg-black/70 backdrop-blur-sm flex items-center justify-center z-50 p-4">
      <div className="bg-[#081018] border border-cyan-500/30 rounded-3xl p-8 sm:p-10 w-full max-w-md text-center animate-[popup_.4s_ease]">
        <CheckCircle2
          size={72}
          className="mx-auto text-green-400 mb-5"
        />

        <h2 className="text-3xl font-bold mb-3">
          Booking Submitted!
        </h2>

        <p className="text-gray-400 leading-7 mb-5">
          Thank you for choosing Visionary Studios. Your booking request has been saved.
        </p>

        {booking?.id && (
          <div className="rounded-xl border border-white/10 bg-white/5 p-4 mb-6 text-left">
            <p className="text-sm text-gray-400">Booking reference</p>
            <p className="font-semibold text-cyan-300 mb-3">
              VS{booking.id}
            </p>
            <p className="text-sm text-gray-400">Service</p>
            <p className="font-medium">
              {booking.service}
            </p>
          </div>
        )}

        <div className="text-left mb-5">
          <label
            htmlFor="payment-phone"
            className="block text-sm font-medium text-gray-200 mb-2"
          >
            M-Pesa phone number
          </label>

          <div className="flex items-center gap-2 rounded-xl border border-cyan-500/30 bg-black/30 px-4">
            <Smartphone size={20} className="text-cyan-400" />
            <input
              id="payment-phone"
              type="tel"
              value={paymentPhone}
              onChange={(event) => setPaymentPhone(event.target.value)}
              placeholder="07XXXXXXXX or 2547XXXXXXXX"
              className="w-full bg-transparent py-4 text-white outline-none placeholder:text-gray-500"
              autoComplete="tel"
              disabled={paying || Boolean(paymentStatus)}
            />
          </div>
          <p className="text-xs text-gray-500 mt-2">
            Use the same phone number entered in your booking.
          </p>
        </div>

        {errorMessage && (
          <div
            role="alert"
            className="rounded-xl border border-red-400/30 bg-red-500/10 p-3 mb-4 text-sm text-red-200"
          >
            {errorMessage}
          </div>
        )}

        {paymentStatus && (
          <div
            role="status"
            className="rounded-xl border border-cyan-400/30 bg-cyan-500/10 p-3 mb-4 text-sm text-cyan-100"
          >
            {paymentStatus}
          </div>
        )}

        <button
          onClick={handlePayment}
          disabled={paying || Boolean(paymentStatus)}
          className="w-full flex items-center justify-center gap-2 py-4 rounded-xl bg-gradient-to-r from-cyan-500 to-violet-600 hover:brightness-110 transition disabled:opacity-60 disabled:cursor-not-allowed"
        >
          {paying ? (
            <>
              <Loader2 size={20} className="animate-spin" />
              Requesting payment...
            </>
          ) : paymentStatus ? (
            "Payment Prompt Requested"
          ) : (
            "Pay with M-Pesa"
          )}
        </button>

        <button
          onClick={onClose}
          className="w-full mt-3 py-3 rounded-xl border border-white/10 text-gray-300 hover:bg-white/5 transition"
        >
          Close
        </button>
      </div>
    </div>
  );
}
