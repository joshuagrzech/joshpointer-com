// PCBTrace.tsx
import React, { useState, useEffect } from 'react';
import * as THREE from 'three';
import PCBTraceSegment from './PCBTraceSegment';

interface PCBTraceProps {
  points: THREE.Vector3[]; // The BFS path in a list of 3D points
  color?: THREE.Color;
  thickness?: number;
  glowIntensity?: number;
  isAnimating?: boolean;
  onComplete?: () => void;
}

const PCBTrace: React.FC<PCBTraceProps> = ({
  points,
  color = new THREE.Color(0x00ff00),
  thickness = 0.02,
  glowIntensity = 2,
  isAnimating = false,
  onComplete,
}) => {
  const SPEED = 0.005;
  const [currentIndex, setCurrentIndex] = useState(0);
  const [isReversing, setIsReversing] = useState(false);
  const [done, setDone] = useState(false);
  useEffect(() => {
    if (done && onComplete) onComplete();
  }, [done, onComplete]);

  const segments = React.useMemo(() => {
    const segs: Array<[THREE.Vector3, THREE.Vector3]> = [];
    for (let i = 0; i < points.length - 1; i++) {
      segs.push([points[i], points[i + 1]]);
    }
    return segs;
  }, [points]);

  if (segments.length === 0) {
    console.error('PCBTrace failed to generate segments from points', points);
    return null;
  }
  // If no segments or not animating => null
  if (!isAnimating || segments.length === 0) return null;

  // Each segment's duration is length / SPEED
  function getDuration(a: THREE.Vector3, b: THREE.Vector3) {
    return a.distanceTo(b) / SPEED;
  }

  const handleForwardComplete = (idx: number) => {
    if (!isReversing && idx === currentIndex) {
      const next = idx + 1;
      if (next < segments.length) setCurrentIndex(next);
      else {
        // done forward
        setTimeout(() => {
          setIsReversing(true);
          setCurrentIndex(segments.length - 1);
        }, 300);
      }
    }
  };

  const handleBackwardComplete = (idx: number) => {
    if (isReversing && idx === currentIndex) {
      const prev = idx - 1;
      if (prev >= 0) setCurrentIndex(prev);
      else setDone(true);
    }
  };

  if (!points || points.length < 2) {
    console.warn('Invalid points array passed to PCBTrace');
    return null;
  }
  return (
    <group>
      {segments.map(([start, end], i) => {
        let animDir: 'forward' | 'backward' | 'full' | 'none' = 'none';

        if (isReversing) {
          if (i > currentIndex) animDir = 'none';
          else if (i < currentIndex) animDir = 'full';
          else animDir = 'backward';
        } else {
          if (i < currentIndex) animDir = 'full';
          else if (i === currentIndex) animDir = 'forward';
          else animDir = 'none';
        }

        const duration = getDuration(start, end);

        return (
          <PCBTraceSegment
            key={i}
            startPos={start}
            endPos={end}
            color={color}
            thickness={thickness}
            glowIntensity={glowIntensity}
            animateDirection={animDir}
            duration={duration}
            onForwardComplete={() => handleForwardComplete(i)}
            onBackwardComplete={() => handleBackwardComplete(i)}
          />
        );
      })}
    </group>
  );
};

export default React.memo(PCBTrace);
