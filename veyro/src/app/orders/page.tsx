"use client";

import React, { useState, useMemo, useCallback, useRef, useEffect } from "react";
import Image from "next/image";
import Link from "next/link";
import { motion, AnimatePresence } from "motion/react";
import { useUser } from "@/context/UserContext";
import type { OrderRecord } from "@/types";
import { formatPrice } from "@/lib/utils";
import type { OrderStatus } from "@/types";
import { Container } from "@/components/ui/Container";
import {
  Package,
  ChevronRight,
  ChevronDown,
  ChevronUp,
  Truck,
  CheckCircle2,
  Clock,
  ArrowRight,
  Search,
  ShieldCheck,
  RotateCcw,
  ShoppingBag,
  X,
  XCircle,
  Sparkles,
  Check,
  SlidersHorizontal,
  Headset,
  MapPin,
  FileText,
  ArrowUpDown,
  RotateCw,
  AlertTriangle,
  Ban,
  ClipboardCheck,
  Undo2,
  Repeat,
} from "lucide-react";
import { CancelOrderModal, isOrderCancellable } from "@/components/features/CancelOrderModal";
import { Toast } from "@/components/ui/Toast";

// ── Custom Delivery Truck Icon matching reference ─────────────────────────
function YellowDeliveryTruckIcon({ className = "w-4 h-4" }: { className?: string }) {
  return (
    <svg
      className={className}
      viewBox="0 0 20 16"
      fill="none"
      xmlns="http://www.w3.org/2000/svg"
      aria-hidden="true"
    >
      {/* Main cargo container */}
      <rect
        x="1"
        y="1.5"
        width="11"
        height="9.5"
        rx="1"
        fill="#FBBF24"
        stroke="#18181B"
        strokeWidth="1.5"
        strokeLinejoin="round"
      />
      {/* Truck cab */}
      <path
        d="M12 4.5H15.5L18.5 8V11H12V4.5Z"
        fill="#FBBF24"
        stroke="#18181B"
        strokeWidth="1.5"
        strokeLinejoin="round"
      />
      {/* Cab windshield */}
      <path
        d="M13 5.5H15L17 8H13V5.5Z"
        fill="#FEF3C7"
        stroke="#18181B"
        strokeWidth="1"
        strokeLinejoin="round"
      />
      {/* Front wheel */}
      <circle cx="15.5" cy="12.5" r="2" fill="#18181B" />
      <circle cx="15.5" cy="12.5" r="0.75" fill="#FBBF24" />
      {/* Rear wheel */}
      <circle cx="4.5" cy="12.5" r="2" fill="#18181B" />
      <circle cx="4.5" cy="12.5" r="0.75" fill="#FBBF24" />
      {/* Front bumper */}
      <rect x="18.5" y="9.5" width="1" height="1.5" fill="#18181B" rx="0.5" />
    </svg>
  );
}

// ── Custom Green Checkmark Icon matching reference ────────────────────────
function GreenCheckmarkIcon({ className = "w-3.5 h-3.5" }: { className?: string }) {
  return (
    <svg
      className={className}
      viewBox="0 0 16 16"
      fill="none"
      xmlns="http://www.w3.org/2000/svg"
      aria-hidden="true"
    >
      <circle cx="8" cy="8" r="7.5" fill="#02964D" />
      <path
        d="M4.75 8.25L6.75 10.25L11.25 5.75"
        stroke="white"
        strokeWidth="1.8"
        strokeLinecap="round"
        strokeLinejoin="round"
      />
    </svg>
  );
}

// ── Status badge configuration ──────────────────────────────────────────────
const STATUS_CONFIG: Record<
  OrderStatus,
  { label: string; bg: string; text: string; border: string; rounded: string; icon: React.ReactNode }
> = {
  Confirmed: {
    label: "Confirmed",
    bg: "bg-blue-50",
    text: "text-blue-700",
    border: "border-transparent",
    rounded: "rounded-lg",
    icon: <ClipboardCheck size={13} className="stroke-[2]" />,
  },
  Packed: {
    label: "Packed & Ready",
    bg: "bg-amber-50",
    text: "text-amber-800",
    border: "border-amber-200/80",
    rounded: "rounded-full",
    icon: <Package size={13} className="stroke-[2.5]" />,
  },
  Shipped: {
    label: "In Transit",
    bg: "bg-indigo-50",
    text: "text-indigo-700",
    border: "border-indigo-200/80",
    rounded: "rounded-full",
    icon: <Truck size={13} className="stroke-[2.5]" />,
  },
  "Out for Delivery": {
    label: "Out for Delivery",
    bg: "bg-[#FEF7D6]",
    text: "text-[#8A440E]",
    border: "border-transparent",
    rounded: "rounded-lg",
    icon: <YellowDeliveryTruckIcon className="w-4 h-4 shrink-0" />,
  },
  Delivered: {
    label: "Delivered",
    bg: "bg-[#E6F8EE]",
    text: "text-[#136F3F]",
    border: "border-transparent",
    rounded: "rounded-lg",
    icon: <GreenCheckmarkIcon className="w-3.5 h-3.5 shrink-0" />,
  },
  Cancelled: {
    label: "Cancelled",
    bg: "bg-red-50",
    text: "text-red-700",
    border: "border-red-200/80",
    rounded: "rounded-full",
    icon: <Ban size={13} className="stroke-[2.5]" />,
  },
  Returned: {
    label: "Returned",
    bg: "bg-violet-50",
    text: "text-violet-700",
    border: "border-violet-200/80",
    rounded: "rounded-full",
    icon: <Undo2 size={13} className="stroke-[2.5]" />,
  },
  "Return Requested": {
    label: "Return Requested",
    bg: "bg-violet-50",
    text: "text-violet-700",
    border: "border-violet-200/80",
    rounded: "rounded-full",
    icon: <Undo2 size={13} className="stroke-[2.5]" />,
  },
};

