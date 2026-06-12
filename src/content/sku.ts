/*
 * 7 SKU партии 0. Источники: sku-system.md v1.0.2, color-system.md v1.0.1
 * (маппинг цветов; монстера и эпипремнум делят moss — родственные лианы).
 * Латынь — только род (typography.md §2, brand-voice-profile).
 * ozonUrl появится после открытия карточек Ozon (Фаза 2).
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
  ozonUrl: string | null;
};

export const skus: Sku[] = [
  {
    number: "N°001",
    slug: "monstera",
    nameRu: "монстера",
    latin: "Monstera",
    color: "moss",
    ozonUrl: null,
  },
  {
    number: "N°002",
    slug: "ficus",
    nameRu: "фикус",
    latin: "Ficus",
    color: "cosmos",
    ozonUrl: null,
  },
  {
    number: "N°003",
    slug: "anthurium",
    nameRu: "антуриум",
    latin: "Anthurium",
    color: "poppy",
    ozonUrl: null,
  },
  {
    number: "N°004",
    slug: "aglaonema",
    nameRu: "аглаонема",
    latin: "Aglaonema",
    color: "iris",
    ozonUrl: null,
  },
  {
    number: "N°005",
    slug: "spathiphyllum",
    nameRu: "спатифиллум",
    latin: "Spathiphyllum",
    color: "sky",
    ozonUrl: null,
  },
  {
    number: "N°006",
    slug: "zamioculcas",
    nameRu: "замиокулькас",
    latin: "Zamioculcas",
    color: "buttercup",
    ozonUrl: null,
  },
  {
    number: "N°007",
    slug: "epipremnum",
    nameRu: "эпипремнум",
    latin: "Epipremnum",
    color: "moss",
    ozonUrl: null,
  },
];
