"use client";

import React, { useState, useEffect, useRef, useSyncExternalStore } from "react";
import Image from "next/image";
import Link from "next/link";
import { useRouter } from "next/navigation";
import { useCart } from "@/context/CartContext";
import { useWishlist } from "@/context/WishlistContext";
import { useUser } from "@/context/UserContext";
import { Container } from "@/components/ui/Container";
import { Toast } from "@/components/ui/Toast";
import { Skeleton } from "@/components/ui/Skeleton";
import { ProductCard } from "@/components/features/ProductCard";
import { AtelierGiftSuite } from "@/components/features/AtelierGiftSuite";
import { useProducts } from "@/context/ProductsContext";
import { formatPrice } from "@/lib/utils";
import {
  Trash2,
  Heart,
  ArrowRight,
  ChevronRight,
  ShieldCheck,
  RotateCcw,
  Sparkles,
  Tag,
  Check,
  Minus,
  Plus,
  PackageX,
  Gift,
} from "lucide-react";

const emptySubscribe = () => () => {};
function useMounted() {
  return useSyncExternalStore(
    emptySubscribe,
    () => true,
    () => false
  );
}

export default function CartPage() {
  const { products } = useProducts();
  const {
    items,
    oosItems,
    inStockCount,
    oosCount,
    totalItems,
    subtotal,
    bundleDiscount,
    finalSubtotal,
    hasFreeShipping,
    hasOosItems,
    appliedCoupon,
    couponDiscount,
    applyCoupon,
    removeCoupon,
    updateQuantity,
    removeFromCart,
    removeOosItems,
    clearCart,
    giftPackaging,
    giftPackagingFee,
  } = useCart();

  const router = useRouter();
  const { user, openAccountModal } = useUser();
  const { addToWishlist } = useWishlist();
  const isMounted = useMounted();

  // If user is prompted to sign in when attempting to checkout, automatically redirect to checkout upon login
  const waitingForLoginRef = useRef(false);

  useEffect(() => {
    if (user && waitingForLoginRef.current) {
      waitingForLoginRef.current = false;
      router.push("/checkout");
    }
  }, [user, router]);

  const handleProceedToCheckout = () => {
    if (inStockCount === 0) return;
    if (user) {
      // User is already logged in: Never ask, proceed directly to checkout
      router.push("/checkout");
    } else {
      // User is not logged in: Open the login/account modal directly
      waitingForLoginRef.current = true;
      openAccountModal();
    }
  };

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

  const [isDismissingOos, setIsDismissingOos] = useState(false);

  const handleMoveAllOosToWishlist = () => {
    if (oosItems.length === 0 || isDismissingOos) return;
    setIsDismissingOos(true);
    setTimeout(() => {
      oosItems.forEach((item) => {
        addToWishlist(item.product, item.selectedSize);
      });
      removeOosItems();
      setIsDismissingOos(false);
      showToast(
        `Moved ${oosItems.length} out-of-stock item${oosItems.length > 1 ? "s" : ""} to Wishlist`
      );
    }, 200);
  };

  const handleRemoveAllOos = () => {
    if (oosItems.length === 0 || isDismissingOos) return;
    setIsDismissingOos(true);
    setTimeout(() => {
      removeOosItems();
      setIsDismissingOos(false);
      showToast("Removed out-of-stock items from bag");
    }, 200);
  };

  // Grand total calculation based on available in-stock items + gift packaging
  const deliveryFee = inStockCount === 0 ? 0 : hasFreeShipping ? 0 : 99;
  const grandTotal = Math.max(0, finalSubtotal - couponDiscount + deliveryFee + giftPackagingFee);
  const totalSavings = bundleDiscount + couponDiscount;


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
      <Toast
        isOpen={Boolean(toastMessage)}
        onClose={() => setToastMessage(null)}
        variant="success"
        position="top"
        message={<span>{toastMessage}</span>}
      />

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

        {!isMounted ? (
          <div className="max-w-6xl mx-auto grid grid-cols-1 lg:grid-cols-12 gap-8" aria-hidden="true">
            {/* ── LEFT COLUMN: ITEMS LIST SKELETON ── */}
            <div className="lg:col-span-8 space-y-6">
              {/* Delivery Progress Banner Skeleton */}
              <Skeleton className="w-full h-16 rounded-xl border border-neutral-200/90" />

              {/* Cart Items List Skeletons */}
              {[...Array(2)].map((_, i) => (
                <div
                  key={i}
                  className="bg-white border border-neutral-200/90 rounded-xl p-4 sm:p-5 flex gap-4 sm:gap-5"
                >
                  <Skeleton className="w-20 h-24 sm:w-24 sm:h-28 rounded-lg shrink-0 bg-[#f4f2ee]" />
                  <div className="flex-1 flex flex-col justify-between py-0.5">
                    <div>
                      <div className="flex justify-between items-start gap-2">
                        <Skeleton className="w-3/5 h-4 sm:h-5 rounded-full" />
                        <Skeleton className="w-20 h-5 rounded-full" />
                      </div>
                      <Skeleton className="w-32 h-3 rounded-full mt-2" />
                    </div>
                    <div className="flex justify-between items-center pt-3 border-t border-neutral-100">
                      <Skeleton className="w-24 h-8 rounded-full" />
                      <Skeleton className="w-28 h-4 rounded-full" />
                    </div>
                  </div>
                </div>
              ))}
            </div>

            {/* ── RIGHT COLUMN: SUMMARY SKELETON ── */}
            <div className="lg:col-span-4 space-y-6">
              <div className="bg-white border border-neutral-200/90 rounded-xl p-6 space-y-5">
                <Skeleton className="w-32 h-4 rounded-full pb-3 border-b border-neutral-100" />
                <Skeleton className="w-full h-9 rounded-lg" />
                <div className="space-y-3 pt-2">
                  {[...Array(4)].map((_, i) => (
                    <div key={i} className="flex justify-between">
                      <Skeleton className="w-24 h-3.5 rounded-full" />
                      <Skeleton className="w-16 h-3.5 rounded-full" />
                    </div>
                  ))}
                </div>
                <div className="pt-3 border-t border-neutral-100 flex justify-between items-baseline">
                  <Skeleton className="w-28 h-5 rounded-full" />
                  <Skeleton className="w-24 h-6 rounded-full" />
                </div>
                <Skeleton className="w-full h-12 rounded-lg" />
                <div className="pt-3 border-t border-neutral-100 space-y-2">
                  <Skeleton className="w-48 h-3 rounded-full" />
                  <Skeleton className="w-40 h-3 rounded-full" />
                </div>
              </div>
            </div>
          </div>
        ) : items.length > 0 ? (
          <div className="max-w-6xl mx-auto grid grid-cols-1 lg:grid-cols-12 gap-8">
            {/* ── LEFT COLUMN: ITEMS LIST & OFFERS ── */}
            <div className="lg:col-span-8 space-y-6">
              {/* Out of Stock Notice Banner */}
              {hasOosItems && (
                <div
                  role="status"
                  aria-live="polite"
                  className={`bg-white border border-neutral-200/90 rounded-xl p-4 sm:p-5 flex flex-col sm:flex-row items-start sm:items-center justify-between gap-4 shadow-2xs transition-opacity duration-200 ease-out motion-reduce:transition-none ${
                    isDismissingOos ? "opacity-0 pointer-events-none" : "opacity-100"
                  }`}
                >
                  <div className="flex items-start gap-3.5">
                    <div className="w-8 h-8 rounded-lg bg-neutral-100 text-neutral-800 flex items-center justify-center shrink-0 mt-0.5 sm:mt-0">
                      <PackageX size={15} className="stroke-[2]" />
                    </div>
                    <div>
                      <h3 className="text-xs sm:text-sm font-bold text-neutral-900 tracking-tight">
                        {oosCount} {oosCount === 1 ? "item in your bag is" : "items in your bag are"} currently out of stock
                      </h3>
                      <p className="text-xs text-neutral-500 leading-relaxed mt-0.5">
                        {inStockCount > 0
                          ? `You can proceed with the ${inStockCount} available ${inStockCount === 1 ? "item" : "items"}. Unavailable pieces are excluded from billing and will remain saved in your bag.`
                          : "All items in your bag are currently out of stock. Save them to your wishlist to get notified upon restock."}
                      </p>
                    </div>
                  </div>
                  <div className="flex items-center gap-2.5 w-full sm:w-auto shrink-0 pt-1 sm:pt-0">
                    <button
                      type="button"
                      onClick={handleMoveAllOosToWishlist}
                      disabled={isDismissingOos}
                      className="group flex-1 sm:flex-none inline-flex items-center justify-center gap-1.5 h-9 px-3.5 py-2 rounded-lg bg-white border border-neutral-300 text-neutral-900 hover:border-neutral-900 hover:bg-neutral-50 active:scale-[0.98] transition-[color,background-color,border-color,transform] duration-200 ease-out motion-reduce:transition-none motion-reduce:transform-none cursor-pointer disabled:opacity-50 text-xs font-semibold text-center select-none"
                    >
                      <Heart
                        size={13}
                        className="text-neutral-600 transition-[transform,color] duration-200 ease-out motion-reduce:transform-none group-hover:scale-105 group-hover:text-rose-600 shrink-0"
                      />
                      <span>Save to Wishlist</span>
                    </button>
                    <button
                      type="button"
                      onClick={handleRemoveAllOos}
                      disabled={isDismissingOos}
                      className="group flex-1 sm:flex-none inline-flex items-center justify-center gap-1.5 h-9 px-3.5 py-2 rounded-lg bg-neutral-50/80 border border-neutral-200 text-neutral-600 hover:bg-red-50 hover:text-red-700 hover:border-red-200 active:scale-[0.98] transition-[color,background-color,border-color,transform] duration-200 ease-out motion-reduce:transition-none motion-reduce:transform-none cursor-pointer disabled:opacity-50 text-xs font-medium text-center select-none"
                    >
                      <Trash2
                        size={13}
                        className="text-neutral-400 transition-[color,transform] duration-200 ease-out motion-reduce:transform-none group-hover:text-red-600 group-hover:scale-105 shrink-0"
                      />
                      <span>Remove OOS</span>
                    </button>
                  </div>
                </div>
              )}

              {/* Items Table / Cards */}
              <div className="bg-white border border-neutral-200/90 rounded-xl divide-y divide-neutral-200/80 shadow-2xs overflow-hidden">
                {items.map((item) => {
                  const liveProduct =
                    products.find(
                      (p) => p.id === item.product.id || p.slug === item.product.slug
                    ) || item.product;
                  const lineTotal = liveProduct.price * item.quantity;
                  const isItemOos = !liveProduct.inStock;
                  return (
                    <div
                      key={`${item.product.id}-${item.selectedSize}`}
                      className={`p-4 sm:p-5 flex flex-col sm:flex-row gap-4 sm:gap-6 justify-between transition-colors duration-150 ${
                        isItemOos ? "bg-neutral-50/20" : "hover:bg-neutral-50/40"
                      }`}
                    >
                      {/* Product Thumbnail & Basic Info */}
                      <div className="flex items-start gap-4 sm:gap-5 min-w-0 flex-1">
                        <Link
                          href={`/product/${liveProduct.slug}`}
                          className="relative w-20 h-24 sm:w-24 sm:h-28 bg-neutral-100 rounded-lg overflow-hidden shrink-0 block group border border-neutral-200/70"
                        >
                          <Image
                            src={liveProduct.imageUrl}
                            alt={liveProduct.name}
                            fill
                            sizes="(max-width: 640px) 80px, 96px"
                            className={`object-cover object-center group-hover:scale-105 transition-[opacity,transform] duration-300 ease-out motion-reduce:transform-none ${
                              isItemOos ? "opacity-90 group-hover:opacity-100" : ""
                            }`}
                          />
                        </Link>

                        <div className="flex flex-col justify-between flex-1 min-h-[96px] sm:min-h-[112px] min-w-0">
                          <div className="space-y-1">
                            <span className="text-[10px] font-bold text-neutral-400 uppercase tracking-wider block">
                              {liveProduct.subcategoryTag || liveProduct.category}
                            </span>
                            <div className="flex items-center gap-2 flex-wrap">
                              <Link
                                href={`/product/${liveProduct.slug}`}
                                className="text-sm font-bold text-neutral-900 hover:text-neutral-700 transition-colors line-clamp-1"
                              >
                                {liveProduct.name}
                              </Link>
                              {isItemOos && (
                                <span
                                  aria-label="Sold Out"
                                  className="inline-flex items-center gap-1.5 px-2 py-0.5 rounded-full text-[10px] font-semibold uppercase tracking-wider bg-neutral-100 text-neutral-700 border border-neutral-200/80 shrink-0 select-none"
                                >
                                  <span className="w-1.5 h-1.5 rounded-full bg-red-500 shrink-0" />
                                  Sold Out
                                </span>
                              )}
                            </div>
                            <div className="text-xs text-neutral-500">
                              Size: <span className="font-semibold text-neutral-900">{item.selectedSize}</span>
                              {liveProduct.colorName && ` • Color: ${liveProduct.colorName}`}
                            </div>

                            {isItemOos && (
                              <p className="text-[11px] text-neutral-500 pt-0.5 leading-normal">
                                Item unavailable — excluded from order total
                              </p>
                            )}
                          </div>

                          {/* Action links aligned to bottom baseline */}
                          <div className="flex items-center gap-4 pt-3 text-xs">
                            {!isItemOos ? (
                              <>
                                <button
                                  type="button"
                                  onClick={() => handleMoveToWishlist(item.product.id, item.selectedSize)}
                                  className="group/btn inline-flex items-center gap-1.5 text-neutral-500 hover:text-neutral-900 font-medium active:scale-[0.98] transition-[color,transform] duration-150 ease-out motion-reduce:transform-none cursor-pointer"
                                >
                                  <Heart
                                    size={13}
                                    className="text-neutral-400 group-hover/btn:text-rose-600 group-hover/btn:scale-105 transition-[color,transform] duration-200 ease-out motion-reduce:transform-none shrink-0"
                                  />
                                  <span>Save for Later</span>
                                </button>
                                <span className="text-neutral-300">•</span>
                                <button
                                  type="button"
                                  onClick={() => removeFromCart(item.product.id, item.selectedSize)}
                                  className="group/btn inline-flex items-center gap-1.5 text-neutral-400 hover:text-red-600 font-medium active:scale-[0.98] transition-[color,transform] duration-150 ease-out motion-reduce:transform-none cursor-pointer"
                                >
                                  <Trash2
                                    size={13}
                                    className="text-neutral-400 group-hover/btn:text-red-600 group-hover/btn:scale-105 transition-[color,transform] duration-200 ease-out motion-reduce:transform-none shrink-0"
                                  />
                                  <span>Remove</span>
                                </button>
                              </>
                            ) : (
                              <button
                                type="button"
                                onClick={() => removeFromCart(item.product.id, item.selectedSize)}
                                className="group/btn inline-flex items-center gap-1.5 text-neutral-400 hover:text-red-600 font-medium active:scale-[0.98] transition-[color,transform] duration-150 ease-out motion-reduce:transform-none cursor-pointer"
                              >
                                <Trash2
                                  size={13}
                                  className="text-neutral-400 group-hover/btn:text-red-600 group-hover/btn:scale-105 transition-[color,transform] duration-200 ease-out motion-reduce:transform-none shrink-0"
                                />
                                <span>Remove from bag</span>
                              </button>
                            )}
                          </div>
                        </div>
                      </div>

                      {/* Quantity Stepper & Price or OOS Actions with Dual-Baseline Alignment */}
                      {isItemOos ? (
                        <div className="flex sm:flex-col items-center sm:items-end justify-between sm:self-stretch w-full sm:w-auto shrink-0 pt-3 sm:pt-0 border-t sm:border-t-0 border-neutral-100 gap-3">
                          <div className="text-left sm:text-right">
                            <div className="text-sm font-semibold text-neutral-400 line-through tabular-nums">
                              {formatPrice(lineTotal)}
                            </div>
                            <span className="text-[10px] font-bold uppercase tracking-wider text-neutral-400 block mt-0.5">
                              Excluded
                            </span>
                          </div>

                          <div className="flex items-center gap-2">
                            <button
                              type="button"
                              onClick={() => handleMoveToWishlist(item.product.id, item.selectedSize)}
                              className="group/oosbtn inline-flex items-center justify-center gap-2 h-9 px-3.5 py-2 rounded-lg bg-white border border-neutral-300 text-neutral-900 hover:border-neutral-900 hover:bg-neutral-50 active:scale-[0.98] transition-[color,background-color,border-color,transform] duration-200 ease-out motion-reduce:transition-none motion-reduce:transform-none text-xs font-semibold cursor-pointer shadow-2xs select-none"
                            >
                              <Heart
                                size={13}
                                className="text-neutral-600 group-hover/oosbtn:text-rose-600 group-hover/oosbtn:scale-105 transition-[transform,color] duration-200 ease-out motion-reduce:transform-none shrink-0"
                              />
                              <span>Move to Wishlist</span>
                            </button>
                          </div>
                        </div>
                      ) : (
                        <div className="flex sm:flex-col items-center sm:items-end justify-between sm:self-stretch w-full sm:w-auto shrink-0 pt-3 sm:pt-0 border-t sm:border-t-0 border-neutral-100 gap-3">
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
                          <div className="flex items-center border border-neutral-200 rounded-lg overflow-hidden bg-white shadow-2xs">
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
                              className="w-8 h-8 flex items-center justify-center text-neutral-600 hover:text-neutral-950 hover:bg-neutral-100 active:scale-[0.92] transition-[transform,background-color,color] duration-150 ease-out motion-reduce:transform-none cursor-pointer"
                            >
                              <Minus size={13} />
                            </button>
                            <span className="w-8 text-center text-xs font-bold text-neutral-900 select-none">
                              {item.quantity}
                            </span>
                            <button
                              type="button"
                              onClick={() =>
                                updateQuantity(item.product.id, item.selectedSize, item.quantity + 1)
                              }
                              aria-label="Increase quantity"
                              className="w-8 h-8 flex items-center justify-center text-neutral-600 hover:text-neutral-950 hover:bg-neutral-100 active:scale-[0.92] transition-[transform,background-color,color] duration-150 ease-out motion-reduce:transform-none cursor-pointer"
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
                      )}
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
                  className="group inline-flex items-center gap-1 text-xs font-semibold text-neutral-900 hover:text-neutral-700 active:scale-[0.98] transition-[color,transform] duration-150 ease-out motion-reduce:transform-none shrink-0"
                >
                  <span>Explore Drops</span>
                  <ArrowRight size={13} className="transition-transform duration-200 ease-out group-hover:translate-x-0.5 motion-reduce:transform-none" />
                </Link>
              </div>

              {/* Atelier Haute-Couture Gift Suite & Keepsake Note */}
              <AtelierGiftSuite />
            </div>

            {/* ── RIGHT COLUMN: ORDER SUMMARY & CHECKOUT ── */}
            <div className="lg:col-span-4 space-y-6">
              {/* Order Summary Card */}
              <div className="bg-white border border-neutral-200/90 rounded-2xl p-6 shadow-xs space-y-5 sticky top-24">
                <div className="flex items-center justify-between pb-3.5 border-b border-neutral-100">
                  <h2 className="text-sm font-bold text-neutral-900 tracking-tight">
                    Order Summary
                  </h2>
                  <span className="text-[11px] font-semibold text-neutral-400 uppercase tracking-wider font-mono">
                    {inStockCount} {inStockCount === 1 ? "Item" : "Items"}
                  </span>
                </div>

                {/* Promo Code Input or Applied Coupon Badge */}
                <div>
                  {appliedCoupon ? (
                    <div className="flex items-center justify-between bg-neutral-50/90 border border-neutral-200/90 rounded-xl px-3.5 py-2.5 transition-[opacity,transform] duration-200 ease-out">
                      <div className="flex items-center gap-2.5 min-w-0">
                        <div className="w-6 h-6 rounded-md bg-emerald-100 text-emerald-800 flex items-center justify-center shrink-0">
                          <Check size={12} className="stroke-[2.5]" />
                        </div>
                        <div className="min-w-0">
                          <div className="flex items-center gap-1.5">
                            <span className="font-mono text-xs font-bold text-neutral-900 tracking-wider">
                              {appliedCoupon}
                            </span>
                            <span className="text-[10px] font-bold text-emerald-700 uppercase tracking-wider bg-emerald-50 px-1.5 py-0.5 rounded border border-emerald-200/60">
                              Applied
                            </span>
                          </div>
                          <p className="text-[11px] text-neutral-500 truncate">
                            Saving {formatPrice(couponDiscount)} on this order
                          </p>
                        </div>
                      </div>
                      <button
                        type="button"
                        onClick={removeCoupon}
                        className="text-xs font-semibold text-neutral-400 hover:text-red-600 active:scale-95 transition-[color,transform] duration-150 ease-out cursor-pointer p-1"
                        aria-label="Remove coupon"
                      >
                        Remove
                      </button>
                    </div>
                  ) : (
                    <div className="space-y-2">
                      <form onSubmit={handleApplyCoupon} className="flex gap-2">
                        <div className="relative flex-1">
                          <Tag size={13} className="absolute left-3 top-1/2 -translate-y-1/2 text-neutral-400" />
                          <input
                            type="text"
                            value={couponCode}
                            onChange={(e) => setCouponCode(e.target.value.toUpperCase())}
                            placeholder="ENTER COUPON CODE"
                            className="w-full text-xs font-mono uppercase pl-8 pr-3 py-2.5 border border-neutral-300 rounded-lg focus-visible:outline-hidden focus-visible:ring-2 focus-visible:ring-black bg-white transition-[border-color,box-shadow] duration-150 ease-out placeholder:text-neutral-400"
                          />
                        </div>
                        <button
                          type="submit"
                          disabled={!couponCode.trim()}
                          className="bg-neutral-900 text-white text-xs font-semibold px-4 py-2.5 rounded-lg hover:bg-black active:scale-[0.98] transition-[background-color,transform] duration-150 ease-out motion-reduce:transform-none cursor-pointer disabled:opacity-50 disabled:cursor-not-allowed shrink-0"
                        >
                          Apply
                        </button>
                      </form>

                      {couponError && (
                        <p className="text-[11px] text-red-600 pl-1">{couponError}</p>
                      )}

                      <div className="flex items-center justify-between text-[11px] text-neutral-500 pt-0.5 px-0.5">
                        <span>Available code:</span>
                        <button
                          type="button"
                          onClick={() => {
                            const result = applyCoupon("VEYRO10");
                            if (result.success) showToast(result.message);
                          }}
                          className="group inline-flex items-center gap-1 font-mono font-bold text-neutral-900 hover:text-emerald-700 active:scale-[0.98] transition-[color,transform] duration-150 ease-out cursor-pointer"
                        >
                          <span>VEYRO10</span>
                          <span className="text-[10px] text-emerald-700 font-sans font-medium">(10% off)</span>
                        </button>
                      </div>
                    </div>
                  )}
                </div>

                {/* Price Breakdown */}
                <div className="space-y-2.5 text-xs pt-3.5 border-t border-neutral-100">
                  <div className="flex justify-between text-neutral-600">
                    <span>
                      Items Total (MRP){hasOosItems && inStockCount > 0 ? ` (${inStockCount} available)` : ""}
                    </span>
                    <span className="font-medium text-neutral-900 tabular-nums">{formatPrice(subtotal)}</span>
                  </div>

                  {bundleDiscount > 0 && (
                    <div className="flex justify-between text-neutral-600">
                      <span className="flex items-center gap-1 text-emerald-700 font-medium">
                        <Sparkles size={12} className="shrink-0" />
                        <span>Bundle Pass Savings</span>
                      </span>
                      <span className="font-semibold text-emerald-700 tabular-nums">-{formatPrice(bundleDiscount)}</span>
                    </div>
                  )}

                  {couponDiscount > 0 && (
                    <div className="flex justify-between text-neutral-600">
                      <span className="flex items-center gap-1 text-emerald-700 font-medium">
                        <Tag size={12} className="shrink-0" />
                        <span>Coupon Discount ({appliedCoupon})</span>
                      </span>
                      <span className="font-semibold text-emerald-700 tabular-nums">-{formatPrice(couponDiscount)}</span>
                    </div>
                  )}

                  <div className="flex justify-between text-neutral-600">
                    <span>Estimated Delivery</span>
                    <span>
                      {deliveryFee === 0 ? (
                        <span className="text-emerald-700 font-bold uppercase tracking-wider text-[11px]">Complimentary</span>
                      ) : (
                        <span className="font-medium text-neutral-900 tabular-nums">{formatPrice(deliveryFee)}</span>
                      )}
                    </span>
                  </div>

                  {giftPackaging.enabled && (
                    <div className="flex justify-between text-neutral-600">
                      <span className="flex items-center gap-1.5 text-neutral-900 font-medium">
                        <Gift size={13} className="text-slate-400 shrink-0" />
                        <span>Signature Gift Packaging</span>
                      </span>
                      <span className="font-semibold text-neutral-900 tabular-nums">+{formatPrice(giftPackagingFee)}</span>
                    </div>
                  )}

                  {totalSavings > 0 && (
                    <div className="flex items-center justify-between bg-emerald-50/80 border border-emerald-200/60 px-3 py-2 rounded-lg text-xs mt-1">
                      <span className="text-[11px] font-semibold text-emerald-800">Total Savings</span>
                      <span className="text-xs font-bold text-emerald-700 tabular-nums">-{formatPrice(totalSavings)}</span>
                    </div>
                  )}

                  {hasOosItems && inStockCount > 0 && (
                    <div className="flex items-start gap-2 bg-neutral-50 border border-neutral-200/70 p-2.5 rounded-lg text-[11px] text-neutral-500 leading-relaxed mt-1">
                      <span className="w-1.5 h-1.5 rounded-full bg-neutral-400 mt-1 shrink-0" />
                      <span>
                        <strong className="text-neutral-800 font-semibold">{oosCount} unavailable item{oosCount > 1 ? "s" : ""}</strong> excluded from total and safely saved in your bag.
                      </span>
                    </div>
                  )}

                  <div className="pt-3 border-t border-neutral-100 flex justify-between items-baseline">
                    <div>
                      <span className="text-sm font-bold text-neutral-900 block tracking-tight">Total Payable</span>
                      <span className="text-[10px] text-neutral-400">All duties and taxes included</span>
                    </div>
                    <span className="text-xl font-bold text-neutral-950 tabular-nums tracking-tight">
                      {formatPrice(grandTotal)}
                    </span>
                  </div>
                </div>

                {/* Primary Proceed to Checkout Link / Disabled Button */}
                {inStockCount === 0 ? (
                  <>
                    <button
                      type="button"
                      disabled
                      aria-disabled="true"
                      className="w-full bg-neutral-300 text-neutral-500 py-3.5 px-4 rounded-xl text-xs font-bold uppercase tracking-wider flex items-center justify-center gap-2 cursor-not-allowed opacity-60 shadow-none text-center"
                    >
                      <span>All Items Out of Stock</span>
                      <ArrowRight size={14} />
                    </button>
                    <div
                      role="alert"
                      className="mt-2 text-[11px] text-amber-800 bg-amber-50 border border-amber-200 rounded-lg px-3 py-2 text-center font-medium"
                    >
                      Save items to wishlist to get notified when restocked.
                    </div>
                  </>
                ) : (
                  <button
                    type="button"
                    onClick={handleProceedToCheckout}
                    className="w-full bg-neutral-900 text-white hover:bg-black active:scale-[0.98] py-3.5 px-4 rounded-xl text-xs font-bold uppercase tracking-[0.12em] flex items-center justify-center gap-2 transition-[background-color,transform] duration-200 ease-out motion-reduce:transform-none cursor-pointer shadow-sm text-center group select-none"
                  >
                    <span>
                      {hasOosItems
                        ? `Proceed with Available Items (${inStockCount})`
                        : "Proceed to Checkout"}
                    </span>
                    <ArrowRight size={14} className="group-hover:translate-x-1 transition-transform duration-200 ease-out motion-reduce:transform-none" />
                  </button>
                )}

                {/* Trust Badges - Symmetrical Grid */}
                <div className="pt-3 border-t border-neutral-100 grid grid-cols-2 gap-2 text-[11px] text-neutral-500">
                  <div className="flex items-center gap-1.5">
                    <ShieldCheck size={13} className="text-neutral-700 shrink-0" />
                    <span>256-Bit SSL Checkout</span>
                  </div>
                  <div className="flex items-center gap-1.5 justify-end">
                    <RotateCcw size={13} className="text-neutral-700 shrink-0" />
                    <span>7-Day Easy Returns</span>
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
