import { ImageSlot } from "@/components/sections/home/image-slot";
import { KickerHeader } from "@/components/ui/kicker-header";
import { NumberedList } from "@/components/ui/numbered-list";
import { home } from "@/content/home";

/*
 * «Что в боксе» по прототипу (`.boxsec`): слева заголовок и опись из общего
 * модуля состава (5 позиций), справа фото-слот 4/5 — до съёмки заливка chalk
 * без текстовой заглушки (FIX-03). Первый смысловой блок под hero (FIX-13).
 */
export function WhatsInBox() {
  const { whatsInBox } = home;
  return (
    <section className="bg-bone text-charcoal px-6 py-20 lg:px-30 lg:py-28">
      <div className="mx-auto grid max-w-7xl gap-12 lg:grid-cols-[1.1fr_0.9fr] lg:items-center lg:gap-20">
        <div className="flex flex-col gap-6">
          <div className="flex flex-col gap-5">
            <KickerHeader>{whatsInBox.eyebrow}</KickerHeader>
            <h2 className="leading-heading font-voice text-[clamp(1.9rem,2.6vw+1rem,3rem)] font-light">
              {whatsInBox.title}
            </h2>
          </div>

          <NumberedList items={whatsInBox.items} />

          <p className="text-charcoal/50 font-voice text-lg italic">
            {whatsInBox.after}
          </p>
        </div>

        <ImageSlot
          tone="light"
          className="bg-chalk aspect-[4/5] w-full max-lg:order-first"
        />
      </div>
    </section>
  );
}
