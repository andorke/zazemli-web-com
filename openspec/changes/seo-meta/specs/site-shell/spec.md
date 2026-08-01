# site-shell — delta (seo-meta)

## ADDED Requirements

### Requirement: OG-мета и JSON-LD Organization

Каждая индексируемая страница SHALL отдавать Open Graph-мета (og:title, og:description, og:url, og:image через `opengraph-image` в layout) и Twitter-карточку. Сайт SHALL содержать JSON-LD Schema.org `Organization` (имя «ЗАЗЕМЛИ», url `https://zazemli.com`, email `team@zazemli.com`) — один раз, в layout. Данные разметки SHALL браться из тех же контент-источников, что и видимый контент.

#### Scenario: OG на странице товара
- **WHEN** отрендерена `/collectio/monstera`
- **THEN** в `<head>` есть og:title/og:description/og:url и og:image с абсолютным URL

#### Scenario: Organization в layout
- **WHEN** отрендерена любая страница
- **THEN** присутствует ровно один script `application/ld+json` типа Organization

## MODIFIED Requirements

### Requirement: UTM-контракт Ozon-ссылок

Все внешние ссылки на Ozon SHALL строиться через `lib/utm.ts` и содержать `utm_source=site`; ссылки конкретного SKU — дополнительно `utm_content=sku00X`. Пока `ozonStoreUrl` равен `null`, кнопки Ozon SHALL рендериться в состоянии «Скоро на Ozon» без внешней ссылки. Ссылки на соцсети бренда (Instagram, Telegram) в футере SHALL также строиться через `lib/utm.ts` с UTM-разметкой (FIX-29); внешние ссылки бренда без UTM MUST NOT добавляться.

#### Scenario: UTM добавляется
- **WHEN** `buildOzonUrl(storeUrl)` вызывается с базовым URL магазина
- **THEN** результат содержит `utm_source=site`

#### Scenario: Магазин ещё не открыт
- **WHEN** `ozonStoreUrl` равен `null` и рендерится кнопка Ozon
- **THEN** кнопка показывает «Скоро на Ozon» и не является ссылкой

#### Scenario: Соцссылки с UTM
- **WHEN** в футере отрендерены ссылки IG/TG (при наличии реальных URL профилей)
- **THEN** их href содержит `utm_source=site`
