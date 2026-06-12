# ritual-patterns · Версия: 1.0.0 · Дата: 2026-05-16 · Источник: brand-v3 §15 (ритуал-нумерация) + DS v1.0 §6.4 (RitualSequence) + dna.md §1.1.1 (линейка ритуалов)

Pattern слоя `04_patterns/`. Композиционные паттерны для ритуальных секций: как стыкуются KickerHeader + RitualSequence + ApothecaryBar + closing-section + Button-pair на разных templates.

## Что это

Ритуал — главная семантическая единица бренда («ритуал, не рутина» — voice-principles §06). На сайте ритуал собирается из 4-5 компонентов в фиксированной последовательности. Этот pattern — про правила композиции, не про сам RitualSequence.

## Роль в ДНК-четвёрке + канал обучения

Источник **02 Apothecary** (нумерация 00-03) + источник **03 Naturalist** (физическая привязка к box-layers) + источник **04 Handscript** (Caveat hint в RitualStep). Канал обучения: **сайт — глубоко обучаем** (master-brief §7.5). На IG ритуал-паттерн адаптируется: ASMR-видео = тот же 4-шаговый ритуал, но без типографики. См. `02_voice/dna.md` §1, §7.

## Паттерн A · Полный ритуал-блок (для `/guide`)

Стандартная композиция:

```
1. KickerHeader («РИТУАЛ ПЕРЕСАДКИ · 4 ШАГА»)        // page-level, не часть organism
2. H1 / H2 (типографика страницы)                     // page-level
3. Подзаголовок Spectral italic (опционально)         // page-level
4. RitualSequence (organism)                          // grid 4 шага
   ↳ 4 × RitualStep (molecule)
   ↳ ApothecaryBar (atom)
   ↳ closing Spectral italic
   ↳ Button-pair (primary + secondary)
5. ApothecaryBar (atom)                               // секция-сепаратор
6. После-ритуальная секция (опционально)              // «что дальше», Caveat
```

**Контекст:** template `/guide`, ритуал — полноценный educational-блок.

## Паттерн B · Compact ритуал-блок (для `/collectio/[plant]`)

Сокращённый вариант:

```
1. KickerHeader («СОСТАВ БОКСА · 4 УРОВНЯ»)
2. RitualSequence compact={true} (organism)           // те же 4 шага, плотнее padding
   ↳ 4 × RitualStep (molecule)
   ↳ без ApothecaryBar внутри
   ↳ без closing-section
   ↳ без Button-pair
3. ApothecaryBar (atom)                               // секция-сепаратор
```

**Контекст:** template `/collectio/[plant]`, ритуал — supporting-блок (главное — продукт).

## Паттерн C · Ритуал на IG / печать (адаптация)

| Элемент | Веб | IG-карусель | Печать (дневник) |
|---|---|---|---|
| KickerHeader | Unbounded uppercase 12px | Заголовок слайда (28pt) | Та же шапка |
| RitualStep × 4 | 4 карточки в grid | 4 отдельных слайда (00/01/02/03) | 4 страницы разворота |
| Number 00-03 | text-5xl moss/bone | Крупно 200pt SKU-color | Крупно на печати |
| Title КАПС | text-base | 32pt | 18pt |
| Description | Spectral italic | Spectral italic | Spectral italic |
| Hint Caveat | text-lg buttercup | Caveat 24pt | Caveat |
| ApothecaryBar | SVG | Декоративный кадр-разделитель | Полоса между шагами |

## Паттерн D · v2+ Линейка ритуалов (бэклог)

Когда `/guide` превращается в hub `/rituals/` (dna §1.1.1):

```
/rituals/                  → index с 4-5 ритуалами
  /rituals/peresadka       → текущий MVP-ритуал (Pattern A)
  /rituals/podkormka       → 3 шага (v2+)
  /rituals/ukorenenie      → 5 шагов (v2+)
  /rituals/reanimatsiya    → 6 шагов (v3+)
```

Каждый дочерний `/rituals/*` использует RitualSequence (organism) с разным массивом `steps`. Архитектура уже поддерживает (RitualSequence параметрический).

## Правила применения

- **Каждый ритуал начинается с одного `isFirst`-шага** (moss-фон). На MVP это шаг 01 (без мешочка). В v2+ — 00 ПРИХОД.
- **Heading НЕ входит в organism** — KickerHeader + H1/H2 даёт page-level template. Так RitualSequence переиспользуется на разных страницах с разными заголовками.
- **На `/guide`** — Pattern A (полный). На `/collectio/[plant]` — Pattern B (compact).
- **При публикации на IG** — Pattern C (4 слайда из 1 веб-блока). Текст копируется без изменений (consistency).
- **При печати в дневнике** — Pattern C (печать). Размеры из `print-web-bridge.md`.
- **Caveat-лимит** на ритуальной секции: каждый RitualStep имеет 1 hint в Caveat, но эти hint-Caveat **НЕ считаются** в счёт «2 Caveat на страницу» (это структурный элемент molecule, не контентный).

## Что НЕ применять

См. `02_voice/anti-patterns.md`:
- Stepper / wizard UI (это ритуал-описание, не пошаговый процесс).
- Progress-bar между шагами.
- Чекбоксы «выполнено».
- Carousel шагов (на вебе всегда видны все).
- Анимация появления на scroll (нарушает apothecary-минимализм).
- Иконки в шагах (только цифра 00-03).

## Где это работает

- `03_components/organisms/RitualSequence.md` — основной organism.
- `03_components/molecules/RitualStep.md` — атомарный шаг.
- `03_components/atoms/`: ApothecaryBar, Button, KickerHeader.
- `05_production/box-layers.md` — физическое соответствие шагов уровням коробки.
- `01_foundations/dna.md` §1.1.1 — линейка ритуалов.
- `01_foundations/voice-principles.md` — принцип «ритуал, не рутина».
- Templates: `/guide` (Pattern A), `/collectio/[plant]` (Pattern B).

## История версий

- v1.0.0 · 2026-05-16 · первый draft. Собран после Спринта 5 (RitualSequence) и Спринта 6 (templates) — формализация повторяющихся ритуал-композиций.

## Заметка про дубль (для Спринта 11)

DS v1.0 §6.4 + brand-v3 §15 ритуал-нумерация — содержательно уже декомпозированы в `organisms/RitualSequence.md` и `molecules/RitualStep.md`. Этот pattern добавляется как «уровень композиции» сверху, не дублирует — фиксирует правила стыка.
