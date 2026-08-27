import { describe, expect, it } from "vitest";

import {
  allowsEffect,
  isAtRest,
  shouldMountCursor,
  stepTowards,
  PARTICLE_POOL,
} from "@/lib/cursor-fx";

const fakeWindow = (fine: boolean, reduced: boolean) =>
  ({
    matchMedia: (q: string) => ({
      matches: q.includes("prefers-reduced-motion") ? reduced : fine,
    }),
  }) as unknown as Window;

describe("shouldMountCursor", () => {
  it("монтируется на мыши без reduced-motion", () => {
    expect(shouldMountCursor(fakeWindow(true, false))).toBe(true);
  });

  it("не монтируется на тач-устройстве", () => {
    expect(shouldMountCursor(fakeWindow(false, false))).toBe(false);
  });

  it("не монтируется при prefers-reduced-motion", () => {
    expect(shouldMountCursor(fakeWindow(true, true))).toBe(false);
  });

  it("без matchMedia не падает и не монтируется", () => {
    expect(shouldMountCursor({} as Window)).toBe(false);
  });
});

describe("allowsEffect", () => {
  const zone = () => {
    const section = document.createElement("section");
    section.setAttribute("data-fx", "");
    const text = document.createElement("p");
    const link = document.createElement("a");
    link.href = "/lab";
    section.append(text, link);
    document.body.append(section);
    return { section, text, link };
  };

  it("в размеченной зоне на обычном тексте — разрешён", () => {
    const { text } = zone();
    expect(allowsEffect(text)).toBe(true);
  });

  it("на ссылке внутри зоны — запрещён, клик не должен залипать", () => {
    const { link } = zone();
    expect(allowsEffect(link)).toBe(false);
  });

  it("вне размеченной зоны — запрещён", () => {
    const loose = document.createElement("p");
    document.body.append(loose);
    expect(allowsEffect(loose)).toBe(false);
  });

  it("не падает на null и не-Element", () => {
    expect(allowsEffect(null)).toBe(false);
    expect(allowsEffect(document)).toBe(false);
  });
});

describe("rAF-цикл", () => {
  it("шаг приближает к цели на долю lerp", () => {
    expect(stepTowards(0, 100)).toBeCloseTo(15);
  });

  it("покой определяется по обеим осям", () => {
    expect(isAtRest(0.05, 0.05)).toBe(true);
    expect(isAtRest(0.05, 0.5)).toBe(false);
  });

  it("пул частиц ограничен восемью", () => {
    expect(PARTICLE_POOL).toBe(8);
  });
});
