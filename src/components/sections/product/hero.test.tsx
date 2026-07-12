import { render, screen } from "@testing-library/react";
import { describe, expect, it } from "vitest";

import { ProductHero } from "@/components/sections/product/hero";
import { skus } from "@/content/sku";

const monstera = skus.find((s) => s.slug === "monstera")!;

describe("ProductHero (страница товара)", () => {
  it("kicker с партией и номером-акцентом SKU (var(--sku))", () => {
    render(<ProductHero sku={monstera} />);
    expect(
      screen.getByText(/Collectio Zazemli · Партия 0/),
    ).toBeInTheDocument();
    const number = screen.getByText("N° 01");
    expect(number).toBeInTheDocument();
    expect(number).toHaveStyle({ color: "var(--sku)" });
  });

  it("H1 «Заземли {растение}.» в винительном падеже", () => {
    render(<ProductHero sku={monstera} />);
    expect(screen.getByRole("heading", { level: 1 })).toHaveTextContent(
      "Заземли монстеру.",
    );
  });

  it("латынь рода italic и описание грунта", () => {
    render(<ProductHero sku={monstera} />);
    expect(screen.getByText("Monstera")).toBeInTheDocument();
    expect(screen.getByText(/Рыхлый грунт под монстеру/)).toBeInTheDocument();
  });

  it("CTA «Заземлить {растение} →» ведёт на buybar", () => {
    render(<ProductHero sku={monstera} />);
    const cta = screen.getByRole("link", { name: "Заземлить монстеру →" });
    expect(cta).toHaveAttribute("href", "#buy");
    /* CTA — бренд-акцент moss-ink, не SKU-цвет (spec: кнопки не окрашены в SKU-цвет) */
    expect(cta.className).toContain("moss-ink");
  });

  it("строка объёмов и цены рядом с CTA", () => {
    render(<ProductHero sku={monstera} />);
    expect(screen.getByText("2,2 / 3,5 л · от 2 190 ₽")).toBeInTheDocument();
  });
});
