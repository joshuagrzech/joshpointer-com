import React, { useRef, useMemo, useEffect, useState } from 'react';
import { useFrame } from '@react-three/fiber';
import * as THREE from 'three';
import { animated, useSpring } from '@react-spring/three';

interface NeuralNetworkProps {
  layers?: number[];
  spacing?: number;
  pulseSpeed?: number;
  nodeSize?: number;
  connectionOpacity?: number;
}

interface Node {
  id: string;
  position: THREE.Vector3;
  activation: number;
  layer: number;
  index: number;
}

interface Connection {
  from: Node;
  to: Node;
  weight: number;
  active: boolean;
  pulseTime: number;
}

const NeuralNetwork: React.FC<NeuralNetworkProps> = ({
  layers = [4, 6, 4, 2],
  spacing = 1.5,
  pulseSpeed = 0.02,
  nodeSize = 0.08,
  connectionOpacity = 0.6,
}) => {
  const groupRef = useRef<THREE.Group>(null);
  const [time, setTime] = useState(0);

  // Generate nodes for each layer
  const nodes = useMemo(() => {
    const nodeArray: Node[] = [];
    const totalWidth = (layers.length - 1) * spacing;
    
    layers.forEach((layerSize, layerIndex) => {
      const layerHeight = (layerSize - 1) * spacing * 0.8;
      const startY = layerHeight / 2;
      
      for (let i = 0; i < layerSize; i++) {
        const x = -totalWidth / 2 + layerIndex * spacing;
        const y = startY - i * spacing * 0.8;
        const z = (Math.random() - 0.5) * 0.5; // Add some depth variation
        
        nodeArray.push({
          id: `${layerIndex}-${i}`,
          position: new THREE.Vector3(x, y, z),
          activation: Math.random(),
          layer: layerIndex,
          index: i,
        });
      }
    });
    
    return nodeArray;
  }, [layers, spacing]);

  // Generate connections between adjacent layers
  const connections = useMemo(() => {
    const connectionArray: Connection[] = [];
    
    for (let layer = 0; layer < layers.length - 1; layer++) {
      const currentLayerNodes = nodes.filter(n => n.layer === layer);
      const nextLayerNodes = nodes.filter(n => n.layer === layer + 1);
      
      currentLayerNodes.forEach(fromNode => {
        nextLayerNodes.forEach(toNode => {
          if (Math.random() > 0.2) { // 80% connection probability
            connectionArray.push({
              from: fromNode,
              to: toNode,
              weight: Math.random() * 2 - 1, // Random weight between -1 and 1
              active: false,
              pulseTime: Math.random() * Math.PI * 2,
            });
          }
        });
      });
    }
    
    return connectionArray;
  }, [nodes, layers]);

  // Animate neural activity
  useFrame((state) => {
    setTime(state.clock.elapsedTime);
    
    // Update node activations with wave-like patterns
    nodes.forEach((node, index) => {
      const wave1 = Math.sin(time * 0.5 + node.position.x * 0.5) * 0.5 + 0.5;
      const wave2 = Math.sin(time * 0.3 + node.position.y * 0.3) * 0.3 + 0.7;
      const noise = Math.sin(time * 2 + index * 0.1) * 0.2 + 0.8;
      node.activation = wave1 * wave2 * noise;
    });
    
    // Update connection activity
    connections.forEach(connection => {
      const fromActivation = connection.from.activation;
      const threshold = 0.7;
      
      if (fromActivation > threshold && !connection.active) {
        connection.active = true;
        connection.pulseTime = time;
      } else if (connection.active && time - connection.pulseTime > 1) {
        connection.active = false;
      }
    });
  });

  return (
    <group ref={groupRef}>
      {/* Render nodes */}
      {nodes.map((node) => (
        <NeuralNode
          key={node.id}
          position={node.position}
          activation={node.activation}
          size={nodeSize}
          time={time}
        />
      ))}
      
      {/* Render connections */}
      {connections.map((connection, index) => (
        <NeuralConnection
          key={index}
          from={connection.from.position}
          to={connection.to.position}
          weight={connection.weight}
          active={connection.active}
          pulseTime={connection.pulseTime}
          opacity={connectionOpacity}
          time={time}
        />
      ))}
    </group>
  );
};

// Neural Node Component
const NeuralNode: React.FC<{
  position: THREE.Vector3;
  activation: number;
  size: number;
  time: number;
}> = ({ position, activation, size, time }) => {
  const meshRef = useRef<THREE.Mesh>(null);
  
  const [{ scale, color }] = useSpring(() => ({
    scale: 1 + activation * 0.5,
    color: activation,
    config: { tension: 300, friction: 30 },
  }));

  const nodeColor = useMemo(() => {
    return new THREE.Color().setHSL(0.6 - activation * 0.3, 1, 0.5 + activation * 0.3);
  }, [activation]);

  return (
    <animated.mesh
      ref={meshRef}
      position={position.toArray()}
      scale={scale.to(s => [s, s, s])}
    >
      <sphereGeometry args={[size, 16, 16]} />
      <meshPhysicalMaterial
        color={nodeColor}
        emissive={nodeColor}
        emissiveIntensity={activation * 2}
        transparent
        opacity={0.8}
        transmission={0.3}
        clearcoat={1}
        clearcoatRoughness={0.1}
      />
      
      {/* Glow effect */}
      <mesh scale={[1.5, 1.5, 1.5]}>
        <sphereGeometry args={[size, 8, 8]} />
        <meshBasicMaterial
          color={nodeColor}
          transparent
          opacity={activation * 0.3}
          side={THREE.BackSide}
        />
      </mesh>
    </animated.mesh>
  );
};

// Neural Connection Component
const NeuralConnection: React.FC<{
  from: THREE.Vector3;
  to: THREE.Vector3;
  weight: number;
  active: boolean;
  pulseTime: number;
  opacity: number;
  time: number;
}> = ({ from, to, weight, active, pulseTime, opacity, time }) => {
  const lineRef = useRef<THREE.BufferGeometry>(null);
  const materialRef = useRef<THREE.LineBasicMaterial>(null);
  
  const points = useMemo(() => {
    const curve = new THREE.CatmullRomCurve3([
      from,
      from.clone().lerp(to, 0.3).add(new THREE.Vector3(0, 0, Math.random() * 0.2 - 0.1)),
      from.clone().lerp(to, 0.7).add(new THREE.Vector3(0, 0, Math.random() * 0.2 - 0.1)),
      to,
    ]);
    return curve.getPoints(50);
  }, [from, to]);

  const connectionColor = useMemo(() => {
    const hue = weight > 0 ? 0.3 : 0.1; // Green for positive, red for negative
    return new THREE.Color().setHSL(hue, 1, 0.5);
  }, [weight]);

  useEffect(() => {
    if (lineRef.current) {
      lineRef.current.setFromPoints(points);
    }
  }, [points]);

  const pulseIntensity = active ? Math.sin((time - pulseTime) * 8) * 0.5 + 0.5 : 0;

  return (
    <line>
      <bufferGeometry ref={lineRef} />
      <lineBasicMaterial
        ref={materialRef}
        color={connectionColor}
        transparent
        opacity={opacity * (0.3 + pulseIntensity * 0.7)}
        linewidth={Math.abs(weight) * 2 + 1}
      />
    </line>
  );
};

export default NeuralNetwork; 