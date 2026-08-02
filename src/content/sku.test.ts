import { describe, expect, it } from "vitest";

import { skus, volumeTiers } from "@/content/sku";

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
        /* "2 290 ₽" (U+00A0-разделитель) → 2290 */
        const value = Number(size.price.replace(/\D/g, ""));
        expect(value, `${sku.slug} · ${size.volume}`).toBeGreaterThan(0);
      }
    }
  });
});

/*
 * Прайс PATCH-1 (FIX-02): 1,2 л → 1 990 ₽, 2,2 л → 2 290 ₽, 3,5 л → 2 690 ₽.
 * Разделитель разрядов — U+00A0 (конвенция модуля); тесты ищут оба варианта
 * пробела, потому что на неразрывном прошлая итерация цены просто не нашла.
 */
describe("Цены партии 0 (FIX-02)", () => {
  const PRICE_BY_VOLUME: Record<string, string> = {
    "1,2 л": "1 990 ₽",
    "2,2 л": "2 290 ₽",
    "3,5 л": "2 690 ₽",
  };

  it("каждый объём стоит по прайсу v2.5", () => {
    for (const sku of skus) {
      for (const size of sku.sizes) {
        expect(size.price, `${sku.slug} · ${size.volume}`).toBe(
          PRICE_BY_VOLUME[size.volume],
        );
      }
    }
  });

  it("«от» в мете карточки = минимальная цена размеров", () => {
    for (const sku of skus) {
      const min = Math.min(
        ...sku.sizes.map((s) => Number(s.price.replace(/\D/g, ""))),
      );
      expect(sku.priceFrom, sku.slug).toBe(
        `от ${String(min).slice(0, 1)} ${String(min).slice(1)} ₽`,
      );
    }
  });

  it("мета галереи по прототипу: монстера и фикус «от 2 290 ₽», остальные «от 1 990 ₽»", () => {
    const byFrom = Object.fromEntries(skus.map((s) => [s.slug, s.priceFrom]));
    expect(byFrom).toEqual({
      monstera: "от 2 290 ₽",
      ficus: "от 2 290 ₽",
      anthurium: "от 1 990 ₽",
      aglaonema: "от 1 990 ₽",
      spathiphyllum: "от 1 990 ₽",
      zamioculcas: "от 1 990 ₽",
      epipremnum: "от 1 990 ₽",
    });
  });

  it("старых цен нет ни в одном варианте пробела", () => {
    const corpus = JSON.stringify(skus);
    for (const old of ["1 890", "1 890", "2 190", "2 190", "2 590", "2 590"]) {
      expect(corpus, `старая цена «${old}»`).not.toContain(old);
    }
  });
});

/* Плитки блока «Купить» (NEW-03): объём + диаметр горшка, три штуки, по возрастанию. */
describe("Объёмы и горшки для плиток «Купить»", () => {
  it("три плитки прототипа: 1,2 / 2,2 / 3,5 л с диаметрами", () => {
    expect(volumeTiers).toEqual([
      { volume: "1,2 л", pot: "12–13 см" },
      { volume: "2,2 л", pot: "15–16 см" },
      { volume: "3,5 л", pot: "18–20 см" },
    ]);
  });

  it("объёмы плиток покрывают все размеры каталога", () => {
    const catalog = new Set(skus.flatMap((s) => s.sizes.map((z) => z.volume)));
    expect(new Set(volumeTiers.map((t) => t.volume))).toEqual(catalog);
  });
});
