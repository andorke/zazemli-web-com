import { render, screen } from "@testing-library/react";
import { describe, expect, it } from "vitest";

import GuidePerevalkaPage from "@/app/guide/perevalka/page";
import GuidePolnayaZamenaPage from "@/app/guide/polnaya-zamena/page";
import {
  diaryStage,
  drainageStage,
  guidePerevalka,
  guidePolnayaZamena,
  soilLeftoverTip,
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

  /* Линейность на ветке восстановлена — HowTo честный (design 3) */
  it("один HowTo из данных ветки", () => {
    const { container } = render(<Page />);
    const scripts = container.querySelectorAll(
      'script[type="application/ld+json"]',
    );
    expect(scripts).toHaveLength(1);

    const jsonLd = JSON.parse(scripts[0].textContent!);
    expect(jsonLd["@type"]).toBe("HowTo");
    expect(jsonLd.name).toBe(route.hero.title);
    expect(jsonLd.description).toBe(route.hero.sub);
    expect(jsonLd.step).toEqual(
      route.stages.map((stage) => ({
        "@type": "HowToStep",
        name: stage.title,
        text: stage.steps.map((step) => step.text).join(" "),
      })),
    );
  });
});

/*
 * Сверка по ссылке в guide.test.ts держит единственность контента, эта — рендер:
 * обе ветки собирают общие куски одними компонентами, а не своей разметкой.
 * Фльерон-разделитель к стадии не относится (он есть только у не-первой) — снимаем.
 */
function stageMarkup(container: HTMLElement, id: string) {
  const stage = container.querySelector(`li[id="${id}"]`);
  expect(stage).not.toBeNull();
  const clone = stage!.cloneNode(true) as HTMLElement;
  for (const el of clone.querySelectorAll("[aria-hidden='true']")) {
    if (el.textContent === "❦") el.remove();
  }
  return clone.innerHTML;
}

function tipMarkup(container: HTMLElement, summary: string) {
  const tip = Array.from(container.querySelectorAll("details")).find((el) =>
    el.querySelector("summary")?.textContent?.startsWith(summary),
  );
  expect(tip).toBeDefined();
  return tip!.outerHTML;
}

describe("общие куски маршрутов", () => {
  it.each([
    [drainageStage.title, drainageStage.id],
    [diaryStage.title, diaryStage.id],
  ])("шаг «%s» рендерится на ветках посимвольно одинаково", (_title, id) => {
    const perevalka = render(<GuidePerevalkaPage />).container;
    const polnayaZamena = render(<GuidePolnayaZamenaPage />).container;
    expect(stageMarkup(perevalka, id)).toBe(stageMarkup(polnayaZamena, id));
  });

  it(`подсказка «${soilLeftoverTip.summary}» рендерится на ветках посимвольно одинаково`, () => {
    const perevalka = render(<GuidePerevalkaPage />).container;
    const polnayaZamena = render(<GuidePolnayaZamenaPage />).container;
    expect(tipMarkup(perevalka, soilLeftoverTip.summary)).toBe(
      tipMarkup(polnayaZamena, soilLeftoverTip.summary),
    );
  });
});
