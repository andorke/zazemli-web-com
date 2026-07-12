import type { MetadataRoute } from "next";

import { skus } from "@/content/sku";

export const dynamic = "force-static";

/* 10 индексируемых страниц: главная, lab, guide + 7 страниц товара.
   /diary-signup (вход только по QR) и редирект-страница /collectio намеренно отсутствуют. */
export default function sitemap(): MetadataRoute.Sitemap {
  const paths = [
    "/",
    "/lab",
    "/guide",
    ...skus.map((sku) => `/collectio/${sku.slug}`),
  ];
  return paths.map((path) => ({
    url: `https://zazemli.com${path === "/" ? "" : path}`,
  }));
}
