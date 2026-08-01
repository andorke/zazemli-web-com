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
import { skus } from "@/content/sku";

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
   * availability PreOrder, пока Ozon-ссылок нет (sizes[].ozonListingUrl === null);
   * при появлении магазина сменить на InStock.
   */
  const productJsonLd = {
    "@context": "https://schema.org",
    "@type": "Product",
    name: `${cap(sku.nameRu)} · бокс на одну пересадку`,
    description: sku.heroSub,
    image: `https://zazemli.com${sku.doodle}`,
    brand: { "@type": "Brand", name: "ЗАЗЕМЛИ" },
    offers: sku.sizes.map((size) => ({
      "@type": "Offer",
      price: priceNumber(size.price),
      priceCurrency: "RUB",
      availability: "https://schema.org/PreOrder",
      url: `https://zazemli.com/collectio/${sku.slug}`,
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
      {/* JSON-LD в DOM для краулеров; экранируем < по рекомендации Next.js */}
      <script
        type="application/ld+json"
        dangerouslySetInnerHTML={{
          __html: JSON.stringify(productJsonLd).replace(/</g, "\\u003c"),
        }}
      />
      <script
        type="application/ld+json"
        dangerouslySetInnerHTML={{
          __html: JSON.stringify(breadcrumbJsonLd).replace(/</g, "\\u003c"),
        }}
      />
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
