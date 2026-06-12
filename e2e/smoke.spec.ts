import { expect, test } from "@playwright/test";

test("дев-сервер отдаёт главную", async ({ page }) => {
  await page.goto("/");
  await expect(page.getByRole("heading", { level: 1 })).toHaveText("ЗАЗЕМЛИ");
});
