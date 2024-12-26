import { useRef, useMemo } from "react";
import { Group, Color, DirectionalLight } from "three";
import { Backdrop, Environment, BakeShadows, AccumulativeShadows, RandomizedLight, useHelper } from "@react-three/drei";
import { DirectionalLightHelper } from "three";

interface InfiniteRoomProps {
  children: React.ReactNode;
  roomSize?: number;
  color?: string;
  opacity?: number;
  floatHeight?: number;
  showHelpers?: boolean;
}

export default function InfiniteRoom({ 
  children, 
  roomSize = 20, 
  color = "#0000ff",
  floatHeight = 0.5,
  showHelpers = false,
  opacity = 0.8
}: InfiniteRoomProps) {
  const groupRef = useRef<Group>(null);
  const lightRef = useRef<DirectionalLight>(null);
  
  // Only show helpers in development
  if (showHelpers && process.env.NODE_ENV === 'development') {
    useHelper(lightRef as React.MutableRefObject<DirectionalLight>, DirectionalLightHelper, 1, 'red');
  }

  // Memoize color to prevent unnecessary updates
  const backdropMaterial = useMemo(() => ({
    color: new Color(color),
    opacity,
    transparent: opacity < 1,
  }), [color, opacity]);

  return (
    <group ref={groupRef} rotation={[0, 0, 0]}>
      {/* Optimized lighting setup */}
      <ambientLight intensity={0.4} />
      
      <directionalLight
        ref={lightRef}
        position={[5, 5, 5]}
        intensity={0.6}
        castShadow
        shadow-mapSize={[2048, 2048]}
        shadow-bias={-0.0001}
      >
        <orthographicCamera attach="shadow-camera" args={[-10, 10, 10, -10]} />
      </directionalLight>

      {/* Additional rim light for depth */}
      <directionalLight
        position={[-5, 3, -5]}
        intensity={0.2}
        color="#6495ED"
      />

      {/* Bake shadows for performance */}
      <BakeShadows />


      {/* Enhanced environment */}
      <Environment
        preset="city"
        background={false}
        blur={0.8}
      />
{/* 
      <Backdrop
        receiveShadow
        castShadow
        floor={roomSize/2}
        segments={20}
        scale={[roomSize, roomSize/2, 1]}
        position={[0, floatHeight * -1.15, -roomSize/4]}
      >
        <meshStandardMaterial 
          {...backdropMaterial}
        
        />
      </Backdrop> */}

      {/* Children positioned above the floor */}
      <group position={[0, 0, 0]}>
        {children}
      </group>
    </group>
  );
} 