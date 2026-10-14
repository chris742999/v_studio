import { useEffect, useRef } from "react";
import gsap from "gsap";
import { MapPinned } from "lucide-react";

export default function ContactMap() {
  const mapRef = useRef(null);

  useEffect(() => {
    gsap.fromTo(
      mapRef.current,
      {
        opacity: 0,
        y: 80,
      },
      {
        opacity: 1,
        y: 0,
        duration: 1,
        ease: "power3.out",
      }
    );
  }, []);

  return (
    <section ref={mapRef} className="py-20">
      <div className="rounded-3xl border border-white/10 bg-white/5 backdrop-blur-xl p-6 md:p-8 shadow-2xl shadow-cyan-500/10">

        <div className="flex items-center justify-center gap-3 mb-3">
          <MapPinned className="text-cyan-400" size={30} />
          <h2 className="text-3xl md:text-4xl font-bold">
            Visit Our <span className="text-cyan-400">Studio</span>
          </h2>
        </div>

        <p className="text-center text-gray-400 max-w-2xl mx-auto mb-10">
          We'd love to welcome you to Visionary Studios. Visit us for
          consultations, bookings, or to discuss your next creative project.
        </p>

        <div className="overflow-hidden rounded-2xl border border-cyan-400/20 shadow-lg shadow-cyan-500/20">
          <iframe
            title="Visionary Studios Location"
            src="https://www.google.com/maps?q=Nairobi,Kenya&output=embed"
            width="100%"
            height="500"
            loading="lazy"
            allowFullScreen
            referrerPolicy="no-referrer-when-downgrade"
            className="w-full"
          />
        </div>
      </div>
    </section>
  );
}