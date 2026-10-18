"use client";

import React, { useState, useEffect, useMemo, useRef, useSyncExternalStore } from "react";
import Image from "next/image";
import Link from "next/link";
import { useRouter } from "next/navigation";
import { useCart } from "@/context/CartContext";
import { useProducts } from "@/context/ProductsContext";
import { useUser } from "@/context/UserContext";
import { formatPrice } from "@/lib/utils";
import type { OrderRecord } from "@/types";
import {
  ChevronLeft,
  ShieldCheck,
  CheckCircle2,
  Lock,
  Truck,
  CreditCard,
  Smartphone,
  Banknote,
  Tag,
  Check,
  RotateCcw,
  ArrowRight,
  ShoppingBag,
  AlertCircle,
  XCircle,
  RefreshCw,
  MapPin,
  Navigation,
  Home,
  Plus,
  LocateFixed,
  ArrowLeft,
} from "lucide-react";

const emptySubscribe = () => () => {};
function useMounted() {
  return useSyncExternalStore(
    emptySubscribe,
    () => true,
    () => false
  );
}

export type CardBrand = "visa" | "mastercard" | "amex" | "rupay" | "unknown";

export function detectCardBrand(num: string): CardBrand {
  const clean = num.replace(/\D/g, "");
  if (/^4/.test(clean)) return "visa";
  if (/^(5[1-5]|2[2-7])/.test(clean)) return "mastercard";
  if (/^3[47]/.test(clean)) return "amex";
  if (/^(60|65|81|82|508)/.test(clean)) return "rupay";
  return "unknown";
}

function VisaBadge({ active = true }: { active?: boolean }) {
  return (
    <span
      className={`inline-flex items-center px-1.5 py-0.5 rounded-[3px] text-[10px] font-black tracking-tight text-white bg-[#1a1f71] select-none transition-opacity duration-200 ${
        active ? "opacity-100 shadow-xs" : "opacity-35"
      }`}
    >
      VISA
    </span>
  );
}

function MastercardBadge({ active = true }: { active?: boolean }) {
  return (
    <span
      className={`inline-flex items-center px-1.5 py-0.5 rounded-[3px] bg-[#1f1f1f] select-none transition-opacity duration-200 ${
        active ? "opacity-100 shadow-xs" : "opacity-35"
      }`}
    >
      <span className="w-3 h-3 rounded-full bg-[#EB001B] inline-block" />
      <span className="w-3 h-3 rounded-full bg-[#F79E1B] inline-block -ml-1.5 opacity-90" />
    </span>
  );
}

function RuPayBadge({ active = true }: { active?: boolean }) {
  return (
    <span
      className={`inline-flex items-center px-1.5 py-0.5 rounded-[3px] text-[9px] font-extrabold italic tracking-tight text-white bg-[#004B87] select-none transition-opacity duration-200 ${
        active ? "opacity-100 shadow-xs" : "opacity-35"
      }`}
    >
      RuPay
    </span>
  );
}

function AmexBadge({ active = true }: { active?: boolean }) {
  return (
    <span
      className={`inline-flex items-center px-1.5 py-0.5 rounded-[3px] text-[9px] font-black tracking-wider text-white bg-[#006FCF] select-none transition-opacity duration-200 ${
        active ? "opacity-100 shadow-xs" : "opacity-35"
      }`}
    >
      AMEX
    </span>
  );
}

interface ReverseGeocodeResult {
  success?: boolean;
  street?: string;
  suburb?: string;
  city?: string;
  state?: string;
  pincode?: string;
  displayName?: string;
  latitude?: number;
  longitude?: number;
  source?: "live_gps" | "network_ip";
  error?: string;
}

const AUTHENTIC_UPI_QR_PATH =
  "M2,2h7v1h-7zM10,2h1v1h-1zM12,2h3v1h-3zM18,2h3v1h-3zM23,2h1v1h-1zM25,2h2v1h-2zM28,2h1v1h-1zM30,2h5v1h-5zM36,2h7v1h-7zM2,3h1v1h-1zM8,3h1v1h-1zM10,3h2v1h-2zM14,3h2v1h-2zM21,3h1v1h-1zM23,3h1v1h-1zM25,3h2v1h-2zM29,3h3v1h-3zM36,3h1v1h-1zM42,3h1v1h-1zM2,4h1v1h-1zM4,4h3v1h-3zM8,4h1v1h-1zM10,4h9v1h-9zM22,4h1v1h-1zM24,4h2v1h-2zM28,4h1v1h-1zM31,4h2v1h-2zM34,4h1v1h-1zM36,4h1v1h-1zM38,4h3v1h-3zM42,4h1v1h-1zM2,5h1v1h-1zM4,5h3v1h-3zM8,5h1v1h-1zM11,5h3v1h-3zM15,5h2v1h-2zM20,5h3v1h-3zM24,5h1v1h-1zM26,5h1v1h-1zM29,5h2v1h-2zM36,5h1v1h-1zM38,5h3v1h-3zM42,5h1v1h-1zM2,6h1v1h-1zM4,6h3v1h-3zM8,6h1v1h-1zM11,6h3v1h-3zM16,6h1v1h-1zM19,6h1v1h-1zM21,6h3v1h-3zM26,6h1v1h-1zM28,6h7v1h-7zM36,6h1v1h-1zM38,6h3v1h-3zM42,6h1v1h-1zM2,7h1v1h-1zM8,7h1v1h-1zM10,7h1v1h-1zM13,7h1v1h-1zM15,7h1v1h-1zM17,7h1v1h-1zM20,7h1v1h-1zM22,7h1v1h-1zM25,7h2v1h-2zM28,7h3v1h-3zM32,7h1v1h-1zM34,7h1v1h-1zM36,7h1v1h-1zM42,7h1v1h-1zM2,8h7v1h-7zM10,8h1v1h-1zM12,8h1v1h-1zM14,8h1v1h-1zM16,8h1v1h-1zM18,8h1v1h-1zM20,8h1v1h-1zM22,8h1v1h-1zM24,8h1v1h-1zM26,8h1v1h-1zM28,8h1v1h-1zM30,8h1v1h-1zM32,8h1v1h-1zM34,8h1v1h-1zM36,8h7v1h-7zM10,9h5v1h-5zM16,9h1v1h-1zM23,9h4v1h-4zM28,9h3v1h-3zM33,9h1v1h-1zM4,10h3v1h-3zM8,10h1v1h-1zM10,10h1v1h-1zM12,10h1v1h-1zM14,10h1v1h-1zM16,10h1v1h-1zM18,10h1v1h-1zM20,10h2v1h-2zM23,10h2v1h-2zM26,10h1v1h-1zM30,10h3v1h-3zM34,10h4v1h-4zM40,10h3v1h-3zM2,11h1v1h-1zM5,11h1v1h-1zM11,11h3v1h-3zM15,11h1v1h-1zM17,11h2v1h-2zM21,11h1v1h-1zM23,11h6v1h-6zM30,11h2v1h-2zM33,11h2v1h-2zM36,11h1v1h-1zM38,11h2v1h-2zM41,11h1v1h-1zM4,12h1v1h-1zM6,12h3v1h-3zM10,12h4v1h-4zM15,12h7v1h-7zM25,12h6v1h-6zM32,12h1v1h-1zM34,12h1v1h-1zM36,12h4v1h-4zM2,13h3v1h-3zM6,13h2v1h-2zM9,13h1v1h-1zM11,13h3v1h-3zM16,13h2v1h-2zM19,13h1v1h-1zM21,13h1v1h-1zM23,13h3v1h-3zM29,13h2v1h-2zM35,13h5v1h-5zM3,14h3v1h-3zM8,14h1v1h-1zM14,14h3v1h-3zM20,14h2v1h-2zM24,14h1v1h-1zM27,14h2v1h-2zM31,14h2v1h-2zM34,14h1v1h-1zM36,14h1v1h-1zM39,14h2v1h-2zM42,14h1v1h-1zM2,15h1v1h-1zM4,15h1v1h-1zM14,15h1v1h-1zM18,15h6v1h-6zM25,15h8v1h-8zM35,15h1v1h-1zM37,15h2v1h-2zM40,15h1v1h-1zM42,15h1v1h-1zM2,16h2v1h-2zM5,16h1v1h-1zM8,16h2v1h-2zM12,16h1v1h-1zM15,16h1v1h-1zM18,16h1v1h-1zM21,16h1v1h-1zM23,16h2v1h-2zM28,16h1v1h-1zM31,16h1v1h-1zM34,16h1v1h-1zM36,16h1v1h-1zM38,16h2v1h-2zM2,17h2v1h-2zM5,17h2v1h-2zM10,17h1v1h-1zM12,17h1v1h-1zM16,17h4v1h-4zM21,17h3v1h-3zM26,17h2v1h-2zM30,17h1v1h-1zM36,17h1v1h-1zM38,17h2v1h-2zM3,18h1v1h-1zM5,18h1v1h-1zM7,18h2v1h-2zM11,18h2v1h-2zM15,18h3v1h-3zM27,18h2v1h-2zM31,18h1v1h-1zM34,18h2v1h-2zM39,18h2v1h-2zM2,19h1v1h-1zM6,19h1v1h-1zM9,19h1v1h-1zM14,19h4v1h-4zM30,19h1v1h-1zM33,19h4v1h-4zM38,19h1v1h-1zM40,19h1v1h-1zM42,19h1v1h-1zM3,20h3v1h-3zM7,20h3v1h-3zM12,20h2v1h-2zM16,20h1v1h-1zM27,20h1v1h-1zM29,20h1v1h-1zM32,20h1v1h-1zM34,20h3v1h-3zM39,20h1v1h-1zM6,21h2v1h-2zM10,21h1v1h-1zM16,21h2v1h-2zM28,21h1v1h-1zM30,21h1v1h-1zM33,21h1v1h-1zM39,21h1v1h-1zM4,22h1v1h-1zM6,22h1v1h-1zM8,22h2v1h-2zM14,22h4v1h-4zM28,22h3v1h-3zM32,22h1v1h-1zM38,22h3v1h-3zM2,23h1v1h-1zM5,23h3v1h-3zM9,23h1v1h-1zM13,23h2v1h-2zM27,23h2v1h-2zM31,23h1v1h-1zM33,23h4v1h-4zM38,23h1v1h-1zM40,23h1v1h-1zM42,23h1v1h-1zM2,24h4v1h-4zM7,24h2v1h-2zM11,24h1v1h-1zM14,24h1v1h-1zM27,24h1v1h-1zM29,24h1v1h-1zM31,24h1v1h-1zM34,24h2v1h-2zM39,24h1v1h-1zM4,25h2v1h-2zM7,25h1v1h-1zM9,25h3v1h-3zM13,25h2v1h-2zM27,25h1v1h-1zM30,25h1v1h-1zM35,25h2v1h-2zM38,25h2v1h-2zM41,25h1v1h-1zM2,26h1v1h-1zM5,26h1v1h-1zM7,26h2v1h-2zM14,26h4v1h-4zM28,26h1v1h-1zM30,26h2v1h-2zM33,26h1v1h-1zM35,26h1v1h-1zM41,26h1v1h-1zM4,27h1v1h-1zM6,27h2v1h-2zM10,27h2v1h-2zM16,27h1v1h-1zM18,27h1v1h-1zM22,27h1v1h-1zM24,27h1v1h-1zM26,27h1v1h-1zM28,27h1v1h-1zM33,27h2v1h-2zM36,27h1v1h-1zM38,27h1v1h-1zM42,27h1v1h-1zM3,28h1v1h-1zM5,28h2v1h-2zM8,28h3v1h-3zM14,28h2v1h-2zM17,28h3v1h-3zM21,28h1v1h-1zM25,28h1v1h-1zM27,28h5v1h-5zM35,28h1v1h-1zM37,28h1v1h-1zM41,28h1v1h-1zM4,29h4v1h-4zM9,29h1v1h-1zM13,29h3v1h-3zM17,29h1v1h-1zM21,29h1v1h-1zM23,29h1v1h-1zM25,29h1v1h-1zM29,29h1v1h-1zM32,29h1v1h-1zM37,29h1v1h-1zM39,29h1v1h-1zM3,30h4v1h-4zM8,30h1v1h-1zM12,30h3v1h-3zM16,30h1v1h-1zM19,30h1v1h-1zM21,30h1v1h-1zM24,30h2v1h-2zM29,30h3v1h-3zM35,30h1v1h-1zM38,30h1v1h-1zM40,30h1v1h-1zM2,31h1v1h-1zM6,31h2v1h-2zM11,31h2v1h-2zM14,31h1v1h-1zM16,31h5v1h-5zM22,31h1v1h-1zM25,31h2v1h-2zM28,31h2v1h-2zM34,31h1v1h-1zM37,31h2v1h-2zM41,31h2v1h-2zM2,32h1v1h-1zM4,32h2v1h-2zM7,32h2v1h-2zM10,32h2v1h-2zM13,32h1v1h-1zM17,32h1v1h-1zM19,32h3v1h-3zM23,32h2v1h-2zM26,32h1v1h-1zM28,32h6v1h-6zM36,32h2v1h-2zM40,32h1v1h-1zM2,33h1v1h-1zM5,33h1v1h-1zM10,33h5v1h-5zM16,33h1v1h-1zM19,33h2v1h-2zM23,33h1v1h-1zM26,33h1v1h-1zM29,33h1v1h-1zM32,33h3v1h-3zM36,33h2v1h-2zM39,33h1v1h-1zM41,33h2v1h-2zM2,34h1v1h-1zM5,34h5v1h-5zM13,34h1v1h-1zM15,34h1v1h-1zM20,34h1v1h-1zM23,34h7v1h-7zM31,34h1v1h-1zM33,34h6v1h-6zM40,34h1v1h-1zM10,35h3v1h-3zM14,35h5v1h-5zM21,35h1v1h-1zM23,35h4v1h-4zM28,35h1v1h-1zM31,35h4v1h-4zM38,35h1v1h-1zM41,35h2v1h-2zM2,36h7v1h-7zM11,36h1v1h-1zM14,36h5v1h-5zM20,36h1v1h-1zM22,36h2v1h-2zM27,36h1v1h-1zM29,36h3v1h-3zM34,36h1v1h-1zM36,36h1v1h-1zM38,36h1v1h-1zM40,36h1v1h-1zM2,37h1v1h-1zM8,37h1v1h-1zM11,37h5v1h-5zM17,37h3v1h-3zM22,37h1v1h-1zM24,37h2v1h-2zM29,37h6v1h-6zM38,37h2v1h-2zM41,37h2v1h-2zM2,38h1v1h-1zM4,38h3v1h-3zM8,38h1v1h-1zM10,38h2v1h-2zM15,38h2v1h-2zM18,38h2v1h-2zM22,38h3v1h-3zM26,38h4v1h-4zM34,38h5v1h-5zM40,38h1v1h-1zM2,39h1v1h-1zM4,39h3v1h-3zM8,39h1v1h-1zM10,39h1v1h-1zM12,39h3v1h-3zM17,39h3v1h-3zM22,39h1v1h-1zM24,39h2v1h-2zM30,39h1v1h-1zM32,39h1v1h-1zM37,39h1v1h-1zM39,39h2v1h-2zM42,39h1v1h-1zM2,40h1v1h-1zM4,40h3v1h-3zM8,40h1v1h-1zM10,40h1v1h-1zM13,40h1v1h-1zM16,40h2v1h-2zM20,40h2v1h-2zM25,40h1v1h-1zM27,40h3v1h-3zM32,40h1v1h-1zM36,40h1v1h-1zM38,40h1v1h-1zM40,40h2v1h-2zM2,41h1v1h-1zM8,41h1v1h-1zM11,41h1v1h-1zM15,41h1v1h-1zM21,41h1v1h-1zM23,41h1v1h-1zM25,41h1v1h-1zM27,41h3v1h-3zM32,41h1v1h-1zM34,41h2v1h-2zM37,41h3v1h-3zM41,41h1v1h-1zM2,42h7v1h-7zM11,42h1v1h-1zM13,42h2v1h-2zM16,42h2v1h-2zM19,42h3v1h-3zM23,42h2v1h-2zM27,42h1v1h-1zM29,42h1v1h-1zM31,42h1v1h-1zM33,42h1v1h-1zM36,42h1v1h-1zM39,42h1v1h-1z";

