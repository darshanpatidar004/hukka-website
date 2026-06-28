'use client';

import React, { useState, useEffect } from 'react';
import { useApp } from '@/context/AppContext';
import { ShieldCheck, Mail, Lock, User, ArrowRight, Star } from 'lucide-react';
import { useRouter } from 'next/navigation';
import Link from 'next/link';

export default function AuthPage() {
  const { user, login, register, authLoading } = useApp();
  const router = useRouter();

  const [isLoginTab, setIsLoginTab] = useState(true);
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [name, setName] = useState('');
  const [errorMsg, setErrorMsg] = useState('');
  const [loading, setLoading] = useState(false);

  // Redirect if already logged in
  useEffect(() => {
    if (user) {
      router.push('/dashboard');
    }
  }, [user, router]);

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setErrorMsg('');
    setLoading(true);

    try {
      if (isLoginTab) {
        // Login
        const res = await login({ email, password });
        if (res.success) {
          router.push('/dashboard');
        } else {
          setErrorMsg(res.error || 'Invalid credentials');
        }
      } else {
        // Register
        if (!name) {
          setErrorMsg('Please enter your name');
          setLoading(false);
          return;
        }
        const res = await register({ name, email, password });
        if (res.success) {
          router.push('/dashboard');
        } else {
          setErrorMsg(res.error || 'Failed to register');
        }
      }
    } catch (err) {
      setErrorMsg('A network error occurred.');
    } finally {
      setLoading(false);
    }
  };

  if (authLoading) {
    return (
      <div className="min-h-screen bg-zinc-950 text-white flex items-center justify-center">
        <p className="text-zinc-500 font-serif tracking-widest animate-pulse">VERIFYING SESSION...</p>
      </div>
    );
  }

  return (
    <div className="max-w-md w-full mx-auto px-4 py-20 flex flex-col justify-center min-h-[80vh]">
      {/* Container Card */}
      <div className="relative glass-panel p-8 md:p-10 rounded-sm shadow-2xl border border-zinc-800">
        
        {/* Decorative elements */}
        <div className="absolute top-0 left-0 w-6 h-6 border-t border-l border-gold-500/30" />
        <div className="absolute bottom-0 right-0 w-6 h-6 border-b border-r border-gold-500/30" />

        {/* Brand Header */}
        <div className="text-center mb-8">
          <Link href="/">
            <h2 className="font-serif text-2xl tracking-widest text-gold-200 uppercase">HUKKA DUBAI</h2>
          </Link>
          <span className="text-[9px] uppercase tracking-[0.3em] text-zinc-500 font-semibold block mt-1">
            Elite Members Portal
          </span>
        </div>

        {/* Tab selection */}
        <div className="flex border-b border-zinc-900 mb-8 text-xs font-semibold uppercase tracking-widest">
          <button
            onClick={() => {
              setIsLoginTab(true);
              setErrorMsg('');
            }}
            className={`flex-1 py-3 text-center border-b-2 transition-all ${
              isLoginTab ? 'border-gold-500 text-gold-400 font-bold' : 'border-transparent text-zinc-500 hover:text-zinc-300'
            }`}
          >
            Sign In
          </button>
          <button
            onClick={() => {
              setIsLoginTab(false);
              setErrorMsg('');
            }}
            className={`flex-1 py-3 text-center border-b-2 transition-all ${
              !isLoginTab ? 'border-gold-500 text-gold-400 font-bold' : 'border-transparent text-zinc-500 hover:text-zinc-300'
            }`}
          >
            Create Account
          </button>
        </div>

        {/* Form */}
        <form onSubmit={handleSubmit} className="space-y-6 text-xs">
          {!isLoginTab && (
            <div className="relative">
              <User className="absolute left-3 top-1/2 -translate-y-1/2 w-4.5 h-4.5 text-zinc-500" />
              <input
                type="text"
                required
                placeholder="FULL NAME"
                value={name}
                onChange={(e) => setName(e.target.value)}
                className="w-full bg-zinc-900/40 border border-zinc-800 focus:border-gold-500 text-white rounded-sm pl-10 pr-4 py-3 text-xs focus:outline-none uppercase tracking-wider"
              />
            </div>
          )}

          <div className="relative">
            <Mail className="absolute left-3 top-1/2 -translate-y-1/2 w-4.5 h-4.5 text-zinc-500" />
            <input
              type="email"
              required
              placeholder="EMAIL ADDRESS"
              value={email}
              onChange={(e) => setEmail(e.target.value)}
              className="w-full bg-zinc-900/40 border border-zinc-800 focus:border-gold-500 text-white rounded-sm pl-10 pr-4 py-3 text-xs focus:outline-none tracking-wider"
            />
          </div>

          <div className="relative">
            <Lock className="absolute left-3 top-1/2 -translate-y-1/2 w-4.5 h-4.5 text-zinc-500" />
            <input
              type="password"
              required
              placeholder="PASSWORD"
              value={password}
              onChange={(e) => setPassword(e.target.value)}
              className="w-full bg-zinc-900/40 border border-zinc-800 focus:border-gold-500 text-white rounded-sm pl-10 pr-4 py-3 text-xs focus:outline-none tracking-wider"
            />
          </div>

          {errorMsg && (
            <p className="p-3 bg-red-500/10 border border-red-500/20 text-red-400 rounded-sm text-[11px] leading-relaxed text-center">
              {errorMsg}
            </p>
          )}

          <button
            type="submit"
            disabled={loading}
            className="w-full py-4 bg-gradient-to-r from-gold-600 to-gold-400 hover:from-gold-500 hover:to-gold-300 text-black font-bold uppercase tracking-widest text-xs rounded-sm transition-all duration-300 flex items-center justify-center gap-2 shadow-lg active:scale-98 disabled:opacity-50"
          >
            {loading ? 'Processing...' : isLoginTab ? 'Sign In To Lounge' : 'Register Account'} <ArrowRight className="w-4 h-4" />
          </button>
        </form>

        {/* Demo Account Info Box */}
        {isLoginTab && (
          <div className="mt-8 p-4 bg-gold-950/20 border border-gold-500/20 rounded-sm space-y-2 text-[10px] text-zinc-400">
            <div className="flex items-center gap-1.5 text-gold-400 font-semibold uppercase tracking-wider">
              <Star className="w-3.5 h-3.5" />
              <span>Demo Administrator Account</span>
            </div>
            <p className="leading-relaxed">
              Use the following credentials to access the analytics and order fulfillment modules:
            </p>
            <div className="grid grid-cols-2 gap-2 text-[9px] uppercase tracking-widest bg-zinc-950/60 p-2 border border-zinc-900">
              <div>Email:</div>
              <div className="text-zinc-200 select-all font-mono font-semibold">admin@hukka.com</div>
              <div>Password:</div>
              <div className="text-zinc-200 select-all font-mono font-semibold">admin123</div>
            </div>
          </div>
        )}
      </div>
    </div>
  );
}
