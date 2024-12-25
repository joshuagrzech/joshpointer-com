'use client';

import { Suspense, useState, useEffect, memo, useRef, useCallback } from "react";
import LoadingSpinner from "@/components/ui/LoadingSpinner";
import FloatingPhone from "@/components/phone/FloatingPhone";
import { Canvas } from "@react-three/fiber";
import { Environment, PerspectiveCamera } from "@react-three/drei";
import { useNavigation } from "@/hooks/useNavigation";

function RootCanvasClientComponent() {
  const [mousePosition, setMousePosition] = useState({ x: 0, y: 0 });
  const containerRef = useRef<HTMLDivElement>(null);
  const {currentRoute} = useNavigation()
  // Memoize mouse movement handler
  const handleMouseMove = useCallback((event: MouseEvent) => {
    if (!containerRef.current) return;

    const rect = containerRef.current.getBoundingClientRect();
    const canvasCenter = {
      x: rect.left + rect.width / 2,
      y: rect.top + rect.height / 2
    };

    const distanceFromCenter = {
      x: (event.clientX - canvasCenter.x) / (window.innerWidth / 2),
      y: (event.clientY - canvasCenter.y) / (window.innerHeight / 2)
    };

    const isOverPhoneScreen = 
      event.clientX >= rect.left && 
      event.clientX <= rect.right && 
      event.clientY >= rect.top && 
      event.clientY <= rect.bottom;

    const movementScale = isOverPhoneScreen ? 0.3 : 1;

    setMousePosition({
      x: distanceFromCenter.x * movementScale,
      y: -distanceFromCenter.y * movementScale
    });
  }, []);


  // Setup mouse movement listener
  useEffect(() => {
    window.addEventListener('mousemove', handleMouseMove);
    return () => window.removeEventListener('mousemove', handleMouseMove);
  }, [handleMouseMove]);

  return (
    <div 
      ref={containerRef} 
      className="min-w-max h-screen"
    >
      {currentRoute !== 'admin' && (
      <Suspense fallback={<LoadingSpinner />}>
        <Canvas
          // gl={{ antialias: true, alpha: true }}
          // dpr={[1, 2] as [number, number]}
        >
          <Environment preset="city" />
          <PerspectiveCamera makeDefault fov={30} position={[0, 0, 0]} />

          <FloatingPhone
            mousePosition={mousePosition}
          />
        </Canvas>
      </Suspense>
      )}
    </div>
  );
}

export default memo(RootCanvasClientComponent); 