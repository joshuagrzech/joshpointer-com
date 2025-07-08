import React, { useState } from 'react';
import ShaderBackground from './ShaderBackground';

const ShaderBackgroundExample: React.FC = () => {
  const [currentShader, setCurrentShader] = useState<'matrix' | 'circuit' | 'fluid' | 'neural' | 'quantum' | 'cosmic' | 'waves' | 'tunnel' | 'custom'>('matrix');
  const [intensity, setIntensity] = useState(1.0);
  const [speed, setSpeed] = useState(1.0);

  // Example custom fragment shader
  const customFragmentShader = `
    uniform float u_time;
    uniform vec2 u_resolution;
    uniform vec2 u_mouse;
    uniform float u_intensity;
    uniform float u_speed;
    varying vec2 vUv;

    void main() {
      vec2 uv = vUv;
      float time = u_time * u_speed;
      
      // Create a simple animated gradient
      vec3 color1 = vec3(1.0, 0.2, 0.5);  // Pink
      vec3 color2 = vec3(0.2, 0.8, 1.0);  // Cyan
      
      float gradient = sin(uv.x * 5.0 + time) * cos(uv.y * 3.0 + time * 0.5);
      vec3 color = mix(color1, color2, gradient * 0.5 + 0.5);
      
      // Mouse interaction
      vec2 mouseUv = u_mouse * 0.5 + 0.5;
      float mouseDist = distance(uv, mouseUv);
      float mouseGlow = smoothstep(0.3, 0.0, mouseDist);
      
      color += mouseGlow * vec3(1.0, 1.0, 0.5) * 0.5;
      color *= u_intensity;
      
      gl_FragColor = vec4(color, 0.8);
    }
  `;

  // Example custom uniforms
  const customUniforms = {
    u_customFloat: { value: 2.0 },
    u_customColor: { value: [1.0, 0.5, 0.0] },
  };

  return (
    <>
      {/* Shader Background */}
      <ShaderBackground
        shader={currentShader}
        customFragmentShader={currentShader === 'custom' ? customFragmentShader : undefined}
        uniforms={currentShader === 'custom' ? customUniforms : undefined}
        intensity={intensity}
        speed={speed}
        interactive={true}
        resolution={1024}
      />

      {/* Controls (you can style these or integrate with your UI) */}
      <div style={{
        position: 'absolute',
        top: '20px',
        left: '20px',
        zIndex: 1000,
        background: 'rgba(0,0,0,0.7)',
        padding: '20px',
        borderRadius: '10px',
        color: 'white',
        fontFamily: 'monospace'
      }}>
        <h3>Shader Controls</h3>
        
        <div style={{ marginBottom: '10px' }}>
          <label>Shader Type:</label>
          <select 
            value={currentShader} 
            onChange={(e) => setCurrentShader(e.target.value as any)}
            style={{ marginLeft: '10px', padding: '5px' }}
          >
            <option value="matrix">Matrix Rain</option>
            <option value="circuit">Circuit Board</option>
            <option value="fluid">Fluid Simulation</option>
            <option value="neural">Neural Network</option>
            <option value="quantum">Quantum Field</option>
            <option value="cosmic">Cosmic Scene</option>
            <option value="waves">Wave Patterns</option>
            <option value="tunnel">Tunnel (Danilo Guanabara)</option>
            <option value="custom">Custom Shader</option>
          </select>
        </div>

        <div style={{ marginBottom: '10px' }}>
          <label>Intensity: {intensity.toFixed(1)}</label>
          <input
            type="range"
            min="0.1"
            max="3.0"
            step="0.1"
            value={intensity}
            onChange={(e) => setIntensity(parseFloat(e.target.value))}
            style={{ marginLeft: '10px', width: '100px' }}
          />
        </div>

        <div style={{ marginBottom: '10px' }}>
          <label>Speed: {speed.toFixed(1)}</label>
          <input
            type="range"
            min="0.1"
            max="3.0"
            step="0.1"
            value={speed}
            onChange={(e) => setSpeed(parseFloat(e.target.value))}
            style={{ marginLeft: '10px', width: '100px' }}
          />
        </div>
      </div>
    </>
  );
};

export default ShaderBackgroundExample; 