"use client";

import React, { useState, useMemo, useEffect, useRef } from "react";
import Image from "next/image";
import { createPortal } from "react-dom";
import { motion, AnimatePresence, useReducedMotion } from "motion/react";
import { useUser } from "@/context/UserContext";
import type { OrderRecord, OrderStatus } from "@/types";
import {
  AdminDateRangePicker,
  DateFilterSelection,
  parseOrderDateToDayString,
  formatDayDisplay,
  formatBarDate,
} from "@/components/admin/AdminDateRangePicker";
import {
  ShoppingCart,
  TrendingUp,
  IndianRupee,
  Calendar,
  Package,
  Search,
  Filter,
  Eye,
  Trash2,
  X,
  MapPin,
  Phone,
  User as UserIcon,
  CreditCard,
  Clock,
  CheckCircle2,
  ChevronLeft,
  ChevronRight,
  CalendarDays,
  Download,
  Printer,
  Copy,
  Check,
  Sparkles,
  ArrowRight,
  RotateCcw,
  AlertTriangle,
  ExternalLink,
  BarChart3,
  Layers,
  CheckCircle,
  Truck,
  PackageCheck,
  XCircle,
  Box,
  MoreHorizontal,
  History,
  ChevronDown,
} from "lucide-react";
import { AdminIconBadge } from "@/components/admin/AdminIconBadge";
import { useAnchoredMenu } from "@/components/admin/useAnchoredMenu";
import { DUR_FAST, EASE } from "@/components/admin/motion";
import { AdminSelect, type AdminSelectOption } from "@/components/admin/AdminSelect";

interface StatusConfigItem {
  code: string;
  sublabel: string;
  accentColor: string;
  badgeBg: string;
  badgeBorder: string;
  renderIcon: () => React.ReactNode;
}

const STATUS_METADATA: Record<OrderStatus, StatusConfigItem> = {
  Confirmed: {
    code: "01",
    sublabel: "ORDER PLACED",
    accentColor: "#F59E0B",
    badgeBg: "bg-[var(--admin-surface)]",
    badgeBorder: "border-white/10",
    renderIcon: () => <Check size={16} strokeWidth={2} className="text-[var(--admin-text-muted)]" />,
  },
  Packed: {
    code: "02",
    sublabel: "READY TO SHIP",
    accentColor: "#F59E0B",
    badgeBg: "bg-[var(--admin-surface)]",
    badgeBorder: "border-white/10",
    renderIcon: () => <Package size={16} strokeWidth={2} className="text-[var(--admin-text-muted)]" />,
  },
  Shipped: {
    code: "03",
    sublabel: "IN TRANSIT",
    accentColor: "#38BDF8",
    badgeBg: "bg-[var(--admin-surface)]",
    badgeBorder: "border-white/10",
    renderIcon: () => <Truck size={16} strokeWidth={2} className="text-[var(--admin-text-muted)] -scale-x-100" />,
  },
  "Out for Delivery": {
    code: "04",
    sublabel: "ON THE WAY",
    accentColor: "#38BDF8",
    badgeBg: "bg-[var(--admin-surface)]",
    badgeBorder: "border-white/10",
    renderIcon: () => <Clock size={16} strokeWidth={2} className="text-[var(--admin-text-muted)]" />,
  },
  Delivered: {
    code: "05",
    sublabel: "SUCCESSFULLY",
    accentColor: "#00F59B",
    badgeBg: "bg-[var(--admin-surface)]",
    badgeBorder: "border-white/10",
    renderIcon: () => <PackageCheck size={16} strokeWidth={2} className="text-[var(--admin-text-muted)]" />,
  },
  Cancelled: {
    code: "06",
    sublabel: "BY CUSTOMER",
    accentColor: "#FF4B55",
    badgeBg: "bg-[var(--admin-surface)]",
    badgeBorder: "border-white/10",
    renderIcon: () => <XCircle size={16} strokeWidth={2} className="text-[var(--admin-text-muted)]" />,
  },
  "Return Requested": {
    code: "07",
    sublabel: "AWAITING REVIEW",
    accentColor: "#94A3B8",
    badgeBg: "bg-[var(--admin-surface)]",
    badgeBorder: "border-white/10",
    renderIcon: () => <RotateCcw size={16} strokeWidth={2} className="text-[var(--admin-text-muted)]" />,
  },
  Processing: {
    code: "00",
    sublabel: "IN PROGRESS",
    accentColor: "#F59E0B",
    badgeBg: "bg-[var(--admin-surface)]",
    badgeBorder: "border-white/10",
    renderIcon: () => <Clock size={16} strokeWidth={2} className="text-[var(--admin-text-muted)]" />,
  },
  Returned: {
    code: "08",
    sublabel: "COMPLETED",
    accentColor: "#94A3B8",
    badgeBg: "bg-[var(--admin-surface)]",
    badgeBorder: "border-white/10",
    renderIcon: () => <Box size={16} strokeWidth={2} className="text-[var(--admin-text-muted)]" />,
  },
};

const ALL_STATUSES: OrderStatus[] = [
  "Confirmed",
  "Packed",
  "Shipped",
  "Out for Delivery",
  "Delivered",
  "Cancelled",
  "Return Requested",
  "Returned",
];

const ORDER_STATUS_OPTIONS: AdminSelectOption[] = ALL_STATUSES.map((s) => ({
  value: s,
  label: s,
}));

export function normalizeOrderStatus(status: string | undefined): OrderStatus {
  if (!status) return "Confirmed";
  if (status === "Processing") return "Packed";
  if (ALL_STATUSES.includes(status as OrderStatus)) {
    return status as OrderStatus;
  }
  return "Confirmed";
}

function getStatusDot(status: OrderStatus) {
  switch (status) {
    case "Delivered":
      return "bg-[var(--admin-success)]";
    case "Shipped":
    case "Out for Delivery":
      return "bg-[var(--admin-info)]";
    case "Confirmed":
    case "Packed":
    case "Processing":
      return "bg-[var(--admin-warning)]";
    case "Cancelled":
      return "bg-[var(--admin-danger)]";
    case "Return Requested":
    case "Returned":
      return "bg-[var(--admin-primary)]";
    default:
      return "bg-white/40";
  }
}

function formatOrderRowDate(dateStr: string | undefined): { date: string; time: string } {
  if (!dateStr) return { date: "—", time: "" };
  if (dateStr.includes(",")) {
    const parts = dateStr.split(",");
    return {
      date: parts[0].trim(),
      time: parts.slice(1).join(",").trim(),
    };
  }
  return { date: dateStr, time: "" };
}

function getTimelineMilestoneIcon(status: string) {
  switch (status) {
    case "Confirmed":
      return <Check size={11} strokeWidth={2.5} />;
    case "Packed":
    case "Processing":
      return <Package size={11} strokeWidth={2} />;
    case "Shipped":
    case "Out for Delivery":
      return <Truck size={11} strokeWidth={2} />;
    case "Delivered":
      return <PackageCheck size={11} strokeWidth={2} />;
    default:
      return <Clock size={11} strokeWidth={2} />;
  }
}

interface CanonicalMilestone {
  key: OrderStatus;
  label: string;
  defaultDesc: string;
}

const CANONICAL_ORDER_STAGES: CanonicalMilestone[] = [
  { key: "Confirmed", label: "Confirmed", defaultDesc: "Payment verified & order confirmed" },
  { key: "Packed", label: "Packed", defaultDesc: "Quality inspection and dispatch preparation" },
  { key: "Shipped", label: "Shipped", defaultDesc: "Handover to VEYRO Priority Express" },
  { key: "Delivered", label: "Delivered", defaultDesc: "Package safely handed to customer" },
];

function getLifecycleStageIndex(status: OrderStatus): number {
  switch (status) {
    case "Confirmed":
      return 0;
    case "Processing":
    case "Packed":
      return 1;
    case "Shipped":
    case "Out for Delivery":
      return 2;
    case "Delivered":
      return 3;
    default:
      return 0;
  }
}

function AdminPortal({ children }: { children: React.ReactNode }) {
  const [mounted, setMounted] = useState(false);
  useEffect(() => {
    setMounted(true);
  }, []);
  if (!mounted || typeof document === "undefined") return null;
  return createPortal(children, document.body);
}

function OrderRowMenu({
  order,
  onViewDetails,
  onCopyId,
  onPrintSlip,
  onDelete,
}: {
  order: OrderRecord;
  onViewDetails: () => void;
  onCopyId: (e: React.MouseEvent) => void;
  onPrintSlip: (e: React.MouseEvent) => void;
  onDelete: () => void;
}) {
  const [open, setOpen] = useState(false);
  const shouldReduceMotion = useReducedMotion();
  const { triggerRef, menuRef, position } = useAnchoredMenu({
    isOpen: open,
    onClose: () => setOpen(false),
    offset: 6,
    viewportMargin: 8,
    closeOnScroll: true,
  });

  const placement = position?.placement ?? "bottom";
  const initialY = shouldReduceMotion ? 0 : placement === "top" ? 4 : -4;

  return (
    <div className="relative inline-flex items-center justify-end" onClick={(e) => e.stopPropagation()}>
      <button
        ref={triggerRef}
        type="button"
        onClick={(e) => {
          e.stopPropagation();
          setOpen((prev) => !prev);
        }}
        className="w-8 h-8 rounded-[10px] border border-transparent hover:border-white/10 hover:bg-white/[0.05] flex items-center justify-center text-[var(--admin-text-muted)] hover:text-white transition-colors cursor-pointer focus:outline-none focus-visible:ring-1 focus-visible:ring-[var(--admin-primary)]"
        aria-label={`Actions for order ${order.id}`}
        aria-haspopup="menu"
        aria-expanded={open}
      >
        <MoreHorizontal size={15} />
      </button>

      <AdminPortal>
        <AnimatePresence>
          {open && (
            <motion.div
              ref={menuRef}
              initial={shouldReduceMotion ? { opacity: 0 } : { opacity: 0, y: initialY }}
              animate={{ opacity: 1, y: 0 }}
              exit={shouldReduceMotion ? { opacity: 0 } : { opacity: 0, y: initialY }}
              transition={{ duration: shouldReduceMotion ? 0 : DUR_FAST, ease: EASE }}
              style={{
                position: "fixed",
                top: position ? `${position.top}px` : "-9999px",
                left: position ? `${position.left}px` : "-9999px",
                maxHeight: position?.maxHeight ? `${position.maxHeight}px` : undefined,
                visibility: position ? "visible" : "hidden",
                zIndex: 9999,
              }}
              className="w-48 bg-[var(--admin-surface)] rounded-[14px] border border-white/10 p-1.5 text-xs font-medium text-white shadow-2xl shadow-black/60 admin-scroll overflow-y-auto overscroll-contain space-y-0.5"
              role="menu"
              aria-label={`Actions for order ${order.id}`}
              onClick={(e) => e.stopPropagation()}
            >
              <button
                type="button"
                role="menuitem"
                onClick={() => {
                  setOpen(false);
                  onViewDetails();
                }}
                className="w-full text-left px-2.5 py-1.5 rounded-[8px] hover:bg-white/10 focus:bg-white/10 focus:outline-none flex items-center gap-2 text-white cursor-pointer transition-colors"
              >
                <Eye size={13} className="text-[var(--admin-text-muted)]" /> View details
              </button>

              <button
                type="button"
                role="menuitem"
                onClick={(e) => {
                  setOpen(false);
                  onCopyId(e);
                }}
                className="w-full text-left px-2.5 py-1.5 rounded-[8px] hover:bg-white/10 focus:bg-white/10 focus:outline-none flex items-center gap-2 text-white cursor-pointer transition-colors"
              >
                <Copy size={13} className="text-[var(--admin-text-muted)]" /> Copy ID
              </button>

              <button
                type="button"
                role="menuitem"
                onClick={(e) => {
                  setOpen(false);
                  onPrintSlip(e);
                }}
                className="w-full text-left px-2.5 py-1.5 rounded-[8px] hover:bg-white/10 focus:bg-white/10 focus:outline-none flex items-center gap-2 text-white cursor-pointer transition-colors"
              >
                <Printer size={13} className="text-[var(--admin-text-muted)]" /> Print slip
              </button>

              <div className="my-1 border-t border-white/5" role="separator" />

              <button
                type="button"
                role="menuitem"
                onClick={() => {
                  setOpen(false);
                  onDelete();
                }}
                className="w-full text-left px-2.5 py-1.5 rounded-[8px] hover:bg-[var(--admin-danger)]/15 focus:bg-[var(--admin-danger)]/15 focus:outline-none text-[var(--admin-danger)] flex items-center gap-2 cursor-pointer transition-colors"
              >
                <Trash2 size={13} /> Delete
              </button>
            </motion.div>
          )}
        </AnimatePresence>
      </AdminPortal>
    </div>
  );
}

