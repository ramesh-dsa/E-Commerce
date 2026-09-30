"use client";

import React, { useState, useEffect, useMemo, useCallback, useRef } from "react";
import Image from "next/image";
import Link from "next/link";
import { useRouter } from "next/navigation";
import { useCart } from "@/context/CartContext";
import { useUser } from "@/context/UserContext";
import { formatPrice } from "@/lib/utils";
import {
  X,
  Plus,
  Minus,
  Trash2,
  ShoppingBag,
  ShieldCheck,
  ArrowRight,
  Truck,
  Check,
  ChevronLeft,
  CheckCircle2,
  Lock,
  Package,
} from "lucide-react";

export function CartDrawer() {
  const {
    items,
    totalItems,
    freeShippingThreshold,
    isCartOpen,
    cartView,
    setCartView,
    appliedCoupon,
    applyCoupon,
    removeCoupon,
    closeCart,
    updateQuantity,
    removeFromCart,
  } = useCart();

  const { addOrder } = useUser();
  const router = useRouter();

  const [couponInput, setCouponInput] = useState("");
  const [couponMessage, setCouponMessage] = useState<{ text: string; isError: boolean } | null>(null);
  const [isTruckDriving, setIsTruckDriving] = useState(false);
  const [isClosing, setIsClosing] = useState(false);
  const [viewTransitionDir, setViewTransitionDir] = useState<"forward" | "back">("forward");

  // ── SELECTION STATE ──────────────────────────────────────────────────────
  const makeKey = (productId: string, size: string) => `${productId}::${size}`;
  const [selectedKeys, setSelectedKeys] = useState<Set<string>>(new Set());

  // ── OPTIMISTIC QUANTITY DEBOUNCE ENGINE (120fps Silky Tapping) ──────────
  const [optimisticQuantities, setOptimisticQuantities] = useState<Record<string, number>>({});
  const debounceTimersRef = useRef<Record<string, NodeJS.Timeout>>({});
  const [bumpVersions, setBumpVersions] = useState<Record<string, number>>({});
  const [exitingKeys, setExitingKeys] = useState<Set<string>>(new Set());

  // Sync optimistic quantities when items array changes (unless a local debounce is in progress)
  useEffect(() => {
    setOptimisticQuantities((prev) => {
      const next: Record<string, number> = { ...prev };
      items.forEach((item) => {
        const key = makeKey(item.product.id, item.selectedSize);
        if (!debounceTimersRef.current[key]) {
          next[key] = item.quantity;
        }
      });
      Object.keys(next).forEach((key) => {
        if (!items.some((item) => makeKey(item.product.id, item.selectedSize) === key)) {
          delete next[key];
        }
      });
      return next;
    });
  }, [items]);

  // Clean up debounce timers on unmount
  useEffect(() => {
    const timers = debounceTimersRef.current;
    return () => {
      Object.values(timers).forEach((t) => clearTimeout(t));
    };
  }, []);

  // Flush any in-flight quantity updates immediately to global state
  const flushPendingDebounces = useCallback(() => {
    Object.entries(debounceTimersRef.current).forEach(([key, timer]) => {
      clearTimeout(timer);
      delete debounceTimersRef.current[key];
      const [productId, selectedSize] = key.split("::");
      const qty = optimisticQuantities[key];
      if (productId && selectedSize && typeof qty === "number" && qty > 0) {
        updateQuantity(productId, selectedSize, qty);
      }
    });
  }, [optimisticQuantities, updateQuantity]);

  // Buttery-smooth animated item removal (no jarring instant jump)
  const handleSmoothRemove = useCallback(
    (productId: string, selectedSize: string) => {
      const key = makeKey(productId, selectedSize);
      if (exitingKeys.has(key)) return;

      if (debounceTimersRef.current[key]) {
        clearTimeout(debounceTimersRef.current[key]);
        delete debounceTimersRef.current[key];
      }

      setExitingKeys((prev) => new Set(prev).add(key));

      setTimeout(() => {
        removeFromCart(productId, selectedSize);
        setExitingKeys((prev) => {
          const next = new Set(prev);
          next.delete(key);
          return next;
        });
      }, 240);
    },
    [exitingKeys, removeFromCart]
  );

  const handleOptimisticQuantity = useCallback(
    (productId: string, selectedSize: string, delta: number) => {
      const key = makeKey(productId, selectedSize);
      const currentQty =
        optimisticQuantities[key] ??
        items.find((i) => i.product.id === productId && i.selectedSize === selectedSize)?.quantity ??
        1;

      const newQty = Math.max(0, currentQty + delta);

      // Trigger tactile haptic pulse on every tap with a fresh version counter
      setBumpVersions((prev) => ({ ...prev, [key]: (prev[key] || 0) + 1 }));

      // If user reduces to 0, smoothly slide away and remove
      if (newQty === 0) {
        handleSmoothRemove(productId, selectedSize);
        return;
      }

      // Update optimistic state INSTANTANEOUSLY (0ms latency, silky 120fps)
      setOptimisticQuantities((prev) => ({ ...prev, [key]: newQty }));

      // Debounce global context & localStorage write by 220ms
      if (debounceTimersRef.current[key]) {
        clearTimeout(debounceTimersRef.current[key]);
      }
      debounceTimersRef.current[key] = setTimeout(() => {
        updateQuantity(productId, selectedSize, newQty);
        delete debounceTimersRef.current[key];
      }, 220);
    },
    [optimisticQuantities, items, handleSmoothRemove, updateQuantity]
  );

  // Auto-sync selectedKeys when items change without wiping user selections on quantity updates
  useEffect(() => {
    setSelectedKeys((prev) => {
      const validItemKeys = new Set(items.map((i) => makeKey(i.product.id, i.selectedSize)));
      if (prev.size === 0) return validItemKeys;
      const next = new Set<string>();
      items.forEach((i) => {
        const k = makeKey(i.product.id, i.selectedSize);
        if (prev.has(k)) next.add(k);
      });
      return next.size > 0 ? next : validItemKeys;
    });
  }, [items]);

  const toggleItem = useCallback((key: string) => {
    setSelectedKeys((prev) => {
      const next = new Set(prev);
      if (next.has(key)) next.delete(key);
      else next.add(key);
      return next;
    });
  }, []);

  const allSelected = items.length > 0 && selectedKeys.size === items.length;
  const toggleSelectAll = useCallback(() => {
    if (allSelected) {
      setSelectedKeys(new Set());
    } else {
      setSelectedKeys(new Set(items.map((i) => makeKey(i.product.id, i.selectedSize))));
    }
  }, [allSelected, items]);

  // Derived display items reflecting optimistic quantities in real-time
  const displayItems = useMemo(() => {
    return items.map((item) => {
      const key = makeKey(item.product.id, item.selectedSize);
      const qty = optimisticQuantities[key] ?? item.quantity;
      return { ...item, quantity: qty };
    });
  }, [items, optimisticQuantities]);

  // ── LUXURY MICRO-SCROLLBAR (120fps Hardware Accelerated) ──────────────────
  const itemsScrollRef = useRef<HTMLDivElement>(null);
  const scrollbarTrackRef = useRef<HTMLDivElement>(null);
  const thumbRef = useRef<HTMLDivElement>(null);
  const bottomIndicatorRef = useRef<HTMLDivElement>(null);
  const scrollTimerRef = useRef<NodeJS.Timeout | null>(null);
  const isScrollingRef = useRef(false);

  const updateScrollMetrics = useCallback(() => {
    const el = itemsScrollRef.current;
    if (!el) return;
    const { scrollTop, scrollHeight, clientHeight } = el;
    const maxScroll = scrollHeight - clientHeight;
    const overflow = maxScroll > 6;

    // Direct DOM manipulation bypasses React render cycle for 0-latency feedback
    if (bottomIndicatorRef.current) {
      const hasMore = overflow && scrollTop < maxScroll - 10;
      bottomIndicatorRef.current.style.opacity = hasMore ? "1" : "0";
    }

    if (scrollbarTrackRef.current) {
      if (!overflow) {
        scrollbarTrackRef.current.style.opacity = "0";
      } else if (isScrollingRef.current) {
        scrollbarTrackRef.current.style.opacity = "1";
      }
    }

    if (overflow && thumbRef.current) {
      const calculatedThumb = Math.max(30, Math.min(100, (clientHeight / scrollHeight) * clientHeight));
      const availableTrack = clientHeight - calculatedThumb - 24;
      const ratio = Math.max(0, Math.min(1, scrollTop / maxScroll));
      const progress = ratio * availableTrack;
      
      thumbRef.current.style.height = `${calculatedThumb}px`;
      thumbRef.current.style.transform = `translate3d(0, ${progress}px, 0)`;
    }
  }, []);

  const handleScroll = useCallback(() => {
    if (!isScrollingRef.current) {
      isScrollingRef.current = true;
      if (scrollbarTrackRef.current) scrollbarTrackRef.current.style.opacity = "1";
    }
    
    // Decouple scroll events from React state entirely using rAF
    requestAnimationFrame(() => {
      updateScrollMetrics();
    });

    if (scrollTimerRef.current) {
      clearTimeout(scrollTimerRef.current);
    }
    scrollTimerRef.current = setTimeout(() => {
      isScrollingRef.current = false;
      if (scrollbarTrackRef.current) scrollbarTrackRef.current.style.opacity = "0";
    }, 850);
  }, [updateScrollMetrics]);

  useEffect(() => {
    const t = setTimeout(updateScrollMetrics, 50);
    return () => clearTimeout(t);
  }, [displayItems, isCartOpen, updateScrollMetrics]);

  useEffect(() => {
    return () => {
      if (scrollTimerRef.current) clearTimeout(scrollTimerRef.current);
    };
  }, []);

  // ── SELECTED ITEMS DERIVED CALCULATIONS (MEMOIZED & INSTANT) ───────────
  const selectedItems = useMemo(() => {
    return displayItems.filter((i) =>
      selectedKeys.has(makeKey(i.product.id, i.selectedSize))
    );
  }, [displayItems, selectedKeys]);

  const {
    selectedCount,
    selectedSubtotal,
    selectedBundleDiscount,
    selectedBundleCount,
    selectedFinalSubtotal,
    selectedCouponDiscount,
    selectedHasFreeShipping,
    selectedAmountUntilFree,
    selectedProgressPercent,
    selectedFinalTotal,
  } = useMemo(() => {
    const count = selectedItems.reduce((acc, i) => acc + i.quantity, 0);

    const tees = selectedItems.filter(
      (i) => i.product.category === "Clothing" || i.product.subcategory === "T-Shirts"
    );
    const teesCount = tees.reduce((acc, i) => acc + i.quantity, 0);
    const bundleCount = Math.floor(teesCount / 3);
    const teePrices: number[] = [];
    tees.forEach((item) => {
      for (let i = 0; i < item.quantity; i++) teePrices.push(item.product.price);
    });
    teePrices.sort((a, b) => b - a);
    let bundleDiscount = 0;
    for (let b = 0; b < bundleCount; b++) {
      const bundleSum = teePrices[b * 3] + teePrices[b * 3 + 1] + teePrices[b * 3 + 2];
      bundleDiscount += Math.max(0, bundleSum - 1199);
    }

    const subtotal = selectedItems.reduce(
      (acc, i) => acc + i.product.price * i.quantity,
      0
    );
    const finalSubtotal = Math.max(0, subtotal - bundleDiscount);
    const couponDiscount = appliedCoupon ? Math.round(finalSubtotal * 0.1) : 0;
    const hasFreeShipping = finalSubtotal >= freeShippingThreshold;
    const amountUntilFree = Math.max(0, freeShippingThreshold - finalSubtotal);
    const progressPercent = Math.min(
      100,
      Math.round((finalSubtotal / freeShippingThreshold) * 100)
    );
    const finalTotal = count === 0
      ? 0
      : Math.max(
          0,
          (hasFreeShipping ? finalSubtotal : finalSubtotal + 99) - couponDiscount
        );

    return {
      selectedCount: count,
      selectedSubtotal: subtotal,
      selectedBundleDiscount: bundleDiscount,
      selectedBundleCount: bundleCount,
      selectedFinalSubtotal: finalSubtotal,
      selectedCouponDiscount: couponDiscount,
      selectedHasFreeShipping: hasFreeShipping,
      selectedAmountUntilFree: amountUntilFree,
      selectedProgressPercent: progressPercent,
      selectedFinalTotal: finalTotal,
    };
  }, [selectedItems, appliedCoupon, freeShippingThreshold]);

  const handleProceedToCheckout = () => {
    if (selectedCount === 0 || isTruckDriving) return;
    flushPendingDebounces();
    setIsTruckDriving(true);
    setTimeout(() => {
      setViewTransitionDir("forward");
      setCartView("checkout");
      setIsTruckDriving(false);
    }, 1050);
  };

  const handleClose = useCallback(() => {
    if (isClosing) return;
    flushPendingDebounces();
    setIsClosing(true);
    setTimeout(() => {
      closeCart();
      setIsClosing(false);
    }, 260);
  }, [isClosing, flushPendingDebounces, closeCart]);

  useEffect(() => {
    if (isCartOpen) {
      setIsClosing(false);
    }
  }, [isCartOpen]);

  // Checkout Form State
  const [formData, setFormData] = useState({
    name: "",
    phone: "",
    pincode: "",
    address: "",
    paymentMethod: "upi",
  });
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [confirmedOrderId, setConfirmedOrderId] = useState<string | null>(null);

  useEffect(() => {
    const onKeyDown = (e: KeyboardEvent) => {
      if (e.key === "Escape" && isCartOpen) handleClose();
    };
    window.addEventListener("keydown", onKeyDown);
    return () => window.removeEventListener("keydown", onKeyDown);
  }, [isCartOpen, handleClose]);

  useEffect(() => {
    document.body.style.overflow = isCartOpen ? "hidden" : "";
    return () => { document.body.style.overflow = ""; };
  }, [isCartOpen]);

  if (!isCartOpen && !isClosing) return null;

  const handleCheckoutSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    setIsSubmitting(true);
    setTimeout(() => {
      setIsSubmitting(false);
      const generatedId = `VEY-${new Date().getFullYear()}-${Math.floor(10000 + Math.random() * 90000)}`;
      setConfirmedOrderId(generatedId);

      const now = new Date();
      const timestamp = now.toLocaleString("en-IN", {
        day: "2-digit",
        month: "short",
        year: "numeric",
        hour: "2-digit",
        minute: "2-digit",
        hour12: true,
      });

      const shippingCost = selectedHasFreeShipping ? 0 : 99;

      addOrder({
        id: generatedId,
        date: "Just now",
        total: selectedFinalTotal,
        subtotal: selectedSubtotal,
        bundleDiscount: selectedBundleDiscount,
        couponDiscount: selectedCouponDiscount,
        couponCode: appliedCoupon,
        shippingCost,
        itemsCount: selectedCount,
        items: selectedItems.map((i) => ({
          productId: i.product.id,
          productName: i.product.name,
          productSlug: i.product.slug,
          imageUrl: i.product.imageUrl,
          colorName: i.product.colorName,
          selectedSize: i.selectedSize,
          quantity: i.quantity,
          unitPrice: i.product.price,
          totalPrice: i.product.price * i.quantity,
        })),
        itemNames: selectedItems.map((i) => `${i.product.name} (${i.selectedSize})`),
        status: "Confirmed",
        estimatedDelivery: "Delivery in 2-3 Days",
        timeline: [
          {
            status: "Confirmed",
            timestamp,
            description: "Order placed successfully",
          },
        ],
        shippingAddress: {
          name: formData.name,
          phone: formData.phone,
          address: formData.address,
          pincode: formData.pincode,
        },
        paymentMethod: formData.paymentMethod,
      });
      setCartView("success");
      // Only remove selected items — unselected stay in bag
      selectedItems.forEach((i) => removeFromCart(i.product.id, i.selectedSize));
    }, 850);
  };

  return (
    <div className="fixed inset-0 z-50 flex justify-end select-none" data-lenis-prevent="true">
      {/* Backdrop with silky fade */}
      <div
        className={`fixed inset-0 bg-black/60 backdrop-blur-xs transition-opacity duration-260 ease-out ${
          isClosing ? "opacity-0 pointer-events-none" : "opacity-100"
        }`}
        onClick={handleClose}
        aria-hidden="true"
        data-lenis-prevent="true"
      />

      {/* Drawer with GPU-accelerated 120fps glide */}
      <aside
        aria-label="Shopping Bag and Checkout Drawer"
        data-lenis-prevent="true"
        className={`relative w-full max-w-[460px] h-full bg-white text-[#111111] shadow-2xl flex flex-col z-10 overscroll-contain transform-gpu ${
          isClosing ? "animate-drawer-out" : "animate-drawer-in"
        }`}
      >
        {/* ═══════════════ VIEW 1: BAG ═══════════════ */}
        {cartView === "bag" && (
          <div className={`flex-1 flex flex-col min-h-0 ${viewTransitionDir === "back" ? "animate-view-back" : "animate-view-forward"}`}>
            {/* Header */}
            <div className="flex items-center justify-between px-6 py-5 border-b border-neutral-200">
              <div className="flex items-center gap-2.5">
                <ShoppingBag size={20} className="stroke-[2.2] text-[#111111]" />
                <h2 className="text-base font-black tracking-wider uppercase text-[#111111]">
                  SHOPPING BAG
                </h2>
                <span className="text-xs font-bold px-2 py-0.5 rounded-full bg-[#fcd017] text-[#111111]">
                  {totalItems}
                </span>
              </div>
              <button
                type="button"
                onClick={handleClose}
                aria-label="Close bag"
                className="group p-1.5 rounded-full text-neutral-500 hover:text-black hover:bg-neutral-100 active:scale-90 transition-all duration-200 cursor-pointer focus-visible:outline-hidden focus-visible:ring-2 focus-visible:ring-black motion-reduce:transform-none"
              >
                <X size={20} className="transition-transform duration-300 ease-out group-hover:rotate-90 group-hover:scale-110 motion-reduce:transform-none" />
              </button>
            </div>

            {/* Free Shipping Progress */}
            <div className="bg-[#fafafa] px-6 pt-4 pb-3 border-b border-neutral-200 overflow-hidden relative">
              <div className="flex items-center justify-between text-xs font-bold tracking-tight mb-1.5 relative">
                <span className="flex items-center gap-1.5 text-neutral-700">
                  <span className="relative inline-flex items-center">
                    {/* Launch Exhaust Gas Smoke Puffs */}
                    {isTruckDriving && (
                      <span className="absolute -left-1 top-1/2 -translate-y-1/2 pointer-events-none flex items-center z-20">
                        <span className="w-2.5 h-2.5 rounded-full bg-neutral-400/80 animate-smoke-1 filter blur-[0.4px]" />
                        <span className="w-2 h-2 rounded-full bg-neutral-300/75 animate-smoke-2 filter blur-[0.4px] -ml-1" />
                        <span className="w-1.5 h-1.5 rounded-full bg-[#fcd017]/85 animate-smoke-3 filter blur-[0.4px] -ml-0.5" />
                      </span>
                    )}
                    <span
                      className={`inline-flex items-center z-30 ${
                        isTruckDriving ? "animate-truck-x" : "transition-transform duration-300"
                      }`}
                    >
                      <span
                        className={`inline-flex items-center relative ${
                          isTruckDriving ? "animate-truck-y" : ""
                        }`}
                      >
                        <Truck
                          size={15}
                          className={`transition-colors ${
                            selectedHasFreeShipping ? "text-emerald-700" : "text-[#111111]"
                          }`}
                        />
                        {/* Realistic Automotive Conical Headlight Beam & Lamp Flare */}
                        {isTruckDriving && (
                          <>
                            <span className="absolute left-[13px] top-[7px] w-1 h-1 rounded-full bg-amber-200 shadow-[0_0_4px_#fde047] pointer-events-none z-10" />
                            <span className="headlight-cone absolute left-[13px] top-[0.5px] pointer-events-none animate-headlight origin-left" />
                          </>
                        )}
                      </span>
                    </span>
                  </span>
                  {selectedHasFreeShipping ? (
                    <span
                      className={`text-emerald-700 font-black uppercase tracking-wider flex items-center gap-1 ${
                        isTruckDriving ? "animate-text-glow" : ""
                      }`}
                    >
                      <Check size={13} className="stroke-[3]" />
                      FREE EXPRESS DELIVERY UNLOCKED
                    </span>
                  ) : (
                    <span className={isTruckDriving ? "animate-text-glow" : ""}>
                      Add{" "}
                      <span className="text-black font-black tabular-nums">{formatPrice(selectedAmountUntilFree)}</span>{" "}
                      more for Free Delivery
                    </span>
                  )}
                </span>
                <span className="text-neutral-500 text-[11px] tabular-nums font-mono">{selectedProgressPercent}%</span>
              </div>
              <div className="w-full h-1.5 bg-neutral-200 rounded-full overflow-hidden relative">
                <div
                  className={`h-full transition-[width,background-color] duration-300 ease-out ${
                    selectedHasFreeShipping ? "bg-emerald-500" : "bg-[#fcd017]"
                  }`}
                  style={{ width: `${selectedProgressPercent}%` }}
                />
                {isTruckDriving && (
                  <div className="absolute inset-0 bg-gradient-to-r from-transparent via-white/80 to-transparent animate-ticket-shimmer pointer-events-none" />
                )}
              </div>
            </div>

            {/* Bundle Strip */}
            {selectedBundleDiscount > 0 && (
              <div className="bg-[#fcd017]/15 border-b border-[#fcd017]/50 px-6 py-2.5 flex items-center justify-between text-xs">
                <div className="flex items-center gap-2">
                  <span className="bg-[#fcd017] text-[#111111] text-[9px] font-black px-1.5 py-0.5 rounded-[2px] uppercase tracking-wider">
                    BUNDLE PASS
                  </span>
                  <span className="font-bold text-[#111111] text-xs">
                    3 Archive T-Shirts for ₹1,199 Applied{selectedBundleCount > 1 ? ` (${selectedBundleCount}x)` : ""}
                  </span>
                </div>
                <span className="font-black text-emerald-800 text-xs tabular-nums">
                  -₹{selectedBundleDiscount.toLocaleString("en-IN")}
                </span>
              </div>
            )}

            {/* Items List Wrapper with Luxury iOS Micro-Scrollbar */}
            <div className="relative flex-1 min-h-0 flex flex-col">
              <div
                ref={itemsScrollRef}
                onScroll={handleScroll}
                data-lenis-prevent="true"
                className="flex-1 overflow-y-auto overscroll-contain px-6 py-4 divide-y divide-neutral-100 [scrollbar-width:none] [-ms-overflow-style:none] [&::-webkit-scrollbar]:hidden"
              >
                {items.length === 0 ? (
                  <div className="h-full flex flex-col items-center justify-center text-center py-16">
                    <div className="w-16 h-16 rounded-full bg-neutral-100 flex items-center justify-center mb-4 text-neutral-400">
                      <ShoppingBag size={28} className="stroke-[1.5]" />
                    </div>
                    <h3 className="text-lg font-bold text-neutral-900 mb-1">Your bag is empty</h3>
                    <p className="text-xs text-neutral-500 max-w-[240px] mb-6">
                      Explore our heavyweight collections and find your new everyday uniform.
                    </p>
                    <button
                      type="button"
                      onClick={handleClose}
                      className="inline-flex items-center gap-2 bg-[#111111] text-white text-xs font-bold uppercase tracking-wider px-6 py-3 rounded-[2px] hover:bg-black transition-colors cursor-pointer touch-manipulation"
                    >
                      CONTINUE SHOPPING
                      <ArrowRight size={14} />
                    </button>
                  </div>
                ) : (
                  <>
                    {/* Select All Row */}
                    <div className="pb-3 flex items-center justify-between">
                      <button
                        type="button"
                        onClick={toggleSelectAll}
                        className="flex items-center gap-2.5 group cursor-pointer touch-manipulation select-none"
                        aria-label={allSelected ? "Deselect all items" : "Select all items"}
                      >
                        {/* Custom animated checkbox */}
                        <span
                          className={`w-[18px] h-[18px] rounded-[4px] border-2 flex items-center justify-center transition-all duration-200 ${
                            allSelected
                              ? "bg-[#111111] border-[#111111]"
                              : "border-neutral-400 group-hover:border-[#111111]"
                          }`}
                        >
                          <span
                            className={`transition-all duration-150 ${
                              allSelected ? "opacity-100 scale-100" : "opacity-0 scale-50"
                            }`}
                          >
                            <Check size={11} className="text-white stroke-[3]" />
                          </span>
                        </span>
                        <span className="text-[11px] font-bold uppercase tracking-wider text-neutral-500 group-hover:text-neutral-800 transition-colors">
                          {allSelected ? "Deselect All" : "Select All"}
                        </span>
                      </button>
                      {selectedKeys.size > 0 && selectedKeys.size < items.length && (
                        <span className="text-[10px] text-neutral-400 font-mono tabular-nums">
                          {selectedKeys.size} of {items.length} selected
                        </span>
                      )}
                    </div>

                    {/* Each Item */}
                    {displayItems.map((item) => {
                      const key = makeKey(item.product.id, item.selectedSize);
                      const isSelected = selectedKeys.has(key);
                      const isExiting = exitingKeys.has(key);
                      const bumpVer = bumpVersions[key] || 0;

                      return (
                        <div
                          key={key}
                          className={`py-3.5 px-2.5 -mx-2.5 flex gap-3.5 items-start rounded-[6px] transition-all duration-240 ease-out hover:bg-[#fafaf8] group select-none ${
                            isExiting
                              ? "opacity-0 -translate-x-8 max-h-0 py-0 -my-0 overflow-hidden pointer-events-none scale-95"
                              : "opacity-100 max-h-[140px]"
                          }`}
                        >
                          {/* Premium Checkbox */}
                          <button
                            type="button"
                            onClick={() => toggleItem(key)}
                            aria-label={isSelected ? "Deselect item" : "Select item"}
                            aria-checked={isSelected}
                            role="checkbox"
                            className="mt-1 shrink-0 cursor-pointer group active:scale-75 transition-transform duration-150 motion-reduce:transform-none touch-manipulation"
                          >
                            <span
                              className={`w-5 h-5 rounded-[5px] border-2 flex items-center justify-center transition-all duration-200 ${
                                isSelected
                                  ? "bg-[#111111] border-[#111111] shadow-xs"
                                  : "border-neutral-400 bg-white group-hover:border-[#111111]"
                              }`}
                            >
                              <span
                                className={`transition-all duration-150 ${
                                  isSelected ? "opacity-100 scale-100" : "opacity-0 scale-50"
                                }`}
                              >
                                <Check size={12} className="text-white stroke-[3]" />
                              </span>
                            </span>
                          </button>

                          {/* Thumbnail */}
                          <div className="relative w-20 h-24 bg-[#f4f2ee] rounded-[3px] overflow-hidden shrink-0 border border-neutral-200/80 shadow-2xs">
                            <Image
                              src={item.product.imageUrl}
                              alt={item.product.name}
                              fill
                              sizes="80px"
                              className="object-cover object-center transition-transform duration-300 group-hover:scale-105"
                            />
                          </div>

                          {/* Info */}
                          <div className="flex-1 flex flex-col justify-between self-stretch min-h-[96px]">
                            <div className="flex justify-between items-start gap-2">
                              <div>
                                <Link
                                  href={`/product/${item.product.slug}`}
                                  onClick={handleClose}
                                  className="text-xs font-bold uppercase tracking-tight text-neutral-900 hover:underline line-clamp-1"
                                >
                                  {item.product.name}
                                </Link>
                                <div className="flex items-center gap-2 mt-1 text-[11px] text-neutral-500">
                                  <span>SIZE: <strong className="text-neutral-800">{item.selectedSize}</strong></span>
                                  <span>•</span>
                                  <span>{item.product.colorName}</span>
                                </div>
                              </div>
                              <button
                                type="button"
                                onClick={() => handleSmoothRemove(item.product.id, item.selectedSize)}
                                aria-label="Remove item"
                                className="text-neutral-400 hover:text-red-600 hover:bg-red-50 p-1.5 rounded-full transition-all duration-200 active:scale-85 cursor-pointer touch-manipulation"
                              >
                                <Trash2 size={15} />
                              </button>
                            </div>

                            <div className="flex items-center justify-between mt-auto pt-2">
                              {/* 120fps Silky Stepper */}
                              <div className="flex items-center border border-neutral-300 rounded-[4px] bg-white overflow-hidden shadow-2xs">
                                <button
                                  type="button"
                                  onClick={() => handleOptimisticQuantity(item.product.id, item.selectedSize, -1)}
                                  className="w-7 h-7 flex items-center justify-center text-neutral-600 hover:text-black hover:bg-neutral-100 active:scale-90 active:bg-neutral-200 transition-all duration-100 cursor-pointer select-none touch-manipulation"
                                  aria-label="Decrease quantity"
                                >
                                  <Minus size={12} className="stroke-[2.5]" />
                                </button>
                                <span
                                  key={`${key}-${bumpVer}`}
                                  className="w-7 text-center text-xs font-bold text-neutral-900 select-none tabular-nums animate-qty-pop"
                                >
                                  {item.quantity}
                                </span>
                                <button
                                  type="button"
                                  onClick={() => handleOptimisticQuantity(item.product.id, item.selectedSize, 1)}
                                  className="w-7 h-7 flex items-center justify-center text-neutral-600 hover:text-black hover:bg-neutral-100 active:scale-90 active:bg-neutral-200 transition-all duration-100 cursor-pointer select-none touch-manipulation"
                                  aria-label="Increase quantity"
                                >
                                  <Plus size={12} className="stroke-[2.5]" />
                                </button>
                              </div>
                              <span className="text-sm font-black text-[#111111] tabular-nums transition-transform duration-150 origin-right">
                                {formatPrice(item.product.price * item.quantity)}
                              </span>
                            </div>
                          </div>
                        </div>
                      );
                    })}
                  </>
                )}
              </div>

              {/* Luxury Hairline Micro-Scrollbar (120fps Hardware Accelerated) */}
              <div
                ref={scrollbarTrackRef}
                className="absolute right-1.5 top-3 bottom-3 w-[3px] pointer-events-none transition-opacity duration-400 ease-out z-20 opacity-0"
                aria-hidden="true"
              >
                <div
                  ref={thumbRef}
                  className="w-full bg-[#111111]/45 rounded-full transition-none transform-gpu shadow-2xs"
                />
              </div>

              {/* Subtle Luxury Bottom Gradient Edge Indicator */}
              <div
                ref={bottomIndicatorRef}
                className="absolute bottom-0 left-0 right-0 h-7 bg-gradient-to-t from-white via-white/80 to-transparent pointer-events-none transition-opacity duration-300 z-10 opacity-0"
                aria-hidden="true"
              />
            </div>

            {/* Footer / Order Summary */}
            {items.length > 0 && (
              <div className="border-t border-neutral-200 bg-[#fafafa] px-6 py-5">
                <div className="space-y-1.5 mb-4 text-xs">
                  <div className="flex justify-between text-neutral-600">
                    <span>Subtotal ({selectedCount} items)</span>
                    <span className="font-bold text-neutral-900 tabular-nums">{formatPrice(selectedSubtotal)}</span>
                  </div>
                  {selectedBundleDiscount > 0 && (
                    <div className="flex justify-between text-emerald-700 font-bold">
                      <span>Bundle Pass (3 for ₹1,199)</span>
                      <span className="tabular-nums">-{formatPrice(selectedBundleDiscount)}</span>
                    </div>
                  )}
                  {selectedCouponDiscount > 0 && (
                    <div className="flex justify-between text-emerald-700 font-bold">
                      <span className="flex items-center gap-1.5">
                        <span>VIP Pass ({appliedCoupon})</span>
                        <button
                          type="button"
                          onClick={removeCoupon}
                          className="text-neutral-400 hover:text-red-500 cursor-pointer text-[10px] uppercase underline touch-manipulation"
                        >
                          Remove
                        </button>
                      </span>
                      <span className="tabular-nums">-{formatPrice(selectedCouponDiscount)}</span>
                    </div>
                  )}
                  <div className="flex justify-between text-neutral-600">
                    <span>Shipping</span>
                    <span>
                      {selectedCount === 0 ? (
                        <span className="text-neutral-400">—</span>
                      ) : selectedHasFreeShipping ? (
                        <span className="font-bold text-emerald-600 uppercase">FREE</span>
                      ) : (
                        <span className="font-bold text-neutral-900 tabular-nums">₹99</span>
                      )}
                    </span>
                  </div>
                  <div className="flex justify-between text-neutral-600">
                    <span>Taxes</span>
                    <span className="text-neutral-500">Included</span>
                  </div>
                  <div className="flex justify-between text-sm font-black text-[#111111] pt-2 border-t border-neutral-200">
                    <span>ESTIMATED TOTAL</span>
                    <span className="tabular-nums">{formatPrice(selectedFinalTotal)}</span>
                  </div>
                </div>

                <button
                  type="button"
                  disabled={selectedCount === 0 || isTruckDriving}
                  onClick={handleProceedToCheckout}
                  className="w-full relative overflow-hidden bg-[#111111] text-white py-3.5 px-4 rounded-full font-black tracking-widest uppercase text-xs flex items-center justify-center gap-2 hover:bg-black transition-all shadow-md active:scale-[0.99] cursor-pointer disabled:opacity-40 disabled:cursor-not-allowed group touch-manipulation"
                >
                  {selectedCount === 0 ? (
                    "SELECT ITEMS TO CHECKOUT"
                  ) : isTruckDriving ? (
                    <span className="flex items-center gap-2 text-[#fcd017] tracking-wider">
                      <Truck size={15} className="animate-bounce" />
                      DISPATCHING TO CHECKOUT...
                    </span>
                  ) : (
                    <>
                      <span>CHECKOUT {selectedCount} ITEM{selectedCount > 1 ? "S" : ""}</span>
                      <ArrowRight size={16} className="group-hover:translate-x-1 transition-transform" />
                    </>
                  )}
                </button>

                <div className="flex items-center justify-center gap-1.5 mt-3 text-[10px] text-neutral-500 font-medium">
                  <ShieldCheck size={13} className="text-emerald-600" />
                  <span>256-Bit SSL Encrypted • 7-Day Hassle-Free Returns</span>
                </div>
              </div>
            )}
          </div>
        )}

        {/* ═══════════════ VIEW 2: CHECKOUT ═══════════════ */}
        {cartView === "checkout" && (
          <div className="h-full flex flex-col animate-view-forward">
            <div className="flex items-center justify-between px-6 py-5 border-b border-neutral-200">
              <button
                type="button"
                onClick={() => { setViewTransitionDir("back"); setCartView("bag"); }}
                aria-label="Back to bag"
                className="group flex items-center gap-1.5 px-2.5 py-1.5 -ml-2 rounded-full text-xs font-bold uppercase tracking-wider text-neutral-600 hover:text-black hover:bg-neutral-100 active:scale-95 transition-all duration-200 cursor-pointer focus-visible:outline-hidden focus-visible:ring-2 focus-visible:ring-black motion-reduce:transform-none touch-manipulation"
              >
                <ChevronLeft size={16} className="transition-transform duration-200 ease-out group-hover:-translate-x-1 motion-reduce:transform-none" />
                <span>Bag</span>
              </button>
              <div className="text-center">
                <h2 className="text-sm font-black tracking-wider uppercase text-[#111111]">EXPRESS CHECKOUT</h2>
              </div>
              <button
                type="button"
                onClick={handleClose}
                aria-label="Close checkout"
                className="group p-1.5 rounded-full text-neutral-500 hover:text-black hover:bg-neutral-100 active:scale-90 transition-all duration-200 cursor-pointer focus-visible:outline-hidden focus-visible:ring-2 focus-visible:ring-black motion-reduce:transform-none touch-manipulation"
              >
                <X size={20} className="transition-transform duration-300 ease-out group-hover:rotate-90 group-hover:scale-110 motion-reduce:transform-none" />
              </button>
            </div>

            <div
              data-lenis-prevent="true"
              className="flex-1 overflow-y-auto overscroll-contain px-6 py-5"
            >
              {/* Order Summary — selected items only */}
              <div className="bg-[#f8f8f6] border border-[#e8e8e5] p-3.5 rounded-[2px] mb-6">
                <div className="flex items-center justify-between mb-2">
                  <span className="text-[11px] font-bold uppercase tracking-wider text-neutral-700">
                    Order Summary ({selectedCount} {selectedCount === 1 ? "Item" : "Items"})
                  </span>
                  <span className="text-xs font-black text-[#111111]">{formatPrice(selectedFinalTotal)}</span>
                </div>
                <div className="space-y-1.5 divide-y divide-neutral-200/60 text-xs">
                  {selectedItems.map((item) => (
                    <div
                      key={`${item.product.id}-${item.selectedSize}`}
                      className="pt-1.5 flex items-center justify-between"
                    >
                      <span className="text-neutral-600 truncate max-w-[260px]">
                        {item.product.name} ({item.selectedSize}) × {item.quantity}
                      </span>
                      <span className="font-semibold text-neutral-900 shrink-0">
                        {formatPrice(item.product.price * item.quantity)}
                      </span>
                    </div>
                  ))}
                </div>
                {selectedBundleDiscount > 0 && (
                  <div className="mt-2 pt-2 border-t border-neutral-200/80 flex items-center justify-between text-[11px] text-emerald-700 font-bold">
                    <span>Bundle Pass (3 for ₹1,199):</span>
                    <span>-{formatPrice(selectedBundleDiscount)}</span>
                  </div>
                )}
                {selectedCouponDiscount > 0 && (
                  <div className="mt-1.5 pt-1.5 border-t border-neutral-200/80 flex items-center justify-between text-[11px] text-emerald-700 font-bold">
                    <span className="flex items-center gap-1.5">
                      <span>VIP Pass ({appliedCoupon}):</span>
                      <button type="button" onClick={removeCoupon} className="text-neutral-400 hover:text-red-500 cursor-pointer text-[10px] uppercase underline">Remove</button>
                    </span>
                    <span>-{formatPrice(selectedCouponDiscount)}</span>
                  </div>
                )}
                <div className="mt-1.5 pt-1.5 border-t border-neutral-200/80 flex items-center justify-between text-[11px] text-emerald-700 font-bold">
                  <span>Shipping:</span>
                  <span>{selectedHasFreeShipping ? "FREE EXPRESS DELIVERY" : "₹99"}</span>
                </div>

                {/* Promo Code */}
                {!appliedCoupon && (
                  <div className="mt-2.5 pt-2 border-t border-neutral-200/80">
                    <div className="flex items-center gap-2">
                      <input
                        type="text"
                        value={couponInput}
                        onChange={(e) => { setCouponInput(e.target.value); setCouponMessage(null); }}
                        onKeyDown={(e) => {
                          if (e.key === "Enter") {
                            e.preventDefault();
                            const res = applyCoupon(couponInput);
                            setCouponMessage({ text: res.message, isError: !res.success });
                            if (res.success) setCouponInput("");
                          }
                        }}
                        placeholder="ENTER PROMO CODE (e.g. VEYRO10)"
                        className="flex-1 bg-[#f8f8f6] border border-[#e8e8e5] rounded-[2px] px-2.5 py-1.5 text-[11px] font-mono uppercase text-[#111111] placeholder:text-neutral-400 focus:outline-none focus:border-[#111111]"
                      />
                      <button
                        type="button"
                        onClick={() => {
                          const res = applyCoupon(couponInput);
                          setCouponMessage({ text: res.message, isError: !res.success });
                          if (res.success) setCouponInput("");
                        }}
                        className="bg-[#111111] text-white px-3 py-1.5 text-[11px] font-bold uppercase rounded-[2px] hover:bg-neutral-800 transition-colors cursor-pointer shrink-0"
                      >
                        Apply
                      </button>
                    </div>
                    {couponMessage && (
                      <p className={`text-[10px] mt-1 font-medium ${couponMessage.isError ? "text-red-600" : "text-emerald-700"}`}>
                        {couponMessage.text}
                      </p>
                    )}
                  </div>
                )}
              </div>

              {/* Form */}
              <form onSubmit={handleCheckoutSubmit} className="space-y-4">
                <div>
                  <label className="block text-[11px] font-bold uppercase tracking-wider text-[#111111] mb-1.5">
                    Contact & Full Name *
                  </label>
                  <input
                    type="text"
                    required
                    value={formData.name}
                    onChange={(e) => setFormData({ ...formData, name: e.target.value })}
                    placeholder="Enter your full name"
                    className="w-full bg-[#f8f8f6] border border-[#e8e8e5] rounded-[2px] px-3.5 py-2.5 text-xs text-[#111111] placeholder:text-neutral-400 focus:outline-none focus:border-[#111111] transition-colors"
                  />
                </div>

                <div className="grid grid-cols-2 gap-3">
                  <div>
                    <label className="block text-[11px] font-bold uppercase tracking-wider text-[#111111] mb-1.5">
                      Phone Number *
                    </label>
                    <input
                      type="tel"
                      required
                      maxLength={10}
                      value={formData.phone}
                      onChange={(e) => setFormData({ ...formData, phone: e.target.value.replace(/\D/g, "") })}
                      placeholder="10-digit mobile"
                      className="w-full bg-[#f8f8f6] border border-[#e8e8e5] rounded-[2px] px-3.5 py-2.5 text-xs text-[#111111] placeholder:text-neutral-400 focus:outline-none focus:border-[#111111] transition-colors"
                    />
                  </div>
                  <div>
                    <label className="block text-[11px] font-bold uppercase tracking-wider text-[#111111] mb-1.5">
                      Pincode *
                    </label>
                    <input
                      type="text"
                      required
                      maxLength={6}
                      value={formData.pincode}
                      onChange={(e) => setFormData({ ...formData, pincode: e.target.value.replace(/\D/g, "") })}
                      placeholder="600001"
                      className="w-full bg-[#f8f8f6] border border-[#e8e8e5] rounded-[2px] px-3.5 py-2.5 text-xs text-[#111111] placeholder:text-neutral-400 focus:outline-none focus:border-[#111111] transition-colors"
                    />
                  </div>
                </div>

                <div>
                  <label className="block text-[11px] font-bold uppercase tracking-wider text-[#111111] mb-1.5">
                    Delivery Address *
                  </label>
                  <textarea
                    required
                    rows={2}
                    value={formData.address}
                    onChange={(e) => setFormData({ ...formData, address: e.target.value })}
                    placeholder="House/Flat No., Building, Street, Area"
                    className="w-full bg-[#f8f8f6] border border-[#e8e8e5] rounded-[2px] px-3.5 py-2 text-xs text-[#111111] placeholder:text-neutral-400 focus:outline-none focus:border-[#111111] resize-none transition-colors"
                  />
                </div>

                <div>
                  <label className="block text-[11px] font-bold uppercase tracking-wider text-[#111111] mb-2">
                    Payment Method
                  </label>
                  <div className="grid grid-cols-3 gap-2 text-xs">
                    {(["upi", "cod", "card"] as const).map((method) => (
                      <button
                        key={method}
                        type="button"
                        onClick={() => setFormData({ ...formData, paymentMethod: method })}
                        className={`p-2.5 rounded-[2px] border text-center font-bold transition-all cursor-pointer ${
                          formData.paymentMethod === method
                            ? "border-[#111111] bg-[#111111] text-white shadow-xs"
                            : "border-[#e8e8e5] bg-white text-neutral-800 hover:border-neutral-400"
                        }`}
                      >
                        {method === "upi" ? "UPI / QR" : method === "cod" ? "Cash on Delivery" : "Card / Net"}
                      </button>
                    ))}
                  </div>
                </div>

                <div className="pt-3">
                  <button
                    type="submit"
                    disabled={isSubmitting}
                    className="w-full h-13 bg-[#fcd017] text-[#111111] hover:bg-[#e5bc05] font-black text-xs uppercase tracking-[0.18em] rounded-[2px] transition-all flex items-center justify-center gap-2 shadow-sm cursor-pointer disabled:opacity-50"
                  >
                    {isSubmitting ? (
                      <span>Processing Payment...</span>
                    ) : (
                      <>
                        <span>PAY & COMPLETE ORDER • {formatPrice(selectedFinalTotal)}</span>
                        <ArrowRight size={15} className="stroke-[2.5]" />
                      </>
                    )}
                  </button>
                </div>

                <div className="flex items-center justify-center gap-1.5 text-[10px] text-neutral-500 pt-1">
                  <Lock size={12} className="text-emerald-700" />
                  <span>256-Bit Bank Encrypted Payment • Free Doorstep Returns</span>
                </div>
              </form>
            </div>
          </div>
        )}

        {/* ═══════════════ VIEW 3: SUCCESS ═══════════════ */}
        {cartView === "success" && (
          <div className="h-full flex flex-col justify-between p-8 text-center">
            <div className="my-auto">
              <div className="w-16 h-16 bg-emerald-50 text-emerald-600 rounded-full flex items-center justify-center mx-auto mb-5 border border-emerald-200">
                <CheckCircle2 size={36} />
              </div>
              <span className="text-[11px] font-mono tracking-widest uppercase text-neutral-400 block mb-1">
                [ ORDER CONFIRMED ]
              </span>
              <h3 className="text-2xl font-black uppercase tracking-tight text-[#111111] mb-2">
                Thank You For Your Order
              </h3>
              <p className="text-xs font-mono text-neutral-500 mb-6">
                Reference: <span className="font-bold text-[#111111]">{confirmedOrderId}</span>
              </p>

              <div className="bg-[#f8f8f6] border border-[#e8e8e5] p-4 rounded-[2px] text-left text-xs space-y-2 mb-6">
                <div className="flex justify-between">
                  <span className="text-neutral-500">Order Status:</span>
                  <span className="font-bold text-emerald-700">Confirmed & Processing</span>
                </div>
                <div className="flex justify-between">
                  <span className="text-neutral-500">Dispatch Location:</span>
                  <span className="font-bold text-[#111111]">Tirupur Mill Hub, India</span>
                </div>
                <div className="flex justify-between">
                  <span className="text-neutral-500">Estimated Delivery:</span>
                  <span className="font-bold text-[#111111]">2–3 Business Days</span>
                </div>
              </div>

              <p className="text-xs text-neutral-500 leading-relaxed max-w-sm mx-auto mb-6">
                Your order is confirmed and queued for priority dispatch. We have sent an SMS update with your tracking link.
              </p>

              {/* View Order Details — navigates to full order page */}
              <button
                type="button"
                onClick={() => {
                  setCartView("bag");
                  closeCart();
                  if (confirmedOrderId) {
                    router.push(`/orders/${confirmedOrderId}`);
                  }
                }}
                className="w-full bg-[#fcd017] text-[#111111] py-3.5 text-xs font-black uppercase tracking-widest rounded-[2px] hover:bg-[#e5bc05] transition-colors cursor-pointer flex items-center justify-center gap-2 mb-2.5 shadow-sm"
              >
                <Package size={15} className="stroke-[2.5]" />
                <span>VIEW ORDER DETAILS</span>
              </button>

              {/* Track My Order — navigates to orders list */}
              <button
                type="button"
                onClick={() => {
                  setCartView("bag");
                  closeCart();
                  router.push("/orders");
                }}
                className="w-full bg-[#111111] text-white py-3.5 text-xs font-bold uppercase tracking-widest rounded-[2px] hover:bg-neutral-800 transition-colors cursor-pointer flex items-center justify-center gap-2 mb-2.5"
              >
                <Truck size={15} />
                <span>TRACK MY ORDERS</span>
              </button>

              <button
                type="button"
                onClick={() => { setCartView("bag"); closeCart(); }}
                className="w-full text-neutral-500 hover:text-[#111111] py-2 text-[11px] font-bold uppercase tracking-widest transition-colors cursor-pointer"
              >
                Continue Exploring
              </button>
            </div>
          </div>
        )}
      </aside>
    </div>
  );
}
