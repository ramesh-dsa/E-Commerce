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
  cancelOrder: (orderId: string, reason?: string) => void;
  requestReturn: (orderId: string, itemIndices: number[], reason: string, details?: string) => void;
  updateProfile: (updates: Partial<UserProfile>) => void;
}

const UserContext = createContext<UserContextType | undefined>(undefined);

const USER_STORAGE_KEY = "veyro_user_v1";
const ORDERS_STORAGE_KEY = "veyro_orders_v4";

const DEFAULT_DEMO_ORDERS: OrderRecord[] = [
  {
    id: "VEY-2026-84920",
    date: "14 Sep 2026, 02:45 PM",
    total: 3898,
    subtotal: 3898,
    bundleDiscount: 0,
    couponDiscount: 0,
    couponCode: null,
    shippingCost: 0,
    itemsCount: 2,
    items: [
      {
        productId: "vey-tsh-ovr-001",
        productName: "Lunar Wolf Oversized Tee",
        productSlug: "core-oversized-tee-black",
        imageUrl: "/products/tshirts/core-oversized-wolf-tee-front.webp",
        colorName: "Black",
        selectedSize: "L",
        quantity: 1,
        unitPrice: 1199,
        totalPrice: 1199,
      },
      {
        productId: "vey-ftw-min-001",
        productName: "Blanc Court Sneaker",
        productSlug: "blanc-court-sneaker-white",
        imageUrl: "/products/shoes/veyro-shoe-01-primary.webp",
        colorName: "Triple White",
        selectedSize: "UK 9",
        quantity: 1,
        unitPrice: 2699,
        totalPrice: 2699,
      },
    ],
    itemNames: ["Lunar Wolf Oversized Tee (Black / L)", "Blanc Court Sneaker (Triple White / UK 9)"],
    status: "Out for Delivery",
    estimatedDelivery: "Today by 8:00 PM",
    timeline: [
      {
        status: "Confirmed",
        timestamp: "22 Sep 2026, 02:45 PM",
        description: "Order placed successfully",
      },
      {
        status: "Packed",
        timestamp: "22 Sep 2026, 04:10 PM",
        description: "Items packed at Tirupur Mill Hub",
      },
      {
        status: "Shipped",
        timestamp: "22 Sep 2026, 05:30 PM",
        description: "Dispatched via VEYRO Express",
      },
      {
        status: "Out for Delivery",
        timestamp: "22 Sep 2026, 06:15 PM",
        description: "Out for delivery — arriving by 8:00 PM",
      },
    ],
    shippingAddress: {
      name: "Santhosh Kumar",
      phone: "+91 98765 43210",
      address: "42, Richmond Road, Indiranagar, Bengaluru, Karnataka",
      pincode: "560038",
    },
    paymentMethod: "upi",
  },
  {
    id: "VEY-2026-72104",
    date: "14 Sep 2026",
    total: 1199,
    subtotal: 1199,
    bundleDiscount: 0,
    couponDiscount: 0,
    couponCode: null,
    shippingCost: 0,
    itemsCount: 1,
    items: [
      {
        productId: "vey-tsh-ovr-002",
        productName: "Ease Oversized Tee",
        productSlug: "ease-oversized-tee-off-white",
        imageUrl: "/products/tshirts/ease-cream-clean-front.webp",
        colorName: "Off-White",
        selectedSize: "M",
        quantity: 1,
        unitPrice: 1199,
        totalPrice: 1199,
      },
    ],
    itemNames: ["Ease Oversized Tee (Off-White / M)"],
    status: "Delivered",
    deliveredDate: new Date(Date.now() - 2 * 24 * 60 * 60 * 1000).toISOString(), // 2 days ago (eligible)
    estimatedDelivery: "Delivered on 16 Sep",
    timeline: [
      {
        status: "Confirmed",
        timestamp: "14 Sep 2026, 10:20 AM",
        description: "Order placed successfully",
      },
      {
        status: "Packed",
        timestamp: "14 Sep 2026, 02:45 PM",
        description: "Items packed at Tirupur Mill Hub",
      },
      {
        status: "Shipped",
        timestamp: "14 Sep 2026, 06:00 PM",
        description: "Dispatched via VEYRO Express",
      },
      {
        status: "Out for Delivery",
        timestamp: "16 Sep 2026, 09:30 AM",
        description: "Out for delivery in Bengaluru",
      },
      {
        status: "Delivered",
        timestamp: "16 Sep 2026, 11:45 AM",
        description: "Delivered — signed by S. Kumar",
      },
    ],
    shippingAddress: {
      name: "Santhosh Kumar",
      phone: "+91 98765 43210",
      address: "42, Richmond Road, Indiranagar, Bengaluru, Karnataka",
      pincode: "560038",
    },
    paymentMethod: "cod",
  },
  {
    id: "VEY-2026-61037",
    date: "08 Sep 2026",
    total: 3199,
    subtotal: 3199,
    bundleDiscount: 0,
    couponDiscount: 0,
    couponCode: null,
    shippingCost: 0,
    itemsCount: 1,
    items: [
      {
        productId: "vey-ftw-ret-001",
        productName: "Campus Retro Sneaker",
        productSlug: "campus-retro-sneaker-off-white-green",
        imageUrl: "/products/shoes/veyro-shoe-04-primary.webp",
        colorName: "Off-White + Green",
        selectedSize: "UK 9",
        quantity: 1,
        unitPrice: 3199,
        totalPrice: 3199,
      },
    ],
    itemNames: ["Campus Retro Sneaker (Off-White + Green / UK 9)"],
    status: "Delivered",
    deliveredDate: new Date(Date.now() - 4 * 24 * 60 * 60 * 1000).toISOString(), // 4 days ago (eligible for testing)
    estimatedDelivery: "Delivered on 10 Sep",
    timeline: [
      {
        status: "Confirmed",
        timestamp: "08 Sep 2026, 08:15 PM",
        description: "Order placed successfully",
      },
      {
        status: "Packed",
        timestamp: "09 Sep 2026, 10:00 AM",
        description: "Items packed at Tirupur Mill Hub",
      },
      {
        status: "Shipped",
        timestamp: "09 Sep 2026, 03:30 PM",
        description: "Dispatched via VEYRO Express",
      },
      {
        status: "Out for Delivery",
        timestamp: "10 Sep 2026, 08:00 AM",
        description: "Out for delivery in Bengaluru",
      },
      {
        status: "Delivered",
        timestamp: "10 Sep 2026, 12:20 PM",
        description: "Delivered — signed by S. Kumar",
      },
    ],
    shippingAddress: {
      name: "Santhosh Kumar",
      phone: "+91 98765 43210",
      address: "42, Richmond Road, Indiranagar, Bengaluru, Karnataka",
      pincode: "560038",
    },
    paymentMethod: "card",
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
        setOrders(JSON.parse(savedOrders));
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
    setOrders((prev) => [order, ...prev]);
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
        cancelOrder,
        requestReturn,
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
