import { describe, expect, it, vi } from "vitest";

import ProductPage, {
  generateMetadata,
  generateStaticParams,
} from "@/app/collectio/[slug]/page";
import { skus } from "@/content/sku";

/* notFound() в проде бросает — мок сохраняет это поведение, чтобы поймать вызов */
vi.mock("next/navigation", () => ({
  notFound: () => {
    throw new Error("NEXT_HTTP_ERROR_FALLBACK;404");
  },
}));

describe("Роут /collectio/[slug]", () => {
  it("generateStaticParams отдаёт по одному slug на каждый SKU", async () => {
    const params = await generateStaticParams();
    expect(params).toEqual(skus.map((s) => ({ slug: s.slug })));
  });

  it("метаданные известного SKU: имя в title, латынь в description, canonical по slug", async () => {
    const meta = await generateMetadata({
      params: Promise.resolve({ slug: "monstera" }),
    });
    expect(meta.alternates?.canonical).toBe("/collectio/monstera");
    expect(JSON.stringify(meta.title)).toContain("Монстера");
    expect(meta.description).toContain("Monstera");
  });

  it("метаданные неизвестного SKU: пустой объект без падения", async () => {
    const meta = await generateMetadata({
      params: Promise.resolve({ slug: "ficus-lyrata" }),
    });
    expect(meta).toEqual({});
  });

  it("неизвестный slug → notFound() (404)", async () => {
    await expect(
      ProductPage({ params: Promise.resolve({ slug: "ficus-lyrata" }) }),
    ).rejects.toThrow(/404/);
  });
});
