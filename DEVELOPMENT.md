# Правила разработки

> Прочитай перед началом работы.

> **Пример заполнения:** `example_docs/DEVELOPMENT.md`

## Технологический стек
| Слой | Выбор | Примечание |
|------|-------|------------|
| Фреймворк | Next.js 16 (App Router, `src/`-layout, Turbopack) | `output: 'export'` — чистая статика; `images.unoptimized: true`; `turbopack.root` задан (в `~/` есть посторонний package-lock) |
| Язык | TypeScript 5, `strict: true` | |
| UI | React 19 + Tailwind CSS v4 + shadcn/ui (preset nova, base radix) | shadcn-компоненты копируются в репо (`components/ui`), не плагином |
| Шрифты | `next/font/local`, роли: `--font-voice` (сейчас Literata — временный дублёр Newsreader, у которого нет кириллицы; финал утверждает Настя) + `--font-ui` (Commissioner) | variable woff2 (оси opsz/wght живы), субсет Cyrillic+Latin+пунктуация через fonttools (instancer + pyftsubset); ровно 2 семейства (typography.md v2.0) |
| Формы | react-hook-form + zod | только на `/diary-signup` (Фаза 2) |
| Аналитика | Яндекс.Метрика | грузится после согласия (consent-gate, `useConsent`); ID в `NEXT_PUBLIC_METRIKA_ID`; без ID не подключается |
| Тесты | Vitest + RTL (unit, `globals: true`), Playwright (e2e: desktop 1440 + mobile 360) | |
| CMS | нет на MVP — контент в `src/content/*.ts` | миграция на Sanity — post-MVP, типы контента проектировать совместимо |
| Анимация | только CSS + IntersectionObserver | без Framer Motion/GSAP/Lenis; `prefers-reduced-motion` обязателен; на MVP анимации нет |

Точные версии — в `package.json`. Правило — последние стабильные мажоры, без canary/beta.

### Готчи окружения
- **Tailwind-скан**: `@import "tailwindcss" source("../")` в `globals.css` ограничивает скан классов каталогом `src/` — иначе Turbopack падает на tailwind-подобных строках в `docs/` (архивы БЗ).
- **Прокси**: в окружении выставлен `HTTP_PROXY=127.0.0.1:8888`, через который `npm install` падает с ECONNRESET. Ставить зависимости с временным сбросом прокси: `HTTP_PROXY= HTTPS_PROXY= npm install`.
- **Шрифты**: собираются из variable TTF репозитория `google/fonts` (raw.githubusercontent.com): `fonttools varLib.instancer` (ограничение wght-диапазона) → `pyftsubset --flavor=woff2 --layout-features='*'` (субсет Cyrillic+Latin+пунктуация, оси сохраняются). Внимание: у Newsreader кириллицы нет вовсе — поэтому voice временно Literata (см. стек).

## Структура репозитория
```
.
├─ AGENTS.md / CONTEXT.md / ...   # документы проекта (см. AGENTS.md «Порядок чтения»)
├─ docs/
│  └─ zazemli_design_arts/        # ассеты фаундера: бриф HANDOFF, шрифты, дудлы, QR
├─ openspec/                      # OpenSpec: specs и changes
├─ example_docs/                  # примеры заполнения документов (не копировать контент)
├─ my_tasks/                      # входящие задачи от пользователя
└─ src/                           # код сайта (появляется в Фазе 1)
   ├─ app/                        # роуты: / collectio lab guide diary-signup + not-found
   ├─ components/
   │  ├─ ui/                      # shadcn-примитивы + бренд-атомы (Fleuron, RitualNote, MaterialDot, DetailsAccordion, BrandButton…)
   │  ├─ site/                    # обвязка: SiteHeader, SiteFooter, CookieBanner, Metrika
   │  └─ sections/<page>/         # секции страниц, по папке на страницу (home/Hero…)
   ├─ content/                    # контент TS-константами: sku.ts, home.ts, site.ts
   ├─ lib/                        # утилиты: utm.ts, metrika.ts
   ├─ fonts/                      # woff2 для next/font/local
   └─ styles/                     # globals.css: токены из tokens.json → CSS-переменные
```

> **База знаний** вынесена во внешний Obsidian-vault `../zazemli-vault/` (репо `VesnaPenguin/zazemli-vault`, только чтение). Точка входа — `НАВИГАЦИЯ.md`, синхронизация — `scripts/sync-vault.sh`.

## Локальный запуск
```bash
npm install
npm run dev        # дев-сервер на :3000
npm run build      # static export → out/
npm run test       # vitest unit
npm run test:e2e   # playwright smoke (требует build или dev)
npm run ds-lint    # DS-инварианты: запреты, шрифты, токены
npm run lint       # eslint
```
Переменные окружения: `NEXT_PUBLIC_METRIKA_ID` (опциональна; без неё Метрика не подключается — так и должно быть в дев-режиме).

## Паттерны кода
- **RSC по умолчанию.** `'use client'` — только там, где есть интерактив: CookieBanner, мобильный burger, форма подписки.
- **Контент отделён от презентации.** Тексты и данные — в `src/content/*.ts` с явными TS-типами; компоненты принимают контент пропсами или импортируют из `content/`. Хардкод текстов внутри JSX-секций не допускается — это готовит миграцию на Sanity.
- **Токены — только через CSS-переменные** из `globals.css` (источник: `../zazemli-vault/Айти/Сайт/tokens.json` v1.1.0). Хардкод hex в компонентах запрещён. Правило 60/30/10; SKU-цвета — только декор (точки/бордеры/рукописные акценты), никогда 2+ SKU-цветов на странице.
- **Контраст-политика moss-ink**: текст/ссылки/латынь на bone — `text-moss-ink` (#406C4F, AA 5.5) или charcoal; raw `text-moss` (4.43) — только ≥18pt с инлайн-меткой `ds-allow: moss-large` и причиной. Защищается `npm run ds-lint`.
- **Имена компонентов — из БЗ** (SiteHeader, ProductCardMini, Fleuron, MaterialDot, KickerHeader…). Соответствие уровням БЗ: атомы → `components/ui`, молекулы/организмы → `components/site` или `sections/`.
- **Запреты DS**: `box-shadow` нет (`shadow: null`), радиусы только 0/2px/pill, earth-палитра только в MaterialDot, ритуальные приписки (RitualNote) ≤2 на страницу, italic — только voice-роль.
- **Внешние ссылки на Ozon** — только через `lib/utm.ts` (`utm_source=site`, per-SKU `utm_content=sku00X`). `ozonStoreUrl: null` → кнопка в состоянии «Скоро на Ozon».

## Стратегия тестирования
- **Unit (Vitest + RTL)**: утилиты (`utm.ts`) и инварианты контента — «SKU ровно 7», «`/diary-signup` отсутствует в меню и футере», «дисклеймер присутствует в футере». Файлы `*.test.ts(x)` рядом с кодом.
- **E2E smoke (Playwright, `e2e/`)**: все 5 роутов рендерятся с правильными `<h1>`/`<title>`, навигация шапки работает, burger открывается, кнопка Ozon в состоянии-заглушке.
- TDD на каждой задаче `/opsx:apply` (см. AGENTS.md): RED → GREEN → REFACTOR.

## Стиль и тулинг
- ESLint (конфиг next/core-web-vitals + typescript) + Prettier + prettier-plugin-tailwindcss.
- Pre-commit hooks не используем (решение Фазы 0 — не усложнять).
- Конвенция коммитов и PR — в `AGENTS.md` («Стиль коммитов и pull request»).
