"use client";

import React, { useEffect, useRef } from "react";
import {
    motion,
    useAnimation,
    useInView as framerUseInView,
    AnimatePresence,
    useMotionValue,
    useSpring,
    useTransform,
    useScroll,
    useAnimationControls,
} from "framer-motion";



import { ArrowRight, Download } from "lucide-react";
import Link from "next/link";
import { Button } from "@/components/ui/button";




const ActionButtons = ({
    projectsButtonRef,
    resumeButtonRef,
}: {
    projectsButtonRef: React.RefObject<HTMLButtonElement>;
    resumeButtonRef: React.RefObject<HTMLAnchorElement>;
}) => {
    const controls = useAnimation();
    const ref = useRef(null);
    const isInView = framerUseInView(ref, { once: true, amount: 0.1 });

    useEffect(() => {
        if (isInView) {
            controls.start("visible");
        }
    }, [controls, isInView]);

    const containerVariants = {
        hidden: { opacity: 0 },
        visible: {
            opacity: 1,
            transition: {
                staggerChildren: 0.2,
                delayChildren: 0.6,
            },
        },
    };

    const buttonVariants = {
        hidden: { y: 20, opacity: 0 },
        visible: {
            y: 0,
            opacity: 1,
            transition: {
                type: "spring",
                stiffness: 100,
                damping: 15,
            },
        },
    };

    return (
        <motion.div
            ref={ref}
            className="flex flex-col sm:flex-row gap-4 mt-8 justify-center mx-auto"
            variants={containerVariants}
            initial="hidden"
            animate={controls}
        >
            <motion.div variants={buttonVariants} whileHover={{ scale: 1.05 }} whileTap={{ scale: 0.98 }}>
                <Button
                    className="w-full sm:w-auto group relative overflow-hidden px-8 py-6 text-base sm:text-lg"
                    size="lg"
                    ref={projectsButtonRef}
                    asChild
                >
                    <Link href="#projects">
                        <motion.span
                            className="absolute inset-0 bg-primary/10 rounded-md"
                            initial={{ scale: 0, opacity: 0 }}
                            whileHover={{ scale: 1, opacity: 1 }}
                            transition={{ duration: 0.3 }}
                        />
                        <span className="relative z-10 flex items-center">
                            Projects
                            <motion.span
                                className="ml-2"
                                initial={{ x: 0 }}
                                whileHover={{ x: 3 }}
                                transition={{ type: "spring", stiffness: 300, damping: 20 }}
                            >
                                <ArrowRight size={18} />
                            </motion.span>
                        </span>
                    </Link>
                </Button>
            </motion.div>

            <motion.div variants={buttonVariants} whileHover={{ scale: 1.05 }} whileTap={{ scale: 0.98 }}>
                <Button
                    variant="outline"
                    className="w-full sm:w-auto group relative overflow-hidden px-8 py-6 text-base sm:text-lg"
                    size="lg"
                    asChild
                >
                    <Link
                        href="/resume.pdf"
                        target="_blank"
                        ref={resumeButtonRef}
                    >
                        <motion.span
                            className="absolute inset-0 bg-secondary/20 rounded-md"
                            initial={{ scale: 0, opacity: 0 }}
                            whileHover={{ scale: 1, opacity: 1 }}
                            transition={{ duration: 0.3 }}
                        />
                        <span className="relative z-10 flex items-center">
                            Resume
                            <motion.span
                                className="ml-2"
                                initial={{ y: 0 }}
                                whileHover={{ y: -2 }}
                                transition={{ repeat: Infinity, repeatType: "reverse", duration: 0.6 }}
                            >
                                <Download size={18} />
                            </motion.span>
                        </span>
                    </Link>
                </Button>
            </motion.div>
        </motion.div>
    );
};

export default ActionButtons