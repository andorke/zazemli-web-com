# Контекст проекта

> **Пример заполнения:** `example_docs/CONTEXT.md`

## Текущий статус
- **Этап:** Фаза 2 спланирована — редизайн под обновлённый vault (прототипы = новый source of truth). 4 OpenSpec change готовы к реализации.
- **Последнее обновление:** 2026-07-05

## Что сделано
| Дата | Что сделано |
|------|-------------|
| 2026-07-12 | `guide-lab` /lab доделан вручную в ветке `night/guide-lab` поверх ночных 6 эпизодов (контент `guide.ts`/`lab.ts` + /guide уже были готовы): секции hero → проблема → 7 рецептур (карточки-`<details>` с полоской долей g4, MaterialDot) → 11 компонентов (фото-грид + доступная модалка: focus-trap, Esc, возврат фокуса, scroll-lock) → источники → Ozon (inverted pyramid). Deep-link `/lab#rec-{slug}` раскрывает и подсвечивает рецептуру. Дисклеймер — новый route-aware слот `FooterDisclaimer` в общем `SiteFooter` (по `usePathname`, включается только на `/lab`: root layout рендерит футер сиблингом `{children}`, пропс с уровня страницы не докинуть без контекста поверх всего дерева). Задачи 3.1–3.5 и 4.2 закрыты; unit 200 + e2e 68 + build/typecheck/lint/ds-lint зелёные. 4.1 (пиксельная сверка) и 4.3 (аудит 6 линз по всем 10 страницам) — за владельцем, финальный шаг всей серии changes |
| 2026-07-12 | Ночной прогон night-shift (5 changes от origin/main): `privacy-page` ready_for_owner (7 коммитов), `diary-signup-form` done (18), `product-pages` needs_review (11, вёрстка на старой DS), `guide-lab` skipped; `ds-migration` эскалировал — Newsreader без кириллицы (решение уже было в worktree: Literata). Ветка `worktree-ds-migration` смержена в main; конфликты с ночным `landing-redesign` разрешены: структура секций из main + классы voice/ui, soil-vial = ветка + ночные `export GROUPS`/`labels` |
| 2026-07-06 | Реализован change `landing-redesign` (11 задач, TDD): главная пересобрана под прототип `landing.html` + канон `home.md` v2.1 — 11 блоков, новые секции manifesto / how-it-works / photo-band, галерея 7 кликабельных карточек «N° 01» + приглашение «N° 08 — ?», мост «почему именно так →» на /lab (добавлен токен `--moss-ink`), Statement удалён. Реализовано **до** `ds-migration` (решение пользователя): вёрстка на текущих токенах/шрифтах, DS-миграция перекрасит глобально. Unit 106 + e2e 36 зелёные, static export ок. Расхождения канон↔прототип — в «Вопросы Насте» |
| 2026-07-06 | `ds-migration` **заархивирован** (`archive/2026-07-06-ds-migration`): delta-спеки синкнуты в main-спеки (design-system: 2 семейства по ролям + контраст-политика moss-ink + токены v1.1.0; site-shell: header/footer по прототипу), `openspec validate` 4/4. Ветка `worktree-ds-migration` (9 коммитов) готова к мержу в main |
| 2026-07-06 | `ds-migration`: verify + code review закрыты. Verify нашёл и починил сломанные refs SoilVial (`var(--soil)` → `--color-*`, ds-lint-правило от рецидива), удалил осиротевшие `public/qr`. Review (субагент): 1 Critical — якоря `#collectio` не существовало, все три меню-ссылки били в пустоту (закрыт: id+scroll-mt+e2e на viewport); preload шрифтов закрыт замером LH (mobile: с preload FCP 1.4s/LCP 8.8s, без — 3.6s/9.2s → preload оставлен; узкое место LCP — soil-vial.png 266КБ + JS, уходит в landing-redesign; desktop 0.93/1.8s); minors: скан ds-lint расширен на весь `src/`, `var(--moss-ink)` ловится, вес заглушек 600, watermark-opacity, hover BrandButton по прототипу. Итог: unit 83 + e2e 42 + ds-lint 25 + build зелёные |
| 2026-07-05 | Реализован change `ds-migration` (18 задач, TDD, worktree `ds-migration`): шрифты → роли voice/ui (**Literata** временно вместо Newsreader — у того не оказалось кириллицы ни на GF, ни в upstream; прототипы рендерили русский Georgia-фолбэком), токены v1.1.0 (moss-ink, SKU-палитра, шкалы ролей), атомы (RitualNote, DetailsAccordion, BrandButton, KickerHeader по прототипу), header/footer по `landing.html`, ds-lint с контраст-политикой (`npm run ds-lint`). Unit 81 + e2e 41 + build зелёные; скриншоты 5 роутов ×2 вьюпорта сняты (переходный вид старых секций). Ждёт: verify → review → sync → archive |
| 2026-07-05 | Аудит обновлённого vault: source of truth вёрстки теперь HTML-прототипы `Айти/Сайт/prototypes/` + tokens v1.1.0 (Newsreader/Commissioner, moss-ink), не Figma 185:2. Брейнсторминг → дизайн-спека `docs/superpowers/specs/2026-07-05-site-redesign-design.md`. Созданы 4 OpenSpec change: `ds-migration` → `landing-redesign` → `product-pages` ∥ `guide-lab` (архив: product-pages до guide-lab) |
| 2026-06-13 | Реализован change `site-skeleton` (29 задач, TDD): Next 16 static export, токены→Tailwind, 3 шрифта woff2, 5 роутов, header/footer, cookie-consent + Метрика, главная по Figma 185:2 (9 секций). Unit 52 + e2e 30 зелёные. Lighthouse desktop 99/96/100/100 |
| 2026-06-12 | Создан OpenSpec change `site-skeleton` (proposal/design/4 specs/tasks) через /opsx:propose |
| 2026-06-12 | Брейнсторминг каркаса завершён: дизайн одобрен по секциям; решения зафиксированы в DEVELOPMENT/ARCHITECTURE |
| 2026-06-12 | Собран контекст из БЗ и брифов (HANDOFF Ивану, site-brief, tokens.json, Figma 185:2). Начат брейнсторминг каркаса |
| 2026-06-12 | Проект scaffolded через /setup-project |

