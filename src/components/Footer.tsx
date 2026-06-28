'use client';

import React, { useState } from 'react';
import Link from 'next/link';
import { Mail, Phone, MapPin, CheckCircle } from 'lucide-react';

export default function Footer() {
  const [email, setEmail] = useState('');
  const [subscribed, setSubscribed] = useState(false);

  const handleSubscribe = (e: React.FormEvent) => {
    e.preventDefault();
    if (email) {
      setSubscribed(true);
      setEmail('');
    }
  };

  return (
    <footer className="bg-black border-t border-zinc-900 text-zinc-400 text-xs tracking-wider">
      {/* Newsletter / Join Club Section */}
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-12 md:py-16 border-b border-zinc-900 grid grid-cols-1 lg:grid-cols-2 gap-8 items-center">
        <div>
          <h3 className="font-serif text-xl md:text-2xl text-gold-200 tracking-wider uppercase mb-2">
            JOIN THE ELITE HOOKAH CLUB
          </h3>
          <p className="text-zinc-500 leading-relaxed max-w-md">
            Subscribe to receive priority access to limited edition product launches, VIP events, and exclusive seasonal offers.
          </p>
        </div>
        <div>
          {subscribed ? (
            <div className="flex items-center gap-2 text-gold-400 bg-gold-950/20 border border-gold-500/20 p-4 rounded-sm">
              <CheckCircle className="w-5 h-5 flex-shrink-0" />
              <span>You have joined the club. Early access invitations will be sent to your inbox.</span>
            </div>
          ) : (
            <form onSubmit={handleSubscribe} className="flex flex-col sm:flex-row gap-3">
              <input
                type="email"
                required
                placeholder="Enter your email address"
                value={email}
                onChange={(e) => setEmail(e.target.value)}
                className="flex-1 bg-zinc-900 border border-zinc-800 focus:border-gold-500 text-white px-4 py-3 rounded-sm text-xs focus:outline-none tracking-widest uppercase"
              />
              <button
                type="submit"
                className="px-8 py-3 bg-gradient-to-r from-gold-600 to-gold-400 hover:from-gold-500 hover:to-gold-300 text-black font-bold uppercase transition-all duration-300 rounded-sm hover:shadow-lg hover:shadow-gold-500/10 active:scale-95"
              >
                Subscribe
              </button>
            </form>
          )}
        </div>
      </div>

      {/* Main Footer Links */}
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-16 grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-12">
        {/* Brand Block */}
        <div className="space-y-4">
          <h4 className="font-serif text-lg text-gold-200 tracking-widest uppercase">
            HUKKA DUBAI
          </h4>
          <p className="text-zinc-500 leading-relaxed">
            Crafting luxury social experiences since 2018. Designed in Dubai, curated for the connoisseur, and delivered worldwide.
          </p>
          <div className="flex space-x-4 text-zinc-500">
            <a href="#" className="hover:text-gold-400 transition-colors">
              <svg className="w-5 h-5" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"><rect x="2" y="2" width="20" height="20" rx="5" ry="5"/><path d="M16 11.37A4 4 0 1 1 12.63 8 4 4 0 0 1 16 11.37z"/><line x1="17.5" y1="6.5" x2="17.51" y2="6.5"/></svg>
            </a>
            <a href="#" className="hover:text-gold-400 transition-colors">
              <svg className="w-5 h-5" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"><path d="M18 2h-3a5 5 0 0 0-5 5v3H7v4h3v8h4v-8h3l1-4h-4V7a1 1 0 0 1 1-1h3z"/></svg>
            </a>
          </div>
        </div>

        {/* Collections */}
        <div>
          <h5 className="text-xs font-bold text-zinc-100 uppercase tracking-widest mb-6">
            Collections
          </h5>
          <ul className="space-y-4 uppercase tracking-widest text-[10px]">
            <li>
              <Link href="/shop?category=Premium+Hookahs" className="hover:text-gold-400 transition-colors">
                Premium Hookahs
              </Link>
            </li>
            <li>
              <Link href="/shop?category=Modern+Hookahs" className="hover:text-gold-400 transition-colors">
                Modern Hookahs
              </Link>
            </li>
            <li>
              <Link href="/shop?category=Traditional+Hookahs" className="hover:text-gold-400 transition-colors">
                Traditional Hookahs
              </Link>
            </li>
            <li>
              <Link href="/shop?category=Hookah+Accessories" className="hover:text-gold-400 transition-colors">
                Accessories
              </Link>
            </li>
          </ul>
        </div>

        {/* Policies & Help */}
        <div>
          <h5 className="text-xs font-bold text-zinc-100 uppercase tracking-widest mb-6">
            Customer Service
          </h5>
          <ul className="space-y-4 uppercase tracking-widest text-[10px]">
            <li>
              <Link href="/shipping-policy" className="hover:text-gold-400 transition-colors">
                Shipping & Delivery
              </Link>
            </li>
            <li>
              <Link href="/refund-policy" className="hover:text-gold-400 transition-colors">
                Returns & Refunds
              </Link>
            </li>
            <li>
              <Link href="/privacy-policy" className="hover:text-gold-400 transition-colors">
                Privacy Policy
              </Link>
            </li>
            <li>
              <Link href="/terms" className="hover:text-gold-400 transition-colors">
                Terms of Use
              </Link>
            </li>
          </ul>
        </div>

        {/* Contact Info */}
        <div className="space-y-4">
          <h5 className="text-xs font-bold text-zinc-100 uppercase tracking-widest mb-6">
            Dubai Head Office
          </h5>
          <div className="flex items-start gap-3">
            <MapPin className="w-4 h-4 text-gold-400 flex-shrink-0 mt-0.5" />
            <p className="text-zinc-500 leading-relaxed">
              Level 48, Burj Daman, Al Mustaqbal St, DIFC, Dubai, UAE
            </p>
          </div>
          <div className="flex items-center gap-3">
            <Phone className="w-4 h-4 text-gold-400 flex-shrink-0" />
            <p className="text-zinc-500">+971 4 382 9999</p>
          </div>
          <div className="flex items-center gap-3">
            <Mail className="w-4 h-4 text-gold-400 flex-shrink-0" />
            <p className="text-zinc-500">concierge@hukka.ae</p>
          </div>
        </div>
      </div>

      {/* Compliance / 18+ Warning Banner */}
      <div className="bg-zinc-950 py-8 px-4 border-t border-zinc-900">
        <div className="max-w-7xl mx-auto text-center space-y-4">
          <div className="inline-block border border-red-500/30 text-red-500 bg-red-950/10 px-4 py-1.5 rounded-sm text-[10px] font-bold uppercase tracking-widest">
            18+ age restriction warning
          </div>
          <p className="text-[10px] text-zinc-600 max-w-4xl mx-auto leading-relaxed uppercase tracking-widest">
            Warning: Hookah smoking involves tobacco combustion which generates carbon monoxide and toxic compounds. It is harmful to health and highly addictive. Underage sale is strictly prohibited. Hukka Dubai products are exclusively designed for mature adult consumers of 18 years and older. In compliance with COTPA guidelines in India and UAE laws, we enforce age checks on delivery.
          </p>
        </div>
      </div>

      {/* Copyright Bar */}
      <div className="bg-black py-6 border-t border-zinc-900/60 text-[10px] text-zinc-600 uppercase tracking-widest">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 flex flex-col md:flex-row items-center justify-between gap-4">
          <span>&copy; {new Date().getFullYear()} Hukka Dubai (Hukka Luxury Brands LLC). All rights reserved.</span>
          <span>GST Ready Invoicing &bull; Designed in Dubai</span>
        </div>
      </div>
    </footer>
  );
}
