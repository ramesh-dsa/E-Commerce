"use client";

import React, { useState, useRef, useEffect } from "react";
import type { Product } from "@/types";
import {
  Upload,
  X,
  Image as ImageIcon,
  Plus,
  Minus,
  Sparkles,
  Tag,
  Info,
  Layers,
  ShoppingBag,
  Crop,
  Check,
  RotateCcw,
  Boxes,
  IndianRupee,
} from "lucide-react";
import { ImageCropperModal } from "./ImageCropperModal";
import { AdminIconBadge } from "./AdminIconBadge";
import { StatusBadge } from "./StatusBadge";
import { AdminSelect } from "./AdminSelect";

/* ─── Form Data Shape (string-based for inputs) ─────────────────────────── */
interface ProductFormData {
  name: string;
  category: string;
  subcategory: string;
  subcategoryTag: string;
  fit: string;
  colorName: string;
  colorHex: string;
  material: string;
  price: string;
  originalPrice: string;
  discount: string;
  imageUrl: string;
  secondaryImageUrl: string;
  galleryImages: string[];
  badge: string;
  sizes: string;
  isNewArrival: boolean;
  inStock: boolean;
  stock: string;
  lowStockThreshold: string;
  sizeStock: Record<string, number>;
  shortDescription: string;
  longDescription: string;
  features: string;
  care: string;
  sizeGuide: string;
  collections: string;
  tags: string;
  relatedProducts: string;
}

/* ─── Converters ─────────────────────────────────────────────────────────── */
function productToFormData(p: Product): ProductFormData {
  const stockStr =
    p.stock !== undefined ? p.stock.toString() : p.inStock ? "25" : "0";
  const lowThresholdStr = (
    p.lowStockThreshold !== undefined ? p.lowStockThreshold : 10
  ).toString();

  // If sizeStock mapping is absent, distribute stock evenly across sizes
  const sizeStock: Record<string, number> = { ...(p.sizeStock || {}) };
  if (p.sizes && p.sizes.length > 0 && Object.keys(sizeStock).length === 0) {
    const total = parseInt(stockStr, 10) || 0;
    const base = Math.floor(total / p.sizes.length);
    const remainder = total % p.sizes.length;
    p.sizes.forEach((sz, idx) => {
      sizeStock[sz] = base + (idx < remainder ? 1 : 0);
    });
  }

  return {
    name: p.name,
    category: p.category,
    subcategory: p.subcategory,
    subcategoryTag: p.subcategoryTag,
    fit: p.fit || "",
    colorName: p.colorName,
    colorHex: p.colorHex || "#111111",
    material: p.material,
    price: p.price.toString(),
    originalPrice: p.originalPrice?.toString() || "",
    discount: p.discount || "",
    imageUrl: p.imageUrl,
    secondaryImageUrl: p.secondaryImageUrl || "",
    galleryImages: p.galleryImages ? [...p.galleryImages].slice(0, 4) : [],
    badge: p.badge || "",
    sizes: p.sizes.join(", "),
    isNewArrival: p.isNewArrival,
    inStock: p.inStock,
    stock: stockStr,
    lowStockThreshold: lowThresholdStr,
    sizeStock,
    shortDescription: p.shortDescription,
    longDescription: p.longDescription || "",
    features: p.features.join("\n"),
    care: p.care.join("\n"),
    sizeGuide: p.sizeGuide || "",
    collections: p.collections.join(", "),
    tags: (p.tags || []).join(", "),
    relatedProducts: p.relatedProducts.join(", "),
  };
}

function formDataToProduct(data: ProductFormData, existingProduct?: Product): Product {
  const id = existingProduct?.id || `vey-cst-${Date.now().toString(36)}`;
  // Preserve existing slug if editing an existing product, or derive from name if new
  const slug =
    existingProduct?.slug ||
    data.name
      .toLowerCase()
      .replace(/[^a-z0-9]+/g, "-")
      .replace(/(^-|-$)/g, "");

  const stockNum = parseInt(data.stock, 10);
  const validStock = isNaN(stockNum) ? 0 : Math.max(0, stockNum);
  const lowThreshold = parseInt(data.lowStockThreshold, 10) || 10;
  // Logical inStock: true ONLY if inStock is checked AND warehouse stock is > 0
  const effectiveInStock = data.inStock && validStock > 0;

  return {
    ...existingProduct,
    id,
    sku: existingProduct?.sku || id.toUpperCase().replace(/-/g, "_"),
    slug,
    name: data.name.trim(),
    category: data.category,
    subcategory: data.subcategory.trim() || data.category,
    subcategoryTag: data.subcategoryTag.trim() || "General",
    fit: data.fit.trim() || undefined,
    colorName: data.colorName.trim() || "Default",
    colorHex: data.colorHex || "#111111",
    material: data.material.trim() || "Not specified",
    price: parseFloat(data.price) || 0,
    originalPrice: data.originalPrice ? parseFloat(data.originalPrice) : undefined,
    discount: data.discount.trim() || undefined,
    imageUrl: data.imageUrl.trim() || "/products/tshirts/core-oversized-wolf-tee-front.webp",
    secondaryImageUrl: data.secondaryImageUrl.trim() || undefined,
    galleryImages: (data.galleryImages || []).filter(Boolean).slice(0, 4),
    badge: (data.badge || undefined) as Product["badge"],
    sizes: data.sizes
      .split(",")
      .map((s) => s.trim())
      .filter(Boolean),
    isNewArrival: data.isNewArrival,
    inStock: effectiveInStock,
    stock: validStock,
    lowStockThreshold: lowThreshold,
    sizeStock: data.sizeStock,
    shortDescription: data.shortDescription.trim() || data.name,
    longDescription: data.longDescription.trim() || undefined,
    features: data.features
      .split("\n")
      .map((s) => s.trim())
      .filter(Boolean),
    care: data.care
      .split("\n")
      .map((s) => s.trim())
      .filter(Boolean),
    sizeGuide: data.sizeGuide.trim() || undefined,
    collections: data.collections
      .split(",")
      .map((s) => s.trim())
      .filter(Boolean),
    tags: data.tags
      .split(",")
      .map((s) => s.trim())
      .filter(Boolean),
    relatedProducts: data.relatedProducts
      .split(",")
      .map((s) => s.trim())
      .filter(Boolean),
  };
}

const DEFAULT_FORM: ProductFormData = {
  name: "",
  category: "Clothing",
  subcategory: "T-Shirts",
  subcategoryTag: "Oversized",
  fit: "Oversized",
  colorName: "Black",
  colorHex: "#111111",
  material: "100% Combed Cotton, 240gsm",
  price: "",
  originalPrice: "",
  discount: "",
  imageUrl: "",
  secondaryImageUrl: "",
  galleryImages: [],
  badge: "NEW",
  sizes: "S, M, L, XL, XXL",
  isNewArrival: true,
  inStock: true,
  stock: "25",
  lowStockThreshold: "10",
  sizeStock: { S: 5, M: 5, L: 5, XL: 5, XXL: 5 },
  shortDescription: "",
  longDescription: "",
  features:
    "Heavyweight 240gsm combed cotton\nDrop shoulder relaxed silhouette\nHigh-density ribbed collar\nPre-shrunk for shape retention",
  care:
    "Machine wash cold inside out\nTumble dry low\nDo not iron on print\nWarm iron if necessary",
  sizeGuide:
    "Designed for a modern relaxed fit. Choose your true size for intended drape.",
  collections: "Essentials, New Drops",
  tags: "oversized, black, streetwear, premium",
  relatedProducts: "",
};

const BADGE_OPTIONS = [
  "",
  "NEW",
  "SALE",
  "BESTSELLER",
  "LIMITED",
  "TRENDING",
  "PREMIUM",
  "EXCLUSIVE",
  "NEW ARRIVAL",
];

const CATEGORY_PRESETS: Record<
  string,
  {
    subcategories: string[];
    tags: string[];
    fits: string[];
    sizes: string[];
  }
> = {
  Clothing: {
    subcategories: ["T-Shirts", "Hoodies", "Pants", "Jackets", "Shirts"],
    tags: ["Oversized", "Regular", "Graphic", "Minimal", "Textured"],
    fits: ["Oversized", "Regular", "Relaxed", "Boxy"],
    sizes: ["XS", "S", "M", "L", "XL", "XXL"],
  },
  Footwear: {
    subcategories: ["Sneakers", "Loafers", "Boots", "Slip-ons"],
    tags: ["Low-Top", "High-Top", "Chunky", "Retro", "Minimal"],
    fits: ["Standard Fit", "Wide Fit", "Comfort Fit"],
    sizes: ["UK 7", "UK 8", "UK 9", "UK 10", "UK 11"],
  },
  Watches: {
    subcategories: ["Automatic", "Quartz", "Chronograph", "Solar"],
    tags: ["Minimalist", "Luxury", "Vintage", "Pilot", "Diver"],
    fits: ["Classic", "Sport", "Slim Profile"],
    sizes: ["38mm", "40mm", "42mm"],
  },
};

const FASHION_COLOR_PRESETS = [
  { name: "Black", hex: "#111111" },
  { name: "White", hex: "#FFFFFF" },
  { name: "Charcoal", hex: "#27272A" },
  { name: "Navy", hex: "#0F172A" },
  { name: "Beige", hex: "#D4B996" },
  { name: "Olive", hex: "#3F4A3C" },
  { name: "Crimson", hex: "#991B1B" },
  { name: "Brown", hex: "#4A2E18" },
];

