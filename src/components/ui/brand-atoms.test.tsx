import { render, screen } from "@testing-library/react";
import { describe, expect, it } from "vitest";

import { Button } from "@/components/ui/button";
import { Fleuron } from "@/components/ui/fleuron";
import { KickerHeader } from "@/components/ui/kicker-header";
import { MaterialDot } from "@/components/ui/material-dot";
import { RitualNote } from "@/components/ui/ritual-note";

describe("Fleuron", () => {
  it("рендерит символ ❦ цветом moss как декорацию", () => {
    render(<Fleuron data-testid="fleuron" />);
    const el = screen.getByTestId("fleuron");
    expect(el).toHaveTextContent("❦");
    expect(el).toHaveClass("text-moss");
    expect(el).toHaveAttribute("aria-hidden", "true");
  });
});

describe("MaterialDot", () => {
  it("рендерит круглый маркер цвета материала", () => {
    render(<MaterialDot material="soil" data-testid="dot" />);
    const el = screen.getByTestId("dot");
    expect(el).toHaveClass("bg-soil");
    expect(el).toHaveClass("rounded-full");
    expect(el).toHaveAttribute("aria-hidden", "true");
  });
});

describe("KickerHeader", () => {
  it("рендерит кикер ui-ролью: КАПС с letter-spacing", () => {
    render(<KickerHeader>II · Разным растениям</KickerHeader>);
    const el = screen.getByText("II · Разным растениям");
    expect(el).toHaveClass("uppercase");
    expect(el).toHaveClass("font-ui");
  });
});

describe("RitualNote", () => {
  it("рендерит ритуальную приписку: voice italic + акцентный цвет", () => {
    render(<RitualNote>совет от насти</RitualNote>);
    const el = screen.getByText("совет от насти");
    expect(el).toHaveClass("font-voice");
    expect(el).toHaveClass("italic");
    expect(el).toHaveClass("text-moss-ink");
  });
});

describe("Button (DS-контракт)", () => {
  it("не имеет теней — shadow запрещён токенами", () => {
    render(<Button>Купить на Ozon</Button>);
    const el = screen.getByRole("button", { name: "Купить на Ozon" });
    expect(el.className).not.toMatch(/shadow/);
  });
});
