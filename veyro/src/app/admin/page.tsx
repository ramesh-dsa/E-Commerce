"use client";

import React, { useMemo, useState, useRef, useEffect, useDeferredValue } from "react";
import Link from "next/link";
import Image from "next/image";
import { motion, AnimatePresence, useReducedMotion } from "motion/react";
import { createPortal } from "react-dom";
import { useRouter } from "next/navigation";
import { useProducts } from "@/context/ProductsContext";
import { useCustomSections, type CustomSection } from "@/context/CustomSectionsContext";
import { useUser } from "@/context/UserContext";
import type { OrderRecord, OrderStatus, Product } from "@/types";
import { AdminDateRangePicker, DateFilterSelection, parseOrderDateToDayString, formatDayDisplay } from "@/components/admin/AdminDateRangePicker";
import { AdminHeader } from "@/components/admin/AdminHeader";
import { AdminIconBadge } from "@/components/admin/AdminIconBadge";
import { StaggerGroup, StaggerItem, CountUp, DUR_FAST, EASE } from "@/components/admin/motion";
import { useAnchoredMenu } from "@/components/admin/useAnchoredMenu";
import { AdminSelect } from "@/components/admin/AdminSelect";

const STOCK_FILTER_OPTIONS = [
  { value: "all", label: "All Inventory" },
  { value: "in_stock", label: "Healthy Stock (10+)" },
  { value: "low_stock", label: "Low Stock (≤10)" },
];

const TOP_PRODUCTS_SORT_OPTIONS = [
  { value: "revenue", label: "Sort: Highest Revenue" },
  { value: "units", label: "Sort: Most Units Sold" },
  { value: "margin", label: "Sort: Highest Margin %" },
  { value: "growth", label: "Sort: Fastest Growth" },
];

const RECENT_ORDERS_SORT_OPTIONS = [
  { value: "newest", label: "Newest First" },
  { value: "oldest", label: "Oldest First" },
  { value: "highest", label: "Amount: High to Low" },
  { value: "lowest", label: "Amount: Low to High" },
];
import {
  searchProducts,
  searchOrders,
  searchTopProducts,
  getUnifiedSearchableProducts,
  searchSections,
  normalizeSearchText,
  stripToAlphaNumeric,
} from "@/utils/searchEngine";
import {
  Search,
  Calendar,
  CalendarDays,
  Bell,
  ChevronLeft,
  ChevronRight,
  ArrowLeft,
  Plus,
  IndianRupee,
  ShoppingCart,
  ShoppingBag,
  Package,
  BarChart3,
  MoreHorizontal,
  ArrowUpRight,
  ArrowDownRight,
  Eye,
  Clock,
  SlidersHorizontal,
  Check,
  CheckCircle2,
  X,
  Sparkles,
  TrendingUp,
  AlertTriangle,
  RotateCcw,
  CheckCircle,
  Download,
  RotateCw,
  User,
  ExternalLink,
  Command,
  ArrowRight,
  Phone,
  MessageSquare,
  Award,
  Flame,
  Layers,
  Filter,
  ArrowUpDown,
  FileSpreadsheet,
  Boxes,
  Tag,
  Star,
  Percent,
  ShieldCheck,
  Printer,
  MapPin,
  CreditCard,
  Copy,
  FileText,
  Truck,
  RefreshCw,
  XCircle,
  PackageCheck,
  PhoneCall,
} from "lucide-react";
import { RingChart } from "@/components/charts/ring-chart";
import { Ring } from "@/components/charts/ring";
import { RingCenter } from "@/components/charts/ring-center";
import {
  Legend,
  LegendItem,
  LegendMarker,
  LegendLabel,
  LegendValue,
  LegendProgress,
} from "@/components/charts/legend";
import type { RingData } from "@/components/charts/ring-context";
import {
  AreaChart,
  Area,
  Grid,
  XAxis,
  YAxis,
  ChartTooltip,
} from "@/components/charts";
import { curveCatmullRom } from "@visx/curve";

// ─── STATIC DATA & ASSETS MATCHING TARGET DESIGN ──────────────────────────────

export interface TopProductVariant {
  size: string;
  sold: number;
  revenue: number;
  stock: number;
  isBestseller?: boolean;
}

export interface TopProductTimeframeMetrics {
  soldCount: number;
  revenue: number;
  growth: number;
}

export interface TopProductItem {
  rank: number;
  id: string;
  sku: string;
  name: string;
  category: "T-Shirts" | "Shoes" | "Watches";
  soldCount: number;
  revenue: number;
  unitPrice: number;
  cogs: number;
  marginPercent: number;
  imageUrl: string;
  slug: string;
  growth: number;
  growthDirection: "up" | "down";
  stock: number;
  stockStatus: "healthy" | "low" | "critical";
  returnRate: number;
  rating: number;
  reviewCount: number;
  isFeatured?: boolean;
  variants: TopProductVariant[];
  timeframeStats: {
    thisMonth: TopProductTimeframeMetrics;
    thisWeek: TopProductTimeframeMetrics;
    today: TopProductTimeframeMetrics;
    allTime: TopProductTimeframeMetrics;
  };
}

export const TOP_PRODUCTS_MASTER: TopProductItem[] = [
  {
    rank: 1,
    id: "vey-tsh-ovr-004",
    sku: "VEY-TSH-OVR-004",
    name: "Mark Graphic Oversized Tee",
    category: "T-Shirts",
    soldCount: 42,
    revenue: 62958,
    unitPrice: 1499,
    cogs: 620,
    marginPercent: 58.6,
    imageUrl: "/products/tshirts/mark-graphic-tee-charcoal-front.webp",
    slug: "mark-graphic-oversized-tee-charcoal",
    growth: 32.4,
    growthDirection: "up",
    stock: 38,
    stockStatus: "healthy",
    returnRate: 1.2,
    rating: 4.9,
    reviewCount: 128,
    isFeatured: true,
    variants: [
      { size: "S", sold: 10, revenue: 14990, stock: 8 },
      { size: "M", sold: 18, revenue: 26982, stock: 14, isBestseller: true },
      { size: "L", sold: 10, revenue: 14990, stock: 11 },
      { size: "XL", sold: 4, revenue: 5996, stock: 5 },
    ],
    timeframeStats: {
      thisMonth: { soldCount: 42, revenue: 62958, growth: 32.4 },
      thisWeek: { soldCount: 14, revenue: 20986, growth: 18.2 },
      today: { soldCount: 3, revenue: 4497, growth: 50.0 },
      allTime: { soldCount: 320, revenue: 479680, growth: 42.1 },
    },
  },
  {
    rank: 2,
    id: "vey-ftw-min-001",
    sku: "VEY-FTW-MIN-001",
    name: "Blanc Court Sneaker",
    category: "Shoes",
    soldCount: 38,
    revenue: 53962,
    unitPrice: 1420,
    cogs: 680,
    marginPercent: 52.1,
    imageUrl: "/products/shoes/veyro-shoe-01-primary.webp",
    slug: "blanc-court-sneaker-white",
    growth: 24.1,
    growthDirection: "up",
    stock: 14,
    stockStatus: "healthy",
    returnRate: 2.1,
    rating: 4.8,
    reviewCount: 96,
    isFeatured: true,
    variants: [
      { size: "UK 7", sold: 8, revenue: 11360, stock: 3 },
      { size: "UK 8", sold: 16, revenue: 22720, stock: 5, isBestseller: true },
      { size: "UK 9", sold: 10, revenue: 14200, stock: 4 },
      { size: "UK 10", sold: 4, revenue: 5680, stock: 2 },
    ],
    timeframeStats: {
      thisMonth: { soldCount: 38, revenue: 53962, growth: 24.1 },
      thisWeek: { soldCount: 12, revenue: 17040, growth: 15.0 },
      today: { soldCount: 2, revenue: 2840, growth: 20.0 },
      allTime: { soldCount: 280, revenue: 397600, growth: 31.0 },
    },
  },
  {
    rank: 3,
    id: "vey-wat-drz-004",
    sku: "VEY-WAT-DRZ-004",
    name: "King Seiko Automatic",
    category: "Watches",
    soldCount: 30,
    revenue: 47970,
    unitPrice: 1599,
    cogs: 750,
    marginPercent: 53.1,
    imageUrl: "/products/watches/seiko-watch.jpg",
    slug: "king-seiko-automatic-silver",
    growth: 18.7,
    growthDirection: "up",
    stock: 9,
    stockStatus: "low",
    returnRate: 0.8,
    rating: 4.95,
    reviewCount: 84,
    isFeatured: true,
    variants: [
      { size: "37mm Case", sold: 18, revenue: 28782, stock: 5, isBestseller: true },
      { size: "40mm Case", sold: 12, revenue: 19188, stock: 4 },
    ],
    timeframeStats: {
      thisMonth: { soldCount: 30, revenue: 47970, growth: 18.7 },
      thisWeek: { soldCount: 9, revenue: 14391, growth: 12.5 },
      today: { soldCount: 2, revenue: 3198, growth: 33.3 },
      allTime: { soldCount: 210, revenue: 335790, growth: 28.4 },
    },
  },
  {
    rank: 4,
    id: "vey-wat-aut-002",
    sku: "VEY-WAT-AUT-002",
    name: "Daniel Wellington Classic St Mawes",
    category: "Watches",
    soldCount: 26,
    revenue: 41574,
    unitPrice: 1599,
    cogs: 720,
    marginPercent: 55.0,
    imageUrl: "/products/watches/dw-watch.jpg",
    slug: "dw-classic-st-mawes",
    growth: 14.2,
    growthDirection: "up",
    stock: 18,
    stockStatus: "healthy",
    returnRate: 1.0,
    rating: 4.85,
    reviewCount: 62,
    variants: [
      { size: "40mm Case", sold: 26, revenue: 41574, stock: 18, isBestseller: true },
    ],
    timeframeStats: {
      thisMonth: { soldCount: 26, revenue: 41574, growth: 14.2 },
      thisWeek: { soldCount: 8, revenue: 12792, growth: 10.0 },
      today: { soldCount: 1, revenue: 1599, growth: 0.0 },
      allTime: { soldCount: 190, revenue: 303810, growth: 22.0 },
    },
  },
  {
    rank: 5,
    id: "vey-wat-chr-001",
    sku: "VEY-WAT-CHR-001",
    name: "Aigner Blue Roman Dial Watch",
    category: "Watches",
    soldCount: 22,
    revenue: 35178,
    unitPrice: 1599,
    cogs: 710,
    marginPercent: 55.6,
    imageUrl: "/products/watches/aigner-blue-watch.jpg",
    slug: "aigner-blue-roman-dial",
    growth: 9.8,
    growthDirection: "up",
    stock: 6,
    stockStatus: "low",
    returnRate: 1.5,
    rating: 4.78,
    reviewCount: 51,
    variants: [
      { size: "42mm Case", sold: 22, revenue: 35178, stock: 6, isBestseller: true },
    ],
    timeframeStats: {
      thisMonth: { soldCount: 22, revenue: 35178, growth: 9.8 },
      thisWeek: { soldCount: 6, revenue: 9594, growth: 8.0 },
      today: { soldCount: 1, revenue: 1599, growth: 0.0 },
      allTime: { soldCount: 165, revenue: 263835, growth: 19.5 },
    },
  },
  {
    rank: 6,
    id: "vey-tsh-gfx-001",
    sku: "VEY-TSH-GFX-001",
    name: "Apex Arachnid Graphic Tee",
    category: "T-Shirts",
    soldCount: 19,
    revenue: 28481,
    unitPrice: 1499,
    cogs: 610,
    marginPercent: 59.3,
    imageUrl: "/products/tshirts/apex-arachnid-front.webp",
    slug: "motto-typography-tee-black",
    growth: 16.5,
    growthDirection: "up",
    stock: 24,
    stockStatus: "healthy",
    returnRate: 1.1,
    rating: 4.9,
    reviewCount: 48,
    variants: [
      { size: "S", sold: 4, revenue: 5996, stock: 6 },
      { size: "M", sold: 9, revenue: 13491, stock: 10, isBestseller: true },
      { size: "L", sold: 4, revenue: 5996, stock: 5 },
      { size: "XL", sold: 2, revenue: 2998, stock: 3 },
    ],
    timeframeStats: {
      thisMonth: { soldCount: 19, revenue: 28481, growth: 16.5 },
      thisWeek: { soldCount: 5, revenue: 7495, growth: 11.0 },
      today: { soldCount: 1, revenue: 1499, growth: 25.0 },
      allTime: { soldCount: 140, revenue: 209860, growth: 24.0 },
    },
  },
  {
    rank: 7,
    id: "vey-ftw-min-002",
    sku: "VEY-FTW-MIN-002",
    name: "Mono Low Sneaker",
    category: "Shoes",
    soldCount: 17,
    revenue: 24140,
    unitPrice: 1420,
    cogs: 660,
    marginPercent: 53.5,
    imageUrl: "/products/shoes/veyro-shoe-02-primary.webp",
    slug: "mono-low-sneaker-black",
    growth: 12.0,
    growthDirection: "up",
    stock: 11,
    stockStatus: "healthy",
    returnRate: 2.4,
    rating: 4.7,
    reviewCount: 39,
    variants: [
      { size: "UK 8", sold: 9, revenue: 12780, stock: 5, isBestseller: true },
      { size: "UK 9", sold: 8, revenue: 11360, stock: 6 },
    ],
    timeframeStats: {
      thisMonth: { soldCount: 17, revenue: 24140, growth: 12.0 },
      thisWeek: { soldCount: 5, revenue: 7100, growth: 9.0 },
      today: { soldCount: 1, revenue: 1420, growth: 10.0 },
      allTime: { soldCount: 125, revenue: 177500, growth: 18.0 },
    },
  },
  {
    rank: 8,
    id: "vey-wat-div-003",
    sku: "VEY-WAT-DIV-003",
    name: "Cerruti 1881 Men RUSCELLO",
    category: "Watches",
    soldCount: 15,
    revenue: 23985,
    unitPrice: 1599,
    cogs: 740,
    marginPercent: 53.7,
    imageUrl: "/products/watches/cerruti-watch.jpg",
    slug: "cerruti-1881-ruscello",
    growth: 11.2,
    growthDirection: "up",
    stock: 8,
    stockStatus: "low",
    returnRate: 0.9,
    rating: 4.92,
    reviewCount: 41,
    variants: [
      { size: "45mm Case", sold: 15, revenue: 23985, stock: 8, isBestseller: true },
    ],
    timeframeStats: {
      thisMonth: { soldCount: 15, revenue: 23985, growth: 11.2 },
      thisWeek: { soldCount: 4, revenue: 6396, growth: 7.5 },
      today: { soldCount: 0, revenue: 0, growth: 0.0 },
      allTime: { soldCount: 110, revenue: 175890, growth: 15.0 },
    },
  },
  {
    rank: 9,
    id: "vey-tsh-gfx-002",
    sku: "VEY-TSH-GFX-002",
    name: "Echo Mythic Dragon Oversized Tee",
    category: "T-Shirts",
    soldCount: 13,
    revenue: 19487,
    unitPrice: 1499,
    cogs: 600,
    marginPercent: 60.0,
    imageUrl: "/products/tshirts/echo-dragon-oversized-tee-front.webp",
    slug: "echo-back-print-tee-off-white",
    growth: 8.5,
    growthDirection: "up",
    stock: 16,
    stockStatus: "healthy",
    returnRate: 1.3,
    rating: 4.88,
    reviewCount: 34,
    variants: [
      { size: "M", sold: 7, revenue: 10493, stock: 8, isBestseller: true },
      { size: "L", sold: 6, revenue: 8994, stock: 8 },
    ],
    timeframeStats: {
      thisMonth: { soldCount: 13, revenue: 19487, growth: 8.5 },
      thisWeek: { soldCount: 3, revenue: 4497, growth: 6.0 },
      today: { soldCount: 1, revenue: 1499, growth: 20.0 },
      allTime: { soldCount: 95, revenue: 142405, growth: 14.0 },
    },
  },
  {
    rank: 10,
    id: "vey-wat-fos-009",
    sku: "VEY-WAT-FOS-009",
    name: "Fossil Men's Chronograph Leather",
    category: "Watches",
    soldCount: 11,
    revenue: 17589,
    unitPrice: 1599,
    cogs: 730,
    marginPercent: 54.3,
    imageUrl: "/products/watches/fossil-watch.jpg",
    slug: "fossil-mens-chronograph-leather",
    growth: 7.1,
    growthDirection: "up",
    stock: 7,
    stockStatus: "low",
    returnRate: 1.0,
    rating: 4.8,
    reviewCount: 29,
    variants: [
      { size: "44mm Case", sold: 11, revenue: 17589, stock: 7, isBestseller: true },
    ],
    timeframeStats: {
      thisMonth: { soldCount: 11, revenue: 17589, growth: 7.1 },
      thisWeek: { soldCount: 3, revenue: 4797, growth: 5.0 },
      today: { soldCount: 0, revenue: 0, growth: 0.0 },
      allTime: { soldCount: 88, revenue: 140712, growth: 12.0 },
    },
  },
  {
    rank: 11,
    id: "vey-wat-emr-007",
    sku: "VEY-WAT-EMR-007",
    name: "Titan Raga Women's Watch",
    category: "Watches",
    soldCount: 9,
    revenue: 14391,
    unitPrice: 1599,
    cogs: 710,
    marginPercent: 55.6,
    imageUrl: "/products/watches/titan-raga.jpg",
    slug: "titan-raga-rose-gold",
    growth: 6.4,
    growthDirection: "up",
    stock: 5,
    stockStatus: "critical",
    returnRate: 0.7,
    rating: 4.95,
    reviewCount: 27,
    variants: [
      { size: "32mm Case", sold: 9, revenue: 14391, stock: 5, isBestseller: true },
    ],
    timeframeStats: {
      thisMonth: { soldCount: 9, revenue: 14391, growth: 6.4 },
      thisWeek: { soldCount: 2, revenue: 3198, growth: 4.0 },
      today: { soldCount: 0, revenue: 0, growth: 0.0 },
      allTime: { soldCount: 75, revenue: 119925, growth: 10.0 },
    },
  },
  {
    rank: 12,
    id: "vey-ftw-min-003",
    sku: "VEY-FTW-MIN-003",
    name: "Fog Low Sneaker",
    category: "Shoes",
    soldCount: 8,
    revenue: 11360,
    unitPrice: 1420,
    cogs: 670,
    marginPercent: 52.8,
    imageUrl: "/products/shoes/veyro-shoe-03-primary.webp",
    slug: "fog-low-sneaker-light-grey",
    growth: 5.2,
    growthDirection: "up",
    stock: 12,
    stockStatus: "healthy",
    returnRate: 2.0,
    rating: 4.75,
    reviewCount: 22,
    variants: [
      { size: "UK 8", sold: 5, revenue: 7100, stock: 7, isBestseller: true },
      { size: "UK 9", sold: 3, revenue: 4260, stock: 5 },
    ],
    timeframeStats: {
      thisMonth: { soldCount: 8, revenue: 11360, growth: 5.2 },
      thisWeek: { soldCount: 2, revenue: 2840, growth: 3.5 },
      today: { soldCount: 0, revenue: 0, growth: 0.0 },
      allTime: { soldCount: 65, revenue: 92300, growth: 8.5 },
    },
  },
];

export const TOP_PRODUCTS_TARGET: TopProductItem[] = TOP_PRODUCTS_MASTER;

// Revenue curve data points matching exact timeline with rich retail metrics
interface RevenuePoint {
  dayLabel: string;
  dateStr: string;
  value: number; // in ₹
  ordersCount: number; // daily order count
  growthPct?: string; // daily trend
}

const REVENUE_DATA_30D: RevenuePoint[] = (() => {
  const values = [
    1200, 1350, 1420, 1100, 1050, 1320, 1650, 1880, 1620, 1380,
    1550, 1780, 2050, 2420, 2150, 1820, 1710, 1950, 1840, 1650,
    1980, 2320, 2100, 1890, 1800, 2120, 2280, 2450, 2320, 2680,
  ];
  const orders = [
    12, 14, 15, 11, 10, 13, 17, 19, 16, 14,
    15, 18, 20, 24, 21, 18, 17, 19, 18, 16,
    20, 23, 21, 19, 18, 21, 23, 25, 23, 27,
  ];
  const now = new Date();
  const points: RevenuePoint[] = [];

  for (let i = 29; i >= 0; i--) {
    const d = new Date(now);
    d.setDate(now.getDate() - i);
    const months = ["Jan", "Feb", "Mar", "Apr", "May", "Jun", "Jul", "Aug", "Sep", "Oct", "Nov", "Dec"];
    const month = months[d.getMonth()];
    const day = d.getDate();
    const year = d.getFullYear();
    const dateStr = `${month} ${day}, ${year}`;
    const dayLabel = (i === 29 || i === 22 || i === 15 || i === 7 || i === 0) ? `${month} ${day}` : "";
    const idx = 29 - i;
    const prevVal = idx > 0 ? values[idx - 1] : values[0];
    const diff = values[idx] - prevVal;
    const pct = idx === 0 ? "+0%" : `${diff >= 0 ? "+" : ""}${((diff / prevVal) * 100).toFixed(1)}%`;

    points.push({
      dayLabel,
      dateStr,
      value: values[idx],
      ordersCount: orders[idx],
      growthPct: pct,
    });
  }
  return points;
})();

const REVENUE_DATA_7D: RevenuePoint[] = REVENUE_DATA_30D.slice(-7).map((p) => ({
  ...p,
  dayLabel: p.dateStr.split(",")[0],
}));

const REVENUE_DATA_90D: RevenuePoint[] = (() => {
  const values90 = [
    1100, 1320, 1540, 1680, 1820, 1750, 1950, 2020, 2100, 2280, 2420, 2680,
  ];
  const orders90 = [
    11, 13, 15, 17, 18, 17, 20, 21, 22, 23, 25, 27,
  ];
  const now = new Date();
  const points: RevenuePoint[] = [];
  const count = values90.length;
  for (let i = count - 1; i >= 0; i--) {
    const d = new Date(now);
    d.setDate(now.getDate() - i * 8);
    const months = ["Jan", "Feb", "Mar", "Apr", "May", "Jun", "Jul", "Aug", "Sep", "Oct", "Nov", "Dec"];
    const month = months[d.getMonth()];
    const day = d.getDate();
    const year = d.getFullYear();
    const dateStr = `${month} ${day}, ${year}`;
    const dayLabel = `${month} ${day}`;
    const idx = count - 1 - i;
    const prevVal = idx > 0 ? values90[idx - 1] : values90[0];
    const diff = values90[idx] - prevVal;
    const pct = idx === 0 ? "+0%" : `${diff >= 0 ? "+" : ""}${((diff / prevVal) * 100).toFixed(1)}%`;

    points.push({
      dayLabel,
      dateStr,
      value: values90[idx],
      ordersCount: orders90[idx],
      growthPct: pct,
    });
  }
  return points;
})();

// ─── AVATAR COLORS MAP ────────────────────────────────────────────────────────

const AVATAR_COLORS: Record<string, { bg: string; text: string }> = {
  B: { bg: "bg-blue-100", text: "text-blue-700" },
  K: { bg: "bg-amber-100", text: "text-amber-800" },
  P: { bg: "bg-purple-100", text: "text-purple-700" },
  A: { bg: "bg-emerald-100", text: "text-emerald-700" },
  D: { bg: "bg-orange-100", text: "text-orange-700" },
  S: { bg: "bg-sky-100", text: "text-sky-700" },
  R: { bg: "bg-rose-100", text: "text-rose-700" },
  M: { bg: "bg-indigo-100", text: "text-indigo-700" },
};

function getCustomerAvatar(name: string): { initial: string; bg: string; text: string } {
  const clean = name?.trim() || "Customer";
  const initial = clean.charAt(0).toUpperCase();
  if (AVATAR_COLORS[initial]) {
    return { initial, ...AVATAR_COLORS[initial] };
  }
  return { initial, bg: "bg-white/10", text: "text-white" };
}

// ─── STATUS PILL STYLING ──────────────────────────────────────────────────────

function StatusPill({ status }: { status: OrderStatus | string }) {
  let display = status;
  let pillClass = "bg-white/10 text-white/70 border border-white/10";

  switch (status) {
    case "Delivered":
      display = "Delivered";
      pillClass = "bg-[#00F59B]/15 text-[#00F59B] border border-[#00F59B]/20";
      break;
    case "Processing":
    case "Confirmed":
    case "Packed":
      display = "Processing";
      pillClass = "bg-[#F59E0B]/15 text-[#F59E0B] border border-[#F59E0B]/20";
      break;
    case "Shipped":
    case "Out for Delivery":
      display = "Shipped";
      pillClass = "bg-[#7C3AED]/15 text-[#7C3AED] border border-[#7C3AED]/20";
      break;
    case "Cancelled":
      display = "Cancelled";
      pillClass = "bg-[#FF4B55]/15 text-[#FF4B55] border border-[#FF4B55]/20";
      break;
    case "Return Requested":
      display = "Return Requested";
      pillClass = "bg-[#FF4B55]/15 text-[#FF4B55] border border-[#FF4B55]/20";
      break;
    case "Returned":
      display = "Returned";
      pillClass = "bg-white/10 text-white/70 border border-white/10";
      break;
  }

  return (
    <span
      className={`inline-flex items-center px-2.5 py-1 rounded-[8px] text-xs font-semibold whitespace-nowrap transition-colors ${pillClass}`}
    >
      {display}
    </span>
  );
}

// ─── SPARKLINE GENERATOR ──────────────────────────────────────────────────────

function SparklineBars() {
  return (
    <div className="relative">
      {/* Soft yellow ambient glow */}
      <div className="absolute -inset-1 bg-amber-100/40 rounded-full blur-sm pointer-events-none" />
      <svg width="54" height="32" viewBox="0 0 54 32" fill="none" className="relative z-10" aria-hidden="true">
        <rect x="2" y="24" width="3.5" height="8" rx="1.75" fill="#fef08a" opacity="0.65" />
        <rect x="8.5" y="21" width="3.5" height="11" rx="1.75" fill="#fef08a" opacity="0.8" />
        <rect x="15" y="18" width="3.5" height="14" rx="1.75" fill="#fde047" opacity="0.9" />
        <rect x="21.5" y="14" width="3.5" height="18" rx="1.75" fill="#fde047" />
        <rect x="28" y="11" width="3.5" height="21" rx="1.75" fill="#facc15" />
        <rect x="34.5" y="7" width="3.5" height="25" rx="1.75" fill="#facc15" />
        <rect x="41" y="4" width="3.5" height="28" rx="1.75" fill="#eab308" />
        <rect x="47.5" y="0" width="3.5" height="32" rx="1.75" fill="#ca8a04" />
      </svg>
    </div>
  );
}

function SparklineBlackLine() {
  return (
    <svg width="68" height="32" viewBox="0 0 68 32" fill="none" aria-hidden="true">
      <defs>
        <linearGradient id="blackGrad" x1="0" y1="0" x2="0" y2="1">
          <stop offset="0%" stopColor="#111827" stopOpacity="0.08" />
          <stop offset="100%" stopColor="#111827" stopOpacity="0.0" />
        </linearGradient>
      </defs>
      <path
        d="M 3 26 C 15 28, 22 18, 34 23 C 44 27, 52 11, 65 3 L 65 32 L 3 32 Z"
        fill="url(#blackGrad)"
      />
      <path
        d="M 3 26 C 15 28, 22 18, 34 23 C 44 27, 52 11, 65 3"
        stroke="#111827"
        strokeWidth="2.2"
        strokeLinecap="round"
        strokeLinejoin="round"
      />
    </svg>
  );
}

function SparklineRedWave() {
  return (
    <svg width="68" height="32" viewBox="0 0 68 32" fill="none" aria-hidden="true">
      <defs>
        <linearGradient id="redGrad" x1="0" y1="0" x2="0" y2="1">
          <stop offset="0%" stopColor="#ef4444" stopOpacity="0.22" />
          <stop offset="100%" stopColor="#ef4444" stopOpacity="0.0" />
        </linearGradient>
      </defs>
      <path
        d="M 3 24 C 14 24, 20 10, 32 15 C 44 20, 52 6, 65 8 L 65 32 L 3 32 Z"
        fill="url(#redGrad)"
      />
      <path
        d="M 3 24 C 14 24, 20 10, 32 15 C 44 20, 52 6, 65 8"
        stroke="#ef4444"
        strokeWidth="2.2"
        strokeLinecap="round"
        strokeLinejoin="round"
      />
    </svg>
  );
}

function SparklineGreenWave() {
  return (
    <svg width="68" height="32" viewBox="0 0 68 32" fill="none" aria-hidden="true">
      <defs>
        <linearGradient id="greenGrad" x1="0" y1="0" x2="0" y2="1">
          <stop offset="0%" stopColor="#10b981" stopOpacity="0.22" />
          <stop offset="100%" stopColor="#10b981" stopOpacity="0.0" />
        </linearGradient>
      </defs>
      <path
        d="M 3 25 C 14 29, 22 12, 34 18 C 44 24, 54 6, 65 8 L 65 32 L 3 32 Z"
        fill="url(#greenGrad)"
      />
      <path
        d="M 3 25 C 14 29, 22 12, 34 18 C 44 24, 54 6, 65 8"
        stroke="#10b981"
        strokeWidth="2.2"
        strokeLinecap="round"
        strokeLinejoin="round"
      />
    </svg>
  );
}

// ─── ACTION DROPDOWN FOR STAT CARDS ──────────────────────────────────────────

// ─── STOPWATCH ICON MATCHING IMAGE 1 TARGET ─────────────────────────────────

function StopwatchIcon({ className = "w-5 h-5 text-amber-600" }: { className?: string }) {
  return (
    <svg
      viewBox="0 0 24 24"
      fill="none"
      stroke="currentColor"
      strokeWidth="2.2"
      strokeLinecap="round"
      strokeLinejoin="round"
      className={className}
      aria-hidden="true"
    >
      {/* Top winding neck & pusher cap */}
      <line x1="12" y1="2" x2="12" y2="4.5" />
      <line x1="9.5" y1="2" x2="14.5" y2="2" />
      {/* Secondary angled button at 2 o'clock */}
      <line x1="18.5" y1="5.5" x2="20" y2="4" strokeWidth="2.4" />
      {/* Stopwatch circular dial */}
      <circle cx="12" cy="13.5" r="8" />
      {/* Center hub */}
      <circle cx="12" cy="13.5" r="0.9" fill="currentColor" stroke="none" />
      {/* Watch hands at 10 and 2 */}
      <polyline points="9.6,10.6 12,13.5 14.8,11.2" />
    </svg>
  );
}

// ─── ACTION DROPDOWN FOR STAT CARDS & REVENUE OVERVIEW ───────────────────────

function StatCardMenu({ title }: { title: string }) {
  const [open, setOpen] = useState(false);
  const ref = useRef<HTMLDivElement>(null);

  useEffect(() => {
    function handleClickOutside(e: MouseEvent) {
      if (ref.current && !ref.current.contains(e.target as Node)) {
        setOpen(false);
      }
    }
    if (open) document.addEventListener("mousedown", handleClickOutside);
    return () => document.removeEventListener("mousedown", handleClickOutside);
  }, [open]);

  const handleExportCSV = () => {
    const rows = [
      ["Metric Report", title],
      ["Exported At", new Date().toLocaleString()],
      ["Period", "30 Days"],
      ["", ""],
      ["Metric", "Value"],
      ["Total Revenue", "₹20,528"],
      ["Total Orders", "11"],
      ["Total Products", "35"],
      ["Avg. Order Value", "₹1,866"],
    ];
    const csvContent = "data:text/csv;charset=utf-8," + rows.map((e) => e.join(",")).join("\n");
    const link = document.createElement("a");
    link.setAttribute("href", encodeURI(csvContent));
    link.setAttribute("download", `veyro_${title.toLowerCase().replace(/\s+/g, "_")}.csv`);
    document.body.appendChild(link);
    link.click();
    document.body.removeChild(link);
    setOpen(false);
  };

  return (
    <div className="relative" ref={ref}>
      <button
        onClick={() => setOpen(!open)}
        className="w-7 h-7 rounded-[14px] flex items-center justify-center text-[var(--admin-text-muted)] hover:text-white hover:bg-white/[0.05] transition-colors cursor-pointer"
        aria-label={`Options for ${title}`}
      >
        <MoreHorizontal size={15} />
      </button>
      {open && (
        <div className="absolute right-0 top-full mt-1.5 w-48 bg-[var(--admin-surface)] rounded-[14px] border border-white/10 p-1.5 z-30 text-xs font-medium text-white shadow-2xl shadow-black/60 animate-in fade-in duration-150 space-y-0.5">
          <button
            onClick={handleExportCSV}
            className="w-full text-left px-2.5 py-2 rounded-[8px] hover:bg-white/10 flex items-center gap-2 cursor-pointer text-[var(--admin-text-muted)] hover:text-white transition-colors"
          >
            <Download size={13} className="text-[var(--admin-text-muted)]" />
            <span>Export CSV Report</span>
          </button>
          <button
            onClick={() => {
              window.print();
              setOpen(false);
            }}
            className="w-full text-left px-2.5 py-2 rounded-[8px] hover:bg-white/10 flex items-center gap-2 cursor-pointer text-[var(--admin-text-muted)] hover:text-white transition-colors"
          >
            <Eye size={13} className="text-[var(--admin-text-muted)]" />
            <span>Print View</span>
          </button>
        </div>
      )}
    </div>
  );
}

// ─── ACTION DROPDOWN FOR ORDER STATUS CARD ("..." MENU) ─────────────────────

function OrderStatusMenu({
  title,
  selectedStatus,
  onSelectStatus,
  onRefresh,
  stats,
}: {
  title: string;
  selectedStatus?: string | null;
  onSelectStatus?: (status: string | null) => void;
  onRefresh?: () => void;
  stats: {
    delivered: number;
    processing: number;
    shipped: number;
    cancelled: number;
    returned: number;
    totalOrd: number;
  };
}) {
  const [open, setOpen] = useState(false);
  const ref = useRef<HTMLDivElement>(null);

  useEffect(() => {
    function handleClickOutside(e: MouseEvent) {
      if (ref.current && !ref.current.contains(e.target as Node)) {
        setOpen(false);
      }
    }
    if (open) document.addEventListener("mousedown", handleClickOutside);
    return () => document.removeEventListener("mousedown", handleClickOutside);
  }, [open]);

  const handleExportCSV = () => {
    const rows = [
      ["Order Status Breakdown Report", ""],
      ["Generated At", new Date().toLocaleString()],
      ["", ""],
      ["Status", "Orders Count", "Share (%)"],
      ["Delivered", stats.delivered.toString(), `${((stats.delivered / stats.totalOrd) * 100).toFixed(1)}%`],
      ["Processing", stats.processing.toString(), `${((stats.processing / stats.totalOrd) * 100).toFixed(1)}%`],
      ["Shipped", stats.shipped.toString(), `${((stats.shipped / stats.totalOrd) * 100).toFixed(1)}%`],
      ["Cancelled", stats.cancelled.toString(), `${((stats.cancelled / stats.totalOrd) * 100).toFixed(1)}%`],
      ["Returned", stats.returned.toString(), `${((stats.returned / stats.totalOrd) * 100).toFixed(1)}%`],
      ["Total Orders", stats.totalOrd.toString(), "100.0%"],
    ];
    const csvContent = "data:text/csv;charset=utf-8," + rows.map((e) => e.join(",")).join("\n");
    const link = document.createElement("a");
    link.setAttribute("href", encodeURI(csvContent));
    link.setAttribute("download", `veyro_order_status_${Date.now()}.csv`);
    document.body.appendChild(link);
    link.click();
    document.body.removeChild(link);
    setOpen(false);
  };

  return (
    <div className="relative" ref={ref}>
      <button
        onClick={() => setOpen(!open)}
        className="w-8 h-8 rounded-[14px] flex items-center justify-center text-[var(--admin-text-muted)] hover:text-white hover:bg-white/[0.05] transition-colors cursor-pointer"
        aria-label="Order Status options"
      >
        <MoreHorizontal size={18} />
      </button>

      {open && (
        <div className="absolute right-0 top-full mt-1.5 w-56 bg-[var(--admin-surface)] rounded-[14px] border border-white/10 p-1.5 z-40 text-xs font-medium text-white shadow-2xl shadow-black/60 animate-in fade-in zoom-in-95 duration-150 space-y-0.5">
          <div className="px-2.5 py-1 text-[10px] font-semibold text-[var(--admin-text-muted)] uppercase tracking-wider">
            Filter View
          </div>
          <button
            onClick={() => {
              onSelectStatus?.(null);
              setOpen(false);
            }}
            className={`w-full text-left px-2.5 py-1.5 rounded-[8px] hover:bg-white/10 flex items-center justify-between cursor-pointer transition-colors ${
              !selectedStatus ? "bg-white/10 font-bold text-white" : "text-[var(--admin-text-muted)] hover:text-white"
            }`}
          >
            <span>All Statuses</span>
            <span className="text-[var(--admin-text-muted)] font-normal">{stats.totalOrd}</span>
          </button>
          {[
            { label: "Delivered", count: stats.delivered, dot: "bg-[#00F59B]" },
            { label: "Processing", count: stats.processing, dot: "bg-[#F59E0B]" },
            { label: "Shipped", count: stats.shipped, dot: "bg-[#7C3AED]" },
            { label: "Cancelled", count: stats.cancelled, dot: "bg-[#FF4B55]" },
            { label: "Returned", count: stats.returned, dot: "bg-white/40" },
          ].map((item) => (
            <button
              key={item.label}
              onClick={() => {
                onSelectStatus?.(selectedStatus === item.label ? null : item.label);
                setOpen(false);
              }}
              className={`w-full text-left px-2.5 py-1.5 rounded-[8px] hover:bg-white/10 flex items-center justify-between cursor-pointer transition-colors ${
                selectedStatus === item.label ? "bg-white/10 font-bold text-white" : "text-[var(--admin-text-muted)] hover:text-white"
              }`}
            >
              <div className="flex items-center gap-2">
                <span className={`w-2 h-2 rounded-full ${item.dot}`} />
                <span>{item.label}</span>
              </div>
              <span className="text-[var(--admin-text-muted)] font-normal">{item.count}</span>
            </button>
          ))}

          <div className="my-1 border-t border-white/5" />

          <div className="px-2.5 py-1 text-[10px] font-semibold text-[var(--admin-text-muted)] uppercase tracking-wider">
            Actions
          </div>
          <button
            onClick={handleExportCSV}
            className="w-full text-left px-2.5 py-2 rounded-[8px] hover:bg-white/10 flex items-center gap-2 cursor-pointer text-[var(--admin-text-muted)] hover:text-white transition-colors"
          >
            <Download size={14} className="text-[var(--admin-text-muted)]" />
            <span>Export Breakdown CSV</span>
          </button>
          <button
            onClick={() => {
              onRefresh?.();
              setOpen(false);
            }}
            className="w-full text-left px-2.5 py-2 rounded-[8px] hover:bg-white/10 flex items-center gap-2 cursor-pointer text-[var(--admin-text-muted)] hover:text-white transition-colors"
          >
            <RotateCw size={14} className="text-[var(--admin-text-muted)]" />
            <span>Refresh Metrics</span>
          </button>
        </div>
      )}
    </div>
  );
}

