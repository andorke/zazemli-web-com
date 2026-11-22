"use client";

/* eslint-disable @next/next/no-img-element -- Исходный размер и кадрирование лабораторных фото. */
import { useRef, useState, useSyncExternalStore, type CSSProperties, type ReactNode } from "react";
import { flushSync } from "react-dom";
import {
  capitalize,
  findPlant,
  firstRegion,
  materialName,
  materials,
  mixes,
  paperAsset,
  plants,
  regionMaterials,
  type Material,
  type Plant,
  type Zone,
} from "@/content/paper/catalog";
import { reachGoal } from "@/lib/metrika";
import { JourneyLink } from "./journey-link";
import { decodePaperImage, labImageFiles, startPaperTransition, useFirstPaperImages } from "./motion";
import { SoilMap } from "./soil-map";

function subscribe(onChange: () => void) {
  window.addEventListener("hashchange", onChange);
  window.addEventListener("popstate", onChange);
  window.addEventListener("zazemli-lab", onChange);
  return () => {
    window.removeEventListener("hashchange", onChange);
    window.removeEventListener("popstate", onChange);
    window.removeEventListener("zazemli-lab", onChange);
  };
}

const selectedSlug = () => location.hash.slice(1).replace(/^rec-/, "");
const initialSlug = () => "monstera";
const maxRows = Math.max(...plants.map((entry) => Object.keys(entry.recipe).length));

export function PaperLab({ glossary }: { glossary: ReactNode }) {
  const slug = useSyncExternalStore(subscribe, selectedSlug, initialSlug);
  const plant = findPlant(slug) ?? plants[0];
  useFirstPaperImages("lab", plant.slug);
  const [focused, setFocused] = useState<string>();
  const selectionRequest = useRef(0);
  const transitionFinished = useRef<Promise<void> | null>(null);
  const mixPhoto = useRef<HTMLImageElement>(null);

  async function choose(entry: Plant) {
    const request = ++selectionRequest.current;
    if (entry.slug === plant.slug) return;
    const before = location.href;
    const assets = await Promise.allSettled(labImageFiles(entry.slug).map(decodePaperImage));
    await transitionFinished.current;
    if (assets.some((asset) => asset.status === "rejected")) return;
    const current = () => request === selectionRequest.current && location.href === before;
    if (!current()) return;
    transitionFinished.current = startPaperTransition(async () => {
      if (!current()) return;
      const url = new URL(before);
      url.hash = entry.slug;
      flushSync(() => {
        history.replaceState(history.state, "", url);
        window.dispatchEvent(new Event("zazemli-lab"));
      });
      reachGoal("plant_select", { plant_slug: entry.slug, source: "lab" });
      await mixPhoto.current?.decode().catch(() => {});
    }, "recipe-morph");
  }

  function focusMaterial(id: Material) {
    const card = document.getElementById(`component-${id}`);
    if (!card) return;
    setFocused(id);
    card.tabIndex = -1;
    card.scrollIntoView({ block: "start" });
    card.focus({ preventScroll: true });
  }

  return (
    <main id="main" className="reading" data-current-material={focused}>
      <div className="intro lab-intro">
        <div>
          <h1>Лаборатория грунта</h1>
          <p>
            Рассмотри рецепт для своего растения на фото. Ниже — как работает
            каждый компонент.
          </p>
        </div>
        <div className="lab-photo-frame">
          <img
            className="lab-mix-photo"
            id="lab-mix-photo"
            ref={mixPhoto}
            src={paperAsset(`lab-soil/${plant.slug}.webp`)}
            width={1600}
            height={2000}
            alt={`Готовый грунт для ${plant.gen}`}
            fetchPriority="high"
          />
        </div>
      </div>
      <section className="lab-plant-choice" aria-labelledby="lab-plant-label">
        <h2 id="lab-plant-label">Выбери растение</h2>
        <div
          className="lab-plant-picker"
          id="lab-plant-picker"
          role="group"
          aria-labelledby="lab-plant-label"
        >
          {plants.map((entry) => (
            <button
              key={entry.slug}
              type="button"
              data-plant={entry.slug}
              aria-pressed={entry.slug === plant.slug}
              onClick={() => void choose(entry)}
            >
              {capitalize(entry.name)}
            </button>
          ))}
        </div>
      </section>
      <LabRecipe plant={plant} onRead={focusMaterial} />
      <div className="book-links">
        <JourneyLink
          className="book-cta"
          id="lab-product"
          href={`/?plant=${plant.slug}#soils`}
          onClick={() =>
            reachGoal("lab-to-collectio", { plant_slug: plant.slug })
          }
        >
          Грунт для {plant.gen} в каталоге →
        </JourneyLink>
        <JourneyLink href="/guide">Как пересадить растение →</JourneyLink>
      </div>
      {glossary}
    </main>
  );
}