interface DaySalesDayItem {
  date: string;
  label: string;
  count: number;
  totalRevenue: number;
}

interface DaySalesBarsProps {
  days: DaySalesDayItem[];
  activeDay?: string | null;
  maxDayRevenue: number;
  onSelectDay: (dayStr: string, label: string) => void;
}

function DaySalesBars({
  days,
  activeDay,
  maxDayRevenue,
  onSelectDay,
}: DaySalesBarsProps) {
  const containerRef = useRef<HTMLDivElement>(null);

  // Chronological order (oldest to newest, left to right)
  const chronologicalDays = useMemo(() => {
    return [...days].sort((a, b) => a.date.localeCompare(b.date));
  }, [days]);

  const isScrollable = chronologicalDays.length > 14;

  // Auto-scroll active day into view when there are many days
  useEffect(() => {
    if (isScrollable && activeDay && containerRef.current) {
      const activeEl = containerRef.current.querySelector<HTMLElement>(
        `[data-day="${activeDay}"]`
      );
      if (activeEl) {
        activeEl.scrollIntoView({
          behavior: "smooth",
          block: "nearest",
          inline: "center",
        });
      }
    }
  }, [activeDay, isScrollable]);

  if (chronologicalDays.length === 0) {
    return (
      <div className="h-36 p-4 bg-[var(--admin-surface-2)] rounded-xl border border-white/5 flex items-center justify-center text-xs text-[var(--admin-text-muted)]">
        No sales activity recorded
      </div>
    );
  }

  const safeMax =
    !maxDayRevenue || isNaN(maxDayRevenue) || maxDayRevenue <= 0
      ? 1
      : maxDayRevenue;

  return (
    <div className="relative">
      {/* Background Telemetry Grid Lines */}
      <div className="absolute inset-0 pt-7 pb-7 px-4 pointer-events-none flex flex-col justify-between opacity-30">
        <div className="w-full border-b border-dashed border-white/10" />
        <div className="w-full border-b border-dashed border-white/5" />
      </div>

      <div
        ref={containerRef}
        className={`h-36 px-3 pt-3 pb-2 bg-[var(--admin-surface-2)]/60 rounded-xl border border-white/5 relative z-10 ${
          isScrollable
            ? "flex items-stretch gap-2 overflow-x-auto admin-scroll overscroll-x-contain"
            : "grid gap-2"
        }`}
        style={
          isScrollable
            ? undefined
            : {
                gridTemplateColumns: `repeat(${chronologicalDays.length}, minmax(0, 1fr))`,
              }
        }
      >
        {chronologicalDays.map((d) => {
          const isActive = Boolean(activeDay && activeDay === d.date);
          const rev =
            typeof d.totalRevenue === "number" && !isNaN(d.totalRevenue)
              ? d.totalRevenue
              : 0;
          const isPeak = rev === maxDayRevenue && rev > 0;
          const rawPercent = Math.round((rev / safeMax) * 100);
          const heightPercent =
            !maxDayRevenue || isNaN(maxDayRevenue) || maxDayRevenue <= 0
              ? 12
              : Math.max(12, Math.min(100, isNaN(rawPercent) ? 12 : rawPercent));

          return (
            <div
              key={d.date}
              data-day={d.date}
              data-active={isActive ? "true" : "false"}
              role="button"
              tabIndex={0}
              onClick={() => onSelectDay(d.date, d.label)}
              onKeyDown={(e) => {
                if (e.key === "Enter" || e.key === " ") {
                  e.preventDefault();
                  onSelectDay(d.date, d.label);
                }
              }}
              title={`${d.label}: ${d.count} ${
                d.count === 1 ? "order" : "orders"
              } (₹${rev.toLocaleString("en-IN")}) — Click to inspect day`}
              className={`flex flex-col items-center h-full cursor-pointer group select-none outline-none focus-visible:ring-1 focus-visible:ring-white/50 rounded-lg ${
                isScrollable ? "shrink-0 min-w-[32px] flex-1" : "min-w-0 flex-1 w-full"
              }`}
            >
              {/* Top: Price telemetry slot */}
              <div className="h-4 shrink-0 w-full flex items-center justify-center mb-1 pointer-events-none">
                <span
                  className={`text-[9.5px] font-heading font-bold tabular-nums leading-none truncate transition-all duration-150 ${
                    isActive
                      ? "opacity-100 text-white scale-105 font-extrabold"
                      : isPeak
                      ? "opacity-80 text-white/90 group-hover:opacity-100 group-hover:scale-105"
                      : "opacity-0 group-hover:opacity-100 text-[var(--admin-text-muted)] group-hover:text-white"
                  }`}
                >
                  ₹{rev.toLocaleString("en-IN")}
                </span>
              </div>

              {/* Middle: Bar track with grounding baseline */}
              <div className="flex-1 min-h-0 w-full flex items-end justify-center border-b border-white/10 pb-[1px]">
                <div
                  style={{ height: `${heightPercent}%` }}
                  className={`w-full max-w-[28px] rounded-t-sm transition-all duration-150 ${
                    isActive
                      ? "bg-gradient-to-t from-white/40 via-white/80 to-white shadow-[0_0_12px_rgba(255,255,255,0.25)] border-t border-x border-white"
                      : isPeak
                      ? "bg-gradient-to-t from-white/[0.12] via-white/[0.22] to-white/[0.38] border-t border-x border-white/20 group-hover:from-white/25 group-hover:to-white/50"
                      : "bg-gradient-to-t from-white/[0.06] to-white/[0.20] border-t border-x border-white/10 group-hover:from-white/[0.16] group-hover:to-white/[0.36] group-hover:border-white/25"
                  }`}
                />
              </div>

              {/* Bottom: Date label with grounding */}
              <div className="h-4 shrink-0 w-full flex items-center justify-center mt-1.5 pointer-events-none">
                <span
                  className={`text-[9.5px] leading-none whitespace-nowrap text-center transition-colors duration-150 ${
                    isActive
                      ? "text-white font-bold"
                      : "text-[var(--admin-text-muted)] group-hover:text-white font-medium"
                  }`}
                >
                  {formatBarDate(d.date)}
                </span>
              </div>
            </div>
          );
        })}
      </div>
    </div>
  );
}

