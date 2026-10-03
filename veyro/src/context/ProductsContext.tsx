"use client";

import React, { createContext, useContext, useState, useEffect, useCallback, useMemo } from "react";
import type { Product } from "@/types";
import { products as seedProducts } from "@/data/products";

interface ProductsContextType {
  products: Product[];
  isHydrated: boolean;
  addProduct: (product: Product) => void;
  updateProduct: (id: string, updates: Partial<Product>) => void;
  deleteProduct: (id: string) => void;
  getProductById: (id: string) => Product | undefined;
  getProductBySlug: (slug: string) => Product | undefined;
  resetToDefaults: () => void;
}

const ProductsContext = createContext<ProductsContextType | undefined>(undefined);

const STORAGE_KEY = "veyro_products_v1";

export function ProductsProvider({ children }: { children: React.ReactNode }) {
  const [products, setProducts] = useState<Product[]>(seedProducts);
  const [isHydrated, setIsHydrated] = useState(false);

  // Hydrate from localStorage on mount (SSR safe)
  useEffect(() => {
    try {
      const saved = localStorage.getItem(STORAGE_KEY);
      if (saved) {
        const parsed = JSON.parse(saved);
        if (Array.isArray(parsed) && parsed.length > 0) {
          setProducts(parsed);
        }
      }
    } catch (e) {
      console.warn("Failed to read products from localStorage", e);
    }
    setIsHydrated(true);
  }, []);

  // Multi-tab real-time sync & window focus sync
  useEffect(() => {
    const handleStorage = (e: StorageEvent) => {
      if (e.key === STORAGE_KEY && e.newValue) {
        try {
          const parsed = JSON.parse(e.newValue);
          if (Array.isArray(parsed) && parsed.length > 0) {
            setProducts(parsed);
          }
        } catch (err) {
          console.warn("Failed to parse storage sync products", err);
        }
      }
    };
    const handleFocus = () => {
      try {
        const saved = localStorage.getItem(STORAGE_KEY);
        if (saved) {
          const parsed = JSON.parse(saved);
          if (Array.isArray(parsed) && parsed.length > 0) {
            setProducts(parsed);
          }
        }
      } catch (err) {
        console.warn("Failed to reload products on focus", err);
      }
    };
    window.addEventListener("storage", handleStorage);
    window.addEventListener("focus", handleFocus);
    return () => {
      window.removeEventListener("storage", handleStorage);
      window.removeEventListener("focus", handleFocus);
    };
  }, []);

  // Persist to localStorage when products change
  useEffect(() => {
    if (!isHydrated) return;
    try {
      localStorage.setItem(STORAGE_KEY, JSON.stringify(products));
    } catch (e) {
      console.warn("Failed to save products to localStorage", e);
      if (e instanceof DOMException && e.name === "QuotaExceededError") {
        alert("⚠️ localStorage is full! Consider removing products with large base64 images.");
      }
    }
  }, [products, isHydrated]);

  const addProduct = useCallback((product: Product) => {
    setProducts((prev) => [product, ...prev]);
  }, []);

  const updateProduct = useCallback((id: string, updates: Partial<Product>) => {
    setProducts((prev) =>
      prev.map((p) => (p.id === id ? { ...p, ...updates } : p))
    );
  }, []);

  const deleteProduct = useCallback((id: string) => {
    setProducts((prev) => prev.filter((p) => p.id !== id));
  }, []);

  const getProductById = useCallback(
    (id: string) => products.find((p) => p.id === id),
    [products]
  );

  const getProductBySlug = useCallback(
    (slug: string) => products.find((p) => p.slug === slug),
    [products]
  );

  const resetToDefaults = useCallback(() => {
    setProducts(seedProducts);
  }, []);

  const value = useMemo<ProductsContextType>(
    () => ({
      products,
      isHydrated,
      addProduct,
      updateProduct,
      deleteProduct,
      getProductById,
      getProductBySlug,
      resetToDefaults,
    }),
    [products, isHydrated, addProduct, updateProduct, deleteProduct, getProductById, getProductBySlug, resetToDefaults]
  );

  return (
    <ProductsContext.Provider value={value}>
      {children}
    </ProductsContext.Provider>
  );
}

export function useProducts() {
  const context = useContext(ProductsContext);
  if (!context) {
    throw new Error("useProducts must be used within a ProductsProvider");
  }
  return context;
}
