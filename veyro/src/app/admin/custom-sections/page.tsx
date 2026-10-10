"use client";

import React, { useState, useCallback, useRef } from "react";
import Image from "next/image";
import {
  Plus,
  X,
  Trash2,
  Edit3,
  ChevronDown,
  ChevronUp,
  Save,
  Eye,
  EyeOff,
  ImagePlus,
  Layers,
  SlidersHorizontal,
  ShoppingBag,
  ArrowLeft,
  AlertCircle,
  Check,
  GripVertical,
  Upload,
  Tag,
  Palette,
  DollarSign,
  FileText,
  Package,
  Filter,
} from "lucide-react";
import {
  useCustomSections,
  type CustomSection,
  type CustomSectionProduct,
  type CustomSectionFilter,
} from "@/context/CustomSectionsContext";

// ── Toast Component ──────────────────────────────────────────────────────────
function AdminToast({ message, type, onClose }: { message: string; type: "success" | "error"; onClose: () => void }) {
  return (
    <div
      className={`fixed top-6 right-6 z-[100] flex items-center gap-2.5 px-5 py-3.5 rounded-xl shadow-2xl border text-sm font-semibold animate-in fade-in slide-in-from-top-4 duration-300 motion-reduce:animate-none ${
        type === "success"
          ? "bg-emerald-50 border-emerald-200 text-emerald-800"
          : "bg-red-50 border-red-200 text-red-800"
      }`}
      role="alert"
    >
      {type === "success" ? <Check size={16} /> : <AlertCircle size={16} />}
      {message}
      <button onClick={onClose} className="ml-2 p-0.5 hover:opacity-70 cursor-pointer" aria-label="Dismiss">
        <X size={14} />
      </button>
    </div>
  );
}

// ── Section Card ─────────────────────────────────────────────────────────────
function SectionCard({
  section,
  onEdit,
  onDelete,
  onToggleActive,
}: {
  section: CustomSection;
  onEdit: () => void;
  onDelete: () => void;
  onToggleActive: () => void;
}) {
  const [confirmDelete, setConfirmDelete] = useState(false);

  return (
    <div className="bg-white rounded-2xl border border-neutral-200/80 shadow-sm hover:shadow-md transition-shadow overflow-hidden">
      {/* Preview Banner */}
      <div className="relative h-36 bg-gradient-to-br from-neutral-100 to-neutral-50 overflow-hidden">
        {section.carouselImages.length > 0 ? (
          <Image
            src={section.carouselImages[0].src}
            alt={section.carouselImages[0].alt || section.name}
            fill
            className="object-cover"
            unoptimized={section.carouselImages[0].src?.startsWith("data:")}
          />
        ) : (
          <div className="flex items-center justify-center h-full text-neutral-300">
            <ImagePlus size={40} />
          </div>
        )}
        {/* Status Badge */}
        <div className="absolute top-3 right-3">
          <span
            className={`px-2.5 py-1 rounded-full text-[10px] font-bold uppercase tracking-wider ${
              section.isActive
                ? "bg-emerald-500 text-white"
                : "bg-neutral-400 text-white"
            }`}
          >
            {section.isActive ? "LIVE" : "DRAFT"}
          </span>
        </div>
      </div>

      {/* Content */}
      <div className="p-5">
        <h3 className="text-base font-bold text-neutral-900 tracking-tight">{section.name}</h3>
        <p className="text-xs text-neutral-500 mt-1 line-clamp-2">{section.description || "No description"}</p>

        {/* Stats Row */}
        <div className="flex items-center gap-4 mt-4">
          <div className="flex items-center gap-1.5 text-xs text-neutral-500">
            <ImagePlus size={13} />
            <span>{section.carouselImages.length} images</span>
          </div>
          <div className="flex items-center gap-1.5 text-xs text-neutral-500">
            <ShoppingBag size={13} />
            <span>{section.products.length} products</span>
          </div>
          <div className="flex items-center gap-1.5 text-xs text-neutral-500">
            <Filter size={13} />
            <span>{section.filters.length} filters</span>
          </div>
        </div>

        {/* Actions Row */}
        <div className="flex items-center gap-2 mt-4 pt-4 border-t border-neutral-100">
          <button
            onClick={onEdit}
            className="flex-1 flex items-center justify-center gap-1.5 px-3 py-2 bg-neutral-900 text-white text-xs font-semibold rounded-lg hover:bg-neutral-800 transition-colors cursor-pointer"
          >
            <Edit3 size={13} />
            Edit
          </button>
          <button
            onClick={onToggleActive}
            className={`flex items-center justify-center gap-1.5 px-3 py-2 text-xs font-semibold rounded-lg transition-colors cursor-pointer ${
              section.isActive
                ? "bg-amber-50 text-amber-700 hover:bg-amber-100"
                : "bg-emerald-50 text-emerald-700 hover:bg-emerald-100"
            }`}
            aria-label={section.isActive ? "Deactivate section" : "Activate section"}
          >
            {section.isActive ? <EyeOff size={13} /> : <Eye size={13} />}
            {section.isActive ? "Hide" : "Show"}
          </button>
          {confirmDelete ? (
            <div className="flex items-center gap-1">
              <button
                onClick={() => {
                  onDelete();
                  setConfirmDelete(false);
                }}
                className="px-3 py-2 bg-red-600 text-white text-xs font-bold rounded-lg hover:bg-red-700 cursor-pointer"
              >
                Confirm
              </button>
              <button
                onClick={() => setConfirmDelete(false)}
                className="px-2 py-2 text-xs text-neutral-500 hover:text-neutral-700 cursor-pointer"
              >
                Cancel
              </button>
            </div>
          ) : (
            <button
              onClick={() => setConfirmDelete(true)}
              className="flex items-center justify-center p-2 text-neutral-400 hover:text-red-500 hover:bg-red-50 rounded-lg transition-colors cursor-pointer"
              aria-label="Delete section"
            >
              <Trash2 size={14} />
            </button>
          )}
        </div>
      </div>
    </div>
  );
}

