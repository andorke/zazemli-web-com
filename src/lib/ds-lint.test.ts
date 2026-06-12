import { readdirSync, readFileSync, statSync } from "node:fs";
import { join } from "node:path";
import { describe, expect, it } from "vitest";

import { checkDsViolations } from "@/lib/ds-lint";

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
});

/* Инвариант DS: компоненты и роуты не содержат hex, теней и чужих радиусов.
   Цвета — только через токены globals.css (источник tokens.json v1.0.1). */
describe("DS-инвариант по src/", () => {
  const roots = ["src/components", "src/app"];

  const collect = (dir: string): string[] =>
    readdirSync(dir).flatMap((name) => {
      const full = join(dir, name);
      if (statSync(full).isDirectory()) return collect(full);
      if (!/\.(ts|tsx)$/.test(name) || /\.test\./.test(name)) return [];
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
});
