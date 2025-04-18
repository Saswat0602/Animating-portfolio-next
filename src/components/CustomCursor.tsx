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
  const cursorDotRef = useRef<HTMLDivElement>(null);
  const { resolvedTheme } = useTheme();

  useEffect(() => {
    // Skip on SSR
    if (typeof window === 'undefined') return;
    
    // Get the cursor element
    const cursor = cursorDotRef.current;
    if (!cursor) return;
    
    // Initialize cursor
    cursor.style.opacity = '0';
    
    // Simple non-throttled mouse move handler
    const handleMouseMove = (e: MouseEvent) => {
      if (!cursor) return;
      
      // Set opacity once visible
      if (cursor.style.opacity === '0') {
        cursor.style.opacity = '1';
      }
      
      // Simple positioning
      cursor.style.left = `${e.clientX}px`;
      cursor.style.top = `${e.clientY}px`;
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
      <div 
        ref={cursorDotRef}
        className="fixed top-0 left-0 pointer-events-none z-[9999] -translate-x-1/2 -translate-y-1/2"
        style={{
          width: '8px',
          height: '8px',
          borderRadius: '50%',
          backgroundColor: resolvedTheme === 'dark' ? 'rgba(255, 255, 255, 0.7)' : 'rgba(0, 0, 0, 0.7)',
          transition: 'opacity 0.2s',
        }}
      />

      <style jsx global>{`
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