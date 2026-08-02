import { render, screen } from "@testing-library/react";
import { describe, expect, it } from "vitest";

import { HowItWorks } from "@/components/sections/home/how-it-works";

describe("HowItWorks (3 шага прототипа)", () => {
  it("заголовок и лид", () => {
    render(<HowItWorks />);
    expect(screen.getByRole("heading", { level: 2 })).toHaveTextContent(
      "Три шага — и растение в новой земле",
    );
    expect(screen.getByText(/Без угадывания:/)).toBeInTheDocument();
  });

  it("три шага с номерами и заголовками", () => {
    render(<HowItWorks />);
    for (const step of [
      "Выбираешь растение",
      "Пересаживаешь по гайду",
      "Ведёшь дневник",
    ]) {
      expect(
        screen.getByRole("heading", { level: 3, name: step }),
      ).toBeInTheDocument();
    }
    expect(screen.getByText("01")).toBeInTheDocument();
    expect(screen.getByText("03")).toBeInTheDocument();
  });

  it("лид-строка снятого манифеста стоит перед H2, курсивом в moss-ink", () => {
    render(<HowItWorks />);
    const lead = screen.getByText(
      "Пересадка выглядит как дело на вечер. По сути — пауза.",
    );
    expect(lead.className).toContain("italic");
    expect(lead.className).toContain("text-moss-ink");
    const h2 = screen.getByRole("heading", { level: 2 });
    expect(
      lead.compareDocumentPosition(h2) & Node.DOCUMENT_POSITION_FOLLOWING,
    ).toBeTruthy();
  });

  it("тейк Т3 закрывает шаг 03: линейка сверху, moss-ink (NEW-04)", () => {
    render(<HowItWorks />);
    const take = screen.getByText(
      "Бокс заканчивается в день пересадки. Дневник — нет",
    );
    expect(take.className).toContain("border-t");
    expect(take.className).toContain("text-moss-ink");
    const step03 = screen
      .getByRole("heading", { level: 3, name: "Ведёшь дневник" })
      .closest("div");
    expect(step03?.contains(take)).toBe(true);
  });

  it("шаг 01 без «природной почвы» (FIX-04)", () => {
    const { container } = render(<HowItWorks />);
    expect(container.textContent).not.toMatch(/природн\w*\s+почв/);
    expect(
      screen.getByText(
        "Собираем бокс под него — грунт под то, как оно живёт в природе.",
      ),
    ).toBeInTheDocument();
  });
});
