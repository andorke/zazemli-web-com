import { describe, expect, it } from "vitest";

import { hasBuild, mainOf, readBuilt, SKU_ROUTES, textOf } from "@/lib/built-output";

/*
 * Приёмка PATCH-1 §7.1 по собранным карточкам и главной — проверки
 * verify-prototypes.py, не попавшие в page.built.test.ts: FIX-41, FIX-36,
 * FIX-49, FIX-38, FIX-52, FIX-53, FIX-55, FIX-44, FIX-72.
 */
const onBuild = hasBuild() ? describe : describe.skip;

const home = textOf(mainOf(readBuilt("/") ?? ""));
const skus = SKU_ROUTES.map((route) => ({
  route,
  main: mainOf(readBuilt(route) ?? ""),
  text: textOf(mainOf(readBuilt(route) ?? "")),
}));

onBuild("Собранные карточки и главная: остаток приёмки", () => {
  it("FIX-41: селектор объёма на всех 7 карточках", () => {
    for (const { route, main } of skus) {
      const options = [...main.matchAll(/\d[,.]\d[ \u00A0]*л/g)].length;
      expect(options, `${route}: вариантов объёма`).toBeGreaterThanOrEqual(2);
    }
  });

  it("FIX-49 / FIX-36: палочки для корней, не «апельсиновые», назначение раскрыто", () => {
    for (const { route, text } of [...skus, { route: "/", text: home }]) {
      expect(text, route).not.toMatch(/апельсинов/iu);
      expect(text, route).toMatch(/палочк/iu);
    }
  });

  it("FIX-52: родового «конвертик» нет — есть «Забота о корнях и твоих руках»", () => {
    for (const { route, text } of [...skus, { route: "/", text: home }]) {
      expect(text, route).not.toMatch(/конвертик/iu);
      expect(text, route).toContain("Забота о корнях и твоих руках");
    }
  });

  it("FIX-53: состав «Что в боксе» идентичен на главной и всех 7 карточках", () => {
    const items = ["дренаж", "дневник", "листовка", "перчатк"];
    for (const item of items) {
      const re = new RegExp(item, "iu");
      expect(re.test(home), `главная: ${item}`).toBe(true);
      for (const { route, text } of skus) expect(re.test(text), `${route}: ${item}`).toBe(true);
    }
  });

  it("FIX-38: ритуал-блок — кофе-якорь и строка про содержимое коробки", () => {
    for (const { route, text } of skus) {
      expect(text, route).toMatch(/чашек кофе навынос/iu);
      expect(text, route).toContain("В коробке — собранный опыт пересадки");
    }
  });

  it("FIX-38: блок «Собрать самому» с таблицей сравнения на всех семи", () => {
    for (const { route, text } of skus) {
      expect(text, route).toContain("Собрать самому");
      expect(text, route).toMatch(/четырнадцать отдельных мешков/iu);
      for (const row of ["Закупка на старте", "Уйдёт на одну пересадку", "Останется лежать", "Рецептура"]) {
        expect(text, `${route}: строка «${row}»`).toContain(row);
      }
      expect(text, route).toMatch(/Честная рамка/iu);
    }
  });

  it("FIX-38: цена в таблице совпадает с блоком покупки — источник один", () => {
    for (const { route, text } of skus) {
      /* базовый объём: первая цена карточки должна встречаться и в таблице */
      const prices = [...text.matchAll(/(\d[\d\u00A0 ]*)\s*₽/g)].map((m) => m[1].trim());
      expect(prices.length, route).toBeGreaterThan(1);
      const base = prices.find((p) => /^[12]/.test(p));
      expect(text.split(base as string).length - 1, `${route}: цена ${base} встречается один раз`).toBeGreaterThan(1);
    }
  });

  it("FIX-35: risk-reversal на карточках, а не только на главной", () => {
    for (const { route, text } of skus) {
      expect(text, route).toContain("team@zazemli.com");
      expect(text, route).toMatch(/Сомневаешься с объёмом/iu);
    }
  });

  it("Т8: тейк о подарке другу после цитаты основательницы", () => {
    for (const { route, text } of skus) {
      const quote = text.indexOf("руками тянется к земле");
      const gift = text.indexOf("подарок для друга");
      expect(quote, `${route}: цитаты нет`).toBeGreaterThan(-1);
      expect(gift, `${route}: тейка Т8 нет`).toBeGreaterThan(quote);
    }
  });

  it("FIX-44: блок «Растению — дом, тебе — меньше хлопот» и тейк Т12 на главной", () => {
    expect(home).toMatch(/Растению — дом/iu);
    expect(home).toMatch(/не слёживается|структур\p{L}* (не слёживается|держится)/iu);
  });

  it("FIX-72: core formula закрывает блок «Что эта земля даёт»", () => {
    expect(home).toContain("Земля и забота — всё, что нужно");
  });

  it("FIX-55: SKU-цвет — только декор, заголовки ухода не красятся в текст SKU", () => {
    for (const { route, main } of skus) {
      expect(main, route).not.toMatch(/<h[1-3][^>]*style="[^"]*color:\s*var\(--color-sku/);
    }
  });

  /*
   * Обратная проверка к NEW-02/05/06/07: пока NEXT_PUBLIC_WAITLIST_API пуст,
   * формы N°08 в выдаче нет вовсе. Сбор email без серверного лога согласий
   * юридически незащищён, поэтому «превью, которое ничего не отправляет» тут
   * не годится. Проверки самой формы включатся вместе с change waitlist-api.
   */
  it("форма N°08 не опубликована, пока бэкенд листа ожидания выключен", () => {
    expect(home).not.toMatch(/Лист ожидания/iu);
    expect(readBuilt("/") ?? "").not.toContain("waitlist");
  });
});
