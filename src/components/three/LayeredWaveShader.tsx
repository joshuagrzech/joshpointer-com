import React, { useRef, useMemo, useEffect, useState } from 'react';
import { useFrame, useThree } from '@react-three/fiber';
import * as THREE from 'three';

interface LayeredWaveShaderProps {
  shader?: 'layeredwave' | 'custom';
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

const LayeredWaveShader: React.FC<LayeredWaveShaderProps> = ({
  shader = 'layeredwave',
  customVertexShader,
  customFragmentShader,
  uniforms: customUniforms = {},
  resolution = 1024,
  intensity = 1.0,
  speed = 1.0,
  interactive = true,
  primaryColor = '#1A4B8C', // Default deep blue
  secondaryColor = '#19A7CE', // Default light blue
  accentColor = '#FFFFFF', // Default white
  backgroundColor = '#0D1B2A', // Default dark blue
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

  // Layered Wave shader preset
  const layeredWaveShader = `
    /*
        🌊 Layered Wave Shader 🌊
        Multi-layered wave effect with gradient functions
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

    float gradient(float p)
    {
        vec2 pt0 = vec2(0.00,0.0);
        vec2 pt1 = vec2(0.86,0.1);
        vec2 pt2 = vec2(0.955,0.40);
        vec2 pt3 = vec2(0.99,1.0);
        vec2 pt4 = vec2(1.00,0.0);
        if (p < pt0.x) return pt0.y;
        if (p < pt1.x) return mix(pt0.y, pt1.y, (p-pt0.x) / (pt1.x-pt0.x));
        if (p < pt2.x) return mix(pt1.y, pt2.y, (p-pt1.x) / (pt2.x-pt1.x));
        if (p < pt3.x) return mix(pt2.y, pt3.y, (p-pt2.x) / (pt3.x-pt2.x));
        if (p < pt4.x) return mix(pt3.y, pt4.y, (p-pt3.x) / (pt4.x-pt3.x));
        return pt4.y;
    }

    float waveN(vec2 uv, vec2 s12, vec2 t12, vec2 f12, vec2 h12)
    {
        vec2 x12 = sin((u_time * u_speed * s12 + t12 + uv.x) * f12) * h12;

        float g = gradient(uv.y / (0.5 + x12.x + x12.y));
        
        return g * 0.27;
    }

    float wave1(vec2 uv)
    {
        return waveN(vec2(uv.x,uv.y-0.25), vec2(0.03,0.06), vec2(0.00,0.02), vec2(8.0,3.7), vec2(0.06,0.05));
    }

    float wave2(vec2 uv)
    {
        return waveN(vec2(uv.x,uv.y-0.25), vec2(0.04,0.07), vec2(0.16,-0.37), vec2(6.7,2.89), vec2(0.06,0.05));
    }

    float wave3(vec2 uv)
    {
        return waveN(vec2(uv.x,0.75-uv.y), vec2(0.035,0.055), vec2(-0.09,0.27), vec2(7.4,2.51), vec2(0.06,0.05));
    }

    float wave4(vec2 uv)
    {
        return waveN(vec2(uv.x,0.75-uv.y), vec2(0.032,0.09), vec2(0.08,-0.22), vec2(6.5,3.89), vec2(0.06,0.05));
    }

    void main() {
        vec2 fragCoord = vUv * u_resolution;
        vec2 iResolution = u_resolution;
        float iTime = u_time * u_speed;
        
        vec2 uv = fragCoord.xy / iResolution.xy;
        
        float waves = wave1(uv) + wave2(uv) + wave3(uv) + wave4(uv);
        
        float x = uv.x;
        float y = 1.0 - uv.y;
        
        // Use customizable colors instead of hardcoded values
        vec3 bg = mix(u_backgroundColor, u_primaryColor, (x+y)*0.55);
        vec3 ac = bg + u_accentColor * waves * 0.6; // Reduce wave intensity to make them less prominent
        
        // Apply intensity
        ac *= u_intensity;
        
        // Mouse interaction
        vec2 mouseUv = u_mouse * 0.5 + 0.5;
        float mouseDist = distance(vUv, mouseUv);
        float mouseEffect = smoothstep(0.3, 0.0, mouseDist) * 0.2;
        ac += mouseEffect * u_secondaryColor;
        
        gl_FragColor = vec4(ac, 1.0);
    }
  `;

  // Shader presets
  const shaderPresets = {
    layeredwave: layeredWaveShader,
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
        ? layeredWaveShader
        : shaderPresets[shader as keyof typeof shaderPresets]) ||
      layeredWaveShader;

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
      // Fallback to layeredwave shader
      return new THREE.ShaderMaterial({
        vertexShader,
        fragmentShader: layeredWaveShader,
        uniforms,
        transparent: true,
        blending: THREE.AdditiveBlending,
        depthTest: true,
        depthWrite: false,
        side: THREE.DoubleSide,
      });
    }
  }, [shader, customFragmentShader, vertexShader, uniforms, layeredWaveShader]);

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

export default LayeredWaveShader;
