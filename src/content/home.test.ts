import { describe, expect, it } from "vitest";

import { home } from "@/content/home";

/* Ключевые строки эталона Figma 185:2 — защита от случайного дрейфа копи */
describe("Контент главной (Figma 185:2)", () => {
  it("кикеры секций II и IV на месте", () => {
    expect(home.differentSoil.kicker).toBe(
      "II · РАЗНЫМ РАСТЕНИЯМ — РАЗНАЯ ЗЕМЛЯ",
    );
    expect(home.skuGallery.kicker).toBe("IV · КОЛЛЕКЦИЯ · СЕМЬ НОМЕРОВ");
  });

  it("statement-цитата дословно", () => {
    expect(home.statement.quote).toBe("Выращивай и создавай простое");
  });

  it("Ozon-CTA: цена и подпись про переход", () => {
    expect(home.ozonCta.text).toBe("Семь растений, три размера. От 1 890 ₽.");
    expect(home.ozonCta.caption).toBe(
      "Переходишь на Ozon — оформление заказа там",
    );
  });

  it("опись бокса — 5 пунктов, начиная с земли", () => {
    expect(home.whatsInBox.items).toHaveLength(5);
    expect(home.whatsInBox.items[0].text).toContain("Земля");
  });

  it("тизеры ведут на /guide и /lab", () => {
    expect(home.teasers.map((t) => t.link.href)).toEqual(["/guide", "/lab"]);
  });
});
