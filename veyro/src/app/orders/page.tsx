"use client";

import React, { useState, useMemo } from "react";
import Image from "next/image";
import Link from "next/link";
import { useUser } from "@/context/UserContext";
import { formatPrice } from "@/lib/utils";
import type { OrderStatus } from "@/types";
import { Container } from "@/components/ui/Container";
import {
  Package,
  ChevronRight,
  Truck,
  CheckCircle2,
  Clock,
  ArrowRight,
  Search,
  ShieldCheck,
  RotateCcw,
  ShoppingBag,
  ExternalLink,
  X,
  XCircle,
  Sparkles,
  Check,
} from "lucide-react";

const STATUS_CONFIG: Record<
  OrderStatus,
  { label: string; bg: string; text: string; border: string; icon: React.ReactNode }
> = {
  Confirmed: {
    label: "Order Confirmed",
    bg: "bg-blue-50",
    text: "text-blue-700",
    border: "border-blue-200/80",
    icon: <Package size={13} className="stroke-[2.5]" />,
  },
  Packed: {
    label: "Packed & Ready",
    bg: "bg-amber-50",
    text: "text-amber-800",
    border: "border-amber-200/80",
    icon: <Package size={13} className="stroke-[2.5]" />,
  },
  Shipped: {
    label: "In Transit",
    bg: "bg-indigo-50",
    text: "text-indigo-700",
    border: "border-indigo-200/80",
    icon: <Truck size={13} className="stroke-[2.5]" />,
  },
  "Out for Delivery": {
    label: "Out for Delivery",
    bg: "bg-amber-100/70",
    text: "text-amber-900",
    border: "border-amber-300/80",
    icon: <Truck size={13} className="stroke-[2.5]" />,
  },
  Delivered: {
    label: "Delivered",
    bg: "bg-emerald-50",
    text: "text-emerald-700",
    border: "border-emerald-200/80",
    icon: <CheckCircle2 size={13} className="stroke-[2.5]" />,
  },
};

type StatusFilterKey = "on_the_way" | "delivered" | "confirmed" | "cancelled";
type TimeFilterKey = "last_30_days" | "2026" | "2025" | "older";

