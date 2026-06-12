# home (главная `/`) · Версия: 1.0.0 · Дата: 2026-05-16 · Источник: DS v1.0 §7.1 + brand-v3 §13 (мокап «Главная»)

Template слоя `03_components/templates/`. Главная страница `zazemli.com`.

## Что это

Витрина бренда: hero с двойным прочтением → превью коллекции → лаб-тизер → гайд-тизер → email-подписка. Цель — конверсия в Ozon-переход или подписку на дневник.

## Роль в ДНК-четвёрке + канал обучения

Все 4 источника ДНК присутствуют (canonical hero `HeroDefault` = воплощение dna §1). По 3-канальной матрице обучения (master-brief §7.5): **сайт — глубоко обучаем**. На главной — обучение через ритуал и манифест, не через техдок. См. `02_voice/dna.md` §1, §7.

## URL + SEO meta

| Поле | Значение |
|---|---|
| URL | `/` (canonical `https://zazemli.com/`) |
| `<title>` | `ЗАЗЕМЛИ · бокс для пересадки комнатного растения` |
| `<meta description>` | `Premium-бокс с грунтом под биотоп. 7 растений × 16 рецептур. Дневник на год.` (≤160) |
| OG image | `/og/home-1200x630.jpg` (HeroDefault + wordmark) |
| `<link rel="canonical">` | `https://zazemli.com/` |
| Schema.org | `Organization` + `WebSite` |

## Композиция organisms

```
<SiteHeader />                                          // organism, sticky
<HeroDefault />                                          // organism — bone, padding 96/128 desktop, регистр Редактор
<ApothecaryBar />                                        // atom
<CollectionPreview plants={top4} />                      // organism — 4 карточки + «все 7 →», регистр Наставник
<ApothecaryBar />
<section class="lab-teaser bg-chalk">                    // chalk-alternating, регистр Наставник
  <KickerHeader>11 КОМПОНЕНТОВ</KickerHeader>
  <h2>В каждом боксе — 11 компонентов</h2>
  <p class="font-spectral italic">…2 строки…</p>
  <Button variant="secondary" as="a" href="/lab">Открыть лабораторию</Button>
</section>
<ApothecaryBar />
<section class="guide-teaser bg-bone">                   // регистр Наставник
  <KickerHeader>РИТУАЛ ПЕРЕСАДКИ · 4 ШАГА</KickerHeader>
  <h2>Пересадка за 15 минут</h2>
  {/* 3 RitualStep preview-mini */}
  <Button variant="secondary" as="a" href="/guide">Полный гайд</Button>
</section>
<ApothecaryBar />
<EmailSubscribeForm context="main" />                    // molecule, bone, регистр Подруга
<SiteFooter />                                           // organism
```

## Page-specific data

- `plants[top4]` — первые 4 SKU из конфига (001 монстера, 002 фикус, 003 спатифиллум, 004 антуриум).
- KickerHeader-слаг «ПАРТИЯ 0» — env-переменная (меняется при выпуске партий).
- Lab-teaser, guide-teaser, EmailSubscribeForm copy — из `02_voice/genre-templates.md`.

## Правила применения

- **Один HeroDefault** на странице (не дублировать).
- Caveat-лимит в content-zone: 1 (в HeroDefault) — больше не добавлять.
- Аналитика — Я.Метрика + UTM на CTA-кнопках (`utm_source=site&utm_medium=home_hero&utm_campaign=launch`).
- Конверсионные события: `click_ozon_hero`, `click_diary_subscribe`, `click_lab_teaser`, `click_guide_teaser`.
- Mobile padding hero `py-24`, desktop `py-32`. Между секциями `py-24`.
- Focus-state на всех Button — единое правило (см. `atoms/Button.md`).
- Schema.org разметка — `Organization` (логотип, контакты, sameAs IG/TG) + `WebSite` (search action — заглушка, на MVP без поиска).

## Что НЕ применять

См. `02_voice/anti-patterns.md`:
- Корзина в HeroDefault (нет корзины — переход на Ozon).
- Маркетинговые блоки «хит / sale / -30%».
- Popup при первом визите.
- Auto-play видео-фон.
- Carousel в hero.
- Newsletter-popup через 30 секунд.

## Где это работает

- Organism `HeroDefault.md` — canonical hero.
- Organism `CollectionPreview.md` — превью 4 SKU.
- Organism `SiteHeader.md` / `SiteFooter.md` — chrome.
- Atom `KickerHeader.md`, `Button.md`, `ApothecaryBar.md`.
- Molecule `RitualStep.md` (preview-mini variant для guide-teaser) — если ещё нет preview-mini variant, добавится в molecules.
- Molecule `EmailSubscribeForm.md` — context="main".
- `02_voice/genre-templates.md` — копирайт teaser-секций.
- Master-brief §7.5 — канал обучения = сайт глубоко.

## История версий

- v1.0.0 · 2026-05-16 · первый draft, источник DS v1.0 §7.1.

## Заметка про дубль (для Спринта 11)

DS v1.0 §7.1 → ссылка `→ 03_components/templates/home.md`. **brand-v3 §13 мокап «Главная»** содержит устаревшее: «купить бокс», «корзина», цена «2 490 ₽» (вместо 1 890), `/soil` URL — этот мокап подлежит правке или удалению как application gallery (логировать в Спринте 11).
