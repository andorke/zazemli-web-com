import { afterEach, beforeEach, describe, expect, it } from "vitest";

import {
  WELCOME_CLASS,
  WELCOME_KEY,
  welcomeGateScript,
} from "@/lib/welcome-gate";

/* Скрипт инлайнится строкой в <head>, поэтому тест исполняет именно строку. */
function runGate(): void {
  new Function(welcomeGateScript)();
}

const realStorage = Object.getOwnPropertyDescriptor(
  globalThis,
  "sessionStorage",
)!;

function breakSessionStorage(): void {
  Object.defineProperty(globalThis, "sessionStorage", {
    configurable: true,
    get() {
      throw new Error("storage недоступен");
    },
  });
}

describe("welcome-gate", () => {
  beforeEach(() => {
    sessionStorage.clear();
    document.documentElement.className = "";
  });

  afterEach(() => {
    Object.defineProperty(globalThis, "sessionStorage", realStorage);
  });

  it("первый заход: ставит класс на <html> и записывает флаг", () => {
    runGate();

    expect(document.documentElement.classList.contains(WELCOME_CLASS)).toBe(
      true,
    );
    expect(sessionStorage.getItem(WELCOME_KEY)).not.toBeNull();
  });

  it("повторный заход в той же вкладке: класс не ставится", () => {
    runGate();
    document.documentElement.className = "";

    runGate();

    expect(document.documentElement.classList.contains(WELCOME_CLASS)).toBe(
      false,
    );
  });

  it("sessionStorage недоступен: встреча показывается", () => {
    breakSessionStorage();

    expect(() => runGate()).not.toThrow();
    expect(document.documentElement.classList.contains(WELCOME_CLASS)).toBe(
      true,
    );
  });
});
