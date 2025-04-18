import React, { useState } from 'react';
import { motion } from 'framer-motion';

interface SkillBadgeProps {
  name: string;
  index: number;
  iconPath?: string;
}

const SkillBadge: React.FC<SkillBadgeProps> = ({ name, index, iconPath }) => {
  const [imageError, setImageError] = useState(false);
  
  // Handle Tailwind CSS special case and other common naming issues
  const getIconPath = () => {
    // Special cases for icons with non-standard names
    if (name.toLowerCase() === 'tailwind' || name.toLowerCase() === 'tailwindcss') {
      return "https://cdn.jsdelivr.net/gh/devicons/devicon/icons/tailwindcss/tailwindcss-plain.svg";
    }
    
    if (name.toLowerCase() === 'nextjs' || name.toLowerCase() === 'next.js') {
      return "https://cdn.jsdelivr.net/gh/devicons/devicon/icons/nextjs/nextjs-original.svg";
    }
    
    if (name.toLowerCase() === 'aws' || name.toLowerCase() === 'amazonwebservices') {
      return "https://cdn.jsdelivr.net/gh/devicons/devicon/icons/amazonwebservices/amazonwebservices-original-wordmark.svg";
    }
    
    // Use provided path or generate default path
    if (iconPath) return iconPath;
    
    // Try standard naming convention
    return `https://cdn.jsdelivr.net/gh/devicons/devicon/icons/${name.toLowerCase()}/${name.toLowerCase()}-original.svg`;
  };
  
  // Render a fallback for failed images
  const renderFallback = () => {
    return (
      <div className="w-8 h-8 rounded-full bg-primary/10 flex items-center justify-center text-xs font-medium">
        {name.substring(0, 2).toUpperCase()}
      </div>
    );
  };

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
        {imageError ? (
          renderFallback()
        ) : (
          <img 
            src={getIconPath()} 
            alt={name} 
            className="w-8 h-8 object-contain"
            loading="eager"
            onError={() => setImageError(true)}
          />
        )}
      </div>
      <span className="text-xs font-medium">
        {name}
      </span>
    </motion.div>
  );
};

export default SkillBadge; 