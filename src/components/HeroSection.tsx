"use client";

import React, { useEffect, useRef, useState, useMemo, useCallback } from "react";
import {
  motion,
  useAnimation,
  useInView as framerUseInView,
  AnimatePresence,
  useMotionValue,
  useSpring,
  useTransform,
  useScroll,
  useAnimationControls,
} from "framer-motion";
import { Button } from "./ui/button";
import { ArrowRight, Download, Github } from "lucide-react";
import { useTheme } from 'next-themes';
import Image from "next/image";
import Link from "next/link";
import { throttle } from "lodash";
import { generateTechIcons, TechIcon } from "@/data/techIconsData";

interface HeroSectionProps {
  name?: string;
  title?: string;
  introduction?: string;
  backgroundPattern?: boolean;
}

// Interface for Particle component
interface ParticleProps {
  posX: number;
  posY: number;
  size: number;
  color: string;
}

// Interface for IntroText component
interface IntroTextProps {
  text: string;
  className?: string;
}

// Add MousePosition interface if it doesn't exist
interface MousePosition {
  x: number;
  y: number;
}

// Particle component for React Bits style effect
const Particle: React.FC<ParticleProps> = ({ posX, posY, size, color }) => {
  // Random offset values for more organic movement
  const xOffset = Math.random() * 3 - 1.5;
  const yOffset = Math.random() * 3 - 1.5;
  const duration = 8 + Math.random() * 6; // Random duration between 8-14s

  return (
    <motion.div
      className="absolute rounded-full"
      style={{
        backgroundColor: color,
        width: size,
        height: size,
        left: `${posX}%`,
        top: `${posY}%`,
        zIndex: 0,
      }}
      initial={{ 
        opacity: 0,
        scale: 0.8 
      }}
      animate={{ 
        x: [0, xOffset * 20, -xOffset * 15, xOffset * 25, 0],
        y: [0, yOffset * 25, -yOffset * 20, yOffset * 15, 0],
        opacity: [0.7, 0.9, 0.6, 0.8, 0.7],
        scale: [0.8, 1.1, 0.9, 1.2, 0.8]
      }}
      transition={{
        duration: duration,
        repeat: Infinity,
        repeatType: "loop",
        ease: "easeInOut"
      }}
    />
  );
};

// Shape blur component for card hover effect
const ShapeBlur = () => {
  interface TransformObject {
    x: number;
    y: number;
    transition: {
      duration: number;
      ease: string;
      delay: number;
    };
  }

  const calculateTransform = (mousePosition: {x: number, y: number}, intensity: number, delay: number): TransformObject => {
    return {
      x: (window.innerWidth / 2 - mousePosition.x) * intensity,
      y: (window.innerHeight / 2 - mousePosition.y) * intensity,
      transition: { 
        duration: 0.8, 
        ease: "easeOut",
        delay 
      }
    };
  };

  const [mousePosition, setMousePosition] = useState({ x: 0, y: 0 });
  const [transform1, setTransform1] = useState<TransformObject>({ x: 0, y: 0, transition: { duration: 0.8, ease: "easeOut", delay: 0 } });
  const [transform2, setTransform2] = useState<TransformObject>({ x: 0, y: 0, transition: { duration: 0.8, ease: "easeOut", delay: 0.05 } });
  const [transform3, setTransform3] = useState<TransformObject>({ x: 0, y: 0, transition: { duration: 0.8, ease: "easeOut", delay: 0.1 } });

  useEffect(() => {
    const handleMouseMove = throttle((e: MouseEvent) => {
      setMousePosition({ x: e.clientX, y: e.clientY });
      setTransform1(calculateTransform({ x: e.clientX, y: e.clientY }, 0.015, 0));
      setTransform2(calculateTransform({ x: e.clientX, y: e.clientY }, 0.025, 0.05));
      setTransform3(calculateTransform({ x: e.clientX, y: e.clientY }, 0.035, 0.1));
    }, 50);

    window.addEventListener("mousemove", handleMouseMove);
    return () => {
      window.removeEventListener("mousemove", handleMouseMove);
    };
  }, []);

  return (
    <>
      <motion.div
        className="absolute left-[15%] top-[15%] h-80 w-80 rounded-full bg-primary/30 blur-[100px]"
        animate={{ x: transform1.x, y: transform1.y }}
        transition={transform1.transition}
      />
      <motion.div
        className="absolute bottom-[20%] right-[20%] h-80 w-80 rounded-full bg-secondary/20 blur-[120px]"
        animate={{ x: transform2.x, y: transform2.y }}
        transition={transform2.transition}
      />
      <motion.div
        className="absolute bottom-[25%] left-[10%] h-60 w-60 rounded-full bg-accent/30 blur-[80px]"
        animate={{ x: transform3.x, y: transform3.y }}
        transition={transform3.transition}
      />
    </>
  );
};

