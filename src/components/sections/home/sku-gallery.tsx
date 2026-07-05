import Link from "next/link";

import { Doodle } from "@/components/ui/doodle";
import { KickerHeader } from "@/components/ui/kicker-header";
import { home } from "@/content/home";
import { skus, type SkuColor } from "@/content/sku";

/*
 * Галерея 7 SKU 185:39 — bone, кикер + заголовок + декоративная «7» + сетка карточек + линк.
 * Карточка по эталону: дудл (графит) · SKU-точка + N° · название · фраза · размер горшка.
 * Карточки некликабельны на MVP (бриф §2).
 * NB: SKU-цветные точки на главной — по Figma 185:2; формально color-system требует SKU-цвета
 * только на /collectio/[plant]. Точки 7px — декоративные маркеры (тип MaterialDot). Вопрос к CDO.
 */
const dotBg: Record<SkuColor, string> = {
  moss: "bg-moss",
  cosmos: "bg-cosmos",
  iris: "bg-iris",
  buttercup: "bg-buttercup",
  sky: "bg-sky",
  poppy: "bg-poppy",
};

export function SkuGallery() {
  const { skuGallery } = home;
  return (
    <section className="bg-bone text-charcoal relative flex flex-col gap-12 overflow-hidden px-6 py-20 lg:px-30 lg:py-35">
      <span
        aria-hidden="true"
        className="text-charcoal/7 pointer-events-none absolute top-16 right-6 font-voice text-[200px] leading-none font-light select-none lg:right-30"
      >
        {skuGallery.decorative}
      </span>

      <div className="flex flex-col gap-6">
        <KickerHeader>{skuGallery.kicker}</KickerHeader>
        <h2 className="leading-heading max-w-2xl font-voice text-[clamp(2rem,4vw,3rem)]">
          {skuGallery.title}
        </h2>
      </div>

      <ul className="grid grid-cols-2 justify-items-center gap-x-8 gap-y-14 pt-4 sm:grid-cols-3 lg:grid-cols-4">
        {skus.map((sku) => (
          <li
            key={sku.number}
            className="flex w-40 flex-col items-center gap-1.5 text-center"
          >
            <Doodle src={sku.doodle} className="h-32 w-24" />
            <span className="flex items-center gap-2">
              <span
                aria-hidden="true"
                className={`inline-block size-[7px] rounded-full ${dotBg[sku.color]}`}
              />
              <span className="tracking-kicker text-charcoal/45 font-ui text-[10px]">
                {sku.number}
              </span>
            </span>
            <span className="text-charcoal font-voice text-xl capitalize">
              {sku.nameRu}
            </span>
            <span className="text-charcoal/40 font-voice text-sm italic">
              {sku.tagline}
            </span>
            <span className="text-charcoal/20 mt-1.5 font-ui text-[10px] tracking-wide">
              {sku.potSize}
            </span>
          </li>
        ))}
      </ul>

      <Link
        href={skuGallery.link.href}
        className="text-charcoal/70 w-fit font-voice text-lg underline underline-offset-4"
      >
        {skuGallery.link.label}
      </Link>
    </section>
  );
}
