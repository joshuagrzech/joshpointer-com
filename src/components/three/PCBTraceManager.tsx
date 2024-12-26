import React, { useState, useEffect, useCallback, useRef } from 'react';
import * as THREE from 'three';
import PCBTrace from './PCBTrace';

interface PCBTraceManagerProps {
  start: THREE.Vector3;
  end: THREE.Vector3;
  color: THREE.Color;
  thickness: number;
  glowIntensity: number;
  startDelay: number;
  onComplete: () => void;
  id: string;
}

const PCBTraceManager: React.FC<PCBTraceManagerProps> = ({
  start,
  end,
  color,
  thickness,
  glowIntensity,
  startDelay,
  onComplete,
  id
}) => {
  const [isActive, setIsActive] = useState(true);
  const mountTimeRef = useRef(Date.now());
  const cleanupTimeoutRef = useRef<NodeJS.Timeout>();

  // Handle trace completion
  const handleComplete = useCallback(() => {
    // Ensure minimum display time (including reverse animation)
    const elapsedTime = Date.now() - mountTimeRef.current;
    const minDisplayTime = 4000; // 4 seconds minimum display time (2s forward + 2s reverse)

    if (elapsedTime < minDisplayTime) {
      cleanupTimeoutRef.current = setTimeout(() => {
        setIsActive(false);
        onComplete();
      }, minDisplayTime - elapsedTime);
    } else {
      setIsActive(false);
      onComplete();
    }
  }, [onComplete]);

  // Cleanup on unmount
  useEffect(() => {
    return () => {
      if (cleanupTimeoutRef.current) {
        clearTimeout(cleanupTimeoutRef.current);
      }
    };
  }, []);

  if (!isActive) return null;

  return (
    <PCBTrace
      key={id}
      start={start}
      end={end}
      color={color}
      thickness={thickness}
      glowIntensity={glowIntensity}
      startDelay={startDelay}
      onComplete={handleComplete}
    />
  );
};

export default React.memo(PCBTraceManager); 