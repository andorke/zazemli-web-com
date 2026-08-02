import { expect, test, type Page } from "@playwright/test";

/*
 * e2e формы N°08 «Лист ожидания» (task 5.1, ручная сквозная PATCH-1 §7.3).
 * Строки — дословно из src/content/waitlist.ts (хардкодим: e2e не резолвит
 * @/-алиасы). Форма рендерится только с NEXT_PUBLIC_WAITLIST_API — переменная
 * задана в playwright.config.ts; бэкенда нет, запросы перехватываем.
 *
 * Здесь проверяется то, чего не видит jsdom: нативные Esc и фокус-ловушка
 * showModal(), клик по фону, отсутствие горизонтального скролла.
 */

const NEXT = "Дальше →";
const SUBMIT = "Записать меня →";
const QUESTION = "Прислать письмо, когда соберём землю под это растение?";
const EMAIL_ERROR = "Похоже, ошибка в адресе. Проверь — лучше дважды.";
const CONSENT_ERROR = "Чтобы записаться, отметь оба согласия.";
const DONE = "Записали.";

type Captured = { url: string; body: Record<string, unknown> }[];

/* перехват контракта: бэкенда /api/waitlist/* нет, отвечаем как он должен */
async function stubApi(page: Page): Promise<Captured> {
  const captured: Captured = [];
  await page.route("**/api/waitlist/**", async (route) => {
    captured.push({
      url: new URL(route.request().url()).pathname,
      body: route.request().postDataJSON(),
    });
    await route.fulfill({
      status: 200,
      contentType: "application/json",
      body: JSON.stringify({ requestId: "req-e2e" }),
    });
  });
  return captured;
}

async function openModal(page: Page, plant = "калатея") {
  await page.goto("/");
  await page.getByLabel("Растение").fill(plant);
  await page.getByRole("button", { name: NEXT }).click();
  await expect(page.getByRole("dialog")).toBeVisible();
}

test.beforeEach(async ({ page }) => {
  // снимаем cookie-баннер (fixed bottom): на 360px он перехватывает клики
  await page.addInitScript(() =>
    localStorage.setItem("zazemli-consent", "denied"),
  );
});

test("шаг 1 в плитке N° 08 открывает попап с введённым названием", async ({
  page,
}) => {
  await stubApi(page);
  await openModal(page, "фикус Бенджамина");

  const dialog = page.getByRole("dialog");
  await expect(dialog.getByText("N° 08 · Лист ожидания")).toBeVisible();
  // название — отдельной строкой, ровно как ввели (NEW-05)
  await expect(dialog.getByText("фикус Бенджамина")).toBeVisible();
  await expect(dialog.getByText(QUESTION)).toBeVisible();
});

test("плитка с формой не растягивает сетку: горизонтального скролла нет", async ({
  page,
}) => {
  await stubApi(page);
  await page.goto("/");
  await expect(page.getByLabel("Растение")).toBeVisible();

  const overflow = await page.evaluate(
    () =>
      document.documentElement.scrollWidth -
      document.documentElement.clientWidth,
  );
  expect(overflow).toBeLessThanOrEqual(0);
});

test("клавиатурный контур: фокус не уходит за модалку, Esc возвращает на плитку", async ({
  page,
}) => {
  await stubApi(page);
  await openModal(page);

  /*
   * Таб по кругу: фокус ходит только по элементам модалки. На заворачивании
   * Chromium штатно проходит через сам документ (activeElement === body) —
   * это не выход из ловушки, поэтому проверяем «не на элементе снаружи».
   */
  for (let i = 0; i < 10; i++) {
    await page.keyboard.press("Tab");
    const escaped = await page.evaluate(() => {
      const dialog = document.querySelector("dialog");
      const active = document.activeElement;
      if (!active || active === document.body) return false;
      return !dialog?.contains(active);
    });
    expect(escaped).toBe(false);
  }

  // страница под модалкой инертна — фокус на карточку галереи не встаёт
  const inert = await page.evaluate(() => {
    const outside = document.querySelector<HTMLElement>(
      'a[href^="/collectio/"]',
    );
    outside?.focus();
    return document.activeElement !== outside;
  });
  expect(inert).toBe(true);

  await page.keyboard.press("Escape");
  await expect(page.getByRole("dialog")).toBeHidden();
  await expect(page.getByRole("button", { name: NEXT })).toBeFocused();
});

test("клик по фону закрывает попап", async ({ page }) => {
  await stubApi(page);
  await openModal(page);

  await page.locator("dialog").click({ position: { x: 4, y: 4 } });
  await expect(page.getByRole("dialog")).toBeHidden();
});

test("пять состояний: пусто / кривой email / без согласий / одно / оба", async ({
  page,
}) => {
  const captured = await stubApi(page);
  await openModal(page);

  const dialog = page.getByRole("dialog");
  const email = dialog.getByLabel("Твоя почта");
  const [lead, pdn] = [
    dialog.getByRole("checkbox").first(),
    dialog.getByRole("checkbox").last(),
  ];
  const submit = dialog.getByRole("button", { name: SUBMIT });

  // 1. пусто
  await submit.click();
  await expect(dialog.getByText(EMAIL_ERROR)).toBeVisible();
  await expect(dialog.getByText(CONSENT_ERROR)).toBeVisible();

  // 2. кривой email
  await email.fill("не-почта");
  await submit.click();
  await expect(dialog.getByText(EMAIL_ERROR)).toBeVisible();

  // 3. email без согласий
  await email.fill("me@example.com");
  await submit.click();
  await expect(dialog.getByText(EMAIL_ERROR)).toBeHidden();
  await expect(dialog.getByText(CONSENT_ERROR)).toBeVisible();
  await expect(lead).toBeFocused();

  // 4. одно согласие
  await lead.check();
  await submit.click();
  await expect(dialog.getByText(CONSENT_ERROR)).toBeVisible();
  await expect(pdn).toBeFocused();

  // до валидного состояния почта никуда не уходила
  expect(captured.filter((r) => r.url.endsWith("/email"))).toHaveLength(0);

  // 5. оба согласия → отправка и текст успеха
  await pdn.check();
  await submit.click();
  await expect(dialog.getByText(DONE)).toBeVisible();
});

test("оба шага уходят POST-ами по контракту (флаг включён)", async ({
  page,
}) => {
  const captured = await stubApi(page);
  await openModal(page);

  const dialog = page.getByRole("dialog");
  await dialog.getByLabel("Твоя почта").fill("me@example.com");
  await dialog.getByRole("checkbox").first().check();
  await dialog.getByRole("checkbox").last().check();
  await dialog.getByRole("button", { name: SUBMIT }).click();
  await expect(dialog.getByText(DONE)).toBeVisible();

  expect(captured.map((r) => r.url)).toEqual([
    "/api/waitlist/plant",
    "/api/waitlist/email",
  ]);
  expect(captured[0].body).toMatchObject({ plant: "калатея" });
  expect(captured[1].body).toMatchObject({
    requestId: "req-e2e",
    email: "me@example.com",
    consent_pdn: true,
    consent_ads: true,
    consent_version: "2026-07-14",
  });
});
