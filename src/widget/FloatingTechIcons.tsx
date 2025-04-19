"use client";


import { TechIcon } from "@/data/techIconsData";
import { useEffect, useRef, useState } from "react";

import {
    motion,
    useAnimation,
    useInView as framerUseInView,
  } from "framer-motion";
import Image from "next/image";



interface MousePosition {
    x: number;
    y: number;
  }
interface FloatingTechIconsProps {
    techIcons: TechIcon[];
    mousePositionRef: React.RefObject<MousePosition>;
}

const FloatingTechIcons: React.FC<FloatingTechIconsProps> = ({ techIcons, mousePositionRef }) => {
    // Use useRef instead of useState for positions to avoid re-renders
    const iconPositionsRef = useRef<Array<{ x: number; y: number }>>([]);
    const [renderedPositions, setRenderedPositions] = useState<Array<{ x: number; y: number }>>([]);
    const rafIdRef = useRef<number>();
    const lastUpdateTimeRef = useRef<number>(0);

    // Set initial positions
    useEffect(() => {
        if (techIcons?.length) {
            iconPositionsRef.current = techIcons.map(icon => ({ x: icon.x, y: icon.y }));
            setRenderedPositions([...iconPositionsRef.current]);
        }
    }, [techIcons]);

    // Animation constants - reduce intensity
    const REPEL_STRENGTH = 10; // Reduced from 15
    const REPEL_THRESHOLD = 15; // Reduced from 20
    const RANDOM_MOVEMENT = 0.1; // Reduced from 0.2
    const EASE_FACTOR = 0.05; // Reduced from 0.08
    const FPS_LIMIT = 30; // Cap at 30fps to reduce CPU usage

    // Separate animation loop from React's render cycle
    useEffect(() => {
        // Skip if no icons
        if (!techIcons?.length) return;

        const updatePositions = (timestamp: number) => {
            // Throttle updates to limit FPS
            if (timestamp - lastUpdateTimeRef.current < 1000 / FPS_LIMIT) {
                rafIdRef.current = requestAnimationFrame(updatePositions);
                return;
            }

            lastUpdateTimeRef.current = timestamp;

            const mousePosition = mousePositionRef.current;
            if (!mousePosition) {
                rafIdRef.current = requestAnimationFrame(updatePositions);
                return;
            }

            // Update positions without triggering re-renders
            let hasChanged = false;

            iconPositionsRef.current = iconPositionsRef.current.map((pos, index) => {
                const icon = index < techIcons.length ? techIcons[index] : null;
                if (!icon) return pos;

                // Current position
                const iconPosX = pos.x;
                const iconPosY = pos.y;

                // Calculate distance
                const dx = mousePosition.x / window.innerWidth * 100 - iconPosX;
                const dy = mousePosition.y / window.innerHeight * 100 - iconPosY;
                const distance = Math.sqrt(dx * dx + dy * dy);

                // Target position (default to original)
                let targetX = icon.x;
                let targetY = icon.y;

                // Apply repel effect if close enough
                if (distance < REPEL_THRESHOLD) {
                    const repelFactor = (1 - distance / REPEL_THRESHOLD) * REPEL_STRENGTH;
                    targetX = iconPosX - (dx / distance) * repelFactor;
                    targetY = iconPosY - (dy / distance) * repelFactor;
                }

                // Reduce random movement to once every few frames
                if (Math.random() < 0.2) { // Only apply random movement 20% of the time
                    targetX += (Math.random() - 0.5) * RANDOM_MOVEMENT;
                    targetY += (Math.random() - 0.5) * RANDOM_MOVEMENT;
                }

                // Smoother interpolation
                const newX = iconPosX + (targetX - iconPosX) * EASE_FACTOR;
                const newY = iconPosY + (targetY - iconPosY) * EASE_FACTOR;

                // Check if position has changed significantly to avoid unnecessary updates
                if (Math.abs(newX - iconPosX) > 0.01 || Math.abs(newY - iconPosY) > 0.01) {
                    hasChanged = true;
                }

                return { x: newX, y: newY };
            });

            // Only update render state if positions have changed significantly
            if (hasChanged) {
                // Batch the update outside the animation frame
                setRenderedPositions([...iconPositionsRef.current]);
            }

            rafIdRef.current = requestAnimationFrame(updatePositions);
        };

        rafIdRef.current = requestAnimationFrame(updatePositions);

        return () => {
            if (rafIdRef.current) {
                cancelAnimationFrame(rafIdRef.current);
            }
        };
    }, [techIcons, mousePositionRef, REPEL_STRENGTH, REPEL_THRESHOLD, RANDOM_MOVEMENT, EASE_FACTOR, FPS_LIMIT]);

    // Don't render if no icons
    if (!techIcons?.length || !renderedPositions.length) return null;

    // Render fewer icons in mobile to reduce strain
    const isMobile = typeof window !== 'undefined' && window.innerWidth < 768;
    const renderCount = isMobile ? Math.min(techIcons.length, 6) : techIcons.length;

    return (
        <>
            {techIcons.slice(0, renderCount).map((icon, index) => {
                if (index >= renderedPositions.length) return null;

                const position = renderedPositions[index];
                return (
                    <motion.div
                        key={icon.name}
                        className="absolute pointer-events-auto"
                        style={{
                            left: `${position.x}%`,
                            top: `${position.y}%`,
                            transform: 'translate(-50%, -50%)',
                            zIndex: 5,
                            willChange: 'transform, opacity',
                        }}
                        initial={{ opacity: 0, scale: 0 }}
                        animate={{ opacity: 0.8, scale: 1 }}
                        transition={{
                            type: "spring",
                            stiffness: 260,
                            damping: 20,
                            delay: index * 0.1
                        }}
                        // Use simpler hover effect
                        whileHover={{ scale: 1.2, opacity: 1 }}
                    >
                        <div className="w-8 h-8 md:w-10 md:h-10 lg:w-12 lg:h-12 relative">
                            <Image
                                src={icon.src}
                                alt={icon.name}
                                fill
                                sizes="(max-width: 640px) 2rem, (max-width: 768px) 2.5rem, 3rem"
                                className="object-contain filter drop-shadow-md"
                                loading="eager"
                                priority={index < 4}
                                onError={(e) => {
                                    console.error(`Failed to load icon: ${icon.name}`);
                                    const imgElement = e.currentTarget as HTMLImageElement;
                                    if (icon.name === "aws") {
                                        imgElement.src = "https://cdn.jsdelivr.net/gh/devicons/devicon/icons/amazonwebservices/amazonwebservices-plain-wordmark.svg";
                                    }
                                    else {
                                        imgElement.src = `https://via.placeholder.com/50?text=${icon.name}`;
                                    }
                                }}
                            />
                        </div>
                    </motion.div>
                );
            })}
        </>
    );
};

export default FloatingTechIcons