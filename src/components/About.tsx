



import React, { useRef } from "react";
import { motion, useInView as framerUseInView, } from "framer-motion";



interface AboutProps {
    aboutData:any
}


const About = ({aboutData }: AboutProps) => {
  const aboutSectionRef = useRef<HTMLDivElement>(null);

    return (
        <section
            id="about-section"
            ref={aboutSectionRef}
            className="py-20 px-4 md:px-8 lg:px-16 relative"
        >
            <div className="max-w-6xl mx-auto">
                <motion.div
                    initial={{ opacity: 0, y: 20 }}
                    whileInView={{ opacity: 1, y: 0 }}
                    transition={{ duration: 0.3 }}
                    viewport={{ once: true, margin: "-50px" }}
                    className="mb-12 text-center"
                >
                    <h2 className="text-3xl md:text-4xl font-bold mb-4 hover-text">About Me</h2>
                    <motion.div
                        className="w-20 h-1 bg-primary mx-auto will-change-transform"
                        initial={{ width: 0 }}
                        whileInView={{ width: 80 }}
                        transition={{ duration: 0.4, ease: "easeOut" }}
                        viewport={{ once: true, margin: "-50px" }}
                    />
                </motion.div>

                <div className="grid grid-cols-1 md:grid-cols-2 gap-12 items-center content">
                    <motion.div
                        initial={{ opacity: 0, x: -50 }}
                        whileInView={{ opacity: 1, x: 0 }}
                        transition={{ duration: 0.5, delay: 0.2 }}
                        viewport={{ once: true }}
                        className="relative"
                    >
                        <div className="relative overflow-hidden rounded-lg border-4 border-primary/20 shadow-xl">
                            <img
                                src="https://images.unsplash.com/photo-1517694712202-14dd9538aa97?w=800&q=80"
                                alt="Laptop with code"
                                className="w-full h-auto object-cover"
                            />
                            <div className="absolute inset-0 bg-gradient-to-t from-black/60 to-transparent"></div>
                        </div>
                        <motion.div
                            className="absolute -bottom-6 -right-6 w-32 h-32 bg-primary/10 rounded-full blur-2xl"
                            initial={{ scale: 0 }}
                            whileInView={{ scale: 1 }}
                            transition={{ duration: 0.5, delay: 0.3 }}
                            viewport={{ once: true }}
                        />
                        <motion.div
                            className="absolute -top-6 -left-6 w-32 h-32 bg-primary/10 rounded-full blur-2xl"
                            initial={{ scale: 0 }}
                            whileInView={{ scale: 1 }}
                            transition={{ duration: 0.5, delay: 0.4 }}
                            viewport={{ once: true }}
                        />
                    </motion.div>

                    <motion.div
                        initial={{ opacity: 0, x: 50 }}
                        whileInView={{ opacity: 1, x: 0 }}
                        transition={{ duration: 0.5, delay: 0.4 }}
                        viewport={{ once: true }}
                    >
                        <motion.h3
                            className="text-2xl font-bold mb-4 hover-text"
                            whileHover={{ x: 5 }}
                            transition={{ type: "spring", stiffness: 300, damping: 10 }}
                        >
                            {aboutData.current_position}
                        </motion.h3>
                        <motion.p
                            className="text-muted-foreground mb-4 hover-text"
                            whileHover={{ opacity: 1 }}
                            initial={{ opacity: 0.8 }}
                            transition={{ duration: 0.2 }}
                        >
                            {aboutData.description}
                        </motion.p>
                        <motion.p
                            className="text-muted-foreground mb-6 hover-text"
                            whileHover={{ opacity: 1 }}
                            initial={{ opacity: 0.8 }}
                            transition={{ duration: 0.2 }}
                        >
                            {aboutData.description2}
                        </motion.p>

                        <div className="space-y-4">
                            <div className="flex items-start">
                                <motion.div
                                    className="mr-3 text-primary"
                                    whileHover={{ rotate: 360, scale: 1.2 }}
                                    transition={{ duration: 0.5 }}
                                >
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
                                    >
                                        <path d="M20 10c0 6-8 12-8 12s-8-6-8-12a8 8 0 0 1 16 0Z" />
                                        <circle cx="12" cy="10" r="3" />
                                    </svg>
                                </motion.div>
                                <div>
                                    <motion.h4
                                        className="font-medium hover-text"
                                        whileHover={{ x: 3 }}
                                        transition={{ type: "spring", stiffness: 400, damping: 10 }}
                                    >
                                        Location
                                    </motion.h4>
                                    <motion.p
                                        className="text-muted-foreground hover-text"
                                        whileHover={{ color: "var(--primary)" }}
                                        transition={{ duration: 0.2 }}
                                    >
                                        {aboutData.location}
                                    </motion.p>
                                </div>
                            </div>

                            <div className="flex items-start">
                                <motion.div
                                    className="mr-3 text-primary"
                                    whileHover={{ rotate: 360, scale: 1.2 }}
                                    transition={{ duration: 0.5 }}
                                >
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
                                    >
                                        <path d="M22 16.92v3a2 2 0 0 1-2.18 2 19.79 19.79 0 0 1-8.63-3.07 19.5 19.5 0 0 1-6-6 19.79 19.79 0 0 1-3.07-8.67A2 2 0 0 1 4.11 2h3a2 2 0 0 1 2 1.72 12.84 12.84 0 0 0 .7 2.81 2 2 0 0 1-.45 2.11L8.09 9.91a16 16 0 0 0 6 6l1.27-1.27a2 2 0 0 1 2.11-.45 12.84 12.84 0 0 0 2.81.7A2 2 0 0 1 22 16.92z" />
                                    </svg>
                                </motion.div>
                                <div>
                                    <motion.h4
                                        className="font-medium hover-text"
                                        whileHover={{ x: 3 }}
                                        transition={{ type: "spring", stiffness: 400, damping: 10 }}
                                    >
                                        Education
                                    </motion.h4>
                                    <motion.p
                                        className="text-muted-foreground hover-text"
                                        whileHover={{ color: "var(--primary)" }}
                                        transition={{ duration: 0.2 }}
                                    >
                                        {aboutData.education.postgraduate}
                                    </motion.p>
                                    <motion.p
                                        className="text-muted-foreground hover-text"
                                        whileHover={{ color: "var(--primary)" }}
                                        transition={{ duration: 0.2 }}
                                    >
                                        {aboutData.education.undergraduate}
                                    </motion.p>
                                </div>
                            </div>

                            <div className="flex items-start">
                                <motion.div
                                    className="mr-3 text-primary"
                                    whileHover={{ rotate: 360, scale: 1.2 }}
                                    transition={{ duration: 0.5 }}
                                >
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
                                    >
                                        <path d="M22 13a10 10 0 0 1-20 0c0-7 10-12 10-12s10 5 10 12z" />
                                        <path d="M14.6 8.5a4.2 4.2 0 0 0-4.2 0A4.2 4.2 0 0 0 8 12a4.2 4.2 0 0 0 2.4 3.5a4.2 4.2 0 0 0 4.2 0a4.2 4.2 0 0 0 2.4-3.5a4.2 4.2 0 0 0-2.4-3.5z" />
                                    </svg>
                                </motion.div>
                                <div>
                                    <motion.h4
                                        className="font-medium hover-text"
                                        whileHover={{ x: 3 }}
                                        transition={{ type: "spring", stiffness: 400, damping: 10 }}
                                    >
                                        Email
                                    </motion.h4>
                                    <motion.p
                                        className="text-muted-foreground hover-text"
                                        whileHover={{ color: "var(--primary)" }}
                                        transition={{ duration: 0.2 }}
                                    >
                                        {aboutData.email}
                                    </motion.p>
                                </div>
                            </div>
                        </div>
                    </motion.div>
                </div>
            </div>
        </section>
    )
}

export default About