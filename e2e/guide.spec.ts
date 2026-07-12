import { expect, test } from "@playwright/test";

/* /guide — CJM 5 стадий, HowTo, ноль Caveat-приписок (proposal: Caveat-пасхалок 0) */

test("один h1 = заголовок hero", async ({ page }) => {
  await page.goto("/guide");
  const h1 = page.getByRole("heading", { level: 1 });
  await expect(h1).toHaveCount(1);
  await expect(h1).toHaveText("Руки в землю — голова свободна.");
});

test("5 стадий CJM: h2 по порядку 00–04", async ({ page }) => {
  await page.goto("/guide");
  // h2 стадий живут в li#step-N; Ozon-h2 вне списка стадий и в счёт не идёт
  await expect(page.locator("li[id^='step-'] h2")).toHaveText([
    "Подготовка",
    "Конверт",
    "Дренаж",
    "Грунт",
    "Забота",
  ]);
});

test("ноль RitualNote: Caveat-приписок на /guide нет", async ({ page }) => {
  await page.goto("/guide");
  // Сигнатура RitualNote — span.text-moss-ink.font-voice.italic; text-moss-ink
  // отсекает подписи ImageSlot (те тоже font-voice italic, но без moss-ink)
  await expect(
    page.locator("span.text-moss-ink.font-voice.italic"),
  ).toHaveCount(0);
});
