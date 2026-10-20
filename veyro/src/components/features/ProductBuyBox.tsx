"use client";

import React, { useState, useEffect } from "react";
import { useRouter } from "next/navigation";
import { Product } from "@/types";
import { formatPrice, calculateDiscountPercentage } from "@/lib/utils";
import { useCart } from "@/context/CartContext";
import { useWishlist } from "@/context/WishlistContext";
import { useReviews } from "@/context/ReviewsContext";
import {
  HeartIcon,
  ShoppingBagIcon,
  CheckIcon,
  ArrowUpRightIcon,
} from "@/components/ui/Icons";

import {
  Ruler,
  ChevronDown,
  ChevronUp,
  Minus,
  Plus,
  Truck,
  RotateCcw,
  Sparkles,
  Check,
  X,
  ArrowRight,
  ShieldCheck,
  Star,
  PackageX,
  Bell,
} from "lucide-react";

interface FootwearSizingRow {
  uk: string;
  us: string;
  eu: string;
  lengthCm: string;
  lengthIn: string;
}

const FOOTWEAR_SIZING_ROWS: FootwearSizingRow[] = [
  { uk: "UK 6", us: "US 7", eu: "EU 40", lengthCm: "25.0", lengthIn: "9.8" },
  { uk: "UK 7", us: "US 8", eu: "EU 41", lengthCm: "26.0", lengthIn: "10.2" },
  { uk: "UK 8", us: "US 9", eu: "EU 42", lengthCm: "27.0", lengthIn: "10.6" },
  { uk: "UK 9", us: "US 10", eu: "EU 43", lengthCm: "28.0", lengthIn: "11.0" },
  { uk: "UK 10", us: "US 11", eu: "EU 44", lengthCm: "29.0", lengthIn: "11.4" },
  { uk: "UK 11", us: "US 12", eu: "EU 45", lengthCm: "30.0", lengthIn: "11.8" },
];

interface ApparelSizingRow {
  size: string;
  chestIn: string;
  chestCm: string;
  lengthIn: string;
  lengthCm: string;
  shoulderIn: string;
  shoulderCm: string;
}

const APPAREL_SIZING_ROWS: ApparelSizingRow[] = [
  { size: "S", chestIn: "42", chestCm: "107", lengthIn: "28", lengthCm: "71", shoulderIn: "20", shoulderCm: "51" },
  { size: "M", chestIn: "44", chestCm: "112", lengthIn: "29", lengthCm: "74", shoulderIn: "21", shoulderCm: "53" },
  { size: "L", chestIn: "46", chestCm: "117", lengthIn: "30", lengthCm: "76", shoulderIn: "22", shoulderCm: "56" },
  { size: "XL", chestIn: "48", chestCm: "122", lengthIn: "31", lengthCm: "79", shoulderIn: "23", shoulderCm: "58" },
  { size: "XXL", chestIn: "50", chestCm: "127", lengthIn: "32", lengthCm: "81", shoulderIn: "24", shoulderCm: "61" },
];

interface WatchSizingRow {
  caseDiameter: string;
  lugToLug: string;
  thickness: string;
  strapWidth: string;
  wristIn: string;
  wristCm: string;
  profile: string;
}

const WATCH_SIZING_ROWS: WatchSizingRow[] = [
  {
    caseDiameter: "32mm",
    lugToLug: "38mm",
    thickness: "7.0mm",
    strapWidth: "14mm",
    wristIn: "5.5\" – 6.2\"",
    wristCm: "14 – 16 cm",
    profile: "Petite & Elegant / Dress",
  },
  {
    caseDiameter: "36mm",
    lugToLug: "42mm",
    thickness: "8.5mm",
    strapWidth: "18mm",
    wristIn: "6.0\" – 6.8\"",
    wristCm: "15 – 17.5 cm",
    profile: "Classic Vintage / Unisex",
  },
  {
    caseDiameter: "40mm",
    lugToLug: "47mm",
    thickness: "9.5mm",
    strapWidth: "20mm",
    wristIn: "6.3\" – 7.6\"",
    wristCm: "16 – 19 cm",
    profile: "Universal Golden Ratio",
  },
  {
    caseDiameter: "42mm",
    lugToLug: "49mm",
    thickness: "11.0mm",
    strapWidth: "22mm",
    wristIn: "6.9\" – 8.2\"",
    wristCm: "17.5 – 21 cm",
    profile: "Bold Sports / Chronograph",
  },
  {
    caseDiameter: "44mm – 45mm",
    lugToLug: "52mm",
    thickness: "13.5mm",
    strapWidth: "22mm – 24mm",
    wristIn: "7.2\" – 8.8\"",
    wristCm: "18.5 – 22.5 cm",
    profile: "Commanding Diver Profile",
  },
];

interface ProductBuyBoxProps {
  product: Product;
}

