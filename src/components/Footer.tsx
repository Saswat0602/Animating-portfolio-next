"use client";

import React from 'react';
import { motion } from 'framer-motion';
import { Github, Linkedin, Mail, Twitter } from 'lucide-react';
import Link from 'next/link';

const Footer = () => {
  const currentYear = new Date().getFullYear();
  
  return (
    <footer className="bg-background/70 backdrop-blur-md border-t border-primary/10 py-10 px-4 mt-20">
      <div className="container mx-auto max-w-6xl">
        <div className="grid grid-cols-1 md:grid-cols-3 gap-8">
          {/* Logo & Description */}
          <div className="space-y-4">
            <motion.h3 
              className="text-2xl font-bold hover-text"
              whileHover={{ scale: 1.05 }}
              transition={{ type: "spring", stiffness: 400, damping: 10 }}
            >
              Saswat Ranjan
            </motion.h3>
            <p className="text-muted-foreground max-w-xs">
              A passionate Front-end React Developer & MERN stack Developer based in Bhubaneswar.
            </p>
            
            {/* Social Links */}
            <div className="flex space-x-4 pt-4">
              <motion.a 
                href="https://github.com/saswat" 
                target="_blank" 
                rel="noopener noreferrer"
                className="text-muted-foreground hover:text-primary transition-colors duration-300"
                whileHover={{ y: -5, scale: 1.2 }}
                whileTap={{ scale: 0.9 }}
              >
                <Github size={22} />
              </motion.a>
              <motion.a 
                href="https://linkedin.com/in/saswat" 
                target="_blank" 
                rel="noopener noreferrer"
                className="text-muted-foreground hover:text-primary transition-colors duration-300"
                whileHover={{ y: -5, scale: 1.2 }}
                whileTap={{ scale: 0.9 }}
              >
                <Linkedin size={22} />
              </motion.a>
              <motion.a 
                href="https://twitter.com/saswat" 
                target="_blank" 
                rel="noopener noreferrer"
                className="text-muted-foreground hover:text-primary transition-colors duration-300"
                whileHover={{ y: -5, scale: 1.2 }}
                whileTap={{ scale: 0.9 }}
              >
                <Twitter size={22} />
              </motion.a>
              <motion.a 
                href="mailto:contact@saswatmohanty.com" 
                className="text-muted-foreground hover:text-primary transition-colors duration-300"
                whileHover={{ y: -5, scale: 1.2 }}
                whileTap={{ scale: 0.9 }}
              >
                <Mail size={22} />
              </motion.a>
            </div>
          </div>

          {/* Quick Links */}
          <div>
            <h3 className="text-lg font-semibold mb-4 hover-text">Quick Links</h3>
            <ul className="space-y-2">
              {['About', 'Projects', 'Skills', 'Experience', 'Contact'].map((item) => (
                <li key={item}>
                  <motion.a 
                    href={`#${item.toLowerCase()}`}
                    className="text-muted-foreground hover:text-primary special-text-hover block transition-all duration-300"
                    whileHover={{ x: 5 }}
                    transition={{ type: "spring", stiffness: 400, damping: 10 }}
                  >
                    {item}
                  </motion.a>
                </li>
              ))}
            </ul>
          </div>

          {/* Contact Info */}
          <div>
            <h3 className="text-lg font-semibold mb-4 hover-text">Contact Info</h3>
            <ul className="space-y-3">
              <li className="flex space-x-3 items-start">
                <Mail size={18} className="text-primary mt-0.5" />
                <span className="text-muted-foreground">contact@saswatmohanty.com</span>
              </li>
              <li className="flex space-x-3 items-start">
                <motion.div 
                  className="h-32 w-full rounded-lg bg-gradient-to-br from-primary/20 to-secondary/20 overflow-hidden relative cursor-pointer"
                  whileHover={{ scale: 1.02 }}
                  transition={{ type: "spring", stiffness: 400, damping: 10 }}
                >
                  <div className="absolute inset-0 flex items-center justify-center p-4 backdrop-blur-sm">
                    <p className="text-center text-sm">
                      "Don't wish for it! Work for it!"
                    </p>
                  </div>
                </motion.div>
              </li>
            </ul>
          </div>
        </div>
        
        {/* Copyright */}
        <div className="border-t border-primary/10 mt-10 pt-6 flex flex-col md:flex-row justify-between items-center">
          <motion.p 
            className="text-muted-foreground text-sm"
            initial={{ opacity: 0, y: 20 }}
            whileInView={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.5 }}
            viewport={{ once: true }}
          >
            © {currentYear} Saswat Ranjan. All rights reserved.
          </motion.p>
          
          <motion.div 
            className="mt-4 md:mt-0"
            initial={{ opacity: 0, y: 20 }}
            whileInView={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.5, delay: 0.2 }}
            viewport={{ once: true }}
          >
            <span className="text-muted-foreground text-sm">Made with ❤️ using Next.js & Framer Motion</span>
          </motion.div>
        </div>
      </div>
    </footer>
  );
};

export default Footer; 