# site-shell — delta (product-pages)

## MODIFIED Requirements

### Requirement: Пять роутов MVP
Система SHALL отдавать страницы: `/`, `/lab`, `/guide`, `/diary-signup`, 7 страниц `/collectio/[slug]` и редирект-страницу `/collectio`. Сборка `next build` со `output: 'export'` SHALL завершаться успешно и порождать статический HTML для каждого роута, плюс страницу 404.

#### Scenario: Static export собирается
- **WHEN** выполняется `npm run build`
- **THEN** в `out/` присутствуют HTML главной, lab, guide, diary-signup, редирект-страницы collectio, семи страниц товара и 404

#### Scenario: Роуты отвечают
- **WHEN** пользователь открывает каждый контентный URL
- **THEN** страница рендерится с корректным `<title>` и единственным `<h1>`

### Requirement: Заглушки без выдуманной копи
Страницы `/lab`, `/guide`, `/diary-signup` SHALL рендериться как заглушки: kicker/заголовок из утверждённых названий (Лаборатория, Гайд; для diary — без заголовка-выдумки) в DS-стиле. Произвольные маркетинговые тексты MUST NOT добавляться до получения копи. (`/collectio` заглушкой больше не является — это редирект-страница.)

#### Scenario: Заглушка рендерится
- **WHEN** открыта `/lab`
- **THEN** страница показывает заголовок «Лаборатория» в DS-типографике и не содержит выдуманных описаний

### Requirement: SEO-минимум
Каждая контентная страница SHALL иметь title (шаблон «… — ЗАЗЕМЛИ»), description и canonical (`metadataBase` = `https://zazemli.com`). Система SHALL генерировать `sitemap.xml` (индексируемые страницы: главная, lab, guide, 7 страниц товара — без diary-signup и без редирект-страницы `/collectio`) и `robots.txt`.

#### Scenario: Метаданные страницы товара
- **WHEN** открыта `/collectio/monstera`
- **THEN** в `<head>` есть title с суффиксом бренда, description и canonical на `https://zazemli.com/collectio/monstera`

#### Scenario: Sitemap расширен
- **WHEN** сгенерирован `sitemap.xml`
- **THEN** в нём 10 URL (главная, lab, guide, 7 товаров), без `/collectio` и `/diary-signup`

## ADDED Requirements

### Requirement: Клиентский редирект /collectio
Страница `/collectio` SHALL мгновенно перенаправлять на `/#collectio` клиентскими средствами: `<meta http-equiv="refresh" content="0;url=/#collectio">` + `location.replace('/#collectio')`, SHALL содержать `noindex` и canonical на `/`. Печатный QR партии 0, зашитый на `zazemli.com/collectio`, SHALL приводить пользователя к секции коллекции на главной без участия серверной конфигурации.

#### Scenario: Редирект срабатывает
- **WHEN** пользователь открывает `/collectio` в браузере
- **THEN** он оказывается на `/#collectio` (секция галереи главной)

#### Scenario: Редирект-страница вне индекса
- **WHEN** отрендерена `/collectio`
- **THEN** мета-robots содержит `noindex`, canonical указывает на `/`
