"use client";

import React, { useState, useMemo, useEffect } from "react";
import Image from "next/image";
import { Product } from "@/types";
import { Badge } from "@/components/ui/Badge";
import { ChevronLeft, ChevronRight, ZoomIn, ZoomOut, Star } from "lucide-react";
import { useReviews } from "@/context/ReviewsContext";

interface ProductGalleryProps {
  product: Product;
}

export function ProductGallery({ product }: ProductGalleryProps) {
  const [failedImages, setFailedImages] = useState<Set<string>>(new Set());

  // Collect unique valid images
  const allImages = useMemo(() => {
    const raw = [
      product.imageUrl,
      product.secondaryImageUrl,
      ...(product.galleryImages || []),
    ].filter(Boolean) as string[];

    return Array.from(new Set(raw)).filter((img) => !failedImages.has(img));
  }, [product, failedImages]);

  const [activeIndex, setActiveIndex] = useState(0);
  const [isZoomed, setIsZoomed] = useState(false);
  const [mousePosition, setMousePosition] = useState({ x: 50, y: 50 });

  const { getStats } = useReviews();
  const { averageRating: rating, totalCount: reviewsCount } = getStats(product.id);

  const activeImage = allImages[activeIndex] || product.imageUrl;

  const handleImageError = (imgUrl: string) => {
    setFailedImages((prev) => {
      const next = new Set(prev);
      next.add(imgUrl);
      return next;
    });
    if (activeIndex >= allImages.length - 1) {
      setActiveIndex(0);
    }
  };

  const handleMouseMove = (e: React.MouseEvent<HTMLDivElement>) => {
    if (!isZoomed) return;
    const rect = e.currentTarget.getBoundingClientRect();
    const x = ((e.clientX - rect.left) / rect.width) * 100;
    const y = ((e.clientY - rect.top) / rect.height) * 100;
    setMousePosition({ x, y });
  };

  const handlePrev = (e?: React.MouseEvent) => {
    if (e) e.stopPropagation();
    setIsZoomed(false);
    setActiveIndex((prev) => (prev === 0 ? allImages.length - 1 : prev - 1));
  };

  const handleNext = (e?: React.MouseEvent) => {
    if (e) e.stopPropagation();
    setIsZoomed(false);
    setActiveIndex((prev) => (prev === allImages.length - 1 ? 0 : prev + 1));
  };

  // Keyboard navigation support (Arrow keys + Esc to exit zoom)
  useEffect(() => {
    const handleKeyDown = (e: KeyboardEvent) => {
      if (e.key === "ArrowLeft") {
        handlePrev();
      } else if (e.key === "ArrowRight") {
        handleNext();
      } else if (e.key === "Escape") {
        setIsZoomed(false);
      }
    };
    window.addEventListener("keydown", handleKeyDown);
    return () => window.removeEventListener("keydown", handleKeyDown);
  }, [allImages.length]);

  return (
    <div className="w-full flex flex-col md:flex-row gap-4 select-none">
      {/* Desktop Vertical Thumbnail Rail */}
      {allImages.length > 1 && (
        <div className="hidden md:flex flex-col gap-3 w-20 shrink-0">
          {allImages.map((img, index) => {
            const isSelected = index === activeIndex;
            return (
              <button
                key={img + index}
                type="button"
                onClick={() => {
                  setIsZoomed(false);
                  setActiveIndex(index);
                }}
                aria-label={`Switch to angle ${index + 1}`}
                className={`relative w-20 h-26 rounded-lg overflow-hidden bg-[#f4f2ee] shrink-0 transition-all cursor-pointer ${
                  isSelected
                    ? "ring-2 ring-veyro-black opacity-100 scale-[1.02] shadow-xs"
                    : "opacity-60 hover:opacity-100 ring-1 ring-veyro-border"
                }`}
              >
                <Image
                  src={img}
                  alt={`${product.name} thumbnail ${index + 1}`}
                  fill
                  quality={80}
                  className="object-cover object-center"
                  sizes="80px"
                  onError={() => handleImageError(img)}
                />
              </button>
            );
          })}
        </div>
      )}

      {/* Main Studio Frame Stage */}
      <div className="flex-1 flex flex-col gap-3">
        <div
          className={`relative w-full aspect-[3/4] bg-[#f4f2ee] rounded-lg overflow-hidden border border-veyro-border transition-colors ${
            isZoomed ? "cursor-zoom-out" : "cursor-zoom-in"
          }`}
          onClick={() => setIsZoomed((prev) => !prev)}
          onMouseMove={handleMouseMove}
          onMouseLeave={() => setIsZoomed(false)}
        >
          <Image
            src={activeImage}
            alt={`${product.name} — Editorial View ${activeIndex + 1}`}
            fill
            priority
            quality={95}
            sizes="(max-width: 768px) 100vw, (max-width: 1200px) 55vw, 600px"
            className="object-cover object-center transition-transform duration-150 ease-out"
            onError={() => handleImageError(activeImage)}
            style={{
              transformOrigin: `${mousePosition.x}% ${mousePosition.y}%`,
              transform: isZoomed ? "scale(2.2)" : "scale(1)",
            }}
          />

          {/* Minimalist Merchandising Badge */}
          {product.badge && (
            <div className="absolute top-4 left-4 z-10 pointer-events-none">
              <Badge
                variant={
                  product.badge === "SALE"
                    ? "sale"
                    : product.badge === "NEW"
                    ? "dark"
                    : "default"
                }
              >
                {product.badge}
              </Badge>
            </div>
          )}

          {/* Rating Pill */}
          {reviewsCount > 0 && (
            <div className="absolute bottom-4 left-4 z-20 flex items-center gap-1 bg-white/90 backdrop-blur-md px-2.5 py-1.5 rounded-full shadow-sm border border-black/5 pointer-events-none transition-opacity duration-200">
              <span className="text-[11px] sm:text-xs font-bold text-veyro-black leading-none">{rating.toFixed(1)}</span>
              <Star size={11} className="fill-emerald-600 text-emerald-600" />
              <span className="text-[11px] sm:text-xs font-medium text-veyro-muted leading-none">({reviewsCount})</span>
            </div>
          )}

          {/* Magnification Toggle Button (Top Right) */}
          <button
            type="button"
            onClick={(e) => {
              e.stopPropagation();
              setIsZoomed((prev) => !prev);
            }}
            aria-label={isZoomed ? "Exit zoom" : "Inspect fabric texture"}
            className="absolute top-4 right-4 z-20 bg-white/90 hover:bg-white text-veyro-black border border-veyro-border px-2.5 py-1.5 rounded-[2px] shadow-xs transition-all flex items-center gap-1.5 text-[11px] font-bold uppercase tracking-wider cursor-pointer"
          >
            {isZoomed ? (
              <>
                <ZoomOut size={13} />
                <span>Exit Zoom</span>
              </>
            ) : (
              <>
                <ZoomIn size={13} />
                <span>Inspect Fabric</span>
              </>
            )}
          </button>

          {/* Navigation Arrows */}
          {allImages.length > 1 && (
            <>
              <button
                type="button"
                onClick={handlePrev}
                aria-label="Previous view"
                className="absolute left-3 top-1/2 -translate-y-1/2 w-9 h-9 rounded-full bg-white/90 hover:bg-white text-veyro-black flex items-center justify-center shadow-md transition-all z-20 cursor-pointer"
              >
                <ChevronLeft size={18} />
              </button>
              <button
                type="button"
                onClick={handleNext}
                aria-label="Next view"
                className="absolute right-3 top-1/2 -translate-y-1/2 w-9 h-9 rounded-full bg-white/90 hover:bg-white text-veyro-black flex items-center justify-center shadow-md transition-all z-20 cursor-pointer"
              >
                <ChevronRight size={18} />
              </button>
            </>
          )}
        </div>

        {/* Mobile Horizontal Thumbnail Rail */}
        {allImages.length > 1 && (
          <div className="flex md:hidden items-center gap-2.5 overflow-x-auto py-1 scrollbar-none">
            {allImages.map((img, index) => {
              const isSelected = index === activeIndex;
              return (
                <button
                  key={img + index}
                  type="button"
                  onClick={() => setActiveIndex(index)}
                  aria-label={`View angle ${index + 1}`}
                  className={`relative w-16 h-20 rounded-lg overflow-hidden bg-[#f4f2ee] shrink-0 transition-all cursor-pointer ${
                    isSelected
                      ? "ring-2 ring-veyro-black opacity-100"
                      : "opacity-60 hover:opacity-100 ring-1 ring-veyro-border"
                  }`}
                >
                  <Image
                    src={img}
                    alt={`Thumbnail ${index + 1}`}
                    fill
                    quality={75}
                    className="object-cover object-center"
                    sizes="64px"
                    onError={() => handleImageError(img)}
                  />
                </button>
              );
            })}
          </div>
        )}
      </div>
    </div>
  );
}
