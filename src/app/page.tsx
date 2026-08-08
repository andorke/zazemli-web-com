import { About } from "@/components/sections/home/about";
import { Buy } from "@/components/sections/home/buy";
import { Hero } from "@/components/sections/home/hero";
import { HowItWorks } from "@/components/sections/home/how-it-works";
import { PhotoBand } from "@/components/sections/home/photo-band";
import { SkuGallery } from "@/components/sections/home/sku-gallery";
import { Teasers } from "@/components/sections/home/teasers";
import { WhatsInBox } from "@/components/sections/home/whats-in-box";
import { WhatSoilGives } from "@/components/sections/home/what-soil-gives";
import { JsonLd } from "@/components/site/json-ld";

/*
 * WebSite JSON-LD — site name в выдаче (seo-research.md ч.1 §3: схему Google
 * читает с главной, одной страницы достаточно; SearchAction не добавляем —
 * deprecated с 11.2024). Organization живёт в layout: он про сайт целиком.
 */
const webSiteJsonLd = {
  "@context": "https://schema.org",
  "@type": "WebSite",
  name: "ЗАЗЕМЛИ",
  url: "https://zazemli.com",
};

/*
 * Главная — девять блоков в порядке канона home.md v2.5 / прототипа landing.html
 * (spec home-restructure). Порядок не переставлять: «Что в боксе» — первый
 * смысловой блок под hero (FIX-13). Секции-манифеста и блока колб здесь нет:
 * лид манифеста живёт в «Как это работает», трио колб — на входе /lab (FIX-78).
 */
export default function Home() {
  return (
    <main className="flex-1">
      <JsonLd data={webSiteJsonLd} />
      <Hero />
      <WhatsInBox />
      <SkuGallery />
      <HowItWorks />
      <PhotoBand />
      <WhatSoilGives />
      <About />
      <Teasers />
      <Buy />
    </main>
  );
}
