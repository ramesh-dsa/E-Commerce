"use client";

import React, { useState, useEffect, useMemo } from "react";
import Image from "next/image";
import Link from "next/link";
import { useRouter } from "next/navigation";
import { useCart } from "@/context/CartContext";
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
  Sparkles,
  ArrowRight,
  ShoppingBag,
  HelpCircle,
  AlertCircle,
} from "lucide-react";

export default function CheckoutPage() {
  const router = useRouter();
  const {
    items,
    totalItems,
    subtotal,
    finalSubtotal,
    bundleDiscount,
    couponDiscount,
    appliedCoupon,
    applyCoupon,
    removeCoupon,
    clearCart,
    hasFreeShipping,
    freeShippingThreshold,
  } = useCart();

  const { user, addOrder } = useUser();

  const [isMounted, setIsMounted] = useState(false);
  const [isSubmitting, setIsSubmitting] = useState(false);

  // Form State - Contact
  const [email, setEmail] = useState("");
  const [phone, setPhone] = useState("");

  // Form State - Shipping Address
  const [fullName, setFullName] = useState("");
  const [streetAddress, setStreetAddress] = useState("");
  const [apartment, setApartment] = useState("");
  const [city, setCity] = useState("");
  const [stateName, setStateName] = useState("");
  const [pincode, setPincode] = useState("");
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

  useEffect(() => {
    setIsMounted(true);
    if (user) {
      setEmail(user.email || "");
      setPhone(user.phone || "");
      setFullName(user.name || "");
      if (user.address) {
        setStreetAddress(user.address.line1 || "");
        setCity(user.address.city || "");
        setStateName(user.address.state || "");
        setPincode(user.address.pincode || "");
      }
    } else {
      // Default initial dummy values for fast testing if blank
      setEmail("ramesh.kumar@example.com");
      setPhone("+91 98765 43210");
      setFullName("Ramesh Kumar");
      setStreetAddress("Flat 402, Prestige Tower, Indiranagar");
      setCity("Bengaluru");
      setStateName("Karnataka");
      setPincode("560038");
    }
  }, [user]);

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

  // Card number formatter
  const handleCardNumberChange = (val: string) => {
    const cleaned = val.replace(/\D/g, "").slice(0, 16);
    const formatted = cleaned.match(/.{1,4}/g)?.join(" ") || cleaned;
    setCardNumber(formatted);
  };

  // Card expiry formatter
  const handleCardExpiryChange = (val: string) => {
    const cleaned = val.replace(/\D/g, "").slice(0, 4);
    if (cleaned.length >= 3) {
      setCardExpiry(`${cleaned.slice(0, 2)}/${cleaned.slice(2)}`);
    } else {
      setCardExpiry(cleaned);
    }
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
      if (cardNumber.replace(/\s/g, "").length < 16) {
        errors.cardNumber = "Please enter a valid 16-digit card number.";
      }
      if (!cardHolder.trim()) {
        errors.cardHolder = "Name on card is required.";
      }
      if (!cardExpiry || cardExpiry.length < 5) {
        errors.cardExpiry = "Expiry (MM/YY) is required.";
      }
      if (!cardCvv || cardCvv.length < 3) {
        errors.cardCvv = "Valid CVV is required.";
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

    setTimeout(() => {
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
        itemsCount: totalItems,
        items: items.map((i) => ({
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
        itemNames: items.map((i) => `${i.product.name} (${i.selectedSize})`),
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
      clearCart();

      // Navigate to dedicated Order Confirmation & Tracking view
      router.push(`/orders/${generatedOrderId}?new=1`);
    }, 900);
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

  // Empty cart fallback
  if (items.length === 0) {
    return (
      <div className="min-h-[80vh] bg-neutral-50/50 flex items-center justify-center px-4 py-16">
        <div className="max-w-md w-full bg-white border border-neutral-200/90 rounded-2xl p-8 sm:p-10 text-center shadow-xs">
          <div className="w-14 h-14 rounded-full bg-neutral-100 text-neutral-400 flex items-center justify-center mx-auto mb-4">
            <ShoppingBag size={24} />
          </div>
          <h1 className="text-xl font-bold text-neutral-900 mb-2">Your Bag is Empty</h1>
          <p className="text-xs text-neutral-500 mb-6 leading-relaxed">
            There are no items currently in your bag to checkout. Explore our premium drops to start your order.
          </p>
          <Link
            href="/clothing"
            className="inline-flex items-center justify-center w-full bg-neutral-900 text-white hover:bg-black py-3 px-5 rounded-lg text-xs font-bold uppercase tracking-wider transition-colors"
          >
            Explore Collections
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
        <form onSubmit={handlePlaceOrder} className="grid grid-cols-1 lg:grid-cols-12 gap-8 lg:gap-12">
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
            <section className="bg-white border border-neutral-200/90 rounded-2xl p-6 sm:p-7 shadow-xs">
              <div className="flex items-center justify-between pb-4 border-b border-neutral-100 mb-5">
                <div className="flex items-center gap-3">
                  <span className="w-7 h-7 rounded-full bg-neutral-100 text-neutral-900 text-xs font-bold flex items-center justify-center">
                    02
                  </span>
                  <h2 className="text-sm sm:text-base font-bold text-neutral-950 tracking-tight">
                    Shipping & Delivery Address
                  </h2>
                </div>
                <div className="flex items-center gap-1 text-[11px] text-neutral-500 font-mono">
                  <Truck size={13} className="text-neutral-700" />
                  <span>Pan-India Courier</span>
                </div>
              </div>

              <div className="space-y-4">
                <div>
                  <label className="block text-xs font-semibold text-neutral-700 mb-1.5">
                    Recipient Full Name <span className="text-red-500">*</span>
                  </label>
                  <input
                    type="text"
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
                    value={streetAddress}
                    onChange={(e) => setStreetAddress(e.target.value)}
                    placeholder="e.g. 42, Richmond Road, Flat 3B"
                    className={`w-full text-xs px-3.5 py-2.5 rounded-lg border bg-white transition-colors focus-visible:outline-hidden focus-visible:ring-2 focus-visible:ring-black ${
                      formErrors.streetAddress ? "border-red-400 bg-red-50/20" : "border-neutral-300"
                    }`}
                  />
                  {formErrors.streetAddress && (
                    <p className="text-[11px] text-red-600 mt-1">{formErrors.streetAddress}</p>
                  )}
                </div>

                <div>
                  <label className="block text-xs font-semibold text-neutral-700 mb-1.5">
                    Apartment, Suite, Landmark <span className="text-neutral-400 font-normal">(Optional)</span>
                  </label>
                  <input
                    type="text"
                    value={apartment}
                    onChange={(e) => setApartment(e.target.value)}
                    placeholder="Near Indiranagar Metro Station"
                    className="w-full text-xs px-3.5 py-2.5 rounded-lg border border-neutral-300 bg-white focus-visible:outline-hidden focus-visible:ring-2 focus-visible:ring-black"
                  />
                </div>

                <div className="grid grid-cols-1 sm:grid-cols-3 gap-3">
                  <div>
                    <label className="block text-xs font-semibold text-neutral-700 mb-1.5">
                      City <span className="text-red-500">*</span>
                    </label>
                    <input
                      type="text"
                      value={city}
                      onChange={(e) => setCity(e.target.value)}
                      placeholder="Bengaluru"
                      className={`w-full text-xs px-3.5 py-2.5 rounded-lg border bg-white focus-visible:outline-hidden focus-visible:ring-2 focus-visible:ring-black ${
                        formErrors.city ? "border-red-400 bg-red-50/20" : "border-neutral-300"
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
                      value={stateName}
                      onChange={(e) => setStateName(e.target.value)}
                      placeholder="Karnataka"
                      className={`w-full text-xs px-3.5 py-2.5 rounded-lg border bg-white focus-visible:outline-hidden focus-visible:ring-2 focus-visible:ring-black ${
                        formErrors.stateName ? "border-red-400 bg-red-50/20" : "border-neutral-300"
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
                      maxLength={6}
                      value={pincode}
                      onChange={(e) => setPincode(e.target.value.replace(/\D/g, "").slice(0, 6))}
                      placeholder="560038"
                      className={`w-full text-xs px-3.5 py-2.5 rounded-lg border bg-white focus-visible:outline-hidden focus-visible:ring-2 focus-visible:ring-black ${
                        formErrors.pincode ? "border-red-400 bg-red-50/20" : "border-neutral-300"
                      }`}
                    />
                    {formErrors.pincode && (
                      <p className="text-[11px] text-red-600 mt-1">{formErrors.pincode}</p>
                    )}
                  </div>
                </div>

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
              </div>
            </section>

            {/* Section 3: Payment Method */}
            <section className="bg-white border border-neutral-200/90 rounded-2xl p-6 sm:p-7 shadow-xs">
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
                  onClick={() => setPaymentMethod("upi")}
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
                  onClick={() => setPaymentMethod("card")}
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
                  onClick={() => setPaymentMethod("cod")}
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
                            onChange={(e) => setUpiId(e.target.value)}
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

                      <div className="bg-white border border-neutral-200 rounded-lg p-3 text-center">
                        <div className="w-24 h-24 bg-neutral-900 mx-auto rounded-lg flex items-center justify-center text-white mb-2 shadow-inner">
                          {/* Simulated high-res dynamic QR code graphic */}
                          <div className="grid grid-cols-4 gap-1 p-2 bg-white rounded">
                            <div className="w-3 h-3 bg-neutral-900 rounded-xs" />
                            <div className="w-3 h-3 bg-neutral-900 rounded-xs" />
                            <div className="w-3 h-3 bg-neutral-200 rounded-xs" />
                            <div className="w-3 h-3 bg-neutral-900 rounded-xs" />
                            <div className="w-3 h-3 bg-neutral-900 rounded-xs" />
                            <div className="w-3 h-3 bg-neutral-200 rounded-xs" />
                            <div className="w-3 h-3 bg-neutral-900 rounded-xs" />
                            <div className="w-3 h-3 bg-neutral-200 rounded-xs" />
                            <div className="w-3 h-3 bg-neutral-200 rounded-xs" />
                            <div className="w-3 h-3 bg-neutral-900 rounded-xs" />
                            <div className="w-3 h-3 bg-neutral-900 rounded-xs" />
                            <div className="w-3 h-3 bg-neutral-900 rounded-xs" />
                          </div>
                        </div>
                        <p className="text-[10px] text-neutral-500 font-medium">
                          Auto-generated UPI QR code active on confirmation
                        </p>
                      </div>
                    </div>
                  </div>
                )}

                {paymentMethod === "card" && (
                  <div className="space-y-4">
                    <div className="flex items-center justify-between text-xs pb-3 border-b border-neutral-200/80">
                      <span className="font-semibold text-neutral-800">
                        Credit & Debit Cards (Visa, MasterCard, RuPay, Amex)
                      </span>
                      <div className="flex items-center gap-1 text-[10px] text-neutral-500 font-mono">
                        <Lock size={12} className="text-emerald-600" />
                        <span>256-Bit Encrypted</span>
                      </div>
                    </div>

                    <div className="space-y-3">
                      <div>
                        <label className="block text-xs font-semibold text-neutral-700 mb-1">
                          Card Number
                        </label>
                        <input
                          type="text"
                          value={cardNumber}
                          onChange={(e) => handleCardNumberChange(e.target.value)}
                          placeholder="4532 •••• •••• 8921"
                          maxLength={19}
                          className={`w-full text-xs font-mono px-3.5 py-2.5 rounded-lg border bg-white focus-visible:outline-hidden focus-visible:ring-2 focus-visible:ring-black ${
                            formErrors.cardNumber ? "border-red-400 bg-red-50/20" : "border-neutral-300"
                          }`}
                        />
                        {formErrors.cardNumber && (
                          <p className="text-[11px] text-red-600 mt-1">{formErrors.cardNumber}</p>
                        )}
                      </div>

                      <div className="grid grid-cols-1 sm:grid-cols-3 gap-3">
                        <div className="sm:col-span-1">
                          <label className="block text-xs font-semibold text-neutral-700 mb-1">
                            Cardholder Name
                          </label>
                          <input
                            type="text"
                            value={cardHolder}
                            onChange={(e) => setCardHolder(e.target.value)}
                            placeholder="Ramesh Kumar"
                            className={`w-full text-xs px-3.5 py-2.5 rounded-lg border bg-white focus-visible:outline-hidden focus-visible:ring-2 focus-visible:ring-black ${
                              formErrors.cardHolder ? "border-red-400 bg-red-50/20" : "border-neutral-300"
                            }`}
                          />
                        </div>

                        <div>
                          <label className="block text-xs font-semibold text-neutral-700 mb-1">
                            Expiry (MM/YY)
                          </label>
                          <input
                            type="text"
                            maxLength={5}
                            value={cardExpiry}
                            onChange={(e) => handleCardExpiryChange(e.target.value)}
                            placeholder="12/28"
                            className={`w-full text-xs font-mono px-3.5 py-2.5 rounded-lg border bg-white focus-visible:outline-hidden focus-visible:ring-2 focus-visible:ring-black ${
                              formErrors.cardExpiry ? "border-red-400 bg-red-50/20" : "border-neutral-300"
                            }`}
                          />
                        </div>

                        <div>
                          <label className="block text-xs font-semibold text-neutral-700 mb-1">
                            CVV
                          </label>
                          <input
                            type="password"
                            maxLength={4}
                            value={cardCvv}
                            onChange={(e) => setCardCvv(e.target.value.replace(/\D/g, ""))}
                            placeholder="•••"
                            className={`w-full text-xs font-mono px-3.5 py-2.5 rounded-lg border bg-white focus-visible:outline-hidden focus-visible:ring-2 focus-visible:ring-black ${
                              formErrors.cardCvv ? "border-red-400 bg-red-50/20" : "border-neutral-300"
                            }`}
                          />
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
              <div className="mt-7 pt-5 border-t border-neutral-100 space-y-3">
                <button
                  type="submit"
                  disabled={isSubmitting}
                  className="w-full bg-neutral-950 text-white hover:bg-black py-4 px-6 rounded-xl text-xs sm:text-sm font-bold uppercase tracking-wider flex items-center justify-center gap-3 transition-all cursor-pointer shadow-md disabled:opacity-50 disabled:cursor-not-allowed"
                >
                  {isSubmitting ? (
                    <>
                      <div className="w-4 h-4 border-2 border-white border-t-transparent rounded-full animate-spin" />
                      <span>Securing Order & Generating Receipt...</span>
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
                    {totalItems} {totalItems === 1 ? "Item" : "Items"}
                  </span>
                </div>

                {/* Items Mini List */}
                <div className="max-h-72 overflow-y-auto divide-y divide-neutral-100 pr-1 space-y-3">
                  {items.map((item) => {
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
