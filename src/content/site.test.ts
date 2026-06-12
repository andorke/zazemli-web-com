import { describe, expect, it } from "vitest";

import { footer, mainNav, ozonStoreUrl } from "@/content/site";

describe("Навигация", () => {
  it("в меню ровно три пункта: Коллекция, Лаборатория, Гайд", () => {
    expect(mainNav.map((i) => i.href)).toEqual([
      "/collectio",
      "/lab",
      "/guide",
    ]);
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
  it("дисклеймер — дословно по брифу §8", () => {
    expect(footer.disclaimer).toBe(
      "Растения — не лекарство. Мы опираемся на исследования о связи контакта с природой и самочувствия, но не обещаем терапевтического эффекта.",
    );
  });

  it("контакты: email и хэндл соцсетей", () => {
    expect(footer.email).toBe("team@zazemli.com");
    expect(footer.socialHandle).toBe("@zazemli_collectio");
  });

  it("QR-набор без diary", () => {
    expect(footer.qr.length).toBeGreaterThan(0);
    expect(footer.qr.some((q) => q.href.includes("diary"))).toBe(false);
  });
});

describe("Ozon", () => {
  it("URL магазина пока не задан — кнопки в состоянии «Скоро на Ozon»", () => {
    expect(ozonStoreUrl).toBeNull();
  });
});
