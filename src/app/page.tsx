"use client";

import React, { useState, useEffect, useRef, lazy, Suspense } from "react";
import { useScroll } from "framer-motion";


const SkillsSection = lazy(() => import("../components/SkillsSection"));
const ExperienceSection = lazy(() => import("../components/ExperienceSection"));
import Navbar from "../components/Navbar";
const ProjectsSection = lazy(() => import('@/components/ProjectsSection'));
const ContactSection = lazy(() => import('@/components/ContactSection'));
const Footer = lazy(() => import('@/components/Footer'));
const HeroSection = lazy(() => import("../components/HeroSection"));
import StarryHeroBackground from "@/widget/StarryHeroBackground";
import { portfolioData } from "@/data/portFolioData";
import About from "@/components/About";
const BlurCanvas = ({ className }: { className?: string }) => {
  return (
    <div className={`absolute inset-0 -z-10 opacity-20 overflow-hidden ${className}`}>
      <svg width="100%" height="100%">
        <filter id="blurFilter" x="0" y="0">
          <feGaussianBlur in="SourceGraphic" stdDeviation="20" />
        </filter>
        <rect width="100%" height="100%" filter="url(#blurFilter)" fill="url(#gradient)" />
        <linearGradient id="gradient" x1="0%" y1="0%" x2="100%" y2="100%">
          <stop offset="0%" stopColor="var(--primary)" stopOpacity="0.1" />
          <stop offset="100%" stopColor="var(--background)" stopOpacity="0" />
        </linearGradient>
      </svg>
    </div>
  );
};

export default function Home() {
  const [isMounted, setIsMounted] = useState(false);
  const [isFullyLoaded, setIsFullyLoaded] = useState(false);

  const mainRef = useRef<HTMLElement>(null);
  const experienceSectionRef = useRef<HTMLDivElement>(null);
  const skillsSectionRef = useRef<HTMLDivElement>(null);

  useEffect(() => {
    const mountTimeout = setTimeout(() => {
      setIsMounted(true);
    }, 100);

    const loadTimeout = setTimeout(() => {
      setIsFullyLoaded(true);
    }, 300);

    return () => {
      clearTimeout(mountTimeout);
      clearTimeout(loadTimeout);
    };
  }, []);

  useEffect(() => {
    if (isFullyLoaded) {
      const initScrollAnimations = () => {
        try {
        } catch (error) {
          console.error('Error initializing scroll animations:', error);
        }
      };

      if (typeof window !== 'undefined' && 'requestIdleCallback' in window) {
        (window as any).requestIdleCallback(initScrollAnimations);
      } else {
        setTimeout(initScrollAnimations, 200);
      }
    }
  }, [isFullyLoaded]);

  const prefersReducedMotion = typeof window !== 'undefined'
    ? window.matchMedia('(prefers-reduced-motion: reduce)').matches
    : false;

  const { scrollYProgress } = useScroll();

  if (!isMounted) {
    return (
      <div className="fixed inset-0 bg-background flex flex-col items-center justify-center overflow-hidden">
        <div className="relative mb-8">
          <div className="text-4xl md:text-5xl font-bold relative z-10">
            <span className="text-primary animate-pulse">Saswat</span>
            <span className="text-foreground">.dev</span>
          </div>
          <div className="absolute -inset-6 bg-primary/5 rounded-full blur-xl animate-pulse"></div>
        </div>

        <div className="flex space-x-2 mb-8">
          {[0, 1, 2, 3, 4].map((i) => (
            <div
              key={i}
              className="w-3 h-3 rounded-full bg-primary"
              style={{
                animation: `bounceLoader 1.5s infinite ${i * 0.1}s`
              }}
            />
          ))}
        </div>

        <p className="text-sm text-muted-foreground animate-fadeIn">
          Loading amazing things...
        </p>

        <style>{`
          @keyframes bounceLoader {
            0%, 100% {
              transform: translateY(0);
              opacity: 0.3;
            }
            50% {
              transform: translateY(-12px);
              opacity: 1;
            }
          }
          
          @keyframes fadeIn {
            from {
              opacity: 0;
            }
            to {
              opacity: 0.7;
            }
          }
          
          .animate-fadeIn {
            animation: fadeIn 2s ease-in-out infinite alternate;
          }
        `}</style>
      </div>
    );
  }

  return (
    <main ref={mainRef} className="min-h-screen bg-background relative overflow-hidden">
      <Navbar />
      <StarryHeroBackground />
      <div
        className="fixed top-0 left-0 right-0 h-1 bg-primary z-50 origin-left will-change-transform"
        style={{ transform: `scaleX(${scrollYProgress.get()})` }}
      />

      <Suspense fallback={
        <div className="h-screen flex flex-col items-center justify-center">
          <div className="relative mb-4">
            <div className="text-xl font-semibold text-primary/80">
              Loading content...
            </div>
            <div className="absolute -inset-4 bg-primary/5 rounded-full blur-lg"></div>
          </div>
          <div className="flex space-x-1">
            {[0, 1, 2].map((i) => (
              <div
                key={i}
                className="w-2 h-2 rounded-full bg-primary/60"
                style={{
                  animation: `pulseLoad 1s infinite ${i * 0.15}s`
                }}
              />
            ))}
          </div>
          <style>{`
            @keyframes pulseLoad {
              0%, 100% {
                transform: scale(0.8);
                opacity: 0.5;
              }
              50% {
                transform: scale(1.2);
                opacity: 1;
              }
            }
          `}</style>
        </div>
      }>

        <HeroSection />

        <About aboutData={portfolioData.about} />

        <div id="projects">
          <ProjectsSection projects={portfolioData.projects} />
        </div>

        <div ref={skillsSectionRef}>
          <SkillsSection />
        </div>

        <div ref={experienceSectionRef}>
          <ExperienceSection id="experience-section" />
        </div>

        <ContactSection id="contact-section" />

        <Footer />
      </Suspense>

      {isFullyLoaded && !prefersReducedMotion && (
        <BlurCanvas className="hidden md:block" />
      )}
    </main>
  );
}
