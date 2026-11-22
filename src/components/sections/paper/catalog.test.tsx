import { render, screen } from "@testing-library/react";
import userEvent from "@testing-library/user-event";
import { expect, it, vi } from "vitest";
import { reachGoal } from "@/lib/metrika";
import { PaperCatalog } from "./catalog";

vi.mock("@/lib/metrika", () => ({ reachGoal: vi.fn() }));
vi.mock("@/content/paper/catalog", async importOriginal => {
  const source = await importOriginal<typeof import("@/content/paper/catalog")>();
  return {
    ...source,
    offers: [
      { id: "monstera-box-small", plant: "monstera", format: "box", potVolume: "2,2",
        packageVolume: "2,2 л", priceRub: 2390, url: "https://www.ozon.ru/product/test-box-1/",
        inStock: true, checkedAt: "2026-11-18" },
      { id: "monstera-box-large", plant: "monstera", format: "box", potVolume: "3,5",
        packageVolume: "3,5 л", priceRub: 2890, url: "https://www.ozon.ru/product/test-box-2/",
        inStock: true, checkedAt: "2026-11-18" },
    ],
  };
});

it("прямой Ozon-переход и цель соответствуют выбранному объёму", async () => {
  render(<PaperCatalog />);
  const buy = screen.getByRole("link", { name: "Купить бокс для монстеры на Ozon" });
  expect(new URL(buy.getAttribute("href")!).pathname).toBe("/product/test-box-1/");
  const large = screen.getByRole("button", { name: /^Горшок 3,5 л/ });
  const user = userEvent.setup();
  await user.click(large);
  expect(large).toHaveAttribute("aria-pressed", "true");
  const href = new URL(buy.getAttribute("href")!);
  expect(href.pathname).toBe("/product/test-box-2/");
  expect(href.searchParams.get("utm_content")).toBe("sku001");
  expect(reachGoal).toHaveBeenCalledWith("offer_select", {
    plant_slug: "monstera", format: "box", offer_id: "monstera-box-large", source: "catalog",
  });
});
