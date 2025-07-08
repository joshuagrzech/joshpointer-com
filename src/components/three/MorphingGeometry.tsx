import React, { useRef, useMemo, useEffect, useState } from 'react';
import { useFrame } from '@react-three/fiber';
import * as THREE from 'three';
import { animated, useSpring } from '@react-spring/three';

interface MorphingGeometryProps {
  shapeCount?: number;
  morphSpeed?: number;
  complexity?: number;
  size?: number;
  glowIntensity?: number;
}

interface GeometryShape {
  vertices: Float32Array;
  colors: Float32Array;
  indices: Uint16Array;
  name: string;
}

const MorphingGeometry: React.FC<MorphingGeometryProps> = ({
  shapeCount = 3,
  morphSpeed = 0.01,
  complexity = 64,
  size = 2,
  glowIntensity = 1,
}) => {
  const meshRef = useRef<THREE.Mesh>(null);
  const groupRef = useRef<THREE.Group>(null);
  const [currentShapeIndex, setCurrentShapeIndex] = useState(0);
  const [morphProgress, setMorphProgress] = useState(0);
  const [time, setTime] = useState(0);

  // Create different geometric shapes
  const shapes = useMemo(() => {
    const shapeArray: GeometryShape[] = [];
    
    // Icosahedron
    const icosahedron = new THREE.IcosahedronGeometry(size, 2);
    shapeArray.push({
      vertices: icosahedron.attributes.position.array as Float32Array,
      colors: new Float32Array(icosahedron.attributes.position.count * 3),
      indices: icosahedron.index?.array as Uint16Array || new Uint16Array(0),
      name: 'Icosahedron',
    });

    // Torus
    const torus = new THREE.TorusGeometry(size * 0.8, size * 0.3, 16, 32);
    shapeArray.push({
      vertices: torus.attributes.position.array as Float32Array,
      colors: new Float32Array(torus.attributes.position.count * 3),
      indices: torus.index?.array as Uint16Array || new Uint16Array(0),
      name: 'Torus',
    });

    // Dodecahedron
    const dodecahedron = new THREE.DodecahedronGeometry(size, 0);
    shapeArray.push({
      vertices: dodecahedron.attributes.position.array as Float32Array,
      colors: new Float32Array(dodecahedron.attributes.position.count * 3),
      indices: dodecahedron.index?.array as Uint16Array || new Uint16Array(0),
      name: 'Dodecahedron',
    });

    // Knot
    const knot = new THREE.TorusKnotGeometry(size * 0.6, size * 0.2, 64, 16);
    shapeArray.push({
      vertices: knot.attributes.position.array as Float32Array,
      colors: new Float32Array(knot.attributes.position.count * 3),
      indices: knot.index?.array as Uint16Array || new Uint16Array(0),
      name: 'Knot',
    });

    // Octahedron
    const octahedron = new THREE.OctahedronGeometry(size, 2);
    shapeArray.push({
      vertices: octahedron.attributes.position.array as Float32Array,
      colors: new Float32Array(octahedron.attributes.position.count * 3),
      indices: octahedron.index?.array as Uint16Array || new Uint16Array(0),
      name: 'Octahedron',
    });

    // Initialize colors for each shape
    shapeArray.forEach((shape, shapeIndex) => {
      for (let i = 0; i < shape.colors.length; i += 3) {
        const color = new THREE.Color().setHSL(
          (shapeIndex / shapeArray.length) + (i / shape.colors.length) * 0.1,
          1,
          0.6
        );
        shape.colors[i] = color.r;
        shape.colors[i + 1] = color.g;
        shape.colors[i + 2] = color.b;
      }
    });

    return shapeArray.slice(0, shapeCount);
  }, [shapeCount, size]);

  // Create morphing geometry
  const morphGeometry = useMemo(() => {
    if (shapes.length === 0) return null;
    
    const baseShape = shapes[0];
    const geometry = new THREE.BufferGeometry();
    
    // Use the largest vertex count for consistent morphing
    const maxVertices = Math.max(...shapes.map(s => s.vertices.length));
    const vertexCount = maxVertices / 3;
    
    const positions = new Float32Array(maxVertices);
    const colors = new Float32Array(maxVertices);
    const normals = new Float32Array(maxVertices);
    
    // Initialize with first shape
    positions.set(baseShape.vertices);
    colors.set(baseShape.colors);
    
    geometry.setAttribute('position', new THREE.BufferAttribute(positions, 3));
    geometry.setAttribute('color', new THREE.BufferAttribute(colors, 3));
    geometry.setAttribute('normal', new THREE.BufferAttribute(normals, 3));
    
    if (baseShape.indices.length > 0) {
      geometry.setIndex(new THREE.BufferAttribute(baseShape.indices, 1));
    }
    
    geometry.computeVertexNormals();
    
    return geometry;
  }, [shapes]);

  // Morph between shapes
  const morphToNextShape = () => {
    if (shapes.length <= 1) return;
    
    const currentShape = shapes[currentShapeIndex];
    const nextShapeIndex = (currentShapeIndex + 1) % shapes.length;
    const nextShape = shapes[nextShapeIndex];
    
    if (!morphGeometry) return;
    
    const positions = morphGeometry.attributes.position.array as Float32Array;
    const colors = morphGeometry.attributes.color.array as Float32Array;
    
    // Interpolate vertices
    const minLength = Math.min(currentShape.vertices.length, nextShape.vertices.length);
    for (let i = 0; i < minLength; i++) {
      const current = currentShape.vertices[i];
      const next = nextShape.vertices[i];
      positions[i] = current + (next - current) * morphProgress;
    }
    
    // Interpolate colors
    for (let i = 0; i < minLength; i++) {
      const current = currentShape.colors[i];
      const next = nextShape.colors[i];
      colors[i] = current + (next - current) * morphProgress;
    }
    
    morphGeometry.attributes.position.needsUpdate = true;
    morphGeometry.attributes.color.needsUpdate = true;
    morphGeometry.computeVertexNormals();
  };

  // Animation loop
  useFrame((state) => {
    setTime(state.clock.elapsedTime);
    
    // Update morph progress
    setMorphProgress(prev => {
      const newProgress = prev + morphSpeed;
      if (newProgress >= 1) {
        setCurrentShapeIndex(prev => (prev + 1) % shapes.length);
        return 0;
      }
      return newProgress;
    });
    
    // Apply morphing
    morphToNextShape();
    
    // Rotate the entire group
    if (groupRef.current) {
      groupRef.current.rotation.x = time * 0.1;
      groupRef.current.rotation.y = time * 0.15;
      groupRef.current.rotation.z = time * 0.05;
    }
    
    // Add vertex noise for organic feel
    if (meshRef.current && morphGeometry) {
      const positions = morphGeometry.attributes.position.array as Float32Array;
      const originalPositions = shapes[currentShapeIndex]?.vertices;
      
      if (originalPositions) {
        for (let i = 0; i < positions.length; i += 3) {
          const noise = Math.sin(time * 2 + i * 0.01) * 0.02;
          positions[i] += noise;
          positions[i + 1] += noise;
          positions[i + 2] += noise;
        }
        
        morphGeometry.attributes.position.needsUpdate = true;
      }
    }
  });

  if (!morphGeometry) return null;

  return (
    <group ref={groupRef}>
      <mesh ref={meshRef}>
        <primitive object={morphGeometry} />
        <meshPhysicalMaterial
          vertexColors
          transparent
          opacity={0.8}
          transmission={0.2}
          clearcoat={1}
          clearcoatRoughness={0.1}
          metalness={0.3}
          roughness={0.2}
          emissiveIntensity={glowIntensity}
          side={THREE.DoubleSide}
        />
      </mesh>
      
      {/* Wireframe overlay */}
      <mesh>
        <primitive object={morphGeometry} />
        <meshBasicMaterial
          color="#00ffff"
          transparent
          opacity={0.3}
          wireframe
        />
      </mesh>
      
      {/* Particle system around the geometry */}
      <ParticleSystem
        count={100}
        size={size}
        time={time}
        morphProgress={morphProgress}
      />
    </group>
  );
};

