import React, { useRef } from 'react';
import { motion } from 'framer-motion';
import SkillBadge from './SkillBadge';
import { frontendSkills, backendSkills, otherSkills } from '../data/skillsData';

interface SkillsSectionProps {
  id?: string;
  className?: string;
}

const SkillsSection: React.FC<SkillsSectionProps> = ({ 
  id = 'skills-section',
  className = ''
}) => {
  const skillsSectionRef = useRef<HTMLDivElement>(null);

  return (
    <section
      id={id}
      ref={skillsSectionRef} 
      className={`py-20 px-4 md:px-8 lg:px-16 bg-muted/30 relative overflow-hidden ${className}`}
    >
      <div className="max-w-6xl mx-auto">
        <motion.div
          initial={{ opacity: 0, y: 30 }}
          whileInView={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.4 }}
          viewport={{ once: true, margin: "-100px" }}
          className="mb-12 text-center"
        >
          <h2 className="text-3xl md:text-4xl font-bold mb-4 relative group">
            <span className="bg-clip-text text-transparent bg-gradient-to-r from-primary to-primary/70 group-hover:from-primary/70 group-hover:to-primary transition-all duration-500">
              My Skills
            </span>
          </h2>
          <motion.div
            className="w-20 h-1 bg-primary mx-auto"
            initial={{ width: 0 }}
            whileInView={{ width: 80 }}
            transition={{ duration: 0.8, ease: "easeOut" }}
            viewport={{ once: true, margin: "-100px" }}
          />
        </motion.div>

        {/* Skills categories */}
        <div className="grid grid-cols-1 md:grid-cols-3 gap-8 mb-12">
          {/* Frontend Skills */}
          <motion.div
            initial={{ opacity: 0, y: 30 }}
            whileInView={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.4 }}
            viewport={{ once: true, margin: "-100px" }}
            className="bg-card rounded-xl p-6 shadow-lg border border-primary/10 hover:border-primary/30 transition-all duration-300"
            whileHover={{ y: -5, boxShadow: "0 20px 25px -5px rgba(0, 0, 0, 0.1), 0 10px 10px -5px rgba(0, 0, 0, 0.04)" }}
          >
            <div className="flex items-center mb-4">
              <div className="w-12 h-12 rounded-full bg-primary/10 flex items-center justify-center mr-4">
                <svg
                  xmlns="http://www.w3.org/2000/svg"
                  width="24"
                  height="24"
                  viewBox="0 0 24 24"
                  fill="none"
                  stroke="currentColor"
                  strokeWidth="2"
                  strokeLinecap="round"
                  strokeLinejoin="round"
                  className="text-primary"
                >
                  <rect width="18" height="18" x="3" y="3" rx="2" />
                  <path d="M7 7h10" />
                  <path d="M7 12h10" />
                  <path d="M7 17h10" />
                </svg>
              </div>
              <h3 className="text-xl font-bold hover:text-primary transition-colors duration-300">Frontend</h3>
            </div>
            <div className="grid grid-cols-2 sm:grid-cols-3 gap-4">
              {frontendSkills.map((skill, index) => (
                <SkillBadge 
                  key={skill.name} 
                  name={skill.name} 
                  index={index} 
                  iconPath={skill.icon}
                />
              ))}
            </div>
          </motion.div>

          {/* Backend Skills */}
          <motion.div
            initial={{ opacity: 0, y: 30 }}
            whileInView={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.4, delay: 0.1 }}
            viewport={{ once: true, margin: "-100px" }}
            className="bg-card rounded-xl p-6 shadow-lg border border-primary/10 hover:border-primary/30 transition-all duration-300"
            whileHover={{ y: -5, boxShadow: "0 20px 25px -5px rgba(0, 0, 0, 0.1), 0 10px 10px -5px rgba(0, 0, 0, 0.04)" }}
          >
            <div className="flex items-center mb-4">
              <div className="w-12 h-12 rounded-full bg-primary/10 flex items-center justify-center mr-4">
                <svg
                  xmlns="http://www.w3.org/2000/svg"
                  width="24"
                  height="24"
                  viewBox="0 0 24 24"
                  fill="none"
                  stroke="currentColor"
                  strokeWidth="2"
                  strokeLinecap="round"
                  strokeLinejoin="round"
                  className="text-primary"
                >
                  <path d="M18 6V4H6v2" />
                  <path d="M18 16v2H6v-2" />
                  <path d="M12 4v16" />
                </svg>
              </div>
              <h3 className="text-xl font-bold hover:text-primary transition-colors duration-300">Backend</h3>
            </div>
            <div className="grid grid-cols-2 sm:grid-cols-3 gap-4">
              {backendSkills.map((skill, index) => (
                <SkillBadge 
                  key={skill.name} 
                  name={skill.name} 
                  index={index} 
                  iconPath={skill.icon}
                />
              ))}
            </div>
          </motion.div>

          {/* Other Skills */}
          <motion.div
            initial={{ opacity: 0, y: 30 }}
            whileInView={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.4, delay: 0.2 }}
            viewport={{ once: true, margin: "-100px" }}
            className="bg-card rounded-xl p-6 shadow-lg border border-primary/10 hover:border-primary/30 transition-all duration-300"
            whileHover={{ y: -5, boxShadow: "0 20px 25px -5px rgba(0, 0, 0, 0.1), 0 10px 10px -5px rgba(0, 0, 0, 0.04)" }}
          >
            <div className="flex items-center mb-4">
              <div className="w-12 h-12 rounded-full bg-primary/10 flex items-center justify-center mr-4">
                <svg
                  xmlns="http://www.w3.org/2000/svg"
                  width="24"
                  height="24"
                  viewBox="0 0 24 24"
                  fill="none"
                  stroke="currentColor"
                  strokeWidth="2"
                  strokeLinecap="round"
                  strokeLinejoin="round"
                  className="text-primary"
                >
                  <path d="M12 3a6 6 0 0 0 9 9 9 9 0 1 1-9-9Z" />
                  <path d="M15 9a6 6 0 0 0 9 0 9 9 0 1 0-9 0Z" />
                </svg>
              </div>
              <h3 className="text-xl font-bold hover:text-primary transition-colors duration-300">Tools & Others</h3>
            </div>
            <div className="grid grid-cols-2 sm:grid-cols-3 gap-4">
              {otherSkills.map((skill, index) => (
                <SkillBadge 
                  key={skill.name} 
                  name={skill.name} 
                  index={index} 
                  iconPath={skill.icon}
                />
              ))}
            </div>
          </motion.div>
        </div>
      </div>
    </section>
  );
};

export default SkillsSection; 