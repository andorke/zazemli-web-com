import { render, screen } from "@testing-library/react";
import { describe, expect, it } from "vitest";

import { WhatsInBox } from "@/components/sections/product/whats-in-box";
import { skus } from "@/content/sku";

const monstera = skus.find((s) => s.slug === "monstera")!;

describe("WhatsInBox (что в боксе, страница товара)", () => {
  it("eyebrow и H2 «на одну пересадку» в родительном падеже", () => {
    render(<WhatsInBox sku={monstera} />);
    expect(screen.getByText("Что в боксе")).toBeInTheDocument();
    expect(screen.getByRole("heading", { level: 2 })).toHaveTextContent(
      "Всё на одну пересадку монстеры.",
    );
  });

  it("нумерованная опись всех позиций бокса", () => {
    render(<WhatsInBox sku={monstera} />);
    expect(
      screen.getByText("Почвосмесь под монстеру · 10 компонентов"),
    ).toBeInTheDocument();
    expect(
      screen.getByText("Листовка с гайдом по пересадке"),
    ).toBeInTheDocument();
    expect(screen.getByText("01")).toBeInTheDocument();
    expect(screen.getByText("06")).toBeInTheDocument();
  });
});
