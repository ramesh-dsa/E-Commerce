import React from "react";
import Image from "next/image";
import Link from "next/link";
import { ArrowUpRightIcon } from "@/components/ui/Icons";

export interface HeroPanelData {
  id: string;
  image: string;
  alt: string;
  href: string;
  titleLines?: string[];
  title?: string;
  subtitle?: string;
  tag?: string;
  scriptTitle?: string;
  ctaText?: string;
  ctaPrice?: string;
  layoutStyle: "panel-clothing" | "panel-outerwear" | "panel-footwear";
}

export interface HeroPanelProps {
  panel: HeroPanelData;
  tabIndex?: number;
  priority?: boolean;
  fetchPriority?: "high" | "low" | "auto";
}

export const HeroPanel = React.memo(function HeroPanel({
  panel,
  tabIndex,
  priority = false,
  fetchPriority,
}: HeroPanelProps) {
  return (
    <div className="group relative h-full w-full overflow-hidden bg-[#111111] select-none">
      {/* Background Campaign Image - Object cover spanning full panel */}
      <Image
        src={panel.image}
        alt={panel.alt}
        fill
        priority={priority}
        fetchPriority={fetchPriority}
        quality={80}
        sizes="(max-width: 768px) 100vw, (max-width: 1024px) 50vw, 33vw"
        className="object-cover object-center transition-transform duration-700 ease-out group-hover:scale-[1.02]"
      />

      {/* Tightly anchored bottom text gradient — keeps the top 70% crystal clear & vibrant while ensuring 100% text contrast */}
      <div className="absolute bottom-0 left-0 right-0 h-48 sm:h-56 lg:h-64 bg-gradient-to-t from-black/90 via-black/35 via-45% to-transparent pointer-events-none" />

      {/* Bottom Content Area - 20-36px bottom padding, responsive left/right */}
      <div className="absolute bottom-4 sm:bottom-6 lg:bottom-7 xl:bottom-8 left-4 sm:left-6 lg:left-7 xl:left-9 right-4 sm:right-6 lg:right-7 xl:right-9 z-10">
        {/* Panel 1 (Clothing): Left Bold Heading + Right Yellow CTA Card */}
        {panel.layoutStyle === "panel-clothing" && (
          <div className="flex items-end justify-between gap-2 sm:gap-3">
            <div className="flex flex-col">
              {panel.titleLines ? (
                panel.titleLines.map((line, i) => (
                  <h2
                    key={i}
                    className="text-[20px] sm:text-[24px] lg:text-[28px] xl:text-[34px] 2xl:text-[38px] font-black uppercase text-white leading-[0.95] tracking-tight drop-shadow-md"
                  >
                    {line}
                  </h2>
                ))
              ) : (
                <h2 className="text-[20px] sm:text-[24px] lg:text-[28px] xl:text-[34px] 2xl:text-[38px] font-black uppercase text-white leading-[0.95] tracking-tight drop-shadow-md">
                  {panel.title}
                </h2>
              )}
            </div>

            {panel.ctaPrice && (
              <div className="inline-flex items-center gap-2 sm:gap-2.5 bg-[#fcd017] text-[#111111] px-3 py-1.5 sm:px-4 sm:py-2 rounded-[3px] transition-transform duration-200 group-hover:translate-x-0.5 hover:bg-[#e5bc05] shadow-md shrink-0">
                <span className="p-0.5 bg-black/10 rounded-[2px]">
                  <ArrowUpRightIcon size={15} className="stroke-[3]" />
                </span>
                <div className="flex flex-col leading-none">
                  <span className="text-[10px] sm:text-[11px] font-black uppercase tracking-wider">
                    {panel.ctaText || "BUY 2 AT"}
                  </span>
                  <span className="text-[13px] sm:text-[15px] font-black tracking-tight mt-0.5">
                    {panel.ctaPrice}
                  </span>
                </div>
              </div>
            )}
          </div>
        )}

        {/* Panel 2 (Outerwear): Yellow Arrow Box + Title + Subtitle */}
        {panel.layoutStyle === "panel-outerwear" && (
          <div className="flex flex-col">
            <div className="flex items-center gap-2 sm:gap-3 mb-1">
              <span className="flex h-6 w-6 sm:h-8 sm:w-8 lg:h-9 lg:w-9 items-center justify-center bg-[#fcd017] text-[#111111] rounded-[3px] shrink-0 shadow-md">
                <ArrowUpRightIcon size={16} className="stroke-[3]" />
              </span>
              <h2 className="text-[22px] sm:text-[26px] lg:text-[30px] xl:text-[36px] 2xl:text-[40px] font-black uppercase text-white tracking-tight leading-none drop-shadow-md">
                {panel.title}
              </h2>
            </div>
            {panel.subtitle && (
              <p className="text-[12px] sm:text-[13.5px] lg:text-[15px] text-neutral-100 font-medium pl-8 sm:pl-11 lg:pl-12 drop-shadow-sm line-clamp-1">
                {panel.subtitle}
              </p>
            )}
          </div>
        )}

        {/* Panel 3 (Footwear/Editorial): Centered Bottom Copy with Badge & Script */}
        {panel.layoutStyle === "panel-footwear" && (
          <div className="flex flex-col items-center text-center w-full">
            {panel.tag && (
              <span className="bg-black/65 backdrop-blur-xs text-[#fcd017] text-[10px] sm:text-[11px] font-bold tracking-[0.2em] uppercase px-3 py-1 sm:px-4 sm:py-1.5 rounded-[2px] mb-1.5 shadow-sm">
                {panel.tag}
              </span>
            )}
            {panel.scriptTitle && (
              <span className="font-script text-[32px] sm:text-[38px] lg:text-[42px] xl:text-[46px] text-white tracking-normal font-normal drop-shadow-md leading-none mt-0.5">
                {panel.scriptTitle}
              </span>
            )}
            {panel.title && (
              <span className="text-white text-[11px] sm:text-[12.5px] lg:text-[14px] font-black tracking-[0.34em] uppercase mt-1 drop-shadow-sm">
                {panel.title}
              </span>
            )}
            {panel.subtitle && (
              <p className="text-[11.5px] sm:text-[13px] lg:text-[14.5px] text-neutral-200 font-medium tracking-wide drop-shadow-sm mt-1 line-clamp-1">
                {panel.subtitle}
              </p>
            )}
          </div>
        )}
      </div>

      {/* Clickable Full Panel Link Overlay */}
      <Link
        href={panel.href}
        tabIndex={tabIndex}
        className="absolute inset-0 z-20 focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-[#fcd017]"
        aria-label={`Explore ${panel.title || "collection"}`}
      />
    </div>
  );
});
