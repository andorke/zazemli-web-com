import { render, screen } from "@testing-library/react";
import { describe, expect, it } from "vitest";

import Home from "@/app/page";

/* Spec landing-redesign: одиннадцать блоков в порядке прототипа landing.html, Statement удалён */
describe("Главная: сборка по прототипу", () => {
  it("11 секций в порядке прототипа", () => {
    const { container } = render(<Home />);
    const sections = Array.from(container.querySelectorAll("main > section"));
    expect(sections).toHaveLength(11);

    const markers = [
      "Заземли растение.",
      "Пересадка — не дело из списка.",
      "Три шага — и растение в новой земле.",
      "Семь растений — семь рецептов земли.",
      "Разным растениям — разная земля.",
      "Всё на одну пересадку.",
      "ритуал пересадки · руки в земле",
      "Растению",
      "О нас",
      "Руки в землю — голова свободна.",
      "Семь растений, три размера. От 1 890 ₽.",
    ];
    markers.forEach((marker, i) => {
      expect(
        sections[i].textContent,
        `секция №${i + 1} должна содержать «${marker}»`,
      ).toContain(marker);
    });
  });

  it("якорь галереи: четвёртая секция несёт id=collectio", () => {
    const { container } = render(<Home />);
    const sections = container.querySelectorAll("main > section");
    expect(sections[3].id).toBe("collectio");
  });

  it("секции Statement больше нет", () => {
    render(<Home />);
    expect(screen.queryByText("Выращивай и создавай простое")).toBeNull();
    expect(screen.queryByText("ИЗ ЗАПИСЕЙ")).toBeNull();
  });
});
