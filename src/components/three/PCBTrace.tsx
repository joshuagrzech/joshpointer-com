import React, { useState, useEffect, useMemo, useCallback } from "react";
import { animated, useSpring, config } from "@react-spring/three";
import * as THREE from "three";

interface PCBTraceProps {
  start: THREE.Vector3;
  end: THREE.Vector3;
  color?: THREE.Color;
  thickness?: number;
  glowIntensity?: number;
  onComplete?: () => void;
  startDelay?: number;
  minAngles?: number;
}

const PCBTrace: React.FC<PCBTraceProps> = React.memo(({ 
  start,
  end,
  color = new THREE.Color(0x00ff00),
  thickness = 0.02,
  glowIntensity = 2,
  onComplete,
  startDelay = 0,
  minAngles = 4
}) => {
  const [currentStep, setCurrentStep] = useState(0);
  const [points, setPoints] = useState<THREE.Vector3[]>([]);
  const [isAnimating, setIsAnimating] = useState(false);
  const [isTransitioning, setIsTransitioning] = useState(false);
  const [isReversing, setIsReversing] = useState(false);
  const forwardSteps = useMemo(() => (points.length - 1) * 2, [points.length]);
  const totalSteps = useMemo(() => forwardSteps * 2, [forwardSteps]);

  // Create materials
  const materials = useMemo(() => ({
    sphere: new THREE.MeshStandardMaterial({
      color: color.clone(),
      emissive: color.clone(),
      emissiveIntensity: glowIntensity,
      transparent: true,
      opacity: 0.9,
    }),
    path: new THREE.MeshStandardMaterial({
      color: color.clone(),
      emissive: color.clone(),
      emissiveIntensity: glowIntensity * 0.8,
      transparent: true,
      opacity: 0.8,
    })
  }), [color, glowIntensity]);

  // Generate path points
  useEffect(() => {
    const newPoints = [start.clone()];
    let currentPoint = start.clone();
    const diff = end.clone().sub(start);
    
    // Create path with right angles
    const axes = ['x', 'y', 'z'] as const;
    const remainingDist = {
      x: diff.x,
      y: diff.y,
      z: diff.z
    };

    // Randomly choose axis order
    let axisOrder = axes.slice().sort(() => Math.random() - 0.5);
    
    // If we need more segments than axes, repeat axes randomly
    while (axisOrder.length < minAngles) {
      const randomAxis = axes[Math.floor(Math.random() * axes.length)];
      axisOrder.push(randomAxis);
    }
    
    // Move along each axis
    axisOrder.forEach((axis, index) => {
      // For extra segments, only move a portion of the remaining distance
      const isExtraSegment = index >= 3;
      const moveDist = isExtraSegment 
        ? remainingDist[axis] * (Math.random() * 0.4 + 0.3) // Move 30-70% of remaining distance
        : remainingDist[axis];

      if (Math.abs(remainingDist[axis]) > 0.1) {
        const newPoint = currentPoint.clone();
        newPoint[axis] += moveDist;
        newPoints.push(newPoint);
        currentPoint = newPoint;
        remainingDist[axis] -= moveDist;
      }
    });

    // Add end point if not already there
    if (!currentPoint.equals(end)) {
      newPoints.push(end.clone());
    }

    setPoints(newPoints);
  }, [start, end, minAngles]);

  // Start animation after delay
  useEffect(() => {
    const timer = setTimeout(() => {
      setIsAnimating(true);
    }, startDelay);
    return () => clearTimeout(timer);
  }, [startDelay]);

  // Calculate segment properties - memoized for performance
  const getSegmentProps = useCallback((startPoint: THREE.Vector3, endPoint: THREE.Vector3) => {
    const direction = endPoint.clone().sub(startPoint);
    const length = direction.length();
    const quaternion = new THREE.Quaternion();
    quaternion.setFromUnitVectors(new THREE.Vector3(0, 1, 0), direction.normalize());
    return {
      length,
      rotation: new THREE.Euler().setFromQuaternion(quaternion)
    };
  }, []);

  // Handle step transitions
  const handleNextStep = useCallback(() => {
    if (!isTransitioning) {
      setIsTransitioning(true);
      if (!isReversing && currentStep >= forwardSteps) {
        // Start reverse animation
        setIsReversing(true);
        setIsTransitioning(false);
      } else if (isReversing && currentStep >= totalSteps) {
        // Complete the entire animation cycle
        if (onComplete) onComplete();
        setIsTransitioning(false);
      } else {
        // Progress to next step
        setCurrentStep(s => s + 1);
        setIsTransitioning(false);
      }
    }
  }, [isTransitioning, currentStep, isReversing, forwardSteps, totalSteps, onComplete]);

  // Get the effective step for animation calculations
  const getEffectiveStep = useCallback(() => {
    if (isReversing) {
      return totalSteps - currentStep - 1;
    }
    return currentStep;
  }, [currentStep, isReversing, totalSteps]);

  const effectiveStep = getEffectiveStep();
  const segmentIndex = Math.floor(effectiveStep / 2);
  const isSegmentStep = effectiveStep % 2 === 1;
  const visibleSegments = segmentIndex;
  const visibleSpheres = segmentIndex + (isSegmentStep ? 1 : 2);

  // Calculate indices first
  const activeSegmentIndex = isReversing ? points.length - 2 - segmentIndex : segmentIndex;
  const activeSphereIndex = isReversing ? points.length - 1 - segmentIndex - (isSegmentStep ? 1 : 0) : segmentIndex + (isSegmentStep ? 1 : 0);

  // Animation config for spheres
  const sphereAnimConfig = {
    mass: 0.8,
    tension: 280,
    friction: 12,
    bounce: 0.25
  };

  // Create individual springs for each possible sphere position
  const spring0 = useSpring({
    scale: ((isReversing && 0 > activeSphereIndex) || (!isReversing && 0 <= activeSphereIndex)) ? 1 : 0,
    from: { scale: 0 },
    config: sphereAnimConfig,
  });

  const spring1 = useSpring({
    scale: ((isReversing && 1 > activeSphereIndex) || (!isReversing && 1 <= activeSphereIndex)) ? 1 : 0,
    from: { scale: 0 },
    config: sphereAnimConfig,
  });

  const spring2 = useSpring({
    scale: ((isReversing && 2 > activeSphereIndex) || (!isReversing && 2 <= activeSphereIndex)) ? 1 : 0,
    from: { scale: 0 },
    config: sphereAnimConfig,
  });

  const spring3 = useSpring({
    scale: ((isReversing && 3 > activeSphereIndex) || (!isReversing && 3 <= activeSphereIndex)) ? 1 : 0,
    from: { scale: 0 },
    config: sphereAnimConfig,
  });

  const spring4 = useSpring({
    scale: ((isReversing && 4 > activeSphereIndex) || (!isReversing && 4 <= activeSphereIndex)) ? 1 : 0,
    from: { scale: 0 },
    config: sphereAnimConfig,
  });

  // Store springs in an array for easy access
  const sphereSprings = [spring0, spring1, spring2, spring3, spring4];

  // Animation for current sphere
  const sphereSpring = useSpring({
    scale: isAnimating ? (isReversing ? 0 : 1) : 0,
    from: { scale: isReversing ? 1 : 0 },
    config: sphereAnimConfig,
    delay: 0,
    immediate: isTransitioning,
    reset: true,
    onRest: handleNextStep
  });

  // Animation for current segment
  const { progress } = useSpring({
    progress: isAnimating ? 1 : 0,
    from: { progress: 0 },
    config: {
      mass: 2,
      tension: 80,
      friction: 20,
      clamp: true
    },
    delay: 0,
    immediate: isTransitioning,
    reset: true,
    onRest: handleNextStep
  });

  if (!isAnimating) return null;

  // Calculate visible ranges based on animation direction
  const visibleSegmentRange = isReversing 
    ? [activeSegmentIndex + 1, points.length - 1]  // Show segments after current in reverse
    : [0, activeSegmentIndex];  // Show segments before current in forward
    
  const visibleSphereRange = isReversing
    ? [activeSphereIndex + 1, points.length]  // Show spheres after current in reverse
    : [0, activeSphereIndex];  // Show spheres before current in forward

  return (
    <group>
      {/* Render completed segments */}
      {points.slice(...visibleSegmentRange).map((point, index) => {
        const actualIndex = isReversing ? points.length - 2 - index : index;
        if (actualIndex === points.length - 1) return null;
        const { length, rotation } = getSegmentProps(points[actualIndex], points[actualIndex + 1]);
        return (
          <group key={`segment-${actualIndex}`} position={points[actualIndex].toArray()}>
            <group rotation={rotation.toArray()}>
              <mesh position={[0, length/2, 0]}>
                <cylinderGeometry args={[thickness, thickness, length, 8]} />
                <primitive object={materials.path} />
              </mesh>
            </group>
          </group>
        );
      })}

      {/* Render current animating segment */}
      {isSegmentStep && activeSegmentIndex >= 0 && activeSegmentIndex < points.length - 1 && (
        <group position={points[activeSegmentIndex].toArray()}>
          <group rotation={getSegmentProps(points[activeSegmentIndex], points[activeSegmentIndex + 1]).rotation.toArray()}>
            <animated.group>
              <animated.mesh
                position-y={progress.to(p => {
                  const segLength = getSegmentProps(points[activeSegmentIndex], points[activeSegmentIndex + 1]).length;
                  if (isReversing) {
                    return segLength * (1 + p) / 2;
                  }
                  return (p * segLength) / 2;
                })}
                scale-y={progress.to(p => isReversing ? 1 - p : p)}
                scale-xz={1}
              >
                <cylinderGeometry 
                  args={[thickness, thickness, getSegmentProps(points[activeSegmentIndex], points[activeSegmentIndex + 1]).length, 8]}
                />
                <primitive object={materials.path} />
              </animated.mesh>
            </animated.group>
          </group>
        </group>
      )}

      {/* Render spheres at connection points */}
      {points.slice(...visibleSphereRange).map((point, index) => {
        const actualIndex = isReversing ? points.length - 1 - index : index;
        const isAnimatingSphere = actualIndex === activeSphereIndex;
        
        return (
          <animated.mesh
            key={`sphere-${actualIndex}`}
            position={point.toArray()}
            scale={isAnimatingSphere 
              ? sphereSpring.scale.to(s => [s, s, s])
              : sphereSprings[actualIndex].scale.to(s => [s, s, s])}
          >
            <sphereGeometry args={[thickness * 2, 8, 8]} />
            <primitive object={materials.sphere} />
          </animated.mesh>
        );
      })}
    </group>
  );
});

export default PCBTrace;