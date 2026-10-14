// src/components/Services.jsx
import React from 'react'
import { motion } from 'framer-motion'
import { Camera, Users, Briefcase, PartyPopper, Drone, Video } from 'lucide-react'

const services = [
  { icon: Camera, title: 'Wedding Photography', desc: 'Ethereal storytelling with holographic albums' },
  { icon: Users, title: 'Event Photography', desc: 'Immersive event capture & realtime holograms' },
  { icon: Briefcase, title: 'Commercial', desc: 'Product visualization & AR campaigns' },
  { icon: PartyPopper, title: 'Portrait', desc: 'Cyberpunk & futuristic editorial' },
  { icon: Drone, title: 'Drone Cinematography', desc: 'Aerial 8K holographic shots' },
  { icon: Video, title: 'Videography', desc: '360° spatial films' },
]

export default function Services() {
  return (
    <section className="py-28 px-6 relative" id="services">
      <h2 className="section-title text-5xl font-bold text-center text-cyber-neon mb-16 tracking-wider">⚡ QUANTUM SERVICES</h2>
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-8 max-w-7xl mx-auto">
        {services.map((service, idx) => (
          <motion.div key={idx} className="glass-card p-6 rounded-2xl hover:scale-105 transition-all duration-500 group cursor-pointer" initial={{ opacity: 0, y: 50 }} whileInView={{ opacity: 1, y: 0 }} viewport={{ once: true }} transition={{ delay: idx * 0.1 }}>
            <service.icon className="text-cyber-neon w-12 h-12 mb-4 group-hover:neon-text" />
            <h3 className="text-2xl font-bold text-white">{service.title}</h3>
            <p className="text-gray-300 mt-2">{service.desc}</p>
            <div className="mt-4 w-12 h-0.5 bg-cyber-neon group-hover:w-full transition-all duration-300"></div>
          </motion.div>
        ))}
      </div>
    </section>
  )
}