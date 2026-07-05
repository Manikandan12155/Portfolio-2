/* eslint-disable react/no-unknown-property */
import { useRef, useMemo } from 'react';
import { Canvas, useFrame } from '@react-three/fiber';
import { Cylinder, Cone, Sphere, Capsule } from '@react-three/drei';
import * as THREE from 'three';

// --- 3D Components --- //

const CrashedRocket = () => {
  return (
    <group position={[-5, -0.5, -2]} rotation={[0.2, 0, Math.PI / 3]} scale={1.2}>
      {/* Nose cone */}
      <Cone args={[1, 2, 32]} position={[0, 2.5, 0]}>
        <meshStandardMaterial color="#0284c7" metalness={0.8} roughness={0.2} />
      </Cone>
      {/* Body */}
      <Cylinder args={[1, 1, 3, 32]} position={[0, 0, 0]}>
        <meshStandardMaterial color="#0f172a" metalness={0.7} roughness={0.3} />
      </Cylinder>
      {/* Broken Window */}
      <Cylinder args={[0.6, 0.6, 0.2, 32]} position={[0, 0.5, 0.95]} rotation={[Math.PI / 2, 0, 0]}>
        <meshStandardMaterial color="#38bdf8" metalness={0.8} roughness={0.1} />
      </Cylinder>
      <Sphere args={[0.5, 16, 16]} position={[0, 0.5, 0.95]}>
        <meshStandardMaterial color="#000000" roughness={0.1} />
      </Sphere>
      
      {/* Fins */}
      <mesh position={[1.2, -1, 0]} rotation={[0, 0, -Math.PI / 6]}>
        <boxGeometry args={[1, 1.5, 0.2]} />
        <meshStandardMaterial color="#0284c7" metalness={0.6} />
      </mesh>
      {/* Broken bent fin */}
      <mesh position={[-1.2, -0.5, 0]} rotation={[0, 0, Math.PI / 2]}>
        <boxGeometry args={[1, 1.5, 0.2]} />
        <meshStandardMaterial color="#0284c7" metalness={0.6} />
      </mesh>
      <mesh position={[0, -1, -1.2]} rotation={[Math.PI / 6, 0, 0]}>
        <boxGeometry args={[0.2, 1.5, 1]} />
        <meshStandardMaterial color="#0284c7" metalness={0.6} />
      </mesh>
    </group>
  );
};

const Smoke = () => {
  const smokeRef = useRef<THREE.Group>(null);
  
  useFrame((state) => {
    if (smokeRef.current) {
      smokeRef.current.children.forEach((child, i) => {
        child.position.y += 0.02;
        child.position.x += Math.sin(state.clock.elapsedTime * 2 + i) * 0.01;
        child.scale.setScalar(child.scale.x * 0.99); 
        if (child.position.y > 4) {
          child.position.y = -1;
          child.position.x = Math.random() - 0.5;
          child.scale.setScalar(Math.random() * 0.5 + 0.5);
        }
      });
    }
  });

  const particles = useMemo(() => Array.from({ length: 15 }, () => Math.random().toString(36).substring(2, 9)), []);

  return (
    <group ref={smokeRef} position={[-6, 0, -2]}>
      {particles.map((id) => (
        <Sphere key={id} args={[0.8, 16, 16]} position={[Math.random() - 0.5, Math.random() * 4, Math.random() - 0.5]}>
          <meshStandardMaterial color="#cbd5e1" transparent opacity={0.2} roughness={1} />
        </Sphere>
      ))}
    </group>
  );
};

