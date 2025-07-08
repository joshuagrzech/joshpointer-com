import React, { useState } from 'react';
import { Canvas } from '@react-three/fiber';
import ShaderBackground from './ShaderBackground';

const FractalBackgroundExample: React.FC = () => {
  const [intensity, setIntensity] = useState(1.0);
  const [speed, setSpeed] = useState(1.0);
  const [useCustomColors, setUseCustomColors] = useState(false);
  const [fractalColor1, setFractalColor1] = useState<[number, number, number]>([1.0, 0.2, 0.4]);
  const [fractalColor2, setFractalColor2] = useState<[number, number, number]>([0.2, 0.8, 1.0]);
  const [fractalColor3, setFractalColor3] = useState<[number, number, number]>([1.0, 0.8, 0.0]);

  // Color presets
  const colorPresets = {
    fire: {
      color1: [1.0, 0.1, 0.0] as [number, number, number],
      color2: [1.0, 0.5, 0.0] as [number, number, number],
      color3: [1.0, 1.0, 0.2] as [number, number, number],
    },
    ocean: {
      color1: [0.0, 0.2, 0.4] as [number, number, number],
      color2: [0.0, 0.6, 0.8] as [number, number, number],
      color3: [0.2, 0.9, 1.0] as [number, number, number],
    },
    forest: {
      color1: [0.1, 0.3, 0.1] as [number, number, number],
      color2: [0.2, 0.6, 0.2] as [number, number, number],
      color3: [0.5, 0.8, 0.3] as [number, number, number],
    },
    purple: {
      color1: [0.3, 0.1, 0.5] as [number, number, number],
      color2: [0.6, 0.2, 0.8] as [number, number, number],
      color3: [0.9, 0.5, 1.0] as [number, number, number],
    },
    rainbow: {
      color1: [1.0, 0.0, 0.5] as [number, number, number],
      color2: [0.0, 1.0, 0.5] as [number, number, number],
      color3: [0.5, 0.0, 1.0] as [number, number, number],
    },
  };

  const applyPreset = (preset: keyof typeof colorPresets) => {
    const colors = colorPresets[preset];
    setFractalColor1(colors.color1);
    setFractalColor2(colors.color2);
    setFractalColor3(colors.color3);
    setUseCustomColors(true);
  };

  const rgbToHex = (rgb: [number, number, number]) => {
    const r = Math.round(rgb[0] * 255).toString(16).padStart(2, '0');
    const g = Math.round(rgb[1] * 255).toString(16).padStart(2, '0');
    const b = Math.round(rgb[2] * 255).toString(16).padStart(2, '0');
    return `#${r}${g}${b}`;
  };

  const hexToRgb = (hex: string): [number, number, number] => {
    const r = parseInt(hex.slice(1, 3), 16) / 255;
    const g = parseInt(hex.slice(3, 5), 16) / 255;
    const b = parseInt(hex.slice(5, 7), 16) / 255;
    return [r, g, b];
  };

  return (
    <div style={{ width: '100vw', height: '100vh', position: 'relative', backgroundColor: '#000' }}>
      {/* Canvas */}
      <Canvas camera={{ position: [0, 0, 5], fov: 75 }}>
        <ShaderBackground
          shader="fractal"
          intensity={intensity}
          speed={speed}
          interactive={true}
          useCustomColors={useCustomColors}
          fractalColor1={fractalColor1}
          fractalColor2={fractalColor2}
          fractalColor3={fractalColor3}
        />
      </Canvas>

      {/* Controls */}
      <div style={{
        position: 'absolute',
        top: '20px',
        left: '20px',
        backgroundColor: 'rgba(0, 0, 0, 0.8)',
        color: 'white',
        padding: '20px',
        borderRadius: '10px',
        minWidth: '300px',
        fontFamily: 'Arial, sans-serif',
        fontSize: '14px',
      }}>
        <h3 style={{ margin: '0 0 15px 0', color: '#fff' }}>Fractal Background Controls</h3>
        
        {/* Intensity */}
        <div style={{ marginBottom: '15px' }}>
          <label style={{ display: 'block', marginBottom: '5px' }}>
            Intensity: {intensity.toFixed(2)}
          </label>
          <input
            type="range"
            min="0.1"
            max="3.0"
            step="0.1"
            value={intensity}
            onChange={(e) => setIntensity(parseFloat(e.target.value))}
            style={{ width: '100%' }}
          />
        </div>

        {/* Speed */}
        <div style={{ marginBottom: '15px' }}>
          <label style={{ display: 'block', marginBottom: '5px' }}>
            Speed: {speed.toFixed(2)}
          </label>
          <input
            type="range"
            min="0.1"
            max="3.0"
            step="0.1"
            value={speed}
            onChange={(e) => setSpeed(parseFloat(e.target.value))}
            style={{ width: '100%' }}
          />
        </div>

        {/* Color Mode Toggle */}
        <div style={{ marginBottom: '15px' }}>
          <label style={{ display: 'flex', alignItems: 'center', cursor: 'pointer' }}>
            <input
              type="checkbox"
              checked={useCustomColors}
              onChange={(e) => setUseCustomColors(e.target.checked)}
              style={{ marginRight: '8px' }}
            />
            Use Custom Colors
          </label>
        </div>

        {/* Color Presets */}
        {useCustomColors && (
          <>
            <div style={{ marginBottom: '15px' }}>
              <label style={{ display: 'block', marginBottom: '8px' }}>Color Presets:</label>
              <div style={{ display: 'flex', flexWrap: 'wrap', gap: '5px' }}>
                {Object.keys(colorPresets).map((preset) => (
                  <button
                    key={preset}
                    onClick={() => applyPreset(preset as keyof typeof colorPresets)}
                    style={{
                      backgroundColor: '#333',
                      color: 'white',
                      border: '1px solid #555',
                      borderRadius: '4px',
                      padding: '4px 8px',
                      cursor: 'pointer',
                      fontSize: '12px',
                      textTransform: 'capitalize',
                    }}
                  >
                    {preset}
                  </button>
                ))}
              </div>
            </div>

            {/* Custom Color Pickers */}
            <div style={{ marginBottom: '10px' }}>
              <label style={{ display: 'block', marginBottom: '5px' }}>Color 1:</label>
              <input
                type="color"
                value={rgbToHex(fractalColor1)}
                onChange={(e) => setFractalColor1(hexToRgb(e.target.value))}
                style={{ width: '100%', height: '30px' }}
              />
            </div>

            <div style={{ marginBottom: '10px' }}>
              <label style={{ display: 'block', marginBottom: '5px' }}>Color 2:</label>
              <input
                type="color"
                value={rgbToHex(fractalColor2)}
                onChange={(e) => setFractalColor2(hexToRgb(e.target.value))}
                style={{ width: '100%', height: '30px' }}
              />
            </div>

            <div style={{ marginBottom: '10px' }}>
              <label style={{ display: 'block', marginBottom: '5px' }}>Color 3:</label>
              <input
                type="color"
                value={rgbToHex(fractalColor3)}
                onChange={(e) => setFractalColor3(hexToRgb(e.target.value))}
                style={{ width: '100%', height: '30px' }}
              />
            </div>
          </>
        )}

        <div style={{ marginTop: '15px', fontSize: '12px', color: '#ccc' }}>
          <p>• Move your mouse to interact with the fractal</p>
          <p>• Toggle custom colors to use your own palette</p>
          <p>• Try different presets for quick color schemes</p>
        </div>
      </div>
    </div>
  );
};

export default FractalBackgroundExample; 