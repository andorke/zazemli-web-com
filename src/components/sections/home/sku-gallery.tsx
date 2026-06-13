import Link from "next/link";

import { KickerHeader } from "@/components/ui/kicker-header";
import { home } from "@/content/home";
import { skus } from "@/content/sku";

/*
 * Галерея 7 SKU 185:39 — bone, кикер IV + декоративная «7» + сетка карточек-мини + линк.
 * Карточки некликабельны на MVP (бриф §2). SKU-цвета на главной не применяются —
 * только латынь в moss (color-system: 60/30/10, главная без SKU-палитры).
 * Заголовок секции (нода 185:41) не успел выгрузиться до Figma rate limit — открытый вопрос.
 */
export function SkuGallery() {
  const { skuGallery } = home;
  return (
    <section className="bg-bone text-charcoal relative flex flex-col gap-14 overflow-hidden px-6 py-20 lg:px-30 lg:py-35">
      <span
        aria-hidden="true"
        className="text-charcoal/7 pointer-events-none absolute -top-6 right-6 font-serif text-[200px] leading-none font-light select-none lg:right-30"
      >
        {skuGallery.decorative}
      </span>

      <KickerHeader>{skuGallery.kicker}</KickerHeader>

      <ul className="grid grid-cols-2 gap-x-12 gap-y-14 sm:grid-cols-3 lg:grid-cols-4">
        {skus.map((sku) => (
          <li key={sku.number} className="flex flex-col gap-2">
            <span className="tracking-kicker text-charcoal/45 font-sans text-[10px]">
              {sku.number}
            </span>
            <span className="text-charcoal font-serif text-2xl">
              {sku.nameRu}
            </span>
            <span className="text-moss font-serif text-base italic">
              {sku.latin}
            </span>
          </li>
        ))}
      </ul>

      <Link
        href={skuGallery.link.href}
        className="text-charcoal/70 w-fit font-serif text-lg underline underline-offset-4"
      >
        {skuGallery.link.label}
      </Link>
    </section>
  );
}
