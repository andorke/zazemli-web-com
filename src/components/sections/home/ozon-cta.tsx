import { OzonButton } from "@/components/site/ozon-button";
import { home } from "@/content/home";
import { ozonStoreUrl } from "@/content/site";

/* Ozon CTA 185:194 — bone, центр: строка-цена + кнопка Ozon + подпись про переход */
export function OzonCta() {
  const { ozonCta } = home;
  return (
    <section className="bg-bone text-charcoal flex flex-col items-center gap-7 px-6 py-32 text-center">
      <p className="text-charcoal/65 font-voice text-[19px] italic">
        {ozonCta.text}
      </p>
      <OzonButton href={ozonStoreUrl} className="px-11 py-5" />
      <p className="text-charcoal/50 font-voice text-[12.5px]">
        {ozonCta.caption}
      </p>
    </section>
  );
}
