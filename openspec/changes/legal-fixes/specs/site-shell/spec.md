# site-shell (delta)

## MODIFIED Requirements

### Requirement: Роуты сайта

Система SHALL отдавать: `/`, `/lab`, `/guide`, `/diary-signup`, `/privacy`, `/terms`, редирект-страницу `/collectio` и 7 страниц `/collectio/[slug]` (monstera, ficus, anthurium, aglaonema, spathiphyllum, zamioculcas, epipremnum) — итого 14 контентных роутов плюс страница 404. Сборка `next build` со `output: 'export'` SHALL завершаться успешно и порождать статический HTML для каждого.

#### Scenario: Static export собирается
- **WHEN** выполняется `npm run build`
- **THEN** в `out/` присутствуют HTML главной, lab, guide, diary-signup, privacy, terms, редирект-страницы collectio, семи страниц товара и 404

#### Scenario: Роуты отвечают
- **WHEN** пользователь открывает каждый контентный URL
- **THEN** страница рендерится с корректным `<title>` и единственным `<h1>`

### Requirement: SiteFooter

Футер SHALL повторять структуру футера прототипа `landing.html`: три колонки — (1) wordmark «ЗАЗЕМЛИ» + тэглайн «Земля и забота — всё, что нужно.», (2) «Связь»: Instagram · `@zazemli_collectio`, Telegram · `@zazemli_collectio`, email `team@zazemli.com` (текстом, без иконок), (3) «Разделы»: Коллекция → `/#collectio`, Лаборатория → `/lab`, Гайд → `/guide` — и legal-блок: строка реквизитов «ИП Минетто А. А. · ОГРНИП 326330000022761 · работаем по УСН», «© 2026 ЗАЗЕМЛИ. Информация на сайте не является публичной офертой», ссылки «Политика конфиденциальности» → `/privacy` и «Условия использования сайта» → `/terms`. ИНН и почтовый адрес в футере MUST NOT публиковаться (полные реквизиты — только во врезках `/privacy` и `/terms`). Соцупоминания IG/TG MUST NOT рендериться ложными ссылками (`href="#"` или несуществующий якорь): либо реальный URL профиля, либо текст без `<a>`. QR-блок и гигантский wordmark из прежнего футера MUST NOT рендериться.

#### Scenario: Обязательные элементы футера
- **WHEN** отрендерена любая страница
- **THEN** в футере присутствуют тэглайн, email `team@zazemli.com`, три ссылки разделов, ссылки на `/privacy` и `/terms`, строка «ИП Минетто А. А. · ОГРНИП 326330000022761 · работаем по УСН» и «не является публичной офертой»

#### Scenario: ИНН и адрес не в футере
- **WHEN** отрендерен футер любой страницы
- **THEN** ИНН и почтовый адрес в нём отсутствуют

#### Scenario: Соцссылки не ложные
- **WHEN** отрендерен футер
- **THEN** упоминания IG/TG либо ведут на реальные URL профилей, либо являются текстом; `href="#"` и пустых якорей в футере нет

#### Scenario: Старые блоки удалены
- **WHEN** отрендерен футер
- **THEN** QR-изображений и полноширинного гигантского wordmark в нём нет

### Requirement: SEO-минимум

Каждая контентная страница SHALL иметь title (шаблон «… — ЗАЗЕМЛИ»), description и canonical (`metadataBase` = `https://zazemli.com`). Система SHALL генерировать `sitemap.xml` (12 индексируемых страниц: главная, lab, guide, privacy, terms, 7 страниц товара) и `robots.txt`.

#### Scenario: Метаданные на странице
- **WHEN** открыта `/collectio/monstera`
- **THEN** в `<head>` есть title с суффиксом бренда, description и canonical на `https://zazemli.com/collectio/monstera`

#### Scenario: Sitemap расширен
- **WHEN** сгенерирован `sitemap.xml`
- **THEN** в нём 12 URL (главная, lab, guide, privacy, terms, 7 товаров), без `/collectio` и `/diary-signup`
