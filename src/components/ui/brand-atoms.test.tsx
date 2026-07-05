import { render, screen } from "@testing-library/react";
import { describe, expect, it } from "vitest";

import { BrandButton } from "@/components/ui/brand-button";
import { Button } from "@/components/ui/button";
import { DetailsAccordion } from "@/components/ui/details-accordion";
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
  it("рендерит кикер ui-ролью по прототипу: КАПС, tracking 0.22em, eyebrow-размер", () => {
    render(<KickerHeader>II · Разным растениям</KickerHeader>);
    const el = screen.getByText("II · Разным растениям");
    expect(el).toHaveClass("uppercase");
    expect(el).toHaveClass("font-ui");
    expect(el).toHaveClass("tracking-eyebrow");
    expect(el).toHaveClass("text-eyebrow");
    expect(el).toHaveClass("font-medium");
    expect(el).toHaveClass("text-muted-foreground");
  });
});

describe("DetailsAccordion", () => {
  it("нативный <details> с summary и поворотным caret", () => {
    render(
      <DetailsAccordion summary="почему именно так" data-testid="acc">
        <p>объяснение состава</p>
      </DetailsAccordion>,
    );
    const details = screen.getByTestId("acc");
    expect(details.tagName).toBe("DETAILS");
    const summary = details.querySelector("summary");
    expect(summary).not.toBeNull();
    expect(summary).toHaveTextContent("почему именно так");
    expect(summary).toHaveClass("list-none");
    const caret = summary!.querySelector("[aria-hidden]");
    expect(caret).not.toBeNull();
    expect(caret!.className).toContain("group-open:rotate-180");
  });

  it("контент раскрывается нативно (атрибут open, без JS-обработчиков)", () => {
    render(
      <DetailsAccordion summary="s" open data-testid="acc">
        <p>контент</p>
      </DetailsAccordion>,
    );
    const details = screen.getByTestId("acc");
    expect(details).toHaveAttribute("open");
    expect(screen.getByText("контент")).toBeInTheDocument();
  });
});

describe("BrandButton (btn/btn--solid по прототипу)", () => {
  it("btn: рамка currentColor, радиус 0, без тени", () => {
    render(<BrandButton>Вся коллекция →</BrandButton>);
    const el = screen.getByRole("button", { name: "Вся коллекция →" });
    expect(el).toHaveClass("border-current");
    expect(el).toHaveClass("rounded-none");
    expect(el).toHaveClass("font-ui");
    expect(el.className).not.toMatch(/shadow/);
  });

  it("btn--solid: заливка moss, текст bone, без тени", () => {
    render(<BrandButton solid>Купить на Ozon →</BrandButton>);
    const el = screen.getByRole("button", { name: "Купить на Ozon →" });
    expect(el).toHaveClass("bg-moss");
    expect(el).toHaveClass("text-bone");
    expect(el).toHaveClass("rounded-none");
    expect(el.className).not.toMatch(/shadow/);
  });

  it("asChild рендерит ссылку кнопочными классами", () => {
    render(
      <BrandButton asChild solid>
        <a href="#collectio">К коллекции →</a>
      </BrandButton>,
    );
    const el = screen.getByRole("link", { name: "К коллекции →" });
    expect(el).toHaveAttribute("href", "#collectio");
    expect(el).toHaveClass("bg-moss");
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
