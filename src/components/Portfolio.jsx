// src/components/Portfolio.jsx
import React, { useState } from 'react'
import { motion, AnimatePresence } from 'framer-motion'

const projects = [
  { id: 1, category: 'wedding', title: 'Neon Vows', img: 'https://picsum.photos/id/104/500/600', desc: 'Cyberpunk wedding story' },
  { id: 2, category: 'portrait', title: 'Digital Diva', img: 'https://picsum.photos/id/169/500/600', desc: 'Holographic portrait' },
  { id: 3, category: 'commercial', title: 'HyperCar Vision', img: 'https://picsum.photos/id/111/500/600', desc: 'Automotive future' },
  { id: 4, category: 'event', title: 'TechFest 2025', img: 'https://picsum.photos/id/96/500/600', desc: 'Immersive event' },
  { id: 5, category: 'drone', title: 'City of Light', img: 'https://picsum.photos/id/15/500/600', desc: 'Aerial holography' },
  { id: 6, category: 'videography', title: 'Ethereal', img: 'https://picsum.photos/id/20/500/600', desc: 'Short film still' },
]

export default function Portfolio() {
  const [filter, setFilter] = useState('all')
  const [lightbox, setLightbox] = useState(null)
  
  const filtered = filter === 'all' ? projects : projects.filter(p => p.category === filter)
  
  return (
    <section className="py-28 px-6 bg-black/40" id="portfolio">
      <h2 className="section-title text-5xl font-bold text-center text-cyber-neon mb-8">⚡ HOLOGRAPHIC GALLERY</h2>
      <div className="flex flex-wrap justify-center gap-4 mb-12">
        {['all', 'wedding', 'portrait', 'commercial', 'event', 'drone', 'videography'].map(cat => (
          <button key={cat} onClick={() => setFilter(cat)} className={`glass px-6 py-2 rounded-full capitalize transition-all ${filter === cat ? 'bg-cyber-neon text-black' : 'text-cyber-neon'}`}>{cat}</button>
        ))}
      </div>
      <div className="columns-1 md:columns-2 lg:columns-3 gap-6 max-w-7xl mx-auto space-y-6">
        {filtered.map(project => (
          <motion.div key={project.id} layout whileHover={{ scale: 1.02 }} className="break-inside-avoid cursor-pointer relative group" onClick={() => setLightbox(project)}>
            <img src={project.img} alt={project.title} className="rounded-2xl w-full object-cover shadow-2xl border border-cyber-neon/30" />
            <div className="absolute inset-0 bg-gradient-to-t from-black/80 via-transparent to-transparent opacity-0 group-hover:opacity-100 transition-all rounded-2xl flex items-end p-4">
              <p className="text-white font-bold">{project.title}</p>
            </div>
          </motion.div>
        ))}
      </div>
      <AnimatePresence>
        {lightbox && (
          <motion.div initial={{ opacity: 0 }} animate={{ opacity: 1 }} exit={{ opacity: 0 }} className="fixed inset-0 bg-black/90 z-[1000] flex items-center justify-center p-4" onClick={() => setLightbox(null)}>
            <motion.img src={lightbox.img} alt={lightbox.title} className="max-h-[90vh] max-w-[90vw] rounded-2xl border-4 border-cyber-neon" initial={{ scale: 0.8 }} animate={{ scale: 1 }} />
            <button className="absolute top-6 right-6 text-cyber-neon text-3xl">✖</button>
          </motion.div>
        )}
      </AnimatePresence>
    </section>
  )
}