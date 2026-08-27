import { describe, expect, it } from "vitest";

import { hasBuild, mainOf, readBuilt, textOf } from "@/lib/built-output";

/*
 * Приёмка PATCH-1 §4б по собранным юр-страницам: FIX-11 (дата редакции),
 * FIX-45 и FIX-46 (состав /privacy), FIX-08 и FIX-76 (/terms), плюс правило
 * минимизации: адрес и ИНН на сайте не публикуются, только team@zazemli.com.
 */
const onBuild = hasBuild() ? describe : describe.skip;
const privacy = textOf(mainOf(readBuilt("/privacy") ?? ""));
const terms = textOf(mainOf(readBuilt("/terms") ?? ""));

onBuild("Собранные /privacy и /terms: приёмка PATCH-1 §4б", () => {
  it("FIX-11: дата политики — 20 июля 2026 (дата начала обработки в уведомлении РКН)", () => {
    expect(privacy).toMatch(/20 июля 2026/);
  });

  it("FIX-45: цель обработки «Лист ожидания» описана", () => {
    expect(privacy).toMatch(/лист[а]? ожидания/iu);
  });

  it("FIX-46: разделы «Принципы обработки» и «Порядок обращения» на месте", () => {
    expect(privacy).toMatch(/принцип/iu);
    expect(privacy).toMatch(/обращени/iu);
  });

  it("редакция /privacy — 13 разделов", () => {
    const sections = [...mainOf(readBuilt("/privacy") ?? "").matchAll(/<h2[^>]*>/g)];
    expect(sections).toHaveLength(13);
  });

  it("FIX-08: /terms собрана и содержит разделы", () => {
    expect(terms).not.toBe("");
    expect(terms.length).toBeGreaterThan(500);
  });

  it("FIX-76: реквизиты заявки на товарный знак № 2026753425 от 20.04.2026", () => {
    expect(terms).toMatch(/2026753425/);
  });

  it("минимизация: ИНН и адрес регистрации на страницах не публикуются", () => {
    for (const [name, page] of [["privacy", privacy], ["terms", terms]] as const) {
      expect(page, name).not.toMatch(/\bИНН\b/);
      expect(page, name).not.toMatch(/\b(ул\.|улица|д\.\s?\d|кв\.\s?\d)/iu);
    }
  });

  it("контакт — только почта команды", () => {
    expect(privacy + terms).toContain("team@zazemli.com");
  });
});
