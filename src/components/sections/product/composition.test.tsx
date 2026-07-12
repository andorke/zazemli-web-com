import { render, screen } from "@testing-library/react";
import { describe, expect, it } from "vitest";

import { Composition } from "@/components/sections/product/composition";
import { skus } from "@/content/sku";

const monstera = skus.find((s) => s.slug === "monstera")!;

describe("Composition (состав грунта)", () => {
  it("eyebrow с числом компонентов и H2 в родительном падеже", () => {
    render(<Composition sku={monstera} />);
    expect(screen.getByText("Состав · 10 компонентов")).toBeInTheDocument();
    expect(screen.getByRole("heading", { level: 2 })).toHaveTextContent(
      "Из чего собрана земля монстеры.",
    );
  });

  it("все компоненты состава с долями", () => {
    render(<Composition sku={monstera} />);
    expect(screen.getByText("Торф нейтральный")).toBeInTheDocument();
    expect(screen.getByText("Мох сфагнум")).toBeInTheDocument();
    // строк с долей ровно столько же, сколько компонентов
    expect(screen.getAllByText(/%$/)).toHaveLength(monstera.composition.length);
  });
});
