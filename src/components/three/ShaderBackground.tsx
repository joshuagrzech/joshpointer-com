import React, { useRef, useMemo, useEffect, useState } from 'react';
import { useFrame, useThree } from '@react-three/fiber';
import * as THREE from 'three';

interface ShaderBackgroundProps {
  shader?: 'waves' | 'ectoplasm' | 'magicalspillage' | 'cubes' | 'custom';
  customVertexShader?: string;
  customFragmentShader?: string;
  uniforms?: Record<string, any>;
  resolution?: number;
  intensity?: number;
  speed?: number;
  interactive?: boolean;
}

// Constants for positioning behind phone model
const PHONE_MODEL_Z = 0;
const SAFETY_BUFFER = 1.5;
const MAX_FORWARD_Z = PHONE_MODEL_Z - SAFETY_BUFFER;

const ShaderBackground: React.FC<ShaderBackgroundProps> = ({
  shader = 'waves',
  customVertexShader,
  customFragmentShader,
  uniforms: customUniforms = {},
  resolution = 1024,
  intensity = 1.0,
  speed = 1.0,
  interactive = true,
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

  // Shader presets
  const shaderPresets = {
    waves: `
      uniform float u_time;
      uniform vec2 u_resolution;
      uniform vec2 u_mouse;
      uniform float u_intensity;
      uniform float u_speed;
      varying vec2 vUv;

      void main() {
        vec2 fragCoord = vUv * u_resolution;
        vec2 uv = (2.0 * fragCoord - u_resolution.xy) / min(u_resolution.x, u_resolution.y);
        
        for(float i = 1.0; i < 8.0; i++){
          uv.y += i * 0.1 / i * 
            sin(uv.x * i * i + u_time * u_speed * 0.5) * sin(uv.y * i * i + u_time * u_speed * 0.5);
        }
        
        vec3 col;
        col.r = uv.y - 0.1;
        col.g = uv.y + 0.3;
        col.b = uv.y + 0.95;
        
        // Apply intensity
        col *= u_intensity;
        
        // Mouse interaction
        vec2 mouseUv = u_mouse * 0.5 + 0.5;
        float mouseDist = distance(vUv, mouseUv);
        float mouseEffect = smoothstep(0.3, 0.0, mouseDist) * 0.2;
        col += mouseEffect;
        
        gl_FragColor = vec4(col, 1.0);
      }
    `,

    ectoplasm: `
      /*
          👻 Ectoplasm 👻 by chronos (Simplified for WebGL)
          Based on: https://www.shadertoy.com/view/3XtGzs
      */
      
      uniform float u_time;
      uniform vec2 u_resolution;
      uniform vec2 u_mouse;
      uniform float u_intensity;
      uniform float u_speed;
      varying vec2 vUv;

      const float PI = 3.14159265;
      
      float hash(vec2 p) {
        return fract(sin(dot(p, vec2(12.9898, 78.233))) * 43758.5453);
      }
      
      float T(vec2 uv) {
        vec2 cell_id = floor(uv);
        vec2 cell_uv = fract(uv);

        // Random rotation per cell
        float rnd = hash(cell_id);
        float angle = rnd * PI * 0.5; // 0, 90, 180, or 270 degrees
        float c = cos(angle);
        float s = sin(angle);
        mat2 R = mat2(c, s, -s, c);

        cell_uv = R * (cell_uv - 0.5) + 0.5;

        float d = abs(length(cell_uv - vec2(1.0, 1.0)) - 0.5);
        d = min(d, abs(length(cell_uv - vec2(0.0, 0.0)) - 0.5));

        return d;
      }

      void main() {
        vec2 fragCoord = vUv * u_resolution;
        vec3 final_color = vec3(0.0);
        float iTime = u_time * u_speed;
        
        // Simplified sampling - just use screen coordinates
        vec2 uv = 2.0 * (fragCoord - u_resolution.xy * 0.5) / u_resolution.y;
        
        // Rotation
        float c = cos(iTime * 0.05);
        float s = sin(iTime * 0.05);
        uv *= mat2(c, s, -s, c);
        
        // Simplified turbulence - fewer iterations for better performance
        for(float j = 1.0; j < 12.0; j++) { 
          float factor = 1.66 / (j + 1.0);
          
          if (mod(j, 2.0) < 0.5) {
            uv.x += factor * sin(iTime + j * uv.y);
          } else {
            uv.y += factor * sin(iTime + j * uv.x);
          }
        }

        // Pattern generation
        vec3 color = vec3(smoothstep(0.15, 0.01, T(uv)));
        
        // Color modulation
        color *= 1.0 + sin(
           4.0 * PI * T(iTime * 0.1 + vec2(sin(iTime * 0.23), cos(iTime * 0.3)) - uv.yx)
          * vec3(2.0, 3.0, 1.0) / 3.0
          + vec3(2.0, 3.0, 1.0)
        );
        
        // Radial falloff
        color *= exp(-PI * pow(dot(uv, vec2(c, s)), 2.0));
        
        final_color = color;
        
        // Tone mapping
        final_color = tanh(1.2 * final_color);
        final_color = pow(final_color, vec3(1.0 / 2.2));
        
        // Apply intensity
        final_color *= u_intensity;
        
        // Mouse interaction
        vec2 mouseUv = u_mouse * 0.5 + 0.5;
        vec2 mouseCoord = mouseUv * u_resolution;
        float mouseDist = length(fragCoord - mouseCoord) / u_resolution.y;
        float mouseEffect = smoothstep(0.3, 0.0, mouseDist) * 0.3;
        final_color += mouseEffect * vec3(0.2, 0.5, 1.0);
        
        gl_FragColor = vec4(final_color, 1.0);
      }
    `,

    magicalspillage: `
    /*
        💫 Magical Spillage 💫 by chronos
        Converted from Shadertoy: https://www.shadertoy.com/view/3XtGzs
        
        No fluid simulators were harmed in the making of this shader ^_^
    */
    
    uniform float u_time;
    uniform vec2 u_resolution;
    uniform vec2 u_mouse;
    uniform float u_intensity;
    uniform float u_speed;
    varying vec2 vUv;
  
    // Reduced sample count for better WebGL performance
    const float sample_count = 4.0;
  
    const float PI = 3.14159265;
    const float PHI = sqrt(5.0) * 0.5 + 0.5;
    const float p1 = 0.7548776662466927; // reciprocal of plastic number
    const float p2 = 0.5698402909980532; // reciprocal of squared plastic number
    vec2 plastic = vec2(p1, p2);
        
    float T(vec2 uv) {
      vec2 cell_id = floor(uv);
      vec2 cell_uv = fract(uv);
  
      mat2 R0 = mat2(1.0, 0.0, 0.0, 1.0);
      mat2 R1 = mat2(0.0, 1.0, -1.0, 0.0);
  
      // WebGL compatible hash function (replaced bitwise operations)
      float x = cell_id.x;
      float y = cell_id.y;
      float hash_val = sin(x * 12.9898 + y * 78.233) * 43758.5453;
      hash_val = fract(hash_val);
      
      // Simple random selection instead of bitwise operations
      float rnd = fract(hash_val * 1234.5678);
      mat2 R = mix(R0, R1, step(0.5, rnd));
  
      cell_uv = R * (cell_uv - 0.5) + 0.5;
  
      float d = abs(length(cell_uv - vec2(1.0, 1.0)) - 0.5);
      d = min(d, abs(length(cell_uv - vec2(0.0, 0.0)) - 0.5));
  
      return d;
    }
  
    vec2 squig(float a) {
      vec2 A = fract(vec2(a - 0.25, a)) * 8.0;
      return clamp(abs(A - 4.0) - 2.0, -1.0, 1.0);
    }
  
    vec2 sample_pattern(float sample_index) {
      float r = fract(p1 * sample_index);
      float a = fract(p2 * sample_index);
      vec2 p = squig(a) * sqrt(r);
      return p;
    }
  
    void main() {
      vec2 fragCoord = vUv * u_resolution;
      float iTime = u_time * u_speed;
      vec2 iResolution = u_resolution;
      
      vec3 final_color = vec3(0.0);
      float zoom = 2.0;
          
      for(float i = 0.0; i < sample_count; i++) {
        vec2 offset = sample_pattern(i);
        vec2 uv = zoom * (2.0 * (floor(fragCoord) + offset) - iResolution.xy) / iResolution.y;
        float ps = zoom * 2.0 / iResolution.y;
        
        float c = cos(iTime * 0.05);
        float s = sin(iTime * 0.05);
        uv *= mat2(c, s, -s, c);
        
        // WebGL compatible loop - replaced dynamic array indexing
        for(float j = 1.0; j < 26.0; j++) { 
          float jmod2 = mod(j, 2.0);
          float jplus1mod2 = mod(j + 1.0, 2.0);
          
          if (jmod2 < 0.5) {
            if (jplus1mod2 < 0.5) {
              uv.x += 1.5 / (j + 1.0) * sin(iTime + j * uv.x);
            } else {
              uv.x += 1.5 / (j + 1.0) * sin(iTime + j * uv.y);
            }
          } else {
            if (jplus1mod2 < 0.5) {
              uv.y += 1.5 / (j + 1.0) * sin(iTime + j * uv.x);
            } else {
              uv.y += 1.5 / (j + 1.0) * sin(iTime + j * uv.y);
            }
          }
        }
  
        vec3 color = vec3(smoothstep(0.15, 0.01, T(uv)));
        color *= 
          1.0 + sin(
            4.0 * PI * T(iTime * 0.1 + vec2(sin(iTime * 0.23), cos(iTime * 0.3)) - uv.yx)
            + vec3(1.0, 2.0, 3.0)
          );
        final_color += color;
      }
      
      final_color /= sample_count;
      final_color = tanh(1.2 * final_color);
      final_color = pow(final_color, vec3(1.0 / 2.2));
      
      // Apply intensity
      final_color *= u_intensity;
      
      // Mouse interaction - creates a magical glow effect
      vec2 mouseUv = u_mouse * 0.5 + 0.5;
      float mouseDist = distance(vUv, mouseUv);
      float mouseGlow = smoothstep(0.3, 0.0, mouseDist) * 0.3;
      vec3 magicalGlow = vec3(1.0, 0.8, 1.0); // Purple-pink magical glow
      final_color += mouseGlow * magicalGlow;
      
      gl_FragColor = vec4(final_color, 1.0);
    }
  `,

    cubes: `
    /*
        🎲 Ray-marching Cubes 🎲
        Simplified version for WebGL compatibility
    */
    
    uniform float u_time;
    uniform vec2 u_resolution;
    uniform vec2 u_mouse;
    uniform float u_intensity;
    uniform float u_speed;
    varying vec2 vUv;

    vec3 H(float a) { 
      return cos(radians(vec3(90.0, 30.0, -30.0))-((a)*6.2832))*0.5+0.5;  // hue palette
    }
    
    mat2 RT(float a) { 
      return mat2(cos(a*1.571+vec4(0.0,-1.571,1.571,0.0)));  // rotate
    }
    
    float cubes(vec3 p) { 
      p = abs(p-round(p)); 
      return max(p.x, max(p.y, p.z)); 
    }
    
    void main() {
      vec2 fragCoord = vUv * u_resolution;
      float iTime = u_time * u_speed;
      vec2 iResolution = u_resolution;
      vec2 iMouse = u_mouse;
      
      vec3 c = vec3(0.0); // black background
      vec3 cam = vec3(0.5, 0.5, iTime/4.0);
      
      // Simplified without anti-aliasing for now
      vec2 R = iResolution.xy;
      vec2 m = (iMouse.xy/R*4.0)-2.0;
      
      // Auto-rotate when mouse is not moving (no z component in WebGL)
      if (length(iMouse) < 0.1) m = vec2(cos(iTime/8.0)*0.5+0.5); // rotate with time
      mat2 pitch = RT(m.y), 
           yaw   = RT(m.x);
      
      vec3 u = normalize(vec3((fragCoord-0.5*R)/R.y, 0.7));
      u.yz *= pitch;
      u.xz *= yaw;
      float d = 0.0; // step dist for raymarch
      
      for (int i = 0; i < 50; i++) { // raymarch loop
        float s = smoothstep(0.2, 0.25, cubes(cam+u*d)-0.05);
        if (s < 0.01) break;
        d += s;
      }
      
      vec3 v = d*0.01*H(length(u.xy)); // objects & color
      c = v + max(v, 0.5-H(d));  // add to bg
      
      vec3 final_color = exp(log(c)/2.2);
      
      // Apply intensity
      final_color *= u_intensity;
      
      // Mouse interaction
      vec2 mouseUv = u_mouse * 0.5 + 0.5;
      float mouseDist = distance(vUv, mouseUv);
      float mouseEffect = smoothstep(0.3, 0.0, mouseDist) * 0.2;
      final_color += mouseEffect;
      
      gl_FragColor = vec4(final_color, 1.0);
    }
  `,
  };

  // Create uniforms
  const uniforms = useMemo(
    () => ({
      u_time: { value: 0 },
      u_resolution: { value: new THREE.Vector2(resolution, resolution) },
      u_mouse: { value: new THREE.Vector2(0, 0) },
      u_intensity: { value: intensity },
      u_speed: { value: speed },
      ...customUniforms,
    }),
    [resolution, intensity, speed, customUniforms]
  );

  // Create shader material
  const shaderMaterial = useMemo(() => {
    const fragmentShader =
      customFragmentShader ||
      (shader === 'custom'
        ? shaderPresets.waves
        : shaderPresets[shader as keyof typeof shaderPresets]) ||
      shaderPresets.waves;

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
      // Fallback to waves shader
      return new THREE.ShaderMaterial({
        vertexShader,
        fragmentShader: shaderPresets.waves,
        uniforms,
        transparent: true,
        blending: THREE.AdditiveBlending,
        depthTest: true,
        depthWrite: false,
        side: THREE.DoubleSide,
      });
    }
  }, [shader, customFragmentShader, vertexShader, uniforms]);

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

export default ShaderBackground;
