import { useRef, useEffect } from "react";
import { fadeLeft } from "../../utils/animations";

import {
  Calendar,
  Clock,
  MapPin,
  User,
  Mail,
  Phone,
  Camera,
  FileText,
} from "lucide-react";

const services = [
  { name: "Wedding Photography", price: 35000 },
  { name: "Graduation Photography", price: 12000 },
  { name: "Birthday Photography", price: 15000 },
  { name: "Studio Portraits", price: 8000 },
  { name: "Corporate Photography", price: 20000 },
  { name: "Product Photography", price: 18000 },
  { name: "Drone Photography", price: 25000 },
  { name: "Videography", price: 40000 },
];

export default function BookingForm({
  booking,
  setBooking,
  onSubmit,
}) {

  const formRef = useRef(null);

  useEffect(() => {
    fadeLeft(formRef.current);
  }, []);

  const handleChange = (e) => {
    setBooking({
      ...booking,
      [e.target.name]: e.target.value,
    });
  };

  const handleSubmit = (e) => {
    e.preventDefault();
    onSubmit();
  };

  return (
    <div
      ref={formRef}
      className="rounded-3xl border border-white/10 bg-white/5 backdrop-blur-xl p-8 shadow-2xl"
    >
      <h2 className="text-3xl font-bold mb-2">
        Book Your Session
      </h2>

      <p className="text-gray-400 mb-10">
        Fill in your details and we'll contact you shortly.
      </p>

      <form
        onSubmit={handleSubmit}
        className="space-y-6"
      >

        <Input
          icon={<User size={18} />}
          label="Full Name"
          name="name"
          value={booking.name}
          onChange={handleChange}
        />

        <Input
          icon={<Mail size={18} />}
          label="Email Address"
          type="email"
          name="email"
          value={booking.email}
          onChange={handleChange}
        />

        <Input
          icon={<Phone size={18} />}
          label="Phone Number"
          name="phone"
          value={booking.phone}
          onChange={handleChange}
        />

        {/* Service */}

        <div>

          <label className="text-sm text-gray-300 mb-2 block">
            Service
          </label>

          <div className="relative">

            <Camera
              className="absolute left-4 top-4 text-cyan-400"
              size={18}
            />

            <select
              name="service"
              value={booking.service}
              onChange={handleChange}
              className="w-full rounded-xl bg-[#0f172a] border border-white/10 pl-12 pr-4 py-4 outline-none focus:border-cyan-400 transition"
            >
              {services.map((service) => (
                <option
                  key={service.name}
                  value={service.name}
                >
                  {service.name}
                </option>
              ))}
            </select>

          </div>

        </div>

        {/* Date & Time */}

        <div className="grid md:grid-cols-2 gap-6">

          <Input
            icon={<Calendar size={18} />}
            type="date"
            name="date"
            value={booking.date}
            onChange={handleChange}
          />

          <Input
            icon={<Clock size={18} />}
            type="time"
            name="time"
            value={booking.time}
            onChange={handleChange}
          />

        </div>

        <Input
          icon={<MapPin size={18} />}
          label="Event Location"
          name="location"
          value={booking.location}
          onChange={handleChange}
        />

        {/* Notes */}

        <div>

          <label className="text-sm text-gray-300 block mb-2">
            Additional Notes
          </label>

          <div className="relative">

            <FileText
              className="absolute left-4 top-4 text-cyan-400"
              size={18}
            />

            <textarea
              rows={5}
              name="notes"
              value={booking.notes}
              onChange={handleChange}
              placeholder="Tell us about your event..."
              className="w-full rounded-xl bg-[#0f172a] border border-white/10 pl-12 pr-4 py-4 resize-none outline-none focus:border-cyan-400 transition"
            />

          </div>

        </div>

        <button
          type="submit"
          className="w-full rounded-xl bg-gradient-to-r from-cyan-500 to-violet-600 py-4 text-lg font-semibold transition duration-300 hover:scale-[1.02] hover:shadow-[0_0_35px_rgba(34,211,238,.45)]"
        >
          Book Session →
        </button>

      </form>

    </div>
  );
}

function Input({
  icon,
  label,
  type = "text",
  ...props
}) {
  return (
    <div>

      {type !== "date" && type !== "time" && (
        <label className="text-sm text-gray-300 block mb-2">
          {label}
        </label>
      )}

      <div className="relative">

        <div className="absolute left-4 top-4 text-cyan-400">
          {icon}
        </div>

        <input
          type={type}
          className="w-full rounded-xl bg-[#0f172a] border border-white/10 pl-12 pr-4 py-4 outline-none focus:border-cyan-400 transition"
          {...props}
        />

      </div>

    </div>
  );
}