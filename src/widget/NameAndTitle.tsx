import { useEffect, useRef, useState } from "react";

const NameAndTitle = ({ name, title }: { name: string; title: string }) => {
    const ref = useRef<HTMLDivElement>(null);
    const [isVisible, setIsVisible] = useState(false);
    const [isNameHovered, setIsNameHovered] = useState(false);
    const [isTitleHovered, setIsTitleHovered] = useState(false);

    // Simpler detection of when the component is in view without heavy framer-motion dependencies
    useEffect(() => {
        if (!ref.current) return;

        // Use IntersectionObserver API for better performance
        const observer = new IntersectionObserver((entries) => {
            if (entries[0].isIntersecting) {
                setIsVisible(true);
                observer.disconnect(); // Only need to detect once
            }
        }, { threshold: 0.1 });

        observer.observe(ref.current);

        return () => observer.disconnect();
    }, []);

    return (
        <div ref={ref} className="relative py-2">
            {/* Background effect with simple CSS transition instead of motion component */}
            <div
                className="absolute -inset-10 bg-primary rounded-full"
                style={{
                    opacity: isVisible ? 0.1 : 0,
                    filter: 'blur(60px)',
                    transform: `scale(${isVisible ? 1 : 0})`,
                    transition: 'opacity 1.5s ease-out, transform 1.5s ease-out',
                    transitionDelay: '0.2s'
                }}
            />

            <h1 
                className="text-4xl md:text-5xl lg:text-6xl font-bold tracking-tight mb-2 relative cursor-pointer"
                onMouseEnter={() => setIsNameHovered(true)}
                onMouseLeave={() => setIsNameHovered(false)}
            >
                {/* Use a single span with CSS transitions for better performance */}
                <span
                    className="block relative"
                    style={{
                        opacity: isVisible ? 1 : 0,
                        transform: `translateY(${isVisible ? 0 : '50px'})`,
                        transition: 'all 0.6s ease-out, transform 0.8s cubic-bezier(0.2, 0.8, 0.2, 1), color 0.3s ease',
                        color: isNameHovered ? 'var(--primary)' : 'inherit',
                        textShadow: isNameHovered ? '0 0 8px rgba(var(--primary-rgb), 0.3)' : 'none',
                    }}
                >
                    {name}
                </span>
            </h1>

            <h2
                className="text-lg md:text-xl lg:text-2xl text-muted-foreground font-medium relative cursor-pointer"
                style={{
                    opacity: isVisible ? 1 : 0,
                    transform: `scale(${isVisible ? 1 : 0.9})`,
                    transition: 'all 0.8s ease-out, transform 0.8s ease-out, color 0.3s ease',
                    transitionDelay: '0.3s',
                    color: isTitleHovered ? 'var(--primary)' : '',
                }}
                onMouseEnter={() => setIsTitleHovered(true)}
                onMouseLeave={() => setIsTitleHovered(false)}
            >
                {title}
            </h2>
        </div>
    );
};


export default NameAndTitle