# Input · Версия: 1.0.0 · Дата: 2026-05-14 · Источник: DS v1.0 §4.2.1 + brand-v3 §11 (UI-Формы)

Атом слоя `03_components/atoms/`. Поле ввода, primitive.

## Что это

Единое визуальное правило для всех типов ввода (`email`, `text`, `tel`, `search`, `number`). Композит с label и error — `FormField`.

## Роль в ДНК-четвёрке

Источник **02 Apothecary** (bone-фон, тонкий бордюр charcoal/15, moss-focus). Без декоративных источников — поле утилитарное. См. `02_voice/dna.md` §1, §7.

## Состав

| Prop | Values | Default |
|---|---|---|
| `type` | `email` · `text` · `tel` · `search` · `number` | `text` |
| `state` | default · hover · focus · disabled · error · loading | через CSS / `aria-busy` / `aria-invalid` |
| `placeholder` | string (по TOV §1.3) | — |

```jsx
<input
  type="email"
  placeholder="hello@zazemli.com"
  aria-busy={isSubmitting}
  aria-invalid={hasError}
  class="
    w-full
    px-3 py-3
    bg-bone
    text-charcoal text-base font-unbounded
    border border-charcoal/15
    rounded-sm
    transition-colors duration-200 ease-out
    placeholder:text-charcoal/40
    focus:outline-none focus:border-moss
    disabled:opacity-40
    aria-busy:opacity-60
    aria-invalid:border-poppy/60
  "
/>
```

Состояния:
| Состояние | Изменение |
|---|---|
| default | `charcoal/15` border |
| hover | `charcoal/30` border |
| focus | `moss` border + `outline none` |
| disabled | `opacity 0.4` |
| error | `aria-invalid=true` → `poppy/60` border |
| loading | `aria-busy=true` → `opacity 0.6` |

## Варианты применения

- Email-форма подписки (`EmailSubscribeForm`).
- Поле поиска в `SiteHeader`.
- Контактная форма `/about`.
- Поле «название растения» на `/diary-signup`.

## Правила применения

- Высота 44px (выравнивание с `Button base`).
- Никогда без `Label` (через `FormField`) или `aria-label`.
- Placeholder — пример, не подсказка. Не дублирует label.
- Focus убирает дефолтный outline, ставит moss-border. На bone-фоне outline считается шумом.
- Error-state маркируется `aria-invalid=true` (a11y).

## Что НЕ применять

См. `02_voice/anti-patterns.md`:
- Floating label / material-style анимация.
- Цветной фон (Input всегда `bg-bone`).
- Скругления >2px.
- Тени.
- Иконки внутри input без причины (только лупа в search).

## Где это работает

- `01_foundations/tokens.json` — bone, charcoal, moss, poppy, radius-tight.
- `01_foundations/semantic-tokens.md` — `--input-border`, `--input-focus`, `--input-error`.
- Композирует с `Label` (через `FormField`), `Button` (inline submit-pair).
- Используется в molecules: `EmailSubscribeForm`.

## История версий

- v1.0.0 · 2026-05-14 · первый draft, источник DS v1.0 §4.2.1.

## Заметка про дубль (для Спринта 11)

DS v1.0 §4.2.1 → ссылка `→ 03_components/atoms/Input.md`.
