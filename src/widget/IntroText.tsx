import React, { useRef } from "react";
import { motion, useInView as framerUseInView, } from "framer-motion";



interface IntroTextProps {
    text: string;
    className?: string;
}


const IntroText = ({ text, className }: IntroTextProps) => {
    const ref = useRef(null);
    const isInView = framerUseInView(ref, { once: true, amount: 0.2 });

    const textVariants = {
        hidden: { opacity: 0 },
        visible: {
            opacity: 1,
            transition: {
                staggerChildren: 0.02
            }
        }
    };

    const letterVariants = {
        hidden: {
            opacity: 0,
            y: 20,
            scale: 0.9
        },
        visible: {
            opacity: 1,
            y: 0,
            scale: 1,
            transition: {
                type: "spring",
                damping: 10,
                stiffness: 100
            }
        }
    };

    return (
        <motion.p
            ref={ref}
            className={`text-md md:text-xl text-primary-text-100 leading-relaxed md:leading-relaxed max-w-4xl ${className}`}
            initial="hidden"
            animate={isInView ? "visible" : "hidden"}
            variants={textVariants}
        >
            {text.split("").map((char, index) => (
                <motion.span
                    key={`${char}-${index}`}
                    variants={letterVariants}
                    className={char === " " ? "inline-block w-[0.3em]" : "inline-block"}
                >
                    {char}
                </motion.span>
            ))}
        </motion.p>
    );
}

export default IntroText