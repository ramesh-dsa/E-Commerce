"use client";

import React, { useState, useRef, useEffect } from "react";
import { HeartIcon } from "@/components/ui/Icons";
import { useWishlist } from "@/context/WishlistContext";
import { Product } from "@/types";

export interface WishlistButtonProps {
  product: Product;
  className?: string;
  size?: number;
  isWishlisted?: boolean;
  onWishlistToggle?: (productId: string) => void;
}

type Direction = "top" | "right" | "bottom" | "left";

/**
 * Calculates mouse entry/exit vector relative to button center.
 * -45° to 45°    -> right
 * 45° to 135°    -> bottom
 * -135° to -45°  -> top
 * else           -> left
 */
function getDirection(e: React.MouseEvent<HTMLButtonElement>): Direction {
  const rect = e.currentTarget.getBoundingClientRect();
  const x = e.clientX - (rect.left + rect.width / 2);
  const y = e.clientY - (rect.top + rect.height / 2);
  const angle = (Math.atan2(y, x) * 180) / Math.PI;

  if (angle >= -45 && angle <= 45) return "right";
  if (angle > 45 && angle < 135) return "bottom";
  if (angle >= -135 && angle < -45) return "top";
  return "left";
}

function getTransform(dir: Direction): string {
  switch (dir) {
    case "top":
      return "translate3d(0, -100%, 0)";
    case "right":
      return "translate3d(100%, 0, 0)";
    case "bottom":
      return "translate3d(0, 100%, 0)";
    case "left":
      return "translate3d(-100%, 0, 0)";
  }
}

/**
 * Luxury Direction-Aware Wishlist Button.
 *
 * 1. ZERO RACE CONDITIONS: Direct synchronous DOM reflow ensures the liquid
 *    NEVER gets stuck in a hovered state when moving mouse fast.
 * 2. AUTHENTIC LUXURY RED: Clean editorial crimson (#ea2841), eliminating all
 *    blurry artificial neon glows and fake plastic glossy spots.
 * 3. LOGICAL BEHAVIOR:
 *    - Idle: Crisp white button with black outline heart.
 *    - Hover: Liquid red flows in from the entry direction; drains out to exit direction.
 *    - Click: Spring pop, saved to wishlist with solid red state.
 */
export function WishlistButton({
  product,
  className = "",
  size = 15,
  isWishlisted: isWishlistedProp,
  onWishlistToggle,
}: WishlistButtonProps) {
  const { isInWishlist, toggleWishlist } = useWishlist();
  const isWishlisted =
    isWishlistedProp !== undefined
      ? isWishlistedProp
      : isInWishlist(product.id);

  const liquidRef = useRef<HTMLDivElement>(null);
  const isHoveredRef = useRef(false);
  const [isPulsing, setIsPulsing] = useState(false);

  // Sync liquid position when wishlist state changes
  useEffect(() => {
    const el = liquidRef.current;
    if (!el) return;

    if (isWishlisted) {
      el.style.transition = "transform 320ms cubic-bezier(0.16, 1, 0.3, 1)";
      el.style.transform = "translate3d(0, 0, 0)";
    } else if (!isHoveredRef.current) {
      el.style.transition = "transform 280ms cubic-bezier(0.16, 1, 0.3, 1)";
      el.style.transform = "translate3d(-100%, 0, 0)";
    }
  }, [isWishlisted]);

  // Synchronous Direction-Aware Enter
  const handleMouseEnter = (e: React.MouseEvent<HTMLButtonElement>) => {
    isHoveredRef.current = true;
    if (isWishlisted) return;

    const el = liquidRef.current;
    if (!el) return;

    const dir = getDirection(e);

    // 1. Immediately position offscreen at the entry side (no transition)
    el.style.transition = "none";
    el.style.transform = getTransform(dir);

    // 2. Synchronously trigger reflow
    void el.offsetHeight;

    // 3. Smoothly animate into center
    el.style.transition = "transform 320ms cubic-bezier(0.16, 1, 0.3, 1)";
    el.style.transform = "translate3d(0, 0, 0)";
  };

  // Synchronous Direction-Aware Exit
  const handleMouseLeave = (e: React.MouseEvent<HTMLButtonElement>) => {
    isHoveredRef.current = false;
    if (isWishlisted) return;

    const el = liquidRef.current;
    if (!el) return;

    const dir = getDirection(e);

    // Smoothly drain towards the departure side
    el.style.transition = "transform 280ms cubic-bezier(0.16, 1, 0.3, 1)";
    el.style.transform = getTransform(dir);
  };

  // Click Handler with Tactile Spring Pulse
  const handleClick = (e: React.MouseEvent<HTMLButtonElement>) => {
    e.preventDefault();
    e.stopPropagation();

    setIsPulsing(true);
    toggleWishlist(product);

    if (onWishlistToggle) {
      onWishlistToggle(product.id);
    }

    setTimeout(() => setIsPulsing(false), 300);
  };

  return (
    <button
      type="button"
      aria-label={isWishlisted ? "Remove from wishlist" : "Add to wishlist"}
      onClick={handleClick}
      onMouseEnter={handleMouseEnter}
      onMouseLeave={handleMouseLeave}
      className={`absolute top-2.5 right-2.5 z-20 flex h-[34px] w-[34px] items-center justify-center rounded-full bg-white shadow-[0_2px_8px_rgba(0,0,0,0.08)] hover:shadow-[0_4px_14px_rgba(0,0,0,0.14)] transition-all duration-200 select-none cursor-pointer overflow-hidden focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-[#111111] active:scale-90 ${
        isPulsing ? "scale-110" : "scale-100"
      } ${className}`}
    >
      {/* 1. Base Layer: Clean Dark Outline Heart on Crisp White Background */}
      <div className="absolute inset-0 flex items-center justify-center pointer-events-none">
        <HeartIcon
          size={size}
          filled={false}
          className="text-[#111111] transition-transform duration-200"
        />
      </div>

      {/* 2. Direction-Aware Liquid Layer: Rich Editorial Crimson with Crisp White Heart */}
      <div
        ref={liquidRef}
        className="absolute inset-0 rounded-full bg-[#ea2841] flex items-center justify-center pointer-events-none will-change-transform"
        style={{
          transform: isWishlisted ? "translate3d(0, 0, 0)" : "translate3d(-100%, 0, 0)",
        }}
      >
        <HeartIcon
          size={size}
          filled={true}
          className="text-white fill-white transition-transform duration-200"
        />
      </div>
    </button>
  );
}
