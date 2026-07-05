# Контекст проекта

> **Пример заполнения:** `example_docs/CONTEXT.md`

## Текущий статус
- **Этап:** Фаза 2 спланирована — редизайн под обновлённый vault (прототипы = новый source of truth). 4 OpenSpec change готовы к реализации.
- **Последнее обновление:** 2026-07-05

## Что сделано
| Дата | Что сделано |
|------|-------------|
| 2026-07-05 | Аудит обновлённого vault: source of truth вёрстки теперь HTML-прототипы `Айти/Сайт/prototypes/` + tokens v1.1.0 (Newsreader/Commissioner, moss-ink), не Figma 185:2. Брейнсторминг → дизайн-спека `docs/superpowers/specs/2026-07-05-site-redesign-design.md`. Созданы 4 OpenSpec change: `ds-migration` → `landing-redesign` → `product-pages` ∥ `guide-lab` (архив: product-pages до guide-lab) |
| 2026-06-13 | Реализован change `site-skeleton` (29 задач, TDD): Next 16 static export, токены→Tailwind, 3 шрифта woff2, 5 роутов, header/footer, cookie-consent + Метрика, главная по Figma 185:2 (9 секций). Unit 52 + e2e 30 зелёные. Lighthouse desktop 99/96/100/100 |
| 2026-06-12 | Создан OpenSpec change `site-skeleton` (proposal/design/4 specs/tasks) через /opsx:propose |
| 2026-06-12 | Брейнсторминг каркаса завершён: дизайн одобрен по секциям; решения зафиксированы в DEVELOPMENT/ARCHITECTURE |
| 2026-06-12 | Собран контекст из БЗ и брифов (HANDOFF Ивану, site-brief, tokens.json, Figma 185:2). Начат брейнсторминг каркаса |
| 2026-06-12 | Проект scaffolded через /setup-project |

> Новые записи добавляются **сверху**. Не переписывай историю — это журнал, а не спека.

## Текущая задача
Реализация редизайна: `/opsx:apply ds-migration` (блокирует остальные) → `landing-redesign` → `product-pages` и `guide-lab` (архивировать product-pages раньше guide-lab — оба меняют «Заглушки» site-shell). Каждый change: apply → verify → sync → archive.

## Ключевые архитектурные решения
| Решение | Выбор | Обоснование |
|---------|-------|-------------|
| Фронтенд-стек | Next.js (App Router) + React + TypeScript strict + Tailwind CSS + shadcn/ui | Канон проекта, зафиксирован фаундером в HANDOFF-брифе §4 и site-brief §4.3 |
| Анимация | Только CSS + ванильный JS (IntersectionObserver), без Framer Motion/GSAP/Lenis | Концепт A+ из брифа; `prefers-reduced-motion` обязателен |
| Аналитика | Только Яндекс.Метрика (7 точек событий) | Бриф §8; GA и прочие — запрещены на MVP |
| Шрифты | Self-hosted через `next/font/local`: Unbounded, Spectral, Caveat — максимум 3 | DS-контракт «3 шрифта max» (решение 27 мая); файлы в `docs/zazemli_design_arts/fonts/` |
| Источник истины дизайна | Figma `bCmvvuyo5ssXaGEuUjwbHc`, главная — node 185:2 (PHASE 8 v2) + `tokens.json` v1.0.1 | Бриф §5; node 185:2 подтверждён фаундером как готовый к сборке |
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
- [x] Создать OpenSpec change на каркас (`/opsx:propose`)
- [x] Реализовать каркас (`/opsx:apply site-skeleton`)
- [ ] `/opsx:verify site-skeleton` → code review → `/opsx:sync` → `/opsx:archive`
- [ ] Передать Насте открытые вопросы (см. ниже)

## Открытые вопросы Насте
- **Ozon-store URL** — пока `ozonStoreUrl: null` → кнопки «Скоро на Ozon».
- **Файлы шрифтов**: woff2 в ассетах битые (по 39 байт) — взяты ttf и пересобраны в woff2 субсеттингом. Нет весов Unbounded 500 (Medium) и Spectral 300 (Light, hero) / 700 (Bold) — временно заменены ближайшими. Нужны оригиналы.
- **noindex на `/diary-signup`** — наше допущение (вход только по QR), подтвердить.
- **Тэглайны и размеры горшков в галерее SKU** — транскрибированы с PNG-рендера Figma (data API в rate limit), сверить с текстовыми нодами после сброса. Заголовок галереи «Семь растений — семь рецептов земли» — добавлен.
- **Контраст мелких меток** (номера 01–05, кикеры) — по Figma 0.45 непрозрачности, ниже WCAG AA. Бренд-DS vs a11y — решение CDO.
- **Реквизиты ИП** для футера (ОГРНИП) — плейсхолдер `ИП Минетто`.
