import React, { createContext, useContext, useState, useEffect, useMemo } from 'react';
import type { CartItem, Product, ProductSize, PromoCode } from '../types';
import {
  PROMO_CODES,
  FREE_SHIPPING_THRESHOLD,
  STANDARD_SHIPPING_FEE,
  TAX_RATE,
} from '../data/products';

interface ToastInfo {
  id: string;
  title: string;
  message: string;
  type: 'success' | 'info' | 'error';
}

interface CartContextType {
  items: CartItem[];
  isCartOpen: boolean;
  openCart: () => void;
  closeCart: () => void;
  toggleCart: () => void;
  addToCart: (
    product: Product,
    selectedSize: ProductSize,
    selectedColor: string,
    quantity?: number
  ) => void;
  removeFromCart: (cartItemId: string) => void;
  updateQuantity: (cartItemId: string, newQuantity: number) => void;
  clearCart: () => void;
  appliedPromo: PromoCode | null;
  applyPromo: (code: string) => { success: boolean; message: string };
  removePromo: () => void;
  subtotal: number;
  discount: number;
  shipping: number;
  tax: number;
  total: number;
  totalItemCount: number;
  amountUntilFreeShipping: number;
  freeShippingProgress: number;
  toasts: ToastInfo[];
  dismissToast: (id: string) => void;
}

const CartContext = createContext<CartContextType | undefined>(undefined);

const STORAGE_KEY = 'aurora_cart_items_v1';
const PROMO_STORAGE_KEY = 'aurora_cart_promo_v1';

