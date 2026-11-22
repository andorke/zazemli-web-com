import type { Metadata } from "next";
import { OrganizationJsonLd } from "@/components/site/json-ld";
import { Metrika } from "@/components/site/metrika";
import { openGraphFor } from "@/lib/metadata";
import { firstPaperFrame } from "@/components/sections/paper/first-frame";

export const metadata: Metadata = {
  metadataBase: new URL("https://zazemli.com"),
  title: { default: "Авторский грунт под твои растения · ЗАЗЕМЛИ", template: "%s · ЗАЗЕМЛИ" },
  description: "Авторский грунт под комнатные растения и боксы для пересадки. Выбери растение, узнай состав смеси и подбери комплект.",
  alternates: { canonical: "/" },
  robots: { index: true, follow: true, "max-image-preview": "large" },
  openGraph: openGraphFor("/"),
  twitter: { card: "summary_large_image" },
};

export default function RootLayout({ children }: { children: React.ReactNode }) {
  return (
    <html lang="ru" data-flow="direct" data-chooser="paths" data-studio="paper" data-fill="joined" suppressHydrationWarning>
      <head>
        <script dangerouslySetInnerHTML={{ __html: firstPaperFrame }} />
        <OrganizationJsonLd />
      </head>
      <body>{children}<Metrika /></body>
    </html>
  );
}