// Optimize mouse movement with debounce and RAF
const useSmoothMousePosition = () => {
  const mousePositionRef = useRef<{ x: number; y: number }>({ x: 0, y: 0 });
  const smoothPositionRef = useRef<{ x: number; y: number }>({ x: 0, y: 0 });
  const rafRef = useRef<number>();
  
  // Set up event listener only once
  useEffect(() => {
    const handleMouseMove = (e: MouseEvent) => {
      // Skip state updates entirely, just update the ref directly
      mousePositionRef.current = { x: e.clientX, y: e.clientY };
    };
    
    // Use passive event listener for better performance
    window.addEventListener("mousemove", handleMouseMove, { passive: true });
    
    // Start RAF loop to smooth mouse position without re-renders
    const updateSmoothPosition = () => {
      // Apply easing using refs only, no state updates
      smoothPositionRef.current = {
        x: smoothPositionRef.current.x + (mousePositionRef.current.x - smoothPositionRef.current.x) * 0.2,
        y: smoothPositionRef.current.y + (mousePositionRef.current.y - smoothPositionRef.current.y) * 0.2
      };
      
      rafRef.current = requestAnimationFrame(updateSmoothPosition);
    };
    
    rafRef.current = requestAnimationFrame(updateSmoothPosition);
    
    return () => {
      window.removeEventListener("mousemove", handleMouseMove);
      if (rafRef.current) cancelAnimationFrame(rafRef.current);
    };
  }, []);
  
  return { 
    position: mousePositionRef, // Return the ref directly
    smoothPosition: smoothPositionRef // Return the ref directly
  };
};

interface FloatingTechIconsProps {
  techIcons: TechIcon[];
  mousePositionRef: React.RefObject<MousePosition>;
}

const FloatingTechIcons: React.FC<FloatingTechIconsProps> = ({ techIcons, mousePositionRef }) => {
  // Use useRef instead of useState for positions to avoid re-renders
  const iconPositionsRef = useRef<Array<{ x: number; y: number }>>([]);
  const [renderedPositions, setRenderedPositions] = useState<Array<{ x: number; y: number }>>([]);
  const rafIdRef = useRef<number>();
  const lastUpdateTimeRef = useRef<number>(0);
  
  // Set initial positions
  useEffect(() => {
    if (techIcons?.length) {
      iconPositionsRef.current = techIcons.map(icon => ({ x: icon.x, y: icon.y }));
      setRenderedPositions([...iconPositionsRef.current]);
    }
  }, [techIcons]);
  
  // Animation constants - reduce intensity
  const REPEL_STRENGTH = 10; // Reduced from 15
  const REPEL_THRESHOLD = 15; // Reduced from 20
  const RANDOM_MOVEMENT = 0.1; // Reduced from 0.2
  const EASE_FACTOR = 0.05; // Reduced from 0.08
  const FPS_LIMIT = 30; // Cap at 30fps to reduce CPU usage
  
  // Separate animation loop from React's render cycle
  useEffect(() => {
    // Skip if no icons
    if (!techIcons?.length) return;
    
    const updatePositions = (timestamp: number) => {
      // Throttle updates to limit FPS
      if (timestamp - lastUpdateTimeRef.current < 1000 / FPS_LIMIT) {
        rafIdRef.current = requestAnimationFrame(updatePositions);
        return;
      }
      
      lastUpdateTimeRef.current = timestamp;
      
      const mousePosition = mousePositionRef.current;
      if (!mousePosition) {
        rafIdRef.current = requestAnimationFrame(updatePositions);
        return;
      }
      
      // Update positions without triggering re-renders
      let hasChanged = false;
      
      iconPositionsRef.current = iconPositionsRef.current.map((pos, index) => {
        const icon = index < techIcons.length ? techIcons[index] : null;
        if (!icon) return pos;
        
        // Current position
        const iconPosX = pos.x;
        const iconPosY = pos.y;
        
        // Calculate distance
        const dx = mousePosition.x / window.innerWidth * 100 - iconPosX;
        const dy = mousePosition.y / window.innerHeight * 100 - iconPosY;
        const distance = Math.sqrt(dx * dx + dy * dy);
        
        // Target position (default to original)
        let targetX = icon.x;
        let targetY = icon.y;
        
        // Apply repel effect if close enough
        if (distance < REPEL_THRESHOLD) {
          const repelFactor = (1 - distance / REPEL_THRESHOLD) * REPEL_STRENGTH;
          targetX = iconPosX - (dx / distance) * repelFactor;
          targetY = iconPosY - (dy / distance) * repelFactor;
        }
        
        // Reduce random movement to once every few frames
        if (Math.random() < 0.2) { // Only apply random movement 20% of the time
          targetX += (Math.random() - 0.5) * RANDOM_MOVEMENT;
          targetY += (Math.random() - 0.5) * RANDOM_MOVEMENT;
        }
        
        // Smoother interpolation
        const newX = iconPosX + (targetX - iconPosX) * EASE_FACTOR;
        const newY = iconPosY + (targetY - iconPosY) * EASE_FACTOR;
        
        // Check if position has changed significantly to avoid unnecessary updates
        if (Math.abs(newX - iconPosX) > 0.01 || Math.abs(newY - iconPosY) > 0.01) {
          hasChanged = true;
        }
        
        return { x: newX, y: newY };
      });
      
      // Only update render state if positions have changed significantly
      if (hasChanged) {
        // Batch the update outside the animation frame
        setRenderedPositions([...iconPositionsRef.current]);
      }
      
      rafIdRef.current = requestAnimationFrame(updatePositions);
    };
    
    rafIdRef.current = requestAnimationFrame(updatePositions);
    
    return () => {
      if (rafIdRef.current) {
        cancelAnimationFrame(rafIdRef.current);
      }
    };
  }, [techIcons, mousePositionRef, REPEL_STRENGTH, REPEL_THRESHOLD, RANDOM_MOVEMENT, EASE_FACTOR, FPS_LIMIT]);
  
  // Don't render if no icons
  if (!techIcons?.length || !renderedPositions.length) return null;
  
  // Render fewer icons in mobile to reduce strain
  const isMobile = typeof window !== 'undefined' && window.innerWidth < 768;
  const renderCount = isMobile ? Math.min(techIcons.length, 6) : techIcons.length;
  
  return (
    <>
      {techIcons.slice(0, renderCount).map((icon, index) => {
        if (index >= renderedPositions.length) return null;
        
        const position = renderedPositions[index];
        return (
          <motion.div
            key={icon.name}
            className="absolute pointer-events-auto"
            style={{
              left: `${position.x}%`,
              top: `${position.y}%`,
              transform: 'translate(-50%, -50%)',
              zIndex: 5,
              willChange: 'transform, opacity',
            }}
            initial={{ opacity: 0, scale: 0 }}
            animate={{ opacity: 0.8, scale: 1 }}
            transition={{ 
              type: "spring", 
              stiffness: 260, 
              damping: 20,
              delay: index * 0.1
            }}
            // Use simpler hover effect
            whileHover={{ scale: 1.2, opacity: 1 }}
          >
            <div className="w-8 h-8 md:w-10 md:h-10 lg:w-12 lg:h-12 relative">
              <Image
                src={icon.src}
                alt={icon.name}
                fill
                sizes="(max-width: 640px) 2rem, (max-width: 768px) 2.5rem, 3rem"
                className="object-contain filter drop-shadow-md"
                loading="eager"
                priority={index < 4}
                onError={(e) => {
                  console.error(`Failed to load icon: ${icon.name}`);
                  const imgElement = e.currentTarget as HTMLImageElement;
                  if (icon.name === "aws") {
                    imgElement.src = "https://cdn.jsdelivr.net/gh/devicons/devicon/icons/amazonwebservices/amazonwebservices-plain-wordmark.svg";
                  }
                  else {
                    imgElement.src = `https://via.placeholder.com/50?text=${icon.name}`;
                  }
                }}
              />
            </div>
          </motion.div>
        );
      })}
    </>
  );
};



