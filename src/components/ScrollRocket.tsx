/* eslint-disable react/no-unknown-property */
import { useRef } from "react";
import { motion, useScroll, useTransform } from "framer-motion";
import { Canvas, useFrame } from "@react-three/fiber";
import { Cylinder, Cone, Sphere } from "@react-three/drei";
import * as THREE from "three";

const RocketModel = () => {
  const groupRef = useRef<THREE.Group>(null);
  const flameRef = useRef<THREE.Mesh>(null);

  useFrame((state) => {
    if (groupRef.current) {
      // Gentle floating and spinning
      groupRef.current.position.y = Math.sin(state.clock.elapsedTime * 2) * 0.2;
      groupRef.current.rotation.y = state.clock.elapsedTime * 1;
      groupRef.current.rotation.z = Math.sin(state.clock.elapsedTime) * 0.1;
    }
    
    if (flameRef.current) {
      // Flicker the flame
      flameRef.current.scale.y = 1 + Math.random() * 0.5;
      flameRef.current.scale.x = 1 + Math.random() * 0.2;
      flameRef.current.scale.z = 1 + Math.random() * 0.2;
    }
  });

  return (
    <group ref={groupRef} rotation={[Math.PI / 8, 0, 0]} scale={0.45}>
      {/* Nose cone */}
      <Cone args={[1, 2, 16]} position={[0, 2.5, 0]}>
        <meshStandardMaterial color="#38bdf8" metalness={0.6} roughness={0.2} />
      </Cone>
      
      {/* Body */}
      <Cylinder args={[1, 1, 3, 32]} position={[0, 0, 0]}>
        <meshStandardMaterial color="#0f172a" metalness={0.7} roughness={0.3} />
      </Cylinder>
      
      {/* Window Rim */}
      <Cylinder args={[0.6, 0.6, 0.2, 32]} position={[0, 0.5, 0.95]} rotation={[Math.PI / 2, 0, 0]}>
        <meshStandardMaterial color="#38bdf8" metalness={0.8} roughness={0.1} />
      </Cylinder>
      
      {/* Window Glass */}
      <Sphere args={[0.5, 16, 16]} position={[0, 0.5, 0.95]}>
        <meshStandardMaterial color="#ffffff" emissive="#0ea5e9" emissiveIntensity={0.6} />
      </Sphere>

      {/* Fins */}
      {/* Right Fin */}
      <mesh position={[1.2, -1, 0]} rotation={[0, 0, -Math.PI / 6]}>
        <boxGeometry args={[1, 1.5, 0.2]} />
        <meshStandardMaterial color="#0284c7" metalness={0.5} roughness={0.3} />
      </mesh>
      {/* Left Fin */}
      <mesh position={[-1.2, -1, 0]} rotation={[0, 0, Math.PI / 6]}>
        <boxGeometry args={[1, 1.5, 0.2]} />
        <meshStandardMaterial color="#0284c7" metalness={0.5} roughness={0.3} />
      </mesh>
      {/* Back Fin */}
      <mesh position={[0, -1, -1.2]} rotation={[Math.PI / 6, 0, 0]}>
        <boxGeometry args={[0.2, 1.5, 1]} />
        <meshStandardMaterial color="#0284c7" metalness={0.5} roughness={0.3} />
      </mesh>
      {/* Front Fin */}
      <mesh position={[0, -1, 1.2]} rotation={[-Math.PI / 6, 0, 0]}>
        <boxGeometry args={[0.2, 1.5, 1]} />
        <meshStandardMaterial color="#0284c7" metalness={0.5} roughness={0.3} />
      </mesh>

      {/* Engine Nozzle */}
      <Cylinder args={[0.8, 0.6, 0.6, 32]} position={[0, -1.8, 0]}>
        <meshStandardMaterial color="#1f2937" metalness={0.8} roughness={0.4} />
      </Cylinder>

      {/* Flame Outer */}
      <Cone ref={flameRef} args={[0.6, 2.5, 16]} position={[0, -3.2, 0]} rotation={[Math.PI, 0, 0]}>
        <meshBasicMaterial color="#f97316" transparent opacity={0.7} blending={THREE.AdditiveBlending} />
      </Cone>
      {/* Inner Flame Core */}
      <Cone args={[0.3, 1.5, 16]} position={[0, -2.5, 0]} rotation={[Math.PI, 0, 0]}>
        <meshBasicMaterial color="#fef08a" transparent opacity={0.9} blending={THREE.AdditiveBlending} />
      </Cone>
    </group>
  );
};

const ScrollRocket = () => {
  const { scrollYProgress } = useScroll();

  // Rocket moves from top to bottom as user scrolls
  const y = useTransform(scrollYProgress, [0, 1], ["10vh", "85vh"]);
  const opacity = useTransform(scrollYProgress, [0, 0.05, 1], [0, 1, 1]);

  const handleClick = () => {
    window.scrollTo({ top: 0, behavior: "smooth" });
  };

  return (
    <motion.div
      style={{ y, opacity }}
      className="fixed right-2 md:right-6 z-40 cursor-pointer w-16 h-32 md:w-20 md:h-40"
      onClick={handleClick}
      title="Back to top"
    >
      <Canvas camera={{ position: [0, 0, 10], fov: 45 }} gl={{ alpha: true, antialias: true }} dpr={[1, 1.5]}>
        <ambientLight intensity={0.6} />
        {/* Main Sun light */}
        <directionalLight position={[10, 10, 10]} intensity={2.5} color="#ffffff" />
        {/* Blue rim light for space feel */}
        <directionalLight position={[-10, -10, -10]} intensity={1.5} color="#38bdf8" />
        <RocketModel />
      </Canvas>
    </motion.div>
  );
};

export default ScrollRocket;
