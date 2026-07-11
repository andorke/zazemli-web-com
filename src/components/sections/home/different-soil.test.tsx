import { render, screen } from "@testing-library/react";
import { describe, expect, it } from "vitest";

import { DifferentSoil } from "@/components/sections/home/different-soil";

describe("DifferentSoil (колбы по прототипу)", () => {
  it("заголовок и body канона", () => {
    render(<DifferentSoil />);
    expect(screen.getByRole("heading", { level: 2 })).toHaveTextContent(
      "Разным растениям — разная земля.",
    );
    expect(
      screen.getByText(/Один грунт «для всех» не подходит никому/),
    ).toBeInTheDocument();
  });

  it("мост «почему именно так →» ведёт на /lab цветом moss-ink", () => {
    render(<DifferentSoil />);
    const bridge = screen.getByRole("link", { name: "почему именно так →" });
    expect(bridge).toHaveAttribute("href", "/lab");
    expect(bridge.className).toContain("text-moss-ink");
  });

  it("трио прототипа: антуриум · фикус · замиокулькас с номерами и биотопами", () => {
    render(<DifferentSoil />);
    expect(screen.getAllByRole("img")).toHaveLength(3);
    expect(screen.getByText("антуриум · N° 03")).toBeInTheDocument();
    expect(screen.getByText("фикус · N° 02")).toBeInTheDocument();
    expect(screen.getByText("замиокулькас · N° 06")).toBeInTheDocument();
    expect(screen.getByText("горные леса Анд")).toBeInTheDocument();
    expect(screen.getByText("тропики Юго-Восточной Азии")).toBeInTheDocument();
    expect(screen.getByText("сухая Восточная Африка")).toBeInTheDocument();
  });

  it("легенда четырёх групп вместо боковых подписей колбы", () => {
    render(<DifferentSoil />);
    for (const label of ["основа", "воздух", "влага", "дренаж"]) {
      expect(screen.getByText(label)).toBeInTheDocument();
    }
    // боковые подписи SoilVial на лендинге выключены — их заменяет легенда
    expect(screen.queryByText("основа и питание")).toBeNull();
  });
});
