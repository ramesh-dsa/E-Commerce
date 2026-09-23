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
  const [isSizeGuideOpen, setIsSizeGuideOpen] = useState(false);
  const [unitMode, setUnitMode] = useState<"in" | "cm">("in");

  const isFootwear =
    product.category?.toLowerCase() === "footwear" ||
    product.subcategory?.toLowerCase() === "shoes" ||
    product.id.startsWith("vey-ftw");
  const isWatch = product.category === "Watches";

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
      {/* Badge (if present) */}
      {product.badge && (
        <div className="mb-3">
          <span className="inline-block bg-veyro-black text-white text-[10px] font-bold px-2.5 py-0.5 rounded-[2px] tracking-widest uppercase">
            {product.badge}
          </span>
        </div>
      )}

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
          <span className="bg-veyro-yellow text-veyro-black text-[11px] font-black px-2 py-0.5 rounded-[2px] tracking-wider uppercase">
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
        <div className={`flex flex-wrap gap-2 sm:gap-2.5`}>
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
        {sizeError && (
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

      {/* 7. Purchase Action Bar */}
      <div className="flex flex-col gap-3 mb-6">
        <div className="flex gap-2.5 items-center">
          {/* Pill Quantity Stepper */}
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

          {/* Primary ADD TO BAG CTA */}
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

        {/* Instant BUY NOW CTA - Full Pill */}
        <button
          type="button"
          onClick={handleBuyNow}
          className="group w-full h-13 px-6 rounded-full text-xs font-black uppercase tracking-[0.18em] bg-veyro-yellow text-veyro-black hover:bg-veyro-yellow-dark active:scale-[0.99] flex items-center justify-center gap-2.5 transition-all duration-200 shadow-md hover:shadow-lg cursor-pointer"
        >
          <span>Buy Now</span>
          <ArrowRight size={15} className="stroke-[2.5] transition-transform duration-200 group-hover:translate-x-1.5" />
        </button>
      </div>

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
            {isWatch ? "Authenticity Guaranteed" : isFootwear ? "Size Exchange" : "7-Day Returns"}
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
            className="flex-1 bg-veyro-surface border border-veyro-border rounded-[2px] px-3.5 py-2.5 text-xs text-veyro-black placeholder:text-veyro-muted focus:outline-none focus:border-veyro-black transition-colors"
          />
          <button
            type="submit"
            className="px-5 py-2.5 bg-veyro-surface-alt hover:bg-veyro-border text-veyro-black text-xs font-bold uppercase tracking-wider rounded-[2px] transition-colors cursor-pointer"
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
                <strong>Hassle-Free 7-Day Returns:</strong> If the fit or feel doesn&apos;t meet your standards, request a doorstep pickup or size exchange within 7 days of delivery.
              </p>
            </div>
          )}
        </div>


      </div>

      {/* 11. Editorial Size & Measurement Guide Modal */}
      {isSizeGuideOpen && (
        <div
          className="fixed inset-0 z-50 flex items-center justify-center p-3 sm:p-4"
          role="dialog"
          aria-modal="true"
          aria-labelledby="size-guide-modal-title"
        >
          <div
            className="fixed inset-0 bg-black/65 backdrop-blur-xs transition-opacity"
            onClick={() => setIsSizeGuideOpen(false)}
          />
          <div className="relative z-10 w-full max-w-xl bg-white p-6 sm:p-8 rounded-[2px] shadow-2xl border border-veyro-border flex flex-col max-h-[90vh] overflow-hidden animate-in fade-in zoom-in-95 duration-200">
            {/* Modal Header */}
            <div className="flex items-center justify-between pb-4 border-b border-veyro-border mb-4">
              <div>
                <span className="text-[10px] font-mono tracking-widest text-veyro-muted uppercase block">
                  {isWatch ? "[ VEYRO HOROLOGY // CASE SPEC ]" : isFootwear ? "[ VEYRO FOOTWEAR // SIZE & CONVERSION SPEC ]" : "[ VEYRO ATELIER // FIT REFERENCE ]"}
                </span>
                <h3 id="size-guide-modal-title" className="text-lg sm:text-xl font-black uppercase tracking-tight text-veyro-black mt-0.5">
                  {isWatch ? "Case Size Guide" : isFootwear ? "Footwear Sizing & Conversion Guide" : "Size & Measurement Guide"}
                </h3>
              </div>
              <button
                type="button"
                onClick={() => setIsSizeGuideOpen(false)}
                aria-label="Close size guide"
                className="p-1.5 rounded-full text-neutral-400 hover:text-black hover:bg-neutral-100 transition-colors cursor-pointer"
              >
                <X size={20} />
              </button>
            </div>

            {/* Scrollable Content Body */}
            <div className="overflow-y-auto space-y-5 pr-1">
              {/* Unit switcher */}
              <div className="flex items-center justify-between">
                <span className="text-xs text-veyro-subtle font-medium">
                  {isFootwear
                    ? "Standard foot length measured heel-to-toe"
                    : "Garment measurements laid flat"}
                </span>
                <div className="flex border border-veyro-border rounded-[2px] overflow-hidden text-xs">
                  <button
                    type="button"
                    onClick={() => setUnitMode("in")}
                    className={`px-3 py-1 font-bold ${
                      unitMode === "in"
                        ? "bg-veyro-black text-white"
                        : "bg-white text-veyro-black hover:bg-neutral-50"
                    }`}
                  >
                    INCHES
                  </button>
                  <button
                    type="button"
                    onClick={() => setUnitMode("cm")}
                    className={`px-3 py-1 font-bold ${
                      unitMode === "cm"
                        ? "bg-veyro-black text-white"
                        : "bg-white text-veyro-black hover:bg-neutral-50"
                    }`}
                  >
                    CM
                  </button>
                </div>
              </div>

              {/* Sizing Table */}
              <div className="border border-veyro-border rounded-[2px] overflow-hidden">
                {isFootwear ? (
                  <table className="w-full text-xs text-left">
                    <thead className="bg-veyro-surface text-veyro-muted font-bold uppercase text-[10px] tracking-wider border-b border-veyro-border">
                      <tr>
                        <th className="p-3">UK (India)</th>
                        <th className="p-3">US Men</th>
                        <th className="p-3">EU</th>
                        <th className="p-3">Foot Length ({unitMode === "in" ? "IN" : "CM"})</th>
                      </tr>
                    </thead>
                    <tbody className="divide-y divide-veyro-border-light text-veyro-black font-medium">
                      {FOOTWEAR_SIZING_ROWS.map((row) => {
                        const isRowSelected = selectedSize === row.uk;
                        return (
                          <tr
                            key={row.uk}
                            onClick={() => handleSizeSelect(row.uk)}
                            className={`cursor-pointer transition-colors ${
                              isRowSelected
                                ? "bg-amber-50/70 font-bold border-l-2 border-veyro-black"
                                : "hover:bg-neutral-50"
                            }`}
                          >
                            <td className="p-3 flex items-center gap-2">
                              <span className="font-bold">{row.uk}</span>
                              {isRowSelected && (
                                <span className="bg-veyro-black text-white text-[9px] font-black px-1.5 py-0.5 rounded-[2px] uppercase">
                                  Selected
                                </span>
                              )}
                            </td>
                            <td className="p-3 text-veyro-subtle">{row.us}</td>
                            <td className="p-3 text-veyro-subtle">{row.eu}</td>
                            <td className="p-3 font-semibold">
                              {unitMode === "in" ? `${row.lengthIn} in` : `${row.lengthCm} cm`}
                            </td>
                          </tr>
                        );
                      })}
                    </tbody>
                  </table>
                ) : (
                  <table className="w-full text-xs text-left">
                    <thead className="bg-veyro-surface text-veyro-muted font-bold uppercase text-[10px] tracking-wider border-b border-veyro-border">
                      <tr>
                        <th className="p-3">Size</th>
                        <th className="p-3">Chest ({unitMode})</th>
                        <th className="p-3">Length ({unitMode})</th>
                        <th className="p-3">Shoulder ({unitMode})</th>
                      </tr>
                    </thead>
                    <tbody className="divide-y divide-veyro-border-light text-veyro-black font-medium">
                      {APPAREL_SIZING_ROWS.map((row) => {
                        const isRowSelected = selectedSize === row.size;
                        return (
                          <tr
                            key={row.size}
                            onClick={() => handleSizeSelect(row.size)}
                            className={`cursor-pointer transition-colors ${
                              isRowSelected
                                ? "bg-amber-50/70 font-bold border-l-2 border-veyro-black"
                                : "hover:bg-neutral-50"
                            }`}
                          >
                            <td className="p-3 flex items-center gap-2">
                              <span className="font-bold">{row.size}</span>
                              {isRowSelected && (
                                <span className="bg-veyro-black text-white text-[9px] font-black px-1.5 py-0.5 rounded-[2px] uppercase">
                                  Selected
                                </span>
                              )}
                            </td>
                            <td className="p-3">{unitMode === "in" ? row.chestIn : row.chestCm}</td>
                            <td className="p-3">{unitMode === "in" ? row.lengthIn : row.lengthCm}</td>
                            <td className="p-3">{unitMode === "in" ? row.shoulderIn : row.shoulderCm}</td>
                          </tr>
                        );
                      })}
                    </tbody>
                  </table>
                )}
              </div>

              {/* How to measure and fit advice */}
              {isFootwear ? (
                <div className="space-y-3">
                  <h4 className="text-[11px] font-bold uppercase tracking-wider text-veyro-black">
                    How to Measure Your Foot Length
                  </h4>
                  <div className="grid grid-cols-1 sm:grid-cols-3 gap-2 text-[11px]">
                    <div className="p-2.5 bg-veyro-surface border border-veyro-border rounded-[2px]">
                      <span className="font-bold text-veyro-black block mb-0.5">1. Stand on Paper</span>
                      <p className="text-veyro-muted">
                        Tape paper against a wall. Stand flat with your heel touching the wall.
                      </p>
                    </div>
                    <div className="p-2.5 bg-veyro-surface border border-veyro-border rounded-[2px]">
                      <span className="font-bold text-veyro-black block mb-0.5">2. Mark Longest Toe</span>
                      <p className="text-veyro-muted">
                        With a vertical pencil, draw a line at the tip of your longest toe.
                      </p>
                    </div>
                    <div className="p-2.5 bg-veyro-surface border border-veyro-border rounded-[2px]">
                      <span className="font-bold text-veyro-black block mb-0.5">3. Measure &amp; Match</span>
                      <p className="text-veyro-muted">
                        Measure from paper edge to the mark and match with the table above.
                      </p>
                    </div>
                  </div>

                  <div className="p-3 bg-neutral-50 border border-veyro-border-light rounded-[2px] space-y-1 text-xs text-veyro-charcoal">
                    <p>
                      <strong>Fit Guidance:</strong> VEYRO sneakers fit true to standard UK athletic and lifestyle sizing. If you wear half sizes (e.g. UK 8.5) or have wider feet, we recommend ordering one size up (UK 9).
                    </p>
                  </div>

                  <div className="p-3 bg-veyro-surface-alt border border-veyro-border rounded-[2px] flex items-center gap-2.5 text-xs text-veyro-black">
                    <ShieldCheck size={18} className="text-emerald-700 shrink-0" />
                    <span>
                      <strong>Guaranteed Doorstep Fit:</strong> 7-day complimentary doorstep size exchange if you need a different size.
                    </span>
                  </div>
                </div>
              ) : (
                <div className="space-y-3">
                  <h4 className="text-[11px] font-bold uppercase tracking-wider text-veyro-black">
                    How to Measure Your Garment
                  </h4>
                  <div className="grid grid-cols-1 sm:grid-cols-3 gap-2 text-[11px]">
                    <div className="p-2.5 bg-veyro-surface border border-veyro-border rounded-[2px]">
                      <span className="font-bold text-veyro-black block mb-0.5">Chest Width</span>
                      <p className="text-veyro-muted">
                        Armpit-to-armpit seam across the fullest part, doubled for circumference.
                      </p>
                    </div>
                    <div className="p-2.5 bg-veyro-surface border border-veyro-border rounded-[2px]">
                      <span className="font-bold text-veyro-black block mb-0.5">Body Length</span>
                      <p className="text-veyro-muted">
                        From the highest point of the neck ribbing straight down to the bottom hem.
                      </p>
                    </div>
                    <div className="p-2.5 bg-veyro-surface border border-veyro-border rounded-[2px]">
                      <span className="font-bold text-veyro-black block mb-0.5">Shoulder Span</span>
                      <p className="text-veyro-muted">
                        Straight across the back yoke from left shoulder point to right shoulder point.
                      </p>
                    </div>
                  </div>

                  <div className="p-3 bg-neutral-50 border border-veyro-border-light rounded-[2px] text-xs text-veyro-charcoal">
                    <p>
                      <strong>Fit Silhouette:</strong> {product.fit === "Oversized" ? "Deliberate drop-shoulder drape with generous chest volume. Take your true size for the oversized streetwear silhouette, or size down one for a regular fit." : "Designed with classic structured proportions. Fits true to size."}
                    </p>
                  </div>
                </div>
              )}
            </div>

            {/* Modal Footer */}
            <div className="pt-4 border-t border-veyro-border mt-4 flex gap-3">
              <button
                type="button"
                onClick={() => setIsSizeGuideOpen(false)}
                className="w-full bg-veyro-black text-white py-3 text-xs font-bold uppercase tracking-widest rounded-[2px] hover:bg-veyro-charcoal transition-colors cursor-pointer"
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
