"use client";

import React, { useEffect, useRef } from 'react';
import { useTheme } from 'next-themes';

interface CustomCursorProps {
  enabled?: boolean;
}

const CustomCursor: React.FC<CustomCursorProps> = ({ enabled = true }) => {
  // Check for mobile device - skip on mobile
  const isMobile = typeof navigator !== 'undefined' && 
    /Android|webOS|iPhone|iPad|iPod|BlackBerry|IEMobile|Opera Mini/i.test(navigator.userAgent);

  // Check for reduced motion preference - skip if reduced motion
  const prefersReducedMotion = typeof window !== 'undefined' &&
    window.matchMedia('(prefers-reduced-motion: reduce)').matches;

  // If mobile or disabled or prefers reduced motion, don't render anything
  if (isMobile || !enabled || prefersReducedMotion) return null;

  // Use refs for direct DOM manipulation
  const cursorOuterRef = useRef<HTMLDivElement>(null);
  const cursorInnerRef = useRef<HTMLDivElement>(null);
  const { resolvedTheme } = useTheme();

  useEffect(() => {
    // Skip on SSR
    if (typeof window === 'undefined') return;
    
    // Get the cursor elements
    const cursorOuter = cursorOuterRef.current;
    const cursorInner = cursorInnerRef.current;
    if (!cursorOuter || !cursorInner) return;
    
    // Initialize cursor
    cursorOuter.style.opacity = '0';
    cursorInner.style.opacity = '0';
    
    // Simple non-throttled mouse move handler
    const handleMouseMove = (e: MouseEvent) => {
      if (!cursorOuter || !cursorInner) return;
      
      // Set opacity once visible
      if (cursorOuter.style.opacity === '0') {
        cursorOuter.style.opacity = '1';
        cursorInner.style.opacity = '1';
      }
      
      // Simple positioning
      cursorOuter.style.left = `${e.clientX}px`;
      cursorOuter.style.top = `${e.clientY}px`;
      cursorInner.style.left = `${e.clientX}px`;
      cursorInner.style.top = `${e.clientY}px`;
    };
    
    // Add event listener
    document.addEventListener('mousemove', handleMouseMove);
    
    // Cleanup
    return () => {
      document.removeEventListener('mousemove', handleMouseMove);
    };
  }, []);

  return (
    <>
      {/* Outer circle */}
      <div 
        ref={cursorOuterRef}
        className="fixed top-0 left-0 pointer-events-none z-[9999] -translate-x-1/2 -translate-y-1/2"
        style={{
          width: '24px',
          height: '24px',
          borderRadius: '50%',
          border: `1px solid ${resolvedTheme === 'dark' ? 'rgba(255, 255, 255, 0.5)' : 'rgba(0, 0, 0, 0.5)'}`,
          transition: 'opacity 0.2s, width 0.2s, height 0.2s',
        }}
      />
      
      {/* Inner dot */}
      <div
        ref={cursorInnerRef}
        className="fixed top-0 left-0 pointer-events-none z-[10000] -translate-x-1/2 -translate-y-1/2"
        style={{
          width: '4px',
          height: '4px',
          borderRadius: '50%',
          backgroundColor: resolvedTheme === 'dark' ? 'rgba(255, 255, 255, 0.9)' : 'rgba(0, 0, 0, 0.9)',
          transition: 'opacity 0.2s',
        }}
      />

      <style>{`
        body {
          cursor: ${enabled ? 'none' : 'auto'};
        }
        
        a, button, [role="button"], input, textarea, select, .clickable {
          cursor: ${enabled ? 'none' : 'pointer'};
        }
      `}</style>
    </>
  );
};

export default CustomCursor;