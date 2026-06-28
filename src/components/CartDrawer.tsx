'use client';

import React, { useState } from 'react';
import { useApp } from '@/context/AppContext';
import { X, ShoppingBag, Plus, Minus, Trash2, Tag, ArrowRight } from 'lucide-react';
import { motion, AnimatePresence } from 'framer-motion';
import Link from 'next/link';

interface CartDrawerProps {
  isOpen: boolean;
  onClose: () => void;
}

export default function CartDrawer({ isOpen, onClose }: CartDrawerProps) {
  const {
    cart,
    updateCartQuantity,
    removeFromCart,
    coupon,
    applyCoupon,
    removeCoupon,
    addToCart
  } = useApp();

  const [couponCode, setCouponCode] = useState('');
  const [couponError, setCouponError] = useState('');
  const [couponSuccess, setCouponSuccess] = useState('');

  const subtotal = cart.reduce((sum, item) => sum + item.price * item.quantity, 0);
  const discountAmount = coupon ? (subtotal * coupon.discountPercent) / 100 : 0;
  const shipping = subtotal > 50000 ? 0 : subtotal === 0 ? 0 : 1500; // Free shipping over 50k INR
  const total = subtotal - discountAmount + shipping;

  const handleApplyCoupon = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!couponCode) return;
    setCouponError('');
    setCouponSuccess('');
    const res = await applyCoupon(couponCode);
    if (res.success) {
      setCouponSuccess(res.message);
      setCouponCode('');
    } else {
      setCouponError(res.message);
    }
  };

  // Upsell item recommendation (e.g. Sultan's Charcoal p6)
  const upsellItem = {
    id: 'p6',
    name: "Sultan's Premium Coconut Charcoals",
    slug: 'sultans-premium-coconut-charcoals',
    price: 2500,
    image_url: '/products/charcoal.jpg',
    category: 'Charcoal & Consumables'
  };

  const isUpsellAlreadyInCart = cart.some(item => item.id === upsellItem.id);

  return (
    <AnimatePresence>
      {isOpen && (
        <>
          {/* Backdrop */}
          <motion.div
            initial={{ opacity: 0 }}
            animate={{ opacity: 0.6 }}
            exit={{ opacity: 0 }}
            onClick={onClose}
            className="fixed inset-0 z-50 bg-black/80 backdrop-blur-sm"
          />

          {/* Drawer Panel */}
          <motion.div
            initial={{ x: '100%' }}
            animate={{ x: 0 }}
            exit={{ x: '100%' }}
            transition={{ type: 'tween', duration: 0.35, ease: 'easeInOut' }}
            className="fixed top-0 right-0 z-50 h-full w-full max-w-md bg-zinc-950 border-l border-zinc-800 text-white shadow-2xl flex flex-col"
          >
            {/* Header */}
            <div className="p-6 border-b border-zinc-800 flex items-center justify-between">
              <div className="flex items-center gap-3">
                <ShoppingBag className="w-5 h-5 text-gold-400" />
                <h2 className="font-serif text-lg tracking-widest uppercase">
                  YOUR COLLECTION
                </h2>
                <span className="text-xs bg-gold-500/10 text-gold-400 px-2 py-0.5 rounded-full border border-gold-500/20">
                  {cart.reduce((sum, item) => sum + item.quantity, 0)}
                </span>
              </div>
              <button
                onClick={onClose}
                className="p-1 hover:text-gold-400 transition-colors duration-200"
              >
                <X className="w-6 h-6" />
              </button>
            </div>

            {/* Cart Items */}
            <div className="flex-1 overflow-y-auto p-6 space-y-6">
              {cart.length === 0 ? (
                <div className="h-64 flex flex-col items-center justify-center text-center space-y-4">
                  <ShoppingBag className="w-12 h-12 text-zinc-600" />
                  <p className="text-zinc-400 font-serif tracking-wide">Your cart is empty.</p>
                  <button
                    onClick={onClose}
                    className="px-6 py-2 bg-gold-500 text-black text-xs font-semibold uppercase tracking-widest hover:bg-gold-400 transition-all rounded-sm"
                  >
                    Start Shopping
                  </button>
                </div>
              ) : (
                <>
                  <div className="space-y-4">
                    {cart.map((item) => (
                      <div
                        key={item.id}
                        className="flex gap-4 p-3 bg-zinc-900/50 border border-zinc-800/80 rounded-sm"
                      >
                        {/* Mock Image Representation */}
                        <div className="w-20 h-20 relative bg-zinc-950 border border-zinc-800 rounded-sm flex items-center justify-center overflow-hidden flex-shrink-0">
                          {/* Inner gradient glowing circle to mimic premium asset */}
                          <div className="absolute w-12 h-12 rounded-full bg-radial from-gold-500/20 to-transparent filter blur-md" />
                          <span className="text-[10px] text-center text-zinc-500 px-1 font-serif">
                            {item.name.split(' ').slice(0, 2).join(' ')}
                          </span>
                        </div>

                        {/* Product Info */}
                        <div className="flex-1 min-w-0 flex flex-col justify-between">
                          <div>
                            <h4 className="font-serif text-sm text-zinc-100 truncate">
                              {item.name}
                            </h4>
                            <p className="text-xs text-zinc-500 mt-0.5">{item.category}</p>
                          </div>

                          <div className="flex items-center justify-between mt-2">
                            {/* Quantity Controls */}
                            <div className="flex items-center border border-zinc-800 rounded-sm overflow-hidden">
                              <button
                                onClick={() => updateCartQuantity(item.id, item.quantity - 1)}
                                className="px-2 py-1 bg-zinc-900 hover:text-gold-400 text-zinc-400 text-xs"
                              >
                                <Minus className="w-3 h-3" />
                              </button>
                              <span className="px-3 text-xs text-zinc-200">{item.quantity}</span>
                              <button
                                onClick={() => updateCartQuantity(item.id, item.quantity + 1)}
                                className="px-2 py-1 bg-zinc-900 hover:text-gold-400 text-zinc-400 text-xs"
                              >
                                <Plus className="w-3 h-3" />
                              </button>
                            </div>

                            <div className="flex items-center gap-3">
                              <span className="text-xs font-semibold text-gold-400">
                                ₹{(item.price * item.quantity).toLocaleString('en-IN')}
                              </span>
                              <button
                                onClick={() => removeFromCart(item.id)}
                                className="text-zinc-600 hover:text-red-400 transition-colors"
                              >
                                <Trash2 className="w-4 h-4" />
                              </button>
                            </div>
                          </div>
                        </div>
                      </div>
                    ))}
                  </div>

                  {/* Upsell Widget */}
                  {!isUpsellAlreadyInCart && (
                    <div className="p-4 bg-gold-950/20 border border-gold-500/20 rounded-sm mt-6">
                      <p className="text-[11px] text-gold-400 font-semibold tracking-wider uppercase mb-2">
                        COMPLETE YOUR SETUP
                      </p>
                      <div className="flex items-center justify-between gap-3">
                        <div className="min-w-0">
                          <p className="text-xs font-medium text-zinc-200 truncate">{upsellItem.name}</p>
                          <p className="text-[10px] text-gold-400">₹{upsellItem.price.toLocaleString('en-IN')}</p>
                        </div>
                        <button
                          onClick={() => addToCart(upsellItem, 1)}
                          className="px-3 py-1.5 bg-gold-500 hover:bg-gold-400 text-black text-[10px] font-bold uppercase tracking-wider rounded-sm transition-all flex-shrink-0"
                        >
                          Add +
                        </button>
                      </div>
                    </div>
                  )}
                </>
              )}
            </div>

            {/* Footer Summary (Sticky at bottom) */}
            {cart.length > 0 && (
              <div className="p-6 border-t border-zinc-800 bg-zinc-950 space-y-4">
                {/* Coupon Code Input */}
                <form onSubmit={handleApplyCoupon} className="flex gap-2">
                  <div className="relative flex-1">
                    <Tag className="absolute left-3 top-1/2 -translate-y-1/2 w-4 h-4 text-zinc-500" />
                    <input
                      type="text"
                      placeholder={coupon ? `Active: ${coupon.code}` : "Enter Promo Code"}
                      disabled={!!coupon}
                      value={couponCode}
                      onChange={(e) => setCouponCode(e.target.value)}
                      className="w-full bg-zinc-900 border border-zinc-800 text-white rounded-sm pl-9 pr-4 py-2 text-xs focus:outline-none focus:border-gold-500 disabled:opacity-50 uppercase tracking-widest"
                    />
                  </div>
                  {coupon ? (
                    <button
                      type="button"
                      onClick={removeCoupon}
                      className="px-4 py-2 border border-red-500/50 hover:bg-red-500/10 text-red-400 text-xs uppercase tracking-widest font-semibold rounded-sm transition-all"
                    >
                      Remove
                    </button>
                  ) : (
                    <button
                      type="submit"
                      className="px-4 py-2 bg-zinc-800 hover:bg-zinc-700 hover:text-gold-400 text-zinc-300 text-xs uppercase tracking-widest font-semibold rounded-sm transition-all"
                    >
                      Apply
                    </button>
                  )}
                </form>

                {couponError && <p className="text-[11px] text-red-400 mt-1">{couponError}</p>}
                {couponSuccess && <p className="text-[11px] text-green-400 mt-1">{couponSuccess}</p>}

                {/* Calculations */}
                <div className="space-y-2 text-sm text-zinc-400">
                  <div className="flex justify-between">
                    <span>Subtotal</span>
                    <span className="text-zinc-200">₹{subtotal.toLocaleString('en-IN')}</span>
                  </div>
                  {coupon && (
                    <div className="flex justify-between text-green-400">
                      <span>Discount ({coupon.discountPercent}%)</span>
                      <span>- ₹{discountAmount.toLocaleString('en-IN')}</span>
                    </div>
                  )}
                  <div className="flex justify-between">
                    <span>Shipping</span>
                    <span className="text-zinc-200">
                      {shipping === 0 ? (
                        <span className="text-gold-400 uppercase text-xs tracking-wider">Free Delivery</span>
                      ) : (
                        `₹${shipping.toLocaleString('en-IN')}`
                      )}
                    </span>
                  </div>
                  <div className="flex justify-between text-base font-bold text-white pt-2 border-t border-zinc-900">
                    <span>Total</span>
                    <span className="text-gold-400">₹{total.toLocaleString('en-IN')}</span>
                  </div>
                </div>

                {/* Checkout Link */}
                <Link
                  href="/checkout"
                  onClick={onClose}
                  className="w-full py-4 bg-gradient-to-r from-gold-600 to-gold-400 hover:from-gold-500 hover:to-gold-300 text-black font-bold uppercase text-center text-xs tracking-widest rounded-sm transition-all duration-300 flex items-center justify-center gap-2 shadow-lg hover:shadow-gold-500/10 active:scale-98 mt-2"
                >
                  Proceed to Checkout <ArrowRight className="w-4 h-4" />
                </Link>
              </div>
            )}
          </motion.div>
        </>
      )}
    </AnimatePresence>
  );
}
