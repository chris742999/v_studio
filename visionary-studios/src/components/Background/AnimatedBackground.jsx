import { useMemo, useEffect, useState } from "react";
import { motion } from "framer-motion";

export default function AnimatedBackground() {
    const [mouse, setMouse] = useState({ x: 0, y: 0 });

useEffect(() => {
  const handleMouseMove = (e) => {
    const x = (e.clientX / window.innerWidth - 0.5) * 60;
    const y = (e.clientY / window.innerHeight - 0.5) * 60;

    setMouse({ x, y });
  };

  window.addEventListener("mousemove", handleMouseMove);

  return () => window.removeEventListener("mousemove", handleMouseMove);
}, []);
  const stars = useMemo(
    () =>
      Array.from({ length: 350 }, (_, i) => ({
        id: i,
        left: Math.random() * 100,
        top: Math.random() * 100,
        size: Math.random() * 3 + 1,
        color:
  Math.random() > 0.92
    ? "#22d3ee"
    : Math.random() > 0.96
    ? "#a855f7"
    : "#ffffff",
        delay: Math.random() * 5,
        duration: 2 + Math.random() * 5,
      })),
    []
  );

  return (
<div className="fixed inset-0 z-0 overflow-hidden bg-[#030712]">
      {/* Nebula Glow */}

      <motion.div
 animate={{
  x: [mouse.x, mouse.x + 80, mouse.x - 50, mouse.x],
  y: [mouse.y, mouse.y + 40, mouse.y - 20, mouse.y],
  scale: [1, 1.1, 1],
}}
  transition={{
    duration: 25,
    repeat: Infinity,
    ease: "easeInOut",
  }}
  className="absolute -left-40 -top-40 h-[800px] w-[800px] rounded-full bg-cyan-500/10 blur-[220px]"
/>

<motion.div
  animate={{
    x: [mouse.x, mouse.x - 80, mouse.x + 30, mouse.x],
    y: [mouse.y, mouse.y - 50, mouse.y + 30, mouse.y],
  }}
  transition={{
    duration: 30,
    repeat: Infinity,
    ease: "easeInOut",
  }}
  className="absolute -right-52 bottom-0 h-[850px] w-[850px] rounded-full bg-violet-500/10 blur-[220px]"
/>

<motion.div
  animate={{
    x: [mouse.x, mouse.x + 40, mouse.x],
    y: [mouse.y, mouse.y - 50, mouse.y],
  }}
  transition={{
    duration: 18,
    repeat: Infinity,
    ease: "easeInOut",
  }}
  className="absolute left-1/3 top-1/2 h-[400px] w-[400px] rounded-full bg-sky-500/10 blur-[180px]"
/>

<motion.div
  animate={{
    x: [mouse.x, mouse.x - 50, mouse.x],
    y: [mouse.y, mouse.y + 40, mouse.y],
  }}
  transition={{
    duration: 20,
    repeat: Infinity,
    ease: "easeInOut",
  }}
  className="absolute right-1/4 top-1/4 h-[350px] w-[350px] rounded-full bg-cyan-300/5 blur-[180px]"
/>
      {/* Stars */}

      {stars.map((star) => (
        <motion.div
          key={star.id}
          className="absolute rounded-full bg-white shadow-[0_0_8px_rgba(255,255,255,0.8)]"
          style={{
  left: `${star.left}%`,
  top: `${star.top}%`,
  width: star.size,
  height: star.size,
  background: star.color,
}}
          animate={{
            opacity: [0.2, 1, 0.2],
            scale: [1, 1.6, 1],
          }}
          transition={{
            duration: star.duration,
            repeat: Infinity,
            delay: star.delay,
          }}
        />
      ))}

{[...Array(3)].map((_, i) => (
  <motion.div
    key={i}
    className="absolute h-[2px] w-40 bg-gradient-to-r from-white to-transparent"
    initial={{
      x: "-20%",
      y: `${20 + i * 25}%`,
      opacity: 0,
      rotate: -25,
    }}
    animate={{
      x: "120%",
      opacity: [0, 1, 1, 0],
    }}
    transition={{
      duration: 2,
      delay: i * 6,
      repeat: Infinity,
      repeatDelay: 10,
      ease: "linear",
    }}
  />
))}
    </div>
  );
}