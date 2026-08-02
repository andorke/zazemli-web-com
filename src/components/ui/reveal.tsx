"use client";

import { useEffect, useRef, type ReactNode } from "react";

import { cn } from "@/lib/utils";

/*
 * Reveal — запуск entrance-встречи для секций ниже фолда (change qr-welcome).
 * CSS держит анимацию на паузе, пока на элементе нет класса `in`; наблюдатель
 * ставит его один раз при появлении в вьюпорте и сразу снимает наблюдение.
 * Стартовые состояния живут в globals.css под `html.js-welcome` и
 * no-preference — без гейта класс `in` ни на что не влияет.
 */

const IN_CLASS = "in";

export function useReveal<T extends HTMLElement>() {
  const ref = useRef<T>(null);

  useEffect(() => {
    const node = ref.current;
    if (!node) return;

    // Нет IntersectionObserver — показываем сразу, иначе контент застынет на паузе
    if (typeof IntersectionObserver === "undefined") {
      node.classList.add(IN_CLASS);
      return;
    }

    const observer = new IntersectionObserver(
      (entries) => {
        for (const entry of entries) {
          if (!entry.isIntersecting) continue;
          entry.target.classList.add(IN_CLASS);
          observer.unobserve(entry.target);
        }
      },
      { threshold: 0.1 },
    );
    observer.observe(node);

    return () => observer.disconnect();
  }, []);

  return ref;
}

type RevealProps = {
  children: ReactNode;
  className?: string;
  /* Лесенка: появляются прямые дети с шагом --welcome-stagger, а не обёртка целиком */
  cascade?: boolean;
};

export function Reveal({ children, className, cascade = false }: RevealProps) {
  const ref = useReveal<HTMLDivElement>();

  return (
    <div
      ref={ref}
      className={cn(
        cascade
          ? "welcome-cascade welcome-reveal-cascade"
          : "welcome-rise welcome-reveal",
        className,
      )}
    >
      {children}
    </div>
  );
}
