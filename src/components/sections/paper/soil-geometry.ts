import type { Rectangle } from "@/content/paper/catalog";

export const soilPhotoSize = { width: 1000, height: 696 };
export const soilPhotoViewport = { x: 40, y: 27.84, width: 920, height: 640.32 };
export type SoilBounds = typeof soilPhotoViewport;

export function rectangles(shape: Rectangle | Rectangle[] | undefined): Rectangle[] {
  if (!shape) return [];
  return Array.isArray(shape[0]) ? (shape as Rectangle[]) : [shape as Rectangle];
}

export function soilBounds([left, top, right, bottom]: Rectangle): SoilBounds {
  return {
    x: left * 10,
    y: top * 6.96,
    width: (right - left) * 10,
    height: (bottom - top) * 6.96,
  };
}
