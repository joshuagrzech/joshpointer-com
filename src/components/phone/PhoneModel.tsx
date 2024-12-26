"use client";

import React, { useEffect, useMemo, useRef } from "react";
import { Html, useGLTF } from "@react-three/drei";
import { Mesh, Box3, Vector3, Group, Object3D } from "three";
import PhoneScreen from "./PhoneScreen";
import { Providers } from "../../../app/providers";

interface NodeStructure {
  node: Object3D;
  children: NodeStructure[];
}

export default function PhoneModel() {
  const groupRef = useRef<Group>(null);
  const { scene } = useGLTF("/iphone.glb");

  // Recursively traverse nodes and build a hierarchy
  const buildNodeHierarchy = (node: Object3D): NodeStructure => {
    const children: NodeStructure[] = [];
    node.children.forEach((child) => {
      children.push(buildNodeHierarchy(child));
    });
    return { node, children };
  };

  const nodeHierarchy = useMemo(() => {
    if (!scene) return null;
    return buildNodeHierarchy(scene);
  }, [scene]);

  // Locate the specific "screen" mesh by traversing the hierarchy
  const findScreenMesh = (hierarchy: NodeStructure): Mesh | null => {
    if (
      hierarchy.node instanceof Mesh &&
      hierarchy.node.material.name === "screen.001"
    ) {
      hierarchy.node.material.color.set("#000000");
      hierarchy.node.material.metalness = 0;
      hierarchy.node.material.reflectivity = 1;
      hierarchy.node.material.clearcoat = 1;
      hierarchy.node.material.clearcoatRoughness = 0;
      hierarchy.node.material.thickness = 0.1;
      hierarchy.node.material.envMapIntensity = 1;

      return hierarchy.node;
    }

    for (const child of hierarchy.children) {
      const found = findScreenMesh(child);
      if (found) return found;
    }
    return null;
  };

  const screenMesh = useMemo(() => {
    if (!nodeHierarchy) return null;
    return findScreenMesh(nodeHierarchy);
  }, [nodeHierarchy]);

  // Normalize the RootNode's position, rotation, and scale
  useEffect(() => {
    if (groupRef.current) {
      const box = new Box3().setFromObject(groupRef.current);
      const center = new Vector3();
      const size = new Vector3();
      box.getCenter(center);
      box.getSize(size);

      // Only center horizontally, preserve vertical position
      groupRef.current.position.x -= center.x;
      groupRef.current.position.z -= center.z;

      // Normalize the scale
      const maxAxis = Math.max(size.x, size.y, size.z);
      const scale = 1 / maxAxis;
      groupRef.current.scale.set(scale, scale, scale);

      // Enable shadows for all meshes
      groupRef.current.traverse((child) => {
        if (child instanceof Mesh) {
          child.castShadow = true;
          child.receiveShadow = true;
        }
      });
    }
  }, [groupRef]);

  if (!screenMesh) {
    console.error("Screen mesh with 'screen.001' material not found");
    return null;
  }

  // Render the hierarchy recursively
  const renderHierarchy = (hierarchy: NodeStructure): React.ReactNode => {
    const { node, children } = hierarchy;

    if (node instanceof Mesh) {
      if (node === screenMesh) {
        // Custom rendering for the screen node
        return (
          <mesh key={node.uuid} castShadow receiveShadow>
            <Html
              transform
              center
              
              distanceFactor={0.415}
              position={node.geometry.boundingBox?.getCenter(new Vector3())}
              rotation={[Math.PI / 2, Math.PI / 2, 0]}
              style={{
                transform: "rotateY(180deg)",
              }}
              contentEditable={false}
            >
              <PhoneScreen />
            </Html>
            <primitive object={node} />
          </mesh>
        );
      }
      // Default rendering for other meshes
      return (
        <mesh
          key={node.uuid}
          geometry={node.geometry}
          material={node.material}
          position={node.position}
          rotation={node.rotation}
          scale={node.scale}
          castShadow
          receiveShadow
        />
      );
    }

    // Render non-mesh nodes and their children
    return (
      <group
        key={node.uuid}
        position={node.position}
        rotation={node.rotation}
        scale={node.scale}
      >
        {children.map((child) => renderHierarchy(child))}
      </group>
    );
  };

  return (
    <group ref={groupRef} rotation={[0, Math.PI / 2, 0]}>
      {nodeHierarchy && renderHierarchy(nodeHierarchy)}
    </group>
  );
}
