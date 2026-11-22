import type { Plant, Zone } from "@/content/paper/catalog";
import { rectangles, soilBounds, soilPhotoSize, soilPhotoViewport as view, type SoilBounds } from "./soil-geometry";

import { soilTexture } from "./hero-texture";

export type SoilSelection = { zone: Zone; index: number };
type Material = SoilSelection & { bounds: SoilBounds; outline: SoilBounds };
type Pair = { from?: Material; to?: Material };
type Photo = {
  image: HTMLImageElement | HTMLCanvasElement;
  bounds: SoilBounds;
  scaleX: number;
  scaleY: number;
};
type Frame = { photo: Photo; materials: Material[]; selected: Material | null; outlineOpacity: number };

const duration = 680;
const mix = (from: number, to: number, t: number) => from + (to - from) * t;

function ease(progress: number, start = 0, end = 1) {
  const t = Math.max(0, Math.min(1, (progress - start) / (end - start)));
  return t * t * (3 - 2 * t);
}

function photoSource(image: HTMLImageElement): Photo {
  return {
    image,
    bounds: { x: 0, y: 0, ...soilPhotoSize },
    scaleX: image.naturalWidth / soilPhotoSize.width,
    scaleY: image.naturalHeight / soilPhotoSize.height,
  };
}

export function heroFrame(plant: Plant, image: HTMLImageElement, selection: SoilSelection | null): Frame {
  const materials = (Object.keys(plant.zones) as Zone[]).flatMap((zone) =>
    rectangles(plant.zones[zone]).map((rectangle, index) => {
      const outline = soilBounds(rectangle);
      const x = Math.max(view.x, outline.x);
      const y = Math.max(view.y, outline.y);
      return {
        zone,
        index,
        outline,
        bounds: {
          x,
          y,
          width: Math.min(view.x + view.width, outline.x + outline.width) - x,
          height: Math.min(view.y + view.height, outline.y + outline.height) - y,
        },
      };
    }),
  );
  const selected = materials.find(({ zone, index }) => selection?.zone === zone && selection.index === index) ?? null;
  return { photo: photoSource(image), materials, selected, outlineOpacity: selected ? 1 : 0 };
}

function distance(a: SoilBounds, b: SoilBounds) {
  return (a.x + a.width / 2 - b.x - b.width / 2) ** 2 +
    (a.y + a.height / 2 - b.y - b.height / 2) ** 2;
}

function matchMaterials(from: Frame, to: Frame) {
  const unused = new Set(to.materials);
  function takeNearest(material: Material, accepts: (candidate: Material) => boolean) {
    const target = [...unused].filter(accepts)
      .sort((a, b) => distance(material.bounds, a.bounds) - distance(material.bounds, b.bounds))[0];
    if (target) unused.delete(target);
    return target;
  }
  // Some photos show the same mixture in two distinct areas.
  const matched = from.materials.map((material) => ({
    from: material,
    to: takeNearest(material, (candidate) => candidate.zone === material.zone),
  }));
  const darkSoils: Zone[] = ["dark", "peat", "humus"];
  for (const pair of matched) {
    if (!pair.to && darkSoils.includes(pair.from.zone)) {
      // The dark base remains visually continuous when a photo shows the
      // constituents separately and another shows them in the mixture.
      pair.to = takeNearest(pair.from, (candidate) => darkSoils.includes(candidate.zone));
    }
  }
  const pairs: Pair[] = matched;
  for (const material of unused) pairs.push({ to: material });
  return pairs;
}

function viewport(ctx: CanvasRenderingContext2D) {
  const sx = ctx.canvas.width / view.width;
  const sy = ctx.canvas.height / view.height;
  ctx.setTransform(sx, 0, 0, sy, -view.x * sx, -view.y * sy);
}

function paint(ctx: CanvasRenderingContext2D, photo: Photo, crop = view, place = view, opacity = 1) {
  if (opacity <= 0) return;
  ctx.globalAlpha = opacity;
  ctx.drawImage(photo.image,
    (crop.x - photo.bounds.x) * photo.scaleX, (crop.y - photo.bounds.y) * photo.scaleY,
    crop.width * photo.scaleX, crop.height * photo.scaleY,
    place.x, place.y, place.width, place.height);
  ctx.globalAlpha = 1;
}

export function paintHeroPhoto(ctx: CanvasRenderingContext2D, photo: HTMLImageElement) {
  viewport(ctx);
  paint(ctx, photoSource(photo));
}

function interpolate(a: SoilBounds, b: SoilBounds, progress: number): SoilBounds {
  return {
    x: mix(a.x, b.x, progress),
    y: mix(a.y, b.y, progress),
    width: mix(a.width, b.width, progress),
    height: mix(a.height, b.height, progress),
  };
}

