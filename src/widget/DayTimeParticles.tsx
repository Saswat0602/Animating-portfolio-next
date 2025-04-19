"use client";


import React, { useEffect, useRef, useMemo } from "react";
import {
    motion,
    useMotionValue,
} from "framer-motion";

const DayTimeParticles = () => {
    const mouseRef = useRef<{ x: number, y: number }>({ x: 0, y: 0 });
    const cursorX = useMotionValue(0);
    const cursorY = useMotionValue(0);

    // Determine if we're on mobile for fewer particles
    const isMobile = typeof window !== 'undefined' && window.innerWidth < 768;
    const rayCount = isMobile ? 10 : 20;
    const particleCount = isMobile ? 30 : 45;
    const glowCount = isMobile ? 2 : 4;

    useEffect(() => {
        const handleMouseMove = (e: MouseEvent) => {
            mouseRef.current = {
                x: e.clientX / window.innerWidth,
                y: e.clientY / window.innerHeight
            };
        };

        window.addEventListener('mousemove', handleMouseMove, { passive: true });
        return () => window.removeEventListener('mousemove', handleMouseMove);
    }, []);

    // Pre-calculate random values for particles to avoid regenerating them on each render
    const particlesData = useMemo(() => {
        return Array.from({ length: particleCount }).map(() => ({
            size: Math.random() * 5 + 2,
            initialX: Math.random() * window.innerWidth,
            initialY: Math.random() * window.innerHeight,
            xOffset1: Math.random() * 80 - 40,
            xOffset2: Math.random() * 80 - 40,
            yOffset1: Math.random() * 80 - 40,
            yOffset2: Math.random() * 80 - 40,
            opacity: [0.2, 0.6, 0.2],
            scale: [0.8, 1.2, 0.8],
            duration: Math.random() * 15 + 15,
            delay: Math.random() * 5,
            type: Math.floor(Math.random() * 3) // 0, 1, or 2 for different gradients
        }));
    }, [particleCount]);

    // Pre-calculate random values for light rays
    const raysData = useMemo(() => {
        return Array.from({ length: rayCount }).map(() => ({
            width: Math.random() * 2 + 1,
            height: Math.random() * 250 + 100,
            top: Math.random() * 40,
            left: Math.random() * 100,
            opacity: Math.random() * 0.4 + 0.1,
            duration: Math.random() * 8 + 10,
            delay: Math.random() * 5
        }));
    }, [rayCount]);

    // Pre-calculate orb data
    const orbsData = useMemo(() => {
        return Array.from({ length: glowCount }).map((_, i) => ({
            width: Math.random() * 120 + 60,
            x: Math.random() * window.innerWidth,
            y: Math.random() * window.innerHeight,
            type: i % 2, // 0 or 1 for different gradients
            duration: Math.random() * 30 + 30,
            delay: Math.random() * 10
        }));
    }, [glowCount]);

    return (
        <div className="absolute inset-0 pointer-events-none overflow-hidden">
            {/* Optimized light rays with fewer elements */}
            {raysData.map((ray, i) => (
                <motion.div
                    key={`ray-${i}`}
                    className="absolute bg-gradient-to-b from-primary/40 to-transparent"
                    style={{
                        width: `${ray.width}px`,
                        height: `${ray.height}px`,
                        top: `${ray.top}%`,
                        left: `${ray.left}%`,
                        transformOrigin: 'top',
                        opacity: ray.opacity,
                        filter: "blur(1px)",
                    }}
                    initial={{ scaleY: 0.2, opacity: 0 }}
                    animate={{
                        scaleY: [0.2, 1, 0.2],
                        opacity: [0, ray.opacity, 0],
                        rotate: [Math.random() * 6 - 3, Math.random() * 6 - 3], // Reduced rotation
                        x: [0, Math.random() * 20 - 10] // Reduced movement
                    }}
                    transition={{
                        duration: ray.duration,
                        repeat: Infinity,
                        delay: ray.delay,
                        ease: "easeInOut"
                    }}
                />
            ))}

            {/* Cursor-following glow with reduced complexity */}
            <motion.div
                className="absolute w-80 h-80 rounded-full bg-gradient-to-r from-primary/10 to-secondary/5"
                style={{
                    filter: "blur(80px)",
                    zIndex: 0,
                    x: cursorX,
                    y: cursorY
                }}
                animate={{
                    scale: [1, 1.05, 1],
                    opacity: [0.3, 0.4, 0.3]
                }}
                transition={{
                    scale: {
                        duration: 4,
                        repeat: Infinity,
                        repeatType: "reverse"
                    },
                    opacity: {
                        duration: 3,
                        repeat: Infinity,
                        repeatType: "reverse"
                    }
                }}
                onUpdate={() => {
                    if (mouseRef.current) {
                        // Use smoother interpolation for cursor following
                        cursorX.set(mouseRef.current.x * window.innerWidth - 150);
                        cursorY.set(mouseRef.current.y * window.innerHeight - 150);
                    }
                }}
            />

            {/* Reduced number of floating particles with optimized rendering */}
            {particlesData.map((particle, i) => (
                <motion.div
                    key={`dust-${i}`}
                    className="absolute rounded-full"
                    style={{
                        width: `${particle.size}px`,
                        height: `${particle.size}px`,
                        background: particle.type === 0
                            ? "radial-gradient(circle, rgba(255,255,255,0.7) 0%, rgba(255,255,255,0) 70%)"
                            : particle.type === 1
                                ? "radial-gradient(circle, rgba(194,219,254,0.7) 0%, rgba(194,219,254,0) 70%)"
                                : "radial-gradient(circle, rgba(249,168,212,0.7) 0%, rgba(249,168,212,0) 70%)",
                        filter: "blur(1px)",
                        zIndex: 0,
                        willChange: "transform, opacity",
                    }}
                    initial={{
                        x: particle.initialX,
                        y: particle.initialY,
                        opacity: particle.opacity[0],
                    }}
                    animate={{
                        x: [
                            particle.initialX,
                            particle.initialX + particle.xOffset1,
                            particle.initialX + particle.xOffset2,
                            particle.initialX,
                        ],
                        y: [
                            particle.initialY,
                            particle.initialY + particle.yOffset1,
                            particle.initialY + particle.yOffset2,
                            particle.initialY,
                        ],
                        opacity: particle.opacity,
                        scale: particle.scale,
                    }}
                    transition={{
                        duration: particle.duration,
                        repeat: Infinity,
                        ease: "easeInOut",
                        delay: particle.delay,
                    }}
                />
            ))}

            {/* Reduced number of glowing orbs */}
            {orbsData.map((orb, i) => (
                <motion.div
                    key={`orb-${i}`}
                    className="absolute rounded-full"
                    style={{
                        width: `${orb.width}px`,
                        height: `${orb.width}px`,
                        x: orb.x,
                        y: orb.y,
                        background: orb.type === 0
                            ? "radial-gradient(circle, rgba(167,139,250,0.1) 0%, rgba(167,139,250,0) 70%)"
                            : "radial-gradient(circle, rgba(249,168,212,0.1) 0%, rgba(249,168,212,0) 70%)",
                        filter: "blur(20px)",
                        zIndex: 0,
                    }}
                    animate={{
                        x: [
                            orb.x,
                            orb.x + 100,
                            orb.x - 100,
                        ],
                        y: [
                            orb.y,
                            orb.y - 100,
                            orb.y + 100,
                        ],
                        scale: [0.8, 1.1, 0.8],
                        opacity: [0.2, 0.4, 0.2]
                    }}
                    transition={{
                        duration: orb.duration,
                        repeat: Infinity,
                        ease: "easeInOut",
                        delay: orb.delay
                    }}
                />
            ))}
        </div>
    );
};

export default DayTimeParticles