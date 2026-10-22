"use client";

import React, { useState, useMemo, useEffect, useRef } from "react";
import Image from "next/image";
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
} from "lucide-react";

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
    badgeBg: "bg-[#F59E0B]/15",
    badgeBorder: "border-[#F59E0B]/30",
    renderIcon: () => (
      <div className="w-5 h-5 rounded-full bg-[#F59E0B] flex items-center justify-center text-black">
        <Check size={11} strokeWidth={3.2} />
      </div>
    ),
  },
  Packed: {
    code: "02",
    sublabel: "READY TO SHIP",
    accentColor: "#F59E0B",
    badgeBg: "bg-[#F59E0B]/15",
    badgeBorder: "border-[#F59E0B]/30",
    renderIcon: () => <Package size={17} className="text-[#F59E0B]" strokeWidth={1.75} />,
  },
  Shipped: {
    code: "03",
    sublabel: "IN TRANSIT",
    accentColor: "#38BDF8",
    badgeBg: "bg-[#38BDF8]/15",
    badgeBorder: "border-[#38BDF8]/30",
    renderIcon: () => <Truck size={17} className="text-[#38BDF8] -scale-x-100" strokeWidth={1.75} />,
  },
  "Out for Delivery": {
    code: "04",
    sublabel: "ON THE WAY",
    accentColor: "#38BDF8",
    badgeBg: "bg-[#38BDF8]/15",
    badgeBorder: "border-[#38BDF8]/30",
    renderIcon: () => <Clock size={17} className="text-[#38BDF8]" strokeWidth={1.75} />,
  },
  Delivered: {
    code: "05",
    sublabel: "SUCCESSFULLY",
    accentColor: "#00F59B",
    badgeBg: "bg-[#00F59B]/15",
    badgeBorder: "border-[#00F59B]/30",
    renderIcon: () => <PackageCheck size={17} className="text-[#00F59B]" strokeWidth={1.75} />,
  },
  Cancelled: {
    code: "06",
    sublabel: "BY CUSTOMER",
    accentColor: "#FF4B55",
    badgeBg: "bg-[#FF4B55]/15",
    badgeBorder: "border-[#FF4B55]/30",
    renderIcon: () => <XCircle size={17} className="text-[#FF4B55]" strokeWidth={1.75} />,
  },
  "Return Requested": {
    code: "07",
    sublabel: "AWAITING REVIEW",
    accentColor: "#94A3B8",
    badgeBg: "bg-white/10",
    badgeBorder: "border-white/20",
    renderIcon: () => <RotateCcw size={16} className="text-[var(--admin-text-muted)]" strokeWidth={1.75} />,
  },
  Processing: {
    code: "00",
    sublabel: "IN PROGRESS",
    accentColor: "#F59E0B",
    badgeBg: "bg-[#F59E0B]/15",
    badgeBorder: "border-[#F59E0B]/30",
    renderIcon: () => <Clock size={17} className="text-[#F59E0B]" strokeWidth={1.75} />,
  },
  Returned: {
    code: "08",
    sublabel: "COMPLETED",
    accentColor: "#94A3B8",
    badgeBg: "bg-white/10",
    badgeBorder: "border-white/20",
    renderIcon: () => <Box size={17} className="text-[var(--admin-text-muted)]" strokeWidth={1.75} />,
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

export function normalizeOrderStatus(status: string | undefined): OrderStatus {
  if (!status) return "Confirmed";
  if (status === "Processing") return "Packed";
  if (ALL_STATUSES.includes(status as OrderStatus)) {
    return status as OrderStatus;
  }
  return "Confirmed";
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
      <div className="h-32 p-3 bg-[var(--admin-surface-2)] rounded-[14px] border border-white/5 flex items-center justify-center text-xs text-[var(--admin-text-muted)]">
        No sales activity recorded
      </div>
    );
  }

  const safeMax =
    !maxDayRevenue || isNaN(maxDayRevenue) || maxDayRevenue <= 0
      ? 1
      : maxDayRevenue;

  return (
    <div
      ref={containerRef}
      className={`h-32 p-3 bg-[var(--admin-surface-2)] rounded-[14px] border border-white/5 ${
        isScrollable
          ? "flex items-stretch gap-1.5 overflow-x-auto admin-scroll overscroll-x-contain"
          : "grid gap-1.5"
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
        const rawPercent = Math.round((rev / safeMax) * 100);
        const heightPercent =
          !maxDayRevenue || isNaN(maxDayRevenue) || maxDayRevenue <= 0
            ? 16
            : Math.max(16, Math.min(100, isNaN(rawPercent) ? 16 : rawPercent));

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
            className={`flex flex-col items-center h-full cursor-pointer group select-none outline-none focus-visible:ring-1 focus-visible:ring-[var(--admin-primary)] rounded-lg ${
              isScrollable ? "shrink-0 min-w-[28px] flex-1" : "min-w-0 flex-1 w-full"
            }`}
          >
            {/* Top: Fixed-height price slot (shrink-0) */}
            <div className="h-3.5 shrink-0 w-full flex items-center justify-center mb-1 pointer-events-none">
              <span
                className={`text-[9px] font-heading font-bold tabular-nums leading-none truncate transition-opacity duration-150 ${
                  isActive
                    ? "opacity-100 text-[var(--admin-primary)] font-extrabold"
                    : "opacity-0 group-hover:opacity-100 text-[var(--admin-text-muted)] group-hover:text-white"
                }`}
              >
                ₹{rev.toLocaleString("en-IN")}
              </span>
            </div>

            {/* Middle: Bar track (flex-1, min-h-0, flex items-end) */}
            <div className="flex-1 min-h-0 w-full flex items-end justify-center py-0.5">
              <div
                style={{ height: `${heightPercent}%` }}
                className={`w-full rounded-md transition-colors duration-150 ${
                  isActive
                    ? "bg-[var(--admin-primary)]"
                    : "bg-white/10 group-hover:bg-white/20"
                }`}
              />
            </div>

            {/* Bottom: Fixed-height date slot (shrink-0) */}
            <div className="h-3.5 shrink-0 w-full flex items-center justify-center mt-1 pointer-events-none">
              <span
                className={`text-[9px] leading-none whitespace-nowrap text-center transition-colors duration-150 ${
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
  );
}

export default function AdminOrdersPage() {
  const { orders, updateOrderStatus, deleteOrder } = useUser();

  // Search & Filter state
  const [search, setSearch] = useState("");
  const [statusFilter, setStatusFilter] = useState<string>("all");
  const [selectedOrder, setSelectedOrder] = useState<OrderRecord | null>(null);

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
  // Start in "All Time (Till Date)" mode
  const [dateFilter, setDateFilter] = useState<DateFilterSelection>({
    type: "all",
    label: "All Time (Till Date)",
    startDate: "2026-01-01",
    endDate: "2026-10-03",
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
        label:
          day === "2026-10-03"
            ? "Today • 03 Oct"
            : day === "2026-10-02"
            ? "Yesterday • 02 Oct"
            : formatDayDisplay(day),
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
      endDate: "2026-10-03",
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
      list = list.filter((order) => normalizeOrderStatus(order.status) === statusFilter);
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
      <div className="flex flex-col xl:flex-row xl:items-center justify-between gap-4 bg-[var(--admin-surface)] p-6 rounded-[28px] border border-white/5">
        <div>
          <div className="flex items-center gap-2.5">
            <h1 className="text-2xl sm:text-3xl font-bold font-heading text-white tracking-tight">
              Orders &amp; Sales Hub
            </h1>
            <span className="inline-flex items-center gap-1.5 px-3 py-1 rounded-full text-[11px] font-bold bg-[#00F59B]/15 text-[#00F59B] border border-[#00F59B]/30">
              <span className="w-1.5 h-1.5 rounded-full bg-[#00F59B] animate-pulse" />
              Live Sync ({orders.length})
            </span>
          </div>
          <p className="text-xs sm:text-sm text-[var(--admin-text-muted)] mt-1">
            Real-time management for all transactions, cumulative lifetime analytics, and day-wise sales stepping.
          </p>
        </div>

        {/* Action Controls & Mode Hub */}
        <div className="flex flex-wrap items-center gap-2.5">
          {/* 1-Click Till Date vs Day-Wise Switcher */}
          <div className="flex items-center p-1 bg-[var(--admin-surface-2)] rounded-full border border-white/10">
            <button
              onClick={handleSelectTillDate}
              className={`flex items-center gap-2 px-4 py-2 rounded-full text-xs font-bold transition-all cursor-pointer ${
                isTillDateMode
                  ? "bg-[var(--admin-primary)] text-white"
                  : "text-[var(--admin-text-muted)] hover:text-white hover:bg-white/[0.04]"
              }`}
            >
              <CalendarDays size={14} className={isTillDateMode ? "text-white" : "text-[var(--admin-text-muted)]"} />
              <span>All Time (Till Date)</span>
            </button>

            <button
              onClick={handleSelectDayWiseMode}
              className={`flex items-center gap-2 px-4 py-2 rounded-full text-xs font-bold transition-all cursor-pointer ${
                isDayWiseMode
                  ? "bg-[var(--admin-primary)] text-white"
                  : "text-[var(--admin-text-muted)] hover:text-white hover:bg-white/[0.04]"
              }`}
            >
              <Calendar size={14} className={isDayWiseMode ? "text-white" : "text-[var(--admin-text-muted)]"} />
              <span>Day-Wise Breakdown</span>
            </button>
          </div>

          {/* Detailed Date Range Picker Dropdown */}
          <AdminDateRangePicker
            currentFilter={dateFilter}
            onSelectFilter={(newFilter) => {
              setDateFilter(newFilter);
              triggerToast(`Date filter updated to ${newFilter.label}`, "info");
            }}
            orders={orders}
            compact
          />

          {/* Export CSV button */}
          <button
            onClick={handleExportCSV}
            className="flex items-center gap-2 px-4 py-2 rounded-full text-xs font-bold bg-[var(--admin-surface)] hover:bg-[var(--admin-elevated)] border border-white/10 text-white transition-all cursor-pointer"
            title="Export filtered orders to CSV"
          >
            <Download size={14} className="text-[var(--admin-text-muted)]" />
            <span>Export CSV</span>
          </button>
        </div>
      </div>

      {/* ── TILL DATE (LIFETIME SCOPE) BANNER & DAY-WISE LEDGER ──────────────── */}
      {isTillDateMode && (
        <div className="space-y-4">
          <div className="relative overflow-hidden rounded-[28px] bg-[var(--admin-surface)] text-white p-6 border border-white/5">
            <div className="absolute right-0 top-0 w-80 h-full bg-gradient-to-l from-[var(--admin-primary)]/10 to-transparent pointer-events-none" />
            <div className="flex flex-col md:flex-row md:items-center justify-between gap-4 relative z-10">
              <div className="space-y-1">
                <div className="flex items-center gap-2">
                  <span className="px-2.5 py-0.5 rounded-full text-[10px] font-extrabold tracking-wider uppercase bg-[var(--admin-primary)]/20 text-white border border-[var(--admin-primary)]/30">
                    Lifetime Cumulative Scope
                  </span>
                  <span className="text-xs text-[var(--admin-text-muted)]">
                    18 Sep 2026 – Present (03 Oct 2026)
                  </span>
                </div>
                <h2 className="text-lg font-bold font-heading text-white tracking-tight">
                  Store Inception Till Date Overview
                </h2>
                <p className="text-xs text-[var(--admin-text-muted)] max-w-2xl leading-relaxed">
                  Displaying all cumulative checkouts, fulfilled luxury orders, and lifetime gross merchandise value. Click any day in the ledger or chart below to isolate individual dates.
                </p>
              </div>

              <div className="flex items-center gap-3">
                <div className="px-4 py-2.5 rounded-[14px] bg-[var(--admin-surface-2)] border border-white/10 text-right">
                  <span className="block text-[10px] uppercase tracking-wider text-[var(--admin-text-muted)]">Total Lifetime GMV</span>
                  <span className="text-base font-bold text-white font-heading tabular-nums">
                    ₹{stats.lifetimeRevenue.toLocaleString("en-IN")}
                  </span>
                </div>
                <button
                  onClick={handleSelectDayWiseMode}
                  className="flex items-center gap-1.5 px-5 py-2.5 rounded-full bg-[var(--admin-primary)] hover:bg-[var(--admin-primary-hover)] text-white font-bold text-xs transition-all cursor-pointer"
                >
                  <span>View Day-Wise Breakdown</span>
                  <ArrowRight size={14} />
                </button>
              </div>
            </div>
          </div>

          {/* Interactive Daily Sales Timeline Visualizer in All-Time Mode */}
          <div className="bg-[var(--admin-surface)] rounded-[28px] p-6 border border-white/5 space-y-3">
            <div className="flex items-center justify-between">
              <div className="flex items-center gap-2">
                <BarChart3 size={15} className="text-[var(--admin-primary)]" />
                <h3 className="text-xs font-bold uppercase tracking-wider text-white font-heading">
                  Daily Sales Timeline Visualizer (Click any date to inspect day-wise)
                </h3>
              </div>
              <span className="text-[11px] text-[var(--admin-text-muted)]">
                {availableOrderDays.length} Recorded Days • Peak: ₹{maxDayRevenue.toLocaleString("en-IN")}
              </span>
            </div>

            <DaySalesBars
              days={availableOrderDays}
              activeDay={dateFilter.type === "day" ? (dateFilter.singleDay || dateFilter.startDate) : null}
              maxDayRevenue={maxDayRevenue}
              onSelectDay={handleSelectDay}
            />
          </div>

          {/* Day-by-Day Historical Ledger Table */}
          <div className="bg-[var(--admin-surface)] rounded-[28px] border border-white/5 overflow-hidden">
            <div className="p-4 bg-[var(--admin-surface-2)] border-b border-white/5 flex items-center justify-between">
              <div className="flex items-center gap-2">
                <CalendarDays size={15} className="text-[var(--admin-primary)]" />
                <h3 className="text-xs font-bold uppercase tracking-wider text-white font-heading">
                  Day-by-Day Historical Sales Ledger (Inception to Present)
                </h3>
              </div>
              <span className="text-xs text-[var(--admin-text-muted)]">
                {availableOrderDays.length} Active Days Recorded
              </span>
            </div>

            <div className="overflow-x-auto admin-scroll">
              <table className="w-full text-left text-xs">
                <thead className="bg-[var(--admin-surface-2)] text-[var(--admin-text-muted)] font-bold uppercase tracking-wider text-[10px] border-b border-white/5">
                  <tr>
                    <th className="py-2.5 px-4">Date</th>
                    <th className="py-2.5 px-4">Orders Placed</th>
                    <th className="py-2.5 px-4">Daily GMV Revenue</th>
                    <th className="py-2.5 px-4">Average Order Value</th>
                    <th className="py-2.5 px-4">Fulfillment Rate</th>
                    <th className="py-2.5 px-4 text-right">Day Actions</th>
                  </tr>
                </thead>
                <tbody className="divide-y divide-white/5">
                  {availableOrderDays.map((d) => {
                    const deliveryRate = d.count > 0 ? Math.round((d.deliveredCount / d.count) * 100) : 0;
                    return (
                      <tr
                        key={d.date}
                        className="hover:bg-white/[0.04] transition-colors group cursor-pointer border-b border-white/5"
                        onClick={() => handleSelectDay(d.date, d.label)}
                      >
                        <td className="py-3 px-4 font-semibold text-white flex items-center gap-2">
                          <span className="w-2 h-2 rounded-full bg-[var(--admin-primary)] group-hover:scale-125 transition-transform" />
                          <span>{d.label}</span>
                        </td>
                        <td className="py-3 px-4 font-heading font-bold tabular-nums text-white">
                          <span className="px-2.5 py-0.5 rounded-full bg-white/5 group-hover:bg-white/10 text-white">
                            {d.count} {d.count === 1 ? "order" : "orders"}
                          </span>
                        </td>
                        <td className="py-3 px-4 font-heading font-extrabold tabular-nums text-white">
                          ₹{d.totalRevenue.toLocaleString("en-IN")}
                        </td>
                        <td className="py-3 px-4 font-heading font-medium tabular-nums text-[var(--admin-text-muted)]">
                          ₹{d.aov.toLocaleString("en-IN")}
                        </td>
                        <td className="py-3 px-4">
                          <span
                            className={`inline-flex items-center gap-1 px-2.5 py-0.5 rounded-full text-[10px] font-bold ${
                              deliveryRate === 100
                                ? "bg-[#00F59B]/15 text-[#00F59B] border border-[#00F59B]/30"
                                : "bg-[#38BDF8]/15 text-[#38BDF8] border border-[#38BDF8]/30"
                            }`}
                          >
                            {deliveryRate}% Fulfilled
                          </span>
                        </td>
                        <td className="py-3 px-4 text-right">
                          <button
                            onClick={(e) => {
                              e.stopPropagation();
                              handleSelectDay(d.date, d.label);
                            }}
                            className="inline-flex items-center gap-1 px-3 py-1.5 rounded-full bg-[var(--admin-surface-2)] text-white border border-white/10 font-bold text-[11px] hover:bg-[var(--admin-primary)] transition-all cursor-pointer"
                          >
                            <span>Drill Down Day</span>
                            <ArrowRight size={12} />
                          </button>
                        </td>
                      </tr>
                    );
                  })}
                </tbody>
              </table>
            </div>
          </div>
        </div>
      )}

      {/* ── DAY-WISE INTERACTIVE NAVIGATION HUB ───────────────────────────────── */}
      {isDayWiseMode && (
        <div className="bg-[var(--admin-surface)] rounded-[28px] p-6 border border-white/5 space-y-4">
          <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-3 border-b border-white/5 pb-3">
            <div className="flex items-center gap-2">
              <span className="px-2.5 py-0.5 rounded-full text-[10px] font-extrabold uppercase bg-[var(--admin-primary)]/20 text-white border border-[var(--admin-primary)]/40">
                Day-Wise Active
              </span>
              <h2 className="text-sm font-bold text-white">
                Browsing: <span className="text-white underline decoration-[var(--admin-primary)] decoration-2">{dateFilter.label}</span>
              </h2>
              <span className="text-xs text-[var(--admin-text-muted)]">
                ({filteredOrders.length} {filteredOrders.length === 1 ? "order" : "orders"} • ₹{stats.scopeRevenue.toLocaleString("en-IN")})
              </span>
            </div>

            {/* Stepper Buttons */}
            <div className="flex items-center gap-2">
              <button
                onClick={() => handleStepDay("prev")}
                disabled={currentDayIndex >= availableOrderDays.length - 1}
                className="flex items-center gap-1.5 px-3 py-1.5 rounded-full border border-white/10 bg-[var(--admin-surface-2)] hover:bg-[var(--admin-elevated)] disabled:opacity-40 disabled:pointer-events-none text-xs font-semibold text-white transition-colors cursor-pointer"
                title="View previous chronological day"
              >
                <ChevronLeft size={14} />
                <span>Earlier Day</span>
              </button>

              <button
                onClick={() => handleStepDay("next")}
                disabled={currentDayIndex <= 0}
                className="flex items-center gap-1.5 px-3 py-1.5 rounded-full border border-white/10 bg-[var(--admin-surface-2)] hover:bg-[var(--admin-elevated)] disabled:opacity-40 disabled:pointer-events-none text-xs font-semibold text-white transition-colors cursor-pointer"
                title="View next chronological day"
              >
                <span>Next Day</span>
                <ChevronRight size={14} />
              </button>

              <button
                onClick={handleSelectTillDate}
                className="flex items-center gap-1.5 px-3 py-1.5 rounded-full border border-[var(--admin-primary)]/40 bg-[var(--admin-primary)]/20 hover:bg-[var(--admin-primary)]/30 text-xs font-bold text-white transition-colors cursor-pointer"
                title="Return to All Time (Till Date) cumulative scope"
              >
                <CalendarDays size={13} className="text-white" />
                <span>All Time View</span>
              </button>
            </div>
          </div>

          {/* Horizontal Scrollable Day Chips */}
          <div className="space-y-1.5">
            <span className="text-[11px] font-bold uppercase tracking-wider text-[var(--admin-text-muted)] flex items-center gap-1.5">
              <Clock size={12} /> Select Any Recorded Order Day:
            </span>
            <div className="flex items-center gap-2 overflow-x-auto pb-2 admin-scroll">
              {availableOrderDays.map((d) => {
                const isActive = (dateFilter.singleDay || dateFilter.startDate) === d.date;
                return (
                  <button
                    key={d.date}
                    onClick={() => handleSelectDay(d.date, d.label)}
                    className={`flex-shrink-0 flex items-center gap-2 px-3 py-2 rounded-full text-xs transition-all cursor-pointer ${
                      isActive
                        ? "bg-[var(--admin-primary)] text-white font-bold border border-[var(--admin-primary)]"
                        : "bg-[var(--admin-surface-2)] hover:bg-white/[0.04] text-[var(--admin-text-muted)] hover:text-white font-medium border border-white/10"
                    }`}
                  >
                    <span className={isActive ? "text-white" : "text-[var(--admin-text-muted)] text-[11px]"}>
                      {d.label}
                    </span>
                    <span
                      className={`px-1.5 py-0.5 rounded-full text-[10px] font-extrabold ${
                        isActive ? "bg-white/20 text-white" : "bg-white/10 text-white"
                      }`}
                    >
                      {d.count}
                    </span>
                    <span className={`text-[11px] font-heading tabular-nums ${isActive ? "text-white" : "text-[var(--admin-text-muted)]"}`}>
                      ₹{d.totalRevenue.toLocaleString("en-IN")}
                    </span>
                  </button>
                );
              })}
            </div>
          </div>

          {/* Interactive Daily Sales Visualizer (Mini Bar Chart) */}
          <div className="pt-2 border-t border-white/5">
            <div className="flex items-center justify-between mb-2">
              <span className="text-[11px] font-bold uppercase tracking-wider text-[var(--admin-text-muted)] flex items-center gap-1.5">
                <BarChart3 size={13} className="text-[var(--admin-primary)]" />
                Daily Sales Timeline Visualizer (Click any bar to inspect day)
              </span>
              <span className="text-[11px] text-[var(--admin-text-muted)]">
                {availableOrderDays.length} Recorded Days • Peak: ₹{maxDayRevenue.toLocaleString("en-IN")}
              </span>
            </div>

            <DaySalesBars
              days={availableOrderDays}
              activeDay={dateFilter.singleDay || dateFilter.startDate}
              maxDayRevenue={maxDayRevenue}
              onSelectDay={handleSelectDay}
            />
          </div>
        </div>
      )}

      {/* ── CUSTOM / PRESET RANGE BANNER ──────────────────────────────────────── */}
      {!isTillDateMode && !isDayWiseMode && (
        <div className="p-4 rounded-[28px] bg-[var(--admin-surface)] border border-white/10 flex flex-col sm:flex-row sm:items-center justify-between gap-3 text-xs text-white animate-in fade-in duration-150">
          <div className="flex items-center gap-2">
            <Calendar size={15} className="text-[var(--admin-primary)] shrink-0" />
            <span>
              <strong>Custom Scope:</strong> {dateFilter.label} ({filteredOrders.length} {filteredOrders.length === 1 ? "order" : "orders"} • ₹{stats.scopeRevenue.toLocaleString("en-IN")})
            </span>
          </div>
          <div className="flex items-center gap-2">
            <button
              onClick={handleSelectTillDate}
              className="text-[11px] font-bold text-[var(--admin-primary)] hover:underline cursor-pointer"
            >
              Reset to All Time (Till Date)
            </button>
            <span className="text-white/20">•</span>
            <button
              onClick={handleSelectDayWiseMode}
              className="text-[11px] font-bold text-[var(--admin-primary)] hover:underline cursor-pointer"
            >
              Switch to Day-Wise
            </button>
          </div>
        </div>
      )}

      {/* ── 4-CARD LUXURY KPI RIBBON (ADAPTS TO TILL DATE VS DAY-WISE) ───────── */}
      <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-4">
        {/* Card 1: Revenue */}
        <div className="bg-[var(--admin-surface)] rounded-[28px] p-5 border border-white/5 hover:border-white/10 transition-all">
          <div className="flex items-center justify-between mb-3">
            <span className="text-[11px] font-bold uppercase tracking-wider text-[var(--admin-text-muted)]">
              {isDayWiseMode ? "Day's Revenue" : "Total GMV Revenue"}
            </span>
            <div className="p-2 rounded-[14px] bg-[var(--admin-surface-2)] text-[#F59E0B] border border-white/5">
              <IndianRupee size={18} />
            </div>
          </div>
          <div className="text-2xl sm:text-3xl font-heading font-bold tabular-nums text-white">
            ₹{stats.scopeRevenue.toLocaleString("en-IN")}
          </div>
          <div className="flex items-center gap-1.5 mt-2 text-xs font-medium text-[#00F59B]">
            <TrendingUp size={13} />
            <span>
              {isDayWiseMode
                ? `100% verified sales for ${dateFilter.label.split("•")[0].trim()}`
                : `₹${stats.lifetimeRevenue.toLocaleString("en-IN")} accumulated since launch`}
            </span>
          </div>
        </div>

        {/* Card 2: Orders Count */}
        <div className="bg-[var(--admin-surface)] rounded-[28px] p-5 border border-white/5 hover:border-white/10 transition-all">
          <div className="flex items-center justify-between mb-3">
            <span className="text-[11px] font-bold uppercase tracking-wider text-[var(--admin-text-muted)]">
              {isDayWiseMode ? "Orders on this Date" : "Total Orders Placed"}
            </span>
            <div className="p-2 rounded-[14px] bg-[var(--admin-surface-2)] text-[#38BDF8] border border-white/5">
              <ShoppingCart size={18} />
            </div>
          </div>
          <div className="text-2xl sm:text-3xl font-heading font-bold tabular-nums text-white">
            {stats.scopeOrdersCount}
          </div>
          <div className="flex items-center gap-1.5 mt-2 text-xs font-medium text-[var(--admin-text-muted)]">
            <Package size={13} />
            <span>
              {isDayWiseMode
                ? `Active in current date filter`
                : `${stats.lifetimeOrders} total completed checkouts`}
            </span>
          </div>
        </div>

        {/* Card 3: Average Order Value (AOV) */}
        <div className="bg-[var(--admin-surface)] rounded-[28px] p-5 border border-white/5 hover:border-white/10 transition-all">
          <div className="flex items-center justify-between mb-3">
            <span className="text-[11px] font-bold uppercase tracking-wider text-[var(--admin-text-muted)]">
              Average Order Value (AOV)
            </span>
            <div className="p-2 rounded-[14px] bg-[var(--admin-surface-2)] text-[var(--admin-primary)] border border-white/5">
              <Sparkles size={18} />
            </div>
          </div>
          <div className="text-2xl sm:text-3xl font-heading font-bold tabular-nums text-white">
            ₹{stats.scopeAOV.toLocaleString("en-IN")}
          </div>
          <div className="flex items-center gap-1.5 mt-2 text-xs font-medium text-[var(--admin-text-muted)]">
            <span>Avg spending per customer basket</span>
          </div>
        </div>

        {/* Card 4: Fulfillment / Delivery Rate */}
        <div className="bg-[var(--admin-surface)] rounded-[28px] p-5 border border-white/5 hover:border-white/10 transition-all">
          <div className="flex items-center justify-between mb-3">
            <span className="text-[11px] font-bold uppercase tracking-wider text-[var(--admin-text-muted)]">
              Delivery Success Rate
            </span>
            <div className="p-2 rounded-[14px] bg-[var(--admin-surface-2)] text-[#00F59B] border border-white/5">
              <CheckCircle size={18} />
            </div>
          </div>
          <div className="text-2xl sm:text-3xl font-heading font-bold tabular-nums text-white">
            {stats.deliveryRate}%
          </div>
          <div className="flex items-center gap-1.5 mt-2 text-xs font-medium text-[#00F59B]">
            <span>{stats.statusCounts["Delivered"] || 0} Delivered successfully</span>
          </div>
        </div>
      </div>

      {/* ── STATUS CHIPS & TOP PRODUCTS GRID ─────────────────────────────────── */}
      <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
        {/* Status Breakdown (2 Columns) */}
        <div className="lg:col-span-2 bg-[var(--admin-surface)] rounded-[28px] border border-white/5 p-5 sm:p-6 flex flex-col justify-between">
          {/* Header Row */}
          <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4 pb-5 border-b border-white/5">
            <div className="flex items-center gap-3.5">
              {/* Layers Icon in square badge */}
              <div className="w-11 h-11 sm:w-12 sm:h-12 rounded-[14px] bg-[var(--admin-surface-2)] border border-white/5 flex items-center justify-center shrink-0">
                <Layers className="w-5.5 h-5.5 text-[var(--admin-primary)]" strokeWidth={1.75} />
              </div>

              {/* Divider */}
              <div className="h-9 w-px bg-white/5 shrink-0" />

              {/* Title & Operations Subtitle */}
              <div>
                <span className="block text-[10px] font-bold tracking-[0.2em] uppercase text-[var(--admin-text-muted)] leading-tight">
                  OPERATIONS
                </span>
                <h2 className="text-xl sm:text-2xl font-heading font-bold text-white tracking-tight leading-snug mt-0.5">
                  Order Statuses In Active Scope
                </h2>
                <p className="text-[11px] sm:text-xs text-[var(--admin-text-muted)] mt-0.5 font-normal">
                  Live count of orders across different fulfilment stages.
                </p>
              </div>
            </div>

            {/* Pill button */}
            <button
              onClick={() => setStatusFilter("all")}
              aria-label="View all order statuses"
              className={`inline-flex items-center gap-2 self-start sm:self-center px-4 py-2 rounded-full text-xs font-semibold tracking-wider uppercase transition-all duration-300 cursor-pointer select-none active:scale-95 ${
                statusFilter === "all"
                  ? "bg-[var(--admin-primary)] text-white border border-[var(--admin-primary)]"
                  : "bg-[var(--admin-surface-2)] text-[var(--admin-text-muted)] border border-white/10 hover:border-white/20 hover:text-white hover:bg-white/[0.04]"
              }`}
            >
              {/* Live active pulsing beacon dot */}
              {statusFilter === "all" && (
                <span className="relative flex h-1.5 w-1.5 shrink-0" aria-hidden="true">
                  <span className="animate-ping absolute inline-flex h-full w-full rounded-full bg-white opacity-75" />
                  <span className="relative inline-flex rounded-full h-1.5 w-1.5 bg-white" />
                </span>
              )}

              <span className="relative z-10 font-heading tracking-wider">
                ALL ({dateFilteredOrders.length})
              </span>

              <span
                aria-hidden="true"
                className="relative z-10 text-white text-sm transform transition-transform duration-300 ease-out group-hover:translate-x-1"
              >
                →
              </span>
            </button>
          </div>

          {/* Cards Grid: 4 columns across, 2 rows */}
          <div className="grid grid-cols-2 sm:grid-cols-4 gap-2.5 sm:gap-3 pt-5">
            {ALL_STATUSES.map((status) => {
              const count = stats.statusCounts[status] || 0;
              const isSelected = statusFilter === status;
              const meta = STATUS_METADATA[status];

              // Proportional width for the bottom accent bar (minimum 14% accent if count is 0, wider if count > 0)
              const totalInScope = dateFilteredOrders.length || 1;
              const barWidthPercent =
                count > 0
                  ? Math.min(100, Math.max(30, Math.round((count / totalInScope) * 100)))
                  : 14;

              return (
                <button
                  key={status}
                  onClick={() => setStatusFilter(statusFilter === status ? "all" : status)}
                  className={`group relative flex flex-col justify-between p-3 sm:p-3.5 rounded-[14px] border text-left transition-all duration-200 cursor-pointer min-h-[92px] ${
                    isSelected
                      ? "bg-[var(--admin-surface-2)] border-[var(--admin-primary)] ring-1 ring-[var(--admin-primary)]"
                      : "bg-[var(--admin-surface-2)] hover:bg-white/[0.04] border-white/5 hover:border-white/10"
                  }`}
                >
                  {/* Top: Icon on Left, Title/Subtitle + Code/Count on Right */}
                  <div className="flex items-center gap-2.5 w-full">
                    {/* Left Icon Badge */}
                    <div
                      className={`w-8.5 h-8.5 rounded-full ${meta.badgeBg} border ${meta.badgeBorder} flex items-center justify-center shrink-0`}
                    >
                      {meta.renderIcon()}
                    </div>

                    {/* Right Info: Row 1 (Title + Code), Row 2 (Sublabel + Count) */}
                    <div className="flex-1 min-w-0">
                      {/* Row 1: Title on left, Code index on right */}
                      <div className="flex items-baseline justify-between gap-1 w-full">
                        <span className="font-heading font-bold text-white text-[12px] sm:text-[12.5px] leading-tight whitespace-nowrap">
                          {status}
                        </span>
                        <span className="text-[10px] sm:text-[11px] font-medium text-[var(--admin-text-muted)] shrink-0 leading-none">
                          {meta.code}
                        </span>
                      </div>

                      {/* Row 2: Sublabel on left, Large count on right */}
                      <div className="flex items-baseline justify-between gap-1 w-full mt-1">
                        <span className="text-[8px] sm:text-[8.5px] font-semibold tracking-wider uppercase text-[var(--admin-text-muted)] whitespace-nowrap leading-none">
                          {meta.sublabel}
                        </span>
                        <span className="font-heading text-[18px] sm:text-[20px] font-bold text-white leading-none shrink-0">
                          {count}
                        </span>
                      </div>
                    </div>
                  </div>

                  {/* Bottom: Accent Progress Bar */}
                  <div className="w-full h-[2.5px] bg-white/5 rounded-full overflow-hidden mt-2.5">
                    <div
                      className="h-full rounded-full transition-all duration-300"
                      style={{
                        backgroundColor: meta.accentColor,
                        width: `${barWidthPercent}%`,
                      }}
                    />
                  </div>
                </button>
              );
            })}
          </div>
        </div>

        {/* Top Selling Products in Active Scope */}
        <div className="bg-[var(--admin-surface)] rounded-[28px] border border-white/5 p-5 space-y-3">
          <div className="flex items-center justify-between">
            <h2 className="text-sm font-bold text-white flex items-center gap-2">
              <Package size={16} className="text-[var(--admin-primary)]" />
              Top Products (Active Scope)
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
                  className="flex items-center justify-between text-xs p-2 rounded-[14px] bg-[var(--admin-surface-2)] border border-white/5 hover:border-white/10 transition-colors"
                >
                  <div className="flex items-center gap-2.5 truncate max-w-[210px]">
                    <span
                      className={`w-5 h-5 rounded-full flex items-center justify-center text-[10px] font-extrabold flex-shrink-0 ${
                        i === 0
                          ? "bg-[var(--admin-primary)] text-white"
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

      {/* ── SEARCH & FILTER CONTROLS BAR ─────────────────────────────────────── */}
      <div className="bg-[var(--admin-surface)] p-4 rounded-[28px] border border-white/5 flex flex-col md:flex-row items-center gap-3">
        {/* Search */}
        <div className="relative flex-1 w-full">
          <Search size={16} className="absolute left-3.5 top-1/2 -translate-y-1/2 text-[var(--admin-text-muted)]" />
          <input
            type="text"
            placeholder="Search by Order ID, Customer name, Phone, or Item..."
            value={search}
            onChange={(e) => setSearch(e.target.value)}
            className="w-full pl-10 pr-10 py-2.5 rounded-[14px] border border-white/10 bg-[var(--admin-surface-2)] text-white placeholder:text-[var(--admin-text-muted)] text-sm focus:outline-none focus:border-[var(--admin-primary)] transition-all"
          />
          {search && (
            <button
              onClick={() => setSearch("")}
              className="absolute right-3 top-1/2 -translate-y-1/2 text-[var(--admin-text-muted)] hover:text-white"
            >
              <X size={16} />
            </button>
          )}
        </div>

        {/* Status Dropdown */}
        <div className="flex items-center gap-2 w-full md:w-auto">
          <div className="flex items-center gap-2 px-3 py-2 rounded-[14px] border border-white/10 bg-[var(--admin-surface-2)] text-xs">
            <Filter size={14} className="text-[var(--admin-text-muted)]" />
            <select
              value={statusFilter}
              onChange={(e) => setStatusFilter(e.target.value)}
              className="bg-transparent text-white font-semibold focus:outline-none cursor-pointer"
            >
              <option value="all">All Statuses ({dateFilteredOrders.length})</option>
              {ALL_STATUSES.map((s) => (
                <option key={s} value={s}>
                  {s} ({stats.statusCounts[s] || 0})
                </option>
              ))}
            </select>
          </div>

          {(search || statusFilter !== "all") && (
            <button
              onClick={() => {
                setSearch("");
                setStatusFilter("all");
              }}
              className="px-3.5 py-2 text-xs font-bold text-[#FF4B55] hover:bg-white/5 rounded-full transition-colors cursor-pointer"
            >
              Reset Filters
            </button>
          )}
        </div>
      </div>

      {/* ── ORDERS MASTER TABLE ──────────────────────────────────────────────── */}
      <div className="bg-[var(--admin-surface)] rounded-[28px] border border-white/5 overflow-hidden">
        <div className="overflow-x-auto admin-scroll">
          <table className="w-full text-sm text-left border-collapse" role="table">
            <thead>
              <tr className="border-b border-white/5 bg-[var(--admin-surface-2)] text-[11px] uppercase tracking-wider text-[var(--admin-text-muted)] font-semibold">
                <th className="px-5 py-4">Order ID</th>
                <th className="px-5 py-4">Customer</th>
                <th className="px-5 py-4">Date &amp; Time</th>
                <th className="px-5 py-4">Items Claimed</th>
                <th className="px-5 py-4">Total Amount</th>
                <th className="px-5 py-4">Status (Live Update)</th>
                <th className="px-5 py-4 text-right">Actions</th>
              </tr>
            </thead>
            <tbody className="divide-y divide-white/5">
              {paginatedOrders.map((order) => {
                const customerName = order.shippingAddress?.name || "Customer";
                const itemsList = order.items || [];
                const firstItem = itemsList[0];
                const isCopied = copiedId === order.id;

                // Status Pill styling
                const getStatusPill = (status: OrderStatus) => {
                  switch (status) {
                    case "Delivered":
                      return "bg-[#00F59B]/15 text-[#00F59B] border-[#00F59B]/30";
                    case "Shipped":
                    case "Out for Delivery":
                      return "bg-[#38BDF8]/15 text-[#38BDF8] border-[#38BDF8]/30";
                    case "Confirmed":
                    case "Packed":
                    case "Processing":
                      return "bg-[#F59E0B]/15 text-[#F59E0B] border-[#F59E0B]/30";
                    case "Cancelled":
                      return "bg-[#FF4B55]/15 text-[#FF4B55] border-[#FF4B55]/30";
                    case "Return Requested":
                    case "Returned":
                      return "bg-white/10 text-[var(--admin-text-muted)] border-white/20";
                    default:
                      return "bg-white/10 text-white border-white/20";
                  }
                };

                return (
                  <tr
                    key={order.id}
                    onClick={() => setSelectedOrder(order)}
                    className="hover:bg-white/[0.03] transition-colors cursor-pointer group border-b border-white/5"
                  >
                    {/* Order ID */}
                    <td className="px-5 py-4 font-mono text-xs">
                      <div className="flex items-center gap-1.5">
                        <span className="font-bold text-white group-hover:text-[var(--admin-primary)] transition-colors">
                          {order.id}
                        </span>
                        <button
                          onClick={(e) => handleCopyId(order.id, e)}
                          className="p-1 rounded-full text-[var(--admin-text-muted)] hover:text-white hover:bg-white/5 transition-colors"
                          title="Copy Order ID"
                        >
                          {isCopied ? <Check size={12} className="text-[#00F59B]" /> : <Copy size={12} />}
                        </button>
                      </div>
                    </td>

                    {/* Customer */}
                    <td className="px-5 py-4">
                      <div className="flex items-center gap-2.5">
                        <div className="w-8 h-8 rounded-full bg-[var(--admin-surface-2)] border border-white/10 text-white font-bold text-xs flex items-center justify-center flex-shrink-0">
                          {customerName.slice(0, 2).toUpperCase()}
                        </div>
                        <div>
                          <div className="font-semibold text-xs text-white">{customerName}</div>
                          {order.shippingAddress?.phone && (
                            <div className="text-[11px] text-[var(--admin-text-muted)] flex items-center gap-1">
                              <Phone size={10} /> {order.shippingAddress.phone}
                            </div>
                          )}
                        </div>
                      </div>
                    </td>

                    {/* Date */}
                    <td className="px-5 py-4 whitespace-nowrap">
                      <div className="text-xs font-medium text-[var(--admin-text-muted)] flex items-center gap-1.5">
                        <Clock size={12} className="text-[var(--admin-text-muted)]" />
                        {order.date}
                      </div>
                    </td>

                    {/* Items */}
                    <td className="px-5 py-4">
                      <div className="flex items-center gap-2.5 max-w-[240px]">
                        {firstItem?.imageUrl && (
                          <div className="w-10 h-10 rounded-lg overflow-hidden bg-[var(--admin-surface-2)] border border-white/10 flex-shrink-0 relative">
                            {/* eslint-disable-next-line @next/next/no-img-element */}
                            <img
                              src={firstItem.imageUrl}
                              alt={firstItem.productName}
                              className="w-full h-full object-cover"
                            />
                          </div>
                        )}
                        <div className="truncate">
                          <div className="font-semibold text-xs text-white truncate">
                            {firstItem ? firstItem.productName : order.itemNames?.[0] || "Luxury Product"}
                          </div>
                          <div className="text-[11px] text-[var(--admin-text-muted)]">
                            {firstItem ? (
                              <span>
                                {firstItem.selectedSize} · {firstItem.colorName} (×{firstItem.quantity})
                              </span>
                            ) : (
                              <span>1 item</span>
                            )}
                            {itemsList.length > 1 && (
                              <span className="ml-1 text-[var(--admin-primary)] font-bold">
                                +{itemsList.length - 1} more
                              </span>
                            )}
                          </div>
                        </div>
                      </div>
                    </td>

                    {/* Total */}
                    <td className="px-5 py-4">
                      <div className="font-heading font-bold tabular-nums text-sm text-white">
                        ₹{(order.total || 0).toLocaleString("en-IN")}
                      </div>
                      <span className="inline-block px-1.5 py-0.5 rounded-full text-[10px] font-extrabold uppercase bg-white/10 text-white mt-0.5">
                        {order.paymentMethod || "CARD"}
                      </span>
                    </td>

                    {/* Status Dropdown */}
                    <td className="px-5 py-4" onClick={(e) => e.stopPropagation()}>
                      <select
                        value={normalizeOrderStatus(order.status)}
                        onChange={(e) =>
                          handleStatusChange(order.id, e.target.value as OrderStatus)
                        }
                        className={`text-xs font-bold px-3 py-1.5 rounded-full border focus:outline-none transition-colors cursor-pointer ${getStatusPill(
                          normalizeOrderStatus(order.status)
                        )}`}
                      >
                        {ALL_STATUSES.map((s) => (
                          <option key={s} value={s}>
                            {s}
                          </option>
                        ))}
                      </select>
                    </td>

                    {/* Actions */}
                    <td className="px-5 py-4 text-right" onClick={(e) => e.stopPropagation()}>
                      <div className="flex items-center justify-end gap-1.5">
                        <button
                          onClick={() => setSelectedOrder(order)}
                          className="w-8 h-8 rounded-full flex items-center justify-center text-[var(--admin-text-muted)] hover:text-white hover:bg-white/5 transition-colors cursor-pointer"
                          title="Inspect Order Details"
                          aria-label={`Inspect ${order.id}`}
                        >
                          <Eye size={16} />
                        </button>

                        <button
                          onClick={(e) => handlePrintSlip(order, e)}
                          className="w-8 h-8 rounded-full flex items-center justify-center text-[var(--admin-text-muted)] hover:text-white hover:bg-white/5 transition-colors cursor-pointer"
                          title="Print Dispatch & Sales Slip"
                          aria-label={`Print ${order.id}`}
                        >
                          <Printer size={16} />
                        </button>

                        <button
                          onClick={() => handleDelete(order.id)}
                          className="w-8 h-8 rounded-full flex items-center justify-center text-[var(--admin-text-muted)] hover:text-[#FF4B55] hover:bg-white/5 transition-colors cursor-pointer"
                          title="Delete Order"
                          aria-label={`Delete ${order.id}`}
                        >
                          <Trash2 size={16} />
                        </button>
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
          <div className="flex flex-col sm:flex-row items-center justify-between gap-3 px-5 py-3.5 border-t border-white/5 bg-[var(--admin-surface-2)] text-xs text-[var(--admin-text-muted)]">
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
          className="fixed inset-0 z-[10000] bg-black/75 flex items-center justify-center p-4 backdrop-blur-xs animate-in fade-in duration-200"
          onClick={() => setSelectedOrder(null)}
        >
          <div
            className="bg-[var(--admin-surface)] rounded-[28px] max-w-2xl w-full max-h-[90vh] overflow-y-auto admin-scroll p-6 space-y-6 border border-white/10"
            data-lenis-prevent
            onClick={(e) => e.stopPropagation()}
          >
            {/* Modal Header */}
            <div className="flex items-center justify-between border-b border-white/5 pb-4">
              <div>
                <span className="text-[10px] font-extrabold uppercase tracking-wider text-[var(--admin-primary)] bg-[var(--admin-primary)]/15 border border-[var(--admin-primary)]/30 px-2.5 py-1 rounded-full">
                  Order Inspection
                </span>
                <h3 className="text-xl font-bold font-mono text-white mt-1">
                  {selectedOrder.id}
                </h3>
              </div>
              <div className="flex items-center gap-2">
                <button
                  onClick={(e) => handlePrintSlip(selectedOrder, e)}
                  className="flex items-center gap-1.5 px-3.5 py-1.5 rounded-full border border-white/10 hover:bg-[var(--admin-elevated)] bg-[var(--admin-surface-2)] text-xs font-bold text-white transition-colors cursor-pointer"
                >
                  <Printer size={14} />
                  <span>Print Receipt</span>
                </button>
                <button
                  onClick={() => setSelectedOrder(null)}
                  className="w-8 h-8 rounded-full flex items-center justify-center hover:bg-white/5 text-[var(--admin-text-muted)] hover:text-white transition-colors cursor-pointer"
                  aria-label="Close details"
                >
                  <X size={20} />
                </button>
              </div>
            </div>

            {/* Customer & Shipping Details */}
            <div className="grid grid-cols-1 sm:grid-cols-2 gap-4 text-xs">
              <div className="bg-[var(--admin-surface-2)] p-4 rounded-[14px] border border-white/5 space-y-2">
                <div className="font-bold uppercase tracking-wider text-[var(--admin-text-muted)] text-[10px] flex items-center gap-1.5">
                  <UserIcon size={12} /> Customer Information
                </div>
                <div className="font-semibold text-sm text-white">
                  {selectedOrder.shippingAddress?.name || "Customer"}
                </div>
                <div className="text-[var(--admin-text-muted)] flex items-center gap-1.5">
                  <Phone size={12} /> {selectedOrder.shippingAddress?.phone || "No phone provided"}
                </div>
                <div className="text-[var(--admin-text-muted)] flex items-center gap-1.5">
                  <Clock size={12} /> Placed: {selectedOrder.date}
                </div>
              </div>

              <div className="bg-[var(--admin-surface-2)] p-4 rounded-[14px] border border-white/5 space-y-2">
                <div className="font-bold uppercase tracking-wider text-[var(--admin-text-muted)] text-[10px] flex items-center gap-1.5">
                  <MapPin size={12} /> Delivery Destination
                </div>
                <div className="text-white leading-relaxed">
                  {selectedOrder.shippingAddress?.address || "Standard delivery address"}
                </div>
                {selectedOrder.shippingAddress?.pincode && (
                  <div className="text-[var(--admin-text-muted)]">
                    PIN: {selectedOrder.shippingAddress.pincode}
                  </div>
                )}
                <div className="text-[var(--admin-text-muted)] flex items-center gap-1.5">
                  <CreditCard size={12} /> Payment:{" "}
                  <span className="uppercase font-semibold text-white">
                    {selectedOrder.paymentMethod}
                  </span>
                </div>
              </div>
            </div>

            {/* Status Quick Updater */}
            <div className="p-4 bg-[var(--admin-surface-2)] border border-white/5 text-white rounded-[14px] flex flex-col sm:flex-row sm:items-center justify-between gap-3">
              <div>
                <span className="text-[11px] text-[var(--admin-text-muted)] block">Current Dispatch State:</span>
                <span className="font-bold text-sm text-[var(--admin-primary)]">
                  {selectedOrder.status}
                </span>
              </div>
              <div className="flex items-center gap-2">
                <span className="text-xs text-[var(--admin-text-muted)] font-medium">Update To:</span>
                <select
                  value={selectedOrder.status}
                  onChange={(e) =>
                    handleStatusChange(selectedOrder.id, e.target.value as OrderStatus)
                  }
                  className="px-3.5 py-1.5 rounded-[14px] bg-[var(--admin-surface)] border border-white/10 text-white text-xs font-bold cursor-pointer focus:outline-none focus:border-[var(--admin-primary)]"
                >
                  {ALL_STATUSES.map((s) => (
                    <option key={s} value={s}>
                      {s}
                    </option>
                  ))}
                </select>
              </div>
            </div>

            {/* Items Breakdown */}
            <div>
              <h4 className="font-bold text-sm text-white mb-3 flex items-center justify-between">
                <span>Items Ordered ({selectedOrder.items?.length || 1})</span>
                <span className="text-xs font-heading tabular-nums font-normal text-[var(--admin-text-muted)]">
                  Subtotal: ₹{(selectedOrder.subtotal || selectedOrder.total).toLocaleString("en-IN")}
                </span>
              </h4>
              <div className="space-y-2.5">
                {(selectedOrder.items || []).map((item, i) => (
                  <div
                    key={i}
                    className="flex items-center justify-between p-3 rounded-[14px] border border-white/5 bg-[var(--admin-surface-2)]"
                  >
                    <div className="flex items-center gap-3">
                      {item.imageUrl && (
                        <div className="w-12 h-12 rounded-lg overflow-hidden bg-[var(--admin-surface)] flex-shrink-0 relative border border-white/10">
                          {/* eslint-disable-next-line @next/next/no-img-element */}
                          <img
                            src={item.imageUrl}
                            alt={item.productName}
                            className="w-full h-full object-cover"
                          />
                        </div>
                      )}
                      <div>
                        <div className="font-semibold text-xs text-white">
                          {item.productName}
                        </div>
                        <div className="text-[11px] text-[var(--admin-text-muted)]">
                          Size: <span className="font-semibold text-white">{item.selectedSize}</span> · Color:{" "}
                          <span className="font-semibold text-white">{item.colorName}</span> · Qty:{" "}
                          <span className="font-semibold text-white">{item.quantity}</span>
                        </div>
                      </div>
                    </div>
                    <div className="font-heading font-bold tabular-nums text-xs text-white">
                      ₹{(item.totalPrice || item.unitPrice * item.quantity).toLocaleString("en-IN")}
                    </div>
                  </div>
                ))}
              </div>
            </div>

            {/* Financial Summary */}
            <div className="border-t border-white/5 pt-4 space-y-1.5 text-xs font-heading tabular-nums">
              <div className="flex justify-between text-[var(--admin-text-muted)]">
                <span>Subtotal</span>
                <span className="text-white font-bold">₹{(selectedOrder.subtotal || selectedOrder.total).toLocaleString("en-IN")}</span>
              </div>
              {selectedOrder.couponDiscount > 0 && (
                <div className="flex justify-between text-[#00F59B] font-bold">
                  <span>Coupon Discount ({selectedOrder.couponCode})</span>
                  <span>-₹{selectedOrder.couponDiscount.toLocaleString("en-IN")}</span>
                </div>
              )}
              {selectedOrder.shippingCost > 0 && (
                <div className="flex justify-between text-[var(--admin-text-muted)]">
                  <span>Shipping Cost</span>
                  <span className="text-white font-bold">₹{selectedOrder.shippingCost.toLocaleString("en-IN")}</span>
                </div>
              )}
              <div className="flex justify-between text-base font-bold text-white pt-2 border-t border-white/10">
                <span>Total Amount Paid</span>
                <span className="text-white font-heading font-bold tabular-nums">₹{selectedOrder.total.toLocaleString("en-IN")}</span>
              </div>
            </div>

            {/* Timeline */}
            {selectedOrder.timeline && selectedOrder.timeline.length > 0 && (
              <div className="border-t border-white/5 pt-4">
                <h4 className="font-bold text-xs uppercase tracking-wider text-[var(--admin-text-muted)] mb-3">
                  Dispatch &amp; Delivery Timeline
                </h4>
                <div className="space-y-3 border-l-2 border-white/10 pl-4 ml-2">
                  {selectedOrder.timeline.map((step, idx) => (
                    <div key={idx} className="relative text-xs">
                      <div className="absolute -left-[21px] top-1 w-2.5 h-2.5 rounded-full bg-[var(--admin-primary)] border-2 border-[var(--admin-surface)] ring-2 ring-white/10" />
                      <div className="flex items-center gap-2">
                        <span className="font-bold text-white">{step.status}</span>
                        <span className="text-[10px] text-[var(--admin-text-muted)]">
                          {step.timestamp}
                        </span>
                      </div>
                      <p className="text-[var(--admin-text-muted)] text-[11px] mt-0.5">{step.description}</p>
                    </div>
                  ))}
                </div>
              </div>
            )}
          </div>
        </div>
      )}
    </div>
  );
}