function getClosestColorName(hex: string): string {
  const cleanHex = hex.replace("#", "");
  if (cleanHex.length !== 6 && cleanHex.length !== 3) return "";
  let fullHex = cleanHex;
  if (cleanHex.length === 3) {
    fullHex = cleanHex.split("").map((c) => c + c).join("");
  }
  const r = parseInt(fullHex.substring(0, 2), 16);
  const g = parseInt(fullHex.substring(2, 4), 16);
  const b = parseInt(fullHex.substring(4, 6), 16);
  if (isNaN(r) || isNaN(g) || isNaN(b)) return "";

  const COLOR_PALETTE = [
    { name: "Black", rgb: [17, 17, 17] },
    { name: "White", rgb: [255, 255, 255] },
    { name: "Charcoal", rgb: [39, 39, 42] },
    { name: "Slate Grey", rgb: [100, 116, 139] },
    { name: "Silver Grey", rgb: [209, 213, 219] },
    { name: "Midnight Navy", rgb: [15, 23, 42] },
    { name: "Royal Blue", rgb: [37, 99, 235] },
    { name: "Sky Blue", rgb: [56, 189, 248] },
    { name: "Forest Green", rgb: [21, 128, 61] },
    { name: "Olive Green", rgb: [63, 74, 60] },
    { name: "Sage", rgb: [134, 150, 137] },
    { name: "Crimson Red", rgb: [153, 27, 27] },
    { name: "Burgundy", rgb: [112, 26, 49] },
    { name: "Coral Pink", rgb: [244, 114, 182] },
    { name: "Sand Beige", rgb: [212, 185, 150] },
    { name: "Camel", rgb: [193, 154, 107] },
    { name: "Chocolate Brown", rgb: [62, 39, 35] },
    { name: "Warm Amber", rgb: [217, 119, 6] },
    { name: "Deep Purple", rgb: [88, 28, 135] },
  ];

  let closestName = "";
  let minDistance = Infinity;

  for (const c of COLOR_PALETTE) {
    const dr = r - c.rgb[0];
    const dg = g - c.rgb[1];
    const db = b - c.rgb[2];
    const distance = dr * dr + dg * dg + db * db;
    if (distance < minDistance) {
      minDistance = distance;
      closestName = c.name;
    }
  }

  return closestName;
}

/* ─── Main Form Component ────────────────────────────────────────────────── */
interface ProductFormProps {
  product?: Product;
  onSubmit: (product: Product) => void;
  submitLabel?: string;
}

