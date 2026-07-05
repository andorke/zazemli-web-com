import { render, screen } from "@testing-library/react";
import { describe, expect, it } from "vitest";

import { SiteHeader } from "@/components/site/site-header";

describe("SiteHeader (topbar по прототипу)", () => {
  it("wordmark ЗАЗЕМЛИ ведёт на главную, voice-ролью", () => {
    render(<SiteHeader />);
    const wordmark = screen.getByRole("link", { name: "ЗАЗЕМЛИ" });
    expect(wordmark).toHaveAttribute("href", "/");
    expect(wordmark).toHaveClass("font-voice");
  });

  it("меню: Коллекция → /#collectio, Лаборатория, Гайд", () => {
    render(<SiteHeader />);
    expect(screen.getByRole("link", { name: "Коллекция" })).toHaveAttribute(
      "href",
      "/#collectio",
    );
    expect(screen.getByRole("link", { name: "Лаборатория" })).toHaveAttribute(
      "href",
      "/lab",
    );
    expect(screen.getByRole("link", { name: "Гайд" })).toHaveAttribute(
      "href",
      "/guide",
    );
  });

  it("ссылок на diary-signup нет", () => {
    render(<SiteHeader />);
    const links = screen.getAllByRole("link");
    expect(links.some((l) => l.getAttribute("href")?.includes("diary"))).toBe(
      false,
    );
  });

  it("кнопки Ozon в шапке нет", () => {
    render(<SiteHeader />);
    expect(screen.queryByText(/Ozon/i)).not.toBeInTheDocument();
  });

  it("есть кнопка мобильного меню", () => {
    render(<SiteHeader />);
    expect(
      screen.getByRole("button", { name: "Открыть меню" }),
    ).toBeInTheDocument();
  });
});
