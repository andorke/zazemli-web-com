# План разработки

> Высокоуровневые фазы. Детальные подзадачи живут в OpenSpec changes, не здесь.

> **Пример заполнения:** `example_docs/ROADMAP.md`

## Обзор фаз
| Фаза | Название | Статус |
|------|----------|--------|
| 0    | Настройка проекта | ✅ Готово |
| 1    | Дизайн-система + каркас + главная | ✅ Реализовано (ожидает verify/archive) |
| 2    | Контентные страницы (по готовности от Насти) | ⏸️ Ожидает |
| 3    | Релиз: QA, хостинг, аналитика | ⏸️ Ожидает |
| 4    | Post-MVP: каталог, Sanity, магазин | ⏸️ Ожидает |

## Фаза 0: Настройка проекта
- [x] Репозиторий инициализирован (scaffold)
- [x] Документы заполнены (AGENTS, CONTEXT, REQUIREMENTS, DEVELOPMENT, ARCHITECTURE, ROADMAP)
- [x] git init + первый коммит
- [x] Стек развёрнут (`create-next-app` + Tailwind + shadcn), `npm run build` зелёный
- [x] Первая фича описана через `/opsx:propose`

## Фаза 1: Дизайн-система + каркас + главная
- [x] DS-фундамент: токены → CSS-переменные/Tailwind-тема, 3 шрифта через `next/font/local`, бренд-атомы
- [x] Каркас: 5 роутов, SiteHeader + SiteFooter, заглушки 4 страниц, 404, cookie-баннер + consent-gate Метрики, SEO-минимум (title/description/canonical/sitemap/robots)
- [x] Главная по Figma 185:2: 9 секций, тексты из Figma, слоты под иллюстрации без CLS
- [x] Тесты зелёные (unit + e2e smoke), static export собирается

## Фаза 2: Контентные страницы
- [ ] `/collectio` — витрина 7 SKU (по Figma от Насти)
- [ ] `/lab` — 11 компонентов грунта (+ MaterialDot)
- [ ] `/guide` — 5 шагов + Schema.org HowTo
- [ ] `/diary-signup` — форма: react-hook-form + zod, чекбокс 152-ФЗ, выбор email-провайдера
- [ ] Иллюстрации главной от Насти — в готовые слоты

## Фаза 3: Релиз
- [ ] Хостинг и домен выбраны, деплой настроен; `zazemli.space` → 301
- [ ] Я.Метрика: счётчик + 7 целей воронки
- [ ] Pre-publish QA по `pre-publish-qa.md` (10 категорий, sign-off)
- [ ] Lighthouse-бюджет подтверждён

## Фаза 4: Post-MVP (по бэклогу фаундера)
- [ ] `/collectio/[plant]` — 7 карточек SKU (SKU-цвета, Ozon per-SKU)
- [ ] Sanity CMS — миграция контента
- [ ] `/about`, `/snova/[plant]`-редиректы, email-серия
- [ ] Магазин (v2, ~6 мес)
