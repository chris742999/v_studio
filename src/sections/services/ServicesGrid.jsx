import { motion } from "framer-motion";

import {
  FaCamera,
  FaHeart,
  FaVideo,
  FaBuilding,
  FaUsers,
  FaStar,
  FaImage,
  FaBriefcase,
} from "react-icons/fa";

import ServiceCard from "../../components/cards/ServiceCard";

const services = [
  {
  title: "Portrait Sessions",
  description:
    "Professional portraits crafted to showcase your personality and style.",
  icon: <FaImage />,
},
{
  title: "Drone Photography",
  description:
    "Capture breathtaking aerial perspectives in stunning detail.",
  icon: <FaCamera />,
},
{
  title: "Commercial Shoots",
  description:
    "Premium visuals designed to elevate your brand identity.",
  icon: <FaBriefcase />,
},
];

export default function ServicesGrid() {
  return (
    <section className="relative py-28">
      <div className="mx-auto max-w-7xl px-6">

        <motion.div
          initial={{ opacity: 0, y: 40 }}
          whileInView={{ opacity: 1, y: 0 }}
          viewport={{ once: true }}
          className="mb-16 text-center"
        >
          <h2 className="text-5xl font-black">
            What We Offer
          </h2>

          <p className="mx-auto mt-6 max-w-2xl text-lg text-slate-400">
            Every service is designed to deliver exceptional quality,
            creativity, and unforgettable experiences.
          </p>
        </motion.div>

        <div className="grid gap-8 md:grid-cols-2 xl:grid-cols-4">
          {services.map((service, index) => (
            <motion.div
              key={service.title}
              initial={{ opacity: 0, y: 60 }}
              whileInView={{ opacity: 1, y: 0 }}
              transition={{
                delay: index * 0.08,
                duration: 0.5,
              }}
              viewport={{ once: true }}
            >
              <ServiceCard {...service} />
            </motion.div>
          ))}
        </div>

      </div>
    </section>
  );
}