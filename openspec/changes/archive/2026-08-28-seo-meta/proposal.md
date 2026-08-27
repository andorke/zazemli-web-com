# seo-meta

## Why

PATCH-1 §5: OG-теги и JSON-LD на сайте отсутствуют полностью (FIX-30) — шаринг и выдача теряют бренд-карточку; соцссылки без UTM не атрибуцируются (FIX-29); `<img>` без srcset/lazy тянет лишние байты на мобильных (FIX-21); колба состава на карточках рендерится битой картинкой — ассета `vial.png` нет в репозитории.

## What Changes

- **OG/Twitter-мета** через `generateMetadata` + `opengraph-image` в layout (title/description уже есть — SEO-минимум site-shell).
- **JSON-LD**: `Organization` на сайте, `Product` на 7 карточках SKU (имя, латынь, объёмы/цены, availability по состоянию Ozon). HowTo гайда — в `guide-v4`, здесь не трогается.
- **UTM на соцссылки** футера (IG/TG): расширение UTM-контракта с Ozon на все внешние ссылки бренда.
- **`next/image` вместо `<img>`** на контентных страницах: `sizes`, lazy, зарезервированные размеры (в static export — `unoptimized`, полная оптимизация придёт с серверным окружением).
- **Ассет колбы**: положить `vial.png` в репозиторий или заменить inline-SVG — битых картинок нет.

## Capabilities

### New Capabilities

_нет_

### Modified Capabilities

- `site-shell`: ADDED — OG-мета и JSON-LD Organization; MODIFIED — UTM-контракт распространяется на соцссылки.
- `product-page`: ADDED — JSON-LD Product на карточках; колба-схема без битых ассетов.

## Impact

- `src/app/layout.tsx` / `opengraph-image`, `generateMetadata` страниц, `lib/utm.ts`, компоненты футера, image-слоты (`next/image`), ассеты.
- Пересечения: sitemap/футер меняются в `legal-fixes` (там — состав, здесь — UTM/OG), делать после него.
