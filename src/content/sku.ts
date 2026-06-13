/*
 * 7 SKU партии 0. Источники: sku-system.md v1.0.2, color-system.md v1.0.1
 * (маппинг цветов; монстера и эпипремнум делят moss — родственные лианы).
 * Латынь — только род (typography.md §2). Дудлы — по SKU (docs/.../doodles/colored),
 * на главной рендерятся монохромно (charcoal) через CSS-маску (бриф §7 «на главной — в графите»).
 *
 * NB tagline + potSize: транскрибированы с рендера Figma 185:2 (галерея 185:39),
 * т.к. data API Figma в rate limit. Сверить с текстовыми нодами после сброса лимита.
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
};

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
  },
  {
    number: "N°007",
    slug: "epipremnum",
    nameRu: "эпипремнум",
    latin: "Epipremnum",
    color: "moss",
    tagline: "лиана, что не остановишь",
    potSize: "для горшка 12–16 см",
    doodle: "/doodles/epipremnum-moss.svg",
    ozonUrl: null,
  },
];
