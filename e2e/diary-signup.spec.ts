import { expect, test } from "@playwright/test";

/*
 * e2e формы /diary-signup (task 4.1). Строки — дословно из src/content/diary.ts
 * (хардкодим, как privacy.spec.ts: e2e не резолвит @/-алиасы).
 *
 * Здесь только сценарии формы. noindex, отсутствие в навигации и sitemap уже
 * покрыты в routes.spec.ts — не дублируем.
 *
 * Event diary_signup_submit в e2e не наблюдаем: NEXT_PUBLIC_METRIKA_ID инлайнится
 * на сборке (на dev пуст), Метрика грузится только при granted-согласии + внешний
 * скрипт Яндекса (см. consent.spec.ts). reachGoal вызывается в той же ветке
 * handleSubmit, что и подмена формы на confirmation, поэтому happy-path →
 * confirmation проверяет тот же code path. Сама отправка цели — unit
 * signup-form.test.tsx.
 */

const SUBMIT = "Хочу свой дневник ухода →";
const POLICY_LINK = "политики конфиденциальности";

test.beforeEach(async ({ page }) => {
  // снимаем cookie-баннер (fixed bottom, z-50), чтобы не перехватывал клики по
  // нижним полям формы на 360px; сам баннер покрыт consent.spec.ts.
  // ключ — CONSENT_KEY из src/lib/consent.tsx
  await page.addInitScript(() =>
    localStorage.setItem("zazemli-consent", "denied"),
  );
});

test("submit заблокирован, пока не отмечены оба согласия", async ({ page }) => {
  await page.goto("/diary-signup");
  const email = page.getByLabel("Твоя почта");
  await email.fill("me@example.com");
  // уводим фокус до клика: иначе blur email на mousedown покажет ok-микрокопи,
  // сдвинет layout, и клик по кнопке «съестся» на layout shift
  await email.blur();
  await page.getByRole("button", { name: SUBMIT }).click();

  await expect(
    page.getByText("Чтобы подписаться, отметь оба согласия."),
  ).toBeVisible();
  // confirmation не показан, форма на месте, фокус — на первом чекбоксе
  await expect(page.getByRole("status")).toHaveCount(0);
  await expect(email).toBeVisible();
  await expect(page.getByRole("checkbox").first()).toBeFocused();
});

test("невалидный email → микрокопи ошибки, aria-invalid и фокус на поле", async ({
  page,
}) => {
  await page.goto("/diary-signup");
  const email = page.getByLabel("Твоя почта");
  await email.fill("не-почта");
  await email.blur(); // см. коммент выше — стабилизируем layout до кликов
  // отмечаем оба согласия, чтобы первой ошибкой был именно email
  for (const box of await page.getByRole("checkbox").all()) await box.check();
  await page.getByRole("button", { name: SUBMIT }).click();

  await expect(email).toHaveAttribute("aria-invalid", "true");
  await expect(
    page.getByText("Похоже, ошибка в адресе. Проверь — лучше дважды."),
  ).toBeVisible();
  await expect(email).toBeFocused();
});

test("happy-path: валидный email и оба согласия → confirmation", async ({
  page,
}) => {
  await page.goto("/diary-signup");
  const email = page.getByLabel("Твоя почта");
  await email.fill("me@example.com");
  await email.blur(); // см. коммент выше — стабилизируем layout до кликов
  for (const box of await page.getByRole("checkbox").all()) await box.check();
  await page.getByRole("button", { name: SUBMIT }).click();

  const status = page.getByRole("status");
  await expect(status).toBeVisible();
  await expect(status).toContainText("Записали.");
  // форма подменена — поля email больше нет
  await expect(page.getByLabel("Твоя почта")).toHaveCount(0);
});

test("ссылка в CB1: href на /privacy, клик открывает попап-резюме", async ({
  page,
}) => {
  await page.goto("/diary-signup");
  const link = page.getByRole("link", { name: POLICY_LINK });
  await expect(link).toHaveAttribute("href", "/privacy");

  await link.click();
  await expect(
    page.getByRole("dialog", { name: "Коротко о данных" }),
  ).toBeVisible();
});

test("попап-резюме ведёт на /privacy", async ({ page }) => {
  await page.goto("/diary-signup");
  await page.getByRole("link", { name: POLICY_LINK }).click();
  await page
    .getByRole("dialog")
    .getByRole("link", { name: "Читать полную политику →" })
    .click();

  await expect(page).toHaveURL(/\/privacy\/?$/);
});
