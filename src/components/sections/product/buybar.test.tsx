import { render, screen } from "@testing-library/react";
import userEvent from "@testing-library/user-event";
import { describe, expect, it } from "vitest";

import { Buybar } from "@/components/sections/product/buybar";
import { buyCtaLabel, skus, type Sku } from "@/content/sku";

const monstera = skus.find((s) => s.slug === "monstera")!;
const [size0, size1] = monstera.sizes;

/* Цены в данных содержат U+00A0 (разделитель тысяч); DOM-текст testing-library
   нормализует \s к обычному пробелу — приводим иголку к тому же виду. */
const plain = (s: string) => s.replace(/ /g, " ");

describe("Buybar (размер-селектор и Ozon-CTA)", () => {
  it("селектор объёмов и цена первого размера", () => {
    render(<Buybar sku={monstera} />);
    expect(
      screen.getByRole("button", { name: size0.volume }),
    ).toBeInTheDocument();
    expect(
      screen.getByRole("button", { name: size1.volume }),
    ).toBeInTheDocument();
    expect(screen.getByText(plain(size0.price))).toBeInTheDocument();
  });

  it("переключение размера обновляет цену", async () => {
    render(<Buybar sku={monstera} />);
    await userEvent.click(screen.getByRole("button", { name: size1.volume }));
    expect(screen.getByText(plain(size1.price))).toBeInTheDocument();
    expect(screen.queryByText(plain(size0.price))).not.toBeInTheDocument();
  });

  it("при ozonListingUrl: null — кнопка «Скоро на Ozon», не ссылка", () => {
    render(<Buybar sku={monstera} />);
    expect(screen.getByText("Скоро на Ozon")).toBeInTheDocument();
    expect(screen.queryByRole("link")).not.toBeInTheDocument();
  });

  it("при заданном URL — CTA «Купить {размер} на Ozon» со sku-UTM, обновляется под размер", async () => {
    const withUrl: Sku = {
      ...monstera,
      sizes: monstera.sizes.map((s, i) => ({
        ...s,
        ozonListingUrl: `https://www.ozon.ru/product/${i}`,
      })),
    };
    render(<Buybar sku={withUrl} />);
    const link = screen.getByRole("link", {
      name: buyCtaLabel(withUrl.sizes[0]),
    });
    expect(link.getAttribute("href")).toContain("utm_content=sku001");
    await userEvent.click(screen.getByRole("button", { name: size1.volume }));
    expect(
      screen.getByRole("link", { name: buyCtaLabel(withUrl.sizes[1]) }),
    ).toBeInTheDocument();
  });
});
