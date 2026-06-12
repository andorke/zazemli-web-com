# KickerHeader · Версия: 1.0.0 · Дата: 2026-05-14 · Источник: DS v1.0 §4.3.1 + brand-v3 §03.5 (apothecary якорь 01 «COLLECTIO»)

Атом слоя `03_components/atoms/`. 3-частная композиция `brand-name · N°[партия] · slug[SKU]`.

## Что это

Apothecary-якорь COLLECTIO, который раздаёт «гид» по странице сверху hero / секции.

## Роль в ДНК-четвёрке

Чистый источник **02 Apothecary** — формула COLLECTIO ZAZEMLI · N° 001 · monstera. Вербальная маркировка «где ты» в музейном экспонате. См. `02_voice/dna.md` §1, §7.

## Состав

| Prop | Values | Default |
|---|---|---|
| `brand` | string (uppercase) | `COLLECTIO ZAZEMLI` |
| `serial` | string (Spectral italic) | `N° 001` |
| `slug` | string (Spectral italic, лат. род) | `monstera` |

```jsx
<div class="
  flex items-center justify-center gap-3
  font-unbounded font-medium
  text-xs
  uppercase
  tracking-[0.18em]
  text-charcoal/75
  mb-6
">
  <span>COLLECTIO ZAZEMLI</span>
  <span class="opacity-50">·</span>
  <span class="font-spectral italic normal-case tracking-normal">N° 001</span>
  <span class="opacity-50">·</span>
  <span class="font-spectral italic normal-case tracking-normal">monstera</span>
</div>
```

## Варианты применения

- Hero-секция страницы SKU (`/collectio/monstera`).
- Шапка manifesto-страницы (`/about`).
- Открытие лабораторного блока на `/lab`.
- Email-templates: title-bar в письме.
- НЕ используется в product-card (там — `SerialNumber` отдельно).

## Правила применения

- Brand-name — uppercase Unbounded 12px, tracking 0.18em.
- N° — Spectral italic, `normal-case`, без letter-spacing.
- Slug — латынь рода. **Правило «только латынь рода» — `02_voice/word-list.md` whitelist + `02_voice/voice-principles.md`**. Декоративная латынь (observatio, cyclus) запрещена.
- Опасити `charcoal/75` — «латинский» оттенок (DS §3 semantic).
- Разделитель — точка `·` `opacity 0.5`.
- Минимум 24px gap до следующего блока (`mb-6`).

## Что НЕ применять

См. `02_voice/anti-patterns.md`:
- Декоративная латынь (observatio, cyclus, momento).
- SVG / эмодзи между элементами kicker (только `·` или `❦` в особом случае).
- Цветной brand-name (всегда `charcoal/75`).
- Tracking больше 0.25em.
- Использование вместо `SerialNumber` в product-card.

## Где это работает

- `01_foundations/iconography.md` — apothecary якорь 01 COLLECTIO.
- `01_foundations/typography.md` — Unbounded uppercase, Spectral italic.
- `01_foundations/color-system.md` — `charcoal/75` латынь.
- `02_voice/word-list.md` — whitelist латыни.
- Композирует с: `Fleuron` (опциональный ❦ перед brand-name), `SerialNumber` (крупный N° под kicker).
- Используется в templates: `/collectio/[plant]`, `/about`, `/lab`.

## История версий

- v1.0.0 · 2026-05-14 · первый draft, источник DS v1.0 §4.3.1.

## Заметка про дубль (для Спринта 11)

DS v1.0 §4.3.1 → ссылка `→ 03_components/atoms/KickerHeader.md`. В brand-v3 §03.5 «якорь 01 COLLECTIO» — текстовое описание остаётся (это семантика якоря, не реализация), добавляется cross-ref.
