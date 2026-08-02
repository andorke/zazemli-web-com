import { render, screen } from "@testing-library/react";
import { describe, expect, it } from "vitest";

import GuidePage, { metadata } from "@/app/guide/page";
import { guideEntry } from "@/content/guide";

/* Вход гайда v4.0: hero → флоу → инвентарь → стадии 00–01 → развилка → Ozon */
describe("/guide: вход", () => {
  it("один h1 канона", () => {
    render(<GuidePage />);
    const h1 = screen.getAllByRole("heading", { level: 1 });
    expect(h1).toHaveLength(1);
    expect(h1[0]).toHaveTextContent(guideEntry.hero.title);
  });

  it("стадии 00 и 01, шагов маршрутов на входе нет", () => {
    const { container } = render(<GuidePage />);
    const ids = Array.from(container.querySelectorAll("li[id^='step-']")).map(
      (el) => el.id,
    );
    expect(ids).toEqual(["step-0", "step-1"]);
    for (const title of ["Дренаж", "Грунт и посадка", "Дневник"]) {
      expect(
        screen.queryByRole("heading", { level: 2, name: title }),
      ).not.toBeInTheDocument();
    }
  });

  it("инвентарь: все пункты и легенда ● в боксе / ○ своё", () => {
    render(<GuidePage />);
    for (const item of guideEntry.kit.items) {
      expect(screen.getByText(item.text, { exact: false })).toBeInTheDocument();
    }
    expect(screen.getByText(guideEntry.kit.time)).toBeInTheDocument();
    expect(screen.getByText("в боксе")).toBeInTheDocument();
    expect(screen.getByText("своё")).toBeInTheDocument();
  });

  it("развилка стоит после осмотра кома и ведёт на оба маршрута", () => {
    const { container } = render(<GuidePage />);
    const fork = container.querySelector("#fork");
    expect(fork).toBeInTheDocument();
    expect(
      container.querySelector("#step-1")!.compareDocumentPosition(fork!) &
        Node.DOCUMENT_POSITION_FOLLOWING,
    ).toBeTruthy();

    for (const path of guideEntry.fork.paths) {
      expect(
        screen.getByRole("link", { name: new RegExp(path.button.label) }),
      ).toHaveAttribute("href", path.button.href);
    }
  });

  it("HowTo на входе нет (design 3)", () => {
    const { container } = render(<GuidePage />);
    expect(
      container.querySelector('script[type="application/ld+json"]'),
    ).not.toBeInTheDocument();
  });

  /* Вход собирает вес обеих веток: canonical на себя, noindex тут не ставим */
  it("canonical на себя, без noindex", () => {
    expect(metadata.alternates?.canonical).toBe("/guide");
    expect(metadata.robots).toBeUndefined();
  });

  it("возврат на главную", () => {
    render(<GuidePage />);
    expect(screen.getByRole("link", { name: "← На главную" })).toHaveAttribute(
      "href",
      "/",
    );
  });
});
