# Fleuron · Версия: 1.0.0 · Дата: 2026-05-14 · Источник: DS v1.0 §4.4.3 + brand-v3 §03.5

Атом слоя `03_components/atoms/`. Glyph ❦ (Spectral) — единственный декоративный символ бренда.

## Что это

Самостоятельный atom + строительный блок `ApothecaryBar` и favicon.

## Роль в ДНК-четвёрке

Мост **01 Natural-Botanical ↔ 02 Apothecary** — botanical glyph в apothecary-форме. См. `02_voice/dna.md` §1, §7.

## Состав

| Prop | Values | Default |
|---|---|---|
| `size` | text-base · text-2xl · text-4xl · text-6xl | `text-4xl` (48px) |
| `opacity` | 0.5–0.8 (через text-color/N) | `text-moss/80` |

```jsx
<span class="
  font-spectral
  text-4xl
  text-moss/80
  inline-block
">❦</span>
```

## Варианты применения

- Favicon — `favicon.svg` (16×16, 32×32).
- SiteHeader — мелкий ❦ перед wordmark «ЗАЗЕМЛИ» (опционально, 12pt).
- WhisperHero center — над/под wordmark, 36–48pt.
- Внутри `ApothecaryBar`.

## Правила применения

- Цвет — **всегда moss** `#4A7C59` opacity 0.6–0.8.
- Шрифт — Spectral (не Unbounded, не системный).
- Минимальный размер — 14px.
- **Требование к системе (не prop):** минимум 3 места применения как самостоятельный atom (чек-лист DS §11.3). Это правило архитектуры — проверяется при ревью templates, не задаётся в JSX.

## Что НЕ применять

См. `02_voice/anti-patterns.md`:
- SKU-цвет (только moss).
- Замена wordmark в hero.
- Размер <14px.
- Поворот / rotate.
- Тени, обводки, градиенты.

## Где это работает

- `01_foundations/iconography.md` — Fleuron в apothecary семействе.
- `01_foundations/typography.md` — Spectral.
- `01_foundations/color-system.md` — moss.
- Композирует с: `KickerHeader`, `ApothecaryBar`, `SiteHeader`, `WhisperHero` (molecule).

## История версий

- v1.0.0 · 2026-05-14 · первый draft, источник DS v1.0 §4.4.3.

## Заметка про дубль (для Спринта 11)

DS v1.0 §4.4.3 → ссылка `→ 03_components/atoms/Fleuron.md`. brand-v3 §03.5 — семантика, остаётся с cross-ref.
