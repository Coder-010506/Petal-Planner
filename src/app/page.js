"use client";

import { useEffect, useRef, useState } from "react";
import { useRouter } from "next/navigation";
import Image from "next/image";
import gsap from "gsap";
import { useGSAP } from "@gsap/react";
import CustomCursor from "@/components/CustomCursor";
import ParticleSystem from "@/components/ParticleSystem";

const PREMIUM_ELEMENTS = [
  // Background (-translateZ)
  { id: 1, type: "blob", bg: "bg-pink-300", z: -600, x: -30, y: -20, scale: 3, blur: "50px", opacity: 0.5 },
  { id: 2, type: "blob", bg: "bg-purple-200", z: -800, x: 40, y: 30, scale: 4, blur: "60px", opacity: 0.4 },
  { id: 3, type: "emoji", content: "☁️", z: -400, x: -40, y: 35, scale: 8, blur: "6px", opacity: 0.4, rotate: -5 },

  // Midground (slightly back or 0)
  { id: 4, type: "quote", content: "embrace the journey", z: -100, x: 25, y: -30, rotate: 6, scale: 1.5, opacity: 0.9 },
  { id: 5, type: "shape", shapeType: "polaroid", emoji: "🌸", label: "memories", z: 50, x: -28, y: 15, rotate: -12, scale: 1.2 },
  { id: 6, type: "note", content: "breathe in, breathe out.", z: 0, x: 30, y: 25, rotate: 12, scale: 1 },
  { id: 7, type: "emoji", content: "🦋", z: 100, x: 15, y: -10, scale: 4, blur: "1px", opacity: 0.8, rotate: -15 },

  // Foreground (pop out into camera)
  { id: 8, type: "emoji", content: "✨", z: 300, x: -10, y: -40, scale: 2.5, blur: "0px", opacity: 0.9, rotate: 0 },
  { id: 9, type: "shape", shapeType: "glassCard", z: 400, x: 35, y: 5, rotate: -5, scale: 1.1 },
  { id: 10, type: "quote", content: "your aesthetic space", z: 200, x: -35, y: -25, rotate: -5, scale: 1.4, opacity: 0.9 },
  { id: 11, type: "emoji", content: "💖", z: 450, x: -20, y: 45, scale: 3, blur: "0px", opacity: 1, rotate: 15 },
  { id: 12, type: "emoji", content: "🎀", z: 350, x: 5, y: 40, scale: 2.5, blur: "0px", opacity: 0.9, rotate: -8 },
];

