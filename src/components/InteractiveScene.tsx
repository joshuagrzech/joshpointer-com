import { Canvas } from '@react-three/fiber';
import { OrbitControls, Float, Text } from '@react-three/drei';
import { motion } from 'framer-motion-3d';
import { useTheme } from 'next-themes';

function FloatingText({ children, position }: { children: string, position: [number, number, number] }) {
  const { theme } = useTheme();
  
  return (
    <Float speed={4} rotationIntensity={0.5} floatIntensity={2}>
      <Text
        position={position}
        fontSize={0.5}
        color={theme === 'dark' ? '#ffffff' : '#000000'}
        anchorX="center"
        anchorY="middle"
      >
        {children}
      </Text>
    </Float>
  );
}

export function InteractiveScene() {
  const { theme } = useTheme();

  return (
    <div className="h-[400px] w-full">
      <Canvas camera={{ position: [0, 0, 5] }}>
        <ambientLight intensity={0.5} />
        <pointLight position={[10, 10, 10]} />
        
        <motion.group
          initial={{ scale: 0 }}
          animate={{ scale: 1 }}
          transition={{ duration: 1, type: "spring" }}
        >
          <FloatingText position={[-2, 1, 0]}>React Native</FloatingText>
          <FloatingText position={[2, -1, 0]}>iOS</FloatingText>
          <FloatingText position={[0, 0, 1]}>Mobile Dev</FloatingText>
        </motion.group>

        <OrbitControls 
          enableZoom={false}
          minPolarAngle={Math.PI / 3}
          maxPolarAngle={Math.PI / 1.5}
        />
      </Canvas>
    </div>
  );
}
