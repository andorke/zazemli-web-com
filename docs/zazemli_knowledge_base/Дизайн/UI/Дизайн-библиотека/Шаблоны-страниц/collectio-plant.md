# collectio-plant (`/collectio/[plant]`) · Версия: 1.0.0 · Дата: 2026-05-16 · Источник: DS v1.0 §7.3 + brand-v3 §13 (карточка товара, устаревшая) + mock-валидация Спринта 5

Template слоя `03_components/templates/`. Страница конкретного SKU. Пример: `/collectio/monstera`.

## Что это

Главная коммерческая страница — конкретное растение, цена, переход на Ozon, «что в боксе», мини-рецептура, биотоп, связанное. Самая «толстая» страница сайта.

## Роль в ДНК-четвёрке + канал обучения

Все 4 источника ДНК: **01 Natural-Botanical** (биотоп narrative) + **02 Apothecary** (KickerHeader, SerialNumber, Frame2x) + **03 Naturalist** (SKU-дудл, MaterialDot, чёрные перчатки в RitualStep) + **04 Handscript** (Caveat sku-humor + Caveat «корни скажут спасибо»). Канал обучения: **сайт — глубоко обучаем**, здесь — максимальная плотность (биотоп + рецептура + ритуал). См. `02_voice/dna.md` §1, §7.

## URL + SEO meta

**Один template — генерирует SEO meta из `sku` config для каждого из 7 растений.**

| Поле | Правило-генератор | Пример для monstera |
|---|---|---|
| URL | `/collectio/{sku.slug}` | `/collectio/monstera` |
| `<title>` | `Заземли {sku.nameAccusative} · бокс пересадки · ЗАЗЕМЛИ` | `Заземли Монстеру · бокс пересадки · ЗАЗЕМЛИ` |
| `<meta description>` | `Грунт под биотоп {sku.latin}. 11 компонентов, дренаж, перчатки, корневин. {sku.price} ₽.` | `Грунт под биотоп Monstera deliciosa. 11 компонентов, дренаж, перчатки, корневин. 2 590 ₽.` |
| OG image | `/og/sku/{sku.slug}-1200x630.jpg` | `/og/sku/monstera-1200x630.jpg` |
| canonical | `https://zazemli.com/collectio/{sku.slug}` | `https://zazemli.com/collectio/monstera` |
| Schema.org | `Product` (name, image, sku, offers.price, brand, description) — `offers.price` из `sku.price` | см. таблицу ниже |
| `<body data-sku={sku.slug}>` | переключает `--accent-sku` в `sku.color` | `data-sku="monstera"` → moss |

Цены `sku.price` фиксированы в едином конфиге `plants[]` (источник — `master-brief §3.4`):

| sku.slug | sku.price |
|---|---|
| monstera | 2 590 ₽ |
| ficus | 2 590 ₽ |
| spathiphyllum | 2 190 ₽ |
| anthurium | 2 190 ₽ |
| zamiokulkas | 2 190 ₽ |
| aglaonema | 2 190 ₽ |
| epipremnum | 1 890 ₽ |

## Композиция organisms

```
<body data-sku="monstera">
  <SiteHeader />
  <HeroSKU sku={monstera} />                              // organism — KickerHeader+SerialNumber+H1+Badge-row+Button-pair+Caveat+Doodle
  <ApothecaryBar />

  <section class="bg-chalk">                              // «Что в боксе», регистр Наставник
    <KickerHeader brand="СОСТАВ БОКСА" serial="4 уровня" />
    <RitualSequence steps={transplantSteps} compact={true} />  // organism — 4 RitualStep
  </section>
  <ApothecaryBar />

  <section class="bg-bone">                                // «Мини-рецептура», регистр Наставник
    <KickerHeader brand="РЕЦЕПТУРА" serial="monstera" />
    <MaterialsGrid materials={monstera.recipe} compact={true} />  // molecule — 8–10 компонентов с %
    <Button variant="secondary" as="a" href="/lab#monstera">Открыть полную лабораторию</Button>
  </section>
  <ApothecaryBar />

  <section class="bg-chalk">                              // «Контекст растения», регистр Редактор
    <h3>Биотоп монстеры</h3>
    <p class="font-spectral italic">…2–3 абзаца narrative…</p>
  </section>
  <ApothecaryBar />

  <section class="bg-bone">                               // «Связанное», регистр Подруга
    <Button variant="primary">Купить на Ozon · 2 590 ₽</Button>
    <Button variant="secondary" as="a" href="/guide">Полный гайд по пересадке</Button>
    <a href="/about" class="font-spectral italic text-charcoal/60">о бренде →</a>
  </section>

  <EmailSubscribeForm context="sku" sku="monstera" />     // molecule
  <SiteFooter />
</body>
```

