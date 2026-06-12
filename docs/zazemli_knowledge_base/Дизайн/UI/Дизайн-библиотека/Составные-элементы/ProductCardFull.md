# ProductCardFull · Версия: 1.0.0 · Дата: 2026-05-14 · Источник: DS v1.0 §5.1.2 + brand-v3 §13

Молекула слоя `03_components/molecules/`. Полная карточка растения для страницы продукта `/collectio/[plant]`. Это **единственное место**, где разрешено использование SKU-цвета как акцента (через `--accent-sku`, см. color-system.md и semantic-tokens.md).

## Что это

Развёрнутая композиция top→bottom для одной страницы растения: kicker + H1 + serial-number + hero-картинка + size-selector + цена + 2 CTA + Caveat-приписка. На странице ровно одна.

## Роль в ДНК-четвёрке

Мост всех четырёх источников (по dna.md §7 — единственный шаблон, где разрешены все 4):
- KickerHeader + SerialNumber + Frame-system — источник 02 «Фармацевт»
- Hero-картинка на `--surface-warm` (chalk) — источник 03 «Натуралист» (фактура)
- Размер-селектор + структура — источник 01 «Галерист»
- Caveat-SKU-humor — источник 04 «Друг»

Доля источников (по dna.md §7): ≈ 25% Галерист + 30% Фармацевт + 20% Натуралист + 25% Друг.

## Состав (top→bottom)

| Порядок | Элемент | Атом / зависимость | Контент |
|---|---|---|---|
| 1 | `KickerHeader` | atoms/KickerHeader.md | «COLLECTIO ZAZEMLI · N° 001 · monstera» |
| 2 | `H1` | typography.md BodyHero | «Заземли Монстеру» (Unbounded 700, text-4xl) |
| 3 | `SerialNumber` | atoms/SerialNumber.md | Spectral italic 60px, цвет = `--accent-sku` |
| 4 | Hero-картинка | — | Крупный SKU-дудл или фотография коробки, на `--surface-warm` (chalk) |
| 5 | Размер-селектор | atoms/Badge × 3 | 1.2 / 2.2 / 3.5 л — chip-badges, выбор обновляет цену |
| 6 | Цена | typography.md BodyHero | Unbounded 700, text-4xl |
| 7 | Кнопки | atoms/Button × 2 | Primary «Купить на Ozon» + Secondary «Открыть лабораторию» |
| 8 | `CaveatNote` SKU-humor | atoms/CaveatNote.md | Например «она уже лезет из горшка» (без `!` — см. typography.md) |

**Page-level CSS:**
```css
[data-sku="monstera"] { --accent-sku: var(--moss); }
[data-sku="ficus"]    { --accent-sku: var(--cosmos); }
/* и т.д. для 7 SKU — полная карта в semantic-tokens.md */
```

## Варианты применения

| Где | Зачем |
|---|---|
| `/collectio/[plant]` | Единственное использование. Один ProductCardFull на странице. |
| Превью-модал на главной (опционально) | TBD — возможно в v2+ |

## Правила применения

1. **Единственная страница использования — `/collectio/[plant]`.** SKU-цвет работает через `data-sku` атрибут `<body>` или `<main>`.
2. **Только один SKU-цвет на странице.** Не миксовать SKU.
3. **Hero-картинка на `--surface-warm` (chalk), не на bone.** Это ритмический контраст к остальным секциям.
4. **CaveatNote SKU-humor — макс 1 на странице.** Идёт в лимит ≤2 Caveat на коллекцию.
5. **Кнопки — Primary + Secondary, не двойной Primary.** Иерархия action: Ozon = коммерция, лаб = глубина.
6. **Размер-селектор обновляет цену синхронно.** Без анимации, через CSS-переменную.

## Что НЕ применять

- Скидочные плашки «−30%», countdown-таймеры (см. anti-patterns.md §4.6).
- «В корзину» / «Заказать» — у бренда нет корзины (anti-patterns.md §1.1).
- Несколько SKU-цветов одновременно (нарушает 60/30/10).
- Body-описание длиннее 3 строк — для глубинного контента есть `/lab` и Caveat.
- Иконки в CTA-кнопках — текст самодостаточен.

## Где это работает

- `01_foundations/dna.md` — единственный шаблон, использующий все 4 источника
- `01_foundations/color-system.md` — `--accent-sku` overrides per-SKU
- `01_foundations/semantic-tokens.md` — `--accent-sku`, `--surface-warm`
- `01_foundations/iconography.md` — KickerHeader, SerialNumber, CaveatNote, Frame2x
- `02_voice/founder-quotes.md` — Caveat-SKU-humor как голос Насти
- `02_voice/anti-patterns.md` — что НЕ применять
- `03_components/atoms/Button.md`, `Badge.md` — зависимости (Спринт 4)
- `03_components/molecules/ProductCardMini.md` — превью-версия
- `03_components/templates/collectio-plant.md` — page-level template (Спринт 6)

## История версий

- v1.0.0 · 2026-05-14 · первая версия после декомпозиции из DS v1.0 §5.1.2.

## Заметка про дубль (для Спринта 11)

Полное определение в DS v1.0.md §5.1.2 (composition top→bottom). В Спринте 11 заменяется на ссылку.
