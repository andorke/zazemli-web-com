# Правила разработки

> Прочитай перед началом работы.

> **Пример заполнения:** `example_docs/DEVELOPMENT.md`

## Технологический стек
| Слой | Выбор | Примечание |
|------|-------|------------|
| Фреймворк | Next.js (App Router, `src/`-layout), актуальный стабильный | `output: 'export'` — чистая статика; `images.unoptimized: true` |
| Язык | TypeScript, `strict: true` | |
| UI | React + Tailwind CSS v4 + shadcn/ui | shadcn-компоненты копируются в репо (`components/ui`), не плагином |
| Шрифты | `next/font/local`: Unbounded, Spectral, Caveat | woff2 в репо; DS-контракт «3 семейства max», 4-й шрифт не вводить |
| Формы | react-hook-form + zod | только на `/diary-signup` |
| Аналитика | Яндекс.Метрика | грузится после согласия в cookie-баннере (consent-gate); ID в `NEXT_PUBLIC_METRIKA_ID` |
| Тесты | Vitest + React Testing Library (unit), Playwright (e2e smoke) | |
| CMS | нет на MVP — контент в `src/content/*.ts` | миграция на Sanity — post-MVP, типы контента проектировать совместимо |
| Анимация | только CSS + IntersectionObserver | без Framer Motion/GSAP/Lenis; `prefers-reduced-motion` обязателен; на MVP анимации нет |

Точные версии фиксируются в `package.json` при установке; правило — последние стабильные мажоры, без canary/beta.

## Структура репозитория
```
.
├─ AGENTS.md / CONTEXT.md / ...   # документы проекта (см. AGENTS.md «Порядок чтения»)
├─ docs/
│  ├─ zazemli_design_arts/        # ассеты фаундера: бриф HANDOFF, шрифты, дудлы, QR
│  └─ zazemli_knowledge_base/     # база знаний (точка входа НАВИГАЦИЯ.md) — только чтение
├─ openspec/                      # OpenSpec: specs и changes
├─ example_docs/                  # примеры заполнения документов (не копировать контент)
├─ my_tasks/                      # входящие задачи от пользователя
└─ src/                           # код сайта (появляется в Фазе 1)
   ├─ app/                        # роуты: / collectio lab guide diary-signup + not-found
   ├─ components/
   │  ├─ ui/                      # shadcn-примитивы + бренд-атомы (Fleuron, CaveatNote, MaterialDot…)
   │  ├─ site/                    # обвязка: SiteHeader, SiteFooter, CookieBanner, Metrika
   │  └─ sections/<page>/         # секции страниц, по папке на страницу (home/Hero…)
   ├─ content/                    # контент TS-константами: sku.ts, home.ts, site.ts
   ├─ lib/                        # утилиты: utm.ts, metrika.ts
   ├─ fonts/                      # woff2 для next/font/local
   └─ styles/                     # globals.css: токены из tokens.json → CSS-переменные
```

## Локальный запуск
```bash
npm install
npm run dev        # дев-сервер на :3000
npm run build      # static export → out/
npm run test       # vitest unit
npm run test:e2e   # playwright smoke (требует build или dev)
npm run lint       # eslint
```
Переменные окружения: `NEXT_PUBLIC_METRIKA_ID` (опциональна; без неё Метрика не подключается — так и должно быть в дев-режиме).

## Паттерны кода
- **RSC по умолчанию.** `'use client'` — только там, где есть интерактив: CookieBanner, мобильный burger, форма подписки.
- **Контент отделён от презентации.** Тексты и данные — в `src/content/*.ts` с явными TS-типами; компоненты принимают контент пропсами или импортируют из `content/`. Хардкод текстов внутри JSX-секций не допускается — это готовит миграцию на Sanity.
- **Токены — только через CSS-переменные** из `globals.css` (источник: `docs/.../Айдентика/tokens.json` v1.0.1). Хардкод hex в компонентах запрещён. Правило 60/30/10; SKU-цвета на MVP-страницах не используются.
- **Имена компонентов — из БЗ** (SiteHeader, ProductCardMini, Fleuron, MaterialDot, KickerHeader…). Соответствие уровням БЗ: атомы → `components/ui`, молекулы/организмы → `components/site` или `sections/`.
- **Запреты DS**: `box-shadow` нет (`shadow: null`), радиусы только 0/2px/pill, earth-палитра только в MaterialDot, Caveat ≤2 на страницу, italic — только Spectral.
- **Внешние ссылки на Ozon** — только через `lib/utm.ts` (`utm_source=site`, per-SKU `utm_content=sku00X`). `ozonStoreUrl: null` → кнопка в состоянии «Скоро на Ozon».

## Стратегия тестирования
- **Unit (Vitest + RTL)**: утилиты (`utm.ts`) и инварианты контента — «SKU ровно 7», «`/diary-signup` отсутствует в меню и футере», «дисклеймер присутствует в футере». Файлы `*.test.ts(x)` рядом с кодом.
- **E2E smoke (Playwright, `e2e/`)**: все 5 роутов рендерятся с правильными `<h1>`/`<title>`, навигация шапки работает, burger открывается, кнопка Ozon в состоянии-заглушке.
- TDD на каждой задаче `/opsx:apply` (см. AGENTS.md): RED → GREEN → REFACTOR.

## Стиль и тулинг
- ESLint (конфиг next/core-web-vitals + typescript) + Prettier + prettier-plugin-tailwindcss.
- Pre-commit hooks не используем (решение Фазы 0 — не усложнять).
- Конвенция коммитов и PR — в `AGENTS.md` («Стиль коммитов и pull request»).
