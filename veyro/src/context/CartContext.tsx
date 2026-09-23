"use client";

import React, {
  createContext,
  useContext,
  useState,
  useEffect,
  useMemo,
  useCallback,
} from "react";
import { Product } from "@/types";

export interface CartItem {
  product: Product;
  selectedSize: string;
  quantity: number;
}

export type CartViewMode = "bag" | "checkout" | "success";

interface CartContextType {
  items: CartItem[];
  totalItems: number;
  subtotal: number;
  bundleDiscount: number;
  finalSubtotal: number;
  qualifyingTeesCount: number;
  teesNeededForBundle: number;
  bundleCount: number;
  freeShippingThreshold: number;
  amountUntilFreeShipping: number;
  hasFreeShipping: boolean;
  isCartOpen: boolean;
  cartView: CartViewMode;
  setCartView: (view: CartViewMode) => void;
  openCart: () => void;
  closeCart: () => void;
  toggleCart: () => void;
  openCheckout: () => void;
  addToCart: (
    product: Product,
    selectedSize: string,
    quantity?: number,
    autoOpen?: boolean
  ) => void;
  removeFromCart: (productId: string, selectedSize: string) => void;
  updateQuantity: (productId: string, selectedSize: string, quantity: number) => void;
  appliedCoupon: string | null;
  couponDiscount: number;
  applyCoupon: (code: string) => { success: boolean; message: string };
  removeCoupon: () => void;
  clearCart: () => void;
}

const CartContext = createContext<CartContextType | undefined>(undefined);

const STORAGE_KEY = "veyro_cart_v1";
const COUPON_STORAGE_KEY = "veyro_applied_coupon";
const FREE_SHIPPING_THRESHOLD = 999;

