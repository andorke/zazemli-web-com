import Link from "next/link";

import { OzonButton } from "@/components/site/ozon-button";
import { BrandButton } from "@/components/ui/brand-button";
import { KickerHeader } from "@/components/ui/kicker-header";
import { guideOzon } from "@/content/guide";
import { ozonStoreUrl } from "@/content/site";

/*
 * Ozon-блок гайда (прототип .ozon): тёмный финал, eyebrow + H2 + две CTA.
 * Один и тот же на входе и обеих ветках. Ozon-ссылка — через OzonButton
 * (единая конверсия сайта, UTM+цель Метрики; ozonStoreUrl=null → «Скоро на
 * Ozon»); рядом — ссылка на коллекцию.
 */
export function GuideOzonCta() {
  return (
    <section className="bg-charcoal text-bone py-[clamp(3.5rem,7vw,6rem)] text-center">
      <div className="mx-auto flex max-w-[1080px] flex-col items-center gap-7 px-6 sm:px-8 lg:px-16">
        <KickerHeader className="text-bone/55">{guideOzon.eyebrow}</KickerHeader>
        <h2 className="max-w-[22ch] font-voice text-[clamp(1.9rem,2.6vw_+_1rem,3rem)] font-light leading-tight">
          {guideOzon.title}
        </h2>
        <div className="flex flex-wrap items-center justify-center gap-4">
          <OzonButton
            href={ozonStoreUrl}
            className="bg-moss text-bone hover:bg-moss/90 px-10 py-6"
          />
          <BrandButton asChild className="text-bone">
            <Link href={guideOzon.collection.href}>
              {guideOzon.collection.label}
            </Link>
          </BrandButton>
        </div>
      </div>
    </section>
  );
}
