import { KickerHeader } from "@/components/ui/kicker-header";
import { lab } from "@/content/lab";

/* Hero /lab (прототип .lhero): eyebrow + H1 + sub + курсивная строка смысла (voice italic) */
export function LabHero() {
  const { hero } = lab;
  return (
    <section className="bg-bone text-charcoal pt-24 pb-[clamp(2rem,4vw,3rem)] lg:pt-28">
      <div className="mx-auto max-w-[1080px] px-6 sm:px-8 lg:px-16">
        <KickerHeader>{hero.eyebrow}</KickerHeader>
        <h1 className="leading-heading mt-5 max-w-[18ch] font-voice text-[clamp(2.4rem,5vw,4rem)] font-light tracking-[-0.02em]">
          {hero.title}
        </h1>
        <p className="text-charcoal mt-6 max-w-[36rem] font-voice text-[clamp(1.15rem,1vw_+_0.85rem,1.45rem)] leading-normal font-light">
          {hero.sub}
        </p>
        <p className="text-ink-muted text-body mt-4 max-w-[34rem] font-voice leading-normal italic">
          {hero.meaning}
        </p>
      </div>
    </section>
  );
}
