import { render, screen } from "@testing-library/react";
import { describe, expect, it, vi } from "vitest";

import { FooterDisclaimer } from "@/components/site/footer-disclaimer";

vi.mock("next/navigation", () => ({ usePathname: vi.fn() }));

const { usePathname } = await import("next/navigation");

describe("FooterDisclaimer (слот в SiteFooter, design decision 3 guide-lab)", () => {
  it("рендерит дисклеймер дословно на /lab", () => {
    vi.mocked(usePathname).mockReturnValue("/lab");
    render(<FooterDisclaimer />);
    expect(
      screen.getByText(/Растения — не лекарство/),
    ).toBeInTheDocument();
  });

  it("не рендерится на остальных страницах", () => {
    vi.mocked(usePathname).mockReturnValue("/");
    const { container } = render(<FooterDisclaimer />);
    expect(container).toBeEmptyDOMElement();
  });
});
