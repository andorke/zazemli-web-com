import { cn } from "@/lib/utils";

/*
 * Мерная колба грунта: нарисованное стекло (PNG-эскиз, эталон Figma 185:143) + цветные сегменты по 4 функциям.
 *
 * Механизм «цвет никогда не вылезает за стекло»:
 *   слои земли рисуются полосами ЗАВЕДОМО ШИРЕ стекла, но контейнер слоёв обрезан CSS-маской
 *   (soil-vial-mask.png) — силуэтом внутренней полости колбы. Маска физически отсекает всё за
 *   стенками, при любых segments и любой ширине. Маску генерит scripts из самого PNG (по строкам
 *   тела с эрозией на толщину стенки) — заменишь колбу, перегенеришь маску.
 * Поверх слоёв лежит PNG через mix-blend-multiply: белый фон стекла уходит в bone, штриховка и
 * мерные засечки ложатся на землю как настоящее стекло. Подписи групп — справа, voice italic.
 * Порядок снизу вверх: основа → дренаж → влага → воздух. Сегмент 0% не рисуется.
 * Цвет сегмента = по группе (земляные токены — санкционировано спекой для иллюстрации).
 */

export type VialSegments = {
  base: number; // Основа и питание
  drainage: number; // Дренаж и каркас
  moisture: number; // Влага
  air: number; // Воздух
};

// снизу вверх
const GROUPS = [
  { key: "base", label: "основа и питание", fill: "var(--color-soil)" },
  { key: "drainage", label: "дренаж и каркас", fill: "var(--color-ceramsite)" },
  { key: "moisture", label: "влага", fill: "var(--color-moss)" },
  { key: "air", label: "воздух", fill: "var(--color-pumice)" },
] as const;

// Вертикальная зона тела (% от рамки PNG 600×900) — должна совпадать с y0/y1 в генераторе маски.
// По горизонтали слои нарочно шире стекла: за форму отвечает маска, не эти числа.
const BODY = { top: 25.5, bottom: 89.5 };
const SPREAD = { left: 30, right: 70 }; // полосы шире стекла — маска обрежет по полости
const H = BODY.bottom - BODY.top;
const GLASS_RIGHT = 66.5; // якорь подписей: правее стекла с небольшим зазором

export function SoilVial({
  segments,
  className,
}: {
  segments: VialSegments;
  className?: string;
}) {
  // раскладка сегментов снизу вверх (чисто, без мутации: смещение = доли групп ниже)
  const visible = GROUPS.map((g) => ({ ...g, pct: segments[g.key] })).filter(
    (b) => b.pct > 0,
  );
  const bands = visible.map((g, i) => {
    const belowPct = visible.slice(0, i).reduce((sum, b) => sum + b.pct, 0);
    const h = (g.pct / 100) * H;
    const bottom = BODY.bottom - (belowPct / 100) * H;
    const top = bottom - h;
    return { ...g, top, h, mid: top + h / 2 };
  });

  return (
    <div
      className={cn("relative aspect-[600/900]", className)}
      role="img"
      aria-label="Состав грунта по функциям"
    >
      {/* слои земли, обрезанные маской-силуэтом полости — цвет не выходит за стекло */}
      <div
        className="absolute inset-0"
        style={{
          WebkitMaskImage: "url(/soil-vial-mask.png)",
          maskImage: "url(/soil-vial-mask.png)",
          WebkitMaskSize: "contain",
          maskSize: "contain",
          WebkitMaskRepeat: "no-repeat",
          maskRepeat: "no-repeat",
          WebkitMaskPosition: "center",
          maskPosition: "center",
        }}
      >
        {bands.map((b) => (
          <div
            key={b.key}
            className="absolute"
            style={{
              left: `${SPREAD.left}%`,
              width: `${SPREAD.right - SPREAD.left}%`,
              top: `${b.top}%`,
              height: `${b.h}%`,
              backgroundColor: b.fill,
            }}
          />
        ))}
      </div>

      {/* eslint-disable-next-line @next/next/no-img-element -- статичный экспорт без next/image */}
      <img
        src="/soil-vial.png"
        alt=""
        aria-hidden
        className="absolute inset-0 h-full w-full object-contain"
        style={{ mixBlendMode: "multiply" }}
      />

      {/* подписи групп — вплотную к правому краю стекла, на уровне середины слоя */}
      {bands.map((b) => (
        <span
          key={b.key}
          className="text-charcoal/55 absolute -translate-y-1/2 pl-1 font-voice text-sm leading-none italic whitespace-nowrap"
          style={{ left: `${GLASS_RIGHT}%`, top: `${b.mid}%` }}
        >
          {b.label}
        </span>
      ))}
    </div>
  );
}
