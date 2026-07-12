"use client";

import { useEffect, useRef } from "react";

import { DetailsAccordion } from "@/components/ui/details-accordion";
import type { LabComponent } from "@/content/lab";

const TITLE_ID = "labComponentModalTitle";

/*
 * Модалка описания компонента (задача 3.2, prototype .cmodal): role=dialog,
 * закрытие по Esc/фону/крестику, focus-trap на Tab/Shift+Tab, возврат фокуса
 * на открывшую плитку, scroll-lock фона. Источник контента — сам React-стейт
 * (в прототипе — скрытый <div> с данными; здесь данные уже типизированы в lab.ts).
 */
export function ComponentModal({
  component,
  onClose,
}: {
  component: LabComponent | null;
  onClose: () => void;
}) {
  const cardRef = useRef<HTMLDivElement>(null);

  useEffect(() => {
    if (!component) return;
    const trigger = document.activeElement as HTMLElement | null;
    const card = cardRef.current;
    card?.focus();
    document.body.classList.add("overflow-hidden");

    function focusables(): HTMLElement[] {
      if (!card) return [];
      return Array.from(
        card.querySelectorAll<HTMLElement>(
          'button, a[href], summary, [tabindex]:not([tabindex="-1"])',
        ),
      );
    }

    function onKeydown(event: KeyboardEvent) {
      if (event.key === "Escape") {
        onClose();
        return;
      }
      if (event.key !== "Tab") return;
      const items = focusables();
      if (items.length === 0) return;
      const first = items[0];
      const last = items[items.length - 1];
      if (event.shiftKey && document.activeElement === first) {
        event.preventDefault();
        last.focus();
      } else if (!event.shiftKey && document.activeElement === last) {
        event.preventDefault();
        first.focus();
      }
    }

    document.addEventListener("keydown", onKeydown);
    return () => {
      document.removeEventListener("keydown", onKeydown);
      document.body.classList.remove("overflow-hidden");
      trigger?.focus();
    };
  }, [component, onClose]);

  if (!component) return null;

  return (
    <div
      role="dialog"
      aria-modal="true"
      aria-labelledby={TITLE_ID}
      onClick={(event) => {
        if (event.target === event.currentTarget) onClose();
      }}
      className="bg-charcoal/50 fixed inset-0 z-50 flex items-start justify-center overflow-y-auto p-4 py-[clamp(1rem,6vh,5rem)]"
    >
      <div
        ref={cardRef}
        tabIndex={-1}
        className="border-charcoal/15 bg-bone relative max-h-[86vh] w-full max-w-lg overflow-auto border p-6 outline-none lg:p-8"
      >
        <button
          type="button"
          onClick={onClose}
          aria-label="Закрыть"
          className="text-ink-muted hover:text-charcoal absolute top-2 right-2 flex size-11 items-center justify-center text-2xl leading-none"
        >
          ×
        </button>
        <span className="font-ui text-eyebrow tracking-kicker text-text-muted mb-2 block font-medium uppercase">
          {component.group}
        </span>
        <h3 id={TITLE_ID} className="pr-8 font-voice text-[1.5rem] font-normal">
          {component.name}
        </h3>
        <div className="text-charcoal/80 text-small leading-body mt-4 flex flex-col gap-3">
          {component.paras.map((paragraph) => (
            <p key={paragraph}>{paragraph}</p>
          ))}
        </div>
        <p className="border-charcoal/15 text-caption text-ink-muted font-ui mt-4 border-t pt-3 tracking-[0.04em]">
          <b className="text-charcoal font-medium">{component.spec.label}:</b>{" "}
          {component.spec.value} · Функция: {component.group}
        </p>
        <DetailsAccordion summary="что говорит наука" className="mt-4">
          <div className="text-ink-muted text-caption mt-3 leading-normal">
            <span className="text-moss-ink font-medium">
              {component.source.level}
            </span>
            <br />
            {component.source.text}
            {component.source.doi && (
              <>
                {" "}
                <a
                  href={component.source.doi}
                  target="_blank"
                  rel="noopener noreferrer"
                  className="text-moss-ink underline decoration-dotted underline-offset-2"
                >
                  ↗ DOI
                </a>
              </>
            )}
          </div>
        </DetailsAccordion>
      </div>
    </div>
  );
}
