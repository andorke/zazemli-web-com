/* eslint-disable @next/next/no-css-tags -- Каждый HTML-вход загружает каскад своей страницы. */
export function PaperStyle({
  page,
}: {
  page: "home" | "lab" | "guide" | "diary" | "privacy" | "terms" | "missing";
}) {
  return (
    <>
      <link
        rel="stylesheet"
        href={`/warm-paper/styles/${page}.css${page === "home" ? "?v=3" : ""}`}
        precedence="paper"
      />
      <link
        rel="stylesheet"
        href="/warm-paper/styles/launch.css?v=3"
        precedence="paper-launch"
      />
    </>
  );
}
