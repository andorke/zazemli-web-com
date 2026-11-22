import { expect, test, type Page } from "@playwright/test";
import { plants } from "../src/content/paper/catalog";

test.beforeEach(async ({ page }) => {
  await page.addInitScript(() => {
    if (!localStorage.hasOwnProperty("zazemli-consent"))
      localStorage.setItem("zazemli-consent", "necessary");
  });
});

async function fillEmail(page: Page, email: string) {
  await page.getByRole("textbox", { name: "Твоя почта" }).fill(email);
  for (const box of await page.getByRole("checkbox").all()) await box.check();
}

test("брендовый вход: главное меню, каталог, материалы и состав бокса", async ({
  page,
}) => {
  await page.goto("/");
  await expect(page.getByRole("heading", { level: 1 })).toHaveText(
    "Заземли растение. Заземли себя.",
  );
  await expect(page.locator("main > section").first()).toHaveClass("hero");
  await page.locator("#targets [data-key=bark]").focus();
  await expect(page.locator("#sample")).toContainText("Сосновая кора");
  await page.keyboard.press("Escape");
  await expect(page.locator("#sample")).toHaveText(/Выбери материал/);
  await page
    .getByRole("banner")
    .getByRole("link", { name: "Боксы", exact: true })
    .click();
  await expect(page.locator("#formats-title")).toBeFocused();
  await expect(
    page.getByRole("heading", { name: "Бокс для монстеры", exact: true }),
  ).toBeVisible();
  await expect(page.locator("#kit-legend")).toHaveText("Что входит в бокс");
});

test("рамка материала плавно переходит к другой области на главной и в лаборатории", async ({ page }) => {
  await page.emulateMedia({ reducedMotion: "no-preference" });
  for (const [path, map, attribute, material] of [
    ["/", "#mosaic", "data-key", "biochar"],
    ["/lab", "#lab-map", "data-region", "humus"],
  ]) {
    await page.goto(path);
    const bark = page.locator(`${map} [${attribute}="bark"]`);
    await bark.focus();
    await expect(bark).toHaveAttribute("aria-pressed", "true");
    const outline = page.locator(`${map} .soil-highlight`).first();
    await expect(outline).toBeAttached();

    const motion = await outline.evaluate(async (frame, selector) => {
      const target = document.querySelector<SVGElement>(selector)!;
      const initial = frame.getBoundingClientRect();
      const final = target.getBoundingClientRect();
      const distance = (a: DOMRect, b: DOMRect) => Math.max(
        Math.abs(a.x - b.x), Math.abs(a.y - b.y),
        Math.abs(a.width - b.width), Math.abs(a.height - b.height),
      );
      target.focus({ preventScroll: true });
      let intermediate = false;
      let duplicate = false;
      const end = performance.now() + 500;
      while (performance.now() < end) {
        await new Promise(requestAnimationFrame);
        const current = frame.getBoundingClientRect();
        const targetStyle = getComputedStyle(target);
        duplicate ||= targetStyle.stroke !== "none" || targetStyle.outlineStyle !== "none";
        intermediate ||= distance(current, initial) > 1 && distance(current, final) > 1;
        if (intermediate && distance(current, final) < 1) return { moved: true, duplicate };
      }
      return { moved: false, duplicate };
    }, `${map} [${attribute}="${material}"]`);
    expect(motion).toEqual({ moved: true, duplicate: false });
    const selected = page.locator(`${map} [${attribute}="${material}"]`);
    await expect(outline).toHaveCSS("stroke-dasharray", "4px, 3px");
    await selected.press("Escape");
    await expect(selected).toBeFocused();
    await expect(selected).toHaveAttribute("aria-pressed", "false");
    await expect(selected).toHaveCSS("stroke", "none");
    await expect(selected).toHaveCSS("outline-style", "none");
    await expect(outline).toHaveCSS("opacity", "1");
    await expect(outline).toHaveCSS("fill", "none");
    await expect(outline).toHaveCSS("stroke-dasharray", "4px, 3px");
  }
});

