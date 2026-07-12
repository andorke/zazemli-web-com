/*
 * 7 SKU партии 0. Источники: sku-system.md v1.0.2, color-system.md v1.0.1
 * (маппинг цветов; монстера и эпипремнум делят moss — родственные лианы).
 * Латынь — только род (typography.md §2). Дудлы — по SKU (docs/.../doodles/colored),
 * на главной рендерятся монохромно (charcoal) через CSS-маску (бриф §7 «на главной — в графите»).
 *
 * Мета карточек (components/volumes/priceFrom) и биотопы колб — из прототипа
 * ../zazemli-vault/Айти/Сайт/prototypes/landing.html (в каноне home.md их нет — вопрос Насте).
 * В ценах — неразрывный пробел (U+00A0), чтобы «1 890» не рвалось на переносе.
 *
 * Данные страницы товара (vial, composition, boxContents, care, ritualPhrase, sizes,
 * sourceNote) — из прототипов ../zazemli-vault/Айти/Сайт/prototypes/collectio-*.html
 * (эталон шаблона) + product-description.md v1.1.1 (§Биотопы; hero — вариант A).
 * Типы vial/material переиспользуют DS-атомы SoilVial и MaterialDot: мох сфагнум красится
 * в moss (в прототипе — --e-water, но на сайте earth-палитра MaterialDot без «water»).
 * Расхождения канон↔прототип — в вопросы Насте (см. PROGRESS/CONTEXT):
 *   — hero A/B: таблица product-description даёт A = базовый Lvl 2, приложение путает метки; берём A = «Заземли {растение}.»;
 *   — ритуал-приписка: прототипы дают характерную фразу листовки (канон-вариант B), не пасхалку A;
 *   — «что в боксе»: прототип collectio даёт 6 позиций (+угольная пудра, +листовка), канон блок 3 — 4–5; страница товара идёт по прототипу.
 */

import type { MaterialName } from "@/components/ui/material-dot";
import type { VialSegments } from "@/components/ui/soil-vial";

export type SkuColor =
  | "moss"
  | "cosmos"
  | "iris"
  | "buttercup"
  | "sky"
  | "poppy";

/* Компонент состава: имя · earth-цвет MaterialDot · доля %. Сумма долей = 100. */
export type CompositionItem = {
  name: string;
  material: MaterialName;
  pct: number;
};

/* Колонка care-грида: заголовок + рекомендация (прототип collectio, блок CARE). */
export type CareItem = { label: string; text: string };

export type Care = {
  /* подводка под «Уход мы расписали за тебя» */
  lead: string;
  /* три колонки грида */
  items: CareItem[];
  /* строка «источники рекомендаций» (аккордеон) */
  sources: string;
  /* текст дневник-панели */
  diary: string;
};

/* SourceNote-аккордеон под «Зачем эта земля»: клик-текст + утверждение + источник (рецензируемо). */
export type SourceNote = {
  summary: string;
  claim: string;
  source: string;
};

/* Товарная позиция: объём + цена + ссылка на Ozon (null → кнопка «Скоро на Ozon»). */
export type Size = {
  volume: string;
  price: string;
  ozonListingUrl: string | null;
};

export type Sku = {
  number: `N°${string}`;
  slug: string;
  nameRu: string;
  latin: string;
  color: SkuColor;
  tagline: string;
  potSize: string;
  doodle: string;
  ozonUrl: string | null;
  components: number;
  volumes: string;
  priceFrom: string;
  /* родной биотоп — подпись колбы на лендинге; пока есть только у трио из прототипа */
  biotope?: string;
  /* --- страница товара /collectio/[slug] --- */
  /* винительный падеж названия — H1 «Заземли {accusative}.» и CTA hero (design-решение 2, вариант A) */
  accusative: string;
  /* родительный падеж названия — H2 «…земля {genitive}.» и «…пересадку {genitive}.» (прототип collectio) */
  genitive: string;
  /* описание грунта под hero (прототип collectio, блок .sub) */
  heroSub: string;
  /* проза «Зачем именно эта земля» (прототип collectio, блок .biotope) */
  whyProse: string;
  vial: VialSegments;
  composition: CompositionItem[];
  boxContents: string[];
  care: Care;
  /* характерная фраза-приписка ритуала (варьируется по SKU; постоянная строка — ritualLine) */
  ritualPhrase: string;
  sizes: Size[];
  sourceNote: SourceNote;
};

