import type { Metadata } from "next";
import { LabFooter, ReadingHeader } from "@/components/sections/paper/chrome-content";
import { PaperCookies } from "@/components/sections/paper/cookie";
import { PaperLab } from "@/components/sections/paper/lab";
import { PaperStyle } from "@/components/sections/paper/paper-style";
import { LabGlossary } from "@/components/sections/paper/reading-content";
import { openGraphFor } from "@/lib/metadata";

export const metadata: Metadata = {
  title: "Лаборатория грунта",
  description: "Рецептуры грунтов для семи растений. Готовые смеси, интерактивная раскладка и свойства компонентов.",
  alternates: { canonical: "/lab" },
  openGraph: openGraphFor("/lab"),
};

export default function LabPage() {
  return (
    <>
      <PaperStyle page="lab" />
      <a className="skip" href="#main">К содержанию</a>
      <ReadingHeader section="lab" />
      <PaperCookies />
      <PaperLab glossary={<LabGlossary />} />
      <LabFooter />
    </>
  );
}
