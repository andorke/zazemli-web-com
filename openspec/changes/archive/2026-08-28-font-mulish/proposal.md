# font-mulish

## Why

Решение Насты 30.07 (PATCH-1 §1): голос сайта переезжает с серифа на гротеск **Mulish**. Прежний канон (Newsreader) был невыполним — у семейства физически нет кириллицы, поэтому в сборке стоял «временный дублёр» Literata. Патч закрывает вопрос семейства окончательно; вместе со сменой породы трекинг становится несущим элементом типографики, а не косметикой.

## What Changes

- Voice-роль: Literata → **Mulish** (self-host variable woff2, cyrillic+latin, веса 300/600, курсив 300/400 — настоящий italic-файл; `oblique`/`skew` запрещены).
- Fallback voice-роли: `'Helvetica Neue', Arial, sans-serif` вместо серифного (Georgia отменена — скачок метрик).
- Оптическая ось `opsz` уходит из контракта — у Mulish её не бывает.
- Трекинг-шкала входит в токены: от `−0.035em` (display-hero) до `+0.2em` (eyebrow); нулевой трекинг на заголовке — ошибка сборки.
- Веса крупных заголовков — **по прототипу (300–400)**, не по канону typography.md v3.0 (600): расхождение известное, источник — прототип (PATCH-1 §1 ⚠️).
- Кегли типо-шкалы не меняются: схлопывание шкалы (FIX-15) — волна 2.
- **BREAKING** для визуала: смена гарнитуры затрагивает все страницы; после миграции упоминания Literata/Newsreader в `src/` должны исчезнуть.

## Capabilities

### New Capabilities

_нет_

### Modified Capabilities

- `design-system`: контракт voice-семейства (Mulish вместо Literata-дублёра, fallback, без opsz), формулировка атома `RitualNote`, новое требование трекинг-шкалы.

## Impact

- `src/app/fonts.ts` — пути woff2, weight-диапазон, fallback.
- `src/fonts/` — новые `mulish-var*.woff2`, удаление `literata-var*.woff2`.
- `src/app/globals.css` (+ Tailwind-тема) — переменные трекинга, применение к ролям заголовков.
- Компоненты заголовков/eyebrow — классы трекинга и весов.
- Тесты: `globals-tokens.test.ts`, ds-lint-паттерны старых семейств.
- Доки: `DEVELOPMENT.md` (источник типографики — typography.md v3.0 + прототипы), `CONTEXT.md`.
