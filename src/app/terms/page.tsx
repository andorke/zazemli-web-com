import type { Metadata } from "next";
import { CookieSettings, PaperCookies } from "@/components/sections/paper/cookie";
import { TermsContent } from "@/components/sections/paper/legal-content";
import { PaperStyle } from "@/components/sections/paper/paper-style";
import { openGraphFor } from "@/lib/metadata";

export const metadata: Metadata = {
  title: "Условия использования сайта",
  description: "Условия использования сайта zazemli.com: статус документа, интеллектуальная собственность, ограничения, ответственность. ИП Минетто А. А.",
  alternates: { canonical: "/terms" },
  robots: { index: true, follow: true },
  openGraph: openGraphFor("/terms"),
};

export default function TermsPage() {
  return (
    <>
      <PaperStyle page="terms" />
      <PaperCookies />
      <a className="skip" href="#main">К основному содержанию</a>
      <TermsContent />
      <CookieSettings />
    </>
  );
}
