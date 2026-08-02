import { beforeEach, describe, expect, it } from "vitest";

import { CONSENT_KEY, getConsent, setConsent } from "@/lib/consent";

describe("consent", () => {
  beforeEach(() => {
    localStorage.clear();
  });

  it("по умолчанию согласие не задано (null)", () => {
    expect(getConsent()).toBeNull();
  });

  it("сохраняет и читает «all»", () => {
    setConsent("all");
    expect(getConsent()).toBe("all");
    expect(localStorage.getItem(CONSENT_KEY)).toBe("all");
  });

  it("сохраняет и читает «necessary»", () => {
    setConsent("necessary");
    expect(getConsent()).toBe("necessary");
    expect(localStorage.getItem(CONSENT_KEY)).toBe("necessary");
  });

  it("легаси «granted» читается как «all»", () => {
    localStorage.setItem(CONSENT_KEY, "granted");
    expect(getConsent()).toBe("all");
  });

  it("легаси «denied» читается как «necessary»", () => {
    localStorage.setItem(CONSENT_KEY, "denied");
    expect(getConsent()).toBe("necessary");
  });

  it("легаси-значение остаётся в хранилище — миграции записи нет", () => {
    localStorage.setItem(CONSENT_KEY, "granted");
    getConsent();
    expect(localStorage.getItem(CONSENT_KEY)).toBe("granted");
  });

  it("игнорирует мусор в localStorage", () => {
    localStorage.setItem(CONSENT_KEY, "что-то левое");
    expect(getConsent()).toBeNull();
  });
});
