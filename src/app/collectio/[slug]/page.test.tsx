import { render } from "@testing-library/react";
import { describe, expect, it, vi } from "vitest";

import ProductPage, {
  generateMetadata,
  generateStaticParams,
} from "@/app/collectio/[slug]/page";
import { skus } from "@/content/sku";

/* notFound() в проде бросает — мок сохраняет это поведение, чтобы поймать вызов */
vi.mock("next/navigation", () => ({
  notFound: () => {
    throw new Error("NEXT_HTTP_ERROR_FALLBACK;404");
  },
}));

describe("Роут /collectio/[slug]", () => {
  it("generateStaticParams отдаёт по одному slug на каждый SKU", async () => {
    const params = await generateStaticParams();
    expect(params).toEqual(skus.map((s) => ({ slug: s.slug })));
  });

  it("метаданные известного SKU: имя в title, латынь в description, canonical по slug", async () => {
    const meta = await generateMetadata({
      params: Promise.resolve({ slug: "monstera" }),
    });
    expect(meta.alternates?.canonical).toBe("/collectio/monstera");
    expect(JSON.stringify(meta.title)).toContain("Монстера");
    expect(meta.description).toContain("Monstera");
  });

  it("метаданные неизвестного SKU: пустой объект без падения", async () => {
    const meta = await generateMetadata({
      params: Promise.resolve({ slug: "ficus-lyrata" }),
    });
    expect(meta).toEqual({});
  });

  it("неизвестный slug → notFound() (404)", async () => {
    await expect(
      ProductPage({ params: Promise.resolve({ slug: "ficus-lyrata" }) }),
    ).rejects.toThrow(/404/);
  });

  /* Требование spec «SKU-цвет — только декор, один на страницу» (design-решение 6) */
  it("один SKU-цвет на страницу: --sku на корне = цвет SKU, декор через var(--sku), чужих палитр нет", async () => {
    const ui = await ProductPage({
      params: Promise.resolve({ slug: "ficus" }),
    });
    const { container } = render(ui);
    /* фикус = cosmos (#BE3A6B) — единственный SKU-цвет, задан на корне страницы */
    expect(container.querySelector("main")).toHaveStyle({
      "--sku": "var(--color-cosmos)",
    });
    const html = container.innerHTML;
    /* декоративные места ссылаются на переменную, а не хардкодят цвет */
    expect(html).toContain("var(--sku)");
    /* ни одной чужой SKU-палитры на странице (cosmos — свой, moss — бренд-акцент) */
    for (const alien of ["iris", "buttercup", "sky", "poppy"]) {
      expect(html).not.toContain(alien);
    }
  });
});

/*
 * Разметка не должна расходиться с видимым контентом (spec product-page).
 * Цены в sku.ts набраны с неразрывным пробелом («2 190 ₽»), а в разметке лежат
 * числом — сверка нормализует оба вида пробела, иначе тест разъезжается на
 * ровном месте при копипасте цены обычным пробелом.
 */
describe("Product JSON-LD синхронен видимым ценам", () => {
  const productJsonLd = (container: HTMLElement) => {
    const scripts = [
      ...container.querySelectorAll('script[type="application/ld+json"]'),
    ].map((node) => JSON.parse(node.textContent ?? "{}"));
    return scripts.find((node) => node["@type"] === "Product");
  };

  /* «2 190 ₽» и «2 190 ₽» → 2190 */
  const priceDigits = (text: string): string =>
    text.replace(/[\s ]/g, "").replace(/\D/g, "");

  it.each(skus.map((sku) => sku.slug))(
    "%s: offers повторяют объёмы и цены из sku.ts",
    async (slug) => {
      const sku = skus.find((s) => s.slug === slug)!;
      const { container } = render(
        await ProductPage({ params: Promise.resolve({ slug }) }),
      );
      const offers = productJsonLd(container).offers;

      expect(offers.map((offer: { name: string }) => offer.name)).toEqual(
        sku.sizes.map((size) => size.volume),
      );
      expect(offers.map((offer: { price: number }) => String(offer.price))).toEqual(
        sku.sizes.map((size) => priceDigits(size.price)),
      );
    },
  );

  it.each(skus.map((sku) => sku.slug))(
    "%s: цена в buybar совпадает с ценой из offers",
    async (slug) => {
      const { container } = render(
        await ProductPage({ params: Promise.resolve({ slug }) }),
      );
      const offers = productJsonLd(container).offers;
      /* buybar — клиентский селектор: в разметке видна цена первого объёма */
      const visible = [...container.querySelectorAll("#buy p")]
        .map((node) => priceDigits(node.textContent ?? ""))
        .filter(Boolean);

      expect(visible).toContain(String(offers[0].price));
    },
  );
});
