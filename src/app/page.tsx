import { PaperCatalog } from "@/components/sections/paper/catalog";
import { HomeFooter, HomeHeader } from "@/components/sections/paper/chrome-content";
import { PaperCookies } from "@/components/sections/paper/cookie";
import { PaperHero } from "@/components/sections/paper/hero";
import { HomeBasis, HomeProperties } from "@/components/sections/paper/home-editorial";
import { PaperStyle } from "@/components/sections/paper/paper-style";
import { JsonLd } from "@/components/site/json-ld";

export default function Home() {
  return (
    <>
      <PaperStyle page="home" />
      <JsonLd data={{ "@context": "https://schema.org", "@type": "WebSite", name: "ЗАЗЕМЛИ", url: "https://zazemli.com/" }} />
      <a className="skip" href="#main">К содержанию</a>
      <HomeHeader />
      <PaperCookies />
      <main id="main">
        <PaperHero />
        <HomeProperties />
        <PaperCatalog />
        <HomeBasis />
      </main>
      <HomeFooter />
    </>
  );
}
