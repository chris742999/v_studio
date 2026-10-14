import { useRef } from "react";
import { useGLTF } from "@react-three/drei";
import { useFrame } from "@react-three/fiber";
import droneModel from "../../assets/models/drone.glb";

export default function DroneModel() {
  const drone = useRef();

  const { scene } = useGLTF(droneModel);

 useFrame(({ mouse, clock }) => {
  if (!drone.current) return;

  drone.current.position.y =
    Math.sin(clock.elapsedTime * 1.5) * 0.15;

  drone.current.rotation.x +=
    ((-mouse.y * 0.45) - drone.current.rotation.x) * 0.06;

  drone.current.rotation.y +=
    ((mouse.x * 1.2) - drone.current.rotation.y) * 0.06;

  drone.current.rotation.z +=
    ((-mouse.x * 0.18) - drone.current.rotation.z) * 0.06;
});

  return (
    <primitive
  ref={drone}
  object={scene}
  scale={0.1}
  position={[0, -0.3, 0]}
  rotation={[0, Math.PI, 0]}
/>
  );
}

useGLTF.preload(droneModel);