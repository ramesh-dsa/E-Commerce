"use client";

import React, { useMemo } from "react";
import Image from "next/image";
import Link from "next/link";
import { useParams, useRouter, useSearchParams } from "next/navigation";
import { useUser } from "@/context/UserContext";
import { useCart } from "@/context/CartContext";
import { formatPrice } from "@/lib/utils";
import { products } from "@/data/products";
import type { OrderStatus } from "@/types";
import {
  ArrowLeft,
  Package,
  Truck,
  CheckCircle2,
  Clock,
  MapPin,
  CreditCard,
  ShoppingBag,
  ArrowRight,
  RotateCcw,
  ShieldCheck,
  ChevronRight,
  Banknote,
  Smartphone,
} from "lucide-react";

const TIMELINE_STEPS: OrderStatus[] = [
  "Confirmed",
  "Packed",
  "Shipped",
  "Out for Delivery",
  "Delivered",
];

const TIMELINE_ICONS: Record<OrderStatus, React.ReactNode> = {
  Confirmed: <Package size={16} className="stroke-[2.5]" />,
  Packed: <Package size={16} className="stroke-[2.5]" />,
  Shipped: <Truck size={16} className="stroke-[2.5]" />,
  "Out for Delivery": <Truck size={16} className="stroke-[2.5]" />,
  Delivered: <CheckCircle2 size={16} className="stroke-[2.5]" />,
};

const PAYMENT_LABELS: Record<string, { label: string; icon: React.ReactNode }> = {
  upi: { label: "UPI / QR Pay", icon: <Smartphone size={14} /> },
  cod: { label: "Cash on Delivery", icon: <Banknote size={14} /> },
  card: { label: "Card / Net Banking", icon: <CreditCard size={14} /> },
};

