/*
 * Сквозной контент сайта: навигация, футер, Ozon.
 * Источники: prototypes/landing.html (topbar, footer), BUILD-SPEC
 * («Коллекция» — якорь главной; /collectio-индекс заменит редирект
 * в change product-pages). /diary-signup намеренно отсутствует в
 * навигации — вход только по QR из дневника.
 */

export type NavItem = { label: string; href: string };

export const mainNav: NavItem[] = [
  { label: "Коллекция", href: "/#collectio" },
  { label: "Лаборатория", href: "/lab" },
  { label: "Гайд", href: "/guide" },
];

export type FooterInfo = {
  /* Реквизиты ИП — точные значения пришлёт Настя (Реквизиты_ИП_Минетто.pdf в БЗ) */
  legalName: string;
  ogrnip: string | null;
  /* Хвост legal-строки после реквизитов (прототип landing.html .legal) */
  legalTail: string;
  tagline: string;
  /*
   * Глобально дисклеймер не рендерится (решение ds-migration): остаётся
   * для /lab (change guide-lab). «Весь сайт vs /lab» — открытый вопрос Насте.
   */
  disclaimer: string;
  email: string;
  socialHandle: string;
  instagramUrl: string;
  telegramUrl: string;
};

export const footer: FooterInfo = {
  legalName: "ИП Минетто",
  ogrnip: null,
  legalTail:
    "работаем по УСН. © 2026 ЗАЗЕМЛИ. Информация на сайте не является публичной офертой.",
  tagline: "Земля и забота — всё, что нужно.",
  disclaimer:
    "Растения — не лекарство. Мы опираемся на исследования о связи контакта с природой и самочувствия, но не обещаем терапевтического эффекта.",
  email: "team@zazemli.com",
  socialHandle: "@zazemli_collectio",
  instagramUrl: "https://instagram.com/zazemli_collectio",
  telegramUrl: "https://t.me/zazemli_collectio",
};

/* URL магазина Ozon неизвестен (вопрос Насте, бриф §9.4). null → кнопки «Скоро на Ozon» */
export const ozonStoreUrl: string | null = null;
