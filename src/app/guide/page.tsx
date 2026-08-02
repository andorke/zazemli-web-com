import type { Metadata } from "next";
import Link from "next/link";

import { GuideFlowBar } from "@/components/sections/guide/flow-bar";
import { GuideFork } from "@/components/sections/guide/fork";
import { GuideHero } from "@/components/sections/guide/hero";
import { GuideKit } from "@/components/sections/guide/kit";
import { GuideOzonCta } from "@/components/sections/guide/ozon-cta";
import { GuideRouteStages } from "@/components/sections/guide/route-stages";
import { guideEntry } from "@/content/guide";
import { openGraphFor } from "@/lib/metadata";

/* Meta-content — канон guide.md v4.0 §Meta (= прототип guide.html <title>/<meta>) */
export const metadata: Metadata = {
  title: {
    absolute: "Пересадка растения шаг за шагом · гайд · ЗАЗЕМЛИ",
  },
  description:
    "Как пересадить комнатное растение: подготовка, корни, дренаж, грунт, дневник. Универсальный ритуал для любого растения с боксом ЗАЗЕМЛИ.",
  alternates: { canonical: "/guide" },
  openGraph: openGraphFor("/guide"),
};

/*
 * /guide — вход гайда v4.0: hero → флоу → инвентарь → стадии 00–01 → развилка
 * → Ozon → «На главную». Шаги 02–04 живут на маршрутах: выбрать способ можно
 * только после осмотра кома, поэтому развилка стоит сразу за стадией 01.
 * HowTo здесь нет намеренно — страница не описывает линейный порядок (design 3).
 */
export default function GuidePage() {
  return (
    <main className="flex-1">
      <GuideHero hero={guideEntry.hero} />
      <GuideFlowBar items={guideEntry.flow} />
      <GuideKit kit={guideEntry.kit} />
      <section className="bg-bone text-charcoal pb-[clamp(3.5rem,7vw,6rem)]">
        <div className="mx-auto max-w-[1080px] px-6 sm:px-8 lg:px-16">
          <GuideRouteStages stages={guideEntry.stages} />
          <GuideFork fork={guideEntry.fork} />
        </div>
      </section>
      <GuideOzonCta />
      <div className="bg-bone pb-16 text-center">
        <Link
          href="/"
          className="text-moss-ink font-ui text-small underline decoration-dotted underline-offset-4 transition-opacity hover:opacity-70"
        >
          ← На главную
        </Link>
      </div>
    </main>
  );
}