function materialFrame(from: Frame, pairs: Pair[], progress: number): Frame {
  if (progress === 0) return from;
  const travel = ease(progress, 0, .96);
  const materials: Material[] = [];
  let selected: Material | null = null;
  let outlineOpacity = from.outlineOpacity;
  for (const { from: previous, to: next } of pairs) {
    if (previous && next) {
      const material = {
        ...(previous === from.selected ? previous : next),
        bounds: interpolate(previous.bounds, next.bounds, travel),
        outline: interpolate(previous.outline, next.outline, travel),
      };
      materials.push(material);
      if (previous === from.selected) {
        selected = material;
        if (previous.zone !== next.zone) outlineOpacity *= 1 - ease(progress, .18, .7);
      }
    } else {
      const material = (previous ?? next)!;
      if (previous ? progress < .62 : progress > .38) materials.push(material);
      if (previous && previous === from.selected) {
        selected = previous;
        outlineOpacity *= 1 - ease(progress, .14, .64);
      }
    }
  }
  return { photo: from.photo, materials, selected, outlineOpacity };
}

function paintWipe(ctx: CanvasRenderingContext2D, from: Photo, to: Photo, progress: number, direction: number) {
  paint(ctx, from);
  const y = view.y;
  const h = view.height;
  const edge = -.36 + progress * 1.72;
  const x = (at: number) => view.x + (direction > 0 ? at : 1 - at) * view.width;
  for (const [offset, opacity] of [[.035, .28], [0, .5], [-.035, 1]]) {
    const front = edge + offset;
    ctx.save();
    ctx.beginPath();
    ctx.moveTo(x(-.2), y);
    ctx.lineTo(x(front + .085), y);
    ctx.bezierCurveTo(x(front - .075), y + h * .32, x(front + .18), y + h * .72, x(front - .1), y + h);
    ctx.lineTo(x(-.2), y + h);
    ctx.closePath();
    ctx.clip();
    paint(ctx, to, view, view, opacity);
    ctx.restore();
  }
}

export function animateHeroMorph(ctx: CanvasRenderingContext2D, from: Frame, to: Frame) {
  const pairs = matchMaterials(from, to);
  const selected = pairs.find((pair) => pair.from && pair.from === from.selected)?.to;
  const selection = selected && selected.zone === from.selected?.zone ? { zone: selected.zone, index: selected.index } : null;
  const reduced = matchMedia("(prefers-reduced-motion: reduce)");
  const canvas = ctx.canvas;
  const style = getComputedStyle(canvas);
  const stroke = 1.6 / Math.max(canvas.clientWidth / view.width, canvas.clientHeight / view.height);
  const tint = style.getPropertyValue("--hero-outline-fill").trim();
  const ink = style.getPropertyValue("--hero-outline-stroke").trim();
  const tracks = pairs.flatMap((pair) =>
    pair.from && pair.to ? [{ from: pair.from.bounds, to: pair.to.bounds }] : [],
  );
  const lead = pairs.find((pair) => pair.from?.zone === "zeolite" && pair.to);
  const direction = lead?.from && lead.to && lead.to.bounds.x > lead.from.bounds.x ? -1 : 1;
  const texture = reduced.matches || document.hidden
    ? null
    : soilTexture(canvas, from.photo, to.photo, tracks, direction);
  let request = 0;
  let progress = 0;
  let resolve!: (completed: boolean) => void;
  const finished = new Promise<boolean>((done) => { resolve = done; });

  function drawPhoto() {
    if (progress === 0) {
      paint(ctx, from.photo);
    } else {
      const eased = ease(progress);
      const surface = texture?.(eased);
      if (surface) ctx.drawImage(surface, view.x, view.y, view.width, view.height);
      else paintWipe(ctx, from.photo, to.photo, eased, -direction);
    }
  }

  function drawFrame() {
    drawPhoto();
    const frame = materialFrame(from, pairs, progress);
    if (!frame.selected || frame.outlineOpacity < .01) return;
    const { x, y, width, height } = frame.selected.outline;
    ctx.globalAlpha = frame.outlineOpacity * .09;
    ctx.fillStyle = tint;
    ctx.fillRect(x, y, width, height);
    ctx.globalAlpha = frame.outlineOpacity;
    ctx.strokeStyle = ink;
    ctx.lineWidth = stroke;
    ctx.strokeRect(x, y, width, height);
    ctx.globalAlpha = 1;
  }

  function stop(completed: boolean) {
    cancelAnimationFrame(request);
    resolve(completed);
  }

  function interrupt(): Frame {
    stop(false);
    // Copy the actual frame without the indicator. The next morph draws that
    // same indicator at its current position, so it can't appear twice.
    drawPhoto();
    const frame = materialFrame(from, pairs, progress);
    const snapshot = document.createElement("canvas");
    snapshot.width = canvas.width;
    snapshot.height = canvas.height;
    snapshot.getContext("2d")!.drawImage(canvas, 0, 0);
    return {
      ...frame,
      photo: { image: snapshot, bounds: view, scaleX: canvas.width / view.width, scaleY: canvas.height / view.height },
    };
  }

  if (reduced.matches || document.hidden) {
    stop(true);
  } else {
    viewport(ctx);
    drawFrame();
    canvas.dataset.animating = "true";
    const started = performance.now();
    function step(now: number) {
      progress = Math.min(1, (now - started) / duration);
      if (progress >= 1 || reduced.matches) {
        stop(true);
        return;
      }
      drawFrame();
      request = requestAnimationFrame(step);
    }
    request = requestAnimationFrame(step);
  }

  return { selection, finished, interrupt, cancel: () => stop(false) };
}
