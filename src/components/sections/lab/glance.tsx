import Link from "next/link";

import { lab } from "@/content/lab";

/* Оглавление /lab (прототип .glance): 3 якоря — Рецептуры · Компоненты · Источники */
export function LabGlance() {
  return (
    <section className="bg-bone text-charcoal pb-[clamp(2rem,4vw,3rem)]">
      <div className="mx-auto max-w-[1080px] px-6 sm:px-8 lg:px-16">
        <nav
          aria-label="Разделы лаборатории"
          className="border-charcoal/15 flex flex-wrap gap-x-6 gap-y-3 border-y py-6"
        >
          {lab.nav.map((item) => (
            <Link
              key={item.href}
              href={item.href}
              className="text-small inline-flex items-baseline gap-2 no-underline transition-opacity hover:opacity-60"
            >
              <span className="text-moss-ink font-voice text-body tabular-nums">
                {item.num}
              </span>
              {item.label}
            </Link>
          ))}
        </nav>
      </div>
    </section>
  );
}