export default function OrdersPage() {
  const { user, orders, openAccountModal } = useUser();

  // Filter States (Flipkart-Style Checkboxes)
  const [selectedStatuses, setSelectedStatuses] = useState<Set<StatusFilterKey>>(new Set());
  const [selectedTimes, setSelectedTimes] = useState<Set<TimeFilterKey>>(new Set());
  const [searchQuery, setSearchQuery] = useState("");
  const [activeSearch, setActiveSearch] = useState("");

  const handleStatusToggle = (key: StatusFilterKey) => {
    setSelectedStatuses((prev) => {
      const next = new Set(prev);
      if (next.has(key)) {
        next.delete(key);
      } else {
        next.add(key);
      }
      return next;
    });
  };

  const handleTimeToggle = (key: TimeFilterKey) => {
    setSelectedTimes((prev) => {
      const next = new Set(prev);
      if (next.has(key)) {
        next.delete(key);
      } else {
        next.add(key);
      }
      return next;
    });
  };

  const clearAllFilters = () => {
    setSelectedStatuses(new Set());
    setSelectedTimes(new Set());
    setSearchQuery("");
    setActiveSearch("");
  };

  const handleSearchSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    setActiveSearch(searchQuery.trim());
  };

  // Filter evaluation
  const filteredOrders = useMemo(() => {
    return orders.filter((order) => {
      // 1. Status Filter
      if (selectedStatuses.size > 0) {
        const matchesOnTheWay =
          selectedStatuses.has("on_the_way") &&
          (order.status === "Out for Delivery" || order.status === "Shipped");
        const matchesDelivered =
          selectedStatuses.has("delivered") && order.status === "Delivered";
        const matchesConfirmed =
          selectedStatuses.has("confirmed") &&
          (order.status === "Confirmed" || order.status === "Packed");
        const matchesCancelled =
          selectedStatuses.has("cancelled") &&
          (order.status as string) === "Cancelled";

        if (!matchesOnTheWay && !matchesDelivered && !matchesConfirmed && !matchesCancelled) {
          return false;
        }
      }

      // 2. Time Filter
      if (selectedTimes.size > 0) {
        const dateStr = order.date.toLowerCase();
        const matches30Days =
          selectedTimes.has("last_30_days") &&
          (dateStr.includes("today") || dateStr.includes("sep 2026"));
        const matches2026 =
          selectedTimes.has("2026") &&
          (dateStr.includes("2026") || dateStr.includes("today"));
        const matches2025 =
          selectedTimes.has("2025") && dateStr.includes("2025");
        const matchesOlder =
          selectedTimes.has("older") &&
          !dateStr.includes("2026") &&
          !dateStr.includes("2025") &&
          !dateStr.includes("today");

        if (!matches30Days && !matches2026 && !matches2025 && !matchesOlder) {
          return false;
        }
      }

      // 3. Search Filter
      const term = activeSearch.toLowerCase();
      if (term) {
        const matchesId = order.id.toLowerCase().includes(term);
        const matchesItems = order.items?.some((item) =>
          item.productName.toLowerCase().includes(term)
        );
        const matchesNames = order.itemNames?.some((name) =>
          name.toLowerCase().includes(term)
        );

        if (!matchesId && !matchesItems && !matchesNames) {
          return false;
        }
      }

      return true;
    });
  }, [orders, selectedStatuses, selectedTimes, activeSearch]);

  const hasActiveFilters =
    selectedStatuses.size > 0 || selectedTimes.size > 0 || activeSearch.length > 0;

  // ── GUEST GATE ───────────────────────────────────────────────────────────
  if (!user) {
    return (
      <div className="min-h-[70vh] flex items-center justify-center px-4 bg-neutral-50/60">
        <div className="text-center max-w-md mx-auto bg-white border border-neutral-200 rounded-2xl p-8 shadow-sm">
          <div className="w-16 h-16 bg-neutral-100 text-neutral-700 rounded-full flex items-center justify-center mx-auto mb-4">
            <Package size={28} />
          </div>
          <h1 className="text-2xl font-bold text-neutral-900 mb-2">
            Sign In to View Orders
          </h1>
          <p className="text-sm text-neutral-500 leading-relaxed mb-6 max-w-xs mx-auto">
            Track your deliveries, access order invoices, and view your complete purchase history.
          </p>
          <button
            type="button"
            onClick={openAccountModal}
            className="inline-flex items-center justify-center gap-2 w-full bg-neutral-900 text-white px-6 py-3.5 text-xs font-semibold rounded-lg hover:bg-black transition-colors cursor-pointer"
          >
            <span>Sign In to Your Account</span>
            <ArrowRight size={14} />
          </button>
          <div className="flex items-center justify-center gap-1.5 mt-4 text-xs text-neutral-400">
            <ShieldCheck size={14} className="text-neutral-500" />
            <span>256-Bit SSL Secured Portal</span>
          </div>
        </div>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-neutral-100/70 pb-20">
      {/* Top Banner / Breadcrumbs */}
      <div className="border-b border-neutral-200/80 bg-white">
        <Container>
          <div className="py-3 flex items-center justify-between text-xs text-neutral-500">
            <div className="flex items-center gap-2 text-xs">
              <Link href="/" className="hover:text-neutral-900 transition-colors">
                Home
              </Link>
              <ChevronRight size={12} className="text-neutral-400" />
              <Link href="/account/addresses" className="hover:text-neutral-900 transition-colors">
                My Account
              </Link>
              <ChevronRight size={12} className="text-neutral-400" />
              <span className="text-neutral-900 font-semibold">
                My Orders
              </span>
            </div>
            <Link
              href="/account/addresses"
              className="hover:text-neutral-900 transition-colors font-medium text-xs hidden sm:inline"
            >
              Manage Profile & Address →
            </Link>
          </div>
        </Container>
      </div>

      <Container className="pt-6 sm:pt-8">
        {/* Flipkart-Style Two-Column Layout */}
        <div className="grid grid-cols-1 lg:grid-cols-12 gap-6 items-start">

          {/* ── LEFT COLUMN: FILTERS SIDEBAR (Flipkart Style) ── */}
          <aside className="lg:col-span-3 bg-white border border-neutral-200/90 rounded-lg shadow-2xs overflow-hidden">
            <div className="p-4 border-b border-neutral-100 flex items-center justify-between">
              <h2 className="text-base font-bold text-neutral-900">Filters</h2>
              {hasActiveFilters && (
                <button
                  type="button"
                  onClick={clearAllFilters}
                  className="text-xs font-semibold text-blue-600 hover:text-blue-800 transition-colors cursor-pointer"
                >
                  CLEAR ALL
                </button>
              )}
            </div>

            {/* ORDER STATUS SECTION */}
            <div className="p-4 border-b border-neutral-100 space-y-3">
              <span className="text-xs font-bold text-neutral-800 uppercase tracking-wider block">
                Order Status
              </span>
              <div className="space-y-2.5 text-xs text-neutral-700">
                <label className="flex items-center gap-2.5 cursor-pointer select-none hover:text-neutral-950">
                  <input
                    type="checkbox"
                    checked={selectedStatuses.has("on_the_way")}
                    onChange={() => handleStatusToggle("on_the_way")}
                    className="w-4 h-4 rounded border-neutral-300 text-blue-600 focus:ring-blue-500 cursor-pointer"
                  />
                  <span>On the way</span>
                </label>

                <label className="flex items-center gap-2.5 cursor-pointer select-none hover:text-neutral-950">
                  <input
                    type="checkbox"
                    checked={selectedStatuses.has("delivered")}
                    onChange={() => handleStatusToggle("delivered")}
                    className="w-4 h-4 rounded border-neutral-300 text-blue-600 focus:ring-blue-500 cursor-pointer"
                  />
                  <span>Delivered</span>
                </label>

                <label className="flex items-center gap-2.5 cursor-pointer select-none hover:text-neutral-950">
                  <input
                    type="checkbox"
                    checked={selectedStatuses.has("confirmed")}
                    onChange={() => handleStatusToggle("confirmed")}
                    className="w-4 h-4 rounded border-neutral-300 text-blue-600 focus:ring-blue-500 cursor-pointer"
                  />
                  <span>Confirmed</span>
                </label>

                <label className="flex items-center gap-2.5 cursor-pointer select-none hover:text-neutral-950">
                  <input
                    type="checkbox"
                    checked={selectedStatuses.has("cancelled")}
                    onChange={() => handleStatusToggle("cancelled")}
                    className="w-4 h-4 rounded border-neutral-300 text-blue-600 focus:ring-blue-500 cursor-pointer"
                  />
                  <span>Cancelled</span>
                </label>
              </div>
            </div>

            {/* ORDER TIME SECTION */}
            <div className="p-4 space-y-3">
              <span className="text-xs font-bold text-neutral-800 uppercase tracking-wider block">
                Order Time
              </span>
              <div className="space-y-2.5 text-xs text-neutral-700">
                <label className="flex items-center gap-2.5 cursor-pointer select-none hover:text-neutral-950">
                  <input
                    type="checkbox"
                    checked={selectedTimes.has("last_30_days")}
                    onChange={() => handleTimeToggle("last_30_days")}
                    className="w-4 h-4 rounded border-neutral-300 text-blue-600 focus:ring-blue-500 cursor-pointer"
                  />
                  <span>Last 30 days</span>
                </label>

                <label className="flex items-center gap-2.5 cursor-pointer select-none hover:text-neutral-950">
                  <input
                    type="checkbox"
                    checked={selectedTimes.has("2026")}
                    onChange={() => handleTimeToggle("2026")}
                    className="w-4 h-4 rounded border-neutral-300 text-blue-600 focus:ring-blue-500 cursor-pointer"
                  />
                  <span>2026</span>
                </label>

                <label className="flex items-center gap-2.5 cursor-pointer select-none hover:text-neutral-950">
                  <input
                    type="checkbox"
                    checked={selectedTimes.has("2025")}
                    onChange={() => handleTimeToggle("2025")}
                    className="w-4 h-4 rounded border-neutral-300 text-blue-600 focus:ring-blue-500 cursor-pointer"
                  />
                  <span>2025</span>
                </label>

                <label className="flex items-center gap-2.5 cursor-pointer select-none hover:text-neutral-950">
                  <input
                    type="checkbox"
                    checked={selectedTimes.has("older")}
                    onChange={() => handleTimeToggle("older")}
                    className="w-4 h-4 rounded border-neutral-300 text-blue-600 focus:ring-blue-500 cursor-pointer"
                  />
                  <span>Older</span>
                </label>
              </div>
            </div>
          </aside>

          {/* ── RIGHT COLUMN: SEARCH & ORDERS STREAM ── */}
          <main className="lg:col-span-9 space-y-4">
            {/* Search Bar matching Flipkart */}
            <form onSubmit={handleSearchSubmit} className="flex items-stretch gap-0 bg-white border border-neutral-200/90 rounded-lg shadow-2xs overflow-hidden">
              <div className="relative flex-1">
                <input
                  type="text"
                  value={searchQuery}
                  onChange={(e) => setSearchQuery(e.target.value)}
                  placeholder="Search your orders here"
                  className="w-full h-11 px-4 text-xs sm:text-sm bg-transparent focus-visible:outline-hidden text-neutral-900 placeholder:text-neutral-400"
                />
                {searchQuery && (
                  <button
                    type="button"
                    onClick={() => {
                      setSearchQuery("");
                      setActiveSearch("");
                    }}
                    className="absolute right-3 top-1/2 -translate-y-1/2 text-neutral-400 hover:text-neutral-600 cursor-pointer"
                  >
                    <X size={14} />
                  </button>
                )}
              </div>
              <button
                type="submit"
                className="bg-blue-600 hover:bg-blue-700 text-white font-semibold text-xs px-5 sm:px-6 flex items-center gap-2 transition-colors cursor-pointer shrink-0"
              >
                <Search size={14} />
                <span>Search Orders</span>
              </button>
            </form>

            {/* Active Filter Chips */}
            {hasActiveFilters && (
              <div className="flex items-center gap-2 flex-wrap text-xs pt-1">
                <span className="text-neutral-500 text-[11px]">Filtered by:</span>
                {Array.from(selectedStatuses).map((status) => (
                  <span
                    key={status}
                    className="inline-flex items-center gap-1 bg-white border border-neutral-300 text-neutral-800 px-2.5 py-0.5 rounded-full text-[11px] shadow-2xs"
                  >
                    <span>{status.replace(/_/g, " ")}</span>
                    <button
                      type="button"
                      onClick={() => handleStatusToggle(status)}
                      className="text-neutral-400 hover:text-neutral-700 cursor-pointer"
                    >
                      <X size={11} />
                    </button>
                  </span>
                ))}
                {Array.from(selectedTimes).map((time) => (
                  <span
                    key={time}
                    className="inline-flex items-center gap-1 bg-white border border-neutral-300 text-neutral-800 px-2.5 py-0.5 rounded-full text-[11px] shadow-2xs"
                  >
                    <span>{time.replace(/_/g, " ")}</span>
                    <button
                      type="button"
                      onClick={() => handleTimeToggle(time)}
                      className="text-neutral-400 hover:text-neutral-700 cursor-pointer"
                    >
                      <X size={11} />
                    </button>
                  </span>
                ))}
                {activeSearch && (
                  <span className="inline-flex items-center gap-1 bg-white border border-neutral-300 text-neutral-800 px-2.5 py-0.5 rounded-full text-[11px] shadow-2xs">
                    <span>&quot;{activeSearch}&quot;</span>
                    <button
                      type="button"
                      onClick={() => {
                        setSearchQuery("");
                        setActiveSearch("");
                      }}
                      className="text-neutral-400 hover:text-neutral-700 cursor-pointer"
                    >
                      <X size={11} />
                    </button>
                  </span>
                )}
              </div>
            )}

            {/* Orders Stream or Flipkart Zero-State */}
            {filteredOrders.length > 0 ? (
              <div className="space-y-4">
                {filteredOrders.map((order) => {
                  const cfg = STATUS_CONFIG[order.status as OrderStatus] || {
                    label: order.status,
                    bg: "bg-neutral-100",
                    text: "text-neutral-800",
                    border: "border-neutral-200",
                    icon: <Package size={13} />,
                  };

                  return (
                    <div
                      key={order.id}
                      className="bg-white border border-neutral-200/90 rounded-lg overflow-hidden shadow-2xs hover:shadow-sm transition-all"
                    >
                      {/* Card Header Bar */}
                      <div className="px-5 py-3.5 bg-neutral-50/70 border-b border-neutral-100 flex flex-wrap items-center justify-between gap-3 text-xs">
                        <div className="flex items-center gap-4 flex-wrap">
                          <div>
                            <span className="text-neutral-400 block text-[10px] uppercase font-bold tracking-wider">
                              Order Placed
                            </span>
                            <span className="font-semibold text-neutral-800">
                              {order.date}
                            </span>
                          </div>
                          <div className="h-6 w-px bg-neutral-200 hidden sm:block" />
                          <div>
                            <span className="text-neutral-400 block text-[10px] uppercase font-bold tracking-wider">
                              Total
                            </span>
                            <span className="font-bold text-neutral-900">
                              {formatPrice(order.total)}
                            </span>
                          </div>
                          <div className="h-6 w-px bg-neutral-200 hidden sm:block" />
                          <div>
                            <span className="text-neutral-400 block text-[10px] uppercase font-bold tracking-wider">
                              Order ID
                            </span>
                            <span className="font-mono text-neutral-700 font-medium">
                              #{order.id}
                            </span>
                          </div>
                        </div>

                        {/* Status Badge */}
                        <div className="flex items-center gap-2">
                          <span
                            className={`inline-flex items-center gap-1.5 px-2.5 py-1 rounded-full text-xs font-semibold border ${cfg.bg} ${cfg.text} ${cfg.border}`}
                          >
                            {cfg.icon}
                            <span>{cfg.label}</span>
                          </span>
                        </div>
                      </div>

                      {/* Items Body */}
                      <div className="p-5 divide-y divide-neutral-100">
                        {order.items && order.items.length > 0 ? (
                          order.items.map((item, idx) => (
                            <div
                              key={`${order.id}-${idx}`}
                              className="py-3 first:pt-0 last:pb-0 flex items-start justify-between gap-4"
                            >
                              <div className="flex items-start gap-3.5 min-w-0">
                                <div className="relative w-16 h-20 rounded-md overflow-hidden bg-neutral-100 shrink-0 border border-neutral-200/60">
                                  <Image
                                    src={item.imageUrl}
                                    alt={item.productName}
                                    fill
                                    sizes="64px"
                                    className="object-cover object-center"
                                  />
                                </div>
                                <div className="min-w-0 space-y-1">
                                  <Link
                                    href={`/product/${item.productSlug}`}
                                    className="text-xs sm:text-sm font-bold text-neutral-900 hover:text-blue-600 transition-colors line-clamp-1 block"
                                  >
                                    {item.productName}
                                  </Link>
                                  <div className="text-[11px] text-neutral-500">
                                    {item.colorName && `Color: ${item.colorName} • `}
                                    Size: <span className="font-semibold text-neutral-800">{item.selectedSize}</span> • Qty: {item.quantity}
                                  </div>
                                  <div className="text-xs font-semibold text-neutral-900 pt-0.5">
                                    {formatPrice(item.unitPrice)}
                                  </div>
                                </div>
                              </div>

                              <div className="text-right shrink-0">
                                <span className="text-xs text-neutral-500 block">
                                  {order.status === "Delivered" ? "Delivered" : "Delivery by"}
                                </span>
                                <span className="text-xs font-bold text-neutral-900 block">
                                  {order.estimatedDelivery}
                                </span>
                              </div>
                            </div>
                          ))
                        ) : (
                          <div className="py-2 text-xs text-neutral-600">
                            {order.itemNames?.join(", ")}
                          </div>
                        )}
                      </div>

                      {/* Card Footer Actions */}
                      <div className="px-5 py-3 bg-neutral-50/40 border-t border-neutral-100 flex items-center justify-between text-xs">
                        <span className="text-[11px] text-neutral-500">
                          Shipped via <strong className="text-neutral-700">VEYRO Express</strong>
                        </span>
                        <Link
                          href={`/orders/${order.id}`}
                          className="inline-flex items-center gap-1.5 font-semibold text-blue-600 hover:text-blue-800 transition-colors"
                        >
                          <span>Track Order Details</span>
                          <ArrowRight size={13} />
                        </Link>
                      </div>
                    </div>
                  );
                })}
              </div>
            ) : (
              /* ── FLIPKART EMPTY STATE (Matching User's Screenshot) ── */
              <div className="bg-white border border-neutral-200/90 rounded-lg p-12 sm:p-16 text-center shadow-2xs">
                {/* Visual Graphics matching Flipkart phone/box illustration */}
                <div className="relative w-28 h-28 mx-auto mb-6 flex items-center justify-center">
                  <div className="w-20 h-24 bg-neutral-100 border-2 border-neutral-300 rounded-xl shadow-xs flex flex-col items-center justify-center">
                    <div className="w-8 h-8 rounded-lg bg-neutral-200/80 flex items-center justify-center mb-1">
                      <Package size={18} className="text-neutral-500" />
                    </div>
                    <div className="w-10 h-1 bg-neutral-300 rounded-full mb-1" />
                    <div className="w-6 h-1 bg-neutral-200 rounded-full" />
                  </div>
                  {/* Floating colorful accent tags matching Flipkart */}
                  <span className="absolute -top-1 -right-1 w-7 h-7 rounded-md bg-amber-400 text-amber-950 flex items-center justify-center shadow-xs">
                    <Sparkles size={13} className="text-amber-950" />
                  </span>
                  <span className="absolute -bottom-1 -left-1 w-6 h-6 rounded-md bg-blue-600 text-white flex items-center justify-center shadow-xs">
                    <Check size={12} className="stroke-[3]" />
                  </span>
                </div>

                <h3 className="text-xl font-bold text-neutral-900 mb-2">
                  You have no orders
                </h3>
                <p className="text-xs sm:text-sm text-neutral-500 max-w-sm mx-auto mb-6">
                  {hasActiveFilters
                    ? "No orders match the selected filters or search keyword. Try clearing filters to see all your orders."
                    : "You haven't placed any orders yet. Start exploring our latest apparel and sneakers."}
                </p>

                {hasActiveFilters ? (
                  <button
                    type="button"
                    onClick={clearAllFilters}
                    className="inline-flex items-center justify-center gap-2 bg-blue-600 hover:bg-blue-700 text-white px-6 py-2.5 rounded-lg text-xs font-semibold transition-colors cursor-pointer"
                  >
                    <span>Clear All Filters</span>
                  </button>
                ) : (
                  <Link
                    href="/clothing"
                    className="inline-flex items-center justify-center gap-2 bg-blue-600 hover:bg-blue-700 text-white px-7 py-2.5 rounded-md text-xs font-semibold transition-colors shadow-xs"
                  >
                    <span>Start Shopping</span>
                  </Link>
                )}
              </div>
            )}
          </main>
        </div>
      </Container>
    </div>
  );
}
