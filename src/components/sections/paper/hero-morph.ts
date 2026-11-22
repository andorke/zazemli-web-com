import type { Plant, Zone } from "@/content/paper/catalog";
import { rectangles, soilBounds, soilPhotoSize, soilPhotoViewport as view, type SoilBounds } from "./soil-geometry";

export type SoilSelection = { zone: Zone; index: number };
type Tile = SoilSelection & { bounds: SoilBounds };
type TilePair = { from?: Tile; to?: Tile };
type Palette = { outline: string; tint: string; shadow: string };

const duration = 680;
const full = { x: 0, y: 0, ...soilPhotoSize };
const mix = (a: number, b: number, t: number) => a + (b - a) * t;

function ease(progress: number, start = 0, end = 1) {
  const t = Math.max(0, Math.min(1, (progress - start) / (end - start)));
  return t * t * (3 - 2 * t);
}

function tiles(plant: Plant): Tile[] {
  return (Object.keys(plant.zones) as Zone[]).flatMap((zone) =>
    rectangles(plant.zones[zone]).map((rectangle, index) => {
      const area = soilBounds(rectangle);
      const x = Math.max(view.x, area.x);
      const y = Math.max(view.y, area.y);
      return {
        zone,
        index,
        bounds: {
          x,
          y,
          width: Math.min(view.x + view.width, area.x + area.width) - x,
          height: Math.min(view.y + view.height, area.y + area.height) - y,
        },
      };
    }),
  );
}

function distance(a: SoilBounds, b: SoilBounds) {
  return (a.x + a.width / 2 - b.x - b.width / 2) ** 2 +
    (a.y + a.height / 2 - b.y - b.height / 2) ** 2;
}

function soilBacking(list: Tile[]) {
  const dark = list.filter(({ zone }) => zone === "dark" || zone === "peat" || zone === "humus");
  return (dark.length ? dark : list)
    .reduce((a, b) => a.bounds.width * a.bounds.height >= b.bounds.width * b.bounds.height ? a : b)
    .bounds;
}

export function prepareHeroMorph(from: Plant, to: Plant, selection: SoilSelection | null) {
  const original = tiles(from);
  const next = tiles(to);
  const unused = new Set(next);
  const pairs: TilePair[] = original.map((tile) => {
    // Mixed soil can occupy two distinct areas. Pair the nearest areas first.
    const target = [...unused].filter((candidate) => candidate.zone === tile.zone)
      .sort((a, b) => distance(tile.bounds, a.bounds) - distance(tile.bounds, b.bounds))[0];
    if (target) unused.delete(target);
    return { from: tile, to: target };
  });
  for (const tile of unused) pairs.push({ to: tile });

  const selected = selection && pairs.find((pair) =>
    pair.from?.zone === selection.zone && pair.from.index === selection.index,
  );
  const accent = selection ? selected : pairs.find((pair) =>
    pair.from?.zone === "bark" && pair.to,
  ) ?? pairs.find((pair) => pair.from?.zone === "zeolite" && pair.to);
  // The selected piece sits above neighbouring pieces on the way to its new position.
  const ordered = accent ? [...pairs.filter((pair) => pair !== accent), accent] : pairs;
  return {
    pairs: ordered,
    selected: selected || null,
    accent: accent || null,
    selection: selected?.to ? { zone: selected.to.zone, index: selected.to.index } : null,
    fromBacking: soilBacking(original),
    toBacking: soilBacking(next),
  };
}

type Morph = ReturnType<typeof prepareHeroMorph>;

function viewport(ctx: CanvasRenderingContext2D) {
  const sx = ctx.canvas.width / view.width;
  const sy = ctx.canvas.height / view.height;
  ctx.setTransform(sx, 0, 0, sy, -view.x * sx, -view.y * sy);
}

function paint(ctx: CanvasRenderingContext2D, photo: HTMLImageElement, crop = view, place = view, opacity = 1) {
  if (opacity <= 0) return;
  const sx = photo.naturalWidth / full.width;
  const sy = photo.naturalHeight / full.height;
  ctx.globalAlpha = opacity;
  ctx.drawImage(photo, crop.x * sx, crop.y * sy, crop.width * sx, crop.height * sy,
    place.x, place.y, place.width, place.height);
  ctx.globalAlpha = 1;
}

export function paintHeroPhoto(ctx: CanvasRenderingContext2D, photo: HTMLImageElement) {
  viewport(ctx);
  paint(ctx, photo);
}

