import { render, screen } from "@testing-library/react";
import { describe, expect, it } from "vitest";

import { GuideHero } from "@/components/sections/guide/hero";
import { guide } from "@/content/guide";

/*
 * Hero-каскад встречи /guide (change qr-welcome 3.1): kicker → h1 → sub → мета
 * идут прямыми детьми .welcome-cascade — лесенка задержек берётся по nth-child.
 * Строки h1 лежат в фиксированных обёртках, чтобы маска вылета работала по
 * строке контента, а не по автопереносу (D4).
 */
describe("GuideHero: entrance-каскад первого экрана", () => {
  it("h1 читается как цельная фраза канона", () => {
    render(<GuideHero />);
    expect(screen.getByRole("heading", { level: 1 })).toHaveTextContent(
      guide.hero.title,
    );
  });

  it("прямые дети каскада: kicker → h1 → подзаголовок → мета", () => {
    const { container } = render(<GuideHero />);
    const cascade = container.querySelector(".welcome-cascade");
    expect(cascade).not.toBeNull();

    const children = [...cascade!.children];
    expect(children).toHaveLength(4);
    expect(children[0]).toHaveTextContent(guide.hero.eyebrow);
    expect(children[1].tagName).toBe("H1");
    expect(children[2]).toHaveTextContent(guide.hero.sub);
    expect(children[3]).toHaveTextContent(guide.hero.meta);
  });

  it("строки h1 — обёртки .welcome-line со строкой контента внутри", () => {
    const { container } = render(<GuideHero />);
    const lines = [
      ...container.querySelectorAll("h1.welcome-lines > .welcome-line"),
    ];

    expect(lines).toHaveLength(guide.hero.titleLines.length);
    lines.forEach((line, index) => {
      expect(line).toHaveTextContent(guide.hero.titleLines[index]);
    });
  });
});
