import { render, screen } from "@testing-library/react";
import { describe, expect, it } from "vitest";

import { Button } from "@/components/ui/button";
import { CaveatNote } from "@/components/ui/caveat-note";
import { Fleuron } from "@/components/ui/fleuron";
import { KickerHeader } from "@/components/ui/kicker-header";
import { MaterialDot } from "@/components/ui/material-dot";

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
  it("рендерит кикер: КАПС, letter-spacing 0.18em, цвет moss", () => {
    render(<KickerHeader>II · Разным растениям</KickerHeader>);
    const el = screen.getByText("II · Разным растениям");
    expect(el).toHaveClass("uppercase");
    expect(el).toHaveClass("tracking-kicker");
    expect(el).toHaveClass("text-moss");
    expect(el).toHaveClass("font-sans");
  });
});

describe("CaveatNote", () => {
  it("рендерит рукописную приписку шрифтом Caveat", () => {
    render(<CaveatNote>совет от насти</CaveatNote>);
    const el = screen.getByText("совет от насти");
    expect(el).toHaveClass("font-hand");
  });
});

describe("Button (DS-контракт)", () => {
  it("не имеет теней — shadow запрещён токенами", () => {
    render(<Button>Купить на Ozon</Button>);
    const el = screen.getByRole("button", { name: "Купить на Ozon" });
    expect(el.className).not.toMatch(/shadow/);
  });
});