export function ProductForm({
  product,
  onSubmit,
  submitLabel = "Save Product",
}: ProductFormProps) {
  const [form, setForm] = useState<ProductFormData>(
    product ? productToFormData(product) : DEFAULT_FORM
  );

  const handleColorChange = (newHex: string) => {
    update("colorHex", newHex);
    const suggestedName = getClosestColorName(newHex);
    if (suggestedName) {
      update("colorName", suggestedName);
    }
  };

  // Raw original image sources before cropping (for re-opening cropper)
  const [rawPrimaryImage, setRawPrimaryImage] = useState(form.imageUrl || "");
  const [rawSecondaryImage, setRawSecondaryImage] = useState(
    form.secondaryImageUrl || ""
  );
  const [rawGalleryImages, setRawGalleryImages] = useState<string[]>(
    form.galleryImages || []
  );

  // Image Cropper Modal State
  const [cropperModal, setCropperModal] = useState<{
    open: boolean;
    source: string;
    target: "primary" | "secondary" | { type: "gallery"; index: number };
  }>({
    open: false,
    source: "",
    target: "primary",
  });

  const update = <K extends keyof ProductFormData>(
    field: K,
    value: ProductFormData[K]
  ) => {
    setForm((prev) => ({ ...prev, [field]: value }));
  };

  const stockNum = parseInt(form.stock, 10) || 0;
  const lowThreshold = parseInt(form.lowStockThreshold, 10) || 10;
  const isOutOfStock = !form.inStock || stockNum === 0;
  const isLowStock = !isOutOfStock && stockNum <= lowThreshold;

  // Auto-calculate discount label when price & originalPrice are typed
  useEffect(() => {
    const p = parseFloat(form.price);
    const orig = parseFloat(form.originalPrice);
    if (!isNaN(p) && !isNaN(orig) && orig > p && p > 0) {
      const pct = Math.round(((orig - p) / orig) * 100);
      if (!form.discount || form.discount.endsWith("% OFF")) {
        setForm((prev) => ({ ...prev, discount: `${pct}% OFF` }));
      }
    }
  }, [form.price, form.originalPrice, form.discount]);

  // Handle file selection -> immediately open cropper modal
  const handleFileSelect = (file: File, target: "primary" | "secondary") => {
    if (!file) return;
    if (!file.type.startsWith("image/")) {
      alert("Please select a valid image file (JPEG, PNG, WEBP, etc.)");
      return;
    }
    if (file.size > 12 * 1024 * 1024) {
      alert("Image must be under 12MB");
      return;
    }

    const reader = new FileReader();
    reader.onload = () => {
      const result = reader.result as string;
      if (target === "primary") {
        setRawPrimaryImage(result);
      } else {
        setRawSecondaryImage(result);
      }
      setCropperModal({ open: true, source: result, target });
    };
    reader.readAsDataURL(file);
  };

  // Handle URL entry -> immediately open cropper modal
  const handleUrlSubmit = (url: string, target: "primary" | "secondary") => {
    if (!url.trim()) return;
    if (target === "primary") {
      setRawPrimaryImage(url.trim());
    } else {
      setRawSecondaryImage(url.trim());
    }
    setCropperModal({ open: true, source: url.trim(), target });
  };

  // Handle Gallery file select (opens cropper)
  const handleGalleryFileSelect = (file: File, replaceIndex?: number) => {
    if (!file) return;
    if (!file.type.startsWith("image/")) {
      alert("Please select a valid image file (JPEG, PNG, WEBP, etc.)");
      return;
    }
    if (file.size > 12 * 1024 * 1024) {
      alert("Image must be under 12MB");
      return;
    }

    const currentCount = form.galleryImages?.length || 0;
    const targetIdx = replaceIndex !== undefined ? replaceIndex : currentCount;
    if (replaceIndex === undefined && currentCount >= 4) {
      alert("Maximum 6 images reached (1 Hero + 1 Hover + 4 Gallery)");
      return;
    }

    const reader = new FileReader();
    reader.onload = () => {
      const result = reader.result as string;
      setRawGalleryImages((prev) => {
        const next = [...prev];
        next[targetIdx] = result;
        return next;
      });
      setCropperModal({
        open: true,
        source: result,
        target: { type: "gallery", index: targetIdx },
      });
    };
    reader.readAsDataURL(file);
  };

  // Handle Gallery URL submit (opens cropper)
  const handleGalleryUrlSubmit = (url: string, replaceIndex?: number) => {
    const trimmed = url.trim();
    if (!trimmed) return;
    const currentCount = form.galleryImages?.length || 0;
    const targetIdx = replaceIndex !== undefined ? replaceIndex : currentCount;
    if (replaceIndex === undefined && currentCount >= 4) {
      alert("Maximum 6 images reached (1 Hero + 1 Hover + 4 Gallery)");
      return;
    }

    setRawGalleryImages((prev) => {
      const next = [...prev];
      next[targetIdx] = trimmed;
      return next;
    });
    setCropperModal({
      open: true,
      source: trimmed,
      target: { type: "gallery", index: targetIdx },
    });
  };

  const handleRemoveGalleryImage = (index: number) => {
    setForm((prev) => ({
      ...prev,
      galleryImages: prev.galleryImages.filter((_, i) => i !== index),
    }));
    setRawGalleryImages((prev) => prev.filter((_, i) => i !== index));
  };

  const handleAdjustGalleryCrop = (index: number) => {
    const rawSrc = rawGalleryImages[index] || form.galleryImages[index];
    if (!rawSrc) return;
    setCropperModal({
      open: true,
      source: rawSrc,
      target: { type: "gallery", index },
    });
  };

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();

    if (!form.name.trim()) {
      alert("Product name is required.");
      return;
    }
    if (!form.price || parseFloat(form.price) <= 0) {
      alert("A valid price is required.");
      return;
    }

    const result = formDataToProduct(form, product);
    onSubmit(result);
  };

  // Live checklist calculation
  const isNameValid = form.name.trim().length > 0;
  const isPriceValid = parseFloat(form.price) > 0;
  const isCategoryValid = form.category.trim().length > 0;
  const isImageValid = form.imageUrl.trim().length > 0;
  const isFormComplete = isNameValid && isPriceValid && isCategoryValid;
  const totalActiveImages =
    (form.imageUrl.trim() ? 1 : 0) +
    (form.secondaryImageUrl.trim() ? 1 : 0) +
    (form.galleryImages ? form.galleryImages.length : 0);

  const currentPresets =
    CATEGORY_PRESETS[form.category] || CATEGORY_PRESETS["Clothing"];

  return (
    <>
      <form onSubmit={handleSubmit} className="w-full">
        <div className="grid grid-cols-1 xl:grid-cols-12 gap-8 items-start">
          {/* ── LEFT COLUMN: ALL STRUCTURED INPUT SECTIONS (8 COLS) ──────────── */}
          <div className="xl:col-span-8 space-y-7">
            {/* 1. Basic Information */}
            <div className="bg-[var(--admin-surface)] rounded-[28px] border border-white/5 p-6 space-y-5">
              <div className="flex items-center gap-3 pb-3 border-b border-white/5">
                <AdminIconBadge variant="section" icon={Tag} />
                <div>
                  <h2 className="text-sm font-bold uppercase tracking-wider text-white font-heading">
                    Basic Information
                  </h2>
                  <p className="text-xs text-[var(--admin-text-muted)]">
                    Core identity, taxonomy, and fabrication details
                  </p>
                </div>
              </div>

              <div className="space-y-4 pt-1">
                {/* Product Name */}
                <FormInput
                  label="Product Name"
                  required
                  value={form.name}
                  onChange={(v) => update("name", v)}
                  placeholder="e.g. Core Oversized Wolf Tee"
                />

                {/* Category & Subcategory Row */}
                <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                  <FormSelect
                    label="Category"
                    required
                    value={form.category}
                    onChange={(v) => {
                      update("category", v);
                      const preset = CATEGORY_PRESETS[v];
                      if (preset) {
                        update("subcategory", preset.subcategories[0]);
                        update("subcategoryTag", preset.tags[0]);
                        update("fit", preset.fits[0]);
                      }
                    }}
                    options={["Clothing", "Footwear", "Watches"]}
                  />

                  <div>
                    <FormInput
                      label="Subcategory"
                      value={form.subcategory}
                      onChange={(v) => update("subcategory", v)}
                      placeholder="e.g. T-Shirts, Sneakers"
                    />
                    {/* Preset quick pills */}
                    <div className="flex items-center gap-1.5 mt-2 flex-wrap">
                      <span className="text-[10px] text-[var(--admin-text-muted)] font-medium">Quick:</span>
                      {currentPresets.subcategories.map((sc) => (
                        <button
                          key={sc}
                          type="button"
                          onClick={() => update("subcategory", sc)}
                          className={`text-[10px] px-2.5 py-0.5 rounded-full border transition-all cursor-pointer ${
                            form.subcategory === sc
                              ? "bg-[var(--admin-primary)] text-white border-transparent"
                              : "bg-[var(--admin-elevated)] hover:bg-white/10 border-white/5 text-[var(--admin-text-muted)] hover:text-white"
                          }`}
                        >
                          {sc}
                        </button>
                      ))}
                    </div>
                  </div>
                </div>

                {/* Subcategory Tag & Fit Row */}
                <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                  <div>
                    <FormInput
                      label="Subcategory Tag"
                      value={form.subcategoryTag}
                      onChange={(v) => update("subcategoryTag", v)}
                      placeholder="e.g. Oversized, Minimal"
                    />
                    <div className="flex items-center gap-1.5 mt-2 flex-wrap">
                      <span className="text-[10px] text-[var(--admin-text-muted)] font-medium">Quick:</span>
                      {currentPresets.tags.map((tg) => (
                        <button
                          key={tg}
                          type="button"
                          onClick={() => update("subcategoryTag", tg)}
                          className={`text-[10px] px-2.5 py-0.5 rounded-full border transition-all cursor-pointer ${
                            form.subcategoryTag === tg
                              ? "bg-[var(--admin-primary)] text-white border-transparent"
                              : "bg-[var(--admin-elevated)] hover:bg-white/10 border-white/5 text-[var(--admin-text-muted)] hover:text-white"
                          }`}
                        >
                          {tg}
                        </button>
                      ))}
                    </div>
                  </div>

                  <div>
                    <FormInput
                      label={form.category === "Footwear" ? "Silhouette / Cut" : "Garment Fit"}
                      value={form.fit}
                      onChange={(v) => update("fit", v)}
                      placeholder="e.g. Oversized, Relaxed, Slim"
                    />
                    <div className="flex items-center gap-1.5 mt-2 flex-wrap">
                      <span className="text-[10px] text-[var(--admin-text-muted)] font-medium">Quick:</span>
                      {currentPresets.fits.map((ft) => (
                        <button
                          key={ft}
                          type="button"
                          onClick={() => update("fit", ft)}
                          className={`text-[10px] px-2.5 py-0.5 rounded-full border transition-all cursor-pointer ${
                            form.fit === ft
                              ? "bg-[var(--admin-primary)] text-white border-transparent"
                              : "bg-[var(--admin-elevated)] hover:bg-white/10 border-white/5 text-[var(--admin-text-muted)] hover:text-white"
                          }`}
                        >
                          {ft}
                        </button>
                      ))}
                    </div>
                  </div>
                </div>

                {/* Material */}
                <FormInput
                  label="Material & Composition"
                  value={form.material}
                  onChange={(v) => update("material", v)}
                  placeholder="e.g. 100% Combed Cotton, 240gsm heavyweight weave"
                />
              </div>
            </div>

            {/* 2. Color & Pricing (Clean 3x2 Grid) */}
            <div className="bg-[var(--admin-surface)] rounded-[28px] border border-white/5 p-6 space-y-5">
              <div className="flex items-center gap-3 pb-3 border-b border-white/5">
                <AdminIconBadge variant="section" icon={IndianRupee} />
                <div>
                  <h2 className="text-sm font-bold uppercase tracking-wider text-white font-heading">
                    Color, Pricing &amp; Merchandising
                  </h2>
                  <p className="text-xs text-[var(--admin-text-muted)]">
                    Swatch tone, retail currency, discounts, and storefront badge
                  </p>
                </div>
              </div>

              <div className="space-y-4 pt-1">
                {/* Row 1: Color Name (col 1), Unified Swatch & Hex (col 2), Product Badge (col 3) */}
                <div className="grid grid-cols-1 sm:grid-cols-3 gap-4 items-start">
                  <div>
                    <FormInput
                      label="Color Name"
                      required
                      value={form.colorName}
                      onChange={(v) => update("colorName", v)}
                      placeholder="e.g. Midnight Black"
                    />
                  </div>

                  {/* Unified Swatch & Hex Input - Single Sleek Luxury Container */}
                  <div>
                    <label className="block text-xs font-semibold text-[#A1A1AA] mb-1.5">
                      Color Swatch &amp; Hex <span className="text-[#FF4B55] ml-0.5">*</span>
                    </label>
                    <div className="relative flex items-center h-11 px-3 bg-[var(--admin-surface-2)] border border-white/10 rounded-[14px] focus-within:border-[var(--admin-primary)] transition-colors">
                      <label
                        className="relative w-6.5 h-6.5 rounded-full border border-white/20 shadow-sm shrink-0 cursor-pointer transition-transform hover:scale-110 overflow-hidden mr-2.5 ring-1 ring-black/40"
                        style={{ backgroundColor: form.colorHex || "#111111" }}
                        title="Click to pick swatch color"
                      >
                        <input
                          type="color"
                          value={form.colorHex || "#111111"}
                          onChange={(e) => handleColorChange(e.target.value)}
                          className="opacity-0 absolute inset-0 w-full h-full cursor-pointer"
                        />
                      </label>
                      <span className="text-[var(--admin-text-muted)] text-xs font-mono select-none">#</span>
                      <input
                        type="text"
                        value={form.colorHex?.replace("#", "") || "111111"}
                        onChange={(e) => {
                          const val = e.target.value.replace(/[^0-9A-Fa-f]/g, "").slice(0, 6);
                          handleColorChange(`#${val}`);
                        }}
                        placeholder="111111"
                        className="flex-1 bg-transparent border-0 outline-none font-mono uppercase text-xs tracking-wider text-white pl-1"
                      />
                    </div>
                  </div>

                  {/* Product Badge in Column 3 */}
                  <FormSelect
                    label="Merchandising Badge"
                    value={form.badge}
                    onChange={(v) => update("badge", v)}
                    options={BADGE_OPTIONS}
                  />
                </div>

                {/* Curated Luxury Fashion Colorways Shelf */}
                <div className="flex items-center gap-1.5 flex-wrap min-h-[26px]">
                  <span className="text-[10px] text-[var(--admin-text-muted)] font-medium">Quick:</span>
                  {FASHION_COLOR_PRESETS.map((p) => {
                    const isSelected = form.colorHex?.toLowerCase() === p.hex.toLowerCase();
                    return (
                      <button
                        key={p.name}
                        type="button"
                        onClick={() => {
                          update("colorHex", p.hex);
                          update("colorName", p.name);
                        }}
                        className={`inline-flex items-center gap-1.5 text-[10px] px-2.5 py-1 rounded-full border transition-all cursor-pointer ${
                          isSelected
                            ? "bg-[var(--admin-elevated)] text-white border-[var(--admin-primary)] shadow-sm font-semibold"
                            : "bg-[var(--admin-surface)] hover:bg-[var(--admin-elevated)] border-white/10 text-[var(--admin-text-muted)] hover:text-white"
                        }`}
                      >
                        <span
                          className="w-2.5 h-2.5 rounded-full border border-white/20 shrink-0"
                          style={{ backgroundColor: p.hex }}
                        />
                        <span>{p.name}</span>
                      </button>
                    );
                  })}
                </div>

                {/* Row 2: Price (col 1), Original Price (col 2), Discount Label (col 3) */}
                <div className="grid grid-cols-1 sm:grid-cols-3 gap-4">
                  <FormInput
                    label="Selling Price"
                    required
                    type="number"
                    prefix="₹"
                    value={form.price}
                    onChange={(v) => update("price", v)}
                    placeholder="1199"
                  />

                  <FormInput
                    label="Original MRP (Strikethrough)"
                    type="number"
                    prefix="₹"
                    value={form.originalPrice}
                    onChange={(v) => update("originalPrice", v)}
                    placeholder="1599"
                  />

                  <div>
                    <FormInput
                      label="Discount Tag"
                      value={form.discount}
                      onChange={(v) => update("discount", v)}
                      placeholder="e.g. 25% OFF"
                    />
                    {form.price &&
                      form.originalPrice &&
                      parseFloat(form.originalPrice) > parseFloat(form.price) && (
                        <span className="text-[10px] text-[#00F59B] font-semibold mt-1 block">
                          ✓ Auto-calculated from MRP
                        </span>
                      )}
                  </div>
                </div>
              </div>
            </div>

            {/* 3. Images with Interactive Cropper Feature */}
            <div className="bg-[var(--admin-surface)] rounded-[28px] border border-white/5 p-6 space-y-5">
              <div className="flex items-center justify-between pb-3 border-b border-white/5">
                <div className="flex items-center gap-3">
                  <AdminIconBadge variant="section" icon={ImageIcon} />
                  <div>
                    <h2 className="text-sm font-bold uppercase tracking-wider text-white font-heading">
                      Product Photography &amp; Framing
                    </h2>
                    <p className="text-xs text-[var(--admin-text-muted)]">
                      Studio primary hero, hover preview &amp; up to 4 gallery angles (Max 6 images total)
                    </p>
                  </div>
                </div>
                <div className="hidden sm:flex">
                  <StatusBadge variant="neutral" icon={<Crop size={12} strokeWidth={2} className="text-[var(--admin-text-muted)]" />}>
                    Auto-Crop Active
                  </StatusBadge>
                </div>
              </div>

              <div className="grid grid-cols-1 md:grid-cols-2 gap-6 pt-1">
                {/* Primary Hero Image */}
                <ImageUploadCropCard
                  label="Primary Hero Image"
                  required
                  imageUrl={form.imageUrl}
                  onFileDrop={(file) => handleFileSelect(file, "primary")}
                  onUrlSubmit={(url) => handleUrlSubmit(url, "primary")}
                  onAdjustCrop={() =>
                    setCropperModal({
                      open: true,
                      source: rawPrimaryImage || form.imageUrl,
                      target: "primary",
                    })
                  }
                  onRemove={() => {
                    update("imageUrl", "");
                    setRawPrimaryImage("");
                  }}
                />

                {/* Secondary Image (Hover View) */}
                <ImageUploadCropCard
                  label="Secondary Image (On Hover)"
                  imageUrl={form.secondaryImageUrl}
                  onFileDrop={(file) => handleFileSelect(file, "secondary")}
                  onUrlSubmit={(url) => handleUrlSubmit(url, "secondary")}
                  onAdjustCrop={() =>
                    setCropperModal({
                      open: true,
                      source: rawSecondaryImage || form.secondaryImageUrl,
                      target: "secondary",
                    })
                  }
                  onRemove={() => {
                    update("secondaryImageUrl", "");
                    setRawSecondaryImage("");
                  }}
                />
              </div>

              {/* Additional Gallery Angles (Up to 4 images, Total max 6 with Hero & Hover) */}
              <div className="pt-5 border-t border-white/5 space-y-3.5">
                <div className="flex items-center justify-between flex-wrap gap-2">
                  <div>
                    <h3 className="text-xs font-bold uppercase tracking-wider text-white flex items-center gap-2">
                      <span>Additional Gallery Angles &amp; Detail Shots</span>
                      <span className="text-[10px] font-normal normal-case text-[var(--admin-text-muted)]">
                        (PDP Gallery Rail)
                      </span>
                    </h3>
                    <p className="text-[11px] text-[var(--admin-text-muted)]">
                      Studio angles, close-up details, or styling frames (Max 4 additional · Total 6)
                    </p>
                  </div>
                  <div className="flex items-center gap-2">
                    <StatusBadge
                      variant={form.galleryImages.length >= 4 ? "warning" : "neutral"}
                      dot
                    >
                      <span>{form.galleryImages.length} / 4 Gallery Shots</span>
                      <span className="opacity-40">·</span>
                      <span>{totalActiveImages} / 6 Total</span>
                    </StatusBadge>
                  </div>
                </div>

                <div className="grid grid-cols-2 sm:grid-cols-4 gap-4 pt-1">
                  {form.galleryImages.map((imgUrl, idx) => (
                    <GalleryImageCard
                      key={idx}
                      index={idx}
                      imageUrl={imgUrl}
                      onAdjustCrop={() => handleAdjustGalleryCrop(idx)}
                      onReplace={(file) => handleGalleryFileSelect(file, idx)}
                      onRemove={() => handleRemoveGalleryImage(idx)}
                    />
                  ))}

                  {form.galleryImages.length < 4 && (
                    <GalleryImageAddCard
                      remainingSlots={4 - form.galleryImages.length}
                      onFileDrop={(file) => handleGalleryFileSelect(file)}
                      onUrlSubmit={(url) => handleGalleryUrlSubmit(url)}
                    />
                  )}
                </div>
              </div>
            </div>

            {/* 4. Sizes & Inventory */}
            <div className="bg-[var(--admin-surface)] rounded-[28px] border border-white/5 p-6 space-y-5">
              <div className="flex items-center justify-between pb-3 border-b border-white/5 flex-wrap gap-2">
                <div className="flex items-center gap-3">
                  <AdminIconBadge variant="section" icon={Layers} />
                  <div>
                    <h2 className="text-sm font-bold uppercase tracking-wider text-white font-heading">
                      Sizes &amp; Inventory Status
                    </h2>
                    <p className="text-xs text-[var(--admin-text-muted)]">
                      Warehouse stock units, size variants, and fitting notes
                    </p>
                  </div>
                </div>

                {/* Dynamic Inventory Status Indicator Pill */}
                <div className="flex items-center gap-2">
                  <span
                    className={`inline-flex items-center gap-1.5 px-3 py-1 rounded-full text-xs font-semibold tracking-wide border transition-colors ${
                      isOutOfStock
                        ? "bg-[#FF4B55]/15 text-[#FF4B55] border-[#FF4B55]/20"
                        : isLowStock
                        ? "bg-[#F59E0B]/15 text-[#F59E0B] border-[#F59E0B]/20"
                        : "bg-[#00F59B]/15 text-[#00F59B] border-[#00F59B]/20"
                    }`}
                  >
                    <span
                      className={`w-1.5 h-1.5 rounded-full ${
                        isOutOfStock
                          ? "bg-[#FF4B55]"
                          : isLowStock
                          ? "bg-[#F59E0B]"
                          : "bg-[#00F59B] animate-pulse"
                      }`}
                    />
                    {isOutOfStock
                      ? "Out of Stock"
                      : isLowStock
                      ? `Low Stock · ${stockNum} units`
                      : `In Stock · ${stockNum} units`}
                  </span>
                </div>
              </div>

              <div className="space-y-4 pt-1">
                <div className="grid grid-cols-1 md:grid-cols-2 gap-5 items-start">
                  <div>
                    <FormChipInput
                      label="Available Sizes"
                      value={form.sizes}
                      onChange={(v) => {
                        update("sizes", v);
                        const newSizes = v.split(",").map((s) => s.trim()).filter(Boolean);
                        const updatedSizeStock = { ...form.sizeStock };
                        newSizes.forEach((sz) => {
                          if (updatedSizeStock[sz] === undefined) {
                            updatedSizeStock[sz] = Math.max(
                              0,
                              Math.floor(stockNum / (newSizes.length || 1))
                            );
                          }
                        });
                        update("sizeStock", updatedSizeStock);
                      }}
                      placeholder="Type size and press Enter (e.g. XL)"
                    />
                    {/* Category Size Presets */}
                    <div className="flex items-center gap-1.5 mt-2 flex-wrap min-h-[26px]">
                      <span className="text-[10px] text-[var(--admin-text-muted)] font-medium">Add:</span>
                      {currentPresets.sizes.map((sz) => (
                        <button
                          key={sz}
                          type="button"
                          onClick={() => {
                            const existing = form.sizes
                              .split(",")
                              .map((s) => s.trim())
                              .filter(Boolean);
                            if (!existing.includes(sz)) {
                              const newSizesStr = [...existing, sz].join(", ");
                              update("sizes", newSizesStr);
                              const updatedSizeStock = { ...form.sizeStock };
                              if (updatedSizeStock[sz] === undefined) {
                                updatedSizeStock[sz] = Math.max(
                                  0,
                                  Math.floor(stockNum / (existing.length + 1))
                                );
                              }
                              update("sizeStock", updatedSizeStock);
                            }
                          }}
                          className="text-[10px] px-2.5 py-0.5 rounded-full border bg-[var(--admin-surface)] hover:bg-[var(--admin-elevated)] border-white/10 text-[var(--admin-text-muted)] hover:text-white transition-colors cursor-pointer"
                        >
                          +{sz}
                        </button>
                      ))}
                    </div>
                  </div>

                  <div>
                    <FormInput
                      label="Fit / Size Guide Note"
                      value={form.sizeGuide}
                      onChange={(v) => update("sizeGuide", v)}
                      placeholder="e.g. Relaxed fit — recommended true to size"
                    />
                    <p className="text-[11px] text-[var(--admin-text-muted)] mt-2 leading-[26px]">
                      Displays on storefront product page for customer sizing clarity
                    </p>
                  </div>
                </div>

                {/* Warehouse Inventory Management Box - Professional Luxury Layout */}
                <div className="p-4 sm:p-5 rounded-[18px] border border-white/5 bg-[var(--admin-surface-2)] space-y-4">
                  {/* Header Row with Clean Actions */}
                  <div className="flex items-center justify-between pb-2.5 border-b border-white/5 flex-wrap gap-2">
                    <div className="flex items-center gap-2">
                      <span className="text-xs font-bold uppercase tracking-wider text-white font-heading">
                        Warehouse Inventory
                      </span>
                      <span className="text-[11px] text-[var(--admin-text-muted)] font-normal hidden sm:inline">
                        · Live stock available for immediate checkout
                      </span>
                    </div>
                    <div className="flex items-center gap-2">
                      <button
                        type="button"
                        onClick={() => {
                          update("stock", "0");
                          update("inStock", false);
                        }}
                        className="text-xs font-semibold px-2.5 py-1 rounded-full border border-white/10 text-[var(--admin-text-muted)] hover:text-[#FF4B55] hover:border-[#FF4B55]/30 hover:bg-[#FF4B55]/5 transition-colors cursor-pointer"
                      >
                        Mark Sold Out (0)
                      </button>
                      <button
                        type="button"
                        onClick={() => {
                          const curr = parseInt(form.stock, 10) || 0;
                          const next = curr === 0 ? 25 : curr;
                          update("stock", next.toString());
                          update("inStock", true);
                          const sizeList = form.sizes
                            .split(",")
                            .map((s) => s.trim())
                            .filter(Boolean);
                          const allocatedSum = sizeList.reduce(
                            (acc, sz) => acc + (form.sizeStock[sz] ?? 0),
                            0
                          );
                          if (allocatedSum === 0 && sizeList.length > 0) {
                            const base = Math.floor(next / sizeList.length);
                            const remainder = next % sizeList.length;
                            const nextStock: Record<string, number> = {};
                            sizeList.forEach((sz, idx) => {
                              nextStock[sz] = base + (idx < remainder ? 1 : 0);
                            });
                            update("sizeStock", nextStock);
                          }
                        }}
                        className="text-xs font-semibold px-2.5 py-1 rounded-full border border-white/10 text-[var(--admin-text-muted)] hover:text-white hover:bg-white/5 transition-colors cursor-pointer"
                      >
                        Default Stock (25)
                      </button>
                    </div>
                  </div>

                  {/* Master Units Input & Threshold Controls */}
                  <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4">
                    {/* Total Units Input + Stepper */}
                    <div className="flex items-center gap-2.5 flex-wrap">
                      <span className="text-xs font-bold text-white whitespace-nowrap">
                        Total Units:
                      </span>
                      <div className="inline-flex items-center h-9 border border-white/10 rounded-full bg-[var(--admin-surface)] overflow-hidden focus-within:border-[var(--admin-primary)] transition-colors">
                        <button
                          type="button"
                          onClick={() => {
                            const curr = parseInt(form.stock, 10) || 0;
                            const next = Math.max(0, curr - 1);
                            update("stock", next.toString());
                            if (next === 0) update("inStock", false);
                          }}
                          className="w-9 h-9 flex items-center justify-center text-[var(--admin-text-muted)] hover:text-white hover:bg-white/5 active:bg-white/10 border-r border-white/10 transition-colors cursor-pointer"
                          aria-label="Decrease stock"
                        >
                          <Minus size={13} />
                        </button>
                        <input
                          type="number"
                          min={0}
                          value={form.stock}
                          onChange={(e) => {
                            const val = e.target.value;
                            update("stock", val);
                            const num = parseInt(val, 10);
                            if (!isNaN(num)) {
                              if (num === 0) update("inStock", false);
                              else if (!form.inStock && num > 0) update("inStock", true);
                            }
                          }}
                          className="w-16 h-9 text-center text-xs font-mono font-bold text-white outline-none tabular-nums bg-transparent"
                          placeholder="0"
                        />
                        <button
                          type="button"
                          onClick={() => {
                            const curr = parseInt(form.stock, 10) || 0;
                            const next = curr + 1;
                            update("stock", next.toString());
                            if (!form.inStock && next > 0) update("inStock", true);
                          }}
                          className="w-9 h-9 flex items-center justify-center text-[var(--admin-text-muted)] hover:text-white hover:bg-white/5 active:bg-white/10 border-l border-white/10 transition-colors cursor-pointer"
                          aria-label="Increase stock"
                        >
                          <Plus size={13} />
                        </button>
                      </div>

                      {/* Quick Increments */}
                      <div className="inline-flex items-center gap-1.5">
                        {[5, 10, 25, 50].map((delta) => (
                          <button
                            key={delta}
                            type="button"
                            onClick={() => {
                              const curr = parseInt(form.stock, 10) || 0;
                              const next = curr + delta;
                              update("stock", next.toString());
                              if (!form.inStock && next > 0) update("inStock", true);
                            }}
                            className="h-8 px-2.5 rounded-full text-xs font-mono font-medium text-[var(--admin-text-muted)] bg-[var(--admin-surface)] border border-white/10 hover:bg-[var(--admin-primary)] hover:text-white hover:border-[var(--admin-primary)] transition-colors cursor-pointer active:scale-95 flex items-center justify-center"
                          >
                            +{delta}
                          </button>
                        ))}
                      </div>
                    </div>

                    {/* Low stock alert threshold - compact inline */}
                    <div className="flex items-center gap-2">
                      <span className="text-xs text-[var(--admin-text-muted)] whitespace-nowrap">
                        Low stock alert below:
                      </span>
                      <div className="inline-flex items-center gap-2">
                        <input
                          type="number"
                          min={1}
                          max={100}
                          value={form.lowStockThreshold}
                          onChange={(e) => update("lowStockThreshold", e.target.value)}
                          className="w-14 h-8 px-2 text-center text-xs font-mono font-semibold border border-white/10 rounded-[10px] outline-none focus:border-[var(--admin-primary)] bg-[var(--admin-surface)] text-white"
                          placeholder="10"
                        />
                        <span className="text-xs text-[var(--admin-text-muted)]">units</span>
                      </div>
                    </div>
                  </div>

                  {/* Size-Level Inventory Breakdown */}
                  {form.sizes.trim().length > 0 && (() => {
                    const sizeList = form.sizes
                      .split(",")
                      .map((s) => s.trim())
                      .filter(Boolean);
                    const allocatedSum = sizeList.reduce(
                      (acc, sz) => acc + (form.sizeStock[sz] ?? 0),
                      0
                    );
                    const isBalanced = allocatedSum === stockNum;

                    return (
                      <div className="pt-3 border-t border-white/5 space-y-2.5">
                        <div className="flex items-center justify-between flex-wrap gap-2">
                          <div className="flex items-center gap-2">
                            <span className="text-xs font-bold uppercase tracking-wider text-white">
                              Size Variant Allocation
                            </span>
                            <span
                              className={`text-[11px] font-mono px-2.5 py-0.5 rounded-full ${
                                isBalanced
                                  ? "bg-white/5 text-[var(--admin-text-muted)] font-semibold"
                                  : "bg-[#F59E0B]/15 text-[#F59E0B] font-semibold"
                              }`}
                            >
                              Allocated: {allocatedSum} / {stockNum} units
                            </span>
                          </div>

                          <div className="flex items-center gap-2">
                            <button
                              type="button"
                              onClick={() => {
                                if (sizeList.length === 0) return;
                                const base = Math.floor(stockNum / sizeList.length);
                                const remainder = stockNum % sizeList.length;
                                const nextStock: Record<string, number> = {};
                                sizeList.forEach((sz, idx) => {
                                  nextStock[sz] = base + (idx < remainder ? 1 : 0);
                                });
                                update("sizeStock", nextStock);
                              }}
                              className="text-xs font-semibold text-white bg-[var(--admin-surface)] hover:bg-[var(--admin-elevated)] border border-white/10 px-3 py-1 rounded-full transition-colors cursor-pointer"
                            >
                              Distribute Evenly
                            </button>
                            <button
                              type="button"
                              onClick={() => {
                                let sum = 0;
                                sizeList.forEach((sz) => {
                                  sum += form.sizeStock[sz] || 0;
                                });
                                update("stock", sum.toString());
                                if (sum === 0) update("inStock", false);
                                else if (!form.inStock && sum > 0) update("inStock", true);
                              }}
                              className="text-xs font-semibold text-white bg-[var(--admin-surface)] hover:bg-[var(--admin-elevated)] border border-white/10 px-3 py-1 rounded-full transition-colors cursor-pointer"
                            >
                              Sync Total to Sizes
                            </button>
                          </div>
                        </div>

                        {/* Compact variant matrix tiles */}
                        <div
                          className="grid gap-2.5 w-full"
                          style={{
                            gridTemplateColumns: `repeat(${Math.max(sizeList.length, 1)}, minmax(0, 1fr))`,
                          }}
                        >
                          {sizeList.map((sz) => {
                            const qty = form.sizeStock[sz] ?? 0;
                            const isSoldOut = qty === 0;

                            return (
                              <div
                                key={sz}
                                className={`p-2.5 rounded-[10px] border transition-all focus-within:border-[var(--admin-primary)] ${
                                  isSoldOut
                                    ? "bg-[var(--admin-surface)]/50 border-white/5 text-[var(--admin-text-muted)]"
                                    : "bg-[var(--admin-surface)] border-white/10 hover:border-white/20 text-white"
                                }`}
                              >
                                <div className="flex items-center justify-between mb-1 gap-1">
                                  <span className="text-xs font-black tracking-wider text-white uppercase truncate">
                                    {sz}
                                  </span>
                                  {isSoldOut ? (
                                    <span className="text-[9px] font-bold text-[#FF4B55] uppercase tracking-wider shrink-0">
                                      OOS
                                    </span>
                                  ) : (
                                    <span className="text-[10px] font-mono text-[var(--admin-text-muted)] shrink-0">
                                      units
                                    </span>
                                  )}
                                </div>
                                <input
                                  type="number"
                                  min={0}
                                  value={qty}
                                  onChange={(e) => {
                                    const val = Math.max(0, parseInt(e.target.value, 10) || 0);
                                    update("sizeStock", {
                                      ...form.sizeStock,
                                      [sz]: val,
                                    });
                                  }}
                                  className="w-full text-center text-sm font-mono font-bold bg-transparent outline-none text-white py-0.5 tabular-nums"
                                />
                              </div>
                            );
                          })}
                        </div>
                      </div>
                    );
                  })()}
                </div>

                {/* Toggles */}
                <div className="grid grid-cols-1 sm:grid-cols-2 gap-3.5 pt-1">
                  <label className="flex items-start gap-3 p-4 rounded-[14px] border border-white/5 bg-[var(--admin-surface-2)] hover:bg-white/[0.03] cursor-pointer select-none transition-colors">
                    <input
                      type="checkbox"
                      checked={form.inStock}
                      onChange={(e) => {
                        const checked = e.target.checked;
                        update("inStock", checked);
                        if (checked) {
                          const currentStockNum = parseInt(form.stock, 10) || 0;
                          if (currentStockNum === 0) {
                            update("stock", "25");
                          }
                        }
                      }}
                      className="w-4.5 h-4.5 rounded cursor-pointer accent-[var(--admin-primary)] mt-0.5 shrink-0"
                    />
                    <div>
                      <span className="block text-xs font-bold text-white">
                        Mark as In Stock
                      </span>
                      <span className="block text-[11px] text-[var(--admin-text-muted)]">
                        {form.inStock
                          ? "Product is available for immediate storefront checkout"
                          : "Product marked Sold Out — storefront blocks checkout"}
                      </span>
                    </div>
                  </label>

                  <label className="flex items-start gap-3 p-4 rounded-[14px] border border-white/5 bg-[var(--admin-surface-2)] hover:bg-white/[0.03] cursor-pointer select-none transition-colors">
                    <input
                      type="checkbox"
                      checked={form.isNewArrival}
                      onChange={(e) => update("isNewArrival", e.target.checked)}
                      className="w-4.5 h-4.5 rounded cursor-pointer accent-[var(--admin-primary)] mt-0.5 shrink-0"
                    />
                    <div>
                      <span className="block text-xs font-bold text-white">
                        Tag as New Arrival
                      </span>
                      <span className="block text-[11px] text-[var(--admin-text-muted)]">
                        Promote in storefront New Arrivals ribbon
                      </span>
                    </div>
                  </label>
                </div>
              </div>
            </div>

            {/* 5. Descriptions & Details */}
            <div className="bg-[var(--admin-surface)] rounded-[28px] border border-white/5 p-6 space-y-5">
              <div className="flex items-center gap-3 pb-3 border-b border-white/5">
                <AdminIconBadge variant="section" icon={Info} />
                <div>
                  <h2 className="text-sm font-bold uppercase tracking-wider text-white font-heading">
                    Descriptions &amp; Garment Care
                  </h2>
                  <p className="text-xs text-[var(--admin-text-muted)]">
                    Product narrative, bullet points, and wash care guidance
                  </p>
                </div>
              </div>

              <div className="space-y-4 pt-1">
                <FormTextarea
                  label="Short Summary (Cards & Quick View Previews)"
                  value={form.shortDescription}
                  onChange={(v) => update("shortDescription", v)}
                  rows={2}
                  placeholder="1–2 sentence compelling summary of the silhouette and style"
                />

                <FormTextarea
                  label="Detailed Description (PDP Storytelling)"
                  value={form.longDescription}
                  onChange={(v) => update("longDescription", v)}
                  rows={4}
                  placeholder="In-depth paragraph highlighting craftsmanship, aesthetic drape, and origins..."
                />

                <div className="grid grid-cols-1 md:grid-cols-2 gap-5 pt-1">
                  <FormListInput
                    label="Features (Bullet Points)"
                    value={form.features}
                    onChange={(v) => update("features", v)}
                    placeholder="e.g. Heavyweight 240gsm cotton"
                  />
                  <FormListInput
                    label="Care Instructions"
                    value={form.care}
                    onChange={(v) => update("care", v)}
                    placeholder="e.g. Machine wash cold inside out"
                  />
                </div>
              </div>
            </div>

            {/* 6. Collections & Related */}
            <div className="bg-[var(--admin-surface)] rounded-[28px] border border-white/5 p-6 space-y-5">
              <div className="flex items-center gap-3 pb-3 border-b border-white/5">
                <AdminIconBadge variant="section" icon={Sparkles} />
                <div>
                  <h2 className="text-sm font-bold uppercase tracking-wider text-white font-heading">
                    Collections &amp; Search Tags
                  </h2>
                  <p className="text-xs text-[var(--admin-text-muted)]">
                    Merchandising taxonomies, filter tags, and cross-sell references
                  </p>
                </div>
              </div>

              <div className="grid grid-cols-1 sm:grid-cols-2 gap-4 pt-1">
                <FormChipInput
                  label="Storefront Collections"
                  value={form.collections}
                  onChange={(v) => update("collections", v)}
                  placeholder="e.g. Essentials, Summer Drop"
                />
                <FormChipInput
                  label="Search Tags"
                  value={form.tags}
                  onChange={(v) => update("tags", v)}
                  placeholder="e.g. minimal, black, tee"
                />
                <div className="sm:col-span-2">
                  <FormChipInput
                    label="Cross-Sell Related Product SKUs"
                    value={form.relatedProducts}
                    onChange={(v) => update("relatedProducts", v)}
                    placeholder="e.g. vey-tsh-ovr-002, vey-snk-001"
                  />
                </div>
              </div>
            </div>
          </div>

          {/* ── RIGHT COLUMN: STICKY PUBLICATION STATUS CARD (4 COLS) ───── */}
          <div className="xl:col-span-4 space-y-6 xl:sticky xl:top-6">
            <div className="bg-[var(--admin-surface)] rounded-[28px] border border-white/5 p-6 space-y-5">
              <div className="flex items-center justify-between pb-3 border-b border-white/5">
                <div className="flex items-center gap-3">
                  <AdminIconBadge variant="section" icon={ShoppingBag} />
                  <span className="text-xs font-bold uppercase tracking-wider text-white font-heading">
                    Publication Action
                  </span>
                </div>
                <span
                  className={`text-[11px] font-semibold px-2.5 py-0.5 rounded-full border transition-colors ${
                    isFormComplete
                      ? "bg-[#00F59B]/15 text-[#00F59B] border-[#00F59B]/20"
                      : "bg-white/5 text-[var(--admin-text-muted)] border-white/10"
                  }`}
                >
                  {isFormComplete ? "Ready to Launch" : "Draft"}
                </span>
              </div>

              {/* Requirement Checklist */}
              <div className="space-y-2.5 text-xs">
                <div className="flex items-center justify-between">
                  <span className="text-[var(--admin-text-muted)]">Product Name</span>
                  <span
                    className={
                      isNameValid
                        ? "text-[#00F59B] font-semibold flex items-center gap-1"
                        : "text-amber-400/90 font-medium flex items-center gap-1.5"
                    }
                  >
                    {isNameValid ? (
                      "✓ Set"
                    ) : (
                      <>
                        <span className="w-1.5 h-1.5 rounded-full bg-amber-400" />
                        Required
                      </>
                    )}
                  </span>
                </div>
                <div className="flex items-center justify-between">
                  <span className="text-[var(--admin-text-muted)]">Selling Price</span>
                  <span
                    className={
                      isPriceValid
                        ? "text-[#00F59B] font-semibold flex items-center gap-1 font-mono"
                        : "text-amber-400/90 font-medium flex items-center gap-1.5"
                    }
                  >
                    {isPriceValid ? (
                      `✓ ₹${parseFloat(form.price).toLocaleString("en-IN")}`
                    ) : (
                      <>
                        <span className="w-1.5 h-1.5 rounded-full bg-amber-400" />
                        Required
                      </>
                    )}
                  </span>
                </div>
                <div className="flex items-center justify-between">
                  <span className="text-[var(--admin-text-muted)]">Primary Hero Image</span>
                  <span
                    className={
                      isImageValid
                        ? "text-[#00F59B] font-semibold flex items-center gap-1"
                        : "text-[var(--admin-text-muted)] font-medium"
                    }
                  >
                    {isImageValid ? "✓ Set" : "Optional"}
                  </span>
                </div>
                <div className="flex items-center justify-between">
                  <span className="text-[var(--admin-text-muted)]">Media Kit</span>
                  <span className="text-white font-mono font-medium flex items-center gap-1">
                    {totalActiveImages} / 6 Active
                  </span>
                </div>
              </div>

              {/* Concise Product Metrics Summary - Unified Single Surface */}
              <div className="pt-3 border-t border-white/5 space-y-2.5 text-xs">
                <div className="flex items-center justify-between">
                  <span className="text-[var(--admin-text-muted)]">Taxonomy</span>
                  <span className="font-medium text-white">
                    {form.category} · {form.subcategory || "General"}
                  </span>
                </div>
                <div className="flex items-center justify-between">
                  <span className="text-[var(--admin-text-muted)]">Color Swatch</span>
                  <span className="font-medium text-white flex items-center gap-2">
                    <span
                      className="w-3.5 h-3.5 rounded-full border border-white/20 shadow-sm shrink-0"
                      style={{ backgroundColor: form.colorHex || "#111111" }}
                    />
                    {form.colorName || "Default"}
                  </span>
                </div>
                <div className="flex items-center justify-between">
                  <span className="text-[var(--admin-text-muted)]">Stock Availability</span>
                  <span
                    className={`font-medium flex items-center gap-1.5 ${
                      isOutOfStock
                        ? "text-[#FF4B55]"
                        : isLowStock
                        ? "text-[#F59E0B]"
                        : "text-[#00F59B]"
                    }`}
                  >
                    <span
                      className={`w-1.5 h-1.5 rounded-full ${
                        isOutOfStock
                          ? "bg-[#FF4B55]"
                          : isLowStock
                          ? "bg-[#F59E0B]"
                          : "bg-[#00F59B]"
                      }`}
                    />
                    {isOutOfStock
                      ? "Out of Stock"
                      : isLowStock
                      ? `Low Stock · ${stockNum} units`
                      : `In Stock · ${stockNum} units`}
                  </span>
                </div>
                {form.badge && (
                  <div className="flex items-center justify-between">
                    <span className="text-[var(--admin-text-muted)]">Badge</span>
                    <span className="text-[10px] font-extrabold uppercase px-2 py-0.5 rounded-full bg-white/10 text-white border border-white/10">
                      {form.badge}
                    </span>
                  </div>
                )}
              </div>

              <div className="pt-3 border-t border-white/5 space-y-2.5">
                <button
                  type="submit"
                  disabled={!isNameValid || !isPriceValid}
                  className="w-full flex items-center justify-center gap-2 bg-[var(--admin-primary)] hover:bg-[var(--admin-primary-hover)] text-white disabled:opacity-35 disabled:cursor-not-allowed py-3 px-5 rounded-full font-bold text-sm transition-all cursor-pointer active:scale-[0.98]"
                >
                  <Plus size={16} />
                  <span>{submitLabel}</span>
                </button>
                {isFormComplete ? (
                  <p className="text-[11px] text-[var(--admin-text-muted)] text-center flex items-center justify-center gap-1.5">
                    <span className="w-1.5 h-1.5 rounded-full bg-[#00F59B] animate-pulse" />
                    Live update takes effect immediately on storefront
                  </p>
                ) : (
                  <p className="text-[11px] text-[var(--admin-text-muted)] text-center">
                    Fill in required fields to publish product
                  </p>
                )}
              </div>
            </div>
          </div>
        </div>
      </form>

      {/* ── Interactive Image Cropper Modal (Same Engine As Custom Sections) ── */}
      {cropperModal.open && (
        <ImageCropperModal
          imageSrc={cropperModal.source}
          title={
            cropperModal.target === "primary"
              ? "Crop Primary Hero Image"
              : cropperModal.target === "secondary"
              ? "Crop Secondary Hover Image"
              : `Crop Gallery Image (Angle #${cropperModal.target.index + 3})`
          }
          initialAspect="3/4"
          onCrop={(croppedResult) => {
            if (cropperModal.target === "primary") {
              update("imageUrl", croppedResult);
            } else if (cropperModal.target === "secondary") {
              update("secondaryImageUrl", croppedResult);
            } else if (
              typeof cropperModal.target === "object" &&
              cropperModal.target.type === "gallery"
            ) {
              const targetIdx = cropperModal.target.index;
              setForm((prev) => {
                const next = [...(prev.galleryImages || [])];
                next[targetIdx] = croppedResult;
                return { ...prev, galleryImages: next };
              });
            }
            setCropperModal({ open: false, source: "", target: "primary" });
          }}
          onClose={() => setCropperModal({ open: false, source: "", target: "primary" })}
        />
      )}
    </>
  );
}

