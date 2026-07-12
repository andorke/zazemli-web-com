"use client";

import { useState } from "react";

import { OzonButton } from "@/components/site/ozon-button";
import { KickerHeader } from "@/components/ui/kicker-header";
import { buyCtaLabel, productPage, type Sku } from "@/content/sku";

/*
 * Buybar по прототипу collectio (блок 9): тёмный charcoal-блок с клиентским
 * размер-селектором из sku.sizes[]. Выбор объёма обновляет цену и текст Ozon-CTA
 * («Купить {размер} на Ozon»). При ozonListingUrl: null OzonButton показывает
 * «Скоро на Ozon» (не ссылку); UTM (utm_content=sku00X) строит lib/utm.ts.
 * SKU-цвет не применяется — акценты moss/bone (spec «текст и кнопки — moss/charcoal»).
 */
export function Buybar({ sku }: { sku: Sku }) {
  const [selected, setSelected] = useState(0);
  const size = sku.sizes[selected];
  return (
    <section
      id="buy"
      className="bg-charcoal text-bone flex flex-col items-center gap-8 px-6 py-24 text-center lg:py-32"
    >
      <KickerHeader className="text-bone/55">
        {productPage.buyEyebrow}
      </KickerHeader>
      <h2 className="leading-heading max-w-[18ch] font-serif text-[clamp(1.9rem,2.6vw+1rem,3rem)] font-light">
        {productPage.buyTitle}
      </h2>

      <div
        role="group"
        aria-label={productPage.buyTitle}
        className="flex flex-wrap justify-center gap-3"
      >
        {sku.sizes.map((s, i) => (
          <button
            key={s.volume}
            type="button"
            onClick={() => setSelected(i)}
            aria-pressed={i === selected}
            className="border-bone/25 text-bone aria-pressed:bg-bone aria-pressed:text-charcoal rounded-lg border px-6 py-3 font-sans text-[15px] transition-colors"
          >
            {s.volume}
          </button>
        ))}
      </div>

      <p className="font-serif text-[clamp(2rem,3vw+1rem,2.8rem)] font-light tabular-nums">
        {size.price}
      </p>

      <OzonButton
        href={size.ozonListingUrl}
        skuNumber={sku.number}
        label={buyCtaLabel(size)}
        className="bg-moss text-bone hover:bg-moss/90 px-10 py-6"
      />
    </section>
  );
}
