import { expect, test } from "@playwright/test";

/* Заголовки 8 разделов с номером (на странице h2 = «{n}. {title}»),
 * дословно и по порядку из src/content/terms.ts. */
const sectionHeadings = [
  "1. Кто мы и что регулирует этот документ",
  "2. Статус документа и согласие",
  "3. Что Сайт делает, а чего не делает",
  "4. Интеллектуальная собственность",
  "5. Что делать нельзя",
  "6. Формы обратной связи",
  "7. Сайт предоставляется «как есть»",
  "8. Заключительные положения",
];

test("/terms: открывается, ровно один h1 с заголовком условий", async ({
  page,
}) => {
  await page.goto("/terms");
  await expect(page).toHaveTitle(/Условия использования сайта/);
  const h1 = page.getByRole("heading", { level: 1 });
  await expect(h1).toHaveCount(1);
  await expect(h1).toHaveText("Условия использования сайта");
});

test("/terms: 8 h2-разделов дословно и по порядку", async ({ page }) => {
  await page.goto("/terms");
  await expect(page.locator("article h2")).toHaveText(sectionHeadings);
});