// ── Product Form Modal ───────────────────────────────────────────────────────
function ProductFormModal({
  product,
  onSave,
  onClose,
}: {
  product?: CustomSectionProduct;
  onSave: (product: CustomSectionProduct) => void;
  onClose: () => void;
}) {
  const [name, setName] = useState(product?.name || "");
  const [price, setPrice] = useState(product?.price?.toString() || "");
  const [originalPrice, setOriginalPrice] = useState(product?.originalPrice?.toString() || "");
  const [description, setDescription] = useState(product?.description || "");
  const [imageUrl, setImageUrl] = useState(product?.imageUrl || "");
  const [secondaryImageUrl, setSecondaryImageUrl] = useState(product?.secondaryImageUrl || "");
  const [badge, setBadge] = useState(product?.badge || "");
  const [sizes, setSizes] = useState(product?.sizes?.join(", ") || "");
  const [colorName, setColorName] = useState(product?.colorName || "");
  const [colorHex, setColorHex] = useState(product?.colorHex || "#111111");
  const [material, setMaterial] = useState(product?.material || "");
  const [inStock, setInStock] = useState(product?.inStock ?? true);
  const [tags, setTags] = useState(product?.tags?.join(", ") || "");
  const [error, setError] = useState("");
  const fileInputRef = useRef<HTMLInputElement>(null);
  const secondaryFileInputRef = useRef<HTMLInputElement>(null);
  const [isPrimaryDragging, setIsPrimaryDragging] = useState(false);
  const [isSecondaryDragging, setIsSecondaryDragging] = useState(false);
  const [primaryUrlInput, setPrimaryUrlInput] = useState("");
  const [secondaryUrlInput, setSecondaryUrlInput] = useState("");

  const processFile = (file: File, setter: (url: string) => void) => {
    if (!file) return;
    if (!file.type.startsWith("image/")) {
      setError("Please select a valid image file (JPEG, PNG, WEBP, etc.)");
      return;
    }
    if (file.size > 5 * 1024 * 1024) {
      setError("Image must be under 5MB");
      return;
    }
    setError("");
    const reader = new FileReader();
    reader.onload = () => {
      setter(reader.result as string);
    };
    reader.readAsDataURL(file);
  };

  const handleImageUpload = (e: React.ChangeEvent<HTMLInputElement>, setter: (url: string) => void) => {
    const file = e.target.files?.[0];
    if (file) processFile(file, setter);
    e.target.value = "";
  };

  const handleSubmit = () => {
    if (!name.trim()) { setError("Product name is required"); return; }
    if (!price || isNaN(Number(price)) || Number(price) <= 0) { setError("Valid price is required"); return; }
    if (!imageUrl) { setError("Product image is required"); return; }
    if (!description.trim()) { setError("Description is required"); return; }

    const slug = name
      .toLowerCase()
      .trim()
      .replace(/[^\w\s-]/g, "")
      .replace(/[\s_]+/g, "-")
      .replace(/^-+|-+$/g, "");

    const productData: CustomSectionProduct = {
      id: product?.id || `csp_${Date.now()}_${Math.random().toString(36).substring(2, 7)}`,
      name: name.trim(),
      slug,
      price: Number(price),
      originalPrice: originalPrice ? Number(originalPrice) : undefined,
      description: description.trim(),
      imageUrl,
      secondaryImageUrl: secondaryImageUrl || undefined,
      badge: badge || undefined,
      sizes: sizes.split(",").map((s) => s.trim()).filter(Boolean),
      colorName: colorName || "Default",
      colorHex: colorHex || "#111111",
      material: material || "",
      inStock,
      tags: tags.split(",").map((t) => t.trim()).filter(Boolean),
    };

    onSave(productData);
  };

  return (
    <div className="fixed inset-0 z-[200] flex items-center justify-center bg-black/50 backdrop-blur-xs" onClick={onClose}>
      <div
        className="relative w-full max-w-2xl max-h-[90vh] bg-white rounded-2xl shadow-2xl overflow-y-auto mx-4 admin-scroll-container"
        onClick={(e) => e.stopPropagation()}
      >
        <div className="sticky top-0 bg-white z-10 flex items-center justify-between p-5 border-b border-neutral-100">
          <h3 className="text-lg font-bold text-neutral-900">
            {product ? "Edit Product" : "Add Product"}
          </h3>
          <button onClick={onClose} className="p-1.5 hover:bg-neutral-100 rounded-lg cursor-pointer" aria-label="Close">
            <X size={18} />
          </button>
        </div>

        <div className="p-5 space-y-5">
          {error && (
            <div className="flex items-center gap-2 p-3 bg-red-50 border border-red-200 rounded-xl text-xs text-red-700" role="alert">
              <AlertCircle size={14} />
              {error}
            </div>
          )}

          {/* Product Name */}
          <div>
            <label className="block text-xs font-semibold text-neutral-700 mb-1.5">
              Product Name <span className="text-red-400">*</span>
            </label>
            <input
              type="text"
              value={name}
              onChange={(e) => { setName(e.target.value); setError(""); }}
              placeholder="e.g. Leather Crossbody Bag"
              className="w-full px-3.5 py-2.5 bg-neutral-50 border border-neutral-200 rounded-xl text-sm focus:outline-none focus:ring-2 focus:ring-neutral-900 focus:border-transparent"
            />
          </div>

          {/* Price Row */}
          <div className="grid grid-cols-2 gap-4">
            <div>
              <label className="block text-xs font-semibold text-neutral-700 mb-1.5">
                Price (₹) <span className="text-red-400">*</span>
              </label>
              <input
                type="number"
                value={price}
                onChange={(e) => { setPrice(e.target.value); setError(""); }}
                placeholder="1999"
                min="1"
                className="w-full px-3.5 py-2.5 bg-neutral-50 border border-neutral-200 rounded-xl text-sm focus:outline-none focus:ring-2 focus:ring-neutral-900"
              />
            </div>
            <div>
              <label className="block text-xs font-semibold text-neutral-700 mb-1.5">
                Original Price (₹)
              </label>
              <input
                type="number"
                value={originalPrice}
                onChange={(e) => setOriginalPrice(e.target.value)}
                placeholder="2499"
                min="0"
                className="w-full px-3.5 py-2.5 bg-neutral-50 border border-neutral-200 rounded-xl text-sm focus:outline-none focus:ring-2 focus:ring-neutral-900"
              />
            </div>
          </div>

          {/* Description */}
          <div>
            <label className="block text-xs font-semibold text-neutral-700 mb-1.5">
              Description <span className="text-red-400">*</span>
            </label>
            <textarea
              value={description}
              onChange={(e) => { setDescription(e.target.value); setError(""); }}
              placeholder="Write a compelling product description..."
              rows={3}
              className="w-full px-3.5 py-2.5 bg-neutral-50 border border-neutral-200 rounded-xl text-sm focus:outline-none focus:ring-2 focus:ring-neutral-900 resize-none"
            />
          </div>

          {/* Images */}
          <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
            {/* Primary Image */}
            <div>
              <label className="block text-xs font-semibold text-neutral-700 mb-1.5">
                Primary Image <span className="text-red-400">*</span>
              </label>
              <input ref={fileInputRef} type="file" accept="image/*" className="hidden" onChange={(e) => handleImageUpload(e, setImageUrl)} />
              {imageUrl ? (
                <div className="relative w-full aspect-square rounded-xl overflow-hidden bg-neutral-100 border border-neutral-200 group">
                  <Image src={imageUrl} alt="Product Primary" fill className="object-cover" unoptimized={imageUrl.startsWith("data:")} />
                  <button
                    type="button"
                    onClick={() => { setImageUrl(""); if(fileInputRef.current) fileInputRef.current.value = ""; }}
                    className="absolute top-2 right-2 p-1.5 bg-red-500 text-white rounded-full hover:bg-red-600 transition-colors shadow-md cursor-pointer"
                    aria-label="Remove primary image"
                  >
                    <X size={14} />
                  </button>
                </div>
              ) : (
                <div className="space-y-2">
                  <div
                    tabIndex={0}
                    role="button"
                    aria-label="Upload primary product image"
                    onClick={() => fileInputRef.current?.click()}
                    onKeyDown={(e) => {
                      if (e.key === "Enter" || e.key === " ") {
                        e.preventDefault();
                        fileInputRef.current?.click();
                      }
                    }}
                    onDragOver={(e) => {
                      e.preventDefault();
                      setIsPrimaryDragging(true);
                    }}
                    onDragLeave={() => setIsPrimaryDragging(false)}
                    onDrop={(e) => {
                      e.preventDefault();
                      setIsPrimaryDragging(false);
                      const file = e.dataTransfer.files?.[0];
                      if (file) processFile(file, setImageUrl);
                    }}
                    className={`w-full aspect-square flex flex-col items-center justify-center gap-2 rounded-xl border-2 border-dashed transition-all cursor-pointer p-4 text-center ${
                      isPrimaryDragging
                        ? "border-neutral-900 bg-neutral-100 scale-[1.02]"
                        : "border-neutral-300 bg-neutral-50 hover:border-neutral-500 hover:bg-neutral-100 focus:border-neutral-900 focus:outline-none"
                    }`}
                  >
                    <Upload size={22} className={isPrimaryDragging ? "text-neutral-900" : "text-neutral-400"} />
                    <span className="text-xs font-semibold text-neutral-700">
                      {isPrimaryDragging ? "Drop image now" : "Drag & Drop or Click"}
                    </span>
                    <span className="text-[10px] text-neutral-400">Press Enter / Click to browse (Max 5MB)</span>
                  </div>
                  {/* Direct URL input */}
                  <div className="flex gap-1.5">
                    <input
                      type="url"
                      placeholder="Or paste URL + Enter"
                      value={primaryUrlInput}
                      onChange={(e) => setPrimaryUrlInput(e.target.value)}
                      onKeyDown={(e) => {
                        if (e.key === "Enter") {
                          e.preventDefault();
                          if (primaryUrlInput.trim()) {
                            setImageUrl(primaryUrlInput.trim());
                            setPrimaryUrlInput("");
                            setError("");
                          }
                        }
                      }}
                      className="flex-1 px-2.5 py-1.5 bg-neutral-50 border border-neutral-200 rounded-lg text-xs focus:outline-none focus:ring-1 focus:ring-neutral-900"
                    />
                    <button
                      type="button"
                      onClick={() => {
                        if (primaryUrlInput.trim()) {
                          setImageUrl(primaryUrlInput.trim());
                          setPrimaryUrlInput("");
                          setError("");
                        }
                      }}
                      className="px-2.5 py-1.5 bg-neutral-900 text-white rounded-lg text-xs font-medium hover:bg-neutral-800 transition-colors"
                    >
                      Set
                    </button>
                  </div>
                </div>
              )}
            </div>

            {/* Secondary Image */}
            <div>
              <label className="block text-xs font-semibold text-neutral-700 mb-1.5">
                Secondary Image <span className="text-neutral-400 font-normal">(Hover view)</span>
              </label>
              <input ref={secondaryFileInputRef} type="file" accept="image/*" className="hidden" onChange={(e) => handleImageUpload(e, setSecondaryImageUrl)} />
              {secondaryImageUrl ? (
                <div className="relative w-full aspect-square rounded-xl overflow-hidden bg-neutral-100 border border-neutral-200 group">
                  <Image src={secondaryImageUrl} alt="Product Secondary" fill className="object-cover" unoptimized={secondaryImageUrl.startsWith("data:")} />
                  <button
                    type="button"
                    onClick={() => { setSecondaryImageUrl(""); if(secondaryFileInputRef.current) secondaryFileInputRef.current.value = ""; }}
                    className="absolute top-2 right-2 p-1.5 bg-red-500 text-white rounded-full hover:bg-red-600 transition-colors shadow-md cursor-pointer"
                    aria-label="Remove secondary image"
                  >
                    <X size={14} />
                  </button>
                </div>
              ) : (
                <div className="space-y-2">
                  <div
                    tabIndex={0}
                    role="button"
                    aria-label="Upload secondary hover image"
                    onClick={() => secondaryFileInputRef.current?.click()}
                    onKeyDown={(e) => {
                      if (e.key === "Enter" || e.key === " ") {
                        e.preventDefault();
                        secondaryFileInputRef.current?.click();
                      }
                    }}
                    onDragOver={(e) => {
                      e.preventDefault();
                      setIsSecondaryDragging(true);
                    }}
                    onDragLeave={() => setIsSecondaryDragging(false)}
                    onDrop={(e) => {
                      e.preventDefault();
                      setIsSecondaryDragging(false);
                      const file = e.dataTransfer.files?.[0];
                      if (file) processFile(file, setSecondaryImageUrl);
                    }}
                    className={`w-full aspect-square flex flex-col items-center justify-center gap-2 rounded-xl border-2 border-dashed transition-all cursor-pointer p-4 text-center ${
                      isSecondaryDragging
                        ? "border-neutral-900 bg-neutral-100 scale-[1.02]"
                        : "border-neutral-300 bg-neutral-50 hover:border-neutral-500 hover:bg-neutral-100 focus:border-neutral-900 focus:outline-none"
                    }`}
                  >
                    <Upload size={22} className={isSecondaryDragging ? "text-neutral-900" : "text-neutral-400"} />
                    <span className="text-xs font-semibold text-neutral-700">
                      {isSecondaryDragging ? "Drop image now" : "Drag & Drop or Click"}
                    </span>
                    <span className="text-[10px] text-neutral-400">Optional hover view (Max 5MB)</span>
                  </div>
                  {/* Direct URL input */}
                  <div className="flex gap-1.5">
                    <input
                      type="url"
                      placeholder="Or paste URL + Enter"
                      value={secondaryUrlInput}
                      onChange={(e) => setSecondaryUrlInput(e.target.value)}
                      onKeyDown={(e) => {
                        if (e.key === "Enter") {
                          e.preventDefault();
                          if (secondaryUrlInput.trim()) {
                            setSecondaryImageUrl(secondaryUrlInput.trim());
                            setSecondaryUrlInput("");
                          }
                        }
                      }}
                      className="flex-1 px-2.5 py-1.5 bg-neutral-50 border border-neutral-200 rounded-lg text-xs focus:outline-none focus:ring-1 focus:ring-neutral-900"
                    />
                    <button
                      type="button"
                      onClick={() => {
                        if (secondaryUrlInput.trim()) {
                          setSecondaryImageUrl(secondaryUrlInput.trim());
                          setSecondaryUrlInput("");
                        }
                      }}
                      className="px-2.5 py-1.5 bg-neutral-900 text-white rounded-lg text-xs font-medium hover:bg-neutral-800 transition-colors"
                    >
                      Set
                    </button>
                  </div>
                </div>
              )}
            </div>
          </div>

          {/* Sizes, Color, Material, Badge */}
          <div className="grid grid-cols-2 gap-4">
            <div>
              <label className="block text-xs font-semibold text-neutral-700 mb-1.5">
                Sizes (comma-separated)
              </label>
              <input
                type="text"
                value={sizes}
                onChange={(e) => setSizes(e.target.value)}
                placeholder="S, M, L, XL"
                className="w-full px-3.5 py-2.5 bg-neutral-50 border border-neutral-200 rounded-xl text-sm focus:outline-none focus:ring-2 focus:ring-neutral-900"
              />
            </div>
            <div>
              <label className="block text-xs font-semibold text-neutral-700 mb-1.5">Badge</label>
              <select
                value={badge}
                onChange={(e) => setBadge(e.target.value)}
                className="w-full px-3.5 py-2.5 bg-neutral-50 border border-neutral-200 rounded-xl text-sm focus:outline-none focus:ring-2 focus:ring-neutral-900 cursor-pointer"
              >
                <option value="">No Badge</option>
                <option value="NEW">NEW</option>
                <option value="SALE">SALE</option>
                <option value="BESTSELLER">BESTSELLER</option>
                <option value="LIMITED">LIMITED</option>
                <option value="TRENDING">TRENDING</option>
                <option value="PREMIUM">PREMIUM</option>
                <option value="EXCLUSIVE">EXCLUSIVE</option>
              </select>
            </div>
          </div>

          <div className="grid grid-cols-3 gap-4">
            <div className="min-w-0">
              <label className="block text-xs font-semibold text-neutral-700 mb-1.5">Color Name</label>
              <input
                type="text"
                value={colorName}
                onChange={(e) => setColorName(e.target.value)}
                placeholder="Black"
                className="w-full px-3.5 py-2.5 bg-neutral-50 border border-neutral-200 rounded-xl text-sm focus:outline-none focus:ring-2 focus:ring-neutral-900"
              />
            </div>
            <div className="min-w-0">
              <label className="block text-xs font-semibold text-neutral-700 mb-1.5">Color Hex</label>
              <div className="flex items-center gap-2 min-w-0">
                <div
                  className="relative w-10 h-10 rounded-xl border border-neutral-200 overflow-hidden shrink-0 shadow-sm cursor-pointer hover:border-neutral-400 transition-colors"
                  title="Click to select color"
                >
                  <div
                    className="w-full h-full"
                    style={{ backgroundColor: /^#[0-9A-Fa-f]{6}$/.test(colorHex) ? colorHex : '#111111' }}
                  />
                  <input
                    type="color"
                    value={/^#[0-9A-Fa-f]{6}$/.test(colorHex) ? colorHex : '#111111'}
                    onChange={(e) => setColorHex(e.target.value.toUpperCase())}
                    className="absolute inset-0 w-full h-full opacity-0 cursor-pointer"
                    aria-label="Color picker"
                  />
                </div>
                <input
                  type="text"
                  value={colorHex}
                  maxLength={7}
                  onChange={(e) => {
                    let val = e.target.value;
                    if (val && !val.startsWith("#")) val = "#" + val;
                    setColorHex(val.toUpperCase());
                  }}
                  placeholder="#111111"
                  className="flex-1 min-w-0 px-3 py-2.5 bg-neutral-50 border border-neutral-200 rounded-xl text-sm font-mono uppercase focus:outline-none focus:ring-2 focus:ring-neutral-900"
                />
              </div>
            </div>
            <div className="min-w-0">
              <label className="block text-xs font-semibold text-neutral-700 mb-1.5">Material</label>
              <input
                type="text"
                value={material}
                onChange={(e) => setMaterial(e.target.value)}
                placeholder="Genuine Leather"
                className="w-full px-3.5 py-2.5 bg-neutral-50 border border-neutral-200 rounded-xl text-sm focus:outline-none focus:ring-2 focus:ring-neutral-900"
              />
            </div>
          </div>

          {/* Tags */}
          <div>
            <label className="block text-xs font-semibold text-neutral-700 mb-1.5">
              Tags (comma-separated)
            </label>
            <input
              type="text"
              value={tags}
              onChange={(e) => setTags(e.target.value)}
              placeholder="leather, premium, handcrafted"
              className="w-full px-3.5 py-2.5 bg-neutral-50 border border-neutral-200 rounded-xl text-sm focus:outline-none focus:ring-2 focus:ring-neutral-900"
            />
          </div>

          {/* In Stock */}
          <label className="flex items-center gap-3 cursor-pointer select-none">
            <div
              className={`w-10 h-5.5 rounded-full relative transition-colors ${inStock ? "bg-emerald-500" : "bg-neutral-300"}`}
              onClick={() => setInStock(!inStock)}
              role="switch"
              aria-checked={inStock}
              tabIndex={0}
              onKeyDown={(e) => { if (e.key === " " || e.key === "Enter") setInStock(!inStock); }}
            >
              <div
                className={`absolute top-0.5 w-4.5 h-4.5 bg-white rounded-full shadow transition-transform ${
                  inStock ? "translate-x-[18px]" : "translate-x-0.5"
                }`}
              />
            </div>
            <span className="text-xs font-medium text-neutral-700">In Stock</span>
          </label>
        </div>

        {/* Footer */}
        <div className="sticky bottom-0 bg-white p-5 border-t border-neutral-100 flex items-center gap-3">
          <button
            onClick={onClose}
            className="flex-1 px-4 py-2.5 text-sm font-semibold text-neutral-600 bg-neutral-100 rounded-xl hover:bg-neutral-200 transition-colors cursor-pointer"
          >
            Cancel
          </button>
          <button
            onClick={handleSubmit}
            className="flex-1 flex items-center justify-center gap-2 px-4 py-2.5 bg-neutral-900 text-white text-sm font-semibold rounded-xl hover:bg-neutral-800 transition-colors cursor-pointer"
          >
            <Save size={14} />
            {product ? "Update Product" : "Add Product"}
          </button>
        </div>
      </div>
    </div>
  );
}

// ── Filter Form Modal ────────────────────────────────────────────────────────
function FilterFormModal({
  filter,
  onSave,
  onClose,
}: {
  filter?: CustomSectionFilter;
  onSave: (filter: Omit<CustomSectionFilter, "id"> & { id?: string }) => void;
  onClose: () => void;
}) {
  const [label, setLabel] = useState(filter?.label || "");
  const [key, setKey] = useState(filter?.key || "");
  const [type, setType] = useState<CustomSectionFilter["type"]>(filter?.type || "checkbox");
  const [options, setOptions] = useState(filter?.options?.join("\n") || "");
  const [error, setError] = useState("");

  const handleSubmit = () => {
    if (!label.trim()) { setError("Filter label is required"); return; }
    if (!key.trim()) { setError("Filter key is required"); return; }
    const optionsList = options.split("\n").map((o) => o.trim()).filter(Boolean);
    if (optionsList.length < 1) { setError("At least one filter option is required"); return; }

    onSave({
      id: filter?.id,
      label: label.trim(),
      key: key.trim().toLowerCase().replace(/\s+/g, "_"),
      type,
      options: optionsList,
    });
  };

  return (
    <div className="fixed inset-0 z-[200] flex items-center justify-center bg-black/50 backdrop-blur-xs" onClick={onClose}>
      <div
        className="relative w-full max-w-md bg-white rounded-2xl shadow-2xl overflow-hidden mx-4"
        onClick={(e) => e.stopPropagation()}
      >
        <div className="flex items-center justify-between p-5 border-b border-neutral-100">
          <h3 className="text-lg font-bold text-neutral-900">
            {filter ? "Edit Filter" : "Add Filter"}
          </h3>
          <button onClick={onClose} className="p-1.5 hover:bg-neutral-100 rounded-lg cursor-pointer" aria-label="Close">
            <X size={18} />
          </button>
        </div>

        <div className="p-5 space-y-4">
          {error && (
            <div className="flex items-center gap-2 p-3 bg-red-50 border border-red-200 rounded-xl text-xs text-red-700" role="alert">
              <AlertCircle size={14} />
              {error}
            </div>
          )}

          <div>
            <label className="block text-xs font-semibold text-neutral-700 mb-1.5">
              Filter Label <span className="text-red-400">*</span>
            </label>
            <input
              type="text"
              value={label}
              onChange={(e) => { setLabel(e.target.value); setError(""); }}
              placeholder="e.g. Color, Size, Material"
              className="w-full px-3.5 py-2.5 bg-neutral-50 border border-neutral-200 rounded-xl text-sm focus:outline-none focus:ring-2 focus:ring-neutral-900"
            />
          </div>

          <div>
            <label className="block text-xs font-semibold text-neutral-700 mb-1.5">
              Filter Key <span className="text-red-400">*</span>
            </label>
            <input
              type="text"
              value={key}
              onChange={(e) => { setKey(e.target.value); setError(""); }}
              placeholder="e.g. color, size, material"
              className="w-full px-3.5 py-2.5 bg-neutral-50 border border-neutral-200 rounded-xl text-sm focus:outline-none focus:ring-2 focus:ring-neutral-900"
            />
            <p className="text-[10px] text-neutral-400 mt-1">Used to match product tags. Products with tags matching these options will appear.</p>
          </div>

          <div>
            <label className="block text-xs font-semibold text-neutral-700 mb-1.5">
              Filter Type
            </label>
            <select
              value={type}
              onChange={(e) => setType(e.target.value as CustomSectionFilter["type"])}
              className="w-full px-3.5 py-2.5 bg-neutral-50 border border-neutral-200 rounded-xl text-sm focus:outline-none focus:ring-2 focus:ring-neutral-900 cursor-pointer"
            >
              <option value="checkbox">Checkbox (Multi-select)</option>
              <option value="radio">Radio (Single-select)</option>
            </select>
          </div>

          <div>
            <label className="block text-xs font-semibold text-neutral-700 mb-1.5">
              Options <span className="text-red-400">*</span>
            </label>
            <textarea
              value={options}
              onChange={(e) => { setOptions(e.target.value); setError(""); }}
              placeholder={"Enter each option on a new line:\nBlack\nWhite\nBrown\nTan"}
              rows={5}
              className="w-full px-3.5 py-2.5 bg-neutral-50 border border-neutral-200 rounded-xl text-sm focus:outline-none focus:ring-2 focus:ring-neutral-900 resize-none font-mono"
            />
            <p className="text-[10px] text-neutral-400 mt-1">One option per line. Must match product tags for filtering to work.</p>
          </div>
        </div>

        <div className="p-5 border-t border-neutral-100 flex items-center gap-3">
          <button
            onClick={onClose}
            className="flex-1 px-4 py-2.5 text-sm font-semibold text-neutral-600 bg-neutral-100 rounded-xl hover:bg-neutral-200 transition-colors cursor-pointer"
          >
            Cancel
          </button>
          <button
            onClick={handleSubmit}
            className="flex-1 flex items-center justify-center gap-2 px-4 py-2.5 bg-neutral-900 text-white text-sm font-semibold rounded-xl hover:bg-neutral-800 transition-colors cursor-pointer"
          >
            <Save size={14} />
            {filter ? "Update" : "Add Filter"}
          </button>
        </div>
      </div>
    </div>
  );
}

// ── Section Editor ───────────────────────────────────────────────────────────
function SectionEditor({
  section,
  onBack,
}: {
  section: CustomSection;
  onBack: () => void;
}) {
  const {
    updateSection,
    addProductToSection,
    updateProductInSection,
    removeProductFromSection,
    addCarouselImage,
    removeCarouselImage,
    addFilterToSection,
    updateFilterInSection,
    removeFilterFromSection,
    maxCarouselImages,
  } = useCustomSections();

  const [activeTab, setActiveTab] = useState<"details" | "carousel" | "products" | "filters">("details");
  const [toast, setToast] = useState<{ message: string; type: "success" | "error" } | null>(null);
  const [productModal, setProductModal] = useState<{ open: boolean; product?: CustomSectionProduct }>({ open: false });
  const [filterModal, setFilterModal] = useState<{ open: boolean; filter?: CustomSectionFilter }>({ open: false });
  const carouselFileInputRef = useRef<HTMLInputElement>(null);
  const [isCarouselDragging, setIsCarouselDragging] = useState(false);
  const [carouselUrlInput, setCarouselUrlInput] = useState("");

  // Section details state
  const [sectionName, setSectionName] = useState(section.name);
  const [sectionDescription, setSectionDescription] = useState(section.description);
  const [metaTitle, setMetaTitle] = useState(section.metaTitle);
  const [metaDescription, setMetaDescription] = useState(section.metaDescription);
  const [carouselHeight, setCarouselHeight] = useState<"compact" | "medium" | "large">(
    section.carouselHeight || "medium"
  );

  const showToast = (message: string, type: "success" | "error") => {
    setToast({ message, type });
    setTimeout(() => setToast(null), 3000);
  };

  // Re-fetch section data
  const { getSectionById } = useCustomSections();
  const currentSection = getSectionById(section.id) || section;

  const handleSaveDetails = () => {
    if (!sectionName.trim()) {
      showToast("Section name is required", "error");
      return;
    }
    const result = updateSection(section.id, {
      name: sectionName.trim(),
      description: sectionDescription.trim(),
      metaTitle: metaTitle.trim() || sectionName.trim(),
      metaDescription: metaDescription.trim(),
      carouselHeight,
    });
    showToast(result.message, result.success ? "success" : "error");
  };

  const handleUpdateCarouselHeight = (height: "compact" | "medium" | "large") => {
    setCarouselHeight(height);
    updateSection(section.id, { carouselHeight: height });
    showToast(`Carousel size set to ${height.toUpperCase()}`, "success");
  };

  const processCarouselFile = (file: File) => {
    if (!file) return;
    if (!file.type.startsWith("image/")) {
      showToast("Please select a valid image file (PNG, JPG, WEBP, etc.)", "error");
      return;
    }
    if (file.size > 5 * 1024 * 1024) {
      showToast("Image must be under 5MB", "error");
      return;
    }
    const reader = new FileReader();
    reader.onload = () => {
      const result = addCarouselImage(section.id, {
        src: reader.result as string,
        alt: file.name.replace(/\.[^/.]+$/, "").replace(/[-_]/g, " "),
      });
      showToast(result.message, result.success ? "success" : "error");
    };
    reader.readAsDataURL(file);
  };

  const handleCarouselUpload = (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0];
    if (file) processCarouselFile(file);
    e.target.value = "";
  };

  const handleCarouselDrop = (e: React.DragEvent) => {
    e.preventDefault();
    setIsCarouselDragging(false);
    const file = e.dataTransfer.files?.[0];
    if (file) {
      processCarouselFile(file);
    }
  };

  const handleCarouselUrlAdd = () => {
    if (!carouselUrlInput.trim()) return;
    const result = addCarouselImage(section.id, {
      src: carouselUrlInput.trim(),
      alt: `${section.name} Banner`,
    });
    showToast(result.message, result.success ? "success" : "error");
    setCarouselUrlInput("");
  };

  const handleSaveProduct = (product: CustomSectionProduct) => {
    if (productModal.product) {
      updateProductInSection(section.id, product.id, product);
      showToast("Product updated!", "success");
    } else {
      const result = addProductToSection(section.id, product);
      showToast(result.message, result.success ? "success" : "error");
    }
    setProductModal({ open: false });
  };

  const handleSaveFilter = (filter: Omit<CustomSectionFilter, "id"> & { id?: string }) => {
    if (filterModal.filter && filter.id) {
      updateFilterInSection(section.id, filter.id, filter);
      showToast("Filter updated!", "success");
    } else {
      const { id: _id, ...filterData } = filter;
      const result = addFilterToSection(section.id, filterData);
      showToast(result.message, result.success ? "success" : "error");
    }
    setFilterModal({ open: false });
  };

  const tabs = [
    { key: "details" as const, label: "Details", icon: FileText },
    { key: "carousel" as const, label: "Carousel", icon: Layers },
    { key: "products" as const, label: "Products", icon: ShoppingBag },
    { key: "filters" as const, label: "Filters", icon: SlidersHorizontal },
  ];

  return (
    <div>
      {toast && <AdminToast message={toast.message} type={toast.type} onClose={() => setToast(null)} />}

      {/* Header */}
      <div className="flex items-center gap-3 mb-6">
        <button
          onClick={onBack}
          className="p-2 text-neutral-400 hover:text-neutral-900 hover:bg-neutral-100 rounded-xl transition-colors cursor-pointer"
          aria-label="Back to sections"
        >
          <ArrowLeft size={18} />
        </button>
        <div>
          <h2 className="text-xl font-bold text-neutral-900 tracking-tight">Edit: {currentSection.name}</h2>
          <p className="text-xs text-neutral-500 mt-0.5">
            /{currentSection.slug} · {currentSection.isActive ? "Live" : "Draft"}
          </p>
        </div>
      </div>

      {/* Tabs */}
      <div className="flex items-center gap-1 bg-neutral-100/80 p-1 rounded-xl mb-6 overflow-x-auto" role="tablist">
        {tabs.map((tab) => (
          <button
            key={tab.key}
            onClick={() => setActiveTab(tab.key)}
            role="tab"
            aria-selected={activeTab === tab.key}
            className={`flex items-center gap-1.5 px-4 py-2.5 rounded-lg text-xs font-semibold transition-all whitespace-nowrap cursor-pointer ${
              activeTab === tab.key
                ? "bg-white text-neutral-900 shadow-sm"
                : "text-neutral-500 hover:text-neutral-700"
            }`}
          >
            <tab.icon size={14} />
            {tab.label}
            {tab.key === "carousel" && (
              <span className="ml-1 text-[10px] bg-neutral-200 px-1.5 py-0.5 rounded-full">
                {currentSection.carouselImages.length}
              </span>
            )}
            {tab.key === "products" && (
              <span className="ml-1 text-[10px] bg-neutral-200 px-1.5 py-0.5 rounded-full">
                {currentSection.products.length}
              </span>
            )}
            {tab.key === "filters" && (
              <span className="ml-1 text-[10px] bg-neutral-200 px-1.5 py-0.5 rounded-full">
                {currentSection.filters.length}
              </span>
            )}
          </button>
        ))}
      </div>

      {/* Tab Content */}
      <div role="tabpanel">
        {/* ─── Details Tab ─────────────────────────────────────────── */}
        {activeTab === "details" && (
          <div className="bg-white rounded-2xl border border-neutral-200/80 p-6 space-y-5">
            <div>
              <label className="block text-xs font-semibold text-neutral-700 mb-1.5">
                Section Name <span className="text-red-400">*</span>
              </label>
              <input
                type="text"
                value={sectionName}
                onChange={(e) => setSectionName(e.target.value)}
                className="w-full px-4 py-3 bg-neutral-50 border border-neutral-200 rounded-xl text-sm focus:outline-none focus:ring-2 focus:ring-neutral-900"
                placeholder="e.g. Accessories"
              />
              <p className="text-[10px] text-neutral-400 mt-1">
                URL: /{sectionName.toLowerCase().trim().replace(/[^\w\s-]/g, "").replace(/[\s_]+/g, "-").replace(/^-+|-+$/g, "") || "section-name"}
              </p>
            </div>
            <div>
              <label className="block text-xs font-semibold text-neutral-700 mb-1.5">Description</label>
              <textarea
                value={sectionDescription}
                onChange={(e) => setSectionDescription(e.target.value)}
                rows={3}
                className="w-full px-4 py-3 bg-neutral-50 border border-neutral-200 rounded-xl text-sm focus:outline-none focus:ring-2 focus:ring-neutral-900 resize-none"
                placeholder="Describe this section..."
              />
            </div>
            <div>
              <label className="block text-xs font-semibold text-neutral-700 mb-1.5">Meta Title (SEO)</label>
              <input
                type="text"
                value={metaTitle}
                onChange={(e) => setMetaTitle(e.target.value)}
                className="w-full px-4 py-3 bg-neutral-50 border border-neutral-200 rounded-xl text-sm focus:outline-none focus:ring-2 focus:ring-neutral-900"
                placeholder="Page title for search engines"
              />
            </div>
            <div>
              <label className="block text-xs font-semibold text-neutral-700 mb-1.5">Meta Description (SEO)</label>
              <textarea
                value={metaDescription}
                onChange={(e) => setMetaDescription(e.target.value)}
                rows={2}
                className="w-full px-4 py-3 bg-neutral-50 border border-neutral-200 rounded-xl text-sm focus:outline-none focus:ring-2 focus:ring-neutral-900 resize-none"
                placeholder="Brief description for search engine results"
              />
            </div>

            {/* Carousel Banner Height */}
            <div>
              <label className="block text-xs font-semibold text-neutral-700 mb-1.5">
                Carousel Banner Height
              </label>
              <div className="grid grid-cols-3 gap-3">
                {[
                  { key: "compact", label: "Compact", desc: "Sleek banner (~300px)" },
                  { key: "medium", label: "Medium", desc: "Standard (~400px)" },
                  { key: "large", label: "Large", desc: "Hero showcase (~520px)" },
                ].map((item) => (
                  <button
                    key={item.key}
                    type="button"
                    onClick={() => handleUpdateCarouselHeight(item.key as any)}
                    className={`p-3 rounded-xl border text-left transition-all cursor-pointer ${
                      carouselHeight === item.key
                        ? "border-neutral-900 bg-neutral-900 text-white shadow-sm"
                        : "border-neutral-200 bg-neutral-50 text-neutral-700 hover:border-neutral-300 hover:bg-neutral-100"
                    }`}
                  >
                    <div className="text-xs font-bold">{item.label}</div>
                    <div className={`text-[10px] ${carouselHeight === item.key ? "text-neutral-300" : "text-neutral-400"}`}>
                      {item.desc}
                    </div>
                  </button>
                ))}
              </div>
            </div>

            <button
              onClick={handleSaveDetails}
              className="flex items-center gap-2 px-5 py-2.5 bg-neutral-900 text-white text-sm font-semibold rounded-xl hover:bg-neutral-800 transition-colors cursor-pointer"
            >
              <Save size={14} />
              Save Details
            </button>
          </div>
        )}

        {/* ─── Carousel Tab ────────────────────────────────────────── */}
        {activeTab === "carousel" && (
          <div className="space-y-5">
            {/* Height selector bar */}
            <div className="bg-white rounded-2xl border border-neutral-200/80 p-4 flex flex-col sm:flex-row sm:items-center justify-between gap-3">
              <div>
                <h4 className="text-xs font-bold text-neutral-800">Carousel Banner Size</h4>
                <p className="text-[11px] text-neutral-400">Choose how prominent the banner appears on the storefront</p>
              </div>
              <div className="flex items-center gap-2">
                {(["compact", "medium", "large"] as const).map((h) => (
                  <button
                    key={h}
                    type="button"
                    onClick={() => handleUpdateCarouselHeight(h)}
                    className={`px-3 py-1.5 rounded-lg text-xs font-bold uppercase tracking-wider transition-all cursor-pointer ${
                      carouselHeight === h
                        ? "bg-neutral-900 text-white shadow-xs"
                        : "bg-neutral-100 text-neutral-600 hover:bg-neutral-200"
                    }`}
                  >
                    {h}
                  </button>
                ))}
              </div>
            </div>

            {/* Drag & Drop Upload Zone */}
            <input ref={carouselFileInputRef} type="file" accept="image/*" className="hidden" onChange={handleCarouselUpload} />
            <div
              tabIndex={0}
              role="button"
              aria-label="Upload carousel image"
              onClick={() => {
                if (currentSection.carouselImages.length < maxCarouselImages) {
                  carouselFileInputRef.current?.click();
                }
              }}
              onKeyDown={(e) => {
                if ((e.key === "Enter" || e.key === " ") && currentSection.carouselImages.length < maxCarouselImages) {
                  e.preventDefault();
                  carouselFileInputRef.current?.click();
                }
              }}
              onDragOver={(e) => {
                e.preventDefault();
                if (currentSection.carouselImages.length < maxCarouselImages) {
                  setIsCarouselDragging(true);
                }
              }}
              onDragLeave={() => setIsCarouselDragging(false)}
              onDrop={handleCarouselDrop}
              className={`rounded-2xl border-2 border-dashed p-6 transition-all text-center flex flex-col items-center justify-center gap-2 cursor-pointer ${
                currentSection.carouselImages.length >= maxCarouselImages
                  ? "bg-neutral-50 border-neutral-200 opacity-60 cursor-not-allowed"
                  : isCarouselDragging
                  ? "border-neutral-900 bg-neutral-100 scale-[1.01]"
                  : "border-neutral-300 bg-white hover:border-neutral-500 hover:bg-neutral-50 focus:border-neutral-900 focus:outline-none"
              }`}
            >
              <ImagePlus size={32} className={isCarouselDragging ? "text-neutral-900" : "text-neutral-400"} />
              <div className="text-xs font-semibold text-neutral-800">
                {currentSection.carouselImages.length >= maxCarouselImages
                  ? `Maximum ${maxCarouselImages} carousel images reached`
                  : isCarouselDragging
                  ? "Drop your banner image here"
                  : "Drag & Drop carousel image or Click to browse"}
              </div>
              <p className="text-[10px] text-neutral-400">
                Press Enter or Click to select image • Supports PNG, JPG, WEBP (Max 5MB) • {currentSection.carouselImages.length} / {maxCarouselImages} images
              </p>
            </div>

            {/* Direct URL paste bar */}
            {currentSection.carouselImages.length < maxCarouselImages && (
              <div className="flex gap-2">
                <input
                  type="url"
                  placeholder="Or paste banner image URL and hit Enter..."
                  value={carouselUrlInput}
                  onChange={(e) => setCarouselUrlInput(e.target.value)}
                  onKeyDown={(e) => {
                    if (e.key === "Enter") {
                      e.preventDefault();
                      handleCarouselUrlAdd();
                    }
                  }}
                  className="flex-1 px-4 py-2.5 bg-neutral-50 border border-neutral-200 rounded-xl text-xs focus:outline-none focus:ring-2 focus:ring-neutral-900"
                />
                <button
                  type="button"
                  onClick={handleCarouselUrlAdd}
                  className="px-4 py-2.5 bg-neutral-900 text-white rounded-xl text-xs font-semibold hover:bg-neutral-800 transition-colors cursor-pointer"
                >
                  Add Banner
                </button>
              </div>
            )}

            {/* Carousel Images Grid */}
            {currentSection.carouselImages.length === 0 ? (
              <div className="bg-white rounded-2xl border border-neutral-200 p-8 text-center">
                <p className="text-xs text-neutral-400">No carousel banners added yet. Drop an image above to get started.</p>
              </div>
            ) : (
              <div className="grid grid-cols-2 lg:grid-cols-3 gap-4">
                {currentSection.carouselImages.map((img, index) => (
                  <div key={img.id} className="relative group rounded-xl overflow-hidden bg-neutral-100 border border-neutral-200 aspect-[16/9]">
                    <Image src={img.src} alt={img.alt} fill className="object-cover" unoptimized={img.src?.startsWith("data:")} />
                    <div className="absolute inset-0 bg-black/0 group-hover:bg-black/30 transition-colors" />
                    <div className="absolute top-2 left-2 px-2 py-0.5 bg-black/60 rounded text-[10px] font-bold text-white">
                      Banner {index + 1}
                    </div>
                    <button
                      onClick={() => removeCarouselImage(section.id, img.id)}
                      className="absolute top-2 right-2 p-1.5 bg-red-500 text-white rounded-lg opacity-0 group-hover:opacity-100 transition-opacity hover:bg-red-600 cursor-pointer shadow-md"
                      aria-label={`Remove image ${index + 1}`}
                    >
                      <Trash2 size={12} />
                    </button>
                  </div>
                ))}
              </div>
            )}
          </div>
        )}

        {/* ─── Products Tab ────────────────────────────────────────── */}
        {activeTab === "products" && (
          <div className="space-y-4">
            <div className="flex items-center justify-between">
              <p className="text-xs text-neutral-500">
                {currentSection.products.length} product{currentSection.products.length !== 1 ? "s" : ""}
              </p>
              <button
                onClick={() => setProductModal({ open: true })}
                className="flex items-center gap-1.5 px-4 py-2 bg-neutral-900 text-white text-xs font-semibold rounded-xl hover:bg-neutral-800 transition-colors cursor-pointer"
              >
                <Plus size={14} />
                Add Product
              </button>
            </div>

            {currentSection.products.length === 0 ? (
              <div className="bg-white rounded-2xl border border-dashed border-neutral-300 p-12 text-center">
                <ShoppingBag size={40} className="mx-auto text-neutral-300 mb-3" />
                <p className="text-sm font-medium text-neutral-500">No products yet</p>
                <p className="text-xs text-neutral-400 mt-1">Add products that will appear in this section&apos;s catalog</p>
              </div>
            ) : (
              <div className="space-y-2">
                {currentSection.products.map((product) => (
                  <div key={product.id} className="flex items-center gap-4 bg-white rounded-xl border border-neutral-200/80 p-3 hover:shadow-sm transition-shadow">
                    <div className="relative w-14 h-14 rounded-lg overflow-hidden bg-neutral-100 shrink-0">
                      <Image src={product.imageUrl} alt={product.name} fill className="object-cover" unoptimized={product.imageUrl?.startsWith("data:")} />
                    </div>
                    <div className="flex-1 min-w-0">
                      <h4 className="text-sm font-semibold text-neutral-900 truncate">{product.name}</h4>
                      <div className="flex items-center gap-2 mt-0.5">
                        <span className="text-xs font-bold text-neutral-900">₹{product.price.toLocaleString("en-IN")}</span>
                        {product.originalPrice && product.originalPrice > product.price && (
                          <span className="text-[10px] text-neutral-400 line-through">₹{product.originalPrice.toLocaleString("en-IN")}</span>
                        )}
                        {product.badge && (
                          <span className="text-[9px] bg-neutral-900 text-white px-1.5 py-0.5 rounded font-bold">{product.badge}</span>
                        )}
                        <span className={`text-[10px] font-medium ${product.inStock ? "text-emerald-600" : "text-red-500"}`}>
                          {product.inStock ? "In Stock" : "Out of Stock"}
                        </span>
                      </div>
                    </div>
                    <div className="flex items-center gap-1 shrink-0">
                      <button
                        onClick={() => setProductModal({ open: true, product })}
                        className="p-2 text-neutral-400 hover:text-neutral-900 hover:bg-neutral-100 rounded-lg transition-colors cursor-pointer"
                        aria-label={`Edit ${product.name}`}
                      >
                        <Edit3 size={14} />
                      </button>
                      <button
                        onClick={() => removeProductFromSection(section.id, product.id)}
                        className="p-2 text-neutral-400 hover:text-red-500 hover:bg-red-50 rounded-lg transition-colors cursor-pointer"
                        aria-label={`Remove ${product.name}`}
                      >
                        <Trash2 size={14} />
                      </button>
                    </div>
                  </div>
                ))}
              </div>
            )}
          </div>
        )}

        {/* ─── Filters Tab ─────────────────────────────────────────── */}
        {activeTab === "filters" && (
          <div className="space-y-4">
            <div className="flex items-center justify-between">
              <div>
                <p className="text-xs text-neutral-500">
                  {currentSection.filters.length} filter{currentSection.filters.length !== 1 ? "s" : ""}
                </p>
              </div>
              <button
                onClick={() => setFilterModal({ open: true })}
                className="flex items-center gap-1.5 px-4 py-2 bg-neutral-900 text-white text-xs font-semibold rounded-xl hover:bg-neutral-800 transition-colors cursor-pointer"
              >
                <Plus size={14} />
                Add Filter
              </button>
            </div>

            <div className="bg-amber-50 border border-amber-200 rounded-xl p-3.5 text-xs text-amber-800">
              <strong>How filters work:</strong> Each filter has a <strong>key</strong> and <strong>options</strong>.
              Products are filtered by matching their <strong>tags</strong> against the selected filter options.
              For example, a &quot;Color&quot; filter with options [Black, White] will show products that have &quot;Black&quot; or &quot;White&quot; in their tags.
            </div>

            {currentSection.filters.length === 0 ? (
              <div className="bg-white rounded-2xl border border-dashed border-neutral-300 p-12 text-center">
                <SlidersHorizontal size={40} className="mx-auto text-neutral-300 mb-3" />
                <p className="text-sm font-medium text-neutral-500">No filters yet</p>
                <p className="text-xs text-neutral-400 mt-1">Add filters so customers can narrow down products</p>
              </div>
            ) : (
              <div className="space-y-2">
                {currentSection.filters.map((filter) => (
                  <div key={filter.id} className="flex items-start gap-4 bg-white rounded-xl border border-neutral-200/80 p-4 hover:shadow-sm transition-shadow">
                    <div className="p-2 bg-neutral-100 rounded-lg shrink-0">
                      <SlidersHorizontal size={16} className="text-neutral-600" />
                    </div>
                    <div className="flex-1 min-w-0">
                      <div className="flex items-center gap-2">
                        <h4 className="text-sm font-semibold text-neutral-900">{filter.label}</h4>
                        <span className="text-[10px] bg-neutral-100 text-neutral-500 px-1.5 py-0.5 rounded font-mono">{filter.key}</span>
                        <span className="text-[10px] bg-blue-50 text-blue-600 px-1.5 py-0.5 rounded font-medium">{filter.type}</span>
                      </div>
                      <div className="flex flex-wrap gap-1.5 mt-2">
                        {filter.options.map((opt) => (
                          <span key={opt} className="text-[10px] bg-neutral-100 text-neutral-600 px-2 py-0.5 rounded-full">
                            {opt}
                          </span>
                        ))}
                      </div>
                    </div>
                    <div className="flex items-center gap-1 shrink-0">
                      <button
                        onClick={() => setFilterModal({ open: true, filter })}
                        className="p-2 text-neutral-400 hover:text-neutral-900 hover:bg-neutral-100 rounded-lg transition-colors cursor-pointer"
                        aria-label={`Edit filter ${filter.label}`}
                      >
                        <Edit3 size={14} />
                      </button>
                      <button
                        onClick={() => removeFilterFromSection(section.id, filter.id)}
                        className="p-2 text-neutral-400 hover:text-red-500 hover:bg-red-50 rounded-lg transition-colors cursor-pointer"
                        aria-label={`Remove filter ${filter.label}`}
                      >
                        <Trash2 size={14} />
                      </button>
                    </div>
                  </div>
                ))}
              </div>
            )}
          </div>
        )}
      </div>

      {/* Modals */}
      {productModal.open && (
        <ProductFormModal
          product={productModal.product}
          onSave={handleSaveProduct}
          onClose={() => setProductModal({ open: false })}
        />
      )}
      {filterModal.open && (
        <FilterFormModal
          filter={filterModal.filter}
          onSave={handleSaveFilter}
          onClose={() => setFilterModal({ open: false })}
        />
      )}
    </div>
  );
}

// ── Create Section Modal ─────────────────────────────────────────────────────
function CreateSectionModal({
  onClose,
  onCreate,
}: {
  onClose: () => void;
  onCreate: (name: string, description: string) => void;
}) {
  const [name, setName] = useState("");
  const [description, setDescription] = useState("");
  const [error, setError] = useState("");

  const handleCreate = () => {
    if (!name.trim()) {
      setError("Section name is required");
      return;
    }
    onCreate(name.trim(), description.trim());
  };

  return (
    <div className="fixed inset-0 z-[200] flex items-center justify-center bg-black/50 backdrop-blur-xs" onClick={onClose}>
      <div
        className="relative w-full max-w-md bg-white rounded-2xl shadow-2xl overflow-hidden mx-4"
        onClick={(e) => e.stopPropagation()}
      >
        <div className="flex items-center justify-between p-5 border-b border-neutral-100">
          <h3 className="text-lg font-bold text-neutral-900">Create New Section</h3>
          <button onClick={onClose} className="p-1.5 hover:bg-neutral-100 rounded-lg cursor-pointer" aria-label="Close">
            <X size={18} />
          </button>
        </div>

        <div className="p-5 space-y-4">
          {error && (
            <div className="flex items-center gap-2 p-3 bg-red-50 border border-red-200 rounded-xl text-xs text-red-700" role="alert">
              <AlertCircle size={14} />
              {error}
            </div>
          )}
          <div>
            <label className="block text-xs font-semibold text-neutral-700 mb-1.5">
              Section Name <span className="text-red-400">*</span>
            </label>
            <input
              type="text"
              value={name}
              onChange={(e) => { setName(e.target.value); setError(""); }}
              placeholder="e.g. Accessories, Bags, Sunglasses"
              className="w-full px-4 py-3 bg-neutral-50 border border-neutral-200 rounded-xl text-sm focus:outline-none focus:ring-2 focus:ring-neutral-900"
              autoFocus
            />
            {name.trim() && (
              <p className="text-[10px] text-neutral-400 mt-1">
                URL: /{name.toLowerCase().trim().replace(/[^\w\s-]/g, "").replace(/[\s_]+/g, "-").replace(/^-+|-+$/g, "")}
              </p>
            )}
          </div>
          <div>
            <label className="block text-xs font-semibold text-neutral-700 mb-1.5">Description</label>
            <textarea
              value={description}
              onChange={(e) => setDescription(e.target.value)}
              rows={3}
              className="w-full px-4 py-3 bg-neutral-50 border border-neutral-200 rounded-xl text-sm focus:outline-none focus:ring-2 focus:ring-neutral-900 resize-none"
              placeholder="Short description for this section..."
            />
          </div>
        </div>

        <div className="p-5 border-t border-neutral-100 flex items-center gap-3">
          <button
            onClick={onClose}
            className="flex-1 px-4 py-2.5 text-sm font-semibold text-neutral-600 bg-neutral-100 rounded-xl hover:bg-neutral-200 transition-colors cursor-pointer"
          >
            Cancel
          </button>
          <button
            onClick={handleCreate}
            className="flex-1 flex items-center justify-center gap-2 px-4 py-2.5 bg-neutral-900 text-white text-sm font-semibold rounded-xl hover:bg-neutral-800 transition-colors cursor-pointer"
          >
            <Plus size={14} />
            Create Section
          </button>
        </div>
      </div>
    </div>
  );
}

// ── Main Admin Sections Page ─────────────────────────────────────────────────
export default function AdminCustomSectionsPage() {
  const {
    sections,
    canAddSection,
    maxSections,
    addSection,
    deleteSection,
    updateSection,
  } = useCustomSections();

  const [editingSection, setEditingSection] = useState<CustomSection | null>(null);
  const [showCreateModal, setShowCreateModal] = useState(false);
  const [toast, setToast] = useState<{ message: string; type: "success" | "error" } | null>(null);

  const showToast = (message: string, type: "success" | "error") => {
    setToast({ message, type });
    setTimeout(() => setToast(null), 3000);
  };

  const handleCreate = (name: string, description: string) => {
    const result = addSection({
      name,
      slug: "",
      description,
      metaTitle: name,
      metaDescription: description,
      carouselImages: [],
      products: [],
      filters: [],
      isActive: false,
    });
    if (result.success) {
      setShowCreateModal(false);
      showToast(result.message, "success");
      // Auto-open editor for the new section
      const newSection = sections.find((s) => s.id === result.id);
      // We need to wait for state update
      setTimeout(() => {
        const latestSections = JSON.parse(localStorage.getItem("veyro_custom_sections_v1") || "[]");
        const created = latestSections.find((s: CustomSection) => s.id === result.id);
        if (created) setEditingSection(created);
      }, 100);
    } else {
      showToast(result.message, "error");
    }
  };

  const handleToggleActive = (sectionId: string) => {
    const section = sections.find((s) => s.id === sectionId);
    if (!section) return;
    updateSection(sectionId, { isActive: !section.isActive });
    showToast(
      section.isActive ? "Section hidden from store" : "Section is now live!",
      "success"
    );
  };

  // If we're in editor mode
  if (editingSection) {
    const latestSection = sections.find((s) => s.id === editingSection.id);
    if (!latestSection) {
      setEditingSection(null);
      return null;
    }
    return (
      <SectionEditor
        section={latestSection}
        onBack={() => setEditingSection(null)}
      />
    );
  }

  return (
    <div>
      {toast && <AdminToast message={toast.message} type={toast.type} onClose={() => setToast(null)} />}

      {/* Header */}
      <div className="flex items-center justify-between mb-6">
        <div>
          <h1 className="text-2xl font-bold text-neutral-900 tracking-tight">Custom Sections</h1>
          <p className="text-sm text-neutral-500 mt-1">
            Create up to {maxSections} custom storefront sections with carousels, products & filters
          </p>
        </div>
        <button
          onClick={() => setShowCreateModal(true)}
          disabled={!canAddSection}
          className={`flex items-center gap-2 px-5 py-2.5 text-sm font-semibold rounded-xl transition-colors cursor-pointer ${
            canAddSection
              ? "bg-neutral-900 text-white hover:bg-neutral-800"
              : "bg-neutral-200 text-neutral-400 cursor-not-allowed"
          }`}
        >
          <Plus size={16} />
          New Section
        </button>
      </div>

      {/* Quota Indicator */}
      <div className="bg-white rounded-xl border border-neutral-200/80 p-4 mb-6">
        <div className="flex items-center justify-between mb-2">
          <span className="text-xs font-semibold text-neutral-700">Sections Used</span>
          <span className="text-xs font-bold text-neutral-900">{sections.length} / {maxSections}</span>
        </div>
        <div className="w-full h-2 bg-neutral-100 rounded-full overflow-hidden">
          <div
            className="h-full rounded-full transition-all duration-500"
            style={{
              width: `${(sections.length / maxSections) * 100}%`,
              backgroundColor: sections.length >= maxSections ? "#ef4444" : sections.length >= 2 ? "#f59e0b" : "#10b981",
            }}
          />
        </div>
      </div>

      {/* Section Cards Grid */}
      {sections.length === 0 ? (
        <div className="bg-white rounded-2xl border border-dashed border-neutral-300 p-16 text-center">
          <Layers size={48} className="mx-auto text-neutral-300 mb-4" />
          <h3 className="text-lg font-semibold text-neutral-600">No custom sections yet</h3>
          <p className="text-sm text-neutral-400 mt-2 max-w-md mx-auto">
            Create your first custom section to add a new category to your store with its own carousel banners, products, and filters.
          </p>
          <button
            onClick={() => setShowCreateModal(true)}
            className="mt-6 inline-flex items-center gap-2 px-6 py-3 bg-neutral-900 text-white text-sm font-semibold rounded-xl hover:bg-neutral-800 transition-colors cursor-pointer"
          >
            <Plus size={16} />
            Create First Section
          </button>
        </div>
      ) : (
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-5">
          {sections.map((section) => (
            <SectionCard
              key={section.id}
              section={section}
              onEdit={() => setEditingSection(section)}
              onDelete={() => {
                deleteSection(section.id);
                showToast("Section deleted", "success");
              }}
              onToggleActive={() => handleToggleActive(section.id)}
            />
          ))}
        </div>
      )}

      {/* Create Modal */}
      {showCreateModal && (
        <CreateSectionModal
          onClose={() => setShowCreateModal(false)}
          onCreate={handleCreate}
        />
      )}
    </div>
  );
}