export default function LandingPage() {
  const router = useRouter();
  const containerRef = useRef(null);
  const sceneRef = useRef(null);
  const rippleRef = useRef(null);
  const [hasStarted, setHasStarted] = useState(false);

  useGSAP(() => {
    // Cinematic Staggered Entry
    gsap.from('.layer-item', {
      z: -1500,
      scale: 0,
      opacity: 0,
      rotationX: () => Math.random() * 90 - 45,
      rotationY: () => Math.random() * 90 - 45,
      stagger: 0.08,
      duration: 1.8,
      ease: "back.out(1.2)"
    });

    gsap.from('.center-cta', {
      z: -500, opacity: 0, scale: 0.5,
      duration: 2, delay: 0.4,
      ease: "power3.out"
    });

    // Continuous Organic Sub-floating
    gsap.utils.toArray('.float-el').forEach((el, i) => {
      gsap.to(el, {
        y: "+=15", rotationZ: "+=2",
        duration: 3 + (i % 3),
        yoyo: true, repeat: -1,
        ease: "sine.inOut"
      });
    });

    // 3D Parallax Environment
    const xTo = gsap.quickTo(sceneRef.current, "rotationY", { duration: 1.2, ease: "power3.out" });
    const yTo = gsap.quickTo(sceneRef.current, "rotationX", { duration: 1.2, ease: "power3.out" });

    const handleMouseMove = (e) => {
      if (hasStarted) return;
      const xRot = ((e.clientY / window.innerHeight) - 0.5) * -15; 
      const yRot = ((e.clientX / window.innerWidth) - 0.5) * 15;
      xTo(yRot);
      yTo(xRot);
    };

    window.addEventListener("mousemove", handleMouseMove);
    return () => window.removeEventListener("mousemove", handleMouseMove);
  }, [hasStarted]);

  const handleMouseEnter = (e, item) => {
    if (hasStarted || item.type === 'blob') return;
    
    gsap.to(e.currentTarget, {
      scale: item.scale * 1.15,
      z: item.z + 150, 
      rotationZ: item.rotate + (Math.random() * 10 - 5),
      filter: "drop-shadow(0px 30px 40px rgba(0,0,0,0.15))",
      duration: 0.5,
      ease: "back.out(2)"
    });
  };

  const handleMouseLeave = (e, item) => {
    if (hasStarted || item.type === 'blob') return;
    gsap.to(e.currentTarget, {
      scale: item.scale,
      z: item.z,
      rotationZ: item.rotate,
      filter: "drop-shadow(0px 10px 15px rgba(0,0,0,0.05))",
      duration: 0.6,
      ease: "power3.out"
    });
  };

  const diveIntoCalendar = (e) => {
    if (hasStarted) return;
    setHasStarted(true);

    // 1. Spatially aware Color Ripple Portal
    if (rippleRef.current) {
        const ripple = rippleRef.current;
        gsap.set(ripple, { x: e.clientX, y: e.clientY, scale: 0, opacity: 1, display: "block" });
        
        gsap.to(ripple, {
        scale: 150, // Massive expansion filling screen
        opacity: 0,
        duration: 1.2,
        ease: "power2.in"
        });
    }

    // 2. Cinematic 3D Zoom
    gsap.to(sceneRef.current, {
      z: 2500, 
      rotationX: 0,
      rotationY: 0,
      opacity: 0,
      duration: 1.6,
      ease: "power4.in",
      delay: 0.1
    });
    
    gsap.to(containerRef.current, {
      filter: "blur(25px)",
      duration: 1.4,
      delay: 0.1
    });

    setTimeout(() => {
      router.push('/calendar');
    }, 1400);
  };

  return (
    <div 
      ref={containerRef} 
      className="fixed inset-0 overflow-hidden select-none" 
      style={{ perspective: "1500px", backgroundColor: "#fdf2f8" }}
    >
      <CustomCursor />
      
      {/* Expanding Ripple Portal Mask */}
      <div 
        ref={rippleRef} 
        className="absolute w-20 h-20 rounded-full mix-blend-screen pointer-events-none z-[80] hidden transform-gpu"
        style={{ 
          background: "radial-gradient(circle, rgba(253,164,175,1) 0%, rgba(253,164,175,0) 70%)",
          transform: "translate(-50%, -50%)"
        }}
      ></div>

      <div className="absolute inset-0 bg-[radial-gradient(ellipse_at_center,_transparent_0%,_rgba(0,0,0,0.1)_100%)] z-50 pointer-events-none"></div>
      
      {/* 3D Scene Wrapper with Particles */}
      <div 
        ref={sceneRef} 
        className="w-full h-full absolute inset-0 flex items-center justify-center transform-gpu"
        style={{ transformStyle: "preserve-3d" }}
      >
        <div 
          className="absolute inset[-5%] z-[-2000] opacity-40 mix-blend-multiply w-[130%] h-[130%] left-[-15%] top-[-15%] pointer-events-none" 
          style={{ transform: "translateZ(-1200px) scale(1.4)" }}
        >
           <Image src="/images/bg_collage.png" alt="scrapbook bg" fill style={{ objectFit: 'cover' }} />
        </div>

        <ParticleSystem />

        {PREMIUM_ELEMENTS.map(item => (
          <div
            key={item.id}
            onMouseEnter={(e) => handleMouseEnter(e, item)}
            onMouseLeave={(e) => handleMouseLeave(e, item)}
            onClick={item.type !== 'blob' ? diveIntoCalendar : undefined}
            className={`layer-item float-el absolute flex items-center justify-center ${item.type !== 'blob' ? 'cursor-pointer' : 'pointer-events-none'}`}
            style={{
              left: `calc(50% + ${item.x}%)`,
              top: `calc(50% + ${item.y}%)`,
              transform: `translate(-50%, -50%) translateZ(${item.z}px) rotateZ(${item.rotate || 0}deg) scale(${item.scale})`,
              transformStyle: "preserve-3d",
              filter: item.blur !== "0px" ? `blur(${item.blur})` : "drop-shadow(0px 10px 15px rgba(0,0,0,0.05))"
            }}
          >
            {item.type === 'blob' && (
              <div className={`rounded-full ${item.bg} mix-blend-multiply opacity-50`} style={{ width: item.size, height: item.size }} />
            )}
            
            {item.type === 'emoji' && (
              <div style={{ opacity: item.opacity, fontSize: '3rem' }}>{item.content}</div>
            )}

            {item.type === 'quote' && (
              <div className="font-cursive text-pink-700 whitespace-nowrap" style={{ fontSize: `4rem`, opacity: item.opacity }}>
                {item.content}
              </div>
            )}

            {item.type === 'note' && (
              <div className="bg-[#fffdf0] p-8 text-black/80 font-cursive rounded-[2px] shadow-[4px_10px_20px_rgba(0,0,0,0.1)]" style={{ fontSize: `3rem` }}>
                {item.content}
              </div>
            )}

            {item.type === 'shape' && item.shapeType === 'polaroid' && (
              <div className="bg-white p-4 rounded-[4px] shadow-sm flex flex-col items-center">
                <div className="bg-pink-50 w-48 h-48 relative flex items-center justify-center rounded-[2px] border border-black/5">
                   <span className="text-[5rem] drop-shadow-sm">{item.emoji}</span>
                </div>
                <div className="mt-4 font-cursive text-gray-500/80 text-3xl">{item.label}</div>
              </div>
            )}

            {item.type === 'shape' && item.shapeType === 'glassCard' && (
              <div className="w-64 h-64 glass rounded-[2.5rem] flex items-center justify-center border border-white/60">
                 <span className="text-[6rem]">🌿</span>
              </div>
            )}
          </div>
        ))}

        {/* Central CTA Core */}
        <div 
          className="center-cta absolute top-1/2 left-1/2 flex flex-col items-center justify-center p-12 md:p-16 rounded-[3rem] glass max-w-xl w-[90%] md:w-full text-center border border-white/40 cursor-pointer overflow-hidden group"
          style={{ 
            transform: 'translate(-50%, -50%) translateZ(100px)',
            filter: "drop-shadow(0px 40px 80px rgba(0,0,0,0.15))"
          }}
          onMouseEnter={(e) => handleMouseEnter(e, { z: 100, scale: 1, rotate: 0 })}
          onMouseLeave={(e) => handleMouseLeave(e, { z: 100, scale: 1, rotate: 0 })}
          onClick={diveIntoCalendar}
        >
          <div className="absolute inset-0 bg-gradient-to-r from-pink-200/20 to-purple-200/20 opacity-0 group-hover:opacity-100 transition-opacity duration-500 rounded-[3rem]"></div>
          
          <h2 className="text-3xl md:text-4xl text-pink-600 font-cursive mb-3 opacity-90 drop-shadow-sm transform -rotate-2">
            "never let anyone dull your sparkles"
          </h2>
          
          <h1 className="text-5xl md:text-7xl text-pink-800 font-sans font-extrabold tracking-tight mt-2 mb-2 drop-shadow-sm">
            Petal Planner
          </h1>
          <p className="text-pink-600 mb-10 font-medium italic text-xl opacity-70">
            an interactive safe space.
          </p>

          <button
            onClick={(e) => { e.stopPropagation(); diveIntoCalendar(e); }}
            className="bg-pink-400/90 hover:bg-pink-500 text-white font-cursive text-4xl px-12 py-5 rounded-full transition-all duration-300 shadow-[0_10px_30px_rgba(0,0,0,0.15)] flex items-center gap-2 backdrop-blur-md border border-white/30"
          >
            enter portal ✨
          </button>
        </div>

      </div>
    </div>
  );
}
