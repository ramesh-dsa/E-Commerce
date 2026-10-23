"use client";

import React, { createContext, useContext, useState, useEffect, useCallback } from "react";
import type { OrderRecord, OrderStatus } from "@/types";

export interface UserProfile {
  name: string;
  email: string;
  phone?: string;
  isVIP: boolean;
  memberSince?: string;
  address?: {
    line1: string;
    city: string;
    state: string;
    pincode: string;
  };
}

// Re-export so existing consumers that import from UserContext still work
export type { OrderRecord };

interface UserContextType {
  user: UserProfile | null;
  orders: OrderRecord[];
  isHydrated: boolean;
  isAccountModalOpen: boolean;
  openAccountModal: () => void;
  closeAccountModal: () => void;
  login: (profile: { name: string; email: string; phone?: string }) => void;
  demoLogin: () => void;
  logout: () => void;
  addOrder: (order: OrderRecord) => void;
  updateOrderStatus: (orderId: string, status: OrderStatus, note?: string) => void;
  deleteOrder: (orderId: string) => void;
  cancelOrder: (orderId: string, reason?: string) => void;
  requestReturn: (orderId: string, itemIndices: number[], reason: string, details?: string) => void;
  reviewReturnRequest: (orderId: string, decision: "approved" | "rejected", note?: string) => void;
  updateProfile: (updates: Partial<UserProfile>) => void;
}

const UserContext = createContext<UserContextType | undefined>(undefined);

const USER_STORAGE_KEY = "veyro_user_v1";
const ORDERS_STORAGE_KEY = "veyro_orders_v6";
const LAST_ORDER_KEY = "veyro_last_placed_order";

