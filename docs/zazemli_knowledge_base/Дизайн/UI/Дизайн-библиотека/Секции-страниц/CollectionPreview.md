# CollectionPreview · Версия: 1.0.0 · Дата: 2026-05-14 · Источник: DS v1.0 §6.3.2

Organism слоя `03_components/organisms/`. Превью коллекции для главной — 4 карточки + ссылка «все 7 →».

## Что это

Сокращённая версия `CollectionGrid` для главной страницы. Heading + 4 `ProductCardMini` (вместо 7) + ghost-link «все 7 →».

## Роль в ДНК-четвёрке

Те же источники, что у `CollectionGrid` (**02 Apothecary** + **03 Naturalist**). См. `02_voice/dna.md` §1, §7.

## Состав

| Слой | Что | Атом / molecule |
|---|---|---|
| Контейнер | `<section py-24 bg-bone>` | semantic-tokens |
| KickerHeader | `КОЛЛЕКЦИЯ · превью` | `atoms/KickerHeader.md` |
| H2 | «Знакомьтесь — 7 растений» (Unbounded bold 3xl) | `01_foundations/typography.md` |
| Grid | 2col mobile / 4col desktop, gap-6 | `molecules/ProductCardMini.md` × 4 |
| Closing link | «все 7 растений →» (Button ghost) | `atoms/Button.md` |

```jsx
function CollectionPreview({ plants /* первые 4 SKU */ }) {
  return (
    <section class="py-24 bg-bone">
      <div class="max-w-screen-xl mx-auto px-6">
        <KickerHeader brand="КОЛЛЕКЦИЯ" serial="превью" />
        <h2 class="font-unbounded font-bold text-3xl text-charcoal/80 mt-4 text-center">
          Знакомьтесь — 7 растений
        </h2>

        <div class="grid grid-cols-2 md:grid-cols-4 gap-6 mt-16">
          {plants.slice(0, 4).map(p => <ProductCardMini key={p.slug} {...p} />)}
        </div>

        <div class="mt-12 text-center">
          <Button variant="ghost" as="a" href="/collectio">все 7 растений →</Button>
        </div>
      </div>
    </section>
  )
}
```

## Правила применения

- **Только** на главной `/`. На `/collectio` — `CollectionGrid`.
- 4 карточки фиксировано — не 3, не 5. Это «teaser».
- Какие 4 SKU показать — конфиг (по умолчанию: 001 монстера, 002 фикус, 003 спатифиллум, 004 антуриум — флагманские размеры).
- Closing link — `Button variant="ghost"` с `→` в конце текста (underline-on-hover).
- Mobile — 2 column (карточка достаточно простая для двух в ряд на 320px+).
- Focus-state на карточках и ghost-link — единое правило (см. `atoms/Button.md`).

## Что НЕ применять

См. `02_voice/anti-patterns.md`:
- Carousel / swipe на mobile (нарушает apothecary-минимализм, всегда видим 2 карточки разом).
- «Показать ещё» button (только переход на `/collectio`).
- Hover-фильтры по SKU.
- Анимация выезда карточек.

## Где это работает

- `03_components/molecules/ProductCardMini.md` — карточки.
- `03_components/atoms/KickerHeader.md`, `Button.md`.
- `01_foundations/typography.md` — Unbounded bold 3xl.
- Используется в template `/` (главная, Спринт 6).

## История версий

- v1.0.0 · 2026-05-14 · первый draft, источник DS v1.0 §6.3.2.

## Заметка про дубль (для Спринта 11)

DS v1.0 §6.3.2 → ссылка `→ 03_components/organisms/CollectionPreview.md`.
