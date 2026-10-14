import { CheckCircle2 } from "lucide-react";

export default function SuccessModal({
  open,
  onClose,
}) {
  if (!open) return null;

  return (
    <div className="fixed inset-0 bg-black/70 backdrop-blur-sm flex items-center justify-center z-50">

      <div className="bg-[#081018] border border-cyan-500/30 rounded-3xl p-10 w-[420px] text-center animate-[popup_.4s_ease]">

        <CheckCircle2
          size={90}
          className="mx-auto text-green-400 mb-6"
        />

        <h2 className="text-3xl font-bold mb-4">
          Booking Submitted!
        </h2>

        <p className="text-gray-400 leading-8 mb-8">
          Thank you for choosing Visionary Studios.
          Our team will contact you shortly to confirm your booking.
        </p>

        <button
          onClick={onClose}
          className="w-full py-4 rounded-xl bg-gradient-to-r from-cyan-500 to-violet-600 hover:scale-105 transition"
        >
          Awesome!
        </button>

      </div>

    </div>
  );
}