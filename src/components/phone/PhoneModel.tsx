'use client';

import React, { useMemo, useRef, useEffect } from 'react';
import { Html } from '@react-three/drei';
import { useFrame, useThree } from '@react-three/fiber';
import * as THREE from 'three';
import PhoneScreen from './PhoneScreen';

export default function PhoneModel() {
  const meshRef = useRef<THREE.Mesh>(null);
  const { gl, scene, camera, viewport } = useThree();
  const size = {
    "width": 2286,
    "height": 1232,
    "top": 0,
    "left": 0,
    "updateStyle": true
}
  // iPhone aspect ratio (roughly 19.5:9 or 2.17:1)
  const iPhoneAspectRatio = 9/10
  const phoneWidth = 1.5;
  const phoneHeight = phoneWidth / iPhoneAspectRatio;
  
  // Create render target that matches viewport size
  const renderTarget = useMemo(() => {
    return new THREE.WebGLRenderTarget(size.width, size.height, {
      minFilter: THREE.LinearFilter,
      magFilter: THREE.LinearFilter,
      format: THREE.RGBAFormat,
    });
  }, [size.width, size.height]);
  
  // Update render target size when viewport changes
  useEffect(() => {
    renderTarget.setSize(size.width, size.height);
  }, [size.width, size.height, renderTarget]);
  
  // Glass refraction shader - exact original but with proper UV mapping
  const vertexShader = `
    varying vec2 vUv;
    varying vec4 vScreenPosition;
    
    void main() {
      vUv = uv;
      vScreenPosition = projectionMatrix * modelViewMatrix * vec4(position, 1.0);
      gl_Position = vScreenPosition;
    }
  `;
  
  const fragmentShader = `
    uniform float u_time;
    uniform vec2 u_resolution;
    uniform sampler2D u_backgroundTexture;
    varying vec2 vUv;
    varying vec4 vScreenPosition;
    
    void main() {
      // Convert to screen coordinates
      vec2 screenUv = (vScreenPosition.xy / vScreenPosition.w) * 0.5 + 0.5;
      vec2 uv = vUv;
      
      vec2 mouse = u_resolution / 2.0; // Keep centered
      vec2 m2 = (uv - mouse / u_resolution);
      
      float roundedBox = pow(abs(m2.x * u_resolution.x / u_resolution.y), 8.0) + pow(abs(m2.y), 8.0);
      float rb1 = clamp((1.0 - roundedBox * 10000.0) * 8.0, 0.0, 1.0);
      float rb2 = clamp((0.95 - roundedBox * 9500.0) * 16.0, 0.0, 1.0) - clamp(pow(0.9 - roundedBox * 9500.0, 1.0) * 16.0, 0.0, 1.0);
      float rb3 = (clamp((1.5 - roundedBox * 11000.0) * 2.0, 0.0, 1.0) - clamp(pow(1.0 - roundedBox * 11000.0, 1.0) * 2.0, 0.0, 1.0));
      
      vec4 fragColor = vec4(0.0);
      float transition = smoothstep(0.0, 1.0, rb1 + rb2);
      
      if (transition > 0.0) {
        // Lens distortion applied to screen coordinates
        vec2 lens = ((screenUv - 0.5) * 1.0 * (1.0 - roundedBox * 5000.0) + 0.5);
        
        // Blur with the original 9x9 kernel using screen coordinates
        float total = 0.0;
        vec2 pixelSize = 1.0 / u_resolution;
        for (float x = -4.0; x <= 4.0; x += 1.0) {
          for (float y = -4.0; y <= 4.0; y += 1.0) {
            vec2 offset = vec2(x, y) * 0.5 * pixelSize;
            vec2 sampleUv = clamp(lens + offset, 0.0, 1.0);
            fragColor += texture2D(u_backgroundTexture, sampleUv);
            total += 1.0;
          }
        }
        fragColor /= total;
        
        // Original lighting
        float gradient = clamp((clamp(m2.y, 0.0, 0.2) + 0.1) / 2.0, 0.0, 1.0) + 
                        clamp((clamp(-m2.y, -1000.0, 0.2) * rb3 + 0.1) / 2.0, 0.0, 1.0);
        vec4 lighting = clamp(fragColor + vec4(rb1) * gradient + vec4(rb2) * 0.3, 0.0, 1.0);
        
        // Antialiasing using screen coordinates
        fragColor = mix(texture2D(u_backgroundTexture, screenUv), lighting, transition);
      } else {
        fragColor = texture2D(u_backgroundTexture, screenUv);
      }
      
      gl_FragColor = fragColor;
    }
  `;
  
  // Create uniforms
  const uniforms = useMemo(() => ({
    u_time: { value: 0 },
    u_resolution: { value: new THREE.Vector2(size.width, size.height) },
    u_backgroundTexture: { value: renderTarget.texture },
  }), [renderTarget, size.width, size.height]);
  
  // Update resolution uniform when size changes
  useEffect(() => {
    if (uniforms.u_resolution) {
      uniforms.u_resolution.value.set(size.width, size.height);
    }
  }, [size.width, size.height, uniforms]);
  
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
  
  // Clean render-to-texture approach
  useFrame(() => {
    if (meshRef.current) {
      // Store current state
      const originalRenderTarget = gl.getRenderTarget();
      const phoneVisible = meshRef.current.visible;
      
      // Hide phone and render background
      meshRef.current.visible = false;
      gl.setRenderTarget(renderTarget);
      gl.clear();
      gl.render(scene, camera);
      
      // Restore state
      gl.setRenderTarget(originalRenderTarget);
      meshRef.current.visible = phoneVisible;
    }
  });
  
  return (
    <group rotation={[0, 0, 0]} position={[0, 0, 0]}>
      {/* Glass iPhone shape */}
      <mesh ref={meshRef} material={shaderMaterial} position={[0, 0, 0]}>
        <planeGeometry args={[phoneWidth, phoneHeight]} />
      </mesh>
      
      {/* Phone screen overlay */}
      <Html
        transform
        center
        distanceFactor={0.25}
        position={[0, 0, 0.01]}
        rotation={[0, 0, 0]}
        style={{
          transform: 'rotateY(0deg)',
        }}
        contentEditable={false}
      >

          <PhoneScreen />
        
      </Html>
    </group>
  );
}
