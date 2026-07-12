import Link from "next/link";

import { KickerHeader } from "@/components/ui/kicker-header";
import { home } from "@/content/home";

/*
 * Тизеры ×3 по прототипу: Лаборатория → /lab, Гайд → /guide, Дневник — текстом без ссылки
 * (инвариант «diary вне навигации», вход только по QR из бокса).
 */
export function Teasers() {
  return (
    <section className="bg-bone text-charcoal px-6 py-20 lg:px-30 lg:py-28">
      <div className="mx-auto grid max-w-7xl gap-12 lg:grid-cols-3 lg:gap-16">
        {home.teasers.map((teaser) => (
          <article
            key={teaser.eyebrow}
            className="border-charcoal flex flex-col gap-4 border-t pt-6"
          >
            <KickerHeader>{teaser.eyebrow}</KickerHeader>
            <h3 className="font-voice text-[clamp(1.5rem,1vw+1rem,1.7rem)] leading-snug">
              {teaser.title}
            </h3>
            <p className="text-charcoal/70 font-voice text-base leading-relaxed">
              {teaser.body}
            </p>
            {teaser.link ? (
              <Link
                href={teaser.link.href}
                className="text-moss-ink font-ui mt-auto w-fit pt-2 text-[12px] font-medium tracking-wide no-underline"
              >
                {teaser.link.label}
              </Link>
            ) : (
              <span className="text-charcoal/50 font-ui mt-auto pt-2 text-[11px] tracking-wide">
                {teaser.note}
              </span>
            )}
          </article>
        ))}
      </div>
    </section>
  );
}
