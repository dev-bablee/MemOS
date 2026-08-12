"use client";

import { motion, type Variants } from 'framer-motion';

export default function TrustedBy() {
  const containerVariants: Variants = {
    hidden: { opacity: 0 },
    visible: { 
      opacity: 1,
      transition: {
        staggerChildren: 0.1,
        delayChildren: 0.1
      }
    }
  };

  const itemVariants: Variants = {
    hidden: { opacity: 0, y: 15 },
    visible: { opacity: 1, y: 0, transition: { duration: 0.8, ease: [0.16, 1, 0.3, 1] as const } }
  };

  return (
    <section className="w-full bg-[#050505] flex flex-col items-center">
      {/* PART 1 — Logo strip */}
      <motion.div 
        className="w-full pt-20 md:pt-28 pb-10 flex flex-col items-center"
        initial="hidden"
        whileInView="visible"
        viewport={{ once: true, margin: "-50px" }}
        variants={containerVariants}
      >
        <motion.p 
          variants={itemVariants}
          className="text-center text-[10px] md:text-[11px] tracking-[0.25em] text-[#555] font-semibold mb-10 md:mb-12 uppercase"
        >
          Trusted by teams building the future of AI
        </motion.p>
        
        <motion.div 
          variants={itemVariants}
          className="flex flex-wrap justify-center items-center gap-8 sm:gap-12 md:gap-16 lg:gap-[72px] w-full max-w-5xl px-4"
        >
          {['AWS', 'CockroachDB', 'OpenAI', 'Anthropic', 'LangGraph', 'Vercel'].map((company) => (
            <div 
              key={company} 
              className="font-medium text-[#666] text-sm sm:text-base md:text-lg tracking-tight transition-colors duration-300 hover:text-white cursor-default"
            >
              {company}
            </div>
          ))}
        </motion.div>
      </motion.div>

      {/* PART 2 — Section intro header (Capabilities) */}
      <motion.div 
        className="w-full pt-16 md:pt-24 pb-20 md:pb-32 flex flex-col items-center text-center px-4"
        initial="hidden"
        whileInView="visible"
        viewport={{ once: true, margin: "-50px" }}
        variants={containerVariants}
      >
        {/* Pill/badge */}
        <motion.div 
          variants={itemVariants}
          className="inline-flex items-center gap-2.5 rounded-full border border-[#222] bg-[#111] px-3.5 py-1.5 mb-8"
        >
          <div className="w-1.5 h-1.5 rounded-full bg-[#00A8FF] shadow-[0_0_8px_rgba(0,168,255,0.8)]"></div>
          <span className="text-[10px] md:text-[11px] tracking-[0.15em] font-semibold text-[#888] uppercase mt-[1px]">
            Capabilities
          </span>
        </motion.div>

        {/* Headline */}
        <motion.h2 
          variants={itemVariants}
          className="text-3xl sm:text-4xl md:text-5xl lg:text-[56px] font-bold text-white leading-[1.1] md:leading-[1.1] lg:leading-[1.1] mb-8 tracking-[-0.02em]"
        >
          <span className="block mb-1 md:mb-2">Everything an agent needs</span>
          <span className="block">
            to <span className="bg-gradient-to-r from-[#3b82f6] to-[#06b6d4] bg-clip-text text-transparent">remember and act</span>
          </span>
        </motion.h2>

        {/* Subheading */}
        <motion.p 
          variants={itemVariants}
          className="text-[17px] md:text-[19px] text-[#888] leading-relaxed max-w-2xl font-medium"
        >
          <span className="block">A complete memory and orchestration layer</span>
          <span className="block mt-1">for production AI — not a chatbot wrapper.</span>
        </motion.p>
      </motion.div>
    </section>
  );
}
