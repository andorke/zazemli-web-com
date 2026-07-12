import Link from "next/link";

import { KickerHeader } from "@/components/ui/kicker-header";
import { home } from "@/content/home";
import { landingNumber, skus } from "@/content/sku";

/*
 * Галерея #collectio по прототипу landing.html: типографическая сетка с hairline-линиями
 * (gap-1px по подложке), 7 кликабельных карточек (фото-слот · N° 01 · имя · фраза · мета)
 * + карточка-приглашение N° 08 + CTA. Карточки ведут на страницы товара /collectio/[slug]
 * (change product-pages); SKU-цвета на главной запрещены (spec).
 */
export function SkuGallery() {
  const { skuGallery } = home;
  return (
    <section
      id="collectio"
      className="bg-bone text-charcoal flex flex-col px-6 py-20 lg:px-30 lg:py-28"
    >
      <div className="mb-12 grid items-end gap-5 lg:mb-16 lg:grid-cols-[1.15fr_1fr] lg:gap-24">
        <div className="flex flex-col gap-5">
          <KickerHeader>{skuGallery.eyebrow}</KickerHeader>
          <h2 className="leading-heading max-w-[14ch] font-voice text-[clamp(1.9rem,2.6vw+1rem,3rem)] font-light">
            {skuGallery.title}
          </h2>
        </div>
        <p className="text-charcoal/70 max-w-[38rem] font-voice text-base leading-relaxed">
          {skuGallery.lead}
        </p>
      </div>

      <ul className="border-charcoal/15 bg-charcoal/15 grid list-none gap-px border-y [grid-template-columns:repeat(auto-fill,minmax(250px,1fr))]">
        {skus.map((sku) => (
          <li key={sku.number} className="contents">
            <Link
              href={`/collectio/${sku.slug}`}
              className="bg-bone group flex flex-col no-underline"
            >
              <span className="bg-chalk relative block aspect-[3/4]">
                <span className="text-charcoal/40 absolute top-1/2 left-1/2 -translate-1/2 font-voice text-sm italic">
                  фото
                </span>
              </span>
              <span className="flex flex-col gap-1.5 px-6 pt-5 pb-7">
                <span className="tracking-kicker text-charcoal/50 font-ui text-[10px]">
                  {landingNumber(sku.number)}
                </span>
                <span className="font-voice text-[1.55rem] leading-tight">
                  {sku.nameRu}
                </span>
                <span className="text-charcoal/45 font-voice text-base italic">
                  {sku.tagline}
                </span>
                <span className="border-charcoal/10 text-charcoal/50 mt-3 flex flex-col gap-1 border-t pt-3 font-ui text-[10px] tracking-wide tabular-nums">
                  <span>{sku.components} компонентов</span>
                  <span>
                    {sku.volumes} · {sku.priceFrom}
                  </span>
                </span>
                <span className="text-moss-ink mt-3 text-[13px] font-medium opacity-0 transition-opacity group-hover:opacity-100">
                  {skuGallery.cardCta}
                </span>
              </span>
            </Link>
          </li>
        ))}
        <li className="contents">
          <div className="bg-chalk flex flex-col gap-3 px-6 py-8">
            <span className="tracking-kicker text-charcoal/50 font-ui text-[10px]">
              {skuGallery.invite.number}
            </span>
            <span className="text-charcoal/60 max-w-[16ch] font-voice text-[1.3rem] leading-snug italic">
              {skuGallery.invite.question}
            </span>
            <span className="text-charcoal/55 font-voice text-sm">
              {skuGallery.invite.note}
            </span>
          </div>
        </li>
      </ul>

      <Link
        href={skuGallery.cta.href}
        className="border-charcoal text-charcoal mt-10 w-fit border px-8 py-4 font-voice text-[15px]"
      >
        {skuGallery.cta.label}
      </Link>
    </section>
  );
}
