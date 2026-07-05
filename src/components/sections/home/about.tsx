import { RitualNote } from "@/components/ui/ritual-note";
import { home } from "@/content/home";

/* «О нас» 185:173 — bone, центрированная цитата основательницы + нарратив + ритуальная подпись */
export function About() {
  const { about } = home;
  return (
    <section className="bg-bone text-charcoal flex flex-col items-center gap-7 px-6 py-20 text-center lg:px-30 lg:py-35">
      <blockquote className="text-charcoal/80 font-voice text-[clamp(2rem,4vw,3rem)] leading-tight italic">
        {about.quote.map((line) => (
          <span key={line} className="block">
            {line}
          </span>
        ))}
      </blockquote>
      <p className="leading-narrative text-charcoal/70 max-w-3xl font-voice text-lg">
        {about.body}
      </p>
      <RitualNote className="text-charcoal/55 text-2xl">
        {about.signature}
      </RitualNote>
    </section>
  );
}