/* ─── Image Upload & Cropper Card Component ──────────────────────────────── */
function ImageUploadCropCard({
  label,
  imageUrl,
  onFileDrop,
  onUrlSubmit,
  onAdjustCrop,
  onRemove,
  required,
}: {
  label: string;
  imageUrl: string;
  onFileDrop: (file: File) => void;
  onUrlSubmit: (url: string) => void;
  onAdjustCrop: () => void;
  onRemove: () => void;
  required?: boolean;
}) {
  const [isDragging, setIsDragging] = useState(false);
  const [urlInput, setUrlInput] = useState("");
  const fileInputRef = useRef<HTMLInputElement>(null);

  const handleDrop = (e: React.DragEvent) => {
    e.preventDefault();
    setIsDragging(false);
    if (e.dataTransfer.files && e.dataTransfer.files[0]) {
      onFileDrop(e.dataTransfer.files[0]);
    }
  };

  return (
    <div>
      <label className="block text-xs font-semibold text-[#A1A1AA] mb-1.5">
        {label}
        {required && <span className="text-[#FF4B55] ml-0.5">*</span>}
      </label>

      <input
        ref={fileInputRef}
        type="file"
        accept="image/*"
        onChange={(e) => {
          if (e.target.files?.[0]) {
            onFileDrop(e.target.files[0]);
          }
          e.target.value = "";
        }}
        className="hidden"
      />

      {imageUrl ? (
        /* Image is active: Show 3:4 aspect preview with interactive Crop & Replace controls */
        <div className="rounded-[20px] border border-white/5 overflow-hidden bg-[var(--admin-surface-2)] p-3 space-y-3">
          <div className="relative aspect-[3/4] w-full rounded-[14px] overflow-hidden border border-white/5 bg-[var(--admin-surface)] group">
            {/* eslint-disable-next-line @next/next/no-img-element */}
            <img
              src={imageUrl}
              alt={label}
              className="w-full h-full object-cover transition-transform duration-300 group-hover:scale-102"
            />

            {/* Quick Top-Right Floating Controls */}
            <div className="absolute top-2.5 right-2.5 flex items-center gap-1.5 z-10">
              <button
                type="button"
                onClick={onAdjustCrop}
                className="flex items-center gap-1 px-2.5 py-1.5 bg-[#09090C]/90 hover:bg-[#09090C] text-white rounded-full text-xs font-bold transition-all border border-white/10 hover:border-white/20 cursor-pointer hover:scale-105 active:scale-95"
                title="Adjust crop & framing"
                aria-label="Adjust crop"
              >
                <Crop size={13} className="text-white" />
                <span>Crop</span>
              </button>
              <button
                type="button"
                onClick={onRemove}
                className="p-1.5 bg-[#FF4B55] hover:bg-[#FF4B55]/90 text-white rounded-full transition-colors border border-white/10 cursor-pointer hover:scale-105 active:scale-95"
                title="Remove image"
                aria-label="Remove image"
              >
                <X size={14} />
              </button>
            </div>
          </div>

          {/* Action Row */}
          <div className="flex items-center gap-2">
            <button
              type="button"
              onClick={onAdjustCrop}
              className="flex-1 flex items-center justify-center gap-1.5 text-xs font-bold text-white bg-[var(--admin-surface)] border border-white/10 px-3 py-2 rounded-full hover:bg-[var(--admin-elevated)] transition-colors cursor-pointer"
            >
              <Crop size={14} className="text-[var(--admin-text-muted)]" />
              <span>Adjust Crop / Framing</span>
            </button>
            <button
              type="button"
              onClick={() => fileInputRef.current?.click()}
              className="text-xs font-semibold text-[var(--admin-text-muted)] hover:text-white bg-[var(--admin-surface)] border border-white/10 px-3 py-2 rounded-full hover:bg-[var(--admin-elevated)] transition-colors cursor-pointer"
            >
              Replace File
            </button>
          </div>
        </div>
      ) : (
        /* Empty State: Drag & Drop zone */
        <div
          onDragOver={(e) => {
            e.preventDefault();
            setIsDragging(true);
          }}
          onDragLeave={() => setIsDragging(false)}
          onDrop={handleDrop}
          className={`flex flex-col items-center justify-center p-5 border-2 border-dashed rounded-[14px] transition-all duration-200 ${
            isDragging
              ? "border-[var(--admin-primary)] bg-[var(--admin-primary)]/5 scale-[1.01]"
              : "border-white/10 hover:border-white/20 bg-[var(--admin-surface-2)]"
          }`}
        >
          <div className="w-10 h-10 bg-[var(--admin-surface)] rounded-full border border-white/10 flex items-center justify-center mb-2.5 text-[var(--admin-text-muted)]">
            <Upload size={18} />
          </div>
          <p className="text-xs font-bold text-white mb-0.5">Drag &amp; drop image here</p>
          <p className="text-[11px] text-[var(--admin-text-muted)] mb-3">
            Will automatically open crop editor
          </p>
          <button
            type="button"
            onClick={() => fileInputRef.current?.click()}
            className="text-xs font-bold text-white bg-[var(--admin-surface)] border border-white/10 px-4 py-2 rounded-full hover:bg-[var(--admin-elevated)] transition-colors inline-flex items-center gap-1.5 cursor-pointer active:scale-95"
          >
            <ImageIcon size={14} /> Select File
          </button>

          <div className="mt-3.5 flex items-center gap-2.5 w-full">
            <div className="h-px bg-white/10 flex-1" />
            <span className="text-[9px] uppercase font-bold text-[var(--admin-text-muted)] tracking-wider">
              or paste image URL
            </span>
            <div className="h-px bg-white/10 flex-1" />
          </div>

          <div className="flex gap-2 w-full mt-2.5">
            <input
              type="url"
              value={urlInput}
              onChange={(e) => setUrlInput(e.target.value)}
              onKeyDown={(e) => {
                if (e.key === "Enter") {
                  e.preventDefault();
                  if (urlInput.trim()) {
                    onUrlSubmit(urlInput.trim());
                    setUrlInput("");
                  }
                }
              }}
              placeholder="https://example.com/product.webp"
              className="admin-input flex-1 text-xs font-mono h-9 bg-[var(--admin-surface)] border border-white/10 rounded-[14px] text-white placeholder:text-[var(--admin-text-muted)] focus:border-[var(--admin-primary)]"
            />
            <button
              type="button"
              disabled={!urlInput.trim()}
              onClick={() => {
                if (urlInput.trim()) {
                  onUrlSubmit(urlInput.trim());
                  setUrlInput("");
                }
              }}
              className="px-4 py-1.5 bg-[var(--admin-primary)] hover:bg-[var(--admin-primary-hover)] text-white rounded-full text-xs font-bold disabled:opacity-40 disabled:cursor-not-allowed transition-colors cursor-pointer shrink-0"
            >
              Crop &amp; Set
            </button>
          </div>
        </div>
      )}
    </div>
  );
}

