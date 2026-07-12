import { readFileSync } from "node:fs";
import { resolve } from "node:path";

import { describe, expect, it } from "vitest";

import {
  lab,
  type ComponentGroup,
  type SoilFunction,
} from "@/content/lab";
import { skus } from "@/content/sku";

/*
 * Контент /lab. Источник правды — прототип lab.html (канон lab.md v2.0 отстаёт).
 * Перенос сверяется diff-ом против эталона текстовых узлов
 * src/content/__fixtures__/lab.prototype.txt (задача 1.1) — вхождением подстроки
 * в любую строку эталона (эталон дедуплицирован и склеивает inline-узлы).
 */
const prototype = readFileSync(
  resolve(process.cwd(), "src/content/__fixtures__", "lab.prototype.txt"),
  "utf8",
)
  .split("\n")
  .filter((line) => line.length > 0);

const inPrototype = (sub: string) => prototype.some((line) => line.includes(sub));

const sum = (nums: number[]) => nums.reduce((a, b) => a + b, 0);

/* Компонент → функция полоски g4 (для инварианта «агрегат mix == shares») */
const GROUP_FN: Record<ComponentGroup, SoilFunction> = {
  "основа и питание": "base",
  воздух: "air",
  влага: "water",
  "дренаж и каркас": "drain",
};
const compByKey = new Map(lab.components.map((c) => [c.key, c]));

describe("Контент /lab (прототип lab.html, пересборка 2026-07-05)", () => {
  it("hero: eyebrow, H1, sub и смысловая строка", () => {
    expect(lab.hero.eyebrow).toBe("ЗАЗЕМЛИ · лаборатория");
    expect(lab.hero.title).toBe("Лаборатория грунта.");
    expect(lab.hero.sub).toContain("собранная под конкретное растение");
    expect(lab.hero.meaning).toContain("а не просто купить");
  });

  it("якорь-навигация: 01 Рецептуры · 02 Компоненты · 03 Источники", () => {
    expect(lab.nav.map((n) => [n.num, n.label, n.href])).toEqual([
      ["01", "Рецептуры", "#recs"],
      ["02", "Компоненты", "#comp"],
      ["03", "Источники", "#src"],
    ]);
  });

  it("проблема: pullbox с научным якорем Bugbee & Frink", () => {
    expect(lab.problem.title).toBe("Универсальный грунт не под твоё растение.");
    expect(lab.problem.flow).toHaveLength(2);
    expect(lab.problem.pullbox.source.level).toBe("рецензируемо");
    expect(lab.problem.pullbox.source.text).toContain("Bugbee & Frink");
    expect(lab.problem.pullbox.source.text).toContain("De Boodt & Verdonck");
  });

  it("ровно 7 рецептур N°01–07 с id rec-{slug} по порядку", () => {
    expect(lab.recipes).toHaveLength(7);
    expect(lab.recipes.map((r) => r.number)).toEqual([
      "N°01",
      "N°02",
      "N°03",
      "N°04",
      "N°05",
      "N°06",
      "N°07",
    ]);
    expect(lab.recipes.map((r) => r.id)).toEqual([
      "rec-monstera",
      "rec-ficus",
      "rec-anthurium",
      "rec-aglaonema",
      "rec-spathiphyllum",
      "rec-zamioculcas",
      "rec-epipremnum",
    ]);
  });

  it("каждая рецептура: сумма долей mix = 100 и сумма shares = 100", () => {
    for (const r of lab.recipes) {
      expect(sum(r.mix.map((m) => m.pct))).toBe(100);
      expect(sum(Object.values(r.shares))).toBe(100);
    }
  });

  it("shares = агрегат mix по функциональным группам компонентов", () => {
    for (const r of lab.recipes) {
      const acc: Record<SoilFunction, number> = {
        base: 0,
        air: 0,
        water: 0,
        drain: 0,
      };
      for (const m of r.mix) {
        const comp = compByKey.get(m.key);
        expect(comp).toBeDefined();
        acc[GROUP_FN[comp!.group]] += m.pct;
      }
      expect(acc).toEqual(r.shares);
    }
  });

  it("врезка-вывод есть только у монстеры (N°01)", () => {
    expect(lab.recipes.map((r) => Boolean(r.aside))).toEqual([
      true,
      false,
      false,
      false,
      false,
      false,
      false,
    ]);
    expect(lab.recipes[0].aside).toContain("мох вместо лишнего камня");
  });

  it("ровно 11 компонентов в порядке фото-грида, ключи уникальны", () => {
    expect(lab.components).toHaveLength(11);
    expect(lab.components.map((c) => c.key)).toEqual([
      "torfn",
      "torfk",
      "zeo",
      "char",
      "gum",
      "kora",
      "moh",
      "kokos",
      "diat",
      "peno",
      "pesok",
    ]);
    expect(new Set(lab.components.map((c) => c.key)).size).toBe(11);
  });

  it("каждый компонент: два абзаца, spec и source-note", () => {
    for (const c of lab.components) {
      expect(c.paras).toHaveLength(2);
      expect(c.spec.value.length).toBeGreaterThan(0);
      expect(c.source.text.length).toBeGreaterThan(0);
    }
  });

  it("группы компонентов: 5 основа · 1 воздух · 3 влага · 2 дренаж", () => {
    const byGroup = (g: ComponentGroup) =>
      lab.components.filter((c) => c.group === g).length;
    expect(byGroup("основа и питание")).toBe(5);
    expect(byGroup("воздух")).toBe(1);
    expect(byGroup("влага")).toBe(3);
    expect(byGroup("дренаж и каркас")).toBe(2);
  });

  it("source-note: DOI у биочара/биогумуса/кокоса/сфагнума, песок — отраслевой стандарт", () => {
    const withDoi = lab.components
      .filter((c) => c.source.doi)
      .map((c) => c.key);
    expect(withDoi).toEqual(["char", "gum", "moh", "kokos"]);
    expect(compByKey.get("pesok")!.source.level).toBe("отраслевой стандарт");
  });

  it("источники: две группы (8 + 4), пять DOI-ссылок, слоган", () => {
    expect(lab.sources.groups.map((g) => g.title)).toEqual([
      "Грунт и корни",
      "Стандарты и биотоп",
    ]);
    expect(lab.sources.groups[0].items).toHaveLength(8);
    expect(lab.sources.groups[1].items).toHaveLength(4);
    const doiCount = lab.sources.groups
      .flatMap((g) => g.items)
      .filter((s) => s.doi).length;
    expect(doiCount).toBe(5);
    expect(lab.sources.slogan).toBe("Эмпирика надёжнее.");
  });

  it("ozon-финал: eyebrow, заголовок и обе CTA", () => {
    expect(lab.ozon.eyebrow).toBe("Коллекция");
    expect(lab.ozon.title).toContain("Все семь рецептур");
    expect(lab.ozon.collection).toEqual({
      label: "Посмотреть коллекцию →",
      href: "/#collectio",
    });
    expect(lab.ozon.ozonLabel).toBe("Открыть на Ozon →");
  });
});

