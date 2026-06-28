'use client';

import React, { useState, useEffect, Suspense } from 'react';
import { useApp } from '@/context/AppContext';
import { Heart, ShoppingBag, Award, Coins, Eye, LogOut, ShieldCheck, ChevronRight, Package, User as UserIcon, MapPin, Plus, Trash2, CheckCircle2 } from 'lucide-react';
import { useRouter, useSearchParams } from 'next/navigation';
import Link from 'next/link';

function DashboardContent() {
  const { user, wishlist, toggleWishlist, addToCart, logout, authLoading } = useApp();
  const router = useRouter();
  const searchParams = useSearchParams();

  const [orders, setOrders] = useState<any[]>([]);
  const [ordersLoading, setOrdersLoading] = useState(true);
  const [activeTab, setActiveTab] = useState('orders'); // orders, wishlist, rewards, profile

  // Saved Addresses State
  const [addresses, setAddresses] = useState([
    { id: 'a1', label: 'Primary Residence', name: 'Royal Admin', phone: '9988776655', address: 'Penthouse 4A, Jumeirah Towers', city: 'Mumbai', state: 'Maharashtra', postalCode: '400001' },
    { id: 'a2', label: 'DIFC Corporate Office', name: 'Royal Admin', phone: '9988776655', address: 'Level 48, Burj Daman', city: 'Dubai', state: 'DIFC', postalCode: '00000' }
  ]);

  // Add Address Form State
  const [showAddressForm, setShowAddressForm] = useState(false);
  const [newLabel, setNewLabel] = useState('');
  const [newName, setNewName] = useState('');
  const [newPhone, setNewPhone] = useState('');
  const [newStreet, setNewStreet] = useState('');
  const [newCity, setNewCity] = useState('');
  const [newState, setNewState] = useState('');
  const [newZip, setNewZip] = useState('');

  // Handle preset tab query param
  useEffect(() => {
    const tabParam = searchParams.get('tab');
    if (tabParam) {
      setActiveTab(tabParam);
    }
  }, [searchParams]);

  // Fetch orders from API
  useEffect(() => {
    if (user) {
      fetchOrders();
    }
  }, [user]);

  // Auth Protection redirect
  useEffect(() => {
    if (!authLoading && !user) {
      router.push('/auth');
    }
  }, [user, authLoading, router]);

  const fetchOrders = async () => {
    try {
      setOrdersLoading(true);
      const res = await fetch('/api/orders');
      const data = await res.json();
      if (data.success) {
        setOrders(data.orders);
      }
    } catch (error) {
      console.error('Error fetching orders:', error);
    } finally {
      setOrdersLoading(false);
    }
  };

  const handleLogout = async () => {
    await logout();
    router.push('/');
  };

  const handleAddAddress = (e: React.FormEvent) => {
    e.preventDefault();
    if (!newLabel || !newStreet || !newCity) return;

    const newAddress = {
      id: 'a_' + Math.random().toString(36).substr(2, 9),
      label: newLabel,
      name: newName || user?.name || '',
      phone: newPhone,
      address: newStreet,
      city: newCity,
      state: newState,
      postalCode: newZip
    };

    setAddresses((prev) => [...prev, newAddress]);
    setNewLabel('');
    setNewName('');
    setNewPhone('');
    setNewStreet('');
    setNewCity('');
    setNewState('');
    setNewZip('');
    setShowAddressForm(false);
  };

  const handleDeleteAddress = (id: string) => {
    setAddresses((prev) => prev.filter((a) => a.id !== id));
  };

  // Account tier logic
  const getTierInfo = (points: number) => {
    if (points >= 10000) {
      return { name: 'SULTAN VIP COLLECTOR', color: 'text-gold-300', border: 'border-gold-500', nextTier: 'Max Status Reached', nextTierPts: 0, progress: 100 };
    }
    if (points >= 1000) {
      return { name: 'GOLD ELITE COLLECTOR', color: 'text-yellow-400', border: 'border-yellow-500', nextTier: 'SULTAN VIP COLLECTOR', nextTierPts: 10000, progress: ((points - 1000) / 9000) * 100 };
    }
    if (points >= 500) {
      return { name: 'SILVER CONNOISSEUR', color: 'text-zinc-300', border: 'border-zinc-400', nextTier: 'GOLD ELITE COLLECTOR', nextTierPts: 1000, progress: ((points - 500) / 500) * 100 };
    }
    return { name: 'BRONZE MEMBER', color: 'text-amber-600', border: 'border-amber-700', nextTier: 'SILVER CONNOISSEUR', nextTierPts: 500, progress: (points / 500) * 100 };
  };

  const tier = getTierInfo(user?.rewardsPoints || 0);

  if (authLoading || (!user && authLoading)) {
    return (
      <div className="min-h-screen bg-zinc-950 text-white flex items-center justify-center">
        <p className="text-zinc-500 font-serif tracking-widest animate-pulse">VERIFYING MEMBERSHIP...</p>
      </div>
    );
  }

  if (!user) return null;

  return (
    <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-12">
      
      {/* Header Profile card */}
      <div className="relative glass-panel p-8 rounded-sm mb-12 flex flex-col md:flex-row items-center justify-between gap-6 border border-zinc-900">
        <div className="absolute top-0 left-0 w-4 h-4 border-t border-l border-gold-500/40" />
        <div className="absolute bottom-0 right-0 w-4 h-4 border-b border-r border-gold-500/40" />

        <div className="flex items-center gap-4 text-center md:text-left flex-col md:flex-row">
          <div className="w-16 h-16 rounded-full bg-zinc-900 border border-zinc-800 flex items-center justify-center">
            <UserIcon className="w-8 h-8 text-gold-400" />
          </div>
          <div>
            <div className="flex flex-col sm:flex-row sm:items-center gap-2">
              <h1 className="font-serif text-2xl text-zinc-100 uppercase tracking-wide">{user.name}</h1>
              <span className={`px-2.5 py-0.5 border ${tier.border} ${tier.color} text-[8px] font-bold uppercase tracking-widest rounded-full bg-zinc-950/80`}>
                {tier.name}
              </span>
            </div>
            <p className="text-zinc-500 text-xs tracking-wider uppercase mt-0.5">{user.email}</p>
          </div>
        </div>

        {/* Rewards medallion */}
        <div className="flex items-center gap-4 px-6 py-3 bg-gold-950/20 border border-gold-500/20 rounded-sm">
          <div className="w-10 h-10 rounded-full bg-gold-500 flex items-center justify-center text-black">
            <Coins className="w-5 h-5" />
          </div>
          <div>
            <span className="text-[10px] text-gold-400 block uppercase tracking-widest">Royal Rewards Balance</span>
            <span className="text-lg font-bold text-gold-200">{user.rewardsPoints} Points</span>
          </div>
        </div>
      </div>

      {/* Main panel */}
      <div className="grid grid-cols-1 lg:grid-cols-4 gap-8">
        
        {/* Navigation Sidebar */}
        <aside className="space-y-2 uppercase tracking-widest text-[10px] font-semibold">
          <button
            onClick={() => setActiveTab('profile')}
            className={`w-full text-left px-4 py-3.5 border rounded-sm transition-all flex items-center justify-between ${
              activeTab === 'profile'
                ? 'border-gold-500 bg-gold-500/5 text-gold-400'
                : 'border-zinc-900 hover:border-zinc-850 hover:bg-zinc-900/20 text-zinc-400 hover:text-zinc-200'
            }`}
          >
            <span>My Profile</span>
            <UserIcon className="w-4 h-4" />
          </button>

          <button
            onClick={() => setActiveTab('orders')}
            className={`w-full text-left px-4 py-3.5 border rounded-sm transition-all flex items-center justify-between ${
              activeTab === 'orders'
                ? 'border-gold-500 bg-gold-500/5 text-gold-400'
                : 'border-zinc-900 hover:border-zinc-850 hover:bg-zinc-900/20 text-zinc-400 hover:text-zinc-200'
            }`}
          >
            <span>My Orders</span>
            <Package className="w-4 h-4" />
          </button>

          <button
            onClick={() => setActiveTab('wishlist')}
            className={`w-full text-left px-4 py-3.5 border rounded-sm transition-all flex items-center justify-between ${
              activeTab === 'wishlist'
                ? 'border-gold-500 bg-gold-500/5 text-gold-400'
                : 'border-zinc-900 hover:border-zinc-850 hover:bg-zinc-900/20 text-zinc-400 hover:text-zinc-200'
            }`}
          >
            <span>My Wishlist ({wishlist.length})</span>
            <Heart className="w-4 h-4" />
          </button>

          <button
            onClick={() => setActiveTab('rewards')}
            className={`w-full text-left px-4 py-3.5 border rounded-sm transition-all flex items-center justify-between ${
              activeTab === 'rewards'
                ? 'border-gold-500 bg-gold-500/5 text-gold-400'
                : 'border-zinc-900 hover:border-zinc-850 hover:bg-zinc-900/20 text-zinc-400 hover:text-zinc-200'
            }`}
          >
            <span>Loyalty Rewards</span>
            <Award className="w-4 h-4" />
          </button>

          {user.role === 'admin' && (
            <Link
              href="/admin"
              className="w-full text-left px-4 py-3.5 border border-zinc-900 hover:border-gold-500/30 text-gold-400 hover:text-gold-200 rounded-sm transition-all flex items-center justify-between"
            >
              <span>Admin Dashboard</span>
              <ShieldCheck className="w-4 h-4" />
            </Link>
          )}

          <button
            onClick={handleLogout}
            className="w-full text-left px-4 py-3.5 border border-zinc-900 hover:border-red-500/30 text-red-400 hover:text-red-300 rounded-sm transition-all flex items-center justify-between mt-6"
          >
            <span>Logout Account</span>
            <LogOut className="w-4 h-4" />
          </button>
        </aside>

        {/* Content Panel Area */}
        <div className="lg:col-span-3">
          
          {/* ========================================================================= */}
          {/* TAB: PROFILE DETAILS */}
          {/* ========================================================================= */}
          {activeTab === 'profile' && (
            <div className="space-y-10">
              {/* Profile details */}
              <div className="p-6 bg-zinc-900/20 border border-zinc-900 rounded-sm space-y-6">
                <h3 className="font-serif text-lg text-gold-300 uppercase tracking-wider pb-2 border-b border-zinc-900">
                  Account Details
                </h3>
                <div className="grid grid-cols-1 sm:grid-cols-2 gap-6 text-xs uppercase tracking-wider">
                  <div>
                    <span className="text-zinc-500 block text-[9px] mb-1">Full Name</span>
                    <span className="text-zinc-200 font-semibold">{user.name}</span>
                  </div>
                  <div>
                    <span className="text-zinc-500 block text-[9px] mb-1">Email Address</span>
                    <span className="text-zinc-200 font-semibold font-mono normal-case">{user.email}</span>
                  </div>
                  <div>
                    <span className="text-zinc-500 block text-[9px] mb-1">Membership Status</span>
                    <span className={`font-bold ${tier.color}`}>{tier.name}</span>
                  </div>
                  <div>
                    <span className="text-zinc-500 block text-[9px] mb-1">Enrollment Date</span>
                    <span className="text-zinc-300">June 2026</span>
                  </div>
                </div>
              </div>

              {/* Address Book */}
              <div className="space-y-6">
                <div className="flex justify-between items-center pb-2 border-b border-zinc-900">
                  <h3 className="font-serif text-lg text-gold-300 uppercase tracking-wider">
                    Address Book
                  </h3>
                  <button
                    onClick={() => setShowAddressForm(!showAddressForm)}
                    className="flex items-center gap-1.5 text-[10px] uppercase font-bold tracking-widest text-gold-400 hover:text-gold-300 transition-colors"
                  >
                    <Plus className="w-4 h-4" /> Add Address
                  </button>
                </div>

                {showAddressForm && (
                  <form onSubmit={handleAddAddress} className="p-6 bg-zinc-900/30 border border-zinc-800 rounded-sm space-y-4 text-xs">
                    <div className="grid grid-cols-2 gap-4">
                      <div>
                        <label className="text-[9px] text-zinc-500 uppercase tracking-widest block mb-1">Label (e.g. Home, Office)</label>
                        <input
                          type="text"
                          required
                          placeholder="e.g. Penthouse"
                          value={newLabel}
                          onChange={(e) => setNewLabel(e.target.value)}
                          className="w-full bg-zinc-950 border border-zinc-800 text-white rounded-sm p-2.5 text-xs focus:outline-none focus:border-gold-500"
                        />
                      </div>
                      <div>
                        <label className="text-[9px] text-zinc-500 uppercase tracking-widest block mb-1">Recipient Name</label>
                        <input
                          type="text"
                          placeholder={user.name}
                          value={newName}
                          onChange={(e) => setNewName(e.target.value)}
                          className="w-full bg-zinc-950 border border-zinc-800 text-white rounded-sm p-2.5 text-xs focus:outline-none focus:border-gold-500"
                        />
                      </div>
                    </div>

                    <div className="grid grid-cols-2 gap-4">
                      <div>
                        <label className="text-[9px] text-zinc-500 uppercase tracking-widest block mb-1">Phone Number</label>
                        <input
                          type="text"
                          placeholder="Receiver's Phone"
                          value={newPhone}
                          onChange={(e) => setNewPhone(e.target.value)}
                          className="w-full bg-zinc-950 border border-zinc-800 text-white rounded-sm p-2.5 text-xs focus:outline-none focus:border-gold-500"
                        />
                      </div>
                      <div>
                        <label className="text-[9px] text-zinc-500 uppercase tracking-widest block mb-1">Street Address</label>
                        <input
                          type="text"
                          required
                          placeholder="Building, street, flat"
                          value={newStreet}
                          onChange={(e) => setNewStreet(e.target.value)}
                          className="w-full bg-zinc-950 border border-zinc-800 text-white rounded-sm p-2.5 text-xs focus:outline-none focus:border-gold-500"
                        />
                      </div>
                    </div>

                    <div className="grid grid-cols-3 gap-4">
                      <div>
                        <label className="text-[9px] text-zinc-500 uppercase tracking-widest block mb-1">City</label>
                        <input
                          type="text"
                          required
                          placeholder="City"
                          value={newCity}
                          onChange={(e) => setNewCity(e.target.value)}
                          className="w-full bg-zinc-950 border border-zinc-800 text-white rounded-sm p-2.5 text-xs focus:outline-none focus:border-gold-500"
                        />
                      </div>
                      <div>
                        <label className="text-[9px] text-zinc-500 uppercase tracking-widest block mb-1">State</label>
                        <input
                          type="text"
                          placeholder="State"
                          value={newState}
                          onChange={(e) => setNewState(e.target.value)}
                          className="w-full bg-zinc-950 border border-zinc-800 text-white rounded-sm p-2.5 text-xs focus:outline-none focus:border-gold-500"
                        />
                      </div>
                      <div>
                        <label className="text-[9px] text-zinc-500 uppercase tracking-widest block mb-1">PIN Code</label>
                        <input
                          type="text"
                          placeholder="PIN Code"
                          value={newZip}
                          onChange={(e) => setNewZip(e.target.value)}
                          className="w-full bg-zinc-950 border border-zinc-800 text-white rounded-sm p-2.5 text-xs focus:outline-none focus:border-gold-500"
                        />
                      </div>
                    </div>

                    <button
                      type="submit"
                      className="px-6 py-2.5 bg-gold-500 hover:bg-gold-400 text-black font-bold uppercase tracking-widest text-[10px] rounded-sm transition-all"
                    >
                      Save Address
                    </button>
                  </form>
                )}

                {/* Addresses Grid */}
                <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                  {addresses.map((addr) => (
                    <div
                      key={addr.id}
                      className="p-5 bg-zinc-900/10 border border-zinc-900 rounded-sm flex justify-between items-start"
                    >
                      <div className="space-y-2 text-xs">
                        <div className="flex items-center gap-2">
                          <MapPin className="w-4 h-4 text-gold-400" />
                          <span className="font-serif font-bold text-zinc-200">{addr.label}</span>
                        </div>
                        <div className="text-zinc-500 leading-normal">
                          <p className="font-semibold text-zinc-400">{addr.name} &bull; {addr.phone}</p>
                          <p>{addr.address}</p>
                          <p>{addr.city}, {addr.state} - {addr.postalCode}</p>
                        </div>
                      </div>
                      <button
                        onClick={() => handleDeleteAddress(addr.id)}
                        className="text-zinc-600 hover:text-red-400 transition-colors"
                      >
                        <Trash2 className="w-4 h-4" />
                      </button>
                    </div>
                  ))}
                </div>
              </div>
            </div>
          )}
          
          {/* ========================================================================= */}
          {/* TAB: MY ORDERS */}
          {/* ========================================================================= */}
          {activeTab === 'orders' && (
            <div className="space-y-6">
              <h2 className="font-serif text-lg text-gold-300 uppercase tracking-wider mb-4">ORDER HISTORY</h2>
              
              {ordersLoading ? (
                <p className="text-zinc-500 text-xs italic">Loading order transactions...</p>
              ) : orders.length === 0 ? (
                <div className="text-center py-16 bg-zinc-900/20 border border-zinc-900 rounded-sm">
                  <ShoppingBag className="w-12 h-12 text-zinc-700 mx-auto mb-3" />
                  <p className="text-zinc-400 text-xs font-serif">No orders have been recorded.</p>
                </div>
              ) : (
                <div className="space-y-4">
                  {orders.map((ord) => (
                    <div
                      key={ord.id}
                      className="p-6 bg-zinc-900/20 border border-zinc-900/80 rounded-sm space-y-4"
                    >
                      <div className="flex flex-col sm:flex-row justify-between items-start sm:items-center border-b border-zinc-900 pb-3 gap-2 text-xs">
                        <div>
                          <span className="text-zinc-500 uppercase tracking-widest block text-[9px]">Order ID</span>
                          <span className="text-zinc-200 font-bold font-mono">{ord.id}</span>
                        </div>
                        <div>
                          <span className="text-zinc-500 uppercase tracking-widest block text-[9px]">Date placed</span>
                          <span className="text-zinc-300">{new Date(ord.created_at).toLocaleDateString('en-IN')}</span>
                        </div>
                        <div>
                          <span className="text-zinc-500 uppercase tracking-widest block text-[9px]">Fulfillment Status</span>
                          <span className={`font-bold uppercase tracking-widest text-[10px] ${
                            ord.status === 'delivered' ? 'text-green-400' : 'text-gold-400'
                          }`}>
                            {ord.status}
                          </span>
                        </div>
                        <div>
                          <span className="text-zinc-500 uppercase tracking-widest block text-[9px]">Total Amount</span>
                          <span className="text-gold-400 font-semibold">₹{ord.total_amount.toLocaleString('en-IN')}</span>
                        </div>
                      </div>

                      <div className="divide-y divide-zinc-900">
                        {ord.items.map((item: any) => (
                          <div key={item.id} className="flex gap-4 py-3 first:pt-0">
                            <div className="w-12 h-12 bg-zinc-950 border border-zinc-900 flex items-center justify-center rounded-sm flex-shrink-0">
                              <span className="text-[9px] text-zinc-500 font-serif">{item.name.split(' ')[0]}</span>
                            </div>
                            <div className="flex-grow min-w-0 text-xs">
                              <h4 className="font-serif text-zinc-300 truncate">{item.name}</h4>
                              <p className="text-zinc-500">Quantity: {item.quantity} &bull; Price: ₹{item.price.toLocaleString('en-IN')}</p>
                            </div>
                          </div>
                        ))}
                      </div>

                      <div className="text-[11px] text-zinc-500 bg-zinc-950/60 p-3 rounded-sm border border-zinc-900/60">
                        <span className="font-semibold text-zinc-400 uppercase tracking-wider block mb-1">Shipping Destination:</span>
                        <p>{ord.address.name} &bull; {ord.address.phone}</p>
                        <p>{ord.address.address}, {ord.address.city}, {ord.address.state} - {ord.address.postalCode}</p>
                      </div>
                    </div>
                  ))}
                </div>
              )}
            </div>
          )}

          {/* ========================================================================= */}
          {/* TAB: MY WISHLIST */}
          {/* ========================================================================= */}
          {activeTab === 'wishlist' && (
            <div className="space-y-6">
              <h2 className="font-serif text-lg text-gold-300 uppercase tracking-wider mb-4">MY WISHLIST</h2>
              
              {wishlist.length === 0 ? (
                <div className="text-center py-16 bg-zinc-900/20 border border-zinc-900 rounded-sm">
                  <Heart className="w-12 h-12 text-zinc-700 mx-auto mb-3" />
                  <p className="text-zinc-400 text-xs font-serif">No products saved in your wishlist.</p>
                </div>
              ) : (
                <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                  {wishlist.map((id) => (
                    <div
                      key={id}
                      className="p-4 bg-zinc-900/20 border border-zinc-900 rounded-sm flex items-center justify-between"
                    >
                      <div className="min-w-0 text-xs">
                        <h4 className="font-serif text-zinc-200 truncate uppercase">Product ID: {id}</h4>
                        <Link
                          href="/shop"
                          className="text-gold-500 hover:underline flex items-center gap-1 mt-1 text-[10px] uppercase tracking-wider font-semibold"
                        >
                          Explore collection to view <Eye className="w-3.5 h-3.5" />
                        </Link>
                      </div>
                      <button
                        onClick={() => toggleWishlist(id)}
                        className="text-red-400 hover:text-red-300 text-[10px] uppercase tracking-widest font-bold px-3 py-1.5 border border-red-500/20 hover:bg-red-500/10 rounded-sm transition-all"
                      >
                        Remove
                      </button>
                    </div>
                  ))}
                </div>
              )}
            </div>
          )}

          {/* ========================================================================= */}
          {/* TAB: LOYALTY REWARDS */}
          {/* ========================================================================= */}
          {activeTab === 'rewards' && (
            <div className="space-y-6">
              <h2 className="font-serif text-lg text-gold-300 uppercase tracking-wider mb-4">ROYAL REWARDS PROGRAM</h2>
              
              <div className="p-8 bg-gold-950/10 border border-gold-500/20 rounded-sm space-y-6">
                <div className="w-16 h-16 rounded-full bg-gradient-to-tr from-gold-600 to-gold-400 border border-gold-300/40 flex items-center justify-center text-black mx-auto shadow-lg shadow-gold-500/10">
                  <Coins className="w-8 h-8" />
                </div>

                <div className="space-y-3 text-center">
                  <span className={`px-3 py-1 border ${tier.border} ${tier.color} text-[9px] font-bold uppercase tracking-widest rounded-full bg-zinc-950 inline-block`}>
                    {tier.name}
                  </span>
                  <h3 className="text-xl font-serif text-zinc-100 uppercase tracking-wider mt-2">YOUR BALANCE: {user.rewardsPoints} POINTS</h3>
                  
                  {/* Progress bar to next tier */}
                  {tier.nextTierPts > 0 && (
                    <div className="max-w-md mx-auto pt-4 space-y-2">
                      <div className="flex justify-between text-[10px] text-zinc-500 uppercase tracking-widest">
                        <span>Current Tier</span>
                        <span>Next Tier: {tier.nextTier} ({tier.nextTierPts} pts)</span>
                      </div>
                      <div className="w-full h-2.5 bg-zinc-900 rounded-full overflow-hidden border border-zinc-800">
                        <div className="h-full bg-gradient-to-r from-gold-600 to-gold-400 rounded-full" style={{ width: `${tier.progress}%` }} />
                      </div>
                      <span className="text-[9px] text-gold-400 uppercase tracking-wider block">
                        You need {tier.nextTierPts - user.rewardsPoints} more points to reach {tier.nextTier}!
                      </span>
                    </div>
                  )}
                </div>

                {/* Loyalty Rules cards */}
                <div className="grid grid-cols-1 md:grid-cols-3 gap-4 text-left text-xs uppercase tracking-wider pt-6 border-t border-zinc-900 max-w-xl mx-auto">
                  <div className="p-4 bg-zinc-950/60 border border-zinc-900 text-center rounded-sm">
                    <span className="text-gold-400 font-bold block text-sm mb-1">₹100 SPENT</span>
                    <span className="text-[10px] text-zinc-500">= 1 Reward Point</span>
                  </div>
                  <div className="p-4 bg-zinc-950/60 border border-zinc-900 text-center rounded-sm">
                    <span className="text-gold-400 font-bold block text-sm mb-1">100 POINTS</span>
                    <span className="text-[10px] text-zinc-500">= ₹1,000 Discount</span>
                  </div>
                  <div className="p-4 bg-zinc-950/60 border border-zinc-900 text-center rounded-sm">
                    <span className="text-gold-400 font-bold block text-sm mb-1">EXPRESS TASTINGS</span>
                    <span className="text-[10px] text-zinc-500">Unlocks at 5,000 points</span>
                  </div>
                </div>
              </div>
            </div>
          )}

        </div>
      </div>
    </div>
  );
}

export default function UserDashboard() {
  return (
    <Suspense fallback={
      <div className="min-h-screen bg-zinc-950 text-white flex items-center justify-center">
        <p className="text-zinc-500 font-serif tracking-widest animate-pulse">VERIFYING MEMBERSHIP...</p>
      </div>
    }>
      <DashboardContent />
    </Suspense>
  );
}
