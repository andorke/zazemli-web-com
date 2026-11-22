import { render, screen } from "@testing-library/react";
import { expect, it } from "vitest";
import Home from "./page";

it("главная повторяет порядок блоков согласованной сборки", () => {
  const { container } = render(<Home />);
  expect(Array.from(container.querySelectorAll("main > section"), node => node.id || node.className))
    .toEqual(["hero", "properties", "formats", "basis"]);
  expect(screen.getByRole("heading", { level: 1 })).toHaveTextContent("Заземли растение. Заземли себя.");
  expect(screen.getByRole("button", { name: "Бокс для пересадки" })).toHaveAttribute("aria-pressed", "true");
  expect(container.querySelectorAll(".direct-chips button")).toHaveLength(7);
  expect(screen.getByRole("heading", { name: "Состав грунта" })).toBeInTheDocument();
  expect(screen.getByRole("heading", { name: "Что входит в бокс" })).toBeInTheDocument();
});
