import { DetailsAccordion } from "@/components/ui/details-accordion";
import { KickerHeader } from "@/components/ui/kicker-header";
import { productPage, type Sku } from "@/content/sku";

/*
 * «Уход мы расписали за тебя» по прототипу collectio (блок 6): подводка, грид из
 * трёх колонок ухода (care.items), аккордеон источников рекомендаций и дневник-панель.
 * Бордер дневник-панели — SKU-цвет (var(--sku), design-решение 6); аккордеон
 * источников остаётся на moss (бренд-акцент, не SKU-декор).
 */
export function Care({ sku }: { sku: Sku }) {
  const { care } = sku;
  return (
    <section className="bg-bone text-charcoal px-6 py-20 lg:px-30 lg:py-28">
      <div className="mb-10 flex max-w-[42ch] flex-col gap-4 lg:mb-12">
        <KickerHeader>{productPage.careEyebrow}</KickerHeader>
        <h2 className="leading-heading font-voice text-[clamp(1.9rem,2.6vw+1rem,3rem)] font-light">
          {productPage.careTitle}
        </h2>
        <p className="text-charcoal/85 max-w-[34rem] font-voice text-[clamp(1.15rem,1vw+0.85rem,1.45rem)] leading-normal">
          {care.lead}
        </p>
      </div>

      <div className="grid grid-cols-1 gap-8 md:grid-cols-3 lg:gap-12">
        {care.items.map((item) => (
          <div key={item.label} className="flex flex-col gap-2">
            <h3 className="text-moss-ink font-voice text-[clamp(1.5rem,1vw+1rem,1.7rem)] italic">
              {item.label}
            </h3>
            <p className="text-charcoal/85">{item.text}</p>
          </div>
        ))}
      </div>

      <DetailsAccordion
        className="mt-8 max-w-[34rem]"
        summary={productPage.careSources}
      >
        <div className="border-moss bg-chalk text-charcoal/70 mt-3 border-l-2 py-2 pr-3 pl-4 font-ui text-[13px] leading-relaxed">
          {care.sources}
        </div>
      </DetailsAccordion>

      <div
        className="mt-10 max-w-[42rem] border-l-2 pl-5"
        style={{ borderColor: "var(--sku)" }}
      >
        <KickerHeader className="text-moss-ink">
          {productPage.diaryEyebrow}
        </KickerHeader>
        <p className="text-charcoal mt-2 font-voice text-[clamp(1.5rem,1vw+1rem,1.7rem)] leading-snug">
          {care.diary}
        </p>
      </div>
    </section>
  );
}