function IntroText({ text, className }: IntroTextProps) {
  const ref = useRef(null);
  const isInView = framerUseInView(ref, { once: true, amount: 0.2 });

  const textVariants = {
    hidden: { opacity: 0 },
    visible: { 
      opacity: 1,
      transition: { 
        staggerChildren: 0.02
      }
    }
  };

  const letterVariants = {
    hidden: { 
      opacity: 0, 
      y: 20,
      scale: 0.9 
    },
    visible: { 
      opacity: 1, 
      y: 0,
      scale: 1,
      transition: { 
        type: "spring", 
        damping: 10, 
        stiffness: 100 
      }
    }
  };

  return (
    <motion.p
      ref={ref}
      className={`text-md md:text-xl text-primary-text-100 leading-relaxed md:leading-relaxed max-w-4xl ${className}`}
      initial="hidden"
      animate={isInView ? "visible" : "hidden"}
      variants={textVariants}
    >
      {text.split("").map((char, index) => (
        <motion.span
          key={`${char}-${index}`}
          variants={letterVariants}
          className={char === " " ? "inline-block w-[0.3em]" : "inline-block"}
        >
          {char}
        </motion.span>
      ))}
    </motion.p>
  );
}



// Star component for night mode effect
const Star = ({ size, top, left, delay, duration }: { size: number; top: string; left: string; delay: number; duration: number }) => {
  return (
    <motion.div
      className="absolute rounded-full bg-white"
      style={{
        width: size,
        height: size,
        top,
        left,
      }}
      animate={{
        opacity: [0.1, 0.8, 0.1],
        scale: [0.8, 1.2, 0.8],
      }}
      transition={{
        duration,
        delay,
        repeat: Infinity,
        repeatType: "loop",
      }}
    />
  );
};

// Meteor component for night mode effect
const Meteor = ({ top, left, size, angle, delay }: { top: string; left: string; size: number; angle: number; delay: number }) => {
  return (
    <motion.div
      className="absolute h-px bg-white"
      style={{
        width: `${Math.random() * 100 + 50}px`,
        top,
        left,
        rotate: `${angle}deg`,
        opacity: 0,
      }}
      animate={{
        opacity: [0, 1, 0],
        x: [0, 200, 400],
        y: [0, 200, 400],
      }}
      transition={{
        duration: 1.5,
        delay,
        repeat: Infinity,
        repeatDelay: Math.random() * 10 + 5,
      }}
    />
  );
};