const DEFAULT_DEMO_ORDERS: OrderRecord[] = [
  {
    id: "VEY-2026-29819",
    date: "03 Oct 2026, 01:50 PM",
    total: 1259,
    subtotal: 1259,
    bundleDiscount: 0,
    couponDiscount: 0,
    couponCode: null,
    shippingCost: 0,
    itemsCount: 1,
    items: [
      {
        productId: "vey-wat-drz-004",
        productName: "King Seiko Automatic",
        productSlug: "king-seiko-automatic-silver",
        imageUrl: "/products/watches/seiko-watch.jpg",
        colorName: "Silver Steel",
        selectedSize: "37mm Case",
        quantity: 1,
        unitPrice: 1259,
        totalPrice: 1259,
      },
    ],
    itemNames: ["King Seiko Automatic (Silver Steel / 37mm Case)"],
    status: "Return Requested",
    deliveredDate: "2026-10-03T13:50:00.000Z",
    estimatedDelivery: "Return Requested · Awaiting Review",
    returnRequest: {
      requestedAt: "03 Oct 2026, 02:15 PM",
      reason: "Dial bezel has slight scratch on arrival",
      status: "pending",
      details: "Micro-abrasion near 3 o'clock position noted right after unboxing.",
    },
    timeline: [
      { status: "Confirmed", timestamp: "03 Oct 2026, 09:10 AM", description: "Order confirmed" },
      { status: "Packed", timestamp: "03 Oct 2026, 10:30 AM", description: "Packed at Chennai Hub" },
      { status: "Shipped", timestamp: "03 Oct 2026, 11:45 AM", description: "Dispatched via Express" },
      { status: "Delivered", timestamp: "03 Oct 2026, 01:50 PM", description: "Delivered to Boopesh" },
      { status: "Return Requested", timestamp: "03 Oct 2026, 02:15 PM", description: "Return claim filed by Boopesh" },
    ],
    shippingAddress: {
      name: "Boopesh",
      phone: "+91 98451 22340",
      address: "74, Anna Nagar 2nd Ave, Chennai, Tamil Nadu",
      pincode: "600040",
    },
    paymentMethod: "upi",
  },
  {
    id: "VEY-2026-29818",
    date: "02 Oct 2026, 10:20 AM",
    total: 2399,
    subtotal: 2399,
    bundleDiscount: 0,
    couponDiscount: 0,
    couponCode: null,
    shippingCost: 0,
    itemsCount: 2,
    items: [
      {
        productId: "vey-ftw-min-001",
        productName: "Blanc Court Sneaker",
        productSlug: "blanc-court-sneaker-white",
        imageUrl: "/products/shoes/veyro-shoe-01-primary.webp",
        colorName: "Triple White",
        selectedSize: "UK 9",
        quantity: 1,
        unitPrice: 1899,
        totalPrice: 1899,
      },
      {
        productId: "vey-tsh-ovr-002",
        productName: "Ease Oversized Tee",
        productSlug: "ease-oversized-tee-off-white",
        imageUrl: "/products/tshirts/ease-oversized-cream-front.webp",
        colorName: "Off-White",
        selectedSize: "M",
        quantity: 1,
        unitPrice: 500,
        totalPrice: 500,
      },
    ],
    itemNames: ["Blanc Court Sneaker", "Ease Oversized Tee"],
    status: "Returned",
    deliveredDate: "2026-10-02T10:20:00.000Z",
    estimatedDelivery: "Return Approved · Reverse Pickup Scheduled",
    returnRequest: {
      requestedAt: "02 Oct 2026, 04:40 PM",
      reason: "Size too tight, request exchange for UK 10",
      status: "approved",
      details: "Toe box is narrow for my foot, need one size larger.",
    },
    timeline: [
      { status: "Confirmed", timestamp: "02 Oct 2026, 10:20 AM", description: "Payment verified" },
      { status: "Packed", timestamp: "02 Oct 2026, 11:00 AM", description: "Order is packed and ready to ship" },
      { status: "Delivered", timestamp: "02 Oct 2026, 02:30 PM", description: "Delivered to Karthik R" },
      { status: "Returned", timestamp: "02 Oct 2026, 04:40 PM", description: "Return approved & exchange initiated" },
    ],
    shippingAddress: {
      name: "Karthik R",
      phone: "+91 97890 12345",
      address: "12, Koramangala 4th Block, Bengaluru, Karnataka",
      pincode: "560034",
    },
    paymentMethod: "card",
  },
  {
    id: "VEY-2026-29817",
    date: "01 Oct 2026, 06:15 PM",
    total: 1499,
    subtotal: 1499,
    bundleDiscount: 0,
    couponDiscount: 0,
    couponCode: null,
    shippingCost: 0,
    itemsCount: 1,
    items: [
      {
        productId: "vey-tsh-ovr-001",
        productName: "Mark Graphic Oversized Tee",
        productSlug: "core-oversized-tee-black",
        imageUrl: "/products/tshirts/veyro-tee-01-hover.webp",
        colorName: "Washed Black",
        selectedSize: "L",
        quantity: 1,
        unitPrice: 1499,
        totalPrice: 1499,
      },
    ],
    itemNames: ["Mark Graphic Oversized Tee (Washed Black / L)"],
    status: "Returned",
    deliveredDate: "2026-10-01T18:15:00.000Z",
    estimatedDelivery: "Return Approved · Replacement Dispatched",
    returnRequest: {
      requestedAt: "02 Oct 2026, 11:10 AM",
      reason: "Color / wash appears lighter than catalog",
      status: "approved",
      details: "Fabric shade looks faded grey rather than deep washed black.",
    },
    timeline: [
      { status: "Confirmed", timestamp: "01 Oct 2026, 06:15 PM", description: "Order received" },
      { status: "Packed", timestamp: "02 Oct 2026, 09:30 AM", description: "Packed in eco-box" },
      { status: "Shipped", timestamp: "02 Oct 2026, 02:00 PM", description: "In transit with BlueDart" },
      { status: "Delivered", timestamp: "02 Oct 2026, 05:00 PM", description: "Delivered to Priya S" },
      { status: "Returned", timestamp: "02 Oct 2026, 06:30 PM", description: "Return approved for color variance" },
    ],
    shippingAddress: {
      name: "Priya S",
      phone: "+91 98765 88910",
      address: "88, T. Nagar Main Road, Chennai, Tamil Nadu",
      pincode: "600017",
    },
    paymentMethod: "upi",
  },
  {
    id: "VEY-2026-29816",
    date: "30 Sep 2026, 11:42 AM",
    total: 3797,
    subtotal: 3797,
    bundleDiscount: 0,
    couponDiscount: 0,
    couponCode: null,
    shippingCost: 0,
    itemsCount: 3,
    items: [
      {
        productId: "vey-wat-aut-002",
        productName: "Daniel Wellington Classic St Mawes",
        productSlug: "dw-classic-st-mawes",
        imageUrl: "/products/watches/dw-watch.jpg",
        colorName: "Rose Gold / Brown Leather",
        selectedSize: "40mm Case",
        quantity: 1,
        unitPrice: 2499,
        totalPrice: 2499,
      },
      {
        productId: "vey-tsh-ovr-003",
        productName: "Range Oversized Tee",
        productSlug: "range-oversized-tee-olive",
        imageUrl: "/products/tshirts/grid-waffle-falcon-tee-hover.webp",
        colorName: "Olive",
        selectedSize: "XL",
        quantity: 2,
        unitPrice: 649,
        totalPrice: 1298,
      },
    ],
    itemNames: ["Daniel Wellington Classic St Mawes", "Range Oversized Tee x2"],
    status: "Return Requested",
    deliveredDate: "2026-09-30T11:42:00.000Z",
    estimatedDelivery: "Return Requested · Awaiting Review",
    returnRequest: {
      requestedAt: "01 Oct 2026, 01:25 PM",
      reason: "Strap buckle mechanism is stiff and sticking",
      status: "pending",
      details: "Leather strap clasp requires excessive force to open.",
    },
    timeline: [
      { status: "Confirmed", timestamp: "28 Sep 2026, 10:00 AM", description: "Order confirmed" },
      { status: "Shipped", timestamp: "29 Sep 2026, 03:00 PM", description: "Dispatched from Mumbai" },
      { status: "Delivered", timestamp: "30 Sep 2026, 11:42 AM", description: "Delivered to Arjun M" },
      { status: "Return Requested", timestamp: "01 Oct 2026, 01:25 PM", description: "Return claim filed by Arjun M" },
    ],
    shippingAddress: {
      name: "Arjun M",
      phone: "+91 99401 55678",
      address: "15, Jubilee Hills, Hyderabad, Telangana",
      pincode: "500033",
    },
    paymentMethod: "card",
  },
  {
    id: "VEY-2026-29815",
    date: "29 Sep 2026, 09:18 PM",
    total: 1199,
    subtotal: 1199,
    bundleDiscount: 0,
    couponDiscount: 0,
    couponCode: null,
    shippingCost: 0,
    itemsCount: 1,
    items: [
      {
        productId: "vey-wat-chr-001",
        productName: "Aigner Blue Roman Dial Watch",
        productSlug: "aigner-blue-roman-dial",
        imageUrl: "/products/watches/aigner-blue-watch.jpg",
        colorName: "Blue Leather",
        selectedSize: "42mm Case",
        quantity: 1,
        unitPrice: 1199,
        totalPrice: 1199,
      },
    ],
    itemNames: ["Aigner Blue Roman Dial Watch (Blue Leather)"],
    status: "Cancelled",
    estimatedDelivery: "Cancelled by Customer",
    timeline: [
      { status: "Confirmed", timestamp: "29 Sep 2026, 09:18 PM", description: "Order placed" },
      { status: "Cancelled", timestamp: "29 Sep 2026, 09:40 PM", description: "Customer changed mind" },
    ],
    shippingAddress: {
      name: "Divya K",
      phone: "+91 91234 56789",
      address: "23, MG Road, Pune, Maharashtra",
      pincode: "411001",
    },
    paymentMethod: "cod",
  },
  {
    id: "VEY-2026-29814",
    date: "28 Sep 2026, 04:30 PM",
    total: 1899,
    subtotal: 1899,
    bundleDiscount: 0,
    couponDiscount: 0,
    couponCode: null,
    shippingCost: 0,
    itemsCount: 1,
    items: [
      {
        productId: "vey-ftw-ret-001",
        productName: "Blanc Court Sneaker",
        productSlug: "blanc-court-sneaker-white",
        imageUrl: "/products/shoes/veyro-shoe-01-primary.webp",
        colorName: "Triple White",
        selectedSize: "UK 8",
        quantity: 1,
        unitPrice: 1899,
        totalPrice: 1899,
      },
    ],
    itemNames: ["Blanc Court Sneaker (Triple White / UK 8)"],
    status: "Delivered",
    deliveredDate: "2026-09-28T16:30:00.000Z",
    estimatedDelivery: "Delivered on 28 Sep",
    returnRequest: {
      requestedAt: "29 Sep 2026, 11:20 AM",
      reason: "Size too tight, request exchange for UK 9",
      status: "rejected",
      details: "Exceeded 7-day return window",
    },
    timeline: [
      { status: "Confirmed", timestamp: "26 Sep 2026, 12:00 PM", description: "Order confirmed" },
      { status: "Delivered", timestamp: "28 Sep 2026, 04:30 PM", description: "Delivered successfully" },
    ],
    shippingAddress: {
      name: "Sneha R",
      phone: "+91 98401 23456",
      address: "34, Besant Nagar, Chennai, Tamil Nadu",
      pincode: "600090",
    },
    paymentMethod: "card",
  },
  {
    id: "VEY-2026-29813",
    date: "27 Sep 2026, 11:15 AM",
    total: 2499,
    subtotal: 2499,
    bundleDiscount: 0,
    couponDiscount: 0,
    couponCode: null,
    shippingCost: 0,
    itemsCount: 1,
    items: [
      {
        productId: "vey-wat-drz-004",
        productName: "King Seiko Automatic",
        productSlug: "king-seiko-automatic-silver",
        imageUrl: "/products/watches/seiko-watch.jpg",
        colorName: "Silver Steel",
        selectedSize: "37mm Case",
        quantity: 1,
        unitPrice: 2499,
        totalPrice: 2499,
      },
    ],
    itemNames: ["King Seiko Automatic (Silver Steel)"],
    status: "Returned",
    deliveredDate: "2026-09-27T11:15:00.000Z",
    estimatedDelivery: "Return Approved · Replacement Under Inspection",
    returnRequest: {
      requestedAt: "28 Sep 2026, 06:10 PM",
      reason: "Crown adjustment feels loose",
      status: "approved",
      details: "Winding mechanism skips occasionally, replacement requested.",
    },
    timeline: [
      { status: "Confirmed", timestamp: "25 Sep 2026, 04:10 PM", description: "Order placed" },
      { status: "Delivered", timestamp: "27 Sep 2026, 11:15 AM", description: "Signed by Rahul" },
      { status: "Returned", timestamp: "28 Sep 2026, 06:10 PM", description: "Return approved: Crown adjustment defect" },
    ],
    shippingAddress: {
      name: "Rahul V",
      phone: "+91 98840 99887",
      address: "51, HSR Layout Sector 2, Bengaluru, Karnataka",
      pincode: "560102",
    },
    paymentMethod: "upi",
  },
  {
    id: "VEY-2026-29812",
    date: "25 Sep 2026, 02:40 PM",
    total: 1349,
    subtotal: 1349,
    bundleDiscount: 0,
    couponDiscount: 0,
    couponCode: null,
    shippingCost: 0,
    itemsCount: 1,
    items: [
      {
        productId: "vey-tsh-ovr-001",
        productName: "Mark Graphic Oversized Tee",
        productSlug: "core-oversized-tee-black",
        imageUrl: "/products/tshirts/veyro-tee-01-hover.webp",
        colorName: "Black",
        selectedSize: "M",
        quantity: 1,
        unitPrice: 1349,
        totalPrice: 1349,
      },
    ],
    itemNames: ["Mark Graphic Oversized Tee (Black / M)"],
    status: "Return Requested",
    deliveredDate: "2026-09-25T14:40:00.000Z",
    estimatedDelivery: "Return Requested · Awaiting Review",
    returnRequest: {
      requestedAt: "26 Sep 2026, 04:15 PM",
      reason: "Defective stitching on right sleeve hem",
      status: "pending",
      details: "Sleeve seam is unraveling, refund requested",
    },
    timeline: [
      { status: "Confirmed", timestamp: "23 Sep 2026, 01:00 PM", description: "Order confirmed" },
      { status: "Delivered", timestamp: "25 Sep 2026, 02:40 PM", description: "Delivered successfully" },
      { status: "Return Requested", timestamp: "26 Sep 2026, 04:15 PM", description: "Return claim filed by Ananya M" },
    ],
    shippingAddress: {
      name: "Ananya M",
      phone: "+91 97910 44556",
      address: "19, Alwarpet High Road, Chennai, Tamil Nadu",
      pincode: "600018",
    },
    paymentMethod: "card",
  },
  {
    id: "VEY-2026-29811",
    date: "23 Sep 2026, 09:20 AM",
    total: 2199,
    subtotal: 2199,
    bundleDiscount: 0,
    couponDiscount: 0,
    couponCode: null,
    shippingCost: 0,
    itemsCount: 1,
    items: [
      {
        productId: "vey-ftw-ret-001",
        productName: "Blanc Court Sneaker",
        productSlug: "blanc-court-sneaker-white",
        imageUrl: "/products/shoes/veyro-shoe-01-primary.webp",
        colorName: "Triple White",
        selectedSize: "UK 10",
        quantity: 1,
        unitPrice: 2199,
        totalPrice: 2199,
      },
    ],
    itemNames: ["Blanc Court Sneaker (Triple White / UK 10)"],
    status: "Delivered",
    deliveredDate: "2026-09-23T09:20:00.000Z",
    estimatedDelivery: "Delivered on 23 Sep",
    returnRequest: {
      requestedAt: "24 Sep 2026, 03:30 PM",
      reason: "Outsole shows outdoor wear and scuffs",
      status: "rejected",
      details: "Product returned in used condition with removed tags. Policy violation.",
    },
    timeline: [
      { status: "Confirmed", timestamp: "21 Sep 2026, 11:30 AM", description: "Order confirmed" },
      { status: "Delivered", timestamp: "23 Sep 2026, 09:20 AM", description: "Delivered to Vikram" },
    ],
    shippingAddress: {
      name: "Vikram K",
      phone: "+91 99620 11223",
      address: "8, Banjara Hills Rd 12, Hyderabad, Telangana",
      pincode: "500034",
    },
    paymentMethod: "upi",
  },
  {
    id: "VEY-2026-29810",
    date: "20 Sep 2026, 05:10 PM",
    total: 1749,
    subtotal: 1749,
    bundleDiscount: 0,
    couponDiscount: 0,
    couponCode: null,
    shippingCost: 0,
    itemsCount: 1,
    items: [
      {
        productId: "vey-wat-aut-002",
        productName: "Daniel Wellington Classic St Mawes",
        productSlug: "dw-classic-st-mawes",
        imageUrl: "/products/watches/dw-watch.jpg",
        colorName: "Rose Gold / Brown Leather",
        selectedSize: "40mm Case",
        quantity: 1,
        unitPrice: 1749,
        totalPrice: 1749,
      },
    ],
    itemNames: ["Daniel Wellington Classic St Mawes (Rose Gold / 40mm Case)"],
    status: "Packed",
    estimatedDelivery: "Arriving by 24 Sep",
    timeline: [
      { status: "Confirmed", timestamp: "20 Sep 2026, 05:10 PM", description: "Order received" },
      { status: "Packed", timestamp: "20 Sep 2026, 06:00 PM", description: "Packed in dispatch box" },
    ],
    shippingAddress: {
      name: "Meera T",
      phone: "+91 98230 77889",
      address: "67, Viman Nagar, Pune, Maharashtra",
      pincode: "411014",
    },
    paymentMethod: "card",
  },
  {
    id: "VEY-2026-29809",
    date: "18 Sep 2026, 01:05 PM",
    total: 680,
    subtotal: 680,
    bundleDiscount: 0,
    couponDiscount: 0,
    couponCode: null,
    shippingCost: 0,
    itemsCount: 1,
    items: [
      {
        productId: "vey-tsh-ovr-001",
        productName: "Mark Graphic Oversized Tee",
        productSlug: "core-oversized-tee-black",
        imageUrl: "/products/tshirts/veyro-tee-01-hover.webp",
        colorName: "Black",
        selectedSize: "S",
        quantity: 1,
        unitPrice: 680,
        totalPrice: 680,
      },
    ],
    itemNames: ["Mark Graphic Oversized Tee (Black / S)"],
    status: "Delivered",
    deliveredDate: "2026-09-18T13:05:00.000Z",
    estimatedDelivery: "Delivered on 18 Sep",
    timeline: [
      { status: "Confirmed", timestamp: "16 Sep 2026, 10:00 AM", description: "Order placed" },
      { status: "Delivered", timestamp: "18 Sep 2026, 01:05 PM", description: "Delivered to Rajesh" },
    ],
    shippingAddress: {
      name: "Rajesh P",
      phone: "+91 98410 33445",
      address: "45, Velachery Main Road, Chennai, Tamil Nadu",
      pincode: "600042",
    },
    paymentMethod: "cod",
  },
];

