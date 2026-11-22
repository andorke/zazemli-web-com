import type { Metadata } from "next";
import { notFound } from "next/navigation";
import { PaperProductCatalog } from "@/components/sections/paper/catalog";
import { HomeFooter, HomeHeader } from "@/components/sections/paper/chrome-content";
import { PaperCookies } from "@/components/sections/paper/cookie";
import { PaperStyle } from "@/components/sections/paper/paper-style";
import { JsonLd } from "@/components/site/json-ld";
import { capitalize, findPlant, offerLink, offers, paperAsset, plantSlugs } from "@/content/paper/catalog";
import { openGraphFor } from "@/lib/metadata";

export const dynamicParams = false;
type Props = { params: Promise<{ slug: string }> };

export function generateStaticParams() {
  return plantSlugs.map(slug => ({ slug }));
}

export async function generateMetadata({ params }: Props): Promise<Metadata> {
  const plant = findPlant((await params).slug);
  if (!plant) notFound();
  const path = `/collectio/${plant.slug}`;
  return {
    title: `Бокс и грунт для ${plant.gen}`,
    description: plant.leaflet,
    alternates: { canonical: path },
    openGraph: openGraphFor(path),
  };
}

export default async function ProductPage({ params }: Props) {
  const plant = findPlant((await params).slug);
  if (!plant) notFound();
  const url = `https://zazemli.com/collectio/${plant.slug}`;
  const listings = offers.filter(offer => offer.plant === plant.slug).flatMap(offer => {
    const listing = offerLink(offer);
    return listing ? [{ "@type": "Offer", url: listing, sku: offer.id, price: offer.priceRub, priceCurrency: "RUB", availability: "https://schema.org/InStock" }] : [];
  });
  return (
    <>
      <PaperStyle page="home" />
      <JsonLd data={{
        "@context": "https://schema.org", "@type": "Product", name: `Бокс для ${plant.gen}`,
        description: plant.leaflet,
        image: `https://zazemli.com${paperAsset(`scene-${plant.slug}.webp`)}`,
        ...(listings.length ? { offers: listings } : {}),
      }} />
      <JsonLd data={{
        "@context": "https://schema.org", "@type": "BreadcrumbList",
        itemListElement: [
          { "@type": "ListItem", position: 1, name: "ЗАЗЕМЛИ", item: "https://zazemli.com/" },
          { "@type": "ListItem", position: 2, name: capitalize(plant.name), item: url },
        ],
      }} />
      <a className="skip" href="#main">К содержанию</a>
      <HomeHeader />
      <PaperCookies />
      <main id="main"><PaperProductCatalog initial={plant.slug} /></main>
      <HomeFooter />
    </>
  );
}
