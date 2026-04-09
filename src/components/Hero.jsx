import React, { Suspense, useRef, useMemo } from 'react';
import { Canvas, useFrame } from '@react-three/fiber';
import { 
  Environment, 
  ContactShadows, 
  PerspectiveCamera, 
  Float, 
  useTexture 
} from '@react-three/drei';
import * as THREE from 'three';
import { motion, useScroll, useTransform } from 'framer-motion';
import { useThree } from '@react-three/fiber';

// Scene Bridge: Captures scroll and applies to 3D elements
function SceneController() {
  const { camera } = useThree();

  React.useEffect(() => {
    const isMobile = window.innerWidth < 768;
    if (isMobile) {
      camera.position.set(0, 2, 10);
      camera.fov = 50;
    } else {
      camera.position.set(0, 1.5, 8);
      camera.fov = 40;
    }
    camera.lookAt(0, 0, 0);
    camera.updateProjectionMatrix();
  }, [camera]);

  return null;
}

// Individual Pallet Component (Optimized)
function Pallet({ position, rotation }) {
  const texture = useTexture('/assets/wood-texture.png');
  texture.wrapS = texture.wrapT = THREE.RepeatWrapping;
  
  const palletRef = useRef();

  return (
    <group ref={palletRef} position={position} rotation={rotation}>
      {/* Bottom Runners */}
      <mesh position={[0, -0.05, -0.4]} castShadow receiveShadow>
        <boxGeometry args={[1.2, 0.1, 0.1]} />
        <meshStandardMaterial map={texture} color="#5D4037" />
      </mesh>
      <mesh position={[0, -0.05, 0]} castShadow receiveShadow>
        <boxGeometry args={[1.2, 0.1, 0.1]} />
        <meshStandardMaterial map={texture} color="#5D4037" />
      </mesh>
      <mesh position={[0, -0.05, 0.4]} castShadow receiveShadow>
        <boxGeometry args={[1.2, 0.1, 0.1]} />
        <meshStandardMaterial map={texture} color="#5D4037" />
      </mesh>

      {/* Top Planks */}
      {[-0.45, -0.225, 0, 0.225, 0.45].map((z, i) => (
        <mesh key={i} position={[0, 0.05, z]} castShadow receiveShadow>
          <boxGeometry args={[1.2, 0.05, 0.18]} />
          <meshStandardMaterial map={texture} color="#5D4037" />
        </mesh>
      ))}
    </group>
  );
}

// Scene Bridge: Captures scroll and applies to 3D elements
function AssemblyScene() {
  const { scrollYProgress } = useScroll();
  const groupRef = useRef();
  
  // Create refs for each pallet to animate them manually in useFrame
  const p1 = useRef();
  const p2 = useRef();
  const p3 = useRef();
  const p4 = useRef();
  const mattress = useRef();

  useFrame((state) => {
    const scroll = scrollYProgress.get();
    
    // Easing functions for realistic physics
    const easeOutCubic = (x) => 1 - Math.pow(1 - x, 3);
    const easeOutBounce = (x) => {
        const n1 = 7.5625;
        const d1 = 2.75;
        if (x < 1 / d1) { return n1 * x * x; } 
        else if (x < 2 / d1) { return n1 * (x -= 1.5 / d1) * x + 0.75; } 
        else if (x < 2.5 / d1) { return n1 * (x -= 2.25 / d1) * x + 0.9375; } 
        else { return n1 * (x -= 2.625 / d1) * x + 0.984375; }
    };
    
    // Pallet 1: Drop from top-left
    if (p1.current) {
      const t = Math.min(1, Math.max(0, scroll * 4)); // 0.0 to 0.25
      const e = easeOutCubic(t);
      const b = easeOutBounce(t);
      p1.current.position.set(-5 + e * 4.35, 4 - b * 4, -3 + e * 2.5);
      p1.current.rotation.set((1 - e) * 0.5, (1 - e) * Math.PI / 4, 0);
    }

    // Pallet 2: Drop from top-right
    if (p2.current) {
      const t = Math.min(1, Math.max(0, (scroll - 0.05) * 4)); // 0.05 to 0.3
      const e = easeOutCubic(t);
      const b = easeOutBounce(t);
      p2.current.position.set(5 - e * 4.35, 4 - b * 4, -3 + e * 2.5);
      p2.current.rotation.set((1 - e) * 0.5, -(1 - e) * Math.PI / 4, 0);
    }

    // Pallet 3: Drop from bottom-left
    if (p3.current) {
      const t = Math.min(1, Math.max(0, (scroll - 0.1) * 4)); // 0.1 to 0.35
      const e = easeOutCubic(t);
      const b = easeOutBounce(t);
      p3.current.position.set(-5 + e * 4.35, 4 - b * 4, 3 - e * 2.5);
      p3.current.rotation.set(-(1 - e) * 0.5, (1 - e) * Math.PI / 4, 0);
    }

    // Pallet 4: Drop from bottom-right
    if (p4.current) {
      const t = Math.min(1, Math.max(0, (scroll - 0.15) * 4)); // 0.15 to 0.4
      const e = easeOutCubic(t);
      const b = easeOutBounce(t);
      p4.current.position.set(5 - e * 4.35, 4 - b * 4, 3 - e * 2.5);
      p4.current.rotation.set(-(1 - e) * 0.5, -(1 - e) * Math.PI / 4, 0);
    }

    // Mattress appearance
    if (mattress.current) {
      const t = Math.min(1, Math.max(0, (scroll - 0.35) * 3));
      const e = easeOutCubic(t);
      mattress.current.scale.set(1.2, Math.max(0.01, e * 1), 1); // Prevent zero-scale warnings
      mattress.current.position.y = 1.5 - e * 1.3; // Starts high, drops onto pallets
      mattress.current.material.opacity = e;
    }

    // Scene tilt/rotation
    if (groupRef.current) {
      groupRef.current.rotation.y = scroll * Math.PI * 0.5;
      
      // Dynamic adjustments based on scroll
      const isMobile = state.size.width < 768;
      
      // Narrative focus: Scale up and move to center as we scroll
      // Initial scale: 1.0 (Desktop) / 0.75 (Mobile)
      // Focus scale: 1.25 (Desktop) / 1.0 (Mobile)
      const initialScale = isMobile ? 0.75 : 1;
      const targetScale = isMobile ? 1.0 : 1.25;
      const currentScale = initialScale + scroll * (targetScale - initialScale);
      groupRef.current.scale.set(currentScale, currentScale, currentScale);
      
      // Dynamic Y position:
      // Start higher to allow for text, then center as user scrolls
      // We'll use 2.5/1.5 as start points, and move towards 2.0/3.0 for visual centering
      const initialY = isMobile ? 2.5 : 1.5;
      const targetY = isMobile ? 2.8 : 3.2; // Visual center points for mobile/desktop
      groupRef.current.position.y = initialY + scroll * (targetY - initialY);
    }
  });

  return (
    <group ref={groupRef}>
      <group ref={p1}><Pallet /></group>
      <group ref={p2}><Pallet /></group>
      <group ref={p3}><Pallet /></group>
      <group ref={p4}><Pallet /></group>
      
      <mesh ref={mattress} transparent opacity={0}>
        <boxGeometry args={[2.6, 0.4, 2.2]} />
        <meshStandardMaterial color="#ffffff" metalness={0} roughness={1} />
      </mesh>

      {/* Shadows now move with the group for consistent grounding */}
      <ContactShadows 
        resolution={1024} 
        scale={20} 
        blur={2} 
        opacity={0.25} 
        far={10} 
        color="#000000" 
        position={[0, -0.1, 0]} 
      />
    </group>
  );
}

