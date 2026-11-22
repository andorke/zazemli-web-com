"use client";

/* eslint-disable @next/next/no-img-element -- Макрофото оригинальной раскладки. */
import { useEffect, useRef, useState, useSyncExternalStore } from "react";
import { flushSync } from "react-dom";
import {
  findPlant,
  capitalize,
  materialName,
  paperAsset,
  plants,
  regionMaterials,
  type Plant,
  type PlantSlug,
  type Zone,
} from "@/content/paper/catalog";
import { animateHeroMorph, heroFrame, paintHeroPhoto, type SoilSelection } from "./hero-morph";
import { decodePaperImage } from "./motion";
import { soilPhotoSize } from "./soil-geometry";
import { SoilMap } from "./soil-map";

const initialPlant = findPlant("anthurium")!;
const heroPlants = [initialPlant, ...plants.filter((plant) => plant !== initialPlant)];
const subscribeClient = () => () => {};
type Scene = { plant: Plant; selection: SoilSelection | null; painted: boolean };

export function PaperHero() {
  const [scene, setScene] = useState<Scene>({ plant: initialPlant, selection: null, painted: false });
  const [pending, setPending] = useState<PlantSlug | null>(null);
  const interactive = useSyncExternalStore(subscribeClient, () => true, () => false);
  const current = useRef(scene);
  const canvas = useRef<HTMLCanvasElement>(null);
  const photos = useRef(new Map<PlantSlug, Promise<HTMLImageElement>>());
  const displayedPhoto = useRef<HTMLImageElement | null>(null);
  const order = useRef(0);
  const playback = useRef<ReturnType<typeof animateHeroMorph> | null>(null);
  const { plant, selection, painted } = scene;
  const material = selection?.zone ?? null;

  useEffect(() => () => {
    order.current++;
    playback.current?.cancel();
  }, []);

  function commit(next: Scene) {
    current.current = next;
    setScene(next);
  }

  function photo(slug: PlantSlug) {
    const cached = photos.current.get(slug);
    if (cached) return cached;
    const loading = decodePaperImage(`soil-${slug}.webp`).catch((error) => {
      photos.current.delete(slug);
      throw error;
    });
    photos.current.set(slug, loading);
    return loading;
  }

  function inspect(zone: Zone | null, index = 0) {
    if (canvas.current?.dataset.animating) return;
    const scene = current.current;
    if (scene.selection?.zone === zone && scene.selection.index === index) return;
    commit({ ...scene, selection: zone ? { zone, index } : null });
  }

  async function choose(target: Plant) {
    if (target.slug === pending) return;
    const selectedOrder = ++order.current;
    if (target.slug === current.current.plant.slug && !playback.current) {
      setPending(null);
      return;
    }
    setPending(target.slug);
    let image: HTMLImageElement;
    try {
      image = await photo(target.slug);
    } catch {
      if (selectedOrder === order.current) setPending(null);
      return;
    }
    if (selectedOrder !== order.current) return;

    const firstPhoto = displayedPhoto.current ? null : await photo(initialPlant.slug).catch(() => null);
    if (selectedOrder !== order.current) return;

    const context = canvas.current?.getContext("2d");
    const previous = current.current;
    const original = displayedPhoto.current ?? firstPhoto;
    const from = playback.current?.interrupt() ?? (original && heroFrame(previous.plant, original, previous.selection));
    const motion = context && from && animateHeroMorph(context, from, heroFrame(target, image, null));
    if (motion) {
      playback.current = motion;
      if (!(await motion.finished)) return;
    }
    playback.current = null;
    displayedPhoto.current = image;

    // Keep the decoded final frame aligned with the interactive SVG map.
    if (context) {
      paintHeroPhoto(context, image);
      context.canvas.dataset.plant = target.slug;
    }
    flushSync(() => {
      commit({ plant: target, selection: motion ? motion.selection : null, painted: Boolean(context) });
      if (selectedOrder === order.current) setPending(null);
    });
    if (context) delete context.canvas.dataset.animating;
  }

  return (
    <section className="hero" data-plant={plant.slug} aria-labelledby="hero-title">
      <svg className="hero-photo-contours" width="0" height="0" aria-hidden="true">
        <defs>
          <clipPath id="hero-photo-wide" clipPathUnits="objectBoundingBox">
            <path d="M 0 0 H .969 Q 1 0 .995 .035 L .86 1 H 0 Z" />
          </clipPath>
          <clipPath id="hero-photo-narrow" clipPathUnits="objectBoundingBox">
            <path d="M 0 0 H .952 Q 1 0 1 .073 V .93 L 0 1 Z" />
          </clipPath>
        </defs>
      </svg>
      <div className="material-stage" id="stage" aria-busy={pending !== null}>
        <canvas className="hero-morph" ref={canvas} {...soilPhotoSize} aria-hidden="true" />
        <SoilMap
          plant={plant}
          variant="hero"
          active={material}
          activeIndex={selection?.index}
          showPhoto={!painted}
          onInspect={inspect}
        />
        <div className="stage-legend">
          <span className="probe" aria-hidden="true">
            ⊙
          </span>
          <span id="stage-caption" aria-live="polite">Грунт для {plant.gen}</span>
        </div>
      </div>
      <div className="hero-copy">
        <h1 id="hero-title">
          <span>Заземли растение.</span> <span>Заземли себя.</span>
        </h1>
        <p className="hero-product">Авторский грунт под твои растения.</p>
        <hr className="hero-rule" />
        <p className="hero-lead">Корням есть что пить и чем дышать</p>
        <div className="hero-choices" role="group" aria-label="Раскладки грунта">
          {heroPlants.map((entry) => (
            <button
              key={entry.slug}
              type="button"
              disabled={!interactive}
              aria-pressed={entry.slug === (pending ?? plant.slug)}
              data-pending={entry.slug === pending || undefined}
              onClick={() => { void choose(entry); }}
            >
              {capitalize(entry.name)}
            </button>
          ))}
        </div>
        <div className="hero-bottom">
          <div className="sample-area">
            <div id="sample" aria-live="polite" aria-atomic="true">
              <div
                className="sample-inner"
                key={material ?? "prompt"}
                data-sample-selected={material ?? undefined}
              >
                {material === null ? (
                  <>
                    <span className="sample-disc">⊙</span>
                    <span className="sample-text">Выбери материал на фото</span>
                  </>
                ) : material === "dark" ? (
                  <span className="sample-text">
                    {regionMaterials(plant, material)
                      .map(materialName)
                      .join(" / ")}
                  </span>
                ) : (
                  <>
                    <img src={paperAsset(`macro-${material}.webp`)} alt="" />
                    <strong>{materialName(material)}</strong>
                  </>
                )}
              </div>
            </div>
          </div>
          <div className="hero-actions">
            <a className="action light" href="#soils">
              Купить грунт <span aria-hidden="true">↓</span>
            </a>
          </div>
        </div>
      </div>
    </section>
  );
}
