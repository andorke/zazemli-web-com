import type { Metadata } from "next";
import { notFound } from "next/navigation";
import { CatalogRedirect } from "@/components/site/catalog-redirect";
import { findPlant, plantSlugs } from "@/content/paper/catalog";

export const dynamicParams = false;
export const metadata: Metadata = { alternates: { canonical: "/" }, robots: { index: false, follow: true } };

export function generateStaticParams() {
  return plantSlugs.map(slug => ({ slug }));
}

export default async function BuyAgainPage({ params }: { params: Promise<{ slug: string }> }) {
  const plant = findPlant((await params).slug);
  if (!plant) notFound();
  return <CatalogRedirect path="/" plant={plant.slug} />;
}
