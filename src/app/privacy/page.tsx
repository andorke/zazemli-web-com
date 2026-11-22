import type { Metadata } from "next";
import { CookieSettings, PaperCookies } from "@/components/sections/paper/cookie";
import { PrivacyContent } from "@/components/sections/paper/legal-content";
import { PaperStyle } from "@/components/sections/paper/paper-style";
import { openGraphFor } from "@/lib/metadata";

export const metadata: Metadata = {
  title: "Политика конфиденциальности",
  description: "Политика в отношении обработки персональных данных на сайте zazemli.com. Оператор — ИП Минетто А. А.",
  alternates: { canonical: "/privacy" },
  robots: { index: true, follow: true },
  openGraph: openGraphFor("/privacy"),
};

export default function PrivacyPage() {
  return (
    <>
      <PaperStyle page="privacy" />
      <PaperCookies />
      <a className="skip" href="#main">К основному содержанию</a>
      <PrivacyContent />
      <CookieSettings />
    </>
  );
}
