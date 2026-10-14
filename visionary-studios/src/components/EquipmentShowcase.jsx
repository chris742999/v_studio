// src/components/EquipmentShowcase.jsx
import React, { useContext } from 'react'
import { motion } from 'framer-motion'
import { EquipmentContext } from '../context/EquipmentContext'

export default function EquipmentShowcase() {
  const { setSelectedEquipment } = useContext(EquipmentContext)
  const statsList = [
    { name: 'DSLR Phantom X', stat: '45MP | 20fps | 8K' },
    { name: 'Mirrorless Aether', stat: '60MP | IBIS | 30fps' },
    { name: 'Nano Lens 50mm', stat: 'f/1.2 | Nano AR' },
  ]
  
  return (
    <section className="py-28 px-6 relative" id="equipment">
      <div className="text-center mb-12">
        <h2 className="text-5xl font-bold text-cyber-neon">🔮 GEAR MATRIX</h2>
        <p className="text-cyber-electric/70 mt-2">Interactive holographic equipment — hover & click to explore</p>
      </div>
      <div className="grid grid-cols-1 md:grid-cols-3 gap-6 max-w-5xl mx-auto">
        {statsList.map((item, idx) => (
          <motion.div key={idx} className="glass-card p-6 text-center" whileHover={{ y: -5 }} onClick={() => setSelectedEquipment({ name: item.name, description: item.stat, stats: 'Pro cinema grade' })}>
            <h3 className="text-2xl text-cyber-neon">{item.name}</h3>
            <p className="font-mono text-sm">{item.stat}</p>
            <div className="mt-3 h-1 w-full bg-gradient-to-r from-cyber-neon to-purple-500 rounded-full"></div>
          </motion.div>
        ))}
      </div>
      <div className="text-center mt-8 text-xs text-cyan-500/60">✨ 3D objects floating — interact directly in the holographic space ✨</div>
    </section>
  )
}