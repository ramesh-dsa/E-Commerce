"use client";

import React, { useState, useEffect, useMemo } from "react";
import Image from "next/image";
import Link from "next/link";
import { useWishlist } from "@/context/WishlistContext";
import { useCart } from "@/context/CartContext";
import { formatPrice } from "@/lib/utils";
import {
  X,
  Trash2,
  ShoppingBag,
  ArrowRight,
  Heart,
  Check,
  Minus,
} from "lucide-react";
import { Product } from "@/types";

export function WishlistDrawer() {
  const {
    items,
    totalWishlistItems,
    isWishlistOpen,
    closeWishlist,
    removeFromWishlist,
    clearWishlist,
  } = useWishlist();

  const { addToCart, openCart } = useCart();

  // Track selected size per product in wishlist: { [productId]: size }
  const [selectedSizes, setSelectedSizes] = useState<Record<string, string>>({});
  // Track selected product IDs for batch Move to Bag: Set<productId>
  const [selectedIds, setSelectedIds] = useState<Set<string>>(new Set());
  const [movingId, setMovingId] = useState<string | null>(null);
  const [isBatchMoving, setIsBatchMoving] = useState(false);

  // Close drawer on Escape key press
  useEffect(() => {
    const onKeyDown = (e: KeyboardEvent) => {
      if (e.key === "Escape" && isWishlistOpen) {
        closeWishlist();
      }
    };
    window.addEventListener("keydown", onKeyDown);
    return () => window.removeEventListener("keydown", onKeyDown);
  }, [isWishlistOpen, closeWishlist]);

  // Lock body scroll when drawer is open
  useEffect(() => {
    if (isWishlistOpen) {
      document.body.style.overflow = "hidden";
    } else {
      document.body.style.overflow = "";
    }
    return () => {
      document.body.style.overflow = "";
    };
  }, [isWishlistOpen]);

  // Sync selected items & default sizes when items change
  useEffect(() => {
    setSelectedSizes((prev) => {
      const next = { ...prev };
      items.forEach((item) => {
        if (!next[item.id] && item.sizes && item.sizes.length > 0) {
          const preferred =
            item.sizes.find((s) => s === "M" || s === "UK 8") || item.sizes[0];
          next[item.id] = preferred;
        }
      });
      return next;
    });

    // Default select all items when items list updates or expands
    setSelectedIds((prev) => {
      const validIds = new Set(items.map((i) => i.id));
      // Keep existing selections that are still in items, plus any new items
      const next = new Set<string>();
      items.forEach((i) => {
        if (prev.size === 0 || prev.has(i.id)) {
          next.add(i.id);
        }
      });
      return next.size > 0 ? next : validIds;
    });
  }, [items]);

  // Selection calculations
  const selectedCount = selectedIds.size;
  const isAllSelected = items.length > 0 && selectedCount === items.length;
  const isPartiallySelected = selectedCount > 0 && selectedCount < items.length;

  const selectedTotal = useMemo(() => {
    return items
      .filter((item) => selectedIds.has(item.id))
      .reduce((sum, item) => sum + item.price, 0);
  }, [items, selectedIds]);

  if (!isWishlistOpen) return null;

  const handleSizeChange = (productId: string, size: string) => {
    setSelectedSizes((prev) => ({ ...prev, [productId]: size }));
  };

  const toggleSelectItem = (productId: string) => {
    setSelectedIds((prev) => {
      const next = new Set(prev);
      if (next.has(productId)) {
        next.delete(productId);
      } else {
        next.add(productId);
      }
      return next;
    });
  };

  const toggleSelectAll = () => {
    if (isAllSelected) {
      setSelectedIds(new Set());
    } else {
      setSelectedIds(new Set(items.map((i) => i.id)));
    }
  };

  // Move single item to bag
  const handleMoveSingleToBag = (product: Product) => {
    const chosenSize =
      selectedSizes[product.id] ||
      (product.sizes && product.sizes.length > 0 ? product.sizes[0] : "Standard");

    setMovingId(product.id);
    addToCart(product, chosenSize, 1, false);

    setTimeout(() => {
      removeFromWishlist(product.id);
      setSelectedIds((prev) => {
        const next = new Set(prev);
        next.delete(product.id);
        return next;
      });
      setMovingId(null);
      closeWishlist();
      openCart();
    }, 450);
  };

  // Move selected items to bag
  const handleMoveSelectedToBag = () => {
    if (selectedCount === 0) return;

    setIsBatchMoving(true);
    const selectedItems = items.filter((item) => selectedIds.has(item.id));

    selectedItems.forEach((product) => {
      const chosenSize =
        selectedSizes[product.id] ||
        (product.sizes && product.sizes.length > 0 ? product.sizes[0] : "Standard");
      addToCart(product, chosenSize, 1, false);
      removeFromWishlist(product.id);
    });

    setSelectedIds(new Set());

    setTimeout(() => {
      setIsBatchMoving(false);
      closeWishlist();
      openCart();
    }, 500);
  };

  // Remove only selected items
  const handleRemoveSelected = () => {
    selectedIds.forEach((id) => {
      removeFromWishlist(id);
    });
    setSelectedIds(new Set());
  };

  return (
    <div className="fixed inset-0 z-50 flex justify-end select-none" data-lenis-prevent>
      {/* Backdrop */}
      <div
        className="fixed inset-0 bg-black/60 backdrop-blur-xs transition-opacity duration-300 ease-out"
        onClick={closeWishlist}
        aria-hidden="true"
        data-lenis-prevent
      />

      {/* Drawer Container */}
      <aside
        role="dialog"
        aria-modal="true"
        aria-label="Wishlist Drawer"
        data-lenis-prevent
        className="relative w-full max-w-[480px] h-full bg-white text-[#111111] shadow-2xl flex flex-col z-10 overscroll-contain animate-drawer-in"
      >
        {/* Drawer Header */}
        <div className="flex items-center justify-between px-6 py-5 border-b border-neutral-200">
          <div className="flex items-center gap-2.5">
            <Heart size={20} className="stroke-[2.2] text-[#111111]" />
            <h2 className="text-base font-black tracking-wider uppercase text-[#111111]">
              WISHLIST
            </h2>
            <span className="text-xs font-bold px-2 py-0.5 rounded-full bg-[#fcd017] text-[#111111]">
              {totalWishlistItems}
            </span>
          </div>

          <button
            type="button"
            onClick={closeWishlist}
            aria-label="Close wishlist"
            className="group p-1.5 rounded-full text-neutral-500 hover:text-black hover:bg-neutral-100 active:scale-90 transition-all duration-200 cursor-pointer focus-visible:outline-hidden focus-visible:ring-2 focus-visible:ring-black motion-reduce:transform-none"
          >
            <X size={20} className="transition-transform duration-300 ease-out group-hover:rotate-90 group-hover:scale-110 motion-reduce:transform-none" />
          </button>
        </div>

        {/* ========================================================= */}
        {/* SELECTION CONTROL BAR (When items exist)                  */}
        {/* ========================================================= */}
        {items.length > 0 && (
          <div className="flex items-center justify-between px-6 py-2.5 bg-[#fafafa] border-b border-neutral-200 text-xs">
            <button
              type="button"
              onClick={toggleSelectAll}
              className="flex items-center gap-2.5 font-bold text-[#111111] hover:text-neutral-600 transition-colors cursor-pointer select-none"
            >
              <div
                className={`w-4 h-4 rounded-[2px] border flex items-center justify-center transition-all ${
                  isAllSelected
                    ? "bg-[#111111] border-[#111111] text-white"
                    : isPartiallySelected
                    ? "bg-[#111111] border-[#111111] text-white"
                    : "bg-white border-neutral-300 text-transparent"
                }`}
              >
                {isAllSelected ? (
                  <Check size={11} className="stroke-[3]" />
                ) : isPartiallySelected ? (
                  <Minus size={11} className="stroke-[3]" />
                ) : null}
              </div>
              <span className="tracking-wide">
                {isAllSelected
                  ? `Select All (${items.length})`
                  : `Select All (${items.length})`}
              </span>
            </button>

            <span className="text-[11px] font-semibold text-neutral-500">
              <strong className="text-[#111111]">{selectedCount}</strong> of {items.length} selected
            </span>
          </div>
        )}

        {/* ========================================================= */}
        {/* BODY: EMPTY OR POPULATED                                  */}
        {/* ========================================================= */}
        {items.length === 0 ? (
          /* Empty State */
          <div className="flex-1 flex flex-col items-center justify-center p-8 text-center">
            <div className="w-20 h-20 rounded-full bg-neutral-100 flex items-center justify-center mb-5 text-neutral-400">
              <Heart size={38} className="stroke-[1.5]" />
            </div>
            <h3 className="text-lg font-black tracking-tight text-[#111111] mb-2 uppercase">
              YOUR WISHLIST IS EMPTY
            </h3>
            <p className="text-xs text-neutral-500 max-w-xs mb-8 leading-relaxed">
              Save your favorite heavyweight drapes, graphic t-shirts, and vulcanized footwear to review anytime.
            </p>
            <Link
              href="/clothing"
              onClick={closeWishlist}
              className="w-full max-w-xs h-12 rounded-[2px] bg-black text-white hover:bg-neutral-800 text-xs font-bold uppercase tracking-widest flex items-center justify-center gap-2 transition-all cursor-pointer"
            >
              <span>Explore Collection</span>
              <ArrowRight size={15} />
            </Link>
          </div>
        ) : (
          <div
            data-lenis-prevent="true"
            className="flex-1 overflow-y-auto overscroll-contain px-6 py-2 divide-y divide-neutral-100"
          >
            {items.map((product) => {
              const currentSize =
                selectedSizes[product.id] ||
                (product.sizes && product.sizes.length > 0 ? product.sizes[0] : "Standard");
              const isMoving = movingId === product.id;
              const isSelected = selectedIds.has(product.id);

              return (
                <div
                  key={product.id}
                  className={`py-4 flex gap-3.5 items-start group transition-all ${
                    isSelected ? "opacity-100" : "opacity-75 hover:opacity-100"
                  }`}
                >
                  {/* Selection Checkbox */}
                  <div className="pt-2">
                    <button
                      type="button"
                      role="checkbox"
                      aria-checked={isSelected}
                      aria-label={`Select ${product.name} to move to bag`}
                      onClick={() => toggleSelectItem(product.id)}
                      className={`w-5 h-5 rounded-[3px] border flex items-center justify-center transition-all cursor-pointer ${
                        isSelected
                          ? "bg-[#111111] border-[#111111] text-white shadow-xs"
                          : "bg-white border-neutral-300 hover:border-black text-transparent"
                      }`}
                    >
                      <Check
                        size={13}
                        className={`stroke-[3] transition-transform ${
                          isSelected ? "scale-100" : "scale-0"
                        }`}
                      />
                    </button>
                  </div>

                  {/* Thumbnail Image */}
                  <Link
                    href={`/product/${product.slug}`}
                    onClick={closeWishlist}
                    className="relative w-20 h-24 sm:w-22 sm:h-26 bg-[#f4f2ee] rounded-lg overflow-hidden shrink-0 border border-neutral-100"
                  >
                    <Image
                      src={product.imageUrl}
                      alt={product.name}
                      fill
                      sizes="100px"
                      className="object-cover object-center group-hover:scale-105 transition-transform duration-300"
                    />
                  </Link>

                  {/* Details */}
                  <div className="flex-1 min-w-0 flex flex-col justify-between">
                    <div>
                      {/* Top Row: Tag & Remove Button */}
                      <div className="flex items-start justify-between gap-2">
                        <span className="text-[10px] font-bold tracking-wider uppercase text-neutral-400">
                          {product.subcategoryTag || product.category}
                        </span>
                        <button
                          type="button"
                          onClick={() => removeFromWishlist(product.id)}
                          aria-label={`Remove ${product.name} from wishlist`}
                          className="p-1 text-neutral-400 hover:text-red-500 transition-colors cursor-pointer"
                        >
                          <Trash2 size={15} />
                        </button>
                      </div>

                      {/* Product Name */}
                      <Link
                        href={`/product/${product.slug}`}
                        onClick={closeWishlist}
                        className="block text-xs sm:text-sm font-bold text-[#111111] hover:underline truncate mt-0.5"
                      >
                        {product.name}
                      </Link>

                      {/* Price Strip */}
                      <div className="flex items-center gap-2 mt-1">
                        <span className="text-xs font-black text-[#111111]">
                          {formatPrice(product.price)}
                        </span>
                        {product.originalPrice && product.originalPrice > product.price && (
                          <>
                            <span className="text-[11px] text-neutral-400 line-through">
                              {formatPrice(product.originalPrice)}
                            </span>
                            <span className="text-[10px] font-bold text-emerald-700 bg-emerald-50 px-1 py-0.2 rounded-[2px]">
                              {product.discount || "SAVE"}
                            </span>
                          </>
                        )}
                      </div>
                    </div>

                    {/* Size Selector + Move to Bag */}
                    <div className="mt-3 flex items-center gap-2">
                      {/* Size Selector */}
                      {product.sizes && product.sizes.length > 0 && (
                        <div className="relative">
                          <select
                            value={currentSize}
                            onChange={(e) => handleSizeChange(product.id, e.target.value)}
                            aria-label={`Select size for ${product.name}`}
                            className="h-8 px-2 py-1 bg-neutral-100 border border-neutral-200 rounded-[2px] text-[11px] font-bold text-[#111111] focus:outline-none focus:border-black cursor-pointer uppercase"
                          >
                            {product.sizes.map((s) => (
                              <option key={s} value={s}>
                                {s}
                              </option>
                            ))}
                          </select>
                        </div>
                      )}

                      {/* Single Move to Bag Button */}
                      <button
                        type="button"
                        onClick={() => handleMoveSingleToBag(product)}
                        disabled={isMoving}
                        aria-label={`Move ${product.name} to shopping bag`}
                        className={`flex-1 h-8 px-3 rounded-[2px] text-[11px] font-bold uppercase tracking-wider flex items-center justify-center gap-1.5 transition-all cursor-pointer ${
                          isMoving
                            ? "bg-emerald-600 text-white"
                            : "bg-[#111111] text-white hover:bg-neutral-800 active:scale-[0.98]"
                        }`}
                      >
                        {isMoving ? (
                          <>
                            <Check size={13} className="stroke-[3]" />
                            <span>Moved!</span>
                          </>
                        ) : (
                          <>
                            <ShoppingBag size={13} />
                            <span>Move to Bag</span>
                          </>
                        )}
                      </button>
                    </div>
                  </div>
                </div>
              );
            })}
          </div>
        )}

        {/* ========================================================= */}
        {/* DRAWER FOOTER (Batch Action for Selected Items)           */}
        {/* ========================================================= */}
        {items.length > 0 && (
          <div className="p-5 border-t border-neutral-200 bg-[#fafafa] space-y-2.5">
            <button
              type="button"
              onClick={handleMoveSelectedToBag}
              disabled={selectedCount === 0 || isBatchMoving}
              className={`w-full h-12 rounded-[2px] text-xs font-black uppercase tracking-wider flex items-center justify-center gap-2 transition-all cursor-pointer shadow-xs ${
                selectedCount > 0 && !isBatchMoving
                  ? "bg-[#fcd017] text-[#111111] hover:bg-[#eac010] active:scale-[0.99]"
                  : "bg-neutral-200 text-neutral-400 cursor-not-allowed"
              }`}
            >
              {isBatchMoving ? (
                <>
                  <Check size={16} className="stroke-[3]" />
                  <span>Moving {selectedCount} to Bag...</span>
                </>
              ) : selectedCount === 0 ? (
                <span>Select Items to Move (0)</span>
              ) : isAllSelected ? (
                <>
                  <ShoppingBag size={16} />
                  <span>Move All to Bag ({selectedCount}) • {formatPrice(selectedTotal)}</span>
                </>
              ) : (
                <>
                  <ShoppingBag size={16} />
                  <span>Move Selected to Bag ({selectedCount}) • {formatPrice(selectedTotal)}</span>
                </>
              )}
            </button>

            <div className="flex items-center justify-between text-xs pt-1">
              {selectedCount > 0 && !isAllSelected ? (
                <button
                  type="button"
                  onClick={handleRemoveSelected}
                  className="text-neutral-500 hover:text-red-500 transition-colors cursor-pointer text-[11px] font-medium"
                >
                  Remove Selected ({selectedCount})
                </button>
              ) : (
                <button
                  type="button"
                  onClick={clearWishlist}
                  className="text-neutral-500 hover:text-red-500 transition-colors cursor-pointer text-[11px] font-medium"
                >
                  Clear Wishlist
                </button>
              )}

              <button
                type="button"
                onClick={closeWishlist}
                className="text-neutral-600 hover:text-black transition-colors cursor-pointer text-[11px] font-bold underline underline-offset-2"
              >
                Continue Browsing
              </button>
            </div>
          </div>
        )}
      </aside>
    </div>
  );
}
