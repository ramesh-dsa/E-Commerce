import React from "react";
import Link from "next/link";
import { TagPercentIcon } from "@/components/ui/Icons";

export function PromoBanner() {
  return (
    <section
      aria-label="Promotional Offer"
      className="w-full pt-1.5 pb-8 sm:pb-10 overflow-hidden select-none"
    >
      {/* Intentionally Narrower than Hero (80-84% desktop width, centered) */}
      <div className="w-[94%] sm:w-[88%] lg:w-[82%] xl:w-[80%] max-w-[1460px] mx-auto">
        <Link
          href="#"
          className="group relative flex flex-col md:flex-row w-full min-h-[92px] sm:min-h-[96px] overflow-hidden rounded-[2px] transition-transform duration-200 hover:scale-[1.002]"
        >
          {/* Left Section: Solid Black with Serrated Ticket Cutouts */}
          <div className="relative flex flex-1 items-center justify-center sm:justify-start bg-[#0b0b0b] text-white px-7 sm:px-12 lg:px-16 py-4 sm:py-5">
            {/* Left Serrated Perforated Notches */}
            <div className="hidden sm:flex absolute left-0 top-0 bottom-0 flex-col justify-between py-1 -translate-x-1.5 pointer-events-none z-10">
              {[...Array(6)].map((_, i) => (
                <span
                  key={i}
                  className="h-2.5 w-2.5 rounded-full bg-white block shadow-xs"
                />
              ))}
            </div>

            {/* Typography Content */}
            <div className="flex flex-col text-center sm:text-left">
              <span className="text-[12px] sm:text-[13px] font-bold tracking-[0.08em] uppercase text-neutral-200">
                BUY 3 CLASSIC FIT T-SHIRT
              </span>
              <div className="flex items-baseline justify-center sm:justify-start gap-1.5 mt-0.5">
                <span className="text-[24px] sm:text-[28px] lg:text-[32px] font-black tracking-tight text-white uppercase leading-tight">
                  AT ₹1199
                </span>
              </div>
            </div>
          </div>

          {/* Right Section: VEYRO Brand Yellow with Serrated Ticket Cutouts */}
          <div className="relative flex flex-1 items-center justify-center sm:justify-between bg-[#fcd017] text-[#111111] px-7 sm:px-12 lg:px-16 py-4 sm:py-5 border-t md:border-t-0 border-black/10">
            {/* Promo Heading & Subhead */}
            <div className="flex flex-col text-center sm:text-left">
              <span className="text-[19px] sm:text-[21px] lg:text-[23px] font-black tracking-tight text-[#111111] leading-tight">
                Offer auto-applies
              </span>
              <span className="text-[13px] sm:text-[14px] font-bold text-[#111111]/85 tracking-tight mt-0.5">
                at checkout
              </span>
            </div>

            {/* Stylized Red 3D Discount Tag Icon */}
            <div className="hidden sm:flex items-center shrink-0 ml-4">
              <div className="relative flex h-11 w-11 sm:h-12 sm:w-12 items-center justify-center rounded-[3px] bg-[#e53935] text-white shadow-sm rotate-12 transition-transform duration-300 group-hover:rotate-0">
                <TagPercentIcon size={22} />
              </div>
            </div>

            {/* Right Serrated Perforated Notches */}
            <div className="hidden sm:flex absolute right-0 top-0 bottom-0 flex-col justify-between py-1 translate-x-1.5 pointer-events-none z-10">
              {[...Array(6)].map((_, i) => (
                <span
                  key={i}
                  className="h-2.5 w-2.5 rounded-full bg-white block shadow-xs"
                />
              ))}
            </div>
          </div>
        </Link>
      </div>
    </section>
  );
}
