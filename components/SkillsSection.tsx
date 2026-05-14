"use client";

import { motion, Variants, useMotionValue, useSpring, useTransform } from "framer-motion";
import { Target, Star, Cpu } from "lucide-react";
import { useState, useEffect } from "react";

const techSkills = ["React.js", "Node.js", "Express", "MongoDB", "Tailwind CSS", "Next.js", "JavaScript (ES6+)"];
const interests = ["Problem Solving", "Reading Scientific Books", "Research & Innovation", "UI/UX Design"];

const containerVariants: Variants = {
  hidden: { opacity: 0 },
  visible: {
    opacity: 1,
    transition: {
      staggerChildren: 0.1,
      delayChildren: 0.3,
    },
  },
};

const itemVariants: Variants = {
  hidden: { opacity: 0, y: 50, scale: 0.9, rotateX: -15 },
  visible: {
    opacity: 1,
    y: 0,
    scale: 1,
    rotateX: 0,
    transition: {
      duration: 1,
      ease: [0.16, 1, 0.3, 1],
    },
  },
};

const Card = ({ children, icon: Icon, title, delay = 0 }: any) => {
  const x = useMotionValue(0);
  const y = useMotionValue(0);

  const mouseXSpring = useSpring(x);
  const mouseYSpring = useSpring(y);

  const rotateX = useTransform(mouseYSpring, [-0.5, 0.5], ["10deg", "-10deg"]);
  const rotateY = useTransform(mouseXSpring, [-0.5, 0.5], ["-10deg", "10deg"]);

  const handleMouseMove = (e: any) => {
    const rect = e.currentTarget.getBoundingClientRect();
    const width = rect.width;
    const height = rect.height;
    const mouseX = e.clientX - rect.left;
    const mouseY = e.clientY - rect.top;
    const xPct = mouseX / width - 0.5;
    const yPct = mouseY / height - 0.5;
    x.set(xPct);
    y.set(yPct);
  };

  const handleMouseLeave = () => {
    x.set(0);
    y.set(0);
  };

  return (
    <motion.div
      variants={itemVariants}
      onMouseMove={handleMouseMove}
      onMouseLeave={handleMouseLeave}
      style={{
        rotateY,
        rotateX,
        transformStyle: "preserve-3d",
      }}
      className="group relative bg-white/40 backdrop-blur-3xl p-12 rounded-[4rem] border border-white/60 shadow-[0_30px_60px_-15px_rgba(0,0,0,0.1)] hover:border-orange/50 transition-all duration-700 overflow-hidden"
    >
      <div style={{ transform: "translateZ(80px)" }} className="relative z-10">
        <div className="w-24 h-24 bg-white/80 rounded-[2.5rem] flex items-center justify-center mb-10 group-hover:bg-navy transition-all duration-700 group-hover:rotate-[15deg] group-hover:scale-110 shadow-xl group-hover:shadow-navy/20">
          <Icon className="text-navy group-hover:text-white transition-colors" size={48} />
        </div>
        <h3 className="text-4xl font-black text-navy mb-10 tracking-tight">{title}</h3>
        {children}
      </div>
      
      {/* Radiant Glow Overlay */}
      <div className="absolute inset-0 bg-gradient-to-br from-white/60 via-transparent to-orange/5 opacity-0 group-hover:opacity-100 transition-opacity duration-700 pointer-events-none"></div>
    </motion.div>
  );
};

