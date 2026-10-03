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
        productId: "vey-wat-stl-001",
        productName: "Royal Steel Edition",
        productSlug: "royal-steel-edition",
        imageUrl: "/products/watches/seiko-watch.jpg",
        colorName: "Silver Steel",
        selectedSize: "40mm",
        quantity: 1,
        unitPrice: 1259,
        totalPrice: 1259,
      },
    ],
    itemNames: ["Royal Steel Edition (Silver Steel / 40mm)"],
    status: "Delivered",
    deliveredDate: "2026-10-03T13:50:00.000Z",
    estimatedDelivery: "Delivered on 03 Oct",
    timeline: [
      { status: "Confirmed", timestamp: "03 Oct 2026, 09:10 AM", description: "Order confirmed" },
      { status: "Packed", timestamp: "03 Oct 2026, 10:30 AM", description: "Packed at Chennai Hub" },
      { status: "Shipped", timestamp: "03 Oct 2026, 11:45 AM", description: "Dispatched via Express" },
      { status: "Delivered", timestamp: "03 Oct 2026, 01:50 PM", description: "Delivered to Boopesh" },
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
    status: "Processing",
    estimatedDelivery: "Arriving by 05 Oct",
    timeline: [
      { status: "Confirmed", timestamp: "02 Oct 2026, 10:20 AM", description: "Payment verified" },
      { status: "Processing", timestamp: "02 Oct 2026, 11:00 AM", description: "Order is being packed" },
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
    status: "Shipped",
    estimatedDelivery: "Arriving Tomorrow",
    timeline: [
      { status: "Confirmed", timestamp: "01 Oct 2026, 06:15 PM", description: "Order received" },
      { status: "Packed", timestamp: "02 Oct 2026, 09:30 AM", description: "Packed in eco-box" },
      { status: "Shipped", timestamp: "02 Oct 2026, 02:00 PM", description: "In transit with BlueDart" },
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
        productId: "vey-wat-her-001",
        productName: "Heritage Automatic",
        productSlug: "heritage-automatic-brown",
        imageUrl: "/products/watches/dw-watch.jpg",
        colorName: "Cognac Brown",
        selectedSize: "41mm",
        quantity: 1,
        unitPrice: 2499,
        totalPrice: 2499,
      },
      {
        productId: "vey-tsh-ovr-003",
        productName: "Core Relaxed Tee",
        productSlug: "core-relaxed-tee-olive",
        imageUrl: "/products/tshirts/grid-waffle-falcon-tee-hover.webp",
        colorName: "Olive",
        selectedSize: "XL",
        quantity: 2,
        unitPrice: 649,
        totalPrice: 1298,
      },
    ],
    itemNames: ["Heritage Automatic", "Core Relaxed Tee x2"],
    status: "Delivered",
    deliveredDate: "2026-09-30T11:42:00.000Z",
    estimatedDelivery: "Delivered on 30 Sep",
    timeline: [
      { status: "Confirmed", timestamp: "28 Sep 2026, 10:00 AM", description: "Order confirmed" },
      { status: "Shipped", timestamp: "29 Sep 2026, 03:00 PM", description: "Dispatched from Mumbai" },
      { status: "Delivered", timestamp: "30 Sep 2026, 11:42 AM", description: "Delivered to Arjun M" },
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
        productId: "vey-wat-urb-001",
        productName: "Urban Chrono Black",
        productSlug: "urban-chrono-black",
        imageUrl: "/products/watches/aigner-blue-watch.jpg",
        colorName: "Stealth Black",
        selectedSize: "42mm",
        quantity: 1,
        unitPrice: 1199,
        totalPrice: 1199,
      },
    ],
    itemNames: ["Urban Chrono Black (Stealth Black)"],
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
      status: "pending",
      details: "Need size replacement for comfortable fit",
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
        productId: "vey-wat-stl-001",
        productName: "Royal Steel Edition",
        productSlug: "royal-steel-edition",
        imageUrl: "/products/watches/veyro-watch-01.webp",
        colorName: "Silver Steel",
        selectedSize: "42mm",
        quantity: 1,
        unitPrice: 2499,
        totalPrice: 2499,
      },
    ],
    itemNames: ["Royal Steel Edition (Silver Steel)"],
    status: "Delivered",
    deliveredDate: "2026-09-27T11:15:00.000Z",
    estimatedDelivery: "Delivered on 27 Sep",
    timeline: [
      { status: "Confirmed", timestamp: "25 Sep 2026, 04:10 PM", description: "Order placed" },
      { status: "Delivered", timestamp: "27 Sep 2026, 11:15 AM", description: "Signed by Rahul" },
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
    status: "Delivered",
    deliveredDate: "2026-09-25T14:40:00.000Z",
    estimatedDelivery: "Delivered on 25 Sep",
    returnRequest: {
      requestedAt: "26 Sep 2026, 04:15 PM",
      reason: "Defective stitching on right sleeve hem",
      status: "pending",
      details: "Sleeve seam is unraveling, refund requested",
    },
    timeline: [
      { status: "Confirmed", timestamp: "23 Sep 2026, 01:00 PM", description: "Order confirmed" },
      { status: "Delivered", timestamp: "25 Sep 2026, 02:40 PM", description: "Delivered successfully" },
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
        productId: "vey-wat-her-001",
        productName: "Heritage Automatic",
        productSlug: "heritage-automatic-brown",
        imageUrl: "/products/watches/veyro-watch-03.webp",
        colorName: "Cognac Brown",
        selectedSize: "39mm",
        quantity: 1,
        unitPrice: 1749,
        totalPrice: 1749,
      },
    ],
    itemNames: ["Heritage Automatic (Cognac Brown / 39mm)"],
    status: "Processing",
    estimatedDelivery: "Arriving by 24 Sep",
    timeline: [
      { status: "Confirmed", timestamp: "20 Sep 2026, 05:10 PM", description: "Order received" },
      { status: "Processing", timestamp: "20 Sep 2026, 06:00 PM", description: "Verifying inventory" },
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
            items: (o.items || []).map((it) => {
              let img = it.imageUrl || "";
              if (img.includes("veyro-watch-01.webp")) img = "/products/watches/seiko-watch.jpg";
              else if (img.includes("veyro-watch-03.webp")) img = "/products/watches/dw-watch.jpg";
              else if (img.includes("veyro-watch-04.webp")) img = "/products/watches/aigner-blue-watch.jpg";
              return { ...it, imageUrl: img };
            }),
          }));
          setOrders(normalized);
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
          setOrders(JSON.parse(savedOrders));
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
    setOrders((prev) => {
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
