'use client';

import React, { useMemo, useRef, useEffect } from 'react';
import { Html } from '@react-three/drei';
import { useFrame, useThree } from '@react-three/fiber';
import * as THREE from 'three';
import PhoneScreen from './PhoneScreen';
import GlassRectangle from '../ui/GlassRectangle';
import { useTransparency } from '../ui/TransparencyToggle';
import PhoneGLB from './PhoneGLB';

export default function PhoneModel() {
  const meshRef = useRef<THREE.Mesh>(null);
  const { gl, scene, camera, viewport } = useThree();
  const { isTransparencyEnabled } = useTransparency();
  const size = {
    width: 2286,
    height: 1232,
    top: 0,
    left: 0,
    updateStyle: true,
  };
  // iPhone aspect ratio (roughly 19.5:9 or 2.17:1)
  const iPhoneAspectRatio = 9 / 10;
  const phoneWidth = 1.5;
  const phoneHeight = phoneWidth / iPhoneAspectRatio;

  // Create render target that matches viewport size
  const renderTarget = useMemo(() => {
    return new THREE.WebGLRenderTarget(size.width, size.height, {
      minFilter: THREE.LinearFilter,
      magFilter: THREE.LinearFilter,
      format: THREE.RGBAFormat,
    });
  }, [size.width, size.height]);

  // Update render target size when viewport changes
  useEffect(() => {
    renderTarget.setSize(size.width, size.height);
  }, [size.width, size.height, renderTarget]);

  return (
    <group rotation={[0, 0, 0]} position={[0, 0, 0]}>
      <GlassRectangle
        position={[0, 0, -0.5]}
        width={1}
        height={2}
        refractiveIndex={2}
        chromaticAberration={0.2}
      >
        {/* Phone screen overlay */}
        <Html
          transform
          center
          distanceFactor={0.31}
          position={[0, 0, 0]}
          rotation={[0, 0, 0]}
          style={{
            transform: 'rotateY(0deg)',
          }}
          contentEditable={false}
        >
          <PhoneScreen />
        </Html>
      </GlassRectangle>
    </group>
  );
}
