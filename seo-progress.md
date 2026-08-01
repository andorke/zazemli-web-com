# SEO-прогон: журнал

Прод: https://zazemli.com (VPS, nginx, static export Next.js 16). Начало: 2026-08-01.

## Границы (от пользователя)

- Контент текстов не трогать вообще (уточнение в сессии: «в контенте ничо не трогай») — только техническое SEO: метаданные, sitemap, robots, schema.org, canonical.
- Визуальный дизайн не трогать.
- Деплой только через `scripts/deploy.sh`.
- Конфиг сервера (nginx) не менять.

## Фаза 0 — аудит текущего состояния (2026-08-01)

Проверено: чтение src/app/*, сборка `npm run build` (зелёная, 20 страниц), curl прода.

Уже сделано в проекте (не трогаем, работает):
- title/description на всех страницах; canonical per-page корректны (главная наследует из layout — ок).
- robots.ts и sitemap.ts существуют; на проде оба отдаются 200 (первый таймаут sitemap.xml — разовый глюк локального прокси, повтор — 200 и валидный XML).
- `noindex,nofollow` на /diary-signup и /collectio (redirect-страница) — намеренно, вне sitemap.
- JSON-LD HowTo на /guide (валидный JSON).
- lang="ru", favicon.ico + icon.svg + apple-icon.png, display:swap у self-hosted шрифтов, preload шрифтов и hero-картинки.
- Прод: HTTP→HTTPS 301, HSTS, честный 404 на несуществующих путях, чистые URL резолвятся (nginx try_files настроен).
- Все `<img>` имеют alt (пустой на декоративных — корректно).

Пробелы (план имплементации, уточнится по seo-research.md):
1. OpenGraph/Twitter-метаданных нет ни на одной странице (og:title/description/url/type/locale/site_name/image).
2. Sitemap без lastmod.
3. Нет Organization/WebSite JSON-LD на главной; нет Product + BreadcrumbList на 7 товарных страницах (данные в sku.ts полные: имя, латынь, цены 1890–2590 ₽, объёмы; Ozon-ссылок пока нет → availability аккуратно).
4. 404-страница без собственного title (наследует дефолтный из layout).
5. robots.txt без Яндекс-специфики: нет Clean-param для utm-меток (utm.ts в проекте есть — трафик с метками будет).

Находки вне моих границ (для пользователя, руками):
- CSP на проде (`script-src 'self' 'unsafe-inline'`) блокирует mc.yandex.ru → Яндекс.Метрика на проде не работает. Чинится в nginx (конфиг сервера — не трогаю). Для Яндекс-SEO поведенческие данные важны.
- Регистрация в Google Search Console и Яндекс.Вебмастере — ручные шаги (нужны аккаунты).

## Фаза 1 — research ✅ (2026-08-01)

Два параллельных субагента (Google-часть, Яндекс-часть) → seo-research.md (выводы, применимость к static export, источники; спорное помечено). Ключевые решения по итогам:

- robots.txt не менять: Clean-param для utm не нужна (Яндекс вырезает utm_*/ysclid сам), Host/Crawl-delay мертвы, секция User-agent: Yandex не рекомендуется.
- lastmod в sitemap — честный, из git-дат контента (Google: используется если достоверен; Яндекс: поддерживается). priority/changefreq не добавлять (Google игнорирует).
- Существующий HowTo JSON-LD на /guide оставить: rich results мертвы с 09.2023, но разметка не вредит. Новых FAQPage/HowTo/SearchAction не добавлять.
- Добавить: Organization + WebSite (главная), Product + BreadcrumbList (товарные), OG/Twitter, max-image-preview:large, title у 404, IndexNow-пинг Яндекса в deploy.sh.
- Баланс-решение: og:image — существующий soil-vial.png 600×900 (идеальную обложку 1200×630 заказать дизайнеру — вопрос Насте).

Верификация до правок (baseline): build зелёный (20 страниц), vitest 302/302, линк-чек out/ — 0 битых ссылок и якорей, прод отдаёт HTTPS+HSTS, честный 404, robots.txt и sitemap.xml — 200.
