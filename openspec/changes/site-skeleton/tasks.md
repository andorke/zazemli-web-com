# Tasks: site-skeleton

## 1. Scaffold проекта

- [x] 1.1 `create-next-app` (TS strict, App Router, `src/`, Tailwind) в корне репо; `next.config`: `output: 'export'`, `images.unoptimized: true`
- [x] 1.2 Инициализировать shadcn/ui (style: new-york, baseColor по теме); добавить примитивы button, sheet
- [x] 1.3 Настроить Vitest + React Testing Library и Playwright (конфиги, npm-скрипты `test`, `test:e2e`); smoke-тест «дев-сервер отдаёт /»
- [x] 1.4 ESLint + Prettier + prettier-plugin-tailwindcss; `npm run lint` зелёный

## 2. Дизайн-система

- [ ] 2.1 Транслировать `tokens.json` v1.0.1 в `src/styles/globals.css` (`:root`-переменные + `@theme` Tailwind v4): цвета brand/earth/sku, шкала шрифтов, спейсинг, opacity, радиусы 0/2/pill, брейкпоинты; коммент-ссылка на источник
- [ ] 2.2 Скопировать woff2 в `src/fonts/`, подключить через `next/font/local`: Unbounded 300/400/500/700/900, Spectral 400(+italic)/700, Caveat 400; назначить CSS-переменные семейств
- [ ] 2.3 TDD: бренд-атомы `Fleuron`, `MaterialDot`, `KickerHeader`, `CaveatNote` + DS-вариант Button (radius ≤2px, без тени) — RED-тесты на рендер/стили, затем реализация
- [ ] 2.4 Тест-инвариант DS: поиск hex-литералов и `shadow`/`rounded-*` вне разрешённого набора по `src/components` + `src/app` — зелёный

## 3. Контент-слой

- [ ] 3.1 TDD: типы (`Sku`, `NavItem`, `FooterInfo`) + `content/sku.ts` (7 SKU: N°001–007, имя, латынь, sku-цвет) — тест «SKU ровно 7, номера уникальны»
- [ ] 3.2 TDD: `content/site.ts` (меню 3 пункта, футер: реквизиты-плейсхолдер ИП, дисклеймер дословно, контакты, QR-список без diary, `ozonStoreUrl: null`) — тесты «diary-signup отсутствует в меню/футере», «дисклеймер точный»
- [ ] 3.3 TDD: `lib/utm.ts` (`buildOzonUrl`: `utm_source=site`, опц. `utm_content=sku00X`) — тесты на URL с/без существующих query-параметров

## 4. Каркас сайта

- [ ] 4.1 TDD: `SiteHeader` (wordmark, меню из `content/site.ts`, кнопка Ozon: при `ozonStoreUrl=null` — «Скоро на Ozon» не-ссылка; burger на <lg через Sheet)
- [ ] 4.2 TDD: `SiteFooter` (юр-инфо, дисклеймер, контакты текстом, QR-SVG (переименовать в латиницу при копировании в `public/`), гигантский wordmark)
- [ ] 4.3 Root layout: шрифты, фон bone, SiteHeader/SiteFooter, `metadataBase=https://zazemli.com`, title-шаблон «%s — ЗАЗЕМЛИ»
- [ ] 4.4 Страницы-заглушки `/collectio` «Коллекция», `/lab` «Лаборатория», `/guide` «Гайд», `/diary-signup` (без выдуманной копи; kicker + h1 в DS-стиле); `not-found.tsx`
- [ ] 4.5 SEO: per-page metadata (description, canonical), `sitemap.ts` (4 страницы, без diary), `robots.ts`; `/diary-signup`: `robots noindex`
- [ ] 4.6 E2E smoke: 5 роутов → title/h1, навигация по меню, burger на 360px, 404 для `/nope`, в header/footer нет ссылок на diary-signup

## 5. Cookie-consent и Метрика

- [ ] 5.1 TDD: `CookieBanner` («Принять» / «Только необходимые», выбор в localStorage, повторно не показывается)
- [ ] 5.2 TDD: `lib/metrika.ts` + компонент `Metrika` (грузится только при согласии И `NEXT_PUBLIC_METRIKA_ID`; `reachGoal` — безопасный no-op без счётчика); цель `ozon-click` на кнопке Ozon
- [ ] 5.3 E2E: первый визит — баннер виден, скрипт Метрики не загружен; после «Только необходимые» — скрыт и не грузится

## 6. Главная по Figma 185:2

- [ ] 6.1 Выгрузить тексты всех текстовых нод Figma 185:2 в `content/home.ts` (типизированный `HomeContent`); тест: ключевые строки эталона присутствуют (кикеры II/IV, statement, CTA-строки)
- [ ] 6.2 Секции 1–5: `Hero` (full-bleed слот, fluid clamp), `WhatsInBox` (chalk-фон, опись), `DifferentSoil` (кикер II, колбы-тройка слотами), `WhatSoilGives` (тёмная, photo-slot, accent rule buttercup), `SkuGallery` (кикер IV, 7 карточек из `content/sku.ts`, латынь italic, декоративная «7», линк «Открыть коллекцию →»)
- [ ] 6.3 Секции 6–9: `Statement` (тёмная, ❦), `About`, `Teasers` (ГАЙД/ЛАБОРАТОРИЯ), `OzonCta` (CTA + подпись + кнопка через utm/заглушку)
- [ ] 6.4 Сборка `/` из 9 секций в порядке эталона; изображения-слоты с aspect-ratio (без CLS); дудлы — `currentColor`
- [ ] 6.5 Адаптив 360–1440: колонки складываются, нет горизонтального скролла; e2e-проверка на 360px
- [ ] 6.6 Визуальная сверка с Figma 185:2 на 1440px (скриншот рядом с макетом), правки расхождений

## 7. Верификация и документы

- [ ] 7.1 `npm run build` (static export) зелёный: в `out/` 5 страниц + 404; все unit и e2e тесты зелёные
- [ ] 7.2 Lighthouse на главной (ориентир perf ≥90 до получения бюджета CDO); починить явные провалы
- [ ] 7.3 Обновить документы проекта: CONTEXT.md (журнал + статус), ROADMAP.md (Фаза 0/1 чекбоксы), DEVELOPMENT.md (точные версии стека если разошлись), при необходимости ARCHITECTURE.md
