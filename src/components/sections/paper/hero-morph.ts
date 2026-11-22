import type { Plant, Zone } from "@/content/paper/catalog";
import { rectangles, soilBounds, soilPhotoSize, soilPhotoViewport as view, type SoilBounds } from "./soil-geometry";

export type SoilSelection = { zone: Zone; index: number };
type Tile = SoilSelection & { bounds: SoilBounds };
type TilePair = { from?: Tile; to?: Tile };
type Palette = { outline: string; tint: string; shadow: string };
type Backdrops = { from: HTMLCanvasElement; to: HTMLCanvasElement };

const duration = 820;
const full = { x: 0, y: 0, ...soilPhotoSize };
const mix = (a: number, b: number, t: number) => a + (b - a) * t;

function ease(progress: number, start = 0, end = 1) {
  const t = Math.max(0, Math.min(1, (progress - start) / (end - start)));
  return (1 - Math.cos(Math.PI * t)) / 2;
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

function backdrop(photo: HTMLImageElement) {
  const canvas = document.createElement("canvas");
  canvas.width = 28;
  canvas.height = 20;
  const ctx = canvas.getContext("2d")!;
  paint(ctx, photo, view, { x: 0, y: 0, width: canvas.width, height: canvas.height });
  return canvas;
}

function paintBackdrop(ctx: CanvasRenderingContext2D, backdrops: Backdrops, progress: number) {
  ctx.drawImage(backdrops.from, view.x, view.y, view.width, view.height);
  ctx.globalAlpha = ease(progress, .14, .86);
  ctx.drawImage(backdrops.to, view.x, view.y, view.width, view.height);
  ctx.globalAlpha = 1;
}

function paintTile(
  ctx: CanvasRenderingContext2D, photo: HTMLImageElement,
  source: SoilBounds, box: SoilBounds, opacity: number,
) {
  const ratio = box.width / box.height;
  const width = Math.min(source.width, source.height * ratio);
  const height = Math.min(source.height, source.width / ratio);
  paint(ctx, photo, {
    x: source.x + (source.width - width) / 2,
    y: source.y + (source.height - height) / 2,
    width,
    height,
  }, box, opacity);
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
  morph: Morph, backdrops: Backdrops, progress: number, stroke: number, palette: Palette,
) {
  if (progress === 0) {
    paint(ctx, from);
    if (morph.selected?.from) outline(ctx, morph.selected.from.bounds, .95, stroke, palette);
    return;
  }

  // Keep a softly resolved version of the scene in the gaps between moving pieces.
  paintBackdrop(ctx, backdrops, progress);
  if (progress < .22) paint(ctx, from, view, view, 1 - ease(progress, 0, .22));
  if (progress > .79) paint(ctx, to, view, view, ease(progress, .79, .99));
  let accentBounds: SoilBounds | undefined;

  for (const [index, pair] of morph.pairs.entries()) {
    const a = (pair.from ?? pair.to)!.bounds;
    const b = (pair.to ?? pair.from)!.bounds;
    const t = ease(progress, index % 4 * .014, .955);
    const lift = Math.sin(Math.PI * t);
    const shared = pair.from && pair.to;
    const alpha = shared ? 1 : pair.from
      ? 1 - ease(progress, .18, .76)
      : ease(progress, .28, .945);
    const stretch = mix(.92, 1, alpha);
    const width = mix(a.width, b.width, t);
    const height = mix(a.height, b.height, t);
    const inset = 2.5 * lift;
    const box = {
      x: mix(a.x, b.x, t) + width * (1 - stretch) / 2 + inset,
      y: mix(a.y, b.y, t) + height * (1 - stretch) / 2 + inset - 10 * lift,
      width: width * stretch - 2 * inset,
      height: height * stretch - 2 * inset,
    };
    if (pair === morph.accent) accentBounds = box;
    if (alpha === 0 || box.width <= 0 || box.height <= 0) continue;
    ctx.fillStyle = palette.shadow;
    ctx.globalAlpha = alpha * lift * .72;
    ctx.fillRect(box.x + 2 * lift, box.y + 6 * lift, box.width, box.height);
    ctx.globalAlpha = 1;
    if (pair.from) paintTile(ctx, from, a, box, alpha);
    if (pair.to) paintTile(ctx, to, b, box, shared ? ease(t, .32, .94) : alpha);
  }
  if (accentBounds) {
    const intensity = morph.selected
      ? morph.selection ? .95 : .95 * (1 - ease(progress, .24, .75))
      : .82 * ease(progress, .07, .27) * (1 - ease(progress, .72, .965));
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
  const backdrops = { from: backdrop(from), to: backdrop(to) };
  viewport(ctx);
  render(ctx, from, to, morph, backdrops, 0, stroke, palette);
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
      render(ctx, from, to, morph, backdrops, progress, stroke, palette);
      frame = requestAnimationFrame(step);
    }
    signal.addEventListener("abort", stop, { once: true });
    frame = requestAnimationFrame(step);
  });
}
