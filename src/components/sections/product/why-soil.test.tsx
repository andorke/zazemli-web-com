import { render, screen } from "@testing-library/react";
import { describe, expect, it } from "vitest";

import { WhySoil } from "@/components/sections/product/why-soil";
import { skus } from "@/content/sku";

const monstera = skus.find((s) => s.slug === "monstera")!;

describe("WhySoil («Зачем именно эта земля»)", () => {
  it("eyebrow и проза биотопа", () => {
    render(<WhySoil sku={monstera} />);
    expect(screen.getByText("Зачем именно эта земля")).toBeInTheDocument();
    expect(
      screen.getByText(/В джунглях корни висят в воздухе/),
    ).toBeInTheDocument();
  });

  it("SourceNote: клик-текст, бейдж «рецензируемо» и рецензируемый источник", () => {
    render(<WhySoil sku={monstera} />);
    expect(screen.getByText("почему воздух решает")).toBeInTheDocument();
    expect(screen.getByText("рецензируемо")).toBeInTheDocument();
    expect(screen.getByText(/Bugbee & Frink, 1986/)).toBeInTheDocument();
  });

  it("мерная колба и легенда групп с процентами", () => {
    render(<WhySoil sku={monstera} />);
    expect(
      screen.getByRole("img", { name: "Состав грунта по функциям" }),
    ).toBeInTheDocument();
    // «колба-%»: легенда связана с vial монстеры (основа = 50%)
    expect(screen.getByText(/основа и питание\s*50\s*%/)).toBeInTheDocument();
  });

  it("мост ведёт в лабораторию к реестру источников", () => {
    render(<WhySoil sku={monstera} />);
    const bridge = screen.getByRole("link", {
      name: "Весь состав и источники → в лаборатории",
    });
    expect(bridge.getAttribute("href")).toContain("/lab");
  });
});