// ─── REVENUE CHART MENU ───────────────────────────────────────────────────────

function RevenueChartMenu({
  period,
  data,
  metricMode,
  setMetricMode,
  showGridlines,
  setShowGridlines,
  onResetPeak,
}: {
  period: "7d" | "30d" | "90d";
  data: RevenuePoint[];
  metricMode: "revenue" | "orders";
  setMetricMode: (m: "revenue" | "orders") => void;
  showGridlines: boolean;
  setShowGridlines: (v: boolean | ((prev: boolean) => boolean)) => void;
  onResetPeak: () => void;
}) {
  const [open, setOpen] = useState(false);
  const ref = useRef<HTMLDivElement>(null);

  useEffect(() => {
    function handleClickOutside(e: MouseEvent) {
      if (ref.current && !ref.current.contains(e.target as Node)) {
        setOpen(false);
      }
    }
    if (open) document.addEventListener("mousedown", handleClickOutside);
    return () => document.removeEventListener("mousedown", handleClickOutside);
  }, [open]);

  const handleExportCSV = () => {
    const rows = [
      ["Date", "Revenue (INR)", "Orders Count", "Daily Trend"],
      ...data.map((d) => [d.dateStr, d.value.toString(), d.ordersCount.toString(), d.growthPct || "0%"]),
    ];
    const csvContent = "data:text/csv;charset=utf-8," + rows.map((e) => e.join(",")).join("\n");
    const link = document.createElement("a");
    link.setAttribute("href", encodeURI(csvContent));
    link.setAttribute("download", `veyro_revenue_${period}_report.csv`);
    document.body.appendChild(link);
    link.click();
    document.body.removeChild(link);
    setOpen(false);
  };

  return (
    <div className="relative" ref={ref}>
      <button
        onClick={() => setOpen(!open)}
        className="w-8 h-8 rounded-[14px] flex items-center justify-center text-[var(--admin-text-muted)] hover:text-white hover:bg-white/[0.05] transition-colors cursor-pointer outline-none focus:outline-none"
        aria-label="Revenue chart options"
      >
        <MoreHorizontal size={16} />
      </button>

      {open && (
        <div className="absolute right-0 top-full mt-1.5 w-60 bg-[var(--admin-surface)] rounded-[14px] border border-white/10 p-1.5 z-40 text-xs font-medium text-white shadow-2xl shadow-black/60 animate-in fade-in duration-150 space-y-0.5">
          <div className="px-2.5 py-1 text-[10px] text-[var(--admin-text-muted)] font-semibold uppercase tracking-wider border-b border-white/5 mb-1">
            Chart View Options
          </div>
          <button
            onClick={() => {
              setMetricMode(metricMode === "revenue" ? "orders" : "revenue");
              setOpen(false);
            }}
            className="w-full text-left px-2.5 py-2 rounded-[8px] hover:bg-white/10 flex items-center justify-between cursor-pointer transition-colors text-[var(--admin-text-muted)] hover:text-white"
          >
            <div className="flex items-center gap-2">
              <BarChart3 size={13} className="text-[var(--admin-text-muted)]" />
              <span>Metric: {metricMode === "revenue" ? "Revenue (₹)" : "Orders (Units)"}</span>
            </div>
            <span className="text-[10px] text-[var(--admin-primary)] font-bold uppercase">Toggle</span>
          </button>
          <button
            onClick={() => {
              setShowGridlines((prev) => !prev);
              setOpen(false);
            }}
            className="w-full text-left px-2.5 py-2 rounded-[8px] hover:bg-white/10 flex items-center justify-between cursor-pointer transition-colors text-[var(--admin-text-muted)] hover:text-white"
          >
            <div className="flex items-center gap-2">
              <SlidersHorizontal size={13} className="text-[var(--admin-text-muted)]" />
              <span>Reference Gridlines</span>
            </div>
            <span className={`text-[10px] font-bold ${showGridlines ? "text-[#00F59B]" : "text-[var(--admin-text-muted)]"}`}>
              {showGridlines ? "ON" : "OFF"}
            </span>
          </button>
          <div className="border-t border-white/5 my-1" />
          <button
            onClick={handleExportCSV}
            className="w-full text-left px-2.5 py-2 rounded-[8px] hover:bg-white/10 flex items-center gap-2 cursor-pointer text-white font-semibold transition-colors"
          >
            <Download size={13} className="text-[var(--admin-text-muted)]" />
            <span>Export CSV Dataset</span>
          </button>
        </div>
      )}
    </div>
  );
}

// ─── REVENUE OVERVIEW CHART COMPONENT ────────────────────────────────────────

function RevenueOverviewChart({
  data,
  metricMode = "revenue",
  showGridlines = true,
}: {
  period: "7d" | "30d" | "90d";
  data: RevenuePoint[];
  metricMode?: "revenue" | "orders";
  showGridlines?: boolean;
  hoverIndex?: number | null;
  setHoverIndex?: (idx: number | null) => void;
}) {
  const formattedData = useMemo(() => {
    return data.map((d) => ({
      ...d,
      date: new Date(d.dateStr),
      value: metricMode === "revenue" ? d.value : d.ordersCount,
    }));
  }, [data, metricMode]);

  return (
    <div className="w-full">
      <AreaChart
        data={formattedData}
        aspectRatio="2.4 / 1"
        margin={{ top: 25, right: 28, bottom: 44, left: 54 }}
        animationDuration={800}
      >
        <YAxis
          numTicks={4}
          tickFormat={(val) =>
            metricMode === "revenue"
              ? val === 0
                ? "0"
                : `₹${(val / 1000).toFixed(0)}k`
              : val === 0
              ? "0"
              : `${val} ord`
          }
        />
        {showGridlines && (
          <Grid
            horizontal
            strokeDasharray="4,4"
            stroke="rgba(255, 255, 255, 0.22)"
            fadeHorizontal={false}
          />
        )}
        <Area
          dataKey="value"
          fill="#A855F7"
          stroke="#A855F7"
          strokeWidth={3.2}
          fillOpacity={0.32}
          curve={curveCatmullRom}
        />
        <XAxis />
        <ChartTooltip
          indicatorColor="rgba(255, 255, 255, 0.35)"
          rows={(point) => [
            {
              color: "#A855F7",
              label: metricMode === "revenue" ? "Revenue" : "Orders",
              value:
                metricMode === "revenue"
                  ? `₹${Number(point.value).toLocaleString("en-IN")}`
                  : `${point.value} Orders`,
            },
          ]}
        />
      </AreaChart>
    </div>
  );
}

// ─── ORDER STATUS BKLIT RING CHART COMPONENT ─────────────────────────────────

function OrderStatusDonut({
  deliveredCount = 7,
  processingCount = 2,
  shippedCount = 1,
  cancelledCount = 1,
  returnedCount = 0,
  onSelectStatus,
  selectedStatus,
}: {
  deliveredCount: number;
  processingCount: number;
  shippedCount: number;
  cancelledCount: number;
  returnedCount: number;
  onSelectStatus?: (status: string | null) => void;
  selectedStatus?: string | null;
}) {
  const total =
    deliveredCount +
      processingCount +
      shippedCount +
      cancelledCount +
      returnedCount || 14;

  const [hoveredIndex, setHoveredIndex] = useState<number | null>(null);

  // Modern Bklit UI color palette - sorted strictly descending by volume (highest -> lowest)
  const ringData: RingData[] = useMemo(() => {
    const raw: RingData[] = [
      {
        label: "Delivered",
        value: deliveredCount,
        maxValue: total,
        color: "#10b981", // Emerald 500
      },
      {
        label: "Processing",
        value: processingCount,
        maxValue: total,
        color: "#f59e0b", // Amber 500
      },
      {
        label: "Shipped",
        value: shippedCount,
        maxValue: total,
        color: "#6366f1", // Indigo 500
      },
      {
        label: "Cancelled",
        value: cancelledCount,
        maxValue: total,
        color: "#f43f5e", // Rose 500
      },
      {
        label: "Returned",
        value: returnedCount,
        maxValue: total,
        color: "#94a3b8", // Slate 400
      },
    ];

    // Order-wise descending: strictly Highest count (athigam) -> Lowest count (kammi)
    return [...raw].sort((a, b) => {
      if (b.value !== a.value) return b.value - a.value;
      const tieBreaker = ["Delivered", "Returned", "Processing", "Shipped", "Cancelled"];
      return tieBreaker.indexOf(a.label) - tieBreaker.indexOf(b.label);
    });
  }, [deliveredCount, processingCount, shippedCount, cancelledCount, returnedCount, total]);

  const selectedIndex = useMemo(() => {
    if (!selectedStatus) return null;
    const idx = ringData.findIndex((d) => d.label.toLowerCase() === selectedStatus.toLowerCase());
    return idx === -1 ? null : idx;
  }, [selectedStatus, ringData]);

  const handleSelectItem = (idx: number | null) => {
    if (idx === null) {
      onSelectStatus?.(null);
    } else {
      const item = ringData[idx];
      onSelectStatus?.(selectedStatus === item.label ? null : item.label);
    }
  };

  return (
    <div className="flex flex-col sm:flex-row items-center justify-between gap-6 sm:gap-8 w-full py-1">
      {/* Left: Ring Chart */}
      <div className="shrink-0 relative flex items-center justify-center select-none">
        <RingChart
          data={ringData}
          size={210}
          strokeWidth={9}
          ringGap={4}
          baseInnerRadius={44}
          hoveredIndex={hoveredIndex}
          onHoverChange={setHoveredIndex}
          className="overflow-visible [--chart-track:rgba(255,255,255,0.05)]"
        >
          {ringData.map((item, index) => (
            <Ring
              key={item.label}
              index={index}
              color={item.color}
              showGlow={true}
              lineCap="round"
            />
          ))}
          <RingCenter
            defaultLabel="Total Orders"
            className="select-none"
            valueClassName="text-[30px] font-black text-white tracking-tight leading-none font-heading tabular-nums"
            labelClassName="text-[10px] font-bold text-[var(--admin-text-muted)] mt-1 uppercase tracking-widest"
          >
            {({ value, label, isHovered, data }) => (
              <div className="flex flex-col items-center justify-center pointer-events-none select-none text-center px-1">
                <span
                  className="text-[30px] font-black tracking-tight leading-none transition-colors duration-200 font-heading tabular-nums"
                  style={{ color: isHovered && data?.color ? data.color : "#FFFFFF" }}
                >
                  {value}
                </span>
                <span
                  className="text-[10px] font-bold mt-1 tracking-wider uppercase transition-colors duration-200 whitespace-nowrap"
                  style={{ color: isHovered && data?.color ? data.color : "#71717A" }}
                >
                  {isHovered ? label : "Total Orders"}
                </span>
              </div>
            )}
          </RingCenter>
        </RingChart>
      </div>

      {/* Right: Legend with title and progress bars, exactly matching Bklit reference */}
      <div className="flex-1 min-w-0 w-full">
        <h3 className="text-[15px] font-heading font-bold text-white mb-2.5 tracking-tight">
          Orders by Status
        </h3>
        <Legend
          items={ringData}
          hoveredIndex={hoveredIndex}
          onHoverChange={setHoveredIndex}
          selectedIndex={selectedIndex}
          onSelectItem={(idx) => handleSelectItem(idx)}
          className="gap-2"
        >
          <LegendItem
            className="py-1.5 px-2 hover:bg-white/[0.03] rounded-[14px] transition-all cursor-pointer border border-transparent hover:border-white/5"
            selectedClassName="bg-white/10 border-white/15 text-white"
          >
            <div className="flex items-center justify-between w-full mb-1">
              <div className="flex items-center gap-2.5 min-w-0">
                <LegendMarker className="w-2.5 h-2.5 shrink-0" />
                <LegendLabel className="text-[13.5px] font-semibold text-white" />
              </div>
              <LegendValue
                className="text-[13.5px] gap-4 text-white"
                showPercentage={true}
                percentageClassName="text-xs font-semibold text-[var(--admin-text-muted)] w-12 text-right tabular-nums"
              />
            </div>
            <LegendProgress height="h-1.5" trackClassName="bg-white/5" />
          </LegendItem>
        </Legend>
      </div>
    </div>
  );
}

// ─── ADMIN PORTAL ROOT HELPER ────────────────────────────────────────────────

function AdminPortal({ children }: { children: React.ReactNode }) {
  const [mounted, setMounted] = useState(false);
  useEffect(() => {
    setMounted(true);
  }, []);

  if (!mounted || typeof document === "undefined") {
    return null;
  }
  return createPortal(children, document.body);
}

// ─── ORDER ROW ACTIONS MENU ──────────────────────────────────────────────────

function OrderRowMenu({
  order,
  onUpdateStatus,
  onInspectOrder,
  onDownloadSlip,
  onCopyId,
}: {
  order: OrderRecord;
  onUpdateStatus: (id: string, status: OrderStatus) => void;
  onInspectOrder?: (order: OrderRecord) => void;
  onDownloadSlip?: (order: OrderRecord) => void;
  onCopyId?: (id: string) => void;
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
  const initialY = shouldReduceMotion ? 0 : (placement === "top" ? 4 : -4);

  return (
    <div className="relative inline-block text-left">
      <button
        ref={triggerRef}
        onClick={(e) => {
          e.stopPropagation();
          setOpen(!open);
        }}
        onKeyDown={(e) => {
          if (e.key === "ArrowDown" || e.key === "ArrowUp") {
            e.preventDefault();
            if (!open) setOpen(true);
          }
        }}
        className="w-8 h-8 rounded-[14px] border border-white/10 bg-[var(--admin-surface-2)] hover:bg-white/[0.05]
          flex items-center justify-center text-[var(--admin-text-muted)] hover:text-white
          transition-colors cursor-pointer focus:outline-none"
        aria-label={`Actions for order ${order.id}`}
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
              transition={{ duration: shouldReduceMotion ? 0 : DUR_FAST, ease: EASE }}
              style={{
                position: "fixed",
                top: position ? `${position.top}px` : "-9999px",
                left: position ? `${position.left}px` : "-9999px",
                maxHeight: position?.maxHeight ? `${position.maxHeight}px` : undefined,
                visibility: position ? "visible" : "hidden",
                zIndex: 9999,
              }}
              className="w-56 bg-[var(--admin-surface)] rounded-[14px] border border-white/10 p-1.5 text-xs font-medium text-white shadow-2xl shadow-black/60 admin-scroll overflow-y-auto overscroll-contain space-y-0.5"
              role="menu"
              aria-label={`Actions for order ${order.id}`}
              onClick={(e) => e.stopPropagation()}
            >
              <button
                role="menuitem"
                tabIndex={-1}
                onClick={() => {
                  setOpen(false);
                  if (onInspectOrder) {
                    onInspectOrder(order);
                  }
                }}
                className="w-full text-left px-2.5 py-1.5 rounded-[8px] hover:bg-white/10 focus:bg-white/10 focus:outline-none flex items-center gap-2.5 font-semibold text-white cursor-pointer transition-colors"
              >
                <Eye size={13} className="text-[var(--admin-primary)]" /> Deep Inspect Order
              </button>

              {onDownloadSlip && (
                <button
                  role="menuitem"
                  tabIndex={-1}
                  onClick={() => {
                    setOpen(false);
                    onDownloadSlip(order);
                  }}
                  className="w-full text-left px-2.5 py-1.5 rounded-[8px] hover:bg-white/10 focus:bg-white/10 focus:outline-none flex items-center gap-2.5 text-[var(--admin-text-muted)] hover:text-white cursor-pointer transition-colors"
                >
                  <Download size={13} className="text-[var(--admin-text-muted)]" /> Download Invoice Slip
                </button>
              )}

              {onCopyId && (
                <button
                  role="menuitem"
                  tabIndex={-1}
                  onClick={() => {
                    setOpen(false);
                    onCopyId(order.id);
                  }}
                  className="w-full text-left px-2.5 py-1.5 rounded-[8px] hover:bg-white/10 focus:bg-white/10 focus:outline-none flex items-center gap-2.5 text-[var(--admin-text-muted)] hover:text-white cursor-pointer transition-colors"
                >
                  <FileSpreadsheet size={13} className="text-[var(--admin-text-muted)]" /> Copy Order ID
                </button>
              )}

              <div className="my-1 border-t border-white/5" role="separator" />
              <div className="px-2.5 py-1 text-[10px] font-bold text-[var(--admin-text-muted)] uppercase tracking-wider select-none">
                Quick Status Transition
              </div>
              <button
                role="menuitem"
                tabIndex={-1}
                onClick={() => {
                  onUpdateStatus(order.id, "Delivered");
                  setOpen(false);
                }}
                className="w-full text-left px-2.5 py-1.5 rounded-[8px] hover:bg-[#00F59B]/10 focus:bg-[#00F59B]/10 focus:outline-none flex items-center gap-2.5 text-[#00F59B] cursor-pointer transition-colors"
              >
                <CheckCircle size={13} /> Mark Delivered
              </button>
              <button
                role="menuitem"
                tabIndex={-1}
                onClick={() => {
                  onUpdateStatus(order.id, "Processing");
                  setOpen(false);
                }}
                className="w-full text-left px-2.5 py-1.5 rounded-[8px] hover:bg-[#F59E0B]/10 focus:bg-[#F59E0B]/10 focus:outline-none flex items-center gap-2.5 text-[#F59E0B] cursor-pointer transition-colors"
              >
                <Clock size={13} /> Mark Processing
              </button>
              <button
                role="menuitem"
                tabIndex={-1}
                onClick={() => {
                  onUpdateStatus(order.id, "Shipped");
                  setOpen(false);
                }}
                className="w-full text-left px-2.5 py-1.5 rounded-[8px] hover:bg-[#7C3AED]/15 focus:bg-[#7C3AED]/15 focus:outline-none flex items-center gap-2.5 text-[#7C3AED] cursor-pointer transition-colors"
              >
                <RotateCcw size={13} /> Mark Shipped
              </button>
              <button
                role="menuitem"
                tabIndex={-1}
                onClick={() => {
                  onUpdateStatus(order.id, "Cancelled");
                  setOpen(false);
                }}
                className="w-full text-left px-2.5 py-1.5 rounded-[8px] hover:bg-[#FF4B55]/10 focus:bg-[#FF4B55]/10 focus:outline-none flex items-center gap-2.5 text-[#FF4B55] cursor-pointer transition-colors"
              >
                <AlertTriangle size={13} /> Cancel Order
              </button>
            </motion.div>
          )}
        </AnimatePresence>
      </AdminPortal>
    </div>
  );
}

// ─── PENDING RETURN REQUESTS REVIEW MODAL ────────────────────────────────────

interface ReturnRequestData {
  orderId: string;
  orderTotal: number;
  requestedAt: string;
  reason: string;
  details?: string;
  status: "pending" | "approved" | "rejected";
  customerName: string;
  customerPhone: string;
  customerAddress: string;
  paymentMethod: string;
  item: {
    name: string;
    image: string;
    details: string;
    quantity: number;
    price: number;
  };
}

function ReturnRequestsReviewModal({
  isOpen,
  onClose,
  orders,
  onReviewReturn,
}: {
  isOpen: boolean;
  onClose: () => void;
  orders: OrderRecord[];
  onReviewReturn: (orderId: string, decision: "approved" | "rejected", note?: string) => void;
}) {
  const [activeTab, setActiveTab] = useState<"pending" | "resolved">("pending");
  const [rejectingOrderId, setRejectingOrderId] = useState<string | null>(null);
  const [rejectReason, setRejectReason] = useState("");
  const [toastMessage, setToastMessage] = useState<{ text: string; type: "success" | "reject" | "exchange" } | null>(null);

  // Keyboard Escape listener
  useEffect(() => {
    function handleKeyDown(e: KeyboardEvent) {
      if (e.key === "Escape") {
        e.preventDefault();
        e.stopPropagation();
        onClose();
      }
    }
    if (isOpen) {
      window.addEventListener("keydown", handleKeyDown, true);
    }
    return () => {
      window.removeEventListener("keydown", handleKeyDown, true);
    };
  }, [isOpen, onClose]);

  // Extract pending return requests from live orders
  const pendingRequests = useMemo(() => {
    const list: ReturnRequestData[] = [];
    orders.forEach((o) => {
      if (o.returnRequest && o.returnRequest.status === "pending") {
        const firstItem = o.items?.[0];
        list.push({
          orderId: o.id,
          orderTotal: o.total,
          requestedAt: o.returnRequest.requestedAt,
          reason: o.returnRequest.reason,
          details: o.returnRequest.details,
          status: o.returnRequest.status,
          customerName: o.shippingAddress?.name || "Customer",
          customerPhone: o.shippingAddress?.phone || "+91 98401 23456",
          customerAddress: o.shippingAddress?.address || "Chennai, Tamil Nadu",
          paymentMethod: o.paymentMethod || "Card",
          item: {
            name: firstItem?.productName || o.itemNames?.[0] || "Blanc Court Sneaker",
            image: firstItem?.imageUrl || "/products/shoes/blanc-court-sneaker.webp",
            details: `${firstItem?.colorName || "Original"} • Size ${firstItem?.selectedSize || "UK 8"}`,
            quantity: firstItem?.quantity || 1,
            price: firstItem?.totalPrice || o.total,
          },
        });
      }
    });
    return list;
  }, [orders]);

  // Extract resolved return requests (approved or rejected)
  const resolvedRequests = useMemo(() => {
    const list: ReturnRequestData[] = [];
    orders.forEach((o) => {
      if (
        o.returnRequest &&
        (o.returnRequest.status === "approved" || o.returnRequest.status === "rejected")
      ) {
        const firstItem = o.items?.[0];
        list.push({
          orderId: o.id,
          orderTotal: o.total,
          requestedAt: o.returnRequest.requestedAt,
          reason: o.returnRequest.reason,
          details: o.returnRequest.details,
          status: o.returnRequest.status,
          customerName: o.shippingAddress?.name || "Customer",
          customerPhone: o.shippingAddress?.phone || "+91 98401 23456",
          customerAddress: o.shippingAddress?.address || "Chennai, Tamil Nadu",
          paymentMethod: o.paymentMethod || "Card",
          item: {
            name: firstItem?.productName || o.itemNames?.[0] || "Blanc Court Sneaker",
            image: firstItem?.imageUrl || "/products/shoes/blanc-court-sneaker.webp",
            details: `${firstItem?.colorName || "Original"} • Size ${firstItem?.selectedSize || "UK 8"}`,
            quantity: firstItem?.quantity || 1,
            price: firstItem?.totalPrice || o.total,
          },
        });
      }
    });
    return list;
  }, [orders]);

  const showToast = (text: string, type: "success" | "reject" | "exchange" = "success") => {
    setToastMessage({ text, type });
    setTimeout(() => {
      setToastMessage(null);
    }, 4000);
  };

  const handleApproveRefund = (orderId: string, customerName: string, amount: number) => {
    onReviewReturn(orderId, "approved", `Full refund of ₹${amount.toLocaleString("en-IN")} initiated to original payment method.`);
    showToast(`Approved refund of ₹${amount.toLocaleString("en-IN")} for ${customerName}`, "success");
  };

  const handleApproveExchange = (orderId: string, customerName: string) => {
    onReviewReturn(orderId, "approved", "Exchange approved. Replacement order queued for warehouse fulfillment.");
    showToast(`Exchange approved for ${customerName}. Replacement order initiated.`, "exchange");
  };

  const handleConfirmReject = (orderId: string, customerName: string) => {
    const finalReason = rejectReason.trim() || "Item does not meet return policy requirements (worn / tags removed).";
    onReviewReturn(orderId, "rejected", finalReason);
    setRejectingOrderId(null);
    setRejectReason("");
    showToast(`Return request for ${customerName} was rejected.`, "reject");
  };

  const totalRefundExposure = pendingRequests.reduce((sum, r) => sum + r.item.price, 0);

  return (
    <motion.div 
      key="return-review-modal-backdrop"
      initial={{ opacity: 0 }}
      animate={{ opacity: 1 }}
      exit={{ opacity: 0 }}
      transition={{ duration: 0.22, ease: "easeOut" }}
      className="fixed inset-0 z-[100000] flex items-center justify-center p-3 sm:p-6 bg-black/45 backdrop-blur-md overflow-hidden"
      onClick={onClose}
    >
      <motion.div
        key="return-review-modal-card"
        initial={{ opacity: 0, scale: 0.95, y: 14 }}
        animate={{ opacity: 1, scale: 1, y: 0 }}
        exit={{ opacity: 0, scale: 0.95, y: 12 }}
        transition={{ duration: 0.26, ease: [0.16, 1, 0.3, 1] }}
        className="bg-[var(--admin-elevated)] rounded-[28px] max-w-2xl w-full my-auto border border-white/10 overflow-hidden flex flex-col max-h-[90vh]"
        role="dialog"
        aria-modal="true"
        aria-label="Return Requests Review Modal"
        onClick={(e) => e.stopPropagation()}
      >
        {/* Toast Alert */}
        {toastMessage && (
          <div className="bg-[var(--admin-surface)] text-white px-4 py-2.5 text-xs font-semibold text-center flex items-center justify-center gap-2 border-b border-white/5 animate-in slide-in-from-top duration-200">
            {toastMessage.type === "success" ? (
              <CheckCircle2 size={14} className="text-[var(--admin-success)] shrink-0" />
            ) : toastMessage.type === "exchange" ? (
              <RefreshCw size={14} className="text-[var(--admin-warning)] shrink-0" />
            ) : (
              <XCircle size={14} className="text-[var(--admin-danger)] shrink-0" />
            )}
            <span>{toastMessage.text}</span>
          </div>
        )}

        {/* Modal Header */}
        <div className="px-6 py-5 border-b border-white/5 flex items-center justify-between bg-[var(--admin-surface)]">
          <div className="flex items-center gap-3.5">
            <div className="w-11 h-11 rounded-[14px] bg-[var(--admin-warning)]/15 border border-[var(--admin-warning)]/25 flex items-center justify-center text-[var(--admin-warning)] shrink-0">
              <RotateCcw size={20} strokeWidth={2.2} />
            </div>
            <div>
              <div className="flex items-center gap-2">
                <h2 className="text-lg font-heading font-bold text-white tracking-tight leading-tight">
                  Return Requests Review
                </h2>
                {pendingRequests.length > 0 && (
                  <span className="px-2.5 py-0.5 rounded-full text-[11px] font-bold bg-[var(--admin-warning)]/15 text-[var(--admin-warning)] border border-[var(--admin-warning)]/30">
                    {pendingRequests.length} Pending
                  </span>
                )}
              </div>
              <p className="text-xs text-[var(--admin-text-muted)] font-normal mt-0.5">
                Review return reasons, approve instant refunds, or dispatch replacements
              </p>
            </div>
          </div>

          <button
            onClick={onClose}
            className="w-9 h-9 rounded-full hover:bg-white/5 text-[var(--admin-text-muted)] hover:text-white flex items-center justify-center transition-colors cursor-pointer outline-none"
            aria-label="Close modal"
          >
            <X size={18} />
          </button>
        </div>

        {/* Modal Sub-Header Tabs */}
        <div className="px-6 py-2.5 border-b border-white/5 bg-[var(--admin-surface)] flex items-center justify-between gap-3 text-xs">
          <div className="flex items-center gap-2">
            <button
              type="button"
              onClick={() => setActiveTab("pending")}
              className={`px-3.5 py-1.5 rounded-full font-bold transition-all cursor-pointer flex items-center gap-2 ${
                activeTab === "pending"
                  ? "bg-[var(--admin-primary)] text-white"
                  : "bg-white/5 text-[var(--admin-text-muted)] hover:text-white"
              }`}
            >
              <span>Pending Review</span>
              <span className={`px-1.5 py-0.2 rounded-full text-[10px] font-extrabold ${
                activeTab === "pending" ? "bg-white/20 text-white" : "bg-white/10 text-[var(--admin-text-muted)]"
              }`}>
                {pendingRequests.length}
              </span>
            </button>

            <button
              type="button"
              onClick={() => setActiveTab("resolved")}
              className={`px-3.5 py-1.5 rounded-full font-bold transition-all cursor-pointer flex items-center gap-2 ${
                activeTab === "resolved"
                  ? "bg-[var(--admin-primary)] text-white"
                  : "bg-white/5 text-[var(--admin-text-muted)] hover:text-white"
              }`}
            >
              <span>Resolved History</span>
              <span className={`px-1.5 py-0.2 rounded-full text-[10px] font-extrabold ${
                activeTab === "resolved" ? "bg-white/20 text-white" : "bg-white/10 text-[var(--admin-text-muted)]"
              }`}>
                {resolvedRequests.length}
              </span>
            </button>
          </div>

          {activeTab === "pending" && pendingRequests.length > 0 && (
            <div className="text-[11px] text-[var(--admin-text-muted)] hidden sm:block">
              Refund Exposure: <strong className="text-white font-heading font-bold tabular-nums">₹{totalRefundExposure.toLocaleString("en-IN")}</strong>
            </div>
          )}
        </div>

        {/* Modal Body */}
        <div className="p-6 overflow-y-auto admin-scroll space-y-4 flex-1 bg-[var(--admin-surface-2)]">
          {activeTab === "pending" ? (
            pendingRequests.length === 0 ? (
              <div className="py-12 text-center">
                <div className="w-16 h-16 rounded-full bg-[var(--admin-success)]/15 border border-[var(--admin-success)]/30 text-[var(--admin-success)] flex items-center justify-center mx-auto mb-3 text-2xl">
                  ✓
                </div>
                <h3 className="text-base font-heading font-bold text-white">
                  All Return Requests Resolved!
                </h3>
                <p className="text-xs text-[var(--admin-text-muted)] max-w-sm mx-auto mt-1 mb-5">
                  You have reviewed and processed every customer return request. Your customer service queue is 100% up to date.
                </p>
                <div className="flex items-center justify-center gap-3">
                  {resolvedRequests.length > 0 && (
                    <button
                      type="button"
                      onClick={() => setActiveTab("resolved")}
                      className="px-4 py-2 rounded-full bg-[var(--admin-surface)] hover:bg-white/5 border border-white/10 text-white text-xs font-bold transition-all cursor-pointer"
                    >
                      View Resolved History ({resolvedRequests.length})
                    </button>
                  )}
                  <button
                    onClick={onClose}
                    className="px-5 py-2 rounded-full bg-[var(--admin-primary)] hover:bg-[var(--admin-primary-hover)] text-white text-xs font-bold transition-all cursor-pointer"
                  >
                    Done & Return to Dashboard
                  </button>
                </div>
              </div>
            ) : (
              pendingRequests.map((req) => {
                const isRejecting = rejectingOrderId === req.orderId;
                const avatar = getCustomerAvatar(req.customerName);

                return (
                  <div
                    key={req.orderId}
                    className="bg-[var(--admin-surface)] rounded-[14px] border border-white/5 transition-colors overflow-hidden"
                  >
                    {/* Item Top Header */}
                    <div className="px-5 py-3.5 bg-[var(--admin-surface-2)] border-b border-white/5 flex flex-wrap items-center justify-between gap-2">
                      <div className="flex items-center gap-2.5">
                        <span className="font-mono text-xs font-bold text-white bg-white/5 px-2.5 py-1 rounded-[10px] border border-white/10">
                          {req.orderId}
                        </span>
                        <span className="text-[11px] text-[var(--admin-text-muted)]">
                          Requested: <strong className="text-white/80 font-medium">{req.requestedAt}</strong>
                        </span>
                      </div>

                      <div className="flex items-center gap-2">
                        <span className="inline-flex items-center gap-1.5 px-2.5 py-0.5 rounded-full text-[11px] font-semibold bg-[var(--admin-warning)]/15 text-[var(--admin-warning)] border border-[var(--admin-warning)]/30">
                          <span className="w-1.5 h-1.5 rounded-full bg-[var(--admin-warning)] animate-pulse" />
                          Pending Review
                        </span>
                        <span className="text-sm font-heading font-extrabold text-white tabular-nums">
                          ₹{req.item.price.toLocaleString("en-IN")}
                        </span>
                      </div>
                    </div>

                    <div className="p-5 space-y-4">
                      {/* Customer Row */}
                      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-3 pb-3 border-b border-white/5">
                        <div className="flex items-center gap-3">
                          <div className={`w-9 h-9 rounded-full ${avatar.bg} ${avatar.text} flex items-center justify-center font-bold text-xs shrink-0`}>
                            {avatar.initial}
                          </div>
                          <div>
                            <div className="text-xs font-bold text-white">
                              {req.customerName}
                            </div>
                            <div className="text-[11px] text-[var(--admin-text-muted)] truncate max-w-xs">
                              {req.customerAddress}
                            </div>
                          </div>
                        </div>

                        {/* Contact Actions */}
                        <div className="flex items-center gap-2 shrink-0">
                          <a
                            href={`tel:${req.customerPhone.replace(/\s+/g, "")}`}
                            className="px-3 py-1 rounded-full border border-white/10 bg-white/5 hover:bg-white/10 text-[11px] font-semibold text-white/90 flex items-center gap-1 transition-colors"
                          >
                            <Phone size={11} className="text-[var(--admin-text-muted)]" />
                            <span>Call</span>
                          </a>
                          <a
                            href={`https://wa.me/${req.customerPhone.replace(/[^0-9]/g, "")}?text=Hi%20${encodeURIComponent(req.customerName)},%20this%20is%20VEYRO%20Support%20regarding%20your%20return%20request%20for%20order%20${req.orderId}.`}
                            target="_blank"
                            rel="noopener noreferrer"
                            className="px-3 py-1 rounded-full border border-[var(--admin-success)]/30 bg-[var(--admin-success)]/15 hover:bg-[var(--admin-success)]/25 text-[11px] font-semibold text-[var(--admin-success)] flex items-center gap-1 transition-colors"
                          >
                            <MessageSquare size={11} className="text-[var(--admin-success)]" />
                            <span>WhatsApp</span>
                          </a>
                        </div>
                      </div>

                      {/* Product Card Row */}
                      <div className="flex items-center gap-3.5 bg-[var(--admin-surface-2)] p-3 rounded-[14px] border border-white/5">
                        <div className="relative w-12 h-12 rounded-[10px] bg-[var(--admin-surface)] border border-white/10 overflow-hidden shrink-0">
                          <Image
                            src={req.item.image}
                            alt={req.item.name}
                            fill
                            className="object-cover"
                          />
                        </div>
                        <div className="min-w-0 flex-1">
                          <div className="text-xs font-bold text-white truncate">
                            {req.item.name}
                          </div>
                          <div className="text-[11px] text-[var(--admin-text-muted)] mt-0.5">
                            {req.item.details} • Qty: {req.item.quantity}
                          </div>
                        </div>
                        <div className="text-right shrink-0">
                          <div className="text-xs font-heading font-bold text-white tabular-nums">
                            ₹{req.item.price.toLocaleString("en-IN")}
                          </div>
                          <div className="text-[10px] text-[var(--admin-text-muted)] capitalize">
                            {req.paymentMethod}
                          </div>
                        </div>
                      </div>

                      {/* Customer Return Reason Box */}
                      <div className="bg-[var(--admin-warning)]/10 border border-[var(--admin-warning)]/20 rounded-[14px] p-3.5 text-xs text-[var(--admin-warning)]">
                        <div className="flex items-center gap-1.5 font-bold text-[var(--admin-warning)] mb-1">
                          <AlertTriangle size={13} className="text-[var(--admin-warning)] shrink-0" />
                          <span>Return Reason: {req.reason}</span>
                        </div>
                        {req.details && (
                          <p className="text-[11px] text-white/80 leading-relaxed pl-4 border-l-2 border-[var(--admin-warning)]/60 ml-1 italic mt-1.5">
                            &quot;{req.details}&quot;
                          </p>
                        )}
                      </div>

                      {/* Reject Dialog Form */}
                      {isRejecting ? (
                        <div className="bg-[var(--admin-danger)]/10 border border-[var(--admin-danger)]/20 rounded-[14px] p-3.5 space-y-3 animate-in fade-in duration-150">
                          <div className="text-xs font-bold text-[var(--admin-danger)]">
                            Specify Rejection Reason:
                          </div>
                          <div className="flex flex-wrap gap-1.5">
                            {[
                              "Item tags removed / worn",
                              "Exceeded 7-day return window",
                              "Item damaged by customer",
                              "Defect not found upon verification",
                            ].map((pre) => (
                              <button
                                key={pre}
                                type="button"
                                onClick={() => setRejectReason(pre)}
                                className={`px-2.5 py-1 rounded-full text-[10px] font-medium transition-colors cursor-pointer ${
                                  rejectReason === pre
                                    ? "bg-[var(--admin-danger)] text-white font-bold"
                                    : "bg-white/5 text-white/80 border border-white/10 hover:bg-white/10"
                                }`}
                              >
                                {pre}
                              </button>
                            ))}
                          </div>
                          <input
                            type="text"
                            value={rejectReason}
                            onChange={(e) => setRejectReason(e.target.value)}
                            placeholder="Or type a custom rejection note for customer..."
                            className="w-full text-xs px-3 py-2 bg-[var(--admin-surface-2)] text-white placeholder-[var(--admin-text-muted)] rounded-[14px] border border-white/10 focus:outline-none focus:border-[var(--admin-danger)]"
                          />
                          <div className="flex items-center justify-end gap-2 pt-1">
                            <button
                              type="button"
                              onClick={() => {
                                setRejectingOrderId(null);
                                setRejectReason("");
                              }}
                              className="px-3 py-1.5 text-xs text-[var(--admin-text-muted)] hover:text-white font-semibold cursor-pointer"
                            >
                              Cancel
                            </button>
                            <button
                              type="button"
                              onClick={() => handleConfirmReject(req.orderId, req.customerName)}
                              className="px-4 py-1.5 bg-[var(--admin-danger)] hover:bg-[var(--admin-danger)]/80 text-white text-xs font-bold rounded-full transition-all cursor-pointer"
                            >
                              Confirm Rejection
                            </button>
                          </div>
                        </div>
                      ) : (
                        /* Action Buttons */
                        <div className="flex flex-wrap items-center gap-2 pt-1">
                          <button
                            type="button"
                            onClick={() => handleApproveRefund(req.orderId, req.customerName, req.item.price)}
                            className="flex-1 min-w-[170px] bg-[var(--admin-success)] hover:brightness-110 text-black py-2.5 px-4 rounded-full text-xs font-bold flex items-center justify-center gap-1.5 transition-all cursor-pointer"
                          >
                            <CheckCircle2 size={14} />
                            <span>Approve & Refund ₹{req.item.price.toLocaleString("en-IN")}</span>
                          </button>

                          <button
                            type="button"
                            onClick={() => handleApproveExchange(req.orderId, req.customerName)}
                            className="bg-[var(--admin-surface)] hover:bg-white/5 border border-white/10 text-white py-2.5 px-4 rounded-full text-xs font-semibold flex items-center justify-center gap-1.5 transition-all cursor-pointer"
                          >
                            <RotateCcw size={13} />
                            <span>Approve Exchange</span>
                          </button>

                          <button
                            type="button"
                            onClick={() => {
                              setRejectingOrderId(req.orderId);
                              setRejectReason("Item tags removed / worn");
                            }}
                            className="bg-[var(--admin-danger)]/15 hover:bg-[var(--admin-danger)]/25 text-[var(--admin-danger)] border border-[var(--admin-danger)]/30 py-2.5 px-4 rounded-full text-xs font-semibold transition-colors cursor-pointer"
                          >
                            Reject
                          </button>
                        </div>
                      )}
                    </div>
                  </div>
                );
              })
            )
          ) : (
            /* Resolved History Tab */
            resolvedRequests.length === 0 ? (
              <div className="py-12 text-center text-[var(--admin-text-muted)] text-xs">
                No processed returns in history yet. Review pending requests to populate audit log.
              </div>
            ) : (
              resolvedRequests.map((req) => {
                const avatar = getCustomerAvatar(req.customerName);
                const isApproved = req.status === "approved";

                return (
                  <div
                    key={req.orderId}
                    className="bg-[var(--admin-surface)] rounded-[14px] border border-white/5 p-4 space-y-3"
                  >
                    <div className="flex items-center justify-between gap-2 border-b border-white/5 pb-3">
                      <div className="flex items-center gap-2.5">
                        <span className="font-mono text-xs font-bold text-white bg-white/5 px-2 py-0.5 rounded-[8px] border border-white/10">
                          {req.orderId}
                        </span>
                        <span className="text-xs font-semibold text-white">
                          {req.customerName}
                        </span>
                      </div>
                      <span
                        className={`inline-flex items-center gap-1.5 px-2.5 py-0.5 rounded-full text-[11px] font-bold ${
                          isApproved
                            ? "bg-[var(--admin-success)]/15 text-[var(--admin-success)] border border-[var(--admin-success)]/30"
                            : "bg-[var(--admin-danger)]/15 text-[var(--admin-danger)] border border-[var(--admin-danger)]/30"
                        }`}
                      >
                        {isApproved ? (
                          <>
                            <CheckCircle2 size={12} className="text-[var(--admin-success)]" />
                            <span>Approved</span>
                          </>
                        ) : (
                          <>
                            <XCircle size={12} className="text-[var(--admin-danger)]" />
                            <span>Rejected</span>
                          </>
                        )}
                      </span>
                    </div>

                    <div className="flex items-center gap-3">
                      <div className="relative w-10 h-10 rounded-[10px] overflow-hidden bg-[var(--admin-surface-2)] shrink-0 border border-white/10">
                        <Image src={req.item.image} alt={req.item.name} fill className="object-cover" />
                      </div>
                      <div className="min-w-0 flex-1 text-xs">
                        <div className="font-bold text-white truncate">{req.item.name}</div>
                        <div className="text-[var(--admin-text-muted)] text-[11px]">{req.item.details} • ₹{req.item.price.toLocaleString("en-IN")}</div>
                      </div>
                    </div>

                    <div className="text-[11px] bg-[var(--admin-surface-2)] p-2.5 rounded-[10px] border border-white/5 text-[var(--admin-text-muted)]">
                      <span className="font-semibold text-white">Resolution Note: </span>
                      {req.details || "Processed by administrator"}
                    </div>
                  </div>
                );
              })
            )
          )}
        </div>

        {/* Modal Footer */}
        <div className="px-6 py-4 border-t border-white/5 bg-[var(--admin-surface)] flex flex-col sm:flex-row sm:items-center justify-between gap-3 text-xs">
          <div className="text-[var(--admin-text-muted)]">
            {pendingRequests.length > 0 ? (
              <>
                Total pending refund exposure:{" "}
                <strong className="text-white font-heading font-bold tabular-nums">
                  ₹{totalRefundExposure.toLocaleString("en-IN")}
                </strong>{" "}
                across {pendingRequests.length} item{pendingRequests.length === 1 ? "" : "s"}
              </>
            ) : (
              <span className="text-[var(--admin-success)] font-semibold">
                ✓ All customer returns processed &amp; synchronized.
              </span>
            )}
          </div>
          <Link
            href="/admin/orders"
            onClick={onClose}
            className="text-[var(--admin-primary)] hover:underline font-bold flex items-center gap-1"
          >
            <span>View Full Orders Manager</span>
            <ArrowRight size={13} />
          </Link>
        </div>
      </motion.div>
    </motion.div>
  );
}