export default function OrderDetailPage() {
  const params = useParams();
  const router = useRouter();
  const searchParams = useSearchParams();
  const { user, orders, openAccountModal } = useUser();
  const { addToCart, openCart } = useCart();

  const orderId = typeof params.id === "string" ? params.id : params.id?.[0] || "";
  const isJustConfirmed = searchParams?.get("new") === "1" || searchParams?.get("confirmed") === "true";

  const order = useMemo(() => {
    return orders.find((o) => o.id === orderId) || null;
  }, [orders, orderId]);

  // If order is not found AND user is not logged in, ask to sign in
  if (!order && !user) {
    return (
      <div className="min-h-[70vh] flex items-center justify-center px-4">
        <div className="text-center max-w-md mx-auto">
          <div className="w-20 h-20 bg-[#f8f8f6] border border-[#e8e8e5] rounded-full flex items-center justify-center mx-auto mb-6">
            <Package size={32} className="text-neutral-400" />
          </div>
          <h1 className="text-2xl font-black tracking-tight text-[#111111] uppercase mb-3">
            Sign In To View Order
          </h1>
          <p className="text-sm text-neutral-500 mb-6">
            You need to be signed in to view order details.
          </p>
          <button
            type="button"
            onClick={openAccountModal}
            className="group inline-flex items-center gap-2 bg-[#111111] text-white px-8 py-3.5 text-xs font-black uppercase tracking-[0.18em] rounded-full hover:bg-black transition-all cursor-pointer"
          >
            <span>SIGN IN</span>
            <ArrowRight size={15} className="group-hover:translate-x-1 transition-transform stroke-[2.5]" />
          </button>
        </div>
      </div>
    );
  }

  // ── ORDER NOT FOUND ──────────────────────────────────────────────────────
  if (!order) {
    return (
      <div className="min-h-[70vh] flex items-center justify-center px-4">
        <div className="text-center max-w-md mx-auto">
          <div className="w-20 h-20 bg-red-50 border border-red-200 rounded-full flex items-center justify-center mx-auto mb-6">
            <Package size={32} className="text-red-400" />
          </div>
          <h1 className="text-2xl font-black tracking-tight text-[#111111] uppercase mb-3">
            Order Not Found
          </h1>
          <p className="text-sm text-neutral-500 mb-2 font-mono">
            Reference: <span className="font-bold text-[#111111]">{orderId}</span>
          </p>
          <p className="text-sm text-neutral-500 mb-6">
            This order doesn&apos;t exist or may have been removed.
          </p>
          <Link
            href="/orders"
            className="group inline-flex items-center gap-2 bg-[#111111] text-white px-6 py-3 text-xs font-black uppercase tracking-wider rounded-full hover:bg-black transition-all cursor-pointer"
          >
            <ArrowLeft size={14} />
            <span>VIEW ALL ORDERS</span>
          </Link>
        </div>
      </div>
    );
  }

  // ── Timeline Progress ────────────────────────────────────────────────────
  const currentStepIndex = TIMELINE_STEPS.indexOf(order.status);

  // ── Buy Again Handler ────────────────────────────────────────────────────
  const handleBuyAgain = () => {
    if (!order.items || order.items.length === 0) return;

    order.items.forEach((item) => {
      const product = products.find((p) => p.id === item.productId);
      if (product) {
        addToCart(product, item.selectedSize, item.quantity, false);
      }
    });

    router.push("/cart");
  };

  // Payment method info
  const paymentInfo = PAYMENT_LABELS[order.paymentMethod] || PAYMENT_LABELS.upi;

  return (
    <div className="min-h-[70vh] bg-white">
      {/* Header */}
      <div className="border-b border-[#e8e8e5] bg-[#fafafa]">
        <div className="max-w-4xl mx-auto px-4 sm:px-6 py-6 sm:py-8">
          {/* Back Nav */}
          <Link
            href="/orders"
            className="group inline-flex items-center gap-1.5 text-xs font-bold uppercase tracking-wider text-neutral-500 hover:text-[#111111] transition-colors mb-4 cursor-pointer"
          >
            <ArrowLeft size={14} className="group-hover:-translate-x-0.5 transition-transform" />
            <span>All Orders</span>
          </Link>

          <div className="flex flex-col sm:flex-row sm:items-center sm:justify-between gap-3">
            <div>
              <h1 className="text-xl sm:text-2xl font-black tracking-tight text-[#111111] uppercase">
                {order.id}
              </h1>
              <p className="text-xs text-neutral-500 mt-0.5">
                Placed on {order.date} • {order.itemsCount} item{order.itemsCount !== 1 ? "s" : ""}
              </p>
            </div>

            <div className="flex items-center gap-2.5">
              <button
                type="button"
                onClick={handleBuyAgain}
                disabled={!order.items || order.items.length === 0}
                className="group inline-flex items-center gap-1.5 bg-[#111111] text-white px-5 py-2.5 text-[11px] font-black uppercase tracking-wider rounded-full hover:bg-black transition-all cursor-pointer disabled:opacity-40 disabled:cursor-not-allowed"
              >
                <RotateCcw size={13} className="group-hover:-rotate-45 transition-transform" />
                <span>Buy Again</span>
              </button>
            </div>
          </div>
        </div>
      </div>

      <div className="max-w-4xl mx-auto px-4 sm:px-6 py-6 sm:py-8 space-y-6">
        {/* ── LUXURY ORDER PLACED HERO CARD ─────────────────────────────── */}
        {isJustConfirmed && (
          <div className="relative bg-[#111111] text-white rounded-xl p-6 sm:p-8 overflow-hidden animate-in fade-in slide-in-from-top-3 duration-500 shadow-2xl">
            {/* Signature Accent Line */}
            <div className="absolute top-0 left-0 w-full h-1.5 bg-[#fcd017]" />
            
            {/* Background Texture Detail */}
            <div className="absolute -top-24 -right-24 w-64 h-64 bg-white/5 rounded-full blur-3xl pointer-events-none" />

            <div className="relative z-10 flex flex-col md:flex-row items-start md:items-center justify-between gap-8">
              <div className="flex items-start gap-5">
                <div className="w-14 h-14 rounded-full bg-[#fcd017] text-[#111111] flex items-center justify-center shrink-0 shadow-[0_0_20px_rgba(252,208,23,0.3)]">
                  <CheckCircle2 size={28} className="stroke-[2.5]" />
                </div>
                <div>
                  <span className="text-[10px] font-mono uppercase tracking-[0.2em] text-[#fcd017] font-bold block mb-1.5">
                    Order Secured
                  </span>
                  <h2 className="text-2xl sm:text-3xl font-black tracking-tight uppercase mb-2">
                    Thank You.
                  </h2>
                  <p className="text-xs sm:text-sm text-neutral-400 max-w-xl leading-relaxed">
                    Reference <strong className="text-white font-mono font-bold">#{order.id}</strong> is confirmed. We are preparing your items for dispatch.
                  </p>
                </div>
              </div>
              
              <div className="flex flex-col sm:flex-row items-center gap-3 shrink-0 w-full sm:w-auto">
                <Link
                  href="/orders"
                  className="w-full sm:w-auto text-center bg-white text-[#111111] hover:bg-neutral-200 px-6 py-3.5 rounded-full text-[11px] font-black uppercase tracking-widest transition-colors"
                >
                  View Orders
                </Link>
                <Link
                  href="/clothing"
                  className="w-full sm:w-auto text-center bg-transparent border border-neutral-600 hover:border-white text-white px-6 py-3.5 rounded-full text-[11px] font-black uppercase tracking-widest transition-colors"
                >
                  Continue
                </Link>
              </div>
            </div>
          </div>
        )}

        {/* ── VISUAL TRACKING TIMELINE ─────────────────────────────────────── */}
        <section className="bg-[#fafafa] border border-[#e8e8e5] rounded-xl p-5 sm:p-6">
          <h2 className="text-[11px] font-mono font-bold uppercase tracking-[0.2em] text-neutral-400 mb-5">
            ORDER TRACKING
          </h2>

          {/* Desktop Timeline (horizontal) */}
          <div className="hidden sm:block" role="list" aria-label="Order tracking timeline">
            <div className="flex items-start justify-between relative">
              {/* Progress Bar Background */}
              <div className="absolute top-5 left-[10%] right-[10%] h-[3px] bg-[#e8e8e5] rounded-full" aria-hidden="true" />
              {/* Progress Bar Active */}
              <div
                className="absolute top-5 left-[10%] h-[3px] bg-[#111111] rounded-full transition-all duration-700 ease-out"
                style={{
                  width: `${currentStepIndex >= 0 ? (currentStepIndex / (TIMELINE_STEPS.length - 1)) * 80 : 0}%`,
                }}
                aria-hidden="true"
              />

              {TIMELINE_STEPS.map((step, idx) => {
                const isCompleted = idx <= currentStepIndex;
                const isCurrent = idx === currentStepIndex;
                const timelineEntry = order.timeline?.find((t) => t.status === step);

                return (
                  <div
                    key={step}
                    className="flex flex-col items-center relative z-10 flex-1"
                    role="listitem"
                    aria-current={isCurrent ? "step" : undefined}
                  >
                    <div
                      className={`w-10 h-10 rounded-full flex items-center justify-center border-2 transition-all duration-300 ${
                        isCompleted
                          ? isCurrent
                            ? "bg-[#111111] border-[#111111] text-white shadow-lg shadow-black/20"
                            : "bg-[#111111] border-[#111111] text-white"
                          : "bg-white border-[#e8e8e5] text-neutral-300"
                      }`}
                    >
                      {TIMELINE_ICONS[step]}
                    </div>
                    <span
                      className={`text-[10px] font-bold uppercase tracking-wider mt-2.5 text-center ${
                        isCompleted ? "text-[#111111]" : "text-neutral-300"
                      }`}
                    >
                      {step}
                    </span>
                    {timelineEntry && (
                      <span className="text-[9px] text-neutral-400 mt-0.5 text-center max-w-[100px]">
                        {timelineEntry.timestamp}
                      </span>
                    )}
                  </div>
                );
              })}
            </div>
          </div>

          {/* Mobile Timeline (vertical) */}
          <div className="sm:hidden space-y-0" role="list" aria-label="Order tracking timeline">
            {TIMELINE_STEPS.map((step, idx) => {
              const isCompleted = idx <= currentStepIndex;
              const isCurrent = idx === currentStepIndex;
              const isLast = idx === TIMELINE_STEPS.length - 1;
              const timelineEntry = order.timeline?.find((t) => t.status === step);

              return (
                <div key={step} className="flex items-start gap-3" role="listitem" aria-current={isCurrent ? "step" : undefined}>
                  {/* Dot + Line */}
                  <div className="flex flex-col items-center">
                    <div
                      className={`w-8 h-8 rounded-full flex items-center justify-center border-2 shrink-0 transition-all ${
                        isCompleted
                          ? isCurrent
                            ? "bg-[#111111] border-[#111111] text-white shadow-md shadow-black/20"
                            : "bg-[#111111] border-[#111111] text-white"
                          : "bg-white border-[#e8e8e5] text-neutral-300"
                      }`}
                    >
                      {TIMELINE_ICONS[step]}
                    </div>
                    {!isLast && (
                      <div
                        className={`w-[2px] h-8 my-1 rounded-full transition-colors ${
                          isCompleted && idx < currentStepIndex
                            ? "bg-[#111111]"
                            : "bg-[#e8e8e5]"
                        }`}
                        aria-hidden="true"
                      />
                    )}
                  </div>

                  {/* Text */}
                  <div className={`pb-3 ${isLast ? "" : "pb-0"}`}>
                    <span
                      className={`text-xs font-bold uppercase tracking-wider ${
                        isCompleted ? "text-[#111111]" : "text-neutral-300"
                      }`}
                    >
                      {step}
                    </span>
                    {timelineEntry && (
                      <>
                        <p className="text-[10px] text-neutral-400 mt-0.5">{timelineEntry.timestamp}</p>
                        <p className="text-[11px] text-neutral-500 mt-0.5">{timelineEntry.description}</p>
                      </>
                    )}
                  </div>
                </div>
              );
            })}
          </div>

          {/* Estimated Delivery Banner */}
          <div className="mt-5 pt-4 border-t border-[#e8e8e5] flex items-center justify-between">
            <span className="text-xs text-neutral-500 flex items-center gap-1.5">
              {order.status === "Delivered" ? (
                <CheckCircle2 size={14} className="text-emerald-600" />
              ) : (
                <Clock size={14} className="text-[#b8960a]" />
              )}
              <span className="font-medium">{order.estimatedDelivery}</span>
            </span>
            <span className="text-[10px] font-mono font-bold uppercase text-neutral-400 tracking-wider">
              VEYRO EXPRESS
            </span>
          </div>
        </section>

        {/* ── ORDER ITEMS ──────────────────────────────────────────────────── */}
        <section className="bg-white border border-[#e8e8e5] rounded-xl overflow-hidden">
          <div className="px-5 sm:px-6 py-4 border-b border-[#e8e8e5] bg-[#fafafa]">
            <h2 className="text-[11px] font-mono font-bold uppercase tracking-[0.2em] text-neutral-400">
              ORDER ITEMS ({order.itemsCount})
            </h2>
          </div>

          <div className="divide-y divide-[#f0f0ed]">
            {order.items && order.items.length > 0 ? (
              order.items.map((item) => (
                <div
                  key={`${item.productId}-${item.selectedSize}`}
                  className="flex items-start gap-4 p-4 sm:p-5 group"
                >
                  {/* Thumbnail */}
                  <Link
                    href={`/product/${item.productSlug}`}
                    className="relative w-16 h-16 sm:w-20 sm:h-20 rounded-lg overflow-hidden bg-[#f8f8f6] border border-[#e8e8e5] shrink-0 hover:border-neutral-300 transition-colors"
                  >
                    <Image
                      src={item.imageUrl}
                      alt={item.productName}
                      fill
                      className="object-cover"
                      sizes="80px"
                    />
                  </Link>

                  {/* Details */}
                  <div className="flex-1 min-w-0">
                    <Link
                      href={`/product/${item.productSlug}`}
                      className="text-sm font-bold text-[#111111] hover:underline underline-offset-2 transition-colors block truncate"
                    >
                      {item.productName}
                    </Link>
                    <p className="text-[11px] text-neutral-500 mt-0.5">
                      {item.colorName} • Size {item.selectedSize}
                    </p>
                    <p className="text-[11px] text-neutral-400 mt-0.5">
                      Qty: {item.quantity} × {formatPrice(item.unitPrice)}
                    </p>
                  </div>

                  {/* Price */}
                  <div className="text-right shrink-0">
                    <span className="text-sm font-black text-[#111111] tabular-nums">
                      {formatPrice(item.totalPrice)}
                    </span>
                  </div>
                </div>
              ))
            ) : (
              // Fallback for legacy orders without items[]
              order.itemNames?.map((name, idx) => (
                <div key={idx} className="flex items-center gap-3 p-4 sm:p-5">
                  <div className="w-10 h-10 rounded-lg bg-[#f8f8f6] border border-[#e8e8e5] flex items-center justify-center shrink-0">
                    <ShoppingBag size={16} className="text-neutral-400" />
                  </div>
                  <span className="text-xs text-neutral-700 flex-1 truncate">{name}</span>
                </div>
              ))
            )}
          </div>
        </section>

        {/* ── PRICE BREAKDOWN + DELIVERY + PAYMENT (Two Column) ────────────── */}
        <div className="grid grid-cols-1 sm:grid-cols-2 gap-6">
          {/* Price Breakdown */}
          <section className="bg-white border border-[#e8e8e5] rounded-xl overflow-hidden">
            <div className="px-5 py-4 border-b border-[#e8e8e5] bg-[#fafafa]">
              <h2 className="text-[11px] font-mono font-bold uppercase tracking-[0.2em] text-neutral-400">
                PRICE BREAKDOWN
              </h2>
            </div>
            <div className="p-5 space-y-2.5 text-xs">
              <div className="flex justify-between text-neutral-600">
                <span>Subtotal ({order.itemsCount} items)</span>
                <span className="font-bold text-neutral-900 tabular-nums">
                  {formatPrice(order.subtotal)}
                </span>
              </div>
              {order.bundleDiscount > 0 && (
                <div className="flex justify-between text-emerald-700 font-bold">
                  <span>Bundle Pass (3 for ₹1,199)</span>
                  <span className="tabular-nums">-{formatPrice(order.bundleDiscount)}</span>
                </div>
              )}
              {order.couponDiscount > 0 && (
                <div className="flex justify-between text-emerald-700 font-bold">
                  <span>VIP Pass ({order.couponCode})</span>
                  <span className="tabular-nums">-{formatPrice(order.couponDiscount)}</span>
                </div>
              )}
              <div className="flex justify-between text-neutral-600">
                <span>Shipping</span>
                <span className="font-bold">
                  {order.shippingCost === 0 ? (
                    <span className="text-emerald-600 uppercase">FREE</span>
                  ) : (
                    <span className="text-neutral-900 tabular-nums">
                      {formatPrice(order.shippingCost)}
                    </span>
                  )}
                </span>
              </div>
              <div className="flex justify-between text-neutral-600">
                <span>Taxes</span>
                <span className="text-neutral-500">Included</span>
              </div>
              <div className="flex justify-between text-sm font-black text-[#111111] pt-2.5 border-t border-[#e8e8e5]">
                <span>TOTAL PAID</span>
                <span className="tabular-nums">{formatPrice(order.total)}</span>
              </div>
            </div>
          </section>

          {/* Delivery + Payment */}
          <div className="space-y-6">
            {/* Delivery Address */}
            {order.shippingAddress && (
              <section className="bg-white border border-[#e8e8e5] rounded-xl overflow-hidden">
                <div className="px-5 py-4 border-b border-[#e8e8e5] bg-[#fafafa]">
                  <h2 className="text-[11px] font-mono font-bold uppercase tracking-[0.2em] text-neutral-400 flex items-center gap-1.5">
                    <MapPin size={12} />
                    DELIVERY ADDRESS
                  </h2>
                </div>
                <div className="p-5">
                  <p className="text-xs font-bold text-[#111111]">{order.shippingAddress.name}</p>
                  <p className="text-[11px] text-neutral-500 mt-1 leading-relaxed">
                    {order.shippingAddress.address}
                  </p>
                  <p className="text-[11px] text-neutral-500">
                    PIN: {order.shippingAddress.pincode}
                  </p>
                  <p className="text-[11px] text-neutral-400 mt-1.5 font-mono">
                    Phone: <span className="text-neutral-700">{order.shippingAddress.phone}</span>
                  </p>
                </div>
              </section>
            )}

            {/* Payment Method */}
            <section className="bg-white border border-[#e8e8e5] rounded-xl overflow-hidden">
              <div className="px-5 py-4 border-b border-[#e8e8e5] bg-[#fafafa]">
                <h2 className="text-[11px] font-mono font-bold uppercase tracking-[0.2em] text-neutral-400 flex items-center gap-1.5">
                  <CreditCard size={12} />
                  PAYMENT METHOD
                </h2>
              </div>
              <div className="p-5 flex items-center gap-3">
                <div className="w-10 h-10 rounded-lg bg-[#f8f8f6] border border-[#e8e8e5] flex items-center justify-center text-[#111111]">
                  {paymentInfo.icon}
                </div>
                <div>
                  <p className="text-xs font-bold text-[#111111]">{paymentInfo.label}</p>
                  <p className="text-[10px] text-neutral-400 mt-0.5">
                    {order.status === "Delivered" ? "Payment completed" : "Payment confirmed"}
                  </p>
                </div>
              </div>
            </section>
          </div>
        </div>

        {/* ── NEED HELP + SECURITY ──────────────────────────────────────────── */}
        <div className="flex flex-col sm:flex-row items-center justify-between gap-4 pt-4 pb-8">
          <div className="flex items-center gap-1.5 text-[10px] text-neutral-400">
            <ShieldCheck size={13} className="text-emerald-600" />
            <span>256-Bit SSL Encrypted • 7-Day Hassle-Free Exchange</span>
          </div>
          <Link
            href="/orders"
            className="group inline-flex items-center gap-1.5 text-xs font-bold text-neutral-500 hover:text-[#111111] transition-colors cursor-pointer"
          >
            <ArrowLeft size={14} className="group-hover:-translate-x-0.5 transition-transform" />
            <span>Back to All Orders</span>
          </Link>
        </div>
      </div>
    </div>
  );
}
