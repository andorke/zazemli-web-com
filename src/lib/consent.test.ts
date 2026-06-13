import { beforeEach, describe, expect, it } from "vitest";

import { CONSENT_KEY, getConsent, setConsent } from "@/lib/consent";

describe("consent", () => {
  beforeEach(() => {
    localStorage.clear();
  });

  it("по умолчанию согласие не задано (null)", () => {
    expect(getConsent()).toBeNull();
  });

  it("сохраняет и читает «granted»", () => {
    setConsent("granted");
    expect(getConsent()).toBe("granted");
    expect(localStorage.getItem(CONSENT_KEY)).toBe("granted");
  });

  it("сохраняет «denied»", () => {
    setConsent("denied");
    expect(getConsent()).toBe("denied");
  });

  it("игнорирует мусор в localStorage", () => {
    localStorage.setItem(CONSENT_KEY, "что-то левое");
    expect(getConsent()).toBeNull();
  });
});
