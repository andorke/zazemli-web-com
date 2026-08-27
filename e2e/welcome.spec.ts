import { expect, test } from "@playwright/test";

/*
 * Приёмка встречи QR-входов (change qr-welcome, задача 8.1).
 *
 * Скан QR камерой открывает новую вкладку с пустым sessionStorage — поэтому
 * гейт show-once проверяется именно так: первый заход показывает встречу,
 * навигация внутри вкладки — уже нет.
 */
const QR_ENTRIES = ["/guide", "/lab", "/diary-signup"];

for (const path of QR_ENTRIES) {
  test(`встреча на первом заходе: ${path}`, async ({ page }) => {
    await page.goto(path);
    const gate = await page.evaluate(() =>
      document.documentElement.classList.contains("js-welcome"),
    );
    expect(gate, "класс встречи не выставлен").toBe(true);
  });
}


/*
 * QR партии 0 напечатан на `/collectio`, а тот уводит на `/#collectio`.
 * Транзитная страница не должна тратить show-once, иначе встреча на главной
 * не покажется никому, кто пришёл по печатному коду.
 */
test("редирект /collectio не съедает встречу на главной", async ({ page }) => {
  await page.goto("/collectio");
  await page.waitForURL(/#collectio/);
  expect(
    await page.evaluate(() => document.documentElement.classList.contains("js-welcome")),
    "после редиректа встреча должна отыграть на главной",
  ).toBe(true);
});

test("повторная навигация внутри вкладки — без встречи", async ({ page }) => {
  await page.goto("/guide");
  expect(
    await page.evaluate(() => document.documentElement.classList.contains("js-welcome")),
  ).toBe(true);

  await page.goto("/lab");
  expect(
    await page.evaluate(() => document.documentElement.classList.contains("js-welcome")),
    "на втором заходе встреча повторяться не должна",
  ).toBe(false);
});

test("?src=qr не ломает страницу", async ({ page }) => {
  await page.goto("/guide?src=qr");
  await expect(page.locator("h1")).toBeVisible();
});

test("контент виден при reduced-motion, курсор-слоя нет", async ({ browser }) => {
  const context = await browser.newContext({ reducedMotion: "reduce" });
  const page = await context.newPage();
  await page.goto("/");

  await expect(page.locator("h1")).toBeVisible();
  const opacity = await page
    .locator("h1")
    .evaluate((n) => Number(getComputedStyle(n).opacity));
  expect(opacity, "заголовок должен быть полностью видим").toBeGreaterThan(0.9);

  expect(await page.locator(".fx-layer").count(), "слой не должен монтироваться").toBe(0);
  await context.close();
});

test("курсор-слой не перехватывает клики по CTA", async ({ page }) => {
  await page.goto("/");
  const cta = page.getByRole("link", { name: /К коллекции/ }).first();
  await cta.click();
  await expect(page).toHaveURL(/#collectio/);
});

test("галерея семи SKU приходит каскадом и остаётся видимой", async ({ page }) => {
  await page.goto("/#collectio");
  const cards = page.locator(".welcome-gallery > li > a");
  await expect(cards.first()).toBeVisible();
  /* лесенка идёт шагом 70ms по восьми плиткам — ждём её завершения */
  await page.waitForTimeout(1200);
  const opacity = await cards.first().evaluate((n) => Number(getComputedStyle(n).opacity));
  expect(opacity, "карточка должна доехать до полной видимости").toBeGreaterThan(0.9);
});