const NameAndTitle = ({ name, title }: { name: string; title: string }) => {
  const ref = useRef<HTMLDivElement>(null);
  const [isVisible, setIsVisible] = useState(false);
  
  // Simpler detection of when the component is in view without heavy framer-motion dependencies
  useEffect(() => {
    if (!ref.current) return;
    
    // Use IntersectionObserver API for better performance
    const observer = new IntersectionObserver((entries) => {
      if (entries[0].isIntersecting) {
        setIsVisible(true);
        observer.disconnect(); // Only need to detect once
      }
    }, { threshold: 0.1 });
    
    observer.observe(ref.current);
    
    return () => observer.disconnect();
  }, []);
  
  return (
    <div ref={ref} className="relative py-2">
      {/* Background effect with simple CSS transition instead of motion component */}
      <div 
        className="absolute -inset-10 bg-primary rounded-full"
        style={{
          opacity: isVisible ? 0.1 : 0,
          filter: 'blur(60px)',
          transform: `scale(${isVisible ? 1 : 0})`,
          transition: 'opacity 1.5s ease-out, transform 1.5s ease-out',
          transitionDelay: '0.2s'
        }}
      />
      
      <h1 className="text-4xl md:text-5xl lg:text-6xl font-bold tracking-tight mb-2 relative">
        {/* Use a single span with CSS transitions for better performance */}
        <span
          className="block"
          style={{
            opacity: isVisible ? 1 : 0,
            transform: `translateY(${isVisible ? 0 : '50px'})`,
            transition: 'opacity 0.6s ease-out, transform 0.8s cubic-bezier(0.2, 0.8, 0.2, 1)',
          }}
        >
          {name}
        </span>
      </h1>
      
      <h2 
        className="text-lg md:text-xl lg:text-2xl text-muted-foreground font-medium relative"
        style={{
          opacity: isVisible ? 1 : 0,
          transform: `scale(${isVisible ? 1 : 0.9})`,
          transition: 'opacity 0.8s ease-out, transform 0.8s ease-out',
          transitionDelay: '0.3s'
        }}
      >
        {title}
      </h2>
    </div>
  );
};

const ActionButtons = ({
  projectsButtonRef,
  resumeButtonRef,
}: {
  projectsButtonRef: React.RefObject<HTMLButtonElement>;
  resumeButtonRef: React.RefObject<HTMLAnchorElement>;
}) => {
  const controls = useAnimation();
  const ref = useRef(null);
  const isInView = framerUseInView(ref, { once: true, amount: 0.1 });

  useEffect(() => {
    if (isInView) {
      controls.start("visible");
    }
  }, [controls, isInView]);

  const containerVariants = {
    hidden: { opacity: 0 },
    visible: {
      opacity: 1,
      transition: {
        staggerChildren: 0.2,
        delayChildren: 0.6,
      },
    },
  };

  const buttonVariants = {
    hidden: { y: 20, opacity: 0 },
    visible: {
      y: 0,
      opacity: 1,
      transition: {
        type: "spring",
        stiffness: 100,
        damping: 15,
      },
    },
  };

  return (
    <motion.div
      ref={ref}
      className="flex flex-col sm:flex-row gap-4 mt-8 justify-center mx-auto"
      variants={containerVariants}
      initial="hidden"
      animate={controls}
    >
      <motion.div variants={buttonVariants} whileHover={{ scale: 1.05 }} whileTap={{ scale: 0.98 }}>
        <Button
          className="w-full sm:w-auto group relative overflow-hidden px-8 py-6 text-base sm:text-lg"
          size="lg"
          ref={projectsButtonRef}
          asChild
        >
          <Link href="#projects">
            <motion.span 
              className="absolute inset-0 bg-primary/10 rounded-md" 
              initial={{ scale: 0, opacity: 0 }}
              whileHover={{ scale: 1, opacity: 1 }}
              transition={{ duration: 0.3 }}
            />
            <span className="relative z-10 flex items-center">
              Projects
              <motion.span 
                className="ml-2"
                initial={{ x: 0 }}
                whileHover={{ x: 3 }}
                transition={{ type: "spring", stiffness: 300, damping: 20 }}
              >
                <ArrowRight size={18} />
              </motion.span>
            </span>
          </Link>
        </Button>
      </motion.div>

      <motion.div variants={buttonVariants} whileHover={{ scale: 1.05 }} whileTap={{ scale: 0.98 }}>
        <Button
          variant="outline"
          className="w-full sm:w-auto group relative overflow-hidden px-8 py-6 text-base sm:text-lg"
          size="lg"
          asChild
        >
          <Link 
            href="/resume.pdf" 
            target="_blank" 
            ref={resumeButtonRef}
          >
            <motion.span 
              className="absolute inset-0 bg-secondary/20 rounded-md" 
              initial={{ scale: 0, opacity: 0 }}
              whileHover={{ scale: 1, opacity: 1 }}
              transition={{ duration: 0.3 }}
            />
            <span className="relative z-10 flex items-center">
              Resume
              <motion.span 
                className="ml-2"
                initial={{ y: 0 }}
                whileHover={{ y: -2 }}
                transition={{ repeat: Infinity, repeatType: "reverse", duration: 0.6 }}
              >
                <Download size={18} />
              </motion.span>
            </span>
          </Link>
        </Button>
      </motion.div>
    </motion.div>
  );
};
;

