import type { Metadata } from "next";

import { GuideRoutePage } from "@/components/sections/guide/route-page";
import { guidePolnayaZamena } from "@/content/guide";

/* Meta-content — прототип guide-polnaya-zamena.html <title>/<meta>; noindex+canonical — задача 2.2 */
export const metadata: Metadata = {
  title: {
    absolute: "Полная замена грунта · гайд · ЗАЗЕМЛИ",
  },
  description:
    "Полная замена грунта у комнатного растения: разбор кома, осмотр и обработка корней, посадка в свежую землю. Маршрут гайда ЗАЗЕМЛИ.",
};

/* /guide/polnaya-zamena — маршрут гайда: 01 Продолжение → 02 → 03 → 04 */
export default function GuidePolnayaZamenaPage() {
  return <GuideRoutePage route={guidePolnayaZamena} />;
}