// ─── TOP PRODUCTS CSV EXPORT UTILITIES ───────────────────────────────────────

function downloadProductCSV(product: TopProductItem) {
  const rows = [
    ["VEYRO LUXURY RETAIL - PRODUCT SALES & PERFORMANCE REPORT"],
    ["Report Timestamp", new Date().toLocaleString("en-IN")],
    [],
    ["Product Overview"],
    ["Product Name", product.name],
    ["SKU", product.sku],
    ["Category", product.category],
    ["Rank", product.rank.toString()],
    ["Retail Price (INR)", product.unitPrice.toString()],
    ["Unit Cost / COGS (INR)", product.cogs.toString()],
    ["Gross Margin %", `${product.marginPercent}%`],
    ["Total Units Sold", product.soldCount.toString()],
    ["Gross Revenue (INR)", product.revenue.toString()],
    ["Current Stock Remaining", product.stock.toString()],
    ["Stock Health Status", product.stockStatus.toUpperCase()],
    ["Return Rate %", `${product.returnRate}%`],
    ["Customer Rating", `${product.rating} / 5.0 (${product.reviewCount} reviews)`],
    [],
    ["Variant / Size Velocity Breakdown"],
    ["Size / Variant", "Units Sold", "Revenue (INR)", "Current Stock", "Bestseller"],
    ...product.variants.map((v) => [
      v.size,
      v.sold.toString(),
      v.revenue.toString(),
      v.stock.toString(),
      v.isBestseller ? "YES (Top Volume)" : "Normal",
    ]),
  ];

  const csvContent = rows
    .map((r) => r.map((cell) => `"${(cell || "").toString().replace(/"/g, '""')}"`).join(","))
    .join("\n");

  const blob = new Blob([csvContent], { type: "text/csv;charset=utf-8;" });
  const url = URL.createObjectURL(blob);
  const link = document.createElement("a");
  link.setAttribute("href", url);
  link.setAttribute("download", `VEYRO_${product.sku}_Performance_Report.csv`);
  document.body.appendChild(link);
  link.click();
  document.body.removeChild(link);
  URL.revokeObjectURL(url);
}

function downloadAllProductsCSV(items: TopProductItem[], timeframeLabel: string = "Month") {
  const headers = [
    "Rank",
    "Product Name",
    "SKU",
    "Category",
    "Units Sold",
    "Retail Price (INR)",
    "Unit Cost (INR)",
    "Gross Margin %",
    "Gross Revenue (INR)",
    "Current Stock",
    "Stock Status",
    "Growth %",
    "Return Rate %",
    "Rating",
  ];

  const rows = items.map((p) => [
    p.rank.toString(),
    p.name,
    p.sku,
    p.category,
    p.soldCount.toString(),
    p.unitPrice.toString(),
    p.cogs.toString(),
    `${p.marginPercent}%`,
    p.revenue.toString(),
    p.stock.toString(),
    p.stockStatus.toUpperCase(),
    `+${p.growth}%`,
    `${p.returnRate}%`,
    `${p.rating}/5.0`,
  ]);

  const allRows = [
    [`VEYRO CATALOG SALES LEADERBOARD - ${timeframeLabel.toUpperCase()}`],
    ["Generated At", new Date().toLocaleString("en-IN")],
    [],
    headers,
    ...rows,
  ];

  const csvContent = allRows
    .map((r) => r.map((cell) => `"${(cell || "").toString().replace(/"/g, '""')}"`).join(","))
    .join("\n");

  const blob = new Blob([csvContent], { type: "text/csv;charset=utf-8;" });
  const url = URL.createObjectURL(blob);
  const link = document.createElement("a");
  link.setAttribute("href", url);
  link.setAttribute("download", `VEYRO_Top_Products_Leaderboard_${timeframeLabel.toLowerCase()}_2026.csv`);
  document.body.appendChild(link);
  link.click();
  document.body.removeChild(link);
  URL.revokeObjectURL(url);
}

// ─── DEEP PRODUCT PERFORMANCE & RETAIL INSIGHTS MODAL ─────────────────────────

function ProductPerformanceModal({
  product,
  onClose,
  orders,
  onUpdateStock,
  onUpdatePrice,
  showToast,
  isNested = false,
}: {
  product: TopProductItem | null;
  onClose: () => void;
  orders: OrderRecord[];
  onUpdateStock: (productId: string, newStock: number) => void;
  onUpdatePrice: (productId: string, newPrice: number) => void;
  showToast: (msg: string) => void;
  isNested?: boolean;
}) {
  const { products: catalogProducts } = useProducts();
  const [activeTab, setActiveTab] = useState<"variants" | "orders" | "actions">("variants");
  const [stockInput, setStockInput] = useState<number>(product ? product.stock : 0);
  const [priceInput, setPriceInput] = useState<number>(product ? product.unitPrice : 0);

  // Dynamic resilient resolution so Live Store never 404s or shows the wrong product
  const liveStoreSlug = useMemo(() => {
    if (!product) return "";
    // 1. Direct slug match in live catalog
    if (product.slug && catalogProducts.some((p) => p.slug === product.slug)) {
      return product.slug;
    }
    // 2. Match by SKU
    if (product.sku) {
      const matchBySku = catalogProducts.find(
        (p) => p.sku && p.sku.toUpperCase() === product.sku.toUpperCase()
      );
      if (matchBySku) return matchBySku.slug;
    }
    // 3. Match by ID
    if (product.id) {
      const matchById = catalogProducts.find((p) => p.id === product.id);
      if (matchById) return matchById.slug;
    }
    // 4. Match by primary image URL
    if (product.imageUrl) {
      const matchByImg = catalogProducts.find(
        (p) => p.imageUrl === product.imageUrl || p.secondaryImageUrl === product.imageUrl
      );
      if (matchByImg) return matchByImg.slug;
    }
    // 5. Match by exact or partial name
    const targetName = product.name.trim().toLowerCase();
    const matchByName = catalogProducts.find(
      (p) =>
        p.name.trim().toLowerCase() === targetName ||
        p.name.toLowerCase().includes(targetName) ||
        targetName.includes(p.name.toLowerCase())
    );
    if (matchByName) return matchByName.slug;

    return product.slug || "";
  }, [product, catalogProducts]);

  // Sync inputs whenever selected product changes
  useEffect(() => {
    if (product) {
      setStockInput(product.stock);
      setPriceInput(product.unitPrice);
      setActiveTab("variants");
    }
  }, [product]);

  // Keyboard Escape listener
  useEffect(() => {
    function handleKeyDown(e: KeyboardEvent) {
      if (e.key === "Escape") {
        e.preventDefault();
        e.stopPropagation();
        onClose();
      }
    }
    if (product) {
      window.addEventListener("keydown", handleKeyDown, true);
    }
    return () => {
      window.removeEventListener("keydown", handleKeyDown, true);
    };
  }, [product, onClose]);

  if (!product) return null;

  // Filter orders containing this item or similar category
  const matchingOrders = orders.filter((o) =>
    o.items?.some(
      (it) =>
        it.productName.toLowerCase().includes(product.name.toLowerCase()) ||
        product.name.toLowerCase().includes(it.productName.toLowerCase()) ||
        it.productSlug === product.slug ||
        (liveStoreSlug && it.productSlug === liveStoreSlug) ||
        it.productId === product.id
    )
  );

  // Dynamically scale/derive variant performance so it 100% matches active hero card volume
  const activeVariants = useMemo(() => {
    if (!product.variants || product.variants.length === 0) {
      return [
        {
          size: "Standard",
          sold: product.soldCount,
          revenue: product.revenue,
          stock: product.stock,
          isBestseller: true,
        },
      ];
    }

    if (product.variants.length === 1) {
      return [
        {
          ...product.variants[0],
          sold: product.soldCount,
          revenue: product.revenue,
          stock: product.stock,
        },
      ];
    }

    const baseSum = product.variants.reduce((acc, v) => acc + (v.sold || 1), 0) || 1;
    let runningSold = 0;
    let runningRev = 0;

    return product.variants.map((v, idx) => {
      const isLast = idx === product.variants.length - 1;
      const weight = (v.sold || 1) / baseSum;
      const vSold = isLast ? Math.max(0, product.soldCount - runningSold) : Math.round(product.soldCount * weight);
      const vRev = isLast ? Math.max(0, product.revenue - runningRev) : Math.round(product.revenue * weight);
      runningSold += vSold;
      runningRev += vRev;

      return {
        ...v,
        sold: vSold,
        revenue: vRev,
      };
    });
  }, [product]);

  // Calculated live gross margin based on priceInput
  const simulatedMargin = priceInput > 0
    ? Math.round(((priceInput - product.cogs) / priceInput) * 1000) / 10
    : 0;

  const handleStockSave = () => {
    onUpdateStock(product.id, stockInput);
    showToast(`Stock updated to ${stockInput} units for ${product.name}`);
  };

  const handlePriceSave = () => {
    onUpdatePrice(product.id, priceInput);
    showToast(`Retail price set to ₹${priceInput.toLocaleString("en-IN")} (${simulatedMargin}% margin)`);
  };

  const handleDownloadCSV = () => {
    downloadProductCSV(product);
    showToast(`Performance report downloaded for ${product.name}`);
  };

  return (
    <motion.div
      key="product-performance-modal-backdrop"
      initial={{ opacity: 0 }}
      animate={{ opacity: 1 }}
      exit={{ opacity: 0 }}
      transition={{ duration: 0.22, ease: "easeOut" }}
      className={`fixed inset-0 z-[100010] flex items-center justify-center p-3 sm:p-5 overflow-hidden ${
        isNested ? "bg-transparent" : "bg-black/45 backdrop-blur-md"
      }`}
      onClick={onClose}
    >
      <motion.div
        key="product-performance-modal-card"
        initial={{ opacity: 0, scale: 0.95, y: 16 }}
        animate={{ opacity: 1, scale: 1, y: 0 }}
        exit={{ opacity: 0, scale: 0.95, y: 12 }}
        transition={{ duration: 0.26, ease: [0.16, 1, 0.3, 1] }}
        className="bg-[var(--admin-elevated)] rounded-[28px] border border-white/10 max-w-3xl w-full overflow-hidden flex flex-col my-auto max-h-[88vh] shadow-2xl"
        onClick={(e) => e.stopPropagation()}
      >
        {/* Header */}
        <div className="px-5 py-4 sm:px-6 sm:py-4 bg-[var(--admin-surface)] border-b border-white/5 flex items-center justify-between gap-3">
          <div className="flex items-center gap-3.5 min-w-0 flex-1">
            <div className="w-12 h-12 rounded-[14px] bg-[var(--admin-surface-2)] border border-white/10 overflow-hidden shrink-0 relative shadow-sm">
              <Image
                src={product.imageUrl}
                alt={product.name}
                width={48}
                height={48}
                className="w-full h-full object-cover"
              />
            </div>
            <div className="min-w-0 flex-1">
              <div className="flex items-center gap-2 mb-1 min-w-0">
                <h2 className="text-base sm:text-lg font-heading font-bold text-white leading-tight break-words">
                  {product.name}
                </h2>
                {product.rank && (
                  <span className="shrink-0 text-[10px] font-bold uppercase tracking-wider bg-amber-400/10 text-amber-300 border border-amber-400/25 px-2 py-0.5 rounded-full flex items-center gap-1">
                    <Star size={10} className="fill-amber-400 text-amber-400" />
                    <span>#{product.rank} Bestseller</span>
                  </span>
                )}
              </div>
              <div className="flex items-center gap-2 text-xs text-[var(--admin-text-muted)] flex-wrap">
                <span className="font-medium text-white/80">{product.category}</span>
                <span className="text-white/20">•</span>
                <span className="font-mono text-[11px]">SKU: {product.sku}</span>
                <span className="text-white/20 hidden sm:inline">•</span>
                <span className="hidden sm:inline-flex items-center gap-1 text-[11px] text-white/70">
                  <Star size={11} className="fill-amber-400 text-amber-400" />
                  <strong className="text-white">{Number(product.rating).toFixed(1)}</strong> ({product.reviewCount} reviews)
                </span>
              </div>
            </div>
          </div>

          <div className="flex items-center gap-1.5 shrink-0">
            <button
              type="button"
              onClick={handleDownloadCSV}
              className="flex items-center gap-1.5 px-2.5 py-1.5 rounded-xl bg-white/[0.04] hover:bg-white/10 border border-white/10 text-white/80 hover:text-white text-xs font-medium transition-all cursor-pointer"
              title="Export product performance data to CSV"
            >
              <Download size={13} />
              <span className="hidden md:inline">Export CSV</span>
            </button>

            <a
              href={`/product/${liveStoreSlug || product.slug}`}
              target="_blank"
              rel="noreferrer"
              className="flex items-center gap-1.5 px-2.5 py-1.5 rounded-xl bg-white/[0.04] hover:bg-white/10 border border-white/10 text-white/80 hover:text-white text-xs font-medium transition-all cursor-pointer"
              title="Open customer view in store"
            >
              <ExternalLink size={13} />
              <span className="hidden md:inline">Live Store</span>
            </a>

            <button
              onClick={onClose}
              className="w-8 h-8 rounded-full bg-white/[0.04] hover:bg-white/10 border border-white/10 text-white/70 hover:text-white flex items-center justify-center transition-colors cursor-pointer ml-1"
              title="Close (Esc)"
            >
              <X size={16} />
            </button>
          </div>
        </div>

        {/* 4-Card Hero Metrics */}
        <div className="grid grid-cols-2 sm:grid-cols-4 gap-2.5 p-3.5 sm:px-6 sm:py-3.5 bg-[var(--admin-surface-2)] border-b border-white/5">
          {/* Revenue */}
          <div className="bg-[var(--admin-surface)] p-3 rounded-[14px] border border-white/5 flex flex-col justify-between min-h-[86px]">
            <div className="flex items-center justify-between text-[10.5px] font-bold text-[var(--admin-text-muted)] uppercase tracking-wider">
              <span>Gross Revenue</span>
              <IndianRupee size={13} className="text-white/35" />
            </div>
            <div className="text-base sm:text-lg font-heading font-bold text-white tabular-nums tracking-tight">
              ₹{product.revenue.toLocaleString("en-IN")}
            </div>
            <div className="text-[11px] text-[#10B981] font-semibold flex items-center gap-1">
              <TrendingUp size={11} />
              <span>+{product.growth}% vs prev</span>
            </div>
          </div>

          {/* Units Sold */}
          <div className="bg-[var(--admin-surface)] p-3 rounded-[14px] border border-white/5 flex flex-col justify-between min-h-[86px]">
            <div className="flex items-center justify-between text-[10.5px] font-bold text-[var(--admin-text-muted)] uppercase tracking-wider">
              <span>Units Sold</span>
              <Package size={13} className="text-white/35" />
            </div>
            <div className="text-base sm:text-lg font-heading font-bold text-white tabular-nums tracking-tight">
              {product.soldCount} units
            </div>
            <div className="text-[11px] text-[var(--admin-text-muted)] font-medium">
              ~{(product.soldCount / 30).toFixed(1)} units / day
            </div>
          </div>

          {/* Unit Margin */}
          <div className="bg-[var(--admin-surface)] p-3 rounded-[14px] border border-white/5 flex flex-col justify-between min-h-[86px]">
            <div className="flex items-center justify-between text-[10.5px] font-bold text-[var(--admin-text-muted)] uppercase tracking-wider">
              <span>Unit Margin</span>
              <Percent size={13} className="text-white/35" />
            </div>
            <div className="text-base sm:text-lg font-heading font-bold text-white tabular-nums tracking-tight">
              {product.marginPercent}%
            </div>
            <div className="text-[11px] text-[var(--admin-text-muted)] font-medium leading-none">
              ₹{Math.max(0, product.unitPrice - product.cogs)} profit / unit
            </div>
          </div>

          {/* Warehouse Stock */}
          <div className="bg-[var(--admin-surface)] p-3 rounded-[14px] border border-white/5 flex flex-col justify-between min-h-[86px]">
            <div className="flex items-center justify-between text-[10.5px] font-bold text-[var(--admin-text-muted)] uppercase tracking-wider">
              <span>Warehouse Stock</span>
              <Boxes size={13} className="text-white/35" />
            </div>
            <div className="text-base sm:text-lg font-heading font-bold text-white tabular-nums tracking-tight">
              {product.stock} units
            </div>
            <div className="text-[11px] font-medium flex items-center gap-1.5">
              <span className={`w-1.5 h-1.5 rounded-full ${product.stock <= 10 ? "bg-amber-400" : "bg-emerald-400"}`} />
              <span className={product.stock <= 10 ? "text-amber-400 font-semibold" : "text-[var(--admin-text-muted)]"}>
                {product.stock <= 10 ? `Low (${product.stock} left)` : "Healthy inventory"}
              </span>
            </div>
          </div>
        </div>

        {/* Tab Navigation - Clean Segmented Pill Bar */}
        <div className="flex items-center gap-1.5 px-5 sm:px-6 py-2.5 bg-[var(--admin-surface)] border-b border-white/5">
          <button
            onClick={() => setActiveTab("variants")}
            className={`py-1.5 px-3 text-xs font-semibold rounded-xl transition-all cursor-pointer flex items-center gap-1.5 ${
              activeTab === "variants"
                ? "bg-white/10 text-white shadow-xs border border-white/10"
                : "text-[var(--admin-text-muted)] hover:text-white hover:bg-white/[0.04] border border-transparent"
            }`}
          >
            <Layers size={13} />
            <span>Variants &amp; Sizes</span>
          </button>

          <button
            onClick={() => setActiveTab("orders")}
            className={`py-1.5 px-3 text-xs font-semibold rounded-xl transition-all cursor-pointer flex items-center gap-1.5 ${
              activeTab === "orders"
                ? "bg-white/10 text-white shadow-xs border border-white/10"
                : "text-[var(--admin-text-muted)] hover:text-white hover:bg-white/[0.04] border border-transparent"
            }`}
          >
            <ShoppingCart size={13} />
            <span>Customer Orders ({matchingOrders.length})</span>
          </button>

          <button
            onClick={() => setActiveTab("actions")}
            className={`py-1.5 px-3 text-xs font-semibold rounded-xl transition-all cursor-pointer flex items-center gap-1.5 ${
              activeTab === "actions"
                ? "bg-white/10 text-white shadow-xs border border-white/10"
                : "text-[var(--admin-text-muted)] hover:text-white hover:bg-white/[0.04] border border-transparent"
            }`}
          >
            <SlidersHorizontal size={13} />
            <span>Restock &amp; Pricing</span>
          </button>
        </div>

        {/* Tab Content - Clean Natural Hugging (Matches Image 1, Zero Artificial Fillers) */}
        <div className="p-4 sm:p-5 overflow-y-auto admin-scroll bg-[var(--admin-surface-2)] space-y-3.5 overscroll-contain max-h-[380px]">
          {activeTab === "variants" && (
            <div className="space-y-3">
              <div className="border border-white/5 rounded-[16px] overflow-hidden bg-[var(--admin-surface)] shadow-xs">
                <table className="w-full text-left text-xs">
                  <thead className="bg-[var(--admin-surface-2)] text-[var(--admin-text-muted)] font-semibold border-b border-white/5 select-none">
                    <tr>
                      <th className="py-2.5 px-4 text-left font-semibold">Variant / Size</th>
                      <th className="py-2.5 px-4 text-right font-semibold">Share of Sales</th>
                      <th className="py-2.5 px-4 text-right font-semibold">Units Sold</th>
                      <th className="py-2.5 px-4 text-right font-semibold">Revenue</th>
                      <th className="py-2.5 px-4 text-right font-semibold">Available Stock</th>
                    </tr>
                  </thead>
                  <tbody className="divide-y divide-white/5">
                    {(() => {
                      const totalVariantUnits = activeVariants.reduce((acc, curr) => acc + curr.sold, 0);
                      return activeVariants.map((v) => {
                        const sharePct = totalVariantUnits > 0 ? Math.round((v.sold / totalVariantUnits) * 100) : 0;
                        const isLow = v.stock <= 3;
                        const isMedium = v.stock <= 6;
                        return (
                          <tr key={v.size} className="hover:bg-white/[0.02] transition-colors">
                            <td className="py-3 px-4 font-semibold text-white">
                              <div className="flex items-center gap-2">
                                <span>{v.size}</span>
                                {v.isBestseller && (
                                  <span className="inline-flex items-center gap-1 text-[10px] font-bold uppercase tracking-wider text-amber-300 bg-amber-400/10 border border-amber-400/25 px-2 py-0.5 rounded-full">
                                    <Star size={9} className="fill-amber-400 text-amber-400" />
                                    <span>Bestseller</span>
                                  </span>
                                )}
                              </div>
                            </td>
                            <td className="py-3 px-4 text-right">
                              <span className="text-[11px] text-[var(--admin-text-muted)] font-medium tabular-nums">{sharePct}%</span>
                            </td>
                            <td className="py-3 px-4 text-right font-mono font-bold text-white tabular-nums">
                              {v.sold}
                            </td>
                            <td className="py-3 px-4 text-right font-bold text-white tabular-nums">
                              ₹{v.revenue.toLocaleString("en-IN")}
                            </td>
                            <td className="py-3 px-4 text-right">
                              <span className="inline-flex items-center gap-1.5 text-xs font-medium tabular-nums">
                                <span className={`w-1.5 h-1.5 rounded-full ${isLow ? "bg-red-400" : isMedium ? "bg-amber-400" : "bg-emerald-400"}`} />
                                <span className={isLow ? "text-red-300 font-semibold" : "text-white/80"}>
                                  {v.stock} in stock
                                </span>
                              </span>
                            </td>
                          </tr>
                        );
                      });
                    })()}
                  </tbody>
                </table>
              </div>

              {/* Clean Operational Summary Bar - 100% Mathematically Unified */}
              <div className="px-4 py-2.5 rounded-[14px] bg-[var(--admin-surface)] border border-white/5 flex items-center justify-between text-xs text-[var(--admin-text-muted)]">
                <div className="flex items-center gap-3">
                  <span>Active Variants: <strong className="text-white font-semibold">{activeVariants.length}</strong></span>
                  <span className="text-white/20">•</span>
                  <span>Warehouse Stock: <strong className="text-white font-semibold">{product.stock} units</strong></span>
                </div>
                <div>
                  Total Units Sold: <strong className="text-white tabular-nums font-semibold">{product.soldCount}</strong>
                </div>
              </div>
            </div>
          )}

          {activeTab === "orders" && (
            <div className="space-y-2.5">
              {matchingOrders.length > 0 ? (
                matchingOrders.map((order) => {
                  const customerCity = order.shippingAddress?.address?.split(",")?.slice(-2)?.[0]?.trim() || "Chennai";
                  return (
                    <div
                      key={order.id}
                      className="p-3 px-4 rounded-[14px] border border-white/5 bg-[var(--admin-surface)] hover:border-white/10 transition-colors flex items-center justify-between gap-3 text-xs"
                    >
                      <div className="flex items-center gap-3 min-w-0">
                        <div>
                          <div className="flex items-center gap-2">
                            <span className="font-mono font-bold text-white">
                              {order.id}
                            </span>
                            <span className="text-[11px] text-[var(--admin-text-muted)]">
                              {order.date}
                            </span>
                            <span
                              className={`text-[9.5px] font-bold px-2 py-0.5 rounded-full ${
                                order.status === "Delivered"
                                  ? "bg-emerald-500/15 text-emerald-400 border border-emerald-500/25"
                                  : order.status === "Shipped"
                                  ? "bg-sky-500/15 text-sky-400 border border-sky-500/25"
                                  : order.status === "Cancelled"
                                  ? "bg-amber-500/15 text-amber-400 border border-amber-500/25"
                                  : "bg-white/10 text-white/80 border border-white/15"
                              }`}
                            >
                              {order.status}
                            </span>
                          </div>
                          <div className="text-[11px] text-[var(--admin-text-muted)] mt-0.5 truncate">
                            Customer: <strong className="text-white/90 font-medium">{order.shippingAddress?.name || "Verified Customer"}</strong> ({customerCity})
                          </div>
                        </div>
                      </div>

                      <div className="flex items-center gap-3 shrink-0">
                        <div className="text-right">
                          <span className="font-heading font-bold text-white tabular-nums block">
                            ₹{order.total.toLocaleString("en-IN")}
                          </span>
                          <span className="text-[10px] text-[var(--admin-text-muted)]">
                            {order.itemsCount} {order.itemsCount === 1 ? "item" : "items"}
                          </span>
                        </div>
                        <Link
                          href={`/orders/${order.id}`}
                          target="_blank"
                          className="px-3 py-1.5 rounded-xl bg-white/[0.04] hover:bg-white/10 border border-white/10 text-white text-xs font-semibold transition-colors"
                        >
                          Inspect
                        </Link>
                      </div>
                    </div>
                  );
                })
              ) : (
                <div className="py-8 px-6 text-center bg-[var(--admin-surface)] rounded-[18px] border border-white/5 flex flex-col items-center justify-center">
                  <div className="w-10 h-10 rounded-xl bg-white/[0.04] border border-white/10 flex items-center justify-center mb-2.5 text-[var(--admin-text-muted)]">
                    <Package size={18} />
                  </div>
                  <p className="text-xs font-semibold text-white">
                    No active orders in current live batch
                  </p>
                  <p className="text-[11px] text-[var(--admin-text-muted)] max-w-sm mx-auto mt-1 leading-relaxed">
                    Lifetime fulfilled volume: <strong className="text-white">{product.soldCount} units</strong>. Storefront checkout orders link here automatically in real-time.
                  </p>
                </div>
              )}
            </div>
          )}

          {activeTab === "actions" && (
            <div className="grid grid-cols-1 sm:grid-cols-2 gap-3.5">
              {/* Card 1: Warehouse Restock */}
              <div className="p-4 sm:p-5 rounded-[18px] border border-white/5 bg-[var(--admin-surface)] flex flex-col justify-between space-y-3.5">
                <div>
                  <div className="flex items-center justify-between mb-1">
                    <div className="font-heading font-bold text-xs text-white flex items-center gap-1.5">
                      <Boxes size={14} className="text-[#8B5CF6]" />
                      <span>Warehouse Restock</span>
                    </div>
                    <span className="text-[10.5px] text-[var(--admin-text-muted)]">
                      Current: <strong className="text-white font-semibold">{product.stock} units</strong>
                    </span>
                  </div>
                  <p className="text-[11px] text-[var(--admin-text-muted)]">
                    Adjust on-hand inventory levels for this SKU.
                  </p>
                </div>

                <div className="space-y-2.5">
                  <div className="flex items-center justify-between gap-2 bg-[var(--admin-surface-2)] border border-white/10 rounded-xl px-3.5 py-2">
                    <span className="text-xs text-[var(--admin-text-muted)] font-medium">New Stock:</span>
                    <input
                      type="number"
                      min={0}
                      value={stockInput}
                      onChange={(e) => setStockInput(Math.max(0, parseInt(e.target.value) || 0))}
                      className="w-24 text-right text-xs font-bold text-white bg-transparent outline-none tabular-nums [appearance:textfield] [&::-webkit-outer-spin-button]:appearance-none [&::-webkit-inner-spin-button]:appearance-none"
                    />
                  </div>

                  <div className="flex items-center gap-1.5">
                    {[10, 25, 50, 100].map((inc) => (
                      <button
                        key={inc}
                        type="button"
                        onClick={() => setStockInput((s) => s + inc)}
                        className="flex-1 py-1 rounded-lg bg-[var(--admin-surface-2)] hover:bg-white/10 border border-white/5 text-[11px] font-semibold text-white/90 cursor-pointer transition-colors text-center"
                      >
                        +{inc}
                      </button>
                    ))}
                  </div>

                  <button
                    type="button"
                    onClick={handleStockSave}
                    className="w-full py-2.5 rounded-xl bg-white/[0.10] hover:bg-white/[0.16] border border-white/15 text-white text-xs font-semibold transition-all cursor-pointer shadow-xs active:scale-[0.99] flex items-center justify-center gap-1.5"
                  >
                    Save Stock Update
                  </button>
                </div>
              </div>

              {/* Card 2: Price & Margin */}
              <div className="p-4 sm:p-5 rounded-[18px] border border-white/5 bg-[var(--admin-surface)] flex flex-col justify-between space-y-3.5">
                <div>
                  <div className="flex items-center justify-between mb-1">
                    <div className="font-heading font-bold text-xs text-white flex items-center gap-1.5">
                      <Tag size={14} className="text-[#8B5CF6]" />
                      <span>Price &amp; Margin Optimizer</span>
                    </div>
                    <span className="text-[10.5px] text-[var(--admin-text-muted)]">
                      Unit Cost: <strong className="text-white font-semibold">₹{product.cogs}</strong>
                    </span>
                  </div>
                  <p className="text-[11px] text-[var(--admin-text-muted)]">
                    Tune retail price and simulate profit margins live.
                  </p>
                </div>

                <div className="space-y-2.5">
                  <div className="flex items-center justify-between gap-2 bg-[var(--admin-surface-2)] border border-white/10 rounded-xl px-3.5 py-2">
                    <span className="text-xs text-[var(--admin-text-muted)] font-medium">Retail Price:</span>
                    <div className="flex items-center gap-1">
                      <span className="text-xs text-white/60">₹</span>
                      <input
                        type="number"
                        min={product.cogs}
                        step={50}
                        value={priceInput}
                        onChange={(e) => setPriceInput(Math.max(1, parseInt(e.target.value) || 0))}
                        className="w-24 text-right text-xs font-bold text-white bg-transparent outline-none tabular-nums [appearance:textfield] [&::-webkit-outer-spin-button]:appearance-none [&::-webkit-inner-spin-button]:appearance-none"
                      />
                    </div>
                  </div>

                  <div className="px-3 py-1.5 rounded-xl bg-[var(--admin-surface-2)] border border-white/5 flex items-center justify-between text-[11px]">
                    <span className="text-[var(--admin-text-muted)]">Gross Margin:</span>
                    <span className="font-bold tabular-nums text-white">
                      <span
                        className={
                          simulatedMargin >= 50
                            ? "text-emerald-400"
                            : simulatedMargin >= 30
                            ? "text-amber-400"
                            : "text-rose-400"
                        }
                      >
                        {simulatedMargin}%
                      </span>
                      <span className="text-[var(--admin-text-muted)] font-normal ml-1">
                        (₹{Math.max(0, priceInput - product.cogs)} profit)
                      </span>
                    </span>
                  </div>

                  <button
                    type="button"
                    onClick={handlePriceSave}
                    className="w-full py-2.5 rounded-xl bg-violet-600 hover:bg-violet-500 text-white text-xs font-semibold transition-all cursor-pointer shadow-xs border border-violet-400/30 active:scale-[0.99] flex items-center justify-center gap-1.5"
                  >
                    Apply New Price
                  </button>
                </div>
              </div>
            </div>
          )}
        </div>


        {/* Footer */}
        <div className="px-5 py-2.5 sm:px-6 sm:py-2.5 bg-[var(--admin-surface)] border-t border-white/5 flex items-center justify-between text-xs">
          <div className="text-[var(--admin-text-muted)] text-[11px] flex items-center gap-2">
            <span className="font-mono text-white/70">SKU: {product.sku}</span>
            <span className="text-white/20">•</span>
            <span>{product.category}</span>
          </div>
          <button
            type="button"
            onClick={onClose}
            className="px-3.5 py-1 rounded-xl bg-white/[0.06] hover:bg-white/10 text-white font-medium text-xs border border-white/10 transition-colors cursor-pointer"
          >
            Close
          </button>
        </div>
      </motion.div>
    </motion.div>
  );
}

// ─── COMPREHENSIVE ALL TOP PRODUCTS LEADERBOARD MODAL ─────────────────────────

