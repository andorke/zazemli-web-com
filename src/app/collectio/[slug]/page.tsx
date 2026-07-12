import type { Metadata } from "next";
import { notFound } from "next/navigation";

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

  /* Каркас роута. Секции шаблона (hero → founder-quote → футер-мост «← Вся коллекция»)
     добавляются задачами 2.2–2.5. */
  return <main className="flex flex-1 flex-col" />;
}
