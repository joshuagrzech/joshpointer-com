import { ReactNode, useEffect } from 'react';
import { animated, useSpring } from '@react-spring/three';

// Define a type for animation values
type AnimationValues = {
  [key: string]: number | string | boolean;
};

type AnimationConfig = {
  onTrue?: Record<string, AnimationValues[keyof AnimationValues]>;
  onFalse?: Record<string, AnimationValues[keyof AnimationValues]>;
  onValue?: boolean;
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

type SpringGroupProps = {
  children: ReactNode;
  animations: AnimationConfig[];
  config?: AnimationConfig['config'];
};

const getInitialState = (animations: AnimationConfig[]) => {
  return animations.reduce(
    (acc, animation) => ({
      ...acc,
      ...(animation.onFalse || {}),
    }),
    {}
  );
};

const getCurrentState = (animations: AnimationConfig[]) => {
  return animations.reduce((acc, animation) => {
    if (animation.onValue !== undefined) {
      return {
        ...acc,
        ...(animation.onValue ? animation.onTrue : animation.onFalse),
      };
    }
    return acc;
  }, {});
};

export const SpringGroup = ({ children, animations, config: defaultConfig }: SpringGroupProps) => {
  const [springs, api] = useSpring(() => ({
    // Always start with onFalse values
    ...getInitialState(animations),
    config: defaultConfig || {
      mass: 1,
      tension: 170,
      friction: 26,
    },
  }));

  useEffect(() => {
    // Immediately start animating to the correct state based on conditions
    api.start({
      ...getCurrentState(animations),
      config: defaultConfig || {
        mass: 1,
        tension: 170,
        friction: 26,
      },
    });
  }, [animations, api, defaultConfig]);

  return <animated.group {...springs}>{children}</animated.group>;
};
