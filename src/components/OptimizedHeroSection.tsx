"use client";

import React, { useEffect, useRef, useState, memo, lazy, Suspense } from "react";
import { motion, useAnimation, useInView as framerUseInView } from "framer-motion";
import { Button } from "./ui/button";
import { ArrowRight, Download } from "lucide-react";
import { useTheme } from 'next-themes';
import Image from "next/image";
import Link from "next/link";
import { useTypewriter, Cursor } from 'react-simple-typewriter';
import { generateTechIcons, TechIcon } from "@/data/techIconsData";

// Interfaces
interface HeroSectionProps {
  name?: string;
  title?: string;
  introduction?: string;
  backgroundPattern?: boolean;
}

interface MousePosition {
  x: number;
  y: number;
}

interface FloatingTechIconsProps {
  techIcons: TechIcon[];
  mousePositionRef: React.RefObject<MousePosition>;
}

// Memoized components for optimal rendering
const MemoizedMotionDiv = memo(motion.div);

// Simple placeholder while loading animations
const LoadingPlaceholder = () => <div className="w-full h-full bg-background"></div>;

// Optimized floating tech icons component
const FloatingTechIcons = memo(({ techIcons, mousePositionRef }: FloatingTechIconsProps) => {
  const iconsRef = useRef<(HTMLDivElement | null)[]>([]);
  const animationRef = useRef<number>();
  const [initialized, setInitialized] = useState(false);
  
  // Reduce number of icons on mobile
  const isMobile = typeof window !== 'undefined' && window.innerWidth < 768;
  const maxIcons = isMobile ? Math.min(techIcons.length, 4) : techIcons.length;
  const visibleIcons = techIcons.slice(0, maxIcons);
  
  // Initialize positions and setup animation
  useEffect(() => {
    if (!visibleIcons.length) return;
    
    // Initialize only once
    setInitialized(true);
    
    let lastUpdateTime = 0;
    const FPS_LIMIT = 24; // Lower FPS to improve performance
    
    const updateIconPositions = (timestamp: number) => {
      // Throttle updates based on FPS limit
      if (timestamp - lastUpdateTime < 1000 / FPS_LIMIT) {
        animationRef.current = requestAnimationFrame(updateIconPositions);
        return;
      }
      lastUpdateTime = timestamp;
      
      // Time-based animation factor
      const time = timestamp / 2000;
      
      // Update each icon's position using direct DOM manipulation
      // This is faster than React state updates
      visibleIcons.forEach((icon, i) => {
        const element = iconsRef.current[i];
        if (!element) return;
        
        // Simple floating motion with sine/cosine
        const floatX = Math.sin(time + i * 0.5) * 1.2;
        const floatY = Math.cos(time * 0.8 + i * 0.7) * 1.2;
        
        // Calculate new position (base position + floating)
        const x = icon.x + floatX;
        const y = icon.y + floatY;
        
        // Apply transform directly to DOM for better performance
        element.style.transform = `translate(-50%, -50%) translate(${x}vw, ${y}vh)`;
      });
      
      animationRef.current = requestAnimationFrame(updateIconPositions);
    };
    
    // Start animation loop
    animationRef.current = requestAnimationFrame(updateIconPositions);
    
    // Cleanup
    return () => {
      if (animationRef.current) {
        cancelAnimationFrame(animationRef.current);
      }
    };
  }, [visibleIcons]);
  
  if (!initialized) return null;
  
  // Create ref setter function that properly handles the array
  const setIconRef = (index: number) => (el: HTMLDivElement | null) => {
    iconsRef.current[index] = el;
  };
  
  return (
    <>
      {visibleIcons.map((icon, index) => (
        <div
          key={icon.name}
          ref={setIconRef(index)}
          className="absolute left-0 top-0 will-change-transform"
          style={{
            zIndex: 5,
            opacity: 0.8,
            width: isMobile ? '32px' : '48px',
            height: isMobile ? '32px' : '48px',
          }}
        >
          <div className="relative w-full h-full">
            <Image
              src={icon.src}
              alt={icon.name}
              fill
              sizes="(max-width: 640px) 32px, 48px"
              className="object-contain drop-shadow-md"
              loading="eager"
              onError={(e) => {
                const imgElement = e.currentTarget as HTMLImageElement;
                if (icon.name === "aws") {
                  imgElement.src = "https://cdn.jsdelivr.net/gh/devicons/devicon/icons/amazonwebservices/amazonwebservices-plain-wordmark.svg";
                } else {
                  imgElement.src = `https://via.placeholder.com/50?text=${icon.name}`;
                }
              }}
            />
          </div>
        </div>
      ))}
    </>
  );
});

