"use client";

import React, { useEffect, useRef, useState } from 'react';
import { useTheme } from 'next-themes';

interface CustomCursorProps {
  enabled?: boolean;
}

const CustomCursor: React.FC<CustomCursorProps> = ({ enabled = true }) => {
  const cursorsRef = useRef<{
    outer: HTMLDivElement | null;
    inner: HTMLDivElement | null;
    initialized: boolean;
    isHovering: boolean;
    isClicked: boolean;
    lastRender: number;
  }>({
    outer: null,
    inner: null,
    initialized: false,
    isHovering: false,
    isClicked: false,
    lastRender: 0
  });
  
  const { theme } = useTheme();
  const [hidden, setHidden] = useState(false);
  
  // Check for mobile device
  const isMobile = typeof navigator !== 'undefined' && 
    /Android|webOS|iPhone|iPad|iPod|BlackBerry|IEMobile|Opera Mini/i.test(navigator.userAgent);

  // Check for reduced motion preference
  const prefersReducedMotion = typeof window !== 'undefined' &&
    window.matchMedia('(prefers-reduced-motion: reduce)').matches;

  // If mobile or disabled or prefers reduced motion, don't render anything
  if (isMobile || !enabled || prefersReducedMotion) return null;

  useEffect(() => {
    // Skip on SSR
    if (typeof window === 'undefined') return;
    
    // Direct DOM manipulation for maximum performance
    const setupCursor = () => {
      const cursorState = cursorsRef.current;
      if (!cursorState.outer || !cursorState.inner) return;
      
      // Cache DOM elements
      const outer = cursorState.outer;
      const inner = cursorState.inner;
      
      // Apply hardware acceleration
      outer.style.willChange = 'transform';
      inner.style.willChange = 'transform';
      
      // Initialize base styles
      outer.style.width = '40px';
      outer.style.height = '40px';
      outer.style.opacity = '0';
      
      // Higher contrast borders for both themes
      const isDark = document.documentElement.classList.contains('dark');
      outer.style.border = isDark 
        ? '1.5px solid rgba(255, 255, 255, 0.9)' 
        : '1.5px solid rgba(0, 0, 0, 0.9)';
      outer.style.backgroundColor = 'transparent';
      
      // Improve visibility in both modes
      inner.style.width = '10px';
      inner.style.height = '10px';
      inner.style.opacity = '0';
      inner.style.backgroundColor = isDark
        ? 'rgba(255, 255, 255, 1)'  // Full white for dark mode
        : 'rgba(0, 0, 0, 0.9)';     // Near black for light mode
      
      // For smooth animation
      let rafId: number | null = null;
      
      // More efficient mouse move handler with throttling
      const handleMouseMove = (e: MouseEvent) => {
        if (!outer || !inner) return;
        
        // Skip setState and directly modify DOM
        outer.style.opacity = '1';
        if (!cursorState.isHovering) {
          inner.style.opacity = '1';
        }
        
        // Use RAF to optimize rendering
        if (rafId) return; // Skip if we already have a frame pending
        
        rafId = requestAnimationFrame(() => {
          // Ensure elements still exist
          if (!outer || !inner) return;
          
          // Direct transform with GPU acceleration
          const outerSize = parseInt(outer.style.width) || 40;
          const innerSize = parseInt(inner.style.width) || 10;
          
          outer.style.transform = `translate3d(${e.clientX - outerSize / 2}px, ${e.clientY - outerSize / 2}px, 0)`;
          inner.style.transform = `translate3d(${e.clientX - innerSize / 2}px, ${e.clientY - innerSize / 2}px, 0)`;
          
          // Update CSS variables for other components - only every 4 frames for performance
          const now = performance.now();
          if (now - cursorState.lastRender > 64) { // ~16ms * 4 frames
            document.documentElement.style.setProperty('--mouse-x', `${e.clientX}px`);
            document.documentElement.style.setProperty('--mouse-y', `${e.clientY}px`);
            cursorState.lastRender = now;
          }
          
          rafId = null;
        });
      };
      
      const handleMouseDown = () => {
        if (!inner) return;
        cursorState.isClicked = true;
        inner.style.width = '5px';
        inner.style.height = '5px';
      };
      
      const handleMouseUp = () => {
        if (!inner) return;
        cursorState.isClicked = false;
        inner.style.width = '10px';
        inner.style.height = '10px';
      };
      
      // Use a shared hover handler with optimized element detection
      let isHovering = false;
      let hoverRafId: number | null = null;
      
      const handleHover = (e: MouseEvent) => {
        if (hoverRafId) return; // Throttle hover checks
        
        hoverRafId = requestAnimationFrame(() => {
          if (!outer || !inner) return;
          
          const target = e.target as HTMLElement;
          const isLink = 
            target.tagName === 'A' || 
            target.tagName === 'BUTTON' || 
            !!target.closest('a') ||
            !!target.closest('button') ||
            target.getAttribute('role') === 'button' ||
            target.classList.contains('clickable');
          
          // Only update styles when the hover state changes
          if (isLink !== isHovering) {
            isHovering = isLink;
            cursorState.isHovering = isLink;
            
            if (isLink) {
              outer.style.width = '70px';
              outer.style.height = '70px';
              inner.style.opacity = '0';
            } else {
              outer.style.width = '40px';
              outer.style.height = '40px';
              inner.style.opacity = '1';
            }
          }
          
          hoverRafId = null;
        });
      };
      
      // Add passive listeners for better performance
      document.addEventListener('mousemove', handleMouseMove, { passive: true });
      document.addEventListener('mousedown', handleMouseDown, { passive: true });
      document.addEventListener('mouseup', handleMouseUp, { passive: true });
      document.addEventListener('mouseover', handleHover, { passive: true });
      
      cursorState.initialized = true;
      
      return () => {
        // Clean up all resources
        if (rafId) cancelAnimationFrame(rafId);
        if (hoverRafId) cancelAnimationFrame(hoverRafId);
        document.removeEventListener('mousemove', handleMouseMove);
        document.removeEventListener('mousedown', handleMouseDown);
        document.removeEventListener('mouseup', handleMouseUp);
        document.removeEventListener('mouseover', handleHover);
      };
    };
    
    // Shorter delay to improve startup time
    const timer = setTimeout(setupCursor, 50);
    
    return () => {
      clearTimeout(timer);
    };
  }, []);

  useEffect(() => {
    if (!cursorsRef.current.initialized) return;
    
    // Define cursor styles - only apply when theme changes
    const cursorModifiers = {
      backgroundColor: theme === "dark" ? "rgba(255, 255, 255, 0.9)" : "rgba(0, 0, 0, 0.85)",
      borderColor: theme === "dark" ? "rgba(255, 255, 255, 0.35)" : "rgba(0, 0, 0, 0.5)",
      mixBlendMode: theme === "dark" ? "difference" : "normal",
    };
    
    // Apply styles to cursor elements
    if (cursorsRef.current.outer) {
      cursorsRef.current.outer.style.backgroundColor = cursorModifiers.backgroundColor;
      cursorsRef.current.outer.style.opacity = hidden ? "0" : "1";
    }
    
    if (cursorsRef.current.inner) {
      cursorsRef.current.inner.style.border = `1.5px solid ${cursorModifiers.borderColor}`;
      cursorsRef.current.inner.style.opacity = hidden ? "0" : "1";
      cursorsRef.current.inner.style.mixBlendMode = cursorModifiers.mixBlendMode;
    }
  }, [hidden, theme]);

  return (
    <>
      <div 
        ref={ref => { cursorsRef.current.outer = ref; }}
        className="fixed top-0 left-0 pointer-events-none z-[9999] rounded-full will-change-transform"
        style={{ transition: 'width 0.15s, height 0.15s, opacity 0.1s' }}
      />
      
      <div
        ref={ref => { cursorsRef.current.inner = ref; }}
        className="fixed top-0 left-0 pointer-events-none z-[9999] rounded-full will-change-transform"
        style={{ transition: 'width 0.15s, height 0.15s, opacity 0.1s' }}
      />

      <style jsx global>{`
        body {
          cursor: ${enabled ? 'none' : 'auto'};
        }
        
        a, button, [role="button"], input, textarea, select, details summary, [data-cursor], .clickable {
          cursor: ${enabled ? 'none' : 'pointer'};
        }
      `}</style>
    </>
  );
};

export default CustomCursor;