"use client";

import React from "react";
import { useRouter } from "next/navigation";
import { ArrowLeft } from "lucide-react";

interface ProductBackButtonProps {
  backHref: string;
  backLabel: string;
}

export function ProductBackButton({
  backHref,
  backLabel,
}: ProductBackButtonProps) {
  const router = useRouter();

  const handleClick = (e: React.MouseEvent<HTMLAnchorElement>) => {
    e.preventDefault();
    if (typeof window !== "undefined") {
      // Mark navigation intent as 'back' so SmoothScrolling restores previous scroll
      sessionStorage.setItem("veyro_is_back_nav", "true");

      const lastCatalog = sessionStorage.getItem("veyro_last_catalog");
      // If user navigated from this catalog, router.back() cleanly preserves history
      if (window.history.length > 1 && (lastCatalog === backHref || !lastCatalog)) {
        router.back();
      } else {
        router.push(backHref);
      }
    }
  };

  return (
    <a
      href={backHref}
      onClick={handleClick}
      className="inline-flex items-center gap-2 text-veyro-muted hover:text-veyro-black transition-colors font-bold group cursor-pointer select-none"
      aria-label={backLabel}
    >
      <ArrowLeft
        size={14}
        className="transition-transform duration-200 group-hover:-translate-x-1"
      />
      <span>{backLabel}</span>
    </a>
  );
}
