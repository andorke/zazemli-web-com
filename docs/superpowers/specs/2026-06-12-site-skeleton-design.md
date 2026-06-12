# Дизайн: каркас сайта zazemli.com (site-skeleton)

> Итог брейнсторминга 2026-06-12 (superpowers:brainstorming). Одобрен пользователем по секциям.
> Авторитетный план фичи — OpenSpec change `openspec/changes/site-skeleton/` (proposal, design, specs, tasks); этот документ — зафиксированный результат брейнсторминга, не дублирующий источник.

## Контекст

Репозиторий без кода: документы, база знаний фаундера (`docs/zazemli_knowledge_base/`), ассеты (`docs/zazemli_design_arts/`). Дизайн-система специфицирована (tokens.json v1.0.1, color-system, typography), эталон главной — Figma `bCmvvuyo5ssXaGEuUjwbHc` node 185:2 «PHASE 8 v2». Стек канонизирован брифом фаундера: Next.js + React + TS strict + Tailwind + shadcn/ui; анимация только CSS; аналитика только Я.Метрика; 3 шрифта максимум.

## Решения брейнсторминга (вопрос → выбор)

| Вопрос | Выбор пользователя | Альтернативы |
|---|---|---|
| Деплой-модель | **Static export** (`output: 'export'`) | Node SSG на VPS; «решить позже» |
| Контент на MVP | **TS-константы в репо**, без CMS; типы готовят миграцию на Sanity | Sanity сразу |
| Объём захода | **Всё целиком**: DS → каркас 5 роутов → главная по Figma 185:2 | Сначала DS + каркас, главная отдельно |
| Структура компонентов | **По роли**: `ui` / `site` / `sections` (имена компонентов — из БЗ) | Atomic-папки как в БЗ |

## Дизайн (одобрен по секциям)

### 1. Фундамент
git init + первый коммит; Next.js (App Router, `src/`) + TS strict; `output: 'export'`, `images.unoptimized`; Tailwind v4 + shadcn/ui (радиусы 0–2px, цвета bone/charcoal/moss, только нужные примитивы); токены `tokens.json` → CSS-переменные в `globals.css` вручную с ссылкой на источник; шрифты self-hosted `next/font/local` (Unbounded/Spectral/Caveat).

### 2. Каркас, контент, главная
5 роутов; layout = шрифты + SiteHeader + SiteFooter + CookieBanner + Метрика; `/diary-signup` вне навигации + noindex (допущение, вопрос Насте); заглушки 4 страниц без выдуманной копи; главная — 9 секций по Figma 185:2 (Hero, WhatsInBox, DifferentSoil, WhatSoilGives, SkuGallery, Statement, About, Teasers, OzonCta), тексты из Figma-нод; контент в `src/content/*.ts` с типами; `ozonStoreUrl: null` → кнопки «Скоро на Ozon»; consent-gate: Метрика только после согласия; UTM-хелпер `lib/utm.ts`; 404 в DS-стиле.

### 3. Качество
Vitest + RTL (utm, инварианты контента: SKU=7, diary вне навигации) + Playwright smoke (5 роутов, навигация, burger); ESLint + Prettier; без pre-commit hooks. DoD: static export зелёный, тесты зелёные, соответствие 185:2 на 1440px, адаптив до 360px, `prefers-reduced-motion` учтён.

## Известные ограничения и открытые вопросы

- Spectral Light 300 (для «гигантской 7») отсутствует в файлах шрифтов → временно 400, вопрос Насте.
- Ozon-store URL неизвестен → `null` + состояние-заглушка.
- Мобильных макетов в Figma нет → адаптив по DS-правилам.
- Lighthouse-бюджет (brief-CDO v1.2 вне репо) → ориентир perf ≥ 90.

## Что дальше

Реализация — через OpenSpec: `/opsx:apply site-skeleton` (tasks.md, 7 групп / 25 задач, TDD). После реализации: `/opsx:verify` → code review → `/opsx:sync` → `/opsx:archive`, обновление CONTEXT.md / ROADMAP.md.
