# lab (`/lab`) · Версия: 1.0.0 · Дата: 2026-05-16 · Источник: DS v1.0 §7.4 + brand-v3 §13 (мокап «Справочник грунтов», устаревший URL)

Template слоя `03_components/templates/`. Лаборатория грунта — глубокая контент-страница.

## Что это

Витрина «11 компонентов × 7 рецептур × 80+ источников». Цель — обосновать premium-позиционирование через науку, отвести на Ozon после прочтения.

## Роль в ДНК-четвёрке + канал обучения

Источник **02 Apothecary** (каталогизация атомов грунта) + источник **03 Naturalist** (материалы, MaterialDot, фактура). Канал обучения: **сайт — глубоко обучаем**, эта страница — **максимум плотности**: каждый из 11 компонентов разобран, плюс 7 рецептур с anchors, плюс ссылка на 343-строчный PDF. См. `02_voice/dna.md` §1, §7 + master-brief §7.5.

## URL + SEO meta

| Поле | Значение |
|---|---|
| URL | `/lab` (canonical; alias `/lab#monstera` → /lab с автоскроллом к anchor) |
| `<title>` | `Лаборатория грунта · 11 компонентов · 80+ источников · ЗАЗЕМЛИ` |
| `<meta description>` | `Из чего состоит каждый бокс. 11 компонентов почвосмеси. Научное обоснование на 80+ источниках.` |
| OG image | `/og/lab-1200x630.jpg` (MaterialsGrid + KickerHeader «11 КОМПОНЕНТОВ») |
| canonical | `https://zazemli.com/lab` |
| Schema.org | `Article` (headline, author, datePublished, articleBody) |

## Композиция organisms

```
<SiteHeader />
<HeroWhisper withKicker={true} withCTA={false}>          // organism, регистр Редактор
  <WhisperHero phrases=[
    'Лаборатория',
    '11 компонентов внутри',
    '80+ источников',
    'curated'
  ] />
</HeroWhisper>
<ApothecaryBar />

<section class="bg-bone">                                 // «11 компонентов», регистр Наставник
  <KickerHeader brand="АТОМЫ ГРУНТА" />
  <h2>11 компонентов</h2>
  <p class="font-spectral italic">…2 абзаца про принцип «рецептура под биотоп»…</p>
  <MaterialsGrid materials={all11} />                    // molecule — полная сетка
</section>
<ApothecaryBar />

<section class="bg-chalk">                                // «7 растений · краткие карточки», регистр Наставник
  <KickerHeader brand="РЕЦЕПТУРЫ" serial="N°001–007" />
  {plants.map(p => (
    // ВНИМАНИЕ: inline-композиция recipe-mini — на MVP не атомизируется.
    // Если используется ≥2 раз в системе — выносится в molecule `RecipeMini.md`
    // (планово — Спринт 11 при удалении дублей DS).
    <article id={p.slug} class="recipe-mini">             // anchor для /lab#monstera
      <img src={`/assets/doodles/colored/${p.slug}-${p.color}.svg`} alt="" class="w-12" />
      <h4>{p.nameRu}</h4>
      <p class="font-spectral italic">{p.biotopeShort}</p>
      <table class="recipe-percent">…% по 11 компонентам…</table>
    </article>
  ))}
</section>
<ApothecaryBar />

<section class="bg-bone">                                 // «Полное обоснование», регистр Наставник
  <h3>Научное обоснование рецептур</h3>
  <p class="font-spectral italic">343 строки. 80+ источников: POWO Kew · Missouri Botanical Garden · EDIS UF/IFAS · Aroid Society · Atiyeh · Mumpton · Lehmann · Croat · Madison · Семенова Н. (GreenInfo)…</p>
  <Button variant="primary" as="a" href="/Заземли_научное_обоснование_рецептур.pdf" download>
    Скачать PDF · 343 строки
  </Button>
</section>

<EmailSubscribeForm context="lab" />
<SiteFooter />
```

## Page-specific data

- `all11` — массив 11 материалов с описаниями (soil/ceramsite/pumice/sand/gravel/moss/charcoal/...).
- `plants` — 7 SKU с biotopeShort + recipe-% (из `Заземли_научное_обоснование_рецептур.md`).
- WhisperHero phrases — фиксированы (4 фразы для /lab).
- PDF-ссылка — на финальный файл научного обоснования в Drive (публичный access).

## Правила применения

- Anchor-навигация: `/lab#monstera` ведёт прямо к recipe-mini монстеры (с автоскроллом).
- Crawler-friendly: все 11 компонентов и 7 SKU как индексируемые семантические HTML-секции (article + h4), без JS-render-only.
- Schema.org `Article` обязателен (это контент-страница, не product).
- WhisperHero на этой странице — `withCTA={false}` (manifesto-режим).
- Аналитика: `view_lab`, `scroll_depth_lab`, `click_recipe_{slug}`, `download_pdf_lab`, `click_ozon_from_lab_{slug}`.
- UTM: исходящие переходы (Ozon, /collectio/[plant]) — `utm_source=site&utm_medium=lab&utm_content={recipe_slug}&utm_campaign=launch`.

## Что НЕ применять

См. `02_voice/anti-patterns.md`:
- Add-to-cart inline (страница про обоснование, не про продажу).
- TL;DR блоков (контент намеренно плотный — это и есть premium-обоснование).
- Анимация появления MaterialDot на scroll.
- Маркетинговые слова «лучший / уникальный».

## Где это работает

- Organism `HeroWhisper.md` — hero-обёртка.
- Molecule `WhisperHero.md` — композиция phrases.
- Molecule `MaterialsGrid.md` — полная сетка 11 материалов.
- Organism `SiteHeader.md` / `SiteFooter.md`.
- Atom `KickerHeader.md`, `MaterialDot.md`, `Button.md`, `ApothecaryBar.md`.
- `Продукт/Рецептуры/Заземли_научное_обоснование_рецептур.md` — основной источник контента.
- Master-brief §7.5 — канал обучения = сайт глубоко.

## История версий

- v1.0.0 · 2026-05-16 · первый draft, источник DS v1.0 §7.4. Закрыты миноры T5 (помечен inline `recipe-mini` как кандидат на molecule в Спринте 11) и M2 (UTM-схема дописана).

## Заметка про дубль (для Спринта 11)

DS v1.0 §7.4 → ссылка `→ 03_components/templates/lab.md`. **brand-v3 §13 мокап «Справочник грунтов»** использует устаревший URL `/soil` (правильный `/lab`) и сокращённый title «СПРАВОЧНИК ГРУНТОВ» — подлежит правке.

**Кандидат на новый molecule в Спринте 11:** `RecipeMini` (recipe-mini-карточка для /lab и /collectio/[plant] мини-рецептура — если используется ≥2 раз).
