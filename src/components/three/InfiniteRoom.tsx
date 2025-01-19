'use client';

import { useRef } from 'react';
import { Group, DirectionalLight } from 'three';
import { Environment, BakeShadows, useHelper } from '@react-three/drei';
import { DirectionalLightHelper } from 'three';

interface InfiniteRoomProps {
  children: React.ReactNode;
  roomSize?: number;
  color?: string;
  opacity?: number;
  floatHeight?: number;
  showHelpers?: boolean;
}

export default function InfiniteRoom({ children, showHelpers = false }: InfiniteRoomProps) {
  const groupRef = useRef<Group>(null);
  const lightRef = useRef<DirectionalLight>(null) as React.MutableRefObject<DirectionalLight>;

  useHelper(
    showHelpers && process.env.NODE_ENV === 'development' ? lightRef : null,
    DirectionalLightHelper
  );

  return (
    <group ref={groupRef}>
      {/* Main directional light */}
      <directionalLight
        ref={lightRef}
        position={[10, 10, 10]}
        intensity={1}
        castShadow
        shadow-mapSize={[1024, 1024]}
      />

      {/* Bake shadows for performance */}
      <BakeShadows />

      {/* Enhanced environment */}
      <Environment
        preset={'studio'}
        environmentRotation={[0, Math.PI * 0.15, 0]}
        background={false}
      />

      {/* Children positioned above the floor */}
      <group position={[0, 0, 0]}>{children}</group>
    </group>
  );
}
