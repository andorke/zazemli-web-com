import type { Metadata } from "next";
import { GuideFooter, ReadingHeader } from "@/components/sections/paper/chrome-content";
import { PaperCookies } from "@/components/sections/paper/cookie";
import { PaperStyle } from "@/components/sections/paper/paper-style";
import { GuideContent } from "@/components/sections/paper/reading-content";
import { JsonLd } from "@/components/site/json-ld";
import steps from "@/content/paper/guide-steps.json";
import { openGraphFor } from "@/lib/metadata";

const title = "Как пересадить растение с полной заменой грунта";
const description = "Как пересадить комнатное растение с полной заменой грунта: подготовка горшка, осмотр корней, посадка и первый полив.";

export const metadata: Metadata = {
  title, description,
  alternates: { canonical: "/guide" },
  openGraph: openGraphFor("/guide"),
};

export default function GuidePage() {
  return (
    <>
      <PaperStyle page="guide" />
      <JsonLd data={{
        "@context": "https://schema.org", "@type": "HowTo", name: title, description,
        step: steps.map(step => ({ "@type": "HowToStep", name: step.name, text: step.text, url: `https://zazemli.com/guide#${step.id}` })),
      }} />
      <a className="skip" href="#main">К содержанию</a>
      <ReadingHeader section="guide" />
      <PaperCookies />
      <GuideContent />
      <GuideFooter />
    </>
  );
}
