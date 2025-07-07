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
import RandomPCB from '../three/RandomPCB';
import { easeInOut } from 'framer-motion';

// Performance optimized canvas wrapper with enhanced settings
const CanvasWrapper = memo(({ children }: { children: React.ReactNode }) => {
  const isMobile = useIsMobile();
  
  // Optimize settings based on device
  const canvasSettings = useMemo(() => ({
    gl: {
      antialias: true, // Always enable antialiasing for better HTML rendering
      alpha: true,
      powerPreference: 'high-performance' as const,
      stencil: false,
      depth: true,
      logarithmicDepthBuffer: false, // Disable for better performance
      precision: 'highp' as const, // Always use high precision for better HTML rendering
    },
    dpr: [1, 2] as [number, number], // Consistent DPR for better HTML rendering
    shadows: !isMobile, // Disable shadows on mobile
    performance: { 
      min: isMobile ? 0.4 : 0.6, // Slightly higher performance target for better HTML rendering
      max: 1,
      debounce: 200,
    },
    style: {
      touchAction: 'pan-x pan-y', // Allow touch actions for UI elements
      outline: 'none',
      willChange: 'transform',
      contain: 'paint layout style',
    },
  }), [isMobile]);

  return (
    <Canvas {...canvasSettings}>
      <AdaptiveDpr pixelated />
      <AdaptiveEvents />
      <Preload all /> {/* Preload all assets */}
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

            <InfiniteRoom color="#132a3a">
              <SpringGroup
                animations={phoneAnimations}
                config={{ mass: 1, tension: 170, friction: 26 }}
              >
                <PhoneModel />
              </SpringGroup>
            </InfiniteRoom>
            
            <SpringGroup
              animations={pcbAnimations}
              config={{ easing: easeInOut }}
            >
              {currentRoute === 'home' && (
                <RandomPCB
                  count={isMobile ? 1 : 2} // Reduced count for better performance
                  gridSize={0.5}
                  shape="rectangle"
                  mode="surround"
                  margin={2}
                  pathFollowProbability={isMobile ? 0.5 : 0.3} // Reduced probability on mobile
                />
              )}
            </SpringGroup>
          </CanvasWrapper>
        </Suspense>
      </div>
    </>
  );
}

export default memo(RootCanvasClientComponent);
