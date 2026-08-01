import localFont from "next/font/local";

/*
 * DS-контракт (typography.md v3.0 + PATCH-1 §1): ровно 2 семейства,
 * self-hosted, variable woff2 (ось wght сохранена субсеттингом:
 * кириллица+латиница+пунктуация). Имена переменных — по ролям
 * (--font-voice / --font-ui), а не по семействам: роли переживут смену
 * гарнитуры.
 *
 * Voice-роль — Mulish (wght 300–600 roman, 300–400 italic), финальное
 * семейство по решению Насти 30.07. Fallback гротесковый: сериф (Georgia)
 * после смены породы давал бы скачок метрик при swap.
 */

export const voice = localFont({
  src: [
    {
      path: "../fonts/mulish-var.woff2",
      weight: "300 600",
      style: "normal",
    },
    {
      path: "../fonts/mulish-var-italic.woff2",
      weight: "300 400",
      style: "italic",
    },
  ],
  variable: "--font-voice",
  display: "swap",
  fallback: ["Helvetica Neue", "Arial", "sans-serif"],
  /*
   * Preload обоих voice-файлов (~56 КБ) — осознанно. Замер LH mobile на
   * static export (2026-07-06, тогда voice-роль весила ~390 КБ): с preload
   * perf 0.75 / FCP 1.4s / LCP 8.8s, с preload:false — 0.67 / 3.6s / 9.2s
   * (поздний swap бьёт сильнее).
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
