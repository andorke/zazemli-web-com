import type { Metadata } from "next";

import { GuideRoutePage } from "@/components/sections/guide/route-page";
import { guidePerevalka } from "@/content/guide";

/* Meta-content — прототип guide-perevalka.html <title>/<meta>; noindex+canonical — задача 2.2 */
export const metadata: Metadata = {
  title: {
    absolute: "Перевалка растения · гайд · ЗАЗЕМЛИ",
  },
  description:
    "Перевалка комнатного растения: ком не разбираем, обновляем землю вокруг и сверху. Маршрут гайда ЗАЗЕМЛИ.",
};

/* /guide/perevalka — маршрут гайда: 02 Дренаж → 03 Грунт и посадка → 04 Дневник */
export default function GuidePerevalkaPage() {
  return <GuideRoutePage route={guidePerevalka} />;
}
