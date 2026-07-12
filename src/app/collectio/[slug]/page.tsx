import type { Metadata } from "next";
import { notFound } from "next/navigation";

import { Buybar } from "@/components/sections/product/buybar";
import { Care } from "@/components/sections/product/care";
import { Composition } from "@/components/sections/product/composition";
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

export default async function ProductPage({ params }: Params) {
  const { slug } = await params;
  const sku = skus.find((s) => s.slug === slug);
  if (!sku) notFound();

  /* Секции шаблона по прототипу collectio-*.html. Founder-quote и
     футер-мост «← Вся коллекция» — задача 2.5. */
  return (
    <main className="flex flex-1 flex-col">
      <ProductHero sku={sku} />
      <WhySoil sku={sku} />
      <Composition sku={sku} />
      <WhatsInBox sku={sku} />
      <Care sku={sku} />
      <Ritual sku={sku} />
      <Buybar sku={sku} />
    </main>
  );
}
