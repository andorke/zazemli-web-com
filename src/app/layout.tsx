import type { Metadata } from "next";

import { CookieBanner } from "@/components/site/cookie-banner";
import { Metrika } from "@/components/site/metrika";
import { SiteFooter } from "@/components/site/site-footer";
import { SiteHeader } from "@/components/site/site-header";
import { caveat, spectral, unbounded } from "./fonts";
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
};

export default function RootLayout({
  children,
}: Readonly<{
  children: React.ReactNode;
}>) {
  return (
    <html
      lang="ru"
      className={`${unbounded.variable} ${spectral.variable} ${caveat.variable} h-full font-sans antialiased`}
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
