import { motion } from "framer-motion";
import {
  FaComments,
  FaClipboardList,
  FaCamera,
  FaMagic,
  FaCheckCircle,
} from "react-icons/fa";

const process = [
  {
    number: "01",
    icon: <FaComments />,
    title: "Consultation",
    description:
      "We discuss your vision, style, location and expectations.",
  },
  {
    number: "02",
    icon: <FaClipboardList />,
    title: "Planning",
    description:
      "Every detail is carefully planned to ensure a seamless experience.",
  },
  {
    number: "03",
    icon: <FaCamera />,
    title: "Photography",
    description:
      "Capturing authentic moments using professional equipment.",
  },
  {
    number: "04",
    icon: <FaMagic />,
    title: "Editing",
    description:
      "Each image is enhanced with cinematic color grading and premium retouching.",
  },
  {
    number: "05",
    icon: <FaCheckCircle />,
    title: "Delivery",
    description:
      "Receive your beautifully edited gallery in a secure online collection.",
  },
];

export default function ProcessSection() {
  return (
    <section className="relative py-28 overflow-hidden">
      {/* Background Glow */}
      <div className="absolute left-1/2 top-0 h-96 w-96 -translate-x-1/2 rounded-full bg-cyan-500/10 blur-[180px]" />

      <div className="relative mx-auto max-w-7xl px-6">
        {/* Heading */}
        <motion.div
          initial={{ opacity: 0, y: 40 }}
          whileInView={{ opacity: 1, y: 0 }}
          viewport={{ once: true }}
          className="mb-24 text-center"
        >
          <span className="rounded-full border border-cyan-400/30 bg-cyan-500/10 px-4 py-2 text-sm tracking-widest text-cyan-300">
            OUR PROCESS
          </span>

          <h2 className="mt-8 text-5xl font-black">
            From Idea to
            <span className="text-cyan-400"> Masterpiece</span>
          </h2>

          <p className="mx-auto mt-6 max-w-3xl text-lg text-slate-400">
            Every project follows a carefully refined workflow to ensure an
            exceptional experience from the first conversation to the final
            delivery.
          </p>
        </motion.div>

        {/* Timeline */}
        <div className="relative">
          {/* Line (Desktop) */}
<div className="absolute left-0 right-0 top-10 hidden h-1 rounded-full bg-white/10 lg:block overflow-hidden">
    <motion.div
        initial={{ width: "0%" }}
        whileInView={{ width: "100%" }}
        viewport={{ once: true }}
        transition={{
            duration: 2,
            ease: "easeInOut",
        }}
        className="h-full rounded-full bg-gradient-to-r from-cyan-400 via-sky-400 to-violet-500"
    />
</div>
          <div className="grid gap-12 lg:grid-cols-5">
            {process.map((step, index) => (
              <motion.div
                key={step.number}
                initial={{ opacity: 0, y: 70 }}
                whileInView={{ opacity: 1, y: 0 }}
                viewport={{ once: true }}
                transition={{
                  delay: index * 0.15,
                  duration: 0.6,
                }}
className="group relative rounded-3xl p-5 text-center transition-all duration-500 hover:bg-white/5 hover:backdrop-blur-xl"              >
                {/* Circle */}
               <motion.div
    animate={{
        scale: [1, 1.08, 1],
        boxShadow: [
            "0 0 20px rgba(6,182,212,0.25)",
            "0 0 45px rgba(6,182,212,0.55)",
            "0 0 20px rgba(6,182,212,0.25)",
        ],
    }}
    transition={{
        duration: 3,
        repeat: Infinity,
        delay: index * 0.25,
    }}
    className="relative z-10 mx-auto flex h-20 w-20 items-center justify-center rounded-full border border-cyan-400/40 bg-[#07111f] text-3xl text-cyan-400"
>
    <div className="absolute h-full w-full rounded-full bg-cyan-400/20 blur-2xl" />
    
    {step.icon}
</motion.div>

                {/* Number */}
                <p className="mt-6 text-sm font-bold tracking-[0.3em] text-cyan-300">
                  {step.number}
                </p>

                {/* Title */}
<h3 className="mt-3 text-2xl font-bold transition-all duration-300 group-hover:text-cyan-400">                  {step.title}
                </h3>

                {/* Description */}
                <p className="mt-4 leading-7 text-slate-400 transition-all duration-500 group-hover:text-slate-200">
    {step.description}
</p>

<div className="mt-4 max-h-0 overflow-hidden text-sm text-cyan-300 transition-all duration-500 group-hover:max-h-24">
    Professional planning • Creative direction • Premium quality
</div>
              </motion.div>
            ))}
          </div>
        </div>
      </div>
    </section>
  );
}