"use client";

import React, { useState, useRef, useEffect } from "react";
import type { Product } from "@/types";
import {
  Upload,
  X,
  Image as ImageIcon,
  Plus,
  Sparkles,
  Tag,
  Info,
  Layers,
  ShoppingBag,
  Crop,
  Check,
  RotateCcw,
} from "lucide-react";
import { ImageCropperModal } from "./ImageCropperModal";

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
  badge: string;
  sizes: string;
  isNewArrival: boolean;
  inStock: boolean;
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
    badge: p.badge || "",
    sizes: p.sizes.join(", "),
    isNewArrival: p.isNewArrival,
    inStock: p.inStock,
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

function formDataToProduct(data: ProductFormData, existingId?: string): Product {
  const id = existingId || `vey-cst-${Date.now().toString(36)}`;
  const slug = data.name
    .toLowerCase()
    .replace(/[^a-z0-9]+/g, "-")
    .replace(/(^-|-$)/g, "");

  return {
    id,
    sku: id.toUpperCase().replace(/-/g, "_"),
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
    galleryImages: [],
    badge: (data.badge || undefined) as Product["badge"],
    sizes: data.sizes
      .split(",")
      .map((s) => s.trim())
      .filter(Boolean),
    isNewArrival: data.isNewArrival,
    inStock: data.inStock,
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
  badge: "NEW",
  sizes: "S, M, L, XL, XXL",
  isNewArrival: true,
  inStock: true,
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

  // Raw original image sources before cropping (for re-opening cropper)
  const [rawPrimaryImage, setRawPrimaryImage] = useState(form.imageUrl || "");
  const [rawSecondaryImage, setRawSecondaryImage] = useState(
    form.secondaryImageUrl || ""
  );

  // Image Cropper Modal State
  const [cropperModal, setCropperModal] = useState<{
    open: boolean;
    source: string;
    target: "primary" | "secondary";
  }>({
    open: false,
    source: "",
    target: "primary",
  });

  const update = (field: keyof ProductFormData, value: string | boolean) => {
    setForm((prev) => ({ ...prev, [field]: value }));
  };

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

    const result = formDataToProduct(form, product?.id);
    onSubmit(result);
  };

  // Live checklist calculation
  const isNameValid = form.name.trim().length > 0;
  const isPriceValid = parseFloat(form.price) > 0;
  const isCategoryValid = form.category.trim().length > 0;
  const isImageValid = form.imageUrl.trim().length > 0;
  const isFormComplete = isNameValid && isPriceValid && isCategoryValid;

  const currentPresets =
    CATEGORY_PRESETS[form.category] || CATEGORY_PRESETS["Clothing"];

  return (
    <>
      <form onSubmit={handleSubmit} className="w-full">
        <div className="grid grid-cols-1 xl:grid-cols-12 gap-8 items-start">
          {/* ── LEFT COLUMN: ALL STRUCTURED INPUT SECTIONS (8 COLS) ──────────── */}
          <div className="xl:col-span-8 space-y-7">
            {/* 1. Basic Information */}
            <div className="bg-white rounded-2xl border border-neutral-200/80 p-6 sm:p-7 shadow-2xs space-y-5">
              <div className="flex items-center gap-3 pb-3 border-b border-neutral-100">
                <div className="w-8 h-8 rounded-lg bg-amber-50 text-amber-700 border border-amber-200/60 flex items-center justify-center shrink-0">
                  <Tag size={16} />
                </div>
                <div>
                  <h2 className="text-sm font-bold uppercase tracking-wider text-neutral-900">
                    Basic Information
                  </h2>
                  <p className="text-xs text-neutral-400">
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
                      <span className="text-[10px] text-neutral-400 font-medium">Quick:</span>
                      {currentPresets.subcategories.map((sc) => (
                        <button
                          key={sc}
                          type="button"
                          onClick={() => update("subcategory", sc)}
                          className={`text-[10px] px-2 py-0.5 rounded-md border transition-all cursor-pointer ${
                            form.subcategory === sc
                              ? "bg-neutral-900 text-white border-neutral-900"
                              : "bg-neutral-50 hover:bg-neutral-100 border-neutral-200 text-neutral-600"
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
                      <span className="text-[10px] text-neutral-400 font-medium">Quick:</span>
                      {currentPresets.tags.map((tg) => (
                        <button
                          key={tg}
                          type="button"
                          onClick={() => update("subcategoryTag", tg)}
                          className={`text-[10px] px-2 py-0.5 rounded-md border transition-all cursor-pointer ${
                            form.subcategoryTag === tg
                              ? "bg-neutral-900 text-white border-neutral-900"
                              : "bg-neutral-50 hover:bg-neutral-100 border-neutral-200 text-neutral-600"
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
                      <span className="text-[10px] text-neutral-400 font-medium">Quick:</span>
                      {currentPresets.fits.map((ft) => (
                        <button
                          key={ft}
                          type="button"
                          onClick={() => update("fit", ft)}
                          className={`text-[10px] px-2 py-0.5 rounded-md border transition-all cursor-pointer ${
                            form.fit === ft
                              ? "bg-neutral-900 text-white border-neutral-900"
                              : "bg-neutral-50 hover:bg-neutral-100 border-neutral-200 text-neutral-600"
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
            <div className="bg-white rounded-2xl border border-neutral-200/80 p-6 sm:p-7 shadow-2xs space-y-5">
              <div className="flex items-center gap-3 pb-3 border-b border-neutral-100">
                <div className="w-8 h-8 rounded-lg bg-emerald-50 text-emerald-700 border border-emerald-200/60 flex items-center justify-center shrink-0">
                  <span className="font-bold text-xs">₹</span>
                </div>
                <div>
                  <h2 className="text-sm font-bold uppercase tracking-wider text-neutral-900">
                    Color, Pricing &amp; Merchandising
                  </h2>
                  <p className="text-xs text-neutral-400">
                    Swatch tone, retail currency, discounts, and storefront badge
                  </p>
                </div>
              </div>

              <div className="space-y-4 pt-1">
                {/* Row 1: Color Name (col 1), Color Hex (col 2), Product Badge (col 3) */}
                <div className="grid grid-cols-1 sm:grid-cols-3 gap-4 items-end">
                  <FormInput
                    label="Color Name"
                    required
                    value={form.colorName}
                    onChange={(v) => update("colorName", v)}
                    placeholder="e.g. Midnight Black"
                  />

                  {/* Color Hex with pixel-aligned swatch */}
                  <div>
                    <label className="block text-xs font-bold text-neutral-800 mb-1.5">
                      Color Swatch
                    </label>
                    <div className="flex items-center gap-2.5">
                      <div
                        className="relative w-10.5 h-10.5 rounded-xl border border-neutral-300 shadow-xs overflow-hidden flex-shrink-0 cursor-pointer transition-transform hover:scale-105"
                        style={{ backgroundColor: form.colorHex || "#111111" }}
                        title="Click to pick swatch color"
                      >
                        <input
                          type="color"
                          value={form.colorHex || "#111111"}
                          onChange={(e) => update("colorHex", e.target.value)}
                          className="opacity-0 absolute inset-0 w-full h-full cursor-pointer"
                        />
                      </div>
                      <input
                        type="text"
                        value={form.colorHex}
                        onChange={(e) => update("colorHex", e.target.value)}
                        placeholder="#111111"
                        className="admin-input flex-1 font-mono uppercase h-10.5 text-xs tracking-wider"
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
                        <span className="text-[10px] text-emerald-600 font-semibold mt-1 block">
                          ✓ Auto-calculated from MRP
                        </span>
                      )}
                  </div>
                </div>
              </div>
            </div>

            {/* 3. Images with Interactive Cropper Feature */}
            <div className="bg-white rounded-2xl border border-neutral-200/80 p-6 sm:p-7 shadow-2xs space-y-5">
              <div className="flex items-center justify-between pb-3 border-b border-neutral-100">
                <div className="flex items-center gap-3">
                  <div className="w-8 h-8 rounded-lg bg-blue-50 text-blue-700 border border-blue-200/60 flex items-center justify-center shrink-0">
                    <ImageIcon size={16} />
                  </div>
                  <div>
                    <h2 className="text-sm font-bold uppercase tracking-wider text-neutral-900">
                      Product Photography &amp; Framing
                    </h2>
                    <p className="text-xs text-neutral-400">
                      Studio primary hero and secondary hover preview with 3:4 / 1:1 image cropper
                    </p>
                  </div>
                </div>
                <div className="hidden sm:flex items-center gap-1.5 text-neutral-500 bg-neutral-100/70 px-2.5 py-1 rounded-lg text-xs font-semibold">
                  <Crop size={13} className="text-amber-500" />
                  <span>Auto-Crop Active</span>
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
            </div>

            {/* 4. Sizes & Inventory */}
            <div className="bg-white rounded-2xl border border-neutral-200/80 p-6 sm:p-7 shadow-2xs space-y-5">
              <div className="flex items-center gap-3 pb-3 border-b border-neutral-100">
                <div className="w-8 h-8 rounded-lg bg-purple-50 text-purple-700 border border-purple-200/60 flex items-center justify-center shrink-0">
                  <Layers size={16} />
                </div>
                <div>
                  <h2 className="text-sm font-bold uppercase tracking-wider text-neutral-900">
                    Sizes &amp; Inventory Status
                  </h2>
                  <p className="text-xs text-neutral-400">
                    Stock availability, size variants, and fitting notes
                  </p>
                </div>
              </div>

              <div className="space-y-4 pt-1">
                <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                  <div>
                    <FormChipInput
                      label="Available Sizes"
                      value={form.sizes}
                      onChange={(v) => update("sizes", v)}
                      placeholder="Type size and press Enter (e.g. XL)"
                    />
                    {/* Category Size Presets */}
                    <div className="flex items-center gap-1.5 mt-2 flex-wrap">
                      <span className="text-[10px] text-neutral-400 font-medium">Add:</span>
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
                              update("sizes", [...existing, sz].join(", "));
                            }
                          }}
                          className="text-[10px] px-2 py-0.5 rounded-md border bg-neutral-50 hover:bg-neutral-100 border-neutral-200 text-neutral-600 transition-colors cursor-pointer"
                        >
                          +{sz}
                        </button>
                      ))}
                    </div>
                  </div>

                  <FormInput
                    label="Fit / Size Guide Note"
                    value={form.sizeGuide}
                    onChange={(v) => update("sizeGuide", v)}
                    placeholder="e.g. Relaxed fit — recommended true to size"
                  />
                </div>

                {/* Toggles */}
                <div className="grid grid-cols-1 sm:grid-cols-2 gap-3.5 pt-2">
                  <label className="flex items-center gap-3 p-3.5 rounded-xl border border-neutral-200 bg-neutral-50/60 hover:bg-neutral-100/70 cursor-pointer select-none transition-colors">
                    <input
                      type="checkbox"
                      checked={form.inStock}
                      onChange={(e) => update("inStock", e.target.checked)}
                      className="w-4.5 h-4.5 rounded text-amber-500 focus:ring-amber-400 cursor-pointer"
                    />
                    <div>
                      <span className="block text-xs font-bold text-neutral-900">
                        Mark as In Stock
                      </span>
                      <span className="block text-[11px] text-neutral-500">
                        Product is available for immediate checkout
                      </span>
                    </div>
                  </label>

                  <label className="flex items-center gap-3 p-3.5 rounded-xl border border-neutral-200 bg-neutral-50/60 hover:bg-neutral-100/70 cursor-pointer select-none transition-colors">
                    <input
                      type="checkbox"
                      checked={form.isNewArrival}
                      onChange={(e) => update("isNewArrival", e.target.checked)}
                      className="w-4.5 h-4.5 rounded text-amber-500 focus:ring-amber-400 cursor-pointer"
                    />
                    <div>
                      <span className="block text-xs font-bold text-neutral-900">
                        Tag as New Arrival
                      </span>
                      <span className="block text-[11px] text-neutral-500">
                        Promote in storefront New Arrivals ribbon
                      </span>
                    </div>
                  </label>
                </div>
              </div>
            </div>

            {/* 5. Descriptions & Details */}
            <div className="bg-white rounded-2xl border border-neutral-200/80 p-6 sm:p-7 shadow-2xs space-y-5">
              <div className="flex items-center gap-3 pb-3 border-b border-neutral-100">
                <div className="w-8 h-8 rounded-lg bg-stone-100 text-stone-700 border border-stone-200 flex items-center justify-center shrink-0">
                  <Info size={16} />
                </div>
                <div>
                  <h2 className="text-sm font-bold uppercase tracking-wider text-neutral-900">
                    Descriptions &amp; Garment Care
                  </h2>
                  <p className="text-xs text-neutral-400">
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
            <div className="bg-white rounded-2xl border border-neutral-200/80 p-6 sm:p-7 shadow-2xs space-y-5">
              <div className="flex items-center gap-3 pb-3 border-b border-neutral-100">
                <div className="w-8 h-8 rounded-lg bg-amber-50 text-amber-700 border border-amber-200/60 flex items-center justify-center shrink-0">
                  <Sparkles size={16} />
                </div>
                <div>
                  <h2 className="text-sm font-bold uppercase tracking-wider text-neutral-900">
                    Collections &amp; Search Tags
                  </h2>
                  <p className="text-xs text-neutral-400">
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
            <div className="bg-white rounded-2xl border border-neutral-200/80 p-6 shadow-xs space-y-5">
              <div className="flex items-center justify-between pb-3 border-b border-neutral-100">
                <span className="text-xs font-bold uppercase tracking-wider text-neutral-900 flex items-center gap-2">
                  <ShoppingBag size={15} className="text-amber-500" />
                  Publication Action
                </span>
                <span
                  className={`text-[11px] font-bold px-2 py-0.5 rounded-full ${
                    isFormComplete
                      ? "bg-emerald-50 text-emerald-700 border border-emerald-200"
                      : "bg-amber-50 text-amber-700 border border-amber-200"
                  }`}
                >
                  {isFormComplete ? "Ready to Launch" : "Draft (Missing Info)"}
                </span>
              </div>

              {/* Requirement Checklist */}
              <div className="space-y-2.5 text-xs">
                <div className="flex items-center justify-between">
                  <span className="text-neutral-600">Product Name:</span>
                  <span
                    className={
                      isNameValid
                        ? "text-emerald-600 font-bold flex items-center gap-1"
                        : "text-neutral-400 font-medium"
                    }
                  >
                    {isNameValid ? "✓ Provided" : "Required"}
                  </span>
                </div>
                <div className="flex items-center justify-between">
                  <span className="text-neutral-600">Selling Price:</span>
                  <span
                    className={
                      isPriceValid
                        ? "text-emerald-600 font-bold flex items-center gap-1"
                        : "text-neutral-400 font-medium"
                    }
                  >
                    {isPriceValid
                      ? `✓ ₹${parseFloat(form.price).toLocaleString("en-IN")}`
                      : "Required"}
                  </span>
                </div>
                <div className="flex items-center justify-between">
                  <span className="text-neutral-600">Primary Hero Image:</span>
                  <span
                    className={
                      isImageValid
                        ? "text-emerald-600 font-bold flex items-center gap-1"
                        : "text-amber-600 font-medium"
                    }
                  >
                    {isImageValid ? "✓ Cropped & Set" : "Recommended"}
                  </span>
                </div>
              </div>

              {/* Concise Product Metrics Summary */}
              <div className="p-3.5 bg-neutral-50 rounded-xl border border-neutral-200/70 space-y-2 text-xs">
                <div className="flex items-center justify-between">
                  <span className="text-neutral-500">Taxonomy:</span>
                  <span className="font-semibold text-neutral-800">
                    {form.category} · {form.subcategory || "General"}
                  </span>
                </div>
                <div className="flex items-center justify-between">
                  <span className="text-neutral-500">Color Swatch:</span>
                  <span className="font-semibold text-neutral-800 flex items-center gap-1.5">
                    <span
                      className="w-2.5 h-2.5 rounded-full border border-neutral-300 shrink-0"
                      style={{ backgroundColor: form.colorHex || "#111111" }}
                    />
                    {form.colorName || "Default"}
                  </span>
                </div>
                <div className="flex items-center justify-between">
                  <span className="text-neutral-500">Stock Availability:</span>
                  <span
                    className={`font-semibold ${
                      form.inStock ? "text-emerald-600" : "text-amber-600"
                    }`}
                  >
                    {form.inStock ? "In Stock" : "Out of Stock"}
                  </span>
                </div>
                {form.badge && (
                  <div className="flex items-center justify-between">
                    <span className="text-neutral-500">Badge:</span>
                    <span className="text-[10px] font-extrabold uppercase px-1.5 py-0.5 rounded bg-neutral-900 text-[#fde047]">
                      {form.badge}
                    </span>
                  </div>
                )}
              </div>

              <div className="pt-2 border-t border-neutral-100">
                <button
                  type="submit"
                  disabled={!isNameValid || !isPriceValid}
                  className="w-full flex items-center justify-center gap-2.5 bg-neutral-900 text-white hover:bg-neutral-800 disabled:bg-neutral-300 disabled:cursor-not-allowed py-3.5 px-6 rounded-xl font-bold text-sm transition-all shadow-sm hover:shadow cursor-pointer active:scale-[0.98]"
                >
                  <Plus size={17} />
                  <span>{submitLabel}</span>
                </button>
                <p className="text-[11px] text-neutral-400 text-center mt-2.5 flex items-center justify-center gap-1.5">
                  <span className="w-1.5 h-1.5 rounded-full bg-emerald-500 animate-pulse" />
                  Live update takes effect immediately on storefront
                </p>
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
              : "Crop Secondary Hover Image"
          }
          initialAspect="3/4"
          onCrop={(croppedResult) => {
            if (cropperModal.target === "primary") {
              update("imageUrl", croppedResult);
            } else {
              update("secondaryImageUrl", croppedResult);
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
      <label className="block text-xs font-bold text-neutral-800 mb-1.5">
        {label}
        {required && <span className="text-rose-500 ml-0.5">*</span>}
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
        <div className="rounded-xl border border-neutral-200 overflow-hidden bg-neutral-50/70 p-3 space-y-3">
          <div className="relative aspect-[3/4] w-full rounded-lg overflow-hidden border border-neutral-200 bg-white group">
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
                className="flex items-center gap-1 px-2.5 py-1.5 bg-neutral-900/90 hover:bg-neutral-900 text-white rounded-lg text-xs font-bold transition-all shadow-md cursor-pointer hover:scale-105 active:scale-95"
                title="Adjust crop & framing"
                aria-label="Adjust crop"
              >
                <Crop size={13} className="text-[#fcd017]" />
                <span>Crop</span>
              </button>
              <button
                type="button"
                onClick={onRemove}
                className="p-1.5 bg-rose-600 hover:bg-rose-700 text-white rounded-lg transition-colors shadow-md cursor-pointer hover:scale-105 active:scale-95"
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
              className="flex-1 flex items-center justify-center gap-1.5 text-xs font-bold text-neutral-900 bg-white border border-neutral-200 px-3 py-2 rounded-lg hover:bg-neutral-50 transition-colors shadow-2xs cursor-pointer"
            >
              <Crop size={14} className="text-amber-500" />
              <span>Adjust Crop / Framing</span>
            </button>
            <button
              type="button"
              onClick={() => fileInputRef.current?.click()}
              className="text-xs font-semibold text-neutral-700 bg-white border border-neutral-200 px-3 py-2 rounded-lg hover:bg-neutral-50 transition-colors cursor-pointer"
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
          className={`flex flex-col items-center justify-center p-5 border-2 border-dashed rounded-xl transition-all duration-200 ${
            isDragging
              ? "border-amber-500 bg-amber-50/20 scale-[1.01]"
              : "border-neutral-300 hover:border-neutral-400 bg-neutral-50/40"
          }`}
        >
          <div className="w-10 h-10 bg-white rounded-full shadow-2xs border border-neutral-200 flex items-center justify-center mb-2.5 text-neutral-400">
            <Upload size={18} />
          </div>
          <p className="text-xs font-bold text-neutral-800 mb-0.5">Drag &amp; drop image here</p>
          <p className="text-[11px] text-neutral-400 mb-3">
            Will automatically open crop editor
          </p>
          <button
            type="button"
            onClick={() => fileInputRef.current?.click()}
            className="text-xs font-bold text-neutral-900 bg-white border border-neutral-200 shadow-2xs px-3.5 py-1.5 rounded-lg hover:bg-neutral-50 transition-colors inline-flex items-center gap-1.5 cursor-pointer active:scale-95"
          >
            <ImageIcon size={14} /> Select File
          </button>

          <div className="mt-3.5 flex items-center gap-2.5 w-full">
            <div className="h-px bg-neutral-200 flex-1" />
            <span className="text-[9px] uppercase font-bold text-neutral-400 tracking-wider">
              or paste image URL
            </span>
            <div className="h-px bg-neutral-200 flex-1" />
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
              className="admin-input flex-1 text-xs font-mono h-9"
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
              className="px-3 py-1.5 bg-neutral-900 text-white rounded-lg text-xs font-bold hover:bg-neutral-800 disabled:opacity-40 disabled:cursor-not-allowed transition-colors cursor-pointer shrink-0"
            >
              Crop &amp; Set
            </button>
          </div>
        </div>
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
      <label className="block text-xs font-bold text-neutral-800 mb-1.5">
        {label}
        {required && <span className="text-rose-500 ml-0.5">*</span>}
      </label>
      <div className="relative flex items-center">
        {prefix && (
          <span className="absolute left-3.5 text-neutral-400 font-bold text-xs pointer-events-none">
            {prefix}
          </span>
        )}
        <input
          type={type}
          value={value}
          onChange={(e) => onChange(e.target.value)}
          required={required}
          placeholder={placeholder}
          className={`admin-input w-full h-10.5 text-xs ${prefix ? "pl-8" : "pl-3.5"} pr-3.5`}
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
  return (
    <div>
      <label className="block text-xs font-bold text-neutral-800 mb-1.5">
        {label}
        {required && <span className="text-rose-500 ml-0.5">*</span>}
      </label>
      <select
        value={value}
        onChange={(e) => onChange(e.target.value)}
        className="admin-input w-full h-10.5 text-xs font-semibold cursor-pointer"
      >
        {options.map((opt) => (
          <option key={opt} value={opt}>
            {opt || "— None —"}
          </option>
        ))}
      </select>
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
      <label className="block text-xs font-bold text-neutral-800 mb-1.5">{label}</label>
      <textarea
        value={value}
        onChange={(e) => onChange(e.target.value)}
        rows={rows}
        placeholder={placeholder}
        className="admin-input resize-y w-full text-xs leading-relaxed p-3"
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
      <label className="block text-xs font-bold text-neutral-800 mb-1.5">{label}</label>
      <div className="admin-input min-h-[44px] h-auto p-1.5 flex flex-wrap gap-1.5 focus-within:ring-2 focus-within:ring-neutral-900/10 focus-within:border-neutral-900 bg-white">
        {chips.map((chip, i) => (
          <span
            key={i}
            className="flex items-center gap-1.5 bg-neutral-100 border border-neutral-200 text-neutral-800 px-2 py-0.5 rounded-md text-xs font-medium"
          >
            {chip}
            <button
              type="button"
              onClick={() => removeChip(i)}
              className="text-neutral-400 hover:text-red-500 transition-colors cursor-pointer"
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
          className="flex-1 min-w-[120px] bg-transparent outline-none px-2 py-1 text-xs text-neutral-900 placeholder:text-neutral-400"
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
      <label className="block text-xs font-bold text-neutral-800 mb-1.5">{label}</label>
      <div className="flex gap-2 mb-2.5">
        <input
          type="text"
          value={inputValue}
          onChange={(e) => setInputValue(e.target.value)}
          onKeyDown={handleKeyDown}
          placeholder={placeholder}
          className="admin-input flex-1 h-10 text-xs"
        />
        <button
          type="button"
          onClick={handleAdd}
          disabled={!inputValue.trim()}
          className="px-3.5 py-2 bg-neutral-100 border border-neutral-200 rounded-lg text-xs font-bold hover:bg-neutral-200 disabled:opacity-40 disabled:cursor-not-allowed transition-colors text-neutral-800 flex items-center gap-1 cursor-pointer"
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
              className="flex items-start gap-2 text-xs text-neutral-800 bg-neutral-50 border border-neutral-200/60 px-3 py-2 rounded-lg group"
            >
              <span className="w-1.5 h-1.5 rounded-full bg-amber-500 mt-1.5 shrink-0" />
              <span className="flex-1 leading-relaxed">{item}</span>
              <button
                type="button"
                onClick={() => removeItem(i)}
                className="text-neutral-400 hover:text-red-500 opacity-0 group-hover:opacity-100 transition-opacity cursor-pointer"
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
