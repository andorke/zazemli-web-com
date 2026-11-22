"use client";

/* eslint-disable @next/next/no-img-element -- Макрофото оригинальной раскладки. */
import { useState } from "react";
import {
  findPlant,
  materialName,
  paperAsset,
  regionMaterials,
  type Zone,
} from "@/content/paper/catalog";
import { SoilMap } from "./soil-map";

const plant = findPlant("anthurium")!;

export function PaperHero() {
  const [material, setMaterial] = useState<Zone | null>(null);
  return (
    <section className="hero" aria-labelledby="hero-title">
      <div className="material-stage" id="stage">
        <SoilMap
          plant={plant}
          variant="hero"
          active={material}
          onInspect={setMaterial}
        />
        <div className="stage-legend">
          <span className="probe" aria-hidden="true">
            ⊙
          </span>
          <span id="stage-caption">Грунт для {plant.gen}</span>
        </div>
      </div>
      <div className="hero-copy">
        <h1 id="hero-title">
          <span>Заземли растение.</span> <span>Заземли себя.</span>
        </h1>
        <p className="hero-product">Авторский грунт под твои растения.</p>
        <hr className="hero-rule" />
        <p className="hero-lead">Корням есть что пить и чем дышать</p>
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
