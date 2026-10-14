// src/components/EquipmentModels.jsx
import React, { useRef, useState, useContext } from 'react'
import { useFrame } from '@react-three/fiber'
import { Html, Text, Float } from '@react-three/drei'
import * as THREE from 'three'
import { EquipmentContext } from '../context/EquipmentContext'

// individual equipment with hover & click
const EquipmentItem = ({ position, model, name, description, stats, color = '#0ff' }) => {
  const meshRef = useRef()
  const [hovered, setHovered] = useState(false)
  const { setSelectedEquipment, setTooltip } = useContext(EquipmentContext)
  
  useFrame((state, delta) => {
    if (meshRef.current) {
      // floating animation
      meshRef.current.position.y = position[1] + Math.sin(Date.now() * 0.002) * 0.1
      // rotation
      if (!hovered) {
        meshRef.current.rotation.y += 0.005
        meshRef.current.rotation.x = Math.sin(Date.now() * 0.001) * 0.1
      } else {
        meshRef.current.rotation.y += 0.02
      }
    }
  })
  
  const handleClick = () => {
    setSelectedEquipment({ name, description, stats, modelType: name })
  }
  
  const handleOver = (e) => {
    e.stopPropagation()
    setHovered(true)
    setTooltip({ visible: true, name, position: e.point, description })
    document.body.style.cursor = 'pointer'
  }
  
  const handleOut = () => {
    setHovered(false)
    setTooltip({ visible: false })
    document.body.style.cursor = 'auto'
  }
  
  return (
    <Float speed={2} rotationIntensity={0.5} floatIntensity={0.5}>
      <mesh
        ref={meshRef}
        position={position}
        onPointerOver={handleOver}
        onPointerOut={handleOut}
        onClick={handleClick}
        scale={hovered ? [1.2, 1.2, 1.2] : [1, 1, 1]}
      >
        {model}
        <meshStandardMaterial
          color={color}
          emissive={hovered ? color : '#000'}
          emissiveIntensity={hovered ? 0.8 : 0.2}
          metalness={0.9}
          roughness={0.2}
          transparent
          opacity={0.95}
        />
      </mesh>
    </Float>
  )
}

// Model Creators
const createDSLR = () => (
  <group>
    <boxGeometry args={[0.8, 0.6, 0.9]} />
    <mesh position={[0.4, 0.2, 0.3]}><cylinderGeometry args={[0.2, 0.2, 0.4, 24]} /></mesh>
    <mesh position={[-0.3, 0.3, 0.45]}><boxGeometry args={[0.2, 0.1, 0.2]} /></mesh>
  </group>
)

const createMirrorless = () => (
  <group>
    <boxGeometry args={[0.7, 0.5, 0.7]} />
    <mesh position={[0.35, 0.15, 0.25]}><cylinderGeometry args={[0.18, 0.18, 0.35, 24]} /></mesh>
  </group>
)

const createLens = () => <cylinderGeometry args={[0.3, 0.25, 0.6, 32]} />
const createDrone = () => (
  <group>
    <boxGeometry args={[0.9, 0.1, 0.9]} />
    {[1, -1, 1, -1].map((x, i) => (
      <mesh key={i} position={[x * 0.6, 0, (i%2===0?0.6:-0.6)]}><cylinderGeometry args={[0.08, 0.08, 0.5, 6]} /></mesh>
    ))}
  </group>
)
const createGimbal = () => <torusGeometry args={[0.4, 0.05, 32, 100]} />
const createTripod = () => <group><cylinderGeometry args={[0.1, 0.2, 0.8, 6]} /></group>
const createLighting = () => <sphereGeometry args={[0.4, 32, 32]} />
const createMemoryCard = () => <boxGeometry args={[0.5, 0.05, 0.3]} />
const createAccessory = () => <torusKnotGeometry args={[0.2, 0.05, 100, 16]} />

const equipmentData = [
  { name: 'DSLR Phantom X', model: createDSLR(), pos: [-2.2, 0.2, -1], color: '#0ff', description: '45MP Full-frame, 8K video', stats: 'ISO 102400, 20fps' },
  { name: 'Mirrorless Aether', model: createMirrorless(), pos: [2.5, 0.3, -0.5], color: '#b624ff', description: 'Mirrorless 60MP, IBIS', stats: 'Weight 490g' },
  { name: 'Nano Lens 50mm', model: createLens(), pos: [-1, 0.8, -1.8], color: '#0ff', description: 'f/1.2 Holographic Coating', stats: 'L-Mount' },
  { name: 'Drone SkyHawk', model: createDrone(), pos: [3.2, 0.5, -2], color: '#00e5ff', description: '8K Gimbal, 40min flight', stats: 'LiDAR obstacle' },
  { name: 'SteadyGimbal Pro', model: createGimbal(), pos: [-2.8, -0.2, -2.5], color: '#0ff', description: '3-axis carbon fiber', stats: '12kg payload' },
  { name: 'Carbon Tripod', model: createTripod(), pos: [0.5, -0.3, -3], color: '#b624ff', description: 'Carbon fiber legs', stats: 'Height 180cm' },
  { name: 'RGB Studio Light', model: createLighting(), pos: [-1.5, 1.2, -2.2], color: '#ff44dd', description: 'RGBWW, App control', stats: '2000Lux' },
  { name: 'HyperCard 1TB', model: createMemoryCard(), pos: [1.8, 0.1, -2.7], color: '#0ff', description: 'V90, 1800MB/s', stats: 'ProGrade' },
  { name: 'Grip Pod', model: createAccessory(), pos: [-0.2, -0.5, -1.5], color: '#77aaff', description: 'Ergonomic battery grip', stats: 'Extra power' },
]

export default function EquipmentModels() {
  return (
    <group>
      {equipmentData.map((item, idx) => (
        <EquipmentItem key={idx} position={item.pos} model={item.model} name={item.name} description={item.description} stats={item.stats} color={item.color} />
      ))}
    </group>
  )
}