'use client';

import React, { useState } from 'react';
import { useApp } from '@/context/AppContext';
import { Check, ShieldCheck, Heart, Sparkles, Award } from 'lucide-react';
import { motion, AnimatePresence } from 'framer-motion';
import Link from 'next/link';


export default function ProductShowcase({ product }: { product: any }) {
  const { addToCart, toggleWishlist, wishlist } = useApp();
  const [added, setAdded] = useState(false);
  const [activeHotspot, setActiveHotspot] = useState<string | null>(null);

  if (!product) return null;

  const isWishlisted = wishlist.includes(product.id);

  const handleAddToCart = () => {
    addToCart(product, 1);
    setAdded(true);
    setTimeout(() => setAdded(false), 2000);
  };

  const hotspots = [
    {
      id: 'bowl',
      name: '24K Gold Bowl Port',
      description: 'Electroplated pure gold adaptor fitting standard luxury clay and glass bowls.',
      style: 'top-[15%] left-[50%]'
    },
    {
      id: 'stem',
      name: 'Quad-Chamber Stem',
      description: 'Heavy solid brass core electroplated in gold, housing 4 independent smoke channels.',
      style: 'top-[45%] left-[50%]'
    },
    {
      id: 'purge',
      name: '360° Purge System',
      description: 'Hidden exhaust valves purging smoke downwards in a majestic sheet of clouds.',
      style: 'top-[65%] left-[52%]'
    },
    {
      id: 'base',
      name: 'Bohemian Crystal Base',
      description: 'Mouth-blown crystal base detailed by hand with liquid 24K gold engraving.',
      style: 'top-[85%] left-[50%]'
    }
  ];

  return (
    <section className="py-24 bg-zinc-950 px-4 sm:px-6 lg:px-8 max-w-7xl mx-auto w-full relative">
      <div className="grid grid-cols-1 lg:grid-cols-12 gap-12 items-center">
        {/* Left Specs / Story */}
        <div className="lg:col-span-5 space-y-6">
          <div className="inline-flex items-center gap-2 px-3 py-1 bg-gold-500/10 text-gold-400 border border-gold-500/20 rounded-full text-[9px] font-bold uppercase tracking-widest">
            <Sparkles className="w-3 h-3" /> Flagship Masterpiece
          </div>
          <h2 className="font-serif text-4xl md:text-5xl text-gold-200 tracking-wide uppercase leading-tight">
            THE BURJ GOLD ELITE
          </h2>
          <p className="text-zinc-400 text-sm leading-relaxed">
            Inspired by the iconic silhouette of the Burj Khalifa, this is the ultimate symbol of status. Masterfully handcrafted from premium gold-plated brass and hand-etched crystal, it delivers a dense, ice-cooled draw that is completely silent.
          </p>

          {/* Luxury Specifications */}
          <div className="space-y-4 pt-4">
            <div className="flex items-center gap-3">
              <Award className="w-5 h-5 text-gold-500 flex-shrink-0" />
              <div>
                <h4 className="text-xs font-semibold uppercase tracking-wider text-zinc-100">Certified 24K Gold</h4>
                <p className="text-[11px] text-zinc-500">Every metal component is triple-electroplated for longevity.</p>
              </div>
            </div>
            <div className="flex items-center gap-3">
              <ShieldCheck className="w-5 h-5 text-gold-500 flex-shrink-0" />
              <div>
                <h4 className="text-xs font-semibold uppercase tracking-wider text-zinc-100">Medical-Grade Silicone</h4>
                <p className="text-[11px] text-zinc-500">Premium hose materials ensuring pure taste translation.</p>
              </div>
            </div>
          </div>

          <div className="pt-6 flex flex-col sm:flex-row gap-4">
            <button
              onClick={handleAddToCart}
              className={`px-8 py-4 text-xs font-bold uppercase tracking-widest rounded-sm transition-all duration-300 flex items-center justify-center gap-2 active:scale-95 ${
                added
                  ? 'bg-green-500/10 text-green-400 border border-green-500/20'
                  : 'bg-gradient-to-r from-gold-600 to-gold-400 hover:from-gold-500 hover:to-gold-300 text-black shadow-lg hover:shadow-gold-500/10'
              }`}
            >
              {added ? <Check className="w-4 h-4" /> : null}
              {added ? 'Added to Cart' : 'Acquire Flagship — ₹1,25,000'}
            </button>

            <button
              onClick={() => toggleWishlist(product.id)}
              className="px-6 py-4 border border-zinc-800 hover:border-gold-500/30 hover:bg-gold-500/5 text-zinc-300 hover:text-gold-200 text-xs font-bold uppercase tracking-widest rounded-sm transition-all flex items-center justify-center gap-2"
            >
              <Heart className={`w-4 h-4 ${isWishlisted ? 'text-red-500 fill-currentColor' : ''}`} />
              {isWishlisted ? 'In Wishlist' : 'Add to Wishlist'}
            </button>
          </div>

          <div className="pt-2 text-center sm:text-left">
            <Link
              href={`/products/${product.slug}`}
              className="text-[10px] text-zinc-500 hover:text-gold-400 uppercase tracking-widest font-bold underline underline-offset-4"
            >
              View 360&deg; Showcase & Details
            </Link>
          </div>
        </div>

        {/* Right Interactive Visual representation of product */}
        <div className="lg:col-span-7 flex justify-center relative bg-zinc-950 p-8 border border-zinc-900 rounded-sm overflow-hidden h-[550px] group">
          {/* Background glowing rings */}
          <div className="absolute w-80 h-80 rounded-full border border-gold-500/5 top-1/2 left-1/2 -translate-x-1/2 -translate-y-1/2 scale-100 group-hover:scale-110 transition-transform duration-700 pointer-events-none" />
          <div className="absolute w-96 h-96 rounded-full border border-zinc-800/10 top-1/2 left-1/2 -translate-x-1/2 -translate-y-1/2 scale-120 group-hover:scale-130 transition-transform duration-700 pointer-events-none" />
          <div className="absolute inset-0 bg-radial from-gold-500/3 to-transparent filter blur-2xl" />

          {/* Abstract Hookah silhouette placeholder */}
          <div className="relative h-full flex flex-col justify-between items-center z-10 select-none">
            {/* Crown */}
            <div className="w-16 h-4 bg-zinc-800 rounded-t-sm border border-gold-500/30 flex items-center justify-center">
              <div className="w-1.5 h-1.5 rounded-full bg-gold-400 animate-ping" />
            </div>
            {/* Plate */}
            <div className="w-36 h-2 bg-gradient-to-r from-gold-600 to-gold-400 rounded-full border border-gold-300/40" />
            {/* Stem body (vertical pillar) */}
            <div className="w-6 flex-grow bg-gradient-to-b from-gold-500 via-gold-600 to-zinc-900 border-x border-gold-400/40 relative shadow-inner">
              <div className="absolute top-1/3 left-0 right-0 h-1 bg-gold-300" />
              <div className="absolute top-2/3 left-0 right-0 h-1 bg-gold-300" />
            </div>
            {/* Base Connector ring */}
            <div className="w-12 h-3 bg-gold-500 border border-gold-400" />
            {/* Handblown Glass base outline shape */}
            <div className="w-48 h-48 rounded-t-full rounded-b-sm bg-gradient-to-b from-zinc-900/60 to-gold-950/20 border-x border-b border-gold-500/20 backdrop-blur-xs flex items-center justify-center relative">
              <div className="absolute w-12 h-6 border-b border-gold-500/30 bottom-8 rounded-full" />
              <span className="font-serif text-[10px] text-gold-400/50 uppercase tracking-widest">
                Bohemian Crystal
              </span>
            </div>
          </div>

          {/* Hotspots */}
          {hotspots.map((spot) => (
            <div
              key={spot.id}
              className={`absolute z-20 ${spot.style} -translate-x-1/2 -translate-y-1/2`}
              onMouseEnter={() => setActiveHotspot(spot.id)}
              onMouseLeave={() => setActiveHotspot(null)}
            >
              <button className="w-6 h-6 rounded-full bg-gold-500/40 hover:bg-gold-500 flex items-center justify-center border border-gold-400 animate-pulse transition-all">
                <span className="w-2.5 h-2.5 rounded-full bg-white block" />
              </button>

              {/* Tooltip */}
              <AnimatePresence>
                {activeHotspot === spot.id && (
                  <motion.div
                    initial={{ opacity: 0, scale: 0.95, y: -10 }}
                    animate={{ opacity: 1, scale: 1, y: -5 }}
                    exit={{ opacity: 0, scale: 0.95, y: -10 }}
                    className="absolute bottom-8 left-1/2 -translate-x-1/2 w-52 p-3 bg-zinc-900 border border-gold-500/30 text-white rounded-sm shadow-xl"
                  >
                    <h5 className="text-[11px] font-bold text-gold-300 uppercase tracking-wider mb-1">
                      {spot.name}
                    </h5>
                    <p className="text-[10px] text-zinc-400 leading-normal">
                      {spot.description}
                    </p>
                  </motion.div>
                )}
              </AnimatePresence>
            </div>
          ))}
        </div>
      </div>
    </section>
  );
}
