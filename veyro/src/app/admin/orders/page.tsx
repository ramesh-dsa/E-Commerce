"use client";

import React, { useState, useMemo, useEffect } from "react";
import Image from "next/image";
import { useUser } from "@/context/UserContext";
import type { OrderRecord, OrderStatus } from "@/types";
import {
  AdminDateRangePicker,
  DateFilterSelection,
  parseOrderDateToDayString,
  formatDayDisplay,
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
} from "lucide-react";

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

  // Extract all unique dates where orders were placed chronologically
  const availableOrderDays = useMemo(() => {
    const dayMap = new Map<string, { date: string; label: string; count: number; totalRevenue: number }>();
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
      };
      existing.count += 1;
      existing.totalRevenue += o.total || 0;
      dayMap.set(day, existing);
    });
    return Array.from(dayMap.values()).sort((a, b) => b.date.localeCompare(a.date));
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
      list = list.filter((order) => order.status === statusFilter);
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
      const s = o.status || "Confirmed";
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
        <div className="fixed bottom-6 right-6 z-[10001] flex items-center gap-3 px-4 py-3 rounded-xl bg-neutral-900 text-white shadow-2xl border border-white/10 animate-in fade-in slide-in-from-bottom-3 duration-200">
          <div className={`p-1 rounded-full ${toast.type === "success" ? "bg-emerald-500/20 text-emerald-400" : "bg-amber-400/20 text-amber-400"}`}>
            <CheckCircle2 size={16} />
          </div>
          <span className="text-xs font-semibold">{toast.message}</span>
        </div>
      )}

      {/* ── TOP HEADER & LUXURY CONTROLS ────────────────────────────────────── */}
      <div className="flex flex-col xl:flex-row xl:items-center justify-between gap-4 bg-white p-5 rounded-2xl border border-neutral-200/80 shadow-xs">
        <div>
          <div className="flex items-center gap-2.5">
            <h1 className="text-2xl sm:text-3xl font-bold font-serif text-neutral-900 tracking-tight">
              Orders &amp; Sales Hub
            </h1>
            <span className="inline-flex items-center gap-1.5 px-2.5 py-0.5 rounded-full text-[11px] font-bold bg-emerald-50 text-emerald-700 border border-emerald-200">
              <span className="w-1.5 h-1.5 rounded-full bg-emerald-500 animate-pulse" />
              Live Sync ({orders.length})
            </span>
          </div>
          <p className="text-xs sm:text-sm text-neutral-500 mt-1">
            Real-time management for all transactions, cumulative lifetime analytics, and day-wise sales stepping.
          </p>
        </div>

        {/* Action Controls & Mode Hub */}
        <div className="flex flex-wrap items-center gap-2.5">
          {/* 1-Click Till Date vs Day-Wise Switcher */}
          <div className="flex items-center p-1 bg-neutral-100 rounded-xl border border-neutral-200">
            <button
              onClick={handleSelectTillDate}
              className={`flex items-center gap-2 px-3.5 py-2 rounded-lg text-xs font-bold transition-all cursor-pointer ${
                isTillDateMode
                  ? "bg-neutral-900 text-[#fde047] shadow-sm scale-[1.02]"
                  : "text-neutral-600 hover:text-neutral-900 hover:bg-white/60"
              }`}
            >
              <CalendarDays size={14} className={isTillDateMode ? "text-[#fde047]" : "text-neutral-500"} />
              <span>All Time (Till Date)</span>
            </button>

            <button
              onClick={handleSelectDayWiseMode}
              className={`flex items-center gap-2 px-3.5 py-2 rounded-lg text-xs font-bold transition-all cursor-pointer ${
                isDayWiseMode
                  ? "bg-neutral-900 text-[#fde047] shadow-sm scale-[1.02]"
                  : "text-neutral-600 hover:text-neutral-900 hover:bg-white/60"
              }`}
            >
              <Calendar size={14} className={isDayWiseMode ? "text-[#fde047]" : "text-neutral-500"} />
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
            className="flex items-center gap-2 px-3.5 py-2 rounded-xl text-xs font-bold bg-white hover:bg-neutral-50 border border-neutral-200 text-neutral-800 transition-all cursor-pointer shadow-2xs"
            title="Export filtered orders to CSV"
          >
            <Download size={14} className="text-neutral-500" />
            <span>Export CSV</span>
          </button>
        </div>
      </div>

      {/* ── TILL DATE (LIFETIME SCOPE) BANNER ───────────────────────────────── */}
      {isTillDateMode && (
        <div className="relative overflow-hidden rounded-2xl bg-neutral-950 text-white p-5 border border-white/10 shadow-lg">
          <div className="absolute right-0 top-0 w-80 h-full bg-gradient-to-l from-[#fde047]/10 to-transparent pointer-events-none" />
          <div className="flex flex-col md:flex-row md:items-center justify-between gap-4 relative z-10">
            <div className="space-y-1">
              <div className="flex items-center gap-2">
                <span className="px-2.5 py-0.5 rounded-full text-[10px] font-extrabold tracking-wider uppercase bg-[#fde047] text-black">
                  Lifetime Cumulative Scope
                </span>
                <span className="text-xs text-neutral-400 font-mono">
                  18 Sep 2026 – Present (03 Oct 2026)
                </span>
              </div>
              <h2 className="text-lg font-bold text-white tracking-tight">
                Store Inception Till Date Overview
              </h2>
              <p className="text-xs text-neutral-400 max-w-2xl leading-relaxed">
                Displaying all cumulative checkouts, fulfilled luxury orders, and lifetime gross merchandise value. Switch to Day-Wise to isolate any individual date.
              </p>
            </div>

            <div className="flex items-center gap-3">
              <div className="px-4 py-2.5 rounded-xl bg-white/[0.07] border border-white/10 text-right">
                <span className="block text-[10px] uppercase tracking-wider text-neutral-400">Total Lifetime GMV</span>
                <span className="text-base font-bold text-[#fde047] font-mono">
                  ₹{stats.lifetimeRevenue.toLocaleString("en-IN")}
                </span>
              </div>
              <button
                onClick={handleSelectDayWiseMode}
                className="flex items-center gap-1.5 px-4 py-2.5 rounded-xl bg-white text-neutral-950 font-bold text-xs hover:bg-neutral-100 transition-all cursor-pointer shadow-sm"
              >
                <span>View Day-Wise Breakdown</span>
                <ArrowRight size={14} />
              </button>
            </div>
          </div>
        </div>
      )}

      {/* ── DAY-WISE INTERACTIVE NAVIGATION HUB ───────────────────────────────── */}
      {isDayWiseMode && (
        <div className="bg-white rounded-2xl p-5 border border-neutral-200/80 shadow-xs space-y-4">
          <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-3 border-b border-neutral-100 pb-3">
            <div className="flex items-center gap-2">
              <span className="px-2.5 py-0.5 rounded-full text-[10px] font-extrabold uppercase bg-amber-400 text-black">
                Day-Wise Active
              </span>
              <h2 className="text-sm font-bold text-neutral-900">
                Browsing: <span className="font-mono text-neutral-950 underline decoration-amber-400 decoration-2">{dateFilter.label}</span>
              </h2>
              <span className="text-xs text-neutral-500 font-mono">
                ({filteredOrders.length} {filteredOrders.length === 1 ? "order" : "orders"} • ₹{stats.scopeRevenue.toLocaleString("en-IN")})
              </span>
            </div>

            {/* Stepper Buttons */}
            <div className="flex items-center gap-2">
              <button
                onClick={() => handleStepDay("prev")}
                disabled={currentDayIndex >= availableOrderDays.length - 1}
                className="flex items-center gap-1.5 px-3 py-1.5 rounded-lg border border-neutral-200 bg-white hover:bg-neutral-50 disabled:opacity-40 disabled:pointer-events-none text-xs font-semibold text-neutral-800 transition-colors cursor-pointer"
                title="View previous chronological day"
              >
                <ChevronLeft size={14} />
                <span>Earlier Day</span>
              </button>

              <button
                onClick={() => handleStepDay("next")}
                disabled={currentDayIndex <= 0}
                className="flex items-center gap-1.5 px-3 py-1.5 rounded-lg border border-neutral-200 bg-white hover:bg-neutral-50 disabled:opacity-40 disabled:pointer-events-none text-xs font-semibold text-neutral-800 transition-colors cursor-pointer"
                title="View next chronological day"
              >
                <span>Next Day</span>
                <ChevronRight size={14} />
              </button>
            </div>
          </div>

          {/* Horizontal Scrollable Day Chips */}
          <div className="space-y-1.5">
            <span className="text-[11px] font-bold uppercase tracking-wider text-neutral-400 flex items-center gap-1.5">
              <Clock size={12} /> Select Any Recorded Order Day:
            </span>
            <div className="flex items-center gap-2 overflow-x-auto pb-2 admin-scroll-container">
              {availableOrderDays.map((d) => {
                const isActive = (dateFilter.singleDay || dateFilter.startDate) === d.date;
                return (
                  <button
                    key={d.date}
                    onClick={() => handleSelectDay(d.date, d.label)}
                    className={`flex-shrink-0 flex items-center gap-2 px-3 py-2 rounded-xl text-xs transition-all cursor-pointer ${
                      isActive
                        ? "bg-neutral-900 text-white font-bold shadow-md ring-2 ring-amber-400 scale-[1.02]"
                        : "bg-neutral-50 hover:bg-neutral-100 text-neutral-700 font-medium border border-neutral-200/70"
                    }`}
                  >
                    <span className={isActive ? "text-[#fde047]" : "text-neutral-500 font-mono text-[11px]"}>
                      {d.label}
                    </span>
                    <span
                      className={`px-1.5 py-0.5 rounded-md text-[10px] font-extrabold ${
                        isActive ? "bg-amber-400 text-black" : "bg-neutral-200 text-neutral-800"
                      }`}
                    >
                      {d.count}
                    </span>
                    <span className={`text-[11px] font-mono ${isActive ? "text-amber-200" : "text-neutral-500"}`}>
                      ₹{d.totalRevenue.toLocaleString("en-IN")}
                    </span>
                  </button>
                );
              })}
            </div>
          </div>

          {/* Interactive Daily Sales Visualizer (Mini Bar Chart) */}
          <div className="pt-2 border-t border-neutral-100">
            <div className="flex items-center justify-between mb-2">
              <span className="text-[11px] font-bold uppercase tracking-wider text-neutral-500 flex items-center gap-1.5">
                <BarChart3 size={13} className="text-amber-500" />
                Daily Sales Timeline Visualizer (Click any bar to inspect day)
              </span>
              <span className="text-[11px] text-neutral-400">Peak: ₹{maxDayRevenue.toLocaleString("en-IN")}</span>
            </div>

            <div className="grid grid-cols-11 gap-1.5 h-20 items-end bg-neutral-50 p-2.5 rounded-xl border border-neutral-200/60">
              {availableOrderDays
                .slice()
                .reverse()
                .map((d) => {
                  const isActive = (dateFilter.singleDay || dateFilter.startDate) === d.date;
                  const heightPercent = Math.max(16, Math.round((d.totalRevenue / maxDayRevenue) * 100));
                  return (
                    <div
                      key={d.date}
                      onClick={() => handleSelectDay(d.date, d.label)}
                      className="group flex flex-col items-center h-full justify-end cursor-pointer"
                      title={`${d.label}: ${d.count} orders (₹${d.totalRevenue.toLocaleString("en-IN")})`}
                    >
                      <div className="w-full flex justify-center mb-1">
                        <span
                          className={`text-[9px] font-mono font-bold truncate transition-opacity ${
                            isActive ? "opacity-100 text-amber-600 font-extrabold" : "opacity-0 group-hover:opacity-100 text-neutral-500"
                          }`}
                        >
                          ₹{d.totalRevenue}
                        </span>
                      </div>
                      <div
                        style={{ height: `${heightPercent}%` }}
                        className={`w-full rounded-md transition-all duration-300 ${
                          isActive
                            ? "bg-gradient-to-t from-amber-500 to-yellow-400 shadow-sm ring-2 ring-black"
                            : "bg-neutral-300 group-hover:bg-neutral-400"
                        }`}
                      />
                      <span
                        className={`text-[9px] mt-1 font-mono font-semibold truncate ${
                          isActive ? "text-neutral-950 font-bold" : "text-neutral-400"
                        }`}
                      >
                        {d.date.slice(8)} Oct
                      </span>
                    </div>
                  );
                })}
            </div>
          </div>
        </div>
      )}

      {/* ── 4-CARD LUXURY KPI RIBBON (ADAPTS TO TILL DATE VS DAY-WISE) ───────── */}
      <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-4">
        {/* Card 1: Revenue */}
        <div className="bg-white rounded-2xl p-5 border border-neutral-200/80 shadow-xs hover:border-neutral-300 transition-all">
          <div className="flex items-center justify-between mb-3">
            <span className="text-[11px] font-bold uppercase tracking-wider text-neutral-500">
              {isDayWiseMode ? "Day's Revenue" : "Total GMV Revenue"}
            </span>
            <div className="p-2 rounded-xl bg-amber-50 text-amber-600 border border-amber-100">
              <IndianRupee size={18} />
            </div>
          </div>
          <div className="text-2xl sm:text-3xl font-bold font-mono text-neutral-900">
            ₹{stats.scopeRevenue.toLocaleString("en-IN")}
          </div>
          <div className="flex items-center gap-1.5 mt-2 text-xs font-medium text-emerald-600">
            <TrendingUp size={13} />
            <span>
              {isDayWiseMode
                ? `100% verified sales for ${dateFilter.label.split("•")[0].trim()}`
                : `₹${stats.lifetimeRevenue.toLocaleString("en-IN")} accumulated since launch`}
            </span>
          </div>
        </div>

        {/* Card 2: Orders Count */}
        <div className="bg-white rounded-2xl p-5 border border-neutral-200/80 shadow-xs hover:border-neutral-300 transition-all">
          <div className="flex items-center justify-between mb-3">
            <span className="text-[11px] font-bold uppercase tracking-wider text-neutral-500">
              {isDayWiseMode ? "Orders on this Date" : "Total Orders Placed"}
            </span>
            <div className="p-2 rounded-xl bg-blue-50 text-blue-600 border border-blue-100">
              <ShoppingCart size={18} />
            </div>
          </div>
          <div className="text-2xl sm:text-3xl font-bold font-mono text-neutral-900">
            {stats.scopeOrdersCount}
          </div>
          <div className="flex items-center gap-1.5 mt-2 text-xs font-medium text-neutral-500">
            <Package size={13} />
            <span>
              {isDayWiseMode
                ? `Active in current date filter`
                : `${stats.lifetimeOrders} total completed checkouts`}
            </span>
          </div>
        </div>

        {/* Card 3: Average Order Value (AOV) */}
        <div className="bg-white rounded-2xl p-5 border border-neutral-200/80 shadow-xs hover:border-neutral-300 transition-all">
          <div className="flex items-center justify-between mb-3">
            <span className="text-[11px] font-bold uppercase tracking-wider text-neutral-500">
              Average Order Value (AOV)
            </span>
            <div className="p-2 rounded-xl bg-purple-50 text-purple-600 border border-purple-100">
              <Sparkles size={18} />
            </div>
          </div>
          <div className="text-2xl sm:text-3xl font-bold font-mono text-neutral-900">
            ₹{stats.scopeAOV.toLocaleString("en-IN")}
          </div>
          <div className="flex items-center gap-1.5 mt-2 text-xs font-medium text-neutral-500">
            <span>Avg spending per customer basket</span>
          </div>
        </div>

        {/* Card 4: Fulfillment / Delivery Rate */}
        <div className="bg-white rounded-2xl p-5 border border-neutral-200/80 shadow-xs hover:border-neutral-300 transition-all">
          <div className="flex items-center justify-between mb-3">
            <span className="text-[11px] font-bold uppercase tracking-wider text-neutral-500">
              Delivery Success Rate
            </span>
            <div className="p-2 rounded-xl bg-emerald-50 text-emerald-600 border border-emerald-100">
              <CheckCircle size={18} />
            </div>
          </div>
          <div className="text-2xl sm:text-3xl font-bold font-mono text-neutral-900">
            {stats.deliveryRate}%
          </div>
          <div className="flex items-center gap-1.5 mt-2 text-xs font-medium text-emerald-600">
            <span>{stats.statusCounts["Delivered"] || 0} Delivered successfully</span>
          </div>
        </div>
      </div>

      {/* ── STATUS CHIPS & TOP PRODUCTS GRID ─────────────────────────────────── */}
      <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
        {/* Status Breakdown (2 Columns) */}
        <div className="lg:col-span-2 bg-white rounded-2xl border border-neutral-200/80 p-5 shadow-xs space-y-3">
          <div className="flex items-center justify-between">
            <h2 className="text-sm font-bold text-neutral-900 flex items-center gap-2">
              <Layers size={16} className="text-amber-500" />
              Order Statuses in Active Scope
            </h2>
            <button
              onClick={() => setStatusFilter("all")}
              className={`text-xs font-bold px-2.5 py-1 rounded-lg transition-colors cursor-pointer ${
                statusFilter === "all" ? "bg-neutral-900 text-white" : "text-neutral-500 hover:text-neutral-900"
              }`}
            >
              All ({dateFilteredOrders.length})
            </button>
          </div>

          <div className="grid grid-cols-2 sm:grid-cols-4 gap-2.5 pt-1">
            {ALL_STATUSES.map((status) => {
              const count = stats.statusCounts[status] || 0;
              const isSelected = statusFilter === status;

              const getTheme = () => {
                switch (status) {
                  case "Delivered":
                    return {
                      dot: "bg-emerald-500",
                      badge: "bg-emerald-50 text-emerald-700 border-emerald-200",
                    };
                  case "Shipped":
                  case "Out for Delivery":
                    return {
                      dot: "bg-blue-500",
                      badge: "bg-blue-50 text-blue-700 border-blue-200",
                    };
                  case "Confirmed":
                  case "Packed":
                    return {
                      dot: "bg-amber-500",
                      badge: "bg-amber-50 text-amber-700 border-amber-200",
                    };
                  case "Cancelled":
                    return {
                      dot: "bg-rose-500",
                      badge: "bg-rose-50 text-rose-700 border-rose-200",
                    };
                  case "Return Requested":
                  case "Returned":
                    return {
                      dot: "bg-purple-500",
                      badge: "bg-purple-50 text-purple-700 border-purple-200",
                    };
                  default:
                    return {
                      dot: "bg-neutral-400",
                      badge: "bg-neutral-50 text-neutral-700 border-neutral-200",
                    };
                }
              };

              const theme = getTheme();

              return (
                <button
                  key={status}
                  onClick={() => setStatusFilter(statusFilter === status ? "all" : status)}
                  className={`flex flex-col p-3 rounded-xl border text-left transition-all cursor-pointer ${
                    isSelected
                      ? "bg-neutral-900 text-white border-neutral-900 shadow-md ring-2 ring-amber-400"
                      : "bg-neutral-50/60 hover:bg-neutral-100/80 border-neutral-200/80 text-neutral-800"
                  }`}
                >
                  <div className="flex items-center justify-between w-full mb-1">
                    <span className={`w-2 h-2 rounded-full ${theme.dot}`} />
                    <span
                      className={`text-[11px] font-mono font-bold px-1.5 py-0.2 rounded ${
                        isSelected ? "bg-white/20 text-white" : "bg-neutral-200/80 text-neutral-800"
                      }`}
                    >
                      {count}
                    </span>
                  </div>
                  <span className="text-xs font-semibold truncate">{status}</span>
                </button>
              );
            })}
          </div>
        </div>

        {/* Top Selling Products in Active Scope */}
        <div className="bg-white rounded-2xl border border-neutral-200/80 p-5 shadow-xs space-y-3">
          <div className="flex items-center justify-between">
            <h2 className="text-sm font-bold text-neutral-900 flex items-center gap-2">
              <Package size={16} className="text-amber-500" />
              Top Products (Active Scope)
            </h2>
            <span className="text-[11px] text-neutral-400 font-mono">By Revenue</span>
          </div>

          {stats.topProducts.length === 0 ? (
            <div className="py-8 text-center text-xs text-neutral-400">
              No product sales data in this date range.
            </div>
          ) : (
            <div className="space-y-2.5 pt-1">
              {stats.topProducts.map((p, i) => (
                <div
                  key={`${p.name}-${i}`}
                  className="flex items-center justify-between text-xs p-2 rounded-xl bg-neutral-50/80 border border-neutral-100 hover:border-neutral-200 transition-colors"
                >
                  <div className="flex items-center gap-2.5 truncate max-w-[210px]">
                    <span
                      className={`w-5 h-5 rounded-md flex items-center justify-center text-[10px] font-extrabold flex-shrink-0 ${
                        i === 0
                          ? "bg-amber-400 text-black"
                          : i === 1
                          ? "bg-neutral-300 text-black"
                          : "bg-neutral-200 text-neutral-700"
                      }`}
                    >
                      #{i + 1}
                    </span>
                    <span className="font-semibold text-neutral-900 truncate">{p.name}</span>
                  </div>
                  <div className="text-right flex-shrink-0 font-mono">
                    <span className="font-bold text-neutral-950">₹{p.revenue.toLocaleString("en-IN")}</span>
                    <span className="block text-[10px] text-neutral-400">({p.count} sold)</span>
                  </div>
                </div>
              ))}
            </div>
          )}
        </div>
      </div>

      {/* ── SEARCH & FILTER CONTROLS BAR ─────────────────────────────────────── */}
      <div className="bg-white p-4 rounded-2xl border border-neutral-200/80 shadow-xs flex flex-col md:flex-row items-center gap-3">
        {/* Search */}
        <div className="relative flex-1 w-full">
          <Search size={16} className="absolute left-3.5 top-1/2 -translate-y-1/2 text-neutral-400" />
          <input
            type="text"
            placeholder="Search by Order ID, Customer name, Phone, or Item..."
            value={search}
            onChange={(e) => setSearch(e.target.value)}
            className="w-full pl-10 pr-10 py-2.5 rounded-xl border border-neutral-200 bg-neutral-50/50 text-sm focus:outline-none focus:border-neutral-900 focus:bg-white transition-all"
          />
          {search && (
            <button
              onClick={() => setSearch("")}
              className="absolute right-3 top-1/2 -translate-y-1/2 text-neutral-400 hover:text-neutral-700"
            >
              <X size={16} />
            </button>
          )}
        </div>

        {/* Status Dropdown */}
        <div className="flex items-center gap-2 w-full md:w-auto">
          <div className="flex items-center gap-2 px-3 py-2 rounded-xl border border-neutral-200 bg-neutral-50/50 text-xs">
            <Filter size={14} className="text-neutral-500" />
            <select
              value={statusFilter}
              onChange={(e) => setStatusFilter(e.target.value)}
              className="bg-transparent text-neutral-900 font-semibold focus:outline-none cursor-pointer"
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
              className="px-3 py-2 text-xs font-bold text-rose-600 hover:bg-rose-50 rounded-xl transition-colors cursor-pointer"
            >
              Reset Filters
            </button>
          )}
        </div>
      </div>

      {/* ── ORDERS MASTER TABLE ──────────────────────────────────────────────── */}
      <div className="bg-white rounded-2xl border border-neutral-200/80 shadow-xs overflow-hidden">
        <div className="overflow-x-auto admin-scroll-container">
          <table className="w-full text-sm text-left border-collapse" role="table">
            <thead>
              <tr className="border-b border-neutral-200/80 bg-neutral-50/80 text-[11px] uppercase tracking-wider text-neutral-500 font-semibold font-mono">
                <th className="px-5 py-4">Order ID</th>
                <th className="px-5 py-4">Customer</th>
                <th className="px-5 py-4">Date &amp; Time</th>
                <th className="px-5 py-4">Items Claimed</th>
                <th className="px-5 py-4">Total Amount</th>
                <th className="px-5 py-4">Status (Live Update)</th>
                <th className="px-5 py-4 text-right">Actions</th>
              </tr>
            </thead>
            <tbody className="divide-y divide-neutral-100">
              {paginatedOrders.map((order) => {
                const customerName = order.shippingAddress?.name || "Customer";
                const itemsList = order.items || [];
                const firstItem = itemsList[0];
                const isCopied = copiedId === order.id;

                // Status Pill styling
                const getStatusPill = (status: OrderStatus) => {
                  switch (status) {
                    case "Delivered":
                      return "bg-emerald-50 text-emerald-700 border-emerald-200";
                    case "Shipped":
                    case "Out for Delivery":
                      return "bg-blue-50 text-blue-700 border-blue-200";
                    case "Confirmed":
                    case "Packed":
                      return "bg-amber-50 text-amber-700 border-amber-200";
                    case "Cancelled":
                      return "bg-rose-50 text-rose-700 border-rose-200";
                    case "Return Requested":
                    case "Returned":
                      return "bg-purple-50 text-purple-700 border-purple-200";
                    default:
                      return "bg-neutral-100 text-neutral-800 border-neutral-200";
                  }
                };

                return (
                  <tr
                    key={order.id}
                    onClick={() => setSelectedOrder(order)}
                    className="hover:bg-neutral-50/70 transition-colors cursor-pointer group"
                  >
                    {/* Order ID */}
                    <td className="px-5 py-4 font-mono text-xs">
                      <div className="flex items-center gap-1.5">
                        <span className="font-bold text-neutral-900 group-hover:text-amber-600 transition-colors">
                          {order.id}
                        </span>
                        <button
                          onClick={(e) => handleCopyId(order.id, e)}
                          className="p-1 rounded text-neutral-400 hover:text-neutral-700 hover:bg-neutral-200/60 transition-colors"
                          title="Copy Order ID"
                        >
                          {isCopied ? <Check size={12} className="text-emerald-600" /> : <Copy size={12} />}
                        </button>
                      </div>
                    </td>

                    {/* Customer */}
                    <td className="px-5 py-4">
                      <div className="flex items-center gap-2.5">
                        <div className="w-8 h-8 rounded-full bg-neutral-900 text-amber-300 font-bold text-xs flex items-center justify-center flex-shrink-0">
                          {customerName.slice(0, 2).toUpperCase()}
                        </div>
                        <div>
                          <div className="font-semibold text-xs text-neutral-900">{customerName}</div>
                          {order.shippingAddress?.phone && (
                            <div className="text-[11px] text-neutral-500 font-mono flex items-center gap-1">
                              <Phone size={10} /> {order.shippingAddress.phone}
                            </div>
                          )}
                        </div>
                      </div>
                    </td>

                    {/* Date */}
                    <td className="px-5 py-4 whitespace-nowrap">
                      <div className="text-xs font-medium text-neutral-800 flex items-center gap-1.5">
                        <Clock size={12} className="text-neutral-400" />
                        {order.date}
                      </div>
                    </td>

                    {/* Items */}
                    <td className="px-5 py-4">
                      <div className="flex items-center gap-2.5 max-w-[240px]">
                        {firstItem?.imageUrl && (
                          <div className="w-10 h-10 rounded-lg overflow-hidden bg-neutral-100 border border-neutral-200 flex-shrink-0 relative">
                            {/* eslint-disable-next-line @next/next/no-img-element */}
                            <img
                              src={firstItem.imageUrl}
                              alt={firstItem.productName}
                              className="w-full h-full object-cover"
                            />
                          </div>
                        )}
                        <div className="truncate">
                          <div className="font-semibold text-xs text-neutral-900 truncate">
                            {firstItem ? firstItem.productName : order.itemNames?.[0] || "Luxury Product"}
                          </div>
                          <div className="text-[11px] text-neutral-500">
                            {firstItem ? (
                              <span>
                                {firstItem.selectedSize} · {firstItem.colorName} (×{firstItem.quantity})
                              </span>
                            ) : (
                              <span>1 item</span>
                            )}
                            {itemsList.length > 1 && (
                              <span className="ml-1 text-amber-600 font-bold">
                                +{itemsList.length - 1} more
                              </span>
                            )}
                          </div>
                        </div>
                      </div>
                    </td>

                    {/* Total */}
                    <td className="px-5 py-4">
                      <div className="font-mono font-bold text-sm text-neutral-950">
                        ₹{(order.total || 0).toLocaleString("en-IN")}
                      </div>
                      <span className="inline-block px-1.5 py-0.2 rounded text-[10px] font-extrabold uppercase bg-neutral-100 text-neutral-600 font-mono mt-0.5">
                        {order.paymentMethod || "CARD"}
                      </span>
                    </td>

                    {/* Status Dropdown */}
                    <td className="px-5 py-4" onClick={(e) => e.stopPropagation()}>
                      <select
                        value={order.status}
                        onChange={(e) =>
                          handleStatusChange(order.id, e.target.value as OrderStatus)
                        }
                        className={`text-xs font-bold px-3 py-1.5 rounded-xl border focus:outline-none transition-colors cursor-pointer ${getStatusPill(
                          order.status
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
                          className="p-1.5 text-neutral-500 hover:text-neutral-950 hover:bg-neutral-100 rounded-lg transition-colors cursor-pointer"
                          title="Inspect Order Details"
                          aria-label={`Inspect ${order.id}`}
                        >
                          <Eye size={16} />
                        </button>

                        <button
                          onClick={(e) => handlePrintSlip(order, e)}
                          className="p-1.5 text-neutral-500 hover:text-neutral-950 hover:bg-neutral-100 rounded-lg transition-colors cursor-pointer"
                          title="Print Dispatch & Sales Slip"
                          aria-label={`Print ${order.id}`}
                        >
                          <Printer size={16} />
                        </button>

                        <button
                          onClick={() => handleDelete(order.id)}
                          className="p-1.5 text-neutral-400 hover:text-rose-600 hover:bg-rose-50 rounded-lg transition-colors cursor-pointer"
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
          <div className="py-16 text-center text-neutral-500 space-y-2">
            <Package size={36} className="mx-auto text-neutral-300 mb-2" />
            <h3 className="text-sm font-bold text-neutral-800">No Orders Found</h3>
            <p className="text-xs text-neutral-500 max-w-sm mx-auto">
              No orders match your active date filter, search query, or status selection.
            </p>
            <button
              onClick={() => {
                setSearch("");
                setStatusFilter("all");
                handleSelectTillDate();
              }}
              className="mt-3 px-4 py-2 rounded-xl bg-neutral-900 text-white text-xs font-bold hover:bg-neutral-800 transition-colors cursor-pointer"
            >
              Reset to Lifetime Scope
            </button>
          </div>
        )}

        {/* Pagination Footer */}
        {filteredOrders.length > 0 && (
          <div className="flex flex-col sm:flex-row items-center justify-between gap-3 px-5 py-3.5 border-t border-neutral-100 bg-neutral-50/50 text-xs text-neutral-600">
            <div>
              Showing <span className="font-bold text-neutral-900">{(currentPage - 1) * PAGE_SIZE + 1}</span> to{" "}
              <span className="font-bold text-neutral-900">
                {Math.min(currentPage * PAGE_SIZE, filteredOrders.length)}
              </span>{" "}
              of <span className="font-bold text-neutral-900">{filteredOrders.length}</span> orders
            </div>

            <div className="flex items-center gap-1.5">
              <button
                onClick={() => setCurrentPage((p) => Math.max(1, p - 1))}
                disabled={currentPage === 1}
                className="px-3 py-1.5 rounded-lg border border-neutral-200 bg-white hover:bg-neutral-100 disabled:opacity-40 disabled:pointer-events-none text-xs font-semibold cursor-pointer"
              >
                Previous
              </button>

              <span className="px-2 font-mono text-neutral-500">
                Page {currentPage} of {totalPages}
              </span>

              <button
                onClick={() => setCurrentPage((p) => Math.min(totalPages, p + 1))}
                disabled={currentPage === totalPages}
                className="px-3 py-1.5 rounded-lg border border-neutral-200 bg-white hover:bg-neutral-100 disabled:opacity-40 disabled:pointer-events-none text-xs font-semibold cursor-pointer"
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
          className="fixed inset-0 z-[10000] bg-black/60 flex items-center justify-center p-4 backdrop-blur-xs animate-in fade-in duration-200"
          onClick={() => setSelectedOrder(null)}
        >
          <div
            className="bg-white rounded-2xl max-w-2xl w-full max-h-[90vh] overflow-y-auto admin-scroll-container p-6 space-y-6 shadow-2xl border border-neutral-200"
            data-lenis-prevent
            onClick={(e) => e.stopPropagation()}
          >
            {/* Modal Header */}
            <div className="flex items-center justify-between border-b border-neutral-100 pb-4">
              <div>
                <span className="text-[10px] font-mono font-extrabold uppercase tracking-wider text-amber-600 bg-amber-50 px-2 py-0.5 rounded">
                  Order Inspection
                </span>
                <h3 className="text-xl font-bold font-mono text-neutral-900 mt-1">
                  {selectedOrder.id}
                </h3>
              </div>
              <div className="flex items-center gap-2">
                <button
                  onClick={(e) => handlePrintSlip(selectedOrder, e)}
                  className="flex items-center gap-1.5 px-3 py-1.5 rounded-lg border border-neutral-200 hover:bg-neutral-50 text-xs font-bold text-neutral-800 transition-colors cursor-pointer"
                >
                  <Printer size={14} />
                  <span>Print Receipt</span>
                </button>
                <button
                  onClick={() => setSelectedOrder(null)}
                  className="p-1.5 rounded-lg hover:bg-neutral-100 text-neutral-500 transition-colors cursor-pointer"
                  aria-label="Close details"
                >
                  <X size={20} />
                </button>
              </div>
            </div>

            {/* Customer & Shipping Details */}
            <div className="grid grid-cols-1 sm:grid-cols-2 gap-4 text-xs">
              <div className="bg-neutral-50 p-4 rounded-xl border border-neutral-100 space-y-2">
                <div className="font-bold uppercase tracking-wider text-neutral-500 text-[10px] flex items-center gap-1.5">
                  <UserIcon size={12} /> Customer Information
                </div>
                <div className="font-semibold text-sm text-neutral-900">
                  {selectedOrder.shippingAddress?.name || "Customer"}
                </div>
                <div className="text-neutral-600 flex items-center gap-1.5">
                  <Phone size={12} /> {selectedOrder.shippingAddress?.phone || "No phone provided"}
                </div>
                <div className="text-neutral-600 flex items-center gap-1.5">
                  <Clock size={12} /> Placed: {selectedOrder.date}
                </div>
              </div>

              <div className="bg-neutral-50 p-4 rounded-xl border border-neutral-100 space-y-2">
                <div className="font-bold uppercase tracking-wider text-neutral-500 text-[10px] flex items-center gap-1.5">
                  <MapPin size={12} /> Delivery Destination
                </div>
                <div className="text-neutral-800 leading-relaxed">
                  {selectedOrder.shippingAddress?.address || "Standard delivery address"}
                </div>
                {selectedOrder.shippingAddress?.pincode && (
                  <div className="font-mono text-neutral-600">
                    PIN: {selectedOrder.shippingAddress.pincode}
                  </div>
                )}
                <div className="text-neutral-600 flex items-center gap-1.5">
                  <CreditCard size={12} /> Payment:{" "}
                  <span className="uppercase font-semibold text-neutral-900 font-mono">
                    {selectedOrder.paymentMethod}
                  </span>
                </div>
              </div>
            </div>

            {/* Status Quick Updater */}
            <div className="p-4 bg-neutral-900 text-white rounded-xl flex flex-col sm:flex-row sm:items-center justify-between gap-3 shadow-sm">
              <div>
                <span className="text-[11px] text-neutral-400 block">Current Dispatch State:</span>
                <span className="font-bold text-sm text-[#fde047] font-mono">
                  {selectedOrder.status}
                </span>
              </div>
              <div className="flex items-center gap-2">
                <span className="text-xs text-neutral-300 font-medium">Update To:</span>
                <select
                  value={selectedOrder.status}
                  onChange={(e) =>
                    handleStatusChange(selectedOrder.id, e.target.value as OrderStatus)
                  }
                  className="px-3 py-1.5 rounded-lg bg-white text-neutral-950 text-xs font-bold cursor-pointer focus:outline-none"
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
              <h4 className="font-bold text-sm text-neutral-900 mb-3 flex items-center justify-between">
                <span>Items Ordered ({selectedOrder.items?.length || 1})</span>
                <span className="text-xs font-mono font-normal text-neutral-500">
                  Subtotal: ₹{(selectedOrder.subtotal || selectedOrder.total).toLocaleString("en-IN")}
                </span>
              </h4>
              <div className="space-y-2.5">
                {(selectedOrder.items || []).map((item, i) => (
                  <div
                    key={i}
                    className="flex items-center justify-between p-3 rounded-xl border border-neutral-100 bg-neutral-50/60"
                  >
                    <div className="flex items-center gap-3">
                      {item.imageUrl && (
                        <div className="w-12 h-12 rounded-lg overflow-hidden bg-neutral-100 flex-shrink-0 relative border border-neutral-200">
                          {/* eslint-disable-next-line @next/next/no-img-element */}
                          <img
                            src={item.imageUrl}
                            alt={item.productName}
                            className="w-full h-full object-cover"
                          />
                        </div>
                      )}
                      <div>
                        <div className="font-semibold text-xs text-neutral-900">
                          {item.productName}
                        </div>
                        <div className="text-[11px] text-neutral-500">
                          Size: <span className="font-semibold text-neutral-800">{item.selectedSize}</span> · Color:{" "}
                          <span className="font-semibold text-neutral-800">{item.colorName}</span> · Qty:{" "}
                          <span className="font-semibold text-neutral-800">{item.quantity}</span>
                        </div>
                      </div>
                    </div>
                    <div className="font-bold font-mono text-xs text-neutral-950">
                      ₹{(item.totalPrice || item.unitPrice * item.quantity).toLocaleString("en-IN")}
                    </div>
                  </div>
                ))}
              </div>
            </div>

            {/* Financial Summary */}
            <div className="border-t border-neutral-100 pt-4 space-y-1.5 text-xs font-mono">
              <div className="flex justify-between text-neutral-600">
                <span>Subtotal</span>
                <span>₹{(selectedOrder.subtotal || selectedOrder.total).toLocaleString("en-IN")}</span>
              </div>
              {selectedOrder.couponDiscount > 0 && (
                <div className="flex justify-between text-emerald-600 font-bold">
                  <span>Coupon Discount ({selectedOrder.couponCode})</span>
                  <span>-₹{selectedOrder.couponDiscount.toLocaleString("en-IN")}</span>
                </div>
              )}
              {selectedOrder.shippingCost > 0 && (
                <div className="flex justify-between text-neutral-600">
                  <span>Shipping Cost</span>
                  <span>₹{selectedOrder.shippingCost.toLocaleString("en-IN")}</span>
                </div>
              )}
              <div className="flex justify-between text-base font-bold text-neutral-950 pt-2 border-t border-neutral-200">
                <span>Total Amount Paid</span>
                <span className="text-[#d97706] font-mono">₹{selectedOrder.total.toLocaleString("en-IN")}</span>
              </div>
            </div>

            {/* Timeline */}
            {selectedOrder.timeline && selectedOrder.timeline.length > 0 && (
              <div className="border-t border-neutral-100 pt-4">
                <h4 className="font-bold text-xs uppercase tracking-wider text-neutral-500 mb-3">
                  Dispatch &amp; Delivery Timeline
                </h4>
                <div className="space-y-3 border-l-2 border-neutral-200 pl-4 ml-2">
                  {selectedOrder.timeline.map((step, idx) => (
                    <div key={idx} className="relative text-xs">
                      <div className="absolute -left-[21px] top-1 w-2.5 h-2.5 rounded-full bg-neutral-900 border-2 border-white ring-2 ring-neutral-200" />
                      <div className="flex items-center gap-2">
                        <span className="font-bold text-neutral-900">{step.status}</span>
                        <span className="text-[10px] text-neutral-500 font-mono">
                          {step.timestamp}
                        </span>
                      </div>
                      <p className="text-neutral-600 text-[11px] mt-0.5">{step.description}</p>
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
