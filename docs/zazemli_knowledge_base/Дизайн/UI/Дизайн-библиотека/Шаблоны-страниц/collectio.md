# collectio (`/collectio`) · Версия: 1.0.0 · Дата: 2026-05-16 · Источник: DS v1.0 §7.2

Template слоя `03_components/templates/`. Витрина коллекции — все 7 SKU.

## Что это

Каталог-витрина: heading + полная сетка 7 растений + email-подписка. Цель — отвод на конкретную страницу SKU или Ozon.

## Роль в ДНК-четвёрке + канал обучения

Источник **02 Apothecary** (каталогизация N°001-007) + источник **03 Naturalist** (через SKU-цвета карточек). Канал обучения: **сайт — глубоко обучаем**, но тут — переходное звено к страницам SKU, плотности обучения меньше. См. `02_voice/dna.md` §1, §7.

## URL + SEO meta

| Поле | Значение |
|---|---|
| URL | `/collectio` |
| `<title>` | `Коллекция · 7 растений · 16 рецептур · ЗАЗЕМЛИ` |
| `<meta description>` | `Premium-боксы для пересадки 7 комнатных растений. Грунт под биотоп, дренаж, перчатки, дневник.` |
| OG image | `/og/collectio-1200x630.jpg` (сетка 7 SKU-дудлов) |
| canonical | `https://zazemli.com/collectio` |
| Schema.org | `ItemList` (7 SKU как `Product`) |

## Композиция organisms

```
<SiteHeader />
<KickerHeader brand="КОЛЛЕКЦИЯ" serial="N°001–007" />    // atom, регистр Наставник
<h1>7 растений · 16 рецептур</h1>                         // Unbounded bold 3xl/4xl
<p class="font-spectral italic">Каждая рецептура — под биотоп...</p>
<CollectionGrid plants={all7} />                          // organism — 3-col grid, регистр Наставник
<ApothecaryBar />
<EmailSubscribeForm context="catalog" />                  // molecule, регистр Подруга
<SiteFooter />
```

## Page-specific data

- `plants[all7]` — полный конфиг 7 SKU из единого источника (manifest).
- Heading-копирайт — из `02_voice/genre-templates.md` (template-list).
- ItemList Schema.org — массив 7 `Product` объектов с name / image / offers / sku.

## Правила применения

- **Без фильтров / sort / search** на MVP (для 7 SKU нечего сегментировать).
- Сортировка карточек — фиксированная по N° SKU.
- На странице нет дополнительных hero / teaser-секций — каталог чистый.
- Аналитика: `view_catalog`, `click_card_{slug}`, переходы на `/collectio/[plant]`.
- UTM на исходящих ссылках (Ozon) — `utm_source=site&utm_medium=catalog`.
- Focus-state на карточках — единое правило (см. `atoms/Button.md`).

## Что НЕ применять

См. `02_voice/anti-patterns.md`:
- Фильтры, sort, pagination (для 7 SKU не нужны).
- «Хит», «бестселлер» бейджи (см. `atoms/Badge.md`).
- Hover-quick-view модалки.
- Add-to-cart inline на карточке (нет корзины).

## Где это работает

- Organism `CollectionGrid.md` — полная сетка.
- Organism `SiteHeader.md` / `SiteFooter.md`.
- Atom `KickerHeader.md`, `ApothecaryBar.md`.
- Molecule `ProductCardMini.md` (внутри CollectionGrid), `EmailSubscribeForm.md`.
- `02_voice/genre-templates.md` — копирайт heading.

## История версий

- v1.0.0 · 2026-05-16 · первый draft, источник DS v1.0 §7.2.

## Заметка про дубль (для Спринта 11)

DS v1.0 §7.2 → ссылка `→ 03_components/templates/collectio.md`.