export function CartProvider({ children }: { children: React.ReactNode }) {
  const [items, setItems] = useState<CartItem[]>([]);
  const [appliedCoupon, setAppliedCoupon] = useState<string | null>(null);
  const [isCartOpen, setIsCartOpen] = useState(false);
  const [cartView, setCartView] = useState<CartViewMode>("bag");
  const [isHydrated, setIsHydrated] = useState(false);

  // Hydrate cart from localStorage on mount (SSR safe)
  useEffect(() => {
    try {
      const saved = localStorage.getItem(STORAGE_KEY);
      if (saved) {
        const parsed = JSON.parse(saved);
        if (Array.isArray(parsed)) {
          setItems(parsed);
        }
      }
      const savedCoupon = localStorage.getItem(COUPON_STORAGE_KEY);
      if (savedCoupon) {
        setAppliedCoupon(savedCoupon);
      }
    } catch (e) {
      console.warn("Failed to read cart from localStorage", e);
    }
    setIsHydrated(true);
  }, []);

  // Persist cart updates to localStorage
  useEffect(() => {
    if (!isHydrated) return;
    try {
      localStorage.setItem(STORAGE_KEY, JSON.stringify(items));
    } catch (e) {
      console.warn("Failed to persist cart to localStorage", e);
    }
  }, [items, isHydrated]);

  const openCart = useCallback(() => {
    setCartView("bag");
    setIsCartOpen(true);
  }, []);

  const openCheckout = useCallback(() => {
    setCartView("checkout");
    setIsCartOpen(true);
  }, []);

  const closeCart = useCallback(() => setIsCartOpen(false), []);
  const toggleCart = useCallback(() => setIsCartOpen((prev) => !prev), []);

  const addToCart = useCallback(
    (
      product: Product,
      selectedSize: string,
      quantity: number = 1,
      autoOpen: boolean = true
    ) => {
      setItems((prev) => {
        const existingIndex = prev.findIndex(
          (item) => item.product.id === product.id && item.selectedSize === selectedSize
        );

        if (existingIndex > -1) {
          const updated = [...prev];
          updated[existingIndex] = {
            ...updated[existingIndex],
            quantity: updated[existingIndex].quantity + quantity,
          };
          return updated;
        }

        return [...prev, { product, selectedSize, quantity }];
      });

      if (autoOpen) {
        setCartView("bag");
        setIsCartOpen(true);
      }
    },
    []
  );

  const removeFromCart = useCallback((productId: string, selectedSize: string) => {
    setItems((prev) =>
      prev.filter(
        (item) => !(item.product.id === productId && item.selectedSize === selectedSize)
      )
    );
  }, []);

  const updateQuantity = useCallback(
    (productId: string, selectedSize: string, quantity: number) => {
      if (quantity <= 0) {
        removeFromCart(productId, selectedSize);
        return;
      }

      setItems((prev) =>
        prev.map((item) => {
          if (item.product.id === productId && item.selectedSize === selectedSize) {
            return { ...item, quantity };
          }
          return item;
        })
      );
    },
    [removeFromCart]
  );

  const clearCart = useCallback(() => setItems([]), []);

  const totalItems = useMemo(
    () => items.reduce((acc, item) => acc + item.quantity, 0),
    [items]
  );

  // ── 3-TEE BUNDLE PASS PRICING ENGINE ("Buy any 3 Archive Tees for ₹1,199") ──
  const {
    qualifyingTeesCount,
    teesNeededForBundle,
    bundleCount,
    bundleDiscount,
    subtotal,
    finalSubtotal,
    couponDiscount,
    amountUntilFreeShipping,
    hasFreeShipping,
  } = useMemo(() => {
    const qualifyingTees = items.filter(
      (item) =>
        item.product.category === "Clothing" ||
        item.product.subcategory === "T-Shirts"
    );

    const qCount = qualifyingTees.reduce(
      (acc, item) => acc + item.quantity,
      0
    );

    const bCount = Math.floor(qCount / 3);
    const needed = qCount % 3 === 0 ? 0 : 3 - (qCount % 3);

    const teePrices: number[] = [];
    qualifyingTees.forEach((item) => {
      for (let i = 0; i < item.quantity; i++) {
        teePrices.push(item.product.price);
      }
    });
    teePrices.sort((a, b) => b - a);

    let bDiscount = 0;
    for (let b = 0; b < bCount; b++) {
      const bundleSum =
        teePrices[b * 3] + teePrices[b * 3 + 1] + teePrices[b * 3 + 2];
      bDiscount += Math.max(0, bundleSum - 1199);
    }

    const sub = items.reduce(
      (acc, item) => acc + item.product.price * item.quantity,
      0
    );
    const fSub = Math.max(0, sub - bDiscount);
    const cDiscount = appliedCoupon ? Math.round(fSub * 0.1) : 0;
    const untilFree = Math.max(0, FREE_SHIPPING_THRESHOLD - fSub);
    const freeShip = fSub >= FREE_SHIPPING_THRESHOLD;

    return {
      qualifyingTeesCount: qCount,
      teesNeededForBundle: needed,
      bundleCount: bCount,
      bundleDiscount: bDiscount,
      subtotal: sub,
      finalSubtotal: fSub,
      couponDiscount: cDiscount,
      amountUntilFreeShipping: untilFree,
      hasFreeShipping: freeShip,
    };
  }, [items, appliedCoupon]);

  const applyCoupon = useCallback((rawCode: string) => {
    const code = rawCode.trim().toUpperCase();
    if (!code) {
      return { success: false, message: "Please enter a coupon code" };
    }
    if (code === "VEYRO10" || code === "VEYRO-VIP10" || code === "ARCHIVE10") {
      setAppliedCoupon(code);
      try {
        localStorage.setItem(COUPON_STORAGE_KEY, code);
      } catch {}
      return { success: true, message: "VIP 10% Inaugural Pass Applied!" };
    }
    return { success: false, message: "Invalid code. Try VEYRO10" };
  }, []);

  const removeCoupon = useCallback(() => {
    setAppliedCoupon(null);
    try {
      localStorage.removeItem(COUPON_STORAGE_KEY);
    } catch {}
  }, []);

  const contextValue = useMemo<CartContextType>(
    () => ({
      items,
      totalItems,
      subtotal,
      bundleDiscount,
      finalSubtotal,
      qualifyingTeesCount,
      teesNeededForBundle,
      bundleCount,
      freeShippingThreshold: FREE_SHIPPING_THRESHOLD,
      amountUntilFreeShipping,
      hasFreeShipping,
      isCartOpen,
      cartView,
      setCartView,
      openCart,
      closeCart,
      toggleCart,
      openCheckout,
      addToCart,
      removeFromCart,
      updateQuantity,
      appliedCoupon,
      couponDiscount,
      applyCoupon,
      removeCoupon,
      clearCart,
    }),
    [
      items,
      totalItems,
      subtotal,
      bundleDiscount,
      finalSubtotal,
      qualifyingTeesCount,
      teesNeededForBundle,
      bundleCount,
      amountUntilFreeShipping,
      hasFreeShipping,
      isCartOpen,
      cartView,
      openCart,
      closeCart,
      toggleCart,
      openCheckout,
      addToCart,
      removeFromCart,
      updateQuantity,
      appliedCoupon,
      couponDiscount,
      applyCoupon,
      removeCoupon,
      clearCart,
    ]
  );

  return (
    <CartContext.Provider value={contextValue}>
      {children}
    </CartContext.Provider>
  );
}

export function useCart() {
  const context = useContext(CartContext);
  if (!context) {
    throw new Error("useCart must be used within a CartProvider");
  }
  return context;
}
