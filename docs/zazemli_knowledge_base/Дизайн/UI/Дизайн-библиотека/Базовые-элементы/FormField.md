# FormField · Версия: 1.0.0 · Дата: 2026-05-14 · Источник: DS v1.0 §4.2.2 + §4.2.3

Атом слоя `03_components/atoms/`. Композиция label + поле + опциональное error.

## Что это

Минимальная самодостаточная единица «поле формы». Label-стиль здесь не дублируется — он живёт в `01_foundations/typography.md` (микро-типографика uppercase 0.25em). FormField — обёртка-композит.

## Роль в ДНК-четвёрке

Источник **02 Apothecary** (микро-капс, opacity-40, дисциплина) + источник **04 Handscript** только в error-state (Spectral italic poppy). См. `02_voice/dna.md` §1, §7.

## Состав

| Prop | Values | Default |
|---|---|---|
| `label` | string | required |
| `error` | string \| null | `null` |
| `children` | Input / Select | required |

```jsx
<div class="flex flex-col gap-2 focus-within:gap-2">
  <label class="
    block
    font-unbounded text-xs
    uppercase
    tracking-[0.25em]
    text-charcoal/40
    mb-2
  ">Email</label>

  <Input type="email" aria-invalid={!!error} />

  {error && (
    <span class="font-spectral italic text-sm text-poppy/80" role="alert">
      {error}
    </span>
  )}
</div>
```

Состояния обёртки: `focus-within` — без визуального изменения (фокус управляется самим `Input`).

## Варианты применения

- Email-форма подписки.
- Контактная форма.
- Поля выбора растения / горшка.
- Любая форма на сайте — обязательная обёртка для `Input` / `Select`.

## Правила применения

- Label обязателен. Без видимого label — только если есть `aria-label` на самом поле (например, поисковая строка в header).
- Label стиль фиксирован: Unbounded 12px uppercase, letter-spacing 0.25em, `charcoal/40`. Не переопределять.
- Error-text — Spectral italic, `poppy/80`, `role="alert"` для screen reader.
- Gap между label/input/error — `gap-2` (8px). Не больше, не меньше.

## Что НЕ применять

См. `02_voice/anti-patterns.md`:
- Floating label.
- Helper-text синего цвета (Material-стиль).
- Иконку перед error-сообщением.
- Звёздочку `*` для required (используем `aria-required`, без визуального шума).
- Tooltip-подсказки рядом с label.

## Где это работает

- `01_foundations/typography.md` — стиль label (микро-капс правило).
- `01_foundations/color-system.md` — `poppy` для error.
- Композирует `Input.md` или `Select.md`.
- Используется в molecules: `EmailSubscribeForm`.

## История версий

- v1.0.0 · 2026-05-14 · первый draft, источник DS v1.0 §4.2.2 + §4.2.3.

## Заметка про дубль (для Спринта 11)

DS v1.0 §4.2.2 (Label) и §4.2.3 (FormField composition) → ссылка `→ 03_components/atoms/FormField.md`. Label как самостоятельный атом не создаётся — стиль живёт в `typography.md` и применяется внутри FormField.
