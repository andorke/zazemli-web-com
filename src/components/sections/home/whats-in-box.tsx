import { ImageSlot } from "@/components/sections/home/image-slot";
import { KickerHeader } from "@/components/ui/kicker-header";
import { home } from "@/content/home";

/* «Что в боксе» по прототипу: слева заголовок + опись канона (5 позиций), справа фото-слот 4/5 */
export function WhatsInBox() {
  const { whatsInBox } = home;
  return (
    <section className="bg-bone text-charcoal grid gap-12 px-6 py-20 lg:grid-cols-[1.1fr_0.9fr] lg:items-center lg:gap-20 lg:px-30 lg:py-28">
      <div className="flex flex-col gap-6">
        <div className="flex flex-col gap-5">
          <KickerHeader>{whatsInBox.eyebrow}</KickerHeader>
          <h2 className="leading-heading font-serif text-[clamp(1.9rem,2.6vw+1rem,3rem)] font-light">
            {whatsInBox.title}
          </h2>
        </div>

        <ol className="list-none">
          {whatsInBox.items.map((item) => (
            <li
              key={item.n}
              className="border-charcoal/10 flex items-baseline gap-6 border-b py-4"
            >
              <span className="tracking-kicker text-charcoal/45 font-sans text-[10px] tabular-nums">
                {item.n}
              </span>
              <span className="font-serif text-[17px]">{item.text}</span>
            </li>
          ))}
        </ol>

        <p className="text-charcoal/50 font-serif text-lg italic">
          {whatsInBox.after}
        </p>
      </div>

      <ImageSlot
        tone="light"
        caption={whatsInBox.photoSlot}
        className="aspect-[4/5] w-full max-lg:order-first"
      />
    </section>
  );
}
