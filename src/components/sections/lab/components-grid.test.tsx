import { render } from "@testing-library/react";
import { afterEach, beforeEach, describe, expect, it } from "vitest";

import { LabComponentsGrid } from "./components-grid";
import { lab } from "@/content/lab";

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

/*
 * Плитки компонентов /lab (change qr-welcome 4.3): лесенка идёт по прямым
 * детям самой сетки, поэтому Reveal рендерится грид-контейнером — лишней
 * обёртки между сеткой и плитками быть не должно, иначе nth-child уедет.
 */
describe("LabComponentsGrid: лесенка плиток при входе сетки в вьюпорт", () => {
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

  it("грид-контейнер и есть каскад, плитки — его прямые дети", () => {
    const { container } = render(<LabComponentsGrid />);
    const cascade = container.querySelector(".welcome-reveal-cascade");

    expect(cascade).not.toBeNull();
    expect(cascade).toHaveClass("welcome-cascade", "grid");
    expect(cascade!.children).toHaveLength(lab.components.length);
    expect([...cascade!.children].every((el) => el.tagName === "BUTTON")).toBe(
      true,
    );
  });

  it("класс `in` появляется только после входа сетки в вьюпорт", () => {
    const { container } = render(<LabComponentsGrid />);
    const cascade = container.querySelector(".welcome-reveal-cascade")!;

    expect(cascade).not.toHaveClass("in");

    MockObserver.instances[0].trigger();

    expect(cascade).toHaveClass("in");
  });
});
