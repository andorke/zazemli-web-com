import localFont from "next/font/local";

/*
 * DS-контракт v1.1.0 (typography.md v2.0): ровно 2 семейства, self-hosted,
 * variable woff2 (оси сохранены субсеттингом: кириллица+латиница+пунктуация).
 * Имена переменных — по ролям (--font-voice / --font-ui), а не по семействам:
 * роли переживут смену гарнитуры.
 *
 * ВРЕМЕННЫЙ ДУБЛЁР: voice-роль закрывает Literata (opsz 7–72, wght 300–600),
 * а не Newsreader из typography.md — у Newsreader v1.003 нет кириллицы вообще
 * (проверено: Google Fonts и upstream Production Type, 2026-07-05). Финальное
 * voice-семейство — решение Насти; замена = замена woff2 + weight-диапазона.
 */

export const voice = localFont({
  src: [
    {
      path: "../fonts/literata-var.woff2",
      weight: "300 600",
      style: "normal",
    },
    {
      path: "../fonts/literata-var-italic.woff2",
      weight: "300 600",
      style: "italic",
    },
  ],
  variable: "--font-voice",
  display: "swap",
  /*
   * Preload обоих voice-файлов (~390 КБ) — осознанно. Замер LH mobile на
   * static export (2026-07-06): с preload perf 0.75 / FCP 1.4s / LCP 8.8s,
   * с preload:false — 0.67 / 3.6s / 9.2s (поздний swap бьёт сильнее).
   * Узкое место мобильного LCP — не шрифты (soil-vial.png 266 КБ + JS),
   * секция и ассет уходят в landing-redesign. Desktop: 0.93, LCP 1.8s.
   */
});

export const ui = localFont({
  src: [
    {
      path: "../fonts/commissioner-var.woff2",
      weight: "400 500",
      style: "normal",
    },
  ],
  variable: "--font-ui",
  display: "swap",
});
