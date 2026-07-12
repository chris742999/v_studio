import { motion } from "framer-motion";
import { FaArrowRight } from "react-icons/fa";

import wedding from "../../assets/featured/wedding.jpg";
import portrait from "../../assets/featured/portrait.jpg";
import commercial from "../../assets/featured/commercial.jpg";
import drone from "../../assets/featured/drone.jpg";

const projects = [
  {
    title: "Wedding Photography",
    location: "Luxury Garden Ceremony",
    image: wedding,
  },
  {
    title: "Portrait Collection",
    location: "Studio Sessions",
    image: portrait,
  },
  {
    title: "Commercial Campaign",
    location: "Brand Photography",
    image: commercial,
  },
  {
    title: "Drone Coverage",
    location: "Aerial Cinematics",
    image: drone,
  },
];

export default function FeaturedProjects() {
  return (
    <section className="py-28">
      <div className="mx-auto max-w-7xl px-6">

        {/* Heading */}

        <div className="relative z-50 mb-16 text-center">
          <span className="rounded-full border border-cyan-400/30 bg-cyan-400/10 px-5 py-2 text-sm tracking-widest text-cyan-300">
            FEATURED PROJECTS
          </span>

          <h2 className="mt-8 text-5xl font-black text-white">
  Our Latest{" "}
  <span className="bg-gradient-to-r from-cyan-400 to-violet-500 bg-clip-text text-transparent">
    Work
  </span>
</h2>

          <p className="mx-auto mt-6 max-w-2xl text-slate-400">
            A collection of memorable moments captured with creativity,
            precision and passion.
          </p>
        </div>

        {/* Grid */}

        <div className="grid gap-8 md:grid-cols-2">

          {projects.map((project, index) => (

            <motion.div
    key={project.title}
    initial={{ opacity: 0, y: 60 }}
    whileInView={{ opacity: 1, y: 0 }}
    viewport={{ once: true }}
    transition={{
        delay: index * 0.15,
        duration: 0.6,
    }}
    whileHover={{ y: -10 }}
className="
group
relative
h-[520px]
overflow-hidden
rounded-[30px]
border
border-white/10
shadow-2xl
transition-all
duration-500
hover:shadow-cyan-500/20
">

    {/* Image */}

    <img
        src={project.image}
        alt={project.title}
        className="h-full w-full object-cover transition duration-700 group-hover:scale-110"
    />

    {/* Gradient */}

    <div className="absolute inset-0 bg-gradient-to-t from-black via-black/30 to-transparent transition duration-500 group-hover:from-black/90" />

    {/* Cyan Glow */}

    <div className="absolute inset-0 rounded-[30px] border border-cyan-400/0 transition duration-500 group-hover:border-cyan-400/40" />

    {/* Glass Panel */}

 <div
  className="
    absolute
    bottom-0
    left-0
    w-full
    translate-y-24
    bg-gradient-to-t
    from-[#020617]/95
    via-[#020617]/70
    to-transparent
    p-8
    opacity-0
    transition-all
    duration-700
    group-hover:translate-y-0
    group-hover:opacity-100
  "
>
    <div
        className="
        absolute
        -left-40
        top-0
        h-full
        w-24
        rotate-12
        bg-white/20
        blur-2xl
        transition-all
        duration-1000
        group-hover:left-[120%]
    "
    />


        <span className="rounded-full bg-cyan-400/20 px-3 py-1 text-sm text-cyan-300">
            {project.location}
        </span>

        <h3 className="mt-5 text-3xl font-bold">
            {project.title}
        </h3>

        <p className="mt-4 text-slate-300 leading-7">
            Every frame is carefully composed,
            professionally edited and delivered
            with cinematic storytelling.
        </p>

        <button className="group/btn mt-8 flex items-center gap-3 font-semibold text-cyan-400">

            View Project

            <FaArrowRight className="transition group-hover/btn:translate-x-2"/>

        </button>

    </div>

</motion.div>

          ))}

        </div>

      </div>
    </section>
  );
}