// High-quality cute alien
const CuteAlien = ({ position, rotation, action, scale = 0.5 }: any) => {
  const groupRef = useRef<THREE.Group>(null);
  const armRef = useRef<THREE.Mesh>(null);
  const armRefRight = useRef<THREE.Mesh>(null);
  const toolRef = useRef<THREE.PointLight>(null);
  const headRef = useRef<THREE.Group>(null);

  useFrame((state) => {
    const t = state.clock.elapsedTime;
    
    if (action === "repairing" && armRef.current) {
      armRef.current.rotation.z = Math.sin(t * 15) * 0.3 + Math.PI / 3;
      if (toolRef.current) toolRef.current.intensity = 2 + Math.random() * 6;
    }
    
    if (action === "stargazing" && headRef.current) {
      headRef.current.rotation.y = Math.sin(t * 0.5) * 0.3;
      headRef.current.rotation.x = -Math.PI / 6 + Math.sin(t * 0.3) * 0.1;
    }
    
    if (action === "waving" && armRefRight.current) {
      armRefRight.current.rotation.z = Math.sin(t * 5) * 0.5 - Math.PI / 2;
    }
    
    if (action === "floating" && groupRef.current) {
      groupRef.current.position.y = position[1] + Math.sin(t * 2) * 0.5;
      groupRef.current.rotation.y = t * 0.5;
      groupRef.current.rotation.z = Math.sin(t) * 0.2;
    }
    
    if (action === "hiding" && groupRef.current) {
      groupRef.current.position.x = position[0] + Math.sin(t) * 0.5;
    }
  });

  return (
    <group ref={groupRef} position={position} rotation={rotation} scale={scale}>
      
      {/* Glass Astronaut Helmet */}
      <Sphere args={[1.5, 32, 32]} position={[0, 1.4, 0]}>
        <meshPhysicalMaterial 
          color="#ffffff" 
          transparent 
          opacity={0.3} 
          transmission={0.9} 
          roughness={0.1}
          metalness={0.1}
          ior={1.5}
        />
      </Sphere>

      {/* Head */}
      <group ref={headRef} position={[0, 1.4, 0]} rotation={action === "stargazing" ? [-Math.PI / 6, 0, 0] : [0, 0, 0]}>
        <Sphere args={[1, 32, 32]} scale={[1.2, 0.9, 1.1]}>
          <meshStandardMaterial color="#10b981" roughness={0.3} metalness={0.2} />
        </Sphere>
        
        {/* Cute Big Alien Eyes */}
        <Sphere args={[0.35, 32, 32]} position={[-0.45, 0.1, 0.8]} rotation={[-0.2, 0.3, 0.2]} scale={[1, 1.4, 0.8]}>
          <meshStandardMaterial color="#000" roughness={0} metalness={0.8} />
        </Sphere>
        <Sphere args={[0.35, 32, 32]} position={[0.45, 0.1, 0.8]} rotation={[-0.2, -0.3, -0.2]} scale={[1, 1.4, 0.8]}>
          <meshStandardMaterial color="#000" roughness={0} metalness={0.8} />
        </Sphere>
        
        {/* Tiny Mouth */}
        <Sphere args={[0.05, 16, 16]} position={[0, -0.4, 1.05]}>
          <meshStandardMaterial color="#064e3b" />
        </Sphere>
      </group>
      
      {/* Tiny Body */}
      <Capsule args={[0.5, 0.8, 16, 16]} position={[0, 0, 0]}>
        <meshStandardMaterial color="#10b981" roughness={0.4} metalness={0.1} />
      </Capsule>
      
      {/* Left Arm */}
      <Capsule ref={armRef} args={[0.15, 0.7, 16, 16]} position={[-0.7, 0.2, 0.1]} rotation={[0, 0, Math.PI / 4]}>
        <meshStandardMaterial color="#10b981" />
        {action === "repairing" && (
          <group position={[0, 0.5, 0]}>
            <Cylinder args={[0.08, 0.08, 0.6]} rotation={[0, 0, Math.PI / 2]}>
              <meshStandardMaterial color="#94a3b8" metalness={0.8} />
            </Cylinder>
            <pointLight ref={toolRef} color="#38bdf8" distance={3} intensity={5} position={[0.3, 0, 0]} />
          </group>
        )}
      </Capsule>
      
      {/* Right Arm */}
      <Capsule ref={armRefRight} args={[0.15, 0.7, 16, 16]} position={[0.7, 0.2, 0.1]} rotation={[0, 0, -Math.PI / 6]}>
        <meshStandardMaterial color="#10b981" />
      </Capsule>
      
      {/* Legs */}
      {action === "stargazing" ? (
        <>
          <Capsule args={[0.18, 0.8, 16, 16]} position={[-0.3, -0.8, 0.5]} rotation={[Math.PI / 2, 0, -0.2]}>
            <meshStandardMaterial color="#10b981" />
          </Capsule>
          <Capsule args={[0.18, 0.8, 16, 16]} position={[0.3, -0.8, 0.5]} rotation={[Math.PI / 2, 0, 0.2]}>
            <meshStandardMaterial color="#10b981" />
          </Capsule>
        </>
      ) : (
        <>
          <Capsule args={[0.18, 0.8, 16, 16]} position={[-0.3, -0.9, 0]} rotation={[0, 0, 0]}>
            <meshStandardMaterial color="#10b981" />
          </Capsule>
          <Capsule args={[0.18, 0.8, 16, 16]} position={[0.3, -0.9, 0]} rotation={[0, 0, 0]}>
            <meshStandardMaterial color="#10b981" />
          </Capsule>
        </>
      )}
    </group>
  );
};

