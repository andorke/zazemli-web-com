import type { Metadata } from "next";

import { CookieBanner } from "@/components/site/cookie-banner";
import { OrganizationJsonLd } from "@/components/site/json-ld";
import { Metrika } from "@/components/site/metrika";
import { SiteFooter } from "@/components/site/site-footer";
import { SiteHeader } from "@/components/site/site-header";
import { openGraphFor } from "@/lib/metadata";
import { welcomeGateScript } from "@/lib/welcome-gate";
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
   * OG без title/description: per-page значения Next резолвит из metadata
   * страницы (og:title ← title и т.д.). Остальное — общий блок openGraphFor,
   * его же вызывает каждая страница со своим canonical (см. lib/metadata.ts).
   */
  openGraph: openGraphFor("/"),
  twitter: { card: "summary_large_image" },
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
      <head>
        {/* Show-once гейт встречи: класс на <html> до первой отрисовки (D1) */}
        <script dangerouslySetInnerHTML={{ __html: welcomeGateScript }} />
        {/* Один Organization на весь сайт — отсюда он попадает на каждую страницу */}
        <OrganizationJsonLd />
      </head>
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
