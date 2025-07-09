import { useFrame } from "@react-three/fiber";
import {  useState } from "react";
import { Html } from "@react-three/drei";

export default function CameraDebug() {
  const [position, setPosition] = useState({ x: 0, y: 0, z: 0 });
  const [rotation, setRotation] = useState({ x: 0, y: 0, z: 0 });

  useFrame(({camera}) => {
    const updateCameraInfo = () => {
      setPosition({
        x: Number(camera.position.x.toFixed(2)),
        y: Number(camera.position.y.toFixed(2)),
        z: Number(camera.position.z.toFixed(2))
      });
      setRotation({
        x: Number(camera.rotation.x.toFixed(2)),
        y: Number(camera.rotation.y.toFixed(2)),
        z: Number(camera.rotation.z.toFixed(2))
      });
    };

    // Update initially
    updateCameraInfo();

    // Set up frame-based updates instead of events
    const frameLoop = () => {
      updateCameraInfo();
      requestAnimationFrame(frameLoop);
    };
    const frameId = requestAnimationFrame(frameLoop);

    return () => cancelAnimationFrame(frameId);
  });

  if (process.env.NODE_ENV !== 'development') {
    return null;
  }

  return (
    <>
      <Html>
      <div className="fixed top-4 right-4 bg-black/80 text-white p-4 rounded-lg font-mono text-sm z-50">
        <div>Position:</div>
        <div>x: {position.x}</div>
        <div>y: {position.y}</div>
        <div>z: {position.z}</div>
        <div className="mt-2">Rotation:</div>
        <div>x: {rotation.x}</div>
        <div>y: {rotation.y}</div>
        <div>z: {rotation.z}</div>
      </div>
      </Html>
      </>
  );
} 