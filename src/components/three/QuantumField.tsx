import React, { useRef, useMemo, useEffect, useState } from 'react';
import { useFrame, useThree } from '@react-three/fiber';
import * as THREE from 'three';
import { animated, useSpring } from '@react-spring/three';

interface DevPortfolioBackgroundProps {
  gridSize?: number;
  dataNodeCount?: number;
  particleCount?: number;
  animationSpeed?: number;
  intensity?: number;
}

interface DataNode {
  position: THREE.Vector3;
  frequency: number;
  amplitude: number;
  phase: number;
  color: THREE.Color;
  type: 'cpu' | 'data' | 'network' | 'code' | 'ai' | 'cloud';
  connections: number[];
  energy: number;
}

interface DataParticle {
  position: THREE.Vector3;
  velocity: THREE.Vector3;
  life: number;
  maxLife: number;
  size: number;
  originalSize: number;
  trail: THREE.Vector3[];
  color: THREE.Color;
  type: 'data' | 'signal' | 'energy' | 'quantum';
}

interface HexGrid {
  position: THREE.Vector3;
  scale: number;
  rotation: number;
  color: THREE.Color;
  energy: number;
}

// Constants to ensure all elements stay behind the phone model
const PHONE_MODEL_Z = 0;
const SAFETY_BUFFER = 1.5;
const MAX_FORWARD_Z = PHONE_MODEL_Z - SAFETY_BUFFER;

