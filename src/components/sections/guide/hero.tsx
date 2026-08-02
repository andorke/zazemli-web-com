import { KickerHeader } from "@/components/ui/kicker-header";
import { guide } from "@/content/guide";

/* Тир 1 · видение (прототип guide.html .ghero): eyebrow + H1 канона + sub + мета */
export function GuideHero() {
  const { hero } = guide;
  return (
    <section className="bg-bone text-charcoal pt-24 pb-[clamp(3rem,6vw,5rem)] lg:pt-28">
      <div className="welcome-cascade mx-auto max-w-[1080px] px-6 sm:px-8 lg:px-16">
        <KickerHeader>{hero.eyebrow}</KickerHeader>
        {/* Строки h1 — в обёртках: с lg каждая вылетает из-под своей маски (qr-welcome D4) */}
        <h1 className="welcome-lines mt-5 max-w-[18ch] font-voice text-[clamp(2.4rem,5vw,4rem)] leading-heading font-light tracking-[-0.02em]">
          {hero.titleLines.map((line, index) => (
            <span key={line} className="welcome-line block">
              {/* пробел между строками — h1 должен читаться цельной фразой */}
              {index > 0 ? " " : null}
              <span className="block">{line}</span>
            </span>
          ))}
        </h1>
        <p className="text-charcoal/90 mt-6 max-w-[34rem] font-voice text-[clamp(1.15rem,1vw_+_0.85rem,1.45rem)] leading-normal font-light">
          {hero.sub}
        </p>
        <p className="text-text-muted font-ui text-small mt-6 tracking-[0.04em] tabular-nums">
          {hero.meta}
        </p>
      </div>
    </section>
  );
}
