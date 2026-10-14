import { motion } from "framer-motion";
import { FaArrowRight, FaPlay } from "react-icons/fa";
import { Canvas } from "@react-three/fiber";
import { Environment, OrbitControls } from "@react-three/drei";
import DroneModel from "../../components/3d/DroneModel";

export default function ServicesHero() {
  return (
    <section className="relative overflow-hidden bg-transparent pt-40 pb-24">
      {/* Background Glow */}
      <div className="absolute left-20 top-32 h-80 w-80 rounded-full bg-cyan-500/20 blur-[140px]" />
      <div className="absolute right-20 bottom-20 h-96 w-96 rounded-full bg-violet-600/20 blur-[180px]" />

      {/* Grid */}
      <div className="absolute inset-0 bg-[linear-gradient(rgba(255,255,255,0.03)_1px,transparent_1px),linear-gradient(90deg,rgba(255,255,255,0.03)_1px,transparent_1px)] bg-[size:45px_45px]" />

      <div className="relative z-10 mx-auto flex max-w-7xl flex-col items-center gap-16 px-6 lg:flex-row">
        
        {/* LEFT */}
        <motion.div
          initial={{ opacity: 0, x: -60 }}
          animate={{ opacity: 1, x: 0 }}
          transition={{ duration: 0.8 }}
          className="flex-1"
        >
          <span className="rounded-full border border-cyan-400/30 bg-cyan-400/10 px-5 py-2 text-sm tracking-[0.25em] text-cyan-300">
            PREMIUM SERVICES
          </span>

          <h1 className="mt-8 text-5xl font-black leading-tight md:text-7xl">
            Creating
            <span className="bg-gradient-to-r from-cyan-400 via-sky-400 to-violet-500 bg-clip-text text-transparent">
              {" "}
              Visual
            </span>
            <br />
            Masterpieces
          </h1>

          <p className="mt-8 max-w-xl text-lg leading-8 text-slate-300">
            From luxury weddings to cinematic commercial campaigns,
            Visionary Studios transforms every frame into timeless art.
          </p>

          <div className="mt-10 flex flex-wrap gap-5">
            <button className="rounded-full bg-cyan-500 px-8 py-4 font-semibold transition hover:scale-105 hover:bg-cyan-400">
              Book Session
            </button>

            <button className="flex items-center gap-3 rounded-full border border-white/10 bg-white/5 px-8 py-4 transition hover:border-cyan-400">
              <FaPlay />
              Watch Reel
            </button>
          </div>
        </motion.div>

        {/* RIGHT */}
   

<motion.div
  initial={{ opacity: 0, x: 60 }}
  animate={{ opacity: 1, x: 0 }}
  transition={{ duration: 1 }}
  className="relative h-[600px] flex-1"
>
  <Canvas camera={{ position: [0, 1, 6], fov: 45 }}>

    <ambientLight intensity={1.2} />

    <directionalLight
      position={[5, 5, 5]}
      intensity={2}
    />

    <pointLight
      position={[-4, 2, 2]}
      color="#22d3ee"
      intensity={30}
    />

    <pointLight
      position={[4, -2, -2]}
      color="#8b5cf6"
      intensity={20}
    />

    <DroneModel />

    <Environment preset="city" />

    <OrbitControls
      enableZoom={false}
      enablePan={false}
      autoRotate={false}
    />

  </Canvas>
        </motion.div>
      </div>
    </section>
  );
}