/*
 * Сквозной контент сайта: навигация, футер, Ozon.
 * Источники: HANDOFF-бриф §2 (меню без «Дневник»), §8 (футер: юр-инфо, дисклеймер,
 * соцсети текстом, QR без diary), site-brief §4.2 (контакты).
 * /diary-signup намеренно отсутствует в навигации — вход только по QR из дневника.
 */

export type NavItem = { label: string; href: string };

export const mainNav: NavItem[] = [
  { label: "Коллекция", href: "/collectio" },
  { label: "Лаборатория", href: "/lab" },
  { label: "Гайд", href: "/guide" },
];

export type QrLink = { label: string; href: string; svg: string };

export type FooterInfo = {
  /* Реквизиты ИП — точные значения пришлёт Настя (Реквизиты_ИП_Минетто.pdf в БЗ) */
  legalName: string;
  ogrnip: string | null;
  disclaimer: string;
  email: string;
  socialHandle: string;
  instagramUrl: string;
  telegramUrl: string;
  qr: QrLink[];
};

export const footer: FooterInfo = {
  legalName: "ИП Минетто",
  ogrnip: null,
  disclaimer:
    "Растения — не лекарство. Мы опираемся на исследования о связи контакта с природой и самочувствия, но не обещаем терапевтического эффекта.",
  email: "team@zazemli.com",
  socialHandle: "@zazemli_collectio",
  instagramUrl: "https://instagram.com/zazemli_collectio",
  telegramUrl: "https://t.me/zazemli_collectio",
  qr: [
    {
      label: "Коллекция",
      href: "/collectio",
      svg: "/qr/qr-zazemli-collectio.svg",
    },
    { label: "Лаборатория", href: "/lab", svg: "/qr/qr-zazemli-lab.svg" },
    { label: "Гайд", href: "/guide", svg: "/qr/qr-zazemli-guide.svg" },
    {
      label: "Instagram",
      href: "https://instagram.com/zazemli_collectio",
      svg: "/qr/qr-zazemli-instagram.svg",
    },
  ],
};

/* URL магазина Ozon неизвестен (вопрос Насте, бриф §9.4). null → кнопки «Скоро на Ozon» */
export const ozonStoreUrl: string | null = null;
