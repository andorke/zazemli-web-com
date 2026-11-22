import { afterEach, beforeEach, expect, it, vi } from "vitest";

const createCounter = () => ({ destruct: vi.fn(), hit: vi.fn(), reachGoal: vi.fn() });
let counter: ReturnType<typeof createCounter>;
let api: typeof import("./metrika");

beforeEach(async () => {
  vi.resetModules();
  localStorage.clear();
  vi.stubGlobal("location", new URL("https://zazemli.com/?utm_source=print&email=ignore%40example.test"));
  vi.stubEnv("NEXT_PUBLIC_METRIKA_ID", "12345");
  counter = createCounter();
  api = await import("./metrika");
});

afterEach(() => {
  delete window.Ya;
  document.querySelector('script[src*="metrika/tag.js"]')?.remove();
  vi.unstubAllGlobals();
  vi.unstubAllEnvs();
});

function setProvider() {
  return class { constructor() { return counter; } } as unknown as NonNullable<Window["Ya"]>["Metrika2"];
}

it("до согласия и после отказа не загружает счётчик", () => {
  api.updateMetrika("/");
  localStorage.setItem("zazemli-consent", "necessary");
  api.updateMetrika("/");
  expect(document.querySelector('script[src*="metrika/tag.js"]')).toBeNull();
});

it("отзыв останавливает цели сразу, повторное согласие не удваивает просмотр", () => {
  window.Ya = { Metrika2: setProvider() };
  localStorage.setItem("zazemli-consent", "all");
  api.updateMetrika("/");
  api.updateMetrika("/");
  api.reachGoal("plant_select", { plant_slug: "ficus", email: "ignore@example.test", plant: "свободный ввод" });
  expect(counter.hit).toHaveBeenCalledExactlyOnceWith("https://zazemli.com/?utm_source=print");
  expect(counter.reachGoal).toHaveBeenCalledExactlyOnceWith("plant_select", { plant_slug: "ficus" });
  localStorage.setItem("zazemli-consent", "necessary");
  api.reachGoal("ozon-click");
  api.updateMetrika("/");
  expect(counter.destruct).toHaveBeenCalledOnce();
  expect(counter.reachGoal).toHaveBeenCalledTimes(1);
  localStorage.setItem("zazemli-consent", "all");
  api.updateMetrika("/");
  expect(counter.hit).toHaveBeenCalledTimes(1);
});

it("поздний ответ скрипта не запускает счётчик после отзыва", () => {
  localStorage.setItem("zazemli-consent", "all");
  api.updateMetrika("/");
  const script = document.querySelector('script[src*="metrika/tag.js"]');
  expect(script).not.toBeNull();
  localStorage.setItem("zazemli-consent", "necessary");
  window.Ya = { Metrika2: setProvider() };
  script!.dispatchEvent(new Event("load"));
  expect(counter.hit).not.toHaveBeenCalled();
});

it("на превью и без ID не начинается загрузка", () => {
  localStorage.setItem("zazemli-consent", "all");
  vi.stubGlobal("location", new URL("http://localhost/"));
  api.updateMetrika("/");
  vi.stubGlobal("location", new URL("https://zazemli.com/"));
  vi.stubEnv("NEXT_PUBLIC_METRIKA_ID", "");
  api.updateMetrika("/");
  expect(document.querySelector('script[src*="metrika/tag.js"]')).toBeNull();
});
