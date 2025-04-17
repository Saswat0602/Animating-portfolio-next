"use client";

import { useTheme } from "next-themes";
import { useEffect, useState, useRef, useMemo } from "react";
import { motion, useAnimationControls } from "framer-motion";

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
  const [glowingStarIndex, setGlowingStarIndex] = useState(-1);
  const glowControls = useAnimationControls();
  const rafRef = useRef<number>();

  // Memoize stars to avoid recreating them on every render
  const { stars, shootingStars } = useMemo(() => {
    if (typeof window === "undefined") return { stars: [], shootingStars: [] };
    
    // Create fewer stars for better performance
    const starCount = Math.floor(window.innerWidth * window.innerHeight / 10000) + 50;
    
    const starsArray: Star[] = [];
    for (let i = 0; i < starCount; i++) {
      starsArray.push({
        id: i,
        x: Math.random() * 100,
        y: Math.random() * 100,
        size: Math.random() * 2.5 + 0.5,
        opacity: Math.random() * 0.7 + 0.3,
        duration: Math.random() * 4 + 2,
        delay: Math.random() * 5,
      });
    }
    
    const count = Math.floor(Math.random() * 3) + 2; // 2-4 shooting stars
    const shootingStarsArray: ShootingStar[] = [];
    
    for (let i = 0; i < count; i++) {
      shootingStarsArray.push({
        id: i,
        x: Math.random() * 80 + 10,
        y: Math.random() * 30, // Start from top
        angle: Math.random() * 45 + 15, // 15-60 degrees angle
        duration: Math.random() * 1.5 + 0.8,
        delay: Math.random() * 4,
        size: Math.random() * 2 + 1
      });
    }
    
    return { stars: starsArray, shootingStars: shootingStarsArray };
  }, []);

  useEffect(() => {
    setMounted(true);
    
    const handleMouseMove = (e: MouseEvent) => {
      // Throttle mouse move events for better performance
      if (rafRef.current) return;
      
      rafRef.current = requestAnimationFrame(() => {
        setMousePosition({
          x: e.clientX,
          y: e.clientY
        });
        rafRef.current = undefined;
      });
    };
    
    // Create glowing star effect at intervals
    const glowInterval = setInterval(() => {
      // Randomly select a star to glow
      const randomIndex = Math.floor(Math.random() * stars.length);
      setGlowingStarIndex(randomIndex);
      
      // Animate the glow
      glowControls.start({
        scale: [1, 3, 1],
        opacity: [0.5, 1, 0.5],
        boxShadow: [
          "0 0 5px rgba(var(--primary-rgb), 0.7)",
          "0 0 30px rgba(var(--primary-rgb), 1)",
          "0 0 5px rgba(var(--primary-rgb), 0.7)"
        ],
        transition: {
          duration: 3,
          ease: "easeInOut"
        }
      });
    }, 5000); // Every 5 seconds
    
    window.addEventListener("mousemove", handleMouseMove, { passive: true });
    
    return () => {
      window.removeEventListener("mousemove", handleMouseMove);
      clearInterval(glowInterval);
      if (rafRef.current) {
        cancelAnimationFrame(rafRef.current);
      }
    };
  }, [stars.length, glowControls]);

  if (!mounted) return null;
  
  // Use different colors based on theme
  const starColor = resolvedTheme === "dark" 
    ? "rgba(255, 255, 255, 0.9)" 
    : "rgba(0, 35, 80, 0.7)";
  
  const starGlow = resolvedTheme === "dark"
    ? "0 0 6px rgba(255, 255, 255, 0.8), 0 0 12px rgba(120, 160, 255, 0.4)"
    : "0 0 4px rgba(0, 60, 200, 0.6)";
  
  return (
    <div className={`${className} will-change-transform`}>
      {/* Main stars */}
      {stars.map((star, index) => (
        <motion.div
          key={`star-${star.id}`}
          className="absolute rounded-full will-change-transform"
          style={{
            left: `${star.x}%`,
            top: `${star.y}%`,
            width: `${star.size}px`,
            height: `${star.size}px`,
            backgroundColor: starColor,
            boxShadow: starGlow,
            transform: `translate(-50%, -50%)`,
            willChange: "opacity, transform",
            zIndex: -2,
          }}
          animate={index === glowingStarIndex ? glowControls : {
            opacity: [star.opacity * 0.7, star.opacity, star.opacity * 0.7],
            scale: [0.8, 1, 0.8],
          }}
          transition={{
            duration: star.duration,
            delay: star.delay,
            repeat: Infinity,
            ease: "easeInOut",
          }}
        />
      ))}
      
      {/* Shooting stars - reduced number for better performance */}
      {shootingStars.map((star) => (
        <motion.div
          key={`shooting-${star.id}`}
          className="absolute will-change-transform"
          style={{
            left: `${star.x}%`,
            top: `${star.y}%`,
            willChange: "transform, opacity",
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
            repeat: 1,
            repeatDelay: 10 + Math.random() * 20,
          }}
        >
          <div 
            className="h-px rounded-full"
            style={{
              width: `${star.size * 20}px`,
              backgroundColor: resolvedTheme === "dark" ? "white" : "#0055bb",
              boxShadow: resolvedTheme === "dark" 
                ? "0 0 20px 2px rgba(255, 255, 255, 0.8)" 
                : "0 0 20px 2px rgba(0, 100, 255, 0.8)",
              transform: `rotate(${star.angle}deg)`,
            }}
          />
        </motion.div>
      ))}
      
      {/* Large glow effect that moves with subtle parallax */}
      <div 
        className="absolute w-full h-full overflow-hidden"
        style={{
          transform: `translate(${(mousePosition.x - window.innerWidth/2) * 0.02}px, ${(mousePosition.y - window.innerHeight/2) * 0.02}px)`,
          transition: "transform 1s cubic-bezier(0.2, 0.8, 0.2, 1)",
        }}
      >
        <motion.div
          className="absolute"
          style={{
            width: '400px',
            height: '400px',
            borderRadius: '50%',
            background: resolvedTheme === "dark" 
              ? 'radial-gradient(circle, rgba(100, 150, 255, 0.15) 0%, rgba(0, 0, 0, 0) 70%)' 
              : 'radial-gradient(circle, rgba(0, 100, 255, 0.1) 0%, rgba(255, 255, 255, 0) 70%)',
            left: '30%',
            top: '20%',
            filter: 'blur(40px)',
            zIndex: -3,
          }}
          animate={{
            scale: [1, 1.5, 1],
            opacity: [0.5, 0.8, 0.5],
          }}
          transition={{
            duration: 15,
            repeat: Infinity,
            ease: "easeInOut"
          }}
        />
        
        <motion.div
          className="absolute"
          style={{
            width: '300px',
            height: '300px',
            borderRadius: '50%',
            background: resolvedTheme === "dark" 
              ? 'radial-gradient(circle, rgba(120, 100, 255, 0.15) 0%, rgba(0, 0, 0, 0) 70%)' 
              : 'radial-gradient(circle, rgba(50, 0, 255, 0.08) 0%, rgba(255, 255, 255, 0) 70%)',
            right: '20%',
            bottom: '30%',
            filter: 'blur(30px)',
            zIndex: -3,
          }}
          animate={{
            scale: [1, 1.3, 1],
            opacity: [0.4, 0.7, 0.4],
          }}
          transition={{
            duration: 20,
            repeat: Infinity,
            ease: "easeInOut",
            delay: 5
          }}
        />
      </div>
    </div>
  );
}; 