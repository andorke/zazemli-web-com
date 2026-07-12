"use client";

import Link from "next/link";
import { useEffect, useRef } from "react";

import { diary } from "@/content/diary";

/*
 * Попап-резюме политики «Коротко о данных» (task 2.4, прототип diary-signup.html):
 * короткое резюме данных 4 пунктами + ссылка на полную политику /privacy. Закрывается
 * по Esc, клику по фону и крестику; при открытии фокус уходит на крестик, при закрытии
 * возвращается на триггер (ссылку в CB1). Полная политика — отдельная индексируемая
 * страница /privacy, не только модалка (design Decision 3). Копи — из diary.policyModal.
 */
export function PolicyModal({
  open,
  onClose,
}: {
  open: boolean;
  onClose: () => void;
}) {
  const { policyModal } = diary;
  const closeRef = useRef<HTMLButtonElement>(null);

  useEffect(() => {
    if (!open) return;
    // возврат фокуса на триггер после закрытия (a11y, как в прототипе)
    const trigger = document.activeElement as HTMLElement | null;
    closeRef.current?.focus();
    function onKeydown(event: KeyboardEvent) {
      if (event.key === "Escape") onClose();
    }
    document.addEventListener("keydown", onKeydown);
    return () => {
      document.removeEventListener("keydown", onKeydown);
      trigger?.focus();
    };
  }, [open, onClose]);

  if (!open) return null;

  return (
    <div
      role="dialog"
      aria-modal="true"
      aria-labelledby="policyModalTitle"
      onClick={(event) => {
        if (event.target === event.currentTarget) onClose();
      }}
      className="bg-charcoal/40 fixed inset-0 z-[60] flex items-center justify-center p-5"
    >
      <div className="border-charcoal/50 bg-bone relative max-h-[85vh] w-full max-w-lg overflow-auto border p-6 lg:p-8">
        <button
          ref={closeRef}
          type="button"
          onClick={onClose}
          aria-label="Закрыть"
          className="text-charcoal/70 absolute top-2 right-2 flex size-11 items-center justify-center text-2xl leading-none"
        >
          ×
        </button>
        <h2
          id="policyModalTitle"
          className="text-charcoal pr-8 font-serif text-2xl font-light"
        >
          {policyModal.title}
        </h2>
        <ul className="mt-4 flex flex-col gap-2.5">
          {policyModal.points.map((point) => (
            <li
              key={point}
              className="text-charcoal/70 leading-body flex gap-2 text-sm"
            >
              <span className="text-moss/60" aria-hidden>
                —
              </span>
              <span>{point}</span>
            </li>
          ))}
        </ul>
        <Link
          href={policyModal.fullLink.href}
          className="text-moss-ink mt-6 inline-block text-sm font-medium underline underline-offset-2"
        >
          {policyModal.fullLink.label}
        </Link>
      </div>
    </div>
  );
}
