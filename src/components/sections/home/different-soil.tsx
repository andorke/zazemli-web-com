import { SoilVial } from "@/components/ui/soil-vial";
import { KickerHeader } from "@/components/ui/kicker-header";
import { home } from "@/content/home";

/* «Разным растениям — разная земля» 185:143 — bone, кикер + лид + тройка колб-контраст (soil-vials-spec) */
export function DifferentSoil() {
  const { differentSoil } = home;
  return (
    <section className="bg-bone text-charcoal flex flex-col gap-8 px-6 py-20 lg:px-30 lg:py-35">
      <KickerHeader>{differentSoil.kicker}</KickerHeader>
      <p className="leading-narrative text-charcoal/70 max-w-3xl font-serif text-xl">
        {differentSoil.body}
      </p>
      <div className="mt-6 flex flex-col items-center justify-center gap-12 sm:flex-row sm:items-start sm:gap-16">
        {differentSoil.vials.map((vial) => (
          <figure
            key={vial.caption}
            className="flex max-w-56 flex-col items-center gap-4 text-center"
          >
            <SoilVial segments={vial.segments} />
            <figcaption className="flex flex-col gap-2">
              <span className="text-charcoal font-serif text-lg">
                {vial.caption}
              </span>
              <span className="text-charcoal/60 font-serif text-sm leading-snug italic">
                {vial.note}
              </span>
            </figcaption>
          </figure>
        ))}
      </div>
    </section>
  );
}
