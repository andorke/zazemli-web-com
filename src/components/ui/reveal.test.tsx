import { render, screen } from "@testing-library/react";
import { afterEach, beforeEach, describe, expect, it } from "vitest";

import { Reveal } from "@/components/ui/reveal";

/*
 * jsdom не реализует IntersectionObserver — подменяем его на заглушку,
 * которая копит наблюдаемые узлы и по требованию дёргает колбэк.
 */
class MockObserver {
  static instances: MockObserver[] = [];

  observed: Element[] = [];
  unobserved: Element[] = [];

  constructor(
    private readonly callback: IntersectionObserverCallback,
    readonly options?: IntersectionObserverInit,
  ) {
    MockObserver.instances.push(this);
  }

  observe(target: Element): void {
    this.observed.push(target);
  }

  unobserve(target: Element): void {
    this.unobserved.push(target);
  }

  disconnect(): void {}

  trigger(isIntersecting: boolean): void {
    const entries = this.observed.map((target) => ({
      target,
      isIntersecting,
    })) as IntersectionObserverEntry[];
    this.callback(entries, this as unknown as IntersectionObserver);
  }
}

const realObserver = Object.getOwnPropertyDescriptor(
  globalThis,
  "IntersectionObserver",
);

function setObserver(value: unknown): void {
  Object.defineProperty(globalThis, "IntersectionObserver", {
    configurable: true,
    writable: true,
    value,
  });
}

describe("Reveal", () => {
  beforeEach(() => {
    MockObserver.instances = [];
    setObserver(MockObserver);
  });

  afterEach(() => {
    if (realObserver) {
      Object.defineProperty(globalThis, "IntersectionObserver", realObserver);
    } else {
      Reflect.deleteProperty(globalThis, "IntersectionObserver");
    }
  });

  it("до появления в вьюпорте класса `in` нет", () => {
    render(<Reveal>секция</Reveal>);

    expect(screen.getByText("секция")).not.toHaveClass("in");
    expect(MockObserver.instances[0].observed).toHaveLength(1);
  });

  it("появление в вьюпорте добавляет класс `in` и снимает наблюдение", () => {
    render(<Reveal>секция</Reveal>);
    const node = screen.getByText("секция");

    MockObserver.instances[0].trigger(true);

    expect(node).toHaveClass("in");
    expect(MockObserver.instances[0].unobserved).toEqual([node]);
  });

  it("пересечения не было — класс не ставится", () => {
    render(<Reveal>секция</Reveal>);

    MockObserver.instances[0].trigger(false);

    expect(screen.getByText("секция")).not.toHaveClass("in");
    expect(MockObserver.instances[0].unobserved).toHaveLength(0);
  });

  it("threshold ~0.1", () => {
    render(<Reveal>секция</Reveal>);

    expect(MockObserver.instances[0].options?.threshold).toBe(0.1);
  });

  it("cascade: лесенка задержек на прямых детях", () => {
    render(
      <Reveal cascade className="grid">
        <span>первый</span>
      </Reveal>,
    );
    const node = screen.getByText("первый").parentElement!;

    expect(node).toHaveClass(
      "welcome-cascade",
      "welcome-reveal-cascade",
      "grid",
    );
    expect(node).not.toHaveClass("welcome-rise");
  });

  it("без IntersectionObserver контент показывается сразу", () => {
    setObserver(undefined);

    render(<Reveal>секция</Reveal>);

    expect(screen.getByText("секция")).toHaveClass("in");
  });
});
