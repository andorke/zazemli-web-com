import Link from "next/link";

import { KickerHeader } from "@/components/ui/kicker-header";
import { home } from "@/content/home";

/*
 * Hero по прототипу landing.html: full-bleed фото-фон (до съёмки — заливка charcoal
 * без текстового плейсхолдера, FIX-03), контент прижат вниз — eyebrow, H1 канона
 * (вторая фраза em, точки не несёт — FIX-26), sub, CTA на #collectio + прайс.
 * Топбар поверх фото — scope ds-migration, здесь его нет.
 */
export function Hero() {
  const { hero } = home;
  return (
    <section className="bg-charcoal text-bone relative flex min-h-svh flex-col justify-end overflow-hidden pt-24 pb-14 lg:pb-24">
      <div className="mx-auto flex w-full max-w-[1240px] flex-col gap-7 px-[clamp(1.5rem,5vw,4rem)]">
        <KickerHeader className="text-bone/60">{hero.eyebrow}</KickerHeader>
        <h1 className="leading-hero font-voice text-[clamp(2.9rem,6.5vw,5.5rem)] font-light tracking-[-0.025em]">
          {hero.title[0]}{" "}
          {/* block: вторая фраза всегда с новой строки, как в прототипе */}
          <em className="block italic">{hero.title[1]}</em>
        </h1>
        <p className="text-bone/70 font-voice max-w-[32rem] text-[clamp(1.15rem,1vw+0.85rem,1.45rem)] leading-normal">
          {hero.sub}
        </p>
        <div className="mt-2 flex flex-wrap items-center gap-6">
          <Link
            href={hero.cta.href}
            className="bg-moss text-bone border-moss font-voice border px-8 py-4 text-[17px]"
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
