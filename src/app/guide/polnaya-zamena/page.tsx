import type { Metadata } from "next";

import { GuideRoutePage } from "@/components/sections/guide/route-page";
import { guidePolnayaZamena } from "@/content/guide";

/* Meta-content — прототип guide-polnaya-zamena.html <title>/<meta>.
   Ветка вне индекса, canonical на вход: шаги «Дренаж» и «Дневник» дословно
   совпадают со второй веткой и без этого каннибализировали бы /guide. */
export const metadata: Metadata = {
  title: {
    absolute: "Полная замена грунта · гайд · ЗАЗЕМЛИ",
  },
  description:
    "Полная замена грунта у комнатного растения: разбор кома, осмотр и обработка корней, посадка в свежую землю. Маршрут гайда ЗАЗЕМЛИ.",
  alternates: { canonical: "/guide" },
  robots: { index: false, follow: true },
};

/* /guide/polnaya-zamena — маршрут гайда: 01 Продолжение → 02 → 03 → 04 */
export default function GuidePolnayaZamenaPage() {
  return <GuideRoutePage route={guidePolnayaZamena} />;
}
