"use client";

import { useRef, useEffect, useState } from 'react';
import gsap from 'gsap';
import { useGSAP } from '@gsap/react';

export default function CustomCursor() {
  const containerRef = useRef(null);
  
  // Only render custom cursor on desktop to avoid weird mobile touch behaviors
  const [isDesktop, setIsDesktop] = useState(true);

  useEffect(() => {
    if (window.matchMedia("(hover: none)").matches) {
      setIsDesktop(false);
    }
  }, []);

  useGSAP(() => {
    if (!isDesktop) return;

    const dots = gsap.utils.toArray('.cursor-dot');
    
    // GSAP quickTo for highly optimized rendering loop
    const xTo = dots.map(dot => gsap.quickTo(dot, "x", { duration: 0.8, ease: "power3.out" }));
    const yTo = dots.map(dot => gsap.quickTo(dot, "y", { duration: 0.8, ease: "power3.out" }));

    // Global position history for snake-like tracking
    let positions = [];

    const moveCursor = (e) => {
      positions.push({ x: e.clientX, y: e.clientY });
      
      dots.forEach((dot, index) => {
         const historyIndex = Math.max(0, positions.length - 1 - (index * 4));
         const pos = positions[historyIndex] || { x: e.clientX, y: e.clientY };
         xTo[index](pos.x);
         yTo[index](pos.y);
      });

      // Keep array small
      if (positions.length > 50) positions.splice(0, 10);
    };

    window.addEventListener("mousemove", moveCursor);

    const clickPulse = () => {
      dots.forEach((dot, i) => {
        gsap.fromTo(dot, 
          { scale: 0.5, rotationZ: 0 },
          { 
            scale: 2.5, 
            rotationZ: 180, 
            opacity: 0.2, 
            duration: 0.5, 
            ease: "back.out(2)" 
          }
        );
        gsap.to(dot, { 
          scale: 1, 
          rotationZ: 0, 
          opacity: 1 - (i * 0.15), 
          duration: 0.4, 
          delay: 0.4 
        });
      });
    };
    
    window.addEventListener("mousedown", clickPulse);

    return () => {
      window.removeEventListener("mousemove", moveCursor);
      window.removeEventListener("mousedown", clickPulse);
    };
  }, [isDesktop]);

  if (!isDesktop) return null;

  return (
    <div ref={containerRef} className="fixed inset-0 pointer-events-none z-[9999] overflow-hidden">
      {[...Array(6)].map((_, i) => (
        <div
          key={i}
          className="cursor-dot absolute top-0 left-0 flex items-center justify-center transform-gpu filter drop-shadow-[0_5px_15px_rgba(244,114,182,0.5)]"
          style={{
            transform: 'translate(-50%, -50%)',
            opacity: 1 - (i * 0.15),
            fontSize: i === 0 ? '45px' : `${35 - (i*5)}px`,
          }}
        >
          🌸
        </div>
      ))}
    </div>
  );
}
