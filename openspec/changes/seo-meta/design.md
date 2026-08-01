# seo-meta — design

## Context

SEO-минимум (title/description/canonical/sitemap/robots) реализован; OG и структурированные данные — нет (FIX-30: «OG-теги и JSON-LD = 0»). Сайт — static export, домен `https://zazemli.com`, `metadataBase` задан.

## Goals / Non-Goals

**Goals:**
- Бренд-карточка при шаринге (OG/Twitter), Organization/Product-разметка из контент-источников.
- Атрибуция соцпереходов (UTM), дисциплина изображений (`next/image`), фикс битой колбы.

**Non-Goals:**
- HowTo гайда (change `guide-v4`), мета-описания из `brief-CDO` (FIX-71 — файл вне prototypes, чужой состав; не входит в патч 1), HSTS (закрыт на nginx — сверить при деплое), Lighthouse-прогон (вне патча 1).

## Decisions

1. **`opengraph-image` — статический файл в layout** (билд-тайм, работает в static export). Динамическая генерация на SKU отклонена: фото SKU ещё в производстве, единый бренд-OG достаточен для волны 1.
2. **JSON-LD — компонентом из контент-данных** (`sku.ts`, контент-модули), не рукописным JSON: разметка не должна расходиться с видимым контентом (тот же принцип, что HowTo в guide-v4).
3. **Product.availability по состоянию `ozonListingUrl`**: `null` → PreOrder без ссылки; URL появится — InStock + offer url через `lib/utm.ts`. Единая точка истины о доступности уже есть в данных.
4. **`next/image` в static export — `images.unoptimized`**: выгода волны 1 — lazy, decoding, дисциплина размеров/CLS и единый компонент; srcset/webp-оптимизация придёт с серверным окружением (VPS-roadmap) без правки вызовов.
5. **Колба — inline-SVG предпочтительнее** восстановления `vial.png`: масштабируется, красится токенами, не тянет ассет; если в vault появится канонный PNG — заменить одной правкой.

## Risks / Trade-offs

- Порядок с `legal-fixes`: оба трогают футер (там состав/не-ложные ссылки, здесь UTM) — выполнять после `legal-fixes`, чтобы UTM вешалась на уже реальные URL профилей.
- `unoptimized`-изображения не дают webp: осознанный компромисс static export; зафиксировать в CONTEXT, чтобы не считалось недоделкой.
