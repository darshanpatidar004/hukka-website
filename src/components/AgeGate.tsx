'use client';

import React, { useState, useEffect } from 'react';
import { useApp } from '@/context/AppContext';
import { ShieldAlert } from 'lucide-react';
import { motion, AnimatePresence } from 'framer-motion';

export default function AgeGate() {
  const { ageVerified, verifyAge } = useApp();
  const [mounted, setMounted] = useState(false);

  useEffect(() => {
    setMounted(true);
  }, []);

  if (!mounted || ageVerified) return null;

  const handleExit = () => {
    window.location.href = 'https://www.google.com';
  };

  return (
    <AnimatePresence>
      <div className="fixed inset-0 z-50 flex items-center justify-center bg-black overflow-hidden">
        {/* Abstract smoke animations in background */}
        <div className="absolute inset-0 bg-[radial-gradient(circle_at_center,rgba(180,120,34,0.08)_0%,rgba(0,0,0,1)_80%)]" />
        <div className="smoke-cloud absolute -top-40 -left-40 opacity-40" />
        <div className="smoke-cloud absolute -bottom-40 -right-40 opacity-30" />

        <motion.div
          initial={{ opacity: 0, y: 40 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 1, ease: 'easeOut' }}
          className="relative max-w-lg w-full mx-4 p-8 md:p-12 glass-panel border border-gold-500/20 text-center rounded-sm shadow-2xl"
        >
          {/* Accent Gold Corners */}
          <div className="absolute top-0 left-0 w-8 h-8 border-t-2 border-l-2 border-gold-500/50" />
          <div className="absolute top-0 right-0 w-8 h-8 border-t-2 border-r-2 border-gold-500/50" />
          <div className="absolute bottom-0 left-0 w-8 h-8 border-b-2 border-l-2 border-gold-500/50" />
          <div className="absolute bottom-0 right-0 w-8 h-8 border-b-2 border-r-2 border-gold-500/50" />

          <div className="flex justify-center mb-6 text-gold-500">
            <ShieldAlert className="w-16 h-16 animate-pulse" />
          </div>

          <h2 className="font-serif text-3xl md:text-4xl tracking-widest text-gold-200 mb-2 uppercase">
            HUKKA DUBAI
          </h2>
          <p className="text-xs uppercase tracking-widest text-gold-400/70 mb-8">
            The Art of Luxury Hookah
          </p>

          <h3 className="text-xl text-zinc-100 font-medium mb-4 tracking-wider">
            AGE VERIFICATION
          </h3>
          <p className="text-zinc-400 text-sm leading-relaxed mb-8">
            You must be 18 years of age or older to enter this site. Hukka Dubai products are intended exclusively for adult connoisseurs.
          </p>

          <div className="flex flex-col sm:flex-row gap-4 justify-center">
            <button
              onClick={verifyAge}
              className="px-8 py-3 bg-gradient-to-r from-gold-600 to-gold-400 hover:from-gold-500 hover:to-gold-300 text-black font-semibold tracking-widest text-xs uppercase transition-all duration-300 rounded-sm shadow-lg hover:shadow-gold-500/20 active:scale-95"
            >
              I am 18 or older
            </button>
            <button
              onClick={handleExit}
              className="px-8 py-3 border border-zinc-700 hover:border-gold-500/50 hover:bg-gold-500/5 text-zinc-400 hover:text-gold-200 font-semibold tracking-widest text-xs uppercase transition-all duration-300 rounded-sm active:scale-95"
            >
              Exit Site
            </button>
          </div>

          <p className="mt-8 text-[10px] text-zinc-600 tracking-wider">
            By entering, you agree to our Terms of Service and Privacy Policy. We support responsible adult consumption.
          </p>
        </motion.div>
      </div>
    </AnimatePresence>
  );
}
