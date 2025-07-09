// Centralized Three.js imports for better tree shaking
// This helps reduce bundle size by only importing what we need

// Re-export Three.js with a cleaner interface
export * from 'three';

// Also export as THREE for backward compatibility
import * as THREE from 'three';
export { THREE };
