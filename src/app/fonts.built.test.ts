import { existsSync, readdirSync, readFileSync } from "node:fs";
import { resolve } from "node:path";

import { describe, expect, it } from "vitest";

import { ALL_ROUTES, hasBuild, readBuilt } from "@/lib/built-output";

/*
 * Приёмка PATCH-1 §7.2 (шрифт) по сборке — то, что патч требует проверять при
 * каждом деплое: voice-файл называется mulish, шрифты не тянутся с внешнего
 * домена (иначе IP посетителя уходит в Google при хостинге РФ и уведомлении
 * РКН), заголовки идут с отрицательным трекингом. Нулевой трекинг на заголовке
 * патч считает ошибкой сборки: у гротеска трекинг несущий, а не косметика.
 */
const onBuild = hasBuild() ? describe : describe.skip;
const MEDIA = resolve(process.cwd(), "out", "_next", "static", "media");
const mediaFiles = existsSync(MEDIA) ? readdirSync(MEDIA) : [];
const pages = ALL_ROUTES.map((route) => ({ route, html: readBuilt(route) ?? "" }));

onBuild("Приёмка §7.2: шрифт в сборке", () => {
  it("voice-шрифт лежит в /_next/static/media и называется mulish", () => {
    const fonts = mediaFiles.filter((f) => /\.woff2?$/.test(f));
    expect(fonts.length, "шрифтов в сборке нет вовсе").toBeGreaterThan(0);
    expect(fonts.some((f) => /mulish/i.test(f)), `файлы: ${fonts.join(", ")}`).toBe(true);
  });

  it("выведенных из системы семейств в сборке нет", () => {
    const dropped = /literata|newsreader|unbounded|spectral/i;
    expect(mediaFiles.filter((f) => dropped.test(f))).toEqual([]);
  });

  it("ни одна страница не тянет шрифты с внешнего домена", () => {
    const bad = pages.filter(({ html }) => /fonts\.(googleapis|gstatic)\.com/.test(html));
    expect(bad.map((p) => p.route)).toEqual([]);
  });

  it("трекинг заголовков отрицательный — нулевой патч считает ошибкой сборки", () => {
    const bundle = cssBundle();
    expect(bundle, "css-бандла в сборке нет").not.toBe("");
    /* токены трекинга из font-mulish: от −0.035em на display до +0.2em на eyebrow */
    const tracking = [...bundle.matchAll(/(--tracking-[a-z0-9-]+):\s*(-?[\d.]+)em/g)].map((m) => ({
      token: m[1],
      value: Number(m[2]),
    }));
    expect(tracking.length, "токенов трекинга в бандле нет").toBeGreaterThan(0);
    const headings = tracking.filter(({ token }) => /display|h1|h2|take/.test(token));
    expect(headings.length).toBeGreaterThan(0);
    for (const { token, value } of headings) {
      expect(value, `${token} должен быть отрицательным`).toBeLessThan(0);
    }
    const eyebrow = tracking.find(({ token }) => /eyebrow/.test(token));
    if (eyebrow) expect(eyebrow.value).toBeGreaterThan(0);
  });
});

/** CSS статического экспорта лежит в _next/static/chunks, а не в отдельной css-папке. */
function cssBundle(): string {
  const root = resolve(process.cwd(), "out", "_next", "static");
  if (!existsSync(root)) return "";
  const stack = [root];
  const parts: string[] = [];
  while (stack.length) {
    const dir = stack.pop() as string;
    for (const entry of readdirSync(dir, { withFileTypes: true })) {
      const full = resolve(dir, entry.name);
      if (entry.isDirectory()) stack.push(full);
      else if (entry.name.endsWith(".css")) parts.push(readFileSync(full, "utf8"));
    }
  }
  return parts.join("\n");
}
