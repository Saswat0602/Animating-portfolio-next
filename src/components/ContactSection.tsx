import React, { useRef } from 'react';
import { motion } from 'framer-motion';
import { Mail, MapPin, Phone, Send } from 'lucide-react';
import { Button } from './ui/button';

interface ContactSectionProps {
  id?: string;
  className?: string;
  location?: {
    address: string;
    city: string;
    country: string;
    mapUrl: string;
  };
}

const ContactSection: React.FC<ContactSectionProps> = ({ 
  id = 'contact-section',
  className = '',
  location = {
    address: "Some Street Name",
    city: "Bhubaneswar",
    country: "India",
    mapUrl: "https://www.google.com/maps/embed?pb=!1m18!1m12!1m3!1d119743.58457775935!2d85.75041503952645!3d20.30071931323742!2m3!1f0!2f0!3f0!3m2!1i1024!2i768!4f13.1!3m3!1m2!1s0x3a1908e0596ab70f%3A0xdaedf8e9f23836c3!2sBhubaneswar%2C%20Odisha%2C%20India!5e0!3m2!1sen!2sin!4v1689873453364!5m2!1sen!2sin"
  }
}) => {
  const contactSectionRef = useRef<HTMLDivElement>(null);
  
  const formInputVariants = {
    initial: { y: 20, opacity: 0 },
    animate: (i: number) => ({ 
      y: 0, 
      opacity: 1,
      transition: {
        delay: 0.1 * i,
        duration: 0.4,
        ease: 'easeOut'
      }
    })
  };

  return (
    <section
      id={id}
      ref={contactSectionRef}
      className={`py-20 px-4 md:px-8 lg:px-16 relative overflow-hidden ${className}`}
    >
      {/* Background elements */}
      <div className="absolute -top-32 -right-32 w-64 h-64 bg-primary/5 rounded-full blur-3xl -z-10" />
      <div className="absolute -bottom-32 -left-32 w-64 h-64 bg-primary/5 rounded-full blur-3xl -z-10" />
      
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
              Get In Touch
            </span>
          </h2>
          <motion.div
            className="w-20 h-1 bg-primary mx-auto"
            initial={{ width: 0 }}
            whileInView={{ width: 80 }}
            transition={{ duration: 0.8, ease: "easeOut" }}
            viewport={{ once: true, margin: "-100px" }}
          />
          <p className="mt-4 text-muted-foreground max-w-xl mx-auto">
            Feel free to reach out for collaboration, inquiries, or just to say hello!
          </p>
        </motion.div>

        <div className="grid grid-cols-1 lg:grid-cols-2 gap-10">
          {/* Contact Form */}
          <motion.div
            initial={{ opacity: 0, x: -30 }}
            whileInView={{ opacity: 1, x: 0 }}
            transition={{ duration: 0.5 }}
            viewport={{ once: true, margin: "-100px" }}
            className="bg-card rounded-xl p-6 shadow-lg border border-primary/10 hover:border-primary/30 transition-all duration-300"
          >
            <h3 className="text-xl font-bold mb-6 flex items-center">
              <Mail className="mr-2 h-5 w-5 text-primary" />
              Send Me a Message
            </h3>
            
            <form className="space-y-4">
              <motion.div custom={1} variants={formInputVariants} initial="initial" whileInView="animate" viewport={{ once: true }}>
                <label htmlFor="name" className="block text-sm font-medium mb-1">Your Name</label>
                <input 
                  type="text" 
                  id="name" 
                  className="w-full px-4 py-2 rounded-md border border-muted bg-background focus:outline-none focus:ring-2 focus:ring-primary/50 transition"
                  placeholder="John Doe"
                />
              </motion.div>
              
              <motion.div custom={2} variants={formInputVariants} initial="initial" whileInView="animate" viewport={{ once: true }}>
                <label htmlFor="email" className="block text-sm font-medium mb-1">Your Email</label>
                <input 
                  type="email" 
                  id="email" 
                  className="w-full px-4 py-2 rounded-md border border-muted bg-background focus:outline-none focus:ring-2 focus:ring-primary/50 transition"
                  placeholder="john@example.com"
                />
              </motion.div>
              
              <motion.div custom={3} variants={formInputVariants} initial="initial" whileInView="animate" viewport={{ once: true }}>
                <label htmlFor="subject" className="block text-sm font-medium mb-1">Subject</label>
                <input 
                  type="text" 
                  id="subject" 
                  className="w-full px-4 py-2 rounded-md border border-muted bg-background focus:outline-none focus:ring-2 focus:ring-primary/50 transition"
                  placeholder="Project Inquiry"
                />
              </motion.div>
              
              <motion.div custom={4} variants={formInputVariants} initial="initial" whileInView="animate" viewport={{ once: true }}>
                <label htmlFor="message" className="block text-sm font-medium mb-1">Message</label>
                <textarea 
                  id="message" 
                  rows={4} 
                  className="w-full px-4 py-2 rounded-md border border-muted bg-background focus:outline-none focus:ring-2 focus:ring-primary/50 transition"
                  placeholder="Your message here..."
                ></textarea>
              </motion.div>
              
              <motion.div custom={5} variants={formInputVariants} initial="initial" whileInView="animate" viewport={{ once: true }}>
                <Button className="w-full group">
                  <span className="flex items-center">
                    Send Message
                    <Send className="ml-2 h-4 w-4 group-hover:translate-x-1 transition-transform" />
                  </span>
                </Button>
              </motion.div>
            </form>
          </motion.div>
          
          {/* Map and Contact Info */}
          <motion.div
            initial={{ opacity: 0, x: 30 }}
            whileInView={{ opacity: 1, x: 0 }}
            transition={{ duration: 0.5 }}
            viewport={{ once: true, margin: "-100px" }}
            className="space-y-6"
          >
            {/* Map */}
            <div className="bg-card rounded-xl overflow-hidden border border-primary/10 hover:border-primary/30 transition-all duration-300 h-72 shadow-lg">
              <iframe 
                src={location.mapUrl}
                width="100%" 
                height="100%" 
                style={{ border: 0 }} 
                allowFullScreen={false} 
                loading="lazy" 
                referrerPolicy="no-referrer-when-downgrade"
                className="grayscale hover:grayscale-0 transition-all duration-500"
              ></iframe>
            </div>
            
            {/* Contact Info Card */}
            <div className="bg-card rounded-xl p-6 shadow-lg border border-primary/10 hover:border-primary/30 transition-all duration-300">
              <h3 className="text-xl font-bold mb-6">Contact Information</h3>
              
              <div className="space-y-4">
                <motion.div 
                  className="flex items-start"
                  initial={{ opacity: 0, y: 10 }}
                  whileInView={{ opacity: 1, y: 0 }}
                  transition={{ delay: 0.1, duration: 0.3 }}
                  viewport={{ once: true }}
                >
                  <MapPin className="mt-1 mr-3 h-5 w-5 text-primary flex-shrink-0" />
                  <div>
                    <p className="font-medium">Location</p>
                    <p className="text-muted-foreground text-sm">
                      {location.address}<br />
                      {location.city}, {location.country}
                    </p>
                  </div>
                </motion.div>
                
                <motion.div 
                  className="flex items-start"
                  initial={{ opacity: 0, y: 10 }}
                  whileInView={{ opacity: 1, y: 0 }}
                  transition={{ delay: 0.2, duration: 0.3 }}
                  viewport={{ once: true }}
                >
                  <Phone className="mt-1 mr-3 h-5 w-5 text-primary flex-shrink-0" />
                  <div>
                    <p className="font-medium">Phone</p>
                    <p className="text-muted-foreground text-sm">+91 1234567890</p>
                  </div>
                </motion.div>
                
                <motion.div 
                  className="flex items-start"
                  initial={{ opacity: 0, y: 10 }}
                  whileInView={{ opacity: 1, y: 0 }}
                  transition={{ delay: 0.3, duration: 0.3 }}
                  viewport={{ once: true }}
                >
                  <Mail className="mt-1 mr-3 h-5 w-5 text-primary flex-shrink-0" />
                  <div>
                    <p className="font-medium">Email</p>
                    <p className="text-muted-foreground text-sm">contact@yourwebsite.com</p>
                  </div>
                </motion.div>
              </div>
              
              {/* Social Media Links */}
              <div className="mt-6 pt-6 border-t border-muted">
                <p className="text-sm font-medium mb-3">Connect on Social Media</p>
                <div className="flex space-x-4">
                  {/* Add your social media icons here */}
                  <a href="#" className="p-2 rounded-full bg-muted hover:bg-primary/10 transition-colors duration-300">
                    <svg className="h-5 w-5" fill="currentColor" viewBox="0 0 24 24" aria-hidden="true">
                      <path d="M12 2C6.477 2 2 6.484 2 12.017c0 4.425 2.865 8.18 6.839 9.504.5.092.682-.217.682-.483 0-.237-.008-.868-.013-1.703-2.782.605-3.369-1.343-3.369-1.343-.454-1.158-1.11-1.466-1.11-1.466-.908-.62.069-.608.069-.608 1.003.07 1.531 1.032 1.531 1.032.892 1.53 2.341 1.088 2.91.832.092-.647.35-1.088.636-1.338-2.22-.253-4.555-1.113-4.555-4.951 0-1.093.39-1.988 1.029-2.688-.103-.253-.446-1.272.098-2.65 0 0 .84-.27 2.75 1.026A9.564 9.564 0 0112 6.844c.85.004 1.705.115 2.504.337 1.909-1.296 2.747-1.027 2.747-1.027.546 1.379.202 2.398.1 2.651.64.7 1.028 1.595 1.028 2.688 0 3.848-2.339 4.695-4.566 4.943.359.309.678.92.678 1.855 0 1.338-.012 2.419-.012 2.747 0 .268.18.58.688.482A10.019 10.019 0 0022 12.017C22 6.484 17.522 2 12 2z" />
                    </svg>
                  </a>
                  <a href="#" className="p-2 rounded-full bg-muted hover:bg-primary/10 transition-colors duration-300">
                    <svg className="h-5 w-5" fill="currentColor" viewBox="0 0 24 24" aria-hidden="true">
                      <path d="M22.162 5.656a8.384 8.384 0 01-2.402.658A4.196 4.196 0 0021.6 4c-.82.488-1.719.83-2.656 1.015a4.182 4.182 0 00-7.126 3.814 11.874 11.874 0 01-8.62-4.37 4.168 4.168 0 00-.566 2.103c0 1.45.738 2.731 1.86 3.481a4.168 4.168 0 01-1.894-.523v.052a4.185 4.185 0 003.355 4.101 4.21 4.21 0 01-1.89.072A4.185 4.185 0 007.97 16.65a8.394 8.394 0 01-6.191 1.732 11.83 11.83 0 006.41 1.88c7.693 0 11.9-6.373 11.9-11.9 0-.18-.005-.362-.013-.54a8.496 8.496 0 002.087-2.165z" />
                    </svg>
                  </a>
                  <a href="#" className="p-2 rounded-full bg-muted hover:bg-primary/10 transition-colors duration-300">
                    <svg className="h-5 w-5" fill="currentColor" viewBox="0 0 24 24" aria-hidden="true">
                      <path d="M8.29 20.251c7.547 0 11.675-6.253 11.675-11.675 0-.178 0-.355-.012-.53A8.348 8.348 0 0022 5.92a8.19 8.19 0 01-2.357.646 4.118 4.118 0 001.804-2.27 8.224 8.224 0 01-2.605.996 4.107 4.107 0 00-6.993 3.743 11.65 11.65 0 01-8.457-4.287 4.106 4.106 0 001.27 5.477A4.072 4.072 0 012.8 9.713v.052a4.105 4.105 0 003.292 4.022 4.095 4.095 0 01-1.853.07 4.108 4.108 0 003.834 2.85A8.233 8.233 0 012 18.407a11.616 11.616 0 006.29 1.84" />
                    </svg>
                  </a>
                  <a href="#" className="p-2 rounded-full bg-muted hover:bg-primary/10 transition-colors duration-300">
                    <svg className="h-5 w-5" fill="currentColor" viewBox="0 0 24 24" aria-hidden="true">
                      <path d="M19 0h-14c-2.761 0-5 2.239-5 5v14c0 2.761 2.239 5 5 5h14c2.762 0 5-2.239 5-5v-14c0-2.761-2.238-5-5-5zm-11 19h-3v-11h3v11zm-1.5-12.268c-.966 0-1.75-.79-1.75-1.764s.784-1.764 1.75-1.764 1.75.79 1.75 1.764-.783 1.764-1.75 1.764zm13.5 12.268h-3v-5.604c0-3.368-4-3.113-4 0v5.604h-3v-11h3v1.765c1.396-2.586 7-2.777 7 2.476v6.759z" />
                    </svg>
                  </a>
                </div>
              </div>
            </div>
          </motion.div>
        </div>
      </div>
    </section>
  );
};

export default ContactSection; 