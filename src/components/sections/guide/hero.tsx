import { KickerHeader } from "@/components/ui/kicker-header";

/*
 * Тир 1 · видение (прототипы guide*.html .ghero): eyebrow + H1 + sub + мета.
 * Общий для входа и обоих маршрутов: у входа меты нет, у маршрутов под метой
 * идёт ссылка на соседнюю ветку (children).
 */
export function GuideHero({
  hero,
  children,
}: {
  hero: { eyebrow: string; title: string; sub: string; meta?: string };
  children?: React.ReactNode;
}) {
  return (
    <section data-fx className="bg-bone text-charcoal pt-24 pb-[clamp(3rem,6vw,5rem)] lg:pt-28">
      <div className="welcome-cascade mx-auto max-w-[1080px] px-6 sm:px-8 lg:px-16">
        <KickerHeader>{hero.eyebrow}</KickerHeader>
        <h1 className="font-voice leading-heading mt-5 max-w-[18ch] text-display-page font-light tracking-display-page">
          {hero.title}
        </h1>
        <p className="text-charcoal/90 font-voice mt-6 max-w-[34rem] text-take leading-normal font-light">
          {hero.sub}
        </p>
        {hero.meta && (
          <p className="text-text-muted font-ui text-small mt-6 tracking-[0.04em] tabular-nums">
            {hero.meta}
          </p>
        )}
        {children && <div className="mt-5">{children}</div>}
      </div>
    </section>
  );
}
