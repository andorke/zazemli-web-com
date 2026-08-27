import { OzonButton } from "@/components/site/ozon-button";
import { KickerHeader } from "@/components/ui/kicker-header";
import { home } from "@/content/home";
import { footer, ozonStoreUrl } from "@/content/site";
import { volumeTiers } from "@/content/sku";

/*
 * Блок «Купить» по прототипу (`.ozon` + `.pots3`): тёмный финальный блок —
 * eyebrow, заголовок с ценой, три плитки объёмов, мелкая строка про сезон,
 * кнопка Ozon, risk-reversal и подпись про оплату.
 *
 * NEW-03 (решение Насты 30.07): из четырёх сообщений остались только размеры —
 * тейк Т3 уехал в шаг 03 «Ведёшь дневник», кофе-якорь и финал-мысль сняты.
 * Плитки намеренно НЕ кликабельны: Ozon не открыт, а ложную кликабельность
 * аудит уже ловил (FIX-32). Откроется магазин — плитка станет <a> на листинг.
 */
export function Buy() {
  const { buy } = home;
  return (
    <section className="bg-charcoal text-bone py-24 lg:py-32">
      <div className="wrap flex flex-col items-center gap-7 text-center">
        <KickerHeader className="text-bone/55">{buy.eyebrow}</KickerHeader>
        <h2 className="tracking-h2 font-voice max-w-[18ch] text-h1 leading-tight font-light">
          {buy.title}
        </h2>

        <ul className="grid w-full max-w-[44rem] list-none grid-cols-3 gap-2.5">
          {volumeTiers.map((tier) => (
            <li
              key={tier.volume}
              className="border-bone/40 border px-3 py-4 text-center"
            >
              <span className="font-voice text-bone block text-h2 leading-tight font-light tracking-[-0.03em] tabular-nums">
                {tier.volume}
              </span>
              <span className="font-ui text-bone/60 mt-1.5 block text-caption leading-snug">
                {buy.potLabel}
                <br />
                {tier.pot}
              </span>
            </li>
          ))}
        </ul>

        <p className="text-bone/50 font-ui text-caption">{buy.note}</p>

        <OzonButton
          href={ozonStoreUrl}
          className="bg-moss text-bone hover:bg-moss/90 px-10 py-6"
        />

        <p className="text-bone/70 font-voice max-w-[38rem] text-small leading-relaxed">
          {buy.riskReversal}{" "}
          <a
            href={`mailto:${footer.email}`}
            className="text-bone underline underline-offset-2"
          >
            {footer.email}
          </a>
        </p>

        <p className="text-bone/50 font-voice max-w-[38rem] text-caption leading-relaxed">
          {buy.caption}
        </p>
      </div>
    </section>
  );
}
