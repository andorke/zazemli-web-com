import { existsSync, readFileSync, readdirSync } from "node:fs";
import { describe, expect, it } from "vitest";
import { readBuilt, hasBuild, SKU_ROUTES } from "@/lib/built-output";
import { plants } from "@/content/paper/catalog";

const render = (path: string) => new DOMParser().parseFromString(readBuilt(path) ?? "", "text/html");
const pages = ["/", "/guide", "/guide/perevalka", "/lab", "/diary-signup", "/terms", "/privacy", ...SKU_ROUTES];
const suite = hasBuild() ? describe : describe.skip;

suite("Статический экспорт «Тёплой бумаги»", () => {
  it.each(pages)("%s содержит уникальный заголовок, canonical и доступную политику", path => {
    const page = render(path);
    const main = page.querySelector("#main");
    expect(main?.querySelectorAll("h1")).toHaveLength(1);
    expect(new URL(page.querySelector('link[rel="canonical"]')?.getAttribute("href") ?? "").href)
      .toBe(`https://zazemli.com${path}`);
    expect(page.querySelector('a[href="/privacy"]')).not.toBeNull();
    if (path !== "/lab") expect(page.querySelector('a[href="/terms"]')).not.toBeNull();
    expect(page.querySelector('[data-cookie-banner]')).not.toBeNull();
  });

  it("выдаёт действующие фото, шрифты и CSS со своего домена", () => {
    const expected = ["mulish.woff2", "mulish-italic.woff2", "commissioner.woff2",
      ...plants.map(plant => `lab-soil/${plant.slug}.webp`)];
    for (const name of expected) expect(existsSync(`out/warm-paper/assets/${name}`), name).toBe(true);
    for (const path of pages) {
      const page = render(path);
      for (const item of page.querySelectorAll("img[src], image[href], link[rel=stylesheet]")) {
        const src = item.getAttribute("src") ?? item.getAttribute("href");
        if (src?.startsWith("/warm-paper/")) {
          const asset = new URL(src, "https://zazemli.com");
          expect(existsSync("out" + asset.pathname), src).toBe(true);
        }
        expect(src).not.toMatch(/fonts\.(googleapis|gstatic)\.com/);
      }
    }
  });

  it("сохраняет закрытый вход дневника, индексируемые товары и служебные редиректы", () => {
    const sitemap = readFileSync("out/sitemap.xml", "utf8");
    expect(sitemap).not.toContain("/diary-signup");
    expect(sitemap).not.toContain("/snova/");
    expect(render("/diary-signup").querySelector('meta[name="robots"]')?.getAttribute("content")).toContain("noindex");
    for (const route of SKU_ROUTES) {
      expect(sitemap).toContain(route);
      const path = route.replace("/collectio/", "/snova/");
      expect(render(path).querySelector('meta[name="robots"]')?.getAttribute("content")).toContain("noindex");
    }
  });

  it("оставляет согласия пустыми и не публикует чувствительные файлы и макеты", () => {
    const diary = render("/diary-signup");
    expect(diary.querySelectorAll('main input[type="checkbox"]:required')).toHaveLength(2);
    expect(diary.querySelector('main input[type="checkbox"][checked]')).toBeNull();
    const outputs = readdirSync("out", { recursive: true }) as string[];
    expect(outputs.some(name => /(?:\.sqlite3?$|\.py$|^start-cjm\.html$|^unsubscribe-)/.test(name))).toBe(false);
    expect(render("/404").querySelector("h1")?.textContent).toBe("Страница не нашлась");
  });

  it("в собранных товарах и лаборатории видны реальные растения и доли", () => {
    expect(render("/lab").querySelector('#lab-mix-photo')?.getAttribute("src")).toContain("lab-soil/monstera.webp");
    for (const plant of plants) {
      const product = render(`/collectio/${plant.slug}`);
      expect(product.querySelector("h1")?.textContent).toBe(`Бокс для ${plant.gen}`);
      const percentages = [...product.querySelectorAll("#direct-recipe strong")].map(el => parseInt(el.textContent!));
      expect(percentages.reduce((total, value) => total + value, 0)).toBe(100);
      expect(product.querySelector("a.buy-action[href*='/search']") ?? null).toBeNull();
    }
  });
});
