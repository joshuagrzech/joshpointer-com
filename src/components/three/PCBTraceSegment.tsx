// PCBTraceSegment.tsx
import React, { useEffect } from 'react';
import { useSpring, animated, easings } from '@react-spring/three';
import * as THREE from 'three';

type AnimationDirection = 'forward' | 'backward' | 'full' | 'none';

interface PCBTraceSegmentProps {
  startPos: THREE.Vector3;
  endPos: THREE.Vector3;
  color: THREE.Color;
  thickness: number;
  glowIntensity: number;
  animateDirection: AnimationDirection;
  duration: number;
  onForwardComplete?: () => void;
  onBackwardComplete?: () => void;
}

const PCBTraceSegment: React.FC<PCBTraceSegmentProps> = ({
  startPos,
  endPos,
  color,
  thickness,
  glowIntensity,
  animateDirection,
  duration,
  onForwardComplete,
  onBackwardComplete,
}) => {
  // ... same logic as previously shown ...
  // no changes needed
  // (pasting the final version from prior answer for completeness)

  const direction = endPos.clone().sub(startPos);
  const length = direction.length();
  const normalizedDir = direction.clone().normalize();

  const quaternion = new THREE.Quaternion().setFromUnitVectors(
    new THREE.Vector3(0, 1, 0),
    normalizedDir
  );

  const sphereMaterial = React.useMemo(() => {
    return new THREE.MeshPhysicalMaterial({
      color,
      emissive: color.clone(),
      emissiveIntensity: glowIntensity * 1.2,
      transparent: true,
      opacity: 0.95,
      transmission: 0.2,
      clearcoat: 1,
      clearcoatRoughness: 0.1,
      metalness: 0.2,
      roughness: 0.3,
    });
  }, [color, glowIntensity]);

  const pathMaterial = React.useMemo(() => {
    return new THREE.MeshPhysicalMaterial({
      color,
      emissive: color.clone(),
      emissiveIntensity: glowIntensity,
      transparent: true,
      opacity: 0.85,
      transmission: 0.1,
      clearcoat: 0.5,
      clearcoatRoughness: 0.2,
      metalness: 0.2,
      roughness: 0.3,
    });
  }, [color, glowIntensity]);

  const [{ sphereStartScale, cylinderScale, sphereEndScale }, api] = useSpring(
    () => ({
      sphereStartScale: 0,
      cylinderScale: 0,
      sphereEndScale: 0,
      config: { duration },
    }),
    [duration]
  );

  const overlapDelay = duration * 0.8;

  useEffect(() => {
    if (animateDirection === 'full') {
      api.set({ sphereStartScale: 1, cylinderScale: 1, sphereEndScale: 1 });
    } else if (animateDirection === 'none') {
      api.set({ sphereStartScale: 0, cylinderScale: 0, sphereEndScale: 0 });
    } else if (animateDirection === 'forward') {
      api.start({ sphereStartScale: 1 });
      api.start({
        cylinderScale: 1,
        config: { duration, easing: easings.easeOutQuad },
      });
      setTimeout(() => {
        api.start({
          sphereEndScale: 1,
          onRest: () => onForwardComplete?.(),
        });
      }, overlapDelay);
    } else if (animateDirection === 'backward') {
      api.start({ sphereEndScale: 0 });
      api.start({
        cylinderScale: 0,
        config: { duration, easing: easings.easeOutQuad },
      });
      setTimeout(() => {
        api.start({
          sphereStartScale: 0,
          onRest: () => onBackwardComplete?.(),
        });
      }, overlapDelay);
    }
  }, [animateDirection, api, duration, overlapDelay, onForwardComplete, onBackwardComplete]);

  return (
    <group position={startPos.toArray()} rotation={new THREE.Euler().setFromQuaternion(quaternion)}>
      {/* Start Sphere */}
      <animated.mesh scale={sphereStartScale.to((s) => [s, s, s])}>
        <sphereGeometry args={[thickness * 2, 12, 12]} />
        <primitive object={sphereMaterial} />
      </animated.mesh>

      {/* Cylinder */}
      <animated.mesh position-y={cylinderScale.to((s) => (length * s) / 2)} scale-y={cylinderScale}>
        <cylinderGeometry args={[thickness, thickness, length, 8]} />
        <primitive object={pathMaterial} />
      </animated.mesh>

      {/* End Sphere */}
      <animated.mesh
        position-y={cylinderScale.to((s) => length * s)}
        scale={sphereEndScale.to((v) => [v, v, v])}
      >
        <sphereGeometry args={[thickness * 2, 12, 12]} />
        <primitive object={sphereMaterial} />
      </animated.mesh>
    </group>
  );
};

export default React.memo(PCBTraceSegment);
