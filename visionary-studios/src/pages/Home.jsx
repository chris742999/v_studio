import Navbar from "../components/Navbar/Navbar";
import Scene3D from "../components/ThreeScene/Scene3D";


export default function Home() {
  return (
    <main className="relative min-h-screen overflow-hidden bg-[#030712] text-white">
      {/* Navbar */}
      <Navbar />

      {/* 3D Background */}
      <div className="absolute inset-0">
        <Scene3D />
      </div>

      {/* Hero Section */}
      <section className="relative z-10 flex min-h-screen items-center">
        <div className="mx-auto grid max-w-7xl items-center gap-10 px-8 md:grid-cols-2">
          {/* Left Content */}
          <div>
            <p className="tracking-[8px] uppercase text-cyan-400">
              Premium Photography
            </p>

            <h1 className="mt-6 text-6xl font-black leading-tight md:text-7xl lg:text-8xl">
              Capture
              <span className="block text-cyan-400">
                Timeless Moments
              </span>
            </h1>

            <p className="mt-8 max-w-xl text-lg text-gray-300">
              Professional weddings, portraits, graduations, drone coverage,
              fashion, commercial photography, and cinematic storytelling.
            </p>

            <div className="mt-10 flex flex-wrap gap-5">
              <button className="rounded-full bg-cyan-500 px-8 py-4 font-semibold transition duration-300 hover:scale-105 hover:bg-cyan-400">
                Book Session
              </button>

              <button className="rounded-full border border-cyan-400 px-8 py-4 font-semibold transition duration-300 hover:bg-cyan-400 hover:text-black">
                Explore Portfolio
              </button>
            </div>
          </div>

          {/* Right Side */}
          <div className="hidden md:block">
            {/* The 3D scene will occupy this visual area */}
          </div>
        </div>
      </section>
    </main>
  );
}