# Badge · Версия: 1.0.0 · Дата: 2026-05-14 · Источник: DS v1.0 §4.5.3 + brand-v3 §11 (UI-Бейджи, конфликт)

Атом слоя `03_components/atoms/`. Inline-метка размера / серийника / латыни / партии.

## Что это

2 варианта: `outline` (default) и `solid`.

## Роль в ДНК-четвёрке

Источник **02 Apothecary** (каталогизация, информация без эмоции). См. `02_voice/dna.md` §1, §7.

## Состав

| Prop | Values | Default |
|---|---|---|
| `variant` | `outline` · `solid` | `outline` |
| `children` | string | required |

```jsx
// Outline
<span class="
  inline-block px-3 py-1
  font-unbounded text-xs uppercase tracking-[0.16em]
  text-charcoal/60
  border border-charcoal/15
  rounded-none
">1.2 л</span>

// Solid
<span class="
  inline-block px-3 py-1
  font-unbounded text-xs uppercase tracking-[0.16em]
  bg-moss text-bone
  rounded-none
">N° 001</span>
```

## Варианты применения

- Размеры горшка («1.2 л», «2.2 л», «3.5 л»).
- Серийник в product-card («N° 001»).
- Латынь рода («monstera» — Spectral italic, без uppercase).
- Партия («партия 0» — Spectral italic).

## Правила применения

- Outline по умолчанию. Solid — только для signature-меток (N° 001 в hero).
- Tracking 0.16em, uppercase для русского/системного текста.
- Латынь — Spectral italic, **без uppercase**, `normal-case`.
- `rounded-none` — никаких скруглений.

## Что НЕ применять

**КРИТИЧНО.** Запрещённые слова на бейджах (`02_voice/word-list.md` blacklist + `02_voice/anti-patterns.md` §marketing-words):
- «хит» / «new» / «sale» / «last chance»
- «скидка» / «-30%» / «-50%»
- «бестселлер» / «топ продаж»

**Конфликт с brand-v3 §11**: там показаны «new · хит · last chance» — устаревший пример, заменяется в Спринте 11 (логировать как source-section правку).

Также:
- Эмодзи — никогда.
- Цветной фон, кроме moss / SKU.
- Скругление.

## Где это работает

- `02_voice/word-list.md` — whitelist текстов.
- `02_voice/anti-patterns.md` — marketing-words запрет.
- `01_foundations/typography.md` — Unbounded uppercase, Spectral italic.
- Композирует с: `ProductCardMini`, `ProductCardFull`, `KickerHeader`.

## История версий

- v1.0.0 · 2026-05-14 · первый draft, источник DS v1.0 §4.5.3.

## Заметка про дубль (для Спринта 11)

DS v1.0 §4.5.3 → ссылка `→ 03_components/atoms/Badge.md`. **brand-v3 §11 содержит конфликт** — примеры «new · хит · last chance» подлежат правке или удалению (логировать как source-section правку).
