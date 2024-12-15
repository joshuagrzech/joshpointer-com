import { useRef, useEffect } from "react";
import { useFrame } from "@react-three/fiber";
import {
  CameraControls,
  Float,
  Html,
  PresentationControls,
  useGLTF,
} from "@react-three/drei";
import { Group, WebGLRenderer } from "three";
import PhoneScreen from "./PhoneScreen";

export default function FloatingPhone() {
  const phoneRef = useRef<Group>(null);
  const screenRef = useRef<HTMLDivElement>(null);

  const { scene, nodes, materials } = useGLTF(
    "/iphone.glb",
    true,
    {
      anisotropy: 16,
    },
    (error) => {
      console.error("An error occurred loading the model:", error);
    }
  );

  useEffect(() => {
    if (scene) {
      scene.position.set(0, 0, 0);
      scene.scale.set(1.2, 1.2, 1.2);

      // Find the screen mesh to get its dimensions and position
      let screenMesh: any;
      scene.traverse((child: any) => {
        if (child.isMesh && child.name.toLowerCase().includes("screen")) {
          screenMesh = child;
        }
      });

      if (screenMesh) {
        // Get the screen dimensions from the mesh
        screenMesh.geometry.computeBoundingBox();
        const box = screenMesh.geometry.boundingBox;
        const width = box.max.x - box.min.x;
        const height = box.max.y - box.min.y;

        // Apply the dimensions to the HTML element
        if (screenRef.current) {
          screenRef.current.style.width = `${width * 1000}px`;
          screenRef.current.style.height = `${height * 1000}px`;
        }
      }

      Object.values(materials).forEach((material) => {
        if (material) {
          material.roughness = 0.5;
          material.metalness = 0.8;
          material.envMapIntensity = 1.5;
        }
      });

      scene.traverse((child: any) => {
        if (child.isMesh) {
          child.castShadow = true;
          child.receiveShadow = true;
          if (child.material) {
            child.material.precision = "highp";
          }
        }
      });
    }
  }, [scene, materials]);

  useFrame((state) => {
    if (!phoneRef.current) return;
    phoneRef.current.rotation.y =
      Math.sin(state.clock.elapsedTime * 0.4) * 0.08;
  });

  if (!scene) {
    return null;
  }

  return (
    <>
      <ambientLight intensity={0.8} />
      <directionalLight
        position={[5, 5, 5]}
        intensity={1.2}
        castShadow
        shadow-mapSize-width={2048}
        shadow-mapSize-height={2048}
      />
      <pointLight position={[-5, 5, -5]} intensity={0.5} />

      <PresentationControls
        enabled={true} // the controls can be disabled by setting this to false
        global={false} // Spin globally or by dragging the model
        cursor={true} // Whether to toggle cursor style on drag
        snap={true} // Snap-back to center (can also be a spring config)
        speed={1} // Speed factor
        zoom={1} // Zoom factor when half the polar-max is reached
        rotation={[0, 0, 0]} // Default rotation
        polar={[0, Math.PI / 2]} // Vertical limits
        azimuth={[-Infinity, Infinity]} // Horizontal limits
        config={{ mass: 1, tension: 170, friction: 10 }} // Spring config
      >
        <Float speed={0.5} rotationIntensity={1} floatIntensity={1}>
          <group ref={phoneRef} position={[0, 0, 2]}>
            <primitive
              object={scene}
              position={[0, 0, 0.1]}
              rotation={[0, 1.5, 0]}
            />
            <Html
              transform
              distanceFactor={0.8}
              position={[-0.01, 0.03, 0.056]} // Fine-tuned position to align with screen
              rotation={[0, -0.07, 0]} // Match phone's rotation
              occlude
              zIndexRange={[16777271, 16777272]}
              style={{
                width: "100%",
                height: "100%",
                display: "flex",
                alignItems: "center",
                justifyContent: "center",
              }}
            >
              <div
                ref={screenRef}
                style={{
                  transform: "scale(1.49)", // Adjust if needed
                  transformOrigin: "center center",
                  backgroundColor: "transparent",
                }}
              >
                <PhoneScreen />
              </div>
            </Html>
            <CameraControls dollyToCursor infinityDolly verticalDragToForward />
          </group>
        </Float>
      </PresentationControls>
    </>
  );
}

useGLTF.preload("/iphone.glb", true, true);
