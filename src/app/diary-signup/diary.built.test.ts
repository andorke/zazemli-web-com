import { describe, expect, it } from "vitest";

import { hasBuild, mainOf, readBuilt, textOf } from "@/lib/built-output";

/*
 * Приёмка PATCH-1 §7.1 по собранной /diary-signup — вторая форма сбора email
 * (её конструкция патчем не менялась, в отличие от N°08). FIX-06, FIX-12.
 */
const onBuild = hasBuild() ? describe : describe.skip;
const html = readBuilt("/diary-signup") ?? "";
const main = mainOf(html);
const text = textOf(main);

onBuild("Собранная /diary-signup: приёмка verify-prototypes.py", () => {
  it("страница вне индекса — noindex", () => {
    expect(html).toMatch(/name="robots" content="[^"]*noindex/);
  });

  it("вне sitemap — вход только по QR из печатного дневника", () => {
    const sitemap = readBuilt("/sitemap.xml") ?? "";
    const raw = sitemap || "";
    expect(raw).not.toContain("/diary-signup");
  });

  it("FIX-12: оба согласия не предзаполнены", () => {
    const boxes = [...main.matchAll(/<input[^>]*type="checkbox"[^>]*>/g)].map((m) => m[0]);
    expect(boxes.length).toBeGreaterThanOrEqual(2);
    for (const box of boxes) expect(box).not.toMatch(/\bchecked\b/);
  });

  /*
   * FIX-06 («кнопка НЕ disabled», ошибка на клик + фокус на первый неотмеченный)
   * здесь НЕ проверяется: он прямо противоречит действующей спеке diary-signup,
   * которая требует «кнопка submit SHALL быть заблокирована, пока не отмечен CB1».
   * Спека написана 13.07, патч и прототипы новее — но это расхождение двух
   * источников истины, а не дефект кода, и по design D5 его снимает решение
   * владельца, а не приёмка. Зафиксировано в inventory.md.
   */

  it("core formula закрывает страницу", () => {
    expect(text).toContain("Земля и забота — всё, что нужно");
  });
});
