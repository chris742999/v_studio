import { motion } from "framer-motion";

export default function GalleryCard({
  image,
  title,
  onClick,
}) {
  return (
    <motion.div
      onClick={onClick}
      initial={{ opacity: 0, y: 70 }}
      whileInView={{ opacity: 1, y: 0 }}
      viewport={{ once: true, amount: 0.2 }}
      transition={{
        duration: 0.8,
        ease: "easeOut",
      }}
      whileHover={{
        scale: 1.08,
        rotate: 0,
        zIndex: 100,
      }}
      className="
        group
        relative
        overflow-hidden
        rounded-lg
        cursor-pointer
        break-inside-avoid
        shadow-2xl
        shadow-black/80
      "
    >
      <img
        src={image}
        alt={title}
        className="
          w-full
          object-cover
          transition-all
          duration-700
          group-hover:scale-110
        "
      />

      {/* Dark Overlay */}
      <div
        className="
          absolute
          inset-0
          bg-gradient-to-t
          from-black/90
          via-black/40
          to-transparent
          opacity-0
          group-hover:opacity-100
          transition-all
          duration-500
        "
      />

      {/* Caption */}
      <div
        className="
          absolute
          bottom-0
          left-0
          w-full
          p-5
          translate-y-8
          opacity-0
          group-hover:translate-y-0
          group-hover:opacity-100
          transition-all
          duration-500
        "
      >
        <h3 className="text-xl font-bold text-white">
          {title}
        </h3>

        <p className="text-cyan-400">
          View Collection →
        </p>
      </div>
    </motion.div>
  );
}