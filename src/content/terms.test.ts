import { describe, expect, it } from "vitest";

import { terms, type TermsSection } from "@/content/terms";

/* Весь текст раздела одной строкой — для проверок на вхождение формулировок. */
function sectionText(section: TermsSection): string {
  return section.body
    .flatMap((block) => {
      if (block.kind === "paragraph") return [block.text];
      if (block.kind === "list") return block.items;
      return [];
    })
    .join(" ");
}

function sectionByTitle(title: string): TermsSection {
  const section = terms.sections.find((s) => s.title === title);
  expect(section, `раздел «${title}»`).toBeDefined();
  return section!;
}

describe("Условия использования — разделы", () => {
  it("ровно 8 разделов дословно и по порядку из прототипа", () => {
    expect(terms.sections.map((s) => s.title)).toEqual([
      "Кто мы и что регулирует этот документ",
      "Статус документа и согласие",
      "Что Сайт делает, а чего не делает",
      "Интеллектуальная собственность",
      "Что делать нельзя",
      "Формы обратной связи",
      "Сайт предоставляется «как есть»",
      "Заключительные положения",
    ]);
  });

  /* Сайт — витрина: заказ и оплата идут на Ozon, страница не должна читаться
     как оферта (то же обязательство держит юр-строка футера). */
  it("раздел о назначении Сайта фиксирует, что это не публичная оферта", () => {
    expect(
      sectionText(sectionByTitle("Что Сайт делает, а чего не делает")),
    ).toContain("Сайт не является публичной офертой.");
  });

  /* FIX-76: пока свидетельства нет, в тексте стоит номер заявки. После выдачи
     формулировка меняется на «товарный знак, свидетельство №…» — тест поймает
     расхождение, если номер заявки потеряется при следующем переносе. */
  it("раздел об интеллектуальной собственности называет заявку на товарный знак", () => {
    const ip = sectionText(sectionByTitle("Интеллектуальная собственность"));
    expect(ip).toContain("заявка № 2026753425 от 20.04.2026");
  });
});

describe("Условия использования — владелец и дата", () => {
  it("владелец — ИП Минетто с ОГРНИП, ИНН и email, без адреса", () => {
    const op = terms.operator;
    expect(op.legalName).toContain("Минетто");
    expect(op.ogrnip).toBe("326330000022761");
    expect(op.inn).toBe("330576842933");
    expect(op.email).toBe("team@zazemli.com");
  });

  it("врезка реквизитов — в первом разделе", () => {
    expect(terms.sections[0].body.some((b) => b.kind === "operator")).toBe(
      true,
    );
  });

  it("дата вступления в силу — 13 июля 2026 (редакция прототипа)", () => {
    expect(terms.effectiveDate).toContain("13 июля 2026");
  });
});
