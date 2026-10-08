"use client";

import React, { useState } from "react";
import Image from "next/image";
import Link from "next/link";
import { ProductCardProps } from "@/types";
import { formatPrice, calculateDiscountPercentage } from "@/lib/utils";
import { Badge } from "@/components/ui/Badge";
import { WishlistButton } from "@/components/ui/WishlistButton";
import { Star } from "lucide-react";
import { useReviews } from "@/context/ReviewsContext";

export function ProductCard({
  product,
  isWishlisted,
  isFeatured = false,
  theme = "light",
  aspectRatio = "aspect-[3/4]",
  onWishlistToggle,
  className = "",
}: ProductCardProps) {
  const [imageLoaded, setImageLoaded] = useState(false);
  const [isHovered, setIsHovered] = useState(false);
  
  const { getStats } = useReviews();
  const { averageRating: rating, totalCount: reviewsCount } = getStats(product.id);

  const discountPercent =
    product.originalPrice && product.originalPrice > product.price
      ? calculateDiscountPercentage(product.price, product.originalPrice)
      : null;

  const displayDiscount =
    product.discount || (discountPercent ? `${discountPercent}% OFF` : null);

  return (
    <article
      className={`group flex flex-col card-hover-lift rounded-lg ${className}`}
      onMouseEnter={() => setIsHovered(true)}
      onMouseLeave={() => setIsHovered(false)}
    >
      {/* Product Image Container */}
      <div className={`relative w-full overflow-hidden rounded-lg transition-all duration-300 group-hover:shadow-xl ${theme === 'dark' ? 'bg-[#121212] border border-white/[0.08] shadow-[0_20px_50px_-15px_rgba(0,0,0,0.9)]' : 'bg-[#f4f2ee]'} ${isFeatured ? 'aspect-[3/4] lg:h-full lg:aspect-auto' : aspectRatio}`}>
        <Link
          href={`/product/${product.slug}`}
          className="relative block h-full w-full focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-veyro-black"
          aria-label={product.name}
        >
          <Image
            src={product.imageUrl}
            alt={product.name}
            fill
            quality={80}
            unoptimized={product.imageUrl?.startsWith("data:")}
            sizes={isFeatured ? "(max-width: 640px) 100vw, (max-width: 1024px) 66vw, 50vw" : "(max-width: 640px) 50vw, (max-width: 1024px) 33vw, 25vw"}
            onLoad={() => setImageLoaded(true)}
            onError={() => setImageLoaded(true)}
            className={`object-cover object-center transition-transform duration-500 ease-out group-hover:scale-108 ${
              imageLoaded ? "opacity-100" : "opacity-90"
            }`}
          />

          {/* Secondary image on hover if provided - lazy loaded in background */}
          {product.secondaryImageUrl && (
            <Image
              src={product.secondaryImageUrl}
              alt={`${product.name} alternate view`}
              fill
              quality={80}
              loading="lazy"
              unoptimized={product.secondaryImageUrl?.startsWith("data:")}
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
        <WishlistButton
          product={product}
          isWishlisted={isWishlisted}
          onWishlistToggle={onWishlistToggle}
        />

        {/* Rating Pill */}
        {reviewsCount > 0 && (
          <div className="absolute bottom-2.5 left-2.5 pointer-events-none z-10 flex items-center gap-1 bg-white/90 backdrop-blur-md px-2 py-1 rounded-full shadow-sm border border-black/5">
            <span className="text-[10px] sm:text-xs font-bold text-veyro-black leading-none">{rating.toFixed(1)}</span>
            <Star size={10} className="fill-emerald-600 text-emerald-600" />
            <span className="text-[10px] sm:text-xs font-medium text-veyro-muted leading-none">({reviewsCount})</span>
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
          <Link href={`/product/${product.slug}`}>{product.name}</Link>
        </h3>

        {/* Pricing Hierarchy */}
        <div className="mt-1 flex items-baseline gap-1.5 sm:gap-2 flex-wrap">
          {product.originalPrice && product.originalPrice > product.price && (
            <span className={`text-[11px] sm:text-xs line-through ${theme === 'dark' ? 'text-[#888]' : 'text-veyro-muted'}`}>
              {formatPrice(product.originalPrice)}
            </span>
          )}

          <span className={`font-semibold ${theme === 'dark' ? 'text-white' : 'text-veyro-black'} ${isFeatured ? 'text-sm sm:text-base' : 'text-xs sm:text-sm'}`}>
            {formatPrice(product.price)}
          </span>

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
