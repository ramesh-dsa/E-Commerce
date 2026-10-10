"use client";

import React, { useState, useCallback, useRef, useEffect } from "react";
import { Crop, X, RotateCcw, ZoomIn, ZoomOut, Check } from "lucide-react";

export interface ImageCropperModalProps {
  imageSrc: string;
  title?: string;
  initialAspect?: "3/4" | "1/1";
  onCrop: (croppedBase64: string) => void;
  onClose: () => void;
}

export function ImageCropperModal({
  imageSrc,
  title = "Crop & Position Product Image",
  initialAspect = "3/4",
  onCrop,
  onClose,
}: ImageCropperModalProps) {
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
        className="bg-[#121217] border border-white/10 rounded-2xl w-full max-w-[480px] shadow-2xl flex flex-col text-white overflow-hidden animate-in fade-in zoom-in-95 duration-200"
        onPointerDown={(e) => e.stopPropagation()}
        onMouseDown={(e) => e.stopPropagation()}
        onMouseUp={(e) => e.stopPropagation()}
        onClick={(e) => e.stopPropagation()}
      >
        {/* Header */}
        <div className="relative z-10 flex items-center justify-between px-5 py-4 border-b border-white/10 bg-[#16161d]">
          <div>
            <h3 className="text-sm font-bold uppercase tracking-wider text-white flex items-center gap-2">
              <Crop size={16} className="text-[#fcd017]" />
              {title}
            </h3>
            <p className="text-[11px] text-neutral-400 mt-0.5">
              Drag image to position • Scroll or slider to zoom
            </p>
          </div>
          <button
            type="button"
            onClick={(e) => {
              e.stopPropagation();
              onClose();
            }}
            className="p-1.5 rounded-full text-neutral-400 hover:text-white hover:bg-white/10 transition-colors cursor-pointer"
            aria-label="Close cropper"
          >
            <X size={18} />
          </button>
        </div>

        {/* Viewport Workspace */}
        <div className="p-5 flex flex-col items-center bg-[#09090c]">
          {/* Architectural Segmented Tab Bar */}
          <div className="relative z-10 flex items-center gap-1.5 mb-5 bg-[#16161d] p-1.5 rounded-xl border border-white/15 backdrop-blur-sm shadow-inner">
            <button
              type="button"
              onClick={(e) => {
                e.stopPropagation();
                handleAspectChange("3/4");
              }}
              className={`px-3.5 py-1.5 text-xs font-bold uppercase tracking-wider rounded-lg transition-all cursor-pointer ${
                aspect === "3/4"
                  ? "bg-[#fcd017] text-neutral-950 font-black shadow-md shadow-[#fcd017]/25 scale-[1.02]"
                  : "text-neutral-300 hover:text-white hover:bg-white/10"
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
              className={`px-3.5 py-1.5 text-xs font-bold uppercase tracking-wider rounded-lg transition-all cursor-pointer ${
                aspect === "1/1"
                  ? "bg-[#fcd017] text-neutral-950 font-black shadow-md shadow-[#fcd017]/25 scale-[1.02]"
                  : "text-neutral-300 hover:text-white hover:bg-white/10"
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
            className={`relative overflow-hidden rounded-xl border-2 border-white/90 shadow-2xl shadow-black/90 ring-1 ring-white/20 flex items-center justify-center transition-[width,height] duration-200 select-none touch-none ${
              isDragging ? "cursor-grabbing" : "cursor-grab"
            }`}
          >
            {imageLoaded && naturalSize.width > 0 ? (
              /* eslint-disable-next-line @next/next/no-img-element */
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
              <div className="text-xs text-neutral-500 animate-pulse">Loading image...</div>
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
            <div className="absolute top-2 left-2 w-4 h-4 border-t-2 border-l-2 border-[#fcd017] pointer-events-none drop-shadow-[0_1px_2px_rgba(0,0,0,0.8)]" />
            <div className="absolute top-2 right-2 w-4 h-4 border-t-2 border-r-2 border-[#fcd017] pointer-events-none drop-shadow-[0_1px_2px_rgba(0,0,0,0.8)]" />
            <div className="absolute bottom-2 left-2 w-4 h-4 border-b-2 border-l-2 border-[#fcd017] pointer-events-none drop-shadow-[0_1px_2px_rgba(0,0,0,0.8)]" />
            <div className="absolute bottom-2 right-2 w-4 h-4 border-b-2 border-r-2 border-[#fcd017] pointer-events-none drop-shadow-[0_1px_2px_rgba(0,0,0,0.8)]" />
          </div>

          {/* Floating Dock Zoom Strip */}
          <div
            className="relative z-10 w-full max-w-[360px] mt-5 flex items-center gap-3 bg-[#16161d] border border-white/15 px-4 py-2.5 rounded-xl shadow-lg backdrop-blur-sm"
            onClick={(e) => e.stopPropagation()}
          >
            <button
              type="button"
              onClick={(e) => {
                e.stopPropagation();
                handleZoomUpdate(zoom - 0.15);
              }}
              disabled={zoom <= 1}
              className="text-neutral-300 hover:text-white disabled:opacity-30 disabled:hover:text-neutral-500 transition-all active:scale-95 cursor-pointer p-1 rounded-lg hover:bg-white/10"
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
              className="flex-1 h-1.5 bg-neutral-700/80 rounded-lg appearance-none cursor-pointer accent-[#fcd017]"
              aria-label="Zoom level"
            />

            <button
              type="button"
              onClick={(e) => {
                e.stopPropagation();
                handleZoomUpdate(zoom + 0.15);
              }}
              disabled={zoom >= 3}
              className="text-neutral-300 hover:text-white disabled:opacity-30 disabled:hover:text-neutral-500 transition-all active:scale-95 cursor-pointer p-1 rounded-lg hover:bg-white/10"
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
              className="p-1.5 rounded-lg text-neutral-300 hover:text-white hover:bg-white/10 transition-all active:scale-95 cursor-pointer"
              title="Reset Framing & Zoom"
              aria-label="Reset Framing & Zoom"
            >
              <RotateCcw size={15} />
            </button>
          </div>
        </div>

        {/* Footer Actions */}
        <div className="relative z-10 p-4 border-t border-white/10 bg-[#16161d] flex items-center gap-3" onClick={(e) => e.stopPropagation()}>
          <button
            type="button"
            onClick={(e) => {
              e.stopPropagation();
              onClose();
            }}
            className="flex-1 px-4 py-2.5 text-xs font-bold uppercase tracking-wider text-neutral-200 hover:text-white bg-white/10 hover:bg-white/15 border border-white/20 hover:border-white/30 rounded-xl transition-all active:scale-[0.98] cursor-pointer text-center shadow-sm"
          >
            Cancel
          </button>
          <button
            type="button"
            onClick={(e) => {
              e.stopPropagation();
              handleApplyCrop();
            }}
            className="flex-1 flex items-center justify-center gap-2 px-4 py-2.5 text-xs font-black uppercase tracking-wider text-neutral-950 bg-[#fcd017] hover:bg-[#ffe043] rounded-xl transition-all active:scale-[0.98] cursor-pointer shadow-lg shadow-[#fcd017]/25"
          >
            <Check size={16} className="stroke-[2.5]" />
            Apply &amp; Set Image
          </button>
        </div>
      </div>
    </div>
  );
}
