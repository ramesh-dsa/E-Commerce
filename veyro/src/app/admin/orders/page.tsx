"use client";

import React, { useState, useMemo } from "react";
import { useUser } from "@/context/UserContext";
import type { OrderRecord, OrderStatus } from "@/types";
import { AdminDateRangePicker, DateFilterSelection, parseOrderDateToDayString } from "@/components/admin/AdminDateRangePicker";
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

function isOrderFromToday(dateStr?: string): boolean {
  if (!dateStr) return false;
  const lower = dateStr.toLowerCase();
  if (lower.includes("today") || lower.includes("just now")) return true;
  const now = new Date();
  const d = now.getDate();
  const dPad = String(d).padStart(2, "0");
  const monthShort = now.toLocaleString("en-IN", { month: "short" });
  const year = String(now.getFullYear());
  return (
    dateStr.includes(monthShort) &&
    dateStr.includes(year) &&
    (dateStr.includes(dPad) || dateStr.includes(String(d)))
  );
}

export default function AdminOrdersPage() {
  const { orders, updateOrderStatus, deleteOrder } = useUser();
  const [search, setSearch] = useState("");
  const [statusFilter, setStatusFilter] = useState<string>("all");
  const [selectedOrder, setSelectedOrder] = useState<OrderRecord | null>(null);

  const [dateFilter, setDateFilter] = useState<DateFilterSelection>({
    type: "all",
    label: "All Time (Till Date)",
    startDate: "2026-01-01",
    endDate: "2026-10-03",
  });

  const stats = useMemo(() => {
    const todayOrders = orders.filter((o) => isOrderFromToday(o.date));
    const todayRevenue = todayOrders.reduce((sum, o) => sum + (o.total || 0), 0);
    const totalRevenue = orders.reduce((sum, o) => sum + (o.total || 0), 0);

    const statusCounts: Record<string, number> = {};
    orders.forEach((o) => {
      const s = o.status || "Confirmed";
      statusCounts[s] = (statusCounts[s] || 0) + 1;
    });

    const productCounts: Record<string, { name: string; count: number; revenue: number }> = {};
    orders.forEach((order) => {
      (order.items || []).forEach((item) => {
        const pId = item.productId || item.productName;
        if (!productCounts[pId]) {
          productCounts[pId] = {
            name: item.productName || "Product",
            count: 0,
            revenue: 0,
          };
        }
        productCounts[pId].count += item.quantity || 1;
        productCounts[pId].revenue += item.totalPrice || item.unitPrice || 0;
      });
    });

    const topProducts = Object.values(productCounts)
      .sort((a, b) => b.count - a.count)
      .slice(0, 6);

    return {
      todayOrders,
      todayRevenue,
      totalRevenue,
      statusCounts,
      topProducts,
    };
  }, [orders]);

  const filteredOrders = useMemo(() => {
    return orders.filter((order) => {
      // Date Filter
      if (dateFilter.type !== "all") {
        const orderDay = parseOrderDateToDayString(order.date);
        if (dateFilter.type === "day") {
          if (orderDay !== dateFilter.singleDay) return false;
        } else {
          // Preset or Custom range
          if (orderDay < dateFilter.startDate || orderDay > dateFilter.endDate) {
            return false;
          }
        }
      }

      if (statusFilter !== "all" && order.status !== statusFilter) {
        return false;
      }
      if (search.trim()) {
        const q = search.toLowerCase();
        const matchesId = (order.id || "").toLowerCase().includes(q);
        const matchesName = (order.shippingAddress?.name || "").toLowerCase().includes(q);
        const matchesPhone = (order.shippingAddress?.phone || "").toLowerCase().includes(q);
        const matchesItem = (order.items || []).some((item) =>
          (item.productName || "").toLowerCase().includes(q)
        ) || (order.itemNames || []).some((n) => n.toLowerCase().includes(q));
        return matchesId || matchesName || matchesPhone || matchesItem;
      }
      return true;
    });
  }, [orders, search, statusFilter, dateFilter]);

  const handleStatusChange = (orderId: string, newStatus: OrderStatus) => {
    updateOrderStatus(orderId, newStatus);
    if (selectedOrder && selectedOrder.id === orderId) {
      setSelectedOrder((prev) => (prev ? { ...prev, status: newStatus } : null));
    }
  };

  const handleDelete = (orderId: string) => {
    if (confirm(`Are you sure you want to delete order ${orderId}? This cannot be undone.`)) {
      deleteOrder(orderId);
      if (selectedOrder?.id === orderId) {
        setSelectedOrder(null);
      }
    }
  };

  return (
    <div className="space-y-8">
      {/* Header */}
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4">
        <div>
          <h1 className="text-2xl font-bold text-veyro-black">Orders &amp; Sales</h1>
          <p className="text-sm text-veyro-muted mt-1">
            Real-time management for all orders stored in this browser session ({orders.length} total)
          </p>
        </div>
      </div>

      {/* Stats Cards */}
      <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-4">
        <StatCard
          icon={<Calendar size={20} />}
          label="Today's Orders"
          value={stats.todayOrders.length.toString()}
          accent={stats.todayOrders.length > 0}
          detail={stats.todayOrders.length > 0 ? "Placed today" : "No orders today yet"}
        />
        <StatCard
          icon={<IndianRupee size={20} />}
          label="Today's Revenue"
          value={`₹${stats.todayRevenue.toLocaleString("en-IN")}`}
          accent={stats.todayRevenue > 0}
          detail="Today's total sales"
        />
        <StatCard
          icon={<ShoppingCart size={20} />}
          label="All-Time Orders"
          value={orders.length.toString()}
          detail="Total completed checkouts"
        />
        <StatCard
          icon={<TrendingUp size={20} />}
          label="All-Time Revenue"
          value={`₹${stats.totalRevenue.toLocaleString("en-IN")}`}
          detail="Across all orders"
        />
      </div>

      {/* Top Products & Status Breakdown */}
      <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
        {/* Status Breakdown */}
        <div className="bg-white rounded-xl border border-veyro-border p-5">
          <h2 className="font-semibold text-veyro-black mb-3">Order Statuses</h2>
          <div className="flex flex-wrap gap-2">
            {ALL_STATUSES.map((status) => {
              const count = stats.statusCounts[status] || 0;
              return (
                <button
                  key={status}
                  onClick={() => setStatusFilter(statusFilter === status ? "all" : status)}
                  className={`px-3 py-1.5 rounded-lg text-xs font-semibold transition-all ${
                    statusFilter === status
                      ? "ring-2 ring-veyro-black bg-veyro-black text-white"
                      : "bg-veyro-surface hover:bg-neutral-200 text-neutral-800"
                  }`}
                >
                  {status} <span className="ml-1 opacity-70">({count})</span>
                </button>
              );
            })}
          </div>
        </div>

        {/* Top Products */}
        <div className="bg-white rounded-xl border border-veyro-border p-5">
          <h2 className="font-semibold text-veyro-black mb-3 flex items-center gap-2">
            <Package size={16} />
            Top Selling Products
          </h2>
          {stats.topProducts.length === 0 ? (
            <p className="text-xs text-veyro-muted py-4">No product sales data recorded yet.</p>
          ) : (
            <div className="space-y-2">
              {stats.topProducts.map((p, i) => (
                <div
                  key={i}
                  className="flex items-center justify-between text-xs py-1.5 border-b border-veyro-border-light last:border-0"
                >
                  <span className="font-medium truncate max-w-[240px]">
                    <span className="font-bold text-veyro-muted mr-2">#{i + 1}</span>
                    {p.name}
                  </span>
                  <span className="font-semibold text-neutral-800">
                    ₹{p.revenue.toLocaleString("en-IN")}{" "}
                    <span className="text-[11px] font-normal text-veyro-muted">
                      ({p.count} sold)
                    </span>
                  </span>
                </div>
              ))}
            </div>
          )}
        </div>
      </div>

      {/* Filters & Search */}
      <div className="flex flex-col sm:flex-row gap-3">
        <div className="relative flex-1">
          <Search size={16} className="absolute left-3 top-1/2 -translate-y-1/2 text-veyro-muted" />
          <input
            type="text"
            placeholder="Search by Order ID, Customer name, Phone, or Item..."
            value={search}
            onChange={(e) => setSearch(e.target.value)}
            className="w-full pl-9 pr-4 py-2.5 rounded-lg border border-veyro-border bg-white text-sm focus:outline-none focus:border-veyro-black"
          />
        </div>
        <div className="flex flex-wrap items-center gap-2">
          <AdminDateRangePicker
            currentFilter={dateFilter}
            onSelectFilter={setDateFilter}
            orders={orders}
          />
          <div className="flex items-center gap-2 border-l border-neutral-200 pl-2 ml-1">
            <Filter size={16} className="text-veyro-muted" />
            <select
              value={statusFilter}
              onChange={(e) => setStatusFilter(e.target.value)}
              className="px-3 py-2 rounded-lg border border-veyro-border bg-white text-sm focus:outline-none focus:border-veyro-black"
            >
            <option value="all">All Statuses ({orders.length})</option>
            {ALL_STATUSES.map((s) => (
              <option key={s} value={s}>
                {s} ({stats.statusCounts[s] || 0})
              </option>
            ))}
          </select>
          </div>
        </div>
      </div>

      {/* Orders Table */}
      <div className="bg-white rounded-xl border border-veyro-border overflow-hidden">
        <div className="overflow-x-auto">
          <table className="w-full text-sm" role="table">
            <thead>
              <tr className="border-b border-veyro-border bg-veyro-surface">
                <th className="text-left px-4 py-3 font-semibold text-[11px] uppercase tracking-wider text-veyro-muted">
                  Order ID
                </th>
                <th className="text-left px-4 py-3 font-semibold text-[11px] uppercase tracking-wider text-veyro-muted">
                  Customer
                </th>
                <th className="text-left px-4 py-3 font-semibold text-[11px] uppercase tracking-wider text-veyro-muted">
                  Date
                </th>
                <th className="text-left px-4 py-3 font-semibold text-[11px] uppercase tracking-wider text-veyro-muted">
                  Items
                </th>
                <th className="text-left px-4 py-3 font-semibold text-[11px] uppercase tracking-wider text-veyro-muted">
                  Total
                </th>
                <th className="text-left px-4 py-3 font-semibold text-[11px] uppercase tracking-wider text-veyro-muted">
                  Status (Live Update)
                </th>
                <th className="text-right px-4 py-3 font-semibold text-[11px] uppercase tracking-wider text-veyro-muted">
                  Actions
                </th>
              </tr>
            </thead>
            <tbody>
              {filteredOrders.map((order) => {
                const customerName = order.shippingAddress?.name || "Customer";
                const itemsList = order.items || [];
                return (
                  <tr
                    key={order.id}
                    className="border-b border-veyro-border-light hover:bg-neutral-50/60 transition-colors"
                  >
                    <td className="px-4 py-3 font-mono text-xs font-bold text-veyro-black">
                      {order.id}
                    </td>
                    <td className="px-4 py-3">
                      <div className="font-medium text-xs text-neutral-900">{customerName}</div>
                      {order.shippingAddress?.phone && (
                        <div className="text-[11px] text-veyro-muted">
                          {order.shippingAddress.phone}
                        </div>
                      )}
                    </td>
                    <td className="px-4 py-3 text-xs text-neutral-600 whitespace-nowrap">
                      {order.date}
                    </td>
                    <td className="px-4 py-3">
                      <div className="text-xs max-w-[220px]">
                        {itemsList.length > 0 ? (
                          <>
                            <div className="truncate font-medium">
                              {itemsList[0].productName} ×{itemsList[0].quantity}
                            </div>
                            {itemsList.length > 1 && (
                              <div className="text-[11px] text-veyro-muted">
                                +{itemsList.length - 1} more item
                                {itemsList.length - 1 > 1 ? "s" : ""}
                              </div>
                            )}
                          </>
                        ) : order.itemNames && order.itemNames.length > 0 ? (
                          <div className="truncate font-medium">{order.itemNames.join(", ")}</div>
                        ) : (
                          <span className="text-veyro-muted">1 item</span>
                        )}
                      </div>
                    </td>
                    <td className="px-4 py-3 font-bold text-neutral-900">
                      ₹{(order.total || 0).toLocaleString("en-IN")}
                    </td>
                    <td className="px-4 py-3">
                      <select
                        value={order.status}
                        onChange={(e) =>
                          handleStatusChange(order.id, e.target.value as OrderStatus)
                        }
                        className={`text-xs font-semibold px-2.5 py-1.5 rounded-lg border focus:outline-none transition-colors cursor-pointer ${
                          order.status === "Delivered"
                            ? "bg-green-50 text-green-700 border-green-200"
                            : order.status === "Cancelled"
                              ? "bg-red-50 text-red-600 border-red-200"
                              : order.status === "Shipped" || order.status === "Out for Delivery"
                                ? "bg-blue-50 text-blue-700 border-blue-200"
                                : "bg-amber-50 text-amber-700 border-amber-200"
                        }`}
                      >
                        {ALL_STATUSES.map((s) => (
                          <option key={s} value={s}>
                            {s}
                          </option>
                        ))}
                      </select>
                    </td>
                    <td className="px-4 py-3 text-right">
                      <div className="flex items-center justify-end gap-1.5">
                        <button
                          onClick={() => setSelectedOrder(order)}
                          className="p-1.5 text-neutral-500 hover:text-neutral-900 hover:bg-neutral-100 rounded-md transition-colors"
                          title="View order details"
                          aria-label={`View order ${order.id}`}
                        >
                          <Eye size={16} />
                        </button>
                        <button
                          onClick={() => handleDelete(order.id)}
                          className="p-1.5 text-neutral-400 hover:text-red-600 hover:bg-red-50 rounded-md transition-colors"
                          title="Delete order"
                          aria-label={`Delete order ${order.id}`}
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

        {filteredOrders.length === 0 && (
          <div className="py-12 text-center text-veyro-muted text-sm">
            {orders.length === 0
              ? "No orders yet. Place an order on the store to test!"
              : "No orders match your search or filter."}
          </div>
        )}
      </div>

      {/* Order Details Modal */}
      {selectedOrder && (
        <div
          className="fixed inset-0 z-[10000] bg-black/60 flex items-center justify-center p-4 backdrop-blur-xs"
          onClick={() => setSelectedOrder(null)}
        >
          <div
            className="bg-white rounded-2xl max-w-2xl w-full max-h-[90vh] overflow-y-auto admin-scroll-container p-6 space-y-6 shadow-2xl"
            data-lenis-prevent
            onClick={(e) => e.stopPropagation()}
          >
            {/* Modal Header */}
            <div className="flex items-center justify-between border-b border-veyro-border pb-4">
              <div>
                <span className="text-xs font-mono font-bold text-veyro-muted uppercase">
                  Order Details
                </span>
                <h3 className="text-xl font-bold font-mono text-veyro-black">
                  {selectedOrder.id}
                </h3>
              </div>
              <button
                onClick={() => setSelectedOrder(null)}
                className="p-1.5 rounded-lg hover:bg-neutral-100 text-neutral-500 transition-colors"
                aria-label="Close details"
              >
                <X size={20} />
              </button>
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
                  <MapPin size={12} /> Delivery Address
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
                  <span className="uppercase font-semibold">{selectedOrder.paymentMethod}</span>
                </div>
              </div>
            </div>

            {/* Status Update Quick Bar */}
            <div className="p-4 bg-veyro-surface rounded-xl border border-veyro-border flex flex-col sm:flex-row sm:items-center justify-between gap-3">
              <div>
                <span className="text-xs text-veyro-muted">Current Order Status:</span>
                <div className="font-bold text-sm text-veyro-black">{selectedOrder.status}</div>
              </div>
              <div className="flex items-center gap-2">
                <span className="text-xs font-medium text-neutral-600">Change Status:</span>
                <select
                  value={selectedOrder.status}
                  onChange={(e) =>
                    handleStatusChange(selectedOrder.id, e.target.value as OrderStatus)
                  }
                  className="px-3 py-1.5 rounded-lg border border-neutral-300 text-xs font-semibold bg-white cursor-pointer"
                >
                  {ALL_STATUSES.map((s) => (
                    <option key={s} value={s}>
                      {s}
                    </option>
                  ))}
                </select>
              </div>
            </div>

            {/* Order Items */}
            <div>
              <h4 className="font-bold text-sm text-neutral-900 mb-3">
                Items ({selectedOrder.items?.length || selectedOrder.itemsCount || 1})
              </h4>
              <div className="space-y-3">
                {(selectedOrder.items || []).map((item, i) => (
                  <div
                    key={i}
                    className="flex items-center justify-between p-3 rounded-xl border border-neutral-100 bg-neutral-50/50"
                  >
                    <div className="flex items-center gap-3">
                      {item.imageUrl && (
                        <div className="w-12 h-12 rounded-lg overflow-hidden bg-neutral-100 flex-shrink-0 relative">
                          {/* eslint-disable-next-line @next/next/no-img-element */}
                          <img
                            src={item.imageUrl}
                            alt={item.productName}
                            className="w-full h-full object-cover"
                          />
                        </div>
                      )}
                      <div>
                        <div className="font-medium text-sm text-neutral-900">
                          {item.productName}
                        </div>
                        <div className="text-xs text-neutral-500">
                          Size: <span className="font-semibold">{item.selectedSize}</span> · Color:{" "}
                          <span className="font-semibold">{item.colorName}</span> · Qty:{" "}
                          <span className="font-semibold">{item.quantity}</span>
                        </div>
                      </div>
                    </div>
                    <div className="font-bold text-sm text-neutral-900">
                      ₹{(item.totalPrice || item.unitPrice * item.quantity).toLocaleString("en-IN")}
                    </div>
                  </div>
                ))}
              </div>
            </div>

            {/* Financial Summary */}
            <div className="border-t border-neutral-100 pt-4 space-y-1.5 text-xs">
              <div className="flex justify-between text-neutral-600">
                <span>Subtotal</span>
                <span>₹{(selectedOrder.subtotal || selectedOrder.total).toLocaleString("en-IN")}</span>
              </div>
              {selectedOrder.couponDiscount > 0 && (
                <div className="flex justify-between text-green-600 font-medium">
                  <span>Coupon Discount ({selectedOrder.couponCode})</span>
                  <span>-₹{selectedOrder.couponDiscount.toLocaleString("en-IN")}</span>
                </div>
              )}
              {selectedOrder.shippingCost > 0 && (
                <div className="flex justify-between text-neutral-600">
                  <span>Shipping Fee</span>
                  <span>₹{selectedOrder.shippingCost.toLocaleString("en-IN")}</span>
                </div>
              )}
              <div className="flex justify-between text-base font-bold text-neutral-900 pt-2 border-t border-neutral-200">
                <span>Total Paid</span>
                <span>₹{selectedOrder.total.toLocaleString("en-IN")}</span>
              </div>
            </div>

            {/* Timeline */}
            {selectedOrder.timeline && selectedOrder.timeline.length > 0 && (
              <div>
                <h4 className="font-bold text-xs uppercase tracking-wider text-neutral-500 mb-2">
                  Order Timeline
                </h4>
                <div className="space-y-2 border-l-2 border-neutral-200 pl-3 ml-1.5">
                  {selectedOrder.timeline.map((step, idx) => (
                    <div key={idx} className="relative text-xs">
                      <div className="flex items-center gap-2">
                        <span className="font-bold text-neutral-900">{step.status}</span>
                        <span className="text-[11px] text-neutral-500 font-mono">
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

function StatCard({
  icon,
  label,
  value,
  accent = false,
  detail,
}: {
  icon: React.ReactNode;
  label: string;
  value: string;
  accent?: boolean;
  detail?: string;
}) {
  return (
    <div
      className={`rounded-xl border p-5 transition-all ${
        accent
          ? "bg-veyro-yellow/10 border-veyro-yellow/40 shadow-xs"
          : "bg-white border-veyro-border"
      }`}
    >
      <div className="flex items-center gap-2.5 text-veyro-muted mb-3">
        {icon}
        <span className="text-[11px] font-semibold uppercase tracking-wider">{label}</span>
      </div>
      <div className="text-2xl font-bold text-veyro-black">{value}</div>
      {detail && <div className="text-[11px] text-veyro-muted mt-1">{detail}</div>}
    </div>
  );
}
