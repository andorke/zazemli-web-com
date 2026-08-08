import { render, screen } from "@testing-library/react";
import { describe, expect, it } from "vitest";

import Home from "@/app/page";

/*
 * Порядок блоков главной — канон home.md v2.5 / прототип landing.html
 * (spec home-restructure). Именно на сверке порядка ошиблась прошлая итерация,
 * поэтому маркеры блоков проверяются позиционно.
 */
describe("Главная: сборка по канону v2.5", () => {
  it("девять секций в порядке v2.5", () => {
    const { container } = render(<Home />);
    const sections = Array.from(container.querySelectorAll("main > section"));
    expect(sections).toHaveLength(9);

    const markers = [
      "Заземли растение.",
      "Всё на одну пересадку",
      "Семь растений — семь рецептур земли",
      "Три шага — и растение в новой земле",
      "", // фото-баннер: слот без текста (FIX-03)
      "Растению — дом, тебе — меньше хлопот",
      "О нас",
      "Руки в землю — голова свободна",
      /* цена набрана неразрывным пробелом — маркер обрезан до него */
      "Семь растений, три объёма. От",
    ];
    markers.forEach((marker, i) => {
      expect(
        sections[i].textContent,
        `секция №${i + 1} должна содержать «${marker}»`,
      ).toContain(marker);
    });
  });

  it("«Что в боксе» — первый смысловой блок под hero (FIX-13)", () => {
    const { container } = render(<Home />);
    const sections = container.querySelectorAll("main > section");
    expect(sections[1].textContent).toContain("Что в боксе");
    expect(sections[1].textContent).toContain("баночка угольной пудры");
  });

  it("якорь галереи: третья секция несёт id=collectio", () => {
    const { container } = render(<Home />);
    const sections = container.querySelectorAll("main > section");
    expect(sections[2].id).toBe("collectio");
  });

  it("фото-баннер стоит между «Тремя шагами» и «Что даёт», текста не несёт", () => {
    const { container } = render(<Home />);
    const sections = container.querySelectorAll("main > section");
    expect(sections[4].textContent).toBe("");
  });

  it("снятых секций манифеста и колб на главной нет (FIX-78)", () => {
    render(<Home />);
    expect(screen.queryByText(/Разным растениям — разная земля/)).toBeNull();
    expect(screen.queryByText(/Пересадка — не дело из списка/)).toBeNull();
    expect(screen.queryByText("Для растения")).toBeNull();
    expect(screen.queryByText("Для тебя")).toBeNull();
  });

  it("тейк Т3 живёт в шаге 03, а не в блоке «Купить» (NEW-04)", () => {
    const { container } = render(<Home />);
    const sections = container.querySelectorAll("main > section");
    const take = "Бокс заканчивается в день пересадки. Дневник — нет";
    expect(sections[3].textContent).toContain(take);
    expect(sections[8].textContent).not.toContain(take);
  });

  it("текстовых плейсхолдеров в квадратных скобках на странице нет (FIX-03)", () => {
    const { container } = render(<Home />);
    expect(container.textContent).not.toMatch(
      /\[\s*(атмосферное|ритуал|фото|раскладка)/i,
    );
  });

  it("секции Statement больше нет", () => {
    render(<Home />);
    expect(screen.queryByText("Выращивай и создавай простое")).toBeNull();
    expect(screen.queryByText("ИЗ ЗАПИСЕЙ")).toBeNull();
  });
});
