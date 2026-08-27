# product-page — delta (seo-meta)

## ADDED Requirements

### Requirement: JSON-LD Product на карточках SKU

Каждая из 7 страниц `/collectio/[slug]` SHALL содержать JSON-LD Schema.org `Product` из данных `sku.ts`: name (имя растения + латынь рода), description, offers по размерам (объём, цена в RUB); availability SHALL отражать состояние магазина (PreOrder/подобное, пока Ozon закрыт; InStock со ссылкой — после открытия). Разметка MUST NOT расходиться с видимым контентом страницы.

#### Scenario: Product на монстере
- **WHEN** отрендерена `/collectio/monstera`
- **THEN** присутствует script `application/ld+json` типа Product с offers по трём объёмам и ценами, совпадающими с видимыми

### Requirement: Колба-схема без битых ассетов

Колба-схема процентов в блоке «Зачем именно эта земля» SHALL рендериться без битых изображений: ассет колбы присутствует в репозитории либо заменён inline-SVG (посылка «ассета `assets/vial.png` в репо нет» при реализации не подтвердилась — такого пути в коде нет вовсе, колба собрана из `public/soil-vial.png` + маски `soil-vial-mask.png`; выполняется первая ветка требования).

#### Scenario: Колба рендерится
- **WHEN** отрендерена любая страница товара
- **THEN** запрос изображения колбы не отдаёт 404 (или колба — inline-SVG); видимой битой картинки нет
