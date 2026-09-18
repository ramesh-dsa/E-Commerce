"use client";

import React, { useState, useEffect, useRef } from "react";
import { HeroPanel, HeroPanelData } from "./HeroPanel";

export function Hero() {
  const panels: HeroPanelData[] = [
    {
      id: "clothing",
      image: "/hero/panel-clothing.jpg",
      alt: "Men's relaxed joggers and track pants collection",
      href: "#",
      titleLines: ["JOGGERS AND", "TRACK PANTS"],
      ctaText: "BUY 2 AT",
      ctaPrice: "₹1699",
      layoutStyle: "panel-clothing",
    },
    {
      id: "outerwear",
      image: "/hero/panel-outerwear.jpg",
      alt: "Men's modern streetwear windcheaters",
      href: "#",
      title: "WINDCHEATERS",
      subtitle: "Your Go-To For Windy Days",
      layoutStyle: "panel-outerwear",
    },
    {
      id: "footwear",
      image: "/hero/panel-footwear.jpg",
      alt: "Clean slate men's retro low-top sneakers",
      href: "#",
      tag: "NEW LAUNCH",
      scriptTitle: "clean slate",
      title: "SNEAKERS",
      subtitle: "Retro-inspired. Designed for now.",
      layoutStyle: "panel-footwear",
    },
    {
      id: "graphic-tee",
      image: "/hero/panel-graphic-tee.jpg",
      alt: "Oversized graphic tee - Good Days Ahead",
      href: "#",
      titleLines: ["GRAPHIC", "TEES"],
      ctaText: "BUY 3 AT",
      ctaPrice: "₹1199",
      layoutStyle: "panel-clothing",
    },
    {
      id: "oversized-tees",
      image: "/hero/panel-oversized-tees.jpg",
      alt: "Oversized tees collection",
      href: "#",
      title: "OVERSIZED FIT",
      subtitle: "Maximum Comfort. Effortless Style.",
      layoutStyle: "panel-outerwear",
    },
    {
      id: "linen-shirt",
      image: "/hero/panel-linen-shirt.jpg",
      alt: "Teal linen shirt",
      href: "#",
      tag: "SUMMER ESSENTIAL",
      scriptTitle: "breeze easy",
      title: "LINEN SHIRTS",
      subtitle: "Lightweight and breathable.",
      layoutStyle: "panel-footwear",
    },
    {
      id: "classic-fit",
      image: "/hero/panel-classic-fit.jpg",
      alt: "Classic fit t-shirts",
      href: "#",
      titleLines: ["CLASSIC", "FIT TEES"],
      ctaText: "BUY 3 AT",
      ctaPrice: "₹1199",
      layoutStyle: "panel-clothing",
    },
  ];

  const [startIndex, setStartIndex] = useState(0);
  const [isTransitioning, setIsTransitioning] = useState(false);
  const [isHovered, setIsHovered] = useState(false);
  const [announcedPanel, setAnnouncedPanel] = useState("");

  const N = panels.length;

  // Auto-advance sliding window
  useEffect(() => {
    if (isHovered) return;

    const timer = setInterval(() => {
      setIsTransitioning(true);
      setStartIndex((prev) => {
        const next = (prev + 1) % N;
        // Announce the newly entered panel for screen readers (index 2 for desktop 3-visible)
        const newlyEntered = panels[(next + 2) % N];
        setAnnouncedPanel(`New arrival: ${newlyEntered.title || newlyEntered.titleLines?.[0]}`);
        return next;
      });

      // Unlock pointer events after transition duration (700ms)
      setTimeout(() => {
        setIsTransitioning(false);
      }, 700);
    }, 3000);

    return () => clearInterval(timer);
  }, [N, isHovered, panels]);

  return (
    <section
      aria-label="Featured Fashion Campaigns"
      className="w-full pt-2.5 sm:pt-3 pb-2 select-none"
    >
      <div 
        className="w-full px-0"
        onMouseEnter={() => setIsHovered(true)}
        onMouseLeave={() => setIsHovered(false)}
      >
        {/* Visually hidden aria-live announcer for accessibility */}
        <div aria-live="polite" aria-atomic="true" className="sr-only">
          {announcedPanel}
        </div>

        {/* 
          Sliding Window Container
          Uses a CSS variable for the gap so the inline transform calc() is responsive.
        */}
        <div 
          className={`relative w-full h-[560px] sm:h-[590px] lg:h-[615px] xl:h-[635px] overflow-hidden bg-white ${isTransitioning ? 'pointer-events-none' : ''}`}
          style={{ '--panel-gap': '11px' } as React.CSSProperties}
        >
          {panels.map((panel, index) => {
            // Calculate relative position based on startIndex
            // Example: if startIndex is 0, index 0 is diff=0 (slot 1), index 6 is diff=6 (exiting left)
            let diff = (index - startIndex + N) % N;

            // We treat the highest index (N-1) as the exiting panel on the left (-1 slot)
            const isExiting = diff === N - 1;
            
            // The jump happens when a panel moves from exiting (N-1) to far right (N-2)
            const isJumping = diff === N - 2;

            // Translate math: 
            // - Exiting (N-1): -100% - gap
            // - Slots 0, 1, 2, ... : (diff * 100%) + (diff * gap)
            const translateX = isExiting 
              ? 'calc(-100% - var(--panel-gap))' 
              : `calc(${diff} * 100% + ${diff} * var(--panel-gap))`;

            // Mobile gap is 0, Desktop gap is 11px. We use Tailwind classes to redefine the CSS variable conditionally if needed, 
            // but since elements are full width on mobile, translating by >0 diff pushes them offscreen anyway.
            // On mobile, elements are w-full, so gap doesn't matter for offscreen items.

            return (
              <div
                key={panel.id}
                className="absolute top-0 left-0 h-full w-full md:w-[calc(50%-5.5px)] lg:w-[calc(33.3333%-7.3333px)]"
                style={{
                  transform: `translateX(${translateX})`,
                  opacity: isExiting ? 0 : (diff > 3 ? 0 : 1), // Fade out exiting, hide far right
                  transition: isJumping ? 'none' : 'transform 700ms ease-in-out, opacity 700ms ease-in-out',
                  zIndex: isExiting ? 0 : 10,
                }}
                aria-hidden={diff > 2 && !isExiting}
              >
                {/* HeroPanel automatically takes up full width/height of this wrapper */}
                <HeroPanel panel={panel} />
              </div>
            );
          })}
        </div>

        {/* Minimal Hero Pagination Indicators (centered 10-14px below hero) */}
        <div className="flex items-center justify-center gap-2 mt-3 sm:mt-3.5 py-1">
          {panels.map((_, index) => (
            <button
              key={index}
              type="button"
              aria-label={`Go to panel ${index + 1}`}
              onClick={() => {
                setIsTransitioning(true);
                setStartIndex(index);
                setTimeout(() => setIsTransitioning(false), 700);
              }}
              className={`transition-all duration-200 rounded-full cursor-pointer ${
                startIndex === index
                  ? "w-5 h-2 bg-[#111111]"
                  : "w-2 h-2 bg-[#d1d1d1] hover:bg-[#999999]"
              }`}
            />
          ))}
        </div>
      </div>
    </section>
  );
}

