"use client";

import React, { useState, useEffect } from "react";
import Image from "next/image";
import Link from "next/link";
import { useRouter } from "next/navigation";
import { useCart } from "@/context/CartContext";
import { useWishlist } from "@/context/WishlistContext";
import { Container } from "@/components/ui/Container";
import { ProductCard } from "@/components/features/ProductCard";
import { products } from "@/data/products";
import { formatPrice } from "@/lib/utils";
import {
  ShoppingBag,
  Trash2,
  Heart,
  ArrowRight,
  ChevronRight,
  ShieldCheck,
  Truck,
  RotateCcw,
  Sparkles,
  Tag,
  Check,
  X,
  Minus,
  Plus,
  CheckCircle2,
} from "lucide-react";

export default function CartPage() {
  const router = useRouter();
  const {
    items,
    totalItems,
    subtotal,
    bundleDiscount,
    finalSubtotal,
    hasFreeShipping,
    amountUntilFreeShipping,
    freeShippingThreshold,
    appliedCoupon,
    couponDiscount,
    applyCoupon,
    removeCoupon,
    updateQuantity,
    removeFromCart,
    clearCart,
  } = useCart();

  const { addToWishlist } = useWishlist();

  // Coupon state
  const [couponCode, setCouponCode] = useState("");
  const [couponError, setCouponError] = useState<string | null>(null);
  const [toastMessage, setToastMessage] = useState<string | null>(null);

  const showToast = (message: string) => {
    setToastMessage(message);
    setTimeout(() => {
      setToastMessage((current) => (current === message ? null : current));
    }, 3000);
  };

  const handleApplyCoupon = (e: React.FormEvent) => {
    e.preventDefault();
    setCouponError(null);
    if (!couponCode.trim()) return;

    const result = applyCoupon(couponCode.trim());
    if (result.success) {
      showToast(result.message);
      setCouponCode("");
    } else {
      setCouponError(result.message);
    }
  };

  const handleMoveToWishlist = (productId: string, size: string) => {
    const cartItem = items.find(
      (item) => item.product.id === productId && item.selectedSize === size
    );
    if (!cartItem) return;

    addToWishlist(cartItem.product, size);
    removeFromCart(productId, size);
    showToast(`Moved ${cartItem.product.name} (${size}) to Wishlist`);
  };

  // Grand total calculation
  const deliveryFee = hasFreeShipping ? 0 : 99;
  const grandTotal = Math.max(0, finalSubtotal - couponDiscount + deliveryFee);
  const totalSavings = bundleDiscount + couponDiscount;

  // Free shipping progress percentage
  const shippingProgress = Math.min(
    100,
    Math.round((subtotal / freeShippingThreshold) * 100)
  );

  // Recommendations for empty state or below cart
  const recommendedProducts = products.slice(0, 4);

  return (
    <div className="bg-neutral-50/70 min-h-screen pb-24">
      {/* Top Banner / Breadcrumbs */}
      <div className="border-b border-neutral-200/80 bg-white">
        <Container>
          <div className="py-3 flex items-center justify-between text-xs text-neutral-500">
            <div className="flex items-center gap-2">
              <Link href="/" className="hover:text-neutral-900 transition-colors">
                Home
              </Link>
              <ChevronRight size={12} className="text-neutral-400" />
              <span className="text-neutral-900 font-semibold">
                Shopping Bag
              </span>
            </div>
            <Link
              href="/collections"
              className="hidden sm:inline-flex items-center gap-1 font-medium hover:text-neutral-900 transition-colors text-xs"
            >
              <span>Continue Shopping</span>
              <ArrowRight size={12} />
            </Link>
          </div>
        </Container>
      </div>

      {/* Floating Toast Notification */}
      {toastMessage && (
        <div className="fixed bottom-6 right-6 z-50 animate-in fade-in slide-in-from-bottom-3 duration-200">
          <div className="bg-neutral-900 text-white px-4 py-3 rounded-lg shadow-xl flex items-center gap-3 text-xs font-medium border border-neutral-800">
            <Check size={15} className="text-emerald-400 shrink-0" />
            <span>{toastMessage}</span>
            <button
              type="button"
              onClick={() => setToastMessage(null)}
              className="text-neutral-400 hover:text-white transition-colors ml-1 cursor-pointer"
            >
              <X size={14} />
            </button>
          </div>
        </div>
      )}

      <Container className="pt-8 sm:pt-10">
        {/* Page Header */}
        <div className="max-w-6xl mx-auto mb-8">
          <div className="flex items-center justify-between pb-6 border-b border-neutral-200/80">
            <div className="flex items-center gap-3">
              <h1 className="text-2xl sm:text-3xl font-bold tracking-tight text-neutral-900">
                Shopping Bag
              </h1>
              <span className="inline-flex items-center px-2.5 py-0.5 rounded-full text-xs font-semibold bg-neutral-900 text-white">
                {totalItems} {totalItems === 1 ? "Item" : "Items"}
              </span>
            </div>

            {items.length > 0 && (
              <button
                type="button"
                onClick={clearCart}
                className="text-xs text-neutral-500 hover:text-red-600 transition-colors cursor-pointer"
              >
                Clear Bag
              </button>
            )}
          </div>
        </div>

        {items.length > 0 ? (
          <div className="max-w-6xl mx-auto grid grid-cols-1 lg:grid-cols-12 gap-8">
            {/* ── LEFT COLUMN: ITEMS LIST & OFFERS ── */}
            <div className="lg:col-span-8 space-y-6">
              {/* Free Express Delivery Progress Banner (No Emojis) */}
              <div className="bg-white border border-neutral-200/90 rounded-xl p-4 shadow-2xs">
                <div className="flex items-center justify-between text-xs mb-2">
                  <div className="flex items-center gap-2">
                    {hasFreeShipping ? (
                      <div className="flex items-center gap-1.5 text-emerald-800 font-semibold">
                        <CheckCircle2 size={15} className="text-emerald-600 shrink-0" />
                        <span>Complimentary Express Delivery Unlocked</span>
                      </div>
                    ) : (
                      <div className="flex items-center gap-1.5 text-neutral-700">
                        <Truck size={15} className="text-neutral-800 shrink-0" />
                        <span>
                          Add <strong className="text-neutral-950 font-bold">{formatPrice(amountUntilFreeShipping)}</strong> more for Complimentary Express Delivery
                        </span>
                      </div>
                    )}
                  </div>
                  <span className="text-[11px] text-neutral-400 font-mono">
                    ₹{freeShippingThreshold} Target
                  </span>
                </div>

                <div className="w-full bg-neutral-100 rounded-full h-1.5 overflow-hidden">
                  <div
                    className={`h-full transition-all duration-300 ${
                      hasFreeShipping ? "bg-emerald-600" : "bg-neutral-900"
                    }`}
                    style={{ width: `${shippingProgress}%` }}
                  />
                </div>
              </div>

              {/* Items Table / Cards */}
              <div className="bg-white border border-neutral-200/90 rounded-xl divide-y divide-neutral-100 shadow-xs overflow-hidden">
                {items.map((item) => {
                  const lineTotal = item.product.price * item.quantity;
                  return (
                    <div
                      key={`${item.product.id}-${item.selectedSize}`}
                      className="p-5 sm:p-6 flex flex-col sm:flex-row gap-4 sm:gap-6 items-start justify-between"
                    >
                      {/* Product Thumbnail & Basic Info */}
                      <div className="flex items-start gap-4 min-w-0 flex-1">
                        <Link
                          href={`/product/${item.product.slug}`}
                          className="relative w-20 h-24 sm:w-24 sm:h-28 bg-neutral-100 rounded-lg overflow-hidden shrink-0 block group border border-neutral-200/70"
                        >
                          <Image
                            src={item.product.imageUrl}
                            alt={item.product.name}
                            fill
                            sizes="96px"
                            className="object-cover object-center group-hover:scale-105 transition-transform duration-300"
                          />
                        </Link>

                        <div className="space-y-1 min-w-0">
                          <span className="text-[10px] font-bold text-neutral-400 uppercase tracking-wider block">
                            {item.product.subcategoryTag || item.product.category}
                          </span>
                          <Link
                            href={`/product/${item.product.slug}`}
                            className="text-sm font-bold text-neutral-900 hover:text-neutral-700 transition-colors line-clamp-1 block"
                          >
                            {item.product.name}
                          </Link>
                          <div className="text-xs text-neutral-500">
                            Size: <span className="font-semibold text-neutral-900">{item.selectedSize}</span>
                            {item.product.colorName && ` • Color: ${item.product.colorName}`}
                          </div>

                          <div className="text-xs font-semibold text-neutral-900 pt-1 sm:hidden">
                            {formatPrice(item.product.price)} each
                          </div>

                          {/* Action links */}
                          <div className="flex items-center gap-4 pt-3 text-xs">
                            <button
                              type="button"
                              onClick={() => handleMoveToWishlist(item.product.id, item.selectedSize)}
                              className="inline-flex items-center gap-1.5 text-neutral-500 hover:text-neutral-900 transition-colors cursor-pointer"
                            >
                              <Heart size={13} />
                              <span>Save for Later</span>
                            </button>
                            <span className="text-neutral-300">•</span>
                            <button
                              type="button"
                              onClick={() => removeFromCart(item.product.id, item.selectedSize)}
                              className="inline-flex items-center gap-1.5 text-neutral-400 hover:text-red-600 transition-colors cursor-pointer"
                            >
                              <Trash2 size={13} />
                              <span>Remove</span>
                            </button>
                          </div>
                        </div>
                      </div>

                      {/* Quantity Stepper & Price */}
                      <div className="flex sm:flex-col items-center sm:items-end justify-between w-full sm:w-auto gap-4 sm:gap-3 shrink-0 pt-2 sm:pt-0 border-t sm:border-t-0 border-neutral-100">
                        <div className="text-right hidden sm:block">
                          <div className="text-sm font-bold text-neutral-900">
                            {formatPrice(lineTotal)}
                          </div>
                          {item.quantity > 1 && (
                            <div className="text-[11px] text-neutral-400">
                              {formatPrice(item.product.price)} each
                            </div>
                          )}
                        </div>

                        {/* Quantity controls */}
                        <div className="flex items-center border border-neutral-200 rounded-lg overflow-hidden">
                          <button
                            type="button"
                            onClick={() => {
                              if (item.quantity > 1) {
                                updateQuantity(item.product.id, item.selectedSize, item.quantity - 1);
                              } else {
                                removeFromCart(item.product.id, item.selectedSize);
                              }
                            }}
                            aria-label="Decrease quantity"
                            className="w-8 h-8 flex items-center justify-center text-neutral-600 hover:bg-neutral-100 transition-colors cursor-pointer"
                          >
                            <Minus size={13} />
                          </button>
                          <span className="w-8 text-center text-xs font-bold text-neutral-900">
                            {item.quantity}
                          </span>
                          <button
                            type="button"
                            onClick={() =>
                              updateQuantity(item.product.id, item.selectedSize, item.quantity + 1)
                            }
                            aria-label="Increase quantity"
                            className="w-8 h-8 flex items-center justify-center text-neutral-600 hover:bg-neutral-100 transition-colors cursor-pointer"
                          >
                            <Plus size={13} />
                          </button>
                        </div>

                        <div className="text-right sm:hidden">
                          <span className="text-sm font-bold text-neutral-900">
                            {formatPrice(lineTotal)}
                          </span>
                        </div>
                      </div>
                    </div>
                  );
                })}
              </div>

              {/* Multi-Tee Bundle Editorial Banner (Clean Professional Styling) */}
              <div className="bg-white border border-neutral-200/90 rounded-xl p-4 flex items-center justify-between gap-4 shadow-2xs">
                <div className="flex items-center gap-3">
                  <div className="w-8 h-8 rounded-lg bg-neutral-100 text-neutral-800 flex items-center justify-center shrink-0">
                    <Sparkles size={15} />
                  </div>
                  <div>
                    <span className="text-xs font-bold text-neutral-900 block tracking-wide uppercase">
                      Archive T-Shirt Bundle Pass
                    </span>
                    <span className="text-[11px] text-neutral-500">
                      Buy any 3 Archive T-Shirts for ₹1,199. Tier savings automatically apply to your bag.
                    </span>
                  </div>
                </div>
                <Link
                  href="/clothing"
                  className="text-xs font-semibold text-neutral-900 hover:underline shrink-0"
                >
                  Explore Drops →
                </Link>
              </div>
            </div>

            {/* ── RIGHT COLUMN: ORDER SUMMARY & CHECKOUT ── */}
            <div className="lg:col-span-4 space-y-6">
              {/* Order Summary Card */}
              <div className="bg-white border border-neutral-200/90 rounded-xl p-6 shadow-xs space-y-5 sticky top-24">
                <h2 className="text-sm font-bold text-neutral-900 pb-3 border-b border-neutral-100">
                  Order Summary
                </h2>

                {/* Promo Code Input */}
                <div>
                  <form onSubmit={handleApplyCoupon} className="flex gap-2">
                    <div className="relative flex-1">
                      <Tag size={13} className="absolute left-3 top-1/2 -translate-y-1/2 text-neutral-400" />
                      <input
                        type="text"
                        value={couponCode}
                        onChange={(e) => setCouponCode(e.target.value.toUpperCase())}
                        placeholder="ENTER COUPON CODE"
                        className="w-full text-xs font-mono uppercase pl-8 pr-3 py-2 border border-neutral-300 rounded-lg focus-visible:outline-hidden focus-visible:ring-2 focus-visible:ring-black bg-white"
                      />
                    </div>
                    <button
                      type="submit"
                      className="bg-neutral-900 text-white text-xs font-semibold px-3 py-2 rounded-lg hover:bg-black transition-colors cursor-pointer"
                    >
                      Apply
                    </button>
                  </form>

                  {couponError && (
                    <p className="text-[11px] text-red-600 mt-1.5">{couponError}</p>
                  )}

                  {appliedCoupon && (
                    <div className="mt-2 flex items-center justify-between bg-emerald-50 border border-emerald-200/70 px-2.5 py-1.5 rounded-lg text-xs">
                      <div className="flex items-center gap-1.5 text-emerald-800 font-semibold">
                        <Check size={13} />
                        <span>Code &quot;{appliedCoupon}&quot; Applied</span>
                      </div>
                      <button
                        type="button"
                        onClick={removeCoupon}
                        className="text-emerald-700 hover:text-emerald-950 font-bold cursor-pointer text-xs"
                      >
                        Remove
                      </button>
                    </div>
                  )}

                  <p className="text-[10px] text-neutral-400 mt-1.5">
                    Try code: <strong className="text-neutral-700">VEYRO10</strong> for 10% off
                  </p>
                </div>

                {/* Price Breakdown */}
                <div className="space-y-2.5 text-xs pt-3 border-t border-neutral-100">
                  <div className="flex justify-between text-neutral-600">
                    <span>Items Total (MRP)</span>
                    <span className="font-medium text-neutral-900">{formatPrice(subtotal)}</span>
                  </div>

                  {bundleDiscount > 0 && (
                    <div className="flex justify-between text-emerald-700 font-semibold">
                      <span>Bundle Savings</span>
                      <span>-{formatPrice(bundleDiscount)}</span>
                    </div>
                  )}

                  {couponDiscount > 0 && (
                    <div className="flex justify-between text-emerald-700 font-semibold">
                      <span>Coupon Discount</span>
                      <span>-{formatPrice(couponDiscount)}</span>
                    </div>
                  )}

                  <div className="flex justify-between text-neutral-600">
                    <span>Estimated Delivery</span>
                    <span>
                      {deliveryFee === 0 ? (
                        <span className="text-emerald-700 font-bold uppercase">FREE</span>
                      ) : (
                        formatPrice(deliveryFee)
                      )}
                    </span>
                  </div>

                  {totalSavings > 0 && (
                    <div className="bg-emerald-50/70 p-2.5 rounded-lg text-[11px] text-emerald-800 font-medium">
                      You are saving {formatPrice(totalSavings)} on this order!
                    </div>
                  )}

                  <div className="pt-3 border-t border-neutral-100 flex justify-between items-baseline">
                    <div>
                      <span className="text-sm font-bold text-neutral-900 block">Total Payable</span>
                      <span className="text-[10px] text-neutral-400">Inclusive of all taxes</span>
                    </div>
                    <span className="text-lg font-bold text-neutral-900 tabular-nums">
                      {formatPrice(grandTotal)}
                    </span>
                  </div>
                </div>

                {/* Primary Proceed to Checkout Link */}
                <Link
                  href="/checkout"
                  className="w-full bg-neutral-900 text-white hover:bg-black py-3.5 px-4 rounded-lg text-xs font-bold uppercase tracking-wider flex items-center justify-center gap-2 transition-colors cursor-pointer shadow-md text-center"
                >
                  <span>Proceed to Checkout</span>
                  <ArrowRight size={14} />
                </Link>

                {/* Trust Badges */}
                <div className="pt-3 border-t border-neutral-100 space-y-2 text-[11px] text-neutral-500">
                  <div className="flex items-center gap-2">
                    <ShieldCheck size={14} className="text-neutral-700 shrink-0" />
                    <span>256-Bit SSL Bank-Grade Encrypted Checkout</span>
                  </div>
                  <div className="flex items-center gap-2">
                    <RotateCcw size={14} className="text-neutral-700 shrink-0" />
                    <span>7-Day Free Doorstep Pickup & Exchanges</span>
                  </div>
                </div>
              </div>
            </div>
          </div>
        ) : (
          /* Empty Bag State */
          <div className="bg-white border border-neutral-200/60 rounded-[24px] p-8 sm:p-10 text-center max-w-lg mx-auto shadow-xl shadow-neutral-200/50">
            <div className="mx-auto mb-2 max-w-[280px]">
              <Image
                src="/empty-bag.png"
                alt="Empty Shopping Bag"
                width={400}
                height={200}
                className="w-full h-auto object-contain drop-shadow-sm"
                priority
              />
            </div>
            <h2 className="text-xl font-bold text-neutral-900 mb-2">
              Your Shopping Bag is Empty
            </h2>
            <p className="text-xs sm:text-sm text-neutral-500 leading-relaxed max-w-md mx-auto mb-8">
              Looks like you haven&apos;t added any items to your bag yet. Check out our latest oversized tees, luxury court kicks, and street silhouettes.
            </p>
            <div className="flex flex-col sm:flex-row items-center justify-center gap-3">
              <Link
                href="/clothing"
                className="w-full sm:w-auto inline-flex items-center justify-center gap-2 bg-neutral-900 text-white px-8 py-3 rounded-lg text-sm font-semibold hover:bg-black transition-colors shadow-md"
              >
                <span>Shop Clothing</span>
                <ArrowRight size={16} />
              </Link>
              <Link
                href="/wishlist"
                className="w-full sm:w-auto inline-flex items-center justify-center gap-2 bg-transparent border border-neutral-300 text-neutral-800 px-8 py-3 rounded-lg text-sm font-semibold hover:bg-neutral-50 transition-colors"
              >
                <Heart size={16} />
                <span>View Wishlist</span>
              </Link>
            </div>
          </div>
        )}

        {/* Trending Recommendations */}
        <div className="mt-20 pt-10 border-t border-neutral-200/80">
          <div className="flex items-center justify-between mb-6">
            <div>
              <div className="flex items-center gap-2">
                <Sparkles size={16} className="text-amber-500" />
                <h2 className="text-lg font-bold text-neutral-900">
                  Recommended Drops
                </h2>
              </div>
              <p className="text-xs text-neutral-500 mt-0.5">
                Popular bestsellers handpicked for your wardrobe.
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
