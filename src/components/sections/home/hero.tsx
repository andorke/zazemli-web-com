import Link from "next/link";

import { KickerHeader } from "@/components/ui/kicker-header";
import { home } from "@/content/home";

/*
 * Hero по прототипу landing.html: full-bleed фото-фон (FIX-03 закрыт — вместо
 * заливки стоит иллюстрация корневой зоны), контент прижат вниз: eyebrow,
 * H1 канона (вторая фраза em, точки не несёт — FIX-26), sub, CTA + прайс.
 * Топбар поверх фото — scope ds-migration, здесь его нет.
 *
 * Слои сцены: media (фон) → veil (градиенты под читаемость) → copy (текст).
 * Параллакс живёт в globals.css на scroll-таймлайне; здесь только разметка,
 * чтобы слои было чем разводить по глубине.
 */
export function Hero() {
  const { hero } = home;
  return (
    <section className="hero-scene bg-charcoal text-bone relative flex min-h-svh flex-col justify-end overflow-hidden pt-24 pb-14 lg:pb-24">
      <div className="hero-media" aria-hidden="true">
        {/*
         * Не next/image: в static export он не отдаёт ни srcset, ни выбор
         * формата (images.unoptimized), а арт-дирекшн не умеет в принципе.
         * На узком экране нужен другой кадр, а не тот же в меньшем размере:
         * 16:9 на телефоне растягивается примерно вдвое и мылит.
         *
         * fetchPriority ставим руками: в Next 16 priority его больше не
         * выставляет, только добавляет preload — а preload картинки без
         * приоритета встаёт в общую очередь за шрифтами.
         */}
        <picture>
          <source
            media="(max-width: 859px)"
            type="image/avif"
            srcSet="/img/hero-roots-portrait-900.avif"
          />
          <source
            media="(max-width: 859px)"
            type="image/webp"
            srcSet="/img/hero-roots-portrait-900.webp"
          />
          <source media="(max-width: 859px)" srcSet="/img/hero-roots-portrait-900.jpg" />
          <source
            type="image/avif"
            srcSet="/img/hero-roots-800.avif 800w, /img/hero-roots-1200.avif 1200w, /img/hero-roots-1600.avif 1600w, /img/hero-roots-2200.avif 2200w"
            sizes="100vw"
          />
          <source
            type="image/webp"
            srcSet="/img/hero-roots-800.webp 800w, /img/hero-roots-1200.webp 1200w, /img/hero-roots-1600.webp 1600w, /img/hero-roots-2200.webp 2200w"
            sizes="100vw"
          />
          <img
            src="/img/hero-roots-1600.jpg"
            srcSet="/img/hero-roots-800.jpg 800w, /img/hero-roots-1200.jpg 1200w, /img/hero-roots-1600.jpg 1600w, /img/hero-roots-2200.jpg 2200w"
            sizes="100vw"
            alt=""
            fetchPriority="high"
            decoding="async"
          />
        </picture>
      </div>
      <div className="hero-veil" aria-hidden="true" />

      <div className="wrap hero-copy flex flex-col gap-7">
        <KickerHeader className="text-bone/60">{hero.eyebrow}</KickerHeader>
        {/* потолок 7rem, а не 5.5: на 2560 полоса контента шире 1500px,
            и прежний кегль читался мелко относительно полотна */}
        <h1 className="leading-hero tracking-display-hero font-voice text-[clamp(2.9rem,6.5vw,7rem)] font-light">
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
