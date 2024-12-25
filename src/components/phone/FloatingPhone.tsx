// eslint-disable-next-line @typescript-eslint/ban-ts-comment
//@ts-nocheck
"use client";

import {
  MutableRefObject,
  useEffect,
  useState,
  useCallback,
  memo,
} from "react";
import { useGLTF, Html } from "@react-three/drei";
import * as THREE from "three";
import { useSpring, animated } from "@react-spring/three";
import { useThree } from "@react-three/fiber";
import { useNavigation } from "@/hooks/useNavigation";
import PhoneScreen from "./PhoneScreen";
import { reactSpringConfig } from "@/constants/animations";
import { ConfigProvider } from "@/contexts/ConfigContext";

interface FloatingPhoneProps {
  mousePosition: { x: number; y: number };
}

const PhoneModel = memo(
  ({
    modelAnimation,
    scene,
    screenMesh,
  }: {
    modelAnimation: unknown;
    scene: THREE.Group;
    screenMesh: MutableRefObject<HTMLElement> | null;
  }) => {
    const { isReady } = useNavigation();

    return (
      <animated.group {...modelAnimation}>
        <animated.primitive object={scene} castShadow receiveShadow />
        {screenMesh && isReady && (
          <Html
            occlude
            transform
            position={[-0.055, 0.03, 0]}
            rotation={[0, -1.55, 0]}
            portal={screenMesh}
            distanceFactor={0.413}
            contentEditable={false}
          >
            <ConfigProvider>
              <PhoneScreen />
            </ConfigProvider>
          </Html>
        )}
      </animated.group>
    );
  }
);

PhoneModel.displayName = "PhoneModel";

const FloatingPhone = memo(({
  mousePosition,
}: FloatingPhoneProps) => {
  const { currentRoute } = useNavigation();
  const isHome = currentRoute == 'home'
  const { scene } = useGLTF("/iphone.glb");
  const [screenMesh, setScreenMesh] = useState<MutableRefObject<HTMLElement> | null>(null);
  const { camera } = useThree();

  // Camera animation spring
  const cameraSpring = useSpring({
    to: {
      cameraPosition: [0, 0, 3.5], // Default camera position
      cameraRotation: !isHome
        ? [-0.2, -0.5, 0] // Rotation when not home
        : [0, 0, 0], // Default camera rotation
    },
    config: reactSpringConfig.default,
  });

  // Model animation spring
  const modelAnimation = useSpring({
    to: {
      position: !isHome ? [-1, 0, 0] : [0, 0, 0],
      rotation: !isHome ? [0, Math.PI / 1.75, 0] : [0, Math.PI / 2, 0],
      scale: [1, 1, 1],
    },
    config: reactSpringConfig.default,
  });

  // Update camera position and rotation based on spring values
  useEffect(() => {
    const [x, y, z] = cameraSpring.cameraPosition.get();
    const [rotX, rotY, rotZ] = cameraSpring.cameraRotation.get();
    
    camera.position.set(x, y, z);
    camera.rotation.set(rotX, rotY, rotZ);
  }, [camera, cameraSpring.cameraPosition, cameraSpring.cameraRotation]);

  // Handle mouse movement effect on camera
  useEffect(() => {
      const targetX = mousePosition.x;
      const targetY = mousePosition.y;

      camera.position.x += (targetX - camera.position.x) * 0.1;
      camera.position.y += (targetY - camera.position.y) * 0.1;
      camera.lookAt(0, 0, 0);
    
  }, [camera, mousePosition]);

  const setupScreenMesh = useCallback(
    (scene: THREE.Group) => {
      scene.traverse((child) => {
        if (child.isMesh && child.name.toLowerCase().includes("screen")) {
          const canvas = document.createElement("canvas");
          canvas.width = 256;
          canvas.height = 256;
          const context = canvas.getContext("2d");

          if (!context) return;

          const gradient = context.createLinearGradient(0, 0, 0, canvas.height);
          gradient.addColorStop(0, "#2c3e50");
          gradient.addColorStop(1, "#000000");

          context.fillStyle = gradient;
          context.fillRect(0, 0, canvas.width, canvas.height);

          const gradientTexture = new THREE.CanvasTexture(canvas);
          gradientTexture.needsUpdate = true;

          const newMaterial = new THREE.MeshPhysicalMaterial({
            map: gradientTexture,
            metalness: 1,
            roughness: 0,
            clearcoat: 1,
            clearcoatRoughness: 0,
            reflectivity: 1,
            envMapIntensity: 1.5,
          });

          (child as THREE.Mesh).material = newMaterial;
          const meshMaterial = (child as THREE.Mesh).material as THREE.Material;
          meshMaterial.needsUpdate = true;
          meshMaterial.side = THREE.DoubleSide;

          (child as THREE.Mesh).geometry.computeVertexNormals();
          (child as THREE.Mesh).geometry.attributes.position.needsUpdate = true;
          setScreenMesh(child as unknown as MutableRefObject<HTMLElement>);
        }
      });
    },
    []
  );

  useEffect(() => {
    if (scene) {
      setupScreenMesh(scene);
    }
  }, [scene, setupScreenMesh]);

  return (
      <PhoneModel
        modelAnimation={modelAnimation}
        scene={scene}
        screenMesh={screenMesh}
      />
  );
});

FloatingPhone.displayName = "FloatingPhone";

// Preload the model
useGLTF.preload("/iphone.glb");

export default FloatingPhone;
