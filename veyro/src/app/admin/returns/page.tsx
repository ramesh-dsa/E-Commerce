"use client";

import React, { useState, useMemo, useEffect } from "react";
import Link from "next/link";
import Image from "next/image";
import { useUser } from "@/context/UserContext";
import type { OrderRecord } from "@/types";
import {
  AdminDateRangePicker,
  DateFilterSelection,
  parseOrderDateToDayString,
  formatDayDisplay,
} from "@/components/admin/AdminDateRangePicker";
import {
  RotateCcw,
  CheckCircle2,
  XCircle,
  Clock,
  Truck,
  IndianRupee,
  Search,
  CalendarDays,
  ChevronLeft,
  ChevronRight,
  ArrowRight,
  Download,
  Printer,
  Sparkles,
  ExternalLink,
  Eye,
  Check,
  X,
  Phone,
  MapPin,
  Tag,
  ShoppingBag,
  AlertTriangle,
  RotateCw,
  Copy,
} from "lucide-react";

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
  const PAGE_SIZE = 6;

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

  // Comprehensive Date Range & Day-Wise Filter State
  const [dateFilter, setDateFilter] = useState<DateFilterSelection>({
    type: "all",
    label: "All Time (Till Date)",
    startDate: "2026-01-01",
    endDate: "2026-10-03",
  });

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
        label:
          day === "2026-10-03"
            ? "Today (03 Oct)"
            : day === "2026-10-02"
            ? "Yesterday (02 Oct)"
            : formatDayDisplay(day),
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
      list = list.filter(
        (r) =>
          r.id.toLowerCase().includes(q) ||
          r.orderId.toLowerCase().includes(q) ||
          r.customerName.toLowerCase().includes(q) ||
          r.customerPhone.includes(q) ||
          r.item.productName.toLowerCase().includes(q) ||
          r.reason.toLowerCase().includes(q)
      );
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
    triggerToast(`📥 Exported ${filteredReturns.length} return claims as CSV`, "success");
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
          <div className="bg-neutral-900 text-white px-4 py-3 rounded-2xl shadow-2xl border border-white/10 flex items-center gap-2.5 text-xs font-semibold">
            {toast.type === "success" ? (
              <CheckCircle2 size={16} className="text-emerald-400 shrink-0" />
            ) : (
              <Sparkles size={16} className="text-amber-400 shrink-0" />
            )}
            <span>{toast.message}</span>
          </div>
        </div>
      )}

      {/* Top Header */}
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4">
        <div className="flex items-center gap-3">
          <div className="w-12 h-12 rounded-2xl bg-[#fff8e7] text-amber-700 flex items-center justify-center shrink-0 border border-amber-200/60 shadow-2xs">
            <RotateCcw size={22} className="text-amber-700" />
          </div>
          <div>
            <div className="flex items-center gap-2.5 flex-wrap">
              <h1 className="text-2xl font-bold tracking-tight text-neutral-900 leading-tight">
                Returns &amp; Reverse Logistics
              </h1>
              <span
                className={`px-2.5 py-0.5 rounded-full text-xs font-extrabold tracking-tight border shadow-2xs flex items-center gap-1.5 ${
                  dateFilter.type === "day"
                    ? "bg-sky-50 text-sky-800 border-sky-300"
                    : dateFilter.type === "custom"
                    ? "bg-purple-50 text-purple-800 border-purple-300"
                    : "bg-amber-50 text-amber-900 border-amber-300"
                }`}
              >
                <span
                  className={`w-2 h-2 rounded-full ${
                    dateFilter.type === "day"
                      ? "bg-sky-500 animate-pulse"
                      : dateFilter.type === "custom"
                      ? "bg-purple-500"
                      : "bg-amber-500"
                  }`}
                />
                {dateFilter.type === "day"
                  ? "Day-wise Mode"
                  : dateFilter.type === "custom"
                  ? "Custom Range"
                  : "Till Date (All Time)"}
              </span>
            </div>
            <p className="text-xs sm:text-sm text-neutral-500 mt-1">
              End-to-end customer return triage, inspection approval, reverse courier dispatch &amp; instant refunds
            </p>
          </div>
        </div>

        {/* Global Action Buttons */}
        <div className="flex items-center gap-2.5 shrink-0">
          <button
            type="button"
            onClick={handleExportCSV}
            className="flex items-center gap-1.5 px-3.5 py-2 rounded-xl bg-white border border-neutral-200/80 hover:bg-neutral-50 text-neutral-700 text-xs font-semibold shadow-2xs transition-all cursor-pointer"
            title="Download complete returns dataset as CSV"
          >
            <Download size={13} className="text-neutral-500" />
            <span>Export CSV</span>
          </button>
          <Link
            href="/admin"
            className="flex items-center gap-1 text-xs font-semibold text-neutral-700 hover:text-black bg-neutral-100 hover:bg-neutral-200/80 px-3.5 py-2 rounded-xl transition-colors cursor-pointer"
          >
            <span>Overview Dashboard</span>
            <ExternalLink size={12} />
          </Link>
        </div>
      </div>

      {/* ── HIGH-LEVEL 4-CARD FINANCIAL & OPERATIONAL RIBBON ── */}
      <div className="grid grid-cols-2 lg:grid-cols-4 gap-3 sm:gap-4">
        <div className="p-4 rounded-[20px] bg-white border border-black/[0.05] shadow-[0_1px_3px_rgba(0,0,0,0.02)]">
          <div className="flex items-center justify-between text-neutral-400 text-xs font-medium">
            <span>Total Return Value</span>
            <IndianRupee size={15} className="text-amber-700" />
          </div>
          <div className="text-xl sm:text-2xl font-bold text-neutral-900 mt-1">
            ₹{returnMetrics.totalClaimValue.toLocaleString("en-IN")}
          </div>
          <div className="text-[11px] text-neutral-400 mt-1">
            {returnMetrics.totalClaims} claims in active date scope
          </div>
        </div>

        <div className="p-4 rounded-[20px] bg-white border border-black/[0.05] shadow-[0_1px_3px_rgba(0,0,0,0.02)]">
          <div className="flex items-center justify-between text-neutral-400 text-xs font-medium">
            <span>Pending Review</span>
            <AlertTriangle size={15} className="text-amber-600" />
          </div>
          <div className="text-xl sm:text-2xl font-bold text-amber-700 mt-1">
            {returnMetrics.pendingCount}
          </div>
          <div className="text-[11px] text-amber-800 font-medium mt-1">
            {returnMetrics.pendingCount > 0 ? "Requires admin decision" : "Zero pending backlogs"}
          </div>
        </div>

        <div className="p-4 rounded-[20px] bg-white border border-black/[0.05] shadow-[0_1px_3px_rgba(0,0,0,0.02)]">
          <div className="flex items-center justify-between text-neutral-400 text-xs font-medium">
            <span>Approved &amp; Scheduled</span>
            <Truck size={15} className="text-emerald-700" />
          </div>
          <div className="text-xl sm:text-2xl font-bold text-emerald-700 mt-1">
            {returnMetrics.approvedCount}
          </div>
          <div className="text-[11px] text-emerald-800 font-medium mt-1">
            ₹{returnMetrics.approvedValue.toLocaleString("en-IN")} reverse dispatched
          </div>
        </div>

        <div className="p-4 rounded-[20px] bg-white border border-black/[0.05] shadow-[0_1px_3px_rgba(0,0,0,0.02)]">
          <div className="flex items-center justify-between text-neutral-400 text-xs font-medium">
            <span>Rejected Claims</span>
            <XCircle size={15} className="text-rose-600" />
          </div>
          <div className="text-xl sm:text-2xl font-bold text-rose-700 mt-1">
            {returnMetrics.rejectedCount}
          </div>
          <div className="text-[11px] text-neutral-400 mt-1">
            Out of policy or damage mismatch
          </div>
        </div>
      </div>

      {/* ── UNIFIED DATE FILTER & SCOPE CONTROLS ── */}
      <div className="bg-white rounded-[22px] border border-black/[0.04] p-5 shadow-[0_1px_3px_rgba(0,0,0,0.02)] space-y-3.5">
        {/* Row 1: Status Tabs (Left) + 1-Click Till Date vs Day-Wise + Date Range Picker (Right) */}
        <div className="flex flex-wrap items-center justify-between gap-3 pb-3 border-b border-black/[0.04]">
          {/* Status Tabs */}
          <div className="flex items-center gap-1.5 overflow-x-auto no-scrollbar">
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
                  onClick={() => setStatusFilter(tab.id as typeof statusFilter)}
                  className={`flex items-center gap-2 px-3 py-1.5 rounded-xl text-xs font-semibold transition-all cursor-pointer whitespace-nowrap ${
                    active
                      ? "bg-neutral-900 text-white shadow-2xs font-bold"
                      : "bg-neutral-100 hover:bg-neutral-200/70 text-neutral-600 font-medium"
                  }`}
                >
                  <span>{tab.label}</span>
                  <span
                    className={`px-1.5 py-0.2 rounded-full text-[10px] font-bold ${
                      active ? "bg-white/20 text-white" : "bg-white text-neutral-700 border border-neutral-200"
                    }`}
                  >
                    {tab.count}
                  </span>
                </button>
              );
            })}
          </div>

          {/* Date Controls */}
          <div className="flex items-center gap-2">
            {/* 1-Click Switcher */}
            <div className="flex items-center bg-neutral-100 p-0.5 rounded-lg border border-neutral-200/60 text-[10px] font-semibold shrink-0">
              <button
                type="button"
                onClick={() => {
                  setDateFilter({
                    type: "all",
                    label: "All Time (Till Date)",
                    startDate: "2026-01-01",
                    endDate: "2026-10-03",
                  });
                  triggerToast("Showing returns history accumulated Till Date (03 Oct 2026)", "info");
                }}
                className={`px-2.5 py-1 rounded-md transition-all cursor-pointer flex items-center gap-1 ${
                  dateFilter.type === "all"
                    ? "bg-amber-500 text-white font-bold shadow-2xs"
                    : "text-neutral-600 hover:text-neutral-950"
                }`}
                title="View returns accumulated till date (03 Oct 2026)"
              >
                <span>Till Date</span>
              </button>
              <button
                type="button"
                onClick={() => {
                  setDateFilter({
                    type: "day",
                    label: "Today (03 Oct 2026)",
                    startDate: "2026-10-03",
                    endDate: "2026-10-03",
                    singleDay: "2026-10-03",
                  });
                  triggerToast("Showing single-day returns for Today (03 Oct 2026)", "info");
                }}
                className={`px-2.5 py-1 rounded-md transition-all cursor-pointer flex items-center gap-1 ${
                  dateFilter.type === "day"
                    ? "bg-sky-600 text-white font-bold shadow-2xs"
                    : "text-neutral-600 hover:text-neutral-950"
                }`}
                title="View single-day returns"
              >
                <span>Day-wise</span>
              </button>
            </div>

            {/* Inline Compact Date Range Picker */}
            <AdminDateRangePicker
              currentFilter={dateFilter}
              onSelectFilter={(newFilter) => {
                setDateFilter(newFilter);
                triggerToast(`Date filter applied: ${newFilter.label}`, "info");
              }}
              orders={orders}
              compact={true}
              align="right"
              customTriggerLabel={
                dateFilter.type === "day"
                  ? `Day: ${dateFilter.singleDay || dateFilter.startDate}`
                  : dateFilter.type === "custom"
                  ? `${dateFilter.startDate.slice(5)} → ${dateFilter.endDate.slice(5)}`
                  : "Till Date (03 Oct)"
              }
            />
          </div>
        </div>

        {/* Row 2: Date Scope Banner / Day-Wise Navigation Hub */}
        {dateFilter.type === "day" ? (
          <div className="p-3 rounded-2xl bg-gradient-to-r from-sky-50 via-sky-50/70 to-indigo-50/40 border border-sky-200/80 shadow-2xs flex flex-col gap-2.5 animate-in fade-in duration-150">
            <div className="flex items-center justify-between gap-2 flex-wrap">
              <div className="flex items-center gap-2 min-w-0">
                <span className="w-2 h-2 rounded-full bg-sky-500 animate-pulse shrink-0" />
                <span className="text-xs text-sky-950 font-bold truncate">
                  Day-Wise Returns Breakdown:{" "}
                  <span className="text-sky-900 underline decoration-sky-300 font-extrabold">
                    {dateFilter.label}
                  </span>
                </span>
                <span className="text-[10px] text-sky-800 bg-sky-100 font-bold px-2 py-0.5 rounded-full border border-sky-300/60 shadow-2xs shrink-0">
                  {filteredReturns.length} {filteredReturns.length === 1 ? "return" : "returns"} • ₹{returnMetrics.totalClaimValue.toLocaleString("en-IN")}
                </span>
              </div>

              {/* Day Stepper & Reset */}
              <div className="flex items-center gap-1.5 shrink-0">
                <button
                  type="button"
                  onClick={() => handleStepDay("prev")}
                  disabled={currentDayIndex >= availableReturnDays.length - 1}
                  className="flex items-center gap-1 text-[11px] font-semibold px-2.5 py-1 rounded-lg bg-white border border-sky-200 text-sky-900 hover:bg-sky-50 disabled:opacity-35 disabled:pointer-events-none cursor-pointer shadow-2xs transition-all"
                  title="Step to earlier date with returns"
                >
                  <ChevronLeft size={12} />
                  <span>Earlier Day</span>
                </button>
                <button
                  type="button"
                  onClick={() => handleStepDay("next")}
                  disabled={currentDayIndex <= 0}
                  className="flex items-center gap-1 text-[11px] font-semibold px-2.5 py-1 rounded-lg bg-white border border-sky-200 text-sky-900 hover:bg-sky-50 disabled:opacity-35 disabled:pointer-events-none cursor-pointer shadow-2xs transition-all"
                  title="Step to more recent date"
                >
                  <span>Next Day</span>
                  <ChevronRight size={12} />
                </button>
                <button
                  type="button"
                  onClick={() => {
                    setDateFilter({
                      type: "all",
                      label: "All Time (Till Date)",
                      startDate: "2026-01-01",
                      endDate: "2026-10-03",
                    });
                    triggerToast("Restored returns history accumulated Till Date", "info");
                  }}
                  className="ml-1 text-[11px] font-bold text-sky-800 hover:text-sky-950 hover:underline cursor-pointer"
                >
                  View All (Till Date)
                </button>
              </div>
            </div>

            {/* Quick Day Selector Chips */}
            <div className="flex items-center gap-1.5 overflow-x-auto no-scrollbar pt-0.5">
              <span className="text-[10px] uppercase tracking-wider font-extrabold text-sky-900/60 shrink-0 mr-1">
                Select Return Day:
              </span>
              {availableReturnDays.map((dayItem) => {
                const isSelected = (dateFilter.singleDay || dateFilter.startDate) === dayItem.date;
                return (
                  <button
                    key={dayItem.date}
                    type="button"
                    onClick={() => {
                      setDateFilter({
                        type: "day",
                        label: dayItem.label,
                        startDate: dayItem.date,
                        endDate: dayItem.date,
                        singleDay: dayItem.date,
                      });
                      triggerToast(`Selected ${dayItem.label} (${dayItem.count} ${dayItem.count === 1 ? "return" : "returns"})`, "info");
                    }}
                    className={`flex items-center gap-1.5 px-2.5 py-1 rounded-lg text-[11px] transition-all cursor-pointer whitespace-nowrap border shrink-0 ${
                      isSelected
                        ? "bg-sky-600 text-white font-bold border-sky-700 shadow-xs ring-2 ring-sky-300"
                        : "bg-white/90 hover:bg-white text-neutral-700 border-sky-200/70 hover:border-sky-300"
                    }`}
                  >
                    <span>{dayItem.label}</span>
                    <span
                      className={`px-1.5 py-0.2 rounded-full text-[9.5px] font-extrabold ${
                        isSelected ? "bg-white/20 text-white" : "bg-sky-100 text-sky-800"
                      }`}
                    >
                      {dayItem.count}
                    </span>
                    <span className={`text-[10px] ${isSelected ? "text-sky-100" : "text-neutral-400"}`}>
                      ₹{Math.round(dayItem.totalAmount).toLocaleString("en-IN")}
                    </span>
                  </button>
                );
              })}
            </div>
          </div>
        ) : dateFilter.type === "all" ? (
          <div className="p-3 rounded-2xl bg-gradient-to-r from-amber-50/90 via-amber-50/40 to-transparent border border-amber-200/70 flex items-center justify-between text-xs text-amber-950 animate-in fade-in duration-150">
            <div className="flex items-center gap-2">
              <Sparkles size={14} className="text-amber-600 shrink-0" />
              <span>
                <strong>Till Date Returns Scope:</strong> Displaying all {allMasterReturns.length} return claims recorded from store launch (18 Sep 2026) till today (03 Oct 2026). Total value: <strong>₹{returnMetrics.totalClaimValue.toLocaleString("en-IN")}</strong>
              </span>
            </div>
            <button
              type="button"
              onClick={() => {
                setDateFilter({
                  type: "day",
                  label: "Today (03 Oct 2026)",
                  startDate: "2026-10-03",
                  endDate: "2026-10-03",
                  singleDay: "2026-10-03",
                });
                triggerToast("Switched to Day-Wise Breakdown for Today (03 Oct 2026)", "info");
              }}
              className="text-amber-800 hover:text-amber-950 font-bold hover:underline cursor-pointer flex items-center gap-1 shrink-0 ml-2"
            >
              <span>Explore Day-Wise</span>
              <ArrowRight size={11} />
            </button>
          </div>
        ) : (
          <div className="p-3 rounded-2xl bg-purple-50/80 border border-purple-200/70 flex items-center justify-between text-xs text-purple-950 animate-in fade-in duration-150">
            <div className="flex items-center gap-2">
              <CalendarDays size={14} className="text-purple-600 shrink-0" />
              <span>
                <strong>Custom Date Range:</strong> {dateFilter.startDate} → {dateFilter.endDate} ({filteredReturns.length} returns found • ₹{returnMetrics.totalClaimValue.toLocaleString("en-IN")})
              </span>
            </div>
            <button
              type="button"
              onClick={() => {
                setDateFilter({
                  type: "all",
                  label: "All Time (Till Date)",
                  startDate: "2026-01-01",
                  endDate: "2026-10-03",
                });
                triggerToast("Reset to All Time (Till Date)", "info");
              }}
              className="text-purple-800 hover:text-purple-950 font-bold hover:underline cursor-pointer flex items-center gap-1 shrink-0 ml-2"
            >
              <span>Reset to Till Date</span>
              <RotateCcw size={11} />
            </button>
          </div>
        )}

        {/* Row 3: Search Bar + Reason Filter */}
        <div className="flex flex-col sm:flex-row items-center gap-2.5 pt-1">
          <div className="relative flex-1 w-full">
            <Search size={14} className="absolute left-3.5 top-1/2 -translate-y-1/2 text-neutral-400" />
            <input
              type="text"
              value={searchQuery}
              onChange={(e) => setSearchQuery(e.target.value)}
              placeholder="Search by Return ID, Order #, Customer, Phone, or Reason..."
              className="w-full pl-9 pr-8 py-2 rounded-xl bg-neutral-50/80 border border-neutral-200/80 text-xs text-neutral-800 placeholder:text-neutral-400 focus:outline-none focus:ring-2 focus:ring-amber-500/20 focus:border-amber-400 transition-all"
            />
            {searchQuery && (
              <button
                onClick={() => setSearchQuery("")}
                className="absolute right-2.5 top-1/2 -translate-y-1/2 text-neutral-400 hover:text-neutral-600"
              >
                <X size={13} />
              </button>
            )}
          </div>

          <div className="flex items-center gap-2 w-full sm:w-auto">
            <select
              value={reasonCategoryFilter}
              onChange={(e) => setReasonCategoryFilter(e.target.value)}
              className="px-3 py-2 rounded-xl bg-neutral-50/80 border border-neutral-200/80 text-xs font-medium text-neutral-700 focus:outline-none cursor-pointer"
            >
              <option value="all">All Return Reasons</option>
              <option value="size">Size / Fit Mismatch</option>
              <option value="defect">Fabric / Stitching Defect</option>
              <option value="quality">Quality Dissatisfaction</option>
            </select>
          </div>
        </div>
      </div>

      {/* ── RETURNS MASTER TABLE CARD ── */}
      <div className="bg-white rounded-[22px] border border-black/[0.04] shadow-[0_1px_3px_rgba(0,0,0,0.02)] overflow-hidden">
        <div className="overflow-x-auto">
          <table className="w-full text-left border-collapse" role="table">
            <thead>
              <tr className="border-b border-neutral-100 text-xs font-semibold text-neutral-400 bg-neutral-50/50">
                <th className="pl-6 py-3.5">Return ID</th>
                <th className="px-3 py-3.5">Customer &amp; City</th>
                <th className="px-3 py-3.5">Product Claimed</th>
                <th className="px-3 py-3.5">Reason &amp; Feedback</th>
                <th className="px-3 py-3.5">Refund Value</th>
                <th className="px-3 py-3.5">Status</th>
                <th className="px-3 py-3.5">Date Requested</th>
                <th className="pr-6 py-3.5 text-right">Actions</th>
              </tr>
            </thead>
            <tbody className="divide-y divide-neutral-100">
              {displayedReturns.length === 0 ? (
                <tr>
                  <td colSpan={8} className="py-14 text-center text-xs text-neutral-400">
                    <div className="flex flex-col items-center justify-center gap-2">
                      <RotateCcw size={28} className="text-neutral-300" />
                      <span className="font-semibold text-neutral-600 text-sm">No return requests found</span>
                      <p className="text-neutral-400 max-w-sm">
                        No returns match your current active date scope and filter combination.
                      </p>
                      <button
                        type="button"
                        onClick={() => {
                          setStatusFilter("all");
                          setReasonCategoryFilter("all");
                          setSearchQuery("");
                          setDateFilter({
                            type: "all",
                            label: "All Time (Till Date)",
                            startDate: "2026-01-01",
                            endDate: "2026-10-03",
                          });
                        }}
                        className="text-amber-800 hover:underline font-bold text-xs mt-2 cursor-pointer"
                      >
                        Reset all filters to All Time
                      </button>
                    </div>
                  </td>
                </tr>
              ) : (
                displayedReturns.map((ret) => {
                  return (
                    <tr
                      key={ret.id}
                      className="hover:bg-amber-50/40 transition-colors duration-150 group cursor-pointer"
                      onClick={() => setSelectedReturn(ret)}
                      title="Click to inspect return claim"
                    >
                      {/* Return ID & Order ID */}
                      <td className="pl-6 py-4 whitespace-nowrap">
                        <div className="flex flex-col">
                          <span className="text-xs font-mono font-bold text-neutral-900 group-hover:text-amber-800">
                            {ret.id}
                          </span>
                          <span className="text-[11px] font-mono text-neutral-400 mt-0.5">
                            Order #{ret.orderId}
                          </span>
                        </div>
                      </td>

                      {/* Customer */}
                      <td className="px-3 py-4 whitespace-nowrap">
                        <div className="flex flex-col">
                          <span className="text-xs sm:text-sm font-semibold text-neutral-900">
                            {ret.customerName}
                          </span>
                          <span className="text-[11px] text-neutral-400 flex items-center gap-1 mt-0.5">
                            <Phone size={10} className="shrink-0" />
                            {ret.customerPhone} • {ret.customerCity}
                          </span>
                        </div>
                      </td>

                      {/* Product */}
                      <td className="px-3 py-4 whitespace-nowrap">
                        <div className="flex items-center gap-2.5">
                          <div className="w-10 h-10 rounded-xl bg-neutral-100 overflow-hidden shrink-0 border border-neutral-200/60 flex items-center justify-center">
                            <Image
                              src={ret.item.imageUrl}
                              alt={ret.item.productName}
                              width={40}
                              height={40}
                              className="w-full h-full object-cover"
                            />
                          </div>
                          <div className="flex flex-col min-w-0">
                            <span className="text-xs font-semibold text-neutral-900 truncate max-w-[150px]">
                              {ret.item.productName}
                            </span>
                            <span className="text-[11px] text-neutral-400 mt-0.5">
                              {ret.item.colorName} • Size {ret.item.selectedSize} (x{ret.item.quantity})
                            </span>
                          </div>
                        </div>
                      </td>

                      {/* Reason & Comments */}
                      <td className="px-3 py-4">
                        <div className="flex flex-col max-w-[220px]">
                          <span className="inline-flex items-center px-2 py-0.5 rounded-md text-[10.5px] font-bold bg-amber-50 text-amber-900 border border-amber-200/60 w-fit">
                            {ret.reason}
                          </span>
                          {ret.details && (
                            <span className="text-[11px] text-neutral-500 italic mt-1 line-clamp-1">
                              &ldquo;{ret.details}&rdquo;
                            </span>
                          )}
                        </div>
                      </td>

                      {/* Refund Amount */}
                      <td className="px-3 py-4 whitespace-nowrap">
                        <div className="flex flex-col">
                          <span className="text-xs sm:text-sm font-bold text-neutral-900">
                            ₹{ret.refundAmount.toLocaleString("en-IN")}
                          </span>
                          <span className="text-[10px] text-neutral-400 font-medium uppercase tracking-wider flex items-center gap-1 mt-0.5">
                            <span className="w-1.5 h-1.5 rounded-full bg-emerald-500 shrink-0" />
                            {ret.paymentMethod === "upi"
                              ? "UPI • Original Source"
                              : ret.paymentMethod === "card"
                              ? "Card • Refund Ready"
                              : "Bank Transfer"}
                          </span>
                        </div>
                      </td>

                      {/* Status */}
                      <td className="px-3 py-4 whitespace-nowrap">
                        {ret.status === "pending" ? (
                          <span className="inline-flex items-center gap-1.5 px-2.5 py-1 rounded-full text-[11px] font-bold bg-amber-50 text-amber-900 border border-amber-300 shadow-2xs">
                            <span className="w-1.5 h-1.5 rounded-full bg-amber-500 animate-pulse" />
                            Pending Review
                          </span>
                        ) : ret.status === "approved" ? (
                          <span className="inline-flex items-center gap-1.5 px-2.5 py-1 rounded-full text-[11px] font-bold bg-emerald-50 text-emerald-900 border border-emerald-300 shadow-2xs">
                            <CheckCircle2 size={12} className="text-emerald-600" />
                            Approved / Pickup Set
                          </span>
                        ) : (
                          <span className="inline-flex items-center gap-1.5 px-2.5 py-1 rounded-full text-[11px] font-bold bg-rose-50 text-rose-900 border border-rose-300 shadow-2xs">
                            <XCircle size={12} className="text-rose-600" />
                            Rejected
                          </span>
                        )}
                      </td>

                      {/* Date */}
                      <td className="px-3 py-4 whitespace-nowrap">
                        <div className="flex flex-col">
                          <div className="flex items-center gap-1.5 text-xs font-semibold text-neutral-900">
                            <span>{ret.requestedAt.includes(",") ? ret.requestedAt.split(",")[0].trim() : ret.requestedAt}</span>
                            {ret.dayString === "2026-10-03" ? (
                              <span className="px-1.5 py-0.2 rounded text-[9.5px] font-bold bg-emerald-50 text-emerald-700 border border-emerald-200">
                                Today
                              </span>
                            ) : null}
                          </div>
                          <span className="text-[11px] text-neutral-400 flex items-center gap-1 mt-0.5">
                            <Clock size={10} className="shrink-0" />
                            {ret.requestedAt.includes(",") ? ret.requestedAt.split(",")[1].trim() : "Recorded"}
                          </span>
                        </div>
                      </td>

                      {/* Actions */}
                      <td className="pr-6 py-4 whitespace-nowrap text-right" onClick={(e) => e.stopPropagation()}>
                        <div className="flex items-center justify-end gap-1.5">
                          {ret.status === "pending" ? (
                            <>
                              <button
                                type="button"
                                onClick={() => handleApprove(ret)}
                                className="px-2.5 py-1.5 rounded-xl bg-emerald-600 hover:bg-emerald-700 text-white font-bold text-xs shadow-2xs transition-all cursor-pointer flex items-center gap-1"
                                title="Approve return claim and schedule reverse pickup"
                              >
                                <Check size={12} strokeWidth={2.5} />
                                <span>Approve</span>
                              </button>
                              <button
                                type="button"
                                onClick={() => {
                                  setRejectingReturnId(ret.id);
                                  setSelectedReturn(ret);
                                }}
                                className="px-2.5 py-1.5 rounded-xl bg-white border border-rose-200 hover:bg-rose-50 text-rose-700 font-semibold text-xs shadow-2xs transition-all cursor-pointer flex items-center gap-1"
                                title="Reject return claim"
                              >
                                <X size={12} strokeWidth={2.5} />
                                <span>Reject</span>
                              </button>
                            </>
                          ) : (
                            <button
                              type="button"
                              onClick={() => handlePrintSlip(ret)}
                              className="px-2.5 py-1.5 rounded-xl bg-white border border-neutral-200 hover:bg-neutral-50 text-neutral-700 font-semibold text-xs shadow-2xs transition-all cursor-pointer flex items-center gap-1"
                              title="Print reverse courier pickup voucher"
                            >
                              <Printer size={12} />
                              <span>Slip</span>
                            </button>
                          )}
                          <button
                            type="button"
                            onClick={() => setSelectedReturn(ret)}
                            className="w-8 h-8 rounded-xl border border-neutral-200 hover:bg-neutral-100 text-neutral-500 hover:text-neutral-900 flex items-center justify-center transition-colors cursor-pointer"
                            title="Inspect complete return dossier"
                          >
                            <Eye size={13} />
                          </button>
                        </div>
                      </td>
                    </tr>
                  );
                })
              )}
            </tbody>
          </table>
        </div>

        {/* ── TABLE FOOTER WITH PAGINATION & BATCH OPERATIONS ── */}
        <div className="p-4 sm:p-5 bg-gradient-to-b from-[#faf9f6] to-white border-t border-black/[0.05] flex flex-wrap items-center justify-between gap-3">
          <div className="flex items-center gap-2 text-xs text-neutral-500">
            <span>
              Showing{" "}
              <strong className="text-neutral-900 font-bold">
                {filteredReturns.length === 0 ? 0 : (currentPage - 1) * PAGE_SIZE + 1}
              </strong>
              –
              <strong className="text-neutral-900 font-bold">
                {Math.min(currentPage * PAGE_SIZE, filteredReturns.length)}
              </strong>{" "}
              of <strong className="text-neutral-900 font-bold">{filteredReturns.length}</strong> return claims
            </span>

            {totalPages > 1 && (
              <div className="flex items-center gap-1 ml-2">
                <button
                  type="button"
                  onClick={() => setCurrentPage((p) => Math.max(1, p - 1))}
                  disabled={currentPage === 1}
                  className="p-1 rounded-lg border border-neutral-200 text-neutral-600 hover:bg-neutral-100 disabled:opacity-30 disabled:pointer-events-none cursor-pointer"
                  title="Previous Page"
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
                      className={`w-6 h-6 rounded-lg text-xs font-semibold flex items-center justify-center transition-all cursor-pointer ${
                        currentPage === pageNum
                          ? "bg-neutral-900 text-white shadow-2xs font-bold"
                          : "text-neutral-600 hover:bg-neutral-100"
                      }`}
                    >
                      {pageNum}
                    </button>
                  );
                })}
                <button
                  type="button"
                  onClick={() => setCurrentPage((p) => Math.min(totalPages, p + 1))}
                  disabled={currentPage === totalPages}
                  className="p-1 rounded-lg border border-neutral-200 text-neutral-600 hover:bg-neutral-100 disabled:opacity-30 disabled:pointer-events-none cursor-pointer"
                  title="Next Page"
                >
                  <ChevronRight size={13} />
                </button>
              </div>
            )}
          </div>

          <div className="flex items-center gap-2">
            <button
              type="button"
              onClick={handleExportCSV}
              className="flex items-center gap-1.5 px-3 py-1.5 rounded-xl border border-neutral-200/80 hover:bg-neutral-50 text-neutral-700 text-xs font-semibold shadow-2xs transition-all cursor-pointer"
            >
              <Download size={12} className="text-neutral-500" />
              <span>Export Returns CSV</span>
            </button>
            {displayedReturns[0] && (
              <button
                type="button"
                onClick={() => handlePrintSlip(displayedReturns[0])}
                className="flex items-center gap-1.5 px-3 py-1.5 rounded-xl bg-amber-500 hover:bg-amber-600 text-white text-xs font-bold shadow-2xs transition-all cursor-pointer"
              >
                <Printer size={12} />
                <span>Print Return Slip</span>
              </button>
            )}
          </div>
        </div>
      </div>

      {/* ── DEEP INSPECTION & REVIEW MODAL ── */}
      {selectedReturn && (
        <div
          className="fixed inset-0 z-[10000] bg-black/60 backdrop-blur-xs flex items-center justify-center p-4 animate-in fade-in duration-200"
          onClick={() => setSelectedReturn(null)}
        >
          <div
            className="w-full max-w-2xl bg-white rounded-3xl border border-neutral-200 shadow-2xl overflow-hidden flex flex-col max-h-[90vh]"
            onClick={(e) => e.stopPropagation()}
          >
            {/* Header */}
            <div className="p-6 pb-4 border-b border-neutral-100 flex items-center justify-between">
              <div className="flex items-center gap-3">
                <div className="w-10 h-10 rounded-2xl bg-[#fff8e7] text-amber-700 flex items-center justify-center font-bold">
                  <RotateCcw size={18} />
                </div>
                <div>
                  <div className="flex items-center gap-2">
                    <h3 className="text-lg font-bold text-neutral-900">
                      Return Claim Dossier — {selectedReturn.id}
                    </h3>
                    <span
                      className={`px-2 py-0.5 rounded-full text-[10px] font-bold ${
                        selectedReturn.status === "pending"
                          ? "bg-amber-100 text-amber-900 border border-amber-300"
                          : selectedReturn.status === "approved"
                          ? "bg-emerald-100 text-emerald-900 border border-emerald-300"
                          : "bg-rose-100 text-rose-900 border border-rose-300"
                      }`}
                    >
                      {selectedReturn.status.toUpperCase()}
                    </span>
                  </div>
                  <p className="text-xs text-neutral-400 mt-0.5">
                    Order Ref: #{selectedReturn.orderId} • Requested on {selectedReturn.requestedAt}
                  </p>
                </div>
              </div>
              <button
                onClick={() => {
                  setSelectedReturn(null);
                  setRejectingReturnId(null);
                }}
                className="w-8 h-8 rounded-xl hover:bg-neutral-100 text-neutral-400 hover:text-neutral-700 flex items-center justify-center cursor-pointer transition-colors"
              >
                <X size={16} />
              </button>
            </div>

            {/* Content Body */}
            <div className="p-6 space-y-5 overflow-y-auto flex-1 admin-scroll-container text-xs">
              {/* Product Info Card */}
              <div className="p-4 rounded-2xl bg-neutral-50/80 border border-neutral-200/70 flex items-center gap-4">
                <div className="w-16 h-16 rounded-xl bg-white border border-neutral-200 overflow-hidden shrink-0 flex items-center justify-center">
                  <Image
                    src={selectedReturn.item.imageUrl}
                    alt={selectedReturn.item.productName}
                    width={64}
                    height={64}
                    className="w-full h-full object-cover"
                  />
                </div>
                <div className="flex-1 min-w-0">
                  <h4 className="font-bold text-neutral-900 text-sm">{selectedReturn.item.productName}</h4>
                  <div className="text-neutral-500 mt-1 flex items-center gap-2">
                    <span>Color: <strong>{selectedReturn.item.colorName}</strong></span>
                    <span>•</span>
                    <span>Size: <strong>{selectedReturn.item.selectedSize}</strong></span>
                    <span>•</span>
                    <span>Qty: <strong>{selectedReturn.item.quantity}</strong></span>
                  </div>
                  <div className="text-amber-800 font-extrabold text-sm mt-1">
                    Refund Claim Amount: ₹{selectedReturn.refundAmount.toLocaleString("en-IN")}
                  </div>
                </div>
              </div>

              {/* Customer & Address Details */}
              <div className="grid grid-cols-1 sm:grid-cols-2 gap-3">
                <div className="p-3.5 rounded-2xl border border-neutral-200/80 bg-white">
                  <span className="text-[10px] text-neutral-400 font-bold uppercase tracking-wider block mb-1">
                    Customer Information
                  </span>
                  <div className="font-bold text-neutral-900">{selectedReturn.customerName}</div>
                  <div className="text-neutral-500 mt-0.5">{selectedReturn.customerPhone}</div>
                  <div className="text-neutral-400 text-[11px] mt-1">
                    Payment Method: <strong>{selectedReturn.paymentMethod.toUpperCase()}</strong>
                  </div>
                </div>

                <div className="p-3.5 rounded-2xl border border-neutral-200/80 bg-white">
                  <span className="text-[10px] text-neutral-400 font-bold uppercase tracking-wider block mb-1">
                    Reverse Pickup Address
                  </span>
                  <div className="text-neutral-800 font-medium leading-relaxed">
                    {selectedReturn.customerAddress}
                  </div>
                </div>
              </div>

              {/* Return Reason Box */}
              <div className="p-4 rounded-2xl bg-amber-50/60 border border-amber-200/70">
                <span className="text-[10.5px] font-bold text-amber-900 uppercase tracking-wider block mb-1">
                  Customer Claim Reason
                </span>
                <div className="text-sm font-bold text-neutral-900">{selectedReturn.reason}</div>
                {selectedReturn.details && (
                  <p className="text-neutral-600 italic mt-1 bg-white/70 p-2.5 rounded-xl border border-amber-100">
                    &ldquo;{selectedReturn.details}&rdquo;
                  </p>
                )}
              </div>

              {/* Courier Selection if approving */}
              {selectedReturn.status === "pending" && (
                <div className="space-y-3 pt-2">
                  <label className="block text-xs font-bold text-neutral-800">
                    Assign Reverse Logistics Courier:
                  </label>
                  <div className="grid grid-cols-3 gap-2">
                    {[
                      "BlueDart Reverse Express",
                      "Delhivery Return Network",
                      "Shadowfax Speed Pickup",
                    ].map((c) => (
                      <button
                        key={c}
                        type="button"
                        onClick={() => setSelectedCarrier(c)}
                        className={`p-2.5 rounded-xl border text-center font-semibold cursor-pointer transition-all ${
                          selectedCarrier === c
                            ? "bg-amber-50 border-amber-500 text-amber-950 font-bold shadow-2xs"
                            : "bg-white border-neutral-200 text-neutral-600 hover:bg-neutral-50"
                        }`}
                      >
                        <Truck size={14} className="mx-auto mb-1 text-neutral-500" />
                        <span className="text-[11px] block">{c.split(" ")[0]}</span>
                      </button>
                    ))}
                  </div>

                  {rejectingReturnId === selectedReturn.id ? (
                    <div className="space-y-2 p-3.5 rounded-2xl bg-rose-50 border border-rose-200 animate-in fade-in">
                      <label className="block text-xs font-bold text-rose-900">
                        Reason for Rejection (Customer will receive this note):
                      </label>
                      <textarea
                        value={rejectNote}
                        onChange={(e) => setRejectNote(e.target.value)}
                        placeholder="e.g. Return window expired, item tags removed, or normal wear and tear..."
                        rows={3}
                        className="w-full p-2.5 rounded-xl bg-white border border-rose-200 text-xs text-neutral-900 focus:outline-none focus:ring-2 focus:ring-rose-400"
                      />
                      <div className="flex items-center justify-end gap-2 pt-1">
                        <button
                          type="button"
                          onClick={() => setRejectingReturnId(null)}
                          className="px-3 py-1.5 rounded-xl border border-neutral-200 text-neutral-600 font-semibold cursor-pointer"
                        >
                          Cancel
                        </button>
                        <button
                          type="button"
                          onClick={() => handleReject(selectedReturn)}
                          className="px-4 py-1.5 rounded-xl bg-rose-600 hover:bg-rose-700 text-white font-bold cursor-pointer"
                        >
                          Confirm Rejection
                        </button>
                      </div>
                    </div>
                  ) : null}
                </div>
              )}
            </div>

            {/* Modal Footer Actions */}
            <div className="p-5 border-t border-neutral-100 flex items-center justify-between gap-3 bg-neutral-50/50">
              <button
                type="button"
                onClick={() => handlePrintSlip(selectedReturn)}
                className="flex items-center gap-1.5 px-3.5 py-2 rounded-xl bg-white border border-neutral-200/80 hover:bg-neutral-100 text-neutral-700 font-semibold text-xs cursor-pointer shadow-2xs"
              >
                <Printer size={13} />
                <span>Print Reverse Slip</span>
              </button>

              {selectedReturn.status === "pending" && !rejectingReturnId ? (
                <div className="flex items-center gap-2">
                  <button
                    type="button"
                    onClick={() => setRejectingReturnId(selectedReturn.id)}
                    className="px-4 py-2 rounded-xl bg-white border border-rose-200 text-rose-700 font-bold text-xs hover:bg-rose-50 cursor-pointer"
                  >
                    Reject Claim
                  </button>
                  <button
                    type="button"
                    onClick={() => handleApprove(selectedReturn)}
                    className="px-5 py-2 rounded-xl bg-emerald-600 hover:bg-emerald-700 text-white font-bold text-xs cursor-pointer shadow-2xs flex items-center gap-1.5"
                  >
                    <Check size={14} strokeWidth={2.5} />
                    <span>Approve &amp; Dispatch Pickup</span>
                  </button>
                </div>
              ) : (
                <button
                  type="button"
                  onClick={() => setSelectedReturn(null)}
                  className="px-4 py-2 rounded-xl bg-neutral-900 text-white font-semibold text-xs cursor-pointer hover:bg-black"
                >
                  Close Dossier
                </button>
              )}
            </div>
          </div>
        </div>
      )}
    </div>
  );
}
