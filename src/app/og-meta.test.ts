import { existsSync, readdirSync, readFileSync, statSync } from "node:fs";
import { join } from "node:path";
import { describe, expect, it } from "vitest";

/*
 * OG/Twitter-мета по всему статическому экспорту: бренд-OG из opengraph-image
 * (1200×630) должен быть один и тот же на всех страницах — раньше товарные
 * наследовали из layout вертикальный soil-vial.png и давали кривой кроп.
 * out/ появляется только после npm run build — без него проверки пропускаются.
 */
describe("OG-мета статического экспорта", () => {
  const htmlFiles = (dir: string): string[] =>
    readdirSync(dir).flatMap((name) => {
      const full = join(dir, name);
      if (statSync(full).isDirectory()) return htmlFiles(full);
      return name.endsWith(".html") ? [full] : [];
    });

  const metaContent = (html: string, attr: string, name: string): string[] =>
    [
      ...html.matchAll(
        new RegExp(`<meta ${attr}="${name}" content="([^"]*)"`, "g"),
      ),
    ].map((match) => match[1]);

  it.skipIf(!existsSync("out"))(
    "каждая страница отдаёт ровно один og:image — бренд-OG с абсолютным URL",
    () => {
      const offenders = htmlFiles("out").flatMap((file) => {
        const images = metaContent(
          readFileSync(file, "utf8"),
          "property",
          "og:image",
        );
        if (images.length !== 1) return [`${file}: og:image ×${images.length}`];
        return images[0].startsWith("https://zazemli.com/opengraph-image")
          ? []
          : [`${file}: ${images[0]}`];
      });
      expect(offenders).toEqual([]);
    },
  );

  it.skipIf(!existsSync("out"))(
    "og:title/og:description/og:url есть на каждой странице",
    () => {
      const offenders = htmlFiles("out").flatMap((file) => {
        const html = readFileSync(file, "utf8");
        return ["og:title", "og:description", "og:url"]
          .filter((name) => metaContent(html, "property", name).length !== 1)
          .map((name) => `${file}: ${name}`);
      });
      expect(offenders).toEqual([]);
    },
  );

  /* 1200×630 — карточка во всю ширину; summary дал бы крошечную превьюшку */
  it.skipIf(!existsSync("out"))("twitter:card — summary_large_image", () => {
    const offenders = htmlFiles("out").filter(
      (file) =>
        metaContent(readFileSync(file, "utf8"), "name", "twitter:card")[0] !==
        "summary_large_image",
    );
    expect(offenders).toEqual([]);
  });
});
