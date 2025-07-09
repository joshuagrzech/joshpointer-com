// Framer Motion configs
export const framerMotionConfig = {
  default: {
    duration: 0.3,
    ease: [0.4, 0, 0.2, 1],
  },
  slow: {
    duration: 0.5,
    ease: [0.4, 0, 0.2, 1],
  },
  spring: {
    type: "spring",
    stiffness: 170,
    damping: 26,
  },
} as const;

// React Spring configs
export const reactSpringConfig = {
  default: {
    mass: 1,
    tension: 170,
    friction: 26,
  },
  slow: {
    mass: 1,
    tension: 120,
    friction: 30,
  },
} as const;

// Shared timing (in seconds)
export const timing = {
  fast: 0.2,
  default: 0.3,
  slow: 0.5,
} as const;

// Shared easings
export const easings = {
  default: [0.4, 0, 0.2, 1],
  easeOut: [0, 0, 0.2, 1],
  easeIn: [0.4, 0, 1, 1],
} as const; 