// Add day-time particles component with improved performance
const DayTimeParticles = () => {
  const mouseRef = useRef<{ x: number, y: number }>({ x: 0, y: 0 });
  const cursorX = useMotionValue(0);
  const cursorY = useMotionValue(0);
  
  // Determine if we're on mobile for fewer particles
  const isMobile = typeof window !== 'undefined' && window.innerWidth < 768;
  const rayCount = isMobile ? 10 : 20;
  const particleCount = isMobile ? 30 : 45;
  const glowCount = isMobile ? 2 : 4;
  
  useEffect(() => {
    const handleMouseMove = (e: MouseEvent) => {
      mouseRef.current = { 
        x: e.clientX / window.innerWidth, 
        y: e.clientY / window.innerHeight 
      };
    };
    
    window.addEventListener('mousemove', handleMouseMove, { passive: true });
    return () => window.removeEventListener('mousemove', handleMouseMove);
  }, []);
  
  // Pre-calculate random values for particles to avoid regenerating them on each render
  const particlesData = useMemo(() => {
    return Array.from({ length: particleCount }).map(() => ({
      size: Math.random() * 5 + 2,
      initialX: Math.random() * window.innerWidth,
      initialY: Math.random() * window.innerHeight,
      xOffset1: Math.random() * 80 - 40,
      xOffset2: Math.random() * 80 - 40,
      yOffset1: Math.random() * 80 - 40,
      yOffset2: Math.random() * 80 - 40,
      opacity: [0.2, 0.6, 0.2],
      scale: [0.8, 1.2, 0.8],
      duration: Math.random() * 15 + 15,
      delay: Math.random() * 5,
      type: Math.floor(Math.random() * 3) // 0, 1, or 2 for different gradients
    }));
  }, [particleCount]);
  
  // Pre-calculate random values for light rays
  const raysData = useMemo(() => {
    return Array.from({ length: rayCount }).map(() => ({
      width: Math.random() * 2 + 1,
      height: Math.random() * 250 + 100,
      top: Math.random() * 40,
      left: Math.random() * 100,
      opacity: Math.random() * 0.4 + 0.1,
      duration: Math.random() * 8 + 10,
      delay: Math.random() * 5
    }));
  }, [rayCount]);
  
  // Pre-calculate orb data
  const orbsData = useMemo(() => {
    return Array.from({ length: glowCount }).map((_, i) => ({
      width: Math.random() * 120 + 60,
      x: Math.random() * window.innerWidth,
      y: Math.random() * window.innerHeight,
      type: i % 2, // 0 or 1 for different gradients
      duration: Math.random() * 30 + 30,
      delay: Math.random() * 10
    }));
  }, [glowCount]);
  
  return (
    <div className="absolute inset-0 pointer-events-none overflow-hidden">
      {/* Optimized light rays with fewer elements */}
      {raysData.map((ray, i) => (
        <motion.div
          key={`ray-${i}`}
          className="absolute bg-gradient-to-b from-primary/40 to-transparent"
          style={{
            width: `${ray.width}px`,
            height: `${ray.height}px`,
            top: `${ray.top}%`,
            left: `${ray.left}%`,
            transformOrigin: 'top',
            opacity: ray.opacity,
            filter: "blur(1px)",
          }}
          initial={{ scaleY: 0.2, opacity: 0 }}
          animate={{ 
            scaleY: [0.2, 1, 0.2], 
            opacity: [0, ray.opacity, 0],
            rotate: [Math.random() * 6 - 3, Math.random() * 6 - 3], // Reduced rotation
            x: [0, Math.random() * 20 - 10] // Reduced movement
          }}
          transition={{
            duration: ray.duration,
            repeat: Infinity,
            delay: ray.delay,
            ease: "easeInOut"
          }}
        />
      ))}
      
      {/* Cursor-following glow with reduced complexity */}
      <motion.div
        className="absolute w-80 h-80 rounded-full bg-gradient-to-r from-primary/10 to-secondary/5"
        style={{
          filter: "blur(80px)",
          zIndex: 0,
          x: cursorX,
          y: cursorY
        }}
        animate={{ 
          scale: [1, 1.05, 1],
          opacity: [0.3, 0.4, 0.3]
        }}
        transition={{
          scale: {
            duration: 4,
            repeat: Infinity,
            repeatType: "reverse"
          },
          opacity: {
            duration: 3,
            repeat: Infinity,
            repeatType: "reverse"
          }
        }}
        onUpdate={() => {
          if (mouseRef.current) {
            // Use smoother interpolation for cursor following
            cursorX.set(mouseRef.current.x * window.innerWidth - 150);
            cursorY.set(mouseRef.current.y * window.innerHeight - 150);
          }
        }}
      />
      
      {/* Reduced number of floating particles with optimized rendering */}
      {particlesData.map((particle, i) => (
        <motion.div
          key={`dust-${i}`}
          className="absolute rounded-full"
          style={{
            width: `${particle.size}px`,
            height: `${particle.size}px`,
            background: particle.type === 0 
              ? "radial-gradient(circle, rgba(255,255,255,0.7) 0%, rgba(255,255,255,0) 70%)" 
              : particle.type === 1
              ? "radial-gradient(circle, rgba(194,219,254,0.7) 0%, rgba(194,219,254,0) 70%)" 
              : "radial-gradient(circle, rgba(249,168,212,0.7) 0%, rgba(249,168,212,0) 70%)",
            filter: "blur(1px)",
            zIndex: 0,
            willChange: "transform, opacity",
          }}
          initial={{
            x: particle.initialX,
            y: particle.initialY,
            opacity: particle.opacity[0],
          }}
          animate={{
            x: [
              particle.initialX,
              particle.initialX + particle.xOffset1,
              particle.initialX + particle.xOffset2,
              particle.initialX,
            ],
            y: [
              particle.initialY,
              particle.initialY + particle.yOffset1,
              particle.initialY + particle.yOffset2,
              particle.initialY,
            ],
            opacity: particle.opacity,
            scale: particle.scale,
          }}
          transition={{
            duration: particle.duration,
            repeat: Infinity,
            ease: "easeInOut",
            delay: particle.delay,
          }}
        />
      ))}
      
      {/* Reduced number of glowing orbs */}
      {orbsData.map((orb, i) => (
        <motion.div
          key={`orb-${i}`}
          className="absolute rounded-full"
          style={{
            width: `${orb.width}px`,
            height: `${orb.width}px`,
            x: orb.x,
            y: orb.y,
            background: orb.type === 0 
              ? "radial-gradient(circle, rgba(167,139,250,0.1) 0%, rgba(167,139,250,0) 70%)" 
              : "radial-gradient(circle, rgba(249,168,212,0.1) 0%, rgba(249,168,212,0) 70%)",
            filter: "blur(20px)",
            zIndex: 0,
          }}
          animate={{
            x: [
              orb.x,
              orb.x + 100,
              orb.x - 100,
            ],
            y: [
              orb.y,
              orb.y - 100,
              orb.y + 100,
            ],
            scale: [0.8, 1.1, 0.8],
            opacity: [0.2, 0.4, 0.2]
          }}
          transition={{
            duration: orb.duration,
            repeat: Infinity,
            ease: "easeInOut",
            delay: orb.delay
          }}
        />
      ))}
    </div>
  );
};