function LabRecipe({
  plant,
  onRead,
}: {
  plant: Plant;
  onRead: (material: Material) => void;
}) {
  const [selection, setSelection] = useState<{
    zone: Zone | null;
    only?: Material;
  }>();
  const only = selection?.only && selection.only in plant.recipe ? selection.only : undefined;
  const zone = only
    ? (plant.zones[only] ? only : "dark")
    : selection?.zone === null || (selection?.zone && plant.zones[selection.zone])
      ? selection.zone
      : firstRegion(plant);
  const active = only ? [only] : regionMaterials(plant, zone);
  return (
    <>
      <section className="lab-board" aria-labelledby="mix-title">
        <figure className="lab-map">
          <SoilMap
            variant="lab"
            plant={plant}
            active={zone}
            onInspect={(zone) => setSelection({ zone })}
          />
          <figcaption>Доли указаны по объёму смеси</figcaption>
        </figure>
        <aside>
          <h2 id="mix-title">Смесь для {plant.gen}</h2>
          <p id="mix-purpose">{mixes[plant.slug]}</p>
          <p className="lab-instructions">
            Выбери участок фото или строку состава.
          </p>
          <div
            className="material"
            id="material-info"
            aria-live="polite"
            aria-atomic="true"
          >
            {active.map((key) => (
              <MaterialInfo
                key={key}
                material={key}
                share={plant.recipe[key]!}
                onRead={onRead}
              />
            ))}
          </div>
        </aside>
      </section>
      <details className="read-more materials">
        <summary>Состав выбранной смеси</summary>
        <ul
          className="ingredients"
          id="lab-list"
          style={{
            "--lab-recipe-rows": maxRows,
            "--lab-recipe-row-pairs": Math.ceil(maxRows / 2),
          } as CSSProperties}
        >
          {(Object.entries(plant.recipe) as [Material, number][]).map(
            ([key, share]) => (
              <li key={key} style={{ "--recipe-transition": `recipe-${key}` } as CSSProperties}>
                <button
                  type="button"
                  data-id={key}
                  aria-pressed={active.includes(key)}
                  onClick={() =>
                    setSelection({
                      zone: plant.zones[key] ? key : "dark",
                      only: key,
                    })
                  }
                >
                  {materialName(key)}
                  <span>{share}%</span>
                </button>
                {only === key && (
                  <div className="lab-inline-material">
                    <MaterialInfo material={key} share={share} onRead={onRead} />
                  </div>
                )}
              </li>
            ),
          )}
        </ul>
      </details>
    </>
  );
}

function MaterialInfo({
  material,
  share,
  onRead,
}: {
  material: Material;
  share: number;
  onRead: (material: Material) => void;
}) {
  return (
    <div className="soil-material-reading">
      <h3>
        {materialName(material)} · {share}%
      </h3>
      <p>{materials[material][1]}</p>
      <a
        className="lab-component-link"
        href={`#component-${material}`}
        aria-label={`Подробнее: ${materialName(material)}`}
        onClick={(event) => {
          event.preventDefault();
          onRead(material);
        }}
      >
        Подробнее о компоненте ↓
      </a>
    </div>
  );
}
