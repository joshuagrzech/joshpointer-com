'use client';

import { Suspense, memo, useRef, useMemo, useEffect } from 'react';
import LoadingSpinner from '@/components/ui/LoadingSpinner';
import { Canvas } from '@react-three/fiber';
import { AdaptiveDpr, AdaptiveEvents, Html, Preload } from '@react-three/drei';
import { useNavigation } from '@/hooks/useNavigation';
import { useIsMobile } from '@/hooks/useIsMobile';
import { SpringGroup } from '../three/SpringGroup';
import { SpringCamera } from '../three/SpringCamera';
import InfiniteRoom from '../three/InfiniteRoom';
import { easeInOut } from 'framer-motion';
import { devConfig, getDevKey, devLog } from '@/lib/dev-config';
import GlassRectangle from '../ui/GlassRectangle';
import PhoneModel from '../phone/PhoneModel';
import LayeredWaveShaderDemo from '../three/LayeredWaveShaderDemo';
import { useTransparency } from '../ui/TransparencyToggle';
import GlassCircle from '../ui/GlassCircle';
import PhoneGLB from '../phone/PhoneGLB';

// Performance optimized canvas wrapper with enhanced settings
const CanvasWrapper = memo(({ children }: { children: React.ReactNode }) => {
  const isMobile = useIsMobile();

  // Optimize settings based on device with development considerations
  const canvasSettings = useMemo(
    () => ({
      gl: {
        antialias: devConfig.three.antialias && !isMobile, // Use dev config for antialiasing
        alpha: true,
        powerPreference: (isMobile ? 'default' : 'high-performance') as WebGLPowerPreference,
        stencil: false,
        depth: true,
        logarithmicDepthBuffer: false,
        precision: devConfig.three.precision as 'highp' | 'mediump' | 'lowp', // Use dev config for precision
      },
      dpr: devConfig.performance.dpr as [number, number], // Use dev config for DPR
      shadows: devConfig.three.shadows, // Use dev config for shadows
      performance: {
        min: devConfig.performance.min, // Use dev config for performance
        max: devConfig.performance.max,
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
    }),
    [isMobile]
  );

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
  const { isTransparencyEnabled } = useTransparency();

  // Don't render canvas for admin route
  if (currentRoute === 'admin') {
    return null;
  }

  // Memoize animation configurations
  const cameraAnimations = useMemo(
    () => [
      {
        onTrue: {
          position: [0, 0, 2.5] as [number, number, number],
          rotation: [0, 0, 0] as [number, number, number],
        },
        onFalse: {
          position: [0, 0, 2.5] as [number, number, number],
          rotation: [0, 0, 0] as [number, number, number],
        },
        onValue: Boolean(currentRoute && currentRoute !== 'home'),
      },
    ],
    [currentRoute]
  );

  const phoneAnimations = useMemo(
    () => [
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
    ],
    [currentRoute, isMobile]
  );

  const pcbAnimations = useMemo(
    () => [
      {
        onTrue: {
          'position-x': 0,
          'position-y': 0,
          'position-z': 0,
        },
        onFalse: {
          'position-x': 0,
          'position-y': 0,
          'position-z': 0,
        },
        onValue: Boolean(currentRoute && currentRoute !== 'home'),
      },
    ],
    [currentRoute, isMobile]
  );

  // Force re-render in development for better hot reload
  const canvasKey = useMemo(() => {
    return getDevKey('canvas');
  }, []);

  // Development hot reload handling
  useEffect(() => {
    if (devConfig.hotReload.logEvents) {
      devLog('Canvas component mounted', { currentRoute, isMobile });
    }
  }, [currentRoute, isMobile]);

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
          <CanvasWrapper key={canvasKey}>
            <SpringCamera
              makeDefault
              animations={cameraAnimations}
              config={{ mass: 1, tension: 170, friction: 26 }}
            />

            <group renderOrder={0} position={[0, 0, -18]}>
              <SpringGroup animations={pcbAnimations} config={{ easing: easeInOut }}>
                <LayeredWaveShaderDemo
                  preset={'ocean'}
                  interactive={false}
                  speed={3}
                  intensity={1.0}
                />
              </SpringGroup>
            </group>

            {/* Main content - phone model in foreground */}
            <InfiniteRoom color="#132a3a">
              <group renderOrder={2}>
                <SpringGroup
                  animations={phoneAnimations}
                  config={{ mass: 1, tension: 170, friction: 26 }}
                >
                  {isTransparencyEnabled ? <PhoneGLB /> : <PhoneModel />}
                </SpringGroup>
              </group>
              <group renderOrder={1}>
                <GlassCircle
                  position={[1, 0, 0]}
                  size={0.5}
                  refractiveIndex={2}
                  chromaticAberration={0.2}
                  onClick={() => console.log('Rectangle clicked!')}
                />
                <GlassRectangle
                  position={[-1, 0, 0]}
                  width={0.5}
                  height={0.5}
                  refractiveIndex={2}
                  chromaticAberration={0.2}
                  onClick={() => console.log('Rectangle clicked!')}
                />
              </group>
            </InfiniteRoom>
          </CanvasWrapper>
        </Suspense>
      </div>
    </>
  );
}

export default memo(RootCanvasClientComponent);
