import Link from "next/link";

import { KickerHeader } from "@/components/ui/kicker-header";
import { home } from "@/content/home";

/*
 * Тизеры ×3 по прототипу: Лаборатория → /lab, Гайд → /guide, Дневник — текстом без ссылки
 * (инвариант «diary вне навигации», вход только по QR из бокса).
 */
export function Teasers() {
  return (
    <section className="bg-bone text-charcoal grid gap-12 px-6 py-20 lg:grid-cols-3 lg:gap-16 lg:px-30 lg:py-28">
      {home.teasers.map((teaser) => (
        <article
          key={teaser.eyebrow}
          className="border-charcoal flex flex-col gap-4 border-t pt-6"
        >
          <KickerHeader>{teaser.eyebrow}</KickerHeader>
          <h3 className="font-serif text-[clamp(1.5rem,1vw+1rem,1.7rem)] leading-snug">
            {teaser.title}
          </h3>
          <p className="text-charcoal/70 font-serif text-base leading-relaxed">
            {teaser.body}
          </p>
          {teaser.link ? (
            <Link
              href={teaser.link.href}
              className="text-moss-ink mt-auto w-fit pt-2 font-sans text-[12px] font-medium tracking-wide no-underline"
            >
              {teaser.link.label}
            </Link>
          ) : (
            <span className="text-charcoal/50 mt-auto pt-2 font-sans text-[11px] tracking-wide">
              {teaser.note}
            </span>
          )}
        </article>
      ))}
    </section>
  );
}
