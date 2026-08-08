import Image from "next/image";
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
        {/* priority: это LCP-элемент страницы, ленивая загрузка тут вредна.
            Формат — JPEG: AVIF от sips собирается grid-тайлами с irot, и такой
            файл браузер не рисует вовсе (проверено на сборке). */}
        <Image
          src="/hero-roots.jpg"
          alt=""
          fill
          priority
          sizes="100vw"
          className="object-cover"
        />
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