/* ─── Gallery Image Card Component ───────────────────────────────────────── */
function GalleryImageCard({
  index,
  imageUrl,
  onAdjustCrop,
  onReplace,
  onRemove,
}: {
  index: number;
  imageUrl: string;
  onAdjustCrop: () => void;
  onReplace: (file: File) => void;
  onRemove: () => void;
}) {
  const fileInputRef = useRef<HTMLInputElement>(null);

  return (
    <div className="rounded-[20px] border border-white/5 overflow-hidden bg-[var(--admin-surface-2)] p-2.5 space-y-2 group/card transition-all duration-200 hover:border-white/10">
      <input
        ref={fileInputRef}
        type="file"
        accept="image/*"
        onChange={(e) => {
          if (e.target.files?.[0]) {
            onReplace(e.target.files[0]);
          }
          e.target.value = "";
        }}
        className="hidden"
      />

      <div className="relative aspect-[3/4] w-full rounded-[14px] overflow-hidden border border-white/5 bg-[var(--admin-surface)] group">
        {/* eslint-disable-next-line @next/next/no-img-element */}
        <img
          src={imageUrl}
          alt={`Gallery Angle ${index + 3}`}
          className="w-full h-full object-cover transition-transform duration-300 group-hover:scale-102"
        />

        {/* Top Badges & Controls */}
        <div className="absolute top-2 left-2 z-10">
          <span className="text-[10px] font-medium px-2 py-0.5 rounded-full bg-[#09090C]/80 text-white backdrop-blur-xs border border-white/10">
            Angle {index + 3}
          </span>
        </div>

        <div className="absolute top-2 right-2 flex items-center gap-1 z-10">
          <button
            type="button"
            onClick={onAdjustCrop}
            className="p-1.5 bg-[#09090C]/90 hover:bg-[#09090C] text-white rounded-full text-xs font-bold transition-all border border-white/10 cursor-pointer hover:scale-105 active:scale-95"
            title="Adjust crop"
            aria-label="Adjust crop"
          >
            <Crop size={12} className="text-white" />
          </button>
          <button
            type="button"
            onClick={onRemove}
            className="p-1.5 bg-[#09090C]/80 hover:bg-[#FF4B55] text-white rounded-full transition-colors border border-white/10 cursor-pointer hover:scale-105 active:scale-95"
            title="Remove image"
            aria-label="Remove image"
          >
            <X size={12} />
          </button>
        </div>
      </div>

      <div className="flex items-center gap-1.5">
        <button
          type="button"
          onClick={onAdjustCrop}
          className="flex-1 flex items-center justify-center gap-1 text-[11px] font-semibold text-white hover:text-white bg-[var(--admin-surface)] border border-white/10 hover:border-white/20 py-1.5 rounded-full hover:bg-[var(--admin-elevated)] transition-all cursor-pointer active:scale-95"
        >
          <Crop size={12} className="text-[var(--admin-text-muted)]" />
          <span>Crop</span>
        </button>
        <button
          type="button"
          onClick={() => fileInputRef.current?.click()}
          className="text-[11px] font-medium text-[var(--admin-text-muted)] hover:text-white bg-[var(--admin-surface)] border border-white/10 hover:border-white/20 px-3 py-1.5 rounded-full hover:bg-[var(--admin-elevated)] transition-all cursor-pointer active:scale-95"
        >
          Replace
        </button>
      </div>
    </div>
  );
}

