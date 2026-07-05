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

  it("legal-строка: УСН, копирайт, «не оферта»", () => {
    expect(footer.legalTail).toContain("работаем по УСН");
    expect(footer.legalTail).toContain("© 2026 ЗАЗЕМЛИ");
    expect(footer.legalTail).toContain("не является публичной офертой");
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
