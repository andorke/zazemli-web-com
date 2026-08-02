import { existsSync, readdirSync, readFileSync, statSync } from "node:fs";
import { join } from "node:path";
import { describe, expect, it } from "vitest";

/*
 * Структурированные данные по всему статическому экспорту.
 * Проверяем на собранном out/, а не на React-дереве: разметка должна доезжать
 * до краулера в HTML, а не только существовать в компоненте.
 * out/ появляется только после npm run build — без него проверки пропускаются.
 */
describe("JSON-LD статического экспорта", () => {
  const htmlFiles = (dir: string): string[] =>
    readdirSync(dir).flatMap((name) => {
      const full = join(dir, name);
      if (statSync(full).isDirectory()) return htmlFiles(full);
      return name.endsWith(".html") ? [full] : [];
    });

  /* Разметка страницы: только script-теги, без RSC-пейлоада (там те же строки) */
  const jsonLdIn = (file: string): Record<string, unknown>[] =>
    [
      ...readFileSync(file, "utf8").matchAll(
        /<script type="application\/ld\+json">([\s\S]*?)<\/script>/g,
      ),
    ].map((match) => JSON.parse(match[1].replace(/\\u003c/g, "<")));

  const typed = (file: string, type: string) =>
    jsonLdIn(file).filter((node) => node["@type"] === type);

  it.skipIf(!existsSync("out"))("вся разметка — валидный JSON", () => {
    const offenders = htmlFiles("out").flatMap((file) => {
      try {
        jsonLdIn(file);
        return [];
      } catch (error) {
        return [`${file}: ${String(error)}`];
      }
    });
    expect(offenders).toEqual([]);
  });

  it.skipIf(!existsSync("out"))(
    "ровно один Organization на каждой странице",
    () => {
      const offenders = htmlFiles("out")
        .map((file) => ({ file, nodes: typed(file, "Organization") }))
        .filter((page) => page.nodes.length !== 1)
        .map((page) => `${page.file}: Organization ×${page.nodes.length}`);
      expect(offenders).toEqual([]);
    },
  );

  it.skipIf(!existsSync("out"))(
    "Organization несёт имя, url и почту бренда",
    () => {
      const [organization] = typed(join("out", "index.html"), "Organization");
      expect(organization).toMatchObject({
        name: "ЗАЗЕМЛИ",
        url: "https://zazemli.com",
        email: "team@zazemli.com",
      });
    },
  );

  it.skipIf(!existsSync("out"))(
    "на каждой карточке SKU — ровно один Product, и только там",
    () => {
      const offenders = htmlFiles("out")
        .map((file) => ({
          file,
          expected: /out\/collectio\/[^/]+\.html$/.test(file) ? 1 : 0,
          actual: typed(file, "Product").length,
        }))
        .filter((page) => page.actual !== page.expected)
        .map((page) => `${page.file}: Product ×${page.actual}`);
      expect(offenders).toEqual([]);
    },
  );

  it.skipIf(!existsSync("out"))(
    "Product несёт латынь рода в имени и offers по каждому объёму в RUB",
    () => {
      const [product] = typed(join("out", "collectio", "monstera.html"), "Product");
      expect(product.name).toContain("Монстера");
      expect(product.name).toContain("Monstera");
      const offers = product.offers as Record<string, unknown>[];
      /* монстера — два объёма: 2,2 л и 3,5 л */
      expect(offers.map((offer) => offer.name)).toEqual(["2,2 л", "3,5 л"]);
      for (const offer of offers) {
        expect(offer.priceCurrency).toBe("RUB");
        /* магазин ещё не открыт: ozonListingUrl везде null */
        expect(offer.availability).toBe("https://schema.org/PreOrder");
      }
    },
  );
});
