/*
 * Контент главной. Источники: канон-копи ../zazemli-vault/Маркетинг/Каналы/Сайт/home.md v2.1
 * (тексты дословно) + HTML-прототип ../zazemli-vault/Айти/Сайт/prototypes/landing.html
 * (порядок блоков; тексты блоков, отсутствующих в каноне: «Как это работает», баннер,
 * манифест-split, подписи). Чек-таблица расхождений — вопросы Насте в CONTEXT.md.
 * Порядок секций = порядок блоков прототипа.
 */

import type { VialSegments } from "@/components/ui/soil-vial";

export type HomeContent = {
  hero: {
    eyebrow: string;
    title: string[];
    sub: string;
    cta: { label: string; href: string };
    price: string;
    photoSlot: string;
  };
  manifesto: {
    line: string[];
    split: { label: string; text: string }[];
  };
  howItWorks: {
    eyebrow: string;
    title: string;
    lead: string;
    steps: { n: string; title: string; text: string }[];
  };
  skuGallery: {
    eyebrow: string;
    title: string;
    lead: string;
    cardCta: string;
    invite: { number: string; question: string; note: string };
    cta: { label: string; href: string };
  };
  differentSoil: {
    eyebrow: string;
    title: string;
    body: string;
    bridge: { label: string; href: string };
    vials: { skuSlug: string; segments: VialSegments }[];
    legend: { key: keyof VialSegments; label: string }[];
  };
  whatsInBox: {
    eyebrow: string;
    title: string;
    items: { n: string; text: string }[];
    after: string;
    photoSlot: string;
  };
  photoBand: { caption: string };
  whatSoilGives: {
    columns: { label: string; text: string }[];
  };
  about: {
    eyebrow: string;
    paragraphs: string[];
    signature: string;
  };
  teasers: {
    eyebrow: string;
    title: string;
    body: string;
    link: { label: string; href: string } | null;
    note?: string;
  }[];
  ozonCta: {
    eyebrow: string;
    title: string;
    caption: string;
  };
};

