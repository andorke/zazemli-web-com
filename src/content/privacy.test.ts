import { existsSync, readdirSync, readFileSync, statSync } from "node:fs";
import { join } from "node:path";
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

/* Пункты всех списков раздела — когда важно, что формулировки лежат в разных пунктах. */
function sectionListItems(section: PrivacySection): string[] {
  return section.body.flatMap((block) =>
    block.kind === "list" ? block.items : [],
  );
}

function sectionByTitle(title: string): PrivacySection {
  const section = privacy.sections.find((s) => s.title === title);
  expect(section, `раздел «${title}»`).toBeDefined();
  return section!;
}

describe("Политика конфиденциальности — разделы", () => {
  it("ровно 13 разделов дословно и по порядку из прототипа", () => {
    expect(privacy.sections.map((s) => s.title)).toEqual([
      "Общие положения",
      "Термины",
      "Какие данные мы обрабатываем",
      "Принципы обработки",
      "Цели обработки",
      "Правовые основания",
      "Порядок и сроки обработки",
      "Передача данных третьим лицам",
      "Файлы cookie и веб-аналитика",
      "Права субъекта персональных данных",
      "Порядок обращения",
      "Меры защиты",
      "Изменения Политики",
    ]);
  });

  /* Два согласия — разные основания и разные пункты: ПДн по 152-ФЗ и реклама
     по ст. 18 38-ФЗ, второе запрашивается отдельно от первого. */
  it("раздел «Правовые основания» разделяет согласие на ПДн и на рассылку", () => {
    const items = sectionListItems(sectionByTitle("Правовые основания"));
    const pdn = items.filter((i) => i.includes("152-ФЗ"));
    const ads = items.filter((i) => i.includes("38-ФЗ"));
    expect(pdn).toHaveLength(1);
    expect(ads).toHaveLength(1);
    expect(ads[0]).not.toBe(pdn[0]);
    expect(ads[0]).toContain("отдельно");
  });

  /* Уведомление «Листа ожидания» рассылкой не является. Явной фразы в редакции
     прототипа нет — разделение выражено структурно: рассылка и лист ожидания
     это разные цели, а обработка по каждой цели идёт отдельно. Тест держит
     именно это разделение: описание листа ожидания не должно съехать в рассылку. */
  it("«Лист ожидания» — отдельная цель, а не email-рассылка", () => {
    const goals = sectionByTitle("Цели обработки");
    const items = sectionListItems(goals);
    const mailing = items.filter((i) => /рассылк/i.test(i));
    const waitlist = items.filter((i) => /лист ожидания/i.test(i));
    expect(mailing).toHaveLength(1);
    expect(waitlist).toHaveLength(1);
    expect(waitlist[0]).not.toBe(mailing[0]);
    expect(waitlist[0]).not.toMatch(/рассылк/i);
    expect(sectionText(goals)).toContain(
      "Обработка для каждой цели осуществляется отдельно",
    );
  });
});

describe("Политика конфиденциальности — оператор и дата", () => {
  it("оператор — ИП Минетто с ОГРНИП, ИНН и email, без адреса", () => {
    const op = privacy.operator;
    expect(op.legalName).toContain("Минетто");
    expect(op.ogrnip).toBe("326330000022761");
    expect(op.inn).toBe("330576842933");
    expect(op.email).toBe("team@zazemli.com");
  });

  it("блок реквизитов оператора — в первом разделе", () => {
    expect(privacy.sections[0].body.some((b) => b.kind === "operator")).toBe(
      true,
    );
  });

  it("дата вступления в силу — 20 июля 2026 (редакция прототипа)", () => {
    expect(privacy.effectiveDate).toContain("20 июля 2026");
  });
});

/* Регресс FIX-01: почтовый адрес ИП не публикуется нигде на сайте. Адрес попал
   в privacy.ts из устаревшего канона PDN-152FZ-SPEC §4a — скан исходников и
   собранного out/ не даёт утечке вернуться при следующем переносе текстов.
   Сам этот файл исключён из скана: маркеры лежат в нём литералами. */
describe("Адрес ИП нигде не публикуется", () => {
  const markers = /ковров|строителей/i;
  const textFile = /\.(ts|tsx|css|svg|html|js|txt|xml|json)$/;

  const collect = (dir: string): string[] =>
    readdirSync(dir).flatMap((name) => {
      const full = join(dir, name);
      if (statSync(full).isDirectory()) return collect(full);
      if (!textFile.test(name)) return [];
      if (full === join("src", "content", "privacy.test.ts")) return [];
      return [full];
    });

  const offendersIn = (root: string): string[] =>
    collect(root).filter((file) => markers.test(readFileSync(file, "utf8")));

  it("маркеров адреса нет в src/", () => {
    expect(offendersIn("src")).toEqual([]);
  });

  /* out/ появляется только после npm run build — без него проверка пропускается,
     чтобы npm run test оставался зелёным на чистом дереве. */
  it.skipIf(!existsSync("out"))("маркеров адреса нет в out/", () => {
    expect(offendersIn("out")).toEqual([]);
  });
});
