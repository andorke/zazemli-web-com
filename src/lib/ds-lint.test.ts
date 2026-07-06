import { readdirSync, readFileSync, statSync } from "node:fs";
import { join } from "node:path";
import { describe, expect, it } from "vitest";

import { checkCssViolations, checkDsViolations } from "@/lib/ds-lint";

describe("checkDsViolations", () => {
  it("находит hex-литерал цвета", () => {
    expect(checkDsViolations('<div className="bg-[#fff]" />')).not.toHaveLength(
      0,
    );
    expect(checkDsViolations("color: #4A7C59")).not.toHaveLength(0);
  });

  it("находит box-shadow классы", () => {
    expect(checkDsViolations('className="shadow-md"')).not.toHaveLength(0);
    expect(checkDsViolations('className="hover:shadow-lg"')).not.toHaveLength(
      0,
    );
  });

  it("находит запрещённые радиусы", () => {
    expect(checkDsViolations('className="rounded-3xl"')).not.toHaveLength(0);
    expect(checkDsViolations('className="rounded-[10px]"')).not.toHaveLength(0);
  });

  it("пропускает разрешённые классы", () => {
    expect(
      checkDsViolations(
        'className="rounded-full rounded-lg bg-moss text-charcoal"',
      ),
    ).toHaveLength(0);
  });

  it("находит выведенные семейства (unbounded|spectral|caveat)", () => {
    expect(checkDsViolations('variable: "--font-unbounded"')).not.toHaveLength(
      0,
    );
    expect(checkDsViolations("/* Spectral italic */")).not.toHaveLength(0);
    expect(
      checkDsViolations('className="font-hand" /* Caveat */'),
    ).not.toHaveLength(0);
  });

  it("находит text-moss без метки ds-allow: moss-large", () => {
    expect(checkDsViolations('className="text-moss"')).not.toHaveLength(0);
    expect(checkDsViolations('className="hover:text-moss"')).not.toHaveLength(
      0,
    );
  });

  it("пропускает text-moss-ink и text-moss с меткой ds-allow: moss-large", () => {
    expect(checkDsViolations('className="text-moss-ink"')).toHaveLength(0);
    expect(
      checkDsViolations(
        '"text-moss opacity-80", // ds-allow: moss-large — фльерон',
      ),
    ).toHaveLength(0);
  });

  it("находит SKU-цвет как цвет текста", () => {
    expect(checkDsViolations('className="text-sku-ficus"')).not.toHaveLength(
      0,
    );
    expect(checkDsViolations('className="text-poppy"')).not.toHaveLength(0);
  });

  it("пропускает SKU-цвет в декоре (bg/border) и с меткой ds-allow: sku-accent", () => {
    expect(
      checkDsViolations('className="bg-sku-ficus border-sku-monstera"'),
    ).toHaveLength(0);
    expect(
      checkDsViolations(
        '"text-sku-ficus", // ds-allow: sku-accent — рукописный акцент SKU',
      ),
    ).toHaveLength(0);
  });

  it("находит устаревшие имена токенов var(--moss) → var(--color-moss)", () => {
    expect(checkDsViolations('fill: "var(--soil)"')).not.toHaveLength(0);
    expect(checkDsViolations("color: var(--moss)")).not.toHaveLength(0);
    /* --moss-ink никогда не существовал на :root — только --color-moss-ink */
    expect(checkDsViolations("color: var(--moss-ink)")).not.toHaveLength(0);
  });

  it("пропускает актуальные var(--color-*) и семантику shadcn", () => {
    expect(checkDsViolations('fill: "var(--color-soil)"')).toHaveLength(0);
    expect(checkDsViolations("var(--color-moss-ink)")).toHaveLength(0);
    expect(checkDsViolations("var(--background)")).toHaveLength(0);
  });
});

describe("checkCssViolations", () => {
  it("находит box-shadow в CSS", () => {
    expect(
      checkCssViolations(".x{box-shadow:0 1px 2px #000}"),
    ).not.toHaveLength(0);
  });

  it("пропускает hex (токены) и обычный CSS", () => {
    expect(checkCssViolations("--moss: #4a7c59;")).toHaveLength(0);
  });
});

/* Инвариант DS: исходники не содержат hex, теней, чужих радиусов и прочих
   нарушений правил. Цвета — только через токены globals.css (источник
   tokens.json v1.1.0). Скан — весь src/ (кроме тестов и самого ds-lint.ts:
   его правила содержат запрещённые паттерны как литералы). */
describe("DS-инвариант по src/", () => {
  const roots = ["src"];

  const collect = (dir: string): string[] =>
    readdirSync(dir).flatMap((name) => {
      const full = join(dir, name);
      if (statSync(full).isDirectory()) return collect(full);
      if (!/\.(ts|tsx)$/.test(name) || /\.test\./.test(name)) return [];
      if (name === "ds-lint.ts") return [];
      return [full];
    });

  it("hex-литералов, теней и запрещённых радиусов нет", () => {
    const offenders: Record<string, string[]> = {};
    for (const root of roots) {
      for (const file of collect(root)) {
        const violations = checkDsViolations(readFileSync(file, "utf8"));
        if (violations.length) offenders[file] = violations;
      }
    }
    expect(offenders).toEqual({});
  });

  it("в globals.css нет box-shadow (shadow: null)", () => {
    expect(
      checkCssViolations(readFileSync("src/app/globals.css", "utf8")),
    ).toHaveLength(0);
  });
});
