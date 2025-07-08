import React, { useRef, useMemo, useEffect, useState } from 'react';
import { useFrame } from '@react-three/fiber';
import * as THREE from 'three';
import { Text } from '@react-three/drei';

interface MatrixRainProps {
  columns?: number;
  rows?: number;
  speed?: number;
  density?: number;
  glowIntensity?: number;
  codeStyle?: 'binary' | 'hex' | 'japanese' | 'mixed';
}

interface RainDrop {
  x: number;
  y: number;
  z: number;
  speed: number;
  char: string;
  opacity: number;
  trail: string[];
  trailPositions: number[];
  color: THREE.Color;
}

const MatrixRain: React.FC<MatrixRainProps> = ({
  columns = 50,
  rows = 30,
  speed = 0.1,
  density = 0.8,
  glowIntensity = 1,
  codeStyle = 'mixed',
}) => {
  const groupRef = useRef<THREE.Group>(null);
  const [time, setTime] = useState(0);
  const [rainDrops, setRainDrops] = useState<RainDrop[]>([]);

  // Character sets for different code styles
  const characterSets = useMemo(() => ({
    binary: ['0', '1'],
    hex: ['0', '1', '2', '3', '4', '5', '6', '7', '8', '9', 'A', 'B', 'C', 'D', 'E', 'F'],
    japanese: ['あ', 'い', 'う', 'え', 'お', 'か', 'き', 'く', 'け', 'こ', 'さ', 'し', 'す', 'せ', 'そ', 
               'た', 'ち', 'つ', 'て', 'と', 'な', 'に', 'ぬ', 'ね', 'の', 'は', 'ひ', 'ふ', 'へ', 'ほ',
               'ま', 'み', 'む', 'め', 'も', 'や', 'ゆ', 'よ', 'ら', 'り', 'る', 'れ', 'ろ', 'わ', 'を', 'ん',
               'ア', 'イ', 'ウ', 'エ', 'オ', 'カ', 'キ', 'ク', 'ケ', 'コ', 'サ', 'シ', 'ス', 'セ', 'ソ',
               'タ', 'チ', 'ツ', 'テ', 'ト', 'ナ', 'ニ', 'ヌ', 'ネ', 'ノ', 'ハ', 'ヒ', 'フ', 'ヘ', 'ホ',
               'マ', 'ミ', 'ム', 'メ', 'モ', 'ヤ', 'ユ', 'ヨ', 'ラ', 'リ', 'ル', 'レ', 'ロ', 'ワ', 'ヲ', 'ン'],
    mixed: ['0', '1', '2', '3', '4', '5', '6', '7', '8', '9', 'A', 'B', 'C', 'D', 'E', 'F', 'G', 'H', 'I', 'J',
            'K', 'L', 'M', 'N', 'O', 'P', 'Q', 'R', 'S', 'T', 'U', 'V', 'W', 'X', 'Y', 'Z', '{', '}', '[', ']',
            '(', ')', '<', '>', '/', '\\', '|', '-', '+', '*', '&', '%', '$', '#', '@', '!', '?', '.', ',', ';', ':'],
  }), []);

  const getRandomCharacter = () => {
    const chars = characterSets[codeStyle];
    return chars[Math.floor(Math.random() * chars.length)];
  };

  // Initialize rain drops
  useEffect(() => {
    const drops: RainDrop[] = [];
    const spacing = 0.5;
    const startX = -(columns * spacing) / 2;
    const startZ = -(rows * spacing) / 2;

    for (let col = 0; col < columns; col++) {
      for (let row = 0; row < rows; row++) {
        if (Math.random() < density) {
          const trailLength = Math.floor(Math.random() * 8) + 3;
          const trail = Array.from({ length: trailLength }, () => getRandomCharacter());
          const trailPositions = Array.from({ length: trailLength }, (_, i) => i * 0.3);
          
          drops.push({
            x: startX + col * spacing,
            y: Math.random() * 10 + 5,
            z: startZ + row * spacing,
            speed: speed * (0.5 + Math.random() * 1.5),
            char: getRandomCharacter(),
            opacity: Math.random() * 0.8 + 0.2,
            trail,
            trailPositions,
            color: new THREE.Color().setHSL(0.3 + Math.random() * 0.3, 1, 0.5 + Math.random() * 0.3),
          });
        }
      }
    }
    setRainDrops(drops);
  }, [columns, rows, density, speed, codeStyle, characterSets]);

  // Animation loop
  useFrame((state) => {
    setTime(state.clock.elapsedTime);
    
    setRainDrops(prevDrops => 
      prevDrops.map(drop => {
        const newDrop = { ...drop };
        
        // Move drop down
        newDrop.y -= newDrop.speed;
        
        // Update trail positions
        newDrop.trailPositions = newDrop.trailPositions.map(pos => pos - newDrop.speed);
        
        // Reset if drop goes below screen
        if (newDrop.y < -5) {
          newDrop.y = Math.random() * 3 + 5;
          newDrop.char = getRandomCharacter();
          newDrop.trail = Array.from({ length: newDrop.trail.length }, () => getRandomCharacter());
          newDrop.trailPositions = Array.from({ length: newDrop.trail.length }, (_, i) => i * 0.3);
          newDrop.color = new THREE.Color().setHSL(0.3 + Math.random() * 0.3, 1, 0.5 + Math.random() * 0.3);
        }
        
        // Randomly change character
        if (Math.random() < 0.02) {
          newDrop.char = getRandomCharacter();
        }
        
        // Update trail characters
        if (Math.random() < 0.05) {
          newDrop.trail = newDrop.trail.map(() => getRandomCharacter());
        }
        
        return newDrop;
      })
    );
  });

  return (
    <group ref={groupRef}>
      {rainDrops.map((drop, index) => (
        <RainColumn
          key={index}
          drop={drop}
          glowIntensity={glowIntensity}
          time={time}
        />
      ))}
      
      {/* Background particles */}
      <BackgroundParticles count={100} time={time} />
    </group>
  );
};

