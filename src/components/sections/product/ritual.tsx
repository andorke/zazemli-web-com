import Link from "next/link";

import { KickerHeader } from "@/components/ui/kicker-header";
import { RitualNote } from "@/components/ui/ritual-note";
import { productPage, ritualLine, type Sku } from "@/content/sku";

/*
 * «Ритуал» по прототипу collectio (блок 7): центрированная секция — eyebrow,
 * постоянная ритуал-строка, характерная приписка SKU (RitualNote, атом DS) и
 * мост на гайд пересадки. Приписка — SKU-цвет (var(--sku), design-решение 6),
 * переопределяет moss-ink атома через inline style; eyebrow и мост остаются
 * на moss-ink (бренд-акцент).
 */
export function Ritual({ sku }: { sku: Sku }) {
  return (
    <section className="bg-chalk text-charcoal px-6 py-20 text-center lg:px-30 lg:py-28">
      <div className="mx-auto flex max-w-[40rem] flex-col items-center gap-4">
        <KickerHeader className="text-moss-ink">
          {productPage.ritualEyebrow}
        </KickerHeader>
        <p className="text-charcoal mt-2 max-w-[34rem] font-voice text-[clamp(1.15rem,1vw+0.85rem,1.45rem)] leading-normal font-light">
          {ritualLine}
        </p>
        <RitualNote
          className="text-[clamp(1.5rem,1vw+1rem,1.7rem)]"
          style={{ color: "var(--sku)" }}
        >
          {sku.ritualPhrase}
        </RitualNote>
        <p className="mt-4 font-ui text-[13px]">
          <Link href="/guide" className="text-moss-ink no-underline">
            {productPage.guideBridge}
          </Link>
        </p>
      </div>
    </section>
  );
}
