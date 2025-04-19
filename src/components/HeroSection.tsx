"use client";

import React, { useEffect, useRef, useState, useMemo } from "react";
import {
  motion,
  useAnimation,
  useInView as framerUseInView,
} from "framer-motion";
import { useTheme } from 'next-themes';
import { throttle } from "lodash";
import { generateTechIcons, TechIcon } from "@/data/techIconsData";
import StarryHeroBackground from "@/widget/StarryHeroBackground";
import DayTimeParticles from "@/widget/DayTimeParticles";
import ActionButtons from "@/widget/ActionButtons";
import FloatingTechIcons from "@/widget/FloatingTechIcons";

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

  const calculateTransform = (mousePosition: { x: number, y: number }, intensity: number, delay: number): TransformObject => {
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


export default HeroSection;