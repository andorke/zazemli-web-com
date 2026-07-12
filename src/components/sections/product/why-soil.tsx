import Link from "next/link";

import { KickerHeader } from "@/components/ui/kicker-header";
import { GROUPS, SoilVial } from "@/components/ui/soil-vial";
import { labHref, productPage, type Sku } from "@/content/sku";

/*
 * «Зачем именно эта земля» по прототипу collectio: chalk-фон, слева — проза биотопа,
 * SourceNote (нативный details с бейджем «рецензируемо» и рецензируемым источником) и
 * мост на реестр источников /lab; справа — мерная колба SoilVial + легенда групп с %.
 * SKU-цвет здесь не применяется (задача 2.6); акценты — moss/moss-ink.
 */
export function WhySoil({ sku }: { sku: Sku }) {
  const legend = GROUPS.filter((g) => sku.vial[g.key] > 0);
  return (
    <section className="bg-chalk text-charcoal px-6 py-20 lg:px-30 lg:py-28">
      <div className="mx-auto grid max-w-[70rem] grid-cols-1 items-center gap-12 md:grid-cols-[1.2fr_0.8fr] md:gap-16">
        <div className="flex flex-col gap-5">
          <KickerHeader>{productPage.whyEyebrow}</KickerHeader>
          <p className="text-charcoal/85 max-w-[34rem] font-voice text-[clamp(1.15rem,1vw+0.85rem,1.45rem)] leading-relaxed font-light">
            {sku.whyProse}
          </p>

          <details className="mt-1 max-w-[34rem]">
            <summary className="text-moss-ink inline-block cursor-pointer list-none font-ui text-[13px] tracking-wide underline decoration-dotted underline-offset-4 [&::-webkit-details-marker]:hidden">
              {sku.sourceNote.summary}
            </summary>
            <div className="border-moss bg-bone text-charcoal/70 mt-3 border-l-2 py-2 pr-3 pl-4 font-ui text-[13px] leading-relaxed">
              <span className="text-moss-ink font-ui text-[11px] tracking-wide uppercase">
                {productPage.sourceBadge}
              </span>
              <p className="mt-1">{sku.sourceNote.claim}</p>
              <p className="mt-1 font-voice italic">{sku.sourceNote.source}</p>
            </div>
          </details>

          <p className="mt-1 font-ui text-[13px]">
            <Link href={labHref(sku)} className="text-moss-ink no-underline">
              {productPage.labBridge}
            </Link>
          </p>
        </div>

        <figure className="flex flex-col items-center gap-5">
          <SoilVial
            segments={sku.vial}
            labels={false}
            className="w-[clamp(120px,16vw,168px)]"
          />
          <ul className="text-charcoal/60 flex list-none flex-wrap justify-center gap-x-5 gap-y-2 font-ui text-[11px]">
            {legend.map((g) => (
              <li key={g.key} className="inline-flex items-center gap-2">
                <span
                  aria-hidden="true"
                  className="inline-block size-2.5"
                  style={{ backgroundColor: g.fill }}
                />
                {g.label} {sku.vial[g.key]}%
              </li>
            ))}
          </ul>
        </figure>
      </div>
    </section>
  );
}
