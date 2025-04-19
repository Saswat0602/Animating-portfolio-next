// components/ParallaxLayer.tsx
"use client";

import { motion, useMotionValue, useTransform } from "framer-motion";
import { useEffect } from "react";

interface ParallaxLayerProps {
  children: React.ReactNode;
  strength?: number;
  className?: string;
}

const ParallaxLayer = ({ children, strength = 20, className }: ParallaxLayerProps) => {
  const mouseX = useMotionValue(0);
  const mouseY = useMotionValue(0);

  const x = useTransform(mouseX, (v) => (window.innerWidth / 2 - v) / strength);
  const y = useTransform(mouseY, (v) => (window.innerHeight / 2 - v) / strength);

  useEffect(() => {
    const handleMouseMove = (e: MouseEvent) => {
      mouseX.set(e.clientX);
      mouseY.set(e.clientY);
    };

    window.addEventListener("mousemove", handleMouseMove);
    return () => window.removeEventListener("mousemove", handleMouseMove);
  }, [mouseX, mouseY]);

  return (
    <motion.div
      style={{ x, y }}
      className={`absolute inset-0 will-change-transform pointer-events-none ${className}`}
    >
      {children}
    </motion.div>
  );
};

export default ParallaxLayer;
