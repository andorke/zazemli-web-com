import type { Metadata } from "next";
import { GuideRoutePage } from "@/components/sections/guide/route-page";
import { GuideFooter, ReadingHeader } from "@/components/sections/paper/chrome-content";
import { PaperCookies } from "@/components/sections/paper/cookie";
import { PaperStyle } from "@/components/sections/paper/paper-style";
import { guidePerevalka } from "@/content/guide";
import { openGraphFor } from "@/lib/metadata";
import { ui, voice } from "../../fonts";
import "../../globals.css";

export const metadata: Metadata = {
  title: { absolute: "Перевалка растения · гайд · ЗАЗЕМЛИ" },
  description: "Перевалка комнатного растения: ком не разбираем, обновляем землю вокруг и сверху. Маршрут гайда ЗАЗЕМЛИ.",
  alternates: { canonical: "/guide/perevalka" },
  openGraph: openGraphFor("/guide/perevalka"),
  robots: { index: false, follow: true },
};

export default function GuidePerevalkaPage() {
  return (
    <>
      <PaperStyle page="guide" />
      <a className="skip" href="#main">К содержанию</a>
      <ReadingHeader section="guide" />
      <PaperCookies />
      <div className={`${voice.variable} ${ui.variable} font-ui`}>
        <GuideRoutePage route={guidePerevalka} />
      </div>
      <GuideFooter />
    </>
  );
}
