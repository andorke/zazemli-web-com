import { describe, expect, it } from "vitest";

import { boxContents } from "@/content/box";
import { skuBoxContents, skus } from "@/content/sku";

/*
 * Состав бокса — единый источник для главной и 7 карточек (PATCH-1 §2,
 * FIX-05/36/49/52/53/70). Варьируется только позиция 01.
 */
const home = boxContents({
  text: "Грунт, собранный под твоё растение",
  href: "/lab",
});

describe("Состав бокса — единый модуль", () => {
  it("пять позиций прототипа по порядку", () => {
    expect(home.map((i) => i.n)).toEqual(["01", "02", "03", "04", "05"]);
    expect(home[1].text).toBe("Керамзитовый дренаж, 10–20 мм");
    expect(home[3].text).toBe("Дневник растения на год");
    expect(home[4].text).toBe("Листовка с гайдом по пересадке");
  });

  it("позиция 01 несёт мост в лабораторию", () => {
    expect(home[0].text).toBe("Грунт, собранный под твоё растение");
    expect(home[0].link).toEqual({
      label: "подробнее в лаборатории грунта →",
      href: "/lab",
    });
  });

  it("позиция 03 — «Забота о корнях и твоих руках» с 4 подпунктами", () => {
    expect(home[2].text).toBe("«Забота о корнях и твоих руках»");
    expect(home[2].sub).toEqual([
      "перчатки, чтобы не жалеть рук",
      "2 палочки для корней, чтобы бережно разобрать ком: мягкое дерево не режет корни",
      "баночка угольной пудры, чтобы подсушить свежий срез",
      "корневин, чтобы на свежем срезе заложились новые корни",
    ]);
  });

  it("мост в лабораторию — только у позиции 01, подпункты — только у 03", () => {
    expect(home.filter((i) => i.link)).toHaveLength(1);
    expect(home.filter((i) => i.sub)).toHaveLength(1);
  });
});

describe("Состав идентичен на главной и семи карточках", () => {
  it.each(skus)("$slug: позиции 02–05 совпадают с главной дословно", (sku) => {
    expect(skuBoxContents(sku).slice(1)).toEqual(home.slice(1));
  });

  it.each(skus)("$slug: позиция 01 — растение, число компонентов и якорь рецептуры", (sku) => {
    const first = skuBoxContents(sku)[0];
    expect(first.text).toBe(
      `Грунт, собранный под ${sku.accusative} · ${sku.components} компонентов`,
    );
    expect(first.link).toEqual({
      label: "подробнее в лаборатории грунта →",
      href: `/lab#rec-${sku.slug}`,
    });
  });

  it("«почвосмесь» из состава вычищена (блэклист PATCH-1 §6)", () => {
    const corpus = JSON.stringify(skus.map(skuBoxContents)).toLowerCase();
    expect(corpus).not.toContain("почвосмесь");
    expect(corpus).not.toContain("конвертик");
    expect(corpus).not.toContain("апельсин");
    expect(corpus).not.toContain("бутылочка");
  });
});