// Optimize the HeroSection component to avoid heavy initialization
const HeroSection = ({
  name = 'Saswat Ranjan',
  title = 'MERN/Front-End Developer',
  introduction = "Hi, I'm Saswat Ranjan. A passionate Front-end React Developer & MERN stack Developer based in Bhubaneswar.",
  backgroundPattern = true,
}: HeroSectionProps) => {
  const { theme } = useTheme();
  const heroRef = useRef<HTMLDivElement>(null);
  const textRef = useRef<HTMLDivElement>(null);
  const patternRef = useRef<HTMLDivElement>(null);
  const projectBtnRef = useRef<HTMLButtonElement>(null);
  const resumeBtnRef = useRef<HTMLAnchorElement>(null);
  const controls = useAnimation();

  const isTextInView = framerUseInView(textRef, { once: false, amount: 0.3 });
  const mousePositionRef = useRef<MousePosition>({ x: 0, y: 0 });
  const { position, smoothPosition } = useSmoothMousePosition();

  const [techIcons, setTechIcons] = useState<TechIcon[]>([]);
  const [animationsEnabled, setAnimationsEnabled] = useState(false);

  useEffect(() => {
    try {
      const icons = generateTechIcons();
      if (icons?.length) {
        setTechIcons(icons);
      } else {
        throw new Error('Empty icons array');
      }
    } catch (err) {
      console.error('Fallback to default icons due to:', err);
      setTechIcons([
        {
          name: 'react',
          x: 75,
          y: 20,
          src: 'https://cdn.jsdelivr.net/gh/devicons/devicon/icons/react/react-original.svg',
        },
        {
          name: 'typescript',
          x: 25,
          y: 65,
          src: 'https://cdn.jsdelivr.net/gh/devicons/devicon/icons/typescript/typescript-original.svg',
        },
      ]);
    }

    const timer = setTimeout(() => {
      setAnimationsEnabled(true);
    }, 800);

    return () => clearTimeout(timer);
  }, []);

  useEffect(() => {
    const handleMouseMove = (e: MouseEvent) => {
      mousePositionRef.current = { x: e.clientX, y: e.clientY };
    };

    window.addEventListener('mousemove', handleMouseMove, { passive: true });
    return () => window.removeEventListener('mousemove', handleMouseMove);
  }, []);

  useEffect(() => {
    if (isTextInView) controls.start('visible');
  }, [isTextInView, controls]);

  useEffect(() => {
    const applyMagneticEffect = (btnRef: React.RefObject<HTMLElement>) => {
      const btn = btnRef.current;
      if (!btn) return;

      let isHovering = false;
      let rafId: number | null = null;

      const updatePosition = () => {
        if (!isHovering) return;

        const rect = btn.getBoundingClientRect();
        const centerX = rect.left + rect.width / 2;
        const centerY = rect.top + rect.height / 2;
        const { x, y } = mousePositionRef.current;
        const dx = x - centerX;
        const dy = y - centerY;
        const distance = Math.sqrt(dx * dx + dy * dy);

        if (distance < 100) {
          btn.style.transform = `translate(${dx * 0.2}px, ${dy * 0.2}px)`;
        }

        rafId = requestAnimationFrame(updatePosition);
      };

      const enter = () => {
        isHovering = true;
        rafId = requestAnimationFrame(updatePosition);
      };

      const leave = () => {
        isHovering = false;
        btn.style.transform = 'translate(0, 0)';
        if (rafId) cancelAnimationFrame(rafId);
      };

      btn.addEventListener('mouseenter', enter);
      btn.addEventListener('mouseleave', leave);

      return () => {
        if (rafId) cancelAnimationFrame(rafId);
        btn.removeEventListener('mouseenter', enter);
        btn.removeEventListener('mouseleave', leave);
      };
    };

    const cleanupProject = applyMagneticEffect(projectBtnRef);
    const cleanupResume = applyMagneticEffect(resumeBtnRef);

    return () => {
      cleanupProject?.();
      cleanupResume?.();
    };
  }, []);

  const textVariants = {
    hidden: { opacity: 0, y: 30 },
    visible: (i: number) => ({
      opacity: 1,
      y: 0,
      transition: {
        delay: i * 0.12,
        duration: 0.7,
        ease: [0.215, 0.61, 0.355, 1],
      },
    }),
  };

  const particles = useMemo(() => {
    const p = [];
    for (let i = 0; i < 100; i++) {
      p.push({
        posX: Math.random() * 100,
        posY: Math.random() * 100,
        size: Math.random() * 2, // 4px to 12px
        color: `#fff`,
      });
    }
    return p;
  }, []);

  return (
    <section
      ref={heroRef}
      className="relative min-h-screen w-full flex items-center justify-center overflow-hidden bg-background py-20 px-4 sm:px-6 lg:px-8"
    >
      {animationsEnabled && theme === 'dark' && (
             <div className="absolute inset-0 z-0 pointer-events-none">
             {particles.map((p, i) => (
               <Particle
                 key={i}
                 posX={p.posX}
                 posY={p.posY}
                 size={p.size}
                 color={p.color}
               />
             ))}
        <StarryHeroBackground />
           </div>
      )}
      {animationsEnabled && theme !== 'dark' && <DayTimeParticles />}

      {backgroundPattern && animationsEnabled && (
        <motion.div
          ref={patternRef}
          className="absolute inset-0 z-0 opacity-5 dark:opacity-3 pointer-events-none will-change-transform"
        >
          <div className="grid grid-cols-8 grid-rows-8 h-full w-full">
            {Array.from({ length: 16 }).map((_, i) => (
              <motion.div
                key={i}
                className="rounded-full border border-primary/10"
                style={{
                  gridColumn: `${(i % 8) + 1} / span 1`,
                  gridRow: `${Math.floor(i / 8) + 1} / span 1`,
                }}
                initial={{ scale: 0, opacity: 0 }}
                animate={{
                  scale: Math.random() * 0.7 + 0.2,
                  opacity: Math.random() * 0.15 + 0.05,
                }}
                transition={{
                  duration: 1.5,
                  delay: i * 0.02,
                  ease: 'easeOut',
                }}
              />
            ))}
          </div>
        </motion.div>
      )}

      {animationsEnabled && techIcons.length > 0 && (
        <FloatingTechIcons
          techIcons={techIcons}
          mousePositionRef={mousePositionRef}
        />
      )}

      <div
        ref={textRef}
        className="relative z-10 max-w-4xl mx-auto text-center space-y-8"
      >
        <motion.div
          initial="hidden"
          animate={controls}
          custom={0}
          variants={textVariants}
          className="inline-block px-6 py-2 border border-primary/30 rounded-full text-sm font-medium text-primary dark:text-primary-foreground mb-4 backdrop-blur-sm relative overflow-hidden group hover:border-primary transition-colors duration-300"
        >
          <ShapeBlur />
          <motion.span
            className="mr-2 inline-block"
            animate={{ rotate: [0, 15] }}
            transition={{
              rotate: {
                repeat: Infinity,
                repeatType: 'reverse',
                duration: 0.75,
                repeatDelay: 0.5,
              },
            }}
          >
            👋
          </motion.span>
          <span className="relative z-10 group-hover:text-primary transition-colors duration-300">
            Welcome to my portfolio
          </span>
          <motion.div
            className="absolute inset-0 bg-primary/10 -z-10 group-hover:bg-primary/20 transition-colors duration-300"
            initial={{ x: '-100%' }}
            animate={{ x: '100%' }}
            transition={{
              duration: 2,
              ease: 'easeInOut',
              repeat: Infinity,
              repeatDelay: 3,
            }}
          />
        </motion.div>

        <NameAndTitle name={name} title={title} />

        <IntroText
          text={introduction}
          className="text-base md:text-lg text-muted-foreground max-w-2xl mx-auto mt-6 leading-relaxed hover:text-foreground transition-colors duration-300"
        />

        <ActionButtons
          projectsButtonRef={projectBtnRef}
          resumeButtonRef={resumeBtnRef}
        />
      </div>
    </section>
  );
};

