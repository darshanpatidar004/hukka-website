'use client';

import React from 'react';
import Link from 'next/link';
import { motion } from 'framer-motion';

export default function FeaturedCollections() {
  const collections = [
    {
      name: 'Premium Hookahs',
      description: 'Electroplated 24k Gold & Bohemian Crystal',
      link: '/shop?category=Premium+Hookahs',
      gridSpan: 'md:col-span-2',
      image: '/products/hukka_21.png',
      bgGlow: 'from-gold-600/20 to-transparent'
    },
    {
      name: 'Modern Hookahs',
      description: 'Aerospace Titanium & Carbon Weave',
      link: '/shop?category=Modern+Hookahs',
      gridSpan: 'md:col-span-1',
      image: '/products/hukka_18.png',
      bgGlow: 'from-zinc-600/20 to-transparent'
    },
    {
      name: 'Travel Hookahs',
      description: 'Briefcase assembled precision kits',
      link: '/shop?category=Travel+Hookahs',
      gridSpan: 'md:col-span-1',
      image: '/products/hukka_13.png',
      bgGlow: 'from-amber-600/20 to-transparent'
    },
    {
      name: 'Traditional Hookahs',
      description: 'Hand-engraved heavy cast brass Classics',
      link: '/shop?category=Traditional+Hookahs',
      gridSpan: 'md:col-span-2',
      image: '/products/hukka_20.png',
      bgGlow: 'from-yellow-700/20 to-transparent'
    },
    {
      name: 'Hookah Accessories',
      description: 'Royal heat devices, crystal bases & hoses',
      link: '/shop?category=Hookah+Accessories',
      gridSpan: 'md:col-span-1',
      image: '/products/hukka_7.png',
      bgGlow: 'from-neutral-700/20 to-transparent'
    },
    {
      name: 'Charcoal & Consumables',
      description: '100% natural, odorless organic coconut coal',
      link: '/shop?category=Charcoal+%26+Consumables',
      gridSpan: 'md:col-span-2',
      image: '/products/hukka_14.png',
      bgGlow: 'from-orange-600/10 to-transparent'
    }
  ];

  return (
    <section className="py-24 bg-zinc-950/60 border-y border-zinc-900 px-4 sm:px-6 lg:px-8 max-w-7xl mx-auto w-full relative">
      {/* Decorative ambient elements */}
      <div className="absolute top-1/4 right-0 w-80 h-80 bg-gold-600/3 rounded-full blur-[120px] pointer-events-none" />

      <div className="text-center max-w-xl mx-auto mb-16">
        <span className="text-xs uppercase tracking-[0.4em] text-gold-500 font-semibold block mb-3">
          FINEST CURATED ASSORTMENT
        </span>
        <h2 className="font-serif text-3xl md:text-5xl text-gold-100 tracking-wide uppercase">
          EXPLORE COLLECTIONS
        </h2>
        <div className="w-16 h-[1px] bg-gold-500/50 mx-auto mt-4" />
      </div>

      <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
        {collections.map((col, idx) => (
          <motion.div
            key={idx}
            initial={{ opacity: 0, y: 30 }}
            whileInView={{ opacity: 1, y: 0 }}
            viewport={{ once: true }}
            transition={{ duration: 0.65, delay: idx * 0.05, ease: 'easeOut' }}
            className={`group relative glass-panel p-8 rounded-sm overflow-hidden h-72 flex flex-col justify-end border border-zinc-800 hover:border-gold-500/30 transition-colors duration-500 ${col.gridSpan}`}
          >
            {/* Background Hookah Image */}
            <img
              src={col.image}
              alt={col.name}
              className="absolute inset-0 w-full h-full object-cover opacity-20 group-hover:opacity-40 group-hover:scale-105 transition-all duration-700 pointer-events-none"
            />
            
            {/* Overlay Gradient */}
            <div className={`absolute inset-0 bg-gradient-to-t from-zinc-950 via-zinc-950/60 to-transparent opacity-90`} />
            <div className={`absolute inset-0 bg-gradient-to-br ${col.bgGlow} opacity-35 group-hover:opacity-55 transition-opacity duration-500`} />
            
            {/* Interactive light reflection line */}
            <div className="absolute top-0 -inset-full h-full w-1/2 z-5 block transform -skew-x-12 bg-gradient-to-r from-transparent to-white/[0.03] opacity-0 group-hover:animate-shine" />

            {/* Geometric patterns to add rolex-level premium design */}
            <div className="absolute top-6 right-6 w-24 h-24 border border-white/[0.02] rounded-full group-hover:scale-125 transition-transform duration-700 pointer-events-none" />
            <div className="absolute top-12 right-12 w-12 h-12 border border-gold-500/[0.03] rounded-full group-hover:scale-110 transition-transform duration-500 pointer-events-none" />

            <div className="relative z-10 space-y-3">
              <span className="text-[9px] uppercase tracking-[0.3em] text-gold-500 font-bold block">
                Dubai Curation
              </span>
              <h3 className="font-serif text-xl md:text-2xl text-zinc-100 group-hover:text-gold-200 transition-colors duration-300">
                {col.name}
              </h3>
              <p className="text-zinc-500 text-xs tracking-wider max-w-sm">
                {col.description}
              </p>
              <Link
                href={col.link}
                className="inline-flex items-center gap-1 text-[10px] uppercase font-bold tracking-widest text-gold-400 group-hover:text-gold-300 transition-colors pt-2"
              >
                Browse Range <span className="group-hover:translate-x-1.5 transition-transform duration-300">&rarr;</span>
              </Link>
            </div>
          </motion.div>
        ))}
      </div>
    </section>
  );
}