// --- Main Component --- //

const MoonFloor = () => {
  return (
    <div className="relative w-full h-64 overflow-hidden">
      {/* 3D Scene Overlay */}
      <div className="absolute inset-0 z-10 w-full h-full pointer-events-none">
        <Canvas camera={{ position: [0, 0, 12], fov: 45 }} gl={{ alpha: true, antialias: true }} dpr={[1, 1.5]}>
          <ambientLight intensity={0.6} />
          <directionalLight position={[5, 10, 10]} intensity={2} color="#ffffff" />
          <directionalLight position={[-5, 5, -5]} intensity={1} color="#38bdf8" />
          
          {/* 3D Crashed Rocket & Smoke */}
          <CrashedRocket />
          <Smoke />
          
          {/* Scatter 5 Cute Aliens */}
          {/* 1. Repairing the rocket */}
          <CuteAlien position={[-2.5, -0.5, -0.5]} rotation={[0, 0.8, 0]} action="repairing" scale={0.45} />
          
          {/* 2. Stargazing on the right */}
          <CuteAlien position={[5, -0.8, 1]} rotation={[0, -0.5, 0]} action="stargazing" scale={0.5} />
          
          {/* 3. Waving at the user on the right */}
          <CuteAlien position={[3.5, -1, 2]} rotation={[0, -0.2, 0]} action="waving" scale={0.55} />
          
          {/* 4. Hiding behind the rocket (Left) */}
          <CuteAlien position={[-6.5, -0.8, -3]} rotation={[0, 1.2, 0]} action="hiding" scale={0.4} />
          
          {/* 5. Floating in zero gravity on the left */}
          <CuteAlien position={[-3, 2, -1]} rotation={[0.2, 0.5, 0.2]} action="floating" scale={0.4} />
        </Canvas>
      </div>

      {/* Moon surface gradient */}
      <div className="absolute inset-0 bg-gradient-to-t from-[hsl(220,15%,18%)] via-[hsl(220,15%,12%)] to-transparent z-0" />

      {/* Original Crater Texture */}
      <svg
        className="absolute bottom-0 w-full z-0"
        height="140"
        viewBox="0 0 1440 140"
        preserveAspectRatio="none"
        fill="none"
      >
        <path
          d="M0 60 Q60 40, 120 55 Q180 70, 240 50 Q320 30, 400 52 Q460 65, 520 48 Q600 35, 680 55 Q740 68, 800 45 Q880 30, 960 50 Q1020 62, 1080 42 Q1160 28, 1240 48 Q1320 60, 1380 45 Q1420 38, 1440 50 L1440 140 L0 140 Z"
          fill="hsl(220, 12%, 16%)"
        />
        <path
          d="M0 60 Q60 40, 120 55 Q180 70, 240 50 Q320 30, 400 52 Q460 65, 520 48 Q600 35, 680 55 Q740 68, 800 45 Q880 30, 960 50 Q1020 62, 1080 42 Q1160 28, 1240 48 Q1320 60, 1380 45 Q1420 38, 1440 50"
          stroke="hsl(185, 40%, 25%)"
          strokeWidth="1"
          fill="none"
          opacity="0.5"
        />
        
        {/* Craters */}
        <ellipse cx="200" cy="100" rx="35" ry="10" fill="hsl(220, 10%, 12%)" opacity="0.6" />
        <ellipse cx="650" cy="90" rx="50" ry="12" fill="hsl(220, 10%, 11%)" opacity="0.5" />
        <ellipse cx="1100" cy="95" rx="40" ry="9" fill="hsl(220, 10%, 12%)" opacity="0.6" />
      </svg>
    </div>
  );
};

export default MoonFloor;
