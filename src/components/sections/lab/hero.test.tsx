import { render, screen } from "@testing-library/react";
import { describe, expect, it } from "vitest";

import { LabHero } from "@/components/sections/lab/hero";
import { lab } from "@/content/lab";

/*
 * Hero-каскад встречи /lab (change qr-welcome 4.1): kicker → заголовок →
 * подзаголовок → смысловая строка идут прямыми детьми .welcome-cascade —
 * лесенка задержек берётся по nth-child из globals.css, своего CSS нет.
 * Маска строк заголовка — только у /guide (D4), здесь заголовок цельный.
 */
describe("LabHero: entrance-каскад первого экрана", () => {
  it("прямые дети каскада: kicker → заголовок → подзаголовок → смысл", () => {
    const { container } = render(<LabHero />);
    const cascade = container.querySelector(".welcome-cascade");
    expect(cascade).not.toBeNull();

    const children = [...cascade!.children];
    expect(children).toHaveLength(4);
    expect(children[0]).toHaveTextContent(lab.hero.eyebrow);
    expect(children[1].tagName).toBe("H1");
    expect(children[2]).toHaveTextContent(lab.hero.sub);
    expect(children[3]).toHaveTextContent(lab.hero.meaning);
  });

  it("заголовок остаётся цельным, без обёрток строк", () => {
    const { container } = render(<LabHero />);
    expect(screen.getByRole("heading", { level: 1 })).toHaveTextContent(
      lab.hero.title,
    );
    expect(container.querySelector(".welcome-line")).toBeNull();
  });
});
