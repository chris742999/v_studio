// src/context/EquipmentContext.jsx
import React, { createContext, useState, useEffect } from 'react'
import { motion, AnimatePresence } from 'framer-motion'

export const EquipmentContext = createContext()

export const EquipmentProvider = ({ children }) => {
  const [selectedEquipment, setSelectedEquipment] = useState(null)
  const [tooltip, setTooltip] = useState({ visible: false, name: '', position: null, description: '' })
  
  useEffect(() => {
    if (selectedEquipment) {
      // auto close after 5 sec? keep open until close
    }
  }, [selectedEquipment])
  
  return (
    <EquipmentContext.Provider value={{ selectedEquipment, setSelectedEquipment, tooltip, setTooltip }}>
      {children}
      <AnimatePresence>
        {selectedEquipment && (
          <motion.div initial={{ opacity: 0, scale: 0.8 }} animate={{ opacity: 1, scale: 1 }} exit={{ opacity: 0 }} className="fixed top-1/2 left-1/2 transform -translate-x-1/2 -translate-y-1/2 z-[200] w-80 glass-card p-6 rounded-2xl border-cyber-neon shadow-2xl backdrop-blur-2xl">
            <h3 className="text-2xl font-bold text-cyber-neon mb-2">{selectedEquipment.name}</h3>
            <p className="text-white/80">{selectedEquipment.description}</p>
            <p className="text-cyber-electric text-sm mt-2 font-mono">{selectedEquipment.stats}</p>
            <button onClick={() => setSelectedEquipment(null)} className="mt-4 px-4 py-1 bg-cyber-neon/20 rounded-full text-cyber-neon">✖ CLOSE</button>
          </motion.div>
        )}
      </AnimatePresence>
      <AnimatePresence>
        {tooltip.visible && (
          <motion.div initial={{ opacity: 0, y: 10 }} animate={{ opacity: 1, y: 0 }} exit={{ opacity: 0 }} className="fixed pointer-events-none z-[150] bg-black/70 backdrop-blur-md text-cyber-neon px-3 py-1 rounded-lg text-sm font-mono border border-cyber-neon" style={{ left: `${tooltip.position?.x + 20}px`, top: `${tooltip.position?.y - 40}px` }}>
            {tooltip.name} — {tooltip.description?.slice(0, 30)}
          </motion.div>
        )}
      </AnimatePresence>
    </EquipmentContext.Provider>
  )
}