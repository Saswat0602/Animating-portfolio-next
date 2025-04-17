import { useState, useEffect } from 'react';

/**
 * Custom hook that tracks the scroll progress of an element
 * @param ref - React ref to the DOM element to track
 * @returns scroll progress from 0 to 1
 */
export const useElementScroll = (ref: React.RefObject<HTMLElement>) => {
  const [scroll, setScroll] = useState(0);

  useEffect(() => {
    if (!ref.current) return;

    const handleScroll = () => {
      if (!ref.current) return;
      
      const element = ref.current;
      const scrollTop = window.scrollY;
      const offsetTop = element.getBoundingClientRect().top + window.scrollY;
      const height = element.offsetHeight;
      
      // Calculate scroll progress percentage
      let progress = (scrollTop - offsetTop + window.innerHeight/2) / (height - window.innerHeight/2);
      progress = Math.min(Math.max(progress, 0), 1);
      
      setScroll(progress);
    };
    
    window.addEventListener('scroll', handleScroll, { passive: true });
    handleScroll(); // Initialize on mount
    
    return () => {
      window.removeEventListener('scroll', handleScroll);
    };
  }, [ref]);
  
  return scroll;
};

export default useElementScroll; 