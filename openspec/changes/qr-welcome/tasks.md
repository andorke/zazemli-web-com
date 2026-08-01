## 1. Motion-фундамент

- [ ] 1.1 Портировать duration-токены в `globals.css` (`--duration-fast/base/medium/slow/page` = 150/200/300/400/600ms рядом с `--ease-*`) и завести блок entrance-переменных `--welcome-*` (длительность элемента, шаг лесенки, easing) с дефолтами из design D3; дополнить `globals-tokens.test.ts` проверкой наличия. Verify: `npm run test`, `npm run ds-lint`
- [ ] 1.2 Инлайн show-once скрипт в `layout.tsx` (`<head>`, raw script): try/catch sessionStorage, класс `js-welcome` на `<html>` до первой отрисовки; unit-тест логики (первый заход / повторный / storage недоступен). Verify: `npm run test`, в браузере класс присутствует на первом заходе и отсутствует после навигации
- [ ] 1.3 Базовые entrance-утилиты в `globals.css`: keyframes fade-rise (opacity от 0.1, translateY ≤10px), классы каскада с лесенкой задержек, всё под `html.js-welcome` и `@media (prefers-reduced-motion: no-preference)`. Verify: `npm run build`, при reduced-motion и без JS контент полностью видим

## 2. Reveal-примитив для секций ниже фолда

- [ ] 2.1 Клиентский компонент/хук `Reveal` (IntersectionObserver, threshold ~0.1, `unobserve` после срабатывания, добавление класса `in`) + вариант с лесенкой для детей; unit-тест на добавление класса. Verify: `npm run test`

## 3. /guide — флагман «Путь пяти шагов»

- [ ] 3.1 Hero-каскад: kicker → h1 → подзаголовок → CTA; строки h1 в фиксированных спанах, масочный вылет `translateY(110%→0)` только с `lg`, на мобиле fade-rise (design D4, LCP-защита). Verify: `npm run build`, визуально на 1440 и 360
- [ ] 3.2 Линия стадий 01–05: прорисовка `scaleX(0→1)` from left после hero-каскада. Verify: визуально, ds-lint
- [ ] 3.3 Sticky-подсветка текущей стадии при скролле (IO по стадиям, подсветка через background-color/border-color токенами). Verify: скролл по 5 стадиям подсвечивает текущую, unit-тест хука
- [ ] 3.4 Замер Lighthouse mobile /guide до/после: LCP регистрируется, деградация ≤0.2s, CLS < 0.1; при провале — отключить маску и на десктопе. Verify: отчёт замера в комментарии задачи

## 4. /lab — «Рецепт собирается»

- [ ] 4.1 Hero-каскад: kicker → заголовок → строка показателей «7 рецептур · 11 компонентов». Verify: визуально на 1440 и 360
- [ ] 4.2 Полоски долей в `RecipeCard`: статичная ширина по доле, прорисовка `scaleX(0→1)` from left при раскрытии `<details>` и при первом появлении. Verify: раскрытие рецептуры прорисовывает полоски, ds-lint
- [ ] 4.3 Плитки 11 компонентов лесенкой через `Reveal` при входе сетки в вьюпорт. Verify: визуально при доскролле

## 5. Главная — каскад коллекции

- [ ] 5.1 Каскад карточек SkuGallery (opacity + translateY, шаг ~70ms): триггер по `location.hash === '#collectio'` при монтировании, иначе IO при доскролле; show-once гейт общий. Verify: заход на `/collectio` (редирект) запускает каскад, обычный заход + доскролл — тоже, повторная навигация — без каскада

## 6. /diary-signup — «Разворот письма»

- [ ] 6.1 Каскад ack → h1 → подзаголовок → цитата-подарок → форма (последней), суммарно ≤1s; форма фокусируема с момента появления. Verify: e2e-проверка фокуса поля во время/после каскада
- [ ] 6.2 Точки таймлайна 7 писем лесенкой через `Reveal`. Verify: визуально при доскролле

## 7. Cursor-companion «кольцо мха»

- [ ] 7.1 Компонент слоя в `layout.tsx`: fixed-слой `pointer-events: none` + `aria-hidden`, кольцо мха 10–12px, rAF-цикл с lerp ~0.15 и остановкой в простое, гейт `@media (hover:hover) and (pointer:fine)` + `pointerType === 'mouse'`, reduced-motion не монтирует слой (+подписка на change). Verify: unit-тесты гейтов, визуально на десктопе
- [ ] 7.2 Click-burst: кольцо + 3–5 точек-семян из пула ≤8, возврат по `animationend`, только в зонах `data-fx`, guard `closest('a,button,input,label,summary,form')`. Verify: unit-тест guard'а, клик по OzonButton/ссылкам работает без задержки
- [ ] 7.3 Tap-ripple: `pointerdown` (touch) в зонах `data-fx`, `{passive: true}`, гашение по `pointercancel`, `touch-action` не трогаем. Verify: на мобильном вьюпорте тап даёт рябь, свайп-скролл — нет
- [ ] 7.4 Разметить зоны `data-fx` (hero и повествовательные секции 4 страниц + главной); форма `/diary-signup` и все CTA — вне зон. Verify: клики по интерактиву нигде не спавнят эффект

## 8. Сквозная верификация

- [ ] 8.1 e2e (Playwright, desktop 1440 + mobile 360): все 4 входа показывают встречу на первом заходе; повторная навигация — без встречи; эмуляция `prefers-reduced-motion` — контент статичен и полностью видим; `?src=qr` не ломает страницы. Verify: `npm run test:e2e`
- [ ] 8.2 Финальный прогон: `npm run build`, `npm run ds-lint`, `npm run test`, `npm run test:e2e` — всё зелёное; сверить бандл-дельту (JS слоя ≤ ~5КБ). Verify: вывод команд в отчёте
