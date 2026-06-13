import { expect, test } from "@playwright/test";

/* Без NEXT_PUBLIC_METRIKA_ID скрипт не грузится в любом случае — проверяем сам gate баннера */

test("первый визит: баннер виден, скрипт Метрики не загружен", async ({
  page,
}) => {
  await page.goto("/");
  await expect(page.getByRole("button", { name: "Принять" })).toBeVisible();
  await expect(page.locator('script[src*="mc.yandex.ru"]')).toHaveCount(0);
});

test("«Только необходимые»: баннер скрыт, Метрика не грузится, выбор сохранён", async ({
  page,
}) => {
  await page.goto("/");
  await page.getByRole("button", { name: "Только необходимые" }).click();
  await expect(page.getByRole("button", { name: "Принять" })).not.toBeVisible();
  await expect(page.locator('script[src*="mc.yandex.ru"]')).toHaveCount(0);

  // повторный визит — баннера нет
  await page.reload();
  await expect(page.getByRole("button", { name: "Принять" })).not.toBeVisible();
});
