import { existsSync, readFileSync } from "node:fs";
import { resolve } from "node:path";

import { describe, expect, it } from "vitest";

/*
 * Приёмка PATCH-1 §7.1 по СОБРАННОЙ главной: применимые проверки из
 * ../zazemli-vault/Айти/Сайт/verify-prototypes.py, переложенные на out/index.html.
 * Скрипт проверяет прототипы; патч требует прогнать те же регулярки по сборке —
 * иначе правка «стоит ✅ в отчёте, а в файле её нет» (ровно так и сорвалась
 * прошлая итерация).
 *
 * Сборки в рабочем дереве может не быть (`npm run build` — отдельный шаг, out/
 * в git не попадает), поэтому проверки мягко скипаются: смысл теста —
 * воспроизводимость, а не блокировка обычного прогона vitest.
 */
const OUT = resolve(process.cwd(), "out", "index.html");
const built = existsSync(OUT) ? readFileSync(OUT, "utf8") : null;
const onBuild = built ? describe : describe.skip;

/* Страницы товара — та же приёмка состава и цен (FIX-05/70, FIX-02) */
const SKU_SLUGS = [
  "monstera",
  "ficus",
  "anthurium",
  "aglaonema",
  "spathiphyllum",
  "zamioculcas",
  "epipremnum",
];
const skuPages = SKU_SLUGS.map((slug) => {
  const file = resolve(process.cwd(), "out", "collectio", `${slug}.html`);
  return { slug, html: existsSync(file) ? readFileSync(file, "utf8") : "" };
});

/* Цены в сборке набраны неразрывным пробелом — ищем оба варианта (PATCH-1 §6) */
const SP = "[ \\u00A0]";
/*
 * `\w` в JS — ASCII-класс, на кириллице он не работает: «баночк\w*\s+» не найдёт
 * «баночка угольной», и проверка молча вырождается в вечнозелёную. Словоформы
 * задаём через \p{L} с флагом u — та же ловушка, что с неразрывным пробелом.
 */
const ru = (source: string) => new RegExp(source, "iu");
const W = "\\p{L}*";

/* Текст без разметки: порядок блоков и заголовки проверяем по нему */
const text = (built ?? "").replace(/<[^>]+>/g, "\n");

