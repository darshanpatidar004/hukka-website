'use client';

import React, { useState } from 'react';
import { useApp } from '@/context/AppContext';
import { Heart, ShoppingBag, Eye, Star, ChevronLeft, ChevronRight, Check } from 'lucide-react';
import { motion, AnimatePresence } from 'framer-motion';
import Link from 'next/link';

interface BestSellersProps {
  products: any[];
  isPage?: boolean;
}

export default function BestSellers({ products, isPage = false }: BestSellersProps) {
  const { toggleWishlist, wishlist, addToCart } = useApp();
  const [addedItems, setAddedItems] = useState<{ [key: string]: boolean }>({});
  const [currentIndex, setCurrentIndex] = useState(0);

  const bestSellers = products.filter((p) => p.is_bestseller).slice(0, 6);

  const handleAddToCart = (product: any) => {
    addToCart(product, 1);
    setAddedItems((prev) => ({ ...prev, [product.id]: true }));
    setTimeout(() => {
      setAddedItems((prev) => ({ ...prev, [product.id]: false }));
    }, 2000);
  };

  const nextSlide = () => {
    setCurrentIndex((prev) => (prev + 1 >= bestSellers.length - 2 ? 0 : prev + 1));
  };

  const prevSlide = () => {
    setCurrentIndex((prev) => (prev === 0 ? bestSellers.length - 3 : prev - 1));
  };

  return (
    <section id="bestsellers" className="py-24 px-4 sm:px-6 lg:px-8 max-w-7xl mx-auto relative overflow-hidden">
      {/* Decorative smoky backdrop */}
      <div className="absolute top-1/2 left-1/4 -translate-y-1/2 w-96 h-96 bg-gold-500/5 rounded-full blur-[120px] pointer-events-none" />

      {/* Header */}
      <div className="flex flex-col md:flex-row md:items-end justify-between mb-16">
        <div>
          <span className="text-xs uppercase tracking-[0.4em] text-gold-500 font-semibold block mb-3">
            MOST COVETED CREATIONS
          </span>
          <h2 className="font-serif text-3xl md:text-5xl text-gold-100 tracking-wide uppercase">
            {isPage ? "THE ULTIMATE COLLECTION" : "THE BEST SELLERS"}
          </h2>
        </div>
        {/* Navigation arrows (Only show in carousel mode) */}
        {!isPage && (
          <div className="flex gap-3 mt-6 md:mt-0">
            <button
              onClick={prevSlide}
              className="w-12 h-12 rounded-full border border-zinc-800 hover:border-gold-500/50 hover:bg-gold-500/5 flex items-center justify-center text-zinc-400 hover:text-gold-200 transition-all duration-300 active:scale-90"
            >
              <ChevronLeft className="w-5 h-5" />
            </button>
            <button
              onClick={nextSlide}
              className="w-12 h-12 rounded-full border border-zinc-800 hover:border-gold-500/50 hover:bg-gold-500/5 flex items-center justify-center text-zinc-400 hover:text-gold-200 transition-all duration-300 active:scale-90"
            >
              <ChevronRight className="w-5 h-5" />
            </button>
          </div>
        )}
      </div>

      {/* Grid or Slider viewport */}
      <div className="relative">
        <div className={isPage ? "grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-8" : "grid grid-cols-1 md:grid-cols-3 gap-8"}>
          <AnimatePresence mode="popLayout">
            {(isPage ? bestSellers : bestSellers.slice(currentIndex, currentIndex + 3)).map((product, index) => {
              const isWishlisted = wishlist.includes(product.id);
              const isAdded = addedItems[product.id];
              const rank = index + 1;

              return (
                <motion.div
                  key={product.id}
                  layout
                  initial={{ opacity: 0, y: 30 }}
                  whileInView={{ opacity: 1, y: 0 }}
                  viewport={{ once: true }}
                  transition={{ duration: 0.5, delay: index * 0.05 }}
                  className="group relative bg-zinc-900/20 border border-zinc-850 p-5 rounded-sm flex flex-col justify-between hover:border-gold-500/30 transition-all duration-500 overflow-hidden"
                >
                  {/* Decorative light sweep line */}
                  <div className="absolute top-0 -left-[100%] w-[50%] h-full bg-gradient-to-r from-transparent via-white/5 to-transparent skew-x-12 group-hover:left-[200%] transition-all duration-[1200ms] ease-out pointer-events-none" />

                  {/* Rank Number (Visible on Bestseller page) */}
                  {isPage && (
                    <span className="absolute -bottom-8 -right-4 font-serif text-[120px] font-bold text-zinc-950/40 select-none group-hover:text-gold-500/5 transition-colors duration-500 pointer-events-none">
                      {rank < 10 ? `0${rank}` : rank}
                    </span>
                  )}

                  <div>
                    {/* Badge */}
                    {product.is_new_arrival && (
                      <span className="absolute top-4 left-4 bg-gold-500/10 text-gold-400 border border-gold-500/20 text-[9px] font-bold uppercase tracking-widest px-2.5 py-1 rounded-sm z-10">
                        New Arrival
                      </span>
                    )}

                    {/* Wishlist Button */}
                    <button
                      onClick={() => toggleWishlist(product.id)}
                      className={`absolute top-4 right-4 z-10 w-9 h-9 rounded-full bg-zinc-950/80 border border-zinc-800 flex items-center justify-center transition-all duration-300 hover:scale-105 active:scale-90 ${
                        isWishlisted ? 'text-red-500 border-red-500/20 bg-red-950/10' : 'text-zinc-400 hover:text-gold-400'
                      }`}
                    >
                      <Heart className="w-4 h-4" fill={isWishlisted ? 'currentColor' : 'none'} />
                    </button>

                    {/* Product Image Holder */}
                    <div className="relative w-full h-72 mb-6 bg-zinc-950 border border-zinc-900/60 rounded-sm flex items-center justify-center overflow-hidden">
                      <div className="absolute inset-0 bg-[radial-gradient(circle_at_center,rgba(180,120,34,0.05)_0%,rgba(0,0,0,0)_70%)] pointer-events-none" />
                      
                      {product.image_url ? (
                        <img
                          src={product.image_url}
                          alt={product.name}
                          className="w-full h-full object-cover group-hover:scale-105 transition-transform duration-500"
                        />
                      ) : (
                        <>
                          <div className="absolute inset-0 bg-gradient-to-t from-black/80 to-transparent opacity-40" />
                          <div className="absolute w-28 h-28 rounded-full bg-radial from-gold-500/10 to-transparent filter blur-xl group-hover:scale-125 transition-transform duration-500" />
                          <div className="relative text-center select-none">
                            <span className="font-serif text-zinc-500 text-sm italic block group-hover:text-gold-200 transition-colors duration-300 mb-1">
                              {product.material?.split(' & ')[0]}
                            </span>
                            <span className="text-[10px] uppercase tracking-widest text-gold-400/60 block">
                              Height: {product.height}
                            </span>
                          </div>
                        </>
                      )}

                      {/* Quick View Button overlay */}
                      <div className="absolute inset-0 flex items-center justify-center opacity-0 group-hover:opacity-100 transition-opacity duration-300 bg-black/60 backdrop-blur-xs">
                        <Link
                          href={`/products/${product.slug}`}
                          className="px-6 py-2.5 bg-white text-black font-bold uppercase tracking-widest text-[10px] rounded-sm flex items-center gap-1.5 hover:bg-gold-400 transition-colors"
                        >
                          <Eye className="w-3.5 h-3.5" /> View Details
                        </Link>
                      </div>
                    </div>

                    {/* Info */}
                    <div className="mb-4 relative z-10">
                      <div className="flex items-center gap-1 text-gold-400 text-xs mb-2">
                        <div className="flex">
                          {[...Array(5)].map((_, i) => (
                            <Star
                              key={i}
                              className={`w-3.5 h-3.5 ${
                                i < Math.floor(product.rating) ? 'fill-currentColor' : 'text-zinc-800'
                              }`}
                            />
                          ))}
                        </div>
                        <span className="text-zinc-500 text-[10px] font-medium ml-1">
                          ({product.reviews_count} Reviews)
                        </span>
                      </div>
                      <Link href={`/products/${product.slug}`}>
                        <h3 className="font-serif text-lg text-zinc-100 hover:text-gold-300 transition-colors tracking-wide truncate">
                          {product.name}
                        </h3>
                      </Link>
                      <p className="text-zinc-500 text-xs line-clamp-2 mt-1 leading-relaxed">
                        {product.description}
                      </p>
                    </div>
                  </div>

                  {/* Purchase Action */}
                  <div className="flex items-center justify-between pt-4 border-t border-zinc-900/60 relative z-10">
                    <span className="text-sm font-semibold text-gold-300">
                      ₹{product.price.toLocaleString('en-IN')}
                    </span>
                    <button
                      onClick={() => handleAddToCart(product)}
                      className={`px-4 py-2 text-[10px] font-bold uppercase tracking-widest transition-all rounded-sm flex items-center gap-1.5 active:scale-95 ${
                        isAdded
                          ? 'bg-green-500/10 text-green-400 border border-green-500/20'
                          : 'bg-zinc-950 hover:bg-gold-500 hover:text-black text-gold-400 border border-zinc-800 hover:border-gold-500'
                      }`}
                    >
                      {isAdded ? (
                        <>
                          <Check className="w-3.5 h-3.5" /> Added
                        </>
                      ) : (
                        <>
                          <ShoppingBag className="w-3.5 h-3.5" /> Add to Cart
                        </>
                      )}
                    </button>
                  </div>
                </motion.div>
              );
            })}
          </AnimatePresence>
        </div>
      </div>
    </section>
  );
}
