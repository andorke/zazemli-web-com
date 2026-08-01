import { KickerHeader } from "@/components/ui/kicker-header";
import { NumberedList } from "@/components/ui/numbered-list";
import { boxTitle, productPage, type Sku } from "@/content/sku";

/*
 * «Что в боксе» по прототипу collectio (блок 5): заголовок + нумерованная опись
 * содержимого бокса (boxContents — 6 позиций по прототипу, нумерация 01…).
 * Вёрстка строк — общий атом NumberedList (тот же, что у home/whats-in-box).
 */
export function WhatsInBox({ sku }: { sku: Sku }) {
  const items = sku.boxContents.map((text, i) => ({
    n: String(i + 1).padStart(2, "0"),
    text,
  }));
  return (
    <section className="bg-chalk text-charcoal px-6 py-20 lg:px-30 lg:py-28">
      <div className="mx-auto max-w-[40rem]">
        <div className="mb-10 flex max-w-[34ch] flex-col gap-4 lg:mb-12">
          <KickerHeader>{productPage.boxEyebrow}</KickerHeader>
          <h2 className="tracking-h2 leading-heading font-voice text-[clamp(1.9rem,2.6vw+1rem,3rem)] font-light">
            {boxTitle(sku)}
          </h2>
        </div>
        <NumberedList items={items} />
      </div>
    </section>
  );
}
