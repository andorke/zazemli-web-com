import { About } from "@/components/sections/home/about";
import { DifferentSoil } from "@/components/sections/home/different-soil";
import { Hero } from "@/components/sections/home/hero";
import { OzonCta } from "@/components/sections/home/ozon-cta";
import { SkuGallery } from "@/components/sections/home/sku-gallery";
import { Statement } from "@/components/sections/home/statement";
import { Teasers } from "@/components/sections/home/teasers";
import { WhatsInBox } from "@/components/sections/home/whats-in-box";
import { WhatSoilGives } from "@/components/sections/home/what-soil-gives";

/* Главная — порядок секций по эталону Figma 185:2 (PHASE 8 v2) */
export default function Home() {
  return (
    <main className="flex-1">
      <Hero />
      <WhatsInBox />
      <DifferentSoil />
      <WhatSoilGives />
      <SkuGallery />
      <Statement />
      <About />
      <Teasers />
      <OzonCta />
    </main>
  );
}
