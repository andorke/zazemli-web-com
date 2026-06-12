# Button · Версия: 1.0.0 · Дата: 2026-05-14 · Источник: DS v1.0 §4.1 + brand-v3 §11.1 (UI-Кнопки)

Атом слоя `03_components/atoms/`. Интерактивное действие. 5 вариантов × 6 состояний × 2 размера.

## Что это

Кнопка CTA. Используется во всех веб-касаниях («Купить на Ozon», «Подписаться», «Подробнее»). Не оформление — функциональный элемент со строгим контролем по TOV.

## Роль в ДНК-четвёрке

Источник **02 Apothecary** (charcoal/bone, бордюры, ритуальная сдержанность) + источник **04 Handscript** через копирайт (язык TOV-друга, без восклицаний). См. `02_voice/dna.md` §1, §7.

## Состав

| Prop | Values | Default |
|---|---|---|
| `variant` | `primary` · `secondary` · `ghost` · `accent` · `inverted` | `primary` |
| `size` | `sm` (36px) · `base` (44px) | `base` |
| `state` | default · hover · focus · active · disabled · loading | через CSS |

### Варианты — конкретика поведения

| Variant | Background | Text | Border | Hover-state |
|---|---|---|---|---|
| `primary` | charcoal | bone | none | opacity 0.85 + translateY −2px |
| `secondary` | transparent | charcoal | 1px charcoal/15 | border charcoal/50 + translateY −2px |
| `ghost` | transparent | charcoal | none | **underline появляется на hover** (off в default) |
| `accent` | moss | bone | none | opacity 0.85 + translateY −2px |
| `inverted` | bone | charcoal | none | opacity 0.85 + translateY −2px |

### JSX

```jsx
// Primary
<button class="
  inline-flex items-center justify-center
  px-6 py-3
  bg-charcoal text-bone
  font-unbounded text-base
  rounded-sm
  transition-[opacity,transform,border-color] duration-200 ease-out
  hover:opacity-85 hover:-translate-y-0.5
  focus:outline-2 focus:outline-moss focus:outline-offset-2
  active:translate-y-0 active:opacity-95
  disabled:opacity-40 disabled:cursor-not-allowed
">Купить на Ozon</button>

// Ghost — без underline в default, underline появляется по hover
<button class="
  inline-flex items-center justify-center
  px-0 py-3
  bg-transparent text-charcoal
  font-unbounded text-base
  no-underline hover:underline underline-offset-4
  transition-[opacity,text-decoration] duration-200 ease-out
  hover:opacity-70
  focus:outline-2 focus:outline-moss focus:outline-offset-2
  disabled:opacity-40 disabled:cursor-not-allowed
">Подобрать растение</button>
```

Полные JSX для всех 5 вариантов — DS v1.0 §4.1.4.

## Варианты применения

- `primary` — главный CTA: «Купить на Ozon», «Подписаться на дневник».
- `secondary` — вторичный: «Подробнее», «Посмотреть коллекцию».
- `ghost` — третичный (inline в hero рядом с primary, списки, footer-меню).
- `accent` (moss) — signature actions, редко.
- `inverted` — только на dark-секциях.

## Правила применения

- Размер `base` (44px) — баннеры, hero, формы. `sm` (36px) — inline-CTA, sticky-bar.
- Focus: `outline 2px moss` + `outline-offset 2px` (никакого glow).
- Transition — только перечисленные свойства. Запрет `transition-all` (DS §2.7.3).
- Текст кнопки — глагол императива (`02_voice/word-list.md` whitelist).
- **Ghost-variant:** underline в default-state НЕ ставится. Underline только на hover (`hover:underline`). Это сознательно — в hero ghost рядом с primary не должен конкурировать визуально.

## Что НЕ применять

См. `02_voice/anti-patterns.md`:
- «В корзину» / «Добавить в корзину» (нет корзины на запуске).
- «Заказать» (мы не магазин).
- «Купи прямо сейчас!» и любые восклицания (`02_voice/word-list.md` blacklist).
- Тени, скругления >2px, градиенты.
- `transition-all`.
- Ghost со статичным underline (см. правило выше).

## Где это работает

- `01_foundations/tokens.json` — charcoal, bone, moss, radius-tight.
- `01_foundations/semantic-tokens.md` — `--button-primary-bg`, `--focus-outline`.
- `01_foundations/typography.md` — Unbounded text-base.
- `02_voice/word-list.md` — whitelist глаголов CTA.
- Используется в molecules: `EmailSubscribeForm`, `ProductCardFull`, `ProductCardMini`. Используется в templates Hero (Спринт 6).

## История версий

- v1.0.0 · 2026-05-14 · первый draft, источник DS v1.0 §4.1. Уточнено после mock-валидации Спринта 4 (M-14): ghost-variant — underline появляется только на hover.

## Заметка про дубль (для Спринта 11)

В DS v1.0 §4.1 полное определение `Button` заменяется на ссылку `→ 03_components/atoms/Button.md`. В brand-v3 §11.1 строка «купить бокс · подробнее · в корзину» подлежит правке (запрет «в корзину» по anti-patterns) или удалению.
