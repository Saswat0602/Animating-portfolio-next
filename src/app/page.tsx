"use client";

import React, { useState, useEffect, useRef, lazy, Suspense } from "react";
import {
  motion,
  useScroll,
  useSpring,
  useTransform,
} from "framer-motion";
import { gsap } from "gsap";

// Import custom hooks
import useElementScroll from '../hooks/useElementScroll';
import useScrollAnimation from '../hooks/useScrollAnimation';

// Import components
const OptimizedHeroSection = lazy(() => import("../components/OptimizedHeroSection"));
const SkillsSection = lazy(() => import("../components/SkillsSection"));
const ExperienceSection = lazy(() => import("../components/ExperienceSection"));
import Navbar from "../components/Navbar";
const ProjectsSection = lazy(() => import('@/components/ProjectsSection'));
const ContactSection = lazy(() => import('@/components/ContactSection'));
const Footer = lazy(() => import('@/components/Footer'));

// Blur canvas component for background effects
const BlurCanvas = ({className}: {className?: string}) => {
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
  
  // Setup references
  const mainRef = useRef<HTMLElement>(null);
  const experienceSectionRef = useRef<HTMLDivElement>(null);
  const skillsSectionRef = useRef<HTMLDivElement>(null);
  const aboutSectionRef = useRef<HTMLDivElement>(null);
  
  // Initialize only critical components immediately, defer the rest
  useEffect(() => {
    // Basic content becomes visible quickly
    const mountTimeout = setTimeout(() => {
      setIsMounted(true);
    }, 100);
    
    // Defer full loading to improve perceived performance
    const loadTimeout = setTimeout(() => {
      setIsFullyLoaded(true);
    }, 300);
    
    return () => {
      clearTimeout(mountTimeout);
      clearTimeout(loadTimeout);
    };
  }, []);

  // Initialize scroll animations only when fully loaded
  useEffect(() => {
    if (isFullyLoaded) {
      // Initialize scroll animations after full load
      const initScrollAnimations = () => {
        try {
          // Add optimized scroll animation initialization here if needed
        } catch (error) {
          console.error('Error initializing scroll animations:', error);
        }
      };
      
      // Use requestIdleCallback for non-critical operations
      if (typeof window !== 'undefined' && 'requestIdleCallback' in window) {
        (window as any).requestIdleCallback(initScrollAnimations);
      } else {
        setTimeout(initScrollAnimations, 200);
      }
    }
  }, [isFullyLoaded]);
  
  // Optimize animation performance with reduced motion when possible
  const prefersReducedMotion = typeof window !== 'undefined' 
    ? window.matchMedia('(prefers-reduced-motion: reduce)').matches 
    : false;
  
  // Setup all Framer Motion animations with optimized settings
  const { scrollYProgress } = useScroll();
  const smoothProgress = useSpring(scrollYProgress, { 
    stiffness: prefersReducedMotion ? 170 : 100, 
    damping: prefersReducedMotion ? 40 : 30, 
    restDelta: 0.001 
  });
  const progressOpacity = useTransform(smoothProgress, [0, 0.05], [1, 0]);

  // Use custom hook for experience section scroll progress - always call the hook
  const experienceScroll = useElementScroll(experienceSectionRef);
  // Then conditionally use the result if needed
  const experienceScrollProgress = isMounted ? experienceScroll : 0;

  // Portfolio data
  const portfolioData = {
    name: "Saswat Ranjan",
    location: "Bhubaneswar, Odisha, India",
    title: "MERN/Front-End Developer",
    introduction:
      "Hi, I'm Saswat Ranjan. A passionate Front-end React Developer & MERN stack Developer based in Bhubaneswar.",
    about: {
      current_position: "Software Development Engineer I (SDE 1) at HyScaler",
      education: {
        postgraduate:
          "MCA from United School of Business Management, Bhubaneswar",
        undergraduate: "BSc from Utkal University",
      },
      skills: [
        "HTML",
        "CSS",
        "JavaScript",
        "React",
        "React Native",
        "Node.js",
        "Express.js",
        "MongoDB",
        "Git",
        "GitHub",
        "Tailwind",
        "Bootstrap",
        "Java (SE)",
        "C",
      ],
      description:
        "I'm a Software Development Engineer (SDE 1) at HyScaler, specializing in React, React Native, and Node.js. With a Master's in Computer Applications,",
      description2:
        "I focus on building responsive UIs and backend solutions. I'm passionate about continuous learning and keeping up with industry trends..",
      location: "Bhubaneswar, Odisha, India",
      email: "contact@saswatmohanty.com",
    },
    projects: [
      { 
        project_name: "Yelp-Camp", 
        code_link: "https://github.com/...",
        description: "A full-stack web application inspired by Yelp but focused on camping sites, allowing users to discover, review, and share camping experiences.",
        technologies: ["Node.js", "Express", "MongoDB", "Bootstrap", "EJS"],
        demo_link: "https://yelp-camp-demo.example.com"
      },
      {
        project_name: "Spotify-Music-App",
        code_link: "https://github.com/...",
        description: "A Spotify-inspired music application with playlist creation, music discovery, and personalized recommendations.",
        technologies: ["React", "Redux", "Node.js", "Express", "Spotify API"],
        demo_link: "https://spotify-clone.example.com"
      },
      { 
        project_name: "Movie-App", 
        code_link: "https://github.com/...",
        description: "A responsive movie discovery platform that allows users to browse trending films, search by categories, and save favorites.",
        technologies: ["React", "CSS", "TMDB API", "Context API"],
        demo_link: "https://movie-app.example.com"
      },
      { 
        project_name: "Zoom-Clone-App", 
        code_link: "https://github.com/...",
        description: "A video conferencing application with real-time communication capabilities, chat functionality, and screen sharing.",
        technologies: ["WebRTC", "Socket.io", "Node.js", "Express"]
      },
      { 
        project_name: "Note-Taker", 
        code_link: "https://github.com/...",
        description: "A simple yet powerful note-taking application with markdown support, tags, and search functionality.",
        technologies: ["React", "LocalStorage", "Markdown", "CSS"]
      },
      {
        project_name: "Food-Ordering-App",
        code_link: "https://github.com/...",
        description: "An online food ordering platform with restaurant listings, menu browsing, cart management, and order tracking.",
        technologies: ["React", "Node.js", "MongoDB", "Express", "Stripe"]
      },
    ],
    experience: [
      {
        role: "Software Development Engineer 1",
        company: "HyScaler",
        period: "Apr 2025 - present",
        description:
          "Working on React Native, and developing multiple web and mobile/Web applications.",
        skills: ["Django REST Framework", "React Native", "Swift"],
      },
      {
        role: "Junior Software Developer",
        company: "HyScaler",
        period: "Apr 2024 - Apr 2025",
        description:
          "Working on Django REST Framework, React Native, and developing multiple web and mobile applications.",
        skills: ["Django REST Framework", "React Native", "+5 skills"],
      },
      {
        role: "Apprentice Trainee",
        company: "HyScaler",
        period: "Aug 2023 - Mar 2024 (8 mos)",
        description:
          "Gaining hands-on experience in React.js, React Native, and other web technologies.",
        skills: ["React.js", "React Native", "+4 skills"],
      },
    ],
    contact: {
      message:
        "Feel free to contact with me. Let's Talk. Don't wish for it! Work for it!",
    },
  };

  // Simple loading spinner
  if (!isMounted) {
    return (
      <div className="fixed inset-0 bg-background flex flex-col items-center justify-center overflow-hidden">
        {/* Logo animation */}
        <div className="relative mb-8">
          <div className="text-4xl md:text-5xl font-bold relative z-10">
            <span className="text-primary animate-pulse">Saswat</span>
            <span className="text-foreground">.dev</span>
          </div>
          <div className="absolute -inset-6 bg-primary/5 rounded-full blur-xl animate-pulse"></div>
        </div>
        
        {/* Animated loader */}
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
        
        {/* Loading text */}
        <p className="text-sm text-muted-foreground animate-fadeIn">
          Loading amazing things...
        </p>
        
        {/* Add loading animation keyframes */}
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

      {/* Simplified scroll indicator - using transform for better performance */}
      <div 
        className="fixed top-0 left-0 right-0 h-1 bg-primary z-50 origin-left will-change-transform" 
        style={{ transform: `scaleX(${scrollYProgress.get()})` }}
      />

      {/* Wrap lazy-loaded components in Suspense */}
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
        {/* Hero Section */}
        <OptimizedHeroSection
          name={portfolioData.name}
          title={portfolioData.title}
          introduction={portfolioData.introduction}
        />

        {/* About Section - with optimized animations */}
        <section
          id="about-section"
          ref={aboutSectionRef}
          className="py-20 px-4 md:px-8 lg:px-16 relative"
        >
          <div className="max-w-6xl mx-auto">
            <motion.div
              initial={{ opacity: 0, y: 20 }}
              whileInView={{ opacity: 1, y: 0 }}
              transition={{ duration: 0.3 }}
              viewport={{ once: true, margin: "-50px" }}
              className="mb-12 text-center"
            >
              <h2 className="text-3xl md:text-4xl font-bold mb-4 hover-text">About Me</h2>
              <motion.div 
                className="w-20 h-1 bg-primary mx-auto will-change-transform"
                initial={{ width: 0 }}
                whileInView={{ width: 80 }}
                transition={{ duration: 0.4, ease: "easeOut" }}
                viewport={{ once: true, margin: "-50px" }}
              />
            </motion.div>

            <div className="grid grid-cols-1 md:grid-cols-2 gap-12 items-center content">
              <motion.div
                initial={{ opacity: 0, x: -50 }}
                whileInView={{ opacity: 1, x: 0 }}
                transition={{ duration: 0.5, delay: 0.2 }}
                viewport={{ once: true }}
                className="relative"
              >
                <div className="relative overflow-hidden rounded-lg border-4 border-primary/20 shadow-xl">
                  <img
                    src="https://images.unsplash.com/photo-1517694712202-14dd9538aa97?w=800&q=80"
                    alt="Laptop with code"
                    className="w-full h-auto object-cover"
                  />
                  <div className="absolute inset-0 bg-gradient-to-t from-black/60 to-transparent"></div>
                </div>
                <motion.div 
                  className="absolute -bottom-6 -right-6 w-32 h-32 bg-primary/10 rounded-full blur-2xl"
                  initial={{ scale: 0 }}
                  whileInView={{ scale: 1 }}
                  transition={{ duration: 0.5, delay: 0.3 }}
                  viewport={{ once: true }}
                />
                <motion.div 
                  className="absolute -top-6 -left-6 w-32 h-32 bg-primary/10 rounded-full blur-2xl"
                  initial={{ scale: 0 }}
                  whileInView={{ scale: 1 }}
                  transition={{ duration: 0.5, delay: 0.4 }}
                  viewport={{ once: true }}
                />
              </motion.div>

              <motion.div
                initial={{ opacity: 0, x: 50 }}
                whileInView={{ opacity: 1, x: 0 }}
                transition={{ duration: 0.5, delay: 0.4 }}
                viewport={{ once: true }}
              >
                <motion.h3 
                  className="text-2xl font-bold mb-4 hover-text"
                  whileHover={{ x: 5 }}
                  transition={{ type: "spring", stiffness: 300, damping: 10 }}
                >
                  {portfolioData.about.current_position}
                </motion.h3>
                <motion.p 
                  className="text-muted-foreground mb-4 hover-text"
                  whileHover={{ opacity: 1 }}
                  initial={{ opacity: 0.8 }}
                  transition={{ duration: 0.2 }}
                >
                  {portfolioData.about.description}
                </motion.p>
                <motion.p 
                  className="text-muted-foreground mb-6 hover-text"
                  whileHover={{ opacity: 1 }}
                  initial={{ opacity: 0.8 }}
                  transition={{ duration: 0.2 }}
                >
                  {portfolioData.about.description2}
                </motion.p>

                <div className="space-y-4">
                  <div className="flex items-start">
                    <motion.div 
                      className="mr-3 text-primary"
                      whileHover={{ rotate: 360, scale: 1.2 }}
                      transition={{ duration: 0.5 }}
                    >
                      <svg
                        xmlns="http://www.w3.org/2000/svg"
                        width="24"
                        height="24"
                        viewBox="0 0 24 24"
                        fill="none"
                        stroke="currentColor"
                        strokeWidth="2"
                        strokeLinecap="round"
                        strokeLinejoin="round"
                      >
                        <path d="M20 10c0 6-8 12-8 12s-8-6-8-12a8 8 0 0 1 16 0Z" />
                        <circle cx="12" cy="10" r="3" />
                      </svg>
                    </motion.div>
                    <div>
                      <motion.h4 
                        className="font-medium hover-text"
                        whileHover={{ x: 3 }}
                        transition={{ type: "spring", stiffness: 400, damping: 10 }}
                      >
                        Location
                      </motion.h4>
                      <motion.p 
                        className="text-muted-foreground hover-text"
                        whileHover={{ color: "var(--primary)" }}
                        transition={{ duration: 0.2 }}
                      >
                        {portfolioData.about.location}
                      </motion.p>
                    </div>
                  </div>

                  <div className="flex items-start">
                    <motion.div 
                      className="mr-3 text-primary"
                      whileHover={{ rotate: 360, scale: 1.2 }}
                      transition={{ duration: 0.5 }}
                    >
                      <svg
                        xmlns="http://www.w3.org/2000/svg"
                        width="24"
                        height="24"
                        viewBox="0 0 24 24"
                        fill="none"
                        stroke="currentColor"
                        strokeWidth="2"
                        strokeLinecap="round"
                        strokeLinejoin="round"
                      >
                        <path d="M22 16.92v3a2 2 0 0 1-2.18 2 19.79 19.79 0 0 1-8.63-3.07 19.5 19.5 0 0 1-6-6 19.79 19.79 0 0 1-3.07-8.67A2 2 0 0 1 4.11 2h3a2 2 0 0 1 2 1.72 12.84 12.84 0 0 0 .7 2.81 2 2 0 0 1-.45 2.11L8.09 9.91a16 16 0 0 0 6 6l1.27-1.27a2 2 0 0 1 2.11-.45 12.84 12.84 0 0 0 2.81.7A2 2 0 0 1 22 16.92z" />
                      </svg>
                    </motion.div>
                    <div>
                      <motion.h4 
                        className="font-medium hover-text"
                        whileHover={{ x: 3 }}
                        transition={{ type: "spring", stiffness: 400, damping: 10 }}
                      >
                        Education
                      </motion.h4>
                      <motion.p 
                        className="text-muted-foreground hover-text"
                        whileHover={{ color: "var(--primary)" }}
                        transition={{ duration: 0.2 }}
                      >
                        {portfolioData.about.education.postgraduate}
                      </motion.p>
                      <motion.p 
                        className="text-muted-foreground hover-text"
                        whileHover={{ color: "var(--primary)" }}
                        transition={{ duration: 0.2 }}
                      >
                        {portfolioData.about.education.undergraduate}
                      </motion.p>
                    </div>
                  </div>

                  <div className="flex items-start">
                    <motion.div 
                      className="mr-3 text-primary"
                      whileHover={{ rotate: 360, scale: 1.2 }}
                      transition={{ duration: 0.5 }}
                    >
                      <svg
                        xmlns="http://www.w3.org/2000/svg"
                        width="24"
                        height="24"
                        viewBox="0 0 24 24"
                        fill="none"
                        stroke="currentColor"
                        strokeWidth="2"
                        strokeLinecap="round"
                        strokeLinejoin="round"
                      >
                        <path d="M22 13a10 10 0 0 1-20 0c0-7 10-12 10-12s10 5 10 12z" />
                        <path d="M14.6 8.5a4.2 4.2 0 0 0-4.2 0A4.2 4.2 0 0 0 8 12a4.2 4.2 0 0 0 2.4 3.5a4.2 4.2 0 0 0 4.2 0a4.2 4.2 0 0 0 2.4-3.5a4.2 4.2 0 0 0-2.4-3.5z" />
                      </svg>
                    </motion.div>
                    <div>
                      <motion.h4 
                        className="font-medium hover-text"
                        whileHover={{ x: 3 }}
                        transition={{ type: "spring", stiffness: 400, damping: 10 }}
                      >
                        Email
                      </motion.h4>
                      <motion.p 
                        className="text-muted-foreground hover-text"
                        whileHover={{ color: "var(--primary)" }}
                        transition={{ duration: 0.2 }}
                      >
                        {portfolioData.about.email}
                      </motion.p>
                    </div>
                  </div>
                </div>
              </motion.div>
            </div>
          </div>
        </section>

        {/* Projects section */}
        <div id="projects">
          <ProjectsSection projects={portfolioData.projects} />
        </div>

        {/* Skills section */}
        <div ref={skillsSectionRef}>
          <SkillsSection />
        </div>

        {/* Experience section */}
        <div ref={experienceSectionRef}>
          <ExperienceSection id="experience-section" />
        </div>

        {/* Contact section */}
        <ContactSection id="contact-section" />

        {/* Footer */}
        <Footer />
      </Suspense>

      {/* Background effects - only shown on larger screens and when fully loaded */}
      {isFullyLoaded && !prefersReducedMotion && (
        <BlurCanvas className="hidden md:block" />
      )}
    </main>
  );
}
