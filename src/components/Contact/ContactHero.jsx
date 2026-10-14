import { useEffect, useRef } from "react";
import gsap from "gsap";
import { ArrowRight } from "lucide-react";

export default function ContactHero() {
  const heroRef = useRef(null);

  useEffect(() => {
    gsap.fromTo(
      heroRef.current.children,
      {
        opacity: 0,
        y: 60,
      },
      {
        opacity: 1,
        y: 0,
        duration: 1,
        stagger: 0.2,
        ease: "power3.out",
      }
    );
  }, []);

  return (
    <section className="relative min-h-screen flex items-center justify-center px-6 overflow-hidden">
      {/* Background Glow */}
      <div className="absolute w-[600px] h-[600px] bg-cyan-500/20 blur-[180px] rounded-full" />
      <div className="absolute right-0 bottom-0 w-[500px] h-[500px] bg-violet-600/20 blur-[170px] rounded-full" />

      <div
        ref={heroRef}
        className="relative z-10 max-w-4xl text-center space-y-8"
      >
        <p className="uppercase tracking-[8px] text-cyan-400 text-sm font-semibold">
          Contact Visionary Studios
        </p>

        <h1 className="text-5xl md:text-7xl font-extrabold leading-tight">
          Let's Create
          <br />
          <span className="text-cyan-400">Something Extraordinary</span>
        </h1>

        <p className="text-gray-300 text-lg md:text-xl leading-relaxed max-w-3xl mx-auto">
          Whether you're planning a wedding, a corporate event, a portrait
          session, or commercial photography, we'd love to hear your ideas.
          Let's bring your vision to life through stunning imagery.
        </p>

        <div className="flex justify-center">
          <a
            href="#contact-form"
            className="group inline-flex items-center gap-3 px-8 py-4 rounded-full
            bg-cyan-500 hover:bg-cyan-400 transition-all duration-300
            font-semibold text-black shadow-lg shadow-cyan-500/30"
          >
            Get In Touch

            <ArrowRight
              size={20}
              className="group-hover:translate-x-1 transition-transform"
            />
          </a>
        </div>
      </div>
    </section>
  );
}