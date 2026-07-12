import { KickerHeader } from "@/components/ui/kicker-header";
import { home } from "@/content/home";

/* «Как это работает» по прототипу: chead (eyebrow + H2 слева, лид справа) + 3 шага */
export function HowItWorks() {
  const { howItWorks } = home;
  return (
    <section className="bg-bone text-charcoal flex flex-col gap-12 px-6 py-20 lg:px-30 lg:py-28">
      <div className="grid items-end gap-5 lg:grid-cols-[1.15fr_1fr] lg:gap-24">
        <div className="flex flex-col gap-5">
          <KickerHeader>{howItWorks.eyebrow}</KickerHeader>
          <h2 className="leading-heading max-w-[14ch] font-voice text-[clamp(1.9rem,2.6vw+1rem,3rem)] font-light">
            {howItWorks.title}
          </h2>
        </div>
        <p className="text-charcoal/70 max-w-[38rem] font-voice text-base leading-relaxed">
          {howItWorks.lead}
        </p>
      </div>

      <div className="grid gap-10 sm:grid-cols-3 lg:gap-16">
        {howItWorks.steps.map((step) => (
          <div key={step.n} className="flex flex-col gap-2">
            <span className="text-moss font-voice text-[1.6rem] leading-none tabular-nums">
              {step.n}
            </span>
            <h3 className="font-voice text-[clamp(1.5rem,1vw+1rem,1.7rem)] leading-tight">
              {step.title}
            </h3>
            <p className="text-charcoal/70 font-voice text-base leading-relaxed">
              {step.text}
            </p>
          </div>
        ))}
      </div>
    </section>
  );
}
