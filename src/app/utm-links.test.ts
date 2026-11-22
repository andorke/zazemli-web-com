import { existsSync, readdirSync, readFileSync, statSync } from "node:fs";
import { join } from "node:path";
import { describe, expect, it } from "vitest";

/*
 * UTM-контракт на собранном экспорте: каждая исходящая ссылка на площадку бренда
 * (соцпрофили, Ozon) несёт utm_source=site — иначе переход неотличим от прямого
 * захода. Сторонние ссылки под контракт не попадают: научные источники /lab
 * (doi.org) и внешняя статья гайда — не наши площадки, метить их нечем и незачем.
 * out/ появляется только после npm run build — без него проверки пропускаются.
 */
describe("UTM на исходящих ссылках бренда", () => {
  const BRAND_HOSTS = ["instagram.com", "t.me", "ozon.ru"];

  const htmlFiles = (dir: string): string[] =>
    readdirSync(dir).flatMap((name) => {
      const full = join(dir, name);
      if (statSync(full).isDirectory()) return htmlFiles(full);
      return name.endsWith(".html") ? [full] : [];
    });

  const externalHrefs = (file: string): string[] =>
    [...readFileSync(file, "utf8").matchAll(/href="(https?:\/\/[^"]+)"/g)]
      .map((match) => match[1])
      .filter((href) => !href.startsWith("https://zazemli.com"));

  const isBrand = (href: string): boolean =>
    BRAND_HOSTS.some((host) => new URL(href).hostname.endsWith(host));

  it.skipIf(!existsSync("out"))(
    "ссылки на площадки бренда содержат utm_source=site",
    () => {
      const offenders = htmlFiles("out").flatMap((file) =>
        externalHrefs(file)
          .filter(isBrand)
          .filter(
            (href) => new URL(href).searchParams.get("utm_source") !== "site",
          )
          .map((href) => `${file}: ${href}`),
      );
      expect(offenders).toEqual([]);
    },
  );

  it.skipIf(!existsSync("out"))("брендовые профили сохранены в Organization", () => {
    const home = readFileSync("out/index.html", "utf8");
    const values = Array.from(home.matchAll(/<script type="application\/ld\+json">([\s\S]*?)<\/script>/g),
      match => JSON.parse(match[1]));
    const org = values.find(node => node["@type"] === "Organization");
    expect(org?.sameAs).toEqual([
      "https://instagram.com/zazemli_collectio",
      "https://t.me/zazemli_collectio",
    ]);
  });
});