function AllTopProductsModal({
  isOpen,
  onClose,
  products,
  onSelectProduct,
  onExportAllCSV,
  timeframe,
  metric,
  isInspecting = false,
}: {
  isOpen: boolean;
  onClose: () => void;
  products: TopProductItem[];
  onSelectProduct: (product: TopProductItem) => void;
  onExportAllCSV: () => void;
  timeframe: string;
  metric: "revenue" | "units";
  isInspecting?: boolean;
}) {
  const [search, setSearch] = useState("");
  const [categoryFilter, setCategoryFilter] = useState<string>("all");
  const [stockFilter, setStockFilter] = useState<"all" | "in_stock" | "low_stock">("all");
  const [sortBy, setSortBy] = useState<"revenue" | "units" | "margin" | "growth">("revenue");

  // Keyboard Escape listener
  useEffect(() => {
    function handleKeyDown(e: KeyboardEvent) {
      if (e.key === "Escape") onClose();
    }
    if (isOpen) {
      window.addEventListener("keydown", handleKeyDown);
    }
    return () => {
      window.removeEventListener("keydown", handleKeyDown);
    };
  }, [isOpen, onClose]);

  // Filter & sort with smart search & synonym normalization
  const searchMatched = useMemo(() => {
    return search ? searchTopProducts(products, search) : products;
  }, [products, search]);

  const filtered = searchMatched
    .filter((p) => {
      if (categoryFilter !== "all" && p.category !== categoryFilter) return false;
      if (stockFilter === "low_stock" && p.stock > 10) return false;
      if (stockFilter === "in_stock" && p.stock <= 10) return false;
      return true;
    })
    .sort((a, b) => {
      if (sortBy === "revenue") return b.revenue - a.revenue;
      if (sortBy === "units") return b.soldCount - a.soldCount;
      if (sortBy === "margin") return b.marginPercent - a.marginPercent;
      if (sortBy === "growth") return b.growth - a.growth;
      return 0;
    });

  const totalRev = filtered.reduce((acc, p) => acc + p.revenue, 0);
  const totalUnits = filtered.reduce((acc, p) => acc + p.soldCount, 0);
  const avgMargin = filtered.length > 0
    ? Math.round((filtered.reduce((acc, p) => acc + p.marginPercent, 0) / filtered.length) * 10) / 10
    : 0;
  const maxRevenue = Math.max(...products.map((p) => p.revenue), 1);

  return (
    <motion.div
      key="all-products-modal-backdrop"
      initial={{ opacity: 0 }}
      animate={{ opacity: 1 }}
      exit={{ opacity: 0 }}
      transition={{ duration: 0.22, ease: "easeOut" }}
      style={{ pointerEvents: isInspecting ? "none" : "auto" }}
      className="fixed inset-0 z-[100000] bg-black/45 backdrop-blur-md flex items-center justify-center p-3 sm:p-5 overflow-hidden"
      onClick={onClose}
    >
      <motion.div
        key="all-products-modal-card"
        initial={{ opacity: 0, scale: 0.95, y: 14 }}
        animate={{
          opacity: isInspecting ? 0 : 1,
          scale: isInspecting ? 0.94 : 1,
          y: isInspecting ? -10 : 0,
        }}
        exit={{ opacity: 0, scale: 0.95, y: 12 }}
        transition={{ duration: 0.24, ease: [0.16, 1, 0.3, 1] }}
        className="bg-[var(--admin-elevated)] rounded-[28px] border border-white/10 max-w-6xl xl:max-w-7xl w-full overflow-hidden flex flex-col my-auto h-[88vh] min-h-[580px] max-h-[880px] shadow-2xl"
        onClick={(e) => e.stopPropagation()}
      >
        {/* Header */}
        <div className="p-5 sm:p-6 bg-[var(--admin-surface)] border-b border-white/5 flex items-center justify-between gap-4 shrink-0">
          <div className="flex items-center gap-3.5">
            <AdminIconBadge variant="section" icon={Sparkles} />
            <div>
              <h2 className="text-xl sm:text-2xl font-heading font-bold text-white leading-tight tracking-tight">
                Top Products Leaderboard
              </h2>
              <p className="text-xs sm:text-[13px] text-[var(--admin-text-muted)] mt-1">
                Complete retail performance, units moved, gross margin analysis, and stock health
              </p>
            </div>
          </div>

          <div className="flex items-center gap-2.5">
            <button
              type="button"
              onClick={onExportAllCSV}
              className="flex items-center gap-2 h-9 px-4 rounded-[12px] bg-white/[0.05] hover:bg-white/10 text-white border border-white/10 text-xs sm:text-[13px] font-semibold transition-colors cursor-pointer"
            >
              <FileSpreadsheet size={15} />
              <span>Export CSV</span>
            </button>

            <button
              type="button"
              onClick={onClose}
              className="w-9 h-9 rounded-[12px] hover:bg-white/10 text-[var(--admin-text-muted)] hover:text-white flex items-center justify-center transition-colors cursor-pointer outline-none"
              aria-label="Close modal"
            >
              <X size={18} />
            </button>
          </div>
        </div>

        {/* Filters Bar */}
        <div className="p-4 sm:p-5 border-b border-white/5 bg-[var(--admin-surface-2)] flex flex-wrap items-center justify-between gap-3 text-xs shrink-0">
          {/* Search */}
          <div className="relative flex-1 min-w-[280px] max-w-md">
            <Search size={15} className="absolute left-3.5 top-1/2 -translate-y-1/2 text-[var(--admin-text-muted)]" />
            <input
              type="text"
              value={search}
              onChange={(e) => setSearch(e.target.value)}
              placeholder="Search product name, SKU, category..."
              className="w-full h-10 pl-10 pr-3 bg-[var(--admin-surface)] rounded-[12px] border border-white/10 text-xs sm:text-sm text-white placeholder:text-[var(--admin-text-muted)] focus:outline-none focus:border-[var(--admin-primary)] transition-colors"
            />
          </div>

          {/* Category Filter */}
          <div className="flex items-center gap-1.5">
            {["all", "T-Shirts", "Shoes", "Watches"].map((cat) => (
              <button
                key={cat}
                type="button"
                onClick={() => setCategoryFilter(cat)}
                className={`h-9 px-4 rounded-[10px] text-xs sm:text-[13px] transition-colors cursor-pointer flex items-center justify-center ${
                  categoryFilter === cat
                    ? "bg-white/15 text-white font-semibold border border-white/20 shadow-sm"
                    : "text-[var(--admin-text-muted)] hover:text-white hover:bg-white/[0.04] border border-transparent font-medium"
                }`}
              >
                {cat === "all" ? "All Categories" : cat}
              </button>
            ))}
          </div>

          {/* Stock Filter & Sort */}
          <div className="flex items-center gap-2.5">
            <AdminSelect
              value={stockFilter}
              onValueChange={(val) => setStockFilter(val as "all" | "in_stock" | "low_stock")}
              options={STOCK_FILTER_OPTIONS}
              className="w-44"
              triggerClassName="h-10 text-xs sm:text-[13px] font-medium rounded-[12px]"
              aria-label="Filter leaderboard inventory by stock status"
            />

            <AdminSelect
              value={sortBy}
              onValueChange={(val) => setSortBy(val as "revenue" | "units" | "margin" | "growth")}
              options={TOP_PRODUCTS_SORT_OPTIONS}
              className="w-56"
              triggerClassName="h-10 text-xs sm:text-[13px] font-medium rounded-[12px]"
              aria-label="Sort leaderboard products"
            />
          </div>
        </div>

        {/* Leaderboard Table */}
        <div className="overflow-y-auto admin-scroll flex-1 min-h-0 overscroll-contain bg-[var(--admin-surface-2)]">
          <table className="w-full text-left text-xs sm:text-[13px] [border-collapse:separate] [border-spacing:0]" style={{ borderCollapse: "separate", borderSpacing: 0 }}>
            <thead className="text-[var(--admin-text-muted)] font-bold text-[11px] sm:text-xs uppercase tracking-wider select-none">
              <tr>
                <th className="sticky top-0 z-20 bg-[var(--admin-surface)] border-b border-white/5 py-4 pl-6 pr-3 w-16 text-center">Rank</th>
                <th className="sticky top-0 z-20 bg-[var(--admin-surface)] border-b border-white/5 py-4 px-4 min-w-[280px]">Product</th>
                <th className="sticky top-0 z-20 bg-[var(--admin-surface)] border-b border-white/5 py-4 px-3 w-28">Category</th>
                <th className="sticky top-0 z-20 bg-[var(--admin-surface)] border-b border-white/5 py-4 px-3 text-center w-28">Units Sold</th>
                <th className="sticky top-0 z-20 bg-[var(--admin-surface)] border-b border-white/5 py-4 px-3 text-right w-28">Price</th>
                <th className="sticky top-0 z-20 bg-[var(--admin-surface)] border-b border-white/5 py-4 px-4 text-right w-36">Total Revenue</th>
                <th className="sticky top-0 z-20 bg-[var(--admin-surface)] border-b border-white/5 py-4 px-3 text-center w-24">Margin</th>
                <th className="sticky top-0 z-20 bg-[var(--admin-surface)] border-b border-white/5 py-4 px-4 text-center w-32">Stock</th>
                <th className="sticky top-0 z-20 bg-[var(--admin-surface)] border-b border-white/5 py-4 pl-3 pr-6 text-center w-28">Action</th>
              </tr>
            </thead>
            <tbody className="divide-y divide-white/5">
              {filtered.map((item, idx) => {
                return (
                  <tr
                    key={item.id}
                    onClick={() => {
                      onSelectProduct(item);
                    }}
                    className="hover:bg-white/[0.04] transition-colors group cursor-pointer border-b border-white/5"
                  >
                    <td className="py-4.5 pl-6 pr-3 text-center">
                      <div className="w-8 h-8 rounded-[10px] bg-white/[0.05] border border-white/10 text-white font-heading font-bold text-[13px] flex items-center justify-center mx-auto tabular-nums group-hover:border-white/20 group-hover:bg-white/[0.08] transition-colors">
                        {idx + 1}
                      </div>
                    </td>

                    <td className="py-4.5 px-4">
                      <div className="flex items-center gap-3.5">
                        <div className="w-12 h-12 rounded-[12px] bg-[var(--admin-surface)] border border-white/10 overflow-hidden shrink-0 flex items-center justify-center p-0.5">
                          <Image
                            src={item.imageUrl}
                            alt={item.name}
                            width={48}
                            height={48}
                            className="w-full h-full object-cover rounded-[10px]"
                          />
                        </div>
                        <div className="min-w-0">
                          <div className="font-semibold text-white text-[15px] leading-snug tracking-tight truncate group-hover:text-white transition-colors">
                            {item.name}
                          </div>
                          <div className="text-[12px] text-[var(--admin-text-muted)] font-mono tracking-wide mt-0.5 select-all">
                            {item.sku}
                          </div>
                        </div>
                      </div>
                    </td>

                    <td className="py-4.5 px-3">
                      <span className="text-[13px] text-white/70 font-medium">
                        {item.category}
                      </span>
                    </td>

                    <td className="py-4.5 px-3 text-center">
                      <span className="font-heading font-semibold text-[15px] text-white tabular-nums">
                        {item.soldCount.toLocaleString("en-IN")}
                      </span>
                    </td>

                    <td className="py-4.5 px-3 text-right">
                      <span className="font-heading font-semibold text-[15px] text-white tabular-nums">
                        ₹{item.unitPrice.toLocaleString("en-IN")}
                      </span>
                    </td>

                    <td className="py-4.5 px-4 text-right">
                      <div className="font-heading font-bold text-[16px] text-white tabular-nums">
                        ₹{item.revenue.toLocaleString("en-IN")}
                      </div>
                      <div className="text-xs text-[var(--admin-success)] font-semibold tabular-nums mt-0.5">
                        +{item.growth}%
                      </div>
                    </td>

                    <td className="py-4.5 px-3 text-center">
                      <span className="font-heading font-bold text-[15px] text-[var(--admin-success)] tabular-nums">
                        {item.marginPercent}%
                      </span>
                    </td>

                    <td className="py-4.5 px-4 text-center">
                      {item.stock <= 10 ? (
                        <span className="text-[13px] font-bold text-amber-400 tabular-nums">
                          {item.stock} left
                        </span>
                      ) : (
                        <span className="text-[13px] font-medium text-white/80 tabular-nums">
                          {item.stock} in stock
                        </span>
                      )}
                    </td>

                    <td className="py-4.5 pl-3 pr-6 text-center">
                      <button
                        type="button"
                        onClick={(e) => {
                          e.stopPropagation();
                          onSelectProduct(item);
                        }}
                        className="inline-flex items-center gap-1.5 h-8 px-3.5 rounded-[9px] bg-white/[0.04] hover:bg-white/10 text-white/80 hover:text-white text-xs font-semibold border border-white/5 hover:border-white/15 transition-all cursor-pointer"
                      >
                        <span>Inspect</span>
                        <ChevronRight size={13} className="transition-transform group-hover:translate-x-0.5 text-white/50 group-hover:text-white" />
                      </button>
                    </td>
                  </tr>
                );
              })}
            </tbody>
          </table>
        </div>

        {/* Footer KPI Summary Bar */}
        <div className="p-4 sm:p-5 bg-[var(--admin-surface)] border-t border-white/5 flex flex-wrap items-center justify-between gap-4 shrink-0">
          <div className="flex items-center gap-6 sm:gap-8">
            <div>
              <div className="text-[11px] font-semibold text-[var(--admin-text-muted)] uppercase tracking-wider">Filtered Revenue</div>
              <div className="text-lg sm:text-xl font-heading font-bold text-white tabular-nums mt-0.5">
                ₹{totalRev.toLocaleString("en-IN")}
              </div>
            </div>

            <div className="h-8 w-px bg-white/10 hidden sm:block" />

            <div>
              <div className="text-[11px] font-semibold text-[var(--admin-text-muted)] uppercase tracking-wider">Total Volume</div>
              <div className="text-base sm:text-lg font-heading font-bold text-white tabular-nums mt-0.5">
                {totalUnits.toLocaleString("en-IN")} <span className="text-xs font-normal text-[var(--admin-text-muted)] font-sans">items</span>
              </div>
            </div>

            <div className="h-8 w-px bg-white/10 hidden sm:block" />

            <div>
              <div className="text-[11px] font-semibold text-[var(--admin-text-muted)] uppercase tracking-wider">Average Margin</div>
              <div className="text-base sm:text-lg font-heading font-bold text-[var(--admin-success)] tabular-nums mt-0.5">
                {avgMargin}%
              </div>
            </div>
          </div>

          <div className="flex items-center gap-2.5">
            <button
              type="button"
              onClick={onExportAllCSV}
              className="h-10 px-4 rounded-[12px] bg-white/[0.05] border border-white/10 hover:bg-white/10 text-white font-semibold text-xs sm:text-[13px] transition-colors cursor-pointer flex items-center gap-2"
            >
              <Download size={14} />
              <span>Export All ({filtered.length})</span>
            </button>

            <button
              type="button"
              onClick={onClose}
              className="h-10 px-5 rounded-[12px] bg-[var(--admin-primary)] hover:bg-[var(--admin-primary-hover)] text-white text-xs sm:text-[13px] font-semibold transition-colors cursor-pointer shadow-md shadow-[var(--admin-primary)]/20"
            >
              Close
            </button>
          </div>
        </div>
      </motion.div>
    </motion.div>
  );
}

// ─── ADMIN GLOBAL SEARCH BAR COMPONENT ───────────────────────────────────────

const getSearchStatusBadge = (status: string) => {
  switch (status) {
    case "Delivered":
      return "bg-[var(--admin-success)]/15 text-[var(--admin-success)] border-white/10";
    case "Processing":
    case "Confirmed":
    case "Packed":
      return "bg-[var(--admin-warning)]/15 text-[var(--admin-warning)] border-white/10";
    case "Shipped":
    case "Out for Delivery":
      return "bg-[var(--admin-info)]/15 text-[var(--admin-info)] border-white/10";
    case "Cancelled":
      return "bg-[var(--admin-danger)]/15 text-[var(--admin-danger)] border-white/10";
    case "Returned":
    case "Return Requested":
      return "bg-[var(--admin-primary)]/15 text-[var(--admin-primary)] border-white/10";
    default:
      return "bg-white/5 text-[var(--admin-text-muted)] border-white/10";
  }
};

const OrderResultRow = React.memo(function OrderResultRow({
  order,
  isSelected,
  onSelect,
  onMouseMove,
}: {
  order: OrderRecord;
  isSelected: boolean;
  onSelect: () => void;
  onMouseMove: () => void;
}) {
  const customer = order.shippingAddress?.name || "Customer";
  const firstItem = order.items?.[0]?.productName || "Items";
  const extraItems = order.items && order.items.length > 1 ? ` +${order.items.length - 1} more` : "";

  return (
    <div
      data-selected={isSelected ? "true" : undefined}
      onClick={onSelect}
      onMouseMove={onMouseMove}
      className={`p-2.5 rounded-[14px] border cursor-pointer flex items-center justify-between gap-3 group touch-manipulation ${
        isSelected
          ? "bg-[var(--admin-elevated)] border-[var(--admin-primary)]/60 text-white transition-none"
          : "border-transparent hover:border-white/10 hover:bg-white/[0.05] transition-colors duration-75"
      }`}
    >
      <div className="min-w-0">
        <div className="flex items-center gap-2">
          <span className="font-bold text-xs text-white">
            {order.id}
          </span>
          <span
            className={`text-[10px] font-semibold px-2 py-0.5 rounded-md border ${getSearchStatusBadge(
              order.status
            )}`}
          >
            {order.status}
          </span>
        </div>
        <div className="text-xs text-[var(--admin-text-muted)] truncate mt-0.5">
          <strong className="font-semibold text-white">{customer}</strong> • {firstItem}
          {extraItems}
        </div>
        <div className="text-[11px] text-[var(--admin-text-muted)] mt-0.5">
          {order.date} • {order.shippingAddress?.address ? order.shippingAddress.address.split(",").slice(-2).join(",").trim() : "India"}
        </div>
      </div>

      <div className="text-right shrink-0 flex items-center gap-2">
        <span className="text-xs font-bold text-white">
          ₹{order.total.toLocaleString("en-IN")}
        </span>
        <ChevronRight size={14} className="text-[var(--admin-text-muted)] group-hover:text-white" />
      </div>
    </div>
  );
});

const SectionResultRow = React.memo(function SectionResultRow({
  sec,
  isSelected,
  onSelect,
  onMouseMove,
}: {
  sec: CustomSection;
  isSelected: boolean;
  onSelect: () => void;
  onMouseMove: () => void;
}) {
  return (
    <div
      data-selected={isSelected ? "true" : undefined}
      onClick={onSelect}
      onMouseMove={onMouseMove}
      className={`p-2.5 rounded-[14px] border cursor-pointer flex items-center justify-between gap-3 group touch-manipulation ${
        isSelected
          ? "bg-[var(--admin-elevated)] border-[var(--admin-primary)]/60 text-white transition-none"
          : "border-transparent hover:border-white/10 hover:bg-white/[0.05] transition-colors duration-75"
      }`}
    >
      <div className="flex items-center gap-2.5 min-w-0">
        <span className="w-8 h-8 rounded-[10px] bg-[var(--admin-surface-2)] border border-white/10 text-white font-bold text-xs flex items-center justify-center shrink-0">
          #
        </span>
        <div className="min-w-0">
          <div className="font-semibold text-xs text-white truncate">
            {sec.name}
          </div>
          <div className="text-[11px] text-[var(--admin-text-muted)] truncate mt-0.5">
            {sec.products?.length || 0} product{sec.products?.length === 1 ? "" : "s"} · /section/{sec.slug}
          </div>
        </div>
      </div>
      <div className="text-right shrink-0 flex items-center gap-1.5 text-xs text-[var(--admin-text-muted)] group-hover:text-white font-medium">
        <span>Manage</span>
        <ChevronRight size={14} className="text-[var(--admin-text-muted)] group-hover:text-white" />
      </div>
    </div>
  );
});

const ProductResultRow = React.memo(function ProductResultRow({
  product,
  isSelected,
  onSelect,
  onMouseMove,
}: {
  product: Product;
  isSelected: boolean;
  onSelect: () => void;
  onMouseMove: () => void;
}) {
  return (
    <div
      data-selected={isSelected ? "true" : undefined}
      onClick={onSelect}
      onMouseMove={onMouseMove}
      className={`p-2.5 rounded-[14px] border cursor-pointer flex items-center justify-between gap-3 group touch-manipulation ${
        isSelected
          ? "bg-[var(--admin-elevated)] border-[var(--admin-primary)]/60 text-white transition-none"
          : "border-transparent hover:border-white/10 hover:bg-white/[0.05] transition-colors duration-75"
      }`}
    >
      <div className="flex items-center gap-3 min-w-0">
        <div className="w-10 h-10 rounded-[10px] bg-[var(--admin-surface-2)] overflow-hidden shrink-0 border border-white/10 flex items-center justify-center">
          {product.imageUrl ? (
            <Image
              src={product.imageUrl}
              alt={product.name}
              width={40}
              height={40}
              className="w-full h-full object-cover"
            />
          ) : (
            <Package size={16} className="text-[var(--admin-text-muted)]" />
          )}
        </div>
        <div className="min-w-0">
          <div className="font-semibold text-xs text-white truncate">
            {product.name}
          </div>
          <div className="text-[11px] text-[var(--admin-text-muted)] truncate mt-0.5">
            {product.category} • SKU: {product.sku || product.id}
          </div>
        </div>
      </div>

      <div className="text-right shrink-0 flex items-center gap-2">
        <div>
          <div className="text-xs font-bold text-white">
            ₹{product.price.toLocaleString("en-IN")}
          </div>
          <div className="text-[10px] text-[var(--admin-success)] font-medium">In Stock</div>
        </div>
        <ChevronRight size={14} className="text-[var(--admin-text-muted)] group-hover:text-white" />
      </div>
    </div>
  );
});

const CustomerResultRow = React.memo(function CustomerResultRow({
  cust,
  isSelected,
  onSelect,
  onMouseMove,
}: {
  cust: { name: string; phone: string; address: string; ordersCount: number; totalSpent: number };
  isSelected: boolean;
  onSelect: () => void;
  onMouseMove: () => void;
}) {
  return (
    <div
      data-selected={isSelected ? "true" : undefined}
      onClick={onSelect}
      onMouseMove={onMouseMove}
      className={`p-2.5 rounded-[14px] border cursor-pointer flex items-center justify-between gap-3 group touch-manipulation ${
        isSelected
          ? "bg-[var(--admin-elevated)] border-[var(--admin-primary)]/60 text-white transition-none"
          : "border-transparent hover:border-white/10 hover:bg-white/[0.05] transition-colors duration-75"
      }`}
    >
      <div className="flex items-center gap-3 min-w-0">
        <div className="w-9 h-9 rounded-full bg-[var(--admin-surface-2)] border border-white/10 text-white font-bold text-xs flex items-center justify-center shrink-0">
          {cust.name.slice(0, 1).toUpperCase()}
        </div>
        <div className="min-w-0">
          <div className="font-semibold text-xs text-white truncate">
            {cust.name}
          </div>
          <div className="text-[11px] text-[var(--admin-text-muted)] truncate mt-0.5">
            {cust.phone || "Verified Customer"} • {cust.address ? cust.address.split(",").slice(-2).join(",").trim() : "India"}
          </div>
        </div>
      </div>

      <div className="text-right shrink-0">
        <div className="text-xs font-semibold text-white">
          {cust.ordersCount} {cust.ordersCount === 1 ? "order" : "orders"}
        </div>
        <div className="text-[11px] text-[var(--admin-text-muted)] font-medium">
          ₹{cust.totalSpent.toLocaleString("en-IN")} total
        </div>
      </div>
    </div>
  );
});

function AdminGlobalSearchBar({
  searchQuery,
  setSearchQuery,
  orders,
  products,
  sections,
  onSelectOrder,
  pendingReturnsCount = 0,
}: {
  searchQuery: string;
  setSearchQuery: (q: string) => void;
  orders: OrderRecord[];
  products: Product[];
  sections?: CustomSection[];
  onSelectOrder?: (order: OrderRecord) => void;
  pendingReturnsCount?: number;
}) {
  const router = useRouter();
  const [isOpen, setIsOpen] = useState(false);
  const [activeTab, setActiveTab] = useState<"all" | "orders" | "products" | "customers">("all");
  const [selectedIndex, setSelectedIndex] = useState(0);
  const [searchDraft, setSearchDraft] = useState(searchQuery);
  const containerRef = useRef<HTMLDivElement>(null);
  const inputRef = useRef<HTMLInputElement>(null);
  const resultsContainerRef = useRef<HTMLDivElement>(null);

  // Sync draft state if parent searchQuery changes externally
  useEffect(() => {
    setSearchDraft(searchQuery);
  }, [searchQuery]);

  const deferredQuery = useDeferredValue(searchDraft);

  // Keyboard shortcut '/' or 'Cmd+K' / 'Ctrl+K'
  useEffect(() => {
    const handleKeyDown = (e: KeyboardEvent) => {
      if (
        (e.key === "/" || ((e.metaKey || e.ctrlKey) && e.key.toLowerCase() === "k")) &&
        document.activeElement !== inputRef.current
      ) {
        e.preventDefault();
        inputRef.current?.focus();
        setIsOpen(true);
      } else if (e.key === "Escape" && isOpen) {
        setIsOpen(false);
        inputRef.current?.blur();
      }
    };
    window.addEventListener("keydown", handleKeyDown);
    return () => window.removeEventListener("keydown", handleKeyDown);
  }, [isOpen]);

  // Click outside to close
  useEffect(() => {
    function handleClickOutside(e: MouseEvent) {
      if (containerRef.current && !containerRef.current.contains(e.target as Node)) {
        setIsOpen(false);
      }
    }
    document.addEventListener("mousedown", handleClickOutside);
    return () => document.removeEventListener("mousedown", handleClickOutside);
  }, []);

  // Filter Matching Orders with Smart Normalization & Synonyms
  const matchingOrders = useMemo(() => {
    if (!deferredQuery.trim()) return [];
    return searchOrders(orders, deferredQuery);
  }, [orders, deferredQuery]);

  // Filter Matching Products with Normalization, Synonyms & Typo Tolerance
  const matchingProducts = useMemo(() => {
    if (!deferredQuery.trim()) return [];
    return searchProducts(products, deferredQuery);
  }, [products, deferredQuery]);

  // Filter Matching Custom Sections
  const matchingSections = useMemo(() => {
    if (!deferredQuery.trim() || !sections) return [];
    return searchSections(sections, deferredQuery);
  }, [sections, deferredQuery]);

  // Filter Matching Customers
  const matchingCustomers = useMemo(() => {
    if (!deferredQuery.trim()) return [];
    const q = deferredQuery.toLowerCase().trim();
    const strippedQ = stripToAlphaNumeric(deferredQuery);
    const customerMap = new Map<
      string,
      { name: string; phone: string; address: string; ordersCount: number; totalSpent: number }
    >();

    orders.forEach((o) => {
      const name = o.shippingAddress?.name?.trim();
      if (!name) return;
      const key = name.toLowerCase();
      const strippedKey = stripToAlphaNumeric(name);
      if (
        key.includes(q) ||
        strippedKey.includes(strippedQ) ||
        o.shippingAddress.phone?.includes(q) ||
        o.shippingAddress.address?.toLowerCase().includes(q)
      ) {
        const existing = customerMap.get(key) || {
          name,
          phone: o.shippingAddress.phone || "",
          address: o.shippingAddress.address || "",
          ordersCount: 0,
          totalSpent: 0,
        };
        existing.ordersCount += 1;
        existing.totalSpent += o.total;
        customerMap.set(key, existing);
      }
    });

    return Array.from(customerMap.values());
  }, [orders, deferredQuery]);

  const totalResults =
    matchingOrders.length +
    matchingProducts.length +
    matchingCustomers.length +
    matchingSections.length;

  // Visible slices matching what is displayed in the DOM
  const visibleOrders = useMemo(() => {
    if (activeTab !== "all" && activeTab !== "orders") return [];
    return matchingOrders.slice(0, activeTab === "orders" ? 20 : 4);
  }, [matchingOrders, activeTab]);

  const visibleSections = useMemo(() => {
    if (activeTab !== "all" && activeTab !== "products") return [];
    return matchingSections;
  }, [matchingSections, activeTab]);

  const visibleProducts = useMemo(() => {
    if (activeTab !== "all" && activeTab !== "products") return [];
    return matchingProducts.slice(0, activeTab === "products" ? 20 : 4);
  }, [matchingProducts, activeTab]);

  const visibleCustomers = useMemo(() => {
    if (activeTab !== "all" && activeTab !== "customers") return [];
    return matchingCustomers.slice(0, activeTab === "customers" ? 20 : 3);
  }, [matchingCustomers, activeTab]);

  // Flattened results for keyboard navigation (1:1 with rendered items)
  const flattenedItems = useMemo(() => {
    const list: Array<{ type: "order" | "product" | "customer" | "section"; data: any }> = [];
    visibleOrders.forEach((o) => list.push({ type: "order", data: o }));
    visibleSections.forEach((s) => list.push({ type: "section", data: s }));
    visibleProducts.forEach((p) => list.push({ type: "product", data: p }));
    visibleCustomers.forEach((c) => list.push({ type: "customer", data: c }));
    return list;
  }, [visibleOrders, visibleSections, visibleProducts, visibleCustomers]);

  // Reset selected index when query or tab changes
  useEffect(() => {
    setSelectedIndex(0);
  }, [deferredQuery, activeTab]);

  // Scroll active item into view only if out of viewport (block: "nearest", behavior: "auto")
  useEffect(() => {
    if (!isOpen) return;
    const container = resultsContainerRef.current;
    if (!container) return;
    const selectedEl = container.querySelector<HTMLElement>('[data-selected="true"]');
    if (!selectedEl) return;
    const containerRect = container.getBoundingClientRect();
    const elRect = selectedEl.getBoundingClientRect();
    if (elRect.top < containerRect.top || elRect.bottom > containerRect.bottom) {
      selectedEl.scrollIntoView({ block: "nearest", behavior: "auto" });
    }
  }, [selectedIndex, isOpen]);

  const handleKeyDownInInput = (e: React.KeyboardEvent<HTMLInputElement>) => {
    if (!isOpen) {
      if (e.key === "ArrowDown" || e.key === "Enter") {
        setIsOpen(true);
      }
      return;
    }

    if (e.key === "ArrowDown") {
      e.preventDefault();
      setSelectedIndex((prev) => (prev + 1) % Math.max(1, flattenedItems.length));
    } else if (e.key === "ArrowUp") {
      e.preventDefault();
      setSelectedIndex((prev) => (prev - 1 + flattenedItems.length) % Math.max(1, flattenedItems.length));
    } else if (e.key === "Enter") {
      e.preventDefault();
      const currentItem = flattenedItems[selectedIndex];
      if (currentItem) {
        if (currentItem.type === "order") {
          setIsOpen(false);
          inputRef.current?.blur();
          setSearchQuery(searchDraft);
          onSelectOrder?.(currentItem.data);
        } else if (currentItem.type === "section") {
          router.push(`/admin/custom-sections`);
          setIsOpen(false);
          setSearchQuery(searchDraft);
        } else if (currentItem.type === "product") {
          router.push(currentItem.data.slug ? `/product/${currentItem.data.slug}` : "/admin/products");
          setIsOpen(false);
          setSearchQuery(searchDraft);
        } else if (currentItem.type === "customer") {
          setSearchDraft(currentItem.data.name);
          setSearchQuery(currentItem.data.name);
          setIsOpen(false);
        }
      }
    }
  };

  return (
    <div className="w-full md:w-80 lg:w-96 relative" ref={containerRef}>
      {/* Search Input Box Matching Target Design */}
      <div className="relative">
        <Search
          size={16}
          className={`absolute left-3.5 top-1/2 -translate-y-1/2 transition-colors duration-150 ${
            isOpen ? "text-[var(--admin-primary)]" : "text-[var(--admin-text-muted)]"
          } pointer-events-none`}
        />
        <input
          ref={inputRef}
          type="text"
          value={searchDraft}
          onFocus={() => setIsOpen(true)}
          onChange={(e) => {
            setSearchDraft(e.target.value);
            if (!isOpen) setIsOpen(true);
          }}
          onKeyDown={handleKeyDownInInput}
          placeholder="Search orders, products, customers..."
          className={`w-full text-xs sm:text-sm pl-10 pr-9 py-2 rounded-[14px] touch-manipulation transition-colors ${
            isOpen
              ? "bg-[var(--admin-surface)] text-white border-white/20 ring-1 ring-white/10"
              : "bg-[var(--admin-surface-2)] hover:bg-[var(--admin-surface)] text-white border-white/10 placeholder-[var(--admin-text-muted)]"
          } border focus:outline-none`}
        />
        {searchDraft ? (
          <button
            onClick={() => {
              setSearchDraft("");
              setSearchQuery("");
              inputRef.current?.focus();
            }}
            className="absolute right-3 top-1/2 -translate-y-1/2 text-[var(--admin-text-muted)] hover:text-white cursor-pointer p-0.5"
            aria-label="Clear search"
          >
            <X size={14} />
          </button>
        ) : (
          <kbd className="absolute right-3.5 top-1/2 -translate-y-1/2 text-[11px] font-mono text-[var(--admin-text-muted)] bg-white/5 px-1.5 py-0.5 rounded pointer-events-none">
            /
          </kbd>
        )}
      </div>

      {/* Live Search Results Dropdown Palette */}
      {isOpen && (
        <div className="absolute left-0 top-full mt-2 w-full md:w-[480px] lg:w-[540px] bg-[var(--admin-surface)] rounded-[14px] border border-white/10 z-50 overflow-hidden animate-in fade-in zoom-in-95 duration-150">
          {/* Top Filter Tabs when searching */}
          {searchDraft.trim() ? (
            <div className="flex items-center gap-1 p-2 bg-[var(--admin-surface-2)] border-b border-white/5 text-xs">
              {(
                [
                  { id: "all", label: "All", count: totalResults },
                  { id: "orders", label: "Orders", count: matchingOrders.length },
                  { id: "products", label: "Products", count: matchingProducts.length },
                  { id: "customers", label: "Customers", count: matchingCustomers.length },
                ] as const
              ).map((tab) => (
                <button
                  key={tab.id}
                  onClick={() => setActiveTab(tab.id)}
                  className={`px-3 py-1.5 rounded-full font-medium transition-all cursor-pointer flex items-center gap-1.5 ${
                    activeTab === tab.id
                      ? "bg-[var(--admin-elevated)] text-white font-semibold border border-white/10"
                      : "text-[var(--admin-text-muted)] hover:text-white hover:bg-white/[0.05]"
                  }`}
                >
                  <span>{tab.label}</span>
                  <span
                    className={`text-[10px] px-1.5 py-0.2 rounded-full ${
                      activeTab === tab.id ? "bg-white/10 text-white" : "bg-white/5 text-[var(--admin-text-muted)]"
                    }`}
                  >
                    {tab.count}
                  </span>
                </button>
              ))}
            </div>
          ) : (
            <div className="px-4 py-2.5 bg-[var(--admin-surface-2)] border-b border-white/5 text-xs font-semibold text-[var(--admin-text-muted)] uppercase tracking-wider flex items-center justify-between">
              <span>Quick Actions & Suggested Searches</span>
              <span className="text-[10px] font-normal normal-case text-[var(--admin-text-muted)]">Press / to focus anytime</span>
            </div>
          )}

          {/* Results Scrollable Area */}
          <div
            ref={resultsContainerRef}
            className="max-h-[380px] overflow-y-auto admin-scroll divide-y divide-white/5 p-2 space-y-2 touch-manipulation"
          >
            {/* Case A: Query is empty -> Quick Actions & Filter Pills */}
            {!searchDraft.trim() ? (
              <div className="space-y-4 py-1">
                {/* Quick Navigation Links */}
                <div>
                  <div className="text-[11px] font-semibold text-[var(--admin-text-muted)] uppercase tracking-wider px-2 mb-1.5">
                    Quick Navigation
                  </div>
                  <div className="grid grid-cols-1 sm:grid-cols-2 gap-1.5">
                    <button
                      onClick={() => {
                        router.push("/admin/products/add");
                        setIsOpen(false);
                      }}
                      className="flex items-center gap-2.5 px-3 py-2 rounded-[14px] text-left hover:bg-white/[0.05] transition-colors text-xs text-white cursor-pointer group"
                    >
                      <div className="w-7 h-7 rounded-[10px] bg-[var(--admin-surface-2)] text-[var(--admin-warning)] border border-white/5 flex items-center justify-center shrink-0">
                        <Plus size={14} />
                      </div>
                      <div className="min-w-0">
                        <div className="font-semibold text-white">Add New Product</div>
                        <div className="text-[11px] text-[var(--admin-text-muted)] truncate">Create catalog item</div>
                      </div>
                    </button>

                    <button
                      onClick={() => {
                        router.push("/admin/orders");
                        setIsOpen(false);
                      }}
                      className="flex items-center gap-2.5 px-3 py-2 rounded-[14px] text-left hover:bg-white/[0.05] transition-colors text-xs text-white cursor-pointer group"
                    >
                      <div className="w-7 h-7 rounded-[10px] bg-[var(--admin-surface-2)] text-blue-400 border border-white/5 flex items-center justify-center shrink-0">
                        <ShoppingCart size={14} />
                      </div>
                      <div className="min-w-0">
                        <div className="font-semibold text-white">All Orders ({orders.length})</div>
                        <div className="text-[11px] text-[var(--admin-text-muted)] truncate">Review fulfillment list</div>
                      </div>
                    </button>

                    <button
                      onClick={() => {
                        router.push("/admin/products");
                        setIsOpen(false);
                      }}
                      className="flex items-center gap-2.5 px-3 py-2 rounded-[14px] text-left hover:bg-white/[0.05] transition-colors text-xs text-white cursor-pointer group"
                    >
                      <div className="w-7 h-7 rounded-[10px] bg-[var(--admin-surface-2)] text-emerald-400 border border-white/5 flex items-center justify-center shrink-0">
                        <Package size={14} />
                      </div>
                      <div className="min-w-0">
                        <div className="font-semibold text-white">Manage Catalog ({products.length})</div>
                        <div className="text-[11px] text-[var(--admin-text-muted)] truncate">Inventory and pricing</div>
                      </div>
                    </button>

                    <button
                      onClick={() => {
                        router.push("/admin/returns");
                        setIsOpen(false);
                      }}
                      className="flex items-center justify-between gap-2.5 px-3 py-2 rounded-[14px] text-left hover:bg-white/[0.05] transition-colors text-xs text-white cursor-pointer group"
                    >
                      <div className="flex items-center gap-2.5 min-w-0">
                        <AdminIconBadge variant="section" icon={RotateCcw} />
                        <div className="min-w-0">
                          <div className="font-semibold text-white">Pending Returns</div>
                          <div className="text-[11px] text-[var(--admin-text-muted)] truncate">
                            {pendingReturnsCount === 0
                              ? "No pending returns"
                              : pendingReturnsCount === 1
                              ? "1 item awaiting review"
                              : `${pendingReturnsCount} items awaiting review`}
                          </div>
                        </div>
                      </div>
                      {pendingReturnsCount > 0 && (
                        <span className="px-1.5 py-0.5 rounded-full text-[10px] font-bold bg-[var(--admin-danger)]/15 text-[var(--admin-danger)] border border-[var(--admin-danger)]/30 shrink-0 tabular-nums">
                          {pendingReturnsCount}
                        </span>
                      )}
                    </button>
                  </div>
                </div>

                {/* Popular Search Suggestions */}
                <div className="pt-2 border-t border-white/5">
                  <div className="text-[11px] font-semibold text-[var(--admin-text-muted)] uppercase tracking-wider px-2 mb-2">
                    Popular Searches
                  </div>
                  <div className="flex flex-wrap gap-1.5 px-2">
                    {[
                      "Delivered",
                      "Processing",
                      "Boopesh",
                      "Royal Steel",
                      "Sneaker",
                      "Oversized",
                      "Watches",
                    ].map((chip) => (
                      <button
                        key={chip}
                        onClick={() => {
                          setSearchDraft(chip);
                          setSearchQuery(chip);
                          inputRef.current?.focus();
                        }}
                        className="px-2.5 py-1 rounded-full bg-[var(--admin-surface-2)] hover:bg-white/[0.05] border border-white/5 text-xs font-medium text-[var(--admin-text-muted)] hover:text-white transition-colors cursor-pointer flex items-center gap-1"
                      >
                        <Search size={11} className="text-[var(--admin-text-muted)]" />
                        <span>{chip}</span>
                      </button>
                    ))}
                  </div>
                </div>
              </div>
            ) : totalResults === 0 ? (
              /* Case B: Query entered but no matches */
              <div className="py-10 text-center px-4">
                <div className="w-12 h-12 rounded-[14px] bg-[var(--admin-surface-2)] text-[var(--admin-text-muted)] flex items-center justify-center mx-auto mb-3 border border-white/5">
                  <Search size={22} />
                </div>
                <div className="text-sm font-semibold text-white mb-1">
                  No matches found for &quot;{searchDraft}&quot;
                </div>
                <p className="text-xs text-[var(--admin-text-muted)] max-w-xs mx-auto mb-4">
                  Check the spelling or try searching by Order ID (e.g. VEY-2026), product name, customer name, or status.
                </p>
                <div className="flex flex-wrap justify-center gap-1.5">
                  {["Delivered", "Processing", "Boopesh", "Shoes", "Watches"].map((chip) => (
                    <button
                      key={chip}
                      onClick={() => {
                        setSearchDraft(chip);
                        setSearchQuery(chip);
                      }}
                      className="px-2.5 py-1 rounded-full bg-[var(--admin-surface-2)] hover:bg-white/[0.05] border border-white/5 text-xs text-[var(--admin-text-muted)] hover:text-white font-medium cursor-pointer"
                    >
                      {chip}
                    </button>
                  ))}
                </div>
              </div>
            ) : (
              /* Case C: Matches found */
              <div className="space-y-4 py-1">
                {/* Orders Section */}
                {visibleOrders.length > 0 && (
                  <div>
                    <div className="text-[11px] font-semibold text-[var(--admin-text-muted)] uppercase tracking-wider px-2 py-1 flex items-center justify-between">
                      <span className="flex items-center gap-1.5">
                        <ShoppingCart size={12} className="text-[var(--admin-text-muted)]" /> Orders
                      </span>
                      <span>{matchingOrders.length}</span>
                    </div>
                    <div className="space-y-1 mt-1">
                      {visibleOrders.map((order, idx) => {
                        const flatIndex = idx;
                        const isSelected = selectedIndex === flatIndex;

                        return (
                          <OrderResultRow
                            key={order.id}
                            order={order}
                            isSelected={isSelected}
                            onMouseMove={() => {
                              if (selectedIndex !== flatIndex) setSelectedIndex(flatIndex);
                            }}
                            onSelect={() => {
                              setIsOpen(false);
                              inputRef.current?.blur();
                              setSearchQuery(searchDraft);
                              onSelectOrder?.(order);
                            }}
                          />
                        );
                      })}
                    </div>
                  </div>
                )}

                {/* Custom Sections Group */}
                {visibleSections.length > 0 && (
                  <div>
                    <div className="text-[11px] font-semibold text-[var(--admin-text-muted)] uppercase tracking-wider px-2 py-1 flex items-center justify-between">
                      <span className="flex items-center gap-1.5">
                        <Layers size={12} className="text-[var(--admin-text-muted)]" /> Custom Sections
                      </span>
                      <span>{matchingSections.length}</span>
                    </div>
                    <div className="space-y-1 mt-1">
                      {visibleSections.map((sec, idx) => {
                        const flatIndex = visibleOrders.length + idx;
                        const isSelected = selectedIndex === flatIndex;

                        return (
                          <SectionResultRow
                            key={sec.id}
                            sec={sec}
                            isSelected={isSelected}
                            onMouseMove={() => {
                              if (selectedIndex !== flatIndex) setSelectedIndex(flatIndex);
                            }}
                            onSelect={() => {
                              router.push(`/admin/custom-sections`);
                              setIsOpen(false);
                              setSearchQuery(searchDraft);
                            }}
                          />
                        );
                      })}
                    </div>
                  </div>
                )}

                {/* Products Section */}
                {visibleProducts.length > 0 && (
                  <div>
                    <div className="text-[11px] font-semibold text-[var(--admin-text-muted)] uppercase tracking-wider px-2 py-1 flex items-center justify-between">
                      <span className="flex items-center gap-1.5">
                        <Package size={12} className="text-[var(--admin-text-muted)]" /> Products
                      </span>
                      <span>{matchingProducts.length}</span>
                    </div>
                    <div className="space-y-1 mt-1">
                      {visibleProducts.map((product, idx) => {
                        const flatIndex = visibleOrders.length + visibleSections.length + idx;
                        const isSelected = selectedIndex === flatIndex;

                        return (
                          <ProductResultRow
                            key={product.id}
                            product={product}
                            isSelected={isSelected}
                            onMouseMove={() => {
                              if (selectedIndex !== flatIndex) setSelectedIndex(flatIndex);
                            }}
                            onSelect={() => {
                              router.push(product.slug ? `/product/${product.slug}` : "/admin/products");
                              setIsOpen(false);
                              setSearchQuery(searchDraft);
                            }}
                          />
                        );
                      })}
                    </div>
                  </div>
                )}

                {/* Customers Section */}
                {visibleCustomers.length > 0 && (
                  <div>
                    <div className="text-[11px] font-semibold text-[var(--admin-text-muted)] uppercase tracking-wider px-2 py-1 flex items-center justify-between">
                      <span className="flex items-center gap-1.5">
                        <User size={12} className="text-[var(--admin-text-muted)]" /> Customers
                      </span>
                      <span>{matchingCustomers.length}</span>
                    </div>
                    <div className="space-y-1 mt-1">
                      {visibleCustomers.map((cust, idx) => {
                        const flatIndex = visibleOrders.length + visibleSections.length + visibleProducts.length + idx;
                        const isSelected = selectedIndex === flatIndex;

                        return (
                          <CustomerResultRow
                            key={cust.name}
                            cust={cust}
                            isSelected={isSelected}
                            onMouseMove={() => {
                              if (selectedIndex !== flatIndex) setSelectedIndex(flatIndex);
                            }}
                            onSelect={() => {
                              setSearchDraft(cust.name);
                              setSearchQuery(cust.name);
                              setIsOpen(false);
                            }}
                          />
                        );
                      })}
                    </div>
                  </div>
                )}
              </div>
            )}
          </div>

          {/* Palette Footer Bar with Keyboard Hints */}
          <div className="px-4 py-2 bg-[var(--admin-surface-2)] border-t border-white/5 flex items-center justify-between text-[11px] text-[var(--admin-text-muted)]">
            <div className="flex items-center gap-3">
              <span>
                <kbd className="px-1.5 py-0.5 bg-white/10 border border-white/10 rounded-md text-[10px] text-zinc-300 font-mono">↑↓</kbd> navigate
              </span>
              <span>
                <kbd className="px-1.5 py-0.5 bg-white/10 border border-white/10 rounded-md text-[10px] text-zinc-300 font-mono">↵</kbd> select
              </span>
              <span>
                <kbd className="px-1.5 py-0.5 bg-white/10 border border-white/10 rounded-md text-[10px] text-zinc-300 font-mono">esc</kbd> close
              </span>
            </div>
            {searchDraft.trim() && (
              <button
                onClick={() => {
                  setSearchDraft("");
                  setSearchQuery("");
                }}
                className="text-[var(--admin-text-muted)] hover:text-white font-medium hover:underline cursor-pointer"
              >
                Clear all
              </button>
            )}
          </div>
        </div>
      )}
    </div>
  );
}

