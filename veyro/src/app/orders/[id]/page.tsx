"use client";

import React, { useMemo, useState } from "react";
import Image from "next/image";
import Link from "next/link";
import { useParams, useRouter, useSearchParams } from "next/navigation";
import { motion, AnimatePresence, Variants } from "framer-motion";
import { useUser } from "@/context/UserContext";
import { useCart } from "@/context/CartContext";
import { formatPrice } from "@/lib/utils";
import { useProducts } from "@/context/ProductsContext";
import type { OrderRecord, OrderStatus } from "@/types";
import {
  ArrowLeft,
  Package,
  Truck,
  Check,
  CheckCircle2,
  Clock,
  MapPin,
  CreditCard,
  ShoppingBag,
  ArrowRight,
  RotateCcw,
  ShieldCheck,
  Banknote,
  Smartphone,
  XCircle,
  Ban,
  RotateCw,
  Undo2,
  ChevronRight,
  ReceiptText,
  Gift,
  Sparkles,
} from "lucide-react";
import { CancelOrderModal, isOrderCancellable } from "@/components/features/CancelOrderModal";
import { Toast } from "@/components/ui/Toast";

const TIMELINE_STEPS: OrderStatus[] = [
  "Confirmed",
  "Packed",
  "Shipped",
  "Out for Delivery",
  "Delivered",
];

const TIMELINE_ICONS: Record<OrderStatus, React.ReactNode> = {
  Confirmed: <Package size={16} strokeWidth={2.5} />,
  Packed: <Package size={16} strokeWidth={2.5} />,
  Processing: <Package size={16} strokeWidth={2.5} />,
  Shipped: <Truck size={16} strokeWidth={2.5} />,
  "Out for Delivery": <Truck size={16} strokeWidth={2.5} />,
  Delivered: <CheckCircle2 size={16} strokeWidth={2.5} />,
  Cancelled: <Package size={16} strokeWidth={2.5} />,
  Returned: <Package size={16} strokeWidth={2.5} />,
  "Return Requested": <Undo2 size={16} strokeWidth={2.5} />,
};

const PAYMENT_LABELS: Record<string, { label: string; icon: React.ReactNode }> = {
  upi: { label: "UPI / QR Pay", icon: <Smartphone size={16} /> },
  cod: { label: "Cash on Delivery", icon: <Banknote size={16} /> },
  card: { label: "Card / Net Banking", icon: <CreditCard size={16} /> },
};

// ANIMATIONS
const staggerContainer: any = {
  hidden: { opacity: 0 },
  show: { opacity: 1, transition: { staggerChildren: 0.1, delayChildren: 0.05 } }
};

const fadeUp: any = {
  hidden: { opacity: 0, y: 20 },
  show: { opacity: 1, y: 0, transition: { type: "spring", stiffness: 350, damping: 30 } }
};

const luxuryHeroEntry: any = {
  hidden: { opacity: 0, y: 16, scale: 0.99 },
  show: {
    opacity: 1,
    y: 0,
    scale: 1,
    transition: { duration: 0.65, ease: [0.16, 1, 0.3, 1] }
  }
};

const listStagger: any = {
  hidden: { opacity: 0 },
  show: { opacity: 1, transition: { staggerChildren: 0.08 } }
};

const listItem: any = {
  hidden: { opacity: 0, x: -10 },
  show: { opacity: 1, x: 0, transition: { type: "spring", stiffness: 350, damping: 30 } }
};

