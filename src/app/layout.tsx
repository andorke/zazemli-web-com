import type { Metadata } from "next";

import { CookieBanner } from "@/components/site/cookie-banner";
import { Metrika } from "@/components/site/metrika";
import { SiteFooter } from "@/components/site/site-footer";
import { SiteHeader } from "@/components/site/site-header";
import { ui, voice } from "./fonts";
import "./globals.css";

/* Meta-content — утверждённая копи: Маркетинг/Каналы/Сайт/home.md v1.1 §Meta-content */
export const metadata: Metadata = {
  metadataBase: new URL("https://zazemli.com"),
  title: {
    default: "ЗАЗЕМЛИ · Бокс на одну пересадку растения",
    template: "%s · ЗАЗЕМЛИ",
  },
  description:
    "Коллекция боксов на одну пересадку. Земля под ваш род растения + всё для ритуала + дневник на год. Цифровому человеку — заземление через ритуал руками.",
  alternates: { canonical: "/" },
  /* max-image-preview:large — крупные превью в выдаче и Discover (seo-research.md ч.1 §1) */
  robots: { index: true, follow: true, "max-image-preview": "large" },
  /*
   * OG без title/description/url: per-page значения Next резолвит из metadata
   * страницы (og:title ← title и т.д.), а общие поля наследуются отсюда.
   * og:image 600×900 — существующий ассет; обложка 1200×630 — вопрос Насте.
   */
  openGraph: {
    type: "website",
    locale: "ru_RU",
    siteName: "ЗАЗЕМЛИ",
    images: [
      {
        url: "/soil-vial.png",
        width: 600,
        height: 900,
        alt: "Колба с образцом грунта ЗАЗЕМЛИ",
      },
    ],
  },
  twitter: { card: "summary" },
};

export default function RootLayout({
  children,
}: Readonly<{
  children: React.ReactNode;
}>) {
  return (
    <html
      lang="ru"
      className={`${voice.variable} ${ui.variable} h-full font-ui antialiased`}
    >
      <body className="flex min-h-full flex-col">
        <SiteHeader />
        {children}
        <SiteFooter />
        <CookieBanner />
        <Metrika />
      </body>
    </html>
  );
}
