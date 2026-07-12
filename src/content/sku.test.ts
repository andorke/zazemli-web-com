import { describe, expect, it } from "vitest";

import { skus } from "@/content/sku";

describe("Коллекция SKU", () => {
  it("содержит ровно 7 растений", () => {
    expect(skus).toHaveLength(7);
  });

  it("номера N°001–N°007 уникальны и идут по канону", () => {
    expect(skus.map((s) => s.number)).toEqual([
      "N°001",
      "N°002",
      "N°003",
      "N°004",
      "N°005",
      "N°006",
      "N°007",
    ]);
  });

  it("монстера и эпипремнум делят moss (dual mapping из color-system)", () => {
    const monstera = skus.find((s) => s.slug === "monstera");
    const epipremnum = skus.find((s) => s.slug === "epipremnum");
    expect(monstera?.color).toBe("moss");
    expect(epipremnum?.color).toBe("moss");
  });

  it("русские имена — строчными (канон текста)", () => {
    for (const sku of skus) {
      expect(sku.nameRu).toBe(sku.nameRu.toLowerCase());
    }
  });

  it("у каждого SKU есть фраза, размер горшка и дудл (для галереи)", () => {
    for (const sku of skus) {
      expect(sku.tagline.length).toBeGreaterThan(0);
      expect(sku.potSize).toMatch(/для горшка/);
      expect(sku.doodle).toMatch(/^\/doodles\/.+\.svg$/);
    }
  });

  it("фразы-характеры — дословно из канона home.md блок 7", () => {
    expect(skus.map((s) => s.tagline)).toEqual([
      "мох держит влагу джунглей",
      "плотная, стабильная земля",
      "воздух, как на дереве",
      "тень и мягкая кислинка",
      "любит воду, не терпит болота",
      "почти песок",
      "лиана, что не остановить",
    ]);
  });

  it("мета карточек лендинга: компоненты и объёмы с ценой (прототип)", () => {
    for (const sku of skus) {
      expect(sku.components).toBeGreaterThanOrEqual(8);
      expect(sku.components).toBeLessThanOrEqual(11);
      expect(sku.volumes).toMatch(/л$/);
      expect(sku.priceFrom).toMatch(/^от \d\u00A0\d{3} ₽$/u);
    }
  });
});

describe("Инварианты данных SKU (страница товара)", () => {
  it("slug уникальны", () => {
    const slugs = skus.map((s) => s.slug);
    expect(new Set(slugs).size).toBe(skus.length);
  });

  it("сумма процентов колбы = 100 у каждого SKU", () => {
    for (const sku of skus) {
      const { base, air, moisture, drainage } = sku.vial;
      expect(base + air + moisture + drainage, `колба ${sku.slug}`).toBe(100);
    }
  });

  it("сумма долей состава = 100 и совпадает с числом компонентов", () => {
    for (const sku of skus) {
      const total = sku.composition.reduce((sum, c) => sum + c.pct, 0);
      expect(total, `состав ${sku.slug}`).toBe(100);
      expect(sku.composition, `состав ${sku.slug}`).toHaveLength(sku.components);
    }
  });

  it("цены всех размеров положительны", () => {
    for (const sku of skus) {
      for (const size of sku.sizes) {
        /* "2 190 ₽" (U+00A0-разделитель) → 2190 */
        const value = Number(size.price.replace(/\D/g, ""));
        expect(value, `${sku.slug} · ${size.volume}`).toBeGreaterThan(0);
      }
    }
  });
});
