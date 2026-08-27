import { describe, expect, it } from "vitest";

import { hasBuild, mainOf, readBuilt, textOf } from "@/lib/built-output";

/*
 * Приёмка PATCH-1 §7.1 по собранной /lab. Проверки verify-prototypes.py:
 * FIX-50 (заголовок), FIX-43 (научное обоснование), FIX-72 (канцелярит),
 * FIX-78 (трио колб переехало сюда с главной).
 */
const onBuild = hasBuild() ? describe : describe.skip;
const html = readBuilt("/lab") ?? "";
const main = mainOf(html);
const text = textOf(main);

onBuild("Собранная /lab: приёмка verify-prototypes.py", () => {
  it("FIX-50: заголовок — «Из чего мы собираем землю»", () => {
    expect(text).toContain("Из чего мы собираем землю");
    expect(text).not.toContain("Из чего собраны эти земли");
  });

  it("FIX-72: канцелярита «благополучия» и «в равной мере» нет", () => {
    expect(text).not.toMatch(/благополучи/iu);
    expect(text).not.toContain("в равной мере");
  });

  it("NEW-08: обращение на «ты» — «своё растение» не осталось", () => {
    expect(text).not.toContain("своё растение");
  });

  it("§6 потолок фактов: долговечность земли — годами, не десятилетиями", () => {
    /* «гранулы стабильны десятилетиями» про цеолит канон допускает — ловим
       только заявление про то, что земля не уплотняется десятилетиями */
    expect(text).not.toMatch(/не уплотняется десятилетиями/iu);
  });

  it("FIX-78: трио схема-колб переехало на вход /lab", () => {
    expect(text).toContain("Разным растениям — разная земля");
  });

  it("FIX-43: научное обоснование компонентов на месте", () => {
    expect(text).toContain("Мы не просим верить на слово");
    expect(text).toMatch(/источник|исследован|стандарт/iu);
  });

  it("семь рецептур раскрыты на странице", () => {
    const recipes = [...main.matchAll(/id="rec-([a-z]+)"/g)].map((m) => m[1]);
    expect(new Set(recipes).size).toBe(7);
  });

  it("дисклеймер /lab присутствует в футере", () => {
    expect(textOf(html)).toMatch(/не является (медицинской|публичной)|носит справочный/iu);
  });
});
