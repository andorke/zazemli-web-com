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

## Фаза 2 — имплементация ✅ (2026-08-01, коммит 11c47ed, задеплоено)

Правки (после паузы по команде пользователя доведены до верификации и прода):
- `src/app/layout.tsx` — openGraph (type/locale/siteName/image soil-vial.png), twitter card, robots max-image-preview:large. Проверено на билде: og:title/og:description резолвятся per-page автоматически (Next 16), правки страниц не нужны.
- `src/app/sitemap.ts` — честный lastModified из git-дат файлов контента (execFileSync); тест на lastmod добавлен в sitemap.test.ts, зелёный.
- `src/app/not-found.tsx` — собственный title «Страница не нашлась».
- `src/app/page.tsx` — JSON-LD Organization (logo, email, sameAs из site.ts) + WebSite.
- `src/app/collectio/[slug]/page.tsx` — JSON-LD Product (offers из sizes, RUB, PreOrder) + BreadcrumbList.
- `scripts/deploy.sh` — IndexNow-пинг Яндекса после rsync (URL из out/sitemap.xml, фейл не роняет деплой).
- `public/29ebd8867fd547e41d2648eb988c44b2.txt` — ключ IndexNow.

Дополнительно по ходу верификации: `src/app/privacy/page.tsx` — собственный robots перекрывал layout-версию целиком (shallow merge), max-image-preview:large дублирован туда.

## Верификация фазы 2 — все критерии goal выполнены (2026-08-01)

Локально (до деплоя):
- `npm run build` — зелёный (20 страниц).
- seo-verify.py — 119 проверок OK: title/description/canonical на 11 индексируемых страницах, все уникальны; og:title/og:description/og:image на каждой; JSON-LD парсится; noindex на /diary-signup и /collectio; 404 — свой title; sitemap 11 URL + 11 lastmod, без priority/changefreq; robots.txt валиден; ключ IndexNow в out/.
- vitest — 303/303 (было 302 + тест lastmod), lint и typecheck — чисто.
- Линк-чек по out/ — 0 битых ссылок, 0 битых якорей (15 страниц, включая проверку якорей по id).

Прод (после `scripts/deploy.sh`; IndexNow-пинг Яндекса ответил {"success":true}):
- **Lighthouse 13.4.1 SEO score = 100** (score 1.0): `/`, `/guide`, `/lab`, `/collectio/monstera`. JSON-отчёты — в scratchpad сессии (lh-*.json).
- robots.txt → 200, валиден; sitemap.xml → 200, 11 URL с lastmod; ключ IndexNow отдаётся.
- **validator.schema.org — 0 ошибок**: Organization + WebSite (главная), HowTo (guide, существующий), Product + BreadcrumbList (monstera, zamioculcas). Все типы распознаны, isRendered=true.
- На товарной странице ровно 2 тега `<script type="application/ld+json">` (без дублей; лишние grep-вхождения — строки RSC-пейлоада).

## Ручные шаги (сделать руками владельцу — агенту недоступны аккаунты)

1. **Google Search Console**: Domain property через DNS TXT → сабмит sitemap.xml → URL Inspection / Request indexing для главной и ключевых страниц (повторные запросы не ускоряют).
2. **Яндекс.Вебмастер**: подтвердить права (мета-тег или DNS) → сабмит sitemap → привязать Метрику и включить «Обход по счётчикам» → Региональность: «Нет региона» (продажи через Ozon по всей РФ) → Настройки индексирования → JS-рендеринг: «Не рендерить» (у нас пререндеринг) → прогнать страницы через валидатор микроразметки Вебмастера.
3. **CSP на nginx**: `script-src` не пропускает mc.yandex.ru → Метрика на проде не работает. Для Яндекса это и поведенческие данные, и канал индексации («Обход по счётчикам»). Добавить в CSP: `script-src … https://mc.yandex.ru; img-src … https://mc.yandex.ru; connect-src … https://mc.yandex.ru` (и убедиться, что NEXT_PUBLIC_METRIKA_ID задан на билде). Конфиг сервера — вне границ агента.
4. **Внешние ссылки**: 2–3 живые ссылки на zazemli.com (соцпрофили из sameAs уже помогут: Instagram, Telegram; плюс профильные площадки) — ускоряют первичное обнаружение обеими ПС.
5. **OG-обложка 1200×630** — заказать Насте (сейчас og:image — soil-vial.png 600×900, работает, но кроп неидеален).
6. Когда появятся Ozon-ссылки: заполнить `ozonUrl`/`ozonListingUrl` в sku.ts и сменить availability в Product JSON-LD с PreOrder на InStock (`src/app/collectio/[slug]/page.tsx`).

## Что осознанно НЕ делалось (по границам и research)

- Контент текстов и дизайн — не тронуты (граница пользователя «в контенте ничо не трогай»).
- robots.txt — без изменений: Clean-param для utm не нужна (Яндекс вырезает utm_*/ysclid сам), Host/Crawl-delay мертвы, секция User-agent: Yandex не рекомендуется.
- HowTo на /guide оставлен (rich results мертвы с 09.2023, но разметка валидна и не вредит).
- FAQPage/QAPage/SearchAction не добавлены (FAQ-контента на сайте нет; SearchAction deprecated).
- trailingSlash не менялся: прод уже консистентен на чистых URL без слэша (canonical = sitemap = nginx).
- keywords не добавлены (Google игнорирует, у Яндекса влияние ~нулевое, спам — риск).
