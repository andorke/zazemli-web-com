import { render, screen } from "@testing-library/react";
import { describe, expect, it } from "vitest";

import { Ritual } from "@/components/sections/product/ritual";
import { skus } from "@/content/sku";

const monstera = skus.find((s) => s.slug === "monstera")!;

describe("Ritual (ритуал-секция)", () => {
  it("eyebrow, постоянная ритуал-строка и приписка SKU", () => {
    render(<Ritual sku={monstera} />);
    expect(screen.getByText("Ритуал")).toBeInTheDocument();
    expect(
      screen.getByText("Час с грунтом стоит дня в zoom."),
    ).toBeInTheDocument();
    expect(screen.getByText("Она уже лезет из горшка.")).toBeInTheDocument();
  });

  it("мост на гайд пересадки", () => {
    render(<Ritual sku={monstera} />);
    const bridge = screen.getByRole("link", {
      name: "Как пересадить, по шагам →",
    });
    expect(bridge).toHaveAttribute("href", "/guide");
  });
});
