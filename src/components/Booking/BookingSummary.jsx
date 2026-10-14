import { useState, useEffect, useRef } from "react";
import { fadeRight } from "../../utils/animations";

import {
  Camera,
  Calendar,
  Clock,
  MapPin,
  BadgeDollarSign,
  CheckCircle,
} from "lucide-react";

const prices = {
  "Wedding Photography": 35000,
  "Graduation Photography": 12000,
  "Birthday Photography": 15000,
  "Studio Portraits": 8000,
  "Corporate Photography": 20000,
  "Product Photography": 18000,
  "Drone Photography": 25000,
  Videography: 40000,
};

export default function BookingSummary({ booking }) {
  const summaryRef = useRef(null);

  useEffect(() => {
    fadeRight(summaryRef.current);
  }, []);

  const detailsComplete =
    booking.name &&
    booking.email &&
    booking.phone;

  const scheduleComplete =
    booking.date &&
    booking.time &&
    booking.location;

  const progress =
    (detailsComplete ? 50 : 0) +
    (scheduleComplete ? 50 : 0);

  const targetPrice = prices[booking.service] || 0;

  const [displayPrice, setDisplayPrice] = useState(targetPrice);

  useEffect(() => {
    let animation;

    const start = 0;
    const duration = 1000;
    const startTime = performance.now();

    function animate(currentTime) {
      const elapsed = currentTime - startTime;
      const percent = Math.min(elapsed / duration, 1);

      const value = Math.floor(
        start + (targetPrice - start) * percent
      );

      setDisplayPrice(value);

      if (percent < 1) {
        animation = requestAnimationFrame(animate);
      }
    }

    animation = requestAnimationFrame(animate);

    return () => cancelAnimationFrame(animation);
  }, [targetPrice]);

  return (
    <div
      ref={summaryRef}
      className="sticky top-28"
    >
      <div className="rounded-3xl border border-cyan-400/20 bg-white/5 backdrop-blur-xl p-8 shadow-[0_0_40px_rgba(6,182,212,.15)]">

        {/* Header */}

        <div className="mb-8">
          <p className="uppercase tracking-[0.35em] text-xs text-cyan-300">
            Visionary Studios
          </p>

          <h2 className="text-3xl font-bold mt-2">
            Booking Summary
          </h2>

          <p className="text-gray-400 mt-2">
            Review your booking before submitting.
          </p>
        </div>

        {/* Details */}

        <div className="space-y-5">
          <SummaryItem
            icon={<Camera size={18} />}
            label="Service"
            value={booking.service}
          />

          <SummaryItem
            icon={<Calendar size={18} />}
            label="Date"
            value={booking.date || "Not Selected"}
          />

          <SummaryItem
            icon={<Clock size={18} />}
            label="Time"
            value={booking.time || "Not Selected"}
          />

          <SummaryItem
            icon={<MapPin size={18} />}
            label="Location"
            value={booking.location || "Not Provided"}
          />
        </div>

        <div className="my-8 border-t border-white/10" />

        {/* Price */}

        <div className="flex items-center justify-between">

          <div>

            <p className="uppercase tracking-[0.3em] text-xs text-cyan-300">
              Estimated Investment
            </p>

            <h3 className="text-4xl font-bold text-cyan-400 mt-2">
              KSh {displayPrice.toLocaleString()}
            </h3>

            <div className="mt-3 inline-flex items-center gap-2 rounded-full bg-cyan-500/10 border border-cyan-400/20 px-3 py-1">

              <div className="h-2 w-2 rounded-full bg-green-400 animate-pulse" />

              <span className="text-xs text-cyan-300">
                Professional Editing Included
              </span>

            </div>

          </div>

          <BadgeDollarSign
            size={46}
            className="text-cyan-400"
          />

        </div>

        {/* Progress */}

        <div className="mt-8 rounded-2xl bg-white/5 border border-white/10 p-5">

          <div className="flex justify-between mb-3">

            <h3 className="font-semibold">
              Booking Progress
            </h3>

            <span className="text-cyan-400 font-bold">
              {progress}%
            </span>

          </div>

          <div className="h-3 rounded-full bg-gray-700 overflow-hidden">

            <div
              className="h-full bg-gradient-to-r from-cyan-400 to-violet-500 transition-all duration-700"
              style={{
                width: `${progress}%`,
              }}
            />

          </div>

          <div className="mt-6 space-y-4">

            <Status
              complete={detailsComplete}
              text="Personal Details"
            />

            <Status
              complete={scheduleComplete}
              text="Schedule"
            />

            <Status
              complete={progress === 100}
              text="Ready to Confirm"
            />

          </div>

        </div>

        {/* Response */}

        <div className="mt-6 rounded-2xl bg-gradient-to-r from-cyan-500/10 to-violet-500/10 border border-cyan-500/20 p-5">

          <h3 className="font-semibold mb-2">
            Estimated Response
          </h3>

          <p className="text-gray-400">
            Less than
          </p>

          <p className="text-3xl font-bold text-cyan-400">
            24 Hours
          </p>

        </div>

        {/* Status */}

        <div
          className={`mt-6 rounded-2xl border p-5 ${
            progress === 100
              ? "border-green-500/20 bg-green-500/5"
              : "border-yellow-500/20 bg-yellow-500/5"
          }`}
        >

          <div className="flex justify-between">

            <span className="text-gray-300">
              Booking Status
            </span>

            <span
              className={`flex items-center gap-2 ${
                progress === 100
                  ? "text-green-400"
                  : "text-yellow-400"
              }`}
            >

              <div
                className={`h-2 w-2 rounded-full animate-pulse ${
                  progress === 100
                    ? "bg-green-400"
                    : "bg-yellow-400"
                }`}
              />

              {progress === 100
                ? "Ready to Submit"
                : "Incomplete"}

            </span>

          </div>

        </div>

        <div className="mt-8 rounded-2xl border border-cyan-400/20 bg-cyan-500/5 p-5">

  <h3 className="font-semibold text-cyan-300 mb-2">
    Before You Submit
  </h3>

  <ul className="space-y-2 text-sm text-gray-400">
    <li>✓ Double-check your booking details.</li>
    <li>✓ We'll contact you within 24 hours.</li>
    <li>✓ No payment is required today.</li>
  </ul>

</div>

        <div className="mt-6 flex items-center gap-2 text-green-400">

          <CheckCircle size={18} />

          <p className="text-sm">
            Secure Booking • No payment required today
          </p>

        </div>

      </div>
    </div>
  );
}

function SummaryItem({ icon, label, value }) {
  return (
    <div className="flex items-center justify-between">

      <div className="flex items-center gap-3">

        <div className="text-cyan-400">
          {icon}
        </div>

        <p className="text-gray-400">
          {label}
        </p>

      </div>

      <p className="font-medium text-right">
        {value}
      </p>

    </div>
  );
}

function Status({ complete, text }) {
  return (
    <div className="flex items-center justify-between">

      <span>{text}</span>

      <span
        className={`font-semibold ${
          complete
            ? "text-green-400"
            : "text-gray-500"
        }`}
      >
        {complete ? "✔ Completed" : "○ Pending"}
      </span>

    </div>
  );
}