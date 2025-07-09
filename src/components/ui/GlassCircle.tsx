'use client';

import React, { useMemo, useRef, useEffect, useState } from 'react';
import { useFrame, useThree } from '@react-three/fiber';
import * as THREE from 'three';
import { useTransparency } from './TransparencyToggle';
import { useTheme } from 'next-themes';

interface GlassCircleProps {
  position?: [number, number, number];
  size?: number;
  refractiveIndex?: number;
  chromaticAberration?: number;
  onClick?: () => void;
  children?: React.ReactNode;
}

export default function GlassCircle({
  position = [0, 0, 0],
  size = 1,
  refractiveIndex = 1.5,
  chromaticAberration = 0.02,
  onClick,
  children,
}: GlassCircleProps) {
  // Circle always uses size for both dimensions
  const actualWidth = size;
  const actualHeight = size;

  const meshRef = useRef<THREE.Mesh>(null);
  const groupRef = useRef<THREE.Group>(null);
  const { gl, scene, camera, viewport, mouse } = useThree();
  const [isHovered, setIsHovered] = useState(false);
  const frameRef = useRef(0);
  const animationRef = useRef<number | null>(null);
  const { isTransparencyEnabled } = useTransparency();
  const { theme } = useTheme();

  // Create render target
  const renderTarget = useMemo(() => {
    return new THREE.WebGLRenderTarget(1024, 1024, {
      minFilter: THREE.LinearFilter,
      magFilter: THREE.LinearFilter,
      format: THREE.RGBAFormat,
    });
  }, []);

  // Vertex shader (same as PhoneModel)
  const vertexShader = `
    varying vec2 vUv;
    varying vec4 vScreenPosition;
    
    void main() {
      vUv = uv;
      vScreenPosition = projectionMatrix * modelViewMatrix * vec4(position, 1.0);
      gl_Position = vScreenPosition;
    }
  `;

  // Fragment shader for circle glass effect
  const fragmentShader = `
    uniform float u_time;
    uniform vec2 u_resolution;
    uniform sampler2D u_backgroundTexture;
    uniform float u_hover;
    uniform float u_refractiveIndex; // 1.0 = no lens effect, >1 = stronger lens
    uniform float u_chromaticAberration; // 0.0 = no color fringing, >0 = more fringing
    
    varying vec2 vUv;
    varying vec4 vScreenPosition;
    
    // Circle distance function
    float circleDistance(vec2 p) {
      return length(p);
    }
    
    void main() {
      // Convert to screen coordinates
      vec2 screenUv = (vScreenPosition.xy / vScreenPosition.w) * 0.5 + 0.5;
      vec2 uv = vUv;
      
      // Center the effect (no mouse tracking)
      vec2 m2 = (uv - 0.5);
      
      // Add hover effect to enhance the glass properties
      float hoverMultiplier = 1.0 + u_hover * 0.3;
      float refractiveIndex = u_refractiveIndex * hoverMultiplier;
      float chromaticAberration = u_chromaticAberration * (1.0 + u_hover * 0.5);
      
      // Calculate distance from center
      float dist = circleDistance(m2);
      
      // Circle edge calculation with hover expansion
      float baseRadius = 0.4;
      float hoverExpansion = u_hover * 0.05;
      float radius = baseRadius + hoverExpansion;
      float shapeMask = smoothstep(radius + 0.01, radius - 0.01, dist);
      
      // Glass effects
      float roundedBox = (1.0 - shapeMask) * 0.0001;
      float rb1 = clamp(shapeMask * 16.0, 0.0, 1.0);
      float rb2 = clamp((shapeMask - 0.02) * 32.0, 0.0, 1.0) - clamp(pow(shapeMask - 0.05, 1.0) * 32.0, 0.0, 1.0);
      float rb3 = clamp((shapeMask + 0.02) * 4.0, 0.0, 1.0) - clamp(pow(shapeMask, 1.0) * 4.0, 0.0, 1.0);
      
      vec4 fragColor = vec4(0.0);
      
      if (rb1 + rb2 > 0.0) {
        // Enhanced lens distortion with refractive index
        vec2 distorted = (screenUv - 0.5) * (1.0 + (refractiveIndex - 1.0) * (1.0 - roundedBox * 5000.0)) + 0.5;
        vec2 caOffset = chromaticAberration * m2;
        
        // 9x9 blur kernel with chromatic aberration
        float total = 0.0;
        for (float x = -4.0; x <= 4.0; x += 1.0) {
          for (float y = -4.0; y <= 4.0; y += 1.0) {
            vec2 offset = vec2(x, y) * 0.5 / u_resolution;
            
            vec3 col;
            // Chromatic aberration: sample different color channels with slight offsets
            col.r = texture2D(u_backgroundTexture, clamp(offset + distorted + caOffset, 0.0, 1.0)).r;
            col.g = texture2D(u_backgroundTexture, clamp(offset + distorted, 0.0, 1.0)).g;
            col.b = texture2D(u_backgroundTexture, clamp(offset + distorted - caOffset, 0.0, 1.0)).b;
            
            fragColor += vec4(col, 1.0);
            total += 1.0;
          }
        }
        fragColor /= total;
        
        // Enhanced lighting with gradient
        float gradient = clamp((clamp(m2.y, 0.0, 0.2) + 0.1) / 2.0, 0.0, 1.0) +
                        clamp((clamp(-m2.y, -1000.0, 0.2) * rb3 + 0.1) / 2.0, 0.0, 1.0);
        
        // Add hover glow enhancement
        float glowIntensity = 1.0 + u_hover * 0.4;
        fragColor = clamp(fragColor + vec4(rb1) * gradient * glowIntensity + vec4(rb2) * 0.3, 0.0, 1.0);
        
      } else {
        fragColor = texture2D(u_backgroundTexture, screenUv);
      }
      
      // Additional hover glow effect
      if (u_hover > 0.0) {
        vec2 center = vec2(0.5, 0.5);
        float dist = length(uv - center);
        float glowFalloff = smoothstep(0.7, 0.3, dist);
        vec3 glowColor = mix(fragColor.rgb, fragColor.rgb * 1.4, 0.3);
        fragColor.rgb = mix(fragColor.rgb, glowColor, glowFalloff * u_hover * 0.2);
      }
      
      gl_FragColor = fragColor;
    }
  `;

  // Create uniforms
  const uniforms = useMemo(
    () => ({
      u_time: { value: 0 },
      u_resolution: { value: new THREE.Vector2(1024, 1024) },
      u_backgroundTexture: { value: renderTarget.texture },
      u_hover: { value: 0 },
      u_refractiveIndex: { value: refractiveIndex },
      u_chromaticAberration: { value: chromaticAberration },
    }),
    [renderTarget, refractiveIndex, chromaticAberration]
  );

  // Create shader material
  const shaderMaterial = useMemo(() => {
    return new THREE.ShaderMaterial({
      vertexShader,
      fragmentShader,
      uniforms,
      transparent: true,
      depthTest: true,
      depthWrite: false,
      side: THREE.DoubleSide,
    });
  }, [vertexShader, fragmentShader, uniforms]);

  // Handle mouse interactions
  const handlePointerOver = (event: any) => {
    event.stopPropagation();
    setIsHovered(true);
  };

  const handlePointerOut = (event: any) => {
    event.stopPropagation();
    setIsHovered(false);
  };

  const handleClick = (event: any) => {
    event.stopPropagation();
    if (onClick) onClick();
  };

  // Update hover state with proper animation cleanup
  useEffect(() => {
    // Cancel previous animation
    if (animationRef.current) {
      cancelAnimationFrame(animationRef.current);
    }

    const target = isHovered ? 1 : 0;
    const startTime = performance.now();
    const duration = 300; // 300ms animation

    const animate = (currentTime: number) => {
      const elapsed = currentTime - startTime;
      const progress = Math.min(elapsed / duration, 1);

      // Use easeOutCubic for smooth animation
      const easeProgress = 1 - Math.pow(1 - progress, 3);
      const currentValue = target * easeProgress;

      // Update both materials' hover uniforms
      if (uniforms?.u_hover) {
        uniforms.u_hover.value = currentValue;
      }

      // Update solid material hover uniform if it exists
      if (meshRef.current?.material && 'uniforms' in meshRef.current.material) {
        const material = meshRef.current.material as THREE.ShaderMaterial;
        if (material.uniforms?.u_hover) {
          material.uniforms.u_hover.value = currentValue;
        }
      }

      if (progress < 1) {
        animationRef.current = requestAnimationFrame(animate);
      } else {
        // Ensure exact target value
        if (uniforms?.u_hover) {
          uniforms.u_hover.value = target;
        }
        if (meshRef.current?.material && 'uniforms' in meshRef.current.material) {
          const material = meshRef.current.material as THREE.ShaderMaterial;
          if (material.uniforms?.u_hover) {
            material.uniforms.u_hover.value = target;
          }
        }
        animationRef.current = null;
      }
    };

    animationRef.current = requestAnimationFrame(animate);

    // Cleanup on unmount
    return () => {
      if (animationRef.current) {
        cancelAnimationFrame(animationRef.current);
      }
    };
  }, [isHovered, uniforms]);

  // Update refractive index and chromatic aberration uniforms
  useEffect(() => {
    if (uniforms?.u_refractiveIndex) {
      uniforms.u_refractiveIndex.value = refractiveIndex;
    }
    if (uniforms?.u_chromaticAberration) {
      uniforms.u_chromaticAberration.value = chromaticAberration;
    }
  }, [refractiveIndex, chromaticAberration, uniforms]);

  // Render loop
  useFrame((state) => {
    if (meshRef.current) {
      // Update time for transparent material only
      if (uniforms?.u_time) {
        uniforms.u_time.value = state.clock.elapsedTime;
      }

      // Only render background to texture for transparent material
      if (uniforms && !isTransparencyEnabled) {
        // Render background to texture
        const originalRenderTarget = gl.getRenderTarget();
        const meshVisible = meshRef.current.visible;

        meshRef.current.visible = false;
        gl.setRenderTarget(renderTarget);
        gl.clear();
        gl.render(scene, camera);

        gl.setRenderTarget(originalRenderTarget);
        meshRef.current.visible = meshVisible;
      }
    }
  });

  const frostedMaterial = useMemo(() => {
    // Simple solid glass material with high contrast for accessibility
    const solidVertexShader = `
      varying vec2 vUv;
      varying vec3 vNormal;
      
      void main() {
        vUv = uv;
        vNormal = normalize(normalMatrix * normal);
        gl_Position = projectionMatrix * modelViewMatrix * vec4(position, 1.0);
      }
    `;

    const solidFragmentShader = `
      uniform float u_hover;
      uniform vec3 u_glassColor;
      uniform float u_contrast;
      
      varying vec2 vUv;
      varying vec3 vNormal;
      
      void main() {
        vec2 uv = vUv;
        vec2 m2 = (uv - 0.5);
        
        // Circle calculation
        float dist = length(m2);
        float radius = 0.4;
        float shapeMask = smoothstep(radius + 0.01, radius - 0.01, dist);
        
        // Base glass color
        vec3 glassColor = u_glassColor;
        
        // Enhanced contrast for accessibility
        float contrast = u_contrast * (1.0 + u_hover * 0.3);
        glassColor = (glassColor - 0.5) * (1.0 + contrast) + 0.5;
        
        // Simple lighting
        vec3 normal = normalize(vNormal);
        float lighting = dot(normal, vec3(0.0, 1.0, 0.0)) * 0.5 + 0.5;
        
        // Final color
        vec3 finalColor = glassColor * lighting;
        
        // Add hover glow effect
        if (u_hover > 0.0) {
          vec2 center = vec2(0.5, 0.5);
          float dist = length(uv - center);
          float glowFalloff = smoothstep(0.7, 0.3, dist);
          vec3 glowColor = finalColor * 1.4;
          finalColor = mix(finalColor, glowColor, glowFalloff * u_hover * 0.3);
        }
        
        // Apply shape mask
        if (shapeMask < 0.01) {
          discard;
        }
        
        gl_FragColor = vec4(finalColor, 1.0);
      }
    `;

    return new THREE.ShaderMaterial({
      vertexShader: solidVertexShader,
      fragmentShader: solidFragmentShader,
      uniforms: {
        u_hover: { value: 0 },
        u_glassColor: {
          value: theme === 'dark' ? new THREE.Color(0, 0, 0) : new THREE.Color(0.9, 0.95, 1.0),
        }, // Light blue-white
        u_contrast: { value: 0.2 }, // High contrast for accessibility
      },
      transparent: theme === 'dark' ? true : false,
      depthTest: false,
      depthWrite: false,
      side: THREE.DoubleSide,
    });
  }, [isTransparencyEnabled, theme]);

  return (
    <group
      ref={groupRef}
      position={position}
      onPointerOver={handlePointerOver}
      onPointerOut={handlePointerOut}
      onClick={handleClick}
    >
      <mesh ref={meshRef} material={isTransparencyEnabled ? frostedMaterial : shaderMaterial}>
        <planeGeometry args={[actualWidth, actualHeight]} />
      </mesh>
      {children}
    </group>
  );
}
