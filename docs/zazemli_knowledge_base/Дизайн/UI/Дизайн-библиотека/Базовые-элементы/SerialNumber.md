# SerialNumber · Версия: 1.0.0 · Дата: 2026-05-14 · Источник: DS v1.0 §4.3.2 + brand-v3 §03.5 (apothecary якорь 02)

Атом слоя `03_components/atoms/`. Крупный серийник партии × SKU.

## Что это

Spectral italic, SKU-цвет, формула `N°[партия][SKU]`. Apothecary-якорь 02 — крупный «номер экспоната» в музее.

## Роль в ДНК-четвёрке

Источник **02 Apothecary** (серийность, каталогизация), цвет — мост 02↔03 через SKU-палитру. См. `02_voice/dna.md` §1, §7.

## Состав

| Prop | Values | Default |
|---|---|---|
| `serial` | строка вида `N° 001` | `N° 001` |
| `accent` | SKU-cv (moss/poppy/sky/cosmos/iris/buttercup) | `moss` |

```jsx
<div class="
  font-spectral italic
  text-5xl
  tracking-wide
  text-[var(--accent-sku)]
">N° 001</div>
```

## Варианты применения

- Hero страницы SKU (под `KickerHeader`).
- Product-card (крупный акцент).
- Шапка дневника растения (печать).

## Правила применения

- Только Spectral italic, ≥48px (иначе теряет «вес каталогизации»).
- Цвет — SKU-accent через CSS-переменную `--accent-sku`.
- Tracking `wide` (+1px) — обязательный.
- Один SerialNumber на страницу (не повторять).
- Правило «латынь только рода» — `02_voice/word-list.md` whitelist.

## Что НЕ применять

См. `02_voice/anti-patterns.md`:
- Unbounded или Caveat вместо Spectral.
- Charcoal-цвет (SerialNumber всегда SKU-acc).
- Повторение на странице.

## Где это работает

- `01_foundations/typography.md` — Spectral italic.
- `01_foundations/color-system.md` — SKU-палитра.
- `01_foundations/semantic-tokens.md` — `--accent-sku`.
- `02_voice/word-list.md` — латынь рода.
- Композирует с: `KickerHeader` (kicker сверху, SerialNumber крупно под ним).

## История версий

- v1.0.0 · 2026-05-14 · первый draft, источник DS v1.0 §4.3.2.

## Заметка про дубль (для Спринта 11)

DS v1.0 §4.3.2 → ссылка `→ 03_components/atoms/SerialNumber.md`. brand-v3 §03.5 якорь 02 — семантика остаётся, добавляется cross-ref.
