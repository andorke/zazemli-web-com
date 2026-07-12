import Link from "next/link";

import { KickerHeader } from "@/components/ui/kicker-header";
import {
  heroCtaLabel,
  heroTitle,
  landingNumber,
  productPage,
  type Sku,
} from "@/content/sku";

/*
 * Hero страницы товара по прототипу collectio-*.html: kicker (партия + номер),
 * H1 «Заземли {растение}.» (винительный, вариант A), латынь рода italic, описание
 * грунта, solid-CTA на buybar (#buy добавит 2.4) и строка объёмов/цены.
 * Единственный h1 страницы. SKU-цвет — только акцент номера в кикере (var(--sku));
 * текст и CTA остаются на moss-ink/charcoal (spec: кнопки не окрашены в SKU-цвет).
 */
export function ProductHero({ sku }: { sku: Sku }) {
  return (
    <section className="text-charcoal flex flex-col px-6 pt-16 pb-20 lg:px-30 lg:pt-24 lg:pb-28">
      <div className="flex max-w-[36rem] flex-col gap-6">
        <KickerHeader>
          {`${productPage.heroKicker} · `}
          <span style={{ color: "var(--sku)" }}>
            {landingNumber(sku.number)}
          </span>
        </KickerHeader>
        <h1 className="leading-hero font-voice text-[clamp(2.6rem,5.5vw,4.4rem)] font-light tracking-[-0.02em]">
          {heroTitle(sku)}
        </h1>
        <p className="text-moss-ink font-voice text-[clamp(1.15rem,1vw+0.85rem,1.45rem)] italic">
          {sku.latin}
        </p>
        <p className="text-charcoal/85 max-w-[30rem] font-voice text-[clamp(1.15rem,1vw+0.85rem,1.45rem)] leading-normal">
          {sku.heroSub}
        </p>
        <div className="mt-4 flex flex-wrap items-center gap-6">
          <Link
            href="#buy"
            className="bg-moss-ink text-bone border-moss-ink border px-8 py-4 font-ui text-[15px] font-medium"
          >
            {heroCtaLabel(sku)}
          </Link>
          <span className="text-charcoal/55 font-ui text-[13px] tracking-wide">
            {sku.volumes} · {sku.priceFrom}
          </span>
        </div>
      </div>
    </section>
  );
}
