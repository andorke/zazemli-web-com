import { KickerHeader } from "@/components/ui/kicker-header";
import { home } from "@/content/home";

/*
 * «Как это работает» по прототипу: chead (eyebrow + лид-строка + H2 слева, лид
 * справа) + 3 шага. Лид-строка `.lead-line` — перенесённая строка снятого
 * манифеста (тейк Т6), набрана курсивом в moss-ink.
 */
export function HowItWorks() {
  const { howItWorks } = home;
  return (
    <section className="bg-bone text-charcoal flex flex-col gap-12 py-20 lg:py-28">
      <div className="wrap flex flex-col gap-12">
        <div className="layout:grid-cols-[1.15fr_1fr] layout:gap-24 grid items-end gap-5">
          <div className="flex flex-col gap-5">
            <KickerHeader>{howItWorks.eyebrow}</KickerHeader>
            <p className="text-moss-ink font-voice max-w-[26ch] text-take leading-snug italic">
              {howItWorks.leadLine}
            </p>
            <h2 className="tracking-h2 leading-heading font-voice max-w-[14ch] text-h1 font-light">
              {howItWorks.title}
            </h2>
          </div>
          <p className="text-charcoal/70 font-voice max-w-[38rem] text-body leading-relaxed">
            {howItWorks.lead}
          </p>
        </div>

        <div className="layout:grid-cols-3 layout:gap-16 grid gap-10">
          {howItWorks.steps.map((step) => (
            <div key={step.n} className="flex flex-col gap-2">
              <span
                className={
                  "text-moss font-voice text-take leading-none tabular-nums" // ds-allow: moss-large — цифра шага ~26px (≥18pt), политика разрешает raw moss на крупном
                }
              >
                {step.n}
              </span>
              <h3 className="font-voice text-take leading-tight">
                {step.title}
              </h3>
              <p className="text-charcoal/70 font-voice text-body leading-relaxed">
                {step.text}
              </p>
              {/* тейк Т3 закрывает шаг 03: отделён линейкой, moss-ink (NEW-04) */}
              {step.take ? (
                <span className="border-charcoal/15 text-moss-ink font-voice mt-2 block border-t pt-2 text-body leading-snug tracking-[-0.015em]">
                  {step.take}
                </span>
              ) : null}
            </div>
          ))}
        </div>
      </div>
    </section>
  );
}
