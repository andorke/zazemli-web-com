import { useEffect } from "react";
import { paperAsset, type Format, type PlantSlug } from "@/content/paper/catalog";

export function productImageFiles(slug: PlantSlug, format: Format) {
  return format === "box"
    ? [`scene-${slug}.webp`]
    : [`pack-${slug}.webp`, `shape-${slug}.webp`];
}

export function labImageFiles(slug: PlantSlug) {
  return [`lab-soil/${slug}.webp`, `soil-${slug}.webp`];
}

export function decodePaperImage(file: string) {
  const image = new Image();
  image.src = paperAsset(file);
  return image.decode().then(() => image);
}

export function useFirstPaperImages(page: "catalog" | "lab", slug: PlantSlug, format?: Format) {
  useEffect(() => {
    const data = document.documentElement.dataset;
    const key = format ? `${page}-${slug}-${format}` : `${page}-${slug}`;
    if (data.paperWaitingFor !== key) return;
    let active = true;
    const files = format
      ? [...productImageFiles(slug, format), `soil-${slug}.webp`]
      : labImageFiles(slug);
    void Promise.allSettled(files.map(decodePaperImage)).then(() => {
      if (active) delete data.paperWaitingFor;
    });
    return () => { active = false; };
  }, [page, slug, format]);
}

export function startPaperTransition(
  update: () => void | Promise<void>,
  type?: string,
): Promise<void> {
  if (
    !document.startViewTransition ||
    document.hidden ||
    matchMedia("(prefers-reduced-motion: reduce)").matches
  ) {
    return Promise.resolve(update());
  }
  const transition = type && CSS.supports(`selector(:active-view-transition-type(${type}))`)
    ? document.startViewTransition({ update, types: [type] })
    : document.startViewTransition(update);
  void transition.ready.catch(() => {});
  return transition.finished.catch(() => {});
}
