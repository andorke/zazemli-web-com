import { productPage, type Sku } from "@/content/sku";

/*
 * Блок 6b «Собрать самому» по прототипу collectio (FIX-38): лид, таблица
 * сравнения самосбора с готовым боксом и честная рамка под ней.
 *
 * Цена готового бокса берётся из sizes SKU, а не дублируется в копи: иначе
 * она разойдётся с блоком покупки при первой же правке — ровно тот класс
 * расхождения, который ловит приёмка.
 *
 * Сравнение идёт между боксом и самосбором, а не между растениями коллекции:
 * запрет anti-patterns §5.7 здесь не нарушается.
 */
export function DiyCompare({ sku }: { sku: Sku }) {
  /* базовый объём — первый в списке, как в блоке покупки */
  const boxPrice = sku.sizes[0].price;

  return (
    <section className="bg-bone text-charcoal px-6 py-20 lg:px-30 lg:py-28">
      <div className="mx-auto flex max-w-[46rem] flex-col gap-6">
        <h2 className="tracking-h2 leading-heading font-voice text-h2 font-light">
          {productPage.diyTitle}
        </h2>
        <p className="text-charcoal/80 font-ui text-body leading-relaxed">
          {productPage.diyLead}
        </p>

        <dl className="border-charcoal/15 mt-2 grid grid-cols-[1fr_auto_auto] gap-x-6 gap-y-0 border-t">
          <div className="text-charcoal/50 font-ui text-eyebrow col-span-3 grid grid-cols-subgrid py-3 tracking-[0.14em] uppercase">
            <span />
            <span className="text-right">{productPage.diyColumns.self}</span>
            <span className="text-right">{productPage.diyColumns.box}</span>
          </div>
          {productPage.diyRows.map((row) => (
            <div
              key={row.label}
              className="border-charcoal/10 col-span-3 grid grid-cols-subgrid items-baseline border-t py-3"
            >
              <dt className="font-ui text-small">{row.label}</dt>
              <dd className="text-charcoal/70 font-ui text-caption text-right tabular-nums">
                {row.self}
              </dd>
              <dd className="text-moss-ink font-ui text-caption text-right tabular-nums">
                {row.box ?? boxPrice}
              </dd>
            </div>
          ))}
        </dl>

        <p className="text-charcoal/60 font-ui text-caption leading-relaxed">
          {productPage.diyHonestNote}
        </p>
      </div>
    </section>
  );
}
