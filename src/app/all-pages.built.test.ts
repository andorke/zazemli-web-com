import { describe, expect, it } from "vitest";

import { ALL_ROUTES, hasBuild, mainOf, readBuilt, textOf } from "@/lib/built-output";

/*
 * Сквозная приёмка PATCH-1 §7.1 по всем 15 макетам: то, что verify-prototypes.py
 * и audit-pages.py проверяют разом по всем страницам, а не по одной.
 *
 * Проверки главной живут в page.built.test.ts — здесь то, что должно держаться
 * везде, включая страницы, до которых приёмка раньше не доходила.
 */
const onBuild = hasBuild() ? describe : describe.skip;

const pages = ALL_ROUTES.map((route) => ({
  route,
  html: readBuilt(route) ?? "",
  main: mainOf(readBuilt(route) ?? ""),
}));

const headings = (main: string) =>
  [...main.matchAll(/<h[1-3][^>]*>([\s\S]*?)<\/h[1-3]>/g)].map((m) =>
    m[1].replace(/<[^>]+>/g, "").replace(/\s+/g, " ").trim(),
  );

onBuild("Все 15 макетов: сквозная приёмка", () => {
  it("экспорт содержит все страницы приёмки", () => {
    for (const page of pages) expect(page.html, page.route).not.toBe("");
  });

  /*
   * FIX-26: решение Насты 26.07 — заголовки display/h1/h2/h3 точкой не
   * заканчиваются, «?», «!» и «…» остаются (несут интонацию). У составных
   * внутренняя точка-разделитель сохраняется, снимается только финальная.
   * В прототипах точек 0; проверка гоняется по всем страницам, потому что
   * правка сквозная, а раньше сверялась только главная.
   */
  it("FIX-26: ни один заголовок не заканчивается точкой", () => {
    const bad = pages.flatMap(({ route, main }) =>
      headings(main)
        .filter((text) => text.endsWith(".") && !text.endsWith("..."))
        .map((text) => `${route}: ${text}`),
    );
    expect(bad).toEqual([]);
  });

  /* Канон: латынь — только род, вида на сайте нет (PATCH-1 §6) */
  it("канон: латынь только род — «Monstera deliciosa» и подобного нет", () => {
    const species = /\b(Monstera|Ficus|Anthurium|Aglaonema|Spathiphyllum|Zamioculcas|Epipremnum)\s+[a-z]{4,}/;
    const bad = pages
      .filter(({ main }) => species.test(textOf(main)))
      .map(({ route, main }) => `${route}: ${textOf(main).match(species)?.[0]}`);
    expect(bad).toEqual([]);
  });

  /* PATCH-1 §6: ИИ-штамп «не X. Это Y» снят редполитикой */
  it("канон: ИИ-штампа «не X. Это Y» нет", () => {
    const bad = pages
      /* `\b` на кириллице не работает (ASCII-класс) — начало слова задаём явно */
      .filter(({ main }) => /(?:^|[^\p{L}])не\s+[^.!?]{3,40}\.\s*Это\s/iu.test(textOf(main)))
      .map(({ route }) => route);
    expect(bad).toEqual([]);
  });

  /* FIX-09 / FIX-42: юр-футер и обе ссылки — на каждой странице */
  it("FIX-09: ОГРНИП в футере всех страниц", () => {
    const bad = pages.filter(({ html }) => !html.includes("326330000022761"));
    expect(bad.map((p) => p.route)).toEqual([]);
  });

  it("FIX-42: ссылки на /terms и /privacy есть везде", () => {
    const bad = pages.filter(
      ({ html }) => !html.includes('href="/terms"') || !html.includes('href="/privacy"'),
    );
    expect(bad.map((p) => p.route)).toEqual([]);
  });

  /* FIX-22 (audit-pages): иерархия заголовков без разрыва — после h1 не h3 */
  it("FIX-22: уровни заголовков не перепрыгивают через ступень", () => {
    const bad: string[] = [];
    for (const { route, main } of pages) {
      const levels = [...main.matchAll(/<h([1-3])\b/g)].map((m) => Number(m[1]));
      for (let i = 1; i < levels.length; i += 1) {
        if (levels[i] - levels[i - 1] > 1) bad.push(`${route}: h${levels[i - 1]} → h${levels[i]}`);
      }
    }
    expect(bad).toEqual([]);
  });

  /*
   * FIX-25 (skip-link) намеренно НЕ проверяется здесь: в прототипах он есть
   * (`<a class="skip" href="#main">`), в сборке отсутствует вовсе. Это не правка
   * текста, а новый компонент с поведением фокуса, которого нет ни в одной
   * действующей спеке, — по design D5 такая находка уходит отдельным change,
   * а не дописывается в приёмку. Находка зафиксирована в inventory.md.
   */
});
