import { KickerHeader } from "@/components/ui/kicker-header";
import { SoilVial } from "@/components/ui/soil-vial";
import { home } from "@/content/home";

/* «Разным растениям — разная земля» 185:143 — bone, кикер + лид + тройка колб-контраст (soil-vials-spec) */
export function DifferentSoil() {
  const { differentSoil } = home;
  return (
    <section className="bg-bone text-charcoal flex flex-col gap-8 px-6 py-20 lg:px-30 lg:py-35">
      <KickerHeader>{differentSoil.kicker}</KickerHeader>
      <p className="leading-narrative text-charcoal/70 max-w-3xl font-voice text-xl">
        {differentSoil.body}
      </p>
      <div className="mt-8 grid grid-cols-1 gap-12 sm:grid-cols-3 sm:gap-8">
        {differentSoil.vials.map((vial) => (
          <figure key={vial.caption} className="flex flex-col gap-5">
            <SoilVial segments={vial.segments} className="w-40 sm:w-36 lg:w-48" />
            <figcaption className="flex flex-col gap-3">
              <span className="font-ui text-base lowercase">
                {vial.caption}
              </span>
              <span className="bg-charcoal/40 h-px w-8" />
              <span className="text-charcoal/65 max-w-xs font-voice text-base leading-snug italic">
                {vial.note}
              </span>
            </figcaption>
          </figure>
        ))}
      </div>
    </section>
  );
}
