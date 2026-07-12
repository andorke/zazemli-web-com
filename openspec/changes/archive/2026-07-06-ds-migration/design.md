# ds-migration — design

## Context

Каркас site-skeleton реализован и заархивирован: токены v1.0.1, шрифты Unbounded/Spectral/Caveat, header/footer по Figma 185:2. Vault обновил канон: `tokens.json` v1.1.0 (`../zazemli-vault/Айти/Сайт/tokens.json`), типографика Newsreader/Commissioner, контраст-политика moss-ink, вёрстка по HTML-прототипам. Полный контекст и решения брейнсторминга — `docs/superpowers/specs/2026-07-05-site-redesign-design.md`.

## Goals / Non-Goals

**Goals:**
- Токены и шрифты приведены к v1.1.0; сайт собирается и выглядит целостно (в переходной типографике на старых секциях).
- Общие компоненты (topbar, footer, аккордеон, MaterialDot, кнопки) готовы как база для трёх последующих changes.
- ds-lint защищает новую контраст-политику.

**Non-Goals:**
- Перевёрстка секций главной (change `landing-redesign`), страницы товара (`product-pages`), контент /guide и /lab (`guide-lab`).
- Пиксель-перфект старых секций в новых шрифтах — они «переходные» до `landing-redesign`.

## Decisions

1. **Шрифты — variable woff2, self-hosted.** Voice-семейство (оси opsz+wght, roman + italic — 2 файла) и Commissioner (ось wght — 1 файл) скачиваются с Google Fonts и субсетятся (кириллица+латиница+пунктуация) существующим пайплайном репо. `next/font/local` поддерживает variable-оси. Альтернатива — 7 статических экземпляров: больше файлов, теряется opsz; берём variable, откат на статику — если субсеттинг сломает оси.
   **Правка 2026-07-05:** voice-роль временно закрывает **Literata** (дублёр): у Newsreader v1.003 кириллицы нет ни на Google Fonts, ни в upstream Production Type — запись «кириллица полная» в typography.md v2.0 ошибочна, русский текст в прототипах фактически рендерит Georgia-фолбэк. Literata — ближайший editorial-serif (opsz 7–72 ≈ Newsreader 6–72, родная кириллица, variable italic). Финальное voice-семейство — решение Насти; замена = swap woff2 + weight-диапазон в `fonts.ts`.
2. **Роли вместо семейств в именах переменных.** `--font-voice` (Newsreader: заголовки, нарратив, латынь, italic-акценты) и `--font-ui` (Commissioner: кикеры, кнопки, навигация, мелкий UI). Маппинг старого: display(Unbounded)+narrative(Spectral) → voice; ui-роль — новая. Имена по ролям переживут будущие смены семейств.
3. **CaveatNote → RitualNote.** Caveat с веба выведен (tokens v1.1.0). Рукописный акцент в прототипах — `font-style: italic` + акцентный цвет в voice-семействе (класс `.caveat` в прототипах — наследие имени). Атом переименовывается в `RitualNote` (Newsreader italic + цвет), старое имя удаляется. Запрет «italic только Spectral» → «italic только Newsreader».
4. **KickerHeader переезжает на Commissioner** (ui-роль), letter-spacing по прототипам.
5. **moss-ink enforcement через Tailwind-класс-политику.** ds-lint запрещает `text-moss` в `src/` (allowlist: места ≥18pt задокументированы инлайн-комментом `/* ds-allow: moss-large */`); мелкий текст и ссылки — `text-moss-ink`/`text-charcoal`. Плюс запрет упоминаний `--font-unbounded|--font-spectral|--font-caveat`.
6. **Topbar по прототипу**: brand «ЗАЗЕМЛИ» + 3 пункта (Коллекция → `/#collectio`, Лаборатория → `/lab`, Гайд → `/guide`) + бургер <860px. Кнопки Ozon в шапке больше нет (в прототипе отсутствует). Пункт «Коллекция» ведёт на якорь главной — страницы `/collectio` как индекса больше не будет (change `product-pages` заменит её редиректом).
7. **Footer по прототипу**: 3 колонки (brand + тэглайн «Земля и забота — всё, что нужно.»; Связь: IG/TG `@zazemli_collectio`, `team@zazemli.com`; Разделы: те же 3 ссылки) + legal-строка (ИП/ОГРНИП, © 2026, «не является публичной офертой»). QR-блок и гигантский wordmark из старого футера удаляются. Дисклеймер «Растения — не лекарство…» из футера переезжает: глобально не показывается, остаётся на /lab (change `guide-lab`); «весь сайт vs /lab» — в вопросы Насте.
8. **Бургер — упрощение до прототипного паттерна** (toggle-класс, `aria-expanded`), но реализация остаётся на текущем механизме (Sheet/shadcn), перевёрстанном в новые токены — не переизобретаем работающую a11y.

## Risks / Trade-offs

- [Переходный вид старых секций до `landing-redesign`] → осознанно; сборка и тесты зелёные, показ Насте — только после `landing-redesign`.
- [Субсеттинг variable-шрифтов может уронить оси (opsz)] → проверка визуально + `fc-scan`/pyftsubset с `--flavor=woff2 --layout-features='*'`; откат на статические экземпляры.
- [Newsreader/Commissioner могут не иметь полного кириллического покрытия в нужных весах] → **сработал 2026-07-05**: Newsreader без кириллицы вовсе; решение — дублёр Literata (см. правку решения 1), вопрос Насте зафиксирован. Commissioner — покрытие полное.
- [ds-lint allowlist по комментsocket может зарастать] → каждое ds-allow требует причины в комменте; ревью на verify.

## Migration Plan

Однонаправленная миграция в одном change: (1) шрифты + переменные, (2) токены/шкалы, (3) атомы и site-компоненты, (4) ds-lint, (5) прогон тестов + визуальная проверка 5 роутов. Откат — git revert change-коммитов.

## Open Questions

- Полнота кириллицы в variable-экземплярах (проверяется первой задачей; при пробеле — эскалация).
- Замена реквизитного плейсхолдера «ИП Минетто» на реальные ОГРНИП — ждёт Настю (не блокер).