// ── Filter tab definitions ──────────────────────────────────────────────────
type TabKey = "all" | "on_the_way" | "delivered" | "confirmed" | "cancelled" | "returned";
type SortKey = "newest" | "oldest" | "price_high" | "price_low";
type TimeFilterKey = "last_30_days" | "last_3_months" | "2026" | "2025" | "older";

const TAB_LABELS: Record<TabKey, string> = {
  all: "All Orders",
  on_the_way: "On the way",
  delivered: "Delivered",
  confirmed: "Confirmed",
  cancelled: "Cancelled",
  returned: "Returned",
};

// Sidebar filter icons
const STATUS_FILTER_ICONS: Record<TabKey, React.ReactNode> = {
  all: <Package size={15} />,
  on_the_way: <YellowDeliveryTruckIcon className="w-4 h-4 shrink-0" />,
  delivered: <GreenCheckmarkIcon className="w-4 h-4 shrink-0" />,
  confirmed: <ClipboardCheck size={15} color="#3B82F6" />, // Blue 500
  cancelled: <Ban size={15} color="#EF4444" />, // Red 500
  returned: <Undo2 size={15} color="#8B5CF6" />, // Violet 500
};

const SORT_OPTIONS: { key: SortKey; label: string; icon: (isSelected: boolean) => React.ReactNode }[] = [
  {
    key: "newest",
    label: "Newest First",
    icon: (selected) => (
      <Clock
        size={16}
        className={selected ? "text-neutral-950 stroke-[2]" : "text-neutral-800 stroke-[1.8]"}
      />
    ),
  },
  {
    key: "oldest",
    label: "Oldest First",
    icon: (selected) => (
      <Clock
        size={16}
        className={selected ? "text-neutral-950 stroke-[2]" : "text-neutral-800 stroke-[1.8]"}
      />
    ),
  },
  {
    key: "price_high",
    label: "Price: High → Low",
    icon: (selected) => (
      <ArrowUpDown
        size={16}
        className={selected ? "text-neutral-950 stroke-[2]" : "text-neutral-800 stroke-[1.8]"}
      />
    ),
  },
  {
    key: "price_low",
    label: "Price: Low → High",
    icon: (selected) => (
      <ArrowUpDown
        size={16}
        className={selected ? "text-neutral-950 stroke-[2]" : "text-neutral-800 stroke-[1.8]"}
      />
    ),
  },
];

function matchesTabFilter(status: string, tab: TabKey): boolean {
  if (tab === "all") return true;
  if (tab === "on_the_way") return status === "Out for Delivery" || status === "Shipped";
  if (tab === "delivered") return status === "Delivered";
  if (tab === "confirmed") return status === "Confirmed" || status === "Packed";
  if (tab === "cancelled") return status === "Cancelled";
  if (tab === "returned") {
    return status === "Returned" || status === "Return Requested";
  }
  return true;
}

function matchesTimeFilter(dateStr: string, key: TimeFilterKey): boolean {
  const d = dateStr.toLowerCase();
  if (key === "last_30_days") return d.includes("today") || d.includes("sep 2026");
  if (key === "last_3_months") return d.includes("today") || d.includes("sep 2026") || d.includes("aug 2026") || d.includes("jul 2026");
  if (key === "2026") return d.includes("2026") || d.includes("today");
  if (key === "2025") return d.includes("2025");
  if (key === "older") return !d.includes("2026") && !d.includes("2025") && !d.includes("today");
  return true;
}

