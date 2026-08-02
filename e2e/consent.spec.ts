import { expect, test } from "@playwright/test";

/* Без NEXT_PUBLIC_METRIKA_ID скрипт не грузится в любом случае — проверяем сам gate баннера */

test("первый визит: баннер виден, скрипт Метрики не загружен", async ({
  page,
}) => {
  await page.goto("/");
  await expect(page.getByRole("button", { name: "Принять все" })).toBeVisible();
  await expect(page.locator('script[src*="mc.yandex.ru"]')).toHaveCount(0);
});

/* Баннер живёт в общем layout — юр-страницы не исключение (спека analytics-consent) */
for (const path of ["/privacy", "/terms"]) {
  test(`первый визит на ${path}: баннер виден`, async ({ page }) => {
    await page.goto(path);
    await expect(
      page.getByRole("button", { name: "Принять все" }),
    ).toBeVisible();
    await expect(
      page.getByRole("button", { name: "Только необходимые" }),
    ).toBeVisible();
  });
}

test("«Только необходимые»: баннер скрыт, Метрика не грузится, выбор сохранён", async ({
  page,
}) => {
  await page.goto("/");
  await page.getByRole("button", { name: "Только необходимые" }).click();
  await expect(
    page.getByRole("button", { name: "Принять все" }),
  ).not.toBeVisible();
  await expect(page.locator('script[src*="mc.yandex.ru"]')).toHaveCount(0);
  expect(
    await page.evaluate(() => localStorage.getItem("zazemli-consent")),
  ).toBe("necessary");

  // повторный визит — баннера нет
  await page.reload();
  await expect(
    page.getByRole("button", { name: "Принять все" }),
  ).not.toBeVisible();
});

test("«Принять все»: баннер скрыт, выбор сохранён как all", async ({
  page,
}) => {
  await page.goto("/");
  await page.getByRole("button", { name: "Принять все" }).click();
  await expect(
    page.getByRole("button", { name: "Принять все" }),
  ).not.toBeVisible();
  expect(
    await page.evaluate(() => localStorage.getItem("zazemli-consent")),
  ).toBe("all");
});
