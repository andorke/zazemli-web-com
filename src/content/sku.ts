/*
 * 7 SKU партии 0. Источники: sku-system.md v1.0.2, color-system.md v1.0.1
 * (маппинг цветов; монстера и эпипремнум делят moss — родственные лианы).
 * Латынь — только род (typography.md §2). Дудлы — по SKU (docs/.../doodles/colored),
 * на главной рендерятся монохромно (charcoal) через CSS-маску (бриф §7 «на главной — в графите»).
 *
 * Мета карточек (components/volumes/priceFrom) и биотопы колб — из прототипа
 * ../zazemli-vault/Айти/Сайт/prototypes/landing.html (в каноне home.md их нет — вопрос Насте).
 * В ценах — неразрывный пробел (U+00A0), чтобы «1 890» не рвалось на переносе.
 */

export type SkuColor =
  | "moss"
  | "cosmos"
  | "iris"
  | "buttercup"
  | "sky"
  | "poppy";

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
};

/* Нумерация лендинга: «N° 01» (пробел, 2 цифры) — design-решение 5; на товарных остаётся N°001 */
export function landingNumber(number: Sku["number"]): string {
  return `N° ${number.slice(-2)}`;
}

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
  },
];
