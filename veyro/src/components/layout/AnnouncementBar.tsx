"use client";

import React from "react";
import { DoubleChevronLeft, DoubleChevronRight } from "@/components/ui/Icons";

export function AnnouncementBar() {
  const announcements = [
    "FREE SHIPPING ON ORDERS ABOVE ₹999",
    "EXCLUSIVE OFFERS FOR A LIMITED TIME",
    "NEW SEASON DROPS LIVE NOW",
    "EASY 7-DAY RETURNS & EXCHANGES",
  ];

  return (
    <aside
      aria-label="Promotional announcement"
      className="relative z-40 w-full bg-[#fcd017] text-[#111111] select-none"
    >
      <div className="relative flex h-[36px] sm:h-[38px] lg:h-[40px] w-full items-center justify-between px-4 sm:px-6 lg:px-10">
        {/* Subtle Left Navigation Chevrons near viewport edge */}
        <div className="flex items-center text-[#111111] shrink-0 opacity-90">
          <DoubleChevronLeft size={13} className="stroke-[2.5]" />
        </div>

        {/* Centered Ticker Content */}
        <div className="relative flex-1 overflow-hidden px-4">
          {/* Desktop & Tablet Centered View */}
          <div className="hidden sm:flex items-center justify-center gap-6 lg:gap-8 text-[12px] lg:text-[12.5px] font-semibold tracking-[0.1em] uppercase">
            <span>FREE SHIPPING ON ORDERS ABOVE ₹999</span>
            <span className="text-[#111111]/35 font-normal select-none">|</span>
            <span>EXCLUSIVE OFFERS FOR A LIMITED TIME</span>
          </div>

          {/* Mobile Continuous Marquee */}
          <div className="flex sm:hidden items-center overflow-hidden">
            <div className="animate-marquee whitespace-nowrap flex items-center gap-6 text-[11px] font-semibold tracking-[0.09em] uppercase py-0.5">
              {announcements.concat(announcements).map((text, idx) => (
                <React.Fragment key={idx}>
                  <span className="shrink-0">{text}</span>
                  <span className="text-[#111111]/35 font-normal shrink-0">|</span>
                </React.Fragment>
              ))}
            </div>
          </div>
        </div>

        {/* Subtle Right Navigation Chevrons near viewport edge */}
        <div className="flex items-center text-[#111111] shrink-0 opacity-90">
          <DoubleChevronRight size={13} className="stroke-[2.5]" />
        </div>
      </div>
    </aside>
  );
}
