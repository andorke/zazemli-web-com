import type { Metadata } from "next";

import { LabComponentsGrid } from "@/components/sections/lab/components-grid";
import { LabDifferentSoil } from "@/components/sections/lab/different-soil";
import { LabGlance } from "@/components/sections/lab/glance";
import { LabHero } from "@/components/sections/lab/hero";
import { LabOzonCta } from "@/components/sections/lab/ozon-cta";
import { LabProblem } from "@/components/sections/lab/problem";
import { LabRecipesSection } from "@/components/sections/lab/recipes-section";
import { LabSources } from "@/components/sections/lab/sources";
import { openGraphFor } from "@/lib/metadata";

/* Meta-content — прототип lab.html <title>/<meta> (пересборка 2026-07-05) */
export const metadata: Metadata = {
  title: {
    absolute: "Лаборатория грунта · 11 компонентов · ЗАЗЕМЛИ",
  },
  description:
    "Из чего собрана земля под каждое растение: 7 рецептур под биотоп и 11 компонентов, зачем каждый и на какие исследования это опирается.",
  alternates: { canonical: "/lab" },
  openGraph: openGraphFor("/lab"),
};

/*
 * /lab — hero → трио колб → якорь-навигация → проблема → 7 рецептур
 * → 11 компонентов → источники → Ozon (inverted pyramid, design decision 2).
 * Трио колб «Разным растениям — разная земля» переехало с главной (FIX-78):
 * оно ключ к чтению рецептур, поэтому стоит сразу под hero, по прототипу lab.html.
 * Дисклеймер — слот FooterDisclaimer в общем SiteFooter, включается по пути /lab.
 */
export default function LabPage() {
  return (
    <main className="flex-1">
      <LabHero />
      <LabDifferentSoil />
      <LabGlance />
      <LabProblem />
      <LabRecipesSection />
      <LabComponentsGrid />
      <LabSources />
      <LabOzonCta />
    </main>
  );
}
