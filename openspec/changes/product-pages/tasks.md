# product-pages — tasks

## 1. Данные SKU

- [x] 1.1 Расширить типы и данные `src/content/sku.ts`: колба-%, состав (компонент + material-цвет), бокс, care, ритуал-фраза, размеры/цены (`ozonListingUrl: null`), source-note — из `product-description.md` v1.1.1 (hero — вариант A) + прототипов `collectio-*.html`; расхождения — в вопросы Насте
- [x] 1.2 Unit-тест инвариантов: SKU=7, slug уникальны, сумма % колбы = 100, цены > 0 — зелёный

## 2. Шаблон страницы

- [ ] 2.1 Роут `app/collectio/[slug]/page.tsx` + `generateStaticParams` (7 slug), метаданные (title/description/canonical), 404 на неизвестный slug
- [ ] 2.2 Секции шаблона: hero (kicker, H1 «Заземли {растение}.», латынь, CTA, цены) и «Зачем именно эта земля» (+ SourceNote-аккордеон, колба-%, мост на /lab)
- [ ] 2.3 Секции: состав с MaterialDot, «Что в боксе», care-блок с дневник-панелью, Ритуал (RitualNote)
- [ ] 2.4 Buybar: клиентский размер-селектор (объём/цена/CTA-текст), состояние «Скоро на Ozon» при `null`, UTM `utm_content=sku00X` при URL
- [ ] 2.5 Founder-quote («…а руками тянется к земле») + футер-мост «← Вся коллекция» на `/#collectio`
- [ ] 2.6 SKU-цвет: переменная `--sku` на корне страницы, применение только в декоре; ds-lint-инвариант «один SKU-цвет на страницу»

## 3. Редирект и интеграция

- [ ] 3.1 e2e: открытие `/collectio` приводит на `/#collectio`; noindex + canonical на `/` — красный → заменить заглушку `/collectio` редирект-страницей — зелёный
- [ ] 3.2 Переключить карточки галереи главной с `#collectio` на `/collectio/[slug]` (перевернуть TODO-тест landing-redesign)
- [ ] 3.3 Обновить sitemap: +7 страниц товара, без `/collectio` и `/diary-signup`

## 4. Верификация

- [ ] 4.1 e2e: все 7 страниц открываются (smoke по каждой: h1, мост на /lab, buybar), один h1 на страницу
- [ ] 4.2 Визуальная сверка 2–3 страниц с прототипами (monstera, zamioculcas — контраст-риск buttercup, anthurium) на 1440px; адаптив 360px
- [ ] 4.3 Полный прогон unit + e2e + static export + ds-lint; обновить CONTEXT.md и вопросы Насте (A/B hero, формат N°)
