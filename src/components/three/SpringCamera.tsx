import { ReactNode, useEffect, useRef } from 'react';
import { animated, useSpring } from '@react-spring/three';
import { PerspectiveCamera } from '@react-three/drei';
import { Vector3Tuple } from 'three';
import { useThree } from '@react-three/fiber';
import * as THREE from 'three';

type AnimationConfig = {
  onTrue?: {
    position?: Vector3Tuple;
    rotation?: Vector3Tuple;
    fov?: number;
  };
  onFalse?: {
    position?: Vector3Tuple;
    rotation?: Vector3Tuple;
    fov?: number;
  };
  onValue?: any;
  delay?: number;
  config?: {
    mass?: number;
    tension?: number;
    friction?: number;
    precision?: number;
    velocity?: number;
    duration?: number;
    easing?: (t: number) => number;
  };
};

type SpringValues = {
  position?: Vector3Tuple;
  rotation?: Vector3Tuple;
  fov?: number;
};

type SpringCameraProps = {
  animations: AnimationConfig[];
  config?: AnimationConfig['config'];
  makeDefault?: boolean;
};

const DEFAULT_POSITION: Vector3Tuple = [0, 0, 5];
const DEFAULT_ROTATION: Vector3Tuple = [0, 0, 0];
const DEFAULT_FOV = 30;

const getInitialState = (animations: AnimationConfig[]): SpringValues => {
  const initial = animations.reduce<SpringValues>((acc, animation) => ({
    ...acc,
    ...(animation.onFalse as SpringValues || {})
  }), {});
  
  return {
    position: initial.position || DEFAULT_POSITION,
    rotation: initial.rotation || DEFAULT_ROTATION,
    fov: initial.fov || DEFAULT_FOV
  };
};

const getCurrentState = (animations: AnimationConfig[]): SpringValues => {
  const current = animations.reduce<SpringValues>((acc, animation) => {
    if (animation.delay !== undefined) {
      const newState = animation.onTrue as SpringValues;
      return {
        ...acc,
        ...newState
      };
    }
    if (animation.onValue !== undefined) {
      const newState = animation.onValue ? animation.onTrue as SpringValues : animation.onFalse as SpringValues;
      return {
        ...acc,
        ...newState
      };
    }
    return acc;
  }, {});
  
  return {
    position: current.position || DEFAULT_POSITION,
    rotation: current.rotation || DEFAULT_ROTATION,
    fov: current.fov || DEFAULT_FOV
  };
};

export const SpringCamera = ({ 
  animations,
  config: defaultConfig,
  makeDefault = false
}: SpringCameraProps) => {
  const cameraRef = useRef<THREE.PerspectiveCamera>(null);
  const { set } = useThree();
  const executedDelaysRef = useRef<Set<number>>(new Set());
  
  const [{ position, rotation, fov }, api] = useSpring(() => ({
    position: DEFAULT_POSITION,
    rotation: DEFAULT_ROTATION,
    fov: DEFAULT_FOV,
    config: defaultConfig || {
      mass: 1,
      tension: 170,
      friction: 26,
    },
    immediate: true,
    onChange: () => {
      if (cameraRef.current && makeDefault) {
        set({ camera: cameraRef.current });
      }
    }
  }));

  useEffect(() => {
    const delayedAnimations = animations
      .filter(anim => anim.delay !== undefined)
      .filter(anim => !executedDelaysRef.current.has(anim.delay!))
      .filter(anim => anim.delay != null && anim.onTrue);
      
    const timeouts: NodeJS.Timeout[] = [];
    let isCleanedUp = false;

    delayedAnimations.forEach(animation => {
      if (animation.delay !== undefined && animation.onTrue) {
        executedDelaysRef.current.add(animation.delay);
        
        const timeout = setTimeout(() => {
          if (isCleanedUp) return;
          
          api.start({
            position: animation.onTrue?.position,
            rotation: animation.onTrue?.rotation,
            fov: animation.onTrue?.fov,
            config: animation.config || defaultConfig || {
              mass: 1,
              tension: 170,
              friction: 26,
            },
            immediate: false,
          });
        }, animation.delay);
        timeouts.push(timeout);
      }
    });

    const immediateState = getCurrentState(animations.filter(anim => anim.delay === undefined));
    
    if (immediateState.position?.some(isNaN) || 
        immediateState.rotation?.some(isNaN) || 
        isNaN(immediateState.fov || 0)) {
      console.warn('Invalid animation values detected in SpringCamera', {
        position: immediateState.position,
        rotation: immediateState.rotation,
        fov: immediateState.fov
      });
      return;
    }

    api.start({
      position: immediateState.position,
      rotation: immediateState.rotation,
      fov: immediateState.fov,
      config: defaultConfig || {
        mass: 1,
        tension: 170,
        friction: 26,
      },
      immediate: false,
    });

    return () => {
      isCleanedUp = true;
      timeouts.forEach(timeout => clearTimeout(timeout));
    };
  }, [animations, api, defaultConfig]);

  return (
    <>
      <animated.mesh position={position as any} rotation={rotation as any} visible={false}>
        <PerspectiveCamera
          ref={cameraRef}
          makeDefault={makeDefault}
        />
      </animated.mesh>
    </>
  );
}; 