export function UserProvider({ children }: { children: React.ReactNode }) {
  const [user, setUser] = useState<UserProfile | null>(null);
  const [orders, setOrders] = useState<OrderRecord[]>([]);
  const [isAccountModalOpen, setIsAccountModalOpen] = useState(false);
  const [isHydrated, setIsHydrated] = useState(false);

  // Hydrate user and orders from localStorage on mount (SSR safe)
  useEffect(() => {
    try {
      const savedUser = localStorage.getItem(USER_STORAGE_KEY);
      if (savedUser) {
        setUser(JSON.parse(savedUser));
      }

      const savedOrders = localStorage.getItem(ORDERS_STORAGE_KEY);
      if (savedOrders) {
        const parsed = JSON.parse(savedOrders);
        if (Array.isArray(parsed)) {
          const normalized = parsed.map((o: OrderRecord) => ({
            ...o,
            status: (o.status === "Processing" ? "Packed" : o.status) as OrderStatus,
            items: (o.items || []).map((it) => {
              let img = it.imageUrl || "";
              if (img.includes("veyro-watch-01.webp")) img = "/products/watches/seiko-watch.jpg";
              else if (img.includes("veyro-watch-03.webp")) img = "/products/watches/dw-watch.jpg";
              else if (img.includes("veyro-watch-04.webp")) img = "/products/watches/aigner-blue-watch.jpg";
              return { ...it, imageUrl: img };
            }),
          }));

          // Merge demo returnRequests if saved orders has fewer than 7 returns
          const demoReturnMap = new Map(
            DEFAULT_DEMO_ORDERS.filter((d) => d.returnRequest).map((d) => [d.id, d.returnRequest])
          );
          const returnsCount = normalized.filter((o: OrderRecord) => !!o.returnRequest).length;
          const merged = returnsCount < 7
            ? normalized.map((o: OrderRecord) => {
                if (!o.returnRequest && demoReturnMap.has(o.id)) {
                  return { ...o, returnRequest: demoReturnMap.get(o.id) };
                }
                return o;
              })
            : normalized;

          // Auto-heal status consistency between returnRequest and top-level order status
          const healed = merged.map((o: OrderRecord) => {
            if (o.returnRequest?.status === "approved" && o.status !== "Returned") {
              return { ...o, status: "Returned" as OrderStatus };
            }
            if (o.returnRequest?.status === "pending" && (o.status === "Delivered" || !o.status)) {
              return { ...o, status: "Return Requested" as OrderStatus };
            }
            return o;
          });

          setOrders(healed);
        }
      } else {
        // Preload demo orders for rich realistic e-commerce experience
        setOrders(DEFAULT_DEMO_ORDERS);
      }
    } catch (e) {
      console.warn("Failed to read user data from localStorage", e);
    }
    setIsHydrated(true);
  }, []);

  // Sync user changes to localStorage
  useEffect(() => {
    if (!isHydrated) return;
    try {
      if (user) {
        localStorage.setItem(USER_STORAGE_KEY, JSON.stringify(user));
      } else {
        localStorage.removeItem(USER_STORAGE_KEY);
      }
    } catch (e) {
      console.warn("Failed to save user data to localStorage", e);
    }
  }, [user, isHydrated]);

  // Sync orders to localStorage
  useEffect(() => {
    if (!isHydrated) return;
    try {
      localStorage.setItem(ORDERS_STORAGE_KEY, JSON.stringify(orders));
    } catch (e) {
      console.warn("Failed to save orders to localStorage", e);
    }
  }, [orders, isHydrated]);

  // Cross-tab real-time sync & focus reload for orders and user
  useEffect(() => {
    const handleStorageChange = (e: StorageEvent) => {
      if (e.key === ORDERS_STORAGE_KEY && e.newValue) {
        try {
          setOrders(JSON.parse(e.newValue));
        } catch (err) {
          console.warn("Failed to parse storage sync orders", err);
        }
      }
      if (e.key === USER_STORAGE_KEY) {
        try {
          setUser(e.newValue ? JSON.parse(e.newValue) : null);
        } catch (err) {
          console.warn("Failed to parse storage sync user", err);
        }
      }
    };

    const handleFocus = () => {
      try {
        const savedOrders = localStorage.getItem(ORDERS_STORAGE_KEY);
        if (savedOrders) {
          const parsed = JSON.parse(savedOrders);
          if (Array.isArray(parsed)) {
            setOrders((current) => {
              // Smart merge: retain all active in-memory orders and merge any new ones from storage
              const currentIds = new Set(current.map((o) => o.id));
              const missingFromCurrent = parsed.filter((o: OrderRecord) => !currentIds.has(o.id));
              if (missingFromCurrent.length === 0) return current;
              return [...current, ...missingFromCurrent];
            });
          }
        }
        const savedUser = localStorage.getItem(USER_STORAGE_KEY);
        if (savedUser) {
          setUser(JSON.parse(savedUser));
        }
      } catch (err) {
        console.warn("Failed to reload storage on focus", err);
      }
    };

    window.addEventListener("storage", handleStorageChange);
    window.addEventListener("focus", handleFocus);
    return () => {
      window.removeEventListener("storage", handleStorageChange);
      window.removeEventListener("focus", handleFocus);
    };
  }, []);

  const openAccountModal = useCallback(() => {
    setIsAccountModalOpen(true);
  }, []);

  const closeAccountModal = useCallback(() => {
    setIsAccountModalOpen(false);
  }, []);

  const login = useCallback(
    (profile: { name: string; email: string; phone?: string }) => {
      const newUser: UserProfile = {
        name: profile.name.trim() || "Valued Member",
        email: profile.email.trim() || "customer@veyro.in",
        phone: profile.phone?.trim() || "+91 98765 43210",
        isVIP: true,
        memberSince: "Sep 2026",
        address: {
          line1: "42, Richmond Road, Indiranagar",
          city: "Bengaluru",
          state: "Karnataka",
          pincode: "560038",
        },
      };
      setUser(newUser);
    },
    []
  );

  const demoLogin = useCallback(() => {
    const demoUser: UserProfile = {
      name: "Santhosh Kumar",
      email: "santhosh@veyro.in",
      phone: "+91 98765 43210",
      isVIP: true,
      memberSince: "Sep 2026",
      address: {
        line1: "42, Richmond Road, Indiranagar",
        city: "Bengaluru",
        state: "Karnataka",
        pincode: "560038",
      },
    };
    setUser(demoUser);
  }, []);

  const logout = useCallback(() => {
    setUser(null);
  }, []);

  const addOrder = useCallback((order: OrderRecord) => {
    // 1. Always save a dedicated standalone copy of the last placed order for fail-safe retrieval
    try {
      localStorage.setItem(LAST_ORDER_KEY, JSON.stringify(order));
    } catch (e) {
      console.warn("Failed to save last placed order fallback", e);
    }

    // 2. Add to active orders state & sync to storage
    setOrders((prev) => {
      if (prev.some((o) => o.id === order.id)) return prev;
      const updated = [order, ...prev];
      try {
        localStorage.setItem(ORDERS_STORAGE_KEY, JSON.stringify(updated));
      } catch (e) {
        console.warn("Failed to save orders to localStorage synchronously", e);
      }
      return updated;
    });
  }, []);

  const updateOrderStatus = useCallback((orderId: string, status: OrderStatus, note?: string) => {
    setOrders((prev) => {
      const now = new Date();
      const timestamp =
        now.toLocaleDateString("en-IN", {
          day: "2-digit",
          month: "short",
          year: "numeric",
        }) +
        ", " +
        now.toLocaleTimeString("en-IN", {
          hour: "2-digit",
          minute: "2-digit",
          hour12: true,
        });

      const updated = prev.map((order) => {
        if (order.id !== orderId) return order;
        return {
          ...order,
          status,
          deliveredDate: status === "Delivered" ? new Date().toISOString() : order.deliveredDate,
          timeline: [
            ...order.timeline,
            {
              status,
              timestamp,
              description: note || `Status updated to ${status} via Admin Panel`,
            },
          ],
        };
      });

      try {
        localStorage.setItem(ORDERS_STORAGE_KEY, JSON.stringify(updated));
      } catch (e) {
        console.warn("Failed to persist updated order status to localStorage", e);
      }
      return updated;
    });
  }, []);

  const deleteOrder = useCallback((orderId: string) => {
    setOrders((prev) => {
      const updated = prev.filter((o) => o.id !== orderId);
      try {
        localStorage.setItem(ORDERS_STORAGE_KEY, JSON.stringify(updated));
      } catch (e) {
        console.warn("Failed to persist deleted order to localStorage", e);
      }
      return updated;
    });
  }, []);

  const cancelOrder = useCallback((orderId: string, reason?: string) => {
    setOrders((prev) =>
      prev.map((order) => {
        if (order.id !== orderId) return order;
        const now = new Date();
        const timestamp =
          now.toLocaleDateString("en-IN", {
            day: "2-digit",
            month: "short",
            year: "numeric",
          }) +
          ", " +
          now.toLocaleTimeString("en-IN", {
            hour: "2-digit",
            minute: "2-digit",
            hour12: true,
          });
        return {
          ...order,
          status: "Cancelled" as OrderStatus,
          estimatedDelivery: "Order Cancelled",
          timeline: [
            ...order.timeline,
            {
              status: "Cancelled" as OrderStatus,
              timestamp,
              description: reason
                ? `Cancelled by customer: ${reason}`
                : "Cancelled by customer",
            },
          ],
        };
      })
    );
  }, []);

  const requestReturn = useCallback((orderId: string, itemIndices: number[], reason: string, details?: string) => {
    setOrders((currentOrders) =>
      currentOrders.map((order) => {
        if (order.id !== orderId) return order;

        const actionType = "Return Requested";
        const now = new Date();
        const timestamp =
          now.toLocaleDateString("en-IN", {
            day: "2-digit",
            month: "short",
            year: "numeric",
          }) +
          ", " +
          now.toLocaleTimeString("en-IN", {
            hour: "2-digit",
            minute: "2-digit",
            hour12: true,
          });

        return {
          ...order,
          status: actionType as OrderStatus,
          timeline: [
            ...order.timeline,
            {
              status: actionType as OrderStatus,
              timestamp,
              description: `Return requested for ${itemIndices.length} item(s). Reason: ${reason}. ${details ? `Details: ${details}` : ""}`,
            },
          ],
        };
      })
    );
  }, []);

  const reviewReturnRequest = useCallback(
    (orderId: string, decision: "approved" | "rejected", note?: string) => {
      setOrders((currentOrders) => {
        const updated = currentOrders.map((order) => {
          if (order.id !== orderId) return order;

          const now = new Date();
          const timestamp =
            now.toLocaleDateString("en-IN", {
              day: "2-digit",
              month: "short",
              year: "numeric",
            }) +
            ", " +
            now.toLocaleTimeString("en-IN", {
              hour: "2-digit",
              minute: "2-digit",
              hour12: true,
            });

          const newStatus: OrderStatus = decision === "approved" ? "Returned" : order.status;
          const statusDesc =
            decision === "approved"
              ? `Return approved: ${note || "Refund initiated to original payment method"}`
              : `Return rejected: ${note || "Does not meet return criteria"}`;

          return {
            ...order,
            status: newStatus,
            returnRequest: order.returnRequest
              ? {
                  ...order.returnRequest,
                  status: decision,
                  details: note || order.returnRequest.details,
                }
              : {
                  requestedAt: timestamp,
                  reason: "Return",
                  status: decision,
                  details: note,
                },
            timeline: [
              ...order.timeline,
              {
                status: newStatus,
                timestamp,
                description: statusDesc,
              },
            ],
          };
        });

        try {
          localStorage.setItem(ORDERS_STORAGE_KEY, JSON.stringify(updated));
        } catch (e) {
          console.warn("Failed to persist return review to localStorage", e);
        }
        return updated;
      });
    },
    []
  );

  const updateProfile = useCallback((updates: Partial<UserProfile>) => {
    setUser((prev) => {
      if (!prev) return null;
      return {
        ...prev,
        ...updates,
        address: updates.address
          ? {
              line1: updates.address.line1 ?? prev.address?.line1 ?? "",
              city: updates.address.city ?? prev.address?.city ?? "",
              state: updates.address.state ?? prev.address?.state ?? "",
              pincode: updates.address.pincode ?? prev.address?.pincode ?? "",
            }
          : prev.address,
      };
    });
  }, []);

  return (
    <UserContext.Provider
      value={{
        user,
        orders,
        isHydrated,
        isAccountModalOpen,
        openAccountModal,
        closeAccountModal,
        login,
        demoLogin,
        logout,
        addOrder,
        updateOrderStatus,
        deleteOrder,
        cancelOrder,
        requestReturn,
        reviewReturnRequest,
        updateProfile,
      }}
    >
      {children}
    </UserContext.Provider>
  );
}

export function useUser() {
  const context = useContext(UserContext);
  if (!context) {
    throw new Error("useUser must be used within a UserProvider");
  }
  return context;
}
