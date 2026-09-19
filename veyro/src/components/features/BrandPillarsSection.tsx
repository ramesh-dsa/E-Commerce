"use client";

import React from "react";
import { Container } from "@/components/ui/Container";
import Image from "next/image";

const pillars = [
  {
    id: "01",
    title: "240+ GSM HEAVYWEIGHT",
    desc: "100% long-staple Indian combed cotton. Architectural drape that retains shape wash after wash. Engineered to feel substantial on the body.",
    imageUrl: "/images/pillars/bg_heavyweight_1789752687341.webp",
  },
  {
    id: "02",
    title: "CRAFTED IN TIRUPUR",
    desc: "Direct partnerships with India's most respected artisanal garment mills. Every stitch is placed with precision by master craftsmen.",
    imageUrl: "/images/pillars/bg_crafted_1789752703669.webp",
  },
  {
    id: "03",
    title: "ZERO MIDDLEMEN",
    desc: "Pure direct-to-consumer model. We bypass traditional retail markups to bring you premium luxury-grade fabrics at honest, accessible prices.",
    imageUrl: "/images/pillars/bg_markup_1789752717214.webp",
  },
];

export function BrandPillarsSection() {
  return (
    <section className="w-full bg-[#0a0a0a] text-white">
      
      {/* Intro Hook (Normal Scroll) */}
      <div className="w-full py-24 sm:py-40 flex items-center justify-center border-b border-[#333]">
        <Container>
          <div className="max-w-3xl mx-auto text-center">
            <span className="text-xs font-mono tracking-widest text-[#999] mb-8 block uppercase">
              [ 001 ] The Standard
            </span>
            <h2 className="text-5xl sm:text-7xl lg:text-[6rem] font-bold tracking-tighter uppercase leading-[0.9]">
              Built For<br />The Archive.
            </h2>
            <p className="mt-8 text-lg sm:text-xl text-[#999] mx-auto leading-relaxed max-w-lg">
              We reject seasonal trends. Every piece is engineered with obsessive attention to fabric weight, structural drape, and minimalist utility. 
            </p>
          </div>
        </Container>
      </div>

      {/* Sticky Scroll Stack */}
      <div className="relative w-full">
        {pillars.map((pillar, index) => (
          <div 
            key={pillar.id}
            className="sticky top-0 w-full h-[100svh] flex items-center overflow-hidden"
            style={{ zIndex: index + 10 }}
          >
            {/* Full-Screen Background Image */}
            <div className="absolute inset-0 w-full h-full">
              <Image
                src={pillar.imageUrl}
                alt={pillar.title}
                fill
                priority={index === 0}
                className="object-cover"
              />
              {/* Heavy Cinematic Gradient Overlay for contrast */}
              <div className="absolute inset-0 bg-gradient-to-t from-[#0a0a0a] via-black/60 to-black/30" />
            </div>

            {/* Massive Editorial Content Overlay */}
            <Container className="relative z-20 w-full">
              <div className="max-w-4xl pt-20">
                <div className="flex items-center gap-4 sm:gap-6 mb-6 sm:mb-10">
                  <span className="text-xl sm:text-3xl font-mono tracking-widest text-white/50">
                    {pillar.id}
                  </span>
                  <div className="h-[1px] bg-white/20 flex-1 max-w-[80px]" />
                </div>
                <h3 className="text-5xl sm:text-7xl lg:text-[7rem] font-bold tracking-tighter uppercase text-white leading-[0.85] mb-6 sm:mb-10 drop-shadow-2xl break-words">
                  {pillar.title}
                </h3>
                <p className="text-lg sm:text-3xl text-white/90 font-medium leading-[1.5] max-w-2xl drop-shadow-lg">
                  {pillar.desc}
                </p>
              </div>
            </Container>
          </div>
        ))}
      </div>
    </section>
  );
}
