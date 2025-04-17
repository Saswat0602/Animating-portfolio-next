"use client";

import { useState, useRef, useEffect } from "react";
import {
  Card,
  CardContent,
  CardDescription,
  CardFooter,
  CardHeader,
  CardTitle,
} from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { Button } from "@/components/ui/button";
import { ExternalLink, Github, ArrowUpRight, Eye } from "lucide-react";
import {
  motion,
  useMotionValue,
  useSpring,
  useTransform,
  AnimatePresence,
} from "framer-motion";

interface ProjectCardProps {
  title?: string;
  description?: string;
  image?: string;
  technologies?: string[];
  codeLink?: string;
  demoLink?: string;
  featured?: boolean;
  index?: number;
}

const ProjectCard = ({
  title = "Project Title",
  description = "A brief description of the project showcasing the key features and technologies used in development.",
  image = "https://images.unsplash.com/photo-1555066931-4365d14bab8c?w=800&q=80",
  technologies = ["React", "TypeScript", "Tailwind CSS", "Node.js"],
  codeLink = "https://github.com/",
  demoLink = "#",
  featured = false,
  index = 0,
}: ProjectCardProps) => {
  const cardRef = useRef<HTMLDivElement>(null);
  const [isHovered, setIsHovered] = useState(false);

  // Mouse position values
  const mouseX = useMotionValue(0);
  const mouseY = useMotionValue(0);

  // Enhanced spring physics for more fluid mouse movement
  const springConfig = { damping: 20, stiffness: 350 }; // Adjusted for more responsiveness
  const rotateX = useSpring(
    useTransform(mouseY, [0, 300], [8, -8]), // Increased rotation range
    springConfig,
  );
  const rotateY = useSpring(
    useTransform(mouseX, [0, 300], [-8, 8]), // Increased rotation range
    springConfig,
  );
  const translateX = useSpring(
    useTransform(mouseX, [0, 300], [-20, 20]), // Increased translation
    springConfig,
  );
  const translateY = useSpring(
    useTransform(mouseY, [0, 300], [-20, 20]), // Increased translation
    springConfig,
  );

  // Handle mouse move for enhanced 3D effect
  const handleMouseMove = (e: React.MouseEvent<HTMLDivElement>) => {
    if (!cardRef.current) return;

    const rect = cardRef.current.getBoundingClientRect();
    const offsetX = e.clientX - rect.left;
    const offsetY = e.clientY - rect.top;

    mouseX.set(offsetX);
    mouseY.set(offsetY);
  };

  // Enhanced magnetic button effect
  const codeButtonRef = useRef<HTMLButtonElement>(null);
  const demoButtonRef = useRef<HTMLButtonElement>(null);

  const handleButtonMouseMove = (
    e: React.MouseEvent<HTMLButtonElement>,
    buttonRef: React.RefObject<HTMLButtonElement>,
  ) => {
    if (!buttonRef.current) return;

    const rect = buttonRef.current.getBoundingClientRect();
    const x = e.clientX - rect.left - rect.width / 2;
    const y = e.clientY - rect.top - rect.height / 2;

    buttonRef.current.style.transform = `translate(${x * 0.4}px, ${y * 0.4}px) scale(1.05)`; // Enhanced movement and added scale
  };

  const handleButtonMouseLeave = (
    buttonRef: React.RefObject<HTMLButtonElement>,
  ) => {
    if (buttonRef.current) {
      buttonRef.current.style.transform = "translate(0, 0) scale(1)";
    }
  };

  return (
    <motion.div
      ref={cardRef}
      className="project-card relative w-full max-w-md bg-background border rounded-xl overflow-hidden shadow-lg transition-all duration-300 hover:shadow-xl backdrop-blur-sm"
      onMouseMove={handleMouseMove}
      onMouseEnter={() => setIsHovered(true)}
      onMouseLeave={() => setIsHovered(false)}
      style={{
        rotateX,
        rotateY,
        transformStyle: "preserve-3d",
        perspective: 1000,
      }}
      initial={{ opacity: 0, y: 30, scale: 0.95 }}
      whileInView={{ opacity: 1, y: 0, scale: 1 }}
      viewport={{ once: true, margin: "-100px" }}
      transition={{ duration: 0.6, delay: index * 0.1 }}
      data-cursor-text="View Project"
    >
      {/* Project Image with Enhanced Parallax Effect */}
      <div className="relative h-48 overflow-hidden">
        <motion.div
          className="absolute inset-0 bg-gradient-to-t from-black/70 to-transparent z-10"
          style={{ opacity: isHovered ? 0.9 : 0.5 }}
          transition={{ duration: 0.3 }}
        />
        <motion.img
          src={image}
          alt={title}
          className="w-full h-full object-cover"
          style={{
            scale: isHovered ? 1.08 : 1, // Increased scale effect
            translateX,
            translateY,
          }}
          transition={{ duration: 0.4 }} // Slightly longer for smoother effect
        />
        {featured && (
          <Badge className="absolute top-3 right-3 z-20 bg-primary text-primary-foreground shadow-md">
            Featured
          </Badge>
        )}

        {/* View overlay that appears on hover */}
        <AnimatePresence>
          {isHovered && (
            <motion.div
              className="absolute inset-0 z-20 flex items-center justify-center"
              initial={{ opacity: 0 }}
              animate={{ opacity: 1 }}
              exit={{ opacity: 0 }}
              transition={{ duration: 0.3 }}
            >
              <motion.div
                className="bg-primary/20 backdrop-blur-sm p-2 rounded-full"
                initial={{ scale: 0 }}
                animate={{ scale: 1 }}
                exit={{ scale: 0 }}
                transition={{ type: "spring", stiffness: 300, damping: 20 }}
              >
                <Eye className="w-8 h-8 text-white" />
              </motion.div>
            </motion.div>
          )}
        </AnimatePresence>
      </div>

      {/* Card Content with Enhanced Animations */}
      <Card className="border-0 shadow-none bg-transparent">
        <CardHeader className="p-4 pb-2">
          <CardTitle className="text-xl font-bold">
            <motion.span
              style={{ display: "inline-block" }}
              animate={isHovered ? { y: -3 } : { y: 0 }}
              transition={{ duration: 0.3 }}
            >
              {title}
            </motion.span>
          </CardTitle>
        </CardHeader>
        <CardContent className="p-4 pt-0">
          <CardDescription className="text-sm text-muted-foreground mb-4">
            {description}
          </CardDescription>
          <div className="flex flex-wrap gap-2 mt-2">
            {technologies.map((tech, index) => (
              <motion.div
                key={index}
                initial={{ opacity: 0, scale: 0.8 }}
                animate={{ opacity: 1, scale: 1 }}
                transition={{ delay: index * 0.05 + 0.2 }}
              >
                <Badge
                  variant="outline"
                  className="text-xs shadow-sm"
                  style={{
                    transform: isHovered
                      ? "translateZ(20px)"
                      : "translateZ(0px)",
                    transition: "transform 0.3s ease-out",
                  }}
                >
                  {tech}
                </Badge>
              </motion.div>
            ))}
          </div>
        </CardContent>
        <CardFooter className="p-4 pt-0 flex justify-between gap-2">
          <Button
            ref={codeButtonRef}
            variant="outline"
            size="sm"
            className="group relative overflow-hidden transition-all duration-300 shadow-sm"
            onMouseMove={(e) => handleButtonMouseMove(e, codeButtonRef)}
            onMouseLeave={() => handleButtonMouseLeave(codeButtonRef)}
            style={{
              transform: isHovered ? "translateZ(30px)" : "translateZ(0px)",
              transition: "transform 0.3s ease-out",
            }}
            asChild
          >
            <a href={codeLink} target="_blank" rel="noopener noreferrer">
              <Github className="w-4 h-4 mr-2 transition-transform group-hover:scale-110 group-hover:rotate-12" />
              Code
              <motion.span
                className="absolute bottom-0 left-0 w-full h-[2px] bg-primary"
                initial={{ scaleX: 0 }}
                whileHover={{ scaleX: 1 }}
                transition={{ duration: 0.3 }}
              />
            </a>
          </Button>
          <Button
            ref={demoButtonRef}
            size="sm"
            className="group relative overflow-hidden transition-all duration-300 shadow-md"
            onMouseMove={(e) => handleButtonMouseMove(e, demoButtonRef)}
            onMouseLeave={() => handleButtonMouseLeave(demoButtonRef)}
            style={{
              transform: isHovered ? "translateZ(30px)" : "translateZ(0px)",
              transition: "transform 0.3s ease-out",
            }}
            asChild
          >
            <a href={demoLink} target="_blank" rel="noopener noreferrer">
              <span>Live Demo</span>
              <ArrowUpRight className="w-4 h-4 ml-2 transition-transform group-hover:translate-x-1 group-hover:-translate-y-1" />
            </a>
          </Button>
        </CardFooter>
      </Card>

      {/* Enhanced Hover Glow Effect */}
      <motion.div
        className="absolute inset-0 bg-gradient-to-br from-primary/20 to-secondary/10 pointer-events-none rounded-xl"
        style={{ opacity: isHovered ? 1 : 0 }}
        transition={{ duration: 0.4 }}
      />

      {/* Corner shine effect */}
      <motion.div
        className="absolute -top-20 -right-20 w-40 h-40 bg-white/20 rotate-45 pointer-events-none"
        initial={{ opacity: 0 }}
        animate={{ opacity: isHovered ? 0.7 : 0 }}
        transition={{ duration: 0.3 }}
      />
    </motion.div>
  );
};

export default ProjectCard;
