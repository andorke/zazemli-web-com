import type { Metadata } from "next";
import { notFound } from "next/navigation";

import { Buybar } from "@/components/sections/product/buybar";
import { Care } from "@/components/sections/product/care";
import { Composition } from "@/components/sections/product/composition";
import { FounderQuote } from "@/components/sections/product/founder-quote";
import { ProductHero } from "@/components/sections/product/hero";
import { Ritual } from "@/components/sections/product/ritual";
import { WhatsInBox } from "@/components/sections/product/whats-in-box";
import { WhySoil } from "@/components/sections/product/why-soil";
import { JsonLd } from "@/components/site/json-ld";
import { skus } from "@/content/sku";
import { openGraphFor } from "@/lib/metadata";
import { buildOzonUrl } from "@/lib/utm";

/* Static export: 7 товарных страниц из skus; неизвестный slug → 404 (design-решение 1) */
export const dynamicParams = false;

export function generateStaticParams() {
  return skus.map((sku) => ({ slug: sku.slug }));
}

type Params = { params: Promise<{ slug: string }> };

/* Первая буква с заглавной: nameRu хранится строчным («монстера») */
function cap(word: string): string {
  return word.charAt(0).toUpperCase() + word.slice(1);
}

/*
 * Meta-content товарных страниц: собран из фактических данных SKU (name/latin/tagline/
 * volumes/priceFrom) — утверждённой Meta-content копи для /collectio/[slug] в репозитории
 * нет; точная формулировка — вопрос Насте.
 */
export async function generateMetadata({ params }: Params): Promise<Metadata> {
  const { slug } = await params;
  const sku = skus.find((s) => s.slug === slug);
  if (!sku) return {};
  return {
    title: { absolute: `${cap(sku.nameRu)} · грунт под пересадку · ЗАЗЕМЛИ` },
    description: `${cap(sku.nameRu)} (${sku.latin}) — ${sku.tagline}. Объёмы ${sku.volumes}, ${sku.priceFrom}.`,
    alternates: { canonical: `/collectio/${sku.slug}` },
    openGraph: openGraphFor(`/collectio/${sku.slug}`),
  };
}

/* «2 190 ₽» (с U+00A0) → 2190 для Offer.price */
function priceNumber(price: string): number {
  return Number(price.replace(/\D/g, ""));
}

export default async function ProductPage({ params }: Params) {
  const { slug } = await params;
  const sku = skus.find((s) => s.slug === slug);
  if (!sku) notFound();

  /*
   * Product + BreadcrumbList JSON-LD (seo-research.md: «товары и цены» — поддержанный
   * Яндексом тип, Product-сниппет — Google; BreadcrumbList понимают оба).
   * Доступность выводим из данных, а не хардкодим: пока ozonListingUrl пуст —
   * PreOrder со ссылкой на карточку, появится листинг — InStock с UTM-ссылкой
   * на Ozon (та же точка истины, что у кнопки покупки).
   */
  const pageUrl = `https://zazemli.com/collectio/${sku.slug}`;
  const productJsonLd = {
    "@context": "https://schema.org",
    "@type": "Product",
    name: `${cap(sku.nameRu)} (${sku.latin}) · бокс на одну пересадку`,
    description: sku.heroSub,
    image: `https://zazemli.com${sku.doodle}`,
    brand: { "@type": "Brand", name: "ЗАЗЕМЛИ" },
    offers: sku.sizes.map((size) => ({
      "@type": "Offer",
      name: size.volume,
      price: priceNumber(size.price),
      priceCurrency: "RUB",
      availability: size.ozonListingUrl
        ? "https://schema.org/InStock"
        : "https://schema.org/PreOrder",
      url: size.ozonListingUrl
        ? buildOzonUrl(size.ozonListingUrl, { skuNumber: sku.number })
        : pageUrl,
    })),
  };

  const breadcrumbJsonLd = {
    "@context": "https://schema.org",
    "@type": "BreadcrumbList",
    itemListElement: [
      {
        "@type": "ListItem",
        position: 1,
        name: "Главная",
        item: "https://zazemli.com",
      },
      { "@type": "ListItem", position: 2, name: cap(sku.nameRu) },
    ],
  };

  /*
   * SKU-цвет — CSS-переменная на корне страницы (design-решение 6): декор секций
   * ссылается на var(--sku), поэтому на странице ровно один SKU-цвет. Значение —
   * токен палитры SKU из globals.css (moss/cosmos/iris/buttercup/sky/poppy).
   */
  const skuStyle = {
    "--sku": `var(--color-${sku.color})`,
  } as React.CSSProperties;

  /* Секции шаблона по прототипу collectio-*.html (блоки 1–11). */
  return (
    <main className="flex flex-1 flex-col" style={skuStyle}>
      <JsonLd data={productJsonLd} />
      <JsonLd data={breadcrumbJsonLd} />
      <ProductHero sku={sku} />
      <WhySoil sku={sku} />
      <Composition sku={sku} />
      <WhatsInBox sku={sku} />
      <Care sku={sku} />
      <Ritual sku={sku} />
      <Buybar sku={sku} />
      <FounderQuote />
    </main>
  );
}