// Particle system component
const ParticleSystem: React.FC<{
  count: number;
  size: number;
  time: number;
  morphProgress: number;
}> = ({ count, size, time, morphProgress }) => {
  const particlesRef = useRef<THREE.Points>(null);
  
  const particleGeometry = useMemo(() => {
    const geometry = new THREE.BufferGeometry();
    const positions = new Float32Array(count * 3);
    const colors = new Float32Array(count * 3);
    const sizes = new Float32Array(count);
    
    for (let i = 0; i < count; i++) {
      const radius = size * (1 + Math.random() * 0.5);
      const phi = Math.random() * Math.PI * 2;
      const theta = Math.random() * Math.PI;
      
      positions[i * 3] = radius * Math.sin(theta) * Math.cos(phi);
      positions[i * 3 + 1] = radius * Math.sin(theta) * Math.sin(phi);
      positions[i * 3 + 2] = radius * Math.cos(theta);
      
      const color = new THREE.Color().setHSL(Math.random(), 1, 0.7);
      colors[i * 3] = color.r;
      colors[i * 3 + 1] = color.g;
      colors[i * 3 + 2] = color.b;
      
      sizes[i] = Math.random() * 0.02 + 0.01;
    }
    
    geometry.setAttribute('position', new THREE.BufferAttribute(positions, 3));
    geometry.setAttribute('color', new THREE.BufferAttribute(colors, 3));
    geometry.setAttribute('size', new THREE.BufferAttribute(sizes, 1));
    
    return geometry;
  }, [count, size]);
  
  useFrame(() => {
    if (particlesRef.current) {
      const positions = particleGeometry.attributes.position.array as Float32Array;
      
      for (let i = 0; i < count; i++) {
        const x = positions[i * 3];
        const y = positions[i * 3 + 1];
        const z = positions[i * 3 + 2];
        
        // Orbital motion
        const angle = time * 0.1 + i * 0.1;
        const radius = Math.sqrt(x * x + y * y + z * z);
        
        positions[i * 3] = radius * Math.sin(angle) * Math.cos(i);
        positions[i * 3 + 1] = radius * Math.sin(angle) * Math.sin(i);
        positions[i * 3 + 2] = radius * Math.cos(angle);
      }
      
      particleGeometry.attributes.position.needsUpdate = true;
    }
  });
  
  return (
    <points ref={particlesRef}>
      <primitive object={particleGeometry} />
      <pointsMaterial
        vertexColors
        transparent
        opacity={0.6}
        size={0.02}
        sizeAttenuation
        blending={THREE.AdditiveBlending}
      />
    </points>
  );
};

export default MorphingGeometry; 