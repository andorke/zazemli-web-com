import { existsSync, readFileSync } from "node:fs";
import { resolve } from "node:path";

import { describe, expect, it } from "vitest";

import {
  diaryStage,
  drainageStage,
  guide,
  guideEntry,
  guidePerevalka,
  guidePolnayaZamena,
  soilLeftoverTip,
  type GuideRouteContent,
  type GuideRouteStage,
  type GuideStageTip,
} from "@/content/guide";

/*
 * Эталоны текстовых узлов прототипов гайда v4.0 (вход + два маршрута) —
 * src/content/__fixtures__/*.prototype.txt, генерирует
 * scripts/extract-prototype-text.mjs. Эталон дедуплицирован и склеивает
 * inline-узлы, поэтому сверка идёт через вхождение подстроки в любую строку
 * эталона, а не построчным равенством.
 */
const loadPrototype = (name: string) =>
  readFileSync(
    resolve(process.cwd(), "src/content/__fixtures__", `${name}.prototype.txt`),
    "utf8",
  )
    .split("\n")
    .filter((line) => line.length > 0);

const inNodes = (nodes: string[], sub: string) =>
  nodes.some((line) => line.includes(sub));

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

  it("каждая стадия несёт непустой инвентарь и шаги", () => {
    for (const s of guide.stages) {
      expect(s.kit.length).toBeGreaterThan(0);
      expect(s.steps.length).toBeGreaterThan(0);
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

/*
 * Drift-сверка переноса v4.0 против прототипов: каждая строка контента должна
 * найтись в эталоне своей страницы. Проверка односторонняя — лишние узлы
 * прототипа (шапка, футер, cookie-баннер, копипаст-артефакты вроде четвёртого
 * микрошага «Оцени, нужно ли досыпать грунт» в «Продолжении») её не ломают,
 * а вот отсебятина или потерянная при переносе правка прототипа — ломают.
 */
const tipTexts = (tip: GuideStageTip): string[] => [
  tip.summary,
  ...tip.body.map((b) => (typeof b === "string" ? b : b.text)),
];

const stageTexts = (stage: GuideRouteStage): string[] => [
  stage.title,
  ...stage.steps.flatMap((step) => [
    step.text,
    ...(step.subs ?? []),
    ...(step.subLink ? [step.subLink.label] : []),
    ...(step.subTip ? tipTexts(step.subTip) : []),
  ]),
  ...stage.tips.flatMap(tipTexts),
  ...(stage.outro ? [stage.outro] : []),
];

describe("Перенос гайда v4.0 сверен дословно с эталонами прототипов", () => {
  it("вход /guide: hero, флоу, инвентарь, стадии 00–01, развилка", () => {
    const nodes = loadPrototype("guide");
    const texts = [
      guideEntry.hero.eyebrow,
      guideEntry.hero.title,
      guideEntry.hero.sub,
      ...guideEntry.flow.map((f) => f.title),
      guideEntry.kit.time,
      ...guideEntry.kit.items.flatMap((k) => [k.text, ...(k.note ? [k.note] : [])]),
      ...guideEntry.stages.flatMap(stageTexts),
      guideEntry.fork.title,
      guideEntry.fork.sub,
      ...guideEntry.fork.paths.flatMap((p) => [
        p.title,
        p.lede,
        p.whenLabel,
        ...p.when,
        p.button.label,
        p.next,
      ]),
      ...tipTexts(guideEntry.fork.tip),
    ];
    expect(texts.filter((text) => !inNodes(nodes, text))).toEqual([]);
  });

  const routes: [string, GuideRouteContent][] = [
    ["guide-perevalka", guidePerevalka],
    ["guide-polnaya-zamena", guidePolnayaZamena],
  ];

  it.each(routes)(
    "маршрут %s: hero, ссылка на соседнюю ветку, флоу и стадии",
    (name, route) => {
      const nodes = loadPrototype(name);
      const texts = [
        route.hero.eyebrow,
        route.hero.title,
        route.hero.sub,
        route.hero.meta,
        route.otherRoute.label,
        ...route.flow.map((f) => f.title),
        ...route.stages.flatMap(stageTexts),
      ];
      expect(texts.filter((text) => !inNodes(nodes, text))).toEqual([]);
    },
  );
});

/*
 * Контент v4.0 — вход + два маршрута (канон guide.md v4.0 = прототипы
 * guide.html · guide-perevalka.html · guide-polnaya-zamena.html): структура,
 * переименования стадий и снятые элементы. Дословность — в drift-блоке выше.
 */
/* Все href контента, на любой глубине вложенности */
const collectHrefs = (node: unknown, found: string[] = []): string[] => {
  if (Array.isArray(node)) {
    for (const item of node) collectHrefs(item, found);
  } else if (node && typeof node === "object") {
    for (const [key, value] of Object.entries(node)) {
      if (key === "href" && typeof value === "string") found.push(value);
      else collectHrefs(value, found);
    }
  }
  return found;
};

describe("Контент гайда v4.0: вход и два маршрута", () => {
  it("вход: hero, флоу 00–04 и стадии до развилки", () => {
    expect(guideEntry.hero.title).toBe("Руки в землю — голова свободна");
    expect(guideEntry.flow.map((f) => f.title)).toEqual([
      "Подготовка",
      "Забота о руках и корнях",
      "Дренаж",
      "Грунт и посадка",
      "Дневник",
    ]);
    expect(guideEntry.stages.map((s) => `${s.num} ${s.title}`)).toEqual([
      "00 Подготовка",
      "01 Забота о руках и корнях",
    ]);
    expect(guideEntry.kit.time).toBe("10–30 минут");
  });

  it("развилка: два маршрута кнопками на реальные пути", () => {
    expect(guideEntry.fork.paths.map((p) => p.button.href)).toEqual([
      "/guide/perevalka",
      "/guide/polnaya-zamena",
    ]);
    expect(guideEntry.fork.paths.map((p) => p.when)).toHaveLength(2);
  });

  it("маршруты: свои стадии и ссылка на соседнюю ветку", () => {
    expect(guidePerevalka.stages.map((s) => `${s.num} ${s.title}`)).toEqual([
      "02 Дренаж",
      "03 Грунт и посадка",
      "04 Дневник",
    ]);
    expect(guidePolnayaZamena.stages.map((s) => `${s.num} ${s.title}`)).toEqual([
      "01 Продолжение · забота о корнях",
      "02 Дренаж",
      "03 Грунт и посадка",
      "04 Дневник",
    ]);
    expect(guidePerevalka.otherRoute.href).toBe("/guide/polnaya-zamena");
    expect(guidePolnayaZamena.otherRoute.href).toBe("/guide/perevalka");
  });

  /*
   * Сверка по ссылке (toBe), а не по значению: она падает не только когда тексты
   * разошлись, но и когда общий кусок скопировали вторым объектом с тем же текстом.
   */
  it("«Дренаж», «Дневник» и «Сохрани остаток грунта» — один объект на обе ветки", () => {
    const [drenazhP, gruntP, dnevnikP] = guidePerevalka.stages;
    const [, drenazhZ, gruntZ, dnevnikZ] = guidePolnayaZamena.stages;
    expect(drenazhP).toBe(drainageStage);
    expect(drenazhZ).toBe(drainageStage);
    expect(dnevnikP).toBe(diaryStage);
    expect(dnevnikZ).toBe(diaryStage);
    expect(gruntP.tips[0]).toBe(soilLeftoverTip);
    expect(gruntZ.tips[0]).toBe(soilLeftoverTip);
    expect(soilLeftoverTip.summary).toBe("Сохрани остаток грунта");
  });

  /*
   * В прототипах страницы связаны файлами (guide-perevalka.html) — на сайте
   * такие ссылки ведут в никуда. Сверяем не только форму пути, но и то, что
   * маршрут развилки и соседней ветки существует в src/app.
   */
  it("внутренние ссылки — реальные пути, относительных файлов прототипов нет", () => {
    const hrefs = collectHrefs([guideEntry, guidePerevalka, guidePolnayaZamena]);
    expect(hrefs.length).toBeGreaterThan(0);
    for (const href of hrefs) {
      expect(href).toMatch(/^(https:\/\/|\/)/);
      expect(href).not.toContain(".html");
    }
  });

  it("маршруты развилки и соседней ветки существуют в src/app", () => {
    const routes = [
      ...guideEntry.fork.paths.map((p) => p.button.href),
      guidePerevalka.otherRoute.href,
      guidePolnayaZamena.otherRoute.href,
    ];
    for (const route of routes) {
      const page = resolve(process.cwd(), "src/app", route.slice(1), "page.tsx");
      expect(existsSync(page), `нет страницы для ${route}`).toBe(true);
    }
  });

  it("ссылка про гниль корней — в «Продолжении», внешняя", () => {
    const roots = guidePolnayaZamena.stages[0].steps.find((s) => s.subLink);
    expect(roots?.subLink?.href).toBe("https://www.epicgardening.com/root-rot/");
  });

  it("снятые элементы: «Готово, когда» и лид-строк шагов в контенте нет", () => {
    const corpus = JSON.stringify([
      guideEntry,
      guidePerevalka,
      guidePolnayaZamena,
    ]);
    expect(corpus).not.toContain("Готово, когда");
    expect(corpus).not.toContain("doneLabel");
    expect(corpus).not.toContain("illustration");
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
