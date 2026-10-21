"use client";

import React, { useState, useEffect, useMemo, useRef, useSyncExternalStore } from "react";
import Image from "next/image";
import Link from "next/link";
import { useRouter } from "next/navigation";
import { motion } from "framer-motion";
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
  RefreshCw,
  MapPin,
  Navigation,
  Home,
  Plus,
  LocateFixed,
  ArrowLeft,
  Pencil,
  ArrowUpRight,
  Clock,
  Loader2,
  Gift,
  EyeOff,
  Sparkles,
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

function UpiOfficialLogo({ className = "w-9 h-3" }: { className?: string }) {
  return (
    <svg viewBox="38 4 364 100" className={className} aria-hidden="true">
      <g transform="matrix(1,0,0,-1,0,180)">
        {/* U */}
        <g transform="translate(156.1196,82.541)">
          <path
            d="m 0,0 c -1.065,-3.835 -4.557,-6.488 -8.538,-6.488 h -99.491 c -2.711,0 -4.726,0.924 -6.051,2.77 -1.324,1.848 -1.608,4.134 -0.851,6.857 l 24.276,87.387 h 19.301 l -21.683,-78.05 h 77.206 l 21.683,78.05 h 19.297 z"
            fill="#0f172a"
          />
        </g>
        {/* P */}
        <g transform="translate(306.4521,170.2881)">
          <path
            d="m 0,0 c -1.337,1.843 -3.399,2.773 -6.2,2.773 h -106.036 l -5.252,-18.97 h 19.294 v 0.011 h 77.169 l -5.614,-20.272 h -77.171 l 0.007,0.042 h -19.286 l -16.007,-57.787 h 19.296 l 10.742,38.786 h 86.746 c 2.709,0 5.259,0.924 7.657,2.772 2.393,1.85 3.968,4.131 4.723,6.855 L 0.809,-6.996 C 1.593,-4.181 1.322,-1.845 0,0"
            fill="#0f172a"
          />
        </g>
        {/* I */}
        <g transform="translate(316.4629,76.4951)">
          <path d="M 0,0 H -19.283 L 7.535,96.855 h 19.284 z" fill="#0f172a" />
        </g>
        {/* Orange Chevron */}
        <g transform="translate(359.4717,173.1689)">
          <path d="m 0,0 24.396,-48.553 -51.343,-48.54 z" fill="#FF7300" />
        </g>
        {/* Green Chevron */}
        <g transform="translate(376.5859,173.1689)">
          <path d="m 0,0 24.414,-48.553 -51.322,-48.54 z" fill="#00823E" />
        </g>
      </g>
    </svg>
  );
}

