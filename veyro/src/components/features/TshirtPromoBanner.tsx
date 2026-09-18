import React from "react";
import Link from "next/link";
import { TagPercentIcon } from "@/components/ui/Icons";

export function TshirtPromoBanner() {
  return (
    <section
      aria-label="Promotional Offer"
      className="w-full pt-4 pb-8 sm:pb-10 overflow-hidden select-none"
    >
      <div className="w-[94%] sm:w-[90%] lg:w-[84%] xl:w-[80%] max-w-[1300px] mx-auto filter drop-shadow-[0_8px_16px_rgba(0,0,0,0.1)]">
        <Link
          href="#"
          className="group relative flex flex-col md:flex-row w-full overflow-hidden transition-transform duration-300 hover:scale-[1.005]"
        >
          {/* LEFT SECTION (BLACK) */}
          <div
            className="relative flex-[1.4] bg-[#0c0c0c] text-white px-6 sm:px-10 lg:px-12 py-3 sm:py-4 flex flex-col justify-center overflow-hidden border-r-[2px] border-dashed border-[#1a1a1a]"
            style={{
              WebkitMaskImage:
                "radial-gradient(circle at 0px 8px, transparent 4px, black 4.5px)",
              WebkitMaskSize: "100% 16px",
              WebkitMaskPosition: "0 0",
              WebkitMaskRepeat: "repeat-y",
              maskImage:
                "radial-gradient(circle at 0px 8px, transparent 4px, black 4.5px)",
              maskSize: "100% 16px",
              maskPosition: "0 0",
              maskRepeat: "repeat-y",
            }}
          >
            {/* Watermark Background Texture */}
            <div className="absolute inset-0 flex items-center justify-center opacity-[0.025] pointer-events-none overflow-hidden mix-blend-overlay">
              <span className="text-[90px] sm:text-[130px] lg:text-[160px] font-black tracking-tighter whitespace-nowrap leading-none select-none">
                T-SHIRT T-SHIRT
              </span>
            </div>

            {/* Content */}
            <div className="relative z-10 flex flex-col items-center text-center md:items-start md:text-left">
              {/* Three diagonal slashes */}
              <div className="flex gap-1 mb-1.5">
                {[1, 2, 3].map((i) => (
                  <div
                    key={i}
                    className="w-3 h-1 bg-[#fcd017] transform -skew-x-[40deg]"
                  />
                ))}
              </div>

              {/* Text */}
              <h3 className="text-lg sm:text-xl lg:text-2xl font-black tracking-wide uppercase text-neutral-100 leading-[1.05] mb-0.5">
                BUY 3 CLASSIC FIT<br />T-SHIRT
              </h3>

              <div className="flex items-end gap-2 mt-0 mb-0">
                <span className="text-4xl sm:text-5xl lg:text-[56px] font-black tracking-tighter text-white uppercase leading-[0.95] drop-shadow-sm">
                  AT ₹1199
                </span>
              </div>

              <div className="w-12 h-[3px] bg-[#fcd017] mt-2 mb-2 rounded-full shadow-[0_0_8px_rgba(252,208,23,0.3)]" />

              <p className="text-[9px] sm:text-[10px] font-semibold tracking-[0.25em] text-neutral-400 uppercase leading-none">
                PREMIUM QUALITY <span className="mx-2 text-neutral-600">|</span> EVERYDAY STYLE
              </p>
            </div>
          </div>

          {/* RIGHT SECTION (YELLOW) */}
          <div
            className="relative flex-1 bg-[#fcd017] text-[#111111] px-6 sm:px-10 lg:px-12 py-3 sm:py-4 flex flex-col justify-center items-center md:items-start"
            style={{
              WebkitMaskImage:
                "radial-gradient(circle at 100% 8px, transparent 4px, black 4.5px)",
              WebkitMaskSize: "100% 16px",
              WebkitMaskPosition: "100% 0",
              WebkitMaskRepeat: "repeat-y",
              maskImage:
                "radial-gradient(circle at 100% 8px, transparent 4px, black 4.5px)",
              maskSize: "100% 16px",
              maskPosition: "100% 0",
              maskRepeat: "repeat-y",
            }}
          >
            <div className="relative z-10 w-full flex flex-col lg:flex-row justify-between items-center lg:items-center gap-4 lg:gap-0">
              <div className="flex flex-col items-center md:items-start text-center md:text-left">
                <span className="text-sm sm:text-[15px] font-black tracking-wide uppercase mb-1.5 opacity-90 leading-none">
                  USE CODE
                </span>

                {/* White Pill */}
                <div className="bg-white px-5 sm:px-6 py-1.5 sm:py-2 rounded-full shadow-[0_2px_8px_rgba(0,0,0,0.06)] mb-1.5 inline-flex items-center justify-center border border-white/60 transform transition-transform group-hover:scale-105">
                  <span className="text-2xl sm:text-[28px] lg:text-[32px] font-black tracking-tighter text-[#111111] leading-none">
                    TSHIRT1199
                  </span>
                </div>

                <span className="text-xs sm:text-[13px] font-bold text-[#111111]/80 tracking-tight leading-none">
                  Offer auto-applies at checkout
                </span>
              </div>

              {/* Tag Graphic */}
              <div className="hidden sm:flex flex-col items-center mt-2 lg:mt-0 lg:mr-2">
                {/* 3 little white lines bursting */}
                <div className="flex gap-1.5 mb-1 ml-4 opacity-90">
                  <div className="w-1 h-2.5 bg-white rounded-full transform -rotate-[35deg]" />
                  <div className="w-1 h-3 bg-white rounded-full -translate-y-0.5" />
                  <div className="w-1 h-2.5 bg-white rounded-full transform rotate-[35deg]" />
                </div>
                {/* Red Tag */}
                <div className="relative flex h-[48px] w-[48px] items-center justify-center rounded-[5px] bg-[#ef233c] text-white shadow-lg rotate-12 transition-transform duration-500 ease-out group-hover:rotate-0 group-hover:scale-110">
                  <span className="text-[26px] font-black mt-0.5 ml-0.5">%</span>
                  {/* Tag hole */}
                  <div className="absolute top-1.5 left-1.5 w-2 h-2 bg-[#fcd017] rounded-full border border-black/10 shadow-inner" />
                </div>
              </div>
            </div>

            {/* Little V logo bottom right */}
            <div className="absolute bottom-2.5 right-4 w-4 h-4 bg-[#111111] rounded-[3px] flex items-center justify-center shadow-md">
              <span className="text-white text-[9px] font-black tracking-tighter mt-px">V</span>
            </div>
          </div>
        </Link>
      </div>
    </section>
  );
}
