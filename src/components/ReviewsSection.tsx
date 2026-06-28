'use client';

import React from 'react';
import { Star, Quote } from 'lucide-react';
import { motion } from 'framer-motion';

export default function ReviewsSection() {
  const reviews = [
    {
      name: 'Raghav Singhania',
      location: 'Delhi NCR',
      rating: 5,
      title: 'Exquisite Draw & Presentation',
      comment: 'Absolutely stunning! The packaging is bespoke and feels like a luxury Swiss watch. The Burj Gold hookah draws like a dream—whisper silent yet creates incredibly thick smoke. Hukka Dubai has set a new standard in India.'
    },
    {
      name: 'Aisha Al-Mansoori',
      location: 'Mumbai Penthouse',
      rating: 5,
      title: 'Bespoke Centerpiece',
      comment: 'It is not just a hookah; it is a striking work of art. The gold-plated detailing matches our rose gold and pearl luxury living room decor perfectly. Our guests are always fascinated by the 360 purge.'
    },
    {
      name: 'Kabir Oberoi',
      location: 'Bangalore Villa',
      rating: 5,
      title: 'The Jetsetter Companion',
      comment: 'I bought the Desert Nomad briefcase set and it is a travel masterpiece. Easy to pack, lightweight, and performs identical to a full-sized hookah. The build quality of carbon fiber is outstanding.'
    }
  ];

  return (
    <section className="py-24 bg-zinc-950/40 border-t border-zinc-900 px-4 sm:px-6 lg:px-8 max-w-7xl mx-auto w-full relative">
      <div className="text-center max-w-xl mx-auto mb-16">
        <span className="text-xs uppercase tracking-[0.4em] text-gold-500 font-semibold block mb-3">
          TESTIMONIALS OF CONNOISSEURS
        </span>
        <h2 className="font-serif text-3xl md:text-5xl text-gold-100 tracking-wide uppercase">
          REVIEWS & ACCOLADES
        </h2>
        <div className="w-16 h-[1px] bg-gold-500/50 mx-auto mt-4" />
      </div>

      <div className="grid grid-cols-1 md:grid-cols-3 gap-8">
        {reviews.map((rev, idx) => (
          <motion.div
            key={idx}
            initial={{ opacity: 0, y: 30 }}
            whileInView={{ opacity: 1, y: 0 }}
            viewport={{ once: true }}
            transition={{ duration: 0.6, delay: idx * 0.1 }}
            className="relative p-8 bg-zinc-900/20 border border-zinc-800/50 rounded-sm hover:border-gold-500/20 transition-all duration-300 flex flex-col justify-between"
          >
            {/* Quote decoration */}
            <div className="absolute top-6 right-6 text-gold-500/5 pointer-events-none">
              <Quote className="w-16 h-16 fill-currentColor" />
            </div>

            <div>
              {/* Rating stars */}
              <div className="flex text-gold-400 gap-1 mb-4">
                {[...Array(rev.rating)].map((_, i) => (
                  <Star key={i} className="w-4 h-4 fill-currentColor" />
                ))}
              </div>

              <h4 className="font-serif text-base text-zinc-100 mb-2">
                &ldquo;{rev.title}&rdquo;
              </h4>
              
              <p className="text-zinc-500 text-xs leading-relaxed italic mb-8">
                {rev.comment}
              </p>
            </div>

            <div className="flex items-center gap-3 border-t border-zinc-900/60 pt-4">
              {/* Initials placeholder */}
              <div className="w-10 h-10 rounded-full bg-zinc-900 border border-zinc-800 flex items-center justify-center font-serif text-xs text-gold-400 uppercase">
                {rev.name.split(' ').map(n => n[0]).join('')}
              </div>
              <div>
                <h5 className="text-xs font-semibold text-zinc-200">{rev.name}</h5>
                <p className="text-[10px] text-zinc-500 uppercase tracking-widest">{rev.location}</p>
              </div>
            </div>
          </motion.div>
        ))}
      </div>

      {/* Trustpilot-style luxury seal */}
      <div className="mt-16 text-center border-t border-zinc-900/40 pt-12 max-w-sm mx-auto flex flex-col items-center gap-2">
        <div className="flex text-gold-400 gap-1 justify-center">
          {[...Array(5)].map((_, i) => (
            <Star key={i} className="w-5 h-5 fill-currentColor" />
          ))}
        </div>
        <p className="text-xs text-zinc-400 font-serif tracking-widest uppercase">
          4.9 OUT OF 5 RATING OVERALL
        </p>
        <p className="text-[10px] text-zinc-600">Based on 140+ verified luxury collectors in India</p>
      </div>
    </section>
  );
}
