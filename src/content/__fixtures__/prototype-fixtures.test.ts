import { readFileSync } from "node:fs";
import { resolve } from "node:path";

import { describe, expect, it } from "vitest";

/*
 * Эталон текстовых узлов прототипов guide.html / lab.html / landing.html.
 * Файлы .prototype.txt генерирует scripts/extract-prototype-text.mjs из vault
 * (read-only, в CI недоступен) и коммитятся в репозиторий. Этот тест защищает
 * целостность эталона; контент-тесты guide.ts/lab.ts сверяют перенос против него.
 */
function load(name: string): string[] {
  const raw = readFileSync(
    resolve(process.cwd(), "src/content/__fixtures__", `${name}.prototype.txt`),
    "utf8",
  );
  return raw.split("\n").filter((line) => line.length > 0);
}

const guide = load("guide");
const lab = load("lab");
const landing = load("landing");
const contains = (nodes: string[], sub: string) =>
  nodes.some((n) => n.includes(sub));

describe("Эталон прототипа /guide (extract-prototype-text.mjs)", () => {
  it("непустой и покрывает hero + 5 CJM-стадий 00–04", () => {
    expect(guide.length).toBeGreaterThan(30);
    expect(guide).toContain("Руки в землю — голова свободна.");
    for (const stage of ["Подготовка", "Конверт", "Дренаж", "Грунт", "Забота"]) {
      expect(guide).toContain(stage);
    }
  });

  it("несёт паттерн стадии: «Что понадобится», «Шаги», «Готово, когда»", () => {
    for (const label of ["Что понадобится", "Шаги", "Готово, когда"]) {
      expect(guide).toContain(label);
    }
  });
});

describe("Эталон прототипа /lab (extract-prototype-text.mjs)", () => {
  it("непустой и покрывает hero, проблему, заголовки секций, слоган", () => {
    expect(lab.length).toBeGreaterThan(100);
    expect(lab).toContain("Лаборатория грунта.");
    expect(lab).toContain("Универсальный грунт не под твоё растение.");
    expect(lab).toContain("По одной земле на каждое растение.");
    expect(lab).toContain("Из чего собраны эти земли.");
    expect(lab).toContain("Мы не просим верить на слово.");
    expect(lab).toContain("Эмпирика надёжнее.");
  });

  it("несёт 7 рецептур N°01–N°07 и научный якорь Bugbee & Frink", () => {
    for (const n of ["N°01", "N°02", "N°03", "N°04", "N°05", "N°06", "N°07"]) {
      expect(lab).toContain(n);
    }
    expect(contains(lab, "Bugbee & Frink")).toBe(true);
  });
});

describe("Эталон прототипа / (extract-prototype-text.mjs)", () => {
  // Порядок блоков главной v2.5 (home.md v2.5 / PATCH-1 §2): «Что в боксе» —
  // второй блок, сразу под hero. На сверке с устаревшей v2.3 (пятая позиция)
  // ошиблась прошлая итерация, поэтому порядок зафиксирован тестом.
  it("держит порядок блоков v2.5: hero → что в боксе → галерея → три шага → что даёт → о нас → тизеры → купить", () => {
    const order = [
      "Заземли растение. Заземли себя",
      "Всё на одну пересадку",
      "Семь растений — семь рецептур земли",
      "Три шага — и растение в новой земле",
      "Растению — дом, тебе — меньше хлопот",
      "О нас",
      "Одиннадцать компонентов, семь рецептур",
      "Купить",
    ].map((title) => landing.indexOf(title));
    expect(order).not.toContain(-1);
    expect(order).toEqual([...order].sort((a, b) => a - b));
  });

  it("несёт правки PATCH-1 §2 и чист по лексике §6", () => {
    // NEW-03/NEW-04, FIX-02/04/28/72: состав заботы, Т3 в шаге 03, плитки размеров, цены, core formula
    expect(landing).toContain(
      "баночка угольной пудры, чтобы подсушить свежий срез",
    );
    expect(landing).toContain(
      "Бокс заканчивается в день пересадки. Дневник — нет",
    );
    expect(landing).toContain("Пересаживают раз в год, весной");
    expect(landing).toContain("Земля и забота — всё, что нужно.");
    expect(contains(landing, "от 1 990 ₽")).toBe(true);
    expect(contains(landing, "всегда в спешке")).toBe(true);
    // снятые блоки: манифест-сплит и колбы «Разным растениям — разная земля»
    expect(contains(landing, "Для растения")).toBe(false);
    expect(contains(landing, "Разным растениям")).toBe(false);
    for (const banned of [
      "природн",
      "конвертик",
      "апельсин",
      "рецептов земли",
      "бутылочка",
      "почвосмесь",
      "уникальн",
    ]) {
      expect(contains(landing, banned)).toBe(false);
    }
  });
});
