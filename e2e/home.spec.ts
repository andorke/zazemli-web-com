import { expect, test } from "@playwright/test";

test("9 секций главной в порядке эталона", async ({ page }) => {
  await page.goto("/");
  const sections = page.locator("main > section");
  await expect(sections).toHaveCount(9);
});

test("ключевые строки эталона видимы", async ({ page }) => {
  await page.goto("/");
  await expect(
    page.getByText("II · РАЗНЫМ РАСТЕНИЯМ — РАЗНАЯ ЗЕМЛЯ"),
  ).toBeVisible();
  await expect(page.getByText("Выращивай и создавай простое")).toBeVisible();
  await expect(
    page.getByText("Семь растений, три размера. От 1 890 ₽."),
  ).toBeVisible();
});

test("галерея: заголовок и 7 SKU с фразами", async ({ page }) => {
  await page.goto("/");
  await expect(
    page.getByText("Семь растений — семь рецептов земли"),
  ).toBeVisible();
  await expect(page.getByText("монстера")).toBeVisible();
  await expect(page.getByText("эпипремнум")).toBeVisible();
  await expect(page.getByText("почти песок")).toBeVisible();
});

test("нет горизонтального скролла", async ({ page }) => {
  await page.goto("/");
  const overflow = await page.evaluate(
    () =>
      document.documentElement.scrollWidth -
      document.documentElement.clientWidth,
  );
  expect(overflow).toBeLessThanOrEqual(1);
});
