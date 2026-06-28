'use client';

import React, { useState } from 'react';
import { useApp } from '@/context/AppContext';
import { ShoppingBag, ArrowRight, ShieldCheck, Ticket, CheckCircle2, ChevronRight, Coins } from 'lucide-react';
import Link from 'next/link';
import { useRouter } from 'next/navigation';

export default function CheckoutPage() {
  const { cart, coupon, clearCart, user, checkSession } = useApp();
  const router = useRouter();

  const [email, setEmail] = useState(user?.email || '');
  const [name, setName] = useState(user?.name || '');
  const [phone, setPhone] = useState('');
  const [address, setAddress] = useState('');
  const [city, setCity] = useState('');
  const [postalCode, setPostalCode] = useState('');
  const [stateName, setStateName] = useState('');
  const [paymentMethod, setPaymentMethod] = useState('CARD'); // CARD, COD, UPI
  const [couponCode, setCouponCode] = useState('');

  const [loading, setLoading] = useState(false);
  const [successOrder, setSuccessOrder] = useState<any>(null);
  const [errorMsg, setErrorMsg] = useState('');

  const subtotal = cart.reduce((sum, item) => sum + item.price * item.quantity, 0);
  const discountAmount = coupon ? (subtotal * coupon.discountPercent) / 100 : 0;
  const shipping = subtotal > 50000 ? 0 : subtotal === 0 ? 0 : 1500;
  const total = subtotal - discountAmount + shipping;

  // Expected loyalty points earned
  const expectedPoints = Math.floor(total / 100);

  const handlePlaceOrder = async (e: React.FormEvent) => {
    e.preventDefault();
    if (cart.length === 0) return;

    setLoading(true);
    setErrorMsg('');

    const shippingAddress = {
      name,
      email,
      phone,
      address,
      city,
      state: stateName,
      postalCode,
      country: 'India',
    };

    try {
      const res = await fetch('/api/orders', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({
          totalAmount: total,
          paymentMethod,
          address: shippingAddress,
          items: cart,
        }),
      });

      const data = await res.json();
      if (data.success) {
        setSuccessOrder(data.order);
        clearCart();
        // Refresh session to update points if logged in
        await checkSession();
      } else {
        setErrorMsg(data.error || 'Failed to place order.');
      }
    } catch (err) {
      setErrorMsg('Connection error placing order.');
    } finally {
      setLoading(false);
    }
  };

  if (successOrder) {
    return (
      <div className="max-w-3xl mx-auto px-4 sm:px-6 py-20 text-center space-y-8">
        <div className="flex justify-center text-gold-400">
          <CheckCircle2 className="w-20 h-20 animate-bounce" />
        </div>
        <div className="space-y-3">
          <h1 className="font-serif text-3xl md:text-5xl text-gold-200 tracking-wide uppercase">
            ORDER CONFIRMED
          </h1>
          <p className="text-zinc-400 text-sm max-w-md mx-auto">
            Your luxury order has been registered and is being prepared at our air freight terminal. An invoice is being dispatched to <span className="text-zinc-200">{successOrder.address.email}</span>.
          </p>
        </div>

        <div className="p-6 bg-zinc-900/40 border border-zinc-800 rounded-sm text-left max-w-md mx-auto space-y-4">
          <div className="flex justify-between border-b border-zinc-900 pb-2 text-xs">
            <span className="text-zinc-500 uppercase tracking-widest">Order ID</span>
            <span className="text-zinc-200 font-bold">{successOrder.id}</span>
          </div>
          <div className="flex justify-between border-b border-zinc-900 pb-2 text-xs">
            <span className="text-zinc-500 uppercase tracking-widest">Shipment Status</span>
            <span className="text-gold-400 font-bold uppercase tracking-widest">Awaiting dispatch</span>
          </div>
          <div className="flex justify-between border-b border-zinc-900 pb-2 text-xs">
            <span className="text-zinc-500 uppercase tracking-widest">Payment Method</span>
            <span className="text-zinc-200 font-bold">{successOrder.payment_method}</span>
          </div>
          <div className="flex justify-between pb-2 text-xs">
            <span className="text-zinc-500 uppercase tracking-widest">Total Transaction</span>
            <span className="text-gold-400 font-bold">₹{successOrder.total_amount.toLocaleString('en-IN')}</span>
          </div>

          {user && (
            <div className="flex items-center gap-2 p-3 bg-gold-950/20 border border-gold-500/20 rounded-sm text-[11px] text-gold-400 font-medium">
              <Coins className="w-4 h-4 flex-shrink-0" />
              <span>You earned +{expectedPoints} Royal Rewards points on this order!</span>
            </div>
          )}
        </div>

        <div className="pt-4 flex flex-col sm:flex-row gap-4 justify-center">
          <Link
            href="/dashboard"
            className="px-8 py-3 bg-zinc-900 border border-zinc-800 hover:border-gold-500 hover:text-gold-400 text-zinc-300 text-xs font-bold uppercase tracking-widest rounded-sm transition-all"
          >
            Go to Dashboard
          </Link>
          <Link
            href="/"
            className="px-8 py-3 bg-gradient-to-r from-gold-600 to-gold-400 hover:from-gold-500 hover:to-gold-300 text-black font-bold text-xs uppercase tracking-widest rounded-sm transition-all"
          >
            Continue Shopping
          </Link>
        </div>
      </div>
    );
  }

  return (
    <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-12">
      {/* Header */}
      <div className="mb-12 flex flex-col md:flex-row justify-between items-start md:items-end border-b border-zinc-900 pb-6 gap-4">
        <div>
          <span className="text-xs uppercase tracking-[0.4em] text-gold-500 font-semibold block mb-2">
            SECURE CHECKOUT
          </span>
          <h1 className="font-serif text-3xl md:text-5xl text-gold-200 tracking-wide uppercase">
            DELIVERY & PAYMENT
          </h1>
        </div>
        <Link
          href="/shop"
          className="text-zinc-400 hover:text-gold-400 text-xs uppercase tracking-widest flex items-center gap-1.5"
        >
          Cancel & Return <ChevronRight className="w-4 h-4" />
        </Link>
      </div>

      {cart.length === 0 ? (
        <div className="text-center py-20 bg-zinc-900/10 border border-zinc-900 rounded-sm space-y-4">
          <ShoppingBag className="w-12 h-12 text-zinc-700 mx-auto" />
          <p className="text-zinc-400 text-sm font-serif">Your shopping cart is empty.</p>
          <Link
            href="/shop"
            className="inline-block px-6 py-2.5 bg-gold-500 hover:bg-gold-400 text-black font-semibold text-xs uppercase tracking-widest rounded-sm transition-colors"
          >
            Go to Shop
          </Link>
        </div>
      ) : (
        <div className="grid grid-cols-1 lg:grid-cols-12 gap-12">
          {/* Left Column: Form */}
          <div className="lg:col-span-7">
            <form onSubmit={handlePlaceOrder} className="space-y-8">
              {/* Shipping Address */}
              <div className="space-y-4">
                <h3 className="font-serif text-lg text-gold-300 uppercase tracking-wider pb-2 border-b border-zinc-900">
                  1. Shipping Information
                </h3>
                
                <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                  <div>
                    <label className="text-[10px] text-zinc-500 uppercase tracking-widest block mb-1">Full Name</label>
                    <input
                      type="text"
                      required
                      placeholder="Receiver's name"
                      value={name}
                      onChange={(e) => setName(e.target.value)}
                      className="w-full bg-zinc-900/50 border border-zinc-800 text-white rounded-sm p-3 text-xs focus:outline-none focus:border-gold-500"
                    />
                  </div>
                  <div>
                    <label className="text-[10px] text-zinc-500 uppercase tracking-widest block mb-1">Email Address</label>
                    <input
                      type="email"
                      required
                      placeholder="e.g. name@domain.com"
                      value={email}
                      onChange={(e) => setEmail(e.target.value)}
                      className="w-full bg-zinc-900/50 border border-zinc-800 text-white rounded-sm p-3 text-xs focus:outline-none focus:border-gold-500"
                    />
                  </div>
                </div>

                <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                  <div>
                    <label className="text-[10px] text-zinc-500 uppercase tracking-widest block mb-1">Phone Number (10 digit)</label>
                    <input
                      type="tel"
                      required
                      placeholder="e.g. +91 98765 43210"
                      value={phone}
                      onChange={(e) => setPhone(e.target.value)}
                      className="w-full bg-zinc-900/50 border border-zinc-800 text-white rounded-sm p-3 text-xs focus:outline-none focus:border-gold-500"
                    />
                  </div>
                  <div>
                    <label className="text-[10px] text-zinc-500 uppercase tracking-widest block mb-1">Street Address</label>
                    <input
                      type="text"
                      required
                      placeholder="Flat, Villa number, building, street"
                      value={address}
                      onChange={(e) => setAddress(e.target.value)}
                      className="w-full bg-zinc-900/50 border border-zinc-800 text-white rounded-sm p-3 text-xs focus:outline-none focus:border-gold-500"
                    />
                  </div>
                </div>

                <div className="grid grid-cols-2 sm:grid-cols-4 gap-4">
                  <div className="col-span-1">
                    <label className="text-[10px] text-zinc-500 uppercase tracking-widest block mb-1">City</label>
                    <input
                      type="text"
                      required
                      placeholder="City"
                      value={city}
                      onChange={(e) => setCity(e.target.value)}
                      className="w-full bg-zinc-900/50 border border-zinc-800 text-white rounded-sm p-3 text-xs focus:outline-none focus:border-gold-500"
                    />
                  </div>
                  <div className="col-span-1">
                    <label className="text-[10px] text-zinc-500 uppercase tracking-widest block mb-1">State</label>
                    <input
                      type="text"
                      required
                      placeholder="State"
                      value={stateName}
                      onChange={(e) => setStateName(e.target.value)}
                      className="w-full bg-zinc-900/50 border border-zinc-800 text-white rounded-sm p-3 text-xs focus:outline-none focus:border-gold-500"
                    />
                  </div>
                  <div className="col-span-2">
                    <label className="text-[10px] text-zinc-500 uppercase tracking-widest block mb-1">Postal Code (PIN)</label>
                    <input
                      type="text"
                      required
                      placeholder="6 digit PIN"
                      value={postalCode}
                      onChange={(e) => setPostalCode(e.target.value)}
                      className="w-full bg-zinc-900/50 border border-zinc-800 text-white rounded-sm p-3 text-xs focus:outline-none focus:border-gold-500"
                    />
                  </div>
                </div>
              </div>

              {/* Payment Methods */}
              <div className="space-y-4">
                <h3 className="font-serif text-lg text-gold-300 uppercase tracking-wider pb-2 border-b border-zinc-900">
                  2. Select Payment Mode
                </h3>
                <div className="grid grid-cols-1 sm:grid-cols-3 gap-4">
                  <button
                    type="button"
                    onClick={() => setPaymentMethod('CARD')}
                    className={`p-4 border rounded-sm flex flex-col items-center justify-center gap-2 transition-all ${
                      paymentMethod === 'CARD'
                        ? 'border-gold-500 bg-gold-500/5 text-gold-400'
                        : 'border-zinc-800 bg-zinc-900/20 text-zinc-400 hover:border-zinc-700'
                    }`}
                  >
                    <span className="text-xs font-bold uppercase tracking-widest">Credit / Debit Card</span>
                    <span className="text-[9px] text-zinc-500 text-center">VISA, Mastercard, RuPay</span>
                  </button>

                  <button
                    type="button"
                    onClick={() => setPaymentMethod('UPI')}
                    className={`p-4 border rounded-sm flex flex-col items-center justify-center gap-2 transition-all ${
                      paymentMethod === 'UPI'
                        ? 'border-gold-500 bg-gold-500/5 text-gold-400'
                        : 'border-zinc-800 bg-zinc-900/20 text-zinc-400 hover:border-zinc-700'
                    }`}
                  >
                    <span className="text-xs font-bold uppercase tracking-widest">UPI Payment</span>
                    <span className="text-[9px] text-zinc-500 text-center">Google Pay, PhonePe, Paytm</span>
                  </button>

                  <button
                    type="button"
                    onClick={() => setPaymentMethod('COD')}
                    className={`p-4 border rounded-sm flex flex-col items-center justify-center gap-2 transition-all ${
                      paymentMethod === 'COD'
                        ? 'border-gold-500 bg-gold-500/5 text-gold-400'
                        : 'border-zinc-800 bg-zinc-900/20 text-zinc-400 hover:border-zinc-700'
                    }`}
                  >
                    <span className="text-xs font-bold uppercase tracking-widest">Cash on Delivery</span>
                    <span className="text-[9px] text-zinc-500 text-center">Verification on delivery (18+)</span>
                  </button>
                </div>
              </div>

              {errorMsg && <p className="p-3 bg-red-500/10 border border-red-500/20 text-red-400 rounded-sm text-xs">{errorMsg}</p>}

              <button
                type="submit"
                disabled={loading}
                className="w-full py-4 bg-gradient-to-r from-gold-600 to-gold-400 hover:from-gold-500 hover:to-gold-300 text-black font-bold uppercase tracking-widest text-xs rounded-sm transition-all duration-300 flex items-center justify-center gap-2 shadow-lg active:scale-98 disabled:opacity-50"
              >
                {loading ? 'Processing Order...' : 'Confirm Order & Place Delivery'} <ArrowRight className="w-4 h-4" />
              </button>
            </form>
          </div>

          {/* Right Column: Order Summary */}
          <div className="lg:col-span-5">
            <div className="p-6 bg-zinc-900/20 border border-zinc-900 rounded-sm space-y-6 sticky top-24">
              <h3 className="font-serif text-base text-zinc-100 uppercase tracking-wider pb-2 border-b border-zinc-900">
                Order Summary
              </h3>

              {/* Items List */}
              <div className="max-h-60 overflow-y-auto divide-y divide-zinc-900 space-y-4">
                {cart.map((item) => (
                  <div key={item.id} className="flex gap-4 pt-4 first:pt-0">
                    <div className="w-12 h-12 bg-zinc-950 border border-zinc-900 flex items-center justify-center rounded-sm flex-shrink-0">
                      <span className="text-[9px] text-zinc-500 font-serif">{item.name.split(' ')[0]}</span>
                    </div>
                    <div className="flex-grow min-w-0 text-xs">
                      <h4 className="font-serif text-zinc-300 truncate">{item.name}</h4>
                      <p className="text-zinc-500">Qty: {item.quantity}</p>
                    </div>
                    <span className="text-xs font-semibold text-zinc-200 flex-shrink-0">
                      ₹{(item.price * item.quantity).toLocaleString('en-IN')}
                    </span>
                  </div>
                ))}
              </div>

              {/* Breakdown */}
              <div className="space-y-2 text-xs text-zinc-400 border-t border-zinc-900 pt-4">
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
                      <span className="text-gold-400 uppercase text-[10px] tracking-wider">Free Delivery</span>
                    ) : (
                      `₹${shipping.toLocaleString('en-IN')}`
                    )}
                  </span>
                </div>
                <div className="flex justify-between text-sm font-bold text-white pt-2 border-t border-zinc-900">
                  <span>Total Due</span>
                  <span className="text-gold-400">₹{total.toLocaleString('en-IN')}</span>
                </div>
              </div>

              {/* Security info */}
              <div className="flex items-center gap-2 p-3 bg-zinc-900/40 border border-zinc-800 rounded-sm text-[10px] text-zinc-500">
                <ShieldCheck className="w-4 h-4 text-gold-500 flex-shrink-0" />
                <span>SSL Encrypted Checkout. Cash on delivery shipments undergo biometric age verification.</span>
              </div>
            </div>
          </div>
        </div>
      )}
    </div>
  );
}
