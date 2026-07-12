import { render, screen, within } from "@testing-library/react";
import { describe, expect, it } from "vitest";

import GuidePage from "@/app/guide/page";
import { guide } from "@/content/guide";

/* Сборка /guide по прототипу guide.html: hero → тиры → 5 стадий → Ozon → «На главную» */
describe("/guide: сборка страницы", () => {
  it("один h1 канона", () => {
    render(<GuidePage />);
    const h1 = screen.getAllByRole("heading", { level: 1 });
    expect(h1).toHaveLength(1);
    expect(h1[0]).toHaveTextContent(guide.hero.title);
  });

  it("5 стадий: заголовки h2 и порядок в DOM", () => {
    const { container } = render(<GuidePage />);
    for (const stage of guide.stages) {
      expect(
        screen.getByRole("heading", { level: 2, name: stage.title }),
      ).toBeInTheDocument();
    }
    const ids = Array.from(
      container.querySelectorAll("li[id^='step-']"),
    ).map((el) => el.id);
    expect(ids).toEqual(["step-0", "step-1", "step-2", "step-3", "step-4"]);
  });

  it("тир-2: лента-оглавление ведёт на якоря стадий", () => {
    render(<GuidePage />);
    const nav = screen.getByRole("navigation", { name: "Шаги пересадки" });
    for (const stage of guide.stages) {
      const link = within(nav).getByRole("link", {
        name: new RegExp(stage.title),
      });
      expect(link).toHaveAttribute("href", `#${stage.id}`);
    }
  });

  it("Ozon-блок и возврат на главную", () => {
    render(<GuidePage />);
    expect(screen.getByText(guide.ozon.title)).toBeInTheDocument();
    const back = screen.getByRole("link", { name: "← На главную" });
    expect(back).toHaveAttribute("href", "/");
  });
});
