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
