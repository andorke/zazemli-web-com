import { describe, expect, it } from "vitest";

import { privacy, type PrivacySection } from "@/content/privacy";

/* Весь текст раздела одной строкой — для проверок на вхождение фраз/законов. */
function sectionText(section: PrivacySection): string {
  return section.body
    .flatMap((block) => {
      if (block.kind === "paragraph") return [block.text];
      if (block.kind === "list") return block.items;
      return [];
    })
    .join(" ");
}

describe("Политика конфиденциальности — разделы", () => {
  it("ровно 11 разделов дословно и по порядку из прототипа", () => {
    expect(privacy.sections.map((s) => s.title)).toEqual([
      "Общие положения",
      "Термины",
      "Какие данные мы обрабатываем",
      "Цели обработки",
      "Правовые основания",
      "Порядок и сроки обработки",
      "Передача данных третьим лицам",
      "Файлы cookie и веб-аналитика",
      "Права субъекта персональных данных",
      "Меры защиты",
      "Изменения Политики",
    ]);
  });

  it("раздел «Правовые основания» ссылается на 152-ФЗ и 38-ФЗ", () => {
    const legal = privacy.sections.find((s) => s.title === "Правовые основания");
    expect(legal).toBeDefined();
    const text = sectionText(legal!);
    expect(text).toContain("152-ФЗ");
    expect(text).toContain("38-ФЗ");
  });
});

describe("Политика конфиденциальности — оператор и дата", () => {
  it("оператор — ИП Минетто с ОГРНИП, ИНН, адресом и email", () => {
    const op = privacy.operator;
    expect(op.legalName).toContain("Минетто");
    expect(op.ogrnip).toBe("326330000022761");
    expect(op.inn).toBe("330576842933");
    expect(op.address).toContain("Ковров");
    expect(op.email).toBe("team@zazemli.com");
  });

  it("блок реквизитов оператора — в первом разделе", () => {
    expect(privacy.sections[0].body.some((b) => b.kind === "operator")).toBe(
      true,
    );
  });

  it("дата вступления в силу — 13 июля 2026", () => {
    expect(privacy.effectiveDate).toContain("13 июля 2026");
  });
});
