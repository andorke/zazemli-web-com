import { OzonButton } from "@/components/site/ozon-button";
import { KickerHeader } from "@/components/ui/kicker-header";
import { home } from "@/content/home";
import { ozonStoreUrl } from "@/content/site";

/* Ozon-CTA по прототипу: тёмный финальный блок, центр — eyebrow, цена-заголовок, кнопка, подпись */
export function OzonCta() {
  const { ozonCta } = home;
  return (
    <section className="bg-charcoal text-bone flex flex-col items-center gap-7 px-6 py-24 text-center lg:py-32">
      <KickerHeader className="text-bone/55">{ozonCta.eyebrow}</KickerHeader>
      <h2 className="max-w-[18ch] font-voice text-[clamp(1.9rem,2.6vw+1rem,3rem)] font-light leading-tight">
        {ozonCta.title}
      </h2>
      <OzonButton
        href={ozonStoreUrl}
        className="bg-moss text-bone hover:bg-moss/90 px-10 py-6"
      />
      <p className="text-bone/60 max-w-[38rem] font-voice text-[15px] leading-relaxed">
        {ozonCta.caption}
      </p>
    </section>
  );
}
