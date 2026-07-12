import { motion } from "framer-motion";

export default function BookingHero() {
  return (
    <section className="relative pt-40 pb-28 px-6">

      <div className="max-w-7xl mx-auto text-center">

        <motion.p
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: .6 }}
          className="uppercase tracking-[6px] text-cyan-400 font-semibold"
        >
          Visionary Studios
        </motion.p>

        <motion.h1
          initial={{ opacity:0,y:30 }}
          animate={{ opacity:1,y:0 }}
          transition={{ delay:.2 }}
          className="mt-6 text-5xl md:text-7xl font-black leading-tight"
        >
          Book Your
          <span className="block text-transparent bg-gradient-to-r from-cyan-400 via-sky-400 to-violet-500 bg-clip-text">
            Photography Session
          </span>
        </motion.h1>

        <motion.p
          initial={{ opacity:0 }}
          animate={{ opacity:1 }}
          transition={{ delay:.4 }}
          className="mt-8 text-gray-400 text-lg max-w-2xl mx-auto"
        >
          Reserve your date in minutes.
          Weddings, graduations, portraits,
          corporate shoots and drone coverage—
          all in one premium booking experience.
        </motion.p>

      </div>

    </section>
  );
}