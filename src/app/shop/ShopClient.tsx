'use client';

import React, { useState, useEffect, useMemo } from 'react';
import { useSearchParams } from 'next/navigation';
import { useApp } from '@/context/AppContext';
import { Heart, ShoppingBag, Eye, Star, Search, SlidersHorizontal, Check, RefreshCw } from 'lucide-react';
import { motion, AnimatePresence } from 'framer-motion';
import Link from 'next/link';

interface ShopClientProps {
  initialProducts: any[];
}

export default function ShopClient({ initialProducts }: ShopClientProps) {
  const searchParams = useSearchParams();
  const { toggleWishlist, wishlist, addToCart } = useApp();

  // Filters State
  const [selectedCategory, setSelectedCategory] = useState('All');
  const [selectedPriceRange, setSelectedPriceRange] = useState('All');
  const [searchQuery, setSearchQuery] = useState('');
  const [sortBy, setSortBy] = useState('newest');
  const [addedItems, setAddedItems] = useState<{ [key: string]: boolean }>({});
  const [mobileFiltersOpen, setMobileFiltersOpen] = useState(false);

  // Set initial category from URL query parameters if present
  useEffect(() => {
    const catParam = searchParams.get('category');
    if (catParam) {
      setSelectedCategory(catParam);
    }
  }, [searchParams]);

  // Categories list
  const categories = [
    'All',
    'Premium Hookahs',
    'Modern Hookahs',
    'Traditional Hookahs',
    'Travel Hookahs',
    'Designer Hookahs',
    'Hookah Accessories',
    'Charcoal & Consumables'
  ];

  // Price ranges list
  const priceRanges = [
    { label: 'All Prices', value: 'All' },
    { label: 'Under ₹10,000', value: '0-10000' },
    { label: '₹10,000 - ₹50,000', value: '10000-50000' },
    { label: '₹50,000 - ₹1,000,000', value: '50000-1000000' }
  ];

  // Filter and sort products in-memory
  const filteredProducts = useMemo(() => {
    let result = [...initialProducts];

    // Filter by Category
    if (selectedCategory !== 'All') {
      result = result.filter((p) => p.category === selectedCategory);
    }

    // Filter by Price
    if (selectedPriceRange !== 'All') {
      const [min, max] = selectedPriceRange.split('-').map(Number);
      result = result.filter((p) => p.price >= min && p.price <= max);
    }

    // Filter by Search Query
    if (searchQuery.trim() !== '') {
      const query = searchQuery.toLowerCase();
      result = result.filter(
        (p) =>
          p.name.toLowerCase().includes(query) ||
          p.description.toLowerCase().includes(query) ||
          p.material.toLowerCase().includes(query)
      );
    }

    // Sort Products
    if (sortBy === 'price-asc') {
      result.sort((a, b) => a.price - b.price);
    } else if (sortBy === 'price-desc') {
      result.sort((a, b) => b.price - a.price);
    } else if (sortBy === 'rating') {
      result.sort((a, b) => b.rating - a.rating);
    } else {
      // Default / Newest
      result.sort((a, b) => new Date(b.created_at).getTime() - new Date(a.created_at).getTime());
    }

    return result;
  }, [initialProducts, selectedCategory, selectedPriceRange, searchQuery, sortBy]);

  const handleAddToCart = (product: any) => {
    addToCart(product, 1);
    setAddedItems((prev) => ({ ...prev, [product.id]: true }));
    setTimeout(() => {
      setAddedItems((prev) => ({ ...prev, [product.id]: false }));
    }, 2000);
  };

  const resetFilters = () => {
    setSelectedCategory('All');
    setSelectedPriceRange('All');
    setSearchQuery('');
    setSortBy('newest');
  };

  return (
    <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-12">
      {/* Page Header */}
      <div className="text-center md:text-left mb-12">
        <span className="text-xs uppercase tracking-[0.4em] text-gold-500 font-semibold block mb-2">
          ARTISANAL SELECTION
        </span>
        <h1 className="font-serif text-3xl md:text-5xl text-gold-200 tracking-wide uppercase">
          THE COLLECTION
        </h1>
        <p className="text-zinc-500 text-xs mt-2 max-w-xl">
          Browse our collection of imported hookahs, heat management systems, mouth-blown crystal bases, and premium consumables.
        </p>
      </div>

      {/* Control Bar */}
      <div className="flex flex-col md:flex-row gap-4 justify-between items-center bg-zinc-900/30 border border-zinc-900 p-4 rounded-sm mb-8">
        {/* Search */}
        <div className="relative w-full md:max-w-xs">
          <Search className="absolute left-3 top-1/2 -translate-y-1/2 w-4 h-4 text-zinc-500" />
          <input
            type="text"
            placeholder="Search collections..."
            value={searchQuery}
            onChange={(e) => setSearchQuery(e.target.value)}
            className="w-full bg-zinc-950 border border-zinc-800 text-zinc-100 rounded-sm pl-9 pr-4 py-2 text-xs focus:outline-none focus:border-gold-500 uppercase tracking-widest"
          />
        </div>

        {/* Info & Sorting */}
        <div className="flex items-center justify-between md:justify-end w-full md:w-auto gap-4">
          <span className="text-[10px] text-zinc-500 uppercase tracking-widest">
            {filteredProducts.length} Items Found
          </span>

          <div className="flex gap-2">
            <button
              onClick={() => setMobileFiltersOpen(true)}
              className="lg:hidden flex items-center gap-2 px-4 py-2 bg-zinc-950 border border-zinc-800 text-xs uppercase tracking-widest text-zinc-300 rounded-sm"
            >
              <SlidersHorizontal className="w-4.5 h-4.5 text-gold-400" /> Filters
            </button>

            <select
              value={sortBy}
              onChange={(e) => setSortBy(e.target.value)}
              className="bg-zinc-950 border border-zinc-800 text-zinc-300 text-xs rounded-sm px-4 py-2 focus:outline-none focus:border-gold-500 uppercase tracking-widest"
            >
              <option value="newest">New Arrivals</option>
              <option value="price-asc">Price: Low to High</option>
              <option value="price-desc">Price: High to Low</option>
              <option value="rating">Top Rated</option>
            </select>
          </div>
        </div>
      </div>

      {/* Grid Layout */}
      <div className="grid grid-cols-1 lg:grid-cols-4 gap-8">
        {/* Sidebar Filters (Desktop) */}
        <aside className="hidden lg:block space-y-8">
          {/* Categories */}
          <div className="space-y-4">
            <h3 className="font-serif text-sm text-gold-300 uppercase tracking-wider pb-2 border-b border-zinc-900">
              Categories
            </h3>
            <div className="flex flex-col gap-2">
              {categories.map((cat) => (
                <button
                  key={cat}
                  onClick={() => setSelectedCategory(cat)}
                  className={`text-left text-xs uppercase tracking-wider py-1.5 transition-colors ${
                    selectedCategory === cat ? 'text-gold-400 font-semibold' : 'text-zinc-500 hover:text-zinc-300'
                  }`}
                >
                  {cat}
                </button>
              ))}
            </div>
          </div>

          {/* Price Range */}
          <div className="space-y-4">
            <h3 className="font-serif text-sm text-gold-300 uppercase tracking-wider pb-2 border-b border-zinc-900">
              Price Range
            </h3>
            <div className="flex flex-col gap-2">
              {priceRanges.map((range) => (
                <button
                  key={range.value}
                  onClick={() => setSelectedPriceRange(range.value)}
                  className={`text-left text-xs uppercase tracking-wider py-1.5 transition-colors ${
                    selectedPriceRange === range.value ? 'text-gold-400 font-semibold' : 'text-zinc-500 hover:text-zinc-300'
                  }`}
                >
                  {range.label}
                </button>
              ))}
            </div>
          </div>

          {/* Reset Filters button */}
          <button
            onClick={resetFilters}
            className="w-full py-3 border border-zinc-800 hover:border-gold-500/50 hover:bg-gold-500/5 text-zinc-400 hover:text-gold-200 text-xs font-bold uppercase tracking-widest rounded-sm transition-all flex items-center justify-center gap-2"
          >
            <RefreshCw className="w-3.5 h-3.5" /> Clear Filters
          </button>
        </aside>

        {/* Product Grid Area */}
        <div className="lg:col-span-3">
          {filteredProducts.length === 0 ? (
            <div className="text-center py-20 bg-zinc-900/10 border border-zinc-900 rounded-sm space-y-4">
              <p className="text-zinc-400 text-sm font-serif">No products match your active filters.</p>
              <button
                onClick={resetFilters}
                className="px-6 py-2.5 bg-gold-500 hover:bg-gold-400 text-black font-semibold text-xs uppercase tracking-widest rounded-sm transition-colors"
              >
                Reset Filters
              </button>
            </div>
          ) : (
            <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-6">
              <AnimatePresence>
                {filteredProducts.map((product) => {
                  const isWishlisted = wishlist.includes(product.id);
                  const isAdded = addedItems[product.id];

                  return (
                    <motion.div
                      key={product.id}
                      layout
                      initial={{ opacity: 0, scale: 0.95 }}
                      animate={{ opacity: 1, scale: 1 }}
                      exit={{ opacity: 0, scale: 0.95 }}
                      transition={{ duration: 0.3 }}
                      className="group relative glass-panel p-4 rounded-sm flex flex-col justify-between"
                    >
                      <div>
                        {/* Wishlist button */}
                        <button
                          onClick={() => toggleWishlist(product.id)}
                          className={`absolute top-4 right-4 z-10 w-8 h-8 rounded-full bg-zinc-950/80 border border-zinc-800 flex items-center justify-center transition-all ${
                            isWishlisted ? 'text-red-500 bg-red-950/10' : 'text-zinc-400 hover:text-gold-400'
                          }`}
                        >
                          <Heart className="w-3.5 h-3.5" fill={isWishlisted ? 'currentColor' : 'none'} />
                        </button>

                        {/* Visual Image container */}
                        <div className="relative w-full h-56 mb-4 bg-zinc-950 border border-zinc-900 rounded-sm flex items-center justify-center overflow-hidden">
                          {product.image_url ? (
                            <img
                              src={product.image_url}
                              alt={product.name}
                              className="w-full h-full object-cover group-hover:scale-105 transition-transform duration-500"
                            />
                          ) : (
                            <>
                              <div className="absolute w-20 h-20 rounded-full bg-gold-500/5 filter blur-lg group-hover:scale-125 transition-transform duration-500" />
                              <div className="text-center font-serif text-zinc-500 text-xs italic">
                                {product.material?.split(' & ')[0]}
                              </div>
                            </>
                          )}

                          {/* Quick View Button overlay */}
                          <div className="absolute inset-0 flex items-center justify-center opacity-0 group-hover:opacity-100 transition-opacity duration-300 bg-black/60">
                            <Link
                              href={`/products/${product.slug}`}
                              className="px-5 py-2 bg-white text-black font-bold uppercase tracking-widest text-[9px] rounded-sm flex items-center gap-1 hover:bg-gold-400 transition-colors"
                            >
                              <Eye className="w-3.5 h-3.5" /> View Details
                            </Link>
                          </div>
                        </div>


                        {/* Meta Info */}
                        <div className="space-y-1 mb-4">
                          <div className="flex items-center gap-1 text-gold-400 text-[10px]">
                            <div className="flex">
                              {[...Array(5)].map((_, i) => (
                                <Star
                                  key={i}
                                  className={`w-3 h-3 ${
                                    i < Math.floor(product.rating) ? 'fill-currentColor' : 'text-zinc-800'
                                  }`}
                                />
                              ))}
                            </div>
                            <span className="text-zinc-500 font-medium">({product.reviews_count})</span>
                          </div>
                          <Link href={`/products/${product.slug}`}>
                            <h3 className="font-serif text-base text-zinc-100 hover:text-gold-300 transition-colors tracking-wide truncate">
                              {product.name}
                            </h3>
                          </Link>
                          <p className="text-[11px] text-zinc-500 uppercase tracking-widest">{product.category}</p>
                        </div>
                      </div>

                      {/* Buy Action */}
                      <div className="flex items-center justify-between pt-3 border-t border-zinc-900/60">
                        <span className="text-xs font-semibold text-zinc-200">
                          ₹{product.price.toLocaleString('en-IN')}
                        </span>
                        <button
                          onClick={() => handleAddToCart(product)}
                          className={`px-3 py-1.5 text-[9px] font-bold uppercase tracking-widest transition-all rounded-sm flex items-center gap-1 ${
                            isAdded
                              ? 'bg-green-500/10 text-green-400 border border-green-500/20'
                              : 'bg-zinc-900 hover:bg-gold-500 hover:text-black text-gold-400 border border-zinc-800'
                          }`}
                        >
                          {isAdded ? <Check className="w-3 h-3" /> : <ShoppingBag className="w-3 h-3" />}
                          {isAdded ? 'Added' : 'Add'}
                        </button>
                      </div>
                    </motion.div>
                  );
                })}
              </AnimatePresence>
            </div>
          )}
        </div>
      </div>

      {/* Mobile Filters Drawer */}
      <AnimatePresence>
        {mobileFiltersOpen && (
          <>
            <motion.div
              initial={{ opacity: 0 }}
              animate={{ opacity: 0.6 }}
              exit={{ opacity: 0 }}
              onClick={() => setMobileFiltersOpen(false)}
              className="fixed inset-0 bg-black/80 backdrop-blur-xs z-50 lg:hidden"
            />
            <motion.div
              initial={{ x: '-100%' }}
              animate={{ x: 0 }}
              exit={{ x: '-100%' }}
              transition={{ type: 'tween', duration: 0.3 }}
              className="fixed top-0 left-0 h-full w-80 bg-zinc-950 border-r border-zinc-850 p-6 z-50 text-white flex flex-col justify-between overflow-y-auto lg:hidden"
            >
              <div className="space-y-8">
                <div className="flex justify-between items-center pb-4 border-b border-zinc-900">
                  <h2 className="font-serif text-lg tracking-wider text-gold-200 uppercase">FILTERS</h2>
                  <button onClick={() => setMobileFiltersOpen(false)} className="text-zinc-400 hover:text-gold-400">
                    Close &times;
                  </button>
                </div>

                {/* Categories */}
                <div className="space-y-3">
                  <h4 className="text-xs font-bold text-gold-400 uppercase tracking-widest">Categories</h4>
                  <div className="flex flex-col gap-2">
                    {categories.map((cat) => (
                      <button
                        key={cat}
                        onClick={() => {
                          setSelectedCategory(cat);
                          setMobileFiltersOpen(false);
                        }}
                        className={`text-left text-xs uppercase py-1.5 transition-colors ${
                          selectedCategory === cat ? 'text-gold-400 font-semibold' : 'text-zinc-500'
                        }`}
                      >
                        {cat}
                      </button>
                    ))}
                  </div>
                </div>

                {/* Prices */}
                <div className="space-y-3">
                  <h4 className="text-xs font-bold text-gold-400 uppercase tracking-widest">Price Range</h4>
                  <div className="flex flex-col gap-2">
                    {priceRanges.map((range) => (
                      <button
                        key={range.value}
                        onClick={() => {
                          setSelectedPriceRange(range.value);
                          setMobileFiltersOpen(false);
                        }}
                        className={`text-left text-xs uppercase py-1.5 transition-colors ${
                          selectedPriceRange === range.value ? 'text-gold-400 font-semibold' : 'text-zinc-500'
                        }`}
                      >
                        {range.label}
                      </button>
                    ))}
                  </div>
                </div>
              </div>

              <button
                onClick={() => {
                  resetFilters();
                  setMobileFiltersOpen(false);
                }}
                className="w-full py-3 bg-zinc-900 border border-zinc-800 hover:bg-zinc-800 text-zinc-300 text-xs uppercase tracking-widest rounded-sm transition-all"
              >
                Clear All Filters
              </button>
            </motion.div>
          </>
        )}
      </AnimatePresence>
    </div>
  );
}