// Simplified StarryHeroBackground with minimal DOM elements and optimized animations
const StarryHeroBackground = () => {
  const containerRef = useRef<HTMLDivElement>(null);
  
  useEffect(() => {
    if (!containerRef.current) return;
    
    const container = containerRef.current;
    
    // Use fewer stars and limit DOM elements
    const starCount = Math.min(window.innerWidth < 768 ? 30 : 45, 45); // Even fewer stars on mobile
    const stars: HTMLElement[] = []; // Array to store references to stars
    
    // Create stars once at component mount instead of repeatedly
    for (let i = 0; i < starCount; i++) {
      const size = Math.random() * 2 + 1; // Keep stars small
      const x = Math.random() * 100;
      const y = Math.random() * 100;
      const opacity = Math.random() * 0.5 + 0.3;
      const duration = Math.random() * 2 + 1; // Faster animation
      const delay = Math.random() * 2;
      
      const star = document.createElement('div');
      star.className = 'star';
      star.style.cssText = `
        position: absolute;
        left: ${x}%;
        top: ${y}%;
        width: ${size}px;
        height: ${size}px;
        background: white;
        border-radius: 50%;
        opacity: ${opacity};
        box-shadow: 0 0 ${size}px rgba(255, 255, 255, 0.5);
        will-change: opacity;
        animation: starPulse ${duration}s ease-in-out infinite alternate;
        animation-delay: ${delay}s;
        transition: opacity 0.2s, transform 0.2s, box-shadow 0.2s;
      `;
      
      container.appendChild(star);
      stars.push(star);
    }
    
    // Function to make random stars blink
    const makeRandomStarsBlink = () => {
      // Number of stars to blink (between 1-5 stars)
      const numToBlink = Math.floor(Math.random() * 5) + 1;
      
      for (let i = 0; i < numToBlink; i++) {
        // Select a random star
        const randomIndex = Math.floor(Math.random() * stars.length);
        const star = stars[randomIndex];
        
        if (star && container.contains(star)) {
          // Save original styles
          const originalOpacity = star.style.opacity;
          const originalBoxShadow = star.style.boxShadow;
          
          // Blink effect
          star.style.opacity = '1';
          star.style.transform = 'scale(1.5)';
          star.style.boxShadow = '0 0 10px rgba(255, 255, 255, 0.9)';
          
          // Return to normal after a short delay
          setTimeout(() => {
            if (star && container.contains(star)) {
              star.style.opacity = originalOpacity;
              star.style.transform = 'scale(1)';
              star.style.boxShadow = originalBoxShadow;
            }
          }, 300);
        }
      }
    };
    
    // Set interval to make random stars blink
    const blinkInterval = setInterval(makeRandomStarsBlink, 2000);
    
    // Limit the number of shooting stars and throttle their creation
    let shootingStarCount = 0;
    const MAX_SHOOTING_STARS = 2; // Maximum concurrent shooting stars
    
    const createShootingStar = () => {
      if (!document.body.contains(container) || shootingStarCount >= MAX_SHOOTING_STARS) return;
      
      shootingStarCount++;
      
      const x = Math.random() * 90 + 5;
      const y = Math.random() * 30;
      const size = Math.random() * 2 + 0.5;
      const angle = Math.random() * 30 + 20;
      const duration = Math.random() * 0.6 + 0.3; // Faster animation
      
      const star = document.createElement('div');
      star.className = 'shooting-star';
      star.style.cssText = `
        position: absolute;
        left: ${x}%;
        top: ${y}%;
        width: ${size * 10}px; // Shorter trails
        height: 1px;
        background: white;
        box-shadow: 0 0 5px rgba(255, 255, 255, 0.7);
        transform: rotate(${angle}deg);
        opacity: 0;
        will-change: opacity, transform;
        animation: shootingStar ${duration}s ease-out forwards;
      `;
      
      container.appendChild(star);
      
      // Clean up after animation
      setTimeout(() => {
        if (container.contains(star)) {
          container.removeChild(star);
          shootingStarCount--;
        }
      }, duration * 1000 + 50);
    };
    
    // Add just two glow areas instead of many
    const createGlows = () => {
      // Reduce number of glows for better performance
      const glowPositions = [
        { left: '65%', top: '25%', size: 250 },
      ];
      
      glowPositions.forEach(({ left, top, size }) => {
        const glow = document.createElement('div');
        glow.className = 'glow';
        glow.style.cssText = `
          position: absolute;
          left: ${left};
          top: ${top};
          width: ${size}px;
          height: ${size}px;
          background: radial-gradient(circle, rgba(150, 170, 255, 0.1) 0%, rgba(10, 20, 30, 0) 70%);
          border-radius: 50%;
          filter: blur(40px);
          opacity: 0.15;
          transform: translate(-50%, -50%);
          will-change: opacity;
          animation: glowPulse 10s ease-in-out infinite alternate;
        `;
        
        container.appendChild(glow);
      });
    };
    
    // Drastically reduce shooting star frequency
    const shootingStarInterval = setInterval(() => {
      if (!document.body.contains(container)) {
        clearInterval(shootingStarInterval);
        return;
      }
      
      // Only 50% chance to create a shooting star at each interval
      if (Math.random() > 0.5) {
        createShootingStar();
      }
    }, 4000); // Less frequent
    
    // Minimize meteor showers - only do them rarely
    const meteorShowerInterval = setInterval(() => {
      if (!document.body.contains(container)) {
        clearInterval(meteorShowerInterval);
        return;
      }
      
      if (Math.random() > 0.7) { // 30% chance of meteor shower
        const count = 2; // Just 2 meteors per shower
        for (let i = 0; i < count; i++) {
          setTimeout(() => createShootingStar(), i * 300);
        }
      }
    }, 20000); // Much less frequent
    
    // Add static glow areas
    createGlows();
    
    return () => {
      clearInterval(shootingStarInterval);
      clearInterval(meteorShowerInterval);
      clearInterval(blinkInterval);
    };
  }, []);
  
  return (
    <div ref={containerRef} className="absolute inset-0 overflow-hidden">
      <style>{`
        @keyframes starPulse {
          0% { opacity: 0.3; transform: scale(0.8); }
          100% { opacity: 0.8; transform: scale(1.1); }
        }
        
        @keyframes shootingStar {
          0% { opacity: 0; transform-origin: left; transform: translateX(0) scaleX(0.1); }
          10% { opacity: 1; }
          100% { opacity: 0; transform-origin: left; transform: translateX(120px) scaleX(1); }
        }
        
        @keyframes glowPulse {
          0% { opacity: 0.1; transform: translate(-50%, -50%) scale(0.9); }
          50% { opacity: 0.15; transform: translate(-50%, -50%) scale(1.05); }
          100% { opacity: 0.1; transform: translate(-50%, -50%) scale(0.9); }
        }
      `}</style>
    </div>
  );
};

export default HeroSection;