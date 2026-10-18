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

              {/* Payment Tabs */}
              <div className="grid grid-cols-3 gap-2.5 mb-5">
                <button
                  type="button"
                  onClick={() => {
                    setPaymentMethod("upi");
                    if (paymentStatus === "failed") setPaymentStatus("idle");
                  }}
                  className={`flex flex-col items-center justify-center p-3 sm:p-4 rounded-xl border-2 transition-all cursor-pointer ${
                    paymentMethod === "upi"
                      ? "border-neutral-900 bg-neutral-950 text-white shadow-xs"
                      : "border-neutral-200 bg-white text-neutral-700 hover:border-neutral-300"
                  }`}
                >
                  <Smartphone size={20} className="mb-1.5 shrink-0" />
                  <span className="text-xs font-bold">Instant UPI</span>
                  <span className={`text-[10px] ${paymentMethod === "upi" ? "text-neutral-300" : "text-neutral-400"}`}>
                    GPay / PhonePe
                  </span>
                </button>

                <button
                  type="button"
                  onClick={() => {
                    setPaymentMethod("card");
                    if (paymentStatus === "failed") setPaymentStatus("idle");
                  }}
                  className={`flex flex-col items-center justify-center p-3 sm:p-4 rounded-xl border-2 transition-all cursor-pointer ${
                    paymentMethod === "card"
                      ? "border-neutral-900 bg-neutral-950 text-white shadow-xs"
                      : "border-neutral-200 bg-white text-neutral-700 hover:border-neutral-300"
                  }`}
                >
                  <CreditCard size={20} className="mb-1.5 shrink-0" />
                  <span className="text-xs font-bold">Cards</span>
                  <span className={`text-[10px] ${paymentMethod === "card" ? "text-neutral-300" : "text-neutral-400"}`}>
                    Credit / Debit
                  </span>
                </button>

                <button
                  type="button"
                  onClick={() => {
                    setPaymentMethod("cod");
                    if (paymentStatus === "failed") setPaymentStatus("idle");
                  }}
                  className={`flex flex-col items-center justify-center p-3 sm:p-4 rounded-xl border-2 transition-all cursor-pointer ${
                    paymentMethod === "cod"
                      ? "border-neutral-900 bg-neutral-950 text-white shadow-xs"
                      : "border-neutral-200 bg-white text-neutral-700 hover:border-neutral-300"
                  }`}
                >
                  <Banknote size={20} className="mb-1.5 shrink-0" />
                  <span className="text-xs font-bold">Cash on Delivery</span>
                  <span className={`text-[10px] ${paymentMethod === "cod" ? "text-neutral-300" : "text-neutral-400"}`}>
                    Doorstep Pay
                  </span>
                </button>
              </div>

              {/* Dynamic Payment Body */}
              <div className="bg-neutral-50/80 border border-neutral-200/80 rounded-xl p-5">
                {paymentMethod === "upi" && (
                  <div className="space-y-4">
                    <div className="flex items-center justify-between text-xs pb-3 border-b border-neutral-200/80">
                      <span className="font-semibold text-neutral-800">
                        Scan with any UPI App or Enter Virtual Payment Address (VPA)
                      </span>
                      <span className="text-[10px] font-mono font-bold bg-neutral-200/70 text-neutral-800 px-2 py-0.5 rounded">
                        0% Surcharge
                      </span>
                    </div>

                    <div className="grid grid-cols-1 sm:grid-cols-2 gap-4 items-center">
                      <div className="space-y-2">
                        <label className="block text-xs font-semibold text-neutral-700">
                          Enter UPI ID
                        </label>
                        <div className="relative">
                          <input
                            type="text"
                            value={upiId}
                            onChange={(e) => {
                              setUpiId(e.target.value);
                              if (paymentStatus === "failed") setPaymentStatus("idle");
                            }}
                            placeholder="username@okhdfcbank"
                            className="w-full text-xs font-mono px-3.5 py-2.5 rounded-lg border border-neutral-300 bg-white focus-visible:outline-hidden focus-visible:ring-2 focus-visible:ring-black"
                          />
                        </div>
                        <div className="flex gap-2 text-[10px] text-neutral-500">
                          <span className="bg-white border border-neutral-200 px-2 py-0.5 rounded">@paytm</span>
                          <span className="bg-white border border-neutral-200 px-2 py-0.5 rounded">@oksbi</span>
                          <span className="bg-white border border-neutral-200 px-2 py-0.5 rounded">@ybl</span>
                        </div>
                      </div>

                      <div className="bg-white border border-neutral-200/90 rounded-2xl p-4 sm:p-5 text-center shadow-xs flex flex-col items-center justify-center relative overflow-hidden group">
                        {/* Top Header Badge */}
                        <div className="flex items-center justify-between w-full pb-3 mb-3 border-b border-neutral-100">
                          <div className="flex items-center gap-1.5 text-xs font-bold text-neutral-900">
                            <span className="relative flex h-2 w-2">
                              <span className="animate-ping absolute inline-flex h-full w-full rounded-full bg-emerald-400 opacity-75" />
                              <span className="relative inline-flex rounded-full h-2 w-2 bg-emerald-500" />
                            </span>
                            <span>Scan to Pay via UPI</span>
                          </div>
                          <span className="text-[10px] font-mono font-bold bg-emerald-50 text-emerald-800 border border-emerald-200/80 px-2 py-0.5 rounded-full">
                            Instant Approval
                          </span>
                        </div>

                        {/* Luxury QR Viewport Frame */}
                        <div className="relative w-36 h-36 bg-white rounded-xl p-2.5 border border-neutral-200/80 shadow-xs flex items-center justify-center overflow-hidden">
                          {/* Authentic High-Resolution SVG QR Code */}
                          <svg
                            viewBox="0 0 100 100"
                            className="w-full h-full select-none"
                            shapeRendering="crispEdges"
                            aria-label="Simulated dynamic UPI QR code"
                          >
                            {/* Background */}
                            <rect width="100" height="100" fill="#ffffff" />

                            {/* Top-Left Finder Eye (7x7 modules) */}
                            <rect x="4" y="4" width="24" height="24" rx="3" fill="#0f172a" />
                            <rect x="7" y="7" width="18" height="18" rx="2" fill="#ffffff" />
                            <rect x="10" y="10" width="12" height="12" rx="1.5" fill="#0f172a" />

                            {/* Top-Right Finder Eye */}
                            <rect x="72" y="4" width="24" height="24" rx="3" fill="#0f172a" />
                            <rect x="75" y="7" width="18" height="18" rx="2" fill="#ffffff" />
                            <rect x="78" y="10" width="12" height="12" rx="1.5" fill="#0f172a" />

                            {/* Bottom-Left Finder Eye */}
                            <rect x="4" y="72" width="24" height="24" rx="3" fill="#0f172a" />
                            <rect x="7" y="75" width="18" height="18" rx="2" fill="#ffffff" />
                            <rect x="10" y="78" width="12" height="12" rx="1.5" fill="#0f172a" />

                            {/* Alignment Pattern (Bottom-Right) */}
                            <rect x="70" y="70" width="16" height="16" rx="2" fill="#0f172a" />
                            <rect x="73" y="73" width="10" height="10" rx="1" fill="#ffffff" />
                            <rect x="76" y="76" width="4" height="4" rx="0.5" fill="#0f172a" />

                            {/* Timing Pattern Lines */}
                            {/* Horizontal Timing Pattern */}
                            <rect x="31" y="14" width="3" height="3" fill="#0f172a" />
                            <rect x="37" y="14" width="3" height="3" fill="#0f172a" />
                            <rect x="43" y="14" width="3" height="3" fill="#0f172a" />
                            <rect x="49" y="14" width="3" height="3" fill="#0f172a" />
                            <rect x="55" y="14" width="3" height="3" fill="#0f172a" />
                            <rect x="61" y="14" width="3" height="3" fill="#0f172a" />
                            <rect x="67" y="14" width="3" height="3" fill="#0f172a" />

                            {/* Vertical Timing Pattern */}
                            <rect x="14" y="31" width="3" height="3" fill="#0f172a" />
                            <rect x="14" y="37" width="3" height="3" fill="#0f172a" />
                            <rect x="14" y="43" width="3" height="3" fill="#0f172a" />
                            <rect x="14" y="49" width="3" height="3" fill="#0f172a" />
                            <rect x="14" y="55" width="3" height="3" fill="#0f172a" />
                            <rect x="14" y="61" width="3" height="3" fill="#0f172a" />
                            <rect x="14" y="67" width="3" height="3" fill="#0f172a" />

                            {/* High-density authentic QR data modules */}
                            {/* Top area between finders */}
                            <rect x="31" y="5" width="3" height="3" fill="#0f172a" />
                            <rect x="37" y="5" width="6" height="3" fill="#0f172a" />
                            <rect x="46" y="5" width="3" height="3" fill="#0f172a" />
                            <rect x="52" y="5" width="3" height="3" fill="#0f172a" />
                            <rect x="61" y="5" width="6" height="3" fill="#0f172a" />
                            <rect x="34" y="9" width="3" height="3" fill="#0f172a" />
                            <rect x="40" y="9" width="3" height="3" fill="#0f172a" />
                            <rect x="49" y="9" width="6" height="3" fill="#0f172a" />
                            <rect x="58" y="9" width="3" height="3" fill="#0f172a" />
                            <rect x="64" y="9" width="3" height="3" fill="#0f172a" />
                            <rect x="31" y="18" width="6" height="3" fill="#0f172a" />
                            <rect x="40" y="18" width="3" height="3" fill="#0f172a" />
                            <rect x="46" y="18" width="6" height="3" fill="#0f172a" />
                            <rect x="55" y="18" width="3" height="3" fill="#0f172a" />
                            <rect x="64" y="18" width="3" height="3" fill="#0f172a" />
                            <rect x="34" y="22" width="3" height="3" fill="#0f172a" />
                            <rect x="43" y="22" width="3" height="3" fill="#0f172a" />
                            <rect x="52" y="22" width="6" height="3" fill="#0f172a" />
                            <rect x="61" y="22" width="6" height="3" fill="#0f172a" />

                            {/* Left area below top-left finder */}
                            <rect x="5" y="31" width="6" height="3" fill="#0f172a" />
                            <rect x="18" y="31" width="3" height="3" fill="#0f172a" />
                            <rect x="24" y="31" width="6" height="3" fill="#0f172a" />
                            <rect x="8" y="37" width="3" height="3" fill="#0f172a" />
                            <rect x="21" y="37" width="6" height="3" fill="#0f172a" />
                            <rect x="5" y="43" width="3" height="3" fill="#0f172a" />
                            <rect x="11" y="43" width="6" height="3" fill="#0f172a" />
                            <rect x="24" y="43" width="3" height="3" fill="#0f172a" />
                            <rect x="8" y="49" width="6" height="3" fill="#0f172a" />
                            <rect x="18" y="49" width="6" height="3" fill="#0f172a" />
                            <rect x="5" y="55" width="6" height="3" fill="#0f172a" />
                            <rect x="14" y="55" width="3" height="3" fill="#0f172a" />
                            <rect x="21" y="55" width="3" height="3" fill="#0f172a" />
                            <rect x="8" y="61" width="3" height="3" fill="#0f172a" />
                            <rect x="18" y="61" width="6" height="3" fill="#0f172a" />
                            <rect x="5" y="67" width="6" height="3" fill="#0f172a" />
                            <rect x="24" y="67" width="6" height="3" fill="#0f172a" />

                            {/* Right area below top-right finder */}
                            <rect x="72" y="31" width="3" height="3" fill="#0f172a" />
                            <rect x="78" y="31" width="6" height="3" fill="#0f172a" />
                            <rect x="87" y="31" width="6" height="3" fill="#0f172a" />
                            <rect x="75" y="37" width="3" height="3" fill="#0f172a" />
                            <rect x="84" y="37" width="3" height="3" fill="#0f172a" />
                            <rect x="90" y="37" width="6" height="3" fill="#0f172a" />
                            <rect x="72" y="43" width="6" height="3" fill="#0f172a" />
                            <rect x="81" y="43" width="6" height="3" fill="#0f172a" />
                            <rect x="93" y="43" width="3" height="3" fill="#0f172a" />
                            <rect x="75" y="49" width="3" height="3" fill="#0f172a" />
                            <rect x="84" y="49" width="6" height="3" fill="#0f172a" />
                            <rect x="93" y="49" width="3" height="3" fill="#0f172a" />
                            <rect x="72" y="55" width="6" height="3" fill="#0f172a" />
                            <rect x="81" y="55" width="3" height="3" fill="#0f172a" />
                            <rect x="87" y="55" width="6" height="3" fill="#0f172a" />
                            <rect x="78" y="61" width="6" height="3" fill="#0f172a" />
                            <rect x="90" y="61" width="6" height="3" fill="#0f172a" />
                            <rect x="72" y="67" width="3" height="3" fill="#0f172a" />
                            <rect x="81" y="67" width="6" height="3" fill="#0f172a" />
                            <rect x="93" y="67" width="3" height="3" fill="#0f172a" />

                            {/* Bottom area beside bottom-left finder */}
                            <rect x="31" y="73" width="6" height="3" fill="#0f172a" />
                            <rect x="40" y="73" width="3" height="3" fill="#0f172a" />
                            <rect x="46" y="73" width="6" height="3" fill="#0f172a" />
                            <rect x="55" y="73" width="6" height="3" fill="#0f172a" />
                            <rect x="64" y="73" width="3" height="3" fill="#0f172a" />
                            <rect x="34" y="79" width="3" height="3" fill="#0f172a" />
                            <rect x="43" y="79" width="6" height="3" fill="#0f172a" />
                            <rect x="52" y="79" width="3" height="3" fill="#0f172a" />
                            <rect x="61" y="79" width="6" height="3" fill="#0f172a" />
                            <rect x="31" y="85" width="6" height="3" fill="#0f172a" />
                            <rect x="40" y="85" width="6" height="3" fill="#0f172a" />
                            <rect x="49" y="85" width="3" height="3" fill="#0f172a" />
                            <rect x="58" y="85" width="6" height="3" fill="#0f172a" />
                            <rect x="34" y="91" width="3" height="3" fill="#0f172a" />
                            <rect x="43" y="91" width="3" height="3" fill="#0f172a" />
                            <rect x="49" y="91" width="6" height="3" fill="#0f172a" />
                            <rect x="58" y="91" width="3" height="3" fill="#0f172a" />
                            <rect x="64" y="91" width="3" height="3" fill="#0f172a" />

                            {/* Center Area Data Modules */}
                            <rect x="31" y="31" width="6" height="3" fill="#0f172a" />
                            <rect x="40" y="31" width="3" height="3" fill="#0f172a" />
                            <rect x="46" y="31" width="6" height="3" fill="#0f172a" />
                            <rect x="55" y="31" width="3" height="3" fill="#0f172a" />
                            <rect x="61" y="31" width="6" height="3" fill="#0f172a" />
                            <rect x="34" y="37" width="3" height="3" fill="#0f172a" />
                            <rect x="64" y="37" width="3" height="3" fill="#0f172a" />
                            <rect x="31" y="43" width="3" height="3" fill="#0f172a" />
                            <rect x="67" y="43" width="3" height="3" fill="#0f172a" />
                            <rect x="31" y="49" width="3" height="3" fill="#0f172a" />
                            <rect x="67" y="49" width="3" height="3" fill="#0f172a" />
                            <rect x="34" y="55" width="3" height="3" fill="#0f172a" />
                            <rect x="64" y="55" width="3" height="3" fill="#0f172a" />
                            <rect x="31" y="61" width="6" height="3" fill="#0f172a" />
                            <rect x="40" y="61" width="3" height="3" fill="#0f172a" />
                            <rect x="46" y="61" width="6" height="3" fill="#0f172a" />
                            <rect x="55" y="61" width="3" height="3" fill="#0f172a" />
                            <rect x="61" y="61" width="6" height="3" fill="#0f172a" />

                            {/* Center Official UPI Emblem Badge */}
                            <rect x="38" y="38" width="24" height="24" rx="4" fill="#ffffff" stroke="#e2e8f0" strokeWidth="1" />
                            <path
                              d="M49 42 L44 50 L49 50 L46 58 L56 48 L51 48 Z"
                              fill="#059669"
                            />
                          </svg>

                          {/* Delicate Emerald Laser Scanning Sweep */}
                          <div className="absolute inset-x-0 top-0 h-7 pointer-events-none z-20 animate-qr-laser flex flex-col justify-end">
                            <div className="h-5 w-full bg-gradient-to-b from-transparent to-emerald-500/15" />
                            <div className="h-[1.5px] w-full bg-gradient-to-r from-transparent via-emerald-500 to-transparent shadow-[0_0_6px_#10b981]" />
                          </div>
                        </div>

                        {/* Helper texts */}
                        <p className="text-xs font-semibold text-neutral-800 mt-3">
                          Auto-generates upon confirming order
                        </p>
                        <p className="text-[11px] text-neutral-500 mt-0.5">
                          Point phone camera or any UPI payment app
                        </p>

                        {/* Clean Brand Badges */}
                        <div className="flex items-center justify-center gap-1.5 mt-3 flex-wrap">
                          <span className="text-[10px] font-medium bg-neutral-100 text-neutral-700 px-2 py-0.5 rounded border border-neutral-200/70">
                            Google Pay
                          </span>
                          <span className="text-[10px] font-medium bg-neutral-100 text-neutral-700 px-2 py-0.5 rounded border border-neutral-200/70">
                            PhonePe
                          </span>
                          <span className="text-[10px] font-medium bg-neutral-100 text-neutral-700 px-2 py-0.5 rounded border border-neutral-200/70">
                            Paytm
                          </span>
                          <span className="text-[10px] font-medium bg-neutral-100 text-neutral-700 px-2 py-0.5 rounded border border-neutral-200/70">
                            BHIM
                          </span>
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
