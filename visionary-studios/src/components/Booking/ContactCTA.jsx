import { Phone, Mail, MapPin } from "lucide-react";
import { useEffect } from "react";
import { staggerCards } from "../../utils/animations";

import {
  FaInstagram,
  FaFacebookF,
  FaTiktok,
  FaWhatsapp,
} from "react-icons/fa";

export default function ContactCTA() {
    useEffect(() => {
  staggerCards(".contact-card");
}, []);

  return (
    <section className="py-24 relative">

      <div className="max-w-6xl mx-auto px-6">

<div className="contact-card rounded-2xl bg-white/5 border border-white/10 p-6 hover:border-cyan-400 hover:scale-105 transition-all duration-300">
          <h2 className="text-4xl md:text-5xl font-bold mb-4">
            Need Help Booking?
          </h2>

          <p className="text-gray-400 text-lg mb-10 max-w-2xl">
            Our team is always ready to help you choose the perfect
            photography package. Reach out through any of the channels below.
          </p>

          <div className="grid gap-6 md:grid-cols-2 lg:grid-cols-4">

            <Card
              icon={<Phone size={24} />}
              title="Phone"
              value="+254 706 079 245"
            />

            <Card
              icon={<Mail size={24} />}
              title="Email"
              value="chrismusila07@gmail.com"
            />

            <Card
              icon={<MapPin size={24} />}
              title="Location"
              value="Thika, Kenya"
            />

            <Card
              title="Follow Us"
              value="@VisionaryStudios"
              icon={
                <div className="flex gap-4 text-2xl">
                  <FaInstagram className="hover:text-pink-500 transition cursor-pointer" />
                  <FaFacebookF className="hover:text-blue-500 transition cursor-pointer" />
                  <FaWhatsapp className="hover:text-green-500 transition cursor-pointer" />
                  <FaTiktok className="hover:text-white transition cursor-pointer" />
                </div>
              }
            />

          </div>

        </div>

      </div>

    </section>
  );
}

function Card({ icon, title, value }) {
  return (
    <div className="rounded-2xl border border-white/10 bg-[#0B1220]/70 backdrop-blur-lg p-6 transition-all duration-300 hover:-translate-y-2 hover:border-cyan-400 hover:shadow-[0_0_30px_rgba(34,211,238,.25)]">

      <div className="text-cyan-400 text-2xl mb-5">
        {icon}
      </div>

      <h3 className="text-lg font-semibold mb-2">
        {title}
      </h3>

      <p className="text-gray-400 break-words">
        {value}
      </p>

    </div>
  );
}