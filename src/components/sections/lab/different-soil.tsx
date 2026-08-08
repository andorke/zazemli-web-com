import Link from "next/link";

import { KickerHeader } from "@/components/ui/kicker-header";
import { GROUPS, SoilVial } from "@/components/ui/soil-vial";
import { lab } from "@/content/lab";
import { landingNumber, skus } from "@/content/sku";

/*
 * «Разным растениям — разная земля» — вход в лабораторию по прототипу lab.html
 * (секция `.soil`, переезд с главной решением Насты 30.07 / FIX-78): chalk-фон,
 * центрированная шапка с мостом к рецептурам, трио колб-контраст `.trio`
 * (caption · «имя · N°» · биотоп — из sku.ts) и общая легенда `.legend`
 * вместо боковых подписей колбы.
 */
export function LabDifferentSoil() {
  const { differentSoil } = lab;
  const bySlug = new Map(skus.map((sku) => [sku.slug, sku]));
  return (
    <section className="bg-chalk text-charcoal py-[clamp(3.5rem,7vw,6rem)]">
      <div className="mx-auto max-w-[1080px] px-6 sm:px-8 lg:px-16">
        <div className="mx-auto mb-10 flex max-w-[38ch] flex-col items-center gap-5 text-center">
          <KickerHeader>{differentSoil.eyebrow}</KickerHeader>
          <h2 className="tracking-h2 leading-heading font-voice text-[clamp(1.9rem,2.6vw+1rem,3.5rem)] font-light">
            {differentSoil.title}
          </h2>
          <p className="text-charcoal/70 font-voice text-base leading-relaxed">
            {differentSoil.body}{" "}
            <Link
              href={differentSoil.bridge.href}
              className="text-moss-ink whitespace-nowrap no-underline"
            >
              {differentSoil.bridge.label}
            </Link>
          </p>
        </div>

        <div className="mx-auto grid w-full max-w-[840px] grid-cols-1 gap-12 sm:grid-cols-3 sm:gap-8">
          {differentSoil.vials.map((vial) => {
            const sku = bySlug.get(vial.skuSlug);
            if (!sku) return null;
            return (
              <figure
                key={vial.skuSlug}
                className="flex flex-col items-center gap-2 text-center"
              >
                <SoilVial
                  segments={vial.segments}
                  labels={false}
                  className="w-[clamp(6rem,11vw,8rem)]"
                />
                <figcaption className="flex flex-col items-center gap-1.5">
                  <span className="text-moss-ink font-voice text-lg leading-snug italic">
                    {sku.tagline}
                  </span>
                  <span className="tracking-kicker text-charcoal/55 font-ui text-[10px] uppercase">
                    {sku.nameRu} · {landingNumber(sku.number)}
                  </span>
                  {sku.biotope ? (
                    <span className="text-charcoal/45 font-voice text-sm italic">
                      {sku.biotope}
                    </span>
                  ) : null}
                </figcaption>
              </figure>
            );
          })}
        </div>

        <ul className="text-charcoal/55 font-ui mt-12 flex list-none flex-wrap justify-center gap-x-7 gap-y-2 text-[11px]">
          {differentSoil.legend.map((item) => {
            const fill = GROUPS.find((g) => g.key === item.key)?.fill;
            return (
              <li key={item.key} className="inline-flex items-center gap-2">
                <span
                  aria-hidden="true"
                  className="inline-block size-2.5"
                  style={{ backgroundColor: fill }}
                />
                {item.label}
              </li>
            );
          })}
        </ul>
      </div>
    </section>
  );
}
