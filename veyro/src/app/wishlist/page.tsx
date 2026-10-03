"use client";

import React, { useState, useEffect } from "react";
import Image from "next/image";
import Link from "next/link";
import { useWishlist } from "@/context/WishlistContext";
import { useCart } from "@/context/CartContext";
import { Container } from "@/components/ui/Container";
import { Toast } from "@/components/ui/Toast";
import { Badge } from "@/components/ui/Badge";
import { ProductCard } from "@/components/features/ProductCard";
import { products } from "@/data/products";
import { formatPrice, calculateDiscountPercentage } from "@/lib/utils";
import { Product } from "@/types";
import {
  Heart,
  ShoppingCart,
  Trash2,
  ArrowRight,
  ChevronRight,
  Sparkles,
  Check,
  X,
  CheckCheck,
} from "lucide-react";

export default function WishlistPage() {
  const {
    items,
    totalWishlistItems,
    itemSizes,
    setItemSize,
    removeFromWishlist,
    clearWishlist,
  } = useWishlist();
  const { addToCart, openCart } = useCart();

  // State
  const [movingId, setMovingId] = useState<string | null>(null);
  const [isBatchMoving, setIsBatchMoving] = useState(false);
  const [toastMessage, setToastMessage] = useState<string | null>(null);
  const [showClearConfirm, setShowClearConfirm] = useState(false);

  // Helper to determine the chosen size for any wishlisted product
  const getProductSize = (product: Product): string => {
    return (
      itemSizes[product.id] ||
      (product.sizes && product.sizes.length > 0 ? product.sizes[0] : "Standard")
    );
  };

  const showToast = (message: string) => {
    setToastMessage(message);
    setTimeout(() => {
      setToastMessage((current) => (current === message ? null : current));
    }, 3000);
  };

  const handleSelectSize = (productId: string, size: string) => {
    setItemSize(productId, size);
  };

  // Move a single item to bag
  const handleMoveToBag = (product: Product) => {
    const chosenSize = getProductSize(product);

    setMovingId(product.id);
    addToCart(product, chosenSize, 1, false);

    setTimeout(() => {
      removeFromWishlist(product.id);
      setMovingId(null);
      showToast(`Added ${product.name} (${chosenSize}) to cart`);
    }, 350);
  };

  // Move all items in wishlist to bag
  const handleMoveAllToBag = () => {
    if (items.length === 0) return;
    setIsBatchMoving(true);

    items.forEach((product) => {
      const chosenSize = getProductSize(product);
      addToCart(product, chosenSize, 1, false);
    });

    clearWishlist();

    setTimeout(() => {
      setIsBatchMoving(false);
      showToast(`Moved ${items.length} items to your shopping cart`);
    }, 500);
  };

  const handleRemove = (productId: string, productName: string) => {
    removeFromWishlist(productId);
    showToast(`Removed "${productName}" from wishlist`);
  };

  // 4 curated products to show as recommendations
  const recommendedProducts = products.slice(0, 4);

  return (
    <div className="bg-neutral-50/60 min-h-screen pb-24">
      {/* Breadcrumbs */}
      <div className="border-b border-neutral-200/80 bg-white">
        <Container>
          <div className="py-3.5 flex items-center justify-between text-xs text-neutral-500">
            <div className="flex items-center gap-2">
              <Link href="/" className="hover:text-neutral-900 transition-colors">
                Home
              </Link>
              <ChevronRight size={12} className="text-neutral-400" />
              <span className="text-neutral-900 font-semibold">
                My Wishlist
              </span>
            </div>
            <Link
              href="/collections"
              className="hidden sm:inline-flex items-center gap-1 font-medium hover:text-neutral-900 transition-colors text-xs"
            >
              <span>Explore All Drops</span>
              <ArrowRight size={12} />
            </Link>
          </div>
        </Container>
      </div>

      {/* Floating Toast Notification */}
      <Toast
        isOpen={Boolean(toastMessage)}
        onClose={() => setToastMessage(null)}
        variant={toastMessage?.toLowerCase().includes("removed") || toastMessage?.toLowerCase().includes("cleared") ? "info" : "success"}
        position="top"
        message={<span>{toastMessage}</span>}
      />

      <Container className="pt-8 sm:pt-10">
        {/* Page Header */}
        <div className="flex flex-col sm:flex-row sm:items-end justify-between gap-4 pb-6 border-b border-neutral-200/80 mb-8">
          <div>
            <div className="flex items-center gap-3 mb-1.5">
              <h1 className="text-2xl sm:text-3xl font-bold tracking-tight text-neutral-900">
                My Wishlist
              </h1>
              <span className="inline-flex items-center px-2.5 py-0.5 rounded-full text-xs font-semibold bg-neutral-900 text-white">
                {totalWishlistItems} {totalWishlistItems === 1 ? "Item" : "Items"}
              </span>
            </div>
            <p className="text-xs sm:text-sm text-neutral-500">
              Curate your favorite pieces, compare styles, and move items to your bag.
            </p>
          </div>

          {/* Action Bar (when items present) */}
          {items.length > 0 && (
            <div className="flex items-center gap-2.5">
              <button
                type="button"
                onClick={handleMoveAllToBag}
                disabled={isBatchMoving}
                className="inline-flex items-center gap-2 bg-neutral-900 text-white hover:bg-black px-4 py-2.5 rounded-lg text-xs font-semibold transition-colors cursor-pointer disabled:opacity-50"
              >
                <ShoppingCart size={14} />
                <span>{isBatchMoving ? "Moving..." : "Move All to Bag"}</span>
              </button>

              {!showClearConfirm ? (
                <button
                  type="button"
                  onClick={() => setShowClearConfirm(true)}
                  className="inline-flex items-center gap-1.5 border border-neutral-300 text-neutral-700 hover:text-neutral-950 hover:bg-neutral-100 px-3 py-2.5 rounded-lg text-xs font-medium transition-colors cursor-pointer"
                >
                  <Trash2 size={13} />
                  <span>Clear</span>
                </button>
              ) : (
                <div className="flex items-center gap-1 bg-neutral-100 p-1 rounded-lg">
                  <span className="text-[11px] text-neutral-600 px-1 font-medium">
                    Clear all?
                  </span>
                  <button
                    type="button"
                    onClick={() => {
                      clearWishlist();
                      setShowClearConfirm(false);
                      showToast("Wishlist cleared");
                    }}
                    className="text-xs text-red-600 hover:text-red-700 font-bold px-2 py-1 hover:bg-white rounded transition-colors cursor-pointer"
                  >
                    Yes
                  </button>
                  <button
                    type="button"
                    onClick={() => setShowClearConfirm(false)}
                    className="text-xs text-neutral-600 hover:text-neutral-900 px-2 py-1 hover:bg-white rounded transition-colors cursor-pointer"
                  >
                    Cancel
                  </button>
                </div>
              )}
            </div>
          )}
        </div>

        {/* Wishlist Grid or Empty State */}
        {items.length > 0 ? (
          <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-3 lg:grid-cols-4 gap-6">
            {items.map((product) => {
              const currentSize = getProductSize(product);
              const isMoving = movingId === product.id;

              const discountPercent =
                product.originalPrice && product.originalPrice > product.price
                  ? calculateDiscountPercentage(product.price, product.originalPrice)
                  : null;

              return (
                <div
                  key={product.id}
                  className="group bg-white border border-neutral-200/90 rounded-xl overflow-hidden flex flex-col shadow-2xs hover:shadow-md transition-all duration-200"
                >
                  {/* Image Container */}
                  <div className="relative aspect-[3/4] bg-neutral-100 overflow-hidden">
                    <Link
                      href={`/product/${product.slug}`}
                      className="block h-full w-full"
                    >
                      <Image
                        src={product.imageUrl}
                        alt={product.name}
                        fill
                        sizes="(max-width: 640px) 100vw, (max-width: 1024px) 50vw, 25vw"
                        className="object-cover object-center group-hover:scale-105 transition-transform duration-500 ease-out"
                      />
                    </Link>

                    {/* Badge */}
                    {product.badge && (
                      <div className="absolute top-2.5 left-2.5 pointer-events-none">
                        <Badge
                          variant={
                            product.badge === "SALE"
                              ? "sale"
                              : product.badge === "NEW"
                              ? "dark"
                              : "default"
                          }
                        >
                          {product.badge}
                        </Badge>
                      </div>
                    )}

                    {/* Remove from Wishlist Button */}
                    <button
                      type="button"
                      onClick={() => handleRemove(product.id, product.name)}
                      aria-label={`Remove ${product.name} from wishlist`}
                      className="absolute top-2.5 right-2.5 w-8 h-8 rounded-full bg-white/95 backdrop-blur-xs text-neutral-600 hover:text-red-600 hover:bg-white shadow-xs flex items-center justify-center transition-all cursor-pointer"
                    >
                      <X size={15} />
                    </button>
                  </div>

                  {/* Product Details */}
                  <div className="p-4 flex-1 flex flex-col justify-between">
                    <div>
                      <div className="text-[11px] font-medium text-neutral-400 uppercase tracking-wider mb-1">
                        {product.subcategoryTag || product.category}
                        {product.colorName ? ` • ${product.colorName}` : ""}
                      </div>

                      <Link
                        href={`/product/${product.slug}`}
                        className="block text-sm font-bold text-neutral-900 hover:text-neutral-700 transition-colors line-clamp-1 mb-1.5"
                      >
                        {product.name}
                      </Link>

                      {/* Pricing */}
                      <div className="flex items-center gap-2 mb-3.5">
                        <span className="text-sm font-bold text-neutral-900">
                          {formatPrice(product.price)}
                        </span>
                        {product.originalPrice && product.originalPrice > product.price && (
                          <>
                            <span className="text-xs text-neutral-400 line-through">
                              {formatPrice(product.originalPrice)}
                            </span>
                            {discountPercent && (
                              <span className="text-[10px] font-semibold text-red-600 bg-red-50 px-1.5 py-0.5 rounded">
                                {discountPercent}% OFF
                              </span>
                            )}
                          </>
                        )}
                      </div>

                      {/* Size Selector */}
                      {product.sizes && product.sizes.length > 0 && (
                        <div className="mb-4">
                          <span className="block text-[11px] font-medium text-neutral-500 mb-1.5">
                            Select Size: <strong className="text-neutral-900">{currentSize}</strong>
                          </span>
                          <div className="flex flex-wrap gap-1.5">
                            {product.sizes.map((size) => (
                              <button
                                key={size}
                                type="button"
                                onClick={() => handleSelectSize(product.id, size)}
                                className={`text-[11px] font-semibold px-2 py-1 rounded transition-colors cursor-pointer ${
                                  currentSize === size
                                    ? "bg-neutral-900 text-white"
                                    : "bg-neutral-100 text-neutral-700 hover:bg-neutral-200"
                                }`}
                              >
                                {size}
                              </button>
                            ))}
                          </div>
                        </div>
                      )}
                    </div>

                    {/* Move to Bag CTA */}
                    <button
                      type="button"
                      onClick={() => handleMoveToBag(product)}
                      disabled={isMoving}
                      className="w-full inline-flex items-center justify-center gap-2 bg-neutral-900 text-white hover:bg-black py-2.5 px-3 rounded-lg text-xs font-semibold transition-colors cursor-pointer disabled:opacity-50 mt-2"
                    >
                      <ShoppingCart size={13} />
                      <span>{isMoving ? "Moving to Bag..." : "Move to Bag"}</span>
                    </button>
                  </div>
                </div>
              );
            })}
          </div>
        ) : (
          /* Empty State */
          <div className="bg-white border border-neutral-200/60 rounded-[24px] p-8 sm:p-10 text-center max-w-lg mx-auto shadow-xl shadow-neutral-200/50">
            <div className="mx-auto mb-4 max-w-[380px]">
              <Image
                src="/empty-wishlist-v2.png"
                alt="Empty Wishlist"
                width={500}
                height={250}
                className="w-full h-auto object-contain drop-shadow-sm scale-110"
                priority
              />
            </div>
            <h2 className="text-2xl font-bold text-neutral-900 mb-3">
              Your Wishlist is Empty
            </h2>
            <p className="text-sm sm:text-base text-neutral-500 leading-relaxed max-w-lg mx-auto mb-8">
              You haven&apos;t saved any favorites yet. Explore our elevated oversized tees, luxury court kicks, and street silhouettes to build your lineup.
            </p>
            <div className="flex flex-col sm:flex-row items-center justify-center gap-4">
              <Link
                href="/clothing"
                className="w-full sm:w-auto inline-flex items-center justify-center gap-2 bg-[#111111] text-white px-8 py-3.5 rounded-xl text-sm font-semibold hover:bg-black transition-all shadow-md shadow-neutral-200"
              >
                <span>Shop Clothing</span>
                <ArrowRight size={15} />
              </Link>
              <Link
                href="/shoes"
                className="w-full sm:w-auto inline-flex items-center justify-center gap-2 bg-transparent border border-neutral-300 text-neutral-800 px-8 py-3.5 rounded-xl text-sm font-semibold hover:border-neutral-400 hover:bg-neutral-50 transition-all"
              >
                <span>Explore Footwear</span>
              </Link>
            </div>
          </div>
        )}

        {/* Recommended / Trending Section */}
        <div className="mt-20 pt-10 border-t border-neutral-200/80">
          <div className="flex items-center justify-between mb-6">
            <div>
              <div className="flex items-center gap-2">
                <Sparkles size={16} className="text-amber-500" />
                <h2 className="text-lg font-bold text-neutral-900">
                  Trending Essentials
                </h2>
              </div>
              <p className="text-xs text-neutral-500 mt-0.5">
                Popular picks trending among members this week.
              </p>
            </div>

            <Link
              href="/collections"
              className="text-xs font-semibold text-neutral-700 hover:text-neutral-950 flex items-center gap-1"
            >
              <span>View All</span>
              <ChevronRight size={13} />
            </Link>
          </div>

          <div className="grid grid-cols-2 md:grid-cols-4 gap-4 sm:gap-6">
            {recommendedProducts.map((product) => (
              <ProductCard key={product.id} product={product} />
            ))}
          </div>
        </div>
      </Container>
    </div>
  );
}
