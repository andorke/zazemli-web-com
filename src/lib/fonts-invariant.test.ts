import { readdirSync, readFileSync, statSync } from "node:fs";
import { join } from "node:path";
import { describe, expect, it } from "vitest";

/*
 * Инвариант ds-migration: семейства Unbounded/Spectral/Caveat выведены из src/
 * полностью — ни файлов шрифтов, ни CSS-переменных, ни классов, ни имён компонентов
 * (spec design-system «Старые семейства выведены»). Тестовые файлы и ds-lint.ts
 * исключены: они и есть проверяющий код (содержат запрещающий паттерн).
 */

const LEGACY = /unbounded|spectral|caveat/i;

const collect = (dir: string): string[] =>
  readdirSync(dir).flatMap((name) => {
    const full = join(dir, name);
    if (statSync(full).isDirectory()) return collect(full);
    if (/\.test\./.test(name) || name === "ds-lint.ts") return [];
    return [full];
  });

describe("старые шрифтовые семейства выведены из src/", () => {
  it("имена файлов не содержат unbounded|spectral|caveat", () => {
    expect(collect("src").filter((f) => LEGACY.test(f))).toEqual([]);
  });

  it("содержимое файлов не упоминает unbounded|spectral|caveat", () => {
    const offenders = collect("src").filter(
      (f) =>
        /\.(ts|tsx|css)$/.test(f) && LEGACY.test(readFileSync(f, "utf8")),
    );
    expect(offenders).toEqual([]);
  });
});
