# WhisperPhrase · Версия: 1.0.0 · Дата: 2026-05-14 · Источник: brand-v3 §07.06 «Editorial · Whisper Mode» + dna §1 (источник 04 Handscript)

Атом слоя `03_components/atoms/`. Фраза «шёпотом» с указателем `→` или `←`.

## Что это

Микро-typo акцент: короткая фраза TOV-друга + маркер-стрелка. Ambient присутствие на странице.

## Роль в ДНК-четвёрке

Чистый источник **04 Handscript** — вербальная сторона ДНК (голос друга, нашёптывание). Маркер `→ / ←` — мост к **02 Apothecary** (sparse-метка). См. `02_voice/dna.md` §1, §7.

## Состав

| Prop | Values | Default |
|---|---|---|
| `direction` | `forward` (→) · `back` (←) | `forward` |
| `children` | string (короткая TOV-фраза) | — |

```jsx
function WhisperPhrase({ direction = 'forward', children }) {
  const isForward = direction === 'forward'
  return (
    <span class="
      inline-flex items-center gap-2
      font-unbounded font-light
      text-base text-charcoal/60
      tracking-wide
    ">
      {isForward && <span aria-hidden="true">→</span>}
      <span>{children}</span>
      {!isForward && <span aria-hidden="true">←</span>}
    </span>
  )
}
```

Стрелки декоративные (`aria-hidden`), смысл несёт текст-children.

## Варианты применения

- `WhisperHero` (molecule) — основная композиция: «→ подышать землёй», «→ 11 компонентов внутри», «монстера, фикус, калатея ←», «всё для одного горшка ←».
- Hero-секции templates (между wordmark и CTA).
- IG-сторис карусели (статичные).
- Editorial-вставки в `/about` манифесте.

## Правила применения

- Текст — короткий, ≤6 слов, в TOV-друг тоне (`02_voice/word-list.md` whitelist).
- Маркер `→` всегда слева, `←` всегда справа (зеркальная симметрия).
- Цвет — `charcoal/60` (тише основного текста — это шёпот).
- Не повышать opacity до 1.0 — теряет «whisper».
- Минимум 2, максимум 4 WhisperPhrase в одном WhisperHero блоке.

## Что НЕ применять

См. `02_voice/anti-patterns.md`:
- Caveat font (это другой атом — `CaveatNote`).
- SerialNumber-крупность (это не каталог-метка, это шёпот).
- Иконки вместо `→` (только textual arrow).
- Восклицания и точки в конце фразы.
- Анимация (typewriter, fade-in последовательно).

## Где это работает

- `02_voice/word-list.md` — whitelist фраз.
- `02_voice/voice-principles.md` — регистр Подруга.
- `01_foundations/color-system.md` — charcoal opacity.
- `01_foundations/typography.md` — Unbounded light.
- Композирует с: `WhisperHero` (molecule — основной носитель), Hero templates.

## История версий

- v1.0.0 · 2026-05-14 · первый draft, источник brand-v3 §07.06.

## Заметка про дубль (для Спринта 11)

brand-v3 §07.06 «Editorial · Whisper Mode» — пример композиции остаётся (application gallery), добавляется cross-ref на этот атом и на molecule `WhisperHero`. В DS v1.0 §4 явно не специфицирован — добавляется строка в индекс атомов с ссылкой `→ 03_components/atoms/WhisperPhrase.md`. Новый атом сверх явного перечня DS — фиксируется в плане v2 как корректировка.
