# Proposal: site-skeleton

## Why

Сайта zazemli.com ещё не существует — есть только утверждённая дизайн-система в спеках БЗ, Figma-макет главной (node 185:2, готов к сборке) и бриф фаундера на вывод в продакшен. Каркас — фундамент, который разблокирует параллельную работу: Настя досылает контент 4 страниц, мы собираем их в готовые слоты.

## What Changes

- Разворачивается Next.js-проект (App Router, TypeScript strict, Tailwind v4 + shadcn/ui, static export) в `src/` репозитория.
- Дизайн-токены `tokens.json` v1.0.1 транслируются в CSS-переменные + Tailwind-тему; подключаются 3 self-hosted шрифта (Unbounded, Spectral, Caveat); создаются бренд-атомы DS.
- Появляется каркас: 5 роутов (`/`, `/collectio`, `/lab`, `/guide`, `/diary-signup`), SiteHeader + SiteFooter, страница 404, SEO-минимум (title/description/canonical/sitemap/robots). Страницы кроме главной — заглушки без выдуманной копи.
- Собирается главная по Figma 185:2: 9 секций, тексты из Figma-нод, слоты под иллюстрации с фиксированными пропорциями (без CLS).
- Подключается cookie-баннер с consent-gate: Яндекс.Метрика грузится только после согласия; Ozon-ссылки получают UTM-разметку через единый хелпер.

## Capabilities

### New Capabilities
- `design-system`: дизайн-токены как CSS-переменные/Tailwind-тема, 3 шрифтовых семейства, бренд-атомы (Fleuron, CaveatNote, MaterialDot, KickerHeader и др.), запреты DS (без теней, радиусы 0/2px, 60/30/10)
- `site-shell`: роутинг 5 страниц, SiteHeader (меню Коллекция/Лаборатория/Гайд + кнопка Ozon), SiteFooter (юр-инфо, дисклеймер, контакты, QR, wordmark), заглушки, 404, SEO-минимум, правило «diary-signup вне навигации + noindex», UTM-контракт Ozon-ссылок
- `homepage`: главная страница по эталону Figma 185:2 — 9 секций с текстами из Figma, изображения-слоты без CLS, адаптив до 360px
- `analytics-consent`: cookie-баннер (по умолчанию необязательные отклоняются), загрузка Я.Метрики только после согласия, каркас целей для 7 точек воронки

### Modified Capabilities
<!-- Существующих specs нет — проект новый. -->

## Impact

- **Код**: новый `src/` (app, components, content, lib, fonts, styles), `package.json`/конфиги в корне репо.
- **Зависимости**: next, react, tailwindcss v4, shadcn/ui-примитивы, vitest + testing-library, playwright, eslint/prettier.
- **Ассеты**: woff2 из `docs/zazemli_design_arts/fonts/` и SVG-дудлы копируются в проект.
- **Документы**: DEVELOPMENT.md/ARCHITECTURE.md уже зафиксировали решения; после реализации обновляется CONTEXT.md и ROADMAP.md (Фаза 1).
- **Вне зоны**: контент 4 страниц, форма подписки, email-провайдер, хостинг/деплой, иллюстрации.
