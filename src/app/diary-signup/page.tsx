import type { Metadata } from "next";
import { DiaryHeader, SimpleFooter } from "@/components/sections/paper/chrome-content";
import { PaperCookies } from "@/components/sections/paper/cookie";
import { DiaryContent } from "@/components/sections/paper/diary-content";
import { PaperStyle } from "@/components/sections/paper/paper-style";
import { openGraphFor } from "@/lib/metadata";

export const metadata: Metadata = {
  title: "Дневник растения",
  description: "Письма к бумажному дневнику о поливе, подкормках и заботе о растении в разные сезоны.",
  alternates: { canonical: "/diary-signup" },
  openGraph: openGraphFor("/diary-signup"),
  robots: { index: false, follow: false },
};

export default function DiarySignupPage() {
  return (
    <>
      <PaperStyle page="diary" />
      <a className="skip" href="#main">К содержанию</a>
      <DiaryHeader />
      <PaperCookies />
      <DiaryContent />
      <SimpleFooter />
    </>
  );
}
