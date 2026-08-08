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
    <section className="bg-bone text-charcoal py-20 lg:py-28">
      <div className="layout:grid-cols-[0.9fr_1.1fr] layout:items-center layout:gap-20 mx-auto grid w-full max-w-[1240px] gap-12 px-[clamp(1.5rem,5vw,4rem)]">
        <div className="flex flex-col gap-6">
          <div className="flex flex-col gap-5">
            <KickerHeader>{whatsInBox.eyebrow}</KickerHeader>
            <h2 className="tracking-h2 leading-heading font-voice text-[clamp(1.9rem,2.6vw+1rem,3rem)] font-light">
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
          className="bg-chalk max-layout:order-first aspect-[4/5] w-full"
        />
      </div>
    </section>
  );
}
