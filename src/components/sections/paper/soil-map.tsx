"use client";

import { useState, type KeyboardEvent, type PointerEvent } from "react";
import {
  materialName,
  paperAsset,
  regionMaterials,
  silhouette,
  type Plant,
  type Rectangle,
  type Zone,
} from "@/content/paper/catalog";
import { rectangles, soilBounds as svgBounds, soilPhotoSize, soilPhotoViewport } from "./soil-geometry";

export function inspectWithPointer(event: PointerEvent, action: () => void) {
  if (event.pointerType === "mouse") action();
}

export function inspectWithKeys(
  event: KeyboardEvent,
  action: () => void,
  close: () => void,
) {
  if (event.key === " " || event.key === "Enter") {
    event.preventDefault();
    action();
  } else if (event.key === "Escape") {
    close();
  }
}

function SoilHighlight({ rectangle, focusOnly }: { rectangle?: Rectangle; focusOnly: boolean }) {
  const [last, setLast] = useState(rectangle);
  if (rectangle && last !== rectangle) setLast(rectangle);
  const current = rectangle ?? last;
  if (!current) return null;
  const { x, y, width, height } = svgBounds(current);
  return (
    <rect
      className="soil-highlight"
      data-visible={Boolean(rectangle)}
      data-focus-only={focusOnly || undefined}
      width="1"
      height="1"
      vectorEffect="non-scaling-stroke"
      style={{ transform: `translate(${x}px, ${y}px) scale(${width}, ${height})` }}
    />
  );
}

export function SoilMap({
  plant,
  variant,
  active,
  activeIndex = 0,
  showPhoto = true,
  onInspect,
}: {
  plant: Plant;
  variant: "hero" | "catalog" | "lab";
  active: Zone | null;
  activeIndex?: number;
  showPhoto?: boolean;
  onInspect: (zone: Zone | null, index?: number) => void;
}) {
  const [focused, setFocused] = useState<{ zone: Zone; index: number } | null>(null);
  const id =
    variant === "hero"
      ? "mosaic"
      : `${variant}-${variant === "lab" ? "map" : "mosaic"}`;
  const clip = `${variant}-silhouette`;
  const description = {
    hero: "Интерактивная раскладка грунта",
    catalog: `Раскладка грунта для ${plant.gen}`,
    lab: `Компоненты грунта для ${plant.gen}`,
  }[variant];
  const zones = Object.entries(plant.zones) as [Zone, Rectangle | Rectangle[]][];
  const selected = rectangles(active === null ? undefined : plant.zones[active]);
  const focusedRectangle = focused ? rectangles(plant.zones[focused.zone])[focused.index] : undefined;
  const focusOnly = selected.length === 0 && focusedRectangle !== undefined;
  const highlighted = focusOnly ? [focusedRectangle]
    : variant === "hero" ? selected.slice(activeIndex, activeIndex + 1) : selected;
  const slots = variant === "hero" ? 1 : Math.max(...zones.map(([, shape]) => rectangles(shape).length));
  const content = (
    <>
      {showPhoto && (
        <image
          {...soilPhotoSize}
          preserveAspectRatio="none"
          href={paperAsset(`soil-${plant.slug}.webp`)}
        />
      )}
      <g aria-hidden="true" pointerEvents="none">
        {Array.from({ length: slots }, (_, index) => (
          <SoilHighlight
            key={`${plant.slug}-${index}`}
            rectangle={highlighted[index]}
            focusOnly={focusOnly && index === 0}
          />
        ))}
      </g>
      <g
        id={
          variant === "hero"
            ? "targets"
            : `${variant}-${variant === "lab" ? "zones" : "targets"}`
        }
      >
        {zones.flatMap(([zone, shape]) => {
          const labels = regionMaterials(plant, zone);
          if (!labels.length) return [];
          const label =
            zone === "dark" && variant !== "lab"
              ? "Тёмные компоненты смеси"
              : labels
                  .map(
                    (material) =>
                      materialName(material) +
                      (variant === "hero"
                        ? ""
                        : `${variant === "catalog" ? "," : ""} ${plant.recipe[material]}%`),
                  )
                  .join(", ");
          return rectangles(shape).map((rectangle, i) => (
            <rect
              key={`${zone}-${i}`}
              {...svgBounds(rectangle)}
              className={variant === "lab" ? "lab-target" : "soil-target"}
              role="button"
              tabIndex={0}
              aria-label={label}
              aria-pressed={active === zone && (variant !== "hero" || activeIndex === i)}
              data-key={variant === "lab" ? undefined : zone}
              data-region={variant === "lab" ? zone : undefined}
              data-active={active === zone && (variant !== "hero" || activeIndex === i)}
              onPointerEnter={(event) =>
                inspectWithPointer(event, () => onInspect(zone, i))
              }
              onFocus={() => {
                setFocused({ zone, index: i });
                onInspect(zone, i);
              }}
              onBlur={() => setFocused(null)}
              onClick={() => onInspect(zone, i)}
              onKeyDown={(event) =>
                inspectWithKeys(
                  event,
                  () => onInspect(zone, i),
                  () => onInspect(null),
                )
              }
            />
          ));
        })}
      </g>
    </>
  );

  // Обрезаем белые углы фотографии и сохраняем совмещение с активными областями.
  return (
    <svg
      id={id}
      viewBox={Object.values(soilPhotoViewport).join(" ")}
      preserveAspectRatio={variant === "hero" ? "xMidYMid slice" : undefined}
      role="group"
      aria-label={description}
    >
      {variant === "hero" ? (
        content
      ) : (
        <>
          <defs>
            <clipPath id={clip} clipPathUnits="objectBoundingBox">
              <path d={silhouette} />
            </clipPath>
          </defs>
          <g clipPath={`url(#${clip})`}>{content}</g>
        </>
      )}
    </svg>
  );
}
