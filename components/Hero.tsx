"use client";

import Image, { StaticImageData } from "next/image";
import Link from "next/link";
import { ExternalLink } from "lucide-react";
import { motion, useAnimation, Variants } from "framer-motion";
import { useEffect, useState } from "react";

interface HeroProps {
  profile: {
    name: string;
    summary: string;
  };
  profileImage: StaticImageData | string;
}

export default function Hero({ profile, profileImage }: HeroProps) {
  const [mousePosition, setMousePosition] = useState({ x: 0, y: 0 });
  const [isMounted, setIsMounted] = useState(false);

  useEffect(() => {
    setIsMounted(true);
    const handleMouseMove = (e: MouseEvent) => {
      setMousePosition({ x: e.clientX, y: e.clientY });
    };

    window.addEventListener("mousemove", handleMouseMove);
    return () => window.removeEventListener("mousemove", handleMouseMove);
  }, []);

  // Animation variants
  const containerVariants: Variants = {
    hidden: { opacity: 0 },
    visible: {
      opacity: 1,
      transition: {
        staggerChildren: 0.15,
        delayChildren: 0.2,
      },
    },
  };

  const itemVariants: Variants = {
    hidden: { opacity: 0, y: 30 },
    visible: { 
      opacity: 1, 
      y: 0, 
      transition: { 
        duration: 0.8, 
        ease: [0.16, 1, 0.3, 1] 
      } 
    },
  };

  const imageVariants: Variants = {
    hidden: { opacity: 0, scale: 0.8, rotate: -5 },
    visible: { 
      opacity: 1, 
      scale: 1, 
      rotate: 0,
      transition: { 
        duration: 1, 
        type: "spring", 
        bounce: 0.4 
      } 
    },
  };

  // Generate deterministic but random-looking particle initial positions
  const particles = Array.from({ length: 15 }).map((_, i) => ({
    id: i,
    size: 4 + (i % 6), // 4 to 9 px
    x: (i * 27) % 100, // 0 to 100 %
    y: (i * 43) % 100, // 0 to 100 %
    duration: 15 + (i % 10), // 15 to 24s
    delay: i % 5,
  }));

  return (
    <section id="about" className="relative min-h-[90vh] flex items-center justify-center pt-24 pb-16 navy-gradient text-white overflow-hidden">
      {/* Interactive Mouse Tracking Glow */}
      {isMounted && (
        <motion.div 
          animate={{ 
            x: mousePosition.x - 250, 
            y: mousePosition.y - 250,
          }}
          transition={{ type: "spring", damping: 40, stiffness: 50, mass: 0.8 }}
          className="absolute top-0 left-0 w-[500px] h-[500px] bg-orange/15 rounded-full blur-[120px] pointer-events-none z-0 mix-blend-screen"
        />
      )}

      {/* Floating Particles */}
      <div className="absolute inset-0 z-0 pointer-events-none opacity-40">
        {particles.map((p) => (
          <motion.div
            key={p.id}
            initial={{ x: `${p.x}vw`, y: `${p.y}vh`, opacity: 0 }}
            animate={{ 
              y: [`${p.y}vh`, `${p.y - 15}vh`, `${p.y}vh`],
              x: [`${p.x}vw`, `${p.x + 10}vw`, `${p.x}vw`],
              opacity: [0.2, 0.8, 0.2]
            }}
            transition={{
              duration: p.duration,
              repeat: Infinity,
              ease: "linear",
              delay: p.delay
            }}
            className="absolute rounded-full bg-white shadow-[0_0_10px_rgba(255,255,255,0.8)]"
            style={{ width: p.size, height: p.size }}
          />
        ))}
      </div>

      {/* Large Ambient Background elements */}
      <motion.div 
        animate={{ 
          scale: [1, 1.2, 1],
          opacity: [0.3, 0.6, 0.3],
          rotate: [0, 90, 0]
        }}
        transition={{ duration: 20, repeat: Infinity, ease: "easeInOut" }}
        className="absolute top-[10%] right-[10%] w-[600px] h-[600px] bg-cyan-500/10 rounded-full blur-[150px] pointer-events-none z-0"
      />
      <motion.div 
        animate={{ 
          scale: [1, 1.4, 1],
          opacity: [0.2, 0.5, 0.2],
          rotate: [0, -90, 0]
        }}
        transition={{ duration: 25, repeat: Infinity, ease: "easeInOut", delay: 2 }}
        className="absolute bottom-[-10%] left-[-10%] w-[500px] h-[500px] bg-blue-500/10 rounded-full blur-[150px] pointer-events-none z-0"
      />
      
      <div className="max-w-7xl mx-auto px-6 w-full grid lg:grid-cols-12 gap-12 items-center relative z-10">
        {/* Profile Image Column */}
        <div className="lg:col-span-5 flex justify-center lg:justify-end">
          <motion.div 
            variants={imageVariants}
            initial="hidden"
            animate="visible"
            className="relative group cursor-pointer"
            whileHover={{ scale: 1.03 }}
            transition={{ type: "spring", stiffness: 300, damping: 20 }}
          >
            <div className="absolute inset-0 bg-orange rounded-full rotate-6 group-hover:rotate-0 transition-transform duration-700 scale-105 opacity-30 blur-md group-hover:blur-xl group-hover:opacity-50"></div>
            <div className="relative w-72 h-72 md:w-96 md:h-96 bg-white p-2 rounded-full shadow-2xl overflow-hidden border-4 border-white group-hover:border-orange/50 transition-colors duration-500">
              <Image
                src={profileImage}
                alt={profile.name}
                fill={true}
                className="object-cover rounded-full"
                priority
              />
            </div>
          </motion.div>
        </div>

        {/* Intro Text Column */}
        <motion.div 
          variants={containerVariants}
          initial="hidden"
          animate="visible"
          className="lg:col-span-7 space-y-8"
        >
          <div className="space-y-4">
            <motion.h4 variants={itemVariants} className="text-orange font-bold tracking-widest uppercase text-sm">Hello, I am</motion.h4>
            <motion.h1 variants={itemVariants} className="text-5xl md:text-7xl font-bold tracking-tight text-transparent bg-clip-text bg-gradient-to-r from-white to-gray-300">
              {profile.name}
            </motion.h1>
            <motion.div 
              initial={{ width: 0 }}
              animate={{ width: 96 }}
              transition={{ duration: 0.8, delay: 0.6, ease: "easeOut" }}
              className="h-1.5 bg-orange rounded-full shadow-[0_0_15px_rgba(255,107,53,0.5)]"
            />
          </div>

          <motion.p variants={itemVariants} className="text-xl md:text-2xl text-gray-300 leading-relaxed max-w-2xl font-light">
            {profile.summary}
          </motion.p>

          <motion.div variants={itemVariants} className="pt-6">
            <Link
              href="#projects"
              className="inline-flex items-center space-x-3 px-8 py-4 bg-orange text-white rounded-full font-bold text-lg transition-all shadow-xl hover:shadow-orange/40 hover:bg-orange/90 hover:scale-105 active:scale-95 group"
            >
              <span>View My Work</span>
              <motion.div
                animate={{ x: [0, 6, 0] }}
                transition={{ duration: 1.5, repeat: Infinity, ease: "easeInOut" }}
                className="group-hover:text-white"
              >
                <ExternalLink size={20} />
              </motion.div>
            </Link>
          </motion.div>
        </motion.div>
      </div>
    </section>
  );
}
