"use client";

import { dotColor } from "@/components/ui/material-dot";
import { useReveal } from "@/components/ui/reveal";
import type { SoilFunction } from "@/content/lab";
import { cn } from "@/lib/utils";
import { FUNCTION_MATERIAL } from "./soil-function-colors";

const ORDER: SoilFunction[] = ["base", "air", "water", "drain"];
const LABEL: Record<SoilFunction, string> = {
  base: "основа",
  air: "воздух",
  water: "влага",
  drain: "дренаж",
};

/*
 * Полоска долей рецептуры по 4 функциям (прототип .g4): сегменты шире там,
 * где функция весомее. Числовой смысл дублирует текст рядом (tag/bio), поэтому
 * полоска — декор, aria-hidden (как в прототипе).
 * Прорисовка сегментов (qr-welcome, D5) живёт в globals.css: полоска в шапке
 * карточки рисуется по классу `in` при входе в вьюпорт, полоска внутри — на
 * раскрытии <details>. Ширина сегмента статична, едет только transform.
 */
export function SharesBar({
  shares,
  className,
}: {
  shares: Record<SoilFunction, number>;
  className?: string;
}) {
  const ref = useReveal<HTMLSpanElement>();
  const title = ORDER.filter((fn) => shares[fn] > 0)
    .map((fn) => `${LABEL[fn]} ${shares[fn]}`)
    .join(" · ");

  return (
    <span
      ref={ref}
      aria-hidden="true"
      title={title}
      className={cn(
        "shares-bar flex h-[10px] w-full overflow-hidden",
        className,
      )}
    >
      {ORDER.filter((fn) => shares[fn] > 0).map((fn) => (
        <span
          key={fn}
          className={dotColor[FUNCTION_MATERIAL[fn]]}
          style={{ width: `${shares[fn]}%` }}
        />
      ))}
    </span>
  );
}
