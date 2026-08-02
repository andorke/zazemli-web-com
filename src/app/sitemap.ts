import { execFileSync } from "node:child_process";
import type { MetadataRoute } from "next";

import { skus } from "@/content/sku";

export const dynamic = "force-static";

/*
 * Честный lastmod: git committer date последнего коммита по файлам, из которых
 * собирается контент страницы. Google учитывает lastmod, только если он достоверен;
 * lastModified: new Date() на каждый билд — антипаттерн (seo-research.md ч.1 §2).
 * Выполняется на билде (static export), git всегда доступен: деплой — scripts/deploy.sh
 * с машины разработчика. Фоллбэк без git — sitemap валиден и без lastmod.
 */
const pageSources: Record<string, string[]> = {
  "/": [
    "src/app/page.tsx",
    "src/app/layout.tsx",
    "src/content/home.ts",
    "src/content/site.ts",
    "src/content/sku.ts",
    "src/components/sections/home",
  ],
  "/lab": [
    "src/app/lab/page.tsx",
    "src/content/lab.ts",
    "src/components/sections/lab",
  ],
  "/guide": [
    "src/app/guide/page.tsx",
    "src/content/guide.ts",
    "src/components/sections/guide",
  ],
  "/privacy": ["src/app/privacy/page.tsx", "src/content/privacy.ts"],
  "/terms": ["src/app/terms/page.tsx", "src/content/terms.ts"],
};

/* Все 7 товарных страниц собираются из одного шаблона и sku.ts — lastmod у них общий. */
const productSources = [
  "src/app/collectio/[slug]/page.tsx",
  "src/content/sku.ts",
  "src/components/sections/product",
];

function gitLastModified(sources: string[]): Date | undefined {
  try {
    const iso = execFileSync(
      "git",
      ["log", "-1", "--format=%cI", "--", ...sources],
      { encoding: "utf8" },
    ).trim();
    const date = iso ? new Date(iso) : undefined;
    return date && !Number.isNaN(date.getTime()) ? date : undefined;
  } catch {
    return undefined;
  }
}

/* 12 индексируемых страниц: главная, lab, guide, privacy, terms + 7 страниц товара.
   /diary-signup (вход только по QR) и редирект-страница /collectio намеренно отсутствуют. */
export default function sitemap(): MetadataRoute.Sitemap {
  const productLastMod = gitLastModified(productSources);
  return [
    ...Object.entries(pageSources).map(([path, sources]) => ({
      url: `https://zazemli.com${path === "/" ? "" : path}`,
      lastModified: gitLastModified(sources),
    })),
    ...skus.map((sku) => ({
      url: `https://zazemli.com/collectio/${sku.slug}`,
      lastModified: productLastMod,
    })),
  ];
}
