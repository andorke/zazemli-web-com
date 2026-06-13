import { expect, test } from "@playwright/test";

test("дев-сервер отдаёт главную с hero", async ({ page }) => {
  await page.goto("/");
  await expect(page.getByRole("heading", { level: 1 })).toContainText(
    "Заземли растение",
  );
});
