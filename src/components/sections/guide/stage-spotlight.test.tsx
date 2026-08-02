import { render } from "@testing-library/react";
import { afterEach, beforeEach, describe, expect, it } from "vitest";

import { StageSpotlight } from "@/components/sections/guide/stage-spotlight";

/*
 * jsdom не реализует IntersectionObserver — подменяем его заглушкой, которая
 * копит наблюдаемые узлы и по требованию отдаёт колбэку видимую высоту стадий.
 */
class MockObserver {
  static instances: MockObserver[] = [];

  observed: Element[] = [];

  constructor(
    private readonly callback: IntersectionObserverCallback,
    readonly options?: IntersectionObserverInit,
  ) {
    MockObserver.instances.push(this);
  }

  observe(target: Element): void {
    this.observed.push(target);
  }

  unobserve(): void {}

  disconnect(): void {}

  /* heights — видимая высота каждой наблюдаемой стадии по порядку */
  trigger(heights: number[]): void {
    const entries = this.observed.map((target, i) => ({
      target,
      isIntersecting: heights[i] > 0,
      intersectionRect: { height: heights[i] },
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

function renderStages() {
  const { container } = render(
    <StageSpotlight>
      <li id="prep">подготовка</li>
      <li id="envelope">конверт</li>
      <li id="soil">грунт</li>
    </StageSpotlight>,
  );
  return [...container.querySelectorAll("li")];
}

describe("StageSpotlight: подсветка текущей стадии", () => {
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

  it("наблюдает все стадии списка", () => {
    const stages = renderStages();

    expect(MockObserver.instances[0].observed).toEqual(stages);
  });

  it("до скролла ни одна стадия не подсвечена", () => {
    const stages = renderStages();

    for (const stage of stages) {
      expect(stage).not.toHaveClass("is-current");
    }
  });

  it("подсвечена стадия, которой видно больше всего", () => {
    const stages = renderStages();

    MockObserver.instances[0].trigger([120, 400, 0]);

    expect(stages[1]).toHaveClass("is-current");
    expect(stages[0]).not.toHaveClass("is-current");
    expect(stages[2]).not.toHaveClass("is-current");
  });

  it("скролл дальше переносит подсветку и снимает прежнюю", () => {
    const stages = renderStages();

    MockObserver.instances[0].trigger([120, 400, 0]);
    MockObserver.instances[0].trigger([0, 80, 500]);

    expect(stages[2]).toHaveClass("is-current");
    expect(stages[1]).not.toHaveClass("is-current");
  });

  it("стадии ушли из вьюпорта — подсветки нет", () => {
    const stages = renderStages();

    MockObserver.instances[0].trigger([120, 400, 0]);
    MockObserver.instances[0].trigger([0, 0, 0]);

    for (const stage of stages) {
      expect(stage).not.toHaveClass("is-current");
    }
  });

  it("без IntersectionObserver список рендерится без подсветки", () => {
    setObserver(undefined);

    const stages = renderStages();

    expect(stages).toHaveLength(3);
    for (const stage of stages) {
      expect(stage).not.toHaveClass("is-current");
    }
  });
});
