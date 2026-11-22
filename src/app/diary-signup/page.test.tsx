import { render, screen } from "@testing-library/react";
import { expect, it } from "vitest";
import Page, { metadata } from "./page";

it("дневник сохраняет текст эталона и два пустых согласия", () => {
  render(<Page />);
  expect(screen.getByRole("heading", { level: 1 })).toHaveTextContent("Земля и забота — всё, что нужно");
  expect(screen.getByRole("textbox", { name: "Твоя почта" })).toHaveAttribute("type", "email");
  const consents = screen.getAllByRole("checkbox");
  expect(consents).toHaveLength(2);
  for (const checkbox of consents) { expect(checkbox).toBeRequired(); expect(checkbox).not.toBeChecked(); }
  expect(metadata.robots).toMatchObject({ index: false });
});
