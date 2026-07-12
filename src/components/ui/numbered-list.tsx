/* Нумерованная опись (лендинг «Что в боксе» + страницы товара): номер · текст, разделены снизу бордером. */
export function NumberedList({
  items,
}: {
  items: { n: string; text: string }[];
}) {
  return (
    <ol className="list-none">
      {items.map((item) => (
        <li
          key={item.n}
          className="border-charcoal/10 flex items-baseline gap-6 border-b py-4"
        >
          <span className="tracking-kicker text-charcoal/45 font-ui text-[10px] tabular-nums">
            {item.n}
          </span>
          <span className="font-voice text-[17px]">{item.text}</span>
        </li>
      ))}
    </ol>
  );
}
