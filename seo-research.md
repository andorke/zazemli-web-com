# SEO-research: Google и Яндекс, 2025–2026

Собрано параллельными research-агентами 2026-08-01 под этот сайт: русскоязычный контентно-товарный
сайт zazemli.com (Next.js 16 App Router, `output: 'export'`, свой VPS за nginx).
Приоритет источников — первоисточники (developers.google.com/search, web.dev, справка Яндекса);
блоги агентств помечены как вторичные. Спорное помечено «⚠️ спорно».

---

# Часть 1. Google

## 1. Мета-теги и `<head>`

- **`<title>`**: обязателен, уникальный для каждой страницы. Google: «It's important to have distinct text that describes the content of the page in the `<title>` element for each page on your site». Жёсткого лимита длины нет — «the title link is truncated in Google Search results as needed, typically to fit the device width». Рекомендации: описательный и краткий, без повторов ключевых слов, бренд один раз в начале или в конце через разделитель, язык title = язык контента. Google автоматически переписывает title, если он неточный, устаревший или boilerplate. Источник: [Title links](https://developers.google.com/search/docs/appearance/title-link).
  - ⚠️ спорно: «50–60 символов» / «600 px» — цифры из блогов агентств, не из доков Google. Google лимита не называет; ориентир один — влезать в выдачу и быть информативным в начале строки.
  - Текст title участвует в понимании страницы (SEO starter guide называет его среди элементов, влияющих на появление в выдаче), но Google нигде не подтверждает конкретный «вес» title как фактора. Источник: [SEO Starter Guide](https://developers.google.com/search/docs/fundamentals/seo-starter-guide).
- **`meta description`**: НЕ фактор ранжирования — влияет только на сниппет и CTR. Google: «Snippets are primarily created from the page content itself. However, Google sometimes uses the meta description HTML element if it might give users a more accurate description». Лимита длины нет («no limit on how long a meta description can be», обрезается под ширину устройства). Одинаковые описания на всех страницах — вредны: «Identical or similar descriptions on every page of a site aren't helpful». Практика: уникальное описание на каждую страницу, самое важное — в начале. Источник: [Snippets](https://developers.google.com/search/docs/appearance/snippet).
- **`meta keywords`**: мёртв. Google: «The meta-keyword tag is not used by Google Search, and it has no effect on indexing and ranking at all». Не добавлять (Яндекс его тоже давно игнорирует). Источник: [Meta tags Google supports](https://developers.google.com/search/docs/crawling-indexing/special-tags).
- **`lang="ru"` на `<html>`**: для Google НЕ сигнал. «Google Search detects the language of a page based on the textual content of the page. It doesn't rely on code annotations such as the `lang`». Ставить всё равно нужно — для accessibility (скринридеры), браузерных переводчиков и Lighthouse Accessibility. Источник: [там же](https://developers.google.com/search/docs/crawling-indexing/special-tags).
- **`viewport`**: обязателен. «Presence of this tag indicates to Google that the page is mobile friendly» — при mobile-first индексации это база. `width=device-width, initial-scale=1`. Источник: [там же](https://developers.google.com/search/docs/crawling-indexing/special-tags).
- **`rel="canonical"`**: сильный сигнал, но не директива — Google решает сам. Правила: абсолютный URL (не относительный), self-referencing canonical на самой канонической странице, только в `<head>`, один на страницу, без конфликтующих сигналов. Иерархия сигналов каноникализации: редиректы — strong, `rel=canonical` — strong, sitemap — weak. Не использовать `noindex` и robots.txt как способ каноникализации. Источник: [Consolidate duplicate URLs](https://developers.google.com/search/docs/crawling-indexing/consolidate-duplicate-urls).
- **`meta robots`**: единственный надёжный способ закрыть страницу от индекса — `noindex` (мета-тег или заголовок `X-Robots-Tag`), не robots.txt. Полезные значения для контентного сайта: `max-image-preview:large` (крупные превью в выдаче и Discover). Источники: [robots.txt intro](https://developers.google.com/search/docs/crawling-indexing/robots/intro), [Discover](https://developers.google.com/search/docs/appearance/google-discover).
- **hreflang**: для одноязычного ru-сайта не нужен вовсе. Невалидный hreflang — минус балл в Lighthouse SEO, отсутствие — нет.

## 2. robots.txt и sitemap.xml

- **robots.txt управляет краулингом, не индексацией.** Google: «A robots.txt file tells search engine crawlers which URLs the crawler can access» и прямо: «it is not a mechanism for keeping a web page out of Google». Страница под `Disallow` может попасть в индекс по внешним ссылкам (без сниппета). Для запрета индексации — `noindex`, а страница при этом должна быть ДОСТУПНА для краулинга (иначе Google не увидит noindex). Источник: [robots.txt intro](https://developers.google.com/search/docs/crawling-indexing/robots/intro).
- `noindex` внутри robots.txt не поддерживается (Google убрал поддержку в 2019). Источник: [блог Search Central, 2019](https://developers.google.com/search/blog/2019/07/a-note-on-unsupported-rules-in-robotstxt).
- Файл лежит строго в корне хоста (`https://site.ru/robots.txt`), UTF-8. Для маленького контентного сайта достаточно: `User-agent: *` + `Allow: /` + `Sitemap: …`.
- **Sitemap**: XML/RSS/текстовый список URL — Google без предпочтений; UTF-8; лимит 50 МБ / 50 000 URL на файл. Размещать в корне; строка `Sitemap:` в robots.txt — один из официальных способов сабмита (плюс Search Console). Источник: [Build a sitemap](https://developers.google.com/search/docs/crawling-indexing/sitemaps/build-sitemap).
- **`lastmod` учитывается**, но только честный: «Google uses the `<lastmod>` value if it's consistently and verifiably... accurate». Обновлять lastmod надо при значимых изменениях контента, а не на каждый билд (типичная ошибка Next.js-сайтов — `lastModified: new Date()` на все страницы: Google быстро понимает, что lastmod врёт, и перестаёт ему верить). lastmod используется «as a signal for scheduling crawls to URLs that we previously discovered». Источники: [Build a sitemap](https://developers.google.com/search/docs/crawling-indexing/sitemaps/build-sitemap), [Sitemaps ping endpoint is going away](https://developers.google.com/search/blog/2023/06/sitemaps-lastmod-ping).
- **`priority` и `changefreq` Google игнорирует** — дословно: «Google ignores `<priority>` and `<changefreq>` values». Можно не генерировать (Яндекс их тоже фактически не использует). Источник: [там же](https://developers.google.com/search/docs/crawling-indexing/sitemaps/build-sitemap).
- Ping-эндпоинт `google.com/ping?sitemap=...` мёртв с января 2024 — «пинговать» Google после деплоя больше нельзя и не нужно; достаточно robots.txt + GSC. Источник: [блог, июнь 2023](https://developers.google.com/search/blog/2023/06/sitemaps-lastmod-ping).

## 3. Structured data (schema.org JSON-LD)

- **Формат — JSON-LD**: «Google recommends using JSON-LD for structured data if your site's setup allows it». Разметка не гарантирует rich result и не является прямым фактором ранжирования — она даёт eligibility на расширенный сниппет (что растит CTR). Источник: [Intro to structured data](https://developers.google.com/search/docs/appearance/structured-data/intro-structured-data).

### Что реально живо в 2025–2026

- **Article / BlogPosting — да, основной тип для статей.** Обязательных свойств нет; рекомендованы `headline`, `image` (лучше 16x9/4x3/1x1), `datePublished`, `dateModified`, `author` (Person с `name` и `url`). Источник: [Article structured data](https://developers.google.com/search/docs/appearance/structured-data/article).
- **BreadcrumbList — да, но с оговоркой**: с 22 января 2025 хлебные крошки в выдаче показываются только на desktop, на мобильной выдаче вместо них домен. Разметку ставить стоит (помогает Google понять иерархию + десктопная выдача). Требования: `itemListElement` ≥ 2 `ListItem`, у каждого `position`, `name`, `item` (URL; у последнего элемента можно опустить). Размечать «типичный путь пользователя», а не зеркалить структуру URL. Источники: [Breadcrumb](https://developers.google.com/search/docs/appearance/structured-data/breadcrumb), [Search updates changelog](https://developers.google.com/search/updates).
- **Organization — да** (для «Кто за сайтом» и логотипа/панели знаний): `name`, `logo` (≥112x112), `url`, `contactPoint`, `sameAs` (профили в соцсетях). Размещать на главной — одной страницы достаточно. Источник: [Organization](https://developers.google.com/search/docs/appearance/structured-data/organization).
- **WebSite — да, ради site name** в выдаче: «To indicate your site name preference, add `WebSite` structured data to your home page» (`name` + `url`, опционально `alternateName`). Только на корневой странице; Google также смотрит `og:site_name`, `<title>` и заголовки главной. Источник: [Site names](https://developers.google.com/search/docs/appearance/site-names).

### Что мертво или деприоритизировано

- **FAQPage — мертво полностью.** Август 2023 — rich result оставлен только для правительственных/медицинских сайтов; 7 мая 2026 — фича убрана из выдачи совсем, в июне 2026 документация удалена. Ставить FAQPage-разметку ради Google бессмысленно. Сам FAQ-контент на странице — по-прежнему полезен (индексируется, годится для AI Overviews). Источники: [Search updates changelog](https://developers.google.com/search/updates), [блог 2023](https://developers.google.com/search/blog/2023/08/howto-faq-changes).
- **HowTo — мертво с 14 сентября 2023** («this rich result is no longer shown in search results, on both desktop and mobile devices»). Новую HowTo-разметку не делать; пошаговые инструкции оформлять обычным HTML. Источник: [Search updates changelog](https://developers.google.com/search/updates).
- **Sitelinks search box (`SearchAction` в WebSite)** — deprecated октябрь 2024, убран из выдачи 21 ноября 2024. `SearchAction` не добавлять; сам `WebSite` с `name` — оставить. Источник: [Farewell, Sitelinks Search Box](https://developers.google.com/search/blog/2024/10/sitelinks-search-box).
- Июнь 2025 — деприкированы ещё 7 типов (Book actions, Course info, Claim Review, Estimated salary, Learning video, Special announcement, Vehicle listing). Направление: Google сокращает зоопарк rich results. Источники: [Simplifying the search results page](https://developers.google.com/search/blog/2025/06/simplifying-search-results), [changelog](https://developers.google.com/search/updates).
- Уже стоящую «мёртвую» разметку удалять не обязательно — ошибок она не даёт, просто ничего не делает. Источник: [блог 2023](https://developers.google.com/search/blog/2023/08/howto-faq-changes).

### Валидация

- **[Rich Results Test](https://search.google.com/test/rich-results)** — основной инструмент: показывает, какие rich results Google реально видит.
- **[Schema Markup Validator](https://validator.schema.org/)** — синтаксическая валидность любой schema.org-разметки (включая типы, которые Google не показывает).
- После запуска — отчёты «Enhancements» в Search Console.

## 4. Core Web Vitals и Lighthouse

- Три CWV-метрики, пороги «good» (75-й перцентиль реальных пользователей, отдельно mobile/desktop): **LCP ≤ 2.5 c**, **INP ≤ 200 мс** (заменил FID в марте 2024), **CLS ≤ 0.1**. Источник: [web.dev/articles/vitals](https://web.dev/articles/vitals).
- CWV — фактор ранжирования, но слабый: «Core Web Vitals are used by our ranking systems», при этом «Google Search always seeks to show the most relevant content, even if the page experience is sub-par». Прочие page-experience сигналы: HTTPS, mobile-friendliness, отсутствие навязчивых интерстишелов. Источник: [Page experience](https://developers.google.com/search/docs/appearance/page-experience).
  - ⚠️ спорно: формулировка «tiebreaker» — из выступлений сотрудников Google, не из доков.
- **Ранжирование опирается на полевые данные (CrUX), а не на Lighthouse.** INP в лаборатории вообще не измеряется. Следствие для нового маленького сайта: пока трафика мало, страницы могут не попадать в CrUX вовсе — тогда CWV-сигнала по сайту фактически нет (но держать перф хорошим всё равно нужно — задел и UX). Источники: [web.dev/articles/vitals](https://web.dev/articles/vitals), [web.dev/articles/crux](https://web.dev/articles/crux).
- Статический экспорт за nginx сам по себе даёт отличный старт по LCP/INP; главные риски — веб-шрифты и картинки без размеров (CLS), тяжёлый hero-image (LCP).
- **Lighthouse SEO-аудит ≠ ранжирование**: чек-лист базовой «краулимости». Состав SEO-категории (Lighthouse 13): **`is-crawlable` с весом ~31% — провал один роняет категорию**; далее с весом 1: `document-title`, `meta-description`, `http-status-code`, `link-text`, `crawlable-anchors`, `robots-txt`, `image-alt`, `hreflang`, `canonical`; `structured-data` — ручная проверка, вес 0. `viewport` и `font-size` из SEO-категории исключены (LH 12–13). Требуется Node ≥ 22.19 для LH 13. Источники: [Lighthouse SEO docs](https://developer.chrome.com/docs/lighthouse/seo/), [What's new in Lighthouse 13](https://developer.chrome.com/blog/lighthouse-13-0).
- CLI: `npx lighthouse https://site.ru/ --only-categories=seo --output=html --chrome-flags="--headless=new"`; весь сайт — `npx unlighthouse --site https://site.ru`; полевые данные — [PageSpeed Insights](https://pagespeed.web.dev/) и отчёт CWV в Search Console.

## 5. E-E-A-T для YMYL-смежных тем

- «E-E-A-T itself isn't a specific ranking factor», это рамка; **Trust — главный компонент**. Оценки асессоров в ранжирование напрямую не идут. Источник: [Creating helpful content](https://developers.google.com/search/docs/fundamentals/creating-helpful-content).
- Актуальная редакция Quality Rater Guidelines — сентябрь 2025: расширен YMYL, добавлены примеры оценки AI Overviews, закреплён Lowest-рейтинг для low-effort AI-контента без добавленной ценности. Источник: [QRG PDF](https://services.google.com/fh/files/misc/hsw-sqrg.pdf).
- Что реально сделать на маленьком сайте (рамка «Who / How / Why»): авторство и подписи; страница «О нас» и работающие контакты; Organization-разметка с `contactPoint`/`sameAs`; ссылки на авторитетные первоисточники; собственные фото/данные из практики (Experience); видимые даты публикации/обновления + `datePublished`/`dateModified`.

## 6. Специфика Next.js App Router + `output: 'export'`

- **Metadata API полностью работает со static export**: `metadata`/`generateMetadata` выполняются на билде, все теги лежат в `<head>` готового HTML. Источник: [generateMetadata](https://nextjs.org/docs/app/api-reference/functions/generate-metadata).
- **`metadataBase` задать в корневом layout** — canonical и og:image собираются в абсолютные URL.
- Canonical: `alternates: { canonical: '/put' }` на каждой странице (self-referencing).
- **`app/robots.ts` и `app/sitemap.ts` работают при `output: 'export'`** (статические Route Handlers). В sitemap `changeFrequency`/`priority` можно не заполнять, `lastModified` — только честными датами контента. Источники: [Static exports](https://nextjs.org/docs/app/guides/static-exports), [sitemap.xml](https://nextjs.org/docs/app/api-reference/file-conventions/metadata/sitemap).
- **JSON-LD в Metadata API не входит** — вставлять `<script type="application/ld+json">` в компонент (официальный паттерн Next.js, с экранированием `<`). Источник: [Next.js JSON-LD guide](https://nextjs.org/docs/app/guides/json-ld).
- `trailingSlash: true` — рекомендация доков Next для static export за nginx; НО для уже задеплоенного сайта с работающими чистыми URL без слэша смена формата = массовая смена URL. Если nginx уже резолвит чистые URL (`try_files $uri $uri.html`) и canonical/sitemap консистентны — менять не нужно, важна только консистентность формата во всех сигналах. Источник: [Static exports — Deploying](https://nextjs.org/docs/app/guides/static-exports).
- nginx-минимум: честный 404 (`error_page 404 /404.html`), один канонический хост одним 301.
- `next/image` при static export: `unoptimized: true`, размеры руками (CLS), `priority` для hero (LCP), `alt` всегда.

## 7. Индексация и Google Search Console

1. **Подтвердить владение**: Domain property через DNS TXT (покрывает http/https и сабдомены; мета-тег — через `metadata.verification.google`).
2. **Отправить sitemap** в отчёте Sitemaps.
3. **URL Inspection → Request indexing** для главной и ключевых страниц. «Requesting a recrawl multiple times... won't get it crawled any faster».
4. Реалистичные ожидания: «Crawling can take anywhere from a few days to a few weeks». Источник: [Ask Google to recrawl](https://developers.google.com/search/docs/crawling-indexing/ask-google-to-recrawl).

- **Indexing API не для контентных сайтов** (только JobPosting/BroadcastEvent); злоупотребление — отзыв доступа.
- IndexNow Google НЕ использует (это Bing/Яндекс/Seznam/Naver). Источник: [indexnow.org](https://www.indexnow.org/).
- **Внешние ссылки**: для нового домена 2–3 живые ссылки (профильные площадки, соцпрофили из `sameAs`) заметно ускоряют первичное обнаружение. Покупные ссылки — спам-политика.

## 8. OpenGraph / Twitter cards

- **Не фактор ранжирования**, но: `og:site_name` — один из сигналов выбора **имени сайта** в выдаче; `og:image` — «can influence which image is chosen as the thumbnail in Discover» (рекомендация ≥1200 px шириной, 16x9, плюс `max-image-preview:large`). Источники: [Site names](https://developers.google.com/search/docs/appearance/site-names), [Discover](https://developers.google.com/search/docs/appearance/google-discover).
- Главная причина ставить: превью при шаринге (Telegram, WhatsApp, VK, X). Практика: `og:title`, `og:description`, `og:image` (идеал 1200x630), `og:type`, `og:locale: ru_RU`, `og:site_name`; для X — `twitter:card`. Размеры 1200x630 — конвенция платформ (вторично).

## 9. Типичные причины Lighthouse SEO < 100

1. **`is-crawlable`** — случайный `noindex` (вес ~31%, один роняет категорию).
2. **`document-title`** — нет `<title>`.
3. **`meta-description`** — нет description.
4. **`http-status-code`** — страница отдаёт 4xx/5xx (или soft-404).
5. **`robots-txt` invalid** — /robots.txt перекрыт HTML-фоллбэком.
6. **`crawlable-anchors`** — `href="#"`, `javascript:void(0)`, onClick-навигация.
7. **`link-text`** — неописательные анкоры («тут», «click here»).
8. **`image-alt`** — картинки без `alt` (декоративным — пустой `alt=""`).
9. **`canonical` invalid** — относительный/конфликтующий canonical.
10. **`hreflang` invalid** — для одноязычного сайта просто не ставить.

## Сводный чек-лист Google (приоритетный порядок)

1. `metadataBase` + уникальные `title`/`description`; canonical self-referencing; `lang="ru"`. ✅ уже есть на сайте
2. robots.ts + sitemap.ts с честными `lastModified`, без priority/changefreq.
3. nginx: канонический хост, честный 404. ✅ уже настроено
4. JSON-LD: Organization + WebSite на главной, BreadcrumbList; никаких новых FAQPage/HowTo/SearchAction. Валидация Rich Results Test.
5. E-E-A-T: контакты, sameAs; даты.
6. OG/Twitter-теги + `max-image-preview:large`.
7. GSC: domain property, сабмит sitemap, request indexing; 2–3 внешние ссылки для discovery.
8. `npx lighthouse` до SEO=100 по чек-листу п.9.

---

# Часть 2. Яндекс

## 1. robots.txt для Яндекса

- Яндекс поддерживает пять директив: `User-agent` (обязательная), `Disallow`, `Allow`, `Sitemap`, `Clean-param`. Host и Crawl-delay в актуальной справке отсутствуют вовсе. Источник: [справка «robots.txt»](https://yandex.ru/support/webmaster/ru/controlling-robot/robots-txt).
- **Host — мертва с марта 2018.** Главное зеркало определяется только по 301-редиректу. Источники: [анонс](https://webmaster.yandex.ru/blog/301-redirekt-zamenit-direktivu-host-pri-vybore-glavnogo-zerkala), [итог](https://webmaster.yandex.ru/blog/301-y-redirekt-polnostyu-zamenil-direktivu-host).
- **Crawl-delay — не учитывается с 22.02.2018.** Замена — настройка «Скорость обхода» в Вебмастере (дефолт «Доверять Яндексу», трогать не нужно). Источник: [справка](https://yandex.ru/support/webmaster/ru/robot-workings/crawl-delay.html).
- **Clean-param** — директива только Яндекса. Синтаксис: `Clean-param: p0[&p1&...&pn] [path]`, до 500 символов. **Когда НЕ нужна: метки `utm_*`, `ysclid`, `yrclid` Яндекс вырезает автоматически без всяких директив** (прямо указано в справке). Для static export без значимых GET-параметров Clean-param не нужна — достаточно canonical. Источник: [справка «Директива Clean-param»](https://yandex.ru/support/webmaster/robot-workings/clean-param.html).
- **Отдельный блок `User-agent: Yandex` — только если правила реально различаются**: если робот находит секцию `User-agent: Yandex`, секция `User-agent: *` полностью игнорируется (не дополняет). Источник: [справка «User-agent»](https://yandex.com/support/webmaster/en/robot-workings/user-agent.html).
- Вывод для проекта: текущий robots.txt (`User-agent: *` + `Allow: /` + `Sitemap:`) корректен, менять не нужно.

## 2. Яндекс.Вебмастер: первичная настройка нового сайта

1. **Подтвердить права** — мета-тег, HTML-файл в корне или DNS TXT. Источник: [справка](https://yandex.ru/support/webmaster/ru/service/rights).
2. **Отдать sitemap.xml** — через robots.txt и продублировать в Вебмастере (Индексирование → Файлы Sitemap). Яндекс декларирует поддержку `loc`, `lastmod`, `changefreq`, `priority` — ⚠️ спорно: практической пользы от priority/changefreq не зафиксировано, полагаться на `lastmod`. Источник: [справка «Sitemap»](https://yandex.ru/support/webmaster/ru/controlling-robot/sitemap).
3. **Привязать Метрику и включить «Обход по счётчикам»** — робот узнаёт о новых страницах из данных счётчика; у Google аналога нет. Источник: [справка](https://yandex.ru/support/webmaster/ru/indexing-options/link-metrica).
4. **Задать региональность** (или «Нет региона») — раздел 3.
5. **«Оригинальные тексты» — мёртв с сентября 2020.** Первоисточник закрепляется скоростью индексации: «Переобход» + «Обход по счётчикам». Источник: [справка](https://yandex.ru/support/webmaster/ru/service/authored-texts).
6. **«Переобход страниц»** — ручная отправка URL; заявка в очереди до 3 дней, выдача обновляется до двух недель. Дневной лимит на домен. Источник: [справка](https://yandex.ru/support/webmaster/ru/robot-workings/site-reindex).
7. **IndexNow — Яндекс поддерживает** (Google — нет). GET/POST на `https://yandex.com/indexnow` с ключом, размещённым файлом на сайте; для статического сайта удобно дёргать из deploy-скрипта. Источник: [справка «IndexNow»](https://yandex.ru/support/webmaster/ru/indexing-options/index-now).

**ИКС** — индекс качества сайта (аудитория, удовлетворённость, доверие); заменил тИЦ в 2018. Прямым фактором ранжирования не заявлен. Источник: [справка](https://yandex.ru/support/webmaster/site-quality-index.html). ⚠️ спорно: «ИКС влияет на лимит переобхода» — наблюдение сообщества.

## 3. Региональность

- Регион задаётся вручную в Вебмастере (с модерацией) или автоматически из Яндекс Бизнеса. Источник: [справка «Региональность»](https://yandex.ru/support/webmaster/search-results/site-region.html).
- **Информационному сайту регион не обязателен**: официальный статус «Не имеет региональной принадлежности» (Представление в поиске → Региональность → «Нет региона»). Это не штраф. Источник: та же справка.
- Для zazemli.com (товарно-контентный, продажи через Ozon по всей РФ): «Нет региона» — рабочий вариант; при появлении офлайн-точки — Яндекс Бизнес.
- Отличие от Google: у Яндекса региональность — явная настройка и заметный фактор для гео-зависимых запросов.

## 4. Поведенческие факторы

- В Яндексе поведенческие сигналы весят заметно больше, чем в Google (⚠️ спорно по величине, не по направлению; официальной оценки нет). Косвенное подтверждение: «имитация действий пользователей» — отдельное официальное нарушение с жёсткими санкциями. Источник: [справка «Нарушения»](https://yandex.ru/support/webmaster/ru/threats).
- Накрутка ПФ — самый наказываемый приём (пессимизации волнами, вывод из-под фильтра — месяцы). Только белые методы:
  - **Сниппет = CTR**: title/description/фавиконка/быстрые ссылки/микроразметка. Источник: [справка «Представление в поиске»](https://yandex.ru/support/webmaster/ru/recommendations/search-results-presentation).
  - **Соответствие интента**: заголовок обещает то, что страница даёт (иначе pogo-sticking против сайта).
  - **Метрика должна стоять** — источник поведенческих данных и «Обхода по счётчикам». ⚠️ спорно: «без Метрики ранжирование хуже» официально не подтверждено, но счётчик — де-факто стандарт рунета.

## 5. Микроразметка

- **Яндекс поддерживает Schema.org, Open Graph, JSON-LD и микроформаты** (общая страница «Представление в поиске»).
- Подтверждённые JSON-LD-типы: **BreadcrumbList** («используйте микроразметку типа BreadcrumbList в формате JSON-LD»; поля `name`, `url`, `position`; рекомендация — до трёх элементов; показ не гарантируется. Источник: [справка «Навигационные цепочки»](https://yandex.ru/support/webmaster/ru/supported-schemas/navigation-links)) и **QAPage** (мобильная выдача). 
- **FAQPage и HowTo в списке поддерживаемых схем Яндекса отсутствуют** — сниппетов не дают (вреда тоже нет). Перечень поддерживаемого: товары и цены, программы, рецепты, фильмы, вопросы-ответы, организации и адреса, изображения, видео. Источник: [справка «Schema.org»](https://yandex.ru/support/webmaster/ru/schema-org/what-is-schema-org).
- **Товары и цены — поддерживаемый тип** (актуально для 7 товарных страниц).
- **Валидатор микроразметки Яндекса жив** — в Вебмастере, раздел «Инструменты»; проверяет Schema.org/OG/microdata/RDFa «на соответствие требованиям сервисов Яндекса». Сниппет с разметкой — после переобхода, ~2 недели. Источник: [справка «Валидатор»](https://yandex.ru/support/webmaster/ru/yandex-indexing/validator).
- ⚠️ устаревшее: тезис «JSON-LD Яндекс использует только в Почте» — из старой справки; текущая подтверждает JSON-LD для BreadcrumbList/QAPage.

## 6. Мета-теги и сниппеты

- Сниппет собирается из контента, `title`, `description` и внешних источников; description — лишь кандидат, Яндекс чаще Google подставляет свой текст. Шаблонные description отбрасываются. Источник: [справка «Сниппет»](https://yandex.by/support/webmaster/search-results/site-description.html).
- Длины (⚠️ наблюдения блогов, официальных цифр нет): title показывается ~50–55 символов; сниппет ~160 символов; description держать в 150–200.
- **Keywords: Яндекс официально пишет «Может влиять на соответствие страницы поисковым запросам»** — документальное отличие от Google. ⚠️ спорно: практическое влияние ~нулевое, спам — риск; разумно не заполнять. Источник: [справка «HTML-элементы»](https://yandex.ru/support/webmaster/ru/controlling-robot/html).
- Яндекс поддерживает `meta robots`/`X-Robots-Tag`; исторический тег `<noindex>` для фрагментов — только в комментарий-форме, в новой справке не найден (⚠️ спорно).
- **Open Graph Яндекс понимает** (валидатор проверяет; og:video — официальный способ разметки видео). На сниппеты обычного поиска не влияет, нужен для шаринга.
- Фавиконка — часть сниппета (заметно влияет на CTR); обновляется ~2 недели. Быстрые ссылки — автоматически, управляются в Вебмастере.

## 7. Индексация JS-сайтов

- С 11.07.2022 в Вебмастере есть «Рендеринг страниц JavaScript (β)»: «Рекомендую рендерить» / «На усмотрение робота» (дефолт) / «Не рендерить». Официальная рекомендация: **«Запретите рендеринг, если на сайте реализован SSR или пререндеринг»** — static export это пререндеринг. Источник: [справка «Индексирование страниц с JavaScript β»](https://yandex.ru/support/webmaster/ru/yandex-indexing/rendering).
- **Static export — преимущество под Яндекс**: рендеринг JS у Яндекса опциональный, в бете и нестабилен; полный HTML в ответе сервера снимает зависимость от очереди рендеринга.
- Практика: в Вебмастере выставить «Не рендерить»; проверить «Проверкой страницы (β)», что робот видит контент без JS.

## 8. Турбо-страницы

- **Закрыты полностью**: магазины — с 09.03.2023, вся технология — анонс 07.02.2025, с апреля 2025 турбо-версии заменены 301 на оригиналы. Ничего делать не надо. Источник: [официальный пост](https://webmaster.yandex.ru/blog/yandex-stops-supporting-turbo-technology).

## 9. Скорость и мобильность

- **Аналога Core Web Vitals у Яндекса нет.** Скорость влияет опосредованно (отказы → поведенческие).
- **Мобилопригодность — официальный фактор** мобильного поиска с 2016 (алгоритм «Владивосток»). Источник: [блог](https://webmaster.yandex.ru/blog/56b07d3565ef3946137692af). Инструмент «Проверка мобильных страниц» — в Вебмастере.
- Практика: оптимизировать по Google CWV (один бюджет на обе ПС); адаптивная вёрстка обязательна.

## 10. Специфика Яндекса, которую упускают

- **Фильтр МПК («малополезный контент»)** — главный риск информационных сайтов 2024–2026: понижается весь сайт; снятие до 30 дней. Не публиковать тонкие рерайты, каждая страница решает задачу. Источник: [справка](https://yandex.ru/support/webmaster/threats/lowqualitysite.html).
- **Баден-Баден** — фильтр за переоптимизированные тексты (с 2017): переспам ключами наказывается жёстче, чем в Google. Источник: [анонс](https://yandex.ru/blog/webmaster/baden-baden-novyy-algoritm-opredeleniya-pereoptimizirovannykh-tekstov).
- **Апдейты выдачи**: Яндекс медленнее Google реагирует на новое — связка sitemap + Обход по счётчикам + Переобход + IndexNow для него важнее.
- **Зеркала**: www/non-www, http/https — склейка только 301-редиректами (на проде уже настроено).
- **Метрика — не только аналитика**: канал поведенческих данных и обхода; GA её не заменяет.
- **Русская морфология**: вхождения ключей в точной форме не нужны, естественный язык работает лучше (⚠️ консенсус сообщества, официального документа нет).

## Сводный чек-лист Яндекс

1. Вебмастер: подтвердить права → sitemap → Метрика + «Обход по счётчикам» → «Нет региона» → JS-рендеринг «Не рендерить».
2. robots.txt текущий корректен (Clean-param для utm не нужна, Host/Crawl-delay мертвы, отдельная секция Yandex не нужна).
3. JSON-LD: BreadcrumbList (+ Organization, товары) — прогнать через валидатор Вебмастера.
4. IndexNow-пинг в deploy-скрипт.
5. Метрика должна реально работать на проде (сейчас блокируется CSP — см. seo-progress.md).
6. Не делать: Турбо, keywords, накрутку ПФ, переспам ключами.

---

# Сводный план имплементации для zazemli.com (фаза 2)

По итогам обеих частей, с учётом границ (контент и дизайн не трогать, сервер не трогать):

1. **layout.tsx**: openGraph (type, locale ru_RU, siteName, image из существующего ассета), twitter card, `robots: max-image-preview:large`. Каждая индексируемая страница — свой og:title/og:description/og:url.
2. **not-found.tsx**: собственный `<title>`.
3. **sitemap.ts**: честный `lastModified` из git-дат файлов контента (не `new Date()`); priority/changefreq не добавлять.
4. **Главная**: JSON-LD Organization (logo, email, sameAs) + WebSite (site name). Без SearchAction.
5. **Товарные страницы**: JSON-LD Product (name, description, image, brand, offers из sizes с ценами RUB) + BreadcrumbList. 
6. **robots.txt**: без изменений (уже корректен). Существующий HowTo на /guide: оставить (выдачи не даёт, вреда нет).
7. **deploy.sh**: IndexNow-пинг Яндекса после rsync (+ ключ-файл в public/).
8. **Ручные шаги пользователя** (в отчёт): GSC (DNS-верификация, сабмит sitemap, request indexing), Вебмастер (права, sitemap, Метрика, «Обход по счётчикам», «Нет региона», «Не рендерить», валидатор микроразметки), починка CSP для Метрики, 2–3 внешние ссылки.

