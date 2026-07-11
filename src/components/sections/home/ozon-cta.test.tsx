import { render, screen } from "@testing-library/react";
import { describe, expect, it } from "vitest";

import { OzonCta } from "@/components/sections/home/ozon-cta";

describe("OzonCta (тёмный финальный блок прототипа)", () => {
  it("eyebrow «Купить» и цена канона в заголовке", () => {
    render(<OzonCta />);
    expect(screen.getByText("Купить")).toBeInTheDocument();
    expect(screen.getByRole("heading", { level: 2 })).toHaveTextContent(
      "Семь растений, три размера. От 1 890 ₽.",
    );
  });

  it("кнопка в состоянии «Скоро на Ozon» (ozonStoreUrl = null)", () => {
    render(<OzonCta />);
    expect(
      screen.getByRole("button", { name: "Скоро на Ozon" }),
    ).toBeDisabled();
  });

  it("подпись прототипа про оплату и доставку", () => {
    render(<OzonCta />);
    expect(
      screen.getByText(/Оплата и доставка — на Ozon\./),
    ).toBeInTheDocument();
  });
});
