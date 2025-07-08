'use client';

import { Suspense, memo, useRef, useMemo } from 'react';
import LoadingSpinner from '@/components/ui/LoadingSpinner';
import { Canvas } from '@react-three/fiber';
import { AdaptiveDpr, AdaptiveEvents, Preload } from '@react-three/drei';
import { useNavigation } from '@/hooks/useNavigation';
import { useIsMobile } from '@/hooks/useIsMobile';
import { SpringGroup } from '../three/SpringGroup';
import { SpringCamera } from '../three/SpringCamera';
import InfiniteRoom from '../three/InfiniteRoom';
import PhoneModel from '../phone/PhoneModel';
import { easeInOut } from 'framer-motion';
import ShaderBackground from '../three/ShaderBackground';

// Performance optimized canvas wrapper with enhanced settings
const CanvasWrapper = memo(({ children }: { children: React.ReactNode }) => {
  const isMobile = useIsMobile();

  // Optimize settings based on device with more aggressive mobile optimizations
  const canvasSettings = useMemo(() => ({
    gl: {
      antialias: !isMobile, // Disable antialiasing on mobile for better performance
      alpha: true,
      powerPreference: (isMobile ? 'default' : 'high-performance') as WebGLPowerPreference,
      stencil: false,
      depth: true,
      logarithmicDepthBuffer: false,
      precision: (isMobile ? 'mediump' : 'highp') as 'highp' | 'mediump' | 'lowp', // Lower precision on mobile
    },
    dpr: (isMobile ? [0.5, 1] : [1, 2]) as [number, number], // Lower DPR on mobile
    shadows: false, // Disable shadows entirely for better performance
    performance: {
      min: isMobile ? 0.2 : 0.4, // More aggressive performance targets
      max: isMobile ? 0.6 : 1,
      debounce: isMobile ? 400 : 200, // Longer debounce on mobile
    },
    style: {
      touchAction: 'pan-x pan-y',
      outline: 'none',
      willChange: 'transform',
      contain: 'paint layout style',
    },
    // Add frame limiting for mobile
    frameloop: (isMobile ? 'demand' : 'always') as 'demand' | 'always',
  }), [isMobile]);

  return (
    <Canvas {...canvasSettings}>
      <AdaptiveDpr pixelated />
      <AdaptiveEvents />
      {!isMobile && <Preload all />} {/* Only preload on desktop */}
      {children}
    </Canvas>
  );
});

CanvasWrapper.displayName = 'CanvasWrapper';

function RootCanvasClientComponent() {
  const containerRef = useRef<HTMLDivElement>(null);
  const { currentRoute } = useNavigation();
  const isMobile = useIsMobile();

  // Don't render canvas for admin route
  if (currentRoute === 'admin') {
    return null;
  }

  // Memoize animation configurations
  const cameraAnimations = useMemo(() => [
    {
      onTrue: { position: [0, 0, 2.5] as [number, number, number], rotation: [0, 0, 0] as [number, number, number] },
      onFalse: { position: [0, 0, 2.5] as [number, number, number], rotation: [0, 0, 0] as [number, number, number] },
      onValue: Boolean(currentRoute && currentRoute !== 'home'),
    },
  ], [currentRoute]);

  const phoneAnimations = useMemo(() => [
    {
      onTrue: {
        'position-x': 0,
        'position-y': 0,
        'position-z': isMobile ? 0.5 : 1.25,
        'rotation-x': 0,
        'rotation-y': 0,
        'rotation-z': isMobile ? 0 : Math.PI / 2,
      },
      onFalse: {
        'position-x': 0,
        'position-y': 0,
        'position-z': 0,
        'rotation-x': 0,
        'rotation-y': 0,
        'rotation-z': 0,
      },
      onValue: Boolean(currentRoute && currentRoute !== 'home'),
    },
  ], [currentRoute, isMobile]);

  const pcbAnimations = useMemo(() => [
    {
      onTrue: {
        'position-x': isMobile ? -1.5 : -2.25,
        'position-y': 0,
        'position-z': isMobile ? -3 : -5,
      },
      onFalse: {
        'position-x': 0,
        'position-y': 0,
        'position-z': -2,
      },
      onValue: Boolean(currentRoute && currentRoute !== 'home'),
    },
  ], [currentRoute, isMobile]);

  return (
    <>
      <div
        ref={containerRef}
        className="fixed inset-0 w-full h-full"
        style={{
          willChange: 'transform',
          contain: 'paint layout style',
          zIndex: 0,
        }}
      >
        <Suspense
          fallback={
            <div className="flex items-center justify-center h-full">
              <LoadingSpinner />
            </div>
          }
        >
          <CanvasWrapper>
            <SpringCamera
              makeDefault
              animations={cameraAnimations}
              config={{ mass: 1, tension: 170, friction: 26 }}
            />

            {/* Background elements - rendered first with fixed positioning */}



            {/* PCB Background - also stays behind */}
            <SpringGroup
              animations={pcbAnimations}
              config={{ easing: easeInOut }}
            >
              <group position={[0, 0, -5]} renderOrder={-1}>
                <ShaderBackground shader="mosaic" intensity={1.0} speed={1.0} />
              </group>
            </SpringGroup>

            {/* Main content - phone model in foreground */}
            <InfiniteRoom color="#132a3a">
              <SpringGroup
                animations={phoneAnimations}
                config={{ mass: 1, tension: 170, friction: 26 }}
              >
                <group renderOrder={1}>
                  <PhoneModel />
                </group>
              </SpringGroup>
            </InfiniteRoom>
          </CanvasWrapper>
        </Suspense>
      </div>
    </>
  );
}

export default memo(RootCanvasClientComponent);