> Новые записи добавляются **сверху**. Не переписывай историю — это журнал, а не спека.

## Текущая задача
`ds-migration` закрыт полностью и смержен в main; `landing-redesign` реализован (11/11, ночь). Дальше: разбор ночных веток — review/merge `night/privacy-page` → `night/diary-signup-form`, решение по `night/product-pages` (11 коммитов на старой DS: пересобрать от новой базы или мигрировать), перезапуск `guide-lab` от нового main. Затем verify → sync → archive по каждому.

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
- [x] Создать OpenSpec change на каркас (`/opsx:propose`)
- [x] Реализовать каркас (`/opsx:apply site-skeleton`), заархивировать
- [x] Реализовать `ds-migration` (apply → verify → review → sync → archive), смержить в main
- [x] Реализовать главную по прототипу (`/opsx:apply landing-redesign`)
- [ ] `/opsx:verify landing-redesign` → code review → `/opsx:sync` → `/opsx:archive`
- [ ] Разобрать ночные ветки: `night/privacy-page`, `night/diary-signup-form`, `night/product-pages` (review → merge)
- [ ] `guide-lab` — прогон от нового main (ночной перезапуск или днём)
- [ ] Передать Насте открытые вопросы (см. ниже)

## Открытые вопросы Насте
- **Voice-шрифт: у Newsreader нет кириллицы** (проверено 2026-07-05: ни на Google Fonts, ни в upstream Production Type v1.003; запись «кириллица полная» в typography.md v2.0 ошибочна — в прототипах русский текст фактически рендерит Georgia-фолбэк). Временный дублёр на сайте — **Literata** (ближайший editorial-serif: opsz 7–72, родная кириллица, variable italic). Утвердить Literata или выбрать другое семейство; замена дешёвая (woff2 + 1 строка конфигурации).
- **Глиф ❦ (fleuron)** отсутствует и в Literata, и в Commissioner (и в Newsreader) — рендерится системным serif, как и в прототипах. Ок или заменить на SVG-глиф?
- **Дисклеймер «Растения — не лекарство…»**: реализован как route-aware слот в футере, по умолчанию — только на `/lab` (дефолт брейнсторминга). Показывать на всём сайте или только на `/lab` — подтвердить дефолт.
- **[guide-lab] Цвет 11 плиток компонентов на `/lab`** — реализован через существующую 4-функциональную earth-палитру (та же, что красит колбу на главной: основа=soil, воздух=pumice, влага=moss, дренаж=ceramsite), не через 11 отдельных оттенков (в ранней версии прототипа они были, в пересобранной — убраны без замены). Ок как есть, или нужны отдельные цвета на компонент?
- **Реквизиты ИП** для legal-строки футера (ОГРНИП) — плейсхолдер `ИП Минетто`.
- **[landing-redesign] Порядок блоков «колбы ↔ что в боксе»** — прототип `landing.html`: галерея → колбы → бокс; канон `home.md` v2.1: галерея → бокс → колбы. Собрано по прототипу — подтвердить.
- **[landing-redesign] Нумерация SKU** — лендинг «N° 01» (прототип) vs страницы товара «N°001». Нужен единый формат?
- **[landing-redesign] Опись бокса** — канон: 5 позиций (конвертик «Забота о корнях и твоих руках»: перчатки, корневин, 2 апельсиновые палочки); прототип: 6 позиций («Корневин, 5 г», «Нитриловые перчатки», без палочек). Взят канон дословно — что верно?
- **[landing-redesign] Канон «о нас» нарушает блэклист** — «двадцати пяти **уникальных** растений» («уникальный» в блэклисте BUILD-SPEC). Взята прототип-редакция (без «уникальных», сокращения «в экране», «о растениях»). Обновить канон?
- **[landing-redesign] Мелкие текстовые расхождения канон ↔ прототип** — CTA галереи «Открыть коллекцию →» vs «Вся коллекция →» (взят прототип); «три размера» (канон, Ozon) vs «три объёма» (прототип, hero-прайс) — сейчас на странице оба варианта; «структура не слёживается» в «Что даёт» есть только в прототипе (не взято).
- **[landing-redesign] Карточка «N° 08 — ?»** — в прототипе форма «подскажи растение»; на static export канала приёма нет — реализована без формы, текстом. Нужен канал (email/TG) или оставить?
- **[landing-redesign] Блоки вне канона** — «Как это работает» и атмосферный баннер отсутствуют в `home.md` (тексты взяты из прототипа) — добавить в канон.
- **Ozon-store URL** — пока `ozonStoreUrl: null` → кнопки «Скоро на Ozon».
- **noindex на `/diary-signup`** — наше допущение (вход только по QR), подтвердить.
- **Тэглайны и размеры горшков в галерее SKU** — транскрибированы с PNG-рендера Figma, сверить с канон-`.md` при `landing-redesign` (копи теперь живёт в vault).
- **Два расхождения внутри vault-канона** (найдены на code review, реализация следует tokens.json): `fleuron.font: "Spectral"` в tokens.json v1.1.0 противоречит выводу Spectral (на сайте фльерон — voice-роль); `--chalk` в прототипе `#ECE9E3`, в tokens.json — `#EDEBE6`. Поправить vault при следующей ревизии токенов.
