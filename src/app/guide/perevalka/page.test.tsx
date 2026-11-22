import { expect, it, vi } from "vitest";
vi.mock("next/font/local", () => ({ default: () => ({ variable: "" }) }));
import { render, screen } from "@testing-library/react";
import { guidePerevalka } from "@/content/guide";
import Page, { metadata } from "./page";

it("старая инструкция перевалки остаётся доступна со своим canonical", () => {
  render(<Page />);
  expect(screen.getByRole("heading", { level: 1 })).toHaveTextContent(guidePerevalka.hero.title);
  expect(metadata.alternates?.canonical).toBe("/guide/perevalka");
});
