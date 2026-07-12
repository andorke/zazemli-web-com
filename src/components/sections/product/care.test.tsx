import { render, screen } from "@testing-library/react";
import { describe, expect, it } from "vitest";

import { Care } from "@/components/sections/product/care";
import { skus } from "@/content/sku";

const monstera = skus.find((s) => s.slug === "monstera")!;

describe("Care («Уход мы расписали за тебя»)", () => {
  it("eyebrow, H2 и подводка ухода", () => {
    render(<Care sku={monstera} />);
    expect(screen.getByText("После пересадки")).toBeInTheDocument();
    expect(screen.getByRole("heading", { level: 2 })).toHaveTextContent(
      "Уход мы расписали за тебя.",
    );
    expect(screen.getByText(/мы изучили именно монстеру/)).toBeInTheDocument();
  });

  it("грид из трёх колонок ухода", () => {
    render(<Care sku={monstera} />);
    expect(screen.getByText("Полив")).toBeInTheDocument();
    expect(screen.getByText("Подкормка")).toBeInTheDocument();
    expect(screen.getByText("Листья")).toBeInTheDocument();
  });

  it("аккордеон источников рекомендаций", () => {
    render(<Care sku={monstera} />);
    expect(screen.getByText("источники рекомендаций")).toBeInTheDocument();
    expect(screen.getByText(/NC State Extension, RHS/)).toBeInTheDocument();
  });

  it("дневник-панель на год", () => {
    render(<Care sku={monstera} />);
    expect(screen.getByText("Дневник на год")).toBeInTheDocument();
    expect(
      screen.getByText(/Сезонный календарь заботы под монстеру/),
    ).toBeInTheDocument();
  });
});
