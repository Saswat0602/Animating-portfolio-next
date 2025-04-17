"use client";

import React, { useEffect, useState, useRef } from 'react';
import { motion, useAnimationControls } from 'framer-motion';

const BigGlowingStar: React.FC = () => {
  const [stars, setStars] = useState<Array<{id: number, size: number, x: number, y: number, delay: number}>>([]);
  const intervalRef = useRef<NodeJS.Timeout>();
  const controls = useAnimationControls();
  
  // Create a new star at a random position
  const createStar = () => {
    const id = Date.now();
    const size = Math.random() * 150 + 100; // 100-250px
    const x = Math.random() * 100;
    const y = Math.random() * 100;
    const delay = Math.random() * 2;
    
    // Add the new star
    setStars(prev => [...prev.slice(-4), { id, size, x, y, delay }]); // Keep only the 5 most recent stars
    
    // Animate the star
    controls.start({
      opacity: [0, 0.4, 0],
      scale: [0.3, 1.5, 0.3],
      transition: {
        duration: 8,
        ease: "easeInOut"
      }
    });
  };
  
  useEffect(() => {
    // Create first star immediately
    createStar();
    
    // Create new stars periodically
    intervalRef.current = setInterval(() => {
      createStar();
    }, 12000); // Every 12 seconds
    
    return () => {
      if (intervalRef.current) {
        clearInterval(intervalRef.current);
      }
    };
  }, []);
  
  return (
    <>
      {stars.map(star => (
        <motion.div
          key={star.id}
          className="big-glow-star"
          style={{
            width: star.size,
            height: star.size,
            left: `${star.x}%`,
            top: `${star.y}%`,
          }}
          initial={{ opacity: 0, scale: 0.3 }}
          animate={{
            opacity: [0, 0.4, 0],
            scale: [0.3, 1.5, 0.3],
          }}
          transition={{
            duration: 8,
            ease: "easeInOut",
            delay: star.delay
          }}
        />
      ))}
    </>
  );
};

export default BigGlowingStar; 