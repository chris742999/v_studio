import { motion } from "framer-motion";
import galleryData from "./galleryData";

export default function MasonryGallery({ onImageClick }) {
  return (
    <section className="w-full">
      <div className="columns-1 sm:columns-2 lg:columns-3 xl:columns-4 gap-6 space-y-6">
        {galleryData.map((image, index) => (
          <motion.div
            key={image.id}
            onClick={() => onImageClick(image)}
            initial={{ opacity: 0, y: 60 }}
            whileInView={{ opacity: 1, y: 0 }}
            viewport={{ once: true, amount: 0.15 }}
            transition={{
              duration: 0.6,
              delay: index * 0.05,
            }}
            whileHover={{
              scale: 1.03,
              y: -8,
            }}
            className="
              group
              relative
              mb-6
              break-inside-avoid
              overflow-hidden
              rounded-3xl
              bg-white/5
              border
              border-white/10
              backdrop-blur-lg
              cursor-pointer
              shadow-xl
              transition-all
              duration-500
              hover:shadow-cyan-500/30
            "
          >
            <img
              src={image.image}
              alt={image.title}
              className="w-full object-cover transition duration-700 group-hover:scale-110"
            />

            {/* Overlay */}
            <div
              className="
                absolute inset-0
                bg-gradient-to-t
                from-black/90
                via-black/30
                to-transparent
                opacity-0
                group-hover:opacity-100
                transition-all duration-500
              "
            />

            {/* Text */}
            <div
              className="
                absolute bottom-0 left-0 w-full
                p-6
                translate-y-8
                opacity-0
                group-hover:translate-y-0
                group-hover:opacity-100
                transition-all duration-500
              "
            >
              <h3 className="text-xl font-bold text-white">
                {image.title}
              </h3>

              <p className="text-cyan-400 mt-1">
                {image.category}
              </p>
            </div>
          </motion.div>
        ))}
      </div>
    </section>
  );
}