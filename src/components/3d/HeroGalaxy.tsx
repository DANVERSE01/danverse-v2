'use client';

import { Canvas } from '@react-three/fiber';
import { Suspense, useRef, useMemo, useEffect, useState } from 'react';
import { 
  ScrollControls, 
  useScroll, 
  Stars,
  Float,
  useTexture,
  Sphere,
  Ring,
  Text3D,
  Center,
  Environment
} from '@react-three/drei';
import { EffectComposer, Bloom } from '@react-three/postprocessing';
import { useFrame, useThree } from '@react-three/fiber';
import * as THREE from 'three';
import { motion } from 'framer-motion';
import { useRouter } from 'next/navigation';
import { usePathname } from 'next/navigation';

// Neon color palette
const NEON_COLORS = {
  pink: '#FF2BD7',
  blue: '#00E5FF', 
  red: '#FF2A2A',
  yellow: '#FAFF00',
  green: '#39FF14',
  gold: '#FFC400'
};

// Parametric ring component with instancing
function ParametricRings() {
  const meshRef = useRef<THREE.InstancedMesh>(null);
  const scroll = useScroll();
  
  const ringCount = 50;
  const dummy = useMemo(() => new THREE.Object3D(), []);
  
  useFrame((state) => {
    if (!meshRef.current) return;
    
    const scrollOffset = scroll.offset;
    const time = state.clock.elapsedTime;
    
    for (let i = 0; i < ringCount; i++) {
      const t = i / ringCount;
      const radius = 2 + t * 8;
      const angle = t * Math.PI * 4 + time * 0.5;
      const y = Math.sin(t * Math.PI * 2 + time) * 2;
      
      dummy.position.set(
        Math.cos(angle) * radius,
        y + scrollOffset * 10,
        Math.sin(angle) * radius
      );
      
      dummy.rotation.x = time * 0.5 + t;
      dummy.rotation.y = time * 0.3;
      dummy.rotation.z = scrollOffset * Math.PI;
      
      const scale = 0.5 + Math.sin(time + t * 10) * 0.3;
      dummy.scale.setScalar(scale);
      
      dummy.updateMatrix();
      meshRef.current.setMatrixAt(i, dummy.matrix);
    }
    
    meshRef.current.instanceMatrix.needsUpdate = true;
  });
  
  return (
    <instancedMesh ref={meshRef} args={[undefined, undefined, ringCount]}>
      <ringGeometry args={[0.8, 1.2, 16]} />
      <meshBasicMaterial 
        color={NEON_COLORS.blue} 
        transparent 
        opacity={0.6}
        side={THREE.DoubleSide}
      />
    </instancedMesh>
  );
}

// Floating parametric shapes
function ParametricShapes() {
  const groupRef = useRef<THREE.Group>(null);
  const scroll = useScroll();
  
  useFrame((state) => {
    if (!groupRef.current) return;
    
    const scrollOffset = scroll.offset;
    const time = state.clock.elapsedTime;
    
    // Rotate the entire group based on scroll
    groupRef.current.rotation.y = scrollOffset * Math.PI * 2;
    groupRef.current.rotation.x = Math.sin(time * 0.2) * 0.1;
  });
  
  return (
    <group ref={groupRef}>
      <Float speed={2} rotationIntensity={1} floatIntensity={2}>
        <Sphere args={[0.5, 32, 32]} position={[3, 2, 0]}>
          <meshBasicMaterial color={NEON_COLORS.pink} transparent opacity={0.8} />
        </Sphere>
      </Float>
      
      <Float speed={1.5} rotationIntensity={2} floatIntensity={1}>
        <Sphere args={[0.3, 16, 16]} position={[-2, -1, 2]}>
          <meshBasicMaterial color={NEON_COLORS.green} transparent opacity={0.7} />
        </Sphere>
      </Float>
      
      <Float speed={3} rotationIntensity={0.5} floatIntensity={3}>
        <Ring args={[0.5, 0.8, 16]} position={[0, 3, -2]}>
          <meshBasicMaterial color={NEON_COLORS.yellow} transparent opacity={0.6} side={THREE.DoubleSide} />
        </Ring>
      </Float>
    </group>
  );
}

