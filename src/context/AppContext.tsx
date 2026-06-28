'use client';

import React, { createContext, useContext, useState, useEffect } from 'react';

export interface CartItem {
  id: string;
  name: string;
  slug: string;
  price: number;
  image_url: string;
  quantity: number;
  category: string;
}

export interface User {
  id: string;
  name: string;
  email: string;
  role: string;
  rewardsPoints: number;
}

interface AppContextType {
  cart: CartItem[];
  wishlist: string[]; // Product IDs
  user: User | null;
  authLoading: boolean;
  coupon: { code: string; discountPercent: number } | null;
  ageVerified: boolean;
  addToCart: (product: any, quantity?: number) => void;
  removeFromCart: (productId: string) => void;
  updateCartQuantity: (productId: string, quantity: number) => void;
  clearCart: () => void;
  toggleWishlist: (productId: string) => void;
  applyCoupon: (code: string) => Promise<{ success: boolean; message: string }>;
  removeCoupon: () => void;
  verifyAge: () => void;
  login: (credentials: any) => Promise<{ success: boolean; error?: string }>;
  register: (userData: any) => Promise<{ success: boolean; error?: string }>;
  logout: () => Promise<void>;
  checkSession: () => Promise<void>;
}

const AppContext = createContext<AppContextType | undefined>(undefined);

export function AppProvider({ children }: { children: React.ReactNode }) {
  const [cart, setCart] = useState<CartItem[]>([]);
  const [wishlist, setWishlist] = useState<string[]>([]);
  const [user, setUser] = useState<User | null>(null);
  const [authLoading, setAuthLoading] = useState(true);
  const [coupon, setCoupon] = useState<{ code: string; discountPercent: number } | null>(null);
  const [ageVerified, setAgeVerified] = useState(false);

  // Load initial state from localStorage on mount
  useEffect(() => {
    const savedCart = localStorage.getItem('hukka_cart');
    const savedWishlist = localStorage.getItem('hukka_wishlist');
    const savedAge = localStorage.getItem('hukka_age_verified');

    if (savedCart) setCart(JSON.parse(savedCart));
    if (savedWishlist) setWishlist(JSON.parse(savedWishlist));
    if (savedAge === 'true') setAgeVerified(true);

    checkSession();
  }, []);

  // Save cart & wishlist when they change
  useEffect(() => {
    localStorage.setItem('hukka_cart', JSON.stringify(cart));
  }, [cart]);

  useEffect(() => {
    localStorage.setItem('hukka_wishlist', JSON.stringify(wishlist));
  }, [wishlist]);

  const checkSession = async () => {
    try {
      setAuthLoading(true);
      const res = await fetch('/api/auth/me');
      const data = await res.json();
      if (data.success) {
        setUser(data.user);
      } else {
        setUser(null);
      }
    } catch (error) {
      setUser(null);
    } finally {
      setAuthLoading(false);
    }
  };

  const addToCart = (product: any, quantity = 1) => {
    setCart((prevCart) => {
      const existing = prevCart.find((item) => item.id === product.id);
      if (existing) {
        return prevCart.map((item) =>
          item.id === product.id ? { ...item, quantity: item.quantity + quantity } : item
        );
      }
      return [
        ...prevCart,
        {
          id: product.id,
          name: product.name,
          slug: product.slug,
          price: product.price,
          image_url: product.image_url,
          category: product.category,
          quantity,
        },
      ];
    });
  };

  const removeFromCart = (productId: string) => {
    setCart((prevCart) => prevCart.filter((item) => item.id !== productId));
  };

  const updateCartQuantity = (productId: string, quantity: number) => {
    if (quantity <= 0) {
      removeFromCart(productId);
      return;
    }
    setCart((prevCart) =>
      prevCart.map((item) => (item.id === productId ? { ...item, quantity } : item))
    );
  };

  const clearCart = () => {
    setCart([]);
    setCoupon(null);
  };

  const toggleWishlist = (productId: string) => {
    setWishlist((prevWishlist) => {
      if (prevWishlist.includes(productId)) {
        return prevWishlist.filter((id) => id !== productId);
      }
      return [...prevWishlist, productId];
    });
  };

  const applyCoupon = async (code: string) => {
    try {
      const res = await fetch(`/api/coupons/${code}`);
      const data = await res.json();
      if (data.success) {
        setCoupon({
          code: data.coupon.code,
          discountPercent: data.coupon.discount_percent,
        });
        return { success: true, message: `Promo code ${code} applied successfully!` };
      } else {
        return { success: false, message: data.error || 'Invalid coupon' };
      }
    } catch (error) {
      return { success: false, message: 'Failed to apply coupon' };
    }
  };

  const removeCoupon = () => {
    setCoupon(null);
  };

  const verifyAge = () => {
    setAgeVerified(true);
    localStorage.setItem('hukka_age_verified', 'true');
  };

  const login = async (credentials: any) => {
    try {
      const res = await fetch('/api/auth/login', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify(credentials),
      });
      const data = await res.json();
      if (data.success) {
        setUser(data.user);
        return { success: true };
      } else {
        return { success: false, error: data.error };
      }
    } catch (error: any) {
      return { success: false, error: 'Connection error' };
    }
  };

  const register = async (userData: any) => {
    try {
      const res = await fetch('/api/auth/register', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify(userData),
      });
      const data = await res.json();
      if (data.success) {
        setUser(data.user);
        return { success: true };
      } else {
        return { success: false, error: data.error };
      }
    } catch (error: any) {
      return { success: false, error: 'Connection error' };
    }
  };

  const logout = async () => {
    try {
      await fetch('/api/auth/logout', { method: 'POST' });
      setUser(null);
    } catch (error) {
      console.error('Logout error:', error);
    }
  };

  return (
    <AppContext.Provider
      value={{
        cart,
        wishlist,
        user,
        authLoading,
        coupon,
        ageVerified,
        addToCart,
        removeFromCart,
        updateCartQuantity,
        clearCart,
        toggleWishlist,
        applyCoupon,
        removeCoupon,
        verifyAge,
        login,
        register,
        logout,
        checkSession,
      }}
    >
      {children}
    </AppContext.Provider>
  );
}

export function useApp() {
  const context = useContext(AppContext);
  if (context === undefined) {
    throw new Error('useApp must be used within an AppProvider');
  }
  return context;
}
