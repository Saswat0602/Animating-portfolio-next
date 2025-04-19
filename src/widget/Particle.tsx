import { motion } from "framer-motion";


interface ParticleProps {
    posX: number;
    posY: number;
    size: number;
    color: string;
}

const Particle: React.FC<ParticleProps> = ({ posX, posY, size, color }) => {
    // Random offset values for more organic movement
    const xOffset = Math.random() * 3 - 1.5;
    const yOffset = Math.random() * 3 - 1.5;
    const duration = 8 + Math.random() * 6; // Random duration between 8-14s

    return (
        <motion.div
            className="absolute rounded-full"
            style={{
                backgroundColor: color,
                width: size,
                height: size,
                left: `${posX}%`,
                top: `${posY}%`,
                zIndex: 0,
            }}
            initial={{
                opacity: 0,
                scale: 0.8
            }}
            animate={{
                x: [0, xOffset * 20, -xOffset * 15, xOffset * 25, 0],
                y: [0, yOffset * 25, -yOffset * 20, yOffset * 15, 0],
                opacity: [0.7, 0.9, 0.6, 0.8, 0.7],
                scale: [0.8, 1.1, 0.9, 1.2, 0.8]
            }}
            transition={{
                duration: duration,
                repeat: Infinity,
                repeatType: "loop",
                ease: "easeInOut"
            }}
        />
    );
};

export default Particle