// Optimized cursor effect with minimal stars for better performance
const CursorStars = memo(({ mousePositionRef }: { mousePositionRef: React.RefObject<MousePosition> }) => {
  // Only show cursor effects on devices that can handle them
  const isLowPower = typeof window !== 'undefined' && 
    window.matchMedia('(prefers-reduced-motion: reduce)').matches;
  
  // Skip entirely on low-power devices
  if (isLowPower) return null;
  
  const [stars, setStars] = useState<{id: number, x: number, y: number, size: number, opacity: number}[]>([]);
  const lastPosRef = useRef<{x: number, y: number, time: number}>({ x: 0, y: 0, time: 0 });
  const idCounterRef = useRef(0);
  const frameRef = useRef<number>();
  
  // Create stars that follow cursor - with optimized throttling
  useEffect(() => {
    const starGenerationInterval = 150; // Increased interval to reduce stars
    
    const updateStars = (timestamp: number) => {
      const now = performance.now();
      const mouse = mousePositionRef.current || { x: 0, y: 0 };
      
      // Distance-based throttling: only create stars when cursor moves enough
      const distance = Math.sqrt(
        Math.pow(mouse.x - lastPosRef.current.x, 2) + 
        Math.pow(mouse.y - lastPosRef.current.y, 2)
      );
      
      // Time-based throttling combined with distance check
      if (now - lastPosRef.current.time > starGenerationInterval && distance > 10) {
        lastPosRef.current = { x: mouse.x, y: mouse.y, time: now };
        
        // Add new star with unique ID for proper keying
        setStars(prevStars => {
          // Clean up old stars first
          const newStars = prevStars.filter(s => now - s.id < 1500);
          
          // Only add new star if we're under the limit
          if (newStars.length < 5) { // Reduced from 10 to 5 for better performance
            return [
              ...newStars,
              {
                id: now + idCounterRef.current++, // Unique ID based on timestamp
                x: mouse.x,
                y: mouse.y,
                size: Math.random() * 3 + 2,
                opacity: Math.random() * 0.4 + 0.2,
              }
            ];
          }
          
          return newStars;
        });
      }
      
      frameRef.current = requestAnimationFrame(updateStars);
    };
    
    frameRef.current = requestAnimationFrame(updateStars);
    
    return () => {
      if (frameRef.current) {
        cancelAnimationFrame(frameRef.current);
      }
    };
  }, [mousePositionRef]);
  
  // Only render a limited number of stars for performance
  return (
    <div className="fixed inset-0 pointer-events-none z-30">
      {stars.slice(-5).map((star) => (
        <motion.div
          key={`star-${star.id}`}
          className="absolute rounded-full bg-white dark:bg-white will-change-transform"
          style={{
            width: `${star.size}px`, 
            height: `${star.size}px`,
          }}
          initial={{ 
            x: star.x, 
            y: star.y, 
            opacity: star.opacity,
            scale: 0.3
          }}
          animate={{ 
            opacity: 0,
            scale: 1.2,
            x: star.x + (Math.random() * 30 - 15),
            y: star.y + (Math.random() * 30 - 15)
          }}
          transition={{ 
            duration: 0.8,
            ease: "easeOut",
          }}
        />
      ))}
    </div>
  );
});

// Improved day mode background
const ImprovedDayBackground = () => (
  <div className="absolute inset-0 overflow-hidden">
    {/* Gradient background */}
    <div className="absolute inset-0 bg-gradient-to-b from-blue-50/30 to-background"></div>
    
    {/* Animated subtle clouds */}
    <div className="absolute top-10 left-[5%] w-[30%] h-40 bg-white opacity-[0.03] rounded-full filter blur-3xl"></div>
    <div className="absolute top-[15%] right-[10%] w-[40%] h-32 bg-white opacity-[0.02] rounded-full filter blur-3xl animate-float-slow"></div>
    
    {/* Subtle grid pattern */}
    <div className="absolute inset-0 opacity-[0.02]" 
      style={{ 
        backgroundImage: 'linear-gradient(to right, rgba(200,200,200,0.1) 1px, transparent 1px), linear-gradient(to bottom, rgba(200,200,200,0.1) 1px, transparent 1px)',
        backgroundSize: '50px 50px'
      }}
    ></div>
    
    {/* Light rays from top */}
    <div className="absolute top-0 left-1/4 w-1/2 h-1/3 bg-gradient-to-b from-blue-100/10 to-transparent"></div>
    
    {/* Subtle animated glow */}
    <motion.div 
      className="absolute w-full h-full opacity-20"
      animate={{ 
        background: [
          'radial-gradient(circle at 30% 20%, rgba(191, 219, 254, 0.2) 0%, transparent 60%)',
          'radial-gradient(circle at 70% 60%, rgba(191, 219, 254, 0.15) 0%, transparent 50%)',
          'radial-gradient(circle at 40% 40%, rgba(191, 219, 254, 0.2) 0%, transparent 60%)',
        ]
      }}
      transition={{ 
        duration: 15, 
        repeat: Infinity,
        repeatType: "reverse" 
      }}
    />
  </div>
);

