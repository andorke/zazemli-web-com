# MaterialDot · Версия: 1.0.0 · Дата: 2026-05-14 · Источник: DS v1.0 §4.5.2 + brand-v3 §07.08 (компоненты грунта)

Атом слоя `03_components/atoms/`. Цветной круг — индикатор материала почвосмеси.

## Что это

7 цветов под 7 материалов: soil / ceramsite / pumice / sand / gravel / moss / charcoal.

## Роль в ДНК-четвёрке

Мост **02 Apothecary ↔ 03 Naturalist** — образец вещества в круглой капсуле. См. `02_voice/dna.md` §1, §7.

## Состав

| Prop | Values | Default |
|---|---|---|
| `material` | `soil` · `ceramsite` · `pumice` · `sand` · `gravel` · `moss` · `charcoal` | required |
| `size` | px | `28` |

```jsx
function MaterialDot({ material, size = 28 }) {
  const colors = {
    soil: 'bg-soil', ceramsite: 'bg-ceramsite', pumice: 'bg-pumice',
    sand: 'bg-sand', gravel: 'bg-gravel', moss: 'bg-moss', charcoal: 'bg-charcoal',
  }
  return (
    <div
      class={`rounded-full ${colors[material]}`}
      style={{ width: size, height: size }}
      role="img"
      aria-label={`Материал: ${material}`}
    />
  )
}
```

A11y: круг без подписи получает `role="img"` + `aria-label`. В паре с видимой подписью (Unbounded text-xs uppercase) — `aria-hidden="true"` на dot, а подпись становится accessible name.

## Варианты применения

- `/lab` — иконка-маркер компонента в списке.
- Composition-карта почвосмеси (% состава) — на product-card `/collectio/[plant]`.
- Дневник растения (печать) — индикаторы.

## Правила применения

- Размер 20–32px, opacity 1.0 (не приглушать).
- 7 цветов фиксированы (см. semantic-tokens). Не вводить новые материалы без правки токенов.
- В паре с подписью: «Керамзит · дренаж».
- Не более 11 dots в одной композиции (число материалов в палитре грунта).

## Что НЕ применять

См. `02_voice/anti-patterns.md`:
- Эмодзи / иконки внутри (только заливка).
- Border / обводка.
- Тень.
- Анимация (pulse, scale).

## Где это работает

- `01_foundations/color-system.md` — material палитра.
- `01_foundations/semantic-tokens.md` — `--material-*`.
- Композирует с: `MaterialsGrid` (molecule), `ProductCardFull`.

## История версий

- v1.0.0 · 2026-05-14 · первый draft, источник DS v1.0 §4.5.2.

## Заметка про дубль (для Спринта 11)

DS v1.0 §4.5.2 → ссылка `→ 03_components/atoms/MaterialDot.md`. brand-v3 §07.08 — пример композиции, остаётся.
