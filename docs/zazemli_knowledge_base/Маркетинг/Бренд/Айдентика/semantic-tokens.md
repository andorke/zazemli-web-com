# Semantic Tokens · Версия: 1.0.0 · Дата: 2026-05-14 · Источник: DS v1.0 §3

Артефакт слоя `01_foundations/`. Семантические токены — слой поверх primitive (`tokens.json`). Описывают, **как компонент видит** цвет, поверхность, текст, акцент, рамку. Имена ролей независимы от конкретного hex или шкалы.

## Что это

Semantic-слой даёт компонентам стабильные имена ролей. Когда меняется primitive (например, добавили новый оттенок чёрного) — компонент это не замечает, потому что обращается к `--surface-deep`, а не к `var(--charcoal)`.

Это работает в две стороны:
- Атомы и молекулы должны использовать **только semantic-tokens** в своих стилях, не primitive напрямую.
- Page-level CSS может переопределять semantic-tokens для конкретной страницы (например, `--accent-sku` на `/collectio/[plant]`).

## Роль в ДНК-четвёрке

Прямой роли в ДНК у semantic-tokens нет — это инфраструктурный слой. Но соблюдение semantic-уровня **защищает** ДНК:
- Запрещает компонентам смешивать moss с SKU-цветом (`--accent-fleuron` ≠ `--accent-sku`).
- Принудительно проводит правило 60/30/10 (нет «raw moss as surface»).
- Принудительно проводит правило «латынь всегда moss» (`--text-latin: var(--moss)`).

## Семантические переменные

### Surface (3 уровня)

| Token | Primitive | Где применяется |
|---|---|---|
| `--surface-paper` | `var(--bone)` | Основной фон страниц, карточек, секций по умолчанию |
| `--surface-warm` | `var(--chalk)` | Вторичный фон секций (ритм), фон hero-картинки в ProductCardFull |
| `--surface-deep` | `var(--charcoal)` | Dark-секции (РЕДКО — макс 1–2 на страницу), RitualStep regular bg |

### Text (6 ролей)

| Token | Primitive | Роль |
|---|---|---|
| `--text-display` | `rgba(28, 28, 28, 0.8)` | H1, H2 |
| `--text-narrative` | `rgba(28, 28, 28, 0.7)` | Body, long-form, Spectral narrative |
| `--text-secondary` | `rgba(28, 28, 28, 0.5)` | Подписи, secondary UI |
| `--text-caption` | `rgba(28, 28, 28, 0.4)` | Captions, hints, footnote |
| `--text-latin` | `var(--moss)` | Латинские названия — **всегда moss**, не SKU (WCAG ≥ 5.0) |
| `--text-inverted` | `var(--bone)` | Текст на `--surface-deep` |

### Accent (3 роли)

| Token | Primitive | Роль |
|---|---|---|
| `--accent-fleuron` | `var(--moss)` | ❦ символ, signature accent (постоянный) |
| `--accent-active` | `var(--moss)` | Hover, focus, active states UI |
| `--accent-sku` | `currentColor` | Подставляется per-SKU из page-level CSS var (только на `/collectio/[plant]`) |

### Border (5 ролей)

| Token | Primitive | Роль |
|---|---|---|
| `--border-divider` | `rgba(28, 28, 28, 0.3)` | Линии-разделители |
| `--border-frame-outer` | `rgba(28, 28, 28, 0.5)` | Внешняя apothecary-рамка |
| `--border-frame-inner` | `rgba(28, 28, 28, 0.3)` | Внутренняя apothecary-рамка |
| `--border-input` | `rgba(28, 28, 28, 0.15)` | Граница инпутов в форме (idle) |
| `--border-input-focus` | `var(--moss)` | Граница инпута в фокусе |

## Page-level SKU-override

Только на странице `/collectio/[plant]`:

```css
[data-sku="monstera"]    { --accent-sku: var(--moss); }
[data-sku="ficus"]       { --accent-sku: var(--cosmos); }
[data-sku="anturium"]    { --accent-sku: var(--poppy); }
[data-sku="aglaonema"]   { --accent-sku: var(--iris); }
[data-sku="spatifillum"] { --accent-sku: var(--sky); }
[data-sku="zamiokulkas"] { --accent-sku: var(--buttercup); }
[data-sku="epipremnum"]  { --accent-sku: var(--moss); }
```

Это **единственное место**, где `--accent-sku` принимает значение, отличное от `currentColor`.

## Правила применения

1. **Компоненты обращаются только к semantic-токенам.** В стилях атомов/молекул запрещено использовать primitive напрямую (`var(--charcoal)`, `var(--moss)`, `#1C1C1C`).
2. **`--accent-sku` работает только в одной зоне.** Никаких SKU-цветов на главной, `/about`, `/lab`, `/guide`, `/dnevnik`.
3. **`--text-latin` всегда moss.** Не подменяется на SKU — иначе пострадает контраст в латинских названиях растений.
4. **`--surface-deep` РЕДКО.** Максимум 1–2 dark-секции на страницу. Иначе нарушается 60/30/10.
5. **Page-level override semantic-токенов разрешён.** Но только на page-level (через `[data-sku]`, `[data-mode]`), не на компонентном уровне.

## Что НЕ применять

- Hardcoded цвета `#XXX` в стилях компонентов (только через переменную).
- Использование primitive в компонентном CSS (`var(--charcoal)` напрямую).
- Создание новых semantic-токенов без обновления этого файла.
- Подмена `--accent-fleuron` на SKU-цвет — fleuron всегда moss.
- Использование `--surface-deep` как фона больших секций (только короткие dark-блоки).

## Где это работает

- `01_foundations/tokens.json` — primitive layer, под которым лежит этот semantic-слой
- `01_foundations/color-system.md` — bone / charcoal / moss palette, attribution
- `01_foundations/typography.md` — opacity-шкала из §18 для `--text-*`
- `01_foundations/iconography.md` — `--accent-fleuron`, `--border-frame-*`
- `01_foundations/dna.md` — почему 60/30/10 защищается на semantic-уровне (источник 01)
- `02_voice/anti-patterns.md` — §3 запреты на цвета как fillз
- `03_components/atoms/*` — все атомы используют semantic-токены
- `03_components/molecules/*` — все молекулы (например, RitualStep — `--surface-deep` / `--text-inverted`)

## История версий

- v1.0.0 · 2026-05-14 · первая версия после декомпозиции из DS v1.0 §3.

## Заметка про дубль (для Спринта 11)

Полное определение semantic-токенов в DS v1.0.md §3 (503–545 строки). В Спринте 11 §3 DS заменяется на ссылку `→ см. 01_foundations/semantic-tokens.md`.