// Main 3D scene component
function Scene() {
  const { camera, gl } = useThree();
  const scroll = useScroll();
  const [mousePos, setMousePos] = useState({ x: 0, y: 0 });
  const router = useRouter();
  const pathname = usePathname();
  
  // Mouse tracking for pointer tilt
  useEffect(() => {
    const handleMouseMove = (event: MouseEvent) => {
      setMousePos({
        x: (event.clientX / window.innerWidth) * 2 - 1,
        y: -(event.clientY / window.innerHeight) * 2 + 1
      });
    };
    
    window.addEventListener('mousemove', handleMouseMove);
    return () => window.removeEventListener('mousemove', handleMouseMove);
  }, []);
  
  // Handle tap/click to navigate to buy page
  const handleClick = () => {
    const locale = pathname.split('/')[1] || 'en';
    router.push(`/${locale}/buy`);
  };
  
  useFrame((state) => {
    const scrollOffset = scroll.offset;
    const time = state.clock.elapsedTime;
    
    // Timeline-based camera movement (0-25-60-90-100%)
    if (scrollOffset <= 0.25) {
      // 0-25%: Initial zoom in
      const progress = scrollOffset / 0.25;
      camera.position.z = 10 - progress * 3;
      camera.position.y = progress * 2;
    } else if (scrollOffset <= 0.6) {
      // 25-60%: Orbit around
      const progress = (scrollOffset - 0.25) / 0.35;
      const angle = progress * Math.PI;
      camera.position.x = Math.sin(angle) * 5;
      camera.position.z = Math.cos(angle) * 5 + 7;
      camera.position.y = 2 + Math.sin(progress * Math.PI) * 2;
    } else if (scrollOffset <= 0.9) {
      // 60-90%: Pull back and tilt
      const progress = (scrollOffset - 0.6) / 0.3;
      camera.position.z = 7 + progress * 8;
      camera.position.y = 2 - progress * 1;
      camera.rotation.x = progress * 0.3;
    } else {
      // 90-100%: Final dramatic zoom
      const progress = (scrollOffset - 0.9) / 0.1;
      camera.position.z = 15 - progress * 10;
      camera.position.y = 1 + progress * 5;
    }
    
    // Pointer tilt effect
    camera.rotation.x += (mousePos.y * 0.1 - camera.rotation.x) * 0.05;
    camera.rotation.y += (mousePos.x * 0.1 - camera.rotation.y) * 0.05;
    
    camera.lookAt(0, 0, 0);
  });
  
  return (
    <group onClick={handleClick}>
      {/* Starfield background */}
      <Stars 
        radius={100} 
        depth={50} 
        count={5000} 
        factor={4} 
        saturation={0} 
        fade 
        speed={1}
      />
      
      {/* Central galaxy core */}
      <Float speed={1} rotationIntensity={0.5} floatIntensity={0.5}>
        <Sphere args={[1, 64, 64]} position={[0, 0, 0]}>
          <meshBasicMaterial 
            color={NEON_COLORS.blue} 
            transparent 
            opacity={0.8}
          />
        </Sphere>
      </Float>
      
      {/* Parametric rings */}
      <ParametricRings />
      
      {/* Floating shapes */}
      <ParametricShapes />
      
      {/* Environment lighting */}
      <Environment preset="night" />
      
      {/* Post-processing effects */}
      <EffectComposer>
        <Bloom 
          intensity={0.5} 
          luminanceThreshold={0.1} 
          luminanceSmoothing={0.9}
          height={300}
        />
      </EffectComposer>
    </group>
  );
}

