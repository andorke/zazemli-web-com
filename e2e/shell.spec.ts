import { expect, test } from "@playwright/test";

/*
 * e2e ds-migration: topbar и footer по прототипу landing.html.
 * Header: 3 пункта (Коллекция → /#collectio), без Ozon-кнопки,
 * бургер <860px с aria-expanded. Footer: 3 колонки + legal-строка,
 * без QR и гигантского wordmark, без глобального дисклеймера.
 */

test.describe("topbar", () => {
  test("меню: 3 пункта, Коллекция ведёт на якорь главной", async ({
    page,
  }, testInfo) => {
    test.skip(testInfo.project.name !== "desktop", "десктоп-меню");
    await page.goto("/");
    const nav = page.getByRole("banner").getByRole("navigation");
    await expect(nav.getByRole("link")).toHaveCount(3);
    await expect(nav.getByRole("link", { name: "Коллекция" })).toHaveAttribute(
      "href",
      "/#collectio",
    );
    await expect(
      nav.getByRole("link", { name: "Лаборатория" }),
    ).toHaveAttribute("href", "/lab");
    await expect(nav.getByRole("link", { name: "Гайд" })).toHaveAttribute(
      "href",
      "/guide",
    );
  });

  test("кнопки Ozon в шапке нет", async ({ page }) => {
    await page.goto("/");
    await expect(page.getByRole("banner").getByText(/Ozon/i)).toHaveCount(0);
  });

  test("бургер на 360px: aria-expanded переключается, панель с 3 пунктами", async ({
    page,
  }, testInfo) => {
    test.skip(testInfo.project.name !== "mobile", "только мобильный вьюпорт");
    await page.goto("/");
    const burger = page.getByRole("button", { name: "Открыть меню" });
    await expect(burger).toHaveAttribute("aria-expanded", "false");
    await burger.click();
    /* модальный Sheet скрывает триггер из a11y-дерева — ищем с includeHidden */
    await expect(
      page.getByRole("button", { name: "Открыть меню", includeHidden: true }),
    ).toHaveAttribute("aria-expanded", "true");
    const panel = page.getByRole("dialog");
    await expect(panel.getByRole("link", { name: "Коллекция" })).toBeVisible();
    await expect(
      panel.getByRole("link", { name: "Лаборатория" }),
    ).toBeVisible();
    await expect(panel.getByRole("link", { name: "Гайд" })).toBeVisible();
    await expect(panel.getByText(/Ozon/i)).toHaveCount(0);
  });

  test("на 1440px бургер скрыт, меню видно", async ({ page }, testInfo) => {
    test.skip(testInfo.project.name !== "desktop", "десктоп");
    await page.goto("/");
    await expect(
      page.getByRole("button", { name: "Открыть меню" }),
    ).toBeHidden();
    await expect(
      page.getByRole("banner").getByRole("link", { name: "Гайд" }),
    ).toBeVisible();
  });
});

test.describe("footer", () => {
  test("3 колонки: тэглайн, связь, разделы + legal-строка", async ({
    page,
  }) => {
    await page.goto("/");
    const footer = page.locator("footer");
    await expect(
      footer.getByText("Земля и забота — всё, что нужно."),
    ).toBeVisible();
    await expect(
      footer.getByRole("link", { name: "team@zazemli.com" }),
    ).toBeVisible();
    await expect(footer.getByText(/Instagram · @zazemli_collectio/)).toBeVisible();
    await expect(footer.getByText(/Telegram · @zazemli_collectio/)).toBeVisible();
    await expect(footer.getByRole("link", { name: "Коллекция" })).toHaveAttribute(
      "href",
      "/#collectio",
    );
    await expect(footer.getByText(/не является публичной офертой/)).toBeVisible();
    await expect(footer.getByText(/© 2026 ЗАЗЕМЛИ/)).toBeVisible();
  });

  test("QR-кодов и гигантского wordmark нет", async ({ page }) => {
    await page.goto("/");
    const footer = page.locator("footer");
    await expect(footer.locator("img")).toHaveCount(0);
    /* wordmark в футере ровно один — в колонке бренда (гигантский был вторым, aria-hidden) */
    await expect(footer.getByText("ЗАЗЕМЛИ", { exact: true })).toHaveCount(1);
    await expect(footer.locator('[aria-hidden="true"]', { hasText: "ЗАЗЕМЛИ" })).toHaveCount(0);
  });

  test("глобального дисклеймера нет", async ({ page }) => {
    await page.goto("/");
    await expect(page.getByText(/Растения — не лекарство/)).toHaveCount(0);
  });
});