export default function Hero() {
  const containerRef = useRef(null);
  const { scrollYProgress } = useScroll({
    target: containerRef,
    offset: ["start start", "end start"],
  });

  const textOpacity = useTransform(scrollYProgress, [0, 0.08], [1, 0]);
  const textScale = useTransform(scrollYProgress, [0, 0.08], [1, 0.85]);
  const hintOpacity = useTransform(scrollYProgress, [0, 0.03], [1, 0]);

  return (
    <section ref={containerRef} className="relative h-[500vh] w-full bg-premium-gray">
      <div className="sticky top-0 h-screen w-full flex items-center justify-center overflow-hidden">
        
        {/* Three.js Canvas */}
        <div className="absolute inset-0 z-10">
          <Canvas shadows dpr={[1, 2]} camera={{ fov: 40 }}>
            {/* Dynamic camera positioning logic */}
            <SceneController />
            <ambientLight intensity={1.5} />
            <spotLight position={[10, 15, 10]} angle={0.3} penumbra={1} castShadow intensity={2} />
            <pointLight position={[-10, -10, -10]} intensity={1} />
            
            <Suspense fallback={null}>
              <Float speed={2} rotationIntensity={0.5} floatIntensity={0.5}>
                <AssemblyScene />
              </Float>
              <Environment preset="apartment" />
            </Suspense>
          </Canvas>
        </div>

        {/* Text Overlay */}
        <motion.div 
          style={{ opacity: textOpacity, scale: textScale }}
          className="relative z-20 text-center pointer-events-none px-6"
        >
          <h1 className="text-6xl sm:text-7xl md:text-8xl lg:text-[10rem] font-heading font-light tracking-tighter text-charcoal leading-none">
            WOOD<br />
            <span className="text-wood-rich italic">NEST.</span>
          </h1>
          <p className="mt-6 md:mt-8 text-sm md:text-xl font-body text-charcoal/50 tracking-widest uppercase">
            Artisanal 3D engineering
          </p>
        </motion.div>

        {/* Scroll Hint */}
        <motion.div 
          style={{ opacity: hintOpacity }}
          className="absolute bottom-12 z-20 flex flex-col items-center gap-4"
        >
          <div className="w-[1px] h-12 bg-gradient-to-t from-wood-rich to-transparent" />
          <span className="text-[10px] uppercase tracking-[0.5em] text-wood-rich font-bold">Scroll Down</span>
        </motion.div>

      </div>
    </section>
  );
}
