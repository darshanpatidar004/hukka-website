'use client';

import React from 'react';
import Link from 'next/link';
import { motion } from 'framer-motion';

export default function BrandStorySection() {
  const containerVariants = {
    hidden: { opacity: 0 },
    visible: {
      opacity: 1,
      transition: { staggerChildren: 0.12 }
    }
  };

  const cardVariants = {
    hidden: { opacity: 0, y: 30, scale: 0.98 },
    visible: {
      opacity: 1,
      y: 0,
      scale: 1,
      transition: { duration: 0.65, ease: [0.16, 1, 0.3, 1] as any }
    }
  };


  return (
    <section id="story" className="py-28 bg-black/60 border-y border-zinc-900 relative overflow-hidden">
      {/* Moving background glow */}
      <div className="absolute top-1/2 left-1/4 w-96 h-96 bg-gold-600/3 rounded-full blur-[140px] pointer-events-none -z-10" />

      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 grid grid-cols-1 lg:grid-cols-12 gap-16 items-center">
        
        {/* Left Side Grid Graphic Blocks */}
        <motion.div 
          variants={containerVariants}
          initial="hidden"
          whileInView="visible"
          viewport={{ once: true, margin: "-100px" }}
          className="lg:col-span-6 grid grid-cols-2 gap-4 relative"
        >
          {/* Card 1: Our Roots */}
          <motion.div
            variants={cardVariants}
            whileHover={{ scale: 1.02, borderColor: 'rgba(212, 175, 55, 0.3)' }}
            className="group relative h-64 bg-zinc-950/80 border border-zinc-800 rounded-sm p-6 flex flex-col justify-between overflow-hidden transition-all duration-300"
          >
            {/* Dark Masked Hookah Background */}
            <img 
              src="/products/hukka_21.png" 
              alt="Dubai Roots" 
              className="absolute inset-0 w-full h-full object-cover opacity-10 group-hover:opacity-20 group-hover:scale-105 transition-all duration-700 pointer-events-none" 
            />
            <div className="absolute inset-0 bg-gradient-to-t from-zinc-950 via-zinc-950/40 to-transparent" />

            <span className="relative z-10 text-[9px] uppercase tracking-widest text-gold-500 font-bold">Our Roots</span>
            <p className="relative z-10 font-serif text-base text-zinc-300 italic leading-relaxed">
              &ldquo;A vision born under the starlit sky of Dubai.&rdquo;
            </p>
            <span className="relative z-10 text-[10px] text-zinc-500 uppercase tracking-widest">DIFC Dubai, UAE</span>
          </motion.div>

          {/* Card 2: 2018 Established */}
          <motion.div
            variants={cardVariants}
            whileHover={{ scale: 1.02, borderColor: 'rgba(212, 175, 55, 0.3)' }}
            className="group relative h-48 mt-10 bg-zinc-950/80 border border-zinc-800 rounded-sm p-6 flex flex-col justify-end overflow-hidden transition-all duration-300"
          >
            <img 
              src="/products/hukka_1.png" 
              alt="Dubai 2018" 
              className="absolute inset-0 w-full h-full object-cover opacity-10 group-hover:opacity-20 group-hover:scale-105 transition-all duration-700 pointer-events-none" 
            />
            <div className="absolute inset-0 bg-gradient-to-t from-zinc-950 via-zinc-950/50 to-transparent" />

            <div className="relative z-10 space-y-1">
              <h5 className="font-serif text-3xl text-gold-400 font-bold">2018</h5>
              <span className="text-[10px] text-zinc-500 uppercase tracking-widest block">Year Established</span>
            </div>
          </motion.div>

          {/* Card 3: 14k Served */}
          <motion.div
            variants={cardVariants}
            whileHover={{ scale: 1.02, borderColor: 'rgba(212, 175, 55, 0.3)' }}
            className="group relative h-48 bg-zinc-950/80 border border-zinc-800 rounded-sm p-6 flex flex-col justify-end overflow-hidden transition-all duration-300"
          >
            <img 
              src="/products/hukka_2.png" 
              alt="Dubai VIP lounge" 
              className="absolute inset-0 w-full h-full object-cover opacity-10 group-hover:opacity-20 group-hover:scale-105 transition-all duration-700 pointer-events-none" 
            />
            <div className="absolute inset-0 bg-gradient-to-t from-zinc-950 via-zinc-950/50 to-transparent" />

            <div className="relative z-10 space-y-1">
              <h5 className="font-serif text-3xl text-gold-400 font-bold">14,000+</h5>
              <span className="text-[10px] text-zinc-500 uppercase tracking-widest block">Connoisseurs Served</span>
            </div>
          </motion.div>

          {/* Card 4: Engineering */}
          <motion.div
            variants={cardVariants}
            whileHover={{ scale: 1.02, borderColor: 'rgba(212, 175, 55, 0.3)' }}
            className="group relative h-64 -mt-10 bg-zinc-950/80 border border-zinc-800 rounded-sm p-6 flex flex-col justify-between overflow-hidden transition-all duration-300"
          >
            <img 
              src="/products/hukka_18.png" 
              alt="Dubai engineering lab" 
              className="absolute inset-0 w-full h-full object-cover opacity-10 group-hover:opacity-20 group-hover:scale-105 transition-all duration-700 pointer-events-none" 
            />
            <div className="absolute inset-0 bg-gradient-to-t from-zinc-950 via-zinc-950/40 to-transparent" />

            <span className="relative z-10 text-[9px] uppercase tracking-widest text-gold-500 font-bold">Engineering</span>
            <p className="relative z-10 font-serif text-base text-zinc-300 italic leading-relaxed">
              &ldquo;Merging aerospace carbon weaves with crystal craftsmanship.&rdquo;
            </p>
            <span className="relative z-10 text-[10px] text-zinc-500 uppercase tracking-widest">Aerospace Grade</span>
          </motion.div>
        </motion.div>

        {/* Right Side Description Text */}
        <motion.div 
          initial={{ opacity: 0, x: 30 }}
          whileInView={{ opacity: 1, x: 0 }}
          viewport={{ once: true }}
          transition={{ duration: 0.8 }}
          className="lg:col-span-6 space-y-6"
        >
          <span className="text-xs uppercase tracking-[0.4em] text-gold-500 font-semibold block">
            OUR HERITAGE
          </span>
          <h2 className="font-serif text-3xl md:text-5xl text-gold-100 tracking-wide uppercase leading-tight">
            FROM DUBAI TO INDIA: A STORY OF ELITE CRAFTSMANSHIP
          </h2>
          <p className="text-zinc-400 text-sm leading-relaxed">
            At Hukka Dubai, we believe that smoking is not merely a habit; it is a ritual of reflection, connection, and relaxation. Our company was founded in the heart of Dubai, UAE, with a singular mission: to strip away the industrial, dated look of traditional water pipes and engineer the finest lifestyle centerpiece.
          </p>
          <p className="text-zinc-400 text-sm leading-relaxed">
            We collaborate with material sciences labs in Europe and traditional crystal blowing houses in Bohemia. The result is a line of hookahs that deliver thermal stability, acoustic silence, and dense cloud purges while serving as a rolex-level sculpture in your residence. 
          </p>
          <p className="text-zinc-500 text-xs tracking-wider leading-relaxed">
            Now curated and imported directly into the Indian market with white-glove logistics, we present Hukka Dubai—where technology meets ancient social art.
          </p>
          <div className="pt-4">
            <Link
              href="/shop"
              className="inline-flex items-center gap-1.5 px-6 py-3 bg-zinc-900 hover:bg-zinc-800 text-gold-400 hover:text-gold-300 border border-zinc-800 text-xs font-bold uppercase tracking-widest rounded-sm transition-all"
            >
              Explore the Heritage Line
            </Link>
          </div>
        </motion.div>
      </div>
    </section>
  );
}
