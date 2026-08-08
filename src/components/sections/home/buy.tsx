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
      <div className="mx-auto flex w-full max-w-[1240px] flex-col items-center gap-7 px-[clamp(1.5rem,5vw,4rem)] text-center">
        <KickerHeader className="text-bone/55">{buy.eyebrow}</KickerHeader>
        <h2 className="tracking-h2 font-voice max-w-[18ch] text-[clamp(1.9rem,2.6vw+1rem,3rem)] leading-tight font-light">
          {buy.title}
        </h2>

        <ul className="grid w-full max-w-[44rem] list-none grid-cols-3 gap-2.5">
          {volumeTiers.map((tier) => (
            <li
              key={tier.volume}
              className="border-bone/40 border px-3 py-4 text-center"
            >
              <span className="font-voice text-bone block text-[clamp(1.5rem,2.4vw,1.95rem)] leading-tight font-light tracking-[-0.03em] tabular-nums">
                {tier.volume}
              </span>
              <span className="font-ui text-bone/60 mt-1.5 block text-[13px] leading-snug">
                {buy.potLabel}
                <br />
                {tier.pot}
              </span>
            </li>
          ))}
        </ul>

        <p className="text-bone/50 font-ui text-[13px]">{buy.note}</p>

        <OzonButton
          href={ozonStoreUrl}
          className="bg-moss text-bone hover:bg-moss/90 px-10 py-6"
        />

        <p className="text-bone/70 font-voice max-w-[38rem] text-[15px] leading-relaxed">
          {buy.riskReversal}{" "}
          <a
            href={`mailto:${footer.email}`}
            className="text-bone underline underline-offset-2"
          >
            {footer.email}
          </a>
        </p>

        <p className="text-bone/50 font-voice max-w-[38rem] text-[13px] leading-relaxed">
          {buy.caption}
        </p>
      </div>
    </section>
  );
}
