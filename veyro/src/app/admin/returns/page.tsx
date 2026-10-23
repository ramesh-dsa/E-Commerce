"use client";

import React, { useState, useMemo, useEffect } from "react";
import { createPortal } from "react-dom";
import Image from "next/image";
import { motion, AnimatePresence, useReducedMotion } from "motion/react";
import { useUser } from "@/context/UserContext";
import type { OrderRecord } from "@/types";
import {
  AdminDateRangePicker,
  DateFilterSelection,
  parseOrderDateToDayString,
  formatDayDisplay,
  getAllTimeScope,
} from "@/components/admin/AdminDateRangePicker";
import { normalizeSearchText, stripToAlphaNumeric, getSynonymsForWord } from "@/utils/searchEngine";
import {
  RotateCcw,
  CheckCircle2,
  XCircle,
  Clock,
  Search,
  CalendarDays,
  ChevronLeft,
  ChevronRight,
  ArrowRight,
  Download,
  Printer,
  Sparkles,
  Eye,
  Check,
  X,
  MoreHorizontal,
} from "lucide-react";
import { AdminSelect } from "@/components/admin/AdminSelect";
import { useAnchoredMenu } from "@/components/admin/useAnchoredMenu";
import { EmptyState } from "@/components/admin/EmptyState";

function AdminPortal({ children }: { children: React.ReactNode }) {
  const [mounted, setMounted] = useState(false);
  useEffect(() => {
    setMounted(true);
  }, []);
  if (!mounted || typeof document === "undefined") return null;
  return createPortal(children, document.body);
}

function ReturnRowMenu({
  returnItem,
  onInspect,
  onPrintSlip,
}: {
  returnItem: ReturnItemRecord;
  onInspect: () => void;
  onPrintSlip: () => void;
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
        className="w-8 h-8 rounded-full border border-white/10 bg-[var(--admin-surface)] hover:bg-[var(--admin-elevated)] flex items-center justify-center text-[var(--admin-text-muted)] hover:text-white transition-colors cursor-pointer focus:outline-hidden focus-visible:ring-2 focus-visible:ring-[var(--admin-primary)] shrink-0"
        aria-label={`Actions for return claim ${returnItem.id}`}
        aria-haspopup="menu"
        aria-expanded={open}
      >
        <MoreHorizontal size={14} />
      </button>

      <AdminPortal>
        <AnimatePresence>
          {open && (
            <motion.div
              ref={menuRef}
              initial={shouldReduceMotion ? { opacity: 0 } : { opacity: 0, y: initialY }}
              animate={{ opacity: 1, y: 0 }}
              exit={shouldReduceMotion ? { opacity: 0 } : { opacity: 0, y: initialY }}
              transition={{ duration: shouldReduceMotion ? 0 : 0.15, ease: "easeOut" }}
              style={{
                position: "fixed",
                top: position ? `${position.top}px` : "-9999px",
                left: position ? `${position.left}px` : "-9999px",
                maxHeight: position?.maxHeight ? `${position.maxHeight}px` : undefined,
                visibility: position ? "visible" : "hidden",
                zIndex: 9999,
              }}
              className="w-44 bg-[var(--admin-surface)] rounded-[14px] border border-white/10 p-1.5 text-xs font-medium text-white admin-scroll overflow-y-auto overscroll-contain space-y-0.5"
              role="menu"
              aria-label={`Options for return ${returnItem.id}`}
              onClick={(e) => e.stopPropagation()}
            >
              <button
                type="button"
                role="menuitem"
                onClick={() => {
                  setOpen(false);
                  onInspect();
                }}
                className="w-full text-left px-2.5 py-1.5 rounded-[var(--admin-radius-item,10px)] hover:bg-white/10 focus:bg-white/10 focus:outline-hidden flex items-center gap-2 text-white cursor-pointer transition-colors"
              >
                <Eye size={13} className="text-[var(--admin-text-muted)]" />
                <span>Inspect</span>
              </button>

              {returnItem.status === "approved" && (
                <button
                  type="button"
                  role="menuitem"
                  onClick={() => {
                    setOpen(false);
                    onPrintSlip();
                  }}
                  className="w-full text-left px-2.5 py-1.5 rounded-[var(--admin-radius-item,10px)] hover:bg-white/10 focus:bg-white/10 focus:outline-hidden flex items-center gap-2 text-white cursor-pointer transition-colors"
                >
                  <Printer size={13} className="text-[var(--admin-text-muted)]" />
                  <span>Print slip</span>
                </button>
              )}
            </motion.div>
          )}
        </AnimatePresence>
      </AdminPortal>
    </div>
  );
}

const REASON_OPTIONS = [
  { value: "all", label: "All Return Reasons" },
  { value: "size", label: "Size / Fit Mismatch" },
  { value: "defect", label: "Fabric / Stitching Defect" },
  { value: "quality", label: "Quality Dissatisfaction" },
];

export interface ReturnItemRecord {
  id: string;
  orderId: string;
  requestedAt: string;
  dayString: string;
  customerName: string;
  customerPhone: string;
  customerAddress: string;
  customerCity: string;
  reason: string;
  details?: string;
  status: "pending" | "approved" | "rejected";
  refundAmount: number;
  paymentMethod: string;
  carrier: string;
  reverseTrackingNumber: string;
  item: {
    productId: string;
    productName: string;
    imageUrl: string;
    colorName: string;
    selectedSize: string;
    quantity: number;
    price: number;
  };
  rawOrder: OrderRecord;
}

