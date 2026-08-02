import { render, screen } from "@testing-library/react";
import { describe, expect, it } from "vitest";

import { GuideHero } from "@/components/sections/guide/hero";

/*
 * Hero /guide параметризован данными страницы (guide-v4: вход + две ветки).
 * Контейнер несёт .welcome-cascade — entrance-лесенка задержек по nth-child
 * (change qr-welcome 3.1); масочный вылет строк h1 снят при мерже с guide-v4.
 */
const hero = {
  eyebrow: "Гайд",
  title: "Пересадка за пять шагов",
  sub: "Спокойный ритуал для любого растения.",
  meta: "10 минут · 5 шагов",
};

describe("GuideHero", () => {
  it("рендерит h1 с заголовком страницы", () => {
    render(<GuideHero hero={hero} />);
    expect(screen.getByRole("heading", { level: 1 })).toHaveTextContent(
      hero.title,
    );
  });

  it("прямые дети каскада: kicker → h1 → подзаголовок → мета", () => {
    const { container } = render(<GuideHero hero={hero} />);
    const cascade = container.querySelector(".welcome-cascade");
    expect(cascade).not.toBeNull();

    const children = [...cascade!.children];
    expect(children).toHaveLength(4);
    expect(children[0]).toHaveTextContent(hero.eyebrow);
    expect(children[1].tagName).toBe("H1");
    expect(children[2]).toHaveTextContent(hero.sub);
    expect(children[3]).toHaveTextContent(hero.meta);
  });

  it("мета-строка не рендерится без hero.meta", () => {
    const { container } = render(
      <GuideHero hero={{ ...hero, meta: undefined }} />,
    );
    expect(container.querySelector(".welcome-cascade")!.children).toHaveLength(
      3,
    );
  });
});
