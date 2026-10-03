"use client";

import React, { useState, useRef } from "react";
import type { Product } from "@/types";
import { Upload, Save, X, Image as ImageIcon, Plus } from "lucide-react";

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
    colorHex: p.colorHex,
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
  colorName: "",
  colorHex: "#111111",
  material: "",
  price: "",
  originalPrice: "",
  discount: "",
  imageUrl: "",
  secondaryImageUrl: "",
  badge: "",
  sizes: "S, M, L, XL, XXL",
  isNewArrival: false,
  inStock: true,
  shortDescription: "",
  longDescription: "",
  features: "",
  care: "Machine wash cold\nTumble dry low\nDo not bleach\nIron on low if needed",
  sizeGuide: "",
  collections: "",
  tags: "",
  relatedProducts: "",
};

const BADGE_OPTIONS = ["", "NEW", "SALE", "BESTSELLER", "LIMITED", "TRENDING", "PREMIUM", "EXCLUSIVE", "NEW ARRIVAL"];

/* ─── Main Form Component ────────────────────────────────────────────────── */
interface ProductFormProps {
  product?: Product;
  onSubmit: (product: Product) => void;
  submitLabel?: string;
}

export function ProductForm({ product, onSubmit, submitLabel = "Save Product" }: ProductFormProps) {
  const [form, setForm] = useState<ProductFormData>(
    product ? productToFormData(product) : DEFAULT_FORM
  );

  const update = (field: keyof ProductFormData, value: string | boolean) => {
    setForm((prev) => ({ ...prev, [field]: value }));
  };

  const handleFileProcess = (file: File, field: "imageUrl" | "secondaryImageUrl") => {
    if (file.size > 200 * 1024) {
      const sizeKB = (file.size / 1024).toFixed(0);
      if (
        !confirm(
          `This image is ${sizeKB}KB. Base64 encoding increases size ~33%. ` +
            `Large images may exceed localStorage limits (~5MB total). Continue?`
        )
      ) {
        return;
      }
    }

    const reader = new FileReader();
    reader.onloadend = () => {
      update(field, reader.result as string);
    };
    reader.readAsDataURL(file);
  };

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();

    if (!form.name.trim()) {
      alert("Product name is required.");
      return;
    }
    if (!form.price || parseFloat(form.price) <= 0) {
      alert("Valid price is required.");
      return;
    }

    const result = formDataToProduct(form, product?.id);
    onSubmit(result);
  };

  return (
    <form onSubmit={handleSubmit} className="bg-white rounded-2xl border border-veyro-border p-6 sm:p-8 space-y-10 max-w-4xl shadow-sm">
      {/* Basic Info */}
      <fieldset className="space-y-5">
        <legend className="text-xs font-bold uppercase tracking-widest text-veyro-muted mb-4 border-b border-veyro-border/50 pb-2 w-full">
          Basic Information
        </legend>
        <div className="grid grid-cols-1 md:grid-cols-2 gap-x-6 gap-y-5">
          <div className="md:col-span-2">
            <FormInput label="Product Name *" value={form.name} onChange={(v) => update("name", v)} required placeholder="e.g. Core Oversized Wolf Tee" />
          </div>
          <FormSelect
            label="Category *"
            value={form.category}
            onChange={(v) => update("category", v)}
            options={["Clothing", "Footwear", "Watches"]}
          />
          <FormInput label="Subcategory" value={form.subcategory} onChange={(v) => update("subcategory", v)} placeholder="e.g. T-Shirts, Shoes" />
          <FormInput label="Subcategory Tag" value={form.subcategoryTag} onChange={(v) => update("subcategoryTag", v)} placeholder="e.g. Oversized, Retro" />
          <FormInput label="Fit" value={form.fit} onChange={(v) => update("fit", v)} placeholder="e.g. Oversized, Regular, Relaxed" />
          <div className="md:col-span-2">
            <FormInput label="Material" value={form.material} onChange={(v) => update("material", v)} placeholder="e.g. 100% Combed Cotton, 240gsm" />
          </div>
        </div>
      </fieldset>

      {/* Color & Pricing */}
      <fieldset className="space-y-5">
        <legend className="text-xs font-bold uppercase tracking-widest text-veyro-muted mb-4 border-b border-veyro-border/50 pb-2 w-full">
          Color &amp; Pricing
        </legend>
        <div className="grid grid-cols-1 md:grid-cols-3 gap-x-6 gap-y-5">
          <FormInput label="Color Name *" value={form.colorName} onChange={(v) => update("colorName", v)} placeholder="e.g. Black, Off-White" />
          <div>
            <label className="block text-[13px] font-semibold text-veyro-black mb-1.5">Color Hex</label>
            <div className="flex items-center gap-3">
              <div className="relative w-11 h-11 rounded-lg border border-veyro-border shadow-sm overflow-hidden flex-shrink-0 cursor-pointer">
                <input
                  type="color"
                  value={form.colorHex}
                  onChange={(e) => update("colorHex", e.target.value)}
                  className="absolute -top-2 -left-2 w-16 h-16 cursor-pointer"
                />
              </div>
              <input
                type="text"
                value={form.colorHex}
                onChange={(e) => update("colorHex", e.target.value)}
                className="admin-input flex-1 font-mono uppercase"
                placeholder="#111111"
              />
            </div>
          </div>
          <div className="hidden md:block"></div> {/* Spacer */}

          <FormInput label="Price (₹) *" type="number" value={form.price} onChange={(v) => update("price", v)} required placeholder="1199" />
          <FormInput label="Original Price (₹)" type="number" value={form.originalPrice} onChange={(v) => update("originalPrice", v)} placeholder="1599" />
          <div className="flex flex-col gap-1.5 justify-end">
            <FormInput label="Discount Label" value={form.discount} onChange={(v) => update("discount", v)} placeholder="e.g. 15% OFF" />
          </div>
          
          <div className="md:col-span-3">
            <FormSelect label="Product Badge" value={form.badge} onChange={(v) => update("badge", v)} options={BADGE_OPTIONS} />
          </div>
        </div>
      </fieldset>

      {/* Images (Drag & Drop) */}
      <fieldset className="space-y-5">
        <legend className="text-xs font-bold uppercase tracking-widest text-veyro-muted mb-4 border-b border-veyro-border/50 pb-2 w-full">
          Images
        </legend>
        <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
          <DragDropImageField
            label="Primary Image *"
            value={form.imageUrl}
            onUrlChange={(v) => update("imageUrl", v)}
            onFileDrop={(f) => handleFileProcess(f, "imageUrl")}
          />
          <DragDropImageField
            label="Secondary Image (hover view)"
            value={form.secondaryImageUrl}
            onUrlChange={(v) => update("secondaryImageUrl", v)}
            onFileDrop={(f) => handleFileProcess(f, "secondaryImageUrl")}
          />
        </div>
      </fieldset>

      {/* Sizes & Stock */}
      <fieldset className="space-y-5">
        <legend className="text-xs font-bold uppercase tracking-widest text-veyro-muted mb-4 border-b border-veyro-border/50 pb-2 w-full">
          Sizes &amp; Inventory
        </legend>
        <div className="grid grid-cols-1 md:grid-cols-2 gap-x-6 gap-y-5">
          <FormChipInput label="Available Sizes" value={form.sizes} onChange={(v) => update("sizes", v)} placeholder="Type size and press Enter (e.g. XL)" />
          <FormInput label="Size Guide Note" value={form.sizeGuide} onChange={(v) => update("sizeGuide", v)} placeholder="e.g. Oversized fit — size down one" />
        </div>
        <div className="flex items-center gap-8 mt-4 bg-gray-50/50 p-4 rounded-xl border border-veyro-border/50">
          <label className="flex items-center gap-3 text-[14px] font-medium text-veyro-black cursor-pointer select-none group">
            <div className="relative flex items-center justify-center">
              <input
                type="checkbox"
                checked={form.inStock}
                onChange={(e) => update("inStock", e.target.checked)}
                className="w-5 h-5 appearance-none rounded border-2 border-veyro-muted checked:border-veyro-yellow checked:bg-veyro-yellow transition-colors"
              />
              {form.inStock && <svg className="absolute w-3.5 h-3.5 text-veyro-black pointer-events-none" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth={3}><path strokeLinecap="round" strokeLinejoin="round" d="M5 13l4 4L19 7" /></svg>}
            </div>
            Mark as In Stock
          </label>
          <label className="flex items-center gap-3 text-[14px] font-medium text-veyro-black cursor-pointer select-none group">
            <div className="relative flex items-center justify-center">
              <input
                type="checkbox"
                checked={form.isNewArrival}
                onChange={(e) => update("isNewArrival", e.target.checked)}
                className="w-5 h-5 appearance-none rounded border-2 border-veyro-muted checked:border-veyro-yellow checked:bg-veyro-yellow transition-colors"
              />
              {form.isNewArrival && <svg className="absolute w-3.5 h-3.5 text-veyro-black pointer-events-none" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth={3}><path strokeLinecap="round" strokeLinejoin="round" d="M5 13l4 4L19 7" /></svg>}
            </div>
            Tag as New Arrival
          </label>
        </div>
      </fieldset>

      {/* Descriptions */}
      <fieldset className="space-y-5">
        <legend className="text-xs font-bold uppercase tracking-widest text-veyro-muted mb-4 border-b border-veyro-border/50 pb-2 w-full">
          Descriptions &amp; Details
        </legend>
        <div className="space-y-6">
          <FormTextarea label="Short Description (Appears on product cards / previews)" value={form.shortDescription} onChange={(v) => update("shortDescription", v)} rows={2} placeholder="1-2 sentence compelling summary" />
          <FormTextarea label="Long Description (Appears on detail page)" value={form.longDescription} onChange={(v) => update("longDescription", v)} rows={4} placeholder="Detailed paragraphs explaining the product..." />
          <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
            <FormListInput label="Features (Bullet Points)" value={form.features} onChange={(v) => update("features", v)} placeholder="e.g. Heavyweight 240gsm cotton" />
            <FormListInput label="Care Instructions" value={form.care} onChange={(v) => update("care", v)} placeholder="e.g. Machine wash cold" />
          </div>
        </div>
      </fieldset>

      {/* Tags & Collections */}
      <fieldset className="space-y-5">
        <legend className="text-xs font-bold uppercase tracking-widest text-veyro-muted mb-4 border-b border-veyro-border/50 pb-2 w-full">
          Tags &amp; Collections
        </legend>
        <div className="grid grid-cols-1 md:grid-cols-2 gap-x-6 gap-y-5">
          <FormChipInput label="Collections" value={form.collections} onChange={(v) => update("collections", v)} placeholder="e.g. Essentials" />
          <FormChipInput label="Tags" value={form.tags} onChange={(v) => update("tags", v)} placeholder="e.g. oversized, black" />
          <div className="md:col-span-2">
            <FormChipInput
              label="Related Product IDs"
              value={form.relatedProducts}
              onChange={(v) => update("relatedProducts", v)}
              placeholder="e.g. vey-tsh-ovr-002"
            />
          </div>
        </div>
      </fieldset>

      {/* Sticky Submit Bar */}
      <div className="sticky bottom-0 z-20 -mx-6 -mb-6 sm:-mx-8 sm:-mb-8 p-4 sm:p-5 bg-white/90 backdrop-blur-md border-t border-veyro-border flex flex-col sm:flex-row sm:items-center justify-between gap-4 rounded-b-2xl shadow-[0_-4px_20px_-10px_rgba(0,0,0,0.05)]">
        <div className="text-[13px] text-veyro-muted flex items-center gap-2">
          <div className="w-2 h-2 rounded-full bg-veyro-yellow animate-pulse" />
          All changes take effect immediately across all storefront collections.
        </div>
        <button
          type="submit"
          className="flex items-center justify-center gap-2 bg-veyro-yellow text-veyro-black px-8 py-3.5
            rounded-xl font-bold text-[14px] hover:bg-veyro-yellow-dark transition-all shadow-sm cursor-pointer hover:shadow hover:-translate-y-0.5 active:translate-y-0"
        >
          <Save size={18} />
          {submitLabel}
        </button>
      </div>
    </form>
  );
}

