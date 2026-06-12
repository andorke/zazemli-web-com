# navigation-patterns · Версия: 1.0.0 · Дата: 2026-05-16 · Источник: DS v1.0 §6.1 (SiteHeader/Footer) + §7.1-7.7 (templates) + master-brief §7.5

Pattern слоя `04_patterns/`. Паттерны навигации сайта: глобальная chrome, внутри-страничная навигация, исходящие переходы, UTM-стратегия.

## Что это

Как пользователь перемещается между страницами сайта и наружу (Ozon, IG, TG). Какие глобальные элементы (SiteHeader / SiteFooter) присутствуют везде, какие — контекстные. Как трекаются переходы.

## Роль в ДНК-четвёрке + канал обучения

Источник **02 Apothecary** (sparse-навигация, минимальный chrome, без популярных popup'ов). Канал обучения: **сайт — глубоко обучаем** (master-brief §7.5). Навигация поддерживает educational journey — от главной к /lab или /guide, потом к /collectio/[plant] → Ozon. См. `02_voice/dna.md` §1, §7.

## Паттерн A · Глобальная chrome (на каждой странице)

```
<SiteHeader />     // organism — sticky top, bone-фон
{content}
<SiteFooter />     // organism — charcoal, единственный dark-блок
```

**Правила:**
- `SiteHeader` обязателен на каждом template. Никаких исключений.
- `SiteFooter` обязателен. Один на странице.
- Между ними — content любой композиции.
- Caveat в Header / Footer **НЕ считается** в счёт «2 Caveat на страницу».

## Паттерн B · Внутри-страничная навигация (anchor)

Используется на `/lab`:
- `/lab#monstera`, `/lab#ficus`, … — переход к recipe-mini конкретного SKU.
- Реализация: native HTML `<a href="#monstera">` + `id="monstera"` на article.
- Scroll-behavior: `smooth` (CSS).
- Никакого custom-JS scroll-spy.

Может появиться в Спринте 8+ на /about (anchor к секциям манифеста).

## Паттерн C · Cross-page переходы (внутренние)

| От | К | Где живёт |
|---|---|---|
| `/` главная | `/collectio` | CollectionPreview «все 7 →» (ghost Button) |
| `/` главная | `/lab` | lab-teaser section (secondary Button) |
| `/` главная | `/guide` | guide-teaser section (secondary Button) |
| `/collectio` | `/collectio/{plant}` | ProductCardMini как `<a>` |
| `/collectio/{plant}` | `/lab#{plant}` | «Открыть полную лабораторию» (secondary Button) |
| `/collectio/{plant}` | `/guide` | «Полный гайд по пересадке» (secondary Button) |
| `/collectio/{plant}` | `/about` | inline-link «о бренде →» |
| `/guide` | `/diary-signup` | «Подписаться на дневник» (primary Button) |
| `/lab` | PDF download | «Скачать PDF · 343 строки» (primary Button) |
| `/about` | `/diary-signup` | «Подписаться на дневник» (secondary Button) |
| `/diary-signup` | success-state | inline-обновление страницы (без redirect) |

**Принципы:**
- Преимущественно `ghost` / `secondary` Button для внутренних переходов.
- `primary` Button — только для конверсионных целей: «Купить на Ozon» (внешний), «Подписаться на дневник» (внутренний CTA-конверсия).

## Паттерн D · Исходящие переходы (внешние)

| Назначение | Пример | UTM-схема |
|---|---|---|
| Ozon | Купить на Ozon · 2 590 ₽ | `utm_source=site&utm_medium={sku\|hero\|collection}&utm_content={slug}&utm_campaign=launch` |
| Instagram | `@zazemli_collectio` | `utm_source=site&utm_medium={footer\|about\|nav}&utm_content=ig` |
| Telegram | `@zazemli_collectio` | `utm_source=site&utm_medium={footer\|about}&utm_content=tg` |
| Email Mailto | `hello@zazemli.com` | без UTM (mailto) |
| PDF | Заземли_научное_обоснование_рецептур.pdf | без UTM (download) |

**Правила:**
- Все Ozon-ссылки → `rel="noopener"` + `target="_blank"`.
- Соцсети открываются в новой вкладке.
- Mailto — без `target="_blank"` (открывает почтовый клиент).

## Паттерн E · Mobile-навигация

На mobile (≤ md, 720px):
- `SiteHeader` сворачивается: wordmark + hamburger-icon, nav-row уезжает в drawer.
- Caveat в header — `hidden md:inline` (скрыт на mobile).
- `SiteFooter` — 1 column вместо 3 (CSS grid).
- Реализация drawer — в template / page-level layout. На MVP можно отложить (Спринт 8+ или вообще не делать — у нас 4 nav-link, легко влезает горизонтально).

## Паттерн F · Skip-link для a11y

```jsx
<a href="#main-content" class="skip-link sr-only focus:not-sr-only">
  Перейти к содержимому
</a>
```

Появляется только при `:focus` (для клавиатурной навигации). Не часть SiteHeader — page-level layout.

## Правила применения

- **SiteHeader + SiteFooter — везде.** Никаких страниц без них.
- **Active-link подсветка** — только через `opacity` (charcoal/70 → charcoal на hover/active). Никаких SKU-цветов, underline, border.
- **UTM-схема обязательна** на исходящих коммерческих ссылках (Ozon).
- **`target="_blank"` + `rel="noopener"`** на всех внешних ссылках.
- **Anchor-навигация** — only smooth scroll через CSS.
- **Скрипты навигации** запрещены на MVP (apothecary-минимализм). Drawer, scroll-spy, sticky-mega-menu — нет.

## Что НЕ применять

См. `02_voice/anti-patterns.md`:
- Mega-menu (раскрывающееся меню с категориями).
- Hover-flyout submenus.
- Sticky-buy bar.
- Hide-header-on-scroll анимация.
- Корзина / wishlist / профиль в SiteHeader (нет аккаунтов, нет корзины).
- Language switcher (только русский).
- Country/region switcher (только Россия на MVP).
- Поиск (нет на MVP).

## Где это работает

- `03_components/organisms/SiteHeader.md` — глобальная шапка.
- `03_components/organisms/SiteFooter.md` — глобальный футер.
- `03_components/atoms/Button.md` — единое правило focus + variant ghost для внутренних переходов.
- Templates: home, collectio, collectio-plant, lab, guide, about, diary-signup — все.
- Master-brief §7.5 — канал обучения = сайт глубоко.
- `01_foundations/brand-identity.md` — handle IG/TG `@zazemli_collectio`.

## История версий

- v1.0.0 · 2026-05-16 · первый draft. Собран после Спринтов 5-6 (SiteHeader, SiteFooter, templates) — формализация правил навигации, которые повторяются в каждом template.

## Заметка про дубль (для Спринта 11)

DS v1.0 §6.1 (SiteHeader/Footer) и §7.1-7.7 (templates, где UTM/аналитика повторяется) — этот pattern формализует повторения. Не дублирует organisms / templates — добавляет meta-уровень.
