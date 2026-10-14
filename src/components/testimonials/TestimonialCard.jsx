import { motion } from "framer-motion";
import { FaStar, FaQuoteLeft } from "react-icons/fa";

export default function TestimonialCard({
  image,
  name,
  role,
  review,
}) {
  return (
    <motion.div
      whileHover={{
        y: -12,
        scale: 1.03,
      }}
      transition={{ duration: 0.3 }}
      className="group relative w-full max-w-sm overflow-hidden rounded-3xl border border-white/10 bg-gradient-to-br from-white/10 to-white/5 p-8 backdrop-blur-xl"
    >
      {/* Background Glow */}
      <div className="absolute -right-10 -top-10 h-40 w-40 rounded-full bg-cyan-500/10 blur-3xl" />

      {/* Hover Border */}
      <div className="absolute inset-0 rounded-3xl border border-cyan-400/0 transition-all duration-500 group-hover:border-cyan-400/40" />

      {/* Quote */}
      <motion.div
        animate={{ y: [0, -6, 0] }}
        transition={{
          duration: 3,
          repeat: Infinity,
        }}
      >
        <FaQuoteLeft className="mb-6 text-5xl text-cyan-400/30" />
      </motion.div>

      {/* Stars */}
      <div className="mb-6 flex gap-1 text-yellow-400">
        {[...Array(5)].map((_, i) => (
          <motion.div
            key={i}
            animate={{ scale: [1, 1.15, 1] }}
            transition={{
              duration: 2,
              repeat: Infinity,
              delay: i * 0.15,
            }}
          >
            <FaStar />
          </motion.div>
        ))}
      </div>

      {/* Review */}
      <p className="leading-8 text-slate-300">
        "{review}"
      </p>

      {/* Client */}
      <div className="mt-8 flex items-center gap-4">

        <motion.img
          src={image}
          alt={name}
          whileHover={{
            scale: 1.1,
            rotate: 3,
          }}
          transition={{ duration: 0.3 }}
          className="h-16 w-16 rounded-full border-2 border-cyan-400 object-cover shadow-lg shadow-cyan-500/30"
        />

        <div>
          <h4 className="text-lg font-bold">
            {name}
          </h4>

          <p className="text-sm text-cyan-400">
            {role}
          </p>
        </div>

      </div>

    </motion.div>
  );
}