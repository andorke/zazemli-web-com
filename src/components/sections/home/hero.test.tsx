import { render, screen } from "@testing-library/react";
import { describe, expect, it } from "vitest";

import { Hero } from "@/components/sections/home/hero";

describe("Hero (прототип landing.html)", () => {
  it("рендерит eyebrow, H1 канона и sub", () => {
    render(<Hero />);
    expect(screen.getByText("Бокс для пересадки растения")).toBeInTheDocument();
    expect(screen.getByRole("heading", { level: 1 })).toHaveTextContent(
      "Заземли растение. Заземли себя.",
    );
    expect(
      screen.getByText(/Субстрат, повторяющий природную почву/),
    ).toBeInTheDocument();
  });

  it("CTA «К коллекции →» ведёт на якорь галереи", () => {
    render(<Hero />);
    const cta = screen.getByRole("link", { name: "К коллекции →" });
    expect(cta).toHaveAttribute("href", "#collectio");
  });

  it("прайс-строка прототипа рядом с CTA", () => {
    render(<Hero />);
    expect(
      screen.getByText("семь растений · три объёма · от 1 890 ₽"),
    ).toBeInTheDocument();
  });

  it("фото-фон-слот подписан (плейсхолдер без CLS)", () => {
    render(<Hero />);
    expect(
      screen.getByText(/атмосферное фото · мох · камень · вода/),
    ).toBeInTheDocument();
  });
});
