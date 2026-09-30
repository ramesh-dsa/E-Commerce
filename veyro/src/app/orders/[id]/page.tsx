"use client";

import React, { useMemo, useState } from "react";
import Image from "next/image";
import Link from "next/link";
import { useParams, useRouter, useSearchParams } from "next/navigation";
import { motion, AnimatePresence, Variants } from "framer-motion";
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
  Banknote,
  Smartphone,
  XCircle,
  Ban,
  RotateCw,
  Undo2,
  ChevronRight,
  ReceiptText
} from "lucide-react";
import { CancelOrderModal, isOrderCancellable } from "@/components/features/CancelOrderModal";

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

const scaleIn: any = {
  hidden: { opacity: 0, scale: 0.95 },
  show: { opacity: 1, scale: 1, transition: { type: "spring", stiffness: 350, damping: 30 } }
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
  const { user, orders, openAccountModal, cancelOrder } = useUser();
  const { addToCart } = useCart();

  const [isCancelModalOpen, setIsCancelModalOpen] = useState(false);
  const [cancelSuccess, setCancelSuccess] = useState<string | null>(null);

  const orderId = typeof params.id === "string" ? params.id : params.id?.[0] || "";
  const isJustConfirmed = searchParams?.get("new") === "1" || searchParams?.get("confirmed") === "true";

  const order = useMemo(() => {
    return orders.find((o) => o.id === orderId) || null;
  }, [orders, orderId]);

  const cancelledTimelineEntry = useMemo(() => {
    return order?.timeline?.slice().reverse().find((t) => t.status === "Cancelled");
  }, [order?.timeline]);

  const handleCancelDismiss = () => {
    setIsCancelModalOpen(false);
  };

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
        className="bg-white border-b border-black/[0.04] sticky top-0 z-40 shadow-[0_1px_10px_rgba(0,0,0,0.01)]"
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
            
            {/* HERO CONFIRMATION */}
            <AnimatePresence>
              {isJustConfirmed && order.status !== "Cancelled" && (
                <motion.div 
                  variants={scaleIn} 
                  className="relative bg-[#111111] text-white rounded-2xl p-6 sm:p-8 overflow-hidden shadow-xl"
                >
                  <div className="absolute top-0 left-0 w-full h-1.5 bg-[#fcd017]" />
                  <motion.div 
                    initial={{ scale: 0, opacity: 0 }}
                    animate={{ scale: 1, opacity: 1 }}
                    transition={{ duration: 1, ease: "easeOut" }}
                    className="absolute -top-32 -right-32 w-80 h-80 bg-white/5 rounded-full blur-3xl pointer-events-none" 
                  />
                  <div className="relative z-10 flex flex-col md:flex-row items-start md:items-center justify-between gap-8">
                    <div className="flex items-start gap-5">
                      <motion.div 
                        initial={{ scale: 0, rotate: -180 }}
                        animate={{ scale: 1, rotate: 0 }}
                        transition={{ type: "spring", stiffness: 200, damping: 20, delay: 0.2 }}
                        className="w-14 h-14 rounded-full bg-[#fcd017] text-[#111111] flex items-center justify-center shrink-0 shadow-[0_0_30px_rgba(252,208,23,0.3)]"
                      >
                        <CheckCircle2 size={28} className="stroke-[2.5]" />
                      </motion.div>
                      <div>
                        <motion.span variants={fadeUp} className="text-[10px] font-mono uppercase tracking-[0.2em] text-[#fcd017] font-bold block mb-1.5">
                          Order Secured
                        </motion.span>
                        <motion.h2 variants={fadeUp} className="text-2xl sm:text-3xl font-black tracking-tight uppercase mb-2">
                          Thank You.
                        </motion.h2>
                        <motion.p variants={fadeUp} className="text-xs sm:text-sm text-neutral-400 max-w-xl leading-relaxed">
                          Reference <strong className="text-white font-mono font-bold">#{order.id}</strong> is confirmed. We are preparing your items for dispatch.
                        </motion.p>
                      </div>
                    </div>
                    <motion.div variants={fadeUp} className="flex flex-col sm:flex-row items-center gap-3 shrink-0 w-full sm:w-auto">
                      <Link
                        href="/clothing"
                        className="w-full sm:w-auto text-center bg-white text-[#111111] hover:bg-neutral-200 px-6 py-3 rounded-full text-[11px] font-black uppercase tracking-widest transition-colors"
                      >
                        Continue Shopping
                      </Link>
                    </motion.div>
                  </div>
                </motion.div>
              )}
            </AnimatePresence>

            {/* STATUS / TIMELINE */}
            {order.status === "Cancelled" ? (
              <motion.section variants={fadeUp} className="bg-white rounded-2xl p-6 sm:p-8 relative overflow-hidden shadow-sm border border-black/[0.04]">
                <div className="absolute top-0 left-0 w-full h-1 bg-gradient-to-r from-red-500 via-rose-500 to-amber-500" />
                <div className="flex items-start gap-5">
                  <motion.div initial={{ scale: 0 }} animate={{ scale: 1 }} className="w-14 h-14 rounded-full bg-red-50 border border-red-100 text-red-600 flex items-center justify-center shrink-0">
                    <XCircle size={28} className="stroke-[2.5]" />
                  </motion.div>
                  <div>
                    <h2 className="text-xl font-black text-neutral-900 uppercase tracking-tight">
                      Order Cancelled
                    </h2>
                    <p className="text-sm text-neutral-500 mt-1 leading-relaxed">
                      {cancelledTimelineEntry?.description || "This order was cancelled by customer request. No further delivery attempts will be made."}
                    </p>
                    
                    <div className="mt-5 pt-5 border-t border-black/[0.04] flex items-center gap-3 text-sm">
                      <span className="relative flex h-3 w-3">
                        <span className="animate-ping absolute inline-flex h-full w-full rounded-full bg-amber-400 opacity-75"></span>
                        <span className="relative inline-flex rounded-full h-3 w-3 bg-amber-500"></span>
                      </span>
                      <span className="text-neutral-600">
                        Refund of <strong className="text-black">{formatPrice(order.total)}</strong> to {paymentInfo.label} in 5-7 days.
                      </span>
                    </div>
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
                <div className="flex items-center justify-between mb-8">
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

            {/* ORDER ITEMS */}
            <motion.section 
              variants={fadeUp} 
              className="bg-white rounded-2xl overflow-hidden shadow-sm border border-black/[0.04]"
            >
              <div className="px-6 sm:px-8 py-5 border-b border-black/[0.04] flex items-center justify-between">
                <h2 className="text-[11px] font-black uppercase tracking-[0.2em] text-neutral-400 flex items-center gap-2">
                  <ShoppingBag size={14} /> ITEMS ({order.itemsCount})
                </h2>
              </div>
              <motion.div variants={listStagger} initial="hidden" animate="show" className="divide-y divide-black/[0.04]">
                {order.items && order.items.length > 0 ? (
                  order.items.map((item, idx) => (
                    <motion.div 
                      key={`${item.productId}-${item.selectedSize}-${idx}`} 
                      variants={listItem}
                      className="flex items-center gap-5 sm:gap-6 p-6 sm:p-8 group hover:bg-neutral-50/50 transition-colors"
                    >
                      <Link
                        href={`/product/${item.productSlug}`}
                        className="relative w-24 h-24 sm:w-28 sm:h-28 rounded-xl overflow-hidden bg-[#F5F5F5] shrink-0"
                      >
                        <motion.div whileHover={{ scale: 1.05 }} transition={{ duration: 0.4, ease: "easeOut" }} className="w-full h-full">
                          <Image
                            src={item.imageUrl}
                            alt={item.productName}
                            fill
                            className="object-cover mix-blend-multiply"
                            sizes="112px"
                          />
                        </motion.div>
                      </Link>
                      <div className="flex-1 min-w-0">
                        <Link
                          href={`/product/${item.productSlug}`}
                          className="text-base sm:text-lg font-black text-[#111111] hover:text-neutral-600 transition-colors block truncate"
                        >
                          {item.productName}
                        </Link>
                        <div className="flex items-center gap-2 mt-1.5">
                          <span className="text-[11px] font-bold text-neutral-500 uppercase tracking-wider bg-neutral-100 px-2.5 py-1 rounded-full">
                            Size {item.selectedSize}
                          </span>
                          <span className="text-[11px] font-bold text-neutral-500 uppercase tracking-wider bg-neutral-100 px-2.5 py-1 rounded-full">
                            {item.colorName}
                          </span>
                        </div>
                        <p className="text-sm text-neutral-500 mt-3 font-medium">
                          Qty: <strong className="text-black">{item.quantity}</strong> <span className="mx-2 text-neutral-300">|</span> {formatPrice(item.unitPrice)}
                        </p>
                      </div>
                      <div className="text-right shrink-0">
                        <span className="text-lg sm:text-xl font-black text-[#111111] tabular-nums tracking-tight">
                          {formatPrice(item.totalPrice)}
                        </span>
                      </div>
                    </motion.div>
                  ))
                ) : (
                  <div className="p-8 text-center text-neutral-400 font-medium">Items details unavailable</div>
                )}
              </motion.div>
            </motion.section>
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
                {order.shippingAddress && (
                  <div className="pb-6">
                    <p className="text-sm font-black text-[#111111]">{order.shippingAddress.name}</p>
                    <p className="text-sm text-neutral-600 mt-2 leading-relaxed">{order.shippingAddress.address}</p>
                    <p className="text-sm text-neutral-600 mt-1">PIN: {order.shippingAddress.pincode}</p>
                    <div className="mt-3 inline-flex items-center gap-2 bg-neutral-50 px-3 py-1.5 rounded-lg text-xs font-medium text-neutral-600 border border-black/[0.04]">
                      <Smartphone size={12} className="text-neutral-400" />
                      {order.shippingAddress.phone}
                    </div>
                  </div>
                )}
                
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

      {/* TOAST SUCCESS */}
      <AnimatePresence>
        {cancelSuccess && (
          <motion.div
            initial={{ opacity: 0, y: 40, scale: 0.9 }}
            animate={{ opacity: 1, y: 0, scale: 1 }}
            exit={{ opacity: 0, y: 40, scale: 0.9 }}
            transition={{ duration: 0.4, type: "spring", bounce: 0.4 }}
            className="fixed bottom-6 left-1/2 -translate-x-1/2 z-50 bg-[#111111] text-white px-5 py-3.5 rounded-full shadow-2xl flex items-center gap-3 text-sm font-medium border border-white/10"
          >
            <div className="w-6 h-6 rounded-full bg-red-500/20 flex items-center justify-center shrink-0">
              <CheckCircle2 size={14} className="text-red-400 stroke-[2.5]" />
            </div>
            <span>Order <strong className="font-mono">#{cancelSuccess}</strong> cancelled.</span>
          </motion.div>
        )}
      </AnimatePresence>
    </div>
  );
}
