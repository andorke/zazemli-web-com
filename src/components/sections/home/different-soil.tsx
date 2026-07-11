import Link from "next/link";

import { KickerHeader } from "@/components/ui/kicker-header";
import { GROUPS, SoilVial } from "@/components/ui/soil-vial";
import { home } from "@/content/home";
import { landingNumber, skus } from "@/content/sku";

/*
 * «Разным растениям — разная земля» по прототипу: chalk-фон, центрированный head
 * с мостом «почему именно так →» на /lab (moss-ink, spec), трио колб-контраст
 * (подписи и биотопы — из sku.ts) и общая легенда групп вместо боковых подписей.
 */
export function DifferentSoil() {
  const { differentSoil } = home;
  const bySlug = new Map(skus.map((sku) => [sku.slug, sku]));
  return (
    <section className="bg-chalk text-charcoal flex flex-col px-6 py-20 lg:px-30 lg:py-28">
      <div className="mx-auto mb-14 flex max-w-[38ch] flex-col items-center gap-5 text-center">
        <KickerHeader>{differentSoil.eyebrow}</KickerHeader>
        <h2 className="leading-heading font-serif text-[clamp(1.9rem,2.6vw+1rem,3rem)] font-light">
          {differentSoil.title}
        </h2>
        <p className="text-charcoal/70 font-serif text-base leading-relaxed">
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
                <span className="text-moss-ink font-serif text-lg leading-snug italic">
                  {sku.tagline}
                </span>
                <span className="tracking-kicker text-charcoal/55 font-sans text-[10px] uppercase">
                  {sku.nameRu} · {landingNumber(sku.number)}
                </span>
                {sku.biotope ? (
                  <span className="text-charcoal/45 font-serif text-sm italic">
                    {sku.biotope}
                  </span>
                ) : null}
              </figcaption>
            </figure>
          );
        })}
      </div>

      <ul className="text-charcoal/55 mt-12 flex list-none flex-wrap justify-center gap-x-7 gap-y-2 font-sans text-[11px]">
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
    </section>
  );
}