export default function AdminReturnsPage() {
  const { orders, reviewReturnRequest } = useUser();

  // Search & Status filters
  const [searchQuery, setSearchQuery] = useState("");
  const [statusFilter, setStatusFilter] = useState<"all" | "pending" | "approved" | "rejected">("all");
  const [reasonCategoryFilter, setReasonCategoryFilter] = useState<string>("all");

  // Pagination
  const [currentPage, setCurrentPage] = useState(1);
  const PAGE_SIZE = 10;

  // Selected return for deep inspection & review modal
  const [selectedReturn, setSelectedReturn] = useState<ReturnItemRecord | null>(null);
  const [rejectingReturnId, setRejectingReturnId] = useState<string | null>(null);
  const [rejectNote, setRejectNote] = useState("");
  const [approvalNote, setApprovalNote] = useState("");
  const [selectedCarrier, setSelectedCarrier] = useState<string>("BlueDart Reverse Express");

  // Toast
  const [toast, setToast] = useState<{ message: string; type: "success" | "info" } | null>(null);

  const triggerToast = (message: string, type: "success" | "info" = "success") => {
    setToast({ message, type });
    setTimeout(() => {
      setToast((curr) => (curr?.message === message ? null : curr));
    }, 3500);
  };

  // Dynamic calendar date anchors
  const now = new Date();
  const todayIso = `${now.getFullYear()}-${String(now.getMonth() + 1).padStart(2, "0")}-${String(now.getDate()).padStart(2, "0")}`;
  const yDate = new Date(now);
  yDate.setDate(now.getDate() - 1);
  const yesterdayIso = `${yDate.getFullYear()}-${String(yDate.getMonth() + 1).padStart(2, "0")}-${String(yDate.getDate()).padStart(2, "0")}`;
  const months = ["Jan", "Feb", "Mar", "Apr", "May", "Jun", "Jul", "Aug", "Sep", "Oct", "Nov", "Dec"];
  const todayDisplay = `${String(now.getDate()).padStart(2, "0")} ${months[now.getMonth()]} ${now.getFullYear()}`;

  // Comprehensive Date Range & Day-Wise Filter State
  const [dateFilter, setDateFilter] = useState<DateFilterSelection>(() => getAllTimeScope(orders).filter);

  // Extract all return records from live user orders
  const allMasterReturns = useMemo(() => {
    const list: ReturnItemRecord[] = [];

    orders.forEach((o) => {
      const hasReturnReq = !!o.returnRequest;
      const isReturnedStatus = o.status === "Returned" || o.status === "Return Requested";

      if (hasReturnReq || isReturnedStatus) {
        const firstItem = o.items?.[0];
        const reqAt = o.returnRequest?.requestedAt || o.date;
        const dayStr = parseOrderDateToDayString(reqAt);

        const status: "pending" | "approved" | "rejected" = o.returnRequest?.status
          ? o.returnRequest.status
          : o.status === "Returned"
          ? "approved"
          : "pending";

        const reason =
          o.returnRequest?.reason ||
          (o.status === "Returned"
            ? "Size exchange & fit modification"
            : "Customer initiated return request");

        const idSuffix = o.id.replace("VEY-2026-", "");

        list.push({
          id: `RET-${idSuffix}`,
          orderId: o.id,
          requestedAt: reqAt,
          dayString: dayStr,
          customerName: o.shippingAddress?.name || "Verified Customer",
          customerPhone: o.shippingAddress?.phone || "+91 98401 23456",
          customerAddress: o.shippingAddress?.address || "34, Besant Nagar, Chennai, Tamil Nadu",
          customerCity: o.shippingAddress?.address?.split(",")?.slice(-2)?.[0]?.trim() || "Chennai",
          reason,
          details: o.returnRequest?.details || "Customer requested inspection and resolution.",
          status,
          refundAmount: o.total,
          paymentMethod: o.paymentMethod || "card",
          carrier: "BlueDart Reverse Logistics",
          reverseTrackingNumber: `REV-BD-${idSuffix}892`,
          item: {
            productId: firstItem?.productId || "prod-01",
            productName: firstItem?.productName || o.itemNames?.[0] || "Blanc Court Sneaker",
            imageUrl: firstItem?.imageUrl || "/products/shoes/blanc-court-sneaker.webp",
            colorName: firstItem?.colorName || "Triple White",
            selectedSize: firstItem?.selectedSize || "UK 8",
            quantity: firstItem?.quantity || 1,
            price: firstItem?.totalPrice || o.total,
          },
          rawOrder: o,
        });
      }
    });

    return list.sort((a, b) => b.dayString.localeCompare(a.dayString));
  }, [orders]);

  // Aggregate all unique return days chronologically for Day-Wise browsing
  const availableReturnDays = useMemo(() => {
    const dayMap = new Map<string, { date: string; label: string; count: number; totalAmount: number }>();
    allMasterReturns.forEach((r) => {
      const day = r.dayString;
      const existing = dayMap.get(day) || {
        date: day,
        label: formatDayDisplay(day),
        count: 0,
        totalAmount: 0,
      };
      existing.count += 1;
      existing.totalAmount += r.refundAmount;
      dayMap.set(day, existing);
    });
    return Array.from(dayMap.values()).sort((a, b) => b.date.localeCompare(a.date));
  }, [allMasterReturns]);

  // Active day index for previous/next day stepping
  const currentDayIndex = useMemo(() => {
    if (dateFilter.type !== "day") return -1;
    const activeDay = dateFilter.singleDay || dateFilter.startDate;
    return availableReturnDays.findIndex((d) => d.date === activeDay);
  }, [dateFilter, availableReturnDays]);

  const handleStepDay = (direction: "prev" | "next") => {
    if (availableReturnDays.length === 0) return;
    let newIdx = currentDayIndex;
    if (newIdx === -1) {
      newIdx = 0;
    } else if (direction === "prev") {
      newIdx = Math.min(availableReturnDays.length - 1, newIdx + 1);
    } else {
      newIdx = Math.max(0, newIdx - 1);
    }
    const targetDay = availableReturnDays[newIdx];
    if (targetDay) {
      setDateFilter({
        type: "day",
        label: targetDay.label,
        startDate: targetDay.date,
        endDate: targetDay.date,
        singleDay: targetDay.date,
      });
      triggerToast(`Switched to ${targetDay.label} (${targetDay.count} ${targetDay.count === 1 ? "return" : "returns"})`, "info");
    }
  };

  // Filter returns based on Date scope (Till Date vs Day-Wise vs Custom)
  const dateFilteredReturns = useMemo(() => {
    if (dateFilter.type === "all") return allMasterReturns;

    return allMasterReturns.filter((r) => {
      return r.dayString >= dateFilter.startDate && r.dayString <= dateFilter.endDate;
    });
  }, [allMasterReturns, dateFilter]);

  // Further filter returns by search query, status, and reason category
  const filteredReturns = useMemo(() => {
    let list = dateFilteredReturns;

    if (statusFilter !== "all") {
      list = list.filter((r) => r.status === statusFilter);
    }

    if (reasonCategoryFilter !== "all") {
      list = list.filter((r) => {
        const lower = r.reason.toLowerCase();
        if (reasonCategoryFilter === "size") return lower.includes("size") || lower.includes("fit") || lower.includes("tight");
        if (reasonCategoryFilter === "defect") return lower.includes("defect") || lower.includes("stitch") || lower.includes("torn") || lower.includes("damaged");
        if (reasonCategoryFilter === "quality") return lower.includes("quality") || lower.includes("material") || lower.includes("fabric");
        return true;
      });
    }

    if (searchQuery.trim()) {
      const q = searchQuery.toLowerCase().trim();
      const cleanQ = normalizeSearchText(q);
      const strippedQ = stripToAlphaNumeric(q);
      const synonyms = getSynonymsForWord(q);

      list = list.filter((r) => {
        const id = r.id.toLowerCase();
        const orderId = r.orderId.toLowerCase();
        const customerName = r.customerName.toLowerCase();
        const strippedCustomer = stripToAlphaNumeric(r.customerName);
        const pName = r.item.productName.toLowerCase();
        const strippedPName = stripToAlphaNumeric(r.item.productName);
        const reason = r.reason.toLowerCase();

        if (
          id.includes(q) ||
          orderId.includes(q) ||
          customerName.includes(cleanQ) ||
          strippedCustomer.includes(strippedQ) ||
          r.customerPhone.includes(q) ||
          pName.includes(cleanQ) ||
          strippedPName.includes(strippedQ) ||
          reason.includes(cleanQ)
        ) {
          return true;
        }

        // Check synonyms on product name
        for (const syn of synonyms) {
          if (pName.includes(syn) || strippedPName.includes(stripToAlphaNumeric(syn))) {
            return true;
          }
        }

        return false;
      });
    }

    return list;
  }, [dateFilteredReturns, statusFilter, reasonCategoryFilter, searchQuery]);

  // Reset page when filter changes
  useEffect(() => {
    setCurrentPage(1);
  }, [statusFilter, reasonCategoryFilter, searchQuery, dateFilter]);

  // Paginated returns
  const totalPages = Math.max(1, Math.ceil(filteredReturns.length / PAGE_SIZE));
  const displayedReturns = useMemo(() => {
    const start = (currentPage - 1) * PAGE_SIZE;
    return filteredReturns.slice(start, start + PAGE_SIZE);
  }, [filteredReturns, currentPage]);

  // Financial & Operational Metrics for the active returns scope
  const returnMetrics = useMemo(() => {
    const totalClaims = filteredReturns.length;
    const totalClaimValue = filteredReturns.reduce((sum, r) => sum + r.refundAmount, 0);
    const pendingCount = filteredReturns.filter((r) => r.status === "pending").length;
    const approvedCount = filteredReturns.filter((r) => r.status === "approved").length;
    const rejectedCount = filteredReturns.filter((r) => r.status === "rejected").length;
    const approvedValue = filteredReturns
      .filter((r) => r.status === "approved")
      .reduce((sum, r) => sum + r.refundAmount, 0);

    return {
      totalClaims,
      totalClaimValue,
      pendingCount,
      approvedCount,
      rejectedCount,
      approvedValue,
    };
  }, [filteredReturns]);

  // Existing filter reset logic
  const handleResetFilters = () => {
    setStatusFilter("all");
    setReasonCategoryFilter("all");
    setSearchQuery("");
    setDateFilter(getAllTimeScope(orders).filter);
    setCurrentPage(1);
  };

  const dateScope = useMemo(() => getAllTimeScope(orders, dateFilter), [orders, dateFilter]);

  // Handle return review
  const handleApprove = (ret: ReturnItemRecord) => {
    reviewReturnRequest(ret.orderId, "approved", approvalNote || `Approved via Admin Returns Portal. Reverse pickup assigned to ${selectedCarrier}.`);
    triggerToast(`Return ${ret.id} approved! Reverse pickup scheduled with ${selectedCarrier}.`, "success");
    setSelectedReturn(null);
    setApprovalNote("");
  };

  const handleReject = (ret: ReturnItemRecord) => {
    if (!rejectNote.trim()) {
      triggerToast("Please provide a reason for rejecting the return claim", "info");
      return;
    }
    reviewReturnRequest(ret.orderId, "rejected", rejectNote);
    triggerToast(`Return ${ret.id} rejected. Customer notified with note.`, "info");
    setRejectingReturnId(null);
    setSelectedReturn(null);
    setRejectNote("");
  };

  // Export CSV
  const handleExportCSV = () => {
    const headers = ["Return ID", "Order ID", "Customer Name", "Phone", "Product", "Size", "Color", "Refund Amount", "Reason", "Status", "Requested Date"];
    const rows = filteredReturns.map((r) => [
      r.id,
      r.orderId,
      `"${r.customerName}"`,
      r.customerPhone,
      `"${r.item.productName}"`,
      r.item.selectedSize,
      r.item.colorName,
      r.refundAmount,
      `"${r.reason}"`,
      r.status,
      `"${r.requestedAt}"`,
    ]);

    const csvContent = [headers.join(","), ...rows.map((row) => row.join(","))].join("\n");
    const blob = new Blob([csvContent], { type: "text/csv;charset=utf-8;" });
    const url = URL.createObjectURL(blob);
    const link = document.createElement("a");
    link.href = url;
    link.download = `Veyro_Returns_Report_${dateFilter.label.replace(/[^a-zA-Z0-9]/g, "_")}.csv`;
    link.click();
    URL.revokeObjectURL(url);
    triggerToast(`Exported ${filteredReturns.length} return claims as CSV`, "success");
  };

  // Print Slip
  const handlePrintSlip = (ret: ReturnItemRecord) => {
    const printWindow = window.open("", "_blank");
    if (!printWindow) {
      triggerToast("Please allow popups to print return slips", "info");
      return;
    }

    const html = `
      <!DOCTYPE html>
      <html>
        <head>
          <title>Return Authorization & Reverse Slip — ${ret.id}</title>
          <style>
            body { font-family: -apple-system, BlinkMacSystemFont, "Segoe UI", Roboto, sans-serif; padding: 40px; color: #111; max-width: 750px; margin: auto; }
            .header { border-bottom: 2px solid #000; padding-bottom: 16px; margin-bottom: 24px; display: flex; justify-content: space-between; align-items: flex-end; }
            .brand { font-size: 24px; font-weight: 900; letter-spacing: 0.25em; font-family: serif; }
            .badge { background: #facc15; padding: 4px 10px; font-size: 11px; font-weight: bold; border-radius: 6px; }
            .box { border: 1px solid #e5e5e5; border-radius: 12px; padding: 18px; margin-bottom: 20px; background: #fafafa; }
            .grid { display: grid; grid-template-columns: 1fr 1fr; gap: 16px; }
            table { width: 100%; border-collapse: collapse; margin-top: 14px; }
            th, td { text-align: left; padding: 10px; border-bottom: 1px solid #eee; font-size: 13px; }
            th { background: #f0f0f0; font-weight: 600; }
            .barcode { font-family: monospace; font-size: 20px; font-weight: bold; letter-spacing: 5px; text-align: center; padding: 15px; background: #fff; border: 1px dashed #ccc; border-radius: 8px; margin-top: 15px; }
          </style>
        </head>
        <body>
          <div class="header">
            <div>
              <div class="brand">VEYRO</div>
              <div style="font-size: 12px; color: #666; margin-top: 4px;">OFFICIAL REVERSE PICKUP AUTHORIZATION</div>
            </div>
            <div>
              <span class="badge">${ret.id}</span>
            </div>
          </div>

          <div class="box">
            <div class="grid">
              <div>
                <strong>Reverse Pickup From:</strong><br/>
                ${ret.customerName}<br/>
                ${ret.customerAddress}<br/>
                Phone: ${ret.customerPhone}
              </div>
              <div>
                <strong>Return Destination:</strong><br/>
                Veyro Central Fulfillment Center<br/>
                Warehouse Bay #4, Express Logistics Park<br/>
                Chennai, Tamil Nadu — 600096
              </div>
            </div>
          </div>

          <table>
            <thead>
              <tr>
                <th>Item Description</th>
                <th>Color / Size</th>
                <th>Qty</th>
                <th>Refund Value</th>
              </tr>
            </thead>
            <tbody>
              <tr>
                <td>${ret.item.productName}</td>
                <td>${ret.item.colorName} • Size ${ret.item.selectedSize}</td>
                <td>${ret.item.quantity}</td>
                <td>₹${ret.refundAmount.toLocaleString("en-IN")}</td>
              </tr>
            </tbody>
          </table>

          <div style="margin-top: 20px; font-size: 13px;">
            <strong>Reason for Return:</strong> ${ret.reason}<br/>
            <strong>Customer Details:</strong> ${ret.details || "N/A"}<br/>
            <strong>Assigned Courier:</strong> ${ret.carrier}
          </div>

          <div class="barcode">
            |||||||| ${ret.reverseTrackingNumber} ||||||||
          </div>
          <div style="text-align: center; font-size: 11px; color: #888; margin-top: 6px;">
            Present this slip to the courier executive during reverse parcel pickup.
          </div>
        </body>
      </html>
    `;

    printWindow.document.write(html);
    printWindow.document.close();
    printWindow.focus();
    setTimeout(() => {
      printWindow.print();
    }, 400);
    triggerToast(`Generated Reverse Pickup Slip for ${ret.id}`);
  };

  return (
    <div className="space-y-6">
      {/* Toast Notification */}
      {toast && (
        <div className="fixed bottom-6 right-6 z-[9999] animate-in fade-in slide-in-from-bottom-5 duration-200">
          <div className="bg-[var(--admin-surface)] text-white px-4 py-3 rounded-full border border-white/10 flex items-center gap-2.5 text-xs font-semibold">
            {toast.type === "success" ? (
              <CheckCircle2 size={16} className="text-[#00F59B] shrink-0" />
            ) : (
              <Sparkles size={16} className="text-[#F59E0B] shrink-0" />
            )}
            <span>{toast.message}</span>
          </div>
        </div>
      )}

      {/* ── TOP HEADER ── */}
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4">
        <div>
          <h1 className="text-2xl font-bold font-heading text-white tracking-tight">
            Returns
          </h1>
          <p className="text-xs text-[var(--admin-text-muted)] mt-1">
            {`${filteredReturns.length} ${filteredReturns.length === 1 ? "claim" : "claims"} · ${dateScope.label}`}
          </p>
        </div>

        {/* Right side: one "Export CSV" secondary pill button */}
        <div className="flex items-center shrink-0">
          <button
            type="button"
            onClick={handleExportCSV}
            className="flex items-center gap-1.5 px-4 py-2 rounded-full bg-[var(--admin-surface)] border border-white/10 hover:bg-[var(--admin-elevated)] text-white text-xs font-semibold transition-all cursor-pointer focus-visible:outline-hidden focus-visible:ring-2 focus-visible:ring-[var(--admin-primary)]"
            title="Download complete returns dataset as CSV"
          >
            <Download size={13} className="text-[var(--admin-text-muted)]" />
            <span>Export CSV</span>
          </button>
        </div>
      </div>

      {/* ── HIGH-LEVEL 4-CARD FINANCIAL & OPERATIONAL RIBBON ── */}
      <div className="grid grid-cols-2 lg:grid-cols-4 gap-3 sm:gap-4">
        {/* Card 1: Total Return Value */}
        <div className="bg-[var(--admin-surface)] rounded-2xl p-5 border border-white/5 hover:border-white/10 transition-all flex flex-col justify-between min-h-[116px]">
          <div className="flex items-center justify-between">
            <span className="text-[11px] font-bold uppercase tracking-wider text-[var(--admin-text-muted)] truncate">
              Total Return Value
            </span>
            <span className="text-[10px] font-semibold text-white/50 px-2 py-0.5 rounded-full bg-white/5 border border-white/10">
              Total
            </span>
          </div>
          <div>
            <div className="text-2xl font-heading font-bold tabular-nums text-white leading-none">
              ₹{returnMetrics.totalClaimValue.toLocaleString("en-IN")}
            </div>
            <div className="text-xs text-[var(--admin-text-muted)] mt-1.5 truncate">
              {returnMetrics.totalClaims} {returnMetrics.totalClaims === 1 ? "claim" : "claims"} tracked across active scope
            </div>
          </div>
        </div>

        {/* Card 2: Pending Review */}
        <div className="bg-[var(--admin-surface)] rounded-2xl p-5 border border-white/5 hover:border-white/10 transition-all flex flex-col justify-between min-h-[116px]">
          <div className="flex items-center justify-between">
            <span className="text-[11px] font-bold uppercase tracking-wider text-[var(--admin-text-muted)] truncate">
              Pending Review
            </span>
            {returnMetrics.pendingCount > 0 ? (
              <span className="text-[10px] font-semibold text-amber-300 bg-amber-400/10 border border-amber-400/25 px-2 py-0.5 rounded-full flex items-center gap-1.5">
                <span className="w-1.5 h-1.5 rounded-full bg-amber-400 animate-pulse" />
                Action
              </span>
            ) : (
              <span className="text-[10px] font-medium text-white/40 px-2 py-0.5 rounded-full bg-white/5 border border-white/10">
                Clear
              </span>
            )}
          </div>
          <div>
            <div className="text-2xl font-heading font-bold tabular-nums text-white leading-none">
              {returnMetrics.pendingCount}
            </div>
            <div className="text-xs text-[var(--admin-text-muted)] mt-1.5 truncate">
              {returnMetrics.pendingCount > 0 ? "Awaiting admin inspection & decision" : "Zero pending backlogs"}
            </div>
          </div>
        </div>

        {/* Card 3: Approved & Scheduled */}
        <div className="bg-[var(--admin-surface)] rounded-2xl p-5 border border-white/5 hover:border-white/10 transition-all flex flex-col justify-between min-h-[116px]">
          <div className="flex items-center justify-between">
            <span className="text-[11px] font-bold uppercase tracking-wider text-[var(--admin-text-muted)] truncate">
              Approved &amp; Scheduled
            </span>
            {returnMetrics.approvedCount > 0 ? (
              <span className="text-[10px] font-semibold text-emerald-300 bg-emerald-400/10 border border-emerald-400/25 px-2 py-0.5 rounded-full flex items-center gap-1.5">
                <span className="w-1.5 h-1.5 rounded-full bg-emerald-400" />
                Scheduled
              </span>
            ) : (
              <span className="text-[10px] font-medium text-white/40 px-2 py-0.5 rounded-full bg-white/5 border border-white/10">
                0 Dispatched
              </span>
            )}
          </div>
          <div>
            <div className="text-2xl font-heading font-bold tabular-nums text-white leading-none">
              {returnMetrics.approvedCount}
            </div>
            <div className="text-xs text-[var(--admin-text-muted)] mt-1.5 truncate">
              ₹{returnMetrics.approvedValue.toLocaleString("en-IN")} reverse dispatched
            </div>
          </div>
        </div>

        {/* Card 4: Rejected Claims */}
        <div className="bg-[var(--admin-surface)] rounded-2xl p-5 border border-white/5 hover:border-white/10 transition-all flex flex-col justify-between min-h-[116px]">
          <div className="flex items-center justify-between">
            <span className="text-[11px] font-bold uppercase tracking-wider text-[var(--admin-text-muted)] truncate">
              Rejected Claims
            </span>
            {returnMetrics.rejectedCount > 0 ? (
              <span className="text-[10px] font-semibold text-rose-300 bg-rose-400/10 border border-rose-400/25 px-2 py-0.5 rounded-full flex items-center gap-1.5">
                <span className="w-1.5 h-1.5 rounded-full bg-rose-400" />
                Voided
              </span>
            ) : (
              <span className="text-[10px] font-medium text-white/40 px-2 py-0.5 rounded-full bg-white/5 border border-white/10">
                0 Voided
              </span>
            )}
          </div>
          <div>
            <div className="text-2xl font-heading font-bold tabular-nums text-white leading-none">
              {returnMetrics.rejectedCount}
            </div>
            <div className="text-xs text-[var(--admin-text-muted)] mt-1.5 truncate">
              Closed claims (out of policy or mismatch)
            </div>
          </div>
        </div>
      </div>

      {/* ── TOOLBAR ON CANVAS (ONE ROW, STACKS BELOW MD) ── */}
      <div className="flex flex-col md:flex-row md:items-center justify-between gap-3">
        {/* Left: Status tabs as pills */}
        <div className="flex items-center gap-1.5 overflow-x-auto admin-scroll pb-1 md:pb-0 shrink-0 w-full md:w-auto">
          {[
            { id: "all", label: "All Returns", count: dateFilteredReturns.length },
            {
              id: "pending",
              label: "Pending Review",
              count: dateFilteredReturns.filter((r) => r.status === "pending").length,
            },
            {
              id: "approved",
              label: "Approved",
              count: dateFilteredReturns.filter((r) => r.status === "approved").length,
            },
            {
              id: "rejected",
              label: "Rejected",
              count: dateFilteredReturns.filter((r) => r.status === "rejected").length,
            },
          ].map((tab) => {
            const active = statusFilter === tab.id;
            return (
              <button
                key={tab.id}
                type="button"
                onClick={() => setStatusFilter(tab.id as typeof statusFilter)}
                className={`px-3.5 py-1.5 rounded-full text-xs transition-colors cursor-pointer whitespace-nowrap focus-visible:outline-hidden focus-visible:ring-2 focus-visible:ring-[var(--admin-primary)] ${
                  active
                    ? "bg-[var(--admin-elevated)] text-white border border-white/10 font-semibold"
                    : "text-[var(--admin-text-muted)] hover:text-white hover:bg-white/[0.04] border border-transparent font-medium"
                }`}
              >
                <span>{tab.label}</span>
                <span className="ml-1.5 text-[11px] tabular-nums text-[var(--admin-text-muted)] font-mono">
                  {tab.count}
                </span>
              </button>
            );
          })}
        </div>

        {/* Right: Search, Reason Filter, Date Range Picker */}
        <div className="flex flex-col sm:flex-row sm:items-center gap-2.5 w-full md:w-auto">
          {/* Search */}
          <div className="relative w-full sm:w-64">
            <Search
              size={14}
              className="absolute left-3.5 top-1/2 -translate-y-1/2 text-[var(--admin-text-muted)] pointer-events-none"
            />
            <input
              type="text"
              value={searchQuery}
              onChange={(e) => setSearchQuery(e.target.value)}
              placeholder="Search returns..."
              aria-label="Search returns"
              className="w-full pl-9 pr-8 py-2 rounded-[14px] bg-[var(--admin-surface)] border border-white/10 text-xs text-white placeholder:text-[var(--admin-text-muted)] focus:outline-hidden focus:border-[var(--admin-primary)] focus:ring-1 focus:ring-[var(--admin-primary)] transition-all"
            />
            {searchQuery && (
              <button
                type="button"
                onClick={() => setSearchQuery("")}
                aria-label="Clear search"
                className="absolute right-2.5 top-1/2 -translate-y-1/2 text-[var(--admin-text-muted)] hover:text-white cursor-pointer"
              >
                <X size={12} />
              </button>
            )}
          </div>

          {/* Reason Filter */}
          <AdminSelect
            value={reasonCategoryFilter}
            onValueChange={setReasonCategoryFilter}
            options={REASON_OPTIONS}
            className="w-full sm:w-48"
            triggerClassName="h-9 text-xs rounded-[14px] bg-[var(--admin-surface)] border-white/10"
            aria-label="Filter returns by reason"
          />

          {/* Date Range Trigger */}
          <AdminDateRangePicker
            currentFilter={dateFilter}
            onSelectFilter={(newFilter) => {
              setDateFilter(newFilter);
              triggerToast(`Date filter applied: ${newFilter.label}`, "info");
            }}
            orders={orders}
            compact={true}
            align="right"
            className="w-full sm:w-auto shrink-0"
            customTriggerLabel={dateScope.label}
          />
        </div>
      </div>

      {/* ── RETURNS MASTER TABLE CARD ── */}
      <div className="bg-[var(--admin-surface)] rounded-[28px] border border-white/5 overflow-hidden">
        {filteredReturns.length === 0 ? (
          <EmptyState
            icon={RotateCcw}
            title="No return requests found"
            description="No returns match your active date scope, reason, or search query."
            actionLabel="Clear filters"
            onAction={handleResetFilters}
          />
        ) : (
          <div className="overflow-x-auto admin-scroll">
            <table className="w-full min-w-[700px] xl:min-w-full table-fixed text-left border-collapse" role="table">
              <thead>
                <tr className="border-b border-white/5 text-[11px] font-semibold uppercase tracking-wider text-[var(--admin-text-muted)] bg-[var(--admin-surface-2)]">
                  <th className="pl-5 pr-2.5 py-3 w-[130px] whitespace-nowrap">Return</th>
                  <th className="px-2.5 py-3 w-[130px] whitespace-nowrap">Customer</th>
                  <th className="px-2.5 py-3 w-[210px] whitespace-nowrap">Item</th>
                  <th className="px-2.5 py-3 whitespace-nowrap">Reason</th>
                  <th className="pl-2.5 pr-5 py-3 w-[100px] text-right whitespace-nowrap">Refund</th>
                  <th className="pl-5 pr-2.5 py-3 w-[110px] whitespace-nowrap">Status</th>
                  <th className="px-2.5 py-3 w-[110px] whitespace-nowrap hidden 2xl:table-cell">Requested</th>
                  <th className="pl-2.5 pr-5 py-3 w-[124px] text-right whitespace-nowrap">
                    <span className="sr-only">Actions</span>
                  </th>
                </tr>
              </thead>
              <tbody className="divide-y divide-white/5">
                {displayedReturns.map((ret) => {
                  return (
                    <tr
                      key={ret.id}
                      onClick={() => setSelectedReturn(ret)}
                      className="h-16 border-b border-white/5 hover:bg-white/[0.03] transition-colors duration-150 cursor-pointer group"
                    >
                      {/* 1. Return: ID in font-mono white, below it order number in muted mono 11px */}
                      <td className="pl-5 pr-2.5 py-3 align-middle">
                        <div className="flex flex-col min-w-0">
                          <span className="text-xs font-mono font-bold text-white select-all truncate">
                            {ret.id}
                          </span>
                          <span className="text-[11px] font-mono text-[var(--admin-text-muted)] mt-0.5 truncate">
                            {ret.orderId}
                          </span>
                        </div>
                      </td>

                      {/* 2. Customer: name in white, city below in muted (hidden below lg) */}
                      <td className="px-2.5 py-3 align-middle">
                        <div className="flex flex-col min-w-0">
                          <span className="text-xs font-semibold text-white truncate">
                            {ret.customerName}
                          </span>
                          <span className="text-[11px] text-[var(--admin-text-muted)] mt-0.5 truncate hidden lg:block">
                            {ret.customerCity}
                          </span>
                        </div>
                      </td>

                      {/* 3. Item: 40px thumbnail, product name, Color · Size · xQty below in muted (hidden below lg) */}
                      <td className="px-2.5 py-3 align-middle">
                        <div className="flex items-center gap-2.5 min-w-0">
                          <div className="w-10 h-10 rounded-[14px] bg-[var(--admin-surface-2)] border border-white/10 overflow-hidden shrink-0 flex items-center justify-center">
                            <Image
                              src={ret.item.imageUrl}
                              alt={ret.item.productName}
                              width={40}
                              height={40}
                              className="w-full h-full object-cover"
                            />
                          </div>
                          <div className="flex flex-col min-w-0">
                            <span className="text-xs sm:text-[13px] font-semibold text-white truncate" title={ret.item.productName}>
                              {ret.item.productName}
                            </span>
                            <span className="text-[11px] text-[var(--admin-text-muted)] mt-0.5 truncate hidden lg:block">
                              {ret.item.colorName} · Size {ret.item.selectedSize} · x{ret.item.quantity}
                            </span>
                          </div>
                        </div>
                      </td>

                      {/* 4. Reason: line 1 reason in white; line 2 customer feedback in muted, line-clamp-1 */}
                      <td className="px-2.5 py-3 align-middle">
                        <div className="flex flex-col min-w-0" title={ret.details ? `${ret.reason} — ${ret.details}` : ret.reason}>
                          <span className="text-xs font-medium text-white truncate">
                            {ret.reason}
                          </span>
                          {ret.details ? (
                            <span className="text-[11px] text-[var(--admin-text-muted)] line-clamp-1 mt-0.5">
                              {ret.details}
                            </span>
                          ) : (
                            <span className="text-[11px] text-[var(--admin-text-muted)] mt-0.5">
                              No additional feedback
                            </span>
                          )}
                        </div>
                      </td>

                      {/* 5. Refund: font-heading font-bold tabular-nums right-aligned; payment method below in muted */}
                      <td className="pl-2.5 pr-5 py-3 align-middle text-right">
                        <div className="flex flex-col items-end min-w-0">
                          <span className="text-xs sm:text-[13px] font-heading font-bold tabular-nums text-white">
                            ₹{ret.refundAmount.toLocaleString("en-IN")}
                          </span>
                          <span className="text-[11px] text-[var(--admin-text-muted)] mt-0.5 capitalize truncate">
                            {ret.paymentMethod || "Card"}
                          </span>
                        </div>
                      </td>

                      {/* 6. Status: 8px dot (token color) plus plain text */}
                      <td className="pl-5 pr-2.5 py-3 align-middle">
                        <div className="flex items-center gap-2">
                          <span
                            className={`w-2 h-2 rounded-full shrink-0 ${
                              ret.status === "pending"
                                ? "bg-[var(--admin-warning)]"
                                : ret.status === "approved"
                                ? "bg-[var(--admin-success)]"
                                : "bg-[var(--admin-danger)]"
                            }`}
                            aria-hidden="true"
                          />
                          <span className="text-xs font-medium text-white whitespace-nowrap">
                            {ret.status === "pending" ? "Pending" : ret.status === "approved" ? "Approved" : "Rejected"}
                          </span>
                        </div>
                      </td>

                      {/* 7. Requested: date in white, time below in muted (hidden below 2xl) */}
                      <td className="px-2.5 py-3 align-middle hidden 2xl:table-cell">
                        <div className="flex flex-col min-w-0">
                          <span className="text-xs font-medium text-white truncate">
                            {ret.requestedAt.includes(",") ? ret.requestedAt.split(",")[0].trim() : ret.requestedAt}
                          </span>
                          <span className="text-[11px] text-[var(--admin-text-muted)] mt-0.5 truncate">
                            {ret.requestedAt.includes(",") ? ret.requestedAt.split(",")[1].trim() : "Recorded"}
                          </span>
                        </div>
                      </td>

                      {/* 8. Actions: Review/View button + ••• menu */}
                      <td className="pl-2.5 pr-5 py-3 align-middle text-right" onClick={(e) => e.stopPropagation()}>
                        <div className="flex items-center justify-end gap-1.5">
                          <button
                            type="button"
                            onClick={(e) => {
                              e.stopPropagation();
                              setSelectedReturn(ret);
                            }}
                            aria-label={`${ret.status === "pending" ? "Review" : "View"} return ${ret.id}`}
                            className="h-8 px-3 rounded-full bg-[var(--admin-surface)] hover:bg-[var(--admin-elevated)] border border-white/10 text-white text-xs font-semibold transition-all cursor-pointer focus-visible:outline-hidden focus-visible:ring-2 focus-visible:ring-[var(--admin-primary)] shrink-0"
                          >
                            {ret.status === "pending" ? "Review" : "View"}
                          </button>
                          <ReturnRowMenu
                            returnItem={ret}
                            onInspect={() => setSelectedReturn(ret)}
                            onPrintSlip={() => handlePrintSlip(ret)}
                          />
                        </div>
                      </td>
                    </tr>
                  );
                })}
              </tbody>
            </table>
          </div>
        )}

        {/* ── TABLE FOOTER WITH PAGINATION ── */}
        {filteredReturns.length > 0 && (
          <div className="p-4 sm:px-5 sm:py-4 bg-[var(--admin-surface-2)] border-t border-white/5 flex items-center justify-between gap-3">
            <div className="text-xs text-[var(--admin-text-muted)]">
              Showing{" "}
              <span className="tabular-nums font-mono text-white">
                {(currentPage - 1) * PAGE_SIZE + 1}
              </span>
              –
              <span className="tabular-nums font-mono text-white">
                {Math.min(currentPage * PAGE_SIZE, filteredReturns.length)}
              </span>{" "}
              of{" "}
              <span className="tabular-nums font-mono text-white">
                {filteredReturns.length}
              </span>
            </div>

            {totalPages > 1 && (
              <div className="flex items-center gap-1">
                <button
                  type="button"
                  onClick={() => setCurrentPage((p) => Math.max(1, p - 1))}
                  disabled={currentPage === 1}
                  className="p-1.5 rounded-full border border-white/10 text-[var(--admin-text-muted)] hover:text-white hover:bg-white/5 disabled:opacity-30 disabled:pointer-events-none cursor-pointer focus-visible:outline-hidden focus-visible:ring-1 focus-visible:ring-[var(--admin-primary)]"
                  aria-label="Previous Page"
                >
                  <ChevronLeft size={13} />
                </button>
                {Array.from({ length: totalPages }).map((_, i) => {
                  const pageNum = i + 1;
                  return (
                    <button
                      key={pageNum}
                      type="button"
                      onClick={() => setCurrentPage(pageNum)}
                      className={`w-6 h-6 rounded-full text-xs font-semibold flex items-center justify-center transition-all cursor-pointer font-mono tabular-nums focus-visible:outline-hidden focus-visible:ring-1 focus-visible:ring-[var(--admin-primary)] ${
                        currentPage === pageNum
                          ? "bg-[var(--admin-elevated)] text-white border border-white/10 font-bold"
                          : "text-[var(--admin-text-muted)] hover:text-white hover:bg-white/5"
                      }`}
                      aria-label={`Page ${pageNum}`}
                      aria-current={currentPage === pageNum ? "page" : undefined}
                    >
                      {pageNum}
                    </button>
                  );
                })}
                <button
                  type="button"
                  onClick={() => setCurrentPage((p) => Math.min(totalPages, p + 1))}
                  disabled={currentPage === totalPages}
                  className="p-1.5 rounded-full border border-white/10 text-[var(--admin-text-muted)] hover:text-white hover:bg-white/5 disabled:opacity-30 disabled:pointer-events-none cursor-pointer focus-visible:outline-hidden focus-visible:ring-1 focus-visible:ring-[var(--admin-primary)]"
                  aria-label="Next Page"
                >
                  <ChevronRight size={13} />
                </button>
              </div>
            )}
          </div>
        )}
      </div>

      {/* ── DEEP INSPECTION & REVIEW MODAL ── */}
      {selectedReturn && (
        <div
          className="fixed inset-0 z-[10000] bg-black/75 backdrop-blur-xs flex items-center justify-center p-4 animate-in fade-in duration-200"
          onClick={() => {
            setSelectedReturn(null);
            setRejectingReturnId(null);
          }}
        >
          <div
            className="w-full max-w-2xl bg-[var(--admin-surface)] rounded-[28px] border border-white/10 overflow-hidden flex flex-col max-h-[90vh] shadow-2xl"
            onClick={(e) => e.stopPropagation()}
            data-lenis-prevent
          >
            {/* Modal Header */}
            <div className="p-6 pb-4 border-b border-white/5 flex items-center justify-between">
              <div>
                <div className="flex items-center gap-2">
                  <span className="text-[10px] font-extrabold uppercase tracking-wider text-violet-400 bg-violet-500/15 border border-violet-500/30 px-2.5 py-0.5 rounded-full">
                    Return Request
                  </span>
                  <span
                    className={`text-[10px] font-semibold uppercase tracking-wider px-2.5 py-0.5 rounded-full border flex items-center gap-1.5 ${
                      selectedReturn.status === "pending"
                        ? "bg-amber-400/10 text-amber-300 border-amber-400/25"
                        : selectedReturn.status === "approved"
                        ? "bg-emerald-400/10 text-emerald-300 border-emerald-400/25"
                        : "bg-rose-400/10 text-rose-300 border-rose-400/25"
                    }`}
                  >
                    <span
                      className={`w-1.5 h-1.5 rounded-full ${
                        selectedReturn.status === "pending"
                          ? "bg-amber-400"
                          : selectedReturn.status === "approved"
                          ? "bg-emerald-400"
                          : "bg-rose-400"
                      }`}
                    />
                    <span>{selectedReturn.status.toUpperCase()}</span>
                  </span>
                </div>
                <h3 className="text-xl font-bold font-mono text-white mt-1.5 flex items-center gap-2">
                  <span>{selectedReturn.id}</span>
                  <span className="text-xs font-normal font-sans text-[var(--admin-text-muted)]">
                    • Order #{selectedReturn.orderId}
                  </span>
                </h3>
              </div>

              <button
                type="button"
                onClick={() => {
                  setSelectedReturn(null);
                  setRejectingReturnId(null);
                }}
                className="w-8 h-8 rounded-full flex items-center justify-center hover:bg-white/5 text-[var(--admin-text-muted)] hover:text-white transition-colors cursor-pointer"
                aria-label="Close"
              >
                <X size={18} />
              </button>
            </div>

            {/* Content Body */}
            <div className="p-6 space-y-4 overflow-y-auto flex-1 admin-scroll text-xs">
              {/* Status Outcome Banner - Clean Luxury Dark Surface */}
              {selectedReturn.status === "approved" ? (
                <div className="p-3.5 rounded-xl bg-[var(--admin-surface-2)] border border-white/5 flex items-center gap-3">
                  <div className="w-8 h-8 rounded-lg bg-emerald-500/10 border border-emerald-500/20 flex items-center justify-center text-emerald-400 shrink-0">
                    <CheckCircle2 size={16} />
                  </div>
                  <div className="flex-1 min-w-0">
                    <div className="font-semibold text-xs text-white">Reverse Pickup Dispatched</div>
                    <div className="text-[11px] text-[var(--admin-text-muted)] mt-0.5">
                      Assigned Carrier: <strong className="text-white">{selectedCarrier || "BlueDart Reverse Express"}</strong> • Scheduled for customer pickup
                    </div>
                  </div>
                </div>
              ) : selectedReturn.status === "rejected" ? (
                <div className="p-3.5 rounded-xl bg-[var(--admin-surface-2)] border border-white/5 flex items-center gap-3">
                  <div className="w-8 h-8 rounded-lg bg-white/[0.04] border border-white/10 flex items-center justify-center text-rose-400 shrink-0">
                    <XCircle size={16} />
                  </div>
                  <div className="flex-1 min-w-0">
                    <div className="font-semibold text-xs text-white">Return Request Closed &amp; Voided</div>
                    <div className="text-[11px] text-[var(--admin-text-muted)] mt-0.5">
                      Claim closed per policy guidelines. Customer notified.
                    </div>
                  </div>
                </div>
              ) : (
                <div className="p-3.5 rounded-xl bg-[var(--admin-surface-2)] border border-white/5 flex items-center gap-3">
                  <div className="w-8 h-8 rounded-lg bg-amber-500/10 border border-amber-500/20 flex items-center justify-center text-amber-400 shrink-0">
                    <Clock size={16} />
                  </div>
                  <div className="flex-1 min-w-0">
                    <div className="font-semibold text-xs text-white">Pending Return Inspection</div>
                    <div className="text-[11px] text-[var(--admin-text-muted)] mt-0.5">
                      Awaiting courier assignment • Action required within 24h SLA
                    </div>
                  </div>
                </div>
              )}

              {/* Product Info Card */}
              <div className="p-4 rounded-xl bg-[var(--admin-surface-2)] border border-white/5 flex items-center justify-between gap-4">
                <div className="flex items-center gap-3.5 min-w-0">
                  <div className="w-14 h-14 rounded-[12px] bg-black/40 border border-white/10 overflow-hidden shrink-0 flex items-center justify-center">
                    <Image
                      src={selectedReturn.item.imageUrl}
                      alt={selectedReturn.item.productName}
                      width={56}
                      height={56}
                      className="w-full h-full object-cover"
                    />
                  </div>
                  <div className="min-w-0">
                    <h4 className="font-semibold text-sm text-white truncate">{selectedReturn.item.productName}</h4>
                    <div className="text-xs text-[var(--admin-text-muted)] mt-1 flex items-center gap-2">
                      <span>Color: <strong className="text-white font-medium">{selectedReturn.item.colorName}</strong></span>
                      <span>•</span>
                      <span>Size: <strong className="text-white font-medium">{selectedReturn.item.selectedSize}</strong></span>
                      <span>•</span>
                      <span>Qty: <strong className="text-white font-medium">{selectedReturn.item.quantity}</strong></span>
                    </div>
                  </div>
                </div>

                <div className="text-right shrink-0">
                  <span className="text-[10px] uppercase tracking-wider font-semibold text-[var(--admin-text-muted)] block">
                    Refund Value
                  </span>
                  <span className="text-lg font-heading font-bold text-white tabular-nums block mt-0.5">
                    ₹{selectedReturn.refundAmount.toLocaleString("en-IN")}
                  </span>
                  <span className="text-[10.5px] text-[var(--admin-text-muted)] mt-0.5 block">
                    Original payment ({selectedReturn.paymentMethod.toUpperCase()})
                  </span>
                </div>
              </div>

              {/* Customer & Address Details */}
              <div className="grid grid-cols-1 sm:grid-cols-2 gap-3 text-xs">
                <div className="p-4 rounded-xl border border-white/5 bg-[var(--admin-surface-2)] space-y-1.5">
                  <div className="font-semibold uppercase tracking-wider text-[var(--admin-text-muted)] text-[10px]">
                    Customer
                  </div>
                  <div className="font-semibold text-sm text-white">{selectedReturn.customerName}</div>
                  <div className="text-[var(--admin-text-muted)] text-xs font-mono">
                    {selectedReturn.customerPhone}
                  </div>
                </div>

                <div className="p-4 rounded-xl border border-white/5 bg-[var(--admin-surface-2)] space-y-1.5">
                  <div className="font-semibold uppercase tracking-wider text-[var(--admin-text-muted)] text-[10px] flex items-center justify-between">
                    <span>Pickup Destination</span>
                    <span className="text-[var(--admin-text-muted)] font-normal normal-case">{selectedReturn.requestedAt}</span>
                  </div>
                  <div className="text-white/90 leading-relaxed font-medium">
                    {selectedReturn.customerAddress}
                  </div>
                </div>
              </div>

              {/* Customer Claim Reason & Admin Rejection Note */}
              <div className="p-4 rounded-xl bg-[var(--admin-surface-2)] border border-white/5 space-y-2.5">
                <div className="flex items-center justify-between">
                  <div className="font-semibold uppercase tracking-wider text-[var(--admin-text-muted)] text-[10px]">
                    Return Claim Reason
                  </div>
                  <span className="text-[11px] font-semibold text-white px-2.5 py-0.5 rounded-full bg-white/5 border border-white/10">
                    {selectedReturn.reason}
                  </span>
                </div>
                {selectedReturn.status === "rejected" ? (
                  <div className="mt-2.5 p-3 rounded-xl bg-black/40 border border-white/5 text-xs flex items-start gap-2.5">
                    <div className="w-5 h-5 rounded-md bg-rose-500/10 text-rose-400 flex items-center justify-center shrink-0 mt-0.5">
                      <XCircle size={12} />
                    </div>
                    <div className="space-y-0.5">
                      <div className="text-[10px] font-semibold uppercase tracking-wider text-[var(--admin-text-muted)]">
                        Policy Decision Note
                      </div>
                      <p className="text-white/90 leading-relaxed font-medium">
                        {selectedReturn.details || "Exceeded return window"}
                      </p>
                    </div>
                  </div>
                ) : selectedReturn.details ? (
                  <div className="mt-2.5 p-3 rounded-xl bg-black/30 border border-white/5 text-xs">
                    <span className="text-[10px] font-semibold uppercase tracking-wider text-[var(--admin-text-muted)] block mb-1">
                      Customer Remark
                    </span>
                    <p className="leading-relaxed text-white/90 font-medium">{selectedReturn.details}</p>
                  </div>
                ) : null}
              </div>

              {/* Courier Selection if approving */}
              {selectedReturn.status === "pending" && (
                <div className="p-4 rounded-xl bg-[var(--admin-surface-2)] border border-white/5 space-y-3">
                  <div className="flex items-center justify-between">
                    <span className="font-semibold uppercase tracking-wider text-[var(--admin-text-muted)] text-[10px]">
                      Assign Reverse Logistics Courier
                    </span>
                    <span className="text-[10px] font-semibold text-violet-400 px-2.5 py-0.5 rounded-full bg-violet-500/10 border border-violet-500/20">
                      {selectedCarrier ? selectedCarrier.split(" ")[0] : "Select Carrier"}
                    </span>
                  </div>

                  <div className="grid grid-cols-3 gap-2.5">
                    {[
                      { name: "BlueDart", fullName: "BlueDart Reverse Express" },
                      { name: "Delhivery", fullName: "Delhivery Return Network" },
                      { name: "Shadowfax", fullName: "Shadowfax Speed Pickup" },
                    ].map((c) => {
                      const active = selectedCarrier === c.fullName;
                      return (
                        <button
                          key={c.fullName}
                          type="button"
                          onClick={() => setSelectedCarrier(c.fullName)}
                          className={`p-3 rounded-xl border text-center transition-all cursor-pointer flex flex-col items-center justify-center gap-1 ${
                            active
                              ? "bg-violet-500/15 border-violet-500/40 text-white font-semibold shadow-xs"
                              : "bg-black/30 border-white/5 text-[var(--admin-text-muted)] hover:text-white hover:bg-white/5"
                          }`}
                        >
                          <span className="text-xs font-semibold">{c.name}</span>
                          <span className={`text-[10px] ${active ? "text-violet-300 font-medium" : "text-[var(--admin-text-muted)]"}`}>
                            {active ? "Selected" : "Available"}
                          </span>
                        </button>
                      );
                    })}
                  </div>

                  {rejectingReturnId === selectedReturn.id && (
                    <div className="space-y-2.5 p-3.5 rounded-xl bg-black/40 border border-white/10 animate-in fade-in">
                      <div className="flex items-center justify-between">
                        <span className="text-xs font-semibold text-rose-400">
                          Rejection Reason Note:
                        </span>
                        <span className="text-[10px] text-[var(--admin-text-muted)]">Sent to customer notification</span>
                      </div>
                      <textarea
                        value={rejectNote}
                        onChange={(e) => setRejectNote(e.target.value)}
                        placeholder="e.g. Return window expired, item tags removed, or damage mismatch..."
                        rows={3}
                        className="w-full p-3 rounded-xl bg-[var(--admin-surface)] border border-white/10 text-xs text-white placeholder-[var(--admin-text-muted)] focus:outline-none focus:border-rose-400/50 transition-all"
                      />
                      <div className="flex items-center justify-end gap-2">
                        <button
                          type="button"
                          onClick={() => setRejectingReturnId(null)}
                          className="px-3.5 py-1.5 rounded-xl border border-white/10 text-[var(--admin-text-muted)] hover:text-white hover:bg-white/5 text-xs font-medium cursor-pointer"
                        >
                          Cancel
                        </button>
                        <button
                          type="button"
                          onClick={() => handleReject(selectedReturn)}
                          className="px-4 py-1.5 rounded-xl bg-rose-600 hover:bg-rose-500 text-white font-medium text-xs transition-colors cursor-pointer"
                        >
                          Confirm Rejection
                        </button>
                      </div>
                    </div>
                  )}
                </div>
              )}
            </div>

            {/* Modal Footer Actions */}
            <div className="p-5 border-t border-white/5 flex items-center justify-between gap-3 bg-[var(--admin-surface-2)]/40">
              <div>
                {selectedReturn.status === "approved" ? (
                  <button
                    type="button"
                    onClick={() => handlePrintSlip(selectedReturn)}
                    className="flex items-center gap-1.5 px-4 py-2 rounded-xl bg-white/5 hover:bg-white/10 border border-white/10 text-white/80 font-medium text-xs transition-all cursor-pointer"
                  >
                    <Printer size={13} />
                    <span>Print Return Voucher</span>
                  </button>
                ) : (
                  <span className="text-[11px] text-[var(--admin-text-muted)]">
                    {selectedReturn.status === "pending"
                      ? "Voucher generated upon approval"
                      : "Claim closed"}
                  </span>
                )}
              </div>

              <div className="flex items-center gap-2">
                {selectedReturn.status === "pending" && !rejectingReturnId && (
                  <>
                    <button
                      type="button"
                      onClick={() => setRejectingReturnId(selectedReturn.id)}
                      className="px-4 py-2 rounded-xl border border-white/10 hover:border-rose-500/40 hover:bg-rose-500/10 text-white/70 hover:text-rose-400 font-medium text-xs transition-colors cursor-pointer"
                    >
                      Reject Claim
                    </button>
                    <button
                      type="button"
                      onClick={() => handleApprove(selectedReturn)}
                      className="px-4 py-2 rounded-xl bg-emerald-500 hover:bg-emerald-400 text-zinc-950 font-semibold text-xs transition-colors cursor-pointer flex items-center gap-1.5 shadow-xs"
                    >
                      <Check size={14} strokeWidth={2.5} />
                      <span>Approve &amp; Dispatch</span>
                    </button>
                  </>
                )}
                <button
                  type="button"
                  onClick={() => {
                    setSelectedReturn(null);
                    setRejectingReturnId(null);
                  }}
                  className="px-4 py-2 rounded-xl bg-white/5 hover:bg-white/10 border border-white/10 text-white/90 font-medium text-xs transition-colors cursor-pointer"
                >
                  Close
                </button>
              </div>
            </div>
          </div>
        </div>
      )}
    </div>
  );
}
