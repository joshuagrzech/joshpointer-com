'use client';

import { Suspense, memo, useRef } from 'react';
import LoadingSpinner from '@/components/ui/LoadingSpinner';
import { Canvas } from '@react-three/fiber';
import { AdaptiveDpr, AdaptiveEvents } from '@react-three/drei';
import { useNavigation } from '@/hooks/useNavigation';
import { useIsMobile } from '@/hooks/useIsMobile';
import { SpringGroup } from '../three/SpringGroup';
import { SpringCamera } from '../three/SpringCamera';
import InfiniteRoom from '../three/InfiniteRoom';
import PhoneModel from '../phone/PhoneModel';
import RandomPCB from '../three/RandomPCB';
import { easeInOut } from 'framer-motion';

// Performance optimized canvas wrapper
const CanvasWrapper = memo(({ children }: { children: React.ReactNode }) => (
  <Canvas
    gl={{
      antialias: true,
      alpha: true,
      powerPreference: 'high-performance',
      stencil: false,
      depth: true,
    }}
    dpr={[1, 2]}
    shadows
    performance={{ min: 0.5 }}
    style={{
      touchAction: 'none',
      outline: 'none',
      willChange: 'transform',
      contain: 'paint layout style',
    }}
  >
    <AdaptiveDpr pixelated />
    <AdaptiveEvents />

    {children}
  </Canvas>
));

CanvasWrapper.displayName = 'CanvasWrapper';

function RootCanvasClientComponent() {
  const containerRef = useRef<HTMLDivElement>(null);
  const { currentRoute } = useNavigation();
  const isMobile = useIsMobile();

  // Don't render canvas for admin route
  if (currentRoute === 'admin') {
    return null;
  }

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
              animations={[
                {
                  onTrue: { position: [0, 0, 2.5], rotation: [0, 0, 0] },
                  onFalse: { position: [0, 0, 2.5], rotation: [0, 0, 0] },
                  onValue: Boolean(currentRoute && currentRoute !== 'home'),
                },
              ]}
              config={{ mass: 1, tension: 170, friction: 26 }}
            />

            <InfiniteRoom color="#132a3a">
              <SpringGroup
                animations={[
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
                ]}
                config={{ mass: 1, tension: 170, friction: 26 }}
              >
                <PhoneModel />
              </SpringGroup>
            </InfiniteRoom>
            <SpringGroup
              animations={[
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
              ]}
              config={{ easing: easeInOut }}
            >
              {currentRoute === 'home' && (
                <RandomPCB
                  count={isMobile ? 1 : 3}
                  gridSize={0.5}
                  shape="rectangle"
                  mode="surround"
                  margin={2}
                  pathFollowProbability={isMobile ? 1 : 0.3}
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
