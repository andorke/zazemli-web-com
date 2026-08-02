import { expect, test } from "@playwright/test";

/*
 * Гайд v4.0 — три страницы: вход /guide (стадии 00–01 + развилка) и две ветки
 * /guide/perevalka · /guide/polnaya-zamena. Приёмка PATCH-1 §7.2: URL открываются,
 * переходы работают в обе стороны, общие шаги совпадают, HowTo только на ветках.
 */

const pages = [
  {
    path: "/guide",
    h1: "Руки в землю — голова свободна",
    title: /Пересадка растения шаг за шагом/,
  },
  {
    path: "/guide/perevalka",
    h1: "Не замена, но дополнение",
    title: /Перевалка растения/,
  },
  {
    path: "/guide/polnaya-zamena",
    h1: "Пусти корни в новую землю",
    title: /Полная замена грунта/,
  },
];

for (const p of pages) {
  test(`${p.path}: открывается, title и один h1`, async ({ page }) => {
    await page.goto(p.path);
    await expect(page).toHaveTitle(p.title);
    const h1 = page.getByRole("heading", { level: 1 });
    await expect(h1).toHaveCount(1);
    await expect(h1).toHaveText(p.h1);
  });
}

test("/guide: стадии 00–01, шагов 02–04 нет", async ({ page }) => {
  await page.goto("/guide");
  // h2 стадий живут в li#step-*; заголовки веток развилки и Ozon-h2 вне списка
  await expect(page.locator("li[id^='step-'] h2")).toHaveText([
    "Подготовка",
    "Забота о руках и корнях",
  ]);
});

test("/guide: развилка стоит после осмотра кома", async ({ page }) => {
  await page.goto("/guide");
  const stageBox = await page.locator("li#step-1").boundingBox();
  const forkBox = await page.locator("section#fork").boundingBox();
  expect(stageBox).not.toBeNull();
  expect(forkBox).not.toBeNull();
  expect(forkBox!.y).toBeGreaterThan(stageBox!.y);
});

const forkTargets = [
  { button: "Выбираю перевалку", url: /\/guide\/perevalka\/?$/ },
  { button: "Выбираю полную замену", url: /\/guide\/polnaya-zamena\/?$/ },
];

for (const target of forkTargets) {
  test(`развилка: «${target.button}» ведёт на ветку`, async ({ page }) => {
    await page.goto("/guide");
    await page.getByRole("link", { name: target.button }).click();
    await expect(page).toHaveURL(target.url);
  });
}

test("ветки связаны крест-накрест ссылкой «Это не мой случай»", async ({
  page,
}) => {
  await page.goto("/guide/perevalka");
  await page.getByRole("link", { name: /нужна замена грунта/ }).click();
  await expect(page).toHaveURL(/\/guide\/polnaya-zamena\/?$/);

  await page.getByRole("link", { name: /нужна перевалка/ }).click();
  await expect(page).toHaveURL(/\/guide\/perevalka\/?$/);
});

test("общие шаги «Дренаж» и «Дневник» есть на обеих ветках", async ({
  page,
}) => {
  const shared = ["#step-drenazh", "#step-zabota"];
  const seen: string[][] = [];
  for (const path of ["/guide/perevalka", "/guide/polnaya-zamena"]) {
    await page.goto(path);
    seen.push(
      await Promise.all(
        shared.map((id) => page.locator(`${id} h2`).innerText()),
      ),
    );
  }
  expect(seen[0]).toEqual(["Дренаж", "Дневник"]);
  expect(seen[1]).toEqual(seen[0]);
});

test("HowTo: по одному на ветку, на входе нет", async ({ page }) => {
  await page.goto("/guide");
  await expect(page.locator('script[type="application/ld+json"]')).toHaveCount(
    0,
  );

  for (const path of ["/guide/perevalka", "/guide/polnaya-zamena"]) {
    await page.goto(path);
    const blocks = page.locator('script[type="application/ld+json"]');
    await expect(blocks).toHaveCount(1);
    const data = JSON.parse(await blocks.innerText());
    expect(data["@type"]).toBe("HowTo");
    expect(data.step.length).toBeGreaterThan(0);
  }
});

test("подсказка-раскрывашка развилки открывается кликом", async ({ page }) => {
  await page.goto("/guide");
  const tip = page
    .locator("details")
    .filter({ hasText: "Почему именно эти признаки" })
    .first();
  await expect(tip).toHaveJSProperty("open", false);
  await tip.locator("summary").click();
  await expect(tip).toHaveJSProperty("open", true);
  await expect(tip.getByText(/первое заземление/).first()).toBeVisible();
});

test("ветки: noindex, follow и canonical на /guide", async ({ request }) => {
  for (const path of ["/guide/perevalka", "/guide/polnaya-zamena"]) {
    const html = await (await request.get(path)).text();
    expect(html).toMatch(/name="robots"\s+content="noindex,\s*follow"/);
    expect(html).toMatch(
      /rel="canonical"\s+href="https:\/\/zazemli\.com\/guide"/,
    );
  }
});
