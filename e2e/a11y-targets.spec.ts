import { expect, test } from "@playwright/test";

/*
 * Приёмка PATCH-1 §7.3: таргеты ≥ 44 px на 390 и 1440 (FIX-19) и видимый фокус
 * клавиатурой (FIX-20, WCAG 2.4.7). Патч требует увеличивать кликабельную зону
 * padding'ом и min-height, НЕ меняя кегль, — поэтому меряем габарит элемента,
 * а не размер шрифта.
 */
/* Баннер согласия перекрывает низ страницы. Ставим выбор до загрузки, чтобы
   не кликать по нему на каждой странице — сам баннер проверяется в consent.spec. */
test.beforeEach(async ({ context }) => {
  await context.addInitScript(() => {
    try {
      localStorage.setItem("zazemli-consent", "necessary");
    } catch {
      /* приватный режим — баннер останется, проверке таргетов это не мешает */
    }
  });
});

test("FIX-20: у элемента в фокусе есть видимая обводка", async ({ page }) => {
  await page.goto("/");

  /* первый Tab может уйти на служебный узел — идём до первого реального контрола */
  let outline: { width: string; style: string; shadow: string } | null = null;
  for (let i = 0; i < 5 && outline === null; i += 1) {
    await page.keyboard.press("Tab");
    outline = await page.evaluate(() => {
      const el = document.activeElement;
      if (!el || el === document.body || el === document.documentElement) return null;
      const style = getComputedStyle(el);
      return {
        width: style.outlineWidth,
        style: style.outlineStyle,
        shadow: style.boxShadow,
      };
    });
  }

  expect(outline, "после пяти Tab фокус никуда не встал").not.toBeNull();
  const visible =
    (outline!.style !== "none" && parseFloat(outline!.width) >= 2) ||
    (outline!.shadow !== "none" && outline!.shadow !== "");
  expect(visible, `outline: ${JSON.stringify(outline)}`).toBe(true);
});

const PAGES = ["/", "/lab", "/guide", "/guide/perevalka", "/collectio/monstera", "/diary-signup"];

/*
 * FIX-19: кликабельная зона не меньше 44 px. Мерим габарит элемента, а не
 * кегль — патч прямо требует растить зону padding'ом и min-height, не трогая
 * шрифт. Инлайновая ссылка внутри абзаца — часть текста, а не таргет: её
 * высоту задаёт строка, поэтому такие пропускаем.
 */
for (const width of [390, 1440]) {
  test(`FIX-19: интерактивные элементы >= 44px на ${width}`, async ({ page }) => {
    await page.setViewportSize({ width, height: 900 });
    const small: string[] = [];

    for (const path of PAGES) {
      await page.goto(path);
      const targets = page.locator(
        "main a[href], main button, main summary, main input[type=checkbox]",
      );
      const count = await targets.count();
      expect(count, `${path}: интерактивных элементов не найдено`).toBeGreaterThan(0);

      for (let i = 0; i < count; i += 1) {
        const el = targets.nth(i);
        if (!(await el.isVisible())) continue;
        const box = await el.boundingBox();
        if (!box) continue;
        if (await el.evaluate((n) => getComputedStyle(n).display === "inline")) continue;
        /* зона чекбокса задаётся объемлющим label — оцениваем по нему */
        const zone = await el.evaluate((n) => {
          const label = n.closest("label");
          return label ? label.getBoundingClientRect().height : n.getBoundingClientRect().height;
        });
        if (zone < 44) {
          small.push(`${path} ${(await el.innerText()).slice(0, 24) || "(без текста)"} → ${Math.round(zone)}px`);
        }
      }
    }

    expect(small, small.join("; ")).toEqual([]);
  });
}

/* FIX-25: skip-link — первый фокусируемый элемент, уводит за навигацию */
test("FIX-25: первый Tab встаёт на skip-link и уводит к содержимому", async ({ page }) => {
  await page.goto("/");
  await page.keyboard.press("Tab");

  const active = page.locator(":focus");
  await expect(active).toHaveText("К основному содержанию");
  await expect(active).toBeVisible();

  await page.keyboard.press("Enter");
  await expect(page).toHaveURL(/#main$/);
});

test("FIX-25: skip-link не видна, пока не в фокусе", async ({ page }) => {
  await page.goto("/");
  const link = page.getByRole("link", { name: "К основному содержанию" });
  const box = await link.boundingBox();
  expect(box!.x, "ссылка должна быть за левым краем экрана").toBeLessThan(0);
});
