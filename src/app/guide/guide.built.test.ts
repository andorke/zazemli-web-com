import { describe, expect, it } from "vitest";

import { hasBuild, mainOf, readBuilt, textOf } from "@/lib/built-output";

/*
 * Приёмка PATCH-1 §4 и §7.2 по СОБРАННЫМ страницам гайда: вход + два маршрута.
 * Переносимые проверки verify-prototypes.py — NEW-08 (CTA и обращение на «ты»),
 * FIX-62 (нет зелёного полужирного на мелком) — плюс SEO-контракт развилки,
 * на котором патч настаивает отдельно: без noindex + canonical две ветки с
 * дословно совпадающими шагами начнут каннибализировать друг друга и сам /guide.
 */
const onBuild = hasBuild() ? describe : describe.skip;

const ENTRY = "/guide";
const BRANCHES = ["/guide/perevalka", "/guide/polnaya-zamena"] as const;
const ALL = [ENTRY, ...BRANCHES] as const;

const page = (route: string) => readBuilt(route) ?? "";
const robotsOf = (html: string) =>
  html.match(/name="robots" content="([^"]*)"/)?.[1] ?? "";
const canonicalOf = (html: string) =>
  html.match(/rel="canonical" href="([^"]*)"/)?.[1] ?? "";

onBuild("Собранный /guide: приёмка PATCH-1 §4", () => {
  it("три страницы существуют в экспорте", () => {
    for (const route of ALL) expect(page(route), route).not.toBe("");
  });

  it("§4.1: ветки закрыты noindex, follow — иначе каннибализация общих шагов", () => {
    for (const route of BRANCHES) {
      expect(robotsOf(page(route)), route).toBe("noindex, follow");
    }
  });

  it("§4.1: canonical веток указывает на вход, у входа — на себя", () => {
    for (const route of BRANCHES) {
      expect(canonicalOf(page(route)), route).toBe("https://zazemli.com/guide");
    }
    expect(canonicalOf(page(ENTRY))).toBe("https://zazemli.com/guide");
  });

  it("§4.1: вход индексируется — noindex на нём быть не должно", () => {
    expect(robotsOf(page(ENTRY))).not.toContain("noindex");
  });

  it("§4.3: общие шаги «Дренаж» и «Дневник» есть на обеих ветках", () => {
    for (const route of BRANCHES) {
      const text = textOf(mainOf(page(route)));
      expect(text, route).toMatch(/Дренаж/);
      expect(text, route).toMatch(/Дневник/);
    }
  });

  it("§4.3: подсказка про остаток грунта совпадает на ветках дословно", () => {
    /* Подсказка живёт в <details>: заголовок в <summary>, текст следом до </details> */
    const hintBlock = (route: string) => {
      const main = mainOf(page(route));
      const start = main.indexOf("Сохрани остаток грунта");
      if (start < 0) return null;
      const end = main.indexOf("</details>", start);
      return textOf(main.slice(start, end < 0 ? undefined : end))
        .replace(/\s+/g, " ")
        .trim();
    };
    const blocks = BRANCHES.map(hintBlock);
    expect(blocks[0], "подсказка не найдена на /guide/perevalka").toBeTruthy();
    expect(blocks[0]!.length).toBeGreaterThan("Сохрани остаток грунта".length);
    expect(blocks[1]).toBe(blocks[0]);
  });

  it("NEW-08: CTA — «Земля под твоё растение и всё для ритуала»", () => {
    expect(textOf(mainOf(page(ENTRY)))).toContain(
      "Земля под твоё растение и всё для ритуала",
    );
  });

  it("NEW-08: обращение на «ты» — «своё растение» не осталось нигде", () => {
    for (const route of ALL) {
      expect(textOf(mainOf(page(route))), route).not.toContain("своё растение");
    }
  });

  it("§4.5: внешняя ссылка про гниль корней закрыта rel=noopener", () => {
    const html = BRANCHES.map(page).join("");
    const external = html.match(/<a[^>]+epicgardening\.com[^>]*>/g) ?? [];
    expect(external.length).toBeGreaterThan(0);
    for (const tag of external) {
      expect(tag).toContain('target="_blank"');
      expect(tag).toContain("noopener");
    }
  });

  it("FIX-62: блоков «Готово, когда» нет — сняты решением 30.07", () => {
    for (const route of ALL) {
      expect(textOf(mainOf(page(route))), route).not.toMatch(/Готово,\s*когда/iu);
    }
  });
});
