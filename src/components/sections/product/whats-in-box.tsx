import { KickerHeader } from "@/components/ui/kicker-header";
import { boxTitle, productPage, type Sku } from "@/content/sku";

/*
 * «Что в боксе» по прототипу collectio (блок 5): заголовок + нумерованная опись
 * содержимого бокса (boxContents — 6 позиций по прототипу, нумерация 01…).
 * Вёрстка строк — как у одноимённого блока лендинга (home/whats-in-box).
 */
export function WhatsInBox({ sku }: { sku: Sku }) {
  return (
    <section className="bg-chalk text-charcoal px-6 py-20 lg:px-30 lg:py-28">
      <div className="mx-auto max-w-[40rem]">
        <div className="mb-10 flex max-w-[34ch] flex-col gap-4 lg:mb-12">
          <KickerHeader>{productPage.boxEyebrow}</KickerHeader>
          <h2 className="leading-heading font-serif text-[clamp(1.9rem,2.6vw+1rem,3rem)] font-light">
            {boxTitle(sku)}
          </h2>
        </div>
        <ol className="list-none">
          {sku.boxContents.map((item, i) => (
            <li
              key={item}
              className="border-charcoal/10 flex items-baseline gap-6 border-b py-4"
            >
              <span className="tracking-kicker text-charcoal/45 font-sans text-[10px] tabular-nums">
                {String(i + 1).padStart(2, "0")}
              </span>
              <span className="font-serif text-[17px]">{item}</span>
            </li>
          ))}
        </ol>
      </div>
    </section>
  );
}
