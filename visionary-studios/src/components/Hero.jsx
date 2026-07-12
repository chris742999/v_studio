// src/components/Hero.jsx
import React from 'react'
import { motion } from 'framer-motion'
import { Typewriter } from 'react-simple-typewriter'

export default function Hero() {
  return (
    <section className="min-h-screen flex items-center justify-center px-6 relative overflow-hidden">
      <div className="text-center z-20 max-w-5xl mx-auto">
        <motion.h1 className="text-6xl md:text-8xl font-black tracking-tighter bg-gradient-to-r from-cyber-neon via-purple-400 to-cyber-electric bg-clip-text text-transparent" initial={{ y: -50, opacity: 0 }} animate={{ y: 0, opacity: 1 }} transition={{ duration: 0.8 }}>
          Capturing Moments <br /> <span className="neon-text inline-block">Beyond Reality</span>
        </motion.h1>
        <motion.div className="text-xl md:text-2xl text-cyan-200/80 mt-6 font-mono" initial={{ opacity: 0 }} animate={{ opacity: 1 }} transition={{ delay: 0.4 }}>
          <Typewriter words={['Futuristic Cinematography', 'AI-Enhanced Visuals', 'Holographic Immersion']} loop={true} cursor cursorColor="#0ff" />
        </motion.div>
        <motion.div className="flex flex-wrap justify-center gap-6 mt-10" initial={{ scale: 0.8, opacity: 0 }} animate={{ scale: 1, opacity: 1 }} transition={{ delay: 0.6 }}>
          <button className="glass px-8 py-4 rounded-full font-bold text-cyber-neon border border-cyber-neon hover:bg-cyber-neon/20 transition-all text-lg tracking-wider backdrop-blur-xl">📸 BOOK A SESSION</button>
          <button className="glass px-8 py-4 rounded-full font-bold text-white border border-white/30 hover:border-cyber-neon transition-all text-lg backdrop-blur-xl">✨ EXPLORE PORTFOLIO</button>
        </motion.div>
      </div>
      <div className="absolute bottom-10 left-1/2 transform -translate-x-1/2 animate-bounce">
        <div className="w-6 h-10 border-2 border-cyber-neon rounded-full flex justify-center"><div className="w-1 h-2 bg-cyber-neon rounded-full mt-2 animate-pulse"></div></div>
      </div>
    </section>
  )
}