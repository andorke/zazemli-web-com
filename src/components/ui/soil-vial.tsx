import { cn } from "@/lib/utils";

/*
 * Мерная колба грунта (soil-vials-spec.md v1.0). Сегменты по 4 функциям, доли в % объёма.
 * Цвет сегмента = по группе (земляные токены — санкционировано спекой для этой иллюстрации):
 *   Основа soil · Влага moss · Воздух sand · Дренаж pumice.
 * Порядок снизу вверх: Дренаж → Основа → Влага → Воздух. Сегмент 0% не рисуется.
 * Стиль MJ-атмосферы придёт с иллюстрациями; вектор несёт точные доли (бриф §7 NB).
 */

export type VialSegments = {
  base: number; // Основа и питание
  moisture: number; // Влага
  air: number; // Воздух
  drainage: number; // Дренаж и каркас
};

// сверху вниз
const topToBottom = [
  { key: "air", bg: "bg-sand" },
  { key: "moisture", bg: "bg-moss" },
  { key: "base", bg: "bg-soil" },
  { key: "drainage", bg: "bg-pumice" },
] as const;

export function SoilVial({
  segments,
  className,
}: {
  segments: VialSegments;
  className?: string;
}) {
  return (
    <div
      aria-hidden="true"
      className={cn("flex flex-col items-center", className)}
    >
      {/* пробка апотекарной колбы */}
      <span className="bg-charcoal/80 h-2 w-5" />
      <span className="bg-charcoal/40 h-1.5 w-7" />
      {/* тело колбы с сегментами */}
      <div className="border-charcoal/40 flex h-52 w-9 flex-col overflow-hidden border">
        {topToBottom.map(
          ({ key, bg }) =>
            segments[key] > 0 && (
              <div
                key={key}
                className={bg}
                style={{ height: `${segments[key]}%` }}
              />
            ),
        )}
      </div>
    </div>
  );
}
