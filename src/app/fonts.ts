import localFont from "next/font/local";

/*
 * DS-контракт: ровно 3 семейства (typography.md, решение 27 мая), self-hosted.
 * В ассетах фаундера woff2 битые (39 байт), рабочие файлы — ttf.
 * Недостающие веса (Unbounded 500, Spectral 700) — открытый вопрос Насте:
 * роли Medium временно закрывает 400, bold-роль Spectral — SemiBold 600.
 */

export const unbounded = localFont({
  src: [
    { path: "../fonts/unbounded-300.ttf", weight: "300", style: "normal" },
    { path: "../fonts/unbounded-400.ttf", weight: "400", style: "normal" },
    { path: "../fonts/unbounded-700.ttf", weight: "700", style: "normal" },
    { path: "../fonts/unbounded-900.ttf", weight: "900", style: "normal" },
  ],
  variable: "--font-unbounded",
  display: "swap",
});

export const spectral = localFont({
  src: [
    { path: "../fonts/spectral-400.ttf", weight: "400", style: "normal" },
    {
      path: "../fonts/spectral-400-italic.ttf",
      weight: "400",
      style: "italic",
    },
    { path: "../fonts/spectral-600.ttf", weight: "600", style: "normal" },
  ],
  variable: "--font-spectral",
  display: "swap",
});

export const caveat = localFont({
  src: [{ path: "../fonts/caveat-400.ttf", weight: "400", style: "normal" }],
  variable: "--font-caveat",
  display: "swap",
});
