import { render } from "@testing-library/react";
import { describe, expect, it } from "vitest";

import Home from "@/app/page";

/*
 * FIX-14: на проде был взят контейнер, но не grid внутри секций — контент
 * прижимался к левому краю широких вьюпортов. Спека — классы прототипа:
 *   .wrap    max-width:1240px · margin-inline:auto · padding-inline:clamp(1.5rem,5vw,4rem)
 *   .boxsec  .9fr 1.1fr   .gives 1fr 1fr   .teasers repeat(3,1fr)   .steps repeat(3,1fr)
 *   .chead   1.15fr 1fr,  всё схлопывается на брейкпоинте 860 (layout: в токенах)
 * Симметрия полей на 1440/1920 меряется в e2e (e2e/home.spec.ts).
 */
const WRAP = "mx-auto w-full max-w-[1240px] px-[clamp(1.5rem,5vw,4rem)]";

function wraps(container: HTMLElement): HTMLElement[] {
  return Array.from(
    container.querySelectorAll<HTMLElement>(
      ".max-w-\\[1240px\\].px-\\[clamp\\(1\\.5rem\\,5vw\\,4rem\\)\\]",
    ),
  );
}

describe("Сетка главной по прототипу (FIX-14)", () => {
  it("у каждой текстовой секции есть контейнер .wrap с центрированием", () => {
    const { container } = render(<Home />);
    const sections = Array.from(
      container.querySelectorAll<HTMLElement>("main > section"),
    );
    /* фото-баннер — full-bleed, контейнера не несёт */
    const withText = sections.filter((s) => (s.textContent ?? "").length > 0);
    expect(withText).toHaveLength(8);
    for (const section of withText) {
      const wrap = wraps(section)[0];
      expect(wrap, `нет .wrap в секции «${section.textContent?.slice(0, 24)}»`)
        .toBeTruthy();
      for (const cls of WRAP.split(" ")) {
        expect(wrap.className, `секция «${section.textContent?.slice(0, 24)}»`)
          .toContain(cls);
      }
    }
  });

  it("grid-колонки секций совпадают с прототипом на брейкпоинте 860", () => {
    const { container } = render(<Home />);
    const html = container.innerHTML;
    for (const cols of [
      "layout:grid-cols-[0.9fr_1.1fr]", // .boxsec
      "layout:grid-cols-[1fr_1fr]", // .gives
      "layout:grid-cols-3", // .teasers и .steps
      "layout:grid-cols-[1.15fr_1fr]", // .chead
    ]) {
      expect(html, `нет колонок ${cols}`).toContain(cols);
    }
  });

  it("десктопных брейкпоинтов lg: в сетке секций не осталось", () => {
    const { container } = render(<Home />);
    expect(container.innerHTML).not.toMatch(/lg:grid-cols/);
  });
});
