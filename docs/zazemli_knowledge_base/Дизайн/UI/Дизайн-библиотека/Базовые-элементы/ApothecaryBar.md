# ApothecaryBar · Версия: 1.0.0 · Дата: 2026-05-14 · Источник: DS v1.0 §4.4.2 + brand-v3 §03.5 (apothecary якорь 04)

Атом слоя `03_components/atoms/`. SVG-разделитель `hairline · dot · ❦ · dot · hairline`.

## Что это

Используется между секциями как «вдох» музейной строгости. Комбинирует `Fleuron`, точку и линию в единый apothecary-якорь 04.

## Роль в ДНК-четвёрке

Чистый источник **02 Apothecary**. См. `02_voice/dna.md` §1, §7.

## Состав

| Prop | Values | Default |
|---|---|---|
| `width` | number (px) | `320` |

```jsx
function ApothecaryBar({ width = 320 }) {
  return (
    <svg viewBox="0 0 320 60" width={width} className="my-12 mx-auto block">
      {/* hardcode по исключению DS §2.7 — SVG fill требует hex */}
      <line x1="20" y1="30" x2="120" y2="30" stroke="#1C1C1C" strokeWidth="0.75" opacity="0.3"/>
      <circle cx="135" cy="30" r="1.5" fill="#1C1C1C" opacity="0.5"/>
      <text x="160" y="38" textAnchor="middle" fontFamily="Spectral, serif" fontSize="22" fill="#4A7C59" opacity="0.8">❦</text>
      <circle cx="185" cy="30" r="1.5" fill="#1C1C1C" opacity="0.5"/>
      <line x1="200" y1="30" x2="300" y2="30" stroke="#1C1C1C" strokeWidth="0.75" opacity="0.3"/>
    </svg>
  )
}
```

## Варианты применения

- Между крупными секциями hero / manifesto / collection.
- Открытие email-блока в footer.
- В дневнике растения (печать) — между разворотами.

## Правила применения

- Width — 240–400px (адаптивно). Не больше — теряет камерность.
- Центрирование обязательно (`mx-auto`).
- Margin — `my-12` (48px).
- Используется реже, чем `Divider` — не больше 2 ApothecaryBar на страницу.
- ❦ — всегда moss `#4A7C59` opacity 0.8 (см. `Fleuron.md`).

## Что НЕ применять

См. `02_voice/anti-patterns.md`:
- Цветные line / circle (только charcoal).
- Замена ❦ другими символами.
- Использование вместо логотипа / wordmark.
- >2 ApothecaryBar на страницу.

## Где это работает

- `01_foundations/iconography.md` — apothecary якорь 04.
- `03_components/atoms/Fleuron.md` — правила использования ❦.
- `01_foundations/color-system.md` — charcoal, moss.
- Композирует с: любые templates, footer.

## История версий

- v1.0.0 · 2026-05-14 · первый draft, источник DS v1.0 §4.4.2.

## Заметка про дубль (для Спринта 11)

DS v1.0 §4.4.2 → ссылка `→ 03_components/atoms/ApothecaryBar.md`. brand-v3 §03.5 якорь 04 — семантика, остаётся с cross-ref.
