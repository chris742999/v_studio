// src/components/Contact.jsx
import React from 'react'
import { motion } from 'framer-motion'

export default function Contact() {
  return (
    <section className="py-28 px-6 relative" id="contact">
      <div className="max-w-5xl mx-auto glass-card p-8 md:p-12 rounded-3xl backdrop-blur-2xl">
        <h2 className="text-4xl font-bold text-cyber-neon text-center mb-8">🔗 NEURAL CONNECTION</h2>
        <div className="grid md:grid-cols-2 gap-8">
          <div>
            <input type="text" placeholder="NEURAL ID" className="w-full glass p-4 rounded-xl bg-black/30 text-white placeholder:text-cyan-500/50 outline-none border border-cyber-neon/50 focus:border-cyber-neon transition-all" />
            <input type="email" placeholder="QUANTUM MAIL" className="w-full glass p-4 rounded-xl mt-4 bg-black/30 text-white" />
            <textarea placeholder="HOLOGRAPHIC MESSAGE" rows={4} className="w-full glass p-4 rounded-xl mt-4 bg-black/30 text-white"></textarea>
            <button className="mt-6 w-full glass py-3 rounded-xl text-cyber-neon font-bold border border-cyber-neon hover:bg-cyber-neon/30 transition-all">⚡ TRANSMIT</button>
          </div>
          <div className="relative">
            <div className="glass p-4 rounded-xl h-full flex items-center justify-center">
              <div className="text-center"><div className="w-48 h-48 rounded-full bg-cyber-neon/10 animate-pulse flex items-center justify-center mx-auto"><span className="text-5xl">🌍</span></div><p className="mt-4 text-cyber-neon">HQ: NEO TOKYO • 24/7 HOLO-SUPPORT</p><div className="flex justify-center gap-4 mt-6">{['IG', 'X', 'DISCORD', 'META'].map(s => <a key={s} className="glass px-4 py-2 rounded-full text-cyan-400 hover:text-cyber-neon">{s}</a>)}</div></div>
            </div>
          </div>
        </div>
      </div>
    </section>
  )
}