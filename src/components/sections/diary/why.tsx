import { diary } from "@/content/diary";

/*
 * «Почему тебе» — 3 выгоды (diary.why), прототип diary-signup.html .why/.trio.
 * RSC (интерактива нет). Копи — из diary.ts. h2/h3 (единственный h1 — hero).
 */
export function Why() {
  const { why } = diary;
  return (
    <section className="border-charcoal/15 mx-auto mt-16 max-w-2xl border-t pt-12">
      <h2 className="leading-heading text-charcoal max-w-[24ch] font-serif text-[clamp(1.4rem,2.5vw,1.9rem)] font-light">
        {why.title}
      </h2>
      <div className="mt-8 grid gap-8 sm:grid-cols-3">
        {why.benefits.map((benefit) => (
          <div key={benefit.title} className="flex flex-col gap-1.5">
            <h3 className="text-charcoal font-serif text-lg leading-snug">
              {benefit.title}
            </h3>
            <p className="text-charcoal/70 leading-body text-sm">
              {benefit.text}
            </p>
          </div>
        ))}
      </div>
    </section>
  );
}
