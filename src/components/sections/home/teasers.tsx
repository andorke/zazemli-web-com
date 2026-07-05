import Link from "next/link";

import { KickerHeader } from "@/components/ui/kicker-header";
import { home } from "@/content/home";

/* Тизеры 185:181 — два столбца (Гайд / Лаборатория), верхняя линия, кикер+мета, заголовок, текст, линк */
export function Teasers() {
  return (
    <section className="bg-bone text-charcoal flex flex-col gap-12 px-6 py-20 lg:flex-row lg:gap-16 lg:px-30 lg:pt-20 lg:pb-25">
      {home.teasers.map((teaser) => (
        <article
          key={teaser.kicker}
          className="border-charcoal flex flex-1 flex-col gap-4 border-t pt-6"
        >
          <div className="flex items-center justify-between">
            <KickerHeader>{teaser.kicker}</KickerHeader>
            <span className="tracking-kicker text-charcoal/45 font-ui text-[10px]">
              {teaser.meta}
            </span>
          </div>
          <h2 className="text-charcoal/85 font-voice text-[26px] italic">
            {teaser.title}
          </h2>
          <p className="text-charcoal/70 max-w-lg font-voice text-base leading-relaxed">
            {teaser.body}
          </p>
          <Link
            href={teaser.link.href}
            className="text-charcoal/75 w-fit font-voice text-base underline underline-offset-4"
          >
            {teaser.link.label}
          </Link>
        </article>
      ))}
    </section>
  );
}
