import Link from "next/link";

import { KickerHeader } from "@/components/ui/kicker-header";
import { home } from "@/content/home";

/* Hero 185:13 — full-bleed земля (soil), контент слева снизу, plate-метка справа внизу */
export function Hero() {
  const { hero } = home;
  return (
    <section className="bg-soil text-bone relative flex min-h-[640px] flex-col justify-end overflow-hidden px-6 py-16 lg:min-h-[760px] lg:px-30 lg:py-35">
      <div className="flex flex-col gap-7">
        <KickerHeader className="text-bone/85">{hero.kicker}</KickerHeader>
        <h1 className="leading-hero font-serif text-[clamp(2.75rem,8vw,5.25rem)] font-light">
          {hero.title.map((line) => (
            <span key={line} className="block">
              {line}
            </span>
          ))}
        </h1>
        <p className="text-bone/85 max-w-xl font-serif text-lg">{hero.sub}</p>
        <Link
          href={hero.cta.href}
          className="bg-bone text-charcoal mt-2 w-fit px-[30px] py-[17px] font-serif text-[17px]"
        >
          {hero.cta.label}
        </Link>
      </div>
      <span className="bg-bone text-charcoal absolute right-6 bottom-6 px-3 py-[7px] font-sans text-[10px] tracking-[0.12em] opacity-75 lg:right-30 lg:bottom-10">
        {hero.plate}
      </span>
    </section>
  );
}
