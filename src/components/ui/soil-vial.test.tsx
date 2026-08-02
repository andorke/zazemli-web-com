import { existsSync, readFileSync } from "node:fs";
import { join } from "node:path";
import { render } from "@testing-library/react";
import { describe, expect, it } from "vitest";

import { SoilVial } from "@/components/ui/soil-vial";

/*
 * Дисциплина изображений (spec seo-meta): стекло колбы — единственная растровая
 * картинка в компонентах, и оно идёт через next/image.
 *
 * Что реально доезжает до прода, проверяем на out/, а не на рендере: vitest не
 * читает next.config, поэтому в jsdom Image рисует srcset и /_next/image, хотя
 * в static export (images.unoptimized) их нет. Выгода волны 1 — lazy, decoding
 * и зарезервированная площадь; sizes лежит в вызове заранее и заработает сам,
 * когда оптимизацию включит серверное окружение (design-решение 4).
 */
describe("SoilVial — растр через next/image", () => {
  const segments = { base: 50, air: 15, moisture: 25, drainage: 10 };

  it("стекло грузится лениво", () => {
    const { container } = render(<SoilVial segments={segments} />);
    expect(container.querySelector("img")).toHaveAttribute("loading", "lazy");
  });

  it("площадь под колбу зарезервирована — подстановка не двигает вёрстку", () => {
    const { container } = render(<SoilVial segments={segments} />);
    expect(container.firstElementChild?.className).toContain("aspect-[600/900]");
  });

  it("сырых <img> в компоненте не осталось, sizes задан", () => {
    const source = readFileSync("src/components/ui/soil-vial.tsx", "utf8");
    expect(source).not.toContain("<img");
    expect(source).toContain("sizes=");
  });

  it.skipIf(!existsSync("out"))(
    "в экспорте колба — ленивый тег на сам ассет, без слоя оптимизации",
    () => {
      const html = readFileSync(join("out", "index.html"), "utf8");
      const glass = html.match(/<img[^>]*src="\/soil-vial\.png"[^>]*>/)?.[0];

      expect(glass).toBeDefined();
      expect(glass).toContain('loading="lazy"');
      expect(glass).toContain('decoding="async"');
      expect(html).not.toContain("/_next/image?url=");
    },
  );
});
