import Link from "next/link";

import { KickerHeader } from "@/components/ui/kicker-header";
import { home } from "@/content/home";

/* «Что в боксе» 185:21 — chalk-фон, слева заголовок, справа опись из 5 строк */
export function WhatsInBox() {
  const { whatsInBox } = home;
  return (
    <section className="bg-chalk text-charcoal flex flex-col gap-16 px-6 py-20 lg:flex-row lg:items-center lg:gap-30 lg:px-30 lg:py-35">
      <div className="flex max-w-md flex-col gap-5">
        <KickerHeader>{whatsInBox.kicker}</KickerHeader>
        <h2 className="font-voice text-4xl leading-tight">
          {whatsInBox.title.map((line) => (
            <span key={line} className="block">
              {line}
            </span>
          ))}
        </h2>
        <Link
          href={whatsInBox.link.href}
          className="text-charcoal/70 w-fit font-voice text-lg underline underline-offset-4"
        >
          {whatsInBox.link.label}
        </Link>
      </div>

      <ol className="flex-1 lg:max-w-xl">
        {whatsInBox.items.map((item) => (
          <li
            key={item.n}
            className="border-charcoal/8 flex items-baseline gap-7 border-t py-[22px] first:border-t-0"
          >
            <span className="tracking-kicker text-charcoal/45 font-ui text-[10px]">
              {item.n}
            </span>
            <span className="font-voice text-2xl">{item.text}</span>
          </li>
        ))}
      </ol>
    </section>
  );
}
