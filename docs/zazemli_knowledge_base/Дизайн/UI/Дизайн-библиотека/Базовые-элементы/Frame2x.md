# Frame2x · Версия: 1.0.0 · Дата: 2026-05-14 · Источник: DS v1.0 §4.6

Атом слоя `03_components/atoms/`. Опциональный wrapper — двойная apothecary-рамка для веба.

## Что это

Веб-перенос печатной двойной рамки. Outer 1px / inner 0.5px.

## Роль в ДНК-четвёрке

Чистый источник **02 Apothecary** — двойная рамка как ритуальная огорода предмета. См. `02_voice/dna.md` §1, §7.

## Состав

| Prop | Values | Default |
|---|---|---|
| `children` | ReactNode | required |

```jsx
function Frame2x({ children }) {
  return (
    <div class="relative p-2">
      <div class="absolute inset-0 border border-charcoal/50 pointer-events-none" />
      {/* inner 0.5px — на не-retina округлится до 1px; это допустимо */}
      <div class="absolute inset-[6px] border-[0.5px] border-charcoal/30 pointer-events-none" />
      <div class="relative">{children}</div>
    </div>
  )
}
```

Слои: outer 1px opacity 0.5 + inner 0.5px opacity 0.3, отступ 6px между ними. На не-retina-дисплеях subpixel-граница (`0.5px`) рендерится как 1px — это деградация по дизайну, не баг.

## Варианты применения

- Карточки растений на `/collectio` (опционально).
- Hero-блок `/about` для «обложечного» эффекта.
- Финал-блок email-подписки.
- В дневнике (печать) — обрамление разворота.

## Правила применения

- **Опциональный** — не на каждой карточке. Только signature-моменты.
- Отступы внутри — `p-6` (24px) минимум, иначе рамка душит контент.
- Цвет — фиксирован (charcoal/50 + charcoal/30). Не цветной.
- Не вложенный (нельзя Frame2x внутри Frame2x).

## Что НЕ применять

См. `02_voice/anti-patterns.md`:
- Скругление (`rounded`) — apothecary рамка всегда прямоугольная.
- Цветные рамки.
- Тройная рамка / 3+ слоя.
- Анимация opacity / scale на hover.
- Использование в каждой карточке (теряет signature-вес).

## Где это работает

- `01_foundations/color-system.md` — charcoal opacity.
- `01_foundations/iconography.md` — apothecary эстетика.
- Композирует с: `ProductCardFull`, `Hero` страницы `/about`, `EmailSubscribeForm`.

## История версий

- v1.0.0 · 2026-05-14 · первый draft, источник DS v1.0 §4.6.

## Заметка про дубль (для Спринта 11)

DS v1.0 §4.6 → ссылка `→ 03_components/atoms/Frame2x.md`.
