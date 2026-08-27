import Link from "next/link";

import { Fleuron } from "@/components/ui/fleuron";
import { productPage } from "@/content/sku";

/*
 * «Для кого» + футер-мост по прототипу collectio (блоки 10–11): центрированная
 * цитата основательницы с подписью и фльероном (образец — home/about) и мост
 * «← Вся коллекция» на секцию коллекции главной. Legal-строка прототипного футера —
 * в глобальном SiteFooter (layout), здесь не дублируется. Цитата и мост постоянны
 * для всех SKU (сверено по 7 прототипам) — проп sku не нужен. Фон bone разрывает
 * charcoal buybar → charcoal SiteFooter.
 */
export function FounderQuote() {
  return (
    <section className="bg-bone text-charcoal px-6 py-20 text-center lg:px-30 lg:py-28">
      <div className="mx-auto flex max-w-[38rem] flex-col items-center gap-3">
        <p className="text-charcoal font-voice text-take leading-normal font-light">
          {productPage.founderQuote}
        </p>
        <p className="text-moss-ink font-voice text-body italic">
          {productPage.founderSign} <Fleuron className="not-italic" />
        </p>
        {/* Тейк Т8 — сразу за подписью, по прототипу (блок 10) */}
        <p className="text-charcoal/70 font-ui text-small mt-4 leading-relaxed">
          {productPage.founderGift}
        </p>
        <p className="mt-6 font-ui text-caption">
          <Link href="/#collectio" className="text-moss-ink no-underline">
            {productPage.collectionBridge}
          </Link>
        </p>
      </div>
    </section>
  );
}