function outline(ctx: CanvasRenderingContext2D, box: SoilBounds, opacity: number, stroke: number, palette: Palette) {
  ctx.globalAlpha = opacity * .09;
  ctx.fillStyle = palette.tint;
  ctx.fillRect(box.x, box.y, box.width, box.height);
  ctx.globalAlpha = opacity;
  ctx.lineWidth = stroke;
  ctx.strokeStyle = palette.outline;
  ctx.strokeRect(box.x, box.y, box.width, box.height);
  ctx.globalAlpha = 1;
}

function render(
  ctx: CanvasRenderingContext2D, from: HTMLImageElement, to: HTMLImageElement,
  morph: Morph, progress: number, stroke: number, palette: Palette,
) {
  paint(ctx, from);
  paint(ctx, to, view, view, ease(progress, .18, .94));
  const lift = ease(progress, .02, .27) * (1 - ease(progress, .71, 1));
  paint(ctx, from, morph.fromBacking, view, lift * .93);
  paint(ctx, to, morph.toBacking, view, lift * .68 * ease(progress));
  let accentBounds: SoilBounds | undefined;

  for (const [index, pair] of morph.pairs.entries()) {
    const a = (pair.from ?? pair.to)!.bounds;
    const b = (pair.to ?? pair.from)!.bounds;
    const t = ease(progress, .03 + index % 4 * .022, .93);
    const separation = Math.sin(Math.PI * t);
    const stretch = pair.from && pair.to ? 1 : pair.from ? mix(1, .86, t) : mix(.86, 1, t);
    const width = mix(a.width, b.width, t);
    const height = mix(a.height, b.height, t);
    const inset = 4 * separation;
    const box = {
      x: mix(a.x, b.x, t) + width * (1 - stretch) / 2 + inset,
      y: mix(a.y, b.y, t) + height * (1 - stretch) / 2 + inset - 15 * separation,
      width: width * stretch - 2 * inset,
      height: height * stretch - 2 * inset,
    };
    if (pair === morph.accent) accentBounds = box;
    if (lift === 0 || box.width <= 0 || box.height <= 0) continue;
    const alpha = lift * (pair.from && pair.to
      ? 1
      : pair.from ? 1 - ease(progress, .13, .52) : ease(progress, .34, .78));
    ctx.fillStyle = palette.shadow;
    ctx.globalAlpha = alpha * separation;
    ctx.fillRect(box.x + 3 * separation, box.y + 7 * separation, box.width, box.height);
    if (pair.from) paint(ctx, from, a, box, alpha);
    if (pair.to) paint(ctx, to, b, box, alpha * (pair.from ? ease(t, .2, .8) : 1));
    ctx.globalAlpha = 1;
  }
  if (accentBounds) {
    const intensity = morph.selected ? morph.selection ? .95 : .95 * (1 - ease(progress, .25, .62)) : .82 * lift;
    outline(ctx, accentBounds, intensity, stroke, palette);
  }
}

export function animateHeroMorph(
  ctx: CanvasRenderingContext2D, from: HTMLImageElement, to: HTMLImageElement,
  morph: Morph, signal: AbortSignal,
) {
  const reduced = matchMedia("(prefers-reduced-motion: reduce)");
  if (reduced.matches || signal.aborted || document.hidden) return Promise.resolve();

  const canvas = ctx.canvas;
  const style = getComputedStyle(canvas);
  const palette = {
    outline: style.getPropertyValue("--hero-outline-stroke").trim(),
    tint: style.getPropertyValue("--hero-outline-fill").trim(),
    shadow: style.getPropertyValue("--hero-tile-shadow").trim(),
  };
  const screenScale = Math.max(canvas.clientWidth / view.width, canvas.clientHeight / view.height);
  const stroke = 1.6 / screenScale;
  viewport(ctx);
  render(ctx, from, to, morph, 0, stroke, palette);
  canvas.dataset.animating = "true";

  return new Promise<void>((resolve) => {
    let frame = 0;
    const started = performance.now();
    const stop = () => {
      cancelAnimationFrame(frame);
      signal.removeEventListener("abort", stop);
      resolve();
    };
    function step(now: number) {
      const progress = (now - started) / duration;
      if (progress >= 1 || reduced.matches) {
        stop();
        return;
      }
      render(ctx, from, to, morph, progress, stroke, palette);
      frame = requestAnimationFrame(step);
    }
    signal.addEventListener("abort", stop, { once: true });
    frame = requestAnimationFrame(step);
  });
}