// ─── ORDER MANAGEMENT & DEEP INSPECTION HELPERS ──────────────────────────────

function generateInvoiceHtml(order: OrderRecord): string {
  const customerName = order.shippingAddress?.name || "Valued Customer";
  const customerPhone = order.shippingAddress?.phone || "N/A";
  const address = order.shippingAddress?.address || "Address not provided";
  const pincode = order.shippingAddress?.pincode || "";
  const items = order.items && order.items.length > 0 ? order.items : [];
  const subtotal = order.subtotal || order.total;
  const discount = (order.couponDiscount || 0) + (order.bundleDiscount || 0);
  const shipping = order.shippingCost || 0;
  const grandTotal = order.total;

  const itemRows = items
    .map(
      (item, idx) => `
    <tr style="border-bottom: 1px solid #f0f0f0;">
      <td style="padding: 12px 8px; font-size: 13px; color: #111; font-weight: 500;">
        ${idx + 1}. ${item.productName}
        <div style="font-size: 11px; color: #777; margin-top: 2px;">
          ${item.colorName ? `Color: ${item.colorName} • ` : ""}${item.selectedSize ? `Size: ${item.selectedSize}` : ""}
        </div>
      </td>
      <td style="padding: 12px 8px; font-size: 13px; color: #444; text-align: center;">${item.quantity}</td>
      <td style="padding: 12px 8px; font-size: 13px; color: #444; text-align: right;">₹${item.unitPrice.toLocaleString("en-IN")}</td>
      <td style="padding: 12px 8px; font-size: 13px; color: #111; font-weight: 600; text-align: right;">₹${(item.totalPrice || item.unitPrice * item.quantity).toLocaleString("en-IN")}</td>
    </tr>
  `
    )
    .join("");

  return `<!DOCTYPE html>
<html lang="en">
<head>
  <meta charset="UTF-8">
  <title>Invoice - ${order.id} | VEYRO Atelier</title>
  <style>
    @media print {
      body { -webkit-print-color-adjust: exact; print-color-adjust: exact; }
      .no-print { display: none !important; }
    }
    body {
      font-family: -apple-system, BlinkMacSystemFont, "Segoe UI", Roboto, Helvetica, Arial, sans-serif;
      margin: 0;
      padding: 32px;
      color: #171717;
      background: #ffffff;
      font-size: 13px;
      line-height: 1.5;
    }
    .invoice-card {
      max-width: 780px;
      margin: 0 auto;
      border: 1px solid #e5e5e5;
      border-radius: 16px;
      padding: 36px;
      box-shadow: 0 4px 20px rgba(0,0,0,0.04);
    }
    .badge {
      display: inline-block;
      padding: 4px 10px;
      border-radius: 9999px;
      font-size: 11px;
      font-weight: 600;
      text-transform: uppercase;
      letter-spacing: 0.5px;
    }
  </style>
</head>
<body>
  <div class="invoice-card">
    <div style="display: flex; justify-content: space-between; align-items: flex-start; border-bottom: 2px solid #111; padding-bottom: 20px; margin-bottom: 24px;">
      <div>
        <h1 style="margin: 0; font-size: 26px; font-weight: 900; letter-spacing: 2px;">VEYRO</h1>
        <p style="margin: 3px 0 0 0; font-size: 11px; color: #666; text-transform: uppercase; letter-spacing: 1px;">Luxury Streetwear & Horology Atelier</p>
        <p style="margin: 2px 0 0 0; font-size: 11px; color: #888;">GSTIN: 33AAACV9821R1Z8 • Official Tax Invoice</p>
      </div>
      <div style="text-align: right;">
        <span class="badge" style="background: #fff8e7; color: #d97706; border: 1px solid #fde68a;">Official Invoice</span>
        <h2 style="margin: 8px 0 0 0; font-size: 16px; font-weight: 700; color: #111;">#${order.id}</h2>
        <p style="margin: 3px 0 0 0; font-size: 11px; color: #666;">Date: ${order.date}</p>
        <p style="margin: 1px 0 0 0; font-size: 11px; color: #666;">Status: <strong>${order.status}</strong></p>
      </div>
    </div>

    <div style="display: grid; grid-template-columns: 1fr 1fr; gap: 24px; margin-bottom: 28px;">
      <div style="background: #fafafa; padding: 16px; border-radius: 12px; border: 1px solid #eee;">
        <h3 style="margin: 0 0 8px 0; font-size: 11px; text-transform: uppercase; color: #777; letter-spacing: 0.5px;">Billed & Shipped To:</h3>
        <p style="margin: 0; font-size: 14px; font-weight: 700; color: #111;">${customerName}</p>
        <p style="margin: 3px 0 0 0; font-size: 12px; color: #555;">${address}${pincode ? `, ${pincode}` : ""}</p>
        <p style="margin: 4px 0 0 0; font-size: 12px; color: #555;">Phone: <strong>${customerPhone}</strong></p>
      </div>
      <div style="background: #fafafa; padding: 16px; border-radius: 12px; border: 1px solid #eee;">
        <h3 style="margin: 0 0 8px 0; font-size: 11px; text-transform: uppercase; color: #777; letter-spacing: 0.5px;">Payment & Shipment:</h3>
        <p style="margin: 0; font-size: 12px; color: #444;">Payment Mode: <strong style="text-transform: uppercase; color: #111;">${order.paymentMethod || "Prepaid"}</strong></p>
        <p style="margin: 4px 0 0 0; font-size: 12px; color: #444;">Fulfillment Status: <strong style="color: #10b981;">${order.status}</strong></p>
        <p style="margin: 4px 0 0 0; font-size: 12px; color: #444;">Est. Delivery: ${order.estimatedDelivery || "Standard 2-4 Business Days"}</p>
      </div>
    </div>

    <table style="width: 100%; border-collapse: collapse; margin-bottom: 24px;">
      <thead>
        <tr style="background: #111; color: #fff;">
          <th style="padding: 10px 8px; font-size: 11px; text-transform: uppercase; letter-spacing: 0.5px; text-align: left; border-top-left-radius: 8px; border-bottom-left-radius: 8px;">Product Description</th>
          <th style="padding: 10px 8px; font-size: 11px; text-transform: uppercase; letter-spacing: 0.5px; text-align: center;">Qty</th>
          <th style="padding: 10px 8px; font-size: 11px; text-transform: uppercase; letter-spacing: 0.5px; text-align: right;">Unit Price</th>
          <th style="padding: 10px 8px; font-size: 11px; text-transform: uppercase; letter-spacing: 0.5px; text-align: right; border-top-right-radius: 8px; border-bottom-right-radius: 8px;">Amount</th>
        </tr>
      </thead>
      <tbody>
        ${itemRows || `<tr><td colspan="4" style="padding: 16px; text-align: center; color: #888;">Items data</td></tr>`}
      </tbody>
    </table>

    <div style="display: flex; justify-content: flex-end; margin-bottom: 28px;">
      <div style="width: 260px;">
        <div style="display: flex; justify-content: space-between; padding: 4px 0; color: #666; font-size: 12px;">
          <span>Items Subtotal:</span>
          <span>₹${subtotal.toLocaleString("en-IN")}</span>
        </div>
        ${
          discount > 0
            ? `<div style="display: flex; justify-content: space-between; padding: 4px 0; color: #10b981; font-size: 12px;">
                <span>Discounts ${order.couponCode ? `(${order.couponCode})` : ""}:</span>
                <span>-₹${discount.toLocaleString("en-IN")}</span>
              </div>`
            : ""
        }
        <div style="display: flex; justify-content: space-between; padding: 4px 0; color: #666; font-size: 12px;">
          <span>Shipping / Handling:</span>
          <span>${shipping === 0 ? "FREE" : `₹${shipping}`}</span>
        </div>
        <div style="display: flex; justify-content: space-between; padding: 8px 0; margin-top: 6px; border-top: 2px solid #111; font-size: 16px; font-weight: 800; color: #111;">
          <span>Total Paid:</span>
          <span>₹${grandTotal.toLocaleString("en-IN")}</span>
        </div>
      </div>
    </div>

    <div style="border-top: 1px dashed #ddd; padding-top: 16px; display: flex; justify-content: space-between; align-items: center; color: #888; font-size: 11px;">
      <div>
        <p style="margin: 0;">Authorized Signature for <strong>VEYRO E-Commerce Pvt Ltd</strong></p>
        <p style="margin: 2px 0 0 0;">Customer Support: concierge@veyro.com • 1800-839-7600</p>
      </div>
      <div style="text-align: right;">
        <p style="margin: 0; font-family: monospace; letter-spacing: 2px; font-weight: 700; color: #333;">*${order.id}*</p>
        <p style="margin: 2px 0 0 0;">7-Day Easy Return Policy Valid</p>
      </div>
    </div>

    <div class="no-print" style="margin-top: 24px; text-align: center;">
      <button onclick="window.print()" style="padding: 10px 24px; background: #111; color: #fff; border: none; border-radius: 8px; font-size: 13px; font-weight: 600; cursor: pointer;">
        Print Invoice Now
      </button>
    </div>
  </div>
</body>
</html>`;
}

function printOrDownloadOrderSlip(order: OrderRecord) {
  const html = generateInvoiceHtml(order);
  try {
    const printWindow = window.open("", "_blank");
    if (printWindow) {
      printWindow.document.open();
      printWindow.document.write(html);
      printWindow.document.close();
      printWindow.focus();
      setTimeout(() => {
        try {
          printWindow.print();
        } catch {
          // ignore print failure if popup blocked
        }
      }, 500);
      return;
    }
  } catch (err) {
    console.warn("Could not open print window", err);
  }

  // Fallback to downloading HTML file
  const blob = new Blob([html], { type: "text/html;charset=utf-8" });
  const url = URL.createObjectURL(blob);
  const a = document.createElement("a");
  a.href = url;
  a.download = `INVOICE_${order.id}.html`;
  document.body.appendChild(a);
  a.click();
  document.body.removeChild(a);
  URL.revokeObjectURL(url);
}

function downloadAllOrdersCSV(ordersToExport: OrderRecord[]) {
  const headers = [
    "Order ID",
    "Customer Name",
    "Phone",
    "Delivery Address",
    "Pincode",
    "Items Count",
    "Items Summary",
    "Subtotal (INR)",
    "Coupon Discount (INR)",
    "Shipping (INR)",
    "Total (INR)",
    "Payment Method",
    "Order Status",
    "Order Date",
    "Estimated Delivery",
  ];

  const rows = ordersToExport.map((o) => {
    const itemsSummary = (o.items || [])
      .map(
        (it) =>
          `${it.productName} (${it.colorName || "Default"}, ${it.selectedSize || "Standard"} x${it.quantity})`
      )
      .join(" | ");
    return [
      `"${o.id}"`,
      `"${(o.shippingAddress?.name || "Customer").replace(/"/g, '""')}"`,
      `"${o.shippingAddress?.phone || ""}"`,
      `"${(o.shippingAddress?.address || "").replace(/"/g, '""')}"`,
      `"${o.shippingAddress?.pincode || ""}"`,
      o.itemsCount || o.items?.length || 1,
      `"${itemsSummary.replace(/"/g, '""')}"`,
      o.subtotal || o.total,
      o.couponDiscount || 0,
      o.shippingCost || 0,
      o.total,
      `"${o.paymentMethod || "UPI"}"`,
      `"${o.status}"`,
      `"${o.date}"`,
      `"${o.estimatedDelivery || ""}"`,
    ].join(",");
  });

  const csvContent =
    "data:text/csv;charset=utf-8,\uFEFF" + [headers.join(","), ...rows].join("\n");
  const encodedUri = encodeURI(csvContent);
  const link = document.createElement("a");
  link.setAttribute("href", encodedUri);
  link.setAttribute(
    "download",
    `VEYRO_Orders_Report_${new Date().toISOString().slice(0, 10)}.csv`
  );
  document.body.appendChild(link);
  link.click();
  document.body.removeChild(link);
}

// ─── ORDER DEEP INSPECTION MODAL COMPONENT ───────────────────────────────────

interface OrderDeepInspectionModalProps {
  order: OrderRecord | null;
  onClose: () => void;
  onUpdateStatus: (orderId: string, status: OrderStatus, note?: string) => void;
  showToast: (msg: string, type?: "success" | "info") => void;
  isNested?: boolean;
}

