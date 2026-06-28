'use client';

import React, { useRef } from 'react';
import Link from 'next/link';
import { motion, useMotionValue, useTransform, useSpring } from 'framer-motion';
import { Sparkles, ArrowRight, Compass } from 'lucide-react';

export default function HeroSection() {
  const cardRef = useRef<HTMLDivElement>(null);

  // Motion values for mouse 3D tilt physics
  const x = useMotionValue(0);
  const y = useMotionValue(0);

  const springConfig = { damping: 25, stiffness: 200 };
  const rotateX = useSpring(useTransform(y, [-200, 200], [15, -15]), springConfig);
  const rotateY = useSpring(useTransform(x, [-200, 200], [-15, 15]), springConfig);

  const handleMouseMove = (e: React.MouseEvent<HTMLDivElement, MouseEvent>) => {
    const el = cardRef.current;
    if (!el) return;
    const rect = el.getBoundingClientRect();
    const width = rect.width;
    const height = rect.height;
    const mouseX = e.clientX - rect.left - width / 2;
    const mouseY = e.clientY - rect.top - height / 2;
    x.set(mouseX);
    y.set(mouseY);
  };

  const handleMouseLeave = () => {
    x.set(0);
    y.set(0);
  };

  // Text reveal animation configurations
  const containerVariants = {
    hidden: { opacity: 0 },
    visible: {
      opacity: 1,
      transition: {
        staggerChildren: 0.1,
        delayChildren: 0.15
      }
    }
  };

  const itemVariants = {
    hidden: { y: 25, opacity: 0 },
    visible: {
      y: 0,
      opacity: 1,
      transition: { duration: 0.8, ease: [0.16, 1, 0.3, 1] as any }
    }
  };


  return (
    <section className="relative min-h-[90vh] flex items-center justify-center pt-24 pb-16 px-4 sm:px-6 lg:px-8 z-10 border-b border-zinc-900 overflow-hidden">
      {/* Decorative moving ambient highlights */}
      <motion.div 
        animate={{
          scale: [1, 1.1, 1],
          opacity: [0.12, 0.18, 0.12],
          x: [0, 40, 0],
          y: [0, -30, 0]
        }}
        transition={{ duration: 15, repeat: Infinity, ease: "easeInOut" }}
        className="absolute top-1/4 right-1/4 w-[500px] h-[500px] bg-gold-600/5 rounded-full filter blur-[150px] pointer-events-none -z-10" 
      />

      <div className="max-w-7xl mx-auto w-full grid grid-cols-1 lg:grid-cols-12 gap-12 items-center">
        
        {/* Left Side Content - Staggered typography */}
        <motion.div 
          variants={containerVariants}
          initial="hidden"
          animate="visible"
          className="lg:col-span-7 text-center lg:text-left space-y-8"
        >
          <motion.div 
            variants={itemVariants}
            className="inline-flex items-center gap-2 px-3 py-1 bg-gold-500/10 text-gold-400 border border-gold-500/20 rounded-full text-[9px] font-bold uppercase tracking-widest"
          >
            <Sparkles className="w-3 h-3 animate-spin-slow" /> Dubai's Premier Hookah Craft
          </motion.div>

          <div className="space-y-4">
            <motion.h1 
              variants={itemVariants}
              className="font-serif text-4xl sm:text-6xl lg:text-7xl leading-none text-zinc-100 tracking-wide uppercase"
            >
              EXPERIENCE THE ART OF <span className="gold-text-gradient block font-serif italic font-normal mt-2">LUXURY HOOKAH</span>
            </motion.h1>
            
            <motion.p 
              variants={itemVariants}
              className="max-w-xl mx-auto lg:mx-0 text-zinc-400 text-sm md:text-base font-light leading-relaxed"
            >
              Crafted for connoisseurs, imported from Dubai's finest artisans. Elevating social smoking into an elite, multi-sensory aesthetic experience.
            </motion.p>
          </div>

          {/* CTA Buttons */}
          <motion.div 
            variants={itemVariants}
            className="flex flex-col sm:flex-row gap-4 justify-center lg:justify-start pt-2"
          >
            <Link
              href="/shop"
              className="px-8 py-4 bg-gradient-to-r from-gold-600 to-gold-400 hover:from-gold-500 hover:to-gold-300 text-black font-bold uppercase tracking-widest text-xs rounded-sm transition-all duration-300 shadow-xl hover:shadow-gold-500/25 active:scale-95 flex items-center justify-center gap-2"
            >
              Shop Collection <ArrowRight className="w-4 h-4" />
            </Link>
            <a
              href="#bestsellers"
              className="px-8 py-4 border border-zinc-800 hover:border-gold-500/50 hover:bg-gold-500/5 text-zinc-300 hover:text-gold-200 font-bold uppercase tracking-widest text-xs rounded-sm transition-all duration-300 active:scale-95 flex items-center justify-center gap-2"
            >
              Explore Premium Range
            </a>
          </motion.div>

          {/* Micro details / Social trust */}
          <motion.div 
            variants={itemVariants}
            className="flex items-center justify-center lg:justify-start gap-8 text-[10px] text-zinc-500 uppercase tracking-widest pt-6 border-t border-zinc-900 max-w-md"
          >
            <div>
              <span className="block font-serif text-gold-400 text-lg font-bold">100%</span>
              <span>Original Imported</span>
            </div>
            <div className="w-[1px] h-8 bg-zinc-800" />
            <div>
              <span className="block font-serif text-gold-400 text-lg font-bold">COTPA</span>
              <span>Fully Compliant</span>
            </div>
            <div className="w-[1px] h-8 bg-zinc-800" />
            <div>
              <span className="block font-serif text-gold-400 text-lg font-bold">Express</span>
              <span>India Cargo Delivery</span>
            </div>
          </motion.div>
        </motion.div>

        {/* Right Side Visual - 3D Tilt Card and Rotating Frames */}
        <div className="lg:col-span-5 flex justify-center relative min-h-[440px] perspective-1000">
          
          {/* Pulsing glow background */}
          <div className="absolute w-72 h-72 rounded-full bg-gradient-to-tr from-gold-500/10 to-transparent top-1/2 left-1/2 -translate-x-1/2 -translate-y-1/2 filter blur-3xl" />
          
          {/* Main 3D Card */}
          <motion.div
            ref={cardRef}
            onMouseMove={handleMouseMove}
            onMouseLeave={handleMouseLeave}
            style={{ rotateX, rotateY, transformStyle: "preserve-3d" }}
            className="relative w-80 h-96 border border-zinc-800 bg-zinc-900/35 backdrop-blur-md rounded-sm p-6 flex flex-col justify-between shadow-2xl cursor-pointer hover:border-gold-500/20 transition-colors duration-500"
          >
            {/* Corner accents */}
            <div className="absolute top-0 left-0 w-4 h-4 border-t border-l border-gold-500/40" />
            <div className="absolute bottom-0 right-0 w-4 h-4 border-b border-r border-gold-500/40" />

            <div className="flex justify-between items-center text-[10px] text-gold-400 font-bold uppercase tracking-widest" style={{ transform: "translateZ(30px)" }}>
              <span>Burj Collection</span>
              <span>Bespoke 01</span>
            </div>

            {/* Circular frame containing product hookah image */}
            <div className="relative w-44 h-44 mx-auto flex items-center justify-center my-4" style={{ transform: "translateZ(50px)" }}>
              
              {/* Rotating outer rings */}
              <motion.div 
                animate={{ rotate: 360 }}
                transition={{ duration: 25, repeat: Infinity, ease: "linear" }}
                className="absolute inset-0 rounded-full border border-dashed border-gold-500/20"
              />
              <motion.div 
                animate={{ rotate: -360 }}
                transition={{ duration: 18, repeat: Infinity, ease: "linear" }}
                className="absolute inset-2 rounded-full border border-double border-gold-500/10"
              />

              {/* The Burj Gold Hookah Image */}
              <div className="w-36 h-36 rounded-full overflow-hidden border border-gold-500/20 bg-zinc-950 flex items-center justify-center relative shadow-lg">
                <img
                  src="/products/hukka_12.png"
                  alt="The Burj Gold Elite"
                  className="w-full h-full object-cover transform hover:scale-110 transition-transform duration-500"
                />
              </div>
            </div>

            <div className="space-y-2" style={{ transform: "translateZ(40px)" }}>
              <p className="text-zinc-500 text-[10px] uppercase tracking-widest">Available in limited sets</p>
              <h4 className="font-serif text-xl text-zinc-100 uppercase tracking-wider">The Burj Gold Elite</h4>
              <div className="flex justify-between items-end">
                <span className="text-sm font-semibold text-gold-400">₹1,25,000</span>
                <Link
                  href="/products/the-burj-gold-elite"
                  className="flex items-center gap-1 text-[9px] uppercase tracking-widest font-bold text-zinc-300 hover:text-gold-400 transition-colors"
                >
                  View Piece <Compass className="w-3.5 h-3.5 text-gold-500" />
                </Link>
              </div>
            </div>
          </motion.div>

          {/* Secondary smaller floating card */}
          <motion.div 
            animate={{
              y: [0, -10, 0],
              rotate: [6, 4, 6]
            }}
            transition={{ duration: 6, repeat: Infinity, ease: "easeInOut" }}
            className="absolute w-56 h-64 border border-zinc-800/40 bg-zinc-950/45 backdrop-blur-xs top-[-4%] right-[-6%] rounded-sm p-4 hidden md:flex flex-col justify-between -z-10 transform scale-90"
          >
            <span className="text-[8px] text-zinc-600 uppercase tracking-widest">Aerospace Stem</span>
            <div className="w-28 h-28 rounded-full overflow-hidden border border-zinc-800 bg-zinc-900 mx-auto flex items-center justify-center">
              <img
                src="/products/hukka_10.png"
                alt="Stealth Carbon"
                className="w-full h-full object-cover"
              />
            </div>
            <div className="space-y-1">
              <h5 className="font-serif text-xs text-zinc-400 truncate">Stealth Carbon</h5>
              <span className="text-[10px] text-gold-500/70">₹85,000</span>
            </div>
          </motion.div>

        </div>
      </div>
    </section>
  );
}
