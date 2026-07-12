import { home } from "@/content/home";

/* Эссе-пауза по прототипу landing.html: крупная строка канона + split «Для растения»/«Для тебя» */
export function Manifesto() {
  const { manifesto } = home;
  return (
    <section className="bg-bone text-charcoal px-6 py-20 lg:px-30 lg:py-28">
      <div className="mx-auto max-w-7xl">
        <h2 className="text-charcoal/90 font-voice max-w-[22ch] text-[clamp(1.9rem,2.6vw+1rem,3rem)] leading-[1.22] font-light">
          {manifesto.line[0]} <em className="italic">{manifesto.line[1]}</em>
        </h2>
        <div className="border-charcoal/15 mt-10 grid max-w-3xl gap-8 border-t pt-8 sm:grid-cols-2 lg:gap-16">
          {manifesto.split.map((part) => (
            <div key={part.label} className="flex flex-col gap-2">
              <span
                className={
                  "text-moss font-voice text-[clamp(1.5rem,1vw+1rem,1.7rem)] italic" // ds-allow: moss-large — лейбл манифеста 24–27px (≥18pt)
                }
              >
                {part.label}
              </span>
              <p className="text-charcoal/70 font-voice max-w-[38rem] text-base leading-relaxed">
                {part.text}
              </p>
            </div>
          ))}
        </div>
      </div>
    </section>
  );
}
