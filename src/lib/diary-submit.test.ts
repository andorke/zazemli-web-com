import { afterEach, describe, expect, it, vi } from "vitest";

import { CONSENT_VERSION, submitDiarySignup } from "@/lib/diary-submit";

const input = {
  email: "me@example.com",
  consents: { pdn: true, ads: true },
} as const;

const ENDPOINT = "https://api.example.ru/subscribe";

afterEach(() => {
  vi.unstubAllEnvs();
  vi.unstubAllGlobals();
});

/*
 * Интеграционная точка submit (task 3.2, design Decision 4). Без РФ-эндпоинта
 * сбор выключен: реального POST с ПДн нет, форма всё равно получает ok →
 * confirmation. С эндпоинтом — POST c payload, включающим версию формулировки
 * согласия (для лога согласия ≥3 года на бэкенде, PDN-SPEC §1.3); статусы
 * ответа маппятся на состояния diary.states.
 */
describe("submitDiarySignup — интеграционная точка (task 3.2)", () => {
  it("эндпоинт не задан → сбора нет: fetch не вызывается, форма получает ok", async () => {
    vi.stubEnv("NEXT_PUBLIC_DIARY_SUBMIT_ENDPOINT", "");
    const fetchMock = vi.fn();
    vi.stubGlobal("fetch", fetchMock);

    expect(await submitDiarySignup(input)).toEqual({ ok: true });
    expect(fetchMock).not.toHaveBeenCalled();
  });

  it("эндпоинт задан → POST с payload, включающим версию формулировки согласия", async () => {
    vi.stubEnv("NEXT_PUBLIC_DIARY_SUBMIT_ENDPOINT", ENDPOINT);
    const fetchMock = vi.fn().mockResolvedValue({ ok: true, status: 200 });
    vi.stubGlobal("fetch", fetchMock);

    expect(await submitDiarySignup(input)).toEqual({ ok: true });
    expect(fetchMock).toHaveBeenCalledOnce();

    const [url, init] = fetchMock.mock.calls[0];
    expect(url).toBe(ENDPOINT);
    expect(init.method).toBe("POST");
    const body = JSON.parse(init.body);
    expect(body.email).toBe(input.email);
    expect(body.consents).toEqual(input.consents);
    expect(body.consentVersion).toBe(CONSENT_VERSION);
  });

  it("409 → duplicate", async () => {
    vi.stubEnv("NEXT_PUBLIC_DIARY_SUBMIT_ENDPOINT", ENDPOINT);
    vi.stubGlobal(
      "fetch",
      vi.fn().mockResolvedValue({ ok: false, status: 409 }),
    );
    expect(await submitDiarySignup(input)).toEqual({
      ok: false,
      state: "duplicate",
    });
  });

  it("503 → maintenance", async () => {
    vi.stubEnv("NEXT_PUBLIC_DIARY_SUBMIT_ENDPOINT", ENDPOINT);
    vi.stubGlobal(
      "fetch",
      vi.fn().mockResolvedValue({ ok: false, status: 503 }),
    );
    expect(await submitDiarySignup(input)).toEqual({
      ok: false,
      state: "maintenance",
    });
  });

  it("500 → server", async () => {
    vi.stubEnv("NEXT_PUBLIC_DIARY_SUBMIT_ENDPOINT", ENDPOINT);
    vi.stubGlobal(
      "fetch",
      vi.fn().mockResolvedValue({ ok: false, status: 500 }),
    );
    expect(await submitDiarySignup(input)).toEqual({
      ok: false,
      state: "server",
    });
  });

  it("сетевой сбой (fetch throw) → network", async () => {
    vi.stubEnv("NEXT_PUBLIC_DIARY_SUBMIT_ENDPOINT", ENDPOINT);
    vi.stubGlobal(
      "fetch",
      vi.fn().mockRejectedValue(new TypeError("failed to fetch")),
    );
    expect(await submitDiarySignup(input)).toEqual({
      ok: false,
      state: "network",
    });
  });
});