## Page-specific data

- `sku` — конфиг конкретного растения (number, slug, name, nameAccusative, latin, color, size, volume, price, biotope, recipe).
- `transplantSteps` — массив 4 RitualStep (универсальный, не зависит от SKU).
- `sku.recipe` — 11 компонентов с % (из `Продукт/Рецептуры/Заземли_научное_обоснование_рецептур.md`).
- Биотоп-narrative — из научного обоснования, 2–3 абзаца Spectral italic.
- Caveat sku-humor — массив `caveats[slug]` (например, monstera → «уже просится в большой горшок», без `!`).

## Правила применения

- Один template **на все 7 SKU** — переменные через `data-sku` и `sku` prop.
- **Цена в primary Button** — из `sku.price`. SSR-рендерится; Schema.org `offers.price` тоже из `sku.price`.
- Schema.org `Product` обязателен (без него Ozon не индексируется правильно).
- `data-sku` атрибут на body — критично для переключения `--accent-sku` (см. `01_foundations/semantic-tokens.md`).
- Аналитика: `view_sku_{slug}`, `click_ozon_{slug}_top`, `click_ozon_{slug}_bottom`, `click_lab_from_{slug}`, `click_guide_from_{slug}`, `click_diary_from_{slug}`.
- UTM: `utm_source=site&utm_medium=sku&utm_content={slug}&utm_campaign=launch`.
- Caveat в content-zone: ≤2 (HeroSKU sku-humor + опциональная в footer-секции).

## Что НЕ применять

См. `02_voice/anti-patterns.md`:
- «В корзину» (нет корзины — только Ozon).
- Carousel изображений растения.
- Отзывы (отзывы на Ozon, не на сайте на запуске).
- Related-products в виде «купившие это также купили».
- Sticky-Buy bar при скролле.
- Discount badges.

## Где это работает

- Organism `HeroSKU.md` — главный hero.
- Organism `RitualSequence.md` — блок «что в боксе» (compact variant).
- Organism `SiteHeader.md` / `SiteFooter.md`.
- Molecule `MaterialsGrid.md` (compact variant), `EmailSubscribeForm.md`.
- Atom `KickerHeader.md`, `Button.md`, `ApothecaryBar.md`.
- `01_foundations/semantic-tokens.md` — `--accent-sku` через data-sku.
- `Продукт/Рецептуры/Заземли_научное_обоснование_рецептур.md` — биотоп + recipe.
- Master-brief §3.4 — цены `sku.price`.
- Master-brief §7.5 — канал обучения = сайт глубоко.

## История версий

- v1.0.0 · 2026-05-16 · первый draft, источник DS v1.0 §7.3. Закрыт минор T2 (Спринт 6 ревью): SEO meta — правило-генератор из `sku` config + таблица цен 7 SKU.

## Заметка про дубль (для Спринта 11)

DS v1.0 §7.3 → ссылка `→ 03_components/templates/collectio-plant.md`. **brand-v3 §13 мокап «Карточка товара»** содержит устаревшее: «в корзину», цена «2 490 ₽», иконка ♡ (избранное) — этот мокап подлежит правке (логировать).
