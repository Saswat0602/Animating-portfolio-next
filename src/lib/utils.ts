import { type ClassValue, clsx } from "clsx";
import { twMerge } from "tailwind-merge";

export function cn(...inputs: ClassValue[]) {
  return twMerge(clsx(inputs));
}

// Debounce function for better performance with events like resize, scroll, etc.
export function debounce<T extends (...args: any[]) => any>(
  func: T, 
  wait: number
): (...args: Parameters<T>) => void {
  let timeout: NodeJS.Timeout | null = null;
  
  return function(this: any, ...args: Parameters<T>) {
    const later = () => {
      timeout = null;
      func.apply(this, args);
    };
    
    if (timeout) clearTimeout(timeout);
    timeout = setTimeout(later, wait);
  };
}

// Throttle function for limiting execution frequency (better for mousemove)
export function throttle<T extends (...args: any[]) => any>(
  func: T,
  limit: number
): (...args: Parameters<T>) => void {
  let lastFunc: NodeJS.Timeout;
  let lastRan: number = 0;
  
  return function(this: any, ...args: Parameters<T>) {
    const context = this;
    const now = Date.now();
    
    if (now - lastRan >= limit) {
      func.apply(context, args);
      lastRan = now;
    } else {
      clearTimeout(lastFunc);
      lastFunc = setTimeout(() => {
        if (Date.now() - lastRan >= limit) {
          func.apply(context, args);
          lastRan = Date.now();
        }
      }, limit - (now - lastRan));
    }
  };
}

// Defer non-critical operations to improve initial load time
export function defer(func: () => void, delay: number = 100): void {
  if (typeof window !== 'undefined') {
    if ('requestIdleCallback' in window) {
      (window as any).requestIdleCallback(() => setTimeout(func, delay));
    } else {
      setTimeout(func, delay);
    }
  }
}

// Preload images to prevent flickering when they're needed
export function preloadImages(urls: string[]): Promise<any[]> {
  if (typeof window === 'undefined') return Promise.resolve([]);
  
  const promises = urls.map(url => {
    return new Promise((resolve, reject) => {
      const img = new Image();
      img.src = url;
      img.onload = () => resolve(url);
      img.onerror = () => reject(new Error(`Failed to load image: ${url}`));
    });
  });
  
  return Promise.all(promises);
}

// Check if device is high-end for enabling complex animations
export function isHighEndDevice(): boolean {
  if (typeof window === 'undefined') return false;
  
  // Use device memory API if available (Chrome only)
  const memory = (navigator as any).deviceMemory || 4;
  const cpuCores = navigator.hardwareConcurrency || 4;
  
  return memory >= 4 && cpuCores >= 4;
}

// RAF-based timeout for smoother animations
export function rafTimeout(callback: () => void, delay: number): () => void {
  const start = performance.now();
  let rafId: number;
  
  function checkTime(timestamp: number) {
    const elapsed = timestamp - start;
    if (elapsed >= delay) {
      callback();
    } else {
      rafId = requestAnimationFrame(checkTime);
    }
  }
  
  rafId = requestAnimationFrame(checkTime);
  
  return () => cancelAnimationFrame(rafId);
}
