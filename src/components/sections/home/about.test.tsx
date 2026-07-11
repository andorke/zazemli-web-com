import { render, screen } from "@testing-library/react";
import { describe, expect, it } from "vitest";

import { About } from "@/components/sections/home/about";

describe("About (о нас, прототип-редакция)", () => {
  it("eyebrow и два абзаца истории", () => {
    render(<About />);
    expect(screen.getByText("О нас")).toBeInTheDocument();
    expect(
      screen.getByText(/Восемь лет я работала с цифровыми продуктами/),
    ).toBeInTheDocument();
    expect(screen.getByText(/Так появился ЗАЗЕМЛИ\./)).toBeInTheDocument();
  });

  it("подпись «— Настя, основательница» с фльероном ❦", () => {
    render(<About />);
    expect(screen.getByText(/— Настя, основательница/)).toBeInTheDocument();
    expect(screen.getByText("❦")).toBeInTheDocument();
  });
});
