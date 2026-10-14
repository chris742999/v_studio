import { motion } from "framer-motion";
import { Camera } from "lucide-react";

export default function GalleryHero() {
  return (
    <section className="relative h-[80vh] flex items-center justify-center text-center overflow-hidden">

      <div className="absolute inset-0 bg-gradient-to-b from-cyan-500/10 via-transparent to-[#030712]" />

      <motion.div
        initial={{ opacity: 0, y: 60 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ duration: 1 }}
        className="relative z-10 max-w-4xl px-6"
      >
        <Camera className="mx-auto text-cyan-400 mb-6" size={60} />

        <h1 className="text-6xl md:text-7xl font-bold mb-6">
          Our
          <span className="text-cyan-400"> Gallery</span>
        </h1>

        <p className="text-gray-300 text-xl leading-relaxed">
          Every photograph tells a story. Explore our finest work in
          weddings, portraits, graduations, events and commercial photography.
        </p>
      </motion.div>
    </section>
  );
}