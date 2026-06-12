import { render, screen } from "@testing-library/react";
import { describe, expect, it } from "vitest";

import { OzonButton } from "@/components/site/ozon-button";

describe("OzonButton", () => {
  it("при href=null — заглушка «Скоро на Ozon», не ссылка", () => {
    render(<OzonButton href={null} />);
    expect(screen.getByText("Скоро на Ozon")).toBeInTheDocument();
    expect(screen.queryByRole("link")).not.toBeInTheDocument();
  });

  it("при заданном href — ссылка «Купить на Ozon» с utm_source=site", () => {
    render(<OzonButton href="https://www.ozon.ru/seller/zazemli" />);
    const link = screen.getByRole("link", { name: "Купить на Ozon" });
    expect(link.getAttribute("href")).toContain("utm_source=site");
  });
});
