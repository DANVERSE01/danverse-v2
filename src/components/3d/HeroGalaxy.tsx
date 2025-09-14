'use client';

import { Canvas } from '@react-three/fiber';
import { Suspense, useRef, useMemo, useEffect, useState, useCallback } from 'react';
import { 
  ScrollControls, 
  useScroll, 
  Stars,
  Float,
  Sphere,
  Ring,
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

// Performance monitoring hook
function usePerformanceMonitor() {
  const [fps, setFps] = useState(60);
  const [lowPerformance, setLowPerformance] = useState(false);
  const frameCount = useRef(0);
  const lastTime = useRef(performance.now());
  
  useFrame(() => {
    frameCount.current++;
    const now = performance.now();
    
    if (now - lastTime.current >= 1000) {
      const currentFps = (frameCount.current * 1000) / (now - lastTime.current);
      setFps(currentFps);
      setLowPerformance(currentFps < 45);
      
      frameCount.current = 0;
      lastTime.current = now;
    }
  });
  
  return { fps, lowPerformance };
}

// Optimized parametric ring component with LOD
function ParametricRings({ lowPerformance }: { lowPerformance: boolean }) {
  const meshRef = useRef<THREE.InstancedMesh>(null);
  const scroll = useScroll();
  
  const ringCount = lowPerformance ? 20 : 50;
  const segments = lowPerformance ? 8 : 16;
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
      <ringGeometry args={[0.8, 1.2, segments]} />
      <meshBasicMaterial 
        color={NEON_COLORS.blue} 
        transparent 
        opacity={0.6}
        side={THREE.DoubleSide}
      />
    </instancedMesh>
  );
}

// Optimized floating shapes with reduced complexity
function ParametricShapes({ lowPerformance }: { lowPerformance: boolean }) {
  const groupRef = useRef<THREE.Group>(null);
  const scroll = useScroll();
  
  const sphereSegments = lowPerformance ? 16 : 32;
  const ringSegments = lowPerformance ? 8 : 16;
  
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
        <Sphere args={[0.5, sphereSegments, sphereSegments]} position={[3, 2, 0]}>
          <meshBasicMaterial color={NEON_COLORS.pink} transparent opacity={0.8} />
        </Sphere>
      </Float>
      
      {!lowPerformance && (
        <>
          <Float speed={1.5} rotationIntensity={2} floatIntensity={1}>
            <Sphere args={[0.3, 16, 16]} position={[-2, -1, 2]}>
              <meshBasicMaterial color={NEON_COLORS.green} transparent opacity={0.7} />
            </Sphere>
          </Float>
          
          <Float speed={3} rotationIntensity={0.5} floatIntensity={3}>
            <Ring args={[0.5, 0.8, ringSegments]} position={[0, 3, -2]}>
              <meshBasicMaterial color={NEON_COLORS.yellow} transparent opacity={0.6} side={THREE.DoubleSide} />
            </Ring>
          </Float>
        </>
      )}
    </group>
  );
}

