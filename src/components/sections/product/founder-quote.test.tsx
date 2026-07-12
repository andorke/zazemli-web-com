import { render, screen } from "@testing-library/react";
import { describe, expect, it } from "vitest";

import { FounderQuote } from "@/components/sections/product/founder-quote";

describe("FounderQuote (цитата основательницы + мост коллекции)", () => {
  it("цитата основательницы и подпись с фльероном", () => {
    render(<FounderQuote />);
    expect(screen.getByText(/а руками тянется к земле/)).toBeInTheDocument();
    expect(screen.getByText(/— Настя, основательница/)).toBeInTheDocument();
  });

  it("футер-мост «← Вся коллекция» ведёт на секцию коллекции главной", () => {
    render(<FounderQuote />);
    const bridge = screen.getByRole("link", { name: "← Вся коллекция" });
    expect(bridge).toHaveAttribute("href", "/#collectio");
  });
});
