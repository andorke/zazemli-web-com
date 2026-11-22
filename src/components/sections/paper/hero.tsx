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
import { animateHeroMorph, paintHeroPhoto, prepareHeroMorph, type SoilSelection } from "./hero-morph";
import { decodePaperImage } from "./motion";
import { soilPhotoSize } from "./soil-geometry";
import { SoilMap } from "./soil-map";

const initialPlant = findPlant("anthurium")!;
const heroPlants = [initialPlant, ...plants.filter((plant) => plant !== initialPlant)];
const subscribeClient = () => () => {};
type Scene = { plant: Plant; selection: SoilSelection | null; painted: boolean };
type Choice = { plant: Plant; image: HTMLImageElement; order: number };

export function PaperHero() {
  const [scene, setScene] = useState<Scene>({ plant: initialPlant, selection: null, painted: false });
  const [pending, setPending] = useState<PlantSlug | null>(null);
  const interactive = useSyncExternalStore(subscribeClient, () => true, () => false);
  const current = useRef(scene);
  const canvas = useRef<HTMLCanvasElement>(null);
  const photos = useRef(new Map<PlantSlug, Promise<HTMLImageElement>>());
  const queued = useRef<Choice | null>(null);
  const order = useRef(0);
  const playback = useRef<AbortController | null>(null);
  const { plant, selection, painted } = scene;
  const material = selection?.zone ?? null;

  useEffect(() => () => {
    order.current++;
    queued.current = null;
    playback.current?.abort();
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

  async function playReadyChoices() {
    if (playback.current) return;
    const controller = new AbortController();
    playback.current = controller;
    try {
      while (queued.current && !controller.signal.aborted) {
        const choice = queued.current;
        queued.current = null;
        const previous = current.current.plant;
        if (previous.slug === choice.plant.slug) {
          setPending(null);
          continue;
        }
        const original = await photo(previous.slug).catch(() => null);
        if (choice.order !== order.current || controller.signal.aborted) continue;
        const morph = prepareHeroMorph(previous, choice.plant, current.current.selection);
        const context = canvas.current?.getContext("2d");
        if (context && original) {
          await animateHeroMorph(context, original, choice.image, morph, controller.signal);
        }
        if (controller.signal.aborted) return;

        // Keep the decoded final frame under the interactive SVG map.
        if (context) {
          paintHeroPhoto(context, choice.image);
          context.canvas.dataset.plant = choice.plant.slug;
        }
        flushSync(() => {
          commit({ plant: choice.plant, selection: morph.selection, painted: Boolean(context) });
          if (choice.order === order.current) setPending(null);
        });
        if (context) delete context.canvas.dataset.animating;
      }
    } finally {
      playback.current = null;
    }
  }

  async function choose(target: Plant) {
    const selectedOrder = ++order.current;
    queued.current = null;
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
    queued.current = { plant: target, image, order: selectedOrder };
    void playReadyChoices();
  }

  return (
    <section className="hero" data-plant={plant.slug} aria-labelledby="hero-title">
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
              aria-pressed={entry.slug === plant.slug}
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
