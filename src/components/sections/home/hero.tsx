import Link from "next/link";

import { KickerHeader } from "@/components/ui/kicker-header";
import { home } from "@/content/home";

/*
 * Hero по прототипу landing.html: full-bleed фото-фон (пока слот-плейсхолдер на charcoal),
 * контент прижат вниз — eyebrow, H1 канона (вторая фраза em), sub, CTA на #collectio + прайс.
 * Топбар поверх фото — scope ds-migration, здесь его нет.
 */
export function Hero() {
  const { hero } = home;
  return (
    <section className="bg-charcoal text-bone relative flex min-h-svh flex-col justify-end overflow-hidden px-6 pt-24 pb-14 lg:px-30 lg:pb-24">
      <span
        aria-hidden="true"
        className="text-bone/40 absolute right-6 bottom-5 font-voice text-sm italic select-none lg:right-30"
      >
        [ {hero.photoSlot} ]
      </span>

      <div className="flex flex-col gap-7">
        <KickerHeader className="text-bone/60">{hero.eyebrow}</KickerHeader>
        <h1 className="leading-hero font-voice text-[clamp(2.9rem,6.5vw,5.5rem)] font-light tracking-[-0.025em]">
          {hero.title[0]}{" "}
          {/* block: вторая фраза всегда с новой строки, как в прототипе */}
          <em className="block italic">{hero.title[1]}</em>
        </h1>
        <p className="text-bone/70 max-w-[32rem] font-voice text-[clamp(1.15rem,1vw+0.85rem,1.45rem)] leading-normal">
          {hero.sub}
        </p>
        <div className="mt-2 flex flex-wrap items-center gap-6">
          <Link
            href={hero.cta.href}
            className="bg-moss text-bone border-moss border px-8 py-4 font-voice text-[17px]"
          >
            {hero.cta.label}
          </Link>
          <span className="text-bone/55 font-ui text-[11px] tracking-wide">
            {hero.price}
          </span>
        </div>
      </div>
    </section>
  );
}
