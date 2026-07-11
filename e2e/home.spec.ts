import { expect, test } from "@playwright/test";

test("11 блоков главной в порядке прототипа, Statement удалён", async ({
  page,
}) => {
  await page.goto("/");
  const sections = page.locator("main > section");
  await expect(sections).toHaveCount(11);
  await expect(page.getByText("Выращивай и создавай простое")).toHaveCount(0);
});

test("ключевые строки канона видимы", async ({ page }) => {
  await page.goto("/");
  await expect(page.getByRole("heading", { level: 1 })).toContainText(
    "Заземли растение. Заземли себя.",
  );
  await expect(page.getByText("Пересадка — не дело из списка.")).toBeVisible();
  await expect(
    page.getByText("Семь растений — семь рецептов земли."),
  ).toBeVisible();
  await expect(
    page.getByText("Разным растениям — разная земля."),
  ).toBeVisible();
  await expect(page.getByText("Всё на одну пересадку.")).toBeVisible();
});

test("якорь /#collectio скроллит к галерее", async ({ page }) => {
  await page.goto("/#collectio");
  await expect(page.locator("section#collectio")).toBeInViewport();
});

test("галерея: 7 кликабельных карточек, приглашение N° 08 и CTA", async ({
  page,
}) => {
  await page.goto("/");
  const gallery = page.locator("#collectio");
  await expect(gallery.locator("a", { hasText: "Открыть →" })).toHaveCount(7);
  await expect(gallery.getByText("N° 01")).toBeVisible();
  await expect(gallery.getByText("монстера")).toBeVisible();
  await expect(gallery.getByText("почти песок", { exact: true })).toBeVisible();
  await expect(gallery.getByText("N° 08 — ?")).toBeVisible();
  await expect(
    gallery.getByRole("link", { name: "Вся коллекция →" }),
  ).toBeVisible();
});

test("мост «почему именно так →» ведёт на /lab", async ({ page }) => {
  await page.goto("/");
  await page.getByRole("link", { name: "почему именно так →" }).click();
  await expect(page).toHaveURL(/\/lab\/?$/);
});

test("тизер «Дневник» — текстовый, без ссылок (в т.ч. на /diary-signup)", async ({
  page,
}) => {
  await page.goto("/");
  const diary = page.locator("article", {
    hasText: "Забота продолжается после пересадки.",
  });
  await expect(diary.getByText("часть бокса")).toBeVisible();
  await expect(diary.locator("a")).toHaveCount(0);
  await expect(page.locator('a[href*="diary-signup"]')).toHaveCount(0);
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
