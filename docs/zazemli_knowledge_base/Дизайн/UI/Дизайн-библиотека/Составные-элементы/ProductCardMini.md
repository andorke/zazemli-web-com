# ProductCardMini · Версия: 1.0.0 · Дата: 2026-05-14 · Источник: DS v1.0 §5.1.1 + brand-v3 §13

Молекула слоя `03_components/molecules/`. Превью-карточка растения в коллекции для `/collectio`. Кликабельная ссылка на `/collectio/[plant]`.

## Что это

Узкая карточка-плитка в `CollectionGrid`. Содержит SKU-дудл, латинское и русское имя, доступные размеры, цену от минимального размера. На hover — лёгкое поднятие и потемнение рамки. **Не использует SKU-цвет как фон или акцент** — карточка живёт в галерейной 60/30/10.

## Роль в ДНК-четвёрке

Мост **01 «Галерист» ↔ 02 «Фармацевт»**:
- Bone-фон + тонкая charcoal-рамка opacity 0.15 — галерейная пустота (источник 01).
- KickerHeader-стилистика, серийность имён, типография — апотекарный протокол (источник 02).
- SKU-дудл — единственная цветная точка, источник 04 «Друг» через рукописную форму.

Доля источников (по dna.md §7): ≈ 50% Галерист + 30% Фармацевт + 0% Натуралист + 20% Друг.

## Состав

| Слой | Что | Атом / зависимость |
|---|---|---|
| Контейнер | `<a>` flex col, bg-bone, p-8, border charcoal/15, transition на translate-y + border-color | semantic-tokens.md `--border-divider` |
| SKU-дудл | `<img>` 128×128, из `/assets/doodles/colored/`, цвет SKU | iconography.md Doodle (colored) |
| Латынь | Spectral italic, text-sm, color moss/75 | typography.md Latin-italic |
| H3 русское имя | Unbounded 500, text-2xl, color charcoal/80 | typography.md H3 |
| Размеры | flex gap-1, два-три Badge | atoms/Badge.md (Спринт 4) |
| Цена-линия | flex justify-between, padding-top + border-top charcoal/15 | atoms/Divider.md |
| Префикс «от» | Spectral italic, text-xs, charcoal/40 | typography.md Caption |
| Цена | Unbounded 500, text-lg | typography.md Body-bold |

**Hover:**
- `translate-y: -4px`
- `border-color: charcoal/40`
- duration 200ms, ease-out

**Сигнатура:**

```jsx
<ProductCardMini
  href="/collectio/monstera"
  doodle="/assets/doodles/colored/monstera-moss.svg"
  latin="monstera"
  name="Заземли Монстеру"
  sizes={['2.2 л', '3.5 л']}
  priceFrom="2 190 ₽"
/>
```

## Варианты применения

| Где | Зачем |
|---|---|
| `/collectio` | CollectionGrid — 7 карточек, основной use case |
| `/` главная | CollectionPreview — 4 карточки + ссылка «все 7 →» |
| Email Welcome | TBD — может быть простая версия без hover в письме |

## Правила применения

1. **SKU-дудл — единственный цветной элемент.** Никаких цветных полос снизу, бейджей-плашек, цветной обводки.
2. **Размер дудла — 128×128**, не больше. Если растение «крупное» (монстера) — пропорция держится.
3. **Латынь — Spectral italic moss/75**. Никаких других цветов или весов.
4. **Bone-фон обязателен.** Никаких chalk-фонов в карточках (они для секций секций ритма).
5. **Hover — только translate-y −4px и border-color.** Никаких scale, shadow, font-size shifts (см. anti-patterns.md §4.5).
6. **Цена в формате «от X ₽»** — указывает на минимальный размер. Если у растения один размер — «X ₽» без префикса.

## Что НЕ применять

- Бейджи «хит / new / sale» — маркетплейс-лексика, нарушает регистр Редактора (см. anti-patterns.md §1.2).
- Drop-shadow на карточке (anti-patterns.md §4.2).
- Скруглённые углы > 2px (anti-patterns.md §1.9, §4.1).
- CTA-кнопка «Купить» внутри карточки — карточка ведёт на `/collectio/[plant]`, покупка там.
- Описание растения внутри карточки — это для ProductCardFull, не Mini.
- Буква-плейсхолдер вместо дудла («M», «A», «С») — см. anti-patterns.md §1.4.

## Где это работает

- `01_foundations/dna.md` — мост 01↔02 (источник 04 через дудл)
- `01_foundations/color-system.md` — 60/30/10 на странице каталога
- `01_foundations/iconography.md` — colored doodles set, политика «1 цветной дудл на карточку»
- `01_foundations/typography.md` — KickerHeader-стиль, шкала text-sm/2xl/lg
- `02_voice/anti-patterns.md` — §1.2, §1.4, §4.1, §4.2 — что НЕ делать
- `03_components/atoms/Badge.md` — атом размеров (Спринт 4)
- `03_components/molecules/ProductCardFull.md` — расширенная версия для product page
- `03_components/organisms/CollectionGrid.md` — контейнер (Спринт 5)
- `03_components/templates/collectio.md` — page-level (Спринт 6)

## История версий

- v1.0.0 · 2026-05-14 · первая версия после декомпозиции из DS v1.0 §5.1.1. Источник: DS v1.0 §5.1.1 + brand-v3 §13 mockup «04 · PRODUCT CARDS» (последний обновлён под бренд-v3 §11 анти-эталон, см. anti-patterns.md §1.4).

## Заметка про дубль (для Спринта 11)

Полное определение ProductCardMini в DS v1.0.md §5.1.1. В Спринте 11 §5.1.1 DS заменяется на ссылку `→ см. 03_components/molecules/ProductCardMini.md`.
