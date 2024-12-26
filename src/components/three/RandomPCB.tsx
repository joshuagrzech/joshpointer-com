import React, { useState, useCallback, useEffect } from "react";
import * as THREE from "three";
import PCBTraceManager from "./PCBTraceManager";

interface RandomPCBProps {
  count?: number;
  bounds?: number;
  density?: number;
  minAngles?: number;
  colorScheme?: 'rainbow' | 'monochrome' | 'complementary';
}

interface TraceData {
  id: string;
  start: THREE.Vector3;
  end: THREE.Vector3;
  color: THREE.Color;
  startDelay: number;
}

const RandomPCB: React.FC<RandomPCBProps> = React.memo(({ 
  count = 3,
  bounds = 2.5,
  density = 1,
  minAngles = 3,
  colorScheme = 'rainbow'
}) => {
  const [traces, setTraces] = useState<TraceData[]>([]);
  const [activeTraceCount, setActiveTraceCount] = useState(0);

  // Generate color based on scheme
  const generateColor = useCallback(() => {
    switch (colorScheme) {
      case 'monochrome': {
        const hue = Math.random() * 360;
        return new THREE.Color(`hsl(${hue}, 80%, 50%)`);
      }
      case 'complementary': {
        const baseHue = Math.random() * 180;
        const complementaryHue = baseHue + (Math.random() > 0.5 ? 180 : 0);
        return new THREE.Color(`hsl(${complementaryHue}, 100%, 50%)`);
      }
      default:
        return new THREE.Color(`hsl(${Math.random() * 360}, 100%, 50%)`);
    }
  }, [colorScheme]);

  // Generate a point on a grid
  const generateGridPoint = useCallback(() => {
    const gridSize = { x: 5, y: 3, z: 5 };
    const cellSize = {
      x: (bounds * 2) / gridSize.x,
      y: bounds / gridSize.y,
      z: (bounds * 2) / gridSize.z
    };

    const gridX = Math.floor(Math.random() * gridSize.x);
    const gridY = Math.floor(Math.random() * gridSize.y);
    const gridZ = Math.floor(Math.random() * gridSize.z);

    const x = (gridX - (gridSize.x - 1) / 2) * cellSize.x;
    const y = (gridY - (gridSize.y - 1) / 2) * cellSize.y;
    const z = (gridZ - (gridSize.z - 1) / 2) * cellSize.z;

    return new THREE.Vector3(
      x + (Math.random() - 0.5) * cellSize.x * density,
      y + (Math.random() - 0.5) * cellSize.y * density,
      z + (Math.random() - 0.5) * cellSize.z * density
    );
  }, [bounds, density]);

  // Generate new trace data
  const generateNewTrace = useCallback((delay: number = 0): TraceData => {
    const start = generateGridPoint();
    let end;
    
    // Generate end point that's at least 2 grid cells away
    do {
      end = generateGridPoint();
    } while (end.distanceTo(start) < bounds * 0.8);

    return {
      id: Math.random().toString(36).substr(2, 9),
      start,
      end,
      color: generateColor(),
      startDelay: delay
    };
  }, [generateGridPoint, generateColor, bounds]);

  // Handle trace completion
  const handleTraceComplete = useCallback((id: string) => {
    setTraces(prev => {
      // Remove the completed trace
      const newTraces = prev.filter(t => t.id !== id);
      
      // Only add a new trace if we're below the maximum count
      if (newTraces.length < count) {
        const newTrace = generateNewTrace(1000);
        return [...newTraces, newTrace];
      }
      
      return newTraces;
    });
  }, [generateNewTrace, count]);

  // Initialize traces
  useEffect(() => {
    const initialTraces = Array.from({ length: count }, (_, i) => 
      generateNewTrace(i * 1000)
    );
    setTraces(initialTraces);
    setActiveTraceCount(count);
  }, [count, generateNewTrace]);

  return (
    <group>
      {traces.map(trace => (
        <PCBTraceManager
          key={trace.id}
          id={trace.id}
          start={trace.start}
          end={trace.end}
          color={trace.color}
          thickness={0.02}
          glowIntensity={2}
          startDelay={trace.startDelay}
          onComplete={() => handleTraceComplete(trace.id)}
        />
      ))}
    </group>
  );
});

export default RandomPCB;