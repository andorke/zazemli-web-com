import type { Metadata } from "next";

import { GuideRoutePage } from "@/components/sections/guide/route-page";
import { guidePerevalka } from "@/content/guide";
import { openGraphFor } from "@/lib/metadata";

/* Meta-content — прототип guide-perevalka.html <title>/<meta>.
   Ветка вне индекса, canonical на вход: шаги «Дренаж» и «Дневник» дословно
   совпадают со второй веткой и без этого каннибализировали бы /guide. */
export const metadata: Metadata = {
  title: {
    absolute: "Перевалка растения · гайд · ЗАЗЕМЛИ",
  },
  description:
    "Перевалка комнатного растения: ком не разбираем, обновляем землю вокруг и сверху. Маршрут гайда ЗАЗЕМЛИ.",
  alternates: { canonical: "/guide" },
  openGraph: openGraphFor("/guide"),
  robots: { index: false, follow: true },
};

/* /guide/perevalka — маршрут гайда: 02 Дренаж → 03 Грунт и посадка → 04 Дневник */
export default function GuidePerevalkaPage() {
  return <GuideRoutePage route={guidePerevalka} />;
}
