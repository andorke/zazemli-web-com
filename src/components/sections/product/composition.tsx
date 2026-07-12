import { KickerHeader } from "@/components/ui/kicker-header";
import { MaterialDot } from "@/components/ui/material-dot";
import { compositionEyebrow, compositionTitle, type Sku } from "@/content/sku";

/*
 * «Состав · N компонентов» по прототипу collectio (блок 4): заголовок с числом
 * компонентов, двухколоночный список строк «MaterialDot · компонент · доля %».
 * MaterialDot — единственное разрешённое место earth-палитры (color-system.md);
 * заливка точки — цвет материала, не SKU-цвет (задача 2.6 SKU-декора не касается).
 */
export function Composition({ sku }: { sku: Sku }) {
  return (
    <section className="bg-bone text-charcoal px-6 py-20 lg:px-30 lg:py-28">
      <div className="mb-10 flex max-w-[34ch] flex-col gap-4 lg:mb-12">
        <KickerHeader>{compositionEyebrow(sku)}</KickerHeader>
        <h2 className="leading-heading font-voice text-[clamp(1.9rem,2.6vw+1rem,3rem)] font-light">
          {compositionTitle(sku)}
        </h2>
      </div>
      <ul className="grid list-none grid-cols-1 gap-x-10 sm:grid-cols-2">
        {sku.composition.map((c) => (
          <li
            key={c.name}
            className="border-charcoal/15 grid grid-cols-[auto_1fr_auto] items-baseline gap-3 border-b py-3"
          >
            <MaterialDot material={c.material} className="self-center" />
            <span className="font-voice text-[17px]">{c.name}</span>
            <span className="text-charcoal/60 font-ui text-sm tabular-nums">
              {c.pct}%
            </span>
          </li>
        ))}
      </ul>
    </section>
  );
}