/* ─── Gallery Image Add Card Component ───────────────────────────────────── */
function GalleryImageAddCard({
  remainingSlots,
  onFileDrop,
  onUrlSubmit,
}: {
  remainingSlots: number;
  onFileDrop: (file: File) => void;
  onUrlSubmit: (url: string) => void;
}) {
  const [isDragging, setIsDragging] = useState(false);
  const [showUrlInput, setShowUrlInput] = useState(false);
  const [urlInput, setUrlInput] = useState("");
  const fileInputRef = useRef<HTMLInputElement>(null);

  const handleDrop = (e: React.DragEvent) => {
    e.preventDefault();
    setIsDragging(false);
    if (e.dataTransfer.files && e.dataTransfer.files[0]) {
      onFileDrop(e.dataTransfer.files[0]);
    }
  };

  const openPicker = () => {
    fileInputRef.current?.click();
  };

  return (
    <div
      onDragOver={(e) => {
        e.preventDefault();
        setIsDragging(true);
      }}
      onDragLeave={() => setIsDragging(false)}
      onDrop={handleDrop}
      onClick={() => {
        if (!showUrlInput) {
          openPicker();
        }
      }}
      className={`group relative aspect-[3/4] flex flex-col items-center justify-center p-4 border-2 border-dashed rounded-[14px] transition-all duration-200 text-center cursor-pointer select-none overflow-hidden ${
        isDragging
          ? "border-[var(--admin-primary)] bg-[var(--admin-primary)]/5 scale-[1.01]"
          : "border-white/10 hover:border-white/20 bg-[var(--admin-surface-2)] hover:bg-[var(--admin-surface-hover)]"
      }`}
    >
      <input
        ref={fileInputRef}
        type="file"
        accept="image/*"
        onChange={(e) => {
          if (e.target.files?.[0]) {
            onFileDrop(e.target.files[0]);
          }
          e.target.value = "";
        }}
        className="hidden"
      />

      {showUrlInput ? (
        <div
          onClick={(e) => e.stopPropagation()}
          className="w-full h-full flex flex-col justify-between p-2 z-10"
        >
          <div className="space-y-2">
            <div className="flex items-center justify-between pb-1.5 border-b border-white/5">
              <span className="text-xs font-semibold text-white">
                Paste Image URL
              </span>
              <button
                type="button"
                onClick={() => {
                  setShowUrlInput(false);
                  setUrlInput("");
                }}
                className="text-[var(--admin-text-muted)] hover:text-white p-0.5 rounded transition-colors cursor-pointer"
                title="Cancel"
              >
                <X size={13} />
              </button>
            </div>
            <input
              type="url"
              autoFocus
              value={urlInput}
              onChange={(e) => setUrlInput(e.target.value)}
              onKeyDown={(e) => {
                if (e.key === "Enter") {
                  e.preventDefault();
                  if (urlInput.trim()) {
                    onUrlSubmit(urlInput.trim());
                    setUrlInput("");
                    setShowUrlInput(false);
                  }
                }
              }}
              placeholder="https://..."
              className="w-full px-2.5 py-1.5 text-xs border border-white/10 rounded-[14px] bg-[var(--admin-surface)] text-white focus:outline-none focus:border-[var(--admin-primary)] transition-colors placeholder:text-[var(--admin-text-muted)]"
            />
          </div>

          <div className="flex flex-col gap-1.5 pt-2">
            <button
              type="button"
              disabled={!urlInput.trim()}
              onClick={() => {
                if (urlInput.trim()) {
                  onUrlSubmit(urlInput.trim());
                  setUrlInput("");
                  setShowUrlInput(false);
                }
              }}
              className="w-full py-1.5 bg-[var(--admin-primary)] hover:bg-[var(--admin-primary-hover)] text-white rounded-full text-xs font-medium disabled:opacity-40 transition-all cursor-pointer active:scale-95"
            >
              Crop &amp; Set
            </button>
            <button
              type="button"
              onClick={() => {
                setShowUrlInput(false);
                setUrlInput("");
              }}
              className="w-full py-1 text-[var(--admin-text-muted)] hover:text-white text-xs font-normal transition-colors cursor-pointer"
            >
              Cancel
            </button>
          </div>
        </div>
      ) : (
        <>
          {/* Centered Minimal Plus Icon */}
          <div className="w-10 h-10 rounded-full bg-[var(--admin-surface)] border border-white/10 flex items-center justify-center text-[var(--admin-text-muted)] group-hover:text-white group-hover:border-white/20 group-hover:scale-105 active:scale-95 transition-all">
            <Plus size={18} strokeWidth={2} />
          </div>

          {/* Clean Title & Subtitle */}
          <p className="text-xs font-semibold text-white mt-2.5 group-hover:text-white transition-colors">
            Add angle
          </p>
          <p className="text-[11px] text-[var(--admin-text-muted)] mt-0.5">
            Click or drag image
          </p>
          <p className="text-[10px] text-[var(--admin-text-muted)]/80 mt-1">
            {remainingSlots} {remainingSlots === 1 ? "slot" : "slots"} left
          </p>

          {/* Clean URL link */}
          <button
            type="button"
            onClick={(e) => {
              e.stopPropagation();
              setShowUrlInput(true);
            }}
            className="mt-3 text-[11px] text-[var(--admin-text-muted)] hover:text-white hover:underline transition-colors cursor-pointer"
          >
            or paste image URL
          </button>
        </>
      )}
    </div>
  );
}

