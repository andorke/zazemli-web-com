import { KickerHeader } from "@/components/ui/kicker-header";
import { NumberedList } from "@/components/ui/numbered-list";
import { boxTitle, productPage, skuBoxContents, type Sku } from "@/content/sku";

/*
 * «Что в боксе» по прототипу collectio (блок 5): заголовок + нумерованная опись.
 * Состав берётся из общего модуля @/content/box — тот же источник, что у главной
 * (spec product-page: дублировать состав в двух местах контента нельзя).
 */
export function WhatsInBox({ sku }: { sku: Sku }) {
  const items = skuBoxContents(sku);
  return (
    <section className="bg-chalk text-charcoal px-6 py-20 lg:px-30 lg:py-28">
      <div className="mx-auto max-w-[40rem]">
        <div className="mb-10 flex max-w-[34ch] flex-col gap-4 lg:mb-12">
          <KickerHeader>{productPage.boxEyebrow}</KickerHeader>
          <h2 className="tracking-h2 leading-heading font-voice text-h1 font-light">
            {boxTitle(sku)}
          </h2>
        </div>
        <NumberedList items={items} />
      </div>
    </section>
  );
}
