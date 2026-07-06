# ds-migration

## Why

Vault пережил редизайн (сессии 2026-06-27 → 2026-07-05): source of truth вёрстки теперь HTML-прототипы `../zazemli-vault/Айти/Сайт/prototypes/` + `tokens.json` v1.1.0, а не Figma 185:2 + tokens v1.0.1. Типографика пересобрана фаундером: Unbounded/Spectral/Caveat → Newsreader (voice) + Commissioner (ui), Caveat с веба выведен. Введён токен `--moss-ink #406C4F` (замеренный AA 5.5 для мелкого текста — старая a11y-таблица токенов была неверна). Без миграции DS любая вёрстка новых страниц (лендинг, 7 страниц товара, /guide, /lab) невозможна — это блокирующий слой.

## What Changes

- **BREAKING**: смена шрифтовых семейств — Unbounded/Spectral/Caveat выводятся полностью, вводятся voice-семейство (300–600 + italic; временно Literata — дублёр Newsreader, оставшегося без кириллицы; финал утверждает Настя) и Commissioner (400/500, роль ui), self-hosted woff2 с субсеттингом через `next/font/local`. Все font-переменные переименовываются во всём коде сразу; старые секции главной выглядят «переходно» до change `landing-redesign` (осознанный трейд-офф, контракт «3 шрифта max» сохраняется — семейств теперь 2).
- Токены `globals.css` обновляются под `tokens.json` v1.1.0: добавляются `--moss-ink #406C4F`, `--chalk`, earth-палитра (graphite/soil/ceramsite/pumice/sand/gravel), 7 SKU-цветов; типо-шкала ролей (84/52/34/24/18/15/13/12) и spacing-шкала — CSS-переменными.
- Новая контраст-политика: текст/ссылки/латынь на bone = `moss-ink` или `charcoal`; raw `--moss #4A7C59` — только заливки/фльероны/крупное ≥18pt; SKU-цвета — только декор (точки/бордеры/handscript), никогда 2+ SKU-цветов на одной странице.
- Общие компоненты по прототипам: topbar (Коллекция · Лаборатория · Гайд + бургер <860px), footer (соцсети, email, копирайт-блок с местом под дисклеймер), `<details>`-аккордеон, `MaterialDot`, кнопки `btn`/`btn--solid`.
- ds-lint обновляется: запрет старых font-переменных, запрет raw moss на мелком тексте.

## Capabilities

### New Capabilities

_нет_

### Modified Capabilities

- `design-system`: токены v1.0.1 → v1.1.0 (moss-ink, chalk, SKU-палитра, типо/spacing-шкала ролей); смена трёх шрифтов на два (Newsreader + Commissioner); контраст-политика moss-ink; атомы `<details>`-аккордеон, MaterialDot, btn/btn--solid; обновлённые DS-запреты (italic → Newsreader italic, запрет raw moss на мелком тексте).
- `site-shell`: SiteHeader → topbar по прототипам (меню Коллекция · Лаборатория · Гайд, бургер <860px); SiteFooter → footer по прототипам (соцсети, email, слот дисклеймера). Набор роутов не меняется.

## Impact

- `src/app/globals.css` — токены, шкалы, семантика shadcn-переменных.
- `src/fonts/` — удаление 8 старых woff2, добавление Newsreader/Commissioner (субсеттинг кириллица+латиница).
- `src/app/layout.tsx` — `next/font/local` конфигурация.
- `src/components/site/` — SiteHeader, SiteFooter перевёрстка.
- `src/components/ui/` — новые атомы (details-аккордеон, MaterialDot, кнопки в новых токенах).
- Все компоненты секций — переименование font-переменных (механическое).
- `scripts/ds-lint` — новые правила.
- Тесты: unit-инварианты DS, e2e навигации (бургер), визуальный smoke.
- Блокирует: `landing-redesign`, `product-pages`, `guide-lab`.