// ═══════════════════════════════════════════════════════════════════════════════
// MAIN COMPONENT
// ═══════════════════════════════════════════════════════════════════════════════
export default function OrdersPage() {
  const { user, orders, openAccountModal, cancelOrder } = useUser();

  // ── State ─────────────────────────────────────────────────────────────────
  const [activeTab, setActiveTab] = useState<TabKey>("all");
  const [selectedTimes, setSelectedTimes] = useState<Set<TimeFilterKey>>(new Set());
  const [searchQuery, setSearchQuery] = useState("");
  const [activeSearch, setActiveSearch] = useState("");
  const [sortBy, setSortBy] = useState<SortKey>("newest");
  const [isSortOpen, setIsSortOpen] = useState(false);
  const [statusSectionOpen, setStatusSectionOpen] = useState(true);
  const [timeSectionOpen, setTimeSectionOpen] = useState(true);
  const sortDropdownRef = useRef<HTMLDivElement>(null);

  // ── Cancel order modal state ──────────────────────────────────────────
  const [cancelModalOrder, setCancelModalOrder] = useState<OrderRecord | null>(null);
  const [cancelSuccess, setCancelSuccess] = useState<string | null>(null);

  const handleCancelDismiss = useCallback(() => {
    setCancelModalOrder(null);
  }, []);

  // Close dropdown on outside click or ESC
  useEffect(() => {
    function handleClickOutside(event: MouseEvent) {
      if (sortDropdownRef.current && !sortDropdownRef.current.contains(event.target as Node)) {
        setIsSortOpen(false);
      }
    }
    function handleKeyDown(event: KeyboardEvent) {
      if (event.key === "Escape") {
        setIsSortOpen(false);
      }
    }
    if (isSortOpen) {
      document.addEventListener("mousedown", handleClickOutside);
      document.addEventListener("keydown", handleKeyDown);
    }
    return () => {
      document.removeEventListener("mousedown", handleClickOutside);
      document.removeEventListener("keydown", handleKeyDown);
    };
  }, [isSortOpen]);

  // ── Computed counts (before time/search filters) ──────────────────────────
  const tabCounts = useMemo(() => {
    const counts: Record<TabKey, number> = {
      all: orders.length,
      on_the_way: 0,
      delivered: 0,
      confirmed: 0,
      cancelled: 0,
      returned: 0,
    };
    for (const o of orders) {
      if (matchesTabFilter(o.status, "on_the_way")) counts.on_the_way++;
      if (matchesTabFilter(o.status, "delivered")) counts.delivered++;
      if (matchesTabFilter(o.status, "confirmed")) counts.confirmed++;
      if (matchesTabFilter(o.status, "cancelled")) counts.cancelled++;
      if (matchesTabFilter(o.status, "returned")) counts.returned++;
    }
    return counts;
  }, [orders]);

  const timeCounts = useMemo(() => {
    const counts: Record<TimeFilterKey, number> = {
      last_30_days: 0,
      last_3_months: 0,
      "2026": 0,
      "2025": 0,
      older: 0,
    };
    for (const o of orders) {
      if (matchesTimeFilter(o.date, "last_30_days")) counts.last_30_days++;
      if (matchesTimeFilter(o.date, "last_3_months")) counts.last_3_months++;
      if (matchesTimeFilter(o.date, "2026")) counts["2026"]++;
      if (matchesTimeFilter(o.date, "2025")) counts["2025"]++;
      if (matchesTimeFilter(o.date, "older")) counts.older++;
    }
    return counts;
  }, [orders]);

  // ── Handlers ──────────────────────────────────────────────────────────────
  const handleTimeToggle = useCallback((key: TimeFilterKey) => {
    setSelectedTimes((prev) => {
      const next = new Set(prev);
      if (next.has(key)) next.delete(key);
      else next.add(key);
      return next;
    });
  }, []);

  const clearAllFilters = useCallback(() => {
    setActiveTab("all");
    setSelectedTimes(new Set());
    setSearchQuery("");
    setActiveSearch("");
    setSortBy("newest");
  }, []);

  const handleSearchSubmit = useCallback(
    (e: React.FormEvent) => {
      e.preventDefault();
      setActiveSearch(searchQuery.trim());
    },
    [searchQuery]
  );

  // ── Filtering + sorting ───────────────────────────────────────────────────
  const filteredOrders = useMemo(() => {
    let result = orders.filter((order) => {
      // 1. Tab filter
      if (!matchesTabFilter(order.status, activeTab)) return false;

      // 2. Time filter
      if (selectedTimes.size > 0) {
        const matchesAny = Array.from(selectedTimes).some((key) =>
          matchesTimeFilter(order.date, key)
        );
        if (!matchesAny) return false;
      }

      // 3. Search filter
      const term = activeSearch.toLowerCase();
      if (term) {
        const matchesId = order.id.toLowerCase().includes(term);
        const matchesItems = order.items?.some((item) =>
          item.productName.toLowerCase().includes(term)
        );
        const matchesNames = order.itemNames?.some((name) =>
          name.toLowerCase().includes(term)
        );
        if (!matchesId && !matchesItems && !matchesNames) return false;
      }

      return true;
    });

    // Sort
    if (sortBy === "oldest") {
      result = [...result].reverse();
    } else if (sortBy === "price_high") {
      result = [...result].sort((a, b) => b.total - a.total);
    } else if (sortBy === "price_low") {
      result = [...result].sort((a, b) => a.total - b.total);
    }

    return result;
  }, [orders, activeTab, selectedTimes, activeSearch, sortBy]);

  const hasActiveFilters =
    activeTab !== "all" || selectedTimes.size > 0 || activeSearch.length > 0;

  // ── GUEST GATE ────────────────────────────────────────────────────────────
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

  // ═══════════════════════════════════════════════════════════════════════════
  // MAIN RENDER
  // ═══════════════════════════════════════════════════════════════════════════
  return (
    <div className="min-h-screen bg-neutral-50 pb-20">
      {/* ── Breadcrumbs ──────────────────────────────────────────────────── */}
      <div className="border-b border-neutral-200/80 bg-white">
        <Container>
          <nav
            aria-label="Breadcrumb"
            className="py-3 flex items-center gap-2 text-xs text-neutral-500"
          >
            <Link href="/" className="hover:text-neutral-900 transition-colors">
              Home
            </Link>
            <ChevronRight size={12} className="text-neutral-400" />
            <Link href="/account/addresses" className="hover:text-neutral-900 transition-colors">
              My Account
            </Link>
            <ChevronRight size={12} className="text-neutral-400" />
            <span className="text-neutral-900 font-semibold">My Orders</span>
          </nav>
        </Container>
      </div>

      {/* ── Page Title ───────────────────────────────────────────────────── */}
      <Container>
        <div className="pt-6 pb-5 sm:pt-8 sm:pb-6">
          <h1 className="text-2xl sm:text-3xl font-bold text-neutral-900">My Orders</h1>
          <p className="text-sm text-neutral-500 mt-1">
            Track, manage and return your orders
          </p>
        </div>
      </Container>

      {/* ── Main Content Grid ────────────────────────────────────────────── */}
      <Container>
        <div className="grid grid-cols-1 lg:grid-cols-12 gap-6 items-start">

          {/* ════════════════════════════════════════════════════════════════ */}
          {/* LEFT SIDEBAR — FILTERS                                        */}
          {/* ════════════════════════════════════════════════════════════════ */}
          <aside className="lg:col-span-3 bg-white border border-neutral-200/90 rounded-xl shadow-xs overflow-hidden lg:sticky lg:top-6">

            {/* Sidebar Header */}
            <div className="px-5 py-4 border-b border-neutral-100 flex items-center justify-between">
              <div className="flex items-center gap-2">
                <SlidersHorizontal size={16} className="text-neutral-700" />
                <h2 className="text-sm font-bold text-neutral-900">Filters</h2>
              </div>
              {hasActiveFilters && (
                <button
                  type="button"
                  onClick={clearAllFilters}
                  className="flex items-center gap-1.5 text-xs font-semibold text-neutral-900 hover:text-black transition-colors cursor-pointer"
                  aria-label="Clear all filters"
                >
                  <RotateCw size={13} className="stroke-[2.2]" />
                  <span className="underline underline-offset-2">Clear all</span>
                </button>
              )}
            </div>

            {/* ── Order Status Section (Collapsible) ── */}
            <div className="border-b border-neutral-100">
              <button
                type="button"
                onClick={() => setStatusSectionOpen((v) => !v)}
                className="w-full px-5 py-3.5 flex items-center justify-between cursor-pointer hover:bg-neutral-50/60 transition-colors"
                aria-expanded={statusSectionOpen}
              >
                <div className="flex items-center gap-2">
                  <Package size={15} className="text-neutral-500" />
                  <span className="text-sm font-semibold text-neutral-900">Order Status</span>
                </div>
                {statusSectionOpen ? (
                  <ChevronUp size={16} className="text-neutral-400" />
                ) : (
                  <ChevronDown size={16} className="text-neutral-400" />
                )}
              </button>

              <div
                className="overflow-hidden transition-all duration-200"
                style={{
                  maxHeight: statusSectionOpen ? "400px" : "0px",
                  opacity: statusSectionOpen ? 1 : 0,
                }}
              >
                <div className="px-5 pb-4 space-y-1">
                  {(Object.keys(TAB_LABELS) as TabKey[]).map((key) => {
                    const isActive = activeTab === key;
                    return (
                      <button
                        key={key}
                        type="button"
                        onClick={() => setActiveTab(key)}
                        className={`w-full flex items-center gap-3 px-3 py-2.5 rounded-lg text-left cursor-pointer transition-colors ${
                          isActive
                            ? "bg-amber-50 text-neutral-900"
                            : "hover:bg-neutral-50 text-neutral-700"
                        }`}
                        aria-pressed={isActive}
                      >
                        {/* Custom checkbox visual */}
                        <span
                          className={`w-5 h-5 rounded flex items-center justify-center shrink-0 border transition-colors ${
                            isActive
                              ? "bg-amber-400 border-amber-400"
                              : "border-neutral-300 bg-white"
                          }`}
                          aria-hidden="true"
                        >
                          {isActive && <Check size={12} className="text-white stroke-[3]" />}
                        </span>

                        {/* Icon + Label */}
                        <span className="flex items-center gap-2 flex-1 min-w-0">
                          <span className={`shrink-0 ${isActive ? "text-neutral-800" : "text-neutral-400"}`}>
                            {STATUS_FILTER_ICONS[key]}
                          </span>
                          <span className={`text-sm truncate ${isActive ? "font-semibold" : "font-medium"}`}>
                            {TAB_LABELS[key]}
                          </span>
                        </span>

                        {/* Count badge */}
                        <span className={`text-xs tabular-nums ${isActive ? "text-neutral-700 font-semibold" : "text-neutral-400"}`}>
                          ({tabCounts[key]})
                        </span>
                      </button>
                    );
                  })}
                </div>
              </div>
            </div>

            {/* ── Order Time Section (Collapsible) ── */}
            <div className="border-b border-neutral-100">
              <button
                type="button"
                onClick={() => setTimeSectionOpen((v) => !v)}
                className="w-full px-5 py-3.5 flex items-center justify-between cursor-pointer hover:bg-neutral-50/60 transition-colors"
                aria-expanded={timeSectionOpen}
              >
                <div className="flex items-center gap-2">
                  <Clock size={15} className="text-neutral-500" />
                  <span className="text-sm font-semibold text-neutral-900">Order Time</span>
                </div>
                {timeSectionOpen ? (
                  <ChevronUp size={16} className="text-neutral-400" />
                ) : (
                  <ChevronDown size={16} className="text-neutral-400" />
                )}
              </button>

              <div
                className="overflow-hidden transition-all duration-200"
                style={{
                  maxHeight: timeSectionOpen ? "300px" : "0px",
                  opacity: timeSectionOpen ? 1 : 0,
                }}
              >
                <div className="px-5 pb-4 space-y-1">
                  {(
                    [
                      { key: "last_30_days" as TimeFilterKey, label: "Last 30 days" },
                      { key: "last_3_months" as TimeFilterKey, label: "Last 3 months" },
                      { key: "2026" as TimeFilterKey, label: "2026" },
                      { key: "2025" as TimeFilterKey, label: "2025" },
                      { key: "older" as TimeFilterKey, label: "Older" },
                    ] as const
                  ).map(({ key, label }) => {
                    const isActive = selectedTimes.has(key);
                    return (
                      <button
                        key={key}
                        type="button"
                        onClick={() => handleTimeToggle(key)}
                        className={`w-full flex items-center gap-3 px-3 py-2.5 rounded-lg text-left cursor-pointer transition-colors ${
                          isActive
                            ? "bg-amber-50 text-neutral-900"
                            : "hover:bg-neutral-50 text-neutral-700"
                        }`}
                        aria-pressed={isActive}
                      >
                        <span
                          className={`w-5 h-5 rounded flex items-center justify-center shrink-0 border transition-colors ${
                            isActive
                              ? "bg-amber-400 border-amber-400"
                              : "border-neutral-300 bg-white"
                          }`}
                          aria-hidden="true"
                        >
                          {isActive && <Check size={12} className="text-white stroke-[3]" />}
                        </span>
                        <span className={`text-sm flex-1 ${isActive ? "font-semibold" : "font-medium"}`}>
                          {label}
                        </span>
                        <span className={`text-xs tabular-nums ${isActive ? "text-neutral-700 font-semibold" : "text-neutral-400"}`}>
                          ({timeCounts[key]})
                        </span>
                      </button>
                    );
                  })}
                </div>
              </div>
            </div>

            {/* ── Support CTA Card ── */}
            <div className="p-4 pt-1">
              <div className="bg-[#FEF5D4] rounded-2xl p-4 sm:p-5">
                <div className="flex items-start gap-3.5">
                  <Headset size={26} className="text-neutral-950 stroke-[2.2] shrink-0 mt-0.5" />
                  <div className="flex-1 min-w-0">
                    <p className="text-sm font-bold text-neutral-950 tracking-tight leading-snug">
                      Need help with an order?
                    </p>
                    <p className="text-xs text-neutral-500 font-normal mt-0.5 mb-3 leading-normal">
                      Our support team is here to help.
                    </p>
                    <button
                      type="button"
                      className="inline-flex items-center justify-center gap-2 bg-white text-neutral-950 rounded-full px-4 py-2 text-xs font-semibold shadow-xs hover:shadow-sm hover:bg-neutral-50/90 active:scale-[0.98] transition-all cursor-pointer"
                    >
                      <span>Contact Support</span>
                      <ArrowRight size={13} className="stroke-[2.2]" />
                    </button>
                  </div>
                </div>
              </div>
            </div>
          </aside>

          {/* ════════════════════════════════════════════════════════════════ */}
          {/* RIGHT COLUMN — SEARCH, TABS, ORDERS                           */}
          {/* ════════════════════════════════════════════════════════════════ */}
          <main className="lg:col-span-9 space-y-5">

            {/* ── Search Bar + Sort ──────────────────────────────────────── */}
            <div className="flex flex-col sm:flex-row gap-3">
              <form
                onSubmit={handleSearchSubmit}
                className="flex items-stretch flex-1 bg-white border border-neutral-200/90 rounded-xl shadow-xs overflow-hidden"
              >
                <div className="relative flex-1 flex items-center">
                  <Search size={15} className="absolute left-4 text-neutral-400 pointer-events-none" />
                  <input
                    type="text"
                    value={searchQuery}
                    onChange={(e) => setSearchQuery(e.target.value)}
                    placeholder="Search your orders by product name, order ID, etc..."
                    className="w-full h-11 pl-10 pr-10 text-sm bg-transparent focus-visible:outline-hidden text-neutral-900 placeholder:text-neutral-400"
                    aria-label="Search orders"
                  />
                  {searchQuery && (
                    <button
                      type="button"
                      onClick={() => {
                        setSearchQuery("");
                        setActiveSearch("");
                      }}
                      className="absolute right-3 text-neutral-400 hover:text-neutral-600 cursor-pointer"
                      aria-label="Clear search"
                    >
                      <X size={14} />
                    </button>
                  )}
                </div>
                <button
                  type="submit"
                  className="bg-neutral-900 hover:bg-black text-white font-semibold text-xs px-5 sm:px-6 flex items-center gap-2 transition-colors cursor-pointer shrink-0 rounded-r-xl"
                >
                  <span>Search Orders</span>
                </button>
              </form>

              {/* ── Sort Dropdown matching Reference Image 2 ───────────────── */}
              <div ref={sortDropdownRef} className="relative shrink-0 flex items-center gap-2">
                <span className="text-xs text-neutral-500 hidden sm:inline whitespace-nowrap">Sort by</span>
                <button
                  type="button"
                  onClick={() => setIsSortOpen((v) => !v)}
                  className="h-11 bg-white border border-neutral-300 hover:border-neutral-400 rounded-xl px-3.5 sm:px-4 flex items-center gap-2.5 text-xs sm:text-[13px] font-semibold text-neutral-900 shadow-xs hover:shadow-sm transition-all cursor-pointer select-none focus:outline-none focus:ring-2 focus:ring-black/10"
                  aria-expanded={isSortOpen}
                  aria-haspopup="listbox"
                  aria-label="Sort orders"
                >
                  <ArrowUpDown size={15} className="text-neutral-900 stroke-[2] shrink-0" />
                  <span className="tracking-tight">
                    {SORT_OPTIONS.find((o) => o.key === sortBy)?.label || "Newest First"}
                  </span>
                  <motion.span
                    animate={{ rotate: isSortOpen ? 180 : 0 }}
                    transition={{ duration: 0.22, ease: [0.16, 1, 0.3, 1] }}
                    className="flex items-center justify-center shrink-0 ml-0.5"
                  >
                    <ChevronDown size={15} className="text-neutral-900 stroke-[2.2]" />
                  </motion.span>
                </button>

                <AnimatePresence>
                  {isSortOpen && (
                    <motion.div
                      initial={{ opacity: 0, scale: 0.95, y: -6 }}
                      animate={{ opacity: 1, scale: 1, y: 0 }}
                      exit={{ opacity: 0, scale: 0.95, y: -6 }}
                      transition={{ duration: 0.18, ease: [0.16, 1, 0.3, 1] }}
                      className="absolute right-0 top-full mt-2 w-56 sm:w-60 bg-white border border-neutral-200/90 rounded-2xl shadow-[0_14px_38px_rgba(0,0,0,0.1),0_4px_12px_rgba(0,0,0,0.04)] p-1.5 z-40 origin-top-right focus:outline-none"
                      role="listbox"
                      aria-label="Sort options"
                    >
                      {SORT_OPTIONS.map((opt) => {
                        const isSelected = sortBy === opt.key;
                        return (
                          <motion.button
                            key={opt.key}
                            type="button"
                            role="option"
                            aria-selected={isSelected}
                            onClick={() => {
                              setSortBy(opt.key);
                              setIsSortOpen(false);
                            }}
                            whileTap={{ scale: 0.98 }}
                            className={`w-full flex items-center justify-between px-3.5 py-2.5 rounded-xl text-xs sm:text-[13px] transition-colors cursor-pointer select-none ${
                              isSelected
                                ? "bg-[#FEF5D4] text-neutral-950 font-bold"
                                : "text-neutral-800 hover:bg-neutral-100/70 font-medium"
                            }`}
                          >
                            <span className="flex items-center gap-3">
                              <span className="shrink-0">{opt.icon(isSelected)}</span>
                              <span className="tracking-tight">{opt.label}</span>
                            </span>
                            {isSelected && (
                              <motion.span
                                initial={{ scale: 0.5, opacity: 0 }}
                                animate={{ scale: 1, opacity: 1 }}
                                transition={{ duration: 0.15, ease: "easeOut" }}
                                className="shrink-0 flex items-center justify-center text-neutral-950 ml-2"
                              >
                                <Check size={16} className="stroke-[2.5]" />
                              </motion.span>
                            )}
                          </motion.button>
                        );
                      })}
                    </motion.div>
                  )}
                </AnimatePresence>
              </div>
            </div>

            {/* ── Horizontal Status Tabs ──────────────────────────────────── */}
            <div className="flex items-center gap-2 flex-wrap" role="tablist" aria-label="Filter orders by status">
              {(Object.keys(TAB_LABELS) as TabKey[]).map((key) => {
                const isSelected = activeTab === key;
                return (
                  <button
                    key={key}
                    type="button"
                    role="tab"
                    aria-selected={isSelected}
                    onClick={() => setActiveTab(key)}
                    className={`inline-flex items-center gap-1.5 px-3.5 py-2 rounded-lg text-xs font-semibold transition-colors cursor-pointer whitespace-nowrap ${
                      isSelected
                        ? "bg-black text-white shadow-xs"
                        : "bg-[#EDEDEE] text-neutral-800 hover:bg-[#E2E2E5]"
                    }`}
                  >
                    <span>{TAB_LABELS[key]}</span>
                    <span className={isSelected ? "text-neutral-400 font-normal" : "text-neutral-500 font-normal"}>
                      ({tabCounts[key]})
                    </span>
                  </button>
                );
              })}
            </div>

            {/* ── Orders List ────────────────────────────────────────────── */}
            {filteredOrders.length > 0 ? (
              <div className="space-y-4" role="tabpanel">
                {filteredOrders.map((order) => {
                  const cfg = STATUS_CONFIG[order.status as OrderStatus] || {
                    label: order.status,
                    bg: "bg-neutral-100",
                    text: "text-neutral-800",
                    border: "border-neutral-200",
                    icon: <Package size={13} />,
                  };

                  const isDelivered = order.status === "Delivered";
                  const isActive =
                    order.status === "Out for Delivery" ||
                    order.status === "Shipped" ||
                    order.status === "Confirmed" ||
                    order.status === "Packed";

                  return (
                    <div
                      key={order.id}
                      className="bg-white border border-neutral-200/90 rounded-xl overflow-hidden shadow-xs hover:shadow-sm transition-shadow"
                    >
                      {/* ── Card Header ────────────────────────────────── */}
                      <div className="px-5 py-3.5 bg-white border-b border-neutral-100 flex flex-wrap items-center gap-x-5 gap-y-2">
                        {/* Meta columns */}
                        <div className="flex items-center gap-4 sm:gap-5 flex-wrap flex-1 min-w-0">
                          <div>
                            <span className="text-[10px] uppercase font-bold tracking-wider text-neutral-400 block">
                              Order Placed
                            </span>
                            <span className="text-xs font-semibold text-neutral-900">
                              {order.date}
                            </span>
                          </div>
                          <div className="h-6 w-px bg-neutral-200 hidden sm:block" aria-hidden="true" />
                          <div>
                            <span className="text-[10px] uppercase font-bold tracking-wider text-neutral-400 block">
                              Order ID
                            </span>
                            <span className="font-mono text-xs text-neutral-700 font-medium">
                              #{order.id}
                            </span>
                          </div>
                          <div className="h-6 w-px bg-neutral-200 hidden sm:block" aria-hidden="true" />
                          <div>
                            <span className="text-[10px] uppercase font-bold tracking-wider text-neutral-400 block">
                              Total
                            </span>
                            <span className="text-xs font-bold text-neutral-900">
                              {formatPrice(order.total)}
                            </span>
                          </div>
                        </div>

                        {/* Status badge + delivery + chevron */}
                        <div className="flex items-center gap-4">
                          <span
                            className={`inline-flex items-center gap-1.5 px-2.5 py-1 ${cfg.rounded} text-xs font-semibold border ${cfg.bg} ${cfg.text} ${cfg.border}`}
                          >
                            {cfg.icon}
                            <span>{cfg.label}</span>
                          </span>

                          <div className="h-6 w-px bg-neutral-200 hidden sm:block" aria-hidden="true" />

                          <div className="text-right hidden md:block">
                            <span className="text-[11px] text-neutral-500 block">
                              {isDelivered ? "Delivered on" : "Delivery by"}
                            </span>
                            <span className="text-xs font-bold text-neutral-900 block">
                              {order.estimatedDelivery?.replace("Delivered on ", "").replace("Delivered — ", "")}
                            </span>
                          </div>

                          <Link
                            href={`/orders/${order.id}`}
                            className="w-8 h-8 rounded-full flex items-center justify-center text-neutral-900 hover:text-black hover:bg-neutral-100 transition-colors"
                            aria-label={`View order ${order.id} details`}
                          >
                            <ChevronRight size={18} className="stroke-[2.2]" />
                          </Link>
                        </div>
                      </div>

                      {/* ── Card Body: Items + Actions ─────────────────── */}
                      <div className="p-5 flex flex-col md:flex-row gap-5">
                        {/* Items grid/list */}
                        <div className="flex-1 min-w-0">
                          {order.items && order.items.length > 1 ? (
                            /* Multi-item: horizontal grid */
                            <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                              {order.items.map((item, idx) => (
                                <Link
                                  key={`${order.id}-${idx}`}
                                  href={`/product/${item.productSlug}`}
                                  className="flex items-start gap-3.5 group"
                                >
                                  <div className="relative w-20 h-24 rounded-xl overflow-hidden bg-neutral-100 shrink-0 border border-neutral-200/50">
                                    <Image
                                      src={item.imageUrl}
                                      alt={item.productName}
                                      fill
                                      sizes="80px"
                                      className="object-cover object-center"
                                    />
                                  </div>
                                  <div className="min-w-0 space-y-1 pt-0.5">
                                    <p className="text-sm font-bold text-neutral-900 group-hover:text-neutral-600 transition-colors line-clamp-1">
                                      {item.productName}
                                    </p>
                                    <p className="text-xs text-neutral-500">
                                      {item.colorName} • {item.selectedSize} • Qty: {item.quantity}
                                    </p>
                                    <p className="text-sm font-bold text-neutral-900">
                                      {formatPrice(item.unitPrice)}
                                    </p>
                                  </div>
                                </Link>
                              ))}
                            </div>
                          ) : order.items && order.items.length === 1 ? (
                            /* Single item: horizontal row */
                            <Link
                              href={`/product/${order.items[0].productSlug}`}
                              className="flex items-start gap-4 group"
                            >
                              <div className="relative w-20 h-24 rounded-xl overflow-hidden bg-neutral-100 shrink-0 border border-neutral-200/50">
                                <Image
                                  src={order.items[0].imageUrl}
                                  alt={order.items[0].productName}
                                  fill
                                  sizes="80px"
                                  className="object-cover object-center"
                                />
                              </div>
                              <div className="min-w-0 space-y-1 pt-0.5">
                                <p className="text-sm font-bold text-neutral-900 group-hover:text-neutral-600 transition-colors line-clamp-1">
                                  {order.items[0].productName}
                                </p>
                                <p className="text-xs text-neutral-500">
                                  {order.items[0].colorName} • {order.items[0].selectedSize} • Qty:{" "}
                                  {order.items[0].quantity}
                                </p>
                                <p className="text-sm font-bold text-neutral-900">
                                  {formatPrice(order.items[0].unitPrice)}
                                </p>
                              </div>
                            </Link>
                          ) : (
                            <div className="py-2 text-sm text-neutral-600">
                              {order.itemNames?.join(", ")}
                            </div>
                          )}

                          {/* Mobile-only delivery info */}
                          <div className="mt-3 text-xs text-neutral-500 md:hidden">
                            <span>{isDelivered ? "Delivered on" : "Delivery by"}</span>{" "}
                            <span className="font-bold text-neutral-900">
                              {order.estimatedDelivery?.replace("Delivered on ", "").replace("Delivered — ", "")}
                            </span>
                          </div>
                        </div>

                        {/* Actions column */}
                        <div className="flex flex-row md:flex-col gap-2 md:w-[160px] shrink-0 md:items-stretch">
                          {isActive && (
                            <Link
                              href={`/orders/${order.id}`}
                              className="flex-1 md:flex-initial flex items-center justify-center gap-2 bg-neutral-900 hover:bg-black text-white rounded-lg px-4 py-2.5 text-xs font-semibold transition-colors shadow-xs"
                            >
                              <MapPin size={14} className="stroke-[2.2]" />
                              <span>Track Order</span>
                            </Link>
                          )}
                          <Link
                            href={`/orders/${order.id}`}
                            className="flex-1 md:flex-initial flex items-center justify-center gap-2 bg-[#EDEDEE] hover:bg-[#E2E2E5] text-neutral-900 rounded-lg px-4 py-2.5 text-xs font-semibold transition-colors"
                          >
                            <FileText size={14} className="stroke-[2]" />
                            <span>View Details</span>
                          </Link>
                          {isDelivered && (
                            <button
                              type="button"
                              className="flex-1 md:flex-initial flex items-center justify-center gap-2 bg-[#EDEDEE] hover:bg-[#E2E2E5] text-neutral-900 rounded-lg px-4 py-2.5 text-xs font-semibold cursor-pointer transition-colors"
                            >
                              <ShoppingBag size={14} className="stroke-[2]" />
                              <span>Buy Again</span>
                            </button>
                          )}
                          {isDelivered && (
                            (() => {
                              // Dynamically import orderUtils inside component scope since it's just logic,
                              // but normally we'd import at the top. Since this is a replacement, doing inline logic:
                              // Wait, doing inline is safer than messing with imports if I don't have to.
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
                                <Link
                                  href={`/orders/${order.id}/return`}
                                  className="flex-1 md:flex-initial flex items-center justify-center gap-2 bg-[#EDEDEE] hover:bg-[#E2E2E5] text-neutral-900 rounded-lg px-4 py-2.5 text-xs font-semibold cursor-pointer transition-colors"
                                >
                                  <RotateCw size={14} className="stroke-[2.2]" />
                                  <span>Return</span>
                                </Link>
                              ) : (
                                <button
                                  type="button"
                                  title={reason}
                                  disabled
                                  className="flex-1 md:flex-initial flex items-center justify-center gap-2 bg-[#F3F4F6] text-neutral-400 rounded-lg px-4 py-2.5 text-xs font-semibold cursor-not-allowed transition-colors"
                                >
                                  <RotateCw size={14} className="stroke-[2.2]" />
                                  <span>Return</span>
                                </button>
                              );
                            })()
                          )}
                          {isOrderCancellable(order.status) && (
                            <button
                              type="button"
                              onClick={() => setCancelModalOrder(order)}
                              className="flex-1 md:flex-initial flex items-center justify-center gap-2 border border-red-200 bg-white hover:bg-red-50 text-red-600 rounded-lg px-4 py-2.5 text-xs font-semibold cursor-pointer transition-colors"
                              aria-label={`Cancel order ${order.id}`}
                            >
                              <Ban size={14} className="stroke-[2]" />
                              <span>Cancel Order</span>
                            </button>
                          )}
                        </div>
                      </div>
                    </div>
                  );
                })}
              </div>
            ) : (
              /* ── Empty state ───────────────────────────────────────────── */
              <div className="bg-white border border-neutral-200/90 rounded-xl p-12 sm:p-16 text-center shadow-xs">
                <div className="relative w-28 h-28 mx-auto mb-6 flex items-center justify-center">
                  <div className="w-20 h-24 bg-neutral-100 border-2 border-neutral-300 rounded-xl shadow-xs flex flex-col items-center justify-center">
                    <div className="w-8 h-8 rounded-lg bg-neutral-200/80 flex items-center justify-center mb-1">
                      <Package size={18} className="text-neutral-500" />
                    </div>
                    <div className="w-10 h-1 bg-neutral-300 rounded-full mb-1" />
                    <div className="w-6 h-1 bg-neutral-200 rounded-full" />
                  </div>
                  <span className="absolute -top-1 -right-1 w-7 h-7 rounded-md bg-amber-400 text-amber-950 flex items-center justify-center shadow-xs">
                    <Sparkles size={13} className="text-amber-950" />
                  </span>
                  <span className="absolute -bottom-1 -left-1 w-6 h-6 rounded-md bg-neutral-900 text-white flex items-center justify-center shadow-xs">
                    <Check size={12} className="stroke-[3]" />
                  </span>
                </div>

                <h3 className="text-xl font-bold text-neutral-900 mb-2">
                  {hasActiveFilters ? "No matching orders" : "You have no orders"}
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
                    className="inline-flex items-center justify-center gap-2 bg-neutral-900 hover:bg-black text-white px-6 py-2.5 rounded-lg text-xs font-semibold transition-colors cursor-pointer"
                  >
                    <span>Clear All Filters</span>
                  </button>
                ) : (
                  <Link
                    href="/clothing"
                    className="inline-flex items-center justify-center gap-2 bg-neutral-900 hover:bg-black text-white px-7 py-2.5 rounded-lg text-xs font-semibold transition-colors shadow-xs"
                  >
                    <span>Start Shopping</span>
                  </Link>
                )}
              </div>
            )}
          </main>
        </div>
      </Container>

      {/* ── Cancel Order Confirmation Modal ──────────────────────────────── */}
      <CancelOrderModal
        order={cancelModalOrder}
        isOpen={Boolean(cancelModalOrder)}
        onClose={handleCancelDismiss}
        onConfirm={(orderId, reason) => {
          cancelOrder(orderId, reason);
          setCancelModalOrder(null);
          setCancelSuccess(orderId);
          setTimeout(() => {
            setCancelSuccess(null);
          }, 4000);
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
