import React, { useRef } from 'react';
import { motion } from 'framer-motion';
import Image from 'next/image';

interface Project {
  project_name: string;
  code_link: string;
  image_url?: string;
  demo_link?: string;
  description?: string;
  technologies?: string[];
}

interface ProjectsSectionProps {
  id?: string;
  className?: string;
  projects: Project[];
}

const ProjectCard: React.FC<Project & { index: number }> = ({
  project_name,
  code_link,
  image_url,
  demo_link,
  description,
  technologies,
  index
}) => {
  return (
    <motion.div
      initial={{ opacity: 0, y: 30 }}
      whileInView={{ opacity: 1, y: 0 }}
      transition={{
        duration: 0.5,
        delay: index * 0.1,
        ease: "easeOut"
      }}
      viewport={{ once: true, margin: "-50px" }}
      className="bg-card rounded-xl overflow-hidden shadow-lg border border-primary/10 hover:border-primary/30 transition-all duration-300 h-full flex flex-col"
    >
      <div className="relative w-full h-48 overflow-hidden">
        <motion.div
          className="absolute inset-0 bg-primary/20"
          whileHover={{ opacity: 0 }}
          transition={{ duration: 0.3 }}
        />
        <motion.div
          className="w-full h-full bg-muted/50"
          whileHover={{ scale: 1.05 }}
          transition={{ duration: 0.5, type: "spring", stiffness: 300, damping: 10 }}
        >
          {image_url ? (
            <img
              src={image_url}
              alt={project_name}
              className="w-full h-full object-cover"
            />
          ) : (
            <div className="w-full h-full flex items-center justify-center bg-gradient-to-br from-primary/10 to-muted">
              <motion.span 
                className="text-2xl font-bold text-foreground/70"
                whileHover={{ scale: 1.1, color: "var(--primary)" }}
                transition={{ duration: 0.3 }}
              >
                {project_name}
              </motion.span>
            </div>
          )}
        </motion.div>
      </div>
      
      <div className="p-6 flex flex-col flex-grow">
        <motion.h3 
          className="text-xl font-bold mb-2"
          whileHover={{ x: 3 }}
          transition={{ type: "spring", stiffness: 300, damping: 10 }}
        >
          {project_name}
        </motion.h3>
        
        <motion.p 
          className="text-muted-foreground mb-4 flex-grow"
          initial={{ opacity: 0.8 }}
          whileHover={{ opacity: 1 }}
          transition={{ duration: 0.2 }}
        >
          {description || "A fascinating project showcasing creative problem-solving and technical skills."}
        </motion.p>
        
        {technologies && technologies.length > 0 && (
          <div className="mb-4 flex flex-wrap gap-2">
            {technologies.map((tech, idx) => (
              <motion.span
                key={idx}
                initial={{ opacity: 0.8, scale: 0.9 }}
                whileHover={{ 
                  scale: 1.1, 
                  opacity: 1,
                  backgroundColor: "var(--primary)",
                  color: "var(--background)" 
                }}
                transition={{ duration: 0.2 }}
                className="px-2 py-1 text-xs rounded-md bg-muted text-foreground/80 border border-primary/10"
              >
                {tech}
              </motion.span>
            ))}
          </div>
        )}
        
        <div className="flex space-x-3 mt-auto">
          <motion.a
            href={code_link}
            target="_blank"
            rel="noopener noreferrer"
            whileHover={{ scale: 1.05, y: -3 }}
            whileTap={{ scale: 0.97 }}
            transition={{ duration: 0.2 }}
            className="px-4 py-2 bg-primary text-primary-foreground rounded-md text-sm font-medium flex items-center justify-center"
          >
            <svg
              xmlns="http://www.w3.org/2000/svg"
              width="16"
              height="16"
              viewBox="0 0 24 24"
              fill="none"
              stroke="currentColor"
              strokeWidth="2"
              strokeLinecap="round"
              strokeLinejoin="round"
              className="mr-2"
            >
              <path d="M9 19c-5 1.5-5-2.5-7-3m14 6v-3.87a3.37 3.37 0 0 0-.94-2.61c3.14-.35 6.44-1.54 6.44-7A5.44 5.44 0 0 0 20 4.77 5.07 5.07 0 0 0 19.91 1S18.73.65 16 2.48a13.38 13.38 0 0 0-7 0C6.27.65 5.09 1 5.09 1A5.07 5.07 0 0 0 5 4.77a5.44 5.44 0 0 0-1.5 3.78c0 5.42 3.3 6.61 6.44 7A3.37 3.37 0 0 0 9 18.13V22" />
            </svg>
            Code
          </motion.a>
          
          {demo_link && (
            <motion.a
              href={demo_link}
              target="_blank"
              rel="noopener noreferrer"
              whileHover={{ scale: 1.05, y: -3 }}
              whileTap={{ scale: 0.97 }}
              transition={{ duration: 0.2 }}
              className="px-4 py-2 bg-background border border-primary/20 text-foreground rounded-md text-sm font-medium flex items-center justify-center"
            >
              <svg
                xmlns="http://www.w3.org/2000/svg"
                width="16"
                height="16"
                viewBox="0 0 24 24"
                fill="none"
                stroke="currentColor"
                strokeWidth="2"
                strokeLinecap="round"
                strokeLinejoin="round"
                className="mr-2"
              >
                <path d="M18 13v6a2 2 0 0 1-2 2H5a2 2 0 0 1-2-2V8a2 2 0 0 1 2-2h6" />
                <polyline points="15 3 21 3 21 9" />
                <line x1="10" y1="14" x2="21" y2="3" />
              </svg>
              Demo
            </motion.a>
          )}
        </div>
      </div>
    </motion.div>
  );
};

