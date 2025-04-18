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
      {/* Main stars - static divs instead of motion.divs for better performance */}
      {stars.map((star) => (
        <div
          key={`star-${star.id}`}
          className="absolute rounded-full animate-twinkle hardware-accelerated"
          style={{
            left: `${star.x}%`,
            top: `${star.y}%`,
            width: `${star.size}px`,
            height: `${star.size}px`,
            backgroundColor: starColor,
            boxShadow: starGlow,
            transform: `translate(-50%, -50%)`,
            opacity: star.opacity,
            // Use CSS variables for animation durations
            '--duration': `${star.duration}s`,
            '--delay': `${star.delay}s`,
            zIndex: -2,
          } as React.CSSProperties}
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
              : 'radial-gradient(circle, rgba(0, 100, 255, 0.08) 0%, rgba(255, 255, 255, 0) 70%)',
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
              ? 'radial-gradient(circle, rgba(120, 100, 255, 0.12) 0%, rgba(0, 0, 0, 0) 70%)' 
              : 'radial-gradient(circle, rgba(50, 0, 255, 0.06) 0%, rgba(255, 255, 255, 0) 70%)',
            right: '20%',
            bottom: '30%',
            filter: 'blur(30px)',
            zIndex: -3,
            animation: 'glow 20s infinite ease-in-out 5s',
          }}
        />
      </div>
    </div>
  );
}; 