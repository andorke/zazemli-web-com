import { render, screen } from "@testing-library/react";
import { describe, expect, it } from "vitest";

import { WhatsInBox } from "@/components/sections/home/whats-in-box";

describe("WhatsInBox (опись канона, компоновка прототипа)", () => {
  it("заголовок канона «Всё на одну пересадку.»", () => {
    render(<WhatsInBox />);
    expect(screen.getByRole("heading", { level: 2 })).toHaveTextContent(
      "Всё на одну пересадку.",
    );
  });

  it("опись — 5 позиций прототипа, у 03 четыре подпункта заботы", () => {
    render(<WhatsInBox />);
    const items = screen.getAllByRole("listitem");
    // 5 позиций описи + 4 подпункта «Забота о корнях и твоих руках»
    expect(items).toHaveLength(9);
    expect(items[0]).toHaveTextContent("Грунт, собранный под твоё растение");
    expect(items[2]).toHaveTextContent("«Забота о корнях и твоих руках»");
    expect(
      screen.getByText(/баночка угольной пудры, чтобы подсушить свежий срез/),
    ).toBeInTheDocument();
  });

  it("позиция 01 ведёт в лабораторию грунта", () => {
    render(<WhatsInBox />);
    expect(
      screen.getByRole("link", { name: "подробнее в лаборатории грунта →" }),
    ).toHaveAttribute("href", "/lab");
  });

  it("завершающая строка и фото-слот прототипа", () => {
    render(<WhatsInBox />);
    expect(
      screen.getByText("Ничего не докупать и не хранить потом в шкафу."),
    ).toBeInTheDocument();
    expect(
      screen.getByText(/раскладка бокса · фото top-down/),
    ).toBeInTheDocument();
  });
});
