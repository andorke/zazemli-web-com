"use client";

import { useEffect, useRef } from "react";

/*
 * Каскад, который запускается сразу, если человек пришёл по якорю секции
 * (change qr-welcome, задача 5.1). Печатный QR партии 0 ведёт на `/collectio`,
 * а тот уводит на `/#collectio` — секция оказывается в вьюпорте до того, как
 * наблюдатель успеет сработать, и каскад иначе прошёл бы мимо глаз.
 *
 * Во всех остальных случаях ведём себя как обычный reveal: ждём доскролла.
 */
export function useAnchorReveal<T extends HTMLElement>(anchor: string) {
  const ref = useRef<T>(null);

  useEffect(() => {
    const node = ref.current;
    if (!node) return;

    const start = () => node.classList.add("in");

    if (window.location.hash === anchor) {
      start();
      return;
    }

    if (typeof IntersectionObserver === "undefined") {
      start();
      return;
    }

    const observer = new IntersectionObserver(
      (entries) => {
        for (const entry of entries) {
          if (!entry.isIntersecting) continue;
          start();
          observer.unobserve(entry.target);
        }
      },
      { threshold: 0.1 },
    );
    observer.observe(node);
    return () => observer.disconnect();
  }, [anchor]);

  return ref;
}
