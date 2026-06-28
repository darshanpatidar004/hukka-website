'use client';

import React, { useState } from 'react';
import Link from 'next/link';
import { useApp } from '@/context/AppContext';
import { ShoppingBag, Heart, User as UserIcon, Menu, X, ShieldCheck } from 'lucide-react';
import CartDrawer from './CartDrawer';
import { motion, AnimatePresence } from 'framer-motion';

export default function Header() {
  const { cart, wishlist, user, logout } = useApp();
  const [cartOpen, setCartOpen] = useState(false);
  const [mobileMenuOpen, setMobileMenuOpen] = useState(false);

  const cartItemsCount = cart.reduce((sum, item) => sum + item.quantity, 0);

  return (
    <>
      <header className="sticky top-0 z-40 w-full glass-nav">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 h-20 flex items-center justify-between">
          {/* Mobile Menu Toggle */}
          <div className="flex md:hidden">
            <button
              onClick={() => setMobileMenuOpen(!mobileMenuOpen)}
              className="text-zinc-400 hover:text-gold-400 p-2"
            >
              {mobileMenuOpen ? <X className="w-6 h-6" /> : <Menu className="w-6 h-6" />}
            </button>
          </div>

          {/* Logo */}
          <div className="flex-1 md:flex-initial text-center md:text-left">
            <Link href="/" className="inline-block">
              <h1 className="font-serif text-xl md:text-2xl tracking-widest text-gold-200 hover:text-gold-400 transition-colors uppercase">
                HUKKA <span className="font-sans font-light text-sm text-gold-500 tracking-[0.3em] ml-1">DUBAI</span>
              </h1>
            </Link>
          </div>

          {/* Desktop Navigation */}
          <nav className="hidden md:flex items-center space-x-8 text-xs uppercase tracking-widest font-medium">
            <Link href="/shop" className="text-zinc-300 hover:text-gold-400 transition-colors duration-200">
              Shop Collection
            </Link>
            <a href="/#bestsellers" className="text-zinc-300 hover:text-gold-400 transition-colors duration-200">
              Best Sellers
            </a>
            <a href="/#why-us" className="text-zinc-300 hover:text-gold-400 transition-colors duration-200">
              Why Us
            </a>
            <a href="/#story" className="text-zinc-300 hover:text-gold-400 transition-colors duration-200">
              Our Story
            </a>
            {user?.role === 'admin' && (
              <Link href="/admin" className="text-gold-400 hover:text-gold-200 transition-colors duration-200 flex items-center gap-1">
                <ShieldCheck className="w-3.5 h-3.5" /> Admin
              </Link>
            )}
          </nav>

          {/* Utility Icons */}
          <div className="flex items-center space-x-3 md:space-x-6">
            {/* Wishlist */}
            <Link href="/dashboard?tab=wishlist" className="relative p-2 text-zinc-400 hover:text-gold-400 transition-colors">
              <Heart className="w-5 h-5" />
              {wishlist.length > 0 && (
                <span className="absolute top-1 right-1 w-4 h-4 bg-gold-500 text-black text-[9px] font-bold rounded-full flex items-center justify-center border border-black animate-pulse">
                  {wishlist.length}
                </span>
              )}
            </Link>

            {/* Shopping Cart */}
            <button
              onClick={() => setCartOpen(true)}
              className="relative p-2 text-zinc-400 hover:text-gold-400 transition-colors"
            >
              <ShoppingBag className="w-5 h-5" />
              {cartItemsCount > 0 && (
                <span className="absolute top-1 right-1 w-4 h-4 bg-gold-500 text-black text-[9px] font-bold rounded-full flex items-center justify-center border border-black">
                  {cartItemsCount}
                </span>
              )}
            </button>

            {/* User Account / Login */}
            {user ? (
              <div className="relative group">
                <Link
                  href="/dashboard"
                  className="flex items-center gap-2 py-2 text-zinc-300 hover:text-gold-400 transition-colors text-xs font-semibold uppercase tracking-widest"
                >
                  <UserIcon className="w-4 h-4 text-gold-400" />
                  <span className="hidden lg:inline max-w-[100px] truncate">{user.name.split(' ')[0]}</span>
                </Link>
                {/* Simple dropdown */}
                <div className="absolute right-0 top-full mt-1 w-48 bg-zinc-950 border border-zinc-800 rounded-sm opacity-0 pointer-events-none group-hover:opacity-100 group-hover:pointer-events-auto transition-all duration-200 z-50 p-2 space-y-1 shadow-xl">
                  <Link
                    href="/dashboard"
                    className="block px-4 py-2 hover:bg-zinc-900 text-xs text-zinc-300 hover:text-gold-400 uppercase tracking-widest transition-colors"
                  >
                    Dashboard
                  </Link>
                  {user.role === 'admin' && (
                    <Link
                      href="/admin"
                      className="block px-4 py-2 hover:bg-zinc-900 text-xs text-gold-400 hover:text-gold-200 uppercase tracking-widest transition-colors"
                    >
                      Admin Panel
                    </Link>
                  )}
                  <button
                    onClick={logout}
                    className="w-full text-left block px-4 py-2 hover:bg-zinc-900 text-xs text-red-400 hover:text-red-300 uppercase tracking-widest transition-colors"
                  >
                    Logout
                  </button>
                </div>
              </div>
            ) : (
              <Link
                href="/auth"
                className="flex items-center gap-1.5 p-2 text-zinc-400 hover:text-gold-400 transition-colors text-xs font-semibold uppercase tracking-widest"
              >
                <UserIcon className="w-5 h-5" />
                <span className="hidden md:inline text-[11px] tracking-widest">Sign In</span>
              </Link>
            )}
          </div>
        </div>

        {/* Mobile Navigation Drawer */}
        <AnimatePresence>
          {mobileMenuOpen && (
            <motion.div
              initial={{ opacity: 0, height: 0 }}
              animate={{ opacity: 1, height: 'auto' }}
              exit={{ opacity: 0, height: 0 }}
              className="md:hidden border-b border-zinc-800 bg-zinc-950 overflow-hidden"
            >
              <div className="px-4 pt-2 pb-6 space-y-3 flex flex-col text-xs uppercase tracking-widest font-medium">
                <Link
                  href="/shop"
                  onClick={() => setMobileMenuOpen(false)}
                  className="text-zinc-300 hover:text-gold-400 py-2 border-b border-zinc-900 transition-colors"
                >
                  Shop Collection
                </Link>
                <a
                  href="/#bestsellers"
                  onClick={() => setMobileMenuOpen(false)}
                  className="text-zinc-300 hover:text-gold-400 py-2 border-b border-zinc-900 transition-colors"
                >
                  Best Sellers
                </a>
                <a
                  href="/#why-us"
                  onClick={() => setMobileMenuOpen(false)}
                  className="text-zinc-300 hover:text-gold-400 py-2 border-b border-zinc-900 transition-colors"
                >
                  Why Us
                </a>
                <a
                  href="/#story"
                  onClick={() => setMobileMenuOpen(false)}
                  className="text-zinc-300 hover:text-gold-400 py-2 border-b border-zinc-900 transition-colors"
                >
                  Our Story
                </a>
                {user?.role === 'admin' && (
                  <Link
                    href="/admin"
                    onClick={() => setMobileMenuOpen(false)}
                    className="text-gold-400 hover:text-gold-200 py-2 border-b border-zinc-900 transition-colors"
                  >
                    Admin Panel
                  </Link>
                )}
                {user ? (
                  <button
                    onClick={() => {
                      logout();
                      setMobileMenuOpen(false);
                    }}
                    className="w-full text-left text-red-400 hover:text-red-300 py-2 transition-colors"
                  >
                    Logout ({user.name})
                  </button>
                ) : (
                  <Link
                    href="/auth"
                    onClick={() => setMobileMenuOpen(false)}
                    className="text-zinc-400 hover:text-gold-400 py-2 transition-colors"
                  >
                    Sign In
                  </Link>
                )}
              </div>
            </motion.div>
          )}
        </AnimatePresence>
      </header>

      {/* Shopping Cart Drawer overlay */}
      <CartDrawer isOpen={cartOpen} onClose={() => setCartOpen(false)} />
    </>
  );
}
