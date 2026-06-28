'use client';

import React from 'react';
import { Heart, MessageCircle } from 'lucide-react';
import { motion } from 'framer-motion';

export default function InstagramGallery() {
  const posts = [
    {
      id: 1,
      likes: '1.2k',
      comments: '45',
      hashtag: '#BurjGold',
      image: 'https://images.unsplash.com/photo-1527661591475-527312dd65f5?q=80&w=600&auto=format&fit=crop',
      ambientColor: 'bg-gold-500/10'
    },
    {
      id: 2,
      likes: '840',
      comments: '32',
      hashtag: '#StealthCarbon',
      image: 'https://images.unsplash.com/photo-1606813907291-d86efa9b94db?q=80&w=600&auto=format&fit=crop',
      ambientColor: 'bg-zinc-800/20'
    },
    {
      id: 3,
      likes: '2.1k',
      comments: '88',
      hashtag: '#JumeirahPearl',
      image: 'https://images.unsplash.com/photo-1618220179428-22790b461013?q=80&w=600&auto=format&fit=crop',
      ambientColor: 'bg-amber-500/10'
    },
    {
      id: 4,
      likes: '915',
      comments: '27',
      hashtag: '#DesertNomad',
      image: 'https://images.unsplash.com/photo-1542382156909-9ae37b3f56fd?q=80&w=600&auto=format&fit=crop',
      ambientColor: 'bg-neutral-800/30'
    }
  ];

  return (
    <section className="py-24 bg-zinc-950 px-4 sm:px-6 lg:px-8 max-w-7xl mx-auto w-full relative">
      <div className="flex flex-col md:flex-row items-center justify-between mb-16">
        <div>
          <span className="text-xs uppercase tracking-[0.4em] text-gold-500 font-semibold block mb-3">
            SOCIAL PRESENCE
          </span>
          <h2 className="font-serif text-3xl md:text-5xl text-gold-100 tracking-wide uppercase">
            THE LUXURY LIFESTYLE
          </h2>
        </div>
        <a
          href="https://instagram.com"
          target="_blank"
          rel="noopener noreferrer"
          className="mt-6 md:mt-0 flex items-center gap-2 px-6 py-3 border border-zinc-800 hover:border-gold-500/30 hover:bg-gold-500/5 text-zinc-300 hover:text-gold-200 text-xs font-semibold uppercase tracking-widest rounded-sm transition-all"
        >
          <svg className="w-4 h-4 text-gold-400" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"><rect x="2" y="2" width="20" height="20" rx="5" ry="5"/><path d="M16 11.37A4 4 0 1 1 12.63 8 4 4 0 0 1 16 11.37z"/><line x1="17.5" y1="6.5" x2="17.51" y2="6.5"/></svg> Follow @HukkaDubai
        </a>
      </div>

      <div className="grid grid-cols-2 lg:grid-cols-4 gap-6">
        {posts.map((post) => (
          <motion.div
            key={post.id}
            initial={{ opacity: 0, scale: 0.95 }}
            whileInView={{ opacity: 1, scale: 1 }}
            viewport={{ once: true }}
            transition={{ duration: 0.5, delay: post.id * 0.05 }}
            className="group relative h-64 bg-zinc-900/50 border border-zinc-800/80 rounded-sm overflow-hidden flex items-center justify-center cursor-pointer"
          >
            {/* Visual background Hookah Image */}
            <img
              src={post.image}
              alt={post.hashtag}
              className="absolute inset-0 w-full h-full object-cover opacity-30 group-hover:opacity-55 group-hover:scale-105 transition-all duration-700 pointer-events-none"
            />
            
            <div className={`absolute inset-0 ${post.ambientColor} group-hover:scale-105 transition-transform duration-700 opacity-20`} />
            <div className="absolute top-1/2 left-1/2 -translate-x-1/2 -translate-y-1/2 w-16 h-16 rounded-full bg-gold-500/5 filter blur-lg" />
            
            {/* Geometric center badge representing elegant post thumbnail */}
            <div className="text-center p-4 border border-white/[0.02] bg-zinc-950/70 backdrop-blur-xs rounded-sm max-w-[150px] z-10">
              <span className="font-serif text-xs text-zinc-400 italic block mb-1">Hukka Dubai</span>
              <span className="text-[9px] uppercase tracking-widest text-gold-500/70 block">{post.hashtag}</span>
            </div>

            {/* Instagram Hover Overlay */}
            <div className="absolute inset-0 bg-black/75 opacity-0 group-hover:opacity-100 transition-opacity duration-300 flex flex-col items-center justify-center gap-4 text-white z-20">
              <svg className="w-6 h-6 text-gold-400 mb-2" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"><rect x="2" y="2" width="20" height="20" rx="5" ry="5"/><path d="M16 11.37A4 4 0 1 1 12.63 8 4 4 0 0 1 16 11.37z"/><line x1="17.5" y1="6.5" x2="17.51" y2="6.5"/></svg>
              <div className="flex gap-6 text-sm">
                <div className="flex items-center gap-1.5 hover:text-gold-400 transition-colors">
                  <Heart className="w-4 h-4 text-red-500 fill-currentColor" />
                  <span className="text-xs uppercase tracking-wider font-semibold">{post.likes}</span>
                </div>
                <div className="flex items-center gap-1.5 hover:text-gold-400 transition-colors">
                  <MessageCircle className="w-4 h-4 text-gold-400" />
                  <span className="text-xs uppercase tracking-wider font-semibold">{post.comments}</span>
                </div>
              </div>
              <span className="text-[9px] uppercase tracking-[0.2em] text-zinc-500 font-bold mt-2">
                Click to view on Instagram
              </span>
            </div>
          </motion.div>
        ))}
      </div>
    </section>
  );
}

