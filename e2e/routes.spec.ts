import { expect, test } from "@playwright/test";

const pages = [
  {
    path: "/collectio",
    h1: "Коллекция",
    title: /Коллекция · 7 родов растений/,
  },
  { path: "/lab", h1: "Лаборатория", title: /Лаборатория грунта/ },
  { path: "/guide", h1: "Гайд", title: /Гайд по пересадке/ },
  {
    path: "/diary-signup",
    // h1 = diary.hero.title (заглушка стала формой в task 2.1)
    h1: "Растение прижилось. Дальше — по дневнику, не наугад.",
    title: /Дневник растения/,
  },
];

for (const p of pages) {
  test(`${p.path}: title и h1`, async ({ page }) => {
    await page.goto(p.path);
    await expect(page).toHaveTitle(p.title);
    await expect(page.getByRole("heading", { level: 1 })).toHaveText(p.h1);
  });
}

test("навигация шапки ведёт на /lab", async ({ page }, testInfo) => {
  test.skip(testInfo.project.name !== "desktop", "десктоп-меню");
  await page.goto("/");
  await page
    .getByRole("banner")
    .getByRole("link", { name: "Лаборатория" })
    .click();
  await expect(page).toHaveURL(/\/lab\/?$/);
});

test("в header и footer нет ссылок на diary-signup", async ({ page }) => {
  await page.goto("/");
  const hrefs = await page
    .locator("header a[href], footer a[href]")
    .evaluateAll((els) => els.map((e) => e.getAttribute("href")));
  expect(hrefs.some((h) => h?.includes("diary"))).toBe(false);
});

test("diary-signup: noindex и отсутствие в sitemap", async ({
  page,
  request,
}) => {
  await page.goto("/diary-signup");
  await expect(page.locator('meta[name="robots"]')).toHaveAttribute(
    "content",
    /noindex/,
  );
  const sitemap = await (await request.get("/sitemap.xml")).text();
  expect(sitemap).not.toContain("diary-signup");
  expect(sitemap).toContain("https://zazemli.com/lab");
});

test("404 для несуществующего URL", async ({ page }) => {
  await page.goto("/nope");
  await expect(page.getByText("Страница не нашлась.")).toBeVisible();
  await expect(page.getByRole("link", { name: "На главную" })).toBeVisible();
});

test("burger открывает мобильное меню", async ({ page }, testInfo) => {
  test.skip(testInfo.project.name !== "mobile", "только мобильный вьюпорт");
  await page.goto("/");
  await page.getByRole("button", { name: "Открыть меню" }).click();
  await expect(
    page.getByRole("dialog").getByRole("link", { name: "Лаборатория" }),
  ).toBeVisible();
});
