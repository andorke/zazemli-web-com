import { render, screen } from "@testing-library/react";
import { describe, expect, it } from "vitest";

import { HowItWorks } from "@/components/sections/home/how-it-works";

describe("HowItWorks (3 шага прототипа)", () => {
  it("заголовок и лид", () => {
    render(<HowItWorks />);
    expect(screen.getByRole("heading", { level: 2 })).toHaveTextContent(
      "Три шага — и растение в новой земле.",
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
});
