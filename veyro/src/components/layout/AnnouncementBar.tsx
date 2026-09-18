"use client";

import React from "react";

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
      className="relative z-40 w-full bg-[#fcd017] text-[#111111] select-none flex items-center overflow-hidden h-[36px]"
    >
      <div className="animate-marquee whitespace-nowrap flex items-center gap-6 text-[11px] sm:text-[11.5px] font-semibold tracking-[0.09em] uppercase py-0.5">
        {/* We duplicate the array multiple times to ensure a smooth continuous loop on ultra-wide screens */}
        {announcements.concat(announcements, announcements, announcements).map((text, idx) => (
          <React.Fragment key={idx}>
            <span className="shrink-0">{text}</span>
            <span className="text-[#111111]/35 font-normal shrink-0">|</span>
          </React.Fragment>
        ))}
      </div>
    </aside>
  );
}
