# Doodle · Версия: 1.0.0 · Дата: 2026-05-14 · Источник: DS v1.0 §4.5.1 + brand-v3 §08 (дудлы)

Атом слоя `03_components/atoms/`. SVG-иллюстрация в почерке Насти.

## Что это

2 типа: SKU-цветные (7 растений) и универсальные ч-б (листик, корни, лопата). 2 способа подключения в коде в зависимости от мутабельности.

## Роль в ДНК-четвёрке

Мост **02 Apothecary ↔ 04 Handscript** — botanical предмет в почерковом исполнении. См. `02_voice/dna.md` §1, §7.

## Состав

| Prop | Values | Default |
|---|---|---|
| `src` | путь к SVG (для `<img>`-варианта) | — |
| `mode` | `colored` · `mono` | `colored` |
| `opacity` | hero (0.8–1.0) · accent (0.5–0.7) · bg (0.1–0.25) | по контексту |

**Способ A · `<img>` (для fixed colored).** SKU-doodles и любые многоцветные SVG, цвета зашиты в файле.

```jsx
<img src="/assets/doodles/colored/monstera-moss.svg" alt="" class="w-32 h-32 opacity-90" />
```

**Способ B · inline SVG (для mono с `currentColor`).** Универсальные ч-б doodles — корень/листик/лопата. Цвет наследуется от родителя через `currentColor`, opacity управляется CSS.

```jsx
<svg
  viewBox="0 0 100 100"
  fill="none"
  stroke="currentColor"
  stroke-width="1.2"
  aria-hidden="true"
  class="absolute top-8 right-8 w-16 h-16 text-charcoal opacity-15"
>
  <path d="M50,12 C60,22 72,30 78,42 …" />
</svg>
```

Выбор способа: если цвет нужно менять контекстно (или подсвечивать через text-color) — inline SVG. Если doodle самодостаточный и многоцветный — `<img>`.

## Варианты применения

- Hero страницы SKU — крупный colored doodle (0.8–1.0).
- Фоновый акцент в hero / manifesto — mono inline SVG на opacity 0.10–0.25.
- Иконка-разделитель в product-card / footer — mono inline SVG на 0.5–0.7.

## Правила применения

- `alt=""` (для `<img>`) или `aria-hidden="true"` (для inline SVG) — декоративный, не контентный.
- SKU-doodle — только в цвете соответствующего SKU.
- Mono — `currentColor` (inline) или явно `charcoal` (атрибут fill/stroke). Не цветной.
- Не более 3 doodle в видимой части страницы.
- Анимация запрещена; если когда-то появится — обёрнута в `@media (prefers-reduced-motion: no-preference)`.
- Источник файлов — `/assets/doodles/` (colored/ vs mono/).

## Что НЕ применять

См. `02_voice/anti-patterns.md`:
- Stock-иллюстрации (Lucide, Heroicons, Phosphor — запрещены).
- Doodle в opacity 1.0 на фоне (отвлекает от типографики).
- Mono-doodle в SKU-цвете (только charcoal или currentColor).
- Анимация doodle (hover-scale, rotate).
- Inline SVG без `aria-hidden` (создаёт шум для screen reader).

## Где это работает

- `01_foundations/iconography.md` — doodle-семейство.
- `01_foundations/color-system.md` — SKU-палитра.
- Композирует с: `Hero`, `WhisperHero`, `ProductCardFull`, `ProductCardMini`.

## История версий

- v1.0.0 · 2026-05-14 · первый draft, источник DS v1.0 §4.5.1. Уточнено после mock-валидации Спринта 4 (M-13): 2 паттерна подключения.

## Заметка про дубль (для Спринта 11)

DS v1.0 §4.5.1 → ссылка `→ 03_components/atoms/Doodle.md`. brand-v3 §08 — каталог иллюстраций, остаётся как библиотека.
