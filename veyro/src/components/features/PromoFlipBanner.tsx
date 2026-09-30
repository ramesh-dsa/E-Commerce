"use client";

import React, { useState, useEffect } from "react";
import Link from "next/link";
import Image from "next/image";
import { Zap, ShieldCheck, Diamond } from "lucide-react";

export function PromoFlipBanner() {
  const [isFlipped, setIsFlipped] = useState(true);
  const [isPaused, setIsPaused] = useState(false);

  useEffect(() => {
    if (isPaused) return;
    const interval = setInterval(() => {
      setIsFlipped((prev) => !prev);
    }, 5000);
    return () => clearInterval(interval);
  }, [isPaused]);

  return (
    <section
      aria-label="Promotional Offers"
      className="w-full pt-6 pb-6 sm:pb-8 overflow-x-clip select-none"
      onMouseEnter={() => setIsPaused(true)}
      onMouseLeave={() => setIsPaused(false)}
      onFocusCapture={() => setIsPaused(true)}
      onBlurCapture={() => setIsPaused(false)}
    >
      {/* Aligned Header Row with Context & Switch */}
      <div className="w-[94%] sm:w-[90%] lg:w-[84%] xl:w-[80%] max-w-[1300px] mx-auto mb-3 flex items-center justify-between px-1">
        <span className="text-[10px] sm:text-[11px] font-mono tracking-widest text-[#888] uppercase">
          EXCLUSIVE OFFERS
        </span>
        <button 
          role="switch"
          aria-checked={isFlipped}
          className="flex items-center gap-2.5 cursor-pointer group focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-veyro-black rounded-sm px-1 py-0.5" 
          onClick={() => setIsFlipped(!isFlipped)}
        >
          <span className={`text-[10px] font-bold tracking-widest uppercase transition-colors duration-300 ${!isFlipped ? "text-veyro-black" : "text-neutral-400"}`}>
            T-Shirts
          </span>
          <div className="relative w-9 h-[18px] bg-neutral-200 rounded-full overflow-hidden flex items-center p-0.5">
            <div className={`w-3 h-3 bg-veyro-black rounded-full shadow-xs transform transition-transform duration-300 ease-out ${isFlipped ? "translate-x-4" : "translate-x-0"}`} />
          </div>
          <span className={`text-[10px] font-bold tracking-widest uppercase transition-colors duration-300 ${isFlipped ? "text-veyro-black" : "text-neutral-400"}`}>
            Sneakers
          </span>
        </button>
      </div>

      <div className="w-[94%] sm:w-[90%] lg:w-[84%] xl:w-[80%] max-w-[1300px] mx-auto relative" style={{ perspective: "2000px" }}>
        {/* 3D Flip Container */}
        <div 
          className="relative w-full grid transition-transform duration-700 ease-[cubic-bezier(0.4,0,0.2,1)]"
          style={{ 
            transformStyle: "preserve-3d",
            willChange: "transform",
            transform: isFlipped ? "rotateX(180deg)" : "rotateX(0deg)"
          }}
        >
          
          {/* FRONT FACE: T-SHIRT BANNER */}
          <div 
            className={`group col-start-1 row-start-1 w-full h-full ${isFlipped ? "pointer-events-none" : "pointer-events-auto"}`}
            style={{ backfaceVisibility: "hidden" }}
            aria-hidden={isFlipped}
          >
            <div className="w-full h-full drop-shadow-[0_12px_24px_rgba(0,0,0,0.15)]">
              <Link
                href="/clothing"
                tabIndex={isFlipped ? -1 : 0}
                className="relative flex flex-col md:flex-row w-full h-full rounded-md overflow-hidden transition-transform duration-300 group-hover:scale-[1.005]"
              >
              {/* LEFT SECTION (BLACK) */}
              <div
                className="relative flex-[1.2] bg-[#111111] text-white px-6 sm:px-10 lg:px-14 py-5 flex flex-col justify-center overflow-hidden border-r-[2px] border-dashed border-[#222222]"
                style={{
                  WebkitMaskImage:
                    "radial-gradient(circle 24px at 0% 50%, transparent 24px, black 25px)",
                  WebkitMaskPosition: "0 0",
                  maskImage:
                    "radial-gradient(circle 24px at 0% 50%, transparent 24px, black 25px)",
                  maskPosition: "0 0",
                }}
              >
                {/* Dark gritty texture / background */}
                <div className="absolute inset-0 opacity-10 pointer-events-none">
                  <div className="w-full h-full bg-[repeating-linear-gradient(45deg,transparent,transparent_10px,#fff_10px,#fff_20px)]" />
                  <div className="absolute inset-0 bg-gradient-to-r from-black via-transparent to-black" />
                </div>

                {/* Content */}
                <div className="relative z-10 flex flex-col items-center text-center md:items-start md:text-left mt-2">
                  <h3 className="text-2xl sm:text-3xl lg:text-[32px] font-black tracking-wide uppercase text-white leading-none mb-1 shadow-black drop-shadow-md">
                    T-SHIRT EDIT
                  </h3>

                  <div className="flex items-end gap-2 mt-0 mb-2">
                    <span className="text-3xl sm:text-4xl lg:text-[44px] font-black tracking-tighter text-[#fcd017] uppercase leading-[0.9] drop-shadow-lg">
                      BUY 3 AT
                    </span>
                    <span className="text-4xl sm:text-5xl lg:text-[56px] font-black tracking-tighter text-white uppercase leading-[0.85] drop-shadow-lg">
                      ₹1199
                    </span>
                  </div>

                  <p className="text-xs sm:text-sm font-light tracking-[0.4em] text-neutral-400 uppercase mb-4">
                    CLASSIC FIT T-SHIRTS
                  </p>

                  {/* Bottom Icons */}
                  <div className="flex items-center gap-3 sm:gap-5 mt-1 pt-3 border-t border-white/10">
                    <div className="flex items-center gap-2">
                      <div className="w-5 h-5 rounded-full border border-white/20 flex items-center justify-center">
                        <Diamond size={10} className="text-white/70" />
                      </div>
                      <span className="text-[9px] sm:text-[10px] font-bold tracking-widest text-neutral-400 uppercase leading-tight">
                        PREMIUM <br /> COTTON
                      </span>
                    </div>
                    <div className="w-px h-6 bg-white/10" />
                    <div className="flex items-center gap-2">
                      <div className="w-5 h-5 rounded-full border border-white/20 flex items-center justify-center">
                        <Zap size={10} className="text-white/70" />
                      </div>
                      <span className="text-[9px] sm:text-[10px] font-bold tracking-widest text-neutral-400 uppercase leading-tight">
                        RELAXED <br /> FIT
                      </span>
                    </div>
                    <div className="w-px h-5 bg-white/10" />
                    <div className="flex items-center gap-2">
                      <div className="w-5 h-5 rounded-full border border-white/20 flex items-center justify-center">
                        <ShieldCheck size={10} className="text-white/70" />
                      </div>
                      <span className="text-[9px] sm:text-[10px] font-bold tracking-widest text-neutral-400 uppercase leading-tight">
                        EVERYDAY <br /> STYLE
                      </span>
                    </div>
                  </div>
                </div>
              </div>

              {/* RIGHT SECTION (YELLOW) */}
              <div
                className="relative flex-[1.4] bg-[#fcd017] text-[#111111] px-6 sm:px-10 lg:px-14 py-5 flex flex-col justify-center items-start md:items-start overflow-hidden"
                style={{
                  WebkitMaskImage:
                    "radial-gradient(circle 24px at 100% 50%, transparent 24px, black 25px)",
                  WebkitMaskPosition: "100% 0",
                  maskImage:
                    "radial-gradient(circle 24px at 100% 50%, transparent 24px, black 25px)",
                  maskPosition: "100% 0",
                }}
              >
                {/* Background Graphic Elements for Yellow Side */}
                <div className="absolute right-0 top-0 bottom-0 w-[50%] pointer-events-none opacity-20">
                  <div className="absolute top-1/2 left-1/2 -translate-x-1/2 -translate-y-1/2 w-48 h-48 rounded-full border-4 border-black border-dashed opacity-30" />
                  <div className="absolute top-1/2 right-0 -translate-y-1/2 w-64 h-64 bg-white/25 rounded-full opacity-60" />
                </div>

                <div className="relative z-10 w-full flex flex-col justify-center">
                  <span className="text-xs sm:text-sm font-black tracking-[0.2em] uppercase mb-2 opacity-90 pl-1">
                    USE CODE
                  </span>

                  {/* White Pill */}
                  <div className="bg-white px-5 sm:px-6 py-1.5 sm:py-2 rounded-full shadow-[0_4px_12px_rgba(0,0,0,0.15)] mb-3 inline-flex items-center justify-center transform transition-transform group-hover:scale-105 self-start border border-white/60">
                    <span className="text-2xl sm:text-[28px] lg:text-[32px] font-black tracking-tighter text-[#111111] leading-none">
                      TSHIRT1199
                    </span>
                  </div>

                  <span className="text-[11px] sm:text-[13px] font-bold text-[#111111] tracking-wide">
                    Offer auto-applies at checkout
                  </span>
                </div>
              </div>
              </Link>
            </div>

            {/* The Floating T-Shirt (OUTSIDE MASK & LINK) */}
            <div className="absolute right-[-2%] sm:right-[-4%] md:right-[2%] top-1/2 -translate-y-[60%] w-[60%] sm:w-[50%] md:w-[40%] max-w-[320px] aspect-square pointer-events-none transform transition-transform duration-700 ease-out group-hover:scale-105 group-hover:-rotate-6 z-20 drop-shadow-2xl">
              <Image 
                src="/products/tshirts/premium_floating_tshirt_cropped.webp" 
                alt="Premium Classic Fit T-Shirt" 
                fill
                quality={80}
                sizes="(max-width: 640px) 260px, 320px"
                className="object-contain object-center scale-[1.25] rotate-[-5deg]"
              />
            </div>
          </div>

          {/* BACK FACE: SNEAKER BANNER */}
          <div 
            className="group col-start-1 row-start-1 w-full h-full"
            style={{ 
              backfaceVisibility: "hidden",
              transform: "rotateX(180deg)",
              pointerEvents: isFlipped ? "auto" : "none"
            }}
            aria-hidden={!isFlipped}
          >
            <div className="w-full h-full drop-shadow-[0_12px_24px_rgba(0,0,0,0.15)]">
              <Link
                href="/shoes"
                tabIndex={!isFlipped ? -1 : 0}
                className="relative flex flex-col md:flex-row w-full h-full rounded-md overflow-hidden transition-transform duration-300 group-hover:scale-[1.005]"
              >
              {/* LEFT SECTION (BLACK) */}
              <div
                className="relative flex-[1.2] bg-[#111111] text-white px-6 sm:px-10 lg:px-14 py-5 flex flex-col justify-center overflow-hidden border-r-[2px] border-dashed border-[#222222]"
                style={{
                  WebkitMaskImage:
                    "radial-gradient(circle 24px at 0% 50%, transparent 24px, black 25px)",
                  WebkitMaskPosition: "0 0",
                  maskImage:
                    "radial-gradient(circle 24px at 0% 50%, transparent 24px, black 25px)",
                  maskPosition: "0 0",
                }}
              >
                {/* Dark gritty texture / background */}
                <div className="absolute inset-0 opacity-10 pointer-events-none">
                  <div className="w-full h-full bg-[repeating-linear-gradient(45deg,transparent,transparent_10px,#fff_10px,#fff_20px)]" />
                  <div className="absolute inset-0 bg-gradient-to-r from-black via-transparent to-black" />
                </div>

                {/* Content */}
                <div className="relative z-10 flex flex-col items-center text-center md:items-start md:text-left mt-2">
                  <h3 className="text-2xl sm:text-3xl lg:text-[32px] font-black tracking-wide uppercase text-white leading-none mb-1 shadow-black drop-shadow-md">
                    SNEAKER EDIT
                  </h3>

                  <div className="flex items-end gap-2 mt-0 mb-2">
                    <span className="text-4xl sm:text-5xl lg:text-[56px] font-black tracking-tighter text-[#fcd017] uppercase leading-[0.85] drop-shadow-lg">
                      ₹500
                    </span>
                    <span className="text-3xl sm:text-4xl lg:text-[44px] font-black tracking-tighter text-white uppercase leading-[0.9] drop-shadow-lg">
                      OFF
                    </span>
                  </div>

                  <p className="text-xs sm:text-sm font-light tracking-[0.4em] text-neutral-400 uppercase mb-4">
                    SELECT STYLES
                  </p>

                  {/* Bottom Icons */}
                  <div className="flex items-center gap-3 sm:gap-5 mt-1 pt-3 border-t border-white/10">
                    <div className="flex items-center gap-2">
                      <div className="w-5 h-5 rounded-full border border-white/20 flex items-center justify-center">
                        <Zap size={10} className="text-white/70" />
                      </div>
                      <span className="text-[9px] sm:text-[10px] font-bold tracking-widest text-neutral-400 uppercase leading-tight">
                        TRENDING <br /> FOOTWEAR
                      </span>
                    </div>
                    <div className="w-px h-6 bg-white/10" />
                    <div className="flex items-center gap-2">
                      <div className="w-5 h-5 rounded-full border border-white/20 flex items-center justify-center">
                        <Diamond size={10} className="text-white/70" />
                      </div>
                      <span className="text-[9px] sm:text-[10px] font-bold tracking-widest text-neutral-400 uppercase leading-tight">
                        PREMIUM <br /> QUALITY
                      </span>
                    </div>
                    <div className="w-px h-5 bg-white/10" />
                    <div className="flex items-center gap-2">
                      <div className="w-5 h-5 rounded-full border border-white/20 flex items-center justify-center">
                        <ShieldCheck size={10} className="text-white/70" />
                      </div>
                      <span className="text-[9px] sm:text-[10px] font-bold tracking-widest text-neutral-400 uppercase leading-tight">
                        MADE FOR <br /> EVERYDAY
                      </span>
                    </div>
                  </div>
                </div>
              </div>

              {/* RIGHT SECTION (YELLOW) */}
              <div
                className="relative flex-[1.4] bg-[#fcd017] text-[#111111] px-6 sm:px-10 lg:px-14 py-5 flex flex-col justify-center items-start md:items-start overflow-hidden"
                style={{
                  WebkitMaskImage:
                    "radial-gradient(circle 24px at 100% 50%, transparent 24px, black 25px)",
                  WebkitMaskPosition: "100% 0",
                  maskImage:
                    "radial-gradient(circle 24px at 100% 50%, transparent 24px, black 25px)",
                  maskPosition: "100% 0",
                }}
              >
                {/* Background Graphic Elements removed */}

                <div className="relative z-10 w-full flex flex-col justify-center">
                  <span className="text-xs sm:text-sm font-black tracking-[0.2em] uppercase mb-2 opacity-90 pl-1">
                    USE CODE
                  </span>

                  {/* Black Pill */}
                  <div className="bg-[#111111] px-5 sm:px-6 py-1.5 sm:py-2 rounded-full shadow-[0_4px_12px_rgba(0,0,0,0.15)] mb-3 inline-flex items-center justify-center transform transition-transform group-hover:scale-105 self-start">
                    <span className="text-2xl sm:text-[28px] lg:text-[32px] font-black tracking-tighter text-white leading-none">
                      STEP500
                    </span>
                  </div>

                  <span className="text-[11px] sm:text-[13px] font-bold text-[#111111] tracking-wide">
                    Everyday comfort. Modern attitude.
                  </span>
                </div>
              </div>
              </Link>
            </div>

            {/* The Floating Sneaker Composition (OUTSIDE MASK & LINK) */}
            <div className="absolute right-[-2%] sm:right-[-4%] md:right-[2%] top-1/2 -translate-y-1/2 w-[60%] sm:w-[50%] md:w-[40%] max-w-[320px] aspect-square pointer-events-none transform transition-transform duration-700 ease-out group-hover:scale-110 group-hover:-rotate-6 z-20">

              {/* Foreground Crisp Sneaker */}
              <div className="absolute inset-0 z-10 drop-shadow-2xl">
                <Image
                  src="/products/shoes/premium_floating_sneaker_v4.webp"
                  alt="Veyro Premium Collection - Chunky White and Yellow Sneaker" 
                  fill
                  quality={80}
                  sizes="(max-width: 640px) 260px, 320px"
                  className="object-contain object-center scale-105 rotate-[-5deg]"
                />
              </div>
            </div>
          </div>
          
        </div>
      </div>
    </section>
  );
}
