'use client';

import React from 'react';
import { PlaneTakeoff, Award, Truck, ShieldCheck, HeartHandshake, CheckCircle } from 'lucide-react';
import { motion } from 'framer-motion';

export default function WhyChooseUs() {
  const points = [
    {
      icon: <PlaneTakeoff className="w-8 h-8 text-gold-400" />,
      title: 'Imported Dubai Craft',
      description: 'Authentic Emirati luxury. Every hookah is directly shipped from our Dubai design labs to India.'
    },
    {
      icon: <Award className="w-8 h-8 text-gold-400" />,
      title: 'Premium Engineering',
      description: 'Forged with 304 surgical-grade stainless steel, aerospace titanium, and 24k electroplated gold.'
    },
    {
      icon: <Truck className="w-8 h-8 text-gold-400" />,
      title: 'White-Glove Shipping',
      description: 'Fully insured air-cargo shipping across India in heavy-duty flight cases to ensure absolute protection.'
    },
    {
      icon: <ShieldCheck className="w-8 h-8 text-gold-400" />,
      title: 'Secure Transactions',
      description: 'GST-ready invoicing with fully encrypted Razorpay, Stripe, and net banking payment layers.'
    },
    {
      icon: <HeartHandshake className="w-8 h-8 text-gold-400" />,
      title: 'VIP Concierge Support',
      description: '24/7 access to our premium lounge team for setup guides, spare parts, and custom consultations.'
    },
    {
      icon: <CheckCircle className="w-8 h-8 text-gold-400" />,
      title: '100% Certified Original',
      description: 'Every product features a serial-numbered holographic seal and QR-code to verify authenticity.'
    }
  ];

  return (
    <section id="why-us" className="py-24 bg-zinc-950 px-4 sm:px-6 lg:px-8 max-w-7xl mx-auto w-full relative">
      {/* Glow backgrounds */}
      <div className="absolute top-10 right-10 w-96 h-96 bg-gold-600/5 rounded-full blur-[120px] pointer-events-none" />
      <div className="absolute bottom-10 left-10 w-96 h-96 bg-emerald-600/5 rounded-full blur-[120px] pointer-events-none" />

      <div className="text-center max-w-xl mx-auto mb-16">
        <span className="text-xs uppercase tracking-[0.4em] text-gold-500 font-semibold block mb-3">
          THE HUKKA PROMISE
        </span>
        <h2 className="font-serif text-3xl md:text-5xl text-gold-100 tracking-wide uppercase">
          WHY CHOOSE US
        </h2>
        <div className="w-16 h-[1px] bg-gold-500/50 mx-auto mt-4" />
      </div>

      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-8">
        {points.map((point, idx) => (
          <motion.div
            key={idx}
            initial={{ opacity: 0, y: 20 }}
            whileInView={{ opacity: 1, y: 0 }}
            viewport={{ once: true }}
            transition={{ duration: 0.5, delay: idx * 0.05 }}
            className="group p-6 md:p-8 bg-zinc-900/40 border border-zinc-800/60 rounded-sm hover:border-gold-500/30 transition-all duration-300 flex gap-5"
          >
            <div className="flex-shrink-0 bg-zinc-950 w-16 h-16 rounded-sm border border-zinc-800 flex items-center justify-center group-hover:border-gold-500/50 transition-all duration-300">
              {point.icon}
            </div>
            <div className="space-y-2">
              <h3 className="font-serif text-base text-zinc-100 group-hover:text-gold-200 transition-colors">
                {point.title}
              </h3>
              <p className="text-zinc-500 text-xs leading-relaxed">
                {point.description}
              </p>
            </div>
          </motion.div>
        ))}
      </div>

      {/* ========================================================================= */}
      {/* PERFORMANCE LABS & GRAPHS SECTION */}
      {/* ========================================================================= */}
      <div className="mt-28 border-t border-zinc-900 pt-20">
        <div className="grid grid-cols-1 lg:grid-cols-2 gap-16 items-center">
          {/* Left Column: Scientific Narrative */}
          <motion.div
            initial={{ opacity: 0, x: -30 }}
            whileInView={{ opacity: 1, x: 0 }}
            viewport={{ once: true }}
            transition={{ duration: 0.6 }}
            className="space-y-6"
          >
            <span className="text-xs uppercase tracking-[0.4em] text-gold-500 font-semibold">
              Aerospace Engineering Labs
            </span>
            <h3 className="font-serif text-2xl md:text-4xl text-zinc-100 uppercase tracking-wide">
              Scientific Precision, <br />
              <span className="text-gold-200">Sensory Mastery</span>
            </h3>
            <p className="text-zinc-400 text-sm leading-relaxed">
              We do not rely on guesses. In our Dubai labs, we analyze thermal dynamics, fluid airflow drag, and molecular rust-resistance to engineer hookahs that operate as high-performance art pieces. 
            </p>
            <p className="text-zinc-500 text-xs leading-relaxed">
              Compare the specifications of standard hookahs against the custom metallurgy and airflow chambers built into Hukka Dubai products below.
            </p>
          </motion.div>

          {/* Right Column: Animated Comparison Graphs */}
          <div className="space-y-8 bg-zinc-900/20 border border-zinc-900 p-6 md:p-8 rounded-sm relative">
            <div className="absolute top-0 right-0 w-48 h-48 bg-gold-500/5 rounded-full blur-3xl pointer-events-none" />

            {/* Metric 1: Heat Stability & Session Life */}
            <div className="space-y-3">
              <div className="flex justify-between items-end text-[11px] uppercase tracking-widest font-semibold">
                <span className="text-zinc-300">Session Flavor Life (Minutes)</span>
                <span className="text-gold-400">95 Mins</span>
              </div>
              <div className="space-y-2">
                {/* Traditional Foil Bar */}
                <div className="relative">
                  <div className="flex justify-between text-[9px] text-zinc-500 mb-0.5">
                    <span>Traditional Foil Setup</span>
                    <span>25m</span>
                  </div>
                  <div className="w-full h-2 bg-zinc-950 rounded-full overflow-hidden">
                    <motion.div 
                      initial={{ width: 0 }}
                      whileInView={{ width: "25%" }}
                      viewport={{ once: true }}
                      transition={{ duration: 1, ease: "easeOut" }}
                      className="h-full bg-zinc-700"
                    />
                  </div>
                </div>

                {/* Hukka Dubai Onyx HMD Bar */}
                <div className="relative">
                  <div className="flex justify-between text-[9px] text-gold-300 mb-0.5">
                    <span>Hukka Imperial Onyx HMD v2</span>
                    <span>95m</span>
                  </div>
                  <div className="w-full h-2 bg-zinc-950 rounded-full overflow-hidden">
                    <motion.div 
                      initial={{ width: 0 }}
                      whileInView={{ width: "95%" }}
                      viewport={{ once: true }}
                      transition={{ duration: 1.2, ease: "easeOut", delay: 0.1 }}
                      className="h-full bg-gradient-to-r from-gold-600 to-gold-400 shadow-[0_0_8px_rgba(197,168,109,0.3)]"
                    />
                  </div>
                </div>
              </div>
            </div>

            {/* Metric 2: Material Purity & Toxicity Safety */}
            <div className="space-y-3">
              <div className="flex justify-between items-end text-[11px] uppercase tracking-widest font-semibold">
                <span className="text-zinc-300">Material Purity & Safety Index</span>
                <span className="text-gold-400">99.8%</span>
              </div>
              <div className="space-y-2">
                {/* Standard Alloys Bar */}
                <div className="relative">
                  <div className="flex justify-between text-[9px] text-zinc-500 mb-0.5">
                    <span>Generic Zinc/Alloy Stems (Corrosive)</span>
                    <span>15%</span>
                  </div>
                  <div className="w-full h-2 bg-zinc-950 rounded-full overflow-hidden">
                    <motion.div 
                      initial={{ width: 0 }}
                      whileInView={{ width: "15%" }}
                      viewport={{ once: true }}
                      transition={{ duration: 1, ease: "easeOut" }}
                      className="h-full bg-zinc-700"
                    />
                  </div>
                </div>

                {/* Hukka Titanium Bar */}
                <div className="relative">
                  <div className="flex justify-between text-[9px] text-gold-300 mb-0.5">
                    <span>Hukka Surgical Titanium & Gold Plating</span>
                    <span>99.8%</span>
                  </div>
                  <div className="w-full h-2 bg-zinc-950 rounded-full overflow-hidden">
                    <motion.div 
                      initial={{ width: 0 }}
                      whileInView={{ width: "99.8%" }}
                      viewport={{ once: true }}
                      transition={{ duration: 1.2, ease: "easeOut", delay: 0.2 }}
                      className="h-full bg-gradient-to-r from-gold-600 to-gold-400 shadow-[0_0_8px_rgba(197,168,109,0.3)]"
                    />
                  </div>
                </div>
              </div>
            </div>

            {/* Metric 3: Draw Resistance / Airflow Ease */}
            <div className="space-y-3">
              <div className="flex justify-between items-end text-[11px] uppercase tracking-widest font-semibold">
                <span className="text-zinc-300">Airflow Resistance (Lower is Better)</span>
                <span className="text-gold-400">10 Pa</span>
              </div>
              <div className="space-y-2">
                {/* Traditional Draw Bar */}
                <div className="relative">
                  <div className="flex justify-between text-[9px] text-zinc-500 mb-0.5">
                    <span>Generic Restricted Stem</span>
                    <span>85 Pa</span>
                  </div>
                  <div className="w-full h-2 bg-zinc-950 rounded-full overflow-hidden">
                    <motion.div 
                      initial={{ width: 0 }}
                      whileInView={{ width: "85%" }}
                      viewport={{ once: true }}
                      transition={{ duration: 1, ease: "easeOut" }}
                      className="h-full bg-zinc-700"
                    />
                  </div>
                </div>

                {/* Hukka Burj Diffuser Bar */}
                <div className="relative">
                  <div className="flex justify-between text-[9px] text-gold-300 mb-0.5">
                    <span>Hukka Burj Double-Chamber Diffuser</span>
                    <span>10 Pa</span>
                  </div>
                  <div className="w-full h-2 bg-zinc-950 rounded-full overflow-hidden">
                    <motion.div 
                      initial={{ width: 0 }}
                      whileInView={{ width: "10%" }}
                      viewport={{ once: true }}
                      transition={{ duration: 1.2, ease: "easeOut", delay: 0.3 }}
                      className="h-full bg-gradient-to-r from-gold-600 to-gold-400 shadow-[0_0_8px_rgba(197,168,109,0.3)]"
                    />
                  </div>
                </div>
              </div>
            </div>

          </div>
        </div>
      </div>
    </section>
  );
}
