"use client";

import React, { useEffect, useRef, useState, useMemo } from "react";
import {
  motion,
  useAnimation,
  useInView as framerUseInView,
} from "framer-motion";
import { useTheme } from 'next-themes';
import { generateTechIcons, TechIcon } from "@/data/techIconsData";
import StarryHeroBackground from "@/widget/StarryHeroBackground";
import DayTimeParticles from "@/widget/DayTimeParticles";
import ActionButtons from "@/widget/ActionButtons";
import FloatingTechIcons from "@/widget/FloatingTechIcons";
import Meteor from "@/widget/Meteor";
import NameAndTitle from "@/widget/NameAndTitle";
import Particle from "@/widget/Particle";
import ParallaxLayer from "@/widget/ParallaxLayer";
import IntroText from "@/widget/IntroText";

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

const HeroSection = ({
  name = 'Saswat Ranjan',
  title = 'MERN/APP Developer',
  introduction = "Hi, I'm Saswat Ranjan. SDE-1",
  backgroundPattern = true,
}: HeroSectionProps) => {
  const { theme } = useTheme();
  const heroRef = useRef<HTMLDivElement>(null);
  const textRef = useRef<HTMLDivElement>(null);
  const patternRef = useRef<HTMLDivElement>(null);
  const projectBtnRef = useRef<HTMLButtonElement>(null);
  const resumeBtnRef = useRef<HTMLAnchorElement>(null);
  const controls = useAnimation();
  const mousePositionRef = useRef<MousePosition>({ x: 0, y: 0 });

  const [techIcons, setTechIcons] = useState<TechIcon[]>([]);
  const [animationsEnabled, setAnimationsEnabled] = useState(false);

  const isTextInView = framerUseInView(textRef, { once: false, amount: 0.3 });

  useEffect(() => {
    // Load icons
    try {
      const icons = generateTechIcons();
      if (icons?.length) {
        setTechIcons(icons);
      } else throw new Error('Empty icons array');
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

    // Delay animations
    const timer = setTimeout(() => {
      setAnimationsEnabled(true);
    }, 800);

    // Mouse tracking + magnetic effect
    const handleMouseMove = (e: MouseEvent) => {
      mousePositionRef.current = { x: e.clientX, y: e.clientY };
    };

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

    window.addEventListener('mousemove', handleMouseMove, { passive: true });
    const cleanupProject = applyMagneticEffect(projectBtnRef);
    const cleanupResume = applyMagneticEffect(resumeBtnRef);

    return () => {
      clearTimeout(timer);
      window.removeEventListener('mousemove', handleMouseMove);
      cleanupProject?.();
      cleanupResume?.();
    };
  }, []);

  useEffect(() => {
    if (isTextInView) controls.start('visible');
  }, [isTextInView, controls]);

  // Text animation variants
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
    return Array.from({ length: 100 }, () => ({
      posX: Math.random() * 100,
      posY: Math.random() * 100,
      size: Math.random() * 2,
      color: `#fff`,
    }));
  }, []);


  return (
    <section
      ref={heroRef}
      className="relative min-h-screen w-full flex items-center justify-center overflow-hidden bg-background py-20 px-4 sm:px-6 lg:px-8"
    >
      {animationsEnabled && theme === 'dark' && (
        <ParallaxLayer strength={10}>
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
            {Array.from({ length: 12 }).map((_, i) => (
              <Meteor
                key={i}
                left={`${Math.random() * 100}%`}
                delay={Math.random() * 5}
                height={Math.random() * 40 + 30}
                width={1}
              />
            ))}
          </div>
        </ParallaxLayer>

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
        <ParallaxLayer strength={10}>

          <FloatingTechIcons
            techIcons={techIcons}
            mousePositionRef={mousePositionRef}
          />
        </ParallaxLayer>

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




export default HeroSection;