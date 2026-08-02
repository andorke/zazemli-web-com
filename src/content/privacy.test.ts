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

  it("дата вступления в силу — 13 июля 2026", () => {
    expect(privacy.effectiveDate).toContain("13 июля 2026");
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
