import React from 'react';
import { motion } from 'framer-motion';
import Image from 'next/image';
import { WorkExperience } from '../data/experienceData';

interface ExperienceProps extends WorkExperience {
  index: number;
}

const WorkExperienceCard: React.FC<ExperienceProps> = ({ 
  title, 
  company, 
  duration, 
  location,
  type,
  description, 
  skills, 
  logo,
  index 
}) => {
  // Generate a few random stars for each card
  const stars = Array.from({ length: 3 }).map((_, i) => ({
    id: i,
    top: `${Math.random() * 100}%`,
    right: `${Math.random() * 40 + 10}%`,
    delay: Math.random() * 2,
    duration: Math.random() * 3 + 2
  }));
  
  return (
    <motion.div
      initial={{ opacity: 0, y: 30 }}
      whileInView={{ opacity: 1, y: 0 }}
      transition={{
        duration: 0.4,
        delay: index * 0.1,
        ease: [0.21, 1.02, 0.34, 1]
      }}
      viewport={{ once: true, amount: 0.3 }}
      className="experience-card relative bg-card/80 backdrop-blur-sm rounded-xl shadow-lg p-6 border border-primary/10 hover:border-primary/30 transition-all duration-300 overflow-hidden"
      whileHover={{ 
        y: -8, 
        boxShadow: "0 15px 30px -10px rgba(var(--primary-rgb), 0.2)",
        borderColor: "rgba(var(--primary-rgb), 0.3)"
      }}
    >
      {/* Decorative stars */}
      {stars.map((star, i) => (
        <motion.div
          key={`card-star-${index}-${i}`}
          className="absolute w-1 h-1 rounded-full bg-primary/70"
          style={{ 
            top: star.top, 
            right: star.right,
            boxShadow: "0 0 5px rgba(var(--primary-rgb), 0.7)"
          }}
          animate={{
            opacity: [0.3, 1, 0.3],
            scale: [0.8, 1.3, 0.8]
          }}
          transition={{
            duration: star.duration,
            delay: star.delay,
            repeat: Infinity,
            ease: "easeInOut"
          }}
        />
      ))}
      
      {/* Glow effect on hover */}
      <div className="absolute inset-0 bg-gradient-to-r from-primary/0 to-primary/10 opacity-0 transition-opacity duration-300 group-hover:opacity-100" />
      
      <motion.span 
        className="absolute -left-3 top-8 w-8 h-8 rounded-full flex items-center justify-center text-background text-xs font-bold shadow-lg z-10 overflow-hidden"
        initial={{ scale: 0 }}
        animate={{ scale: 1 }}
        transition={{ 
          type: "spring", 
          stiffness: 300, 
          damping: 20, 
          delay: 0.2 + index * 0.1 
        }}
        whileHover={{ scale: 1.2 }}
        style={{
          background: `linear-gradient(45deg, var(--primary), rgba(var(--primary-rgb), 0.8))`
        }}
      >
        {index + 1}
        <motion.div 
          className="absolute inset-0 bg-primary opacity-30"
          animate={{
            background: [
              "linear-gradient(0deg, var(--primary), rgba(var(--primary-rgb), 0.6))",
              "linear-gradient(360deg, var(--primary), rgba(var(--primary-rgb), 0.6))"
            ]
          }}
          transition={{
            duration: 3,
            repeat: Infinity,
            ease: "linear"
          }}
        />
      </motion.span>
      
      <div className="mb-4 flex flex-col sm:flex-row sm:items-center justify-between">
        <div className="flex items-center">
          {logo && (
            <motion.div 
              className="mr-3 w-10 h-10 rounded-full overflow-hidden border border-primary/20 flex items-center justify-center bg-card"
              whileHover={{ scale: 1.1, rotate: 10 }}
              transition={{ type: "spring", stiffness: 300, damping: 10 }}
            >
              {logo ? 
                <Image src={logo} alt={`${company} logo`} width={32} height={32} className="object-contain" /> : 
                <div className="w-full h-full bg-primary/10 flex items-center justify-center text-primary font-bold text-sm">
                  {company.substring(0, 2).toUpperCase()}
                </div>
              }
            </motion.div>
          )}
          <motion.h3 
            className="text-xl font-bold group"
            whileHover={{ scale: 1.02, color: "var(--primary)" }}
            transition={{ duration: 0.2 }}
          >
            <span className="inline-block relative">
              {title}
              <motion.span 
                className="absolute bottom-0 left-0 w-full h-[2px] bg-primary" 
                initial={{ width: 0 }}
                whileInView={{ width: "100%" }}
                transition={{ duration: 0.5, delay: 0.2 }}
                viewport={{ once: true }}
              />
            </span>
          </motion.h3>
        </div>
        <motion.span 
          className="text-sm text-muted-foreground mt-1 sm:mt-0 bg-muted/30 px-3 py-1 rounded-full border border-primary/10"
          whileHover={{ 
            scale: 1.05, 
            backgroundColor: "var(--primary)",
            color: "var(--background)",
            boxShadow: "0 0 10px rgba(var(--primary-rgb), 0.5)"
          }}
          transition={{ duration: 0.2 }}
        >
          {duration}
        </motion.span>
      </div>
      
      <motion.h4 
        className="text-lg font-medium flex items-center mb-1"
        whileHover={{ x: 3, fontWeight: "700" }}
        transition={{ duration: 0.2 }}
      >
        <span className="text-primary mr-2 font-semibold">@</span> {company}
      </motion.h4>
      
      <motion.div className="text-sm text-muted-foreground mb-3 flex flex-wrap gap-2">
        {type && (
          <motion.span
            className="bg-primary/10 px-2 py-0.5 rounded-full"
            whileHover={{ 
              backgroundColor: "var(--primary)", 
              color: "var(--background)",
              scale: 1.05
            }}
          >
            {type}
          </motion.span>
        )}
        {location && (
          <motion.span
            className="bg-muted/50 px-2 py-0.5 rounded-full"
            whileHover={{ 
              backgroundColor: "var(--primary)", 
              color: "var(--background)",
              scale: 1.05
            }}
          >
            {location}
          </motion.span>
        )}
      </motion.div>
      
      <motion.p 
        className="text-muted-foreground mb-4 leading-relaxed"
        whileHover={{ color: "var(--foreground)" }}
        transition={{ duration: 0.2 }}
      >
        {description}
      </motion.p>
      
      <div className="flex flex-wrap gap-2 pt-2 border-t border-primary/10">
        {skills.map((skill, idx) => (
          <motion.span
            key={idx}
            initial={{ opacity: 0, scale: 0.9 }}
            whileInView={{ opacity: 1, scale: 1 }}
            transition={{ 
              duration: 0.2, 
              delay: 0.1 + idx * 0.05
            }}
            viewport={{ once: true }}
            className="text-xs bg-background/80 backdrop-blur-sm px-2 py-1 rounded-md shadow-sm border border-primary/20 transition-all duration-200"
            whileHover={{ 
              scale: 1.05, 
              boxShadow: "0 2px 10px rgba(var(--primary-rgb), 0.3)",
              backgroundColor: "var(--primary)",
              color: "var(--background)",
              borderColor: "transparent",
              fontWeight: "bold"
            }}
          >
            {skill}
          </motion.span>
        ))}
      </div>
    </motion.div>
  );
};

export default WorkExperienceCard; 