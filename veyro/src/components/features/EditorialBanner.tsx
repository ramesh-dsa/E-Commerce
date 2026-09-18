import React from "react";
import Link from "next/link";
import Image from "next/image";
import { Container } from "@/components/ui/Container";
import { ArrowRightIcon } from "@/components/ui/Icons";

export function EditorialBanner() {
  return (
    <section className="w-full py-6 sm:py-10 bg-white">
      <Container>
        <div className="grid grid-cols-1 lg:grid-cols-2 gap-4 sm:gap-6">
          {/* Panel 1: Heavyweight Cotton */}
          <div className="relative aspect-[16/10] sm:aspect-[16/9] lg:aspect-[4/3] w-full overflow-hidden bg-[#111111] rounded-[2px] group">
            <Image
              src="/hero/panel-clothing.jpg"
              alt="VEYRO Heavyweight Cotton Campaign"
              fill
              className="object-cover object-center opacity-70 transition-transform duration-700 ease-out group-hover:scale-105"
            />
            <div className="absolute inset-0 bg-gradient-to-t from-black/80 via-black/30 to-transparent" />
            
            <div className="absolute inset-0 p-6 sm:p-10 flex flex-col justify-end">
              <span className="text-xs font-semibold tracking-widest text-veyro-accent uppercase mb-1">
                TEXTILE ARCHIVE
              </span>
              <h3 className="text-xl sm:text-2xl lg:text-3xl font-bold tracking-tight text-white leading-tight">
                240+ GSM HEAVYWEIGHT COMBED COTTON
              </h3>
              <p className="mt-2 text-xs sm:text-sm text-[#cccccc] max-w-md line-clamp-2">
                Engineered drop shoulders that hold structural integrity through heat and everyday movement.
              </p>
              <div className="mt-5">
                <Link
                  href="#"
                  className="inline-flex items-center gap-2 bg-white text-veyro-black px-5 py-2.5 text-xs font-semibold uppercase tracking-wider rounded-[2px] hover:bg-veyro-accent transition-colors"
                >
                  <span>Explore T-Shirts</span>
                  <ArrowRightIcon size={14} />
                </Link>
              </div>
            </div>
          </div>

          {/* Panel 2: Vulcanized Footwear */}
          <div className="relative aspect-[16/10] sm:aspect-[16/9] lg:aspect-[4/3] w-full overflow-hidden bg-[#111111] rounded-[2px] group">
            <Image
              src="/hero/panel-footwear.jpg"
              alt="VEYRO Footwear Architecture"
              fill
              className="object-cover object-center opacity-70 transition-transform duration-700 ease-out group-hover:scale-105"
            />
            <div className="absolute inset-0 bg-gradient-to-t from-black/80 via-black/30 to-transparent" />
            
            <div className="absolute inset-0 p-6 sm:p-10 flex flex-col justify-end">
              <span className="text-xs font-semibold tracking-widest text-veyro-accent uppercase mb-1">
                FOOTWEAR LAB
              </span>
              <h3 className="text-xl sm:text-2xl lg:text-3xl font-bold tracking-tight text-white leading-tight">
                VULCANIZED SNEAKERS & COURT RUNNERS
              </h3>
              <p className="mt-2 text-xs sm:text-sm text-[#cccccc] max-w-md line-clamp-2">
                High-density foam footbeds and durable vulcanized soles sculpted for Indian streetscapes.
              </p>
              <div className="mt-5">
                <Link
                  href="#"
                  className="inline-flex items-center gap-2 bg-white text-veyro-black px-5 py-2.5 text-xs font-semibold uppercase tracking-wider rounded-[2px] hover:bg-veyro-accent transition-colors"
                >
                  <span>Explore Sneakers</span>
                  <ArrowRightIcon size={14} />
                </Link>
              </div>
            </div>
          </div>
        </div>
      </Container>
    </section>
  );
}