test("клик по материалу на главной не рисует системную рамку", async ({ page }) => {
  await page.goto("/");
  const moss = page.locator("#mosaic [data-key=moss]");
  await moss.click();
  await expect(moss).toBeFocused();
  await expect(moss).toHaveAttribute("aria-pressed", "true");
  await expect(moss).toHaveCSS("outline-style", "none");
  await expect(moss).toHaveCSS("stroke", "none");
  await expect(page.locator("#mosaic .soil-highlight")).toHaveCSS("opacity", "1");
});

test("семь растений: цены и фото бокса и грунта всегда относятся к выбранному", async ({
  page,
}) => {
  await page.emulateMedia({ reducedMotion: "reduce" });
  await page.goto("/#boxes");
  const chips = page.locator(".direct-chips");
  for (const plant of plants) {
    await chips.locator(`[data-slug=${plant.slug}]`).click();
    await expect(page.locator("#direct-product-title")).toHaveText(
      `Бокс для ${plant.gen}`,
    );
    await expect(page.locator(".direct-box-shot.is-current")).toHaveAttribute(
      "src",
      `/warm-paper/assets/scene-${plant.slug}.webp`,
    );
    await expect(page.locator(".box-price-pair")).toHaveCount(
      plant.volume.length,
    );
    await expect(page.locator(".buy-action")).toHaveAttribute(
      "aria-disabled",
      "true",
    );
    await page
      .getByRole("button", { name: "Только грунт", exact: true })
      .click();
    await expect(page.locator("#direct-product-title")).toHaveText(
      `Грунт для ${plant.gen}`,
    );
    await expect(page.locator("#soil-pouch")).toBeVisible();
    await expect(page.locator("#box-image-base")).toHaveAttribute(
      "src",
      `/warm-paper/assets/kit-${plant.slug}.webp`,
    );
    await page
      .getByRole("button", { name: "Бокс для пересадки", exact: true })
      .click();
  }
});

test("грунт открывается сразу и сохраняет растение и UTM", async ({ page }) => {
  await page.goto("/?plant=ficus&utm_source=print#soils");
  await expect(
    page.getByRole("heading", { name: "Грунт для фикуса", exact: true }),
  ).toBeVisible();
  await page
    .getByRole("button", { name: "Бокс для пересадки", exact: true })
    .click();
  await expect(
    page.getByRole("heading", { name: "Бокс для фикуса", exact: true }),
  ).toBeVisible();
  await page.goBack();
  await expect(
    page.getByRole("heading", { name: "Грунт для фикуса", exact: true }),
  ).toBeVisible();
  expect(new URL(page.url()).searchParams.get("utm_source")).toBe("print");
  await page.reload();
  await expect(
    page.getByRole("heading", { name: "Грунт для фикуса", exact: true }),
  ).toBeVisible();
});

test("подарок: из товарной страницы видны комплект, фото и гайд", async ({
  page,
}) => {
  const response = await page.goto("/collectio/ficus");
  expect(response?.status()).toBe(200);
  await expect(page.getByRole("heading", { level: 1 })).toHaveText(
    "Бокс для фикуса",
  );
  await page
    .getByRole("button", { name: "Грунт и дренаж", exact: true })
    .click();
  await expect(page.locator(".direct-box-shot.is-current")).toHaveAttribute(
    "src",
    /box-photo\/ficus\.webp/,
  );
  await page.locator(".part-tile[data-component=envelope] button").click();
  await expect(page.locator("#kit-reading")).toContainText(
    "Перчатки для работы с грунтом.",
  );
  await page
    .getByRole("banner")
    .getByRole("link", { name: "Гайд по пересадке", exact: true })
    .click();
  await expect(page).toHaveURL(/\/guide$/);
});

test("управление каталогом включается после загрузки скриптов", async ({ page }) => {
  let releaseScripts!: () => void;
  const scriptsAllowed = new Promise<void>((resolve) => { releaseScripts = resolve; });
  await page.route("**/_next/static/**/*.js", async (route) => {
    await scriptsAllowed;
    await route.continue();
  });

  try {
    await page.goto("/#boxes", { waitUntil: "commit" });
    const soil = page.getByRole("button", { name: "Только грунт", exact: true });
    await expect(soil).toBeDisabled();
    await expect(page.locator(".direct-chips").getByRole("button", { name: "Фикус", exact: true })).toBeDisabled();
    await expect(page.getByRole("button", { name: "Грунт и дренаж", exact: true })).toBeDisabled();

    releaseScripts();
    await expect(soil).toBeEnabled();
    await soil.click();
    await expect(soil).toHaveAttribute("aria-pressed", "true");
  } finally {
    releaseScripts();
  }
});

