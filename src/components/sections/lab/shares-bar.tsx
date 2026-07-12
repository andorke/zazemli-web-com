import { dotColor } from "@/components/ui/material-dot";
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
 */
export function SharesBar({
  shares,
  className,
}: {
  shares: Record<SoilFunction, number>;
  className?: string;
}) {
  const title = ORDER.filter((fn) => shares[fn] > 0)
    .map((fn) => `${LABEL[fn]} ${shares[fn]}`)
    .join(" · ");

  return (
    <span
      aria-hidden="true"
      title={title}
      className={cn("flex h-[10px] w-full overflow-hidden", className)}
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
