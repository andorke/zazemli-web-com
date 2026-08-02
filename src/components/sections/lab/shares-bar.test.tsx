import { render, screen } from "@testing-library/react";
import { afterEach, beforeEach, describe, expect, it } from "vitest";

import { SharesBar } from "./shares-bar";

/*
 * jsdom не реализует IntersectionObserver — подменяем его на заглушку,
 * которая копит наблюдаемые узлы и по требованию дёргает колбэк.
 */
class MockObserver {
  static instances: MockObserver[] = [];

  observed: Element[] = [];

  constructor(private readonly callback: IntersectionObserverCallback) {
    MockObserver.instances.push(this);
  }

  observe(target: Element): void {
    this.observed.push(target);
  }

  unobserve(): void {}

  disconnect(): void {}

  trigger(): void {
    const entries = this.observed.map((target) => ({
      target,
      isIntersecting: true,
    })) as IntersectionObserverEntry[];
    this.callback(entries, this as unknown as IntersectionObserver);
  }
}

const realObserver = Object.getOwnPropertyDescriptor(
  globalThis,
  "IntersectionObserver",
);

const shares = { base: 55, air: 25, water: 20, drain: 0 };

describe("SharesBar", () => {
  beforeEach(() => {
    MockObserver.instances = [];
    Object.defineProperty(globalThis, "IntersectionObserver", {
      configurable: true,
      writable: true,
      value: MockObserver,
    });
  });

  afterEach(() => {
    if (realObserver) {
      Object.defineProperty(globalThis, "IntersectionObserver", realObserver);
    } else {
      Reflect.deleteProperty(globalThis, "IntersectionObserver");
    }
  });

  it("ширина сегмента статична и равна доле, анимируется только transform", () => {
    render(<SharesBar shares={shares} />);
    const bar = screen.getByTitle("основа 55 · воздух 25 · влага 20");

    expect(bar).toHaveClass("shares-bar");
    expect(
      [...bar.children].map((el) => (el as HTMLElement).style.width),
    ).toEqual(["55%", "25%", "20%"]);
  });

  it("первое появление в вьюпорте запускает прорисовку классом `in`", () => {
    render(<SharesBar shares={shares} />);
    const bar = screen.getByTitle("основа 55 · воздух 25 · влага 20");

    expect(bar).not.toHaveClass("in");

    MockObserver.instances[0].trigger();

    expect(bar).toHaveClass("in");
  });
});