export default function CheckoutPage() {
  const router = useRouter();
  const { products } = useProducts();
  const {
    isHydrated,
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
    giftPackaging,
    giftPackagingFee,
  } = useCart();

  const { user, openAccountModal, addOrder } = useUser();
  const isMounted = useMounted();
  
  // Payment lifecycle state (E9)
  type PaymentStatus = "idle" | "processing" | "failed" | "success";
  const [paymentStatus, setPaymentStatus] = useState<PaymentStatus>("idle");
  const [failureReason, setFailureReason] = useState<string>("");
  const [retryCount, setRetryCount] = useState(0);
  const [isSubmitting, setIsSubmitting] = useState(false);
  const orderPlacedRef = useRef(false);

  const failureBannerRef = useRef<HTMLDivElement>(null);
  const paymentSectionRef = useRef<HTMLElement>(null);

  useEffect(() => {
    if (paymentStatus === "failed" && failureBannerRef.current) {
      failureBannerRef.current.scrollIntoView({ behavior: "smooth", block: "center" });
    }
  }, [paymentStatus]);

  // Form State - Contact (Populate from active user session or clean empty for guest)
  const [email, setEmail] = useState(() => user?.email || "");
  const [phone, setPhone] = useState(() => user?.phone || "");

  // Form State - Shipping Address (Populate from user profile if signed in, or clean empty for guest)
  const [fullName, setFullName] = useState(() => user?.name || "");
  const [streetAddress, setStreetAddress] = useState(() => user?.address?.line1 || "");
  const [apartment, setApartment] = useState("");
  const [city, setCity] = useState(() => user?.address?.city || "");
  const [stateName, setStateName] = useState(() => user?.address?.state || "");
  const [pincode, setPincode] = useState(() => user?.address?.pincode || "");
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
        name: user.name || "Valued Member",
        phone: user.phone || phone || "",
        line1: user.address.line1,
        city: user.address.city || "Bengaluru",
        state: user.address.state || "Karnataka",
        pincode: user.address.pincode || "560038",
        label: "Saved Profile Address (Home)",
        isCustomUser: true,
      };
    }
    return null;
  }, [user, phone]);

  // Delivery address selection: "recipient" (friend's address) | "saved" (profile address) | "custom" (entered or live location)
  type AddressMode = "recipient" | "saved" | "custom";
  const [addressMode, setAddressMode] = useState<AddressMode>(() => {
    if (giftPackaging.enabled) return "recipient";
    return user?.address?.line1 ? "saved" : "custom";
  });

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

  // Friend Recipient Address State (for surprise gift orders)
  const [recipientFullName, setRecipientFullName] = useState(() => giftPackaging.recipientName || "Ramesh");
  const [recipientPhone, setRecipientPhone] = useState(() => giftPackaging.recipientAddress?.phone || "");
  const [recipientStreet, setRecipientStreet] = useState(() => giftPackaging.recipientAddress?.street || "");
  const [recipientApartment, setRecipientApartment] = useState(() => giftPackaging.recipientAddress?.apartment || "");
  const [recipientCity, setRecipientCity] = useState(() => giftPackaging.recipientAddress?.city || "");
  const [recipientState, setRecipientState] = useState(() => giftPackaging.recipientAddress?.state || "");
  const [recipientPincode, setRecipientPincode] = useState(() => giftPackaging.recipientAddress?.pincode || "");

  // [E.6] Billing Address Selection State
  // For gift orders sending to friend, billing address defaults to separate (false) so buyer receives tax invoice
  const [billingSameAsShipping, setBillingSameAsShipping] = useState<boolean>(() => {
    return !giftPackaging.enabled;
  });
  const [billingMode, setBillingMode] = useState<"profile" | "custom">("profile");
  const [billingFullName, setBillingFullName] = useState(() => user?.name || (giftPackaging.senderName || "Santhosh"));
  const [billingPhone, setBillingPhone] = useState(() => user?.phone || "+91 98765 43210");
  const [billingStreetAddress, setBillingStreetAddress] = useState(() => user?.address?.line1 || "Flat 402, Prestige Tower, Indiranagar");
  const [billingApartment, setBillingApartment] = useState("");
  const [billingCity, setBillingCity] = useState(() => user?.address?.city || "Bengaluru");
  const [billingStateName, setBillingStateName] = useState(() => user?.address?.state || "Karnataka");
  const [billingPincode, setBillingPincode] = useState(() => user?.address?.pincode || "560038");

  // Keep recipient fields in sync if hydrated from Cart Context
  useEffect(() => {
    if (giftPackaging.enabled) {
      if (giftPackaging.recipientName) {
        setRecipientFullName(giftPackaging.recipientName);
        if (addressMode === "recipient") setFullName(giftPackaging.recipientName);
      }
      if (giftPackaging.recipientAddress?.phone) {
        setRecipientPhone(giftPackaging.recipientAddress.phone);
      }
      if (giftPackaging.recipientAddress?.street) {
        setRecipientStreet(giftPackaging.recipientAddress.street);
        if (addressMode === "recipient") setStreetAddress(giftPackaging.recipientAddress.street);
      }
      if (giftPackaging.recipientAddress?.apartment) {
        setRecipientApartment(giftPackaging.recipientAddress.apartment);
        if (addressMode === "recipient") setApartment(giftPackaging.recipientAddress.apartment);
      }
      if (giftPackaging.recipientAddress?.city) {
        setRecipientCity(giftPackaging.recipientAddress.city);
        if (addressMode === "recipient") setCity(giftPackaging.recipientAddress.city);
      }
      if (giftPackaging.recipientAddress?.state) {
        setRecipientState(giftPackaging.recipientAddress.state);
        if (addressMode === "recipient") setStateName(giftPackaging.recipientAddress.state);
      }
      if (giftPackaging.recipientAddress?.pincode) {
        setRecipientPincode(giftPackaging.recipientAddress.pincode);
        if (addressMode === "recipient") setPincode(giftPackaging.recipientAddress.pincode);
      }
      if (giftPackaging.senderName && !user?.name) {
        setBillingFullName(giftPackaging.senderName);
      }
    }
  }, [giftPackaging, addressMode, user]);

  const handleSelectRecipientAddress = () => {
    setAddressMode("recipient");
    setFullName(recipientFullName || giftPackaging.recipientName || "");
    setStreetAddress(recipientStreet || giftPackaging.recipientAddress?.street || "");
    setApartment(recipientApartment || giftPackaging.recipientAddress?.apartment || "");
    setCity(recipientCity || giftPackaging.recipientAddress?.city || "");
    setStateName(recipientState || giftPackaging.recipientAddress?.state || "");
    setPincode(recipientPincode || giftPackaging.recipientAddress?.pincode || "");
    setLocationError(null);
  };

  const handleSelectSavedAddress = () => {
    if (!user) {
      openAccountModal();
      return;
    }
    setAddressMode("saved");
    if (savedProfileAddress) {
      setFullName(savedProfileAddress.name);
      setStreetAddress(savedProfileAddress.line1);
      setApartment("");
      setCity(savedProfileAddress.city);
      setStateName(savedProfileAddress.state);
      setPincode(savedProfileAddress.pincode);
    }
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

  // Guard: redirect to /cart only AFTER cart has hydrated from localStorage and there are truly 0 in-stock items
  useEffect(() => {
    if (!isMounted || !isHydrated) return;
    if (orderPlacedRef.current || paymentStatus === "success" || isSubmitting) return;
    if (items.length === 0 || inStockCount === 0) {
      router.replace("/cart");
    }
  }, [isMounted, isHydrated, items.length, inStockCount, router, paymentStatus, isSubmitting]);

  // Delivery calculation
  const shippingFee = shippingMethod === "express" ? 149 : hasFreeShipping ? 0 : 99;
  const grandTotal = Math.max(0, finalSubtotal - couponDiscount + shippingFee + giftPackagingFee);
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
    if (addressMode === "recipient") {
      if (!recipientPhone.trim() || recipientPhone.replace(/\D/g, "").length < 10) {
        errors.recipientPhone = "Please enter friend's 10-digit mobile number for courier OTP.";
      }
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

    // [E.6] Validate Separate Billing Address if uncoupled
    if (!billingSameAsShipping && billingMode === "custom") {
      if (!billingFullName.trim()) {
        errors.billingFullName = "Please enter billing contact name.";
      }
      if (!billingStreetAddress.trim()) {
        errors.billingStreetAddress = "Please enter billing street address.";
      }
      if (!billingCity.trim()) {
        errors.billingCity = "Please enter billing city.";
      }
      if (!billingStateName.trim()) {
        errors.billingStateName = "Please enter billing state.";
      }
      if (!billingPincode.trim() || billingPincode.replace(/\D/g, "").length !== 6) {
        errors.billingPincode = "Please enter a valid 6-digit billing PIN code.";
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

      const fullBillingAddressString = billingSameAsShipping
        ? fullAddressString
        : [
            billingFullName,
            billingStreetAddress,
            billingApartment,
            `${billingCity}, ${billingStateName} - ${billingPincode}`,
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
        giftPackaging: giftPackaging.enabled ? giftPackaging : undefined,
        isGiftOrder: giftPackaging.enabled && addressMode === "recipient",
        isGuestOrder: !user,
        guestEmail: !user ? email : undefined,
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
          phone: addressMode === "recipient" && recipientPhone ? recipientPhone : phone,
          address: fullAddressString,
          pincode: pincode,
        },
        billingAddress: {
          name: billingSameAsShipping ? fullName : billingFullName,
          phone: billingSameAsShipping ? phone : billingPhone,
          address: fullBillingAddressString,
          pincode: billingSameAsShipping ? pincode : billingPincode,
        },
        paymentMethod: paymentMethod,
      };

      orderPlacedRef.current = true;
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

  // SSR & Cart Hydration Loading state
  if (!isMounted || !isHydrated) {
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
    if (orderPlacedRef.current || paymentStatus === "success") {
      return (
        <div className="fixed inset-0 z-50 bg-black/40 backdrop-blur-md flex items-center justify-center p-4">
          <motion.div
            initial={{ opacity: 0, scale: 0.96 }}
            animate={{ opacity: 1, scale: 1 }}
            transition={{ duration: 0.4, ease: [0.16, 1, 0.3, 1] }}
            className="bg-white rounded-2xl p-8 max-w-sm w-full text-center shadow-2xl border border-neutral-100 space-y-4"
          >
            <div className="w-14 h-14 bg-emerald-50 text-emerald-600 rounded-full flex items-center justify-center mx-auto border border-emerald-100 animate-pulse">
              <CheckCircle2 size={32} />
            </div>
            <div>
              <h3 className="text-base font-bold text-neutral-900">Payment Verified</h3>
              <p className="text-xs text-neutral-500 font-mono mt-1">Opening your order confirmation...</p>
            </div>
          </motion.div>
        </div>
      );
    }

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
      {/* ── UNIFIED EDITORIAL CHECKOUT PROGRESS & UTILITY BAR ─────────────────── */}
      <div className="bg-white border-b border-neutral-200/80 sticky top-0 z-40 shadow-[0_1px_3px_rgba(0,0,0,0.02)]">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 h-14 flex items-center justify-between gap-2 sm:gap-4">
          {/* Left: Return to Bag with Item Count Pill */}
          <Link
            href="/cart"
            className="group flex items-center gap-1.5 sm:gap-2 text-xs font-semibold text-neutral-600 hover:text-neutral-950 transition-colors select-none shrink-0"
          >
            <span className="w-6 h-6 rounded-full bg-neutral-100 group-hover:bg-neutral-900 group-hover:text-white flex items-center justify-center transition-all duration-200 shrink-0">
              <ChevronLeft size={14} className="transition-transform duration-200 group-hover:-translate-x-0.5" />
            </span>
            <span className="hidden md:inline whitespace-nowrap">Return to Bag</span>
            <span className="md:hidden whitespace-nowrap">Bag</span>
            <span className="px-1.5 py-0.5 rounded-full bg-neutral-100 text-neutral-600 text-[10px] font-semibold font-mono tracking-tight group-hover:bg-neutral-200/80 transition-colors">
              {inStockCount}
            </span>
          </Link>

          {/* Center: Refined Editorial Stepper with Connected Hairline Tracks */}
          <nav aria-label="Checkout Progress" className="flex items-center gap-1.5 sm:gap-2.5 text-xs select-none shrink-0">
            {/* Step 1: Bag (Completed) */}
            <Link
              href="/cart"
              className="group flex items-center gap-1.5 text-neutral-500 hover:text-neutral-950 transition-colors shrink-0 whitespace-nowrap"
            >
              <span className="w-4 h-4 rounded-full bg-emerald-600 text-white flex items-center justify-center shrink-0 shadow-2xs">
                <Check size={10} className="stroke-[3]" />
              </span>
              <span className="font-medium text-neutral-600 group-hover:text-neutral-950 transition-colors hidden sm:inline">
                Bag
              </span>
            </Link>

            {/* Completed Hairline Connector Track */}
            <div className="w-3 sm:w-6 lg:w-10 h-px bg-emerald-600/70 shrink-0" aria-hidden="true" />

            {/* Step 2: Delivery & Payment (Active) */}
            <div className="flex items-center gap-1.5 sm:gap-2 text-neutral-950 shrink-0 whitespace-nowrap">
              <span className="w-4 h-4 rounded-full bg-neutral-950 text-white text-[10px] font-bold flex items-center justify-center shrink-0 shadow-xs ring-2 ring-neutral-950/15">
                2
              </span>
              <span className="font-bold tracking-tight text-neutral-950">
                <span className="hidden lg:inline">Delivery & Payment</span>
                <span className="lg:hidden">Payment</span>
              </span>
            </div>

            {/* Pending Hairline Connector Track */}
            <div className="w-3 sm:w-6 lg:w-10 h-px bg-neutral-200 shrink-0" aria-hidden="true" />

            {/* Step 3: Confirmation (Upcoming) */}
            <div className="flex items-center gap-1.5 text-neutral-400 shrink-0 whitespace-nowrap">
              <span className="w-4 h-4 rounded-full bg-neutral-100 border border-neutral-200 text-neutral-400 text-[10px] font-semibold flex items-center justify-center shrink-0">
                3
              </span>
              <span className="font-medium text-neutral-400 hidden sm:inline">
                Confirmation
              </span>
            </div>
          </nav>

          {/* Right: Reassuring Micro-Trust Badge */}
          <div className="flex items-center gap-1.5 px-2.5 py-1 rounded-full bg-neutral-50 border border-neutral-200/80 text-[11px] text-neutral-600 select-none shadow-2xs shrink-0 whitespace-nowrap">
            <ShieldCheck size={14} className="text-neutral-800 shrink-0" aria-hidden="true" />
            <span className="font-mono font-semibold text-neutral-800 tracking-tight text-[11px] hidden sm:inline">
              256-Bit SSL
            </span>
            <span className="text-neutral-300 hidden md:inline">•</span>
            <span className="text-neutral-500 font-medium text-[11px] hidden md:inline">
              Bank-Grade
            </span>
            <span className="sm:hidden font-mono font-semibold text-neutral-800 text-[10px]">
              Secure
            </span>
          </div>
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
                  <div className="flex items-center gap-2">
                    <span className="text-[11px] font-semibold text-emerald-800 bg-emerald-50 border border-emerald-200/60 px-2.5 py-1 rounded-full flex items-center gap-1.5 shadow-2xs">
                      <CheckCircle2 size={12} className="text-emerald-600" />
                      Signed in as {user.name}
                    </span>
                  </div>
                ) : (
                  <div className="flex items-center gap-2">
                    <span className="text-[11px] font-semibold text-neutral-600 bg-neutral-100 px-2.5 py-1 rounded-full">
                      Guest Checkout
                    </span>
                    <button
                      type="button"
                      onClick={openAccountModal}
                      className="text-[11px] font-bold text-neutral-900 hover:text-black underline underline-offset-2 transition-colors cursor-pointer flex items-center gap-1"
                    >
                      <span>Sign In</span>
                      <ArrowRight size={11} />
                    </button>
                  </div>
                )}
              </div>

              {/* Guest Sign-In Prompt Card (Only shown if user is NOT logged in) */}
              {!user && (
                <div className="mb-5 p-3.5 sm:p-4 rounded-xl bg-neutral-900 text-white flex flex-col sm:flex-row items-start sm:items-center justify-between gap-3 shadow-xs">
                  <div className="flex items-center gap-3 min-w-0">
                    <div className="w-8 h-8 rounded-lg bg-white/10 flex items-center justify-center shrink-0 text-amber-400">
                      <Sparkles size={15} />
                    </div>
                    <div className="min-w-0">
                      <p className="text-xs font-bold text-white tracking-tight">Already have a Veyro account?</p>
                      <p className="text-[11px] text-neutral-300">Sign in to load your saved delivery addresses and track your order live.</p>
                    </div>
                  </div>
                  <button
                    type="button"
                    onClick={openAccountModal}
                    className="px-3.5 py-1.5 bg-white text-black hover:bg-neutral-100 text-xs font-bold rounded-lg transition-colors cursor-pointer shrink-0 shadow-xs"
                  >
                    Sign In / Log In
                  </button>
                </div>
              )}

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
                      {giftPackaging.enabled
                        ? "Choose friend's doorstep or deliver to your address first"
                        : "Choose saved profile address or auto-detect with live GPS"}
                    </p>
                  </div>
                </div>
                <div className="flex items-center gap-1 text-[11px] text-neutral-500 font-mono">
                  <Truck size={13} className="text-neutral-700" />
                  <span>Pan-India Courier</span>
                </div>
              </div>

              {/* Address Mode Selection Tabs (Unified Sliding Pill Segmented Controls) */}
              {giftPackaging.enabled ? (
                <div
                  role="tablist"
                  aria-label="Delivery destination selection"
                  className="relative grid grid-cols-3 p-1 mb-5 bg-neutral-100/90 rounded-xl border border-neutral-200/70 select-none text-center"
                >
                  {/* Sliding Active Pill Background - GPU accelerated transform only */}
                  <div
                    aria-hidden="true"
                    className="absolute top-1 bottom-1 left-1 w-[calc(33.333%-3px)] rounded-lg bg-white shadow-xs transition-transform duration-300 ease-[cubic-bezier(0.16,1,0.3,1)] pointer-events-none"
                    style={{
                      transform:
                        addressMode === "recipient"
                          ? "translateX(0%)"
                          : addressMode === "saved"
                          ? "translateX(100%)"
                          : "translateX(200%)",
                    }}
                  />

                  <button
                    type="button"
                    role="tab"
                    id="tab-recipient-address"
                    aria-selected={addressMode === "recipient"}
                    aria-controls="panel-recipient-address"
                    onClick={handleSelectRecipientAddress}
                    className={`relative z-10 flex items-center justify-center gap-1.5 py-2 px-2 rounded-lg text-xs font-semibold transition-colors duration-200 cursor-pointer active:scale-[0.98] ${
                      addressMode === "recipient"
                        ? "text-neutral-950 font-bold"
                        : "text-neutral-500 hover:text-neutral-800"
                    }`}
                  >
                    <Gift size={13} className={`transition-colors duration-200 ${addressMode === "recipient" ? "text-neutral-950" : "text-neutral-400"}`} />
                    <span className="truncate">Friend&apos;s Doorstep</span>
                  </button>

                  <button
                    type="button"
                    role="tab"
                    id="tab-saved-address"
                    aria-selected={addressMode === "saved"}
                    aria-controls="panel-saved-address"
                    onClick={handleSelectSavedAddress}
                    className={`relative z-10 flex items-center justify-center gap-1.5 py-2 px-2 rounded-lg text-xs font-semibold transition-colors duration-200 cursor-pointer active:scale-[0.98] ${
                      addressMode === "saved"
                        ? "text-neutral-950 font-bold"
                        : "text-neutral-500 hover:text-neutral-800"
                    }`}
                  >
                    <Home size={13} className={`transition-colors duration-200 ${addressMode === "saved" ? "text-neutral-950" : "text-neutral-400"}`} />
                    <span className="truncate">Deliver to Me</span>
                  </button>

                  <button
                    type="button"
                    role="tab"
                    id="tab-custom-address"
                    aria-selected={addressMode === "custom"}
                    aria-controls="panel-custom-address"
                    onClick={handleSelectCustomAddress}
                    className={`relative z-10 flex items-center justify-center gap-1.5 py-2 px-2 rounded-lg text-xs font-semibold transition-colors duration-200 cursor-pointer active:scale-[0.98] ${
                      addressMode === "custom"
                        ? "text-neutral-950 font-bold"
                        : "text-neutral-500 hover:text-neutral-800"
                    }`}
                  >
                    <MapPin size={13} className={`transition-colors duration-200 ${addressMode === "custom" ? "text-neutral-950" : "text-neutral-400"}`} />
                    <span className="truncate">Other / GPS</span>
                  </button>
                </div>
              ) : (
                <div
                  role="tablist"
                  aria-label="Address mode selection"
                  className="relative grid grid-cols-2 p-1 mb-5 bg-neutral-100/90 rounded-xl border border-neutral-200/70 select-none"
                >
                  {/* Sliding Active Pill Background - GPU accelerated transform only */}
                  <div
                    aria-hidden="true"
                    className="absolute top-1 bottom-1 left-1 w-[calc(50%-4px)] rounded-lg bg-white shadow-xs transition-transform duration-300 ease-[cubic-bezier(0.16,1,0.3,1)] pointer-events-none"
                    style={{
                      transform: addressMode === "saved" ? "translateX(0%)" : "translateX(100%)",
                    }}
                  />

                  <button
                    type="button"
                    role="tab"
                    id="tab-saved-address"
                    aria-selected={addressMode === "saved"}
                    aria-controls="panel-saved-address"
                    onClick={handleSelectSavedAddress}
                    className={`relative z-10 flex items-center justify-center gap-1.5 py-2 px-3 rounded-lg text-xs font-semibold transition-colors duration-200 cursor-pointer active:scale-[0.98] ${
                      addressMode === "saved"
                        ? "text-neutral-950 font-bold"
                        : "text-neutral-500 hover:text-neutral-800"
                    }`}
                  >
                    <Home size={13} className={`transition-colors duration-200 ${addressMode === "saved" ? "text-neutral-950" : "text-neutral-400"}`} />
                    <span>{user ? "Saved Profile Address" : "Saved Address (Sign In)"}</span>
                  </button>
                  <button
                    type="button"
                    role="tab"
                    id="tab-custom-address"
                    aria-selected={addressMode === "custom"}
                    aria-controls="panel-custom-address"
                    onClick={handleSelectCustomAddress}
                    className={`relative z-10 flex items-center justify-center gap-1.5 py-2 px-3 rounded-lg text-xs font-semibold transition-colors duration-200 cursor-pointer active:scale-[0.98] ${
                      addressMode === "custom"
                        ? "text-neutral-950 font-bold"
                        : "text-neutral-500 hover:text-neutral-800"
                    }`}
                  >
                    <MapPin size={13} className={`transition-colors duration-200 ${addressMode === "custom" ? "text-neutral-950" : "text-neutral-400"}`} />
                    <span>{user ? "Different / Live Location" : "Enter Shipping Address"}</span>
                  </button>
                </div>
              )}

              {/* ── MODE 1: FRIEND'S RECIPIENT ADDRESS (When in Gift Mode) ── */}
              {giftPackaging.enabled && addressMode === "recipient" ? (
                <div
                  key="recipient-panel"
                  id="panel-recipient-address"
                  role="tabpanel"
                  className="animate-tab-panel-enter space-y-4"
                >
                  <div className="rounded-xl border border-neutral-200/90 bg-neutral-50/40 p-4 sm:p-5 transition-all space-y-4">
                    <div className="flex items-center justify-between pb-3 border-b border-neutral-200/70 flex-wrap gap-2">
                      <div className="flex items-center gap-2">
                        <Gift size={14} className="text-neutral-700" />
                        <h3 className="text-xs font-bold text-neutral-950">
                          Friend&apos;s Doorstep Delivery Address
                        </h3>
                      </div>
                      <span className="inline-flex items-center gap-1.5 px-2.5 py-1 rounded-full text-[10px] font-semibold text-neutral-600 bg-white border border-neutral-200">
                        <EyeOff size={11} className="text-neutral-500" />
                        Invoices &amp; Prices Redacted
                      </span>
                    </div>

                    <div className="grid grid-cols-1 sm:grid-cols-2 gap-3.5">
                      <div>
                        <label className="block text-[11px] font-bold text-neutral-800 mb-1">
                          Friend&apos;s Full Name (Recipient) <span className="text-red-500">*</span>
                        </label>
                        <input
                          type="text"
                          value={recipientFullName}
                          onChange={(e) => {
                            setRecipientFullName(e.target.value);
                            setFullName(e.target.value);
                          }}
                          placeholder="e.g. Ramesh Kumar"
                          className={`w-full text-xs px-3.5 py-2.5 rounded-lg border bg-white transition-colors focus-visible:outline-hidden focus-visible:ring-2 focus-visible:ring-black ${
                            formErrors.fullName ? "border-red-400 bg-red-50/20" : "border-neutral-300"
                          }`}
                        />
                        {formErrors.fullName && (
                          <p className="text-[11px] text-red-600 mt-1">{formErrors.fullName}</p>
                        )}
                      </div>

                      <div>
                        <label className="block text-[11px] font-bold text-neutral-800 mb-1">
                          Friend&apos;s Mobile Number <span className="text-red-500">*</span>
                        </label>
                        <input
                          type="tel"
                          maxLength={10}
                          value={recipientPhone}
                          onChange={(e) => {
                            const val = e.target.value.replace(/\D/g, "");
                            setRecipientPhone(val);
                            if (formErrors.recipientPhone) {
                              setFormErrors((prev) => {
                                const next = { ...prev };
                                delete next.recipientPhone;
                                return next;
                              });
                            }
                          }}
                          placeholder="10-digit mobile number"
                          className={`w-full text-xs px-3.5 py-2.5 rounded-lg border bg-white transition-colors focus-visible:outline-hidden focus-visible:ring-2 focus-visible:ring-black ${
                            formErrors.recipientPhone ? "border-red-400 bg-red-50/20" : "border-neutral-300"
                          }`}
                        />
                        {formErrors.recipientPhone && (
                          <p className="text-[11px] text-red-600 mt-1">{formErrors.recipientPhone}</p>
                        )}
                        <p className="text-[10px] text-neutral-500 mt-1">
                          Used strictly for courier delivery OTP upon arrival at their door.
                        </p>
                      </div>

                      <div className="sm:col-span-2">
                        <label className="block text-[11px] font-bold text-neutral-800 mb-1">
                          Friend&apos;s Street Address / Flat / Floor <span className="text-red-500">*</span>
                        </label>
                        <input
                          type="text"
                          value={recipientStreet}
                          onChange={(e) => {
                            setRecipientStreet(e.target.value);
                            setStreetAddress(e.target.value);
                          }}
                          placeholder="Flat 402, Prestige Tower, 12th Main Road"
                          className={`w-full text-xs px-3.5 py-2.5 rounded-lg border bg-white transition-colors focus-visible:outline-hidden focus-visible:ring-2 focus-visible:ring-black ${
                            formErrors.streetAddress ? "border-red-400 bg-red-50/20" : "border-neutral-300"
                          }`}
                        />
                        {formErrors.streetAddress && (
                          <p className="text-[11px] text-red-600 mt-1">{formErrors.streetAddress}</p>
                        )}
                      </div>

                      <div className="sm:col-span-2">
                        <label className="block text-[11px] font-bold text-neutral-800 mb-1">
                          Apartment, Suite, Landmark (Optional)
                        </label>
                        <input
                          type="text"
                          value={recipientApartment}
                          onChange={(e) => {
                            setRecipientApartment(e.target.value);
                            setApartment(e.target.value);
                          }}
                          placeholder="Near Indiranagar Metro Station"
                          className="w-full text-xs px-3.5 py-2.5 rounded-lg border border-neutral-300 bg-white transition-colors focus-visible:outline-hidden focus-visible:ring-2 focus-visible:ring-black"
                        />
                      </div>

                      <div>
                        <label className="block text-[11px] font-bold text-neutral-800 mb-1">
                          City <span className="text-red-500">*</span>
                        </label>
                        <input
                          type="text"
                          value={recipientCity}
                          onChange={(e) => {
                            setRecipientCity(e.target.value);
                            setCity(e.target.value);
                          }}
                          placeholder="e.g. Bengaluru"
                          className={`w-full text-xs px-3.5 py-2.5 rounded-lg border bg-white transition-colors focus-visible:outline-hidden focus-visible:ring-2 focus-visible:ring-black ${
                            formErrors.city ? "border-red-400 bg-red-50/20" : "border-neutral-300"
                          }`}
                        />
                        {formErrors.city && (
                          <p className="text-[11px] text-red-600 mt-1">{formErrors.city}</p>
                        )}
                      </div>

                      <div>
                        <label className="block text-[11px] font-bold text-neutral-800 mb-1">
                          State <span className="text-red-500">*</span>
                        </label>
                        <input
                          type="text"
                          value={recipientState}
                          onChange={(e) => {
                            setRecipientState(e.target.value);
                            setStateName(e.target.value);
                          }}
                          placeholder="e.g. Karnataka"
                          className={`w-full text-xs px-3.5 py-2.5 rounded-lg border bg-white transition-colors focus-visible:outline-hidden focus-visible:ring-2 focus-visible:ring-black ${
                            formErrors.stateName ? "border-red-400 bg-red-50/20" : "border-neutral-300"
                          }`}
                        />
                        {formErrors.stateName && (
                          <p className="text-[11px] text-red-600 mt-1">{formErrors.stateName}</p>
                        )}
                      </div>

                      <div>
                        <label className="block text-[11px] font-bold text-neutral-800 mb-1">
                          PIN Code <span className="text-red-500">*</span>
                        </label>
                        <input
                          type="text"
                          maxLength={6}
                          value={recipientPincode}
                          onChange={(e) => {
                            const val = e.target.value.replace(/\D/g, "");
                            setRecipientPincode(val);
                            setPincode(val);
                          }}
                          placeholder="560038"
                          className={`w-full text-xs px-3.5 py-2.5 rounded-lg border bg-white transition-colors focus-visible:outline-hidden focus-visible:ring-2 focus-visible:ring-black font-mono ${
                            formErrors.pincode ? "border-red-400 bg-red-50/20" : "border-neutral-300"
                          }`}
                        />
                        {formErrors.pincode && (
                          <p className="text-[11px] text-red-600 mt-1">{formErrors.pincode}</p>
                        )}
                      </div>
                    </div>

                    <div className="pt-3 border-t border-neutral-200/80 flex items-center justify-between text-[11px] text-neutral-600">
                      <span className="flex items-center gap-1.5">
                        <ShieldCheck size={14} className="text-emerald-600" />
                        <span>Direct doorstep dispatch. Unmarked exterior stealth carton.</span>
                      </span>
                    </div>
                  </div>
                </div>
              ) : addressMode === "saved" ? (
                <div
                  key="saved-panel"
                  id="panel-saved-address"
                  role="tabpanel"
                  aria-labelledby="tab-saved-address"
                  className="animate-tab-panel-enter space-y-4"
                >
                  {savedProfileAddress ? (
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
                      <div className="mt-4 pt-3.5 border-t border-neutral-200/80 flex flex-col sm:flex-row sm:items-center sm:justify-between gap-2.5">
                        <div className="inline-flex items-center gap-1.5 px-3 py-1.5 rounded-lg bg-neutral-950 text-white text-xs font-semibold cursor-default select-none shrink-0 self-start sm:self-auto">
                          <Check size={12} className="stroke-[3]" />
                          <span>Delivering to this Address</span>
                        </div>

                        <div className="grid grid-cols-2 gap-2 sm:flex sm:items-center sm:gap-2 shrink-0">
                          <button
                            type="button"
                            onClick={handleSelectCustomAddress}
                            className="inline-flex items-center justify-center gap-1.5 px-3 py-1.5 rounded-lg border border-neutral-300 hover:border-neutral-900 hover:bg-white text-xs font-semibold text-neutral-800 transition-colors cursor-pointer"
                          >
                            <Plus size={13} className="text-neutral-600" />
                            <span>Different Address</span>
                          </button>

                          <button
                            type="button"
                            onClick={handleDetectLiveLocation}
                            disabled={isLocating}
                            className="inline-flex items-center justify-center gap-1.5 px-3 py-1.5 rounded-lg border border-neutral-300 hover:border-neutral-900 hover:bg-neutral-50 text-xs font-semibold text-neutral-800 transition-all cursor-pointer disabled:opacity-60 disabled:cursor-not-allowed group active:scale-[0.98]"
                          >
                            <Navigation size={13} className="text-neutral-700 transition-transform group-hover:scale-110" />
                            <span>Use Live Location</span>
                          </button>
                        </div>
                      </div>
                    </div>
                  ) : (
                    <div className="rounded-xl border border-dashed border-neutral-300 p-6 text-center bg-neutral-50/50">
                      <div className="w-10 h-10 rounded-full bg-neutral-100 flex items-center justify-center mx-auto mb-2 text-neutral-400">
                        <Lock size={18} />
                      </div>
                      <h3 className="text-xs font-bold text-neutral-900 mb-1">
                        Sign In to Access Saved Addresses
                      </h3>
                      <p className="text-[11px] text-neutral-500 mb-4 max-w-sm mx-auto">
                        Log in to your Veyro account to automatically pull your home address or enter a delivery address below.
                      </p>
                      <div className="flex items-center justify-center gap-2">
                        <button
                          type="button"
                          onClick={openAccountModal}
                          className="px-4 py-2 bg-neutral-900 text-white rounded-lg text-xs font-bold hover:bg-black transition-colors cursor-pointer"
                        >
                          Sign In / Log In
                        </button>
                        <button
                          type="button"
                          onClick={handleSelectCustomAddress}
                          className="px-4 py-2 bg-white border border-neutral-200 text-neutral-700 rounded-lg text-xs font-semibold hover:bg-neutral-50 transition-colors cursor-pointer"
                        >
                          Enter Address Manually
                        </button>
                      </div>
                    </div>
                  )}
                </div>
              ) : (
                /* ── MODE B: CUSTOM / LIVE LOCATION ADDRESS ── */
                <div
                  key="custom-panel"
                  id="panel-custom-address"
                  role="tabpanel"
                  aria-labelledby="tab-custom-address"
                  className="animate-tab-panel-enter space-y-4"
                >
                  {/* Top Bar inside Custom Mode */}
                  <div className="flex flex-wrap items-center justify-between gap-3 p-3 sm:p-3.5 rounded-xl bg-neutral-50/90 border border-neutral-200/90 shadow-2xs">
                    {savedProfileAddress ? (
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
                    ) : (
                      <button
                        type="button"
                        onClick={openAccountModal}
                        className="inline-flex items-center gap-1.5 px-3 py-1.5 rounded-lg text-xs font-semibold text-neutral-700 hover:text-black hover:bg-neutral-200/60 transition-all cursor-pointer group"
                      >
                        <Sparkles size={13} className="text-amber-500" />
                        <span>Have an account? Sign In for saved address</span>
                      </button>
                    )}

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
                          <Loader2 size={13} className="animate-spin text-neutral-300" />
                          <span className="normal-case tracking-normal font-medium text-neutral-200">
                            {locatingStep || "Detecting live location..."}
                          </span>
                        </>
                      ) : (
                        <>
                          <LocateFixed size={13} className="text-neutral-300 transition-transform group-hover:rotate-45" />
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
                            <div className="w-6 h-6 rounded-full border-2 border-neutral-400 border-t-white animate-spin" />
                          </div>
                          <div className="flex-1 min-w-0">
                            <div className="font-semibold text-neutral-100 flex items-center gap-2">
                              <span>Live Telemetry Radar</span>
                              <span className="text-[10px] uppercase font-mono px-1.5 py-0.5 bg-neutral-800 text-neutral-300 rounded border border-neutral-700">
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

            {/* Section 03: Billing Address ([E.6] Requirement) */}
            <section
              id="section-billing-address"
              className="bg-white border border-neutral-200/90 rounded-2xl p-6 sm:p-7 shadow-xs scroll-mt-24"
            >
              <div className="flex items-center justify-between pb-4 border-b border-neutral-100 mb-5">
                <div className="flex items-center gap-3">
                  <span className="w-7 h-7 rounded-full bg-neutral-100 text-neutral-900 text-xs font-bold flex items-center justify-center">
                    03
                  </span>
                  <div>
                    <h2 className="text-sm sm:text-base font-bold text-neutral-950 tracking-tight">
                      Billing Address
                    </h2>
                    <p className="text-[11px] text-neutral-500">
                      Official digital GST tax invoice &amp; payment receipt will be registered to this profile
                    </p>
                  </div>
                </div>
                <div className="flex items-center gap-1 text-[11px] text-emerald-700 font-semibold bg-emerald-50 px-2 py-0.5 rounded-full">
                  <ShieldCheck size={13} />
                  <span>GST Ready</span>
                </div>
              </div>

              {/* Same as Delivery Checkbox Toggle */}
              <div className="space-y-4">
                <label className="flex items-start gap-3 p-4 rounded-xl border border-neutral-200/90 bg-neutral-50/70 hover:bg-neutral-50 cursor-pointer select-none transition-colors">
                  <input
                    type="checkbox"
                    checked={billingSameAsShipping}
                    onChange={(e) => setBillingSameAsShipping(e.target.checked)}
                    className="mt-0.5 w-4 h-4 rounded-sm accent-[#111111] cursor-pointer"
                  />
                  <div className="min-w-0 flex-1">
                    <span className="text-xs font-bold text-neutral-950 block">
                      Billing address is same as delivery address
                    </span>
                    <p className="text-[11px] text-neutral-500 mt-0.5 leading-snug">
                      {giftPackaging.enabled && addressMode === "recipient"
                        ? "Recommended for gifts: Keep unchecked to register the official tax invoice to your name rather than your friend."
                        : "Use the destination address for digital tax invoices and bookkeeping."}
                    </p>
                  </div>
                </label>

                {/* When Unchecked: Choose Saved Profile or Custom Billing Address */}
                {!billingSameAsShipping && (
                  <div className="animate-tab-panel-enter space-y-4 pt-1">
                    <div className="flex items-center gap-2 p-1 bg-neutral-100/90 rounded-xl border border-neutral-200/70 select-none">
                      <button
                        type="button"
                        onClick={() => setBillingMode("profile")}
                        className={`flex-1 flex items-center justify-center gap-1.5 py-2 px-3 rounded-lg text-xs font-semibold transition-colors duration-200 cursor-pointer ${
                          billingMode === "profile"
                            ? "bg-white text-neutral-950 font-bold shadow-xs"
                            : "text-neutral-500 hover:text-neutral-800"
                        }`}
                      >
                        <Home size={13} />
                        <span>My Account Profile ({user?.name || giftPackaging.senderName || savedProfileAddress?.name || "Customer"})</span>
                      </button>
                      <button
                        type="button"
                        onClick={() => setBillingMode("custom")}
                        className={`flex-1 flex items-center justify-center gap-1.5 py-2 px-3 rounded-lg text-xs font-semibold transition-colors duration-200 cursor-pointer ${
                          billingMode === "custom"
                            ? "bg-white text-neutral-950 font-bold shadow-xs"
                            : "text-neutral-500 hover:text-neutral-800"
                        }`}
                      >
                        <Pencil size={13} />
                        <span>Different Billing Address</span>
                      </button>
                    </div>

                    {billingMode === "profile" ? (
                      <div className="rounded-xl border-2 border-neutral-900 bg-neutral-50/70 p-4 sm:p-5">
                        <div className="flex items-center justify-between mb-2">
                          <span className="text-xs font-bold text-neutral-900 flex items-center gap-1.5">
                            <ShieldCheck size={14} className="text-neutral-900" />
                            Official Billing &amp; Tax Invoice Destination
                          </span>
                          <span className="text-[10px] font-bold text-emerald-800 bg-emerald-100 px-2.5 py-0.5 rounded-full">
                            Buyer Account
                          </span>
                        </div>
                        <p className="text-sm font-bold text-neutral-950">{billingFullName}</p>
                        <p className="text-xs text-neutral-600 mt-1">{billingStreetAddress}</p>
                        <p className="text-xs text-neutral-600">{billingCity}, {billingStateName} - {billingPincode}</p>
                        <p className="text-[11px] text-neutral-500 mt-2 font-mono">Contact: {billingPhone}</p>
                      </div>
                    ) : (
                      /* Custom Billing Form Fields */
                      <div className="grid grid-cols-1 sm:grid-cols-2 gap-3.5 bg-neutral-50/50 p-4 rounded-xl border border-neutral-200/80">
                        <div>
                          <label className="block text-[11px] font-bold text-neutral-700 mb-1">
                            Billing Contact Name *
                          </label>
                          <input
                            type="text"
                            value={billingFullName}
                            onChange={(e) => setBillingFullName(e.target.value)}
                            placeholder="Full name or company name"
                            className="w-full text-xs bg-white rounded-lg px-3 py-2 border border-neutral-300 focus-visible:outline-hidden focus-visible:ring-1 focus-visible:ring-black"
                          />
                          {formErrors.billingFullName && (
                            <p className="text-[11px] text-red-600 mt-1">{formErrors.billingFullName}</p>
                          )}
                        </div>
                        <div>
                          <label className="block text-[11px] font-bold text-neutral-700 mb-1">
                            Billing Mobile Number *
                          </label>
                          <input
                            type="tel"
                            maxLength={10}
                            value={billingPhone}
                            onChange={(e) => setBillingPhone(e.target.value.replace(/\D/g, ""))}
                            placeholder="10-digit mobile number"
                            className="w-full text-xs bg-white rounded-lg px-3 py-2 border border-neutral-300 focus-visible:outline-hidden focus-visible:ring-1 focus-visible:ring-black"
                          />
                        </div>
                        <div className="sm:col-span-2">
                          <label className="block text-[11px] font-bold text-neutral-700 mb-1">
                            Billing Street Address *
                          </label>
                          <input
                            type="text"
                            value={billingStreetAddress}
                            onChange={(e) => setBillingStreetAddress(e.target.value)}
                            placeholder="Building, Street, Locality"
                            className="w-full text-xs bg-white rounded-lg px-3 py-2 border border-neutral-300 focus-visible:outline-hidden focus-visible:ring-1 focus-visible:ring-black"
                          />
                          {formErrors.billingStreetAddress && (
                            <p className="text-[11px] text-red-600 mt-1">{formErrors.billingStreetAddress}</p>
                          )}
                        </div>
                        <div>
                          <label className="block text-[11px] font-bold text-neutral-700 mb-1">
                            City *
                          </label>
                          <input
                            type="text"
                            value={billingCity}
                            onChange={(e) => setBillingCity(e.target.value)}
                            placeholder="City"
                            className="w-full text-xs bg-white rounded-lg px-3 py-2 border border-neutral-300 focus-visible:outline-hidden focus-visible:ring-1 focus-visible:ring-black"
                          />
                          {formErrors.billingCity && (
                            <p className="text-[11px] text-red-600 mt-1">{formErrors.billingCity}</p>
                          )}
                        </div>
                        <div>
                          <label className="block text-[11px] font-bold text-neutral-700 mb-1">
                            PIN Code *
                          </label>
                          <input
                            type="text"
                            maxLength={6}
                            value={billingPincode}
                            onChange={(e) => setBillingPincode(e.target.value.replace(/\D/g, ""))}
                            placeholder="6-digit PIN"
                            className="w-full text-xs bg-white rounded-lg px-3 py-2 border border-neutral-300 focus-visible:outline-hidden focus-visible:ring-1 focus-visible:ring-black font-mono"
                          />
                          {formErrors.billingPincode && (
                            <p className="text-[11px] text-red-600 mt-1">{formErrors.billingPincode}</p>
                          )}
                        </div>
                      </div>
                    )}
                  </div>
                )}
              </div>
            </section>

            {/* Section 04: Payment Method */}
            <section ref={paymentSectionRef} className="bg-white border border-neutral-200/90 rounded-2xl p-6 sm:p-7 shadow-xs">
              <div className="flex items-center justify-between pb-4 border-b border-neutral-100 mb-5">
                <div className="flex items-center gap-3">
                  <span className="w-7 h-7 rounded-full bg-neutral-100 text-neutral-900 text-xs font-bold flex items-center justify-center">
                    04
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
                      
                      {/* Top Header: Authentic UPI Identity & Clean Editorial Amount Display */}
                      <div className="flex items-center justify-between w-full pb-3.5 mb-4 border-b border-neutral-200/70 flex-wrap gap-2">
                        <div className="flex items-center gap-2.5">
                          {/* Official NPCI UPI Emblem Badge */}
                          <div className="h-8 px-2.5 rounded-lg bg-neutral-50 border border-neutral-200/90 flex items-center justify-center shadow-2xs">
                            <UpiOfficialLogo className="w-9 h-3 shrink-0" />
                          </div>
                          <div>
                            <span className="text-xs font-bold text-neutral-900 tracking-tight">
                              Scan &amp; Pay via UPI
                            </span>
                            <p className="text-[11px] text-neutral-500 font-normal">
                              Scan using any UPI app to pay
                            </p>
                          </div>
                        </div>

                        {/* Clean Editorial Amount Display */}
                        <div className="text-right">
                          <span className="block text-[10px] text-neutral-400 uppercase tracking-wider font-semibold">To Pay</span>
                          <span className="text-sm font-bold text-neutral-900 tracking-tight">{formatPrice(grandTotal)}</span>
                        </div>
                      </div>

                      {/* Luxury QR Viewport Frame with Optical Scanner & Viewfinder Reticles */}
                      <div className="relative w-52 h-52 bg-white rounded-2xl p-3 border border-neutral-200/90 shadow-sm flex items-center justify-center overflow-hidden">
                        {/* 4 Optical Corner Viewfinder Brackets */}
                        <div className="absolute top-2.5 left-2.5 w-4 h-4 border-t-2 border-l-2 border-neutral-900 rounded-tl-sm pointer-events-none" />
                        <div className="absolute top-2.5 right-2.5 w-4 h-4 border-t-2 border-r-2 border-neutral-900 rounded-tr-sm pointer-events-none" />
                        <div className="absolute bottom-2.5 left-2.5 w-4 h-4 border-b-2 border-l-2 border-neutral-900 rounded-bl-sm pointer-events-none" />
                        <div className="absolute bottom-2.5 right-2.5 w-4 h-4 border-b-2 border-r-2 border-neutral-900 rounded-br-sm pointer-events-none" />

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
                            {/* UPI Logo in Center - Mathematically Centered at (22.5, 22.5) */}
                            <g transform="translate(16.74, 18.18) scale(0.36)">
                              <path d="M14.5 4.5L20.5 12L14.5 19.5H19L25 12L19 4.5H14.5Z" fill="#00823E" />
                              <path d="M7 4.5L13 12L7 19.5H11.5L17.5 12L11.5 4.5H7Z" fill="#FF7300" />
                            </g>
                          </svg>
                        </div>

                        {/* High-Precision Optical Laser Scanner Ray */}
                        <div
                          aria-hidden="true"
                          className="absolute inset-x-3 top-3 pointer-events-none z-20 animate-qr-optical-sweep flex flex-col items-center"
                        >
                          <div className="qr-laser-halo" />
                          <div className="qr-laser-beam" />
                        </div>
                      </div>

                      {/* Clean Professional Instructions & Expiry Countdown */}
                      <div className="mt-3.5 text-center flex flex-col items-center gap-1.5">
                        <div className="text-[13px] font-semibold text-neutral-900 tracking-tight">
                          Scan with any UPI app to pay
                        </div>
                        <div className="inline-flex items-center gap-1.5 px-2.5 py-0.5 rounded-full bg-neutral-100/90 border border-neutral-200/80 text-[11px] font-medium text-neutral-600">
                          <Clock className="w-3 h-3 text-neutral-400 shrink-0" aria-hidden="true" />
                          <span>Code expires in</span>
                          <span className="font-mono font-bold text-neutral-900">{formatUpiTime(upiCountdown)}</span>
                        </div>
                      </div>

                      {/* Official UPI Ecosystem Badges with Real Brand Vector Logos */}
                      <div className="flex items-center justify-center gap-2 mt-3 pt-3 border-t border-neutral-100 w-full flex-wrap">
                        {/* 1. Google Pay */}
                        <button
                          type="button"
                          onClick={() => {
                            setUpiId((prev) => {
                              const username = prev.split("@")[0];
                              return username ? `${username}@okhdfcbank` : "@okhdfcbank";
                            });
                          }}
                          title="Click to use Google Pay (@okhdfcbank)"
                          className="inline-flex items-center gap-1.5 px-2.5 py-1.5 rounded-lg bg-white hover:bg-neutral-50/90 border border-neutral-200/90 shadow-2xs hover:shadow-xs text-[11px] font-semibold text-neutral-800 transition-all hover:-translate-y-0.5 cursor-pointer active:scale-95 select-none"
                        >
                          <svg viewBox="0 0 24 24" className="w-3.5 h-3.5 shrink-0" aria-hidden="true">
                            <path fill="#4285F4" d="M23.745 12.27c0-.7-.06-1.4-.19-2.07H12v4.51h6.6c-.29 1.52-1.14 2.82-2.4 3.68v3.05h3.88c2.27-2.09 3.665-5.17 3.665-9.17z" />
                            <path fill="#34A853" d="M12 24c3.24 0 5.95-1.08 7.93-2.91l-3.88-3.05c-1.08.72-2.45 1.16-4.05 1.16-3.12 0-5.77-2.1-6.72-4.93H1.25v3.15C3.26 21.36 7.33 24 12 24z" />
                            <path fill="#FBBC05" d="M5.28 14.27c-.25-.72-.38-1.49-.38-2.27s.13-1.55.38-2.27V6.58H1.25C.45 8.18 0 9.98 0 12s.45 3.82 1.25 5.42l4.03-3.15z" />
                            <path fill="#EA4335" d="M12 4.75c1.77 0 3.35.61 4.6 1.8l3.42-3.42C17.95 1.19 15.24 0 12 0 7.33 0 3.26 2.64 1.25 6.58l4.03 3.15c.95-2.83 3.6-4.98 6.72-4.98z" />
                          </svg>
                          <span>Google Pay</span>
                        </button>

                        {/* 2. PhonePe */}
                        <button
                          type="button"
                          onClick={() => {
                            setUpiId((prev) => {
                              const username = prev.split("@")[0];
                              return username ? `${username}@ybl` : "@ybl";
                            });
                          }}
                          title="Click to use PhonePe (@ybl)"
                          className="inline-flex items-center gap-1.5 px-2.5 py-1.5 rounded-lg bg-white hover:bg-neutral-50/90 border border-neutral-200/90 shadow-2xs hover:shadow-xs text-[11px] font-semibold text-neutral-800 transition-all hover:-translate-y-0.5 cursor-pointer active:scale-95 select-none"
                        >
                          <span className="w-4 h-4 rounded-full bg-[#5f259f] flex items-center justify-center shrink-0">
                            <svg viewBox="18 12 32 34" className="w-3 h-3" aria-hidden="true">
                              <path d="m 48.431347,27.0768 c 0,-1.168224 -1.001334,-2.169558 -2.169557,-2.169558 h -4.005338 l -9.1789,-10.514013 c -0.834446,-1.001335 -2.169559,-1.335113 -3.504671,-1.001335 l -3.170893,1.001335 c -0.500667,0.166889 -0.667556,0.834445 -0.333778,1.168223 l 10.013345,9.512679 H 20.894648 c -0.500667,0 -0.834445,0.333778 -0.834445,0.834445 v 1.668891 c 0,1.168224 1.001334,2.169558 2.169558,2.169558 h 2.336448 v 8.010676 c 0,6.008008 3.170892,9.512678 8.511343,9.512678 1.668891,0 3.004003,-0.166889 4.672894,-0.834445 v 5.340451 c 0,1.502002 1.168224,2.670225 2.670225,2.670225 h 2.336448 c 0.500667,0 1.001335,-0.500667 1.001335,-1.001334 v -23.86514 h 3.838448 c 0.500667,0 0.834445,-0.333778 0.834445,-0.834445 z M 37.750446,41.429261 c -1.001334,0.500668 -2.336447,0.667557 -3.337781,0.667557 -2.670226,0 -4.005339,-1.335114 -4.005339,-4.339117 v -8.010676 h 7.34312 z" fill="#ffffff" />
                            </svg>
                          </span>
                          <span>PhonePe</span>
                        </button>

                        {/* 3. Paytm */}
                        <button
                          type="button"
                          onClick={() => {
                            setUpiId((prev) => {
                              const username = prev.split("@")[0];
                              return username ? `${username}@paytm` : "@paytm";
                            });
                          }}
                          title="Click to use Paytm (@paytm)"
                          className="inline-flex items-center gap-1.5 px-2.5 py-1.5 rounded-lg bg-white hover:bg-neutral-50/90 border border-neutral-200/90 shadow-2xs hover:shadow-xs text-[11px] font-semibold text-neutral-800 transition-all hover:-translate-y-0.5 cursor-pointer active:scale-95 select-none"
                        >
                          <span className="w-5 h-3.5 bg-[#002970] rounded-[3px] flex items-center justify-center shrink-0 px-0.5">
                            <svg viewBox="0 0 16.837998 5.2849998" className="w-4 h-[5px]" aria-hidden="true">
                              <g transform="matrix(0.35277777,0,0,-0.35277777,16.777056,1.5610286)">
                                <path fill="#00BAF2" d="M 0,0 C -0.433,1.238 -1.613,2.127 -2.999,2.127 H -3.028 C -3.929,2.127 -4.741,1.752 -5.319,1.15 -5.898,1.752 -6.71,2.127 -7.61,2.127 h -0.029 c -0.792,0 -1.516,-0.29 -2.072,-0.77 V 1.601 C -9.73,1.844 -9.93,2.035 -10.177,2.035 h -2.126 c -0.26,0 -0.47,-0.21 -0.47,-0.471 V -9.981 c 0,-0.261 0.21,-0.471 0.47,-0.471 h 2.126 c 0.237,0 0.432,0.177 0.463,0.406 l -10e-4,8.288 c 0,0.029 10e-4,0.056 0.004,0.083 0.034,0.37 0.305,0.674 0.733,0.712 h 0.079 0.223 0.09 c 0.179,-0.016 0.33,-0.079 0.449,-0.174 0.185,-0.147 0.288,-0.373 0.288,-0.621 l 0.008,-8.247 c 0,-0.261 0.211,-0.472 0.47,-0.472 h 2.126 c 0.251,0 0.455,0.2 0.467,0.449 l -0.001,8.281 c -0.001,0.272 0.125,0.518 0.346,0.664 0.109,0.07 0.24,0.117 0.391,0.131 h 0.079 0.223 0.09 c 0.46,-0.04 0.738,-0.389 0.737,-0.795 l 0.008,-8.236 c 0,-0.261 0.211,-0.471 0.47,-0.471 h 2.126 c 0.259,0 0.47,0.21 0.47,0.471 v 8.858 C 0.161,-0.521 0.093,-0.264 0,0" />
                              </g>
                              <g transform="matrix(0.35277777,0,0,-0.35277777,11.699676,0.85374862)">
                                <path fill="#00BAF2" d="m 0,0 h -1.216 v 1.97 0 c 0,0.002 0,0.004 0,0.006 0,0.237 -0.192,0.429 -0.429,0.429 C -1.673,2.405 -1.7,2.401 -1.726,2.396 -3.074,2.026 -2.804,0.159 -5.265,0 H -5.32 -5.504 c -0.036,0 -0.07,-0.005 -0.103,-0.012 h -0.002 l 0.002,-10e-4 C -5.817,-0.06 -5.975,-0.246 -5.975,-0.47 v -2.126 c 0,-0.259 0.211,-0.47 0.471,-0.47 h 1.283 l -0.002,-9.015 c 0,-0.257 0.208,-0.465 0.465,-0.465 h 2.102 c 0.256,0 0.464,0.208 0.464,0.465 l 10e-4,9.015 H 0 c 0.259,0 0.47,0.211 0.47,0.47 V -0.47 C 0.47,-0.211 0.259,0 0,0" />
                              </g>
                              <g transform="matrix(0.35277777,0,0,-0.35277777,9.0012361,0.85374862)">
                                <path fill="#ffffff" d="M 0,0 H -2.126 C -2.385,0 -2.595,-0.211 -2.595,-0.47 V -4.866 C -2.6,-5.138 -2.82,-5.356 -3.093,-5.356 h -0.89 c -0.276,0 -0.499,0.222 -0.499,0.498 L -4.49,-0.47 C -4.49,-0.211 -4.701,0 -4.96,0 h -2.126 c -0.26,0 -0.47,-0.211 -0.47,-0.47 v -4.818 c 0,-1.83 1.305,-3.135 3.136,-3.135 0,0 1.374,0 1.416,-0.008 0.248,-0.028 0.441,-0.236 0.441,-0.492 0,-0.253 -0.189,-0.46 -0.434,-0.491 -0.012,-0.002 -0.023,-0.005 -0.036,-0.007 l -3.109,-0.011 c -0.26,0 -0.47,-0.211 -0.47,-0.47 v -2.125 c 0,-0.26 0.21,-0.47 0.47,-0.47 h 3.476 c 1.832,0 3.136,1.304 3.136,3.135 V -0.47 C 0.47,-0.211 0.26,0 0,0" />
                              </g>
                              <g transform="matrix(0.35277777,0,0,-0.35277777,1.7417071,2.2279886)">
                                <path fill="#ffffff" d="m 0,0 v -0.992 -0.32 c 0,-0.275 -0.223,-0.499 -0.498,-0.499 l -1.349,-0.001 v 2.629 h 1.349 C -0.223,0.817 0,0.595 0,0.319 Z M 0.187,3.896 H -4.46 c -0.255,0 -0.461,-0.207 -0.461,-0.461 V 1.352 c 0,-0.004 0.001,-0.008 0.001,-0.012 0,-0.01 -0.001,-0.02 -0.001,-0.029 V -5.37 -8.117 c 0,-0.256 0.192,-0.465 0.43,-0.471 h 0.04 2.126 c 0.259,0 0.47,0.21 0.47,0.47 l 0.008,3.231 h 2.034 c 1.702,0 2.888,1.181 2.888,2.89 v 2.999 c 0,1.709 -1.186,2.894 -2.888,2.894" />
                              </g>
                              <g transform="matrix(0.35277777,0,0,-0.35277777,4.8535941,3.9887686)">
                                <path fill="#ffffff" d="M 0,0 V -0.332 C 0,-0.359 -0.004,-0.385 -0.008,-0.41 -0.013,-0.434 -0.02,-0.457 -0.028,-0.479 -0.094,-0.665 -0.28,-0.8 -0.501,-0.8 h -0.885 c -0.276,0 -0.501,0.21 -0.501,0.468 v 0.401 c 0,0.005 -10e-4,0.01 -10e-4,0.015 l 10e-4,1.067 v 0.002 0.118 0.214 l 0.001,0.003 c 10e-4,0.257 0.224,0.465 0.5,0.465 h 0.885 C -0.224,1.953 0,1.744 0,1.485 Z m -0.338,8.875 h -2.95 C -3.549,8.875 -3.76,8.677 -3.76,8.434 V 7.607 c 0,-0.005 10e-4,-0.011 10e-4,-0.016 0,-0.006 -10e-4,-0.012 -10e-4,-0.018 V 6.44 c 0,-0.257 0.224,-0.467 0.5,-0.467 h 2.809 c 0.222,-0.035 0.398,-0.197 0.423,-0.45 V 5.249 C -0.053,5.008 -0.227,4.832 -0.439,4.812 H -1.83 c -1.85,0 -3.168,-1.229 -3.168,-2.955 v -2.409 -0.063 c 0,-1.716 1.133,-2.937 2.97,-2.937 h 3.855 c 0.692,0 1.253,0.524 1.253,1.169 v 8.067 c 0,1.956 -1.008,3.191 -3.418,3.191" />
                              </g>
                            </svg>
                          </span>
                          <span>Paytm</span>
                        </button>

                        {/* 4. BHIM UPI */}
                        <button
                          type="button"
                          onClick={() => {
                            setUpiId((prev) => {
                              const username = prev.split("@")[0];
                              return username ? `${username}@upi` : "@upi";
                            });
                          }}
                          title="Click to use BHIM UPI (@upi)"
                          className="inline-flex items-center gap-1.5 px-2.5 py-1.5 rounded-lg bg-white hover:bg-neutral-50/90 border border-neutral-200/90 shadow-2xs hover:shadow-xs text-[11px] font-semibold text-neutral-800 transition-all hover:-translate-y-0.5 cursor-pointer active:scale-95 select-none"
                        >
                          <UpiOfficialLogo className="w-7 h-2.5 shrink-0" />
                          <span>BHIM UPI</span>
                        </button>

                        {/* 5. CRED */}
                        <button
                          type="button"
                          onClick={() => {
                            setUpiId((prev) => {
                              const username = prev.split("@")[0];
                              return username ? `${username}@cred` : "@cred";
                            });
                          }}
                          title="Click to use CRED (@cred)"
                          className="inline-flex items-center gap-1.5 px-2.5 py-1.5 rounded-lg bg-white hover:bg-neutral-50/90 border border-neutral-200/90 shadow-2xs hover:shadow-xs text-[11px] font-semibold text-neutral-800 transition-all hover:-translate-y-0.5 cursor-pointer active:scale-95 select-none"
                        >
                          <span className="w-4 h-4 bg-black rounded-[4px] flex items-center justify-center shrink-0">
                            <svg viewBox="0 0 24 24" className="w-2.5 h-2.5" aria-hidden="true">
                              <path d="M4 3h16v11a8 8 0 0 1-16 0V3z" fill="none" stroke="#ffffff" strokeWidth="2.2" strokeLinecap="round" strokeLinejoin="round" />
                              <path d="M8.5 7.5h7v5.5a3.5 3.5 0 0 1-7 0V7.5z" fill="none" stroke="#ffffff" strokeWidth="2.2" strokeLinecap="round" strokeLinejoin="round" />
                            </svg>
                          </span>
                          <span>CRED</span>
                        </button>
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
                      {giftPackaging.enabled && addressMode === "recipient" ? (
                        <span className="inline-flex items-center gap-1.5 px-2.5 py-0.5 rounded-full text-[10px] font-semibold bg-neutral-900 text-white">
                          <Gift size={11} className="text-amber-300" />
                          Friend&apos;s Doorstep ({recipientFullName || "Recipient"})
                        </span>
                      ) : addressMode === "saved" ? (
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
                        if (sec) {
                          sec.scrollIntoView({ behavior: "smooth", block: "start" });
                          sec.classList.add("ring-2", "ring-neutral-900", "transition-all", "duration-500");
                          setTimeout(() => {
                            sec.classList.remove("ring-2", "ring-neutral-900");
                          }, 1600);
                        }
                      }}
                      className="group relative inline-flex items-center gap-1.5 px-3 py-1.5 rounded-lg bg-white hover:bg-neutral-950 text-neutral-800 hover:text-white border border-neutral-300 hover:border-neutral-950 shadow-2xs hover:shadow-md transition-all duration-300 cursor-pointer overflow-hidden active:scale-95 shrink-0"
                      aria-label="Change delivery address"
                    >
                      {/* Ambient Sheen Sweep Micro-Animation */}
                      <span className="absolute inset-0 w-full h-full bg-gradient-to-r from-transparent via-white/50 to-transparent pointer-events-none animate-change-sheen" />

                      {/* Hover Sheen Light Ray */}
                      <span className="absolute inset-0 -translate-x-full group-hover:translate-x-full bg-gradient-to-r from-transparent via-white/20 to-transparent transition-transform duration-700 ease-out pointer-events-none" />

                      {/* Animated Edit Pencil */}
                      <Pencil
                        size={11}
                        className="transition-transform duration-300 group-hover:scale-110 group-hover:-rotate-12 text-neutral-500 group-hover:text-emerald-400"
                      />
                      <span className="text-xs font-bold tracking-tight">Change</span>
                      <ArrowUpRight
                        size={12}
                        className="transition-transform duration-300 group-hover:-translate-y-0.5 group-hover:translate-x-0.5 text-neutral-400 group-hover:text-white"
                      />
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
                  className="group relative w-full bg-gradient-to-r from-neutral-950 via-neutral-900 to-neutral-950 text-white hover:from-black hover:to-neutral-900 py-4.5 px-6 rounded-2xl text-xs sm:text-sm font-bold uppercase tracking-wider flex items-center justify-center gap-3 transition-all duration-300 cursor-pointer shadow-lg hover:shadow-2xl hover:scale-[1.01] active:scale-[0.985] disabled:opacity-50 disabled:cursor-not-allowed disabled:hover:scale-100 overflow-hidden border border-neutral-800/80 hover:border-neutral-700 focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-black focus-visible:ring-offset-2"
                >
                  {/* Ambient Periodic Sheen Light Wave (Every 3.2s) */}
                  {!isSubmitting && (
                    <span className="absolute inset-0 w-full h-full bg-gradient-to-r from-transparent via-white/12 to-transparent pointer-events-none animate-order-sheen" />
                  )}

                  {/* High-speed Hover Light Ray Sweep */}
                  {!isSubmitting && (
                    <span className="absolute inset-0 -translate-x-full group-hover:translate-x-full bg-gradient-to-r from-transparent via-white/20 to-transparent transition-transform duration-700 ease-out pointer-events-none" />
                  )}

                  {/* Subtle Bottom Emerald Glow Line on Hover */}
                  <span className="absolute bottom-0 inset-x-8 h-[1.5px] bg-gradient-to-r from-transparent via-emerald-400/70 to-transparent opacity-0 group-hover:opacity-100 transition-opacity duration-300 pointer-events-none" />

                  {isSubmitting ? (
                    <>
                      <div className="w-4 h-4 border-2 border-white border-t-transparent rounded-full animate-spin" />
                      <span className="tracking-widest">Securing Order & Payment...</span>
                    </>
                  ) : paymentStatus === "failed" ? (
                    <>
                      <RotateCcw size={16} className="text-amber-400 animate-spin" />
                      <span>Retry Payment • {formatPrice(grandTotal)}</span>
                    </>
                  ) : (
                    <>
                      <Lock
                        size={15}
                        className="transition-transform duration-300 group-hover:scale-110 text-neutral-400 group-hover:text-emerald-400 shrink-0"
                      />
                      <span className="tracking-wider">Place Order • {formatPrice(grandTotal)}</span>
                      <ArrowRight
                        size={16}
                        className="transition-transform duration-300 group-hover:translate-x-1.5 text-neutral-300 group-hover:text-white shrink-0"
                      />
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
                <div
                  tabIndex={0}
                  role="region"
                  aria-label="Order items summary"
                  className="max-h-72 sm:max-h-80 overflow-y-auto overscroll-contain divide-y divide-neutral-100 pr-2.5 space-y-3 luxury-visible-scrollbar focus-visible:outline-none focus-visible:ring-1 focus-visible:ring-neutral-300 rounded-lg"
                >
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
                      <span>
                        {giftPackaging.enabled && addressMode === "recipient"
                          ? `Friend&apos;s Doorstep (${recipientFullName || "Recipient"})`
                          : "Delivery Destination"}
                      </span>
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

                  {giftPackaging.enabled && (
                    <div className="flex justify-between text-neutral-800 font-medium">
                      <span className="flex items-center gap-1.5">
                        <Gift size={13} className="text-slate-400 shrink-0" />
                        <span>Signature Gift Packaging</span>
                      </span>
                      <span className="font-mono font-semibold">+{formatPrice(giftPackagingFee)}</span>
                    </div>
                  )}

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

      {/* LUXURY ORDER CONFIRMATION TRANSITION OVERLAY */}
      {(orderPlacedRef.current || paymentStatus === "success") && (
        <div className="fixed inset-0 z-50 bg-black/40 backdrop-blur-md flex items-center justify-center p-4">
          <motion.div
            initial={{ opacity: 0, scale: 0.96 }}
            animate={{ opacity: 1, scale: 1 }}
            transition={{ duration: 0.4, ease: [0.16, 1, 0.3, 1] }}
            className="bg-white rounded-2xl p-8 max-w-sm w-full text-center shadow-2xl border border-neutral-100 space-y-4"
          >
            <div className="w-14 h-14 bg-emerald-50 text-emerald-600 rounded-full flex items-center justify-center mx-auto border border-emerald-100 animate-pulse">
              <CheckCircle2 size={32} />
            </div>
            <div>
              <h3 className="text-base font-bold text-neutral-900">Payment Verified</h3>
              <p className="text-xs text-neutral-500 font-mono mt-1">Opening your order confirmation...</p>
            </div>
          </motion.div>
        </div>
      )}
    </div>
  );
}
