import type { MaterialName } from "@/components/ui/material-dot";
import type { ComponentGroup, SoilFunction } from "@/content/lab";

/*
 * Earth-палитра по 4 функциям земли — та же раскраска, что уже красит
 * мерную колбу на главной (SoilVial: base→soil, air→pumice, water→moss,
 * drain→ceramsite). Единый цветовой язык сайта, не новая палитра под /lab.
 */
export const FUNCTION_MATERIAL: Record<SoilFunction, MaterialName> = {
  base: "soil",
  air: "pumice",
  water: "moss",
  drain: "ceramsite",
};

export const GROUP_FUNCTION: Record<ComponentGroup, SoilFunction> = {
  "основа и питание": "base",
  воздух: "air",
  влага: "water",
  "дренаж и каркас": "drain",
};

export const GROUP_MATERIAL: Record<ComponentGroup, MaterialName> = {
  "основа и питание": FUNCTION_MATERIAL.base,
  воздух: FUNCTION_MATERIAL.air,
  влага: FUNCTION_MATERIAL.water,
  "дренаж и каркас": FUNCTION_MATERIAL.drain,
};
