import { expect, test } from "@playwright/test";

/* Заголовки 13 разделов с номером (на странице h2 = «{n}. {title}»),
 * дословно и по порядку из src/content/privacy.ts. */
const sectionHeadings = [
  "1. Общие положения",
  "2. Термины",
  "3. Какие данные мы обрабатываем",
  "4. Принципы обработки",
  "5. Цели обработки",
  "6. Правовые основания",
  "7. Порядок и сроки обработки",
  "8. Передача данных третьим лицам",
  "9. Файлы cookie и веб-аналитика",
  "10. Права субъекта персональных данных",
  "11. Порядок обращения",
  "12. Меры защиты",
  "13. Изменения Политики",
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

test("/privacy: 13 h2-разделов дословно и по порядку", async ({ page }) => {
  await page.goto("/privacy");
  await expect(page.locator("article h2")).toHaveText(sectionHeadings);
});
