"use client"

import { Canvas } from "@react-three/fiber"
import { OrbitControls, Sphere, MeshDistortMaterial } from "@react-three/drei"
import { motion } from "framer-motion"

export default function Loading() {
  return (
    <div className="flex min-h-screen flex-col items-center justify-center bg-gray-900 text-white">
      {/* Enlarged 3D Canvas */}
      <Canvas style={{ width: 250, height: 250 }}> {/* Increased canvas size */}
        <OrbitControls enableZoom={false} autoRotate autoRotateSpeed={2} />
        <ambientLight intensity={0.7} />
        <directionalLight position={[3, 3, 3]} />
        
        {/* Bigger Sphere */}
        <Sphere args={[1.8, 64, 64]}> {/* Increased sphere size */}
          <MeshDistortMaterial
            color="red"
            attach="material"
            distort={0.4} // More distortion for a cool effect
            speed={2}
          />
        </Sphere>
      </Canvas>

      {/* Flashing Text */}
      <motion.p
        className="mt-6 text-lg font-semibold"
        animate={{ opacity: [0, 1, 0] }}
        transition={{ repeat: Infinity, duration: 1.5, ease: "easeInOut" }}
      >
        Loading player data...
      </motion.p>
    </div>
  )
}
