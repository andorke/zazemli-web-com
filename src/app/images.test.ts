import { existsSync, readdirSync, readFileSync, statSync } from "node:fs";
import { join } from "node:path";
import { describe, expect, it } from "vitest";

/*
 * Битых картинок в экспорте нет (spec product-page: колба-схема).
 * Ловим все три способа сослаться на растр/вектор — src, CSS url() (маска колбы
 * задаётся именно так) и og:image, — потому что 404 у маски не видно в вёрстке:
 * слои просто перестают обрезаться силуэтом.
 * out/ появляется только после npm run build — без него проверки пропускаются.
 */
describe("Картинок с 404 в экспорте нет", () => {
  const htmlFiles = (dir: string): string[] =>
    readdirSync(dir).flatMap((name) => {
      const full = join(dir, name);
      if (statSync(full).isDirectory()) return htmlFiles(full);
      return name.endsWith(".html") ? [full] : [];
    });

  const imageRefs = (file: string): string[] => {
    const html = readFileSync(file, "utf8");
    return [
      ...[...html.matchAll(/<img[^>]+src="([^"]+)"/g)].map((m) => m[1]),
      ...[...html.matchAll(/url\(([^)]+)\)/g)].map((m) =>
        m[1].replace(/["'\\]/g, ""),
      ),
      ...[...html.matchAll(/<meta property="og:image" content="([^"]+)"/g)].map(
        (m) => m[1],
      ),
      ...[...html.matchAll(/<link rel="preload"[^>]+as="image"[^>]*>/g)].flatMap(
        (m) => [...m[0].matchAll(/href="([^"]+)"/g)].map((h) => h[1]),
      ),
    ]
      .map((ref) => ref.replace("https://zazemli.com", ""))
      /* data:-URI и внешние хосты проверять нечем */
      .filter((ref) => ref.startsWith("/"));
  };

  it.skipIf(!existsSync("out"))("каждая картинка есть в out/", () => {
    const offenders = htmlFiles("out").flatMap((file) =>
      imageRefs(file)
        .map((ref) => ref.split("?")[0])
        .filter((ref) => !existsSync(join("out", ref)))
        .map((ref) => `${file}: ${ref}`),
    );
    expect([...new Set(offenders)]).toEqual([]);
  });

  /* Колба — не заглушка: и стекло, и маска-силуэт должны реально лежать в экспорте */
  it.skipIf(!existsSync("out"))("ассеты колбы на месте", () => {
    expect(existsSync(join("out", "soil-vial.png"))).toBe(true);
    expect(existsSync(join("out", "soil-vial-mask.png"))).toBe(true);
  });
});
