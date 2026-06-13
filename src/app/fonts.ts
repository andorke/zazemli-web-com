import localFont from "next/font/local";

/*
 * DS-контракт: ровно 3 семейства (typography.md, решение 27 мая), self-hosted.
 * woff2 получены конвертацией+субсеттингом из ttf (woff2 в ассетах были битые).
 * Недостающие веса (Unbounded 500, Spectral 700) — открытый вопрос Насте:
 * роли Medium временно закрывает 400, bold-роль Spectral — SemiBold 600.
 *
 * preload: Unbounded и Spectral — над фолдом (Hero), preload включён.
 * Caveat нужен только в подписи «О нас» и CaveatNote ниже фолда — preload off,
 * иначе он отнимает полосу у LCP-текста hero (Lighthouse: LCP 4.0s → цель <2.5s).
 */

export const unbounded = localFont({
  src: [
    { path: "../fonts/unbounded-300.woff2", weight: "300", style: "normal" },
    { path: "../fonts/unbounded-400.woff2", weight: "400", style: "normal" },
    { path: "../fonts/unbounded-700.woff2", weight: "700", style: "normal" },
    { path: "../fonts/unbounded-900.woff2", weight: "900", style: "normal" },
  ],
  variable: "--font-unbounded",
  display: "swap",
});

export const spectral = localFont({
  src: [
    { path: "../fonts/spectral-400.woff2", weight: "400", style: "normal" },
    {
      path: "../fonts/spectral-400-italic.woff2",
      weight: "400",
      style: "italic",
    },
    { path: "../fonts/spectral-600.woff2", weight: "600", style: "normal" },
  ],
  variable: "--font-spectral",
  display: "swap",
});

export const caveat = localFont({
  src: [{ path: "../fonts/caveat-400.woff2", weight: "400", style: "normal" }],
  variable: "--font-caveat",
  display: "swap",
  preload: false,
});