/* Нумерация лендинга: «N° 01» (пробел, 2 цифры) — design-решение 5; на товарных остаётся N°001 */
export function landingNumber(number: Sku["number"]): string {
  return `N° ${number.slice(-2)}`;
}

/* Постоянные строки шаблона страницы товара; варьируемое per-SKU — в полях Sku. */
export const productPage = {
  heroKicker: "Collectio Zazemli · Партия 0",
  whyEyebrow: "Зачем именно эта земля",
  sourceBadge: "рецензируемо",
  labBridge: "Весь состав и источники → в лаборатории",
  boxEyebrow: "Что в боксе",
  careEyebrow: "После пересадки",
  careTitle: "Уход мы расписали за тебя.",
  careSources: "источники рекомендаций",
  diaryEyebrow: "Дневник на год",
  ritualEyebrow: "Ритуал",
  guideBridge: "Как пересадить, по шагам →",
  /* buybar (прототип collectio, блок 9) — точная копи eyebrow/title вопрос Насте */
  buyEyebrow: "Заземлить",
  buyTitle: "Выбери объём.",
  /* founder-quote + футер-мост (прототип collectio, блоки 10–11) — постоянные для всех SKU */
  founderQuote: "«Для тех, кто создаёт цифровое, а руками тянется к земле.»",
  founderSign: "— Настя, основательница",
  collectionBridge: "← Вся коллекция",
} as const;

/* H1 hero и CTA собираются из винительного падежа названия (design-решение 2, вариант A). */
export function heroTitle(sku: Sku): string {
  return `Заземли ${sku.accusative}.`;
}
export function heroCtaLabel(sku: Sku): string {
  return `Заземлить ${sku.accusative} →`;
}
/* Мост на реестр источников в лаборатории — якорь рецепта SKU (прототип collectio). */
export function labHref(sku: Sku): string {
  return `/lab#rec-${sku.slug}`;
}

/* Заголовки блоков «Состав» и «Что в боксе» варьируются родительным падежом (прототип collectio). */
export function compositionEyebrow(sku: Sku): string {
  return `Состав · ${sku.components} компонентов`;
}
export function compositionTitle(sku: Sku): string {
  return `Из чего собрана земля ${sku.genitive}.`;
}
export function boxTitle(sku: Sku): string {
  return `Всё на одну пересадку ${sku.genitive}.`;
}

/* CTA buybar под выбранный размер: «Купить {объём} на Ozon» (design-решение 4). */
export function buyCtaLabel(size: Size): string {
  return `Купить ${size.volume} на Ozon`;
}

/* Ритуал-строка одна на все SKU (прототипы collectio); варьируется только приписка ritualPhrase. */
export const ritualLine = "Час с грунтом стоит дня в zoom.";

/* Постоянная часть бокса — физический бокс одинаков для всех SKU; варьируется только почвосмесь (позиция 01). */
const boxCommon: string[] = [
  "Керамзитовый дренаж",
  "Конвертик «Забота о корнях и твоих руках»: перчатки, корневин, 2 апельсиновые палочки",
  "Мини-бутылочка угольной пудры для срезов",
  "Дневник растения на год",
  "Листовка с гайдом по пересадке",
];

