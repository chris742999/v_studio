import { useRef } from "react";
import { useFrame } from "@react-three/fiber";

export default function LensGlow() {
  const glow = useRef();

  useFrame(({ clock }) => {
    const t = clock.getElapsedTime();

    glow.current.scale.setScalar(1 + Math.sin(t * 2) * 0.08);

    glow.current.material.opacity =
      0.55 + Math.sin(t * 2) * 0.15;
  });

  return (
    <mesh position={[0, 0, 0]}>
      <circleGeometry args={[0.28, 64]} />

      <meshBasicMaterial
        ref={glow}
        color="#00E5FF"
        transparent
        opacity={0.6}
      />
    </mesh>
  );
}