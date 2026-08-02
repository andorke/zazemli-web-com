import { render, screen, within } from "@testing-library/react";
import { describe, expect, it } from "vitest";

import { Buy } from "@/components/sections/home/buy";

describe("Buy (блок «Купить» — только размеры, NEW-03)", () => {
  it("eyebrow «Купить» и заголовок с ценой без точки", () => {
    render(<Buy />);
    expect(screen.getByText("Купить")).toBeInTheDocument();
    expect(screen.getByRole("heading", { level: 2 })).toHaveTextContent(
      "Семь растений, три объёма. От 1 990 ₽",
    );
  });

  it("три плитки объёмов с диаметром горшка", () => {
    render(<Buy />);
    const tiles = screen.getAllByRole("listitem");
    expect(tiles).toHaveLength(3);
    expect(tiles.map((t) => t.textContent)).toEqual([
      "1,2 лгоршок12–13 см",
      "2,2 лгоршок15–16 см",
      "3,5 лгоршок18–20 см",
    ]);
  });

  it("плитки НЕ кликабельны: ни ссылок, ни кнопок внутри (FIX-32)", () => {
    render(<Buy />);
    for (const tile of screen.getAllByRole("listitem")) {
      expect(within(tile).queryAllByRole("link")).toHaveLength(0);
      expect(within(tile).queryAllByRole("button")).toHaveLength(0);
    }
  });

  it("мелкая строка про сезон пересадки", () => {
    render(<Buy />);
    expect(
      screen.getByText("Пересаживают раз в год, весной"),
    ).toBeInTheDocument();
  });

  it("кнопка в состоянии «Скоро на Ozon» (ozonStoreUrl = null)", () => {
    render(<Buy />);
    expect(screen.getByRole("button", { name: "Скоро на Ozon" })).toBeDisabled();
  });

  it("risk-reversal с mailto на team@zazemli.com (FIX-35)", () => {
    render(<Buy />);
    expect(
      screen.getByText(
        /Сомневаешься с объёмом — напиши, подберём под твой горшок/,
      ),
    ).toBeInTheDocument();
    expect(
      screen.getByRole("link", { name: "team@zazemli.com" }),
    ).toHaveAttribute("href", "mailto:team@zazemli.com");
  });

  it("подпись прототипа про оплату и доставку", () => {
    render(<Buy />);
    expect(
      screen.getByText(/Оплата и доставка — на Ozon\./),
    ).toBeInTheDocument();
  });

  it("снятых сообщений в блоке нет: Т3, кофе-якорь, финал-мысль (NEW-03)", () => {
    const { container } = render(<Buy />);
    const text = container.textContent ?? "";
    expect(text).not.toContain("Бокс заканчивается в день пересадки");
    expect(text).not.toContain("чашек кофе");
    expect(text).not.toContain("собранный опыт пересадки");
  });
});
