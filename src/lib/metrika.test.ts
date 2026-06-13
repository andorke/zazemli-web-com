import { afterEach, describe, expect, it, vi } from "vitest";

import { reachGoal } from "@/lib/metrika";

afterEach(() => {
  delete globalThis.ym;
  vi.unstubAllEnvs();
});

describe("reachGoal", () => {
  it("без счётчика (window.ym не определён) — безопасный no-op", () => {
    expect(() => reachGoal("ozon-click")).not.toThrow();
  });

  it("при наличии счётчика и ID вызывает ym(id, 'reachGoal', goal)", () => {
    vi.stubEnv("NEXT_PUBLIC_METRIKA_ID", "12345");
    const ym = vi.fn();
    globalThis.ym = ym;

    reachGoal("ozon-click");

    expect(ym).toHaveBeenCalledWith(12345, "reachGoal", "ozon-click");
  });

  it("без ID — не вызывает ym даже если он есть", () => {
    const ym = vi.fn();
    globalThis.ym = ym;

    reachGoal("ozon-click");

    expect(ym).not.toHaveBeenCalled();
  });
});
