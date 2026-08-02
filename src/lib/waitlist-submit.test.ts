import { afterEach, describe, expect, it, vi } from "vitest";

import {
  CONSENT_VERSION,
  PLANT_MAX_LENGTH,
  isWaitlistApiEnabled,
  submitWaitlistEmail,
  submitWaitlistPlant,
  trimPlant,
} from "@/lib/waitlist-submit";

const API = "/api/waitlist";

afterEach(() => {
  vi.unstubAllEnvs();
  vi.unstubAllGlobals();
});

/*
 * Обрезка ввода до 42 знаков (NEW-05): длинное название разъезжает модалку,
 * а склонять его нельзя — выводим ровно то, что ввёл человек, но не длиннее.
 */
describe("trimPlant — обрезка названия растения (task 1.2)", () => {
  it("предел — 42 знака", () => {
    expect(PLANT_MAX_LENGTH).toBe(42);
  });

  it("короткое название не меняется", () => {
    expect(trimPlant("фикус Бенджамина")).toBe("фикус Бенджамина");
  });

  it("длиннее предела — обрезается до 42 знаков", () => {
    const long = "калатея".repeat(10);
    expect(trimPlant(long)).toHaveLength(42);
    expect(trimPlant(long)).toBe(long.slice(0, 42));
  });

  it("снимает окружающие пробелы до обрезки", () => {
    expect(trimPlant("  калатея  ")).toBe("калатея");
  });
});

describe("Контракт API листа ожидания (task 1.2)", () => {
  it("версия согласий — редакция 2026-07-14", () => {
    expect(CONSENT_VERSION).toBe("2026-07-14");
  });
});

/*
 * Интеграционная точка за фича-флагом (design Decision 3, образец —
 * lib/diary-submit.ts). Флаг = наличие базового URL API. Пока флага нет,
 * сбор выключен целиком: сеть не трогаем, форма в плитке не рендерится
 * (сбор email без серверного лога согласий ≥ 3 лет юридически незащищён).
 */
describe("Фича-флаг интеграции (task 4.1)", () => {
  it("по умолчанию выключен", () => {
    vi.stubEnv("NEXT_PUBLIC_WAITLIST_API", "");
    expect(isWaitlistApiEnabled()).toBe(false);
  });

  it("включается базовым URL API", () => {
    vi.stubEnv("NEXT_PUBLIC_WAITLIST_API", API);
    expect(isWaitlistApiEnabled()).toBe(true);
  });
});

describe("Шаги контракта при выключенном флаге (task 4.2)", () => {
  it("шаг 1 — сетевых запросов нет, requestId пустой", async () => {
    vi.stubEnv("NEXT_PUBLIC_WAITLIST_API", "");
    const fetchMock = vi.fn();
    vi.stubGlobal("fetch", fetchMock);

    expect(await submitWaitlistPlant("калатея")).toBeNull();
    expect(fetchMock).not.toHaveBeenCalled();
  });

  it("шаг 2 — сетевых запросов нет", async () => {
    vi.stubEnv("NEXT_PUBLIC_WAITLIST_API", "");
    const fetchMock = vi.fn();
    vi.stubGlobal("fetch", fetchMock);

    await submitWaitlistEmail({
      requestId: null,
      email: "me@example.com",
      consent_pdn: true,
      consent_ads: true,
    });
    expect(fetchMock).not.toHaveBeenCalled();
  });
});

describe("Шаги контракта при включённом флаге (task 4.2)", () => {
  it("шаг 1 — POST /plant {plant, ts}, возвращает requestId", async () => {
    vi.stubEnv("NEXT_PUBLIC_WAITLIST_API", API);
    const fetchMock = vi.fn().mockResolvedValue({
      ok: true,
      json: async () => ({ requestId: "req-1" }),
    });
    vi.stubGlobal("fetch", fetchMock);

    expect(await submitWaitlistPlant("калатея")).toBe("req-1");

    const [url, init] = fetchMock.mock.calls[0];
    expect(url).toBe("/api/waitlist/plant");
    expect(init.method).toBe("POST");
    const body = JSON.parse(init.body);
    expect(body.plant).toBe("калатея");
    expect(typeof body.ts).toBe("string");
  });

  it("шаг 2 — POST /email со всеми полями контракта и версией согласий", async () => {
    vi.stubEnv("NEXT_PUBLIC_WAITLIST_API", API);
    const fetchMock = vi.fn().mockResolvedValue({ ok: true });
    vi.stubGlobal("fetch", fetchMock);

    await submitWaitlistEmail({
      requestId: "req-1",
      email: "me@example.com",
      consent_pdn: true,
      consent_ads: true,
    });

    const [url, init] = fetchMock.mock.calls[0];
    expect(url).toBe("/api/waitlist/email");
    expect(init.method).toBe("POST");
    const body = JSON.parse(init.body);
    expect(body).toMatchObject({
      requestId: "req-1",
      email: "me@example.com",
      consent_pdn: true,
      consent_ads: true,
      consent_version: "2026-07-14",
    });
    expect(typeof body.ts).toBe("string");
  });

  it("шаг 1 переживает сбой сети: попап открывается без requestId", async () => {
    vi.stubEnv("NEXT_PUBLIC_WAITLIST_API", API);
    vi.stubGlobal(
      "fetch",
      vi.fn().mockRejectedValue(new TypeError("failed to fetch")),
    );

    expect(await submitWaitlistPlant("калатея")).toBeNull();
  });
});
