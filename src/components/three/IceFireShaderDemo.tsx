import React from 'react';
import IceFireShader from './IceFireShader';

interface IceFireShaderDemoProps {
  preset?: 'fire' | 'ice' | 'sunset' | 'ocean' | 'forest' | 'custom';
  speed?: number;
  intensity?: number;
  interactive?: boolean;
  customColors?: {
    colorA?: string;
    colorB?: string;
    colorC?: string;
    colorD?: string;
  };
}

const IceFireShaderDemo: React.FC<IceFireShaderDemoProps> = ({
  preset = 'fire',
  speed = 0.1,
  intensity = 1.0,
  interactive = true,
  customColors = {},
}) => {
  // Color presets
  const colorPresets = {
    fire: {
      colorA: '#FF4500', // Orange red
      colorB: '#FF6347', // Tomato
      colorC: '#FFD700', // Gold
      colorD: '#8B0000', // Dark red
    },
    ice: {
      colorA: '#87CEEB', // Sky blue
      colorB: '#B0E0E6', // Powder blue
      colorC: '#F0F8FF', // Alice blue
      colorD: '#4682B4', // Steel blue
    },
    sunset: {
      colorA: '#FF6B35', // Orange
      colorB: '#F7931E', // Light orange
      colorC: '#FFD93D', // Yellow
      colorD: '#6B5B95', // Purple
    },
    ocean: {
      colorA: '#006994', // Deep blue
      colorB: '#4A90E2', // Sky blue
      colorC: '#7FB3D3', // Light blue
      colorD: '#2E86AB', // Dark blue
    },
    forest: {
      colorA: '#228B22', // Forest green
      colorB: '#32CD32', // Lime green
      colorC: '#90EE90', // Light green
      colorD: '#006400', // Dark green
    },
    custom: {
      colorA: '#808080', // Default gray
      colorB: '#404040', // Default dark gray
      colorC: '#CCCC80', // Default light yellow
      colorD: '#000080', // Default dark blue
    },
  };

  // Get colors for current preset
  const colors =
    preset === 'custom' ? { ...colorPresets.custom, ...customColors } : colorPresets[preset];

  return (
    <IceFireShader
      shader="icefire"
      interactive={interactive}
      speed={speed}
      intensity={intensity}
      colorA={colors.colorA}
      colorB={colors.colorB}
      colorC={colors.colorC}
      colorD={colors.colorD}
    />
  );
};

export default IceFireShaderDemo;