test("галерея держит текущий кадр, пока загружается выбранный", async ({
  page,
}) => {
  let releasePhoto!: () => void;
  const responseAllowed = new Promise<void>((resolve) => {
    releasePhoto = resolve;
  });
  await page.route("**/box-photo/ficus.webp", async (route) => {
    await responseAllowed;
    await route.continue();
  });

  try {
    await page.goto("/collectio/ficus", { waitUntil: "domcontentloaded" });
    const first = page.getByRole("button", { name: "Открытый бокс", exact: true });
    const second = page.getByRole("button", { name: "Грунт и дренаж", exact: true });
    const current = page.locator(".direct-box-shot.is-current");
    await expect(current).toBeVisible();
    await expect(current).toHaveJSProperty("complete", true);
    await second.click();
    await expect(first).toHaveAttribute("aria-pressed", "true");
    await expect(current).toHaveAttribute("src", /scene-ficus\.webp$/);

    releasePhoto();
    await expect(second).toHaveAttribute("aria-pressed", "true");
    await expect(current).toHaveAttribute("src", /box-photo\/ficus\.webp$/);
    await expect(current).toBeVisible();
    await expect(current).toHaveJSProperty("complete", true);
    await first.click();
    await expect(current).toHaveAttribute("src", /scene-ficus\.webp$/);
  } finally {
    releasePhoto();
  }
});