// Ultra-simplified background components with improved visuals
const MinimalBackground = memo(({ theme }: { theme: string | undefined }) => {
  if (theme === 'dark') {
    return (
      <div className="absolute inset-0 bg-gradient-to-b from-background to-background/90 overflow-hidden">
        {/* Improved starry sky with different star sizes */}
        <div className="absolute inset-0 opacity-50" style={{ 
          backgroundImage: 'radial-gradient(circle, rgba(255,255,255,0.4) 1px, transparent 1px), radial-gradient(circle, rgba(255,255,255,0.2) 2px, transparent 2px)',
          backgroundSize: '50px 50px, 100px 100px',
          backgroundPosition: '0 0, 25px 25px'
        }}></div>
        
        {/* Subtle nebula-like gradient in background */}
        <div className="absolute top-0 right-0 w-1/2 h-1/2 rounded-full bg-indigo-900/5 blur-3xl"></div>
        <div className="absolute bottom-0 left-0 w-1/3 h-1/3 rounded-full bg-blue-900/5 blur-3xl"></div>
      </div>
    );
  }
  
  // Enhanced day mode background
  return <ImprovedDayBackground />;
});

// Simple gradient blur component
const SimpleBlur = () => (
  <div className="absolute inset-0 opacity-30 pointer-events-none">
    <div className="absolute w-1/3 h-1/3 rounded-full bg-primary/5 filter blur-3xl left-1/4 top-1/4"></div>
    <div className="absolute w-1/4 h-1/4 rounded-full bg-secondary/5 filter blur-3xl right-1/4 bottom-1/4"></div>
  </div>
);

