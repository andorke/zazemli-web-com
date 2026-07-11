import { render, screen, within } from "@testing-library/react";
import { describe, expect, it } from "vitest";

import { Teasers } from "@/components/sections/home/teasers";

describe("Teasers ×3 (Лаборатория · Гайд · Дневник)", () => {
  it("Лаборатория и Гайд — ссылки на /lab и /guide", () => {
    render(<Teasers />);
    expect(
      screen.getByRole("link", { name: "В лабораторию →" }),
    ).toHaveAttribute("href", "/lab");
    expect(screen.getByRole("link", { name: "Открыть гайд →" })).toHaveAttribute(
      "href",
      "/guide",
    );
    expect(
      screen.getByRole("heading", {
        level: 3,
        name: "Руки в землю — голова свободна.",
      }),
    ).toBeInTheDocument();
  });

  it("тизер «Дневник» — текстовый, без единой ссылки (вход только по QR)", () => {
    render(<Teasers />);
    const diaryHeading = screen.getByRole("heading", {
      level: 3,
      name: "Забота продолжается после пересадки.",
    });
    const diary = diaryHeading.closest("article");
    expect(diary).not.toBeNull();
    expect(within(diary as HTMLElement).queryAllByRole("link")).toHaveLength(0);
    expect(
      within(diary as HTMLElement).getByText("часть бокса"),
    ).toBeInTheDocument();
  });
});
