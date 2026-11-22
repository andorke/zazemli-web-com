import { buildOzonUrl } from "@/lib/utm";
import rows from "./plants.json";
import library from "./materials.json";

export const plantSlugs = [
  "monstera",
  "ficus",
  "anthurium",
  "aglaonema",
  "spathiphyllum",
  "zamioculcas",
  "epipremnum",
] as const;

export type PlantSlug = (typeof plantSlugs)[number];
export type Format = "box" | "soil";
export type Material = keyof typeof library.materials;
export type Zone = Material | "dark";
export type Rectangle = [number, number, number, number];

export type Plant = {
  slug: PlantSlug;
  name: string;
  gen: string;
  volume: string[];
  feature: string;
  leaflet: string;
  recipe: Partial<Record<Material, number>>;
  zones: Partial<Record<Zone, Rectangle | Rectangle[]>>;
};

export const plants = rows as Plant[];
export const materials = library.materials;
export const mixes = library.mixes;
export const silhouette = library.clip;

export function findPlant(slug: string | null | undefined) {
  return plants.find((plant) => plant.slug === slug);
}

export function materialName(material: Material) {
  return materials[material][0];
}

export function regionMaterials(plant: Plant, zone: Zone | null): Material[] {
  if (!zone) return [];
  if (zone !== "dark") return [zone];
  return (["peat", "acid", "humus"] as const).filter(
    (key) => plant.recipe[key] && !plant.zones[key],
  );
}

export function firstRegion(plant: Plant) {
  return (
    (Object.keys(plant.zones) as Zone[]).find((zone) => zone !== "dark") ?? null
  );
}

export const boxPrice: Readonly<Record<string, number>> = {
  "1,2": 1990,
  "2,2": 2390,
  "3,5": 2890,
};

export function paperAsset(path: string) {
  return `/warm-paper/assets/${path}`;
}

export function capitalize(value: string) {
  return value[0].toLocaleUpperCase("ru") + value.slice(1);
}

export type Offer = {
  id: string;
  plant: PlantSlug;
  format: Format;
  potVolume?: string;
  packageVolume: string;
  priceRub: number;
  url: string;
  inStock: boolean;
  checkedAt: string;
};

// Только сверенные предложения из кабинета продавца. Пустая таблица
// оставляет покупку недоступной, но позволяет проверить весь каталог.
export const offers: readonly Offer[] = [];

export function offerLink(offer: Offer | undefined) {
  if (!offer?.inStock) return undefined;
  let url: URL;
  try {
    url = new URL(offer.url);
  } catch {
    return undefined;
  }
  if (
    url.protocol !== "https:" ||
    !["ozon.ru", "www.ozon.ru"].includes(url.hostname) ||
    !url.pathname.startsWith("/product/")
  )
    return undefined;
  url.searchParams.set("utm_medium", "referral");
  url.searchParams.set("utm_campaign", "zazemli");
  const skuNumber = String(plantSlugs.indexOf(offer.plant) + 1).padStart(3, "0");
  return buildOzonUrl(url.href, { skuNumber: `N°${skuNumber}` });
}