/* ─── Reusable Sub-Components ────────────────────────────────────────────── */

function FormInput({
  label, value, onChange, type = "text", required, placeholder,
}: {
  label: string; value: string; onChange: (v: string) => void;
  type?: string; required?: boolean; placeholder?: string;
}) {
  return (
    <div>
      <label className="block text-[13px] font-semibold text-veyro-black mb-1.5">
        {label}
      </label>
      <input
        type={type}
        value={value}
        onChange={(e) => onChange(e.target.value)}
        required={required}
        placeholder={placeholder}
        className="admin-input w-full"
      />
    </div>
  );
}

function FormSelect({
  label, value, onChange, options,
}: {
  label: string; value: string; onChange: (v: string) => void; options: string[];
}) {
  return (
    <div>
      <label className="block text-[13px] font-semibold text-veyro-black mb-1.5">
        {label}
      </label>
      <select value={value} onChange={(e) => onChange(e.target.value)} className="admin-input w-full">
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
  label, value, onChange, rows = 3, placeholder,
}: {
  label: string; value: string; onChange: (v: string) => void; rows?: number; placeholder?: string;
}) {
  return (
    <div>
      <label className="block text-[13px] font-semibold text-veyro-black mb-1.5">
        {label}
      </label>
      <textarea
        value={value}
        onChange={(e) => onChange(e.target.value)}
        rows={rows}
        placeholder={placeholder}
        className="admin-input resize-y w-full leading-relaxed"
      />
    </div>
  );
}

