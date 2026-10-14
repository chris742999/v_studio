import { Float, useGLTF } from "@react-three/drei";
import { useFrame } from "@react-three/fiber";
import { useRef } from "react";
import { useEffect } from "react";
import gsap from "gsap";

useGLTF.preload("/models/camera.glb");

export default function CameraModel() {
  const { scene } = useGLTF("/models/camera.glb");

  const cameraRef = useRef();
  useEffect(() => {
  if (!cameraRef.current) return;

  // Start below the screen
  cameraRef.current.position.y = -4;

  // Start rotated
  cameraRef.current.rotation.y = -1.5;

  // Animate upward
  gsap.to(cameraRef.current.position, {
    y: -1,
    duration: 2,
    ease: "power3.out",
  });

  // Rotate into place
  gsap.to(cameraRef.current.rotation, {
    y: 0,
    duration: 2,
    ease: "power3.out",
  });
}, []);

  useFrame(() => {
    if (!cameraRef.current) return;

    cameraRef.current.rotation.y += 0.01;
  });

  return (
    <Float
      speed={1.2}
      rotationIntensity={0.25}
      floatIntensity={0.8}
    >
      <primitive
        ref={cameraRef}
        object={scene}
        scale={15}
        position={[2.5, -1, 0]}
      />
    </Float>
  );
}