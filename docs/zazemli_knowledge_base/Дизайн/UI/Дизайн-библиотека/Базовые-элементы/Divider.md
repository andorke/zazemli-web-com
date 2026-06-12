# Divider · Версия: 1.0.0 · Дата: 2026-05-14 · Источник: DS v1.0 §4.4.1

Атом слоя `03_components/atoms/`. Горизонтальный разделитель секций.

## Что это

2 варианта: `full` (полная ширина) и `decorative` (короткий центрированный).

## Роль в ДНК-четвёрке

Источник **02 Apothecary** (тонкая линия, дисциплина пробелов). См. `02_voice/dna.md` §1, §7.

## Состав

| Prop | Values | Default |
|---|---|---|
| `variant` | `full` · `decorative` | `full` |

```jsx
// Full
<hr class="border-t border-charcoal/30 my-12" />

// Decorative (центр, 56px)
<div class="flex justify-center my-12">
  <hr class="w-14 border-t border-charcoal/40" />
</div>
```

## Варианты применения

- `full` — между крупными секциями страницы, в footer.
- `decorative` — между manifesto-абзацами, на `/about`, в дневнике (печать).

## Правила применения

- Цвет — `charcoal/30` (full) или `charcoal/40` (decorative). Не цветной.
- Толщина — 1px (`border-t`). Не использовать `border-2`.
- Margin — `my-12` (48px) для секций, `my-6` для inline.
- Не использовать как декор внутри карточки (для этого — `ApothecaryBar`).

## Что НЕ применять

См. `02_voice/anti-patterns.md`:
- Цветные разделители (moss / SKU).
- Толщина >1px.
- Градиентные / пунктирные стили.

## Где это работает

- `01_foundations/tokens.json` — charcoal opacity.
- `01_foundations/semantic-tokens.md` — `--divider-color`.
- Композирует с: любая templates-секция, footer.

## История версий

- v1.0.0 · 2026-05-14 · первый draft, источник DS v1.0 §4.4.1.

## Заметка про дубль (для Спринта 11)

DS v1.0 §4.4.1 → ссылка `→ 03_components/atoms/Divider.md`.