function FormChipInput({
  label, value, onChange, placeholder,
}: {
  label: string; value: string; onChange: (v: string) => void; placeholder?: string;
}) {
  const chips = value.split(',').map(s => s.trim()).filter(Boolean);
  const [inputValue, setInputValue] = useState("");

  const handleKeyDown = (e: React.KeyboardEvent) => {
    if (e.key === 'Enter' || e.key === ',') {
      e.preventDefault();
      if (inputValue.trim()) {
        onChange([...chips, inputValue.trim()].join(', '));
        setInputValue("");
      }
    } else if (e.key === 'Backspace' && !inputValue && chips.length > 0) {
      onChange(chips.slice(0, -1).join(', '));
    }
  };

  const removeChip = (index: number) => {
    onChange(chips.filter((_, i) => i !== index).join(', '));
  };

  return (
    <div>
      <label className="block text-[13px] font-semibold text-veyro-black mb-1.5">
        {label}
      </label>
      <div className="admin-input min-h-[44px] h-auto p-1.5 flex flex-wrap gap-1.5 focus-within:ring-2 focus-within:ring-veyro-black/10 focus-within:border-veyro-black/40 bg-white">
        {chips.map((chip, i) => (
          <span key={i} className="flex items-center gap-1.5 bg-veyro-surface border border-veyro-border text-veyro-black px-2.5 py-1 rounded-md text-[13px] font-medium">
            {chip}
            <button type="button" onClick={() => removeChip(i)} className="text-veyro-muted hover:text-red-500 transition-colors">
              <X size={14} />
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
               onChange([...chips, inputValue.trim()].join(', '));
               setInputValue("");
             }
          }}
          placeholder={chips.length === 0 ? placeholder : ""}
          className="flex-1 min-w-[140px] bg-transparent outline-none px-2 py-1 text-[14px] text-veyro-black placeholder:text-gray-400"
        />
      </div>
    </div>
  );
}

