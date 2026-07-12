import { readFileSync } from "node:fs";
import { resolve } from "node:path";

import { describe, expect, it } from "vitest";

import { guide } from "@/content/guide";

/*
 * Контент /guide. Канон Маркетинг/Каналы/Сайт/guide.md v3.0 = прототип guide.html
 * дословно (source_of_truth). Перенос сверяется diff-ом против эталона текстовых
 * узлов src/content/__fixtures__/guide.prototype.txt (задача 1.1). Эталон
 * дедуплицирован и склеивает inline-узлы — поэтому сверка идёт через вхождение
 * подстроки в любую строку эталона, а не построчным равенством.
 */
const prototype = readFileSync(
  resolve(process.cwd(), "src/content/__fixtures__", "guide.prototype.txt"),
  "utf8",
)
  .split("\n")
  .filter((line) => line.length > 0);

const inPrototype = (sub: string) => prototype.some((line) => line.includes(sub));

describe("Контент /guide (guide.md v3.0 = прототип guide.html)", () => {
  it("hero: eyebrow, H1, sub и мета-строка «5 шагов»", () => {
    expect(guide.hero.eyebrow).toBe("Гайд по пересадке");
    expect(guide.hero.title).toBe("Руки в землю — голова свободна.");
    expect(guide.hero.sub).toBe(
      "Спокойный ритуал наедине с растением. Порядок один для любого: меняется только грунт под него.",
    );
    expect(guide.hero.meta).toBe("5 шагов · всё нужное в боксе");
  });

  it("ровно 5 стадий CJM 00–04 с якорями step-0…step-4 по порядку", () => {
    expect(guide.stages).toHaveLength(5);
    expect(guide.stages.map((s) => s.num)).toEqual([
      "00",
      "01",
      "02",
      "03",
      "04",
    ]);
    expect(guide.stages.map((s) => s.id)).toEqual([
      "step-0",
      "step-1",
      "step-2",
      "step-3",
      "step-4",
    ]);
    expect(guide.stages.map((s) => s.title)).toEqual([
      "Подготовка",
      "Конверт",
      "Дренаж",
      "Грунт",
      "Забота",
    ]);
  });

  it("маркировка ●/○: первая позиция «Подготовки» — из бокса, остальное своё", () => {
    const prep = guide.stages[0];
    expect(prep.kit[0]).toEqual({ text: "бокс ЗАЗЕМЛИ", source: "box" });
    expect(prep.kit.slice(1).every((k) => k.source === "own")).toBe(true);
    // «Конверт»: бокс кладёт конверт и угольную пудру, своё — растение и секатор
    expect(guide.stages[1].kit.filter((k) => k.source === "box")).toHaveLength(2);
  });

  it("легенда «в боксе / своё» показывается только у первой стадии", () => {
    expect(guide.stages.map((s) => s.showKitLegend)).toEqual([
      true,
      false,
      false,
      false,
      false,
    ]);
  });

  it("каждая стадия несёт непустой инвентарь, шаги и «готово, когда»", () => {
    for (const s of guide.stages) {
      expect(s.kit.length).toBeGreaterThan(0);
      expect(s.steps.length).toBeGreaterThan(0);
      expect(s.done.length).toBeGreaterThan(0);
    }
  });

  it("под-пункты шагов сохранены (напр. развилка перевалка/замена в «Конверте»)", () => {
    const decide = guide.stages[1].steps.find((s) =>
      s.text.startsWith("Реши:"),
    );
    expect(decide?.subs).toHaveLength(3);
    expect(decide?.subs?.[2]).toBe(
      "первое заземление в нашу землю — обычно полная замена",
    );
  });

  it("подсказки: список у «Подготовки», проза у «Конверта»/«Грунта», нет у дренажа и заботы", () => {
    expect(guide.stages[0].tip).toMatchObject({
      summary: "Как выбрать горшок",
      kind: "list",
    });
    expect(guide.stages[0].tip?.body).toHaveLength(4);
    expect(guide.stages[1].tip).toMatchObject({
      summary: "Уголь и корневин — это одно и то же?",
      kind: "prose",
    });
    expect(guide.stages[3].tip).toMatchObject({
      summary: "Сохрани остаток грунта",
      kind: "prose",
    });
    expect(guide.stages[2].tip).toBeNull();
    expect(guide.stages[4].tip).toBeNull();
  });

  it("завершение: «Готово, когда» у 00–03, «Дальше» — у «Заботы»", () => {
    expect(guide.stages.slice(0, 4).map((s) => s.doneLabel)).toEqual([
      "Готово, когда",
      "Готово, когда",
      "Готово, когда",
      "Готово, когда",
    ]);
    expect(guide.stages[4].doneLabel).toBe("Дальше");
  });

  it("подпись про здоровый/гнилой корень — только у «Конверта», со ссылкой", () => {
    expect(guide.stages.map((s) => Boolean(s.note))).toEqual([
      false,
      true,
      false,
      false,
      false,
    ]);
    expect(guide.stages[1].note?.link.href).toBe(
      "https://www.epicgardening.com/root-rot/",
    );
    expect(guide.stages[1].note?.link.label).toBe("как отличить ↗");
  });

  it("Ozon-финал: eyebrow, заголовок и обе CTA", () => {
    expect(guide.ozon.eyebrow).toBe("Бокс");
    expect(guide.ozon.title).toBe(
      "Землю под своё растение и всё для ритуала собираешь одним боксом.",
    );
    expect(guide.ozon.ozonLabel).toBe("Выбрать на Ozon →");
    expect(guide.ozon.collection).toEqual({
      label: "Посмотреть коллекцию →",
      href: "/#collectio",
    });
  });
});

describe("Перенос /guide сверен дословно с эталоном прототипа", () => {
  it("hero, стадии, инвентарь, шаги, подсказки, «готово» — всё есть в эталоне", () => {
    expect(inPrototype(guide.hero.title)).toBe(true);
    expect(inPrototype(guide.hero.sub)).toBe(true);
    expect(inPrototype(guide.hero.meta)).toBe(true);
    for (const s of guide.stages) {
      expect(inPrototype(s.title)).toBe(true);
      expect(inPrototype(s.done)).toBe(true);
      for (const k of s.kit) expect(inPrototype(k.text)).toBe(true);
      for (const step of s.steps) {
        expect(inPrototype(step.text)).toBe(true);
        for (const sub of step.subs ?? []) expect(inPrototype(sub)).toBe(true);
      }
      if (s.tip) {
        expect(inPrototype(s.tip.summary)).toBe(true);
        for (const b of s.tip.body) expect(inPrototype(b)).toBe(true);
      }
      if (s.note) {
        expect(inPrototype(s.note.text)).toBe(true);
        expect(inPrototype(s.note.link.label)).toBe(true);
      }
    }
    expect(inPrototype(guide.ozon.title)).toBe(true);
  });
});

/* Блэклист BUILD-SPEC + guide.md Pre-publish (NASA-миф про очистку воздуха) */
describe("Блэклист /guide", () => {
  const corpus = JSON.stringify(guide).toLowerCase();
  const blacklist = [
    "премиум",
    "осознанн",
    "лечит",
    "уникальн",
    "гарантир",
    "очищает воздух",
    "польза для здоровья",
    "nasa",
  ];

  it.each(blacklist)("«%s» отсутствует в контенте", (word) => {
    expect(corpus).not.toContain(word);
  });
});
