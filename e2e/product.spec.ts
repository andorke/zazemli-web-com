import { expect, test } from "@playwright/test";

// Smoke по всем 7 страницам товара: страница открывается, ровно один h1
// «Заземли {растение}.» (винительный), контентный мост на /lab и buybar
// с размер-селектором. Тексты h1 — вслед за sku.accusative (product-description v1.1.1).
const products = [
  { slug: "monstera", h1: "Заземли монстеру." },
  { slug: "ficus", h1: "Заземли фикус." },
  { slug: "anthurium", h1: "Заземли антуриум." },
  { slug: "aglaonema", h1: "Заземли аглаонему." },
  { slug: "spathiphyllum", h1: "Заземли спатифиллум." },
  { slug: "zamioculcas", h1: "Заземли замиокулькас." },
  { slug: "epipremnum", h1: "Заземли эпипремнум." },
];

for (const p of products) {
  test(`/collectio/${p.slug}: один h1, мост на /lab, buybar`, async ({
    page,
  }) => {
    await page.goto(`/collectio/${p.slug}`);

    const h1 = page.getByRole("heading", { level: 1 });
    await expect(h1).toHaveCount(1);
    await expect(h1).toHaveText(p.h1);

    // мост «Весь состав и источники → в лаборатории» в контенте страницы
    await expect(page.locator('main a[href^="/lab"]').first()).toBeVisible();

    // buybar: размер-селектор с кнопками объёмов
    const buybar = page.locator("section#buy");
    await expect(buybar.getByRole("group").getByRole("button").first()).toBeVisible();
  });
}
