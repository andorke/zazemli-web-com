import { describe, expect, it } from "vitest";

import { footer, mainNav, ozonStoreUrl } from "@/content/site";

describe("Навигация", () => {
  it("в меню ровно три пункта; Коллекция ведёт на якорь главной", () => {
    expect(mainNav.map((i) => i.href)).toEqual(["/#collectio", "/lab", "/guide"]);
    expect(mainNav.map((i) => i.label)).toEqual([
      "Коллекция",
      "Лаборатория",
      "Гайд",
    ]);
  });

  it("diary-signup отсутствует в меню", () => {
    expect(mainNav.some((i) => i.href.includes("diary"))).toBe(false);
  });
});

describe("Футер", () => {
  it("тэглайн — core formula", () => {
    expect(footer.tagline).toBe("Земля и забота — всё, что нужно.");
  });

  it("строка реквизитов — verbatim по прототипу", () => {
    expect(
      `${footer.legalName} · ОГРНИП ${footer.ogrnip} · ${footer.legalTail}`,
    ).toBe("ИП Минетто А. А. · ОГРНИП 326330000022761 · работаем по УСН");
  });

  it("копирайт и «не оферта» — отдельной строкой", () => {
    expect(footer.copyright).toBe(
      "© 2026 ЗАЗЕМЛИ. Информация на сайте не является публичной офертой.",
    );
  });

  it("дисклеймер сохранён для /lab (глобально не рендерится)", () => {
    expect(footer.disclaimer).toBe(
      "Растения — не лекарство. Мы опираемся на исследования о связи контакта с природой и самочувствия, но не обещаем терапевтического эффекта.",
    );
  });

  it("контакты: email и хэндл соцсетей", () => {
    expect(footer.email).toBe("team@zazemli.com");
    expect(footer.socialHandle).toBe("@zazemli_collectio");
  });
});

describe("Ozon", () => {
  it("URL магазина пока не задан — кнопки в состоянии «Скоро на Ozon»", () => {
    expect(ozonStoreUrl).toBeNull();
  });
});
