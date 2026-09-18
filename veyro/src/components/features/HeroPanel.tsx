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

export function HeroPanel({ panel }: { panel: HeroPanelData }) {
  return (
    <div className="group relative h-[560px] sm:h-[590px] lg:h-[615px] xl:h-[635px] w-full overflow-hidden bg-[#111111] select-none">
      {/* Background Campaign Image - Object cover spanning full panel */}
      <Image
        src={panel.image}
        alt={panel.alt}
        fill
        priority
        sizes="(max-width: 768px) 100vw, 33vw"
        unoptimized
        className="object-cover object-center transition-transform duration-700 ease-out group-hover:scale-[1.02]"
      />

      {/* Subtle bottom gradient overlay for high contrast text readability */}
      <div className="absolute inset-0 bg-gradient-to-t from-black/85 via-black/25 to-transparent pointer-events-none" />

      {/* Panel 3 (Footwear): Top Centered Editorial Badge & Script Title */}
      {panel.layoutStyle === "panel-footwear" && (
        <div className="absolute top-8 sm:top-9 left-0 right-0 flex flex-col items-center text-center z-10 px-6 pointer-events-none">
          {panel.tag && (
            <span className="bg-black/65 backdrop-blur-xs text-[#fcd017] text-[11px] font-bold tracking-[0.2em] uppercase px-4 py-1.5 rounded-[2px] mb-2 shadow-sm">
              {panel.tag}
            </span>
          )}
          {panel.scriptTitle && (
            <span className="font-script text-[40px] sm:text-[46px] lg:text-[48px] text-white tracking-normal font-normal drop-shadow-md leading-none mt-1">
              {panel.scriptTitle}
            </span>
          )}
          <span className="text-white text-[13px] sm:text-[14px] font-black tracking-[0.34em] uppercase mt-1.5 drop-shadow-sm">
            {panel.title}
          </span>
        </div>
      )}

      {/* Bottom Content Area - 32-42px bottom, 28-44px left/right */}
      <div className="absolute bottom-7 sm:bottom-8 lg:bottom-9 left-6 sm:left-8 lg:left-9 xl:left-11 right-6 sm:right-8 lg:right-9 xl:right-11 z-10">
        {/* Panel 1 (Clothing): Left Bold Heading + Right Yellow CTA Card */}
        {panel.layoutStyle === "panel-clothing" && (
          <div className="flex items-end justify-between gap-3">
            <div className="flex flex-col">
              {panel.titleLines ? (
                panel.titleLines.map((line, i) => (
                  <h2
                    key={i}
                    className="text-[26px] sm:text-[30px] lg:text-[34px] xl:text-[38px] font-black uppercase text-white leading-[0.95] tracking-tight drop-shadow-md"
                  >
                    {line}
                  </h2>
                ))
              ) : (
                <h2 className="text-[26px] sm:text-[30px] lg:text-[34px] xl:text-[38px] font-black uppercase text-white leading-[0.95] tracking-tight drop-shadow-md">
                  {panel.title}
                </h2>
              )}
            </div>

            {panel.ctaPrice && (
              <div className="inline-flex items-center gap-2.5 bg-[#fcd017] text-[#111111] px-4 py-2.5 rounded-[3px] transition-transform duration-200 group-hover:translate-x-0.5 hover:bg-[#e5bc05] shadow-md shrink-0">
                <span className="p-0.5 bg-black/10 rounded-[2px]">
                  <ArrowUpRightIcon size={16} className="stroke-[3]" />
                </span>
                <div className="flex flex-col leading-none">
                  <span className="text-[11px] font-black uppercase tracking-wider">
                    {panel.ctaText || "BUY 2 AT"}
                  </span>
                  <span className="text-[15px] sm:text-[16px] font-black tracking-tight mt-0.5">
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
            <div className="flex items-center gap-3 mb-1.5">
              <span className="flex h-8 w-8 sm:h-9 sm:w-9 items-center justify-center bg-[#fcd017] text-[#111111] rounded-[3px] shrink-0 shadow-md">
                <ArrowUpRightIcon size={18} className="stroke-[3]" />
              </span>
              <h2 className="text-[30px] sm:text-[34px] lg:text-[38px] xl:text-[42px] font-black uppercase text-white tracking-tight leading-none drop-shadow-md">
                {panel.title}
              </h2>
            </div>
            {panel.subtitle && (
              <p className="text-[14px] sm:text-[15.5px] text-neutral-100 font-medium pl-11 sm:pl-12 drop-shadow-sm">
                {panel.subtitle}
              </p>
            )}
          </div>
        )}

        {/* Panel 3 (Footwear): Centered Bottom Copy */}
        {panel.layoutStyle === "panel-footwear" && panel.subtitle && (
          <div className="text-center">
            <p className="text-[13.5px] sm:text-[15px] text-neutral-200 font-medium tracking-wide drop-shadow-sm">
              {panel.subtitle}
            </p>
          </div>
        )}
      </div>

      {/* Clickable Full Panel Link Overlay */}
      <Link
        href={panel.href}
        className="absolute inset-0 z-20 focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-[#fcd017]"
        aria-label={`Explore ${panel.title || "collection"}`}
      />
    </div>
  );
}
