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
        "Дом, как в природе: корни дышат, влага и питание держатся по запросу, структура не слёживается годами.",
      ),
    ).toBeInTheDocument();
    expect(
      screen.getByText(/Честный состав — без обещаний чудес\./),
    ).toBeInTheDocument();
  });

  it("шапка блока: eyebrow «Что даёт», H2 без точки и лид", () => {
    render(<WhatSoilGives />);
    expect(screen.getByText("Что даёт")).toBeInTheDocument();
    expect(screen.getByRole("heading", { level: 2 })).toHaveTextContent(
      "Растению — дом, тебе — меньше хлопот",
    );
    expect(
      screen.getByText(/Одна земля работает в две стороны/),
    ).toBeInTheDocument();
  });

  it("core formula закрывает блок и отделена линейкой (FIX-72)", () => {
    render(<WhatSoilGives />);
    const formula = screen.getByText("Земля и забота — всё, что нужно.");
    expect(formula.className).toContain("border-t");
    const columnText = screen.getByText(/Честный состав — без обещаний чудес/);
    expect(
      columnText.compareDocumentPosition(formula) &
        Node.DOCUMENT_POSITION_FOLLOWING,
    ).toBeTruthy();
  });
});
