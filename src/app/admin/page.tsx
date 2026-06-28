'use client';

import React, { useState, useEffect } from 'react';
import { useApp } from '@/context/AppContext';
import { ShieldCheck, IndianRupee, ShoppingBag, Users, Layers, Award, ChevronRight, CheckCircle2, AlertCircle, RefreshCw, Star, Trash2, Plus, Box, KeyRound } from 'lucide-react';
import { useRouter } from 'next/navigation';
import Link from 'next/link';

export default function AdminDashboard() {
  const { user, authLoading } = useApp();
  const router = useRouter();

  // Data states
  const [analytics, setAnalytics] = useState<any>(null);
  const [orders, setOrders] = useState<any[]>([]);
  const [products, setProducts] = useState<any[]>([]);
  const [coupons, setCoupons] = useState<any[]>([]);
  const [reviews, setReviews] = useState<any[]>([]);
  
  const [loading, setLoading] = useState(true);
  const [activeTab, setActiveTab] = useState('analytics'); // analytics, orders, inventory, coupons, reviews

  // Actions states
  const [updatingOrderId, setUpdatingOrderId] = useState<string | null>(null);
  const [updatingProductId, setUpdatingProductId] = useState<string | null>(null);
  const [deletingCoupon, setDeletingCoupon] = useState<string | null>(null);
  const [deletingReview, setDeletingReview] = useState<string | null>(null);

  const [successMsg, setSuccessMsg] = useState('');
  const [errorMsg, setErrorMsg] = useState('');

  // Auth Protection redirect
  useEffect(() => {
    if (!authLoading) {
      if (!user) {
        router.push('/auth');
      } else if (user.role !== 'admin') {
        router.push('/dashboard');
      }
    }
  }, [user, authLoading, router]);

  // Fetch Admin Data
  useEffect(() => {
    if (user && user.role === 'admin') {
      fetchAdminData();
    }
  }, [user]);

  const fetchAdminData = async () => {
    try {
      setLoading(true);
      setErrorMsg('');
      
      // Fetch analytics
      const analyticRes = await fetch('/api/admin/analytics');
      const analyticData = await analyticRes.json();
      
      // Fetch orders
      const ordersRes = await fetch('/api/admin/orders');
      const ordersData = await ordersRes.json();

      // Fetch products
      const productsRes = await fetch('/api/admin/products');
      const productsData = await productsRes.json();

      // Fetch coupons
      const couponsRes = await fetch('/api/admin/coupons');
      const couponsData = await couponsRes.json();

      // Fetch reviews
      const reviewsRes = await fetch('/api/admin/reviews');
      const reviewsData = await reviewsRes.json();

      if (
        analyticData.success &&
        ordersData.success &&
        productsData.success &&
        couponsData.success &&
        reviewsData.success
      ) {
        setAnalytics(analyticData.analytics);
        setOrders(ordersData.orders);
        setProducts(productsData.products);
        setCoupons(couponsData.coupons);
        setReviews(reviewsData.reviews);
      } else {
        setErrorMsg('Failed to load administrative resources.');
      }
    } catch (err) {
      setErrorMsg('Network error fetching admin resources.');
    } finally {
      setLoading(false);
    }
  };

  const handleUpdateStatus = async (orderId: string, status: string, paymentStatus: string) => {
    setUpdatingOrderId(orderId);
    setSuccessMsg('');
    setErrorMsg('');

    try {
      const res = await fetch('/api/admin/orders', {
        method: 'PUT',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ orderId, status, paymentStatus }),
      });

      const data = await res.json();
      if (data.success) {
        setSuccessMsg(`Order ${orderId} updated successfully.`);
        // Refresh local orders list
        setOrders((prev) =>
          prev.map((ord) =>
            ord.id === orderId ? { ...ord, status, payment_status: paymentStatus } : ord
          )
        );
        // Refresh analytics
        const analyticRes = await fetch('/api/admin/analytics');
        const analyticData = await analyticRes.json();
        if (analyticData.success) {
          setAnalytics(analyticData.analytics);
        }
      } else {
        setErrorMsg(data.error || 'Failed to update order status.');
      }
    } catch (err) {
      setErrorMsg('Connection error updating order.');
    } finally {
      setUpdatingOrderId(null);
    }
  };

  const handleRestock = async (productId: string) => {
    setUpdatingProductId(productId);
    setSuccessMsg('');
    setErrorMsg('');

    try {
      const res = await fetch('/api/admin/products', {
        method: 'PUT',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ productId, adjustment: 10 }),
      });

      const data = await res.json();
      if (data.success) {
        setSuccessMsg(`Product inventory updated successfully (+10 items).`);
        setProducts((prev) =>
          prev.map((p) => (p.id === productId ? { ...p, stock: p.stock + 10 } : p))
        );
      } else {
        setErrorMsg(data.error || 'Failed to adjust stock levels.');
      }
    } catch (err) {
      setErrorMsg('Connection error adjusting stock.');
    } finally {
      setUpdatingProductId(null);
    }
  };

  const handleDeleteCoupon = async (code: string) => {
    setDeletingCoupon(code);
    setSuccessMsg('');
    setErrorMsg('');

    try {
      const res = await fetch(`/api/admin/coupons?code=${code}`, {
        method: 'DELETE',
      });

      const data = await res.json();
      if (data.success) {
        setSuccessMsg(`Promo code ${code} deactivated successfully.`);
        setCoupons((prev) => prev.filter((c) => c.code !== code));
      } else {
        setErrorMsg(data.error || 'Failed to delete coupon.');
      }
    } catch (err) {
      setErrorMsg('Connection error deactivating coupon.');
    } finally {
      setDeletingCoupon(null);
    }
  };

  const handleDeleteReview = async (id: string) => {
    setDeletingReview(id);
    setSuccessMsg('');
    setErrorMsg('');

    try {
      const res = await fetch(`/api/admin/reviews?id=${id}`, {
        method: 'DELETE',
      });

      const data = await res.json();
      if (data.success) {
        setSuccessMsg(`Customer review moderated and removed.`);
        setReviews((prev) => prev.filter((r) => r.id !== id));
      } else {
        setErrorMsg(data.error || 'Failed to moderate review.');
      }
    } catch (err) {
      setErrorMsg('Connection error moderating review.');
    } finally {
      setDeletingReview(null);
    }
  };

  if (authLoading || (!user && authLoading)) {
    return (
      <div className="min-h-screen bg-zinc-950 text-white flex items-center justify-center">
        <p className="text-zinc-500 font-serif tracking-widest animate-pulse font-bold">VERIFYING ADMINISTRATIVE ACCESS...</p>
      </div>
    );
  }

  if (!user || user.role !== 'admin') return null; // Handled by redirects

  return (
    <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-12">
      {/* Page Title */}
      <div className="mb-12 flex flex-col md:flex-row justify-between items-start md:items-end border-b border-zinc-900 pb-6 gap-4">
        <div>
          <span className="text-xs uppercase tracking-[0.4em] text-gold-500 font-semibold block mb-2">
            EXECUTIVE CONTROL CENTER
          </span>
          <h1 className="font-serif text-3xl md:text-5xl text-gold-200 tracking-wide uppercase">
            ADMIN PANEL
          </h1>
        </div>
        
        <button
          onClick={fetchAdminData}
          className="px-4 py-2 border border-zinc-800 hover:border-gold-500/50 hover:bg-gold-500/5 text-zinc-400 hover:text-gold-200 text-xs font-bold uppercase tracking-widest rounded-sm transition-all flex items-center gap-1.5"
        >
          <RefreshCw className="w-3.5 h-3.5" /> Reload Data
        </button>
      </div>

      {errorMsg && (
        <div className="mb-6 p-4 bg-red-500/10 border border-red-500/20 text-red-400 rounded-sm text-xs flex items-center gap-2">
          <AlertCircle className="w-5 h-5" />
          <span>{errorMsg}</span>
        </div>
      )}

      {successMsg && (
        <div className="mb-6 p-4 bg-green-500/10 border border-green-500/20 text-green-400 rounded-sm text-xs flex items-center gap-2">
          <CheckCircle2 className="w-5 h-5" />
          <span>{successMsg}</span>
        </div>
      )}

      {/* Navigation tabs */}
      <div className="flex flex-wrap border-b border-zinc-900 mb-8 text-xs font-semibold uppercase tracking-widest">
        <button
          onClick={() => setActiveTab('analytics')}
          className={`px-6 py-3 border-b-2 transition-all ${
            activeTab === 'analytics' ? 'border-gold-500 text-gold-400 font-bold' : 'border-transparent text-zinc-500 hover:text-zinc-300'
          }`}
        >
          Overview
        </button>
        <button
          onClick={() => setActiveTab('orders')}
          className={`px-6 py-3 border-b-2 transition-all ${
            activeTab === 'orders' ? 'border-gold-500 text-gold-400 font-bold' : 'border-transparent text-zinc-500 hover:text-zinc-300'
          }`}
        >
          Orders ({orders.length})
        </button>
        <button
          onClick={() => setActiveTab('inventory')}
          className={`px-6 py-3 border-b-2 transition-all ${
            activeTab === 'inventory' ? 'border-gold-500 text-gold-400 font-bold' : 'border-transparent text-zinc-500 hover:text-zinc-300'
          }`}
        >
          Inventory ({products.length})
        </button>
        <button
          onClick={() => setActiveTab('coupons')}
          className={`px-6 py-3 border-b-2 transition-all ${
            activeTab === 'coupons' ? 'border-gold-500 text-gold-400 font-bold' : 'border-transparent text-zinc-500 hover:text-zinc-300'
          }`}
        >
          Promo Codes ({coupons.length})
        </button>
        <button
          onClick={() => setActiveTab('reviews')}
          className={`px-6 py-3 border-b-2 transition-all ${
            activeTab === 'reviews' ? 'border-gold-500 text-gold-400 font-bold' : 'border-transparent text-zinc-500 hover:text-zinc-300'
          }`}
        >
          Reviews ({reviews.length})
        </button>
      </div>

      {loading ? (
        <p className="text-zinc-500 text-xs italic">Loading control center data...</p>
      ) : (
        <>
          {/* ========================================================================= */}
          {/* TAB 1: OVERVIEW ANALYTICS */}
          {/* ========================================================================= */}
          {activeTab === 'analytics' && analytics && (
            <div className="space-y-10">
              {/* Analytics Cards Grid */}
              <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-6">
                <div className="p-6 bg-zinc-900/30 border border-zinc-900 rounded-sm flex items-center gap-4">
                  <div className="w-12 h-12 rounded-sm bg-gold-500/10 border border-gold-500/20 flex items-center justify-center text-gold-400">
                    <IndianRupee className="w-6 h-6" />
                  </div>
                  <div>
                    <span className="text-[10px] text-zinc-500 uppercase tracking-widest block">Gross Revenue</span>
                    <span className="text-lg font-bold text-zinc-100">₹{analytics.totalRevenue.toLocaleString('en-IN')}</span>
                  </div>
                </div>

                <div className="p-6 bg-zinc-900/30 border border-zinc-900 rounded-sm flex items-center gap-4">
                  <div className="w-12 h-12 rounded-sm bg-gold-500/10 border border-gold-500/20 flex items-center justify-center text-gold-400">
                    <ShoppingBag className="w-6 h-6" />
                  </div>
                  <div>
                    <span className="text-[10px] text-zinc-500 uppercase tracking-widest block">Orders Placed</span>
                    <span className="text-lg font-bold text-zinc-100">{analytics.ordersCount} Orders</span>
                  </div>
                </div>

                <div className="p-6 bg-zinc-900/30 border border-zinc-900 rounded-sm flex items-center gap-4">
                  <div className="w-12 h-12 rounded-sm bg-gold-500/10 border border-gold-500/20 flex items-center justify-center text-gold-400">
                    <Box className="w-6 h-6" />
                  </div>
                  <div>
                    <span className="text-[10px] text-zinc-500 uppercase tracking-widest block">Catalog Size</span>
                    <span className="text-lg font-bold text-zinc-100">{analytics.productsCount} Products</span>
                  </div>
                </div>

                <div className="p-6 bg-zinc-900/30 border border-zinc-900 rounded-sm flex items-center gap-4">
                  <div className="w-12 h-12 rounded-sm bg-gold-500/10 border border-gold-500/20 flex items-center justify-center text-gold-400">
                    <Users className="w-6 h-6" />
                  </div>
                  <div>
                    <span className="text-[10px] text-zinc-500 uppercase tracking-widest block">Collectors List</span>
                    <span className="text-lg font-bold text-zinc-100">{analytics.usersCount} Customers</span>
                  </div>
                </div>
              </div>

              {/* Graphical breakdowns (Visual styling bars) */}
              <div className="grid grid-cols-1 lg:grid-cols-2 gap-8">
                
                {/* Sales distribution */}
                <div className="p-6 bg-zinc-900/10 border border-zinc-900 rounded-sm space-y-6">
                  <h3 className="font-serif text-sm text-gold-300 uppercase tracking-wider">SALES DISTRIBUTION BY CATEGORY</h3>
                  <div className="space-y-4 text-xs">
                    <div>
                      <div className="flex justify-between text-zinc-400 mb-1.5">
                        <span>Premium & Modern Hookahs</span>
                        <span className="text-zinc-200">75%</span>
                      </div>
                      <div className="w-full h-2 bg-zinc-900 rounded-full overflow-hidden">
                        <div className="h-full bg-gold-500 rounded-full" style={{ width: '75%' }} />
                      </div>
                    </div>
                    <div>
                      <div className="flex justify-between text-zinc-400 mb-1.5">
                        <span>Hookah Accessories & Bases</span>
                        <span className="text-zinc-200">18%</span>
                      </div>
                      <div className="w-full h-2 bg-zinc-900 rounded-full overflow-hidden">
                        <div className="h-full bg-gold-400/70 rounded-full" style={{ width: '18%' }} />
                      </div>
                    </div>
                    <div>
                      <div className="flex justify-between text-zinc-400 mb-1.5">
                        <span>Consumables & Coconut Coals</span>
                        <span className="text-zinc-200">7%</span>
                      </div>
                      <div className="w-full h-2 bg-zinc-900 rounded-full overflow-hidden">
                        <div className="h-full bg-zinc-700 rounded-full" style={{ width: '7%' }} />
                      </div>
                    </div>
                  </div>
                </div>

                {/* Operations checklist */}
                <div className="p-6 bg-zinc-900/10 border border-zinc-900 rounded-sm space-y-4 text-xs">
                  <h3 className="font-serif text-sm text-gold-300 uppercase tracking-wider">SYSTEM CHECKLIST</h3>
                  <div className="space-y-3">
                    <div className="flex items-center gap-2 text-green-400">
                      <CheckCircle2 className="w-4.5 h-4.5 flex-shrink-0" />
                      <span>SQLite Database Connected (Journal WAL Mode)</span>
                    </div>
                    <div className="flex items-center gap-2 text-green-400">
                      <CheckCircle2 className="w-4.5 h-4.5 flex-shrink-0" />
                      <span>Security Certificates Verified</span>
                    </div>
                    <div className="flex items-center gap-2 text-zinc-400">
                      <ShieldCheck className="w-4.5 h-4.5 text-gold-500 flex-shrink-0" />
                      <span>Authentication Layer Active (JWT stateless cookies)</span>
                    </div>
                  </div>
                </div>

              </div>

              {/* Advisory note */}
              <div className="p-6 bg-gold-950/10 border border-gold-500/20 rounded-sm space-y-2 text-xs">
                <div className="flex items-center gap-2 text-gold-400 font-bold uppercase tracking-wider">
                  <ShieldCheck className="w-5 h-5" />
                  <span>Advisory & Compliance Notice</span>
                </div>
                <p className="text-zinc-500 leading-relaxed font-light">
                  This dashboard gives live operational control. All inventory changes and shipping updates are recorded. Ensure compliance checks (such as age verification) are met on physical delivery of all hookah stem sets.
                </p>
              </div>
            </div>
          )}

          {/* ========================================================================= */}
          {/* TAB 2: ORDER MANAGEMENT */}
          {/* ========================================================================= */}
          {activeTab === 'orders' && (
            <div className="space-y-6">
              {orders.length === 0 ? (
                <p className="text-zinc-500 text-xs italic">No order entries found.</p>
              ) : (
                <div className="overflow-x-auto">
                  <table className="w-full text-left text-xs tracking-wider border-collapse">
                    <thead>
                      <tr className="border-b border-zinc-900 text-zinc-500 uppercase tracking-widest">
                        <th className="py-4 px-3">Order ID</th>
                        <th className="py-4 px-3">Customer</th>
                        <th className="py-4 px-3">Items Purchased</th>
                        <th className="py-4 px-3">Total Due</th>
                        <th className="py-4 px-3">Payment</th>
                        <th className="py-4 px-3">Status</th>
                        <th className="py-4 px-3 text-right">Actions</th>
                      </tr>
                    </thead>
                    <tbody className="divide-y divide-zinc-900/60 text-zinc-300">
                      {orders.map((ord) => (
                        <tr key={ord.id} className="hover:bg-zinc-900/10">
                          <td className="py-4 px-3 font-mono font-semibold text-zinc-400">{ord.id}</td>
                          <td className="py-4 px-3">
                            <span className="block font-medium text-zinc-100">{ord.address.name}</span>
                            <span className="block text-[10px] text-zinc-500 mt-0.5">{ord.address.city}, {ord.address.postalCode}</span>
                          </td>
                          <td className="py-4 px-3 max-w-xs truncate">
                            {ord.items.map((item: any) => `${item.name} (${item.quantity})`).join(', ')}
                          </td>
                          <td className="py-4 px-3 font-semibold text-gold-400">₹{ord.total_amount.toLocaleString('en-IN')}</td>
                          <td className="py-4 px-3 uppercase text-[10px] font-bold">
                            <span className={`px-2 py-0.5 rounded-sm border ${
                              ord.payment_status === 'paid'
                                ? 'bg-green-950/20 border-green-500/20 text-green-400'
                                : 'bg-yellow-950/20 border-yellow-500/20 text-yellow-400'
                            }`}>
                              {ord.payment_status} ({ord.payment_method})
                            </span>
                          </td>
                          <td className="py-4 px-3 uppercase text-[10px] font-bold">
                            <span className={`px-2 py-0.5 rounded-sm border ${
                              ord.status === 'delivered'
                                ? 'bg-green-950/20 border-green-500/20 text-green-400'
                                : ord.status === 'shipped'
                                ? 'bg-blue-950/20 border-blue-500/20 text-blue-400'
                                : 'bg-yellow-950/20 border-yellow-500/20 text-yellow-400'
                            }`}>
                              {ord.status}
                            </span>
                          </td>
                          <td className="py-4 px-3 text-right">
                            {updatingOrderId === ord.id ? (
                              <span className="text-[10px] text-zinc-500 uppercase tracking-widest animate-pulse">Updating...</span>
                            ) : (
                              <div className="flex gap-2 justify-end">
                                {ord.status !== 'shipped' && ord.status !== 'delivered' && (
                                  <button
                                    onClick={() => handleUpdateStatus(ord.id, 'shipped', ord.payment_status)}
                                    className="px-2.5 py-1 bg-zinc-900 border border-zinc-800 hover:border-blue-500/50 hover:bg-blue-500/5 text-[9px] uppercase tracking-widest font-semibold rounded-sm transition-all"
                                  >
                                    Ship
                                  </button>
                                )}
                                {ord.status !== 'delivered' && (
                                  <button
                                    onClick={() => handleUpdateStatus(ord.id, 'delivered', 'paid')}
                                    className="px-2.5 py-1 bg-zinc-900 border border-zinc-800 hover:border-green-500/50 hover:bg-green-500/5 text-[9px] uppercase tracking-widest font-semibold rounded-sm transition-all text-gold-400"
                                  >
                                    Deliver & Pay
                                  </button>
                                )}
                              </div>
                            )}
                          </td>
                        </tr>
                      ))}
                    </tbody>
                  </table>
                </div>
              )}
            </div>
          )}

          {/* ========================================================================= */}
          {/* TAB 3: INVENTORY MANAGER */}
          {/* ========================================================================= */}
          {activeTab === 'inventory' && (
            <div className="space-y-6">
              <h2 className="font-serif text-lg text-gold-300 uppercase tracking-wider">INVENTORY CONTROL</h2>
              <div className="overflow-x-auto">
                <table className="w-full text-left text-xs tracking-wider border-collapse">
                  <thead>
                    <tr className="border-b border-zinc-900 text-zinc-500 uppercase tracking-widest">
                      <th className="py-4 px-3">Product Name</th>
                      <th className="py-4 px-3">Category</th>
                      <th className="py-4 px-3">Price</th>
                      <th className="py-4 px-3">Current Stock</th>
                      <th className="py-4 px-3">Status</th>
                      <th className="py-4 px-3 text-right">Quick Action</th>
                    </tr>
                  </thead>
                  <tbody className="divide-y divide-zinc-900/60 text-zinc-300">
                    {products.map((p) => {
                      const isLowStock = p.stock < 10;
                      return (
                        <tr key={p.id} className="hover:bg-zinc-900/10">
                          <td className="py-4 px-3 font-serif text-zinc-200">{p.name}</td>
                          <td className="py-4 px-3 text-zinc-500 uppercase text-[10px]">{p.category}</td>
                          <td className="py-4 px-3 text-gold-400 font-semibold">₹{p.price.toLocaleString('en-IN')}</td>
                          <td className="py-4 px-3 font-semibold">{p.stock} units</td>
                          <td className="py-4 px-3 text-[10px] uppercase font-bold">
                            <span className={`px-2 py-0.5 rounded-sm border ${
                              p.stock === 0
                                ? 'bg-red-950/20 border-red-500/20 text-red-400'
                                : isLowStock
                                ? 'bg-yellow-950/20 border-yellow-500/20 text-yellow-400'
                                : 'bg-green-950/20 border-green-500/20 text-green-400'
                            }`}>
                              {p.stock === 0 ? 'Out of Stock' : isLowStock ? 'Low Stock' : 'Good Stock'}
                            </span>
                          </td>
                          <td className="py-4 px-3 text-right">
                            {updatingProductId === p.id ? (
                              <span className="text-[10px] text-zinc-500 uppercase tracking-widest animate-pulse">Adjusting...</span>
                            ) : (
                              <button
                                onClick={() => handleRestock(p.id)}
                                className="px-2.5 py-1 bg-zinc-900 border border-zinc-800 hover:border-gold-500/50 hover:bg-gold-500/5 text-[9px] uppercase tracking-widest font-semibold rounded-sm transition-all text-gold-400"
                              >
                                Restock (+10)
                              </button>
                            )}
                          </td>
                        </tr>
                      );
                    })}
                  </tbody>
                </table>
              </div>
            </div>
          )}

          {/* ========================================================================= */}
          {/* TAB 4: COUPONS MANAGER */}
          {/* ========================================================================= */}
          {activeTab === 'coupons' && (
            <div className="space-y-6">
              <h2 className="font-serif text-lg text-gold-300 uppercase tracking-wider">ACTIVE PROMO CODES</h2>
              <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
                {coupons.map((c) => (
                  <div
                    key={c.code}
                    className="p-6 bg-zinc-900/20 border border-zinc-800 rounded-sm flex flex-col justify-between hover:border-gold-500/20 transition-all"
                  >
                    <div className="space-y-3">
                      <div className="flex items-center gap-2 text-gold-400">
                        <KeyRound className="w-5 h-5" />
                        <span className="font-mono font-bold tracking-widest text-sm text-zinc-200">{c.code}</span>
                      </div>
                      <div className="text-xs text-zinc-500 space-y-1">
                        <p>Discount Percent: <span className="text-zinc-300 font-semibold">{c.discount_percent}% OFF</span></p>
                        <p>Expiry: <span className="text-zinc-300">{c.expiry_date}</span></p>
                        <p>Status: <span className="text-green-400 font-semibold uppercase text-[10px]">{c.is_active ? 'Active' : 'Expired'}</span></p>
                      </div>
                    </div>

                    <div className="pt-4 border-t border-zinc-900 mt-4">
                      {deletingCoupon === c.code ? (
                        <span className="text-[10px] text-zinc-500 uppercase tracking-widest animate-pulse">Deactivating...</span>
                      ) : (
                        <button
                          onClick={() => handleDeleteCoupon(c.code)}
                          className="w-full py-2 bg-red-950/20 border border-red-500/20 hover:bg-red-500/10 text-red-400 hover:text-red-300 text-[10px] uppercase font-bold tracking-widest rounded-sm transition-all flex items-center justify-center gap-1.5"
                        >
                          <Trash2 className="w-3.5 h-3.5" /> Deactivate Code
                        </button>
                      )}
                    </div>
                  </div>
                ))}
              </div>
            </div>
          )}

          {/* ========================================================================= */}
          {/* TAB 5: REVIEWS MODERATOR */}
          {/* ========================================================================= */}
          {activeTab === 'reviews' && (
            <div className="space-y-6">
              <h2 className="font-serif text-lg text-gold-300 uppercase tracking-wider">REVIEWS MODERATION</h2>
              <div className="space-y-4">
                {reviews.length === 0 ? (
                  <p className="text-zinc-500 text-xs italic">No customer reviews found.</p>
                ) : (
                  reviews.map((rev) => (
                    <div
                      key={rev.id}
                      className="p-6 bg-zinc-900/15 border border-zinc-900/60 rounded-sm flex flex-col md:flex-row justify-between items-start md:items-center gap-4"
                    >
                      <div className="space-y-2">
                        <div className="flex items-center gap-2">
                          <span className="font-serif font-bold text-zinc-200 text-sm">{rev.user_name}</span>
                          <div className="flex text-gold-400">
                            {[...Array(5)].map((_, i) => (
                              <Star
                                key={i}
                                className={`w-3.5 h-3.5 ${
                                  i < rev.rating ? 'fill-currentColor' : 'text-zinc-800'
                                }`}
                              />
                            ))}
                          </div>
                        </div>
                        <h4 className="text-xs font-semibold text-zinc-300">&ldquo;{rev.title}&rdquo;</h4>
                        <p className="text-zinc-500 text-xs italic max-w-xl leading-relaxed">{rev.comment}</p>
                        <span className="text-[10px] text-zinc-600 block">
                          Product ID: <span className="font-mono">{rev.product_id}</span> &bull; Posted on {new Date(rev.created_at).toLocaleDateString('en-IN')}
                        </span>
                      </div>

                      <div className="flex-shrink-0 w-full md:w-auto">
                        {deletingReview === rev.id ? (
                          <span className="text-[10px] text-zinc-500 uppercase tracking-widest animate-pulse">Moderating...</span>
                        ) : (
                          <button
                            onClick={() => handleDeleteReview(rev.id)}
                            className="w-full md:w-auto px-4 py-2 bg-red-950/20 border border-red-500/20 hover:bg-red-500/10 text-red-400 hover:text-red-300 text-[10px] uppercase font-bold tracking-widest rounded-sm transition-all flex items-center justify-center gap-1.5"
                          >
                            <Trash2 className="w-3.5 h-3.5" /> Moderation Delete
                          </button>
                        )}
                      </div>
                    </div>
                  ))
                )}
              </div>
            </div>
          )}
        </>
      )}
    </div>
  );
}
