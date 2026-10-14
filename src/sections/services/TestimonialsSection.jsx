import client1 from "../../assets/testimonials/client1.jpg";
import client2 from "../../assets/testimonials/client2.jpg";
import client3 from "../../assets/testimonials/client3.jpg";
import { useEffect, useState } from "react";
import { motion } from "framer-motion";
import TestimonialCard from "../../components/testimonials/TestimonialCard";

const testimonials = [
  {
    image: client1,
    name: "Sarah Johnson",
    role: "Wedding Client",
    review:
      "Visionary Studios captured every beautiful moment of our wedding. The photos exceeded every expectation.",
  },
  {
    image: client2,
    name: "David Kimani",
    role: "Corporate Client",
    review:
      "Professional, creative and incredibly easy to work with. Our brand photography looked amazing.",
  },
  {
    image: client3,
    name: "Grace Wanjiru",
    role: "Portrait Client",
    review:
      "The attention to detail was incredible. Every image looked like it belonged in a magazine.",
  },
];


export default function TestimonialsSection() {
    const [active, setActive] = useState(0);

useEffect(() => {
  const timer = setInterval(() => {
    setActive((prev) => (prev + 1) % testimonials.length);
  }, 5000);

  return () => clearInterval(timer);
}, []);
  return (
    <section className="relative py-28">
      <div className="mx-auto max-w-7xl px-6">

        <div className="mb-16 text-center">
          <span className="rounded-full border border-cyan-400/30 bg-cyan-400/10 px-5 py-2 text-sm tracking-widest text-cyan-300">
            TESTIMONIALS
          </span>

          <h2 className="mt-8 text-5xl font-black">
            What Our Clients Say
          </h2>

          <p className="mx-auto mt-6 max-w-2xl text-slate-400">
            We’re proud to create unforgettable experiences and lasting memories for every client.
          </p>
        </div>

<div className="flex flex-wrap items-center justify-center gap-8">

  {testimonials.map((testimonial, index) => {

    const isActive = index === active;

    return (

      <motion.div
        key={testimonial.name}
        animate={{
          scale: isActive ? 1 : 0.88,
          opacity: isActive ? 1 : 0.55,
          y: isActive ? -10 : 0,
        }}
        transition={{
          duration: 0.6,
        }}
      >
        <TestimonialCard {...testimonial} />
      </motion.div>

    );

  })}

</div>

{/* Navigation Dots */}

<div className="mt-12 flex justify-center gap-4">

  {testimonials.map((_, index) => (

    <button
      key={index}
      onClick={() => setActive(index)}
      className={`h-3 rounded-full transition-all duration-300 ${
        active === index
          ? "w-10 bg-cyan-400"
          : "w-3 bg-white/30"
      }`}
    />

  ))}

</div>

      </div>
    </section>
  );
}