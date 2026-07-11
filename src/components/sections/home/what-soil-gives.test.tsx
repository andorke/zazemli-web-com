import { render, screen } from "@testing-library/react";
import { describe, expect, it } from "vitest";

import { WhatSoilGives } from "@/components/sections/home/what-soil-gives";

describe("WhatSoilGives (две колонки канона)", () => {
  it("колонки «Растению» и «Тебе»", () => {
    render(<WhatSoilGives />);
    expect(
      screen.getByRole("heading", { level: 3, name: "Растению" }),
    ).toBeInTheDocument();
    expect(
      screen.getByRole("heading", { level: 3, name: "Тебе" }),
    ).toBeInTheDocument();
  });

  it("тексты канона дословно", () => {
    render(<WhatSoilGives />);
    expect(
      screen.getByText(
        "Дом, похожий на родной: корни дышат, влага и питание держатся ровно.",
      ),
    ).toBeInTheDocument();
    expect(
      screen.getByText(/Честный состав, без обещаний чудес\./),
    ).toBeInTheDocument();
  });
});
