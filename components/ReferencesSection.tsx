"use client";

import { motion, Variants } from "framer-motion";
import { Briefcase, GraduationCap, Phone, Mail } from "lucide-react";

interface Reference {
  name: string;
  role: string;
  phone: string;
  email: string;
  type: "professional" | "academic";
}

const references: Reference[] = [
  {
    name: "Mr. Tibebu Legesse (MSc)",
    role: "Head of Department – IT, Wollo University",
    phone: "+251 953 043 045",
    email: "tibebulegesse23@gmail.com",
    type: "professional",
  },
  {
    name: "Mr. Eyob (MSc)",
    role: "Advisor – IT, Kombolcha Institute of Tech",
    phone: "+251 964 466 108",
    email: "eyob.teshager@gmail.com",
    type: "academic",
  },
];

const containerVariants: Variants = {
  hidden: { opacity: 0 },
  visible: {
    opacity: 1,
    transition: {
      staggerChildren: 0.3,
    },
  },
};

const cardVariants: Variants = {
  hidden: { opacity: 0, scale: 0.8, y: 50 },
  visible: {
    opacity: 1,
    scale: 1,
    y: 0,
    transition: {
      duration: 0.8,
      ease: [0.16, 1, 0.3, 1],
    },
  },
};

export default function ReferencesSection() {
  return (
    <section className="py-32 relative overflow-hidden bg-navy">
      {/* Dynamic Background Blobs */}
      <motion.div 
        animate={{ 
          scale: [1, 1.5, 1],
          opacity: [0.1, 0.3, 0.1],
          x: [0, 100, 0],
          y: [0, -50, 0]
        }}
        transition={{ duration: 15, repeat: Infinity, ease: "easeInOut" }}
        className="absolute top-0 right-0 w-[800px] h-[800px] bg-orange/20 rounded-full blur-[150px] pointer-events-none"
      />
      <motion.div 
        animate={{ 
          scale: [1, 1.2, 1],
          opacity: [0.1, 0.2, 0.1],
          x: [0, -100, 0],
          y: [0, 50, 0]
        }}
        transition={{ duration: 20, repeat: Infinity, ease: "easeInOut", delay: 2 }}
        className="absolute bottom-0 left-0 w-[600px] h-[600px] bg-blue-500/20 rounded-full blur-[150px] pointer-events-none"
      />

      <div className="max-w-7xl mx-auto px-6 relative z-10 text-center">
        <motion.div
          initial={{ opacity: 0, y: -20 }}
          whileInView={{ opacity: 1, y: 0 }}
          viewport={{ once: true }}
          className="mb-20"
        >
          <h3 className="text-5xl md:text-6xl font-bold text-white mb-6 tracking-tight">Professional References</h3>
          <div className="h-2 w-24 bg-orange mx-auto rounded-full shadow-[0_0_20px_rgba(255,107,53,0.5)]"></div>
        </motion.div>

        <motion.div 
          variants={containerVariants}
          initial="hidden"
          whileInView="visible"
          viewport={{ once: true, margin: "-100px" }}
          className="grid md:grid-cols-2 gap-10 max-w-5xl mx-auto text-left"
        >
          {references.map((ref, i) => (
            <motion.div 
              key={ref.name}
              variants={cardVariants}
              whileHover={{ scale: 1.02, y: -10 }}
              className="p-10 bg-white/5 backdrop-blur-2xl rounded-[3rem] border border-white/10 shadow-2xl hover:border-orange/30 transition-all duration-500 group relative overflow-hidden"
            >
              {/* Internal Glow on Hover */}
              <div className="absolute inset-0 bg-gradient-to-br from-orange/0 via-transparent to-orange/5 opacity-0 group-hover:opacity-100 transition-opacity duration-500"></div>

              <div className="relative z-10">
                <div className="flex items-center space-x-5 mb-8">
                  <div className={`w-16 h-16 rounded-2xl flex items-center justify-center shadow-2xl transition-transform duration-500 group-hover:rotate-6 ${ref.type === "professional" ? 'bg-orange shadow-orange/30' : 'bg-navy-light shadow-navy-light/30'}`}>
                    {ref.type === "professional" ? <Briefcase className="text-white" size={32} /> : <GraduationCap className="text-white" size={32} />}
                  </div>
                  <div>
                    <p className="text-orange font-black text-xs uppercase tracking-[0.25em] mb-1">{ref.type === "professional" ? 'Professional Reference' : 'Academic Advisor'}</p>
                    <h4 className="text-2xl font-extrabold text-white group-hover:text-orange transition-colors">{ref.name}</h4>
                  </div>
                </div>

                <p className="text-gray-400 mb-10 font-medium text-xl leading-relaxed">{ref.role}</p>

                <div className="space-y-4 pt-8 border-t border-white/10">
                  <a href={`tel:${ref.phone}`} className="flex items-center space-x-4 text-gray-300 hover:text-white transition-colors group/link">
                    <div className="w-10 h-10 bg-white/5 rounded-xl flex items-center justify-center group-hover/link:bg-orange transition-colors">
                      <Phone size={20} className="text-orange group-hover/link:text-white transition-colors" />
                    </div>
                    <span className="text-lg font-bold">{ref.phone}</span>
                  </a>
                  <a href={`mailto:${ref.email}`} className="flex items-center space-x-4 text-gray-300 hover:text-white transition-colors group/link">
                    <div className="w-10 h-10 bg-white/5 rounded-xl flex items-center justify-center group-hover/link:bg-orange transition-colors">
                      <Mail size={20} className="text-orange group-hover/link:text-white transition-colors" />
                    </div>
                    <span className="text-lg font-medium break-all">{ref.email}</span>
                  </a>
                </div>
              </div>
            </motion.div>
          ))}
        </motion.div>
      </div>
    </section>
  );
}
