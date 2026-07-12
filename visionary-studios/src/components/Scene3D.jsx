import React from 'react'
import { Canvas } from '@react-three/fiber'
import { OrbitControls, Grid, Sparkles, Box } from '@react-three/drei'

// Simple floating cameras (3D boxes with lens)
function SimpleCamera({ position, color = '#0ff' }) {
  return (
    <group position={position}>
      {/* Body */}
      <mesh>
        <boxGeometry args={[0.8, 0.5, 0.7]} />
        <meshStandardMaterial color={color} metalness={0.8} roughness={0.2} emissive={color} emissiveIntensity={0.3} />
      </mesh>
      {/* Lens */}
      <mesh position={[0.5, 0.1, 0.35]}>
        <cylinderGeometry args={[0.2, 0.2, 0.3, 24]} />
        <meshStandardMaterial color="#fff" metalness={0.9} />
      </mesh>
      {/* Top button */}
      <mesh position={[0, 0.3, 0.2]}>
        <boxGeometry args={[0.2, 0.1, 0.2]} />
        <meshStandardMaterial color="#ff44dd" />
      </mesh>
    </group>
  )
}

function DroneModel({ position }) {
  return (
    <group position={position}>
      <mesh>
        <boxGeometry args={[0.8, 0.1, 0.8]} />
        <meshStandardMaterial color="#00e5ff" metalness={0.7} />
      </mesh>
      {[[0.5, 0, 0.5], [-0.5, 0, 0.5], [0.5, 0, -0.5], [-0.5, 0, -0.5]].map((pos, i) => (
        <mesh key={i} position={[pos[0], 0.1, pos[2]]}>
          <cylinderGeometry args={[0.08, 0.08, 0.4, 6]} />
          <meshStandardMaterial color="#ccc" />
        </mesh>
      ))}
    </group>
  )
}

export default function Scene3D() {
  return (
    <Canvas
      camera={{ position: [0, 2, 10], fov: 45 }}
      style={{ position: 'fixed', top: 0, left: 0, width: '100%', height: '100%', zIndex: 0 }}
      gl={{ alpha: false, antialias: true, powerPreference: "high-performance" }}
    >
      {/* Lighting */}
      <ambientLight intensity={0.5} />
      <pointLight position={[10, 10, 10]} intensity={1} color="#0ff" />
      <pointLight position={[-5, 5, 5]} intensity={0.8} color="#b624ff" />
      <directionalLight position={[0, 5, 0]} intensity={0.6} />

      {/* Neon grid floor */}
      <Grid
        args={[20, 20]}
        cellSize={0.5}
        cellThickness={0.5}
        cellColor="#0ff"
        sectionSize={2}
        sectionThickness={1}
        sectionColor="#b624ff"
        fadeDistance={25}
        fadeStrength={1}
      />

      {/* Particle stars */}
      <Sparkles count={2000} scale={30} size={0.1} color="#0ff" />

      {/* 3D Cameras & Drones */}
      <SimpleCamera position={[-2, 0.5, -1]} color="#0ff" />
      <SimpleCamera position={[2.2, 0.8, -0.5]} color="#b624ff" />
      <SimpleCamera position={[-1.5, -0.2, -2]} color="#00e5ff" />
      <DroneModel position={[1.5, 0.6, -1.8]} />
      <DroneModel position={[-0.5, 0.3, -2.5]} />

      {/* Auto-rotate camera for immersion */}
      <OrbitControls enableZoom={false} enablePan={false} autoRotate autoRotateSpeed={0.8} enableDamping />
    </Canvas>
  )
}