import { render, screen } from "@testing-library/react";
import { describe, expect, it } from "vitest";

import { LabDifferentSoil } from "@/components/sections/lab/different-soil";

describe("LabDifferentSoil (трио колб на входе /lab, прототип lab.html)", () => {
  it("eyebrow «Состав» и заголовок без точки", () => {
    render(<LabDifferentSoil />);
    expect(screen.getByText("Состав")).toBeInTheDocument();
    const h2 = screen.getByRole("heading", { level: 2 });
    expect(h2).toHaveTextContent("Разным растениям — разная земля");
    expect(h2.textContent?.endsWith(".")).toBe(false);
  });

  it("текст блока и мост «почему именно так →» к рецептурам", () => {
    render(<LabDifferentSoil />);
    expect(
      screen.getByText(/Один грунт «для всех» не подходит никому/),
    ).toBeInTheDocument();
    const bridge = screen.getByRole("link", { name: "почему именно так →" });
    expect(bridge).toHaveAttribute("href", "#recs");
    expect(bridge.className).toContain("text-moss-ink");
  });

  it("три колбы: caption, «имя · N°» и биотоп", () => {
    render(<LabDifferentSoil />);
    expect(screen.getAllByRole("img")).toHaveLength(3);
    expect(screen.getByText("антуриум · N° 03")).toBeInTheDocument();
    expect(screen.getByText("фикус · N° 02")).toBeInTheDocument();
    expect(screen.getByText("замиокулькас · N° 06")).toBeInTheDocument();
    expect(screen.getByText("воздух, как на дереве")).toBeInTheDocument();
    expect(screen.getByText("горные леса Анд")).toBeInTheDocument();
    expect(screen.getByText("тропики Юго-Восточной Азии")).toBeInTheDocument();
    expect(screen.getByText("сухая Восточная Африка")).toBeInTheDocument();
  });

  it("общая легенда четырёх групп вместо боковых подписей колбы", () => {
    render(<LabDifferentSoil />);
    for (const label of ["основа", "воздух", "влага", "дренаж"]) {
      expect(screen.getByText(label)).toBeInTheDocument();
    }
    expect(screen.queryByText("основа и питание")).toBeNull();
  });
});
