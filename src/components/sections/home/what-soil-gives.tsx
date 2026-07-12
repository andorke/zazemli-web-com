import { home } from "@/content/home";

/* «Что даёт» по прототипу: две колонки «Растению»/«Тебе», italic-moss заголовки, без кикера */
export function WhatSoilGives() {
  const { whatSoilGives } = home;
  return (
    <section className="bg-bone text-charcoal grid gap-10 px-6 py-20 lg:grid-cols-2 lg:gap-20 lg:px-30 lg:py-28">
      {whatSoilGives.columns.map((col) => (
        <div key={col.label} className="flex flex-col gap-3">
          <h3 className="text-moss font-voice text-[clamp(1.5rem,1vw+1rem,1.7rem)] italic">
            {col.label}
          </h3>
          <p className="text-charcoal/70 max-w-[38rem] font-voice text-base leading-relaxed">
            {col.text}
          </p>
        </div>
      ))}
    </section>
  );
}
