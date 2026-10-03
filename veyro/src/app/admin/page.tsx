"use client";

import React, { useMemo, useState, useRef, useEffect } from "react";
import Link from "next/link";
import Image from "next/image";
import { useRouter } from "next/navigation";
import { useProducts } from "@/context/ProductsContext";
import { useUser } from "@/context/UserContext";
import type { OrderRecord, OrderStatus, Product } from "@/types";
import { AdminDateRangePicker, DateFilterSelection, parseOrderDateToDayString, formatDayDisplay } from "@/components/admin/AdminDateRangePicker";
import {
  Search,
  Calendar,
  CalendarDays,
  Bell,
  ChevronDown,
  ChevronLeft,
  ChevronRight,
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
} from "lucide-react";

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
    id: "vey-tsh-ovr-001",
    sku: "VEY-TSH-OVR-001",
    name: "Mark Graphic Oversized Tee",
    category: "T-Shirts",
    soldCount: 42,
    revenue: 62958,
    unitPrice: 1499,
    cogs: 620,
    marginPercent: 58.6,
    imageUrl: "/products/tshirts/mark-graphic-tee-charcoal-front.webp",
    slug: "core-oversized-tee-black",
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
    id: "vey-shoe-crt-001",
    sku: "VEY-SHOE-CRT-001",
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
    id: "vey-wat-stl-001",
    sku: "VEY-WAT-STL-001",
    name: "Royal Steel Edition",
    category: "Watches",
    soldCount: 30,
    revenue: 47970,
    unitPrice: 1599,
    cogs: 750,
    marginPercent: 53.1,
    imageUrl: "/products/watches/seiko-watch.jpg",
    slug: "royal-steel-edition",
    growth: 18.7,
    growthDirection: "up",
    stock: 9,
    stockStatus: "low",
    returnRate: 0.8,
    rating: 4.95,
    reviewCount: 84,
    isFeatured: true,
    variants: [
      { size: "40mm Case", sold: 18, revenue: 28782, stock: 5, isBestseller: true },
      { size: "42mm Case", sold: 12, revenue: 19188, stock: 4 },
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
    name: "Heritage Automatic",
    category: "Watches",
    soldCount: 26,
    revenue: 41574,
    unitPrice: 1599,
    cogs: 720,
    marginPercent: 55.0,
    imageUrl: "/products/watches/dw-watch.jpg",
    slug: "heritage-automatic-brown",
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
    name: "Urban Chrono Black",
    category: "Watches",
    soldCount: 22,
    revenue: 35178,
    unitPrice: 1599,
    cogs: 710,
    marginPercent: 55.6,
    imageUrl: "/products/watches/aigner-blue-watch.jpg",
    slug: "urban-chrono-black",
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
    id: "vey-tsh-apx-002",
    sku: "VEY-TSH-APX-002",
    name: "Apex Arachnid Heavyweight Tee",
    category: "T-Shirts",
    soldCount: 19,
    revenue: 28481,
    unitPrice: 1499,
    cogs: 610,
    marginPercent: 59.3,
    imageUrl: "/products/tshirts/apex-arachnid-front.webp",
    slug: "apex-arachnid-oversized-tee",
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
    id: "vey-shoe-run-002",
    sku: "VEY-SHOE-RUN-002",
    name: "Minimalist Retro Runner",
    category: "Shoes",
    soldCount: 17,
    revenue: 24140,
    unitPrice: 1420,
    cogs: 660,
    marginPercent: 53.5,
    imageUrl: "/products/shoes/veyro-shoe-02-primary.webp",
    slug: "retro-runner-black",
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
    name: "Cerruti 1881 Chronograph",
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
    id: "vey-tsh-drg-003",
    sku: "VEY-TSH-DRG-003",
    name: "Echo Dragon Oversized Tee",
    category: "T-Shirts",
    soldCount: 13,
    revenue: 19487,
    unitPrice: 1499,
    cogs: 600,
    marginPercent: 60.0,
    imageUrl: "/products/tshirts/echo-dragon-oversized-tee-front.webp",
    slug: "echo-dragon-oversized-tee",
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
    id: "vey-wat-fos-004",
    sku: "VEY-WAT-FOS-004",
    name: "Fossil Heritage Chrono",
    category: "Watches",
    soldCount: 11,
    revenue: 17589,
    unitPrice: 1599,
    cogs: 730,
    marginPercent: 54.3,
    imageUrl: "/products/watches/fossil-watch.jpg",
    slug: "fossil-heritage-chrono",
    growth: 7.1,
    growthDirection: "up",
    stock: 7,
    stockStatus: "low",
    returnRate: 1.0,
    rating: 4.8,
    reviewCount: 29,
    variants: [
      { size: "42mm Case", sold: 11, revenue: 17589, stock: 7, isBestseller: true },
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
    id: "vey-wat-tit-005",
    sku: "VEY-WAT-TIT-005",
    name: "Titan Raga Elegance",
    category: "Watches",
    soldCount: 9,
    revenue: 14391,
    unitPrice: 1599,
    cogs: 710,
    marginPercent: 55.6,
    imageUrl: "/products/watches/titan-raga.jpg",
    slug: "titan-raga-elegance",
    growth: 6.4,
    growthDirection: "up",
    stock: 5,
    stockStatus: "critical",
    returnRate: 0.7,
    rating: 4.95,
    reviewCount: 27,
    variants: [
      { size: "36mm Case", sold: 9, revenue: 14391, stock: 5, isBestseller: true },
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
    id: "vey-shoe-wfl-003",
    sku: "VEY-SHOE-WFL-003",
    name: "Street Waffle Runner",
    category: "Shoes",
    soldCount: 8,
    revenue: 11360,
    unitPrice: 1420,
    cogs: 670,
    marginPercent: 52.8,
    imageUrl: "/products/shoes/veyro-shoe-03-primary.webp",
    slug: "street-waffle-runner",
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

const REVENUE_DATA_30D: RevenuePoint[] = [
  { dayLabel: "Sep 1", dateStr: "Sep 1, 2026", value: 1200, ordersCount: 1, growthPct: "+0%" },
  { dayLabel: "", dateStr: "Sep 2, 2026", value: 1350, ordersCount: 2, growthPct: "+12.5%" },
  { dayLabel: "", dateStr: "Sep 3, 2026", value: 1420, ordersCount: 2, growthPct: "+5.2%" },
  { dayLabel: "", dateStr: "Sep 4, 2026", value: 1100, ordersCount: 1, growthPct: "-22.5%" },
  { dayLabel: "Sep 5", dateStr: "Sep 5, 2026", value: 1050, ordersCount: 1, growthPct: "-4.5%" },
  { dayLabel: "", dateStr: "Sep 6, 2026", value: 1320, ordersCount: 2, growthPct: "+25.7%" },
  { dayLabel: "", dateStr: "Sep 7, 2026", value: 1650, ordersCount: 2, growthPct: "+25.0%" },
  { dayLabel: "", dateStr: "Sep 8, 2026", value: 1880, ordersCount: 3, growthPct: "+13.9%" },
  { dayLabel: "", dateStr: "Sep 9, 2026", value: 1620, ordersCount: 2, growthPct: "-13.8%" },
  { dayLabel: "Sep 10", dateStr: "Sep 10, 2026", value: 1380, ordersCount: 2, growthPct: "-14.8%" },
  { dayLabel: "", dateStr: "Sep 11, 2026", value: 1550, ordersCount: 2, growthPct: "+12.3%" },
  { dayLabel: "", dateStr: "Sep 12, 2026", value: 1780, ordersCount: 2, growthPct: "+14.8%" },
  { dayLabel: "", dateStr: "Sep 13, 2026", value: 2050, ordersCount: 3, growthPct: "+15.2%" },
  { dayLabel: "Sep 15", dateStr: "Sep 14, 2026", value: 2420, ordersCount: 3, growthPct: "+18.0%" }, // Campaign high peak
  { dayLabel: "", dateStr: "Sep 15, 2026", value: 2150, ordersCount: 3, growthPct: "-11.2%" },
  { dayLabel: "", dateStr: "Sep 16, 2026", value: 1820, ordersCount: 2, growthPct: "-15.3%" },
  { dayLabel: "", dateStr: "Sep 17, 2026", value: 1710, ordersCount: 2, growthPct: "-6.0%" },
  { dayLabel: "", dateStr: "Sep 18, 2026", value: 1950, ordersCount: 2, growthPct: "+14.0%" },
  { dayLabel: "", dateStr: "Sep 19, 2026", value: 1840, ordersCount: 2, growthPct: "-5.6%" },
  { dayLabel: "Sep 20", dateStr: "Sep 20, 2026", value: 1650, ordersCount: 2, growthPct: "-10.3%" },
  { dayLabel: "", dateStr: "Sep 21, 2026", value: 1980, ordersCount: 2, growthPct: "+20.0%" },
  { dayLabel: "", dateStr: "Sep 22, 2026", value: 2320, ordersCount: 3, growthPct: "+17.2%" },
  { dayLabel: "", dateStr: "Sep 23, 2026", value: 2100, ordersCount: 3, growthPct: "-9.5%" },
  { dayLabel: "", dateStr: "Sep 24, 2026", value: 1890, ordersCount: 2, growthPct: "-10.0%" },
  { dayLabel: "Sep 25", dateStr: "Sep 25, 2026", value: 1800, ordersCount: 2, growthPct: "-4.8%" },
  { dayLabel: "", dateStr: "Sep 26, 2026", value: 2120, ordersCount: 3, growthPct: "+17.8%" },
  { dayLabel: "", dateStr: "Sep 27, 2026", value: 2280, ordersCount: 3, growthPct: "+7.5%" },
  { dayLabel: "", dateStr: "Sep 28, 2026", value: 2450, ordersCount: 3, growthPct: "+7.5%" },
  { dayLabel: "", dateStr: "Sep 29, 2026", value: 2320, ordersCount: 3, growthPct: "-5.3%" },
  { dayLabel: "Sep 30", dateStr: "Sep 30, 2026", value: 2680, ordersCount: 4, growthPct: "+15.5%" },
];

const REVENUE_DATA_7D: RevenuePoint[] = [
  { dayLabel: "Sep 24", dateStr: "Sep 24, 2026", value: 1890, ordersCount: 2, growthPct: "+4.2%" },
  { dayLabel: "Sep 25", dateStr: "Sep 25, 2026", value: 1800, ordersCount: 2, growthPct: "-4.8%" },
  { dayLabel: "Sep 26", dateStr: "Sep 26, 2026", value: 2120, ordersCount: 3, growthPct: "+17.8%" },
  { dayLabel: "Sep 27", dateStr: "Sep 27, 2026", value: 2280, ordersCount: 3, growthPct: "+7.5%" },
  { dayLabel: "Sep 28", dateStr: "Sep 28, 2026", value: 2450, ordersCount: 3, growthPct: "+7.5%" },
  { dayLabel: "Sep 29", dateStr: "Sep 29, 2026", value: 2320, ordersCount: 3, growthPct: "-5.3%" },
  { dayLabel: "Sep 30", dateStr: "Sep 30, 2026", value: 2680, ordersCount: 4, growthPct: "+15.5%" },
];

const REVENUE_DATA_90D: RevenuePoint[] = [
  { dayLabel: "Jul 1", dateStr: "Jul 1, 2026", value: 1100, ordersCount: 1, growthPct: "+0%" },
  { dayLabel: "", dateStr: "Jul 8, 2026", value: 1320, ordersCount: 2, growthPct: "+20%" },
  { dayLabel: "Jul 15", dateStr: "Jul 15, 2026", value: 1540, ordersCount: 2, growthPct: "+16.7%" },
  { dayLabel: "", dateStr: "Jul 22, 2026", value: 1680, ordersCount: 2, growthPct: "+9.1%" },
  { dayLabel: "Aug 1", dateStr: "Aug 1, 2026", value: 1820, ordersCount: 2, growthPct: "+8.3%" },
  { dayLabel: "", dateStr: "Aug 8, 2026", value: 1750, ordersCount: 2, growthPct: "-3.8%" },
  { dayLabel: "Aug 15", dateStr: "Aug 15, 2026", value: 1950, ordersCount: 3, growthPct: "+11.4%" },
  { dayLabel: "", dateStr: "Aug 22, 2026", value: 2020, ordersCount: 3, growthPct: "+3.6%" },
  { dayLabel: "Sep 1", dateStr: "Sep 1, 2026", value: 2100, ordersCount: 3, growthPct: "+4.0%" },
  { dayLabel: "", dateStr: "Sep 8, 2026", value: 2280, ordersCount: 3, growthPct: "+8.6%" },
  { dayLabel: "Sep 15", dateStr: "Sep 15, 2026", value: 2420, ordersCount: 3, growthPct: "+6.1%" },
  { dayLabel: "Sep 30", dateStr: "Sep 30, 2026", value: 2680, ordersCount: 4, growthPct: "+10.7%" },
];

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
  return { initial, bg: "bg-neutral-100", text: "text-neutral-700" };
}

// ─── STATUS PILL STYLING ──────────────────────────────────────────────────────

function StatusPill({ status }: { status: OrderStatus | string }) {
  let display = status;
  let pillClass = "bg-neutral-100 text-neutral-600";

  switch (status) {
    case "Delivered":
      display = "Delivered";
      pillClass = "bg-[#eaf8f0] text-[#10b981]";
      break;
    case "Processing":
    case "Confirmed":
    case "Packed":
      display = "Processing";
      pillClass = "bg-[#fef9e7] text-[#eab308]";
      break;
    case "Shipped":
    case "Out for Delivery":
      display = "Shipped";
      pillClass = "bg-[#eff6ff] text-[#3b82f6]";
      break;
    case "Cancelled":
      display = "Cancelled";
      pillClass = "bg-[#fef2f2] text-[#ef4444]";
      break;
    case "Return Requested":
      display = "Return Requested";
      pillClass = "bg-[#fff7ed] text-[#ea580c]";
      break;
    case "Returned":
      display = "Returned";
      pillClass = "bg-[#f3f4f6] text-[#6b7280]";
      break;
  }

  return (
    <span
      className={`inline-flex items-center px-3 py-1 rounded-full text-xs font-semibold whitespace-nowrap transition-colors ${pillClass}`}
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
        className="w-7 h-7 rounded-lg flex items-center justify-center text-neutral-400 hover:text-neutral-700 hover:bg-neutral-100 transition-colors cursor-pointer"
        aria-label={`Options for ${title}`}
      >
        <MoreHorizontal size={15} />
      </button>
      {open && (
        <div className="absolute right-0 top-full mt-1.5 w-48 bg-white rounded-xl border border-neutral-200/80 shadow-lg py-1 z-30 text-xs font-medium text-neutral-700 animate-in fade-in duration-150">
          <button
            onClick={handleExportCSV}
            className="w-full text-left px-3.5 py-2 hover:bg-neutral-50 flex items-center gap-2 cursor-pointer"
          >
            <Download size={13} className="text-neutral-400" />
            <span>Export CSV Report</span>
          </button>
          <button
            onClick={() => {
              window.print();
              setOpen(false);
            }}
            className="w-full text-left px-3.5 py-2 hover:bg-neutral-50 flex items-center gap-2 cursor-pointer"
          >
            <Eye size={13} className="text-neutral-400" />
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
        className="w-8 h-8 rounded-lg flex items-center justify-center text-neutral-400 hover:text-neutral-700 hover:bg-neutral-100 transition-colors cursor-pointer"
        aria-label="Order Status options"
      >
        <MoreHorizontal size={18} />
      </button>

      {open && (
        <div className="absolute right-0 top-full mt-1.5 w-56 bg-white rounded-2xl border border-neutral-200/80 shadow-xl py-2 z-40 text-xs font-medium text-neutral-700 animate-in fade-in zoom-in-95 duration-150">
          <div className="px-3 py-1 text-[11px] font-semibold text-neutral-400 uppercase tracking-wider">
            Filter View
          </div>
          <button
            onClick={() => {
              onSelectStatus?.(null);
              setOpen(false);
            }}
            className={`w-full text-left px-3 py-1.5 hover:bg-neutral-50 flex items-center justify-between cursor-pointer ${
              !selectedStatus ? "bg-neutral-50 font-bold text-neutral-900" : ""
            }`}
          >
            <span>All Statuses</span>
            <span className="text-neutral-400 font-normal">{stats.totalOrd}</span>
          </button>
          {[
            { label: "Delivered", count: stats.delivered, dot: "bg-[#00aa55]" },
            { label: "Processing", count: stats.processing, dot: "bg-[#facc15]" },
            { label: "Shipped", count: stats.shipped, dot: "bg-[#2563eb]" },
            { label: "Cancelled", count: stats.cancelled, dot: "bg-[#ef4444]" },
            { label: "Returned", count: stats.returned, dot: "bg-[#9ca3af]" },
          ].map((item) => (
            <button
              key={item.label}
              onClick={() => {
                onSelectStatus?.(selectedStatus === item.label ? null : item.label);
                setOpen(false);
              }}
              className={`w-full text-left px-3 py-1.5 hover:bg-neutral-50 flex items-center justify-between cursor-pointer ${
                selectedStatus === item.label ? "bg-neutral-50 font-bold text-neutral-900" : ""
              }`}
            >
              <div className="flex items-center gap-2">
                <span className={`w-2 h-2 rounded-full ${item.dot}`} />
                <span>{item.label}</span>
              </div>
              <span className="text-neutral-400 font-normal">{item.count}</span>
            </button>
          ))}

          <div className="my-1.5 border-t border-neutral-100" />

          <div className="px-3 py-1 text-[11px] font-semibold text-neutral-400 uppercase tracking-wider">
            Actions
          </div>
          <button
            onClick={handleExportCSV}
            className="w-full text-left px-3 py-2 hover:bg-neutral-50 flex items-center gap-2 cursor-pointer text-neutral-700 hover:text-black"
          >
            <Download size={14} className="text-neutral-400" />
            <span>Export Breakdown CSV</span>
          </button>
          <button
            onClick={() => {
              onRefresh?.();
              setOpen(false);
            }}
            className="w-full text-left px-3 py-2 hover:bg-neutral-50 flex items-center gap-2 cursor-pointer text-neutral-700 hover:text-black"
          >
            <RotateCw size={14} className="text-neutral-400" />
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
        className="w-8 h-8 rounded-xl flex items-center justify-center text-neutral-400 hover:text-neutral-700 hover:bg-neutral-100 transition-colors cursor-pointer outline-none focus:outline-none"
        aria-label="Revenue chart options"
      >
        <MoreHorizontal size={16} />
      </button>

      {open && (
        <div className="absolute right-0 top-full mt-1.5 w-56 bg-white rounded-2xl border border-neutral-200/90 shadow-2xl py-1.5 z-40 text-xs font-medium text-neutral-700 animate-in fade-in duration-150">
          <div className="px-3.5 py-1.5 text-[10px] text-neutral-400 font-semibold uppercase tracking-wider border-b border-neutral-100 mb-1">
            Chart View Options
          </div>
          <button
            onClick={() => {
              setMetricMode(metricMode === "revenue" ? "orders" : "revenue");
              setOpen(false);
            }}
            className="w-full text-left px-3.5 py-2 hover:bg-neutral-50 flex items-center justify-between cursor-pointer"
          >
            <div className="flex items-center gap-2">
              <BarChart3 size={13} className="text-neutral-400" />
              <span>Metric: {metricMode === "revenue" ? "Revenue (₹)" : "Orders (Units)"}</span>
            </div>
            <span className="text-[10px] text-amber-600 font-bold uppercase">Toggle</span>
          </button>
          <button
            onClick={() => {
              setShowGridlines((prev) => !prev);
              setOpen(false);
            }}
            className="w-full text-left px-3.5 py-2 hover:bg-neutral-50 flex items-center justify-between cursor-pointer"
          >
            <div className="flex items-center gap-2">
              <SlidersHorizontal size={13} className="text-neutral-400" />
              <span>Reference Gridlines</span>
            </div>
            <span className={`text-[10px] font-bold ${showGridlines ? "text-emerald-600" : "text-neutral-400"}`}>
              {showGridlines ? "ON" : "OFF"}
            </span>
          </button>
          <div className="border-t border-neutral-100 my-1" />
          <button
            onClick={handleExportCSV}
            className="w-full text-left px-3.5 py-2 hover:bg-neutral-50 flex items-center gap-2 cursor-pointer text-neutral-900 font-semibold"
          >
            <Download size={13} className="text-neutral-500" />
            <span>Export CSV Dataset</span>
          </button>
        </div>
      )}
    </div>
  );
}

// ─── REVENUE OVERVIEW CHART COMPONENT ────────────────────────────────────────

function RevenueOverviewChart({
  period,
  data,
  metricMode = "revenue",
  showGridlines = true,
  hoverIndex,
  setHoverIndex,
}: {
  period: "7d" | "30d" | "90d";
  data: RevenuePoint[];
  metricMode?: "revenue" | "orders";
  showGridlines?: boolean;
  hoverIndex: number | null;
  setHoverIndex: (idx: number | null) => void;
}) {
  const containerRef = useRef<HTMLDivElement>(null);
  const [dimensions, setDimensions] = useState({ width: 700, height: 260 });

  useEffect(() => {
    const handleResize = () => {
      if (containerRef.current) {
        setDimensions({
          width: containerRef.current.clientWidth || 700,
          height: 260,
        });
      }
    };
    handleResize();
    window.addEventListener("resize", handleResize);
    return () => window.removeEventListener("resize", handleResize);
  }, []);

  const padding = { top: 35, right: 30, bottom: 40, left: 45 };
  const chartW = Math.max(dimensions.width - padding.left - padding.right, 200);
  const chartH = dimensions.height - padding.top - padding.bottom;

  // Maximum value for scaling
  const maxMetricVal = useMemo(() => {
    if (metricMode === "revenue") {
      const highest = Math.max(...data.map((d) => d.value), 2800);
      return Math.ceil(highest / 1000) * 1000;
    } else {
      const highest = Math.max(...data.map((d) => d.ordersCount), 4);
      return highest + 1;
    }
  }, [data, metricMode]);

  const yMax = maxMetricVal;
  const yMin = 0;

  // Compute coordinate points
  const points = useMemo(() => {
    return data.map((d, i) => {
      const val = metricMode === "revenue" ? d.value : d.ordersCount;
      const x = padding.left + (i / Math.max(data.length - 1, 1)) * chartW;
      const y = padding.top + chartH - ((val - yMin) / (yMax - yMin)) * chartH;
      return { x, y, ...d };
    });
  }, [data, metricMode, chartW, chartH, padding.left, padding.top, yMax, yMin]);

  // Generate smooth Catmull-Rom / Bézier curve
  const { curvePath, areaPath } = useMemo(() => {
    if (points.length === 0) return { curvePath: "", areaPath: "" };
    let cPath = `M ${points[0].x} ${points[0].y}`;
    for (let i = 0; i < points.length - 1; i++) {
      const p0 = points[Math.max(0, i - 1)];
      const p1 = points[i];
      const p2 = points[i + 1];
      const p3 = points[Math.min(points.length - 1, i + 2)];

      const cp1x = p1.x + (p2.x - p0.x) / 5.5;
      const cp1y = p1.y + (p2.y - p0.y) / 5.5;
      const cp2x = p2.x - (p3.x - p1.x) / 5.5;
      const cp2y = p2.y - (p3.y - p1.y) / 5.5;

      cPath += ` C ${cp1x.toFixed(1)} ${cp1y.toFixed(1)}, ${cp2x.toFixed(1)} ${cp2y.toFixed(1)}, ${p2.x.toFixed(1)} ${p2.y.toFixed(1)}`;
    }
    const aPath = `${cPath} L ${points[points.length - 1].x} ${padding.top + chartH} L ${points[0].x} ${padding.top + chartH} Z`;
    return { curvePath: cPath, areaPath: aPath };
  }, [points, padding.top, chartH]);

  // Y-axis tick values
  const yTicks = useMemo(() => {
    if (metricMode === "revenue") {
      return [
        { label: `₹${(yMax / 1000).toFixed(0)}k`, value: yMax },
        { label: `₹${Math.round((yMax * 2) / 3 / 1000)}k`, value: (yMax * 2) / 3 },
        { label: `₹${Math.round(yMax / 3 / 1000)}k`, value: yMax / 3 },
        { label: "0", value: 0 },
      ];
    } else {
      return [
        { label: `${yMax} ord`, value: yMax },
        { label: `${Math.round((yMax * 2) / 3)} ord`, value: (yMax * 2) / 3 },
        { label: `${Math.round(yMax / 3)} ord`, value: yMax / 3 },
        { label: "0", value: 0 },
      ];
    }
  }, [metricMode, yMax]);

  // Default active index
  const defaultHighlightIdx = period === "30d" ? 13 : period === "7d" ? 6 : Math.min(10, points.length - 1);
  const activeIdx =
    hoverIndex !== null && hoverIndex >= 0 && hoverIndex < points.length
      ? hoverIndex
      : defaultHighlightIdx;
  const activePoint = points[activeIdx] || points[0];

  const handleMouseMove = (e: React.MouseEvent<SVGSVGElement>) => {
    if (!containerRef.current) return;
    const rect = e.currentTarget.getBoundingClientRect();
    const mouseX = e.clientX - rect.left - padding.left;
    const relRatio = Math.max(0, Math.min(1, mouseX / chartW));
    const closestIdx = Math.round(relRatio * (data.length - 1));
    setHoverIndex(closestIdx);
  };

  const handleTouchMove = (e: React.TouchEvent<SVGSVGElement>) => {
    if (!containerRef.current || !e.touches[0]) return;
    const rect = e.currentTarget.getBoundingClientRect();
    const touchX = e.touches[0].clientX - rect.left - padding.left;
    const relRatio = Math.max(0, Math.min(1, touchX / chartW));
    const closestIdx = Math.round(relRatio * (data.length - 1));
    setHoverIndex(closestIdx);
  };

  const primaryColor = metricMode === "revenue" ? "#eab308" : "#6366f1";

  return (
    <div
      ref={containerRef}
      className="relative w-full select-none outline-none"
      tabIndex={0}
      onKeyDown={(e) => {
        if (e.key === "ArrowLeft") {
          e.preventDefault();
          setHoverIndex(Math.max(0, activeIdx - 1));
        } else if (e.key === "ArrowRight") {
          e.preventDefault();
          setHoverIndex(Math.min(data.length - 1, activeIdx + 1));
        }
      }}
    >
      <svg
        width={dimensions.width}
        height={dimensions.height}
        viewBox={`0 0 ${dimensions.width} ${dimensions.height}`}
        className="w-full overflow-visible cursor-crosshair outline-none"
        onMouseMove={handleMouseMove}
        onTouchMove={handleTouchMove}
        onMouseLeave={() => setHoverIndex(defaultHighlightIdx)}
        role="img"
        aria-label="Revenue overview timeline graph"
      >
        <defs>
          <linearGradient id="revenueYellowGradient" x1="0" y1="0" x2="0" y2="1">
            <stop offset="0%" stopColor={primaryColor} stopOpacity="0.28" />
            <stop offset="65%" stopColor={primaryColor} stopOpacity="0.08" />
            <stop offset="100%" stopColor={primaryColor} stopOpacity="0.0" />
          </linearGradient>
          <filter id="lineGlow" x="-20%" y="-20%" width="140%" height="140%">
            <feDropShadow dx="0" dy="4" stdDeviation="6" floodColor={primaryColor} floodOpacity="0.25" />
          </filter>
        </defs>

        {/* Horizontal gridlines */}
        {showGridlines &&
          yTicks.map((tick, i) => {
            const y = padding.top + chartH - ((tick.value - yMin) / (yMax - yMin)) * chartH;
            return (
              <g key={i}>
                <line
                  x1={padding.left}
                  y1={y}
                  x2={dimensions.width - padding.right}
                  y2={y}
                  stroke="#f3f4f6"
                  strokeWidth="1"
                />
                <text
                  x={padding.left - 10}
                  y={y + 4}
                  textAnchor="end"
                  fill="#9ca3af"
                  fontSize="11"
                  fontWeight="500"
                >
                  {tick.label}
                </text>
              </g>
            );
          })}

        {/* X-axis labels */}
        {points.map((pt, i) => {
          if (!pt.dayLabel) return null;
          const isSelected = i === activeIdx;
          return (
            <text
              key={i}
              x={pt.x}
              y={dimensions.height - 10}
              textAnchor="middle"
              fill={isSelected ? "#111827" : "#9ca3af"}
              fontSize="11"
              fontWeight={isSelected ? "700" : "500"}
              className="cursor-pointer transition-colors duration-150"
              onClick={() => setHoverIndex(i)}
            >
              {pt.dayLabel}
            </text>
          );
        })}

        {/* Area fill */}
        <path d={areaPath} fill="url(#revenueYellowGradient)" />

        {/* Thick golden-yellow curve with soft glow */}
        <path
          d={curvePath}
          fill="none"
          stroke={primaryColor}
          strokeWidth="3.2"
          strokeLinecap="round"
          strokeLinejoin="round"
          filter="url(#lineGlow)"
        />

        {/* Active Marker Dot & Crosshair Drop-line */}
        {activePoint && (
          <g className="transition-all duration-150 pointer-events-none">
            {/* Vertical crosshair guide line */}
            <line
              x1={activePoint.x}
              y1={padding.top}
              x2={activePoint.x}
              y2={padding.top + chartH}
              stroke="#e5e7eb"
              strokeWidth="1.5"
              strokeDasharray="4 4"
            />

            {/* Glowing outer pulse ring */}
            <circle
              cx={activePoint.x}
              cy={activePoint.y}
              r="12"
              fill={primaryColor}
              fillOpacity="0.22"
              className="animate-pulse"
            />

            {/* Solid marker dot with black border matching Image 1 */}
            <circle
              cx={activePoint.x}
              cy={activePoint.y}
              r="5.5"
              fill={primaryColor}
              stroke="#000000"
              strokeWidth="2.5"
            />
          </g>
        )}
      </svg>

      {/* Floating HTML Tooltip matching Image 1 Target */}
      {activePoint && (
        <div
          className="absolute pointer-events-none transition-all duration-150 ease-out z-20"
          style={{
            left: `${Math.max(65, Math.min(dimensions.width - 65, activePoint.x))}px`,
            top: `${Math.max(50, activePoint.y - 12)}px`,
            transform: "translate(-50%, -100%)",
          }}
        >
          <div className="bg-white/95 backdrop-blur-md rounded-xl border border-neutral-200/90 shadow-[0_8px_20px_rgba(0,0,0,0.12)] px-3.5 py-2 text-center select-none min-w-[110px] animate-in fade-in zoom-in-95 duration-150">
            <div className="text-[10px] font-semibold text-neutral-400 tracking-wide uppercase">
              {activePoint.dateStr}
            </div>
            <div className="text-[15px] font-extrabold text-neutral-900 mt-0.5 leading-snug tracking-tight">
              {metricMode === "revenue"
                ? `₹${activePoint.value.toLocaleString("en-IN")}`
                : `${activePoint.ordersCount} Orders`}
            </div>
            <div className="flex items-center justify-center gap-1.5 mt-0.5 text-[10px]">
              <span className="text-neutral-500 font-medium">
                {metricMode === "revenue"
                  ? `${activePoint.ordersCount} ${activePoint.ordersCount === 1 ? "order" : "orders"}`
                  : `₹${activePoint.value.toLocaleString("en-IN")}`}
              </span>
              {activePoint.growthPct && (
                <span
                  className={`font-semibold ${
                    activePoint.growthPct.startsWith("-") ? "text-rose-600" : "text-emerald-600"
                  }`}
                >
                  {activePoint.growthPct}
                </span>
              )}
            </div>
            {/* Downward triangle caret */}
            <div className="w-2.5 h-2.5 bg-white border-r border-b border-neutral-200/90 rotate-45 mx-auto -mb-3.5 mt-1" />
          </div>
        </div>
      )}
    </div>
  );
}

// ─── ORDER STATUS DONUT CHART COMPONENT ──────────────────────────────────────

interface StatusCategory {
  label: string;
  count: number;
  pct: string;
  color: string;
  dotClass: string;
}

function OrderStatusDonut({
  deliveredCount = 7,
  processingCount = 2,
  shippedCount = 1,
  cancelledCount = 1,
  returnedCount = 0,
  onSelectStatus,
  selectedStatus,
  isSpinning = false,
}: {
  deliveredCount: number;
  processingCount: number;
  shippedCount: number;
  cancelledCount: number;
  returnedCount: number;
  onSelectStatus?: (status: string | null) => void;
  selectedStatus?: string | null;
  isSpinning?: boolean;
}) {
  const total = deliveredCount + processingCount + shippedCount + cancelledCount + returnedCount || 11;
  const [hoveredCategory, setHoveredCategory] = useState<StatusCategory | null>(null);
  const [mounted, setMounted] = useState(false);
  const [animatedCount, setAnimatedCount] = useState(0);

  useEffect(() => {
    setMounted(true);
    let current = 0;
    const step = () => {
      current += 1;
      setAnimatedCount(current);
      if (current < total) {
        requestAnimationFrame(step);
      }
    };
    const timer = setTimeout(() => {
      requestAnimationFrame(step);
    }, 120);
    return () => clearTimeout(timer);
  }, [total]);

  const categories: StatusCategory[] = [
    {
      label: "Delivered",
      count: deliveredCount,
      pct: `${((deliveredCount / total) * 100).toFixed(1)}%`,
      color: "#00aa55", // Vivid Kelly/Emerald green matching Image 1
      dotClass: "bg-[#00aa55]",
    },
    {
      label: "Processing",
      count: processingCount,
      pct: `${((processingCount / total) * 100).toFixed(1)}%`,
      color: "#facc15", // Warm golden yellow matching Image 1
      dotClass: "bg-[#facc15]",
    },
    {
      label: "Shipped",
      count: shippedCount,
      pct: `${((shippedCount / total) * 100).toFixed(1)}%`,
      color: "#2563eb", // Royal blue matching Image 1
      dotClass: "bg-[#2563eb]",
    },
    {
      label: "Cancelled",
      count: cancelledCount,
      pct: `${((cancelledCount / total) * 100).toFixed(1)}%`,
      color: "#ef4444", // Bright red matching Image 1
      dotClass: "bg-[#ef4444]",
    },
    {
      label: "Returned",
      count: returnedCount,
      pct: `${((returnedCount / total) * 100).toFixed(1)}%`,
      color: "#9ca3af", // Neutral gray matching Image 1
      dotClass: "bg-[#9ca3af]",
    },
  ];

  // SVG Donut calculation - 168px diameter, 25px stroke, 71.5px radius
  const size = 168;
  const baseStrokeWidth = 25;
  const radius = (size - baseStrokeWidth) / 2; // 71.5
  const circumference = 2 * Math.PI * radius; // 449.24

  // Start at exact 12 o'clock (-90 deg), sweep clockwise
  let accumulatedAngle = -90;

  return (
    <div className="flex flex-col sm:flex-row items-center justify-between gap-6">
      {/* Donut graphic */}
      <div className="relative w-[168px] h-[168px] shrink-0 flex items-center justify-center">
        <svg
          width={size}
          height={size}
          viewBox={`0 0 ${size} ${size}`}
          className={`overflow-visible transition-transform duration-700 ease-out outline-none select-none ${
            isSpinning ? "rotate-[360deg]" : ""
          }`}
          style={{ outline: "none" }}
        >
          {categories.map((cat, i) => {
            const segmentShare = cat.count / total;
            const segmentLength = segmentShare * circumference;
            const rotation = accumulatedAngle;
            accumulatedAngle += segmentShare * 360;

            if (segmentShare <= 0) return null;

            const isHovered = hoveredCategory?.label === cat.label;
            const isDimmed = hoveredCategory && !isHovered;
            const isFilterActive = selectedStatus === cat.label;

            return (
              <circle
                key={i}
                cx={size / 2}
                cy={size / 2}
                r={radius}
                fill="transparent"
                stroke={cat.color}
                strokeWidth={isHovered ? baseStrokeWidth + 4 : baseStrokeWidth}
                strokeDasharray={
                  mounted ? `${segmentLength} ${circumference}` : `0 ${circumference}`
                }
                strokeDashoffset={0}
                transform={`rotate(${rotation} ${size / 2} ${size / 2})`}
                className="cursor-pointer transition-all duration-500 ease-out outline-none focus:outline-none"
                style={{
                  opacity: isDimmed ? 0.45 : 1,
                  filter:
                    isHovered || isFilterActive
                      ? `drop-shadow(0 0 6px ${cat.color}99)`
                      : "none",
                  outline: "none",
                }}
                onMouseEnter={() => setHoveredCategory(cat)}
                onMouseLeave={() => setHoveredCategory(null)}
                onClick={() => onSelectStatus?.(selectedStatus === cat.label ? null : cat.label)}
              />
            );
          })}
        </svg>

        {/* Center label with dynamic animation */}
        <div className="absolute inset-0 flex flex-col items-center justify-center pointer-events-none text-center select-none">
          <span
            className={`font-bold leading-none tracking-tight transition-all duration-200 ${
              hoveredCategory ? "text-[30px] scale-105" : "text-[28px] text-neutral-900"
            }`}
            style={{ color: hoveredCategory ? hoveredCategory.color : "#111827" }}
          >
            {hoveredCategory ? hoveredCategory.count : animatedCount}
          </span>
          <span
            className="text-[13px] font-normal mt-1 leading-tight transition-colors duration-200"
            style={{ color: hoveredCategory ? hoveredCategory.color : "#6b7280" }}
          >
            {hoveredCategory ? hoveredCategory.label : "Orders"}
          </span>
        </div>
      </div>

      {/* Legend list on right matching Image 1 layout */}
      <div className="flex-1 w-full space-y-3">
        {categories.map((cat) => {
          const isSelected = selectedStatus === cat.label;
          const isHovered = hoveredCategory?.label === cat.label;

          return (
            <button
              key={cat.label}
              type="button"
              onMouseEnter={() => setHoveredCategory(cat)}
              onMouseLeave={() => setHoveredCategory(null)}
              onClick={() => onSelectStatus?.(isSelected ? null : cat.label)}
              className={`w-full flex items-center justify-between text-xs py-1 px-2 rounded-xl transition-all text-left cursor-pointer group outline-none focus:outline-none focus-visible:ring-2 focus-visible:ring-black/10 ${
                isSelected
                  ? "bg-neutral-100 font-bold shadow-2xs"
                  : isHovered
                  ? "bg-neutral-50 scale-[1.02]"
                  : "hover:bg-neutral-50/70"
              }`}
            >
              <div className="flex items-center gap-2.5 min-w-0">
                <span
                  className={`w-2.5 h-2.5 rounded-full ${cat.dotClass} shrink-0 transition-transform duration-200 ${
                    isHovered ? "scale-125 ring-2 ring-offset-1 ring-black/10" : ""
                  }`}
                />
                <span className="text-[13px] font-medium text-neutral-700 truncate group-hover:text-neutral-900">
                  {cat.label}
                </span>
              </div>
              <div className="flex items-center gap-5 shrink-0 text-[13px]">
                <span className="text-neutral-900 font-bold w-4 text-right">
                  {cat.count}
                </span>
                <span className="text-neutral-400 font-normal w-12 text-right">
                  {cat.pct}
                </span>
              </div>
            </button>
          );
        })}
      </div>
    </div>
  );
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

  return (
    <div className="relative inline-block text-left" ref={ref}>
      <button
        onClick={(e) => {
          e.stopPropagation();
          setOpen(!open);
        }}
        className="w-8 h-8 rounded-lg border border-neutral-200/80 bg-white hover:bg-neutral-50
          hover:border-neutral-300 flex items-center justify-center text-neutral-400 hover:text-neutral-700
          transition-colors shadow-2xs cursor-pointer focus:outline-none"
        aria-label={`Actions for order ${order.id}`}
        aria-expanded={open}
      >
        <MoreHorizontal size={14} />
      </button>

      {open && (
        <div
          className="absolute right-0 top-full mt-1.5 w-52 bg-white rounded-xl border
            border-neutral-200 shadow-xl py-1.5 z-40 text-xs font-medium text-neutral-700"
          role="menu"
          onClick={(e) => e.stopPropagation()}
        >
          <button
            onClick={() => {
              setOpen(false);
              if (onInspectOrder) {
                onInspectOrder(order);
              }
            }}
            className="w-full text-left px-3.5 py-2 hover:bg-neutral-50 flex items-center gap-2 font-semibold text-neutral-900 cursor-pointer"
          >
            <Eye size={13} className="text-amber-600" /> Deep Inspect Order
          </button>

          {onDownloadSlip && (
            <button
              onClick={() => {
                setOpen(false);
                onDownloadSlip(order);
              }}
              className="w-full text-left px-3.5 py-1.5 hover:bg-neutral-50 flex items-center gap-2 text-neutral-700 cursor-pointer"
            >
              <Download size={13} className="text-neutral-400" /> Download Invoice Slip
            </button>
          )}

          {onCopyId && (
            <button
              onClick={() => {
                setOpen(false);
                onCopyId(order.id);
              }}
              className="w-full text-left px-3.5 py-1.5 hover:bg-neutral-50 flex items-center gap-2 text-neutral-700 cursor-pointer"
            >
              <FileSpreadsheet size={13} className="text-neutral-400" /> Copy Order ID
            </button>
          )}

          <div className="my-1 border-t border-neutral-100" />
          <div className="px-3 py-1 text-[10px] font-bold text-neutral-400 uppercase tracking-wider">
            Quick Status Transition
          </div>
          <button
            onClick={() => {
              onUpdateStatus(order.id, "Delivered");
              setOpen(false);
            }}
            className="w-full text-left px-3.5 py-1.5 hover:bg-neutral-50 flex items-center gap-2 text-emerald-600 cursor-pointer"
          >
            <CheckCircle size={13} /> Mark Delivered
          </button>
          <button
            onClick={() => {
              onUpdateStatus(order.id, "Processing");
              setOpen(false);
            }}
            className="w-full text-left px-3.5 py-1.5 hover:bg-neutral-50 flex items-center gap-2 text-amber-600 cursor-pointer"
          >
            <Clock size={13} /> Mark Processing
          </button>
          <button
            onClick={() => {
              onUpdateStatus(order.id, "Shipped");
              setOpen(false);
            }}
            className="w-full text-left px-3.5 py-1.5 hover:bg-neutral-50 flex items-center gap-2 text-blue-600 cursor-pointer"
          >
            <RotateCcw size={13} /> Mark Shipped
          </button>
          <button
            onClick={() => {
              onUpdateStatus(order.id, "Cancelled");
              setOpen(false);
            }}
            className="w-full text-left px-3.5 py-1.5 hover:bg-neutral-50 flex items-center gap-2 text-red-600 cursor-pointer"
          >
            <AlertTriangle size={13} /> Cancel Order
          </button>
        </div>
      )}
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
  const [toastMessage, setToastMessage] = useState<string | null>(null);

  // Keyboard Escape listener
  useEffect(() => {
    function handleKeyDown(e: KeyboardEvent) {
      if (e.key === "Escape") onClose();
    }
    if (isOpen) {
      document.body.style.overflow = "hidden";
      window.addEventListener("keydown", handleKeyDown);
    }
    return () => {
      document.body.style.overflow = "unset";
      window.removeEventListener("keydown", handleKeyDown);
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

  const showToast = (msg: string) => {
    setToastMessage(msg);
    setTimeout(() => {
      setToastMessage(null);
    }, 4000);
  };

  const handleApproveRefund = (orderId: string, customerName: string, amount: number) => {
    onReviewReturn(orderId, "approved", `Full refund of ₹${amount.toLocaleString("en-IN")} initiated to original payment method.`);
    showToast(`✅ Approved refund of ₹${amount.toLocaleString("en-IN")} for ${customerName}`);
  };

  const handleApproveExchange = (orderId: string, customerName: string) => {
    onReviewReturn(orderId, "approved", "Exchange approved. Replacement order queued for warehouse fulfillment.");
    showToast(`🔄 Exchange approved for ${customerName}. Replacement order initiated.`);
  };

  const handleConfirmReject = (orderId: string, customerName: string) => {
    const finalReason = rejectReason.trim() || "Item does not meet return policy requirements (worn / tags removed).";
    onReviewReturn(orderId, "rejected", finalReason);
    setRejectingOrderId(null);
    setRejectReason("");
    showToast(`✕ Return request for ${customerName} was rejected.`);
  };

  if (!isOpen) return null;

  const totalRefundExposure = pendingRequests.reduce((sum, r) => sum + r.item.price, 0);

  return (
    <div 
      className="fixed inset-0 z-50 flex items-center justify-center p-3 sm:p-6 bg-black/60 backdrop-blur-xs animate-in fade-in duration-200"
      onClick={onClose}
    >
      <div
        className="bg-white rounded-3xl max-w-2xl w-full my-auto shadow-2xl border border-black/10 overflow-hidden flex flex-col max-h-[90vh] animate-in zoom-in-95 duration-200"
        role="dialog"
        aria-modal="true"
        aria-label="Return Requests Review Modal"
        onClick={(e) => e.stopPropagation()}
      >
        {/* Toast Alert */}
        {toastMessage && (
          <div className="bg-neutral-900 text-white px-4 py-2.5 text-xs font-semibold text-center flex items-center justify-center gap-2 animate-in slide-in-from-top duration-200">
            <span>{toastMessage}</span>
          </div>
        )}

        {/* Modal Header */}
        <div className="px-6 py-5 border-b border-neutral-100 flex items-center justify-between bg-neutral-50/60">
          <div className="flex items-center gap-3.5">
            <div className="w-11 h-11 rounded-2xl bg-amber-500/15 border border-amber-500/25 flex items-center justify-center text-amber-800 shrink-0 shadow-2xs">
              <RotateCcw size={20} strokeWidth={2.2} />
            </div>
            <div>
              <div className="flex items-center gap-2">
                <h2 className="text-lg font-bold text-neutral-900 tracking-tight leading-tight">
                  Return Requests Review
                </h2>
                {pendingRequests.length > 0 && (
                  <span className="px-2 py-0.5 rounded-full text-[11px] font-bold bg-amber-100 text-amber-900 border border-amber-200/80">
                    {pendingRequests.length} Pending
                  </span>
                )}
              </div>
              <p className="text-xs text-neutral-500 font-normal mt-0.5">
                Review return reasons, approve instant refunds, or dispatch replacements
              </p>
            </div>
          </div>

          <button
            onClick={onClose}
            className="w-9 h-9 rounded-xl hover:bg-neutral-200/70 text-neutral-400 hover:text-neutral-700 flex items-center justify-center transition-colors cursor-pointer outline-none"
            aria-label="Close modal"
          >
            <X size={18} />
          </button>
        </div>

        {/* Modal Sub-Header Tabs */}
        <div className="px-6 py-2.5 border-b border-neutral-100 bg-white flex items-center justify-between gap-3 text-xs">
          <div className="flex items-center gap-2">
            <button
              type="button"
              onClick={() => setActiveTab("pending")}
              className={`px-3.5 py-1.5 rounded-xl font-bold transition-all cursor-pointer flex items-center gap-2 ${
                activeTab === "pending"
                  ? "bg-amber-500 text-white shadow-xs"
                  : "bg-neutral-100 text-neutral-600 hover:bg-neutral-200/80"
              }`}
            >
              <span>Pending Review</span>
              <span className={`px-1.5 py-0.2 rounded-full text-[10px] font-extrabold ${
                activeTab === "pending" ? "bg-amber-600 text-white" : "bg-neutral-200 text-neutral-800"
              }`}>
                {pendingRequests.length}
              </span>
            </button>

            <button
              type="button"
              onClick={() => setActiveTab("resolved")}
              className={`px-3.5 py-1.5 rounded-xl font-bold transition-all cursor-pointer flex items-center gap-2 ${
                activeTab === "resolved"
                  ? "bg-neutral-900 text-white shadow-xs"
                  : "bg-neutral-100 text-neutral-600 hover:bg-neutral-200/80"
              }`}
            >
              <span>Resolved History</span>
              <span className={`px-1.5 py-0.2 rounded-full text-[10px] font-extrabold ${
                activeTab === "resolved" ? "bg-neutral-800 text-white" : "bg-neutral-200 text-neutral-800"
              }`}>
                {resolvedRequests.length}
              </span>
            </button>
          </div>

          {activeTab === "pending" && pendingRequests.length > 0 && (
            <div className="text-[11px] text-neutral-500 hidden sm:block">
              Refund Exposure: <strong className="text-neutral-900 font-bold">₹{totalRefundExposure.toLocaleString("en-IN")}</strong>
            </div>
          )}
        </div>

        {/* Modal Body */}
        <div className="p-6 overflow-y-auto space-y-5 flex-1 bg-neutral-50/30">
          {activeTab === "pending" ? (
            pendingRequests.length === 0 ? (
              <div className="py-12 text-center">
                <div className="w-16 h-16 rounded-full bg-emerald-100 text-emerald-700 flex items-center justify-center mx-auto mb-3 text-2xl shadow-xs">
                  ✓
                </div>
                <h3 className="text-base font-bold text-neutral-900">
                  All Return Requests Resolved!
                </h3>
                <p className="text-xs text-neutral-500 max-w-sm mx-auto mt-1 mb-5">
                  You have reviewed and processed every customer return request. Your customer service queue is 100% up to date.
                </p>
                <div className="flex items-center justify-center gap-3">
                  {resolvedRequests.length > 0 && (
                    <button
                      type="button"
                      onClick={() => setActiveTab("resolved")}
                      className="px-4 py-2 rounded-xl bg-neutral-100 hover:bg-neutral-200 text-neutral-800 text-xs font-bold transition-all cursor-pointer"
                    >
                      View Resolved History ({resolvedRequests.length})
                    </button>
                  )}
                  <button
                    onClick={onClose}
                    className="px-5 py-2 rounded-xl bg-black text-white text-xs font-bold hover:bg-neutral-800 transition-all cursor-pointer shadow-xs"
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
                    className="bg-white rounded-2xl border border-neutral-200/90 shadow-2xs hover:shadow-xs transition-all overflow-hidden"
                  >
                    {/* Item Top Header */}
                    <div className="px-5 py-3.5 bg-neutral-50/80 border-b border-neutral-100 flex flex-wrap items-center justify-between gap-2">
                      <div className="flex items-center gap-2.5">
                        <span className="font-mono text-xs font-bold text-neutral-900 bg-white px-2.5 py-1 rounded-lg border border-neutral-200 shadow-2xs">
                          {req.orderId}
                        </span>
                        <span className="text-[11px] text-neutral-400">
                          Requested: <strong className="text-neutral-600 font-medium">{req.requestedAt}</strong>
                        </span>
                      </div>

                      <div className="flex items-center gap-2">
                        <span className="inline-flex items-center gap-1.5 px-2 py-0.5 rounded-full text-[11px] font-semibold bg-amber-50 text-amber-800 border border-amber-200/60">
                          <span className="w-1.5 h-1.5 rounded-full bg-amber-500 animate-pulse" />
                          Pending Review
                        </span>
                        <span className="text-sm font-extrabold text-neutral-900">
                          ₹{req.item.price.toLocaleString("en-IN")}
                        </span>
                      </div>
                    </div>

                    <div className="p-5 space-y-4">
                      {/* Customer Row */}
                      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-3 pb-3 border-b border-neutral-100">
                        <div className="flex items-center gap-3">
                          <div className={`w-9 h-9 rounded-full ${avatar.bg} ${avatar.text} flex items-center justify-center font-bold text-xs shrink-0`}>
                            {avatar.initial}
                          </div>
                          <div>
                            <div className="text-xs font-bold text-neutral-900">
                              {req.customerName}
                            </div>
                            <div className="text-[11px] text-neutral-400 truncate max-w-xs">
                              {req.customerAddress}
                            </div>
                          </div>
                        </div>

                        {/* Contact Actions */}
                        <div className="flex items-center gap-2 shrink-0">
                          <a
                            href={`tel:${req.customerPhone.replace(/\s+/g, "")}`}
                            className="px-2.5 py-1 rounded-lg border border-neutral-200 bg-white hover:bg-neutral-50 text-[11px] font-semibold text-neutral-700 flex items-center gap-1 transition-colors"
                          >
                            <Phone size={11} className="text-neutral-500" />
                            <span>Call</span>
                          </a>
                          <a
                            href={`https://wa.me/${req.customerPhone.replace(/[^0-9]/g, "")}?text=Hi%20${encodeURIComponent(req.customerName)},%20this%20is%20VEYRO%20Support%20regarding%20your%20return%20request%20for%20order%20${req.orderId}.`}
                            target="_blank"
                            rel="noopener noreferrer"
                            className="px-2.5 py-1 rounded-lg border border-emerald-200 bg-emerald-50/80 hover:bg-emerald-100 text-[11px] font-semibold text-emerald-800 flex items-center gap-1 transition-colors"
                          >
                            <MessageSquare size={11} className="text-emerald-600" />
                            <span>WhatsApp</span>
                          </a>
                        </div>
                      </div>

                      {/* Product Card Row */}
                      <div className="flex items-center gap-3.5 bg-neutral-50/70 p-3 rounded-xl border border-neutral-100">
                        <div className="relative w-12 h-12 rounded-xl bg-white border border-neutral-200 overflow-hidden shrink-0">
                          <Image
                            src={req.item.image}
                            alt={req.item.name}
                            fill
                            className="object-cover"
                          />
                        </div>
                        <div className="min-w-0 flex-1">
                          <div className="text-xs font-bold text-neutral-900 truncate">
                            {req.item.name}
                          </div>
                          <div className="text-[11px] text-neutral-500 mt-0.5">
                            {req.item.details} • Qty: {req.item.quantity}
                          </div>
                        </div>
                        <div className="text-right shrink-0">
                          <div className="text-xs font-bold text-neutral-900">
                            ₹{req.item.price.toLocaleString("en-IN")}
                          </div>
                          <div className="text-[10px] text-neutral-400 capitalize">
                            {req.paymentMethod}
                          </div>
                        </div>
                      </div>

                      {/* Customer Return Reason Box */}
                      <div className="bg-[#fffbeb] border border-[#fde68a] rounded-xl p-3.5 text-xs text-amber-950">
                        <div className="flex items-center gap-1.5 font-bold text-amber-900 mb-1">
                          <AlertTriangle size={13} className="text-amber-600 shrink-0" />
                          <span>Return Reason: {req.reason}</span>
                        </div>
                        {req.details && (
                          <p className="text-[11px] text-amber-900/90 leading-relaxed pl-4 border-l-2 border-amber-400/80 ml-1 italic mt-1.5">
                            &quot;{req.details}&quot;
                          </p>
                        )}
                      </div>

                      {/* Reject Dialog Form */}
                      {isRejecting ? (
                        <div className="bg-rose-50/70 border border-rose-200 rounded-xl p-3.5 space-y-3 animate-in fade-in duration-150">
                          <div className="text-xs font-bold text-rose-900">
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
                                className={`px-2.5 py-1 rounded-lg text-[10px] font-medium transition-colors cursor-pointer ${
                                  rejectReason === pre
                                    ? "bg-rose-600 text-white font-bold"
                                    : "bg-white text-rose-800 border border-rose-200 hover:bg-rose-100"
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
                            className="w-full text-xs px-3 py-2 bg-white rounded-lg border border-rose-200 focus:outline-none focus:ring-1 focus:ring-rose-500"
                          />
                          <div className="flex items-center justify-end gap-2 pt-1">
                            <button
                              type="button"
                              onClick={() => {
                                setRejectingOrderId(null);
                                setRejectReason("");
                              }}
                              className="px-3 py-1.5 text-xs text-neutral-600 hover:text-neutral-900 font-semibold cursor-pointer"
                            >
                              Cancel
                            </button>
                            <button
                              type="button"
                              onClick={() => handleConfirmReject(req.orderId, req.customerName)}
                              className="px-4 py-1.5 bg-rose-600 hover:bg-rose-700 text-white text-xs font-bold rounded-lg shadow-2xs transition-all cursor-pointer"
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
                            className="flex-1 min-w-[170px] bg-emerald-600 hover:bg-emerald-700 text-white py-2.5 px-3.5 rounded-xl text-xs font-bold flex items-center justify-center gap-1.5 shadow-2xs transition-all cursor-pointer"
                          >
                            <CheckCircle2 size={14} />
                            <span>Approve & Refund ₹{req.item.price.toLocaleString("en-IN")}</span>
                          </button>

                          <button
                            type="button"
                            onClick={() => handleApproveExchange(req.orderId, req.customerName)}
                            className="bg-neutral-900 hover:bg-black text-white py-2.5 px-4 rounded-xl text-xs font-semibold flex items-center justify-center gap-1.5 shadow-2xs transition-all cursor-pointer"
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
                            className="bg-neutral-100 hover:bg-rose-50 hover:text-rose-700 text-neutral-600 py-2.5 px-3.5 rounded-xl text-xs font-semibold transition-colors cursor-pointer"
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
              <div className="py-12 text-center text-neutral-500 text-xs">
                No processed returns in history yet. Review pending requests to populate audit log.
              </div>
            ) : (
              resolvedRequests.map((req) => {
                const avatar = getCustomerAvatar(req.customerName);
                const isApproved = req.status === "approved";

                return (
                  <div
                    key={req.orderId}
                    className="bg-white rounded-2xl border border-neutral-200/90 shadow-2xs p-4 space-y-3"
                  >
                    <div className="flex items-center justify-between gap-2 border-b border-neutral-100 pb-3">
                      <div className="flex items-center gap-2.5">
                        <span className="font-mono text-xs font-bold text-neutral-900 bg-neutral-50 px-2 py-0.5 rounded border border-neutral-200">
                          {req.orderId}
                        </span>
                        <span className="text-xs font-semibold text-neutral-900">
                          {req.customerName}
                        </span>
                      </div>
                      <span
                        className={`inline-flex items-center gap-1 px-2.5 py-0.5 rounded-full text-[11px] font-bold ${
                          isApproved
                            ? "bg-emerald-50 text-emerald-800 border border-emerald-200"
                            : "bg-rose-50 text-rose-800 border border-rose-200"
                        }`}
                      >
                        {isApproved ? "✓ Approved" : "✕ Rejected"}
                      </span>
                    </div>

                    <div className="flex items-center gap-3">
                      <div className="relative w-10 h-10 rounded-lg overflow-hidden bg-neutral-100 shrink-0 border border-neutral-200">
                        <Image src={req.item.image} alt={req.item.name} fill className="object-cover" />
                      </div>
                      <div className="min-w-0 flex-1 text-xs">
                        <div className="font-bold text-neutral-900 truncate">{req.item.name}</div>
                        <div className="text-neutral-500 text-[11px]">{req.item.details} • ₹{req.item.price.toLocaleString("en-IN")}</div>
                      </div>
                    </div>

                    <div className="text-[11px] bg-neutral-50 p-2.5 rounded-xl border border-neutral-100 text-neutral-700">
                      <span className="font-semibold text-neutral-900">Resolution Note: </span>
                      {req.details || "Processed by administrator"}
                    </div>
                  </div>
                );
              })
            )
          )}
        </div>

        {/* Modal Footer */}
        <div className="px-6 py-4 border-t border-neutral-100 bg-neutral-50/80 flex flex-col sm:flex-row sm:items-center justify-between gap-3 text-xs">
          <div className="text-neutral-500">
            {pendingRequests.length > 0 ? (
              <>
                Total pending refund exposure:{" "}
                <strong className="text-neutral-900 font-bold">
                  ₹{totalRefundExposure.toLocaleString("en-IN")}
                </strong>{" "}
                across {pendingRequests.length} item{pendingRequests.length === 1 ? "" : "s"}
              </>
            ) : (
              <span className="text-emerald-700 font-semibold">
                ✓ All customer returns processed &amp; synchronized.
              </span>
            )}
          </div>
          <Link
            href="/admin/orders"
            onClick={onClose}
            className="text-amber-800 hover:text-amber-950 font-bold flex items-center gap-1 hover:underline"
          >
            <span>View Full Orders Manager</span>
            <ArrowRight size={13} />
          </Link>
        </div>
      </div>
    </div>
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
}: {
  product: TopProductItem | null;
  onClose: () => void;
  orders: OrderRecord[];
  onUpdateStock: (productId: string, newStock: number) => void;
  onUpdatePrice: (productId: string, newPrice: number) => void;
  showToast: (msg: string) => void;
}) {
  const [activeTab, setActiveTab] = useState<"variants" | "orders" | "actions">("variants");
  const [stockInput, setStockInput] = useState<number>(product ? product.stock : 0);
  const [priceInput, setPriceInput] = useState<number>(product ? product.unitPrice : 0);

  // Sync inputs whenever selected product changes
  useEffect(() => {
    if (product) {
      setStockInput(product.stock);
      setPriceInput(product.unitPrice);
      setActiveTab("variants");
    }
  }, [product]);

  // Keyboard Escape listener & scroll lock
  useEffect(() => {
    function handleKeyDown(e: KeyboardEvent) {
      if (e.key === "Escape") onClose();
    }
    if (product) {
      document.body.style.overflow = "hidden";
      window.addEventListener("keydown", handleKeyDown);
    }
    return () => {
      document.body.style.overflow = "";
      window.removeEventListener("keydown", handleKeyDown);
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
        it.productId === product.id
    )
  );

  // Calculated live gross margin based on priceInput
  const simulatedMargin = priceInput > 0
    ? Math.round(((priceInput - product.cogs) / priceInput) * 1000) / 10
    : 0;

  const handleStockSave = () => {
    onUpdateStock(product.id, stockInput);
    showToast(`✅ Stock updated to ${stockInput} units for ${product.name}`);
  };

  const handlePriceSave = () => {
    onUpdatePrice(product.id, priceInput);
    showToast(`✅ Retail price set to ₹${priceInput.toLocaleString("en-IN")} (${simulatedMargin}% margin)`);
  };

  const handleDownloadCSV = () => {
    downloadProductCSV(product);
    showToast(`📥 Performance report downloaded for ${product.name}`);
  };

  return (
    <div
      className="fixed inset-0 z-[80] bg-black/60 backdrop-blur-xs flex items-center justify-center p-3 sm:p-5 overflow-y-auto animate-in fade-in duration-150"
      onClick={onClose}
    >
      <div
        className="bg-white rounded-[26px] shadow-2xl border border-black/[0.06] max-w-3xl w-full overflow-hidden flex flex-col my-auto max-h-[92vh] animate-in zoom-in-95 duration-150"
        onClick={(e) => e.stopPropagation()}
      >
        {/* Header */}
        <div className="p-5 sm:p-6 bg-gradient-to-b from-neutral-50/80 to-white border-b border-black/[0.05] flex items-center justify-between gap-4">
          <div className="flex items-center gap-4 min-w-0">
            <div className="w-14 h-14 rounded-2xl bg-neutral-100 border border-neutral-200/80 overflow-hidden shrink-0 shadow-2xs relative">
              <Image
                src={product.imageUrl}
                alt={product.name}
                width={56}
                height={56}
                className="w-full h-full object-cover"
              />
            </div>
            <div className="min-w-0">
              <div className="flex flex-wrap items-center gap-2 mb-1">
                <span className="text-[11px] font-black uppercase tracking-wider bg-amber-100 text-amber-900 px-2 py-0.5 rounded-md">
                  #{product.rank} Best Seller
                </span>
                <span className="text-[11px] font-medium text-neutral-500 bg-neutral-100 px-2 py-0.5 rounded-md">
                  {product.sku}
                </span>
                <span className="text-[11px] font-semibold text-neutral-700 bg-neutral-100 px-2 py-0.5 rounded-md">
                  {product.category}
                </span>
                {product.stock <= 10 ? (
                  <span className="inline-flex items-center gap-1 text-[11px] font-bold text-amber-800 bg-amber-50 border border-amber-200/80 px-2 py-0.5 rounded-md">
                    <AlertTriangle size={12} strokeWidth={2.4} className="text-amber-600 shrink-0" />
                    Low Stock ({product.stock} left)
                  </span>
                ) : (
                  <span className="inline-flex items-center gap-1.5 text-[11px] font-semibold text-emerald-800 bg-emerald-50 border border-emerald-200/60 px-2 py-0.5 rounded-md">
                    <span className="w-1.5 h-1.5 rounded-full bg-emerald-500 shrink-0" />
                    {product.stock} in warehouse
                  </span>
                )}
              </div>
              <h2 className="text-lg sm:text-xl font-bold text-neutral-900 truncate">
                {product.name}
              </h2>
            </div>
          </div>

          <div className="flex items-center gap-2 shrink-0">
            <a
              href={`/product/${product.slug}`}
              target="_blank"
              rel="noreferrer"
              className="hidden sm:flex items-center gap-1.5 px-3 py-2 rounded-xl bg-neutral-100 hover:bg-neutral-200 text-neutral-800 text-xs font-semibold transition-all cursor-pointer"
              title="Open customer view in store"
            >
              <span>Live Store</span>
              <ExternalLink size={13} />
            </a>

            <button
              onClick={handleDownloadCSV}
              className="p-2 rounded-xl bg-neutral-100 hover:bg-neutral-200 text-neutral-700 transition-colors cursor-pointer"
              title="Export CSV Report"
            >
              <FileSpreadsheet size={16} />
            </button>

            <button
              onClick={onClose}
              className="p-2 rounded-xl hover:bg-neutral-100 text-neutral-400 hover:text-neutral-700 transition-colors cursor-pointer"
              title="Close (Esc)"
            >
              <X size={18} />
            </button>
          </div>
        </div>

        {/* 4-Card Hero Metrics */}
        <div className="grid grid-cols-2 sm:grid-cols-4 gap-3 p-5 sm:p-6 bg-[#faf9f6]/60 border-b border-black/[0.04]">
          <div className="bg-white p-3.5 rounded-2xl border border-black/[0.04] shadow-2xs">
            <div className="flex items-center justify-between text-neutral-400 text-xs font-medium mb-1">
              <span>Gross Revenue</span>
              <IndianRupee size={13} className="text-amber-600" />
            </div>
            <div className="text-base sm:text-lg font-bold text-neutral-900">
              ₹{product.revenue.toLocaleString("en-IN")}
            </div>
            <div className="text-[11px] text-emerald-600 font-semibold mt-0.5 flex items-center gap-0.5">
              <TrendingUp size={11} />
              <span>+{product.growth}% vs prev</span>
            </div>
          </div>

          <div className="bg-white p-3.5 rounded-2xl border border-black/[0.04] shadow-2xs">
            <div className="flex items-center justify-between text-neutral-400 text-xs font-medium mb-1">
              <span>Units Sold</span>
              <Package size={13} className="text-blue-600" />
            </div>
            <div className="text-base sm:text-lg font-bold text-neutral-900">
              {product.soldCount} units
            </div>
            <div className="text-[11px] text-neutral-500 font-normal mt-0.5">
              ~{(product.soldCount / 30).toFixed(1)} units/day
            </div>
          </div>

          <div className="bg-white p-3.5 rounded-2xl border border-black/[0.04] shadow-2xs">
            <div className="flex items-center justify-between text-neutral-400 text-xs font-medium mb-1">
              <span>Unit Margin</span>
              <Percent size={13} className="text-emerald-600" />
            </div>
            <div className="text-base sm:text-lg font-bold text-neutral-900">
              {product.marginPercent}%
            </div>
            <div className="text-[11px] text-neutral-500 font-normal mt-0.5">
              Cost: ₹{product.cogs} • Price: ₹{product.unitPrice}
            </div>
          </div>

          <div className="bg-white p-3.5 rounded-2xl border border-black/[0.04] shadow-2xs">
            <div className="flex items-center justify-between text-neutral-400 text-xs font-medium mb-1">
              <span>Warehouse Stock</span>
              <Boxes size={13} className="text-purple-600" />
            </div>
            <div className="text-base sm:text-lg font-bold text-neutral-900">
              {product.stock} units
            </div>
            <div className="text-[11px] text-neutral-500 font-normal mt-0.5">
              ~{Math.max(4, Math.round(product.stock / 1.4))} days supply
            </div>
          </div>
        </div>

        {/* Tab Navigation */}
        <div className="flex border-b border-black/[0.05] px-6 bg-white gap-2">
          <button
            onClick={() => setActiveTab("variants")}
            className={`py-3 px-3 text-xs font-bold border-b-2 transition-all cursor-pointer flex items-center gap-1.5 ${
              activeTab === "variants"
                ? "border-amber-600 text-amber-900"
                : "border-transparent text-neutral-400 hover:text-neutral-700"
            }`}
          >
            <Layers size={13} />
            <span>Size &amp; Variant Breakdown</span>
          </button>

          <button
            onClick={() => setActiveTab("orders")}
            className={`py-3 px-3 text-xs font-bold border-b-2 transition-all cursor-pointer flex items-center gap-1.5 ${
              activeTab === "orders"
                ? "border-amber-600 text-amber-900"
                : "border-transparent text-neutral-400 hover:text-neutral-700"
            }`}
          >
            <ShoppingCart size={13} />
            <span>Customer Orders ({matchingOrders.length})</span>
          </button>

          <button
            onClick={() => setActiveTab("actions")}
            className={`py-3 px-3 text-xs font-bold border-b-2 transition-all cursor-pointer flex items-center gap-1.5 ${
              activeTab === "actions"
                ? "border-amber-600 text-amber-900"
                : "border-transparent text-neutral-400 hover:text-neutral-700"
            }`}
          >
            <SlidersHorizontal size={13} />
            <span>Quick Restock &amp; Pricing</span>
          </button>
        </div>

        {/* Tab Content */}
        <div className="p-5 sm:p-6 overflow-y-auto flex-1 bg-white space-y-4">
          {activeTab === "variants" && (
            <div className="space-y-4">
              <div className="border border-neutral-100 rounded-2xl overflow-hidden shadow-2xs">
                <table className="w-full text-left text-xs">
                  <thead className="bg-neutral-50/80 text-neutral-400 font-semibold border-b border-neutral-100">
                    <tr>
                      <th className="py-2.5 px-4">Variant / Size</th>
                      <th className="py-2.5 px-4 text-center">Share</th>
                      <th className="py-2.5 px-4 text-center">Units Sold</th>
                      <th className="py-2.5 px-4 text-right">Revenue</th>
                      <th className="py-2.5 px-4 text-right">Available Stock</th>
                    </tr>
                  </thead>
                  <tbody className="divide-y divide-neutral-100">
                    {product.variants.map((v) => {
                      const sharePct = product.soldCount > 0 ? Math.round((v.sold / product.soldCount) * 100) : 0;
                      return (
                        <tr key={v.size} className="hover:bg-neutral-50/50 transition-colors">
                          <td className="py-3 px-4 font-semibold text-neutral-900 flex items-center gap-2">
                            <span>{v.size}</span>
                            {v.isBestseller && (
                              <span className="text-[10px] font-bold text-amber-800 bg-amber-100 px-1.5 py-0.2 rounded-md">
                                ★ Bestseller Size
                              </span>
                            )}
                          </td>
                          <td className="py-3 px-4 text-center">
                            <div className="flex items-center justify-center gap-1.5">
                              <div className="w-16 bg-neutral-100 h-1.5 rounded-full overflow-hidden">
                                <div
                                  className="h-full bg-amber-500 rounded-full"
                                  style={{ width: `${sharePct}%` }}
                                />
                              </div>
                              <span className="text-[11px] text-neutral-500 font-medium">{sharePct}%</span>
                            </div>
                          </td>
                          <td className="py-3 px-4 text-center font-bold text-neutral-800">
                            {v.sold}
                          </td>
                          <td className="py-3 px-4 text-right font-bold text-neutral-900">
                            ₹{v.revenue.toLocaleString("en-IN")}
                          </td>
                          <td className="py-3 px-4 text-right">
                            <span
                              className={`px-2 py-0.5 rounded-md text-[11px] font-semibold ${
                                v.stock <= 4
                                  ? "bg-rose-50 text-rose-700 border border-rose-200/50"
                                  : v.stock <= 8
                                  ? "bg-amber-50 text-amber-700 border border-amber-200/50"
                                  : "bg-emerald-50 text-emerald-700"
                              }`}
                            >
                              {v.stock} in stock
                            </span>
                          </td>
                        </tr>
                      );
                    })}
                  </tbody>
                </table>
              </div>

              {/* Quality & Return benchmark pill */}
              <div className="p-4 rounded-2xl bg-[#fff8e7]/70 border border-amber-200/60 flex flex-col sm:flex-row items-start sm:items-center justify-between gap-3 text-xs">
                <div className="flex items-center gap-3">
                  <div className="w-9 h-9 rounded-xl bg-amber-100 text-amber-700 flex items-center justify-center shrink-0">
                    <ShieldCheck size={18} />
                  </div>
                  <div>
                    <div className="font-bold text-neutral-900">
                      Exceptional Retail Quality Rating
                    </div>
                    <div className="text-neutral-500 text-[11px] mt-0.5">
                      Return Rate: <strong className="text-neutral-800">{product.returnRate}%</strong> (Standard apparel baseline: 8.5%) • Verified Rating: <strong className="text-neutral-800">★ {product.rating} / 5.0</strong> ({product.reviewCount} customer reviews)
                    </div>
                  </div>
                </div>
                <button
                  type="button"
                  onClick={handleDownloadCSV}
                  className="px-3 py-1.5 rounded-xl bg-white hover:bg-neutral-50 border border-amber-300 text-amber-900 font-semibold text-xs transition-all shadow-2xs cursor-pointer shrink-0"
                >
                  Export Size Metrics (CSV)
                </button>
              </div>
            </div>
          )}

          {activeTab === "orders" && (
            <div className="space-y-3">
              {matchingOrders.length > 0 ? (
                matchingOrders.map((order) => (
                  <div
                    key={order.id}
                    className="p-3.5 rounded-2xl border border-neutral-100 bg-neutral-50/40 hover:bg-neutral-50 transition-colors flex flex-col sm:flex-row items-start sm:items-center justify-between gap-3"
                  >
                    <div>
                      <div className="flex items-center gap-2">
                        <span className="font-mono text-xs font-bold text-neutral-900">
                          {order.id}
                        </span>
                        <span className="text-[11px] text-neutral-500">
                          • {order.date}
                        </span>
                        <span
                          className={`text-[10px] font-bold px-2 py-0.2 rounded-md ${
                            order.status === "Delivered"
                              ? "bg-emerald-100 text-emerald-800"
                              : order.status === "Shipped"
                              ? "bg-blue-100 text-blue-800"
                              : "bg-amber-100 text-amber-800"
                          }`}
                        >
                          {order.status}
                        </span>
                      </div>
                      <div className="text-xs text-neutral-600 mt-1">
                        Customer: <strong className="text-neutral-800">{order.shippingAddress?.name || "Verified Buyer"}</strong> • {order.shippingAddress?.address || "Chennai Hub"}
                      </div>
                    </div>

                    <div className="flex items-center gap-3 self-end sm:self-center">
                      <div className="text-right">
                        <span className="text-xs font-bold text-neutral-900 block">
                          ₹{order.total.toLocaleString("en-IN")}
                        </span>
                        <span className="text-[10px] text-neutral-400">
                          {order.itemsCount} item{order.itemsCount === 1 ? "" : "s"}
                        </span>
                      </div>
                      <Link
                        href={`/orders/${order.id}`}
                        target="_blank"
                        className="px-2.5 py-1.5 rounded-lg bg-neutral-100 hover:bg-neutral-200 text-neutral-700 text-xs font-semibold transition-colors"
                      >
                        Inspect
                      </Link>
                    </div>
                  </div>
                ))
              ) : (
                <div className="py-8 text-center bg-neutral-50/50 rounded-2xl border border-dashed border-neutral-200">
                  <Package size={24} className="mx-auto text-neutral-300 mb-2" />
                  <p className="text-xs font-semibold text-neutral-700">
                    No active demo order matching {product.name}
                  </p>
                  <p className="text-[11px] text-neutral-400 max-w-sm mx-auto mt-0.5">
                    Orders created in the storefront will automatically link and populate here in real-time.
                  </p>
                </div>
              )}
            </div>
          )}

          {activeTab === "actions" && (
            <div className="space-y-5">
              {/* Quick Restock Tool */}
              <div className="p-4 rounded-2xl border border-neutral-100 bg-neutral-50/50 space-y-3">
                <div className="flex items-center justify-between">
                  <div className="font-bold text-xs text-neutral-900 flex items-center gap-1.5">
                    <Boxes size={14} className="text-amber-600" />
                    <span>Quick Warehouse Restock</span>
                  </div>
                  <span className="text-[11px] text-neutral-500">
                    Current Inventory: <strong>{product.stock} units</strong>
                  </span>
                </div>

                <div className="flex flex-wrap items-center gap-2">
                  <div className="flex items-center gap-1 bg-white border border-neutral-200 rounded-xl px-3 py-1.5 shadow-2xs">
                    <span className="text-xs text-neutral-400 font-medium">New Stock:</span>
                    <input
                      type="number"
                      min={0}
                      value={stockInput}
                      onChange={(e) => setStockInput(Math.max(0, parseInt(e.target.value) || 0))}
                      className="w-16 text-xs font-bold text-neutral-900 outline-none"
                    />
                  </div>

                  <button
                    type="button"
                    onClick={() => setStockInput((s) => s + 10)}
                    className="px-2.5 py-1.5 rounded-xl bg-white border border-neutral-200 hover:border-neutral-300 text-xs font-semibold text-neutral-700 shadow-2xs cursor-pointer transition-all"
                  >
                    +10
                  </button>
                  <button
                    type="button"
                    onClick={() => setStockInput((s) => s + 25)}
                    className="px-2.5 py-1.5 rounded-xl bg-white border border-neutral-200 hover:border-neutral-300 text-xs font-semibold text-neutral-700 shadow-2xs cursor-pointer transition-all"
                  >
                    +25
                  </button>
                  <button
                    type="button"
                    onClick={() => setStockInput((s) => s + 50)}
                    className="px-2.5 py-1.5 rounded-xl bg-white border border-neutral-200 hover:border-neutral-300 text-xs font-semibold text-neutral-700 shadow-2xs cursor-pointer transition-all"
                  >
                    +50
                  </button>
                  <button
                    type="button"
                    onClick={() => setStockInput((s) => s + 100)}
                    className="px-2.5 py-1.5 rounded-xl bg-white border border-neutral-200 hover:border-neutral-300 text-xs font-semibold text-neutral-700 shadow-2xs cursor-pointer transition-all"
                  >
                    +100
                  </button>

                  <button
                    type="button"
                    onClick={handleStockSave}
                    className="ml-auto px-4 py-2 rounded-xl bg-neutral-900 hover:bg-black text-white text-xs font-bold transition-all shadow-xs cursor-pointer"
                  >
                    Save Stock Update
                  </button>
                </div>
              </div>

              {/* Price & Margin Adjustment */}
              <div className="p-4 rounded-2xl border border-neutral-100 bg-neutral-50/50 space-y-3">
                <div className="flex items-center justify-between">
                  <div className="font-bold text-xs text-neutral-900 flex items-center gap-1.5">
                    <Tag size={14} className="text-amber-600" />
                    <span>Price &amp; Margin Optimizer</span>
                  </div>
                  <span className="text-[11px] text-neutral-500">
                    Unit Cost: <strong>₹{product.cogs}</strong>
                  </span>
                </div>

                <div className="flex flex-wrap items-center gap-3">
                  <div className="flex items-center gap-1.5 bg-white border border-neutral-200 rounded-xl px-3 py-1.5 shadow-2xs">
                    <span className="text-xs text-neutral-400 font-medium">₹</span>
                    <input
                      type="number"
                      min={product.cogs}
                      step={50}
                      value={priceInput}
                      onChange={(e) => setPriceInput(Math.max(1, parseInt(e.target.value) || 0))}
                      className="w-20 text-xs font-bold text-neutral-900 outline-none"
                    />
                  </div>

                  <div className="text-xs text-neutral-600">
                    Gross Margin:{" "}
                    <strong
                      className={`font-bold ${
                        simulatedMargin >= 50
                          ? "text-emerald-600"
                          : simulatedMargin >= 30
                          ? "text-amber-600"
                          : "text-rose-600"
                      }`}
                    >
                      {simulatedMargin}%
                    </strong>
                    <span className="text-neutral-400 text-[11px] ml-1">
                      (Profit: ₹{Math.max(0, priceInput - product.cogs)}/unit)
                    </span>
                  </div>

                  <button
                    type="button"
                    onClick={handlePriceSave}
                    className="ml-auto px-4 py-2 rounded-xl bg-neutral-900 hover:bg-black text-white text-xs font-bold transition-all shadow-xs cursor-pointer"
                  >
                    Apply New Price
                  </button>
                </div>
              </div>

              {/* Download Report button */}
              <div className="flex items-center justify-between p-4 rounded-2xl bg-amber-50/60 border border-amber-200/50">
                <div>
                  <div className="text-xs font-bold text-amber-950">
                    Export Comprehensive Product Audit
                  </div>
                  <div className="text-[11px] text-amber-800/80 mt-0.5">
                    Download full sales history, variant distributions, and inventory margins in CSV format.
                  </div>
                </div>
                <button
                  type="button"
                  onClick={handleDownloadCSV}
                  className="px-4 py-2 rounded-xl bg-amber-600 hover:bg-amber-700 text-white text-xs font-bold transition-all shadow-2xs cursor-pointer flex items-center gap-1.5"
                >
                  <Download size={13} />
                  <span>Download .CSV</span>
                </button>
              </div>
            </div>
          )}
        </div>

        {/* Footer */}
        <div className="p-4 sm:p-5 bg-neutral-50/80 border-t border-black/[0.05] flex items-center justify-between text-xs">
          <span className="text-neutral-400">
            Last updated: Today, 04:00 PM • VEYRO Analytics Engine
          </span>
          <button
            type="button"
            onClick={onClose}
            className="px-4 py-2 rounded-xl bg-neutral-900 hover:bg-black text-white font-bold transition-all cursor-pointer"
          >
            Done
          </button>
        </div>
      </div>
    </div>
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
}: {
  isOpen: boolean;
  onClose: () => void;
  products: TopProductItem[];
  onSelectProduct: (product: TopProductItem) => void;
  onExportAllCSV: () => void;
  timeframe: string;
  metric: "revenue" | "units";
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
      document.body.style.overflow = "hidden";
      window.addEventListener("keydown", handleKeyDown);
    }
    return () => {
      document.body.style.overflow = "";
      window.removeEventListener("keydown", handleKeyDown);
    };
  }, [isOpen, onClose]);

  if (!isOpen) return null;

  // Filter & sort
  const filtered = products
    .filter((p) => {
      if (categoryFilter !== "all" && p.category !== categoryFilter) return false;
      if (stockFilter === "low_stock" && p.stock > 10) return false;
      if (stockFilter === "in_stock" && p.stock <= 10) return false;
      if (search) {
        const q = search.toLowerCase();
        return (
          p.name.toLowerCase().includes(q) ||
          p.sku.toLowerCase().includes(q) ||
          p.category.toLowerCase().includes(q)
        );
      }
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
    <div
      className="fixed inset-0 z-[80] bg-black/60 backdrop-blur-xs flex items-center justify-center p-3 sm:p-5 overflow-y-auto animate-in fade-in duration-150"
      onClick={onClose}
    >
      <div
        className="bg-white rounded-[26px] shadow-2xl border border-black/[0.06] max-w-5xl w-full overflow-hidden flex flex-col my-auto max-h-[92vh] animate-in zoom-in-95 duration-150"
        onClick={(e) => e.stopPropagation()}
      >
        {/* Header */}
        <div className="p-5 sm:p-6 bg-gradient-to-b from-[#faf9f6] to-white border-b border-black/[0.05] flex items-center justify-between gap-4">
          <div className="flex items-center gap-3.5">
            <div className="w-11 h-11 rounded-2xl bg-[#fff8e7] text-amber-600 flex items-center justify-center shrink-0 shadow-2xs">
              <Award size={20} />
            </div>
            <div>
              <div className="flex items-center gap-2">
                <h2 className="text-lg sm:text-xl font-bold text-neutral-900 leading-tight">
                  Top Products Leaderboard
                </h2>
                <span className="text-[11px] font-bold text-amber-900 bg-amber-100 px-2 py-0.5 rounded-full capitalize">
                  {timeframe}
                </span>
              </div>
              <p className="text-xs text-neutral-400 mt-0.5">
                Complete retail performance, units moved, gross margin analysis, and stock health
              </p>
            </div>
          </div>

          <div className="flex items-center gap-2">
            <button
              onClick={onExportAllCSV}
              className="flex items-center gap-1.5 px-3.5 py-2 rounded-xl bg-neutral-900 hover:bg-black text-white text-xs font-semibold transition-all shadow-xs cursor-pointer"
            >
              <FileSpreadsheet size={14} />
              <span>Export CSV</span>
            </button>

            <button
              onClick={onClose}
              className="p-2 rounded-xl hover:bg-neutral-100 text-neutral-400 hover:text-neutral-700 transition-colors cursor-pointer"
            >
              <X size={18} />
            </button>
          </div>
        </div>

        {/* Filters Bar */}
        <div className="p-4 sm:p-5 border-b border-black/[0.04] bg-neutral-50/50 flex flex-wrap items-center justify-between gap-3 text-xs">
          {/* Search */}
          <div className="relative flex-1 min-w-[200px] max-w-sm">
            <Search size={14} className="absolute left-3 top-1/2 -translate-y-1/2 text-neutral-400" />
            <input
              type="text"
              value={search}
              onChange={(e) => setSearch(e.target.value)}
              placeholder="Search product name, SKU, category..."
              className="w-full pl-9 pr-3 py-2 bg-white rounded-xl border border-neutral-200 text-xs text-neutral-900 placeholder:text-neutral-400 focus:outline-none focus:border-amber-600 shadow-2xs"
            />
          </div>

          {/* Category Filter */}
          <div className="flex items-center gap-1.5">
            {["all", "T-Shirts", "Shoes", "Watches"].map((cat) => (
              <button
                key={cat}
                type="button"
                onClick={() => setCategoryFilter(cat)}
                className={`px-3 py-1.5 rounded-xl font-semibold transition-all cursor-pointer ${
                  categoryFilter === cat
                    ? "bg-amber-100 text-amber-950 font-bold shadow-2xs"
                    : "bg-white text-neutral-600 hover:bg-neutral-100 border border-neutral-200/60"
                }`}
              >
                {cat === "all" ? "All Categories" : cat}
              </button>
            ))}
          </div>

          {/* Stock Filter & Sort */}
          <div className="flex items-center gap-2">
            <select
              value={stockFilter}
              onChange={(e) => setStockFilter(e.target.value as any)}
              className="px-2.5 py-1.5 bg-white border border-neutral-200 rounded-xl text-neutral-700 text-xs font-medium outline-none shadow-2xs"
            >
              <option value="all">All Inventory</option>
              <option value="in_stock">Healthy Stock (10+)</option>
              <option value="low_stock">Low Stock (≤10)</option>
            </select>

            <select
              value={sortBy}
              onChange={(e) => setSortBy(e.target.value as any)}
              className="px-2.5 py-1.5 bg-white border border-neutral-200 rounded-xl text-neutral-700 text-xs font-semibold outline-none shadow-2xs"
            >
              <option value="revenue">Sort: Highest Revenue</option>
              <option value="units">Sort: Most Units Sold</option>
              <option value="margin">Sort: Highest Margin %</option>
              <option value="growth">Sort: Fastest Growth</option>
            </select>
          </div>
        </div>

        {/* Leaderboard Table */}
        <div className="p-4 sm:p-6 overflow-y-auto flex-1">
          <table className="w-full text-left text-xs">
            <thead className="bg-neutral-50/80 text-neutral-400 font-semibold border-b border-neutral-100">
              <tr>
                <th className="py-2.5 px-3 w-12 text-center">Rank</th>
                <th className="py-2.5 px-3">Product</th>
                <th className="py-2.5 px-3">Category</th>
                <th className="py-2.5 px-3 text-center">Units Sold</th>
                <th className="py-2.5 px-3 text-right">Price / Cost</th>
                <th className="py-2.5 px-3 text-right">Total Revenue</th>
                <th className="py-2.5 px-3 text-center">Margin</th>
                <th className="py-2.5 px-3 text-right">Stock</th>
                <th className="py-2.5 px-3 text-center">Action</th>
              </tr>
            </thead>
            <tbody className="divide-y divide-neutral-100">
              {filtered.map((item, idx) => {
                const barWidth = Math.round((item.revenue / maxRevenue) * 100);
                return (
                  <tr
                    key={item.id}
                    onClick={() => {
                      onSelectProduct(item);
                      onClose();
                    }}
                    className="hover:bg-neutral-50/80 transition-colors group cursor-pointer"
                  >
                    <td className="py-3 px-3 text-center">
                      {idx === 0 ? (
                        <span className="w-6 h-6 rounded-full bg-gradient-to-br from-amber-400 to-yellow-600 text-white inline-flex items-center justify-center font-black text-[11px] shadow-xs">
                          1
                        </span>
                      ) : idx === 1 ? (
                        <span className="w-6 h-6 rounded-full bg-gradient-to-br from-slate-300 to-slate-500 text-white inline-flex items-center justify-center font-black text-[11px] shadow-xs">
                          2
                        </span>
                      ) : idx === 2 ? (
                        <span className="w-6 h-6 rounded-full bg-gradient-to-br from-amber-700 to-yellow-800 text-white inline-flex items-center justify-center font-black text-[11px] shadow-xs">
                          3
                        </span>
                      ) : (
                        <span className="text-xs font-bold text-neutral-400">{idx + 1}</span>
                      )}
                    </td>

                    <td className="py-3 px-3">
                      <div className="flex items-center gap-3">
                        <div className="w-10 h-10 rounded-xl bg-neutral-50 border border-neutral-100 overflow-hidden shrink-0">
                          <Image
                            src={item.imageUrl}
                            alt={item.name}
                            width={40}
                            height={40}
                            className="w-full h-full object-cover group-hover:scale-105 transition-transform"
                          />
                        </div>
                        <div className="min-w-0">
                          <div className="font-bold text-neutral-900 group-hover:text-amber-800 transition-colors truncate">
                            {item.name}
                          </div>
                          <div className="text-[10px] text-neutral-400 font-mono">
                            {item.sku}
                          </div>
                        </div>
                      </div>
                    </td>

                    <td className="py-3 px-3">
                      <span className="text-[11px] font-medium text-neutral-600 bg-neutral-100 px-2 py-0.5 rounded-md">
                        {item.category}
                      </span>
                    </td>

                    <td className="py-3 px-3 text-center">
                      <div className="font-bold text-neutral-900">{item.soldCount}</div>
                      <div className="w-16 bg-neutral-100 h-1 rounded-full mx-auto mt-1 overflow-hidden">
                        <div
                          className="h-full bg-amber-500 rounded-full"
                          style={{ width: `${barWidth}%` }}
                        />
                      </div>
                    </td>

                    <td className="py-3 px-3 text-right">
                      <div className="font-bold text-neutral-900">
                        ₹{item.unitPrice.toLocaleString("en-IN")}
                      </div>
                      <div className="text-[10px] text-neutral-400">
                        Cost: ₹{item.cogs}
                      </div>
                    </td>

                    <td className="py-3 px-3 text-right">
                      <div className="font-bold text-neutral-900">
                        ₹{item.revenue.toLocaleString("en-IN")}
                      </div>
                      <div className="text-[10px] text-emerald-600 font-semibold">
                        +{item.growth}%
                      </div>
                    </td>

                    <td className="py-3 px-3 text-center">
                      <span className="font-bold text-emerald-700 bg-emerald-50 px-2 py-0.5 rounded-md text-[11px]">
                        {item.marginPercent}%
                      </span>
                    </td>

                    <td className="py-3 px-3 text-right">
                      {item.stock <= 10 ? (
                        <span className="inline-flex items-center gap-1 text-[10px] font-bold text-amber-800 bg-amber-50 border border-amber-200/70 px-1.5 py-0.5 rounded-md">
                          <AlertTriangle size={10} strokeWidth={2.4} className="text-amber-600 shrink-0" />
                          {item.stock} left
                        </span>
                      ) : (
                        <span className="inline-flex items-center gap-1 text-[10px] font-medium text-emerald-800 bg-emerald-50 border border-emerald-200/50 px-1.5 py-0.5 rounded-md">
                          <span className="w-1.5 h-1.5 rounded-full bg-emerald-500 shrink-0" />
                          {item.stock} in stock
                        </span>
                      )}
                    </td>

                    <td className="py-3 px-3 text-center">
                      <button
                        type="button"
                        className="px-2.5 py-1 rounded-lg bg-neutral-100 hover:bg-neutral-200 text-neutral-800 text-[11px] font-bold transition-colors cursor-pointer group-hover:bg-amber-600 group-hover:text-white"
                      >
                        Inspect
                      </button>
                    </td>
                  </tr>
                );
              })}
            </tbody>
          </table>
        </div>

        {/* Footer KPI Summary Bar */}
        <div className="p-4 sm:p-5 bg-neutral-50/90 border-t border-black/[0.05] flex flex-wrap items-center justify-between gap-4 text-xs">
          <div className="flex items-center gap-6">
            <div>
              <span className="text-neutral-400">Total Filtered Revenue:</span>{" "}
              <strong className="text-neutral-900 font-bold text-sm">
                ₹{totalRev.toLocaleString("en-IN")}
              </strong>
            </div>
            <div>
              <span className="text-neutral-400">Total Units:</span>{" "}
              <strong className="text-neutral-900 font-bold">{totalUnits} items</strong>
            </div>
            <div>
              <span className="text-neutral-400">Average Margin:</span>{" "}
              <strong className="text-neutral-900 font-bold text-emerald-600">{avgMargin}%</strong>
            </div>
          </div>

          <div className="flex items-center gap-3">
            <button
              type="button"
              onClick={onExportAllCSV}
              className="px-4 py-2 rounded-xl bg-white border border-neutral-200 hover:border-neutral-300 text-neutral-800 font-bold text-xs transition-all shadow-2xs cursor-pointer flex items-center gap-1.5"
            >
              <Download size={13} />
              <span>Export All ({filtered.length})</span>
            </button>

            <button
              type="button"
              onClick={onClose}
              className="px-4 py-2 rounded-xl bg-neutral-900 hover:bg-black text-white font-bold transition-all cursor-pointer"
            >
              Close
            </button>
          </div>
        </div>
      </div>
    </div>
  );
}

// ─── ADMIN GLOBAL SEARCH BAR COMPONENT ───────────────────────────────────────

function AdminGlobalSearchBar({
  searchQuery,
  setSearchQuery,
  orders,
  products,
  onSelectOrder,
}: {
  searchQuery: string;
  setSearchQuery: (q: string) => void;
  orders: OrderRecord[];
  products: Product[];
  onSelectOrder?: (orderId: string) => void;
}) {
  const router = useRouter();
  const [isOpen, setIsOpen] = useState(false);
  const [activeTab, setActiveTab] = useState<"all" | "orders" | "products" | "customers">("all");
  const [selectedIndex, setSelectedIndex] = useState(0);
  const containerRef = useRef<HTMLDivElement>(null);
  const inputRef = useRef<HTMLInputElement>(null);

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

  // Filter Matching Orders
  const matchingOrders = useMemo(() => {
    if (!searchQuery.trim()) return [];
    const q = searchQuery.toLowerCase().trim();
    return orders.filter((o) => {
      const idMatch = o.id.toLowerCase().includes(q);
      const customerMatch = o.shippingAddress?.name?.toLowerCase().includes(q);
      const statusMatch = o.status.toLowerCase().includes(q);
      const phoneMatch = o.shippingAddress?.phone?.includes(q);
      const cityMatch = o.shippingAddress?.address?.toLowerCase().includes(q);
      const itemsMatch = o.items?.some(
        (it) => it.productName.toLowerCase().includes(q) || it.colorName.toLowerCase().includes(q)
      );
      return idMatch || customerMatch || statusMatch || phoneMatch || cityMatch || itemsMatch;
    });
  }, [orders, searchQuery]);

  // Filter Matching Products
  const matchingProducts = useMemo(() => {
    if (!searchQuery.trim()) return [];
    const q = searchQuery.toLowerCase().trim();
    return products.filter((p) => {
      const nameMatch = p.name.toLowerCase().includes(q);
      const catMatch = p.category.toLowerCase().includes(q);
      const subcatMatch = p.subcategory?.toLowerCase().includes(q);
      const skuMatch = p.sku?.toLowerCase().includes(q);
      const tagMatch = p.tags?.some((t) => t.toLowerCase().includes(q));
      return nameMatch || catMatch || subcatMatch || skuMatch || tagMatch;
    });
  }, [products, searchQuery]);

  // Filter Matching Customers
  const matchingCustomers = useMemo(() => {
    if (!searchQuery.trim()) return [];
    const q = searchQuery.toLowerCase().trim();
    const customerMap = new Map<
      string,
      { name: string; phone: string; address: string; ordersCount: number; totalSpent: number }
    >();

    orders.forEach((o) => {
      const name = o.shippingAddress?.name?.trim();
      if (!name) return;
      const key = name.toLowerCase();
      if (
        key.includes(q) ||
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
  }, [orders, searchQuery]);

  const totalResults = matchingOrders.length + matchingProducts.length + matchingCustomers.length;

  // Flattened results for keyboard navigation
  const flattenedItems = useMemo(() => {
    const list: Array<{ type: "order" | "product" | "customer"; data: any }> = [];
    if (activeTab === "all" || activeTab === "orders") {
      matchingOrders.forEach((o) => list.push({ type: "order", data: o }));
    }
    if (activeTab === "all" || activeTab === "products") {
      matchingProducts.forEach((p) => list.push({ type: "product", data: p }));
    }
    if (activeTab === "all" || activeTab === "customers") {
      matchingCustomers.forEach((c) => list.push({ type: "customer", data: c }));
    }
    return list;
  }, [activeTab, matchingOrders, matchingProducts, matchingCustomers]);

  // Reset selected index when query or tab changes
  useEffect(() => {
    setSelectedIndex(0);
  }, [searchQuery, activeTab]);

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
          onSelectOrder?.(currentItem.data.id);
          router.push(`/admin/orders`);
          setIsOpen(false);
        } else if (currentItem.type === "product") {
          router.push(currentItem.data.slug ? `/product/${currentItem.data.slug}` : "/admin/products");
          setIsOpen(false);
        } else if (currentItem.type === "customer") {
          setSearchQuery(currentItem.data.name);
          setIsOpen(false);
        }
      }
    }
  };

  const getStatusBadge = (status: string) => {
    switch (status) {
      case "Delivered":
        return "bg-emerald-50 text-emerald-700 border-emerald-200/80";
      case "Processing":
      case "Confirmed":
      case "Packed":
        return "bg-amber-50 text-amber-700 border-amber-200/80";
      case "Shipped":
      case "Out for Delivery":
        return "bg-blue-50 text-blue-700 border-blue-200/80";
      case "Cancelled":
        return "bg-red-50 text-red-700 border-red-200/80";
      case "Returned":
      case "Return Requested":
        return "bg-purple-50 text-purple-700 border-purple-200/80";
      default:
        return "bg-neutral-50 text-neutral-700 border-neutral-200";
    }
  };

  return (
    <div className="w-full md:w-80 lg:w-96 relative" ref={containerRef}>
      {/* Search Input Box Matching Target Design */}
      <div className="relative">
        <Search
          size={16}
          className={`absolute left-3.5 top-1/2 -translate-y-1/2 transition-colors duration-150 ${
            isOpen ? "text-amber-600" : "text-neutral-400"
          } pointer-events-none`}
        />
        <input
          ref={inputRef}
          type="text"
          value={searchQuery}
          onFocus={() => setIsOpen(true)}
          onChange={(e) => {
            setSearchQuery(e.target.value);
            if (!isOpen) setIsOpen(true);
          }}
          onKeyDown={handleKeyDownInInput}
          placeholder="Search orders, products, customers..."
          className={`w-full text-xs sm:text-sm pl-10 pr-9 py-2 rounded-xl transition-all shadow-2xs ${
            isOpen
              ? "bg-white text-neutral-900 border-neutral-300 ring-2 ring-black/5"
              : "bg-[#f3f4f6]/80 hover:bg-[#eaebee] text-neutral-800 border-transparent placeholder-neutral-400"
          } border focus:outline-none`}
        />
        {searchQuery ? (
          <button
            onClick={() => {
              setSearchQuery("");
              inputRef.current?.focus();
            }}
            className="absolute right-3 top-1/2 -translate-y-1/2 text-neutral-400 hover:text-neutral-700 cursor-pointer p-0.5"
            aria-label="Clear search"
          >
            <X size={14} />
          </button>
        ) : (
          <kbd className="absolute right-3.5 top-1/2 -translate-y-1/2 text-[11px] font-mono text-neutral-400 bg-neutral-200/60 px-1.5 py-0.5 rounded pointer-events-none">
            /
          </kbd>
        )}
      </div>

      {/* Live Search Results Dropdown Palette */}
      {isOpen && (
        <div className="absolute left-0 top-full mt-2 w-full md:w-[480px] lg:w-[540px] bg-white rounded-2xl border border-neutral-200/90 shadow-2xl z-50 overflow-hidden animate-in fade-in zoom-in-95 duration-150">
          {/* Top Filter Tabs when searching */}
          {searchQuery.trim() ? (
            <div className="flex items-center gap-1 p-2 bg-neutral-50/70 border-b border-neutral-100 text-xs">
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
                  className={`px-3 py-1.5 rounded-lg font-medium transition-all cursor-pointer flex items-center gap-1.5 ${
                    activeTab === tab.id
                      ? "bg-white text-neutral-900 font-semibold shadow-2xs border border-neutral-200/60"
                      : "text-neutral-500 hover:text-neutral-900 hover:bg-neutral-100/60"
                  }`}
                >
                  <span>{tab.label}</span>
                  <span
                    className={`text-[10px] px-1.5 py-0.2 rounded-full ${
                      activeTab === tab.id ? "bg-neutral-100 text-neutral-800" : "bg-neutral-200/60 text-neutral-500"
                    }`}
                  >
                    {tab.count}
                  </span>
                </button>
              ))}
            </div>
          ) : (
            <div className="px-4 py-2.5 bg-neutral-50/70 border-b border-neutral-100 text-xs font-semibold text-neutral-400 uppercase tracking-wider flex items-center justify-between">
              <span>Quick Actions & Suggested Searches</span>
              <span className="text-[10px] font-normal normal-case text-neutral-400">Press / to focus anytime</span>
            </div>
          )}

          {/* Results Scrollable Area */}
          <div className="max-h-[380px] overflow-y-auto divide-y divide-neutral-100 p-2 space-y-2">
            {/* Case A: Query is empty -> Quick Actions & Filter Pills */}
            {!searchQuery.trim() ? (
              <div className="space-y-4 py-1">
                {/* Quick Navigation Links */}
                <div>
                  <div className="text-[11px] font-semibold text-neutral-400 uppercase tracking-wider px-2 mb-1.5">
                    Quick Navigation
                  </div>
                  <div className="grid grid-cols-1 sm:grid-cols-2 gap-1.5">
                    <button
                      onClick={() => {
                        router.push("/admin/products/add");
                        setIsOpen(false);
                      }}
                      className="flex items-center gap-2.5 px-3 py-2 rounded-xl text-left hover:bg-neutral-50 transition-colors text-xs text-neutral-700 cursor-pointer group"
                    >
                      <div className="w-7 h-7 rounded-lg bg-amber-50 text-amber-700 flex items-center justify-center shrink-0">
                        <Plus size={14} />
                      </div>
                      <div className="min-w-0">
                        <div className="font-semibold text-neutral-900">Add New Product</div>
                        <div className="text-[11px] text-neutral-400 truncate">Create catalog item</div>
                      </div>
                    </button>

                    <button
                      onClick={() => {
                        router.push("/admin/orders");
                        setIsOpen(false);
                      }}
                      className="flex items-center gap-2.5 px-3 py-2 rounded-xl text-left hover:bg-neutral-50 transition-colors text-xs text-neutral-700 cursor-pointer group"
                    >
                      <div className="w-7 h-7 rounded-lg bg-blue-50 text-blue-700 flex items-center justify-center shrink-0">
                        <ShoppingCart size={14} />
                      </div>
                      <div className="min-w-0">
                        <div className="font-semibold text-neutral-900">All Orders ({orders.length})</div>
                        <div className="text-[11px] text-neutral-400 truncate">Review fulfillment list</div>
                      </div>
                    </button>

                    <button
                      onClick={() => {
                        router.push("/admin/products");
                        setIsOpen(false);
                      }}
                      className="flex items-center gap-2.5 px-3 py-2 rounded-xl text-left hover:bg-neutral-50 transition-colors text-xs text-neutral-700 cursor-pointer group"
                    >
                      <div className="w-7 h-7 rounded-lg bg-emerald-50 text-emerald-700 flex items-center justify-center shrink-0">
                        <Package size={14} />
                      </div>
                      <div className="min-w-0">
                        <div className="font-semibold text-neutral-900">Manage Catalog ({products.length})</div>
                        <div className="text-[11px] text-neutral-400 truncate">Inventory and pricing</div>
                      </div>
                    </button>

                    <button
                      onClick={() => {
                        setSearchQuery("Return Requested");
                        setIsOpen(false);
                      }}
                      className="flex items-center gap-2.5 px-3 py-2 rounded-xl text-left hover:bg-neutral-50 transition-colors text-xs text-neutral-700 cursor-pointer group"
                    >
                      <div className="w-7 h-7 rounded-lg bg-red-50 text-red-700 flex items-center justify-center shrink-0">
                        <RotateCcw size={14} />
                      </div>
                      <div className="min-w-0">
                        <div className="font-semibold text-neutral-900">Pending Returns</div>
                        <div className="text-[11px] text-neutral-400 truncate">2 items awaiting review</div>
                      </div>
                    </button>
                  </div>
                </div>

                {/* Popular Search Suggestions */}
                <div className="pt-2 border-t border-neutral-100">
                  <div className="text-[11px] font-semibold text-neutral-400 uppercase tracking-wider px-2 mb-2">
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
                          setSearchQuery(chip);
                          inputRef.current?.focus();
                        }}
                        className="px-2.5 py-1 rounded-lg bg-neutral-100 hover:bg-neutral-200/80 text-xs font-medium text-neutral-700 transition-colors cursor-pointer flex items-center gap-1"
                      >
                        <Search size={11} className="text-neutral-400" />
                        <span>{chip}</span>
                      </button>
                    ))}
                  </div>
                </div>
              </div>
            ) : totalResults === 0 ? (
              /* Case B: Query entered but no matches */
              <div className="py-10 text-center px-4">
                <div className="w-12 h-12 rounded-2xl bg-neutral-100 text-neutral-400 flex items-center justify-center mx-auto mb-3">
                  <Search size={22} />
                </div>
                <div className="text-sm font-semibold text-neutral-900 mb-1">
                  No matches found for &quot;{searchQuery}&quot;
                </div>
                <p className="text-xs text-neutral-400 max-w-xs mx-auto mb-4">
                  Check the spelling or try searching by Order ID (e.g. VEY-2026), product name, customer name, or status.
                </p>
                <div className="flex flex-wrap justify-center gap-1.5">
                  {["Delivered", "Processing", "Boopesh", "Shoes", "Watches"].map((chip) => (
                    <button
                      key={chip}
                      onClick={() => setSearchQuery(chip)}
                      className="px-2.5 py-1 rounded-lg bg-neutral-100 hover:bg-neutral-200 text-xs text-neutral-600 font-medium cursor-pointer"
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
                {(activeTab === "all" || activeTab === "orders") && matchingOrders.length > 0 && (
                  <div>
                    <div className="text-[11px] font-semibold text-neutral-400 uppercase tracking-wider px-2 py-1 flex items-center justify-between">
                      <span className="flex items-center gap-1.5">
                        <ShoppingCart size={12} className="text-neutral-500" /> Orders
                      </span>
                      <span>{matchingOrders.length}</span>
                    </div>
                    <div className="space-y-1 mt-1">
                      {matchingOrders.slice(0, activeTab === "orders" ? 20 : 4).map((order) => {
                        const customer = order.shippingAddress?.name || "Customer";
                        const firstItem = order.items?.[0]?.productName || "Items";
                        const extraItems = order.items && order.items.length > 1 ? ` +${order.items.length - 1} more` : "";

                        return (
                          <div
                            key={order.id}
                            onClick={() => {
                              onSelectOrder?.(order.id);
                              router.push(`/admin/orders`);
                              setIsOpen(false);
                            }}
                            className="p-2.5 rounded-xl hover:bg-neutral-50 border border-transparent hover:border-neutral-200/60 transition-all cursor-pointer flex items-center justify-between gap-3 group"
                          >
                            <div className="min-w-0">
                              <div className="flex items-center gap-2">
                                <span className="font-bold text-xs text-neutral-900 group-hover:text-amber-800 transition-colors">
                                  {order.id}
                                </span>
                                <span
                                  className={`text-[10px] font-semibold px-2 py-0.5 rounded-md border ${getStatusBadge(
                                    order.status
                                  )}`}
                                >
                                  {order.status}
                                </span>
                              </div>
                              <div className="text-xs text-neutral-600 truncate mt-0.5">
                                <strong className="font-semibold text-neutral-800">{customer}</strong> • {firstItem}
                                {extraItems}
                              </div>
                              <div className="text-[11px] text-neutral-400 mt-0.5">
                                {order.date} • {order.shippingAddress?.address ? order.shippingAddress.address.split(",").slice(-2).join(",").trim() : "India"}
                              </div>
                            </div>

                            <div className="text-right shrink-0 flex items-center gap-2">
                              <span className="text-xs font-bold text-neutral-900">
                                ₹{order.total.toLocaleString("en-IN")}
                              </span>
                              <ChevronRight size={14} className="text-neutral-400 group-hover:translate-x-0.5 transition-transform" />
                            </div>
                          </div>
                        );
                      })}
                    </div>
                  </div>
                )}

                {/* Products Section */}
                {(activeTab === "all" || activeTab === "products") && matchingProducts.length > 0 && (
                  <div>
                    <div className="text-[11px] font-semibold text-neutral-400 uppercase tracking-wider px-2 py-1 flex items-center justify-between">
                      <span className="flex items-center gap-1.5">
                        <Package size={12} className="text-neutral-500" /> Products
                      </span>
                      <span>{matchingProducts.length}</span>
                    </div>
                    <div className="space-y-1 mt-1">
                      {matchingProducts.slice(0, activeTab === "products" ? 20 : 4).map((product) => (
                        <div
                          key={product.id}
                          onClick={() => {
                            router.push(product.slug ? `/product/${product.slug}` : "/admin/products");
                            setIsOpen(false);
                          }}
                          className="p-2.5 rounded-xl hover:bg-neutral-50 border border-transparent hover:border-neutral-200/60 transition-all cursor-pointer flex items-center justify-between gap-3 group"
                        >
                          <div className="flex items-center gap-3 min-w-0">
                            <div className="w-10 h-10 rounded-xl bg-neutral-100 overflow-hidden shrink-0 border border-neutral-200/60 flex items-center justify-center">
                              <Image
                                src={product.imageUrl}
                                alt={product.name}
                                width={40}
                                height={40}
                                className="w-full h-full object-cover group-hover:scale-105 transition-transform"
                              />
                            </div>
                            <div className="min-w-0">
                              <div className="font-semibold text-xs text-neutral-900 truncate group-hover:text-amber-800 transition-colors">
                                {product.name}
                              </div>
                              <div className="text-[11px] text-neutral-400 truncate mt-0.5">
                                {product.category} • SKU: {product.sku || product.id}
                              </div>
                            </div>
                          </div>

                          <div className="text-right shrink-0 flex items-center gap-2">
                            <div>
                              <div className="text-xs font-bold text-neutral-900">
                                ₹{product.price.toLocaleString("en-IN")}
                              </div>
                              <div className="text-[10px] text-emerald-600 font-medium">In Stock</div>
                            </div>
                            <ChevronRight size={14} className="text-neutral-400 group-hover:translate-x-0.5 transition-transform" />
                          </div>
                        </div>
                      ))}
                    </div>
                  </div>
                )}

                {/* Customers Section */}
                {(activeTab === "all" || activeTab === "customers") && matchingCustomers.length > 0 && (
                  <div>
                    <div className="text-[11px] font-semibold text-neutral-400 uppercase tracking-wider px-2 py-1 flex items-center justify-between">
                      <span className="flex items-center gap-1.5">
                        <User size={12} className="text-neutral-500" /> Customers
                      </span>
                      <span>{matchingCustomers.length}</span>
                    </div>
                    <div className="space-y-1 mt-1">
                      {matchingCustomers.slice(0, activeTab === "customers" ? 20 : 3).map((cust) => (
                        <div
                          key={cust.name}
                          onClick={() => {
                            setSearchQuery(cust.name);
                            setIsOpen(false);
                          }}
                          className="p-2.5 rounded-xl hover:bg-neutral-50 border border-transparent hover:border-neutral-200/60 transition-all cursor-pointer flex items-center justify-between gap-3 group"
                        >
                          <div className="flex items-center gap-3 min-w-0">
                            <div className="w-9 h-9 rounded-full bg-amber-100 text-amber-800 font-bold text-xs flex items-center justify-center shrink-0">
                              {cust.name.slice(0, 1).toUpperCase()}
                            </div>
                            <div className="min-w-0">
                              <div className="font-semibold text-xs text-neutral-900 truncate group-hover:text-amber-800 transition-colors">
                                {cust.name}
                              </div>
                              <div className="text-[11px] text-neutral-400 truncate mt-0.5">
                                {cust.phone || "Verified Customer"} • {cust.address ? cust.address.split(",").slice(-2).join(",").trim() : "India"}
                              </div>
                            </div>
                          </div>

                          <div className="text-right shrink-0">
                            <div className="text-xs font-semibold text-neutral-800">
                              {cust.ordersCount} {cust.ordersCount === 1 ? "order" : "orders"}
                            </div>
                            <div className="text-[11px] text-neutral-400 font-medium">
                              ₹{cust.totalSpent.toLocaleString("en-IN")} total
                            </div>
                          </div>
                        </div>
                      ))}
                    </div>
                  </div>
                )}
              </div>
            )}
          </div>

          {/* Palette Footer Bar with Keyboard Hints */}
          <div className="px-4 py-2 bg-neutral-50/90 border-t border-neutral-100 flex items-center justify-between text-[11px] text-neutral-400">
            <div className="flex items-center gap-3">
              <span>
                <kbd className="px-1.5 py-0.5 bg-neutral-200/70 rounded text-[10px] text-neutral-600 font-mono">↑↓</kbd> navigate
              </span>
              <span>
                <kbd className="px-1.5 py-0.5 bg-neutral-200/70 rounded text-[10px] text-neutral-600 font-mono">↵</kbd> select
              </span>
              <span>
                <kbd className="px-1.5 py-0.5 bg-neutral-200/70 rounded text-[10px] text-neutral-600 font-mono">esc</kbd> close
              </span>
            </div>
            {searchQuery.trim() && (
              <button
                onClick={() => setSearchQuery("")}
                className="text-amber-800 font-semibold hover:underline cursor-pointer"
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
}

function OrderDeepInspectionModal({
  order,
  onClose,
  onUpdateStatus,
  showToast,
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
        onClose();
      }
    }
    if (order) {
      window.addEventListener("keydown", handleKeyDown);
      document.body.style.overflow = "hidden";
    }
    return () => {
      window.removeEventListener("keydown", handleKeyDown);
      document.body.style.overflow = "unset";
    };
  }, [order, onClose]);

  if (!order || !currentOrder) return null;

  const customerName = currentOrder.shippingAddress?.name || "Customer";
  const avatar = getCustomerAvatar(customerName);
  const cleanPhone = (currentOrder.shippingAddress?.phone || "").replace(/[^0-9]/g, "");
  const totalUnits = (currentOrder.items || []).reduce((acc, it) => acc + (it.quantity || 1), 0);

  const handleStatusChange = (newStatus: OrderStatus) => {
    onUpdateStatus(currentOrder.id, newStatus);
    setCurrentOrder((prev) => (prev ? { ...prev, status: newStatus } : prev));
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
    "✅ Address Verified",
    "📦 Priority Packing",
    "⭐ VIP Customer",
    "📞 Phone Confirmed",
    "🔁 Return/Swap Req",
  ];

  return (
    <div
      className="fixed inset-0 z-50 bg-black/60 backdrop-blur-sm flex items-center justify-center p-3 sm:p-5 overflow-y-auto animate-in fade-in duration-200"
      onClick={onClose}
    >
      <div
        className="bg-white rounded-3xl max-w-4xl w-full max-h-[92vh] flex flex-col shadow-2xl overflow-hidden border border-black/5 animate-in zoom-in-95 duration-200"
        onClick={(e) => e.stopPropagation()}
      >
        {/* Top Header */}
        <div className="px-6 py-4.5 bg-neutral-900 text-white flex items-center justify-between border-b border-white/10 shrink-0">
          <div className="flex items-center gap-3 flex-wrap">
            <div className="w-9 h-9 rounded-xl bg-amber-500/20 text-amber-400 flex items-center justify-center border border-amber-500/30">
              <Eye size={18} />
            </div>
            <div>
              <div className="flex items-center gap-2">
                <span className="text-xs uppercase tracking-wider text-neutral-400 font-semibold">
                  Order Deep Inspection
                </span>
                <span className="text-xs px-2 py-0.5 rounded-full bg-white/10 text-white/90 font-mono">
                  #{currentOrder.id}
                </span>
              </div>
              <h2 className="text-lg font-bold text-white tracking-tight flex items-center gap-2">
                {customerName}&apos;s Order
              </h2>
            </div>
          </div>

          <div className="flex items-center gap-2">
            <button
              onClick={handleCopyOrderId}
              className="px-3 py-1.5 rounded-xl bg-white/10 hover:bg-white/20 text-white text-xs font-medium flex items-center gap-1.5 transition-colors cursor-pointer"
              title="Copy Order ID"
            >
              {isCopied ? <Check size={13} className="text-emerald-400" /> : <Copy size={13} />}
              <span>{isCopied ? "Copied" : "Copy ID"}</span>
            </button>

            <button
              onClick={() => printOrDownloadOrderSlip(currentOrder)}
              className="px-3.5 py-1.5 rounded-xl bg-amber-500 hover:bg-amber-400 text-black text-xs font-semibold flex items-center gap-1.5 transition-colors shadow-sm cursor-pointer"
              title="Print official tax invoice slip"
            >
              <Printer size={13} />
              <span>Print Slip</span>
            </button>

            <button
              onClick={onClose}
              className="w-8 h-8 rounded-xl bg-white/10 hover:bg-white/20 text-white/80 hover:text-white flex items-center justify-center transition-colors cursor-pointer"
              aria-label="Close modal"
            >
              <X size={16} />
            </button>
          </div>
        </div>

        {/* 4 Hero KPI Stats Bar */}
        <div className="grid grid-cols-2 md:grid-cols-4 gap-3 p-5 bg-neutral-50/80 border-b border-neutral-100 shrink-0">
          <div className="bg-white p-3.5 rounded-2xl border border-neutral-200/70 shadow-2xs">
            <div className="flex items-center justify-between text-neutral-400 mb-1">
              <span className="text-[11px] font-medium uppercase tracking-wider">Gross Total</span>
              <IndianRupee size={13} className="text-amber-600" />
            </div>
            <div className="text-base sm:text-lg font-extrabold text-neutral-900 tracking-tight">
              ₹{currentOrder.total.toLocaleString("en-IN")}
            </div>
            <div className="text-[11px] text-neutral-500 mt-0.5 uppercase tracking-wide font-medium">
              Payment: <strong className="text-neutral-700">{currentOrder.paymentMethod || "Prepaid"}</strong>
            </div>
          </div>

          <div className="bg-white p-3.5 rounded-2xl border border-neutral-200/70 shadow-2xs">
            <div className="flex items-center justify-between text-neutral-400 mb-1">
              <span className="text-[11px] font-medium uppercase tracking-wider">Fulfillment</span>
              <Package size={13} className="text-blue-500" />
            </div>
            <div className="mt-0.5">
              <StatusPill status={currentOrder.status} />
            </div>
            <div className="text-[11px] text-neutral-500 mt-1">
              Est: <strong className="text-neutral-700">{currentOrder.estimatedDelivery || "Standard"}</strong>
            </div>
          </div>

          <div className="bg-white p-3.5 rounded-2xl border border-neutral-200/70 shadow-2xs">
            <div className="flex items-center justify-between text-neutral-400 mb-1">
              <span className="text-[11px] font-medium uppercase tracking-wider">Package Items</span>
              <Boxes size={13} className="text-emerald-500" />
            </div>
            <div className="text-base sm:text-lg font-extrabold text-neutral-900 tracking-tight">
              {currentOrder.itemsCount || currentOrder.items?.length || 1} Products
            </div>
            <div className="text-[11px] text-neutral-500 mt-0.5">
              Total <strong className="text-neutral-700">{totalUnits}</strong> physical units
            </div>
          </div>

          <div className="bg-white p-3.5 rounded-2xl border border-neutral-200/70 shadow-2xs">
            <div className="flex items-center justify-between text-neutral-400 mb-1">
              <span className="text-[11px] font-medium uppercase tracking-wider">Order Date</span>
              <Clock size={13} className="text-purple-500" />
            </div>
            <div className="text-xs sm:text-sm font-bold text-neutral-900 tracking-tight truncate">
              {currentOrder.date}
            </div>
            <div className="text-[11px] text-emerald-600 mt-0.5 font-medium flex items-center gap-1">
              <ShieldCheck size={12} /> Verified order
            </div>
          </div>
        </div>

        {/* Scrollable Modal Body */}
        <div className="overflow-y-auto p-5 sm:p-6 space-y-6">
          <div className="grid grid-cols-1 lg:grid-cols-12 gap-6">
            {/* Left Column (7 cols): Items List + Financials + Staff Notes */}
            <div className="lg:col-span-7 space-y-5">
              {/* Ordered Items List */}
              <div className="bg-white rounded-2xl border border-neutral-200/80 p-4.5 shadow-2xs">
                <div className="flex items-center justify-between mb-3.5 pb-2 border-b border-neutral-100">
                  <div className="flex items-center gap-2">
                    <ShoppingCart size={15} className="text-amber-600" />
                    <h3 className="text-xs font-bold text-neutral-900 uppercase tracking-wider">
                      Ordered Line Items ({currentOrder.items?.length || 0})
                    </h3>
                  </div>
                  <span className="text-xs text-neutral-400">
                    Live Stock Allocation
                  </span>
                </div>

                <div className="space-y-3">
                  {currentOrder.items && currentOrder.items.length > 0 ? (
                    currentOrder.items.map((it, idx) => (
                      <div
                        key={idx}
                        className="flex items-center gap-3.5 p-3 rounded-xl bg-neutral-50/70 border border-neutral-100 hover:border-amber-200 transition-colors"
                      >
                        <div className="w-14 h-14 rounded-xl bg-white overflow-hidden shrink-0 border border-neutral-200 flex items-center justify-center p-1">
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
                            <h4 className="text-xs sm:text-sm font-bold text-neutral-900 truncate">
                              {it.productName}
                            </h4>
                            <span className="text-xs font-bold text-neutral-900 shrink-0">
                              ₹{(it.totalPrice || it.unitPrice * it.quantity).toLocaleString("en-IN")}
                            </span>
                          </div>
                          <div className="flex items-center gap-2 mt-1 text-[11px] text-neutral-500 flex-wrap">
                            {it.colorName && (
                              <span className="px-2 py-0.5 rounded-md bg-white border border-neutral-200/60 font-medium text-neutral-700">
                                {it.colorName}
                              </span>
                            )}
                            {it.selectedSize && (
                              <span className="px-2 py-0.5 rounded-md bg-white border border-neutral-200/60 font-medium text-neutral-700">
                                Size: {it.selectedSize}
                              </span>
                            )}
                            <span className="text-neutral-400">
                              Qty: <strong className="text-neutral-700">{it.quantity}</strong> × ₹{it.unitPrice.toLocaleString("en-IN")}
                            </span>
                          </div>
                          {it.productSlug && (
                            <div className="mt-1">
                              <Link
                                href={`/product/${it.productSlug}`}
                                target="_blank"
                                className="text-[10px] text-amber-700 hover:text-amber-900 font-semibold inline-flex items-center gap-1 hover:underline"
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
                    <div className="p-4 text-center text-xs text-neutral-400">
                      No item data available for this order.
                    </div>
                  )}
                </div>
              </div>

              {/* Financial Bill Breakdown */}
              <div className="bg-white rounded-2xl border border-neutral-200/80 p-4.5 shadow-2xs">
                <div className="flex items-center gap-2 mb-3 pb-2 border-b border-neutral-100">
                  <CreditCard size={15} className="text-amber-600" />
                  <h3 className="text-xs font-bold text-neutral-900 uppercase tracking-wider">
                    Financial Summary & Taxation
                  </h3>
                </div>

                <div className="space-y-2 text-xs">
                  <div className="flex items-center justify-between text-neutral-600">
                    <span>Items Subtotal</span>
                    <span className="font-semibold text-neutral-900">
                      ₹{(currentOrder.subtotal || currentOrder.total).toLocaleString("en-IN")}
                    </span>
                  </div>

                  {currentOrder.bundleDiscount > 0 && (
                    <div className="flex items-center justify-between text-emerald-600">
                      <span>Bundle Savings</span>
                      <span className="font-semibold">-₹{currentOrder.bundleDiscount.toLocaleString("en-IN")}</span>
                    </div>
                  )}

                  {currentOrder.couponDiscount > 0 && (
                    <div className="flex items-center justify-between text-emerald-600">
                      <span>
                        Coupon Discount {currentOrder.couponCode ? `(${currentOrder.couponCode})` : ""}
                      </span>
                      <span className="font-semibold">-₹{currentOrder.couponDiscount.toLocaleString("en-IN")}</span>
                    </div>
                  )}

                  <div className="flex items-center justify-between text-neutral-600">
                    <span>Express Shipping & Handling</span>
                    <span className="font-semibold text-emerald-600">
                      {currentOrder.shippingCost === 0 ? "FREE (Atelier Complimentary)" : `₹${currentOrder.shippingCost}`}
                    </span>
                  </div>

                  <div className="pt-2 border-t border-neutral-100 flex items-center justify-between text-sm font-extrabold text-neutral-900">
                    <span>Grand Total Paid</span>
                    <span className="text-base text-amber-700">₹{currentOrder.total.toLocaleString("en-IN")}</span>
                  </div>
                </div>
              </div>

              {/* Operational Staff Internal Note Box */}
              <div className="bg-white rounded-2xl border border-neutral-200/80 p-4.5 shadow-2xs">
                <div className="flex items-center justify-between mb-2">
                  <div className="flex items-center gap-2">
                    <FileText size={15} className="text-amber-600" />
                    <h3 className="text-xs font-bold text-neutral-900 uppercase tracking-wider">
                      Internal Staff Notes
                    </h3>
                  </div>
                  <span className="text-[10px] text-neutral-400 font-medium">Private to Admin Staff</span>
                </div>

                <textarea
                  value={adminNote}
                  onChange={(e) => setAdminNote(e.target.value)}
                  placeholder="Record customer preferences, delivery instructions, packaging notes or escalation info..."
                  rows={3}
                  className="w-full text-xs p-3 rounded-xl border border-neutral-200 focus:border-amber-500 focus:ring-2 focus:ring-amber-500/20 outline-none resize-none transition-all placeholder:text-neutral-400"
                />

                <div className="flex items-center gap-1.5 mt-2 flex-wrap">
                  {quickTags.map((tag) => (
                    <button
                      key={tag}
                      type="button"
                      onClick={() => {
                        const noteWithTag = adminNote ? `${adminNote} • ${tag}` : tag;
                        setAdminNote(noteWithTag);
                      }}
                      className="text-[10px] px-2 py-1 rounded-lg bg-neutral-100 hover:bg-amber-100 text-neutral-600 hover:text-amber-900 transition-colors cursor-pointer"
                    >
                      {tag}
                    </button>
                  ))}
                </div>

                <div className="flex justify-end mt-3">
                  <button
                    onClick={handleSaveNote}
                    className="px-4 py-1.5 rounded-xl bg-neutral-900 hover:bg-black text-white text-xs font-semibold transition-colors shadow-2xs cursor-pointer"
                  >
                    Save Operational Note
                  </button>
                </div>
              </div>
            </div>

            {/* Right Column (5 cols): Customer Info + Timeline + Quick Actions */}
            <div className="lg:col-span-5 space-y-5">
              {/* Customer Dossier Card */}
              <div className="bg-white rounded-2xl border border-neutral-200/80 p-4.5 shadow-2xs">
                <div className="flex items-center gap-2 mb-3 pb-2 border-b border-neutral-100">
                  <User size={15} className="text-amber-600" />
                  <h3 className="text-xs font-bold text-neutral-900 uppercase tracking-wider">
                    Customer Profile & Contact
                  </h3>
                </div>

                <div className="flex items-start gap-3 mb-4">
                  <div
                    className={`w-11 h-11 rounded-2xl ${avatar.bg} ${avatar.text} flex items-center justify-center text-sm font-extrabold shrink-0 shadow-2xs`}
                  >
                    {avatar.initial}
                  </div>
                  <div>
                    <h4 className="text-sm font-bold text-neutral-900">{customerName}</h4>
                    <p className="text-xs text-neutral-500 mt-0.5">
                      {currentOrder.shippingAddress?.phone || "No phone provided"}
                    </p>
                    <span className="inline-block mt-1 text-[10px] px-2 py-0.5 rounded-full bg-emerald-50 text-emerald-700 font-semibold border border-emerald-200/50">
                      Verified Buyer
                    </span>
                  </div>
                </div>

                {cleanPhone && (
                  <div className="grid grid-cols-2 gap-2 mb-4">
                    <a
                      href={`tel:${cleanPhone}`}
                      className="flex items-center justify-center gap-1.5 px-3 py-2 rounded-xl bg-neutral-100 hover:bg-neutral-200/80 text-neutral-800 text-xs font-semibold transition-colors"
                    >
                      <Phone size={13} className="text-neutral-600" />
                      <span>Call Client</span>
                    </a>
                    <a
                      href={`https://wa.me/91${cleanPhone.replace(/^91/, "")}?text=${encodeURIComponent(
                        `Hi ${customerName}, regarding your VEYRO order #${currentOrder.id}...`
                      )}`}
                      target="_blank"
                      rel="noopener noreferrer"
                      className="flex items-center justify-center gap-1.5 px-3 py-2 rounded-xl bg-emerald-50 hover:bg-emerald-100 text-emerald-800 text-xs font-semibold transition-colors border border-emerald-200/60"
                    >
                      <MessageSquare size={13} className="text-emerald-600" />
                      <span>WhatsApp</span>
                    </a>
                  </div>
                )}

                <div className="p-3 rounded-xl bg-neutral-50 border border-neutral-100 text-xs space-y-1">
                  <div className="flex items-center gap-1.5 font-bold text-neutral-700 mb-1">
                    <MapPin size={13} className="text-amber-600" />
                    <span>Shipping Destination</span>
                  </div>
                  <p className="text-neutral-800 leading-relaxed font-medium">
                    {currentOrder.shippingAddress?.address || "Address not provided"}
                  </p>
                  {currentOrder.shippingAddress?.pincode && (
                    <p className="text-neutral-500 text-[11px]">
                      PIN / Postal Code: <strong className="text-neutral-700">{currentOrder.shippingAddress.pincode}</strong>
                    </p>
                  )}
                </div>
              </div>

              {/* Chronological Tracking Audit Timeline */}
              <div className="bg-white rounded-2xl border border-neutral-200/80 p-4.5 shadow-2xs">
                <div className="flex items-center justify-between mb-3 pb-2 border-b border-neutral-100">
                  <div className="flex items-center gap-2">
                    <Truck size={15} className="text-amber-600" />
                    <h3 className="text-xs font-bold text-neutral-900 uppercase tracking-wider">
                      Fulfillment Journey
                    </h3>
                  </div>
                  <span className="text-[10px] text-neutral-400 font-semibold uppercase">
                    Audit Log
                  </span>
                </div>

                <div className="space-y-3 relative before:absolute before:left-3 before:top-2 before:bottom-2 before:w-0.5 before:bg-neutral-200">
                  {currentOrder.timeline && currentOrder.timeline.length > 0 ? (
                    currentOrder.timeline.map((item, idx) => (
                      <div key={idx} className="flex items-start gap-3 relative z-10">
                        <div className="w-6 h-6 rounded-full bg-emerald-500 text-white flex items-center justify-center shrink-0 shadow-2xs ring-4 ring-white">
                          <Check size={11} strokeWidth={3} />
                        </div>
                        <div className="flex-1 text-xs">
                          <div className="flex items-center justify-between">
                            <span className="font-bold text-neutral-900">{item.status}</span>
                            <span className="text-[10px] text-neutral-400">{item.timestamp}</span>
                          </div>
                          <p className="text-neutral-500 text-[11px] mt-0.5">{item.description}</p>
                        </div>
                      </div>
                    ))
                  ) : (
                    <div className="flex items-start gap-3 relative z-10">
                      <div className="w-6 h-6 rounded-full bg-amber-500 text-white flex items-center justify-center shrink-0 ring-4 ring-white">
                        <Clock size={11} />
                      </div>
                      <div className="flex-1 text-xs">
                        <span className="font-bold text-neutral-900">{currentOrder.status}</span>
                        <p className="text-neutral-500 text-[11px] mt-0.5">Order placed on {currentOrder.date}</p>
                      </div>
                    </div>
                  )}
                </div>
              </div>

              {/* Fast Quick Status Actions Bar */}
              <div className="bg-white rounded-2xl border border-neutral-200/80 p-4.5 shadow-2xs">
                <div className="flex items-center gap-2 mb-3 pb-2 border-b border-neutral-100">
                  <RotateCw size={15} className="text-amber-600" />
                  <h3 className="text-xs font-bold text-neutral-900 uppercase tracking-wider">
                    Quick Status Actions
                  </h3>
                </div>

                <div className="grid grid-cols-2 gap-2">
                  <button
                    onClick={() => handleStatusChange("Processing")}
                    disabled={currentOrder.status === "Processing"}
                    className={`px-3 py-2 rounded-xl text-xs font-semibold flex items-center justify-center gap-1.5 transition-all cursor-pointer ${
                      currentOrder.status === "Processing"
                        ? "bg-amber-100 text-amber-800 cursor-not-allowed opacity-70"
                        : "bg-neutral-100 hover:bg-neutral-200/80 text-neutral-800"
                    }`}
                  >
                    <span>Mark Processing</span>
                  </button>

                  <button
                    onClick={() => handleStatusChange("Shipped")}
                    disabled={currentOrder.status === "Shipped"}
                    className={`px-3 py-2 rounded-xl text-xs font-semibold flex items-center justify-center gap-1.5 transition-all cursor-pointer ${
                      currentOrder.status === "Shipped"
                        ? "bg-blue-100 text-blue-800 cursor-not-allowed opacity-70"
                        : "bg-blue-50 hover:bg-blue-100 text-blue-700 border border-blue-200/60"
                    }`}
                  >
                    <Truck size={12} />
                    <span>Mark Shipped</span>
                  </button>

                  <button
                    onClick={() => handleStatusChange("Delivered")}
                    disabled={currentOrder.status === "Delivered"}
                    className={`px-3 py-2 rounded-xl text-xs font-semibold flex items-center justify-center gap-1.5 transition-all cursor-pointer ${
                      currentOrder.status === "Delivered"
                        ? "bg-emerald-100 text-emerald-800 cursor-not-allowed opacity-70"
                        : "bg-emerald-600 hover:bg-emerald-700 text-white shadow-2xs"
                    }`}
                  >
                    <CheckCircle2 size={12} />
                    <span>Mark Delivered</span>
                  </button>

                  <button
                    onClick={() => handleStatusChange("Cancelled")}
                    disabled={currentOrder.status === "Cancelled"}
                    className={`px-3 py-2 rounded-xl text-xs font-semibold flex items-center justify-center gap-1.5 transition-all cursor-pointer ${
                      currentOrder.status === "Cancelled"
                        ? "bg-rose-100 text-rose-800 cursor-not-allowed opacity-70"
                        : "bg-rose-50 hover:bg-rose-100 text-rose-700 border border-rose-200/60"
                    }`}
                  >
                    <X size={12} />
                    <span>Cancel Order</span>
                  </button>
                </div>
              </div>
            </div>
          </div>
        </div>

        {/* Modal Footer */}
        <div className="px-6 py-3.5 bg-neutral-50 border-t border-neutral-100 flex items-center justify-between text-xs text-neutral-500 shrink-0">
          <div className="flex items-center gap-2">
            <span className="w-2 h-2 rounded-full bg-emerald-500 animate-pulse" />
            <span>Real-time Order State Synchronization Active</span>
          </div>
          <button
            onClick={onClose}
            className="px-4 py-1.5 rounded-xl bg-neutral-200/80 hover:bg-neutral-300 text-neutral-800 font-semibold transition-colors cursor-pointer"
          >
            Close Window
          </button>
        </div>
      </div>
    </div>
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
}

function AllOrdersManagerModal({
  isOpen,
  onClose,
  orders,
  onSelectOrder,
  onUpdateStatus,
  showToast,
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
      document.body.style.overflow = "hidden";
    }
    return () => {
      window.removeEventListener("keydown", handleKeyDown);
      document.body.style.overflow = "unset";
    };
  }, [isOpen, onClose]);

  const counts = useMemo(() => {
    return {
      all: orders.length,
      delivered: orders.filter((o) => o.status === "Delivered").length,
      processing: orders.filter((o) => o.status === "Processing" || o.status === "Confirmed" || o.status === "Packed").length,
      shipped: orders.filter((o) => o.status === "Shipped" || o.status === "Out for Delivery").length,
      cancelled: orders.filter((o) => o.status === "Cancelled").length,
      returned: orders.filter((o) => o.status === "Returned" || o.status === "Return Requested").length,
    };
  }, [orders]);

  const filteredOrders = useMemo(() => {
    let list = [...orders];

    if (statusFilter !== "All") {
      list = list.filter((o) => {
        if (statusFilter === "Delivered") return o.status === "Delivered";
        if (statusFilter === "Processing") return o.status === "Processing" || o.status === "Confirmed" || o.status === "Packed";
        if (statusFilter === "Shipped") return o.status === "Shipped" || o.status === "Out for Delivery";
        if (statusFilter === "Cancelled") return o.status === "Cancelled";
        if (statusFilter === "Returned") return o.status === "Returned" || o.status === "Return Requested";
        return true;
      });
    }

    if (modalSearch.trim()) {
      const q = modalSearch.toLowerCase().trim();
      list = list.filter(
        (o) =>
          o.id.toLowerCase().includes(q) ||
          o.shippingAddress?.name?.toLowerCase().includes(q) ||
          o.shippingAddress?.phone?.includes(q) ||
          o.shippingAddress?.address?.toLowerCase().includes(q) ||
          o.status.toLowerCase().includes(q) ||
          o.items?.some((it) => it.productName.toLowerCase().includes(q))
      );
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

  if (!isOpen) return null;

  return (
    <div
      className="fixed inset-0 z-50 bg-black/60 backdrop-blur-sm flex items-center justify-center p-3 sm:p-5 overflow-y-auto animate-in fade-in duration-200"
      onClick={onClose}
    >
      <div
        className="bg-white rounded-3xl max-w-5xl w-full max-h-[92vh] flex flex-col shadow-2xl overflow-hidden border border-black/5 animate-in zoom-in-95 duration-200"
        onClick={(e) => e.stopPropagation()}
      >
        {/* Header */}
        <div className="px-6 py-5 bg-neutral-900 text-white flex items-center justify-between border-b border-white/10 shrink-0">
          <div className="flex items-center gap-3">
            <div className="w-10 h-10 rounded-2xl bg-amber-500/20 text-amber-400 flex items-center justify-center border border-amber-500/30">
              <ShoppingCart size={20} />
            </div>
            <div>
              <div className="flex items-center gap-2">
                <span className="text-xs uppercase tracking-wider text-neutral-400 font-semibold">
                  Orders Operations Center
                </span>
                <span className="text-xs px-2 py-0.5 rounded-full bg-white/10 text-white/90 font-mono">
                  {orders.length} total orders
                </span>
              </div>
              <h2 className="text-lg sm:text-xl font-bold text-white tracking-tight">
                All Orders & Shipments Management
              </h2>
            </div>
          </div>

          <div className="flex items-center gap-2.5">
            <button
              onClick={() => {
                downloadAllOrdersCSV(filteredOrders);
                showToast(`Exported ${filteredOrders.length} orders to CSV`, "success");
              }}
              className="px-3.5 py-1.5 rounded-xl bg-amber-500 hover:bg-amber-400 text-black text-xs font-semibold flex items-center gap-1.5 transition-colors shadow-sm cursor-pointer"
            >
              <FileSpreadsheet size={13} />
              <span>Export CSV</span>
            </button>

            <button
              onClick={onClose}
              className="w-8 h-8 rounded-xl bg-white/10 hover:bg-white/20 text-white/80 hover:text-white flex items-center justify-center transition-colors cursor-pointer"
              aria-label="Close modal"
            >
              <X size={16} />
            </button>
          </div>
        </div>

        {/* Toolbar & Filter Bar */}
        <div className="p-5 bg-neutral-50/80 border-b border-neutral-100 space-y-3 shrink-0">
          <div className="flex flex-col sm:flex-row items-stretch sm:items-center justify-between gap-3">
            {/* Search Input */}
            <div className="relative flex-1 max-w-md">
              <Search size={14} className="absolute left-3.5 top-1/2 -translate-y-1/2 text-neutral-400" />
              <input
                type="text"
                value={modalSearch}
                onChange={(e) => setModalSearch(e.target.value)}
                placeholder="Search by Order ID, Customer, Phone, Product..."
                className="w-full pl-9 pr-8 py-2 rounded-xl bg-white border border-neutral-200 text-xs focus:border-amber-500 focus:ring-2 focus:ring-amber-500/20 outline-none transition-all placeholder:text-neutral-400"
              />
              {modalSearch && (
                <button
                  onClick={() => setModalSearch("")}
                  className="absolute right-2.5 top-1/2 -translate-y-1/2 text-neutral-400 hover:text-neutral-700"
                >
                  <X size={13} />
                </button>
              )}
            </div>

            {/* Sort & Quick Summary */}
            <div className="flex items-center gap-3 justify-between sm:justify-end">
              <div className="flex items-center gap-1.5 text-xs text-neutral-500">
                <span className="font-semibold text-neutral-900">{filteredOrders.length}</span>
                <span>orders</span>
                <span>•</span>
                <span className="font-bold text-amber-700">₹{totalGrossRevenue.toLocaleString("en-IN")}</span>
              </div>

              <div className="flex items-center gap-1.5">
                <ArrowUpDown size={13} className="text-neutral-400" />
                <select
                  value={sortBy}
                  onChange={(e) => setSortBy(e.target.value as any)}
                  className="text-xs py-1.5 px-2.5 rounded-xl bg-white border border-neutral-200 font-medium text-neutral-700 outline-none focus:border-amber-500"
                >
                  <option value="newest">Newest First</option>
                  <option value="oldest">Oldest First</option>
                  <option value="highest">Amount: High to Low</option>
                  <option value="lowest">Amount: Low to High</option>
                </select>
              </div>
            </div>
          </div>

          {/* Status Tabs */}
          <div className="flex items-center gap-1.5 overflow-x-auto no-scrollbar pt-1">
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
                  onClick={() => setStatusFilter(tab.id)}
                  className={`px-3 py-1.5 rounded-xl text-xs font-semibold transition-all cursor-pointer whitespace-nowrap flex items-center gap-1.5 ${
                    isActive
                      ? "bg-neutral-900 text-white shadow-2xs"
                      : "bg-white hover:bg-neutral-100 text-neutral-600 border border-neutral-200/70"
                  }`}
                >
                  <span>{tab.label}</span>
                  <span
                    className={`text-[10px] px-1.5 py-0.2 rounded-full ${
                      isActive ? "bg-white/20 text-white" : "bg-neutral-100 text-neutral-500"
                    }`}
                  >
                    {tab.count}
                  </span>
                </button>
              );
            })}
          </div>
        </div>

        {/* Orders Table Container */}
        <div className="overflow-y-auto flex-1">
          <table className="w-full text-left border-collapse" role="table">
            <thead className="sticky top-0 bg-neutral-50/95 backdrop-blur-xs z-10 border-b border-neutral-200 text-xs font-medium text-neutral-400">
              <tr>
                <th className="pl-6 py-3 font-medium">Order ID</th>
                <th className="px-3 py-3 font-medium">Customer</th>
                <th className="px-3 py-3 font-medium">Products</th>
                <th className="px-3 py-3 font-medium">Total</th>
                <th className="px-3 py-3 font-medium">Status</th>
                <th className="px-3 py-3 font-medium">Date</th>
                <th className="pr-6 py-3 font-medium text-right">Actions</th>
              </tr>
            </thead>
            <tbody className="divide-y divide-neutral-100">
              {filteredOrders.length === 0 ? (
                <tr>
                  <td colSpan={7} className="py-12 text-center text-xs text-neutral-400">
                    No orders match your filter criteria.
                  </td>
                </tr>
              ) : (
                filteredOrders.map((order) => {
                  const customerName = order.shippingAddress?.name || "Customer";
                  const avatar = getCustomerAvatar(customerName);
                  const itemCount = order.itemsCount || order.items?.length || 1;
                  const thumbUrl = order.items?.[0]?.imageUrl || "/products/shoes/veyro-shoe-01-primary.webp";

                  return (
                    <tr
                      key={order.id}
                      onClick={() => onSelectOrder(order)}
                      className="hover:bg-amber-50/40 cursor-pointer transition-colors group"
                      title="Click to deep inspect order"
                    >
                      {/* ID */}
                      <td className="pl-6 py-3.5 whitespace-nowrap text-xs font-mono font-bold text-neutral-900 group-hover:text-amber-800">
                        {order.id}
                      </td>

                      {/* Customer */}
                      <td className="px-3 py-3.5 whitespace-nowrap">
                        <div className="flex items-center gap-2.5">
                          <div
                            className={`w-7 h-7 rounded-full ${avatar.bg} ${avatar.text} flex items-center justify-center text-xs font-bold shrink-0`}
                          >
                            {avatar.initial}
                          </div>
                          <div>
                            <span className="text-xs sm:text-sm font-semibold text-neutral-900 block">
                              {customerName}
                            </span>
                            <span className="text-[10px] text-neutral-400 font-mono">
                              {order.shippingAddress?.phone || "Prepaid"}
                            </span>
                          </div>
                        </div>
                      </td>

                      {/* Products */}
                      <td className="px-3 py-3.5 whitespace-nowrap">
                        <div className="flex items-center gap-2">
                          <div className="w-7 h-7 rounded-lg bg-neutral-100 overflow-hidden shrink-0 border border-neutral-200/60 flex items-center justify-center">
                            <Image
                              src={thumbUrl}
                              alt="Thumbnail"
                              width={28}
                              height={28}
                              className="w-full h-full object-cover"
                            />
                          </div>
                          <span className="text-xs text-neutral-600 font-medium">
                            {itemCount} {itemCount === 1 ? "item" : "items"}
                          </span>
                        </div>
                      </td>

                      {/* Total */}
                      <td className="px-3 py-3.5 whitespace-nowrap">
                        <span className="text-xs sm:text-sm font-extrabold text-neutral-900">
                          ₹{order.total.toLocaleString("en-IN")}
                        </span>
                      </td>

                      {/* Status */}
                      <td className="px-3 py-3.5 whitespace-nowrap">
                        <StatusPill status={order.status} />
                      </td>

                      {/* Date */}
                      <td className="px-3 py-3.5 whitespace-nowrap text-xs text-neutral-500">
                        {order.date}
                      </td>

                      {/* Actions */}
                      <td className="px-3 py-3.5 whitespace-nowrap text-right">
                        <button
                          onClick={() => {
                            onSelectOrder(order);
                          }}
                          className="w-8 h-8 rounded-full bg-neutral-100 hover:bg-neutral-200 text-neutral-600 flex items-center justify-center transition-colors ml-auto cursor-pointer"
                        >
                          <Eye size={14} />
                        </button>
                      </td>
                    </tr>
                  );
                })
              )}
            </tbody>
          </table>
        </div>
      </div>
    </div>
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
          className="w-8 h-8 rounded-xl bg-amber-500/15 text-amber-700 border border-amber-500/25 flex items-center justify-center shrink-0 shadow-2xs mt-0.5 group-hover:scale-105 transition-transform"
          aria-hidden="true"
        >
          <RotateCcw size={15} strokeWidth={2.2} />
        </div>
      );
    case "order_delivered":
      return (
        <div
          className="w-8 h-8 rounded-xl bg-emerald-500/15 text-emerald-700 border border-emerald-500/25 flex items-center justify-center shrink-0 shadow-2xs mt-0.5 group-hover:scale-105 transition-transform"
          aria-hidden="true"
        >
          <CheckCircle2 size={15} strokeWidth={2.2} />
        </div>
      );
    case "low_stock":
      return (
        <div
          className="w-8 h-8 rounded-xl bg-rose-500/15 text-rose-700 border border-rose-500/25 flex items-center justify-center shrink-0 shadow-2xs mt-0.5 group-hover:scale-105 transition-transform"
          aria-hidden="true"
        >
          <AlertTriangle size={15} strokeWidth={2.2} />
        </div>
      );
    case "new_order":
      return (
        <div
          className="w-8 h-8 rounded-xl bg-sky-500/15 text-sky-700 border border-sky-500/25 flex items-center justify-center shrink-0 shadow-2xs mt-0.5 group-hover:scale-105 transition-transform"
          aria-hidden="true"
        >
          <ShoppingBag size={15} strokeWidth={2.2} />
        </div>
      );
    default:
      return (
        <div
          className="w-8 h-8 rounded-xl bg-neutral-100 text-neutral-700 border border-neutral-200 flex items-center justify-center shrink-0 shadow-2xs mt-0.5 group-hover:scale-105 transition-transform"
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
  const { orders, updateOrderStatus, reviewReturnRequest } = useUser();
  const router = useRouter();

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



  // Search filter
  const [searchQuery, setSearchQuery] = useState("");

  // Comprehensive Date Range & Day-Wise Filter State
  const [dateFilter, setDateFilter] = useState<DateFilterSelection>({
    type: "all",
    label: "All Time (Till Date)",
    startDate: "2026-01-01",
    endDate: "2026-10-03",
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

  // Add Product dropdown
  const [isAddMenuOpen, setIsAddMenuOpen] = useState(false);
  const addMenuRef = useRef<HTMLDivElement>(null);

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
  const [isDonutSpinning, setIsDonutSpinning] = useState(false);

  const handleRefreshDonut = () => {
    setIsDonutSpinning(true);
    setTimeout(() => {
      setIsDonutSpinning(false);
    }, 750);
  };

  // Click outside handlers
  useEffect(() => {
    function handleClickOutside(e: MouseEvent) {
      if (notifRef.current && !notifRef.current.contains(e.target as Node)) {
        setIsNotifOpen(false);
      }
      if (addMenuRef.current && !addMenuRef.current.contains(e.target as Node)) {
        setIsAddMenuOpen(false);
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
          // All Time / Till Date: show full accumulated volume up to today (03 Oct 2026)
          soldCount = p.timeframeStats.allTime.soldCount + (real ? real.soldCount : 0);
          revenue = p.timeframeStats.allTime.revenue + (real ? real.revenue : 0);
          growth = p.timeframeStats.allTime.growth;
        } else if (dateFilter.type === "day") {
          // Day-wise: specific single day sales volume
          if (dateFilter.singleDay === "2026-10-03" || dateFilter.startDate === "2026-10-03") {
            soldCount = Math.max(p.timeframeStats.today.soldCount, real ? real.soldCount : 0);
            revenue = soldCount * p.unitPrice;
            growth = p.timeframeStats.today.growth;
          } else if (dateFilter.singleDay === "2026-10-02" || dateFilter.startDate === "2026-10-02") {
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
      if (o.status === "Delivered") delivered++;
      else if (o.status === "Processing" || o.status === "Confirmed" || o.status === "Packed") processing++;
      else if (o.status === "Shipped" || o.status === "Out for Delivery") shipped++;
      else if (o.status === "Cancelled") cancelled++;
      else if (o.status === "Returned" || o.status === "Return Requested") returned++;
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
        if (recentOrdersStatusFilter === "Delivered") return o.status === "Delivered";
        if (recentOrdersStatusFilter === "Processing") return o.status === "Processing" || o.status === "Confirmed" || o.status === "Packed";
        if (recentOrdersStatusFilter === "Shipped") return o.status === "Shipped" || o.status === "Out for Delivery";
        if (recentOrdersStatusFilter === "Cancelled") return o.status === "Cancelled";
        if (recentOrdersStatusFilter === "Returned") return o.status === "Returned" || o.status === "Return Requested";
        return true;
      });
    }

    if (selectedStatusFilter) {
      list = list.filter((o) => {
        if (selectedStatusFilter === "Delivered") return o.status === "Delivered";
        if (selectedStatusFilter === "Processing") return o.status === "Processing" || o.status === "Confirmed" || o.status === "Packed";
        if (selectedStatusFilter === "Shipped") return o.status === "Shipped" || o.status === "Out for Delivery";
        if (selectedStatusFilter === "Cancelled") return o.status === "Cancelled";
        if (selectedStatusFilter === "Returned") return o.status === "Returned" || o.status === "Return Requested";
        return true;
      });
    }

    if (searchQuery.trim()) {
      const q = searchQuery.toLowerCase().trim();
      list = list.filter(
        (o) =>
          o.id.toLowerCase().includes(q) ||
          o.shippingAddress?.name?.toLowerCase().includes(q) ||
          o.status.toLowerCase().includes(q) ||
          o.shippingAddress?.phone?.includes(q) ||
          o.shippingAddress?.address?.toLowerCase().includes(q) ||
          o.items?.some(
            (it) => it.productName.toLowerCase().includes(q) || it.colorName.toLowerCase().includes(q)
          )
      );
    }

    return list;
  }, [dateFilteredOrders, recentOrdersStatusFilter, selectedStatusFilter, searchQuery]);

  const RECENT_ORDERS_PAGE_SIZE = 5;
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
        label:
          day === "2026-10-03"
            ? "Today (03 Oct)"
            : day === "2026-10-02"
            ? "Yesterday (02 Oct)"
            : formatDayDisplay(day),
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

  // Max daily revenue for visualizer chart scaling
  const maxDayRevenue = useMemo(() => {
    if (availableOrderDays.length === 0) return 1;
    return Math.max(...availableOrderDays.map((d) => d.totalRevenue), 1);
  }, [availableOrderDays]);

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
      peakDate: chartData[peakIdx]?.dateStr || "Sep 30, 2026",
      peakVal: maxVal,
      growthPct: chartPeriod === "7d" ? "+14.2%" : chartPeriod === "30d" ? "+18.4%" : "+24.8%",
    };
  }, [chartData, chartPeriod]);

  return (
    <div className="space-y-6 text-neutral-900 pb-16 font-sans">
      {/* ── TOP BAR: SEARCH, DATE RANGE, NOTIFICATIONS, PROFILE ──────────────── */}
      <header className="flex flex-col md:flex-row items-center justify-between gap-4">
        {/* Search Input with / shortcut and instant live results palette */}
        <AdminGlobalSearchBar
          searchQuery={searchQuery}
          setSearchQuery={setSearchQuery}
          orders={orders}
          products={products}
          onSelectOrder={(orderId) => {
            setSearchQuery(orderId);
          }}
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
              className="relative p-2.5 bg-white rounded-xl border border-neutral-200/80 hover:bg-neutral-50
                hover:border-neutral-300 text-neutral-600 shadow-2xs transition-all cursor-pointer"
              aria-label="View notifications"
            >
              <Bell size={16} />
              {unreadNotifCount > 0 && (
                <span className="absolute -top-1 -right-1 min-w-[18px] h-[18px] px-1 bg-red-500 text-white rounded-full text-[10px] font-bold flex items-center justify-center ring-2 ring-white animate-in zoom-in-50">
                  {unreadNotifCount}
                </span>
              )}
            </button>

            {isNotifOpen && (
              <div
                className="absolute right-0 top-full mt-2 w-80 sm:w-96 bg-white rounded-2xl border border-neutral-200 shadow-2xl p-3 z-40 text-xs animate-in fade-in zoom-in-95 duration-150"
                onClick={(e) => e.stopPropagation()}
              >
                {/* Header */}
                <div className="flex items-center justify-between pb-2 mb-2 border-b border-neutral-100">
                  <div className="flex items-center gap-2">
                    <span className="font-bold text-neutral-900 text-sm">Notifications</span>
                    {unreadNotifCount > 0 ? (
                      <span className="px-1.5 py-0.5 rounded-full text-[10px] font-bold bg-amber-100 text-amber-900">
                        {unreadNotifCount} new
                      </span>
                    ) : (
                      <span className="px-1.5 py-0.5 rounded-full text-[10px] font-semibold bg-emerald-50 text-emerald-700">
                        All read
                      </span>
                    )}
                  </div>
                  {unreadNotifCount > 0 && (
                    <button
                      type="button"
                      onClick={handleMarkAllRead}
                      className="text-[11px] text-amber-700 hover:text-amber-900 font-semibold cursor-pointer hover:underline"
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
                    className={`px-2.5 py-1 rounded-lg text-[11px] font-semibold transition-all cursor-pointer ${
                      notifFilter === "all"
                        ? "bg-neutral-900 text-white shadow-2xs"
                        : "bg-neutral-100 text-neutral-600 hover:bg-neutral-200/70"
                    }`}
                  >
                    All ({notifications.length})
                  </button>
                  <button
                    type="button"
                    onClick={() => setNotifFilter("unread")}
                    className={`px-2.5 py-1 rounded-lg text-[11px] font-semibold transition-all cursor-pointer flex items-center gap-1 ${
                      notifFilter === "unread"
                        ? "bg-amber-500 text-white shadow-2xs"
                        : "bg-neutral-100 text-neutral-600 hover:bg-neutral-200/70"
                    }`}
                  >
                    <span>Unread</span>
                    {unreadNotifCount > 0 && (
                      <span className={`px-1 py-0.2 rounded-full text-[9px] font-extrabold ${
                        notifFilter === "unread" ? "bg-amber-600 text-white" : "bg-neutral-200 text-neutral-800"
                      }`}>
                        {unreadNotifCount}
                      </span>
                    )}
                  </button>
                  {notifications.length > 0 && (
                    <button
                      type="button"
                      onClick={handleClearAllNotifs}
                      className="ml-auto text-[10.5px] text-neutral-400 hover:text-rose-600 font-medium cursor-pointer transition-colors"
                    >
                      Clear all
                    </button>
                  )}
                </div>

                {/* Notification List */}
                <div className="space-y-2 max-h-[320px] overflow-y-auto pr-0.5">
                  {filteredNotifications.length === 0 ? (
                    <div className="py-8 text-center">
                      <div className="w-10 h-10 rounded-full bg-emerald-50 text-emerald-600 flex items-center justify-center mx-auto mb-2 text-base shadow-2xs border border-emerald-100">
                        <CheckCircle2 size={18} strokeWidth={2.2} />
                      </div>
                      <p className="font-semibold text-neutral-800 text-xs">All caught up!</p>
                      <p className="text-[11px] text-neutral-400 mt-0.5">
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
                        className={`group relative p-2.5 rounded-xl border flex items-start gap-2.5 cursor-pointer transition-all ${
                          n.isRead
                            ? "bg-white border-neutral-100/90 text-neutral-600 hover:bg-neutral-50/80"
                            : n.type === "return_request"
                            ? "bg-[#fff8ee] border-[#fdecd2] hover:bg-[#fdf0e0] shadow-2xs"
                            : "bg-neutral-50/90 border-neutral-200/70 hover:bg-neutral-100/80 shadow-2xs"
                        }`}
                      >
                        <NotificationIconBadge type={n.type} />

                        <div className="flex-1 min-w-0 pr-4">
                          <div className="flex items-center gap-1.5">
                            <p className={`font-semibold truncate leading-snug ${
                              n.isRead
                                ? "text-neutral-700"
                                : n.type === "return_request"
                                ? "text-orange-950 font-bold"
                                : "text-neutral-900 font-bold"
                            }`}>
                              {n.title}
                            </p>
                            {!n.isRead && (
                              <span className="w-1.5 h-1.5 rounded-full bg-amber-500 shrink-0" />
                            )}
                          </div>
                          <p className={`text-[11px] mt-0.5 leading-tight truncate ${
                            n.type === "return_request" && !n.isRead
                              ? "text-orange-900/80 font-medium"
                              : "text-neutral-500"
                          }`}>
                            {n.subtitle}
                          </p>
                          <span className="text-[10px] text-neutral-400 mt-1 block">
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
                            className="p-1 hover:bg-neutral-200/70 rounded text-neutral-400 hover:text-neutral-700 cursor-pointer"
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
                            className="p-1 hover:bg-rose-100 rounded text-neutral-400 hover:text-rose-600 cursor-pointer"
                          >
                            <X size={12} />
                          </button>
                        </div>
                      </div>
                    ))
                  )}
                </div>

                {/* Popover Footer */}
                <div className="pt-2 mt-2 border-t border-neutral-100 flex items-center justify-between text-[11px]">
                  <Link
                    href="/admin/orders"
                    onClick={() => setIsNotifOpen(false)}
                    className="text-neutral-600 hover:text-neutral-900 font-semibold flex items-center gap-1 hover:underline"
                  >
                    <span>View all orders</span>
                    <ChevronRight size={12} />
                  </Link>
                  <span className="text-[10.5px] text-neutral-400">
                    VEYRO Admin
                  </span>
                </div>
              </div>
            )}
          </div>

          {/* User Profile */}
          <div className="flex items-center gap-2.5 pl-1.5 cursor-pointer">
            <div className="w-9 h-9 rounded-full bg-black text-white flex items-center justify-center font-bold text-sm tracking-wide shrink-0 shadow-2xs">
              S
            </div>
            <div className="hidden sm:block text-left">
              <div className="text-xs font-bold text-neutral-900 leading-tight">
                Santhosh S
              </div>
              <div className="text-[11px] text-neutral-400 font-medium leading-tight">
                Admin
              </div>
            </div>
          </div>
        </div>
      </header>

      {/* ── GREETING & TOP ACTION PILL + ADD PRODUCT BUTTON ───────────────────── */}
      <section className="flex flex-col lg:flex-row lg:items-center justify-between gap-4 pt-1">
        <div>
          <h1 className="text-2xl sm:text-3xl font-extrabold text-neutral-900 tracking-tight">
            Good Afternoon, Santhosh!
          </h1>
          <p className="text-xs sm:text-sm text-neutral-400 font-normal mt-1">
            Here&apos;s what&apos;s happening with your VEYRO store today.
          </p>
        </div>

        <div className="flex flex-wrap items-center gap-3">
          {/* Return Requests Alert Pill */}
          <button
            type="button"
            onClick={() => setIsReturnModalOpen(true)}
            className="flex items-center gap-2.5 px-4 py-2 bg-[#fff8ee] border border-[#fdecd2]
              rounded-xl shadow-2xs hover:bg-[#fdf0e0] hover:border-[#fcd9b0] transition-all cursor-pointer group text-left"
          >
            <span className="w-6 h-6 rounded-lg bg-orange-500/15 text-orange-700 border border-orange-500/25 flex items-center justify-center shrink-0">
              <RotateCcw size={12} strokeWidth={2.4} />
            </span>
            <span className="text-xs sm:text-sm font-semibold text-[#a83232]">
              {pendingReturnsCount > 0
                ? `${pendingReturnsCount} return request${pendingReturnsCount === 1 ? "" : "s"} pending review`
                : "All return requests reviewed"}
            </span>
            <ChevronRight size={14} className="text-[#a83232] transition-transform group-hover:translate-x-0.5" />
          </button>

          {/* Add Product Button with Rich Menu */}
          <div className="relative" ref={addMenuRef}>
            <button
              onClick={() => setIsAddMenuOpen(!isAddMenuOpen)}
              className="flex items-center gap-2 bg-[#fceb3b] hover:bg-[#fad800] text-black px-4 py-2.5
                rounded-xl text-xs sm:text-sm font-bold shadow-2xs hover:shadow-xs transition-all cursor-pointer"
            >
              <Plus size={16} strokeWidth={2.5} />
              <span>Add Product</span>
              <ChevronDown size={14} strokeWidth={2} />
            </button>

            {isAddMenuOpen && (
              <div className="absolute right-0 top-full mt-1.5 w-56 bg-white rounded-2xl border border-neutral-200/90 shadow-2xl py-2 z-50 text-xs font-semibold text-neutral-800 animate-in fade-in slide-in-from-top-1 duration-150">
                <Link
                  href="/admin/products/add"
                  onClick={() => setIsAddMenuOpen(false)}
                  className="w-full text-left px-4 py-2.5 hover:bg-neutral-50 flex items-center justify-between group transition-colors"
                >
                  <div className="flex items-center gap-2.5">
                    <div className="w-7 h-7 rounded-lg bg-amber-50 text-amber-700 flex items-center justify-center shrink-0">
                      <Plus size={15} strokeWidth={2.5} />
                    </div>
                    <div>
                      <div className="font-bold text-neutral-900 group-hover:text-amber-600 transition-colors">New Product</div>
                      <div className="text-[10.5px] text-neutral-400 font-normal">Add single item to catalog</div>
                    </div>
                  </div>
                </Link>

                <Link
                  href="/admin/products"
                  onClick={() => setIsAddMenuOpen(false)}
                  className="w-full text-left px-4 py-2.5 hover:bg-neutral-50 flex items-center justify-between group transition-colors"
                >
                  <div className="flex items-center gap-2.5">
                    <div className="w-7 h-7 rounded-lg bg-blue-50 text-blue-700 flex items-center justify-center shrink-0">
                      <Package size={15} />
                    </div>
                    <div>
                      <div className="font-bold text-neutral-900 group-hover:text-blue-600 transition-colors">Manage Catalog</div>
                      <div className="text-[10.5px] text-neutral-400 font-normal">Full inventory & pricing</div>
                    </div>
                  </div>
                  <span className="px-1.5 py-0.5 rounded-md text-[10px] font-bold bg-neutral-100 text-neutral-700 font-mono">
                    {products.length}
                  </span>
                </Link>

                <div className="my-1 border-t border-neutral-100" />

                <Link
                  href="/admin/returns"
                  onClick={() => setIsAddMenuOpen(false)}
                  className="w-full text-left px-4 py-2.5 hover:bg-neutral-50 flex items-center justify-between group transition-colors"
                >
                  <div className="flex items-center gap-2.5">
                    <div className="w-7 h-7 rounded-lg bg-orange-50 text-orange-700 flex items-center justify-center shrink-0">
                      <RotateCcw size={14} />
                    </div>
                    <div>
                      <div className="font-bold text-neutral-900 group-hover:text-orange-600 transition-colors">Returns Portal</div>
                      <div className="text-[10.5px] text-neutral-400 font-normal">Process refund claims</div>
                    </div>
                  </div>
                  {pendingReturnsCount > 0 && (
                    <span className="px-1.5 py-0.5 rounded-full text-[10px] font-extrabold bg-amber-400 text-black font-mono">
                      {pendingReturnsCount}
                    </span>
                  )}
                </Link>

                <Link
                  href="/admin/orders"
                  onClick={() => setIsAddMenuOpen(false)}
                  className="w-full text-left px-4 py-2.5 hover:bg-neutral-50 flex items-center justify-between group transition-colors"
                >
                  <div className="flex items-center gap-2.5">
                    <div className="w-7 h-7 rounded-lg bg-emerald-50 text-emerald-700 flex items-center justify-center shrink-0">
                      <ShoppingCart size={14} />
                    </div>
                    <div>
                      <div className="font-bold text-neutral-900 group-hover:text-emerald-600 transition-colors">Orders & Sales</div>
                      <div className="text-[10.5px] text-neutral-400 font-normal">Real-time fulfillment</div>
                    </div>
                  </div>
                  <span className="px-1.5 py-0.5 rounded-md text-[10px] font-bold bg-neutral-100 text-neutral-700 font-mono">
                    {orders.length}
                  </span>
                </Link>
              </div>
            )}
          </div>
        </div>
      </section>

      {/* ── PROMINENT DUAL MODE SWITCHER: ALL TIME (TILL DATE) vs DAY-WISE BREAKDOWN ── */}
      <div className="flex flex-wrap items-center justify-between gap-3 p-3 bg-white rounded-2xl border border-neutral-200/80 shadow-xs">
        <div className="flex items-center gap-2">
          <div className="flex items-center p-1 bg-neutral-100 rounded-xl border border-neutral-200">
            <button
              onClick={handleSelectTillDate}
              className={`flex items-center gap-2 px-3.5 py-2 rounded-lg text-xs font-bold transition-all cursor-pointer ${
                dateFilter.type === "all"
                  ? "bg-neutral-900 text-[#fde047] shadow-sm scale-[1.02]"
                  : "text-neutral-600 hover:text-neutral-900 hover:bg-white/60"
              }`}
            >
              <CalendarDays size={14} className={dateFilter.type === "all" ? "text-[#fde047]" : "text-neutral-500"} />
              <span>All Time (Till Date)</span>
            </button>

            <button
              onClick={handleSelectDayWiseMode}
              className={`flex items-center gap-2 px-3.5 py-2 rounded-lg text-xs font-bold transition-all cursor-pointer ${
                dateFilter.type === "day"
                  ? "bg-neutral-900 text-[#fde047] shadow-sm scale-[1.02]"
                  : "text-neutral-600 hover:text-neutral-900 hover:bg-white/60"
              }`}
            >
              <Calendar size={14} className={dateFilter.type === "day" ? "text-[#fde047]" : "text-neutral-500"} />
              <span>Day-Wise Breakdown</span>
            </button>
          </div>

          <span className="hidden sm:inline-block text-xs font-medium text-neutral-400">
            {dateFilter.type === "all"
              ? "• Showing all cumulative sales since store launch"
              : `• Focused on ${dateFilter.label}`}
          </span>
        </div>

        <div className="flex items-center gap-2">
          <AdminDateRangePicker
            currentFilter={dateFilter}
            onSelectFilter={(newFilter) => {
              setDateFilter(newFilter);
              triggerToast(`Applied period: ${newFilter.label}`, "info");
            }}
            orders={orders}
            compact
            align="right"
          />
        </div>
      </div>

      {/* ── TILL DATE (LIFETIME SCOPE) BANNER ── */}
      {dateFilter.type === "all" && (
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
              <div className="px-4 py-2 rounded-xl bg-white/[0.07] border border-white/10 text-right">
                <span className="block text-[10px] uppercase tracking-wider text-neutral-400">Total Lifetime GMV</span>
                <span className="text-base font-bold text-[#fde047] font-mono">
                  ₹{stats.totalRev.toLocaleString("en-IN")}
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

      {/* ── DAY-WISE INTERACTIVE NAVIGATION HUB ── */}
      {dateFilter.type === "day" && (
        <div className="bg-white rounded-2xl p-5 border border-neutral-200/80 shadow-xs space-y-4 animate-in fade-in duration-150">
          <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-3 border-b border-neutral-100 pb-3">
            <div className="flex items-center gap-2">
              <span className="px-2.5 py-0.5 rounded-full text-[10px] font-extrabold uppercase bg-amber-400 text-black">
                Day-Wise Active
              </span>
              <h2 className="text-sm font-bold text-neutral-900">
                Browsing: <span className="font-mono text-neutral-950 underline decoration-amber-400 decoration-2">{dateFilter.label}</span>
              </h2>
              <span className="text-xs text-neutral-500 font-mono">
                ({stats.totalOrd} {stats.totalOrd === 1 ? "order" : "orders"} • ₹{stats.totalRev.toLocaleString("en-IN")})
              </span>
            </div>

            {/* Stepper Buttons & Till Date Reset */}
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

              <button
                onClick={handleSelectTillDate}
                className="ml-1 text-xs font-bold text-amber-700 hover:text-amber-900 hover:underline cursor-pointer"
              >
                Reset to Till Date
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

      {/* ── CUSTOM / PRESET PERIOD BANNER (When NOT in all-time or single day) ── */}
      {dateFilter.type !== "all" && dateFilter.type !== "day" && (
        <div className="flex flex-wrap items-center justify-between gap-3 p-3.5 px-4 bg-gradient-to-r from-amber-500/10 via-amber-400/5 to-transparent border border-amber-300/80 rounded-2xl text-xs text-amber-950 shadow-2xs animate-in fade-in slide-in-from-top-1 duration-200">
          <div className="flex items-center gap-3">
            <div className="w-8 h-8 rounded-xl bg-amber-500/20 text-amber-800 flex items-center justify-center shrink-0">
              <CalendarDays size={16} />
            </div>
            <div>
              <div className="flex items-center gap-2">
                <span className="font-bold text-neutral-900 text-sm">
                  {dateFilter.label}
                </span>
                <span className="px-2 py-0.5 rounded-full text-[10px] font-bold bg-amber-200/80 text-amber-900">
                  Custom Period Filter
                </span>
              </div>
              <p className="text-[11px] text-neutral-500 mt-0.5">
                Showing <strong>{stats.totalOrd}</strong> order{stats.totalOrd === 1 ? "" : "s"} totaling <strong className="text-neutral-800">₹{stats.totalRev.toLocaleString("en-IN")}</strong> in store volume
              </p>
            </div>
          </div>
          <div className="flex items-center gap-2">
            <button
              onClick={handleSelectTillDate}
              className="flex items-center gap-1.5 px-3 py-1.5 rounded-xl bg-white border border-amber-300/90 text-amber-900 font-semibold hover:bg-amber-100 hover:border-amber-400 transition-all cursor-pointer shadow-2xs"
            >
              <RotateCcw size={12} />
              Reset to All Time (Till Date)
            </button>
          </div>
        </div>
      )}

      {/* ── 4 STAT CARDS ────────────────────────────────────────────────────── */}
      <section className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-4">
        {/* Card 1: Total Revenue */}
        <div className="bg-white rounded-[22px] border border-black/[0.04] p-6 shadow-[0_1px_3px_rgba(0,0,0,0.02)] flex flex-col justify-between">
          <div>
            <div className="flex items-center gap-3">
              <div className="w-10 h-10 rounded-2xl bg-[#fff8e7] flex items-center justify-center shrink-0 p-1.5 shadow-2xs">
                <Image
                  src="/images/admin/rupee-3d-gold.png"
                  alt="Total Revenue"
                  width={28}
                  height={28}
                  className="w-full h-full object-contain drop-shadow-[0_1px_2px_rgba(0,0,0,0.08)]"
                  priority
                />
              </div>
              <span className="text-[13px] font-medium text-neutral-600">Total Revenue</span>
            </div>
            <div className="text-[32px] font-bold text-neutral-900 tracking-tight leading-none mt-3.5 mb-2.5">
              ₹{stats.totalRev.toLocaleString("en-IN")}
            </div>
          </div>

          <div className="flex items-end justify-between pt-1">
            <div className="flex items-center gap-1 text-xs">
              <span className="font-bold text-emerald-500">
                ↑ 14%
              </span>
              <span className="text-neutral-400 font-normal ml-0.5">
                {dateFilter.type === "day" ? "on this day" : dateFilter.type === "all" ? "vs last month" : "in this period"}
              </span>
            </div>
            <div className="shrink-0 -mb-1">
              <SparklineBars />
            </div>
          </div>
        </div>

        {/* Card 2: Total Orders */}
        <div className="bg-white rounded-[22px] border border-black/[0.04] p-6 shadow-[0_1px_3px_rgba(0,0,0,0.02)] flex flex-col justify-between">
          <div>
            <div className="flex items-center gap-3">
              <div className="w-10 h-10 rounded-2xl bg-[#fff8e7] flex items-center justify-center shrink-0 p-1.5 shadow-2xs">
                <Image
                  src="/images/admin/cart-3d-gold.png"
                  alt="Total Orders"
                  width={28}
                  height={28}
                  className="w-full h-full object-contain drop-shadow-[0_1px_2px_rgba(0,0,0,0.08)]"
                  priority
                />
              </div>
              <span className="text-[13px] font-medium text-neutral-600">Total Orders</span>
            </div>
            <div className="text-[32px] font-bold text-neutral-900 tracking-tight leading-none mt-3.5 mb-2.5">
              {stats.totalOrd}
            </div>
          </div>

          <div className="flex items-end justify-between pt-1">
            <div className="flex items-center gap-1 text-xs">
              <span className="font-bold text-emerald-500">
                ↑ 14%
              </span>
              <span className="text-neutral-400 font-normal ml-0.5">
                {dateFilter.type === "day" ? "on this day" : dateFilter.type === "all" ? "vs last month" : "in this period"}
              </span>
            </div>
            <div className="shrink-0 -mb-1">
              <SparklineBlackLine />
            </div>
          </div>
        </div>

        {/* Card 3: Total Products */}
        <div className="bg-white rounded-[22px] border border-black/[0.04] p-6 shadow-[0_1px_3px_rgba(0,0,0,0.02)] flex flex-col justify-between">
          <div>
            <div className="flex items-center gap-3">
              <div className="w-10 h-10 rounded-2xl bg-[#fff1f1] flex items-center justify-center shrink-0">
                <svg width="20" height="20" viewBox="0 0 24 24" fill="none">
                  <path d="M12 2.5 L20 7 L12 11.5 L4 7 Z" fill="#fee2e2" stroke="#ef4444" strokeWidth="1.5" strokeLinejoin="round" />
                  <path d="M4 7 L12 11.5 V21.5 L4 17 Z" fill="#fecaca" stroke="#ef4444" strokeWidth="1.5" strokeLinejoin="round" />
                  <path d="M12 11.5 L20 7 V17 L12 21.5 Z" fill="#fca5a5" stroke="#ef4444" strokeWidth="1.5" strokeLinejoin="round" />
                </svg>
              </div>
              <span className="text-[13px] font-medium text-neutral-600">Total Products</span>
            </div>
            <div className="text-[32px] font-bold text-neutral-900 tracking-tight leading-none mt-3.5 mb-2.5">
              {stats.totalProd}
            </div>
          </div>

          <div className="flex items-end justify-between pt-1">
            <div className="flex items-center gap-1 text-xs">
              <span className="font-bold text-red-500">
                ↓ 14%
              </span>
              <span className="text-neutral-400 font-normal ml-0.5">active catalog</span>
            </div>
            <div className="shrink-0 -mb-1">
              <SparklineRedWave />
            </div>
          </div>
        </div>

        {/* Card 4: Avg. Order Value */}
        <div className="bg-white rounded-[22px] border border-black/[0.04] p-6 shadow-[0_1px_3px_rgba(0,0,0,0.02)] flex flex-col justify-between">
          <div>
            <div className="flex items-center gap-3">
              <div className="w-10 h-10 rounded-2xl bg-[#e8f7f5] flex items-center justify-center shrink-0">
                <svg width="18" height="18" viewBox="0 0 24 24" fill="none">
                  <rect x="3" y="14" width="4" height="7" rx="1" fill="#0d9488" />
                  <rect x="10" y="8" width="4" height="13" rx="1" fill="#0d9488" />
                  <rect x="17" y="3" width="4" height="18" rx="1" fill="#0d9488" />
                </svg>
              </div>
              <span className="text-[13px] font-medium text-neutral-600">Avg. Order Value</span>
            </div>
            <div className="text-[32px] font-bold text-neutral-900 tracking-tight leading-none mt-3.5 mb-2.5">
              ₹{stats.aov.toLocaleString("en-IN")}
            </div>
          </div>

          <div className="flex items-end justify-between pt-1">
            <div className="flex items-center gap-1 text-xs">
              <span className="font-bold text-emerald-500">
                ↑ 14%
              </span>
              <span className="text-neutral-400 font-normal ml-0.5">
                {dateFilter.type === "day" ? "on this day" : dateFilter.type === "all" ? "vs last month" : "in this period"}
              </span>
            </div>
            <div className="shrink-0 -mb-1">
              <SparklineGreenWave />
            </div>
          </div>
        </div>
      </section>

      {/* ── MIDDLE ROW: REVENUE OVERVIEW & ORDER STATUS ───────────────────────── */}
      <section className="grid grid-cols-1 lg:grid-cols-12 gap-5">
        {/* Left: Revenue Overview (8 cols) */}
        <div className="lg:col-span-8 bg-white rounded-[22px] border border-black/[0.04] p-6 shadow-[0_1px_3px_rgba(0,0,0,0.02)] flex flex-col justify-between">
          {/* Header Row */}
          <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-3 mb-3">
            <div className="flex items-center gap-3">
              <div className="w-10 h-10 rounded-2xl bg-[#fff8e7] text-amber-600 flex items-center justify-center shrink-0 shadow-2xs">
                <BarChart3 size={18} className="text-amber-600" />
              </div>
              <div>
                <h2 className="text-[17px] font-bold text-neutral-900 leading-tight tracking-tight">
                  Revenue Overview
                </h2>
                <p className="text-xs text-neutral-400 font-normal mt-0.5">
                  Sales performance over time
                </p>
              </div>
            </div>

            <div className="flex items-center gap-2.5">
              {/* Metric mode toggle: Revenue vs Orders */}
              <div className="hidden sm:flex items-center bg-[#f3f4f6] border border-neutral-200/80 rounded-xl p-1 gap-1 text-xs font-semibold shadow-2xs">
                <button
                  type="button"
                  onClick={() => setRevenueMetricMode("revenue")}
                  className={`group flex items-center gap-1.5 px-3 py-1.5 rounded-lg transition-all cursor-pointer ${
                    revenueMetricMode === "revenue"
                      ? "bg-white text-neutral-950 shadow-xs border border-neutral-200/90 font-bold"
                      : "text-neutral-500 hover:text-neutral-950 hover:bg-white/60 border border-transparent"
                  }`}
                  aria-pressed={revenueMetricMode === "revenue"}
                >
                  <span
                    className={`w-4 h-4 rounded-md flex items-center justify-center shrink-0 transition-colors ${
                      revenueMetricMode === "revenue"
                        ? "bg-amber-500/15 text-amber-800"
                        : "bg-neutral-200/70 text-neutral-500 group-hover:text-neutral-800"
                    }`}
                  >
                    <IndianRupee size={11} strokeWidth={2.8} />
                  </span>
                  <span>Revenue</span>
                </button>
                <button
                  type="button"
                  onClick={() => setRevenueMetricMode("orders")}
                  className={`group flex items-center gap-1.5 px-3 py-1.5 rounded-lg transition-all cursor-pointer ${
                    revenueMetricMode === "orders"
                      ? "bg-white text-neutral-950 shadow-xs border border-neutral-200/90 font-bold"
                      : "text-neutral-500 hover:text-neutral-950 hover:bg-white/60 border border-transparent"
                  }`}
                  aria-pressed={revenueMetricMode === "orders"}
                >
                  <span
                    className={`w-4 h-4 rounded-md flex items-center justify-center shrink-0 transition-colors ${
                      revenueMetricMode === "orders"
                        ? "bg-sky-500/15 text-sky-800"
                        : "bg-neutral-200/70 text-neutral-500 group-hover:text-neutral-800"
                    }`}
                  >
                    <ShoppingBag size={11} strokeWidth={2.4} />
                  </span>
                  <span>Orders</span>
                </button>
              </div>

              {/* Period selector pill */}
              <div className="flex items-center bg-[#f3f4f6] border border-neutral-200/80 rounded-xl p-1 gap-1 shadow-2xs">
                {(["7d", "30d", "90d"] as const).map((p) => {
                  const label = p === "7d" ? "7 Days" : p === "30d" ? "30 Days" : "90 Days";
                  const isActive = chartPeriod === p;
                  return (
                    <button
                      key={p}
                      onClick={() => setChartPeriod(p)}
                      className={`px-3 py-1.5 rounded-lg text-xs font-semibold transition-all cursor-pointer ${
                        isActive
                          ? "bg-black text-white shadow-xs font-bold"
                          : "text-neutral-600 hover:text-black hover:bg-white/50"
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
          <div className="flex flex-wrap items-center justify-between gap-3 pt-2 pb-3 mb-2 border-b border-neutral-100/80">
            <div className="flex items-baseline gap-3">
              <div>
                <span className="text-[10.5px] font-semibold text-neutral-400 uppercase tracking-wider block">
                  {revenueMetricMode === "revenue" ? "Period Revenue" : "Period Orders"}
                </span>
                <div className="flex items-center gap-2 mt-0.5">
                  <span className="text-2xl font-extrabold text-neutral-900 tracking-tight">
                    {revenueMetricMode === "revenue"
                      ? `₹${revenueSummary.totalRev.toLocaleString("en-IN")}`
                      : `${revenueSummary.totalOrd} Orders`}
                  </span>
                  <span className="inline-flex items-center gap-0.5 px-2 py-0.5 rounded-full text-xs font-bold bg-emerald-50 text-emerald-700 border border-emerald-200/60">
                    <TrendingUp size={12} />
                    {revenueSummary.growthPct}
                  </span>
                </div>
              </div>

              <div className="hidden md:block text-xs text-neutral-400 pl-3 border-l border-neutral-200">
                <span>Avg: <strong className="text-neutral-700 font-semibold">₹{revenueSummary.avgDaily.toLocaleString("en-IN")}/day</strong></span>
                <span className="mx-1.5">•</span>
                <span><strong className="text-neutral-700 font-semibold">{revenueSummary.totalOrd}</strong> orders placed</span>
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

        {/* Right: Order Status (4 cols) - Matching Image 1 Target */}
        <div className="lg:col-span-4 bg-white rounded-[22px] border border-black/[0.04] p-6 shadow-[0_1px_3px_rgba(0,0,0,0.02)] flex flex-col">
          <div className="flex items-center justify-between mb-3">
            <div className="flex items-center gap-3">
              <div className="w-10 h-10 rounded-2xl bg-[#fff8e7] flex items-center justify-center text-amber-600 shadow-2xs shrink-0">
                <StopwatchIcon className="w-5 h-5 text-amber-600" />
              </div>
              <h2 className="text-[17px] font-bold text-neutral-900 tracking-tight leading-tight">
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
              deliveredCount={stats.delivered}
              processingCount={stats.processing}
              shippedCount={stats.shipped}
              cancelledCount={stats.cancelled}
              returnedCount={stats.returned}
              onSelectStatus={(status) => setSelectedStatusFilter(status)}
              selectedStatus={selectedStatusFilter}
              isSpinning={isDonutSpinning}
            />
          </div>

          {selectedStatusFilter && (
            <div className="mt-3 pt-2.5 border-t border-neutral-100 flex items-center justify-between text-xs text-neutral-500 animate-in fade-in duration-200">
              <span className="flex items-center gap-1.5">
                <span className="w-2 h-2 rounded-full bg-amber-500 animate-pulse" />
                Filtered by <strong className="text-neutral-900 font-semibold">{selectedStatusFilter}</strong>
              </span>
              <button
                onClick={() => setSelectedStatusFilter(null)}
                className="text-amber-800 font-semibold hover:underline cursor-pointer"
              >
                Clear filter
              </button>
            </div>
          )}
        </div>
      </section>

      {/* ── BOTTOM ROW: RECENT ORDERS & TOP PRODUCTS ─────────────────────────── */}
      <section className="grid grid-cols-1 lg:grid-cols-12 gap-5">
        {/* Left: Recent Orders Table (8 cols) */}
        <div className="lg:col-span-8 bg-white rounded-[22px] border border-black/[0.04] shadow-[0_1px_3px_rgba(0,0,0,0.02)] overflow-hidden flex flex-col justify-between">
          <div>
            {/* Header */}
            <div className="flex items-center justify-between p-5 sm:p-6 pb-3">
              <div className="flex items-center gap-3 min-w-0">
                <div className="w-10 h-10 rounded-2xl bg-[#fff8e7] text-amber-600 flex items-center justify-center shrink-0 shadow-2xs border border-amber-200/50">
                  <ShoppingCart size={18} className="text-amber-600" />
                </div>
                <div className="min-w-0">
                  <div className="flex items-center gap-2 flex-wrap">
                    <h2 className="text-[17px] font-bold text-neutral-900 leading-tight tracking-tight">
                      Recent Orders
                    </h2>
                    <span
                      className={`px-2 py-0.5 rounded-full text-[10px] font-extrabold tracking-tight border shadow-2xs flex items-center gap-1 ${
                        dateFilter.type === "day"
                          ? "bg-sky-50 text-sky-800 border-sky-300"
                          : dateFilter.type === "custom"
                          ? "bg-purple-50 text-purple-800 border-purple-300"
                          : "bg-amber-50 text-amber-900 border-amber-300"
                      }`}
                    >
                      <span
                        className={`w-1.5 h-1.5 rounded-full ${
                          dateFilter.type === "day"
                            ? "bg-sky-500"
                            : dateFilter.type === "custom"
                            ? "bg-purple-500"
                            : "bg-amber-500"
                        }`}
                      />
                      {dateFilter.type === "day"
                        ? "Day-wise"
                        : dateFilter.type === "custom"
                        ? "Custom Range"
                        : "Till Date"}
                    </span>
                  </div>
                  <p className="text-xs text-neutral-500 font-normal mt-1 flex items-center gap-1.5 truncate">
                    <CalendarDays size={12} className="text-amber-700 shrink-0" />
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
                  className="flex items-center gap-1 text-xs font-semibold text-amber-800 hover:text-amber-950 transition-colors group cursor-pointer bg-[#fff8e7] hover:bg-amber-100/70 px-2.5 py-1.5 rounded-xl border border-amber-200/60 shadow-2xs"
                >
                  <span>View All ({orders.length})</span>
                  <ChevronRight size={13} className="transition-transform group-hover:translate-x-0.5" />
                </button>
                <Link
                  href="/admin/orders"
                  className="w-8 h-8 rounded-xl border border-neutral-200/60 hover:bg-neutral-100 text-neutral-500 hover:text-neutral-900 flex items-center justify-center transition-colors shadow-2xs"
                  title="Open Dedicated Full Page"
                >
                  <ExternalLink size={13} />
                </Link>
              </div>
            </div>

            {/* Recent Orders Status & Date Controls Bar */}
            <div className="flex flex-wrap items-center justify-between gap-2.5 px-5 sm:px-6 pb-3.5 border-b border-black/[0.04]">
              {/* Status Filter Tabs */}
              <div className="flex items-center gap-1 overflow-x-auto no-scrollbar">
                {["All", "Delivered", "Processing", "Shipped", "Returned"].map((status) => {
                  const isActive = recentOrdersStatusFilter === status;
                  return (
                    <button
                      key={status}
                      onClick={() => setRecentOrdersStatusFilter(status)}
                      className={`px-3 py-1 rounded-xl text-xs font-medium transition-all cursor-pointer whitespace-nowrap ${
                        isActive
                          ? "bg-neutral-900 text-white shadow-2xs font-semibold"
                          : "bg-neutral-100/80 hover:bg-neutral-200/70 text-neutral-600"
                      }`}
                    >
                      {status}
                    </button>
                  );
                })}
              </div>

              {/* Date Scope Controls: Quick Switcher + Compact Picker */}
              <div className="flex items-center gap-2">
                {/* 1-Click Quick Mode Switcher: "Till Date" vs "Day-wise" */}
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
                      triggerToast("Showing store orders accumulated Till Date (03 Oct 2026)", "info");
                    }}
                    className={`px-2 py-0.5 rounded-md transition-all cursor-pointer flex items-center gap-1 ${
                      dateFilter.type === "all"
                        ? "bg-amber-500 text-white font-bold shadow-2xs"
                        : "text-neutral-600 hover:text-neutral-950"
                    }`}
                    title="View orders accumulated till date (03 Oct 2026)"
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
                      triggerToast("Showing single-day orders for Today (03 Oct 2026)", "info");
                    }}
                    className={`px-2 py-0.5 rounded-md transition-all cursor-pointer flex items-center gap-1 ${
                      dateFilter.type === "day"
                        ? "bg-sky-600 text-white font-bold shadow-2xs"
                        : "text-neutral-600 hover:text-neutral-950"
                    }`}
                    title="View single-day orders (Today: 03 Oct 2026)"
                  >
                    <span>Day-wise</span>
                  </button>
                </div>

                {/* Inline Compact Date Range Picker */}
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
              <div className="mx-5 sm:mx-6 my-2.5 p-3 rounded-2xl bg-gradient-to-r from-sky-50/90 via-sky-50/50 to-indigo-50/40 border border-sky-200/80 shadow-2xs flex flex-col gap-2.5 animate-in fade-in duration-150">
                <div className="flex items-center justify-between gap-2 flex-wrap">
                  <div className="flex items-center gap-2 min-w-0">
                    <span className="w-2 h-2 rounded-full bg-sky-500 animate-pulse shrink-0" />
                    <span className="text-xs text-sky-950 font-bold truncate">
                      Day-Wise Breakdown:{" "}
                      <span className="text-sky-900 underline decoration-sky-300 font-extrabold">
                        {dateFilter.label}
                      </span>
                    </span>
                    <span className="text-[10px] text-sky-800 bg-sky-100 font-bold px-2 py-0.5 rounded-full border border-sky-300/60 shadow-2xs shrink-0">
                      {allFilteredRecentOrders.length} {allFilteredRecentOrders.length === 1 ? "order" : "orders"} • ₹{recentOrdersMetrics.totalRev.toLocaleString("en-IN")}
                    </span>
                  </div>

                  {/* Day Stepper & Till Date Reset */}
                  <div className="flex items-center gap-1.5 shrink-0">
                    <button
                      type="button"
                      onClick={() => handleStepDay("prev")}
                      disabled={currentDayIndex >= availableOrderDays.length - 1}
                      className="flex items-center gap-1 text-[11px] font-semibold px-2 py-1 rounded-lg bg-white border border-sky-200 text-sky-900 hover:bg-sky-50 disabled:opacity-35 disabled:pointer-events-none cursor-pointer shadow-2xs transition-all"
                      title="Step to earlier date with orders"
                    >
                      <ChevronLeft size={12} />
                      <span>Earlier Day</span>
                    </button>
                    <button
                      type="button"
                      onClick={() => handleStepDay("next")}
                      disabled={currentDayIndex <= 0}
                      className="flex items-center gap-1 text-[11px] font-semibold px-2 py-1 rounded-lg bg-white border border-sky-200 text-sky-900 hover:bg-sky-50 disabled:opacity-35 disabled:pointer-events-none cursor-pointer shadow-2xs transition-all"
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
                        triggerToast("Restored store orders accumulated Till Date", "info");
                      }}
                      className="ml-1 text-[11px] font-bold text-sky-800 hover:text-sky-950 hover:underline cursor-pointer"
                    >
                      View All (Till Date)
                    </button>
                  </div>
                </div>

                {/* Quick Day Selector Pills */}
                <div className="flex items-center gap-1.5 overflow-x-auto no-scrollbar pt-0.5">
                  <span className="text-[10px] uppercase tracking-wider font-extrabold text-sky-900/60 shrink-0 mr-1">
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
                          ₹{Math.round(dayItem.totalRevenue).toLocaleString("en-IN")}
                        </span>
                      </button>
                    );
                  })}
                </div>
              </div>
            ) : dateFilter.type === "all" ? (
              <div className="mx-5 sm:mx-6 my-2 px-3.5 py-2 rounded-xl bg-gradient-to-r from-amber-50/90 via-amber-50/40 to-transparent border border-amber-200/70 flex items-center justify-between text-xs text-amber-950 animate-in fade-in duration-150">
                <div className="flex items-center gap-2">
                  <Sparkles size={13} className="text-amber-600 shrink-0" />
                  <span>
                    <strong>Till Date Store History:</strong> All {orders.length} orders recorded from store launch (18 Sep 2026) till today (03 Oct 2026). Cumulative gross: <strong>₹{lifetimeStoreRevenue.toLocaleString("en-IN")}</strong>
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
              <div className="mx-5 sm:mx-6 my-2 px-3.5 py-2 rounded-xl bg-purple-50/80 border border-purple-200/70 flex items-center justify-between text-xs text-purple-950 animate-in fade-in duration-150">
                <div className="flex items-center gap-2">
                  <CalendarDays size={13} className="text-purple-600 shrink-0" />
                  <span>
                    <strong>Custom Date Range:</strong> {dateFilter.startDate} → {dateFilter.endDate} ({allFilteredRecentOrders.length} orders found • ₹{recentOrdersMetrics.totalRev.toLocaleString("en-IN")})
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

            {/* Active Search & Filter Banner */}
            {searchQuery.trim() && (
              <div className="mx-5 sm:mx-6 my-2.5 p-2.5 rounded-xl bg-amber-50/80 border border-amber-200/60 flex items-center justify-between text-xs text-amber-950 animate-in fade-in duration-150">
                <div className="flex items-center gap-2">
                  <Search size={13} className="text-amber-600 shrink-0" />
                  <span>
                    Showing orders matching <strong className="font-semibold text-black">&quot;{searchQuery}&quot;</strong> ({allFilteredRecentOrders.length} {allFilteredRecentOrders.length === 1 ? "order" : "orders"} found)
                  </span>
                </div>
                <button
                  onClick={() => setSearchQuery("")}
                  className="text-amber-800 hover:text-amber-950 font-semibold flex items-center gap-1 cursor-pointer hover:underline"
                >
                  <X size={12} /> Clear search
                </button>
              </div>
            )}

            <div className="overflow-x-auto">
              <table className="w-full text-left border-collapse" role="table">
                <thead>
                  <tr className="border-b border-neutral-100 text-xs font-medium text-neutral-400">
                    <th className="pl-6 py-3 font-medium">Order ID</th>
                    <th className="px-3 py-3 font-medium">Customer</th>
                    <th className="px-3 py-3 font-medium">Products</th>
                    <th className="px-3 py-3 font-medium">Total</th>
                    <th className="px-3 py-3 font-medium">Status</th>
                    <th className="px-3 py-3 font-medium">Date</th>
                    <th className="pr-6 py-3 font-medium text-right">Actions</th>
                  </tr>
                </thead>
                <tbody className="divide-y divide-neutral-100">
                  {displayedOrders.length === 0 ? (
                    <tr>
                      <td colSpan={7} className="py-12 text-center text-xs text-neutral-400">
                        <div className="flex flex-col items-center justify-center gap-2">
                          <Package size={24} className="text-neutral-300" />
                          <span>No orders found matching the active filters.</span>
                          <button
                            type="button"
                            onClick={() => {
                              setRecentOrdersStatusFilter("All");
                              setDateFilter({
                                type: "all",
                                label: "All Time (Till Date)",
                                startDate: "2026-01-01",
                                endDate: "2026-10-03",
                              });
                            }}
                            className="text-amber-800 hover:underline font-semibold text-xs mt-1 cursor-pointer"
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
                      const itemCount = order.itemsCount || order.items?.length || 1;
                      const thumbUrl =
                        order.items?.[0]?.imageUrl || "/products/shoes/veyro-shoe-01-primary.webp";

                      return (
                        <tr
                          key={order.id}
                          onClick={() => setSelectedOrderForModal(order)}
                          className="hover:bg-amber-50/40 cursor-pointer transition-colors duration-150 group"
                          title="Click to deep inspect order"
                        >
                          {/* ID */}
                          <td className="pl-6 py-3.5 whitespace-nowrap text-xs font-mono font-medium text-neutral-800 group-hover:text-amber-800">
                            {order.id}
                          </td>

                          {/* Customer */}
                          <td className="px-3 py-3.5 whitespace-nowrap">
                            <div className="flex items-center gap-2.5">
                              <div
                                className={`w-7 h-7 rounded-full ${avatar.bg} ${avatar.text} flex items-center justify-center text-xs font-bold shrink-0`}
                              >
                                {avatar.initial}
                              </div>
                              <span className="text-xs sm:text-sm font-medium text-neutral-900">
                                {customerName}
                              </span>
                            </div>
                          </td>

                          {/* Products */}
                          <td className="px-3 py-3.5 whitespace-nowrap">
                            <div className="flex items-center gap-2">
                              <div className="w-7 h-7 rounded-lg bg-neutral-100 overflow-hidden shrink-0 border border-neutral-200/60 flex items-center justify-center">
                                <Image
                                  src={thumbUrl}
                                  alt="Product thumbnail"
                                  width={28}
                                  height={28}
                                  className="w-full h-full object-cover"
                                />
                              </div>
                              <span className="text-xs text-neutral-500">
                                {itemCount} {itemCount === 1 ? "item" : "items"}
                              </span>
                            </div>
                          </td>

                          {/* Total */}
                          <td className="px-3 py-3.5 whitespace-nowrap">
                            <div className="flex flex-col gap-0.5">
                              <span className="text-xs sm:text-sm font-bold text-neutral-900">
                                ₹{order.total.toLocaleString("en-IN")}
                              </span>
                              <span className="text-[10px] text-neutral-500 font-medium uppercase tracking-wider flex items-center gap-1">
                                <span className="w-1.5 h-1.5 rounded-full bg-emerald-500 shrink-0" />
                                {order.paymentMethod === "upi"
                                  ? "UPI • Paid"
                                  : order.paymentMethod === "card"
                                  ? "Card • Paid"
                                  : order.paymentMethod === "cod"
                                  ? "Cash on Delivery"
                                  : "Prepaid"}
                              </span>
                            </div>
                          </td>

                          {/* Status */}
                          <td className="px-3 py-3.5 whitespace-nowrap">
                            <StatusPill status={order.status} />
                          </td>

                          {/* Date */}
                          <td className="px-3 py-3.5 whitespace-nowrap">
                            <div className="flex flex-col gap-0.5">
                              <div className="flex items-center gap-1.5 text-xs font-semibold text-neutral-900">
                                <span>{order.date.includes(",") ? order.date.split(",")[0].trim() : order.date}</span>
                                {parseOrderDateToDayString(order.date) === "2026-10-03" ? (
                                  <span className="px-1.5 py-0.2 rounded text-[9.5px] font-bold bg-emerald-50 text-emerald-700 border border-emerald-200/60 shadow-2xs">
                                    Today
                                  </span>
                                ) : parseOrderDateToDayString(order.date) === "2026-10-02" ? (
                                  <span className="px-1.5 py-0.2 rounded text-[9.5px] font-bold bg-sky-50 text-sky-700 border border-sky-200/60 shadow-2xs">
                                    Yesterday
                                  </span>
                                ) : null}
                              </div>
                              <div className="text-[11px] text-neutral-400 flex items-center gap-1">
                                <Clock size={10} className="text-neutral-400 shrink-0" />
                                <span>{order.date.includes(",") ? order.date.split(",")[1].trim() : "Recorded"}</span>
                              </div>
                            </div>
                          </td>

                          {/* Actions */}
                          <td className="pr-6 py-3.5 whitespace-nowrap text-right" onClick={(e) => e.stopPropagation()}>
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
                          </td>
                        </tr>
                      );
                    })
                  )}
                </tbody>
              </table>
            </div>

            {/* Day Logistics Pulse when viewing single day with 1-2 orders (Guarantees zero blank space) */}
            {dateFilter.type === "day" && displayedOrders.length > 0 && displayedOrders.length <= 2 && (
              <div className="mx-5 sm:mx-6 my-3 p-3.5 rounded-2xl bg-gradient-to-r from-sky-50/80 via-white to-sky-50/40 border border-sky-100/90 flex flex-col sm:flex-row sm:items-center justify-between gap-3 text-xs shadow-2xs animate-in fade-in duration-200">
                <div className="flex items-center gap-3">
                  <div className="w-8 h-8 rounded-xl bg-sky-100/90 text-sky-700 flex items-center justify-center shrink-0 shadow-2xs border border-sky-200/60">
                    <Truck size={15} />
                  </div>
                  <div>
                    <div className="font-bold text-neutral-900 flex items-center gap-1.5">
                      <span>Day Logistics &amp; Fulfillment Pulse</span>
                      <span className="px-1.5 py-0.2 rounded-full text-[9px] font-extrabold bg-emerald-100 text-emerald-800 border border-emerald-200/60">
                        100% On Schedule
                      </span>
                    </div>
                    <p className="text-[11px] text-neutral-500 mt-0.5">
                      {allFilteredRecentOrders.length} {allFilteredRecentOrders.length === 1 ? "order" : "orders"} on {dateFilter.label} handled via BlueDart Express &amp; Delhivery • 0 returns
                    </p>
                  </div>
                </div>
                <div className="flex items-center gap-2 self-end sm:self-center shrink-0 text-[11px]">
                  <button
                    type="button"
                    onClick={() => {
                      setDateFilter({
                        type: "all",
                        label: "All Time (Till Date)",
                        startDate: "2026-01-01",
                        endDate: "2026-10-03",
                      });
                      triggerToast("Restored store orders accumulated Till Date", "info");
                    }}
                    className="px-2.5 py-1 rounded-lg bg-white border border-neutral-200/80 hover:bg-neutral-50 text-neutral-700 font-semibold cursor-pointer transition-all shadow-2xs"
                  >
                    View All Orders (Till Date) ➔
                  </button>
                </div>
              </div>
            )}
          </div>

          {/* ── THE MASTERPIECE FOOTER (Fills the previous blank space!) ── */}
          <div className="p-4 sm:p-5 bg-gradient-to-b from-[#faf9f6] to-white border-t border-black/[0.05] mt-auto flex flex-col gap-3">
            {/* Upper Strip: Live Analytics Ribbon */}
            <div className="grid grid-cols-2 sm:grid-cols-4 gap-2.5">
              <div className="p-2.5 rounded-xl bg-white border border-neutral-200/70 shadow-2xs">
                <div className="text-[10px] text-neutral-400 font-semibold uppercase tracking-wider flex items-center gap-1">
                  <IndianRupee size={10} className="text-amber-700" />
                  <span>Period Revenue</span>
                </div>
                <div className="text-sm font-bold text-neutral-900 mt-0.5">
                  ₹{recentOrdersMetrics.totalRev.toLocaleString("en-IN")}
                </div>
                <div className="text-[10px] text-neutral-400 mt-0.5">
                  {allFilteredRecentOrders.length} orders in scope
                </div>
              </div>

              <div className="p-2.5 rounded-xl bg-white border border-neutral-200/70 shadow-2xs">
                <div className="text-[10px] text-neutral-400 font-semibold uppercase tracking-wider flex items-center gap-1">
                  <TrendingUp size={10} className="text-emerald-700" />
                  <span>Avg Order Value</span>
                </div>
                <div className="text-sm font-bold text-neutral-900 mt-0.5">
                  ₹{recentOrdersMetrics.aov.toLocaleString("en-IN")}
                </div>
                <div className="text-[10px] text-emerald-700 font-medium mt-0.5">
                  Healthy basket size
                </div>
              </div>

              <div className="p-2.5 rounded-xl bg-white border border-neutral-200/70 shadow-2xs">
                <div className="text-[10px] text-neutral-400 font-semibold uppercase tracking-wider flex items-center gap-1">
                  <CheckCircle2 size={10} className="text-sky-700" />
                  <span>Delivered</span>
                </div>
                <div className="text-sm font-bold text-neutral-900 mt-0.5">
                  {recentOrdersMetrics.deliveredCount} orders
                </div>
                <div className="text-[10px] text-neutral-400 mt-0.5">
                  ₹{recentOrdersMetrics.deliveredRev.toLocaleString("en-IN")} fulfilled
                </div>
              </div>

              <div className="p-2.5 rounded-xl bg-white border border-neutral-200/70 shadow-2xs">
                <div className="text-[10px] text-neutral-400 font-semibold uppercase tracking-wider flex items-center gap-1">
                  <Truck size={10} className="text-indigo-700" />
                  <span>Active Transit</span>
                </div>
                <div className="text-sm font-bold text-neutral-900 mt-0.5">
                  {recentOrdersMetrics.shippedCount} shipped
                </div>
                <div className="text-[10px] text-neutral-400 mt-0.5">
                  {recentOrdersMetrics.processingCount} in packing
                </div>
              </div>
            </div>

            {/* Lower Strip: Pagination & Quick Batch Operations */}
            <div className="flex flex-wrap items-center justify-between gap-3 pt-2 border-t border-black/[0.04]">
              {/* Pagination controls */}
              <div className="flex items-center gap-2 text-xs text-neutral-500">
                <span>
                  Showing{" "}
                  <strong className="text-neutral-900 font-semibold">
                    {allFilteredRecentOrders.length === 0 ? 0 : (recentOrdersPage - 1) * RECENT_ORDERS_PAGE_SIZE + 1}
                  </strong>
                  –
                  <strong className="text-neutral-900 font-semibold">
                    {Math.min(recentOrdersPage * RECENT_ORDERS_PAGE_SIZE, allFilteredRecentOrders.length)}
                  </strong>{" "}
                  of <strong className="text-neutral-900 font-semibold">{allFilteredRecentOrders.length}</strong>
                </span>

                {totalRecentOrdersPages > 1 && (
                  <div className="flex items-center gap-1 ml-2">
                    <button
                      type="button"
                      onClick={() => setRecentOrdersPage((p) => Math.max(1, p - 1))}
                      disabled={recentOrdersPage === 1}
                      className="p-1 rounded-lg border border-neutral-200 text-neutral-600 hover:bg-neutral-100 disabled:opacity-30 disabled:pointer-events-none cursor-pointer"
                      title="Previous Page"
                    >
                      <ChevronLeft size={13} />
                    </button>
                    {Array.from({ length: totalRecentOrdersPages }).map((_, i) => {
                      const pageNum = i + 1;
                      return (
                        <button
                          key={pageNum}
                          type="button"
                          onClick={() => setRecentOrdersPage(pageNum)}
                          className={`w-6 h-6 rounded-lg text-xs font-semibold flex items-center justify-center transition-all cursor-pointer ${
                            recentOrdersPage === pageNum
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
                      onClick={() => setRecentOrdersPage((p) => Math.min(totalRecentOrdersPages, p + 1))}
                      disabled={recentOrdersPage === totalRecentOrdersPages}
                      className="p-1 rounded-lg border border-neutral-200 text-neutral-600 hover:bg-neutral-100 disabled:opacity-30 disabled:pointer-events-none cursor-pointer"
                      title="Next Page"
                    >
                      <ChevronRight size={13} />
                    </button>
                  </div>
                )}
              </div>

              {/* Batch Actions */}
              <div className="flex items-center gap-2">
                <button
                  type="button"
                  onClick={() => {
                    downloadAllOrdersCSV(allFilteredRecentOrders);
                    triggerToast(`Exported ${allFilteredRecentOrders.length} orders to CSV`, "success");
                  }}
                  className="flex items-center gap-1.5 px-3 py-1.5 rounded-xl border border-neutral-200/80 hover:bg-neutral-50 text-neutral-700 text-xs font-semibold shadow-2xs transition-all cursor-pointer"
                  title="Export currently filtered orders dataset as CSV"
                >
                  <Download size={12} className="text-neutral-500" />
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
                  className="flex items-center gap-1.5 px-3 py-1.5 rounded-xl border border-neutral-200/80 hover:bg-neutral-50 text-neutral-700 text-xs font-semibold shadow-2xs transition-all cursor-pointer"
                  title="Print latest order dispatch slip"
                >
                  <Printer size={12} className="text-neutral-500" />
                  <span>Print Slip</span>
                </button>
              </div>
            </div>
          </div>
        </div>

        {/* Right: Top Products (4 cols) */}
        <div className="lg:col-span-4 bg-white rounded-[22px] border border-black/[0.04] p-5 sm:p-6 shadow-[0_1px_3px_rgba(0,0,0,0.02)] flex flex-col justify-between">
          <div>
            {/* Header */}
            <div className="flex items-center justify-between mb-3.5">
              <div className="flex items-center gap-3 min-w-0">
                <div className="w-10 h-10 rounded-2xl bg-[#fff8e7] text-amber-600 flex items-center justify-center shrink-0 shadow-2xs border border-amber-200/50">
                  <Sparkles size={18} />
                </div>
                <div className="min-w-0">
                  <div className="flex items-center gap-2 flex-wrap">
                    <h2 className="text-[17px] font-bold text-neutral-900 leading-tight tracking-tight">
                      Top Products
                    </h2>
                    <span
                      className={`px-2 py-0.5 rounded-full text-[10px] font-extrabold tracking-tight border shadow-2xs flex items-center gap-1 ${
                        dateFilter.type === "day"
                          ? "bg-sky-50 text-sky-800 border-sky-300"
                          : dateFilter.type === "custom"
                          ? "bg-purple-50 text-purple-800 border-purple-300"
                          : "bg-amber-50 text-amber-900 border-amber-300"
                      }`}
                    >
                      <span
                        className={`w-1.5 h-1.5 rounded-full ${
                          dateFilter.type === "day"
                            ? "bg-sky-500"
                            : dateFilter.type === "custom"
                            ? "bg-purple-500"
                            : "bg-amber-500"
                        }`}
                      />
                      {dateFilter.type === "day"
                        ? "Day-wise"
                        : dateFilter.type === "custom"
                        ? "Custom Range"
                        : "Till Date"}
                    </span>
                  </div>
                  <p className="text-xs text-neutral-500 font-normal mt-1 flex items-center gap-1.5 truncate">
                    <CalendarDays size={12} className="text-amber-700 shrink-0" />
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
                className="flex items-center gap-1 text-xs font-semibold text-amber-800 hover:text-amber-950 transition-colors group cursor-pointer shrink-0"
              >
                <span>View All</span>
                <ChevronRight size={13} className="transition-transform group-hover:translate-x-0.5" />
              </button>
            </div>

            {/* Filter & Metric Bar: Exactly 2 Clean, Balanced Rows */}
            <div className="flex flex-col gap-2.5 mb-3 pb-3 border-b border-black/[0.04]">
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
                <div className="flex items-center bg-neutral-100 p-0.5 rounded-xl border border-neutral-200/60 shadow-2xs shrink-0">
                  <button
                    type="button"
                    onClick={() => setTopProductsMetric("revenue")}
                    className={`flex items-center gap-1 px-2.5 py-1 rounded-lg text-[11px] font-semibold transition-all cursor-pointer ${
                      topProductsMetric === "revenue"
                        ? "bg-white text-amber-950 shadow-2xs font-bold"
                        : "text-neutral-500 hover:text-neutral-900"
                    }`}
                    title="Sort products by gross revenue"
                  >
                    <IndianRupee
                      size={10}
                      strokeWidth={2.6}
                      className={topProductsMetric === "revenue" ? "text-amber-700" : "text-neutral-400"}
                    />
                    <span>Rev</span>
                  </button>
                  <button
                    type="button"
                    onClick={() => setTopProductsMetric("units")}
                    className={`flex items-center gap-1 px-2.5 py-1 rounded-lg text-[11px] font-semibold transition-all cursor-pointer ${
                      topProductsMetric === "units"
                        ? "bg-white text-sky-950 shadow-2xs font-bold"
                        : "text-neutral-500 hover:text-neutral-900"
                    }`}
                    title="Sort products by total units sold"
                  >
                    <ShoppingBag
                      size={10}
                      strokeWidth={2.4}
                      className={topProductsMetric === "units" ? "text-sky-700" : "text-neutral-400"}
                    />
                    <span>Units</span>
                  </button>
                </div>
              </div>

              {/* Row 2: Category Micro-Chips (Left) & Dedicated Till Date vs Day-wise Toggle (Right) */}
              <div className="flex items-center justify-between gap-2">
                {/* Category Chips */}
                <div className="flex items-center gap-1 overflow-x-auto no-scrollbar">
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
                      className={`px-2 py-0.5 rounded-lg text-[10px] font-semibold transition-all cursor-pointer shrink-0 ${
                        topProductsCategory === c.key
                          ? "bg-neutral-900 text-white shadow-2xs font-bold"
                          : "text-neutral-500 hover:text-neutral-900 bg-neutral-100 hover:bg-neutral-200/60"
                      }`}
                    >
                      {c.label}
                    </button>
                  ))}
                </div>

                {/* 1-Click Quick Mode Switcher: "Till Date" vs "Day-wise" */}
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
                      setTopProductsTimeframe("period");
                      triggerToast("Showing store-wide sales volume accumulated Till Date (03 Oct 2026)", "info");
                    }}
                    className={`px-2 py-0.5 rounded-md transition-all cursor-pointer flex items-center gap-1 ${
                      dateFilter.type === "all"
                        ? "bg-amber-500 text-white font-bold shadow-2xs"
                        : "text-neutral-600 hover:text-neutral-950"
                    }`}
                    title="View total sales accumulated till date (03 Oct 2026)"
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
                      setTopProductsTimeframe("period");
                      triggerToast("Showing single-day sales volume for Today (03 Oct 2026)", "info");
                    }}
                    className={`px-2 py-0.5 rounded-md transition-all cursor-pointer flex items-center gap-1 ${
                      dateFilter.type === "day"
                        ? "bg-sky-600 text-white font-bold shadow-2xs"
                        : "text-neutral-600 hover:text-neutral-950"
                    }`}
                    title="View single-day sales volume (Today: 03 Oct 2026)"
                  >
                    <span>Day-wise</span>
                  </button>
                </div>
              </div>
            </div>

            {/* List */}
            <div className="space-y-2.5">
              {activeTopProducts.slice(0, 5).map((item, idx) => {
                const maxVal = Math.max(
                  ...activeTopProducts.slice(0, 5).map((p) =>
                    topProductsMetric === "revenue" ? p.revenue : p.soldCount
                  ),
                  1
                );
                const currentVal = topProductsMetric === "revenue" ? item.revenue : item.soldCount;
                const barWidth = Math.round((currentVal / maxVal) * 100);

                return (
                  <div
                    key={item.id || item.rank}
                    onClick={() => setSelectedTopProduct(item)}
                    className="flex items-center justify-between gap-3 group cursor-pointer p-2 -mx-2 rounded-2xl hover:bg-neutral-50/90 transition-all border border-transparent hover:border-black/[0.04] hover:shadow-2xs"
                    title={`Click to view deep analytics & stock actions for ${item.name}`}
                  >
                    <div className="flex items-center gap-2.5 min-w-0 flex-1">
                      {/* Rank Medal */}
                      {idx === 0 ? (
                        <div className="w-5 h-5 rounded-full bg-gradient-to-br from-amber-400 via-amber-500 to-yellow-600 text-white flex items-center justify-center font-black text-[10px] shadow-xs shrink-0 ring-1 ring-amber-300/60">
                          1
                        </div>
                      ) : idx === 1 ? (
                        <div className="w-5 h-5 rounded-full bg-gradient-to-br from-slate-300 via-slate-400 to-slate-500 text-white flex items-center justify-center font-black text-[10px] shadow-xs shrink-0">
                          2
                        </div>
                      ) : idx === 2 ? (
                        <div className="w-5 h-5 rounded-full bg-gradient-to-br from-amber-700 via-amber-800 to-yellow-900 text-white flex items-center justify-center font-black text-[10px] shadow-xs shrink-0">
                          3
                        </div>
                      ) : (
                        <div className="w-5 h-5 rounded-full bg-neutral-100 text-neutral-600 flex items-center justify-center font-bold text-[10px] shrink-0">
                          {idx + 1}
                        </div>
                      )}

                      {/* Thumbnail */}
                      <div className="w-11 h-11 rounded-xl bg-neutral-50 border border-neutral-100 overflow-hidden shrink-0 flex items-center justify-center relative shadow-2xs group-hover:scale-105 transition-transform duration-200">
                        <Image
                          src={item.imageUrl}
                          alt={item.name}
                          width={44}
                          height={44}
                          className="w-full h-full object-cover"
                        />
                      </div>

                      {/* Text info */}
                      <div className="min-w-0 flex-1">
                        <div className="text-xs sm:text-sm font-semibold text-neutral-900 truncate group-hover:text-amber-800 transition-colors flex items-center gap-1.5">
                          <span className="truncate">{item.name}</span>
                        </div>
                        <div className="flex items-center gap-1.5 text-[11px] text-neutral-400 mt-0.5">
                          <span>
                            {item.category} • {item.soldCount} sold
                          </span>
                          {item.stock <= 10 ? (
                            <span className="inline-flex items-center gap-1 text-[10px] font-semibold text-amber-800 bg-amber-50 border border-amber-200/60 px-1.5 py-0.2 rounded-md">
                              <AlertTriangle size={10} strokeWidth={2.4} className="text-amber-600 shrink-0" />
                              {item.stock} left
                            </span>
                          ) : (
                            <span className="inline-flex items-center gap-1 text-[10px] font-medium text-emerald-800 bg-emerald-50 border border-emerald-200/50 px-1.5 py-0.2 rounded-md">
                              <span className="w-1.5 h-1.5 rounded-full bg-emerald-500 shrink-0" />
                              {item.stock} in stock
                            </span>
                          )}
                        </div>

                        {/* Relative Volume Share Benchmark vs #1 Seller */}
                        <div className="mt-2 pt-1 border-t border-neutral-100/90">
                          <div className="flex items-center justify-between text-[9.5px] text-neutral-400 font-medium mb-1">
                            <span className="flex items-center gap-1">
                              <span className="w-1.5 h-1.5 rounded-full bg-amber-400 shrink-0" />
                              Sales share vs #1 seller
                            </span>
                            <span className="font-mono font-bold text-neutral-700">{barWidth}%</span>
                          </div>
                          <div className="w-full bg-neutral-100 h-1.5 rounded-full overflow-hidden">
                            <div
                              className="h-full bg-gradient-to-r from-amber-400 via-amber-500 to-yellow-500 rounded-full transition-all duration-500"
                              style={{ width: `${barWidth}%` }}
                            />
                          </div>
                        </div>
                      </div>
                    </div>

                    {/* Revenue & Growth */}
                    <div className="text-right shrink-0">
                      <span className="text-xs sm:text-sm font-bold text-neutral-900 block group-hover:text-amber-900 transition-colors">
                        ₹{item.revenue.toLocaleString("en-IN")}
                      </span>
                      <span className="inline-flex items-center gap-0.5 text-[10px] font-semibold text-emerald-700 bg-emerald-50 px-1.5 py-0.2 rounded-md mt-0.5">
                        <TrendingUp size={9} />+{item.growth}%
                      </span>
                    </div>
                  </div>
                );
              })}
            </div>
          </div>
        </div>
      </section>

      {/* Return Requests Deep Review Modal */}
      <ReturnRequestsReviewModal
        isOpen={isReturnModalOpen}
        onClose={() => setIsReturnModalOpen(false)}
        orders={orders}
        onReviewReturn={reviewReturnRequest}
      />

      {/* Product Deep Performance & Retail Analytics Modal */}
      <ProductPerformanceModal
        product={selectedTopProduct}
        onClose={() => setSelectedTopProduct(null)}
        orders={orders}
        onUpdateStock={handleUpdateStock}
        onUpdatePrice={handleUpdatePrice}
        showToast={(msg) => triggerToast(msg, "success")}
      />

      {/* All Top Products Catalog Leaderboard Modal */}
      <AllTopProductsModal
        isOpen={isAllProductsModalOpen}
        onClose={() => setIsAllProductsModalOpen(false)}
        products={activeTopProducts}
        onSelectProduct={(p) => setSelectedTopProduct(p)}
        onExportAllCSV={() => {
          downloadAllProductsCSV(activeTopProducts, topProductsTimeframe);
          triggerToast("📥 Full catalog leaderboard downloaded as CSV");
        }}
        timeframe={
          dateFilter.type === "day"
            ? `Day-wise (${dateFilter.singleDay || dateFilter.startDate})`
            : dateFilter.type === "custom"
            ? `Range: ${dateFilter.startDate} → ${dateFilter.endDate}`
            : `Till Date (${dateFilter.endDate})`
        }
        metric={topProductsMetric}
      />

      {/* Order Deep Inspection Modal */}
      <OrderDeepInspectionModal
        order={selectedOrderForModal}
        onClose={() => setSelectedOrderForModal(null)}
        onUpdateStatus={updateOrderStatus}
        showToast={(msg, type) => triggerToast(msg, type || "success")}
      />

      {/* All Orders Manager Modal */}
      <AllOrdersManagerModal
        isOpen={isAllOrdersModalOpen}
        onClose={() => setIsAllOrdersModalOpen(false)}
        orders={orders}
        onSelectOrder={(ord) => {
          setSelectedOrderForModal(ord);
        }}
        onUpdateStatus={updateOrderStatus}
        showToast={(msg, type) => triggerToast(msg, type || "success")}
      />

      {/* Floating System Notification Toast */}
      {adminToast && (
        <div className="fixed bottom-6 right-6 z-[9999] flex items-center gap-3 px-4 py-3 bg-neutral-900 text-white text-xs sm:text-sm font-medium rounded-2xl shadow-2xl border border-white/10 animate-in fade-in slide-in-from-bottom-3 duration-200">
          <CheckCircle className="text-emerald-400 shrink-0" size={18} />
          <span>{adminToast.message}</span>
          <button
            onClick={() => setAdminToast(null)}
            className="ml-2 text-neutral-400 hover:text-white cursor-pointer"
          >
            <X size={14} />
          </button>
        </div>
      )}
    </div>
  );
}
