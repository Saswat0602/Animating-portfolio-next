import { useEffect } from 'react';
import { gsap } from 'gsap';
import ScrollTrigger from 'gsap/ScrollTrigger';

/**
 * Custom hook to handle scroll-based animations using GSAP
 * @param options - Configuration options for animations
 */
export const useScrollAnimation = (options = {}) => {
  useEffect(() => {
    // Check for browser environment
    if (typeof window === 'undefined') return;
    
    // Register ScrollTrigger plugin
    gsap.registerPlugin(ScrollTrigger);
    
    // Basic animation setup for skill badges
    const skillsAnimation = () => {
      gsap.from(".skill-badge", {
        scrollTrigger: {
          trigger: "#skills-section",
          start: "top 80%",
          end: "bottom 60%",
          toggleActions: "play none none reverse",
        },
        y: 30,
        scale: 0.8,
        opacity: 0,
        duration: 0.5,
        stagger: 0.03,
        ease: "back.out(1.5)",
      });
    };

    // Animation for experience cards
    const experienceAnimation = () => {
      gsap.from(".experience-card", {
        scrollTrigger: {
          trigger: "#experience-section",
          start: "top 70%",
          end: "bottom 50%",
          toggleActions: "play none none reverse",
        },
        x: -20,
        y: 20,
        opacity: 0,
        scale: 0.95,
        duration: 0.6,
        stagger: 0.1,
        ease: "power2.out",
      });
    };

    // Animation for about section
    const aboutAnimation = () => {
      gsap.from("#about-section .content", {
        scrollTrigger: {
          trigger: "#about-section",
          start: "top 70%",
          end: "bottom 50%",
          toggleActions: "play none none reverse",
        },
        y: 20,
        opacity: 0,
        duration: 0.6,
        ease: "power2.out",
      });
    };

    // Run animations
    skillsAnimation();
    experienceAnimation();
    aboutAnimation();

    // Cleanup function
    return () => {
      // Clean up all ScrollTrigger instances to prevent memory leaks
      ScrollTrigger.getAll().forEach(trigger => trigger.kill());
      ScrollTrigger.clearMatchMedia();
    };
  }, [options]);
};

export default useScrollAnimation; 