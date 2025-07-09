import React from 'react';
import WaveFlowShader from './WaveFlowShader';

interface WaveFlowShaderDemoProps {
  preset?: 'ocean' | 'sunset' | 'forest' | 'fire' | 'aurora' | 'custom';
  speed?: number;
  intensity?: number;
  interactive?: boolean;
  customColors?: {
    primaryColor?: string;
    secondaryColor?: string;
    accentColor?: string;
    backgroundColor?: string;
  };
}

const WaveFlowShaderDemo: React.FC<WaveFlowShaderDemoProps> = ({
  preset = 'ocean',
  speed = 0.1,
  intensity = 1.0,
  interactive = true,
  customColors = {},
}) => {
  // Color presets
  const colorPresets = {
    ocean: {
      primaryColor: '#006994', // Deep blue
      secondaryColor: '#4A90E2', // Sky blue
      accentColor: '#7FB3D3', // Light blue
      backgroundColor: '#132a3a', // Dark blue
    },
    sunset: {
      primaryColor: '#FF6B35', // Orange
      secondaryColor: '#F7931E', // Light orange
      accentColor: '#FFD93D', // Yellow
      backgroundColor: '#2C1810', // Dark brown
    },
    forest: {
      primaryColor: '#228B22', // Forest green
      secondaryColor: '#32CD32', // Lime green
      accentColor: '#90EE90', // Light green
      backgroundColor: '#0A2F0A', // Dark green
    },
    fire: {
      primaryColor: '#FF4500', // Orange red
      secondaryColor: '#FF6347', // Tomato
      accentColor: '#FFD700', // Gold
      backgroundColor: '#2C0A0A', // Dark red
    },
    aurora: {
      primaryColor: '#00FF7F', // Spring green
      secondaryColor: '#40E0D0', // Turquoise
      accentColor: '#9370DB', // Medium purple
      backgroundColor: '#0A1A2A', // Dark blue
    },
    custom: {
      primaryColor: '#4A90E2', // Default blue
      secondaryColor: '#7FB3D3', // Default light blue
      accentColor: '#2E86AB', // Default dark blue
      backgroundColor: '#132a3a', // Default dark background
    },
  };

  // Get colors for current preset
  const colors =
    preset === 'custom' ? { ...colorPresets.custom, ...customColors } : colorPresets[preset];

  return (
    <WaveFlowShader
      shader="waveflow"
      interactive={interactive}
      speed={speed}
      intensity={intensity}
      primaryColor={colors.primaryColor}
      secondaryColor={colors.secondaryColor}
      accentColor={colors.accentColor}
      backgroundColor={colors.backgroundColor}
    />
  );
};

export default WaveFlowShaderDemo;
