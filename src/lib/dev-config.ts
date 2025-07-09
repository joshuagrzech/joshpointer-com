// Development configuration for better hot reloading
export const devConfig = {
  // Force re-renders in development
  forceRerender: process.env.NODE_ENV === 'development',
  
  // Enable debug logging in development
  debug: process.env.NODE_ENV === 'development',
  
  // Hot reload settings
  hotReload: {
    // Clear WebGL context on hot reload
    clearWebGLContext: true,
    // Force canvas re-mount
    forceCanvasRemount: true,
    // Log hot reload events
    logEvents: true,
  },
  
  // Three.js specific settings for development
  three: {
    // Disable antialiasing in development for faster reloads
    antialias: process.env.NODE_ENV === 'production',
    // Lower precision in development
    precision: process.env.NODE_ENV === 'development' ? 'mediump' : 'highp',
    // Disable shadows in development
    shadows: false,
  },
  
  // Performance settings for development
  performance: {
    // Lower DPR in development
    dpr: process.env.NODE_ENV === 'development' ? [0.5, 1] : [1, 2],
    // More aggressive performance targets in development
    min: process.env.NODE_ENV === 'development' ? 0.1 : 0.4,
    max: process.env.NODE_ENV === 'development' ? 0.5 : 1,
  },
};

// Helper function to get development-specific key
export const getDevKey = (baseKey: string) => {
  return process.env.NODE_ENV === 'development' 
    ? `${baseKey}-${Date.now()}` 
    : baseKey;
};

// Helper function to log development events
export const devLog = (message: string, data?: any) => {
  if (process.env.NODE_ENV === 'development') {
    console.log(`[DEV] ${message}`, data);
  }
}; 