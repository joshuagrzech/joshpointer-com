import React from 'react';
import LayeredWaveShader from './LayeredWaveShader';

interface LayeredWaveShaderDemoProps {
  preset?: 'ocean' | 'sunset' | 'aurora' | 'coral' | 'deep' | 'custom';
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

const LayeredWaveShaderDemo: React.FC<LayeredWaveShaderDemoProps> = ({
  preset = 'ocean',
  speed = 0.1,
  intensity = 1.0,
  interactive = true,
  customColors = {},
}) => {
  // Color presets
  const colorPresets = {
    ocean: {
      primaryColor: '#1A4B8C', // Deep blue
      secondaryColor: '#19A7CE', // Light blue
      accentColor: '#FFFFFF', // White
      backgroundColor: '#0D1B2A', // Dark blue
    },
    sunset: {
      primaryColor: '#FF6B35', // Orange
      secondaryColor: '#F7931E', // Light orange
      accentColor: '#FFD93D', // Yellow
      backgroundColor: '#2C1810', // Dark brown
    },
    aurora: {
      primaryColor: '#00FF7F', // Spring green
      secondaryColor: '#40E0D0', // Turquoise
      accentColor: '#9370DB', // Medium purple
      backgroundColor: '#0A1A2A', // Dark blue
    },
    coral: {
      primaryColor: '#FF6B6B', // Coral red
      secondaryColor: '#FF8E8E', // Light coral
      accentColor: '#FFE5E5', // Light pink
      backgroundColor: '#2A0A0A', // Dark red
    },
    deep: {
      primaryColor: '#2C3E50', // Dark blue-gray
      secondaryColor: '#34495E', // Medium blue-gray
      accentColor: '#ECF0F1', // Light gray
      backgroundColor: '#0A0A0A', // Black
    },
    custom: {
      primaryColor: '#1A4B8C', // Default deep blue
      secondaryColor: '#19A7CE', // Default light blue
      accentColor: '#FFFFFF', // Default white
      backgroundColor: '#0D1B2A', // Default dark blue
    },
  };

  // Get colors for current preset
  const colors =
    preset === 'custom' ? { ...colorPresets.custom, ...customColors } : colorPresets[preset];

  return (
    <LayeredWaveShader
      shader="layeredwave"
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

export default LayeredWaveShaderDemo;
