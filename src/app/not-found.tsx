import { MissingHeader, SimpleFooter } from "@/components/sections/paper/chrome-content";
import { PaperCookies } from "@/components/sections/paper/cookie";
import { PaperStyle } from "@/components/sections/paper/paper-style";
import { MissingContent } from "@/components/sections/paper/reading-content";

export default function NotFound() {
  return (
    <>
      <title>Страница не нашлась · ЗАЗЕМЛИ</title>
      <PaperStyle page="missing" />
      <a className="skip" href="#main">К содержанию</a>
      <MissingHeader />
      <PaperCookies />
      <MissingContent />
      <SimpleFooter />
    </>
  );
}