function FormListInput({
  label, value, onChange, placeholder,
}: {
  label: string; value: string; onChange: (v: string) => void; placeholder?: string;
}) {
  const items = value.split('\n').map(s => s.trim()).filter(Boolean);
  const [inputValue, setInputValue] = useState("");

  const handleAdd = () => {
    if (inputValue.trim()) {
      onChange([...items, inputValue.trim()].join('\n'));
      setInputValue("");
    }
  };

  const handleKeyDown = (e: React.KeyboardEvent) => {
    if (e.key === 'Enter') {
      e.preventDefault();
      handleAdd();
    }
  };

  const removeItem = (index: number) => {
    onChange(items.filter((_, i) => i !== index).join('\n'));
  };

  return (
    <div>
      <label className="block text-[13px] font-semibold text-veyro-black mb-1.5">
        {label}
      </label>
      <div className="flex gap-2 mb-3">
        <input
          type="text"
          value={inputValue}
          onChange={(e) => setInputValue(e.target.value)}
          onKeyDown={handleKeyDown}
          placeholder={placeholder}
          className="admin-input flex-1"
        />
        <button 
          type="button" 
          onClick={handleAdd}
          disabled={!inputValue.trim()}
          className="px-4 py-2 bg-veyro-surface border border-veyro-border rounded-lg text-[13px] font-semibold hover:bg-gray-100 disabled:opacity-50 disabled:cursor-not-allowed transition-colors text-veyro-black flex items-center gap-1.5"
        >
          <Plus size={16} />
          Add
        </button>
      </div>
      {items.length > 0 && (
        <ul className="space-y-2">
          {items.map((item, i) => (
             <li key={i} className="flex items-start gap-3 text-[14px] text-veyro-black bg-gray-50/70 border border-veyro-border/50 px-3 py-2.5 rounded-lg group">
                <span className="flex-1 leading-relaxed">{item}</span>
                <button type="button" onClick={() => removeItem(i)} className="text-gray-400 hover:text-red-500 opacity-0 group-hover:opacity-100 transition-opacity mt-0.5">
                   <X size={16} />
                </button>
             </li>
          ))}
        </ul>
      )}
    </div>
  );
}