test("смена растения ждёт фото и учитывает последний выбор", async ({ page }) => {
  let releasePhoto!: () => void;
  const photoReady = new Promise<void>((resolve) => { releasePhoto = resolve; });
  await page.route("**/scene-ficus.webp", async (route) => {
    await photoReady;
    await route.continue();
  });
  try {
    await page.goto("/?utm_source=print#boxes");
    const chips = page.locator(".direct-chips");
    const photo = page.locator(".direct-box-shot.is-current");
    await expect(photo).toHaveJSProperty("complete", true);
    await chips.getByRole("button", { name: "Фикус", exact: true }).click();
    await expect(photo).toHaveAttribute("src", /scene-monstera\.webp$/);
    await chips.getByRole("button", { name: "Антуриум", exact: true }).click();
    await expect(photo).toHaveAttribute("src", /scene-anthurium\.webp$/);
    const oldResponse = page.waitForResponse("**/scene-ficus.webp");
    releasePhoto();
    await (await oldResponse).finished();
    await expect(chips.getByRole("button", { name: "Антуриум", exact: true })).toHaveAttribute("aria-pressed", "true");
    await expect(page).toHaveURL(/\?utm_source=print&plant=anthurium#boxes$/);
  } finally {
    releasePhoto();
  }
});

test("смена формата ждёт маску фото и сохраняет положение карточки", async ({ page }, testInfo) => {
  let releaseMask!: () => void;
  const maskReady = new Promise<void>((resolve) => {
    releaseMask = resolve;
  });
  await page.route("**/shape-monstera.webp", async (route) => {
    await maskReady;
    await route.continue();
  });
  try {
    await page.goto("/#boxes", { waitUntil: "domcontentloaded" });
    const box = page.getByRole("button", { name: "Бокс для пересадки", exact: true });
    const soil = page.getByRole("button", { name: "Только грунт", exact: true });
    await page.evaluate(() => document.fonts.ready);
    await expect.poll(() => page.locator(".direct-catalog").evaluate(
      (catalog) => Math.round(catalog.getBoundingClientRect().top),
    )).toBe(12);
    await expect(page.locator(".direct-box-shot.is-current")).toHaveJSProperty("complete", true);
    await expect(soil).toBeEnabled();
    await page.evaluate(() => window.scrollBy({ top: 75, behavior: "instant" }));
    const geometry = () => page.evaluate(() => ["scroll", ".direct-formats", ".direct-photo-window", ".buy-action", ".direct-details"].map((selector) => {
      if (selector === "scroll") return [Math.round(scrollY)];
      const { x, y, width, height } = document.querySelector(selector)!.getBoundingClientRect();
      return [x, y, width, ...(selector === ".direct-details" ? [] : [height])].map(Math.round);
    }));
    const before = await geometry();
    if (testInfo.project.name === "mobile") {
      const photo = (await page.locator(".direct-photo-frame").boundingBox())!;
      const formats = (await page.locator(".direct-formats").boundingBox())!;
      expect(photo.width).toBeCloseTo(formats.width, 0);
    }
    await soil.evaluate((button: HTMLElement) => button.click());
    await expect(box).toHaveAttribute("aria-pressed", "true");
    await expect(page.locator(".direct-box-shot.is-current")).toBeVisible();
    releaseMask();
    await expect(soil).toHaveAttribute("aria-pressed", "true");
    await expect(page.locator("#soil-pouch")).toHaveJSProperty("complete", true);
    await expect.poll(geometry).toEqual(before);
  } finally {
    releaseMask();
  }
});

test("состав грунта показывает прежнюю раскладку до загрузки следующей", async ({
  page,
}) => {
  let releaseMap!: () => void;
  const mapReady = new Promise<void>((resolve) => {
    releaseMap = resolve;
  });
  await page.route("**/soil-ficus.webp", async (route) => {
    await mapReady;
    await route.continue();
  });

  try {
    await page.goto("/?plant=monstera#soils");
    const map = page.locator("#catalog-mosaic image");
    await expect(map).toHaveAttribute("href", /soil-monstera\.webp$/);
    await page.locator(".direct-soil").evaluate((panel) =>
      panel.scrollIntoView({ block: "start", behavior: "instant" }),
    );
    const requested = page.waitForRequest("**/soil-ficus.webp");
    const ficus = page.locator('.direct-chips [data-slug="ficus"]');
    await expect(ficus).toBeEnabled();
    await ficus.evaluate(
      (button: HTMLElement) => button.click(),
    );
    await requested;

    await expect(map).toHaveAttribute("href", /soil-monstera\.webp$/);
    await expect(page.locator('.direct-material[data-material="moss"]')).toBeVisible();
    releaseMap();
    await expect(map).toHaveAttribute("href", /soil-ficus\.webp$/);
    await expect(page.locator('.direct-material[data-material="moss"]')).toHaveCount(0);
    await expect(page.locator('.direct-material[data-material="peat"] strong')).toHaveText(
      `${plants.find((plant) => plant.slug === "ficus")!.recipe.peat}%`,
    );
  } finally {
    releaseMap();
  }
});

test("рецепт из старого QR ведёт к тому же грунту", async ({ page }) => {
  await page.goto("/lab?utm_source=guide#rec-anthurium");
  await expect(
    page.getByRole("img", { name: "Готовый грунт для антуриума" }),
  ).toBeVisible();
  await page.locator("#lab-zones [data-region=humus]").focus();
  await expect(page.locator("#material-info")).toContainText("Биогумус · 5%");
  await page
    .getByRole("link", { name: /Грунт для антуриума в каталоге/ })
    .click();
  await expect(
    page.getByRole("heading", { name: "Грунт для антуриума", exact: true }),
  ).toBeVisible();
  expect(new URL(page.url()).searchParams.get("utm_source")).toBe("guide");
});

test("лаборатория меняет смесь после обоих фото и сохраняет открытый состав", async ({ page }) => {
  let release!: () => void;
  const ready = new Promise<void>((resolve) => { release = resolve; });
  const nextImages = /\/(?:lab-soil\/ficus|soil-ficus)\.webp$/;
  let requested = 0;
  await page.route(nextImages, async (route) => {
    requested++;
    await ready;
    await route.continue();
  });
  try {
    await page.goto("/lab");
    const details = page.locator("details.materials");
    await details.locator("summary").click();
    const map = page.locator("#lab-map image");
    await page.locator('button[data-plant="ficus"]').click();
    await expect.poll(() => requested).toBe(2);
    await expect(page.locator("#mix-title")).toHaveText("Смесь для монстеры");
    await expect(map).toHaveAttribute("href", /soil-monstera\.webp$/);
    await expect(details).toHaveJSProperty("open", true);
    release();
    await expect(page.locator("#mix-title")).toHaveText("Смесь для фикуса");
    await expect(map).toHaveAttribute("href", /soil-ficus\.webp$/);
    await expect(details).toHaveJSProperty("open", true);
  } finally {
    release();
  }
});

test("смена растения на товарной странице сохраняет положение каталога", async ({ page }) => {
  await page.goto("/collectio/monstera?utm_source=check");
  await expect(page.locator(".launch-cookie")).toBeHidden();
  await page.evaluate(() => window.scrollTo({ top: 160, behavior: "instant" }));
  const before = await page.evaluate(() => window.scrollY);
  await page.locator('.direct-chips [data-slug="ficus"]').evaluate(
    (button: HTMLElement) => button.click(),
  );
  await expect(page).toHaveURL(/\/collectio\/ficus\?utm_source=check$/);
  await expect(page.locator("#direct-product-title")).toHaveText("Бокс для фикуса");
  await expect.poll(() => page.evaluate(() => window.scrollY)).toBe(before);
});

test("оглавление гайда отмечает и фокусирует открытый шаг", async ({ page }) => {
  await page.goto("/guide");
  const link = page.locator('.guide-outline a[href="#step-03"]');
  await link.click();
  await expect(page).toHaveURL(/#step-03$/);
  await expect(link).toHaveAttribute("aria-current", "location");
  await expect(page.locator("#step-03")).toBeFocused();
});

for (const [url, heading, label] of [
  ["/lab#rec-ficus", "#mix-title", "Смесь для фикуса"],
  ["/collectio/ficus#soils", "#direct-product-title", "Грунт для фикуса"],
  ["/?plant=epipremnum#boxes", "#direct-product-title", "Бокс для эпипремнума"],
]) {
  test(`прямой вход ${url} ждёт правильного состояния`, async ({ page }) => {
    let release!: () => void;
    const ready = new Promise<void>((resolve) => { release = resolve; });
    await page.route("**/_next/static/**/*.js", async (route) => {
      await ready;
      await route.continue();
    });
    try {
      await page.goto(url, { waitUntil: "commit" });
      const state = page.locator(heading);
      await state.waitFor({ state: "attached" });
      await expect(state).toBeHidden();
      const cookie = page.locator(".launch-cookie");
      await cookie.waitFor({ state: "attached" });
      await expect(cookie).toBeHidden();
      release();
      await expect(state).toHaveText(label);
      await expect(state).toBeVisible();
    } finally {
      release();
    }
  });
}

test("гайд: полная замена по QR, старый адрес и отдельная перевалка", async ({
  page,
}) => {
  await page.goto("/guide/polnaya-zamena?utm_source=print");
  await expect(page).toHaveURL(/\/guide\?utm_source=print$/);
  await expect(page.getByRole("heading", { level: 1 })).toHaveText(
    "Как пересадить растение",
  );
  await expect(page.locator(".guide-step")).toHaveCount(5);
  await expect(
    page.getByText("Осмотри ком целиком", { exact: false }),
  ).toHaveCount(0);
  const article = await page.goto("/guide/perevalka");
  expect(article?.status()).toBe(200);
  await expect(page.getByRole("heading", { level: 1 })).toHaveText(
    "Не замена, но дополнение",
  );
  await expect(page.locator("link[rel=canonical]")).toHaveAttribute(
    "href",
    "https://zazemli.com/guide/perevalka",
  );
});

test("дневник: успех зависит от подтверждённой записи и показывает адрес", async ({
  page,
}) => {
  let submitted = false;
  await page.route("**/api/diary/subscribe", (route) => {
    expect(route.request().postDataJSON()).toEqual({
      email: "diary@example.test",
      consent_pdn: true,
      consent_mail: true,
      consent_version: "2026-11-16",
    });
    submitted = true;
    return route.fulfill({ status: 201, json: { saved: true, mode: "live" } });
  });
  await page.goto("/diary-signup");
  await expect(page.locator('meta[name="robots"]')).toHaveAttribute(
    "content",
    /noindex/,
  );
  await fillEmail(page, "diary@example.test");
  await page.getByRole("button", { name: "Подписаться на дневник →" }).click();
  await expect(page.locator("[data-launch-result=diary]")).toContainText(
    "На diary@example.test будут приходить письма серии «Дневник растения».",
  );
  expect(submitted).toBe(true);
});

test("дневник: ошибка сохраняет ввод, повтор сообщает существующую подписку", async ({
  page,
}) => {
  let fail = true;
  await page.route("**/api/diary/subscribe", (route) =>
    route.fulfill(
      fail
        ? { status: 503, json: { error: "email_unconfigured" } }
        : { status: 201, json: { saved: true, mode: "live", duplicate: true } },
    ),
  );
  await page.goto("/diary-signup");
  await fillEmail(page, "diary@example.test");
  await page.evaluate(() => document.fonts.ready);
  const mount = page.locator("[data-diary-mount]");
  const initialHeight = await mount.evaluate((node) => node.clientHeight);
  const submit = page.getByRole("button", { name: "Подписаться на дневник →" });
  await submit.click();
  await expect(page.getByRole("status")).toContainText(
    "Форма сейчас недоступна",
  );
  await expect(page.getByRole("textbox", { name: "Твоя почта" })).toHaveValue(
    "diary@example.test",
  );
  await expect(page.locator("[data-launch-result]")).toHaveCount(0);
  fail = false;
  await submit.click();
  await expect(
    page.getByRole("heading", { name: "Этот адрес уже в списке" }),
  ).toBeVisible();
  await expect.poll(() => mount.evaluate((node) => node.clientHeight)).toBe(initialHeight);
});

test("дневник: невалидные данные и неподтверждённый ответ не считаются подпиской", async ({
  page,
}) => {
  let posted = 0;
  await page.route("**/api/diary/subscribe", (route) => {
    posted++;
    return route.fulfill({ status: 200, json: { ok: true } });
  });
  await page.goto("/diary-signup");
  const submit = page.getByRole("button", { name: "Подписаться на дневник →" });
  await submit.click();
  await expect(page.getByRole("status")).toContainText("ошибка в адресе");
  expect(posted).toBe(0);
  await fillEmail(page, "x".repeat(55) + "@example.test");
  await submit.click();
  await expect(page.getByRole("status")).toContainText("что-то не работает");
  expect(posted).toBe(1);
});

test("лист ожидания: известное растение открывает его бокс без запроса", async ({
  page,
}) => {
  let posted = false;
  await page.route("**/api/waitlist/plant", (route) => {
    posted = true;
    return route.abort();
  });
  await page.goto("/#boxes");
  const wish = page.locator("#box-wish");
  await wish.locator("summary").click();
  await wish.getByRole("textbox", { name: "Название растения" }).fill("Фикус");
  await wish.getByRole("button", { name: "Дальше →" }).click();
  await expect(page.locator("#direct-product-title")).toHaveText(
    "Бокс для фикуса",
  );
  expect(posted).toBe(false);
});

test("лист ожидания: два шага, email, растение и возврат фокуса", async ({
  page,
}) => {
  const id = "82d53065-461c-4a33-ab12-94eb0ed9dc50";
  await page.route("**/api/waitlist/plant", (route) => {
    expect(route.request().postDataJSON()).toEqual({ plant: "Калатея" });
    return route.fulfill({
      status: 201,
      json: { saved: true, mode: "live", requestId: id },
    });
  });
  await page.route("**/api/waitlist/email", (route) => {
    expect(route.request().postDataJSON()).toMatchObject({
      requestId: id,
      email: "plant@example.test",
      consent_mail: true,
    });
    return route.fulfill({ status: 201, json: { saved: true, mode: "live" } });
  });
  await page.goto("/#soils");
  const wish = page.locator("#plant-wish");
  await wish.locator("summary").click();
  await wish
    .getByRole("textbox", { name: "Название растения" })
    .fill("Калатея");
  const next = wish.getByRole("button", { name: "Дальше →" });
  await next.click();
  const dialog = page.getByRole("dialog");
  await expect(dialog).toHaveAccessibleName("Сообщить, когда появится грунт?");
  await expect(page.getByRole("textbox", { name: "Твоя почта" })).toBeFocused();
  await page.keyboard.press("Escape");
  await expect(dialog).toHaveCount(0);
  await expect(next).toBeFocused();
  await next.click();
  await fillEmail(page, "plant@example.test");
  await dialog.getByRole("button", { name: "Записать меня →" }).click();
  await expect(dialog.locator("[data-launch-result]")).toContainText(
    "Растение: Калатея",
  );
  await expect(dialog.locator("[data-launch-result]")).toContainText(
    "На plant@example.test придёт одно письмо",
  );
  await dialog.getByRole("button", { name: "Вернуться к каталогу" }).click();
  await expect(next).toBeFocused();
});

test("печатный вход и повторная покупка сохраняют query", async ({ page }) => {
  await page.goto("/collectio?utm_source=print&keep=1");
  await expect(page.locator("#formats")).toBeVisible();
  expect(new URL(page.url()).searchParams.get("keep")).toBe("1");
  await page.goto("/snova/epipremnum?utm_source=email");
  await expect(page.locator("#direct-product-title")).toHaveText(
    "Бокс для эпипремнума",
  );
  expect(new URL(page.url()).searchParams.get("utm_source")).toBe("email");
});

test("брендированная 404 со стилями и переходом к покупке", async ({
  page,
}) => {
  const response = await page.goto("/collectio/unknown/nested");
  expect(response?.status()).toBe(404);
  await expect(page.getByRole("heading", { level: 1 })).toHaveText(
    "Страница не нашлась",
  );
  await expect(
    page.locator('link[href="/warm-paper/styles/missing.css"]'),
  ).toHaveCount(1);
  await page.locator('main a[href="/#boxes"]').click();
  await expect(page.locator("#formats-title")).toBeVisible();
});

test("документы и отзыв согласия доступны из подвала", async ({ page }) => {
  await page.goto("/");
  const footer = page.getByRole("contentinfo");
  const settings = footer.getByRole("button", { name: "Настройки cookie" });
  await settings.click();
  const banner = page.getByRole("complementary", { name: "Файлы cookie" });
  await expect(
    banner.getByRole("button", { name: "Только необходимые" }),
  ).toBeFocused();
  await banner.getByRole("button", { name: "Принять все" }).click();
  expect(
    await page.evaluate(() => localStorage.getItem("zazemli-consent")),
  ).toBe("all");
  await expect(settings).toBeFocused();
  await settings.click();
  await banner.getByRole("button", { name: "Только необходимые" }).click();
  expect(
    await page.evaluate(() => localStorage.getItem("zazemli-consent")),
  ).toBe("necessary");
  await footer.getByRole("link", { name: "Конфиденциальность" }).click();
  await expect(page.getByRole("heading", { level: 1 })).toContainText(
    "обработки персональных данных",
  );
  await expect(
    page.getByText("team@zazemli.com", { exact: true }).first(),
  ).toBeVisible();
});

test("основные страницы помещаются в экран, QR-дневник вне навигации", async ({
  page,
  request,
}) => {
  for (const path of [
    "/",
    "/lab",
    "/guide",
    "/diary-signup",
    "/privacy",
    "/terms",
  ]) {
    await page.goto(path);
    await expect(page.getByRole("heading", { level: 1 })).toHaveCount(1);
    expect(
      await page.evaluate(
        () => document.documentElement.scrollWidth <= window.innerWidth,
      ),
    ).toBeTruthy();
    expect(
      await page
        .locator(
          'header a[href="/diary-signup"], footer a[href="/diary-signup"]',
        )
        .count(),
    ).toBe(0);
  }
  const sitemap = await request.get("/sitemap.xml");
  expect(await sitemap.text()).not.toContain("/diary-signup");
});
