"use client";

import React, { useState, useEffect } from "react";
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
  ];

  const [currentSlide, setCurrentSlide] = useState(0);

  // Auto-advance for mobile carousel
  useEffect(() => {
    const timer = setInterval(() => {
      setCurrentSlide((prev) => (prev + 1) % panels.length);
    }, 5500);
    return () => clearInterval(timer);
  }, [panels.length]);

  return (
    <section
      aria-label="Featured Fashion Campaigns"
      className="w-full pt-2.5 sm:pt-3 pb-2 select-none"
    >
      {/* 100% Full Viewport Width Edge-to-Edge Hero Grid with zero outer margins */}
      <div className="w-full px-0">
        {/* Desktop & Tablet Multi-Panel Grid: 3 columns spanning edge-to-edge with 11px white dividers */}
        <div className="hidden md:grid md:grid-cols-2 lg:grid-cols-3 gap-2.5 lg:gap-[11px] w-full">
          {panels.map((panel, idx) => (
            <div
              key={panel.id}
              className={`${idx === 2 ? "md:hidden lg:block" : ""} w-full`}
            >
              <HeroPanel panel={panel} />
            </div>
          ))}
        </div>

        {/* Mobile Single-Panel Swipeable Carousel (< 768px) */}
        <div className="block md:hidden relative overflow-hidden w-full">
          <div
            className="flex transition-transform duration-500 ease-out"
            style={{ transform: `translateX(-${currentSlide * 100}%)` }}
          >
            {panels.map((panel) => (
              <div key={panel.id} className="min-w-full shrink-0">
                <HeroPanel panel={panel} />
              </div>
            ))}
          </div>
        </div>

        {/* Minimal Hero Pagination Indicators (centered 10-14px below hero) */}
        <div className="flex items-center justify-center gap-2 mt-3 sm:mt-3.5 py-1">
          {[0, 1, 2, 3].map((index) => (
            <button
              key={index}
              type="button"
              aria-label={`Go to panel ${index + 1}`}
              onClick={() => setCurrentSlide(index % panels.length)}
              className={`transition-all duration-200 rounded-full cursor-pointer ${
                currentSlide === index % panels.length
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
