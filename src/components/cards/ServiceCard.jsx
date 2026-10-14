import { motion } from "framer-motion";
import { FaArrowRight } from "react-icons/fa";

export default function ServiceCard({
  icon,
  title,
  description,
}) {
  return (
    <motion.div
      whileHover={{
        y: -12,
        scale: 1.03,
      }}
      transition={{ duration: 0.3 }}
      className="group relative overflow-hidden rounded-3xl border border-white/10 bg-white/5 p-8 backdrop-blur-xl"
    >
      {/* Glow */}
      <div className="absolute inset-0 opacity-0 transition duration-500 group-hover:opacity-100">
        <div className="absolute -top-24 left-1/2 h-48 w-48 -translate-x-1/2 rounded-full bg-cyan-400/20 blur-[80px]" />
      </div>

      {/* Icon */}
      <motion.div
        whileHover={{ rotate: 10, scale: 1.1 }}
        className="relative z-10 mb-8 inline-flex rounded-2xl bg-cyan-500/10 p-5 text-4xl text-cyan-400"
      >
        {icon}
      </motion.div>

      <h3 className="relative z-10 text-2xl font-bold">
        {title}
      </h3>

      <p className="relative z-10 mt-4 leading-7 text-slate-300">
        {description}
      </p>

      <button className="relative z-10 mt-8 flex items-center gap-3 text-cyan-400 transition group-hover:gap-5">
        Learn More
        <FaArrowRight />
      </button>
    </motion.div>
  );
}