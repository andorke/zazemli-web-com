import { readFileSync } from "node:fs";
import { resolve } from "node:path";

import { describe, expect, it } from "vitest";

/*
 * Эталон текстовых узлов прототипов гайда (вход + два маршрута) и lab.html.
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
const perevalka = load("guide-perevalka");
const polnayaZamena = load("guide-polnaya-zamena");
const lab = load("lab");
const contains = (nodes: string[], sub: string) =>
  nodes.some((n) => n.includes(sub));

describe("Эталон прототипа входа /guide (extract-prototype-text.mjs)", () => {
  it("непустой, несёт hero и флоу-строку 00–04", () => {
    expect(guide.length).toBeGreaterThan(30);
    expect(guide).toContain("Руки в землю — голова свободна");
    for (const stage of [
      "Подготовка",
      "Забота о руках и корнях",
      "Дренаж",
      "Грунт и посадка",
      "Дневник",
    ]) {
      expect(guide).toContain(stage);
    }
  });

  it("обрывается на развилке: две кнопки маршрутов, шагов 02–04 нет", () => {
    expect(guide).toContain("Теперь выбери, как пересаживать");
    expect(contains(guide, "Выбираю перевалку")).toBe(true);
    expect(contains(guide, "Выбираю полную замену")).toBe(true);
    expect(contains(guide, "Высыпь керамзит на дно нового горшка")).toBe(false);
  });

  it("«Готово, когда» снято на всех трёх страницах (FIX-62 отменён)", () => {
    for (const nodes of [guide, perevalka, polnayaZamena]) {
      expect(contains(nodes, "Готово, когда")).toBe(false);
    }
  });
});

describe("Эталоны прототипов маршрутов гайда", () => {
  it("перевалка: свой hero, стадии 02–04 и ссылка на полную замену", () => {
    expect(perevalka.length).toBeGreaterThan(20);
    expect(perevalka).toContain("Не замена, но дополнение");
    for (const stage of ["Дренаж", "Грунт и посадка", "Дневник"]) {
      expect(perevalka).toContain(stage);
    }
    expect(contains(perevalka, "Это не мой случай, нужна замена грунта")).toBe(
      true,
    );
  });

  it("полная замена: «Продолжение», ссылка про гниль корней и перевалка рядом", () => {
    expect(polnayaZamena.length).toBeGreaterThan(20);
    expect(polnayaZamena).toContain("Пусти корни в новую землю");
    expect(polnayaZamena).toContain("Продолжение · забота о корнях");
    expect(
      contains(polnayaZamena, "как отличить здоровые корни от гнилых и сухих"),
    ).toBe(true);
    expect(contains(polnayaZamena, "Это не мой случай, нужна перевалка")).toBe(
      true,
    );
  });

  it("общие шаги «Дренаж» и «Дневник» присутствуют в обоих эталонах дословно", () => {
    for (const line of [
      "Высыпь керамзит на дно нового горшка — примерно на четверть высоты",
      "Заведи дневник: впиши имя растения и дату заземления",
    ]) {
      expect(perevalka).toContain(line);
      expect(polnayaZamena).toContain(line);
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
