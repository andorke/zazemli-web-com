import { expect, test } from "@playwright/test";

/* Заголовки 11 разделов с номером (на странице h2 = «{n}. {title}»),
 * дословно и по порядку из src/content/privacy.ts. */
const sectionHeadings = [
  "1. Общие положения",
  "2. Термины",
  "3. Какие данные мы обрабатываем",
  "4. Цели обработки",
  "5. Правовые основания",
  "6. Порядок и сроки обработки",
  "7. Передача данных третьим лицам",
  "8. Файлы cookie и веб-аналитика",
  "9. Права субъекта персональных данных",
  "10. Меры защиты",
  "11. Изменения Политики",
];

test("/privacy: открывается, ровно один h1 с заголовком политики", async ({
  page,
}) => {
  await page.goto("/privacy");
  await expect(page).toHaveTitle(/Политика конфиденциальности/);
  const h1 = page.getByRole("heading", { level: 1 });
  await expect(h1).toHaveCount(1);
  await expect(h1).toHaveText(
    "Политика в отношении обработки персональных данных",
  );
});

test("/privacy: 11 h2-разделов дословно и по порядку", async ({ page }) => {
  await page.goto("/privacy");
  await expect(page.locator("article h2")).toHaveText(sectionHeadings);
});
