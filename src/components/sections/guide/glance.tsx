import Link from "next/link";

import { guide } from "@/content/guide";

/* Тир 2 · шаги одним взглядом (прототип .glance): лента-оглавление, якоря стадий */
export function GuideGlance() {
  return (
    <section className="bg-bone text-charcoal pb-[clamp(3rem,6vw,5rem)]">
      <div className="mx-auto max-w-[1080px] px-6 sm:px-8 lg:px-16">
        <nav
          aria-label="Шаги пересадки"
          className="border-charcoal/15 flex flex-wrap gap-x-6 gap-y-3 border-y py-6"
        >
          {guide.stages.map((stage) => (
            <Link
              key={stage.id}
              href={`#${stage.id}`}
              className="text-small inline-flex items-baseline gap-2 no-underline transition-opacity hover:opacity-60"
            >
              <span className="text-moss-ink font-voice text-body tabular-nums">
                {stage.num}
              </span>
              {stage.title}
            </Link>
          ))}
        </nav>
      </div>
    </section>
  );
}