export default function OrderDetailPage() {
  const params = useParams();
  const router = useRouter();
  const searchParams = useSearchParams();
  const { user, orders, isHydrated, openAccountModal, cancelOrder } = useUser();
  const { addToCart } = useCart();
  const { products } = useProducts();

  const [isCancelModalOpen, setIsCancelModalOpen] = useState(false);
  const [cancelSuccess, setCancelSuccess] = useState<string | null>(null);

  const orderId = typeof params.id === "string" ? params.id : params.id?.[0] || "";
  const isJustConfirmed = searchParams?.get("new") === "1" || searchParams?.get("confirmed") === "true";

  const order = useMemo<OrderRecord | null>(() => {
    // 1. Primary in-memory lookup
    const match = orders.find((o) => o.id === orderId);
    if (match) return match;

    // 2. Direct resilient fallback lookup from localStorage
    if (typeof window !== "undefined") {
      try {
        const lastRaw = localStorage.getItem("veyro_last_placed_order");
        if (lastRaw) {
          const last = JSON.parse(lastRaw);
          if (last?.id === orderId) return last;
        }

        const allRaw = localStorage.getItem("veyro_orders_v6");
        if (allRaw) {
          const all = JSON.parse(allRaw);
          if (Array.isArray(all)) {
            const found = all.find((o: OrderRecord) => o.id === orderId);
            if (found) return found;
          }
        }
      } catch (err) {
        console.warn("Fallback order lookup failed", err);
      }
    }

    return null;
  }, [orders, orderId]);

  const cancelledTimelineEntry = useMemo(() => {
    return order?.timeline?.slice().reverse().find((t) => t.status === "Cancelled");
  }, [order?.timeline]);

  const handleCancelDismiss = () => {
    setIsCancelModalOpen(false);
  };

  // Wait for client-side storage hydration before determining order status
  if (!isHydrated) {
    return (
      <div className="min-h-[70vh] flex items-center justify-center px-4 bg-[#FAFAFA]">
        <div className="text-center space-y-3">
          <div className="w-8 h-8 border-2 border-neutral-900 border-t-transparent rounded-full animate-spin mx-auto" />
          <p className="text-xs font-mono uppercase tracking-widest text-neutral-400">
            Loading order details...
          </p>
        </div>
      </div>
    );
  }

  if (!order && !user) {
    return (
      <motion.div initial={{ opacity: 0 }} animate={{ opacity: 1 }} className="min-h-[70vh] flex items-center justify-center px-4 bg-[#FAFAFA]">
        <div className="text-center max-w-md mx-auto">
          <motion.div initial={{ scale: 0 }} animate={{ scale: 1 }} transition={{ type: "spring", delay: 0.1 }} className="w-20 h-20 bg-white shadow-sm border border-black/[0.04] rounded-2xl flex items-center justify-center mx-auto mb-6">
            <Package size={32} className="text-neutral-400" />
          </motion.div>
          <motion.h1 variants={fadeUp} initial="hidden" animate="show" className="text-2xl font-black tracking-tight text-[#111111] uppercase mb-3">
            Sign In To View Order
          </motion.h1>
          <motion.p variants={fadeUp} initial="hidden" animate="show" className="text-sm text-neutral-500 mb-6">
            You need to be signed in to view order details.
          </motion.p>
          <motion.button
            variants={fadeUp} initial="hidden" animate="show"
            type="button"
            onClick={openAccountModal}
            className="group inline-flex items-center gap-2 bg-[#111111] text-white px-8 py-3.5 text-xs font-black uppercase tracking-[0.18em] rounded-full hover:bg-black transition-all cursor-pointer shadow-lg shadow-black/10 hover:shadow-black/20 hover:-translate-y-0.5"
          >
            <span>SIGN IN</span>
            <ArrowRight size={15} className="group-hover:translate-x-1 transition-transform stroke-[2.5]" />
          </motion.button>
        </div>
      </motion.div>
    );
  }

  if (!order) {
    return (
      <motion.div initial={{ opacity: 0 }} animate={{ opacity: 1 }} className="min-h-[70vh] flex items-center justify-center px-4 bg-[#FAFAFA]">
        <div className="text-center max-w-md mx-auto">
          <motion.div initial={{ scale: 0 }} animate={{ scale: 1 }} transition={{ type: "spring", delay: 0.1 }} className="w-20 h-20 bg-red-50 shadow-sm border border-red-100 rounded-2xl flex items-center justify-center mx-auto mb-6">
            <Package size={32} className="text-red-400" />
          </motion.div>
          <motion.h1 variants={fadeUp} initial="hidden" animate="show" className="text-2xl font-black tracking-tight text-[#111111] uppercase mb-3">
            Order Not Found
          </motion.h1>
          <motion.p variants={fadeUp} initial="hidden" animate="show" className="text-sm text-neutral-500 mb-2 font-mono">
            Reference: <span className="font-bold text-[#111111]">{orderId}</span>
          </motion.p>
          <motion.div variants={fadeUp} initial="hidden" animate="show" className="mt-6">
            <Link
              href="/orders"
              className="group inline-flex items-center gap-2 bg-[#111111] text-white px-6 py-3 text-xs font-black uppercase tracking-wider rounded-full hover:bg-black transition-all cursor-pointer shadow-lg shadow-black/10"
            >
              <ArrowLeft size={14} />
              <span>VIEW ALL ORDERS</span>
            </Link>
          </motion.div>
        </div>
      </motion.div>
    );
  }

  const currentStepIndex = TIMELINE_STEPS.indexOf(order.status);

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

  const paymentInfo = PAYMENT_LABELS[order.paymentMethod] || PAYMENT_LABELS.upi;

  return (
    <div className="min-h-screen bg-[#F7F7F7] pb-24 font-sans selection:bg-[#fcd017] selection:text-black">
      {/* ── STICKY/FADE HEADER ───────────────────────────────────────────────────────── */}
      <motion.header 
        initial={{ opacity: 0, y: -20 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ duration: 0.6, ease: [0.16, 1, 0.3, 1] }}
        className="bg-white border-b border-black/[0.04] sticky top-[74px] sm:top-[78px] lg:top-[82px] z-40 shadow-[0_1px_10px_rgba(0,0,0,0.01)]"
      >
        <div className="max-w-6xl mx-auto px-4 sm:px-6 py-5 sm:py-7">
          <Link
            href="/orders"
            className="group inline-flex items-center gap-1.5 text-[11px] font-bold uppercase tracking-widest text-neutral-400 hover:text-[#111111] transition-colors mb-4 cursor-pointer"
          >
            <ArrowLeft size={14} className="group-hover:-translate-x-1 transition-transform" />
            <span>All Orders</span>
          </Link>

          <div className="flex flex-col sm:flex-row sm:items-center sm:justify-between gap-4">
            <div>
              <div className="flex items-center gap-3">
                <h1 className="text-2xl sm:text-3xl font-black tracking-tight text-[#111111] uppercase flex items-center gap-3">
                  {order.id}
                </h1>
                {order.status === "Cancelled" && (
                  <motion.span initial={{ scale: 0 }} animate={{ scale: 1 }} className="text-[10px] font-bold uppercase tracking-wider px-3 py-1 rounded-full bg-red-50 text-red-600 border border-red-100">
                    Cancelled
                  </motion.span>
                )}
              </div>
              <p className="text-xs text-neutral-500 mt-1.5 font-medium flex items-center gap-2">
                <Clock size={12} className="text-neutral-400" />
                Placed on {order.date} <span className="text-neutral-300">•</span> {order.itemsCount} item{order.itemsCount !== 1 ? "s" : ""}
              </p>
            </div>
            
            <div className="flex items-center gap-3">
              {isOrderCancellable(order.status) && (
                <motion.button
                  whileHover={{ scale: 1.02 }}
                  whileTap={{ scale: 0.98 }}
                  type="button"
                  onClick={() => setIsCancelModalOpen(true)}
                  className="group relative overflow-hidden inline-flex items-center gap-1.5 bg-white border border-red-200 text-red-600 hover:text-white px-5 py-2.5 text-[11px] font-black uppercase tracking-wider rounded-full transition-all cursor-pointer shadow-xs"
                >
                  <div className="absolute inset-0 bg-red-500 translate-y-[100%] group-hover:translate-y-0 transition-transform duration-300 ease-in-out" />
                  <span className="relative z-10 flex items-center gap-1.5">
                    <Ban size={13} />
                    Cancel Order
                  </span>
                </motion.button>
              )}
              
              {order.status === "Delivered" && (
                (() => {
                  let isEligible = false;
                  let reason = "";
                  if (order.deliveredDate) {
                    const deliveredAt = new Date(order.deliveredDate);
                    const SEVEN_DAYS_MS = 7 * 24 * 60 * 60 * 1000;
                    if (Date.now() - deliveredAt.getTime() > SEVEN_DAYS_MS) {
                      isEligible = false;
                      const expiredDate = new Date(deliveredAt.getTime() + SEVEN_DAYS_MS);
                      reason = `Return window expired on ${expiredDate.toLocaleDateString("en-IN", { day: "numeric", month: "short", year: "numeric" })}`;
                    } else {
                      isEligible = true;
                    }
                  } else {
                    isEligible = false;
                    reason = "Delivery date is missing.";
                  }

                  return isEligible ? (
                    <Link href={`/orders/${order.id}/return`}>
                      <motion.button
                        whileHover={{ scale: 1.02, backgroundColor: "#111111", color: "#ffffff" }}
                        whileTap={{ scale: 0.98 }}
                        className="group inline-flex items-center gap-1.5 bg-white border border-neutral-200 text-neutral-900 px-5 py-2.5 text-[11px] font-black uppercase tracking-wider rounded-full transition-all cursor-pointer shadow-xs"
                      >
                        <RotateCw size={13} className="group-hover:text-white transition-colors" />
                        <span>Return</span>
                      </motion.button>
                    </Link>
                  ) : (
                    <button
                      type="button"
                      title={reason}
                      disabled
                      className="group inline-flex items-center gap-1.5 bg-neutral-100 text-neutral-400 border border-transparent px-5 py-2.5 text-[11px] font-black uppercase tracking-wider rounded-full cursor-not-allowed"
                    >
                      <RotateCw size={13} className="text-neutral-400" />
                      <span>Return</span>
                    </button>
                  );
                })()
              )}

              <motion.button
                whileHover={{ scale: 1.02 }}
                whileTap={{ scale: 0.98 }}
                type="button"
                onClick={handleBuyAgain}
                disabled={!order.items || order.items.length === 0}
                className="group relative overflow-hidden inline-flex items-center gap-1.5 bg-[#111111] text-white px-6 py-2.5 text-[11px] font-black uppercase tracking-wider rounded-full transition-all cursor-pointer disabled:opacity-40 disabled:cursor-not-allowed shadow-md hover:shadow-xl hover:shadow-black/10"
              >
                <div className="absolute inset-0 bg-neutral-800 -translate-x-[100%] group-hover:translate-x-0 transition-transform duration-300 ease-out" />
                <span className="relative z-10 flex items-center gap-1.5">
                  <RotateCcw size={13} className="group-hover:-rotate-45 transition-transform duration-300" />
                  Buy Again
                </span>
              </motion.button>
            </div>
          </div>
        </div>
      </motion.header>

      {/* ── ASYMMETRICAL GRID BODY ───────────────────────────────────────── */}
      <motion.div 
        variants={staggerContainer}
        initial="hidden"
        animate="show"
        className="max-w-6xl mx-auto px-4 sm:px-6 py-8 sm:py-12"
      >
        <div className="grid grid-cols-1 lg:grid-cols-12 gap-6 lg:gap-8">
          
          {/* LEFT COLUMN: Hero + Timeline + Items */}
          <div className="lg:col-span-8 space-y-6 lg:space-y-8">
            
            {/* GUEST ORDER CLAIM / SIGN IN BANNER (Only shown if user is guest) */}
            {!user && (
              <motion.div
                variants={fadeUp}
                className="bg-neutral-900 text-white rounded-xl border border-neutral-800 p-4 sm:p-5 flex flex-col sm:flex-row items-start sm:items-center justify-between gap-4 shadow-sm"
              >
                <div className="flex items-center gap-3.5">
                  <div className="w-10 h-10 rounded-xl bg-white/10 flex items-center justify-center shrink-0 text-amber-400">
                    <Sparkles size={18} />
                  </div>
                  <div>
                    <h3 className="text-xs font-bold uppercase tracking-wider text-white">Guest Order Placed</h3>
                    <p className="text-xs text-neutral-300 mt-0.5">
                      Sign in or create a Veyro account to link this order and get 1-click doorstep delivery tracking.
                    </p>
                  </div>
                </div>
                <button
                  type="button"
                  onClick={openAccountModal}
                  className="px-4 py-2 bg-white text-black hover:bg-neutral-100 text-xs font-bold uppercase tracking-wider rounded-lg transition-colors cursor-pointer shrink-0 shadow-xs"
                >
                  Sign In / Save Order
                </button>
              </motion.div>
            )}

            {/* HERO CONFIRMATION */}
            <AnimatePresence>
              {isJustConfirmed && order.status !== "Cancelled" && (
                <motion.div 
                  variants={luxuryHeroEntry} 
                  className="bg-[#0a0a0c] text-white rounded-xl border border-neutral-800/80 p-5 sm:p-7 shadow-[0_20px_40px_rgba(0,0,0,0.35)] relative overflow-hidden"
                >
                  {/* Top Meta Bar */}
                  <div className="flex items-center justify-between gap-3 flex-wrap">
                    <div className="inline-flex items-center gap-2 px-2.5 py-1 rounded-md text-[11px] font-mono font-semibold tracking-wider uppercase bg-white/10 text-neutral-200 border border-white/15">
                      <span className="relative flex h-2 w-2 shrink-0">
                        <span className="animate-ping absolute inline-flex h-full w-full rounded-full bg-emerald-400 opacity-75" />
                        <span className="relative inline-flex rounded-full h-2 w-2 bg-emerald-500" />
                      </span>
                      <span>Order Confirmed</span>
                    </div>
                    <span className="text-xs text-neutral-400 font-mono">
                      Ref #{order.id}
                    </span>
                  </div>

                  {/* Body & Action */}
                  <div className="mt-4 flex flex-col sm:flex-row sm:items-end justify-between gap-5 sm:gap-8">
                    <div className="max-w-lg">
                      <h2 className="text-lg sm:text-xl font-bold tracking-tight text-white">
                        Thank you for your order
                      </h2>
                      <p className="text-xs sm:text-sm text-neutral-400 mt-1 leading-relaxed">
                        We&apos;ve received your order and our warehouse team is preparing your pieces for dispatch.
                      </p>
                    </div>
                    <Link
                      href="/clothing"
                      className="inline-flex items-center justify-center gap-2 bg-white text-neutral-950 hover:bg-neutral-100 px-5 py-2.5 rounded-lg text-xs font-bold tracking-wider uppercase transition-colors shrink-0 shadow-sm cursor-pointer"
                    >
                      <span>Continue Shopping</span>
                      <ArrowRight size={13} />
                    </Link>
                  </div>
                </motion.div>
              )}
            </AnimatePresence>

            {/* STATUS / TIMELINE */}
            {order.status === "Cancelled" ? (
              <motion.section 
                variants={fadeUp} 
                className="bg-white rounded-2xl p-6 sm:p-8 shadow-sm border border-black/[0.04] transition-all"
              >
                {/* Header matching standard Order Status */}
                <div className="flex items-center justify-between mb-6 sm:mb-8">
                  <h2 className="text-[11px] font-black uppercase tracking-[0.2em] text-neutral-400 flex items-center gap-2">
                    <Package size={14} /> ORDER STATUS
                  </h2>
                  <span className="text-xs font-bold text-rose-600 flex items-center gap-1.5 bg-rose-50 px-3 py-1 rounded-full border border-rose-100/80">
                    <span className="w-1.5 h-1.5 rounded-full bg-rose-500" />
                    Cancelled
                  </span>
                </div>

                {/* Native 2-Step Terminal Timeline */}
                <div className="space-y-6 relative" role="list" aria-label="Order cancellation timeline">
                  {/* Step 1: Order Placed */}
                  <div className="flex items-start gap-3.5 sm:gap-4 relative">
                    {/* Connecting Line to Step 2 */}
                    <div className="absolute left-[13px] top-[26px] bottom-[-24px] w-[2px] bg-[#111111]" />

                    <div className="relative z-10 w-7 h-7 rounded-full bg-[#111111] text-white flex items-center justify-center shrink-0 shadow-xs">
                      <Check size={14} className="stroke-[2.5]" />
                    </div>
                    <div className="flex-1 min-w-0 pt-0.5">
                      <div className="flex items-center justify-between gap-2 flex-wrap">
                        <span className="text-xs font-bold uppercase tracking-wider text-[#111111]">
                          Order Placed
                        </span>
                        <span className="text-[11px] text-neutral-400 font-mono">
                          {order.date}
                        </span>
                      </div>
                      <p className="text-xs text-neutral-500 mt-0.5 leading-relaxed">
                        Order received and payment authorized via {paymentInfo.label}.
                      </p>
                    </div>
                  </div>

                  {/* Step 2: Order Cancelled */}
                  <div className="flex items-start gap-3.5 sm:gap-4 relative">
                    <div className="relative z-10 w-7 h-7 rounded-full bg-rose-600 text-white flex items-center justify-center shrink-0 shadow-xs">
                      <RotateCcw size={13} className="stroke-[2.5]" />
                    </div>
                    <div className="flex-1 min-w-0 pt-0.5">
                      <div className="flex items-center justify-between gap-2 flex-wrap">
                        <span className="text-xs font-bold uppercase tracking-wider text-rose-600">
                          Order Cancelled
                        </span>
                        <span className="text-[11px] text-neutral-400 font-mono">
                          {cancelledTimelineEntry?.timestamp || "Customer Request"}
                        </span>
                      </div>
                      <p className="text-xs text-neutral-600 mt-1 leading-relaxed">
                        {cancelledTimelineEntry?.description || "This order was cancelled by customer request. No delivery attempts will be made and reserved stock has been released."}
                      </p>
                    </div>
                  </div>
                </div>

                {/* Contextual Refund Footer */}
                <div className="mt-8 pt-5 border-t border-black/[0.04] flex flex-col sm:flex-row sm:items-center justify-between gap-3 text-xs text-neutral-600">
                  <div className="flex items-center gap-2 flex-wrap">
                    <span className="text-neutral-400">Refund</span>
                    <strong className="text-sm font-bold text-neutral-900">{formatPrice(order.total)}</strong>
                    <span className="text-neutral-400">to</span>
                    <span className="font-semibold text-neutral-800">{paymentInfo.label}</span>
                  </div>
                  <div className="flex items-center gap-1.5 text-neutral-500 font-mono">
                    <Clock size={13} className="text-neutral-400 shrink-0" />
                    <span>Estimated in 5–7 business days</span>
                  </div>
                </div>
              </motion.section>
            ) : (
              <motion.section 
                variants={fadeUp} 
                whileHover={{ y: -2, boxShadow: "0px 10px 30px rgba(0,0,0,0.04)" }}
                transition={{ duration: 0.3 }}
                className="bg-white rounded-2xl p-6 sm:p-8 shadow-sm border border-black/[0.04] transition-all"
              >
                <div className="flex items-center justify-between mb-6 sm:mb-8">
                  <h2 className="text-[11px] font-black uppercase tracking-[0.2em] text-neutral-400 flex items-center gap-2">
                    <Package size={14} /> ORDER STATUS
                  </h2>
                  <span className="text-xs text-neutral-500 flex items-center gap-1.5 bg-neutral-50 px-3 py-1 rounded-full border border-black/[0.04]">
                    {order.status === "Delivered" ? (
                      <CheckCircle2 size={13} className="text-emerald-500" />
                    ) : (
                      <Clock size={13} className="text-[#fcd017]" />
                    )}
                    <span className="font-bold text-[#111111]">{order.estimatedDelivery}</span>
                  </span>
                </div>

                {/* Mobile Vertical Timeline */}
                <div className="sm:hidden space-y-4 pt-1 pb-1" role="list" aria-label="Order tracking timeline">
                  {TIMELINE_STEPS.map((step, idx) => {
                    const isCompleted = idx <= currentStepIndex;
                    const isCurrent = idx === currentStepIndex;
                    const isLast = idx === TIMELINE_STEPS.length - 1;
                    const timelineEntry = order.timeline?.find((t) => t.status === step);

                    return (
                      <div key={step} className="flex items-start gap-3.5 relative">
                        {/* Connecting Line */}
                        {!isLast && (
                          <div
                            className={`absolute left-[13px] top-[26px] bottom-[-18px] w-[2px] transition-colors duration-500 ${
                              idx < currentStepIndex ? "bg-[#111111]" : "bg-neutral-200"
                            }`}
                          />
                        )}

                        {/* Step Node Icon */}
                        <div
                          className={`relative z-10 w-7 h-7 rounded-full flex items-center justify-center shrink-0 transition-all duration-300 ${
                            isCompleted
                              ? "bg-[#111111] text-white shadow-xs"
                              : "bg-neutral-100 text-neutral-400 border border-neutral-200"
                          }`}
                        >
                          {isCompleted ? (
                            <CheckCircle2 size={14} className="stroke-[2.5]" />
                          ) : (
                            <div className="w-2 h-2 rounded-full bg-neutral-300" />
                          )}
                        </div>

                        {/* Step Details */}
                        <div className="flex-1 min-w-0 pt-0.5">
                          <div className="flex items-center justify-between gap-2">
                            <span
                              className={`text-xs font-bold uppercase tracking-wider ${
                                isCompleted ? "text-[#111111]" : "text-neutral-400"
                              }`}
                            >
                              {step}
                            </span>
                            {isCurrent && (
                              <span className="text-[10px] font-bold uppercase tracking-wider text-emerald-700 bg-emerald-50 px-2 py-0.5 rounded-full border border-emerald-200">
                                Current
                              </span>
                            )}
                          </div>
                          {timelineEntry?.timestamp && (
                            <p className="text-[11px] text-neutral-400 font-mono mt-0.5">
                              {timelineEntry.timestamp}
                            </p>
                          )}
                          {timelineEntry?.description && isCurrent && (
                            <p className="text-xs text-neutral-600 mt-1 leading-relaxed">
                              {timelineEntry.description}
                            </p>
                          )}
                        </div>
                      </div>
                    );
                  })}
                </div>

                {/* Desktop Horizontal Timeline */}
                <div className="hidden sm:block relative mt-8 mb-12 px-8 sm:px-16" role="list" aria-label="Order tracking timeline">
                  {/* Progress Bar Track */}
                  <div className="relative h-2 bg-neutral-100 rounded-full w-full overflow-hidden">
                    {/* Progress Bar Fill */}
                    <motion.div
                      initial={{ width: 0 }}
                      animate={{ width: `${currentStepIndex >= 0 ? (currentStepIndex / (TIMELINE_STEPS.length - 1)) * 100 : 0}%` }}
                      transition={{ duration: 1.5, delay: 0.2, ease: [0.25, 1, 0.5, 1] }}
                      className="absolute top-0 left-0 h-full bg-[#111111] rounded-full"
                    />
                  </div>
                  
                  {/* Nodes Container */}
                  <div className="relative z-10 h-24 pt-6">
                    {TIMELINE_STEPS.map((step, idx) => {
                      const isCompleted = idx <= currentStepIndex;
                      const isCurrent = idx === currentStepIndex;
                      const timelineEntry = order.timeline?.find((t) => t.status === step);
                      const percent = (idx / (TIMELINE_STEPS.length - 1)) * 100;

                      return (
                        <div 
                          key={step} 
                          className="absolute flex flex-col items-center w-32 -ml-16 top-6"
                          style={{ left: `${percent}%` }}
                        >
                          {/* Minimalist Icon */}
                          <motion.div
                            initial={{ opacity: 0, y: 10 }}
                            animate={{ opacity: 1, y: 0 }}
                            transition={{ delay: 0.3 + (idx * 0.15) }}
                            className={`mb-3 transition-colors duration-500 ${isCompleted ? "text-[#111111]" : "text-neutral-300"}`}
                          >
                             {isCurrent ? (
                               <motion.div
                                 animate={{ y: [0, -3, 0] }}
                                 transition={{ repeat: Infinity, duration: 2.5, ease: "easeInOut" }}
                               >
                                 {TIMELINE_ICONS[step]}
                               </motion.div>
                             ) : (
                               TIMELINE_ICONS[step]
                             )}
                          </motion.div>
                          
                          {/* Step Label */}
                          <motion.span
                            initial={{ opacity: 0, y: 5 }}
                            animate={{ opacity: 1, y: 0 }}
                            transition={{ delay: 0.4 + (idx * 0.15) }}
                            className={`text-[10px] font-bold uppercase tracking-wider text-center transition-colors duration-500 ${
                              isCompleted ? "text-[#111111]" : "text-neutral-400"
                            }`}
                          >
                            {step}
                          </motion.span>
                          
                          {/* Timestamp */}
                          {timelineEntry && (
                            <motion.span 
                              initial={{ opacity: 0 }}
                              animate={{ opacity: 1 }}
                              transition={{ delay: 0.5 + (idx * 0.15) }}
                              className="text-[10px] text-neutral-400 mt-1 text-center font-medium"
                            >
                              {timelineEntry.timestamp}
                            </motion.span>
                          )}
                        </div>
                      );
                    })}
                  </div>
                </div>
              </motion.section>
            )}

            {/* ORDER ITEMS (COMPACT SCROLLABLE VIEW) */}
            <motion.section 
              variants={fadeUp} 
              className="bg-white rounded-2xl overflow-hidden shadow-sm border border-black/[0.04] flex flex-col"
            >
              <div className="px-6 sm:px-8 py-4 sm:py-5 border-b border-black/[0.04] flex items-center justify-between bg-white z-10 shrink-0">
                <h2 className="text-[11px] font-black uppercase tracking-[0.2em] text-neutral-400 flex items-center gap-2">
                  <ShoppingBag size={14} /> ITEMS ({order.itemsCount})
                </h2>
                {order.items && order.items.length > 3 && (
                  <span className="text-[10px] font-mono uppercase tracking-wider text-neutral-400 bg-neutral-100 px-2.5 py-1 rounded-full font-semibold">
                    Scroll to view all {order.items.length} items ↓
                  </span>
                )}
              </div>
              <div className="max-h-[490px] overflow-y-auto overscroll-contain divide-y divide-black/[0.04] [scrollbar-width:thin] [&::-webkit-scrollbar]:w-1.5 [&::-webkit-scrollbar-track]:bg-transparent [&::-webkit-scrollbar-thumb]:bg-neutral-200 [&::-webkit-scrollbar-thumb]:rounded-full hover:[&::-webkit-scrollbar-thumb]:bg-neutral-300">
                {order.items && order.items.length > 0 ? (
                  order.items.map((item, idx) => (
                    <motion.div 
                      key={`${item.productId}-${item.selectedSize}-${idx}`} 
                      variants={listItem}
                      className="flex items-center gap-5 sm:gap-6 p-5 sm:p-6 group hover:bg-neutral-50/60 transition-colors"
                    >
                      <Link
                        href={`/product/${item.productSlug}`}
                        className="relative w-20 h-20 sm:w-24 sm:h-24 rounded-xl overflow-hidden bg-[#F5F5F5] shrink-0 border border-black/[0.03]"
                      >
                        <motion.div whileHover={{ scale: 1.05 }} transition={{ duration: 0.3 }} className="w-full h-full">
                          <Image
                            src={item.imageUrl}
                            alt={item.productName}
                            fill
                            className="object-cover mix-blend-multiply"
                            sizes="96px"
                          />
                        </motion.div>
                      </Link>
                      <div className="flex-1 min-w-0">
                        <Link
                          href={`/product/${item.productSlug}`}
                          className="text-sm sm:text-base font-black text-[#111111] hover:text-neutral-600 transition-colors block truncate"
                        >
                          {item.productName}
                        </Link>
                        <div className="flex items-center gap-2 mt-1">
                          <span className="text-[10px] font-bold text-neutral-500 uppercase tracking-wider bg-neutral-100 px-2 py-0.5 rounded-full">
                            Size {item.selectedSize}
                          </span>
                          <span className="text-[10px] font-bold text-neutral-500 uppercase tracking-wider bg-neutral-100 px-2 py-0.5 rounded-full">
                            {item.colorName}
                          </span>
                        </div>
                        <p className="text-xs text-neutral-500 mt-2 font-medium">
                          Qty: <strong className="text-black">{item.quantity}</strong> <span className="mx-2 text-neutral-300">•</span> {formatPrice(item.unitPrice)}
                        </p>
                      </div>
                      <div className="text-right shrink-0">
                        <span className="text-base sm:text-lg font-black text-[#111111] tabular-nums tracking-tight">
                          {formatPrice(item.totalPrice)}
                        </span>
                      </div>
                    </motion.div>
                  ))
                ) : (
                  <div className="p-8 text-center text-neutral-400 font-medium">Items details unavailable</div>
                )}
              </div>
            </motion.section>

            {/* ATELIER KEEPSAKE & LUXURY PACKAGING CARD */}
            {order.giftPackaging?.enabled && (
              <motion.section
                variants={fadeUp}
                className="bg-white rounded-2xl overflow-hidden shadow-sm border border-black/[0.04]"
              >
                <div className="px-6 sm:px-8 py-5 border-b border-black/[0.04] flex items-center justify-between bg-neutral-50/50">
                  <h2 className="text-[11px] font-black uppercase tracking-[0.2em] text-neutral-400 flex items-center gap-2">
                    <Gift size={14} className="text-[#fcd017]" /> ATELIER KEEPSAKE & LUXURY PACKAGING
                  </h2>
                  <span className="text-[10px] font-mono uppercase tracking-wider text-neutral-500 font-semibold bg-neutral-100 px-2.5 py-1 rounded-full">
                    {order.giftPackaging.theme === "atelier-bone"
                      ? "Atelier Bone • Italian Cotton"
                      : order.giftPackaging.theme === "brutalist-noir"
                      ? "Brutalist Noir • Carbon Matte"
                      : "Heritage Kraft • Fibrous Raw"}
                  </span>
                </div>

                <div className="p-6 sm:p-8">
                  <div className="grid grid-cols-1 lg:grid-cols-12 gap-6 items-stretch">
                    {/* Left: Real Luxury Packaging Box Visual */}
                    <div className="lg:col-span-5 relative min-h-[220px] rounded-xl overflow-hidden border border-neutral-200/80 bg-neutral-100 shadow-2xs">
                      <Image
                        src="/images/gift-packaging.jpg"
                        alt="VEYRO Signature Atelier Gift Packaging"
                        fill
                        className="object-cover"
                        sizes="(max-width: 1024px) 100vw, 360px"
                      />
                      <div className="absolute inset-x-0 bottom-0 bg-gradient-to-t from-black/80 via-black/30 to-transparent p-3.5 text-white">
                        <p className="text-xs font-semibold tracking-wide">
                          Hand-packed in Tirupur Atelier
                        </p>
                        <p className="text-[10px] text-neutral-300">
                          Gold debossed seal • Archival tissue • Wax seal envelope
                        </p>
                      </div>
                    </div>

                    {/* Right: Keepsake Note Enclosure */}
                    <div className="lg:col-span-7 relative rounded-xl p-6 border border-[#E8E2D5] bg-[#FAF7F2] text-[#2C2723] shadow-xs overflow-hidden flex flex-col justify-between">
                      {/* Debossed Gold Wax Seal Stamp in Top Right */}
                      <div className="absolute top-4 right-4 sm:top-5 sm:right-5">
                        <div className="relative w-10 h-10 rounded-full bg-gradient-to-br from-[#c99738] via-[#e2b755] to-[#8c651a] shadow-[0_4px_12px_rgba(140,101,26,0.35),inset_0_1px_2px_rgba(255,255,255,0.6)] flex items-center justify-center border border-[#e8c878]">
                          <div className="w-7 h-7 rounded-full border border-[#8c651a]/40 flex items-center justify-center">
                            <span className="font-serif font-black text-xs tracking-widest text-[#422e06] select-none">
                              V
                            </span>
                          </div>
                        </div>
                      </div>

                      <div className="space-y-3">
                        <div className="text-[10px] uppercase font-bold tracking-[0.2em] opacity-60">
                          Keepsake Letterpress Note
                        </div>

                        <div className="flex items-center gap-2 text-xs font-semibold">
                          <span className="opacity-60">To:</span>
                          <span className="underline underline-offset-4 decoration-amber-500/40">
                            {order.giftPackaging.recipientName || "Valued Recipient"}
                          </span>
                        </div>

                        {order.giftPackaging.message ? (
                          <p className="font-serif italic text-lg sm:text-xl leading-relaxed tracking-wide pt-1 pb-2 opacity-95 break-words">
                            &ldquo;{order.giftPackaging.message}&rdquo;
                          </p>
                        ) : (
                          <p className="font-serif italic text-base sm:text-lg leading-relaxed tracking-wide pt-1 pb-2 opacity-75 italic">
                            &ldquo;Crafted with care, presented with elegance.&rdquo;
                          </p>
                        )}

                        <div className="flex items-center gap-2 text-xs font-semibold pt-1">
                          <span className="opacity-60">From:</span>
                          <span className="underline underline-offset-4 decoration-amber-500/40">
                            {order.giftPackaging.senderName || "A Gift of Distinction"}
                          </span>
                        </div>
                      </div>

                      {/* Privacy Badges Footer */}
                      <div className="mt-5 pt-3.5 border-t border-black/10 flex flex-wrap items-center gap-2 text-[10px] font-mono tracking-wider opacity-75">
                        {order.giftPackaging.hidePriceTag && (
                          <span className="inline-flex items-center gap-1 bg-black/5 px-2 py-0.5 rounded">
                            ✓ MRP Redacted on Dispatch
                          </span>
                        )}
                        {order.giftPackaging.stealthOuterBox && (
                          <span className="inline-flex items-center gap-1 bg-black/5 px-2 py-0.5 rounded">
                            ✓ Discreet Outer Transit Carton
                          </span>
                        )}
                        <span className="inline-flex items-center gap-1 bg-black/5 px-2 py-0.5 rounded">
                          ✓ Magnetic Luxury Gift Box
                        </span>
                      </div>
                    </div>
                  </div>
                </div>
              </motion.section>
            )}
          </div>

          {/* RIGHT COLUMN: Summary & Details */}
          <div className="lg:col-span-4 space-y-6 lg:space-y-8">
            
            {/* PRICE BREAKDOWN (Receipt Style) */}
            <motion.section 
              variants={fadeUp} 
              whileHover={{ y: -2, boxShadow: "0px 10px 30px rgba(0,0,0,0.04)" }}
              className="bg-white rounded-2xl overflow-hidden shadow-sm border border-black/[0.04] transition-all"
            >
              <div className="px-6 py-5 border-b border-black/[0.04] bg-neutral-50/50">
                <h2 className="text-[11px] font-black uppercase tracking-[0.2em] text-neutral-400 flex items-center gap-2">
                  <ReceiptText size={14} /> SUMMARY
                </h2>
              </div>
              <motion.div variants={listStagger} initial="hidden" animate="show" className="p-6 space-y-4 text-sm">
                <motion.div variants={listItem} className="flex justify-between text-neutral-600 font-medium">
                  <span>Subtotal ({order.itemsCount} items)</span>
                  <span className="text-neutral-900 tabular-nums">{formatPrice(order.subtotal)}</span>
                </motion.div>
                
                {order.bundleDiscount > 0 && (
                  <motion.div variants={listItem} className="flex justify-between text-emerald-600 font-bold">
                    <span>Bundle Discount</span>
                    <span className="tabular-nums">-{formatPrice(order.bundleDiscount)}</span>
                  </motion.div>
                )}
                
                {order.couponDiscount > 0 && (
                  <motion.div variants={listItem} className="flex justify-between text-emerald-600 font-bold">
                    <span>VIP Pass ({order.couponCode})</span>
                    <span className="tabular-nums">-{formatPrice(order.couponDiscount)}</span>
                  </motion.div>
                )}
                
                <motion.div variants={listItem} className="flex justify-between text-neutral-600 font-medium">
                  <span>Shipping</span>
                  <span className="font-bold">
                    {order.shippingCost === 0 ? <span className="text-[#fcd017] uppercase tracking-wider text-xs">Free</span> : <span className="text-neutral-900 tabular-nums">{formatPrice(order.shippingCost)}</span>}
                  </span>
                </motion.div>

                {order.giftPackaging?.enabled && (
                  <motion.div variants={listItem} className="flex justify-between text-neutral-800 font-medium">
                    <span className="flex items-center gap-1.5">
                      <Gift size={13} className="text-slate-400 shrink-0" />
                      <span>Signature Gift Packaging</span>
                    </span>
                    <span className="font-bold tabular-nums">+{formatPrice(order.giftPackaging.fee)}</span>
                  </motion.div>
                )}
                
                <motion.div variants={listItem} className="flex justify-between text-neutral-600 font-medium pb-4 border-b border-dashed border-neutral-200">
                  <span>Taxes</span>
                  <span className="text-neutral-400">Included</span>
                </motion.div>
                
                <motion.div variants={listItem} className="flex justify-between items-center pt-2">
                  <span className="text-xs font-black text-neutral-400 uppercase tracking-widest">Total Paid</span>
                  <span className="text-2xl font-black text-[#111111] tabular-nums tracking-tight">{formatPrice(order.total)}</span>
                </motion.div>
              </motion.div>
            </motion.section>

            {/* DELIVERY & PAYMENT */}
            <motion.section 
              variants={fadeUp} 
              className="bg-white rounded-2xl overflow-hidden shadow-sm border border-black/[0.04]"
            >
              <div className="px-6 py-5 border-b border-black/[0.04] bg-neutral-50/50">
                <h2 className="text-[11px] font-black uppercase tracking-[0.2em] text-neutral-400 flex items-center gap-2">
                  <MapPin size={14} /> DELIVERY & PAYMENT
                </h2>
              </div>
              <div className="p-6 divide-y divide-black/[0.04]">
                {/* 1. SHIPPING / FRIEND'S DOORSTEP ADDRESS */}
                {order.shippingAddress && (
                  <div className="pb-6">
                    <div className="flex items-center justify-between gap-2 mb-2">
                      <span className="text-[10px] font-black tracking-widest text-neutral-400 uppercase">
                        {order.isGiftOrder ? "Friend's Delivery Destination" : "Shipping Destination"}
                      </span>
                      {order.isGiftOrder && (
                        <span className="inline-flex items-center gap-1 px-2.5 py-0.5 rounded-full text-[9px] font-black uppercase tracking-wider bg-amber-500/10 text-neutral-900 border border-amber-500/30">
                          <Gift size={10} className="text-[#c99738]" /> Surprise Gift Parcel
                        </span>
                      )}
                    </div>
                    <p className="text-sm font-black text-[#111111]">{order.shippingAddress.name}</p>
                    <p className="text-sm text-neutral-600 mt-1.5 leading-relaxed">{order.shippingAddress.address}</p>
                    <p className="text-sm text-neutral-600 mt-1">PIN: {order.shippingAddress.pincode}</p>
                    <div className="mt-3 flex items-center gap-2 flex-wrap">
                      <div className="inline-flex items-center gap-2 bg-neutral-50 px-3 py-1.5 rounded-lg text-xs font-medium text-neutral-600 border border-black/[0.04]">
                        <Smartphone size={12} className="text-neutral-400" />
                        {order.shippingAddress.phone}
                      </div>
                      {order.isGiftOrder && (
                        <span className="text-[10px] text-neutral-400 font-medium">
                          (Courier doorstep OTP verification)
                        </span>
                      )}
                    </div>
                  </div>
                )}

                {/* 2. OFFICIAL BILLING & TAX INVOICE ADDRESS (E.6) */}
                {order.billingAddress && (
                  <div className="py-6">
                    <div className="flex items-center justify-between gap-2 mb-2">
                      <span className="text-[10px] font-black tracking-widest text-neutral-400 uppercase flex items-center gap-1.5">
                        <ReceiptText size={12} className="text-neutral-500" /> Official Billing Address
                      </span>
                      <span className="text-[9px] font-bold text-neutral-400 uppercase tracking-wider bg-neutral-100 px-2 py-0.5 rounded">
                        Digital GST Invoice
                      </span>
                    </div>
                    <p className="text-sm font-black text-[#111111]">{order.billingAddress.name}</p>
                    <p className="text-sm text-neutral-600 mt-1.5 leading-relaxed">{order.billingAddress.address}</p>
                    <p className="text-sm text-neutral-600 mt-1">PIN: {order.billingAddress.pincode}</p>
                    <div className="mt-3 inline-flex items-center gap-2 bg-neutral-50 px-3 py-1.5 rounded-lg text-xs font-medium text-neutral-600 border border-black/[0.04]">
                      <Smartphone size={12} className="text-neutral-400" />
                      {order.billingAddress.phone}
                    </div>
                  </div>
                )}
                
                {/* 3. PAYMENT METHOD */}
                <div className="pt-6 flex items-center gap-4">
                  <motion.div whileHover={{ rotate: 10, scale: 1.1 }} className="w-12 h-12 rounded-xl bg-neutral-50 border border-black/[0.04] flex items-center justify-center text-[#111111]">
                    {paymentInfo.icon}
                  </motion.div>
                  <div>
                    <p className="text-sm font-black text-[#111111]">{paymentInfo.label}</p>
                    <p className="text-[11px] font-bold text-neutral-400 mt-1 uppercase tracking-wider">
                      {order.status === "Delivered" ? "Payment Completed" : "Payment Confirmed"}
                    </p>
                  </div>
                </div>
              </div>
            </motion.section>
            
          </div>
        </div>
        
        {/* FOOTER */}
        <motion.div variants={fadeUp} className="flex flex-col sm:flex-row items-center justify-center sm:justify-between gap-4 mt-16 pb-8 text-[11px] text-neutral-400 font-bold uppercase tracking-widest">
          <div className="flex items-center gap-2">
            <ShieldCheck size={14} className="text-[#fcd017]" />
            <span>256-Bit SSL Encrypted • 7-Day Returns</span>
          </div>
          <span>Veyro Secure Checkout</span>
        </motion.div>
      </motion.div>

      {/* CANCEL MODAL */}
      <CancelOrderModal
        order={order}
        isOpen={isCancelModalOpen}
        onClose={handleCancelDismiss}
        onConfirm={(orderId, reason) => {
          cancelOrder(orderId, reason);
          setIsCancelModalOpen(false);
          setCancelSuccess(orderId);
          setTimeout(() => setCancelSuccess(null), 4000);
        }}
      />

      {/* ── Cancel Success Toast ─────────────────────────────────────────── */}
      <Toast
        isOpen={Boolean(cancelSuccess)}
        onClose={() => setCancelSuccess(null)}
        variant="danger"
        position="top"
        message={
          <span className="flex items-center gap-1.5 flex-wrap">
            <span>Order</span>
            <span className="font-mono font-semibold text-white tracking-wide whitespace-nowrap">
              #{cancelSuccess}
            </span>
            <span>has been cancelled</span>
          </span>
        }
      />
    </div>
  );
}
