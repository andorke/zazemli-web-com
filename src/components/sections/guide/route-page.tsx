import Link from "next/link";

import { GuideFlowBar } from "@/components/sections/guide/flow-bar";
import { GuideHero } from "@/components/sections/guide/hero";
import { GuideOzonCta } from "@/components/sections/guide/ozon-cta";
import { GuideRouteStages } from "@/components/sections/guide/route-stages";
import type { GuideRouteContent } from "@/content/guide";

/*
 * Сборка страницы маршрута (прототипы guide-perevalka.html · guide-polnaya-zamena.html):
 * hero со ссылкой «Это не мой случай» на соседнюю ветку → флоу → стадии → Ozon →
 * «На главную». Обе ветки собираются одним рендером из своего контента.
 */
export function GuideRoutePage({ route }: { route: GuideRouteContent }) {
  const howToJsonLd = {
    "@context": "https://schema.org",
    "@type": "HowTo",
    name: route.hero.title,
    description: route.hero.sub,
    step: route.stages.map((stage) => ({
      "@type": "HowToStep",
      name: stage.title,
      text: stage.steps.map((step) => step.text).join(" "),
    })),
  };

  return (
    <main className="flex-1">
      {/* JSON-LD в DOM для краулеров; экранируем < по рекомендации Next.js */}
      <script
        type="application/ld+json"
        dangerouslySetInnerHTML={{
          __html: JSON.stringify(howToJsonLd).replace(/</g, "\\u003c"),
        }}
      />
      <GuideHero hero={route.hero}>
        <Link
          href={route.otherRoute.href}
          className="text-moss-ink font-ui text-small inline-block min-h-11 underline decoration-dotted underline-offset-[3px] transition-opacity hover:opacity-70"
        >
          {route.otherRoute.label}
        </Link>
      </GuideHero>
      <GuideFlowBar items={route.flow} />
      <section className="bg-bone text-charcoal pb-[clamp(3.5rem,7vw,6rem)]">
        <div className="mx-auto max-w-[1080px] px-6 sm:px-8 lg:px-16">
          <GuideRouteStages stages={route.stages} />
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
