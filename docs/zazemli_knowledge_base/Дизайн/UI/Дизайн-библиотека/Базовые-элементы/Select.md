# Select · Версия: 1.0.0 · Дата: 2026-05-14 · Источник: экстраполяция из DS v1.0 §4.2.1 (Input) + brand-v3 §11 (UI-Формы) + apothecary-минимализм (DS §1.1)

Атом слоя `03_components/atoms/`. Выпадающее поле выбора. Расширяет формы там, где `Input` не подходит.

## Что это

Native `<select>` или кастомный dropdown, визуально подчинён правилам `Input` (bone-фон, charcoal/15 border, moss focus). MVP — только native.

## Роль в ДНК-четвёрке

Источник **02 Apothecary** (тот же стиль, что у Input — единство ритма формы). См. `02_voice/dna.md` §1, §7.

## Состав

| Prop | Values | Default |
|---|---|---|
| `options` | `Array<{ value, label }>` | required |
| `value` | string | — |
| `placeholder` | string (по TOV §1.3) | — |
| `state` | default · hover · focus · disabled · error | через CSS / `aria-invalid` |

```jsx
<select
  aria-invalid={hasError}
  class="
    w-full
    px-3 py-3
    bg-bone
    text-charcoal text-base font-unbounded
    border border-charcoal/15
    rounded-sm
    transition-colors duration-200 ease-out
    appearance-none
    bg-[url('/assets/ui/chevron-down.svg')] bg-no-repeat
    bg-[right_12px_center] pr-9
    focus:outline-none focus:border-moss
    disabled:opacity-40
    aria-invalid:border-poppy/60
  "
>
  <option value="" disabled selected>Выберите растение</option>
  <option value="monstera">Монстера</option>
</select>
```

Состояния — симметричны `Input` (см. `Input.md` таблицу состояний).

**Замечание для CTO:** динамический `bg-[url(...)]` требует safelist в `tailwind.config.ts` либо переноса в обычный CSS-class. На этапе MVP — оставить как есть с safelist-исключением.

## Варианты применения

- Выбор растения на `/diary-signup` (7 SKU).
- Выбор горшка / размера на `/collectio/[plant]`.
- Выбор города доставки в контактной форме.

## Правила применения

- Высота 44px — выравнивание с `Input` и `Button base`.
- В MVP — только native `<select>`. Кастомные dropdown-библиотеки (Headless UI и т.п.) — запрещены apothecary-минимализмом.
- Chevron-иконка — единая, charcoal/60, без rotate-on-open анимаций.
- Через `FormField` (label обязателен).
- Error-state — `aria-invalid=true` (как у Input).

## Что НЕ применять

См. `02_voice/anti-patterns.md`:
- Кастомные dropdown без явной нужды.
- Multi-select с чекбоксами (если нужно — `RadioGroup` / `Checkbox` в Спринте 5).
- Searchable dropdown (комбобокс) на MVP.
- Цветной фон выбранного option.
- Анимация раскрытия (используем native UA-поведение).

## Где это работает

- `Input.md` — синхронизация стилей.
- `FormField.md` — обязательный родитель.
- `01_foundations/tokens.json` — bone, charcoal, moss, poppy.
- `01_foundations/iconography.md` — chevron (семейство UI-doodles; если артефакт отсутствует — добавить в Спринт 11).
- Используется в templates: `/diary-signup`, `/collectio/[plant]`.

## История версий

- v1.0.0 · 2026-05-14 · первый draft. В DS v1.0 §4 явно не специфицирован — выведен из общего паттерна Input + правил apothecary.

## Заметка про дубль (для Спринта 11)

В DS v1.0 §4 явное определение `Select` отсутствует — добавляется строка в индекс §4 с ссылкой `→ 03_components/atoms/Select.md`. Это **новый атом сверх явного перечня DS** — фиксируется в плане v2 как корректировка.
