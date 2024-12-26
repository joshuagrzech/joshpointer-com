"use client";

import { Suspense, memo, useRef } from "react";
import LoadingSpinner from "@/components/ui/LoadingSpinner";
import { Canvas } from "@react-three/fiber";
import { AdaptiveDpr, AdaptiveEvents } from "@react-three/drei";
import { useNavigation } from "@/hooks/useNavigation";
import { SpringGroup } from "../three/SpringGroup";
import { SpringCamera } from "../three/SpringCamera";
import InfiniteRoom from "../three/InfiniteRoom";
import PhoneModel from "../phone/PhoneModel";
import RandomPCB from "../three/RandomPCB";

// Performance optimized canvas wrapper
const CanvasWrapper = memo(({ children }: { children: React.ReactNode }) => (
  <Canvas
    gl={{
      antialias: true,
      alpha: true,
      powerPreference: "high-performance",
      stencil: false,
      depth: true,
    }}
    dpr={[1, 2]}
    shadows
    performance={{ min: 0.5 }}
    style={{
      touchAction: "none",
      outline: "none",
      willChange: "transform",
      contain: "paint layout style",
    }}
  >
    <AdaptiveDpr pixelated />
    <AdaptiveEvents />
    {children}
  </Canvas>
));

CanvasWrapper.displayName = "CanvasWrapper";

function RootCanvasClientComponent({
  children,
}: {
  children: React.ReactNode;
}) {
  const containerRef = useRef<HTMLDivElement>(null);
  const { currentRoute } = useNavigation();
  // Don't render canvas for admin route
  if (currentRoute === "admin") {
    return null;
  }

  return (
    <>
      <div
        ref={containerRef}
        className="fixed inset-0 w-full h-full"
        style={{
          willChange: "transform",
          contain: "paint layout style",
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
                  onTrue: { position: [0, 0, 1.5], rotation: [0, 0, 0] },
                  onFalse: { position: [0, 0, 1.5], rotation: [0, 0, 0] },
                  onValue: Boolean(currentRoute && currentRoute !== "home"),
                },
              ]}
              config={{ mass: 1, tension: 170, friction: 26 }}
            />

            <InfiniteRoom>
              <SpringGroup
                animations={[
                  {
                    onTrue: {
                      position: [-0.5, 0, 0],
                      rotation: [0, Math.PI * 0.15, 0],
                    },
                    onFalse: { position: [0, 0, 0], rotation: [0, 0, 0] },
                    onValue: Boolean(currentRoute && currentRoute !== "home"),
                  },
                ]}
                config={{ mass: 1, tension: 170, friction: 26 }}
              >
                <PhoneModel />
              </SpringGroup>
           
            </InfiniteRoom>
               <RandomPCB
                count={3}
                bounds={3}
                density={0.9}
                minAngles={10} // Minimum number of right angles per trace
                colorScheme="complementary"
              />
          </CanvasWrapper>
        </Suspense>
      </div>
      <div
        className="fixed top-0 right-0 w-[50vw] h-screen"
        style={{
          zIndex: 1,
          pointerEvents: "auto",
          transform:
            currentRoute && currentRoute !== "home"
              ? "translate3d(0, 0, 0)"
              : "translate3d(100%, 0, 0)",
          transition: "transform 0.3s ease-in-out",
        }}
      >
        {children}
      </div>
    </>
  );
}

export default memo(RootCanvasClientComponent);
