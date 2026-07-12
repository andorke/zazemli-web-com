import type { MetadataRoute } from "next";

export const dynamic = "force-static";

/* 5 индексируемых страниц. /diary-signup намеренно отсутствует (вход только по QR) */
export default function sitemap(): MetadataRoute.Sitemap {
  return ["/", "/collectio", "/lab", "/guide", "/privacy"].map((path) => ({
    url: `https://zazemli.com${path === "/" ? "" : path}`,
  }));
}
