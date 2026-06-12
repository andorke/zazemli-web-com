# CaveatNote · Версия: 1.0.0 · Дата: 2026-05-14 · Источник: DS v1.0 §4.3.3 + brand-v3 §07.05 (открытка-вкладка)

Атом слоя `03_components/atoms/`. Рукописная приписка-пасхалка. 3 варианта.

## Что это

Caveat font, тёплая нота. 3 варианта: `brand-signature` / `sku-humor` / `journal-pair`.

## Роль в ДНК-четвёрке

Источник **04 Handscript** — почерк Насти как вербальная сторона ДНК. См. `02_voice/dna.md` §1, §7.

## Состав

| Prop | Values | Default |
|---|---|---|
| `variant` | `brand-signature` · `sku-humor` · `journal-pair` | `brand-signature` |
| `children` | string (короткая фраза) | — |

```jsx
function CaveatNote({ variant = 'brand-signature', children }) {
  const variants = {
    'brand-signature': 'text-charcoal/85 -rotate-1 text-2xl',
    'sku-humor':       'text-[var(--accent-sku)]/85 rotate-1 text-lg',
    'journal-pair':    'text-moss/85 -rotate-1 text-xl',
  }
  return <span class={`font-caveat inline-block ${variants[variant]}`}>{children}</span>
}
```

## Варианты применения

- `brand-signature` (24px charcoal) — footer, hero, манифест.
- `sku-humor` (18px SKU-acc) — product-card, IG-сторис.
- `journal-pair` (20px moss) — success-state, manifesto-вставка.

## Правила применения

- **Максимум 2 Caveat в контентной зоне страницы** (TOV §1.3 для веба).
- Не считаются в счёт: Caveat в `SiteHeader`, `SiteFooter`, favicon.
- Считаются: Hero, content-секции, product-cards, inline success/error, manifesto.
- WCAG (DS §2.7.5): для SKU cosmos/iris/buttercup `sku-humor` ≥24px — иначе на moss/charcoal.
- Enforce лимита — на уровне templates / molecules (например, `WhisperHero` сам не использует CaveatNote, а manifesto-organism считает Caveat в children и предупреждает при build).
- Текст — TOV-фразы (`02_voice/word-list.md` whitelist).

## Что НЕ применять

См. `02_voice/anti-patterns.md`:
- 3+ Caveat на странице.
- Caveat для CTA / кнопок.
- Перевод выше 24px (теряет «приписку»).
- Serious-сообщения (price, error-text — это Spectral italic).

## Где это работает

- `01_foundations/typography.md` — Caveat 400.
- `02_voice/word-list.md` — whitelist фраз.
- `02_voice/voice-principles.md` — регистр (Подруга / Редактор).
- `01_foundations/color-system.md` — WCAG-ограничения по SKU.
- Композирует с: `Hero`, `ProductCardFull`, `SiteFooter`.

## История версий

- v1.0.0 · 2026-05-14 · первый draft, источник DS v1.0 §4.3.3.

## Заметка про дубль (для Спринта 11)

DS v1.0 §4.3.3 → ссылка `→ 03_components/atoms/CaveatNote.md`. brand-v3 §07.05 (открытка-вкладка) — пример применения, остаётся как иллюстрация.
