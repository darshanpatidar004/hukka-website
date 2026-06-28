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
      <div className="absolute top-10 right-10 w-96 h-96 bg-gold-600/3 rounded-full blur-[120px] pointer-events-none" />
      <div className="absolute bottom-10 left-10 w-96 h-96 bg-emerald-600/3 rounded-full blur-[120px] pointer-events-none" />

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
    </section>
  );
}
