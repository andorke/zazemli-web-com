# site-shell

## ADDED Requirements

### Requirement: Пять роутов MVP
Система SHALL отдавать пять страниц: `/`, `/collectio`, `/lab`, `/guide`, `/diary-signup`. Сборка `next build` со `output: 'export'` SHALL завершаться успешно и порождать статический HTML для каждого роута, плюс страницу 404.

#### Scenario: Static export собирается
- **WHEN** выполняется `npm run build`
- **THEN** в `out/` присутствуют HTML главной, collectio, lab, guide, diary-signup и 404

#### Scenario: Роуты отвечают
- **WHEN** пользователь открывает каждый из 5 URL
- **THEN** страница рендерится с корректным `<title>` и единственным `<h1>`

### Requirement: SiteHeader
Шапка SHALL содержать wordmark «ЗАЗЕМЛИ» (ссылка на `/`), меню из трёх пунктов — «Коллекция» → `/collectio`, «Лаборатория» → `/lab`, «Гайд» → `/guide` — и кнопку «Купить на Ozon». На вьюпортах < lg меню SHALL сворачиваться в burger (Sheet).

#### Scenario: Навигация работает
- **WHEN** пользователь кликает пункт меню «Лаборатория»
- **THEN** открывается `/lab`

#### Scenario: Мобильное меню
- **WHEN** вьюпорт 360px и пользователь нажимает кнопку burger
- **THEN** открывается панель с теми же тремя пунктами и кнопкой Ozon

### Requirement: SiteFooter
Футер SHALL содержать: юр-инфо ИП (ОГРНИП/реквизиты), дисклеймер дословно «Растения — не лекарство. Мы опираемся на исследования о связи контакта с природой и самочувствия, но не обещаем терапевтического эффекта.», контакты текстом (IG/TG `@zazemli_collectio`, email `team@zazemli.com`, без иконок), QR-коды (collectio, lab, guide, instagram — без diary), гигантский wordmark «ЗАЗЕМЛИ».

#### Scenario: Обязательные элементы футера
- **WHEN** отрендерена любая страница
- **THEN** в футере присутствуют дисклеймер (точный текст), email `team@zazemli.com` и wordmark

### Requirement: diary-signup вне навигации и индекса
Ссылки на `/diary-signup` MUST NOT присутствовать в шапке и футере. Страница SHALL иметь `robots: noindex` и MUST NOT входить в sitemap. Вход на страницу — только по QR из печатного дневника.

#### Scenario: Отсутствие в навигации
- **WHEN** отрендерены SiteHeader и SiteFooter
- **THEN** ссылок на `/diary-signup` в них нет

#### Scenario: Noindex
- **WHEN** открыта `/diary-signup`
- **THEN** мета-robots содержит `noindex`, а в `sitemap.xml` URL отсутствует

### Requirement: Заглушки без выдуманной копи
Страницы `/collectio`, `/lab`, `/guide`, `/diary-signup` SHALL рендериться как заглушки: kicker/заголовок из утверждённых названий (Коллекция, Лаборатория, Гайд; для diary — без заголовка-выдумки) в DS-стиле. Произвольные маркетинговые тексты MUST NOT добавляться до получения копи.

#### Scenario: Заглушка рендерится
- **WHEN** открыта `/lab`
- **THEN** страница показывает заголовок «Лаборатория» в DS-типографике и не содержит выдуманных описаний

### Requirement: SEO-минимум
Каждая страница SHALL иметь title (шаблон «… — ЗАЗЕМЛИ»), description и canonical (`metadataBase` = `https://zazemli.com`). Система SHALL генерировать `sitemap.xml` (4 индексируемые страницы) и `robots.txt`.

#### Scenario: Метаданные на странице
- **WHEN** открыта `/collectio`
- **THEN** в `<head>` есть title с суффиксом бренда, description и canonical на `https://zazemli.com/collectio`

### Requirement: UTM-контракт Ozon-ссылок
Все внешние ссылки на Ozon SHALL строиться через `lib/utm.ts` и содержать `utm_source=site`; ссылки конкретного SKU — дополнительно `utm_content=sku00X`. Пока `ozonStoreUrl` равен `null`, кнопки Ozon SHALL рендериться в состоянии «Скоро на Ozon» без внешней ссылки.

#### Scenario: UTM добавляется
- **WHEN** `buildOzonUrl(storeUrl)` вызывается с базовым URL магазина
- **THEN** результат содержит `utm_source=site`

#### Scenario: Магазин ещё не открыт
- **WHEN** `ozonStoreUrl` равен `null` и рендерится кнопка Ozon
- **THEN** кнопка показывает «Скоро на Ozon» и не является ссылкой

### Requirement: Страница 404
Система SHALL отдавать страницу 404 в DS-стиле с навигацией на главную.

#### Scenario: Несуществующий URL
- **WHEN** пользователь открывает `/nope`
- **THEN** рендерится 404-страница со ссылкой на `/`
