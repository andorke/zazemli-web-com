import { render, screen } from "@testing-library/react";
import { describe, expect, it } from "vitest";

import { Manifesto } from "@/components/sections/home/manifesto";

describe("Manifesto (эссе-пауза прототипа)", () => {
  it("строка канона в заголовке", () => {
    render(<Manifesto />);
    expect(screen.getByRole("heading", { level: 2 })).toHaveTextContent(
      "Пересадка — не дело из списка. Это пауза.",
    );
  });

  it("split «Для растения» / «Для тебя» с core formula echo", () => {
    render(<Manifesto />);
    expect(screen.getByText("Для растения")).toBeInTheDocument();
    expect(screen.getByText("Для тебя")).toBeInTheDocument();
    expect(
      screen.getByText(/Земля и забота — всё, что нужно\./),
    ).toBeInTheDocument();
  });
});