// Main optimized HeroSection component
const OptimizedHeroSection = ({
  name = "Saswat Ranjan",
  title = "MERN/Front-End Developer",
  introduction = "Hi, I'm Saswat Ranjan. A passionate Front-end React Developer & MERN stack Developer based in Bhubaneswar.",
  backgroundPattern = true,
}: HeroSectionProps) => {
  const { theme } = useTheme();
  const heroRef = useRef<HTMLDivElement>(null);
  const textRef = useRef<HTMLDivElement>(null);
  const isTextInView = framerUseInView(textRef, { once: true, amount: 0.3 });
  const controls = useAnimation();
  const mousePositionRef = useRef<MousePosition>({ x: 0, y: 0 });
  
  // Tech icons state with empty array default
  const [techIcons, setTechIcons] = useState<TechIcon[]>([]);
  
  // Add deferred loading state
  const [animationsEnabled, setAnimationsEnabled] = useState(false);
  
  // Track if we should render cursor stars (performance optimization)
  const [shouldRenderCursorEffects, setShouldRenderCursorEffects] = useState(false);
  
  // Load tech icons and enable animations after brief delay
  useEffect(() => {
    // Load tech icons
    try {
      const icons = generateTechIcons();
      if (icons && icons.length > 0) {
        setTechIcons(icons.slice(0, 8)); // Limit to 8 icons maximum
      } else {
        // Fallback to minimal icons
        setTechIcons([
          { name: "react", x: 75, y: 20, src: "https://cdn.jsdelivr.net/gh/devicons/devicon/icons/react/react-original.svg" },
          { name: "typescript", x: 25, y: 65, src: "https://cdn.jsdelivr.net/gh/devicons/devicon/icons/typescript/typescript-original.svg" }
        ]);
      }
    } catch (error) {
      console.error("Error generating tech icons:", error);
      setTechIcons([
        { name: "react", x: 75, y: 20, src: "https://cdn.jsdelivr.net/gh/devicons/devicon/icons/react/react-original.svg" },
        { name: "typescript", x: 25, y: 65, src: "https://cdn.jsdelivr.net/gh/devicons/devicon/icons/typescript/typescript-original.svg" }
      ]);
    }
    
    // Stagger loading to improve initial performance
    // First load main content
    setTimeout(() => setAnimationsEnabled(true), 500);
    
    // Then enable cursor effects after everything else is loaded
    setTimeout(() => setShouldRenderCursorEffects(true), 1500);
  }, []);
  
  // Track mouse position using passive listener with improved performance
  useEffect(() => {
    const handleMouseMove = (e: MouseEvent) => {
      // Use direct update without state for maximum performance
      mousePositionRef.current = { x: e.clientX, y: e.clientY };
    };
    
    // Use passive listener for better performance
    window.addEventListener('mousemove', handleMouseMove, { passive: true });
    return () => window.removeEventListener('mousemove', handleMouseMove);
  }, []);
  
  // Text animation when in view
  useEffect(() => {
    if (isTextInView) {
      controls.start("visible");
    }
  }, [isTextInView, controls]);
  
  // Simplified text animation variants
  const textVariants = {
    hidden: { opacity: 0, y: 20 },
    visible: { 
      opacity: 1, 
      y: 0,
      transition: { duration: 0.7, ease: "easeOut" }
    },
  };
  
  // Use typewriter for introduction text
  const [text] = useTypewriter({
    words: [introduction],
    loop: 1,
    typeSpeed: 40,
    deleteSpeed: 20,
  });
  
  // Detect if we should use simpler animations (mobile or low-end devices)
  const isMobile = typeof window !== 'undefined' && window.innerWidth < 768;
  
  return (
    <section
      ref={heroRef}
      className="relative min-h-screen w-full flex items-center justify-center overflow-hidden bg-background pt-28 pb-20 px-4 sm:px-6 lg:px-8"
    >
      {/* Simplified background */}
      <MinimalBackground theme={theme} />
      
      {/* Cursor stars effect - only on non-mobile */}
      {shouldRenderCursorEffects && !isMobile && (
        <CursorStars mousePositionRef={mousePositionRef} />
      )}
      
      {/* Minimal blur effect */}
      {backgroundPattern && animationsEnabled && <SimpleBlur />}
      
      {/* Tech icons - only render when animations are enabled */}
      {animationsEnabled && techIcons.length > 0 && (
        <FloatingTechIcons 
          techIcons={techIcons} 
          mousePositionRef={mousePositionRef}
        />
      )}
      
      {/* Main content */}
      <div
        ref={textRef}
        className="relative z-10 max-w-4xl mx-auto text-center space-y-8 mt-10"
      >
        {/* Welcome badge */}
        <div 
          className="inline-block px-6 py-2 border border-primary/30 rounded-full text-sm font-medium text-primary dark:text-primary-foreground mb-4 backdrop-blur-sm relative overflow-hidden group hover:border-primary transition-colors duration-300"
        >
          <span className="mr-2 inline-block">👋</span>
          <span className="relative z-10 group-hover:text-primary transition-colors duration-300">Welcome to my portfolio</span>
        </div>
        
        {/* Name and title */}
        <div className="relative py-2">
          <h1 className="text-4xl md:text-5xl lg:text-6xl font-bold tracking-tight mb-2 relative">
            {name}
          </h1>
          <h2 className="text-lg md:text-xl lg:text-2xl text-muted-foreground font-medium relative">
            {title}
          </h2>
        </div>
        
        {/* Introduction text */}
        <p className="text-base md:text-lg text-muted-foreground max-w-2xl mx-auto mt-6 leading-relaxed">
          <span>{text}</span>
          <Cursor cursorStyle="●" cursorColor="#3b82f6" />
        </p>
        
        {/* Action buttons */}
        <div className="flex flex-col sm:flex-row gap-4 mt-8 justify-center mx-auto">
          <Button
            className="w-full sm:w-auto group relative overflow-hidden px-8 py-6 text-base sm:text-lg"
            size="lg"
            asChild
          >
            <Link href="#projects">
              <span className="relative z-10 flex items-center">
                Projects
                <ArrowRight size={18} className="ml-2" />
              </span>
            </Link>
          </Button>
          
          <Button
            variant="outline"
            className="w-full sm:w-auto group relative overflow-hidden px-8 py-6 text-base sm:text-lg"
            size="lg"
            asChild
          >
            <Link 
              href="/resume.pdf" 
              target="_blank"
            >
              <span className="relative z-10 flex items-center">
                Resume
                <Download size={18} className="ml-2" />
              </span>
            </Link>
          </Button>
        </div>
        
        {/* Scroll indicator */}
        <div className="flex justify-center mt-12 opacity-80">
          <div className="flex items-center gap-2 hover:text-primary transition-colors duration-300">
            <div className="h-10 w-[1px] bg-muted-foreground/50" />
            <span className="text-sm text-muted-foreground">Scroll Down</span>
          </div>
        </div>
      </div>
      
      {/* Add some global styles for animations */}
      <style>{`
        @keyframes float-slow {
          0%, 100% { transform: translateY(0) translateX(0); }
          50% { transform: translateY(-15px) translateX(15px); }
        }
        .animate-float-slow {
          animation: float-slow 15s ease-in-out infinite;
        }
      `}</style>
    </section>
  );
};

export default OptimizedHeroSection; 