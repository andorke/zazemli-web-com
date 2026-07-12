import { expect, test } from "@playwright/test";

/*
 * /lab — inverted pyramid (рецептуры до компонентов), модалка состава
 * с полной доступностью, deep-link рецептур, локальный дисклеймер.
 */

test("один h1 = заголовок hero", async ({ page }) => {
  await page.goto("/lab");
  const h1 = page.getByRole("heading", { level: 1 });
  await expect(h1).toHaveCount(1);
  await expect(h1).toHaveText("Лаборатория грунта.");
});

test("порядок секций: рецептуры (#recs) идут раньше компонентов (#comp)", async ({
  page,
}) => {
  await page.goto("/lab");
  const recsTop = await page.locator("#recs").boundingBox();
  const compTop = await page.locator("#comp").boundingBox();
  expect(recsTop).not.toBeNull();
  expect(compTop).not.toBeNull();
  expect(recsTop!.y).toBeLessThan(compTop!.y);
});

test("7 рецептур N°01–07 на странице", async ({ page }) => {
  await page.goto("/lab");
  await expect(page.locator("details#recs details, #recs details")).toHaveCount(
    7,
  );
});

test("модалка компонента: открытие, Esc закрывает и возвращает фокус", async ({
  page,
}) => {
  await page.goto("/lab");
  const tile = page.getByRole("button", { name: /Торф нейтральный/ });
  await tile.click();

  const dialog = page.getByRole("dialog");
  await expect(dialog).toBeVisible();
  await expect(dialog.getByRole("heading", { name: "Торф нейтральный" })).toBeVisible();

  await page.keyboard.press("Escape");
  await expect(dialog).toBeHidden();
  await expect(tile).toBeFocused();
});

test("модалка компонента: focus-trap держит фокус внутри на Tab", async ({
  page,
}) => {
  await page.goto("/lab");
  await page.getByRole("button", { name: /Торф нейтральный/ }).click();

  const dialog = page.getByRole("dialog");
  await expect(dialog).toBeVisible();

  // ловим фокус в конце диалога и проверяем цикл на первый элемент
  const focusables = dialog.locator(
    'button, a[href], summary, [tabindex]:not([tabindex="-1"])',
  );
  const count = await focusables.count();
  expect(count).toBeGreaterThan(0);

  await focusables.last().focus();
  await page.keyboard.press("Tab");
  await expect(focusables.first()).toBeFocused();
});

test("deep-link /lab#rec-ficus раскрывает и подсвечивает рецептуру фикуса", async ({
  page,
}) => {
  await page.goto("/lab#rec-ficus");
  const card = page.locator("#rec-ficus");
  await expect(card).toHaveJSProperty("open", true);
  await expect(card).toHaveAttribute("data-hi", "true");
});

test("дисклеймер локален: есть на /lab, отсутствует на главной", async ({
  page,
}) => {
  await page.goto("/lab");
  await expect(
    page.locator("footer").getByText(/Растения — не лекарство/),
  ).toBeVisible();

  await page.goto("/");
  await expect(
    page.locator("footer").getByText(/Растения — не лекарство/),
  ).toHaveCount(0);
});
