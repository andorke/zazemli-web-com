import type { Metadata } from "next";
import Link from "next/link";

import { GuideGlance } from "@/components/sections/guide/glance";
import { GuideHero } from "@/components/sections/guide/hero";
import { GuideOzonCta } from "@/components/sections/guide/ozon-cta";
import { GuideStages } from "@/components/sections/guide/stages";
import { guide } from "@/content/guide";

/* Meta-content — канон guide.md v3.0 §Meta (= прототип guide.html <title>/<meta>) */
export const metadata: Metadata = {
  title: {
    absolute: "Пересадка растения за пять шагов · гайд · ЗАЗЕМЛИ",
  },
  description:
    "Как пересадить комнатное растение: подготовка, корни, дренаж, грунт, забота. Универсальный ритуал для любого растения с боксом ЗАЗЕМЛИ.",
  alternates: { canonical: "/guide" },
};

/* Schema.org HowTo — 5 шагов = 5 CJM-стадий, строится из guide.stages (design decision 4) */
const howToJsonLd = {
  "@context": "https://schema.org",
  "@type": "HowTo",
  name: guide.hero.title,
  description: guide.hero.sub,
  step: guide.stages.map((stage) => ({
    "@type": "HowToStep",
    name: stage.title,
    text: stage.steps.map((s) => s.text).join(" "),
  })),
};

/* /guide — hero → тиры → 5 стадий CJM → Ozon → «На главную» (прототип guide.html) */
export default function GuidePage() {
  return (
    <main className="flex-1">
      {/* JSON-LD в DOM для краулеров; экранируем < по рекомендации Next.js */}
      <script
        type="application/ld+json"
        dangerouslySetInnerHTML={{
          __html: JSON.stringify(howToJsonLd).replace(/</g, "\\u003c"),
        }}
      />
      <GuideHero />
      <GuideGlance />
      <GuideStages />
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
