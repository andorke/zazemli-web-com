import { render, screen } from "@testing-library/react";
import { describe, expect, it } from "vitest";

import { Why } from "@/components/sections/diary/why";
import { diary } from "@/content/diary";

/* «Почему тебе» — 3 выгоды (diary.why). Копи — из diary.ts. */
describe("Why (3 выгоды /diary-signup)", () => {
  it("заголовок секции — h2 из diary.why", () => {
    render(<Why />);
    expect(screen.getByRole("heading", { level: 2 })).toHaveTextContent(
      diary.why.title,
    );
  });

  it("три выгоды — заголовок (h3) и текст каждой", () => {
    render(<Why />);
    for (const benefit of diary.why.benefits) {
      expect(
        screen.getByRole("heading", { level: 3, name: benefit.title }),
      ).toBeInTheDocument();
      expect(screen.getByText(benefit.text)).toBeInTheDocument();
    }
  });
});
