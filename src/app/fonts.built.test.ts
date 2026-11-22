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

  it("файлы шрифтов передачи входят в итоговый каскад", () => {
    const css = readFileSync("out/warm-paper/styles/home.css", "utf8");
    expect(css).toContain("/warm-paper/assets/mulish.woff2");
    expect(css).toContain("/warm-paper/assets/commissioner.woff2");
    expect(existsSync("out/warm-paper/assets/mulish-italic.woff2")).toBe(true);
  });
});