function DragDropImageField({
  label, value, onUrlChange, onFileDrop,
}: {
  label: string;
  value: string;
  onUrlChange: (v: string) => void;
  onFileDrop: (f: File) => void;
}) {
  const [isDragging, setIsDragging] = useState(false);
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
      <label className="block text-[13px] font-semibold text-veyro-black mb-1.5">{label}</label>
      
      <div 
        className={`relative flex flex-col items-center justify-center p-6 border-2 border-dashed rounded-xl transition-all duration-200 ${
          isDragging 
            ? 'border-veyro-yellow bg-veyro-yellow/5' 
            : value 
              ? 'border-veyro-border/50 bg-gray-50/50' 
              : 'border-veyro-border hover:border-gray-400 hover:bg-gray-50/50'
        }`}
        onDragOver={(e) => { e.preventDefault(); setIsDragging(true); }}
        onDragLeave={() => setIsDragging(false)}
        onDrop={handleDrop}
      >
        <input 
          type="file" 
          accept="image/*" 
          ref={fileInputRef}
          onChange={(e) => {
            if (e.target.files?.[0]) onFileDrop(e.target.files[0]);
          }} 
          className="hidden" 
        />
        
        {value ? (
          <div className="w-full flex gap-4 items-center">
            <div className="w-20 h-24 rounded-lg overflow-hidden border border-veyro-border shadow-sm flex-shrink-0 bg-white">
              {/* eslint-disable-next-line @next/next/no-img-element */}
              <img src={value} alt="Preview" className="w-full h-full object-cover" />
            </div>
            <div className="flex-1 min-w-0">
              <input
                type="text"
                value={value}
                onChange={(e) => onUrlChange(e.target.value)}
                placeholder="Or paste URL here..."
                className="admin-input w-full text-xs font-mono mb-2"
              />
              <div className="flex gap-2">
                <button 
                  type="button" 
                  onClick={() => fileInputRef.current?.click()}
                  className="text-[12px] font-semibold text-veyro-black bg-white border border-veyro-border px-3 py-1.5 rounded-md hover:bg-gray-50 transition-colors"
                >
                  Change File
                </button>
                <button 
                  type="button" 
                  onClick={() => onUrlChange("")}
                  className="text-[12px] font-semibold text-red-600 bg-white border border-red-200 px-3 py-1.5 rounded-md hover:bg-red-50 transition-colors"
                >
                  Remove
                </button>
              </div>
            </div>
          </div>
        ) : (
          <div className="text-center w-full">
            <div className="w-12 h-12 bg-white rounded-full shadow-sm border border-veyro-border flex items-center justify-center mx-auto mb-3 text-veyro-muted">
              <Upload size={20} />
            </div>
            <p className="text-[14px] font-medium text-veyro-black mb-1">
              Drag &amp; drop an image
            </p>
            <p className="text-[12px] text-veyro-muted mb-4">
              or click to browse from your computer
            </p>
            <button 
              type="button" 
              onClick={() => fileInputRef.current?.click()}
              className="text-[13px] font-bold text-veyro-black bg-white border border-veyro-border shadow-sm px-4 py-2 rounded-lg hover:bg-gray-50 transition-colors inline-flex items-center gap-2"
            >
              <ImageIcon size={16} /> Select File
            </button>
            <div className="mt-4 flex items-center gap-3 w-full">
              <div className="h-px bg-veyro-border flex-1" />
              <span className="text-[10px] uppercase font-bold text-veyro-muted tracking-widest">or paste URL</span>
              <div className="h-px bg-veyro-border flex-1" />
            </div>
            <input
              type="text"
              value={value}
              onChange={(e) => onUrlChange(e.target.value)}
              placeholder="https://example.com/image.jpg"
              className="admin-input w-full mt-3 text-xs"
            />
          </div>
        )}
      </div>
    </div>
  );
}