/* ─── Reusable Sub-Components ────────────────────────────────────────────── */

function FormInput({
  label,
  value,
  onChange,
  type = "text",
  required,
  placeholder,
  prefix,
}: {
  label: string;
  value: string;
  onChange: (v: string) => void;
  type?: string;
  required?: boolean;
  placeholder?: string;
  prefix?: string;
}) {
  return (
    <div>
      <label className="block text-xs font-semibold text-[#A1A1AA] mb-1.5">
        {label}
        {required && <span className="text-[#FF4B55] ml-0.5">*</span>}
      </label>
      <div className="relative flex items-center">
        {prefix && (
          <span className="absolute left-3.5 text-[var(--admin-text-muted)] font-bold text-xs pointer-events-none">
            {prefix}
          </span>
        )}
        <input
          type={type}
          value={value}
          onChange={(e) => onChange(e.target.value)}
          required={required}
          placeholder={placeholder}
          className={`admin-input w-full h-10.5 text-xs bg-[var(--admin-surface-2)] border border-white/10 rounded-[14px] text-white placeholder:text-[var(--admin-text-muted)] focus:outline-none focus:border-[var(--admin-primary)] transition-colors ${prefix ? "pl-8" : "pl-3.5"} pr-3.5`}
        />
      </div>
    </div>
  );
}

