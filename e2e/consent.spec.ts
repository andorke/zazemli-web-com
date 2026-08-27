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

/*
 * Приёмка PATCH-1 §7.3: патч требует смотреть вкладку Network, а не разметку —
 * «до „Принять все" запросов к mc.yandex.ru нет». Проверка по <script> в DOM
 * этого не доказывает: счётчик может уйти fetch/img-пикселем мимо тега.
 */
test("§7.3: до согласия ни одного сетевого запроса к mc.yandex.ru", async ({
  page,
}) => {
  const metrikaCalls: string[] = [];
  page.on("request", (request) => {
    if (request.url().includes("mc.yandex.ru")) metrikaCalls.push(request.url());
  });

  await page.goto("/");
  await page.getByRole("button", { name: "Только необходимые" }).click();
  await page.reload();
  await page.goto("/lab");

  expect(metrikaCalls, `запросы: ${metrikaCalls.join(", ")}`).toEqual([]);
});

test("§7.3: выбор переживает переход между страницами, баннер не возвращается", async ({
  page,
}) => {
  await page.goto("/");
  await page.getByRole("button", { name: "Принять все" }).click();

  for (const path of ["/lab", "/guide", "/privacy"]) {
    await page.goto(path);
    await expect(
      page.getByRole("button", { name: "Принять все" }),
      `баннер вернулся на ${path}`,
    ).not.toBeVisible();
  }
  expect(await page.evaluate(() => localStorage.getItem("zazemli-consent"))).toBe(
    "all",
  );
});
