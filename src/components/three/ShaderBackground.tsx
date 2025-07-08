import React, { useRef, useMemo, useEffect, useState } from 'react';
import { useFrame, useThree } from '@react-three/fiber';
import * as THREE from 'three';

interface ShaderBackgroundProps {
  shader?: 'matrix' | 'circuit' | 'fluid' | 'neural' | 'quantum' | 'cosmic' | 'waves' | 'tunnel' | 'fractal' | 'firewall' | 'mosaic' | 'custom';
  customVertexShader?: string;
  customFragmentShader?: string;
  uniforms?: Record<string, any>;
  resolution?: number;
  intensity?: number;
  speed?: number;
  interactive?: boolean;
  // Fractal-specific color options
  fractalColor1?: [number, number, number];
  fractalColor2?: [number, number, number];
  fractalColor3?: [number, number, number];
  useCustomColors?: boolean;
}

// Constants for positioning behind phone model
const PHONE_MODEL_Z = 0;
const SAFETY_BUFFER = 1.5;
const MAX_FORWARD_Z = PHONE_MODEL_Z - SAFETY_BUFFER;

const ShaderBackground: React.FC<ShaderBackgroundProps> = ({
  shader = 'matrix',
  customVertexShader,
  customFragmentShader,
  uniforms: customUniforms = {},
  resolution = 1024,
  intensity = 1.0,
  speed = 1.0,
  interactive = true,
  fractalColor1 = [1.0, 0.2, 0.4],  // Red/Pink
  fractalColor2 = [0.2, 0.8, 1.0],  // Cyan
  fractalColor3 = [1.0, 0.8, 0.0],  // Gold
  useCustomColors = false,
}) => {
  const { mouse, viewport, camera } = useThree();
  const meshRef = useRef<THREE.Mesh>(null);
  const backgroundMeshRef = useRef<THREE.Mesh>(null);
  const [time, setTime] = useState(0);

  // Enhanced vertex shader for all presets
  const vertexShader = customVertexShader || `
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
    matrix: `
      uniform float u_time;
      uniform vec2 u_resolution;
      uniform vec2 u_mouse;
      uniform float u_intensity;
      uniform float u_speed;
      varying vec2 vUv;

      // Hash function for pseudo-random numbers
      float hash(float n) {
        return fract(sin(n) * 43758.5453123);
      }

      // 2D noise function
      float noise(vec2 x) {
        vec2 p = floor(x);
        vec2 f = fract(x);
        f = f * f * (3.0 - 2.0 * f);
        float n = p.x + p.y * 57.0;
        return mix(
          mix(hash(n), hash(n + 1.0), f.x),
          mix(hash(n + 57.0), hash(n + 58.0), f.x),
          f.y
        );
      }

      void main() {
        vec2 uv = vUv;
        vec2 resolution = u_resolution;
        float time = u_time * u_speed;
        
        // Matrix rain effect
        float cols = 40.0;
        float rows = 60.0;
        
        vec2 grid = vec2(cols, rows);
        vec2 gridUv = floor(uv * grid) / grid;
        vec2 cellUv = fract(uv * grid);
        
        // Character selection based on position and time
        float char = hash(gridUv.x + gridUv.y * cols + floor(time * 2.0));
        
        // Rain drop effect
        float dropSpeed = 3.0 + hash(gridUv.x) * 2.0;
        float drop = fract(gridUv.y + time * dropSpeed);
        
        // Character brightness
        float brightness = smoothstep(0.0, 0.1, char) * smoothstep(0.1, 0.0, drop);
        
        // Head of the stream (brightest)
        float head = smoothstep(0.95, 1.0, drop);
        brightness += head * 2.0;
        
        // Tail fade
        float tail = smoothstep(0.0, 0.3, drop);
        brightness *= tail;
        
        // Mouse interaction
        vec2 mouseUv = u_mouse * 0.5 + 0.5;
        float mouseDist = distance(uv, mouseUv);
        float mouseEffect = smoothstep(0.3, 0.0, mouseDist) * 0.5;
        brightness += mouseEffect;
        
        // Color
        vec3 matrixGreen = vec3(0.0, 1.0, 0.4);
        vec3 color = matrixGreen * brightness * u_intensity;
        
        // Add some blue tint for depth
        color += vec3(0.0, 0.2, 0.8) * brightness * 0.3;
        
        gl_FragColor = vec4(color, brightness * 0.9);
      }
    `,

    circuit: `
      uniform float u_time;
      uniform vec2 u_resolution;
      uniform vec2 u_mouse;
      uniform float u_intensity;
      uniform float u_speed;
      varying vec2 vUv;

      float random(vec2 st) {
        return fract(sin(dot(st.xy, vec2(12.9898,78.233))) * 43758.5453123);
      }

      float noise(vec2 st) {
        vec2 i = floor(st);
        vec2 f = fract(st);
        float a = random(i);
        float b = random(i + vec2(1.0, 0.0));
        float c = random(i + vec2(0.0, 1.0));
        float d = random(i + vec2(1.0, 1.0));
        vec2 u = f * f * (3.0 - 2.0 * f);
        return mix(a, b, u.x) + (c - a)* u.y * (1.0 - u.x) + (d - b) * u.x * u.y;
      }

      void main() {
        vec2 uv = vUv;
        float time = u_time * u_speed;
        
        // Circuit board grid
        vec2 grid = uv * 20.0;
        vec2 gridId = floor(grid);
        vec2 gridUv = fract(grid);
        
        // Circuit traces
        float traceH = smoothstep(0.45, 0.5, gridUv.y) * smoothstep(0.55, 0.5, gridUv.y);
        float traceV = smoothstep(0.45, 0.5, gridUv.x) * smoothstep(0.55, 0.5, gridUv.x);
        
        // Connection nodes
        float nodeDist = distance(gridUv, vec2(0.5));
        float node = smoothstep(0.15, 0.1, nodeDist);
        
        // Data flow animation
        float flow = sin(gridId.x + gridId.y + time * 3.0) * 0.5 + 0.5;
        
        // Circuit pattern
        float circuit = max(traceH, traceV) + node;
        circuit *= flow;
        
        // Add complexity with noise
        float complexPattern = noise(uv * 15.0 + time * 0.5) * 0.3;
        circuit += complexPattern;
        
        // Mouse interaction - electrical surge
        vec2 mouseUv = u_mouse * 0.5 + 0.5;
        float mouseDist = distance(uv, mouseUv);
        float surge = smoothstep(0.4, 0.0, mouseDist) * sin(time * 10.0) * 0.5;
        circuit += surge;
        
        // Color scheme
        vec3 cyan = vec3(0.0, 0.8, 1.0);
        vec3 orange = vec3(1.0, 0.6, 0.0);
        vec3 purple = vec3(0.8, 0.0, 1.0);
        
        vec3 color = mix(cyan, orange, flow);
        color = mix(color, purple, surge);
        
        color *= circuit * u_intensity;
        
        gl_FragColor = vec4(color, circuit * 0.8);
      }
    `,

    fluid: `
      uniform float u_time;
      uniform vec2 u_resolution;
      uniform vec2 u_mouse;
      uniform float u_intensity;
      uniform float u_speed;
      varying vec2 vUv;

      vec2 hash2(vec2 p) {
        p = vec2(dot(p,vec2(127.1,311.7)), dot(p,vec2(269.5,183.3)));
        return -1.0 + 2.0 * fract(sin(p) * 43758.5453123);
      }

      float noise(vec2 p) {
        const float K1 = 0.366025404;
        const float K2 = 0.211324865;
        vec2 i = floor(p + (p.x + p.y) * K1);
        vec2 a = p - i + (i.x + i.y) * K2;
        vec2 o = (a.x > a.y) ? vec2(1.0, 0.0) : vec2(0.0, 1.0);
        vec2 b = a - o + K2;
        vec2 c = a - 1.0 + 2.0 * K2;
        vec3 h = max(0.5 - vec3(dot(a,a), dot(b,b), dot(c,c)), 0.0);
        vec3 n = h * h * h * h * vec3(dot(a, hash2(i + 0.0)), dot(b, hash2(i + o)), dot(c, hash2(i + 1.0)));
        return dot(n, vec3(70.0));
      }

      float fbm(vec2 p) {
        float f = 0.0;
        mat2 m = mat2(vec2(1.6, 1.2), vec2(-1.2, 1.6));
        f += 0.5000 * noise(p); p = m * p;
        f += 0.2500 * noise(p); p = m * p;
        f += 0.1250 * noise(p); p = m * p;
        f += 0.0625 * noise(p); p = m * p;
        return f;
      }

      void main() {
        vec2 uv = vUv;
        float time = u_time * u_speed;
        
        // Mouse influence
        vec2 mouseUv = u_mouse * 0.5 + 0.5;
        vec2 mouseForce = (uv - mouseUv) * 0.1;
        
        // Fluid simulation
        vec2 p = uv * 3.0 + mouseForce;
        
        // Create flowing pattern
        float flow1 = fbm(p + time * 0.3);
        float flow2 = fbm(p + vec2(flow1 * 0.4) + time * 0.2);
        float flow3 = fbm(p + vec2(flow2 * 0.3) - time * 0.4);
        
        // Combine flows for complex pattern
        float pattern = flow1 + flow2 * 0.5 + flow3 * 0.3;
        
        // Add turbulence
        vec2 turbulence = vec2(
          fbm(uv * 4.0 + time * 0.1),
          fbm(uv * 4.0 + time * 0.1 + 100.0)
        );
        
        pattern += length(turbulence) * 0.3;
        
        // Color mapping
        vec3 color1 = vec3(0.1, 0.4, 0.8);  // Deep blue
        vec3 color2 = vec3(0.0, 0.8, 0.6);  // Cyan
        vec3 color3 = vec3(0.8, 0.2, 0.8);  // Magenta
        vec3 color4 = vec3(1.0, 0.6, 0.0);  // Orange
        
        vec3 color = mix(color1, color2, smoothstep(-0.5, 0.0, pattern));
        color = mix(color, color3, smoothstep(0.0, 0.5, pattern));
        color = mix(color, color4, smoothstep(0.5, 1.0, pattern));
        
        // Add some glow
        float glow = exp(-pattern * pattern * 2.0) * 0.5;
        color += glow;
        
        color *= u_intensity;
        
        gl_FragColor = vec4(color, 0.9);
      }
    `,

    neural: `
      uniform float u_time;
      uniform vec2 u_resolution;
      uniform vec2 u_mouse;
      uniform float u_intensity;
      uniform float u_speed;
      varying vec2 vUv;

      float random(vec2 st) {
        return fract(sin(dot(st.xy, vec2(12.9898,78.233))) * 43758.5453123);
      }

      void main() {
        vec2 uv = vUv;
        float time = u_time * u_speed;
        
        // Neural network nodes
        float nodes = 0.0;
        vec3 color = vec3(0.0);
        
        // Generate neural nodes
        for(int i = 0; i < 12; i++) {
          float fi = float(i);
          vec2 nodePos = vec2(
            sin(time * 0.5 + fi * 0.5) * 0.3 + 0.5,
            cos(time * 0.3 + fi * 0.7) * 0.3 + 0.5
          );
          
          float dist = distance(uv, nodePos);
          float node = smoothstep(0.1, 0.05, dist);
          
          // Node color based on activity
          float activity = sin(time * 2.0 + fi) * 0.5 + 0.5;
          vec3 nodeColor = mix(
            vec3(0.2, 0.6, 1.0),  // Blue
            vec3(1.0, 0.3, 0.6),  // Pink
            activity
          );
          
          color += node * nodeColor * activity;
          nodes += node;
        }
        
        // Neural connections
        float connections = 0.0;
        
        // Create connection lines between nodes
        for(int i = 0; i < 8; i++) {
          for(int j = i + 1; j < 8; j++) {
            float fi = float(i);
            float fj = float(j);
            
            vec2 node1 = vec2(
              sin(time * 0.5 + fi * 0.5) * 0.3 + 0.5,
              cos(time * 0.3 + fi * 0.7) * 0.3 + 0.5
            );
            
            vec2 node2 = vec2(
              sin(time * 0.5 + fj * 0.5) * 0.3 + 0.5,
              cos(time * 0.3 + fj * 0.7) * 0.3 + 0.5
            );
            
            // Distance from point to line
            vec2 lineDir = normalize(node2 - node1);
            vec2 toPoint = uv - node1;
            float projection = dot(toPoint, lineDir);
            projection = clamp(projection, 0.0, distance(node1, node2));
            vec2 closest = node1 + lineDir * projection;
            
            float lineDist = distance(uv, closest);
            float connection = smoothstep(0.01, 0.005, lineDist);
            
            // Signal traveling along connection
            float signal = smoothstep(0.02, 0.0, abs(projection - mod(time * 2.0, distance(node1, node2))));
            
            connections += connection * (0.3 + signal * 0.7);
          }
        }
        
        // Mouse interaction
        vec2 mouseUv = u_mouse * 0.5 + 0.5;
        float mouseDist = distance(uv, mouseUv);
        float mouseGlow = smoothstep(0.3, 0.0, mouseDist) * 0.5;
        
        // Combine elements
        color += connections * vec3(0.0, 1.0, 0.8) * 0.5;
        color += mouseGlow * vec3(1.0, 1.0, 0.5);
        
        // Add background neural static
        float static_noise = random(uv + time * 0.1) * 0.05;
        color += static_noise * vec3(0.1, 0.2, 0.3);
        
        color *= u_intensity;
        
        gl_FragColor = vec4(color, 0.8);
      }
    `,

    quantum: `
      uniform float u_time;
      uniform vec2 u_resolution;
      uniform vec2 u_mouse;
      uniform float u_intensity;
      uniform float u_speed;
      varying vec2 vUv;

      float random(vec2 st) {
        return fract(sin(dot(st.xy, vec2(12.9898,78.233))) * 43758.5453123);
      }

      vec2 complex_mult(vec2 a, vec2 b) {
        return vec2(a.x * b.x - a.y * b.y, a.x * b.y + a.y * b.x);
      }

      float wave_function(vec2 pos, float time) {
        vec2 z = pos;
        float intensity = 0.0;
        
        // Quantum interference pattern
        for(int i = 0; i < 6; i++) {
          float fi = float(i);
          vec2 source = vec2(
            sin(time * 0.3 + fi) * 0.4,
            cos(time * 0.2 + fi * 1.5) * 0.4
          );
          
          float dist = distance(pos, source);
          float wave = sin(dist * 15.0 - time * 3.0 + fi) * exp(-dist * 2.0);
          intensity += wave;
        }
        
        return intensity;
      }

      void main() {
        vec2 uv = vUv * 2.0 - 1.0;
        float time = u_time * u_speed;
        
        // Quantum field
        float field = wave_function(uv, time);
        
        // Probability density
        float probability = field * field;
        
        // Quantum tunneling effect
        float tunneling = smoothstep(0.8, 1.0, abs(field)) * 0.5;
        
        // Interference patterns
        vec2 interference1 = uv + vec2(sin(time), cos(time * 1.3)) * 0.1;
        vec2 interference2 = uv + vec2(cos(time * 0.7), sin(time * 0.9)) * 0.1;
        
        float pattern1 = wave_function(interference1, time);
        float pattern2 = wave_function(interference2, time);
        
        float interference = (pattern1 + pattern2) * 0.5;
        
        // Mouse interaction - observer effect
        vec2 mouseUv = u_mouse;
        float mouseDist = distance(uv, mouseUv);
        float observation = smoothstep(0.5, 0.0, mouseDist);
        
        // Wave function collapse
        float collapsed = step(0.7, random(uv + time * 0.1)) * observation;
        
        // Color based on quantum states
        vec3 ground_state = vec3(0.1, 0.3, 0.8);     // Blue
        vec3 excited_state = vec3(0.8, 0.1, 0.6);    // Magenta
        vec3 superposition = vec3(0.0, 0.8, 0.4);    // Green
        vec3 entangled = vec3(1.0, 0.6, 0.0);        // Orange
        
        vec3 color = mix(ground_state, excited_state, probability);
        color = mix(color, superposition, tunneling);
        color = mix(color, entangled, collapsed);
        
        // Add quantum foam
        float foam = random(uv * 50.0 + time) * 0.1 * probability;
        color += foam;
        
        // Uncertainty principle visualization
        float uncertainty = sin(length(uv) * 20.0 - time * 5.0) * 0.1;
        color += uncertainty * abs(field);
        
        color *= u_intensity;
        
        gl_FragColor = vec4(color, 0.9);
      }
    `,

    cosmic: `
      uniform float u_time;
      uniform vec2 u_resolution;
      uniform vec2 u_mouse;
      uniform float u_intensity;
      uniform float u_speed;
      varying vec2 vUv;

      float random(vec2 st) {
        return fract(sin(dot(st.xy, vec2(12.9898,78.233))) * 43758.5453123);
      }

      float noise(vec2 p) {
        vec2 i = floor(p);
        vec2 f = fract(p);
        vec2 u = f * f * (3.0 - 2.0 * f);
        return mix(mix(random(i + vec2(0.0,0.0)), 
                      random(i + vec2(1.0,0.0)), u.x),
                  mix(random(i + vec2(0.0,1.0)), 
                      random(i + vec2(1.0,1.0)), u.x), u.y);
      }

      float fbm(vec2 p) {
        float value = 0.0;
        float amplitude = 0.5;
        for(int i = 0; i < 6; i++) {
          value += amplitude * noise(p);
          p *= 2.0;
          amplitude *= 0.5;
        }
        return value;
      }

      vec3 nebula(vec2 uv, float time) {
        vec2 p = uv * 3.0;
        
        float n1 = fbm(p + time * 0.1);
        float n2 = fbm(p + vec2(n1 * 0.5) + time * 0.05);
        float n3 = fbm(p + vec2(n2 * 0.3) - time * 0.08);
        
        float density = (n1 + n2 * 0.5 + n3 * 0.3) / 1.8;
        
        vec3 color1 = vec3(0.8, 0.2, 0.9);  // Purple
        vec3 color2 = vec3(0.2, 0.6, 1.0);  // Blue
        vec3 color3 = vec3(1.0, 0.4, 0.2);  // Orange
        
        vec3 color = mix(color1, color2, smoothstep(0.2, 0.6, density));
        color = mix(color, color3, smoothstep(0.6, 1.0, density));
        
        return color * density;
      }

      void main() {
        vec2 uv = vUv;
        float time = u_time * u_speed;
        
        // Stars
        float stars = 0.0;
        for(int i = 0; i < 100; i++) {
          float fi = float(i);
          vec2 starPos = vec2(
            fract(sin(fi * 12.9898) * 43758.5453),
            fract(sin(fi * 78.233) * 43758.5453)
          );
          
          float dist = distance(uv, starPos);
          float star = smoothstep(0.002, 0.001, dist);
          
          // Twinkling
          float twinkle = sin(time * 3.0 + fi) * 0.3 + 0.7;
          stars += star * twinkle;
        }
        
        // Nebula
        vec3 nebulaColor = nebula(uv, time);
        
        // Galaxy spiral
        vec2 center = vec2(0.5);
        vec2 toCenter = uv - center;
        float angle = atan(toCenter.y, toCenter.x);
        float radius = length(toCenter);
        
        float spiral = sin(angle * 3.0 - radius * 15.0 + time * 0.5) * 0.5 + 0.5;
        spiral *= smoothstep(0.5, 0.0, radius);
        
        vec3 spiralColor = vec3(1.0, 0.8, 0.4) * spiral * 0.3;
        
        // Black hole effect at center
        float blackHole = smoothstep(0.1, 0.05, radius);
        vec3 accretionDisk = vec3(1.0, 0.6, 0.2) * blackHole * sin(time * 2.0 + radius * 20.0);
        
        // Mouse interaction - gravitational lensing
        vec2 mouseUv = u_mouse * 0.5 + 0.5;
        float mouseDist = distance(uv, mouseUv);
        float lensing = smoothstep(0.3, 0.0, mouseDist) * 0.2;
        
        vec2 lensedUv = uv + (mouseUv - uv) * lensing;
        vec3 lensedNebula = nebula(lensedUv, time) * 0.5;
        
        // Combine all elements
        vec3 color = nebulaColor + spiralColor + accretionDisk + lensedNebula;
        color += stars * vec3(1.0, 0.9, 0.8);
        
        // Add cosmic dust
        float dust = noise(uv * 20.0 + time * 0.02) * 0.1;
        color += dust * vec3(0.6, 0.4, 0.8);
        
        color *= u_intensity;
        
        gl_FragColor = vec4(color, 0.9);
      }
    `,

    waves: `
      uniform float u_time;
      uniform vec2 u_resolution;
      uniform vec2 u_mouse;
      uniform float u_intensity;
      uniform float u_speed;
      varying vec2 vUv;

      void main() {
        vec2 uv = vUv;
        float time = u_time * u_speed;
        
        // Wave parameters
        vec3 color = vec3(0.0);
        
        // Multiple wave layers
        for(int i = 0; i < 8; i++) {
          float fi = float(i);
          
          // Wave properties
          float amplitude = 0.1 + fi * 0.05;
          float frequency = 2.0 + fi * 0.5;
          float phase = fi * 0.5;
          float speed = 1.0 + fi * 0.3;
          
          // Create wave
          float wave = sin(uv.x * frequency + time * speed + phase) * amplitude;
          wave += cos(uv.y * frequency * 0.7 + time * speed * 0.8 + phase) * amplitude * 0.7;
          
          // Distance from wave center
          float dist = abs(uv.y - 0.5 - wave);
          float intensity = smoothstep(0.05, 0.0, dist);
          
          // Wave color
          vec3 waveColor = vec3(
            sin(time + fi) * 0.5 + 0.5,
            cos(time * 1.3 + fi) * 0.5 + 0.5,
            sin(time * 0.7 + fi) * 0.5 + 0.5
          );
          
          color += waveColor * intensity;
        }
        
        // Mouse interaction
        vec2 mouseUv = u_mouse * 0.5 + 0.5;
        float mouseDist = distance(uv, mouseUv);
        float mouseWave = sin(mouseDist * 20.0 - time * 5.0) * smoothstep(0.3, 0.0, mouseDist);
        
        color += mouseWave * vec3(1.0, 1.0, 0.5) * 0.5;
        
        color *= u_intensity;
        
        gl_FragColor = vec4(color, 0.8);
      }
    `,

    tunnel: `
      // Shader by Danilo Guanabara
      // http://www.pouet.net/prod.php?which=57245
      // Credits to 'Danilo Guanabara'
      
      uniform float u_time;
      uniform vec2 u_resolution;
      uniform vec2 u_mouse;
      uniform float u_intensity;
      uniform float u_speed;
      varying vec2 vUv;

      void main() {
        vec2 fragCoord = vUv * u_resolution;
        vec2 r = u_resolution;
        float t = u_time * u_speed;
        
        vec3 c;
        float l, z = t;
        
        for(int i = 0; i < 3; i++) {
          vec2 uv, p = fragCoord.xy / r;
          uv = p;
          p -= 0.5;
          p.x *= r.x / r.y;
          z += 0.07;
          l = length(p);
          uv += p / l * (sin(z) + 1.0) * abs(sin(l * 9.0 - z - z));
          c[i] = 0.01 / length(mod(uv, 1.0) - 0.5);
        }
        
        // Mouse interaction - affects tunnel distortion
        vec2 mouseUv = u_mouse * 0.5 + 0.5;
        vec2 mouseEffect = (fragCoord.xy / r - mouseUv) * 0.1;
        c += length(mouseEffect) * 0.3;
        
        // Apply intensity
        c *= u_intensity;
        
        gl_FragColor = vec4(c / l, 0.9);
      }
    `,

    fractal: `
      uniform float u_time;
      uniform vec2 u_resolution;
      uniform vec2 u_mouse;
      uniform float u_intensity;
      uniform float u_speed;
      uniform bool u_useCustomColors;
      uniform vec3 u_fractalColor1;
      uniform vec3 u_fractalColor2;
      uniform vec3 u_fractalColor3;
      varying vec2 vUv;

      // Original colormap functions
      float colormap_red(float x) {
        if (x < 0.0) {
          return 54.0 / 255.0;
        } else if (x < 20049.0 / 82979.0) {
          return (829.79 * x + 54.51) / 255.0;
        } else {
          return 1.0;
        }
      }

      float colormap_green(float x) {
        if (x < 20049.0 / 82979.0) {
          return 0.0;
        } else if (x < 327013.0 / 810990.0) {
          return (8546482679670.0 / 10875673217.0 * x - 2064961390770.0 / 10875673217.0) / 255.0;
        } else if (x <= 1.0) {
          return (103806720.0 / 483977.0 * x + 19607415.0 / 483977.0) / 255.0;
        } else {
          return 1.0;
        }
      }

      float colormap_blue(float x) {
        if (x < 0.0) {
          return 54.0 / 255.0;
        } else if (x < 7249.0 / 82979.0) {
          return (829.79 * x + 54.51) / 255.0;
        } else if (x < 20049.0 / 82979.0) {
          return 127.0 / 255.0;
        } else if (x < 327013.0 / 810990.0) {
          return (792.02249341361393720147485376583 * x - 64.364790735602331034989206222672) / 255.0;
        } else {
          return 1.0;
        }
      }

      vec4 colormap(float x) {
        return vec4(colormap_red(x), colormap_green(x), colormap_blue(x), 1.0);
      }

      // Custom color interpolation
      vec4 customColormap(float x) {
        if (x < 0.33) {
          return vec4(mix(u_fractalColor1, u_fractalColor2, x * 3.0), 1.0);
        } else if (x < 0.66) {
          return vec4(mix(u_fractalColor2, u_fractalColor3, (x - 0.33) * 3.0), 1.0);
        } else {
          return vec4(mix(u_fractalColor3, u_fractalColor1, (x - 0.66) * 3.0), 1.0);
        }
      }

      float rand(vec2 n) { 
        return fract(sin(dot(n, vec2(12.9898, 4.1414))) * 43758.5453);
      }

      float noise(vec2 p){
        vec2 ip = floor(p);
        vec2 u = fract(p);
        u = u*u*(3.0-2.0*u);

        float res = mix(
          mix(rand(ip),rand(ip+vec2(1.0,0.0)),u.x),
          mix(rand(ip+vec2(0.0,1.0)),rand(ip+vec2(1.0,1.0)),u.x),u.y);
        return res*res;
      }

      const mat2 mtx = mat2( 0.80,  0.60, -0.60,  0.80 );

      float fbm( vec2 p )
      {
        float f = 0.0;
        float time = u_time * u_speed;

        f += 0.500000*noise( p + time  ); p = mtx*p*2.02;
        f += 0.031250*noise( p ); p = mtx*p*2.01;
        f += 0.250000*noise( p ); p = mtx*p*2.03;
        f += 0.125000*noise( p ); p = mtx*p*2.01;
        f += 0.062500*noise( p ); p = mtx*p*2.04;
        f += 0.015625*noise( p + sin(time) );

        return f/0.96875;
      }

      float pattern( in vec2 p )
      {
        return fbm( p + fbm( p + fbm( p ) ) );
      }

      void main() {
        vec2 uv = vUv;
        
        // Mouse interaction - warp the pattern
        vec2 mouseUv = u_mouse * 0.5 + 0.5;
        vec2 mouseEffect = (uv - mouseUv) * 0.1;
        uv += mouseEffect * sin(u_time * u_speed * 2.0) * 0.5;
        
        // Scale the pattern
        uv *= 3.0;
        
        float shade = pattern(uv);
        
        // Add mouse intensity influence
        float mouseDist = distance(vUv, mouseUv);
        float mouseInfluence = smoothstep(0.4, 0.0, mouseDist) * 0.3;
        shade += mouseInfluence;
        
        // Choose color scheme
        vec4 finalColor;
        if (u_useCustomColors) {
          finalColor = customColormap(shade);
        } else {
          finalColor = colormap(shade);
        }
        
        // Apply intensity
        finalColor.rgb *= u_intensity;
        finalColor.a = shade * 0.9;
        
        gl_FragColor = finalColor;
      }
    `,

    firewall: `
      // "Firewall" by @XorDev
      // A different perspective on Accretion.
      
      uniform float u_time;
      uniform vec2 u_resolution;
      uniform vec2 u_mouse;
      uniform float u_intensity;
      uniform float u_speed;
      varying vec2 vUv;

      void main() {
        vec2 I = vUv * u_resolution;
        vec4 O = vec4(0.0);
        
        // Raymarch depth
        float z = 0.0;
        // Step distance  
        float d = 0.0;
        // Time for animation
        float t = u_time * u_speed;
        
        // Reduced raymarch steps for performance (10 instead of 20)
        for(float i = 1.0; i <= 10.0; i += 1.0) {
          // Sample point (from ray direction) - exact original coordinate system
          vec3 p = z * normalize(vec3(I + I, 0.0) - u_resolution.xyx) + 0.1;
          
          // Polar coordinates and additional transformations
          p.z += 9.0;
          p = vec3(atan(p.z, p.x + 0.1) * 2.0, 0.6 * p.y + t + t, length(p.xz) - 3.0);
          
          // Simplified turbulence - reduced iterations and unrolled for performance
          vec3 turb = sin(p.yzx + t + 0.5 * i) * 0.5 +
                      sin(p.yzx * 2.0 + t + 0.5 * i) * 0.25 +
                      sin(p.yzx * 3.0 + t + 0.5 * i) * 0.125 +
                      sin(p.yzx * 4.0 + t + 0.5 * i) * 0.0625;
          p += turb;
          
          // Distance to cylinder and waves with refraction
          d = 0.4 * length(vec4(0.3 * cos(p) - 0.3, p.z));
          z += d;
          
          // Coloring and brightness
          O += (1.0 + cos(p.y + i * 0.4 + vec4(6.0, 1.0, 2.0, 0.0))) / d;
        }
        
        // Mouse interaction - affects the tunnel distortion
        vec2 mouseUv = u_mouse * 0.5 + 0.5;
        vec2 mouseEffect = (I / u_resolution - mouseUv) * 0.2;
        O.rgb += length(mouseEffect) * 0.5 * vec3(1.0, 0.5, 0.2);
        
        // Tanh tonemap
        O = tanh(O * O / 6000.0);
        
        // Apply intensity
        O *= u_intensity;
        
        gl_FragColor = vec4(O.rgb, 0.9);
      }
    `,

    mosaic: `
      // "Mosaic" by @XorDev
      // A series of lightweight shaders made for easy learning and high-performance applications
      // MIT license - Credit is appreciated, but not required!
      
      uniform float u_time;
      uniform vec2 u_resolution;
      uniform vec2 u_mouse;
      uniform float u_intensity;
      uniform float u_speed;
      varying vec2 vUv;

      void main() {
        vec2 fragCoord = vUv * u_resolution;
        
        // Resolution for scaling
        vec2 r = u_resolution.xy;
        
        // Centered and scaled to fit vertically [-3, +3]
        vec2 p = 3.0 * (fragCoord * 2.0 - r) / r.y;
        
        // Doubled coordinates
        vec2 v = p + p +
        // Shift over time with random blocks
        (u_time * u_speed + r) * cos(r + ceil(p + sin(p * 5.0))).yx;
        
        // Mouse interaction - affects the mosaic pattern
        vec2 mouseUv = u_mouse * 0.5 + 0.5;
        vec2 mouseEffect = (fragCoord / u_resolution - mouseUv) * 0.3;
        v += mouseEffect * sin(u_time * u_speed * 2.0);
        
        // Pick a color with RGB sine waves
        vec4 colorWaves = cos(0.6 * p.x + 0.4 * sin(v.y) + vec4(0.0, 1.0, 2.0, 3.0)) + 1.0;
        
        // Set brightness using distance to points
        float brightness = 1.0 / length(0.9 + sin(v));
        
        // Tanh tonemapping
        vec4 finalColor = tanh(0.1 * colorWaves * brightness);
        
        // Apply intensity
        finalColor *= u_intensity;
        
        gl_FragColor = vec4(finalColor.rgb, 0.9);
      }
    `
  };

  // Create uniforms
  const uniforms = useMemo(() => ({
    u_time: { value: 0 },
    u_resolution: { value: new THREE.Vector2(resolution, resolution) },
    u_mouse: { value: new THREE.Vector2(0, 0) },
    u_intensity: { value: intensity },
    u_speed: { value: speed },
    u_useCustomColors: { value: useCustomColors },
    u_fractalColor1: { value: new THREE.Vector3(...fractalColor1) },
    u_fractalColor2: { value: new THREE.Vector3(...fractalColor2) },
    u_fractalColor3: { value: new THREE.Vector3(...fractalColor3) },
    ...customUniforms,
  }), [resolution, intensity, speed, fractalColor1, fractalColor2, fractalColor3, useCustomColors, customUniforms]);

  // Create shader material
  const shaderMaterial = useMemo(() => {
    const fragmentShader = customFragmentShader || (shader === 'custom' ? shaderPresets.matrix : shaderPresets[shader]) || shaderPresets.matrix;
    
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
  }, [shader, customFragmentShader, vertexShader, uniforms]);

  // Background shader material (dimmer version)
  const backgroundShaderMaterial = useMemo(() => {
    const fragmentShader = customFragmentShader || (shader === 'custom' ? shaderPresets.matrix : shaderPresets[shader]) || shaderPresets.matrix;
    
    const backgroundUniforms = {
      ...uniforms,
      u_intensity: { value: intensity * 0.3 },
      u_useCustomColors: { value: useCustomColors },
      u_fractalColor1: { value: new THREE.Vector3(...fractalColor1) },
      u_fractalColor2: { value: new THREE.Vector3(...fractalColor2) },
      u_fractalColor3: { value: new THREE.Vector3(...fractalColor3) },
    };
    
    return new THREE.ShaderMaterial({
      vertexShader,
      fragmentShader,
      uniforms: backgroundUniforms,
      transparent: true,
      blending: THREE.AdditiveBlending,
      depthTest: true,
      depthWrite: false,
      side: THREE.DoubleSide,
    });
  }, [shader, customFragmentShader, vertexShader, uniforms, intensity, fractalColor1, fractalColor2, fractalColor3, useCustomColors]);

  // Update uniforms
  useFrame((state) => {
    setTime(state.clock.elapsedTime);
    
    // Update time uniform
    if (shaderMaterial.uniforms.u_time) {
      shaderMaterial.uniforms.u_time.value = time;
    }
    
    if (backgroundShaderMaterial.uniforms.u_time) {
      backgroundShaderMaterial.uniforms.u_time.value = time;
    }
    
    // Update mouse uniform if interactive
    if (interactive) {
      const mouseValue = new THREE.Vector2(mouse.x, mouse.y);
      
      if (shaderMaterial.uniforms.u_mouse) {
        shaderMaterial.uniforms.u_mouse.value = mouseValue;
      }
      
      if (backgroundShaderMaterial.uniforms.u_mouse) {
        backgroundShaderMaterial.uniforms.u_mouse.value = mouseValue;
      }
    }
    
    // Update resolution
    const currentResolution = new THREE.Vector2(viewport.width, viewport.height);
    
    if (shaderMaterial.uniforms.u_resolution) {
      shaderMaterial.uniforms.u_resolution.value = currentResolution;
    }
    
    if (backgroundShaderMaterial.uniforms.u_resolution) {
      backgroundShaderMaterial.uniforms.u_resolution.value = currentResolution;
    }
  });

  return (
    <group position={[0, 0, 0]} renderOrder={-10}>
      {/* Background layer (further back) */}
      <mesh 
        ref={backgroundMeshRef}
        position={[0, 0, -4]}
        renderOrder={-20}
      >
        <planeGeometry args={[30, 30]} />
        <primitive object={backgroundShaderMaterial} />
      </mesh>
      
      {/* Main shader layer */}
      <mesh 
        ref={meshRef}
        position={[0, 0, -2.5]}
        renderOrder={-15}
      >
        <planeGeometry args={[20, 20]} />
        <primitive object={shaderMaterial} />
      </mesh>
    </group>
  );
};

export default ShaderBackground; 