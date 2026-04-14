import React, { Suspense, useRef, useEffect } from 'react';
import { Canvas, useFrame } from '@react-three/fiber';
import {
  Environment,
  ContactShadows,
  PerspectiveCamera,
  Float,
  useTexture,
  RoundedBox
} from '@react-three/drei';
import * as THREE from 'three';
import { motion, useMotionValue, useTransform, useMotionValueEvent } from 'framer-motion';
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
        <mesh key={i} position={[0, 0.025, z]} castShadow receiveShadow>
          <boxGeometry args={[1.2, 0.05, 0.18]} />
          <meshStandardMaterial map={texture} color="#5D4037" />
        </mesh>
      ))}
    </group>
  );
}

// Scene Bridge: Captures scroll and applies to 3D elements
function AssemblyScene({ scrollYProgress }) {
  const groupRef = useRef();

  const texture = useTexture('/assets/wood-texture.png');
  texture.wrapS = texture.wrapT = THREE.RepeatWrapping;

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

    // Pallet 1: Drop from top-left (delayed start)
    if (p1.current) {
      const t = Math.min(1, Math.max(0, (scroll - 0.1) * 4)); 
      const e = easeOutCubic(t);
      const b = easeOutBounce(t);
      if (t === 0) p1.current.scale.set(0,0,0); else p1.current.scale.set(1,1,1);
      p1.current.position.set(-5 + e * 4.35, 4 - b * 4, -3 + e * 2.5);
      p1.current.rotation.set((1 - e) * 0.5, (1 - e) * Math.PI / 4, 0);
    }

    // Pallet 2: Drop from top-right
    if (p2.current) {
      const t = Math.min(1, Math.max(0, (scroll - 0.15) * 4)); 
      const e = easeOutCubic(t);
      const b = easeOutBounce(t);
      if (t === 0) p2.current.scale.set(0,0,0); else p2.current.scale.set(1,1,1);
      p2.current.position.set(5 - e * 4.35, 4 - b * 4, -3 + e * 2.5);
      p2.current.rotation.set((1 - e) * 0.5, -(1 - e) * Math.PI / 4, 0);
    }

    // Pallet 3: Drop from bottom-left
    if (p3.current) {
      const t = Math.min(1, Math.max(0, (scroll - 0.2) * 4)); 
      const e = easeOutCubic(t);
      const b = easeOutBounce(t);
      if (t === 0) p3.current.scale.set(0,0,0); else p3.current.scale.set(1,1,1);
      p3.current.position.set(-5 + e * 4.35, 4 - b * 4, 3 - e * 2.5);
      p3.current.rotation.set(-(1 - e) * 0.5, (1 - e) * Math.PI / 4, 0);
    }

    // Pallet 4: Drop from bottom-right
    if (p4.current) {
      const t = Math.min(1, Math.max(0, (scroll - 0.25) * 4)); 
      const e = easeOutCubic(t);
      const b = easeOutBounce(t);
      if (t === 0) p4.current.scale.set(0,0,0); else p4.current.scale.set(1,1,1);
      p4.current.position.set(5 - e * 4.35, 4 - b * 4, 3 - e * 2.5);
      p4.current.rotation.set(-(1 - e) * 0.5, -(1 - e) * Math.PI / 4, 0);
    }

    // Mattress appearance
    if (mattress.current) {
      const t = Math.min(1, Math.max(0, (scroll - 0.3) * 4));
      const b = easeOutBounce(t);
      
      if (t === 0) {
        mattress.current.scale.set(0, 0, 0);
      } else {
        mattress.current.scale.set(1, 1, 1); 
        mattress.current.position.y = 4 - b * 3.95; // Lands perfectly on pallets (Y=0.05)
      }

      // Ensure it's fully opaque and doesn't ghost
      mattress.current.traverse((child) => {
        if (child.isMesh) {
          child.material.transparent = false;
          child.material.opacity = 1;
        }
      });
    }

    // Scene tilt/rotation
    if (groupRef.current) {
      groupRef.current.rotation.y = scroll * Math.PI * 0.5;

      // Dynamic adjustments based on scroll
      const isMobile = state.size.width < 768;

      // Narrative focus: Scale up and move to center as we scroll
      // Initial scale: 1.0 (Desktop) / 0.75 (Mobile)
      // Focus scale: 1.4 (Desktop) / 1.0 (Mobile)
      const initialScale = isMobile ? 0.75 : 1;
      const targetScale = isMobile ? 1.0 : 1.3;
      const currentScale = initialScale + scroll * (targetScale - initialScale);
      groupRef.current.scale.set(currentScale, currentScale, currentScale);

      // Dynamic Y position:
      // Start slightly lower (-1.5) to clear space for header, then move up to absolute center (0)
      const initialY = isMobile ? -1.5 : -1.0;
      const targetY = 0;
      groupRef.current.position.y = initialY + scroll * (targetY - initialY);
    }
  });

  return (
    <group ref={groupRef}>
      <group ref={p1}><Pallet /></group>
      <group ref={p2}><Pallet /></group>
      <group ref={p3}><Pallet /></group>
      <group ref={p4}><Pallet /></group>

      {/* Realistic Bed Assembly */}
      <group ref={mattress}>
        {/* Headboard */}
        <RoundedBox args={[2.5, 0.8, 0.15]} radius={0.05} smoothness={4} position={[0, 0.4, -1.15]}>
          <meshStandardMaterial map={texture} color="#5D4037" />
        </RoundedBox>

        {/* Main Mattress */}
        <RoundedBox args={[2.5, 0.35, 2.1]} radius={0.05} smoothness={4} position={[0, 0.175, 0]}>
          <meshStandardMaterial color="#ede5ca" roughness={0.8} />
        </RoundedBox>

        {/* Blanket */}
        <RoundedBox args={[2.5, 0.05, 1.0]} radius={0.03} smoothness={7} position={[0, 0.375, 0.525]}>
          <meshStandardMaterial color="#ede5ca" roughness={0.9} />
        </RoundedBox>

        {/* Pillow Left */}
        <Float speed={1} rotationIntensity={0.1} floatIntensity={0.1}>
          <RoundedBox args={[0.9, 0.12, 0.5]} radius={0.06} smoothness={4} position={[-0.6, 0.41, -0.65]}>
            <meshStandardMaterial color="#ffffff" roughness={0.9} />
          </RoundedBox>
        </Float>

        {/* Pillow Right */}
        <Float speed={1} rotationIntensity={0.1} floatIntensity={0.1}>
          <RoundedBox args={[0.9, 0.12, 0.5]} radius={0.06} smoothness={4} position={[0.6, 0.41, -0.65]}>
            <meshStandardMaterial color="#ffffff" roughness={0.9} />
          </RoundedBox>
        </Float>
      </group>

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
  const scrollYProgress = useMotionValue(0);

  useEffect(() => {
    const handleScroll = () => {
      const scrollTop = window.pageYOffset;
      const windowHeight = window.innerHeight;
      const docHeight = document.documentElement.scrollHeight;
      const maxScroll = docHeight - windowHeight;
      const scrollPercent = Math.min(scrollTop / maxScroll, 1);
      scrollYProgress.set(scrollPercent);
    };

    window.addEventListener('scroll', handleScroll);
    handleScroll(); // Initial call

    return () => window.removeEventListener('scroll', handleScroll);
  }, [scrollYProgress]);

  const textOpacity = useTransform(scrollYProgress, [0, 0.1], [1, 0]);
  const textScale = useTransform(scrollYProgress, [0, 0.1], [1, 0.85]);
  const hintOpacity = useTransform(scrollYProgress, [0, 0.02], [1, 0]);

  const [showText, setShowText] = React.useState(true);
  
  useMotionValueEvent(scrollYProgress, "change", (latest) => {
    if (latest > 0.1 && showText) setShowText(false);
    else if (latest <= 0.1 && !showText) setShowText(true);
  });

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
                <AssemblyScene scrollYProgress={scrollYProgress} />
              </Float>
              <Environment preset="apartment" />
            </Suspense>
          </Canvas>
        </div>

        {/* Text Overlay */}
        {showText && (
          <motion.div
            style={{ opacity: textOpacity, scale: textScale }}
            className="relative z-20 text-center pointer-events-none px-6"
          >
            <h1 className="text-6xl sm:text-7xl md:text-8xl lg:text-[10rem] font-heading font-semibold tracking-tighter text-charcoal leading-none" style={{ textShadow: '2px 6px 8px rgba(0, 0, 0, 0.6)' }}>
              WOOD
              <span className="text-accent-green">NEST</span>
            </h1>
            <p className="mt-6 md:mt-8 text-sm md:text-xl font-body text-charcoal/50 tracking-widest font-light uppercase" style={{ textShadow: '1px 4px 6px rgba(0, 0, 0, 0.5)' }}>
              PALLET FURNITURE
            </p>
          </motion.div>
        )}

        {/* Scroll Hint */}
        <motion.div
          style={{ opacity: hintOpacity }}
          className="absolute bottom-24 md:bottom-12 z-20 flex flex-col items-center gap-4"
        >
          <div className="w-[1px] h-12 bg-gradient-to-t from-wood-rich to-transparent" />
          <span className="text-[10px] uppercase tracking-[0.5em] text-wood-rich font-bold">Scroll Down</span>
        </motion.div>

      </div>

      {/* WhatsApp Floating Button */}
      <motion.a
        href="https://wa.me/918921825652?text=Hi%20WoodNest%2C%20I%20am%20interested%20in%20your%20pallet%20furniture%20products.%20Can%20you%20provide%20details%20and%20pricing%3F"
        target="_blank"
        rel="noopener noreferrer"
        className="fixed bottom-6 right-6 z-50 bg-green-500 hover:bg-green-600 text-white p-4 rounded-full shadow-lg transition-all duration-300 hover:scale-110"
        initial={{ scale: 0 }}
        animate={{ scale: 1 }}
        transition={{ delay: 1, type: "spring", stiffness: 260, damping: 20 }}
        whileHover={{ scale: 1.1 }}
        whileTap={{ scale: 0.9 }}
      >
        <svg
          width="24"
          height="24"
          viewBox="0 0 24 24"
          fill="currentColor"
          xmlns="http://www.w3.org/2000/svg"
        >
          <path d="M17.472 14.382c-.297-.149-1.758-.867-2.03-.967-.273-.099-.471-.148-.67.15-.197.297-.767.966-.94 1.164-.173.199-.347.223-.644.075-.297-.15-1.255-.463-2.39-1.475-.883-.788-1.48-1.761-1.653-2.059-.173-.297-.018-.458.13-.606.134-.133.298-.347.446-.52.149-.174.198-.298.298-.497.099-.198.05-.371-.025-.52-.075-.149-.669-1.612-.916-2.207-.242-.579-.487-.5-.669-.51-.173-.008-.371-.01-.57-.01-.198 0-.52.074-.792.372-.272.297-1.04 1.016-1.04 2.479 0 1.462 1.065 2.875 1.213 3.074.149.198 2.096 3.2 5.077 4.487.709.306 1.262.489 1.694.625.712.227 1.36.195 1.871.118.571-.085 1.758-.719 2.006-1.413.248-.694.248-1.289.173-1.413-.074-.124-.272-.198-.57-.347m-5.421 7.403h-.004a9.87 9.87 0 01-5.031-1.378l-.361-.214-3.741.982.998-3.648-.235-.374a9.86 9.86 0 01-1.51-5.26c.001-5.45 4.436-9.884 9.888-9.884 2.64 0 5.122 1.03 6.988 2.898a9.825 9.825 0 012.893 6.994c-.003 5.45-4.437 9.884-9.885 9.884m8.413-18.297A11.815 11.815 0 0012.05 0C5.495 0 .16 5.335.157 11.892c0 2.096.547 4.142 1.588 5.945L.057 24l6.305-1.654a11.882 11.882 0 005.683 1.448h.005c6.554 0 11.89-5.335 11.893-11.893A11.821 11.821 0 0020.885 3.488"/>
        </svg>
      </motion.a>
    </section>
  );
}
