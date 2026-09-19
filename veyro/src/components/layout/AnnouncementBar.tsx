"use client";

import React from "react";

const ANNOUNCEMENTS = [
  "FREE SHIPPING ON ORDERS ABOVE ₹999",
  "EXCLUSIVE OFFERS FOR A LIMITED TIME",
  "NEW SEASON DROPS LIVE NOW",
  "EASY 7-DAY RETURNS & EXCHANGES",
];

export function AnnouncementBar() {
  // We use 4 copies to ensure it's wide enough for ultra-wide screens.
  // The key to a perfect CSS marquee using translateX(-50%) is that the 
  // first half of the content must be EXACTLY identical in width to the second half.
  // Therefore, we MUST NOT use flex `gap` on the container (which creates an uneven 
  // number of gaps), and instead use padding on the elements themselves.
  const items = [...ANNOUNCEMENTS, ...ANNOUNCEMENTS, ...ANNOUNCEMENTS, ...ANNOUNCEMENTS];

  return (
    <aside
      aria-label="Promotional announcement"
      className="relative z-40 w-full bg-[#fcd017] text-[#111111] select-none flex items-center overflow-hidden h-[36px]"
    >
      <div className="animate-marquee whitespace-nowrap flex items-center text-[11px] sm:text-[11.5px] font-semibold tracking-[0.09em] uppercase py-0.5">
        {items.map((text, idx) => (
          <React.Fragment key={idx}>
            <span className="shrink-0 px-6">{text}</span>
            <span className="text-[#111111]/35 font-normal shrink-0">|</span>
          </React.Fragment>
        ))}
      </div>
    </aside>
  );
}