export const skus: Sku[] = [
  {
    number: "N°001",
    slug: "monstera",
    nameRu: "монстера",
    latin: "Monstera",
    color: "moss",
    tagline: "мох держит влагу джунглей",
    potSize: "для горшка 15–20 см",
    doodle: "/doodles/monstera-moss.svg",
    ozonUrl: null,
    components: 10,
    volumes: "2,2 / 3,5 л",
    priceFrom: "от 2 190 ₽",
    accusative: "монстеру",
    genitive: "монстеры",
    heroSub:
      "Рыхлый грунт под монстеру: кора, цеолит, мох, кокос. Корни дышат, как на дереве.",
    whyProse:
      "В джунглях корни висят в воздухе. Кора, цеолит и кокос делают грунт рыхлым, почти невесомым. Мох напоминает о влажности тропиков.",
    vial: { base: 50, air: 15, moisture: 25, drainage: 10 },
    composition: [
      { name: "Торф нейтральный", material: "soil", pct: 20 },
      { name: "Кора сосновая", material: "ceramsite", pct: 15 },
      { name: "Цеолит", material: "pumice", pct: 15 },
      { name: "Кокосовый субстрат", material: "sand", pct: 10 },
      { name: "Мох сфагнум", material: "moss", pct: 10 },
      { name: "Биочар", material: "graphite", pct: 10 },
      { name: "Диатомит", material: "gravel", pct: 5 },
      { name: "Пеностекло", material: "pumice", pct: 5 },
      { name: "Кварцевый песок", material: "sand", pct: 5 },
      { name: "Биогумус", material: "soil", pct: 5 },
    ],
    boxContents: ["Почвосмесь под монстеру · 10 компонентов", ...boxCommon],
    care: {
      lead: "Уход у каждого растения свой, и мы изучили именно монстеру. Вот главное.",
      items: [
        { label: "Полив", text: "Когда верхняя четверть-треть просохла." },
        { label: "Подкормка", text: "Раз в месяц в сезон роста." },
        {
          label: "Листья",
          text: "Протирать листья от пыли. Она снижает фотосинтез.",
        },
      ],
      sources:
        "Полив, подкормка — NC State Extension, RHS. Пыль ↓ фотосинтез — Meravi & Singh, 2021 · Chaurasia, 2022.",
      diary:
        "Сезонный календарь заботы под монстеру. Мы продумали весь год, а не только грунт.",
    },
    ritualPhrase: "Она уже лезет из горшка.",
    sizes: [
      { volume: "2,2 л", price: "2 190 ₽", ozonListingUrl: null },
      { volume: "3,5 л", price: "2 590 ₽", ozonListingUrl: null },
    ],
    sourceNote: {
      summary: "почему воздух решает",
      claim:
        "Дефицит воздуха в субстрате ограничивает рост сильнее, чем нехватка воды или питания.",
      source: "Bugbee & Frink, 1986, Soil Science",
    },
  },
  {
    number: "N°002",
    slug: "ficus",
    nameRu: "фикус",
    latin: "Ficus",
    color: "cosmos",
    tagline: "плотная, стабильная земля",
    potSize: "для горшка 15–20 см",
    doodle: "/doodles/ficus-cosmos.svg",
    ozonUrl: null,
    components: 9,
    volumes: "2,2 / 3,5 л",
    priceFrom: "от 2 190 ₽",
    biotope: "тропики Юго-Восточной Азии",
    accusative: "фикус",
    genitive: "фикуса",
    heroSub:
      "Плотный, стабильный грунт под фикус: торф, биочар, диатомит, цеолит. Держит влагу ровно, без скачков.",
    whyProse:
      "Укоренился — не сдвинешь. Торф нейтральный и биочар — основа стабильности. Диатомит и цеолит держат влажность ровно, без скачков.",
    vial: { base: 60, air: 10, moisture: 20, drainage: 10 },
    composition: [
      { name: "Торф нейтральный", material: "soil", pct: 30 },
      { name: "Цеолит", material: "pumice", pct: 15 },
      { name: "Кора сосновая", material: "ceramsite", pct: 10 },
      { name: "Кокосовый субстрат", material: "sand", pct: 10 },
      { name: "Диатомит", material: "gravel", pct: 10 },
      { name: "Биочар", material: "graphite", pct: 10 },
      { name: "Пеностекло", material: "pumice", pct: 5 },
      { name: "Кварцевый песок", material: "sand", pct: 5 },
      { name: "Биогумус", material: "soil", pct: 5 },
    ],
    boxContents: ["Почвосмесь под фикус · 9 компонентов", ...boxCommon],
    care: {
      lead: "Уход у каждого растения свой, и мы изучили именно фикус. Вот главное.",
      items: [
        { label: "Полив", text: "Не давать грунту пересохнуть полностью." },
        { label: "Подкормка", text: "Лёгкая, когда пошли новые листья." },
        {
          label: "Перемещение",
          text: "Не переставляй резко, иначе сбросит листья.",
        },
      ],
      sources:
        "Полив, подкормка, чувствительность к перемещению — NC State Extension, RHS.",
      diary:
        "Сезонный календарь заботы под фикус. Мы продумали весь год, а не только грунт.",
    },
    ritualPhrase: "Он сбросит листья, не обижайся.",
    sizes: [
      { volume: "2,2 л", price: "2 190 ₽", ozonListingUrl: null },
      { volume: "3,5 л", price: "2 590 ₽", ozonListingUrl: null },
    ],
    sourceNote: {
      summary: "почему минералы держат структуру",
      claim:
        "Минеральная фракция сохраняет газодиффузию субстрата годами, тогда как на одном перлите она падает за сезон.",
      source: "Caron, Rivière & Guillemain, 2005, Can. J. Soil Sci.",
    },
  },
  {
    number: "N°003",
    slug: "anthurium",
    nameRu: "антуриум",
    latin: "Anthurium",
    color: "poppy",
    tagline: "воздух, как на дереве",
    potSize: "для горшка 12–16 см",
    doodle: "/doodles/anturium-poppy.svg",
    ozonUrl: null,
    components: 10,
    volumes: "1,2 / 2,2 л",
    priceFrom: "от 1 890 ₽",
    biotope: "горные леса Анд",
    accusative: "антуриум",
    genitive: "антуриума",
    heroSub:
      "Воздушный грунт под антуриум: кора, кокос, мох. Корни дышат, как на дереве, и не терпят болота.",
    whyProse:
      "В тропиках растёт на деревьях, а не в земле. Кора и кокос дают воздух корням-эпифитам, а мох держит влагу. Привык дышать — не потерпит болота.",
    vial: { base: 35, air: 20, moisture: 35, drainage: 10 },
    composition: [
      { name: "Кора сосновая", material: "ceramsite", pct: 20 },
      { name: "Кокосовый субстрат", material: "sand", pct: 20 },
      { name: "Торф нейтральный", material: "soil", pct: 10 },
      { name: "Цеолит", material: "pumice", pct: 10 },
      { name: "Мох сфагнум", material: "moss", pct: 10 },
      { name: "Биочар", material: "graphite", pct: 10 },
      { name: "Диатомит", material: "gravel", pct: 5 },
      { name: "Пеностекло", material: "pumice", pct: 5 },
      { name: "Кварцевый песок", material: "sand", pct: 5 },
      { name: "Биогумус", material: "soil", pct: 5 },
    ],
    boxContents: ["Почвосмесь под антуриум · 10 компонентов", ...boxCommon],
    care: {
      lead: "Уход у каждого растения свой, и мы изучили именно антуриум. Вот главное.",
      items: [
        { label: "Полив", text: "Когда верхний сантиметр просох." },
        {
          label: "Подкормка",
          text: "Орхидейное удобрение раз в две недели весной и летом.",
        },
        { label: "Лист", text: "Не мочить лист, иначе появляются пятна." },
      ],
      sources:
        "Полив, подкормка, чувствительность мокрого листа — NC State Extension, RHS.",
      diary:
        "Сезонный календарь заботы под антуриум. Мы продумали весь год, а не только грунт.",
    },
    ritualPhrase: "Ему нужна земля, а не комплименты.",
    sizes: [
      { volume: "1,2 л", price: "1 890 ₽", ozonListingUrl: null },
      { volume: "2,2 л", price: "2 190 ₽", ozonListingUrl: null },
    ],
    sourceNote: {
      summary: "почему воздух решает",
      claim:
        "Дефицит воздуха в субстрате ограничивает рост сильнее, чем нехватка воды или питания — для эпифита это критично.",
      source: "Bugbee & Frink, 1986, Soil Science",
    },
  },
  {
    number: "N°004",
    slug: "aglaonema",
    nameRu: "аглаонема",
    latin: "Aglaonema",
    color: "iris",
    tagline: "тень и мягкая кислинка",
    potSize: "для горшка 12–16 см",
    doodle: "/doodles/aglaonema-zagogulya.svg",
    ozonUrl: null,
    components: 10,
    volumes: "1,2 / 2,2 л",
    priceFrom: "от 1 890 ₽",
    accusative: "аглаонему",
    genitive: "аглаонемы",
    heroSub:
      "Грунт под аглаонему: кислый торф, кора, кокос, цеолит. Держит влагу и мягкую кислинку, как на лесной подстилке.",
    whyProse:
      "На лесной подстилке тропиков — тень, влага, кислинка. Кислый торф задаёт нужный pH. Кора, кокос и цеолит отвечают за воздух и влагу без застоя.",
    vial: { base: 60, air: 10, moisture: 15, drainage: 15 },
    composition: [
      { name: "Торф нейтральный", material: "soil", pct: 25 },
      { name: "Торф кислый", material: "soil", pct: 10 },
      { name: "Кора сосновая", material: "ceramsite", pct: 10 },
      { name: "Кокосовый субстрат", material: "sand", pct: 10 },
      { name: "Цеолит", material: "pumice", pct: 10 },
      { name: "Биочар", material: "graphite", pct: 10 },
      { name: "Кварцевый песок", material: "sand", pct: 10 },
      { name: "Диатомит", material: "gravel", pct: 5 },
      { name: "Пеностекло", material: "pumice", pct: 5 },
      { name: "Биогумус", material: "soil", pct: 5 },
    ],
    boxContents: ["Почвосмесь под аглаонему · 10 компонентов", ...boxCommon],
    care: {
      lead: "Уход у каждого растения свой, и мы изучили именно аглаонему. Вот главное.",
      items: [
        { label: "Полив", text: "Держать грунт влажным с весны до осени." },
        { label: "Подкормка", text: "Слабый NPK-раствор в сезон роста." },
        {
          label: "Вода",
          text: "Не поливать холодной водой, иначе гниют корни.",
        },
      ],
      sources:
        "Полив, подкормка, чувствительность к холодной воде — NC State Extension, RHS.",
      diary:
        "Сезонный календарь заботы под аглаонему. Мы продумали весь год, а не только грунт.",
    },
    ritualPhrase: "Красивая и знает об этом.",
    sizes: [
      { volume: "1,2 л", price: "1 890 ₽", ozonListingUrl: null },
      { volume: "2,2 л", price: "2 190 ₽", ozonListingUrl: null },
    ],
    sourceNote: {
      summary: "почему важен воздух без застоя",
      claim:
        "Дефицит воздуха в субстрате ограничивает рост сильнее, чем нехватка воды или питания.",
      source: "Bugbee & Frink, 1986, Soil Science",
    },
  },
  {
    number: "N°005",
    slug: "spathiphyllum",
    nameRu: "спатифиллум",
    latin: "Spathiphyllum",
    color: "sky",
    tagline: "любит воду, не терпит болота",
    potSize: "для горшка 12–20 см",
    doodle: "/doodles/spatifillum-kaplya.svg",
    ozonUrl: null,
    components: 11,
    volumes: "1,2 / 2,2 / 3,5 л",
    priceFrom: "от 1 890 ₽",
    accusative: "спатифиллум",
    genitive: "спатифиллума",
    heroSub:
      "Грунт под спатифиллум: кислый торф, цеолит, кора, кокос. Держит влагу для жаждущего цветка, но без болота.",
    whyProse:
      "Кислый торф задаёт нужный pH для жителя лесной подстилки. Цеолит, кора и кокос — баланс влаги для жаждущего цветка. Пьёт много, но гнили не терпит.",
    vial: { base: 60, air: 10, moisture: 20, drainage: 10 },
    composition: [
      { name: "Торф нейтральный", material: "soil", pct: 25 },
      { name: "Торф кислый", material: "soil", pct: 10 },
      { name: "Кора сосновая", material: "ceramsite", pct: 10 },
      { name: "Кокосовый субстрат", material: "sand", pct: 10 },
      { name: "Цеолит", material: "pumice", pct: 10 },
      { name: "Биочар", material: "graphite", pct: 10 },
      { name: "Диатомит", material: "gravel", pct: 5 },
      { name: "Пеностекло", material: "pumice", pct: 5 },
      { name: "Мох сфагнум", material: "moss", pct: 5 },
      { name: "Кварцевый песок", material: "sand", pct: 5 },
      { name: "Биогумус", material: "soil", pct: 5 },
    ],
    boxContents: ["Почвосмесь под спатифиллум · 11 компонентов", ...boxCommon],
    care: {
      lead: "Уход у каждого растения свой, и мы изучили именно спатифиллум. Вот главное.",
      items: [
        { label: "Полив", text: "Держать влажным, но не в болоте." },
        { label: "Подкормка", text: "Удобрение в четверть дозы." },
        {
          label: "Влажность",
          text: "Опрыскивать можно свободно, любит влажный воздух.",
        },
      ],
      sources: "Полив, подкормка, опрыскивание — NC State Extension, RHS.",
      diary:
        "Сезонный календарь заботы под спатифиллум. Мы продумали весь год, а не только грунт.",
    },
    ritualPhrase: "Цветёт, когда ты не смотришь.",
    sizes: [
      { volume: "1,2 л", price: "1 890 ₽", ozonListingUrl: null },
      { volume: "2,2 л", price: "2 190 ₽", ozonListingUrl: null },
      { volume: "3,5 л", price: "2 590 ₽", ozonListingUrl: null },
    ],
    sourceNote: {
      summary: "почему важен баланс влаги и воздуха",
      claim:
        "Дефицит воздуха в субстрате ограничивает рост сильнее, чем нехватка воды или питания. Поэтому «много воды» и «болото» не одно и то же.",
      source: "Bugbee & Frink, 1986, Soil Science",
    },
  },
  {
    number: "N°006",
    slug: "zamioculcas",
    nameRu: "замиокулькас",
    latin: "Zamioculcas",
    color: "buttercup",
    tagline: "почти песок",
    potSize: "для горшка 15–20 см",
    doodle: "/doodles/zamiokulkas-buttercup.svg",
    ozonUrl: null,
    components: 8,
    volumes: "1,2 / 2,2 / 3,5 л",
    priceFrom: "от 1 890 ₽",
    biotope: "сухая Восточная Африка",
    accusative: "замиокулькас",
    genitive: "замиокулькаса",
    heroSub:
      "Минеральный грунт под замиокулькас: цеолит, пеностекло, песок. Отводит лишнюю влагу мгновенно, как в засушливой Африке.",
    whyProse:
      "В Африке выживает в засуху — запасает воду в клубнях. Цеолит, пеностекло и песок отводят лишнюю влагу мгновенно. Суккулент в душе, хоть и не признаётся.",
    vial: { base: 55, air: 0, moisture: 20, drainage: 25 },
    composition: [
      { name: "Торф нейтральный", material: "soil", pct: 25 },
      { name: "Цеолит", material: "pumice", pct: 15 },
      { name: "Пеностекло", material: "pumice", pct: 15 },
      { name: "Диатомит", material: "gravel", pct: 10 },
      { name: "Кокосовый субстрат", material: "sand", pct: 10 },
      { name: "Биочар", material: "graphite", pct: 10 },
      { name: "Кварцевый песок", material: "sand", pct: 10 },
      { name: "Биогумус", material: "soil", pct: 5 },
    ],
    boxContents: ["Почвосмесь под замиокулькас · 8 компонентов", ...boxCommon],
    care: {
      lead: "Уход у каждого растения свой, и мы изучили именно замиокулькас. Вот главное.",
      items: [
        { label: "Полив", text: "Дважды в месяц летом, раз в месяц зимой." },
        {
          label: "Подкормка",
          text: "Жидкое удобрение раз-два в год, не чаще.",
        },
        { label: "Перчатки", text: "Работай в перчатках, сок раздражает кожу." },
      ],
      sources:
        "Полив, подкормка, раздражающий сок — NC State Extension, RHS.",
      diary:
        "Сезонный календарь заботы под замиокулькас. Мы продумали весь год, а не только грунт.",
    },
    ritualPhrase: "Он дождётся тебя из отпуска.",
    sizes: [
      { volume: "1,2 л", price: "1 890 ₽", ozonListingUrl: null },
      { volume: "2,2 л", price: "2 190 ₽", ozonListingUrl: null },
      { volume: "3,5 л", price: "2 590 ₽", ozonListingUrl: null },
    ],
    sourceNote: {
      summary: "почему минералы держат структуру",
      claim:
        "Субстраты на одном минерале теряют газодиффузию за сезон, а многокомпонентная минеральная система держит структуру годами.",
      source: "Caron, Rivière & Guillemain, 2005, Can. J. Soil Sci.",
    },
  },
  {
    number: "N°007",
    slug: "epipremnum",
    nameRu: "эпипремнум",
    latin: "Epipremnum",
    color: "moss",
    tagline: "лиана, что не остановить",
    potSize: "для горшка 12–16 см",
    doodle: "/doodles/epipremnum-moss.svg",
    ozonUrl: null,
    components: 9,
    volumes: "1,2 / 2,2 л",
    priceFrom: "от 1 890 ₽",
    accusative: "эпипремнум",
    genitive: "эпипремнума",
    heroSub:
      "Грунт под эпипремнум: торф, кора, мох. Питание, воздух и влага для лианы, которую не остановить.",
    whyProse:
      "Лиана из влажных джунглей — цепляется и летит. Торф для питания, кора для воздуха, мох для влаги. Прощает ошибки, но в хорошем грунте — не остановить.",
    vial: { base: 55, air: 15, moisture: 25, drainage: 5 },
    composition: [
      { name: "Торф нейтральный", material: "soil", pct: 30 },
      { name: "Кора сосновая", material: "ceramsite", pct: 15 },
      { name: "Кокосовый субстрат", material: "sand", pct: 10 },
      { name: "Цеолит", material: "pumice", pct: 10 },
      { name: "Мох сфагнум", material: "moss", pct: 10 },
      { name: "Биочар", material: "graphite", pct: 10 },
      { name: "Диатомит", material: "gravel", pct: 5 },
      { name: "Пеностекло", material: "pumice", pct: 5 },
      { name: "Биогумус", material: "soil", pct: 5 },
    ],
    boxContents: ["Почвосмесь под эпипремнум · 9 компонентов", ...boxCommon],
    care: {
      lead: "Уход у каждого растения свой, и мы изучили именно эпипремнум. Вот главное.",
      items: [
        { label: "Полив", text: "Дать просохнуть между поливами." },
        { label: "Подкормка", text: "Раз в два месяца, кроме зимы." },
        {
          label: "Свет",
          text: "При нехватке света теряет вариегатный рисунок.",
        },
      ],
      sources:
        "Полив, подкормка, потеря вариегатности при нехватке света — NC State Extension.",
      diary:
        "Сезонный календарь заботы под эпипремнум. Мы продумали весь год, а не только грунт.",
    },
    ritualPhrase: "Одна лиана и дом — джунгли.",
    sizes: [
      { volume: "1,2 л", price: "1 890 ₽", ozonListingUrl: null },
      { volume: "2,2 л", price: "2 190 ₽", ozonListingUrl: null },
    ],
    sourceNote: {
      summary: "почему воздух решает",
      claim:
        "Дефицит воздуха в субстрате ограничивает рост сильнее, чем нехватка воды или питания — кора даёт корням лианы дышать.",
      source: "Bugbee & Frink, 1986, Soil Science",
    },
  },
];
