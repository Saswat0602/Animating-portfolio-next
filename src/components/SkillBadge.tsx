import React from 'react';
import { motion } from 'framer-motion';

interface SkillBadgeProps {
  name: string;
  index: number;
  iconPath?: string;
}

const SkillBadge: React.FC<SkillBadgeProps> = ({ name, index, iconPath }) => {
  // Generate a default icon path if not provided
  const defaultIconPath = `https://cdn.jsdelivr.net/gh/devicons/devicon/icons/${name.toLowerCase()}/${name.toLowerCase()}-original.svg`;
  const imageSrc = iconPath || defaultIconPath;

  return (
    <motion.div
      className="skill-badge flex flex-col items-center justify-center p-3 bg-background rounded-lg shadow-md hover:shadow-lg transition-all duration-300"
      initial={{ opacity: 1, y: 0 }}
      whileHover={{ 
        y: -3,
        scale: 1.05,
        transition: { duration: 0.2 }
      }}
      viewport={{ once: true, margin: "-10px" }}
    >
      <div className="relative w-10 h-10 mb-2 overflow-hidden flex items-center justify-center">
        <img 
          src={imageSrc} 
          alt={name} 
          className="w-8 h-8 object-contain"
          loading="eager"
          onError={(e) => {
            const target = e.currentTarget;
            
            // Try alternate format first
            if (name.toLowerCase() === "aws" || name.toLowerCase() === "amazonwebservices") {
              target.src = "https://cdn.jsdelivr.net/gh/devicons/devicon/icons/amazonwebservices/amazonwebservices-plain-wordmark.svg";
              target.onerror = () => {
                target.outerHTML = `<div class="w-8 h-8 rounded-full bg-primary/10 flex items-center justify-center text-xs font-medium">AWS</div>`;
              };
            } else {
              // Basic fallback for all other icons
              target.outerHTML = `<div class="w-8 h-8 rounded-full bg-primary/10 flex items-center justify-center text-xs font-medium">${name.substring(0, 2).toUpperCase()}</div>`;
            }
          }}
        />
      </div>
      <span className="text-xs font-medium">
        {name}
      </span>
    </motion.div>
  );
};

export default SkillBadge; 