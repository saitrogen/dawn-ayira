'use client';

import React, { createContext, useContext, useState, useEffect } from 'react';
import { SHOP } from '@/lib/data';

interface CartItem {
  p: any;
  qty: number;
  size: string;
}

interface StoreContextType {
  cart: CartItem[];
  addToCart: (p: any, qty?: number, size?: string) => void;
  updateQty: (idx: number, delta: number) => void;
  removeLine: (idx: number) => void;
  clearCart: () => void;
  itemCount: number;
  subtotal: number;
  delivery: number;
  total: number;
  freeShipping: boolean;
  threshold: number;
  cartOpen: boolean;
  setCartOpen: (open: boolean) => void;
  mobMenuOpen: boolean;
  setMobMenuOpen: (open: boolean) => void;
  searchOpen: boolean;
  setSearchOpen: (open: boolean) => void;
  toast: string | null;
  theme: {
    announcement: 'single' | 'rotating' | 'cta' | 'scrolling';
    header: 'logo-left' | 'logo-center';
    hero: 'left' | 'centered';
    card: 'default' | 'outline-qa' | 'bar-qa' | 'minimal';
  };
  setTheme: (theme: Partial<StoreContextType['theme']>) => void;
}

const StoreCtx = createContext<StoreContextType | null>(null);

export const useStore = () => {
  const ctx = useContext(StoreCtx);
  if (!ctx) throw new Error('useStore must be used within StoreProvider');
  return ctx;
};

const FREE_DELIVERY_THRESHOLD = 50;

export function StoreProvider({ children }: { children: React.ReactNode }) {
  const [cartOpen, setCartOpen] = useState(false);
  const [mobMenuOpen, setMobMenuOpen] = useState(false);
  const [searchOpen, setSearchOpen] = useState(false);
  const [toast, setToast] = useState<string | null>(null);
  const [theme, setThemeState] = useState<StoreContextType['theme']>({
    announcement: 'rotating',
    header: 'logo-left',
    hero: 'left',
    card: 'default',
  });
  
  const setTheme = (updates: Partial<StoreContextType['theme']>) => setThemeState(t => ({...t, ...updates}));

  // Seed cart with an item for preview (as requested in prototype)
  const [cart, setCart] = useState<CartItem[]>([]);

  useEffect(() => {
    // Initial hydration if needed
    const kddMango = SHOP.products.find((p) => p.handle === 'kdd-mango-nectar');
    if (kddMango) {
      setTimeout(() => {
        setCart(prev => prev.length === 0 ? [{ p: kddMango, qty: 2, size: '250ml' }] : prev);
      }, 0)
    }
  }, []);

  const showToast = (text: string) => {
    setToast(text);
    setTimeout(() => setToast(null), 2000);
  };

  const addToCart = (p: any, qty = 1, size?: string) => {
    const chosenSize = size || p.options?.Size?.[0] || 'Default';
    setCart((c) => {
      const ix = c.findIndex((l) => l.p.handle === p.handle && l.size === chosenSize);
      if (ix >= 0) {
        const next = [...c];
        next[ix] = { ...next[ix], qty: next[ix].qty + qty };
        return next;
      }
      return [...c, { p, qty, size: chosenSize }];
    });
    setCartOpen(true);
    showToast(`${p.title} added to cart`);
  };

  const updateQty = (idx: number, delta: number) => {
    setCart((c) => {
      const next = [...c];
      next[idx] = { ...next[idx], qty: Math.max(1, next[idx].qty + delta) };
      return next;
    });
  };

  const removeLine = (idx: number) => {
    setCart((c) => c.filter((_, i) => i !== idx));
  };

  const clearCart = () => setCart([]);

  const itemCount = cart.reduce((s, l) => s + l.qty, 0);
  const subtotal = cart.reduce((s, l) => s + l.p.price * l.qty, 0);
  const freeShipping = subtotal >= FREE_DELIVERY_THRESHOLD;
  const delivery = freeShipping || cart.length === 0 ? 0 : 8;
  const total = subtotal + delivery;

  return (
    <StoreCtx.Provider
      value={{
        cart,
        addToCart,
        updateQty,
        removeLine,
        clearCart,
        itemCount,
        subtotal,
        delivery,
        total,
        freeShipping,
        threshold: FREE_DELIVERY_THRESHOLD,
        cartOpen,
        setCartOpen,
        mobMenuOpen,
        setMobMenuOpen,
        searchOpen,
        setSearchOpen,
        toast,
        theme,
        setTheme,
      }}
    >
      {children}
    </StoreCtx.Provider>
  );
}
