import { execFileSync } from "node:child_process";
import type { MetadataRoute } from "next";

import { plantSlugs } from "@/content/paper/catalog";

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
    "src/content/paper",
    "src/components/sections/paper",
  ],
  "/lab": [
    "src/app/lab/page.tsx",
    "src/content/paper/materials.json",
    "src/components/sections/paper/lab.tsx",
  ],
  "/guide": [
    "src/app/guide/page.tsx",
    "src/content/paper/guide-steps.json",
    "src/components/sections/paper/reading-content.tsx",
  ],
  "/privacy": ["src/app/privacy/page.tsx", "src/components/sections/paper/legal-content.tsx"],
  "/terms": ["src/app/terms/page.tsx", "src/components/sections/paper/legal-content.tsx"],
};

/* Все 7 товарных страниц собираются из одного шаблона и sku.ts — lastmod у них общий. */
const productSources = [
  "src/app/collectio/[slug]/page.tsx",
  "src/content/paper",
  "src/components/sections/paper/catalog.tsx",
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
    ...plantSlugs.map((slug) => ({
      url: `https://zazemli.com/collectio/${slug}`,
      lastModified: productLastMod,
    })),
  ];
}
