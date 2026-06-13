/*
 * Мерная колба грунта (soil-vials-spec.md + эталон Figma 185:143).
 * Апотекарная бутыль (раструб · горлышко · тело · ножка · засечки) с сегментами по 4 функциям.
 * Порядок снизу вверх по эталону: основа → дренаж → влага → воздух. Сегмент 0% не рисуется.
 * Цвет сегмента = по группе (земляные токены — санкционировано спекой для иллюстрации).
 * Подписи групп — справа, Spectral italic. Стиль апотекари: тонкая обводка charcoal.
 */

export type VialSegments = {
  base: number; // Основа и питание
  drainage: number; // Дренаж и каркас
  moisture: number; // Влага
  air: number; // Воздух
};

// снизу вверх
const GROUPS = [
  { key: "base", label: "основа и питание", fill: "var(--soil)" },
  { key: "drainage", label: "дренаж и каркас", fill: "var(--ceramsite)" },
  { key: "moisture", label: "влага", fill: "var(--moss)" },
  { key: "air", label: "воздух", fill: "var(--pumice)" },
] as const;

// геометрия тела колбы
const BODY = { x: 47, w: 34, top: 56, bottom: 278 };
const H = BODY.bottom - BODY.top;

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
    const y = BODY.bottom - (belowPct / 100) * H - h;
    return { ...g, h, y, mid: y + h / 2 };
  });

  return (
    <svg
      viewBox="0 0 162 320"
      className={className}
      role="img"
      aria-label="Состав грунта по функциям"
    >
      <defs>
        <clipPath id="vial-body">
          <rect x={BODY.x} y={BODY.top} width={BODY.w} height={H} />
        </clipPath>
      </defs>

      {/* сегменты грунта внутри тела */}
      <g clipPath="url(#vial-body)">
        {bands.map((b) => (
          <rect
            key={b.key}
            x={BODY.x}
            y={b.y}
            width={BODY.w}
            height={b.h}
            fill={b.fill}
          />
        ))}
      </g>

      {/* силуэт стекла: раструб · горлышко · тело · ножка */}
      <path
        d="M48,10 L48,16 L58,22 L58,38 L47,56 L47,278 L41,294 L41,298 L87,298 L87,294 L81,278 L81,56 L70,38 L70,22 L80,16 L80,10 Z"
        fill="none"
        stroke="var(--charcoal)"
        strokeOpacity="0.7"
        strokeWidth="1.2"
        strokeLinejoin="round"
      />
      {/* детали: ободок раструба, кольцо горлышка, дно */}
      <path
        d="M46,15 L82,15 M58,38 L70,38 M47,278 L81,278"
        stroke="var(--charcoal)"
        strokeOpacity="0.5"
        strokeWidth="1"
      />
      {/* мерные засечки слева */}
      <path
        d="M47,86 l5,0 M47,116 l5,0 M47,146 l5,0 M47,176 l5,0 M47,206 l5,0 M47,236 l5,0 M47,266 l5,0"
        stroke="var(--charcoal)"
        strokeOpacity="0.35"
        strokeWidth="0.8"
      />
      {/* штрихи «земли» под ножкой */}
      <path
        d="M40,303 l-7,4 M52,304 l-6,4 M76,304 l6,4 M88,303 l7,4"
        stroke="var(--charcoal)"
        strokeOpacity="0.4"
        strokeWidth="0.8"
        strokeLinecap="round"
      />

      {/* подписи групп справа */}
      {bands.map((b) => (
        <text
          key={b.key}
          x={90}
          y={b.mid + 2.5}
          fontFamily="var(--font-spectral), serif"
          fontStyle="italic"
          fontSize="8"
          fill="var(--charcoal)"
          fillOpacity="0.55"
        >
          {b.label}
        </text>
      ))}
    </svg>
  );
}
