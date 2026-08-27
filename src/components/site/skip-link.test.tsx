import { render, screen } from "@testing-library/react";
import { describe, expect, it } from "vitest";

import { SkipLink } from "@/components/site/skip-link";

describe("SkipLink", () => {
  it("ведёт на якорь основного содержания", () => {
    render(<SkipLink />);
    expect(screen.getByRole("link", { name: "К основному содержанию" })).toHaveAttribute(
      "href",
      "#main",
    );
  });

  it("текст — verbatim из прототипа", () => {
    render(<SkipLink />);
    expect(screen.getByText("К основному содержанию")).toBeInTheDocument();
  });

  it("скрыта за экраном до фокуса, а не display:none — иначе выпадет из порядка Tab", () => {
    const { container } = render(<SkipLink />);
    const link = container.querySelector("a");
    expect(link?.className).toMatch(/absolute/);
    expect(link?.className).not.toMatch(/\bhidden\b/);
    expect(link?.className).toMatch(/focus:/);
  });
});