export const CartProvider: React.FC<{ children: React.ReactNode }> = ({ children }) => {
  const [items, setItems] = useState<CartItem[]>(() => {
    try {
      const saved = localStorage.getItem(STORAGE_KEY);
      return saved ? JSON.parse(saved) : [];
    } catch {
      return [];
    }
  });

  const [appliedPromo, setAppliedPromo] = useState<PromoCode | null>(() => {
    try {
      const saved = localStorage.getItem(PROMO_STORAGE_KEY);
      return saved ? JSON.parse(saved) : null;
    } catch {
      return null;
    }
  });

  const [isCartOpen, setIsCartOpen] = useState(false);
  const [toasts, setToasts] = useState<ToastInfo[]>([]);

  useEffect(() => {
    try {
      localStorage.setItem(STORAGE_KEY, JSON.stringify(items));
    } catch (e) {
      console.error('Failed to save cart to localStorage', e);
    }
  }, [items]);

  useEffect(() => {
    try {
      if (appliedPromo) {
        localStorage.setItem(PROMO_STORAGE_KEY, JSON.stringify(appliedPromo));
      } else {
        localStorage.removeItem(PROMO_STORAGE_KEY);
      }
    } catch (e) {
      console.error('Failed to save promo to localStorage', e);
    }
  }, [appliedPromo]);

  const addToast = (title: string, message: string, type: 'success' | 'info' | 'error' = 'success') => {
    const id = Date.now().toString() + Math.random().toString(36).substring(2, 5);
    setToasts((prev) => [...prev, { id, title, message, type }]);
    setTimeout(() => {
      dismissToast(id);
    }, 3500);
  };

  const dismissToast = (id: string) => {
    setToasts((prev) => prev.filter((t) => t.id !== id));
  };

  const openCart = () => setIsCartOpen(true);
  const closeCart = () => setIsCartOpen(false);
  const toggleCart = () => setIsCartOpen((prev) => !prev);

  const addToCart = (
    product: Product,
    selectedSize: ProductSize,
    selectedColor: string,
    quantity: number = 1
  ) => {
    const cartItemId = `${product.id}-${selectedSize}-${selectedColor}`;

    setItems((prevItems) => {
      const existing = prevItems.find((item) => item.cartItemId === cartItemId);
      if (existing) {
        return prevItems.map((item) =>
          item.cartItemId === cartItemId
            ? { ...item, quantity: item.quantity + quantity }
            : item
        );
      }
      return [
        ...prevItems,
        {
          cartItemId,
          product,
          quantity,
          selectedSize,
          selectedColor,
        },
      ];
    });

    addToast(
      'Added to Cart',
      `${product.title} (${selectedSize}) is now in your cart.`,
      'success'
    );
  };

  const removeFromCart = (cartItemId: string) => {
    const item = items.find((i) => i.cartItemId === cartItemId);
    setItems((prev) => prev.filter((i) => i.cartItemId !== cartItemId));
    if (item) {
      addToast('Removed Item', `${item.product.title} was removed.`, 'info');
    }
  };

  const updateQuantity = (cartItemId: string, newQuantity: number) => {
    if (newQuantity <= 0) {
      removeFromCart(cartItemId);
      return;
    }
    setItems((prev) =>
      prev.map((item) =>
        item.cartItemId === cartItemId ? { ...item, quantity: newQuantity } : item
      )
    );
  };

  const clearCart = () => {
    setItems([]);
    setAppliedPromo(null);
    addToast('Cart Cleared', 'All items were removed from your shopping bag.', 'info');
  };

  const applyPromo = (rawCode: string) => {
    const clean = rawCode.trim().toUpperCase();
    const promo = PROMO_CODES[clean];

    if (!promo) {
      addToast('Invalid Coupon', 'That promo code is not recognized.', 'error');
      return { success: false, message: 'Invalid promo code. Try "AURORA20"' };
    }

    if (clean === 'VIP30' && subtotal < 150) {
      addToast('Minimum Order Required', 'VIP30 requires an order of $150 or more.', 'error');
      return { success: false, message: 'VIP30 requires a subtotal of $150+' };
    }

    setAppliedPromo(promo);
    addToast('Coupon Applied!', `${promo.discountPercentage}% discount unlocked!`, 'success');
    return { success: true, message: `Applied ${promo.discountPercentage}% off!` };
  };

  const removePromo = () => {
    setAppliedPromo(null);
    addToast('Coupon Removed', 'Promo discount was removed.', 'info');
  };

  const { subtotal, totalItemCount } = useMemo(() => {
    return items.reduce(
      (acc, item) => ({
        subtotal: acc.subtotal + item.product.price * item.quantity,
        totalItemCount: acc.totalItemCount + item.quantity,
      }),
      { subtotal: 0, totalItemCount: 0 }
    );
  }, [items]);

  const discount = useMemo(() => {
    if (!appliedPromo || subtotal === 0) return 0;
    return (subtotal * appliedPromo.discountPercentage) / 100;
  }, [appliedPromo, subtotal]);

  const discountedSubtotal = Math.max(0, subtotal - discount);

  const shipping = useMemo(() => {
    if (subtotal === 0) return 0;
    return discountedSubtotal >= FREE_SHIPPING_THRESHOLD ? 0 : STANDARD_SHIPPING_FEE;
  }, [subtotal, discountedSubtotal]);

  const tax = useMemo(() => {
    return discountedSubtotal * TAX_RATE;
  }, [discountedSubtotal]);

  const total = useMemo(() => {
    if (subtotal === 0) return 0;
    return discountedSubtotal + shipping + tax;
  }, [subtotal, discountedSubtotal, shipping, tax]);

  const amountUntilFreeShipping = useMemo(() => {
    return Math.max(0, FREE_SHIPPING_THRESHOLD - discountedSubtotal);
  }, [discountedSubtotal]);

  const freeShippingProgress = useMemo(() => {
    if (discountedSubtotal >= FREE_SHIPPING_THRESHOLD) return 100;
    return Math.min(100, (discountedSubtotal / FREE_SHIPPING_THRESHOLD) * 100);
  }, [discountedSubtotal]);

  return (
    <CartContext.Provider
      value={{
        items,
        isCartOpen,
        openCart,
        closeCart,
        toggleCart,
        addToCart,
        removeFromCart,
        updateQuantity,
        clearCart,
        appliedPromo,
        applyPromo,
        removePromo,
        subtotal,
        discount,
        shipping,
        tax,
        total,
        totalItemCount,
        amountUntilFreeShipping,
        freeShippingProgress,
        toasts,
        dismissToast,
      }}
    >
      {children}
    </CartContext.Provider>
  );
};

export const useCart = () => {
  const context = useContext(CartContext);
  if (!context) {
    throw new Error('useCart must be used within a CartProvider');
  }
  return context;
};
