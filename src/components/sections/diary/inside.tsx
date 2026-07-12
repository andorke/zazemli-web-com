import { diary } from "@/content/diary";

/*
 * «Что внутри» — таймлайн 7 писем (diary.inside), прототип diary-signup.html .inside/.tl.
 * RSC. Копи — из diary.ts. <ol> с нумерованными точками 1–7; вертикальная линия
 * связи между точками (кроме последней). eachLetter — как gift в hero (border-l moss).
 * h2/h3 (единственный h1 — hero).
 */
export function Inside() {
  const { inside } = diary;
  const lastIndex = inside.letters.length - 1;
  return (
    <section className="border-charcoal/15 mx-auto mt-16 max-w-2xl border-t pt-12">
      <h2 className="leading-heading text-charcoal max-w-[26ch] font-serif text-[clamp(1.4rem,2.5vw,1.9rem)] font-light">
        {inside.title}
      </h2>
      <p className="text-charcoal/60 mt-3 max-w-xl text-sm">{inside.lead}</p>
      <ol className="mt-10 flex flex-col">
        {inside.letters.map((letter, index) => (
          <li
            key={letter.n}
            className="relative grid grid-cols-[2.4rem_1fr] gap-4 pb-6"
          >
            {index < lastIndex && (
              <span
                aria-hidden="true"
                className="bg-charcoal/15 absolute top-8 bottom-0 left-3 w-px"
              />
            )}
            <span className="border-moss text-moss bg-bone relative flex size-6 items-center justify-center rounded-full border font-serif text-sm tabular-nums">
              {letter.n}
            </span>
            <div>
              <span className="tracking-kicker text-charcoal/50 font-sans text-[10px] font-medium uppercase">
                {letter.when}
              </span>
              <h3 className="text-charcoal mt-1 font-serif text-base leading-tight">
                {letter.title}
              </h3>
              <p className="text-charcoal/70 leading-body mt-1 max-w-lg text-sm">
                {letter.text}
              </p>
            </div>
          </li>
        ))}
      </ol>
      <p className="border-moss leading-body text-charcoal/70 mt-8 max-w-xl border-l-2 pl-4 text-sm">
        <span className="text-charcoal font-medium">
          {inside.eachLetter.lead}
        </span>{" "}
        {inside.eachLetter.body}
      </p>
    </section>
  );
}