function FormSelect({
  label,
  value,
  onChange,
  options,
  required,
}: {
  label: string;
  value: string;
  onChange: (v: string) => void;
  options: string[];
  required?: boolean;
}) {
  const selectOptions = options.map((opt) => ({
    value: opt,
    label: opt || "— None —",
  }));

  return (
    <div>
      <label className="block text-xs font-semibold text-[var(--admin-text-muted)] mb-1.5">
        {label}
        {required && <span className="text-[var(--admin-danger)] ml-0.5">*</span>}
      </label>
      <AdminSelect
        value={value}
        onValueChange={onChange}
        options={selectOptions}
        className="w-full"
        triggerClassName="h-10.5 text-xs"
        aria-label={label}
      />
    </div>
  );
}

function FormTextarea({
  label,
  value,
  onChange,
  rows = 3,
  placeholder,
}: {
  label: string;
  value: string;
  onChange: (v: string) => void;
  rows?: number;
  placeholder?: string;
}) {
  return (
    <div>
      <label className="block text-xs font-semibold text-[#A1A1AA] mb-1.5">{label}</label>
      <textarea
        value={value}
        onChange={(e) => onChange(e.target.value)}
        rows={rows}
        placeholder={placeholder}
        className="admin-input resize-y w-full text-xs leading-relaxed p-3 bg-[var(--admin-surface-2)] border border-white/10 rounded-[14px] text-white placeholder:text-[var(--admin-text-muted)] focus:outline-none focus:border-[var(--admin-primary)] transition-colors"
      />
    </div>
  );
}

function FormChipInput({
  label,
  value,
  onChange,
  placeholder,
}: {
  label: string;
  value: string;
  onChange: (v: string) => void;
  placeholder?: string;
}) {
  const chips = value
    .split(",")
    .map((s) => s.trim())
    .filter(Boolean);
  const [inputValue, setInputValue] = useState("");

  const handleKeyDown = (e: React.KeyboardEvent) => {
    if (e.key === "Enter" || e.key === ",") {
      e.preventDefault();
      if (inputValue.trim()) {
        onChange([...chips, inputValue.trim()].join(", "));
        setInputValue("");
      }
    } else if (e.key === "Backspace" && !inputValue && chips.length > 0) {
      onChange(chips.slice(0, -1).join(", "));
    }
  };

  const removeChip = (index: number) => {
    onChange(chips.filter((_, i) => i !== index).join(", "));
  };

  return (
    <div>
      <label className="block text-xs font-semibold text-[#A1A1AA] mb-1.5">{label}</label>
      <div className="admin-input min-h-[44px] h-auto p-1.5 flex flex-wrap gap-1.5 bg-[var(--admin-surface-2)] border border-white/10 rounded-[14px] focus-within:border-[var(--admin-primary)] transition-colors">
        {chips.map((chip, i) => (
          <span
            key={i}
            className="flex items-center gap-1.5 bg-[var(--admin-elevated)] border border-white/5 text-white px-2.5 py-0.5 rounded-full text-xs font-medium"
          >
            {chip}
            <button
              type="button"
              onClick={() => removeChip(i)}
              className="text-[var(--admin-text-muted)] hover:text-white transition-colors cursor-pointer"
            >
              <X size={12} />
            </button>
          </span>
        ))}
        <input
          type="text"
          value={inputValue}
          onChange={(e) => setInputValue(e.target.value)}
          onKeyDown={handleKeyDown}
          onBlur={() => {
            if (inputValue.trim()) {
              onChange([...chips, inputValue.trim()].join(", "));
              setInputValue("");
            }
          }}
          placeholder={chips.length === 0 ? placeholder : ""}
          className="flex-1 min-w-[120px] bg-transparent outline-none px-2 py-1 text-xs text-white placeholder:text-[var(--admin-text-muted)]"
        />
      </div>
    </div>
  );
}

function FormListInput({
  label,
  value,
  onChange,
  placeholder,
}: {
  label: string;
  value: string;
  onChange: (v: string) => void;
  placeholder?: string;
}) {
  const items = value
    .split("\n")
    .map((s) => s.trim())
    .filter(Boolean);
  const [inputValue, setInputValue] = useState("");

  const handleAdd = () => {
    if (inputValue.trim()) {
      onChange([...items, inputValue.trim()].join("\n"));
      setInputValue("");
    }
  };

  const handleKeyDown = (e: React.KeyboardEvent) => {
    if (e.key === "Enter") {
      e.preventDefault();
      handleAdd();
    }
  };

  const removeItem = (index: number) => {
    onChange(items.filter((_, i) => i !== index).join("\n"));
  };

  return (
    <div>
      <label className="block text-xs font-semibold text-[#A1A1AA] mb-1.5">{label}</label>
      <div className="flex gap-2 mb-2.5">
        <input
          type="text"
          value={inputValue}
          onChange={(e) => setInputValue(e.target.value)}
          onKeyDown={handleKeyDown}
          placeholder={placeholder}
          className="admin-input flex-1 h-10 text-xs bg-[var(--admin-surface-2)] border border-white/10 rounded-[14px] text-white placeholder:text-[var(--admin-text-muted)] focus:outline-none focus:border-[var(--admin-primary)] transition-colors"
        />
        <button
          type="button"
          onClick={handleAdd}
          disabled={!inputValue.trim()}
          className="px-4 py-2 bg-[var(--admin-surface)] border border-white/10 rounded-full text-xs font-bold hover:bg-[var(--admin-elevated)] disabled:opacity-40 disabled:cursor-not-allowed transition-colors text-white flex items-center gap-1 cursor-pointer"
        >
          <Plus size={14} />
          Add
        </button>
      </div>
      {items.length > 0 && (
        <ul className="space-y-1.5">
          {items.map((item, i) => (
            <li
              key={i}
              className="flex items-start gap-2 text-xs text-white bg-[var(--admin-surface-2)] border border-white/5 px-3 py-2 rounded-[14px] group"
            >
              <span className="w-1.5 h-1.5 rounded-full bg-[var(--admin-primary)] mt-1.5 shrink-0" />
              <span className="flex-1 leading-relaxed">{item}</span>
              <button
                type="button"
                onClick={() => removeItem(i)}
                className="text-[var(--admin-text-muted)] hover:text-[#FF4B55] opacity-0 group-hover:opacity-100 transition-opacity cursor-pointer"
              >
                <X size={14} />
              </button>
            </li>
          ))}
        </ul>
      )}
    </div>
  );
}
