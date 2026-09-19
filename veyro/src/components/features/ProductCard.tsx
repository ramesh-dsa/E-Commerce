"use client";

import React, { useState } from "react";
import Image from "next/image";
import Link from "next/link";
import { ProductCardProps } from "@/types";
import { formatPrice, calculateDiscountPercentage } from "@/lib/utils";
import { HeartIcon } from "@/components/ui/Icons";
import { Badge } from "@/components/ui/Badge";

export function ProductCard({
  product,
  isWishlisted = false,
  isFeatured = false,
  theme = "light",
  aspectRatio = "aspect-[3/4]",
  onWishlistToggle,
  className = "",
}: ProductCardProps) {
  const [wishlistActive, setWishlistActive] = useState(isWishlisted);
  const [imageLoaded, setImageLoaded] = useState(false);
  const [isHovered, setIsHovered] = useState(false);

  const handleWishlistClick = (e: React.MouseEvent) => {
    e.preventDefault();
    e.stopPropagation();
    const nextState = !wishlistActive;
    setWishlistActive(nextState);
    if (onWishlistToggle) {
      onWishlistToggle(product.id);
    }
  };

  const discountPercent =
    product.originalPrice && product.originalPrice > product.price
      ? calculateDiscountPercentage(product.price, product.originalPrice)
      : null;

  const displayDiscount =
    product.discount || (discountPercent ? `${discountPercent}% OFF` : null);

  return (
    <article
      className={`group flex flex-col ${className}`}
      onMouseEnter={() => setIsHovered(true)}
      onMouseLeave={() => setIsHovered(false)}
    >
      {/* Product Image Container */}
      <div className={`relative w-full overflow-hidden rounded-[2px] transition-shadow duration-300 group-hover:shadow-md ${theme === 'dark' ? 'bg-[#1a1a1a]' : 'bg-[#f4f2ee]'} ${isFeatured ? 'h-full aspect-auto' : aspectRatio}`}>
        <Link
          href={`#`}
          className="block h-full w-full focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-veyro-black"
          aria-label={product.name}
        >
          <Image
            src={product.imageUrl}
            alt={product.name}
            fill
            quality={90}
            sizes={isFeatured ? "(max-width: 640px) 100vw, (max-width: 1024px) 66vw, 50vw" : "(max-width: 640px) 50vw, (max-width: 1024px) 33vw, 25vw"}
            onLoad={() => setImageLoaded(true)}
            onError={() => setImageLoaded(true)}
            className={`object-cover object-center transition-all duration-500 ease-out group-hover:scale-105 ${
              imageLoaded ? "opacity-100" : "opacity-90"
            }`}
          />

          {/* Secondary image on hover if provided */}
          {product.secondaryImageUrl && (
            <Image
              src={product.secondaryImageUrl}
              alt={`${product.name} alternate view`}
              fill
              quality={90}
              sizes={isFeatured ? "(max-width: 640px) 100vw, (max-width: 1024px) 66vw, 50vw" : "(max-width: 640px) 50vw, (max-width: 1024px) 33vw, 25vw"}
              className="object-cover object-center opacity-0 transition-opacity duration-300 ease-out group-hover:opacity-100"
            />
          )}
        </Link>

        {/* Product Badge */}
        {product.badge && (
          <div className="absolute top-2.5 left-2.5 pointer-events-none z-10">
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

        {/* Wishlist Button */}
        <button
          type="button"
          aria-label={wishlistActive ? "Remove from wishlist" : "Add to wishlist"}
          onClick={handleWishlistClick}
          className="absolute top-2.5 right-2.5 z-10 flex h-8 w-8 items-center justify-center rounded-full bg-white/90 text-veyro-black shadow-xs transition-colors hover:bg-white focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-veyro-black cursor-pointer"
        >
          <HeartIcon
            size={16}
            filled={wishlistActive}
            className={wishlistActive ? "text-veyro-accent" : "text-veyro-black"}
          />
        </button>

        {/* Quick Sizes Strip on Desktop Hover (Only for Featured) */}
        {isFeatured && product.sizes && product.sizes.length > 0 && (
          <div className="absolute inset-x-0 bottom-0 z-10 hidden sm:flex translate-y-full flex-col bg-white/95 px-3 py-2 backdrop-blur-xs transition-transform duration-300 ease-out group-hover:translate-y-0 border-t border-[#f0f0ed]">
            <div className="flex items-center justify-between">
              <span className="text-[10px] font-semibold uppercase tracking-wider text-veyro-muted">
                Available Sizes
              </span>
              <div className="flex items-center gap-1">
                {product.sizes.slice(0, 5).map((size) => (
                  <span
                    key={size}
                    className="flex h-5 items-center justify-center rounded bg-[#f4f2ee] px-1.5 text-[10px] font-medium text-veyro-black"
                  >
                    {size}
                  </span>
                ))}
              </div>
            </div>
          </div>
        )}
      </div>

      {/* Product Details */}
      <div className="pt-2.5 pb-1 flex flex-col flex-1">
        <div className="flex items-center justify-between gap-2">
          <span className={`text-[10px] sm:text-[11px] font-medium uppercase tracking-wider ${theme === 'dark' ? 'text-[#a3a3a3]' : 'text-veyro-muted'}`}>
            {product.subcategoryTag || product.category}
          </span>
          {product.colorHex && (
            <span
              className="h-2.5 w-2.5 rounded-full border border-black/10 shrink-0"
              style={{ backgroundColor: product.colorHex }}
              title={product.colorName}
            />
          )}
        </div>

        <h3 className={`mt-0.5 font-medium leading-snug line-clamp-1 transition-colors ${theme === 'dark' ? 'text-white group-hover:text-[#a3a3a3]' : 'text-veyro-black group-hover:text-veyro-muted'} ${isFeatured ? 'text-sm sm:text-base' : 'text-xs sm:text-sm'}`}>
          <Link href={`#`}>{product.name}</Link>
        </h3>

        {/* Pricing Hierarchy */}
        <div className="mt-1 flex items-baseline gap-1.5 sm:gap-2 flex-wrap">
          <span className={`font-semibold ${theme === 'dark' ? 'text-white' : 'text-veyro-black'} ${isFeatured ? 'text-sm sm:text-base' : 'text-xs sm:text-sm'}`}>
            {formatPrice(product.price)}
          </span>

          {product.originalPrice && product.originalPrice > product.price && (
            <span className={`text-[11px] sm:text-xs line-through ${theme === 'dark' ? 'text-[#888]' : 'text-veyro-muted'}`}>
              {formatPrice(product.originalPrice)}
            </span>
          )}

          {displayDiscount && (
            <span className="text-[11px] sm:text-xs font-medium text-veyro-accent">
              {displayDiscount}
            </span>
          )}
        </div>
      </div>
    </article>
  );
}
