"use client";

import React, { useState, useCallback, useRef, useEffect } from "react";
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
  Crop,
  RotateCcw,
  ZoomIn,
  ZoomOut,
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
      className={`fixed top-6 right-6 z-[100] flex items-center gap-2.5 px-5 py-3 rounded-full border text-xs font-semibold animate-in fade-in slide-in-from-top-4 duration-300 motion-reduce:animate-none ${
        type === "success"
          ? "bg-[var(--admin-success)]/15 border-[var(--admin-success)]/30 text-[var(--admin-success)]"
          : "bg-[var(--admin-danger)]/15 border-[var(--admin-danger)]/30 text-[var(--admin-danger)]"
      }`}
      role="alert"
    >
      {type === "success" ? <Check size={16} /> : <AlertCircle size={16} />}
      <span>{message}</span>
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
    <div className="bg-[var(--admin-surface)] rounded-[28px] border border-white/5 hover:border-white/10 transition-colors overflow-hidden">
      {/* Preview Banner */}
      <div className="relative h-36 bg-[var(--admin-surface-2)] overflow-hidden">
        {section.carouselImages.length > 0 ? (
          <Image
            src={section.carouselImages[0].src}
            alt={section.carouselImages[0].alt || section.name}
            fill
            className="object-cover"
            unoptimized={section.carouselImages[0].src?.startsWith("data:")}
          />
        ) : (
          <div className="flex items-center justify-center h-full text-[var(--admin-text-muted)]">
            <ImagePlus size={40} />
          </div>
        )}
        {/* Status Badge */}
        <div className="absolute top-3 right-3">
          <span
            className={`px-2.5 py-1 rounded-full text-[10px] font-bold uppercase tracking-wider backdrop-blur-md ${
              section.isActive
                ? "bg-[var(--admin-success)]/20 border border-[var(--admin-success)]/40 text-[var(--admin-success)]"
                : "bg-black/60 border border-white/20 text-white"
            }`}
          >
            {section.isActive ? "LIVE" : "DRAFT"}
          </span>
        </div>
      </div>

      {/* Content */}
      <div className="p-5">
        <h3 className="text-base font-heading font-bold text-white tracking-tight">{section.name}</h3>
        <p className="text-xs text-[var(--admin-text-muted)] mt-1 line-clamp-2">{section.description || "No description"}</p>

        {/* Stats Row */}
        <div className="flex items-center gap-4 mt-4">
          <div className="flex items-center gap-1.5 text-xs text-[var(--admin-text-muted)]">
            <ImagePlus size={13} />
            <span><strong className="text-white font-heading font-bold tabular-nums">{section.carouselImages.length}</strong> images</span>
          </div>
          <div className="flex items-center gap-1.5 text-xs text-[var(--admin-text-muted)]">
            <ShoppingBag size={13} />
            <span><strong className="text-white font-heading font-bold tabular-nums">{section.products.length}</strong> products</span>
          </div>
          <div className="flex items-center gap-1.5 text-xs text-[var(--admin-text-muted)]">
            <Filter size={13} />
            <span><strong className="text-white font-heading font-bold tabular-nums">{section.filters.length}</strong> filters</span>
          </div>
        </div>

        {/* Actions Row */}
        <div className="flex items-center gap-2 mt-4 pt-4 border-t border-white/5">
          <button
            onClick={onEdit}
            className="flex-1 flex items-center justify-center gap-1.5 px-3 py-2 bg-[var(--admin-primary)] hover:bg-[var(--admin-primary-hover)] text-white text-xs font-semibold rounded-full transition-colors cursor-pointer"
          >
            <Edit3 size={13} />
            Edit
          </button>
          <button
            onClick={onToggleActive}
            className={`flex items-center justify-center gap-1.5 px-3.5 py-2 text-xs font-semibold rounded-full border transition-colors cursor-pointer ${
              section.isActive
                ? "bg-[var(--admin-warning)]/15 border-[var(--admin-warning)]/30 text-[var(--admin-warning)] hover:bg-[var(--admin-warning)]/25"
                : "bg-[var(--admin-surface)] border-white/10 text-white hover:bg-white/5"
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
                className="px-3 py-2 bg-[var(--admin-danger)] hover:bg-rose-600 text-white text-xs font-bold rounded-full cursor-pointer"
              >
                Confirm
              </button>
              <button
                onClick={() => setConfirmDelete(false)}
                className="px-2 py-2 text-xs text-[var(--admin-text-muted)] hover:text-white cursor-pointer"
              >
                Cancel
              </button>
            </div>
          ) : (
            <button
              onClick={() => setConfirmDelete(true)}
              className="w-8 h-8 flex items-center justify-center rounded-full border border-white/10 bg-[var(--admin-surface)] text-[var(--admin-text-muted)] hover:text-[var(--admin-danger)] hover:bg-[var(--admin-danger)]/15 hover:border-[var(--admin-danger)]/30 transition-colors cursor-pointer"
              aria-label="Delete section"
            >
              <Trash2 size={13} />
            </button>
          )}
        </div>
      </div>
    </div>
  );
}

// ── Interactive Image Cropper Modal ─────────────────────────────────────────
function ImageCropperModal({
  imageSrc,
  title = "Crop & Position Product Image",
  initialAspect = "3/4",
  onCrop,
  onClose,
}: {
  imageSrc: string;
  title?: string;
  initialAspect?: "3/4" | "1/1";
  onCrop: (croppedBase64: string) => void;
  onClose: () => void;
}) {
  const [aspect, setAspect] = useState<"3/4" | "1/1">(initialAspect);
  const [zoom, setZoom] = useState(1);
  const [pan, setPan] = useState({ x: 0, y: 0 });
  const [isDragging, setIsDragging] = useState(false);
  const [isInteracting, setIsInteracting] = useState(false);
  const [naturalSize, setNaturalSize] = useState({ width: 0, height: 0 });
  const [imageLoaded, setImageLoaded] = useState(false);

  const viewportRef = useRef<HTMLDivElement | null>(null);
  const dragStartRef = useRef({ x: 0, y: 0 });
  const panStartRef = useRef({ x: 0, y: 0 });
  const pinchStartDistRef = useRef(0);
  const pinchStartZoomRef = useRef(1);
  const loadedImgRef = useRef<HTMLImageElement | null>(null);
  const interactionTimerRef = useRef<NodeJS.Timeout | null>(null);
  const pointerDownOnBackdropRef = useRef(false);
  const wasDraggingRef = useRef(false);

  // Synchronized refs for real-time tracking without stale closure drift
  const zoomRef = useRef(zoom);
  const panRef = useRef(pan);
  const aspectRef = useRef(aspect);
  const isDraggingRef = useRef(isDragging);

  zoomRef.current = zoom;
  panRef.current = pan;
  aspectRef.current = aspect;
  isDraggingRef.current = isDragging;

  const triggerInteraction = useCallback(() => {
    setIsInteracting(true);
    if (interactionTimerRef.current) {
      clearTimeout(interactionTimerRef.current);
    }
    interactionTimerRef.current = setTimeout(() => {
      setIsInteracting(false);
    }, 400);
  }, []);

  // Viewport dimensions
  const Vw = aspect === "3/4" ? 285 : 320;
  const Vh = aspect === "3/4" ? 380 : 320;

  // Image preloader
  useEffect(() => {
    setImageLoaded(false);
    zoomRef.current = 1;
    setZoom(1);
    panRef.current = { x: 0, y: 0 };
    setPan({ x: 0, y: 0 });
    const img = new window.Image();
    img.crossOrigin = "anonymous";
    img.src = imageSrc;
    img.onload = () => {
      loadedImgRef.current = img;
      setNaturalSize({ width: img.naturalWidth, height: img.naturalHeight });
      setImageLoaded(true);
    };
    img.onerror = () => {
      setImageLoaded(true);
    };
  }, [imageSrc]);

  // Strict zero-slack boundary geometry calculation
  const calculateMetrics = useCallback(
    (targetZoom: number, targetAspect: "3/4" | "1/1", width = naturalSize.width, height = naturalSize.height) => {
      const vw = targetAspect === "3/4" ? 285 : 320;
      const vh = targetAspect === "3/4" ? 380 : 320;

      if (!width || !height) {
        return {
          vw,
          vh,
          scaleCover: 1,
          displayWidth: vw,
          displayHeight: vh,
          maxPanX: 0,
          maxPanY: 0,
        };
      }

      // Base cover scale: guarantees 100% viewport coverage with zero exposed voids
      const scaleCover = Math.max(vw / width, vh / height);
      const displayWidth = width * scaleCover * targetZoom;
      const displayHeight = height * scaleCover * targetZoom;

      // Strict Zero-Slack boundary travel distances: strictly (displayWidth - vw) / 2
      const maxPanX = Math.max(0, (displayWidth - vw) / 2);
      const maxPanY = Math.max(0, (displayHeight - vh) / 2);

      return {
        vw,
        vh,
        scaleCover,
        displayWidth,
        displayHeight,
        maxPanX,
        maxPanY,
      };
    },
    [naturalSize.width, naturalSize.height]
  );

  // Boundary clamping helper
  const clampPanCoordinates = useCallback(
    (targetPan: { x: number; y: number }, targetZoom: number, targetAspect: "3/4" | "1/1") => {
      const { maxPanX, maxPanY } = calculateMetrics(targetZoom, targetAspect);
      return {
        x: Math.min(maxPanX, Math.max(-maxPanX, targetPan.x)),
        y: Math.min(maxPanY, Math.max(-maxPanY, targetPan.y)),
      };
    },
    [calculateMetrics]
  );

  // Active display metrics and clamped offsets
  const currentMetrics = calculateMetrics(zoom, aspect);
  const { displayWidth, displayHeight, maxPanX, maxPanY } = currentMetrics;

  const clampedPanX = Math.min(maxPanX, Math.max(-maxPanX, pan.x));
  const clampedPanY = Math.min(maxPanY, Math.max(-maxPanY, pan.y));

  const imgLeft = (Vw - displayWidth) / 2 + clampedPanX;
  const imgTop = (Vh - displayHeight) / 2 + clampedPanY;

  // Zoom updater with instant dynamic pan re-clamping
  const handleZoomUpdate = useCallback(
    (newZoom: number) => {
      const clampedZoom = Math.min(3, Math.max(1, newZoom));
      zoomRef.current = clampedZoom;
      setZoom(clampedZoom);
      const clamped = clampPanCoordinates(panRef.current, clampedZoom, aspectRef.current);
      panRef.current = clamped;
      setPan(clamped);
      triggerInteraction();
    },
    [clampPanCoordinates, triggerInteraction]
  );

  // Aspect ratio switcher with focal-center preservation
  const handleAspectChange = useCallback(
    (newAspect: "3/4" | "1/1") => {
      if (newAspect === aspect) return;

      const currMetrics = calculateMetrics(zoomRef.current, aspectRef.current);
      const ratioX = currMetrics.maxPanX > 0 ? panRef.current.x / currMetrics.maxPanX : 0;
      const ratioY = currMetrics.maxPanY > 0 ? panRef.current.y / currMetrics.maxPanY : 0;

      const nextMetrics = calculateMetrics(zoomRef.current, newAspect);
      const nextPan = {
        x: ratioX * nextMetrics.maxPanX,
        y: ratioY * nextMetrics.maxPanY,
      };
      const clamped = {
        x: Math.min(nextMetrics.maxPanX, Math.max(-nextMetrics.maxPanX, nextPan.x)),
        y: Math.min(nextMetrics.maxPanY, Math.max(-nextMetrics.maxPanY, nextPan.y)),
      };

      aspectRef.current = newAspect;
      setAspect(newAspect);
      panRef.current = clamped;
      setPan(clamped);
      triggerInteraction();
    },
    [aspect, calculateMetrics, triggerInteraction]
  );

  // Mouse / Pointer drag initialization
  const handlePointerDown = (e: React.PointerEvent<HTMLDivElement>) => {
    if (e.pointerType === "touch") return; // Mobile touch handled by native listeners
    e.preventDefault();
    e.stopPropagation();
    isDraggingRef.current = true;
    setIsDragging(true);
    triggerInteraction();
    dragStartRef.current = { x: e.clientX, y: e.clientY };
    panStartRef.current = { ...panRef.current };
  };

  // Window-level pointer listeners for desktop mouse drag
  useEffect(() => {
    if (!isDragging) return;

    const handlePointerMove = (e: PointerEvent) => {
      if (e.pointerType === "touch") return;
      const dx = e.clientX - dragStartRef.current.x;
      const dy = e.clientY - dragStartRef.current.y;
      const targetPan = {
        x: panStartRef.current.x + dx,
        y: panStartRef.current.y + dy,
      };
      const clamped = clampPanCoordinates(targetPan, zoomRef.current, aspectRef.current);
      panRef.current = clamped;
      setPan(clamped);
    };

    const handlePointerUp = (e: PointerEvent) => {
      if (e.pointerType === "touch") return;
      isDraggingRef.current = false;
      setIsDragging(false);
      wasDraggingRef.current = true;
      setTimeout(() => {
        wasDraggingRef.current = false;
      }, 150);
    };

    window.addEventListener("pointermove", handlePointerMove);
    window.addEventListener("pointerup", handlePointerUp);
    window.addEventListener("pointercancel", handlePointerUp);

    return () => {
      window.removeEventListener("pointermove", handlePointerMove);
      window.removeEventListener("pointerup", handlePointerUp);
      window.removeEventListener("pointercancel", handlePointerUp);
    };
  }, [isDragging, clampPanCoordinates]);

  // Native non-passive touch listeners for mobile drag & pinch-to-zoom
  useEffect(() => {
    const el = viewportRef.current;
    if (!el) return;

    const onTouchStart = (e: TouchEvent) => {
      if (e.touches.length === 1) {
        e.preventDefault();
        isDraggingRef.current = true;
        setIsDragging(true);
        triggerInteraction();
        dragStartRef.current = { x: e.touches[0].clientX, y: e.touches[0].clientY };
        panStartRef.current = { ...panRef.current };
      } else if (e.touches.length === 2) {
        e.preventDefault();
        isDraggingRef.current = false;
        setIsDragging(false);
        triggerInteraction();
        const dx = e.touches[0].clientX - e.touches[1].clientX;
        const dy = e.touches[0].clientY - e.touches[1].clientY;
        pinchStartDistRef.current = Math.hypot(dx, dy);
        pinchStartZoomRef.current = zoomRef.current;
      }
    };

    const onTouchMove = (e: TouchEvent) => {
      if (e.touches.length === 1 && isDraggingRef.current) {
        e.preventDefault();
        triggerInteraction();
        const dx = e.touches[0].clientX - dragStartRef.current.x;
        const dy = e.touches[0].clientY - dragStartRef.current.y;
        const targetPan = {
          x: panStartRef.current.x + dx,
          y: panStartRef.current.y + dy,
        };
        const clamped = clampPanCoordinates(targetPan, zoomRef.current, aspectRef.current);
        panRef.current = clamped;
        setPan(clamped);
      } else if (e.touches.length === 2 && pinchStartDistRef.current > 0) {
        e.preventDefault();
        triggerInteraction();
        const dx = e.touches[0].clientX - e.touches[1].clientX;
        const dy = e.touches[0].clientY - e.touches[1].clientY;
        const dist = Math.hypot(dx, dy);
        const scaleFactor = dist / pinchStartDistRef.current;
        const newZoom = Math.min(3, Math.max(1, pinchStartZoomRef.current * scaleFactor));
        zoomRef.current = newZoom;
        setZoom(newZoom);
        const clamped = clampPanCoordinates(panRef.current, newZoom, aspectRef.current);
        panRef.current = clamped;
        setPan(clamped);
      }
    };

    const onTouchEnd = (e: TouchEvent) => {
      if (e.touches.length === 0) {
        isDraggingRef.current = false;
        setIsDragging(false);
        pinchStartDistRef.current = 0;
        wasDraggingRef.current = true;
        setTimeout(() => {
          wasDraggingRef.current = false;
        }, 150);
      } else if (e.touches.length === 1) {
        pinchStartDistRef.current = 0;
        dragStartRef.current = { x: e.touches[0].clientX, y: e.touches[0].clientY };
        panStartRef.current = { ...panRef.current };
        isDraggingRef.current = true;
        setIsDragging(true);
      }
    };

    el.addEventListener("touchstart", onTouchStart, { passive: false });
    el.addEventListener("touchmove", onTouchMove, { passive: false });
    el.addEventListener("touchend", onTouchEnd);
    el.addEventListener("touchcancel", onTouchEnd);

    return () => {
      el.removeEventListener("touchstart", onTouchStart);
      el.removeEventListener("touchmove", onTouchMove);
      el.removeEventListener("touchend", onTouchEnd);
      el.removeEventListener("touchcancel", onTouchEnd);
    };
  }, [clampPanCoordinates, triggerInteraction]);

  // Native non-passive wheel zoom listener
  useEffect(() => {
    const el = viewportRef.current;
    if (!el) return;

    const onWheel = (e: WheelEvent) => {
      e.preventDefault();
      triggerInteraction();
      // Fine-stepped dampening factor
      const delta = -e.deltaY * 0.0018;
      const nextZoom = Math.min(3, Math.max(1, zoomRef.current + delta));
      zoomRef.current = nextZoom;
      setZoom(nextZoom);
      const clamped = clampPanCoordinates(panRef.current, nextZoom, aspectRef.current);
      panRef.current = clamped;
      setPan(clamped);
    };

    el.addEventListener("wheel", onWheel, { passive: false });
    return () => el.removeEventListener("wheel", onWheel);
  }, [clampPanCoordinates, triggerInteraction]);

  // Reset to default framing & zoom
  const handleReset = () => {
    zoomRef.current = 1;
    setZoom(1);
    panRef.current = { x: 0, y: 0 };
    setPan({ x: 0, y: 0 });
    triggerInteraction();
  };

  // High-DPI canvas export
  const handleApplyCrop = () => {
    if (!loadedImgRef.current || naturalSize.width === 0) {
      onCrop(imageSrc);
      return;
    }

    const exportWidth = aspect === "3/4" ? 900 : 1000;
    const exportHeight = aspect === "3/4" ? 1200 : 1000;

    const canvas = document.createElement("canvas");
    canvas.width = exportWidth;
    canvas.height = exportHeight;
    const ctx = canvas.getContext("2d");
    if (!ctx) {
      onCrop(imageSrc);
      return;
    }

    ctx.imageSmoothingEnabled = true;
    ctx.imageSmoothingQuality = "high";

    const scaleRatio = exportWidth / Vw;
    const canvasImgX = imgLeft * scaleRatio;
    const canvasImgY = imgTop * scaleRatio;
    const canvasImgW = displayWidth * scaleRatio;
    const canvasImgH = displayHeight * scaleRatio;

    try {
      ctx.drawImage(loadedImgRef.current, canvasImgX, canvasImgY, canvasImgW, canvasImgH);
      const croppedResult = canvas.toDataURL("image/webp", 0.92);
      onCrop(croppedResult);
    } catch (err) {
      console.warn("WebP canvas export failed, attempting JPEG fallback", err);
      try {
        const fallbackResult = canvas.toDataURL("image/jpeg", 0.92);
        onCrop(fallbackResult);
      } catch {
        onCrop(imageSrc);
      }
    }
  };

  return (
    <div
      className={`fixed inset-0 z-[100000] bg-black/85 backdrop-blur-md flex items-center justify-center p-3 sm:p-5 select-none transition-colors ${
        isDragging ? "cursor-grabbing" : ""
      }`}
      onPointerDown={(e) => {
        e.stopPropagation();
        pointerDownOnBackdropRef.current = e.target === e.currentTarget;
      }}
      onClick={(e) => {
        e.stopPropagation();
        if (
          e.target === e.currentTarget &&
          pointerDownOnBackdropRef.current &&
          !wasDraggingRef.current
        ) {
          onClose();
        }
        pointerDownOnBackdropRef.current = false;
      }}
    >
      <div
        className="bg-[var(--admin-elevated)] border border-white/10 rounded-[28px] w-full max-w-[480px] flex flex-col text-white overflow-hidden animate-in fade-in zoom-in-95 duration-200"
        onPointerDown={(e) => e.stopPropagation()}
        onMouseDown={(e) => e.stopPropagation()}
        onMouseUp={(e) => e.stopPropagation()}
        onClick={(e) => e.stopPropagation()}
      >
        {/* Header */}
        <div className="relative z-10 flex items-center justify-between px-5 py-4 border-b border-white/5 bg-[var(--admin-elevated)]">
          <div>
            <h3 className="text-sm font-heading font-bold uppercase tracking-wider text-white flex items-center gap-2">
              <Crop size={16} className="text-[var(--admin-primary)]" />
              {title}
            </h3>
            <p className="text-[11px] text-[var(--admin-text-muted)] mt-0.5">
              Drag image to position • Scroll or slider to zoom
            </p>
          </div>
          <button
            type="button"
            onClick={(e) => {
              e.stopPropagation();
              onClose();
            }}
            className="p-1.5 rounded-full text-[var(--admin-text-muted)] hover:text-white hover:bg-white/5 transition-colors cursor-pointer"
            aria-label="Close cropper"
          >
            <X size={18} />
          </button>
        </div>

        {/* Viewport Workspace */}
        <div className="p-5 flex flex-col items-center bg-[var(--admin-canvas)]">
          {/* Architectural Segmented Tab Bar */}
          <div className="relative z-10 flex items-center gap-1.5 mb-5 bg-[var(--admin-surface)] p-1.5 rounded-full border border-white/10">
            <button
              type="button"
              onClick={(e) => {
                e.stopPropagation();
                handleAspectChange("3/4");
              }}
              className={`px-3.5 py-1.5 text-xs font-bold uppercase tracking-wider rounded-full transition-all cursor-pointer ${
                aspect === "3/4"
                  ? "bg-[var(--admin-primary)] text-white"
                  : "text-[var(--admin-text-muted)] hover:text-white hover:bg-white/5"
              }`}
            >
              3:4 STORE CARD
            </button>
            <button
              type="button"
              onClick={(e) => {
                e.stopPropagation();
                handleAspectChange("1/1");
              }}
              className={`px-3.5 py-1.5 text-xs font-bold uppercase tracking-wider rounded-full transition-all cursor-pointer ${
                aspect === "1/1"
                  ? "bg-[var(--admin-primary)] text-white"
                  : "text-[var(--admin-text-muted)] hover:text-white hover:bg-white/5"
              }`}
            >
              1:1 SQUARE
            </button>
          </div>

          {/* Interactive Crop Frame Container */}
          <div
            ref={viewportRef}
            style={{ width: `${Vw}px`, height: `${Vh}px` }}
            onPointerDown={handlePointerDown}
            onClick={(e) => e.stopPropagation()}
            className={`relative overflow-hidden rounded-[14px] border-2 border-white/90 ring-1 ring-white/20 flex items-center justify-center transition-[width,height] duration-200 select-none touch-none ${
              isDragging ? "cursor-grabbing" : "cursor-grab"
            }`}
          >
            {imageLoaded && naturalSize.width > 0 ? (
              <img
                src={imageSrc}
                alt="Framing preview"
                draggable={false}
                style={{
                  width: `${displayWidth}px`,
                  height: `${displayHeight}px`,
                  transform: `translate(${imgLeft}px, ${imgTop}px)`,
                  maxWidth: "none",
                  position: "absolute",
                  top: 0,
                  left: 0,
                  pointerEvents: "none",
                }}
              />
            ) : (
              <div className="text-xs text-[var(--admin-text-muted)] animate-pulse">Loading image...</div>
            )}

            {/* Dynamic Rule-of-Thirds Grid */}
            <div
              className={`absolute inset-0 pointer-events-none grid grid-cols-3 grid-rows-3 transition-opacity duration-200 ${
                isDragging || isInteracting ? "opacity-60" : "opacity-20"
              }`}
            >
              <div className="border-r border-b border-white/40" />
              <div className="border-r border-b border-white/40" />
              <div className="border-b border-white/40" />
              <div className="border-r border-b border-white/40" />
              <div className="border-r border-b border-white/40" />
              <div className="border-b border-white/40" />
              <div className="border-r border-b border-white/40" />
              <div className="border-r border-b border-white/40" />
              <div />
            </div>

            {/* Viewfinder Architectural Corner Brackets */}
            <div className="absolute top-2 left-2 w-4 h-4 border-t-2 border-l-2 border-[var(--admin-primary)] pointer-events-none" />
            <div className="absolute top-2 right-2 w-4 h-4 border-t-2 border-r-2 border-[var(--admin-primary)] pointer-events-none" />
            <div className="absolute bottom-2 left-2 w-4 h-4 border-b-2 border-l-2 border-[var(--admin-primary)] pointer-events-none" />
            <div className="absolute bottom-2 right-2 w-4 h-4 border-b-2 border-r-2 border-[var(--admin-primary)] pointer-events-none" />
          </div>

          {/* Floating Dock Zoom Strip */}
          <div
            className="relative z-10 w-full max-w-[360px] mt-5 flex items-center gap-3 bg-[var(--admin-surface)] border border-white/10 px-4 py-2.5 rounded-full"
            onClick={(e) => e.stopPropagation()}
          >
            <button
              type="button"
              onClick={(e) => {
                e.stopPropagation();
                handleZoomUpdate(zoom - 0.15);
              }}
              disabled={zoom <= 1}
              className="text-[var(--admin-text-muted)] hover:text-white disabled:opacity-30 transition-all active:scale-95 cursor-pointer p-1 rounded-full hover:bg-white/5"
              title="Zoom Out"
              aria-label="Zoom Out"
            >
              <ZoomOut size={16} />
            </button>

            <input
              type="range"
              min="1"
              max="3"
              step="0.02"
              value={zoom}
              onMouseDown={(e) => {
                e.stopPropagation();
                triggerInteraction();
              }}
              onTouchStart={(e) => {
                e.stopPropagation();
                triggerInteraction();
              }}
              onChange={(e) => handleZoomUpdate(parseFloat(e.target.value))}
              className="flex-1 h-1.5 bg-[var(--admin-surface-2)] rounded-full appearance-none cursor-pointer accent-[var(--admin-primary)]"
              aria-label="Zoom level"
            />

            <button
              type="button"
              onClick={(e) => {
                e.stopPropagation();
                handleZoomUpdate(zoom + 0.15);
              }}
              disabled={zoom >= 3}
              className="text-[var(--admin-text-muted)] hover:text-white disabled:opacity-30 transition-all active:scale-95 cursor-pointer p-1 rounded-full hover:bg-white/5"
              title="Zoom In"
              aria-label="Zoom In"
            >
              <ZoomIn size={16} />
            </button>

            <span className="text-xs font-mono tabular-nums text-white w-12 text-right select-none font-bold">
              {Math.round(zoom * 100)}%
            </span>

            <div className="h-4 w-px bg-white/15" />

            <button
              type="button"
              onClick={(e) => {
                e.stopPropagation();
                handleReset();
              }}
              className="p-1.5 rounded-full text-[var(--admin-text-muted)] hover:text-white hover:bg-white/5 transition-all active:scale-95 cursor-pointer"
              title="Reset Framing & Zoom"
              aria-label="Reset Framing & Zoom"
            >
              <RotateCcw size={15} />
            </button>
          </div>
        </div>

        {/* Footer Actions */}
        <div className="relative z-10 p-4 border-t border-white/5 bg-[var(--admin-elevated)] flex items-center gap-3" onClick={(e) => e.stopPropagation()}>
          <button
            type="button"
            onClick={(e) => {
              e.stopPropagation();
              onClose();
            }}
            className="flex-1 px-4 py-2.5 text-xs font-semibold text-white/80 bg-[var(--admin-surface)] border border-white/10 rounded-full hover:bg-white/5 transition-colors cursor-pointer text-center"
          >
            Cancel
          </button>
          <button
            type="button"
            onClick={(e) => {
              e.stopPropagation();
              handleApplyCrop();
            }}
            className="flex-1 flex items-center justify-center gap-2 px-4 py-2.5 text-xs font-semibold text-white bg-[var(--admin-primary)] hover:bg-[var(--admin-primary-hover)] rounded-full transition-colors cursor-pointer"
          >
            <Check size={16} className="stroke-[2.5]" />
            Apply &amp; Set Image
          </button>
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
  const [rawPrimaryImage, setRawPrimaryImage] = useState(product?.imageUrl || "");
  const [rawSecondaryImage, setRawSecondaryImage] = useState(product?.secondaryImageUrl || "");
  const [cropperModal, setCropperModal] = useState<{
    open: boolean;
    source: string;
    target: "primary" | "secondary";
  }>({
    open: false,
    source: "",
    target: "primary",
  });
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
  const formBackdropPointerDownRef = useRef(false);

  const processFile = (file: File, target: "primary" | "secondary") => {
    if (!file) return;
    if (!file.type.startsWith("image/")) {
      setError("Please select a valid image file (JPEG, PNG, WEBP, etc.)");
      return;
    }
    if (file.size > 10 * 1024 * 1024) {
      setError("Image must be under 10MB");
      return;
    }
    setError("");
    const reader = new FileReader();
    reader.onload = () => {
      const result = reader.result as string;
      if (target === "primary") setRawPrimaryImage(result);
      else setRawSecondaryImage(result);
      setCropperModal({ open: true, source: result, target });
    };
    reader.readAsDataURL(file);
  };

  const handleImageUpload = (
    e: React.ChangeEvent<HTMLInputElement>,
    target: "primary" | "secondary"
  ) => {
    const file = e.target.files?.[0];
    if (file) processFile(file, target);
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
    <>
      <div
        className="fixed inset-0 z-[200] flex items-center justify-center bg-black/75 backdrop-blur-xs"
        onPointerDown={(e) => {
          formBackdropPointerDownRef.current = e.target === e.currentTarget;
        }}
        onClick={(e) => {
          if (e.target === e.currentTarget && formBackdropPointerDownRef.current) {
            onClose();
          }
          formBackdropPointerDownRef.current = false;
        }}
      >
        <div
          className="relative w-full max-w-2xl max-h-[90vh] bg-[var(--admin-elevated)] border border-white/10 rounded-[28px] overflow-y-auto mx-4 admin-scroll"
          onPointerDown={(e) => e.stopPropagation()}
          onMouseDown={(e) => e.stopPropagation()}
          onMouseUp={(e) => e.stopPropagation()}
          onClick={(e) => e.stopPropagation()}
        >
        <div className="sticky top-0 bg-[var(--admin-elevated)] z-10 flex items-center justify-between p-5 border-b border-white/5">
          <h3 className="text-lg font-heading font-bold text-white">
            {product ? "Edit Product" : "Add Product"}
          </h3>
          <button onClick={onClose} className="p-1.5 hover:bg-white/5 text-[var(--admin-text-muted)] hover:text-white rounded-full transition-colors cursor-pointer" aria-label="Close">
            <X size={18} />
          </button>
        </div>

        <div className="p-5 space-y-5">
          {error && (
            <div className="flex items-center gap-2 p-3 bg-[var(--admin-danger)]/15 border border-[var(--admin-danger)]/30 rounded-[14px] text-xs text-[var(--admin-danger)]" role="alert">
              <AlertCircle size={14} />
              {error}
            </div>
          )}

          {/* Product Name */}
          <div>
            <label className="block text-xs font-semibold text-white/90 mb-1.5">
              Product Name <span className="text-[var(--admin-danger)]">*</span>
            </label>
            <input
              type="text"
              value={name}
              onChange={(e) => { setName(e.target.value); setError(""); }}
              placeholder="e.g. Leather Crossbody Bag"
              className="w-full px-3.5 py-2.5 bg-[var(--admin-surface-2)] border border-white/10 rounded-[14px] text-sm text-white placeholder-[var(--admin-text-muted)] focus:outline-none focus:border-[var(--admin-primary)]"
            />
          </div>

          {/* Price Row */}
          <div className="grid grid-cols-2 gap-4">
            <div>
              <label className="block text-xs font-semibold text-white/90 mb-1.5">
                Price (₹) <span className="text-[var(--admin-danger)]">*</span>
              </label>
              <input
                type="number"
                value={price}
                onChange={(e) => { setPrice(e.target.value); setError(""); }}
                placeholder="1999"
                min="1"
                className="w-full px-3.5 py-2.5 bg-[var(--admin-surface-2)] border border-white/10 rounded-[14px] text-sm text-white placeholder-[var(--admin-text-muted)] focus:outline-none focus:border-[var(--admin-primary)]"
              />
            </div>
            <div>
              <label className="block text-xs font-semibold text-white/90 mb-1.5">
                Original Price (₹)
              </label>
              <input
                type="number"
                value={originalPrice}
                onChange={(e) => setOriginalPrice(e.target.value)}
                placeholder="2499"
                min="0"
                className="w-full px-3.5 py-2.5 bg-[var(--admin-surface-2)] border border-white/10 rounded-[14px] text-sm text-white placeholder-[var(--admin-text-muted)] focus:outline-none focus:border-[var(--admin-primary)]"
              />
            </div>
          </div>

          {/* Description */}
          <div>
            <label className="block text-xs font-semibold text-white/90 mb-1.5">
              Description <span className="text-[var(--admin-danger)]">*</span>
            </label>
            <textarea
              value={description}
              onChange={(e) => { setDescription(e.target.value); setError(""); }}
              placeholder="Write a compelling product description..."
              rows={3}
              className="w-full px-3.5 py-2.5 bg-[var(--admin-surface-2)] border border-white/10 rounded-[14px] text-sm text-white placeholder-[var(--admin-text-muted)] focus:outline-none focus:border-[var(--admin-primary)] resize-none"
            />
          </div>

          {/* Images */}
          <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
            {/* Primary Image */}
            <div>
              <label className="block text-xs font-semibold text-white/90 mb-1.5">
                Primary Image <span className="text-[var(--admin-danger)]">*</span>
              </label>
              <input ref={fileInputRef} type="file" accept="image/*" className="hidden" onChange={(e) => handleImageUpload(e, "primary")} />
              {imageUrl ? (
                <div className="relative w-full aspect-square rounded-[14px] overflow-hidden bg-[var(--admin-surface-2)] border border-white/10 group">
                  <Image src={imageUrl} alt="Product Primary" fill className="object-cover" unoptimized={imageUrl.startsWith("data:")} />
                  <div className="absolute top-2 right-2 flex items-center gap-1.5 z-10">
                    <button
                      type="button"
                      onClick={() => setCropperModal({ open: true, source: rawPrimaryImage || imageUrl, target: "primary" })}
                      className="p-1.5 bg-black/60 hover:bg-black/90 text-white rounded-full transition-colors cursor-pointer border border-white/10"
                      title="Adjust crop / framing"
                      aria-label="Adjust crop"
                    >
                      <Crop size={14} />
                    </button>
                    <button
                      type="button"
                      onClick={() => {
                        setImageUrl("");
                        setRawPrimaryImage("");
                        if (fileInputRef.current) fileInputRef.current.value = "";
                      }}
                      className="p-1.5 bg-[var(--admin-danger)]/80 hover:bg-[var(--admin-danger)] text-white rounded-full transition-colors cursor-pointer border border-white/10"
                      aria-label="Remove primary image"
                    >
                      <X size={14} />
                    </button>
                  </div>
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
                      if (file) processFile(file, "primary");
                    }}
                    className={`w-full aspect-square flex flex-col items-center justify-center gap-2 rounded-[14px] border-2 border-dashed transition-all cursor-pointer p-4 text-center ${
                      isPrimaryDragging
                        ? "border-[var(--admin-primary)] bg-[var(--admin-primary)]/10 scale-[1.01]"
                        : "border-white/10 bg-[var(--admin-surface-2)] hover:border-white/20 hover:bg-white/[0.03] focus:border-[var(--admin-primary)] focus:outline-none"
                    }`}
                  >
                    <Upload size={22} className={isPrimaryDragging ? "text-[var(--admin-primary)]" : "text-[var(--admin-text-muted)]"} />
                    <span className="text-xs font-semibold text-white">
                      {isPrimaryDragging ? "Drop image now" : "Drag & Drop or Click"}
                    </span>
                    <span className="text-[10px] text-[var(--admin-text-muted)]">Press Enter / Click to browse (Max 10MB)</span>
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
                            setRawPrimaryImage(primaryUrlInput.trim());
                            setCropperModal({ open: true, source: primaryUrlInput.trim(), target: "primary" });
                            setPrimaryUrlInput("");
                            setError("");
                          }
                        }
                      }}
                      className="flex-1 px-3 py-2 bg-[var(--admin-surface-2)] border border-white/10 rounded-[14px] text-xs text-white placeholder-[var(--admin-text-muted)] focus:outline-none focus:border-[var(--admin-primary)]"
                    />
                    <button
                      type="button"
                      onClick={() => {
                        if (primaryUrlInput.trim()) {
                          setRawPrimaryImage(primaryUrlInput.trim());
                          setCropperModal({ open: true, source: primaryUrlInput.trim(), target: "primary" });
                          setPrimaryUrlInput("");
                          setError("");
                        }
                      }}
                      className="px-3.5 py-2 bg-[var(--admin-primary)] hover:bg-[var(--admin-primary-hover)] text-white rounded-full text-xs font-medium transition-colors cursor-pointer"
                    >
                      Set
                    </button>
                  </div>
                </div>
              )}
            </div>

            {/* Secondary Image */}
            <div>
              <label className="block text-xs font-semibold text-white/90 mb-1.5">
                Secondary Image <span className="text-[var(--admin-text-muted)] font-normal">(Hover view)</span>
              </label>
              <input ref={secondaryFileInputRef} type="file" accept="image/*" className="hidden" onChange={(e) => handleImageUpload(e, "secondary")} />
              {secondaryImageUrl ? (
                <div className="relative w-full aspect-square rounded-[14px] overflow-hidden bg-[var(--admin-surface-2)] border border-white/10 group">
                  <Image src={secondaryImageUrl} alt="Product Secondary" fill className="object-cover" unoptimized={secondaryImageUrl.startsWith("data:")} />
                  <div className="absolute top-2 right-2 flex items-center gap-1.5 z-10">
                    <button
                      type="button"
                      onClick={() => setCropperModal({ open: true, source: rawSecondaryImage || secondaryImageUrl, target: "secondary" })}
                      className="p-1.5 bg-black/60 hover:bg-black/90 text-white rounded-full transition-colors cursor-pointer border border-white/10"
                      title="Adjust crop / framing"
                      aria-label="Adjust crop"
                    >
                      <Crop size={14} />
                    </button>
                    <button
                      type="button"
                      onClick={() => {
                        setSecondaryImageUrl("");
                        setRawSecondaryImage("");
                        if (secondaryFileInputRef.current) secondaryFileInputRef.current.value = "";
                      }}
                      className="p-1.5 bg-[var(--admin-danger)]/80 hover:bg-[var(--admin-danger)] text-white rounded-full transition-colors cursor-pointer border border-white/10"
                      aria-label="Remove secondary image"
                    >
                      <X size={14} />
                    </button>
                  </div>
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
                      if (file) processFile(file, "secondary");
                    }}
                    className={`w-full aspect-square flex flex-col items-center justify-center gap-2 rounded-[14px] border-2 border-dashed transition-all cursor-pointer p-4 text-center ${
                      isSecondaryDragging
                        ? "border-[var(--admin-primary)] bg-[var(--admin-primary)]/10 scale-[1.01]"
                        : "border-white/10 bg-[var(--admin-surface-2)] hover:border-white/20 hover:bg-white/[0.03] focus:border-[var(--admin-primary)] focus:outline-none"
                    }`}
                  >
                    <Upload size={22} className={isSecondaryDragging ? "text-[var(--admin-primary)]" : "text-[var(--admin-text-muted)]"} />
                    <span className="text-xs font-semibold text-white">
                      {isSecondaryDragging ? "Drop image now" : "Drag & Drop or Click"}
                    </span>
                    <span className="text-[10px] text-[var(--admin-text-muted)]">Optional hover view (Max 10MB)</span>
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
                            setRawSecondaryImage(secondaryUrlInput.trim());
                            setCropperModal({ open: true, source: secondaryUrlInput.trim(), target: "secondary" });
                            setSecondaryUrlInput("");
                          }
                        }
                      }}
                      className="flex-1 px-3 py-2 bg-[var(--admin-surface-2)] border border-white/10 rounded-[14px] text-xs text-white placeholder-[var(--admin-text-muted)] focus:outline-none focus:border-[var(--admin-primary)]"
                    />
                    <button
                      type="button"
                      onClick={() => {
                        if (secondaryUrlInput.trim()) {
                          setRawSecondaryImage(secondaryUrlInput.trim());
                          setCropperModal({ open: true, source: secondaryUrlInput.trim(), target: "secondary" });
                          setSecondaryUrlInput("");
                        }
                      }}
                      className="px-3.5 py-2 bg-[var(--admin-primary)] hover:bg-[var(--admin-primary-hover)] text-white rounded-full text-xs font-medium transition-colors cursor-pointer"
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
              <label className="block text-xs font-semibold text-white/90 mb-1.5">
                Sizes (comma-separated)
              </label>
              <input
                type="text"
                value={sizes}
                onChange={(e) => setSizes(e.target.value)}
                placeholder="S, M, L, XL"
                className="w-full px-3.5 py-2.5 bg-[var(--admin-surface-2)] border border-white/10 rounded-[14px] text-sm text-white placeholder-[var(--admin-text-muted)] focus:outline-none focus:border-[var(--admin-primary)]"
              />
            </div>
            <div>
              <label className="block text-xs font-semibold text-white/90 mb-1.5">Badge</label>
              <select
                value={badge}
                onChange={(e) => setBadge(e.target.value)}
                className="w-full px-3.5 py-2.5 bg-[var(--admin-surface-2)] border border-white/10 rounded-[14px] text-sm text-white focus:outline-none focus:border-[var(--admin-primary)] cursor-pointer"
              >
                <option value="" className="bg-[var(--admin-surface-2)] text-white">No Badge</option>
                <option value="NEW" className="bg-[var(--admin-surface-2)] text-white">NEW</option>
                <option value="SALE" className="bg-[var(--admin-surface-2)] text-white">SALE</option>
                <option value="BESTSELLER" className="bg-[var(--admin-surface-2)] text-white">BESTSELLER</option>
                <option value="LIMITED" className="bg-[var(--admin-surface-2)] text-white">LIMITED</option>
                <option value="TRENDING" className="bg-[var(--admin-surface-2)] text-white">TRENDING</option>
                <option value="PREMIUM" className="bg-[var(--admin-surface-2)] text-white">PREMIUM</option>
                <option value="EXCLUSIVE" className="bg-[var(--admin-surface-2)] text-white">EXCLUSIVE</option>
              </select>
            </div>
          </div>

          <div className="grid grid-cols-3 gap-4">
            <div className="min-w-0">
              <label className="block text-xs font-semibold text-white/90 mb-1.5">Color Name</label>
              <input
                type="text"
                value={colorName}
                onChange={(e) => setColorName(e.target.value)}
                placeholder="Black"
                className="w-full px-3.5 py-2.5 bg-[var(--admin-surface-2)] border border-white/10 rounded-[14px] text-sm text-white placeholder-[var(--admin-text-muted)] focus:outline-none focus:border-[var(--admin-primary)]"
              />
            </div>
            <div className="min-w-0">
              <label className="block text-xs font-semibold text-white/90 mb-1.5">Color Hex</label>
              <div className="flex items-center gap-2 min-w-0">
                <div
                  className="relative w-10 h-10 rounded-[14px] border border-white/10 overflow-hidden shrink-0 cursor-pointer hover:border-white/20 transition-colors"
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
                  className="flex-1 min-w-0 px-3 py-2.5 bg-[var(--admin-surface-2)] border border-white/10 rounded-[14px] text-sm text-white font-mono uppercase placeholder-[var(--admin-text-muted)] focus:outline-none focus:border-[var(--admin-primary)]"
                />
              </div>
            </div>
            <div className="min-w-0">
              <label className="block text-xs font-semibold text-white/90 mb-1.5">Material</label>
              <input
                type="text"
                value={material}
                onChange={(e) => setMaterial(e.target.value)}
                placeholder="Genuine Leather"
                className="w-full px-3.5 py-2.5 bg-[var(--admin-surface-2)] border border-white/10 rounded-[14px] text-sm text-white placeholder-[var(--admin-text-muted)] focus:outline-none focus:border-[var(--admin-primary)]"
              />
            </div>
          </div>

          {/* Tags */}
          <div>
            <label className="block text-xs font-semibold text-white/90 mb-1.5">
              Tags (comma-separated)
            </label>
            <input
              type="text"
              value={tags}
              onChange={(e) => setTags(e.target.value)}
              placeholder="leather, premium, handcrafted"
              className="w-full px-3.5 py-2.5 bg-[var(--admin-surface-2)] border border-white/10 rounded-[14px] text-sm text-white placeholder-[var(--admin-text-muted)] focus:outline-none focus:border-[var(--admin-primary)]"
            />
          </div>

          {/* In Stock */}
          <label className="flex items-center gap-3 cursor-pointer select-none">
            <div
              className={`w-10 h-5.5 rounded-full relative transition-colors ${inStock ? "bg-[var(--admin-primary)]" : "bg-[var(--admin-surface-2)] border border-white/10"}`}
              onClick={() => setInStock(!inStock)}
              role="switch"
              aria-checked={inStock}
              tabIndex={0}
              onKeyDown={(e) => { if (e.key === " " || e.key === "Enter") setInStock(!inStock); }}
            >
              <div
                className={`absolute top-0.5 w-4.5 h-4.5 bg-white rounded-full transition-transform ${
                  inStock ? "translate-x-[18px]" : "translate-x-0.5"
                }`}
              />
            </div>
            <span className="text-xs font-medium text-white/90">In Stock</span>
          </label>
        </div>

        {/* Footer */}
        <div className="sticky bottom-0 bg-[var(--admin-elevated)] p-5 border-t border-white/5 flex items-center gap-3">
          <button
            onClick={onClose}
            className="flex-1 px-4 py-2.5 text-sm font-semibold text-white/80 bg-[var(--admin-surface)] border border-white/10 rounded-full hover:bg-white/5 transition-colors cursor-pointer"
          >
            Cancel
          </button>
          <button
            onClick={handleSubmit}
            className="flex-1 flex items-center justify-center gap-2 px-4 py-2.5 bg-[var(--admin-primary)] hover:bg-[var(--admin-primary-hover)] text-white text-sm font-semibold rounded-full transition-colors cursor-pointer"
          >
            <Save size={14} />
            {product ? "Update Product" : "Add Product"}
          </button>
        </div>
      </div>
    </div>

      {/* Image Cropper Studio Modal */}
      {cropperModal.open && (
        <ImageCropperModal
          imageSrc={cropperModal.source}
          title={cropperModal.target === "primary" ? "Crop Primary Product Image" : "Crop Secondary Hover Image"}
          onCrop={(croppedResult) => {
            if (cropperModal.target === "primary") {
              setImageUrl(croppedResult);
            } else {
              setSecondaryImageUrl(croppedResult);
            }
            setCropperModal({ open: false, source: "", target: "primary" });
          }}
          onClose={() => setCropperModal({ open: false, source: "", target: "primary" })}
        />
      )}
    </>
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
    <div className="fixed inset-0 z-[200] flex items-center justify-center bg-black/75 backdrop-blur-xs" onClick={onClose}>
      <div
        className="relative w-full max-w-md bg-[var(--admin-elevated)] border border-white/10 rounded-[28px] overflow-hidden mx-4"
        onClick={(e) => e.stopPropagation()}
      >
        <div className="flex items-center justify-between p-5 border-b border-white/5">
          <h3 className="text-lg font-heading font-bold text-white">
            {filter ? "Edit Filter" : "Add Filter"}
          </h3>
          <button onClick={onClose} className="p-1.5 hover:bg-white/5 text-[var(--admin-text-muted)] hover:text-white rounded-full transition-colors cursor-pointer" aria-label="Close">
            <X size={18} />
          </button>
        </div>

        <div className="p-5 space-y-4">
          {error && (
            <div className="flex items-center gap-2 p-3 bg-[var(--admin-danger)]/15 border border-[var(--admin-danger)]/30 rounded-[14px] text-xs text-[var(--admin-danger)]" role="alert">
              <AlertCircle size={14} />
              {error}
            </div>
          )}

          <div>
            <label className="block text-xs font-semibold text-white/90 mb-1.5">
              Filter Label <span className="text-[var(--admin-danger)]">*</span>
            </label>
            <input
              type="text"
              value={label}
              onChange={(e) => { setLabel(e.target.value); setError(""); }}
              placeholder="e.g. Color, Size, Material"
              className="w-full px-3.5 py-2.5 bg-[var(--admin-surface-2)] border border-white/10 rounded-[14px] text-sm text-white placeholder-[var(--admin-text-muted)] focus:outline-none focus:border-[var(--admin-primary)]"
            />
          </div>

          <div>
            <label className="block text-xs font-semibold text-white/90 mb-1.5">
              Filter Key <span className="text-[var(--admin-danger)]">*</span>
            </label>
            <input
              type="text"
              value={key}
              onChange={(e) => { setKey(e.target.value); setError(""); }}
              placeholder="e.g. color, size, material"
              className="w-full px-3.5 py-2.5 bg-[var(--admin-surface-2)] border border-white/10 rounded-[14px] text-sm text-white placeholder-[var(--admin-text-muted)] focus:outline-none focus:border-[var(--admin-primary)]"
            />
            <p className="text-[10px] text-[var(--admin-text-muted)] mt-1">Used to match product tags. Products with tags matching these options will appear.</p>
          </div>

          <div>
            <label className="block text-xs font-semibold text-white/90 mb-1.5">
              Filter Type
            </label>
            <select
              value={type}
              onChange={(e) => setType(e.target.value as CustomSectionFilter["type"])}
              className="w-full px-3.5 py-2.5 bg-[var(--admin-surface-2)] border border-white/10 rounded-[14px] text-sm text-white focus:outline-none focus:border-[var(--admin-primary)] cursor-pointer"
            >
              <option value="checkbox" className="bg-[var(--admin-surface-2)] text-white">Checkbox (Multi-select)</option>
              <option value="radio" className="bg-[var(--admin-surface-2)] text-white">Radio (Single-select)</option>
            </select>
          </div>

          <div>
            <label className="block text-xs font-semibold text-white/90 mb-1.5">
              Options <span className="text-[var(--admin-danger)]">*</span>
            </label>
            <textarea
              value={options}
              onChange={(e) => { setOptions(e.target.value); setError(""); }}
              placeholder={"Enter each option on a new line:\nBlack\nWhite\nBrown\nTan"}
              rows={5}
              className="w-full px-3.5 py-2.5 bg-[var(--admin-surface-2)] border border-white/10 rounded-[14px] text-sm text-white placeholder-[var(--admin-text-muted)] focus:outline-none focus:border-[var(--admin-primary)] resize-none font-mono"
            />
            <p className="text-[10px] text-[var(--admin-text-muted)] mt-1">One option per line. Must match product tags for filtering to work.</p>
          </div>
        </div>

        <div className="p-5 border-t border-white/5 flex items-center gap-3">
          <button
            onClick={onClose}
            className="flex-1 px-4 py-2.5 text-sm font-semibold text-white/80 bg-[var(--admin-surface)] border border-white/10 rounded-full hover:bg-white/5 transition-colors cursor-pointer"
          >
            Cancel
          </button>
          <button
            onClick={handleSubmit}
            className="flex-1 flex items-center justify-center gap-2 px-4 py-2.5 bg-[var(--admin-primary)] hover:bg-[var(--admin-primary-hover)] text-white text-sm font-semibold rounded-full transition-colors cursor-pointer"
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
          className="p-2 text-[var(--admin-text-muted)] hover:text-white hover:bg-white/5 rounded-full transition-colors cursor-pointer"
          aria-label="Back to sections"
        >
          <ArrowLeft size={18} />
        </button>
        <div>
          <h2 className="text-xl font-heading font-bold text-white tracking-tight">Edit: {currentSection.name}</h2>
          <p className="text-xs text-[var(--admin-text-muted)] mt-0.5">
            /{currentSection.slug} · {currentSection.isActive ? "Live" : "Draft"}
          </p>
        </div>
      </div>

      {/* Tabs */}
      <div className="flex items-center gap-1 bg-[var(--admin-surface)] border border-white/5 p-1 rounded-full mb-6 overflow-x-auto admin-scroll" role="tablist">
        {tabs.map((tab) => (
          <button
            key={tab.key}
            onClick={() => setActiveTab(tab.key)}
            role="tab"
            aria-selected={activeTab === tab.key}
            className={`flex items-center gap-1.5 px-4 py-2.5 rounded-full text-xs font-semibold transition-all whitespace-nowrap cursor-pointer ${
              activeTab === tab.key
                ? "bg-[var(--admin-primary)] text-white"
                : "text-[var(--admin-text-muted)] hover:text-white hover:bg-white/5"
            }`}
          >
            <tab.icon size={14} />
            {tab.label}
            {tab.key === "carousel" && (
              <span className={`ml-1 text-[10px] px-1.5 py-0.5 rounded-full font-bold ${activeTab === tab.key ? "bg-white/20 text-white" : "bg-white/5 text-[var(--admin-text-muted)]"}`}>
                {currentSection.carouselImages.length}
              </span>
            )}
            {tab.key === "products" && (
              <span className={`ml-1 text-[10px] px-1.5 py-0.5 rounded-full font-bold ${activeTab === tab.key ? "bg-white/20 text-white" : "bg-white/5 text-[var(--admin-text-muted)]"}`}>
                {currentSection.products.length}
              </span>
            )}
            {tab.key === "filters" && (
              <span className={`ml-1 text-[10px] px-1.5 py-0.5 rounded-full font-bold ${activeTab === tab.key ? "bg-white/20 text-white" : "bg-white/5 text-[var(--admin-text-muted)]"}`}>
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
          <div className="bg-[var(--admin-surface)] rounded-[28px] border border-white/5 p-6 space-y-5">
            <div>
              <label className="block text-xs font-semibold text-white/90 mb-1.5">
                Section Name <span className="text-[var(--admin-danger)]">*</span>
              </label>
              <input
                type="text"
                value={sectionName}
                onChange={(e) => setSectionName(e.target.value)}
                className="w-full px-4 py-3 bg-[var(--admin-surface-2)] border border-white/10 rounded-[14px] text-sm text-white placeholder-[var(--admin-text-muted)] focus:outline-none focus:border-[var(--admin-primary)]"
                placeholder="e.g. Accessories"
              />
              <p className="text-[10px] text-[var(--admin-text-muted)] mt-1">
                URL: /{sectionName.toLowerCase().trim().replace(/[^\w\s-]/g, "").replace(/[\s_]+/g, "-").replace(/^-+|-+$/g, "") || "section-name"}
              </p>
            </div>
            <div>
              <label className="block text-xs font-semibold text-white/90 mb-1.5">Description</label>
              <textarea
                value={sectionDescription}
                onChange={(e) => setSectionDescription(e.target.value)}
                rows={3}
                className="w-full px-4 py-3 bg-[var(--admin-surface-2)] border border-white/10 rounded-[14px] text-sm text-white placeholder-[var(--admin-text-muted)] focus:outline-none focus:border-[var(--admin-primary)] resize-none"
                placeholder="Describe this section..."
              />
            </div>
            <div>
              <label className="block text-xs font-semibold text-white/90 mb-1.5">Meta Title (SEO)</label>
              <input
                type="text"
                value={metaTitle}
                onChange={(e) => setMetaTitle(e.target.value)}
                className="w-full px-4 py-3 bg-[var(--admin-surface-2)] border border-white/10 rounded-[14px] text-sm text-white placeholder-[var(--admin-text-muted)] focus:outline-none focus:border-[var(--admin-primary)]"
                placeholder="Page title for search engines"
              />
            </div>
            <div>
              <label className="block text-xs font-semibold text-white/90 mb-1.5">Meta Description (SEO)</label>
              <textarea
                value={metaDescription}
                onChange={(e) => setMetaDescription(e.target.value)}
                rows={2}
                className="w-full px-4 py-3 bg-[var(--admin-surface-2)] border border-white/10 rounded-[14px] text-sm text-white placeholder-[var(--admin-text-muted)] focus:outline-none focus:border-[var(--admin-primary)] resize-none"
                placeholder="Brief description for search engine results"
              />
            </div>

            {/* Carousel Banner Height */}
            <div>
              <label className="block text-xs font-semibold text-white/90 mb-1.5">
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
                    className={`p-3 rounded-[14px] border text-left transition-all cursor-pointer ${
                      carouselHeight === item.key
                        ? "border-[var(--admin-primary)] bg-[var(--admin-primary)]/15 text-white"
                        : "border-white/10 bg-[var(--admin-surface-2)] text-white/90 hover:border-white/20 hover:bg-white/[0.03]"
                    }`}
                  >
                    <div className="text-xs font-heading font-bold">{item.label}</div>
                    <div className={`text-[10px] ${carouselHeight === item.key ? "text-white/70" : "text-[var(--admin-text-muted)]"}`}>
                      {item.desc}
                    </div>
                  </button>
                ))}
              </div>
            </div>

            <button
              onClick={handleSaveDetails}
              className="flex items-center gap-2 px-5 py-2.5 bg-[var(--admin-primary)] hover:bg-[var(--admin-primary-hover)] text-white text-sm font-semibold rounded-full transition-colors cursor-pointer"
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
            <div className="bg-[var(--admin-surface)] rounded-[28px] border border-white/5 p-4 flex flex-col sm:flex-row sm:items-center justify-between gap-3">
              <div>
                <h4 className="text-xs font-heading font-bold text-white">Carousel Banner Size</h4>
                <p className="text-[11px] text-[var(--admin-text-muted)]">Choose how prominent the banner appears on the storefront</p>
              </div>
              <div className="flex items-center gap-2">
                {(["compact", "medium", "large"] as const).map((h) => (
                  <button
                    key={h}
                    type="button"
                    onClick={() => handleUpdateCarouselHeight(h)}
                    className={`px-3.5 py-1.5 rounded-full text-xs font-bold uppercase tracking-wider transition-all cursor-pointer ${
                      carouselHeight === h
                        ? "bg-[var(--admin-primary)] text-white"
                        : "bg-[var(--admin-surface-2)] border border-white/10 text-[var(--admin-text-muted)] hover:text-white"
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
              className={`rounded-[28px] border-2 border-dashed p-6 transition-all text-center flex flex-col items-center justify-center gap-2 cursor-pointer ${
                currentSection.carouselImages.length >= maxCarouselImages
                  ? "bg-[var(--admin-surface-2)] border-white/5 opacity-50 cursor-not-allowed"
                  : isCarouselDragging
                  ? "border-[var(--admin-primary)] bg-[var(--admin-primary)]/10 scale-[1.01]"
                  : "border-white/10 bg-[var(--admin-surface)] hover:border-white/20 hover:bg-white/[0.02] focus:border-[var(--admin-primary)] focus:outline-none"
              }`}
            >
              <ImagePlus size={32} className={isCarouselDragging ? "text-[var(--admin-primary)]" : "text-[var(--admin-text-muted)]"} />
              <div className="text-xs font-semibold text-white">
                {currentSection.carouselImages.length >= maxCarouselImages
                  ? `Maximum ${maxCarouselImages} carousel images reached`
                  : isCarouselDragging
                  ? "Drop your banner image here"
                  : "Drag & Drop carousel image or Click to browse"}
              </div>
              <p className="text-[10px] text-[var(--admin-text-muted)]">
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
                  className="flex-1 px-4 py-2.5 bg-[var(--admin-surface-2)] border border-white/10 rounded-[14px] text-xs text-white placeholder-[var(--admin-text-muted)] focus:outline-none focus:border-[var(--admin-primary)]"
                />
                <button
                  type="button"
                  onClick={handleCarouselUrlAdd}
                  className="px-4 py-2.5 bg-[var(--admin-primary)] hover:bg-[var(--admin-primary-hover)] text-white rounded-full text-xs font-semibold transition-colors cursor-pointer"
                >
                  Add Banner
                </button>
              </div>
            )}

            {/* Carousel Images Grid */}
            {currentSection.carouselImages.length === 0 ? (
              <div className="bg-[var(--admin-surface)] rounded-[28px] border border-white/5 p-8 text-center">
                <p className="text-xs text-[var(--admin-text-muted)]">No carousel banners added yet. Drop an image above to get started.</p>
              </div>
            ) : (
              <div className="grid grid-cols-2 lg:grid-cols-3 gap-4">
                {currentSection.carouselImages.map((img, index) => (
                  <div key={img.id} className="relative group rounded-[14px] overflow-hidden bg-[var(--admin-surface-2)] border border-white/10 aspect-[16/9]">
                    <Image src={img.src} alt={img.alt} fill className="object-cover" unoptimized={img.src?.startsWith("data:")} />
                    <div className="absolute inset-0 bg-black/0 group-hover:bg-black/30 transition-colors" />
                    <div className="absolute top-2 left-2 px-2.5 py-0.5 bg-black/60 rounded-full text-[10px] font-bold text-white backdrop-blur-md">
                      Banner {index + 1}
                    </div>
                    <button
                      onClick={() => removeCarouselImage(section.id, img.id)}
                      className="absolute top-2 right-2 p-1.5 bg-[var(--admin-danger)]/80 text-white rounded-full opacity-0 group-hover:opacity-100 transition-opacity hover:bg-[var(--admin-danger)] cursor-pointer"
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
              <p className="text-xs text-[var(--admin-text-muted)]">
                {currentSection.products.length} product{currentSection.products.length !== 1 ? "s" : ""}
              </p>
              <button
                onClick={() => setProductModal({ open: true })}
                className="flex items-center gap-1.5 px-4 py-2 bg-[var(--admin-primary)] hover:bg-[var(--admin-primary-hover)] text-white text-xs font-semibold rounded-full transition-colors cursor-pointer"
              >
                <Plus size={14} />
                Add Product
              </button>
            </div>

            {currentSection.products.length === 0 ? (
              <div className="bg-[var(--admin-surface)] rounded-[28px] border border-dashed border-white/10 p-12 text-center">
                <ShoppingBag size={40} className="mx-auto text-[var(--admin-text-muted)] mb-3" />
                <p className="text-sm font-medium text-white">No products yet</p>
                <p className="text-xs text-[var(--admin-text-muted)] mt-1">Add products that will appear in this section&apos;s catalog</p>
              </div>
            ) : (
              <div className="space-y-2">
                {currentSection.products.map((product) => (
                  <div key={product.id} className="flex items-center gap-4 bg-[var(--admin-surface)] rounded-[14px] border border-white/5 p-3 hover:border-white/10 transition-colors">
                    <div className="relative w-14 h-14 rounded-[10px] overflow-hidden bg-[var(--admin-surface-2)] border border-white/5 shrink-0">
                      <Image src={product.imageUrl} alt={product.name} fill className="object-cover" unoptimized={product.imageUrl?.startsWith("data:")} />
                    </div>
                    <div className="flex-1 min-w-0">
                      <h4 className="text-sm font-semibold text-white truncate">{product.name}</h4>
                      <div className="flex items-center gap-2 mt-0.5">
                        <span className="text-xs font-heading font-bold tabular-nums text-white">₹{product.price.toLocaleString("en-IN")}</span>
                        {product.originalPrice && product.originalPrice > product.price && (
                          <span className="text-[10px] text-[var(--admin-text-muted)] line-through">₹{product.originalPrice.toLocaleString("en-IN")}</span>
                        )}
                        {product.badge && (
                          <span className="text-[9px] bg-[var(--admin-primary)]/20 border border-[var(--admin-primary)]/30 text-[var(--admin-primary)] px-1.5 py-0.5 rounded-full font-bold">{product.badge}</span>
                        )}
                        <span className={`text-[10px] font-medium ${product.inStock ? "text-[var(--admin-success)]" : "text-[var(--admin-danger)]"}`}>
                          {product.inStock ? "In Stock" : "Out of Stock"}
                        </span>
                      </div>
                    </div>
                    <div className="flex items-center gap-1 shrink-0">
                      <button
                        onClick={() => setProductModal({ open: true, product })}
                        className="p-2 text-[var(--admin-text-muted)] hover:text-white hover:bg-white/5 rounded-full transition-colors cursor-pointer"
                        aria-label={`Edit ${product.name}`}
                      >
                        <Edit3 size={14} />
                      </button>
                      <button
                        onClick={() => removeProductFromSection(section.id, product.id)}
                        className="p-2 text-[var(--admin-text-muted)] hover:text-[var(--admin-danger)] hover:bg-[var(--admin-danger)]/15 rounded-full transition-colors cursor-pointer"
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
                <p className="text-xs text-[var(--admin-text-muted)]">
                  {currentSection.filters.length} filter{currentSection.filters.length !== 1 ? "s" : ""}
                </p>
              </div>
              <button
                onClick={() => setFilterModal({ open: true })}
                className="flex items-center gap-1.5 px-4 py-2 bg-[var(--admin-primary)] hover:bg-[var(--admin-primary-hover)] text-white text-xs font-semibold rounded-full transition-colors cursor-pointer"
              >
                <Plus size={14} />
                Add Filter
              </button>
            </div>

            <div className="bg-[var(--admin-warning)]/10 border border-[var(--admin-warning)]/20 rounded-[14px] p-3.5 text-xs text-[var(--admin-warning)]">
              <strong>How filters work:</strong> Each filter has a <strong>key</strong> and <strong>options</strong>.
              Products are filtered by matching their <strong>tags</strong> against the selected filter options.
              For example, a &quot;Color&quot; filter with options [Black, White] will show products that have &quot;Black&quot; or &quot;White&quot; in their tags.
            </div>

            {currentSection.filters.length === 0 ? (
              <div className="bg-[var(--admin-surface)] rounded-[28px] border border-dashed border-white/10 p-12 text-center">
                <SlidersHorizontal size={40} className="mx-auto text-[var(--admin-text-muted)] mb-3" />
                <p className="text-sm font-medium text-white">No filters yet</p>
                <p className="text-xs text-[var(--admin-text-muted)] mt-1">Add filters so customers can narrow down products</p>
              </div>
            ) : (
              <div className="space-y-2">
                {currentSection.filters.map((filter) => (
                  <div key={filter.id} className="flex items-start gap-4 bg-[var(--admin-surface)] rounded-[14px] border border-white/5 p-4 hover:border-white/10 transition-colors">
                    <div className="p-2 bg-[var(--admin-surface-2)] border border-white/5 rounded-[10px] shrink-0 text-white/80">
                      <SlidersHorizontal size={16} />
                    </div>
                    <div className="flex-1 min-w-0">
                      <div className="flex items-center gap-2">
                        <h4 className="text-sm font-semibold text-white">{filter.label}</h4>
                        <span className="text-[10px] bg-white/5 text-[var(--admin-text-muted)] border border-white/10 px-1.5 py-0.5 rounded font-mono">{filter.key}</span>
                        <span className="text-[10px] bg-[var(--admin-info)]/15 border border-[var(--admin-info)]/30 text-[var(--admin-info)] px-1.5 py-0.5 rounded font-medium">{filter.type}</span>
                      </div>
                      <div className="flex flex-wrap gap-1.5 mt-2">
                        {filter.options.map((opt) => (
                          <span key={opt} className="text-[10px] bg-[var(--admin-surface-2)] border border-white/10 text-white/90 px-2 py-0.5 rounded-full">
                            {opt}
                          </span>
                        ))}
                      </div>
                    </div>
                    <div className="flex items-center gap-1 shrink-0">
                      <button
                        onClick={() => setFilterModal({ open: true, filter })}
                        className="p-2 text-[var(--admin-text-muted)] hover:text-white hover:bg-white/5 rounded-full transition-colors cursor-pointer"
                        aria-label={`Edit filter ${filter.label}`}
                      >
                        <Edit3 size={14} />
                      </button>
                      <button
                        onClick={() => removeFilterFromSection(section.id, filter.id)}
                        className="p-2 text-[var(--admin-text-muted)] hover:text-[var(--admin-danger)] hover:bg-[var(--admin-danger)]/15 rounded-full transition-colors cursor-pointer"
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
    <div className="fixed inset-0 z-[200] flex items-center justify-center bg-black/75 backdrop-blur-xs" onClick={onClose}>
      <div
        className="relative w-full max-w-md bg-[var(--admin-elevated)] border border-white/10 rounded-[28px] overflow-hidden mx-4"
        onClick={(e) => e.stopPropagation()}
      >
        <div className="flex items-center justify-between p-5 border-b border-white/5">
          <h3 className="text-lg font-heading font-bold text-white">Create New Section</h3>
          <button onClick={onClose} className="p-1.5 hover:bg-white/5 text-[var(--admin-text-muted)] hover:text-white rounded-full transition-colors cursor-pointer" aria-label="Close">
            <X size={18} />
          </button>
        </div>

        <div className="p-5 space-y-4">
          {error && (
            <div className="flex items-center gap-2 p-3 bg-[var(--admin-danger)]/15 border border-[var(--admin-danger)]/30 rounded-[14px] text-xs text-[var(--admin-danger)]" role="alert">
              <AlertCircle size={14} />
              {error}
            </div>
          )}
          <div>
            <label className="block text-xs font-semibold text-white/90 mb-1.5">
              Section Name <span className="text-[var(--admin-danger)]">*</span>
            </label>
            <input
              type="text"
              value={name}
              onChange={(e) => { setName(e.target.value); setError(""); }}
              placeholder="e.g. Accessories, Bags, Sunglasses"
              className="w-full px-4 py-3 bg-[var(--admin-surface-2)] border border-white/10 rounded-[14px] text-sm text-white placeholder-[var(--admin-text-muted)] focus:outline-none focus:border-[var(--admin-primary)]"
              autoFocus
            />
            {name.trim() && (
              <p className="text-[10px] text-[var(--admin-text-muted)] mt-1">
                URL: /{name.toLowerCase().trim().replace(/[^\w\s-]/g, "").replace(/[\s_]+/g, "-").replace(/^-+|-+$/g, "")}
              </p>
            )}
          </div>
          <div>
            <label className="block text-xs font-semibold text-white/90 mb-1.5">Description</label>
            <textarea
              value={description}
              onChange={(e) => setDescription(e.target.value)}
              rows={3}
              className="w-full px-4 py-3 bg-[var(--admin-surface-2)] border border-white/10 rounded-[14px] text-sm text-white placeholder-[var(--admin-text-muted)] focus:outline-none focus:border-[var(--admin-primary)] resize-none"
              placeholder="Short description for this section..."
            />
          </div>
        </div>

        <div className="p-5 border-t border-white/5 flex items-center gap-3">
          <button
            onClick={onClose}
            className="flex-1 px-4 py-2.5 text-sm font-semibold text-white/80 bg-[var(--admin-surface)] border border-white/10 rounded-full hover:bg-white/5 transition-colors cursor-pointer"
          >
            Cancel
          </button>
          <button
            onClick={handleCreate}
            className="flex-1 flex items-center justify-center gap-2 px-4 py-2.5 bg-[var(--admin-primary)] hover:bg-[var(--admin-primary-hover)] text-white text-sm font-semibold rounded-full transition-colors cursor-pointer"
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
          <h1 className="text-2xl font-heading font-bold text-white tracking-tight">Custom Sections</h1>
          <p className="text-sm text-[var(--admin-text-muted)] mt-1">
            Create up to <span className="font-heading font-bold tabular-nums text-white">{maxSections}</span> custom storefront sections with carousels, products &amp; filters
          </p>
        </div>
        <button
          onClick={() => setShowCreateModal(true)}
          disabled={!canAddSection}
          className={`flex items-center gap-2 px-5 py-2.5 text-sm font-semibold rounded-full transition-colors cursor-pointer ${
            canAddSection
              ? "bg-[var(--admin-primary)] hover:bg-[var(--admin-primary-hover)] text-white"
              : "bg-white/5 border border-white/10 text-[var(--admin-text-muted)] cursor-not-allowed"
          }`}
        >
          <Plus size={16} />
          New Section
        </button>
      </div>

      {/* Quota Indicator */}
      <div className="bg-[var(--admin-surface)] rounded-[28px] border border-white/5 p-5 mb-6">
        <div className="flex items-center justify-between mb-2">
          <span className="text-xs font-semibold text-[var(--admin-text-muted)]">Sections Used</span>
          <span className="text-xs font-heading font-bold tabular-nums text-white">{sections.length} / {maxSections}</span>
        </div>
        <div className="w-full h-2 bg-white/5 rounded-full overflow-hidden">
          <div
            className="h-full rounded-full transition-all duration-500 bg-[var(--admin-primary)]"
            style={{
              width: `${(sections.length / maxSections) * 100}%`,
            }}
          />
        </div>
      </div>

      {/* Section Cards Grid */}
      {sections.length === 0 ? (
        <div className="bg-[var(--admin-surface)] rounded-[28px] border border-dashed border-white/10 p-16 text-center">
          <Layers size={48} className="mx-auto text-[var(--admin-text-muted)] mb-4" />
          <h3 className="text-lg font-heading font-bold text-white">No custom sections yet</h3>
          <p className="text-sm text-[var(--admin-text-muted)] mt-2 max-w-md mx-auto">
            Create your first custom section to add a new category to your store with its own carousel banners, products, and filters.
          </p>
          <button
            onClick={() => setShowCreateModal(true)}
            className="mt-6 inline-flex items-center gap-2 px-6 py-3 bg-[var(--admin-primary)] hover:bg-[var(--admin-primary-hover)] text-white text-sm font-semibold rounded-full transition-colors cursor-pointer"
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
