"use client";

import { useTheme } from "next-themes";
import { useEffect, useState, useRef, useMemo } from "react";
import { motion } from "framer-motion";

interface Star {
  id: number;
  x: number;
  y: number;
  size: number;
  opacity: number;
  duration: number;
  delay: number;
}

interface ShootingStar {
  id: number;
  x: number;
  y: number;
  angle: number;
  duration: number;
  delay: number;
  size: number;
}

export const StarryBackground = ({ className = "" }: { className?: string }) => {
  const [mounted, setMounted] = useState(false);
  const { resolvedTheme } = useTheme();
  const [mousePosition, setMousePosition] = useState({ x: 0, y: 0 });
  
  const parallaxRef = useRef<HTMLDivElement>(null);
  const rafRef = useRef<number>();
  const lastMoveTime = useRef<number>(0);

  // Memoize stars to avoid recreating them on every render
  const { stars, shootingStars } = useMemo(() => {
    if (typeof window === "undefined") return { stars: [], shootingStars: [] };
    
    // Create fewer stars for better performance
    const screenSize = window.innerWidth * window.innerHeight;
    const density = screenSize > 1000000 ? 15000 : 20000; // Lower density for larger screens
    const starCount = Math.min(Math.floor(screenSize / density) + 30, 80); // Cap at 80 stars
    
    const starsArray: Star[] = [];
    for (let i = 0; i < starCount; i++) {
      starsArray.push({
        id: i,
        x: Math.random() * 100,
        y: Math.random() * 100,
        size: Math.random() * 2 + 0.5,
        opacity: Math.random() * 0.5 + 0.3,
        duration: Math.random() * 3 + 3, // Slower, more subtle animation
        delay: Math.random() * 5,
      });
    }
    
    // Reduce shooting stars to just 1-2
    const count = Math.min(Math.floor(Math.random() * 2) + 1, 2);
    const shootingStarsArray: ShootingStar[] = [];
    
    for (let i = 0; i < count; i++) {
      shootingStarsArray.push({
        id: i,
        x: Math.random() * 80 + 10,
        y: Math.random() * 30,
        angle: Math.random() * 45 + 15,
        duration: Math.random() * 1.5 + 0.8,
        delay: Math.random() * 10 + 5, // Longer delay for less frequent appearance
        size: Math.random() * 1.5 + 1
      });
    }
    
    return { stars: starsArray, shootingStars: shootingStarsArray };
  }, []);

  useEffect(() => {
    setMounted(true);
    
    // More aggressive throttling for mouse movement
    const handleMouseMove = (e: MouseEvent) => {
      const now = performance.now();
      if (now - lastMoveTime.current < 100) return; // Only update every 100ms
      
      if (rafRef.current) return;
      
      rafRef.current = requestAnimationFrame(() => {
        if (parallaxRef.current) {
          // Less movement for better performance
          const moveX = (e.clientX - window.innerWidth/2) * 0.01;
          const moveY = (e.clientY - window.innerHeight/2) * 0.01;
          
          parallaxRef.current.style.transform = `translate(${moveX}px, ${moveY}px)`;
        }
        
        setMousePosition({
          x: e.clientX,
          y: e.clientY
        });
        
        lastMoveTime.current = now;
        rafRef.current = undefined;
      });
    };
    
    window.addEventListener("mousemove", handleMouseMove, { passive: true });
    
    return () => {
      window.removeEventListener("mousemove", handleMouseMove);
      if (rafRef.current) {
        cancelAnimationFrame(rafRef.current);
      }
    };
  }, []);

  if (!mounted) return null;
  
  // Use different colors based on theme
  const starColor = resolvedTheme === "dark" 
    ? "rgba(255, 255, 255, 0.8)" 
    : "rgba(0, 35, 80, 0.6)";
  
  const starGlow = resolvedTheme === "dark"
    ? "0 0 4px rgba(255, 255, 255, 0.6)"
    : "0 0 3px rgba(0, 60, 200, 0.5)";
  
  return (
    <div className={`${className} will-change-transform`}>
      {/* Main stars with direct inline animation */}
      {stars.map((star) => (
        <div
          key={`star-${star.id}`}
          className="absolute rounded-full hardware-accelerated"
          style={{
            left: `${star.x}%`,
            top: `${star.y}%`,
            width: `${star.size}px`,
            height: `${star.size}px`,
            backgroundColor: starColor,
            boxShadow: starGlow,
            transform: `translate(-50%, -50%)`,
            opacity: star.opacity,
            animationName: 'starTwinkle',
            animationDuration: `${star.duration}s`,
            animationTimingFunction: 'ease-in-out',
            animationIterationCount: 'infinite',
            animationDelay: `${star.delay}s`,
            zIndex: -2,
          }}
        />
      ))}
      
      {/* Shooting stars - keep as motion.divs since there are very few */}
      {shootingStars.map((star) => (
        <motion.div
          key={`shooting-${star.id}`}
          className="absolute hardware-accelerated"
          style={{
            left: `${star.x}%`,
            top: `${star.y}%`,
            zIndex: -1,
          }}
          initial={{ opacity: 0 }}
          animate={{
            opacity: [0, 1, 0],
            x: [0, 200 * Math.cos(star.angle * Math.PI / 180)],
            y: [0, 200 * Math.sin(star.angle * Math.PI / 180)],
          }}
          transition={{
            duration: star.duration,
            delay: star.delay,
            ease: "easeOut",
            repeat: Infinity,
            repeatDelay: 15 + Math.random() * 20, // More time between shooting stars
          }}
        >
          <div 
            className="h-px rounded-full"
            style={{
              width: `${star.size * 20}px`,
              backgroundColor: resolvedTheme === "dark" ? "white" : "#0055bb",
              boxShadow: resolvedTheme === "dark" 
                ? "0 0 15px 1px rgba(255, 255, 255, 0.7)" 
                : "0 0 15px 1px rgba(0, 100, 255, 0.7)",
              transform: `rotate(${star.angle}deg)`,
            }}
          />
        </motion.div>
      ))}
      
      {/* Daytime elements - only visible in light mode */}
      {resolvedTheme === "light" && (
        <>
          {/* Strong visible background for light mode */}
          <div className="absolute inset-0 bg-gradient-to-b from-blue-50/70 to-background/40 -z-10"></div>
          
          {/* Floating clouds for light theme - with increased opacity */}
          <div className="absolute top-[10%] left-[15%] w-64 h-24 opacity-60 animate-float-very-slow">
            <div className="absolute w-40 h-40 bg-blue-200 rounded-full blur-xl transform translate-x-12"></div>
            <div className="absolute w-32 h-32 bg-blue-100 rounded-full blur-xl transform translate-x-4 translate-y-4"></div>
            <div className="absolute w-36 h-36 bg-blue-50 rounded-full blur-xl transform translate-x-24 translate-y-2"></div>
          </div>
          
          <div className="absolute top-[30%] right-[20%] w-52 h-32 opacity-50 animate-float-slow">
            <div className="absolute w-32 h-32 bg-blue-100 rounded-full blur-xl"></div>
            <div className="absolute w-28 h-28 bg-blue-50 rounded-full blur-xl transform translate-x-10 translate-y-2"></div>
          </div>
          
          <div className="absolute bottom-[20%] left-[25%] w-48 h-24 opacity-40 animate-float-medium">
            <div className="absolute w-30 h-30 bg-blue-100 rounded-full blur-xl"></div>
            <div className="absolute w-24 h-24 bg-blue-50 rounded-full blur-xl transform translate-x-8 translate-y-4"></div>
          </div>
          
          {/* Sun glow for light theme */}
          <div 
            className="absolute top-[8%] right-[15%] w-60 h-60 rounded-full animate-pulse-slow"
            style={{
              background: 'radial-gradient(circle, rgba(255, 200, 100, 0.4) 0%, rgba(255, 255, 255, 0) 70%)',
              filter: 'blur(8px)',
            }}
          ></div>
          
          {/* Visible grid pattern for light mode */}
          <div className="absolute inset-0 opacity-[0.08]" 
            style={{ 
              backgroundImage: 'linear-gradient(to right, rgba(100,150,255,0.4) 1px, transparent 1px), linear-gradient(to bottom, rgba(100,150,255,0.4) 1px, transparent 1px)',
              backgroundSize: '40px 40px'
            }}
          ></div>
        </>
      )}
      
      {/* Simplified large glow effect with fewer animations */}
      <div 
        ref={parallaxRef}
        className="absolute w-full h-full overflow-hidden"
        style={{
          transition: "transform 1s cubic-bezier(0.2, 0.8, 0.2, 1)",
        }}
      >
        <div
          className="absolute hardware-accelerated"
          style={{
            width: '400px',
            height: '400px',
            borderRadius: '50%',
            background: resolvedTheme === "dark" 
              ? 'radial-gradient(circle, rgba(100, 150, 255, 0.12) 0%, rgba(0, 0, 0, 0) 70%)' 
              : 'radial-gradient(circle, rgba(0, 100, 255, 0.14) 0%, rgba(255, 255, 255, 0) 70%)',
            left: '30%',
            top: '20%',
            filter: 'blur(40px)',
            zIndex: -3,
            animation: 'glow 15s infinite ease-in-out',
          }}
        />
        
        <div
          className="absolute hardware-accelerated"
          style={{
            width: '300px',
            height: '300px',
            borderRadius: '50%',
            background: resolvedTheme === "dark" 
              ? 'radial-gradient(circle, rgba(120, 100, 255, 0.16) 0%, rgba(0, 0, 0, 0) 70%)' 
              : 'radial-gradient(circle, rgba(50, 0, 255, 0.12) 0%, rgba(255, 255, 255, 0) 70%)',
            right: '20%',
            bottom: '30%',
            filter: 'blur(30px)',
            zIndex: -3,
            animation: 'glow 20s infinite ease-in-out 5s',
          }}
        />
      </div>
      
      {/* Add star animations keyframes directly in the component */}
      <style>{`
        @keyframes starTwinkle {
          0%, 100% { 
            opacity: 0.3; 
            transform: translate(-50%, -50%) scale(0.8);
          }
          50% { 
            opacity: 1; 
            transform: translate(-50%, -50%) scale(1.2);
          }
        }
        
        @keyframes float-very-slow {
          0%, 100% { transform: translateY(0) translateX(0); }
          25% { transform: translateY(15px) translateX(10px); }
          50% { transform: translateY(20px) translateX(-15px); }
          75% { transform: translateY(5px) translateX(-20px); }
        }
        
        @keyframes float-slow {
          0%, 100% { transform: translateY(0) translateX(0); }
          50% { transform: translateY(-15px) translateX(15px); }
        }
        
        @keyframes float-medium {
          0%, 100% { transform: translateY(0) translateX(0); }
          33% { transform: translateY(10px) translateX(-10px); }
          66% { transform: translateY(-8px) translateX(8px); }
        }
        
        @keyframes pulse-slow {
          0%, 100% { opacity: 0.3; transform: scale(1); }
          50% { opacity: 0.45; transform: scale(1.1); }
        }
      `}</style>
    </div>
  );
}; 