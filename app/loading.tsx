"use client"

import { Canvas } from "@react-three/fiber"
import { OrbitControls, Sphere, MeshDistortMaterial } from "@react-three/drei"
import { motion } from "framer-motion"

export default function Loading() {
  return (
    <div className="flex min-h-screen flex-col items-center justify-center bg-gray-900 text-white">
      <Canvas style={{ width: 250, height: 250 }}>
        <OrbitControls enableZoom={false} autoRotate autoRotateSpeed={2} />
        <ambientLight intensity={0.7} />
        <directionalLight position={[3, 3, 3]} />
        <Sphere args={[1.8, 64, 64]}>
          <MeshDistortMaterial color="red" distort={0.4} speed={2} />
        </Sphere>
      </Canvas>

      <motion.p
        className="mt-6 text-lg font-semibold"
        animate={{ opacity: [0, 1, 0] }}
        transition={{ repeat: Infinity, duration: 1.5, ease: "easeInOut" }}
      >
        Loading...
      </motion.p>
    </div>
  )
}
