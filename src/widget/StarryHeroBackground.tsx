"use client";



import { useEffect, useRef } from "react";

const StarryHeroBackground = () => {
    const containerRef = useRef<HTMLDivElement>(null);

    useEffect(() => {
        if (!containerRef.current) return;

        const container = containerRef.current;

        const starCount = Math.min(window.innerWidth < 768 ? 30 : 100, 100);
        const stars: HTMLElement[] = [];
        // Create stars once at component mount instead of repeatedly
        for (let i = 0; i < starCount; i++) {
            const size = Math.random() * 2 + 1; // Keep stars small
            const x = Math.random() * 100;
            const y = Math.random() * 100;
            const opacity = Math.random() * 0.5 + 0.3;
            const duration = Math.random() * 2 + 1; // Faster animation
            const delay = Math.random() * 2;

            const star = document.createElement('div');
            star.className = 'star';
            star.style.cssText = `
          position: absolute;
          left: ${x}%;
          top: ${y}%;
          width: ${size}px;
          height: ${size}px;
          background: white;
          border-radius: 50%;
          opacity: ${opacity};
          box-shadow: 0 0 ${size}px rgba(255, 255, 255, 0.5);
          will-change: opacity;
          animation: starPulse ${duration}s ease-in-out infinite alternate;
          animation-delay: ${delay}s;
          transition: opacity 0.2s, transform 0.2s, box-shadow 0.2s;
        `;

            container.appendChild(star);
            stars.push(star);
        }

        // Function to make random stars blink
        const makeRandomStarsBlink = () => {
            // Number of stars to blink (between 1-5 stars)
            const numToBlink = Math.floor(Math.random() * 5) + 1;

            for (let i = 0; i < numToBlink; i++) {
                // Select a random star
                const randomIndex = Math.floor(Math.random() * stars.length);
                const star = stars[randomIndex];

                if (star && container.contains(star)) {
                    // Save original styles
                    const originalOpacity = star.style.opacity;
                    const originalBoxShadow = star.style.boxShadow;

                    // Blink effect
                    star.style.opacity = '1';
                    star.style.transform = 'scale(1.5)';
                    star.style.boxShadow = '0 0 10px rgba(255, 255, 255, 0.9)';

                    // Return to normal after a short delay
                    setTimeout(() => {
                        if (star && container.contains(star)) {
                            star.style.opacity = originalOpacity;
                            star.style.transform = 'scale(1)';
                            star.style.boxShadow = originalBoxShadow;
                        }
                    }, 300);
                }
            }
        };

        // Set interval to make random stars blink
        const blinkInterval = setInterval(makeRandomStarsBlink, 2000);

        // Limit the number of shooting stars and throttle their creation
        let shootingStarCount = 0;
        const MAX_SHOOTING_STARS = 2; // Maximum concurrent shooting stars

        const createShootingStar = () => {
            if (!document.body.contains(container) || shootingStarCount >= MAX_SHOOTING_STARS) return;

            shootingStarCount++;

            const x = Math.random() * 90 + 5;
            const y = Math.random() * 30;
            const size = Math.random() * 2 + 0.5;
            const angle = Math.random() * 30 + 20;
            const duration = Math.random() * 0.6 + 0.3; // Faster animation

            const star = document.createElement('div');
            star.className = 'shooting-star';
            star.style.cssText = `
          position: absolute;
          left: ${x}%;
          top: ${y}%;
          width: ${size * 10}px; // Shorter trails
          height: 1px;
          background: white;
          box-shadow: 0 0 5px rgba(255, 255, 255, 0.7);
          transform: rotate(${angle}deg);
          opacity: 0;
          will-change: opacity, transform;
          animation: shootingStar ${duration}s ease-out forwards;
        `;

            container.appendChild(star);

            // Clean up after animation
            setTimeout(() => {
                if (container.contains(star)) {
                    container.removeChild(star);
                    shootingStarCount--;
                }
            }, duration * 1000 + 50);
        };

        // Add just two glow areas instead of many
        const createGlows = () => {
            // Reduce number of glows for better performance
            const glowPositions = [
                { left: '65%', top: '25%', size: 250 },
            ];

            glowPositions.forEach(({ left, top, size }) => {
                const glow = document.createElement('div');
                glow.className = 'glow';
                glow.style.cssText = `
            position: absolute;
            left: ${left};
            top: ${top};
            width: ${size}px;
            height: ${size}px;
            background: radial-gradient(circle, rgba(150, 170, 255, 0.1) 0%, rgba(10, 20, 30, 0) 70%);
            border-radius: 50%;
            filter: blur(40px);
            opacity: 0.15;
            transform: translate(-50%, -50%);
            will-change: opacity;
            animation: glowPulse 10s ease-in-out infinite alternate;
          `;

                container.appendChild(glow);
            });
        };

        // Drastically reduce shooting star frequency
        const shootingStarInterval = setInterval(() => {
            if (!document.body.contains(container)) {
                clearInterval(shootingStarInterval);
                return;
            }

            // Only 50% chance to create a shooting star at each interval
            if (Math.random() > 0.5) {
                createShootingStar();
            }
        }, 4000); // Less frequent

        // Minimize meteor showers - only do them rarely
        const meteorShowerInterval = setInterval(() => {
            if (!document.body.contains(container)) {
                clearInterval(meteorShowerInterval);
                return;
            }

            if (Math.random() > 0.7) { // 30% chance of meteor shower
                const count = 2; // Just 2 meteors per shower
                for (let i = 0; i < count; i++) {
                    setTimeout(() => createShootingStar(), i * 300);
                }
            }
        }, 20000); // Much less frequent

        // Add static glow areas
        createGlows();

        return () => {
            clearInterval(shootingStarInterval);
            clearInterval(meteorShowerInterval);
            clearInterval(blinkInterval);
        };
    }, []);

    return (
        <div ref={containerRef} className="absolute inset-0 overflow-hidden">
            <style>{`
          @keyframes starPulse {
            0% { opacity: 0.3; transform: scale(0.8); }
            100% { opacity: 0.8; transform: scale(1.1); }
          }
          
          @keyframes shootingStar {
            0% { opacity: 0; transform-origin: left; transform: translateX(0) scaleX(0.1); }
            10% { opacity: 1; }
            100% { opacity: 0; transform-origin: left; transform: translateX(120px) scaleX(1); }
          }
          
          @keyframes glowPulse {
            0% { opacity: 0.1; transform: translate(-50%, -50%) scale(0.9); }
            50% { opacity: 0.15; transform: translate(-50%, -50%) scale(1.05); }
            100% { opacity: 0.1; transform: translate(-50%, -50%) scale(0.9); }
          }
        `}</style>
        </div>
    );
};


export default StarryHeroBackground;