export function ProductBuyBox({ product }: ProductBuyBoxProps) {
  const router = useRouter();
  const { addToCart } = useCart();
  const { isInWishlist, toggleWishlist, itemSizes, setItemSize } = useWishlist();
  const [selectedSize, setSelectedSize] = useState<string>("");
  const [sizeError, setSizeError] = useState(false);
  const [quantity, setQuantity] = useState(1);
  const [isAdding, setIsAdding] = useState(false);
  const isWishlisted = isInWishlist(product.id);
  const isOutOfStock = !product.inStock;
  const [isSizeGuideOpen, setIsSizeGuideOpen] = useState(false);
  const [unitMode, setUnitMode] = useState<"in" | "cm">("in");

  // Priority Restock Waitlist state
  const [restockEmail, setRestockEmail] = useState("");
  const [isSubscribedToRestock, setIsSubscribedToRestock] = useState(false);

  useEffect(() => {
    try {
      const saved = localStorage.getItem("veyro_restock_subscribers");
      if (saved) {
        const list = JSON.parse(saved);
        if (Array.isArray(list) && list.includes(product.id)) {
          setIsSubscribedToRestock(true);
        }
      }
    } catch {}
  }, [product.id]);

  const handleRestockSubscribe = (e: React.FormEvent) => {
    e.preventDefault();
    if (!restockEmail.trim()) return;
    try {
      const saved = localStorage.getItem("veyro_restock_subscribers");
      const list = saved ? JSON.parse(saved) : [];
      if (!list.includes(product.id)) {
        list.push(product.id);
        localStorage.setItem("veyro_restock_subscribers", JSON.stringify(list));
      }
      setIsSubscribedToRestock(true);
    } catch {}
  };

  const isFootwear =
    product.category?.toLowerCase() === "footwear" ||
    product.subcategory?.toLowerCase() === "shoes" ||
    product.id.startsWith("vey-ftw");
  const isWatch =
    product.category?.toLowerCase() === "watches" ||
    product.subcategory?.toLowerCase() === "timepieces" ||
    product.id.startsWith("vey-wtc");

  // If item is already wishlisted with a saved size and user has not manually picked a size yet, prefill from wishlist
  useEffect(() => {
    if (!selectedSize && itemSizes && itemSizes[product.id]) {
      setSelectedSize(itemSizes[product.id]);
    }
  }, [itemSizes, product.id, selectedSize]);

  // Accessibility: close size guide modal on Escape key
  useEffect(() => {
    if (!isSizeGuideOpen) return;
    const handleKeyDown = (e: KeyboardEvent) => {
      if (e.key === "Escape") {
        setIsSizeGuideOpen(false);
      }
    };
    window.addEventListener("keydown", handleKeyDown);
    return () => window.removeEventListener("keydown", handleKeyDown);
  }, [isSizeGuideOpen]);

  // Auto-select size from URL query param if present (e.g. ?size=XL)
  useEffect(() => {
    if (typeof window !== "undefined") {
      const params = new URLSearchParams(window.location.search);
      const sizeParam = params.get("size");
      if (sizeParam && product.sizes?.includes(sizeParam)) {
        queueMicrotask(() => {
          setSelectedSize(sizeParam);
        });
      }
    }
  }, [product.sizes]);

  // Editorial Accordion State (first one open by default)
  const [openSection, setOpenSection] = useState<string | null>("specs");

  // Delivery pincode state
  const [pincode, setPincode] = useState("");
  const [deliveryEstimate, setDeliveryEstimate] = useState<string | null>(null);

  const discountPercent =
    product.originalPrice && product.originalPrice > product.price
      ? calculateDiscountPercentage(product.price, product.originalPrice)
      : null;

  // Single source of truth for reviews & ratings via ReviewsContext
  const { getStats } = useReviews();
  const {
    averageRating: rating,
    totalCount: reviewsCount,
    recommendationPercentage,
    fitBreakdown,
  } = getStats(product.id);

  const handleSizeSelect = (size: string) => {
    setSelectedSize(size);
    setSizeError(false);
    if (isWishlisted) {
      setItemSize(product.id, size);
    }
  };

  const handleAddToCart = () => {
    if (isOutOfStock) return;
    if (!selectedSize) {
      setSizeError(true);
      return;
    }

    setIsAdding(true);
    addToCart(product, selectedSize, quantity, false);

    setTimeout(() => {
      setIsAdding(false);
    }, 1200);
  };

  const handleBuyNow = () => {
    if (isOutOfStock) return;
    if (!selectedSize) {
      setSizeError(true);
      return;
    }

    addToCart(product, selectedSize, quantity, false);
    router.push("/cart");
  };

  const handleCheckPincode = (e: React.FormEvent) => {
    e.preventDefault();
    if (pincode.trim().length === 6) {
      setDeliveryEstimate("Estimated Delivery: 2–3 Business Days • Free Express Shipping");
    }
  };

  return (
    <div className="w-full flex flex-col select-none max-w-[540px]">
      {/* 1. Availability Status & Merchandising Badges */}
      <div className="flex items-center gap-2 mb-3.5">
        {isOutOfStock ? (
          <span className="inline-flex items-center justify-center bg-neutral-900 text-white text-[11px] font-semibold px-3.5 py-1.5 rounded-full tracking-wider uppercase shadow-2xs">
            Sold Out
          </span>
        ) : (
          <span className="inline-flex items-center justify-center bg-neutral-100 text-neutral-800 border border-neutral-200/90 text-[11px] font-semibold px-3.5 py-1.5 rounded-full tracking-wider uppercase">
            In Stock
          </span>
        )}
        {product.badge && (
          <span
            className={`inline-flex items-center justify-center text-[11px] font-semibold px-3.5 py-1.5 rounded-full tracking-wider uppercase ${
              product.badge === "SALE"
                ? "bg-red-50 text-red-700 border border-red-200"
                : "bg-neutral-100 text-neutral-800 border border-neutral-200/90"
            }`}
          >
            {product.badge}
          </span>
        )}
      </div>

      {/* 2. Architectural Title */}
      <h1 className="text-3xl sm:text-4xl lg:text-[42px] font-black uppercase tracking-tight text-veyro-black leading-[0.95] mb-2.5">
        {product.name}
      </h1>

      {/* 2b. Luxury Rating Bar */}
      <div className="flex items-center gap-2 mb-4">
        <div className="flex items-center gap-0.5">
          {[...Array(5)].map((_, i) => (
            <Star
              key={i}
              size={13}
              className="fill-veyro-yellow text-veyro-yellow"
            />
          ))}
        </div>
        <span className="text-xs font-bold text-veyro-black tracking-tight">
          {rating.toFixed(1)}
        </span>
        <span className="text-neutral-300">•</span>
        <button
          type="button"
          onClick={() => {
            const el = document.getElementById("customer-reviews");
            if (el) {
              el.scrollIntoView({ behavior: "smooth", block: "start" });
            }
          }}
          className="text-xs font-medium text-veyro-muted hover:text-veyro-black transition-colors underline underline-offset-2 cursor-pointer"
        >
          {reviewsCount} Verified Reviews
        </button>
      </div>

      {/* 3. Luxury Price Hierarchy */}
      <div className="flex items-baseline gap-3.5 mb-1.5">
        {product.originalPrice && product.originalPrice > product.price && (
          <span className="text-lg text-veyro-muted line-through font-normal">
            {formatPrice(product.originalPrice)}
          </span>
        )}

        <span className="text-3xl sm:text-4xl font-black text-veyro-black tracking-tight">
          {formatPrice(product.price)}
        </span>

        {discountPercent && (
          <span className="bg-veyro-yellow text-veyro-black text-[11px] font-black px-2.5 py-0.5 rounded-full tracking-wider uppercase shadow-2xs">
            {discountPercent}% OFF
          </span>
        )}
      </div>
      <p className="text-[11px] font-medium tracking-wide text-veyro-subtle uppercase mb-6">
        MRP Inclusive of all taxes • Standard Express Delivery
      </p>

      {/* 4. Authentic VEYRO Bundle Pass Banner */}
      {product.category === "Clothing" && (
        <div className="relative overflow-hidden bg-gradient-to-r from-[#fcd017] via-[#ffe040] to-[#fcd017] rounded-2xl p-3.5 flex items-center justify-between mb-6 group cursor-pointer shadow-sm hover:shadow-md transition-all duration-200 active:scale-[0.99]">
          {/* Subtle shimmer sweep */}
          <div className="absolute inset-0 bg-gradient-to-r from-transparent via-white/30 to-transparent -translate-x-full group-hover:translate-x-full transition-transform duration-700 ease-in-out pointer-events-none" />
          <div className="flex items-center gap-3 relative z-10">
            <span className="bg-veyro-black text-white text-[9px] font-black px-2.5 py-1.5 rounded-full tracking-widest uppercase shrink-0 shadow-sm">
              BUNDLE PASS
            </span>
            <div className="flex flex-col">
              <span className="text-xs font-black uppercase tracking-wide text-veyro-black">
                Buy any 3 Archive T-Shirts for ₹1,199
              </span>
              <span className="text-[10px] text-veyro-black/60 font-medium">
                Discount auto-applied at checkout
              </span>
            </div>
          </div>
          <ArrowUpRightIcon size={18} className="text-veyro-black/70 shrink-0 relative z-10 transition-transform duration-200 group-hover:translate-x-0.5 group-hover:-translate-y-0.5" />
        </div>
      )}

      {/* 5. Minimalist Color Variant */}
      {product.colorHex && (
        <div className="mb-6 pb-6 border-b border-veyro-border-light">
          <div className="flex items-center justify-between text-xs mb-3">
            <span className="font-bold uppercase tracking-wider text-veyro-black">
              Color: <span className="font-normal text-veyro-subtle ml-1">{product.colorName}</span>
            </span>
          </div>
          <div className="flex items-center gap-2">
            <div
              className="w-8 h-8 rounded-full p-0.5 ring-2 ring-veyro-black ring-offset-2 flex items-center justify-center cursor-default"
              title={product.colorName}
            >
              <span
                className="w-full h-full rounded-full block border border-black/10"
                style={{ backgroundColor: product.colorHex }}
              />
            </div>
          </div>
        </div>
      )}

      {/* 6. Clean Architectural Size Grid */}
      <div className="mb-6">
        <div className="flex items-center justify-between mb-3">
          <span className="text-xs font-bold uppercase tracking-wider text-veyro-black">
            Select Size
          </span>
          <button
            type="button"
            onClick={() => setIsSizeGuideOpen(true)}
            className="flex items-center gap-1.5 text-xs text-veyro-subtle hover:text-veyro-black transition-colors cursor-pointer"
          >
            <Ruler size={13} />
            <span className="underline underline-offset-4 decoration-veyro-border hover:decoration-veyro-black">
              {isWatch ? "Case Size Guide" : "Size & Fit Guide"}
            </span>
          </button>
        </div>

        {/* Dynamic Pill Size Grid */}
        <div className={`flex flex-wrap gap-2 sm:gap-2.5 ${isOutOfStock ? "pointer-events-none opacity-50" : ""}`}>
          {product.sizes.map((size) => {
            const isSelected = selectedSize === size;
            return (
              <button
                key={size}
                type="button"
                onClick={() => handleSizeSelect(size)}
                className={`h-11 px-5 flex items-center justify-center text-xs font-bold uppercase tracking-wider rounded-full transition-all duration-200 cursor-pointer border-2 active:scale-[0.96] ${
                  isSelected
                    ? "bg-veyro-black text-white border-veyro-black shadow-md scale-[1.03]"
                    : "bg-white text-veyro-black border-neutral-200 hover:border-veyro-black hover:shadow-sm"
                }`}
              >
                {isSelected && <Check size={11} className="mr-1.5 stroke-[3]" />}
                {size}
              </button>
            );
          })}
        </div>

        {/* Size Error Feedback */}
        {sizeError && !isOutOfStock && (
          <p className="mt-2.5 text-xs font-semibold text-red-600 flex items-center gap-1">
            <span className="w-1.5 h-1.5 rounded-full bg-red-600 inline-block" />
            Please select a size to proceed.
          </p>
        )}

        {/* Editorial Fit Description */}
        <p className="mt-3 text-xs text-veyro-muted leading-relaxed">
          {product.sizeGuide || (isWatch ? "Designed for versatile wear across casual and formal profiles" : isFootwear ? "True to size — order your regular UK size" : "Model is 185cm (6'1\") wearing Size L · Tailored with intentional relaxed drape")}
        </p>
      </div>

      {/* Out of Stock Waitlist Banner */}
      {isOutOfStock && (
        <div
          role="alert"
          className="mb-4 bg-neutral-100 border border-neutral-200 rounded-xl p-3 flex items-center justify-between gap-3 text-xs text-neutral-600"
        >
          <div className="flex items-center gap-2">
            <span className="text-red-600 font-bold" aria-hidden="true">⚑</span>
            <span>This item is currently out of stock. Join the waitlist to be notified.</span>
          </div>
          <button
            type="button"
            onClick={() => toggleWishlist(product, selectedSize || undefined)}
            className="inline-flex items-center gap-1.5 text-xs font-semibold text-neutral-900 hover:underline shrink-0 cursor-pointer"
          >
            <HeartIcon
              size={14}
              filled={isWishlisted}
              className={isWishlisted ? "text-red-500 fill-red-500" : "text-neutral-900"}
            />
            <span>{isWishlisted ? "Wishlisted" : "Wishlist"}</span>
          </button>
        </div>
      )}

      {/* 7. Purchase Action Bar */}
      <div className="flex flex-col gap-3 mb-6">
        <div className="flex gap-2.5 items-center">
          {/* Pill Quantity Stepper (hidden if OOS) */}
          {!isOutOfStock && (
            <div className="flex items-center gap-1 bg-neutral-100 rounded-full p-1 shrink-0">
              <button
                type="button"
                onClick={() => setQuantity((q) => Math.max(1, q - 1))}
                className="w-9 h-9 rounded-full bg-white shadow-sm flex items-center justify-center text-veyro-black hover:bg-neutral-50 active:scale-90 transition-all cursor-pointer border border-neutral-200"
                aria-label="Decrease quantity"
              >
                <Minus size={12} className="stroke-[2.5]" />
              </button>
              <span className="w-8 text-center text-sm font-black text-veyro-black select-none tabular-nums">
                {quantity}
              </span>
              <button
                type="button"
                onClick={() => setQuantity((q) => q + 1)}
                className="w-9 h-9 rounded-full bg-white shadow-sm flex items-center justify-center text-veyro-black hover:bg-neutral-50 active:scale-90 transition-all cursor-pointer border border-neutral-200"
                aria-label="Increase quantity"
              >
                <Plus size={12} className="stroke-[2.5]" />
              </button>
            </div>
          )}

          {/* Primary ADD TO BAG CTA / Sold Out Button */}
          {isOutOfStock ? (
            <button
              type="button"
              disabled
              aria-disabled="true"
              className="flex-1 h-12 px-6 rounded-2xl text-xs font-bold uppercase tracking-[0.15em] flex items-center justify-center gap-2.5 bg-neutral-200 text-neutral-500 cursor-not-allowed opacity-60 shadow-none border border-neutral-300"
            >
              <PackageX size={16} />
              <span>Sold Out</span>
            </button>
          ) : (
            <button
              type="button"
              onClick={handleAddToCart}
              className={`flex-1 h-12 px-6 rounded-2xl text-xs font-bold uppercase tracking-[0.15em] flex items-center justify-center gap-2.5 transition-all duration-200 cursor-pointer shadow-md ${
                isAdding
                  ? "bg-emerald-600 text-white shadow-emerald-200"
                  : "bg-veyro-black text-white hover:bg-veyro-charcoal hover:shadow-lg active:scale-[0.98]"
              }`}
            >
              {isAdding ? (
                <>
                  <CheckIcon size={16} />
                  <span>Added!</span>
                </>
              ) : (
                <>
                  <ShoppingBagIcon size={16} />
                  <span>Add to Bag</span>
                </>
              )}
            </button>
          )}

          {/* Wishlist Circle Button */}
          <button
            type="button"
            onClick={() => toggleWishlist(product, selectedSize || undefined)}
            aria-label={isWishlisted ? "Remove from Wishlist" : "Add to Wishlist"}
            className={`w-12 h-12 rounded-full border-2 flex items-center justify-center transition-all duration-200 cursor-pointer shrink-0 active:scale-90 ${
              isWishlisted
                ? "bg-red-50 border-red-300 shadow-sm shadow-red-100"
                : "border-neutral-200 text-veyro-black hover:border-neutral-400 bg-white hover:shadow-sm"
            }`}
          >
            <HeartIcon
              size={19}
              filled={isWishlisted}
              className={isWishlisted ? "text-red-500 fill-red-500" : "text-veyro-black"}
            />
          </button>
        </div>

        {/* Instant BUY NOW CTA / Not Available Button */}
        {isOutOfStock ? (
          <button
            type="button"
            disabled
            aria-disabled="true"
            className="w-full h-13 px-6 rounded-full text-xs font-black uppercase tracking-[0.18em] bg-neutral-200 text-neutral-400 cursor-not-allowed opacity-60 flex items-center justify-center gap-2.5 shadow-none border border-neutral-300"
          >
            <span>Not Available</span>
          </button>
        ) : (
          <button
            type="button"
            onClick={handleBuyNow}
            className="group w-full h-13 px-6 rounded-full text-xs font-black uppercase tracking-[0.18em] bg-veyro-yellow text-veyro-black hover:bg-veyro-yellow-dark active:scale-[0.99] flex items-center justify-center gap-2.5 transition-all duration-200 shadow-md hover:shadow-lg cursor-pointer"
          >
            <span>Buy Now</span>
            <ArrowRight size={15} className="stroke-[2.5] transition-transform duration-200 group-hover:translate-x-1.5" />
          </button>
        )}
      </div>

      {/* Priority Restock Waitlist Card for Sold Out Items */}
      {isOutOfStock && (
        <div className="bg-neutral-50/90 border border-neutral-200/90 rounded-2xl p-4 sm:p-5 mb-5 shadow-2xs">
          <div className="flex items-start gap-3 mb-3">
            <div className="w-8 h-8 rounded-full bg-neutral-900 text-white flex items-center justify-center shrink-0">
              <Bell size={15} />
            </div>
            <div>
              <h4 className="text-xs font-bold uppercase tracking-wider text-neutral-900">
                Notify Me When Restocked
              </h4>
              <p className="text-[11px] text-neutral-500 mt-0.5 leading-relaxed">
                Join the priority waitlist for this piece. We&apos;ll alert you the moment inventory is replenished.
              </p>
            </div>
          </div>

          {isSubscribedToRestock ? (
            <div className="flex items-center gap-2 p-3 bg-emerald-50 border border-emerald-200 rounded-xl text-emerald-800 text-xs font-medium">
              <Check size={14} className="text-emerald-600 shrink-0" />
              <span>You&apos;re on the priority waitlist. We will notify you upon restock.</span>
            </div>
          ) : (
            <form onSubmit={handleRestockSubscribe} className="space-y-2">
              <div className="flex gap-2">
                <input
                  type="email"
                  required
                  value={restockEmail}
                  onChange={(e) => setRestockEmail(e.target.value)}
                  placeholder="ENTER YOUR EMAIL"
                  className="flex-1 bg-white border border-neutral-300 rounded-xl px-3.5 py-2.5 text-xs text-neutral-900 uppercase font-mono placeholder:text-neutral-400 placeholder:normal-case focus-visible:outline-hidden focus-visible:ring-2 focus-visible:ring-black"
                />
                <button
                  type="submit"
                  className="bg-neutral-950 hover:bg-black text-white text-xs font-bold uppercase tracking-wider px-4 py-2.5 rounded-xl transition-all cursor-pointer shrink-0"
                >
                  Notify Me
                </button>
              </div>
            </form>
          )}
        </div>
      )}

      {/* 8. Minimalist Luxury Trust Strip */}
      <div className="grid grid-cols-3 gap-3 py-4 border-y border-veyro-border-light my-2 text-center">
        <div className="flex flex-col items-center">
          <Truck size={16} className="text-veyro-black mb-1 stroke-[1.75]" />
          <span className="text-[10px] font-bold uppercase tracking-wider text-veyro-black">
            Free Shipping
          </span>
          <span className="text-[10px] text-veyro-muted">On orders ₹999+</span>
        </div>
        <div className="flex flex-col items-center border-x border-veyro-border-light px-2">
          <RotateCcw size={16} className="text-veyro-black mb-1 stroke-[1.75]" />
          <span className="text-[10px] font-bold uppercase tracking-wider text-veyro-black">
            {isWatch ? "Authenticity Guaranteed" : "7-Day Returns"}
          </span>
          <span className="text-[10px] text-veyro-muted">
            {isWatch ? "Swiss Movement / 1-Year Warranty" : isFootwear ? "Free doorstep swap" : "Doorstep pickup"}
          </span>
        </div>
        <div className="flex flex-col items-center">
          <Sparkles size={16} className="text-veyro-black mb-1 stroke-[1.75]" />
          <span className="text-[10px] font-bold uppercase tracking-wider text-veyro-black">
            {isWatch ? "Premium Materials" : isFootwear ? "Vulcanized Grip" : "240+ GSM Cotton"}
          </span>
          <span className="text-[10px] text-veyro-muted">
            {isWatch ? "Sapphire Crystal" : isFootwear ? "High-traction rubber" : "Tirupur mill-grade"}
          </span>
        </div>
      </div>

      {/* 9. Seamless Inline Pincode Check */}
      <div className="my-6 pb-6 border-b border-veyro-border-light">
        <label
          htmlFor="pincode-input"
          className="block text-xs font-bold uppercase tracking-wider text-veyro-black mb-2"
        >
          Delivery Timeline & Availability
        </label>
        <form onSubmit={handleCheckPincode} className="flex gap-2">
          <input
            id="pincode-input"
            type="text"
            maxLength={6}
            value={pincode}
            onChange={(e) => setPincode(e.target.value.replace(/\D/g, ""))}
            placeholder="Enter 6-digit Pincode"
            className="flex-1 bg-neutral-50/80 border border-neutral-300 rounded-full px-4 py-2.5 text-xs text-neutral-900 placeholder:text-neutral-400 focus:outline-none focus:border-black transition-colors"
          />
          <button
            type="submit"
            className="px-6 py-2.5 bg-[#111111] hover:bg-neutral-800 text-white text-xs font-bold uppercase tracking-wider rounded-full transition-colors cursor-pointer shadow-2xs"
          >
            Check
          </button>
        </form>
        {deliveryEstimate && (
          <p className="mt-2.5 text-xs text-emerald-700 font-medium flex items-center gap-1.5">
            <Check size={13} className="stroke-[3]" />
            {deliveryEstimate}
          </p>
        )}
      </div>

      {/* 10. Editorial Hairline Accordions */}
      <div className="divide-y divide-veyro-border-light">
        {/* Accordion 1: Silhouette & Specifications */}
        <div className="py-4">
          <button
            type="button"
            onClick={() =>
              setOpenSection(openSection === "specs" ? null : "specs")
            }
            className="w-full flex items-center justify-between text-xs font-bold uppercase tracking-wider text-veyro-black cursor-pointer text-left py-1"
          >
            <span>01. Silhouette & Specifications</span>
            {openSection === "specs" ? (
              <ChevronUp size={15} />
            ) : (
              <ChevronDown size={15} />
            )}
          </button>
          {openSection === "specs" && (
            <div className="pt-3 text-xs text-veyro-charcoal leading-relaxed space-y-3">
              <p className="text-veyro-subtle">{product.shortDescription}</p>
              <div className="grid grid-cols-2 gap-y-2 pt-2 border-t border-veyro-border-light text-[11px]">
                <div>
                  <span className="text-veyro-muted uppercase block font-mono">
                    {isWatch ? "Case & Crystal" : isFootwear ? "Upper & Outsole" : "Fabric Composition"}
                  </span>
                  <span className="font-semibold text-veyro-black">
                    {product.material || (isWatch ? "316L Stainless Steel & Sapphire Glass" : isFootwear ? "Suede & Rubber Outsole" : "100% Combed Indian Cotton, 240gsm")}
                  </span>
                </div>
                <div>
                  <span className="text-veyro-muted uppercase block font-mono">
                    {isWatch ? "Movement" : isFootwear ? "Profile Silhouette" : "Silhouette"}
                  </span>
                  <span className="font-semibold text-veyro-black">
                    {isWatch ? "Precision Quartz" : isFootwear ? `${product.subcategoryTag || "Retro"} Low-Top` : `${product.fit || "Relaxed"} Cut`}
                  </span>
                </div>
                <div>
                  <span className="text-veyro-muted uppercase block font-mono">
                    {isWatch ? "Water Resistance" : isFootwear ? "Sole Engineering" : "Provenance"}
                  </span>
                  <span className="font-semibold text-veyro-black">
                    {isWatch ? "5 ATM (50 Meters)" : isFootwear ? "Vulcanized & Gum Rubber Compound" : "Mill-finished in Tirupur, India"}
                  </span>
                </div>
                <div>
                  <span className="text-veyro-muted uppercase block font-mono">
                    {isWatch ? "Strap Construction" : isFootwear ? "Footbed Construction" : "Treatment"}
                  </span>
                  <span className="font-semibold text-veyro-black">
                    {isWatch ? "Interchangeable Quick-Release" : isFootwear ? "Cushioned Ergonomic Foam Bed" : "Pre-shrunk, Bio-washed"}
                  </span>
                </div>
              </div>
            </div>
          )}
        </div>

        {/* Accordion 2: Detailed Craftsmanship & Features */}
        <div className="py-4">
          <button
            type="button"
            onClick={() =>
              setOpenSection(openSection === "craft" ? null : "craft")
            }
            className="w-full flex items-center justify-between text-xs font-bold uppercase tracking-wider text-veyro-black cursor-pointer text-left py-1"
          >
            <span>02. Craftsmanship & Highlights</span>
            {openSection === "craft" ? (
              <ChevronUp size={15} />
            ) : (
              <ChevronDown size={15} />
            )}
          </button>
          {openSection === "craft" && (
            <div className="pt-3 text-xs text-veyro-subtle leading-relaxed space-y-2">
              {product.longDescription && <p>{product.longDescription}</p>}
              {product.features && product.features.length > 0 && (
                <ul className="space-y-1.5 pt-2 list-disc list-inside">
                  {product.features.map((feature, i) => (
                    <li key={i}>{feature}</li>
                  ))}
                </ul>
              )}
            </div>
          )}
        </div>

        {/* Accordion 3: Wash & Garment Care Ritual */}
        <div className="py-4">
          <button
            type="button"
            onClick={() =>
              setOpenSection(openSection === "care" ? null : "care")
            }
            className="w-full flex items-center justify-between text-xs font-bold uppercase tracking-wider text-veyro-black cursor-pointer text-left py-1"
          >
            <span>{isWatch ? "03. Watch Care & Maintenance" : isFootwear ? "03. Sneaker & Footwear Care" : "03. Wash & Garment Care"}</span>
            {openSection === "care" ? (
              <ChevronUp size={15} />
            ) : (
              <ChevronDown size={15} />
            )}
          </button>
          {openSection === "care" && (
            <ul className="pt-3 text-xs text-veyro-subtle leading-relaxed space-y-1.5 list-disc list-inside">
              {product.care && product.care.length > 0 ? (
                product.care.map((item, i) => <li key={i}>{item}</li>)
              ) : isWatch ? (
                <>
                  <li>Clean case and crystal with a soft microfiber cloth</li>
                  <li>Avoid exposing leather straps to water or extreme humidity</li>
                  <li>Keep away from strong magnetic fields to protect the movement</li>
                  <li>Have the battery replaced only by certified professionals</li>
                </>
              ) : isFootwear ? (
                <>
                  <li>Spot clean upper with a soft brush and mild sneaker cleanser</li>
                  <li>Wipe rubber and gum outsoles with a damp microfiber cloth</li>
                  <li>Air dry naturally away from direct heat or intense sunlight</li>
                  <li>Use cedar shoe trees or paper stuffing to maintain structured shape</li>
                </>
              ) : (
                <>
                  <li>Machine wash cold with like colors inside out</li>
                  <li>Do not bleach or tumble dry</li>
                  <li>Flat air dry in shade to preserve fabric drape</li>
                  <li>Cool iron on reverse side, avoid direct heat on print</li>
                </>
              )}
            </ul>
          )}
        </div>

        {/* Accordion 4: Complimentary Shipping & Returns */}
        <div className="py-4">
          <button
            type="button"
            onClick={() =>
              setOpenSection(openSection === "shipping" ? null : "shipping")
            }
            className="w-full flex items-center justify-between text-xs font-bold uppercase tracking-wider text-veyro-black cursor-pointer text-left py-1"
          >
            <span>04. Complimentary Shipping & 7-Day Returns</span>
            {openSection === "shipping" ? (
              <ChevronUp size={15} />
            ) : (
              <ChevronDown size={15} />
            )}
          </button>
          {openSection === "shipping" && (
            <div className="pt-3 text-xs text-veyro-subtle leading-relaxed space-y-2">
              <p>
                <strong>Complimentary Express Delivery:</strong> All orders above ₹999 qualify for free express shipping. Prepaid orders dispatch within 24 business hours from our central fulfillment hub.
              </p>
              <p>
                <strong>Hassle-Free 7-Day Returns:</strong> If the fit or feel doesn&apos;t meet your standards, request a doorstep pickup within 7 days of delivery.
              </p>
            </div>
          )}
        </div>


      </div>

      {/* 11. Editorial Size & Measurement Guide Modal */}
      {isSizeGuideOpen && (
        <div
          className="fixed inset-0 z-50 flex items-center justify-center p-3 sm:p-5"
          role="dialog"
          aria-modal="true"
          aria-labelledby="size-guide-modal-title"
        >
          <div
            className="fixed inset-0 bg-black/60 backdrop-blur-sm transition-opacity"
            onClick={() => setIsSizeGuideOpen(false)}
          />
          <div className="relative z-10 w-full max-w-2xl bg-white p-6 sm:p-8 rounded-3xl shadow-2xl border border-neutral-200/80 flex flex-col max-h-[90vh] overflow-hidden animate-in fade-in zoom-in-95 duration-200">
            {/* Modal Header */}
            <div className="flex items-center justify-between pb-4 border-b border-neutral-100 mb-4">
              <div>
                <span className="text-[10px] font-bold tracking-widest text-neutral-600 uppercase block font-mono">
                  {isWatch
                    ? "Horology Fit & Case Proportions"
                    : isFootwear
                    ? "Footwear Sizing & Conversion Spec"
                    : "Atelier Garment Measurements"}
                </span>
                <h3
                  id="size-guide-modal-title"
                  className="text-lg sm:text-xl font-black uppercase tracking-tight text-neutral-950 mt-0.5"
                >
                  {isWatch
                    ? "Watch Case Diameter & Wrist Scale Guide"
                    : isFootwear
                    ? "Footwear Sizing & Conversion Guide"
                    : "T-Shirt Size & Measurement Guide"}
                </h3>
              </div>
              <button
                type="button"
                onClick={() => setIsSizeGuideOpen(false)}
                aria-label="Close size guide"
                className="w-9 h-9 rounded-full bg-neutral-100 hover:bg-neutral-200 text-neutral-600 hover:text-black flex items-center justify-center transition-all cursor-pointer"
              >
                <X size={18} />
              </button>
            </div>

            {/* Scrollable Content Body */}
            <div className="overflow-y-auto space-y-5 pr-1 text-neutral-950">
              {/* Unit switcher */}
              <div className="flex items-center justify-between">
                <span className="text-xs text-neutral-700 font-medium">
                  {isWatch
                    ? "Measurements in millimeters (mm) & wrist circumference"
                    : isFootwear
                    ? "Standard foot length measured heel-to-toe"
                    : "Garment measurements laid flat"}
                </span>
                <div className="inline-flex items-center bg-neutral-100 p-1 rounded-full border border-neutral-200 text-xs">
                  <button
                    type="button"
                    onClick={() => setUnitMode("in")}
                    className={`px-3.5 py-1 font-bold rounded-full transition-all cursor-pointer ${
                      unitMode === "in"
                        ? "bg-neutral-950 text-white shadow-xs"
                        : "text-neutral-600 hover:text-black"
                    }`}
                  >
                    INCHES
                  </button>
                  <button
                    type="button"
                    onClick={() => setUnitMode("cm")}
                    className={`px-3.5 py-1 font-bold rounded-full transition-all cursor-pointer ${
                      unitMode === "cm"
                        ? "bg-neutral-950 text-white shadow-xs"
                        : "text-neutral-600 hover:text-black"
                    }`}
                  >
                    CM
                  </button>
                </div>
              </div>

              {/* Sizing Table */}
              <div className="border border-neutral-200/90 rounded-2xl overflow-hidden shadow-xs bg-white">
                {isWatch ? (
                  <table className="w-full text-xs">
                    <thead className="bg-neutral-100/90 text-neutral-900 font-extrabold uppercase text-[11px] tracking-wider border-b border-neutral-200">
                      <tr>
                        <th className="py-3 px-3.5 text-left">Case Size</th>
                        <th className="py-3 px-3 text-center">Lug-to-Lug</th>
                        <th className="py-3 px-3 text-center">Thickness</th>
                        <th className="py-3 px-3 text-center">Strap Width</th>
                        <th className="py-3 px-3 text-center">Wrist Fit ({unitMode.toUpperCase()})</th>
                        <th className="py-3 px-3.5 text-left">Aesthetic Profile</th>
                      </tr>
                    </thead>
                    <tbody className="divide-y divide-neutral-100 text-neutral-950 font-medium">
                      {WATCH_SIZING_ROWS.map((row) => {
                        const isCurrentModel =
                          (product.caseDiameter &&
                            row.caseDiameter.toLowerCase().includes(
                              product.caseDiameter.toLowerCase().replace(/\s+/g, "")
                            )) ||
                          (product.sizeGuide &&
                            product.sizeGuide
                              .toLowerCase()
                              .includes(row.caseDiameter.split(" ")[0].toLowerCase()));
                        return (
                          <tr
                            key={row.caseDiameter}
                            className={`transition-colors ${
                              isCurrentModel
                                ? "bg-neutral-100/90 font-bold text-neutral-950"
                                : "hover:bg-neutral-50/80 text-neutral-800"
                            }`}
                          >
                            <td className="py-3.5 px-3.5 text-left">
                              <div className="flex items-center gap-2">
                                <span className="font-extrabold text-sm text-neutral-950">{row.caseDiameter}</span>
                                {isCurrentModel && (
                                  <span className="inline-flex items-center gap-1 bg-neutral-950 text-white text-[9px] font-bold px-2 py-0.5 rounded-full uppercase tracking-wider">
                                    <Check size={9} strokeWidth={3} />
                                    Current Model
                                  </span>
                                )}
                              </div>
                            </td>
                            <td className="py-3.5 px-3 text-center font-medium text-neutral-800">{row.lugToLug}</td>
                            <td className="py-3.5 px-3 text-center font-medium text-neutral-800">{row.thickness}</td>
                            <td className="py-3.5 px-3 text-center font-medium text-neutral-800">{row.strapWidth}</td>
                            <td className="py-3.5 px-3 text-center font-bold text-neutral-950">
                              {unitMode === "in" ? row.wristIn : row.wristCm}
                            </td>
                            <td className="py-3.5 px-3.5 text-left font-medium text-neutral-700 text-[11px]">{row.profile}</td>
                          </tr>
                        );
                      })}
                    </tbody>
                  </table>
                ) : isFootwear ? (
                  <table className="w-full text-xs">
                    <thead className="bg-neutral-100/90 text-neutral-900 font-extrabold uppercase text-[11px] tracking-wider border-b border-neutral-200">
                      <tr>
                        <th className="py-3 px-4 text-left w-1/4">UK (India)</th>
                        <th className="py-3 px-4 text-center w-1/4">US Men</th>
                        <th className="py-3 px-4 text-center w-1/4">EU</th>
                        <th className="py-3 px-4 text-center w-1/4">Foot Length ({unitMode === "in" ? "IN" : "CM"})</th>
                      </tr>
                    </thead>
                    <tbody className="divide-y divide-neutral-100 text-neutral-950 font-medium">
                      {FOOTWEAR_SIZING_ROWS.map((row) => {
                        const isRowSelected = selectedSize === row.uk;
                        return (
                          <tr
                            key={row.uk}
                            onClick={() => handleSizeSelect(row.uk)}
                            className={`cursor-pointer transition-colors ${
                              isRowSelected
                                ? "bg-neutral-100/90 font-bold text-neutral-950"
                                : "hover:bg-neutral-50/80 text-neutral-800"
                            }`}
                          >
                            <td className="py-3.5 px-4 text-left">
                              <div className="flex items-center gap-2">
                                <span className="font-extrabold text-sm text-neutral-950">{row.uk}</span>
                                {isRowSelected && (
                                  <span className="inline-flex items-center gap-1 bg-neutral-950 text-white text-[9px] font-bold px-2 py-0.5 rounded-full uppercase tracking-wider">
                                    <Check size={9} strokeWidth={3} />
                                    Selected
                                  </span>
                                )}
                              </div>
                            </td>
                            <td className="py-3.5 px-4 text-center font-semibold text-neutral-800">{row.us}</td>
                            <td className="py-3.5 px-4 text-center font-semibold text-neutral-800">{row.eu}</td>
                            <td className="py-3.5 px-4 text-center font-bold text-neutral-950">
                              {unitMode === "in" ? `${row.lengthIn} in` : `${row.lengthCm} cm`}
                            </td>
                          </tr>
                        );
                      })}
                    </tbody>
                  </table>
                ) : (
                  <table className="w-full text-xs">
                    <thead className="bg-neutral-100/90 text-neutral-900 font-extrabold uppercase text-[11px] tracking-wider border-b border-neutral-200">
                      <tr>
                        <th className="py-3 px-4 text-left w-1/4">Size</th>
                        <th className="py-3 px-4 text-center w-1/4">Chest ({unitMode.toUpperCase()})</th>
                        <th className="py-3 px-4 text-center w-1/4">Length ({unitMode.toUpperCase()})</th>
                        <th className="py-3 px-4 text-center w-1/4">Shoulder ({unitMode.toUpperCase()})</th>
                      </tr>
                    </thead>
                    <tbody className="divide-y divide-neutral-100 text-neutral-950 font-medium">
                      {APPAREL_SIZING_ROWS.map((row) => {
                        const isRowSelected = selectedSize === row.size;
                        return (
                          <tr
                            key={row.size}
                            onClick={() => handleSizeSelect(row.size)}
                            className={`cursor-pointer transition-colors ${
                              isRowSelected
                                ? "bg-neutral-100/90 font-bold text-neutral-950"
                                : "hover:bg-neutral-50/80 text-neutral-800"
                            }`}
                          >
                            <td className="py-3.5 px-4 text-left">
                              <div className="flex items-center gap-2">
                                <span className="font-extrabold text-sm text-neutral-950">{row.size}</span>
                                {isRowSelected && (
                                  <span className="inline-flex items-center gap-1 bg-neutral-950 text-white text-[9px] font-bold px-2 py-0.5 rounded-full uppercase tracking-wider">
                                    <Check size={9} strokeWidth={3} />
                                    Selected
                                  </span>
                                )}
                              </div>
                            </td>
                            <td className="py-3.5 px-4 text-center font-semibold text-neutral-900">
                              {unitMode === "in" ? row.chestIn : row.chestCm}
                            </td>
                            <td className="py-3.5 px-4 text-center font-semibold text-neutral-900">
                              {unitMode === "in" ? row.lengthIn : row.lengthCm}
                            </td>
                            <td className="py-3.5 px-4 text-center font-semibold text-neutral-900">
                              {unitMode === "in" ? row.shoulderIn : row.shoulderCm}
                            </td>
                          </tr>
                        );
                      })}
                    </tbody>
                  </table>
                )}
              </div>

              {/* How to measure and fit advice */}
              {isWatch ? (
                <div className="space-y-3.5">
                  <h4 className="text-xs font-bold uppercase tracking-wider text-neutral-950">
                    How to Choose Your Watch Proportion
                  </h4>
                  <div className="grid grid-cols-1 sm:grid-cols-3 gap-2.5 text-xs">
                    <div className="p-3.5 bg-neutral-50/80 border border-neutral-200/80 rounded-2xl">
                      <span className="font-bold text-neutral-950 block mb-1">1. Wrist Circumference</span>
                      <p className="text-neutral-800 leading-relaxed font-normal">
                        Wrap a flexible tailor&apos;s tape or paper strip just below your wrist bone where your watch will sit.
                      </p>
                    </div>
                    <div className="p-3.5 bg-neutral-50/80 border border-neutral-200/80 rounded-2xl">
                      <span className="font-bold text-neutral-950 block mb-1">2. Lug Overhang Check</span>
                      <p className="text-neutral-800 leading-relaxed font-normal">
                        Ensure the watch&apos;s lug-to-lug distance does not exceed your wrist width for a flush, balanced drape.
                      </p>
                    </div>
                    <div className="p-3.5 bg-neutral-50/80 border border-neutral-200/80 rounded-2xl">
                      <span className="font-bold text-neutral-950 block mb-1">3. Dial &amp; Cuff Clearance</span>
                      <p className="text-neutral-800 leading-relaxed font-normal">
                        36mm–40mm slides effortlessly under formal cuffs; 42mm–45mm delivers commanding wrist presence.
                      </p>
                    </div>
                  </div>

                  <div className="p-3.5 bg-neutral-50/80 border border-neutral-200/80 rounded-2xl text-xs text-neutral-800 leading-relaxed">
                    <p>
                      <strong className="text-neutral-950 font-bold">Fit &amp; Horology Note:</strong> {product.sizeGuide || "Precision engineered Swiss & Japanese mechanical calibres. Micro-adjustable strap clasp and extra links provided for a custom bespoke fit."}
                    </p>
                  </div>
                </div>
              ) : isFootwear ? (
                <div className="space-y-3.5">
                  <h4 className="text-xs font-bold uppercase tracking-wider text-neutral-950">
                    How to Measure Your Foot Length
                  </h4>
                  <div className="grid grid-cols-1 sm:grid-cols-3 gap-2.5 text-xs">
                    <div className="p-3.5 bg-neutral-50/80 border border-neutral-200/80 rounded-2xl">
                      <span className="font-bold text-neutral-950 block mb-1">1. Stand on Paper</span>
                      <p className="text-neutral-800 leading-relaxed font-normal">
                        Tape paper against a wall. Stand flat with your heel touching the wall.
                      </p>
                    </div>
                    <div className="p-3.5 bg-neutral-50/80 border border-neutral-200/80 rounded-2xl">
                      <span className="font-bold text-neutral-950 block mb-1">2. Mark Longest Toe</span>
                      <p className="text-neutral-800 leading-relaxed font-normal">
                        With a vertical pencil, draw a line at the tip of your longest toe.
                      </p>
                    </div>
                    <div className="p-3.5 bg-neutral-50/80 border border-neutral-200/80 rounded-2xl">
                      <span className="font-bold text-neutral-950 block mb-1">3. Measure &amp; Match</span>
                      <p className="text-neutral-800 leading-relaxed font-normal">
                        Measure from paper edge to the mark and match with the table above.
                      </p>
                    </div>
                  </div>

                  <div className="p-3.5 bg-neutral-50/80 border border-neutral-200/80 rounded-2xl space-y-1 text-xs text-neutral-800 leading-relaxed">
                    <p>
                      <strong className="text-neutral-950 font-bold">Fit Guidance:</strong> VEYRO sneakers fit true to standard UK athletic and lifestyle sizing. If you wear half sizes (e.g. UK 8.5) or have wider feet, we recommend ordering one size up (UK 9).
                    </p>
                  </div>
                </div>
              ) : (
                <div className="space-y-3.5">
                  <h4 className="text-xs font-bold uppercase tracking-wider text-neutral-950">
                    How to Measure Your Garment
                  </h4>
                  <div className="grid grid-cols-1 sm:grid-cols-3 gap-2.5 text-xs">
                    <div className="p-3.5 bg-neutral-50/80 border border-neutral-200/80 rounded-2xl">
                      <span className="font-bold text-neutral-950 block mb-1">Chest Width</span>
                      <p className="text-neutral-800 leading-relaxed font-normal">
                        Armpit-to-armpit seam across the fullest part, doubled for circumference.
                      </p>
                    </div>
                    <div className="p-3.5 bg-neutral-50/80 border border-neutral-200/80 rounded-2xl">
                      <span className="font-bold text-neutral-950 block mb-1">Body Length</span>
                      <p className="text-neutral-800 leading-relaxed font-normal">
                        From the highest point of the neck ribbing straight down to the bottom hem.
                      </p>
                    </div>
                    <div className="p-3.5 bg-neutral-50/80 border border-neutral-200/80 rounded-2xl">
                      <span className="font-bold text-neutral-950 block mb-1">Shoulder Span</span>
                      <p className="text-neutral-800 leading-relaxed font-normal">
                        Straight across the back yoke from left shoulder point to right shoulder point.
                      </p>
                    </div>
                  </div>

                  <div className="p-3.5 bg-neutral-50/80 border border-neutral-200/80 rounded-2xl text-xs text-neutral-800 leading-relaxed">
                    <p>
                      <strong className="text-neutral-950 font-bold">Fit Silhouette:</strong> {product.fit === "Oversized" ? "Deliberate drop-shoulder drape with generous chest volume. Take your true size for the oversized streetwear silhouette, or size down one for a regular fit." : "Designed with classic structured proportions. Fits true to size."}
                    </p>
                  </div>
                </div>
              )}
            </div>

            {/* Modal Footer */}
            <div className="pt-4 border-t border-neutral-100 mt-4 flex gap-3">
              <button
                type="button"
                onClick={() => setIsSizeGuideOpen(false)}
                className="w-full bg-[#111111] hover:bg-neutral-800 active:scale-[0.99] text-white py-3.5 text-xs font-bold uppercase tracking-wider rounded-full shadow-md transition-all cursor-pointer flex items-center justify-center gap-2"
              >
                {selectedSize ? `Continue with ${selectedSize}` : "Back to Product"}
              </button>
            </div>
          </div>
        </div>
      )}
    </div>
  );
}
