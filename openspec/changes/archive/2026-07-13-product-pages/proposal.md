# product-pages

## Why

Клик-путь покупателя мёртв: карточки коллекции ведут в никуда, а печатный QR партии 0 (листовки и дневники уже в печати) зашит на `zazemli.com/collectio`. Vault закрыл оба пробела: 7 прототипов страниц товара `collectio-*.html` + канон `product-description.md` v1.1.1 + решение «голый `/collectio` = редирект на `/#collectio`» (страницы-индекса нет, коллекция живёт на главной).

## What Changes

- Новый динамический роут `/collectio/[slug]` ×7 (monstera, ficus, anthurium, aglaonema, spathiphyllum, zamioculcas, epipremnum) со `generateStaticParams` (static export).
- Единый шаблон страницы по прототипам: hero (kicker + «Заземли {растение}.» + латынь + CTA + цена) → «Зачем именно эта земля» (+ SourceNote с рецензируемым источником + колба-схема % + мост «Весь состав и источники → в лаборатории») → состав по компонентам (MaterialDot) → «Что в боксе» → «Уход мы расписали за тебя» (+ дневник-панель) → Ритуал (RitualNote-фраза SKU) → buybar (размер-селектор → «Купить {размер} на Ozon») → founder-quote «Для тех, кто создаёт цифровое, а руками тянется к земле.» → футер-мост «← Вся коллекция».
- **BREAKING**: страница-заглушка `/collectio` заменяется клиентским редиректом на `/#collectio` (meta refresh + `location.replace` + canonical на `/`) — печатный QR работает на любом статик-хостинге.
- Данные 7 SKU в `src/content/sku.ts` расширяются: колба-%, состав, объёмы/цены, care-тексты, ритуал-фразы (источники: `product-description.md` v1.1.1 + прототипы).
- Карточки галереи главной переключаются с временного `#collectio` на реальные `/collectio/[slug]`.
- SKU-цвет страницы — только декор (бордеры, точки, ритуал-фраза); текст и кнопки — moss-ink/charcoal; на странице ровно один SKU-цвет.

## Capabilities

### New Capabilities

- `product-page`: 7 статических страниц товара — структура блоков, источники контента, SKU-цвет-политика, размер-селектор и Ozon-CTA, SourceNote, дневник-панель.

### Modified Capabilities

- `site-shell`: набор роутов — `/collectio` из заглушки становится клиентским редиректом на `/#collectio`, добавляются 7 страниц `/collectio/[slug]`; sitemap расширяется страницами товара; требование «Заглушки без выдуманной копи» сужается до `/lab`, `/guide`, `/diary-signup`.

## Impact

- `src/app/collectio/page.tsx` (заглушка → редирект), новый `src/app/collectio/[slug]/page.tsx`.
- Новые компоненты `components/sections/product/*`; переиспользование атомов ds-migration (MaterialDot, details-аккордеон, RitualNote, кнопки).
- `src/content/sku.ts` — основной рост данных; типы готовят миграцию на CMS.
- `lib/utm.ts` — без изменений (utm_content=sku00X уже поддержан).
- Тесты: unit (7 slug, инварианты данных), e2e (страницы, редирект, переключение карточек галереи).
- Зависит от: `ds-migration` (атомы/токены); мягко от `landing-redesign` (переключение href карточек — заключительная задача). Архивировать до `guide-lab` (оба модифицируют «Заглушки» site-shell).
