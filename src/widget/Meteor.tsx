
import React, { useEffect, useRef, useState, useMemo } from "react";
import {
    motion,
    useAnimation,
    useInView as framerUseInView,
} from "framer-motion";

const Meteor = ({
    left,
    delay,
    height,
    width,
}: {
    left: string;
    delay: number;
    height: number;
    width: number;
}) => {
    return (
        <motion.div
            className="absolute bg-gradient-to-b from-white/90 to-transparent rounded-full blur-[1px]"
            style={{
                width: `${width}px`,        // thin
                height: `${height}px`,      // tall
                top: "-100px",              // starts above screen
                left,
                opacity: 0,
            }}
            animate={{
                top: ["-100px", "110%"],    // moves down
                opacity: [0, 0.8, 0],       // fades in and out
            }}
            transition={{
                duration: 2.5,
                delay,
                repeat: Infinity,
                repeatDelay: Math.random() * 4 + 2,
                ease: "easeInOut",
            }}
        />
    );
};


export default Meteor