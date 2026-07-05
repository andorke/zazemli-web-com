import { ImageSlot } from "@/components/sections/home/image-slot";
import { KickerHeader } from "@/components/ui/kicker-header";
import { home } from "@/content/home";

/* «Что даёт земля» 185:159 — тёмная (soil), слева фото-слот, справа две колонки + closing */
export function WhatSoilGives() {
  const { whatSoilGives } = home;
  return (
    <section className="bg-soil text-bone relative flex flex-col gap-12 px-6 py-20 lg:flex-row lg:items-center lg:gap-20 lg:px-30 lg:py-28">
      <ImageSlot
        tone="dark"
        caption={whatSoilGives.photoSlot}
        className="aspect-[3/2] w-full lg:flex-1"
      />

      <div className="flex flex-col gap-8 lg:flex-1">
        <div className="flex flex-col gap-2">
          <span className="bg-buttercup h-0.5 w-12" />
          <KickerHeader className="text-bone/60">
            {whatSoilGives.kicker}
          </KickerHeader>
        </div>

        <div className="flex flex-col gap-7">
          {whatSoilGives.columns.map((col) => (
            <div
              key={col.label}
              className="border-bone/14 flex flex-col gap-3 border-b pb-7 last:border-b-0"
            >
              <span className="text-bone/65 font-voice text-[17px] italic">
                {col.label}
              </span>
              <p className="text-bone/70 font-voice text-[27px] leading-snug">
                {col.text.map((line) => (
                  <span key={line} className="block">
                    {line}
                  </span>
                ))}
              </p>
            </div>
          ))}
          <p className="text-bone/85 font-voice text-[17px] italic">
            {whatSoilGives.closing}
          </p>
        </div>
      </div>
    </section>
  );
}
