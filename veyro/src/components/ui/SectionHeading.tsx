import React from "react";
import Link from "next/link";
import { SectionHeadingProps } from "@/types";
import { ArrowRightIcon } from "./Icons";

export function SectionHeading({
  title,
  eyebrow,
  subtitle,
  actionText,
  actionHref,
  align = "left",
  className = "",
}: SectionHeadingProps) {
  const isCenter = align === "center";

  return (
    <div
      className={`flex flex-col sm:flex-row sm:items-end justify-between gap-4 mb-6 sm:mb-8 md:mb-10 ${
        isCenter ? "text-center sm:items-center" : "text-left"
      } ${className}`}
    >
      <div className={isCenter ? "mx-auto max-w-2xl" : "max-w-2xl"}>
        {eyebrow && (
          <span className="block text-[11px] sm:text-xs font-semibold tracking-wider text-veyro-muted uppercase mb-1">
            {eyebrow}
          </span>
        )}
        <h2 className="text-xl sm:text-2xl md:text-3xl font-semibold tracking-tight text-veyro-black leading-tight">
          {title}
        </h2>
        {subtitle && (
          <p className="mt-1.5 text-sm text-veyro-muted leading-relaxed font-normal">
            {subtitle}
          </p>
        )}
      </div>

      {actionText && actionHref && (
        <div className={`shrink-0 ${isCenter ? "mx-auto mt-2" : ""}`}>
          <Link
            href={actionHref}
            className="group inline-flex items-center gap-1.5 text-xs sm:text-sm font-medium text-veyro-black hover:text-veyro-muted transition-colors py-1 focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-veyro-black"
          >
            <span>{actionText}</span>
            <span className="transition-transform duration-200 group-hover:translate-x-0.5">
              <ArrowRightIcon size={15} />
            </span>
          </Link>
        </div>
      )}
    </div>
  );
}
