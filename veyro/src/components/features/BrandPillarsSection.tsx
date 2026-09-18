import React from "react";
import { Container } from "@/components/ui/Container";

export function BrandPillarsSection() {
  const pillars = [
    {
      num: "01",
      title: "240+ GSM HEAVYWEIGHT",
      desc: "100% long-staple Indian combed cotton. Architectural drape that retains shape wash after wash.",
    },
    {
      num: "02",
      title: "CRAFTED IN TIRUPUR & AGRA",
      desc: "Direct partnerships with India's most respected artisanal garment mills & heritage shoemakers.",
    },
    {
      num: "03",
      title: "ZERO MIDDLEMEN MARKUP",
      desc: "Pure direct-to-consumer model. Premium luxury-grade fabrics at honest, accessible prices.",
    },
    {
      num: "04",
      title: "7-DAY DOORSTEP EXCHANGES",
      desc: "Effortless size swaps and returns across 25,000+ pin codes throughout India.",
    },
  ];

  return (
    <section className="w-full py-12 sm:py-16 bg-[#faf9f6] border-y border-[#ede9e3]">
      <Container>
        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-6 lg:gap-8">
          {pillars.map((p) => (
            <div
              key={p.num}
              className="flex flex-col p-6 bg-white border border-[#e8e4dc] rounded-[2px] hover:border-veyro-black/30 transition-all duration-200"
            >
              <div className="flex items-center justify-between mb-3">
                <span className="text-xs font-mono font-bold tracking-widest text-veyro-accent bg-black px-2 py-0.5 rounded-[1px]">
                  {p.num}
                </span>
                <span className="h-1.5 w-1.5 rounded-full bg-veyro-accent" />
              </div>
              <h3 className="text-sm font-semibold tracking-tight text-veyro-black uppercase">
                {p.title}
              </h3>
              <p className="mt-2 text-xs text-[#666666] leading-relaxed font-normal">
                {p.desc}
              </p>
            </div>
          ))}
        </div>
      </Container>
    </section>
  );
}
