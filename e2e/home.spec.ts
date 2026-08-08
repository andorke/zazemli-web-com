import { expect, test } from "@playwright/test";

/*
 * Главная по канону home.md v2.5 / прототипу landing.html: девять блоков,
 * «Что в боксе» вторым (FIX-13), манифеста и колб нет (FIX-78),
 * блок «Купить» — только размеры (NEW-03), тейк Т3 в шаге 03 (NEW-04).
 */

test("девять блоков главной в порядке v2.5, Statement удалён", async ({
  page,
}) => {
  await page.goto("/");
  const sections = page.locator("main > section");
  await expect(sections).toHaveCount(9);
  await expect(sections.nth(1)).toContainText("Что в боксе");
  await expect(page.getByText("Выращивай и создавай простое")).toHaveCount(0);
});

test("ключевые строки канона видимы", async ({ page }) => {
  await page.goto("/");
  await expect(page.getByRole("heading", { level: 1 })).toContainText(
    "Заземли растение. Заземли себя",
  );
  await expect(page.getByText("Всё на одну пересадку")).toBeVisible();
  await expect(
    page.getByText("Семь растений — семь рецептур земли"),
  ).toBeVisible();
  await expect(
    page.getByText("Пересадка выглядит как дело на вечер. По сути — пауза."),
  ).toBeVisible();
  /* та же строка есть в футере — сужаем до main, иначе strict mode */
  await expect(
    page.getByRole("main").getByText("Земля и забота — всё, что нужно."),
  ).toBeVisible();
});

test("снятые блоки: манифеста и колб на главной нет (FIX-78)", async ({
  page,
}) => {
  await page.goto("/");
  await expect(page.getByText("Разным растениям — разная земля")).toHaveCount(
    0,
  );
  await expect(page.getByText("Пересадка — не дело из списка")).toHaveCount(0);
});

test("состав бокса: четыре подпункта заботы и мост в лабораторию", async ({
  page,
}) => {
  await page.goto("/");
  await expect(
    page.getByText("баночка угольной пудры, чтобы подсушить свежий срез"),
  ).toBeVisible();
  await expect(
    page.getByRole("link", { name: "подробнее в лаборатории грунта →" }),
  ).toHaveAttribute("href", "/lab");
});

test("тейк Т3 закрывает шаг 03, а не блок «Купить» (NEW-04)", async ({
  page,
}) => {
  await page.goto("/");
  const sections = page.locator("main > section");
  await expect(sections.nth(3)).toContainText(
    "Бокс заканчивается в день пересадки. Дневник — нет",
  );
  await expect(sections.nth(8)).not.toContainText("Бокс заканчивается");
});

test("блок «Купить»: три некликабельные плитки, risk-reversal и mailto", async ({
  page,
}) => {
  await page.goto("/");
  const buy = page.locator("main > section").nth(8);
  const tiles = buy.locator("li");
  await expect(tiles).toHaveCount(3);
  await expect(tiles.locator("a")).toHaveCount(0);
  await expect(buy.getByText("Пересаживают раз в год, весной")).toBeVisible();
  await expect(
    buy.getByRole("link", { name: "team@zazemli.com" }),
  ).toHaveAttribute("href", "mailto:team@zazemli.com");
});

test("якорь /#collectio скроллит к галерее", async ({ page }) => {
  await page.goto("/#collectio");
  await expect(page.locator("section#collectio")).toBeInViewport();
});

test("галерея: 7 кликабельных карточек, приглашение N° 08 и CTA", async ({
  page,
}) => {
  await page.goto("/");
  const gallery = page.locator("#collectio");
  await expect(gallery.locator("a", { hasText: "Открыть →" })).toHaveCount(7);
  await expect(gallery.getByText("N° 01")).toBeVisible();
  await expect(gallery.getByText("монстера")).toBeVisible();
  await expect(gallery.getByText("почти песок", { exact: true })).toBeVisible();
  await expect(gallery.getByText("N° 08 — ?")).toBeVisible();
  await expect(
    gallery.getByRole("link", { name: "Вся коллекция →" }),
  ).toBeVisible();
});

test("тизер «Дневник» — текстовый, без ссылок (в т.ч. на /diary-signup)", async ({
  page,
}) => {
  await page.goto("/");
  const diary = page.locator("article", {
    hasText: "Забота продолжается после пересадки",
  });
  await expect(diary.getByText("часть бокса")).toBeVisible();
  await expect(diary.locator("a")).toHaveCount(0);
  await expect(page.locator('a[href*="diary-signup"]')).toHaveCount(0);
});

test("нет горизонтального скролла", async ({ page }) => {
  await page.goto("/");
  const overflow = await page.evaluate(
    () =>
      document.documentElement.scrollWidth -
      document.documentElement.clientWidth,
  );
  expect(overflow).toBeLessThanOrEqual(1);
});

/*
 * FIX-14 · симметрия полей. Меряем по контейнеру `.wrap` внутри секции:
 * левое поле = left контейнера, правое = ширина вьюпорта − right.
 * Требование патча — разница не больше 15% на 1440 и 1920.
 */
for (const width of [1440, 1920]) {
  test(`симметрия полей на ${width}: разница слева и справа ≤ 15%`, async ({
    page,
  }) => {
    await page.setViewportSize({ width, height: 900 });
    await page.goto("/");

    /*
     * Меряем каждую секцию, а не .first(): у hero контейнер центрирован
     * mx-auto и симметричен по построению, поэтому проверка на одном нём
     * зелёная при любой кривизне остальных — ровно тот дефект, против
     * которого писался FIX-14.
     */
    const wraps = page.locator("main > section .wrap");
    const count = await wraps.count();
    expect(count).toBeGreaterThan(5);

    for (let i = 0; i < count; i++) {
      const box = await wraps.nth(i).boundingBox();
      expect(box).not.toBeNull();
      const left = box!.x;
      const right = width - (box!.x + box!.width);
      const diff = Math.abs(left - right) / Math.max(left, right);
      expect(
        diff,
        `секция ${i}: слева ${left}px, справа ${right}px на ${width}`,
      ).toBeLessThanOrEqual(0.15);
    }
  });
}

/*
 * Десктопная адаптивность: до этого потолок вёрстки был 1240px и на широком
 * мониторе половина экрана уходила в поля. Полоса обязана расти.
 */
test("полоса контента растёт на широких экранах", async ({ page }) => {
  await page.goto("/");
  const wrap = page.locator("main > section .wrap").first();

  await page.setViewportSize({ width: 1440, height: 900 });
  const narrow = (await wrap.boundingBox())!.width;

  await page.setViewportSize({ width: 2560, height: 1440 });
  const wide = (await wrap.boundingBox())!.width;

  expect(wide, `на 1440 полоса ${narrow}px, на 2560 — ${wide}px`).toBeGreaterThan(
    narrow + 200,
  );
});
