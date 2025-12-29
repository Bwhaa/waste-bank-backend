'use client';

import React, { createContext, useContext, useState } from 'react';
import { RewardItem } from '@/types/rewards'; // หรือ path ที่คุณเก็บ type ไว้

export interface CartItem extends RewardItem {
  quantity: number;
}

interface CartContextType {
  cart: CartItem[];
  addToCart: (item: RewardItem) => void;
  decreaseCart: (id: number) => void; // ✅ เพิ่มฟังก์ชันนี้
  removeFromCart: (id: number) => void;
  clearCart: () => void;
  totalItems: number;
  totalPoints: number;
}

const CartContext = createContext<CartContextType | undefined>(undefined);

export function CartProvider({ children }: { children: React.ReactNode }) {
  const [cart, setCart] = useState<CartItem[]>([]);

  // เพิ่มของ (+1)
  const addToCart = (item: RewardItem) => {
    setCart((prev) => {
      const existing = prev.find((i) => i.id === item.id);
      if (existing) {
        return prev.map((i) =>
          i.id === item.id ? { ...i, quantity: i.quantity + 1 } : i
        );
      }
      return [...prev, { ...item, quantity: 1 }];
    });
  };

  // ✅ ลดของ (-1)
  const decreaseCart = (id: number) => {
    setCart((prev) => {
      return prev.map((item) => {
        if (item.id === id) {
          return { ...item, quantity: item.quantity - 1 };
        }
        return item;
      }).filter((item) => item.quantity > 0); // ถ้าเหลือ 0 ให้ลบออก
    });
  };

  // ลบออกทั้งหมด (Trash)
  const removeFromCart = (id: number) => {
    setCart((prev) => prev.filter((item) => item.id !== id));
  };

  const clearCart = () => setCart([]);

  const totalItems = cart.reduce((sum, item) => sum + item.quantity, 0);
  const totalPoints = cart.reduce((sum, item) => sum + (item.points * item.quantity), 0);

  return (
    <CartContext.Provider value={{ cart, addToCart, decreaseCart, removeFromCart, clearCart, totalItems, totalPoints }}>
      {children}
    </CartContext.Provider>
  );
}

export function useCart() {
  const context = useContext(CartContext);
  if (!context) {
    throw new Error('useCart must be used within a CartProvider');
  }
  return context;
}