// Fallback component using Anime.js for reduced motion
function AnimeFallback() {
  const [mounted, setMounted] = useState(false);
  
  useEffect(() => {
    setMounted(true);
  }, []);
  
  if (!mounted) return null;
  
  return (
    <div className="relative w-full h-screen overflow-hidden bg-gradient-to-br from-gray-900 via-blue-900 to-purple-900">
      {/* Animated SVG fallback */}
      <svg 
        className="absolute inset-0 w-full h-full"
        viewBox="0 0 1000 1000"
        xmlns="http://www.w3.org/2000/svg"
      >
        <defs>
          <radialGradient id="coreGradient" cx="50%" cy="50%" r="50%">
            <stop offset="0%" stopColor={NEON_COLORS.blue} stopOpacity="0.8" />
            <stop offset="100%" stopColor={NEON_COLORS.pink} stopOpacity="0.2" />
          </radialGradient>
        </defs>
        
        {/* Central core */}
        <circle 
          cx="500" 
          cy="500" 
          r="50" 
          fill="url(#coreGradient)"
          className="animate-pulse"
        />
        
        {/* Orbiting rings */}
        {[...Array(5)].map((_, i) => (
          <circle
            key={i}
            cx="500"
            cy="500"
            r={100 + i * 50}
            fill="none"
            stroke={Object.values(NEON_COLORS)[i]}
            strokeWidth="2"
            strokeOpacity="0.4"
            className="animate-spin"
            style={{
              animationDuration: `${10 + i * 5}s`,
              animationDirection: i % 2 ? 'reverse' : 'normal'
            }}
          />
        ))}
      </svg>
      
      {/* Overlay content */}
      <div className="absolute inset-0 flex items-center justify-center">
        <motion.div
          initial={{ opacity: 0, scale: 0.8 }}
          animate={{ opacity: 1, scale: 1 }}
          transition={{ duration: 1 }}
          className="text-center text-white"
        >
          <h1 className="text-4xl md:text-6xl font-bold mb-4 bg-gradient-to-r from-blue-400 to-purple-400 bg-clip-text text-transparent">
            DANVERSE
          </h1>
          <p className="text-xl mb-8">Digital Innovation Accelerator</p>
          <motion.button
            whileHover={{ scale: 1.05 }}
            whileTap={{ scale: 0.95 }}
            className="px-8 py-4 bg-gradient-to-r from-blue-500 to-purple-500 rounded-lg font-semibold"
          >
            Enter DANVERSE
          </motion.button>
        </motion.div>
      </div>
    </div>
  );
}

// Main HeroGalaxy component
export default function HeroGalaxy() {
  const [webGLSupported, setWebGLSupported] = useState(true);
  const [reducedMotion, setReducedMotion] = useState(false);
  
  useEffect(() => {
    // Check WebGL support
    const canvas = document.createElement('canvas');
    const gl = canvas.getContext('webgl') || canvas.getContext('experimental-webgl');
    if (!gl) {
      setWebGLSupported(false);
    }
    
    // Check for reduced motion preference
    const mediaQuery = window.matchMedia('(prefers-reduced-motion: reduce)');
    setReducedMotion(mediaQuery.matches);
    
    const handleChange = (e: MediaQueryListEvent) => {
      setReducedMotion(e.matches);
    };
    
    mediaQuery.addEventListener('change', handleChange);
    return () => mediaQuery.removeEventListener('change', handleChange);
  }, []);
  
  // Use fallback if WebGL not supported or reduced motion preferred
  if (!webGLSupported || reducedMotion) {
    return <AnimeFallback />;
  }
  
  return (
    <div className="relative w-full h-screen">
      <Canvas
        camera={{ position: [0, 0, 10], fov: 75 }}
        gl={{ 
          antialias: true, 
          alpha: true,
          powerPreference: 'high-performance'
        }}
        dpr={[1, 2]}
        performance={{ min: 0.5 }}
      >
        <Suspense fallback={null}>
          <ScrollControls pages={3} damping={0.1}>
            <Scene />
          </ScrollControls>
        </Suspense>
      </Canvas>
      
      {/* Overlay UI */}
      <div className="absolute inset-0 pointer-events-none">
        <div className="flex items-center justify-center h-full">
          <motion.div
            initial={{ opacity: 0, y: 50 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ delay: 1, duration: 1 }}
            className="text-center text-white pointer-events-auto"
          >
            <h1 className="text-6xl md:text-8xl font-bold mb-4 bg-gradient-to-r from-blue-400 via-purple-400 to-pink-400 bg-clip-text text-transparent">
              DANVERSE
            </h1>
            <p className="text-2xl mb-8 text-gray-300">
              Enter the Digital Universe
            </p>
            <motion.div
              animate={{ 
                scale: [1, 1.1, 1],
                boxShadow: [
                  '0 0 20px rgba(0, 229, 255, 0.5)',
                  '0 0 40px rgba(255, 43, 215, 0.8)',
                  '0 0 20px rgba(0, 229, 255, 0.5)'
                ]
              }}
              transition={{ 
                duration: 2, 
                repeat: Infinity,
                ease: "easeInOut"
              }}
              className="inline-block"
            >
              <button className="px-8 py-4 bg-gradient-to-r from-blue-500 via-purple-500 to-pink-500 rounded-lg font-semibold text-lg hover:scale-105 transition-transform duration-300">
                Tap to Enter
              </button>
            </motion.div>
          </motion.div>
        </div>
      </div>
    </div>
  );
}

