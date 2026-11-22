import { render, screen } from "@testing-library/react";
import { expect, it, vi } from "vitest";
import { plants } from "@/content/paper/catalog";
import ProductPage, { generateMetadata, generateStaticParams } from "./page";

vi.mock("next/navigation", async (importOriginal) => ({
  ...(await importOriginal<typeof import("next/navigation")>()),
  useRouter: () => ({ push: vi.fn(), prefetch: vi.fn() }),
}));

it("экспортирует семь прежних адресов", () => {
  expect(generateStaticParams()).toEqual(plants.map(({slug}) => ({slug})));
});

it.each(plants)("$slug имеет свои фото, цены и canonical", async plant => {
  const props = { params: Promise.resolve({ slug: plant.slug }) };
  const { container } = render(await ProductPage(props));
  expect(screen.getByRole("heading", { level: 1 })).toHaveTextContent(`Бокс для ${plant.gen}`);
  expect(container.querySelector(".direct-box-shot")).toHaveAttribute("src", `/warm-paper/assets/scene-${plant.slug}.webp`);
  expect(container.querySelectorAll(".box-price-pair")).toHaveLength(plant.volume.length);
  const data = await generateMetadata(props);
  expect(data.alternates?.canonical).toBe(`/collectio/${plant.slug}`);
});

it("неизвестный slug не подменяется монстерой", async () => {
  await expect(ProductPage({ params: Promise.resolve({ slug: "unknown" }) })).rejects.toThrow("NEXT_HTTP_ERROR_FALLBACK;404");
});
