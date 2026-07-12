import { readFileSync } from "node:fs";
import { resolve } from "node:path";

import { describe, expect, it } from "vitest";

/*
 * Эталон текстовых узлов прототипов guide.html / lab.html.
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