onBuild("Собранная главная: приёмка verify-prototypes.py", () => {
  it("FIX-02: старых цен 1 890 / 2 190 / 2 590 нет ни в одном варианте пробела", () => {
    expect(built).not.toMatch(new RegExp(`1${SP}890|2${SP}190|2${SP}590`));
  });

  it("FIX-02: новые цены на месте — на главной 1 990 и 2 290, все три на карточках", () => {
    for (const price of [`1${SP}990`, `2${SP}290`]) {
      expect(built, `нет цены ${price} на главной`).toMatch(new RegExp(price));
    }
    /* 2 690 — цена объёма 3,5 л: на главной её нет, она живёт на карточках */
    const withPrices = skuPages.filter((p) =>
      new RegExp(`[12]${SP}[0-9]90`).test(p.html),
    );
    expect(withPrices).toHaveLength(7);
    expect(skuPages.some((p) => new RegExp(`2${SP}690`).test(p.html))).toBe(
      true,
    );
  });

  it("FIX-03: текстовых плейсхолдеров в квадратных скобках нет", () => {
    expect(built).not.toMatch(/\[\s*(атмосферное|ритуал|фото|раскладка)/i);
  });

  it("FIX-04: «природной почвы» нет", () => {
    expect(built).not.toMatch(ru(`природн${W}\\s+почв`));
  });

  it("FIX-05 / FIX-70: «баночка угольной пудры» на главной и всех 7 карточках", () => {
    const jar = ru(`баночк${W}\\s+угольн${W}\\s+пудр${W}`);
    expect(built).toMatch(jar);
    for (const page of skuPages) {
      expect(page.html, `карточка ${page.slug}`).toMatch(jar);
    }
    expect(built).not.toMatch(/бутылочк/iu);
  });

  it("FIX-13: порядок блоков главной = home.md v2.5", () => {
    const order = [
      "Всё на одну пересадку",
      "Семь растений — семь рецептур земли",
      "Три шага — и растение в новой земле",
      "Растению — дом, тебе — меньше хлопот",
      "О нас",
      "Одиннадцать компонентов, семь рецептур",
      "Купить",
    ].map((marker) => text.indexOf(marker));
    expect(order, "какого-то блока нет в сборке").not.toContain(-1);
    expect(order).toEqual([...order].sort((a, b) => a - b));
  });

  it("FIX-13: «Что в боксе» — первый смысловой блок под hero", () => {
    expect(text.indexOf("Всё на одну пересадку")).toBeLessThan(
      text.indexOf("Семь растений — семь рецептур земли"),
    );
    expect(text.indexOf("Что в боксе")).toBeLessThan(
      text.indexOf("Collectio Zazemli"),
    );
  });

  it("FIX-26: ни один h1/h2/h3 не заканчивается точкой", () => {
    const headings = [
      /* [\s\S] вместо флага s: target проекта — ES2017, dotAll там недоступен */
      ...(built ?? "").matchAll(/<h[123][^>]*>([\s\S]*?)<\/h[123]>/g),
    ]
      .map((m) => m[1].replace(/<[^>]+>/g, "").trim())
      .filter(Boolean);
    expect(headings.length).toBeGreaterThan(3);
    expect(headings.filter((h) => h.endsWith("."))).toEqual([]);
  });

  it("FIX-27: «рецептур», а не «рецептов земли»", () => {
    expect(built).not.toMatch(/рецептов\s+земли/i);
    expect(built).toMatch(/рецептур/i);
  });

  it("FIX-78: секций манифеста и колб на главной нет", () => {
    expect(built).not.toMatch(/Разным растениям/);
    expect(built).not.toMatch(/Для растения/);
  });

  it("NEW-03: три плитки объёмов с диаметром горшка", () => {
    for (const volume of ["1,2 л", "2,2 л", "3,5 л"]) {
      expect(built, `нет плитки ${volume}`).toContain(volume);
    }
    for (const pot of ["12–13 см", "15–16 см", "18–20 см"]) {
      expect(built, `нет диаметра ${pot}`).toContain(pot);
    }
    expect(built).toContain("Пересаживают раз в год, весной");
  });

  it("NEW-03: плитки не кликабельны — в блоке «Купить» нет ссылок на объёмы", () => {
    const buy = (built ?? "").slice((built ?? "").lastIndexOf("Купить"));
    expect(buy).not.toMatch(/<a[^>]*>\s*(1,2|2,2|3,5) л/);
  });

  it("NEW-03: кофе-якоря и финал-мысли в блоке «Купить» нет", () => {
    expect(built).not.toMatch(/чашек кофе/i);
    expect(built).not.toMatch(/собранный опыт пересадки/i);
  });

  it("NEW-04: тейк Т3 живёт в шаге 03, а не в блоке «Купить»", () => {
    const take = "Бокс заканчивается в день пересадки. Дневник — нет";
    expect(text).toContain(take);
    expect(text.indexOf("Ведёшь дневник")).toBeLessThan(text.indexOf(take));
    expect(text.indexOf(take)).toBeLessThan(text.lastIndexOf("Купить"));
  });

  it("FIX-35: risk-reversal с team@zazemli.com", () => {
    expect(built).toContain("Сомневаешься с объёмом");
    expect(built).toContain("mailto:team@zazemli.com");
  });

  it("PATCH-1 §6: запрещённой лексики в сборке нет", () => {
    for (const word of [
      "почвосмесь",
      "конвертик",
      "апельсин",
      "метаанализ",
      "премиум-бокс",
      "осознанность",
    ]) {
      expect(built?.toLowerCase(), `слово «${word}»`).not.toContain(word);
    }
  });
});
