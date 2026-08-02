import { afterEach, describe, expect, it, vi } from "vitest";

import { reachGoal } from "@/lib/metrika";

afterEach(() => {
  vi.unstubAllGlobals();
  vi.unstubAllEnvs();
});

describe("reachGoal", () => {
  it("без счётчика (window.ym не определён) — безопасный no-op", () => {
    expect(() => reachGoal("ozon-click")).not.toThrow();
  });

  it("при наличии счётчика и ID вызывает ym(id, 'reachGoal', goal)", () => {
    vi.stubEnv("NEXT_PUBLIC_METRIKA_ID", "12345");
    const ym = vi.fn();
    vi.stubGlobal("ym", ym);

    reachGoal("ozon-click");

    expect(ym).toHaveBeenCalledWith(12345, "reachGoal", "ozon-click");
  });

  it("без ID — не вызывает ym даже если он есть", () => {
    const ym = vi.fn();
    vi.stubGlobal("ym", ym);

    reachGoal("ozon-click");

    expect(ym).not.toHaveBeenCalled();
  });

  /*
   * Свойства цели нужны листу ожидания: waitlist_plant_input несёт plant —
   * единственный источник данных о спросе для следующей партии (FIX-74).
   */
  it("передаёт свойства цели четвёртым аргументом ym", () => {
    vi.stubEnv("NEXT_PUBLIC_METRIKA_ID", "12345");
    const ym = vi.fn();
    vi.stubGlobal("ym", ym);

    reachGoal("waitlist_plant_input", { plant: "калатея" });

    expect(ym).toHaveBeenCalledWith(
      12345,
      "reachGoal",
      "waitlist_plant_input",
      {
        plant: "калатея",
      },
    );
  });

  it("без свойств — вызывает ym без четвёртого аргумента", () => {
    vi.stubEnv("NEXT_PUBLIC_METRIKA_ID", "12345");
    const ym = vi.fn();
    vi.stubGlobal("ym", ym);

    reachGoal("waitlist_form_open");

    expect(ym).toHaveBeenCalledWith(12345, "reachGoal", "waitlist_form_open");
  });
});
