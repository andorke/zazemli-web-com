import type { MetadataRoute } from "next";

export const dynamic = "force-static";

/* 4 индексируемые страницы. /diary-signup намеренно отсутствует (вход только по QR) */
export default function sitemap(): MetadataRoute.Sitemap {
  return ["/", "/collectio", "/lab", "/guide"].map((path) => ({
    url: `https://zazemli.com${path === "/" ? "" : path}`,
  }));
}
