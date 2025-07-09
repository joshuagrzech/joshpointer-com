'use client';

import { useEffect, useRef, useMemo } from 'react';
import { useFrame, useThree } from '@react-three/fiber';
import * as THREE from 'three';
import { useIsMobile } from '@/hooks/useIsMobile';
import { Html } from '@react-three/drei';
import { useState } from 'react';

interface PerformanceOptimizerProps {
  children: React.ReactNode;
  targetFPS?: number;
  adaptiveQuality?: boolean;
  enableLOD?: boolean;
  enableFrustumCulling?: boolean;
}

export default function PerformanceOptimizer({
  children,
  targetFPS = 60,
  adaptiveQuality = true,
  enableLOD = true,
  enableFrustumCulling = true,
}: PerformanceOptimizerProps) {
  const { gl, camera, scene } = useThree();
  const isMobile = useIsMobile();
  const frameCountRef = useRef(0);
  const lastTimeRef = useRef(0);
  const currentFPSRef = useRef(targetFPS);
  const qualityLevelRef = useRef(1.0);
  const frustumRef = useRef(new THREE.Frustum());
  const matrixRef = useRef(new THREE.Matrix4());

  // Adaptive quality settings based on device and performance
  const qualitySettings = useMemo(
    () => ({
      mobile: {
        low: { dpr: 0.5, antialias: false, shadows: false, maxLights: 2 },
        medium: { dpr: 0.75, antialias: false, shadows: false, maxLights: 3 },
        high: { dpr: 1.0, antialias: true, shadows: false, maxLights: 4 },
      },
      desktop: {
        low: { dpr: 0.75, antialias: true, shadows: false, maxLights: 3 },
        medium: { dpr: 1.0, antialias: true, shadows: true, maxLights: 4 },
        high: { dpr: 1.5, antialias: true, shadows: true, maxLights: 6 },
      },
    }),
    []
  );

  // Performance monitoring
  useFrame((state) => {
    const time = state.clock.getElapsedTime();
    frameCountRef.current++;

    // Calculate FPS every second
    if (time - lastTimeRef.current >= 1.0) {
      currentFPSRef.current = frameCountRef.current / (time - lastTimeRef.current);
      frameCountRef.current = 0;
      lastTimeRef.current = time;

      // Adaptive quality adjustment
      if (adaptiveQuality && currentFPSRef.current < targetFPS * 0.8) {
        qualityLevelRef.current = Math.max(0.5, qualityLevelRef.current - 0.1);
      } else if (adaptiveQuality && currentFPSRef.current > targetFPS * 0.9) {
        qualityLevelRef.current = Math.min(1.0, qualityLevelRef.current + 0.05);
      }
    }

    // Update frustum for culling
    if (enableFrustumCulling) {
      matrixRef.current.multiplyMatrices(camera.projectionMatrix, camera.matrixWorldInverse);
      frustumRef.current.setFromProjectionMatrix(matrixRef.current);
    }
  });

  // Apply quality settings
  useEffect(() => {
    const deviceType = isMobile ? 'mobile' : 'desktop';
    const qualityLevel = qualityLevelRef.current;

    let settings;
    if (qualityLevel < 0.6) {
      settings = qualitySettings[deviceType].low;
    } else if (qualityLevel < 0.8) {
      settings = qualitySettings[deviceType].medium;
    } else {
      settings = qualitySettings[deviceType].high;
    }

    // Apply DPR
    gl.setPixelRatio(settings.dpr);

    // Apply shadow settings
    gl.shadowMap.enabled = settings.shadows;
    if (settings.shadows) {
      gl.shadowMap.type = THREE.PCFSoftShadowMap;
    }
  }, [gl, isMobile, qualitySettings]);

  // LOD system for complex objects
  const LODGroup = useMemo(() => {
    if (!enableLOD) return null;

    return ({
      children,
      position,
    }: {
      children: React.ReactNode;
      position: [number, number, number];
    }) => {
      const lodRef = useRef<THREE.LOD>(null);

      useFrame(() => {
        if (lodRef.current) {
          const distance = camera.position.distanceTo(lodRef.current.position);
          lodRef.current.update(camera);
        }
      });

      return (
        <group position={position}>
          <primitive object={new THREE.LOD()} ref={lodRef}>
            {children}
          </primitive>
        </group>
      );
    };
  }, [camera, enableLOD]);

  // Frustum culling component
  const FrustumCulled = useMemo(() => {
    if (!enableFrustumCulling)
      return ({ children }: { children: React.ReactNode }) => <>{children}</>;

    return ({
      children,
      position,
    }: {
      children: React.ReactNode;
      position: [number, number, number];
    }) => {
      const meshRef = useRef<THREE.Mesh>(null);
      const [isVisible, setIsVisible] = useState(true);

      useFrame(() => {
        if (meshRef.current && frustumRef.current) {
          const box = new THREE.Box3().setFromObject(meshRef.current);
          const visible = frustumRef.current.intersectsBox(box);
          setIsVisible(visible);
        }
      });

      if (!isVisible) return null;

      return (
        <mesh ref={meshRef} position={position}>
          {children}
        </mesh>
      );
    };
  }, [enableFrustumCulling]);

  return (
    <>
      {children}
      {/* Performance monitoring overlay (development only) */}
      {process.env.NODE_ENV === 'development' && (
        <Html position={[0, 0, 0]}>
          <div
            style={{
              position: 'fixed',
              top: '10px',
              right: '10px',
              background: 'rgba(0,0,0,0.8)',
              color: 'white',
              padding: '10px',
              borderRadius: '5px',
              fontSize: '12px',
              fontFamily: 'monospace',
            }}
          >
            <div>FPS: {Math.round(currentFPSRef.current)}</div>
            <div>Quality: {Math.round(qualityLevelRef.current * 100)}%</div>
            <div>Device: {isMobile ? 'Mobile' : 'Desktop'}</div>
          </div>
        </Html>
      )}
    </>
  );
}
