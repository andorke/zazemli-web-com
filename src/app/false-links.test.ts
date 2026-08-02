import { existsSync, readdirSync, readFileSync, statSync } from "node:fs";
import { join } from "node:path";
import { describe, expect, it } from "vitest";

/*
 * Регресс на ложные ссылки во всём статическом экспорте: href="#", пустой href
 * и якоря на несуществующие id — включая кросс-страничные (/#collectio,
 * /lab#rec-monstera), которые grep по href="#" не ловит.
 * out/ появляется только после npm run build — без него проверки пропускаются,
 * чтобы npm run test оставался зелёным на чистом дереве.
 */
describe("Ложных ссылок нет ни на одной странице", () => {
  const htmlFiles = (dir: string): string[] =>
    readdirSync(dir).flatMap((name) => {
      const full = join(dir, name);
      if (statSync(full).isDirectory()) return htmlFiles(full);
      return name.endsWith(".html") ? [full] : [];
    });

  const hrefsIn = (file: string): string[] =>
    [...readFileSync(file, "utf8").matchAll(/href="([^"]*)"/g)].map(
      (match) => match[1],
    );

  const idsIn = (file: string): Set<string> =>
    new Set(
      [...readFileSync(file, "utf8").matchAll(/id="([^"]+)"/g)].map(
        (match) => match[1],
      ),
    );

  /* "/" → out/index.html, "/lab" → out/lab.html */
  const pageFile = (path: string): string =>
    path === "/"
      ? join("out", "index.html")
      : join("out", `${path.replace(/^\//, "").replace(/\/$/, "")}.html`);

  it.skipIf(!existsSync("out"))('href="#" и пустых href нет', () => {
    const offenders = htmlFiles("out").flatMap((file) =>
      hrefsIn(file)
        .filter((href) => href === "" || href === "#")
        .map((href) => `${file}: href="${href}"`),
    );
    expect(offenders).toEqual([]);
  });

  it.skipIf(!existsSync("out"))("каждый якорь ведёт на существующий id", () => {
    const offenders = htmlFiles("out").flatMap((file) =>
      hrefsIn(file).flatMap((href) => {
        const hash = href.indexOf("#");
        if (hash < 0) return [];
        const [path, fragment] = [href.slice(0, hash), href.slice(hash + 1)];
        if (!fragment) return [];
        /* внешние ссылки с якорем не проверяем — целевой страницы у нас нет */
        if (path !== "" && !path.startsWith("/")) return [];
        const target = path === "" ? file : pageFile(path);
        if (!existsSync(target)) return [`${file}: ${href} → нет ${target}`];
        return idsIn(target).has(fragment) ? [] : [`${file}: ${href}`];
      }),
    );
    expect(offenders).toEqual([]);
  });
});
