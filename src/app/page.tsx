'use client'

import { Canvas } from '@react-three/fiber'
import { Suspense } from 'react'
import FloatingPhone from '@/components/FloatingPhone'
import ContentView from '@/components/ContentView'

export default function Home() {
  return (
    <main className="relative min-h-screen">
      <div className="fixed left-0 w-1/3 h-screen">
        <Canvas
          camera={{
            position: [0, 0, 5],
            fov: 45,
            near: 0.1,
            far: 1000
          }}
        >
          <Suspense fallback={null}>
            <FloatingPhone />
          </Suspense>
        </Canvas>
      </div>
      <ContentView />
    </main>
  )
}
