import { ImageSlot } from "@/components/sections/home/image-slot";
import { KickerHeader } from "@/components/ui/kicker-header";
import { home } from "@/content/home";

/* «Разным растениям — разная земля» 185:143 — bone, кикер + лид + тройка колб-контраст */
export function DifferentSoil() {
  const { differentSoil } = home;
  return (
    <section className="bg-bone text-charcoal flex flex-col gap-8 px-6 py-20 lg:px-30 lg:py-35">
      <KickerHeader>{differentSoil.kicker}</KickerHeader>
      <p className="leading-narrative text-charcoal/70 max-w-3xl font-serif text-xl">
        {differentSoil.body}
      </p>
      <div className="mt-4 flex flex-col justify-center gap-8 sm:flex-row sm:gap-16">
        {differentSoil.vials.map((vial) => (
          <figure
            key={vial.caption}
            className="flex flex-col items-center gap-3"
          >
            <ImageSlot
              tone="light"
              caption={`колба · ${vial.caption}`}
              className="aspect-[2/5] w-32"
            />
            <figcaption className="text-charcoal/65 font-serif text-base italic">
              {vial.caption}
            </figcaption>
          </figure>
        ))}
      </div>
    </section>
  );
}