const DevPortfolioBackground: React.FC<DevPortfolioBackgroundProps> = ({
  gridSize = 96, // Increased for HD quality
  dataNodeCount = 12,
  particleCount = 500, // More particles for richness
  animationSpeed = 1.0,
  intensity = 1.0,
}) => {
  const { mouse, camera } = useThree();
  const groupRef = useRef<THREE.Group>(null);
  const meshRef = useRef<THREE.Mesh>(null);
  const backgroundMeshRef = useRef<THREE.Mesh>(null);
  const particlesRef = useRef<THREE.Points>(null);
  const signalParticlesRef = useRef<THREE.Points>(null);
  const energyParticlesRef = useRef<THREE.Points>(null);
  const hexGridRef = useRef<THREE.InstancedMesh>(null);
  const connectionLinesRef = useRef<THREE.LineSegments>(null);
  const [time, setTime] = useState(0);
  const [mouseInfluence, setMouseInfluence] = useState(new THREE.Vector2(0, 0));

  // Enhanced professional color palette
  const devColors = {
    // Primary tech colors
    primary: new THREE.Color(0x00ff88),     // Matrix green
    secondary: new THREE.Color(0x0088ff),   // Cyber blue
    accent: new THREE.Color(0xff0088),      // Neon pink
    code: new THREE.Color(0xffaa00),        // Amber
    network: new THREE.Color(0x88ffff),     // Cyan
    
    // Advanced colors
    ai: new THREE.Color(0x8800ff),          // Purple
    cloud: new THREE.Color(0x00ffff),       // Bright cyan
    quantum: new THREE.Color(0xff4488),     // Hot pink
    energy: new THREE.Color(0xffff00),      // Electric yellow
    
    // Gradient colors
    deep: new THREE.Color(0x001122),        // Deep blue
    glow: new THREE.Color(0x004488),        // Soft blue
    bright: new THREE.Color(0x00ccff),      // Bright cyan
    
    // Professional accents
    gold: new THREE.Color(0xffd700),        // Gold
    platinum: new THREE.Color(0xe5e4e2),    // Platinum
    chrome: new THREE.Color(0xc0c0c0),      // Chrome
  };

  // Create sophisticated data nodes
  const dataNodes = useMemo(() => {
    const nodes: DataNode[] = [];
    const types: DataNode['type'][] = ['cpu', 'data', 'network', 'code', 'ai', 'cloud'];
    
    for (let i = 0; i < dataNodeCount; i++) {
      const ring = Math.floor(i / 4);
      const ringPosition = i % 4;
      const angle = (ringPosition / 4) * Math.PI * 2 + ring * Math.PI * 0.5;
      const radius = 2 + ring * 0.8;
      const height = (Math.sin(angle) + Math.cos(angle * 1.3)) * 0.5;
      const type = types[Math.floor(Math.random() * types.length)];
      
      let color: THREE.Color;
      switch (type) {
        case 'cpu': color = devColors.primary; break;
        case 'data': color = devColors.secondary; break;
        case 'network': color = devColors.network; break;
        case 'code': color = devColors.code; break;
        case 'ai': color = devColors.ai; break;
        case 'cloud': color = devColors.cloud; break;
        default: color = devColors.accent;
      }
      
      nodes.push({
        position: new THREE.Vector3(
          Math.cos(angle) * radius,
          height,
          Math.sin(angle) * radius
        ),
        frequency: 0.5 + Math.random() * 1.2,
        amplitude: 0.4 + Math.random() * 0.6,
        phase: Math.random() * Math.PI * 2,
        color: color.clone(),
        type,
        connections: [],
        energy: 0.5 + Math.random() * 0.5,
      });
    }
    
    // Create connections between nodes
    nodes.forEach((node, i) => {
      const connectionCount = 2 + Math.floor(Math.random() * 3);
      for (let j = 0; j < connectionCount; j++) {
        const targetIndex = Math.floor(Math.random() * nodes.length);
        if (targetIndex !== i && !node.connections.includes(targetIndex)) {
          node.connections.push(targetIndex);
        }
      }
    });
    
    return nodes;
  }, [dataNodeCount]);

  // Create multi-type particle systems
  const createParticleSystem = (count: number, type: 'data' | 'signal' | 'energy' | 'quantum') => {
    const particles: DataParticle[] = [];
    let colors: THREE.Color[];
    let sizeRange: [number, number];
    
    switch (type) {
      case 'data':
        colors = [devColors.primary, devColors.secondary, devColors.code];
        sizeRange = [0.005, 0.015];
        break;
      case 'signal':
        colors = [devColors.network, devColors.bright, devColors.cloud];
        sizeRange = [0.003, 0.008];
        break;
      case 'energy':
        colors = [devColors.energy, devColors.gold, devColors.quantum];
        sizeRange = [0.01, 0.03];
        break;
      case 'quantum':
        colors = [devColors.quantum, devColors.ai, devColors.accent];
        sizeRange = [0.008, 0.02];
        break;
    }
    
    for (let i = 0; i < count; i++) {
      const radius = 1 + Math.random() * 6;
      const angle = Math.random() * Math.PI * 2;
      const height = (Math.random() - 0.5) * 5;
      const originalSize = sizeRange[0] + Math.random() * (sizeRange[1] - sizeRange[0]);
      
      particles.push({
        position: new THREE.Vector3(
          Math.cos(angle) * radius,
          height,
          Math.min(-2 - Math.random() * 5, MAX_FORWARD_Z)
        ),
        velocity: new THREE.Vector3(
          (Math.random() - 0.5) * 0.015,
          (Math.random() - 0.5) * 0.008,
          (Math.random() - 0.5) * 0.012
        ),
        life: Math.random() * 4000,
        maxLife: 4000 + Math.random() * 6000,
        size: originalSize,
        originalSize: originalSize,
        trail: [],
        color: colors[Math.floor(Math.random() * colors.length)].clone(),
        type,
      });
    }
    return particles;
  };

  const dataParticles = useMemo(() => createParticleSystem(particleCount * 0.4, 'data'), [particleCount]);
  const signalParticles = useMemo(() => createParticleSystem(particleCount * 0.3, 'signal'), [particleCount]);
  const energyParticles = useMemo(() => createParticleSystem(particleCount * 0.2, 'energy'), [particleCount]);
  const quantumParticles = useMemo(() => createParticleSystem(particleCount * 0.1, 'quantum'), [particleCount]);

  // Create hexagonal grid elements
  const hexGridElements = useMemo(() => {
    const elements: HexGrid[] = [];
    const hexCount = 150;
    
    for (let i = 0; i < hexCount; i++) {
      const radius = 2 + Math.random() * 8;
      const angle = Math.random() * Math.PI * 2;
      const height = (Math.random() - 0.5) * 3;
      
      elements.push({
        position: new THREE.Vector3(
          Math.cos(angle) * radius,
          height,
          Math.min(-3 - Math.random() * 4, MAX_FORWARD_Z - 1)
        ),
        scale: 0.05 + Math.random() * 0.15,
        rotation: Math.random() * Math.PI * 2,
        color: Object.values(devColors)[Math.floor(Math.random() * Object.values(devColors).length)].clone(),
        energy: Math.random(),
      });
    }
    
    return elements;
  }, []);

  // Create ultra-high-resolution main surface
  const mainSurfaceGeometry = useMemo(() => {
    const geometry = new THREE.PlaneGeometry(16, 16, gridSize, gridSize);
    const positions = geometry.attributes.position;
    const colors = new Float32Array(positions.count * 3);
    const normals = new Float32Array(positions.count * 3);
    
    geometry.setAttribute('color', new THREE.BufferAttribute(colors, 3));
    geometry.setAttribute('customNormal', new THREE.BufferAttribute(normals, 3));
    return geometry;
  }, [gridSize]);

  // Create background layers
  const backgroundGeometry = useMemo(() => {
    const geometry = new THREE.PlaneGeometry(30, 30, 128, 128); // Ultra-HD background
    const positions = geometry.attributes.position;
    const colors = new Float32Array(positions.count * 3);
    
    geometry.setAttribute('color', new THREE.BufferAttribute(colors, 3));
    return geometry;
  }, []);

  // Create particle geometries for different systems
  const createParticleGeometry = (particles: DataParticle[]) => {
    const geometry = new THREE.BufferGeometry();
    const positions = new Float32Array(particles.length * 3);
    const colors = new Float32Array(particles.length * 3);
    const sizes = new Float32Array(particles.length);
    const alphas = new Float32Array(particles.length);

    particles.forEach((particle, i) => {
      positions[i * 3] = particle.position.x;
      positions[i * 3 + 1] = particle.position.y;
      positions[i * 3 + 2] = particle.position.z;
      
      colors[i * 3] = particle.color.r;
      colors[i * 3 + 1] = particle.color.g;
      colors[i * 3 + 2] = particle.color.b;
      
      sizes[i] = particle.size;
      alphas[i] = 1.0;
    });

    geometry.setAttribute('position', new THREE.BufferAttribute(positions, 3));
    geometry.setAttribute('color', new THREE.BufferAttribute(colors, 3));
    geometry.setAttribute('size', new THREE.BufferAttribute(sizes, 1));
    geometry.setAttribute('alpha', new THREE.BufferAttribute(alphas, 1));
    
    return geometry;
  };

  const particleGeometry = useMemo(() => createParticleGeometry(dataParticles), [dataParticles]);
  const signalGeometry = useMemo(() => createParticleGeometry(signalParticles), [signalParticles]);
  const energyGeometry = useMemo(() => createParticleGeometry(energyParticles), [energyParticles]);

  // Advanced pattern generators
  const generateAdvancedPattern = (x: number, y: number, time: number) => {
    // Hexagonal grid pattern
    const hexSize = 0.5;
    const hexX = Math.floor(x / hexSize);
    const hexY = Math.floor(y / hexSize);
    const isHexCenter = (hexX + hexY) % 2 === 0;
    
    // Circuit trace networks
    const tracePattern = Math.sin(x * 6 + time * 0.8) * Math.cos(y * 4 + time * 0.6) > 0.2;
    
    // Digital mesh overlay
    const meshSize = 0.3;
    const meshX = Math.floor(x / meshSize) % 3;
    const meshY = Math.floor(y / meshSize) % 3;
    const isMeshNode = meshX === 1 && meshY === 1;
    
    // Voronoi-like cells
    const cellNoise = Math.sin(x * 3.7 + time * 0.4) * Math.cos(y * 2.9 + time * 0.5);
    const cellPattern = cellNoise > 0.3;
    
    // Binary data streams
    const dataStream = Math.floor(x * 8 + y * 6 + time * 2) % 8;
    const isBinaryActive = dataStream < 3;
    
    return {
      isHexCenter,
      tracePattern,
      isMeshNode,
      cellPattern,
      isBinaryActive,
      complexity: isHexCenter ? 1.0 : (tracePattern ? 0.7 : 0.3)
    };
  };

  // Enhanced field calculation with mouse interaction
  const calculateInteractiveField = (x: number, y: number, time: number) => {
    let amplitude = 0;
    let colorMix = new THREE.Color(0, 0, 0);
    let totalWeight = 0;
    let dataFlow = { x: 0, y: 0, strength: 0 };
    
    // Mouse influence
    const mouseX = mouse.x * 10;
    const mouseY = mouse.y * 10;
    const mouseDistance = Math.sqrt((x - mouseX) ** 2 + (y - mouseY) ** 2);
    const mouseInfluence = Math.exp(-mouseDistance * 0.3) * 0.5;
    
    dataNodes.forEach((node, nodeIndex) => {
      const distance = Math.sqrt(
        Math.pow(x - node.position.x, 2) + 
        Math.pow(y - node.position.y, 2) + 
        Math.pow(0 - node.position.z, 2)
      );
      
      // Multi-layer wave system
      const primaryWave = node.amplitude * Math.sin(
        node.frequency * distance - time * 2 * animationSpeed + node.phase
      ) * Math.exp(-distance * 0.08);
      
      const secondaryWave = node.amplitude * 0.5 * Math.sin(
        node.frequency * distance * 1.5 - time * 2.5 * animationSpeed + node.phase
      ) * Math.exp(-distance * 0.12);
      
      const tertiaryWave = node.amplitude * 0.3 * Math.sin(
        node.frequency * distance * 2 - time * 3 * animationSpeed + node.phase
      ) * Math.exp(-distance * 0.15);
      
      // Interactive wave modulation
      const interactiveWave = mouseInfluence * Math.sin(
        distance * 0.5 - time * 4 + mouseDistance * 0.1
      ) * 0.3;
      
      // Energy transfer between connected nodes
      let connectionEnergy = 0;
      node.connections.forEach(connectionIndex => {
        if (connectionIndex < dataNodes.length) {
          const connectedNode = dataNodes[connectionIndex];
          const connectionDistance = node.position.distanceTo(connectedNode.position);
          const transferWave = Math.sin(time * 1.5 + connectionDistance * 0.2) * 0.2;
          connectionEnergy += transferWave * connectedNode.energy;
        }
      });
      
      const totalWave = primaryWave + secondaryWave + tertiaryWave + interactiveWave + connectionEnergy;
      
      // Enhanced color system with gradients
      const baseColor = node.color.clone();
      const energyColor = devColors.energy.clone();
      const interactiveColor = devColors.bright.clone();
      
      // Color mixing based on wave properties
      const energyMix = Math.abs(connectionEnergy) * 2;
      const interactiveMix = mouseInfluence * 3;
      
      baseColor.lerp(energyColor, energyMix);
      baseColor.lerp(interactiveColor, interactiveMix);
      
      // Temporal color shifting
      const hsl = baseColor.getHSL({ h: 0, s: 0, l: 0 });
      const newHue = (hsl.h + time * 0.02 + distance * 0.01) % 1;
      baseColor.setHSL(newHue, hsl.s, hsl.l);
      
      const weight = Math.abs(totalWave) + 0.15;
      amplitude += totalWave;
      colorMix.add(baseColor.multiplyScalar(weight));
      totalWeight += weight;
      
      // Calculate flow vectors
      const dx = x - node.position.x;
      const dy = y - node.position.y;
      const dist = Math.sqrt(dx * dx + dy * dy);
      
      if (dist > 0) {
        const flowStrength = Math.abs(totalWave) * Math.exp(-distance * 0.1);
        dataFlow.x += (dx / dist) * flowStrength;
        dataFlow.y += (dy / dist) * flowStrength;
        dataFlow.strength += flowStrength;
      }
    });
    
    // Normalize and enhance
    if (totalWeight > 0) {
      colorMix.multiplyScalar(1 / totalWeight);
    }
    
    // Advanced base glow with interaction
    const baseGlow = new THREE.Color().setHSL(
      (0.6 + mouseInfluence * 0.3 + Math.sin(time * 0.1) * 0.1) % 1,
      0.7 + mouseInfluence * 0.2,
      0.08 + mouseInfluence * 0.05 + Math.sin(time * 0.3) * 0.02
    );
    colorMix.add(baseGlow);
    
    // Enhanced shimmer with mouse interaction
    const shimmerIntensity = 1 + mouseInfluence * 0.5;
    const shimmer = shimmerIntensity + 0.4 * Math.sin(time * 8 + x * 3 + y * 2);
    colorMix.multiplyScalar(shimmer);
    
    return { amplitude, color: colorMix, dataFlow, mouseInfluence };
  };

  // Ultra-sophisticated noise system
  const advancedNoise = (x: number, y: number, time: number) => {
    // Fractal noise layers
    const octave1 = Math.sin(x * 0.1 + time * 0.2) * Math.cos(y * 0.12 + time * 0.25);
    const octave2 = Math.sin(x * 0.35 + time * 0.45) * Math.cos(y * 0.28 + time * 0.38) * 0.5;
    const octave3 = Math.sin(x * 0.8 + time * 0.7) * Math.cos(y * 0.65 + time * 0.55) * 0.25;
    const octave4 = Math.sin(x * 1.6 + time * 0.9) * Math.cos(y * 1.3 + time * 0.8) * 0.125;
    const octave5 = Math.sin(x * 3.2 + time * 1.1) * Math.cos(y * 2.8 + time * 1.0) * 0.0625;
    
    // Complex turbulence
    const turbulence1 = Math.sin(x * 0.06 + y * 0.04 + time * 0.15) * 
                       Math.cos(x * 0.08 - y * 0.07 + time * 0.18) * 0.4;
    const turbulence2 = Math.sin(x * 0.12 + y * 0.09 + time * 0.22) * 
                       Math.cos(x * 0.15 - y * 0.11 + time * 0.26) * 0.2;
    
    // Perlin-like noise
    const perlinBase = Math.sin(x * 0.03 + time * 0.05) * Math.cos(y * 0.025 + time * 0.04);
    const perlinDetail = Math.sin(x * 0.08 + time * 0.12) * Math.cos(y * 0.075 + time * 0.09) * 0.3;
    
    // Voronoi-like patterns
    const voronoi = Math.sin(x * 0.2 + time * 0.1) * Math.cos(y * 0.18 + time * 0.08) * 0.6;
    
    // Mouse interaction noise
    const mouseX = mouse.x * 10;
    const mouseY = mouse.y * 10;
    const mouseDistance = Math.sqrt((x - mouseX) ** 2 + (y - mouseY) ** 2);
    const mouseNoise = Math.sin(mouseDistance * 0.5 - time * 3) * Math.exp(-mouseDistance * 0.2) * 0.3;
    
    return (octave1 + octave2 + octave3 + octave4 + octave5) * 
           (1 + turbulence1 + turbulence2) + 
           perlinBase + perlinDetail + voronoi + mouseNoise;
  };

  // Update mouse influence
  useEffect(() => {
    setMouseInfluence(new THREE.Vector2(mouse.x, mouse.y));
  }, [mouse]);

  // Main animation loop
  useFrame((state) => {
    setTime(state.clock.elapsedTime);
    
    // Update main surface with ultra-high quality
    if (meshRef.current) {
      const geometry = meshRef.current.geometry as THREE.PlaneGeometry;
      const positions = geometry.attributes.position;
      const colors = geometry.attributes.color;
      
      for (let i = 0; i < positions.count; i++) {
        const x = positions.getX(i);
        const y = positions.getY(i);
        
        const field = calculateInteractiveField(x, y, time);
        const pattern = generateAdvancedPattern(x, y, time);
        const noise = advancedNoise(x, y, time);
        
        // Multi-layer height calculation
        const primaryHeight = field.amplitude * intensity * 0.35;
        const patternHeight = pattern.complexity * 0.02;
        const noiseHeight = noise * 0.06;
        const interactiveHeight = field.mouseInfluence * 0.08;
        
        // Breathing effect
        const breathingHeight = Math.sin(time * 0.08) * 0.01;
        
        const totalHeight = primaryHeight + patternHeight + noiseHeight + interactiveHeight + breathingHeight;
        positions.setZ(i, totalHeight);
        
        // Advanced color composition
        let finalColor = field.color.clone();
        
        // Pattern-based color enhancement
        if (pattern.isHexCenter) {
          finalColor.add(devColors.platinum.clone().multiplyScalar(0.15));
        }
        if (pattern.tracePattern) {
          finalColor.add(devColors.primary.clone().multiplyScalar(0.1));
        }
        if (pattern.isMeshNode) {
          finalColor.add(devColors.gold.clone().multiplyScalar(0.12));
        }
        if (pattern.cellPattern) {
          finalColor.add(devColors.bright.clone().multiplyScalar(0.08));
        }
        if (pattern.isBinaryActive) {
          finalColor.add(devColors.code.clone().multiplyScalar(0.06));
        }
        
        // Height-based intensity with sophisticated falloff
        const heightIntensity = Math.max(0.2, 1 + totalHeight * 3);
        const depthIntensity = Math.exp(-Math.abs(totalHeight) * 2) * 0.5 + 0.5;
        
        finalColor.multiplyScalar(heightIntensity * depthIntensity);
        
        // Interactive glow
        const interactiveGlow = field.mouseInfluence * 0.3;
        finalColor.add(devColors.bright.clone().multiplyScalar(interactiveGlow));
        
        // Temporal color shifting
        const timeShift = Math.sin(time * 0.3 + x * 0.1 + y * 0.08) * 0.1;
        finalColor.r += timeShift;
        finalColor.g += timeShift * 0.8;
        finalColor.b += timeShift * 1.2;
        
        // Chromatic aberration effect
        const aberration = Math.sin(time * 2 + x * 0.5 + y * 0.3) * 0.02;
        finalColor.r += aberration;
        finalColor.g -= aberration * 0.5;
        finalColor.b += aberration * 0.5;
        
        colors.setXYZ(i, 
          Math.min(1, Math.max(0, finalColor.r)),
          Math.min(1, Math.max(0, finalColor.g)),
          Math.min(1, Math.max(0, finalColor.b))
        );
      }
      
      positions.needsUpdate = true;
      colors.needsUpdate = true;
    }
    
    // Update ultra-HD background
    if (backgroundMeshRef.current) {
      const geometry = backgroundMeshRef.current.geometry as THREE.PlaneGeometry;
      const positions = geometry.attributes.position;
      const colors = geometry.attributes.color;
      
      for (let i = 0; i < positions.count; i++) {
        const x = positions.getX(i) * 0.15;
        const y = positions.getY(i) * 0.15;
        
        const field = calculateInteractiveField(x, y, time * 0.6);
        const noise = advancedNoise(x, y, time * 0.4);
        
        // Sophisticated background topology
        const primaryHeight = field.amplitude * intensity * 0.06;
        const noiseHeight = noise * 0.03;
        const flowHeight = Math.sin(x * 0.05 + time * 0.2) * Math.cos(y * 0.04 + time * 0.18) * 0.04;
        
        const totalHeight = primaryHeight + noiseHeight + flowHeight;
        positions.setZ(i, totalHeight);
        
        // Professional atmospheric colors
        const atmosphericColor = field.color.clone();
        const depthFactor = Math.abs(totalHeight) * 4;
        const mouseFactor = field.mouseInfluence * 2;
        
        const totalIntensity = Math.max(0.03, 0.12 + depthFactor + mouseFactor);
        
        // Depth-based color grading
        atmosphericColor.r *= totalIntensity * 0.4;
        atmosphericColor.g *= totalIntensity * 0.7;
        atmosphericColor.b *= totalIntensity * 1.0;
        
        // Atmospheric perspective
        const distance = Math.sqrt(x * x + y * y);
        const atmosphericFade = Math.exp(-distance * 0.05);
        atmosphericColor.multiplyScalar(atmosphericFade);
        
        colors.setXYZ(i, 
          Math.max(0, Math.min(1, atmosphericColor.r)),
          Math.max(0, Math.min(1, atmosphericColor.g)),
          Math.max(0, Math.min(1, atmosphericColor.b))
        );
      }
      
      positions.needsUpdate = true;
      colors.needsUpdate = true;
    }
    
    // Update multiple particle systems
    const updateParticleSystem = (particles: DataParticle[], geometryRef: React.RefObject<THREE.Points>) => {
      if (!geometryRef.current) return;
      
      const geometry = geometryRef.current.geometry;
      const positions = geometry.attributes.position;
      const colors = geometry.attributes.color;
      const sizes = geometry.attributes.size;
      
      particles.forEach((particle, i) => {
        const field = calculateInteractiveField(particle.position.x, particle.position.y, time);
        
        // Enhanced particle physics
        const flowForce = new THREE.Vector3(
          field.dataFlow.x * 0.0003,
          (Math.random() - 0.5) * 0.0002,
          field.dataFlow.y * 0.0003
        );
        
        // Interactive forces
        const mouseX = mouse.x * 10;
        const mouseY = mouse.y * 10;
        const mouseDistance = Math.sqrt(
          (particle.position.x - mouseX) ** 2 + 
          (particle.position.y - mouseY) ** 2
        );
        
        const mouseForce = new THREE.Vector3(
          (mouseX - particle.position.x) / mouseDistance * 0.0001,
          0,
          (mouseY - particle.position.y) / mouseDistance * 0.0001
        );
        
        if (mouseDistance < 3) {
          particle.velocity.add(mouseForce);
        }
        
        // Node attraction
        const nearestNode = dataNodes.reduce((closest, node) => {
          const dist = particle.position.distanceTo(node.position);
          return dist < closest.distance ? { node, distance: dist } : closest;
        }, { node: dataNodes[0], distance: Infinity });
        
        if (nearestNode.distance < 3) {
          const attractionStrength = Math.exp(-nearestNode.distance * 0.3);
          const attraction = new THREE.Vector3()
            .subVectors(nearestNode.node.position, particle.position)
            .normalize()
            .multiplyScalar(attractionStrength * 0.0008);
          
          particle.velocity.add(attraction);
        }
        
        particle.velocity.add(flowForce);
        particle.velocity.multiplyScalar(0.985); // Damping
        particle.position.add(particle.velocity);
        
        // Z-constraint
        particle.position.z = Math.min(particle.position.z, MAX_FORWARD_Z);
        
        particle.life += 1;
        
        // Sophisticated respawn
        if (particle.life > particle.maxLife) {
          particle.life = 0;
          const spawnAngle = Math.random() * Math.PI * 2;
          const spawnRadius = 1 + Math.random() * 6;
          const spawnHeight = (Math.random() - 0.5) * 5;
          
          particle.position.set(
            Math.cos(spawnAngle) * spawnRadius,
            spawnHeight,
            Math.min(-2 - Math.random() * 5, MAX_FORWARD_Z)
          );
        }
        
        // Visual updates
        positions.setXYZ(i, particle.position.x, particle.position.y, particle.position.z);
        
        const lifeRatio = 1 - (particle.life / particle.maxLife);
        const fieldIntensity = Math.abs(field.amplitude);
        const mouseIntensity = field.mouseInfluence;
        
        const alpha = lifeRatio * (0.4 + fieldIntensity * 0.4 + mouseIntensity * 0.2);
        
        // Dynamic color with interaction
        const dynamicColor = particle.color.clone();
        if (mouseIntensity > 0.1) {
          dynamicColor.lerp(devColors.bright, mouseIntensity * 0.5);
        }
        
        // Pulsing effect
        const pulse = Math.sin(time * 6 + i * 0.1) * 0.2 + 0.8;
        
        colors.setXYZ(i, 
          dynamicColor.r * alpha * pulse,
          dynamicColor.g * alpha * pulse,
          dynamicColor.b * alpha * pulse
        );
        
        // Dynamic sizing
        const sizeMultiplier = 1 + fieldIntensity * 2 + mouseIntensity * 1.5;
        sizes.setX(i, particle.originalSize * sizeMultiplier);
      });
      
      positions.needsUpdate = true;
      colors.needsUpdate = true;
      sizes.needsUpdate = true;
    };
    
    // Update all particle systems
    updateParticleSystem(dataParticles, particlesRef);
    updateParticleSystem(signalParticles, signalParticlesRef);
    updateParticleSystem(energyParticles, energyParticlesRef);
    
    // Animate data nodes with interaction
    dataNodes.forEach((node, index) => {
      const baseAngle = time * 0.08 * animationSpeed + index * Math.PI * 0.25;
      const baseRadius = 2.5 + Math.sin(time * 0.06 + index) * 0.4;
      
      // Mouse interaction
      const mouseX = mouse.x * 10;
      const mouseY = mouse.y * 10;
      const mouseDistance = Math.sqrt(
        (node.position.x - mouseX) ** 2 + 
        (node.position.y - mouseY) ** 2
      );
      
      const mouseEffect = Math.exp(-mouseDistance * 0.5) * 0.3;
      const interactiveRadius = baseRadius + mouseEffect;
      
      node.position.x = Math.cos(baseAngle) * interactiveRadius;
      node.position.y = Math.sin(time * 0.05 + index * 0.4) * (0.6 + mouseEffect);
      node.position.z = Math.min(
        Math.sin(baseAngle) * interactiveRadius * 0.2, 
        MAX_FORWARD_Z + 0.3
      );
      
      // Enhanced color pulsing
      const energyPulse = Math.sin(time * 1.8 + index * 0.6) * 0.3 + 0.7;
      const interactivePulse = 1 + mouseEffect * 0.5;
      
      node.color.multiplyScalar(energyPulse * interactivePulse);
      node.energy = 0.5 + energyPulse * 0.3 + mouseEffect * 0.2;
    });
  });

  return (
    <group ref={groupRef} position={[0, 0, 0]} renderOrder={-10}>
      {/* Ultra-HD Background Grid */}
      <mesh 
        ref={backgroundMeshRef} 
        rotation={[-Math.PI / 2, 0, 0]} 
        position={[0, 0, -5]}
        renderOrder={-20}
      >
        <primitive object={backgroundGeometry} />
        <meshPhysicalMaterial
          vertexColors
          transparent
          opacity={0.4}
          transmission={0.2}
          clearcoat={0.3}
          clearcoatRoughness={0.3}
          metalness={0.05}
          roughness={0.7}
          emissiveIntensity={0.5}
          side={THREE.DoubleSide}
          blending={THREE.AdditiveBlending}
          depthTest={true}
          depthWrite={false}
        />
      </mesh>
      
      {/* High-Definition Main Surface */}
      <mesh 
        ref={meshRef} 
        rotation={[-Math.PI / 2, 0, 0]} 
        position={[0, 0, -3]}
        renderOrder={-15}
      >
        <primitive object={mainSurfaceGeometry} />
        <meshPhysicalMaterial
          vertexColors
          transparent
          opacity={0.85}
          transmission={0.4}
          clearcoat={1}
          clearcoatRoughness={0.05}
          metalness={0.2}
          roughness={0.15}
          emissiveIntensity={1.8}
          side={THREE.DoubleSide}
          blending={THREE.AdditiveBlending}
          depthTest={true}
          depthWrite={false}
          iridescence={0.6}
          iridescenceIOR={1.5}
          thickness={0.2}
        />
      </mesh>
      
      {/* Data Flow Particles */}
      <points 
        ref={particlesRef} 
        position={[0, 0, -2]}
        renderOrder={-12}
      >
        <primitive object={particleGeometry} />
        <pointsMaterial
          vertexColors
          transparent
          opacity={0.95}
          size={0.025}
          sizeAttenuation
          blending={THREE.AdditiveBlending}
          depthTest={true}
          depthWrite={false}
        />
      </points>
      
      {/* Signal Particles */}
      <points 
        ref={signalParticlesRef} 
        position={[0, 0, -1.8]}
        renderOrder={-11}
      >
        <primitive object={signalGeometry} />
        <pointsMaterial
          vertexColors
          transparent
          opacity={0.8}
          size={0.015}
          sizeAttenuation
          blending={THREE.AdditiveBlending}
          depthTest={true}
          depthWrite={false}
        />
      </points>
      
      {/* Energy Particles */}
      <points 
        ref={energyParticlesRef} 
        position={[0, 0, -1.5]}
        renderOrder={-10}
      >
        <primitive object={energyGeometry} />
        <pointsMaterial
          vertexColors
          transparent
          opacity={0.9}
          size={0.035}
          sizeAttenuation
          blending={THREE.AdditiveBlending}
          depthTest={true}
          depthWrite={false}
        />
      </points>
      
      {/* Enhanced Data Nodes */}
      {dataNodes.map((node, index) => (
        <group key={index}>
          {/* Core Node */}
          <mesh 
            position={[
              node.position.x, 
              node.position.y, 
              Math.min(node.position.z - 0.8, MAX_FORWARD_Z + 0.2)
            ]}
            renderOrder={-13}
          >
            <dodecahedronGeometry args={[0.06, 0]} />
            <meshPhysicalMaterial
              color={node.color}
              transparent
              opacity={0.95}
              emissive={node.color}
              emissiveIntensity={4}
              blending={THREE.AdditiveBlending}
              depthTest={true}
              depthWrite={false}
              clearcoat={0.8}
              metalness={0.3}
            />
          </mesh>
          
          {/* Inner Glow */}
          <mesh 
            position={[
              node.position.x, 
              node.position.y, 
              Math.min(node.position.z - 0.8, MAX_FORWARD_Z + 0.2)
            ]}
            renderOrder={-14}
          >
            <sphereGeometry args={[0.12, 16, 16]} />
            <meshPhysicalMaterial
              color={node.color}
              transparent
              opacity={0.3}
              emissive={node.color}
              emissiveIntensity={2}
              blending={THREE.AdditiveBlending}
              depthTest={true}
              depthWrite={false}
            />
          </mesh>
          
          {/* Outer Halo */}
          <mesh 
            position={[
              node.position.x, 
              node.position.y, 
              Math.min(node.position.z - 0.8, MAX_FORWARD_Z + 0.2)
            ]}
            renderOrder={-15}
          >
            <sphereGeometry args={[0.2, 16, 16]} />
            <meshPhysicalMaterial
              color={node.color}
              transparent
              opacity={0.1}
              emissive={node.color}
              emissiveIntensity={1}
              blending={THREE.AdditiveBlending}
              depthTest={true}
              depthWrite={false}
            />
          </mesh>
        </group>
      ))}
    </group>
  );
};

export default DevPortfolioBackground; 