const ProjectsSection: React.FC<ProjectsSectionProps> = ({
  id = 'projects-section',
  className = '',
  projects = []
}) => {
  const projectsSectionRef = useRef<HTMLDivElement>(null);

  // Extend projects with default data if needed
  const enhancedProjects = projects.map(project => ({
    ...project,
    image_url: project.image_url || undefined,
    demo_link: project.demo_link || undefined,
    description: project.description || undefined,
    technologies: project.technologies || [
      "React", 
      "TypeScript", 
      "Node.js"
    ]
  }));

  return (
    <section
      id={id}
      ref={projectsSectionRef}
      className={`py-20 px-4 md:px-8 lg:px-16 bg-muted/30 relative overflow-hidden ${className}`}
    >
      <div className="max-w-6xl mx-auto">
        <motion.div
          initial={{ opacity: 0, y: 50 }}
          whileInView={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.5 }}
          viewport={{ once: true }}
          className="mb-12 text-center"
        >
          <motion.h2 
            className="text-3xl md:text-4xl font-bold mb-4"
            whileHover={{ scale: 1.05 }}
            transition={{ type: "spring", stiffness: 300, damping: 10 }}
          >
            My Projects
          </motion.h2>
          <motion.div
            className="w-20 h-1 bg-primary mx-auto"
            initial={{ width: 0 }}
            whileInView={{ width: 80 }}
            transition={{ duration: 0.8, ease: "easeOut" }}
            viewport={{ once: true }}
          />
          <motion.p
            className="mt-4 text-muted-foreground max-w-2xl mx-auto"
            initial={{ opacity: 0, y: 20 }}
            whileInView={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.5, delay: 0.2 }}
            viewport={{ once: true }}
          >
            Here are some of my recent projects. Each one represents a unique challenge and learning opportunity.
          </motion.p>
        </motion.div>

        {/* Add decorative elements */}
        <motion.div 
          className="absolute -top-40 -right-40 w-80 h-80 bg-primary/5 rounded-full blur-3xl -z-10"
          initial={{ opacity: 0 }}
          whileInView={{ opacity: 1 }}
          transition={{ duration: 0.8 }}
          viewport={{ once: true }}
        />
        
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
          {enhancedProjects.map((project, index) => (
            <ProjectCard
              key={index}
              index={index}
              {...project}
            />
          ))}
        </div>
      </div>
    </section>
  );
};

export default ProjectsSection; 