export default function SkillsSection() {
  const [mousePosition, setMousePosition] = useState({ x: 0, y: 0 });

  useEffect(() => {
    const handleMouseMove = (e: MouseEvent) => {
      setMousePosition({ x: e.clientX, y: e.clientY });
    };
    window.addEventListener("mousemove", handleMouseMove);
    return () => window.removeEventListener("mousemove", handleMouseMove);
  }, []);

  return (
    <section id="skills" className="py-32 relative overflow-hidden bg-gradient-to-b from-[#f8fafc] to-[#f1f5f9]">
      {/* Interactive Background Glow - Soft and Fresh */}
      <motion.div 
        animate={{ 
          x: mousePosition.x - 400, 
          y: mousePosition.y - 400,
        }}
        transition={{ type: "spring", damping: 50, stiffness: 40, mass: 1 }}
        className="absolute top-0 left-0 w-[800px] h-[800px] bg-cyan-400/10 rounded-full blur-[150px] pointer-events-none z-0"
      />

      {/* Background Decorations */}
      <div className="absolute inset-0 dot-pattern opacity-30 pointer-events-none"></div>
      
      {/* Animated Blobs - Vibrant and Fresh Colors */}
      <motion.div 
        animate={{ 
          scale: [1, 1.3, 1],
          rotate: [0, 45, 0],
          x: [0, 30, 0],
          y: [0, -20, 0]
        }}
        transition={{ duration: 12, repeat: Infinity, ease: "easeInOut" }}
        className="absolute top-0 -left-20 w-[600px] h-[600px] bg-pink-400/15 rounded-full blur-[120px]"
      />
      <motion.div 
        animate={{ 
          scale: [1, 1.4, 1],
          rotate: [0, -45, 0],
          x: [0, -30, 0],
          y: [0, 40, 0]
        }}
        transition={{ duration: 15, repeat: Infinity, ease: "easeInOut", delay: 2 }}
        className="absolute bottom-0 -right-20 w-[600px] h-[600px] bg-cyan-400/20 rounded-full blur-[120px]"
      />
      <motion.div 
        animate={{ 
          scale: [1, 1.2, 1],
          x: [0, 50, 0],
          y: [0, 50, 0]
        }}
        transition={{ duration: 18, repeat: Infinity, ease: "easeInOut", delay: 4 }}
        className="absolute top-1/3 right-1/4 w-[400px] h-[400px] bg-orange-400/15 rounded-full blur-[100px]"
      />

      <div className="max-w-7xl mx-auto px-6 relative z-10">
        <motion.div 
          initial={{ opacity: 0, y: -30, filter: "blur(10px)" }}
          whileInView={{ opacity: 1, y: 0, filter: "blur(0px)" }}
          viewport={{ once: true }}
          transition={{ duration: 1, ease: "easeOut" }}
          className="flex flex-col items-center text-center mb-24"
        >
          <motion.span 
            initial={{ opacity: 0, scale: 0.5 }}
            whileInView={{ opacity: 1, scale: 1 }}
            viewport={{ once: true }}
            transition={{ delay: 0.5, type: "spring" }}
            className="text-orange font-black tracking-[0.4em] uppercase text-sm mb-4"
          >
            Capabilities & Mastery
          </motion.span>
          <h2 className="text-5xl md:text-8xl font-black text-navy mb-6 tracking-tighter leading-tight">Skills & Expertise</h2>
          <motion.div 
            initial={{ width: 0 }}
            whileInView={{ width: 160 }}
            viewport={{ once: true }}
            transition={{ duration: 1, delay: 0.8 }}
            className="h-2.5 bg-orange rounded-full shadow-[0_10px_20px_rgba(255,107,53,0.3)]"
          />
        </motion.div>

        <motion.div 
          variants={containerVariants}
          initial="hidden"
          whileInView="visible"
          viewport={{ once: true, margin: "-100px" }}
          className="grid lg:grid-cols-3 gap-12"
        >
          {/* Tech Stack */}
          <Card icon={Target} title="Core Technologies">
            <ul className="space-y-6">
              {techSkills.map((skill, i) => (
                <motion.li 
                  key={skill} 
                  initial={{ opacity: 0, x: -10 }}
                  whileInView={{ opacity: 1, x: 0 }}
                  transition={{ delay: 0.1 * i }}
                  className="flex items-center space-x-5 text-gray-600 group/item"
                >
                  <div className="w-4 h-4 rounded-full bg-orange shadow-[0_4px_8px_rgba(255,107,53,0.4)] group-hover/item:scale-150 transition-transform"></div>
                  <span className="text-xl font-bold group-hover/item:text-navy transition-colors">{skill}</span>
                </motion.li>
              ))}
            </ul>
          </Card>

          {/* Languages */}
          <Card icon={Star} title="Languages">
            <div className="space-y-12">
              <div className="space-y-5">
                <div className="flex justify-between items-end">
                  <span className="text-2xl font-bold text-navy">Amharic</span>
                  <span className="text-orange font-black text-xs uppercase tracking-[0.3em] bg-orange/10 px-4 py-1.5 rounded-full border border-orange/20">Native</span>
                </div>
                <div className="h-5 w-full bg-gray-100 rounded-full overflow-hidden p-1.5 shadow-inner border border-gray-200">
                  <motion.div 
                    initial={{ width: 0 }}
                    whileInView={{ width: "100%" }}
                    viewport={{ once: true }}
                    transition={{ duration: 2, ease: "circOut", delay: 0.5 }}
                    className="h-full bg-gradient-to-r from-navy via-navy-light to-navy shadow-lg rounded-full"
                  />
                </div>
              </div>
              <div className="space-y-5">
                <div className="flex justify-between items-end">
                  <span className="text-2xl font-bold text-navy">English</span>
                  <span className="text-orange font-black text-xs uppercase tracking-[0.3em] bg-orange/10 px-4 py-1.5 rounded-full border border-orange/20">Good</span>
                </div>
                <div className="h-5 w-full bg-gray-100 rounded-full overflow-hidden p-1.5 shadow-inner border border-gray-200">
                  <motion.div 
                    initial={{ width: 0 }}
                    whileInView={{ width: "80%" }}
                    viewport={{ once: true }}
                    transition={{ duration: 2, ease: "circOut", delay: 0.8 }}
                    className="h-full bg-gradient-to-r from-navy via-navy-light to-navy shadow-lg rounded-full"
                  />
                </div>
              </div>
            </div>
          </Card>

          {/* Interests */}
          <Card icon={Cpu} title="Interests">
            <div className="flex flex-wrap gap-5">
              {interests.map((hobby, i) => (
                <motion.span 
                  key={hobby} 
                  initial={{ opacity: 0, scale: 0.8 }}
                  whileInView={{ opacity: 1, scale: 1 }}
                  transition={{ delay: 0.1 * i }}
                  whileHover={{ scale: 1.1, backgroundColor: "#001f3f", color: "#fff", boxShadow: "0 20px 40px rgba(0,31,63,0.3)" }}
                  className="px-7 py-5 bg-white rounded-[2rem] text-navy font-bold text-base shadow-xl border border-gray-100 cursor-default transition-all duration-500"
                >
                  {hobby}
                </motion.span>
              ))}
            </div>
            <motion.div 
              initial={{ opacity: 0 }}
              whileInView={{ opacity: 1 }}
              transition={{ delay: 1.5 }}
              className="mt-12 p-8 bg-gray-50 rounded-[2.5rem] border-l-[6px] border-orange italic text-gray-500 text-lg leading-relaxed shadow-lg"
            >
              "Continuously evolving through research, innovation, and creative problem-solving."
            </motion.div>
          </Card>
        </motion.div>
      </div>
    </section>
  );
}
