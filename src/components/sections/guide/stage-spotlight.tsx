"use client";

import { useEffect, useRef, type ReactNode } from "react";

/*
 * Подсветка текущей стадии /guide (change qr-welcome 3.3). Наблюдатель держит
 * класс `is-current` на той стадии, которой сейчас видно больше всего, и
 * снимает его с прежней. Сама подсветка — border-color в разметке стадии:
 * макет не двигается. Это не entrance-эффект — работает и после встречи,
 * поэтому вне show-once гейта и без префикса `.welcome-`.
 */

const CURRENT_CLASS = "is-current";

export function useStageSpotlight<T extends HTMLElement>() {
  const ref = useRef<T>(null);

  useEffect(() => {
    const root = ref.current;
    // Нет IntersectionObserver — подсветка декоративна, живём без неё
    if (!root || typeof IntersectionObserver === "undefined") return;

    const stages = [...root.querySelectorAll<HTMLElement>(":scope > li")];
    // Видимая высота, а не доля: стадии выше вьюпорта, ratio занижен у длинных
    const seen = new Map<Element, number>();

    const observer = new IntersectionObserver(
      (entries) => {
        for (const entry of entries) {
          seen.set(
            entry.target,
            entry.isIntersecting ? entry.intersectionRect.height : 0,
          );
        }

        let current: Element | null = null;
        let best = 0;
        for (const stage of stages) {
          const height = seen.get(stage) ?? 0;
          if (height > best) {
            best = height;
            current = stage;
          }
        }

        for (const stage of stages) {
          stage.classList.toggle(CURRENT_CLASS, stage === current);
        }
      },
      { threshold: [0, 0.25, 0.5, 0.75, 1] },
    );
    for (const stage of stages) observer.observe(stage);

    return () => observer.disconnect();
  }, []);

  return ref;
}

export function StageSpotlight({
  children,
  className,
}: {
  children: ReactNode;
  className?: string;
}) {
  const ref = useStageSpotlight<HTMLOListElement>();

  return (
    <ol ref={ref} className={className}>
      {children}
    </ol>
  );
}
