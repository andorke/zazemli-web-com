# CollectionGrid · Версия: 1.0.0 · Дата: 2026-05-14 · Источник: DS v1.0 §6.3.1

Organism слоя `03_components/organisms/`. Полная сетка коллекции для страницы `/collectio`.

## Что это

Heading-блок (KickerHeader + H2 + Spectral italic подзаголовок) + 3-колоночный grid из 7 `ProductCardMini` molecules.

## Роль в ДНК-четвёрке

Источник **02 Apothecary** (KickerHeader, серийная нумерация N°001–007) + источник **03 Naturalist** (через SKU-цвета в карточках). См. `02_voice/dna.md` §1, §7.

## Состав

| Слой | Что | Атом / molecule |
|---|---|---|
| Контейнер | `<section py-24 bg-bone>` | semantic-tokens |
| KickerHeader | `КОЛЛЕКЦИЯ · N°001–007` | `atoms/KickerHeader.md` |
| H2 | «7 растений · 16 рецептур» (Unbounded bold 3xl/4xl) | `01_foundations/typography.md` |
| Подзаголовок | «Каждая рецептура — под биотоп...» (Spectral italic) | `01_foundations/voice-principles.md` |
| Grid | 1col mobile / 2col tablet / 3col desktop, gap-6 | `molecules/ProductCardMini.md` × 7 |

```jsx
function CollectionGrid({ plants }) {
  return (
    <section class="py-24 bg-bone">
      <div class="max-w-screen-xl mx-auto px-6">
        <KickerHeader brand="КОЛЛЕКЦИЯ" serial="N°001–007" />
        <h2 class="font-unbounded font-bold text-3xl md:text-4xl text-charcoal/80 mt-4 mb-2 text-center">
          7 растений · 16 рецептур
        </h2>
        <p class="font-spectral italic text-lg text-charcoal/60 text-center max-w-prose mx-auto">
          Каждая рецептура — под биотоп конкретного растения. 80+ источников.
        </p>

        <div class="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6 mt-16">
          {plants.map(p => <ProductCardMini key={p.slug} {...p} />)}
        </div>
      </div>
    </section>
  )
}
```

## Правила применения

- **Только** на `/collectio`. На главной — `CollectionPreview` (4 карточки).
- Сортировка карточек: по N° SKU (001 монстера → 002 фикус → ... → 007 эпипремнум). Не сортируем по популярности / алфавиту.
- На mobile — 1 column. Не сжимать в 2 column (карточка теряет читаемость badge-row).
- Подзаголовок — фактологический («80+ источников»), не маркетинговый. Не подменять.
- Focus-state на карточках и интерактивных элементах — единое правило (см. `atoms/Button.md`).

## Что НЕ применять

См. `02_voice/anti-patterns.md`:
- Фильтры (по размеру / цене / сложности) — на MVP нет, для 7 SKU нечего фильтровать.
- Sort dropdown — нет.
- «Хит» / «бестселлер» бейджи на карточках (см. `atoms/Badge.md`).
- Lazy-load анимация появления карточек.
- Hover-эффекты на самой grid (зум, тени).

## Где это работает

- `03_components/molecules/ProductCardMini.md` — карточки.
- `03_components/atoms/KickerHeader.md` — заголовок-якорь.
- `03_components/atoms/Button.md` — единое правило focus-state.
- `01_foundations/typography.md` — Unbounded bold, Spectral italic.
- `01_foundations/color-system.md` — bone, charcoal.
- Используется в template `/collectio` (Спринт 6).

## История версий

- v1.0.0 · 2026-05-14 · первый draft, источник DS v1.0 §6.3.1.

## Заметка про дубль (для Спринта 11)

DS v1.0 §6.3.1 → ссылка `→ 03_components/organisms/CollectionGrid.md`.
