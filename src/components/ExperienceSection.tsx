import React, { useRef } from 'react';
import { motion, useScroll, useTransform } from 'framer-motion';
import WorkExperienceCard from './WorkExperienceCard';
import { experiences } from '../data/experienceData';

interface ExperienceSectionProps {
  id?: string;
  className?: string;
}

const ExperienceSection: React.FC<ExperienceSectionProps> = ({ 
  id = 'experience-section',
  className = ''
}) => {
  const experienceSectionRef = useRef<HTMLDivElement>(null);
  const { scrollYProgress } = useScroll({
    target: experienceSectionRef,
    offset: ["start end", "end start"]
  });

  // Parallax effect for background elements
  const backgroundY = useTransform(scrollYProgress, [0, 1], [0, -100]);
  const backgroundOpacity = useTransform(scrollYProgress, [0, 0.2, 0.8, 1], [0, 1, 1, 0]);
  
  // Cards staggered reveal
  const containerVariants = {
    hidden: { opacity: 0 },
    visible: {
      opacity: 1,
      transition: {
        staggerChildren: 0.2,
        delayChildren: 0.1
      }
    }
  };
  
  // Star variants
  const starVariants = {
    hidden: { opacity: 0, scale: 0 },
    visible: { opacity: 1, scale: 1, transition: { duration: 0.5 } }
  };
  
  // Generate stars for the experience section background
  const stars = Array.from({ length: 30 }).map((_, i) => ({
    id: i,
    size: Math.random() * 3 + 1,
    top: `${Math.random() * 100}%`,
    left: `${Math.random() * 100}%`,
    delay: Math.random() * 0.5,
    duration: Math.random() * 4 + 3
  }));
  
  return (
    <section
      id={id}
      ref={experienceSectionRef}
      className={`py-20 px-4 md:px-8 lg:px-16 bg-background relative overflow-hidden ${className}`}
    >
      {/* Enhanced background elements */}
      <motion.div 
        className="absolute inset-0 -z-10"
        style={{ opacity: backgroundOpacity, y: backgroundY }}
      >
        {/* Animated gradient background */}
        <div className="absolute top-0 left-0 w-full h-full overflow-hidden">
          <motion.div
            className="absolute -top-32 -left-32 w-96 h-96 bg-primary/10 rounded-full blur-3xl"
            animate={{ 
              x: [0, 20, 0],
              y: [0, 30, 0],
              scale: [1, 1.1, 1]
            }}
            transition={{ 
              duration: 15,
              repeat: Infinity,
              ease: "easeInOut"
            }}
          />
          <motion.div
            className="absolute -bottom-32 -right-32 w-96 h-96 bg-secondary/10 rounded-full blur-3xl"
            animate={{ 
              x: [0, -20, 0],
              y: [0, -30, 0],
              scale: [1, 1.2, 1]
            }}
            transition={{ 
              duration: 18,
              repeat: Infinity,
              ease: "easeInOut"
            }}
          />
          <motion.div
            className="absolute top-1/3 right-1/4 w-64 h-64 bg-accent/10 rounded-full blur-3xl"
            animate={{ 
              x: [0, 30, 0],
              y: [0, -20, 0],
              scale: [1, 1.15, 1]
            }}
            transition={{ 
              duration: 20,
              repeat: Infinity,
              ease: "easeInOut"
            }}
          />
        </div>
        
        {/* Stars in background */}
        <motion.div 
          className="absolute inset-0"
          initial="hidden"
          animate="visible"
          variants={containerVariants}
        >
          {stars.map((star) => (
            <motion.div
              key={`exp-star-${star.id}`}
              className="absolute rounded-full bg-primary/70"
              style={{
                top: star.top,
                left: star.left,
                width: `${star.size}px`,
                height: `${star.size}px`,
                boxShadow: `0 0 ${star.size * 2}px rgba(var(--primary-rgb), 0.7)`,
              }}
              variants={starVariants}
              animate={{
                opacity: [0.4, 1, 0.4],
                scale: [1, 1.2, 1],
              }}
              transition={{
                delay: star.delay,
                duration: star.duration,
                repeat: Infinity,
                ease: "easeInOut"
              }}
            />
          ))}
        </motion.div>
        
        {/* Grid pattern */}
        <div className="absolute inset-0 bg-grid-pattern opacity-5"></div>
      </motion.div>
      
      <div className="max-w-6xl mx-auto relative">
        <motion.div
          initial={{ opacity: 0, y: 30 }}
          whileInView={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.6, ease: [0.22, 1, 0.36, 1] }}
          viewport={{ once: true, margin: "-50px" }}
          className="mb-16 text-center"
        >
          <h2 className="text-3xl md:text-5xl font-bold mb-6 relative group perspective">
            <span className="inline-block bg-clip-text text-transparent bg-gradient-to-r from-primary to-primary/70 group-hover:from-primary/70 group-hover:to-primary transition-all duration-500 transform group-hover:translate-z-10 group-hover:scale-110">
              Work Experience
            </span>
            
            {/* Decorative star elements */}
            <motion.div 
              className="absolute -top-6 -left-6 w-5 h-5 text-primary"
              animate={{ 
                rotate: 360,
                scale: [1, 1.2, 1]
              }}
              transition={{ 
                rotate: { duration: 20, repeat: Infinity, ease: "linear" },
                scale: { duration: 3, repeat: Infinity, ease: "easeInOut" }
              }}
            >
              ✦
            </motion.div>
            <motion.div 
              className="absolute -bottom-4 -right-6 w-4 h-4 text-primary/70"
              animate={{ 
                rotate: -360,
                scale: [1, 1.3, 1]
              }}
              transition={{ 
                rotate: { duration: 25, repeat: Infinity, ease: "linear" },
                scale: { duration: 4, repeat: Infinity, ease: "easeInOut" }
              }}
            >
              ✧
            </motion.div>
          </h2>
          
          <motion.p 
            className="text-muted-foreground max-w-2xl mx-auto text-lg"
            initial={{ opacity: 0, y: 20 }}
            whileInView={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.6, delay: 0.2 }}
            viewport={{ once: true }}
          >
            My professional journey and roles that have shaped my career.
          </motion.p>
          <motion.div
            className="w-24 h-1.5 bg-gradient-to-r from-primary/40 to-primary mx-auto mt-6"
            initial={{ width: 0, opacity: 0 }}
            whileInView={{ width: 96, opacity: 1 }}
            transition={{ duration: 0.8, ease: "easeOut", delay: 0.2 }}
            viewport={{ once: true }}
          />
        </motion.div>

        {/* Enhanced timeline connector with improved shimmer effect */}
        <div className="absolute top-32 bottom-0 left-0 md:left-6 w-1.5 bg-gradient-to-b from-primary/10 via-primary/30 to-primary/10 h-[85%] mx-4 md:mx-8 z-0 rounded-full overflow-hidden">
          <motion.div 
            className="absolute top-0 left-0 w-full h-24 bg-gradient-to-b from-transparent via-primary to-transparent"
            animate={{ y: [0, 500, 0] }}
            transition={{
              duration: 8,
              repeat: Infinity,
              ease: "easeInOut"
            }}
          />
          
          {/* Shooting star effect inside timeline */}
          <motion.div
            className="absolute w-2 h-20 bg-gradient-to-b from-primary/0 via-primary/90 to-primary/0"
            animate={{
              top: ["-10%", "110%"],
              opacity: [0, 1, 0]
            }}
            transition={{
              duration: 3,
              repeat: Infinity,
              repeatDelay: 4,
              ease: "easeInOut",
              times: [0, 0.5, 1]
            }}
          />
        </div>

        <motion.div 
          className="relative space-y-10 pl-6 md:pl-16 ml-4 md:ml-8"
          variants={containerVariants}
          initial="hidden"
          whileInView="visible"
          viewport={{ once: true, amount: 0.1 }}
        >
          {experiences.map((experience, index) => (
            <WorkExperienceCard
              key={`experience-${index}`}
              {...experience}
              index={index}
            />
          ))}
          
          {/* Enhanced final timeline node */}
          <motion.div 
            className="absolute bottom-0 -left-3 md:left-1 w-10 h-10 rounded-full bg-gradient-to-br from-primary/20 to-primary/60 backdrop-blur-sm flex items-center justify-center"
            animate={{ 
              scale: [1, 1.2, 1],
              boxShadow: [
                '0 0 0 rgba(var(--primary-rgb), 0.4)',
                '0 0 20px rgba(var(--primary-rgb), 0.6)',
                '0 0 0 rgba(var(--primary-rgb), 0.4)'
              ]
            }}
            transition={{ 
              duration: 3, 
              repeat: Infinity, 
              ease: "easeInOut" 
            }}
          >
            <div className="w-4 h-4 rounded-full bg-primary" />
            
            {/* Star burst on hover */}
            <motion.div
              className="absolute inset-0 z-[-1]"
              initial={{ opacity: 0 }}
              whileHover={{ opacity: 1 }}
            >
              {Array.from({ length: 6 }).map((_, i) => (
                <motion.div
                  key={`star-ray-${i}`}
                  className="absolute top-1/2 left-1/2 w-1 h-px bg-primary"
                  style={{
                    transform: `rotate(${i * 60}deg) translateX(0px)`,
                    transformOrigin: "0 0"
                  }}
                  animate={{
                    scaleX: [1, 15, 1],
                    opacity: [0, 0.8, 0]
                  }}
                  transition={{
                    duration: 2,
                    repeat: Infinity,
                    ease: "easeInOut",
                    delay: i * 0.2,
                  }}
                />
              ))}
            </motion.div>
          </motion.div>
        </motion.div>
      </div>
    </section>
  );
};

export default ExperienceSection;

// Add this to your globals.css or use a CSS-in-JS solution
const cssAddon = `
  .bg-grid-pattern {
    background-image: 
      linear-gradient(to right, rgba(var(--primary-rgb), 0.05) 1px, transparent 1px),
      linear-gradient(to bottom, rgba(var(--primary-rgb), 0.05) 1px, transparent 1px);
    background-size: 40px 40px;
  }
  
  .perspective {
    perspective: 1000px;
  }
  
  .translate-z-10 {
    transform: translateZ(10px);
  }
`; 