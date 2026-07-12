# site-shell

## Purpose

Каркас сайта ЗАЗЕМЛИ: полный набор роутов MVP под static export (главная, 7 страниц товара + редирект-страница коллекции, лаборатория, гайд, дневник-форма, политика конфиденциальности), общие SiteHeader и SiteFooter, `/diary-signup` скрыт от навигации и индекса, SEO-минимум, UTM-контракт Ozon-ссылок и страница 404.

## Requirements

### Requirement: Роуты сайта
Система SHALL отдавать: `/`, `/lab`, `/guide`, `/diary-signup`, `/privacy`, редирект-страницу `/collectio` и 7 страниц `/collectio/[slug]` (monstera, ficus, anthurium, aglaonema, spathiphyllum, zamioculcas, epipremnum) — итого 13 контентных роутов плюс страница 404. Сборка `next build` со `output: 'export'` SHALL завершаться успешно и порождать статический HTML для каждого.

#### Scenario: Static export собирается
- **WHEN** выполняется `npm run build`
- **THEN** в `out/` присутствуют HTML главной, lab, guide, diary-signup, privacy, редирект-страницы collectio, семи страниц товара и 404

#### Scenario: Роуты отвечают
- **WHEN** пользователь открывает каждый контентный URL
- **THEN** страница рендерится с корректным `<title>` и единственным `<h1>`

### Requirement: SiteHeader
Шапка SHALL содержать wordmark «ЗАЗЕМЛИ» (ссылка на `/`) и меню из трёх пунктов — «Коллекция» → `/#collectio`, «Лаборатория» → `/lab`, «Гайд» → `/guide` — по topbar прототипа `landing.html`. Кнопку Ozon шапка MUST NOT содержать. На вьюпортах < 860px меню SHALL сворачиваться в burger с `aria-expanded`/`aria-controls`.

#### Scenario: Навигация работает
- **WHEN** пользователь кликает пункт меню «Лаборатория»
- **THEN** открывается `/lab`

#### Scenario: Коллекция ведёт на якорь главной
- **WHEN** пользователь кликает «Коллекция» с любой страницы
- **THEN** он попадает на `/#collectio` (секция галереи на главной)

#### Scenario: Мобильное меню
- **WHEN** вьюпорт 360px и пользователь нажимает кнопку burger
- **THEN** открывается панель с теми же тремя пунктами; `aria-expanded` переключается

### Requirement: SiteFooter
Футер SHALL повторять структуру футера прототипа `landing.html`: три колонки — (1) wordmark «ЗАЗЕМЛИ» + тэглайн «Земля и забота — всё, что нужно.», (2) «Связь»: Instagram · `@zazemli_collectio`, Telegram · `@zazemli_collectio`, email `team@zazemli.com` (текстом, без иконок), (3) «Разделы»: Коллекция → `/#collectio`, Лаборатория → `/lab`, Гайд → `/guide` — и legal-строку (реквизиты ИП/ОГРНИП, «© 2026 ЗАЗЕМЛИ», «Информация на сайте не является публичной офертой», ссылка «Политика конфиденциальности» → `/privacy`). QR-блок и гигантский wordmark из прежнего футера MUST NOT рендериться. Глобальный дисклеймер «Растения — не лекарство…» из футера удаляется (остаётся на `/lab`, см. capability `lab-page`).

#### Scenario: Обязательные элементы футера
- **WHEN** отрендерена любая страница
- **THEN** в футере присутствуют тэглайн, email `team@zazemli.com`, три ссылки разделов, ссылка на `/privacy` и legal-строка с «не является публичной офертой»

#### Scenario: Старые блоки удалены
- **WHEN** отрендерен футер
- **THEN** QR-изображений и полноширинного гигантского wordmark в нём нет

### Requirement: diary-signup вне навигации и индекса
Ссылки на `/diary-signup` MUST NOT присутствовать в шапке и футере. Страница SHALL иметь `robots: noindex` и MUST NOT входить в sitemap. Вход на страницу — только по QR из печатного дневника.

#### Scenario: Отсутствие в навигации
- **WHEN** отрендерены SiteHeader и SiteFooter
- **THEN** ссылок на `/diary-signup` в них нет

#### Scenario: Noindex
- **WHEN** открыта `/diary-signup`
- **THEN** мета-robots содержит `noindex`, а в `sitemap.xml` URL отсутствует

### Requirement: Роут /privacy и доступность политики
Система SHALL отдавать индексируемый статический роут `/privacy` (собирается `next build` в `output: 'export'`, входит в `sitemap.xml`, canonical на `https://zazemli.com/privacy`, `robots` разрешает индексацию). Ссылка на политику конфиденциальности SHALL присутствовать в двух глобальных местах: (1) legal-строка футера каждой страницы; (2) текст cookie-баннера.

#### Scenario: Роут собирается и индексируется
- **WHEN** выполняется `npm run build`
- **THEN** в `out/` присутствует HTML `/privacy`, URL входит в `sitemap.xml`, мета-robots страницы не содержит `noindex`

#### Scenario: Ссылка на политику в футере
- **WHEN** отрендерена любая страница
- **THEN** в legal-строке футера есть ссылка «Политика конфиденциальности» на `/privacy`

#### Scenario: Ссылка на политику в cookie-баннере
- **WHEN** отрендерен cookie-баннер
- **THEN** его текст содержит ссылку на `/privacy`

### Requirement: Клиентский редирект /collectio
Страница `/collectio` SHALL мгновенно перенаправлять на `/#collectio` клиентскими средствами: `<meta http-equiv="refresh" content="0;url=/#collectio">` + `location.replace('/#collectio')`, SHALL содержать `noindex` и canonical на `/`. Печатный QR партии 0, зашитый на `zazemli.com/collectio`, SHALL приводить пользователя к секции коллекции на главной без участия серверной конфигурации.

#### Scenario: Редирект срабатывает
- **WHEN** пользователь открывает `/collectio` в браузере
- **THEN** он оказывается на `/#collectio` (секция галереи главной)

#### Scenario: Редирект-страница вне индекса
- **WHEN** отрендерена `/collectio`
- **THEN** мета-robots содержит `noindex`, canonical указывает на `/`

### Requirement: MVP укомплектован контентом
Все контентные страницы MVP (`/`, `/lab`, `/guide`, `/diary-signup`, `/privacy`, 7 страниц `/collectio/[slug]`) SHALL рендерить реальный контент по своей capability-специи — переходного состояния «заглушка без копи» в системе больше нет. `/collectio` — не заглушка и не контентная страница, а клиентский редирект (см. Requirement «Клиентский редирект /collectio»).

#### Scenario: Контент на месте
- **WHEN** отрендерена любая контентная страница MVP
- **THEN** она показывает реальный контент по своей capability-специи, а не заглушку с одним заголовком

### Requirement: SEO-минимум
Каждая контентная страница SHALL иметь title (шаблон «… — ЗАЗЕМЛИ»), description и canonical (`metadataBase` = `https://zazemli.com`). Система SHALL генерировать `sitemap.xml` (11 индексируемых страниц: главная, lab, guide, privacy, 7 страниц товара) и `robots.txt`.

#### Scenario: Метаданные на странице
- **WHEN** открыта `/collectio/monstera`
- **THEN** в `<head>` есть title с суффиксом бренда, description и canonical на `https://zazemli.com/collectio/monstera`

#### Scenario: Sitemap расширен
- **WHEN** сгенерирован `sitemap.xml`
- **THEN** в нём 11 URL (главная, lab, guide, privacy, 7 товаров), без `/collectio` и `/diary-signup`

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
