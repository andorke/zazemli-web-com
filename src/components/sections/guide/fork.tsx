import Link from "next/link";

import { GuideTipDetails } from "@/components/sections/guide/tip";
import type { GuideEntryContent } from "@/content/guide";

/*
 * Развилка входа (прототип .fork, FIX-65): два маршрута рядом, у каждого условия
 * выбора и кнопка на свою страницу. Стоит после осмотра кома — раньше выбрать
 * способ пересадки нельзя.
 */
export function GuideFork({ fork }: { fork: GuideEntryContent["fork"] }) {
  return (
    <section
      id={fork.id}
      className="border-charcoal/15 mt-[clamp(2rem,4vw,2.8rem)] scroll-mt-8 border-y py-[clamp(1.6rem,3vw,2.2rem)]"
    >
      <p className="font-voice text-charcoal max-w-[30ch] text-[clamp(1.5rem,1vw_+_1rem,1.7rem)] leading-snug">
        {fork.title}
      </p>
      <p className="text-text-muted text-small mt-2 max-w-[40rem]">{fork.sub}</p>

      <div className="mt-[clamp(1.6rem,3vw,2.2rem)] grid gap-[clamp(1.6rem,4vw,3rem)] md:grid-cols-2">
        {fork.paths.map((path) => (
          <div
            key={path.title}
            className="border-moss border-l-2 pl-[clamp(0.9rem,2vw,1.3rem)]"
          >
            <h2 className="font-voice text-charcoal tracking-h2 text-[clamp(1.5rem,1vw_+_1rem,1.7rem)] font-normal">
              {path.title}
            </h2>
            <p className="text-ink-muted mt-2 mb-4 leading-snug">{path.lede}</p>
            <span className="text-moss-ink font-ui text-eyebrow tracking-kicker mb-2 block font-medium uppercase">
              {path.whenLabel}
            </span>
            <ul className="flex list-none flex-col gap-2">
              {path.when.map((line) => (
                <li
                  key={line}
                  className="text-charcoal/90 grid grid-cols-[1.1rem_1fr] gap-1.5 leading-snug"
                >
                  <span aria-hidden="true" className="text-moss-ink/70">
                    —
                  </span>
                  <span>{line}</span>
                </li>
              ))}
            </ul>
            <Link
              href={path.button.href}
              className="border-moss-ink text-charcoal font-ui hover:bg-moss-ink hover:text-bone mt-5 flex min-h-11 items-center justify-between gap-4 border px-5 py-4 font-medium no-underline transition-colors"
            >
              <span>{path.button.label}</span>
              <span aria-hidden="true">→</span>
            </Link>
            <span className="text-ink-muted text-caption mt-2 block leading-normal">
              {path.next}
            </span>
          </div>
        ))}
      </div>

      <GuideTipDetails tip={fork.tip} />
    </section>
  );
}
