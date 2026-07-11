import { home } from "@/content/home";

/* Эссе-пауза по прототипу landing.html: крупная строка канона + split «Для растения»/«Для тебя» */
export function Manifesto() {
  const { manifesto } = home;
  return (
    <section className="bg-bone text-charcoal px-6 py-20 lg:px-30 lg:py-28">
      <h2 className="text-charcoal/90 max-w-[22ch] font-serif text-[clamp(1.9rem,2.6vw+1rem,3rem)] font-light leading-[1.22]">
        {manifesto.line[0]} <em className="italic">{manifesto.line[1]}</em>
      </h2>
      <div className="border-charcoal/15 mt-10 grid max-w-3xl gap-8 border-t pt-8 sm:grid-cols-2 lg:gap-16">
        {manifesto.split.map((part) => (
          <div key={part.label} className="flex flex-col gap-2">
            <span className="text-moss font-serif text-[clamp(1.5rem,1vw+1rem,1.7rem)] italic">
              {part.label}
            </span>
            <p className="text-charcoal/70 max-w-[38rem] font-serif text-base leading-relaxed">
              {part.text}
            </p>
          </div>
        ))}
      </div>
    </section>
  );
}