// Main 3D scene component
function Scene() {
  const { camera, gl } = useThree();
  const scroll = useScroll();
  const [mousePos, setMousePos] = useState({ x: 0, y: 0 });
  const [isMobile, setIsMobile] = useState(false);
  const router = useRouter();
  const pathname = usePathname();
  const { fps, lowPerformance } = usePerformanceMonitor();
  
  // Detect mobile device
  useEffect(() => {
    const checkMobile = () => {
      setIsMobile(window.innerWidth < 768 || /Android|iPhone|iPad|iPod|BlackBerry|IEMobile|Opera Mini/i.test(navigator.userAgent));
    };
    
    checkMobile();
    window.addEventListener('resize', checkMobile);
    return () => window.removeEventListener('resize', checkMobile);
  }, []);
  
  // Mouse tracking for pointer tilt (disabled on mobile)
  useEffect(() => {
    if (isMobile) return;
    
    const handleMouseMove = (event: MouseEvent) => {
      setMousePos({
        x: (event.clientX / window.innerWidth) * 2 - 1,
        y: -(event.clientY / window.innerHeight) * 2 + 1
      });
    };
    
    window.addEventListener('mousemove', handleMouseMove);
    return () => window.removeEventListener('mousemove', handleMouseMove);
  }, [isMobile]);
  
  // Handle tap/click to navigate to buy page
  const handleClick = useCallback(() => {
    const locale = pathname.split('/')[1] || 'en';
    router.push(`/${locale}/buy`);
  }, [pathname, router]);
  
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
    
    // Pointer tilt effect (disabled on mobile)
    if (!isMobile) {
      camera.rotation.x += (mousePos.y * 0.1 - camera.rotation.x) * 0.05;
      camera.rotation.y += (mousePos.x * 0.1 - camera.rotation.y) * 0.05;
    }
    
    camera.lookAt(0, 0, 0);
  });
  
  return (
    <group onClick={handleClick}>
      {/* Starfield background with reduced count on mobile */}
      <Stars 
        radius={100} 
        depth={50} 
        count={isMobile ? 2000 : 5000} 
        factor={4} 
        saturation={0} 
        fade 
        speed={1}
      />
      
      {/* Central galaxy core with reduced segments on mobile */}
      <Float speed={1} rotationIntensity={0.5} floatIntensity={0.5}>
        <Sphere args={[1, isMobile ? 32 : 64, isMobile ? 32 : 64]} position={[0, 0, 0]}>
          <meshBasicMaterial 
            color={NEON_COLORS.blue} 
            transparent 
            opacity={0.8}
          />
        </Sphere>
      </Float>
      
      {/* Parametric rings */}
      <ParametricRings lowPerformance={lowPerformance || isMobile} />
      
      {/* Floating shapes */}
      <ParametricShapes lowPerformance={lowPerformance || isMobile} />
      
      {/* Environment lighting (disabled on mobile for performance) */}
      {!isMobile && <Environment preset="night" />}
      
      {/* Post-processing effects with auto-degradation */}
      <EffectComposer enabled={!lowPerformance && !isMobile}>
        <Bloom 
          intensity={lowPerformance ? 0.3 : 0.5} 
          luminanceThreshold={0.1} 
          luminanceSmoothing={0.9}
          height={lowPerformance ? 150 : 300}
        />
      </EffectComposer>
    </group>
  );
}

// Fallback component for reduced motion or WebGL issues
function AnimeFallback() {
  const [mounted, setMounted] = useState(false);
  const router = useRouter();
  const pathname = usePathname();
  
  useEffect(() => {
    setMounted(true);
  }, []);
  
  const handleClick = () => {
    const locale = pathname.split('/')[1] || 'en';
    router.push(`/${locale}/buy`);
  };
  
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
            onClick={handleClick}
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
  const [isMobile, setIsMobile] = useState(false);
  
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
    
    // Check if mobile
    const checkMobile = () => {
      setIsMobile(window.innerWidth < 768 || /Android|iPhone|iPad|iPod|BlackBerry|IEMobile|Opera Mini/i.test(navigator.userAgent));
    };
    
    checkMobile();
    window.addEventListener('resize', checkMobile);
    mediaQuery.addEventListener('change', handleChange);
    
    return () => {
      mediaQuery.removeEventListener('change', handleChange);
      window.removeEventListener('resize', checkMobile);
    };
  }, []);
  
  // Use fallback if WebGL not supported or reduced motion preferred
  if (!webGLSupported || reducedMotion) {
    return <AnimeFallback />;
  }
  
  // Calculate DPR based on device capabilities
  const getDPR = () => {
    if (isMobile) return [0.5, 1]; // Clamp DPR on mobile
    return [1, 2]; // Allow higher DPR on desktop
  };
  
  return (
    <div className="relative w-full h-screen">
      <Canvas
        camera={{ position: [0, 0, 10], fov: 75 }}
        gl={{ 
          antialias: !isMobile, // Disable antialiasing on mobile
          alpha: true,
          powerPreference: 'high-performance',
          stencil: false, // Disable stencil buffer for performance
          depth: true
        }}
        dpr={getDPR()}
        performance={{ min: 0.5 }}
        frameloop="demand" // Only render when needed
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
            <h1 className="text-4xl md:text-6xl lg:text-8xl font-bold mb-4 bg-gradient-to-r from-blue-400 via-purple-400 to-pink-400 bg-clip-text text-transparent">
              DANVERSE
            </h1>
            <p className="text-lg md:text-2xl mb-8 text-gray-300">
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
              <button className="px-6 md:px-8 py-3 md:py-4 bg-gradient-to-r from-blue-500 via-purple-500 to-pink-500 rounded-lg font-semibold text-base md:text-lg hover:scale-105 transition-transform duration-300 touch-manipulation">
                {isMobile ? 'Tap to Enter' : 'Click to Enter'}
              </button>
            </motion.div>
          </motion.div>
        </div>
      </div>
    </div>
  );
}

