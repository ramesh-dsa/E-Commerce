import React from "react";
import Image from "next/image";
import Link from "next/link";
import { Zap, ShieldCheck, Diamond } from "lucide-react";

export function SneakerPromoBanner() {
  return (
    <section
      aria-label="Sneaker Promotional Offer"
      className="w-full pt-10 pb-8 sm:pb-12 overflow-hidden select-none"
    >
      <div className="w-[94%] sm:w-[90%] lg:w-[84%] xl:w-[80%] max-w-[1300px] mx-auto filter drop-shadow-[0_12px_24px_rgba(0,0,0,0.15)]">
        <Link
          href="/category/footwear"
          className="group relative flex flex-col md:flex-row w-full overflow-hidden transition-transform duration-300 hover:scale-[1.005]"
        >
          {/* LEFT SECTION (BLACK) */}
          <div
            className="relative flex-[1.2] bg-[#111111] text-white px-8 sm:px-12 lg:px-16 py-8 sm:py-10 flex flex-col justify-center overflow-hidden border-r-[2px] border-dashed border-[#222222]"
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

            {/* Tiny top text */}
            <div className="absolute top-4 left-10 text-[8px] sm:text-[10px] font-bold tracking-[0.2em] text-neutral-500 uppercase leading-tight">
              SNEAKERS FOR <br /> A BRIGHTER <br /> TOMORROW
              <div className="w-6 h-[2px] bg-neutral-700 mt-1" />
            </div>

            {/* Content */}
            <div className="relative z-10 flex flex-col items-center text-center md:items-start md:text-left mt-4">
              <h3 className="text-3xl sm:text-4xl lg:text-[44px] font-black tracking-wide uppercase text-white leading-none mb-1 shadow-black drop-shadow-md">
                SNEAKER EDIT
              </h3>

              <div className="flex items-end gap-2 mt-0 mb-3">
                <span className="text-5xl sm:text-6xl lg:text-[76px] font-black tracking-tighter text-[#fcd017] uppercase leading-[0.85] drop-shadow-lg">
                  ₹500
                </span>
                <span className="text-4xl sm:text-5xl lg:text-[60px] font-black tracking-tighter text-white uppercase leading-[0.9] drop-shadow-lg">
                  OFF
                </span>
              </div>

              <p className="text-sm sm:text-lg font-light tracking-[0.4em] text-neutral-400 uppercase mb-6">
                SELECT STYLES
              </p>

              {/* Bottom Icons */}
              <div className="flex items-center gap-4 sm:gap-6 mt-2 pt-4 border-t border-white/10">
                <div className="flex items-center gap-2">
                  <div className="w-6 h-6 rounded-full border border-white/20 flex items-center justify-center">
                    <Zap size={12} className="text-white/70" />
                  </div>
                  <span className="text-[9px] sm:text-[10px] font-bold tracking-widest text-neutral-400 uppercase leading-tight">
                    TRENDING <br /> FOOTWEAR
                  </span>
                </div>
                <div className="w-px h-6 bg-white/10" />
                <div className="flex items-center gap-2">
                  <div className="w-6 h-6 rounded-full border border-white/20 flex items-center justify-center">
                    <Diamond size={12} className="text-white/70" />
                  </div>
                  <span className="text-[9px] sm:text-[10px] font-bold tracking-widest text-neutral-400 uppercase leading-tight">
                    PREMIUM <br /> QUALITY
                  </span>
                </div>
                <div className="w-px h-6 bg-white/10" />
                <div className="flex items-center gap-2">
                  <div className="w-6 h-6 rounded-full border border-white/20 flex items-center justify-center">
                    <ShieldCheck size={12} className="text-white/70" />
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
            className="relative flex-[1.4] bg-[#fcd017] text-[#111111] px-8 sm:px-12 lg:px-16 py-8 sm:py-10 flex flex-col justify-center items-start md:items-start overflow-hidden"
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
              <div className="absolute top-1/2 right-0 -translate-y-1/2 w-64 h-64 bg-white rounded-full mix-blend-overlay opacity-60" />
            </div>

            {/* Tiny text top right */}
            <div className="absolute top-4 right-10 text-[8px] sm:text-[10px] font-bold tracking-[0.2em] text-[#111111]/70 uppercase leading-tight text-right">
              WALK <br /> DIFFERENT <br /> LIVE BOLDER
              <div className="w-6 h-[2px] bg-[#111111]/30 mt-1 ml-auto" />
            </div>

            <div className="relative z-10 w-full flex flex-col justify-center">
              <span className="text-sm sm:text-base font-black tracking-[0.2em] uppercase mb-3 opacity-90 pl-1">
                USE CODE
              </span>

              {/* Black Pill */}
              <div className="bg-[#111111] px-6 sm:px-8 py-2 sm:py-3 rounded-full shadow-[0_4px_12px_rgba(0,0,0,0.15)] mb-4 inline-flex items-center justify-center transform transition-transform group-hover:scale-105 self-start">
                <span className="text-3xl sm:text-[36px] lg:text-[40px] font-black tracking-tighter text-white leading-none">
                  STEP500
                </span>
              </div>

              <span className="text-sm sm:text-[15px] font-bold text-[#111111] tracking-wide">
                Everyday comfort. Modern attitude.
              </span>
            </div>

            {/* The Floating Sneaker */}
            <div className="absolute right-[-10%] top-1/2 -translate-y-1/2 w-[65%] max-w-[320px] aspect-square pointer-events-none transform transition-transform duration-700 ease-out group-hover:scale-110 group-hover:-rotate-6 z-20 drop-shadow-2xl">
               {/* Using a shoe product image, mix-blend-multiply helps remove white background if any */}
               <Image 
                 src="/products/shoes/veyro-shoe-01-primary.webp" 
                 alt="Sneakers" 
                 fill
                 className="object-contain object-center scale-125 -rotate-12 mix-blend-multiply brightness-105 contrast-125"
               />
            </div>

            {/* Bottom Right text */}
            <div className="absolute bottom-4 right-10 text-[8px] sm:text-[9px] font-bold tracking-[0.2em] text-[#111111]/70 uppercase leading-tight text-right">
              MORE <br /> THAN <br /> SNEAKERS
              <div className="w-8 h-[2px] bg-[#111111]/30 mt-1 ml-auto" />
            </div>
          </div>
        </Link>
      </div>
    </section>
  );
}