// Individual rain column component
const RainColumn: React.FC<{
  drop: RainDrop;
  glowIntensity: number;
  time: number;
}> = ({ drop, glowIntensity, time }) => {
  const groupRef = useRef<THREE.Group>(null);
  
  return (
    <group ref={groupRef} position={[drop.x, 0, drop.z]}>
      {/* Main character */}
      <Text
        position={[0, drop.y, 0]}
        fontSize={0.2}
        color={drop.color}
        anchorX="center"
        anchorY="middle"
        material-transparent
        material-opacity={drop.opacity}
        material-emissive={drop.color}
        material-emissiveIntensity={glowIntensity}
      >
        {drop.char}
      </Text>
      
      {/* Trail */}
      {drop.trail.map((char, i) => {
        const trailY = drop.y + drop.trailPositions[i];
        const trailOpacity = drop.opacity * (1 - (i / drop.trail.length)) * 0.6;
        const trailColor = drop.color.clone().multiplyScalar(1 - (i / drop.trail.length) * 0.7);
        
        return (
          <Text
            key={i}
            position={[0, trailY, 0]}
            fontSize={0.15}
            color={trailColor}
            anchorX="center"
            anchorY="middle"
            material-transparent
            material-opacity={trailOpacity}
            material-emissive={trailColor}
            material-emissiveIntensity={glowIntensity * 0.5}
          >
            {char}
          </Text>
        );
      })}
      
      {/* Glow effect */}
      <mesh position={[0, drop.y, 0]}>
        <sphereGeometry args={[0.1, 8, 8]} />
        <meshBasicMaterial
          color={drop.color}
          transparent
          opacity={drop.opacity * 0.2}
          side={THREE.BackSide}
        />
      </mesh>
    </group>
  );
};

// Background particle system
const BackgroundParticles: React.FC<{
  count: number;
  time: number;
}> = ({ count, time }) => {
  const particlesRef = useRef<THREE.Points>(null);
  
  const particleGeometry = useMemo(() => {
    const geometry = new THREE.BufferGeometry();
    const positions = new Float32Array(count * 3);
    const colors = new Float32Array(count * 3);
    const sizes = new Float32Array(count);
    
    for (let i = 0; i < count; i++) {
      positions[i * 3] = (Math.random() - 0.5) * 20;
      positions[i * 3 + 1] = (Math.random() - 0.5) * 20;
      positions[i * 3 + 2] = (Math.random() - 0.5) * 20;
      
      const color = new THREE.Color().setHSL(0.3 + Math.random() * 0.3, 1, 0.7);
      colors[i * 3] = color.r;
      colors[i * 3 + 1] = color.g;
      colors[i * 3 + 2] = color.b;
      
      sizes[i] = Math.random() * 0.005 + 0.002;
    }
    
    geometry.setAttribute('position', new THREE.BufferAttribute(positions, 3));
    geometry.setAttribute('color', new THREE.BufferAttribute(colors, 3));
    geometry.setAttribute('size', new THREE.BufferAttribute(sizes, 1));
    
    return geometry;
  }, [count]);
  
  useFrame(() => {
    if (particlesRef.current) {
      const positions = particleGeometry.attributes.position.array as Float32Array;
      
      for (let i = 0; i < count; i++) {
        // Slow drift
        positions[i * 3 + 1] -= 0.01;
        
        // Reset if particle goes too low
        if (positions[i * 3 + 1] < -10) {
          positions[i * 3 + 1] = 10;
        }
        
        // Add some horizontal drift
        positions[i * 3] += Math.sin(time * 0.1 + i) * 0.001;
        positions[i * 3 + 2] += Math.cos(time * 0.1 + i) * 0.001;
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
        opacity={0.3}
        size={0.005}
        sizeAttenuation
        blending={THREE.AdditiveBlending}
      />
    </points>
  );
};

export default MatrixRain; 