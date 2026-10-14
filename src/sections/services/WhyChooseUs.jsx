import { motion } from "framer-motion";
import {
  FaAward,
  FaBolt,
  FaCamera,
  FaShieldAlt,
} from "react-icons/fa";

const features = [
  {
    icon: <FaAward />,
    title: "Premium Editing",
    description:
      "Every image is professionally color graded and retouched.",
  },
  {
    icon: <FaBolt />,
    title: "Fast Delivery",
    description:
      "Quick turnaround without compromising quality.",
  },
  {
    icon: <FaCamera />,
    title: "Professional Equipment",
    description:
      "Latest Sony cameras, cinema lenses and lighting gear.",
  },
  {
    icon: <FaShieldAlt />,
    title: "Reliable Service",
    description:
      "Trusted by hundreds of satisfied clients.",
  },
];

const stats = [
  { value: "15+", label: "Years Experience" },
  { value: "2500+", label: "Happy Clients" },
  { value: "98%", label: "Client Satisfaction" },
  { value: "24/7", label: "Support" },
];

export default function WhyChooseUs() {
  return (
    <section className="relative py-28">
      <div className="mx-auto max-w-7xl px-6">

        <motion.div
          initial={{ opacity: 0, y: 40 }}
          whileInView={{ opacity: 1, y: 0 }}
          viewport={{ once: true }}
          className="text-center"
        >
          <h2 className="text-5xl font-black">
            Why Choose
            <span className="text-cyan-400"> Visionary Studios</span>
          </h2>

          <p className="mx-auto mt-6 max-w-2xl text-slate-400">
            Every project is crafted with creativity, precision,
            and a passion for storytelling.
          </p>
        </motion.div>

        {/* Stats */}

        <div className="mt-20 grid gap-8 md:grid-cols-2 xl:grid-cols-4">
          {stats.map((stat) => (
            <div
              key={stat.label}
              className="rounded-3xl border border-white/10 bg-white/5 p-8 text-center backdrop-blur-xl"
            >
              <h3 className="text-5xl font-black text-cyan-400">
                {stat.value}
              </h3>

              <p className="mt-3 text-slate-300">
                {stat.label}
              </p>
            </div>
          ))}
        </div>

        {/* Features */}

        <div className="mt-20 grid gap-8 md:grid-cols-2 xl:grid-cols-4">
          {features.map((feature) => (
            <motion.div
              key={feature.title}
              whileHover={{ y: -10 }}
              className="rounded-3xl border border-white/10 bg-white/5 p-8 backdrop-blur-xl"
            >
              <div className="mb-6 text-4xl text-cyan-400">
                {feature.icon}
              </div>

              <h3 className="text-2xl font-bold">
                {feature.title}
              </h3>

              <p className="mt-4 leading-7 text-slate-300">
                {feature.description}
              </p>
            </motion.div>
          ))}
        </div>

      </div>
    </section>
  );
}