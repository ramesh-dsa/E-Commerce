"use client";

import React, { useState, useEffect, useRef } from "react";
import { HeroPanel, HeroPanelData } from "./HeroPanel";

const panels: HeroPanelData[] = [
  {
    id: "footwear",
    image: "/hero/panel-footwear.webp",
    alt: "Clean slate men's retro low-top sneakers",
    href: "/shoes",
    tag: "NEW LAUNCH",
    scriptTitle: "clean slate",
    title: "SNEAKERS",
    subtitle: "Retro-inspired. Designed for now.",
    layoutStyle: "panel-footwear",
  },
  {
    id: "graphic-tee",
    image: "/hero/panel-graphic-tee.webp",
    alt: "Oversized graphic tee - Good Days Ahead",
    href: "/clothing?fit=Graphic",
    titleLines: ["GRAPHIC", "T-SHIRTS"],
    ctaText: "BUY 3 AT",
    ctaPrice: "₹1199",
    layoutStyle: "panel-clothing",
  },
  {
    id: "oversized-tees",
    image: "/hero/panel-oversized-tees-clean.webp",
    alt: "Oversized t-shirts collection",
    href: "/clothing?fit=Oversized",
    title: "OVERSIZED FIT",
    subtitle: "Maximum Comfort. Effortless Style.",
    layoutStyle: "panel-outerwear",
  },
  {
    id: "linen-shirt",
    image: "/hero/panel-linen-shirt.webp",
    alt: "Teal linen shirt",
    href: "/clothing",
    tag: "SUMMER ESSENTIAL",
    scriptTitle: "breeze easy",
    title: "LINEN SHIRTS",
    subtitle: "Lightweight and breathable.",
    layoutStyle: "panel-footwear",
  },
  {
    id: "classic-fit",
    image: "/hero/panel-classic-fit-highres.webp",
    alt: "Classic fit t-shirts",
    href: "/clothing?fit=Regular",
    titleLines: ["CLASSIC", "FIT T-SHIRTS"],
    ctaText: "BUY 3 AT",
    ctaPrice: "₹1199",
    layoutStyle: "panel-clothing",
  },
];

export function Hero() {
  const [startIndex, setStartIndex] = useState(0);
  const [isTransitioning, setIsTransitioning] = useState(false);
  const [announcedPanel, setAnnouncedPanel] = useState("");
  const [isInView, setIsInView] = useState(true);
  const sectionRef = useRef<HTMLElement>(null);

  const N = panels.length;

  // Track if hero section is in viewport to prevent wasted timers/animations
  useEffect(() => {
    const el = sectionRef.current;
    if (!el) return;
    const observer = new IntersectionObserver(
      ([entry]) => {
        setIsInView(entry.isIntersecting);
      },
      { rootMargin: "200px 0px" }
    );
    observer.observe(el);
    return () => observer.disconnect();
  }, []);

  // Track active scrolling using a timestamp (zero timer churn per scroll frame)
  const lastScrollTimeRef = useRef(0);
  useEffect(() => {
    const onScroll = () => {
      lastScrollTimeRef.current = Date.now();
    };

    window.addEventListener("scroll", onScroll, { passive: true });
    return () => {
      window.removeEventListener("scroll", onScroll);
    };
  }, []);

  // Auto-advance sliding window only when visible and not actively scrolling
  useEffect(() => {
    if (!isInView) return;

    const timer = setInterval(() => {
      // Don't interrupt user scrolling (scrolled within last 500ms)
      if (Date.now() - lastScrollTimeRef.current < 500) return;

      setIsTransitioning(true);
      setStartIndex((prev) => {
        const next = (prev + 1) % N;
        const newlyEntered = panels[(next + 2) % N];
        setAnnouncedPanel(`New arrival: ${newlyEntered.title || newlyEntered.titleLines?.[0]}`);
        return next;
      });

      setTimeout(() => {
        setIsTransitioning(false);
      }, 700);
    }, 4500);

    return () => clearInterval(timer);
  }, [isInView, N]);

  return (
    <section
      ref={sectionRef}
      aria-label="Featured Fashion Campaigns"
      className="w-full flex flex-col pt-0 pb-0 select-none h-[calc(100dvh-110px)] sm:h-[calc(100dvh-114px)] lg:h-[calc(100dvh-118px)] min-h-[460px]"
    >
      <div className="w-full flex-1 flex flex-col px-0 relative">
        {/* Visually hidden aria-live announcer for accessibility */}
        <div aria-live="polite" aria-atomic="true" className="sr-only">
          {announcedPanel}
        </div>

        {/* 
          Sliding Window Container
          Uses a CSS variable for the gap so the inline transform calc() is responsive.
        */}
        <div 
          className={`relative flex-1 w-full overflow-hidden bg-white ${isTransitioning ? 'pointer-events-none' : ''}`}
          style={{ '--panel-gap': '11px' } as React.CSSProperties}
        >
          {panels.map((panel, index) => {
            // Calculate relative position based on startIndex
            const diff = (index - startIndex + N) % N;

            // We treat the highest index (N-1) as the exiting panel on the left (-1 slot)
            const isExiting = diff === N - 1;
            
            // The jump happens when a panel moves from exiting (N-1) to far right (N-2)
            const isJumping = diff === N - 2;

            // Translate math with translate3d for 100% GPU compositor execution
            const translateX = isExiting 
              ? 'calc(-100% - var(--panel-gap))' 
              : `calc(${diff} * 100% + ${diff} * var(--panel-gap))`;

            return (
              <div
                key={panel.id}
                className="absolute top-0 left-0 h-full w-full md:w-[calc(50%-5.5px)] lg:w-[calc(33.3333%-7.3333px)]"
                style={{
                  transform: `translate3d(${translateX}, 0, 0)`,
                  opacity: isExiting ? 0 : (diff > 3 ? 0 : 1), // Fade out exiting, hide far right
                  transition: isJumping ? 'none' : 'transform 700ms ease-in-out, opacity 700ms ease-in-out',
                  willChange: isJumping ? 'auto' : 'transform, opacity',
                  backfaceVisibility: 'hidden',
                  zIndex: isExiting ? 0 : 10,
                }}
                aria-hidden={diff > 2 && !isExiting}
              >
                {/* HeroPanel automatically takes up full width/height of this wrapper */}
                <HeroPanel
                  panel={panel}
                  tabIndex={(diff > 2 && !isExiting) ? -1 : 0}
                  priority={index === 0 || index === 1}
                  fetchPriority={index === 0 ? "high" : (index === 1 ? "auto" : "low")}
                />
              </div>
            );
          })}
        </div>

        {/* Minimal Hero Pagination Indicators (centered below hero) */}
        <div className="flex-shrink-0 h-[44px] flex items-center justify-center gap-2 bg-white w-full">
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
              className="p-2 cursor-pointer group focus-visible:outline-none"
            >
              <div
                className={`transition-all duration-200 rounded-full mx-auto ${
                  startIndex === index
                    ? "w-5 h-2 bg-[#111111]"
                    : "w-2 h-2 bg-[#d1d1d1] group-hover:bg-[#999999]"
                }`}
              />
            </button>
          ))}
        </div>
      </div>
    </section>
  );
}

