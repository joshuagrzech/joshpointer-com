import React, { useRef, useMemo, useEffect, useState } from 'react';
import { useFrame, useThree } from '@react-three/fiber';
import * as THREE from 'three';

interface WaveFlowShaderProps {
  shader?: 'waveflow' | 'custom';
  customVertexShader?: string;
  customFragmentShader?: string;
  uniforms?: Record<string, any>;
  resolution?: number;
  intensity?: number;
  speed?: number;
  interactive?: boolean;
  // Color customization props
  primaryColor?: THREE.Color | string;
  secondaryColor?: THREE.Color | string;
  accentColor?: THREE.Color | string;
  backgroundColor?: THREE.Color | string;
}

// Constants for positioning behind phone model
const PHONE_MODEL_Z = 0;
const SAFETY_BUFFER = 1.5;
const MAX_FORWARD_Z = PHONE_MODEL_Z - SAFETY_BUFFER;

const WaveFlowShader: React.FC<WaveFlowShaderProps> = ({
  shader = 'waveflow',
  customVertexShader,
  customFragmentShader,
  uniforms: customUniforms = {},
  resolution = 1024,
  intensity = 1.0,
  speed = 1.0,
  interactive = true,
  primaryColor = '#4A90E2', // Default blue
  secondaryColor = '#7FB3D3', // Default light blue
  accentColor = '#2E86AB', // Default dark blue
  backgroundColor = '#132a3a', // Default dark background
}) => {
  const { mouse, viewport, camera } = useThree();
  const meshRef = useRef<THREE.Mesh>(null);
  const [time, setTime] = useState(0);

  // Enhanced vertex shader for all presets
  const vertexShader =
    customVertexShader ||
    `
    varying vec2 vUv;
    varying vec3 vPosition;
    varying vec3 vNormal;
    
    void main() {
      vUv = uv;
      vPosition = position;
      vNormal = normal;
      gl_Position = projectionMatrix * modelViewMatrix * vec4(position, 1.0);
    }
  `;

  // Convert color props to THREE.Color objects
  const colors = useMemo(() => {
    const parseColor = (color: THREE.Color | string) => {
      if (color instanceof THREE.Color) {
        return color;
      }
      return new THREE.Color(color);
    };

    return {
      primary: parseColor(primaryColor),
      secondary: parseColor(secondaryColor),
      accent: parseColor(accentColor),
      background: parseColor(backgroundColor),
    };
  }, [primaryColor, secondaryColor, accentColor, backgroundColor]);

  // Wave Flow shader preset
  const waveFlowShader = `
    /*
        🌊 Wave Flow Shader 🌊
        Adapted from original shader with customizable colors
    */
    
    uniform float u_time;
    uniform vec2 u_resolution;
    uniform vec2 u_mouse;
    uniform float u_intensity;
    uniform float u_speed;
    uniform vec3 u_primaryColor;
    uniform vec3 u_secondaryColor;
    uniform vec3 u_accentColor;
    uniform vec3 u_backgroundColor;
    varying vec2 vUv;

    #define T u_time * u_speed
    mat2 rotate2D(float a) { return mat2(cos(a), -sin(a), sin(a), cos(a)); }

    void main() {
        vec2 fragCoord = vUv * u_resolution;
        vec2 iResolution = u_resolution;
        float iTime = u_time * u_speed;
        
        vec2 uv = (2.0 * fragCoord - iResolution.xy) / iResolution.y;

        uv = rotate2D(T * 0.2) * uv;
        vec3 color = vec3(-uv.y);
        vec2 p = uv;

        p.x += sin(p.y * 2.0 - T * 0.1) * 0.5 + 0.8;
        p.x += cos(p.x * 2.0) * 0.5 + 0.5;

        float f_x = sin(p.y + T * 0.2) * 2.5 + 2.5;
        vec2 cell = fract(p * vec2(f_x, 0.0)) - 0.5;

        float d1 = length(cell.x) * exp(-length(uv));
        float edgeWidth = max(0.4, fwidth(d1));
        d1 = smoothstep(0.3 + edgeWidth, 0.3 - edgeWidth, d1);

        d1 = mod(d1 * 3.0 - T * 0.3, 1.0);
       
        d1 = pow(0.05 / d1, 0.9);
        
        // Apply color palette
        vec3 waveColor = mix(u_primaryColor, u_secondaryColor, d1);
        waveColor = mix(waveColor, u_accentColor, smoothstep(0.5, 1.0, d1));
        
        // Add background color influence
        color = mix(u_backgroundColor, waveColor, d1);
        
        // Apply intensity
        color *= u_intensity;
        
        // Mouse interaction
        vec2 mouseUv = u_mouse * 0.5 + 0.5;
        float mouseDist = distance(vUv, mouseUv);
        float mouseEffect = smoothstep(0.3, 0.0, mouseDist) * 0.3;
        color += mouseEffect * u_accentColor;
        
        gl_FragColor = vec4(color, 1.0);
    }
  `;

  // Shader presets
  const shaderPresets = {
    waveflow: waveFlowShader,
  };

  // Create uniforms
  const uniforms = useMemo(
    () => ({
      u_time: { value: 0 },
      u_resolution: { value: new THREE.Vector2(resolution, resolution) },
      u_mouse: { value: new THREE.Vector2(0, 0) },
      u_intensity: { value: intensity },
      u_speed: { value: speed },
      u_primaryColor: { value: colors.primary },
      u_secondaryColor: { value: colors.secondary },
      u_accentColor: { value: colors.accent },
      u_backgroundColor: { value: colors.background },
      ...customUniforms,
    }),
    [resolution, intensity, speed, colors, customUniforms]
  );

  // Create shader material
  const shaderMaterial = useMemo(() => {
    const fragmentShader =
      customFragmentShader ||
      (shader === 'custom'
        ? waveFlowShader
        : shaderPresets[shader as keyof typeof shaderPresets]) ||
      waveFlowShader;

    try {
      return new THREE.ShaderMaterial({
        vertexShader,
        fragmentShader,
        uniforms,
        transparent: true,
        blending: THREE.AdditiveBlending,
        depthTest: true,
        depthWrite: false,
        side: THREE.DoubleSide,
      });
    } catch (error) {
      console.error('Shader compilation error:', error);
      // Fallback to waveflow shader
      return new THREE.ShaderMaterial({
        vertexShader,
        fragmentShader: waveFlowShader,
        uniforms,
        transparent: true,
        blending: THREE.AdditiveBlending,
        depthTest: true,
        depthWrite: false,
        side: THREE.DoubleSide,
      });
    }
  }, [shader, customFragmentShader, vertexShader, uniforms, waveFlowShader]);

  // Update uniforms
  useFrame((state) => {
    setTime(state.clock.elapsedTime);

    // Update time uniform
    if (shaderMaterial.uniforms.u_time) {
      shaderMaterial.uniforms.u_time.value = state.clock.elapsedTime;
    }

    // Update mouse uniform if interactive
    if (interactive && shaderMaterial.uniforms.u_mouse) {
      shaderMaterial.uniforms.u_mouse.value.set(mouse.x, mouse.y);
    }

    // Update resolution
    if (shaderMaterial.uniforms.u_resolution) {
      shaderMaterial.uniforms.u_resolution.value.set(viewport.width, viewport.height);
    }

    // Update color uniforms
    if (shaderMaterial.uniforms.u_primaryColor) {
      shaderMaterial.uniforms.u_primaryColor.value = colors.primary;
    }
    if (shaderMaterial.uniforms.u_secondaryColor) {
      shaderMaterial.uniforms.u_secondaryColor.value = colors.secondary;
    }
    if (shaderMaterial.uniforms.u_accentColor) {
      shaderMaterial.uniforms.u_accentColor.value = colors.accent;
    }
    if (shaderMaterial.uniforms.u_backgroundColor) {
      shaderMaterial.uniforms.u_backgroundColor.value = colors.background;
    }
  });

  return (
    <group position={[0, 0, 0]} renderOrder={-10}>
      {/* Single shader layer - removed duplicate background layer for better performance */}
      <mesh ref={meshRef} position={[0, 0, -2.5]} renderOrder={-15}>
        <planeGeometry args={[25, 25]} />
        <primitive object={shaderMaterial} />
      </mesh>
    </group>
  );
};

export default WaveFlowShader;
