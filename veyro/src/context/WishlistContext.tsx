"use client";

import React, { createContext, useContext, useState, useEffect, useCallback } from "react";
import { Product } from "@/types";

interface WishlistContextType {
  items: Product[];
  totalWishlistItems: number;
  itemSizes: Record<string, string>;
  isWishlistOpen: boolean;
  openWishlist: () => void;
  closeWishlist: () => void;
  toggleWishlistDrawer: () => void;
  isInWishlist: (productId: string) => boolean;
  addToWishlist: (product: Product, size?: string) => void;
  removeFromWishlist: (productId: string) => void;
  toggleWishlist: (product: Product, size?: string) => void;
  setItemSize: (productId: string, size: string) => void;
  clearWishlist: () => void;
}

const WishlistContext = createContext<WishlistContextType | undefined>(undefined);

const STORAGE_KEY = "veyro_wishlist_v1";
const SIZES_STORAGE_KEY = "veyro_wishlist_sizes_v1";

export function WishlistProvider({ children }: { children: React.ReactNode }) {
  const [items, setItems] = useState<Product[]>([]);
  const [itemSizes, setItemSizes] = useState<Record<string, string>>({});
  const [isWishlistOpen, setIsWishlistOpen] = useState(false);
  const [isHydrated, setIsHydrated] = useState(false);

  // Hydrate wishlist & chosen sizes from localStorage on mount (SSR safe)
  useEffect(() => {
    try {
      const saved = localStorage.getItem(STORAGE_KEY);
      if (saved) {
        const parsed = JSON.parse(saved);
        if (Array.isArray(parsed)) {
          setItems(parsed);
        }
      }

      const savedSizes = localStorage.getItem(SIZES_STORAGE_KEY);
      if (savedSizes) {
        const parsedSizes = JSON.parse(savedSizes);
        if (parsedSizes && typeof parsedSizes === "object") {
          setItemSizes(parsedSizes);
        }
      }
    } catch (e) {
      console.warn("Failed to read wishlist data from localStorage", e);
    }
    setIsHydrated(true);
  }, []);

  // Sync items with localStorage whenever items change after hydration
  useEffect(() => {
    if (!isHydrated) return;
    try {
      localStorage.setItem(STORAGE_KEY, JSON.stringify(items));
    } catch (e) {
      console.warn("Failed to save wishlist items to localStorage", e);
    }
  }, [items, isHydrated]);

  // Sync itemSizes with localStorage whenever sizes change after hydration
  useEffect(() => {
    if (!isHydrated) return;
    try {
      localStorage.setItem(SIZES_STORAGE_KEY, JSON.stringify(itemSizes));
    } catch (e) {
      console.warn("Failed to save wishlist sizes to localStorage", e);
    }
  }, [itemSizes, isHydrated]);

  const openWishlist = useCallback(() => {
    setIsWishlistOpen(true);
  }, []);

  const closeWishlist = useCallback(() => {
    setIsWishlistOpen(false);
  }, []);

  const toggleWishlistDrawer = useCallback(() => {
    setIsWishlistOpen((prev) => !prev);
  }, []);

  const isInWishlist = useCallback(
    (productId: string) => {
      return items.some((item) => item.id === productId);
    },
    [items]
  );

  const setItemSize = useCallback((productId: string, size: string) => {
    setItemSizes((prev) => ({ ...prev, [productId]: size }));
  }, []);

  const addToWishlist = useCallback((product: Product, size?: string) => {
    setItems((prev) => {
      if (prev.some((item) => item.id === product.id)) return prev;
      return [product, ...prev];
    });

    if (size) {
      setItemSizes((prev) => ({ ...prev, [product.id]: size }));
    } else if (product.sizes && product.sizes.length > 0) {
      setItemSizes((prev) => {
        if (!prev[product.id]) {
          return { ...prev, [product.id]: product.sizes[0] };
        }
        return prev;
      });
    }
  }, []);

  const removeFromWishlist = useCallback((productId: string) => {
    setItems((prev) => prev.filter((item) => item.id !== productId));
    setItemSizes((prev) => {
      const next = { ...prev };
      delete next[productId];
      return next;
    });
  }, []);

  const toggleWishlist = useCallback((product: Product, size?: string) => {
    setItems((prev) => {
      const exists = prev.some((item) => item.id === product.id);
      if (exists) {
        setItemSizes((s) => {
          const next = { ...s };
          delete next[product.id];
          return next;
        });
        return prev.filter((item) => item.id !== product.id);
      } else {
        const preferredSize =
          size || (product.sizes && product.sizes.length > 0 ? product.sizes[0] : "Standard");
        setItemSizes((s) => ({ ...s, [product.id]: preferredSize }));
        return [product, ...prev];
      }
    });
  }, []);

  const clearWishlist = useCallback(() => {
    setItems([]);
    setItemSizes({});
  }, []);

  return (
    <WishlistContext.Provider
      value={{
        items,
        totalWishlistItems: items.length,
        itemSizes,
        isWishlistOpen,
        openWishlist,
        closeWishlist,
        toggleWishlistDrawer,
        isInWishlist,
        addToWishlist,
        removeFromWishlist,
        toggleWishlist,
        setItemSize,
        clearWishlist,
      }}
    >
      {children}
    </WishlistContext.Provider>
  );
}

export function useWishlist() {
  const context = useContext(WishlistContext);
  if (!context) {
    throw new Error("useWishlist must be used within a WishlistProvider");
  }
  return context;
}
