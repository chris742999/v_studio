import React from 'react'
import { motion } from 'framer-motion'

const testimonials = [
  { name: 'Lena Cyber', quote: 'Visionary Studios turned my event into a cyberpunk dream!', avatar: 'https://randomuser.me/api/portraits/women/68.jpg' },
  { name: 'Marcus Thorne', quote: 'The holographic album is next level, pure innovation.', avatar: 'https://randomuser.me/api/portraits/men/32.jpg' },
  { name: 'Zara Nexus', quote: 'Drone shots were unreal, best production team.', avatar: 'https://randomuser.me/api/portraits/women/44.jpg' },
  { name: 'Kai Vector', quote: 'Absolutely futuristic experience!', avatar: 'https://randomuser.me/api/portraits/men/22.jpg' },
]

export default function Testimonials() {
  return (
    <section className="py-28 px-6 overflow-hidden">
      <h2 className="text-5xl font-bold text-center text-cyber-neon mb-8">✨ FEEDBACK MATRIX</h2>
      <div className="relative w-full overflow-hidden">
        <div className="flex animate-scroll gap-6 w-max">
          {[...testimonials, ...testimonials].map((t, idx) => (
            <div key={idx} className="glass-card w-80 p-6 rounded-2xl flex-shrink-0 backdrop-blur-2xl">
              <img src={t.avatar} className="w-14 h-14 rounded-full border-2 border-cyber-neon mx-auto mb-3" alt="" />
              <p className="text-white/90 italic">"{t.quote}"</p>
              <h4 className="text-cyber-neon mt-3 font-bold">— {t.name}</h4>
            </div>
          ))}
        </div>
      </div>
      <style>{`
        @keyframes scroll {
          0% { transform: translateX(0); }
          100% { transform: translateX(-50%); }
        }
        .animate-scroll {
          animation: scroll 20s linear infinite;
        }
        .animate-scroll:hover {
          animation-play-state: paused;
        }
      `}</style>
    </section>
  )
}