/* design decision 6: id рецептур обязаны совпадать со slug'ами товара —
 * иначе мосты `/collectio/[slug]` и QR из дневника на `/lab#rec-{slug}` сломаются. */
describe("Мосты товара: id рецептур сверены с каталогом SKU", () => {
  it("7 id rec-{slug} совпадают со slug'ами товара по порядку", () => {
    expect(lab.recipes.map((r) => r.id)).toEqual(
      skus.map((s) => `rec-${s.slug}`),
    );
  });

  it("растение, номер и число компонентов рецептуры сходятся со SKU", () => {
    lab.recipes.forEach((r, i) => {
      const s = skus[i];
      expect(r.plant).toBe(s.nameRu);
      expect(r.number.slice(-2)).toBe(s.number.slice(-2));
      expect(r.mix).toHaveLength(s.components);
    });
  });
});

describe("Перенос /lab сверен дословно с эталоном прототипа", () => {
  it("hero, проблема, ozon — всё есть в эталоне", () => {
    for (const s of [
      lab.hero.eyebrow,
      lab.hero.title,
      lab.hero.sub,
      lab.hero.meaning,
      lab.problem.eyebrow,
      lab.problem.title,
      lab.problem.lead,
      ...lab.problem.flow,
      lab.problem.pullbox.quote,
      lab.problem.pullbox.summary,
      lab.problem.pullbox.source.text,
      lab.recipesSection.eyebrow,
      lab.recipesSection.title,
      lab.recipesSection.cta.label,
      lab.componentsSection.eyebrow,
      lab.componentsSection.title,
      lab.sources.eyebrow,
      lab.sources.title,
      lab.sources.note,
      lab.sources.slogan,
      lab.ozon.eyebrow,
      lab.ozon.title,
    ]) {
      expect(inPrototype(s)).toBe(true);
    }
  });

  it("рецептуры: tag, био, состав, обоснование и caveat — дословно", () => {
    for (const r of lab.recipes) {
      expect(inPrototype(r.tag)).toBe(true);
      expect(inPrototype(r.bio)).toBe(true);
      for (const w of r.why) expect(inPrototype(w)).toBe(true);
      if (r.aside) expect(inPrototype(r.aside)).toBe(true);
      for (const m of r.mix) {
        const comp = compByKey.get(m.key)!;
        expect(inPrototype(comp.shortName ?? comp.name)).toBe(true);
      }
    }
  });

  it("компоненты: имя, абзацы, frac-строка и source-note — дословно", () => {
    for (const c of lab.components) {
      expect(inPrototype(c.name)).toBe(true);
      for (const p of c.paras) expect(inPrototype(p)).toBe(true);
      expect(
        inPrototype(`${c.spec.label}: ${c.spec.value} · Функция: ${c.group}`),
      ).toBe(true);
      expect(inPrototype(c.source.text)).toBe(true);
    }
  });

  it("источники: каждая цитата и служебная сноска — дословно", () => {
    for (const g of lab.sources.groups) {
      expect(inPrototype(g.title)).toBe(true);
      for (const s of g.items) expect(inPrototype(s.cite)).toBe(true);
    }
  });
});

/*
 * Юр-чистота /lab (design decision 1: формулировки прошли выверку
 * evidence-base/recepty-claims, перефразирование = юр-риск). Блэклист
 * BUILD-SPEC + мед-заявления; «уголь» на /lab не встречается (в боксе это
 * «биочар», уголь — только в guide про угольную пудру).
 */
describe("Юр-чистота /lab", () => {
  const corpus = JSON.stringify(lab).toLowerCase();
  const blacklist = [
    "премиум",
    "осознанн",
    "лечит",
    "лекарств",
    "уникальн",
    "гарантир",
    "очищает воздух",
    "польза для здоровья",
    "nasa",
  ];

  it.each(blacklist)("«%s» отсутствует в контенте", (word) => {
    expect(corpus).not.toContain(word);
  });

  it("«уголь» не встречается на /lab", () => {
    expect(corpus).not.toContain("уголь");
  });

  it("выверенные claim-строки сохранены дословно (не перефразированы)", () => {
    expect(corpus).toContain(
      "помогает растению включить собственную защиту от части болезней",
    );
    expect(corpus).toContain("это не антисептик и не защита от болезней");
  });
});
