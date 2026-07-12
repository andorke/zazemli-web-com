import { describe, expect, it } from "vitest";

import sitemap from "@/app/sitemap";
import { skus } from "@/content/sku";

/* Индексируемые страницы: главная, lab, guide + 7 страниц товара.
   Редирект-страница /collectio и /diary-signup (вход по QR) в sitemap не попадают
   (spec site-shell «Sitemap расширен»). */
describe("sitemap.xml", () => {
  const urls = sitemap().map((entry) => entry.url);

  it("содержит ровно 10 индексируемых URL", () => {
    expect(urls).toHaveLength(10);
  });

  it("включает главную, lab и guide", () => {
    expect(urls).toContain("https://zazemli.com");
    expect(urls).toContain("https://zazemli.com/lab");
    expect(urls).toContain("https://zazemli.com/guide");
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
});