function DetectedBrandIcon({ brand }: { brand: CardBrand }) {
  switch (brand) {
    case "visa":
      return <VisaBadge active={true} />;
    case "mastercard":
      return <MastercardBadge active={true} />;
    case "rupay":
      return <RuPayBadge active={true} />;
    case "amex":
      return <AmexBadge active={true} />;
    default:
      return null;
  }
}

export default function CheckoutPage() {
  const router = useRouter();
  const { products } = useProducts();
  const {
    items,
    inStockItems,
    oosItems,
    inStockCount,
    oosCount,
    hasAvailableItems,
    totalItems,
    subtotal,
    finalSubtotal,
    bundleDiscount,
    couponDiscount,
    appliedCoupon,
    applyCoupon,
    removeCoupon,
    removePurchasedItems,
    clearCart,
    hasFreeShipping,
    hasOosItems: cartHasOosItems,
  } = useCart();

  const { user, addOrder } = useUser();
  const isMounted = useMounted();
  
  // Payment lifecycle state (E9)
  type PaymentStatus = "idle" | "processing" | "failed" | "success";
  const [paymentStatus, setPaymentStatus] = useState<PaymentStatus>("idle");
  const [failureReason, setFailureReason] = useState<string>("");
  const [retryCount, setRetryCount] = useState(0);
  const [isSubmitting, setIsSubmitting] = useState(false);

  const failureBannerRef = useRef<HTMLDivElement>(null);
  const paymentSectionRef = useRef<HTMLElement>(null);

  useEffect(() => {
    if (paymentStatus === "failed" && failureBannerRef.current) {
      failureBannerRef.current.scrollIntoView({ behavior: "smooth", block: "center" });
    }
  }, [paymentStatus]);

  // Form State - Contact
  const [email, setEmail] = useState("ramesh.kumar@example.com");
  const [phone, setPhone] = useState("+91 98765 43210");

  // Form State - Shipping Address
  const [fullName, setFullName] = useState("Ramesh Kumar");
  const [streetAddress, setStreetAddress] = useState("Flat 402, Prestige Tower, Indiranagar");
  const [apartment, setApartment] = useState("");
  const [city, setCity] = useState("Bengaluru");
  const [stateName, setStateName] = useState("Karnataka");
  const [pincode, setPincode] = useState("560038");
  const [shippingMethod, setShippingMethod] = useState<"standard" | "express">("standard");

  // Form State - Payment
  const [paymentMethod, setPaymentMethod] = useState<"upi" | "card" | "cod">("upi");
  const [upiId, setUpiId] = useState("");
  const [cardNumber, setCardNumber] = useState("");
  const [cardHolder, setCardHolder] = useState("");
  const [cardExpiry, setCardExpiry] = useState("");
  const [cardCvv, setCardCvv] = useState("");

  // UPI Live Terminal State
  const [copiedUpi, setCopiedUpi] = useState(false);
  const [upiCountdown, setUpiCountdown] = useState(599);
  useEffect(() => {
    if (paymentMethod !== "upi") return;
    const timer = setInterval(() => {
      setUpiCountdown((prev) => (prev > 1 ? prev - 1 : 599));
    }, 1000);
    return () => clearInterval(timer);
  }, [paymentMethod]);

  const formatUpiTime = (seconds: number) => {
    const mins = Math.floor(seconds / 60);
    const secs = seconds % 60;
    return `${String(mins).padStart(2, "0")}:${String(secs).padStart(2, "0")}`;
  };

  // Promo code
  const [promoInput, setPromoInput] = useState("");
  const [promoError, setPromoError] = useState<string | null>(null);

  // Validation errors
  const [formErrors, setFormErrors] = useState<Record<string, string>>({});

  // Saved Profile Address derived from UserContext or active account
  const savedProfileAddress = useMemo(() => {
    if (user?.address?.line1) {
      return {
        name: user.name || "Ramesh Kumar",
        phone: user.phone || phone || "+91 98765 43210",
        line1: user.address.line1,
        city: user.address.city || "Bengaluru",
        state: user.address.state || "Karnataka",
        pincode: user.address.pincode || "560038",
        label: "Saved Profile Address (Home)",
        isCustomUser: true,
      };
    }
    return {
      name: "Ramesh Kumar",
      phone: "+91 98765 43210",
      line1: "Flat 402, Prestige Tower, Indiranagar",
      city: "Bengaluru",
      state: "Karnataka",
      pincode: "560038",
      label: "Saved Profile Address (Home)",
      isCustomUser: false,
    };
  }, [user, phone]);

  // Delivery address selection: "saved" (profile address) | "custom" (entered or live location)
  const [addressMode, setAddressMode] = useState<"saved" | "custom">("saved");

  // Live Location Auto-Detect states
  const [isLocating, setIsLocating] = useState(false);
  const [locatingStep, setLocatingStep] = useState("");
  const [locationError, setLocationError] = useState<string | null>(null);
  const [justAutofilled, setJustAutofilled] = useState(false);
  const [detectedLocationBadge, setDetectedLocationBadge] = useState<{
    area: string;
    city: string;
    state?: string;
    pincode?: string;
    accuracy?: number;
    source?: "live_gps" | "network_ip";
  } | null>(null);

  const handleSelectSavedAddress = () => {
    setAddressMode("saved");
    setFullName(savedProfileAddress.name);
    setStreetAddress(savedProfileAddress.line1);
    setApartment("");
    setCity(savedProfileAddress.city);
    setStateName(savedProfileAddress.state);
    setPincode(savedProfileAddress.pincode);
    setLocationError(null);
    setFormErrors((prev) => {
      const copy = { ...prev };
      delete copy.fullName;
      delete copy.streetAddress;
      delete copy.city;
      delete copy.stateName;
      delete copy.pincode;
      return copy;
    });
  };

  const handleSelectCustomAddress = () => {
    setAddressMode("custom");
  };

  const handleDetectLiveLocation = () => {
    setIsLocating(true);
    setLocationError(null);
    setLocatingStep("Connecting to GPS & network sensors...");

    const startTime = Date.now();
    const MIN_ANIMATION_TIME = 1600;

    // Staged step ticker sequence
    const ticker1 = setTimeout(() => {
      setLocatingStep("Triangulating live coordinates...");
    }, 450);

    const ticker2 = setTimeout(() => {
      setLocatingStep("Resolving street, city & postal code...");
    }, 950);

    const ticker3 = setTimeout(() => {
      setLocatingStep("Locking delivery destination...");
    }, 1350);

    const finishLocatingWithData = async (
      data: ReverseGeocodeResult,
      accuracy?: number,
      source: "live_gps" | "network_ip" = "network_ip"
    ) => {
      clearTimeout(ticker1);
      clearTimeout(ticker2);
      clearTimeout(ticker3);

      const elapsed = Date.now() - startTime;
      const remaining = Math.max(0, MIN_ANIMATION_TIME - elapsed);
      if (remaining > 0) {
        await new Promise((resolve) => setTimeout(resolve, remaining));
      }

      setAddressMode("custom");
      if (data.street) setStreetAddress(data.street);
      if (data.city) setCity(data.city);
      if (data.state) setStateName(data.state);
      if (data.pincode) setPincode(data.pincode);
      if (data.suburb && data.suburb !== data.city && !data.suburb.includes("Central")) {
        setApartment(data.suburb);
      } else {
        setApartment("");
      }

      setDetectedLocationBadge({
        area: data.suburb || data.street || data.city || "Current Area",
        city: data.city || "Your City",
        state: data.state,
        pincode: data.pincode,
        accuracy: accuracy,
        source: source,
      });

      // Trigger glowing micro-animation on filled inputs
      setJustAutofilled(true);
      setTimeout(() => setJustAutofilled(false), 2600);

      // Clear validation errors on filled fields
      setFormErrors((prev) => {
        const copy = { ...prev };
        delete copy.streetAddress;
        delete copy.city;
        delete copy.stateName;
        delete copy.pincode;
        return copy;
      });

      setIsLocating(false);
      setLocatingStep("");
    };

    const resolveViaNetworkFallback = async (reasonNotice?: string) => {
      try {
        const res = await fetch("/api/reverse-geocode?detectIp=true");
        if (!res.ok) {
          throw new Error(`Reverse geocode API failed with status ${res.status}`);
        }
        const data = await res.json();
        if (data.success && data.city) {
          await finishLocatingWithData(data, undefined, "network_ip");
          if (reasonNotice) {
            console.info("Live location resolved via network telemetry:", reasonNotice);
          }
        } else {
          throw new Error(data.error || "Network telemetry returned empty address");
        }
      } catch (fallbackErr) {
        console.error("Network telemetry fallback failed:", fallbackErr);
        clearTimeout(ticker1);
        clearTimeout(ticker2);
        clearTimeout(ticker3);
        const elapsed = Date.now() - startTime;
        const remaining = Math.max(0, 1000 - elapsed);
        if (remaining > 0) await new Promise((r) => setTimeout(r, remaining));
        setIsLocating(false);
        setLocatingStep("");
        setLocationError(
          "Could not detect your exact location automatically. Please enter your address details below."
        );
      }
    };

    if (typeof window === "undefined" || !navigator.geolocation) {
      resolveViaNetworkFallback("Geolocation API unsupported");
      return;
    }

    let resolved = false;

    // Safety timeout: if GPS doesn't answer within 3800ms, fall back to network telemetry
    const gpsTimer = setTimeout(() => {
      if (!resolved) {
        resolved = true;
        resolveViaNetworkFallback("GPS response timed out");
      }
    }, 3800);

    navigator.geolocation.getCurrentPosition(
      async (position) => {
        if (resolved) return;
        resolved = true;
        clearTimeout(gpsTimer);

        const { latitude, longitude, accuracy } = position.coords;

        try {
          const res = await fetch(`/api/reverse-geocode?lat=${latitude}&lon=${longitude}`);
          if (!res.ok) {
            throw new Error(`Reverse geocode failed with status ${res.status}`);
          }
          const data = await res.json();
          if (data.success && data.city) {
            await finishLocatingWithData(data, Math.round(accuracy), "live_gps");
          } else {
            throw new Error(data.error || "Nominatim returned no address");
          }
        } catch (osmErr) {
          console.warn("Reverse geocode failed, falling back to network telemetry:", osmErr);
          await resolveViaNetworkFallback("Reverse geocode failed on coordinates");
        }
      },
      (err) => {
        if (resolved) return;
        resolved = true;
        clearTimeout(gpsTimer);
        console.warn(`GPS error ${err.code}: ${err.message}. Falling back to network telemetry.`);
        resolveViaNetworkFallback(`GPS error code ${err.code}`);
      },
      {
        enableHighAccuracy: true,
        timeout: 3500,
        maximumAge: 60000,
      }
    );
  };

  const hasInitializedUserRef = useRef(false);
  useEffect(() => {
    if (!user) return;
    queueMicrotask(() => {
      if (user.email) setEmail(user.email);
      if (user.phone) setPhone(user.phone);
      if (user.name) setFullName(user.name);

      // Only populate address fields once on initial mount if still in saved mode
      if (!hasInitializedUserRef.current && addressMode === "saved" && user.address) {
        hasInitializedUserRef.current = true;
        if (user.address.line1) setStreetAddress(user.address.line1);
        if (user.address.city) setCity(user.address.city);
        if (user.address.state) setStateName(user.address.state);
        if (user.address.pincode) setPincode(user.address.pincode);
      }
    });
  }, [user, addressMode]);

  // Guard: redirect to /cart only if there are no available in-stock items to purchase
  useEffect(() => {
    if (isMounted && (items.length === 0 || inStockCount === 0)) {
      router.replace("/cart");
    }
  }, [isMounted, items.length, inStockCount, router]);

  // Delivery calculation
  const shippingFee = shippingMethod === "express" ? 149 : hasFreeShipping ? 0 : 99;
  const grandTotal = Math.max(0, finalSubtotal - couponDiscount + shippingFee);
  const totalSavings = bundleDiscount + couponDiscount;

  // Coupon handling
  const handleApplyPromo = (e: React.SyntheticEvent) => {
    e.preventDefault();
    setPromoError(null);
    if (!promoInput.trim()) return;

    const res = applyCoupon(promoInput.trim());
    if (res.success) {
      setPromoInput("");
    } else {
      setPromoError(res.message);
    }
  };

  // Card brand detection
  const cardBrand = useMemo(() => detectCardBrand(cardNumber), [cardNumber]);

  // Card number formatter (handles 16-digit 4-4-4-4 and Amex 15-digit 4-6-5)
  const handleCardNumberChange = (val: string) => {
    const clean = val.replace(/\D/g, "");
    const brand = detectCardBrand(clean);
    const maxDigits = brand === "amex" ? 15 : 16;
    const truncated = clean.slice(0, maxDigits);

    let formatted = truncated;
    if (brand === "amex") {
      const p1 = truncated.slice(0, 4);
      const p2 = truncated.slice(4, 10);
      const p3 = truncated.slice(10, 15);
      formatted = [p1, p2, p3].filter(Boolean).join(" ");
    } else {
      formatted = truncated.match(/.{1,4}/g)?.join(" ") || truncated;
    }

    setCardNumber(formatted);
    if (formErrors.cardNumber) {
      setFormErrors((prev) => {
        const next = { ...prev };
        delete next.cardNumber;
        return next;
      });
    }
    if (paymentStatus === "failed") setPaymentStatus("idle");
  };

  // Card expiry formatter
  const handleCardExpiryChange = (val: string) => {
    const cleaned = val.replace(/\D/g, "").slice(0, 4);
    if (cleaned.length >= 3) {
      setCardExpiry(`${cleaned.slice(0, 2)}/${cleaned.slice(2)}`);
    } else {
      setCardExpiry(cleaned);
    }
    if (formErrors.cardExpiry) {
      setFormErrors((prev) => {
        const next = { ...prev };
        delete next.cardExpiry;
        return next;
      });
    }
    if (paymentStatus === "failed") setPaymentStatus("idle");
  };

  // Quick fill demo test card
  const handleFillTestCard = () => {
    setCardNumber("4532 8921 4402 7891");
    setCardHolder(fullName || "Ramesh Kumar");
    setCardExpiry("12/28");
    setCardCvv("789");
    setFormErrors((prev) => {
      const next = { ...prev };
      delete next.cardNumber;
      delete next.cardHolder;
      delete next.cardExpiry;
      delete next.cardCvv;
      return next;
    });
    if (paymentStatus === "failed") setPaymentStatus("idle");
  };

  const validateForm = () => {
    const errors: Record<string, string> = {};
    if (!email.trim() || !email.includes("@")) {
      errors.email = "Please enter a valid email address.";
    }
    if (!phone.trim() || phone.replace(/\D/g, "").length < 10) {
      errors.phone = "Please enter a valid 10-digit mobile number.";
    }
    if (!fullName.trim()) {
      errors.fullName = "Please enter the recipient full name.";
    }
    if (!streetAddress.trim()) {
      errors.streetAddress = "Please enter delivery street address.";
    }
    if (!city.trim()) {
      errors.city = "Please enter city.";
    }
    if (!stateName.trim()) {
      errors.stateName = "Please enter state.";
    }
    if (!pincode.trim() || pincode.replace(/\D/g, "").length !== 6) {
      errors.pincode = "Please enter a valid 6-digit PIN code.";
    }

    if (paymentMethod === "card") {
      const cleanNum = cardNumber.replace(/\s/g, "");
      const brand = detectCardBrand(cleanNum);
      const expectedDigits = brand === "amex" ? 15 : 16;
      if (cleanNum.length < expectedDigits) {
        errors.cardNumber = `Please enter a valid ${expectedDigits}-digit card number.`;
      }
      if (!cardHolder.trim()) {
        errors.cardHolder = "Name on card is required.";
      }
      if (!cardExpiry || cardExpiry.length < 5) {
        errors.cardExpiry = "Expiry (MM/YY) is required.";
      }
      const expectedCvv = brand === "amex" ? 4 : 3;
      if (!cardCvv || cardCvv.length < expectedCvv) {
        errors.cardCvv = `Valid ${expectedCvv}-digit CVV is required.`;
      }
    }

    setFormErrors(errors);
    return Object.keys(errors).length === 0;
  };

  const handlePlaceOrder = (e: React.FormEvent) => {
    e.preventDefault();

    if (!validateForm()) {
      window.scrollTo({ top: 120, behavior: "smooth" });
      return;
    }

    setIsSubmitting(true);
    setPaymentStatus("processing");

    setTimeout(() => {
      // Failure simulation logic (E9 specification)
      let simulatedError: string | null = null;

      if (paymentMethod === "card") {
        if (cardCvv.trim() === "000") {
          simulatedError =
            "Card authorization declined. Your bank rejected the transaction. Please check your card limit or try a different card.";
        } else if (retryCount >= 2) {
          simulatedError =
            "Multiple authorization attempts failed. For security, please switch to a different payment method or try later.";
        }
      } else if (paymentMethod === "upi") {
        if (upiId.toLowerCase().includes("fail")) {
          simulatedError =
            "UPI payment timed out or was declined. Please verify your UPI ID and bank balance, then retry.";
        } else if (retryCount >= 2) {
          simulatedError =
            "Multiple authorization attempts failed. For security, please switch to a different payment method or try later.";
        }
      }
      // Note: COD never fails

      if (simulatedError) {
        setIsSubmitting(false);
        setPaymentStatus("failed");
        setFailureReason(simulatedError);
        setRetryCount((prev) => prev + 1);
        return;
      }

      setPaymentStatus("success");
      setIsSubmitting(false);

      const generatedOrderId = `VEY-${new Date().getFullYear()}-${Math.floor(
        10000 + Math.random() * 90000
      )}`;

      const now = new Date();
      const timestamp = now.toLocaleString("en-IN", {
        day: "2-digit",
        month: "short",
        year: "numeric",
        hour: "2-digit",
        minute: "2-digit",
        hour12: true,
      });

      const fullAddressString = [
        fullName,
        streetAddress,
        apartment,
        `${city}, ${stateName} - ${pincode}`,
      ]
        .filter(Boolean)
        .join(", ");

      const newOrder: OrderRecord = {
        id: generatedOrderId,
        date: timestamp,
        total: grandTotal,
        subtotal,
        bundleDiscount,
        couponDiscount,
        couponCode: appliedCoupon,
        shippingCost: shippingFee,
        itemsCount: inStockCount,
        items: inStockItems.map((i) => ({
          productId: i.product.id,
          productName: i.product.name,
          productSlug: i.product.slug,
          imageUrl: i.product.imageUrl || "/products/tshirts/core-oversized-wolf-tee-front.webp",
          colorName: i.product.colorName || "Original",
          selectedSize: i.selectedSize,
          quantity: i.quantity,
          unitPrice: i.product.price,
          totalPrice: i.product.price * i.quantity,
        })),
        itemNames: inStockItems.map((i) => `${i.product.name} (${i.selectedSize})`),
        status: "Confirmed",
        estimatedDelivery:
          shippingMethod === "express"
            ? "Tomorrow by 2:00 PM"
            : "In 2-3 Business Days",
        timeline: [
          {
            status: "Confirmed",
            timestamp: timestamp,
            description: "Payment verified & order confirmed",
          },
          {
            status: "Packed",
            timestamp: "Estimated: Today by 6:00 PM",
            description: "Quality inspection and dispatch preparation",
          },
          {
            status: "Shipped",
            timestamp: "Estimated: Tomorrow",
            description: "Handover to VEYRO Priority Express",
          },
        ],
        shippingAddress: {
          name: fullName,
          phone: phone,
          address: fullAddressString,
          pincode: pincode,
        },
        paymentMethod: paymentMethod,
      };

      addOrder(newOrder);
      // Remove only the purchased in-stock items from bag, preserving out-of-stock items
      removePurchasedItems(
        inStockItems.map((i) => ({
          productId: i.product.id,
          selectedSize: i.selectedSize,
        }))
      );

      // Navigate to dedicated Order Confirmation & Tracking view
      router.push(`/orders/${generatedOrderId}?new=1`);
    }, 1200);
  };

  const handleRetryPayment = (e: React.MouseEvent) => {
    e.preventDefault();
    handlePlaceOrder(e as unknown as React.FormEvent);
  };

  const handleChangePaymentMethod = () => {
    setPaymentStatus("idle");
    paymentSectionRef.current?.scrollIntoView({ behavior: "smooth", block: "start" });
  };

  const handleSwitchToCod = () => {
    setPaymentMethod("cod");
    setPaymentStatus("idle");
  };

  // SSR Loading state
  if (!isMounted) {
    return (
      <div className="min-h-screen bg-neutral-50 flex items-center justify-center">
        <div className="text-center space-y-3">
          <div className="w-8 h-8 border-2 border-neutral-900 border-t-transparent rounded-full animate-spin mx-auto" />
          <p className="text-xs font-mono uppercase tracking-widest text-neutral-500">
            Initialising Secure Checkout...
          </p>
        </div>
      </div>
    );
  }

  // Empty cart or no available items fallback
  if (items.length === 0 || inStockCount === 0) {
    return (
      <div className="min-h-[80vh] bg-neutral-50/50 flex items-center justify-center px-4 py-16">
        <div className="max-w-md w-full bg-white border border-neutral-200/90 rounded-2xl p-8 sm:p-10 text-center shadow-xs">
          <div className="w-14 h-14 rounded-full bg-neutral-100 text-neutral-400 flex items-center justify-center mx-auto mb-4">
            <ShoppingBag size={24} />
          </div>
          <h1 className="text-xl font-bold text-neutral-900 mb-2">
            {items.length === 0 ? "Your Bag is Empty" : "No Available Items to Checkout"}
          </h1>
          <p className="text-xs text-neutral-500 mb-6 leading-relaxed">
            {items.length === 0
              ? "There are no items currently in your bag to checkout. Explore our premium drops to start your order."
              : "All items in your bag are currently out of stock. Please return to your shopping bag to manage saved items."}
          </p>
          <Link
            href={items.length === 0 ? "/clothing" : "/cart"}
            className="inline-flex items-center justify-center w-full bg-neutral-900 text-white hover:bg-black py-3 px-5 rounded-lg text-xs font-bold uppercase tracking-wider transition-colors"
          >
            {items.length === 0 ? "Explore Collections" : "Return to Shopping Bag"}
          </Link>
        </div>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-[#fafafa] text-neutral-900 pb-20">
      {/* ── DISTRACTION-FREE LUXURY HEADER ────────────────────────────────────── */}
      <header className="sticky top-0 z-40 bg-white/95 backdrop-blur-md border-b border-neutral-200/80">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 h-16 flex items-center justify-between">
          {/* Back link */}
          <Link
            href="/cart"
            className="flex items-center gap-1.5 text-xs font-semibold text-neutral-600 hover:text-neutral-950 transition-colors"
          >
            <ChevronLeft size={16} />
            <span className="hidden sm:inline">Return to Bag</span>
            <span className="sm:hidden">Bag</span>
          </Link>

          {/* Centered Brand Mark */}
          <Link
            href="/"
            className="text-lg sm:text-xl font-black tracking-[0.25em] uppercase text-neutral-950 hover:opacity-90 transition-opacity"
          >
            VEYRO
          </Link>

          {/* Secure Trust Badge */}
          <div className="flex items-center gap-1.5 text-[11px] sm:text-xs font-medium text-neutral-500">
            <Lock size={13} className="text-emerald-600 shrink-0" />
            <span className="hidden sm:inline">256-Bit SSL Encrypted</span>
            <span className="sm:hidden font-mono">Secure</span>
          </div>
        </div>
      </header>

      {/* ── PROGRESS STEPPER ─────────────────────────────────────────────────── */}
      <div className="bg-white border-b border-neutral-200/60 py-3.5">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <nav aria-label="Checkout Steps" className="flex items-center justify-center gap-2 sm:gap-4 text-xs">
            <Link
              href="/cart"
              className="flex items-center gap-1.5 text-neutral-500 hover:text-neutral-900 font-medium transition-colors"
            >
              <span className="w-5 h-5 rounded-full bg-emerald-100 text-emerald-800 text-[10px] font-bold flex items-center justify-center">
                ✓
              </span>
              <span>Bag</span>
            </Link>

            <span className="text-neutral-300">/</span>

            <div className="flex items-center gap-1.5 text-neutral-950 font-bold">
              <span className="w-5 h-5 rounded-full bg-neutral-950 text-white text-[10px] font-bold flex items-center justify-center">
                2
              </span>
              <span>Delivery & Payment</span>
            </div>

            <span className="text-neutral-300">/</span>

            <div className="flex items-center gap-1.5 text-neutral-400 font-medium">
              <span className="w-5 h-5 rounded-full bg-neutral-100 text-neutral-400 text-[10px] font-bold flex items-center justify-center">
                3
              </span>
              <span>Confirmation</span>
            </div>
          </nav>
        </div>
      </div>

      {/* ── MAIN CHECKOUT WORKSPACE ───────────────────────────────────────────── */}
      <main className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 pt-8 sm:pt-10">
        <form
          onSubmit={handlePlaceOrder}
          autoComplete="off"
          data-form-type="other"
          className="grid grid-cols-1 lg:grid-cols-12 gap-8 lg:gap-12"
        >
          {/* ════ LEFT COLUMN: CUSTOMER, ADDRESS & PAYMENT (7 cols) ════ */}
          <div className="lg:col-span-7 space-y-8">
            {/* Section 1: Contact Details */}
            <section className="bg-white border border-neutral-200/90 rounded-2xl p-6 sm:p-7 shadow-xs">
              <div className="flex items-center justify-between pb-4 border-b border-neutral-100 mb-5">
                <div className="flex items-center gap-3">
                  <span className="w-7 h-7 rounded-full bg-neutral-100 text-neutral-900 text-xs font-bold flex items-center justify-center">
                    01
                  </span>
                  <h2 className="text-sm sm:text-base font-bold text-neutral-950 tracking-tight">
                    Contact Details
                  </h2>
                </div>
                {user ? (
                  <span className="text-[11px] font-medium text-emerald-700 bg-emerald-50 px-2 py-0.5 rounded-full">
                    Signed in as {user.name}
                  </span>
                ) : (
                  <span className="text-[11px] text-neutral-400">Guest Checkout</span>
                )}
              </div>

              <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                <div>
                  <label className="block text-xs font-semibold text-neutral-700 mb-1.5">
                    Email Address <span className="text-red-500">*</span>
                  </label>
                  <input
                    type="email"
                    value={email}
                    onChange={(e) => setEmail(e.target.value)}
                    placeholder="name@domain.com"
                    className={`w-full text-xs px-3.5 py-2.5 rounded-lg border bg-white transition-colors focus-visible:outline-hidden focus-visible:ring-2 focus-visible:ring-black ${
                      formErrors.email ? "border-red-400 bg-red-50/20" : "border-neutral-300"
                    }`}
                  />
                  {formErrors.email && (
                    <p className="text-[11px] text-red-600 mt-1">{formErrors.email}</p>
                  )}
                  <p className="text-[10px] text-neutral-400 mt-1">
                    Your digital invoice and dispatch confirmation will be sent here.
                  </p>
                </div>

                <div>
                  <label className="block text-xs font-semibold text-neutral-700 mb-1.5">
                    Mobile Number <span className="text-red-500">*</span>
                  </label>
                  <input
                    type="tel"
                    value={phone}
                    onChange={(e) => setPhone(e.target.value)}
                    placeholder="+91 98765 43210"
                    className={`w-full text-xs px-3.5 py-2.5 rounded-lg border bg-white transition-colors focus-visible:outline-hidden focus-visible:ring-2 focus-visible:ring-black ${
                      formErrors.phone ? "border-red-400 bg-red-50/20" : "border-neutral-300"
                    }`}
                  />
                  {formErrors.phone && (
                    <p className="text-[11px] text-red-600 mt-1">{formErrors.phone}</p>
                  )}
                  <p className="text-[10px] text-neutral-400 mt-1">
                    Required for courier tracking SMS and doorstep OTP.
                  </p>
                </div>
              </div>
            </section>

            {/* Section 2: Delivery Address & Shipping */}
            <section
              id="section-delivery-address"
              className="bg-white border border-neutral-200/90 rounded-2xl p-6 sm:p-7 shadow-xs scroll-mt-24"
            >
              <div className="flex items-center justify-between pb-4 border-b border-neutral-100 mb-5">
                <div className="flex items-center gap-3">
                  <span className="w-7 h-7 rounded-full bg-neutral-100 text-neutral-900 text-xs font-bold flex items-center justify-center">
                    02
                  </span>
                  <div>
                    <h2 className="text-sm sm:text-base font-bold text-neutral-950 tracking-tight">
                      Shipping & Delivery Address
                    </h2>
                    <p className="text-[11px] text-neutral-500">
                      Choose saved profile address or auto-detect with live GPS
                    </p>
                  </div>
                </div>
                <div className="flex items-center gap-1 text-[11px] text-neutral-500 font-mono">
                  <Truck size={13} className="text-neutral-700" />
                  <span>Pan-India Courier</span>
                </div>
              </div>

              {/* Address Mode Selection Tabs */}
              <div className="grid grid-cols-2 gap-2 mb-5 p-1 bg-neutral-100/80 rounded-xl border border-neutral-200/60">
                <button
                  type="button"
                  onClick={handleSelectSavedAddress}
                  className={`flex items-center justify-center gap-1.5 py-2 px-3 rounded-lg text-xs font-semibold transition-all cursor-pointer ${
                    addressMode === "saved"
                      ? "bg-white text-neutral-950 shadow-xs font-bold"
                      : "text-neutral-600 hover:text-neutral-950"
                  }`}
                >
                  <Home size={13} className={addressMode === "saved" ? "text-neutral-950" : "text-neutral-500"} />
                  <span>Saved Profile Address</span>
                </button>
                <button
                  type="button"
                  onClick={handleSelectCustomAddress}
                  className={`flex items-center justify-center gap-1.5 py-2 px-3 rounded-lg text-xs font-semibold transition-all cursor-pointer ${
                    addressMode === "custom"
                      ? "bg-white text-neutral-950 shadow-xs font-bold"
                      : "text-neutral-600 hover:text-neutral-950"
                  }`}
                >
                  <MapPin size={13} className={addressMode === "custom" ? "text-neutral-950" : "text-neutral-500"} />
                  <span>Different / Live Location</span>
                </button>
              </div>

              {/* ── MODE A: SAVED PROFILE ADDRESS ── */}
              {addressMode === "saved" ? (
                <div className="space-y-4">
                  <div className="relative rounded-xl border-2 border-neutral-900 bg-neutral-50/70 p-4 sm:p-5 transition-all">
                    {/* Top Row: Badge + Status */}
                    <div className="flex items-center justify-between gap-2 flex-wrap mb-3">
                      <div className="flex items-center gap-1.5 text-xs font-bold text-neutral-900">
                        <Home size={14} className="text-neutral-900" />
                        <span>{savedProfileAddress.label}</span>
                      </div>
                      <span className="inline-flex items-center gap-1 px-2.5 py-0.5 rounded-full text-[10px] font-bold bg-emerald-100/80 text-emerald-800 border border-emerald-200">
                        <CheckCircle2 size={11} className="text-emerald-700" />
                        Active Destination
                      </span>
                    </div>

                    {/* Address details */}
                    <div className="space-y-1">
                      <div className="flex items-center gap-2">
                        <span className="text-sm font-bold text-neutral-950">
                          {savedProfileAddress.name}
                        </span>
                        <span className="text-xs text-neutral-500 font-mono">
                          • {savedProfileAddress.phone}
                        </span>
                      </div>
                      <p className="text-xs text-neutral-700 leading-relaxed font-medium">
                        {savedProfileAddress.line1}
                      </p>
                      <p className="text-xs text-neutral-700 font-medium">
                        {savedProfileAddress.city}, {savedProfileAddress.state} -{" "}
                        <span className="font-mono font-bold text-neutral-950">
                          {savedProfileAddress.pincode}
                        </span>
                      </p>
                    </div>

                    {/* Courier trust note */}
                    <div className="mt-3.5 pt-3 border-t border-neutral-200/80 flex items-center justify-between gap-2 text-[11px] text-neutral-600">
                      <div className="flex items-center gap-1.5">
                        <ShieldCheck size={13} className="text-emerald-600" />
                        <span>Verified shipping destination. OTP verification upon doorstep delivery.</span>
                      </div>
                    </div>

                    {/* Actions */}
                    <div className="mt-4 pt-3.5 border-t border-neutral-200/80 flex flex-wrap items-center gap-2.5">
                      <div className="inline-flex items-center gap-1.5 px-3 py-1.5 rounded-lg bg-neutral-950 text-white text-xs font-bold cursor-default select-none">
                        <Check size={13} className="stroke-[3]" />
                        <span>Delivering to this Address</span>
                      </div>

                      <button
                        type="button"
                        onClick={handleSelectCustomAddress}
                        className="inline-flex items-center gap-1.5 px-3 py-1.5 rounded-lg border border-neutral-300 hover:border-neutral-900 hover:bg-white text-xs font-semibold text-neutral-800 transition-colors cursor-pointer"
                      >
                        <Plus size={13} />
                        <span>Deliver to a Different Address</span>
                      </button>

                      <button
                        type="button"
                        onClick={handleDetectLiveLocation}
                        disabled={isLocating}
                        className="inline-flex items-center gap-1.5 px-3 py-1.5 rounded-lg border border-neutral-300 hover:border-neutral-900 hover:bg-neutral-50 text-xs font-semibold text-neutral-800 transition-all cursor-pointer disabled:opacity-60 disabled:cursor-not-allowed group active:scale-[0.98]"
                      >
                        <span className="relative flex h-2 w-2">
                          <span className="animate-live-ping absolute inline-flex h-full w-full rounded-full bg-emerald-400 opacity-75" />
                          <span className="relative inline-flex rounded-full h-2 w-2 bg-emerald-500" />
                        </span>
                        <Navigation size={13} className="text-emerald-600 transition-transform group-hover:scale-110" />
                        <span>Use Live Location</span>
                      </button>
                    </div>
                  </div>
                </div>
              ) : (
                /* ── MODE B: CUSTOM / LIVE LOCATION ADDRESS ── */
                <div className="space-y-4">
                  {/* Top Bar inside Custom Mode */}
                  <div className="flex flex-wrap items-center justify-between gap-3 p-3 sm:p-3.5 rounded-xl bg-neutral-50/90 border border-neutral-200/90 shadow-2xs">
                    <button
                      type="button"
                      onClick={handleSelectSavedAddress}
                      className="inline-flex items-center gap-1.5 px-3 py-1.5 rounded-lg text-xs font-semibold text-neutral-700 hover:text-black hover:bg-neutral-200/60 transition-all cursor-pointer group"
                    >
                      <ArrowLeft size={13} className="text-neutral-500 group-hover:text-black transition-transform group-hover:-translate-x-0.5" />
                      <span>
                        Back to Saved Profile Address{" "}
                        <span className="text-neutral-500 font-normal">({savedProfileAddress.city})</span>
                      </span>
                    </button>

                    <button
                      type="button"
                      onClick={handleDetectLiveLocation}
                      disabled={isLocating}
                      className="relative overflow-hidden inline-flex items-center gap-2 px-3.5 py-2 rounded-lg bg-neutral-950 hover:bg-black active:scale-[0.98] text-white text-xs font-bold uppercase tracking-wider transition-all cursor-pointer shadow-xs disabled:opacity-85 disabled:cursor-not-allowed group"
                    >
                      {/* Micro-animation: scanning light sweep effect when locating */}
                      {isLocating && (
                        <span className="absolute inset-0 bg-gradient-to-r from-transparent via-white/15 to-transparent animate-radar-sweep pointer-events-none" />
                      )}

                      {isLocating ? (
                        <>
                          <span className="relative flex h-2.5 w-2.5">
                            <span className="animate-ping absolute inline-flex h-full w-full rounded-full bg-emerald-400 opacity-75" />
                            <span className="relative inline-flex rounded-full h-2.5 w-2.5 bg-emerald-500" />
                          </span>
                          <span className="normal-case tracking-normal font-medium text-neutral-200">
                            {locatingStep || "Detecting live location..."}
                          </span>
                        </>
                      ) : (
                        <>
                          <span className="relative flex h-2 w-2">
                            <span className="animate-live-ping absolute inline-flex h-full w-full rounded-full bg-emerald-400 opacity-75" />
                            <span className="relative inline-flex rounded-full h-2 w-2 bg-emerald-500" />
                          </span>
                          <LocateFixed size={13} className="text-emerald-400 transition-transform group-hover:rotate-45" />
                          <span>Detect Live Location</span>
                        </>
                      )}
                    </button>
                  </div>

                  {/* Live Telemetry Feedback Box with Smooth Morphing Transition */}
                  {(isLocating || detectedLocationBadge) && (
                    <div
                      role="status"
                      aria-live="polite"
                      className={`p-3.5 sm:p-4 rounded-xl text-xs transition-all duration-500 ease-out shadow-xs border ${
                        isLocating
                          ? "bg-neutral-900 border-neutral-800 text-white"
                          : "bg-emerald-50/95 border-emerald-200/90 text-emerald-950"
                      }`}
                    >
                      {isLocating ? (
                        /* State 1: Active Radar Scanning */
                        <div className="flex items-center gap-3.5">
                          <div className="relative flex items-center justify-center w-7 h-7 shrink-0">
                            <div className="absolute inset-0 rounded-full border border-emerald-500/40 animate-ping" />
                            <div className="w-6 h-6 rounded-full border-2 border-emerald-400 border-t-transparent animate-spin" />
                          </div>
                          <div className="flex-1 min-w-0">
                            <div className="font-semibold text-neutral-100 flex items-center gap-2">
                              <span>Live Telemetry Radar</span>
                              <span className="text-[10px] uppercase font-mono px-1.5 py-0.5 bg-emerald-500/20 text-emerald-300 rounded border border-emerald-500/30">
                                Active Scanning
                              </span>
                            </div>
                            <p className="text-[11px] text-neutral-400 mt-0.5 truncate transition-all duration-300 font-mono">
                              {locatingStep || "Connecting to geolocation nodes..."}
                            </p>
                          </div>
                        </div>
                      ) : (
                        /* State 2: Location Locked */
                        <div className="flex items-start justify-between gap-3">
                          <div className="flex items-start gap-2.5 min-w-0">
                            <div className="w-7 h-7 rounded-lg bg-emerald-600 text-white flex items-center justify-center shrink-0 mt-0.5 shadow-2xs">
                              <MapPin size={15} />
                            </div>
                            <div className="min-w-0">
                              <div className="flex items-center gap-2 flex-wrap">
                                <span className="font-bold text-emerald-950 text-[13px]">
                                  Live Location Locked
                                </span>
                                <span className="inline-flex items-center gap-1 px-2 py-0.5 rounded-full text-[10px] font-bold bg-emerald-200/70 text-emerald-900 border border-emerald-300/80">
                                  <span className="w-1.5 h-1.5 rounded-full bg-emerald-600 animate-pulse" />
                                  {detectedLocationBadge?.source === "live_gps" ? "Satellite GPS" : "Real-time Telemetry"}
                                  {detectedLocationBadge?.accuracy ? ` (~${detectedLocationBadge.accuracy}m)` : ""}
                                </span>
                              </div>
                              <p className="text-xs text-emerald-800 mt-1 font-semibold">
                                {detectedLocationBadge?.area ? `${detectedLocationBadge.area}, ` : ""}
                                {detectedLocationBadge?.city}
                                {detectedLocationBadge?.state ? `, ${detectedLocationBadge.state}` : ""}
                                {detectedLocationBadge?.pincode ? ` - ${detectedLocationBadge.pincode}` : ""}
                              </p>
                              <p className="text-[11px] text-emerald-700/90 mt-0.5">
                                Auto-populated into shipping fields. You can adjust house/flat number if needed.
                              </p>
                            </div>
                          </div>
                          <button
                            type="button"
                            onClick={handleDetectLiveLocation}
                            className="inline-flex items-center gap-1 px-2.5 py-1 rounded-md text-[11px] font-bold text-emerald-800 hover:text-emerald-950 hover:bg-emerald-100/80 transition-colors shrink-0 cursor-pointer border border-emerald-300/60"
                          >
                            <RefreshCw size={11} />
                            <span>Re-scan</span>
                          </button>
                        </div>
                      )}
                    </div>
                  )}

                  {locationError && !isLocating && (
                    <div
                      aria-live="polite"
                      className="flex items-start gap-2.5 p-3 bg-amber-50 border border-amber-200 rounded-xl text-xs text-amber-900"
                    >
                      <AlertCircle size={15} className="text-amber-700 shrink-0 mt-0.5" />
                      <div className="flex-1">
                        <p>{locationError}</p>
                      </div>
                      <button
                        type="button"
                        onClick={() => setLocationError(null)}
                        className="text-amber-700 hover:text-amber-950 text-xs font-bold cursor-pointer"
                      >
                        Dismiss
                      </button>
                    </div>
                  )}

                  {/* Manual Inputs */}
                  <div>
                    <label className="block text-xs font-semibold text-neutral-700 mb-1.5">
                      Recipient Full Name <span className="text-red-500">*</span>
                    </label>
                    <input
                      type="text"
                      autoComplete="name"
                      value={fullName}
                      onChange={(e) => setFullName(e.target.value)}
                      placeholder="Recipient Full Name"
                      className={`w-full text-xs px-3.5 py-2.5 rounded-lg border bg-white transition-colors focus-visible:outline-hidden focus-visible:ring-2 focus-visible:ring-black ${
                        formErrors.fullName ? "border-red-400 bg-red-50/20" : "border-neutral-300"
                      }`}
                    />
                    {formErrors.fullName && (
                      <p className="text-[11px] text-red-600 mt-1">{formErrors.fullName}</p>
                    )}
                  </div>

                  <div>
                    <label className="block text-xs font-semibold text-neutral-700 mb-1.5">
                      Street Address, Building, House No. <span className="text-red-500">*</span>
                    </label>
                    <input
                      type="text"
                      autoComplete="street-address"
                      value={streetAddress}
                      onChange={(e) => setStreetAddress(e.target.value)}
                      placeholder="e.g. 42, Richmond Road, Flat 3B"
                      className={`w-full text-xs px-3.5 py-2.5 rounded-lg border bg-white transition-all focus-visible:outline-hidden focus-visible:ring-2 focus-visible:ring-black ${
                        formErrors.streetAddress
                          ? "border-red-400 bg-red-50/20"
                          : justAutofilled
                          ? "animate-autofill-highlight"
                          : "border-neutral-300"
                      }`}
                    />
                    {formErrors.streetAddress && (
                      <p className="text-[11px] text-red-600 mt-1">{formErrors.streetAddress}</p>
                    )}
                  </div>

                  <div>
                    <label className="block text-xs font-semibold text-neutral-700 mb-1.5">
                      Apartment, Suite, Landmark{" "}
                      <span className="text-neutral-400 font-normal">(Optional)</span>
                    </label>
                    <input
                      type="text"
                      value={apartment}
                      onChange={(e) => setApartment(e.target.value)}
                      placeholder="Near Landmark / Colony"
                      className={`w-full text-xs px-3.5 py-2.5 rounded-lg border bg-white transition-all focus-visible:outline-hidden focus-visible:ring-2 focus-visible:ring-black ${
                        justAutofilled ? "animate-autofill-highlight" : "border-neutral-300"
                      }`}
                    />
                  </div>

                  <div className="grid grid-cols-1 sm:grid-cols-3 gap-3">
                    <div>
                      <label className="block text-xs font-semibold text-neutral-700 mb-1.5">
                        City <span className="text-red-500">*</span>
                      </label>
                      <input
                        type="text"
                        autoComplete="address-level2"
                        value={city}
                        onChange={(e) => setCity(e.target.value)}
                        placeholder="City"
                        className={`w-full text-xs px-3.5 py-2.5 rounded-lg border bg-white transition-all focus-visible:outline-hidden focus-visible:ring-2 focus-visible:ring-black ${
                          formErrors.city
                            ? "border-red-400 bg-red-50/20"
                            : justAutofilled
                            ? "animate-autofill-highlight"
                            : "border-neutral-300"
                        }`}
                      />
                      {formErrors.city && (
                        <p className="text-[11px] text-red-600 mt-1">{formErrors.city}</p>
                      )}
                    </div>

                    <div>
                      <label className="block text-xs font-semibold text-neutral-700 mb-1.5">
                        State <span className="text-red-500">*</span>
                      </label>
                      <input
                        type="text"
                        autoComplete="address-level1"
                        value={stateName}
                        onChange={(e) => setStateName(e.target.value)}
                        placeholder="State"
                        className={`w-full text-xs px-3.5 py-2.5 rounded-lg border bg-white transition-all focus-visible:outline-hidden focus-visible:ring-2 focus-visible:ring-black ${
                          formErrors.stateName
                            ? "border-red-400 bg-red-50/20"
                            : justAutofilled
                            ? "animate-autofill-highlight"
                            : "border-neutral-300"
                        }`}
                      />
                      {formErrors.stateName && (
                        <p className="text-[11px] text-red-600 mt-1">{formErrors.stateName}</p>
                      )}
                    </div>

                    <div>
                      <label className="block text-xs font-semibold text-neutral-700 mb-1.5">
                        PIN Code <span className="text-red-500">*</span>
                      </label>
                      <input
                        type="text"
                        inputMode="numeric"
                        autoComplete="postal-code"
                        maxLength={6}
                        value={pincode}
                        onChange={(e) => setPincode(e.target.value.replace(/\D/g, "").slice(0, 6))}
                        placeholder="6-digit PIN"
                        className={`w-full text-xs px-3.5 py-2.5 rounded-lg border bg-white transition-all focus-visible:outline-hidden focus-visible:ring-2 focus-visible:ring-black ${
                          formErrors.pincode
                            ? "border-red-400 bg-red-50/20"
                            : justAutofilled
                            ? "animate-autofill-highlight"
                            : "border-neutral-300"
                        }`}
                      />
                      {formErrors.pincode && (
                        <p className="text-[11px] text-red-600 mt-1">{formErrors.pincode}</p>
                      )}
                    </div>
                  </div>
                </div>
              )}

                {/* Shipping Method Options */}
                <div className="pt-4 border-t border-neutral-100">
                  <span className="block text-xs font-semibold text-neutral-700 mb-2.5">
                    Delivery Speed
                  </span>
                  <div className="grid grid-cols-1 sm:grid-cols-2 gap-3">
                    <label
                      className={`flex items-start gap-3 p-3.5 rounded-xl border-2 cursor-pointer transition-all ${
                        shippingMethod === "standard"
                          ? "border-neutral-900 bg-neutral-50/60"
                          : "border-neutral-200 hover:border-neutral-300 bg-white"
                      }`}
                    >
                      <input
                        type="radio"
                        name="shippingMethod"
                        value="standard"
                        checked={shippingMethod === "standard"}
                        onChange={() => setShippingMethod("standard")}
                        className="mt-0.5"
                      />
                      <div className="text-xs">
                        <div className="flex items-center justify-between gap-2">
                          <span className="font-bold text-neutral-950">Standard Express</span>
                          <span className="font-mono text-[11px] text-emerald-700 font-semibold">
                            {hasFreeShipping ? "FREE" : "₹99"}
                          </span>
                        </div>
                        <p className="text-[11px] text-neutral-500 mt-0.5">
                          Delivery in 2-3 business days via Blue Dart / Delhivery
                        </p>
                      </div>
                    </label>

                    <label
                      className={`flex items-start gap-3 p-3.5 rounded-xl border-2 cursor-pointer transition-all ${
                        shippingMethod === "express"
                          ? "border-neutral-900 bg-neutral-50/60"
                          : "border-neutral-200 hover:border-neutral-300 bg-white"
                      }`}
                    >
                      <input
                        type="radio"
                        name="shippingMethod"
                        value="express"
                        checked={shippingMethod === "express"}
                        onChange={() => setShippingMethod("express")}
                        className="mt-0.5"
                      />
                      <div className="text-xs">
                        <div className="flex items-center justify-between gap-2">
                          <span className="font-bold text-neutral-950">Priority Air Overnight</span>
                          <span className="font-mono text-[11px] font-semibold text-neutral-900">
                            ₹149
                          </span>
                        </div>
                        <p className="text-[11px] text-neutral-500 mt-0.5">
                          Priority dispatch — expected delivery by tomorrow evening
                        </p>
                      </div>
                    </label>
                  </div>
                </div>
            </section>

            {/* Section 3: Payment Method */}
            <section ref={paymentSectionRef} className="bg-white border border-neutral-200/90 rounded-2xl p-6 sm:p-7 shadow-xs">
              <div className="flex items-center justify-between pb-4 border-b border-neutral-100 mb-5">
                <div className="flex items-center gap-3">
                  <span className="w-7 h-7 rounded-full bg-neutral-100 text-neutral-900 text-xs font-bold flex items-center justify-center">
                    03
                  </span>
                  <h2 className="text-sm sm:text-base font-bold text-neutral-950 tracking-tight">
                    Payment Method
                  </h2>
                </div>
                <div className="flex items-center gap-1.5 text-[11px] text-emerald-700 font-semibold bg-emerald-50 px-2 py-0.5 rounded-full">
                  <ShieldCheck size={13} />
                  <span>100% Secure</span>
                </div>
              </div>

              {/* Payment Tabs with Micro-Animations & Physics */}
              <div className="grid grid-cols-3 gap-2.5 sm:gap-3 mb-5">
                {/* 1. Instant UPI */}
                <button
                  type="button"
                  onClick={() => {
                    setPaymentMethod("upi");
                    if (paymentStatus === "failed") setPaymentStatus("idle");
                  }}
                  className={`group relative flex flex-col items-center justify-center p-3.5 sm:p-4 rounded-xl border-2 transition-all duration-300 cursor-pointer overflow-hidden active:scale-[0.98] ${
                    paymentMethod === "upi"
                      ? "border-neutral-950 bg-neutral-950 text-white shadow-md ring-2 ring-neutral-950/20"
                      : "border-neutral-200/90 bg-white text-neutral-700 hover:border-neutral-400 hover:bg-neutral-50/80 hover:shadow-xs"
                  }`}
                >
                  {/* Subtle luxury sheen sweep on active card */}
                  {paymentMethod === "upi" && (
                    <span className="absolute inset-0 bg-gradient-to-r from-transparent via-white/10 to-transparent animate-sheen-sweep pointer-events-none" />
                  )}

                  {/* Top-Right Active Status Indicator */}
                  <span className="absolute top-2 right-2 flex items-center justify-center">
                    {paymentMethod === "upi" ? (
                      <span className="relative flex h-2 w-2">
                        <span className="animate-ping absolute inline-flex h-full w-full rounded-full bg-emerald-400 opacity-75" />
                        <span className="relative inline-flex rounded-full h-2 w-2 bg-emerald-500" />
                      </span>
                    ) : (
                      <span className="w-2 h-2 rounded-full border border-neutral-300 opacity-0 group-hover:opacity-60 transition-opacity" />
                    )}
                  </span>

                  {/* Animated Icon Container */}
                  <div
                    className={`w-9 h-9 rounded-lg flex items-center justify-center mb-1.5 transition-all duration-300 ${
                      paymentMethod === "upi"
                        ? "bg-neutral-900 text-emerald-400 shadow-inner"
                        : "bg-neutral-100 text-neutral-800 group-hover:bg-neutral-200/80 group-hover:text-black"
                    }`}
                  >
                    <Smartphone
                      size={20}
                      className={`transition-transform duration-300 group-hover:scale-110 group-hover:-rotate-6 ${
                        paymentMethod === "upi" ? "animate-upi-phone text-emerald-400" : ""
                      }`}
                    />
                  </div>

                  <span className="text-xs font-bold tracking-tight">Instant UPI</span>
                  <span
                    className={`text-[10px] transition-colors ${
                      paymentMethod === "upi" ? "text-neutral-300 font-medium" : "text-neutral-500 font-normal"
                    }`}
                  >
                    GPay / PhonePe
                  </span>
                </button>

                {/* 2. Cards */}
                <button
                  type="button"
                  onClick={() => {
                    setPaymentMethod("card");
                    if (paymentStatus === "failed") setPaymentStatus("idle");
                  }}
                  className={`group relative flex flex-col items-center justify-center p-3.5 sm:p-4 rounded-xl border-2 transition-all duration-300 cursor-pointer overflow-hidden active:scale-[0.98] ${
                    paymentMethod === "card"
                      ? "border-neutral-950 bg-neutral-950 text-white shadow-md ring-2 ring-neutral-950/20"
                      : "border-neutral-200/90 bg-white text-neutral-700 hover:border-neutral-400 hover:bg-neutral-50/80 hover:shadow-xs"
                  }`}
                >
                  {paymentMethod === "card" && (
                    <span className="absolute inset-0 bg-gradient-to-r from-transparent via-white/10 to-transparent animate-sheen-sweep pointer-events-none" />
                  )}

                  <span className="absolute top-2 right-2 flex items-center justify-center">
                    {paymentMethod === "card" ? (
                      <span className="relative flex h-2 w-2">
                        <span className="animate-ping absolute inline-flex h-full w-full rounded-full bg-emerald-400 opacity-75" />
                        <span className="relative inline-flex rounded-full h-2 w-2 bg-emerald-500" />
                      </span>
                    ) : (
                      <span className="w-2 h-2 rounded-full border border-neutral-300 opacity-0 group-hover:opacity-60 transition-opacity" />
                    )}
                  </span>

                  <div
                    className={`w-9 h-9 rounded-lg flex items-center justify-center mb-1.5 transition-all duration-300 ${
                      paymentMethod === "card"
                        ? "bg-neutral-900 text-blue-400 shadow-inner"
                        : "bg-neutral-100 text-neutral-800 group-hover:bg-neutral-200/80 group-hover:text-black"
                    }`}
                  >
                    <CreditCard
                      size={20}
                      className={`transition-transform duration-300 group-hover:scale-110 group-hover:rotate-6 ${
                        paymentMethod === "card" ? "animate-card-float text-blue-400" : ""
                      }`}
                    />
                  </div>

                  <span className="text-xs font-bold tracking-tight">Cards</span>
                  <span
                    className={`text-[10px] transition-colors ${
                      paymentMethod === "card" ? "text-neutral-300 font-medium" : "text-neutral-500 font-normal"
                    }`}
                  >
                    Credit / Debit
                  </span>
                </button>

                {/* 3. Cash on Delivery */}
                <button
                  type="button"
                  onClick={() => {
                    setPaymentMethod("cod");
                    if (paymentStatus === "failed") setPaymentStatus("idle");
                  }}
                  className={`group relative flex flex-col items-center justify-center p-3.5 sm:p-4 rounded-xl border-2 transition-all duration-300 cursor-pointer overflow-hidden active:scale-[0.98] ${
                    paymentMethod === "cod"
                      ? "border-neutral-950 bg-neutral-950 text-white shadow-md ring-2 ring-neutral-950/20"
                      : "border-neutral-200/90 bg-white text-neutral-700 hover:border-neutral-400 hover:bg-neutral-50/80 hover:shadow-xs"
                  }`}
                >
                  {paymentMethod === "cod" && (
                    <span className="absolute inset-0 bg-gradient-to-r from-transparent via-white/10 to-transparent animate-sheen-sweep pointer-events-none" />
                  )}

                  <span className="absolute top-2 right-2 flex items-center justify-center">
                    {paymentMethod === "cod" ? (
                      <span className="relative flex h-2 w-2">
                        <span className="animate-ping absolute inline-flex h-full w-full rounded-full bg-emerald-400 opacity-75" />
                        <span className="relative inline-flex rounded-full h-2 w-2 bg-emerald-500" />
                      </span>
                    ) : (
                      <span className="w-2 h-2 rounded-full border border-neutral-300 opacity-0 group-hover:opacity-60 transition-opacity" />
                    )}
                  </span>

                  <div
                    className={`w-9 h-9 rounded-lg flex items-center justify-center mb-1.5 transition-all duration-300 ${
                      paymentMethod === "cod"
                        ? "bg-neutral-900 text-amber-400 shadow-inner"
                        : "bg-neutral-100 text-neutral-800 group-hover:bg-neutral-200/80 group-hover:text-black"
                    }`}
                  >
                    <Banknote
                      size={20}
                      className={`transition-transform duration-300 group-hover:scale-110 group-hover:-translate-y-1 ${
                        paymentMethod === "cod" ? "animate-cash-flutter text-amber-400" : ""
                      }`}
                    />
                  </div>

                  <span className="text-xs font-bold tracking-tight">Cash on Delivery</span>
                  <span
                    className={`text-[10px] transition-colors ${
                      paymentMethod === "cod" ? "text-neutral-300 font-medium" : "text-neutral-500 font-normal"
                    }`}
                  >
                    Doorstep Pay
                  </span>
                </button>
              </div>

              {/* Dynamic Payment Body */}
              <div className="bg-neutral-50/80 border border-neutral-200/80 rounded-xl p-5">
                {paymentMethod === "upi" && (
                  <div className="space-y-4">
                    {/* Main Luxury Fintech UPI Terminal */}
                    <div className="bg-gradient-to-b from-white via-neutral-50/60 to-white border border-neutral-200/90 rounded-2xl p-4 sm:p-6 shadow-xs flex flex-col items-center justify-center relative overflow-hidden group">
                      
                      {/* Top Header: NPCI UPI Official Emblem & Dynamic Amount Pill */}
                      <div className="flex items-center justify-between w-full pb-3.5 mb-4 border-b border-neutral-200/70 flex-wrap gap-2">
                        <div className="flex items-center gap-2.5">
                          {/* Official NPCI UPI Chevron Emblem */}
                          <div className="w-8 h-8 rounded-lg bg-neutral-950 flex items-center justify-center shadow-xs p-1.5 border border-neutral-800">
                            <svg viewBox="0 0 24 24" className="w-full h-full" fill="none">
                              <path d="M14.5 4.5L20.5 12L14.5 19.5H19L25 12L19 4.5H14.5Z" fill="#00823E" />
                              <path d="M7 4.5L13 12L7 19.5H11.5L17.5 12L11.5 4.5H7Z" fill="#FF7300" />
                            </svg>
                          </div>
                          <div>
                            <div className="flex items-center gap-2">
                              <span className="text-xs font-bold text-neutral-900 tracking-tight">
                                Scan & Pay via UPI
                              </span>
                              <span className="inline-flex items-center px-1.5 py-0.5 rounded text-[9px] font-semibold bg-emerald-50 text-emerald-700 border border-emerald-200/60">
                                0% Fee
                              </span>
                            </div>
                            <p className="text-[10px] text-neutral-500 font-medium">
                              Verified Merchant: Veyro Official Luxury Store
                            </p>
                          </div>
                        </div>

                        {/* Real-time Payable Amount Pill */}
                        <div className="flex items-center gap-2 px-3 py-1.5 rounded-full bg-neutral-950 text-white shadow-xs">
                          <span className="text-[10px] text-neutral-400 uppercase tracking-wider font-semibold">Payable:</span>
                          <span className="text-xs font-bold font-mono text-emerald-400">{formatPrice(grandTotal)}</span>
                        </div>
                      </div>

                      {/* Luxury QR Viewport Frame with Optical Scanner & Viewfinder Reticles */}
                      <div className="relative w-52 h-52 bg-white rounded-2xl p-3 border border-neutral-200/90 shadow-sm flex items-center justify-center overflow-hidden">
                        {/* 4 Optical Corner Viewfinder Brackets */}
                        <div className="absolute top-2.5 left-2.5 w-4 h-4 border-t-2 border-l-2 border-neutral-900 rounded-tl-sm pointer-events-none" />
                        <div className="absolute top-2.5 right-2.5 w-4 h-4 border-t-2 border-r-2 border-neutral-900 rounded-tr-sm pointer-events-none" />
                        <div className="absolute bottom-2.5 left-2.5 w-4 h-4 border-b-2 border-l-2 border-neutral-900 rounded-bl-sm pointer-events-none" />
                        <div className="absolute bottom-2.5 right-2.5 w-4 h-4 border-b-2 border-r-2 border-neutral-900 rounded-br-sm pointer-events-none" />

                        {/* Ambient Corner Pulse Overlay */}
                        <div className="absolute inset-2 pointer-events-none animate-qr-corner-reticle">
                          <div className="absolute top-0.5 left-0.5 w-3.5 h-3.5 border-t-2 border-l-2 border-emerald-500/80 rounded-tl-sm" />
                          <div className="absolute top-0.5 right-0.5 w-3.5 h-3.5 border-t-2 border-r-2 border-emerald-500/80 rounded-tr-sm" />
                          <div className="absolute bottom-0.5 left-0.5 w-3.5 h-3.5 border-b-2 border-l-2 border-emerald-500/80 rounded-bl-sm" />
                          <div className="absolute bottom-0.5 right-0.5 w-3.5 h-3.5 border-b-2 border-r-2 border-emerald-500/80 rounded-br-sm" />
                        </div>

                        {/* Authentic High-Resolution Vector QR Code SVG (45x45 matrix) */}
                        <div className="relative w-full h-full p-1 flex items-center justify-center">
                          <svg
                            viewBox="0 0 45 45"
                            className="w-full h-full select-none"
                            shapeRendering="crispEdges"
                            aria-label="Official Veyro UPI QR Code"
                          >
                            <rect width="45" height="45" fill="#ffffff" />
                            <path d={AUTHENTIC_UPI_QR_PATH} fill="#0a0a0a" />

                            {/* Center Official NPCI UPI Shield Badge */}
                            <rect
                              x="17.5"
                              y="17.5"
                              width="10"
                              height="10"
                              rx="2"
                              fill="#ffffff"
                              stroke="#e2e8f0"
                              strokeWidth="0.4"
                            />
                            {/* UPI Logo in Center */}
                            <g transform="translate(18.2, 18.2) scale(0.36)">
                              <path d="M14.5 4.5L20.5 12L14.5 19.5H19L25 12L19 4.5H14.5Z" fill="#00823E" />
                              <path d="M7 4.5L13 12L7 19.5H11.5L17.5 12L11.5 4.5H7Z" fill="#FF7300" />
                            </g>
                          </svg>
                        </div>

                        {/* Optical Laser Scanner Beam & Trailing Gradient Veil */}
                        <div className="absolute inset-x-2.5 top-2.5 pointer-events-none z-20 animate-qr-optical-sweep flex flex-col justify-end">
                          {/* Luminous Light Curtain Veil */}
                          <div className="h-10 w-full bg-gradient-to-b from-transparent via-emerald-500/10 to-emerald-500/25" />
                          {/* Laser Head with Hotspot Core & Tracking Nodes */}
                          <div className="relative h-[2px] w-full bg-gradient-to-r from-transparent via-emerald-400 to-transparent shadow-[0_0_10px_#10b981]">
                            {/* Center Hotspot */}
                            <span className="absolute inset-x-1/4 top-0 h-[1.5px] bg-white/95 shadow-[0_0_6px_#ffffff]" />
                            {/* Precision Optical Tracking Nodes */}
                            <span className="absolute left-[20%] -top-[2px] w-1.5 h-1.5 rounded-full bg-emerald-300 shadow-[0_0_8px_#34d399]" />
                            <span className="absolute right-[20%] -top-[2px] w-1.5 h-1.5 rounded-full bg-emerald-300 shadow-[0_0_8px_#34d399]" />
                          </div>
                        </div>
                      </div>

                      {/* Status Telemetry & Live Countdown */}
                      <div className="mt-3.5 text-center space-y-1">
                        <div className="inline-flex items-center gap-2 px-3 py-1 rounded-full bg-emerald-50 border border-emerald-200/80 text-[11px] font-semibold text-emerald-800">
                          <span className="relative flex h-2 w-2">
                            <span className="animate-ping absolute inline-flex h-full w-full rounded-full bg-emerald-400 opacity-75" />
                            <span className="relative inline-flex rounded-full h-2 w-2 bg-emerald-600" />
                          </span>
                          <span>Point camera or any UPI app to pay</span>
                          <span className="text-emerald-300">·</span>
                          <span className="font-mono text-emerald-700 font-bold">{formatUpiTime(upiCountdown)}</span>
                        </div>
                        <p className="text-[11px] text-neutral-500 font-medium">
                          Open Google Pay, PhonePe, Paytm, or BHIM to complete transaction
                        </p>
                      </div>

                      {/* Official UPI Ecosystem Badges */}
                      <div className="flex items-center justify-center gap-2 mt-3 pt-3 border-t border-neutral-100 w-full flex-wrap">
                        <span className="inline-flex items-center gap-1.5 px-2.5 py-1 rounded-lg bg-neutral-50 hover:bg-neutral-100 border border-neutral-200/80 text-[11px] font-semibold text-neutral-800 transition-colors">
                          <span className="w-2 h-2 rounded-full bg-[#4285F4]" />
                          Google Pay
                        </span>
                        <span className="inline-flex items-center gap-1.5 px-2.5 py-1 rounded-lg bg-neutral-50 hover:bg-neutral-100 border border-neutral-200/80 text-[11px] font-semibold text-neutral-800 transition-colors">
                          <span className="w-2 h-2 rounded-full bg-[#5f259f]" />
                          PhonePe
                        </span>
                        <span className="inline-flex items-center gap-1.5 px-2.5 py-1 rounded-lg bg-neutral-50 hover:bg-neutral-100 border border-neutral-200/80 text-[11px] font-semibold text-neutral-800 transition-colors">
                          <span className="w-2 h-2 rounded-full bg-[#00baf2]" />
                          Paytm
                        </span>
                        <span className="inline-flex items-center gap-1.5 px-2.5 py-1 rounded-lg bg-neutral-50 hover:bg-neutral-100 border border-neutral-200/80 text-[11px] font-semibold text-neutral-800 transition-colors">
                          <span className="w-2 h-2 rounded-full bg-[#00823E]" />
                          BHIM UPI
                        </span>
                        <span className="inline-flex items-center gap-1.5 px-2.5 py-1 rounded-lg bg-neutral-50 hover:bg-neutral-100 border border-neutral-200/80 text-[11px] font-semibold text-neutral-800 transition-colors">
                          <span className="w-2 h-2 rounded-full bg-neutral-900" />
                          CRED
                        </span>
                      </div>

                      {/* Manual UPI ID Alternative */}
                      <div className="w-full mt-4 pt-3.5 border-t border-dashed border-neutral-200">
                        <div className="flex items-center justify-between text-xs mb-2">
                          <span className="text-[11px] font-semibold text-neutral-600">
                            Or pay by entering your UPI ID / VPA:
                          </span>
                          <button
                            type="button"
                            onClick={() => {
                              navigator.clipboard?.writeText("veyro@icici");
                              setCopiedUpi(true);
                              setTimeout(() => setCopiedUpi(false), 2000);
                            }}
                            className="text-[10px] font-medium text-neutral-500 hover:text-neutral-900 flex items-center gap-1 transition-colors cursor-pointer"
                          >
                            {copiedUpi ? (
                              <span className="text-emerald-600 font-semibold">✓ Copied veyro@icici</span>
                            ) : (
                              <span>Copy Merchant VPA</span>
                            )}
                          </button>
                        </div>
                        <div className="relative">
                          <input
                            type="text"
                            value={upiId}
                            onChange={(e) => {
                              setUpiId(e.target.value);
                              if (paymentStatus === "failed") setPaymentStatus("idle");
                            }}
                            placeholder="mobileNumber@upi or username@okaxis"
                            className="w-full text-xs font-mono px-3.5 py-2.5 rounded-lg border border-neutral-300 bg-white focus-visible:outline-hidden focus-visible:ring-2 focus-visible:ring-black"
                          />
                        </div>
                        <div className="flex gap-2 text-[10px] text-neutral-500 mt-2 flex-wrap">
                          <span className="text-[10px] text-neutral-400 self-center">Popular handles:</span>
                          {["@okhdfcbank", "@okaxis", "@paytm", "@ybl", "@sbi"].map((handle) => (
                            <button
                              key={handle}
                              type="button"
                              onClick={() => {
                                const base = upiId.split("@")[0] || "";
                                setUpiId(base ? `${base}${handle}` : handle);
                              }}
                              className="bg-white hover:bg-neutral-100 border border-neutral-200 px-2 py-0.5 rounded text-[10px] transition-colors cursor-pointer"
                            >
                              {handle}
                            </button>
                          ))}
                        </div>
                      </div>
                    </div>
                  </div>
                )}

                {paymentMethod === "card" && (
                  <div className="space-y-4 bg-neutral-50/70 border border-neutral-200/80 rounded-xl p-4 sm:p-5">
                    {/* Header: Network Badges & Encryption Reassurance */}
                    <div className="flex items-center justify-between pb-3 border-b border-neutral-200/70 flex-wrap gap-2">
                      <div className="flex items-center gap-2">
                        <span className="text-xs font-semibold text-neutral-800">
                          Accepted Networks:
                        </span>
                        <div className="flex items-center gap-1.5">
                          <VisaBadge active={cardBrand === "visa" || cardBrand === "unknown"} />
                          <MastercardBadge active={cardBrand === "mastercard" || cardBrand === "unknown"} />
                          <RuPayBadge active={cardBrand === "rupay" || cardBrand === "unknown"} />
                          <AmexBadge active={cardBrand === "amex" || cardBrand === "unknown"} />
                        </div>
                      </div>
                      <div className="flex items-center gap-1 text-[11px] text-neutral-500 font-mono">
                        <Lock size={12} className="text-emerald-600 shrink-0" />
                        <span>256-Bit SSL Encrypted</span>
                      </div>
                    </div>

                    <div className="space-y-3.5">
                      {/* Card Number Input with In-Field Brand Indicator & Demo Fill */}
                      <div>
                        <div className="flex items-center justify-between mb-1.5">
                          <label
                            htmlFor="veyro_cc_num"
                            className="block text-[11px] font-bold uppercase tracking-wider text-neutral-700"
                          >
                            Card Number <span className="text-red-500">*</span>
                          </label>
                          <button
                            type="button"
                            onClick={handleFillTestCard}
                            className="text-[10px] font-bold text-neutral-500 hover:text-neutral-900 underline underline-offset-2 cursor-pointer transition-colors"
                          >
                            Fill Test Card
                          </button>
                        </div>

                        <div className="relative flex items-center">
                          <div className="absolute left-3.5 pointer-events-none text-neutral-400">
                            <CreditCard size={16} />
                          </div>
                          <input
                            type="text"
                            id="veyro_cc_num"
                            name="veyro_cc_num"
                            autoComplete="off"
                            data-form-type="other"
                            data-lpignore="true"
                            autoCorrect="off"
                            autoCapitalize="none"
                            spellCheck={false}
                            value={cardNumber}
                            onChange={(e) => handleCardNumberChange(e.target.value)}
                            placeholder={cardBrand === "amex" ? "3782 822468 91006" : "4532 8921 4402 7891"}
                            maxLength={cardBrand === "amex" ? 17 : 19}
                            className={`w-full text-xs sm:text-sm font-mono pl-10 pr-20 py-2.5 rounded-lg border bg-white text-neutral-900 placeholder:text-neutral-300 focus:outline-hidden focus:border-neutral-950 focus:ring-1 focus:ring-neutral-950 transition-all ${
                              formErrors.cardNumber
                                ? "border-red-400 bg-red-50/20"
                                : "border-neutral-300 hover:border-neutral-400"
                            }`}
                          />
                          <div className="absolute right-3 flex items-center gap-1.5 pointer-events-none">
                            {cardBrand !== "unknown" ? (
                              <DetectedBrandIcon brand={cardBrand} />
                            ) : (
                              <span className="text-[10px] font-mono font-medium text-neutral-400 uppercase tracking-wider">
                                Card
                              </span>
                            )}
                          </div>
                        </div>

                        {formErrors.cardNumber && (
                          <p className="text-[11px] text-red-600 mt-1 flex items-center gap-1">
                            <AlertCircle size={12} className="shrink-0" />
                            <span>{formErrors.cardNumber}</span>
                          </p>
                        )}
                      </div>

                      {/* Row 2: Cardholder Name (2 cols) + Expiry (1 col) + CVV (1 col) */}
                      <div className="grid grid-cols-1 sm:grid-cols-4 gap-3">
                        <div className="sm:col-span-2">
                          <label
                            htmlFor="veyro_cc_holder"
                            className="block text-[11px] font-bold uppercase tracking-wider text-neutral-700 mb-1.5"
                          >
                            Cardholder Name <span className="text-red-500">*</span>
                          </label>
                          <input
                            type="text"
                            id="veyro_cc_holder"
                            name="veyro_cc_holder"
                            autoComplete="off"
                            data-form-type="other"
                            data-lpignore="true"
                            autoCorrect="off"
                            autoCapitalize="words"
                            spellCheck={false}
                            value={cardHolder}
                            onChange={(e) => {
                              setCardHolder(e.target.value);
                              if (formErrors.cardHolder) {
                                setFormErrors((prev) => {
                                  const next = { ...prev };
                                  delete next.cardHolder;
                                  return next;
                                });
                              }
                              if (paymentStatus === "failed") setPaymentStatus("idle");
                            }}
                            placeholder="Ramesh Kumar"
                            className={`w-full text-xs px-3.5 py-2.5 rounded-lg border bg-white text-neutral-900 placeholder:text-neutral-300 focus:outline-hidden focus:border-neutral-950 focus:ring-1 focus:ring-neutral-950 transition-all ${
                              formErrors.cardHolder
                                ? "border-red-400 bg-red-50/20"
                                : "border-neutral-300 hover:border-neutral-400"
                            }`}
                          />
                          {formErrors.cardHolder && (
                            <p className="text-[11px] text-red-600 mt-1 flex items-center gap-1">
                              <AlertCircle size={12} className="shrink-0" />
                              <span>{formErrors.cardHolder}</span>
                            </p>
                          )}
                        </div>

                        <div className="sm:col-span-1">
                          <label
                            htmlFor="veyro_cc_exp"
                            className="block text-[11px] font-bold uppercase tracking-wider text-neutral-700 mb-1.5"
                          >
                            Expiry (MM/YY) <span className="text-red-500">*</span>
                          </label>
                          <input
                            type="text"
                            id="veyro_cc_exp"
                            name="veyro_cc_exp"
                            autoComplete="off"
                            data-form-type="other"
                            data-lpignore="true"
                            autoCorrect="off"
                            autoCapitalize="none"
                            spellCheck={false}
                            maxLength={5}
                            value={cardExpiry}
                            onChange={(e) => handleCardExpiryChange(e.target.value)}
                            placeholder="12/28"
                            className={`w-full text-xs font-mono px-3.5 py-2.5 rounded-lg border bg-white text-neutral-900 placeholder:text-neutral-300 text-center focus:outline-hidden focus:border-neutral-950 focus:ring-1 focus:ring-neutral-950 transition-all ${
                              formErrors.cardExpiry
                                ? "border-red-400 bg-red-50/20"
                                : "border-neutral-300 hover:border-neutral-400"
                            }`}
                          />
                          {formErrors.cardExpiry && (
                            <p className="text-[11px] text-red-600 mt-1 flex items-center gap-1">
                              <AlertCircle size={12} className="shrink-0" />
                              <span>{formErrors.cardExpiry}</span>
                            </p>
                          )}
                        </div>

                        <div className="sm:col-span-1">
                          <div className="flex items-center justify-between mb-1.5">
                            <label
                              htmlFor="veyro_cc_cvv"
                              className="text-[11px] font-bold uppercase tracking-wider text-neutral-700"
                            >
                              CVV <span className="text-red-500">*</span>
                            </label>
                            <span className="text-[10px] text-neutral-400">
                              {cardBrand === "amex" ? "4 digits" : "3 digits"}
                            </span>
                          </div>
                          <div className="relative flex items-center">
                            <input
                              type="password"
                              id="veyro_cc_cvv"
                              name="veyro_cc_cvv"
                              autoComplete="off"
                              data-form-type="other"
                              data-lpignore="true"
                              autoCorrect="off"
                              autoCapitalize="none"
                              spellCheck={false}
                              maxLength={cardBrand === "amex" ? 4 : 3}
                              value={cardCvv}
                              onChange={(e) => {
                                const maxCvv = cardBrand === "amex" ? 4 : 3;
                                setCardCvv(e.target.value.replace(/\D/g, "").slice(0, maxCvv));
                                if (formErrors.cardCvv) {
                                  setFormErrors((prev) => {
                                    const next = { ...prev };
                                    delete next.cardCvv;
                                    return next;
                                  });
                                }
                                if (paymentStatus === "failed") setPaymentStatus("idle");
                              }}
                              placeholder={cardBrand === "amex" ? "••••" : "•••"}
                              className={`w-full text-xs font-mono px-3.5 py-2.5 rounded-lg border bg-white text-neutral-900 placeholder:text-neutral-300 text-center focus:outline-hidden focus:border-neutral-950 focus:ring-1 focus:ring-neutral-950 transition-all ${
                                formErrors.cardCvv
                                  ? "border-red-400 bg-red-50/20"
                                  : "border-neutral-300 hover:border-neutral-400"
                              }`}
                            />
                            <div className="absolute right-2.5 pointer-events-none text-neutral-400">
                              <Lock size={12} />
                            </div>
                          </div>
                          {formErrors.cardCvv && (
                            <p className="text-[11px] text-red-600 mt-1 flex items-center gap-1">
                              <AlertCircle size={12} className="shrink-0" />
                              <span>{formErrors.cardCvv}</span>
                            </p>
                          )}
                        </div>
                      </div>

                      {/* Micro-footer: PCI-DSS note & CVV 000 failure test guide */}
                      <div className="pt-2.5 flex items-center justify-between text-[11px] text-neutral-500 border-t border-neutral-200/60 flex-wrap gap-2">
                        <span>
                          Simulator: Enter CVV <span className="font-mono font-bold text-neutral-800">000</span> to test decline & retry
                        </span>
                        <div className="flex items-center gap-1 text-[10px] text-neutral-400 font-medium">
                          <CheckCircle2 size={11} className="text-emerald-600" />
                          <span>PCI-DSS Tier 1 Ready</span>
                        </div>
                      </div>
                    </div>
                  </div>
                )}

                {paymentMethod === "cod" && (
                  <div className="space-y-3">
                    <div className="flex items-center gap-2 text-xs font-semibold text-neutral-900">
                      <CheckCircle2 size={16} className="text-neutral-800" />
                      <span>Cash or UPI on Delivery Available</span>
                    </div>
                    <p className="text-xs text-neutral-600 leading-relaxed">
                      You can pay via cash or scan the courier agent&apos;s dynamic QR code using GPay, PhonePe, or Paytm right at your doorstep upon parcel arrival.
                    </p>
                    <div className="bg-white border border-neutral-200/90 rounded-lg p-3 text-[11px] text-neutral-500">
                      No extra COD fee applies to this order.
                    </div>
                  </div>
                )}
              </div>

              {/* Order Placement CTA */}
              <div className="mt-7 pt-5 border-t border-neutral-100 space-y-4">
                {/* Payment Failure Banner */}
                {paymentStatus === "failed" && (
                  <div
                    ref={failureBannerRef}
                    role="alert"
                    aria-live="assertive"
                    className="bg-neutral-50/80 border border-neutral-200/90 rounded-xl p-4 sm:p-5 transition-all animate-payment-shake"
                  >
                    <div className="flex items-start gap-3">
                      <AlertCircle size={18} className="text-red-600 shrink-0 mt-0.5" />
                      <div className="flex-1 min-w-0">
                        <div className="flex items-center justify-between gap-2 flex-wrap mb-1">
                          <h4 className="text-xs sm:text-sm font-bold text-neutral-900 tracking-tight">
                            Payment Unsuccessful
                          </h4>
                          <span className="text-[11px] font-medium text-neutral-500">
                            No funds were deducted
                          </span>
                        </div>
                        <p className="text-xs text-neutral-600 leading-relaxed">
                          {failureReason}
                        </p>
                        <p className="text-[11px] text-neutral-400 mt-1">
                          Your items remain safely reserved in your bag.
                        </p>

                        {paymentMethod !== "cod" && (
                          <div className="mt-3 pt-3 border-t border-neutral-200/60 flex items-center justify-between text-xs flex-wrap gap-2">
                            <span className="text-neutral-500">Prefer to pay on parcel arrival?</span>
                            <button
                              type="button"
                              onClick={handleSwitchToCod}
                              className="group inline-flex items-center gap-1.5 font-bold text-neutral-900 hover:text-black cursor-pointer transition-colors active:scale-[0.98] focus-visible:outline-none focus-visible:ring-1 focus-visible:ring-neutral-900 rounded-[2px]"
                            >
                              <span className="relative pb-0.5 border-b border-neutral-300/80 group-hover:border-transparent after:absolute after:bottom-0 after:left-0 after:h-[1.5px] after:w-full after:origin-bottom-left after:scale-x-0 after:bg-neutral-950 after:transition-transform after:duration-300 after:ease-out group-hover:after:scale-x-100 motion-reduce:after:transition-none">
                                Switch to Cash on Delivery
                              </span>
                              <ArrowRight
                                size={13}
                                className="stroke-[2.5] transition-transform duration-300 ease-out group-hover:translate-x-1 motion-reduce:transform-none shrink-0"
                              />
                            </button>
                          </div>
                        )}
                      </div>
                    </div>
                  </div>
                )}

                {/* Delivery Destination Reassurance Card */}
                <div className="bg-neutral-50/90 border border-neutral-200/90 rounded-2xl p-4 sm:p-4.5 transition-all">
                  {/* Top Bar: Icon + Label + Badge on Left, Change Button on Right */}
                  <div className="flex items-center justify-between gap-3 pb-3 mb-3 border-b border-neutral-200/70">
                    <div className="flex items-center gap-2 flex-wrap">
                      <div className="w-6 h-6 rounded-lg bg-neutral-950 text-white flex items-center justify-center shrink-0">
                        <Truck size={13} />
                      </div>
                      <span className="text-[11px] font-bold uppercase tracking-wider text-neutral-500">
                        Delivering Order To
                      </span>
                      {addressMode === "saved" ? (
                        <span className="inline-flex items-center px-2 py-0.5 rounded-full text-[10px] font-bold bg-neutral-200/80 text-neutral-700">
                          Saved Profile Address
                        </span>
                      ) : detectedLocationBadge ? (
                        <span className="inline-flex items-center gap-1 px-2 py-0.5 rounded-full text-[10px] font-bold bg-emerald-100/90 text-emerald-800 border border-emerald-200">
                          <span className="w-1.5 h-1.5 rounded-full bg-emerald-600 animate-pulse" />
                          {detectedLocationBadge.source === "live_gps" ? "Live GPS Location" : "Live Telemetry Location"}
                        </span>
                      ) : (
                        <span className="inline-flex items-center px-2 py-0.5 rounded-full text-[10px] font-bold bg-blue-100 text-blue-800">
                          Custom Address
                        </span>
                      )}
                    </div>

                    <button
                      type="button"
                      onClick={() => {
                        const sec = document.getElementById("section-delivery-address");
                        if (sec) sec.scrollIntoView({ behavior: "smooth", block: "start" });
                      }}
                      className="text-xs font-bold text-neutral-900 hover:text-black underline underline-offset-4 shrink-0 cursor-pointer transition-colors"
                    >
                      Change
                    </button>
                  </div>

                  {/* Address Details */}
                  <div className="space-y-1">
                    <div className="flex items-center gap-2 flex-wrap">
                      <span className="text-xs sm:text-sm font-bold text-neutral-950">
                        {fullName}
                      </span>
                      <span className="text-xs text-neutral-400">•</span>
                      <span className="text-xs font-mono text-neutral-600 font-medium">
                        {phone}
                      </span>
                    </div>
                    <p className="text-xs text-neutral-600 leading-relaxed font-normal">
                      {streetAddress
                        ? `${streetAddress}, ${city}, ${stateName} - ${pincode}`
                        : "Address pending"}
                    </p>
                  </div>
                </div>

                <button
                  type="submit"
                  disabled={isSubmitting}
                  className="w-full bg-neutral-950 text-white hover:bg-black py-4 px-6 rounded-xl text-xs sm:text-sm font-bold uppercase tracking-wider flex items-center justify-center gap-3 transition-all cursor-pointer shadow-md disabled:opacity-50 disabled:cursor-not-allowed"
                >
                  {isSubmitting ? (
                    <>
                      <div className="w-4 h-4 border-2 border-white border-t-transparent rounded-full animate-spin" />
                      <span>Verifying Payment...</span>
                    </>
                  ) : paymentStatus === "failed" ? (
                    <>
                      <RotateCcw size={16} />
                      <span>Retry Payment • {formatPrice(grandTotal)}</span>
                    </>
                  ) : (
                    <>
                      <span>Place Order • {formatPrice(grandTotal)}</span>
                      <ArrowRight size={16} />
                    </>
                  )}
                </button>

                <p className="text-[11px] text-center text-neutral-400">
                  By clicking Place Order, you confirm that you agree to VEYRO&apos;s{" "}
                  <span className="text-neutral-600 underline">Terms of Service</span> and{" "}
                  <span className="text-neutral-600 underline">7-Day Return Policy</span>.
                </p>
              </div>
            </section>
          </div>

          {/* ════ RIGHT COLUMN: STICKY ORDER SUMMARY (5 cols) ════ */}
          <div className="lg:col-span-5">
            <div className="sticky top-24 space-y-6">
              <div className="bg-white border border-neutral-200/90 rounded-2xl p-6 shadow-xs space-y-6">
                <div className="flex items-center justify-between pb-4 border-b border-neutral-100">
                  <h3 className="text-sm font-bold text-neutral-950 tracking-tight">
                    Order Summary
                  </h3>
                  <span className="text-xs font-semibold text-neutral-500 font-mono">
                    {inStockCount} {inStockCount === 1 ? "Item" : "Items"}
                  </span>
                </div>

                {/* Items Mini List (Available In-Stock Items Only) */}
                <div className="max-h-72 overflow-y-auto divide-y divide-neutral-100 pr-1 space-y-3">
                  {inStockItems.map((item) => {
                    const primaryImg =
                      item.product.imageUrl ||
                      "/products/tshirts/core-oversized-wolf-tee-front.webp";
                    const lineTotal = item.product.price * item.quantity;

                    return (
                      <div
                        key={`${item.product.id}-${item.selectedSize}`}
                        className="pt-3 first:pt-0 flex gap-3.5"
                      >
                        <div className="relative w-14 h-16 rounded-lg bg-neutral-100 overflow-hidden shrink-0 border border-neutral-200/60">
                          <Image
                            src={primaryImg}
                            alt={item.product.name}
                            fill
                            className="object-cover"
                            sizes="56px"
                          />
                        </div>

                        <div className="flex-1 min-w-0">
                          <h4 className="text-xs font-bold text-neutral-900 truncate">
                            {item.product.name}
                          </h4>
                          <div className="flex items-center gap-2 text-[11px] text-neutral-500 mt-0.5">
                            <span className="bg-neutral-100 px-1.5 py-0.5 rounded text-[10px] font-semibold text-neutral-800">
                              Size: {item.selectedSize}
                            </span>
                            <span>Qty: {item.quantity}</span>
                          </div>
                          <span className="text-xs font-bold text-neutral-950 block mt-1">
                            {formatPrice(lineTotal)}
                          </span>
                        </div>
                      </div>
                    );
                  })}
                </div>

                {oosCount > 0 && (
                  <div className="bg-amber-50/80 border border-amber-200/70 p-2.5 rounded-lg text-[11px] text-amber-900 leading-relaxed">
                    <span className="font-semibold">{oosCount} unavailable item{oosCount > 1 ? "s" : ""}</span> from your bag {oosCount > 1 ? "are" : "is"} excluded from this order and remain safely saved in your bag.
                  </div>
                )}

                {/* Delivery Destination Assurance */}
                <div className="p-3 bg-neutral-50/80 rounded-xl border border-neutral-200/70 text-xs">
                  <div className="flex items-center justify-between text-neutral-900 font-semibold mb-1">
                    <div className="flex items-center gap-1.5">
                      <MapPin size={13} className="text-neutral-700 shrink-0" />
                      <span>Delivery Destination</span>
                    </div>
                    <span className="text-[10px] font-mono text-neutral-500 font-semibold">
                      {pincode || "560038"}
                    </span>
                  </div>
                  <p className="text-[11px] text-neutral-600 line-clamp-1">
                    {streetAddress ? `${streetAddress}, ${city}` : "Address specified in Section 02"}
                  </p>
                </div>

                {/* Promo Code Input */}
                <div className="pt-4 border-t border-neutral-100">
                  <div className="flex gap-2">
                    <div className="relative flex-1">
                      <Tag
                        size={13}
                        className="absolute left-3 top-1/2 -translate-y-1/2 text-neutral-400"
                      />
                      <input
                        type="text"
                        value={promoInput}
                        onChange={(e) => setPromoInput(e.target.value.toUpperCase())}
                        onKeyDown={(e) => {
                          if (e.key === "Enter") {
                            e.preventDefault();
                            handleApplyPromo(e);
                          }
                        }}
                        placeholder="ENTER COUPON CODE"
                        className="w-full text-xs font-mono uppercase pl-8 pr-3 py-2 border border-neutral-300 rounded-lg focus-visible:outline-hidden focus-visible:ring-2 focus-visible:ring-black bg-white"
                      />
                    </div>
                    <button
                      type="button"
                      onClick={handleApplyPromo}
                      className="bg-neutral-900 text-white text-xs font-semibold px-3 py-2 rounded-lg hover:bg-black transition-colors cursor-pointer"
                    >
                      Apply
                    </button>
                  </div>

                  {promoError && (
                    <p className="text-[11px] text-red-600 mt-1.5">{promoError}</p>
                  )}

                  {appliedCoupon && (
                    <div className="mt-2.5 flex items-center justify-between bg-emerald-50 border border-emerald-200/70 px-2.5 py-1.5 rounded-lg text-xs">
                      <div className="flex items-center gap-1.5 text-emerald-800 font-semibold">
                        <Check size={13} />
                        <span>Code &quot;{appliedCoupon}&quot; Applied</span>
                      </div>
                      <button
                        type="button"
                        onClick={removeCoupon}
                        className="text-emerald-700 hover:text-emerald-950 font-bold cursor-pointer text-xs"
                      >
                        Remove
                      </button>
                    </div>
                  )}

                  <p className="text-[10px] text-neutral-400 mt-1.5">
                    Use code <strong className="text-neutral-700">VEYRO10</strong> for 10% off
                  </p>
                </div>

                {/* Price Breakdown */}
                <div className="space-y-2.5 text-xs pt-4 border-t border-neutral-100">
                  <div className="flex justify-between text-neutral-600">
                    <span>Items Total (MRP)</span>
                    <span className="font-mono text-neutral-900">{formatPrice(subtotal)}</span>
                  </div>

                  {bundleDiscount > 0 && (
                    <div className="flex justify-between text-emerald-700 font-medium">
                      <span>Bundle Savings</span>
                      <span className="font-mono">-{formatPrice(bundleDiscount)}</span>
                    </div>
                  )}

                  {couponDiscount > 0 && (
                    <div className="flex justify-between text-emerald-700 font-medium">
                      <span>Coupon Discount</span>
                      <span className="font-mono">-{formatPrice(couponDiscount)}</span>
                    </div>
                  )}

                  <div className="flex justify-between text-neutral-600">
                    <span>Estimated Delivery</span>
                    <span className="font-mono font-semibold">
                      {shippingFee === 0 ? (
                        <span className="text-emerald-700">FREE</span>
                      ) : (
                        formatPrice(shippingFee)
                      )}
                    </span>
                  </div>

                  {totalSavings > 0 && (
                    <div className="bg-emerald-50/80 p-2.5 rounded-lg text-[11px] text-emerald-800 font-medium">
                      You are saving {formatPrice(totalSavings)} on this order!
                    </div>
                  )}

                  <div className="pt-3 border-t border-neutral-100 flex justify-between items-baseline">
                    <div>
                      <span className="text-sm font-bold text-neutral-950 block">
                        Total Amount Payable
                      </span>
                      <span className="text-[10px] text-neutral-400">
                        Inclusive of all GST & duties
                      </span>
                    </div>
                    <span className="text-lg font-black text-neutral-950 tabular-nums">
                      {formatPrice(grandTotal)}
                    </span>
                  </div>
                </div>
              </div>

              {/* Trust & Guarantee Cards */}
              <div className="bg-white border border-neutral-200/90 rounded-2xl p-5 shadow-xs space-y-3 text-xs text-neutral-600">
                <div className="flex items-start gap-3">
                  <ShieldCheck size={18} className="text-neutral-900 shrink-0 mt-0.5" />
                  <div>
                    <span className="font-bold text-neutral-950 block">
                      Authentic Mill-Finished Apparel
                    </span>
                    <span className="text-[11px] text-neutral-500">
                      Crafted from 240+ GSM combed heavyweight cotton.
                    </span>
                  </div>
                </div>

                <div className="flex items-start gap-3 pt-2.5 border-t border-neutral-100">
                  <RotateCcw size={18} className="text-neutral-900 shrink-0 mt-0.5" />
                  <div>
                    <span className="font-bold text-neutral-950 block">
                      7-Day Doorstep Pickup & Returns
                    </span>
                    <span className="text-[11px] text-neutral-500">
                      Hassle-free returns or instant refund policy.
                    </span>
                  </div>
                </div>
              </div>
            </div>
          </div>
        </form>
      </main>
    </div>
  );
}
