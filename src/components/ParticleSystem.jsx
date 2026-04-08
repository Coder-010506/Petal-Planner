"use client";

import { useRef } from 'react';
import gsap from 'gsap';
import { useGSAP } from '@gsap/react';

export default function ParticleSystem() {
  const containerRef = useRef(null);

  useGSAP(() => {
    // Generate 15 persistent GSAP particles
    const particles = gsap.utils.toArray('.ambient-particle');
    
    particles.forEach(p => {
      // Setup random starting points across the 3D space
      gsap.set(p, {
        x: () => Math.random() * window.innerWidth,
        y: () => Math.random() * window.innerHeight,
        z: () => Math.random() * 1500 - 500, // deep background to foreground
        scale: () => Math.random() * 1.5 + 0.5,
        opacity: () => Math.random() * 0.5 + 0.2
      });

      // Continuous organic drifting
      gsap.to(p, {
        x: `+=${Math.random() * 200 - 100}`,
        y: `+=${Math.random() * 200 - 100}`,
        z: `+=${Math.random() * 200 - 100}`,
        rotationZ: `+=${Math.random() * 180 - 90}`,
        duration: () => Math.random() * 10 + 10,
        ease: "sine.inOut",
        yoyo: true,
        repeat: -1
      });

      // Breathing opacity
      gsap.to(p, {
        opacity: () => Math.random() * 0.8 + 0.4,
        scale: () => Math.random() * 0.5 + 1.2,
        duration: () => Math.random() * 3 + 2,
        ease: "sine.inOut",
        yoyo: true,
        repeat: -1,
        delay: () => Math.random() * 2
      });
    });
  }, []);

  return (
    <div 
      ref={containerRef} 
      className="absolute inset-0 pointer-events-none z-0 transform-gpu overflow-hidden" 
      style={{ transformStyle: 'preserve-3d' }}
    >
      {[...Array(15)].map((_, i) => (
        <div 
          key={i} 
          className="ambient-particle absolute top-0 left-0 text-white mix-blend-overlay drop-shadow-lg"
          style={{ transformStyle: 'preserve-3d' }}
        >
          {i % 3 === 0 ? "✨" : i % 2 === 0 ? "🌸" : <div className="w-4 h-4 bg-white/50 rounded-full blur-[3px]"></div>}
        </div>
      ))}
    </div>
  );
}
