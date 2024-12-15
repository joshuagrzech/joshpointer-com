import { useRef } from "react";
import { useFrame } from "@react-three/fiber";
import { Float, Html } from "@react-three/drei";
import { Mesh } from "three";
import PhoneScreen from "./PhoneScreen";

export default function FloatingPhone() {
  const phoneRef = useRef<Mesh>(null);

  useFrame((state) => {
    if (!phoneRef.current) return;
    phoneRef.current.rotation.y = Math.sin(state.clock.elapsedTime * 0.5) * 0.1;
  });

  return (
    <>
      <ambientLight intensity={0.5} />
      <directionalLight position={[10, 10, 5]} intensity={1} />
      <Float speed={2} rotationIntensity={0.5} floatIntensity={0.5} castShadow>
        <group ref={phoneRef}>
          <Html
            transform
            position={[0, 0, 0.11]}
            scale={0.2}
            castShadow
            rotation={[0, 0, 0]}
            occlude
          >
            <PhoneScreen />
          </Html>
        </group>
      </Float>
    </>
  );
}
