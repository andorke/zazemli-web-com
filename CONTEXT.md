# Контекст проекта

> **Пример заполнения:** `example_docs/CONTEXT.md`

## Текущий статус
- **Этап:** Фаза 2 спланирована — редизайн под обновлённый vault (прототипы = новый source of truth). 4 OpenSpec change готовы к реализации.
- **Последнее обновление:** 2026-07-05

## Что сделано
| Дата | Что сделано |
|------|-------------|
| 2026-07-05 | Реализован change `ds-migration` (18 задач, TDD, worktree `ds-migration`): шрифты → роли voice/ui (**Literata** временно вместо Newsreader — у того не оказалось кириллицы ни на GF, ни в upstream; прототипы рендерили русский Georgia-фолбэком), токены v1.1.0 (moss-ink, SKU-палитра, шкалы ролей), атомы (RitualNote, DetailsAccordion, BrandButton, KickerHeader по прототипу), header/footer по `landing.html`, ds-lint с контраст-политикой (`npm run ds-lint`). Unit 81 + e2e 41 + build зелёные; скриншоты 5 роутов ×2 вьюпорта сняты (переходный вид старых секций). Ждёт: verify → review → sync → archive |
| 2026-07-05 | Аудит обновлённого vault: source of truth вёрстки теперь HTML-прототипы `Айти/Сайт/prototypes/` + tokens v1.1.0 (Newsreader/Commissioner, moss-ink), не Figma 185:2. Брейнсторминг → дизайн-спека `docs/superpowers/specs/2026-07-05-site-redesign-design.md`. Созданы 4 OpenSpec change: `ds-migration` → `landing-redesign` → `product-pages` ∥ `guide-lab` (архив: product-pages до guide-lab) |
| 2026-06-13 | Реализован change `site-skeleton` (29 задач, TDD): Next 16 static export, токены→Tailwind, 3 шрифта woff2, 5 роутов, header/footer, cookie-consent + Метрика, главная по Figma 185:2 (9 секций). Unit 52 + e2e 30 зелёные. Lighthouse desktop 99/96/100/100 |
| 2026-06-12 | Создан OpenSpec change `site-skeleton` (proposal/design/4 specs/tasks) через /opsx:propose |
| 2026-06-12 | Брейнсторминг каркаса завершён: дизайн одобрен по секциям; решения зафиксированы в DEVELOPMENT/ARCHITECTURE |
| 2026-06-12 | Собран контекст из БЗ и брифов (HANDOFF Ивану, site-brief, tokens.json, Figma 185:2). Начат брейнсторминг каркаса |
| 2026-06-12 | Проект scaffolded через /setup-project |

> Новые записи добавляются **сверху**. Не переписывай историю — это журнал, а не спека.

## Текущая задача
`ds-migration` реализован (все 18 задач) — дальше по циклу: `/opsx:verify ds-migration` → code review → `/opsx:sync` → `/opsx:archive`. Затем `landing-redesign` → `product-pages` и `guide-lab` (архивировать product-pages раньше guide-lab — оба меняют «Заглушки» site-shell).

## Ключевые архитектурные решения
| Решение | Выбор | Обоснование |
|---------|-------|-------------|
| Фронтенд-стек | Next.js (App Router) + React + TypeScript strict + Tailwind CSS + shadcn/ui | Канон проекта, зафиксирован фаундером в HANDOFF-брифе §4 и site-brief §4.3 |
| Анимация | Только CSS + ванильный JS (IntersectionObserver), без Framer Motion/GSAP/Lenis | Концепт A+ из брифа; `prefers-reduced-motion` обязателен |
| Аналитика | Только Яндекс.Метрика (7 точек событий) | Бриф §8; GA и прочие — запрещены на MVP |
| Шрифты | Self-hosted `next/font/local`, роли: voice (Literata — временный дублёр Newsreader) + ui (Commissioner), ровно 2 семейства, variable woff2 | typography.md v2.0 (tokens v1.1.0); Literata — решение 2026-07-05: у Newsreader нет кириллицы (вопрос Насте) |
| Источник истины дизайна | HTML-прототипы `../zazemli-vault/Айти/Сайт/prototypes/` + `tokens.json` v1.1.0; копи — канон-`.md` vault | BUILD-SPEC (2026-07-05); ранее Figma 185:2 + v1.0.1 — устарело |
| Деплой-модель | Static export (`output: 'export'`), без API routes | Решение 2026-06-12: стабильность и свобода хостинга в РФ-контексте |
| Контент на MVP | TS-константы в `src/content/`, без CMS | Решение 2026-06-12: Sanity — post-MVP, типы контента готовят миграцию |
| Структура компонентов | По роли: `ui` / `site` / `sections` (не atomic-папки) | Решение 2026-06-12: имена компонентов из БЗ сохраняются |

## Риски
| Риск | Вероятность | Влияние | Митигация |
|------|-------------|---------|-----------|
| Контент 4 страниц (`/collectio` `/lab` `/guide` `/diary-signup`) придёт от Насти позже | Высокая | Среднее | Заглушки-страницы; каркас не блокируется контентом |
| Иллюстрации/фото главной в процессе (Midjourney) | Высокая | Низкое | Слоты-плейсхолдеры с фиксированными соотношениями сторон (без CLS) |
| Хостинг/домен не выбраны; Vercel не рекомендован (риск деградации из РФ) | Средняя | Среднее | Проектировать SSG-friendly, решение по хостингу — отдельно |
| Копи главной: PHASE8-файла нет в репо, актуальные тексты — в Figma 185:2 | — | Низкое | Брать тексты из Figma-нод 185:2 как истину |

## Следующие шаги
- [x] git init + первый коммит документов
- [x] Реализовать каркас (`/opsx:apply site-skeleton`), заархивировать
- [x] Реализовать `ds-migration` (`/opsx:apply`)
- [ ] `/opsx:verify ds-migration` → code review → `/opsx:sync` → `/opsx:archive`
- [ ] `landing-redesign`, затем `product-pages` ∥ `guide-lab`
- [ ] Передать Насте открытые вопросы (см. ниже)

## Открытые вопросы Насте
- **Voice-шрифт: у Newsreader нет кириллицы** (проверено 2026-07-05: ни на Google Fonts, ни в upstream Production Type v1.003; запись «кириллица полная» в typography.md v2.0 ошибочна — в прототипах русский текст фактически рендерит Georgia-фолбэк). Временный дублёр на сайте — **Literata** (ближайший editorial-serif: opsz 7–72, родная кириллица, variable italic). Утвердить Literata или выбрать другое семейство; замена дешёвая (woff2 + 1 строка конфигурации).
- **Глиф ❦ (fleuron)** отсутствует и в Literata, и в Commissioner (и в Newsreader) — рендерится системным serif, как и в прототипах. Ок или заменить на SVG-глиф?
- **Дисклеймер «Растения — не лекарство…»**: из футера убран (по прототипу), остаётся на `/lab` (change guide-lab). Показывать на всём сайте или только на `/lab`?
- **Реквизиты ИП** для legal-строки футера (ОГРНИП) — плейсхолдер `ИП Минетто`.
- **Ozon-store URL** — пока `ozonStoreUrl: null` → кнопки «Скоро на Ozon».
- **noindex на `/diary-signup`** — наше допущение (вход только по QR), подтвердить.
- **Тэглайны и размеры горшков в галерее SKU** — транскрибированы с PNG-рендера Figma, сверить с канон-`.md` при `landing-redesign` (копи теперь живёт в vault).
