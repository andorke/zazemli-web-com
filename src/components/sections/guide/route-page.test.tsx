import { render, screen } from "@testing-library/react";
import { describe, expect, it } from "vitest";

import GuidePerevalkaPage from "@/app/guide/perevalka/page";
import GuidePolnayaZamenaPage from "@/app/guide/polnaya-zamena/page";
import {
  guidePerevalka,
  guidePolnayaZamena,
  type GuideRouteContent,
} from "@/content/guide";

/* Обе ветки собираются одним рендером — проверяем их одним набором ожиданий */
const routes: [string, () => React.ReactElement, GuideRouteContent][] = [
  ["/guide/perevalka", GuidePerevalkaPage, guidePerevalka],
  ["/guide/polnaya-zamena", GuidePolnayaZamenaPage, guidePolnayaZamena],
];

describe.each(routes)("%s: страница маршрута", (_url, Page, route) => {
  it("один h1 канона и мета ритуала", () => {
    render(<Page />);
    const h1 = screen.getAllByRole("heading", { level: 1 });
    expect(h1).toHaveLength(1);
    expect(h1[0]).toHaveTextContent(route.hero.title);
    expect(screen.getByText(route.hero.meta)).toBeInTheDocument();
  });

  it("стадии маршрута по порядку", () => {
    const { container } = render(<Page />);
    const ids = Array.from(container.querySelectorAll("li[id^='step-']")).map(
      (el) => el.id,
    );
    expect(ids).toEqual(route.stages.map((stage) => stage.id));
    for (const stage of route.stages) {
      expect(
        screen.getByRole("heading", { level: 2, name: stage.title }),
      ).toBeInTheDocument();
    }
  });

  it("«Это не мой случай» ведёт на соседнюю ветку", () => {
    render(<Page />);
    expect(
      screen.getByRole("link", { name: route.otherRoute.label }),
    ).toHaveAttribute("href", route.otherRoute.href);
  });

  it("возврат на главную", () => {
    render(<Page />);
    expect(screen.getByRole("link", { name: "← На главную" })).toHaveAttribute(
      "href",
      "/",
    );
  });
});
