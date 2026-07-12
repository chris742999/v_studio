import { Canvas } from "@react-three/fiber";
import { OrbitControls, Float, Stars } from "@react-three/drei";
import CameraModel from "./CameraModel";
import { useFrame, useThree } from "@react-three/fiber";
import * as THREE from "three";
import { EffectComposer, Bloom } from "@react-three/postprocessing";

function FloatingSphere() {
  return (
    <Float
      speed={2}
      rotationIntensity={1.5}
      floatIntensity={2}
    >
      <mesh>
        <icosahedronGeometry args={[1.5, 1]} />
        <meshStandardMaterial
          color="#00E5FF"
          metalness={1}
          roughness={0.1}
        />
      </mesh>
    </Float>
  );
}
function CameraRig() {
  const { camera, mouse } = useThree();

  useFrame(() => {
    camera.position.x = THREE.MathUtils.lerp(
      camera.position.x,
      mouse.x * 0.8,
      0.05
    );

    camera.position.y = THREE.MathUtils.lerp(
      camera.position.y,
      mouse.y * 0.5,
      0.05
    );

    camera.lookAt(0, 0, 0);
  });

  return null;
}

export default function Scene3D() {
  return (
    <Canvas camera={{ position: [0, 0, 6], fov: 60 }}>
      <color attach="background" args={["#030712"]} />
      <fog attach="fog" args={["#030712", 8, 20]} />

      {/* Soft ambient light */}
<ambientLight intensity={0.25} />

{/* Main white studio light */}
<directionalLight
  position={[6, 6, 6]}
  intensity={3.5}
  color="white"
/>

{/* Blue rim light */}
<pointLight
  position={[5, 2, 3]}
  intensity={35}
  color="#00E5FF"
/>

{/* Purple back light */}
<pointLight
  position={[-5, 2, -3]}
  intensity={25}
  color="#7C3AED"
/>

{/* Soft top light */}
<spotLight
  position={[0, 8, 5]}
  angle={0.45}
  penumbra={1}
  intensity={30}
  color="white"
/>

     <Stars
  radius={120}
  depth={80}
  count={8000}
  factor={6}
  saturation={0}
  fade
  speed={1}
/>
<CameraRig />
<CameraModel />

      {/* <OrbitControls
  enableZoom={false}
  autoRotate={false}
/> */}
    </Canvas>
  );
}