function OrderDeepInspectionModal({
  order,
  onClose,
  onUpdateStatus,
  showToast,
  isNested = false,
}: OrderDeepInspectionModalProps) {
  const [currentOrder, setCurrentOrder] = useState<OrderRecord | null>(order);
  const [adminNote, setAdminNote] = useState<string>("");
  const [isCopied, setIsCopied] = useState(false);

  useEffect(() => {
    setCurrentOrder(order);
    if (order) {
      const savedNote = localStorage.getItem(`veyro_order_note_${order.id}`) || "";
      setAdminNote(savedNote);
    }
  }, [order]);

  // Handle escape key
  useEffect(() => {
    function handleKeyDown(e: KeyboardEvent) {
      if (e.key === "Escape") {
        e.preventDefault();
        e.stopPropagation();
        onClose();
      }
    }
    if (order) {
      window.addEventListener("keydown", handleKeyDown, true);
    }
    return () => {
      window.removeEventListener("keydown", handleKeyDown, true);
    };
  }, [order, onClose]);

  if (!order || !currentOrder) return null;

  const customerName = currentOrder.shippingAddress?.name || "Customer";
  const avatar = getCustomerAvatar(customerName);
  const cleanPhone = (currentOrder.shippingAddress?.phone || "").replace(/[^0-9]/g, "");
  const totalUnits = (currentOrder.items || []).reduce((acc, it) => acc + (it.quantity || 1), 0);

  const formatPaymentMethod = (pm?: string) => {
    if (!pm) return "Prepaid";
    const clean = pm.trim();
    if (clean.toLowerCase() === "upi") return "UPI";
    if (clean.toLowerCase() === "cod") return "Cash on Delivery";
    return clean.charAt(0).toUpperCase() + clean.slice(1);
  };

  const handleStatusChange = (newStatus: OrderStatus) => {
    onUpdateStatus(currentOrder.id, newStatus);
    const newTimelineItem = {
      status: newStatus,
      timestamp: "Just now",
      description: `Status updated to ${newStatus} via Admin Panel`,
    };
    setCurrentOrder((prev) =>
      prev
        ? {
            ...prev,
            status: newStatus,
            timeline: [...(prev.timeline || []), newTimelineItem],
          }
        : prev
    );
    showToast(`Order #${currentOrder.id} status changed to ${newStatus}`, "success");
  };

  const handleSaveNote = () => {
    try {
      localStorage.setItem(`veyro_order_note_${currentOrder.id}`, adminNote);
      showToast(`Operational staff note saved for #${currentOrder.id}`, "success");
    } catch {
      showToast("Unable to save note to local storage", "info");
    }
  };

  const handleCopyOrderId = () => {
    navigator.clipboard.writeText(currentOrder.id);
    setIsCopied(true);
    showToast(`Copied ${currentOrder.id} to clipboard!`, "info");
    setTimeout(() => setIsCopied(false), 2000);
  };

  const quickTags = [
    { label: "Address Verified", icon: CheckCircle2, text: "[Address Verified]" },
    { label: "Priority Packing", icon: PackageCheck, text: "[Priority Packing]" },
    { label: "VIP Customer", icon: Sparkles, text: "[VIP Customer]" },
    { label: "Phone Confirmed", icon: PhoneCall, text: "[Phone Confirmed]" },
    { label: "Return/Swap Req", icon: RefreshCw, text: "[Return/Swap Req]" },
  ];

  return (
    <motion.div
      key="order-inspection-modal-backdrop"
      initial={{ opacity: 0 }}
      animate={{ opacity: 1 }}
      exit={{ opacity: 0 }}
      transition={{ duration: 0.22, ease: "easeOut" }}
      className={`fixed inset-0 z-[100010] flex items-center justify-center p-3 sm:p-5 overflow-hidden ${
        isNested ? "bg-transparent" : "bg-black/45 backdrop-blur-md"
      }`}
      onClick={onClose}
    >
      <motion.div
        key="order-inspection-modal-card"
        initial={{ opacity: 0, scale: 0.95, y: 16 }}
        animate={{ opacity: 1, scale: 1, y: 0 }}
        exit={{ opacity: 0, scale: 0.95, y: 12 }}
        transition={{ duration: 0.26, ease: [0.16, 1, 0.3, 1] }}
        className="bg-[var(--admin-elevated)] rounded-[28px] max-w-4xl w-full h-[88vh] min-h-[580px] max-h-[880px] flex flex-col border border-white/10 overflow-hidden shadow-2xl"
        onClick={(e) => e.stopPropagation()}
      >
        {/* Top Header */}
        <div className="px-6 py-5 bg-[var(--admin-surface)] text-white flex items-center justify-between border-b border-white/5 shrink-0">
          <div className="flex items-center gap-3 flex-wrap">
            <div className="w-10 h-10 rounded-[14px] bg-white/5 text-white flex items-center justify-center border border-white/10 shrink-0">
              <Eye size={18} />
            </div>
            <div>
              <div className="flex items-center gap-2">
                <span className="text-xs uppercase tracking-wider text-[var(--admin-text-muted)] font-semibold font-heading">
                  Order Deep Inspection
                </span>
                <span className="text-xs px-2.5 py-0.5 rounded-full bg-white/10 text-white font-mono">
                  #{currentOrder.id}
                </span>
              </div>
              <h2 className="text-lg font-heading font-bold text-white tracking-tight flex items-center gap-2">
                {customerName}&apos;s Order
              </h2>
            </div>
          </div>

          <div className="flex items-center gap-2">
            <button
              onClick={onClose}
              className="px-3.5 py-1.5 rounded-full bg-[var(--admin-surface-2)] hover:bg-white/10 border border-white/10 text-white text-xs font-semibold flex items-center gap-1.5 transition-colors cursor-pointer"
              title="Return to Orders (Esc)"
            >
              <ArrowLeft size={13} />
              <span className="hidden sm:inline">Back</span>
            </button>

            <button
              onClick={handleCopyOrderId}
              className="px-3.5 py-1.5 rounded-full bg-[var(--admin-surface-2)] hover:bg-white/10 border border-white/10 text-white text-xs font-semibold flex items-center gap-1.5 transition-colors cursor-pointer"
              title="Copy Order ID"
            >
              {isCopied ? <Check size={13} className="text-[#00F59B]" /> : <Copy size={13} />}
              <span>{isCopied ? "Copied" : "Copy ID"}</span>
            </button>

            <button
              onClick={() => printOrDownloadOrderSlip(currentOrder)}
              className="px-3.5 py-1.5 rounded-full bg-[var(--admin-surface-2)] hover:bg-white/10 border border-white/10 text-white text-xs font-semibold flex items-center gap-1.5 transition-colors cursor-pointer"
              title="Print official tax invoice slip"
            >
              <Printer size={13} />
              <span>Print Slip</span>
            </button>

            <button
              onClick={onClose}
              className="w-9 h-9 rounded-full hover:bg-white/10 text-[var(--admin-text-muted)] hover:text-white flex items-center justify-center transition-colors cursor-pointer outline-none"
              aria-label="Close modal"
            >
              <X size={18} />
            </button>
          </div>
        </div>

        {/* 4 Hero KPI Stats Bar */}
        <div className="grid grid-cols-2 md:grid-cols-4 gap-3 p-5 bg-[var(--admin-surface-2)] border-b border-white/5 shrink-0">
          <div className="bg-[var(--admin-surface)] p-3.5 rounded-[14px] border border-white/5">
            <div className="flex items-center justify-between text-[var(--admin-text-muted)] mb-1">
              <span className="text-[11px] font-medium uppercase tracking-wider">Gross Total</span>
              <IndianRupee size={13} className="text-white/60" />
            </div>
            <div className="h-7 flex items-center text-lg font-heading font-extrabold text-white tracking-tight tabular-nums">
              ₹{currentOrder.total.toLocaleString("en-IN")}
            </div>
            <div className="text-[11px] text-[var(--admin-text-muted)] mt-0.5 tracking-wide font-medium">
              Payment: <strong className="text-white font-semibold">{formatPaymentMethod(currentOrder.paymentMethod)}</strong>
            </div>
          </div>

          <div className="bg-[var(--admin-surface)] p-3.5 rounded-[14px] border border-white/5">
            <div className="flex items-center justify-between text-[var(--admin-text-muted)] mb-1">
              <span className="text-[11px] font-medium uppercase tracking-wider">Fulfillment</span>
              <Package size={13} className="text-white/60" />
            </div>
            <div className="h-7 flex items-center">
              <StatusPill status={currentOrder.status} />
            </div>
            <div className="text-[11px] text-[var(--admin-text-muted)] mt-0.5 tracking-wide font-medium">
              Est: <strong className="text-white font-semibold">{currentOrder.estimatedDelivery || "Standard"}</strong>
            </div>
          </div>

          <div className="bg-[var(--admin-surface)] p-3.5 rounded-[14px] border border-white/5">
            <div className="flex items-center justify-between text-[var(--admin-text-muted)] mb-1">
              <span className="text-[11px] font-medium uppercase tracking-wider">Package Items</span>
              <Boxes size={13} className="text-white/60" />
            </div>
            <div className="h-7 flex items-center text-lg font-heading font-extrabold text-white tracking-tight tabular-nums">
              {(() => {
                const count = currentOrder.itemsCount || currentOrder.items?.length || 1;
                return `${count} ${count === 1 ? "Product" : "Products"}`;
              })()}
            </div>
            <div className="text-[11px] text-[var(--admin-text-muted)] mt-0.5 tracking-wide font-medium">
              Total <strong className="text-white font-semibold">{totalUnits}</strong> physical units
            </div>
          </div>

          <div className="bg-[var(--admin-surface)] p-3.5 rounded-[14px] border border-white/5">
            <div className="flex items-center justify-between text-[var(--admin-text-muted)] mb-1">
              <span className="text-[11px] font-medium uppercase tracking-wider">Order Date</span>
              <Clock size={13} className="text-white/60" />
            </div>
            <div className="h-7 flex items-center text-xs sm:text-sm font-heading font-bold text-white tracking-tight truncate tabular-nums">
              {currentOrder.date}
            </div>
            <div className="text-[11px] text-[var(--admin-text-muted)] mt-0.5 font-medium flex items-center gap-1.5">
              <ShieldCheck size={12} className="text-[#00F59B]" />
              <span>Verified order</span>
            </div>
          </div>
        </div>

        {/* Scrollable Modal Body */}
        <div className="overflow-y-auto admin-scroll flex-1 min-h-0 p-5 sm:p-6 space-y-6 overscroll-contain bg-[var(--admin-surface-2)]">
          <div className="grid grid-cols-1 lg:grid-cols-12 gap-6">
            {/* Left Column (7 cols): Items List + Financials + Staff Notes */}
            <div className="lg:col-span-7 space-y-5">
              {/* Ordered Items List */}
              <div className="bg-[var(--admin-surface)] rounded-[14px] border border-white/5 p-4.5">
                <div className="flex items-center justify-between mb-3.5 pb-2 border-b border-white/5">
                  <div className="flex items-center gap-2">
                    <ShoppingCart size={15} className="text-white/60" />
                    <h3 className="text-xs font-heading font-bold text-white uppercase tracking-wider">
                      Ordered Line Items ({currentOrder.items?.length || 0})
                    </h3>
                  </div>
                  <span className="text-xs text-[var(--admin-text-muted)] font-mono">
                    Live Stock Allocation
                  </span>
                </div>

                <div className="space-y-3">
                  {currentOrder.items && currentOrder.items.length > 0 ? (
                    currentOrder.items.map((it, idx) => (
                      <div
                        key={idx}
                        className="flex items-center gap-3.5 p-3 rounded-[14px] bg-[var(--admin-surface-2)] border border-white/5 hover:border-white/10 transition-colors"
                      >
                        <div className="w-14 h-14 rounded-[10px] bg-[var(--admin-surface)] overflow-hidden shrink-0 border border-white/10 flex items-center justify-center p-1">
                          <Image
                            src={it.imageUrl || "/products/shoes/veyro-shoe-01-primary.webp"}
                            alt={it.productName}
                            width={56}
                            height={56}
                            className="w-full h-full object-cover rounded-lg"
                          />
                        </div>
                        <div className="flex-1 min-w-0">
                          <div className="flex items-center justify-between gap-2">
                            <h4 className="text-xs sm:text-sm font-heading font-bold text-white truncate">
                              {it.productName}
                            </h4>
                            <span className="text-xs font-heading font-bold text-white shrink-0 tabular-nums">
                              ₹{(it.totalPrice || it.unitPrice * it.quantity).toLocaleString("en-IN")}
                            </span>
                          </div>
                          <div className="flex items-center gap-2 mt-1 text-[11px] text-[var(--admin-text-muted)] flex-wrap">
                            {it.colorName && (
                              <span className="px-2 py-0.5 rounded-full bg-white/5 border border-white/10 font-medium text-white/90">
                                {it.colorName}
                              </span>
                            )}
                            {it.selectedSize && (
                              <span className="px-2 py-0.5 rounded-full bg-white/5 border border-white/10 font-medium text-white/90">
                                Size: {it.selectedSize}
                              </span>
                            )}
                            <span className="text-[var(--admin-text-muted)]">
                              Qty: <strong className="text-white">{it.quantity}</strong> × ₹{it.unitPrice.toLocaleString("en-IN")}
                            </span>
                          </div>
                          {it.productSlug && (
                            <div className="mt-1">
                              <Link
                                href={`/product/${it.productSlug}`}
                                target="_blank"
                                className="text-[10px] text-white/60 hover:text-white font-semibold inline-flex items-center gap-1 transition-colors"
                              >
                                <span>Inspect product page</span>
                                <ExternalLink size={10} />
                              </Link>
                            </div>
                          )}
                        </div>
                      </div>
                    ))
                  ) : (
                    <div className="p-4 text-center text-xs text-[var(--admin-text-muted)]">
                      No item data available for this order.
                    </div>
                  )}
                </div>
              </div>

              {/* Financial Bill Breakdown */}
              <div className="bg-[var(--admin-surface)] rounded-[14px] border border-white/5 p-4.5">
                <div className="flex items-center gap-2 mb-3 pb-2 border-b border-white/5">
                  <CreditCard size={15} className="text-white/60" />
                  <h3 className="text-xs font-heading font-bold text-white uppercase tracking-wider">
                    Financial Summary & Taxation
                  </h3>
                </div>

                <div className="space-y-2 text-xs">
                  <div className="flex items-center justify-between text-[var(--admin-text-muted)]">
                    <span>Items Subtotal</span>
                    <span className="font-heading font-semibold text-white tabular-nums">
                      ₹{(currentOrder.subtotal || currentOrder.total).toLocaleString("en-IN")}
                    </span>
                  </div>

                  {currentOrder.bundleDiscount > 0 && (
                    <div className="flex items-center justify-between text-emerald-400">
                      <span>Bundle Savings</span>
                      <span className="font-heading font-semibold tabular-nums">-₹{currentOrder.bundleDiscount.toLocaleString("en-IN")}</span>
                    </div>
                  )}

                  {currentOrder.couponDiscount > 0 && (
                    <div className="flex items-center justify-between text-emerald-400">
                      <span>
                        Coupon Discount {currentOrder.couponCode ? `(${currentOrder.couponCode})` : ""}
                      </span>
                      <span className="font-heading font-semibold tabular-nums">-₹{currentOrder.couponDiscount.toLocaleString("en-IN")}</span>
                    </div>
                  )}

                  <div className="flex items-center justify-between text-[var(--admin-text-muted)]">
                    <span>Express Shipping & Handling</span>
                    <span className="font-semibold text-emerald-400">
                      {currentOrder.shippingCost === 0 ? "FREE (Atelier Complimentary)" : `₹${currentOrder.shippingCost}`}
                    </span>
                  </div>

                  <div className="pt-2 border-t border-white/5 flex items-center justify-between text-sm font-heading font-extrabold text-white">
                    <span>Grand Total Paid</span>
                    <span className="text-base font-heading font-extrabold text-white tabular-nums">
                      ₹{currentOrder.total.toLocaleString("en-IN")}
                    </span>
                  </div>
                </div>
              </div>

              {/* Operational Staff Internal Note Box */}
              <div className="bg-[var(--admin-surface)] rounded-[14px] border border-white/5 p-4.5">
                <div className="flex items-center justify-between mb-2">
                  <div className="flex items-center gap-2">
                    <FileText size={15} className="text-white/60" />
                    <h3 className="text-xs font-heading font-bold text-white uppercase tracking-wider">
                      Internal Staff Notes
                    </h3>
                  </div>
                  <span className="text-[10px] text-[var(--admin-text-muted)] font-medium">Private to Admin Staff</span>
                </div>

                <textarea
                  value={adminNote}
                  onChange={(e) => setAdminNote(e.target.value)}
                  placeholder="Record customer preferences, delivery instructions, packaging notes or escalation info..."
                  rows={3}
                  className="w-full text-xs p-3 rounded-[14px] bg-[var(--admin-surface-2)] border border-white/10 text-white placeholder:text-[var(--admin-text-muted)] focus:outline-none focus:border-white/30 resize-none transition-all"
                />

                <div className="flex items-center gap-1.5 mt-2 flex-wrap">
                  {quickTags.map((tag) => {
                    const TagIcon = tag.icon;
                    return (
                      <button
                        key={tag.label}
                        type="button"
                        onClick={() => {
                          const noteWithTag = adminNote ? `${adminNote} • ${tag.text}` : tag.text;
                          setAdminNote(noteWithTag);
                        }}
                        className="inline-flex items-center gap-1.5 text-[11px] px-2.5 py-1 rounded-full bg-white/5 hover:bg-white/10 text-white/90 font-medium border border-white/10 transition-colors cursor-pointer"
                      >
                        <TagIcon size={12} className="text-white/60 shrink-0" />
                        <span>{tag.label}</span>
                      </button>
                    );
                  })}
                </div>

                <div className="flex items-center justify-between mt-3 pt-2.5 border-t border-white/5">
                  <span className="text-[10px] text-[var(--admin-text-muted)] font-mono">
                    Private operational note
                  </span>
                  <button
                    onClick={handleSaveNote}
                    className="px-4 py-1.5 rounded-full bg-white/10 hover:bg-white/15 border border-white/10 text-white text-xs font-semibold transition-colors cursor-pointer"
                  >
                    Save Operational Note
                  </button>
                </div>
              </div>
            </div>

            {/* Right Column (5 cols): Customer Info + Timeline + Quick Actions */}
            <div className="lg:col-span-5 space-y-5">
              {/* Customer Dossier Card */}
              <div className="bg-[var(--admin-surface)] rounded-[14px] border border-white/5 p-4.5">
                <div className="flex items-center gap-2 mb-3 pb-2 border-b border-white/5">
                  <User size={15} className="text-white/60" />
                  <h3 className="text-xs font-heading font-bold text-white uppercase tracking-wider">
                    Customer Profile & Contact
                  </h3>
                </div>

                <div className="flex items-start gap-3 mb-4">
                  <div
                    className={`w-11 h-11 rounded-full ${avatar.bg} ${avatar.text} flex items-center justify-center text-sm font-extrabold shrink-0`}
                  >
                    {avatar.initial}
                  </div>
                  <div>
                    <h4 className="text-sm font-heading font-bold text-white">{customerName}</h4>
                    <p className="text-xs text-[var(--admin-text-muted)] mt-0.5">
                      {currentOrder.shippingAddress?.phone || "No phone provided"}
                    </p>
                    <span className="inline-block mt-1 text-[10px] px-2.5 py-0.5 rounded-full bg-emerald-500/10 text-emerald-400 font-semibold border border-emerald-500/20">
                      Verified Buyer
                    </span>
                  </div>
                </div>

                {cleanPhone && (
                  <div className="grid grid-cols-2 gap-2 mb-4">
                    <a
                      href={`tel:${cleanPhone}`}
                      className="flex items-center justify-center gap-1.5 px-3 py-2 rounded-full bg-[var(--admin-surface-2)] hover:bg-white/10 text-white text-xs font-semibold border border-white/10 transition-colors"
                    >
                      <Phone size={13} className="text-white/60" />
                      <span>Call Client</span>
                    </a>
                    <a
                      href={`https://wa.me/91${cleanPhone.replace(/^91/, "")}?text=${encodeURIComponent(
                        `Hi ${customerName}, regarding your VEYRO order #${currentOrder.id}...`
                      )}`}
                      target="_blank"
                      rel="noopener noreferrer"
                      className="flex items-center justify-center gap-1.5 px-3 py-2 rounded-full bg-[#25D366]/10 hover:bg-[#25D366]/20 text-[#25D366] text-xs font-semibold transition-colors border border-[#25D366]/25"
                    >
                      <MessageSquare size={13} className="text-[#25D366]" />
                      <span>WhatsApp</span>
                    </a>
                  </div>
                )}

                <div className="p-3.5 rounded-[14px] bg-[var(--admin-surface-2)] border border-white/5 text-xs space-y-1">
                  <div className="flex items-center gap-1.5 font-bold text-white mb-1">
                    <MapPin size={13} className="text-white/60" />
                    <span>Shipping Destination</span>
                  </div>
                  <p className="text-white/80 leading-relaxed font-medium">
                    {currentOrder.shippingAddress?.address || "Address not provided"}
                  </p>
                  {currentOrder.shippingAddress?.pincode && (
                    <p className="text-[var(--admin-text-muted)] text-[11px]">
                      PIN / Postal Code: <strong className="text-white font-mono">{currentOrder.shippingAddress.pincode}</strong>
                    </p>
                  )}
                </div>
              </div>

              {/* Chronological Tracking Audit Timeline with Milestone Stepper */}
              <div className="bg-[var(--admin-surface)] rounded-[14px] border border-white/5 p-4.5">
                <div className="flex items-center justify-between mb-3 pb-2 border-b border-white/5">
                  <div className="flex items-center gap-2">
                    <Truck size={15} className="text-white/60" />
                    <h3 className="text-xs font-heading font-bold text-white uppercase tracking-wider">
                      Fulfillment Journey
                    </h3>
                  </div>
                  <span className="text-[10px] px-2 py-0.5 rounded-full bg-white/5 border border-white/10 text-[var(--admin-text-muted)] font-mono">
                    {currentOrder.status}
                  </span>
                </div>

                {/* Horizontal Milestone Stepper */}
                {currentOrder.status === "Cancelled" ? (
                  <div className="p-3 rounded-[12px] bg-[#FF4B55]/10 border border-[#FF4B55]/20 flex items-center justify-between text-xs text-[#FF4B55] mb-3.5">
                    <div className="flex items-center gap-2 font-semibold">
                      <XCircle size={15} />
                      <span>Order Cancelled</span>
                    </div>
                    <span className="text-[11px] text-white/50">Fulfillment Terminated</span>
                  </div>
                ) : (
                  <div className="mb-4 pb-3.5 border-b border-white/5">
                    {(() => {
                      const statusLower = currentOrder.status.toLowerCase();
                      let activeIdx = 0;
                      if (statusLower.includes("deliver") || statusLower.includes("return")) activeIdx = 3;
                      else if (statusLower.includes("ship") || statusLower.includes("out for")) activeIdx = 2;
                      else if (statusLower.includes("process") || statusLower.includes("pack")) activeIdx = 1;
                      else activeIdx = 0;

                      return (
                        <div className="grid grid-cols-4 gap-1 relative items-start">
                          {/* Continuous Background Track */}
                          <div className="absolute top-[10px] left-[12.5%] right-[12.5%] h-0.5 bg-white/10" />
                          {/* Continuous Active Progress Track */}
                          <div
                            className="absolute top-[10px] left-[12.5%] h-0.5 bg-emerald-500/60 transition-all duration-300"
                            style={{
                              width: `${(Math.min(activeIdx, 3) / 3) * 75}%`,
                            }}
                          />

                          {(["Confirmed", "Processing", "Shipped", "Delivered"] as const).map((stage, sIdx) => {
                            const isCompleted = sIdx < activeIdx;
                            const isCurrent = sIdx === activeIdx;

                            return (
                              <div key={stage} className="flex flex-col items-center text-center relative z-10">
                                <div
                                  className={`w-5 h-5 rounded-full flex items-center justify-center text-[10px] font-bold transition-colors ${
                                    isCompleted
                                      ? "bg-emerald-500/20 text-emerald-400 border border-emerald-500/40"
                                      : isCurrent
                                      ? "bg-white text-black ring-4 ring-white/15 shadow-sm"
                                      : "bg-[var(--admin-surface)] text-white/30 border border-white/15"
                                  }`}
                                >
                                  {isCompleted ? <Check size={10} strokeWidth={3} /> : sIdx + 1}
                                </div>
                                <span
                                  className={`text-[10px] mt-1.5 font-medium tracking-tight ${
                                    isCurrent
                                      ? "text-white font-bold"
                                      : isCompleted
                                      ? "text-white/80"
                                      : "text-white/30"
                                  }`}
                                >
                                  {stage}
                                </span>
                              </div>
                            );
                          })}
                        </div>
                      );
                    })()}
                  </div>
                )}

                {/* Audit Log Header */}
                <div className="flex items-center justify-between mb-2">
                  <span className="text-[10px] uppercase tracking-wider font-semibold text-[var(--admin-text-muted)]">
                    Audit Log History
                  </span>
                  <span className="text-[10px] text-white/40 font-mono">
                    {currentOrder.timeline?.length || 0} events
                  </span>
                </div>

                {/* Audit Log Timeline (Contained with Scrollbar) */}
                <div className="max-h-48 overflow-y-auto admin-scroll space-y-2.5 pr-1 relative before:absolute before:left-3 before:top-2 before:bottom-2 before:w-0.5 before:bg-white/5">
                  {currentOrder.timeline && currentOrder.timeline.length > 0 ? (
                    currentOrder.timeline.map((item, idx) => {
                      const stLower = item.status.toLowerCase();
                      const isCancel = stLower.includes("cancel");
                      const isDeliv = stLower.includes("deliver");
                      const isShip = stLower.includes("ship") || stLower.includes("out for");
                      const isProc = stLower.includes("process") || stLower.includes("pack");

                      let nodeColor = "bg-white/10 text-white/70 border-white/15";
                      let IconComp = Clock;
                      if (isCancel) {
                        nodeColor = "bg-[#FF4B55]/15 text-[#FF4B55] border-[#FF4B55]/30";
                        IconComp = X;
                      } else if (isDeliv) {
                        nodeColor = "bg-emerald-500/15 text-emerald-400 border-emerald-500/30";
                        IconComp = Check;
                      } else if (isShip) {
                        nodeColor = "bg-sky-500/15 text-sky-400 border-sky-500/30";
                        IconComp = Truck;
                      } else if (isProc) {
                        nodeColor = "bg-amber-500/15 text-amber-400 border-amber-500/30";
                        IconComp = Package;
                      }

                      return (
                        <div key={idx} className="flex items-start gap-3 relative z-10">
                          <div
                            className={`w-6 h-6 rounded-full flex items-center justify-center shrink-0 ring-4 ring-[var(--admin-surface)] border ${nodeColor}`}
                          >
                            <IconComp size={11} strokeWidth={isCancel || isDeliv ? 2.5 : 2} />
                          </div>
                          <div className="flex-1 text-xs min-w-0">
                            <div className="flex items-center justify-between gap-2">
                              <span
                                className={`font-heading font-bold truncate ${
                                  isCancel ? "text-[#FF4B55]" : "text-white"
                                }`}
                              >
                                {item.status}
                              </span>
                              <span className="text-[10px] text-[var(--admin-text-muted)] shrink-0 font-mono">
                                {item.timestamp}
                              </span>
                            </div>
                            <p className="text-[var(--admin-text-muted)] text-[11px] mt-0.5 leading-snug">
                              {item.description}
                            </p>
                          </div>
                        </div>
                      );
                    })
                  ) : (
                    <div className="flex items-start gap-3 relative z-10">
                      <div className="w-6 h-6 rounded-full bg-white/10 text-white/70 flex items-center justify-center shrink-0 ring-4 ring-[var(--admin-surface)] border border-white/15">
                        <Clock size={11} />
                      </div>
                      <div className="flex-1 text-xs">
                        <span className="font-heading font-bold text-white">{currentOrder.status}</span>
                        <p className="text-[var(--admin-text-muted)] text-[11px] mt-0.5">Order placed on {currentOrder.date}</p>
                      </div>
                    </div>
                  )}
                </div>
              </div>

              {/* Fast Quick Status Actions Bar */}
              <div className="bg-[var(--admin-surface)] rounded-[14px] border border-white/5 p-4.5">
                <div className="flex items-center justify-between mb-3 pb-2 border-b border-white/5">
                  <div className="flex items-center gap-2">
                    <RotateCw size={15} className="text-white/60" />
                    <h3 className="text-xs font-heading font-bold text-white uppercase tracking-wider">
                      Quick Status Actions
                    </h3>
                  </div>
                  <span className="text-[10px] text-[var(--admin-text-muted)] font-medium font-mono">
                    State Transitions
                  </span>
                </div>

                <div className="grid grid-cols-2 gap-2.5">
                  {[
                    {
                      status: "Processing" as OrderStatus,
                      label: "Mark Processing",
                      activeLabel: "Processing (Active)",
                      icon: Package,
                      hoverBorder: "hover:border-amber-500/30",
                      hoverBg: "hover:bg-amber-500/10",
                      hoverText: "hover:text-amber-400",
                      iconColor: "text-amber-400/80",
                    },
                    {
                      status: "Shipped" as OrderStatus,
                      label: "Mark Shipped",
                      activeLabel: "Shipped (Active)",
                      icon: Truck,
                      hoverBorder: "hover:border-sky-500/30",
                      hoverBg: "hover:bg-sky-500/10",
                      hoverText: "hover:text-sky-400",
                      iconColor: "text-sky-400/80",
                    },
                    {
                      status: "Delivered" as OrderStatus,
                      label: "Mark Delivered",
                      activeLabel: "Delivered (Active)",
                      icon: CheckCircle2,
                      hoverBorder: "hover:border-emerald-500/30",
                      hoverBg: "hover:bg-emerald-500/10",
                      hoverText: "hover:text-emerald-400",
                      iconColor: "text-emerald-400/80",
                    },
                    {
                      status: "Cancelled" as OrderStatus,
                      label: "Cancel Order",
                      activeLabel: "Cancelled (Active)",
                      icon: XCircle,
                      hoverBorder: "hover:border-[#FF4B55]/30",
                      hoverBg: "hover:bg-[#FF4B55]/10",
                      hoverText: "hover:text-[#FF4B55]",
                      iconColor: "text-[#FF4B55]/80",
                    },
                  ].map((action) => {
                    const isCurrent = currentOrder.status === action.status;
                    const ActionIcon = action.icon;
                    return (
                      <button
                        key={action.status}
                        onClick={() => handleStatusChange(action.status)}
                        disabled={isCurrent}
                        className={`h-9.5 px-3 rounded-[10px] text-xs font-semibold flex items-center justify-center gap-1.5 transition-all whitespace-nowrap ${
                          isCurrent
                            ? "bg-white/5 text-white/40 border border-white/5 cursor-not-allowed"
                            : `bg-[var(--admin-surface-2)] border border-white/10 text-white/90 ${action.hoverBorder} ${action.hoverBg} ${action.hoverText} cursor-pointer`
                        }`}
                      >
                        <ActionIcon
                          size={13}
                          className={isCurrent ? "text-white/30" : action.iconColor}
                        />
                        <span className="truncate">
                          {isCurrent ? action.activeLabel : action.label}
                        </span>
                      </button>
                    );
                  })}
                </div>
              </div>
            </div>
          </div>
        </div>

        {/* Modal Footer */}
        <div className="px-6 py-4 bg-[var(--admin-surface)] border-t border-white/5 flex items-center justify-between text-xs text-[var(--admin-text-muted)] shrink-0">
          <div className="flex items-center gap-2">
            <span className="w-2 h-2 rounded-full bg-[var(--admin-success)] animate-pulse" />
            <span>Real-time Order State Synchronization Active</span>
          </div>
          <button
            onClick={onClose}
            className="px-5 py-2 rounded-full bg-white/5 hover:bg-white/10 border border-white/10 text-white font-bold transition-colors cursor-pointer"
          >
            Close Window
          </button>
        </div>
      </motion.div>
    </motion.div>
  );
}

// ─── ALL ORDERS MANAGER MODAL COMPONENT ───────────────────────────────────────

interface AllOrdersManagerModalProps {
  isOpen: boolean;
  onClose: () => void;
  orders: OrderRecord[];
  onSelectOrder: (order: OrderRecord) => void;
  onUpdateStatus: (orderId: string, status: OrderStatus, note?: string) => void;
  showToast: (msg: string, type?: "success" | "info") => void;
  isInspecting?: boolean;
}

function AllOrdersManagerModal({
  isOpen,
  onClose,
  orders,
  onSelectOrder,
  onUpdateStatus,
  showToast,
  isInspecting = false,
}: AllOrdersManagerModalProps) {
  const [modalSearch, setModalSearch] = useState("");
  const [statusFilter, setStatusFilter] = useState<string>("All");
  const [sortBy, setSortBy] = useState<"newest" | "oldest" | "highest" | "lowest">("newest");

  // Handle escape key
  useEffect(() => {
    function handleKeyDown(e: KeyboardEvent) {
      if (e.key === "Escape") {
        onClose();
      }
    }
    if (isOpen) {
      window.addEventListener("keydown", handleKeyDown);
    }
    return () => {
      window.removeEventListener("keydown", handleKeyDown);
    };
  }, [isOpen, onClose]);

  const counts = useMemo(() => {
    return {
      all: orders.length,
      delivered: orders.filter((o) => {
        const isRet = o.status === "Returned" || o.status === "Return Requested" || o.returnRequest?.status === "approved" || o.returnRequest?.status === "pending";
        return o.status === "Delivered" && !isRet;
      }).length,
      processing: orders.filter((o) => o.status === "Processing" || o.status === "Confirmed" || o.status === "Packed").length,
      shipped: orders.filter((o) => o.status === "Shipped" || o.status === "Out for Delivery").length,
      cancelled: orders.filter((o) => o.status === "Cancelled").length,
      returned: orders.filter((o) => o.status === "Returned" || o.status === "Return Requested" || o.returnRequest?.status === "approved" || o.returnRequest?.status === "pending").length,
    };
  }, [orders]);

  const filteredOrders = useMemo(() => {
    let list = [...orders];

    if (statusFilter !== "All") {
      list = list.filter((o) => {
        const isRet = o.status === "Returned" || o.status === "Return Requested" || o.returnRequest?.status === "approved" || o.returnRequest?.status === "pending";
        if (statusFilter === "Delivered") return o.status === "Delivered" && !isRet;
        if (statusFilter === "Processing") return o.status === "Processing" || o.status === "Confirmed" || o.status === "Packed";
        if (statusFilter === "Shipped") return o.status === "Shipped" || o.status === "Out for Delivery";
        if (statusFilter === "Cancelled") return o.status === "Cancelled";
        if (statusFilter === "Returned") return isRet;
        return true;
      });
    }

    if (modalSearch.trim()) {
      list = searchOrders(list, modalSearch);
    }

    if (sortBy === "highest") {
      list.sort((a, b) => b.total - a.total);
    } else if (sortBy === "lowest") {
      list.sort((a, b) => a.total - b.total);
    } else if (sortBy === "oldest") {
      list.sort((a, b) => new Date(a.date).getTime() - new Date(b.date).getTime());
    }

    return list;
  }, [orders, statusFilter, modalSearch, sortBy]);

  const totalGrossRevenue = useMemo(() => {
    return filteredOrders.reduce((sum, o) => sum + o.total, 0);
  }, [filteredOrders]);

  return (
    <motion.div
      key="all-orders-modal-backdrop"
      initial={{ opacity: 0 }}
      animate={{ opacity: 1 }}
      exit={{ opacity: 0 }}
      transition={{ duration: 0.22, ease: "easeOut" }}
      style={{ pointerEvents: isInspecting ? "none" : "auto" }}
      className="fixed inset-0 z-[100000] bg-black/45 backdrop-blur-md flex items-center justify-center p-3 sm:p-5 overflow-hidden"
      onClick={onClose}
    >
      <motion.div
        key="all-orders-modal-card"
        initial={{ opacity: 0, scale: 0.95, y: 14 }}
        animate={{
          opacity: isInspecting ? 0 : 1,
          scale: isInspecting ? 0.94 : 1,
          y: isInspecting ? -10 : 0,
        }}
        exit={{ opacity: 0, scale: 0.95, y: 12 }}
        transition={{ duration: 0.24, ease: [0.16, 1, 0.3, 1] }}
        className="bg-[var(--admin-elevated)] rounded-[28px] max-w-6xl xl:max-w-7xl w-full h-[88vh] min-h-[580px] max-h-[880px] flex flex-col border border-white/10 overflow-hidden shadow-2xl"
        onClick={(e) => e.stopPropagation()}
      >
        {/* Header */}
        <div className="p-5 sm:p-6 bg-[var(--admin-surface)] border-b border-white/5 flex items-center justify-between gap-4 shrink-0">
          <div className="flex items-center gap-3.5">
            <AdminIconBadge variant="section" icon={ShoppingCart} />
            <div>
              <h2 className="text-xl sm:text-2xl font-heading font-bold text-white leading-tight tracking-tight">
                All Orders &amp; Shipments Management
              </h2>
              <p className="text-xs sm:text-[13px] text-[var(--admin-text-muted)] mt-1">
                Real-time fulfillment pipeline, customer tracking, and dispatch operations ({orders.length} total orders)
              </p>
            </div>
          </div>

          <div className="flex items-center gap-2.5">
            <button
              type="button"
              onClick={() => {
                downloadAllOrdersCSV(filteredOrders);
                showToast(`Exported ${filteredOrders.length} orders to CSV`, "success");
              }}
              className="flex items-center gap-2 h-9 px-4 rounded-[12px] bg-white/[0.05] hover:bg-white/10 text-white border border-white/10 text-xs sm:text-[13px] font-semibold transition-colors cursor-pointer"
            >
              <FileSpreadsheet size={15} />
              <span>Export CSV</span>
            </button>

            <button
              type="button"
              onClick={onClose}
              className="w-9 h-9 rounded-[12px] hover:bg-white/10 text-[var(--admin-text-muted)] hover:text-white flex items-center justify-center transition-colors cursor-pointer outline-none"
              aria-label="Close modal"
            >
              <X size={18} />
            </button>
          </div>
        </div>

        {/* Filters Bar */}
        <div className="p-4 sm:p-5 border-b border-white/5 bg-[var(--admin-surface-2)] flex flex-wrap items-center justify-between gap-3 text-xs shrink-0">
          {/* Search */}
          <div className="relative flex-1 min-w-[240px] lg:min-w-[300px] max-w-sm">
            <Search size={15} className="absolute left-3.5 top-1/2 -translate-y-1/2 text-[var(--admin-text-muted)]" />
            <input
              type="text"
              value={modalSearch}
              onChange={(e) => setModalSearch(e.target.value)}
              placeholder="Search Order ID, customer, product..."
              className="w-full h-10 pl-10 pr-8 bg-[var(--admin-surface)] rounded-[12px] border border-white/10 text-xs sm:text-sm text-white placeholder:text-[var(--admin-text-muted)] focus:outline-none focus:border-[var(--admin-primary)] transition-colors"
            />
            {modalSearch && (
              <button
                type="button"
                onClick={() => setModalSearch("")}
                className="absolute right-3 top-1/2 -translate-y-1/2 text-[var(--admin-text-muted)] hover:text-white cursor-pointer"
              >
                <X size={14} />
              </button>
            )}
          </div>

          {/* Status Tabs */}
          <div className="flex items-center gap-1.5 overflow-x-auto no-scrollbar">
            {[
              { id: "All", label: "All", count: counts.all },
              { id: "Delivered", label: "Delivered", count: counts.delivered },
              { id: "Processing", label: "Processing", count: counts.processing },
              { id: "Shipped", label: "Shipped", count: counts.shipped },
              { id: "Cancelled", label: "Cancelled", count: counts.cancelled },
              { id: "Returned", label: "Returned", count: counts.returned },
            ].map((tab) => {
              const isActive = statusFilter === tab.id;
              return (
                <button
                  key={tab.id}
                  type="button"
                  onClick={() => setStatusFilter(tab.id)}
                  className={`h-9 px-3.5 rounded-[10px] text-xs sm:text-[13px] transition-colors cursor-pointer flex items-center justify-center gap-1.5 shrink-0 ${
                    isActive
                      ? "bg-white/15 text-white font-semibold border border-white/20 shadow-sm"
                      : "text-[var(--admin-text-muted)] hover:text-white hover:bg-white/[0.04] border border-transparent font-medium"
                  }`}
                >
                  <span>{tab.label}</span>
                  <span
                    className={`text-[11px] px-1.5 py-0.5 rounded-[6px] font-mono ${
                      isActive ? "bg-white/20 text-white font-bold" : "bg-white/5 text-[var(--admin-text-muted)]"
                    }`}
                  >
                    {tab.count}
                  </span>
                </button>
              );
            })}
          </div>

          {/* Sort Dropdown */}
          <div className="flex items-center gap-2">
            <AdminSelect
              value={sortBy}
              onValueChange={(val) => setSortBy(val as "newest" | "oldest" | "highest" | "lowest")}
              options={RECENT_ORDERS_SORT_OPTIONS}
              className="w-52"
              triggerClassName="h-10 text-xs sm:text-[13px] font-medium rounded-[12px]"
              aria-label="Sort orders"
            />
          </div>
        </div>

        {/* Orders Table Container */}
        <div className="overflow-y-auto admin-scroll flex-1 min-h-0 overscroll-contain bg-[var(--admin-surface-2)]">
          <table className="w-full text-left text-xs sm:text-[13px] [border-collapse:separate] [border-spacing:0]" style={{ borderCollapse: "separate", borderSpacing: 0 }} role="table">
            <thead className="text-[var(--admin-text-muted)] font-bold text-[11px] sm:text-xs uppercase tracking-wider select-none">
              <tr>
                <th className="sticky top-0 z-20 bg-[var(--admin-surface)] border-b border-white/5 py-4 px-4 w-38 text-center">Order ID</th>
                <th className="sticky top-0 z-20 bg-[var(--admin-surface)] border-b border-white/5 py-4 px-4 w-56 min-w-[200px] text-left">Customer</th>
                <th className="sticky top-0 z-20 bg-[var(--admin-surface)] border-b border-white/5 py-4 px-4 min-w-[280px] text-left">Products</th>
                <th className="sticky top-0 z-20 bg-[var(--admin-surface)] border-b border-white/5 py-4 px-3 w-32 text-right">Total</th>
                <th className="sticky top-0 z-20 bg-[var(--admin-surface)] border-b border-white/5 py-4 px-3 w-32 text-center">Status</th>
                <th className="sticky top-0 z-20 bg-[var(--admin-surface)] border-b border-white/5 py-4 px-4 w-44 text-center">Date</th>
                <th className="sticky top-0 z-20 bg-[var(--admin-surface)] border-b border-white/5 py-4 px-4 w-28 text-center">Action</th>
              </tr>
            </thead>
            <tbody className="divide-y divide-white/5">
              {filteredOrders.length === 0 ? (
                <tr>
                  <td colSpan={7} className="py-16 px-6 text-center text-sm text-[var(--admin-text-muted)]">
                    No orders match your filter criteria.
                  </td>
                </tr>
              ) : (
                filteredOrders.map((order) => {
                  const customerName = order.shippingAddress?.name || "Customer";
                  const avatar = getCustomerAvatar(customerName);
                  const firstItem = order.items?.[0];
                  const primaryProductName = firstItem?.productName || order.itemNames?.[0] || "Custom Product";
                  const itemCount = order.itemsCount || order.items?.length || 1;
                  const otherCount = itemCount > 1 ? itemCount - 1 : 0;
                  const thumbUrl = firstItem?.imageUrl || "/products/shoes/veyro-shoe-01-primary.webp";
                  const variantSummary = [
                    firstItem?.selectedSize ? `Size: ${firstItem.selectedSize}` : null,
                    firstItem?.colorName || null,
                  ].filter(Boolean).join(" · ");

                  return (
                    <tr
                      key={order.id}
                      onClick={() => onSelectOrder(order)}
                      className="hover:bg-white/[0.04] cursor-pointer transition-colors group border-b border-white/5"
                      title="Click to deep inspect order"
                    >
                      {/* ID */}
                      <td className="px-4 py-4.5 whitespace-nowrap text-center text-[13px] sm:text-sm font-mono font-bold text-white group-hover:text-[var(--admin-primary)] transition-colors select-all">
                        {order.id}
                      </td>

                      {/* Customer */}
                      <td className="px-4 py-4.5 whitespace-nowrap">
                        <div className="flex items-center gap-3">
                          <div
                            className={`w-8 h-8 rounded-full ${avatar.bg} ${avatar.text} flex items-center justify-center text-xs font-bold shrink-0 border border-white/10`}
                          >
                            {avatar.initial}
                          </div>
                          <div className="min-w-0">
                            <span className="text-[14px] sm:text-[15px] font-semibold text-white block truncate leading-snug">
                              {customerName}
                            </span>
                            <span className="text-[12px] text-[var(--admin-text-muted)] font-mono mt-0.5 block select-all">
                              {order.shippingAddress?.phone || "Prepaid"}
                            </span>
                          </div>
                        </div>
                      </td>

                      {/* Products */}
                      <td className="px-4 py-4.5">
                        <div className="flex items-center gap-3">
                          <div className="w-11 h-11 rounded-[10px] bg-[var(--admin-surface)] overflow-hidden shrink-0 border border-white/10 flex items-center justify-center p-0.5 group-hover:border-white/20 transition-colors">
                            <Image
                              src={thumbUrl}
                              alt={primaryProductName}
                              width={44}
                              height={44}
                              className="w-full h-full object-cover rounded-[8px]"
                            />
                          </div>
                          <div className="min-w-0 max-w-[240px] sm:max-w-[280px] xl:max-w-[340px]">
                            <div className="text-[14px] sm:text-[15px] font-semibold text-white truncate leading-snug group-hover:text-white transition-colors">
                              {primaryProductName}
                            </div>
                            <div className="flex items-center gap-2 mt-0.5">
                              {variantSummary ? (
                                <span className="text-[12px] text-[var(--admin-text-muted)] truncate">
                                  {variantSummary}
                                </span>
                              ) : (
                                <span className="text-[12px] text-[var(--admin-text-muted)]">
                                  Standard Order
                                </span>
                              )}
                              {otherCount > 0 && (
                                <span className="inline-flex items-center px-1.5 py-0.5 rounded-[5px] text-[10px] font-semibold bg-white/[0.08] text-white/90 border border-white/10 shrink-0">
                                  +{otherCount} more
                                </span>
                              )}
                            </div>
                          </div>
                        </div>
                      </td>

                      {/* Total */}
                      <td className="px-3 py-4.5 whitespace-nowrap text-right">
                        <span className="text-[15px] font-heading font-bold text-white tabular-nums">
                          ₹{order.total.toLocaleString("en-IN")}
                        </span>
                      </td>

                      {/* Status */}
                      <td className="px-3 py-4.5 whitespace-nowrap text-center">
                        <StatusPill status={order.status} />
                      </td>

                      {/* Date */}
                      <td className="px-4 py-4.5 whitespace-nowrap text-center text-[13px] text-[var(--admin-text-muted)] tabular-nums">
                        {order.date}
                      </td>

                      {/* Action */}
                      <td className="px-4 py-4.5 whitespace-nowrap text-center">
                        <button
                          type="button"
                          onClick={(e) => {
                            e.stopPropagation();
                            onSelectOrder(order);
                          }}
                          className="inline-flex items-center gap-1.5 h-8 px-3.5 rounded-[9px] bg-white/[0.04] hover:bg-white/10 text-white/80 hover:text-white text-xs font-semibold border border-white/5 hover:border-white/15 transition-all cursor-pointer mx-auto"
                        >
                          <span>Inspect</span>
                          <ChevronRight size={13} className="transition-transform group-hover:translate-x-0.5 text-white/50 group-hover:text-white" />
                        </button>
                      </td>
                    </tr>
                  );
                })
              )}
            </tbody>
          </table>
        </div>

        {/* Footer KPI Summary Bar */}
        <div className="p-4 sm:p-5 bg-[var(--admin-surface)] border-t border-white/5 flex flex-wrap items-center justify-between gap-4 shrink-0">
          <div className="flex items-center gap-6 sm:gap-8">
            <div>
              <div className="text-[11px] font-semibold text-[var(--admin-text-muted)] uppercase tracking-wider">Filtered Orders</div>
              <div className="text-lg sm:text-xl font-heading font-bold text-white tabular-nums mt-0.5">
                {filteredOrders.length} <span className="text-xs font-normal text-[var(--admin-text-muted)] font-sans">orders</span>
              </div>
            </div>

            <div className="h-8 w-px bg-white/10 hidden sm:block" />

            <div>
              <div className="text-[11px] font-semibold text-[var(--admin-text-muted)] uppercase tracking-wider">Gross Value</div>
              <div className="text-base sm:text-lg font-heading font-bold text-white tabular-nums mt-0.5">
                ₹{totalGrossRevenue.toLocaleString("en-IN")}
              </div>
            </div>

            <div className="h-8 w-px bg-white/10 hidden sm:block" />

            <div>
              <div className="text-[11px] font-semibold text-[var(--admin-text-muted)] uppercase tracking-wider">Delivered Rate</div>
              <div className="text-base sm:text-lg font-heading font-bold text-[var(--admin-success)] tabular-nums mt-0.5">
                {orders.length > 0 ? Math.round((counts.delivered / orders.length) * 100) : 0}%
              </div>
            </div>
          </div>

          <div className="flex items-center gap-2.5">
            <button
              type="button"
              onClick={() => {
                downloadAllOrdersCSV(filteredOrders);
                showToast(`Exported ${filteredOrders.length} orders to CSV`, "success");
              }}
              className="h-10 px-4 rounded-[12px] bg-white/[0.05] border border-white/10 hover:bg-white/10 text-white font-semibold text-xs sm:text-[13px] transition-colors cursor-pointer flex items-center gap-2"
            >
              <Download size={14} />
              <span>Export All ({filteredOrders.length})</span>
            </button>

            <button
              type="button"
              onClick={onClose}
              className="h-10 px-5 rounded-[12px] bg-[var(--admin-primary)] hover:bg-[var(--admin-primary-hover)] text-white text-xs sm:text-[13px] font-semibold transition-colors cursor-pointer shadow-md shadow-[var(--admin-primary)]/20"
            >
              Close
            </button>
          </div>
        </div>
      </motion.div>
    </motion.div>
  );
}

// ─── ADMIN NOTIFICATION ITEM MODEL ──────────────────────────────────────────

interface AdminNotificationItem {
  id: string;
  type: "return_request" | "order_delivered" | "low_stock" | "new_order";
  icon?: string;
  title: string;
  subtitle: string;
  timeAgo: string;
  isRead: boolean;
  link?: string;
  isReturnAction?: boolean;
}

function NotificationIconBadge({ type }: { type: AdminNotificationItem["type"] }) {
  switch (type) {
    case "return_request":
      return (
        <div
          className="w-8 h-8 rounded-[14px] bg-[#F59E0B]/15 text-[#F59E0B] border border-[#F59E0B]/25 flex items-center justify-center shrink-0 mt-0.5 group-hover:scale-105 transition-transform"
          aria-hidden="true"
        >
          <RotateCcw size={15} strokeWidth={2.2} />
        </div>
      );
    case "order_delivered":
      return (
        <div
          className="w-8 h-8 rounded-[14px] bg-[#00F59B]/15 text-[#00F59B] border border-[#00F59B]/25 flex items-center justify-center shrink-0 mt-0.5 group-hover:scale-105 transition-transform"
          aria-hidden="true"
        >
          <CheckCircle2 size={15} strokeWidth={2.2} />
        </div>
      );
    case "low_stock":
      return (
        <div
          className="w-8 h-8 rounded-[14px] bg-[#FF4B55]/15 text-[#FF4B55] border border-[#FF4B55]/25 flex items-center justify-center shrink-0 mt-0.5 group-hover:scale-105 transition-transform"
          aria-hidden="true"
        >
          <AlertTriangle size={15} strokeWidth={2.2} />
        </div>
      );
    case "new_order":
      return (
        <div
          className="w-8 h-8 rounded-[14px] bg-[#38BDF8]/15 text-[#38BDF8] border border-[#38BDF8]/25 flex items-center justify-center shrink-0 mt-0.5 group-hover:scale-105 transition-transform"
          aria-hidden="true"
        >
          <ShoppingBag size={15} strokeWidth={2.2} />
        </div>
      );
    default:
      return (
        <div
          className="w-8 h-8 rounded-[14px] bg-[var(--admin-surface-2)] text-[var(--admin-text-muted)] border border-white/10 flex items-center justify-center shrink-0 mt-0.5 group-hover:scale-105 transition-transform"
          aria-hidden="true"
        >
          <Bell size={15} strokeWidth={2} />
        </div>
      );
  }
}

// ─── MAIN ADMIN DASHBOARD COMPONENT ──────────────────────────────────────────

export default function AdminDashboard() {
  const { products } = useProducts();
  const { sections } = useCustomSections();
  const { orders, updateOrderStatus, reviewReturnRequest } = useUser();
  const router = useRouter();

  // Dynamically unified catalog combining standard and custom section products
  const unifiedProducts = useMemo(() => {
    return getUnifiedSearchableProducts(products, sections);
  }, [products, sections]);

  // Return Requests Deep Review Modal state
  const [isReturnModalOpen, setIsReturnModalOpen] = useState(false);

  // Live count of pending return requests
  const pendingReturnsCount = useMemo(() => {
    return orders.filter(
      (o) => o.returnRequest && o.returnRequest.status === "pending"
    ).length;
  }, [orders]);

  // Top Products Deep State & Interactive Controls
  const [topProductsList, setTopProductsList] = useState<TopProductItem[]>(TOP_PRODUCTS_MASTER);
  const [selectedTopProduct, setSelectedTopProduct] = useState<TopProductItem | null>(null);
  const [isAllProductsModalOpen, setIsAllProductsModalOpen] = useState(false);
  const [topProductsTimeframe, setTopProductsTimeframe] = useState<"period" | "month" | "week" | "today" | "all">("period");
  const [topProductsMetric, setTopProductsMetric] = useState<"revenue" | "units">("revenue");
  const [topProductsCategory, setTopProductsCategory] = useState<string>("all");
  const [adminToast, setAdminToast] = useState<{ message: string; type: "success" | "info" } | null>(null);

  // Orders Deep Inspection & Management Modals State
  const [selectedOrderForModal, setSelectedOrderForModal] = useState<OrderRecord | null>(null);
  const [isAllOrdersModalOpen, setIsAllOrdersModalOpen] = useState(false);
  const [recentOrdersStatusFilter, setRecentOrdersStatusFilter] = useState<string>("All");
  const [recentOrdersPage, setRecentOrdersPage] = useState<number>(1);

  // Centralized body scroll lock for admin modals
  const isAnyAdminModalOpen = Boolean(
    isReturnModalOpen ||
    isAllProductsModalOpen ||
    selectedTopProduct ||
    isAllOrdersModalOpen ||
    selectedOrderForModal
  );

  useEffect(() => {
    const mainEl = document.querySelector("main.admin-scroll-container") as HTMLElement | null;
    if (isAnyAdminModalOpen) {
      document.body.style.overflow = "hidden";
      if (mainEl) mainEl.style.overflow = "hidden";
    } else {
      document.body.style.overflow = "unset";
      if (mainEl) mainEl.style.overflow = "auto";
    }
    return () => {
      document.body.style.overflow = "unset";
      if (mainEl) mainEl.style.overflow = "auto";
    };
  }, [isAnyAdminModalOpen]);

  const triggerToast = (message: string, type: "success" | "info" = "success") => {
    setAdminToast({ message, type });
    setTimeout(() => {
      setAdminToast((curr) => (curr?.message === message ? null : curr));
    }, 3500);
  };

  const handleUpdateStock = (productId: string, newStock: number) => {
    setTopProductsList((prev) =>
      prev.map((p) => {
        if (p.id === productId || p.sku === productId) {
          const updated: TopProductItem = {
            ...p,
            stock: newStock,
            stockStatus: newStock <= 5 ? "critical" : newStock <= 10 ? "low" : "healthy",
          };
          if (selectedTopProduct && (selectedTopProduct.id === productId || selectedTopProduct.sku === productId)) {
            setSelectedTopProduct(updated);
          }
          return updated;
        }
        return p;
      })
    );
  };

  const handleUpdatePrice = (productId: string, newPrice: number) => {
    setTopProductsList((prev) =>
      prev.map((p) => {
        if (p.id === productId || p.sku === productId) {
          const newMargin = Math.round(((newPrice - p.cogs) / newPrice) * 1000) / 10;
          const updated: TopProductItem = {
            ...p,
            unitPrice: newPrice,
            marginPercent: newMargin,
          };
          if (selectedTopProduct && (selectedTopProduct.id === productId || selectedTopProduct.sku === productId)) {
            setSelectedTopProduct(updated);
          }
          return updated;
        }
        return p;
      })
    );
  };



  // Dynamic calendar date anchors
  const now = new Date();
  const todayIso = `${now.getFullYear()}-${String(now.getMonth() + 1).padStart(2, "0")}-${String(now.getDate()).padStart(2, "0")}`;
  const yDate = new Date(now);
  yDate.setDate(now.getDate() - 1);
  const yesterdayIso = `${yDate.getFullYear()}-${String(yDate.getMonth() + 1).padStart(2, "0")}-${String(yDate.getDate()).padStart(2, "0")}`;

  // Search filter
  const [searchQuery, setSearchQuery] = useState("");

  // Comprehensive Date Range & Day-Wise Filter State
  const [dateFilter, setDateFilter] = useState<DateFilterSelection>({
    type: "all",
    label: "All Time (Till Date)",
    startDate: "2026-01-01",
    endDate: todayIso,
  });

  // Notifications state
  const [isNotifOpen, setIsNotifOpen] = useState(false);
  const notifRef = useRef<HTMLDivElement>(null);
  const [notifFilter, setNotifFilter] = useState<"all" | "unread">("all");

  const [notifications, setNotifications] = useState<AdminNotificationItem[]>([
    {
      id: "notif-returns",
      type: "return_request",
      title: "2 return requests pending review",
      subtitle: "Sneha R and Ananya M requested return",
      timeAgo: "10m ago",
      isRead: false,
      isReturnAction: true,
    },
    {
      id: "notif-delivered-1",
      type: "order_delivered",
      title: "Order VEY-2026-29819 delivered",
      subtitle: "Signed by Boopesh in Chennai • ₹2,499",
      timeAgo: "42m ago",
      isRead: false,
      link: "/admin/orders",
    },
    {
      id: "notif-stock-1",
      type: "low_stock",
      title: "Low stock: Blanc Court Sneaker",
      subtitle: "Only 2 pairs remaining in warehouse",
      timeAgo: "2h ago",
      isRead: true,
      link: "/admin/products",
    },
    {
      id: "notif-new-1",
      type: "new_order",
      title: "Order VEY-2026-29818 confirmed",
      subtitle: "Kavita S • 2 items (₹3,798) via Card",
      timeAgo: "3h ago",
      isRead: true,
      link: "/admin/orders",
    },
  ]);

  // Keep return request notification in sync with live pending returns count
  useEffect(() => {
    setNotifications((prev) =>
      prev.map((n) => {
        if (n.type !== "return_request") return n;
        return {
          ...n,
          title:
            pendingReturnsCount > 0
              ? `${pendingReturnsCount} return request${pendingReturnsCount === 1 ? "" : "s"} pending review`
              : "All return requests reviewed",
          subtitle:
            pendingReturnsCount > 0
              ? "Sneha R and Ananya M requested return"
              : "All customer return requests processed",
          isRead: pendingReturnsCount === 0 ? true : n.isRead,
        };
      })
    );
  }, [pendingReturnsCount]);

  const unreadNotifCount = useMemo(
    () => notifications.filter((n) => !n.isRead).length,
    [notifications]
  );

  const filteredNotifications = useMemo(() => {
    if (notifFilter === "unread") {
      return notifications.filter((n) => !n.isRead);
    }
    return notifications;
  }, [notifications, notifFilter]);

  const handleMarkAllRead = () => {
    setNotifications((prev) => prev.map((n) => ({ ...n, isRead: true })));
  };

  const handleToggleRead = (id: string) => {
    setNotifications((prev) =>
      prev.map((n) => (n.id === id ? { ...n, isRead: !n.isRead } : n))
    );
  };

  const handleDismissNotif = (id: string) => {
    setNotifications((prev) => prev.filter((n) => n.id !== id));
  };

  const handleClearAllNotifs = () => {
    setNotifications([]);
  };

  const handleNotifClick = (item: AdminNotificationItem) => {
    setNotifications((prev) =>
      prev.map((n) => (n.id === item.id ? { ...n, isRead: true } : n))
    );
    setIsNotifOpen(false);

    if (item.isReturnAction) {
      setIsReturnModalOpen(true);
    } else if (item.link) {
      router.push(item.link);
    }
  };



  // Chart range tab: 7d | 30d | 90d
  const [chartPeriod, setChartPeriod] = useState<"7d" | "30d" | "90d">("30d");
  const [revenueMetricMode, setRevenueMetricMode] = useState<"revenue" | "orders">("revenue");
  const [showChartGridlines, setShowChartGridlines] = useState(true);
  const [chartHoverIndex, setChartHoverIndex] = useState<number | null>(13);

  // Sync default highlighted point on period switch
  useEffect(() => {
    if (chartPeriod === "30d") setChartHoverIndex(13); // Sep 14 peak in screenshot
    else if (chartPeriod === "7d") setChartHoverIndex(6); // Sep 30
    else setChartHoverIndex(10); // Sep 15
  }, [chartPeriod]);

  // Selected Order Status filter from Donut Chart
  const [selectedStatusFilter, setSelectedStatusFilter] = useState<string | null>(null);
  const [donutKey, setDonutKey] = useState(0);

  const handleRefreshDonut = () => {
    setDonutKey((prev) => prev + 1);
    triggerToast("Order status metrics refreshed", "success");
  };

  // Click outside handlers
  useEffect(() => {
    function handleClickOutside(e: MouseEvent) {
      if (notifRef.current && !notifRef.current.contains(e.target as Node)) {
        setIsNotifOpen(false);
      }
    }
    document.addEventListener("mousedown", handleClickOutside);
    return () => document.removeEventListener("mousedown", handleClickOutside);
  }, []);

  // Orders filtered by the active date range or day-wise filter
  const dateFilteredOrders = useMemo(() => {
    if (dateFilter.type === "all") return orders;

    return orders.filter((o) => {
      const orderDay = parseOrderDateToDayString(o.date);
      return orderDay >= dateFilter.startDate && orderDay <= dateFilter.endDate;
    });
  }, [orders, dateFilter]);

  // Dynamically computed top products for current timeframe, metric, and category
  // Seamlessly respects active date range ("ethu varai / from date to date") and day-wise filters
  const activeTopProducts = useMemo(() => {
    // 1. Aggregate real order sales from dateFilteredOrders
    const realSalesByProduct: Record<string, { soldCount: number; revenue: number }> = {};

    dateFilteredOrders.forEach((order) => {
      (order.items || []).forEach((item) => {
        const key = item.productId?.toLowerCase() || item.productName?.toLowerCase() || "";
        const nameKey = item.productName?.toLowerCase() || "";

        const matched = topProductsList.find(
          (p) =>
            p.id.toLowerCase() === key ||
            p.sku.toLowerCase() === key ||
            p.name.toLowerCase() === nameKey ||
            p.slug.toLowerCase().includes(nameKey) ||
            nameKey.includes(p.name.toLowerCase())
        );

        const targetId = matched ? matched.id : key;
        if (!realSalesByProduct[targetId]) {
          realSalesByProduct[targetId] = { soldCount: 0, revenue: 0 };
        }
        realSalesByProduct[targetId].soldCount += item.quantity || 1;
        realSalesByProduct[targetId].revenue += item.totalPrice || item.unitPrice || 0;
      });
    });

    // 2. Map catalog products with sales numbers for the chosen timeframe / date filter
    let list = topProductsList.map((p) => {
      let soldCount = 0;
      let revenue = 0;
      let growth = 12.5;

      if (topProductsTimeframe === "period") {
        const real = realSalesByProduct[p.id];
        if (dateFilter.type === "all") {
          // All Time / Till Date: show full accumulated volume up to today
          soldCount = p.timeframeStats.allTime.soldCount + (real ? real.soldCount : 0);
          revenue = p.timeframeStats.allTime.revenue + (real ? real.revenue : 0);
          growth = p.timeframeStats.allTime.growth;
        } else if (dateFilter.type === "day") {
          // Day-wise: specific single day sales volume
          const activeDay = dateFilter.singleDay || dateFilter.startDate;
          if (activeDay === todayIso) {
            soldCount = Math.max(p.timeframeStats.today.soldCount, real ? real.soldCount : 0);
            revenue = soldCount * p.unitPrice;
            growth = p.timeframeStats.today.growth;
          } else if (activeDay === yesterdayIso) {
            soldCount = Math.max(1, Math.round(p.timeframeStats.today.soldCount * 0.8));
            revenue = soldCount * p.unitPrice;
            growth = 15.0;
          } else {
            soldCount = real && real.soldCount > 0 ? real.soldCount : Math.max(1, (p.rank % 3) + 1);
            revenue = soldCount * p.unitPrice;
            growth = 12.0;
          }
        } else if (dateFilter.type === "custom") {
          // Custom Range: from startDate to endDate
          const d1 = new Date(dateFilter.startDate).getTime();
          const d2 = new Date(dateFilter.endDate).getTime();
          const days = Math.max(1, Math.round((d2 - d1) / (1000 * 60 * 60 * 24)) + 1);
          soldCount = Math.max(1, Math.round((p.timeframeStats.thisMonth.soldCount / 30) * days) + (real ? real.soldCount : 0));
          revenue = soldCount * p.unitPrice;
          growth = p.timeframeStats.thisMonth.growth;
        } else {
          // Preset periods
          const stats = dateFilter.label.toLowerCase().includes("week")
            ? p.timeframeStats.thisWeek
            : p.timeframeStats.thisMonth;
          soldCount = stats.soldCount + (real ? real.soldCount : 0);
          revenue = stats.revenue + (real ? real.revenue : 0);
          growth = stats.growth;
        }
      } else {
        const stats =
          topProductsTimeframe === "week"
            ? p.timeframeStats.thisWeek
            : topProductsTimeframe === "today"
            ? p.timeframeStats.today
            : topProductsTimeframe === "all"
            ? p.timeframeStats.allTime
            : p.timeframeStats.thisMonth;

        soldCount = stats.soldCount;
        revenue = stats.revenue;
        growth = stats.growth;
      }

      return {
        ...p,
        soldCount,
        revenue,
        growth,
      };
    });

    if (topProductsCategory !== "all") {
      list = list.filter((p) => p.category === topProductsCategory);
    }

    if (topProductsMetric === "revenue") {
      list.sort((a, b) => b.revenue - a.revenue);
    } else {
      list.sort((a, b) => b.soldCount - a.soldCount);
    }

    // Re-assign ranks 1..N based on active sort
    return list.map((item, idx) => ({
      ...item,
      rank: idx + 1,
    }));
  }, [
    topProductsList,
    topProductsTimeframe,
    topProductsMetric,
    topProductsCategory,
    dateFilteredOrders,
    dateFilter,
  ]);


  // Compute stats dynamically based on the filtered date period
  const stats = useMemo(() => {
    const list = dateFilteredOrders;
    const totalRev = list.reduce((sum, o) => sum + o.total, 0);
    const totalOrd = list.length;
    const totalProd = products.length > 0 ? products.length : 35;
    const aov = totalOrd > 0 ? Math.round(totalRev / totalOrd) : 0;

    // Status breakdown
    let delivered = 0;
    let processing = 0;
    let shipped = 0;
    let cancelled = 0;
    let returned = 0;

    list.forEach((o) => {
      const isRet =
        o.status === "Returned" ||
        o.status === "Return Requested" ||
        o.returnRequest?.status === "approved" ||
        o.returnRequest?.status === "pending";

      if (isRet) returned++;
      else if (o.status === "Delivered") delivered++;
      else if (o.status === "Processing" || o.status === "Confirmed" || o.status === "Packed") processing++;
      else if (o.status === "Shipped" || o.status === "Out for Delivery") shipped++;
      else if (o.status === "Cancelled") cancelled++;
    });

    return {
      totalRev,
      totalOrd,
      totalProd,
      aov,
      delivered,
      processing,
      shipped,
      cancelled,
      returned,
    };
  }, [dateFilteredOrders, products]);

  // Filtered orders list based on search, recent orders tab, and status filter
  const allFilteredRecentOrders = useMemo(() => {
    let list = dateFilteredOrders;

    if (recentOrdersStatusFilter !== "All") {
      list = list.filter((o) => {
        const isRet =
          o.status === "Returned" ||
          o.status === "Return Requested" ||
          o.returnRequest?.status === "approved" ||
          o.returnRequest?.status === "pending";

        if (recentOrdersStatusFilter === "Delivered") return o.status === "Delivered" && !isRet;
        if (recentOrdersStatusFilter === "Processing") return o.status === "Processing" || o.status === "Confirmed" || o.status === "Packed";
        if (recentOrdersStatusFilter === "Shipped") return o.status === "Shipped" || o.status === "Out for Delivery";
        if (recentOrdersStatusFilter === "Cancelled") return o.status === "Cancelled";
        if (recentOrdersStatusFilter === "Returned") return isRet;
        return true;
      });
    }

    if (selectedStatusFilter) {
      list = list.filter((o) => {
        const isRet =
          o.status === "Returned" ||
          o.status === "Return Requested" ||
          o.returnRequest?.status === "approved" ||
          o.returnRequest?.status === "pending";

        if (selectedStatusFilter === "Delivered") return o.status === "Delivered" && !isRet;
        if (selectedStatusFilter === "Processing") return o.status === "Processing" || o.status === "Confirmed" || o.status === "Packed";
        if (selectedStatusFilter === "Shipped") return o.status === "Shipped" || o.status === "Out for Delivery";
        if (selectedStatusFilter === "Cancelled") return o.status === "Cancelled";
        if (selectedStatusFilter === "Returned") return isRet;
        return true;
      });
    }

    if (searchQuery.trim()) {
      list = searchOrders(list, searchQuery);
    }

    return list;
  }, [dateFilteredOrders, recentOrdersStatusFilter, selectedStatusFilter, searchQuery]);

  const RECENT_ORDERS_PAGE_SIZE = 10;
  const TOP_PRODUCTS_VISIBLE = 10;
  const totalRecentOrdersPages = Math.max(1, Math.ceil(allFilteredRecentOrders.length / RECENT_ORDERS_PAGE_SIZE));

  // Current page displayed orders
  const displayedOrders = useMemo(() => {
    const safePage = Math.min(recentOrdersPage, totalRecentOrdersPages);
    const start = (safePage - 1) * RECENT_ORDERS_PAGE_SIZE;
    return allFilteredRecentOrders.slice(start, start + RECENT_ORDERS_PAGE_SIZE);
  }, [allFilteredRecentOrders, recentOrdersPage, totalRecentOrdersPages]);

  // Financial & operational metrics for the active orders period
  const recentOrdersMetrics = useMemo(() => {
    const totalRev = allFilteredRecentOrders.reduce((sum, o) => sum + o.total, 0);
    const deliveredOrders = allFilteredRecentOrders.filter((o) => o.status === "Delivered");
    const deliveredCount = deliveredOrders.length;
    const deliveredRev = deliveredOrders.reduce((sum, o) => sum + o.total, 0);
    const shippedCount = allFilteredRecentOrders.filter(
      (o) => o.status === "Shipped" || o.status === "Out for Delivery"
    ).length;
    const processingCount = allFilteredRecentOrders.filter(
      (o) => o.status === "Processing" || o.status === "Confirmed" || o.status === "Packed"
    ).length;
    const aov = allFilteredRecentOrders.length > 0 ? Math.round(totalRev / allFilteredRecentOrders.length) : 0;

    return {
      totalRev,
      deliveredCount,
      deliveredRev,
      shippedCount,
      processingCount,
      aov,
    };
  }, [allFilteredRecentOrders]);

  // Store lifetime revenue across all orders (Till Date total)
  const lifetimeStoreRevenue = useMemo(() => {
    return orders.reduce((sum, o) => sum + o.total, 0);
  }, [orders]);

  // Aggregate all unique order days chronologically with metadata for Day-Wise browsing
  const availableOrderDays = useMemo(() => {
    const dayMap = new Map<string, { date: string; label: string; count: number; totalRevenue: number }>();
    orders.forEach((o) => {
      const day = parseOrderDateToDayString(o.date);
      const existing = dayMap.get(day) || {
        date: day,
        label: formatDayDisplay(day),
        count: 0,
        totalRevenue: 0,
      };
      existing.count += 1;
      existing.totalRevenue += o.total;
      dayMap.set(day, existing);
    });
    return Array.from(dayMap.values()).sort((a, b) => b.date.localeCompare(a.date));
  }, [orders]);

  // Active day index for previous/next day stepping
  const currentDayIndex = useMemo(() => {
    if (dateFilter.type !== "day") return -1;
    const activeDay = dateFilter.singleDay || dateFilter.startDate;
    return availableOrderDays.findIndex((d) => d.date === activeDay);
  }, [dateFilter, availableOrderDays]);

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

  useEffect(() => {
    setRecentOrdersPage(1);
  }, [recentOrdersStatusFilter, dateFilter, searchQuery]);

  const chartData = useMemo(() => {
    if (chartPeriod === "7d") return REVENUE_DATA_7D;
    if (chartPeriod === "90d") return REVENUE_DATA_90D;
    return REVENUE_DATA_30D;
  }, [chartPeriod]);

  const revenueSummary = useMemo(() => {
    const totalRev = chartData.reduce((sum, d) => sum + d.value, 0);
    const totalOrd = chartData.reduce((sum, d) => sum + d.ordersCount, 0);
    const avgDaily = Math.round(totalRev / chartData.length);
    let peakIdx = 0;
    let maxVal = -1;
    chartData.forEach((d, i) => {
      if (d.value > maxVal) {
        maxVal = d.value;
        peakIdx = i;
      }
    });

    return {
      totalRev,
      totalOrd,
      avgDaily,
      peakIdx,
      peakDate: chartData[peakIdx]?.dateStr || "Oct 23, 2026",
      peakVal: maxVal,
      growthPct: chartPeriod === "7d" ? "+14.2%" : chartPeriod === "30d" ? "+18.4%" : "+24.8%",
    };
  }, [chartData, chartPeriod]);

  return (
    <div
      className={`space-y-6 text-white pb-16 font-sans transition-[opacity,filter] duration-300 ease-out ${
        isAnyAdminModalOpen
          ? "opacity-25 filter blur-[6px] pointer-events-none select-none"
          : "opacity-100 filter blur-0 pointer-events-auto select-auto"
      }`}
    >
      {/* ── TOP BAR: SEARCH, DATE RANGE, NOTIFICATIONS, PROFILE ──────────────── */}
      <header className="flex flex-col md:flex-row items-center justify-between gap-4">
        {/* Search Input with / shortcut and instant live results palette */}
        <AdminGlobalSearchBar
          searchQuery={searchQuery}
          setSearchQuery={setSearchQuery}
          orders={orders}
          products={unifiedProducts}
          sections={sections}
          onSelectOrder={(order) => {
            setSelectedOrderForModal(order);
          }}
          pendingReturnsCount={pendingReturnsCount}
        />

        {/* Right header controls */}
        <div className="flex items-center gap-3 w-full md:w-auto justify-end">
          {/* Comprehensive Date Range & Day-Wise Picker */}
          <AdminDateRangePicker
            currentFilter={dateFilter}
            onSelectFilter={(newFilter) => {
              setDateFilter(newFilter);
              triggerToast(`Applied period: ${newFilter.label}`, "info");
            }}
            orders={orders}
          />

          {/* Notification Bell */}
          <div className="relative" ref={notifRef}>
            <button
              onClick={() => setIsNotifOpen(!isNotifOpen)}
              className="relative p-2.5 bg-[var(--admin-surface)] rounded-full border border-white/10 hover:bg-[var(--admin-elevated)]
                text-[var(--admin-text-muted)] hover:text-white transition-all cursor-pointer"
              aria-label="View notifications"
            >
              <Bell size={16} />
              {unreadNotifCount > 0 && (
                <span className="absolute -top-1 -right-1 min-w-[18px] h-[18px] px-1 bg-[var(--admin-danger)] text-white rounded-full text-[10px] font-bold flex items-center justify-center ring-2 ring-[var(--admin-canvas)] animate-in zoom-in-50">
                  {unreadNotifCount}
                </span>
              )}
            </button>

            {isNotifOpen && (
              <div
                className="absolute right-0 top-full mt-2 w-80 sm:w-96 bg-[var(--admin-surface)] rounded-[14px] border border-white/10 p-3 z-40 text-xs text-white animate-in fade-in zoom-in-95 duration-150"
                onClick={(e) => e.stopPropagation()}
              >
                {/* Header */}
                <div className="flex items-center justify-between pb-2 mb-2 border-b border-white/5">
                  <div className="flex items-center gap-2">
                    <span className="font-bold text-white text-sm font-heading">Notifications</span>
                    {unreadNotifCount > 0 ? (
                      <span className="px-1.5 py-0.5 rounded-full text-[10px] font-bold bg-[#F59E0B]/20 text-[#F59E0B] border border-[#F59E0B]/30">
                        {unreadNotifCount} new
                      </span>
                    ) : (
                      <span className="px-1.5 py-0.5 rounded-full text-[10px] font-semibold bg-[#00F59B]/15 text-[#00F59B] border border-[#00F59B]/25">
                        All read
                      </span>
                    )}
                  </div>
                  {unreadNotifCount > 0 && (
                    <button
                      type="button"
                      onClick={handleMarkAllRead}
                      className="text-[11px] text-[var(--admin-primary)] hover:underline font-semibold cursor-pointer"
                    >
                      Mark all read
                    </button>
                  )}
                </div>

                {/* Filter Tabs */}
                <div className="flex items-center gap-1.5 mb-2.5">
                  <button
                    type="button"
                    onClick={() => setNotifFilter("all")}
                    className={`px-2.5 py-1 rounded-full text-[11px] font-semibold transition-all cursor-pointer ${
                      notifFilter === "all"
                        ? "bg-[var(--admin-elevated)] text-white border border-white/10"
                        : "bg-[var(--admin-surface-2)] text-[var(--admin-text-muted)] hover:text-white"
                    }`}
                  >
                    All ({notifications.length})
                  </button>
                  <button
                    type="button"
                    onClick={() => setNotifFilter("unread")}
                    className={`px-2.5 py-1 rounded-full text-[11px] font-semibold transition-all cursor-pointer flex items-center gap-1 ${
                      notifFilter === "unread"
                        ? "bg-[var(--admin-elevated)] text-white border border-white/10"
                        : "bg-[var(--admin-surface-2)] text-[var(--admin-text-muted)] hover:text-white"
                    }`}
                  >
                    <span>Unread</span>
                    {unreadNotifCount > 0 && (
                      <span className={`px-1 py-0.2 rounded-full text-[9px] font-extrabold ${
                        notifFilter === "unread" ? "bg-[#F59E0B] text-black" : "bg-white/10 text-white"
                      }`}>
                        {unreadNotifCount}
                      </span>
                    )}
                  </button>
                  {notifications.length > 0 && (
                    <button
                      type="button"
                      onClick={handleClearAllNotifs}
                      className="ml-auto text-[10.5px] text-[var(--admin-text-muted)] hover:text-[var(--admin-danger)] font-medium cursor-pointer transition-colors"
                    >
                      Clear all
                    </button>
                  )}
                </div>

                {/* Notification List */}
                <div className="space-y-2 max-h-[320px] overflow-y-auto admin-scroll pr-1">
                  {filteredNotifications.length === 0 ? (
                    <div className="py-8 text-center">
                      <div className="w-10 h-10 rounded-full bg-[#00F59B]/15 text-[#00F59B] flex items-center justify-center mx-auto mb-2 text-base border border-[#00F59B]/25">
                        <CheckCircle2 size={18} strokeWidth={2.2} />
                      </div>
                      <p className="font-semibold text-white text-xs">All caught up!</p>
                      <p className="text-[11px] text-[var(--admin-text-muted)] mt-0.5">
                        {notifFilter === "unread"
                          ? "No unread notifications to display"
                          : "No notifications right now"}
                      </p>
                    </div>
                  ) : (
                    filteredNotifications.map((n) => (
                      <div
                        key={n.id}
                        onClick={() => handleNotifClick(n)}
                        className={`group relative p-2.5 rounded-[14px] border flex items-start gap-2.5 cursor-pointer transition-all ${
                          n.isRead
                            ? "bg-[var(--admin-surface-2)] border-white/5 text-[var(--admin-text-muted)] hover:bg-white/[0.03]"
                            : "bg-[var(--admin-surface-2)] border-white/10 hover:bg-white/[0.04] text-white"
                        }`}
                      >
                        <NotificationIconBadge type={n.type} />

                        <div className="flex-1 min-w-0 pr-4">
                          <div className="flex items-center gap-1.5">
                            <p className={`font-semibold truncate leading-snug ${
                              n.isRead
                                ? "text-[var(--admin-text-muted)]"
                                : "text-white font-bold"
                            }`}>
                              {n.title}
                            </p>
                            {!n.isRead && (
                              <span className="w-1.5 h-1.5 rounded-full bg-[#F59E0B] shrink-0" />
                            )}
                          </div>
                          <p className="text-[11px] mt-0.5 leading-tight truncate text-[var(--admin-text-muted)]">
                            {n.subtitle}
                          </p>
                          <span className="text-[10px] text-[var(--admin-text-muted)] mt-1 block">
                            {n.timeAgo}
                          </span>
                        </div>

                        {/* Quick Action & Dismiss */}
                        <div className="absolute top-2 right-2 flex items-center gap-1 opacity-0 group-hover:opacity-100 transition-opacity">
                          <button
                            type="button"
                            onClick={(e) => {
                              e.stopPropagation();
                              handleToggleRead(n.id);
                            }}
                            title={n.isRead ? "Mark as unread" : "Mark as read"}
                            className="p-1 hover:bg-white/10 rounded text-[var(--admin-text-muted)] hover:text-white cursor-pointer"
                          >
                            <span className="text-[10px] block font-mono">
                              {n.isRead ? "○" : "●"}
                            </span>
                          </button>
                          <button
                            type="button"
                            onClick={(e) => {
                              e.stopPropagation();
                              handleDismissNotif(n.id);
                            }}
                            title="Dismiss notification"
                            className="p-1 hover:bg-[#FF4B55]/20 rounded text-[var(--admin-text-muted)] hover:text-[#FF4B55] cursor-pointer"
                          >
                            <X size={12} />
                          </button>
                        </div>
                      </div>
                    ))
                  )}
                </div>

                {/* Popover Footer */}
                <div className="pt-2 mt-2 border-t border-white/5 flex items-center justify-between text-[11px]">
                  <Link
                    href="/admin/orders"
                    onClick={() => setIsNotifOpen(false)}
                    className="text-[var(--admin-text-muted)] hover:text-white font-semibold flex items-center gap-1 hover:underline"
                  >
                    <span>View all orders</span>
                    <ChevronRight size={12} />
                  </Link>
                  <span className="text-[10.5px] text-[var(--admin-text-muted)]">
                    VEYRO Admin
                  </span>
                </div>
              </div>
            )}
          </div>

          {/* User Profile */}
          <div className="flex items-center gap-2.5 pl-1.5 cursor-pointer">
            <div className="w-9 h-9 rounded-full bg-[var(--admin-elevated)] border border-white/10 text-white flex items-center justify-center font-bold text-sm tracking-wide shrink-0">
              S
            </div>
            <div className="hidden sm:block text-left">
              <div className="text-xs font-bold text-white leading-tight font-heading">
                Santhosh S
              </div>
              <div className="text-[11px] text-[var(--admin-text-muted)] font-medium leading-tight">
                Admin
              </div>
            </div>
          </div>
        </div>
      </header>

      {/* ── GREETING & PAGE HEADER (TARGET UI DESIGN) ────────────────────── */}
      <AdminHeader
        adminName="Santhosh"
        subtitle="Here's what's happening in your store today."
        currentFilter={dateFilter}
        onSelectFilter={(newFilter) => {
          setDateFilter(newFilter);
          triggerToast(`Applied period: ${newFilter.label}`, "info");
        }}
        orders={orders}
        showDateFilter={false}
        rightAction={
          <Link
            href="/admin/products/add"
            className="inline-flex items-center gap-1.5 px-4 py-2 bg-[var(--admin-primary)] hover:bg-[var(--admin-primary-hover)] text-white rounded-full text-xs sm:text-sm font-bold transition-colors cursor-pointer whitespace-nowrap shrink-0"
          >
            <Plus size={15} strokeWidth={2.5} />
            <span>Add Product</span>
          </Link>
        }
      />

      {/* ── 4 STAT CARDS ────────────────────────────────────────────────────── */}
      <StaggerGroup className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-4">
        {/* Card 1: Total Revenue */}
        <StaggerItem
          withHover
          className="group bg-[var(--admin-surface)] rounded-[28px] border border-white/5 hover:border-white/10 p-6 flex flex-col justify-between transition-colors duration-200 cursor-default"
        >
          <div>
            <div className="flex items-center justify-between">
              <span className="text-[13px] font-medium text-[var(--admin-text-muted)]">Total Revenue</span>
              <AdminIconBadge variant="kpi">
                <ArrowUpRight size={18} className="group-hover:translate-x-[1px] group-hover:-translate-y-[1px] transition-transform duration-200" />
              </AdminIconBadge>
            </div>
            <div className="text-[32px] font-heading font-bold text-white tracking-tight leading-none mt-4 mb-2.5 tabular-nums">
              <CountUp value={stats.totalRev} prefix="₹" />
            </div>
          </div>

          <div className="flex items-center gap-1.5 pt-1 text-xs">
            <span className="inline-flex items-center px-2.5 py-0.5 rounded-full text-xs font-bold bg-[#00F59B]/15 text-[#00F59B] border border-[#00F59B]/20">
              ↑ 14%
            </span>
            <span className="text-[var(--admin-text-muted)] font-normal ml-0.5">
              {dateFilter.type === "day" ? `for ${dateFilter.label}` : dateFilter.type === "all" ? "store inception to date" : "in this period"}
            </span>
          </div>
        </StaggerItem>

        {/* Card 2: Total Orders */}
        <StaggerItem
          withHover
          className="group bg-[var(--admin-surface)] rounded-[28px] border border-white/5 hover:border-white/10 p-6 flex flex-col justify-between transition-colors duration-200 cursor-default"
        >
          <div>
            <div className="flex items-center justify-between">
              <span className="text-[13px] font-medium text-[var(--admin-text-muted)]">Total Orders</span>
              <AdminIconBadge variant="kpi" icon={ShoppingCart} />
            </div>
            <div className="text-[32px] font-heading font-bold text-white tracking-tight leading-none mt-4 mb-2.5 tabular-nums">
              <CountUp value={stats.totalOrd} />
            </div>
          </div>

          <div className="flex items-center gap-1.5 pt-1 text-xs">
            <span className="inline-flex items-center px-2.5 py-0.5 rounded-full text-xs font-bold bg-[#00F59B]/15 text-[#00F59B] border border-[#00F59B]/20">
              ↑ 14%
            </span>
            <span className="text-[var(--admin-text-muted)] font-normal ml-0.5">
              {dateFilter.type === "day" ? `orders on ${dateFilter.label}` : dateFilter.type === "all" ? "lifetime purchases" : "in this period"}
            </span>
          </div>
        </StaggerItem>

        {/* Card 3: Total Products */}
        <StaggerItem
          withHover
          className="group bg-[var(--admin-surface)] rounded-[28px] border border-white/5 hover:border-white/10 p-6 flex flex-col justify-between transition-colors duration-200 cursor-default"
        >
          <div>
            <div className="flex items-center justify-between">
              <span className="text-[13px] font-medium text-[var(--admin-text-muted)]">Total Products</span>
              <AdminIconBadge variant="kpi" icon={Package} />
            </div>
            <div className="text-[32px] font-heading font-bold text-white tracking-tight leading-none mt-4 mb-2.5 tabular-nums">
              <CountUp value={stats.totalProd} />
            </div>
          </div>

          <div className="flex items-center gap-1.5 pt-1 text-xs">
            <span className="inline-flex items-center px-2.5 py-0.5 rounded-full text-xs font-bold bg-[#FF4B55]/15 text-[#FF4B55] border border-[#FF4B55]/20">
              ↓ 14%
            </span>
            <span className="text-[var(--admin-text-muted)] font-normal ml-0.5">active catalog</span>
          </div>
        </StaggerItem>

        {/* Card 4: Avg. Order Value */}
        <StaggerItem
          withHover
          className="group bg-[var(--admin-surface)] rounded-[28px] border border-white/5 hover:border-white/10 p-6 flex flex-col justify-between transition-colors duration-200 cursor-default"
        >
          <div>
            <div className="flex items-center justify-between">
              <span className="text-[13px] font-medium text-[var(--admin-text-muted)]">Avg. Order Value</span>
              <AdminIconBadge variant="kpi" icon={BarChart3} />
            </div>
            <div className="text-[32px] font-heading font-bold text-white tracking-tight leading-none mt-4 mb-2.5 tabular-nums">
              <CountUp value={stats.aov} prefix="₹" />
            </div>
          </div>

          <div className="flex items-center gap-1.5 pt-1 text-xs">
            <span className="inline-flex items-center px-2.5 py-0.5 rounded-full text-xs font-bold bg-[#00F59B]/15 text-[#00F59B] border border-[#00F59B]/20">
              ↑ 14%
            </span>
            <span className="text-[var(--admin-text-muted)] font-normal ml-0.5">
              {dateFilter.type === "day" ? `basket avg on ${dateFilter.label}` : dateFilter.type === "all" ? "lifetime basket avg" : "in this period"}
            </span>
          </div>
        </StaggerItem>
      </StaggerGroup>

      {/* ── MIDDLE ROW: REVENUE OVERVIEW & ORDER STATUS ───────────────────────── */}
      <section className="grid grid-cols-1 lg:grid-cols-12 gap-5">
        {/* Left: Revenue Overview (6 cols) */}
        <div className="lg:col-span-6 bg-[var(--admin-surface)] rounded-[28px] border border-white/5 p-6 flex flex-col justify-between">
          {/* Header Row */}
          <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-3 mb-3">
            <div className="flex items-center gap-3">
              <AdminIconBadge variant="section" icon={BarChart3} />
              <div>
                <h2 className="text-[17px] font-bold text-white leading-tight tracking-tight">
                  Revenue Overview
                </h2>
                <p className="text-xs text-[var(--admin-text-muted)] font-normal mt-0.5">
                  Sales performance over time
                </p>
              </div>
            </div>

            <div className="flex items-center gap-2.5">
              {/* Metric mode toggle: Revenue vs Orders */}
              <div className="hidden sm:flex items-center bg-[var(--admin-surface-2)] border border-white/5 rounded-full p-1 gap-1 text-xs font-semibold">
                <button
                  type="button"
                  onClick={() => setRevenueMetricMode("revenue")}
                  className={`group flex items-center gap-1.5 px-3 py-1.5 rounded-full transition-all cursor-pointer ${
                    revenueMetricMode === "revenue"
                      ? "bg-[var(--admin-elevated)] text-white border border-white/10 font-bold"
                      : "text-[var(--admin-text-muted)] hover:text-white border border-transparent"
                  }`}
                  aria-pressed={revenueMetricMode === "revenue"}
                >
                  <span
                    className={`w-4 h-4 rounded-full flex items-center justify-center shrink-0 transition-colors ${
                      revenueMetricMode === "revenue"
                        ? "bg-[#A855F7]/20 text-[#A855F7]"
                        : "bg-white/5 text-[var(--admin-text-muted)] group-hover:text-white"
                    }`}
                  >
                    <IndianRupee size={11} strokeWidth={2.8} />
                  </span>
                  <span>Revenue</span>
                </button>
                <button
                  type="button"
                  onClick={() => setRevenueMetricMode("orders")}
                  className={`group flex items-center gap-1.5 px-3 py-1.5 rounded-full transition-all cursor-pointer ${
                    revenueMetricMode === "orders"
                      ? "bg-[var(--admin-elevated)] text-white border border-white/10 font-bold"
                      : "text-[var(--admin-text-muted)] hover:text-white border border-transparent"
                  }`}
                  aria-pressed={revenueMetricMode === "orders"}
                >
                  <span
                    className={`w-4 h-4 rounded-full flex items-center justify-center shrink-0 transition-colors ${
                      revenueMetricMode === "orders"
                        ? "bg-[#A855F7]/20 text-[#A855F7]"
                        : "bg-white/5 text-[var(--admin-text-muted)] group-hover:text-white"
                    }`}
                  >
                    <ShoppingBag size={11} strokeWidth={2.4} />
                  </span>
                  <span>Orders</span>
                </button>
              </div>

              {/* Period selector pill */}
              <div className="flex items-center bg-[var(--admin-surface-2)] border border-white/5 rounded-full p-1 gap-1">
                {(["7d", "30d", "90d"] as const).map((p) => {
                  const label = p === "7d" ? "7 Days" : p === "30d" ? "30 Days" : "90 Days";
                  const isActive = chartPeriod === p;
                  return (
                    <button
                      key={p}
                      onClick={() => setChartPeriod(p)}
                      className={`px-3 py-1.5 rounded-full text-xs font-semibold transition-all cursor-pointer ${
                        isActive
                          ? "bg-[var(--admin-elevated)] text-white border border-white/10 font-bold"
                          : "text-[var(--admin-text-muted)] hover:text-white"
                      }`}
                    >
                      {label}
                    </button>
                  );
                })}
              </div>

              <RevenueChartMenu
                period={chartPeriod}
                data={chartData}
                metricMode={revenueMetricMode}
                setMetricMode={setRevenueMetricMode}
                showGridlines={showChartGridlines}
                setShowGridlines={setShowChartGridlines}
                onResetPeak={() => setChartHoverIndex(revenueSummary.peakIdx)}
              />
            </div>
          </div>

          {/* Executive KPI Metrics Ribbon */}
          <div className="flex flex-wrap items-center justify-between gap-3 pt-2 pb-3 mb-2 border-b border-white/5">
            <div className="flex items-baseline gap-3">
              <div>
                <span className="text-[10.5px] font-semibold text-[var(--admin-text-muted)] uppercase tracking-wider block">
                  {revenueMetricMode === "revenue" ? "Period Revenue" : "Period Orders"}
                </span>
                <div className="flex items-center gap-2 mt-0.5">
                  <span className="text-2xl font-extrabold text-white tracking-tight tabular-nums">
                    {revenueMetricMode === "revenue"
                      ? `₹${revenueSummary.totalRev.toLocaleString("en-IN")}`
                      : `${revenueSummary.totalOrd} Orders`}
                  </span>
                  <span className="inline-flex items-center gap-0.5 px-2 py-0.5 rounded-full text-xs font-bold bg-[#00F59B]/15 text-[#00F59B] border border-[#00F59B]/20">
                    <TrendingUp size={12} />
                    {revenueSummary.growthPct}
                  </span>
                </div>
              </div>

              <div className="hidden md:block text-xs text-[var(--admin-text-muted)] pl-3 border-l border-white/10">
                <span>Avg: <strong className="text-white font-semibold">₹{revenueSummary.avgDaily.toLocaleString("en-IN")}/day</strong></span>
                <span className="mx-1.5">•</span>
                <span><strong className="text-white font-semibold">{revenueSummary.totalOrd}</strong> orders placed</span>
              </div>
            </div>
          </div>

          {/* Interactive Chart */}
          <RevenueOverviewChart
            period={chartPeriod}
            data={chartData}
            metricMode={revenueMetricMode}
            showGridlines={showChartGridlines}
            hoverIndex={chartHoverIndex}
            setHoverIndex={setChartHoverIndex}
          />
        </div>

        {/* Right: Order Status (6 cols) - Exact Side-by-Side Bklit Layout */}
        <div className="lg:col-span-6 bg-[var(--admin-surface)] rounded-[28px] border border-white/5 p-6 flex flex-col justify-between">
          <div className="flex items-center justify-between mb-3">
            <div className="flex items-center gap-3">
              <AdminIconBadge variant="section">
                <StopwatchIcon className="w-4 h-4 text-[var(--admin-text-muted)]" />
              </AdminIconBadge>
              <h2 className="text-[17px] font-bold text-white tracking-tight leading-tight">
                Order Status
              </h2>
            </div>
            <OrderStatusMenu
              title="Order Status Breakdown"
              selectedStatus={selectedStatusFilter}
              onSelectStatus={(status) => setSelectedStatusFilter(status)}
              onRefresh={handleRefreshDonut}
              stats={stats}
            />
          </div>

          {/* Centered Donut & Legend Container without dead whitespace */}
          <div className="flex-1 flex flex-col justify-center my-auto py-1">
            <OrderStatusDonut
              key={donutKey}
              deliveredCount={stats.delivered}
              processingCount={stats.processing}
              shippedCount={stats.shipped}
              cancelledCount={stats.cancelled}
              returnedCount={stats.returned}
              onSelectStatus={(status) => setSelectedStatusFilter(status)}
              selectedStatus={selectedStatusFilter}
            />
          </div>

          {selectedStatusFilter && (
            <div className="mt-3 pt-2.5 border-t border-white/5 flex items-center justify-between text-xs text-[var(--admin-text-muted)] animate-in fade-in duration-200">
              <span className="flex items-center gap-1.5">
                <span className="w-2 h-2 rounded-full bg-[#7C3AED] animate-pulse" />
                Filtered by <strong className="text-white font-semibold">{selectedStatusFilter}</strong>
              </span>
              <button
                onClick={() => setSelectedStatusFilter(null)}
                className="text-[#7C3AED] font-semibold hover:underline cursor-pointer"
              >
                Clear filter
              </button>
            </div>
          )}
        </div>
      </section>

      {/* ── BOTTOM ROW: RECENT ORDERS & TOP PRODUCTS ─────────────────────────── */}
      <section className="grid grid-cols-1 lg:grid-cols-12 gap-5 items-stretch">
        {/* Left: Recent Orders Table (8 cols) */}
        <div className="lg:col-span-8 bg-[var(--admin-surface)] rounded-[28px] border border-white/5 overflow-hidden flex flex-col lg:h-[700px]">
          <div className="flex-1 flex flex-col min-h-0">
            {/* Header */}
            <div className="flex items-center justify-between p-5 sm:p-6 pb-3">
              <div className="flex items-center gap-3 min-w-0">
                <AdminIconBadge variant="section" icon={ShoppingCart} />
                <div className="min-w-0">
                  <h2 className="text-[17px] font-bold text-white leading-tight tracking-tight">
                    Recent Orders
                  </h2>
                  <p className="text-xs text-[var(--admin-text-muted)] font-normal mt-1 flex items-center gap-1.5 truncate">
                    <CalendarDays size={12} className="text-[var(--admin-text-muted)] shrink-0" />
                    <span className="truncate">
                      {dateFilter.type === "day"
                        ? `Single day orders: ${dateFilter.label} (${allFilteredRecentOrders.length} ${allFilteredRecentOrders.length === 1 ? "order" : "orders"})`
                        : dateFilter.type === "custom"
                        ? `Orders between ${dateFilter.startDate} → ${dateFilter.endDate} (${allFilteredRecentOrders.length} orders)`
                        : `Accumulated store orders up to ${dateFilter.endDate} (${allFilteredRecentOrders.length} orders)`}
                    </span>
                  </p>
                </div>
              </div>

              <div className="flex items-center gap-2 shrink-0">
                <button
                  type="button"
                  onClick={() => setIsAllOrdersModalOpen(true)}
                  className="flex items-center gap-1 text-xs font-semibold text-white hover:text-white transition-colors group cursor-pointer bg-[var(--admin-surface-2)] hover:bg-[var(--admin-elevated)] px-3 py-1.5 rounded-full border border-white/10"
                >
                  <span>View All ({orders.length})</span>
                  <ChevronRight size={13} className="transition-transform group-hover:translate-x-0.5" />
                </button>
                <Link
                  href="/admin/orders"
                  className="w-8 h-8 rounded-full border border-white/10 bg-[var(--admin-surface-2)] hover:bg-[var(--admin-elevated)] text-[var(--admin-text-muted)] hover:text-white flex items-center justify-center transition-colors"
                  title="Open Dedicated Full Page"
                >
                  <ExternalLink size={13} />
                </Link>
              </div>
            </div>

            {/* Recent Orders Status & Date Controls Bar */}
            <div className="flex flex-wrap items-center justify-between gap-2.5 px-5 sm:px-6 pb-3.5 border-b border-white/5">
              {/* Status Filter Chips */}
              <div className="flex items-center gap-1.5 overflow-x-auto no-scrollbar">
                {["All", "Delivered", "Processing", "Shipped", "Returned"].map((status) => {
                  const isActive = recentOrdersStatusFilter === status;
                  return (
                    <button
                      key={status}
                      type="button"
                      onClick={() => setRecentOrdersStatusFilter(status)}
                      className={`h-8 px-3.5 rounded-[10px] text-xs font-medium transition-colors cursor-pointer whitespace-nowrap flex items-center justify-center shrink-0 ${
                        isActive
                          ? "bg-white/15 text-white font-semibold border border-white/20 shadow-sm"
                          : "text-[var(--admin-text-muted)] hover:text-white hover:bg-white/[0.04] border border-transparent font-medium"
                      }`}
                    >
                      {status}
                    </button>
                  );
                })}
              </div>

              {/* Date Scope Control: Compact Date Range Picker */}
              <div className="flex items-center gap-2">
                <AdminDateRangePicker
                  currentFilter={dateFilter}
                  onSelectFilter={(newFilter) => {
                    setDateFilter(newFilter);
                    triggerToast(`Filter applied: ${newFilter.label}`, "info");
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

            {/* ── HIGH-DETAIL DATE SCOPE & DAY-WISE NAVIGATION HUB ── */}
            {dateFilter.type === "day" ? (
              <div className="mx-5 sm:mx-6 my-2.5 p-3 rounded-[14px] bg-[var(--admin-surface-2)] border border-white/5 flex flex-col gap-2.5 animate-in fade-in duration-150">
                <div className="flex items-center justify-between gap-2 flex-wrap">
                  <div className="flex items-center gap-2 min-w-0">
                    <span className="w-2 h-2 rounded-full bg-sky-400 animate-pulse shrink-0" />
                    <span className="text-xs text-white font-bold truncate">
                      Day-Wise Breakdown:{" "}
                      <span className="text-[var(--admin-text-muted)] underline decoration-white/20 font-medium">
                        {dateFilter.label}
                      </span>
                    </span>
                    <span className="text-[10px] text-white bg-white/5 font-bold px-2 py-0.5 rounded-full border border-white/10 shrink-0">
                      {allFilteredRecentOrders.length} {allFilteredRecentOrders.length === 1 ? "order" : "orders"} • ₹{recentOrdersMetrics.totalRev.toLocaleString("en-IN")}
                    </span>
                  </div>

                  {/* Day Stepper & Till Date Reset */}
                  <div className="flex items-center gap-1.5 shrink-0">
                    <button
                      type="button"
                      onClick={() => handleStepDay("prev")}
                      disabled={currentDayIndex >= availableOrderDays.length - 1}
                      className="flex items-center gap-1 text-[11px] font-semibold px-2.5 py-1 rounded-full bg-[var(--admin-surface)] border border-white/10 text-white hover:bg-white/[0.05] disabled:opacity-35 disabled:pointer-events-none cursor-pointer transition-all"
                      title="Step to earlier date with orders"
                    >
                      <ChevronLeft size={12} />
                      <span>Earlier Day</span>
                    </button>
                    <button
                      type="button"
                      onClick={() => handleStepDay("next")}
                      disabled={currentDayIndex <= 0}
                      className="flex items-center gap-1 text-[11px] font-semibold px-2.5 py-1 rounded-full bg-[var(--admin-surface)] border border-white/10 text-white hover:bg-white/[0.05] disabled:opacity-35 disabled:pointer-events-none cursor-pointer transition-all"
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
                          endDate: todayIso,
                        });
                        triggerToast("Restored store orders accumulated Till Date", "info");
                      }}
                      className="ml-1 text-[11px] font-bold text-[#7C3AED] hover:underline cursor-pointer"
                    >
                      View All (Till Date)
                    </button>
                  </div>
                </div>

                {/* Quick Day Selector Pills */}
                <div className="flex items-center gap-1.5 overflow-x-auto no-scrollbar pt-0.5">
                  <span className="text-[10px] uppercase tracking-wider font-extrabold text-[var(--admin-text-muted)] shrink-0 mr-1">
                    Select Day:
                  </span>
                  {availableOrderDays.map((dayItem) => {
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
                          triggerToast(`Selected ${dayItem.label} (${dayItem.count} ${dayItem.count === 1 ? "order" : "orders"})`, "info");
                        }}
                        className={`flex items-center gap-1.5 px-2.5 py-1 rounded-full text-[11px] transition-all cursor-pointer whitespace-nowrap border shrink-0 ${
                          isSelected
                            ? "bg-[var(--admin-elevated)] text-white font-bold border-white/15"
                            : "bg-[var(--admin-surface)] hover:bg-white/[0.03] text-[var(--admin-text-muted)] hover:text-white border-white/5"
                        }`}
                      >
                        <span>{dayItem.label}</span>
                        <span
                          className={`px-1.5 py-0.2 rounded-full text-[9.5px] font-extrabold ${
                            isSelected ? "bg-white/10 text-white" : "bg-white/5 text-[var(--admin-text-muted)]"
                          }`}
                        >
                          {dayItem.count}
                        </span>
                        <span className={`text-[10px] ${isSelected ? "text-white/80" : "text-[var(--admin-text-muted)]"}`}>
                          ₹{Math.round(dayItem.totalRevenue).toLocaleString("en-IN")}
                        </span>
                      </button>
                    );
                  })}
                </div>
              </div>
            ) : dateFilter.type === "custom" ? (
              <div className="mx-5 sm:mx-6 my-2 px-3.5 py-2 rounded-[14px] bg-[var(--admin-surface-2)] border border-white/5 flex items-center justify-between text-xs text-[var(--admin-text-muted)] animate-in fade-in duration-150">
                <div className="flex items-center gap-2">
                  <CalendarDays size={13} className="text-[#7C3AED] shrink-0" />
                  <span>
                    <strong className="text-white">Custom Date Range:</strong> {dateFilter.startDate} → {dateFilter.endDate} ({allFilteredRecentOrders.length} orders found • ₹{recentOrdersMetrics.totalRev.toLocaleString("en-IN")})
                  </span>
                </div>
                <button
                  type="button"
                  onClick={() => {
                    setDateFilter({
                      type: "all",
                      label: "All Time (Till Date)",
                      startDate: "2026-01-01",
                      endDate: todayIso,
                    });
                    triggerToast("Reset to All Time (Till Date)", "info");
                  }}
                  className="text-[#7C3AED] hover:text-[#9061F9] font-bold hover:underline cursor-pointer flex items-center gap-1 shrink-0 ml-2"
                >
                  <span>Reset to Till Date</span>
                  <RotateCcw size={11} />
                </button>
              </div>
            ) : null}

            {/* Active Search & Filter Banner */}
            {searchQuery.trim() && (
              <div className="mx-5 sm:mx-6 my-2.5 p-2.5 rounded-[14px] bg-[var(--admin-surface-2)] border border-white/5 flex items-center justify-between text-xs text-[var(--admin-text-muted)] animate-in fade-in duration-150">
                <div className="flex items-center gap-2">
                  <Search size={13} className="text-[#7C3AED] shrink-0" />
                  <span>
                    Showing orders matching <strong className="font-semibold text-white">&quot;{searchQuery}&quot;</strong> ({allFilteredRecentOrders.length} {allFilteredRecentOrders.length === 1 ? "order" : "orders"} found)
                  </span>
                </div>
                <button
                  onClick={() => setSearchQuery("")}
                  className="text-[#7C3AED] hover:text-[#9061F9] font-semibold flex items-center gap-1 cursor-pointer hover:underline"
                >
                  <X size={12} /> Clear search
                </button>
              </div>
            )}

            <div className="overflow-x-auto overflow-y-auto admin-scroll overscroll-x-contain flex-1 min-h-0">
              <table className="w-full table-fixed text-left border-collapse" role="table">
                <thead className="sticky top-0 z-10 bg-[var(--admin-surface-2)] shadow-xs">
                  <tr className="border-b border-white/5 text-[11px] font-semibold text-[var(--admin-text-muted)] uppercase tracking-wider select-none">
                    <th className="px-4 py-3.5 text-left w-[14%]">Order ID</th>
                    <th className="px-4 py-3.5 text-left w-[19%]">Customer</th>
                    <th className="px-4 py-3.5 text-left w-[26%]">Products</th>
                    <th className="px-4 py-3.5 text-right w-[12%]">Total</th>
                    <th className="px-3 py-3.5 text-center w-[11%]">Status</th>
                    <th className="px-3 py-3.5 text-center w-[11%]">Date</th>
                    <th className="px-1.5 py-3.5 text-center w-[7%]">Actions</th>
                  </tr>
                </thead>
                <tbody className="divide-y divide-white/5">
                  {displayedOrders.length === 0 ? (
                    <tr>
                      <td colSpan={7} className="py-24 text-center text-xs text-[var(--admin-text-muted)]">
                        <div className="flex flex-col items-center justify-center gap-2">
                          <Package size={24} className="text-[var(--admin-text-muted)]" />
                          <span>No orders found matching the active filters.</span>
                          <button
                            type="button"
                            onClick={() => {
                              setRecentOrdersStatusFilter("All");
                              setDateFilter({
                                type: "all",
                                label: "All Time (Till Date)",
                                startDate: "2026-01-01",
                                endDate: todayIso,
                              });
                            }}
                            className="text-[#7C3AED] hover:underline font-semibold text-xs mt-1 cursor-pointer"
                          >
                            Reset filters to All Time
                          </button>
                        </div>
                      </td>
                    </tr>
                  ) : (
                    displayedOrders.map((order) => {
                      const customerName = order.shippingAddress?.name || "Customer";
                      const avatar = getCustomerAvatar(customerName);
                      const firstItem = order.items?.[0];
                      const primaryProductName = firstItem?.productName || order.itemNames?.[0] || "Custom Product";
                      const itemCount = order.itemsCount || order.items?.length || 1;
                      const otherCount = itemCount > 1 ? itemCount - 1 : 0;
                      const thumbUrl = firstItem?.imageUrl || "/products/shoes/veyro-shoe-01-primary.webp";
                      const variantSummary = [
                        firstItem?.selectedSize ? `Size: ${firstItem.selectedSize}` : null,
                        firstItem?.colorName || null,
                      ].filter(Boolean).join(" · ");

                      return (
                        <tr
                          key={order.id}
                          onClick={() => setSelectedOrderForModal(order)}
                          className="hover:bg-white/[0.04] cursor-pointer transition-colors duration-150 group border-b border-white/5"
                          title="Click to deep inspect order"
                        >
                          {/* Order ID: Left-aligned for anchor clarity */}
                          <td className="px-4 py-3.5 whitespace-nowrap text-left font-mono text-xs">
                            <span className="font-bold text-white group-hover:text-[var(--admin-primary)] transition-colors select-all">
                              {order.id}
                            </span>
                          </td>

                          {/* Customer: full width, no awkward truncation */}
                          <td className="px-4 py-3.5 whitespace-nowrap">
                            <div className="flex items-center gap-2.5 min-w-0">
                              <div
                                className={`w-7 h-7 sm:w-8 sm:h-8 rounded-full ${avatar.bg} ${avatar.text} flex items-center justify-center text-xs font-bold shrink-0 border border-white/10`}
                              >
                                {avatar.initial}
                              </div>
                              <div className="min-w-0 flex-1">
                                <span className="text-xs sm:text-[13px] font-semibold text-white truncate block">
                                  {customerName}
                                </span>
                                {order.shippingAddress?.phone ? (
                                  <div className="text-[11px] text-[var(--admin-text-muted)] flex items-center gap-1 truncate mt-0.5">
                                    <Phone size={10} className="shrink-0 text-[var(--admin-text-muted)]" />
                                    <span className="truncate">{order.shippingAddress.phone}</span>
                                  </div>
                                ) : (
                                  <div className="text-[11px] text-[var(--admin-text-muted)] truncate mt-0.5">
                                    Registered Buyer
                                  </div>
                                )}
                              </div>
                            </div>
                          </td>

                          {/* Products: Thumbnail + Title + Variant pill */}
                          <td className="px-4 py-3.5 min-w-0">
                            <div className="flex items-center gap-2.5 min-w-0">
                              <div className="w-8 h-8 rounded-[8px] bg-[var(--admin-surface-2)] overflow-hidden shrink-0 border border-white/10 flex items-center justify-center">
                                <Image
                                  src={thumbUrl}
                                  alt={primaryProductName}
                                  width={32}
                                  height={32}
                                  className="w-full h-full object-cover"
                                />
                              </div>
                              <div className="min-w-0 flex-1">
                                <div className="text-xs sm:text-[13px] font-semibold text-white truncate leading-tight group-hover:text-white transition-colors">
                                  {primaryProductName}
                                </div>
                                <div className="flex items-center gap-1.5 mt-0.5 min-w-0">
                                  <span className="text-[11px] text-[var(--admin-text-muted)] truncate">
                                    {variantSummary || `${itemCount} item${itemCount === 1 ? "" : "s"}`}
                                  </span>
                                  {otherCount > 0 && (
                                    <span className="text-[10px] px-1.5 py-0.2 rounded-[4px] bg-white/10 text-[var(--admin-primary)] font-bold shrink-0">
                                      +{otherCount}
                                    </span>
                                  )}
                                </div>
                              </div>
                            </div>
                          </td>

                          {/* Total: Clear right alignment */}
                          <td className="px-4 py-3.5 whitespace-nowrap text-right">
                            <div className="flex flex-col items-end gap-0.5">
                              <span className="text-xs sm:text-sm font-bold text-white font-heading tabular-nums">
                                ₹{order.total.toLocaleString("en-IN")}
                              </span>
                              <span className="inline-block px-1.5 py-0.2 rounded text-[9.5px] font-bold uppercase tracking-wider bg-white/5 border border-white/10 text-[var(--admin-text-muted)]">
                                {order.paymentMethod === "upi"
                                  ? "UPI • PAID"
                                  : order.paymentMethod === "card"
                                  ? "CARD • PAID"
                                  : order.paymentMethod === "cod"
                                  ? "COD • PENDING"
                                  : "PREPAID"}
                              </span>
                            </div>
                          </td>

                          {/* Status: Centered clean pill */}
                          <td className="px-3 py-3.5 whitespace-nowrap text-center">
                            <div className="flex items-center justify-center">
                              <StatusPill status={order.status} />
                            </div>
                          </td>

                          {/* Date: Centered with clock icon */}
                          <td className="px-3 py-3.5 whitespace-nowrap text-center">
                            <div className="flex flex-col items-center justify-center gap-0.5">
                              <div className="text-xs font-semibold text-white">
                                {order.date.includes(",") ? order.date.split(",")[0].trim() : order.date}
                              </div>
                              <div className="text-[11px] text-[var(--admin-text-muted)] flex items-center justify-center gap-1">
                                <Clock size={10} className="text-[var(--admin-text-muted)] shrink-0" />
                                <span>{order.date.includes(",") ? order.date.split(",")[1].trim() : "Recorded"}</span>
                              </div>
                            </div>
                          </td>

                          {/* Actions: Centered 3-dots */}
                          <td className="px-2 py-3.5 whitespace-nowrap text-center" onClick={(e) => e.stopPropagation()}>
                            <div className="flex items-center justify-center">
                              <OrderRowMenu
                                order={order}
                                onUpdateStatus={(id, status) => {
                                  updateOrderStatus(id, status);
                                  triggerToast(`Order #${id} marked as ${status}`);
                                }}
                                onInspectOrder={(ord) => setSelectedOrderForModal(ord)}
                                onDownloadSlip={(ord) => printOrDownloadOrderSlip(ord)}
                                onCopyId={(id) => {
                                  navigator.clipboard.writeText(id);
                                  triggerToast(`Copied Order ID: ${id}`, "info");
                                }}
                              />
                            </div>
                          </td>
                        </tr>
                      );
                    })
                  )}
                  {displayedOrders.length > 0 && displayedOrders.length < RECENT_ORDERS_PAGE_SIZE && recentOrdersStatusFilter !== "All" && (
                    <tr>
                      <td colSpan={7} className="py-3 px-4 text-center text-xs text-[var(--admin-text-muted)] bg-white/[0.01]">
                        <span className="inline-flex items-center gap-1.5">
                          <span className="w-1.5 h-1.5 rounded-full bg-[var(--admin-primary)] shrink-0" />
                          <span>Showing all {displayedOrders.length} {recentOrdersStatusFilter} orders for this period</span>
                        </span>
                      </td>
                    </tr>
                  )}
                </tbody>
              </table>
            </div>
          </div>

          {/* ── CLEAN, HIGH-PRECISION ENTERPRISE FOOTER ── */}
          <div className="mt-auto px-5 py-3.5 bg-[var(--admin-surface-2)] border-t border-white/5 flex flex-wrap items-center justify-between gap-3 shrink-0">
            {/* Left: Summary text with count */}
            <div className="flex items-center gap-2 text-xs text-[var(--admin-text-muted)] font-medium">
              <span className="w-1.5 h-1.5 rounded-full bg-[var(--admin-primary)] shrink-0" />
              <span>
                Showing{" "}
                <strong className="text-white font-semibold">
                  {allFilteredRecentOrders.length === 0 ? 0 : (recentOrdersPage - 1) * RECENT_ORDERS_PAGE_SIZE + 1}
                </strong>
                –
                <strong className="text-white font-semibold">
                  {Math.min(recentOrdersPage * RECENT_ORDERS_PAGE_SIZE, allFilteredRecentOrders.length)}
                </strong>{" "}
                of <strong className="text-white font-semibold">{allFilteredRecentOrders.length}</strong> orders
              </span>
            </div>

            {/* Right: Pagination + Quick Actions */}
            <div className="flex items-center gap-3">
              {/* Pagination controls */}
              {totalRecentOrdersPages > 1 && (
                <div className="flex items-center gap-1">
                  <button
                    type="button"
                    onClick={() => setRecentOrdersPage((p) => Math.max(1, p - 1))}
                    disabled={recentOrdersPage === 1}
                    className="w-7 h-7 rounded-lg border border-white/10 text-[var(--admin-text-muted)] hover:text-white hover:bg-white/[0.04] disabled:opacity-25 disabled:pointer-events-none flex items-center justify-center transition-colors cursor-pointer"
                    title="Previous Page"
                  >
                    <ChevronLeft size={13} />
                  </button>
                  {Array.from({ length: totalRecentOrdersPages }).map((_, i) => {
                    const pageNum = i + 1;
                    const isActive = recentOrdersPage === pageNum;
                    return (
                      <button
                        key={pageNum}
                        type="button"
                        onClick={() => setRecentOrdersPage(pageNum)}
                        className={`w-7 h-7 rounded-lg text-xs font-semibold flex items-center justify-center transition-all cursor-pointer ${
                          isActive
                            ? "bg-[var(--admin-elevated)] text-white border border-white/15 font-bold shadow-xs"
                            : "text-[var(--admin-text-muted)] hover:text-white hover:bg-white/[0.04]"
                        }`}
                      >
                        {pageNum}
                      </button>
                    );
                  })}
                  <button
                    type="button"
                    onClick={() => setRecentOrdersPage((p) => Math.min(totalRecentOrdersPages, p + 1))}
                    disabled={recentOrdersPage === totalRecentOrdersPages}
                    className="w-7 h-7 rounded-lg border border-white/10 text-[var(--admin-text-muted)] hover:text-white hover:bg-white/[0.04] disabled:opacity-25 disabled:pointer-events-none flex items-center justify-center transition-colors cursor-pointer"
                    title="Next Page"
                  >
                    <ChevronRight size={13} />
                  </button>
                </div>
              )}

              {/* Batch Actions */}
              <div className="flex items-center gap-2 border-l border-white/10 pl-3">
                <button
                  type="button"
                  onClick={() => {
                    downloadAllOrdersCSV(allFilteredRecentOrders);
                    triggerToast(`Exported ${allFilteredRecentOrders.length} orders to CSV`, "success");
                  }}
                  className="flex items-center gap-1.5 px-3 py-1.5 rounded-lg border border-white/10 bg-[var(--admin-surface)] hover:bg-white/[0.05] text-white text-xs font-semibold transition-all cursor-pointer"
                  title="Export currently filtered orders dataset as CSV"
                >
                  <Download size={12} className="text-[var(--admin-text-muted)]" />
                  <span>Export CSV</span>
                </button>

                <button
                  type="button"
                  onClick={() => {
                    if (displayedOrders[0]) {
                      printOrDownloadOrderSlip(displayedOrders[0]);
                    } else {
                      triggerToast("No orders available to print", "info");
                    }
                  }}
                  className="flex items-center gap-1.5 px-3 py-1.5 rounded-lg border border-white/10 bg-[var(--admin-surface)] hover:bg-white/[0.05] text-white text-xs font-semibold transition-all cursor-pointer"
                  title="Print latest order dispatch slip"
                >
                  <Printer size={12} className="text-[var(--admin-text-muted)]" />
                  <span>Print Slip</span>
                </button>
              </div>
            </div>
          </div>
        </div>

        {/* Right: Top Products (4 cols) */}
        <div className="lg:col-span-4 bg-[var(--admin-surface)] rounded-[28px] border border-white/5 p-5 flex flex-col lg:h-[700px] overflow-hidden">
          {/* a) Header + date/metric toggle + category chips (shrink-0) */}
          <div className="shrink-0">
            {/* Header */}
            <div className="flex items-center justify-between mb-3.5">
              <div className="flex items-center gap-3 min-w-0">
                <AdminIconBadge variant="section" icon={Sparkles} />
                <div className="min-w-0">
                  <h2 className="text-[17px] font-bold text-white leading-tight tracking-tight">
                    Top Products
                  </h2>
                  <p className="text-xs text-[var(--admin-text-muted)] font-normal mt-1 flex items-center gap-1.5 truncate">
                    <CalendarDays size={12} className="text-[var(--admin-text-muted)] shrink-0" />
                    <span className="truncate">
                      {dateFilter.type === "day"
                        ? `Single day performance: ${dateFilter.label}`
                        : dateFilter.type === "custom"
                        ? `Range: ${dateFilter.startDate} → ${dateFilter.endDate}`
                        : `All-time accumulated volume up to ${dateFilter.endDate}`}
                    </span>
                  </p>
                </div>
              </div>

              <button
                type="button"
                onClick={() => setIsAllProductsModalOpen(true)}
                className="flex items-center gap-1 text-xs font-semibold text-[var(--admin-text-muted)] hover:text-white transition-colors group cursor-pointer shrink-0"
              >
                <span>View All</span>
                <ChevronRight size={13} className="transition-transform group-hover:translate-x-0.5" />
              </button>
            </div>

            {/* Filter & Metric Bar: Exactly 2 Clean, Balanced Rows */}
            <div className="flex flex-col gap-2.5 mb-3 pb-3 border-b border-white/5">
              {/* Row 1: Compact Date Range Picker & Metric Segmented Pill */}
              <div className="flex items-center justify-between gap-2">
                <AdminDateRangePicker
                  currentFilter={dateFilter}
                  onSelectFilter={(newFilter) => {
                    setDateFilter(newFilter);
                    setTopProductsTimeframe("period");
                    triggerToast(`Filter applied: ${newFilter.label}`, "info");
                  }}
                  orders={orders}
                  compact={true}
                  align="right"
                  customTriggerLabel={
                    dateFilter.type === "day"
                      ? `Day: ${dateFilter.singleDay || dateFilter.startDate}`
                      : dateFilter.type === "custom"
                      ? `${dateFilter.startDate.slice(5)} → ${dateFilter.endDate.slice(5)}`
                      : "Till Date (All Time)"
                  }
                  className="flex-1 min-w-0"
                />

                {/* Unified Segmented Metric Toggle Pill */}
                <div className="flex items-center bg-[var(--admin-surface-2)] p-0.5 rounded-full border border-white/5 shrink-0">
                  <button
                    type="button"
                    onClick={() => setTopProductsMetric("revenue")}
                    className={`flex items-center gap-1 px-2.5 py-1 rounded-full text-[11px] font-semibold transition-colors cursor-pointer ${
                      topProductsMetric === "revenue"
                        ? "bg-[var(--admin-elevated)] text-white border border-white/10 font-bold"
                        : "text-[var(--admin-text-muted)] hover:text-white"
                    }`}
                    title="Sort products by gross revenue"
                  >
                    <IndianRupee
                      size={10}
                      strokeWidth={2.6}
                      className={topProductsMetric === "revenue" ? "text-[#7C3AED]" : "text-[var(--admin-text-muted)]"}
                    />
                    <span>Rev</span>
                  </button>
                  <button
                    type="button"
                    onClick={() => setTopProductsMetric("units")}
                    className={`flex items-center gap-1 px-2.5 py-1 rounded-full text-[11px] font-semibold transition-colors cursor-pointer ${
                      topProductsMetric === "units"
                        ? "bg-[var(--admin-elevated)] text-white border border-white/10 font-bold"
                        : "text-[var(--admin-text-muted)] hover:text-white"
                    }`}
                    title="Sort products by total units sold"
                  >
                    <ShoppingBag
                      size={10}
                      strokeWidth={2.4}
                      className={topProductsMetric === "units" ? "text-[#7C3AED]" : "text-[var(--admin-text-muted)]"}
                    />
                    <span>Units</span>
                  </button>
                </div>
              </div>

              {/* Row 2: Category Chips */}
              <div className="flex items-center gap-1.5 overflow-x-auto no-scrollbar pt-0.5">
                {[
                  { key: "all", label: "All" },
                  { key: "T-Shirts", label: "Tees" },
                  { key: "Shoes", label: "Shoes" },
                  { key: "Watches", label: "Watches" },
                ].map((c) => (
                  <button
                    key={c.key}
                    type="button"
                    onClick={() => setTopProductsCategory(c.key)}
                    className={`h-7 px-3 rounded-[10px] text-xs transition-colors cursor-pointer shrink-0 flex items-center justify-center ${
                      topProductsCategory === c.key
                        ? "bg-white/10 text-white font-semibold border border-white/15"
                        : "text-[var(--admin-text-muted)] hover:text-white hover:bg-white/[0.04] border border-transparent font-medium"
                    }`}
                  >
                    {c.label}
                  </button>
                ))}
              </div>
            </div>
          </div>

          {/* b) The product list (flex-1 min-h-0, admin-scroll with overflow-y-auto, px-1.5) */}
          <div className="flex-1 min-h-0 overflow-y-auto overflow-x-hidden admin-scroll space-y-1 px-1.5">
            {activeTopProducts.slice(0, TOP_PRODUCTS_VISIBLE).map((item, idx) => {
              return (
                <div
                  key={`${item.id || item.name || "prod"}-${idx}`}
                  role="button"
                  tabIndex={0}
                  onClick={() => setSelectedTopProduct(item)}
                  onKeyDown={(e) => {
                    if (e.key === "Enter" || e.key === " ") {
                      e.preventDefault();
                      setSelectedTopProduct(item);
                    }
                  }}
                  className="grid grid-cols-[24px_40px_1fr_auto] gap-3 items-center py-2 px-2.5 rounded-[14px] hover:bg-white/[0.04] transition-colors cursor-pointer border border-transparent hover:border-white/5 focus:outline-none focus-visible:ring-1 focus-visible:ring-inset focus-visible:ring-white/20 group"
                  title={`Click to view deep analytics & stock actions for ${item.name}`}
                >
                  {/* Rank Badge (24px) */}
                  <div className="w-6 h-6 rounded-[8px] bg-white/[0.04] border border-white/[0.08] flex items-center justify-center shrink-0 text-white/80 font-heading font-semibold text-[11px] tabular-nums group-hover:border-white/20 group-hover:bg-white/[0.06] transition-colors">
                    {idx + 1}
                  </div>

                  {/* Thumb (40px) */}
                  <div className="w-10 h-10 rounded-[10px] bg-[var(--admin-surface-2)] border border-white/10 overflow-hidden shrink-0 flex items-center justify-center">
                    <Image
                      src={item.imageUrl}
                      alt={item.name}
                      width={40}
                      height={40}
                      className="w-full h-full object-cover"
                    />
                  </div>

                  {/* Text column */}
                  <div className="min-w-0">
                    <div className="font-medium text-[13px] text-white truncate">
                      {item.name}
                    </div>
                    <div className="text-[11px] text-white/50 truncate mt-0.5">
                      {item.soldCount} sold · ₹{item.unitPrice.toLocaleString("en-IN")} ·{" "}
                      <span className={item.stock <= 10 ? "text-[var(--admin-warning)] font-medium" : ""}>
                        {item.stock <= 10 ? `${item.stock} left` : `${item.stock} in stock`}
                      </span>
                    </div>
                  </div>

                  {/* Metric column (right) */}
                  <div className="text-right shrink-0">
                    <div className="font-heading font-bold text-[13px] text-white tabular-nums">
                      {topProductsMetric === "units"
                        ? `${item.soldCount.toLocaleString("en-IN")} sold`
                        : `₹${item.revenue.toLocaleString("en-IN")}`}
                    </div>
                    <div className="text-[11px] tabular-nums mt-0.5">
                      {topProductsMetric === "units" ? (
                        <span className="text-white/50">₹{item.revenue.toLocaleString("en-IN")}</span>
                      ) : item.growth >= 0 ? (
                        <span className="text-[var(--admin-success)]">+{item.growth}%</span>
                      ) : (
                        <span className="text-[var(--admin-danger)]">{item.growth}%</span>
                      )}
                    </div>
                  </div>
                </div>
              );
            })}
            {activeTopProducts.length > 0 && activeTopProducts.length <= 4 && topProductsCategory !== "all" && (
              <div className="text-center py-2.5 px-3 text-xs text-[var(--admin-text-muted)] bg-white/[0.02] rounded-[10px] border border-white/5 mt-2 flex items-center justify-center gap-1.5">
                <span>Showing all {activeTopProducts.length} items in &quot;{topProductsCategory}&quot;</span>
              </div>
            )}
          </div>

          {/* c) Footer ("Top N of M catalog items" and "View Full Leaderboard") pinned with mt-auto, border-t white/5 */}
          <div className="mt-auto pt-3 border-t border-white/5 flex items-center justify-between shrink-0">
            <span className="text-[11px] text-[var(--admin-text-muted)] font-medium">
              Top {Math.min(TOP_PRODUCTS_VISIBLE, activeTopProducts.length)} of {activeTopProducts.length} catalog items
            </span>
            <button
              type="button"
              onClick={() => setIsAllProductsModalOpen(true)}
              className="inline-flex items-center gap-1 text-[11px] font-bold text-[#7C3AED] hover:text-[#9061F9] transition-colors cursor-pointer group"
            >
              <span>View Full Leaderboard</span>
              <ChevronRight size={11} className="transition-transform group-hover:translate-x-0.5" />
            </button>
          </div>
        </div>
      </section>

      {/* ── FIVE RICH MODALS (PORTALED TO ROOT BODY) ── */}
      <AdminPortal>
        {/* Return Requests Deep Review Modal */}
        <AnimatePresence>
          {isReturnModalOpen && (
            <ReturnRequestsReviewModal
              isOpen={isReturnModalOpen}
              onClose={() => setIsReturnModalOpen(false)}
              orders={orders}
              onReviewReturn={reviewReturnRequest}
            />
          )}
        </AnimatePresence>

        {/* All Top Products Catalog Leaderboard Modal (Base List: z-[100000]) */}
        <AnimatePresence>
          {isAllProductsModalOpen && (
            <AllTopProductsModal
              isOpen={isAllProductsModalOpen}
              onClose={() => setIsAllProductsModalOpen(false)}
              products={activeTopProducts}
              onSelectProduct={(p) => setSelectedTopProduct(p)}
              onExportAllCSV={() => {
                downloadAllProductsCSV(activeTopProducts, topProductsTimeframe);
                triggerToast("Full catalog leaderboard downloaded as CSV");
              }}
              timeframe={
                dateFilter.type === "day"
                  ? `Day-wise (${dateFilter.singleDay || dateFilter.startDate})`
                  : dateFilter.type === "custom"
                  ? `Range: ${dateFilter.startDate} → ${dateFilter.endDate}`
                  : `Till Date (${dateFilter.endDate})`
              }
              metric={topProductsMetric}
              isInspecting={Boolean(selectedTopProduct)}
            />
          )}
        </AnimatePresence>

        {/* Product Deep Performance & Retail Analytics Modal (Detail Modal: z-[100010]) */}
        <AnimatePresence>
          {selectedTopProduct && (
            <ProductPerformanceModal
              product={selectedTopProduct}
              onClose={() => setSelectedTopProduct(null)}
              orders={orders}
              onUpdateStock={handleUpdateStock}
              onUpdatePrice={handleUpdatePrice}
              showToast={(msg) => triggerToast(msg, "success")}
              isNested={isAllProductsModalOpen}
            />
          )}
        </AnimatePresence>

        {/* All Orders Manager Modal (Base List: z-[100000]) */}
        <AnimatePresence>
          {isAllOrdersModalOpen && (
            <AllOrdersManagerModal
              isOpen={isAllOrdersModalOpen}
              onClose={() => setIsAllOrdersModalOpen(false)}
              orders={orders}
              onSelectOrder={(ord) => {
                setSelectedOrderForModal(ord);
              }}
              onUpdateStatus={updateOrderStatus}
              showToast={(msg, type) => triggerToast(msg, type || "success")}
              isInspecting={Boolean(selectedOrderForModal)}
            />
          )}
        </AnimatePresence>

        {/* Order Deep Inspection Modal (Detail Modal: z-[100010]) */}
        <AnimatePresence>
          {selectedOrderForModal && (
            <OrderDeepInspectionModal
              order={selectedOrderForModal}
              onClose={() => setSelectedOrderForModal(null)}
              onUpdateStatus={updateOrderStatus}
              showToast={(msg, type) => triggerToast(msg, type || "success")}
              isNested={isAllOrdersModalOpen}
            />
          )}
        </AnimatePresence>

        {/* Floating System Notification Toast */}
        {adminToast && (
          <div className="fixed bottom-6 right-6 z-[100020] flex items-center gap-3 px-4 py-3 bg-[var(--admin-elevated)] text-white text-xs sm:text-sm font-medium rounded-full border border-white/10 animate-in fade-in slide-in-from-bottom-3 duration-200">
            <CheckCircle className="text-[#00F59B] shrink-0" size={18} />
            <span>{adminToast.message}</span>
            <button
              onClick={() => setAdminToast(null)}
              className="ml-2 text-[var(--admin-text-muted)] hover:text-white cursor-pointer"
            >
              <X size={14} />
            </button>
          </div>
        )}
      </AdminPortal>
    </div>
  );
}
