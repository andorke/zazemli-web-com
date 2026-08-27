import Link from "next/link";

import type { BoxItem } from "@/content/box";

/*
 * Опись бокса по прототипу `.opis` (лендинг «Что в боксе» + страницы товара):
 * номер · текст, разделены снизу бордером. У позиции 01 — мост в лабораторию,
 * у позиции 03 — четыре подпункта заботы с висячим тире.
 */
export function NumberedList({ items }: { items: BoxItem[] }) {
  return (
    <ol className="list-none">
      {items.map((item) => (
        <li
          key={item.n}
          className="border-charcoal/10 grid grid-cols-[auto_1fr] items-baseline gap-6 border-b py-4"
        >
          <span className="tracking-kicker text-charcoal/45 font-ui text-eyebrow tabular-nums">
            {item.n}
          </span>
          {/* div, а не span: ниже по дереву лежит <ul> — блочный элемент,
              внутри phrasing-контейнера это невалидная разметка */}
          <div className="font-voice text-body">
            {item.text}
            {item.link ? (
              <>
                {" · "}
                {/* без whitespace-nowrap: он раздувал min-content колонки и на
                    320px давал горизонтальный скролл всей страницы */}
                <Link href={item.link.href} className="text-moss-ink no-underline">
                  {item.link.label}
                </Link>
              </>
            ) : null}
            {item.sub ? (
              <ul className="mt-3 grid list-none gap-2">
                {item.sub.map((sub) => (
                  <li
                    key={sub}
                    className="text-charcoal/70 -indent-[1.1rem] pl-[1.1rem] text-small leading-normal"
                  >
                    — {sub}
                  </li>
                ))}
              </ul>
            ) : null}
          </div>
        </li>
      ))}
    </ol>
  );
}
