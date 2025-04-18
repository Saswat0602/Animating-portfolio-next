"use client";

import { useState, useEffect, useRef } from "react";
import Link from "next/link";
import { useTheme } from "next-themes";
import { motion, AnimatePresence } from "framer-motion";
import { Sun, Moon, Menu, X } from "lucide-react";
import { Button } from "./ui/button";

const navLinks = [
  { href: "#about-section", label: "About" },
  { href: "#experience-section", label: "Experience" },
  { href: "#skills-section", label: "Skills" },
  { href: "#projects", label: "Projects" },
  { href: "#contact-section", label: "Contact" },
];

const Navbar = () => {
  const [mounted, setMounted] = useState(false);
  const [mobileMenuOpen, setMobileMenuOpen] = useState(false);
  const [activeSection, setActiveSection] = useState("#about-section");
  const [scrolled, setScrolled] = useState(false);
  const { theme, setTheme } = useTheme();
  const mobileNavRef = useRef<HTMLDivElement>(null);

  // Handle theme toggle
  const toggleTheme = () => {
    setTheme(theme === "dark" ? "light" : "dark");
  };

  useEffect(() => {
    setMounted(true);

    // Basic scroll handler without throttling for immediate feedback
    const handleScroll = () => {
      // Find the section currently in view
      const scrollY = window.scrollY;

      // Update scrolled state for enhanced styling
      setScrolled(scrollY > 20);

      // Simple approach - find the closest section
      for (const link of navLinks) {
        const id = link.href.substring(1);
        const element = document.getElementById(id);

        if (!element) continue;

        const rect = element.getBoundingClientRect();
        if (rect.top <= 100 && rect.bottom >= 100) {
          setActiveSection(link.href);
          break;
        }
      }
    };

    // Add scroll listener
    window.addEventListener("scroll", handleScroll);

    // Initial check
    handleScroll();

    // Close mobile menu when clicking outside
    const handleClickOutside = (event: MouseEvent) => {
      if (mobileMenuOpen && mobileNavRef.current && !mobileNavRef.current.contains(event.target as Node)) {
        setMobileMenuOpen(false);
      }
    };

    document.addEventListener("mousedown", handleClickOutside);

    return () => {
      window.removeEventListener("scroll", handleScroll);
      document.removeEventListener("mousedown", handleClickOutside);
    };
  }, [mobileMenuOpen]);

  const scrollToSection = (href: string) => {
    try {
      const targetId = href.substring(1);

      // Try to find element by ID first
      let element = document.getElementById(targetId);

      // If element not found, try more approaches
      if (!element) {
        // Try with alternative ID formats (some sections might use -section suffix or not)
        if (targetId.endsWith("-section")) {
          element = document.getElementById(targetId.replace("-section", ""));
        } else {
          element = document.getElementById(`${targetId}-section`);
        }

        // If still not found, try using querySelector as a last resort
        if (!element) {
          // Try to find by a section with a matching data attribute or class
          element = document.querySelector(`section[id*="${targetId}"], div[id*="${targetId}"]`) as HTMLElement;

          // If nothing works, look for the closest match
          if (!element) {
            const allSections = document.querySelectorAll('section, div[id]');
            for (let i = 0; i < allSections.length; i++) {
              const section = allSections[i] as HTMLElement;
              if (section.id && section.id.toLowerCase().includes(targetId.toLowerCase().replace('-section', ''))) {
                element = section;
                break;
              }
            }
          }
        }
      }

      if (element) {
        // Close mobile menu immediately for better UX
        setMobileMenuOpen(false);
        
        // Simple scroll to element with offset
        const offset = 80; // Offset for the sticky header
        const elementPosition = element.getBoundingClientRect().top;
        const offsetPosition = elementPosition + window.scrollY - offset;

        // Force a small delay to ensure mobile menu has time to close
        setTimeout(() => {
          window.scrollTo({
            top: offsetPosition,
            behavior: "smooth"
          });
          
          // Set active section immediately for visual feedback
          setActiveSection(href);
          
          // Log for debugging
          console.log(`Scrolled to: ${element?.id || 'unnamed element'}`);
        }, 10);
      } else {
        console.warn(`Element with ID "${targetId}" not found`);
      }
    } catch (error) {
      console.error("Error in scrollToSection:", error);
    }
  };

  return (
    <header
      className="fixed top-0 left-0 right-0 z-[100] w-full transition-all duration-300 bg-background/95 backdrop-blur-md shadow-lg py-2 border-b border-primary/10"
    >
      <div className="container mx-auto px-4 flex items-center justify-between">
        <div className="text-xl font-bold">
          <Link href="/" className="flex items-center">
            <span className="text-primary">Saswat</span>
            <span className="text-foreground">.dev</span>
          </Link>
        </div>

        {/* Desktop Navigation */}
        <nav className="hidden md:flex items-center gap-6">
          {navLinks.map((link) => (
            <div
              key={link.href}
              className="relative"
            >
              <Link
                href={link.href}
                className={`relative px-1 py-2 text-sm font-medium transition-colors ${activeSection === link.href
                    ? "text-primary font-semibold"
                    : "text-foreground/80 hover:text-foreground hover:text-primary/90"
                  }`}
                onClick={(e) => {
                  e.preventDefault();
                  scrollToSection(link.href);
                }}
              >
                {link.label}
                {activeSection === link.href && (
                  <motion.span
                    layoutId="activeSection"
                    className="absolute bottom-0 left-0 w-full h-0.5 bg-primary rounded-full"
                    initial={{ opacity: 0 }}
                    animate={{ opacity: 1 }}
                    transition={{ duration: 0.2 }}
                  />
                )}
              </Link>
            </div>
          ))}
        </nav>

        <div className="flex items-center gap-4">
          <button
            onClick={toggleTheme}
            className="p-2 rounded-full bg-primary/10 text-primary hover:bg-primary/20 transition-colors"
            aria-label="Toggle theme"
          >
            {mounted && theme === "dark" ? (
              <Sun size={18} />
            ) : (
              <Moon size={18} />
            )}
          </button>

          <Button
            variant="ghost"
            size="icon"
            className="md:hidden"
            onClick={() => setMobileMenuOpen(!mobileMenuOpen)}
            aria-label="Toggle menu"
          >
            {mobileMenuOpen ? <X size={20} /> : <Menu size={20} />}
          </Button>
        </div>
      </div>

      <AnimatePresence>
        {mobileMenuOpen && (
          <motion.div
            ref={mobileNavRef}
            initial={{ opacity: 0, height: 0 }}
            animate={{ opacity: 1, height: "auto" }}
            exit={{ opacity: 0, height: 0 }}
            transition={{ duration: 0.3, ease: "easeInOut" }}
            className="md:hidden bg-background border-t border-border/40"
          >
            <nav className="flex flex-col py-4 px-6 space-y-4">
              {navLinks.map((link) => (
                <motion.div
                  key={link.href}
                  initial={{ x: -10, opacity: 0 }}
                  animate={{ x: 0, opacity: 1 }}
                  transition={{ duration: 0.2 }}
                >
                  <button
                    className={`block w-full text-left py-2 text-base font-medium ${activeSection === link.href ? "text-primary" : "text-foreground/80"}`}
                    onClick={() => scrollToSection(link.href)}
                  >
                    {link.label}
                  </button>
                </motion.div>
              ))}
            </nav>
          </motion.div>
        )}
      </AnimatePresence>
    </header>
  );
};

export default Navbar;
