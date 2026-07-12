import { render, screen } from "@testing-library/react";
import { describe, expect, it } from "vitest";

import { Echo } from "@/components/sections/diary/echo";
import { diary } from "@/content/diary";

/* Эхо + повтор CTA (diary.echo) — ссылка ведёт к форме (#signup). */
describe("Echo (повтор CTA /diary-signup)", () => {
  it("заголовок-эхо — h2 из diary.echo (core formula)", () => {
    render(<Echo />);
    expect(screen.getByRole("heading", { level: 2 })).toHaveTextContent(
      diary.echo.title,
    );
  });

  it("CTA ведёт к форме #signup", () => {
    render(<Echo />);
    expect(
      screen.getByRole("link", { name: diary.echo.cta.label }),
    ).toHaveAttribute("href", diary.echo.cta.href);
  });
});
