/*
 * Контент главной. Источник истины — Figma node 185:2 «Screen / Landing · PHASE 8 · v2»
 * (бриф §5, §6). Тексты — дословно из текстовых нод фрейма.
 * Порядок секций = порядок детей фрейма 185:2.
 */

export type HomeContent = {
  hero: {
    kicker: string;
    title: string[];
    sub: string;
    cta: { label: string; href: string };
    plate: string;
  };
  whatsInBox: {
    kicker: string;
    title: string[];
    link: { label: string; href: string };
    items: { n: string; text: string }[];
  };
  differentSoil: {
    kicker: string;
    body: string;
    vials: { caption: string }[];
  };
  whatSoilGives: {
    kicker: string;
    columns: { label: string; text: string[] }[];
    closing: string;
    photoSlot: string;
  };
  skuGallery: {
    kicker: string;
    decorative: string;
    link: { label: string; href: string };
  };
  statement: {
    kicker: string;
    quote: string;
  };
  about: {
    quote: string[];
    body: string;
    signature: string;
  };
  teasers: {
    kicker: string;
    meta: string;
    title: string;
    body: string;
    link: { label: string; href: string };
  }[];
  ozonCta: {
    text: string;
    caption: string;
  };
};

export const home: HomeContent = {
  hero: {
    kicker: "БОКС ДЛЯ ПЕРЕСАДКИ РАСТЕНИЯ",
    title: ["Заземли растение.", "Заземли себя."],
    sub: "Бокс на одну пересадку — земля под твоё растение и всё для ритуала.",
    cta: { label: "Выбрать бокс →", href: "/collectio" },
    plate: "ЗАЗЕМЛИ · ПАРТИЯ 0",
  },
  whatsInBox: {
    kicker: "I · В КАЖДОМ БОКСЕ",
    title: ["Один бокс —", "одна пересадка"],
    link: { label: "Выбрать бокс →", href: "/collectio" },
    items: [
      { n: "01", text: "Земля — 8–11 компонентов под твоё растение" },
      { n: "02", text: "Дренаж — керамзит" },
      { n: "03", text: "Корневин — для поддержки корней" },
      { n: "04", text: "Перчатки — для заботы о руках" },
      { n: "05", text: "Дневник — с подсказками на год" },
    ],
  },
  differentSoil: {
    kicker: "II · РАЗНЫМ РАСТЕНИЯМ — РАЗНАЯ ЗЕМЛЯ",
    body: "Один грунт «для всех» не подходит никому. Мы собираем землю под то, как растение живёт в природе, и сверяем каждый состав с исследованиями.",
    // тройка-контраст из soil-vials-spec.md: антуриум / фикус / замиокулькас
    vials: [
      { caption: "антуриум" },
      { caption: "фикус" },
      { caption: "замиокулькас" },
    ],
  },
  whatSoilGives: {
    kicker: "III · ЧТО ДАЁТ ЭТА ЗЕМЛЯ",
    columns: [
      {
        label: "Растению",
        text: ["Дом, похожий на родной.", "Растёт, а не выживает."],
      },
      {
        label: "Тебе",
        text: ["Прощает перелив.", "Уход без угадываний."],
      },
    ],
    closing: "Честный состав, без обещаний чудес.",
    photoSlot: "фото · компоненты земли",
  },
  skuGallery: {
    kicker: "IV · КОЛЛЕКЦИЯ · СЕМЬ НОМЕРОВ",
    decorative: "7",
    link: { label: "Открыть коллекцию →", href: "/collectio" },
  },
  statement: {
    kicker: "ИЗ ЗАПИСЕЙ",
    quote: "Выращивай и создавай простое",
  },
  about: {
    quote: ["«Чем больше цифры —", "тем важнее земля.»"],
    body: "Восемь лет я работала с цифровыми продуктами — а восстанавливаться научилась в простом и материальном: заботе о растениях. Дома их больше тридцати, и под каждое я собрала свою землю — системно и по науке. Так появился ЗАЗЕМЛИ.",
    signature: "— Настя, основательница",
  },
  teasers: [
    {
      kicker: "ГАЙД",
      meta: "5 ШАГОВ · 15 МИНУТ",
      title: "Гайд",
      body: "Пересадка — ритуал, и он проще, чем кажется. Покажем по шагам, как пройти его с нашим боксом — от дренажа до первой записи в дневнике.",
      link: { label: "Открыть гайд →", href: "/guide" },
    },
    {
      kicker: "ЛАБОРАТОРИЯ",
      meta: "11 КОМПОНЕНТОВ · 7 РЕЦЕПТОВ",
      title: "Лаборатория",
      body: "Одиннадцать компонентов, семь рецептов. Почему у каждого растения своя земля — показываем в лаборатории.",
      link: { label: "В лабораторию →", href: "/lab" },
    },
  ],
  ozonCta: {
    text: "Семь растений, три размера. От 1 890 ₽.",
    caption: "Переходишь на Ozon — оформление заказа там",
  },
};
