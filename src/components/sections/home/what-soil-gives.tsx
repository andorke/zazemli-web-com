import { KickerHeader } from "@/components/ui/kicker-header";
import { home } from "@/content/home";

/*
 * «Что даёт» по прототипу: chead (eyebrow + H2 слева, лид справа), две колонки
 * «Растению»/«Тебе» с italic-moss заголовками и закрывающая core formula,
 * отделённая линейкой (FIX-72).
 */
export function WhatSoilGives() {
  const { whatSoilGives } = home;
  return (
    <section className="bg-bone text-charcoal py-20 lg:py-28">
      <div className="wrap flex flex-col">
        <div className="layout:mb-16 layout:grid-cols-[1.15fr_1fr] layout:gap-24 mb-12 grid items-end gap-5">
          <div className="flex flex-col gap-5">
            <KickerHeader>{whatSoilGives.eyebrow}</KickerHeader>
            <h2 className="tracking-h2 leading-heading font-voice max-w-[14ch] text-[clamp(1.9rem,2.6vw+1rem,3.5rem)] font-light">
              {whatSoilGives.title}
            </h2>
          </div>
          <p className="text-charcoal/70 font-voice max-w-[38rem] text-base leading-relaxed">
            {whatSoilGives.lead}
          </p>
        </div>

        <div className="layout:grid-cols-[1fr_1fr] layout:gap-20 grid gap-10">
          {whatSoilGives.columns.map((col) => (
            <div key={col.label} className="flex flex-col gap-3">
              <h3
                className={
                  "text-moss font-voice text-[clamp(1.5rem,1vw+1rem,1.7rem)] italic" // ds-allow: moss-large — заголовок колонки 24–27px (≥18pt)
                }
              >
                {col.label}
              </h3>
              <p className="text-charcoal/70 font-voice max-w-[38rem] text-base leading-relaxed">
                {col.text}
              </p>
            </div>
          ))}
        </div>

        <p className="border-charcoal/15 text-charcoal font-voice mt-10 border-t pt-8 text-[clamp(1.15rem,1vw+0.85rem,1.45rem)] leading-snug lg:mt-12">
          {whatSoilGives.coreFormula}
        </p>
      </div>
    </section>
  );
}
