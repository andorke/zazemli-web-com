import Link from "next/link";

import { OzonButton } from "@/components/site/ozon-button";
import { BrandButton } from "@/components/ui/brand-button";
import { KickerHeader } from "@/components/ui/kicker-header";
import { lab } from "@/content/lab";
import { ozonStoreUrl } from "@/content/site";

/* Ozon-финал /lab (прототип .ozon): тёмный блок, eyebrow + H2 + CTA на коллекцию + Ozon */
export function LabOzonCta() {
  const { ozon } = lab;
  return (
    <section className="bg-charcoal text-bone py-[clamp(3.5rem,7vw,6rem)] text-center">
      <div className="mx-auto flex max-w-[1080px] flex-col items-center gap-7 px-6 sm:px-8 lg:px-16">
        <KickerHeader className="text-bone/55">{ozon.eyebrow}</KickerHeader>
        <h2 className="max-w-[26ch] font-voice text-[clamp(1.9rem,2.6vw_+_1rem,3rem)] leading-tight font-light">
          {ozon.title}
        </h2>
        <div className="flex flex-wrap items-center justify-center gap-4">
          <OzonButton
            href={ozonStoreUrl}
            className="bg-moss text-bone hover:bg-moss/90 px-10 py-6"
          />
          <BrandButton asChild className="text-bone">
            <Link href={ozon.collection.href}>{ozon.collection.label}</Link>
          </BrandButton>
        </div>
      </div>
    </section>
  );
}
