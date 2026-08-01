import { About } from "@/components/sections/home/about";
import { DifferentSoil } from "@/components/sections/home/different-soil";
import { Hero } from "@/components/sections/home/hero";
import { HowItWorks } from "@/components/sections/home/how-it-works";
import { Manifesto } from "@/components/sections/home/manifesto";
import { OzonCta } from "@/components/sections/home/ozon-cta";
import { PhotoBand } from "@/components/sections/home/photo-band";
import { SkuGallery } from "@/components/sections/home/sku-gallery";
import { Teasers } from "@/components/sections/home/teasers";
import { WhatsInBox } from "@/components/sections/home/whats-in-box";
import { WhatSoilGives } from "@/components/sections/home/what-soil-gives";
import { footer } from "@/content/site";

/*
 * Organization + WebSite JSON-LD — сигналы «кто за сайтом» и site name в выдаче
 * (seo-research.md ч.1 §3: обе схемы Google размещает на главной, одной страницы
 * достаточно; SearchAction не добавляем — deprecated с 11.2024). logo ≥112×112.
 */
const organizationJsonLd = {
  "@context": "https://schema.org",
  "@type": "Organization",
  name: "ЗАЗЕМЛИ",
  url: "https://zazemli.com",
  logo: "https://zazemli.com/apple-icon.png",
  email: footer.email,
  sameAs: [footer.instagramUrl, footer.telegramUrl],
};

const webSiteJsonLd = {
  "@context": "https://schema.org",
  "@type": "WebSite",
  name: "ЗАЗЕМЛИ",
  url: "https://zazemli.com",
};

/* Главная — одиннадцать блоков в порядке прототипа landing.html (spec landing-redesign) */
export default function Home() {
  return (
    <main className="flex-1">
      {/* JSON-LD в DOM для краулеров; экранируем < по рекомендации Next.js */}
      <script
        type="application/ld+json"
        dangerouslySetInnerHTML={{
          __html: JSON.stringify(organizationJsonLd).replace(/</g, "\\u003c"),
        }}
      />
      <script
        type="application/ld+json"
        dangerouslySetInnerHTML={{
          __html: JSON.stringify(webSiteJsonLd).replace(/</g, "\\u003c"),
        }}
      />
      <Hero />
      <Manifesto />
      <HowItWorks />
      <SkuGallery />
      <DifferentSoil />
      <WhatsInBox />
      <PhotoBand />
      <WhatSoilGives />
      <About />
      <Teasers />
      <OzonCta />
    </main>
  );
}
