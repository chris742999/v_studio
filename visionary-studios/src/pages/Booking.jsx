import { useState } from "react";

import Navbar from "../components/Navbar/Navbar";
import BookingHero from "../components/Booking/BookingHero";
import BookingForm from "../components/Booking/BookingForm";
import BookingSummary from "../components/Booking/BookingSummary";
import FAQ from "../components/Booking/FAQ";
import ContactCTA from "../components/Booking/ContactCTA";
import SuccessModal from "../components/Booking/SuccessModal";
import AnimatedBackground from "../components/Background/AnimatedBackground";


export default function Booking() {
 const [booking, setBooking] = useState({
  name: "",
  email: "",
  phone: "",
  service: "Wedding Photography",
  date: "",
  time: "",
  location: "",
  notes: "",
});

  const [successOpen, setSuccessOpen] = useState(false);

  const handleSubmit = () => {
    // Backend call will go here later
    console.log(booking);

    setSuccessOpen(true);
  };

  return (
    <div className="min-h-screen bg-[#030712] text-white overflow-hidden relative">
        <AnimatedBackground />

      {/* Background Glow */}
      <div className="absolute inset-0 overflow-hidden pointer-events-none">
        <div className="absolute -top-48 -left-48 h-[500px] w-[500px] rounded-full bg-cyan-500/10 blur-[180px]" />

        <div className="absolute bottom-0 right-0 h-[450px] w-[450px] rounded-full bg-violet-600/10 blur-[170px]" />

        <div className="absolute top-1/2 left-1/2 h-[250px] w-[250px] rounded-full bg-blue-500/5 blur-[120px]" />
      </div>

      {/* Grid */}
      <div
        className="absolute inset-0 opacity-[0.04]"
        style={{
          backgroundImage: `
            linear-gradient(rgba(255,255,255,.12) 1px, transparent 1px),
            linear-gradient(90deg, rgba(255,255,255,.12) 1px, transparent 1px)
          `,
          backgroundSize: "60px 60px",
        }}
      />

      <Navbar />

      <main className="relative z-10">

        <BookingHero />

        <section className="max-w-7xl mx-auto px-6 lg:px-10 py-24">

          <div className="grid lg:grid-cols-3 gap-10">

            <div className="lg:col-span-2">

              <BookingForm
                booking={booking}
                setBooking={setBooking}
                onSubmit={handleSubmit}
              />

            </div>

            <BookingSummary booking={booking} />

          </div>

        </section>

        <FAQ />

        <ContactCTA />

      </main>

      <SuccessModal
        open={successOpen}
        onClose={() => setSuccessOpen(false)}
      />

    </div>
  );
}