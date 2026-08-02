import { describe, expect, it } from "vitest";

import { metadata } from "@/app/privacy/page";
import sitemap from "@/app/sitemap";
import { metadata as termsMetadata } from "@/app/terms/page";
import { skus } from "@/content/sku";

/* Индексируемые страницы: главная, lab, guide, privacy, terms + 7 страниц товара.
   Редирект-страница /collectio и /diary-signup (вход по QR) в sitemap не попадают
   (spec site-shell «Sitemap расширен»). */
describe("sitemap.xml", () => {
  const urls = sitemap().map((entry) => entry.url);

  it("содержит ровно 12 индексируемых URL", () => {
    expect(urls).toHaveLength(12);
  });

  it("включает главную, lab, guide, privacy и terms", () => {
    expect(urls).toContain("https://zazemli.com");
    expect(urls).toContain("https://zazemli.com/lab");
    expect(urls).toContain("https://zazemli.com/guide");
    expect(urls).toContain("https://zazemli.com/privacy");
    expect(urls).toContain("https://zazemli.com/terms");
  });

  it("включает все 7 страниц товара /collectio/[slug]", () => {
    for (const sku of skus) {
      expect(urls).toContain(`https://zazemli.com/collectio/${sku.slug}`);
    }
  });

  it("не содержит редирект-страницу /collectio", () => {
    expect(urls).not.toContain("https://zazemli.com/collectio");
  });

  it("не содержит /diary-signup (вход только по QR)", () => {
    expect(urls.some((u) => u.includes("diary"))).toBe(false);
  });

  it("/privacy индексируема (robots-метаданные не noindex)", () => {
    expect(metadata.robots).toMatchObject({ index: true, follow: true });
  });

  it("/terms индексируема (robots-метаданные не noindex)", () => {
    expect(termsMetadata.robots).toMatchObject({ index: true, follow: true });
  });

  /* Честный lastmod из git-дат контента: Google верит lastmod, только если он
     достоверен; new Date() на каждый билд — антипаттерн (seo-research.md ч.1 §2). */
  it("каждый URL несёт lastModified — валидную дату не из будущего", () => {
    for (const entry of sitemap()) {
      expect(entry.lastModified, `${entry.url} без lastModified`).toBeInstanceOf(
        Date,
      );
      const time = (entry.lastModified as Date).getTime();
      expect(Number.isNaN(time)).toBe(false);
      expect(time).toBeLessThanOrEqual(Date.now());
      expect(time).toBeGreaterThan(new Date("2025-01-01").getTime());
    }
  });
});