export const home: HomeContent = {
  hero: {
    eyebrow: "Бокс для пересадки растения",
    title: ["Заземли растение.", "Заземли себя."],
    sub: "Субстрат, повторяющий природную почву твоего растения, и всё для ритуала пересадки — в одной коробке.",
    cta: { label: "К коллекции →", href: "#collectio" },
    price: "семь растений · три объёма · от 1\u00A0890 ₽",
    photoSlot: "атмосферное фото · мох · камень · вода",
  },
  manifesto: {
    line: ["Пересадка — не дело из списка.", "Это пауза."],
    split: [
      {
        label: "Для растения",
        text: "Земля, собранная под то, как оно живёт в природе: корни дышат, влага и питание держатся ровно.",
      },
      {
        label: "Для тебя",
        text: "Всё для одной пересадки — дренаж, корневин, перчатки, дневник. Ничего не докупать. Земля и забота — всё, что нужно.",
      },
    ],
  },
  howItWorks: {
    eyebrow: "Как это работает",
    title: "Три шага — и растение в новой земле.",
    lead: "Без угадывания: бокс собран под конкретное растение, а гайд и дневник ведут дальше.",
    steps: [
      {
        n: "01",
        title: "Выбираешь растение",
        text: "Собираем бокс под него — грунт по его природной почве.",
      },
      {
        n: "02",
        title: "Пересаживаешь по гайду",
        text: "Дренаж, грунт, корневин, перчатки — всё в коробке, по шагам.",
      },
      {
        n: "03",
        title: "Ведёшь дневник",
        text: "Подскажет уход по сезонам — полив, подкормка, рост.",
      },
    ],
  },
  skuGallery: {
    eyebrow: "Collectio Zazemli · Партия 0",
    title: "Семь растений — семь рецептов земли.",
    lead: "Не «универсальный грунт», а семь характеров земли — от воздушной, как на дереве, до почти песка. У каждого — свой состав и свои размеры.",
    cardCta: "Открыть →",
    invite: {
      number: "N° 08 — ?",
      question: "Твоего растения нет в коллекции?",
      note: "Подскажи какое — соберём в следующей партии.",
    },
    cta: { label: "Вся коллекция →", href: "/collectio" },
  },
  differentSoil: {
    eyebrow: "Состав",
    title: "Разным растениям — разная земля.",
    body: "Один грунт «для всех» не подходит никому. Мы собираем землю под то, как растение живёт в природе, — и сверяем каждый состав с исследованиями.",
    bridge: { label: "почему именно так →", href: "/lab" },
    // канон блок 5: тройка-контраст, доли % по 4 группам (основа · воздух · влага · дренаж)
    vials: [
      {
        skuSlug: "anthurium",
        segments: { base: 35, air: 20, moisture: 35, drainage: 10 },
      },
      {
        skuSlug: "ficus",
        segments: { base: 60, air: 10, moisture: 20, drainage: 10 },
      },
      {
        skuSlug: "zamioculcas",
        segments: { base: 55, air: 0, moisture: 20, drainage: 25 },
      },
    ],
    legend: [
      { key: "base", label: "основа" },
      { key: "air", label: "воздух" },
      { key: "moisture", label: "влага" },
      { key: "drainage", label: "дренаж" },
    ],
  },
  whatsInBox: {
    eyebrow: "Что в боксе",
    title: "Всё на одну пересадку.",
    // опись — канон блок 4 дословно (5 позиций; прототип даёт 6 — вопрос Насте)
    items: [
      { n: "01", text: "Грунт, собранный под твоё растение" },
      { n: "02", text: "Керамзитовый дренаж, 10–20 мм" },
      {
        n: "03",
        text: "Конвертик «Забота о корнях и твоих руках»: перчатки, корневин, 2 апельсиновые палочки",
      },
      { n: "04", text: "Дневник растения на год" },
      { n: "05", text: "Листовка с гайдом по пересадке" },
    ],
    after: "Ничего не докупать и не хранить потом в шкафу.",
    photoSlot: "раскладка бокса · фото top-down",
  },
  photoBand: { caption: "ритуал пересадки · руки в земле" },
  whatSoilGives: {
    columns: [
      {
        label: "Растению",
        text: "Дом, похожий на родной: корни дышат, влага и питание держатся ровно.",
      },
      {
        label: "Тебе",
        text: "Спокойствие: грунт прощает перелив, мошкам сложнее завестись, питание не вымывается с первой лейкой. Честный состав, без обещаний чудес.",
      },
    ],
  },
  about: {
    eyebrow: "О нас",
    /* прототип-редакция: канон блок 3 содержит «уникальных» (блэклист) — вопрос Насте */
    paragraphs: [
      "Восемь лет я работала с цифровыми продуктами — всегда в экране. А восстанавливаться научилась в простом и материальном: заботе о растениях. Они растут тихо и медленно отзываются на каждое движение. И всё начинается с земли — в ней и питание, и сила.",
      "Сейчас в моей коллекции больше двадцати пяти растений. Свою любовь к ним я собрала системно и по науке — под каждое свою землю. Так появился ЗАЗЕМЛИ.",
    ],
    signature: "— Настя, основательница",
  },
  teasers: [
    {
      eyebrow: "Лаборатория",
      title: "Одиннадцать компонентов, семь рецептов.",
      body: "Почему у каждого растения своя земля.",
      link: { label: "В лабораторию →", href: "/lab" },
    },
    {
      eyebrow: "Гайд",
      title: "Руки в землю — голова свободна.",
      body: "Пересадка по шагам: от дренажа до первой записи в дневнике.",
      link: { label: "Открыть гайд →", href: "/guide" },
    },
    {
      /* дневник — часть ценности бокса, вход только по QR: без ссылки (инвариант) */
      eyebrow: "Дневник",
      title: "Забота продолжается после пересадки.",
      body: "Дневник на год: полив, подкормка, рост — по научным рекомендациям под твоё растение, как и грунт.",
      link: null,
      note: "часть бокса",
    },
  ],
  ozonCta: {
    eyebrow: "Купить",
    title: "Семь растений, три размера. От 1\u00A0890 ₽.",
    caption:
      "Оплата и доставка — на Ozon. В коробке — всё для одной пересадки: грунт собран под твоё растение и сверен с исследованиями.",
  },
};
