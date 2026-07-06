/* eslint-disable react/no-unknown-property */
import { useRef, useMemo, useEffect } from 'react';
import { Canvas, useFrame } from '@react-three/fiber';
import { Stars, PointMaterial, Points, Sphere } from '@react-three/drei';
import * as THREE from 'three';

// Interactive Particle Swarm for Nebula effect
const ParticleSwarm = () => {
  const ref = useRef<THREE.Points>(null);
  
  const starTexture = useMemo(() => {
    const canvas = document.createElement('canvas');
    canvas.width = 32;
    canvas.height = 32;
    const context = canvas.getContext('2d');
    if (context) {
      const gradient = context.createRadialGradient(16, 16, 0, 16, 16, 16);
      gradient.addColorStop(0, 'rgba(255,255,255,1)');
      gradient.addColorStop(0.2, 'rgba(255,255,255,0.8)');
      gradient.addColorStop(0.5, 'rgba(255,255,255,0.2)');
      gradient.addColorStop(1, 'rgba(0,0,0,0)');
      context.fillStyle = gradient;
      context.fillRect(0, 0, 32, 32);
    }
    return new THREE.CanvasTexture(canvas);
  }, []);

  const [positions, colors] = useMemo(() => {
    const count = 1500;
    const positions = new Float32Array(count * 3);
    const colors = new Float32Array(count * 3);
    const color = new THREE.Color();
    
    for (let i = 0; i < count; i++) {
      const r = 15 + Math.random() * 30;
      const theta = 2 * Math.PI * Math.random();
      const phi = Math.acos(2 * Math.random() - 1);
      
      // Flattened distribution like a galaxy
      positions[i * 3] = r * Math.sin(phi) * Math.cos(theta);
      positions[i * 3 + 1] = r * Math.sin(phi) * Math.sin(theta) * 0.4;
      positions[i * 3 + 2] = r * Math.cos(phi);
      
      const mix = Math.random();
      color.setHSL(0.5 + mix * 0.4, 0.8, 0.6); // Cyan to Purple to Pink
      colors[i * 3] = color.r;
      colors[i * 3 + 1] = color.g;
      colors[i * 3 + 2] = color.b;
    }
    return [positions, colors];
  }, []);

  useFrame((state) => {
    if (ref.current) {
      ref.current.rotation.y = state.clock.elapsedTime * 0.05;
      ref.current.rotation.z = Math.sin(state.clock.elapsedTime * 0.02) * 0.2;
    }
  });

  return (
    <Points ref={ref} positions={positions} colors={colors}>
      <PointMaterial 
        transparent 
        vertexColors 
        size={0.4} 
        sizeAttenuation={true} 
        depthWrite={false}
        blending={THREE.AdditiveBlending}
        map={starTexture}
        alphaMap={starTexture}
      />
    </Points>
  );
};

// 3D Gas Giant Planet with Rings
const Planet = () => {
  const planetRef = useRef<THREE.Mesh>(null);
  const ringRef = useRef<THREE.Group>(null);
  
  useFrame((state) => {
    if (planetRef.current) {
      planetRef.current.rotation.y = state.clock.elapsedTime * 0.1;
    }
    if (ringRef.current) {
      ringRef.current.rotation.z = state.clock.elapsedTime * 0.02;
    }
  });

  return (
    <group position={[14, 4, -18]}>
      {/* Main Planet Body */}
      <Sphere ref={planetRef} args={[6, 64, 64]}>
        <meshStandardMaterial 
          color="#0f172a"
          roughness={0.8}
          metalness={0.2}
        />
      </Sphere>
      
      {/* Atmosphere Glow */}
      <Sphere args={[6.3, 32, 32]}>
        <meshBasicMaterial 
          color="#38bdf8"
          transparent
          opacity={0.15}
          blending={THREE.AdditiveBlending}
          side={THREE.BackSide}
        />
      </Sphere>
      
      {/* Planetary Rings */}
      <group ref={ringRef} rotation={[Math.PI / 2.2, 0.2, 0]}>
        <mesh>
          <torusGeometry args={[9, 0.6, 2, 64]} />
          <meshBasicMaterial 
            color="#8b5cf6" 
            transparent 
            opacity={0.4} 
            blending={THREE.AdditiveBlending}
            side={THREE.DoubleSide}
          />
        </mesh>
        <mesh>
          <torusGeometry args={[11, 0.3, 2, 64]} />
          <meshBasicMaterial 
            color="#38bdf8" 
            transparent 
            opacity={0.6} 
            blending={THREE.AdditiveBlending}
            side={THREE.DoubleSide}
          />
        </mesh>
      </group>
    </group>
  );
};

// Scroll and Mouse based camera movement
const CameraRig = () => {
  const scrollY = useRef(0);

  useEffect(() => {
    const handleScroll = () => {
      scrollY.current = window.scrollY;
    };
    window.addEventListener('scroll', handleScroll, { passive: true });
    return () => window.removeEventListener('scroll', handleScroll);
  }, []);

  useFrame((state) => {
    // Parallax effect based on scroll using ref to avoid layout thrashing
    // Smooth camera movement
    state.camera.position.y = THREE.MathUtils.lerp(state.camera.position.y, -scrollY.current * 0.005, 0.1);
    
    // Mouse parallax
    state.camera.position.x = THREE.MathUtils.lerp(state.camera.position.x, (state.pointer.x * 2), 0.05);
    
    state.camera.lookAt(0, 0, -10);
  });
  return null;
};

const ThreeSpaceBackground = () => {
  return (
    <div className="fixed inset-0 z-0 pointer-events-none bg-[#020204]">
      {/* Cinematic lens flare overlay */}
      <div className="absolute top-0 left-0 w-full h-[60vh] bg-gradient-to-br from-cyan-400/10 via-transparent to-transparent mix-blend-screen z-10 pointer-events-none" />
      
      <Canvas camera={{ position: [0, 0, 15], fov: 60 }} gl={{ antialias: true, alpha: true }} dpr={[1, 1.5]}>
        <fog attach="fog" args={['#020204', 15, 45]} />
        <ambientLight intensity={0.2} />
        
        {/* Main Star Light Source */}
        <directionalLight position={[-10, 10, 10]} intensity={4} color="#ffffff" />
        <directionalLight position={[-10, 10, 10]} intensity={2} color="#38bdf8" />
        
        {/* Deep background stars */}
        <Stars radius={100} depth={50} count={2000} factor={4} saturation={1} fade speed={1.5} />
        
        <ParticleSwarm />
        <Planet />
        
        <CameraRig />
      </Canvas>
    </div>
  );
};

export default ThreeSpaceBackground;