export default function AdminOrdersPage() {
  const { orders, updateOrderStatus, deleteOrder } = useUser();

  // Search & Filter state
  const [search, setSearch] = useState("");
  const [statusFilter, setStatusFilter] = useState<string>("all");
  const [selectedOrder, setSelectedOrder] = useState<OrderRecord | null>(null);
  const [showSalesChart, setShowSalesChart] = useState(false);

  // Pagination state
  const [currentPage, setCurrentPage] = useState(1);
  const PAGE_SIZE = 8;

  // Feedback Toast state
  const [toast, setToast] = useState<{ message: string; type: "success" | "info" } | null>(null);
  const triggerToast = (message: string, type: "success" | "info" = "success") => {
    setToast({ message, type });
    setTimeout(() => {
      setToast((curr) => (curr?.message === message ? null : curr));
    }, 3200);
  };

  // Copied ID animation tracking
  const [copiedId, setCopiedId] = useState<string | null>(null);
  const handleCopyId = (id: string, e: React.MouseEvent) => {
    e.stopPropagation();
    navigator.clipboard.writeText(id);
    setCopiedId(id);
    triggerToast(`Order ID ${id} copied to clipboard!`, "info");
    setTimeout(() => setCopiedId(null), 2000);
  };

  // ── DATE FILTERING & SCOPE NAVIGATION ─────────────────────────────────────
  const now = new Date();
  const todayIso = `${now.getFullYear()}-${String(now.getMonth() + 1).padStart(2, "0")}-${String(now.getDate()).padStart(2, "0")}`;
  const yDate = new Date(now);
  yDate.setDate(now.getDate() - 1);
  const yesterdayIso = `${yDate.getFullYear()}-${String(yDate.getMonth() + 1).padStart(2, "0")}-${String(yDate.getDate()).padStart(2, "0")}`;
  const months = ["Jan", "Feb", "Mar", "Apr", "May", "Jun", "Jul", "Aug", "Sep", "Oct", "Nov", "Dec"];
  const todayDisplay = `${String(now.getDate()).padStart(2, "0")} ${months[now.getMonth()]} ${now.getFullYear()}`;

  // Start in "All Time (Till Date)" mode
  const [dateFilter, setDateFilter] = useState<DateFilterSelection>({
    type: "all",
    label: "All Time (Till Date)",
    startDate: "2026-01-01",
    endDate: todayIso,
  });

  // Extract all unique dates where orders were placed chronologically with detailed day metrics
  const availableOrderDays = useMemo(() => {
    const dayMap = new Map<
      string,
      {
        date: string;
        label: string;
        count: number;
        totalRevenue: number;
        deliveredCount: number;
        aov: number;
      }
    >();
    orders.forEach((o) => {
      const day = parseOrderDateToDayString(o.date);
      const existing = dayMap.get(day) || {
        date: day,
        label: formatDayDisplay(day),
        count: 0,
        totalRevenue: 0,
        deliveredCount: 0,
        aov: 0,
      };
      existing.count += 1;
      existing.totalRevenue += o.total || 0;
      if (o.status === "Delivered") existing.deliveredCount += 1;
      dayMap.set(day, existing);
    });
    return Array.from(dayMap.values())
      .map((d) => ({
        ...d,
        aov: d.count > 0 ? Math.round(d.totalRevenue / d.count) : 0,
      }))
      .sort((a, b) => b.date.localeCompare(a.date));
  }, [orders]);

  // Current day index for stepping
  const currentDayIndex = useMemo(() => {
    if (dateFilter.type !== "day") return -1;
    const activeDay = dateFilter.singleDay || dateFilter.startDate;
    return availableOrderDays.findIndex((d) => d.date === activeDay);
  }, [dateFilter, availableOrderDays]);

  // Day step handler
  const handleStepDay = (direction: "prev" | "next") => {
    if (availableOrderDays.length === 0) return;
    let newIdx = currentDayIndex;
    if (newIdx === -1) {
      newIdx = 0;
    } else if (direction === "prev") {
      newIdx = Math.min(availableOrderDays.length - 1, newIdx + 1);
    } else {
      newIdx = Math.max(0, newIdx - 1);
    }
    const targetDay = availableOrderDays[newIdx];
    if (targetDay) {
      setDateFilter({
        type: "day",
        label: targetDay.label,
        startDate: targetDay.date,
        endDate: targetDay.date,
        singleDay: targetDay.date,
      });
      triggerToast(`Switched to ${targetDay.label} (${targetDay.count} ${targetDay.count === 1 ? "order" : "orders"})`, "info");
    }
  };

  // Switch to specific day
  const handleSelectDay = (dayStr: string, label: string) => {
    setDateFilter({
      type: "day",
      label,
      startDate: dayStr,
      endDate: dayStr,
      singleDay: dayStr,
    });
    triggerToast(`Viewing orders for ${label}`, "info");
  };

  // Switch to Till Date (All Time Cumulative)
  const handleSelectTillDate = () => {
    setDateFilter({
      type: "all",
      label: "All Time (Till Date)",
      startDate: "2026-01-01",
      endDate: todayIso,
    });
    triggerToast("Switched to All Time (Till Date) cumulative scope", "info");
  };

  // Switch to Day-Wise mode (defaulting to latest order date)
  const handleSelectDayWiseMode = () => {
    const latestDay = availableOrderDays[0];
    if (latestDay) {
      setDateFilter({
        type: "day",
        label: latestDay.label,
        startDate: latestDay.date,
        endDate: latestDay.date,
        singleDay: latestDay.date,
      });
      triggerToast(`Activated Day-Wise mode: Showing ${latestDay.label}`, "info");
    }
  };

  // ── FILTER ORDERS ACCORDING TO DATE, SEARCH & STATUS ───────────────────────
  const dateFilteredOrders = useMemo(() => {
    if (dateFilter.type === "all") return orders;
    return orders.filter((order) => {
      const orderDay = parseOrderDateToDayString(order.date);
      if (dateFilter.type === "day") {
        return orderDay === (dateFilter.singleDay || dateFilter.startDate);
      }
      return orderDay >= dateFilter.startDate && orderDay <= dateFilter.endDate;
    });
  }, [orders, dateFilter]);

  const filteredOrders = useMemo(() => {
    let list = dateFilteredOrders;

    if (statusFilter !== "all") {
      if (statusFilter === "Returned") {
        list = list.filter((order) => {
          const s = normalizeOrderStatus(order.status);
          return s === "Returned" || s === "Return Requested";
        });
      } else {
        list = list.filter((order) => normalizeOrderStatus(order.status) === statusFilter);
      }
    }

    if (search.trim()) {
      const q = search.toLowerCase().trim();
      list = list.filter((order) => {
        const matchesId = (order.id || "").toLowerCase().includes(q);
        const matchesName = (order.shippingAddress?.name || "").toLowerCase().includes(q);
        const matchesPhone = (order.shippingAddress?.phone || "").toLowerCase().includes(q);
        const matchesCity = (order.shippingAddress?.address || "").toLowerCase().includes(q);
        const matchesItem =
          (order.items || []).some((item) => (item.productName || "").toLowerCase().includes(q)) ||
          (order.itemNames || []).some((n) => n.toLowerCase().includes(q));
        return matchesId || matchesName || matchesPhone || matchesCity || matchesItem;
      });
    }

    return list;
  }, [dateFilteredOrders, statusFilter, search]);

  // Reset pagination on filter change
  useEffect(() => {
    setCurrentPage(1);
  }, [dateFilter, statusFilter, search]);

  const totalPages = Math.max(1, Math.ceil(filteredOrders.length / PAGE_SIZE));
  const paginatedOrders = useMemo(() => {
    const start = (currentPage - 1) * PAGE_SIZE;
    return filteredOrders.slice(start, start + PAGE_SIZE);
  }, [filteredOrders, currentPage]);

  // ── METRICS & STATS CALCULATION ───────────────────────────────────────────
  const stats = useMemo(() => {
    // Current scope stats
    const scopeOrders = dateFilteredOrders;
    const scopeRevenue = scopeOrders.reduce((sum, o) => sum + (o.total || 0), 0);
    const scopeAOV = scopeOrders.length > 0 ? Math.round(scopeRevenue / scopeOrders.length) : 0;
    const deliveredCount = scopeOrders.filter((o) => o.status === "Delivered").length;
    const deliveryRate = scopeOrders.length > 0 ? Math.round((deliveredCount / scopeOrders.length) * 100) : 0;

    // Lifetime store stats (Till Date)
    const lifetimeRevenue = orders.reduce((sum, o) => sum + (o.total || 0), 0);
    const lifetimeOrders = orders.length;
    const lifetimeAOV = lifetimeOrders > 0 ? Math.round(lifetimeRevenue / lifetimeOrders) : 0;

    // Status breakdown for current scope
    const statusCounts: Record<string, number> = {};
    ALL_STATUSES.forEach((s) => (statusCounts[s] = 0));
    scopeOrders.forEach((o) => {
      const s = normalizeOrderStatus(o.status);
      statusCounts[s] = (statusCounts[s] || 0) + 1;
    });

    // Top products in current scope - group by normalized product name
    const productCounts: Record<
      string,
      { name: string; count: number; revenue: number; image: string }
    > = {};
    scopeOrders.forEach((order) => {
      (order.items || []).forEach((item) => {
        const prodName = (item.productName || "Luxury Product").trim();
        const pKey = prodName.toLowerCase();
        if (!productCounts[pKey]) {
          productCounts[pKey] = {
            name: prodName,
            count: 0,
            revenue: 0,
            image: item.imageUrl || "/products/shoes/blanc-court-sneaker.webp",
          };
        }
        productCounts[pKey].count += item.quantity || 1;
        productCounts[pKey].revenue += item.totalPrice || item.unitPrice || 0;
      });
    });

    const topProducts = Object.values(productCounts)
      .sort((a, b) => b.revenue - a.revenue)
      .slice(0, 5);

    return {
      scopeOrdersCount: scopeOrders.length,
      scopeRevenue,
      scopeAOV,
      deliveryRate,
      lifetimeRevenue,
      lifetimeOrders,
      lifetimeAOV,
      statusCounts,
      topProducts,
    };
  }, [dateFilteredOrders, orders]);

  const statusFilterOptions = useMemo<AdminSelectOption[]>(() => [
    { value: "all", label: `All Statuses (${dateFilteredOrders.length})` },
    ...ALL_STATUSES.map((s) => ({
      value: s,
      label: `${s} (${stats.statusCounts[s] || 0})`,
    })),
  ], [dateFilteredOrders.length, stats.statusCounts]);

  // Max daily revenue for visualizer chart scaling
  const maxDayRevenue = useMemo(() => {
    if (availableOrderDays.length === 0) return 1;
    return Math.max(...availableOrderDays.map((d) => d.totalRevenue), 1);
  }, [availableOrderDays]);

  // Status change handler
  const handleStatusChange = (orderId: string, newStatus: OrderStatus) => {
    updateOrderStatus(orderId, newStatus);
    if (selectedOrder && selectedOrder.id === orderId) {
      setSelectedOrder((prev) => (prev ? { ...prev, status: newStatus } : null));
    }
    triggerToast(`Order #${orderId} marked as ${newStatus}`, "success");
  };

  // Delete handler
  const [orderToDelete, setOrderToDelete] = useState<string | null>(null);

  const handleConfirmDelete = () => {
    if (!orderToDelete) return;
    deleteOrder(orderToDelete);
    if (selectedOrder?.id === orderToDelete) {
      setSelectedOrder(null);
    }
    triggerToast(`Order #${orderToDelete} permanently deleted.`, "info");
    setOrderToDelete(null);
  };

  const handleDelete = (orderId: string) => {
    if (confirm(`Are you sure you want to delete order ${orderId}? This cannot be undone.`)) {
      deleteOrder(orderId);
      if (selectedOrder?.id === orderId) {
        setSelectedOrder(null);
      }
      triggerToast(`Order #${orderId} permanently deleted.`, "info");
    }
  };

  // ── PRINT INVOICE SLIP ────────────────────────────────────────────────────
  const handlePrintSlip = (order: OrderRecord, e: React.MouseEvent) => {
    e.stopPropagation();
    const slipWindow = window.open("", "_blank", "width=700,height=800");
    if (!slipWindow) {
      alert("Please allow popups to generate print slips.");
      return;
    }

    const itemsRows = (order.items || [])
      .map(
        (it) => `
        <tr style="border-bottom: 1px solid #f1f1f1;">
          <td style="padding: 10px 6px;">
            <div style="font-weight: 600; font-size: 13px;">${it.productName}</div>
            <div style="color: #666; font-size: 11px;">Size: ${it.selectedSize} · Color: ${it.colorName}</div>
          </td>
          <td style="padding: 10px 6px; text-align: center; font-size: 12px;">×${it.quantity}</td>
          <td style="padding: 10px 6px; text-align: right; font-weight: 600; font-size: 13px;">₹${it.totalPrice.toLocaleString("en-IN")}</td>
        </tr>
      `
      )
      .join("");

    slipWindow.document.write(`
      <!DOCTYPE html>
      <html>
        <head>
          <title>Order Receipt - ${order.id}</title>
          <style>
            body { font-family: -apple-system, BlinkMacSystemFont, 'Segoe UI', Roboto, Helvetica, Arial, sans-serif; margin: 0; padding: 32px; color: #111; }
            .header { text-align: center; border-bottom: 2px dashed #e5e5e5; padding-bottom: 18px; margin-bottom: 20px; }
            .logo { font-size: 24px; font-weight: 800; letter-spacing: 0.25em; text-transform: uppercase; margin-bottom: 4px; }
            .sub { font-size: 11px; letter-spacing: 0.35em; color: #666; margin-bottom: 12px; }
            .badge { display: inline-block; padding: 4px 10px; background: #000; color: #fff; font-size: 11px; font-weight: bold; border-radius: 4px; }
            .grid { display: flex; justify-content: space-between; margin-bottom: 24px; font-size: 12px; line-height: 1.6; }
            .box { flex: 1; padding: 12px; background: #f9f9f9; border-radius: 8px; margin-right: 12px; }
            .box:last-child { margin-right: 0; }
            table { width: 100%; border-collapse: collapse; margin-bottom: 24px; }
            th { text-align: left; font-size: 10px; text-transform: uppercase; letter-spacing: 0.1em; color: #777; border-bottom: 2px solid #ddd; padding: 8px 6px; }
            .total-box { margin-top: 16px; border-top: 2px solid #111; padding-top: 14px; text-align: right; }
            .total-line { display: flex; justify-content: flex-end; gap: 24px; margin-bottom: 4px; font-size: 13px; }
            .grand-total { font-size: 20px; font-weight: 800; }
            .footer { margin-top: 36px; text-align: center; font-size: 11px; color: #888; border-top: 1px dashed #e5e5e5; padding-top: 16px; }
          </style>
        </head>
        <body>
          <div class="header">
            <div class="logo">VEYRO</div>
            <div class="sub">HAUTE HORLOGERIE & APPAREL</div>
            <span class="badge">OFFICIAL SALES INVOICE & DISPATCH NOTE</span>
          </div>

          <div class="grid">
            <div class="box">
              <strong style="display:block; margin-bottom: 4px; font-size: 11px; text-transform: uppercase; color: #777;">Order Information</strong>
              <div><strong>Invoice / Order ID:</strong> ${order.id}</div>
              <div><strong>Order Date:</strong> ${order.date}</div>
              <div><strong>Status:</strong> ${order.status}</div>
              <div><strong>Payment Mode:</strong> ${order.paymentMethod.toUpperCase()} (Authorized)</div>
            </div>
            <div class="box">
              <strong style="display:block; margin-bottom: 4px; font-size: 11px; text-transform: uppercase; color: #777;">Customer & Shipping</strong>
              <div><strong>Recipient:</strong> ${order.shippingAddress?.name || "Verified Customer"}</div>
              <div><strong>Contact:</strong> ${order.shippingAddress?.phone || "N/A"}</div>
              <div><strong>Address:</strong> ${order.shippingAddress?.address || "Express Shipping Bay"}</div>
              <div><strong>Postal Code:</strong> ${order.shippingAddress?.pincode || "560034"}</div>
            </div>
          </div>

          <table>
            <thead>
              <tr>
                <th>Item Specification</th>
                <th style="text-align: center;">Qty</th>
                <th style="text-align: right;">Amount (INR)</th>
              </tr>
            </thead>
            <tbody>
              ${itemsRows}
            </tbody>
          </table>

          <div class="total-box">
            <div class="total-line">
              <span style="color: #666;">Subtotal:</span>
              <span>₹${(order.subtotal || order.total).toLocaleString("en-IN")}</span>
            </div>
            ${
              order.couponDiscount > 0
                ? `<div class="total-line" style="color: #16a34a;">
                    <span>Discount (${order.couponCode || "COUPON"}):</span>
                    <span>-₹${order.couponDiscount.toLocaleString("en-IN")}</span>
                   </div>`
                : ""
            }
            <div class="total-line grand-total">
              <span>Final Total Paid:</span>
              <span>₹${order.total.toLocaleString("en-IN")}</span>
            </div>
          </div>

          <div class="footer">
            <div>Authorized signature & certified digital invoice generated by VEYRO Admin Portal.</div>
            <div>Support: concierge@veyro.com · Returns window: 7 days from delivery.</div>
          </div>

          <script>
            window.onload = function() { window.print(); }
          </script>
        </body>
      </html>
    `);
    slipWindow.document.close();
  };

  // ── EXPORT CSV ────────────────────────────────────────────────────────────
  const handleExportCSV = () => {
    if (filteredOrders.length === 0) {
      alert("No orders match current filter to export.");
      return;
    }
    const headers = [
      "Order ID",
      "Date",
      "Customer Name",
      "Customer Phone",
      "Shipping Address",
      "Items Count",
      "Products",
      "Total Amount (INR)",
      "Status",
      "Payment Method",
    ];
    const rows = filteredOrders.map((o) => [
      `"${o.id}"`,
      `"${o.date}"`,
      `"${(o.shippingAddress?.name || "").replace(/"/g, '""')}"`,
      `"${o.shippingAddress?.phone || ""}"`,
      `"${(o.shippingAddress?.address || "").replace(/"/g, '""')}"`,
      o.items?.length || o.itemsCount || 1,
      `"${(o.items?.map((it) => `${it.productName} (x${it.quantity})`).join("; ") || o.itemNames?.join("; ") || "").replace(/"/g, '""')}"`,
      o.total,
      `"${o.status}"`,
      `"${o.paymentMethod}"`,
    ]);

    const csvContent = [headers.join(","), ...rows.map((r) => r.join(","))].join("\n");
    const blob = new Blob([csvContent], { type: "text/csv;charset=utf-8;" });
    const url = URL.createObjectURL(blob);
    const link = document.createElement("a");
    link.href = url;
    const scopeTag = dateFilter.type === "all" ? "TillDate" : dateFilter.startDate;
    link.setAttribute("download", `VEYRO_Orders_${scopeTag}_${new Date().toISOString().slice(0, 10)}.csv`);
    document.body.appendChild(link);
    link.click();
    document.body.removeChild(link);
    triggerToast(`Exported ${filteredOrders.length} orders to CSV successfully!`, "success");
  };

  const isTillDateMode = dateFilter.type === "all";
  const isDayWiseMode = dateFilter.type === "day";

  return (
    <div className="space-y-6 max-w-[1480px] mx-auto pb-12">
      {/* Toast Notification */}
      {toast && (
        <div className="fixed bottom-6 right-6 z-[10001] flex items-center gap-3 px-4 py-3 rounded-full bg-[var(--admin-elevated)] text-white border border-white/10 animate-in fade-in slide-in-from-bottom-3 duration-200">
          <div className={`p-1 rounded-full ${toast.type === "success" ? "bg-[#00F59B]/20 text-[#00F59B]" : "bg-[#F59E0B]/20 text-[#F59E0B]"}`}>
            <CheckCircle2 size={16} />
          </div>
          <span className="text-xs font-semibold">{toast.message}</span>
        </div>
      )}

      {/* ── TOP HEADER & LUXURY CONTROLS ────────────────────────────────────── */}
      <div className="flex flex-col xl:flex-row xl:items-center justify-between gap-4 bg-[var(--admin-surface)] p-6 rounded-2xl border border-white/5">
        <div>
          <h1 className="text-2xl sm:text-3xl font-bold font-heading text-white tracking-tight">
            Orders &amp; Sales Hub
          </h1>
          <p className="text-xs sm:text-sm text-[var(--admin-text-muted)] mt-1">
            Real-time management for all transactions, cumulative lifetime analytics, and day-wise sales stepping.
          </p>
        </div>

        {/* Action Controls & Mode Hub */}
        <div className="flex flex-wrap items-center gap-2">
          {/* View Mode Switcher: All Time vs Day-Wise */}
          <div className="flex items-center p-1 bg-[var(--admin-surface-2)] rounded-full border border-white/10">
            <button
              onClick={handleSelectTillDate}
              className={`flex items-center gap-1.5 px-3.5 py-1.5 rounded-full text-xs transition-all cursor-pointer ${
                isTillDateMode
                  ? "bg-white/10 text-white font-semibold shadow-xs"
                  : "text-[var(--admin-text-muted)] hover:text-white"
              }`}
            >
              <CalendarDays size={13} className={isTillDateMode ? "text-white" : "text-[var(--admin-text-muted)]"} />
              <span>All Time</span>
            </button>

            <button
              onClick={handleSelectDayWiseMode}
              className={`flex items-center gap-1.5 px-3.5 py-1.5 rounded-full text-xs transition-all cursor-pointer ${
                isDayWiseMode
                  ? "bg-white/10 text-white font-semibold shadow-xs"
                  : "text-[var(--admin-text-muted)] hover:text-white"
              }`}
            >
              <Calendar size={13} className={isDayWiseMode ? "text-white" : "text-[var(--admin-text-muted)]"} />
              <span>Day-Wise</span>
            </button>
          </div>

          {/* Date Range Picker Dropdown */}
          <AdminDateRangePicker
            currentFilter={dateFilter}
            onSelectFilter={(newFilter) => {
              setDateFilter(newFilter);
              triggerToast(`Date filter updated to ${newFilter.label}`, "info");
            }}
            orders={orders}
            compact
            customTriggerLabel={isTillDateMode ? "Presets & Range" : undefined}
          />

          {/* Toggle Sales Analytics Chart */}
          <button
            onClick={() => setShowSalesChart((prev) => !prev)}
            className={`flex items-center gap-1.5 px-3.5 py-1.5 rounded-full text-xs font-semibold border transition-all cursor-pointer ${
              showSalesChart
                ? "bg-white/15 border-white/20 text-white shadow-xs"
                : "bg-[var(--admin-surface)] hover:bg-[var(--admin-elevated)] border-white/10 text-[var(--admin-text-muted)] hover:text-white"
            }`}
            title={showSalesChart ? "Hide Sales Analytics" : "Show Sales Analytics"}
          >
            <BarChart3 size={13} className={showSalesChart ? "text-white" : "text-[var(--admin-text-muted)]"} />
            <span>{showSalesChart ? "Hide Analytics" : "Sales Analytics"}</span>
          </button>

          {/* Export CSV button */}
          <button
            onClick={handleExportCSV}
            className="flex items-center gap-1.5 px-3.5 py-1.5 rounded-full text-xs font-medium bg-[var(--admin-surface)] hover:bg-[var(--admin-elevated)] border border-white/10 text-white transition-all cursor-pointer"
            title="Export filtered orders to CSV"
          >
            <Download size={13} className="text-[var(--admin-text-muted)]" />
            <span>Export CSV</span>
          </button>
        </div>
      </div>

      {/* ── 4-CARD LUXURY KPI RIBBON ───────────────────────────────────────── */}
      <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-4">
        {/* Card 1: Revenue */}
        <div className="bg-[var(--admin-surface)] rounded-2xl p-5 border border-white/5 hover:border-white/10 transition-all">
          <div className="flex items-center justify-between mb-3">
            <span className="text-[11px] font-bold uppercase tracking-wider text-[var(--admin-text-muted)]">
              {dateFilter.type !== "all" ? "Filtered Revenue" : "Total GMV Revenue"}
            </span>
            <AdminIconBadge variant="kpi" icon={IndianRupee} />
          </div>
          <div className="text-2xl sm:text-3xl font-heading font-bold tabular-nums text-white">
            ₹{stats.scopeRevenue.toLocaleString("en-IN")}
          </div>
          <div className="flex items-center gap-1.5 mt-2 text-xs font-medium text-[#00F59B]">
            <TrendingUp size={13} />
            <span>
              {dateFilter.type !== "all"
                ? `Active in ${dateFilter.label.split("•")[0].trim()}`
                : `₹${stats.lifetimeRevenue.toLocaleString("en-IN")} lifetime gross merchandise value`}
            </span>
          </div>
        </div>

        {/* Card 2: Orders Count */}
        <div className="bg-[var(--admin-surface)] rounded-2xl p-5 border border-white/5 hover:border-white/10 transition-all">
          <div className="flex items-center justify-between mb-3">
            <span className="text-[11px] font-bold uppercase tracking-wider text-[var(--admin-text-muted)]">
              {dateFilter.type !== "all" ? "Orders in Scope" : "Total Orders Placed"}
            </span>
            <AdminIconBadge variant="kpi" icon={ShoppingCart} />
          </div>
          <div className="text-2xl sm:text-3xl font-heading font-bold tabular-nums text-white">
            {stats.scopeOrdersCount}
          </div>
          <div className="flex items-center gap-1.5 mt-2 text-xs font-medium text-[var(--admin-text-muted)]">
            <Package size={13} />
            <span>
              {dateFilter.type !== "all"
                ? `${filteredOrders.length} matching current filter`
                : `${stats.lifetimeOrders} total completed customer checkouts`}
            </span>
          </div>
        </div>

        {/* Card 3: Average Order Value (AOV) */}
        <div className="bg-[var(--admin-surface)] rounded-2xl p-5 border border-white/5 hover:border-white/10 transition-all">
          <div className="flex items-center justify-between mb-3">
            <span className="text-[11px] font-bold uppercase tracking-wider text-[var(--admin-text-muted)]">
              Average Order Value (AOV)
            </span>
            <AdminIconBadge variant="kpi" icon={Sparkles} />
          </div>
          <div className="text-2xl sm:text-3xl font-heading font-bold tabular-nums text-white">
            ₹{stats.scopeAOV.toLocaleString("en-IN")}
          </div>
          <div className="flex items-center gap-1.5 mt-2 text-xs font-medium text-[var(--admin-text-muted)]">
            <span>Avg spending per customer basket</span>
          </div>
        </div>

        {/* Card 4: Fulfillment / Delivery Rate */}
        <div className="bg-[var(--admin-surface)] rounded-2xl p-5 border border-white/5 hover:border-white/10 transition-all">
          <div className="flex items-center justify-between mb-3">
            <span className="text-[11px] font-bold uppercase tracking-wider text-[var(--admin-text-muted)]">
              Delivery Success Rate
            </span>
            <AdminIconBadge variant="kpi" icon={CheckCircle} />
          </div>
          <div className="text-2xl sm:text-3xl font-heading font-bold tabular-nums text-white">
            {stats.deliveryRate}%
          </div>
          <div className="flex items-center gap-1.5 mt-2 text-xs font-medium text-[#00F59B]">
            <span>{stats.statusCounts["Delivered"] || 0} Delivered • {(stats.statusCounts["Pending"] || 0) + (stats.statusCounts["Processing"] || 0)} In Pipeline</span>
          </div>
        </div>
      </div>

      {/* ── COLLAPSIBLE SALES ANALYTICS SECTION ───────────────────────────────── */}
      {showSalesChart && (
        <div className="grid grid-cols-1 lg:grid-cols-3 gap-6 animate-in fade-in duration-200">
          {/* Daily Sales Velocity (2 Columns) */}
          <div className="lg:col-span-2 bg-[var(--admin-surface)] rounded-2xl p-5 border border-white/5 space-y-3">
            <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-2">
              <div className="flex items-center gap-2">
                <BarChart3 size={15} className="text-[var(--admin-text-muted)]" />
                <h3 className="text-xs font-bold uppercase tracking-wider text-white font-heading">
                  Daily Sales Velocity
                </h3>
              </div>
              <div className="flex items-center gap-3 text-[11px] text-[var(--admin-text-muted)]">
                <span className="hidden sm:inline text-white/40">Click any bar to isolate day</span>
                <span className="hidden sm:inline text-white/20">•</span>
                <span>
                  {availableOrderDays.length} Recorded Days • Peak: ₹{maxDayRevenue.toLocaleString("en-IN")}
                </span>
              </div>
            </div>

            <DaySalesBars
              days={availableOrderDays}
              activeDay={dateFilter.type === "day" ? (dateFilter.singleDay || dateFilter.startDate) : null}
              maxDayRevenue={maxDayRevenue}
              onSelectDay={handleSelectDay}
            />
          </div>

          {/* Top Selling Products in Active Scope (1 Column) */}
          <div className="bg-[var(--admin-surface)] rounded-2xl border border-white/5 p-5 space-y-3">
            <div className="flex items-center justify-between">
              <h2 className="text-sm font-bold text-white flex items-center gap-2">
                <Package size={15} className="text-[var(--admin-text-muted)]" />
                Top Products
              </h2>
              <span className="text-[11px] text-[var(--admin-text-muted)]">By Revenue</span>
            </div>

            {stats.topProducts.length === 0 ? (
              <div className="py-8 text-center text-xs text-[var(--admin-text-muted)]">
                No product sales data in this date range.
              </div>
            ) : (
              <div className="space-y-2.5 pt-1">
                {stats.topProducts.map((p, i) => (
                  <div
                    key={`${p.name}-${i}`}
                    className="flex items-center justify-between text-xs p-2 rounded-xl bg-[var(--admin-surface-2)] border border-white/5 hover:border-white/10 transition-colors"
                  >
                    <div className="flex items-center gap-2.5 truncate max-w-[210px]">
                      <span
                        className={`w-5 h-5 rounded-full flex items-center justify-center text-[10px] font-extrabold flex-shrink-0 ${
                          i === 0
                            ? "bg-white/20 text-white"
                            : "bg-white/10 text-white"
                        }`}
                      >
                        #{i + 1}
                      </span>
                      <span className="font-semibold text-white truncate">{p.name}</span>
                    </div>
                    <div className="text-right flex-shrink-0 font-heading tabular-nums">
                      <span className="font-bold text-white">₹{p.revenue.toLocaleString("en-IN")}</span>
                      <span className="block text-[10px] text-[var(--admin-text-muted)] font-normal">({p.count} sold)</span>
                    </div>
                  </div>
                ))}
              </div>
            )}
          </div>
        </div>
      )}

      {/* ── ACTIVE DATE SCOPE INDICATOR ──────────────────────────────────────── */}
      {dateFilter.type !== "all" && (
        <div className="p-3.5 rounded-xl bg-white/[0.04] border border-white/10 flex flex-col sm:flex-row sm:items-center justify-between gap-3 text-xs text-white animate-in fade-in duration-150">
          <div className="flex items-center gap-2.5">
            <span className="w-1.5 h-1.5 rounded-full bg-[#00F59B] animate-pulse" />
            <span>
              <strong>Active Scope:</strong> {dateFilter.label} ({filteredOrders.length} {filteredOrders.length === 1 ? "order" : "orders"} • ₹{stats.scopeRevenue.toLocaleString("en-IN")})
            </span>
          </div>
          <div className="flex items-center gap-2">
            <button
              onClick={handleSelectTillDate}
              className="text-[11px] font-semibold text-white/80 hover:text-white underline cursor-pointer"
            >
              Reset to All Time View
            </button>
          </div>
        </div>
      )}

      {/* ── REAL-TIME ORDERS COMMAND CENTER ───────────────────────────────────── */}
      <div className="bg-[var(--admin-surface)] p-3.5 rounded-2xl border border-white/5 flex flex-col lg:flex-row lg:items-center justify-between gap-3">
        {/* Quick Status Pills on Left */}
        <div className="flex items-center gap-1.5 overflow-x-auto admin-scroll pb-1 lg:pb-0">
          {[
            { id: "all", label: "All Orders", count: dateFilteredOrders.length },
            { id: "Pending", label: "Pending", count: stats.statusCounts["Pending"] || 0 },
            { id: "Processing", label: "Processing", count: stats.statusCounts["Processing"] || 0 },
            { id: "Shipped", label: "Shipped", count: stats.statusCounts["Shipped"] || 0 },
            { id: "Delivered", label: "Delivered", count: stats.statusCounts["Delivered"] || 0 },
            { id: "Cancelled", label: "Cancelled", count: stats.statusCounts["Cancelled"] || 0 },
            { id: "Returned", label: "Returned", count: (stats.statusCounts["Returned"] || 0) + (stats.statusCounts["Return Requested"] || 0) },
          ].map((tab) => {
            const isActive = statusFilter === tab.id;
            return (
              <button
                key={tab.id}
                onClick={() => setStatusFilter(tab.id)}
                className={`flex items-center gap-1.5 px-3 py-1.5 rounded-full text-xs font-semibold whitespace-nowrap transition-all cursor-pointer ${
                  isActive
                    ? "bg-white/15 text-white border border-white/20 shadow-xs"
                    : "bg-[var(--admin-surface-2)] text-[var(--admin-text-muted)] hover:text-white hover:bg-white/[0.04] border border-white/5"
                }`}
              >
                <span>{tab.label}</span>
                <span
                  className={`px-1.5 py-0.2 rounded-full text-[10px] tabular-nums font-bold ${
                    isActive ? "bg-white/20 text-white" : "bg-white/5 text-[var(--admin-text-muted)]"
                  }`}
                >
                  {tab.count}
                </span>
              </button>
            );
          })}
        </div>

        {/* Search Input on Right */}
        <div className="flex items-center gap-2 w-full lg:w-auto">
          <div className="relative w-full lg:w-72 shrink-0">
            <Search size={14} className="absolute left-3.5 top-1/2 -translate-y-1/2 text-[var(--admin-text-muted)]" />
            <input
              type="text"
              placeholder="Search ID, customer, phone..."
              value={search}
              onChange={(e) => setSearch(e.target.value)}
              className="w-full pl-9 pr-8 py-2 rounded-xl border border-white/10 bg-[var(--admin-surface-2)] text-white placeholder:text-[var(--admin-text-muted)] text-xs focus:outline-none focus:border-white/30 transition-all"
            />
            {search && (
              <button
                onClick={() => setSearch("")}
                className="absolute right-3 top-1/2 -translate-y-1/2 text-[var(--admin-text-muted)] hover:text-white"
              >
                <X size={14} />
              </button>
            )}
          </div>

          {(search || statusFilter !== "all") && (
            <button
              onClick={() => {
                setSearch("");
                setStatusFilter("all");
              }}
              className="px-3 py-1.5 text-xs font-bold text-[#FF4B55] hover:bg-white/5 rounded-full transition-colors cursor-pointer whitespace-nowrap shrink-0"
            >
              Reset
            </button>
          )}
        </div>
      </div>

      {/* ── ORDERS MASTER TABLE ──────────────────────────────────────────────── */}
      <div className="bg-[var(--admin-surface)] rounded-2xl border border-white/5 overflow-hidden">
        <div className="overflow-x-auto admin-scroll">
          <table className="w-full min-w-[1040px] text-sm text-left border-collapse" role="table">
            <thead>
              <tr className="border-b border-white/10 bg-[var(--admin-surface-2)] text-[11px] uppercase tracking-wider text-[var(--admin-text-muted)] font-semibold">
                <th className="w-[160px] pl-6 pr-4 py-3.5 text-left">Order ID</th>
                <th className="w-[220px] px-4 py-3.5 text-left">Customer</th>
                <th className="min-w-[240px] px-4 py-3.5 text-left">Items</th>
                <th className="w-[120px] px-4 py-3.5 text-right">Total</th>
                <th className="w-[140px] px-4 py-3.5 text-left">Status</th>
                <th className="w-[140px] px-4 py-3.5 text-left">Date</th>
                <th className="w-[64px] pl-2 pr-6 py-3.5 text-right">
                  <span className="sr-only">Actions</span>
                </th>
              </tr>
            </thead>
            <tbody className="divide-y divide-white/5">
              {paginatedOrders.map((order) => {
                const customerName = order.shippingAddress?.name || "Customer";
                const itemsList = order.items || [];
                const firstItem = itemsList[0];
                const { date: displayDate, time: displayTime } = formatOrderRowDate(order.date);

                return (
                  <tr
                    key={order.id}
                    onClick={() => setSelectedOrder(order)}
                    className="hover:bg-white/[0.03] transition-colors cursor-pointer group"
                  >
                    {/* Order ID: Anchored to Left */}
                    <td className="w-[160px] pl-6 pr-4 py-3 text-left font-mono text-xs">
                      <span className="font-bold text-white group-hover:text-white/80 transition-colors truncate block">
                        {order.id}
                      </span>
                    </td>

                    {/* Customer */}
                    <td className="w-[220px] px-4 py-3 text-left">
                      <div className="flex items-center gap-2.5 min-w-0">
                        <div className="w-8 h-8 rounded-full bg-[var(--admin-surface-2)] border border-white/10 text-white font-bold text-xs flex items-center justify-center shrink-0">
                          {customerName.slice(0, 2).toUpperCase()}
                        </div>
                        <div className="min-w-0">
                          <div className="font-semibold text-xs text-white truncate">{customerName}</div>
                          {order.shippingAddress?.phone ? (
                            <div className="text-[11px] text-[var(--admin-text-muted)] truncate font-mono">
                              {order.shippingAddress.phone}
                            </div>
                          ) : (
                            <div className="text-[11px] text-white/30 truncate">No phone</div>
                          )}
                        </div>
                      </div>
                    </td>

                    {/* Items */}
                    <td className="min-w-[240px] px-4 py-3 text-left">
                      <div className="flex items-center gap-2.5 min-w-0">
                        {firstItem?.imageUrl && (
                          <div className="w-9 h-9 rounded-lg overflow-hidden bg-[var(--admin-surface-2)] border border-white/10 shrink-0 relative">
                            {/* eslint-disable-next-line @next/next/no-img-element */}
                            <img
                              src={firstItem.imageUrl}
                              alt={firstItem.productName}
                              className="w-full h-full object-cover"
                            />
                          </div>
                        )}
                        <div className="min-w-0 truncate">
                          <div className="font-semibold text-xs text-white truncate">
                            {firstItem ? firstItem.productName : order.itemNames?.[0] || "Luxury Product"}
                          </div>
                          <div className="text-[11px] text-[var(--admin-text-muted)] truncate">
                            {firstItem ? (
                              <span>
                                {firstItem.selectedSize} · {firstItem.colorName} (×{firstItem.quantity})
                              </span>
                            ) : (
                              <span>1 item</span>
                            )}
                            {itemsList.length > 1 && (
                              <span className="ml-1.5 text-white/70 font-semibold bg-white/5 px-1.5 py-0.5 rounded text-[10px]">
                                +{itemsList.length - 1} more
                              </span>
                            )}
                          </div>
                        </div>
                      </div>
                    </td>

                    {/* Total: Right-aligned financial number */}
                    <td className="w-[120px] px-4 py-3 text-right">
                      <div className="font-heading font-bold tabular-nums text-sm text-white">
                        ₹{(order.total || 0).toLocaleString("en-IN")}
                      </div>
                      <span className="inline-block px-1.5 py-0.5 rounded text-[10px] font-mono uppercase tracking-wider text-[var(--admin-text-muted)] bg-white/5 mt-0.5">
                        {order.paymentMethod || "CARD"}
                      </span>
                    </td>

                    {/* Status: Left-aligned with 100% straight vertical laser line */}
                    <td className="w-[140px] px-4 py-3 text-left">
                      <div className="flex items-center gap-2 min-w-0">
                        <span className={`w-2 h-2 rounded-full shrink-0 ${getStatusDot(normalizeOrderStatus(order.status))}`} />
                        <span className="text-xs font-medium text-white truncate">
                          {order.status}
                        </span>
                      </div>
                    </td>

                    {/* Date: 2-line Day + Time format without truncation */}
                    <td className="w-[140px] px-4 py-3 text-left whitespace-nowrap">
                      <div className="text-xs font-medium text-white truncate">
                        {displayDate}
                      </div>
                      {displayTime && (
                        <div className="text-[11px] text-[var(--admin-text-muted)] font-mono truncate">
                          {displayTime}
                        </div>
                      )}
                    </td>

                    {/* Actions: Right-aligned clean portaled menu button */}
                    <td className="w-[64px] pl-2 pr-6 py-3 text-right" onClick={(e) => e.stopPropagation()}>
                      <div className="flex items-center justify-end">
                        <OrderRowMenu
                          order={order}
                          onViewDetails={() => setSelectedOrder(order)}
                          onCopyId={(e) => handleCopyId(order.id, e)}
                          onPrintSlip={(e) => handlePrintSlip(order, e)}
                          onDelete={() => setOrderToDelete(order.id)}
                        />
                      </div>
                    </td>
                  </tr>
                );
              })}
            </tbody>
          </table>
        </div>

        {/* Empty State */}
        {filteredOrders.length === 0 && (
          <div className="py-16 text-center text-[var(--admin-text-muted)] space-y-2">
            <Package size={36} className="mx-auto text-[var(--admin-text-muted)] mb-2" />
            <h3 className="text-sm font-bold text-white font-heading">No Orders Found</h3>
            <p className="text-xs text-[var(--admin-text-muted)] max-w-sm mx-auto">
              No orders match your active date filter, search query, or status selection.
            </p>
            <button
              onClick={() => {
                setSearch("");
                setStatusFilter("all");
                handleSelectTillDate();
              }}
              className="mt-3 px-4 py-2 rounded-full bg-[var(--admin-primary)] text-white text-xs font-bold hover:bg-[var(--admin-primary-hover)] transition-colors cursor-pointer"
            >
              Reset to Lifetime Scope
            </button>
          </div>
        )}

        {/* Pagination Footer */}
        {filteredOrders.length > 0 && (
          <div className="flex flex-col sm:flex-row items-center justify-between gap-3 px-6 py-3.5 border-t border-white/5 bg-[var(--admin-surface-2)] text-xs text-[var(--admin-text-muted)]">
            <div>
              Showing <span className="font-bold text-white">{(currentPage - 1) * PAGE_SIZE + 1}</span> to{" "}
              <span className="font-bold text-white">
                {Math.min(currentPage * PAGE_SIZE, filteredOrders.length)}
              </span>{" "}
              of <span className="font-bold text-white">{filteredOrders.length}</span> orders
            </div>

            <div className="flex items-center gap-1.5">
              <button
                onClick={() => setCurrentPage((p) => Math.max(1, p - 1))}
                disabled={currentPage === 1}
                className="px-3.5 py-1.5 rounded-full border border-white/10 bg-[var(--admin-surface)] hover:bg-[var(--admin-elevated)] text-white disabled:opacity-40 disabled:pointer-events-none text-xs font-semibold cursor-pointer"
              >
                Previous
              </button>

              <span className="px-2 font-heading tabular-nums text-[var(--admin-text-muted)]">
                Page {currentPage} of {totalPages}
              </span>

              <button
                onClick={() => setCurrentPage((p) => Math.min(totalPages, p + 1))}
                disabled={currentPage === totalPages}
                className="px-3.5 py-1.5 rounded-full border border-white/10 bg-[var(--admin-surface)] hover:bg-[var(--admin-elevated)] text-white disabled:opacity-40 disabled:pointer-events-none text-xs font-semibold cursor-pointer"
              >
                Next
              </button>
            </div>
          </div>
        )}
      </div>

      {/* ── DEEP INSPECTION & ORDER DETAILS MODAL ────────────────────────────── */}
      {selectedOrder && (
        <div
          className="fixed inset-0 z-[10000] bg-black/80 flex items-center justify-center p-4 backdrop-blur-sm animate-in fade-in duration-200"
          onClick={() => setSelectedOrder(null)}
        >
          <div
            className="bg-[var(--admin-surface)] rounded-2xl max-w-2xl w-full max-h-[90vh] overflow-y-auto admin-scroll p-6 space-y-5 border border-white/10 shadow-2xl"
            data-lenis-prevent
            onClick={(e) => e.stopPropagation()}
          >
            {/* Modal Header */}
            <div className="flex items-center justify-between border-b border-white/5 pb-4">
              <div className="space-y-1">
                <span className="inline-block text-[10px] font-bold uppercase tracking-wider bg-white/[0.06] text-white/80 border border-white/10 px-2.5 py-0.5 rounded-full">
                  Order Inspection
                </span>
                <h3 className="text-xl font-bold font-mono text-white tracking-tight">
                  {selectedOrder.id}
                </h3>
              </div>
              <div className="flex items-center gap-2">
                <button
                  onClick={(e) => handlePrintSlip(selectedOrder, e)}
                  className="flex items-center gap-1.5 px-3 py-1.5 rounded-xl border border-white/10 hover:bg-[var(--admin-elevated)] bg-[var(--admin-surface-2)] text-xs font-semibold text-white transition-colors cursor-pointer"
                >
                  <Printer size={13} className="text-[var(--admin-text-muted)]" />
                  <span>Print Receipt</span>
                </button>
                <button
                  onClick={() => setSelectedOrder(null)}
                  className="w-8 h-8 rounded-xl flex items-center justify-center border border-white/10 bg-[var(--admin-surface-2)] hover:bg-[var(--admin-elevated)] text-[var(--admin-text-muted)] hover:text-white transition-colors cursor-pointer"
                  aria-label="Close details"
                >
                  <X size={16} />
                </button>
              </div>
            </div>

            {/* Customer & Shipping Details */}
            <div className="grid grid-cols-1 sm:grid-cols-2 gap-4 text-xs">
              {/* Customer Info Card */}
              <div className="bg-[var(--admin-surface-2)] p-4 rounded-xl border border-white/5 space-y-3 flex flex-col justify-between">
                <div className="flex items-center gap-2 text-[11px] font-bold uppercase tracking-wider text-[var(--admin-text-muted)]">
                  <div className="w-5 h-5 rounded-md bg-white/5 border border-white/10 flex items-center justify-center text-white/70">
                    <UserIcon size={11} />
                  </div>
                  <span>Customer Information</span>
                </div>
                <div className="space-y-1.5">
                  <div className="font-semibold text-sm text-white">
                    {selectedOrder.shippingAddress?.name || "Customer"}
                  </div>
                  <div className="text-[var(--admin-text-muted)] flex items-center gap-2 font-mono text-xs">
                    <Phone size={12} className="text-white/40 shrink-0" />
                    <span>{selectedOrder.shippingAddress?.phone || "No phone provided"}</span>
                  </div>
                  <div className="text-[var(--admin-text-muted)] flex items-center gap-2 text-xs">
                    <Clock size={12} className="text-white/40 shrink-0" />
                    <span>Placed: {selectedOrder.date}</span>
                  </div>
                </div>
              </div>

              {/* Delivery Destination Card */}
              <div className="bg-[var(--admin-surface-2)] p-4 rounded-xl border border-white/5 space-y-3 flex flex-col justify-between">
                <div className="flex items-center gap-2 text-[11px] font-bold uppercase tracking-wider text-[var(--admin-text-muted)]">
                  <div className="w-5 h-5 rounded-md bg-white/5 border border-white/10 flex items-center justify-center text-white/70">
                    <MapPin size={11} />
                  </div>
                  <span>Delivery Destination</span>
                </div>
                <div className="space-y-1.5">
                  <div className="text-white leading-relaxed text-xs">
                    {(() => {
                      const addr = selectedOrder.shippingAddress?.address || "Standard delivery address";
                      const name = selectedOrder.shippingAddress?.name;
                      if (name && addr.toLowerCase().startsWith(name.toLowerCase())) {
                        return addr.slice(name.length).replace(/^[\s,]+/, "");
                      }
                      return addr;
                    })()}
                  </div>
                  {selectedOrder.shippingAddress?.pincode && (
                    <div className="text-[var(--admin-text-muted)] font-mono text-xs">
                      PIN: {selectedOrder.shippingAddress.pincode}
                    </div>
                  )}
                  <div className="text-[var(--admin-text-muted)] flex items-center gap-2 text-xs pt-0.5">
                    <CreditCard size={12} className="text-white/40 shrink-0" />
                    <span>Payment:</span>
                    <span className="uppercase font-mono font-bold text-[10px] px-1.5 py-0.5 rounded bg-white/10 border border-white/10 text-white">
                      {selectedOrder.paymentMethod || "CARD"}
                    </span>
                  </div>
                </div>
              </div>
            </div>

            {/* Status Quick Updater (Current Dispatch State) */}
            <div className="p-4 bg-[var(--admin-surface-2)] border border-white/5 rounded-xl flex flex-col sm:flex-row sm:items-center justify-between gap-3">
              <div className="flex items-center gap-3">
                <span className="text-xs text-[var(--admin-text-muted)] font-medium">Current State:</span>
                <div className="inline-flex items-center gap-2 px-3 py-1 rounded-full bg-white/5 border border-white/10">
                  <span className={`w-2 h-2 rounded-full shrink-0 ${getStatusDot(normalizeOrderStatus(selectedOrder.status))}`} />
                  <span className="text-xs font-semibold text-white">
                    {selectedOrder.status}
                  </span>
                </div>
              </div>
              <div className="flex items-center gap-2.5">
                <span className="text-xs text-[var(--admin-text-muted)] font-medium">Update To:</span>
                <AdminSelect
                  value={selectedOrder.status}
                  onValueChange={(newStatus) =>
                    handleStatusChange(selectedOrder.id, newStatus as OrderStatus)
                  }
                  options={ORDER_STATUS_OPTIONS}
                  className="w-48"
                  aria-label="Update order status"
                />
              </div>
            </div>

            {/* Items Breakdown */}
            <div className="space-y-3">
              <div className="flex items-center justify-between text-xs">
                <h4 className="font-bold text-white uppercase tracking-wider text-[11px]">
                  Items Ordered ({selectedOrder.items?.length || 1})
                </h4>
                <span className="font-heading tabular-nums text-[var(--admin-text-muted)]">
                  Subtotal: ₹{(selectedOrder.subtotal || selectedOrder.total).toLocaleString("en-IN")}
                </span>
              </div>
              <div className="space-y-2">
                {(selectedOrder.items || []).map((item, i) => (
                  <div
                    key={i}
                    className="flex items-center justify-between p-3 rounded-xl border border-white/5 bg-[var(--admin-surface-2)]"
                  >
                    <div className="flex items-center gap-3 min-w-0">
                      {item.imageUrl && (
                        <div className="w-12 h-12 rounded-lg overflow-hidden bg-[var(--admin-surface)] shrink-0 relative border border-white/10">
                          {/* eslint-disable-next-line @next/next/no-img-element */}
                          <img
                            src={item.imageUrl}
                            alt={item.productName}
                            className="w-full h-full object-cover"
                          />
                        </div>
                      )}
                      <div className="min-w-0">
                        <div className="font-semibold text-xs text-white truncate">
                          {item.productName}
                        </div>
                        <div className="text-[11px] text-[var(--admin-text-muted)] mt-0.5 truncate">
                          Size: <span className="text-white font-medium">{item.selectedSize}</span> · Color:{" "}
                          <span className="text-white font-medium">{item.colorName}</span> · Qty:{" "}
                          <span className="text-white font-medium">{item.quantity}</span>
                        </div>
                      </div>
                    </div>
                    <div className="font-heading font-bold tabular-nums text-xs text-white shrink-0 pl-3">
                      ₹{(item.totalPrice || item.unitPrice * item.quantity).toLocaleString("en-IN")}
                    </div>
                  </div>
                ))}
              </div>
            </div>

            {/* Financial Summary */}
            <div className="border-t border-white/5 pt-3.5 space-y-2 text-xs font-heading tabular-nums">
              <div className="flex justify-between text-[var(--admin-text-muted)]">
                <span>Subtotal</span>
                <span className="text-white font-semibold">₹{(selectedOrder.subtotal || selectedOrder.total).toLocaleString("en-IN")}</span>
              </div>
              {selectedOrder.couponDiscount > 0 && (
                <div className="flex justify-between text-emerald-400 font-medium">
                  <span>Coupon Discount ({selectedOrder.couponCode})</span>
                  <span className="font-mono font-semibold">-₹{selectedOrder.couponDiscount.toLocaleString("en-IN")}</span>
                </div>
              )}
              {selectedOrder.shippingCost > 0 && (
                <div className="flex justify-between text-[var(--admin-text-muted)]">
                  <span>Shipping Cost</span>
                  <span className="text-white font-semibold">₹{selectedOrder.shippingCost.toLocaleString("en-IN")}</span>
                </div>
              )}
              <div className="flex justify-between items-center text-sm font-bold text-white pt-2.5 border-t border-white/10">
                <span>Total Amount Paid</span>
                <span className="text-base font-heading font-bold tabular-nums text-white">
                  ₹{selectedOrder.total.toLocaleString("en-IN")}
                </span>
              </div>
            </div>

            {/* Dispatch & Delivery Progress (Canonical 4-Stage Stepper) */}
            <div className="border-t border-white/5 pt-4 space-y-4">
              <div className="flex items-center justify-between">
                <h4 className="font-bold text-[11px] uppercase tracking-wider text-[var(--admin-text-muted)]">
                  Dispatch &amp; Delivery Progress
                </h4>
                <span className="text-[10px] font-mono font-semibold text-white/80 bg-white/5 border border-white/10 px-2.5 py-0.5 rounded-full">
                  {selectedOrder.status === "Cancelled"
                    ? "Order Cancelled"
                    : selectedOrder.status === "Returned" || selectedOrder.status === "Return Requested"
                    ? `Return ${selectedOrder.status}`
                    : `Stage ${Math.min(getLifecycleStageIndex(selectedOrder.status) + 1, 4)} of 4 · ${selectedOrder.status}`}
                </span>
              </div>

              {/* Cancelled State Stepper */}
              {selectedOrder.status === "Cancelled" ? (
                <div className="space-y-0 pt-1">
                  {/* Step 1: Placed & Confirmed */}
                  <div className="flex gap-3.5">
                    <div className="flex flex-col items-center">
                      <div className="w-6 h-6 rounded-full bg-[#00F59B] text-black flex items-center justify-center shrink-0 font-bold shadow-xs">
                        <Check size={11} strokeWidth={3} className="text-black" />
                      </div>
                      <div className="w-0.5 my-1.5 grow min-h-[28px] bg-[#FF4B55]/50" />
                    </div>
                    <div className="pb-4">
                      <div className="flex items-center gap-2">
                        <span className="text-xs font-bold text-white">Order Confirmed</span>
                        <span className="text-[11px] font-mono text-[var(--admin-text-muted)]">{selectedOrder.date}</span>
                      </div>
                      <p className="text-[11px] text-[var(--admin-text-muted)] mt-0.5">Order was placed and payment authorized.</p>
                    </div>
                  </div>

                  {/* Step 2: Cancelled */}
                  <div className="flex gap-3.5">
                    <div className="flex flex-col items-center">
                      <div className="w-6 h-6 rounded-full bg-[#FF4B55] text-white flex items-center justify-center shrink-0 font-bold shadow-[0_0_12px_rgba(255,75,85,0.4)] ring-4 ring-[#FF4B55]/20">
                        <X size={11} strokeWidth={3} className="text-white" />
                      </div>
                    </div>
                    <div className="pb-1">
                      <div className="flex items-center gap-2">
                        <span className="text-xs font-bold text-[#FF4B55]">Cancelled</span>
                        <span className="px-1.5 py-0.2 rounded-full text-[9px] font-extrabold uppercase tracking-wider bg-[#FF4B55]/15 text-[#FF4B55] border border-[#FF4B55]/30">
                          Terminated
                        </span>
                        <span className="text-[11px] font-mono text-white/90">
                          {selectedOrder.timeline?.slice().reverse().find(t => t.status === "Cancelled")?.timestamp || selectedOrder.date}
                        </span>
                      </div>
                      <p className="text-[11px] text-[var(--admin-text-muted)] mt-0.5">
                        Order was cancelled. All reserved items were returned to inventory.
                      </p>
                    </div>
                  </div>
                </div>
              ) : selectedOrder.status === "Return Requested" || selectedOrder.status === "Returned" ? (
                /* Return Lifecycle */
                <div className="space-y-0 pt-1">
                  <div className="flex gap-3.5">
                    <div className="flex flex-col items-center">
                      <div className="w-6 h-6 rounded-full bg-[#00F59B] text-black flex items-center justify-center shrink-0 font-bold shadow-xs">
                        <Check size={11} strokeWidth={3} className="text-black" />
                      </div>
                      <div className="w-0.5 my-1.5 grow min-h-[28px] bg-white/20" />
                    </div>
                    <div className="pb-4">
                      <div className="flex items-center gap-2">
                        <span className="text-xs font-bold text-white">Delivered</span>
                        <span className="text-[11px] font-mono text-[var(--admin-text-muted)]">{selectedOrder.date}</span>
                      </div>
                      <p className="text-[11px] text-[var(--admin-text-muted)] mt-0.5">Package was delivered to customer.</p>
                    </div>
                  </div>

                  <div className="flex gap-3.5">
                    <div className="flex flex-col items-center">
                      <div className="w-6 h-6 rounded-full bg-white text-black flex items-center justify-center shrink-0 font-bold shadow-[0_0_12px_rgba(255,255,255,0.4)] ring-4 ring-white/15">
                        <RotateCcw size={11} strokeWidth={2.5} className="text-black" />
                      </div>
                    </div>
                    <div className="pb-1">
                      <div className="flex items-center gap-2">
                        <span className="text-xs font-bold text-white">{selectedOrder.status}</span>
                        <span className="px-1.5 py-0.2 rounded-full text-[9px] font-extrabold uppercase tracking-wider bg-white/10 text-white border border-white/20">
                          Reverse Logistics
                        </span>
                        <span className="text-[11px] font-mono text-white/90">
                          {selectedOrder.returnRequest?.requestedAt || selectedOrder.date}
                        </span>
                      </div>
                      <p className="text-[11px] text-[var(--admin-text-muted)] mt-0.5">
                        {selectedOrder.returnRequest?.reason || "Return initiated by customer."}
                      </p>
                    </div>
                  </div>
                </div>
              ) : (
                /* Standard 4-Stage Forward Delivery Stepper */
                <div className="space-y-0 pt-1">
                  {CANONICAL_ORDER_STAGES.map((stage, idx) => {
                    const activeStageIdx = getLifecycleStageIndex(selectedOrder.status);
                    const isCompleted = idx < activeStageIdx;
                    const isCurrent = idx === activeStageIdx;
                    const isUpcoming = idx > activeStageIdx;
                    const isLast = idx === CANONICAL_ORDER_STAGES.length - 1;

                    // Match timestamp from audit timeline if available
                    const matchingEvent = selectedOrder.timeline?.slice().reverse().find((t) => {
                      if (stage.key === "Packed") return t.status === "Packed" || t.status === "Processing";
                      if (stage.key === "Shipped") return t.status === "Shipped" || t.status === "Out for Delivery";
                      return t.status === stage.key;
                    });

                    const displayTimestamp = isCompleted || isCurrent
                      ? matchingEvent?.timestamp || selectedOrder.date
                      : "Estimated";

                    const displayDesc = matchingEvent?.description || stage.defaultDesc;

                    return (
                      <div key={stage.key} className="flex gap-3.5">
                        {/* Node & Connector */}
                        <div className="flex flex-col items-center">
                          <div
                            className={`w-6 h-6 rounded-full flex items-center justify-center shrink-0 transition-all ${
                              isCompleted
                                ? "bg-[#00F59B] text-black shadow-xs font-bold"
                                : isCurrent
                                ? "bg-white text-black shadow-[0_0_12px_rgba(255,255,255,0.4)] ring-4 ring-white/15 font-bold"
                                : "bg-[var(--admin-surface)] border border-white/20 text-white/30"
                            }`}
                          >
                            {isCompleted ? (
                              <Check size={11} strokeWidth={3} className="text-black" />
                            ) : (
                              getTimelineMilestoneIcon(stage.key)
                            )}
                          </div>

                          {!isLast && (
                            <div
                              className={`w-0.5 my-1.5 grow min-h-[28px] ${
                                isCompleted
                                  ? "bg-[#00F59B]"
                                  : "border-l border-dashed border-white/15"
                              }`}
                            />
                          )}
                        </div>

                        {/* Content */}
                        <div className={`pb-4 ${isLast ? "pb-1" : ""}`}>
                          <div className="flex items-center gap-2">
                            <span
                              className={`text-xs ${
                                isCompleted || isCurrent
                                  ? "font-bold text-white"
                                  : "font-medium text-[var(--admin-text-muted)]"
                              }`}
                            >
                              {stage.label}
                            </span>

                            {isCurrent && (
                              <span className="px-1.5 py-0.2 rounded-full text-[9px] font-extrabold uppercase tracking-wider bg-white/10 text-white border border-white/20">
                                Current
                              </span>
                            )}

                            <span
                              className={`text-[11px] font-mono ${
                                isCurrent
                                  ? "text-white/90"
                                  : isUpcoming
                                  ? "text-white/40 italic"
                                  : "text-[var(--admin-text-muted)]"
                              }`}
                            >
                              {displayTimestamp}
                            </span>
                          </div>

                          <p
                            className={`text-[11px] mt-0.5 leading-relaxed ${
                              isCompleted || isCurrent
                                ? "text-[var(--admin-text-muted)]"
                                : "text-[var(--admin-text-muted)]/60"
                            }`}
                          >
                            {displayDesc}
                          </p>
                        </div>
                      </div>
                    );
                  })}
                </div>
              )}

              {/* Admin Audit History Trail */}
              {selectedOrder.timeline && selectedOrder.timeline.length > 1 && (
                <div className="pt-2">
                  <details className="group rounded-xl border border-white/5 bg-[var(--admin-surface-2)]/60 overflow-hidden">
                    <summary className="flex items-center justify-between p-3 cursor-pointer text-xs font-semibold text-[var(--admin-text-muted)] hover:text-white transition-colors select-none">
                      <div className="flex items-center gap-2">
                        <History size={13} className="text-white/60" />
                        <span>Admin Audit Log ({selectedOrder.timeline.length} status events recorded)</span>
                      </div>
                      <ChevronDown size={14} className="group-open:rotate-180 transition-transform text-white/40" />
                    </summary>
                    <div className="px-3 pb-3 space-y-1.5 border-t border-white/5 pt-2 text-[11px] max-h-48 overflow-y-auto admin-scroll">
                      {selectedOrder.timeline.slice().reverse().map((event, i) => (
                        <div key={i} className="flex items-center justify-between py-1.5 border-b border-white/5 last:border-0">
                          <div className="flex items-center gap-2 min-w-0">
                            <span className={`w-1.5 h-1.5 rounded-full shrink-0 ${getStatusDot(normalizeOrderStatus(event.status))}`} />
                            <span className="font-semibold text-white shrink-0">{event.status}</span>
                            <span className="text-[var(--admin-text-muted)] truncate">{event.description}</span>
                          </div>
                          <span className="text-[10px] font-mono text-[var(--admin-text-muted)] shrink-0 pl-3">
                            {event.timestamp}
                          </span>
                        </div>
                      ))}
                    </div>
                  </details>
                </div>
              )}
            </div>
          </div>
        </div>
      )}

      {/* ── DARK ADMIN CONFIRM DELETION DIALOG ── */}
      <AdminPortal>
        <AnimatePresence>
          {orderToDelete && (
            <div className="fixed inset-0 z-[10000] flex items-center justify-center p-4">
              <motion.div
                initial={{ opacity: 0 }}
                animate={{ opacity: 1 }}
                exit={{ opacity: 0 }}
                onClick={() => setOrderToDelete(null)}
                className="fixed inset-0 bg-black/60 backdrop-blur-sm"
              />
              <motion.div
                initial={{ opacity: 0, scale: 0.96, y: 8 }}
                animate={{ opacity: 1, scale: 1, y: 0 }}
                exit={{ opacity: 0, scale: 0.96, y: 8 }}
                transition={{ duration: 0.15 }}
                className="relative w-full max-w-sm bg-[var(--admin-surface)] border border-white/10 rounded-[20px] p-5 z-10"
                role="dialog"
                aria-modal="true"
                aria-labelledby="delete-order-dialog-title"
              >
                <div className="w-10 h-10 rounded-full bg-[var(--admin-danger)]/15 border border-[var(--admin-danger)]/30 text-[var(--admin-danger)] flex items-center justify-center mb-3">
                  <Trash2 size={18} />
                </div>
                <h3 id="delete-order-dialog-title" className="text-base font-bold text-white mb-1.5">
                  Delete Order?
                </h3>
                <p className="text-xs text-[var(--admin-text-muted)] mb-5 leading-relaxed">
                  Are you sure you want to delete order <span className="text-white font-mono font-semibold">{orderToDelete}</span>? This cannot be undone.
                </p>
                <div className="flex items-center justify-end gap-2.5">
                  <button
                    type="button"
                    onClick={() => setOrderToDelete(null)}
                    className="px-3.5 py-2 rounded-[12px] bg-white/5 hover:bg-white/10 text-xs font-semibold text-white transition-colors cursor-pointer"
                  >
                    Cancel
                  </button>
                  <button
                    type="button"
                    onClick={handleConfirmDelete}
                    className="px-3.5 py-2 rounded-[12px] bg-[var(--admin-danger)] hover:bg-[var(--admin-danger)]/80 text-xs font-semibold text-white transition-colors cursor-pointer"
                  >
                    Delete Order
                  </button>
                </div>
              </motion.div>
            </div>
          )}
        </AnimatePresence>
      </AdminPortal>
    </div>
  );
}
